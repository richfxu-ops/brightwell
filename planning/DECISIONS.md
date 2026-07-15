# DECISIONS.md — pipeline-test-02

## D-021 · Fills read the woken audience; crown demand 10→20 — card-flow playtest tuning (2026-07-14, user-decided)
Playtest follow-up to D-020 (branch cardflow-followups; the task is Complete, this is post-merge tuning
found by playing the toy). Three coupled findings, each harness-verified:
- **Room-reading fills one-shot the crown.** `fill` reads its amount and adds it straight to the need
  without spending the room; Fairwrights pump the room into the tens vs a demand-10 crown, so one play
  of a starter (Feed the Crown, read(room)) stood the whole crown. Fixed the room-fills off `room`.
- **Grain-count fills DRY UP late — the plateau, resurfaced.** `read(grain:<suit>)` counts only pieces
  that woke or were stamped **this morning** (D-009); a piece wakes once ever, so a fully-woken deck
  wakes nothing new and the count falls to ~0 exactly when the Wintering crown hangs. The mirror read
  `read(woken:<suit>)` — the accumulated cross-turn audience — is **highest when everything's awoken**.
  Moved the 13 grain-count fills to **woken:<suit>** (the model Kilnfast, the compounder, already won
  with). Scales with the engine you built all year; can't be cheaply spiked (earned over 27 mornings).
- **Untold is the exception → chain.** Untold's canon identity is a THIN fast deck (count-and-pace), but
  woken:thread rewards a FAT thread deck — the bot fat-decked to 51 cards and hit 43/50. Its five fills
  read **chain** instead (pace, thin-deck-friendly, bounded). Removes the outlier.
- **Crown demand 10→20 (supersedes D-018's "held at 10").** Woken-scaling fills made the crown trivial
  at 10 (229/350); swept the demand via the harness (10:229 · 20:79 · 25:34 · 50:1). **20** keeps every
  Way winnable under the simple bots (~23% floor, all 7 win 1–20, no outlier) while making the crown a
  real climb. Still a simple-bot floor — Phase-8 competent bots refine the absolute (D-016/D-018).
- The D-017 golden test retooled: the-fired-beam now fills by **woken:joinery** (on-identity for the
  Kilnfast cross-turn compounder); the golden reworked from "build the read this morning" to "the
  audience you woke on earlier mornings fills it." `npm run check` green (136).

## D-020 · Card pool doubled (49→97) + lean-start/deep-Fair — card-flow Part 3 (2026-07-14, user-decided)
Part 3 of the card-flow redesign: **more cards** so a woken deck doesn't plateau and every Way can
stand the crown. Two decisions:
- **Lean start, deep Fair (user-decided over seed-everything).** New cards are Fair-only *draftable
  variety*, not dealt into the opening deck. Implemented as a `starter` tag: the 42 existing Way cards
  are tagged `starter`, and the sim's `seedDeck` seeds only starter-tagged cards (a ~1-line harness
  change, behavior-preserving — all existing cards are starters, so numbers held identical). This keeps
  starting decks lean (~14) so *draft choices*, not a fixed deck, drive run-to-run diversity, and makes
  the deeper pool the source of "always something new to wake". Rejected: seed-every-Way-card (starting
  decks balloon to ~21, the Fair matters less, every run of a Way plays out the same).
- **Pool generated via per-Way card-smith subagents (user-decided over hand-authoring).** Six subagents
  (one per Way) each drafted 8 cards to an identity brief over the locked 14 primitives; all pass
  validate.ts. Added Fair-only EXCEPT **eveners' the-dusk-gift + fairwrights' feed-the-crown**, seeded as
  `starter` fillers — the fix for those two Ways carrying **no `fill` card** (crown unstandable from their
  deck → 0 wins). Every Way now has a starter filler + a mid fill route + a proud alternate capstone. 3
  new eveners cards set to thread grain (dance-primary/thread-secondary, canon) so doubling two dance
  Ways didn't over-skew the pool (would have broken the glad-load grain-weight test — a real balance
  signal, not a brittle test). A new test guards the per-Way starter-filler invariant.
- **Harness:** wins **6/350 → 106/350**, every Way wins (eveners 0→37, fairwrights 0→8). **Build
  diversity strong** — 80-91 distinct cards played/Way, top card only 7-10% (no dominant card). The high
  greedy-bot win rate (eveners 74%) is a simple-bot artifact; **absolute crown/gleam difficulty tuning
  stays deferred to Phase 8** (competent bots, per D-018). The eveners/fairwrights spread mirrors canon
  identity (consistency vs variance). `npm run check` green (135). No locked canon or engine primitive
  touched — new behavior is card DATA + one harness deck-construction tweak.

## D-018 · Overkill→gleam faucet tightened — the fail-state gets teeth (2026-07-14, user-decided)
Playtesting + the harness showed Standing balloons to ~200 (gleam_peak median 196, **quiet-walks
0/350**) — the safety resource is trivially maxed and the fail-state never threatens; D-017 worsened
it (fill cards' "pour room onto itself" self-rest now fires every play). Tightened the overkill→gleam
curve: **`FULL_RATE_BAND` 6→3, `DIMINISH_RATE` 0.5→0.25** (was L6 §4's locked 6/0.5 — this amends it).
Cut gleam_peak median 196→105 (still generous; the residual is the fill cards' self-pour, a card-design
matter for the card-flow redesign Part 3). **Crown demand held at 10** (user-decided — simple bots win
only ~5-10%, so it's non-trivial; final crown/gleam tuning deferred to Phase-8 competent bots). Tunable.

## D-019 · More Fair flow — wider row, higher take cap (2026-07-14, user-decided)
Card-flow redesign Part 2: to ease the "all-woken is boring" plateau, more cards flow in each dawn.
**`OFFER_N` 5→7, `DRAFT_PER_MORNING` 2→3** (`ACQUISITION_TUNABLES`, tunable). Harness: drafts/run
roughly doubled (turnover up, plateau eases); a small win dip (8→6/350) from deck dilution — offset by
Part 3's larger filler pool + the release valve, final tuning Phase 8. Hand size held at 5.

## D-017 · `fill` fires on-play, not on-wake — repeatable fills, no hoarding (2026-07-14, user-decided)
Playtesting surfaced two fun-killers with one root cause: fills fired **on-wake** (one-shot), so a
mature deck went passive AND standing the crown degenerated into *hoarding* a fill card unwoken until
the Wintering. Moved `fill` to **`on-play`** on the 4 on-wake fill cards (the-fired-beam, the-standing-
count, the-silver-refrain, ripe-mending; the other 2 were already on-play) — a filler now fills every
time it's played, and a woken filler stays useful. ripe-mending reordered (fill before its self-pour,
so it reads room before draining it). **Harness: winnability proven** — this change alone took wins
**0/350 → ~11/350** (even simple bots stand the crown now), confirming 0-wins was this trap, not broken
numbers. Card-authoring standardization (the GDD `fill` primitive is *defined* on-play, §L7; §2's
on-wake flavor wasn't implemented) — **but it retires the GDD L7 "aim the room at a capstone to wake+
fill by proxy" combo** (a capstone woken by another card's pour is in-play, not playable). Golden test
retooled to the new reach ("build the read, then PLAY the filler") + a repeatability test added.
Part of the card-flow redesign (more cards + more flow still to come).

## D-016 · Simulation harness (engine Phase 7) — the balance thermometer, built (2026-07-14, user-decided)
The M3 capstone: `src/sim/` plays bot games over seeded runs and emits per-run `round_metrics`
records so M4 balance can derive real numbers (not napkin shape-checks). Built + tested (134 pass),
merged. Drives the engine's **public API only** (never internals); pure and seeded (a record replays
exactly). Split into two reviewed parts (the pipeline, then the six archetype policies).
- **The 57 keys partition three ways** (`keys.ts`, self-validating): **37 per-run-real** (off the
  event log + final state), **7 per-run structural-zero** (deferred systems — combing, gleanings,
  idle-lapse, glad-price, the untold trio — emitted as honest zeros tagged with what each awaits),
  **13 cross-run aggregates** (win rates, the six axes, spreads, dominated pairs) that a single record
  can't hold → **Phase 8** derives them. The completeness gate covers per-run keys.
- **User-decided:** **simple bots** (greedy tilts, not optimizers — the numbers are a **floor**, not
  to be over-trusted); **N ≈ 50** runs/archetype (Phase 8 scales); **canon-accurate empty purse** (no
  toy stipend — the sim measures the real earned-handsel economy).
- **The harness surfaced real signals (preserved, not papered)** for Phase 8: eveners/fairwrights (+
  the apprentice base) carry **no `fill` card** → can't fulfil from the starting deck; `soothe` needs
  a last-red never sourced; the free **court** path dominates deck-growth; fairwrights spikes gleam
  highest. Under the simple bots every run drifts (0 wins) — expected of a floor.
- **Phase 8 (the balance sheet)** is [balance-sheet.md](tasks/balance-sheet.md); it consumes these
  records. Its orchestration (hand-rolled vs the `game-loop` skill) is QUESTIONS.md §F3, to decide
  when the first records land — now.

## D-015 · Acquisition (engine Phase 6) — the Fair + hybrid cost; D-013's cost question resolved (2026-07-14, user-decided)
The deck can now **grow** (~7 → ~20), so a run can build an engine big enough to stand the crown
(Phase 5's win gate). Built + tested (126 pass), merged. New `src/engine/acquisition.ts`; every
number an `ACQUISITION_TUNABLES` entry (feel-it-out, M4-tunable); all acquired pieces arrive **inert**;
all rolls seeded via `state.rng`. Three channels:
- **The glad-load taught card** — fulfilling a need teaches one journey-piece (retired the
  `taughtCard: true` stub). Drawn weighted to the maker's **dominant gleam-grain** (D1); the crown
  doesn't teach (its stand ends the run).
- **The Fair** — a per-morning offer row, **draft k=2 of N=5** ([CANON]), rolled fresh each dawn,
  Standing-gated to unowned cards. The row stays **within** the Standing gate (short/empty when
  drafted out — no backdoor to higher stock; a code-review pass fixed a fallback that leaked one).
- **The release** — last-light 1 un-woken piece/morning, the thinning valve so the deck can grow
  past ~20 (D-013 draft-2 / release-1).

**D-013's open cost question → resolved: option (c), hybrid tiered.** Standing **gates** which tier
is offered ("the market widens as gleam rises" — gleam read, never spent). *How you pay* splits by
tier, respecting canon's R2 line: **apprentice-floor tiers are BOUGHT with handsels** (canon-legal —
R2 buys low taught pieces); **the proud tier is COURTED** — a performed chain-term wins it, no coin
("a key that turns, never a coin that leaves"). This edits **no locked canon** (options (a) ratify-
handsels-buy-cards and (b) courting-only were rejected — (a) amends R2/R3, (b) strips handsels of a
card-sink). Built in two reviewed parts (deck-growth, then the Fair).

**FIDELITY deferred:** the proud term is a single flat knob (`chain ≥ 3`; per-card terms later);
D1's "answering-asking's-grain-pool" half (askings carry no grain field yet); the full R2/R6 economy
(introduction-jars, idle-lapse, twice-benched, courting→bench D2, gleanings, apprentice-stuff D3).
Map/routing + the meta-layer stay out. **Closes QUESTIONS.md §D D1 + D4** (D2/D3 still deferred).
**Unblocks the sim harness** — with Phases 4–6 all real in the engine, Phase 7–8 can run a full run.

## D-014 · Run frame (engine Phase 5) — the year ends three ways; C5 adopted (2026-07-14, user-decided)
The run now concludes (was an endless sandbox). Built + tested (108 pass), merged. `runframe.ts`,
every value a `RUN_TUNABLES` entry (adopted-but-tunable, per the "feel it out" stance):
- **Two run-ends (GDD §6):** Standing-zero any season → the **Quiet Walk** (survivable dimming);
  the first still dawn → **won** only if still lit AND the crown stood, else **drifted**.
- **C5 · the crown** → a single demand-10 crown asking hung in the Wintering (the last leg); stand
  it or drift. Closes QUESTIONS.md §C5.
- **Opening Standing fixed to 5** (was the placeholder 1), so the fail-state isn't trivially hit.
- **Simplification (toy-noted):** standing the crown ends the run **immediately** into a triumphant
  ending rather than playing out the remaining Wintering mornings (canon frames the check at the
  first still dawn).
- **Static-deck-must-lose is a test, not just prose:** the apprentice hand carries no `fill` card,
  so a static deck can never stand the crown — the win gate requires growth (closes the turtle
  dodge, GDD §5). New Standing-loss path `spillGleam`; `peakGleam` one-way ratchet (never falls,
  preserved through spills). Two code-review passes hardened it (concluded runs are inert).

## D-013 · Drafting adopted as the Phase-6 acquisition direction — "the Fair" (2026-07-14, user-decided)
Playtesting the toy surfaced that a small, fully-woken deck **plateaus** — nothing new to wake
(the "all my cards are awoken, now what?" moment). Decision: acquisition should be **frequent
drafting woven into the turn**, not the rare seasonal event the GDD sketched. Prototyped in the
toy (FIDELITY, **not yet engine or canon**; all knobs in `DRAFT_TUNABLES`):
- a **per-morning offer row** ("the Fair"), draft up to 2/morning; the deck may grow larger than
  the GDD's ~20 sketch, **balanced by a release** (last-light an un-woken card, 1/morning);
- **Standing GATES the market** — current gleam unlocks richer card tiers (apprentice→mid→capstone).
  This is pure canon ("the market widens as gleam rises"); Standing is **read, never spent**;
- **handsels PRICE the take** — each card costs money by its tier.
**Preserved:** the locked "Standing is never spent — a key that turns, never a coin that leaves."
**OPEN for the Phase-6 build (must reconcile):** canon reserves handsels for small goods, *not*
power cards (GDD R2/R3). The toy pricing cards in handsels is an experiment — Phase 6 must either
(a) ratify handsels-buy-cards as a canon amendment, or (b) swap to a canon-legal cost
(courting-performance / deck-slot dilution). Flagged, not resolved. See [sim-harness.md](tasks/sim-harness.md) sequencing.

## D-012 · Asking lifecycle (engine Phase 4) — C1/C2/C3/C6 adopted, M4-tunable (2026-07-14, user-decided)
The Phase-4 contract lifecycle (accept · fulfil · escalate · go-stale) is built, tested (100
pass), and merged. The four open items in QUESTIONS.md §C are **adopted as the working design,
every value an `ASKING_TUNABLES` entry** (user asked to keep them changeable — "feel it out
first" — so adopted-but-tunable, not locked-hard):
- **C1** spilling cost = the stale asking's **tier size**, floor 1;
- **C2** unmoved-room flop = a morning ended with the asking **untouched AND** the room **never poured**;
- **C3** staleness = carried **past the leg it was accepted in**;
- **C6** glad-palm **+1** on kettles now; delayed tellings **deferred** (FIDELITY marker).
New engine surfaces: `spillGleam` (the **only** Standing-loss path — `creditGleam` still forbids
decrements), `peakGleam` (a one-way ratchet that never falls). The toy retired its FIDELITY
asking stub and now consumes the real lifecycle. Closes QUESTIONS.md §C1/C2/C3/C6.

## D-011 · The game is titled BRIGHTWELL (2026-07-14, user-decided)
"Roundelay" stays the locked name of the LAND and its round-song (WORLD.md L1 untouched);
the GAME's title becomes **Brightwell** — chosen for sound ("Roundelay doesn't roll off the
tongue"), from a shortlist riffing softer on "Brightwork". Diegetic anchor, added to
terms.json (additive, layer 2-adjacent): a **brightwell** is the folk name for a town's pool
of kept light — the node's local table where swept attention waits for dawn
(`the-returning-table` / `gloaming-table` ledger ids unchanged). The Paling dims brightwells;
makers refill them; the title is what a maker leaves behind. Sweep 1: title surfaces
(codex masthead/title, toy UI strings, package.json, PLAN.md). Sweep 2 (same day, user):
full rename — the six planning pages became brightwell-*.html with all cross-links, scripts,
and doc references updated. Locked prose (WORLD.md/GDD.md/world/design pipeline records)
keeps Roundelay as the land's name.

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
