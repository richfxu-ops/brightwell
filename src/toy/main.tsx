// The Toy Morning — a React dashboard over the real engine. No game logic lives
// here: every rule answer comes from morning.ts/effects.ts, and the pour preview
// is a throwaway playPiece call diffed against the current state (the engine is
// pure). Layout follows design/handoff/toy-morning-ui/ (the redesign of record).
// Bundled by scripts/build-toy.mjs into the codex's Toy Morning section.

import { StrictMode, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { type Card, type Effect, isReadExpr, type ReadSource } from "../engine/vocabulary.js";
import { createInitialState, currentNode, type GameEvent, type GameState } from "../engine/state.js";
import {
  DAWN_BASE, dawn, dusk, playPiece, STALL_ROOM_FACTOR, stallAction,
  type MorningContext, type MorningResult,
} from "../engine/morning.js";
import { chainMultiplier, SEAT_DECAY, SEAT_FIRST } from "../engine/effects.js";
import { evaluateRead } from "../engine/reads.js";
import starterPool from "../content/cards/starter-pool.json" with { type: "json" };

const CARDS = new Map((starterPool.cards as unknown as Card[]).map(c => [c.id, c]));
const ctx: MorningContext = { cardOf: id => CARDS.get(id)! };
const readCtx = { grainOf: (id: string) => CARDS.get(id)!.grain };
const DECKS = ["apprentice", "kilnfast", "eveners", "untold", "fairwrights", "mannerly", "gleaners"] as const;
const LEG_NAMES = ["Green Going", "Long Light", "Deep Gold", "Red Walk", "the Wintering"];
const NEED_BY_LEG = [1, 3, 5, 7, 7];
const r1 = (n: number): string => (Math.round(n * 10) / 10).toString();
const seatContribution = (index: number): number => SEAT_FIRST * SEAT_DECAY ** index;
const grainVar = (g: string): string => `var(--${g})`;
const fillsNeed = (c: Card): boolean => c.effects.some(e => e.do === "fill");
// Ways whose teaching bundle carries a fill card — derived from the pool, not hardcoded
const FILL_WAYS = [...new Set((starterPool.cards as unknown as Card[])
  .filter(c => c.archetype != null && fillsNeed(c))
  .map(c => c.archetype![0].toUpperCase() + c.archetype!.slice(1)))];

// ---------- run state (immutable snapshots; every action = one engine call) ----------

interface Badge { tone: string; text: string; big?: boolean }
interface Moment { id: number; kind: "play" | "stall" | "dawn"; title: string; sub: string; accent: string; badges: Badge[] }

// stable, monotonic ids so the moments feed keys don't shift when the list caps and
// drops its oldest entry (a positional key would remount every card each action)
let nextMomentId = 0;

// provenance of this morning's room, read from the emitted dawn event
interface DawnIncome { room: number; seats: number; seatRoom: number; ringDraw: number; tableDraw: number }
interface DuskData { sweep: number; unspent: number; coldSet: number; table: number; camped: boolean }

interface Run {
  s: GameState;
  phase: "morning" | "dusk";
  moments: Moment[];   // newest first, capped
  seen: string[];      // milestone markers for the tutorial guide
  income: DawnIncome;
  poured: number;      // attention taken from the room this morning (sum of rested spends)
  duskData: DuskData | null;
}

const MOMENT_CAP = 12;

// FIDELITY: the Phase-4 asking lifecycle isn't in yet — a standing asking simply
// refreshes each dawn at the leg's floor size.
function refreshAsking(s: GameState): void {
  s.asking = {
    tier: (["kettle", "plea", "poem", "great", "great"] as const)[s.calendar.leg],
    needFill: NEED_BY_LEG[s.calendar.leg],
    progress: 0,
    acceptedMorning: s.calendar.morning,
    staleAfterMornings: 99,
  };
}

function dawnIncomeOf(events: GameEvent[]): DawnIncome {
  const d = (events.find(e => e.type === "dawn")?.data ?? {}) as Record<string, number>;
  const room = d.room ?? 0;
  const ringDraw = d.ringDraw ?? 0;
  const tableDraw = d.tableDraw ?? 0;
  return { room, seats: d.seats ?? 1, seatRoom: room - DAWN_BASE - ringDraw - tableDraw, ringDraw, tableDraw };
}

function pouredOf(events: GameEvent[]): number {
  return events.filter(e => e.type === "rested")
    .reduce((sum, e) => sum + ((e.data?.spend as number) ?? 0), 0);
}

function markers(events: GameEvent[]): string[] {
  const out: string[] = [];
  for (const e of events) {
    out.push(e.type);
    const d = (e.data ?? {}) as Record<string, unknown>;
    if (e.type === "played" && (d.link as number) >= 2) out.push("chain2");
    if (e.type === "played" && d.pour === 0) out.push("banked");
    if (e.type === "filled" && d.complete === true) out.push("town");
  }
  return out;
}

function makeRun(seed: number, deck: string): Run {
  const s = createInitialState(seed);
  if (deck !== "apprentice") {
    const wayCards = (starterPool.cards as unknown as Card[]).filter(c => c.archetype === deck);
    for (const [i, card] of wayCards.entries()) {
      s.pieces.push({
        instanceId: `${card.id}#w${i}`, cardId: card.id, zone: "pack",
        fired: false, set: 0, stampedGrains: [], wokeThisMorning: false,
        stampedThisMorning: false, playedThisMorning: false, freshness: 2,
        delightBonus: 0, overkillCredited: 0, brimBand: 0,
      });
    }
  }
  refreshAsking(s);
  const r = dawn(s, ctx);
  return {
    s: r.state, phase: "morning",
    moments: [dawnMoment(r.state, r.events)],
    seen: markers(r.events),
    income: dawnIncomeOf(r.events), poured: 0, duskData: null,
  };
}

// ---------- events → moments (grouped causality with delta badges) ----------

function nameOf(s: GameState, id: unknown): string {
  const p = typeof id === "string" ? s.pieces.find(x => x.instanceId === id) : undefined;
  return p ? CARDS.get(p.cardId)?.name ?? String(id) : String(id);
}

function eventBadge(s: GameState, e: GameEvent): Badge | null {
  const d = (e.data ?? {}) as Record<string, unknown>;
  switch (e.type) {
    case "rested": return { tone: "flow", text: `poured ${r1(d.spend as number)} → landed ${r1(d.landed as number)} on ${nameOf(s, d.piece)}` };
    case "woke": return { tone: "gold", text: `✦ ${nameOf(s, d.piece)} wakes — yours for good`, big: true };
    case "gathered": return { tone: "flow", text: `${d.seats} seated → room +${r1(d.gain as number)}` };
    case "steadied": {
      const b: string[] = [];
      if (d.links) b.push(`chain +${d.links}`);
      if (d.braced) b.push("braced");
      return b.length ? { tone: "moss", text: b.join(" · ") } : null;
    }
    case "stamped": return { tone: "pale", text: `${nameOf(s, d.piece)} stamped ${d.suit}` };
    case "drew": return { tone: "pale", text: `drew ${(d.pieces as string[]).map(p => nameOf(s, p)).join(", ")}` };
    case "filled": return {
      tone: "need",
      text: d.complete ? "need filled — the town is re-made 🌼" : `+${d.amount} into the need (${d.progress}/${s.asking?.needFill})`,
      big: d.complete === true,
    };
    case "overkilled": return null; // covered by the gleam badge
    case "gleam": return { tone: "gleam", text: `+${d.amount} Standing (${d.grain}-tinged)`, big: true };
    case "brimmed": return { tone: "gleam", text: `the brim widens — +${d.extra} more Standing` };
    case "whittled": return { tone: "moss", text: "carved a handsel from the leavings" };
    case "courted": return { tone: "song", text: `the ${d.stock} is won over` };
    case "soothed": return { tone: "glaze", text: `the grey recedes −${d.mend}` };
    case "retired": return { tone: "pale", text: `last-lit ${nameOf(s, d.piece)} (worth ${r1(d.worth as number)})` };
    case "warmed": return { tone: "moss", text: `+${d.n} delight warmed in` };
    case "kept": return { tone: "moss", text: "kept fresh a season longer" };
    case "brace-held": return { tone: "moss", text: "the brace holds — no harm" };
    case "refused": return { tone: "warn", text: `refused: ${d.why}` };
    default: return null;
  }
}

function buildMoment(after: GameState, events: GameEvent[], header: Omit<Moment, "badges" | "id">): Moment {
  const badges: Badge[] = [];
  for (const e of events) {
    if (e.type === "played" || e.type === "dawn" || e.type === "dusk") continue;
    const b = eventBadge(after, e);
    if (b) badges.push(b);
  }
  return { id: nextMomentId++, ...header, badges };
}

function dawnMoment(state: GameState, events: GameEvent[]): Moment {
  const inc = dawnIncomeOf(events);
  const badges: Badge[] = [
    { tone: "flow", text: `base +${DAWN_BASE}` },
    { tone: "flow", text: `${inc.seats} seated → +${r1(inc.seatRoom)}` },
  ];
  if (inc.ringDraw > 0) badges.push({ tone: "pale", text: `rings +${r1(inc.ringDraw)}` });
  if (inc.tableDraw > 0) badges.push({ tone: "moss", text: `table returns +${r1(inc.tableDraw)}` });
  const drew = (events.find(e => e.type === "dawn")?.data?.drew as string[]) ?? [];
  if (drew.length) badges.push({ tone: "pale", text: `drew ${drew.length} to hand` });
  return {
    id: nextMomentId++, kind: "dawn",
    title: `Dawn — Morning ${state.calendar.morning}, ${LEG_NAMES[state.calendar.leg]}`,
    sub: `room ${r1(inc.room)}`, accent: "var(--gold)", badges,
  };
}

function advance(run: Run, r: MorningResult, moment: Moment | null): Run {
  return {
    ...run,
    s: r.state,
    moments: moment ? [moment, ...run.moments].slice(0, MOMENT_CAP) : run.moments,
    seen: [...new Set([...run.seen, ...markers(r.events)])],
    poured: run.poured + pouredOf(r.events),
  };
}

// ---------- plain-English effect gloss (with live read values) ----------

interface Gloss { whenLabel: string; text: string; live: string | null; zero: boolean }

const WHEN_LABEL: Record<string, string> = {
  "on-play": "play", "on-wake": "wake", "on-chain": "chain", "on-fulfil": "fulfil",
  "on-overkill": "overkill", "on-court": "court", "on-dawn": "dawn", "at-dusk": "dusk",
  "on-stall": "stall",
};
const READ_PHRASE: Record<string, string> = {
  room: "the room", chain: "your chain", spiral: "this town's grey", season: "the season's fade",
  "over-ceiling": "the overflow", handsels: "your purse", fill: "the need so far",
};
function readPhrase(src: string): string {
  if (READ_PHRASE[src]) return READ_PHRASE[src];
  if (src.startsWith("grain:")) return `your ${src.slice(6)} count`;
  if (src.startsWith("woken:")) return `${src.slice(6)} you woke before`;
  return src;
}
const TGT_PHRASE: Record<string, string> = {
  self: "itself", "held:capstone": "your held capstone", "hand:offgrain": "a spare off-suit card",
  "hand:cheapest": "your cheapest card", "inert:hand": "a sleeping card in hand",
  "inert:pack": "a sleeping card in your deck",
};
const tgtPhrase = (t: unknown): string => TGT_PHRASE[t as string] ?? String(t ?? "itself");
const toPhrase = (t: unknown): string => ({ room: "the room now", table: "the town's table" } as Record<string, string>)[t as string] ?? String(t);

function glossEffect(effect: Effect, s: GameState): Gloss {
  const p = (effect.params ?? {}) as Record<string, unknown>;
  const liveOf = (v: unknown): { src: string; n: number } | null =>
    isReadExpr(v) ? { src: v.source, n: evaluateRead(v.source as ReadSource, s, readCtx) } : null;
  let text = "", live: string | null = null, zero = false;
  switch (effect.do) {
    case "gather": {
      const lv = liveOf(p.amount);
      if (lv) { text = `Gather a crowd by ${readPhrase(lv.src)}`; live = `now ${lv.n}`; zero = lv.n === 0; }
      else text = `Gather a crowd of +${p.amount}`;
      break;
    }
    case "rest": {
      const lv = liveOf(p.amount);
      text = `Pour ${lv ? readPhrase(lv.src) : `+${p.amount}`} onto ${tgtPhrase(p.target)}`;
      if (lv) live = `now ${r1(lv.n)}`;
      break;
    }
    case "steady": {
      const bits: string[] = [];
      if (p.links) bits.push(`+${p.links} chain link${(p.links as number) > 1 ? "s" : ""}`);
      if (p.brace) bits.push("brace vs the next stall");
      text = `Steady — ${bits.join(" & ") || "hold the chain"}`;
      break;
    }
    case "fill": {
      const lv = liveOf(p.amount);
      text = `Fill the need by ${lv ? readPhrase(lv.src) : `+${p.amount}`}`;
      if (lv) { live = `now ${lv.n}`; zero = lv.n === 0; }
      break;
    }
    case "brim": {
      const lv = liveOf(p.band);
      text = `Spill overflow (${lv ? readPhrase(lv.src) : `+${p.band}`}) into Standing`;
      break;
    }
    case "mark-grain": text = `Stamp ${tgtPhrase(p.target)} as “${p.suit}”`; break;
    case "draw": text = `Draw ${p.n} ${p.suit ? `${p.suit} ` : ""}card${(p.n as number) > 1 ? "s" : ""}`; break;
    case "retire": text = `Last-light ${tgtPhrase(p.target)} → ${toPhrase(p.to)}`; break;
    case "whittle": {
      const lv = liveOf(p.amount);
      text = `Carve bright money${lv ? ` from ${readPhrase(lv.src)}` : ""}`;
      if (lv) { live = `now ${r1(lv.n)}`; zero = lv.n < 1; }
      break;
    }
    case "court": {
      const term = p.term as { if?: { source?: string }; at_least?: number } | undefined;
      const need = term?.at_least != null ? `needs ${readPhrase(term.if?.source ?? "chain")} ${term.at_least}+` : "on its term";
      text = `Court the ${p.stock} — ${need} (gleam is the key, never spent)`;
      break;
    }
    case "soothe": text = "Mend this town's grey (capped by the last-red)"; break;
    case "warm": text = `+${p.n} delight when woken`; break;
    case "keep": text = "Stays fresh one more season"; break;
    default: text = effect.do;
  }
  return { whenLabel: WHEN_LABEL[effect.when] ?? effect.when, text, live, zero };
}

// ---------- the preview: a throwaway engine call, diffed ----------

interface Preview {
  spend: number; m: number; landed: number; setAfter: number;
  wakes: boolean; alreadyFired: boolean; excess: number;
  gleamGain: number; fillGain: number; fillDone: boolean; roomAfter: number; banks: boolean;
}

function previewPlay(s: GameState, id: string, pour: number): Preview {
  const before = s.pieces.find(p => p.instanceId === id)!;
  const card = CARDS.get(before.cardId)!;
  const spend = Math.min(pour, Math.floor(s.turn.room));
  const m = chainMultiplier(s.turn.chainLinks + 1);
  const landed = spend * m;   // what the direct pour lands (the spend × chain → lands row)
  const after = playPiece(s, id, spend, ctx).state;
  const played = after.pieces.find(p => p.instanceId === id)!;
  // setAfter is the engine's truth, not before.set + landed: on-play effects that rest more
  // onto the piece (Fired Beam, Even the Rim, Seasoned Timber) push its set past the pour.
  const setAfter = played.set;
  const fillGain = (after.asking?.progress ?? 0) - (s.asking?.progress ?? 0);
  return {
    spend, m, landed, setAfter,
    wakes: !before.fired && played.fired, alreadyFired: before.fired,
    excess: Math.max(0, setAfter - card.ceiling),
    gleamGain: after.player.gleam - s.player.gleam,
    fillGain,
    fillDone: fillGain > 0 && (after.asking?.progress ?? 0) >= (after.asking?.needFill ?? Infinity),
    roomAfter: after.turn.room, banks: spend === 0,
  };
}

// ---------- the tutorial guide (reads progress; never touches the rules) ----------

interface GuideStep { done: (run: Run, selected: string | null) => boolean; text: string }
const GUIDE: GuideStep[] = [
  { done: (r, sel) => r.seen.includes("played") || sel !== null,
    text: "Click a card in your hand — a cheap mark-1 piece is a good first pour." },
  { done: r => r.seen.includes("played"),
    text: "Drag the pour slider. The preview shows exactly what will happen — pour at least the waking-mark, then Pour it." },
  { done: r => r.seen.includes("woke"),
    text: "Wake something: pour at least its mark. A woken piece is yours forever and seats tomorrow's room." },
  { done: r => r.seen.includes("chain2"),
    text: "Play a second card right away — an unbroken chain multiplies your next pour (×1.25 per link, up to ×2)." },
  { done: r => r.seen.includes("dusk"),
    text: "When the room runs low, End the morning. Unspent attention seeps to the town's table." },
  { done: r => r.s.calendar.morning >= 2,
    text: "Take the next dawn. Your woken pieces return and SEAT the room — this snowball is the whole game." },
  { done: r => r.seen.includes("gleam"),
    text: "Now show off: pour PAST a piece's ceiling. The overflow becomes Standing — your score and your life." },
  { done: r => r.seen.includes("town"),
    text: "Fill the town's need (cards with a fill effect pour woken delight in). Complete it and the town is re-made." },
  { done: r => r.seen.includes("banked"),
    text: "One more trick: play a big piece with the slider at 0 — banking it cold, ready for a later card to aim the room at it." },
];
const GRADUATED =
  "You know the whole loop. Try a Way's deck — the Kilnfast's Fired Beam wants a Setterby → Calipers → detonate setup; feel what order does.";

// ---------- vessel geometry (pure presentation) ----------

interface VesselGeom { fillH: number; overB: number; overH: number; markB: number; ceilB: number; ghostB: number; ghostH: number }

function vesselGeom(set: number, mark: number, ceiling: number, previewAfter?: number): VesselGeom {
  const max = ceiling + 2;
  const pct = (v: number): number => Math.max(0, Math.min(100, (v / max) * 100));
  const ceilB = pct(ceiling);
  const g = previewAfter != null && previewAfter > set
    ? { ghostB: pct(set), ghostH: Math.max(0, pct(previewAfter) - pct(set)) }
    : { ghostB: 0, ghostH: 0 };
  return { fillH: pct(Math.min(set, ceiling)), overB: ceilB, overH: Math.max(0, pct(set) - ceilB), markB: pct(mark), ceilB, ...g };
}

function Vessel({ set, mark, ceiling, previewAfter, label, small }: {
  set: number; mark: number; ceiling: number; previewAfter?: number; label?: string; small?: boolean;
}) {
  const v = vesselGeom(set, mark, ceiling, previewAfter);
  return (
    <div className={small ? "tm-vessel tm-vsmall" : "tm-vessel"}>
      <div className="tm-vfill" style={{ height: `${v.fillH}%` }} />
      {v.ghostH > 0 && <div className="tm-vghost" style={{ bottom: `${v.ghostB}%`, height: `${v.ghostH}%` }} />}
      {v.overH > 0 && <div className="tm-vover" style={{ bottom: `${v.overB}%`, height: `${v.overH}%` }} />}
      <div className="tm-vmark" style={{ bottom: `${v.markB}%` }} />
      <div className="tm-vceil" style={{ bottom: `${v.ceilB}%` }} />
      {label != null && <span className="tm-vlab">{label}</span>}
    </div>
  );
}

// ---------- components ----------

function BadgeChip({ b }: { b: Badge }) {
  return <span className={`tm-bd tm-t-${b.tone}${b.big ? " big" : ""}`}>{b.text}</span>;
}

function Masthead({ run, deck, seed, guideOn, onDeck, onSeed, onGuide }: {
  run: Run; deck: string; seed: number; guideOn: boolean;
  onDeck: (d: string) => void; onSeed: (n: number) => void; onGuide: () => void;
}) {
  const s = run.s;
  const fired = s.pieces.filter(p => p.fired).length;
  return (
    <header className="tm-mast">
      <div className="tm-mast-left">
        <span className="tm-morn">Morning <b>{s.calendar.morning}</b> · {LEG_NAMES[s.calendar.leg]}</span>
        <span className="tm-dots">
          {LEG_NAMES.map((_, i) => (
            <span key={i} className={`tm-dot${i === s.calendar.leg ? " on" : i < s.calendar.leg ? " past" : ""}`} />
          ))}
        </span>
      </div>
      <div className="tm-chips">
        {DECKS.map(d => (
          <button key={d} type="button"
            className={`tm-chip${deck === d ? " active" : ""}`}
            style={{ ["--cc" as string]: `var(--w-${d === "apprentice" ? "shared" : d})` }}
            onClick={() => onDeck(d)}>
            {d[0].toUpperCase() + d.slice(1)}
          </button>
        ))}
        <label className="tm-seedlab">seed
          <input className="tm-seed" type="number" value={seed}
            onChange={e => onSeed(Number(e.target.value) || 1)} />
        </label>
      </div>
      <div className="tm-stats">
        <div className="tm-stat">
          <span className="tm-stat-l">Standing</span>
          <span className="tm-stat-v gleam">✦ {s.player.gleam}</span>
          <span className="tm-stat-note">score for now — gates askings &amp; the crown in the full run</span>
        </div>
        <div className="tm-stat"><span className="tm-stat-l">Woken</span><span className="tm-stat-v gold">{fired}</span></div>
        <div className="tm-stat"><span className="tm-stat-l">Purse</span><span className="tm-stat-v moss">{s.player.handsels.length}</span></div>
        <button type="button" className="tm-gbtn" onClick={onGuide}>{guideOn ? "guide off" : "🧭 guide"}</button>
      </div>
    </header>
  );
}

function StatusStrip({ run }: { run: Run }) {
  const s = run.s;
  const links = s.turn.chainLinks;
  const incomeChips: { tone: string; text: string }[] = [
    { tone: "flow", text: `base gathering +${DAWN_BASE}` },
    { tone: "flow", text: `${run.income.seats} seated +${r1(run.income.seatRoom)}` },
  ];
  if (run.income.ringDraw > 0) incomeChips.push({ tone: "pale", text: `grey rings +${r1(run.income.ringDraw)}` });
  if (run.income.tableDraw > 0) incomeChips.push({ tone: "moss", text: `table (camped ⅔) +${r1(run.income.tableDraw)}` });
  const beads = Math.max(links, 1);
  return (
    <div className="tm-strip">
      <div className="tm-panel tm-room">
        <div className="tm-room-num">
          <div className="tm-lbl">The Room</div>
          <div className="tm-roomval">{r1(s.turn.room)}</div>
        </div>
        <div className="tm-room-rest">
          <div className="tm-bar"><div className="tm-barfill" style={{ width: `${run.income.room > 0 ? Math.min(100, (s.turn.room / run.income.room) * 100) : 0}%` }} /></div>
          <div className="tm-incrow">
            <span className="tm-from">from</span>
            {incomeChips.map((c, i) => <span key={i} className={`tm-inc tm-t-${c.tone}`}>{c.text}</span>)}
            <span className="tm-inc tm-t-need">poured {r1(run.poured)}</span>
          </div>
        </div>
      </div>
      <div className="tm-panel tm-chain">
        <div>
          <div className="tm-lbl">The Chain</div>
          <div className="tm-beadrow">
            {Array.from({ length: beads }, (_, i) => <span key={i} className={`tm-bead${i < links ? " lit" : ""}`} />)}
            <span className="tm-linkct">{links} link{links === 1 ? "" : "s"}</span>
          </div>
        </div>
        <div className="tm-mults">
          <div className="tm-mini"><span>now</span><b>×{chainMultiplier(links)}</b></div>
          <div className="tm-mini gold"><span>next</span><b>×{chainMultiplier(links + 1)}</b></div>
        </div>
        <span className={`tm-braced${s.turn.braced ? " on" : ""}`}>{s.turn.braced ? "braced ✓" : "unbraced"}</span>
      </div>
      <NeedPanel run={run} />
    </div>
  );
}

function NeedPanel({ run }: { run: Run }) {
  const [howOpen, setHowOpen] = useState(false);
  const s = run.s;
  const ask = s.asking;
  // every distinct card in this run's pieces that carries a fill effect
  const fillCards = [...new Map(
    s.pieces.map(p => CARDS.get(p.cardId)!).filter(fillsNeed).map(c => [c.id, c]),
  ).values()];
  const handFillers = s.pieces.filter(p => p.zone === "hand" && fillsNeed(CARDS.get(p.cardId)!));
  const status = handFillers.length
    ? `in hand now: ${handFillers.map(p => CARDS.get(p.cardId)!.name).join(", ")}`
    : fillCards.length
      ? "no fill card in hand — draw one"
      : "this Way fills needs another way";
  return (
    <div className={`tm-panel tm-need${ask && handFillers.length ? " lit" : ""}`}>
      <div className="tm-needhead">
        <span className="tm-lbl">The {ask?.tier ?? "—"}'s Need</span>
        <button type="button" className={`tm-howbtn${howOpen ? " open" : ""}`}
          aria-expanded={howOpen} onClick={() => setHowOpen(!howOpen)}>how?</button>
        <span className="tm-neednum">{ask?.progress ?? 0}<i>/{ask?.needFill ?? 0}</i></span>
      </div>
      <div className="tm-bar"><div className="tm-barfill need" style={{ width: `${ask ? Math.min(100, (ask.progress / ask.needFill) * 100) : 0}%` }} /></div>
      <div className="tm-fillers">{status}</div>
      {howOpen && (
        <div className="tm-howpop">
          <p className="tm-howtext">Play a card with a <b>fill</b> effect. It pours woken delight into
            the need — the amount reads something live (your grain count, the room, or your chain), so
            build that up first, then play the fill card. Reach <b>{ask?.needFill ?? "the fill"}</b> and
            the town is re-made.</p>
          <div className="tm-lbl" style={{ margin: "8px 0 5px" }}>Fill cards in this deck</div>
          {fillCards.length === 0 ? (
            <p className="tm-howtext"><i>None. This Way answers needs another way — through the purse
              and its own payoffs, not by filling.</i> Try the {FILL_WAYS.join(" / ")} decks.</p>
          ) : fillCards.map(c => {
            const g = glossEffect(c.effects.find(e => e.do === "fill")!, s);
            return (
              <div key={c.id} className="tm-howrow">
                <span className="tm-gdot" style={{ background: grainVar(c.grain) }} />
                <span className="tm-howname">{c.name}</span>
                <span className="tm-when">{g.whenLabel}</span>
                <span className="tm-howfx">{g.text}{g.live && <i className="tm-live"> · {g.live}</i>}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function PourPanel({ run, selected, pour, onPour, onPlay, onCancel }: {
  run: Run; selected: string; pour: number;
  onPour: (n: number) => void; onPlay: () => void; onCancel: () => void;
}) {
  const s = run.s;
  const piece = s.pieces.find(p => p.instanceId === selected)!;
  const card = CARDS.get(piece.cardId)!;
  const maxPour = Math.floor(s.turn.room);
  const clamped = Math.min(pour, maxPour);
  const pv = useMemo(() => previewPlay(s, selected, clamped), [s, selected, clamped]);
  const badges: Badge[] = [];
  if (pv.banks) badges.push({ tone: "pale", text: "banks it cold — pour nothing" });
  if (pv.wakes) badges.push({ tone: "gold", text: `✦ WAKES (reaches mark ${card.mark})`, big: true });
  else if (!pv.alreadyFired && !pv.banks) badges.push({ tone: "pale", text: `stays cold — ${r1(pv.setAfter)} of mark ${card.mark}` });
  if (pv.excess > 0) badges.push({ tone: "gleam", text: `${r1(pv.excess)} past the ceiling` });
  if (pv.gleamGain > 0) badges.push({ tone: "gleam", text: `+${pv.gleamGain} Standing`, big: true });
  if (pv.fillGain > 0) badges.push({ tone: "need", text: pv.fillDone ? `+${pv.fillGain} — COMPLETES the need 🌼` : `+${pv.fillGain} into the need`, big: pv.fillDone });
  badges.push({ tone: "flow", text: `room after: ${r1(pv.roomAfter)}` });
  return (
    <div className="tm-pour">
      <Vessel set={piece.set} mark={card.mark} ceiling={card.ceiling}
        previewAfter={pv.banks ? undefined : pv.setAfter}
        label={piece.set > 0 ? r1(piece.set) : "empty"} />
      <div className="tm-pour-right">
        <div className="tm-pour-head">
          <span className="tm-pour-name">{card.name}</span>
          <span className="tm-pour-marks">wake {card.mark} · ceil {card.ceiling}</span>
        </div>
        <input type="range" min={0} max={maxPour} step={1} value={clamped}
          onChange={e => onPour(Number(e.target.value))} />
        <div className="tm-flowrow">
          <span className="tm-pv need"><span>spend</span><b>{pv.spend}</b></span>
          <span className="tm-op">×</span>
          <span className="tm-pv gold"><span>chain</span><b>{pv.m}</b></span>
          <span className="tm-op">→</span>
          <span className="tm-pv flow"><span>lands</span><b>{r1(pv.landed)}</b></span>
        </div>
        <div className="tm-badges">{badges.map((b, i) => <BadgeChip key={i} b={b} />)}</div>
        <div className="tm-pour-btns">
          <button type="button" className="tm-btn primary" onClick={onPlay}>{pv.banks ? "Bank it cold" : "Pour it"}</button>
          <button type="button" className="tm-btn" onClick={onCancel}>Never mind</button>
        </div>
      </div>
    </div>
  );
}

function HandCard({ run, id, selected, onPick }: {
  run: Run; id: string; selected: boolean; onPick: (id: string) => void;
}) {
  const s = run.s;
  const piece = s.pieces.find(p => p.instanceId === id)!;
  const card = CARDS.get(piece.cardId)!;
  const canFill = s.asking != null && fillsNeed(card);
  const glosses = card.effects.map(e => glossEffect(e, s));
  return (
    <button type="button"
      className={`tm-card${selected ? " sel" : ""}${canFill ? " fillable" : ""}`}
      style={{ ["--gr" as string]: grainVar(card.grain) }}
      onClick={() => onPick(id)}>
      <div className="tm-crow1">
        <span className="tm-gdot" />
        <span className="tm-cname">{card.name}{piece.fired && <i className="tm-cwoke"> ✦</i>}</span>
        <span className="tm-cgrain">{card.grain}</span>
      </div>
      <div className="tm-crow2">
        <span className="tm-cchip">wake {card.mark}</span>
        <span className="tm-cchip">ceil {card.ceiling}</span>
        <span className="tm-cchip">gift {card.woken_delight}</span>
        {piece.set > 0 && <span className="tm-cchip set">set {r1(piece.set)}</span>}
      </div>
      <div className="tm-cfx">
        {glosses.map((g, i) => (
          <div key={i} className="tm-fx">
            <span className="tm-when">{g.whenLabel}</span>
            <span className={`tm-fxtext${g.zero ? " zero" : ""}`}>
              {g.text}
              {g.live && <i className="tm-live"> · {g.zero ? `${g.live} — nothing to feed yet` : g.live}</i>}
            </span>
          </div>
        ))}
      </div>
    </button>
  );
}

function TableRow({ run }: { run: Run }) {
  const s = run.s;
  const inPlay = s.pieces.filter(p => p.zone === "in-play");
  if (inPlay.length === 0) return null;
  return (
    <div>
      <div className="tm-sechead">On the table — banked &amp; woken vessels</div>
      <div className="tm-table">
        {inPlay.map(p => {
          const c = CARDS.get(p.cardId)!;
          return (
            <div key={p.instanceId}
              className={`tm-titem${p.wokeThisMorning ? " fresh" : ""}`}
              style={{ borderLeftColor: p.fired ? "var(--gold)" : grainVar(c.grain) }}>
              <Vessel small set={p.set} mark={c.mark} ceiling={c.ceiling} />
              <div>
                <div className="tm-tname">{c.name}{p.fired ? " ✦" : ""}</div>
                <div className="tm-tstate">{p.fired ? "woken" : `${r1(p.set)}/${c.mark} cold`}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CrowdPanel({ run }: { run: Run }) {
  const s = run.s;
  const fired = s.pieces.filter(p => p.fired);
  return (
    <div className="tm-rpanel tm-crowd">
      <div className="tm-ph">
        <div className="tm-lbl">The Woken Crowd — tomorrow's room</div>
        <div className="tm-ph-sub">every woken piece seats the room at next dawn</div>
      </div>
      <div className="tm-plist tm-scroll">
        <div className="tm-home">
          <span className="tm-home-ic">🏠</span>
          <div className="tm-home-t"><div className="tm-home-n">The home-note</div><div className="tm-home-s">always seat #1</div></div>
          <span className="tm-home-v">+{r1(seatContribution(0))}</span>
        </div>
        {fired.length === 0 && (
          <p className="tm-empty">No one woken yet. Pour a card to its mark and it joins the crowd — the snowball starts here.</p>
        )}
        {fired.map((p, i) => {
          const c = CARDS.get(p.cardId)!;
          const grants: { icon: string; tone: string; text: string }[] = [
            { icon: "☼", tone: "flow", text: `seats the room +${r1(seatContribution(i + 1))} at dawn` },
            { icon: "◈", tone: "grain", text: `feeds “woken:${c.grain}” reads` },
          ];
          const dawnFx = c.effects.find(e => e.when === "on-dawn");
          if (dawnFx) grants.push({ icon: "✦", tone: "gold", text: `each dawn: ${glossEffect(dawnFx, s).text}` });
          const payoff = c.effects.find(e => e.when === "on-wake" || e.when === "on-fulfil");
          if (payoff) {
            const g = glossEffect(payoff, s);
            grants.push({ icon: "✧", tone: "gleam", text: `${g.whenLabel}: ${g.text}` });
          }
          if (c.woken_delight > 0) grants.push({ icon: "❀", tone: "need", text: `pours ${c.woken_delight} delight into needs` });
          return (
            <div key={p.instanceId} className="tm-wcard" style={{ borderLeftColor: grainVar(c.grain) }}>
              <div className="tm-whead">
                <span className="tm-gdot" style={{ background: grainVar(c.grain) }} />
                <span className="tm-wname">{c.name}</span>
                <span className="tm-wseat">seat #{i + 2}</span>
              </div>
              {grants.map((g, j) => (
                <div key={j} className="tm-grant">
                  <span className="tm-grant-ic" style={{ color: g.tone === "grain" ? grainVar(c.grain) : `var(--${g.tone === "gold" ? "gold" : g.tone})` }}>{g.icon}</span>
                  <span>{g.text}</span>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MomentsPanel({ moments }: { moments: Moment[] }) {
  return (
    <div className="tm-rpanel tm-moments">
      <div className="tm-ph"><div className="tm-lbl">The Morning, moment by moment</div></div>
      <div className="tm-plist tm-scroll">
        {moments.map(m => (
          <div key={m.id} className="tm-mcard" style={{ borderLeftColor: m.accent }}>
            <div className="tm-mhead">
              <span className="tm-mdot" style={{ background: m.accent }} />
              <span className="tm-mtitle">{m.title}</span>
              <span className="tm-msub">{m.sub}</span>
            </div>
            {m.badges.length > 0 && (
              <div className="tm-mbadges">{m.badges.map((b, j) => <BadgeChip key={j} b={b} />)}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function DuskScreen({ run, onNext }: { run: Run; onNext: () => void }) {
  const d = run.duskData ?? { sweep: 0, unspent: 0, coldSet: 0, table: 0, camped: true };
  const fired = run.s.pieces.filter(p => p.fired).length;
  let seatPreview = 0;
  for (let i = 0; i < 1 + fired; i++) seatPreview += seatContribution(i);
  return (
    <div className="tm-duskwrap">
      <div className="tm-dusk">
        <div className="tm-lbl" style={{ letterSpacing: ".22em" }}>Dusk settles</div>
        <h2 className="tm-dusk-title">The light goes long and gold</h2>
        <p className="tm-dusk-blurb">Unspent attention isn't lost — it seeps to the town's table. Camp here and two-thirds of it returns at dawn.</p>
        <div className="tm-dusk-tab">
          <div className="tm-lbl">what seeps to the town's table</div>
          <div className="tm-drow"><span>unspent room</span><b className="tm-t-flow">{r1(d.unspent)}</b></div>
          <div className="tm-drow"><span>cold pieces released</span><b className="tm-t-pale">{r1(d.coldSet)}</b></div>
          <div className="tm-drow total"><span>{d.camped ? "to the table (⅔ returns at dawn)" : "to the table"}</span><b>{r1(d.sweep)}</b></div>
        </div>
        <p className="tm-dusk-aud">Your audience: <b className="gold">{fired}</b> woken piece{fired === 1 ? "" : "s"} will seat tomorrow's room — worth about <b className="flow">+{r1(seatPreview)}</b> attention at dawn.</p>
        <button type="button" className="tm-btn primary wide" onClick={onNext}>Take the next dawn →</button>
      </div>
    </div>
  );
}

function App() {
  const [deck, setDeck] = useState<string>("apprentice");
  const [seed, setSeed] = useState(1);
  const [run, setRun] = useState<Run>(() => makeRun(1, "apprentice"));
  const [selected, setSelected] = useState<string | null>(null);
  const [pour, setPour] = useState(0);
  const [guideOn, setGuideOn] = useState(true);

  const s = run.s;
  const hand = s.pieces.filter(p => p.zone === "hand");
  const maxPour = Math.floor(s.turn.room);

  const reset = (nextDeck: string, nextSeed: number) => {
    setDeck(nextDeck); setSeed(nextSeed); setSelected(null); setPour(0);
    setRun(makeRun(nextSeed, nextDeck));
  };
  const pick = (id: string) => {
    const card = CARDS.get(s.pieces.find(p => p.instanceId === id)!.cardId)!;
    setSelected(id);
    setPour(Math.min(maxPour, card.mark));   // default: just enough to wake
  };
  const play = () => {
    if (!selected) return;
    const spend = Math.min(pour, maxPour);
    const card = CARDS.get(s.pieces.find(p => p.instanceId === selected)!.cardId)!;
    const r = playPiece(s, selected, spend, ctx);
    const moment = buildMoment(r.state, r.events, {
      kind: "play",
      title: spend > 0 ? `You pour ${spend} onto ${card.name}` : `You bank ${card.name} cold`,
      sub: `link ${r.state.turn.chainLinks} · ×${chainMultiplier(r.state.turn.chainLinks)}`,
      accent: grainVar(card.grain),
    });
    setRun(advance(run, r, moment));
    setSelected(null);
  };
  const stall = () => {
    setSelected(null);
    const r = stallAction(s, ctx);
    const braced = r.events.some(e => e.type === "brace-held");
    setRun(advance(run, r, buildMoment(r.state, r.events, {
      kind: "stall", title: "You run an errand",
      sub: braced ? "the brace holds" : "the chain breaks", accent: "var(--need)",
    })));
  };
  const end = () => {
    setSelected(null);
    const r = dusk(s, ctx);
    const d = (r.events.find(e => e.type === "dusk")?.data ?? {}) as unknown as DuskData;
    setRun({ ...advance(run, r, null), phase: "dusk", duskData: d });
  };
  const nextDawn = () => {
    const withAsking = structuredClone(s);
    refreshAsking(withAsking);
    const r = dawn(withAsking, ctx);
    setRun({
      ...advance({ ...run, s: withAsking }, r, dawnMoment(r.state, r.events)),
      phase: "morning", income: dawnIncomeOf(r.events), poured: 0, duskData: null,
    });
  };

  const guideNext = GUIDE.find(g => !g.done(run, selected));
  const stallCost = s.turn.braced ? "brace absorbs it" : `${r1(s.turn.room)} → ${Math.floor(s.turn.room * STALL_ROOM_FACTOR)}`;

  return (
    <div className="tm-app">
      <Masthead run={run} deck={deck} seed={seed} guideOn={guideOn}
        onDeck={d => reset(d, seed)} onSeed={n => reset(deck, n)}
        onGuide={() => setGuideOn(!guideOn)} />
      {guideOn && (
        <div className="tm-guide"><span className="tm-guide-ic">🧭</span><span>{guideNext ? guideNext.text : GRADUATED}</span></div>
      )}
      {run.phase === "morning" ? (
        <main className="tm-main">
          <StatusStrip run={run} />
          <div className="tm-body">
            <section className="tm-center">
              <div className="tm-scrollarea tm-scroll">
                {selected && (
                  <PourPanel run={run} selected={selected} pour={pour}
                    onPour={setPour} onPlay={play} onCancel={() => setSelected(null)} />
                )}
                <div>
                  <div className="tm-sechead">Your hand — pick a card to pour the room into it</div>
                  {hand.length === 0 && <p className="tm-empty">Your hand is empty — end the morning.</p>}
                  <div className="tm-hand">
                    {hand.map(p => (
                      <HandCard key={p.instanceId} run={run} id={p.instanceId}
                        selected={selected === p.instanceId} onPick={pick} />
                    ))}
                  </div>
                </div>
                <TableRow run={run} />
              </div>
              <div className="tm-actions">
                <button type="button" className="tm-btn" onClick={stall}>
                  Run an errand <span className={`tm-stallcost${s.turn.braced ? " braced" : ""}`}>{stallCost}</span>
                </button>
                <button type="button" className="tm-btn primary" onClick={end}>End the morning →</button>
              </div>
            </section>
            <section className="tm-rail">
              <CrowdPanel run={run} />
              <MomentsPanel moments={run.moments} />
            </section>
          </div>
        </main>
      ) : (
        <DuskScreen run={run} onNext={nextDawn} />
      )}
    </div>
  );
}

const root = document.getElementById("toyRoot");
if (root) {
  createRoot(root).render(<StrictMode><App /></StrictMode>);
}
