# Plan — Roundelay

> What we're building and the plan for getting there. The "why" and "what"; `ARCHITECTURE.md` is the "how".

## Purpose

**Roundelay** is a single-player roguelike economy deckbuilder where **attention is a physical force**. A turn is one *worked morning*: gather **the room** (attention pool), play **journey-pieces** (cards) in an unbroken chain; a card resting attention past its *waking-mark* **wakes** (fires permanently into your deck); overflow past a card's ceiling **brims** to **Standing** (gleam — the never-spent gate + fail-resource). Contracts are **askings** taken off town lanterns; escalation is the seasonal **Paling** plus a calendar-floored **crown** finale. Six archetypes from the six Walking Ways (Kilnfast, Eveners, Untold, Fairwrights, Mannerly, Gleaners).

Full design: `GDD.md` (7 locked layers) traces to `WORLD.md` (locked world bible). Aesthetic target: wonder, fantasy, whimsy, elegance (D-002).

## Scope

- **Now (this phase):** Stage 3 of the pipeline — build the playable engine + bot simulation and balance the game against the GDD's calibration targets.
- **In scope:** deterministic rules engine over the 14 effect primitives, bot players, balance simulation and tuning of card/contract numbers, the starter pool for all six archetypes.
- **Non-goals (explicitly not doing):** graphics/art production, audio, multiplayer, monetization, shipping platform (all undecided — see Open questions). No re-opening of locked WORLD/GDD canon except via a logged decision.

## Key features / capabilities

- Chain-based card play with wake (permanence) and brim (overflow → Standing) mechanics
- 4 interacting resource systems: attention / handsels (decaying currency) / gleam (Standing) / the Paling
- 14 effect primitives (`design/vocabulary.json`); all cards and contracts are data over them
- Escalating contracts (askings) + seasonal pressure (the Paling) + crown finale
- Six archetype decks from the six Walking Ways, each with a distinct capstone chain
- Outcome-only fail-pressure (the *spilling*) — no ambient Standing decay (world-forbidden)

## Roadmap (milestones / phases)

> These group the tasks in TASKS.md. Keep them coarse.

- **M1 — World (stage 1, world-architect):** ✅ DONE — `WORLD.md`, 55-mechanic ledger, ~169-term canon, all 7 layers locked.
- **M2 — Game design (stage 2, game-architect):** ✅ DONE — `GDD.md` layers 1–7 locked; seam files emitted (`design/vocabulary.json`, `design/round_metrics.json`, `src/content/`, `src/engine/vocabulary.ts`).
- **M3 — Engine + simulation (stage 3, game-loop):** playable rules engine (`effects.ts` resolvers per primitive), bot players, simulation harness emitting the 57 round-metric telemetry keys. Detailed 8-phase plan: `docs/engine-plan.html` (ground rules in D-008).
- **M4 — Balance:** tune numbers via bot sims until the GDD's calibration targets hold (see Constraints); resolve the open numeric obligations handed forward from stage 2.
- **M5 — Playable prototype:** a human-playable interface over the balanced engine. *(Shape TBD — see Open questions.)*

## Success criteria

- The engine implements all 14 primitives exactly as specified in `design/vocabulary.json`, with the compile-time cross-channel firewall respected.
- Bot sims run full runs across all six archetypes and emit the `design/round_metrics.json` telemetry keys.
- Balance targets from the GDD hold under simulation rather than hand-authored napkin vectors — including Gleaner pale-route reward vs risk, glad-load centrality ~54%, crown-stand spread .70–.99.
- Each archetype's capstone chain is a real, reachable ≥3-card combo in play, and no archetype is strictly dominant or degenerate.

## Constraints

- **Locked canon:** `WORLD.md` + `GDD.md` are binding; fiction-forbids-mechanic conflicts are P0 stops for the human. Commerce vocabulary is banned in-world (render diegetically per `terms.json`).
- **Open numeric obligations from stage 2** (route into M4): I-022 Untold per-leg count coefficients; I-044 glad-price brightening bounded below its tempo cost; I-045 last-red/red-thread double-tool sizing.
- **Token budget:** stage 3 (game-loop skill) is token-heavy — state plan + budget and get a go-ahead before starting it (per the run's ground rules in `HANDOFF.md`).

## Open questions

All open game-design decisions live in **`planning/QUESTIONS.md`** — the register of what
canon already answers, where the code drifts from canon, and what genuinely needs a human
call (organized by the engine phase that decides it). Toolchain and stage-3-approach
questions from this section were decided in D-007/D-008.
