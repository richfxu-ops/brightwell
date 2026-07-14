# CLAUDE.md

> Coding preferences for this repo. Project facts, plans, and tasks live in `planning/` — see the index at the bottom. Keep this file prefs-only and lean; it's read into context every session.

## How to work with me

- **Permission before code.** Don't write or edit code until I've approved the plan — propose the approach first.
- **Plan first.** For any non-trivial change, lay out the approach and the files you'll touch before implementing.
- **Work on a side branch.** Create a branch for the change; don't commit straight to the main branch.
- **Small, modular chunks.** Deliver changes in reviewable pieces, not one giant diff.
- **Answer the question I asked.** Address the actual ask before volunteering extras; don't expand scope unprompted.
- **Ask, don't guess.** If something is ambiguous or not verifiable from the codebase, ask rather than assume.
- **Match the codebase.** Follow the patterns, style, and conventions already in the repo over any default preferences.
- **Prioritize maintainability and readability.** Write code the next reader can follow: clear names, small focused functions, comments only where the code can't speak for itself. Prefer the simple, boring solution over the clever one.
- **Be concise and direct.** Minimal preamble, no filler, no performed enthusiasm; straight talk over hedging.
- **Calibrated honesty.** Say "I don't know" when it's true; flag uncertainty instead of pivoting confidently.
- **Explain in plain language.** Assume I'm not very technical — explain things in simple terms, avoid jargon (or define it when unavoidable), and don't assume background knowledge.
- **Long explanations → a local HTML file, opened in my browser.** When an explanation would be long or detailed, write it to a local HTML file in the repo (e.g. under `docs/`), then run `open <file>` (macOS) to launch it in my default browser — the markdown link opens the in-app preview, which I don't want. Leave a short summary + the `open <file>` command in chat.

## Repo-specific guardrails

- **The design is LOCKED.** `planning/WORLD.md` and `planning/GDD.md` (all 7 layers) are locked canon from the world-architect/game-architect pipeline. Don't edit them casually — a change to locked canon is a decision, logged in `planning/DECISIONS.md`, not a drive-by edit.
- **Cards are data, not code.** Card and contract content lives in `src/content/*.json` over the 14 effect primitives in `src/engine/vocabulary.ts` / `design/vocabulary.json`. New card behavior means new data, not new engine special-cases.
- **Diegetic naming.** The world bans commerce vocabulary ("market", "stalls" as literal commerce) — use the in-world terms from `planning/terms.json`.

## Planning docs (where the project detail lives)

- `planning/PLAN.md` — what we're building: purpose, scope, features, roadmap, open questions.
- `planning/ARCHITECTURE.md` — repo structure, module responsibilities, build/test/run commands, conventions to match.
- `planning/TASKS.md` — the task board (source of truth for work to do).
- `planning/tasks/` — one file per substantial task: its status, size, design, and checklist.
- `planning/DECISIONS.md` — dated log of decisions and their rationale (D-001…D-006 from the design pipeline).
- `planning/QUESTIONS.md` — the open-decisions register: what canon answers, where code drifts, what still needs a human call. Check it before designing any engine phase.
- `planning/dashboard.html` — visual task tracker that reads `TASKS.md`.
- `planning/GDD.md` — the locked game design document (7 layers). `planning/WORLD.md` — the locked world bible. `planning/terms.json` / `planning/ledger.json` — canon term registry + mechanics ledger.

**Read `planning/PLAN.md` and `planning/TASKS.md` at the start of a work session.** When work is completed, update `TASKS.md`; when a notable choice is made, log it in `DECISIONS.md`.

**Task lifecycle.** Substantial tasks are worked via the `/task` skill (`.claude/skills/task/SKILL.md`): statuses flow To Do → In Proposal → In Progress → In Review → Complete, and no implementation code is written before the design is signed off (In Progress). Even without invoking the skill, follow that lifecycle — never skip from an unscoped task straight into code.
