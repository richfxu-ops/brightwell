---
status: To Do
size: Large
created: 2026-07-14
title: Simulation harness
---

## Context

The balance "thermometer": a harness that runs bot games over many seeded runs and emits the
**57 `round_metrics` telemetry keys** (`design/round_metrics.json`) per run, so the M4 balance
work can derive real numbers instead of the napkin shape-checks game-architect committed. This
is **Phase 7–8** of the 8-phase engine plan (`docs/engine-plan.html`): Phase 7 is the
completeness check that every run emits all 57 keys; Phase 8 is the balance sheet that turns
them into the watch-item verdicts (I-006/014/020/022, crown-stand spread, dominated pairs).

The two backlog lines — "bot players for all six archetypes" and "simulation harness emitting
the 57 keys" — are the two halves of this task.

## The blocker — RESOLVED 2026-07-14 (Phases 4–6 are all real in the engine)

> **Unblocked.** Phase 4 (asking lifecycle, D-012), Phase 5 (run frame, D-014), and Phase 6
> (acquisition — the Fair, D-013/D-015) have all landed. The engine now plays a whole wander-year
> that begins, escalates, ends three ways, and grows the deck — so the 57 run-level keys below are
> populatable and this task can start. The historical framing that follows records *why* it was
> blocked; the sequencing decision (option 1) was taken and executed.

**Originally: the harness measures a full run; the engine couldn't yet play one.** The Phase-3
engine did exactly one worked morning: `dawn → (playPiece | stallAction)* → dusk`. It had no
run-level structure — which is precisely what the toy had to stub with FIDELITY shims (an
auto-refreshing asking, no map, no acquisition, an endless sandbox that never ends, wins, or
loses).

But a *round* is a whole wander-year, and most of the 57 keys are run-level and meaningless
without the systems that don't exist yet:

- `run_won`, `run_end_reason`, `crown_stood`, `crown_tier_reached` → the **win gate** (winter
  telling) and the **run frame** that ends the year. **Phase 5.**
- `standing_zero_season`, `gleam_spilled_total` → the **fail-state** (Standing-zero → Quiet
  Walk) and **the spilling** (outcome-only Standing loss). Needs the run frame + asking
  staleness. **Phase 4–5.**
- `need_fill_clear_rate_by_leg`, escalation metrics → the **asking lifecycle** (accept · work ·
  fulfil · escalate · go-stale). **Phase 4.**
- `acquisition_source_shares`, `fair_drafts_taken`, `courtings_landed`, `gleanings_taken`,
  `deck_size_by_leg`, `cards_gifted_total` → **acquisition / the growth curve** (deck ~7 → ~20,
  acquired pieces arrive inert). **Phase 6.**
- `paling_rings_accrued`, `combing_events`, `difficulty_by_ring`, `last_red_used`,
  `soothe_applications` → the **Paling clock**, **combing boss**, and **last-red** board
  systems. **Phase 4–6.**

Only a minority (chain length, overkill→gleam, room peak, decisions-per-turn) are derivable
from the current single-morning loop. A harness built now could emit maybe a fifth of the
contract and could not answer a single balance question — the thermometer would be reading a
system with no temperature.

## Sequencing (the real decision for the user)

The engine plan already anticipated this: Phases 4–6 build the run before Phase 7 measures it.
The honest options:

1. **Build the run first (recommended).** Take Phase 4 (asking lifecycle) as the next `/task`,
   then Phase 5 (win/fail gate + run frame), then Phase 6 (acquisition/growth). *Then* this
   harness has a real game to run and all 57 keys are populatable. This is the plan of record.
2. **Build a partial harness now.** Stand up the bot-driver + metrics-emitter skeleton against
   the single-morning loop, emitting only the morning-derivable keys, and grow it as Phases 4–6
   land. Risk: it hard-codes the FIDELITY stubs' shape and gets rewritten anyway; low balance
   value until the run exists.

**Decided: option (1), and executed** — Phases 4 → 5 → 6 were built and merged in that order
(D-012/D-014/D-015). This task is now the next up: a real full-run engine exists to measure.

## Approach (sketch — for when it's unblocked)

- **Bot players:** one policy per archetype (Kilnfast/Eveners/Untold/Fairwrights/Mannerly/
  Gleaners), each a pure `chooseAction(state) → play|stall|end` function over the same public
  engine API the toy drives — never reaching into internals. Archetype identity comes from
  policy, not engine special-casing.
- **Harness:** run N seeded runs per archetype through the full run loop, accumulate a
  `round_metrics` record per run, validate all 57 keys are present (Phase 7 completeness gate),
  write results as JSON for the Phase 8 balance sheet.
- **Balance sheet:** reduce the per-run records into the watch-item verdicts and the codex
  Reports tab's first real output.

## Plan

- [x] Decide sequencing (chose option 1: build Phases 4–6 first) — done
- [x] Build Phases 4–6 so the engine plays a full run (D-012/D-014/D-015) — done, unblocking this
- [ ] Scope the harness proper (bots + the 57 keys) via `/task` when picked up
