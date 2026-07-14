---
status: Complete
size: Large
created: 2026-07-14
completed: 2026-07-14
title: Simulation harness
---

## Context

Engine **Phase 7** of the 8-phase plan: the balance "thermometer". A harness that plays bot games
over many seeded runs and emits a **per-run `round_metrics` record** (`design/round_metrics.json`,
57 keys) so the M4 balance work can derive real numbers instead of the napkin shape-checks
game-architect committed. Unblocked as of 2026-07-14 — Phases 4–6 (asking lifecycle, run frame,
acquisition) are all real, so the engine now plays a whole wander-year that begins, escalates, ends
three ways, and grows the deck.

**Phase 8 (the balance sheet) is split into its own task** — [balance-sheet.md](balance-sheet.md).
The seam between them is the **per-run records** this task writes: Phase 7 produces them; Phase 8
reduces them into the watch-item verdicts (I-006/014/020/022, crown-stand spread, dominated pairs).

## Approach

A new `src/sim/` module (kept out of `src/engine/` — the sim only drives the engine's **public
API**, never its internals), pure and seeded like the engine so a record replays exactly. Four pieces:

1. **Bot policies** — one `chooseAction(state) → Action` per archetype (Kilnfast · Eveners · Untold ·
   Fairwrights · Mannerly · Gleaners). `Action` is a discriminated union over the public surface:
   `play(instanceId, pour)` · `stall` · `draft(cardId)` · `release(instanceId)` · `endMorning`
   (dusk, with a camp choice). Baseline-competent: a shared sensible default plus a per-archetype
   tilt toward that Way's core loop — enough to exercise the archetype, **not** deeply tuned (tuning
   is Phase 8's concern, and the harness only proves *balanced+deep*, never *fun*).
2. **The run-driver** — `runGame(seed, archetype) → RunRecord`: loop `dawn → (bot morning actions) →
   dusk` until `state.runEnded`, accumulating the event log + final state. Deterministic.
3. **The metrics emitter** — `collectMetrics(events, finalState, archetype) → RoundMetrics`: the
   57-key record, read off the event log + final state.
4. **The completeness gate** — a test asserting every record carries all per-run keys (Phase 7's
   definition of done).

### The 57 keys — three buckets (all present in every record)

The keys are not uniform; the manifest (`keys.ts`) maps each into one bucket — **37 / 7 / 13**:

- **Per-run, real now (37):** everything the run/deck/gleam/asking/chain/acquisition/room systems
  produce — `run_won`, `run_end_reason`, `crown_stood`, `deck_size_by_leg`, `gleam_*`, `chain_*`,
  `fair_drafts_taken`, `acquisition_source_shares`, `need_fill_clear_rate_by_leg`,
  `paling_rings_accrued`, `combo_*`, `soothe_applications`, `handsels_whittled_total`, … Read off the
  event log + final state.
- **Per-run, structural zero (~7):** keys whose system is still deferred — `combing_events`,
  `gleanings_taken`, `handsels_idle_lapsed_total`, `glad_price_net_ev`, the `untold_*` trio. Emitted
  as `0`/`null` **tagged with the system each awaits**, so the record shape is stable and the values
  fill in as those systems land (per the agreed "all 57 present, honest zeros" gate).
- **Cross-run aggregate (13) → Phase 8, NOT per-run:** `archetype_win_rate`,
  `archetype_crown_stand_rate`, the six `axis_*`, `dominated_archetype_pairs`, `power_band_width`,
  `crown_stand_spread`, … These are computed *over the record set*, so they are **not** fields of a
  single record — Phase 8 derives them. The completeness gate covers per-run keys only.

## Decisions

- **`src/sim/` drives the public API only.** Bots and driver call `dawn`/`playPiece`/`stallAction`/
  `dusk`/`draftFair`/`releaseCard` exactly as the toy does — never reach into engine internals.
  Archetype identity lives in *policy*, not engine special-casing (a locked ground rule).
- **Per-run vs aggregate is the real key split** (not run-real vs derived): a single record can't
  hold a cross-run aggregate like `archetype_win_rate`. The manifest (step 1) tags each of the 57 as
  per-run-real / per-run-zero / Phase-8-aggregate; the gate validates the per-run set.
- **Simple bots now, tuning later (user-decided).** Baseline policies are greedy-but-competent —
  wake-and-fill, draft-when-affordable, court-when-the-chain-is-up — enough to read each Way's core
  loop, but they won't hunt degenerate lines. So Phase 7's numbers are a **floor** ("*at least* this
  balanced"), explicitly not to be over-trusted; bot quality is iterated in/with Phase 8, where the
  balance actually gets read.
- **N ≈ 50 runs per archetype in Phase 7 (user-decided).** Enough to smoke-test the pipeline and see
  the shapes; Phase 8 scales N up for statistically solid win-rates.
- **Two Parts (Large):** the pipeline can stand up and pass the completeness gate with a single
  generic bot before the six archetype policies exist — so Part A de-risks the harness, Part B makes
  the records archetype-real.
- **Canon-accurate empty purse (user-decided).** The sim starts a run with 0 handsels (no toy
  stipend) — the sim measures the real economy where handsels are earned (glad-load / whittle), not a
  UX crutch. Consequence surfaced in Part A: buying is secondary to the free court path.
- **Bots play their own Way's cards honestly; the harness lets weakness show.** Part A surfaced that
  eveners/fairwrights (and the apprentice base) carry **no `fill` card** — they can't fulfil a need
  from their starting deck, so they never earn glad-load and grow only via court/whittle. Part B's
  tilts lean each Way into its real strengths rather than papering the gap; "can this Way stand the
  crown?" is a genuine Phase-8 balance signal to preserve, not hide.

## Technical detail

**Location & output.** `src/sim/{policies.ts, driver.ts, metrics.ts, keys.ts, run.ts}` + `sim.test.ts`
+ `policies.test.ts`, and an `npm run sim` script that writes `sim/out/records.json` (N seeded runs ×
7 archetypes — apprentice + the 6 Ways) for Phase 8. N small in Phase 7 (prove the pipeline); Phase 8 scales it.

**Shapes (as built):**
- `type Action = { kind: "play"; instanceId; pour } | { kind: "stall" } | { kind: "draft"; cardId }
  | { kind: "release"; instanceId } | { kind: "end"; camp? }`
- `type Policy = (state: GameState, ctx: MorningContext) => Action`
- the written record is `RoundMetricsPerRun & { seed: number }` — the per-run keys plus the seed.
- `keys.ts` — the manifest: the three buckets as typed key lists, the single source the emitter and
  the gate both read (so "a key exists" is checked in one place).

**Determinism.** `runGame(seed, archetype)` is pure over the seeded engine — same inputs → identical
record. A test asserts replay equality.

## Plan

Two parts; each its own branch + review.

### Part A — the pipeline: driver + emitter + completeness gate  *(branch: `phase7-part-a-harness`)*
- [x] `keys.ts` — the 57-key manifest partitioned 37 real / 7 zero / 13 Phase-8-aggregate; deferred
      keys tagged (`DEFERRED_REASON`); a test asserts the buckets partition exactly the 57 canonical keys
- [x] `driver.ts` — `runGame(seed, archetype)`: the full `dawn → actions → dusk` loop to `runEnded`,
      driven by one generic baseline `Policy` (public API only); per-morning leg samples for the emitter
- [x] `metrics.ts` — `collectMetrics` producing every per-run key (37 real off events+state, 7 honest zeros)
- [x] `sim.test.ts` — the completeness gate (record keys === per-run manifest; nothing undefined; zeros
      are 0; runs terminate with a reason; replay determinism); `npm run sim` writes `sim/out/records.json`
- [x] `npm run check` green (131 pass, +5); `npm run sim` runs 350 records; code-review pass; Review Card

Verified (2026-07-14): `npm run check` green — typecheck + lint + 131 tests. `npm run sim` writes 350
records (7 archetypes × 50); every run completes the 27-morning year (all `drifted` — the simple bot
grows the deck but doesn't deliver the crown, the documented floor), decks grow for the Ways
(kilnfast ~20, untold ~25), apprentice stays flat (~10, no fillers → static-deck-drifts). Records are
varied and honest; the 0 wins are a baseline-strength artifact for Part B / Phase 8, not a pipeline bug.

### Part B — the six archetype policies  *(branch: `phase7-part-b-bots`)*
- [x] `policies.ts` — one `Policy` per archetype via `makePolicy` (a `PREFERRED_DO` tilt over the
      baseline shape); `POLICIES` exhaustive, `runArchetype(seed, archetype)` the entry
- [x] `run.ts` + the completeness gate now drive `runArchetype`; `records.json` covers the 7-way matrix
- [x] Tests: `policies.test.ts` — policies exhaustive, every Way terminates across seeds, and the tilt
      demonstrably diverges from the generic baseline on the same seed+deck
- [x] `npm run check` green (134 pass, +3); `npm run sim` runs; Review Card

Verified (2026-07-14): `npm run check` green — typecheck + lint + 134 tests. The records are now
archetype-*distinct* and each Way's identity is legible: eveners retires most (12.6/run — cycles the
deck), mannerly courts most (11.4) + longest chains (10.7), untold wakes most (23.5 — draws wide),
fairwrights peaks gleam+room highest (256 / 17.1 — the gather→brim spike), gleaners whittles most.
Still 0 wins (the documented simple-bot floor); fairwrights' gleam spike is a Phase-8 signal to watch.
