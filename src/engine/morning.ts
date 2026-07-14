// morning.ts — the conductor: one worked morning, dawn to dusk (GDD L1, D-010).
// The API bots and the toy morning drive: dawn → (playPiece | stallAction)* → dusk.
// Each entry point is pure (clones once, mutates the clone via effects.ts's core).

import type { Card, Effect } from "./vocabulary.js";
import type { GameEvent, GameState, PieceInstance } from "./state.js";
import { MORNINGS_PER_LEG, currentNode } from "./state.js";
import { applyEffect, emit, pourAttention, SEAT_FIRST, SEAT_DECAY } from "./effects.js";
import { nextInt } from "./rng.js";

// ----- locked L6 constants + the one D-010 dial -----
export const DAWN_BASE = 2;             // dawn-floor-base: always wakes the cheapest piece
export const DAWN_PER_RING = 0.5;       // dawn-ring-draw (zeroed on a soothed node)
export const CAMP_RETURN_SHARE = 2 / 3; // camped dawns recover ⅔ of yesterday's table
export const HAND_SIZE = 5;
export const STALL_ROOM_FACTOR = 0.5;   // D-010 B2 — the M4 dial
export const HANDSEL_LAPSE_MORNINGS = 3; // idle-lapse: dim per morning, gone after 3

export interface MorningContext {
  cardOf: (cardId: string) => Card;
}

export interface MorningResult {
  state: GameState;
  events: GameEvent[];
}

/** Which leg a worked morning falls in (mornings-per-leg 4·6·7·7·3, locked). */
export function legOf(morning: number): number {
  let past = 0;
  for (let leg = 0; leg < MORNINGS_PER_LEG.length; leg++) {
    past += MORNINGS_PER_LEG[leg];
    if (morning <= past) return leg;
  }
  return MORNINGS_PER_LEG.length - 1;
}

// ----- the trigger cascade (D-010 B3: chain order, fire-once per morning) -----

// engine events → the card triggers they raise ("filled" is special-cased on completion)
const TRIGGER_OF: Record<string, string> = {
  woke: "on-wake",
  overkilled: "on-overkill",
  courted: "on-court",
  stalled: "on-stall",
  played: "on-chain",   // the chain grew — on-chain listeners (incl. the new link) fire once
};

function effectKey(instanceId: string, effectIndex: number): string {
  return `${instanceId}#${effectIndex}`;
}

function fireEffectOnce(
  state: GameState, piece: PieceInstance, eff: Effect, index: number, ctx: MorningContext,
): void {
  const key = effectKey(piece.instanceId, index);
  if (state.turn.firedEffectKeys.includes(key)) return;
  state.turn.firedEffectKeys.push(key);
  applyEffect(state, eff, { selfId: piece.instanceId, cardOf: ctx.cardOf });
}

/** Scan events from `cursor` on; fire listeners in played order; keep going until stable. */
function runCascade(state: GameState, ctx: MorningContext, cursor: number): void {
  while (cursor < state.events.length) {
    const ev = state.events[cursor++];
    const trigger =
      ev.type === "filled" && ev.data?.complete === true ? "on-fulfil" : TRIGGER_OF[ev.type];
    if (!trigger) continue;
    // the CAUSE piece fires its own effects first: a wake licenses that piece's
    // on-wake effects whether or not it was played (L3 §0 — "becomes eligible")
    const listeners: string[] = [];
    const cause = ev.data?.piece;
    if ((trigger === "on-wake" || trigger === "on-overkill") && typeof cause === "string") {
      listeners.push(cause);
    }
    listeners.push(...state.turn.playedOrder);
    const seen = new Set<string>();
    for (const pid of listeners) {
      if (seen.has(pid)) continue;
      seen.add(pid);
      const piece = state.pieces.find(p => p.instanceId === pid);
      if (!piece) continue;   // retired mid-morning
      ctx.cardOf(piece.cardId).effects.forEach((eff, i) => {
        if (eff.when === trigger) fireEffectOnce(state, piece, eff, i, ctx);
      });
    }
  }
}

// ----- dawn -----

/** Refill the hand to 5; the discard reshuffles in only when the pack runs dry (D-010 B4). */
function refillHand(state: GameState): string[] {
  const drawn: string[] = [];
  while (state.pieces.filter(p => p.zone === "hand").length < HAND_SIZE) {
    let pack = state.pieces.filter(p => p.zone === "pack");
    if (pack.length === 0) {
      const discard = state.pieces.filter(p => p.zone === "discard");
      if (discard.length === 0) break;
      discard.forEach(p => { p.zone = "pack"; });
      pack = discard;
    }
    let idx: number;
    [idx, state.rng] = nextInt(state.rng, pack.length);
    pack[idx].zone = "hand";
    drawn.push(pack[idx].instanceId);
  }
  return drawn;
}

export function dawn(stateIn: GameState, ctx: MorningContext): MorningResult {
  const state = structuredClone(stateIn);
  const before = state.events.length;

  if (state.turn.dawned) state.calendar.morning += 1;
  state.calendar.leg = legOf(state.calendar.morning);

  // dawn-reset: morning flags clear; cold pieces release (their set was swept at dusk — B1)
  for (const p of state.pieces) {
    p.wokeThisMorning = false;
    p.stampedThisMorning = false;
    p.playedThisMorning = false;
    if (!p.fired) p.set = 0;
  }

  // income: the home-note seat + every fired piece seated under the decaying-seat law,
  // plus the flat base, the ring draw (unless soothed), and the camped table share
  const node = currentNode(state);
  const seats = 1 + state.pieces.filter(p => p.fired).length;
  let seatRoom = 0;
  for (let i = 0; i < seats; i++) seatRoom += SEAT_FIRST * SEAT_DECAY ** i;
  const ringDraw = node.soothed ? 0 : DAWN_PER_RING * node.rings;
  const tableDraw = state.board.camped ? CAMP_RETURN_SHARE * node.localTable : 0;
  node.localTable = 0;   // yesterday's RETURN only — the rest soaks into the town

  state.turn = {
    room: DAWN_BASE + seatRoom + ringDraw + tableDraw,
    chainLinks: 0, braced: false, stalled: false,
    overCeiling: 0, overkillPieceId: null,
    seatedCount: seats, whittledThisMorning: false,
    dawned: true, playedOrder: [], firedEffectKeys: [],
  };

  const drawn = refillHand(state);
  emit(state, "dawn", {
    morning: state.calendar.morning, leg: state.calendar.leg,
    room: state.turn.room, seats, ringDraw, tableDraw, drew: drawn,
  });

  // on-dawn effects fire from FIRED pieces only (D-010 B5), in pieces order
  for (const p of state.pieces) {
    if (!p.fired) continue;
    ctx.cardOf(p.cardId).effects.forEach((eff, i) => {
      if (eff.when === "on-dawn") fireEffectOnce(state, p, eff, i, ctx);
    });
  }
  runCascade(state, ctx, before);
  return { state, events: state.events.slice(before) };
}

// ----- the two morning actions -----

/**
 * Play a piece: the one exchange gate. The play itself POURS `pour` attention from
 * the room onto the piece (L1 — the play spends the room as a multiplier; pour 0
 * banks it cold), then its on-play effects fire, then triggered listeners cascade.
 */
export function playPiece(
  stateIn: GameState, instanceId: string, pour: number, ctx: MorningContext,
): MorningResult {
  const state = structuredClone(stateIn);
  const before = state.events.length;
  const piece = state.pieces.find(p => p.instanceId === instanceId);
  if (!piece || piece.zone !== "hand") {
    emit(state, "refused", { do: "play", why: "not in hand" });
    return { state, events: state.events.slice(before) };
  }
  piece.zone = "in-play";
  piece.playedThisMorning = true;
  state.turn.playedOrder.push(instanceId);
  state.turn.chainLinks += 1;
  emit(state, "played", { piece: instanceId, link: state.turn.chainLinks, pour });
  const effCtx = { selfId: instanceId, cardOf: ctx.cardOf };
  if (pour > 0) pourAttention(state, piece, pour, effCtx);
  ctx.cardOf(piece.cardId).effects.forEach((eff, i) => {
    if (eff.when === "on-play") fireEffectOnce(state, piece, eff, i, ctx);
  });
  runCascade(state, ctx, before);
  return { state, events: state.events.slice(before) };
}

/** Any morning action that isn't a play: braced ? absorbed : the room halves, the chain breaks. */
export function stallAction(stateIn: GameState, ctx: MorningContext, kind = "errand"): MorningResult {
  const state = structuredClone(stateIn);
  const before = state.events.length;
  if (state.turn.braced) {
    state.turn.braced = false;
    emit(state, "brace-held", { kind });
  } else {
    state.turn.room = Math.floor(state.turn.room * STALL_ROOM_FACTOR);
    state.turn.chainLinks = 0;
    state.turn.stalled = true;
    emit(state, "stalled", { kind, room: state.turn.room });
  }
  runCascade(state, ctx, before);
  return { state, events: state.events.slice(before) };
}

// ----- dusk -----

export interface DuskChoice {
  camp?: boolean;   // FIDELITY: travel is stubbed until Phase 5's map — camp is the default
}

export function dusk(stateIn: GameState, ctx: MorningContext, choice: DuskChoice = {}): MorningResult {
  const state = structuredClone(stateIn);
  const before = state.events.length;

  // at-dusk effects (same eligibility as dawn: fired pieces only)
  for (const p of state.pieces) {
    if (!p.fired) continue;
    ctx.cardOf(p.cardId).effects.forEach((eff, i) => {
      if (eff.when === "at-dusk") fireEffectOnce(state, p, eff, i, ctx);
    });
  }
  runCascade(state, ctx, before);

  // the B1 dusk sweep: unspent room + cold pieces' rested attention → THIS node's table
  const node = currentNode(state);
  const unspent = state.turn.room;
  let coldSet = 0;
  for (const p of state.pieces) {
    if (!p.fired && p.set > 0) { coldSet += p.set; p.set = 0; }
  }
  const sweep = unspent + coldSet;
  state.turn.room = 0;
  node.localTable += sweep;

  // cards cycle: unplayed hand + everything in play → the discard (D-010 B4)
  for (const p of state.pieces) {
    if (p.zone === "hand" || p.zone === "in-play") p.zone = "discard";
  }

  // idle-lapse (L6 §5): handsels dim each idle morning; a dull gone 3 mornings seeps to the table
  state.player.handsels = state.player.handsels.filter(h => {
    h.idleMornings += 1;
    if (h.brightness > 1) { h.brightness -= 1 as 1 | 2; return true; }
    if (h.idleMornings >= HANDSEL_LAPSE_MORNINGS) { node.localTable += 1; return false; }
    return true;
  });

  state.board.camped = choice.camp !== false;
  emit(state, "dusk", { sweep, unspent, coldSet, table: node.localTable, camped: state.board.camped });
  return { state, events: state.events.slice(before) };
}
