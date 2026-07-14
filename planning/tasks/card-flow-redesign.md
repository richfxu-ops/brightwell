---
status: Complete
size: Large
created: 2026-07-14
completed: 2026-07-14
title: Card flow redesign
---

## Context

Playtesting (a full manual Gleaners run, 2026-07-14) surfaced two fun problems, both traced to one
root cause: **the interesting card effects (`fill`, `draw`) fire `on-wake`, which is one-shot.** After
a card wakes, replaying it only re-fires its small `on-play` effects — so (1) a mature deck of woken
cards is passive and dull ("all-woken is boring"), and (2) filling the crown degenerates into
*hoarding* a fill card unwoken until the Wintering (the fill is spent the moment you wake it). Both
are the same problem: decisions are front-loaded into waking, and woken cards go inert. The run
drifted with Standing 250 but the crown 0/10 — the win was never in reach because the filler was
spent 17 mornings early.

**Direction (user-decided):** fix the card *flow*, and make fills repeatable:
- **C · More cards** — the pool is only 49 (7 per Way); expand it so there's always something new to wake.
- **D · More flow** — bigger Fair / more draw / faster cycling, so new cards keep arriving.
- **A · Fills fire `on-play`** (repeatable) — no more hoarding; woken cards stay active. **Compensate
  by making the crown and filling requirements harder**, so the win stays earned.

## Approach

Three levers, sequenced so the **simulation harness validates each step** (the payoff of Phase 7 —
we can now measure whether the crown is standable-but-hard, and whether builds stay diverse):

- **A — repeatable fills + a harder crown (the mechanical core).** Move `fill` from `on-wake` to
  `on-play` on the fill cards (card *data*), so a filler fills every time it's played. Because that
  makes filling far easier, raise the crown demand and the asking/fill requirements until the harness
  shows a *good* line wins and a sloppy one drifts. Likely pair with tightening the overkill→gleam
  faucet (the run hit Standing 250 — the safety resource is currently trivial to max, decoupled from
  winning).
- **D — more flow.** Widen the Fair offer row, raise the draft cap, and/or add draw/hand, so the deck
  keeps turning over and new cards keep coming (`ACQUISITION_TUNABLES` + dawn — M4-tunable, not locked).
- **C — more cards.** Expand the pool over the 14 vocabulary primitives, per archetype + shared,
  honoring each Way's identity. The biggest content effort; could leverage the `game-architect` /
  card-smith tooling. Re-balance with the harness afterward (no dominant cards, builds stay diverse).

## Decisions

- **Only `fill` moves to `on-play`; other effects may stay `on-wake` (user-decided).** The hoarding
  gotcha was specifically about *filling*, so only the `fill` primitive becomes repeatable. One-shot
  "wake gifts" (a big draw, a one-time gather) stay `on-wake`, so waking still feels like a moment —
  just not the thing the crown depends on.
- **GDD check (2026-07-14): this is a card-authoring standardization, NOT a locked-canon override.**
  The GDD's `fill` primitive is *defined* on-play — "Pour **this play's** woken delight into the need's
  fill" (§L7). §2's "waking pays delight to fill" flavor is not implemented anyway (`applyWake` only
  fires the piece; all filling is via `fill` effects). The current pool is inconsistent — 2 fills are
  already `on-play`, 4 are `on-wake`. Moving the 4 to `on-play` aligns the pool with the primitive's
  own definition and resolves a documented ambiguity. Logged as **D-017**; no locked GDD text edited.
- **Difficulty is restored by demand/requirement scaling, not by one-shot fills (user-decided).** With
  fills repeatable, raise the crown demand + asking/fill requirements (and likely the overkill→gleam
  faucet) until the harness shows the win stays earned.
- **Part 3's pool is generated via the `game-architect` / card-smith tooling (user-decided).** A
  systematic, larger expansion over hand-authoring — then balanced with the harness.
- **Fix flow before/with content.** More cards without more flow doesn't fix the plateau; both ship.
- **The harness is the thermometer.** Every lever is validated by re-running the sim (winnability,
  crown-stand rate, build diversity) — this is exactly what Phase 7 was built to answer.

## Scope boundary

- **In:** card data (fill timing + new cards), `ACQUISITION_TUNABLES` / dawn flow numbers, crown/asking
  difficulty (`RUN_TUNABLES` / `ASKING_TUNABLES`), the overkill→gleam faucet if it proves trivial,
  and harness re-validation.
- **Out (for now):** the deferred systems (combing, gleanings, idle-lapse, map/routing, meta-layer) —
  unless a rebalance genuinely needs one. The engine's effect *primitives* stay the locked 14.

## Plan

Large — three parts, each its own branch + harness validation before the next.

### Part 1 — repeatable fills + harder crown  *(the mechanical core)*
- [x] Move `fill` to `on-play` on the 4 on-wake fill cards (starter-pool.json + per-archetype); reordered
      ripe-mending (fill before its self-pour). GDD golden example retooled + a D-017 repeatability test
      added; `npm run check` green (135). *(Design note: retired the aim-the-room-to-wake-and-fill combo.)*
- [x] Tightened the overkill→gleam faucet (`FULL_RATE_BAND` 6→3, `DIMINISH_RATE` 0.5→0.25, D-018);
      crown demand **held at 10** (user-decided — simple bots already only win ~5-10%, so it's not
      trivial; final crown tuning deferred to Phase-8 competent bots). 2 conversion tests updated.
- [x] Harness: **winnability proven** — on-play fills alone took wins 0/350 → ~11/350 (gleaners 5/50);
      gleam faucet tightening cut gleam_peak median 196 → 105 (still generous — residual traces to
      fill cards' self-pour, a Part-3 card-design issue). `npm run check` green (135).
- [x] Log D-017 + D-018 in DECISIONS.md; Review Card
- [ ] *(Deferred to Phase 8)* final crown/gleam difficulty tuning with competent bots

### Part 2 — more flow
- [x] Widen the Fair `OFFER_N` 5→7, raise `DRAFT_PER_MORNING` 2→3 (D-019); 2 tests updated
- [x] Harness: turnover up (drafts/run roughly doubled — apprentice 3.5→7.4, gleaners 5.5→11.9), the
      plateau eases; slight win dip (8→6) from deck dilution (offset by Part 3's fillers + the release
      valve; final tuning Phase 8). `npm run check` green (135). *(Held hand size at 5 — draw bump
      deferred; the Fair widening was enough flow for now.)*

### Part 3 — more cards
- [x] **`starter` tag + tag-aware seedDeck** (D-020): tagged the 42 Way cards `starter`; seedDeck now
      seeds only starter-tagged cards, so new cards are Fair-only variety. Behavior-preserving (all
      existing cards are starters → identical harness numbers). Lean-start-deep-Fair chosen over
      seed-everything so draft choices, not a fixed deck, drive run-to-run diversity.
- [x] **Doubled the pool 49 → 97** (8 new cards/Way) via per-Way card-smith subagents over the locked
      14 primitives; all pass validate.ts. Added Fair-only EXCEPT eveners' *the-dusk-gift* + fairwrights'
      *feed-the-crown*, seeded as `starter` fillers — the fix for those two Ways' 0-win trap (no fill
      card → crown unstandable). Every Way now has a starter filler + a mid-cost fill route + a proud
      alternate capstone. Rebalanced 3 new eveners cards to thread (dance-primary/thread-secondary) so
      doubling two dance Ways didn't over-skew the pool grain balance. New test guards the starter-filler
      invariant per Way.
- [x] Harness re-validated: wins **6/350 → 106/350**, every Way now wins (eveners 0→37, fairwrights
      0→8, kilnfast 0→19). **Build diversity strong** — 80-91 distinct cards played/Way, top card only
      7-10% (no dominant card, incl. the new fillers at ~8%). `npm run check` green (135).
- [x] Log D-020 in DECISIONS.md; Review Card
- [ ] *(Watch, Phase 8)* the greedy-bot win rate jumped high (eveners 74%); absolute crown/gleam
      difficulty tuning stays **deferred to Phase 8** (competent bots) per D-018 — the spread mirrors
      canon identity (eveners = consistency, fairwrights = variance), not a degenerate card.

## Tunables (set empirically during implementation via the harness; starting points)

- **Crown / fill difficulty (Part 1):** tune the crown demand + asking requirements to a band where a
  competent line wins meaningfully but a sloppy one drifts (target ~a few-tens-% for a decent bot;
  refine once bots improve). The overkill→gleam faucet is **in scope** here (Standing 250 in the
  playtest means the safety resource is trivial — tighten it so filling, not overkill, is the point).
- **Flow (Part 2):** starting guesses `OFFER_N` 5→7, `DRAFT_PER_MORNING` 2→3, plus draw/cycling if the
  plateau persists — all `ACQUISITION_TUNABLES` / dawn, harness-validated.
- **Pool size (Part 3):** aim to roughly double (~100), generated via the tooling, then trimmed for
  balance.
