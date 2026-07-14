---
status: To Do
size: Large
created: 2026-07-14
title: Balance sheet
---

## Context

Engine **Phase 8** of the 8-phase plan: turn the simulation harness's per-run records into the
**balance verdicts** — the first real output of the codex Reports tab, and the answer to whether the
numbers game-architect committed on a napkin actually hold. Downstream of **Phase 7**
([sim-harness.md](sim-harness.md)): that task writes the per-run `round_metrics` records; this one
**reduces the record set** into cross-run aggregates and checks them against the watch items.

Blocked on Phase 7 (needs its `records.json`). Scope this once Phase 7 produces records.

## Scope (sketch — to firm up when unblocked)

- **Compute the ~15 cross-run aggregate keys** a single record can't hold: `archetype_win_rate`,
  `archetype_crown_stand_rate`, the six `axis_*` (scaling/consistency/tempo/spike/ceiling/route),
  `dominated_archetype_pairs`, `power_band_width`, `crown_stand_spread`, `gleam_centrality_share`.
  The `axis_*` need **formulas** (they characterize an archetype across runs) — the real design work.
- **Check the watch items** from `round_metrics.json`:
  - **I-020** — `archetype_crown_stand_rate` in **.70–.99**, no archetype locked out or runaway;
    `dominated_archetype_pairs = ∅`; `power_band_width` bounded.
  - **I-014** — `glad_load_power_share` ~54% central-but-bounded; `acquisition_source_shares` don't
    flatten build diversity.
  - **I-006** — `gleam_centrality_share` doesn't make all builds gleam-first.
  - **I-022** — `untold_pressure_vs_size_ratio` ~1.0 mid-run; `untold_crown_delivery ≤ size` at crown.
  - **I-018** — `skip_ripen_margin > 0`. **Gleaner** — `archetype_win_rate[gleaners]` vs its risk.
- **Reports output** — render the verdicts in the codex Reports tab (its first real content).

## Open questions (for the proposal)

- **F3 · Orchestration: hand-rolled vs the `game-loop` skill.** QUESTIONS.md §F3 flags this exact
  fork — a hand-rolled reduce/verdict pass, or delegate the generate→simulate→balance-review→decide
  loop to the `game-loop` skill (token-budget decision). **Decide when Phase 7 prints its first
  records** (per F3). A hand-rolled Phase 8 is the leaner first pass; game-loop is the autonomous
  balance *loop* on top of it.
- **Deferred-system keys.** The ~7 structural-zero keys (combing, gleanings, idle-lapse, untold trio)
  can't be balance-checked until their systems exist — their watch items (I-022) stay provisional.
- **Bot depth.** The verdicts are only as trustworthy as the bots (Phase 7's baseline policies);
  refining bot quality likely belongs here, where the balance is actually read.

## Plan

*(Deferred until Phase 7 produces records.)*
- [ ] Scope Phase 8 via `/task` once `sim-harness` (Phase 7) writes `records.json`
