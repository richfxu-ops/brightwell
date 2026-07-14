---
status: In Proposal
size: Medium
created: 2026-07-14
title: Toy morning
---

## Context

The "is it fun?" check (board, D-008-era assessment): a playable slice over the real engine,
built the moment Phase 3 could run a full turn — which is now. Not the M5 prototype: a toy.
Its job is to let a human feel the core move (pour, wake, overflow, stall, sweep) and to
teach us how much number-previewing the real UI must carry.

## Approach

- **`src/toy/main.ts`** — a small UI layer driving `morning.ts`/`effects.ts` directly: render
  state, take clicks, call `dawn/playPiece/stallAction/dusk`, re-render. No game logic in the
  UI — if the toy needs a rule, the engine grows it.
- **Build:** esbuild (new dev-dep) bundles `main.ts` + the engine + the card JSONs into one
  script, injected into an HTML template → **`planning/roundelay-toy-morning.html`** — a
  generated, self-contained sibling of the codex (same Daylight look, works from file://).
  `npm run build:toy` regenerates; the artifact is committed but never hand-edited.
- **The screen:** the room as a big meter; chain links + current multiplier; gleam; the
  asking's fill. Your hand as gallery-style cards. Click a card → a pour picker with a
  **full outcome preview** ("pour 4 × chain ×1.5 → lands 6 → WAKES · 1 past the ceiling
  → +1 gleam") — this preview IS the fun-thesis test. Buttons: play, run an errand (feel
  the stall), end the morning (dusk summary: what woke, what swept to the table), next dawn.
- **A plain-English event log** — the engine's narration, glossed.
- **Deck picker:** the true apprentice start, or any Way's teaching bundle (shared 7 + that
  Way's 7) so combos are feelable. Seed input for reproducible mornings.

## Decisions

- **F1 resolved as recommended:** one self-contained generated HTML page over the compiled
  engine; esbuild is the one new tool (no bundler enters the shipping engine — build-time only).
- **FIDELITY simplifications, marked:** a standing asking auto-refreshes each dawn at the
  leg's floor size (the Phase-4 lifecycle isn't in yet); camp-only (no map); no acquisition —
  the deck is whatever the picker dealt. The toy is an endless sandbox: mornings advance the
  calendar, nothing ends the run.
- **The toy never bypasses the engine.** Refusals render as the engine's own refused events;
  if something feels missing, that's a finding for the phase list, not a UI patch.

## Plan

- [ ] esbuild dev-dep + `scripts/build-toy.mjs` + `npm run build:toy`
- [ ] src/toy/main.ts: state render (room meter, chain, gleam, asking, hand)
- [ ] The pour picker with full outcome preview
- [ ] Play / errand / dusk / next-dawn flow + dusk summary
- [ ] Event log glosser; deck picker; seed input
- [ ] Generated planning/roundelay-toy-morning.html (Daylight look, codex cross-link)
- [ ] Verified: build clean, page loads from file://, a full Kilnfast morning playable by hand
- [ ] Board + docs sync; findings about feel recorded in the task file
