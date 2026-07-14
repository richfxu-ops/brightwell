---
status: Complete
size: Medium
created: 2026-07-14
completed: 2026-07-14
title: Run frame
---

## Context

Engine Phase 5 of the 8-phase plan: give the run an **end, a win, and a loss** — today the toy
is an endless sandbox (nothing concludes). This is the phase the engine plan calls "the
static-deck-must-lose test": the year-end **crown** must be un-standable without growth, so the
win gate (not a decay meter) is what closes the turtle dodge (GDD §5–6). With Phase 4 (the asking
lifecycle) and Phase 6 (acquisition) it completes the run the simulation harness needs.

Canon: GDD §6 ("stand the crown, tell the year") + §4 (the Quiet Walk) + QUESTIONS.md §C
([CANON]: crown floor [3,5,7,10], demand 10; C5 recommendation for standing it).

## The two run-ends (GDD §6, verbatim shape)

1. **Standing-zero, any season → the Quiet Walk.** A survivable dimming, not a game-over — "the
   world going shy." One woken piece would persist as a meta-boon (meta-layer deferred, below).
2. **The year reaches the first still dawn → triumphant ONLY IF still lit AND the crown stood.**
   Otherwise the maker drifts to a non-triumphant first-still-dawn.

## Scope boundary (NOT in Phase 5)

- **The map / routing (C4).** Kept single-node, as Phase 4 left it — the crown is the final
  asking on the current node, not a routed-to place. Multi-node routing is a later phase.
- **The meta-layer** — the winter-telling epilogue, the walking bead, the wintering-fire seed, the
  year-string, new-game-plus (QUESTIONS.md §G, post-M4). Phase 5 records *which* ending and the
  *tier reached*; it does not build the between-runs layer.

## Approach

A small `src/engine/runframe.ts` (parallel to `asking.ts`), every number a named `RUN_TUNABLES`
entry (same "feel it out" constraint as Phase 4):

1. **Fix the opening Standing.** `createInitialState`'s gleam is a placeholder (1); the run frame
   sets the true starting value so the fail-state isn't trivially hit on morning 1.
2. **A terminal calendar.** The year is `WORKED_MORNINGS_TOTAL` mornings (27, from tiers.json);
   the Wintering (leg 4) is its last stretch. When the Wintering's mornings are spent, the year
   reaches the first still dawn and the run ends.
3. **The crown.** On entering the Wintering, `acceptAsking` hangs the **crown** instead of an
   ordinary asking: tier `crown`, demand 10 (calendar-floored). Standing it = completing its fill.
4. **Run-end resolution** (`checkRunEnd`, pure): `quiet-walk` if Standing ≤ 0 (any time) →
   immediate end; else on crown-stand → `won`; else when the Wintering is spent → `drifted`.
   Emits a `run-ended` event carrying the reason + tier reached.
5. **The toy** gets a run-end screen (like dusk): won / Quiet Walk / drifted, showing the tier
   reached and the year's shape. The "endless sandbox" FIDELITY note is retired.

## Decisions (to confirm — adopting QUESTIONS.md §C / GDD §6)

- **Starting Standing → 5** (mid-kettle band). Enough buffer that one flop doesn't end the run;
  `RUN_TUNABLES`, so tunable. *(Fixes the `createInitialState` placeholder.)*
- **C5 · the crown** → a single crown asking in the Wintering, demand 10, tier `crown`; stand it
  before the year ends or drift. Adopted.
- **Win fires on the deed (a simplification):** standing the crown **ends the run immediately**
  into a triumphant ending, rather than playing out the remaining Wintering mornings. Cleaner and
  more satisfying; canon frames the check at the first still dawn — noted as a toy simplification.
- **Quiet Walk = Standing reaches 0**, immediate, overrides all — the fail-state is the only
  early end.
- **The static-deck-must-lose invariant is a test, not just prose:** a test asserts a small
  static engine cannot reach crown-demand 10, so the win gate genuinely requires growth.

These adopt the register's recommendations; **user sign-off promotes them to DECISIONS.md** and
closes QUESTIONS.md §C5.

## Plan

- [x] `src/engine/runframe.ts` — `RUN_TUNABLES`, `acceptCrown`, `checkRunEnd`, `crown-hung`/`run-ended` events
- [x] opening Standing fixed to `STARTING_STANDING` (5); terminal calendar (`yearOver` at the first still dawn)
- [x] crown accepted in the Wintering (`isWintering` → `acceptCrown`); `payGladLoad` sets `crownStood` → win
- [x] Quiet Walk on Standing ≤ 0; drift at year-end without the crown; `checkRunEnd` after every action
- [x] tests: `runframe.test.ts` (8 — opening Standing, crown hangs, won, quiet-walk, drifted, static-deck-must-lose, + inert-run & no-doomed-asking from review); 108 total pass
- [x] toy: run-end screen (won / Quiet Walk / drifted) + year summary + "next verse" restart; subtitle retired the endless-sandbox line
- [x] two code-review passes: hardened entry points (inert once ended, no doomed asking) + polished the end screen (clamped morning, "how it ended")
- [x] promote decisions to DECISIONS.md (D-014); board + docs sync; merged to main

Verified (2026-07-14): unit tests cover all three endings + the static-deck-must-lose gate (a
pure apprentice deck has no `fill` card, so it can never stand the crown). In-browser: opening
Standing is 5; idle-flopping to zero triggers the Quiet Walk end screen ("The light goes shy")
with the year summary; "Begin the next verse" restarts on a fresh seed.
