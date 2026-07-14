// acquisition.ts — the growth channels (engine Phase 6): the deck grows from the apprentice ~7
// toward ~20, so the run can build an engine big enough to stand the crown (Phase 5's win gate).
// GDD §3 (the glad-load teaches a piece) + D-013 ("the Fair", frequent drafting) + QUESTIONS.md §D.
//
// Two invariants hold across every channel: acquired pieces always arrive INERT (un-woken — they
// still cost a play to wake), and all randomness comes from the seeded `state.rng` (never
// Math.random) so a serialized run replays exactly (D-008). Every number is a named
// ACQUISITION_TUNABLES entry — the "feel it out first" constraint of Phases 4–5.
//
// Part 1 (here): the glad-load taught card, the release valve, and the piece-mint helper they
// share. Part 2 adds the Fair draft (rollFair / draftFair) and its tunables.

import type { GameState, PieceInstance } from "./state.js";
import type { Grain } from "./vocabulary.js";
import { nextInt } from "./rng.js";
import { emit } from "./effects.js";
import starterPool from "../content/cards/starter-pool.json" with { type: "json" };

// The acquirable universe: the journey-pieces (archetype ≠ "shared" — the apprentice 7 stay
// start-only). Read straight off the locked content, as state.ts imports shared/tiers.
interface PoolCard { id: string; grain: Grain; tier: number }
const cardTier = (wokenDelight: number): number => Math.min(3, Math.max(1, wokenDelight));
export const JOURNEY_POOL: readonly PoolCard[] = starterPool.cards
  .filter(c => c.archetype !== "shared")
  // c.grain is a validated content string; the locked pool only carries the six Grains
  .map(c => ({ id: c.id, grain: c.grain as Grain, tier: cardTier(c.woken_delight) }));

export const ACQUISITION_TUNABLES = {
  RELEASE_PER_MORNING: 1,   // un-woken pieces you may last-light out of the deck per morning (D-013)
  // the glad-load leans into your Way: a journey-piece of your dominant gleam-grain is this many
  // times likelier to be taught (D1; the "asking's grain pool" half is deferred — FIDELITY).
  GLAD_GRAIN_WEIGHT: 3,
} as const;

/** A fresh inert piece with a run-unique id — every acquisition channel mints through here. */
export function mintPiece(state: GameState, cardId: string, zone: "pack" | "hand"): PieceInstance {
  const piece: PieceInstance = {
    instanceId: `${cardId}#${state.nextPieceOrdinal}`,
    cardId, zone, fired: false, set: 0, stampedGrains: [],
    wokeThisMorning: false, stampedThisMorning: false, playedThisMorning: false,
    freshness: 2, delightBonus: 0, overkillCredited: 0, brimBand: 0,
  };
  state.nextPieceOrdinal += 1;
  state.pieces.push(piece);
  return piece;
}

/** The maker's brightest gleam-grain — the Way the country teaches into. null when all are cold. */
function dominantGrain(state: GameState): Grain | null {
  const g = state.player.gleamGrain;
  let best: Grain | null = null;
  let bestValue = 0;
  // keys of a Record<Grain, number> are exactly the six Grains
  for (const grain of Object.keys(g) as Grain[]) {
    if (g[grain] > bestValue) { best = grain; bestValue = g[grain]; }
  }
  return best;
}

/**
 * The glad-load's taught piece (GDD §3): fulfilling a need teaches one journey-piece, arriving
 * inert in the pack, weighted toward the maker's dominant gleam-grain (D1). Called from payGladLoad.
 */
export function teachGladLoad(state: GameState): void {
  const dominant = dominantGrain(state);
  // a dominant-grain piece counts GLAD_GRAIN_WEIGHT tickets in the bag, every other piece 1
  const weights = JOURNEY_POOL.map(c =>
    dominant && c.grain === dominant ? ACQUISITION_TUNABLES.GLAD_GRAIN_WEIGHT : 1);
  const total = weights.reduce((a, b) => a + b, 0);
  let roll: number;
  [roll, state.rng] = nextInt(state.rng, total);
  let i = 0;
  while (roll >= weights[i]) { roll -= weights[i]; i += 1; }
  const taught = JOURNEY_POOL[i];
  mintPiece(state, taught.id, "pack");
  emit(state, "taught", { cardId: taught.id, grain: taught.grain });
}

/**
 * Last-light (release): thin the deck by one un-woken piece, capped per morning — the valve that
 * lets the Fair grow the deck past ~20 without ballooning (D-013). A fired piece cannot be released
 * (it has woken and serves every dawn). Returns true if a piece left the run.
 */
export function releaseCard(state: GameState, instanceId: string): boolean {
  if (state.turn.releasedThisMorning >= ACQUISITION_TUNABLES.RELEASE_PER_MORNING) {
    emit(state, "refused", { do: "release", why: "already last-lit this morning" });
    return false;
  }
  const piece = state.pieces.find(p => p.instanceId === instanceId);
  if (!piece) {
    emit(state, "refused", { do: "release", why: "no such piece" });
    return false;
  }
  if (piece.fired) {
    emit(state, "refused", { do: "release", why: "a woken piece cannot be last-lit" });
    return false;
  }
  state.pieces = state.pieces.filter(p => p.instanceId !== instanceId);
  state.turn.releasedThisMorning += 1;
  emit(state, "released", { cardId: piece.cardId });
  return true;
}
