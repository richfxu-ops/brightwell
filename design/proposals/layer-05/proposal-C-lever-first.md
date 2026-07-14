# Layer 5 — Archetypes · Proposal **C · LEVER-FIRST**

**Proposer stance:** define each archetype by the **single resource/primitive LEVER it pulls hardest** — the one thing it optimizes. Map the six Walking Ways onto levers; let the *count* fall out of how many genuinely-distinct levers exist. Commit fully to the thesis: an archetype is not a card-list, it is *an answer to the question "what do you optimize?"* — and two archetypes are the same archetype if and only if they pull the same lever.

**Logline:** *Six ways of giving, six different things to optimize — spike the room, hold the fired, court the proud, harvest the grey, keep the money moving, or outrun the tale — each a distinct answer to "what do you pull hardest," none of them the best answer.*

---

## 0. The lever census — why the count is SIX

The locked L2 resource square gives six substrate quantities a build can lean on, plus one clock:

| Lever (what you optimize) | L2 resource / L1 axis | L3 verbs it pulls hardest | The Way that already lives here |
|---|---|---|---|
| **the room, spiked** — peak attention pool on ONE public occasion | R1 attention (occasion clock) | `gather`, `brim` | **the-fairwrights** |
| **the fired, held** — run-permanent deck density, room ratcheted by accumulated woken things | R5 deck (run clock) | `rest`, `steady`, `mark-grain` | **the-kilnfast** |
| **the proud, courted** — gleam-as-pure-gate opening high-power shy stock behind performed terms | R3 gate + R6 stock | `court`, `mark-grain`, `read(grain)` | **the-mannerly** |
| **the grey, harvested** — board paleness itself as the engine's fuel | R4 the Paling (run/route clock) | `read(season)`,`read(spiral)`, `soothe` | **the-morning-gleaners** |
| **the purse, moving** — conversion velocity: every dead card & idle handsel composted into forward fuel | R2 handsels (rest clock) | `retire`, `whittle`, `draw` | **the-eveners** |
| **the pace, ratcheted** — contract COUNT & PACE in place of tier; thin non-repeating one-shots | the contract clock (I-022) | `steady`, `draw`, `rest(read chain)` | **the-untold** |

**Each Way pulls a different one of the six levers hardest, and no two share a hardest-lever.** Under the lever-first thesis that is the definition of "mechanically distinct," so the honest count is **SIX** — the ledger's six candidate playstyles were already six distinct answers, not palette-swaps. I keep all six.

**Starter-set structure (the requested 3–4).** Distinctness is not the same as *onboarding legibility*. I tier the six by how self-contained their lever is:

- **Starter triad (taught first):** **Fairwright** (R1 — the resource the tutorial already teaches), **Kilnfast** (R5 — the deck itself), **Evener** (R2 — money, and the game's gentlest variance). These three teach the three *spendable/substrate* levers with no subsystem prerequisite.
- **Second wave (unlocked as identities):** **Mannerly** (needs the courting subsystem, C in L2), **Gleaner** (needs spiral-reading / route play), **Untold** (needs the contract-clock read). Each rides a subsystem the starters expose but do not require.

This satisfies "keep six *or* a tighter 3–4 with the rest as later identities" by doing **both**: six distinct levers, sequenced 3 + 3. Nothing is a later *palette-swap* — every second-wave archetype pulls a lever no starter pulls.

Acquisition of an archetype is diegetic, per `walking-ways-cardpools`: **no class menu** — you become the Way whose grain your gleam actually shows (`grain-tagged-standing`), by walking-with-masters and season-shadowing. Multi-Way decks are legal; grain rewards focus.

---

## 1. THE ARCHETYPE SLATE

Every chain below is spelled as **cards-as-data over the L3 primitives**. Marks are **fixed** (locked L1). `read(...)` is amount-syntax (rendered diegetically as *per / by*), never a printed verb. All gleam-writes (`brim`) obey the compile-time firewall: `band` reads only `room`/`chain`/`over-ceiling`, never a board surface.

---

### A · THE FAIRWRIGHTS — *the room, spiked*

- **Lever:** **R1 attention throughput**, bent to one enormous public turn where overkill runs to Standing at full rate (`full-cup-overflow` / `fairwright-multiplier-spike`).
- **One-line identity:** build a portable audience all season, then dump the whole ground into a single capstone and let the overflow become the run's biggest gleam swing.
- **Leans on:** R1 (the room) · verbs `gather`, `steady`, `brim`, `rest` · L4 acquisition: **festival-glass** (venue-bound stock, `graded-material-market`) + Fair draft + crowd tokens (large, venue-bound, **expire when the fair moves on**).
- **Risk posture:** **highest variance in the game.** Feast/famine on a delay — no work wakes thin in a room they raised, but a dead ground spills hardest.
- **Signature payoff chain (3 cards):**

```jsonc
// 1 — RAISE THE WAIN-STAGE (venue): seat the standing crowd, brace the peak
{ "grain":"joinery","mark":2,"ceiling":4,"woken_delight":1,
  "effects":[
    {"when":"on-play","do":"gather","params":{"amount":{"do":"read","source":"woken:*"}}},   // pool += every audience-thing present
    {"when":"on-chain","do":"steady","params":{"brace":true}} ]}                              // a needed pause won't cool the ground

// 2 — CALL THE FOUR HUNDRED (crowd, venue-bound): multiply the ground you just raised
{ "grain":"song","mark":3,"ceiling":5,"woken_delight":2,
  "effects":[
    {"when":"on-play","do":"gather","params":{"amount":{"do":"read","source":"room"}}} ]}     // pool += the pool (soft-capped) — the spike-builder

// 3 — THE WHOLE FAIR SINGS (capstone): dump it all, overflow -> Standing
{ "grain":"song","mark":8,"ceiling":9,"woken_delight":3,"tags":["capstone"],
  "effects":[
    {"when":"on-play","do":"rest","params":{"target":"self","amount":{"do":"read","source":"room"}}},   // one huge rest clears mark 8
    {"when":"on-overkill","do":"brim","params":{"band":{"do":"read","source":"over-ceiling"}}} ]}        // FIREWALL-LEGAL: band reads genuine overkill only
```

**How it fires:** Card 1 seats the whole present audience and braces so the pause to set up won't cool it; Card 2 *reads the room and gathers by it* — the multiplier that turns a big ground into an enormous one (bounded by `the-gathered-room`'s soft cap); Card 3 rests that entire pool onto a deliberately-high capstone, and the genuine overkill past the ceiling `brim`s to Standing at full rate. **Every number on Card 3 was written by 1→2.** Break the chain, or arrive after the crowd tokens expired, and the capstone under-fills — *a reach that falls short, the spilling* (L1 §4). The variance *is* the archetype.

---

### B · THE KILNFAST — *the fired, held*

- **Lever:** **R5 fired-deck permanence.** The smallest, densest deck; the room *floor* ratchets up run-long as fired artifacts accumulate and auto-seat. No spike anywhere — the payoff is inevitability.
- **One-line identity:** wake few pieces utterly, keep them forever, and let the compounding fired audience make every later working easier until the crown is trivial.
- **Leans on:** R5 (the deck) + the within-turn chain-held room · verbs `rest`, `steady`, `mark-grain`, `read(grain)` · L4 acquisition: **benched from courted stock**, walking-with-masters, few high-quality pieces; **twice-benched** stock (discounted mark, `the-twice-benched`).
- **Risk posture:** patient, **low-variance, weak openings, strongest boss-tier scaling** (`kilnfast-tall-permanence`).
- **Signature payoff chain (3 cards, compounds *across* turns):**

```jsonc
// 1 — BENCH FROM NOON (joinery): a cheap piece that fires early and SEATS as joinery
{ "grain":"joinery","mark":2,"ceiling":4,"woken_delight":1,
  "effects":[
    {"when":"on-play","do":"steady","params":{"links":1}},                                   // counts double toward the chain
    {"when":"on-wake","do":"mark-grain","params":{"target":"self","suit":"joinery"}} ]}       // seats as a joinery audience-thing (permanent)

// 2 — THE LONG TRESTLE (joinery): room grows by every joinery ALREADY fired
{ "grain":"joinery","mark":2,"ceiling":4,"woken_delight":1,
  "effects":[
    {"when":"on-play","do":"gather","params":{"amount":{"do":"read","source":"grain:joinery"}}}, // +1 room per joinery woken this run
    {"when":"on-chain","do":"steady","params":{"links":1}} ]}

// 3 — THE SETTERBY STAIR (capstone artifact): the chain-held room clears a high fixed mark
{ "grain":"joinery","mark":7,"ceiling":8,"woken_delight":3,"tags":["capstone"],
  "effects":[
    {"when":"on-play","do":"rest","params":{"target":"self","amount":{"do":"read","source":"room"}}},
    {"when":"on-wake","do":"mark-grain","params":{"target":"self","suit":"joinery"}} ]}        // itself seats -> next turn's read(grain:joinery) is higher
```

**How it fires:** Bench-from-Noon fires cheaply and *permanently seats a joinery thing*; Long Trestle's `gather` reads the run's accumulated joinery-count, so the room floor is a little higher every turn; the Setterby Stair rests that ever-growing chain-held room onto its high mark, fires, and **seats yet another permanent joinery thing** — so `read(grain:joinery)` is strictly larger next turn. The fired never unfires (`fired-vs-held`), so the curve only climbs. **No transient token, no spike:** where the Fairwright's crowd expires when the fair leaves, the Kilnfast's audience is fired for the run — this is why it out-scales at the boss (`combing-boss-tier`) and why it opens weak.

---

### C · THE MANNERLY — *the proud, courted*

- **Lever:** **R3 gleam-as-pure-gate + R6 courted stock.** Gleam is *never depleted by use* — it only widens the market; power is locked behind legible performed micro-conditions.
- **One-line identity:** carry high-power shy-material cards that are dead in a dim hand and spectacular when the courtship lands.
- **Leans on:** R3 (gate, read never spent) + R6 (courted stock) · verbs `court`, `steady`, `mark-grain`, `rest`, `fill`, `read(grain)` · L4 acquisition: the **two-gate courting-market** (`two-gate-courting`), **introduction-jars**, Mannerly notebooks.
- **Risk posture:** **greedy value** (`mannerly-condition-puzzle`). Costs arrive *only as outcomes* — an accepted term is an asking that can go stale → the spilling (R3 loss). Never spends gleam.
- **Signature payoff chain (3 cards):**

```jsonc
// 1 — SING THE SILVER ITS WEATHER (song): build the exact term the silver will ask for
{ "grain":"song","mark":3,"ceiling":5,"woken_delight":2,
  "effects":[
    {"when":"on-play","do":"steady","params":{"links":1,"brace":true}},                        // an UNBROKEN chain == singing-silver's term
    {"when":"on-wake","do":"mark-grain","params":{"target":"self","suit":"song"}} ]}

// 2 — COURT THE SINGING-SILVER (the court verb): gleam vouches, the chain is the term
{ "grain":"thread","mark":3,"ceiling":5,"woken_delight":1,
  "effects":[
    {"when":"on-play","do":"court","params":{"stock":"singing-silver",
       "term":{"if":{"do":"read","source":"chain"},"at_least":3}}} ]}                           // gleam GATES (read, never spent); performed term = read(chain)>=3

// 3 — THE SILVER SPEAKS (proud piece benched from the courted silver): the spectacular payoff
{ "grain":"song","mark":6,"ceiling":8,"woken_delight":5,"tags":["capstone"],
  "effects":[
    {"when":"on-play","do":"rest","params":{"target":"self","amount":{"do":"read","source":"room"}}},
    {"when":"on-wake","do":"fill","params":{"amount":{"do":"read","source":"grain:song"}}} ]}    // huge fill, per song woken — the courtship landing
```

**How it fires:** Card 1 builds and *braces* an unbroken song-chain — the literal micro-condition singing-silver states; Card 2's `court` reads gleam **as a gate only** (a key that turns, never a coin that leaves) and performs the term by reading `chain ≥ 3`, so the proud stock enters the pack; Card 3 is the piece that silver becomes — a high-delight, high-mark capstone whose `fill` reads the song-count Card 1 grew. **If the chain broke** (term unmet), Card 2 fails to court and Card 3 is a dead card in the hand — greedy value's downside. **If the accepted term later goes stale**, that is the Mannerly's only Standing loss (outcome-only). More gleam is never spent — it just opens *more* silver, which is the whole build.

---

### D · THE MORNING-GLEANERS — *the grey, harvested*

- **Lever:** **R4 the Paling itself.** The only archetype whose *engine input* is board-decay: paleness scales the room, the handsels, and the fill (`read(season)`,`read(spiral)`), and `soothe` tends what it harvests. **Firewall holds** — paleness feeds attention/handsels/fill, **never gleam.**
- **One-line identity:** route into the grey on purpose, answer five-ring poems before two hundred dawn-watchers, and repair the ground you reaped.
- **Leans on:** R4 (paleness) → R1 (rich dawns) + R2 · verbs `read(season)`,`read(spiral)`, `gather`, `rest`, `fill`, `soothe`, `whittle` · L4 acquisition: **gleaning** (last-red / twice-benched), ripened compounded askings, `pale-route-harvest`, shared map-intel (`road-marks`).
- **Risk posture:** **highest route risk in the game** (`gleaner-adversity-economy`); boss-affine — steers the map toward the `combing` on purpose.
- **Signature payoff chain (3 cards):**

```jsonc
// 1 — GLEAN THE GREY (glaze): pale ground pays room AND money
{ "grain":"glaze","mark":3,"ceiling":5,"woken_delight":2,
  "effects":[
    {"when":"on-play","do":"gather","params":{"amount":{"do":"read","source":"spiral"}}},       // the node's rings raise the room (rich pale working)
    {"when":"on-play","do":"whittle","params":{"amount":{"do":"read","source":"season"}}} ]}     // FIREWALL-LEGAL: paleness -> HANDSELS, never gleam

// 2 — RIPE MENDING (the five-ring-poem answerer): the harvest
{ "grain":"glaze","mark":6,"ceiling":8,"woken_delight":3,"tags":["capstone"],
  "effects":[
    {"when":"on-play","do":"rest","params":{"target":"self","amount":{"do":"read","source":"room"}}},  // the pale-rich room clears a high mark
    {"when":"on-wake","do":"fill","params":{"amount":{"do":"read","source":"spiral"}}} ]}         // fill pays by ring-count: a 5-ring poem pays 5-ring delight

// 3 — MEND AND MOVE ON: tend the ground you reaped, thin the deck
{ "grain":"glaze","mark":3,"ceiling":5,"woken_delight":2,
  "effects":[
    {"when":"on-fulfil","do":"soothe","params":{"amount":1}},                                    // last-red slows THIS node's future paling (board-write, never gleam)
    {"when":"on-fulfil","do":"retire","params":{"target":"inert:hand","to":"table"}} ]}          // last-light a dead card -> richer dawn here tomorrow
```

**How it fires:** on paler ground, Card 1's `gather` reads the spiral rings (a richer room the greyer it is) and `whittle` reads the season (more handsels) — the adversity economy, all firewall-legal; Card 2 rests that pale-rich room onto a high mark and `fill`s **by the ring-count**, so a ripened five-ring town pays a five-ring poem; Card 3 `soothe`s the node (the one board-writer) and retires a dead card to the local table for a richer dawn. **The build farms the country its `read(spiral)` scales, then repairs it.** The risk: you must *walk into the grey*, and ripened needs comb into a boss you then have to stand.

---

### E · THE EVENERS — *the purse, moving*

- **Lever:** **R2 handsels + conversion velocity.** Exhaust-heavy and self-thinning, *always for conversion* (never for pace — that's the Untold): dead cards and idle handsels are composted into forward fuel via `retire → table/room` and `whittle`.
- **One-line identity:** keep everything moving — last-light what others hoard, keep money bright by spending it, and win long runs on consistency.
- **Leans on:** R2 (handsels) + `the-returning-table` · verbs `retire`, `whittle`, `steady`, `draw`, `rest` · L4 acquisition: **twice-benched** (keys ONLY to chosen last-lightings, never failure — binding constraint honored), `the-shavings-share`, glad-price change.
- **Risk posture:** **low and steady** (`evener-sacrifice-velocity`); the control archetype that wins by composting and by making even its losses arrive somewhere.
- **Signature payoff chain (3 cards):**

```jsonc
// 1 — THE LAST LIGHTING (dance): retire dead weight into fuel, two ways
{ "grain":"dance","mark":3,"ceiling":5,"woken_delight":2,
  "effects":[
    {"when":"on-play","do":"retire","params":{"target":"inert:hand","to":"room"}},              // dead card -> the room NOW
    {"when":"on-play","do":"retire","params":{"target":"inert:pack","to":"table"}} ]}           // and another -> this node's table for tomorrow

// 2 — BRIGHT HAND TO HAND (handsel engine): carve the fattened room into singing money
{ "grain":"thread","mark":3,"ceiling":5,"woken_delight":1,
  "effects":[
    {"when":"on-play","do":"whittle","params":{"amount":{"do":"read","source":"room"}}},        // shavings-share off the retire-fattened room -> bright handsels
    {"when":"on-chain","do":"steady","params":{"links":1}} ]}

// 3 — EVEN THE RIM (capstone): the room the last-lighting fattened clears the mark; reload
{ "grain":"dance","mark":6,"ceiling":8,"woken_delight":3,"tags":["capstone"],
  "effects":[
    {"when":"on-play","do":"rest","params":{"target":"self","amount":{"do":"read","source":"room"}}},
    {"when":"on-fulfil","do":"draw","params":{"n":2}} ]}                                         // self-thinned deck reloads
```

**How it fires:** Card 1 last-lights two paling-prone pieces — one to the room *now*, one to *this node's* table for a richer dawn; Card 2 reads that fattened room and `whittle`s it into bright handsels while steadying the chain; Card 3 rests the fattened room to answer, then `draw`s to refill the deck the archetype keeps deliberately thin. **Distinct from the Gleaner** (self-sourced compost vs world-decay harvest) and **from the Untold** (exhaust for *conversion* vs exhaust for *pace*). Nothing is hoarded; every loss arrives somewhere — the un-hoarder's engine.

---

### F · THE UNTOLD — *the pace, ratcheted*

- **Lever:** **the contract clock — COUNT & PACE in place of tier.** A thin, fast deck of cheap fine-grained one-shots that exhaust and never repeat (the paper-bird pattern); many small askings cleared quickly. **Carries the I-022 obligation** (§3).
- **One-line identity:** outrun your own tale — mend many small true things, fast, before any hearth braids you a legend that lowers rafters on you.
- **Leans on:** the contract clock + a thin deck · verbs `steady`, `draw`, `rest(read chain)`, `fill` · L4 acquisition: cheap one-shot pieces, between-road nodes, doorstep askings; **fine-grained gleam on purpose** (`grain-tagged-standing` — shown *more*, not *bigger*).
- **Risk posture:** medium — no permanent audience to fall back on (the thinnest late-game floor), highest tempo throughput; escalation arrives as tempo until the day it arrives as weather.
- **Signature payoff chain (3 cards):**

```jsonc
// 1 — MEND THE SMALL TRUE THING (one-shot): cheap, wakes on a modest chain, then redraws itself
{ "grain":"thread","mark":2,"ceiling":3,"woken_delight":1,"tags":["one-shot"],
  "effects":[
    {"when":"on-play","do":"rest","params":{"target":"self","amount":{"do":"read","source":"chain"}}},  // wakes cheaply off the running chain
    {"when":"on-fulfil","do":"draw","params":{"n":1}} ]}                                          // exhausts, but its replacement flows in

// 2 — TWO TOWNS GONE BY BREAKFAST (tempo): pace the chain, search the next small piece
{ "grain":"dance","mark":2,"ceiling":3,"woken_delight":1,"tags":["one-shot"],
  "effects":[
    {"when":"on-play","do":"steady","params":{"links":2,"brace":true}},                          // this play counts as 2 links -> next wake even easier
    {"when":"on-play","do":"draw","params":{"n":1,"suit":"thread"}} ]}                            // fetch the next fine-grained one-shot

// 3 — AHEAD OF THE TELLING (the pace-payoff): the running chain becomes the fill
{ "grain":"song","mark":3,"ceiling":4,"woken_delight":2,"tags":["one-shot"],
  "effects":[
    {"when":"on-play","do":"rest","params":{"target":"self","amount":{"do":"read","source":"chain"}}},
    {"when":"on-wake","do":"fill","params":{"amount":{"do":"read","source":"chain"}}} ]}          // fill scales with pace held, not piece-size
```

**How it fires:** every one-shot wakes off `read(chain)` (cheap while the pace holds) and `draw`s its own replacement, so the hand never empties; Card 2 counts as two links and braces, so the chain — the Untold's only compounding resource — climbs even though nothing seats permanently; Card 3 converts *pace held* directly into fill. **The engine is PACE, not size:** the Untold clears N small askings where a size build clears one big one. It cannot lean on `woken:<suit>` compounding (its pieces exhaust, they never seat) — deliberately, that is why its late-game floor is the thinnest and why it never wants to linger.

---

## 2. THE DISTINCTNESS ARGUMENT — six levers, not six paint-jobs

Distinctness under the lever-first thesis = **different hardest-lever + different win-condition + non-dominated on the axis-matrix.** All three hold:

| Archetype | Hardest lever | Distinct win-lever (how it stands the crown) | Best-on-axis (napkin §2) |
|---|---|---|---|
| Fairwright | R1 room, spiked | one overflow turn → Standing swing | **spike** |
| Kilnfast | R5 fired permanence | accumulated fired room-floor → boss scaling | **perm** |
| Mannerly | R3 gate + R6 stock | proud-material capstone when courtship lands | **matl** |
| Gleaner | R4 paleness | ripened five-ring fill on routed pale country | **route** |
| Evener | R2 velocity | last-light stockpile → one fattened room | **lowvar** |
| Untold | contract clock | pace held → fill, many small clears | **tempo** |

**Why these are not palette-swaps** (the three sharpest near-collisions, each resolved by the lever, not the theme):

- **Fairwright vs Kilnfast** (both lean on attention/room). *Different lever, different clock:* Fairwright pulls the room to a **peak on one occasion** off **transient crowd tokens that expire when the fair moves on** (occasion clock, highest variance). Kilnfast pulls the **fired deck** — a **run-permanent** audience floor that ratchets and never expires (run clock, lowest variance, weak open). One optimizes *peak-this-turn*; the other optimizes *floor-all-run*. Opposite variance signatures, opposite tempo.
- **Gleaner vs Evener** (both touch `retire`/`the-returning-table`). *Different fuel source:* the Gleaner harvests the **world's** paleness (`read(season)`/`read(spiral)` — external, high route-risk, boss-affine); the Evener composts its **own** dead cards (`retire → table/room` — self-sourced, low variance). For the Gleaner `retire`/`soothe` are side-tidy on an engine fuelled by board-decay; for the Evener `retire` **is** the engine. Import vs manufacture.
- **Untold vs Evener** (both exhaust-heavy, thin decks). *Different reason to exhaust:* the Untold exhausts **for PACE** — one-shots that redraw, chain as the only compounder, count-and-pace as pressure (I-022). The Evener exhausts **for CONVERSION** — dead weight last-lit into room/handsels, nothing wasted. Speed vs thrift; the Untold's pieces never seat, the Evener's retires *fund* the room.

The **napkin dominance check** (executable, §3) confirms it structurally: on the 6-axis lever-matrix **no archetype scores ≥ every other on all axes** (dominated-pairs = ∅), and **each is strictly best on exactly one axis** — the mathematical statement of "distinct answer to what-do-you-optimize, none the best answer."

---

## 3. THE UNTOLD'S ESCALATION — I-022, PROVED *and* CLAMPED

Binding obligation (D-005.3 / I-022): prove the Untold's count-and-pace pressure **matches** the spine's size-escalation curve, **or clamp** it. The executable napkin (`design/proposals/layer-05/napkin_l5.py`) does **both** — a match-proof for the pressure *shape*, and a hard clamp against *dominance*.

**The curve.** The spine's size-escalation is `escalation-is-the-weather` — the seasonal seep floor `W = [1.0, 1.6, 2.4, 3.4, 3.4]` across the five legs (near-still winter, strongest Red Walk). A size build faces a per-season demand `D_size(leg) = W·peak_tier·n_big`.

**The match-proof.** For the Untold to feel the *same rising pressure*, its required **clear-rate** (small askings cleared per worked morning) must rise so that `count × small_size` tracks `D_size`. It does — the delivered-demand shapes are **identical Green Going → Red Walk**:

```
size-curve shape   : 1.00  2.01  3.64  6.04  ...
untold-curve shape : 1.00  2.01  3.64  6.04  ...      (monotone rising: genuine escalation)
required clear-rate: 0.82  0.96  1.33  1.98  /morning  (the pace ratchet the fiction promises)
```

So the Untold's pressure is **not tonnage-light relief** — it is the same escalation integral re-shaped as tempo, with real teeth: unanswered small askings age into the spiral *together* (`accept-by-hand` → stale → the spilling; skipped → rings → `combing`), so falling behind the rising clear-rate spills and combs exactly as failing one big asking does.

**The clamp (belt-and-suspenders, so it can never *dominate*).** Two bounds cap the Untold at "matches," never "exceeds":
1. **Per-season demand capped at the size curve** — the Untold's delivered demand never exceeds `D_size` on any leg (checked: `True`), so it can never farm more total glad-load than a size build.
2. **A physical PACE ceiling** — you can only work `MORNINGS = [4,6,7,7,3]` mornings a leg at ≤2 small clears each. In the **Wintering** finale this ceiling **bites**: `C_match = 14.4` but the ceiling is `6`, so the Untold's curve is **CLAMPED** from 6.93 down to 2.89-normalized. The tempo build *cannot* out-throughput the physical calendar into a degenerate late-game.

Both hold simultaneously → `napkin_flags = 0`. The Untold is a genuine escalation experience (proved) that cannot become a tonnage exploit (clamped).

**Full napkin result** (all four obligations):

```
ALL archetypes stand the crown : True          # (1) viability
dominated pairs                : []             # (2) non-dominance
every archetype best on >=1 axis: True          #     each a distinct optimum
min synergy_depth              : 3              # (3) chains
Untold demand rises monotone + never exceeds size + clamp engaged : True   # (4) I-022
NAPKIN_FLAGS = 0
```

---

## 4. GATE SELF-CHECK

- **synergy_depth ≥ 3** — every archetype's signature chain is **exactly 3 interacting cards** where each load-bearing number is a `read` of state an earlier play wrote (room / chain / grain-count / spiral / over-ceiling); the same cards in broken order under-fill. **Min chain length across archetypes = 3.**
- **napkin_flags ≤ 0** — executable model returns **0**: all six viable (stand the crown), none dominates (∅ dominated pairs; each best on one axis), each has a real ≥3-card chain, Untold matched-then-clamped.
- **intuitiveness ≥ 0.8** — each archetype's identity is predictable from its Way-name + the world's logic: *Fairwrights make the watching → spike the room; Kilnfast fire things to last → permanent deck; Mannerly court the proud stuff → gleam-gated materials; Gleaners walk toward the grey → harvest paleness; Eveners un-hoard → conversion velocity; Untold outrun their tale → pace not tonnage.* No class menu — grain shows the Way (`grain-tagged-standing`).
- **Consistency with locked L1–L4** — chains use only the 14 L3 primitives; fixed marks never moved (the lever is always *more attention*, `gather`/`steady`/`rest`); `brim` firewalled (band reads within-channel only); `read(season|spiral)` feeds room/handsels/fill, never gleam; `court` reads gleam as a gate, never spends it; `retire`/`soothe` node-local; no fifth token; no debt/court/paperwork (D-003).

---

```json
{"path":"/Users/richardxu/Documents/games/pipeline-test-02/design/proposals/layer-05/proposal-C-lever-first.md","title":"Layer 5 Archetypes — Proposal C (lever-first)","logline":"Six ways of giving, six different things to optimize — spike the room, hold the fired, court the proud, harvest the grey, keep the money moving, or outrun the tale — each a distinct answer to what you pull hardest, none of them the best answer.","archetypes":["the-fairwrights (the room, spiked — R1 attention-spike)","the-kilnfast (the fired, held — R5 deck permanence)","the-mannerly (the proud, courted — R3 gate + R6 stock)","the-morning-gleaners (the grey, harvested — R4 paleness)","the-eveners (the purse, moving — R2 conversion velocity)","the-untold (the pace, ratcheted — contract clock, I-022)"],"min_synergy_depth_claimed":3}
```
