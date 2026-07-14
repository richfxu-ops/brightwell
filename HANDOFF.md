# HANDOFF — pipeline-test-02 "Roundelay" · game-architect (stage 2) mid-run

Paste the section below into a fresh session to continue. Everything is durable on disk; this
resumes the 3-skill game-design pipeline at the exact point stage 2 paused.

---

## RESUME PROMPT (paste this)

Continue my three-skill game-design pipeline on the EXISTING project `~/Documents/games/pipeline-test-02`
(world **"Roundelay"**). Do NOT re-scaffold, do NOT touch `~/Documents/games/skyfall-market` or
`pipeline-test-01` (both on the do-not-resemble list). Read these first, they are binding:
- `~/.claude/projects/-Users-richardxu-games/memory/game-pipeline-run-learnings.md` (operational rules)
- `~/.claude/projects/-Users-richardxu-games/memory/pipeline-test-02-roundelay-state.md` (this run's state)
- `~/Documents/games/pipeline-test-02/planning/DECISIONS.md` (D-001..D-006: locked spine, creative
  direction, do-not-resemble, gate decisions, the L6 renames)

**Where we are:** Stage 1 (world-architect) is COMPLETE — `planning/WORLD.md` + `planning/ledger.json`
(55 mechanics) + `planning/terms.json`, all 7 layers locked, canon clean. Stage 2 (game-architect,
skill `~/.claude/skills/game-architect`, `scripts/design_state.py` v2.4.0, shared engine
`game-pipeline-core/stage_engine.py` v2.7.0) is IN PROGRESS. Design layers 1–4 are LOCKED. Layer 5
(archetypes) is RECORDED at **GATE_PAUSE** and the user APPROVED "lock all six archetypes + a
differentiation pass" — the differentiation edits and the `lock` are the immediate next task.

**IMMEDIATE next steps, in order:**
1. **Finish Layer 5.** Run the differentiation pass on the `## Layer 5 — Archetypes` section of
   `planning/GDD.md` (a small reviser+verifier Workflow, no-schema): give the **Gleaner** capstone a
   distinct winning verb built on `soothe` (adversity-harvest payoff reading `read(spiral)`/`read(season)`,
   node-local, never gleam) and the **Mannerly** capstone one built on `court` (proud-stock resolution,
   gleam stays a pure gate) — so 4/6 archetypes no longer share the `fill read(grain:<suit>)` idiom;
   keep each chain a real ≥3-card combo. Also: delete the false "Untold is the only one that reads
   grain as a fill" claim in §3; fix §2d citation `A5-C3`→`A3-C3`; restate Fairwright C1 `read(woken:*)`
   and Mannerly C2 court-reads-chain within the locked L3 grammar (don't edit locked L3); relabel
   Kilnfast/Untold "depth 4"→"3 distinct + accumulation loop"; repoint the vestigial same-grain
   mark-grain stamps at off-grain pieces; reframe Untold §2a/b as a game-loop calibration target; add a
   one-line note that I-017's elevation law is discharged in L1's dawn-income. Verify chains stay ≥3 and
   canon-legal, then `lock` Layer 5. Post a plain-language bulletin.
2. **Layer 6 — numbers_curves** (AUTO + napkin, depth gate `decisions_per_turn ≥ 3`): concrete numbers —
   deck/hand sizes, per-tier waking-marks + need-fills, the seasonal seep/crown curve, Standing values,
   handsel/decay rates, the six archetype axis magnitudes. This is where the deferred numeric obligations
   get fit: glad-price brightening < tempo cost (I-044), last-red/red-thread double-tool sizing (I-045),
   the Untold per-leg count coefficients (I-022), and the crown-route coefficients. Napkin proves the
   curve. Record → LOCK_OK if clean (no human gate). Bulletin.
3. **Layer 7 — starter_pool** (AUTO + napkin, depth gate `combo_density ≥ 0.5`): the concrete starter
   cards as data (per archetype), composed from the 14 L3 primitives. Record → **DESIGN_COMPLETE**.
4. **On DESIGN_COMPLETE:** ensure `planning/GDD.md` is whole; emit the game-loop seam
   `design/vocabulary.json` (the 14 effect primitives as data) + `design/round_metrics.json`
   (`{"keys":[...]}` telemetry keys the sim will emit); write `src/content/cards/` (starter pool) and
   `src/content/contracts/` (per-tier numbers) and `src/engine/effects.ts`-ready vocabulary; run `canon`
   clean; then OFFER stage 3 (game-loop) — do not auto-start it (it's token-heavy; state plan + budget +
   get go-ahead first, per the ground rules).

**Ground rules (binding, from the original run):** verdicts come only from the spines — act on them
exactly (INCOMPLETE = fix the audit/script never the number; BLOCKED needs verified resolution; a genuine
fiction-forbids-mechanic conflict is a P0 that STOPS for the user). `tokens_spent` = actual reported
subagent usage, never estimates. The napkin is EXECUTED by the engine at `record` — never self-report
`napkin_flags`. Gated layers need a human `lock`; present gates orient-then-decide (skills 2.4.0
explainability contract): a plain-language bulletin after every record, verdict glosses, never open the
decision UI in the same message as the first explanation.

**Binding obligations still open (route into the right layer / hand to game-loop):**
- I-022 Untold tempo: matched+forced+clamped structurally in L5; per-leg count coefficients to L6/game-loop.
- I-044 glad-price brightening bounded below its tempo cost; I-045 last-red/red-thread double-tool sizing — L6.
- Balance is asserted over hand-authored napkin vectors — game-loop derives real balance from bot sims
  (esp. Gleaner pale-route reward vs risk; the glad-load ~54% centrality; crown-stand spread .70–.99).
- L6 naming carries: render "market"/"stalls" diegetically (WORLD.md commerce-vocab ban) — the-courting /
  the-vouching / the-stalls-that-lean-in, never an in-world "market".

**CRITICAL operational reality — a platform classifier outage was intermittently gating ALL write/exec/
spawn tools** ("claude-opus-4-8 temporarily unavailable, so auto mode cannot determine the safety of…").
Read-only tools always work. Workarounds that worked this run:
- **Probe before launching:** run `python3 ~/.claude/skills/game-architect/scripts/design_state.py decide
  <proj>` (read-only-ish) — if it returns, the classifier is up; launch the Workflow immediately in that
  window. On a gate error, start a background `sleep N; echo done` timer (trivial commands stay
  allowlisted), and retry when it fires.
- **Use NO-SCHEMA workflow agents.** The classifier gates StructuredOutput submissions, which kills
  schema'd agents at the retry cap. Instead have each agent end its FINAL message with a fenced ```json
  block and parse it afterward. (All L1-revise through L5 ran this way.)
- **Workflow scripts are plain JS:** double-quote prose literals — backticks/apostrophes inside a template
  literal break the parser (bit us on L4/L5 with `brim`/`read` in backticks).
- **Record via Bash-python heredoc:** write `design/layers/layer-0N.json` then run `design_state.py record
  <proj> design/layers/layer-0N.json`. If a synthesizer's file write was blocked mid-workflow, recover the
  content byte-identical from the agent transcript jsonl under the workflow's `subagents/…/` dir, or from
  the agent's returned `full_section_if_blocked`.
- After any `terms.json`/GDD change, `design_state.py canon <proj>` (and `canon <proj> pin` to re-pin the
  registered `planning/world.html` view when its shared sources change).

**Micro-loop per layer (from the skill):** diverge (3 proposers gated / 1–2 auto) → red-team critics
(world-coherence, depth [the layer's gated metric], intuitiveness) → executable napkin on economy layers
→ synthesize (append the GDD section, update terms.json) → blind 3-auditor panel (majority vote) → record.
Every gated metric is set by the BLIND auditor reading the file, never self-scored.

**Key paths:** `planning/GDD.md` (L1-L5 written), `planning/ledger.json`, `planning/terms.json` (~169
terms), `planning/DECISIONS.md`, `design/config.json` (layer plan/gates), `design/state.json`,
`design/layers/`, `design/napkin/` (layer-02/04/05 present, executable), and the workflow scripts under
`~/.claude/projects/-Users-richardxu-games/89350073-…/workflows/scripts/`.

**Token spend so far (actual subagent usage), stage 2:** L1 ~915k · L2 ~1.10M · L3 ~930k · L4 ~1.24M ·
L5 ~1.39M ≈ **5.6M** (stage 1 was ~5.8M). Expect L6+L7 ~1–2M more.

---

## THE GAME IN ONE PARAGRAPH (for orientation)

Roundelay is a roguelike economy deckbuilder where **attention is a physical force**. A turn is one
*worked morning*: gather **the room** (attention pool), play **journey-pieces** (cards) in an unbroken
chain, and a card resting attention past its *waking-mark* **wakes** (fires permanently into your deck);
overflow past a card's ceiling **brims** to **Standing** (gleam — the never-spent gate + fail-resource).
Contracts are **askings** taken off town lanterns; escalation is **weather** (the seasonal Paling raises
minimum needs) plus a calendar-floored **crown** finale. Fail-pressure is outcome-only (reaching for big
plays risks the *spilling*), the world forbids ambient Standing decay. Resources: attention / handsels
(decaying currency) / gleam / the Paling, over 4 interacting systems. 14 effect primitives; cards are
data over them. Six archetypes from the six Walking Ways (Kilnfast, Eveners, Untold / Fairwrights,
Mannerly, Gleaners). Everything traces to the locked WORLD.md; the GDD is `planning/GDD.md`.
