---
status: In Progress
size: Medium
created: 2026-07-14
title: Card Quality Rubric
---

## Context

Cards are currently checked only for **legality** (`validate.ts` — the canon firewall), never for
**quality**. Generated cards (the card-smith Part-3 pool) pass validation but can still be bad: the
2026-07-14 playtest surfaced a recurring pattern — the room-reading fills that one-shot the crown, the
grain-count fills that dry up once the deck is woken, and Even the Rim, a capstone whose headline verb
("pour the room onto itself") only trickles Standing and whose real value hides in an `on-fulfil`
clause. These are all **cost/benefit** and **replay-payback** failures with no automated guard.

We're building an **eval for card quality**: write the bar down, automate the checkable part, measure
the rest, and feed failures back — so every future card-smith run is aimed at the bar instead of a
roll of the dice.

## Approach

Three-layer enforcement (user-decided, 2026-07-14), **rubric-first**:
- **[LINT]** — rules decidable from card data become a build-time `card-lint` (quality sibling to
  `validate.ts`). Generated cards can't sneak past.
- **[REVIEW]** — judgment rules live in the rubric ([card-design.md](../card-design.md)) and are baked
  into the card-smith brief, so generation aims at the bar.
- **[HARNESS]** — "no dead cards / no dominant cards / every Way wins" is measured by the sim.

The cost/benefit lens: score each card's cost (1 play + wake-mark + room + deck-slot + Fair tier)
against its benefit by currency (fill / Standing / cards / tempo / room / handsels / board / audience),
and ask whether it pays back **on play and on replay**.

## Plan

- [x] Draft the rubric v0 — [card-design.md](../card-design.md): currencies + cost model, 16 rules
      across Value/Role/Decision/Identity/Empirical (each tagged LINT/REVIEW/HARNESS), cost bands, the
      Way-identity table, and the audit scorecard format.
- [x] Settle the four open calls — QUESTIONS.md §H → **D-022**: payback qualitative; opening deck
      self-sufficient; dead <3% / dominant >25%; fix the bare-rest-self cards (remove the trickle
      clause, give an on-identity ability) — Even the Rim + the six supports.
- [x] Build the **card-audit dashboard** — [card-audit.html](../card-audit.html), baked by
      `npm run audit` (codex pattern): §8 scorecard rows, rubric [LINT] flags, harness telemetry
      (play-share, win-deltas, exploit-fill share), suggested verdicts. First findings written up in
      `docs/balance-findings-2026-07-16.html`.
- [ ] Build **card-lint** — the [LINT] rules as a build-time check; `npm run check` fails on violation.
- [ ] Bake the rubric into the **card-smith brief** template so generation follows it.
- [ ] Fix the cards the audit + lint flag (start: Even the Rim / R2 overflow-must-be-spent); re-lint +
      re-harness green; Review Card.

## Decisions

- **Rubric-first, full 3-layer (user-decided, 2026-07-14).** Nail the rubric before the audit/lint,
  since both derive from it; invest in the automated lint so generated cards are checked forever.
