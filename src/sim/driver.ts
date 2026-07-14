// driver.ts — the run-driver (engine Phase 7): play a whole seeded run through the engine's PUBLIC
// API only (never its internals), collecting the event log + final state + the per-morning samples
// the emitter can't get from events. Deterministic: same (seed, archetype, policy) → identical run.
//
// Part A ships one generic baseline policy to de-risk the pipeline; Part B adds the six archetype
// policies. Archetype identity lives in policy (and the seeded Way-cards), never in the engine.

import type { Card } from "../engine/vocabulary.js";
import type { GameEvent, GameState } from "../engine/state.js";
import { createInitialState } from "../engine/state.js";
import { dawn, dusk, playPiece, stallAction, type MorningContext } from "../engine/morning.js";
import { ACQUISITION_TUNABLES, draftFair, fairCostOf, mintPiece, releaseCard } from "../engine/acquisition.js";
import starterPool from "../content/cards/starter-pool.json" with { type: "json" };

const POOL = new Map((starterPool.cards as unknown as Card[]).map(c => [c.id, c]));
/** Card lookup shared with the emitter — the sim pool is the locked content, so a miss is a bug. */
export const cardOf = (id: string): Card => {
  const c = POOL.get(id);
  if (!c) throw new Error(`sim: no card ${id}`);
  return c;
};
const CTX: MorningContext = { cardOf };

export const WAYS = ["kilnfast", "eveners", "untold", "fairwrights", "mannerly", "gleaners"] as const;
export type Archetype = (typeof WAYS)[number] | "apprentice";
export const ARCHETYPES: readonly Archetype[] = ["apprentice", ...WAYS];

export type Action =
  | { kind: "play"; instanceId: string; pour: number }
  | { kind: "draft"; cardId: string }
  | { kind: "release"; instanceId: string }
  | { kind: "stall" }
  | { kind: "end"; camp?: boolean };

export type Policy = (state: GameState, ctx: MorningContext) => Action;

/** Per-morning sample of things the event log doesn't carry (deck size, waking capacity, difficulty). */
export interface LegSample {
  morning: number; leg: number; rings: number; deckSize: number; wakingCapacity: number; difficulty: number;
}
export interface RunObservations {
  archetype: Archetype;
  seed: number;
  finalState: GameState;
  events: GameEvent[];
  decisionsPerMorning: number[];
  legSamples: LegSample[];
}

const MAX_ACTIONS_PER_MORNING = 40;   // safety net against a policy that never yields "end"

const fillsNeed = (c: Card): boolean => c.effects.some(e => e.do === "fill");

/**
 * The generic baseline (greedy-but-competent, Part A): pour into the need with a filler when one is
 * in hand, else wake the cheapest affordable card, else grow the deck from the Fair, else end the
 * morning. Legal and terminating (each play empties a hand slot; drafts are capped), not optimized.
 */
export const baselinePolicy: Policy = (state, ctx) => {
  const room = state.turn.room;
  const hand = state.pieces.filter(p => p.zone === "hand");

  if (room > 0) {
    // prefer a filler while a need is open, else the cheapest card we can afford to wake
    const affordable = hand
      .map(p => ({ p, card: ctx.cardOf(p.cardId) }))
      .filter(x => x.card.mark <= room);
    const filler = state.asking ? affordable.find(x => fillsNeed(x.card)) : undefined;
    const pick = filler ?? affordable.sort((a, b) => a.card.mark - b.card.mark)[0];
    if (pick) return { kind: "play", instanceId: pick.p.instanceId, pour: pick.card.mark };
  }

  // grow the deck: the cheapest offer we can pay for right now (handsels or a met chain-term), while
  // takes remain — the cap check keeps the policy from re-offering a draft the engine would refuse
  if (state.turn.draftedThisMorning < ACQUISITION_TUNABLES.DRAFT_PER_MORNING) {
    const offer = state.turn.fairOffers.find(id => {
      const cost = fairCostOf(id);
      return cost.kind === "handsel"
        ? state.player.handsels.length >= cost.price
        : state.turn.chainLinks >= cost.termChain;
    });
    if (offer) return { kind: "draft", cardId: offer };
  }

  return { kind: "end", camp: true };
};

/**
 * Seed a Way's STARTER cards into the pack (inert), like the toy's deck picker. Only cards tagged
 * `starter` join the opening deck; a Way's other cards are Fair-only variety it drafts during the run
 * (card-flow redesign Part 3 — keeps starting decks lean so the deeper pool is the source of "always
 * something new to wake", and so draft choices, not a fixed deck, drive run-to-run diversity).
 */
function seedDeck(state: GameState, archetype: Archetype): GameState {
  if (archetype === "apprentice") return state;
  for (const card of POOL.values()) {
    if (card.archetype === archetype && card.tags?.includes("starter")) mintPiece(state, card.id, "pack");
  }
  return state;
}

function sampleLeg(state: GameState, out: LegSample[]): void {
  const wakingCapacity = state.pieces
    .filter(p => p.fired)
    .reduce((sum, p) => sum + cardOf(p.cardId).woken_delight, 0);
  const rings = state.board.nodes.find(n => n.id === state.board.hereId)?.rings ?? 0;
  out.push({
    morning: state.calendar.morning, leg: state.calendar.leg, rings,
    deckSize: state.pieces.length, wakingCapacity, difficulty: state.asking?.needFill ?? 0,
  });
}

function applyAction(state: GameState, action: Action): GameState {
  switch (action.kind) {
    case "play": return playPiece(state, action.instanceId, action.pour, CTX).state;
    case "stall": return stallAction(state, CTX).state;
    case "draft": draftFair(state, action.cardId); return state;       // mutates in place
    case "release": releaseCard(state, action.instanceId); return state;
    case "end": return state;
  }
}

/** Play one full run to its end. Pure over the seeded engine — replays exactly. */
export function runGame(seed: number, archetype: Archetype, policy: Policy = baselinePolicy): RunObservations {
  let state = seedDeck(createInitialState(seed), archetype);
  const decisionsPerMorning: number[] = [];
  const legSamples: LegSample[] = [];

  state = dawn(state, CTX).state;
  sampleLeg(state, legSamples);

  while (!state.runEnded) {
    let decisions = 0;
    let camp = true;
    while (decisions < MAX_ACTIONS_PER_MORNING) {
      const action = policy(state, CTX);
      if (action.kind === "end") { camp = action.camp ?? true; break; }
      decisions += 1;
      state = applyAction(state, action);
      if (state.runEnded) break;
    }
    decisionsPerMorning.push(decisions);
    if (state.runEnded) break;
    state = dusk(state, CTX, { camp }).state;
    if (state.runEnded) break;
    state = dawn(state, CTX).state;
    sampleLeg(state, legSamples);
  }

  return { archetype, seed, finalState: state, events: state.events, decisionsPerMorning, legSamples };
}
