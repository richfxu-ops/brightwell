---
status: In Progress
size: Large
created: 2026-07-16
title: Way rebuild
---

## Context

D-024: the pool drifted from the GDD's six distinct win-levers into two generic fill reads
(`docs/way-design-review.html`) — patching drift card-by-card loses to rebuilding each kit against
its locked identity. **The user is the card designer; the agent organizes** — compiles designs to
data over the 14 primitives, validates (validate.ts + the card-design rubric), tracks progress, and
sims every batch against the exploit-gap / dead-count / identity-beats-exploit metrics (D-023
instruments). Kilnfast + Gleaners stay as reference kits and the control group.

## Approach

- **Phase 0 · Feasibility & mechanics review** (agent) — per-Way matrix of canon intent vs what the
  engine + card grammar can express today; a census of unused grammar (free design space); a
  mechanics menu in three buckets: deferred canon systems (sanctioned, unbuilt), engine support for
  locked identities (e.g. exhaust, the bench), new grammar (needs decisions). Output:
  `docs/way-rebuild-feasibility.html` + a discussion; the user picks which mechanics enter.
- **Phase 1 · Design briefs** (together) — one page per rebuilt Way before any cards: win-lever,
  R7 role slots (filler + builder + payoff + supports), numeric bands, canon laws. Requires ruling
  the doc contradictions first (tier table vs GDD marks; R3 vs A3 grain-reads; §7 vs A5 Mannerly
  payoff) — each a logged decision.
- **Phase 2 · Card-by-card rebuild, one Way per batch** (user designs, agent compiles/validates) —
  per card: plain-language sketch → JSON over primitives → validate + rubric + lint → per-Way batch
  sim + audit review before the next Way. Build **card-lint** early (rubric-task item) so designs
  get instant machine feedback. Suggested order: Eveners (no engine prerequisites, canon explicit) →
  Untold → Fairwrights → Mannerly (after its enabler decision) → shared pool.
- **Phase 3 · Integration** — shared pool, Fair dynamics, full-pool sim, then difficulty knobs
  (inherited from card-fix-pass Part 4) + I-044/I-045.

## Decisions

- **User-as-designer division of labor** (D-024) — the agent never invents card designs; it
  compiles, validates, measures, and flags.
- **Reference kits stay live** — every rebuilt Way sims against unchanged Kilnfast/Gleaners, so the
  baseline can't drift under us.

## Plan

- [x] Phase 0 — feasibility & mechanics review doc; discussed; all P1–P7 picks as recommended,
      logged as D-025 (rubric R3/R10/§7 amended in the same change)
- [ ] Phase 1 — design briefs for Eveners, Untold, Fairwrights, Mannerly, shared pool
      *(paused 2026-07-16: Eveners brief done — `docs/way-brief-eveners.html`; next step is the
      user's first card sketches, capstone suggested first; remaining briefs written as each Way
      comes up)*
- [ ] Build card-lint (with card-quality-rubric task) before the first batch
- [ ] Phase 2 — rebuild batches, one Way per branch, sim-gated
      *(Eveners batch begun 2026-07-17: even-the-rim reworked to canon C3 — the first card designed
      through the Workbench (D-027); landed on the `workbench` branch as the tool's acceptance
      test; the rest of the batch gets its own branch after that merges)*
- [ ] Phase 3 — shared pool + integration sim + difficulty knobs; findings report v3; Review Card
