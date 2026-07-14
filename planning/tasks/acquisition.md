---
status: Complete
size: Large
created: 2026-07-14
completed: 2026-07-14
title: Acquisition (the Fair)
---

## Context

Engine Phase 6 of the 8-phase plan: make **acquisition** a real part of the engine + GameState,
so the deck can **grow** (~7 → ~20). Phase 5 built the win gate that *requires* growth (a static
apprentice deck can never stand the crown); Phase 6 is what lets a run actually grow, and it is the
last blocker before the simulation harness (Phase 7–8) — most of the 57 `round_metrics` keys are
acquisition/growth keys (`acquisition_source_shares`, `fair_drafts_taken`, `deck_size_by_leg`,
`cards_gifted_total`, …) that are meaningless until the deck can change size.

Direction set in **D-013**: acquisition is **frequent drafting woven into the turn** ("the Fair"),
not the rare seasonal event the GDD sketched — because playtesting the toy surfaced that a small,
fully-woken deck plateaus. A FIDELITY prototype lives in `src/toy/main.tsx` (`DRAFT_TUNABLES`,
`rollOffers`, `draft`, `release`) — a **design reference, not the implementation**. Phase 6 makes
it engine-real, and where the toy diverged from canon (see the cost decision) corrects it.

Canon: GDD §3 (the glad-load teaches one piece), L4 R2/R5/R6 + System B/C, QUESTIONS.md §D
([CANON] Fair draft **k=2 of N=5**; handsels never buy proud stock; D1–D4 open). The `court` verb
(gleam-gated vouch + performed term) already exists in `effects.ts` and its spirit is reused here.

## Approach

Three engine-real acquisition channels, all feeding one thing — **inert pieces into the pack**
(acquired cards always arrive un-woken; they still cost a play to wake). A new pure module
`src/engine/acquisition.ts` (parallel to `asking.ts`/`runframe.ts`), every number a named
`ACQUISITION_TUNABLES` entry (the same "feel it out first" constraint as Phases 4–5). **All
randomness comes from the seeded `state.rng`** (the toy's `Math.random` is the one thing that
cannot port — it would break determinism, D-008).

1. **The glad-load taught card.** `payGladLoad` today emits `taughtCard: true` but adds no piece —
   a stub. It now teaches one real inert piece, drawn weighted toward the maker's dominant
   gleam-grain (D1). *The country teaches you into your Way.*
2. **The Fair draft** — a per-morning offer row of **N=5**, take **k=2** (CANON), rolled fresh each
   dawn, filtered to unowned cards the maker's Standing has unlocked. Cost is the hybrid below.
3. **The release ("last-light")** — last-light 1 un-woken piece / morning, the thinning valve
   D-013 pairs with drafting so the deck can grow past ~20 without ballooning.

### The cost of a Fair card — hybrid tiered (decided: option (c))

Standing GATES which tier is offered (canon: "the market widens as gleam rises" — gleam *read*,
never spent). *How you pay to take it* splits by tier, respecting canon's own R2 line ("handsels
buy jars, apprentice-stuffs, and low taught pieces — never proud/courted stock"):

- **Bands 1–2 (apprentice-floor) → bought with handsels.** Pay `PRICE_BY_TIER` handsels from the
  purse. Canon-legal: handsels *may* buy low taught pieces.
- **Band 3 (proud) → courted, never bought.** No handsels. To take it you must have **performed the
  term** this morning (default: chain ≥ 3) — the `court` verb's "a performable micro-condition"
  applied to the Fair. *A key that turns, never a coin that leaves.*

This keeps the toy's felt experience (Standing-gated market, handsels matter early), edits **no
locked canon**, and gives handsels a *legal* card-sink at the low end while preserving "proud stock
is courted" at the high end.

## Decisions

- **Cost = hybrid tiered (option c), not the toy's flat handsel price (a) nor courting-only (b).**
  (a) would amend locked R2/R3 (handsels buying proud stock); (b) is pure but strips handsels of any
  card-sink and burdens every card with a term. (c) is fully canon-legal and maps 1:1 onto the toy's
  three Standing bands — the low two buy, the proud one courts.
- **The proud term is a single flat knob now (chain ≥ 3), FIDELITY.** Per-card terms (reading each
  card's own `court` term from its data) are the natural enrichment but need authored card data;
  deferred. One legible condition is enough to prove the mechanism for the harness.
- **D1 (what the glad-load teaches):** weighted toward the maker's dominant gleam-grain only. The
  "answering asking's grain pool" half of the §D1 recommendation is deferred (askings carry no grain
  field yet) — FIDELITY-marked.
- **Release valve = draft-2 / release-1** (the toy's shape), all tunable.
- **Seeded rolls; the module owns its pool.** All rolls use `state.rng` (never `Math.random`).
  `acquisition.ts` imports `starter-pool.json` directly — matching `state.ts`'s existing content
  imports — rather than threading a pool through `MorningContext` (which would churn every `ctx`
  literal in the tests and keep `payGladLoad`'s signature unchanged is cleaner). The acquirable
  universe is the **journey-pieces** (archetype ≠ `shared`); the 7 apprentice cards stay start-only.
  Tests assert against the real seeded pool (honest — it's the locked content).

## Scope boundary (deferred, FIDELITY-marked)

- **Map / routing** (C4) — single node, as Phases 4–5 left it. The Fair is on the current node.
- **The between-runs meta-layer** (QUESTIONS.md §G) — beads, keepsakes, new-game-plus.
- **The full R2/R6 economy** — introduction-jars, idle-lapse decay, twice-benched, red-thread,
  waymeet-table, the courting→bench (R6→R5) pipeline (D2), gleanings, apprentice-stuff acquisition
  (D3). Metric-marginal for the deck-growth question; deferred per the fidelity ladder.

## Technical detail

**State additions.**
- `GameState.nextPieceOrdinal: number` — monotonic mint counter for unique acquired-piece ids
  (init to the apprentice deck's size so it never collides with the `#0..#6` dawn ids).
- `TurnState.releasedThisMorning: number` (Part 1) and `fairOffers: string[]` +
  `draftedThisMorning: number` (Part 2) — dawn-reset (join the existing morning-scoped fields).

**`acquisition.ts` API** (pure; mutate the already-cloned state, like `asking.ts`; the module
imports `starter-pool.json` and holds `JOURNEY_POOL` = its journey-pieces with `{id, grain, tier}`):
- `ACQUISITION_TUNABLES` — Part 1: `RELEASE_PER_MORNING: 1`, `GLAD_GRAIN_WEIGHT` (the D1 bias).
  Part 2 adds: `OFFER_N: 5`, `DRAFT_PER_MORNING: 2`,
  `STANDING_TIER_BANDS: [{atLeast:0,tier:1},{atLeast:6,tier:2},{atLeast:12,tier:3}]` (mirrors the
  vouch/peak ladder anchors 6·12), `PRICE_BY_TIER: {1:1, 2:2}`, `PROUD_TIER: 3`, `PROUD_TERM_CHAIN: 3`.
- `mintPiece(state, cardId, zone)` — an inert `PieceInstance` with a unique id from the ordinal.
- `teachGladLoad(state)` — pick a journey-piece weighted to the dominant gleam-grain (`state.rng`);
  mint inert into the pack; emit `taught {cardId, grain}`. Called from `payGladLoad`.
- `releaseCard(state, instanceId)` — refuse if fired / capped; remove the piece; emit `released`.
- *(Part 2)* `cardTierOf` / `standingUnlockedTier` / `rollFair(state)` (into `dawn()`) /
  `draftFair(state, cardId)` (handsel path bands 1–2 · court path band 3 performed term).

**Events for Phase 7** (emit clean, aggregate later): `drafted` (with cost type), `taught`,
`released` → feed `fair_drafts_taken` / `courtings_landed` (proud drafts) / `cards_gifted_total`
(taught) / `deck_size_by_leg`. No aggregation in this task.

## Plan

Split into two parts (the hybrid cost tips this toward Large); each its own branch + review.

### Part 1 — deck growth + the glad-load taught card  *(branch: `phase6-part1-gladload`)*
- [x] State: `nextPieceOrdinal` on `GameState`; `mintPiece` helper (inert, unique id)
- [x] `acquisition.ts`: `ACQUISITION_TUNABLES`, `teachGladLoad` (D1 grain weighting via `state.rng`),
      `releaseCard` + `releasedThisMorning` (TurnState, dawn-reset)
- [x] Wire `payGladLoad` to teach a real inert piece (retire `taughtCard: true` → `taught {cardId}`)
- [x] Toy: real release button + taught-card moment (retire the toy release stub)
- [x] Tests: fulfil teaches one inert piece weighted to dominant grain; release removes an un-woken
      card, capped 1/morning, refuses a fired one; same seed → same taught card
- [x] `npm run check` green (118 pass, +10); Review Card

Verified (2026-07-14): `npm run check` green — typecheck + lint + 118 tests. In-browser (the toy):
releasing an un-woken card removes it (hand 5 → 4) with a "released from your deck" moment, and the
Release button correctly disappears after one release (the 1/morning cap); no console errors. The
taught-card growth path is covered by the payGladLoad integration test (fulfil grows the deck by one
inert piece; the crown does not teach).

### Part 2 — the Fair draft (2 of 5) + the hybrid cost  *(branch: `phase6-part2-fair`)*
- [x] State: `fairOffers` + `draftedThisMorning` (TurnState, dawn-reset)
- [x] `acquisition.ts`: `rollFair` (N=5, unowned, Standing-gated, `state.rng`),
      `standingUnlockedTier`, `cardTierOf`, `fairCostOf`, `draftFair` (handsel bands 1–2 / court band 3)
- [x] Hook `rollFair` + counter resets into `dawn()` (after `refillHand`, so hand draws are unperturbed)
- [x] Toy: retired `DRAFT_TUNABLES`/`rollOffers`/`draft`/`newPiece`; OfferRow reads `turn.fairOffers`,
      shows handsel price vs "court: chain N"; wired to `draftFair`
- [x] Tests: seeded roll deterministic + tier-gated + unowned-only + no dups; handsel take pays /
      refuses when short / not-on-offer; proud take refused without the term, succeeds with it, no coin;
      draft cap = 2/morning; bands + `fairCostOf`
- [x] `npm run check` green (126 pass, +8); code-review pass; Review Card

Verified (2026-07-14): `npm run check` green — typecheck + lint + 126 tests. In-browser (the toy):
the Fair shows 5 offers gated to apprentice-tier at Standing 5, drafting a card pays 1 handsel and
drops it from the row, and a 3rd take is blocked (cap 2/morning); drafted cards land inert in the
pack, not the hand. The proud/court path (gleam ≥ 12) is engine-tested (refused without the chain
term, succeeds with it, no handsels spent) — not reachable at the starting Standing in the toy.
Code-review (`/code-review medium`) caught a real bug: `rollFair`'s empty-pool fallback let a
drafted-out low tier leak higher-tier stock past the Standing gate (a backdoor to proud cards). Fixed
— the row now stays strictly within the gate (short/empty when drafted out), with a regression test.
