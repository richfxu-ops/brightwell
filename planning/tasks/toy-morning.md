---
status: In Review
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
- **Build (revised per user 2026-07-14: a page ON the codex, not a sibling):** esbuild (new
  dev-dep) bundles `main.ts` + the engine + the card JSONs into one script, which
  `npm run build:toy` injects between `TOY-BUNDLE` markers inside
  **`planning/roundelay-codex.html`** — a new "Toy Morning" top-nav section. The section
  shell and styles are hand-authored codex HTML; only the marked bundle region is generated.
  The toy inherits the Daylight theme for free.
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
- **React (user call, 2026-07-14, replacing the vanilla-DOM first cut):** the UI is React
  components (`src/toy/main.tsx`, esbuild `react-jsx`), making the toy the seed of the M5
  prototype rather than throwaway code. React/ReactDOM enter as the first runtime deps;
  the engine itself stays dependency-free. Bundle ~180KB inlined — fine for a local page.

## Plan

- [x] esbuild dev-dep + `scripts/build-toy.mjs` + `npm run build:toy` (marker injection)
- [x] Codex: "Toy Morning" nav section, shell + styles + bundle markers
- [x] src/toy/main.tsx (React): state render (room meter, chain, gleam, asking, hand)
- [x] The pour picker with full outcome preview (throwaway-state diff)
- [x] Play / errand / dusk / next-dawn flow + dusk summary
- [x] Event log glosser; deck picker; seed input
- [x] Verified: build clean (228KB bundle), codex self-test passes, mornings played through the DOM
- [x] Tutorial guide: progress-aware directions + primer + off switch (user request)
- [x] Board + docs sync; findings below

## Findings (the point of the toy)

1. **The preview is load-bearing — thesis confirmed.** "pour 2 × chain ×1.25 → lands 2.5 →
   WAKES" turns the multiplier from invisible arithmetic into aiming. The M5 UI must keep an
   always-on outcome preview; without it the bookkeeping risk is real.
2. **The snowball is felt immediately.** Morning 1 room 4 → wake two pieces → morning 2 room
   6.9, with the dawn line naming the seats. The progression hook works at toy fidelity.
3. **Friction:** grain-count gathers refuse ("no one to seat") on early mornings — canon-correct
   but reads as a dead card. M5 note: gray/annotate zero-value effects in hand.
4. **Fractional rooms** (4.6, 6.9) are fine in the meter, slightly mathy in prose — an M4
   display question (round, or embrace halves).
5. **Green mornings are thin (2–3 plays) but fast** — canon's decision floor feels gentle
   rather than boring only because turns resolve instantly. Turn speed is a feel constraint.
6. **The stall hurts correctly** (7 → 3 stings); banking cold (pour 0) reads as laying out
   tools — a satisfying setup verb.

Verdict so far: the core move survives contact — pour, flash of the wake, next-dawn snowball
is fun at toy fidelity. The user's own judgment is the real gate.
