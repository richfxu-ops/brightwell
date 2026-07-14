// asking.ts — the contract lifecycle (engine Phase 4): accept · work · fulfil · escalate ·
// go-stale. GDD §3 + QUESTIONS.md §C. The `work` step lives in effects.ts (the `fill` verb);
// this module owns the rest and the run-economy payout/loss around it.
//
// EVERY number is a named ASKING_TUNABLES entry — the design is provisional ("feel it out
// first"), so changing any dial is a one-line edit here, never a logic hunt. All M4-tunable.

import type { GameState, Asking } from "./state.js";
import { SEASON_SEEP_BY_LEG, currentNode } from "./state.js";
import { emit, spillGleam } from "./effects.js";

type Tier = Asking["tier"];

export const ASKING_TUNABLES = {
  // --- the tier ladder: a tier's name ↔ its demand (woken delight to clear). CANON §C. ---
  TIER_DEMAND: { kettle: 1, plea: 3, poem: 5, great: 7, crown: 10 } as Record<Tier, number>,

  // --- escalate: how the next asking is sized (max of three inputs, filter-1). ---
  // weather floor = the season-seep by leg (1·3·5·7·7), reused from state.ts. CANON.
  RINGS_PER_SKIP: 1,          // a stale/skipped need chalks this many spiral rings per season. CANON.
  // peak Standing → a minimum demand it licenses (the fired one-way ratchet). Bands mirror the
  // stock-vouch bands in effects.ts (mid 6 · capstone 21) for a consistent Standing ladder.
  PEAK_GLEAM_BANDS: [
    { atLeast: 0, demand: 1 }, { atLeast: 6, demand: 3 },
    { atLeast: 12, demand: 5 }, { atLeast: 21, demand: 7 },
  ] as { atLeast: number; demand: number }[],

  // --- fulfil → the glad-load (rings-in = load-out). C6. ---
  GLAD_LOAD_BASE: 1,          // handsels paid before the ring bonus
  GLAD_LOAD_PER_RING: 1,      // + this many handsels per spiral ring the node carried
  GLAD_PALM: 1,               // + this on a doorstep kettle (C6)
  GLAD_HANDSEL_BRIGHTNESS: 2 as 1 | 2 | 3,   // "bright handsels" — warm, not dull

  // --- go-stale → the spilling (outcome-only Standing loss). C1, C3. ---
  STALE_AFTER_LEGS: 1,        // stale once carried past the leg it was accepted in (C3)
  SPILL_FLOOR: 1,             // a spill never costs less than this (C1 floor)
  // spill cost = the stale asking's own tier size (a stale poem costs 5), floored above. C1.
} as const;

/** The tier name whose demand is the largest at or below `needFill` (for display/spill cost). */
export function tierOf(needFill: number): Tier {
  const ladder = ASKING_TUNABLES.TIER_DEMAND;
  let best: Tier = "kettle";
  for (const t of Object.keys(ladder) as Tier[]) {
    if (ladder[t] <= needFill && ladder[t] >= ladder[best]) best = t;
  }
  return best;
}

/** The minimum demand this run's peak Standing has licensed (filter-1 ratchet). */
function peakDemand(peakGleam: number): number {
  let d = 0;
  for (const band of ASKING_TUNABLES.PEAK_GLEAM_BANDS) {
    if (peakGleam >= band.atLeast) d = Math.max(d, band.demand);
  }
  return d;
}

/** Size the next asking on the current node: the max of weather floor, skip-rings, and peak. */
function nextNeedFill(state: GameState): number {
  const weatherFloor = SEASON_SEEP_BY_LEG[state.calendar.leg];
  const ringDemand = currentNode(state).rings;   // rings ARE the spiral demand (3·5·7)
  return Math.max(weatherFloor, ringDemand, peakDemand(state.player.peakGleam));
}

/**
 * Accept-by-hand (single-node FIDELITY: auto-accepted at dawn when none is carried). Hangs a
 * fresh asking sized by escalation; the doorstep kettle is the tier-1 baseline.
 */
export function acceptAsking(state: GameState): void {
  const needFill = nextNeedFill(state);
  state.asking = {
    tier: tierOf(needFill),
    needFill,
    progress: 0,
    acceptedMorning: state.calendar.morning,
    acceptedLeg: state.calendar.leg,
    staleAfterMornings: 99,   // legacy field; staleness is leg-based now (see checkStaleAtDawn)
    touched: false,
  };
  emit(state, "accepted", { tier: state.asking.tier, needFill, leg: state.calendar.leg });
}

/**
 * Fulfil → the glad-load. Called when a fill completes the need. Pays handsels scaled off the
 * node's spiral (rings-in = load-out) + a glad-palm on kettles, re-makes the node, resets its
 * rings, and clears the asking so the next dawn hangs a fresh (and, via peak, larger) one.
 */
export function payGladLoad(state: GameState): void {
  const asking = state.asking;
  if (!asking) return;
  const node = currentNode(state);
  const T = ASKING_TUNABLES;
  const gladLoad = T.GLAD_LOAD_BASE + node.rings * T.GLAD_LOAD_PER_RING
    + (asking.tier === "kettle" ? T.GLAD_PALM : 0);
  for (let i = 0; i < gladLoad; i++) {
    state.player.handsels.push({ brightness: T.GLAD_HANDSEL_BRIGHTNESS, idleMornings: 0 });
  }
  const ringsCleared = node.rings;
  node.rings = 0;
  node.remade = true;
  emit(state, "fulfilled", { tier: asking.tier, gladLoad, rings: ringsCleared, taughtCard: true });
  state.asking = null;   // the town is re-made; the next gate hangs the next asking
}

/**
 * At dawn (after the calendar advances): if the carried asking has been held past its accepting
 * leg, it goes stale — the spilling (Standing loss = its tier size, floored), a spiral ring is
 * chalked on the node, and the asking is cleared so a fresh one is accepted. Returns true if it
 * spilled.
 */
export function checkStaleAtDawn(state: GameState): boolean {
  const asking = state.asking;
  if (!asking) return false;
  if (state.calendar.leg - asking.acceptedLeg < ASKING_TUNABLES.STALE_AFTER_LEGS) return false;
  const cost = Math.max(ASKING_TUNABLES.SPILL_FLOOR, ASKING_TUNABLES.TIER_DEMAND[asking.tier]);
  spillGleam(state, cost, "stale asking");
  currentNode(state).rings += ASKING_TUNABLES.RINGS_PER_SKIP;
  state.asking = null;
  return true;
}

/**
 * At dusk: the unmoved-room flop (C2) — a morning ended with an accepted asking untouched AND a
 * room that was never poured (reaching-and-idle, not merely under-filling). Costs a spill; the
 * asking stays (it isn't stale yet). Returns true if it flopped.
 */
export function checkFlopAtDusk(state: GameState): boolean {
  const asking = state.asking;
  if (!asking) return false;
  if (asking.touched || state.turn.pouredThisMorning > 0) return false;
  const cost = Math.max(ASKING_TUNABLES.SPILL_FLOOR, ASKING_TUNABLES.TIER_DEMAND[asking.tier]);
  spillGleam(state, cost, "unmoved room");
  return true;
}
