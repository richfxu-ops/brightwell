// effects.ts — the fourteen verbs, one pure resolver each (GDD Layer 3, locked).
// resolveEffect(state, effect, ctx) never mutates its input: it clones, applies,
// and returns the next state plus the events describing what happened.
//
// Two kinds of "no" (task decision 1): canon violations in card data THROW
// (validate.ts catches them before play); situationally illegal plays are no-ops
// that emit a `refused` event, so the turn loop and bots can probe legality.
//
// Trigger semantics (`when`/`if`) belong to the turn loop (Phase 3) — resolvers
// assume the effect has already legitimately fired.
//
// NOTE (Phase-7 dial): cloning per effect is correct but costs O(state) each call;
// when the simulation harness lands, the clone boundary moves to once-per-play.

import type { Card, Effect, Grain, PrimitiveId, ReadExpr } from "./vocabulary.js";
import { BRIM_BAND_SOURCES, isReadExpr } from "./vocabulary.js";
import type { GameEvent, GameState, PieceInstance } from "./state.js";
import { currentNode } from "./state.js";
import { countsAs, evaluateRead } from "./reads.js";
import { nextInt } from "./rng.js";

// ----- constants (L6 §4/§5 values; see planning/QUESTIONS.md §A. Most are locked; the overkill→gleam
// band was tightened by D-018 — a sanctioned tuning, not a placeholder) -----
// D-018: tightened from L6 §4's 6 / 0.5 — playtesting showed Standing ballooned to ~200 with the
// fail-state never threatening (quiet-walks 0/350), worsened when fills went on-play (their self-pour
// fires every play). A harsher overkill→gleam curve makes Standing meaningful again (a resource to
// keep lit, a real fail-state). Tunable — final value set with competent bots in Phase 8.
export const FULL_RATE_BAND = 3;      // overkill→gleam at full rate for the first 3 past ceiling
export const DIMINISH_RATE = 0.25;    // then a quarter beyond
export const SEAT_FIRST = 2;          // the nth seat contributes 2 × 0.8^(n-1) room…
export const SEAT_DECAY = 0.8;        // …plateauing ~10 (gathered-room-softcap)
export const SOOTHE_MEND_CAP = 2;     // soothe mends min(requested, rings, 2) (last-red-cap)
export const SOOTHE_RUN_MAX = 4;      // 1 node / 1 knack / 1 season (napkin SOOTHE_PER_RUN_MAX)

/** The chain multiplier: m = 1 + 0.25×(links−1), capped 2.0 (locked, napkin CHAIN_M_BY_LEG). */
export function chainMultiplier(links: number): number {
  return Math.min(2.0, 1 + 0.25 * Math.max(0, links - 1));
}
// the vouching: which stock grades answer at which gleam band (gleam-bands, L6 §4).
// Proud opens at 6 ("proud stalls begin to lean in"); the 13+ full-width nuance is Phase 6.
export const GRADE_VOUCH: Record<string, number> = { apprentice: 0, mid: 6, proud: 6, capstone: 21 };
export const STOCK_GRADE: Record<string, string> = { "singing-silver": "proud" };

export interface EffectContext {
  selfId: string;                       // the acting piece's instanceId
  cardOf: (cardId: string) => Card;     // the content table (marks, ceilings, grains)
}

export interface Resolution {
  state: GameState;
  events: GameEvent[];
}

// ----- small helpers -----

function amountOf(v: unknown, state: GameState, ctx: EffectContext, fallback = 0): number {
  if (v === undefined) return fallback;
  if (typeof v === "number") return v;
  if (isReadExpr(v)) return evaluateRead(v.source, state, { grainOf: id => ctx.cardOf(id).grain });
  throw new Error(`malformed amount in card data: ${JSON.stringify(v)}`);
}

function pieceById(state: GameState, id: string): PieceInstance | undefined {
  return state.pieces.find(p => p.instanceId === id);
}

function pieceCountsAs(p: PieceInstance, grain: Grain, ctx: EffectContext): boolean {
  return countsAs(p, grain, ctx.cardOf(p.cardId).grain);
}

/** Target selectors from card data; deterministic (first match in pieces order). */
function resolveTarget(
  state: GameState, target: unknown, ctx: EffectContext, suit?: Grain,
): PieceInstance | null {
  const pieces = state.pieces;
  switch (target) {
    case undefined:
    case "self":
      return pieceById(state, ctx.selfId) ?? null;
    case "held:capstone":
      // "held" = not yet fired (canon fired-vs-held) — in hand OR banked cold in play
      return pieces.find(p => !p.fired && (p.zone === "hand" || p.zone === "in-play") &&
        (ctx.cardOf(p.cardId).tags ?? []).some(t => t === "capstone" || t === "proud")) ?? null;
    case "hand:offgrain":
      return pieces.find(p => p.zone === "hand" && suit !== undefined &&
        !pieceCountsAs(p, suit, ctx)) ?? null;
    case "hand:cheapest": {
      const hand = pieces.filter(p => p.zone === "hand");
      if (hand.length === 0) return null;
      return hand.reduce((a, b) => ctx.cardOf(b.cardId).mark < ctx.cardOf(a.cardId).mark ? b : a);
    }
    case "inert:hand":
      return pieces.find(p => p.zone === "hand" && !p.fired) ?? null;
    case "inert:pack":
      return pieces.find(p => p.zone === "pack" && !p.fired) ?? null;
    default:
      throw new Error(`unknown target selector in card data: ${String(target)}`);
  }
}

export function emit(state: GameState, type: string, data?: Record<string, unknown>): void {
  state.events.push({ morning: state.calendar.morning, type, ...(data ? { data } : {}) });
}

function refuse(state: GameState, effect: Effect, why: string): void {
  emit(state, "refused", { do: effect.do, why });
}

// ----- gleam: one door (task decision 3) -----

export interface GleamProvenance {
  overkillExcess: number;   // the measured genuine excess this credit traces to
}

/** The ONLY way Standing rises. Demands provenance; a credit can never exceed it. */
export function creditGleam(
  state: GameState, amount: number, grain: Grain, provenance: GleamProvenance,
): void {
  if (!provenance || typeof provenance.overkillExcess !== "number" || provenance.overkillExcess <= 0) {
    throw new Error("gleam credit without overflow provenance (no free mint)");
  }
  if (amount > provenance.overkillExcess) {
    throw new Error(`gleam credit ${amount} exceeds measured overflow ${provenance.overkillExcess}`);
  }
  if (amount <= 0) return;
  state.player.gleam += amount;
  if (state.player.gleam > state.player.peakGleam) state.player.peakGleam = state.player.gleam;
  state.player.gleamGrain[grain] += amount;   // the-grain-of-gleam
  emit(state, "gleam", { amount, grain, overkill: provenance.overkillExcess });
}

/**
 * The ONLY way Standing FALLS: the spilling (a flopped/stale asking, L1 §4). Outcome-only and
 * EV-negative by canon; distinct from creditGleam (which forbids decrements). Lowers CURRENT
 * gleam toward a floor of 0 — never peakGleam (the filter-1 ratchet is one-way). The loss is not
 * grain-tied (a flop isn't a craft), so it draws proportionally from the grain tags to keep them
 * consistent with the meter.
 */
export function spillGleam(state: GameState, amount: number, reason: string): void {
  if (amount <= 0) return;
  const before = state.player.gleam;
  const lost = Math.min(amount, before);
  if (lost <= 0) { emit(state, "spilled", { amount: 0, reason, gleam: before }); return; }
  state.player.gleam = before - lost;
  const scale = (before - lost) / before;   // shrink each grain tag by the same ratio
  for (const g of Object.keys(state.player.gleamGrain) as Grain[]) {
    state.player.gleamGrain[g] *= scale;
  }
  emit(state, "spilled", { amount: lost, reason, gleam: state.player.gleam });
}

// ----- engine automatics (locked L1 machinery; shared with Phase 3's turn loop) -----

/** Total gleam a given excess is worth under a band: full rate in the band, then diminishing. */
export function convertOverkill(excess: number, extraBand = 0): number {
  const band = FULL_RATE_BAND + extraBand;
  return Math.min(excess, band) + Math.floor(Math.max(0, excess - band) * DIMINISH_RATE);
}

/** A piece crosses its fixed mark: fired forever, auto-seated typed by its grain. */
export function applyWake(state: GameState, piece: PieceInstance, ctx: EffectContext): void {
  if (piece.fired) return;   // the fired never unfires — and never re-fires
  piece.fired = true;
  piece.wokeThisMorning = true;
  piece.zone = "in-play";
  emit(state, "woke", { piece: piece.instanceId, grain: ctx.cardOf(piece.cardId).grain });
}

/**
 * Pour attention onto a piece: spend from the room at face value, land it multiplied
 * by the chain, and run the wake/overkill automatics. Shared by the `rest` verb and
 * the act of playing itself (L1: the play spends the room as a multiplier). Returns
 * what landed (0 = nothing to spend).
 */
export function pourAttention(
  state: GameState, piece: PieceInstance, requested: number, ctx: EffectContext,
): number {
  const spend = Math.min(requested, state.turn.room);
  if (spend <= 0) return 0;
  const landed = spend * chainMultiplier(state.turn.chainLinks);
  const card = ctx.cardOf(piece.cardId);
  state.turn.room -= spend;
  state.turn.pouredThisMorning += spend;
  piece.set += landed;
  emit(state, "rested", { piece: piece.instanceId, spend, landed, set: piece.set });
  if (!piece.fired && piece.set >= card.mark) applyWake(state, piece, ctx);
  const excess = Math.max(0, piece.set - card.ceiling);
  state.turn.overCeiling = excess;
  state.turn.overkillPieceId = excess > 0 ? piece.instanceId : null;
  settleOverkill(state, piece, ctx);
  return landed;
}

/**
 * Settle a piece's overkill ledger: credit exactly the gap between what its total
 * measured excess is worth (under its current band) and what was already credited.
 * Splitting rests or repeating brims can therefore never mint more than one
 * conversion of the same excess — the ledger, not the caller, holds the invariant.
 */
export function settleOverkill(state: GameState, piece: PieceInstance, ctx: EffectContext): void {
  const card = ctx.cardOf(piece.cardId);
  const excess = Math.max(0, piece.set - card.ceiling);
  if (excess <= 0) return;
  const worth = convertOverkill(excess, piece.brimBand);
  const delta = worth - piece.overkillCredited;
  if (delta <= 0) return;
  piece.overkillCredited = worth;
  emit(state, "overkilled", { piece: piece.instanceId, excess });   // raises on-overkill
  creditGleam(state, delta, card.grain, { overkillExcess: excess });
}

// ----- the fourteen resolvers -----

type Resolver = (state: GameState, effect: Effect, ctx: EffectContext) => void;

const RESOLVERS: Record<PrimitiveId, Resolver> = {

  // -- the honest floor --
  warm(state, effect, ctx) {
    const self = pieceById(state, ctx.selfId);
    if (!self) return refuse(state, effect, "no acting piece");
    const n = amountOf(effect.params?.n, state, ctx, 1);
    self.delightBonus += n;
    emit(state, "warmed", { piece: self.instanceId, n });
  },

  keep(state, effect, ctx) {
    const self = pieceById(state, ctx.selfId);
    if (!self) return refuse(state, effect, "no acting piece");
    self.freshness += 1;
    emit(state, "kept", { piece: self.instanceId, freshness: self.freshness });
  },

  // -- turn-state --
  steady(state, effect, ctx) {
    const links = amountOf(effect.params?.links, state, ctx, 0);
    state.turn.chainLinks += links;
    if (effect.params?.brace === true) state.turn.braced = true;
    emit(state, "steadied", { links, braced: state.turn.braced });
  },

  gather(state, effect, ctx) {
    // seating, not adding: the amount is SEATS, and the nth seat this morning
    // contributes 2 × 0.8^(n-1) room — the softcap is the decay, not a ceiling.
    const seats = Math.floor(amountOf(effect.params?.amount, state, ctx));
    if (seats < 1) return refuse(state, effect, "no one to seat");
    let gain = 0;
    for (let i = 0; i < seats; i++) {
      gain += SEAT_FIRST * SEAT_DECAY ** (state.turn.seatedCount + i);
    }
    state.turn.seatedCount += seats;
    state.turn.room += gain;
    emit(state, "gathered", { seats, gain, room: state.turn.room });
  },

  // -- specialization writers --
  "mark-grain"(state, effect, ctx) {
    const suit = effect.params?.suit as Grain;
    const target = resolveTarget(state, effect.params?.target, ctx, suit);
    if (!target) return refuse(state, effect, "no stampable target");
    if (!target.stampedGrains.includes(suit)) target.stampedGrains.push(suit);
    target.stampedThisMorning = true;
    emit(state, "stamped", { piece: target.instanceId, suit });
  },

  draw(state, effect, ctx) {
    const n = amountOf(effect.params?.n, state, ctx, 1);
    const suit = effect.params?.suit as Grain | undefined;
    const pack = state.pieces.filter(p => p.zone === "pack");
    const drawn: string[] = [];
    for (let i = 0; i < n && pack.length > 0; i++) {
      let idx: number;
      if (suit) {
        // a filtered draw SEARCHES the pack — deterministic first match
        idx = pack.findIndex(p => pieceCountsAs(p, suit, ctx));
        if (idx < 0) break;
      } else {
        [idx, state.rng] = nextInt(state.rng, pack.length);
      }
      const [pick] = pack.splice(idx, 1);
      pick.zone = "hand";
      drawn.push(pick.instanceId);
    }
    if (drawn.length === 0) return refuse(state, effect, "nothing to draw");
    emit(state, "drew", { pieces: drawn, suit: suit ?? null });
  },

  retire(state, effect, ctx) {
    const target = resolveTarget(state, effect.params?.target, ctx);
    if (!target || target.fired) return refuse(state, effect, "no inert piece to last-light");
    // retire-residual (L6): this-cycle unspent attention ONLY — a never-rested piece
    // returns 0; the deck-thinning is the payoff (cycle net attention < 0 by design)
    const worth = target.set;
    state.pieces = state.pieces.filter(p => p.instanceId !== target.instanceId);
    const to = effect.params?.to ?? "table";
    if (to === "room") state.turn.room += worth;
    else currentNode(state).localTable += worth;    // node-bound, no caravanning
    emit(state, "retired", { piece: target.instanceId, worth, to });
  },

  whittle(state, effect, ctx) {
    // the-bounded-whittle (L6 §5): yields exactly 1 dull, at most once per morning,
    // and consumes one apprentice-stuff — an inventory-bounded faucet, never a mint
    if (state.turn.whittledThisMorning) return refuse(state, effect, "the shavings are carved for today");
    const returnShare = amountOf(effect.params?.amount, state, ctx);
    if (returnShare < 1) return refuse(state, effect, "too thin a return to carve");
    const stuffAt = state.player.stock.findIndex(s => s.grade === "apprentice");
    if (stuffAt < 0) return refuse(state, effect, "no apprentice-stuff to carve");
    state.player.stock.splice(stuffAt, 1);
    state.player.handsels.push({ brightness: 1, idleMornings: 0 });
    state.turn.whittledThisMorning = true;
    emit(state, "whittled", { returnShare, handsels: 1 });
  },

  court(state, effect, ctx) {
    const stock = effect.params?.stock;
    if (typeof stock !== "string") throw new Error("court without a stock (validate.ts should have caught this)");
    // the vouching: gleam GATES by the stock's grade band and is never spent
    const grade = STOCK_GRADE[stock] ?? "mid";
    if (state.player.gleam < (GRADE_VOUCH[grade] ?? GRADE_VOUCH.mid)) {
      return refuse(state, effect, `the vouching is closed (${grade} stock)`);
    }
    // the term: a performable condition. Number = required chain length;
    // object form = { if: <read>, at_least: <amount> } straight from the card data.
    const term = effect.params?.term;
    let met: boolean;
    if (typeof term === "number" || term === undefined) {
      met = state.turn.chainLinks >= (term ?? 1);
    } else if (isTermExpr(term)) {
      const observed = evaluateRead(term.if.source, state, { grainOf: id => ctx.cardOf(id).grain });
      met = observed >= amountOf(term.at_least, state, ctx, 1);
    } else {
      throw new Error(`malformed court term: ${JSON.stringify(term)} (validate.ts should have caught this)`);
    }
    if (!met) return refuse(state, effect, "the term is unmet");
    state.player.stock.push({ id: stock, grade: grade as "apprentice" | "named" | "twice-benched", freshness: 2 });
    emit(state, "courted", { stock, grade });
  },

  soothe(state, effect, ctx) {
    // last-red-cap (L6): mend = min(requested, rings, 2); at most 4 soothes a run;
    // the soothed node loses its ring-indexed dawn draw (no retained skip-capacity)
    if (state.player.soothesUsed >= SOOTHE_RUN_MAX) return refuse(state, effect, "the season's soothing is spent");
    const node = currentNode(state);
    if (node.lastRed < 1) return refuse(state, effect, "no last-red catalyst");
    const base = amountOf(effect.params?.amount, state, ctx, 1);
    const scale = amountOf(effect.params?.scale, state, ctx, 1);
    const mend = Math.min(base * scale, node.rings, SOOTHE_MEND_CAP);
    if (mend < 1) return refuse(state, effect, "nothing to mend");   // the catalyst is NOT spent
    node.lastRed -= 1;
    node.rings -= mend;
    node.soothed = true;
    state.player.soothesUsed += 1;
    emit(state, "soothed", { node: node.id, mend, rings: node.rings });
  },

  // -- the working core --
  fill(state, effect, ctx) {
    if (!state.asking) return refuse(state, effect, "no accepted asking");
    const amount = amountOf(effect.params?.amount, state, ctx);
    if (amount < 1) return refuse(state, effect, "nothing to pour");
    state.asking.progress += amount;
    state.asking.touched = true;
    emit(state, "filled", {
      piece: ctx.selfId,   // attribution: which card poured — the harness's per-card fill telemetry
      amount,
      progress: state.asking.progress,
      complete: state.asking.progress >= state.asking.needFill,
    });
  },

  rest(state, effect, ctx) {
    const target = resolveTarget(state, effect.params?.target, ctx);
    if (!target) return refuse(state, effect, "no piece to rest on");
    const requested = amountOf(effect.params?.amount, state, ctx);
    if (Math.min(requested, state.turn.room) < 1) return refuse(state, effect, "the room is empty");
    pourAttention(state, target, requested, ctx);
  },

  brim(state, effect, ctx) {
    // brim amplifies the CURRENT play's overkill: it widens that piece's band and
    // settles the ledger — repeat brims can only ever approach the full excess.
    const overkillPiece = state.turn.overkillPieceId
      ? pieceById(state, state.turn.overkillPieceId) : undefined;
    if (!overkillPiece || state.turn.overCeiling <= 0) {
      return refuse(state, effect, "no genuine overkill to widen");
    }
    const bandParam = effect.params?.band;
    if (isReadExpr(bandParam) && !BRIM_BAND_SOURCES.includes(bandParam.source)) {
      throw new Error(`brim band reads "${bandParam.source}" — gleam firewall (validate.ts should have caught this)`);
    }
    const widen = amountOf(bandParam, state, ctx);
    if (widen < 1) return refuse(state, effect, "no band to widen");
    const before = overkillPiece.overkillCredited;
    overkillPiece.brimBand += widen;
    settleOverkill(state, overkillPiece, ctx);
    const extra = overkillPiece.overkillCredited - before;
    if (extra <= 0) return refuse(state, effect, "nothing past the band to recover");
    emit(state, "brimmed", { widen, extra });
  },

  read() {
    throw new Error("read is amount-syntax, never a standalone verb (validate.ts should have caught this)");
  },
};

interface TermExpr { if: ReadExpr; at_least?: unknown; }
function isTermExpr(v: unknown): v is TermExpr {
  return !!v && typeof v === "object" && isReadExpr((v as TermExpr).if);
}

/** Mutating core — for the turn loop (morning.ts), which owns its own clone boundary. */
export function applyEffect(state: GameState, effect: Effect, ctx: EffectContext): void {
  const resolver = RESOLVERS[effect.do];
  if (!resolver) throw new Error(`unknown primitive "${effect.do}"`);
  resolver(state, effect, ctx);
}

/** Resolve one effect. Pure: the input state is untouched. */
export function resolveEffect(state: GameState, effect: Effect, ctx: EffectContext): Resolution {
  const next = structuredClone(state);
  const before = next.events.length;
  applyEffect(next, effect, ctx);
  return { state: next, events: next.events.slice(before) };
}
