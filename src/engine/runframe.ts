// runframe.ts — the run frame (engine Phase 5): the year ends, and it ends one of three ways.
// GDD §6 ("stand the crown, tell the year") + §4 (the Quiet Walk). Every number a named
// RUN_TUNABLES entry (same "feel it out" constraint as Phase 4). The map and the between-runs
// meta-layer are out of scope here (single node; the crown is the final asking).

import type { GameState, RunEnd } from "./state.js";
import { MORNINGS_PER_LEG, STARTING_STANDING, WORKED_MORNINGS_TOTAL } from "./state.js";
import { emit } from "./effects.js";

export const RUN_TUNABLES = {
  STARTING_STANDING,                              // mirror of the state.ts opening value
  QUIET_WALK_AT: 0,                               // Standing at/below this → the Quiet Walk
  WINTERING_LEG: MORNINGS_PER_LEG.length - 1,     // the last leg — where the crown hangs
  CROWN_DEMAND: 20,                               // the crown's fill (QUESTIONS.md §C [CANON]; raised
                                                  // 10→20 once fills read the woken audience — D-021)
} as const;

/** The maker is in the final season — the crown's stretch. */
export function isWintering(state: GameState): boolean {
  return state.calendar.leg === RUN_TUNABLES.WINTERING_LEG;
}

/** The calendar has passed the last worked morning — the first still dawn has come. */
export function yearOver(state: GameState): boolean {
  return state.calendar.morning > WORKED_MORNINGS_TOTAL;
}

/** Hang the year's crown: a single great finale asking, demand-10, on the current node. */
export function acceptCrown(state: GameState): void {
  state.asking = {
    tier: "crown",
    needFill: RUN_TUNABLES.CROWN_DEMAND,
    progress: 0,
    acceptedMorning: state.calendar.morning,
    acceptedLeg: state.calendar.leg,
    staleAfterMornings: 99,   // the finale never goes stale — there is no leg beyond it
    touched: false,
  };
  emit(state, "crown-hung", { demand: RUN_TUNABLES.CROWN_DEMAND });
}

/**
 * Resolve the run's end, if it has ended. Called after every morning action. Priority: the bright
 * win (crown stood) first, then the fail-state (Standing gutted out), then the quiet drift at
 * year-end. Idempotent — once set, `runEnded` never changes.
 */
export function checkRunEnd(state: GameState): void {
  if (state.runEnded) return;
  const base = { peakStanding: state.player.peakGleam, crownDemand: RUN_TUNABLES.CROWN_DEMAND };
  let end: RunEnd | null = null;
  if (state.crownStood) end = { reason: "won", ...base };
  else if (state.player.gleam <= RUN_TUNABLES.QUIET_WALK_AT) end = { reason: "quiet-walk", ...base };
  else if (yearOver(state)) end = { reason: "drifted", ...base };
  if (end) {
    state.runEnded = end;
    emit(state, "run-ended", { ...end });
  }
}
