# Tasks — Roundelay

> Source of truth for work. Format is fixed so `dashboard.html` can parse it:
> columns are `## ` headings; tasks are `- [ ]` / `- [x]`; optional `(P0)`–`(P3)` priority, `#tags`,
> and a `[Title](tasks/<name>.md)` link to the task's file in `tasks/` (worked via the `/task` skill).

## Backlog
- [ ] (P1) Build bot players for all six archetypes #sim #m3
- [ ] (P1) Simulation harness emitting the 57 round_metrics telemetry keys #sim #m3
- [ ] (P2) Balance pass: I-022 Untold per-leg count coefficients #balance #m4
- [ ] (P2) Balance pass: I-044 glad-price brightening bounded below tempo cost #balance #m4
- [ ] (P2) Balance pass: I-045 last-red/red-thread double-tool sizing #balance #m4
- [ ] (P2) Validate Gleaner pale-route reward vs risk under sim #balance #m4
- [ ] (P2) Verify glad-load ~54% centrality and crown-stand spread .70–.99 #balance #m4
- [ ] (P3) Decide prototype form (web/terminal) and sketch UI #prototype #m5

## Next
- [ ] (P0) Decide stage-3 approach: game-loop skill pipeline vs hand-built (plan + token budget sign-off) #m3
- [ ] (P1) Implement effects.ts: resolvers for the 14 primitives #engine #m3

## In Progress

## Done
- [x] Stage 1 (world-architect): WORLD.md, ledger, terms — all layers locked #m1
- [x] Stage 2 (game-architect): GDD.md layers 1–7 locked #m2
- [x] Emit game-loop seam: vocabulary.json, round_metrics.json, src/content, vocabulary.ts #m2
- [x] Initialize planning scaffold (CLAUDE.md, PLAN, ARCHITECTURE, TASKS, dashboard, /task skills)
- [x] Init git repository #infra
- [x] Build roundelay-codex.html — single-file codex site, Daylight watercolor design #docs
- [x] (P1) [TS toolchain setup](tasks/set-up-ts-toolchain.md) #infra #m3
- [x] (P1) [Engine state & reads](tasks/engine-state-and-reads.md) #engine #m3
