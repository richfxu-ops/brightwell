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

// ----- constants (traced to L6 where locked; PLACEHOLDERs are M4-tuning dials) -----
export const ROOM_SOFT_CAP = 10;      // gather plateau (L6 / L3 note)
export const FULL_RATE_BAND = 6;      // overkill→gleam at full rate for the first 6 (L6)
export const DIMINISH_RATE = 0.5;     // PLACEHOLDER: L6 locks the band, not the tail rate
export const SHAVINGS_SHARE = 1 / 3;  // the-shavings-share of a play's RETURN (L3)
export const RETIRE_BASE_WORTH = 1;   // PLACEHOLDER: last-lighting residual = base + rested set
export const VOUCH_FLOOR = 1;         // PLACEHOLDER: graded vouching bands land in Phase 6

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

function pieceCountsAs(state: GameState, p: PieceInstance, grain: Grain, ctx: EffectContext): boolean {
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
      return pieces.find(p => p.zone === "hand" &&
        (ctx.cardOf(p.cardId).tags ?? []).some(t => t === "capstone" || t === "proud")) ?? null;
    case "hand:offgrain":
      return pieces.find(p => p.zone === "hand" && suit !== undefined &&
        !pieceCountsAs(state, p, suit, ctx)) ?? null;
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

function emit(state: GameState, type: string, data?: Record<string, unknown>): void {
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
  state.player.gleamGrain[grain] += amount;   // the-grain-of-gleam
  emit(state, "gleam", { amount, grain, overkill: provenance.overkillExcess });
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
    const asked = amountOf(effect.params?.amount, state, ctx);
    // soft cap: you gain what you asked, up to the remaining headroom, never negative
    const gain = Math.min(asked, Math.max(0, ROOM_SOFT_CAP - state.turn.room));
    state.turn.room += gain;
    emit(state, "gathered", { asked, gain, room: state.turn.room });
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
        idx = pack.findIndex(p => pieceCountsAs(state, p, suit, ctx));
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
    const worth = RETIRE_BASE_WORTH + target.set;   // residual-only
    state.pieces = state.pieces.filter(p => p.instanceId !== target.instanceId);
    const to = effect.params?.to ?? "table";
    if (to === "room") state.turn.room += worth;
    else currentNode(state).localTable += worth;    // node-bound, no caravanning
    emit(state, "retired", { piece: target.instanceId, worth, to });
  },

  whittle(state, effect, ctx) {
    const returnShare = amountOf(effect.params?.amount, state, ctx);
    const shavings = Math.floor(returnShare * SHAVINGS_SHARE);
    if (shavings < 1) return refuse(state, effect, "too thin a return to carve");
    for (let i = 0; i < shavings; i++) {
      state.player.handsels.push({ brightness: 1, idleMornings: 0 });
    }
    emit(state, "whittled", { returnShare, handsels: shavings });
  },

  court(state, effect, ctx) {
    const stock = effect.params?.stock;
    if (typeof stock !== "string") throw new Error("court without a stock (validate.ts should have caught this)");
    // the vouching: gleam GATES and is never spent (read, compared, untouched)
    if (state.player.gleam < VOUCH_FLOOR) return refuse(state, effect, "the vouching is closed");
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
    state.player.stock.push({ id: stock, grade: "named", freshness: 2 });
    emit(state, "courted", { stock });
  },

  soothe(state, effect, ctx) {
    const node = currentNode(state);
    if (node.lastRed < 1) return refuse(state, effect, "no last-red catalyst");
    const base = amountOf(effect.params?.amount, state, ctx, 1);
    const scale = amountOf(effect.params?.scale, state, ctx, 1);
    // capped to the last-red: the mend can never exceed the catalysts the node holds
    const mend = Math.min(base * scale, node.lastRed);
    if (mend < 1) return refuse(state, effect, "nothing to mend");   // the catalyst is NOT spent
    node.lastRed -= 1;
    node.rings = Math.max(0, node.rings - mend);
    emit(state, "soothed", { node: node.id, mend, rings: node.rings });
  },

  // -- the working core --
  fill(state, effect, ctx) {
    if (!state.asking) return refuse(state, effect, "no accepted asking");
    const amount = amountOf(effect.params?.amount, state, ctx);
    if (amount < 1) return refuse(state, effect, "nothing to pour");
    state.asking.progress += amount;
    emit(state, "filled", {
      amount,
      progress: state.asking.progress,
      complete: state.asking.progress >= state.asking.needFill,
    });
  },

  rest(state, effect, ctx) {
    const target = resolveTarget(state, effect.params?.target, ctx);
    if (!target) return refuse(state, effect, "no piece to rest on");
    const card = ctx.cardOf(target.cardId);
    const requested = amountOf(effect.params?.amount, state, ctx);
    const spend = Math.min(requested, state.turn.room);
    if (spend < 1) return refuse(state, effect, "the room is empty");
    state.turn.room -= spend;
    target.set += spend;
    emit(state, "rested", { piece: target.instanceId, spend, set: target.set });
    if (!target.fired && target.set >= card.mark) applyWake(state, target, ctx);
    const excess = Math.max(0, target.set - card.ceiling);
    state.turn.overCeiling = excess;
    state.turn.overkillPieceId = excess > 0 ? target.instanceId : null;
    settleOverkill(state, target, ctx);
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

/** Resolve one effect. Pure: the input state is untouched. */
export function resolveEffect(state: GameState, effect: Effect, ctx: EffectContext): Resolution {
  const resolver = RESOLVERS[effect.do];
  if (!resolver) throw new Error(`unknown primitive "${effect.do}"`);
  const next = structuredClone(state);
  const before = next.events.length;
  resolver(next, effect, ctx);
  return { state: next, events: next.events.slice(before) };
}
