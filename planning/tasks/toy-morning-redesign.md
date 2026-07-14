---
status: In Review
size: Medium
created: 2026-07-14
title: Toy Morning redesign
---

## Context

The first Toy Morning cut (tasks/toy-morning.md) proved the loop is fun but scatters
information and buries causality in a flat text log. Its findings fed a Claude Design brief;
the resulting handoff (vendored at `design/handoff/toy-morning-ui/` — README + interactive
prototype + reference engine port) specifies a single-screen dashboard redesign: room
provenance chips, cards as pourable vessels, an always-on visual pour preview, a Woken
Crowd panel, a grouped "Moments" causality feed, dusk/dawn screens, and the
progress-aware guide — all in the codex's Daylight palette.

The handoff predates the Brightwell rename: where it says `roundelay-codex.html`, read
`planning/brightwell-codex.html`.

## Approach

Recreate the prototype inside the real toy — a rewrite of `src/toy/main.tsx` (React 19,
esbuild) and the Toy-Morning CSS region of `planning/brightwell-codex.html`, re-bundled
with `npm run build:toy`. The handoff README is the design of record: layout, tokens,
copy, and interactions are specified there and in `Toy Morning.dc.html`; follow them
pixel-close but express colors via the codex's existing `--*` Daylight variables.

**The iron rule (from the handoff, matching this repo's own law):** the bundled
`engine.js` is a reference port only — never shipped, never reimplemented. The UI's only
rule source is the real engine (`dawn`/`playPiece`/`stallAction`/`dusk` from
`src/engine/morning.ts`); previews come from calling pure `playPiece` on current state
and diffing — the `previewPlay` pattern the toy already uses. Its `glossEffect` /
`previewPlay` / `buildMoment` functions are read as specs for what each panel needs,
then fed from real `GameState` / engine events (mapping table in the handoff README).

Everything stays UI-side: no engine changes expected. If a panel needs data the engine
doesn't surface (e.g. per-part dawn income for the provenance chips — the port bundles
it on `turn.dawnIncome`; the real engine emits it in the `dawn` event's data), that's an
engine finding to flag, not a UI workaround.

## Decisions

- **Existing toy behavior carries over unchanged** — same engine calls, same FIDELITY
  stand-ins (auto-refreshing asking, endless sandbox, deck picker + seed). This is a
  presentation rewrite, not a rules change.
- **No vessel graphic on hand cards** (tester confusion — an empty vessel reads wrong);
  vessels appear only in the pour panel and on the table.
- **Zero-value reads are flagged in hand** ("— nothing to feed yet") — directly addresses
  finding 3 of the first toy (dead-reading grain-gathers).
- **Motion respects `prefers-reduced-motion`**; refusals stay surfaced as engine `refused`
  events in the Moments feed, never suppressed.
- **One engine touch (event data only):** the `dusk` event now also carries `unspent` and
  `coldSet` alongside `sweep` — the dusk screen itemizes them and they were already computed
  in `dusk()`; no rule changed. Dawn provenance needed no engine change (derived from the
  `dawn` event + the exported `DAWN_BASE`).
- **Chain multiplier displays exact** (×1.25, not the prototype's rounded ×1.3) so the
  spend × chain = lands arithmetic reads true.

## Plan

- [x] Skeleton: masthead, guide strip, status strip, body layout (center + right rail) — new CSS region in the codex
- [x] Status strip: The Room (number, bar, provenance chips), The Chain (beads, ×now/×next, braced), The Need (progress, fillable-cards line)
- [x] Hand grid: card rows (grain, chips, plain-English effects with zero-value flags), selected/fillable states
- [x] Pour panel: vessel with mark/ceiling lines + ghost fill, slider, spend → chain → lands row, delta badges, pour/bank actions
- [x] On the table: cold-banked and woken mini-vessels
- [x] Right rail: Woken Crowd (home-note, seat values, grant lines) and Moments (grouped causality feed with delta badges)
- [x] Dusk screen + dawn moment; pinned actions footer (errand cost preview, end morning)
- [x] Progress-aware guide ported to the new milestone markers
- [x] Motion polish (vessel fill, ghost pulse, wake glow) + reduced-motion
- [x] `npm run build:toy` clean; typecheck; play mornings through the DOM to verify
- [ ] Board + docs sync (on merge)

Verified in-browser (2026-07-14): pour → wake → chain ×1.25 → overkill (+2 Standing) →
errand (chain breaks) → dusk itemization → next dawn (room 6.9 from 3 seats) all match the
engine's own events; deck switch to Kilnfast flags The Fired Beam as a need-filler; all 92
engine tests pass unchanged except the enriched dusk event (additive).
