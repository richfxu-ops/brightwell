---
status: Complete
size: Medium
created: 2026-07-13
completed: 2026-07-13
title: Effects resolvers
---

## Context

Phase 2 of the M3 engine plan (`docs/engine-plan.html`). Phase 1 gave us the state and the read
evaluator; this phase implements the fourteen effect primitives as pure resolvers in
`src/engine/effects.ts`, with the five locked firewalls enforced in code and proven by a
dedicated test suite. The turn loop (triggers, chain multiplier, SET/RETURN split, dawn/dusk)
is deliberately Phase 3 — this phase builds the instruments, not the conductor.

## Approach

- **`src/engine/effects.ts`** — `resolveEffect(state, effect, ctx): { state, events }`, a pure
  dispatcher over fourteen resolver functions. `ctx` carries what a lone effect can't know:
  the acting piece, the card table (`grainOf`, marks/ceilings), and this play's measured overkill.
  Amounts resolve through Phase 1's `evaluateRead`.
- **Engine automatics live here too** (they're locked L1 machinery `rest` triggers, not verbs):
  wake-on-mark (fired forever + auto-seat typed by grain), and overkill→Standing conversion at
  full rate for the first 6 past the ceiling then diminishing (L6), grain-stamped.
- **`src/engine/validate.ts`** — the "fails to compile" firewall from L3 §2 as a static card
  check, `validateCard(card)`: cross-channel writers (`brim`/`fill`/`court`/`whittle`/`soothe`)
  may bind only to play events; a `brim` band may read only `room`/`chain`/`over-ceiling`; no
  effect may target a waking-mark. Run over the whole starter pool in tests — all 49 must pass.
- **Two test suites:** a table-driven behavior suite (every verb, including `rest`'s three
  outcomes: cold / wakes / overkills) and a firewall suite that attempts each forbidden move
  and asserts refusal.

## Decisions

- **Two kinds of "no", by audience.** Canon violations (a card whose data breaks a firewall)
  **throw** — they are content bugs and must never reach play; `validateCard` catches them
  before a run starts. Situational refusals (court's term unmet, `fill` with no accepted
  asking, retiring a piece that isn't there) are **no-ops that emit a `refused` event** —
  cheap for Phase 3 and the bots to probe legality without try/catch control flow.
- **Automatics are functions, not resolver cases** — `applyWake(state, piece)` and
  `applyOverkill(state, piece, excess)` are exported separately so Phase 3's turn loop can
  invoke the same machinery when plays (not card effects) trigger them.
- **Gleam writes route through one function** — `creditGleam(state, amount, grain, source)`
  asserts `source` traces to measured overflow (or the Phase 4+ glad-palm/telling paths),
  making "no free mint" structural rather than per-call-site discipline.
- **No RNG use in this phase** except `draw` without a filter (shuffled draw) — the one place
  a resolver rolls dice, through the state's seeded RNG.
- **PLACEHOLDER coefficients for M4 tuning**, named constants in effects.ts: `DIMINISH_RATE`
  (L6 locks the band at 6, not the tail rate), `RETIRE_BASE_WORTH` (residual = base + rested
  set), `VOUCH_FLOOR` (graded vouching bands land in Phase 6). `warm` needed a `delightBonus`
  field added to PieceInstance.
- **The overkill ledger (post-review redesign).** A per-piece ledger (`overkillCredited`,
  `brimBand`) replaces per-rest delta conversion: gleam credited is always
  `convert(total excess, band) − already credited`, so split rests can't bypass the
  diminishing band and repeated brims can only approach (never exceed) the measured
  overflow. Brim credits in the *overkill piece's* grain and refuses when there is none.
  Found by the Phase-2 code review (verified by execution) along with: court now supports
  the real cards' object terms `{if: read, at_least: n}`; whittle carves the exact 1/3
  share (thin returns refuse); soothe refuses a zero mend without burning the catalyst;
  validate.ts now checks param shapes, the closed read-source enum, and board-source reads
  on every verb (gather/whittle/fill/soothe only); shared firewall constants/guards moved
  to vocabulary.ts; test fixtures deduplicated into test-helpers.ts. A firewall test now
  resolves every effect of all 49 real cards.
- **Deferred, recorded here:** clone-per-effect granularity moves to once-per-play at
  Phase 7 (noted in effects.ts header); "courted stock enters the pack" as pieces is a
  Phase-6 design question (stock currently lands in player.stock); `playedThisMorning`
  is owned by the Phase-3 turn loop (noted in state.ts).

## Technical detail — per-verb behavior (traced to GDD L3 §1)

| verb | reads → writes | notes |
|---|---|---|
| gather | woken-audience/amount → room | soft-capped (plateau ~10, L6) |
| rest | room+amount → piece.set; may trigger wake/overkill automatics | marks/ceilings FIXED |
| steady | → chain links / brace | pure turn-state |
| fill | amount → asking.progress | refused without an accepted asking |
| brim | over-ceiling band → gleam | ONLY card gleam-writer; band sources firewalled |
| mark-grain | → piece.stampedGrains (+stampedThisMorning) | feeds grain:/woken:/court terms |
| draw | pack → hand | suit/tag filter = search; unfiltered = RNG draw |
| retire | piece → removed; worth → node table or room | residual-only, node-bound |
| whittle | amount → handsels | shavings-share 0.333 of RETURN; read(season) may scale |
| court | gleam (gate) + term check → player.stock | gleam never decremented; "into the pack" is a Phase-6 question |
| soothe | last-red → node rings slowed | node-local; never touches gleam |
| read | (amount syntax) | already built in Phase 1; resolver rejects it as a standalone `do` |
| warm | → own woken_delight bonus | no combo |
| keep | → own freshness +1 season | no combo |

## Plan

- [x] `validate.ts`: static card firewall checks; test: all 49 starter cards pass, crafted bad cards fail
- [x] `effects.ts`: dispatcher + the four trivial verbs (warm, keep, mark-grain, steady)
- [x] gather, draw, retire, whittle, fill
- [x] Automatics: applyWake, applyOverkill (+ diminishing band), creditGleam
- [x] rest (three outcomes), brim, court, soothe
- [x] Behavior test suite (table-driven, every verb)
- [x] Firewall test suite (each forbidden move refused)
- [x] `npm run typecheck` + `npm test` green (66 total, incl. review-regression tests); board + docs sync
