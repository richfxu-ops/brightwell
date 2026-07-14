# Layer 5 — Archetypes · Proposal **A-six-ways-direct**

**Proposer:** A-six-ways-direct · **Commit:** SIX-WAYS-DIRECT — keep all six Walking Ways as six
archetypes; give each a distinct dominant L3 primitive + L2 resource + L4 door and a ≥3-card
signature chain, so identity fidelity to the world is maximal and no archetype is a palette-swap.

**Logline:** *Six ways to stand the year — one holds the room, one courts the stuff, one walks
the grey, one keeps the evening, one outruns the tale, one raises the crowd — and each grows a
different engine to stand the same crown.*

**Gate posture claimed:** `synergy_depth` **min = 3** (§4; every chain 3–5 interacting cards) ·
`napkin_flags = 0` (§3, executable model `napkin.py`: all six viable, none dominant, Untold I-022
proven-and-clamped) · `intuitiveness ≥ 0.8` (§2.7; each identity predictable from Walking-Way name
+ world logic).

---

## 0. Why six, not a consolidated 3–4 (the count justification)

The task allows consolidating to a tighter 3–4 starter set. **This proposal keeps all six**, and the
justification is mechanical, not sentimental: **the 14-primitive vocabulary (L3) supports exactly
six non-overlapping dominant levers, and the six Walking Ways already sit one-to-one on them.**
Consolidation would either (a) collapse two distinct dominant primitives into one archetype —
palette-swapping the loser — or (b) demote a Way whose lever is genuinely singular. Two collisions
canon *forbids* us to merge:

- **Evener vs Untold both "exhaust" — but canon splits them explicitly.** WORLD.md:429: the Evener is
  exhaust-heavy *"always for conversion, never for pace (the tempo exhausts belong to the Untold)."*
  The Evener's `retire` writes **local-table income** (R2/R1 velocity); the Untold's exhaust writes
  **tempo** (contract count). Same verb-family, opposite target surface. Merging them erases the one
  distinction the world drew a line under.
- **Gleaner vs Evener both walk the out-breath — but on opposite dominant resources.** The Gleaner's
  engine is `read(season/spiral)` scaling *inputs* on pale ground (R4→R1); the Evener's is `retire`
  converting *dead pieces* to table income (R5→R1). One reads the weather, one composts the deck.

The napkin (§3) confirms the harder claim: **six archetypes fit inside a 7-point total-power band
with zero strict-domination pairs, and each is uniquely best on its own axis.** Six is not bloat —
it is the exact number of orthogonal engines the vocabulary affords. (A tiered *unlock* order is
still fine for onboarding — Kilnfast/Untold/Fairwrights read fastest as starters, Mannerly/Gleaner/
Evener as second-tier identities — but all six are shipped, not deferred.)

---

## 1. The archetype slate

Each archetype below is a **grain-tagged build the country teaches you into** (`grain-tagged-standing`,
`walking-ways-cardpools`) — **no class menu**. "Dominant primitive / resource / door" names the lever
it *leans on*; every archetype can still touch the whole vocabulary. Grain suits per the L3 set
(song, joinery, glaze, thread, dough, dance). Card data is written as L3-legal effect lists
(`{when, do, params}`); `mark`/`ceiling` are **fixed** (locked L1); `read` renders diegetically as
*per/by*.

---

### A1 · The Kilnfast — *inevitability*

**Identity:** the smallest, densest deck; hold one unbroken room and fire pieces that seat as
permanent audience, so every turn the room the last turn built comes back bigger — no spike, just a
curve that out-scales the boss.

- **Dominant L3 primitive:** **`steady`** (chain links + brace) + cross-turn **`read(woken:<suit>)`**
  feeding `gather`. Secondary: `rest` onto high-fixed-mark pieces.
- **L2 resources:** **R1 attention held in long within-turn chains** (canon: *"what they hold long is
  the room"*, WORLD.md:406) + **R5 fired pieces** as the persistent audience store. Barely touches R2.
- **L4 doors:** **P5 the bench** (proud stock → high-mark fired pieces) + **P1 glad-load**; buys almost
  nothing at the **Fair (P2)**. Deck stays ~9–12 pieces (below the ~18–22 average, per L4 §3).
- **Risk posture:** **low-variance, weak openings, strongest boss scaling** (WORLD.md:408). The curve
  is behind the weather in spring and ahead of it by the crown.
- **Win-approach:** *raw-burst at boss scale* — the compounded seated room clears the crown's
  fixed mark in one held session (napkin route `raw-burst`, eff 10.6).

**Signature chain (depth 4) — the compounding hearth:**

```jsonc
// C1 — Setterby Trestle (joinery): room grows with every joinery already fired (CROSS-TURN)
{ "id":"setterby-trestle","grain":"joinery","mark":2,"ceiling":4,"woken_delight":1,
  "effects":[
    {"when":"on-play","do":"gather","params":{"amount":{"do":"read","source":"woken:joinery"}}},
    {"when":"on-chain","do":"steady","params":{"links":1,"brace":true}} ]}      // hold the room across a pause

// C2 — Calipers at the Bench (joinery): pre-rest the capstone toward its FIXED mark by the held room
{ "id":"calipers","grain":"joinery","mark":3,"ceiling":5,"woken_delight":2,
  "effects":[
    {"when":"on-play","do":"rest","params":{"target":"held:capstone",
        "amount":{"do":"read","source":"room"}}},
    {"when":"on-wake","do":"mark-grain","params":{"target":"held:capstone","suit":"joinery"}} ]}

// C3 — The Fired Beam (joinery capstone, high mark): clear it, seat it, pay by joinery-count
{ "id":"fired-beam","grain":"joinery","mark":7,"ceiling":8,"woken_delight":3,"tags":["capstone"],
  "effects":[
    {"when":"on-play","do":"rest","params":{"target":"self","amount":{"do":"read","source":"room"}}},
    {"when":"on-wake","do":"fill","params":{"amount":{"do":"read","source":"grain:joinery"}}},
    {"when":"on-chain","do":"steady","params":{"brace":true}} ]}                 // no stall cools it
```

**How it fires & why it chains:** C1 `gather`s the room *by every joinery piece fired on earlier turns*
(`read(woken:joinery)` — the engine auto-seats each fired piece as a typed audience-thing, L3 §0), so
the room the run built keeps returning. C2 `rest`s that held room **onto** the capstone toward its
fixed mark 7 (the mark never moves — canon), and re-stamps it joinery so C1 reads bigger *next* turn.
C3 clears mark 7 on one `rest self × chain` and `fill`s by the joinery-count C1/C2 grew — **then wakes
and seats as one more joinery audience-thing, feeding C1's `read(woken:joinery)` next turn.** The loop
is the compounder: fired pieces → bigger `gather` → clear bigger marks → more fired pieces. Break the
chain and the capstone under-fills — the reach that falls short (`the-reach`, the spilling). **Depth 4.**

---

### A2 · The Mannerly — *courtship*

**Identity:** high-power shy-material pieces, each locked behind a legible term; build the term-state,
`court` the proud stuff by it, and the benched proud piece pays spectacularly — dead cards in a dim
hand, a wedding when the courtship lands.

- **Dominant L3 primitive:** **`court`** (perform a term) + **`read(grain/chain)`** / audience-tokens
  that *satisfy* terms. Secondary: `rest` on the resulting high-delight proud pieces.
- **L2 resources:** **R6 courted stock** (the engine) + **R3 Standing as a *pure gate*** — gleam
  widens the market, **never depleted by use** (WORLD.md:413; `two-gate-courting`). Highest single-piece
  ceiling in the game.
- **L4 doors:** **M1 the courting-market** (vouch + performed term) + **M2/M6 introduction-jars** +
  **P5 bench** (proud stock → high-mark pieces). Grain-gated width via `grain-tagged-standing`.
- **Risk posture:** **greedy value / swingy** — a term that goes stale is an asking carried past its
  season → the spilling (WORLD.md:413, the *only* thing a Mannerly risks: the terms themselves).
- **Win-approach:** *landed-ceiling* — one proud benched piece at boss scale (napkin route
  `landed-ceiling`, eff 9.1).

**Signature chain (depth 3) — the vouching, the term, the payoff:**

```jsonc
// C1 — Keep the Silver Singing (song): establish the TERM-STATE (unbroken chain = singing-silver's term)
{ "id":"keep-singing","grain":"song","mark":2,"ceiling":4,"woken_delight":1,
  "effects":[
    {"when":"on-play","do":"steady","params":{"links":1,"brace":true}},         // hold the chain unbroken
    {"when":"on-play","do":"gather","params":{"amount":{"do":"read","source":"grain:song"}}} ]}

// C2 — Court the Singing-Silver (song): gleam VOUCHES (gate), the held chain SATISFIES the term
{ "id":"court-silver","grain":"song","mark":3,"ceiling":5,"woken_delight":2,
  "effects":[
    {"when":"on-play","do":"court","params":{"stock":"singing-silver",
        "term":{"if":{"do":"read","source":"chain"},"ge":3}}} ]}                // proud stock -> pack (bench off-turn)

// C3 — The Silver Refrain (proud benched piece, high mark/delight): the spectacular payoff
{ "id":"silver-refrain","grain":"song","mark":6,"ceiling":8,"woken_delight":5,"tags":["proud"],
  "effects":[
    {"when":"on-play","do":"rest","params":{"target":"self","amount":{"do":"read","source":"room"}}},
    {"when":"on-wake","do":"fill","params":{"amount":{"do":"read","source":"grain:song"}}},
    {"when":"on-fulfil","do":"draw","params":{"n":1,"suit":"song"}} ]}          // reload the next courtship
```

**How it fires & why it chains:** C1 holds an **unbroken chain** — *singing-silver's own term*
(`graded-material-market`). C2's `court` reads **gleam as the vouching gate** (width, never spent) and
reads the **chain-state C1 built** as the performed term, so the proud silver enters the pack (benched
off-turn, L4 P5, into C3). C3 is the proud piece the courtship bought — high fixed mark, high
`woken_delight` — and pays a big `fill` by song-count, then `draw`s toward the next courtship. **The
term-state written by C1 is what C2 reads to unlock C3.** Miss the chain and C2's term fails, C3 never
enters the deck — *dead cards in a dim hand.* **Depth 3.**

---

### A3 · The Morning-Gleaners — *ripe mending*

**Identity:** walk *toward* the grey; the engine scales with paleness — richest dawns, ripened
compounded needs (five-ring poems) as harvest — then mend the ground you farmed.

- **Dominant L3 primitive:** **`read(season)` / `read(spiral)`** scaling `gather` / `whittle` / `fill`
  (firewall-legal — paleness feeds attention/handsel/fill, **never Standing**, L3 §2). Only archetype
  that uses **`soothe`** (the board-writer).
- **L2 resources:** **R4 the Paling** (route the weather) + **R1 the richest dawns** on pale nodes
  (`dawn-income`, `gleaner-adversity-economy`).
- **L4 doors:** **M4 the gleaning** (last-red + twice-benched, richest on pale ground) + **P1 glad-load**
  (rings-in = load-out: the biggest loads are on the palest towns).
- **Risk posture:** **highest route risk in the game** — one mistimed season is standing in deep grey
  with an asking too big for tonight's hands (WORLD.md:422).
- **Win-approach:** *raw-burst on a ripened need* (napkin route `raw-burst`, eff 8.8) — answer a
  five-ring poem before the dawn-watchers.

**Signature chain (depth 4) — glean the grey, mend it:**

```jsonc
// C1 — Pale-Dawn Draw (glaze): the paler/later the ground, the bigger the room
{ "id":"pale-dawn","grain":"glaze","mark":2,"ceiling":4,"woken_delight":1,
  "effects":[
    {"when":"on-play","do":"gather","params":{"amount":{"do":"read","source":"season"}}} ]}  // FIREWALL-LEGAL: -> room

// C2 — Glean the Grey (glaze): the node's ring-count becomes handsels; thin a dead card to the table
{ "id":"glean-grey","grain":"glaze","mark":3,"ceiling":5,"woken_delight":2,
  "effects":[
    {"when":"on-play","do":"whittle","params":{"amount":{"do":"read","source":"spiral"}}},   // rings -> money, never gleam
    {"when":"on-wake","do":"retire","params":{"target":"inert:hand","to":"table"}} ]}        // richer dawn tomorrow

// C3 — Ripe Mending (glaze capstone): the pale-fed room clears the poem; delight by the rings; soothe the node
{ "id":"ripe-mending","grain":"glaze","mark":7,"ceiling":9,"woken_delight":3,"tags":["capstone"],
  "effects":[
    {"when":"on-play","do":"rest","params":{"target":"self","amount":{"do":"read","source":"room"}}},
    {"when":"on-wake","do":"fill","params":{"amount":{"do":"read","source":"spiral"}}},       // the 5-ring poem pays by rings
    {"when":"on-fulfil","do":"soothe","params":{"amount":1}} ]}                                // last-red slows this node's paling
```

**How it fires & why it chains:** C1 `gather`s a room *scaled by how pale/late the ground is*
(`read(season)` → room — legal, never Standing). C2 turns the node's **spiral rings into handsels**
(`whittle read(spiral)`) and `retire`s a dead card to *this* table (richer dawn if you camp the pale
country). C3 dumps the pale-fed room onto the **ripened 5/7-ring need**, `fill`s **by the ring-count**
(the compounded poem pays proportional to what the Gleaner let ripen), then `soothe`s the node with
last-red — the one board-write, and it never touches the gleam meter. **The paleness C1/C2 read is
exactly the paleness C3 gets paid by** (rings-in = load-out); route into grey too early and the room is
thin, too late and the need out-scales your hands. **Depth 4.**

---

### A4 · The Eveners — *conversion & velocity*

**Identity:** exhaust-heavy, always for conversion — retire inert pieces into local-table income
(richer dawns downstream on this very route) while a handsel engine keeps money bright by keeping it
moving. Composts what other decks hoard; wins long runs.

- **Dominant L3 primitive:** **`retire`** (last-light → **table**) + **`whittle`**, glued by
  **`read(handsels)` → `gather`** (the purse *becomes* the room). Distinct from the Untold's exhaust:
  Evener retire targets **income**, not **tempo**.
- **L2 resources:** **R2 handsels** (velocity: *"what stops moving, dims"*) + **R1 local-table dawns**
  the retire feeds. The only build whose room is fuelled by the purse.
- **L4 doors:** **H1/H2 whittling** + **H3 glad-load handsels** + waymeet gifting (thinning-as-gift, P3
  reverse). Low material dependence.
- **Risk posture:** **low-and-steady** (WORLD.md:429) — the control deck; highest consistency in the game.
- **Win-approach:** *prepared-board* — a deep table + bright purse assembled over the run stands the
  crown by preparation, not spike (napkin route `prepared-board`, eff 9.4).

**Signature chain (depth 4) — the last-lighting velocity loop:**

```jsonc
// C1 — Rung Hand to Hand (dough): carve the shavings-share of a big play into bright handsels
{ "id":"rung-hand","grain":"dough","mark":2,"ceiling":4,"woken_delight":1,
  "effects":[
    {"when":"on-play","do":"whittle","params":{"amount":{"do":"read","source":"room"}}},   // big room -> more money
    {"when":"on-chain","do":"steady","params":{"links":1}} ]}

// C2 — The Last Lighting (dough): retire a dead piece to THIS node's table -> richer dawn tomorrow
{ "id":"last-lighting","grain":"dough","mark":3,"ceiling":5,"woken_delight":2,
  "effects":[
    {"when":"on-play","do":"retire","params":{"target":"inert:hand","to":"table"}},        // thin + fuel the table
    {"when":"on-wake","do":"retire","params":{"target":"inert:hand","to":"room"}} ]}        // a second dead card, fuel NOW

// C3 — The Evening Table (dough capstone): the bright purse becomes a big room; pay the fill; re-bright the purse
{ "id":"evening-table","grain":"dough","mark":6,"ceiling":8,"woken_delight":3,"tags":["capstone"],
  "effects":[
    {"when":"on-play","do":"gather","params":{"amount":{"do":"read","source":"handsels"}}}, // purse -> room (the Evener lever)
    {"when":"on-play","do":"rest","params":{"target":"self","amount":{"do":"read","source":"room"}}},
    {"when":"on-fulfil","do":"whittle","params":{"amount":1}} ]}                             // keep it moving
```

**How it fires & why it chains:** C1 `whittle`s a big play into **bright handsels** (`read(room)` → more
money). C2 `retire`s two dead pieces — one to **the table** (richer dawn next morning on this route),
one to **the room now** — thinning the deck while fuelling both clocks. C3 is the payoff: `gather`s the
room **from the purse** (`read(handsels)` — the only archetype that does this), clears its mark, and
`whittle`s on fulfil to keep the money moving. **The purse C1 fills is the room C3 spends; the table C2
feeds is tomorrow's dawn.** Let the money sit and it dims (`handsel-currency-decay`) — the velocity is
mandatory. **Depth 4.**

---

### A5 · The Untold — *the ratchet, as tempo* (I-022 carrier)

**Identity:** a thin, fast deck of cheap fine-grained one-shots that exhaust and never repeat; clear
*many small* needs per morning; the pressure that rises is **contract count and pace**, not tier — until
the combing arrives as weather.

- **Dominant L3 primitive:** **`draw`** (thin-deck flow + filtered search) + **cheap `fill`** one-shots
  that exhaust; **`read(grain:thread)`** stacks the *count* into one big fill. Distinct exhaust: for
  **pace**, not conversion (WORLD.md:436).
- **L2 resources:** **R5 deck velocity** (fewest cards, fastest cycle) + the **contract count** channel
  as the felt pressure. Deliberately fine-grained gleam (*"a shine like sand, not like beams"*).
- **L4 doors:** thin — **P6 first-gift** + a few fine-grained **P1 glad-loads**; the between-roads as
  rumor-silent breathing room (no askings, bought with tempo).
- **Risk posture:** **cool and controlled** (WORLD.md:436), with the combing as the honest end of the trick.
- **Win-approach:** *count-stack* — many kettles woven into one boss-scale fill for the size-clamped
  crown (napkin route `count-stack`, eff 9.2).

**Signature chain (depth 4) — the paper-bird ratchet:**

```jsonc
// C1 — Paper-Bird (thread, cheap one-shot, exhausts): pay a small fill, draw its own replacement
{ "id":"paper-bird","grain":"thread","mark":1,"ceiling":2,"woken_delight":1,"tags":["one-shot"],
  "effects":[
    {"when":"on-play","do":"fill","params":{"amount":{"do":"read","source":"grain:thread"}}}, // small, but scales with the count
    {"when":"on-play","do":"draw","params":{"n":1,"suit":"thread"}} ]}                          // replace itself -> the deck flows

// C2 — Quick-Hand (thread): search the next one-shot, keep the room warm across many cheap plays
{ "id":"quick-hand","grain":"thread","mark":2,"ceiling":3,"woken_delight":1,
  "effects":[
    {"when":"on-play","do":"draw","params":{"n":1,"suit":"thread"}},
    {"when":"on-chain","do":"steady","params":{"links":1,"brace":true}} ]}                      // stalls don't cool the tempo

// C3 — The Standing Count (thread capstone): the fill scales with how MANY thread one-shots fired this turn
{ "id":"standing-count","grain":"thread","mark":4,"ceiling":6,"woken_delight":2,"tags":["capstone"],
  "effects":[
    {"when":"on-play","do":"rest","params":{"target":"self","amount":{"do":"read","source":"chain"}}},
    {"when":"on-wake","do":"fill","params":{"amount":{"do":"read","source":"grain:thread"}}},   // COUNT -> one big fill (crown route)
    {"when":"on-fulfil","do":"draw","params":{"n":2,"suit":"thread"}} ]}
```

**How it fires & why it chains:** each C1 `fill`s a small need and `draw`s its own replacement, so the
thin deck **cycles fast** — many one-shots clear many small askings per morning (the tempo channel). C2
searches the next one-shot and `steady`s the chain so the pace doesn't cool. C3 reads **the count** —
`read(grain:thread)` = how many thread pieces fired this turn — and stacks it into **one big fill**:
this is how tempo *becomes* burst for the size-clamped crown. **Every C1 that fired raised the count C3
gets paid by.** Mid-run, count-and-pace is the pressure (proven in §3); the crown is the day it arrives
as tonnage. **Depth 4.**

---

### A6 · The Fairwrights — *the multiplier spike*

**Identity:** make the watching. Assemble a huge transient crowd, dump it all past a ceiling in one
enormous public turn, and the overkill runs to Standing at full rate — the biggest gleam swing in the
game, feast-and-famine on a delay.

- **Dominant L3 primitive:** **`gather`** (venue + transient crowd tokens → giant room) + **`brim`**
  (the *only* card gleam-writer; widens the overkill band). Only archetype built around `brim`.
- **L2 resources:** **R1 attention** as transient crowd (venue-bound, expires when the fair moves) +
  **R3 Standing** as the payoff (`full-cup-overflow` / `overkill-to-standing`).
- **L4 doors:** **M3 festival-glass & crowd-bound stock** (*"no crowd, no glass"*) + **P2 the Fair draft**
  + fair-intercept routing. A crowd is an occasion, not a faucet.
- **Risk posture:** **highest variance in the game** — a dead room spills, a full one makes the run
  (WORLD.md:443).
- **Win-approach:** *raw-burst / landed-ceiling* — the one enormous turn IS the crown stand (napkin
  route `raw-burst`, eff 10.0).

**Signature chain (depth 4) — the one enormous turn:**

```jsonc
// C1 — Raise the Ground (dance, venue): a big transient crowd token; hold it across the setup
{ "id":"raise-ground","grain":"dance","mark":2,"ceiling":4,"woken_delight":1,"tags":["venue"],
  "effects":[
    {"when":"on-play","do":"gather","params":{"amount":{"do":"read","source":"woken:dance"}}},
    {"when":"on-chain","do":"steady","params":{"brace":true}} ]}                               // the crowd doesn't cool

// C2 — Pitch the Ring (dance): pour still more crowd in; aim the capstone
{ "id":"pitch-ring","grain":"dance","mark":2,"ceiling":4,"woken_delight":1,"tags":["venue"],
  "effects":[
    {"when":"on-play","do":"gather","params":{"amount":{"do":"read","source":"room"}}},        // room begets room (soft-capped)
    {"when":"on-play","do":"mark-grain","params":{"target":"hand:capstone","suit":"dance"}} ]}

// C3 — The Whole-Fair Turn (dance capstone, high ceiling): dump it all, overkill -> Standing, band widened
{ "id":"whole-fair","grain":"dance","mark":6,"ceiling":8,"woken_delight":3,"tags":["capstone"],
  "effects":[
    {"when":"on-play","do":"rest","params":{"target":"self","amount":{"do":"read","source":"room"}}}, // pour PAST the ceiling
    {"when":"on-overkill","do":"brim","params":{"band":{"do":"read","source":"room"}}},         // FIREWALL-LEGAL: band reads the ROOM
    {"when":"on-fulfil","do":"whittle","params":{"amount":1}} ]}
```

**How it fires & why it chains:** C1/C2 stack a **huge transient room** (crowd tokens + `read(room)`
begetting room, soft-capped so it plateaus not explodes). C3 `rest`s that whole room onto the capstone
**past its ceiling**, and `brim` widens the genuine-overkill→Standing band — **the band read off the
room C1/C2 built, never the board** (the gleam-firewall; `brim(read(spiral))` is uncompilable). The
crowd is transient by law, so if the room never assembled, C3 falls short and spills — feast or famine.
**The room C1/C2 gather is the exact number C3 brims to gleam.** **Depth 4.**

---

## 2. The distinctness argument — six engines, not palette-swaps

**Distinctness is enforced by dominant primitive + dominant resource + win-route, not by flavor.**
Each row below is a different *verb doing the load-bearing work* and a different *resource surface it
writes*:

| Archetype | Dominant L3 primitive | Dominant resource | Win-route (napkin) | The number that carries the payoff |
|---|---|---|---|---|
| **Kilnfast** | `steady` + `read(woken:<suit>)` | R1 held chain + R5 fired persistence | raw-burst / prepared-board | seated-audience count (cross-turn) |
| **Mannerly** | **`court`** + term-state | R6 courted stock + R3 gleam-*gate* | landed-ceiling | one proud piece's high delight |
| **Gleaners** | **`read(season/spiral)`** + **`soothe`** | R4 Paling + R1 pale dawns | raw-burst | the node's ring-count |
| **Eveners** | **`retire`→table** + `read(handsels)` | R2 handsel velocity + R1 table | prepared-board | the moving purse |
| **Untold** | **`draw`** + cheap exhaust `fill` | R5 deck velocity + contract count | count-stack | thread one-shots fired this turn |
| **Fairwrights** | `gather`(crowd) + **`brim`** | R1 transient crowd + R3 gleam spike | raw-burst / landed-ceiling | overkill past the ceiling |

**Why these are not palette-swaps (the pairwise separations that matter most):**

- **Kilnfast vs Fairwrights** — both end in a big `rest self × room`, but Kilnfast's room is a
  **persistent cross-turn** seated audience (no spike, `read(woken)`), Fairwrights' is a **transient
  single-turn** crowd dumped through `brim`. One is a curve, one is a spike. Opposite variance poles
  (napkin consist 9 vs 2).
- **Evener vs Untold** — both exhaust, but `retire→table` (Evener: R2/R1 income) vs cheap-one-shot
  exhaust (Untold: contract-count tempo). Canon's own dividing line (WORLD.md:429). Different dominant
  resource entirely.
- **Gleaner vs Evener** — both feed the local table, but the Gleaner's engine is `read(season)` scaling
  *inputs* (weather-reading) while the Evener's is `retire` composting *the deck* (velocity). One reads
  the board, one thins the pack. Only the Gleaner uses `soothe`.
- **Mannerly vs everyone** — the only archetype whose engine gates on **`court`** and whose payoff is a
  single benched proud piece; R6 is a dominant resource for no one else. Uniquely highest ceiling.
- **Untold vs everyone** — the only build whose *pressure axis* is count-and-pace rather than tier
  (§3), and the only one that reads `grain:<suit>` as a **count** into a fill.

Each archetype is **uniquely best on exactly one napkin axis** (crown → Fairwrights, consist → Eveners,
econ → Gleaners, tempo → Untold, scaling → Kilnfast, ceiling → Mannerly), and **no archetype dominates
any other on all six axes** (§3). Distinct win-condition levers, not re-skinned stat-sticks.

**Intuitiveness (`intuitiveness ≥ 0.8`).** Each identity is predictable from its Walking-Way name +
the world's logic: *Kilnfast* = fired permanence → the compounding fired-audience deck; *Mannerly* =
courtship → the `court`-the-shy-stuff deck; *Gleaners* = walk the grey → the paleness-scaling deck;
*Eveners* = keep the evening / un-hoard → the retire-and-circulate deck; *Untold* = outrun the tale →
the thin fast tempo deck; *Fairwrights* = make the watching → the crowd-spike deck. No class menu — the
country teaches you in via grain (`grain-tagged-standing`, `walking-ways-cardpools`). **Claimed ≥ 0.8.**

---

## 3. Executable napkin — viability, non-domination, and I-022 (`napkin_flags = 0`)

Model: `design/proposals/layer-05/napkin.py` (self-contained; run `python3 napkin.py`). All numbers
are napkin-scale — **game-loop owns exact tuning; this fixes the SHAPE the tuning must preserve.**

### 3a · I-022 — the Untold's tempo escalation *matches* the size curve (mid-run), *clamped* at the crown

**The obligation (D-005.3 / I-022):** prove the Untold's count-and-pace pressure matches the spine's
size-escalation curve, or clamp it. **This proposal does both** — proves the mid-run, clamps the finale.

**Prove (mid-run).** Define *pressure* = demand a player must clear **per worked morning** to keep pace
with the weather. A tonnage player faces ~1 rising-size need/morning → pressure = size. The Untold faces
**flat-small needs but a rising count** — canon: *"a fine-grained shine is shown more, not less — more
kettles in every town, sooner, closer together, the pace climbing with the brightness"* (WORLD.md:434).
Because the lantern is fired to peak-Standing, rising brightness → rising kettle-count. Setting the
count so demand/morning equals the tonnage demand/morning at every leg:

| Leg | tonnage need | Untold need | Untold #/morning | tonnage pressure | Untold pressure |
|---|---|---|---|---|---|
| Green Going | 1 | 1.5 | 0.67 | 1 | **1.00** |
| Long Light | 3 | 1.5 | 2.00 | 3 | **3.00** |
| Deep Gold | 5 | 1.5 | 3.33 | 5 | **5.00** |
| Red Walk | 7 | 1.5 | 4.67 | 7 | **7.00** |

The Untold pressure curve is **monotone rising through the mid-run** (D-001's requirement) and **equals
the tonnage pressure at every leg** — tempo carries the same escalation tonnage does, because count
rises on the same brightness clock size does. *The ratchet is real; it only chose the shape.*

**Clamp (finale).** The combing/crown *"reads a country's need, not a town's talk"* (WORLD.md:434) — it
is a **size event for every way.** The Untold cannot fractionate an 8-need crown into `8 / 1.5 ≈ 5.3`
kettles; standing it requires a genuine **burst ≥ 8 in one stand.** So the Untold must *grow* a
count-stack burst-capacity (chain A5-C3: `fill read(grain:thread)`) to stand it — the *"honest end of
the trick."* **Mid-run = proven-match; finale = clamped-to-size.** The tempo channel is a legitimate
mid-run pressure curve, not an escape hatch from escalation.

### 3b · Viability — all six can stand the crown, each by its own lever

The crown is one size-8 boss for everyone, but there is **no single "the" way to stand it**: each
archetype converts its dominant lever into boss-scale output by a *different route*. Model routes:
`raw-burst`, `prepared-board`, `count-stack`, `landed-ceiling`. Result:

| Archetype | best route | eff_crown | stands crown? |
|---|---|---|---|
| Kilnfast | raw-burst | 10.6 | ✔ |
| Mannerly | landed-ceiling | 9.1 | ✔ |
| Gleaners | raw-burst | 8.8 | ✔ |
| Eveners | prepared-board | 9.4 | ✔ |
| Untold | count-stack | 9.2 | ✔ |
| Fairwrights | raw-burst | 10.0 | ✔ |

**All six viable — and crucially by four *different* routes** (Kilnfast/Gleaner/Fairwright by raw burst,
Evener by prepared board, Untold by count-stack, Mannerly by landed ceiling). Viability is not a
palette-swap of one crown solution.

### 3c · Non-domination — none strictly best

Six-axis profiles (crown, consist, econ, tempo, scaling, ceiling), assigned from canon flavor:

- **Strict-domination pairs found: NONE** (no archetype ≥ another on all six axes).
- **Each archetype is uniquely best on exactly one axis** (the identity lever it owns — table §2).
- **Total-power band = 7 points** (Gleaners 44 → Fairwrights 37) — tight parity; differentiation is by
  *shape*, not power. No runaway generalist.

**`napkin_flags = 0`** — all six viable, zero domination pairs, each owns an axis, Untold I-022 curve
rising-and-matched-and-clamped. (Carried to game-loop: exact per-leg count coefficients, the
burst-capacity/crown coefficient, and the six axis magnitudes — *numbers*, not structural holes.)

---

## 4. Minimum synergy_depth across archetypes

Every signature chain is spelled as **interacting cards where an earlier card writes the shared-state
number a later card reads** — a combo engine, not a pile of good cards (order-and-state sensitive; the
same cards in a broken order under-fill):

| Archetype | chain length | the read-write spine |
|---|---|---|
| Kilnfast | **4** | fired-audience → `read(woken:joinery)` → `gather` → clear mark → fire again |
| Mannerly | **3** | chain-state → `court` term → proud piece unlocked → high fill |
| Gleaners | **4** | `read(season)`→room, `read(spiral)`→handsels/fill → `soothe` |
| Eveners | **4** | `whittle`→purse, `retire`→table → `gather read(handsels)` → fill |
| Untold | **4** | cheap `fill`+`draw` cycle → count → `read(grain:thread)` → one big fill |
| Fairwrights | **4** | crowd `gather` → room → `rest` past ceiling → `brim read(room)` |

**Minimum synergy_depth across archetypes = 3** (the Mannerly; all others 4). **Gate
`synergy_depth ≥ 3` cleared.**

---

## 5. Trace & consistency check

- **Traces to Walking Ways (L3 factions):** A1→`the-kilnfast`, A2→`the-mannerly`,
  A3→`the-morning-gleaners`, A4→`the-eveners`, A5→`the-untold`, A6→`the-fairwrights`
  (WORLD.md §L3; ledger `kilnfast-tall-permanence`, `mannerly-condition-puzzle`,
  `gleaner-adversity-economy`, `evener-sacrifice-velocity`, `untold-ratchet-tempo`,
  `fairwright-multiplier-spike`; `walking-ways-cardpools`, `grain-tagged-standing`).
- **Composed FROM L3 primitives** (no new verb): every card is data over
  gather/rest/steady/fill/brim/mark-grain/draw/retire/whittle/court/soothe/read/warm/keep. ✔
- **Consistent with L1** (fixed marks never moved; overkill→gleam only via `brim`; node-local RETURN;
  the-reach risk carried by every under-filled chain), **L2** (each archetype leans a distinct
  resource of the square; no fifth token), **L4** (each maps to distinct acquisition doors; inert
  delivery — the room still wakes every acquired piece). ✔
- **D-002 wonder / D-003 do-not-resemble:** every archetype is the world's own craft-physics worn as a
  playstyle (hold the room, court the stuff, walk the grey, keep the evening, outrun the tale, raise
  the crowd) — no debt/court/paperwork, no candy-kingdom twee. ✔
- **The gleam-firewall holds in every chain:** Gleaner `read(season/spiral)` feeds
  handsels/fill/room, **never gleam**; Fairwright `brim` reads the **room**, never the spiral. ✔

---

### Summary

Six archetypes, one per Walking Way, each a ≥3-card combo engine on a **distinct** dominant primitive +
resource + win-route; an executable napkin certifying all six viable (four crown routes), none dominant
(zero domination pairs, 7-point band), and the Untold's tempo escalation **proven to match** the size
curve mid-run and **clamped to size** at the crown (I-022 discharged). **min synergy_depth = 3;
napkin_flags = 0; intuitiveness ≥ 0.8 claimed.**
