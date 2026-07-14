# QUESTIONS.md — the open-decisions register

> Every game-design decision still to be made, in one place — so no phase turns an ambiguity
> into an accidental decision. Three kinds of entry:
> **[CANON]** — already answered by locked L1–L7 / the napkin; written here because it was
> scattered, and must be implemented as-is (re-deciding it is a D-log event).
> **[OPEN]** — genuinely undecided; needs a human call, recorded with a recommendation.
> **[DRIFT]** — places the current code deviates from canon; corrections, not choices.
> When an OPEN item is decided, log it in DECISIONS.md and mark it here.
> Sister doc: `docs/engine-plan.html` (the phases these decide in).

---

## A · Phase-2 code vs Layer 6 — corrections needed **[DRIFT]**

Found 2026-07-14 by re-reading L6 §4–§5 + the napkin against `effects.ts`.
**CORRECTED 2026-07-14** — `planning/tasks/align-resolvers-l6.md` implements all six;
interpretation calls (soothe harmonization, proud-vouch-at-6, worth = set, gather-as-seating,
starting stock 2 pending §D3) are recorded in that task's Decisions.

- **A1 · whittle bounds.** Canon: yields exactly **1 dull**, costs 1 play, **max 1/morning**,
  **consumes one apprentice-stuff** (`the-bounded-whittle`). Code: mints `floor(amount/3)` dulls,
  uncapped, consumes nothing. (Per-morning cap needs turn state; the consume needs stock.)
- **A2 · soothe law.** Canon (`last-red-cap`): mend = **min(rings, 2)**, max **4 soothes/run**
  (1 node / 1 knack / 1 season), and the soothe **removes that node's ring-indexed dawn bonus**.
  Code: mend = min(amount×scale, lastRed) — wrong formula, no run cap, no dawn-bonus removal.
- **A3 · retire residual.** Canon (`retire-residual`): worth = **this-cycle unspent attention
  only** (cycle net attention < 0 by design). Code: `1 + total set` — can exceed canon.
- **A4 · the vouching bands.** Canon (`gleam-bands`): grade availability by gleam — 1–5 dim
  (apprentice + first mid), 6–12 warm (mid; proud stalls lean in), 13–20 bright (proud full),
  21+ singing (capstone-scale). Code: flat `VOUCH_FLOOR = 1`. Court should gate by the stock's
  grade band.
- **A5 · the room softcap shape.** Canon (`gathered-room-softcap`): the **nth seated
  audience-thing** contributes `2 × 0.8^(n−1)` (plateau ≈ 10) — a decaying-seat law, not a hard
  room ceiling. Code: hard cap on gather at 10. Close in effect, wrong in mechanism; matters
  once Phase 3 makes dawn seat the fired audience.
- **A6 · DIMINISH_RATE is locked, not a placeholder.** L6 §4: full rate 1.0 for 6 past the
  ceiling, **then 0.5**. The code's value is right; its PLACEHOLDER label is wrong.

## B · Phase 3 — the worked morning

**[CANON] already fixed, implement as-is:**
- Chain multiplier: **m = 1 + 0.25×(links−1), cap 2.0** (napkin `CHAIN_M_BY_LEG`).
- Dawn income: **base 2 + 0.5×rings (local draw) + up-to-⅔ of yesterday's RETURN if camped
  + the home-note seat (+1)** (`dawn-floor-base`, `dawn-ring-draw`, `the-home-note-seat`).
- Hand: refill to **5** each dawn, **no carryover**; on-dawn draws stack on top.
- The home-note: a run-start seated audience-thing worth +1 room every morning (needs state).
- Starting deck spread: 2 joinery + 1 each thread/dough (mark 1) and song/glaze/dance (mark 2).

**[OPEN] to decide in the Phase-3 proposal:**
- **B1 · The SET/RETURN split — DECIDED 2026-07-14 (user): the dusk sweep.** At dusk, unspent
  room + attention on pieces that stayed cold seep to THIS node's table (cold pieces reset to
  0 set at dawn — no slow-cook waking); woken pieces keep their attention permanently. Camping
  recovers up to ⅔ (locked); leaving abandons the table. Goes into D-010 with B2–B5.
- **B2 · Stall and brace — DECIDED 2026-07-14 (user, "try for now"):** a stall = any morning
  action that isn't playing a card; an unbraced stall halves the room (round down); a brace
  absorbs exactly one stall and is consumed. The halving rate is an explicit M4 dial.
- **B3 · Trigger cascade order — DECIDED 2026-07-14 (user): chain order.** Listeners fire in
  the order their cards were played this morning, cascading naturally; each effect instance
  fires at most once per morning (loops structurally impossible).
- **B4 · Unplayed cards — DECIDED 2026-07-14 (user, against the straight-back recommendation):
  a cycling discard.** At dusk, unplayed hand cards and resolved cold pieces go to a discard
  zone; the discard reshuffles into the pack only when the pack runs dry mid-draw — players
  can count on seeing every card once per rotation. Adds a "discard" Zone to state. Attention
  still seeps per B1; nothing to a void.
- **B5 · on-dawn eligibility — DECIDED 2026-07-14 (user): fired pieces only.** A woken
  utility piece serves every dawn for the rest of the run; an unwoken one is inert paper.
  Woken things attend; dawn power is built, never dealt.

## C · Phases 4–5 — askings, the year, the endings

**[CANON]:** tiers/sizes/rings schedule (kettle 1 → great 7, 3/5/7 rings, combing at 7 summed);
crown floor [3,5,7,10], demand 10, pace-ceiling 6 clears; the doorstep kettle always present +
≥1 carried asking (`accept-by-hand`); filter-1 tier = max(peak-gleam ratchet, weather floor);
filter-2 offers gated by current gleam; glad-palm +1, delayed tellings +1–2 (seen landing);
rings accrue 1 per skipped season per node.

**[OPEN]:** *(C1/C2/C3/C6 CLOSED by D-012, adopted M4-tunable in `ASKING_TUNABLES`; C4/C5 remain — Phase 5.)*
- **C1 · The spilling's size.** How much gleam falls on a flop (unmoved room / stale asking)?
  Canon fixes only that it is outcome-only and EV-negative. *Recommendation: lost = the
  asking's tier size (a stale poem costs 5), floor 1 — big enough to fear, legible, scales
  with ambition. M4-tunable.*
- **C2 · "Unmoved room" trigger.** When exactly does a performance flop? *Recommendation:
  you end a morning with an accepted asking untouched AND a room that was never poured —
  reaching-and-idle, not merely under-filling.*
- **C3 · Staleness window.** "Carried past its season" = the leg it was accepted in?
  *Recommendation: yes — an asking accepted in Long Light spills at Deep Gold's first dawn.*
- **C4 · Map size & offers.** How many nodes per leg, offers per dusk (the FIDELITY map)?
  *Recommendation: 3 offers/dusk from a per-leg pool of ~5–6 nodes; camp always offered
  (the ⅔-RETURN rule needs camping to exist).*
- **C5 · Standing the crown.** *(CLOSED by D-014 — a single demand-10 crown in the Wintering;
  stand it or drift/Quiet-Walk. Adopted, M4-tunable in `RUN_TUNABLES`.)* One Wintering morning of
  delivery ≥ 10? Multi-morning? *Recommendation: the crown is a single named great-asking node in
  the Wintering; you get its 3 mornings; deliver 10 into it before the run ends or take the Quiet Walk.*
- **C6 · Delayed tellings + glad palms in v1.** Model both, or defer tellings (road-graph
  walk) to post-M4? *Recommendation: glad palms in Phase 4 (+1 on doorstep kettles);
  tellings deferred with a FIDELITY marker — they're flavor-critical but sim-marginal.*

## D · Phase 6 — acquisition & the purse

**[CANON]:** Fair draft k=2 of N=5, 1–2 windowed intercepts; glad-price brightening 0.5/trade
< tempo 2 (I-044); idle-lapse −1 step/morning, gone after 3; twice-benched wakes at 0.9× SET,
terminal; red-thread unlock 1/run, ≤2 red-thread-days; handsels never buy proud stock.

**[OPEN]:** *(D1/D4 CLOSED by D-015 — Phase 6 built; the Fair draft k=2/N=5 [CANON] is engine-real. D2/D3 remain deferred.)*
- **D1 · What the glad-load teaches.** *(CLOSED by D-015 — weighted toward the maker's dominant
  gleam-grain. The "answering asking's grain pool" half is deferred (FIDELITY): askings carry no
  grain field yet.)*
- **D2 · The bench.** When/how does courted stock become a piece (off-turn action, cost)?
  *(Still deferred — the courting→bench R6→R5 pipeline is out of Phase 6 scope. The Fair's proud
  tier applies the two-gate spirit directly to the draft instead.)*
- **D3 · Apprentice-stuff inventory.** Whittle consumes one (A1) — how are they acquired
  and held? *(Still deferred. Start-with-2 placeholder stands.) Recommendation: a small stock item,
  bought at the glad-price, start with 2.*
- **D4 · What handsels buy in v1.** *(CLOSED by D-015 — handsels buy the Fair's apprentice-floor
  cards (canon-legal, R2); the proud tier is courted, never bought. Jars/hearth-goods stay out;
  the glad-load also teaches a piece free.)*

## E · M4 — the dials (tuned by simulation, shapes locked)

DIMINISH tail (locked 0.5 — verify under sim anyway) · stall cooling (B2) · spilling size (C1)
· I-022 Untold per-leg counts (live-verify) · I-044 glad-price bound · I-045 last-red/red-thread
rates · glad-load power share ≤ ~54% watch · gleam centrality watch · Gleaner boss-affinity
watch · dominated-pairs = ∅ and crown-stand spread .70–.99 against the axis matrix.

## F · Product decisions

- **F1 · Toy morning form.** *Recommendation: one self-contained HTML page (like the codex)
  driving the compiled engine; the codex card gallery already renders the cards.*
- **F2 · M5 prototype platform.** Web is the default (engine is TS); decide after the toy
  morning teaches us what the UI must carry (the preview-every-number lesson from the
  fun-risk assessment).
- **F3 · M4 orchestration.** Hand-rolled balance loop vs the game-loop skill (token budget
  decision) — decide when Phase 8's harness prints its first balance sheet.

## G · Meta progression & across-run difficulty (decide post-M4 / with M5)

Within-run difficulty is fully locked (the weather floor 1·3·5·7 × S(t), the one-way
peak-gleam lantern ratchet, rings/combing, the calendar-floored crown). Across runs, canon
leaves exactly three crumbs: **"the Wintering persists 1 bead to the meta-layer"** (L6,
bead undefined), **`quiet-walk-runend-meta`** (losing is survivable and hands the verse on),
and the Ways' **starter / second-wave** split (an implied unlock order). Everything else:

- **G1 · What is the bead? [OPEN]** *Recommendation: a keepsake card — at run's end choose
  one piece from your deck; it arrives inert, carrying the old maker's name, in the next
  run's starting pack. The deck-autobiography extends across generations; power-light
  (it must still be woken), meaning-heavy.*
- **G2 · What does the Quiet Walk hand on? [OPEN]** *Recommendation: a bead too, chosen for
  you (the last piece you woke) — failure that still passes the verse on matches the
  world's register ("not death, the world going shy").*
- **G3 · Unlocking the second-wave Ways. [OPEN]** *Recommendation: unlock a Way by
  accidentally playing like it once — Fairwrights: overflow 6+ in one morning; Mannerly:
  land a courtship; Gleaners: soothe a town. "The country teaches you into the maker you
  are being."*
- **G4 · Across-run difficulty. [OPEN]** *Recommendation: "deeper Rounds" — an opt-in
  ladder where every town starts pre-paled (+1/+2/+3 rings per depth). Because
  rings-in = load-out is locked law, one dial raises askings, dawns, harvests, and
  combing pace together — harder AND richer, diegetically ("this Round hasn't seen a
  maker in years"). No bolted-on ascension modifiers.*
- **G5 · The philosophy underneath. [OPEN]** *Recommendation: thin-power meta — no
  permanent stat inheritance (it would let players turtle past "growth is forced by the
  weather"); the meta carries meaning (beads, names, unlocked temperaments, a map of
  brightened Rounds) and opt-in depth (G4), never strength.*
