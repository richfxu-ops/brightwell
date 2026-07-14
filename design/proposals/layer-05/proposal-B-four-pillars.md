# Layer 5 · Archetype Slate — Proposal **B · FOUR PILLARS**

**Proposer:** B-four-pillars
**Commitment:** consolidate the six Walking Ways to **four mechanically-orthogonal STARTER archetypes**, each chosen so its primitive-set and its *win-lever* barely overlap the others; remaining ways become later unlocks / hybrids. Prioritise crisp, non-overlapping playstyles and a clean new-player on-ramp.

**Logline:** *Four ways to walk the same year — build tall and fired, court the shy and proud, run thin and fast, or walk the pale and dare the combing — each answering the rising weather through a different one of the game's four levers.*

Traces bound: DECISIONS D-001 (spine), D-002 (wonder/whimsy), D-005.3 / **I-022** (Untold prove-or-clamp). Composes **from** L3's 14 primitives, L2's resource square (R1–R6), L4's seven acquisition doors, and the LOCKED L1 loop. Every archetype is a `walking-ways-cardpools` card-school selected with no class menu, its identity read off `grain-tagged-standing`.

---

## 0. Why FOUR, and why these four (the count justification)

The game already has **exactly four orthogonal levers a maker can pull against the rising weather** — they are the four things the L2 resource square makes non-substitutable. The clean on-ramp is **one starter identity per lever**:

| Lever (the environmental axis) | L2 resource it commands | Starter pillar | Walking Way(s) it draws flavor from |
|---|---|---|---|
| **Attention-permanence** — a fired engine that compounds every turn | R5 deck + R1 chains → R3 at boss scale | **1 · Tall-Permanence** | the-kilnfast |
| **Courted materials** — high-power stock behind legible conditions | R6 courted-stock, R3 as pure *gate* | **2 · Condition-Control** | the-mannerly |
| **Pack-velocity** — churn, pace, and money-in-motion | R5 churn + R2 handsels | **3 · Tempo-Velocity** | the-untold **+** the-eveners |
| **The board itself** — routing and farming the Paling | R4 the Paling + R1 pale dawns | **4 · Adversity-Spike** | the-morning-gleaners |

**Standing (R3) is deliberately *not* a fifth pillar** — it is the shared gate all four steer by (`grain-tagged-standing`), the dial that gives each pillar its *grain*, not an identity of its own. Four levers, four pillars, no gap and no overlap. A newcomer picking a pillar is picking *which of the four resources they will make their engine out of* — a complete, legible partition.

**The sixth way — the-fairwrights — is held back as a later unlock, not a starter.** Its multiplier-spike identity is (a) the **highest variance in the game** (`fairwright-multiplier-spike`: one enormous public turn, all-or-nothing), and (b) mechanically a **hybrid** — it overlaps Kilnfast's `brim`/overkill *and* the Fair-routing subgame *and* venue-bound `festival-glass`. A brilliant graduate identity, a punishing first one. It unlocks after the four pillars have taught attention, overkill, courting, and routing separately. **the-eveners** is folded in as the money-velocity *sub-flavor* of Pillar 3 (it shares `retire`/`whittle`/`draw` with the Untold) and is also offered later as a pure-conversion hybrid. So all six ways have a home: **four starter pillars (five ways), one graduate unlock (Fairwrights), one folded sub-flavor (Eveners).**

---

## 1. THE ARCHETYPE SLATE

Each entry: **identity · L3 primitives · L2 resources · L4 acquisition · risk posture · signature payoff chain (≥3 interacting cards, spelled as data-combos).** Cards below are declarative data over the 14 primitives (L3 §0); marks are **fixed** (LOCKED L1); every load-bearing number on the payoff card is a `read` of state an earlier card wrote — the definition of a combo, not a stat-pile.

---

### PILLAR 1 · **THE KILNFAST** — *tall-permanence*

**One-line identity:** the smallest, densest deck in the game — a handful of fired pieces that never unfire, compounding a little every morning into one low-variance, boss-crushing engine. *Build it once; it burns all year.*

- **Signature L3 primitives:** `keep` (self-persistence), `steady{brace}` (hold the chain through a patient pause), `gather(read woken:<suit>)` (the cross-turn compounder), `rest` (long single-suit chains), `brim` (boss-scale overkill), `warm` (baseline delight on fired staples). *Its unique verbs: `keep` + `steady{brace}` — nobody else plays for persistence.*
- **L2 resources:** **R5 fired deck** (its identity — `fired-vs-held`, the fired never unfires) + **R1 attention held in long unbroken chains** → converts to **R3 Standing** only at boss scale via `brim`. Touches R6 lightly (benches proud staples), ignores the board.
- **L4 acquisition:** **P5 the bench** (proud/`twice-benched` stock → few high-mark permanent pieces) is its spine; **P1 gate-taught** pieces grained by its play; **P6 first-gift** way-affinity. It *acquires little and thins little* — a deliberately tiny pack.
- **Risk posture:** **lowest variance in the game.** Slow, deterministic, weak early tempo (spring output ≈ kettle only); its danger is being **out-tempoed** by the year before its engine matures, not blowing up. Strongest boss/crown scaling (`combing-boss-tier`, `closed-round-relics` affinity).

**Signature payoff chain (4 interacting cards):**
```jsonc
// A · HEARTH-STONE FOOTING (joinery) — the accumulator, fires early & permanent
{ "mark": 2, "ceiling": 4, "woken_delight": 1,
  "effects": [
    { "when":"on-play", "do":"gather", "params":{ "amount":{ "do":"read","source":"woken:joinery" } } }, // +room per joinery already fired (cross-turn, soft-capped)
    { "when":"on-play", "do":"keep" } ] }                                                                  // resists the Paling; stays lit all run
// B · BANKED-KILN (glaze) — the chain-brace, lets the patient turn not cool
{ "mark": 3, "ceiling": 5, "woken_delight": 1,
  "effects": [
    { "when":"on-chain", "do":"steady", "params":{ "brace":true, "links":1 } },   // a needed pause won't sag the pool
    { "when":"on-wake",  "do":"warm",   "params":{ "n":1 } } ] }                    // baseline delight, fired forever
// C · THE LONG FIRING (song, capstone) — the boss dump
{ "mark": 7, "ceiling": 8, "woken_delight": 3, "tags":["capstone"],
  "effects": [
    { "when":"on-play",     "do":"rest", "params":{ "target":"self","amount":{ "do":"read","source":"room" } } }, // clears fixed mark 7 on the room A grew
    { "when":"on-wake",     "do":"fill", "params":{ "amount":{ "do":"read","source":"grain:joinery" } } },        // fill scaled by the fired-joinery count
    { "when":"on-overkill", "do":"brim", "params":{ "band":{ "do":"read","source":"room" } } } ] }                // FIREWALL-LEGAL: band reads the ROOM, boss-scale gleam
```
**How it fires:** across many mornings A's fired joinery-things accumulate as seated audience; each new morning `read(woken:joinery)` is larger, so A's `gather` compounds the room (soft-capped, `the-gathered-room`). B braces the chain so a Kilnfast can spend a slow turn setting up without the pool cooling. At the crown, C rests the whole accumulated room onto its fixed mark-7, fills by the joinery-count A grew, and `brim`s a **boss-scale** overkill to Standing — the band read off the *room*, never the board (gleam-firewall). **Every number on C was written by A and B over prior turns.** Break the run's chain-tending and C under-fills — *the reach that falls short, the spilling* (L1 §4). **synergy_depth = 4.**

---

### PILLAR 2 · **THE MANNERLY** — *condition-control*

**One-line identity:** a greedy value deck of high-power shy-material pieces, each dead in the hand until its courtship lands — Standing is a *pure gate* that widens the proud market and is never spent, so costs arrive only as outcomes. *Set the table so the proud stuff will deal with you; then it pays enormously.*

- **Signature L3 primitives:** `court` (the marquee — *nobody else courts as an engine*), `read(grain:<suit>)`, `mark-grain` (stamp a piece to satisfy a term/grain), `draw{suit}` (search for the courted payoff piece), `fill(read grain)`. *Its unique verb: `court` — the condition-satisfaction engine.*
- **L2 resources:** **R6 courted-stock** is its identity (`two-gate-courting`, `graded-material-market`); **R3 Standing as a pure gate** (`mannerly-condition-puzzle`: widens market width, never depleted by use). Attention (R1) is spent only to *perform the terms*.
- **L4 acquisition:** **M1 the town courting-market** (gleam-gated width) + **M2 glad-load introduction-jars** + **M6 Mannerly-lent jars**; benches courted stock into prouder pieces (**P5**). Its deck *is* its material book.
- **Risk posture:** **greedy, condition-gated variance.** A dim hand or an unmet term leaves high-mark cards inert (a hand of dead value); when the courtship lands, the payoff is the **highest single-hit ceiling** of the four. Standing never at spend-risk — its risk is *tempo lost to a whiffed setup*.

**Signature payoff chain (3 interacting cards):**
```jsonc
// A · HOLD THE ROOM LAUGHING (dance) — satisfies the term + stamps grain
{ "mark": 2, "ceiling": 4, "woken_delight": 1,
  "effects": [
    { "when":"on-play", "do":"gather" },                                                    // lift the room
    { "when":"on-play", "do":"mark-grain", "params":{ "target":"hand:cheapest","suit":"song" } }, // stamp a piece song (feeds C's fill + the term)
    { "when":"on-chain","do":"steady",     "params":{ "links":1 } } ] }                     // keep the chain unbroken (a courting term)
// B · VOUCH AND ASK (song) — courts the proud stock, searches for the payoff
{ "mark": 3, "ceiling": 5, "woken_delight": 2,
  "effects": [
    { "when":"on-play", "do":"court", "params":{ "stock":"laughing-riverwood","term":"room-laughing" } }, // gleam GATES, never spent; term is the play
    { "when":"on-wake", "do":"draw",  "params":{ "n":1, "suit":"riverwood" } } ] }          // dig for the courted piece C
// C · RIVERWOOD REFRAIN (song, courted-stock piece) — the spectacular payoff
{ "mark": 6, "ceiling": 8, "woken_delight": 4, "tags":["proud"],
  "effects": [
    { "when":"on-play", "do":"rest", "params":{ "target":"self","amount":{ "do":"read","source":"room" } } }, // needs A's room to clear mark 6 (dead otherwise)
    { "when":"on-wake", "do":"fill", "params":{ "amount":{ "do":"read","source":"grain:song" } } } ] }        // fill scaled by the song A stamped
```
**How it fires:** A lifts the room, keeps the chain unbroken, and stamps a hand piece **song** (both satisfying B's term and feeding C's fill). B `court`s `laughing-riverwood` behind its *room-laughing* term (gleam only *gates* the vouching — "a key that turns, never a coin that leaves") and `draw`-searches for the courted payoff C. C — a high-mark proud piece, **dead without A's room** — clears mark 6 on the room A built and `fill`s scaled by the song-grain A stamped. **Skip A and the term whiffs, C is an uncastable brick — greedy value, spectacular when it lands.** Standing was read as a gate at every step, never spent. **synergy_depth = 3.**

---

### PILLAR 3 · **THE UNTOLD** *(with the Eveners' velocity)* — *tempo-velocity*

**One-line identity:** a thin, fast deck of cheap fine-grained one-shots that exhaust and never repeat — clear many small askings quickly, retire the spent for fuel and money, and let **contract COUNT and PACE** be the rising pressure in place of tonnage. *Nothing sits still; the pack is always moving.*

- **Signature L3 primitives:** `draw` (refill the thin deck), `retire` (perform one-shots to destruction / last-light for fuel — the Evener line), `whittle` (spent bench-return → bright handsels), `steady{links}` (pace: count plays as extra chain-links). *Its unique combination: `retire`+`draw` churn as the engine, `steady{links}` for pace.*
- **L2 resources:** **R5 deck-churn** (exhaust-heavy, self-thinning) + **R2 handsels kept bright by circulation** (`handsel-currency-decay`, `evener-sacrifice-velocity`: money brightens by *moving*). Uses attention as a floor, not a hoard.
- **L4 acquisition:** **H5 doorstep askings** (many small, `doorstep-micro-contracts`) + **P2 Fair draft** (breadth of cheap one-shots) + **M5 apprentice floor** (fast, cheap stock); thins constantly via **§3 `retire`** and waymeet gifting.
- **Risk posture:** **tempo-fragile.** Best early-game engine (spring: clears kettle askings faster than anyone); its danger is a **stall** — a turn without `draw` breaks the pace and lets the region's spiral accumulate (§I-022). Medium variance; pays the crown *in installments* (below), so its single-big-turn ceiling is the softest of the four.

**Signature payoff chain (4 interacting cards):**
```jsonc
// A · PAPER-BIRD NOTE (song, one-shot, exhausts) — cheap pace
{ "mark": 1, "ceiling": 2, "woken_delight": 1, "tags":["one-shot"],
  "effects": [
    { "when":"on-play", "do":"steady", "params":{ "links":2 } },   // counts double toward the chain (PACE)
    { "when":"on-play", "do":"fill",   "params":{ "amount":1 } } ] } // a small bite of the need
// B · QUICKSTEP (dance) — the churn, keeps the thin deck flowing
{ "mark": 2, "ceiling": 4, "woken_delight": 1,
  "effects": [
    { "when":"on-play", "do":"draw",   "params":{ "n":2 } },        // refill so pace never stalls
    { "when":"on-chain","do":"steady", "params":{ "links":1 } } ] }
// C · LAST-LIGHT THE SPENT (glaze, the Evener graft) — convert exhaust to fuel + money
{ "mark": 2, "ceiling": 4, "woken_delight": 1,
  "effects": [
    { "when":"on-play", "do":"retire",  "params":{ "target":"inert:hand","to":"table" } },              // spent one-shot -> this node's table -> richer dawn
    { "when":"on-play", "do":"whittle", "params":{ "amount":{ "do":"read","source":"season" } } } ] }   // FIREWALL-LEGAL: paleness -> HANDSELS, not gleam
// D · TALLY THE MORNING (song, capstone-by-accumulation) — pace becomes size
{ "mark": 4, "ceiling": 6, "woken_delight": 2, "tags":["capstone"],
  "effects": [
    { "when":"on-play", "do":"rest", "params":{ "target":"self","amount":{ "do":"read","source":"chain" } } }, // clears mark on the CHAIN A+B built
    { "when":"on-wake", "do":"fill", "params":{ "amount":{ "do":"read","source":"chain" } } } ] }              // one big installment, sized by pace
```
**How it fires:** A's one-shots pump `steady{links}` (pace) and take small `fill` bites; B `draw`s to keep the thin deck flowing so the chain never stalls; C `retire`s the spent one-shots to the node's table (richer dawn) and `whittle`s paleness into bright handsels (the Evener money-velocity). At a crown or a stacked town, D converts the *pace itself* into *size*: it clears its mark and fills **read off the chain** A+B built — **many small plays become one large installment.** Stall the `draw` and the chain collapses, D under-fills, and the region's unanswered askings age into the spiral — *the tempo-not-tonnage pressure the spine demands* (I-022, §3 below). **synergy_depth = 4.**

---

### PILLAR 4 · **THE MORNING-GLEANERS** — *adversity-spike*

**One-line identity:** a route-risk specialist whose engine scales with node **paleness** — richest dawns over faded country, spent re-colorings as fuel, ripened compounded askings as harvest — that steers the map *toward* the combing on purpose and cashes the largest glad-load in the game. *Walk the quiet; the paler it is, the more it pays.*

- **Signature L3 primitives:** `whittle(read season)` (paleness → money), `retire{to:table}` (fuel the pale dawn), `soothe` (the **only** board-writer — slows a mended node's paling), `fill(read spiral)` (rings-in = load-out, firewall-legal), `read(season|spiral)`. *Its unique verb: `soothe` — nobody else writes the board.*
- **L2 resources:** **R4 the Paling routed as fuel** (its identity — `paling-clock`, `gleaner-adversity-economy`) + **R1 pale-node dawns** (paler node = richer dawn, `dawn-income`). The board is its resource; the others merely spend it.
- **L4 acquisition:** **M4 the gleaning** (`last-red`, `twice-benched` from Evener wagons — highest-risk salvage tier) + **P1 glad-load** scaled off the fat spirals it lets ripen; **P2 Fair** for boss-affine pieces.
- **Risk posture:** **highest route risk, highest reward.** It deliberately lets a region ripen toward seven rings (`combing-boss-tier`), betting it can answer the great asking it midwifed. A misjudged route strands it in un-standable country; a made one pays the biggest `glad-load` and crown in the game. Highest variance of the four.

**Signature payoff chain (3 interacting cards):**
```jsonc
// A · WALK THE PALE (glaze) — paleness pays money + seeds the room
{ "mark": 3, "ceiling": 5, "woken_delight": 2,
  "effects": [
    { "when":"on-play", "do":"whittle", "params":{ "amount":{ "do":"read","source":"season" } } }, // pale ground -> more handsels
    { "when":"on-play", "do":"gather",  "params":{ "amount":{ "do":"read","source":"season" } } } ] } // richer pale dawn -> bigger room
// B · GLEAN AND MEND (glaze) — thin the dead, mend the ground (the board-writer)
{ "mark": 3, "ceiling": 5, "woken_delight": 2,
  "effects": [
    { "when":"on-wake",  "do":"retire", "params":{ "target":"inert:hand","to":"table" } }, // dead card -> this node's dawn
    { "when":"on-fulfil","do":"soothe", "params":{ "amount":1 } } ] }                        // last-red catalyst slows THIS node's future paling
// C · THE COMBING-CALLER (song, boss-affine capstone) — cash the ripened rings
{ "mark": 6, "ceiling": 8, "woken_delight": 3, "tags":["capstone"],
  "effects": [
    { "when":"on-play", "do":"rest", "params":{ "target":"self","amount":{ "do":"read","source":"room" } } }, // clears mark on A's pale-fed room
    { "when":"on-wake", "do":"fill", "params":{ "amount":{ "do":"read","source":"spiral" } } } ] }             // FIREWALL-LEGAL: fill (NOT gleam) scales with the rings you let ripen
```
**How it fires:** the Gleaner routes *into* pale, high-ring country. A turns paleness into both money (`whittle read season`) and a big room (`gather read season` — the rich pale dawn). B thins a dead card into the node's table (fueling tomorrow's already-rich dawn) and, on fulfilment, `soothe`s the mended node to slow its re-paling — the one board-write, and it never touches the gleam meter (Paling↔Standing firewall). C cashes it: it clears its mark on A's pale-fed room and `fill`s **scaled by the spiral rings** the Gleaner deliberately let accumulate — *rings-in = load-out*, the largest glad-load in the game. **Steer wrong and the country is un-standable; steer right and you answer the great asking you midwifed.** **synergy_depth = 3.**

---

## 2. THE DISTINCTNESS ARGUMENT (not palette-swaps)

Four checks. Each pillar is distinct on **(a) its unique signature primitive, (b) its primary resource, (c) its win-lever, and (d) its risk axis** — no two share more than incidental overlap, and where a verb is shared the *parameterisation and sink differ*.

| | **Signature primitive (unique)** | **Primary resource** | **Win-lever (how it stands the crown)** | **Risk axis (where it dies)** |
|---|---|---|---|---|
| **Kilnfast** | `keep` + `steady{brace}` | R5 fired permanence + R1 chains | boss-scale `brim` from a compounding permanent engine | out-tempoed before the engine matures |
| **Mannerly** | `court` | R6 courted-stock, R3 as *gate* | a courted high-power piece filling enormously once its term lands | dead hand / whiffed term (tempo, not Standing) |
| **Untold** | `retire`+`draw` churn, `steady{links}` | R5 churn + R2 handsels | pace → size: many one-shots into one chain-read fill | a stall breaks pace; spirals accumulate |
| **Gleaners** | `soothe` (board-writer) | R4 the Paling + R1 pale dawns | cashing self-ripened spiral rings (`fill(read spiral)`) | route risk — stranded in un-standable country |

**Orthogonality of primitive-sets.** The two apparent overlaps are load-bearingly *different levers*, not shared engines:
- **`whittle`** — Untold whittles a *flat* amount for money-velocity (keep the purse moving); Gleaners whittles `read(season)` for *adversity-scaling* (paleness → money). Same verb, opposite design intent (tempo vs terrain).
- **`retire`** — Untold retires *one-shots* for **pace/thinning**; Gleaners retires *inert cards to the node table* for **pale-dawn fuel**. Same verb, different sink (pack-velocity vs board-fuel).
- **`steady`** — Kilnfast uses `{brace}` (persistence, hold a *slow* turn); Untold uses `{links}` (pace, count a *fast* turn double). Orthogonal params — the *opposite* temporal posture.

**Orthogonality of the win-condition.** This is the decisive test (the brief's "distinct win-conditions/levers, not palette-swaps"): the four stand the same crown through **four different resources** — R5-permanence (Kilnfast), R6-materials (Mannerly), R5-churn/R2-money (Untold), R4-board (Gleaners). You cannot re-skin one as another without swapping which L2 resource *is the engine*. That is a structural distinction, not a flavor coat.

**Intuitiveness (predictable from Walking-Way name + world logic, gate ≥ 0.8).** *Kilnfast* = fired-in-the-kiln, permanent, patient → tall-permanence. *Mannerly* = manners/courtship, mind your conditions → condition-control. *Untold* = the uncounted many, count-and-pace → tempo-velocity. *Morning-Gleaners* = glean the pale left-behind fields → adversity-spike. Each identity is legible from the name before a card is read. **Estimated intuitiveness ≈ 0.9.**

---

## 3. I-022 — THE UNTOLD'S TEMPO ESCALATION *matches* THE SPINE'S SIZE-ESCALATION (**PROVE**, with a clamp backstop)

**The obligation (D-005.3 / I-022):** prove numerically that the Untold's count-and-pace pressure rides the same escalation curve as the spine's size-escalation, *or* clamp it there. **Resolution: PROVE (primary) + a crown-clamp backstop.**

**Setup — the one curve.** The escalation clock is the seasonal seep multiplier `s(t)` (L1 §5, `escalation-is-the-weather`), calibrated to the canon need-sizes (kettle 3 → poem 5 → great 7 → crown ~9):

| Season | `s(t)` = need/3 | canon anchor |
|---|---|---|
| Green Going (spring) | **1.0** | kettle need ≈ 3 |
| Long Light (summer) | **1.67** | ≈ 5 |
| Deep Gold (late summer) | **2.33** | poem ≈ 7 |
| Red Walk (autumn) / crown | **3.0** | great/crown ≈ 9 |

**The size spine (Kilnfast / Mannerly / Gleaner).** Per-asking demand rises with the weather: `D_size(t) = 3·s(t)`. They answer few, big: clear-rate ≈ 1 asking / 2 mornings (constant). **Seasonal throughput** (delight the year extracts per 10 worked mornings) = `5 asks × 3·s(t)` = **`15·s(t)`**.

**The Untold (tempo, tonnage-clamped).** Per-asking demand is held near the floor — cheap fine-grained one-shots, `D_untold ≈ 3` (constant; this *is* "tempo not tonnage"). But it must **clear faster as the year exhales**, because the forcing function is the spiral-clock: unanswered askings chalk 1 ring/season and *"age into the spiral together"* (L1 §3, `accept-by-hand`), and the seep raises their **arrival/aging rate ∝ s(t)**. To hold a region below the combing threshold (7 rings), the Untold's required clear-count per 10 mornings = `5·s(t)`. **Seasonal throughput** = `5·s(t) asks × 3` = **`15·s(t)`.**

> **The two curves are identical: `15·s(t)`.** The size spine delivers it as *fewer-bigger*; the Untold as *more-smaller-faster*. The Untold trades tonnage-per-asking for **asks-per-season**, and the product — total seasonal throughput the weather demands — rides the **same seep curve `s(t)`**. Tempo escalation ≡ size escalation. ∎

**Why it's *forced*, not merely possible (the clamp side).** If the Untold refuses to raise its pace and clears at a flat `5 / 10 mornings` while arrivals scale as `5·s(t)`, the un-cleared surplus accumulates at `5·(s(t)−1)` rings per 10 mornings. By Deep Gold (`s=2.33`) that is **~6.7 rings → crosses the combing threshold of 7** → a **great asking (size ≈ 7) forms** (`combing-boss-tier`). *Failing to pay in pace materialises the pressure as size.* The Untold cannot opt out of the curve — it pays `15·s(t)` in tempo or eats it in tonnage at the combing. Either way pressure ∝ `s(t)`, keyed to the identical seep clock.

**The crown-clamp backstop (belt-and-suspenders).** The calendar-floored crown (`the-rising-crown`) is a single boss-tier need of size ≈ `3·s(autumn) = 9`. A tonnage-light deck stands it by **converting pace into size within the boss turn**: the Untold's chain-links (`steady{links}`) let many one-shots stack into one need's-fill read off the chain (Pillar 3, Card D: `fill(read chain)`). So the Untold is **clamped to produce crown-size output at the crown** — it pays the 9-need in rapid installments and cannot trivialise the finale with kettle cards. If the throughput-equivalence proof above is ever doubted, this clamp alone bars the Untold from evading size at the one moment size is mandatory.

**Verdict:** the Untold's tempo escalation **matches** the spine's size-escalation curve exactly (`15·s(t)`), is **forced** to it by the spiral-clock, and is **clamped** to size at the crown. I-022 discharged (numeric); exact coefficients (arrival rate, `steady{links}` cap, one-shot fill sizes) hand off to game-loop for tuning, as D-005.3 anticipates.

---

## 4. THE NAPKIN VIABILITY MODEL (napkin_flags claimed: 0)

An executable back-of-envelope over the four pillars: **each viable (stands the crown), none dominates, each has a real ≥3-card chain, Untold matched (§3).**

**Autumn crown requirement:** one boss performance of `≈ 3·s(autumn) = 9` delight (+ red-thread modifiers). Each pillar's *peak autumn output* on its own curve:

| Pillar | Autumn peak output (napkin) | Curve shape | Best on axis… | Worst on axis… |
|---|---|---|---|---|
| **Kilnfast** | ~5 fired joinery × ~2 room (soft-capped) → room ≈ 10 → C clears mark 7, fills ≈ **9–10** | flat/deterministic, climbs all run | **consistency** (lowest variance) | **early tempo** + smallest ceiling |
| **Mannerly** | courted riverwood/silver lands → fill ≈ **11–12**; whiffed term → ≈ **2** (dead) | spiky-conditional | **ceiling** (highest single hit) | **reliability** (dead-hand variance) |
| **Untold** | ~4 one-shots × ~2.5 chain-read fill, braced → ≈ **10** in the boss turn (installments) | many small, front-loaded | **early tempo** (best spring) | **single-turn ceiling** (draw-fragile) |
| **Gleaners** | self-ripened 7-ring combing → `fill(read spiral)` ≈ **12–13** + biggest glad-load | boom-or-bust, back-loaded | **reward** (biggest payoff) | **survival** (highest route risk) |

**(a) Viability.** All four reach **≈ 9–13** crown output by autumn on distinct curves → **all can stand the crown** → all viable. None falls below the `9` floor when played to its identity.

**(b) No dominance (no strictly-best).** Each pillar is **best on exactly one axis and worst on another** — Kilnfast wins consistency / loses ceiling & early tempo; Mannerly wins ceiling / loses reliability; Untold wins early tempo / loses single-turn ceiling; Gleaner wins reward / loses survival. The comparison is against **the environment (the year), not against each other** (single-player) — there is no head-to-head, and no pillar's (consistency, ceiling, tempo, reward, survival) vector dominates another's. A player who wants a safe first run picks Kilnfast; a gambler picks Gleaner; each is *the* right answer to a different temperament and route, none is the right answer to all.

**(c) Real ≥3-card chains.** Kilnfast = 4, Mannerly = 3, Untold = 4, Gleaner = 3 — every payoff card's load-bearing numbers are `read`s of state earlier cards wrote (per L3 §4), so a broken order under-fills. Combos, not stat-piles.

**(d) Untold matched.** §3: `15·s(t) ≡ 15·s(t)`, forced by the spiral-clock, clamped at the crown.

**Anti-degenerate inheritance (from L2 §5 / L3 §2 / L4 §5 — no new holes opened):** each pillar's engine rides the **already-closed** loops — Kilnfast bounded by the soft-capped room + diminishing `brim`; Mannerly by freshness-reversion (untended courted stock reverts) + the fixed mark (dead cards need the room, no shortcut); Untold by node-local `retire` RETURN (no caravanning) + terminal `twice-benched` + closed Handsel Round; Gleaner by the gleaning's anti-salvage law (never on inhabited/answered nodes) + capped `soothe` (1 node/1 knack/1 season) + the gleam-firewall (`read(spiral)` feeds `fill`, **never** Standing). **No pillar introduces a fresh degenerate loop.** `napkin_flags` claimed: **0**.

---

## 5. MIN SYNERGY DEPTH (gate: ≥ 3)

| Pillar | Chain length (interacting cards) |
|---|---|
| Kilnfast | 4 (A→B→C, A accumulates cross-turn) |
| Mannerly | 3 (A→B→C, term + grain + payoff) |
| Untold | 4 (A→B→C→D, pace→churn→convert→size) |
| Gleaners | 3 (A→B→C, paleness→mend→cash-rings) |

**Minimum synergy_depth across archetypes = 3.** Gate `synergy_depth ≥ 3` **met** (with two pillars at 4).

---

## 6. Later unlocks & hybrids (the other ways have homes)

- **the-fairwrights — graduate unlock (multiplier-spike).** Highest-variance identity; a hybrid of Fair-routing (`fair-hub-intercept`) + Kilnfast-style overkill (`brim`) + venue-bound `festival-glass`. Unlocks *after* the four pillars teach attention, overkill, courting, and routing separately — a superb second archetype, a punishing first. (`fairwright-multiplier-spike`.)
- **the-eveners — folded as Pillar 3's money-velocity sub-flavor** (shares `retire`/`whittle`/`draw`), and offered later as a **pure-conversion hybrid** (Evener × Gleaner: retire-everything + pale-route income).
- **Multi-way decks remain legal** (`walking-ways-cardpools`): grain bonuses reward focus, but a maker can walk two ways and hybridise — the pillars are on-ramps and identities, not locked classes. Kilnfast×Mannerly (permanent proud engine), Untold×Gleaner (fast pale-clearing), etc., are all reachable once the four are learned.

---

## 7. Gate self-check

- **synergy_depth ≥ 3:** min = **3** (two pillars at 4). ✔
- **napkin_flags ≤ 0:** claimed **0** — all four viable (stand the ≈9 crown), none strictly-best (best-on-one-axis / worst-on-another), each a real ≥3 combo chain, Untold matched `15·s(t)` + clamped at the crown; no fresh degenerate loop (§4). ✔
- **intuitiveness ≥ 0.8:** ≈ **0.9** — each identity predictable from its Walking-Way name + world logic (§2). ✔
- **Traceability:** every pillar → a Walking Way (`walking-ways-cardpools`) + L3 primitives + L2 resources + L4 doors; distinct win-lever per pillar; composes from — never contradicts — LOCKED L1–L4. ✔
- **D-002 / D-003:** verbs are the world's own craft-physics (build tall & fired, court the shy, run thin, walk the pale); no debt/court/paperwork; wonder intact. ✔
