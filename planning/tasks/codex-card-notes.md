---
status: Complete
size: Medium
created: 2026-07-17
completed: 2026-07-17
title: Codex card notes & tooltips
---

## Context

The Data Viewer's card gallery is hard to read for the person it's for: every card is
described in the game's own jargon (wake-mark, ceiling, gleam, last-light…), and nothing
anywhere says *why* a card exists — what job it does in its Way's plan.

Two deeper problems surfaced while scoping:

- **The viewer's card data is a stale hand-pasted copy.** The codex shows 49 cards (the old
  7-card kits) hand-copied into a `GROUPS` constant inside the HTML; the real pool
  (`src/content/cards/starter-pool.json`) has 97. `scripts/bake-codex.py` refreshes every
  other snapshot but never touches card data.
- **`starter-pool.json` is the only live card file.** The engine, sim, tests, and card-audit
  all import it directly; the per-Way files (`eveners.json` etc.) are imported by nothing
  and have already drifted from the pool. Notes must therefore live in `starter-pool.json` —
  a note added to a way file would reach nothing.

## Approach

Three parts, in order — the pipeline fix first so the new content lands on real data:

1. **Bake real card data into the viewer.** Extend `bake-codex.py` to bake a
   `CARDS_SNAPSHOT` from `starter-pool.json` (all 97 cards, grouped by Way) and derive the
   viewer's `GROUPS` from it, deleting the hand-pasted constant. After any card change,
   one bake brings the viewer back in line with the shipped pool.
2. **Glossary tooltips, codex-wide.** Build a term → definition map from the hand-authored
   glossary (`planning/readable/glossary.html`, already baked into the codex) and auto-wrap
   known terms everywhere — Design prose, Data Viewer (stat labels, chips, effect glosses),
   Project, Reports — in a dotted-underline span that shows the definition on hover or tap.
   A small scanner walks the rendered text and wraps matches, so no section's HTML is
   hand-edited and new glossary terms light up on the next bake. Matching stays
   conservative — longest term first, code/raw blocks skipped, first occurrence per section
   only — so common words like "room" or "keep" don't carpet the page in underlines.
   Definitions stay authored in one place (the glossary); tooltips only reuse them.
3. **Per-card notes.** Add an optional `note` field — what this card is for, in plain
   words, 1–2 sentences — to each card in `starter-pool.json`; show it on the card tile
   and in the inspector. Agent drafts all 97 from the mechanics + Way briefs; user reviews
   per Way.

## Decisions

- **Notes live in the card JSON** (`starter-pool.json`), not a side file — decided in chat.
  A note travels with its card: when the way-rebuild renames or cuts a card, the note is
  edited or deleted in the same place instead of going stale in a parallel file.
- **`Card` gets an optional `note?: string`** in `src/engine/vocabulary.ts`. Not a canon
  change: the locked vocabulary (`design/vocabulary.json`) defines primitives, not a card
  schema, and the validator only inspects effects, so a presentational field passes through.
- **Notes stay 1–2 sentences.** The way-rebuild will churn kits; short notes are cheap to
  rewrite alongside.
- **Single filterable grid for all 97 cards** (over per-Way sub-tabs) — the existing
  Way/grain/role filter chips already narrow it; no new UI needed.
- **Tooltips are codex-wide**, not Data-Viewer-only — decided in chat (rejected: Data
  Viewer only, extend later). The scanner approach in Approach part 2 follows from this.
- **Notes drafted for all 97 cards in one pass** (over stable-Ways-first), user reviews
  per Way; way-rebuild churn accepted since notes are short.

## Plan

Part 1 — real card data in the viewer
- [x] `bake-codex.py`: bake `CARDS_SNAPSHOT` from `starter-pool.json`
- [x] Codex: derive `GROUPS` from the snapshot; delete the hand-pasted constant
- [x] Verify: 97 pieces counted; way/grain/role filters, inspector, and Effects-tab
      cross-links still work

Part 2 — glossary tooltips
- [x] Term → definition map built from the baked glossary
- [x] Tooltip span + styling (hover and tap/focus)
- [x] Auto-scanner wraps glossary terms codex-wide (Design, Data Viewer, Project, Reports)
- [x] Spot-check every tab for over- and under-highlighting

Part 3 — per-card notes
- [x] `note?: string` on `Card` in `vocabulary.ts`
- [x] Draft notes for all 97 pool cards; user reviews per Way
- [x] Render the note on tile + inspector
- [x] `npm run check` green
- [x] Re-bake the codex

Review fixes (user findings): released the two remaining overflow clips
(`.insp-stats`, `.ecard`) and added a flip-below for tooltips near the viewport
top; corrected the glossary's delight definition (scoring unit, not a per-morning
payment) after checking the engine.
