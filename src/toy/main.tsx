// The Toy Morning — a React UI over the real engine. No game logic lives here:
// every rule answer comes from morning.ts/effects.ts, and the pour preview is a
// throwaway playPiece call diffed against the current state (the engine is pure).
// Bundled by scripts/build-toy.mjs into the codex's Toy Morning section.

import { StrictMode, useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import type { Card } from "../engine/vocabulary.js";
import { createInitialState, currentNode, type GameEvent, type GameState } from "../engine/state.js";
import { dawn, dusk, playPiece, stallAction, type MorningContext, type MorningResult } from "../engine/morning.js";
import { chainMultiplier } from "../engine/effects.js";
import starterPool from "../content/cards/starter-pool.json" with { type: "json" };

const CARDS = new Map((starterPool.cards as unknown as Card[]).map(c => [c.id, c]));
const ctx: MorningContext = { cardOf: id => CARDS.get(id)! };
const DECKS = ["apprentice", "kilnfast", "eveners", "untold", "fairwrights", "mannerly", "gleaners"] as const;
const LEG_NAMES = ["Green Going", "Long Light", "Deep Gold", "Red Walk", "the Wintering"];
const NEED_BY_LEG = [1, 3, 5, 7, 7];
const r1 = (n: number): string => (Math.round(n * 10) / 10).toString();

// ---------- run state (immutable snapshots; every action = one engine call) ----------

interface Run {
  s: GameState;
  log: string[];
  phase: "morning" | "dusk";
  seen: string[];   // milestone markers for the tutorial guide
}

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
  return { s: r.state, log: glossAll(r.state, r.events), phase: "morning", seen: [] };
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

function advance(run: Run, r: MorningResult, phase: Run["phase"] = run.phase): Run {
  return {
    s: r.state,
    log: [...run.log, ...glossAll(r.state, r.events)],
    phase,
    seen: [...new Set([...run.seen, ...markers(r.events)])],
  };
}

// ---------- glossing ----------

function nameOf(s: GameState, id: unknown): string {
  const p = typeof id === "string" ? s.pieces.find(x => x.instanceId === id) : undefined;
  return p ? CARDS.get(p.cardId)?.name ?? String(id) : String(id);
}

function glossOne(s: GameState, e: GameEvent): string | null {
  const d = (e.data ?? {}) as Record<string, unknown>;
  switch (e.type) {
    case "dawn": return `— Morning ${d.morning}, ${LEG_NAMES[d.leg as number]} — the room gathers to ${r1(d.room as number)} (${d.seats} seated)`;
    case "played": return `You play ${nameOf(s, d.piece)}${(d.pour as number) > 0 ? `, pouring ${d.pour}` : ", banking it cold"} (link ${d.link})`;
    case "rested": return `${r1(d.spend as number)} poured lands as ${r1(d.landed as number)} on ${nameOf(s, d.piece)}`;
    case "woke": return `✦ ${nameOf(s, d.piece)} WAKES — a gold edge takes; it is yours for good`;
    case "gathered": return `${d.seats} more seated — the room rises to ${r1(d.room as number)}`;
    case "steadied": return `The chain steadies${d.braced ? " and braces" : ""}`;
    case "stamped": return `${nameOf(s, d.piece)} is stamped ${d.suit}`;
    case "drew": return `You draw ${(d.pieces as string[]).map(p => nameOf(s, p)).join(", ")}`;
    case "filled": return `${d.amount} delight pours into the need (${d.progress}/${s.asking?.needFill})${d.complete ? " — the town is re-made! 🌼" : ""}`;
    case "overkilled": return `The cup runs over by ${r1(d.excess as number)}…`;
    case "gleam": return `✦ +${d.amount} Standing (${d.grain}-tinged) — showing off pays`;
    case "brimmed": return `The brim widens — +${d.extra} more Standing`;
    case "whittled": return `A handsel carved from the leavings`;
    case "courted": return `The ${d.stock} is won over — into your pack it comes`;
    case "soothed": return `The grey recedes — mended by ${d.mend}`;
    case "retired": return `${nameOf(s, d.piece)} is last-lit — its worth (${d.worth}) returns`;
    case "warmed": return `A little extra delight warms in`;
    case "kept": return `It will stay fresh a season longer`;
    case "stalled": return `⚠ The errand stalls the chain — the room cools to ${r1(d.room as number)}`;
    case "brace-held": return `The brace holds — no harm done`;
    case "refused": return `(refused: ${d.why})`;
    case "dusk": return `— Dusk. ${r1(d.sweep as number)} attention seeps to the town's table${d.camped ? "; you camp" : ""} —`;
    default: return null;
  }
}

function glossAll(s: GameState, events: GameEvent[]): string[] {
  return events.map(e => glossOne(s, e)).filter((x): x is string => x !== null);
}

// ---------- the preview: a throwaway engine call, diffed ----------

function previewPlay(s: GameState, id: string, amount: number): string {
  const after = playPiece(s, id, amount, ctx).state;
  const before = s.pieces.find(p => p.instanceId === id)!;
  const played = after.pieces.find(p => p.instanceId === id)!;
  const card = CARDS.get(before.cardId)!;
  const m = chainMultiplier(s.turn.chainLinks + 1);
  const bits: string[] = [];
  if (amount > 0) bits.push(`pour ${amount} × chain ×${m} → lands ${r1(Math.min(amount, s.turn.room) * m)}`);
  else bits.push("bank it cold (pour nothing)");
  if (!before.fired && played.fired) bits.push(`✦ WAKES (mark ${card.mark})`);
  else if (!played.fired && amount > 0) bits.push(`stays cold (${r1(played.set)} of mark ${card.mark})`);
  const gleamGain = after.player.gleam - s.player.gleam;
  if (gleamGain > 0) bits.push(`+${gleamGain} Standing`);
  const fillGain = (after.asking?.progress ?? 0) - (s.asking?.progress ?? 0);
  if (fillGain > 0) {
    const done = (after.asking?.progress ?? 0) >= (after.asking?.needFill ?? Infinity);
    bits.push(`+${fillGain} into the need${done ? " — COMPLETES it" : ""}`);
  }
  bits.push(`room after: ${r1(after.turn.room)}`);
  return bits.join(" · ");
}

// ---------- the tutorial guide (reads progress; never touches the rules) ----------

interface GuideStep {
  done: (run: Run, selected: string | null) => boolean;
  text: string;
}
const GUIDE: GuideStep[] = [
  { done: (r, sel) => r.seen.includes("played") || sel !== null,
    text: "Click a card in your hand — a cheap mark-1 piece is a good first pick." },
  { done: r => r.seen.includes("played"),
    text: "The slider chooses how much attention to pour. The preview underneath tells you exactly what will happen — pour at least the waking-mark, then Play It." },
  { done: r => r.seen.includes("woke"),
    text: "Wake something: pour at least its mark. A woken piece is yours forever — it will help gather tomorrow's crowd." },
  { done: r => r.seen.includes("chain2"),
    text: "Play a second card right away — an unbroken chain multiplies your next pour (×1.25 per link, up to ×2)." },
  { done: r => r.seen.includes("dusk"),
    text: "When the room runs low, End the Morning. Unspent attention isn't lost — it seeps to the town's table." },
  { done: r => r.s.calendar.morning >= 2,
    text: "Take the next dawn. Your woken pieces come back and SEAT the room — this snowball is the whole game." },
  { done: r => r.seen.includes("gleam"),
    text: "Now show off: pour PAST a piece's ceiling. The overflow becomes Standing — your score and your life bar." },
  { done: r => r.seen.includes("town"),
    text: "Fill the town's need (cards with a fill effect pour woken delight in). Complete it and the town is re-made." },
  { done: r => r.seen.includes("banked"),
    text: "One more trick: play a big piece with the slider at 0 — banking it cold on the table, ready for a later card to aim the room at it." },
];
const GRADUATED =
  "You know the whole loop. Try a Way's deck — the Kilnfast's Fired Beam wants a Setterby → Calipers setup; feel what order does.";

function Guide({ run, selected, onOff }: { run: Run; selected: string | null; onOff: () => void }) {
  const next = GUIDE.find(g => !g.done(run, selected));
  return (
    <div className="tguide">
      <span className="tguide-ic">🧭</span>
      <span>{next ? next.text : GRADUATED}</span>
      <button type="button" className="tguide-off" onClick={onOff}>guide off</button>
    </div>
  );
}

// ---------- components ----------

function Meter({ value, max, label, cls }: { value: number; max: number; label: string; cls: string }) {
  return (
    <div className={cls === "tfill" ? "tmeter" : "tneed"}>
      <div className={cls} style={{ width: `${Math.min(100, (value / max) * 100)}%` }} />
      <span className="tlabel">{label}</span>
    </div>
  );
}

function HandCard({ run, id, selected, onPick }: {
  run: Run; id: string; selected: boolean; onPick: (id: string) => void;
}) {
  const piece = run.s.pieces.find(p => p.instanceId === id)!;
  const card = CARDS.get(piece.cardId)!;
  return (
    <button type="button" className={`tcard${selected ? " sel" : ""}`}
      style={{ ["--gr" as string]: `var(--${card.grain})` }}
      disabled={run.phase !== "morning"} onClick={() => onPick(id)}>
      <span className="tg">{card.grain}</span>
      <span className="tn">{card.name}</span>
      <span className="ts">mark {card.mark} · ceil {card.ceiling} · wd {card.woken_delight}{piece.set > 0 ? ` · set ${r1(piece.set)}` : ""}</span>
      <span className="tv">{card.effects.map(e => e.do).join(" · ")}</span>
    </button>
  );
}

function Log({ lines }: { lines: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { ref.current?.scrollTo(0, ref.current.scrollHeight); }, [lines.length]);
  return (
    <div className="tlog" ref={ref}>
      {lines.slice(-40).map((l, i) => <div key={i}>{l}</div>)}
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
  const node = currentNode(s);
  const hand = s.pieces.filter(p => p.zone === "hand");
  const inPlay = s.pieces.filter(p => p.zone === "in-play");
  const firedCount = s.pieces.filter(p => p.fired).length;
  const maxPour = Math.floor(s.turn.room);
  const m = chainMultiplier(s.turn.chainLinks);
  const ask = s.asking!;

  const preview = useMemo(
    () => (selected ? previewPlay(s, selected, Math.min(pour, maxPour)) : ""),
    [s, selected, pour, maxPour],
  );

  const reset = (nextDeck: string, nextSeed: number) => {
    setDeck(nextDeck); setSeed(nextSeed); setSelected(null);
    setRun(makeRun(nextSeed, nextDeck));
  };
  const pick = (id: string) => {
    const card = CARDS.get(s.pieces.find(p => p.instanceId === id)!.cardId)!;
    setSelected(id);
    setPour(Math.min(maxPour, card.mark));   // default: just enough to wake
  };
  const play = () => {
    if (!selected) return;
    setRun(advance(run, playPiece(s, selected, Math.min(pour, maxPour), ctx)));
    setSelected(null);
  };

  return (
    <div>
      <div className="doc-tabs" style={{ borderBottom: "none" }}>
        {DECKS.map(d => (
          <button key={d} type="button" className={`chip${deck === d ? " active" : ""}`}
            style={d !== "apprentice" ? { ["--cc" as string]: `var(--w-${d})` } : undefined}
            onClick={() => reset(d, seed)}>
            {d[0].toUpperCase() + d.slice(1)}
          </button>
        ))}
        <input className="tseed" type="number" value={seed} title="seed"
          onChange={e => reset(deck, Number(e.target.value) || 1)} />
        {!guideOn && (
          <button type="button" className="chip" onClick={() => setGuideOn(true)}>🧭 guide</button>
        )}
      </div>

      {guideOn && (
        <>
          <details className="tprimer">
            <summary>What am I doing?</summary>
            <p>You're a traveling maker spending one morning in a fading town. The blue bar is
            <b> the room</b> — your pool of attention. Pour it onto cards: reach a card's
            <b> waking-mark</b> and it <b>wakes</b> — yours forever, and it helps gather tomorrow's
            crowd. Pour past its <b>ceiling</b> and the extra becomes <b>Standing</b> (gleam),
            your score. Fill the town's <b>need</b> (the warm bar) to re-make it. Chains of
            back-to-back plays multiply your pours; errands break the chain. Nothing here is
            scripted — every number comes from the real game engine.</p>
          </details>
          <Guide run={run} selected={selected} onOff={() => setGuideOn(false)} />
        </>
      )}

      <div className="tbar">
        <span><b>Morning {s.calendar.morning}</b> · {LEG_NAMES[s.calendar.leg]}</span>
        <span>chain <b>{s.turn.chainLinks}</b> (×{m}){s.turn.braced ? " · braced" : ""}</span>
        <span>gleam <b>{s.player.gleam}</b></span>
        <span>purse <b>{s.player.handsels.length}</b></span>
        <span>audience <b>{firedCount}</b> woken</span>
        <span>grey rings <b>{node.rings}</b></span>
      </div>
      <Meter value={s.turn.room} max={20} label={`the room · ${r1(s.turn.room)}`} cls="tfill" />
      <Meter value={ask.progress} max={ask.needFill} label={`the ${ask.tier}'s need · ${ask.progress}/${ask.needFill}`} cls="tfillneed" />

      {run.phase === "morning" ? (
        <>
          <div className="thand">
            {hand.length === 0 && <p className="tempty">Your hand is empty — end the morning.</p>}
            {hand.map(p => (
              <HandCard key={p.instanceId} run={run} id={p.instanceId}
                selected={selected === p.instanceId} onPick={pick} />
            ))}
          </div>
          {selected && (
            <div className="tpicker">
              <div className="tpickhead">Pour onto <b>{nameOf(s, selected)}</b></div>
              <input type="range" min={0} max={maxPour} step={1} value={Math.min(pour, maxPour)}
                onChange={e => setPour(Number(e.target.value))} />
              <div className="tpreview">{preview}</div>
              <div className="tbtns">
                <button type="button" className="tdo" onClick={play}>Play it</button>
                <button type="button" onClick={() => setSelected(null)}>Never mind</button>
              </div>
            </div>
          )}
          <div className="tbtns">
            <button type="button" onClick={() => { setSelected(null); setRun(advance(run, stallAction(s, ctx))); }}>
              Run an errand (stall)
            </button>
            <button type="button" className="tdo"
              onClick={() => { setSelected(null); setRun(advance(run, dusk(s, ctx), "dusk")); }}>
              End the morning
            </button>
          </div>
          {inPlay.length > 0 && (
            <div className="tinplay">
              On the table: {inPlay.map(p =>
                `${CARDS.get(p.cardId)!.name}${p.fired ? " ✦" : ` (${r1(p.set)}/${CARDS.get(p.cardId)!.mark})`}`,
              ).join(" · ")}
            </div>
          )}
        </>
      ) : (
        <div className="tdusk">
          <h3>Dusk settles</h3>
          <p>{r1(node.localTable)} attention waits on the town's table (camped: ⅔ returns at dawn).</p>
          <p>Your audience: {firedCount} woken piece{firedCount === 1 ? "" : "s"} will seat tomorrow's room.</p>
          <div className="tbtns">
            <button type="button" className="tdo" onClick={() => {
              const withAsking = structuredClone(s);
              refreshAsking(withAsking);
              setRun(advance({ ...run, s: withAsking }, dawn(withAsking, ctx), "morning"));
            }}>
              Next dawn →
            </button>
          </div>
        </div>
      )}
      <Log lines={run.log} />
    </div>
  );
}

const root = document.getElementById("toyRoot");
if (root) {
  createRoot(root).render(<StrictMode><App /></StrictMode>);
}
