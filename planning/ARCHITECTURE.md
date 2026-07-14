# Architecture — Brightwell

> How the repo is organized and how to work it. Keep commands accurate — mark anything unverified as TODO.

## Stack

- **TypeScript** (strict, ESM) on **Node 24 LTS** — the game engine (`src/engine/`). Node is managed by nvm and pinned in `.nvmrc`; tests run under **vitest**; `tsc --noEmit` is the typechecker (no build/bundle step yet).
- **JSON as content format** — all cards, contracts, and design-seam data are declarative JSON.
- **Python 3** — the design pipeline's napkin simulations (`design/napkin/*.py`) and one-off HTML build scripts. Pipeline-era tooling, not part of the game itself.

## Repo structure

- `src/engine/` — the rules engine. `vocabulary.ts` holds the 14 locked effect primitives as typed data; `effects.ts` (to be written in M3) implements a resolver per primitive.
- `src/content/cards/` — starter pool as data: one JSON per archetype (`kilnfast`, `eveners`, `untold`, `fairwrights`, `mannerly`, `gleaners`) plus `shared.json` and the combined `starter-pool.json`.
- `src/content/contracts/` — `tiers.json`: per-tier contract (asking) numbers.
- `src/sim/` — the balance simulation harness (Phase 7): bot policies, the run-driver, and the metrics emitter over the engine's public API. `npm run sim` writes `sim/out/records.json` (gitignored) for Phase 8.
- `design/` — the game-architect pipeline's machine state: `vocabulary.json` (canonical primitive definitions — source of truth for `vocabulary.ts`), `round_metrics.json` (57 telemetry keys the sim must emit), `state.json`/`config.json`/`layers/` (layer lock records), `napkin/` (executable balance checks).
- `world/` — the world-architect pipeline's machine state (stage 1 equivalent of `design/`).
- `planning/` — project docs + task dashboard: `PLAN.md`, `TASKS.md`, `DECISIONS.md`, this file, plus the locked design docs (`GDD.md`, `WORLD.md`, `terms.json`, `ledger.json`) and rendered HTML views (`world.html`, `brightwell-*.html`).
- `HANDOFF.md` — the stage-2 pipeline handoff/resume document (historical context; stage 2 is now complete).
- `scratchpad/` — throwaway scripts.

## Modules / components

- **Vocabulary (exists):** `src/engine/vocabulary.ts` + `design/vocabulary.json` — the closed set of 14 effect primitives, read-sources, triggers, play-events, and the cross-channel firewall (writers may bind only to `PLAY_EVENTS`). Cards never bypass this.
- **State & reads (exists):** `src/engine/state.ts` (the one JSON-serializable `GameState` + `createInitialState`), `rng.ts` (seeded dice carried in state), `reads.ts` (the nine `read(...)` sources; grain/woken scope per D-009).
- **Effects resolvers (exists):** `src/engine/effects.ts` — one pure resolver per primitive plus the engine automatics (`applyWake`, `settleOverkill`, `pourAttention`) and the single gleam door (`creditGleam`, provenance-checked). `validate.ts` — the static "fails to compile" firewall over card data.
- **The worked morning (exists):** `src/engine/morning.ts` — the turn conductor: `dawn → (playPiece | stallAction)* → dusk`, the D-010 rules (dusk sweep, stalls, chain-order cascades, cycling discard, fired-only dawns), and the trigger cascade.
- **Content (exists):** `src/content/` — cards and contract tiers as data over the vocabulary. Generated at DESIGN_COMPLETE from GDD layers 6–7.
- **Simulation harness (exists, Phase 7):** `src/sim/` — bot players + run-driver emitting per-run `round_metrics` records; feeds Phase 8 / M4 balance. Drives the engine's **public API only** (never internals). `keys.ts` (the 57-key manifest: 37 per-run-real / 7 per-run-zero / 13 Phase-8-aggregate), `driver.ts` (`runGame` + baseline), `policies.ts` (the 6 archetype tilts), `metrics.ts` (`collectMetrics`), `run.ts` (`npm run sim` → `sim/out/records.json`). Bots are deliberately simple — the numbers are a floor.

## Build / test / run

- Node version: `nvm use` (pinned to 24 in `.nvmrc`)
- Install: `npm install`
- Test: `npm test` (vitest)
- Typecheck: `npm run typecheck` (`tsc --noEmit`)
- Simulation: `npm run sim` (esbuild-bundles `src/sim/run.ts` and runs it → `sim/out/records.json`)
- Build / run / dev: none yet — engine-only; no lint/format configured (deferred until there's engine code)
- Napkin sims (pipeline-era, working): `python3 design/napkin/layer-0N.py`
- Task dashboard: `cd planning && python3 -m http.server 8000` → http://localhost:8000/dashboard.html

## Conventions (match these)

- **Data over code:** new card/contract behavior is new JSON over existing primitives; engine special-cases are a design smell and likely a canon violation.
- **Closed enums:** grains, read-sources, triggers, and play-events are closed sets (see `vocabulary.ts`). Extending them means re-opening locked GDD Layer 3 — a logged decision, not an edit.
- **Naming:** in-world (diegetic) terms come from `planning/terms.json`; no literal commerce vocabulary ("market", "stalls") in player-facing strings.
- **Docs style:** decisions logged as `D-00N · title (date)` entries in `DECISIONS.md`; design-pipeline issue ids (`I-0NN`) referenced where obligations carry forward.
- **Codex snapshots:** after committing planning changes (board, decisions, questions, task proposals), run `python3 scripts/bake-codex.py` — the codex's Project section fetches these files live when served, but the baked snapshots are what a double-clicked file shows.

## Gotchas / notes

- `design/`, `world/`, and `planning/GDD.md`/`WORLD.md`/`terms.json`/`ledger.json` are pipeline-generated and locked — don't hand-edit; changes go through a decision + the canon check (`design_state.py canon`, see HANDOFF.md).
- `src/engine/vocabulary.ts` is *derived* from `design/vocabulary.json`; if they ever disagree, the JSON is canonical.
- Git repo initialized 2026-07-13; `.gitignore` excludes `.DS_Store`, `scratchpad/`, `node_modules/`. No initial commit yet.
- The rendered `planning/*.html` views are generated artifacts of the markdown/JSON sources; regenerate rather than edit.
