# Index — Brightwell

> The map of the repo: where every doc, module, and tool lives. `CLAUDE.md` points here so it can stay lean (prefs only). **Start here to find the right file, then open that file for the detail** — don't expect the depth to live in this list. `planning/ARCHITECTURE.md` is the fuller structural reference (module responsibilities, exact commands, gotchas).

## Planning & project docs

- `planning/PLAN.md` — what we're building: purpose, scope, features, roadmap, open questions.
- `planning/ARCHITECTURE.md` — repo structure, module responsibilities, build/test/run commands, conventions to match. The deep version of this map.
- `planning/TASKS.md` — the task board (source of truth for work to do).
- `planning/tasks/` — one file per substantial task: its status, size, design, and checklist.
- `planning/DECISIONS.md` — dated log of decisions and their rationale (D-001… from the design pipeline onward).
- `planning/QUESTIONS.md` — the open-decisions register: what canon answers, where code drifts, what still needs a human call. Check it before designing any engine phase.
- `planning/card-audit.html` — per-card audit dashboard: rubric flags + harness telemetry, baked by `npm run audit` (`scripts/bake-card-audit.mjs`).

## Locked design canon (read, don't hand-edit — changes go through a decision)

- `planning/GDD.md` — the locked game design document (7 layers).
- `planning/WORLD.md` — the locked world bible.
- `planning/terms.json` · `planning/ledger.json` — canon term registry + mechanics ledger.
- `design/vocabulary.json` — canonical source for the 14 effect primitives (`src/engine/vocabulary.ts` derives from it).
- `design/napkin/*.py` — executable balance checks from the design pipeline.

## Code, content & tooling

- `src/engine/` — the pure rules engine. Start at `state.ts` (the whole `GameState`), then `vocabulary.ts` (the 14 locked effect primitives), `reads.ts`, `effects.ts`, `morning.ts` (the worked turn), `asking.ts` · `acquisition.ts` · `runframe.ts`, and `validate.ts` (the card firewall).
- `src/content/cards/` · `src/content/contracts/` — the card pool and contract tiers as JSON. Card behavior is data here, not engine code.
- `src/sim/` — the balance simulation harness (bots incl. the fill-first exploit policy, run-driver, metrics, and the `card-stats.ts` per-card reducer); `npm run sim` → `sim/out/records.json` · `summary.json` · `card-stats.json` (gitignored).
- `src/toy/main.tsx` — the toy-morning prototype: a design reference, not the engine.
- `scripts/` — tooling: `run-sim.mjs`, `build-toy.mjs`, `build-site.mjs` (assembles `_site/` for GitHub Pages), `bake-codex.py` (refreshes the codex's baked snapshots, including the Data Viewer's card data — run after planning or card changes).
- `planning/brightwell-codex.html` — the single-file codex site (Design · Engine · Data Viewer · Project · Reports); its Project → Tasks page is **the** task tracker (streams view + kanban + detail drawer). Published to `_site/` by `npm run build:site` and deployed via `.github/workflows/deploy.yml`.
- `planning/readable/` — hand-authored plain-English source for the codex's Questions/Decisions/Glossary tabs; baked into the codex by `bake-codex.py`.
- `docs/engine-plan.html` — the 8-phase engine build plan.
- `docs/balance-findings-2026-07-16.html` — Step-3 balance findings: exploit gaps, trivializer cards, the dead-15, flat Ways, fix order.
- `docs/way-design-review.html` — per-Way design review (canon vs pool vs telemetry): the convergence thesis behind D-024.
- `docs/way-rebuild-feasibility.html` — way-rebuild Phase 0: card-grammar census, per-Way feasibility matrix, the mechanics menu (P1–P7 picks).
- `docs/way-brief-eveners.html` — Phase 1 design brief: Eveners identity, laws, kit inventory with keep/rework/cut, slot map, the design-handoff template.
- `package.json` — dependencies + the `check` / `test` / `sim` / `build:site` scripts; `.nvmrc` pins Node 24.

Keep this map current on any structural change — a file, module, or doc added, moved, renamed, or removed, or the layout reorganized. Add, update, or drop the affected pointer(s) in the same change; a stale pointer is worse than none.
