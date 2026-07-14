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
- **B1 · The SET/RETURN split.** L1: a play "splits with nothing lost" — SET works the piece,
  RETURN seeps to this node's table. Never quantified. What exactly is RETURN: (a) room left
  unspent at dusk, (b) a fixed share of every spend, (c) attention on pieces that stayed cold?
  *Recommendation: (a) + (c) — dusk sweeps unspent room and cold pieces' set to the local
  table; a rest that wakes keeps its attention in the piece. Simple, conserving, matches
  "unplayed pieces RETURN".*
- **B2 · Stall and brace.** What breaks a chain (a morning pause? playing a no-combo card?),
  and how much does an unbraced stall cool the room? *Recommendation: a stall = any morning
  action that isn't a play (or an explicit pass); cooling = room ×0.5 rounded down; brace
  negates exactly one stall. Numbers M4-tunable.*
- **B3 · Trigger cascade order.** When a wake fires several listeners (`on-wake` on other
  cards), what order? *Recommendation: played-order (the chain's own order), depth-first,
  with a per-morning fire-once rule per effect instance to prevent loops.*
- **B4 · "Unplayed pieces RETURN" reading.** Do unplayed hand cards go back to the pack
  (pieces conserved) while only *attention* seeps? *Recommendation: yes — pieces to pack,
  cold set to the table; nothing to a void.*
- **B5 · on-dawn eligibility.** Do on-dawn effects (the utility draws) fire from hand only,
  or also from pack/fired? *Recommendation: fired pieces only — a woken Dovetail Draw works
  every dawn; an unwoken one is inert paper. Matches "wakes fire permanently into your deck".*

## C · Phases 4–5 — askings, the year, the endings

**[CANON]:** tiers/sizes/rings schedule (kettle 1 → great 7, 3/5/7 rings, combing at 7 summed);
crown floor [3,5,7,10], demand 10, pace-ceiling 6 clears; the doorstep kettle always present +
≥1 carried asking (`accept-by-hand`); filter-1 tier = max(peak-gleam ratchet, weather floor);
filter-2 offers gated by current gleam; glad-palm +1, delayed tellings +1–2 (seen landing);
rings accrue 1 per skipped season per node.

**[OPEN]:**
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
- **C5 · Standing the crown.** One Wintering morning of delivery ≥ 10? Multi-morning?
  *Recommendation: the crown is a single named great-asking node in the Wintering; you get
  its 3 mornings; deliver 10 into it before the run ends or take the Quiet Walk.*
- **C6 · Delayed tellings + glad palms in v1.** Model both, or defer tellings (road-graph
  walk) to post-M4? *Recommendation: glad palms in Phase 4 (+1 on doorstep kettles);
  tellings deferred with a FIDELITY marker — they're flavor-critical but sim-marginal.*

## D · Phase 6 — acquisition & the purse

**[CANON]:** Fair draft k=2 of N=5, 1–2 windowed intercepts; glad-price brightening 0.5/trade
< tempo 2 (I-044); idle-lapse −1 step/morning, gone after 3; twice-benched wakes at 0.9× SET,
terminal; red-thread unlock 1/run, ≤2 red-thread-days; handsels never buy proud stock.

**[OPEN]:**
- **D1 · What the glad-load teaches.** Which taught piece arrives (from whose pool, biased
  how by the town's grain)? *Recommendation: drawn from the answering asking's grain pool,
  weighted toward the player's dominant gleam-grain — the country teaches you into your Way.*
- **D2 · The bench.** When/how does courted stock become a piece (off-turn action, cost)?
- **D3 · Apprentice-stuff inventory.** Whittle consumes one (A1) — how are they acquired
  and held? *Recommendation: a small stock item, bought at the glad-price, start with 2.*
- **D4 · What handsels buy in v1.** Jars + taught pieces + apprentice-stuffs + hearth-goods
  per canon — which subset does the engine model before M4? *Recommendation: jars +
  apprentice-stuffs only; taught pieces stay glad-load-only until the Fair exists.*

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
