---
status: Complete
size: Medium
created: 2026-07-13
completed: 2026-07-13
title: Engine state & reads
---

## Context

Phase 1 of the M3 engine plan (`docs/engine-plan.html`; ground rules D-008). Everything above it
— the 14 resolvers, the turn loop, the year — operates on one shared state object and speaks in
`read(...)` references. This phase builds that foundation: the `GameState` type and the read
evaluator, with no game behavior yet (resolvers are Phase 2).

## Approach

Two small modules plus a seeded RNG, all pure data + pure functions:

- **`src/engine/state.ts`** — the `GameState` type, plain and JSON-serializable:
  - `rng` — seed + counter (all randomness flows through it; D-008 rule 1)
  - `calendar` — morning 1–27, leg 0–4 (legs/mornings from `src/content/contracts/tiers.json`)
  - `board` — nodes (id, spiral rings, local table, lantern offers, last-red), where the maker is,
    and the 2–3 offered next towns (`FIDELITY:` simplified map per D-008 rule 3)
  - `player` — gleam (+ per-grain tags), handsels (brightness dull/warm/singing + idle count),
    courted stock (grade + freshness)
  - `pieces` — card *instances* referencing content by id: zone (pack/hand/in-play), fired?,
    attention rested (`set`) vs the printed fixed mark/ceiling, stamped grains, freshness
  - `turn` — the room, chain links + brace, the accepted asking and its fill, this play's overkill
  - `events` — the event log (D-008 rule 2; typed now, first emitters land in Phase 2)
- **`src/engine/rng.ts`** — a tiny seeded generator (state in, [value, state] out) + determinism tests.
- **`src/engine/reads.ts`** — `evaluateRead(source, state)`: the nine sources of the closed
  `ReadSource` enum, each implemented per its GDD Layer 3 definition (table below).
- **`createInitialState(seed)`** — a fresh run: the 7-card apprentice deck from `shared.json`,
  morning 1, empty room.

## Decisions

- **Cards stay data; instances are state.** A piece instance holds only its per-run facts
  (zone, set, fired, stamps); name/mark/ceiling/effects always come from the content JSON.
- **The RNG lives inside the state** — same seed, same run; serializing the state serializes the
  randomness with it, so replay and save come free.
- **Event type defined in this phase** even though nothing emits yet — resolvers (Phase 2) should
  land against a stable log shape.
- **Deferred placeholders, so they aren't lost:** starting gleam (1; true value lands with Phase 5's
  run frame), freshness semantics (2 seasons; lands Phase 3/6), board generation (single start
  node; real map offers land Phase 5).
- **`grain:` scope — RESOLVED as D-009 (user-ratified):** `grain:<suit>` = this morning's working
  (wakes + stamps today, dawn-reset); `woken:<suit>` = the cross-turn fired audience (fired on
  *earlier* mornings — today's wakes seat tomorrow). Decisive evidence: the L7 napkin's chain check
  only passes under this reading.

## Technical detail — the nine read sources (traced to GDD L3 §1–§2)

| source | returns |
|---|---|
| `room` | the current attention pool (`turn.room`) |
| `chain` | current unbroken-work links |
| `fill` | the accepted asking's fill progress |
| `season` | the seep stage — the current leg's escalation index (from tiers.json) |
| `spiral` | this node's spiral rings |
| `handsels` | the purse's total brightness (dull 1 / warm 2 / singing 3) |
| `over-ceiling` | measured overkill of the current play (genuine excess only) |
| `grain:<suit>` | pieces counting as `<suit>` in this morning's working (D-009) |
| `woken:<suit>` | fired audience-things of `<suit>` seated from earlier mornings (D-009) |

## Plan

- [x] Pin the `grain:<suit>` ruling against L3 + the L7 napkin (logged as D-009)
- [x] `rng.ts` — seeded PRNG + determinism test
- [x] `state.ts` — GameState types + `createInitialState(seed)` (apprentice deck from shared.json)
- [x] `reads.ts` — `evaluateRead()` for all nine sources
- [x] Tests: hand-built states return the documented number for every source; unknown source is a type error
- [x] `npm run typecheck` + `npm test` green (20 tests); board + docs sync
