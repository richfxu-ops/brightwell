---
status: Complete
size: Small
created: 2026-07-13
completed: 2026-07-13
title: TS toolchain setup
---

## Context

M3 (engine + simulation) needs a working TypeScript toolchain before `effects.ts` can be written. Today `src/` has only `engine/vocabulary.ts` and the JSON content — no package.json, no tsconfig, no test runner. All build/test commands in `planning/ARCHITECTURE.md` are `TODO: confirm`.

Blocker found during scoping: the machine runs **Node v12.18.3** (EOL since 2022); modern TypeScript/test tooling requires Node 18+. nvm is already installed (`~/.nvm`, not loaded in non-interactive shells) and Homebrew is available as a fallback.

## Approach

Minimal, boring setup — just enough to write and test the engine:

- **Runtime:** install current Node LTS via the existing nvm; pin it with a `.nvmrc` at the repo root so any shell/agent picks the right version.
- **Package:** `package.json` at the repo root — `private: true`, `"type": "module"` (ESM). Dev deps only: `typescript`, `vitest`, `@types/node`.
- **tsconfig:** strict mode, `module`/`moduleResolution` NodeNext, `noEmit` (vitest transforms on the fly; `tsc` is the typechecker, not the builder). No bundler — nothing ships yet.
- **Scripts:** `npm test` → `vitest run`, `npm run typecheck` → `tsc --noEmit`.
- **Smoke test** proving the seam is wired: `src/engine/vocabulary.test.ts` asserts 14 primitives exported and `starter-pool.json` contains 49 cards.
- Finish by replacing the `TODO: confirm` commands in `planning/ARCHITECTURE.md` with the real ones.

## Decisions

- **nvm over Homebrew for Node** — nvm is already installed and gives per-project pinning via `.nvmrc`; brew stays the fallback if nvm misbehaves.
- **vitest over node:test** — runs TypeScript with zero config, standard choice, watch mode for engine development.
- **ESM (`"type": "module"`)** — modern default; matches vitest and the eventual browser prototype.
- **No linter/formatter yet** — deferred until there's real engine code to hold to a style; avoids config churn now.
- **Shell profile** — nvm init added to `~/.zshrc` with explicit user approval (a classifier first blocked it); fresh shells now resolve Node v24.18.0. The old EOL v12 stays at `/usr/local/bin/node`, shadowed by nvm's PATH — removing it needs sudo and isn't worth it.

## Plan

- [x] Install Node LTS via nvm; add `.nvmrc`
- [x] `package.json` (private, ESM) with dev deps typescript / vitest / @types/node
- [x] `tsconfig.json` (strict, NodeNext, noEmit)
- [x] npm scripts: `test`, `typecheck`
- [x] Smoke test: 14 primitives in vocabulary.ts, 49 cards in starter-pool.json
- [x] `npm run typecheck` and `npm test` pass (5/5)
- [x] Update ARCHITECTURE.md Build/test/run section (remove TODOs)
