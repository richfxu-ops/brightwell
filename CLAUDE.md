# CLAUDE.md

> Coding preferences for this repo. Project facts, plans, code, and tooling are indexed in `INDEX.md` (repo root) — read that to find any file. Keep this file prefs-only and lean; it's read into context every session.

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

## Code Quality Bar (the agent must meet this; the owner will check against it)

# Type safety
- No `any` — type unknown values `unknown` and narrow. Never silence the compiler with
  `as`, `@ts-ignore`, `@ts-expect-error`, or a non-null `!` to make an error go away; fix
  the type. A necessary cast needs a one-line comment saying why it's safe.
- Model variants as discriminated unions handled by an exhaustive switch (`never` default).
- State is immutable / `readonly`; never mutate inputs.

# Structure & maintainability
- Small focused functions (roughly 40 lines max); files roughly 300 lines max — propose a
  split past that. Pure core, effects at the edges. No premature abstraction (wait for the
  third use). Behavior lives in card/contract data, not new engine special-cases.
- No dead code, commented-out blocks, or unused exports. Comments say WHY, not WHAT.

# Change hygiene
- Every change keeps `npm run check` green (typecheck + lint + tests); new logic ships
  with a test. Small, single-purpose diffs.

## Review Card — end every non-trivial code change with this block
### Review card
- What changed & why: <1-2 lines>
- Key decision: <the choice, the alternative rejected, and why>
- Tradeoffs / debt: <declare any `any`, cast, `!`, or TODO added>
- Tests: <what's covered, or why none>
- Verify it yourself: run `npm run check`; look at <file:lines>; try <in-game action>

## Teach me agentic coding as we go

I'm learning agentic software engineering — the craft of building software by directing
AI agents — while building this game. Treat each task as a chance to teach that craft, not
only to ship code. This shapes HOW you communicate; it does not mean working slower or
lowering the engineering bar above.

- Narrate your own workflow. Before a non-trivial task, state the objective/spec you're
  working from and how you're breaking it into steps, so I see how a task becomes a plan.
  When you verify, say what you checked and how — that's the eval loop, name it as such.
- Name the pattern. When you're using a general agentic-coding technique, flag it in a
  one-line aside: "this is context engineering — I'm keeping only the relevant files in
  view," "this is a plan-first gate," "this is a verification step," "this would be a good
  subagent job." Then move on — an aside, not a lecture.
- Explain decisions so I can evaluate and push back, not just accept (ties to the Review
  Card).
- Teach me to prompt better. When my instruction was ambiguous or could have been sharper,
  tell me how I could have specified it better — my prompt is part of the system I'm
  learning to drive.
- When you finish a chunk, a one-line "what you learned about working with an agent here"
  recap is welcome, separate from the code.
- Keep it lightweight and opt-in. If I say "skip the teaching this time," drop it.

## Repo-specific guardrails

- **The design is LOCKED.** `planning/WORLD.md` and `planning/GDD.md` (all 7 layers) are locked canon from the world-architect/game-architect pipeline. Don't edit them casually — a change to locked canon is a decision, logged in `planning/DECISIONS.md`, not a drive-by edit.
- **Cards are data, not code.** Card and contract content lives in `src/content/*.json` over the 14 effect primitives in `src/engine/vocabulary.ts` / `design/vocabulary.json`. New card behavior means new data, not new engine special-cases.
- **Diegetic naming.** The world bans commerce vocabulary ("market", "stalls" as literal commerce) — use the in-world terms from `planning/terms.json`.

## Where to find things

**`INDEX.md` (repo root) is the table of contents** — where every doc, module, and tool lives, each referenced by path. When you need to find something (a planning doc, an engine module, content, a script), read `INDEX.md` first and follow the pointer, rather than searching blind. It's kept out of this file on purpose so `CLAUDE.md` stays lean. `planning/ARCHITECTURE.md` is the fuller structural reference.

**Keep `INDEX.md` current.** When you add a new important file, module, or doc (a new engine module, content file, script, or reference doc), add a one-line pointer to it in `INDEX.md` as part of the same change — a stale index is worse than none.

**Read `planning/PLAN.md` and `planning/TASKS.md` at the start of a work session.** When work is completed, update `TASKS.md`; when a notable choice is made, log it in `planning/DECISIONS.md`.

**Task lifecycle.** Substantial tasks are worked via the `/task` skill (`.claude/skills/task/SKILL.md`): statuses flow To Do → In Proposal → In Progress → In Review → Complete, and no implementation code is written before the design is signed off (In Progress). Even without invoking the skill, follow that lifecycle — never skip from an unscoped task straight into code.
