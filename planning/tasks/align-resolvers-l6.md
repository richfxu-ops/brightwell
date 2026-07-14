---
status: Complete
size: Small
created: 2026-07-14
completed: 2026-07-14
title: Align resolvers to L6
---

## Context

The QUESTIONS.md sweep (2026-07-14) found six places where Phase-2 resolvers drift from
numbers Layer 6 actually specifies (§A of the register). Corrections, not design — the user
approved proceeding directly. Phase 3 must not build on drifted resolvers.

## Approach

Implement the L6 letter in `effects.ts`/`state.ts`, updating the behavior/firewall tests to
the canon numbers. Where L6's prose needs interpretation, the reading is recorded below —
each is a judgment call a reviewer might revisit, not silent improvisation.

## Decisions (interpretations of L6 prose)

- **Soothe harmonized with card data:** engine law `mend = min(requested, rings, 2)` where
  requested = the card's amount×scale; consumes 1 last-red; **4 soothes/run** (napkin
  `SOOTHE_PER_RUN_MAX`); sets `node.soothed` so Phase 3's dawn drops that node's ring-draw
  ("no retained skip-capacity").
- **Retire worth = this-cycle unspent = the piece's rested `set`** (no base bonus). A
  never-rested piece retires for 0 — the thinning is the payoff ("cycle net attention < 0").
- **Proud stock vouches at gleam ≥ 6** ("proud stalls *begin to lean in*" in the 6–12 warm
  band); the 13+ full-width distinction lands with the Phase-6 graded market. Grade table:
  singing-silver → proud; unknown stock defaults to mid (≥ 6); apprenticestuffs 0.
- **Gather = seating.** The verb's amount is *seats*; each seat contributes
  `2 × 0.8^(seated-so-far)` room (`gathered-room-softcap`), so the room becomes fractional
  internally and plateaus ~10 structurally instead of via a hard cap. The turn tracks
  `seatedCount`; the home-note becomes seat #1 in Phase 3.
- **Starting apprentice-stuffs = 2** so whittle is exercisable — explicitly a PLACEHOLDER
  pending QUESTIONS.md §D3.

## Plan

- [x] A1 whittle: 1 dull, once per morning, consumes an apprentice-stuff (turn flag + stock)
- [x] A2 soothe: min(requested, rings, 2), 4/run, marks the node soothed
- [x] A3 retire: worth = unspent set only
- [x] A4 court: vouching by stock-grade gleam bands
- [x] A5 gather: decaying-seat law replaces the hard cap
- [x] A6 DIMINISH_RATE relabeled locked (0.5, L6 §4)
- [x] Tests updated to canon numbers; typecheck + suite green (73)
- [x] QUESTIONS.md §A marked corrected; board sync
