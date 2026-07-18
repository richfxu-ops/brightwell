---
status: In Progress
size: Medium
created: 2026-07-17
title: The Workbench
---

## Context

The user is the card designer (D-024) but faces two walls: the blank page, and mechanics recall —
the design constraints live across seven documents. `docs/card-workshop-concept.html` maps MtG's
design practice (skeleton slots, color-pie restrictions, sketch-now-cost-later) onto Brightwell's
existing pipeline and proposes a codex workshop screen. **Shape decided: A+** (D-027) — a sketchpad
with a *mechanical* Compile-to-JSON; all rule checking stays in TypeScript.

## Design (proposed — In Progress sign-off approves exactly this)

1. **A new Workbench section in `brightwell-codex.html`** with a Way picker. Launches
   Eveners-only; each Way lights up when its brief is written.
2. **`design/way-laws.json` — the shared rules file (the one-way door in this task).** Per-Way:
   banned/allowed primitives, the fill-read rule, grains, win-lever line, decision-fork bullets,
   role-slot list. Pool-wide: the D-025 card tier bands (their first machine home — today they're
   prose) and pool-wide bans (`fill(room)`). Two readers, one source: `bake-codex.py` (dropdown
   filtering + identity panel) and the future card-lint (rubric task). Rejected: laws hardcoded in
   codex JS (drifts) or parsed from brief HTML (fragile).
3. **Rebuilt cards carry a `role:` tag** (`role:filler|builder|payoff|support|capstone`) — the
   slot board computes filled/empty from archetype + role tags in the pool. Legacy cards without
   the tag fill nothing (correct: they're being replaced). Rejected: hand-maintained slot status
   (goes stale).
4. **The sketch form.** Fields mirror the card schema; trigger/primitive/param dropdowns populated
   from `vocabulary.json` filtered by `way-laws.json`; tier picker pre-fills mark/ceiling/
   woken-delight bands; the plain-English "what it does" compiles to the card's `note` (live
   ≤170-char counter — the pool test enforces that cap). Any fiddly param (read() amounts,
   targets) can drop to plain English and compiles as a TODO.
5. **Draft wrapper output** — Compile emits a copy block, never a pool entry:
   `{ draft: true, way, slot, card: {…starter-pool schema…}, todos: […], designNotes: "…" }`.
   The agent unwraps, resolves TODOs, runs validate.ts + card-lint + batch sim; only then does the
   card enter `starter-pool.json` (the only live card file per D-026; per-Way JSONs untouched).
   The browser never says "legal."
6. **Work-in-progress sketches persist in localStorage**; the copy block is the export.
7. **Precedent shelf** (last chunk): pool cards filtered by Way/role/primitive with telemetry
   columns (play-share, win-delta, exploit-fill share) baked from the sim's card-stats — the same
   numbers the audit dashboard shows.

## Plan (three chunks, each lands green and reviewable)

- [x] Design sign-off → In Progress (way-laws.json shape + role-tag addition approved 2026-07-17)
- [x] Chunk 1 — the reading half: Workbench section, identity panel, primitives crib, slot board;
      `design/way-laws.json` (Eveners + tiers) + bake-codex.py baking; INDEX.md pointer
      *(landed 2026-07-17 on branch `workbench`; refinement: slot-matching tags are
      `role:<slot-id>` with the slot ids declared per-Way in way-laws.json, not a fixed
      pool-wide enum — the enum would have collided with two Evener slots both being "builders")*
- [x] Chunk 2 — sketch form + Compile to JSON: per-primitive param widgets, escape hatches,
      wrapper output, localStorage. **Eval:** round-trip The Last Lighting — rebuild it in the
      form; the compiled card must diff clean against its starter-pool entry
      *(landed 2026-07-17: round-trip byte-identical incl. key order; negative test raised all
      6 expected law/band flags; TODO hatch emits path+text in the wrapper; sketch survives
      reload via localStorage. way-laws.json gained machine fields `fillReads`/`amountBans`/
      `fillReadBans` for the soft warnings — card-lint reads the same fields)*
- [ ] Chunk 3 — precedent shelf with baked telemetry
- [x] First real use: the Eveners capstone (2026-07-17) — user picked shape A from a pitched
      option set (self-contained: rest(room) + fill(chain) + draw@fulfil); compiled to the draft
      wrapper, swapped into the pool as the even-the-rim rework, passed validate.ts + note test +
      rubric REVIEW; single-card sim preview run (batch sim still gates the full kit)
- [ ] Review Card; board + INDEX current

## Decisions

- **Shape A+ over A/B/C** (D-027, user-decided 2026-07-17): compile is serialization only; rules
  stay in TS; the two honesty requirements are rules-as-shared-data and per-field escape hatches.
- **way-laws.json + role tags** — proposed above; approving the design approves them.
