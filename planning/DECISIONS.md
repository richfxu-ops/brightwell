# DECISIONS.md — pipeline-test-02

## D-010 · The worked morning's five rules (2026-07-14, user-decided one by one)
The QUESTIONS.md §B calls that shape engine Phase 3:
- **B1 · The dusk sweep.** Unspent room + attention on cold pieces seep to THIS node's table
  at dusk (recoverable up to ⅔ by camping, locked); woken pieces keep their attention
  permanently; cold pieces reset to 0 at dawn — no slow-cook waking. Printed marks stay honest.
- **B2 · Stalls ("try for now").** Any non-play morning action stalls; an unbraced stall
  halves the room (round down); a brace absorbs exactly one stall. Halving rate = M4 dial.
- **B3 · Chain-order cascades.** Trigger listeners fire in played order this morning; each
  effect instance fires at most once per morning (loops structurally impossible).
- **B4 · A cycling discard** (user chose over straight-back-to-pack): unplayed hand + resolved
  cold pieces go to a discard zone at dusk; it reshuffles into the pack only when the pack
  runs dry — rotation you can count on. Adds a "discard" Zone.
- **B5 · Dawn effects fire from fired pieces only.** Woken things attend; an unwoken utility
  card is inert paper until woken once, then serves every dawn.

## D-009 · read(grain:<suit>) scope ruling (2026-07-13, user-approved)
**`grain:<suit>` counts this morning's working** (pieces waking or stamped `<suit>` today; resets at
dawn); **`woken:<suit>` counts the cross-turn fired audience** (pieces fired on earlier mornings).
A canon *clarification*, not a change: the executable napkin Layer 7 was locked against
(`design/napkin/layer-07.py`, check 4) validates archetype chains by "C3 reads a surface C1/C2
wrote this chain" — which only holds under the this-morning reading — and the L7 cards use
`woken:` wherever they mean cross-turn compounding. The contrary "+1 room per joinery already
woken" comment in GDD L3 §3's illustrative example is a known doc slip (contradicted by that
example's own narration); the locked GDD text stays untouched.

## D-008 · Engine ground rules (2026-07-13, user-approved)
M3 engine architecture per `docs/engine-plan.html` (8 phases, bottom-up): (1) **pure & deterministic** —
one plain GameState, pure transition functions, all randomness from a seeded RNG carried in state;
(2) **event log** — every state change appends an event; tests/telemetry/UI read the log;
(3) **fidelity ladder** — v1 simplifies the map (2–3 offered next towns per dusk) and the outer
acquisition economy; every simplification carries a `FIDELITY:` marker + task-file line. Rules are
never changed by shortcuts, only detail deferred.

## D-007 · TS toolchain (2026-07-13)
Node 24 LTS via nvm (pinned in `.nvmrc`; the machine's system Node was EOL v12), TypeScript strict
ESM with `tsc --noEmit` as checker only, vitest as test runner, no bundler and no linter yet
(deferred until there is engine code). Rationale + details: `planning/tasks/set-up-ts-toolchain.md`.

## D-001 · Locked mechanical spine (premise chassis) — LOCKED, pre-world
Single-player **roguelike economy deckbuilder** with:
- **Escalating contracts** — the run's pressure curve: obligations that grow in stakes/size as a run progresses.
- **Standing** — a depletable fail-resource: run ends (or degrades terminally) when Standing is exhausted.

The world must give both a *diegetic reason to exist* so they feel inevitable — discovered, not
explained. Contradicting the spine is out of bounds; a genuine fiction-demands-mechanic-change
conflict is a P0 that stops for the human. Everything else (resources, archetypes, currencies,
run structure) is open and should be *generated from the fiction*.

## D-002 · Creative direction — this run's prime aesthetic target
**WONDER, FANTASY, WHIMSY, ELEGANCE.** Joyful, luminous, strange in a way that delights rather
than oppresses — closer to Miyazaki / Le Guin / a beautifully illustrated picture-book than to
grimdark or bureaucratic satire.
- **Elegant** = metaphors so clean that mechanics feel discovered, not explained.
- **Visually beautiful** = every layer (especially L4 economy and L6 aesthetic/naming) must
  generate imagery an artist could paint: distinctive color, light, silhouette, and motion
  motifs — logged as ludic hooks AND **visual hooks**.
- **Escalating contracts and Standing need wondrous identities, not punitive-bleak ones**: find
  a register where rising stakes and a depletable Standing feel like part of the world's magic.
- **Guard:** whimsy must not collapse into twee generic fairy-tale. Banned lazy defaults: candy
  kingdoms, fairy godmothers, plucky talking animals, star-wish clichés. The anti-generic gate
  applies at full strength.

## D-003 · Do-not-resemble list (hard constraint for all proposers/critics/auditors)
1. **"Cantle"** (skyfall-market): sky-city held aloft by debt, obligation-as-buoyancy,
   promise-gripping machine, name-syllable currency, salvage-from-collapse economy.
2. **"The Curature"** (pipeline-test-01): legal-guardianship estate, courts/benches/filings/
   schedules, bureaucratic-procedural register, estuary-mud economy.
Explicitly banned this run: **debt/obligation cosmologies, courts, paperwork-as-core-fantasy.**
Resemblance to either world is a trope-critic P1+.

## D-006 · Layer 6 rename ratification (2026-07-10, user-approved)
The Layer 6 synthesizer executed four renames that edited locked L1/L2/L5 canon; user ratified **all
four**. (Old spellings are recorded only in terms.json `renamed_from` — deliberately not repeated here,
so this file stays clean under the retired-alias canon scan.)
1. **The world's tide → the Paling** (D-005-sanctioned, I-002) — everywhere.
2. **grammar-of-light slogan verb → "places pale, people gleam, things wake"** — edits a BINDING L1
   law's wording; ratified so the pale/Paling word-family is complete (endorsed by both proposers +
   all 3 critics).
3. **The two hall-word fossils (L1 setting-out, L2 wall) → wintering-town / waymeet-board·porch-beam·
   wain-side** (I-047) — they predated the "ways keep no halls" canon.
4. **Run-scale unit → "verse of a Round"** (from the L2/L5 collision) — the run-scale sense now reads
   "verse"; the per-morning sense keeps its L5 meaning.
Canon scan re-run independently 2026-07-10 → clean. Reversible via `renamed_from` if ever needed.

## D-005 · GATE_BATCH decisions, layers 1–3 (2026-07-09, user-approved)
1. **L1 thematic_spine (Roundelay) locked as-is.** Open items routed downstream: I-001 two-filter
   escalation law already canon in L2; I-002 (renaming the world's tide, executed in Layer 6 as **the Paling**) + I-003
   materials-never-speak go to Layer 6 naming (via terms.json `renamed_from` + canon scan).
2. **L2 cosmology (the Round of Light) locked as-is.** I-017 (valley/hilltop dawn geometry) is a
   BINDING input to Layer 5 geography — it must state the elevation law in one line.
3. **L3 factions (the Walking Ways) locked as-is; the Untold's tempo-not-tonnage variant kept.**
   BINDING obligation on game-architect: prove numerically that the Untold's count-and-pace pressure
   matches the spine's escalation curve, or clamp it to size-escalation there (I-022).

## D-004 · Stage 1 run configuration (2026-07-09)
world-architect skill 2.3.0 / stage engine 2.7.0. `gate_mode: "batch"` (L1–3 consolidate into one
GATE_BATCH review). Default thresholds kept: trope_density ≤ 0.15, anchor_share ≤ 0.40,
ludic_coverage ≥ 0.80, intuitiveness ≥ 0.80, interacting_systems ≥ 4 (L4),
candidate_mechanics ≥ 12 (L7), max_revises 3. All micro-loops run via the Workflow engine;
3-auditor majority panels on L4+ audits and threshold-adjacent re-audits.
