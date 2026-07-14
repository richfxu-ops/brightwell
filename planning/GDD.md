# GDD — pipeline-test-02 · ROUNDELAY

**Game:** a **Roundelay roguelike economy deckbuilder**. One maker walks one *verse of a Round* — a wander-year from the morning after the spring even-morrow to the first still dawn of winter — re-making a paling countryside by performing its needs into being. You build a pack of **journey-pieces** (craft-fragments), spend **attention** to wake them in front of the work, answer **askings** (escalating contracts) that grow with the year and with the brightest you have been, and stay lit by **gleam** (Standing) — a depletable regard that ends the run into the **Quiet Walk** when it guts out. The board is painted in one light and three brushes: *places pale, people gleam, things wake.*

**Locked spine (D-001):** roguelike economy deckbuilder · escalating contracts · a depletable Standing fail-resource. **Aesthetic (D-002):** wonder, whimsy, elegance — mechanics worn as the world's own physics, never a difficulty slider or an HP bar.

**Layer status:** Layer 1 (core loop & pressure) is specified below. Layers 2–7 follow — resource/economy detail (L4), archetypes & geography (L5), aesthetic/naming surface (L6), and the starter pool (L7) build on this loop and must not contradict it.

---

## Layer 1 — Core Loop & Pressure

**Gate:** intuitiveness ≥ 0.8 — every core mechanic legible from its name + the world's stated physics (effect = metaphor). This layer *concretizes* the locked spine into a playable loop; it invents nothing the canon did not already imply.

### 0. The three laws every loop mechanic obeys (binding, from canon)

Stated once, up front, because a player must be able to predict any mechanic from these:

- **The grammar of light** (`WORLD.md#grammar-of-light`, binding): *places pale, people gleam, things wake.* Three channels that never cross. The **Paling** only ever touches **board-state** (nodes, resources, routes). **Standing** (gleam) is a key-light on the **maker only**. **Waking** is one gold edge on a **journey-piece only**. No mechanic moves a loss from one channel into another.
- **The three settlings + the one exchange gate** (`the-three-settlings` / `play-as-exchange-gate`): the loop's three readings — **node color, Standing, card wakefulness** — never convert directly into one another. Every transfer between them passes through **a played journey-piece.** Play is the world's only exchange gate; that is *why* this is a deckbuilder.
- **Conservation — nothing is noticed away** (`the-round-of-light` / `attention-conservation`): spent attention always visibly arrives somewhere; unspent attention is never destroyed, only **returned** to the local table for tomorrow's dawn. A "where it went" readout replaces discard-to-void.

### 1. Run / leg / turn structure — the wander-year as pressure clock

Traces: `wander-year-run-frame`; `the-four-lights`; `run-map-circuit`.

| Scale | Name | What it is |
|---|---|---|
| Moment | **a play** | one journey-piece performed onto the work (the exchange gate) |
| **Turn** | **a worked morning** | dawn income → gather the room → play a work-chain → close at the fire; the engine's full arc (§2) |
| Leg | **a road between high days** | a segment travelled; road-memory applies. Travel itself spends no season-time — the Paling's tick and the seep's step-up ride the *worked mornings* that bracket a leg (§1's calendar law), never the miles; a pure-travel leg with zero worked mornings advances no pressure (§3–§5) |
| **Run** | **a verse of a Round** (the wander-year) | one maker's seasonal circuit, spring to the first still dawn |

**A run is one wander-year of fixed length**, set by a seasonal **calendar track** — the run's master resource, un-buyable, and *the same clock as the escalation curve.* **The calendar advances by elapsed season-time — worked mornings (dawns) — never by travel legs.** A maker who camps in one place and works the same node every morning still spends dawns, so still burns the wander-year, still walks *into* the rising seep, and still meets the year-end crown. No forcing function is keyed to travel; a stationary, camp-in-place player evades nothing. The load-bearing fact: **the seasonal seep-rate curve is the escalation clock.** Canon holds the seep near-still in winter, waking through spring, blowing strongest in late summer and autumn (`WORLD.md`: *"strongest in late summer and autumn when the world exhales, near-still in deep winter"*) — so a maker who sets out in spring walks *into* the out-breath, and pressure rises on its own, felt as weather, not a designer's slider:

| Leg | Season | Seep / pressure | The loop's feel |
|---|---|---|---|
| The Green Going | spring | near-still, waking | kettle-sized askings, thin dawns; learn what this year's valleys answer to |
| The Long Light | high summer | gentle → strong | the biggest working days, thick crowds, everything states its terms |
| The Deep Gold | late summer | strong | spirals turning visibly, the first enormous dawns; the engine turns |
| The Red Walk | autumn | strongest | the seep at full, the Fair a week ahead of the front, the country gathering toward seven |
| The Wintering | winter | near-still (unwalked) | the telling, or the road's memorial |

**A turn is one worked morning: one dawn, one road, one fire.** Only *worked* mornings are turns, and **each worked morning spends one dawn of season-time** — this is what advances the calendar. The road's un-worked miles fold into road-memory and cost neither a turn nor a dawn (the loop's lawful pacing valve); but a maker who never travels still works mornings, so the year still turns under them. Route choice — *which pale needs to answer now, which to trust forward to ripen* — is the core strategic layer above the per-turn performance; you thread the circuit an arc at a time at each waymeet, never the whole year at once. The map is **a loop with a home note, not a branch toward a boss**, and doubles as the run's autobiography (route-light brightening behind you).

### 2. The moment-to-moment loop — the working

Traces: `attention-engine` (`audience-of-things`); `waking-threshold-play`; `journey-pieces-deck`; `overkill-to-standing`; `attention-conservation`.

The tactical heart is **the working**: the performance you give to answer an asking. Its shape is dictated entirely by the attention engine and the waking threshold, read straight from canon (`WORLD.md#audience-of-things`: *attention is provided by watchers and sustained by unbroken work; it spends as a multiplier on the big play, and a card played at or above the waking threshold wakes*). **Three distinct, separately-named quantities** drive it — kept legibly apart so a newcomer never confuses them:

- **the room** — the attention **pool** you spend this turn. Seeded by the woken audience present, raised by an unbroken chain. *This is your budget.*
- **the waking-mark** — each card's **own fixed threshold.** Rest enough attention on a card to meet its mark and it wakes. *This is a fixed property of the card, printed on it — it never moves.*
- **the need's fill** — the accepted asking's **demand** (how much woken delight re-makes the node, e.g. "the well wants its sweetness back: ●●●"). *This is the target; overfilling it is the point.*

**The loop, one play at a time:**

1. **Dawn (income).** The morning issues regard: a flat universal base **+ a draw from the local table** (paler node = richer dawn) **+ yesterday's node-local returned surplus** — the share left on *this* table by **`the-returning-table`** yesterday (conservation; nothing was noticed away, it simply waited here for this dawn). The base is guaranteed large enough to wake at least the cheapest piece — *no morning is ever decision-free, even in a thin room* (§7). Draw a hand of journey-pieces.
2. **The room gathers.** Your starting **pool** = morning-draw + the gathered room (woken audience-things you own, townsfolk, venue). A thin room caps how bright anything can wake; a full room lifts the ceiling. *You work measurably better inside more of it.*
3. **Play a chain — spend and sustain.** Playing a piece draws attention from the pool as a **multiplier on that play** (spend). Playing pieces **back-to-back keeps the room with you** — the **work-chain** holds the pool high; a **stall** lets it cool and the pool sag (sustain). Attention is a *budget and a momentum at once,* and the two pull against each other every play. Building the chain **always makes the next wake easier** (more pool to spend) — effect matches "the room leans in."
4. **The waking line — attention splits, none lost (`the-returning-table`).** Each played piece's attention **splits with nothing lost: what is SET into the piece works it; the unspent remainder RETURNS to this node's local table for tomorrow's dawn** (§8, `the-returning-table`; node-bound, no caravanning). A piece with the set share resting **at or above its own waking-mark wakes**: it takes its thin gold working-edge, is **fired to your run-deck permanently** (`fired-vs-held` — the fired never unfires), pays **woken delight** into the need's fill, and **joins the room as a new audience-thing** on later turns. A piece below its mark still resolves once but stays **inert and paling-prone.** *Things wake when watched; spam-play in a thin room makes matches, not a workshop.*
5. **The full cup — overflow.** Attention poured **past a card's ceiling** (overkill, delight above its mark) **converts to Standing at full rate** (`overkill-to-standing`, *"a full cup runs to the pourer"* — the Moth Fair condition). *The run's biggest gleam swings happen here, on stage, in public.* Pushing a performance past "enough" is never waste.
6. **Fulfill.** When the need's fill completes, the node is re-made: **the square re-colors in watercolor strokes (only now — never per-play)** and the **glad-load** pays out (§3).

### 3. The contract (asking) lifecycle — accept · work · fulfill · escalate

Traces: `escalating-contracts`; `two-filter-lantern-sizing`; `contract-preview-ui`; `contract-payoff-bundle`; `combing-boss-tier`; `paling-clock`.

**Accept by hand.** Every town hangs its needs on the **asking-lantern** at the gate. You take the little crafted need-object down off its red thread; from then it **rides your pack** with legible demand-iconography and **warms as its season shortens** — a soft, tactile deadline, never a red timer. An asking's demand is always something **the engine already produces** (wake a piece of this grain / raise the need's fill past this line / hold the room to this peak), so a contract is never a separate minigame — it is a *named score* on the engine you are already running.

**The two-filter lantern** (`two-filter-lantern-sizing` / `the-lantern-dark`) is the escalating-contract generator, and the mechanical fulcrum of the loop:
- **Filter 1 — TIER, fired to peak-Standing-this-run, over a rising seasonal floor.** The *size* of what the lantern hangs is matched to the brightest the road has heard you be (read from your gleam's **grain**), **hung above the weather's own minimum for the season** (the season-seep floor, above) — so the lantern sizes up whether you reached for it (peak fires higher) or merely walked into autumn (the floor rises under you). This reading is **fired: one-way, it never falls.** *The size of the asking is the compliment, and the compliment is permanent.*
- **Filter 2 — OFFERS, gated by current Standing.** Which sized offers are actually *lit and offerable tonight* is gated by your **present** gleam. A dimming maker watches offers **descend the ladder** — the failure spiral telegraphs in the lantern itself, before any menu, while the great fired reading waits overhead, unlowered.
- **Preview law:** exactly one tier above tonight's showing hangs as a **warm silhouette** in the low rafters. All locked / out-of-tier content is warm silhouette — never greyed-out, padlocked, or cold black.

**Work → the season clock.** A carried asking is worked in a performance (§2), but it is also on a clock: **carried past its season it goes stale** → the world's regard withdraws and **Standing dims** (the spilling, §4). This is the lawful cost of over-committing your pack. *Count/pace axis (I-022):* unanswered askings in a region **age into the spiral together** — clearing five small ones late is the same rising weather as one large one, so the Untold's tonnage-light escalation reads as genuine pressure. (Numeric proof deferred to game-architect per D-005.3.)

**Fulfill → the glad-load.** Fulfilling pays **`the-glad-load`** (`contract-payoff-bundle`), scaled directly off the gatepost spiral (rings-in = load-out), paid across **every sub-economy at once**: bright handsels, one taught journey-piece (arriving with that town's name), one shy-material introduction, and map-intel chalked outward. Because a skipped town's spiral compounds (below), *the same single number raises both difficulty and reward* — the loop's central risk dial.

**Escalate — lawful, one-directional, un-declinable.** The base curve is the weather itself; the player-driven ratchets ride on top of it:
0. **The weather (the season-seep floor) — the un-declinable mid-run curve.** The seep runs near-still in winter and *"strongest in late summer and autumn"* (canon), so the world's base arithmetic — the **minimum** a lantern can hang — rises with the year regardless of your peak-Standing or your skips. Late-season lanterns show **bigger minimum needs** because the whole country pales harder in autumn; *"the askings start kettle-sized partly because the world's arithmetic itself starts small,"* and grow because the arithmetic grows. Even a kettle-scale turtle who skips nothing meets inherently larger needs by the Red Walk. This is escalation-is-the-weather (§5): it applies through board-state (the Paling), never touching the gleam meter, and cannot be declined. The ratchets below only add to it.
1. **Being heard of (the player-driven ratchet).** Answering brightly raises peak-Standing → Filter 1 fires larger → next lanterns size up *above the weather floor.* Rumor does not un-travel.
2. **`the-spiral-clock`** — the Paling's arithmetic (`paling-clock` / `paling-arithmetic-compounding`): a skipped need chalks **one spiral ring per season** (deterministic, legible: **3 = a plea, 5 = a poem, 7 = a great asking being born**). Skip a three-ring town and you know exactly what five rings will ask *and* give. Route strategy is almanac-reading; the Paling attacks board-state and route **only — never the Standing meter.**
3. **The boss tier — the combing** (`combing-boss-tier`): when a region's summed spiral-count crosses threshold, the crossed regard combs the loose wash into a **great asking** — a re-making of a world-scale system, keyed to the brightest grain the country has heard of, telegraphed seasons ahead by converging seams. *The boss is always weather the player routed.*

### 4. Standing (gleam) — how it moves, what it gates, the fail-state

Traces: `gleam-standing`; `overkill-to-standing`; `grain-tagged-standing`; `spill-boons`; `delayed-tellings`; `quiet-walk-runend-meta`; `diegetic-standing-readout`.

Standing **is gleam** — the world's trust worn as a key-light behind the shoulder; felt as *warmth*, not a hit-point bar. Its whole behaviour derives from one mechanism (`gleam-runoff`, *"a full cup runs to the pourer"*): gleam is overflow that runs backward along the line of cause to the maker and clings, and **it lasts exactly as long as the world holds the deed in mind.**

**How it RISES:** overflow in performance (full rate, §2.5, the big swings); glad palms (doorstep askings, gifts, laughter — kettle-scale); and **delayed tellings** (`delayed-tellings` / `the-walking-light`) — distant delight walks the road-graph one fireside a night, source-stamped, landing only when *seen* landing. Nothing fires off-screen.

**How it FALLS — the spilling** (`spill-boons`): an **unmoved room** (a performance that never crosses a waking-mark) or an **asking carried past its season** withdraws regard all at once; the slackened gleam slides off where you stand and re-colors the node as small ambient **boons** — worth *less* than the gleam it cost, claimable only by later visitors and future runs, never the spiller. Loss is lawful compost; a deliberate flop is always EV-negative (binding L4 #1).

**What it GATES (soft — "warmth, not a bar"):** which askings the lantern shows (Filter 2); the shy-material market (widens as gleam rises, narrows to apprentice-tier at the bottom); prices (the glad-price read); and **build identity via grain** (`grain-tagged-standing`) — Standing is a *tagged* resource, so the kinds of delight that earned it gate *which* askings size up and *which* materials answer, giving builds identity with no class menu.

**What it NEVER interacts with:** the Paling. Board-state pressure can never touch the gleam meter; players always know which losses are the world's weather and which are their own.

**The readout** (`diegetic-standing-readout`, the shoulder-candle): no HUD bar. Standing is the maker portrait's key light, quantized into legible showing-height / market-width bands; dusk is the "check your Standing" beat; grain-texture is the build-identity readout; a tally-chalk overlay gives exact steps.

**The fail-state — `gleam-gone-quiet` / the Quiet Walk** (`quiet-walk-runend-meta`): at **Standing-zero** the engine goes quiet — all but the apprentice materials refuse the hands — and the run ends into the **Quiet Walk**, a brief playable reverse-light epilogue, fed and warmed and asked for nothing. **Not death — the world going shy.** One woken work persists into the meta-layer as a permanent audience-thing / starting boon. The Quiet Walk keeps no calendar — it can trigger in any season.

### 5. Why the spine's tension is *live* — the weather escalates, growth costs risk (synthesizer additions)

The critic panel's blocking finding: as drafted, both proposals let a **flat/turtle run** trivialize *both* halves of D-001 — escalation was opt-in (peak only rose on voluntary overflow) and Standing was only ever lost on unforced errors. **The canon-legal resolution installs no ambient decay** — canon is explicit that *"a working maker's gleam moves only as work delights or disappoints"* and *"no one has ever dimmed by walking quietly for a season"* (the ambient forgetting *"thins across lifetimes, never within a season's walking"*; the non-diegetic note: *"within-run Standing moves on outcomes only"*). Instead the two halves are **locked together by the weather**: the season forces you to reach, and reaching is where Standing goes at risk — all through outcomes, never upkeep.

- **Escalation is the weather (un-declinable, board-based).** The seep is *"strongest in late summer and autumn... near-still in deep winter"* (canon), and the Paling runs *"its patient arithmetic on anything skipped."* Because the seep-rate itself rises through the year, the **minimum need a lantern can hang rises with the season regardless of peak-Standing or skip-choices** — the whole country pales harder in autumn, so late-season lanterns show bigger minimum needs even to a kettle-scale turtle who skips nothing (§3, escalate-0). Skip-arithmetic and the fired peak-tier ratchet *on top* of this floor; they no longer carry escalation alone. The year escalates whether or not the player does. Escalation is un-declinable because the weather is. Trace: `the-paling` / `paling-clock`, `wander-year-run-frame`.

- **Growth costs risk — the live spend-vs-preserve tension (outcome-only).** Standing never recedes on its own. The tension is this: **to GROW — raise peak-Standing, earn bigger `glad-loads`, and be able to stand the rising crown — a maker must REACH for bigger performances** (aim more of the room at a bigger need, push a capstone past its ceiling for overflow, §2.5). **And reaching RISKS falling short:** a room that never crosses a waking-mark, or a need left under-filled past its season, is **the spilling** (§4) — a canon-legal, outcome-based Standing *loss*. So the two options are genuinely opposed:
  - **Play small and safe:** costs no Standing, but yields **no growth** — peak never climbs, glad-loads stay kettle-sized, the crown stays un-standable. And because the weather's minimum needs keep rising, a static small engine is steadily *out-grown by the year.*
  - **Reach big:** grows you (peak rises, materials widen, the crown becomes standable), but puts **current Standing genuinely at risk** on every reach that falls short.
  **The turtle-dodge is closed by win-domination, not by a decay meter.** Be exact about *how*, because the naive interlock has a hole: an asking can only *go stale* once it has been **accepted** (`accept-by-hand`), so a maker who simply never accepts the big late-season lanterns spills nothing — declining is not the spilling, and skipping only feeds the board-side `the-spiral-clock`/`combing`, which by canon **never touch the gleam meter.** So a pure never-accept, never-reach turtle genuinely risks *no* Standing all year. What closes it is the **win gate (§6), not forced Standing loss:** to *win* you must stand the year's calendar-floored crown, and standing it requires having **grown = reached = risked Standing.** The static small engine keeps Standing perfectly safe but is steadily out-grown by the rising weather — its peak never climbs, the crown stays **un-standable**, and its meta-reward is **strictly dominated** by an engaged run (§6). Therefore: Standing is live and at-risk for *any* play that reaches for the win; opting out of the risk means opting out of winning (and drifting to a non-triumphant first-still-dawn), with **no ambient upkeep required.** And **courting materials never spends gleam** — gleam *gates* the shy-material market, *"a key that turns, never a coin that leaves"* (canon). Trace: `gleam-standing`, `spill-boons`, `the-paling`, `winter-telling-victory`.

- **`the-rising-crown` (the calendar-floored finale, on top of the curve).** The year-end crown's **tier has a floor set by the calendar** (the season reached), independent of route: the out-breath authors a minimum finale on top of the mid-run weather curve above. A crown is still located and topped-up by the player's own skip-arithmetic (`crown-finale-scheduling`), but **its floor rises with the year regardless of how you played** — so even an all-turtle engine faces a year-end great asking it must have *grown* (i.e. reached, and risked) to answer. It is no longer the *only* mid-run escalator; it is the finale the whole rising curve was climbing toward. Trace: `crown-finale-scheduling`, `wander-year-run-frame`.

**Diminishing returns (closing the snowball / bank-then-dump):** the compounding audience and overkill are soft-capped so the aggressive extreme is bounded too.
- **`the-gathered-room` is soft-capped** ("a listening span, loops not a number" — as the handsel purse is): each woken audience-thing's contribution to the pool decays as the room grows, so the personal room-floor **plateaus** rather than running away.
- **`full-cup-overflow` has diminishing returns past a band** (*"a full cup runs over, but the floor only drinks so fast"*): a single mega-dump cannot trivialize the meter, while the on-stage swing stays the biggest in the game as flavor.
- **Banking is bounded by node-locality:** `the-returning-table`'s RETURN share seeps to **this node's** local table and returns only if you are here tomorrow — surplus **cannot be caravanned** to a Fair; and the capstone multiplier is bounded by the room's current pool. The hoard-then-dump line has a ceiling.

### 6. Win condition — stand the crown, tell the year

Traces: `crown-finale-scheduling`; `combing-boss-tier`; `winter-telling-victory`.

**Exactly two run-ends, one bright:**
- **Standing-zero, any season → the Quiet Walk** (§4): a survivable, meta-seeding dimming, not a game-over screen.
- **The calendar reaches the first still dawn:** triumphant **only if the maker is still lit AND has stood their crown.**

**The crown** (`the-rising-crown`, §5) is the year's guaranteed finale — located where the player's own skip-arithmetic converges, floored by the calendar, telegraphed for seasons by converging spirals. Every completed year gets a crown of *some* tier (a great asking before the gathered bench, a five-ring poem before dawn-watchers, or the Fair's last ground), and **standing it is a boss-tier performance** (§2 at maximum scale) that demands the whole engine the run built; the ways gather round the chosen hands as legible boss-modifiers (`red-thread-days`).

**Victory — the winter-telling** (`winter-telling-victory`): still lit at the first still dawn with the crown stood, the maker winters at one fire as the honored teller. A playable epilogue: choose the **wintering fire** (porch / town / waymeet — each seeds a different meta-reward), then the **one bead that goes on walking** (the run's single persistent gift). The **year-string** is the run-history UI, read bead by bead. New-game-plus is framed as **the next verse** — *you never finish a Round; you hand it on mid-song.*

**Meta rewards scale with the tier reached (closing the low-engagement farm).** Every persistent gift — the walking bead, the wintering-fire seed, and the woken work a Quiet Walk leaves behind (§4) — is **sized to the highest tier the run actually engaged** (peak-Standing reached / crown tier stood). A deliberately tiny, low-engagement run therefore hands on a strictly smaller inheritance than a run that reached; **low-engagement runs are strictly dominated**, so there is no cross-run farming dodge in which a player min-engages many quick runs to out-earn one committed year. Growth is rewarded across runs the same way it is within one: by how far you reached.

### 7. Worked example — one morning at a five-ring pale town in the Deep Gold

1. **Dawn.** The node is pale (five rings), so the local-table draw is **large** — a rich pool + flat base + yesterday's node-local surplus. Even were this a thin town, the flat base alone guarantees enough to wake the cheapest piece, and a **doorstep-asking** is always a lawful low-room fallback — *no decision-free turn.* Draw five journey-pieces. *(dawn-income, conservation, thin-room floor.)*
2. **The room gathers.** Town crowd + two woken audience-things you own set the **pool**; the room is soft-capped, so a third would add less than the first. *(the-gathered-room.)*
3. **Build the chain.** Two cheap joinery plays keep the room with you, holding the pool high. Your third play rests attention past a glaze piece's **waking-mark** — it **wakes**, takes its gold edge, fires to your run-deck, joins the room, and pays woken delight into the need's fill. *(work-chain, the-waking-mark.)*
4. **Safe fill or gamble the overflow.** The fill is two-thirds done. You aim the room's remaining pool as a **multiplier** on a capstone song piece (bounded by the pool — no cross-turn caravan).
5. **The full cup — the reach pays off.** The capstone overfills both piece and need; the **overkill converts to Standing at full rate** (diminishing past a band) — light surging up the working-edge into your knuckles. Peak-Standing rises → Filter 1 will fire larger next lantern. *This is the reach that grows you* (§5): had the capstone fallen short of its mark instead, the room would have gone unmoved and the reach would have **spilled** Standing — the outcome-only risk that makes growth cost something. *(full-cup-overflow, two-filter-lantern, the spilling.)*
6. **Fulfill & fire.** The fill completes; the well is re-made; **the square re-colors now** (not before); the glad-load pays across money, deck, materials, and map-intel, scaled to five rings. At the hearth you **tell** one event (the house wakes around it), surplus seeps to *this* table for tomorrow, and a telling of today's re-making walks the road toward the towns ahead. *(the-glad-load, delayed-tellings.)*

Every step is predictable from the three laws (§0) and the element names alone — the L1 intuitiveness gate.

### 8. Named core-loop design elements

| id | one-line mechanic | traces to (WORLD.md element / ledger id) |
|---|---|---|
| **`the-worked-morning`** | The turn: dawn issues attention income (guaranteed-floored base + local-table draw + node-local returned surplus), you work one node, close at a fire; only *worked* mornings are turns, travel folds. | `the-wander-year` / `wander-year-run-frame`; `the-unclaimed-morning` / `dawn-income`; `doorstep-micro-contracts` |
| **`the-gathered-room`** | The turn's attention **pool** = morning-draw + the woken audience present; an unbroken chain holds it high, a stall cools it (budget-and-momentum in tension); **soft-capped** so the compounding audience plateaus. | `audience-of-things` / `attention-engine` |
| **`the-waking-mark`** | Each card's own **fixed** threshold: rest attention at or above it and the card **wakes** — gold edge, fired to the run-deck permanently, joins the room; below its mark it stays inert & paling-prone. *Things wake when watched.* | `waking-of-made-things` / `waking-threshold-play`; `the-held-and-the-fired` / `fired-vs-held` |
| **`the-returning-table`** | An attended play's attention splits with none lost: **SET** into the card (waking) + **RETURN** to *this* node's local table (surplus returns tomorrow; node-bound, no caravanning). Node re-colors **only on fulfillment**, never per-play. | `the-round-of-light` / `attention-conservation` |
| **`full-cup-overflow`** | Attention poured **past a card's ceiling** (overkill) converts to Standing at full rate — the biggest gleam swings, on stage — with diminishing returns past a band so one mega-dump can't trivialize the meter. | `gleam-runoff` / `overkill-to-standing` |
| **`the-reach`** | **The spend-vs-preserve interlock (outcome-only):** growing (peak, glad-loads, a standable crown) requires reaching for bigger performances; a reach that falls short — unmoved room / need under-filled past its season — **spills** Standing (§4). Safe play risks nothing but is out-grown by the rising weather; no ambient decay, no gleam spent to court. | `makers-gleam` / `gleam-standing`; `spill-boons`; `the-paling` |
| **`play-is-the-only-gate`** | Node color, Standing, and card wakefulness never convert directly; every transfer passes through a played card — the act of play is the world's one exchange gate, and there is no bypass. | `the-three-settlings` / `play-as-exchange-gate` |
| **`the-two-filter-lantern`** | Asking **TIER** fired to peak-Standing (never falls); **OFFERS** gated by current Standing (the failure spiral descends the ladder); next tier previews as a warm rafter-silhouette. | `need-takes-aim` / `two-filter-lantern-sizing`; `the-lantern-dark` / `contract-preview-ui` |
| **`accept-by-hand`** | Taking the crafted asking-object commits it to the pack as a held contract that **warms as its season shortens**; carried past its season it goes stale → Standing dims. Unanswered askings in a region age into the spiral together (count/pace, I-022). | `the-askings` / `escalating-contracts` |
| **`the-glad-load`** | Fulfillment reward scales off the gatepost spiral (rings-in = load-out) and pays across **all** sub-economies at once — handsels, one taught card, one material introduction, map-intel chalked outward. | `the-glad-load` / `contract-payoff-bundle` |
| **`the-spiral-clock`** | The Paling compounds skipped needs deterministically (one chalked ring per season; 3 = plea, 5 = poem, 7 = great-asking-born) and attacks board-state & route **only** — never the Standing meter. | `the-paling` / `paling-clock`; `the-paling-arithmetic` / `paling-arithmetic-compounding` |
| **`escalation-is-the-weather`** | **Forcing function (mid-run curve):** the seasonal seep rises through the year (near-still in winter → strongest in autumn), so the **minimum need a lantern hangs rises with the season regardless of peak-Standing or skip** — even a kettle-scale turtle meets bigger late-season needs. Board-state only; never touches the gleam meter. | `the-paling` / `paling-clock`; `the-paling-arithmetic` / `paling-arithmetic-compounding`; `wander-year-run-frame` |
| **`the-rising-crown`** | **Forcing function (finale) + win:** the year-end crown's tier has a **calendar floor** independent of route (the out-breath authors a minimum finale) *on top of* the mid-run weather curve, topped by the player's skip-arithmetic; standing it while still lit gates the winter-telling. | `the-crown-of-the-year` / `crown-finale-scheduling`; `wander-year-run-frame` |
| **`gleam-gone-quiet`** | Standing-zero ends the run into the **Quiet Walk** — a playable reverse-light epilogue that seeds the meta-layer with one woken work; a dimming, not a death; keeps no calendar. | `the-quiet-walk` / `quiet-walk-runend-meta`; `makers-gleam` / `gleam-standing` |

### 9. Spine & canon verification

- **D-001 · escalating contracts.** `escalation-is-the-weather` (the seasonal-seep floor — the un-declinable **mid-run** curve, bigger minimum needs by autumn regardless of peak/skip) is the base; on top ride `the-two-filter-lantern` (fired peak-tier ratchet) + `the-spiral-clock` (Paling compounding) + `accept-by-hand` (season deadline) + `the-rising-crown` (calendar-floored finale). One-directional, lawful, and **un-declinable because the year escalates on its own** — the flat-run is closed by the weather, not by opt-in overflow. ✔
- **D-001 · depletable Standing fail-resource.** Rises via `full-cup-overflow` + tellings; **genuinely at-risk in competent play via `the-reach`** — growth demands reaching, and a reach that falls short **spills** Standing (`spill-boons`, §4), an outcome-only loss. Gates soft benefits; zero → `gleam-gone-quiet`. **Canon-legal:** no ambient/within-run decay (*"a working maker's gleam moves only as work delights or disappoints"*; *"no one has ever dimmed by walking quietly for a season"*); the spend-vs-preserve tension is carried entirely by outcomes and the rising weather, not by upkeep. ✔
- **D-001 · roguelike economy deckbuilder.** Deck = journey-pieces; `play-is-the-only-gate` makes play the only door between the three settlings, so it is structurally a deckbuilder; the wander-year loop-with-home-note is the roguelike run. ✔
- **Degenerate-line panel (P1×2, P2, P3) resolved — canon-legally.** *Escalation half:* closed by the weather — the rising seasonal seep (`escalation-is-the-weather`) lifts minimum needs regardless of peak/skip, and the calendar advances by **season-time (worked mornings)**, so a camp-in-place player still burns the year and faces the rising curve + crown (§1); no forcing function is travel-keyed. *Standing half:* closed by the **win gate, not by ambient decay or a forced per-lantern spill.** Be exact: declining an *unaccepted* asking spills nothing (staleness needs `accept-by-hand`), and skipping only feeds the board-side spiral, which never touches gleam — so a pure never-accept/never-reach turtle risks no Standing at all. It is closed because it **cannot win:** without reaching (= risking Standing) its peak never climbs, the calendar-floored crown stays **un-standable**, and its meta-reward is **strictly dominated** by an engaged run (§6). Standing is live and at-risk for any play that reaches for the win; opting out means forfeiting the win, not evading a mechanic (§5). Diminishing returns on the compounding room and on overkill; banking bounded by node-locality (`the-returning-table`); thin-room per-turn agency floor (`the-worked-morning`). ✔
- **Intuitiveness panel (A-1 P1, ambiguity P2×3, naming P3) resolved.** Adopted the canon-faithful engine (`WORLD.md#audience-of-things`: chain holds the **pool**, per-card **fixed** thresholds) — building a chain unambiguously makes waking *easier*, effect = metaphor. Three quantities given distinct names (**the room / the waking-mark / the need's fill**), single spend-model (multiplier). Node re-colors on **fulfillment only** (not per-play). Overflow → Standing only on **overkill**, not "always three ways." Named `full-cup-overflow`, not "overkill-to-gleam." ✔
- **D-002 wonder / D-003 do-not-resemble / grammar of light / conservation.** Every mechanic worn as the world's own physics (light, weather, warmth); no debt/obligation cosmology, no courts, no paperwork; Paling touches board only; nothing noticed away. ✔

**No spine conflict found (no P0).** The canon was already the spine's own physics; this loop only concretizes it and installs the missing forcing functions the critics required.

---

## Layer 2 — Resource Types

**Gate:** `system_count ≥ 4` (≥4 interacting systems that transform/feed/sink into each other) · `napkin_flags ≤ 0` (executable: no dominant resource, on-curve clearable, no degenerate loop) · `intuitiveness ≥ 0.8` (every resource legible from its name + the world's logic). DEEP + INTUITIVE; every resource traces to a WORLD.md/ledger id; no debt/fee/wage currency; the grammar of light honored (no silent cross-channel conversion — play is the only gate).

**Synthesis basis:** proposal **C** (two-currency / specialization) as the spine — the world-coherence panel ranked it tightest (handsels labelled correctly as the *held signature* of the things-wake channel, materials held as one graded class per *manners-not-tonnage*, the leanest silent-conversion surface). Grafted: **A**'s "each resource is a flow with its own clock" non-substitution argument and its play-gated cross-channel table; **B**'s *harvest → court → wake → weather → seep* naming for the making cycle and its resource-level degenerate closes. All critic P1s resolved (§8).

### 0. The thesis — the resource square (the specialization law)

Canon forbids answering every new pressure with a new token: **"scarcity in Roundelay is manners, not tonnage"** (L4). Depth comes from how *few* resources couple, not how *many* exist. So the whole game runs on **two things you spend** and **two things you never spend but must read**, split on two axes:

| | you **spend** it | you **never spend** it |
|---|---|---|
| **per-turn / tactical** | **Attention** ("the room") — R1 | **the Paling** (season-seep — the weather you route, never pay) — R4 |
| **persistent / strategic** | **Handsels** ("the held" — money) — R2 | **Standing** (gleam — the gate you keep lit, the fail-resource) — R3 |

The tactical/strategic axis keeps the two *spendable* currencies from ever overlapping (attention cannot be banked; handsels cannot be spent inside a turn's working). The spend/never-spend axis keeps the fail-resource and the pressure-resource structurally incapable of being *bought off*. Two more resources are the **substrate the four act on** — the deck (R5) and the courted stock (R6) — and *everything else in the world* (bright-shavings, last-red, red thread, lane-glimmers, introduction-jars, the calendar) is a **tap of one of the four**, deliberately **not** promoted to a currency of its own (§4). That refusal is the design.

**One-sentence mental model (the intuitiveness gate at the resource layer):** *spend the room to wake the work; keep the purse moving; watch your gleam; route the weather.*

Three canon laws make a lean set safe, and are load-bearing throughout: the **grammar of light** (places pale / people gleam / things wake — three channels that never cross), the **one exchange gate** (`play-as-exchange-gate` — node-color, Standing, and card-wakefulness never convert directly; every transfer passes through a played journey-piece), and the **mint ban** (`WORLD.md`:723 — *the gloaming-table mints nothing and loses nothing*).

### 1. The resource-type list

Each: **role · source · sink · trace · grammar-of-light channel.** *Different clock per resource* (A's graft) is why none can substitute for another: attention runs on the **dawn**, handsels on the **rest**, courted stock on the **season**, the room on the **occasion**, the Paling/calendar on the **run**.

#### The primary four (the lean set)

**R1 · Attention — "the room" · TACTICAL CURRENCY (per-turn).**
- **Role:** the only resource spent *inside* a worked morning — budget and momentum at once, spent as a multiplier on a play, sustained by an unbroken work-chain, sagging on a stall (LOCKED, L1 §2).
- **Source:** the dawn — flat guaranteed base **+** local-table draw (paler node = richer dawn) **+** yesterday's node-local returned surplus; the pool is raised by **being worth watching** (woken audience-things, townsfolk, venue), never traded for.
- **Sink:** each attended play *splits with nothing lost* — a **SET** share works the piece (waking), a **RETURN** share seeps to *this* node's local table for tomorrow's dawn (node-bound, no caravanning); **overkill** past a card's ceiling converts to Standing at full rate. `the-shavings-share` (§4) is a bound sub-portion of the RETURN, not a new share.
- **Trace:** `attention-engine`/`audience-of-things`; `the-gathered-room`; `dawn-income`/`the-unclaimed-morning`; `the-returning-table`/`attention-conservation`; `full-cup-overflow`/`overkill-to-standing`. L1 §2. L4 S1/S2.
- **Channel:** **the current** — *none* of the three channels. Canon is explicit: *"the current cannot be traded… no stall, no jar, no substitute"* (L4). Attention made visible **is** light — the medium the three channels are read *in*, the quiet floor. This is *why* it is the tactical currency and *why* it cannot be banked.

**R2 · Handsels — "the held" · STRATEGIC CURRENCY (between-turns).**
- **Role:** the money; the wealth layer that lives *between* turns, never inside one. A handsel's worth *is how awake it is* (denominations dull / warm / **singing**, not counts). Wealth is a juggling, never a pile — *"what stops moving, dims."*
- **Source:** whittled from **apprentice-stuffs** (anyone can make money) and from **`the-shavings-share`** (the bound sub-portion of the bench's RETURN — §4); brightened only by **circulation** through the `glad-price`, the `glad-load`, the `waymeet-table`, hearth-gifts.
- **Sink:** spent **into delight** — buying **introduction-jars, taught pieces, apprentice-stuffs, and hearth-goods** (bread/wax/wool), and `waymeet-table` swaps — change returns a shade brighter; **or** idle-lapse: a boxed/idle handsel dims → its light seeps to the gloaming-table → returns as tomorrow's **dawn income** (R1). *The money's only sink is the world's only income* (closed, mint-clean). **Handsels never buy proud/courted materials** — those are courted, never purchased (§3, the P1 fix). **No debt, no fee, no wage.**
- **Trace:** `handsels`/`handsel-currency-decay`; `the-open-purse`; `the-glad-price`/`glad-price-read`; `bright-shavings-byproduct`; `the-waymeet-table`. L4 S3.
- **Channel:** **things wake** — the **held signature** (a full-surface *breathing* sheen, four-to-six-second breath, brightening under a glad hand; `the-two-golds`). A handsel is a small woken *thing*; **held waking IS waking** — one gold channel, two signatures (held sheen vs the fired edge of R5), never a fourth "held-light" channel.

**R3 · Standing (gleam) — the GATE + FAIL-RESOURCE (never spent).**
- **Role:** the depletable regard that ends the run at zero (`gleam-gone-quiet` → the Quiet Walk); worn as a key-light behind the maker's shoulder — *warmth, not a hit-point bar*. Gates soft benefits but is **never spent** — *"a key that turns, never a coin that leaves."*
- **Source:** **overflow** in performance (`full-cup-overflow`, full rate — the big on-stage swings) + **glad palms** (doorstep askings, gifts) + **delayed tellings** walking the road-graph one fireside a night, crediting only when *seen* landing (`the-walking-light`). Nothing fires off-screen.
- **Sink:** **none by spending.** It *falls* only through **the spilling** — an unmoved room or an asking carried past its season withdraws regard, which re-colors the node as `lane-glimmers` worth *less* than it cost (outcome-only; a deliberate flop is EV-negative). No ambient within-verse decay. Zero → the Quiet Walk.
- **Gates (soft):** Filter-2 lantern offers; the courted-stock market width (opens the vouching); the `glad-price` read; and **build identity via grain** (`grain-tagged-standing` — a *tagged* resource: *which kinds* of delight earned it decide *which* materials answer and *which* askings size up — archetype with no class menu).
- **Never interacts with:** the Paling. Board pressure can never touch the gleam meter.
- **Trace:** `gleam-standing`/`makers-gleam`; `overkill-to-standing`; `grain-tagged-standing`; `spill-boons`/`lane-glimmers`; `delayed-tellings`/`the-walking-light`; `diegetic-standing-readout`/the shoulder-candle; `quiet-walk-runend-meta`. L4 S2 (source), S4 (gate), S5 (loss).
- **Channel:** **people gleam** — the maker's key-light, *only* on the maker (and any living person who themselves caused a delight). **A watching crowd does not wear gleam** — watchers are a source of the *current* (R1), the medium, not gleam-bearers. No HUD bar; quantized into showing-height / market-width bands.

**R4 · The Paling (season-seep) — BOARD PRESSURE (never paid).**
- **Role:** the run's escalation worn as weather — a *rate* that rises with the year (near-still in winter → strongest in late summer and autumn) and compounds on anything skipped. **The escalation clock and the seasonal seep are the same curve.**
- **Source:** the seasonal seep itself — the calendar track (un-buyable master clock), advancing by *worked mornings* (dawns), never travel legs. On the board it accretes as chalked **spiral rings** on skipped nodes (3 = plea, 5 = poem, 7 = a great asking being born).
- **Sink (answered, never *paid*):** answering an asking re-makes the node — the square re-colors, the spiral resets, `the-glad-load` pays out. No currency lowers it; the only lever is **play**. Board-side taps: richer local-table dawns over pale country (→ R1), the `last-red` harvest in the left-behind, the `combing` boss when a region sums to seven.
- **Trace:** `paling-clock`/`the-paling`; `paling-arithmetic-compounding`/`the-spiral-clock`; `escalation-is-the-weather`; `the-glad-load`/`contract-payoff-bundle`; `combing-boss-tier`; `crown-finale-scheduling`/`the-rising-crown`; `wander-year-run-frame`. L4 S6.
- **Channel:** **places pale** — board-state only (nodes, resources, routes). *Never* touches the Standing meter, so the player always knows which losses are the world's weather.

#### The two substrate resources (what the currencies act *on* — engines, not currencies)

**R5 · Journey-pieces — the deck (the engine you build).**
- **Role:** the deckbuilder substrate — craft-fragments in craft-discipline suits (song, joinery, glaze, thread, dough, dance). Not fungible, not a currency; the *thing attention wakes.* A woken piece fires to the run-deck permanently (`fired-vs-held`, the fired never unfires) and joins the room as a new audience-thing.
- **Source (acquired, never "bought with a coin count"):** taught at fulfilled askings (`glad-load`, arriving with the town's name), gifted, traded, won, `waymeet-table` swaps, walking-with-masters. Crafted at the bench from R6.
- **Sink:** played (the exchange gate); exhausted / given away / performed to destruction; retired by last-lighting into `the-twice-benched` stock (→ R6).
- **Trace:** `journey-pieces-deck`; `waking-threshold-play`/`the-waking-mark`; `fired-vs-held`; `walking-ways-cardpools`; `deck-autobiography`. L1 §2.
- **Channel:** **things wake** — the **fired signature** (one crisp gold *working-edge*, blooming once at firing then the stillest thing in the frame; `the-two-golds`).

**R6 · Courted stock — materials, ONE graded resource class (not N currencies).**
- **Role:** the inputs the bench works into pieces. Held as **one resource type with a quality/temperament axis** — *not a wallet per material* (the anti-bloat move; B's seven materials folded into one class per *manners-not-tonnage*). Grades: apprentice-stuffs (floor, zero-gate) → singing-silver, laughing-riverwood, festival-glass → local characters (bell-bronze, hearth-slate) → twice-benched.
- **Source (courted, never purchased):** the two-gate **courting** — first **the vouching** (a *gleam gate*: will the stuff state its terms to hands the world holds in mind — R3's business, *no coin's*), then **the terms** (a *performable* micro-condition: song sung, chain unbroken, room laughing, crowd held, dusk kept). `introduction-jars` collapse a courtship into a gift. Apprentice-stuffs bypass the vouching (the comeback path).
- **Sink:** worked into pieces at the bench (→ R5), the bench's RETURN throwing off `the-shavings-share` (→ R2); **reverts to ordinary** if not kept warm within a season (inventory-as-garden — freshness in place of weight limits). An *accepted term* is itself an asking that can go stale → the spilling (→ R3 loss).
- **Trace:** `two-gate-courting`/`shy-materials`; `apprentice-floor-materials`; `graded-material-market`; `introduction-jars-freshness`; `the-twice-benched`. L4 S4.
- **Channel:** **the loose** (the raw wash of where it lay) → becomes **things wake** once benched *by a play*. Crucially: courting is **gleam-*gated* but gleam is never *spent* to court** — the gate turns, no coin leaves.

### 2. The systems map — four coupled systems on the Breath substrate

Every arrow reads `X transforms / feeds / sinks into Y`; each traces to an L4 system (S1–S6). Depth comes from **coupling**, not token-count — the four systems are distinct engines that interact densely because the four resources couple through the one exchange gate.

> **Substrate law — S1 · The Breath (the master conservation loop all four drink from, `WORLD.md`:665):**
> `gloaming-table → dawn (R1 attention) → the bench → { SET into pieces (R5) | overflow to gleam (R3) | RETURN loose to the room } → wash on places → paling seep (R4) → gloaming-table → tomorrow's dawn.` *Nothing exits it; nothing is minted.* The four systems below are taps and tributaries of this one circulation.

**System A · The Bench Engine** — attention → pieces → gleam + handsel-fuel. *(harvest → court → wake → weather → seep, B's graft.)*
`R1 attention` (+ the gathered room) **spent through play** → `R5 pieces` woken (deck grows, fired) → delight given → **overflow → `R3 Standing`** (the big on-stage swings) **AND** the bench's RETURN settles thickest on the leavings → **`the-shavings-share` → feeds `R2 handsels`**. Unspent attention **RETURNS** to the node's local table → tomorrow's dawn (→ R1).
- *Interacts with:* **B** (its RETURN-leavings are B's premium faucet), **C** (consumes the materials C gates, returns leavings to it), **D** (its overflow raises the next lantern's tier; the glad-load refills it).
- *Trace:* L4 S2; `attention-engine`, `waking-threshold-play`, `overkill-to-standing`, `bright-shavings-byproduct`, `the-returning-table`.

**System B · The Handsel Round** — handsels ⇄ trade; idle → dawn (closed loop).
`R2 handsels` **spent** at the `glad-price` → **introduction-jars / taught pieces / apprentice-stuffs / hearth-goods / `waymeet-table` swaps** → change returns brighter. Idle handsels **lapse** → gloaming-table → **return as `R1` dawn income.** Faucet: apprentice-stuffs + `the-shavings-share` from System A.
- *Interacts with:* **A** (its faucet is A's RETURN-leavings; its lapse is A's fuel), **C** (buys the *jars and apprentice-stuffs* that feed C — never the proud stock itself), **D** (the glad-load pays fresh bright handsels in).
- *Trace:* L4 S3; `handsel-currency-decay`, `the-glad-price`, `the-open-purse`, `the-waymeet-table`. **Closed & mint-clean:** *the money's only sink is the world's only income.*

**System C · The Courting Web** — gleam gates materials; materials feed the bench.
`R3 Standing` (**gate, never spent**) opens **the vouching** → `R6 courted stock` states its **terms** → **the maker performs the term** (a play) → stock into the pack → **fed to the bench (System A)** → leavings return as `the-shavings-share` (→ System B). Handsels buy only the *jars and apprentice-stuffs*, never do the vouching's job. A courting-term accepted can go stale → the spilling (→ System D's compost, and an `R3` loss).
- *Interacts with:* **A** (supplies its inputs, receives its leavings), **B** (handsels buy the *jars/apprentice-stock* that stock it; gleam vouches and the maker performs the term), **D** (grain from R3 decides which materials the country answers with; the glad-load delivers introduction-jars).
- *Trace:* L4 S4; `two-gate-courting`, `grain-tagged-standing`, `graded-material-market`, `introduction-jars-freshness`.

**System D · The Paling Market** — pressure → bigger askings + richer dawns; answer pays every system.
`R4 Paling` compounds on skipped nodes (`the-spiral-clock`) → **bigger askings + richer local-table dawns (→ `R1`)** + last-red abundance in the left-behind. Answering an asking → node re-colors (R4 resets) + **`the-glad-load` pays across *every* system at once:** bright handsels (→ B), one taught piece (→ A/R5), one introduction-jar (→ C/R6), map-intel chalked outward — **plus overflow gleam raises the next sizing (→ A/R3).** Seven rings → the `combing` → a great asking → the largest overflow event in the game.
- *Interacts with:* **all three** — it pumps R1 (A's fuel), and one fulfillment pays B, C, *and* A at once. This is the system that *couples the other three into one number* (rings-in = load-out).
- *Trace:* L4 S6; `paling-arithmetic-compounding`, `the-glad-load`, `combing-boss-tier`, `pale-route-harvest`, `crown-finale-scheduling`.

**System count: 4** (A Bench, B Handsel Round, C Courting Web, D Paling Market), each an independent engine, each pairwise-coupled to every other, all riding the S1 Breath conservation substrate — gate `system_count ≥ 4` **met.** (The compost tap — spilling → lane-glimmers, retirement → twice-benched — is folded into C/D's sinks rather than inflated into a fifth headline system; read as System E, the interactions only densify.)

```
                S1 · THE BREATH  (conservation substrate — mint-ban: mints/loses nothing)
   ┌────────────────────────────────────────────────────────────────────────────┐
   │  gloaming-table → dawn(R1) → bench → { SET→R5 | overflow→R3 | RETURN loose } │
   │        ↑ wash → paling seep(R4) ← places ←──────────────────────────────────┘ │
   └────────────────────────────────────────────────────────────────────────────┘
      R1 attention ──play──► R5 pieces ──overflow──► R3 gleam
 (A) BENCH  │                                        │ gates (no spend)
            └─RETURN-leavings─► the-shavings-share ─► R2 handsels
 (B) HANDSEL ROUND   R2 ──glad-price──► jars/taught/apprentice/hearth-goods ─► stocks C
                     R2 idle-lapse ──► dawn (R1)                    ▲
 (C) COURTING WEB    R3 gleam ─vouch(gate)─► R6 stock ─term performed─► bench(A) ─► R5
                     R6 bench-leavings ─► the-shavings-share ─► R2
 (D) PALING MARKET   R4 rings ─► bigger askings + richer dawns(R1) + last-red
                     answer ─► glad-load ─► {handsels→B, piece→A, jar→C, intel} + overflow→R3
```

### 3. Grammar of light per resource + the one exchange gate

Three channels that never cross — **places pale · people gleam · things wake** — plus **the current** (attention, the medium they are read *in*, not a fourth channel). Every cross-channel transfer passes through **a played journey-piece**; there is **no silent conversion anywhere.**

| Resource | Channel | Spends? | Cross-channel movement legal *only* through… |
|---|---|---|---|
| R1 **Attention** | **the current** (the medium; none of the three) | yes (tactical) | a **played** piece — attention becomes fired-work or gleam only via play/overkill |
| R2 **Handsels** | **things wake** (held signature — breathing sheen) | yes (strategic) | the **glad-price** — a performed, attended trade *within* the wake channel; a handsel's wakefulness never silently becomes gleam or node-color, and never buys proud stock |
| R3 **Standing** | **people gleam** (maker only) | **never** | **overkill** puts attention→gleam on stage (play); gleam is never *spent* or cleanly *converted* to the board — **the spilling** leaks only a *lossy* residue (most regard destroyed) that composts onto the node as faint lane-glimmers, worth far less than the gleam lost (per L1 §4 / the mint-ban). Gleam *gates* the courting, never *pays* it |
| R4 **the Paling** | **places pale** (board only) | **never paid** | answering an **asking** (play) re-colors the node; nothing else lowers it; never touches the gleam meter |
| R5 **Journey-pieces** | **things wake** (fired signature — gold edge) | played / exhausted | are themselves the exchange gate |
| R6 **Courted stock** | **the loose → things wake** | courted, not spent | the **two-gate courting** (gleam *vouch* + *performed* term) |

**The cross-channel transfers, each play-gated (A's graft, made exhaustive):**
1. **current → people** (attention → gleam): only via **overkill through a played piece** (`full-cup-overflow`). No menu turns attention into gleam; you must *perform* past a ceiling.
2. **loose/current → thing** (material + attention → woken piece): only by **playing it at/above its waking-mark.** A material never wakes on the shelf.
3. **people → the market** (gleam → courting access): gleam **opens the vouching** — it *gates*, it does not convert; gleam is read, never debited. The material still requires a **performed term** (a play) to enter the pack. *"A key that turns, never a coin that leaves."*
4. **thing → places** (woken delight → node re-color): only on **fulfillment** of a need worked by play — never per-play.
5. **held ↔ held** (handsels ↔ jars / taught pieces / apprentice-stuffs / hearth-goods): a *trade within the wake channel* via the `glad-price`, performed under attention (spends the scarce current) — **not** a channel-cross, and **never** a purchase of proud/courted materials.

**Within-medium conservation (not conversion):** attention's RETURN share stays attention (seeps to the local table); **`the-shavings-share` is a bound sub-portion of that RETURN** (held signature, bound by the telling — §4), *carved out, never minted on top*; idle-handsel lapse and the Paling seep return as next-morning attention. **The mint ban holds — no flow creates or destroys regard.**

### 4. What is deliberately NOT a currency (the anti-bloat statement)

A specialization model is defined as much by what it refuses to mint. Each of these is a real world-element demoted to a *tap of one of the four*, never given its own wallet:

| Tempting "currency" | Demoted to | Why not a currency (trace) |
|---|---|---|
| **bright-shavings** | **`the-shavings-share`** — a *bound sub-portion of the bench RETURN* feeding R2 | Canon (`WORLD.md`:590): *"the bench transaction's own third share… the regard that returns loose to the room settles thickest exactly where the work happened."* It is loose RETURN-wash *bound by the telling* into a handsel-already-begun — **carved from the RETURN, not a new share minted on top** (the degenerate-depth P1 fix). One money, two faucets. |
| **last-red / red thread** | a *catalyst / bookmark tap* of R4 (the Paling) | Spent only on **woken re-makings** (slows a node's future paling) and to mind one knack for return — a board-pressure lever, not a spendable stock (`pale-route-harvest`, `red-thread-marker`). Capped: 1 node / 1 knack / 1 season. |
| **lane-glimmers** | an *ambient compost residue* (System C/D sink) | *"A sip, never a cup, and never for the spiller"* — worth well under one Standing point; a seeded pickup, not a held resource (`spill-boons`). |
| **introduction-jars** | a *gift-form of R6 courted stock* | A banked courtship, tradeable for handsels — but it *is* courted stock, not a second material economy (`introduction-jars-freshness`). |
| **materials (silver / riverwood / glass / bell-bronze / hearth-slate / twice-benched)** | grades of the single **R6 courted-stock** class | Held as one resource with a quality/temperament axis, not six wallets — *"scarcity is manners, not tonnage."* |
| **the calendar / crown** | the *source-rate of R4* | Un-buyable master clock; it *is* the seep curve, not a resource you accrue (`wander-year-run-frame`, `the-rising-crown`). |

Result: **two spendable currencies, one gate/fail-resource, one pressure — full stop.** No fifth token, and every world-element still has a mechanical home.

### 5. Anti-degenerate story (`napkin_flags` claimed: 0)

The three canon laws — the **one exchange gate**, the **grammar of light**, the **mint ban** — do the structural work; the lean set makes each check short. *Each resource has a different clock* (dawn / rest / season / occasion / run), so no single accumulation strategy optimizes all four.

**(a) No dominant resource.** The four are *non-substitutable by construction* — each does exactly one job no other can. Attention can't be banked (per-turn; RETURN is node-local, *no caravanning*; overkill diminishes past a band). Handsels can't buy Standing (gleam comes only from overflow/tellings) and can't be spent inside a working, and **can't buy proud/courted stock** (courting is gleam-gated + play-performed) — though they *do* buy the apprentice tier, introduction-jars, taught-pieces, and hearth-goods. Standing can't be spent (gates only) and is *self-balancing* — the two-filter lantern makes high Standing raise the **tier/difficulty** at the same instant it widens the market, so "more gleam" is never strictly better. The Paling can't be paid off with any currency, only answered by play. No single-resource strategy dominates; the run *requires* running all four systems.

**(b) On-curve clearable.** Difficulty and reward ride the **same number** — the gatepost spiral (rings-in = load-out). The weather floor + calendar-floored crown raise the *minimum* need with the season (`escalation-is-the-weather`, `the-rising-crown`); the bench engine's peak-Standing (→ bigger glad-loads, wider market, easier wakings) scales with *engagement*. A reaching maker's output climbs with the weather; a static engine is *out-grown* on schedule (L1 §5) — clearable, and clearable *only by growing*, which closes the turtle dodge via the win-gate, not decay.

**(c) No degenerate loop** — each carried napkin obligation discharged by the lean set:
- **The shavings mint (degenerate-depth P1, closed):** `the-shavings-share` is a **subdivision of the RETURN share bound by the telling**, *not* an additive faucet on top of a complete SET+RETURN(+overkill) split. Claiming a shaving redirects part of the node's own RETURN (which would otherwise seep to its local table for tomorrow's dawn) into the purse — it **competes with the local-table dawn**, creating no new regard. Conservation-clean; the mint ban holds.
- **Glad-price money-printer (obligation #2):** brightening-per-trade is bounded *below* its tempo/attention cost (gladness must be *performed under attention*, spending the scarce current), and the Handsel Round is **closed & mint-clean** — its only sink (idle lapse) is the world's only income, so trading creates no net regard. (Numeric bound → game-loop.)
- **Velocity-hoard / bank-then-dump:** handsels dim if idle (`the-open-purse` slows, never stops); attention can't be caravanned (node-local RETURN); overflow diminishes past a band; the room is soft-capped. No hoard-then-dump line.
- **Deliberate-failure farming (obligation #1):** the spilling yields `lane-glimmers` worth **< one Standing point's marginal value**, claimable **only by later visitors, never the spiller** — a deliberate flop is strictly EV-negative.
- **Paling-harvest snowball (obligations #3, #4):** red thread capped (1 node / 1 knack / 1 season), last-red usable **only on woken re-makings**, gleaning **never triggers on inhabited or answered nodes**, twice-benched keys **only to chosen last-lightings, never failure states** — so **peak-gleam sizing, not paling-farming, carries the pressure curve.** (Numeric proof → game-loop, per D-005.3 / I-022.)
- **Materials-first degenerates pre-closed (B's graft):** *single-material monoculture* — freshness reverts untended stock and a card wakes only at its waking-mark (soft-capped room), so no one cheap material can flood the board; grain rewards focus but multi-way decks are legal, so focus is identity, not a solved loop. *Jar-arbitrage* — jars are earned from the glad-load / Mannerly lending (gated behind actually *answering* needs), never minted; traded jars still cost bounded handsels.
- **Mint-ban backstop:** no flow creates or destroys regard — a stilling's release returns *exactly* the withheld seep, a glimmer returns *exactly* what was spilled less the binding loss. With no net-creation possible, no loop can run positive indefinitely.

**`napkin_flags` claimed: 0** — no dominant resource, on-curve clearable, no degenerate loop; the carried obligations reduce to numeric bounds for game-loop, not structural holes.

### 6. How it serves the LOCKED L1 loop

The four resources **are** the four quantities L1 already names and runs; this layer adds no new player-facing quantity, it only *organizes* them by role:

| L1 named element | Resource | Division of labor it clarifies |
|---|---|---|
| `the-gathered-room`, `the-returning-table`, dawn income | **R1 attention** | the *only* thing spent per turn — the tactical loop stays legible |
| `full-cup-overflow`, `the-reach`, `gleam-gone-quiet` | **R3 Standing** | the *outcome you watch*, never spent — keeps "warmth, not a bar" |
| `the-glad-load` (handsels), the between-legs economy | **R2 handsels** | the *strategic* layer that lives *between* turns, never inside one |
| `escalation-is-the-weather`, `the-spiral-clock`, `the-rising-crown` | **R4 the Paling** | the *weather you route*, never paid — board-only, never touches gleam |
| `journey-pieces-deck`, `two-gate-courting` (acquisition) | **R5 deck / R6 courted stock** | the substrate the currencies act on — the deck is grown, not bought |

Because the two *spendable* currencies are split by timescale (attention = this morning; handsels = this season) and the two *un-spendable* by channel (gleam = you; Paling = the world), the L1 `the-reach` spend-vs-preserve tension lands *entirely* on R3, uncontaminated: no currency can rescue a gleam-poor maker (fail-resource stays a genuine fail-resource), and no board pressure can drain it (the player always knows whose fault a loss is). Consistent with every LOCKED L1 mechanic: attention = the room; gleam = Standing (outcome-only, gates-never-spent); the-returning-table conserves node-locally; handsels = currency; materials courted via two gates; the Paling touches board only.

### 7. Named Layer 2 resource elements

| id | one-line role | traces to |
|---|---|---|
| **`the-resource-square`** | The lean set as a 2×2: two spends (attention/tactical, handsels/strategic) × two never-spends (Standing/gate-fail, the Paling/pressure); everything else is a tap, not a fifth token. | `the-round-of-light`; L4 "manners not tonnage" |
| **`attention` (R1)** | Tactical currency — the current/medium; spent per turn, node-local RETURN, un-bankable. | `attention-engine`; `the-returning-table` |
| **`handsels` (R2)** | Strategic currency — held signature of the wake channel; whittled + shavings-fed, dims idle → dawn; buys jars/pieces/apprentice/hearth-goods, never proud stock. | `handsels`; `the-glad-price`; `the-open-purse` |
| **`gleam` / Standing (R3)** | Gate + fail-resource — people-gleam, maker only; rises on overflow/tellings, falls only via the spilling, never spent. | `gleam-standing`; `overkill-to-standing`; `spill-boons` |
| **`the-paling` (R4)** | Board pressure — places-pale, never paid; the seep = the escalation clock; answered only by play. | `paling-clock`; `escalation-is-the-weather` |
| **`journey-pieces` (R5)** | Deck substrate — fired signature; woken by attention, the exchange gate itself. | `journey-pieces-deck`; `fired-vs-held` |
| **`courted-stock` (R6)** | Materials as ONE graded class (quality/temperament axis, not N wallets); courted via gleam-vouch + performed term, never purchased; reverts if untended. | `two-gate-courting`; `graded-material-market` |
| **`the-shavings-share`** | Bright-shavings as a *bound sub-portion of the bench RETURN* (held signature, bound by the telling) — carved from RETURN, never minted on top; a handsel-already-begun. | `bright-shavings-byproduct`; `attention-conservation` |

### 8. Critic resolutions & verification

- **P1 · handsels-buy-courted-stock (world-coherence, proposal B) — RESOLVED.** Handsel spending is scoped to **introduction-jars, taught pieces, apprentice-stuffs, hearth-goods, and waymeet swaps** (R2 sink; System B). **Proud materials are acquired ONLY through the two gates** — gleam vouching (no coin) + a performed term (R6; §2 System C; §3 transfer #3, #5). A handsel may buy an already-courted *jar*, never do the vouching's job. ✔
- **P1 · bright-shavings minted (degenerate-depth, proposals A/B) — RESOLVED.** Renamed and re-modelled as **`the-shavings-share`**: a subdivision of the RETURN share, bound by the telling, competing with the local-table dawn — **not** an additive faucet on top of a complete split (§4, §5c, `WORLD.md`:590). Conservation-clean; mint ban intact. ✔
- **P2 · grammar-of-light mislabel (world-coherence, proposal A) — RESOLVED.** Handsels are the **held *signature* of the things-wake channel** (`the-two-golds`: held breathing sheen vs fired edge — one gold channel, two signatures), not a fourth "held-light" channel; **held waking IS waking.** Channel count held at **three + the current** (§3). ✔
- **P3 · crowd-gleam (world-coherence, proposal A) — RESOLVED.** Watchers/crowd are a source of the **current** (R1, the medium), **not** gleam-bearers; people-gleam is reserved for the maker (and any living person who caused a delight) (R3 channel note; §3). ✔
- **P3 · seven-material tonnage (world-coherence, proposal B) — RESOLVED.** Materials held as **one graded `courted-stock` class** (R6), per *manners-not-tonnage*. ✔
- **P3 · coin-in-the-courting gloss (world-coherence, proposal C) — RESOLVED.** Interaction wording corrected throughout to **"handsels buy jars / taught-pieces / apprentice-stock; gleam vouches and the maker performs the term"** (§2 System C; §3 transfer #5). ✔
- **Gates:** `system_count ≥ 4` — **4** coupled engines on the Breath substrate (§2) ✔ · `napkin_flags ≤ 0` — **0** (§5) ✔ · `intuitiveness ≥ 0.8` — one-sentence model, every resource legible from name + world logic, no fifth token (§0, §6) ✔ · every resource traces (§1) ✔ · no debt/fee/wage (R2) ✔ · grammar of light honored, play the only gate (§3) ✔.
- **No P0** raised by any critic; the locked spine (D-001) and every LOCKED L1 mechanic are affirmed.

---

## Layer 3 — Effect Vocabulary

**Gate:** `interaction_density ≥ 0.5` (DEPTH — at least half the primitives operate on shared/persistent state or on other effects, so they *enable combos*) · `intuitiveness ≥ 0.8` (every primitive's effect predictable from its name + the world's stated physics — *effect = metaphor*). LEAN (power from composition, not primitive count); every primitive traces to a locked L1/L2 mechanic or a WORLD.md/ledger id; the grammar of light honored (a primitive never silently moves value across a channel — only a played piece gates that).

**Synthesis basis.** Proposal **A** (engine-combo-first) is the spine: its one reference primitive **`read`** turns any live quantity into the *amount* of another effect (composition over count), and its **compile-time cross-channel gate** makes "play is the only exchange gate" a property the engine *enforces*, not merely respects. Grafted onto it: **B**'s tempo/thinning flow — chain-bracing, deck-search, perform-to-destruction, node-local last-lighting, and the `overkill = genuine-excess-only` binding; and **C**'s cross-turn persistence — a build becomes a specialist by the *typed state it leaves lit behind it*, delivered here through `mark-grain` + engine auto-seat + `read(grain:<suit>)` (one reader, not four) plus the one board-writer `soothe`. Every critic P0/P1/P2/P3 is resolved (§7); the reader-splitting, the fixed-mark violation, and all three firewall brushes are gone by construction.

### 0. The compile model — what a card *is*, and what the engine already does

A **card is declarative data**: a craft-suit, a printed **fixed waking-mark**, a **ceiling**, a printed `woken_delight`, and an ordered **effect list**. Each effect entry is `{ when: <trigger>, if: <read-guard?>, do: <primitive>, params }`. The `when`/`if` clauses are the combo harness (§2); the `do` is one of the **14 primitives** in §1.

The engine resolves *a play* with locked-L1 machinery that is **not** a primitive (cards assume it):
- Playing a piece spends attention from **the room** as a multiplier on the play; back-to-back plays hold the room high, a stall cools it (the **work-chain**).
- The play's attention **splits with nothing lost** (`the-returning-table`): a **SET** share works the piece toward its mark; the **RETURN** share seeps to *this node's* local table for tomorrow's dawn (node-bound, no caravanning).
- SET **at or above the piece's fixed waking-mark → the piece WAKES**: gold edge, fired to the run-deck permanently, and it **auto-joins the room as an audience-thing of its own suit** (this is C's "seat", made engine-automatic and typed by the piece's grain — no primitive needed). It becomes eligible for its `on-wake` effects.
- SET **past the piece's ceiling → the overkill converts to Standing at full rate** (`full-cup-overflow`), grain-stamped by the piece's suit (`the-grain-of-gleam`), diminishing past a band. This is automatic; the only *card* verb that touches the gleam magnitude is `brim` (§1), which widens the band on genuine overkill.

So the primitives are the **verbs printed on cards** — and the depth is that their amounts are *references to shared state* (`read`), not printed constants, so **the room you build with card 1 is the number card 3 dumps.**

### 1. The full primitive vocabulary (14)

**Shared/persistent state surfaces** (the combo substrate): **room** (R1 pool, per-turn) · **chain** (unbroken-work momentum) · **fill** (the need's-fill) · **piece-set** (attention rested on a piece vs its fixed mark/ceiling) · **woken-audience** (fired things now seating the room, typed by suit) · **grain** (craft-suits on pieces + Standing's grain) · **season/Paling** (seep stage + a node's spiral-rings — *read-only to cards except via `soothe`*) · **pack** (run-deck + hand) · **handsels** (R2) · **courted-stock** (R6) · **gleam** (R3 — written **positive only**, via overkill; *never spent by a card*).

#### 1a. Substrate verbs — the working (irreducible, locked L1)

| # | id | one-line effect | params | reads → writes | interacts? | traces to |
|---|---|---|---|---|:--:|---|
| 1 | **`gather`** | Seat more of the present audience into the room, raising the pool (soft-capped). | `amount` (may be a `read`), `source?` | reads **woken-audience/venue/grain** → writes **room** | **yes** | `the-gathered-room`; `attention-engine`/`audience-of-things` |
| 2 | **`rest`** | Spend the room to rest attention on a target piece (self\|held\|hand\|chosen) × the-chain; at/above its **fixed** mark it wakes, past its ceiling it overkills. | `target`, `amount` (may be a `read`) | reads **room + chain** → writes **piece-set, room (spend); (engine) gleam via overkill; (engine) woken-audience on wake** | **yes** | `the-waking-mark`, `the-returning-table`; `waking-threshold-play` |
| 3 | **`steady`** | Manipulate the work-chain: count this play as extra links **and/or** brace the chain so the next stall doesn't cool the room. | `links?`, `brace?` | reads/writes **chain** | **yes** | `the-gathered-room` (chain holds the pool); work-chain L1 §2.3 |
| 4 | **`fill`** | Pour this play's woken delight into the accepted need's-fill; amount may read the room/grain. | `amount` (may be a `read`) | reads **piece delight + (via read) fill/grain** → writes **fill** | **yes** | the need's-fill (L1 §2.6); `the-glad-load` |
| 5 | **`brim`** | Widen this play's **overkill→gleam** band (grain-stamped), so more of the *genuine excess past the ceiling* runs to Standing. **The only card verb that writes the gleam meter.** | `band` (may be a `read` — *within-channel surfaces only*, §2) | reads **piece-set over ceiling** → writes **gleam** (play-gated, positive, overkill-backed only) | **yes** | `full-cup-overflow`/`overkill-to-standing`; `gleam-runoff` |

#### 1b. Specialization + coupling writers (grow the persistent memory)

| # | id | one-line effect | params | reads → writes | interacts? | traces to |
|---|---|---|---|---|:--:|---|
| 6 | **`mark-grain`** | Stamp a craft-suit onto a target piece or this play (it now *also* counts as that grain — which flows to its seated-audience type and to the grain of any gleam it overkills). | `target`, `suit` | writes **grain/tags** | **yes** | `grain-tagged-standing`/`the-grain-of-gleam`; `journey-pieces-deck` suits |
| 7 | **`draw`** | Draw journey-pieces into hand; with a `suit`/`tag` filter it **searches** the pack for the combo piece (absorbs B's `dig`). | `n`, `suit?`/`tag?` | reads **pack + grain** → hand ↑ | **yes** (weak unfiltered) | `journey-pieces-deck`; `dawn-income`; `walking-ways-cardpools` |
| 8 | **`retire`** | **Last-light** a held/inert piece: perform it to destruction (permanent thin) and RETURN its worth to *this node's* local table (default) or the room now — fuel + a leaner deck. | `target`, `to?` (table\|room) | writes **pack (thin)** + **room/local-table** (node-bound) | **yes** | `evener-sacrifice-velocity`; last-lighting; `the-returning-table`/`attention-conservation` |
| 9 | **`whittle`** | Carve **the-shavings-share** of this play's bench-RETURN into handsels (or brighten one) — the bench→money coupling. | `amount` (may be a `read`) | reads **RETURN share** → writes **handsels** | **yes** | `the-shavings-share`; `bright-shavings-byproduct`; `handsel-currency-decay` |
| 10 | **`court`** | This play *performs a courting term*: a gleam-**vouched** material enters the pack (gleam gates, is never spent). | `stock`, `term` | reads **gleam (gate) + grain/tags (term)** → writes **courted-stock** | **yes** | `two-gate-courting`; `graded-material-market` |
| 11 | **`soothe`** | On a **woken re-making**, spend a **last-red catalyst** to slow **this node's** future paling — the one card verb that writes the board. | `amount` | reads **node** → writes **node/Paling** | **yes** | `pale-route-harvest`/`last-red`; `paling-clock` |

#### 1c. The combo pivot + the honest floor

| # | id | one-line effect | params | reads → writes | interacts? | traces to |
|---|---|---|---|---|:--:|---|
| 12 | **`read`** | Reference/value-source: return a scalar from live shared state, used as the `amount`/`if` of any primitive above. **The single reference primitive** (C's four `per-*`/`if-*` readers folded into one — composition over count). | `source` ∈ {`room`,`chain`,`fill`,`season`,`spiral`,`grain:<suit>`,`woken:<suit>`,`handsels`,`over-ceiling`} | reads **the named surface** → writes nothing | **yes** (the pivot) | `attention-conservation`; `paling-arithmetic-compounding`; `grain-tagged-standing` |
| 13 | **`warm`** | Add a flat printed value to **this piece's own** woken-delight (baseline value, no combo). | `n` | this card only | no | L1 §2 (delight); `journey-pieces-deck` |
| 14 | **`keep`** | This piece resists the Paling / stays warm one extra season (self-persistence, no combo). | — | this card only | no | `red-thread-marker`; `introduction-jars-freshness` |

**Interacting: 12 / 14 = 0.857.** The two non-interacting primitives (`warm`, `keep`) are deliberate: every game needs a legible baseline a newcomer can play without a combo, and their presence are the legible no-combo starter baselines a newcomer plays first (justified by player need, not the density number). **Gate `interaction_density ≥ 0.5` cleared with wide margin, by design.**

**What is deliberately NOT a primitive** (kept as engine events/params, to stay lean and to protect locked law):
- **wake / seat** — an engine state-transition on crossing the fixed mark (exposed as the `on-wake` trigger + automatic typed seating), *not* a card verb — this protects the fixed-mark law and delivers C's cross-turn "seat" for free.
- **overflow-to-gleam** — automatic engine conversion of genuine overkill (locked L1 §2.5); `brim` only *amplifies* it. Exactly one card gleam-writer.
- **fulfil / re-color** — engine event on the fill completing (exposed as `on-fulfil`); the node re-colors on fulfilment only, never per-play.
- **bench (material→piece crafting)** — a *between-turn* bench action (like a purchase), not an in-turn primitive; courted-stock enters play via `court`, and is worked into pieces off-turn. *(This is why C's in-play `bench` is absent — see §7.)*
- **lower-mark / ease** — **would violate the LOCKED fixed-mark law; rejected outright.** No primitive moves a waking-mark; the only lever for a big piece is bringing MORE attention (`gather`/`steady`/`rest`).
- **four separate readers** (`per-audience`/`per-pale`/`per-chain`/`if-grain`) — folded into one `read(source)`; the engine grows one switch case, not four (depth-critic P2 fix).

### 2. The combo harness — triggers, guards, and the compile-time firewall

The `when`/`if` clauses are the binding mechanism that lets one card's effect fire *off another card's event*:

- **`when`** ∈ `on-play` · **`on-wake`** *(this or a named piece crosses its fixed mark — the marquee hook)* · **`on-chain`** *(while unbroken / at length ≥ n)* · `on-stall` · `on-overkill` · **`on-fulfil`** *(the need's-fill completes)* · `on-court` · `on-dawn` · `at-dusk`.
- **`if`** = a `read` comparison, e.g. `if read(fill) ≥ half`, `if read(season) ≥ deep-gold`, `if read(grain:song) ≥ 3`.

**Cross-channel play-gate (compile-time — A's graft).** The primitives whose writes sit adjacent to another channel — `brim`, `fill`, `court`, `whittle`, `soothe`, and `rest`'s overkill — may **only** bind to a *play* event (`on-play`/`on-wake`/`on-overkill`/`on-fulfil`/`on-court`). None may fire on `on-dawn`/`at-dusk`. A card that tries otherwise **fails to compile.** This makes "a played piece is the world's only exchange gate" an engine-enforced property, not a hope.

**The gleam-firewall guard (compile-time — resolves world-coherence P2, and P3×2).** Because Standing *never interacts with* the Paling (locked L1 §4 / L2 R3), a **gleam-writing effect (`brim`) is doubly firewalled:**
1. its `band` **`read` may read only within-channel/current surfaces** — `room`, `chain`, `piece-set-over-ceiling` — **never** `season`/`spiral`/`paling`/`fill`/Standing's grain; and
2. it **may not be gated by an `if`** that reads a board/Paling surface (`season`/`spiral`/`paling`).
So no node's paleness can ever author the *amount* or the *firing* of a gleam gain (A's `brim(read(spiral))` is now uncompilable; B's `attune(node-rings){overflow}` is now uncompilable; C's `per-pale{pour}` cannot be expressed). **Paleness may still scale attention/handsel/harvest yields** (`read(season)` feeding `gather`/`whittle`/`fill` — canon-legal, cf. `dawn-income`, `gleaner-adversity-economy`); it is only barred from feeding Standing.

**Overkill-only mint (resolves world-coherence P3, B's free-`N`).** `brim`'s `band` **multiplies measured overkill** (attention genuinely past the ceiling); there is no free-`N` form and no flat gleam add. Gleam can never exceed real overflow. The mint is only ever "a full cup runs to the pourer."

### 3. Example cards as data — real combo chains

Marks are **fixed** (locked L1). `on_play` always fires; `on_wake` fires only if SET ≥ the fixed mark.

**Combo 1 — the engine chain** (*build the room → point it at the capstone → dump it, overflow to gleam, bank the byproduct, reload*):

```jsonc
// CARD 1 — the room-builder / chain-keeper
{ "id": "long-trestle", "name": "The Long Trestle", "grain": "joinery",
  "mark": 2, "ceiling": 4, "woken_delight": 1,
  "effects": [
    { "when": "on-play", "do": "gather",
      "params": { "amount": { "do": "read", "source": "grain:joinery" } } },   // +1 room per joinery already woken
    { "when": "on-chain", "do": "steady", "params": { "links": 1 } }            // this play counts double toward the chain
  ] }

// CARD 2 — the pointer: pre-rest the capstone toward its FIXED mark, then re-suit it
{ "id": "kiln-bloom", "name": "Kiln-Bloom Glaze", "grain": "glaze",
  "mark": 3, "ceiling": 5, "woken_delight": 2,
  "effects": [
    { "when": "on-play", "do": "rest",
      "params": { "target": "held:capstone",
                  "amount": { "do": "read", "source": "room" } } },            // by the size of the room you just built
    { "when": "on-wake", "do": "mark-grain",
      "params": { "target": "held:capstone", "suit": "song" } }                // now it also counts as song
  ] }

// CARD 3 — the capstone: dump the room, pay the fill by song-count, brim the overflow, bank + refill
{ "id": "whole-town-refrain", "name": "The Whole-Town Refrain", "grain": "song",
  "mark": 7, "ceiling": 8, "woken_delight": 3, "tags": ["capstone"],
  "effects": [
    { "when": "on-play", "do": "rest",
      "params": { "target": "self", "amount": { "do": "read", "source": "room" } } },   // one big rest x the-chain clears the fixed mark 7
    { "when": "on-wake", "do": "fill",
      "params": { "amount": { "do": "read", "source": "grain:song" } } },       // delight into the fill, per song woken this turn
    { "when": "on-overkill", "do": "brim",
      "params": { "band": { "do": "read", "source": "room" } } },              // FIREWALL-LEGAL: band reads the ROOM (within-channel), never the spiral
    { "when": "on-fulfil", "do": "whittle", "params": { "amount": 1 } },        // the shavings-share of THIS fulfilment -> a handsel
    { "when": "on-fulfil", "do": "draw", "params": { "n": 1, "suit": "song" } } // and search toward the next chain
  ] }
```

*How it fires:* Long Trestle `gather`s room by joinery-count and `steady`s the chain (pure setup lifting shared state). Kiln-Bloom `rest`s the now-big room **onto the capstone** — toward its *fixed* mark 7, the mark never moving — then `mark-grain`s it song, inflating its later `read(grain:song)`. The Whole-Town Refrain clears mark 7 on one `rest self × chain`, `fill`s scaled by the song-count Card 2 just grew, `brim`s the genuine overkill to gleam (band read off the **room**, not the board), then `whittle`s a handsel and `draw`s a reload. **Every load-bearing number on Card 3 was written by Cards 1–2 through shared state** (room, chain, grain-count). Break the chain and the capstone under-fills — *a reach that falls short, the spilling* (L1 §4). The combo *is* the growth; the growth is the Standing at stake.

**Combo 2 — a song specialist compounding *across turns*** (C's persistence graft, via engine auto-seat + `read(grain:song)`):

```jsonc
// CARD 4 — reads the song-audience seated on PRIOR turns; grows it for future turns
{ "id": "call-the-rafter-larks", "name": "Call the Rafter-Larks", "grain": "song",
  "mark": 3, "ceiling": 5, "woken_delight": 2,
  "effects": [
    { "when": "on-play", "do": "gather",
      "params": { "amount": { "do": "read", "source": "woken:song" } } },      // room grows with every song-thing woken on earlier turns (cross-turn)
    { "when": "on-wake", "do": "mark-grain",
      "params": { "target": "hand:cheapest", "suit": "song" } }                // stamp a hand piece song, so it too seats as song when it wakes
  ] }
```

*How it fires across turns:* when this piece (and any song piece) wakes, the engine **auto-seats it as a song-typed audience-thing** that persists into *tomorrow's* room. Next turn, `read(woken:song)` reads that standing pool, so `gather` is bigger — and `mark-grain` keeps recruiting hand pieces into the song grain, so the song-audience snowballs turn over turn (soft-capped by `the-gathered-room`). A joinery deck playing the same card gets a small `gather` and no compounding — **specialization is enforced by the tags a build grows, with no class menu** (`grain-tagged-standing`, `walking-ways-cardpools`). This is the persistent cross-turn interaction the tempo pillar alone lacked.

**Combo 3 — a pale-route glaze thinner** (B's thinning + C's board-writer; the Gleaner/Evener line):

```jsonc
// CARD 5 — pale ground pays money, thin a dead card to fuel this table, then mend the node
{ "id": "glean-and-mend", "name": "Glean and Mend", "grain": "glaze",
  "mark": 3, "ceiling": 5, "woken_delight": 2,
  "effects": [
    { "when": "on-play", "do": "whittle",
      "params": { "amount": { "do": "read", "source": "season" } } },          // FIREWALL-LEGAL: read(season) feeds HANDSELS, not gleam (gleaner adversity economy)
    { "when": "on-wake", "do": "retire",
      "params": { "target": "inert:hand", "to": "table" } },                   // last-light a dead card -> this node's table -> richer dawn tomorrow
    { "when": "on-fulfil", "do": "soothe", "params": { "amount": 1 } }         // a woken re-making + last-red slows THIS node's future paling
  ] }
```

*How it fires:* on paler ground `read(season)` makes `whittle` carve **more handsels** (routing paleness into *money*, never Standing — the firewall holds). On waking it `retire`s an inert hand-piece to *this node's* local table (deck gets leaner → better draws all run; the table pays a richer dawn if you camp here). On fulfilment `soothe` spends last-red to slow the node's paling — the one card verb that writes the board, and it *never touches the gleam meter*. A route-build farms the pale country its `read(season)` scales, then repairs it.

### 4. The interaction map — the shared-state edges

- **`gather` → room →** every `rest`, and every `read(room)` that scales `rest`/`fill`/`brim`-band. The room is the busiest bus in the vocabulary.
- **`steady` → chain →** the multiplier on all `rest`, and `read(chain)`; `steady`'s brace lets a needed pause not cool a *later* `rest`.
- **`rest` → piece-set → WAKE →** fires `on-wake` effects (`mark-grain`, `fill`, `brim`) and (engine) **auto-seats** a typed audience-thing, which loops back to raise future `gather`/`read(woken:<suit>)` — the cross-turn compounder.
- **`mark-grain` → grain →** `read(grain:*)` (feeds `fill`/`gather` amounts), the seated-audience *type*, the *grain of any gleam this piece overkills*, and `court` terms (a stamped suit satisfies a term). One writer, three payoffs.
- **`fill` → need's-fill →** `on-fulfil` (fires `whittle`/`draw`/`soothe`) and `read(fill)` guards.
- **`brim` → gleam →** (positive, overkill-backed) off-turn it widens the next lantern's tier; firewalled from every board surface.
- **`read` →** the universal glue: makes `room`, `chain`, `fill`, `season`, `spiral`, `grain`, `woken`, `handsels` into live amounts for any other primitive. **Why the density is high with only 14 verbs.**
- **`draw` → pack/hand →** more plays → longer `steady`/`rest` chains; filtered, it fetches the exact combo piece.
- **`retire` → local-table + pack →** fuels `gather`/`rest` and next dawn while thinning (the Evener line); feeds `read(room)` next turn.
- **`whittle` → handsels** and **`court` → courted-stock →** the two card-level couplings out to L2's strategic systems (Handsel Round, Courting Web); both play-gated, both read tags/gleam.
- **`soothe` → node/Paling →** the one board-writer; a route-build's repair, read back by `read(season|spiral)` and the dawn.

**Non-interacting (baseline only):** `warm` (+delight on its own card), `keep` (its own freshness) — combo with nothing by design.

**Depth argument (combos, not stat-sticks):** the example cards share *no printed load-bearing number* — every one is a `read` of state an earlier play wrote. The same cards in a broken order under-fill. That order-and-state sensitivity is the definition of a combo engine, produced by one structural choice: **amounts are references, not constants** — plus one persistent cross-turn store (typed woken-audience) so depth is not confined to the single turn.

### 5. Grammar of light + play-is-the-only-gate compliance

Three channels that never cross (**places pale · people gleam · things wake**), plus **the current** (attention, the medium). Audited primitive by primitive:

| Primitive | Channel it touches | Cross-channel? | Legal because… |
|---|---|---|---|
| `gather` | the current (room) | no | draws present audience into the pool; soft-capped; mints nothing (the Breath) |
| `rest` | current → thing (wake) / current → people (overkill) | yes | **play-gated**: attention becomes fired-work or gleam *only* by resting it on a played piece at/over its mark/ceiling |
| `steady` | the current (chain) | no | reorganises momentum within the turn's pool |
| `fill` | thing → places | yes | **play-gated**: pours *woken delight already produced by this play*; re-color happens only on fulfilment |
| `brim` | current → people | yes | **play-gated + overkill-only + board-firewalled** (§2): fires solely `on-overkill`; band reads within-channel surfaces only; writes gleam positive; the canonical "full cup runs to the pourer" |
| `mark-grain` | within things-wake (grain) | no | grain is metadata on pieces; no value moves between channels |
| `draw` | within things-wake (pack) | no | deck op |
| `retire` | within things-wake / current | no | perform-to-destruction; its RETURN is **node-local attention** (no caravanning) |
| `whittle` | current-RETURN → handsels (held signature of wake) | within-channel | the-shavings-share is *carved from* the RETURN bound by the telling (L2 §4) — no mint on top; play-gated; `read(season)` may scale it (yield, not Standing) |
| `court` | gleam **gates** → courted-stock enters | no gleam moved | gleam is **read as a gate, never written/spent**; the material enters only via a **performed term** — "a key that turns, never a coin that leaves" |
| `soothe` | places-pale (board) | no | writes the Paling via a woken re-making + last-red; **never touches the gleam meter** (the Paling↔Standing firewall holds) |
| `read` | reads any surface | **never** — read ≠ transfer | reading a surface to *scale a within-channel effect* moves no value; the gleam-firewall (§2) bars any board `read` from feeding `brim` |
| `warm` / `keep` | this card only | no | static self-modifiers |

**Locked-fact conformance:**
- Waking-marks are **fixed** — no primitive lowers a mark; the lever is bringing *more attention* (`gather`/`steady`/`rest`). ✔ *(resolves C's fixed-mark P1 by construction — no `bench.lower_mark`, no `bench` primitive)*
- Gleam **only via genuine overkill** (`brim`), **never spent** by any card (`court` reads it as a gate); **firewalled from the Paling** in amount and firing (§2). ✔ *(resolves world-coherence P2 + P3×2, depth-critic P1)*
- Node **re-colours on fulfilment only** — `fill` pushes the fill; the engine re-colours `on-fulfil`. ✔
- Attention **node-local** — `rest`'s RETURN and `retire`'s fuel land on *this* node's table; no primitive caravans attention. ✔
- Handsels **not spent inside a turn** — no primitive spends handsels; `whittle` only *produces* them. ✔
- The Paling is **board-only** — `read(season|spiral)` reads it (non-gleam scaling only), `soothe` writes it; it never touches the gleam meter. ✔
- Conservation / mint-ban — every write is a conserved transfer (seated audience, SET+RETURN+overkill split, node-local RETURN, carved shavings-share); no primitive creates or destroys regard. ✔

**D-002 (wonder/whimsy) & D-003 (do-not-resemble):** the verbs are the world's own craft-physics — *gather the room, rest the light onto the work, steady the working, fill the need, brim the overflow, mark the grain, draw and search the pack, retire a piece by last-lighting, whittle the shavings, court the shy stuff, soothe the fading ground, keep it warm.* No debt, no fee, no court, no paperwork; every primitive paints (a lifting room, a gold edge taking, light running into the knuckles, grey ground held back). ✔

### 6. Why this set (lean + expensive-to-add discipline)

Fourteen verbs, each earning its place against "the engine grows a switch case with it":
- **`gather`, `rest`, `steady`, `fill`, `brim`** — the five that *are* the locked working (room → wake → fill → overkill). Non-negotiable; `steady` absorbs B's `hold` (links + brace in one).
- **`read`** — the one primitive that turns the other thirteen into an engine; deleting it collapses the set to stat-sticks. Highest leverage per byte; it is also the merge of C's four `per-*`/`if-*` readers into one (composition over count).
- **`mark-grain`** — the identity/synergy surface; with the engine's auto-seat it *is* C's cross-turn "seat" (typed audience) and grain-of-gleam, in one writer.
- **`draw`, `retire`** — the pack levers (tempo + the Evener conversion line); `draw` filtered absorbs B's `dig`, `retire` absorbs B's `exhaust` + `seep`(inert).
- **`whittle`, `court`** — the two card-level couplings into L2's strategic systems (Handsel Round, Courting Web).
- **`soothe`** — the one board-writer, so the vocabulary can *write* the Paling surface (not merely read it); the Gleaner archetype's core verb and a genuine board-state combo axis (route-farm-then-repair). The single primitive C contributes that A/B lacked.
- **`warm`, `keep`** — the honest floor: baseline value and freshness, so not every card must combo.

### 7. Critic resolutions & verification

- **P1 · `bench.lower_mark` violates the LOCKED fixed-mark law (world-coherence + depth-interaction, proposal C) — RESOLVED.** The synthesis has **no mark-lowering primitive and no in-play `bench` primitive at all.** Material→piece crafting is a between-turn bench action; courted-stock enters via the play-gated `court`. Waking a high-mark piece stays: build a bigger pool (`gather`/`steady`/`rest`). ✔
- **P2 · `brim(read(spiral))` routes the Paling into gleam (world-coherence, proposal A) — RESOLVED.** The compile-time **gleam-firewall guard** (§2) bars any gleam-write from reading *or* being gated by any board/Paling surface. Example Card 3's `brim` reads the **room**, never the spiral. Paleness still scales attention/handsel/harvest (`read(season)`), never Standing. ✔
- **P3 · `per-pale{pour}` latent firewall breach (world-coherence, proposal C) — RESOLVED.** The generic `per-pale` wrapper is gone (folded into `read`), and the firewall guard makes `read(season|spiral)→crown` uncompilable, so paleness can never wrap a gleam-write. ✔
- **P3 · `overflow` free-`N` mint (world-coherence, proposal B) — RESOLVED.** `brim` multiplies **measured overkill only**; no free-`N`, no flat gleam add — gleam can never exceed genuine overflow. `attune`-on-node-rings wrapping a gleam-write is uncompilable under the same guard. ✔
- **P2 · density inflated by reader-splitting (depth-interaction, proposal C) — RESOLVED.** C's four readers (`per-audience`/`per-pale`/`per-chain`/`if-grain`) are one `read(source)`; the set is 14, not 15+, and density (0.857) reflects real composition, not split counts. ✔
- **P2 · shallow within-turn-only interaction (depth-interaction, proposal B) — RESOLVED.** The engine's automatic **typed audience-seating** + `read(woken:<suit>)` (Combo 2) gives a genuine *cross-turn* persistent store, so depth is not confined to the single turn's tempo. ✔
- **Gates:** `interaction_density ≥ 0.5` — **0.857** (12/14, §1c) ✔ · `intuitiveness ≥ 0.8` — every verb is the world's own craft-physics, effect = metaphor (§5) ✔ · every primitive traces (§1, §8) ✔ · grammar of light honored, play the only gate, compile-time-enforced (§2, §5) ✔ · no primitive moves value across a channel silently (§5) ✔.
- **No P0** raised by any critic; the locked spine (D-001), every LOCKED L1 mechanic (fixed mark, overkill-only gleam, node-local return, fulfil-only re-color, the Paling↔Standing firewall), and the LOCKED L2 resource square are all affirmed.

### 8. Trace table (every primitive → a locked id)

`gather`→`the-gathered-room`/`attention-engine`; `rest`→`the-waking-mark`/`the-returning-table`/`waking-threshold-play`; `steady`→`the-gathered-room`(chain)/`attention-engine`; `fill`→the need's-fill (L1 §2.6)/`contract-payoff-bundle`; `brim`→`full-cup-overflow`/`overkill-to-standing`; `mark-grain`→`grain-tagged-standing`/`the-grain-of-gleam`; `draw`→`journey-pieces-deck`/`walking-ways-cardpools`; `retire`→`evener-sacrifice-velocity`/last-lighting/`attention-conservation`; `whittle`→`the-shavings-share`/`bright-shavings-byproduct`; `court`→`two-gate-courting`/`graded-material-market`; `soothe`→`pale-route-harvest`/`last-red`/`paling-clock`; `read`→`attention-conservation`/`paling-arithmetic-compounding`/`grain-tagged-standing`; `warm`→L1 delight/`journey-pieces-deck`; `keep`→`red-thread-marker`/`introduction-jars-freshness`.


### 10. Lock-time clarifications (applied at approval)

- **`crown`→`brim` rename.** The overflow-amplifier verb is renamed **`brim`** (from *"a full cup runs to the pourer"*); the word **crown** is reserved exclusively for `the-rising-crown`, the year-end finale (L1 §5-§6). Same mechanic, no collision.
- **`brim` is bounded (anti-snowball, resolves the locked-cap tension).** `brim`'s widened band may **only reduce the diminishing-returns penalty on genuine overkill - never exceed full-rate overkill**, and it mints nothing that isn't real overflow past a ceiling. It cannot re-open the bank-then-dump line L1 §5/§8 closed; the exact ceiling coefficient is a game-loop number.
- **`read` is amount-syntax, not a printed verb.** `read` is the internal amount/if-expression glue only; it is **never printed on a card face** - cards render it diegetically as *per / by* ("gather, per joinery woken"; "fill, by the song woken"). It is excluded from the player-facing effect=metaphor test. Its source set now includes `over-ceiling` (the surface `brim` scales off).
- **`soothe` is capped to canon.** `soothe.amount` is the magnitude of a **single, once-per-season, single-node** last-red catalyst, bounded by L2 §4's last-red cap (1 node / 1 knack / 1 season); it cannot exceed it.

---

## Layer 4 — Acquisition Model

**Gate (AUTO layer — napkin economy check, no human gate):** `napkin_flags ≤ 0` (executable: acquisition keeps the deck **on-curve** — grows enough to stand the rising crown but not trivially fast; **no single acquisition source dominates**; **no degenerate acquisition loop** — no infinite card/handsel/material generation) · `intuitiveness ≥ 0.8` (every acquisition mechanism legible from its name + the world's logic — *effect = metaphor*). Every source **traces** to a WORLD.md/ledger id; **no generic card-shop**; the **grammar of light**, the **L2 resource square**, and the **L3 primitives** honored — acquisition adds only R5 pieces, R6 materials, R2 handsels, **never a fifth token**.

**Synthesis basis.** Proposal **B** (*supply-is-geography*) is the spine — the world-coherence panel ranked it tightest and carrying **no locked-canon contradiction**: it keeps `the-glad-load` canonical (**one pressed piece** taught by the town's beloved, faithful to `the-giving-line` and WORLD.md:611), routes all draft-**CHOICE** to the canon-sanctioned **moving Fair** (WORLD.md:468, journey-pieces change hands *"by teaching, winning, and plain delight"*), and structures six sources on six clocks/gates with **no keystone faucet**. Grafted onto it: **A**'s reward-pull emphasis (the glad-load is the single *richest* flow — the passive spine every active source rides on top of), A's concrete **acquisition-arc and thinning numbers**, and A's **hearth-deepening** upgrade path (corrected). The two proposals differ mainly in *emphasis* — reward-pull (*answer the town, it fills your pack*) vs geography-pull (*route to where the stuff lives*); the synthesis keeps **both**, because they are one loop read from two ends: **the glad-load is the richest thing that enters the pack, and the route you thread is what decides which glad-loads — and which drafts, courtings, and gleanings — you ever reach.**

Every critic P1/P2 is resolved (§7): A's glad-load-as-scaling-draft **canon contradiction** (reverted to a single pressed piece; choice routed to the Fair), A's **eased-first-waking** play-gate breach (dropped), A's **`retire`↔twice-benched mint** (double-closed), A's **skip-ripen dominance** (bound stated), and B's **handsels→cards Fair faucet** (bounded).

### 0. The acquisition square — what enters a run, and by what door

Only **three** things are ever *newly acquired* into a run — the three settlings that can change hands (WORLD.md:543). The other three L2 resources are earned, spent, or routed, **never "acquired as content."**

| Enters the pack | L2 id | Canon class | The doors it comes through (this layer) | Never entered by |
|---|---|---|---|---|
| **Journey-pieces** (the deck) | R5 | *the set* — given & taught | glad-load gate-teach · Fair draft · waymeet swap · walking-with-masters · benched from courted stock · first-gift · crown unlocks | a card-shop (there is none) |
| **Courted stock** (materials) | R6 | *the loose* — courted, never mined | glad-load introduction-jar · the two-gate courting-market · festival/crowd-bound stock · gleaning (last-red / twice-benched) · apprentice floor · waymeet & Mannerly jars | any coin doing the vouching's job |
| **Handsels** (money) | R2 | *the held* — whittled & circulated | glad-load bright handsels · whittling the apprentice floor · the-shavings-share · glad-price change · doorstep & waymeet small change | a mint / debt / wage / fee |

**Standing (R3), attention (R1), the Paling (R4)** are the **gates and clocks** that decide *how much* of the three above enters, and *when* (§4) — never content. Acquisition is a **bundle paid across the existing sub-economies, not a new economy** (L2 §2 System D → B/C/A).

**The one-sentence mental model (the intuitiveness gate):** *answer the town and it fills your pack — a piece, a jar, a purse, a road ahead; and route to where the proud stuff lives, bright enough that it will deal with you.* Every mechanism below is legible from that sentence plus its name.

**The framing law (LOCKED, from L1/L2 — the structural spine of §5).** Acquisition delivers **inert potential**, never a woken engine-part: a piece enters the pack **paling-prone**, and becomes fired only by being **played at/above its waking-mark** (`the-waking-mark`, `fired-vs-held`, `play-is-the-only-gate`). **No acquisition source bypasses the exchange gate** — the room still has to pay for every card. This is *why* a fast draft cannot trivialize the run (§5b).

### 1. The full acquisition model — every source

Each source: **what · how · gate/cost · trace.** Grouped by the three things that enter the pack.

#### 1A · New journey-pieces (R5) — the deck grows

**P1 · The gate-taught piece — the passive spine (primary card influx).**
*What:* every answered asking teaches the pack **one journey-piece — the single piece taught by whoever the town loves best** (`the-glad-load`, WORLD.md:611: an unbidden pressed gift, *"not one dram of it was ever demanded"*), arriving **with that town's name written on it** (`the-giving-line`/`deck-autobiography` — the deck is an autobiography of teachers).
*How:* fires automatically as one strand of `the-glad-load` when a need's-fill completes (`on-fulfil`). Its **grain and tier scale off the gatepost spiral** (rings-in = load-out) crossed with **what your gleam is grained toward** (`grain-tagged-standing`) — a five-ring pale town teaches a prouder piece than a kettle-town, and *the country teaches you toward the maker you are being,* with no class menu. **It is one giver, one pressed piece — never a menu.** (The draft-CHOICE lives at the Fair, P2 — this is the world-coherence-P1 fix: the gate glad-load stays the singular pressed gift canon demands.)
*Gate/cost:* answer the asking — accept it by hand, work it, fulfil it under the season clock. The cost is the whole loop; the piece is the compliment.
*Trace:* `the-glad-load`/`contract-payoff-bundle`; `journey-pieces-deck`; `the-giving-line`/`deck-autobiography`; `grain-tagged-standing`; `escalating-contracts`. L1 §3; L2 System D.

**P2 · The Round-Fair draft — the active card hub, where CHOICE lives (periodic).**
*What:* the one node that moves. For its passage a pale square remembers every color it ever had and **journey-pieces change hands by teaching, winning, and plain delight** (WORLD.md:468, `the-round-fair`) — the run's **draft/trade hub**, a spread of pieces from all six ways of which the maker takes a bounded few. **This — not the gate — is the canon-sanctioned choose-from-a-few draft** (the venue A mis-sited onto the glad-load gate).
*How:* three legible lanes, each priced in its own canon coin, **none in numbers** —
  1. **Teaching lane** — press *bright* handsels into a teacher's palm through `the-glad-price` (a *read*: coins laid until the palm sings; a grudged trade wakes nothing). Handsels **may** buy a teaching (L2 R2 sink) — **bounded** so it is never a card-shop (§5c). Buys an *inert* piece; the room still wakes it.
  2. **Winning lane** — `the-fair-answer`: answer an asking beside a rival way, **which work wakes** takes the full reward (piece + telling); the loser is gifted the smaller piece (*"nothing made before a whole town is ever wasted"*). Bounded by contest slots + your engine.
  3. **Delight lane** — a piece pressed on a maker the crowd loves. Bounded by your standing with the Fair's rafters (the traveling lantern *remembers you*).
*Gate/cost:* **the intercept** — route to meet the wagons, *a week ahead of autumn*, on a track readable in spring. Miss it and the draft is gone until the wheel brings it round. **The Fair retells everything at twice size** — draft *and* ladder-raise in one act (fastest deck-growth AND fastest crown-raise together).
*Trace:* `fair-hub-intercept`/`the-round-fair`; `fair-answer-rival-contest`; `fairwright-multiplier-spike`; `the-glad-price`. L2 System B/D.

**P3 · The waymeet table — free, deck-*re-shaping*, at the crossings.**
*What/how:* a plank table under the fingerboard sign holding *whatever the last hundred walkers left* (`the-waymeet-table`). **Leave a piece, take a piece** — a taken piece *arrives already storied* (a **head-start on waking**: it carries part of its set already — canon-legal, WORLD.md:618, the set carried by the storied object itself, **not** minted). No shopkeeper, no accounts.
*Gate/cost:* **net-zero card count** (leave-one-take-one — re-shaping, not inflation); the cost is the *give*. Supply is only what prior walkers (and your own past runs, via `road-marks` meta-persistence) left — thin, unfarmable.
*Trace:* `the-waymeet-table`; `journey-pieces-deck`; `run-map-circuit`. L2 System B.

**P4 · Walking-with-masters / season-shadowing — the archetype door (on the ways' stretches).**
*What/how:* fall in behind a master and keep their hours (**season-shadowing**), or meet a walking master as a map-event; it **ends with one journey-piece, given** (`the-walking-ways`) — an **off-way card carrying that master's name.** Adopt their **constraint** for a segment (keep dusk hours / give every handsel / play only fired cards); multi-way decks legal, grain bonuses reward focus.
*Gate/cost:* the constraint itself (a self-imposed play-restriction) — a tempo/route cost, not a coin; gated by which way's stretch you route through.
*Trace:* `walking-ways-cardpools`/`the-walking-ways`; `the-giving-line`. L5 archetypes.

**P5 · The bench — off-turn, material → piece (the self-authored deck source).**
*What/how:* the maker **works courted stock (R6) into new pieces at the bench between turns** — a *between-turn* craft action (not an in-turn primitive; L3 §7), how proud materials *become* deckable cards. Proud stock → prouder, higher-mark pieces; **twice-benched** stock crafts pieces that wake at **nine-tenths** the attention of fresh grain (`the-twice-benched` — the *single* canon discount, §1B/§5c).
*Gate/cost:* consumes courted stock (itself gleam-gated + performed to acquire, §1B) + off-turn tempo; rate-limited by material supply and freshness.
*Trace:* `journey-pieces-deck`; `the-twice-benched`; `two-gate-courting`. L2 System C→A.

**P6 · The setting-out first-gift — the loadout (once, spring even-morrow).**
*What/how:* the fresh maker makes one small true thing before whoever is on the waymeet ground; **someone's grandmother teaches one journey-piece at the gate**, the town loads ~6–8 apprentice-tier pieces + a net-purse of dull handsels + a lump of apprentice stock, a child chalks the first road-mark (`the-setting-out`/`the-first-gift`). The first-gift seeds **starting grain, way-affinity, and the first lantern reading.**
*Gate/cost:* none — a gift and a right. Out-of-season sparks (a re-lit Quiet Walker) are unlockable alternate openings.
*Trace:* `wander-year-run-frame` (setting-out); `hearth-right`; `the-apprentice-stuffs`. L1; L5.

**P7 · Red-thread-days at the crown — the capstone unlock (once, late).**
*What/how:* at the year-end **combing/crown**, the gathered ways offer legible boss-modifiers, one of which is **courted introductions that unlock proud materials** (→ benched into crown-scale pieces) (`red-thread-days`). A capstone supply *event*, not a loop.
*Trace:* `red-thread-days`/`red-thread-days-boss-modifiers`; `crown-finale-scheduling`. L1 §6.

**Card *deepening* (not adding) — the hearth path.**
Distinct from the sources above, **hearth-right rest-nodes upgrade the deck without growing it.** At a fire you **tell one event from this run's history** — *"the house wakes around it, that event's tag becoming the night's boon"* (`hearth-right-rest-telling`; **selection, never a cost**). The boon **deepens one held piece via `warm` (+printed delight) or `keep` (+one season of freshness) — and those two only.** *(The A-P2 fix: A's "eased first-waking" is **dropped** — resting SET on a piece toward its mark outside a play would violate the LOCKED fixed-mark law AND `play-is-the-only-gate`, minting piece-set with no conserved play behind it. A woken head-start comes **only** from a conserved carrier — the storied waymeet piece P3, or twice-benched grade P5 — never a telling-boon.)* Both `warm` and `keep` are L3-legal self-modifiers (this card only). Trace: `hearth-right-rest-telling`; `porch-meta-home`.

#### 1B · New courted stock (R6) — materials, one graded class

> **Framing law (LOCKED, L2 §8 P1 / L3 §5):** proud materials are **NEVER purchased.** Acquisition is the **two-gate courting** — **the vouching** (a *gleam gate*: will the stuff state its terms to hands the world holds in mind — gleam's business, *no coin's*) then **the terms** (a *performable* micro-condition, executed as the `court` primitive, a play). Handsels may buy the *already-courted jar* and the *apprentice tier*, **never** do the vouching's job. Freshness reverts untended stock (garden, not hoard).

**M1 · The town courting-market — place-bound, gleam-gated *width*.** The proud-stock stalls; the market **widens as Standing rises, narrows to apprentice at the bottom** (`shy-materials`) — at low shine the silver stall goes quiet as you pass (*"that silence is the tutorial"*), at high shine every shelf leans in. Stand at the stall → the **vouching** (gleam) decides *which grades state terms this run* → **`court`** the stated term (`singing-silver`: unbroken play-chain; `laughing-riverwood`: a room-laughing token; bell-bronze: a crowd holding one breath; hearth-slate: a telling over the work). Gate/cost: **gleam gates width** (read from grain, never spent); **the term costs a play** (attention/tempo). Trace: `two-gate-courting`/`shy-materials`; `graded-material-market`; `grain-tagged-standing`. L2 System C; L3 `court`.

**M2 · The glad-load introduction-jar — passive, on-fulfil.** Every answered asking loads **one introduction-jar of the local proud stuff, already courted** (`the-glad-load`) — *"collapses weeks of courtship into a gift."* Jar grade scales off the spiral. Trace: `introduction-jars-freshness`; `the-glad-load`. L2 System D→C.

**M3 · Festival-glass & crowd-bound stock — venue-gated by season/crowd.** Materials whose scarcity *is the scarcity of gathered watching* — `festival-glass` (*"no crowd, no glass"*), bell-bronze. Acquirable **only at high-attention nodes** (fairs, high days, red-thread-days); the calendar is the gate. Fairwright-affine; works of it grant small passive attention. Trace: `festival-glass`/`graded-material-market`; `the-four-lights`. L2 System C.

**M4 · The gleaning — pale/left-behind country, the salvage-grade tier.** The **pale-route harvest**: walk the left-behind with brush and jar, come in *"rich in exact proportion to how far into the quiet you were willing to walk"* (`last-red`). Yields **last-red** (a catalyst, not deckable — spent only on **woken re-makings** via `soothe`, capped 1 node/1 knack/1 season) and **twice-benched stock** from Evener wagons trailing chosen last-lightings. Gate/cost: **route risk** (highest in the game; Gleaner-affine); **never triggers on inhabited or answered nodes** (the anti-salvage law); twice-benched keys **only to chosen last-lightings, never failure.** Trace: `pale-route-harvest`/`last-red`; `the-twice-benched`; `gleaner-adversity-economy`. L3 `soothe`.

**M5 · Apprentice-stuffs — the floor, zero-gate, at every node.** Straw, dough, clay, withy, tallow, chalk, wool — *"the gregarious tier that answers any hands, dim or bright"* (`the-apprentice-stuffs`); **bypasses the vouching**, the comeback path out of the Quiet Walk and the daily bread-work — *and the raw stock of handsel-whittling* (→ H1). Wakes thin, pales fastest: a doorway, never a destination. Trace: `apprentice-floor-materials`; `two-gate-courting` (bypass).

**M6 · Waymeet-table & Mannerly-lent jars — the gift-lane for courtships.** Introduction-jars left on the waymeet table (idle held things go there because idleness dims them), or a jar a Mannerly presses on you / lends. Gate/cost: the give, or your standing with the way. **Jars are earned/gifted, never minted** (§5c). Trace: `the-waymeet-table`; `introduction-jars-freshness`; `the-mannerly`.

**Twice-benched — the single canon number, and a one-way grade.** Twice-benched grain **wakes at nine-tenths the attention fresh grain wants** (a 10% ease — *not* 90%; this fixes A's internal 10%-vs-90% contradiction) **and is terminal**: a piece benched from twice-benched stock, when `retire`d, yields **no new twice-benched stock** — the fired sub-uses (beam, shaft, bearing) are already twice-used and do not unfire a third time (*"plenty downstream of tenderness, never of ruin"*). This is the structural close on the `retire`↔twice-benched mint (§5c). Trace: `the-twice-benched`.

#### 1C · New handsels (R2) — the purse fills

> **Framing law (LOCKED, L2):** *"anyone can make money; only circulation can make it worth anything."* Handsels are **whittled** (faucet) and **brightened by circulation** (never minted); the only sink is idle-lapse → gloaming-table → tomorrow's dawn — *the money's only sink is the world's only income* (closed, mint-clean).

- **H1 · Whittling the apprentice floor** — off-turn/bread-work; consumes apprentice stock (M5) → *near-dull* handsels that only circulation brightens. The always-available faucet, the Quiet Walker's way back. Trace: `the-apprentice-stuffs`; `handsel-currency-decay`.
- **H2 · The-shavings-share** (the `whittle` primitive) — carves a **bound sub-portion of this play's bench-RETURN** into handsels, *carved from the RETURN, never minted on top* (it **competes with the node's local-table dawn**; L2 §4). `read(season)` may scale it (paleness → more money, **never Standing** — firewall-legal). Trace: `the-shavings-share`/`bright-shavings-byproduct`; `attention-conservation`.
- **H3 · The glad-load's bright handsels** — the town presses **handsels rung bright that very evening by the whole square's glad palms** into the pack (`the-glad-load`); the single richest coin inflow, scaled to the spiral, arriving *already bright.* Trace: `the-glad-load`.
- **H4 · The glad-price & haggling** — spending into delight returns change *"a shade brighter"*; **bounded below its tempo/attention cost** (gladness performed under attention — no money-printer, L2 §5). Trace: `glad-price-read`.
- **H5 · Doorstep askings** — a household's door-nail pays *"a handsel or two"* + rest + welcome; sparse **by law** (one nail to a hamlet, none on between-roads), priced **below the apprentice-stuff comeback loop.** Trace: `doorstep-micro-contracts`.
- **H6 · Hearth & waymeet gifts** — glad hosts press small handsels (`hearth-right` warms the teller, never pays); the waymeet table converts idle held things. Trace: `hearth-right`; `the-waymeet-table`.

#### 1D · Map-intel (information) — the road ahead is acquired too

Answering an asking **chalks road-marks a day's walk ahead** (`the-glad-load`), and the shared map-intel economy means your **past runs' marks persist** (`map-intel-preview`) — spiral counts, asking-tier silhouettes, dawn-richness. Aims eyes, **moves no reading** (courier law, `the-walking-light`). Trace: `map-intel-preview`; `the-glad-load`.

### 2. The acquisition arc across the wander-year

The arc is authored by the reward spine + the geography together: **askings start kettle-sized and rare in a thin spring, the country's stalls stay shy, and both thicken through summer to pay seasons-worth by autumn** — so the deck is *pulled* up the exact curve the rising crown demands, and the *choice* (Fair drafts, widening vouching) opens on the same clock. Numbers are napkin estimates for §5's executable check; game-loop tunes them.

| Season / leg | Askings answered (est.) | Deck (start→end) | Materials | Purse | The felt shape |
|---|---|---|---|---|---|
| **Green Going** (spring) | 3–4 (kettle) | **~7 → ~9** | apprentice floor only; first jars; proud stalls **quiet as you pass** | mostly-dull whittled; the odd doorstep coin | *the shy market* — thin loads, learn the valleys; every piece must be woken |
| **Long Light** (high summer) | 5–6 | **~9 → ~14** | vouching opens with rising gleam; jars flow; the **Fair crosses** (draft burst); fair glass | chiming; the shavings-jar glows | *the engine turns* — glad-loads arrive, first courting, first `retire` → twice-benched |
| **Deep Gold** (late summer) | 4–5 (bigger) | **~14 → ~18** | proud shelf leans in; **gleaning country opens**; twice-benched | singing; glad-loads thicken | *abundance* — the first enormous dawns, five-ring poems, richer Fair drafts |
| **Red Walk** (autumn) | 3–4 (great) + crown | **~18 → ~20**, thinned lean | full width; pale country routed for last-red; **crown introductions**; festival-glass | rich mid-air, cannot sit | *stand the crown* — the deck the year built, at boss scale, where you routed |
| **Wintering** | — (the telling) | persists **1 bead** → meta | — | — | the year handed on mid-song |

**Why on-curve, not runaway (the load-bearing claim).** Gross card influx ≈ **one taught piece per answered town asking** (P1) plus a bounded Fair burst (draft *k*-of-*N*, once or twice a run), and answered askings are **rate-limited three ways** — worked-mornings on the finite calendar × lantern presence × gleam-gated offers (Filter-2). ~**20 answered askings** across a run, minus thinning (§3) and the choose-*one*/leave-one channels, lands an end-deck of **~18–22 pieces** — grown enough to stand the calendar-floored crown, slow enough that spring is genuinely thin. **Early rarity is authored by the weather** (kettle askings, shy stalls), **late power by the same weather** (poems, the crown, full-width vouching, the twice-size Fair) — the reward curve, the choice curve, and the escalation curve are **the same curve** (L1 §5; L2 §5b).

### 3. Card thinning & removal — the pack is a garden, not a hoard

Acquisition without removal is bloat; every faucet pairs with a canon drain, **none punitive**:

- **`retire` / last-lighting — the primary thinner (the Evener line).** Perform an inert/held piece **to destruction** (permanent thin) + RETURN its worth to *this node's* local table (richer dawn) or the room now + yield **twice-benched** stock (M4). *Generative removal* — a leaner deck draws better all run. Chosen, tended, festival-lit — **never a failure state.** (Its RETURN is clamped, and twice-benched is terminal — §5c.) Trace: `evener-sacrifice-velocity`; `the-twice-benched`; `retire` (L3).
- **Gifting to the waymeet table (P3 in reverse)** — leave a piece you won't keep bright; it walks storied, a small blessing following you a leg. Thinning-as-gift, no accounts. Trace: `the-waymeet-table`.
- **Perform-to-destruction / exhaust** — pieces *"given away or performed to destruction"*; the Untold's one-shots exhaust and never repeat (`untold-ratchet-tempo`). Tempo decks self-thin by design.
- **Freshness reversion (material-side)** — untended courted stock **reverts to ordinary within a season** (`introduction-jars-freshness`); reverted stock's pieces pale fastest, pushing the upgrade path.
- **The Quiet Walk (run-scale reset)** — Standing-zero ends the run; the deck is **not carried forward** (*"every re-spark is a fresh maker walking a fresh verse"*, the fresh verse); exactly **one woken work** persists to the meta-layer (`quiet-walk-runend-meta`), the winter-telling hands on **one bead** (`winter-telling-victory`). Meta is **gifts-only, sized to the tier reached** — no between-run inflation (L1 §6).

**Net thinning ≈ 6–10 pieces/run** (retires + gifts + exhausts) holds the ~20-gross influx to an ~18–22 end-deck; aggressive archetypes (Kilnfast's dense deck, the Untold's thin fast deck) run *below* that. The Evener makes retirement an *engine*, so the fastest-acquiring builds are also the fastest-thinning — the two rates couple through the same `retire`/glad-load loop; none can thin into an empty pack (apprentice-stuffs always re-courtable, M5).

### 4. How season/Paling and gleam gate supply — the two-supply-gates

Two independent gates on two channels, **non-substitutable** — this is *why* supply is strategic, not a menu:

**4A · Gleam gates market WIDTH — "who will deal with you."** The vouching (`two-gate-courting`): low shine → apprentice tier only, stalls quiet; high shine → proud stock leans from every shelf. Filter-2 carries to the taught-piece tier — **which glad-loads (hence which taught pieces) are lit and offerable** is gated by present gleam (`two-filter-lantern-sizing`). Grain decides *which kinds* of stock answer (`grain-tagged-standing`) — build identity, no class menu. **Gleam gates, never spends** — *"a key that turns, never a coin that leaves."* No acquisition ever *costs* Standing.

**4B · Season/route gates what a place HAS — "what the country is offering."**
- **Bright kept towns:** proud stock proud on the shelf; thin dawns, kettle glad-loads. Where to *court* the proud tiers.
- **Pale inhabited towns:** richer work, **richer glad-loads, the richest mornings** (dawn-ladder). Where to *answer* for a big load.
- **The left-behind / grey roads:** last-red gleaning + twice-benched (M4) — the salvage tier, *the left-behind never the lived-in.*
- **Crowds (fairs, high days, red-thread-days):** the *only* place for venue-bound stock (festival-glass, bell-bronze) and the Fair draft (P2). *A crowd is an occasion, not a faucet* — the calendar is a resource.
- **The season curve:** the shy Green Going → the Deep Gold opening gleaning + the first enormous loads → the full-width Red Walk. Supply **rises with the seep** (`escalation-is-the-weather`); pale country compounds *both* pressure and payoff in one number (rings-in = load-out).

**The intersection is the strategy:** *shine* decides whether a place will deal with you; *route + season* decides what that place has. A high-shine maker in spring still finds only apprentice stock; a low-shine maker at the autumn Fair finds a full square but no vouching. You need **both gates open at once** — the mending question worn as a supply chain. And richest supply (crown-scale teaches, proud stock, the twice-size Fair) is **unlocked by being bright and routing the pale country late** — precisely the conditions under which you must stand the rising crown. **Supply and demand climb the same weather.**

### 5. The anti-degenerate story (`napkin_flags` claimed: 0)

An **executable** model: acquisition grows the deck enough to stand the rising crown, not trivially fast; no single source dominates; no degenerate loop.

#### 5a · No single acquisition source dominates
Each source is on a **different clock and gate**, so no one strategy optimizes all supply — the **route is the portfolio choice**:

| Source | Resource | Clock | Primary gate | Cannot be spammed because… |
|---|---|---|---|---|
| Glad-load (P1/M2/H3) | all three | the fulfil | answer an asking | bounded by askings available × capacity under the season clock; **each node answers once** (re-colors, spiral resets) |
| Fair draft (P2) | pieces + money | the wheel-intercept | route to the wagons | periodic; the Fair moves on; twice-size *also raises the ladder*; lanes bounded *k*-of-*N* |
| Courting-market (M1) | materials | the season/place | gleam vouch + performed term | width capped by shine; the term costs a play; freshness reverts |
| Gleaning (M4) | last-red / twice-benched | the route | thread the left-behind | never on inhabited/answered nodes; highest route risk |
| Whittling (H1/H2) | handsels | the rest / the play | apprentice stock + tempo | produces *dull* money; only circulation brightens it |
| Waymeet (P3/M6/H6) | pieces / jars / money | the crossing | the give (leave-to-take) | net-neutral card count; supply is what others left |

The glad-load pays *all three at once* but is gated by the loop; every *active* source pays *one* thing on its own gate — **no keystone faucet.** Pull only one and you starve the others. (Cards ≥3 independent doors; materials no one door > ~40%; handsels a closed, mint-clean round.)

#### 5b · On-curve clearable — the deck grows *only by* engaging the escalation
Because **rings-in = load-out**, richer acquisition *always* arrives on a harder need under attention + `the-reach` risk (L1 §5). A static/turtle engine answers few askings → thin loads → an un-standable crown; a reaching engine grows its deck on schedule *and* risks Standing to do it. **A fast draft cannot trivialize the run** — every acquired piece is *inert* (the §0 framing law): the room still must wake it (`play-is-the-only-gate`, soft-capped `the-gathered-room`). You cannot draft your way past the requirement to *perform*. Growth tracks reach; the turtle-dodge is closed by **the crown being un-standable without a grown deck** (L1 §5/§6), not by a handout.

#### 5c · No degenerate loop — each carried risk discharged
- **Infinite cards — CLOSED.** No node re-issues an answered asking (glad-load fires once/node/year); Fair is periodic + intercept-gated + raises the ladder as it feeds; waymeet swap is **leave-one-take-one (net-zero count)**; teaching/shadowing is a consumed map-event; bench crafting consumes gated, reverting materials. No `draw`/`retire` loop mints pieces (they move/thin, never create). **No card faucet runs without a finite, rising-gated input.**
- **Infinite handsels — CLOSED.** Whittling makes *dull* coin (worthless until circulated); `the-shavings-share` is **carved from the RETURN** (competes with the node's dawn — mint-clean, L2 §4); glad-price brightening is **bounded below its tempo/attention cost**; idle handsels **lapse to the dawn** — *the money's only sink is the world's only income.* No money printer.
- **Infinite materials — CLOSED.** Courting is gleam-gated (vouch) **+** performed-term (a play); freshness reverts untended stock (can't hoard a monoculture); apprentice-stuffs wake thin & pale fastest; **jars are earned/gifted, never minted** — jar-arbitrage is gated behind actually answering needs, traded jars cost bounded handsels.
- **The `retire`↔twice-benched mint — CLOSED (degenerate-economy P1).** Construct: bench twice-benched → wake cheap → play for full delight + overkill + a seat → `retire` for its worth + fresh stock → repeat (material net-zero, per-cycle attention mint). **Two independent closes, both applied:** (1) **`retire`'s RETURN is clamped to the attention actually SET into the piece *this* cycle, never the full fired worth carried from prior plays** — a piece already played for its `woken_delight` (into the fill) and its overkill (into Standing) has spent its worth *forward*; what `retire` returns is only the *residual* unspent attention, so a cheap-woken, already-performed piece retires for a pittance. `retire` converts *unspent* worth, never duplicates *spent* worth. (2) **Twice-benched is a ONE-WAY terminal grade** (§1B) — a piece benched from it, when retired, yields **no new twice-benched stock**, so the piece↔stock regeneration is broken and material strictly *decays* through the cycle. The single discount is **nine-tenths fresh (10% ease)**, not the 90% A's dropped hearth paragraph implied. The cycle nets negative on both material and attention; it cannot run positive. Coefficients (residual-worth curve) → game-loop.
- **Skip-ripen dominance — CLOSED by a stated structural inequality (degenerate-economy P1).** The concern: skip everything to 5–7 rings, mature a cheap-wake engine, sweep late for maximal glad-loads. The model **commits to the binding inequality** (coefficients → game-loop, but the *shape* is fixed here, not deferred): **the deck's waking-capacity growth per worked morning stays below the asking/crown difficulty growth per ripened ring** — so a ripened 7-ring need always out-scales the deck the skip-year bought. With the cheap-wake loop already closed (above), the "mature a cheap engine" half is defanged; the rest is bounded by — each ripe town answers **once**, the combing raises a great asking toward a boss the under-grown skipper **may not stand**, gleaning never triggers on inhabited/answered nodes, and the meta-reward is **tier-sized** (a failed sweep hands on little). Skip-ripen is a legitimate **high-risk style** (the Gleaner line), not a dominant solve, precisely while that inequality holds.
- **The handsels→cards Fair faucet — BOUNDED (degenerate-economy P2).** B's teaching lane (P2.1) lets *bright* handsels buy taught pieces, and handsels trace to zero-gate apprentice-stuffs (whittle → circulate → bright → buy cards) — a money→deck door A avoided, edging toward the banned card-shop. Kept (canon: the Fair's *"commerce priced in wakefulness"*; a teaching-for-payment is the glad-price, not a rack of masterworks), but **bounded so it is never a keystone faucet or a shop:** (1) **the chain runs strictly below just answering askings** — whittled money is *dull*, brightening is bounded below its tempo/attention cost, so each bright handsel spent on a teaching costs *more* attention-tempo than the piece would earned from a glad-load (no arbitrage); (2) **windowed + bounded** — the lane exists only at the intercept (periodic, route-gated), drafting a bounded *k*-of-*N* per passage; (3) **inert output** — a bought teaching still must be woken by the room (play-is-the-only-gate). A legitimate bounded trade (bright purse → a few inert pieces at a windowed node), not a generic card-shop. Exact *k*/*N*, intercept frequency, brightening coefficient → game-loop.
- **Deliberate-failure farming — CLOSED.** The spilling yields `lane-glimmers` worth **< one Standing point**, claimable **only by later visitors, never the spiller** — EV-negative, so no one flops to acquire.
- **Between-run inflation — CLOSED.** Fresh-verse clamp: no deck carries over; meta is **gifts-only, one bead, sized to tier** (L1 §6).
- **Mint-ban backstop.** No acquisition flow creates or destroys regard — every windfall (a glad-load) is the town's *own* overflow of delight at a real re-making, never minted on top. With no net-creation, no loop runs positive indefinitely.

**`napkin_flags` claimed: 0.** No dominant source (six sources / six clocks / no keystone faucet), on-curve-clearable (grows only by engaging escalation; inert delivery means the room still pays), no infinite/degenerate loop (the retire-mint double-closed, skip-ripen bound stated, the money→card lane bounded). Carried items reduce to **game-loop numeric bounds** (taught-tier curve, thinning rate, glad-price coefficient, Fair *k*/*N*, the waking-capacity/ring inequality, the retire residual-worth curve) — not structural holes.

### 6. Consistency with L1 loop / L2 resources / L3 primitives

**L1 (core loop) — affirmed.** Acquisition *is* `the-glad-load` (L1 §2.6, §3), fired at **fulfilment only**, scaled off the gatepost spiral; the taught piece **arrives with the town's name** (`the-giving-line`); an acquired piece is **inert until woken by a play** (`play-is-the-only-gate`, `fired-vs-held`). Calendar-gating rides **worked mornings**, not travel (L1 §1). Hearth upgrades are **selection, never cost**, and touch no fixed mark (warm/keep only). Nothing touches the Standing meter except through canon-legal doors (overflow, the spilling). ✔

**L2 (resource square) — affirmed.** Acquisition adds only **R5 / R6 / R2** — **no fifth token**; the glad-load pays *across* the existing sub-economies (System D → B/C/A) exactly as L2 §2 maps. Materials stay **one graded R6 class** (`courted-stock`), courted (gleam-gated, never purchased) or gifted as jars — handsels **never buy proud stock** (L2 §8 P1; the Fair teaching lane buys *taught pieces*, not proud materials, and is bounded). The-shavings-share is the **bound RETURN sub-portion** (mint-clean). The Handsel Round stays **closed & mint-clean.** ✔

**L3 (primitives) — affirmed.** Taught/benched/gifted pieces are **cards = data over the 14 primitives** (L3 §0); **no new primitive.** Acquisition-into-the-deck (glad-load, draft, teaching, first-gift, bench) is a **meta/between-turn action**, consistent with L3 §7 (bench is off-turn, not an in-turn primitive). The in-turn primitives it *uses*: **`court`** (perform a term — M1), **`whittle`** (shavings-share → handsels — H2), **`retire`** (last-light thinning → twice-benched — §3, with RETURN clamped and twice-benched terminal), **`soothe`** (last-red on a woken re-making — M4), **`warm`/`keep`** (the hearth-deepening — raising delight/freshness, **never lowering a fixed mark**). Grammar-of-light / play-gate honored: no source moves value across a channel silently; the gleam-firewall holds (paleness scales handsel/harvest yields via `read(season)`, **never Standing** — M4/H2 firewall-legal). ✔

**D-002 wonder / D-003 do-not-resemble — affirmed.** Every source is the world's own gladness worn as physics — a town loading a pack past sensible fullness at a dawn gate, a grandmother teaching at the setting-out, a silver stall going quiet as you pass, a Fair square remembering every color, a kneeling gleaner with a jar of impossible red on the grey step, a plank table at a crossroads rearranged by every passing walker. **No card-shop, no posted numbers, no debt/wage/fee, no court, no paperwork, no salvage-from-ruin.** Each faucet is an image an artist could paint. Wonder, not a store. ✔

### 7. Critic resolutions & verification

- **P1 · glad-load-as-scaling-draft canon contradiction (world-coherence, A) — RESOLVED.** The gate glad-load teaches **one pressed piece** from the town's beloved (P1; WORLD.md:611, `the-giving-line`), honoring the singular-giver / unbidden-gift canon. **All draft-CHOICE is routed to the canon-sanctioned moving Fair** (P2; WORLD.md:468) — exactly as B sited it. A's tier-scaling 4–5-option gate menu is gone. ✔
- **P2 · eased-first-waking play-gate/fixed-mark breach (world-coherence, A) — RESOLVED.** The hearth upgrade is restricted to **`warm` and `keep` only** (both L3-legal self-modifiers); "eased first-waking" is **dropped** — no piece-set is rested outside a play. A woken head-start comes only from a conserved carrier (storied waymeet piece P3, twice-benched grade P5). ✔
- **P1 · `retire`↔twice-benched infinite-value mint (degenerate-economy, A) — RESOLVED.** Double-closed (§5c): `retire`'s RETURN clamped to *this-cycle* residual attention (never carried fired worth), **and** twice-benched made a **one-way terminal grade** (no stock regeneration); the discount fixed at the single canon **nine-tenths** number. Cycle nets negative. ✔
- **P1 · skip-ripen dominant-source (degenerate-economy, A) — RESOLVED.** The binding **inequality** is stated (waking-capacity growth/turn < difficulty growth/ring), the cheap-wake half is defanged by the mint close, and the remaining pull is bounded (answer-once, the combing boss, gleaning manners, tier-sized meta). Coefficient → game-loop, but the *structure* is committed here, not deferred. ✔
- **P2 · handsels→cards Fair faucet (degenerate-economy, B) — RESOLVED.** The teaching lane is **bounded** three ways (sub-faucet rate, windowed *k*-of-*N* intercept, inert output) — a legitimate trade, not a card-shop or keystone faucet (§5c). ✔
- **P3 · "market" diegetic-naming caution (world-coherence, B) — FLAGGED FOR L6 (no mechanical change).** `graded-material-market` is a canon ledger id and stalls are canon (WORLD.md:468), so "market" is fine as an **internal design label**; but the commerce-vocabulary ban (WORLD.md:723) bars "market" as a metaphor in **diegetic** text. L6 must render M1 as *the-courting / the-vouching / the-stalls-that-lean-in*, not an in-world "market." ✔ (carried, §unresolved)
- **Gates:** `napkin_flags ≤ 0` — **0** (§5) ✔ · `intuitiveness ≥ 0.8` — one-sentence anchor, every source legible from name + world logic, no menu required (§0) ✔ · every source **traces** (§1, §8) ✔ · no generic card-shop (§6) ✔ · grammar of light + L2 square + L3 primitives honored (§6) ✔.
- **No P0** raised; the locked spine (D-001), every LOCKED L1 mechanic, the LOCKED L2 resource square, and the LOCKED L3 vocabulary are all affirmed.

### 8. Named Layer 4 acquisition elements

| id | one-line role | traces to |
|---|---|---|
| **`the-acquisition-square`** | Only three things ever enter a run — R5 pieces, R6 stock, R2 handsels; Standing/attention/Paling are the gates and clocks, never content. Acquisition is a bundle paid across existing sub-economies, no fifth token. | `the-round-of-light`; L2 `the-resource-square` |
| **`the-loading-gate`** | The glad-load as the passive spine: answering a need loads the pack across all three settlings at once (one pressed taught piece + one introduction-jar + bright handsels + map-intel), scaled to the spiral. | `the-glad-load`/`contract-payoff-bundle`; `the-giving-line` |
| **`the-drafting-fair`** | The Round-Fair as the year's active card hub and the home of draft-CHOICE: teach/win/delight lanes priced in wakefulness, wheel-intercept-gated, retelling at twice size (draft *and* ladder-raise in one act). | `fair-hub-intercept`/`the-round-fair`; `fair-answer-rival-contest` |
| **`the-courting-market`** | Town material stalls whose *width* is gleam-gated (the vouching) and whose *stock* is place/season-gated; proud stock never bought, only courted by a performed term. *(L6: diegetic name ≠ "market".)* | `two-gate-courting`/`shy-materials`; `graded-material-market` |
| **`the-gleaning-supply`** | Pale/left-behind country as the salvage-grade faucet: last-red + twice-benched, yield scaling with paleness, never on inhabited/answered nodes, keyed only to chosen last-lightings. | `pale-route-harvest`/`last-red`; `the-twice-benched`; `gleaner-adversity-economy` |
| **`the-inert-delivery`** | The framing law: every source delivers an *inert, paling-prone* piece; the room still must wake it by a play. Why a fast draft can't trivialize the run. | `play-is-the-only-gate`; `the-waking-mark`; `fired-vs-held` |
| **`the-hearth-deepening`** | Card *upgrade* (not add): tell one run-event at a fire → the boon deepens one held piece via `warm` (+delight) or `keep` (+freshness) **only** — selection never cost, no fixed mark ever moved. | `hearth-right-rest-telling`; `porch-meta-home` |
| **`the-terminal-twice-benched`** | Twice-benched is a one-way grade: wakes at nine-tenths fresh attention, and a piece benched from it regenerates no new twice-benched stock when retired — the structural close on the retire↔bench mint. | `the-twice-benched`; `evener-sacrifice-velocity` |
| **`the-two-supply-gates`** | The gating law: *gleam* decides who will deal with you (market width, the vouching); *season+route* decides what the place has (bright=proud stock, pale=big loads, left-behind=last-red, crowd=venue-bound). Both must open at once. | `two-gate-courting`; `the-lightshed`; `the-four-lights` |

---

## Layer 5 — Archetypes

**Gate:** `synergy_depth ≥ 3` (DEPTH, gated: each archetype a payoff chain of ≥3 *interacting* cards, not a pile of good cards; report the min across archetypes) · `napkin_flags ≤ 0` (executable: each archetype VIABLE / can stand the crown, NONE dominates, each a real ≥3-card synergy chain, and the Untold's tempo escalation numerically matches the spine's size curve OR is clamped — I-022) · `intuitiveness ≥ 0.8` (each identity predictable from its Walking-Way name + the world's logic). DEEP + INTUITIVE; every archetype composes FROM the L3 primitives and traces to a Walking Way; distinct win-levers, not palette-swaps.

**Synthesis basis.** Proposal **A** (*six-ways-direct*) is the spine — the world-coherence panel ranked it the richest and most canon-literate slate: all six Walking Ways mapped one-to-one, the LOCKED Untold≠Evener distinction *defended* rather than blurred, `brim` reserved to the Fairwrights, correct singing-silver / laughing-riverwood term pairings, and the cross-turn `read(woken:<suit>)` compounder sourced correctly (unlike C's `grain:joinery` slip). Grafted onto it: **C**'s canon-clean **Evener** (retire→room, never purse→room — the one card that fixes A's sole P1) and C's **3+3 onboarding tier** (six distinct levers, sequenced as a starter triad + a second wave). **B**'s four-pillar consolidation is *rejected* on canon grounds (it merges the-untold and the-eveners — the one merge WORLD.md forbids — and mis-assigns the Fairwright's `brim`-spike to the Kilnfast to justify benching a Way); its clean I-022 throughput-equivalence argument is kept as a second proof leg. Every critic P0/P1/P2 is resolved (§6); the count stays **six**, justified mechanically (§0).

### 0. Why SIX archetypes, tiered 3 + 3 (the count justification)

The task permits keeping all six Walking Ways or consolidating to a tighter 3–4 starter set with the rest as later identities. **We keep all six, and the justification is mechanical, not sentimental:** the LOCKED L2 resource square exposes exactly six substrate levers a build can pull hardest, and the six Walking Ways already sit one-to-one on them — one lever each, no two sharing a hardest-lever. Under a lever-first reading that *is* the definition of "mechanically distinct," so six is the exact number of orthogonal engines the vocabulary affords, not bloat.

| Lever (what you optimize) | L2 resource / L1 axis | L3 verbs pulled hardest | Walking Way |
|---|---|---|---|
| **the fired, held** — run-permanent deck density, room ratcheted by accumulated woken things | R5 deck (run clock) + R1 held chain | `steady`, `read(woken:<suit>)`, `rest` | **the-kilnfast** |
| **the purse, moving** — conversion velocity: dead cards & idle handsels composted to forward fuel | R2 handsels (rest clock) + R1 table | `retire`, `whittle`, `draw` | **the-eveners** |
| **the pace, ratcheted** — contract COUNT & PACE in place of tier; thin non-repeating one-shots | the contract clock (I-022) + R5 churn | `draw`, `steady{links}`, `fill(read chain/grain)` | **the-untold** |
| **the room, spiked** — peak attention on ONE public occasion, overflow→Standing | R1 attention (occasion clock) + R3 spike | `gather`, `brim` | **the-fairwrights** |
| **the proud, courted** — gleam-as-pure-gate opening high-power shy stock behind performed terms | R3 gate + R6 stock (season clock) | `court`, `mark-grain`, `read(grain)` | **the-mannerly** |
| **the grey, harvested** — board paleness itself as the engine's fuel | R4 the Paling (route clock) + R1 pale dawns | `read(season/spiral)`, `soothe` | **the-morning-gleaners** |

**Two collisions canon forbids us to merge** (why the count cannot drop below six without erasing a locked distinction):
- **Evener vs Untold both "exhaust" — but WORLD.md draws the line.** The Evener is exhaust-heavy *"always for conversion, never for pace (the tempo exhausts belong to the Untold)"* (`evener-sacrifice-velocity`). The Evener's `retire` writes **local-table/room income** (R2/R1 velocity); the Untold's exhaust writes **tempo** (contract count). Same verb-family, opposite target surface — B's Pillar-3 "tempo-velocity" merge is exactly the conflation the world drew a line under.
- **Kilnfast vs Fairwright both lean on the room — but on opposite clocks.** Kilnfast pulls a **run-permanent** fired audience floor (`read(woken:<suit>)`, no spike); the Fairwright pulls a **transient** crowd to a single-occasion peak dumped through `brim`. Curve vs spike; lowest vs highest variance. `brim`/overkill is the **Fairwright's** signature (`overkill-to-standing`), never the Kilnfast's ("*no spike turn*", `kilnfast-tall-permanence`).

**Tiering 3 + 3 (distinctness ≠ onboarding legibility).** Distinctness holds for all six; onboarding is sequenced by how self-contained each lever is:
- **Starter triad** (need only the base loop): **Kilnfast** (R5 permanence — the deck itself; low variance, patient), **Eveners** (R2 conversion — the game's gentlest variance), **Untold** (R5/contract velocity — teaches tempo, draw, chain). These teach *hold / convert / churn* with no subsystem prerequisite.
- **Second wave** (each rides a subsystem the starters expose but don't require): **Fairwrights** (R1 spike / `brim` overkill — highest variance), **Mannerly** (the courting subsystem), **Gleaners** (spiral-reading / route play). Nothing here is a later palette-swap — each pulls a lever no starter pulls.

Acquisition of an archetype is diegetic (`walking-ways-cardpools`): **no class menu** — you become the Way whose grain your gleam actually shows (`grain-tagged-standing`), by walking-with-masters and season-shadowing. **Multi-Way decks are legal**; grain rewards focus, so each Way is an identity/on-ramp, not a locked class.

### 1. The archetype slate

Each archetype is a **grain-tagged build the country teaches you into** — "dominant primitive / resource / door" names the lever it *leans on*; every archetype can still touch the whole vocabulary. Cards are declarative data over the 14 L3 primitives; `mark`/`ceiling` are **fixed** (LOCKED L1); `read(...)` is amount-syntax rendered diegetically as *per/by*; every gleam-write (`brim`) obeys the L3 compile-time firewall (band reads `room`/`chain`/`over-ceiling` only, never a board surface). In every chain, **each load-bearing number on the payoff card is a `read` of shared state an earlier card wrote** — a combo engine, order-and-state sensitive; the same cards in a broken order under-fill (the reach that falls short → the spilling, L1 §4).

---

#### A1 · The Kilnfast — *the fired, held* (starter)

**Identity:** the smallest, densest deck; hold one unbroken room and fire pieces that seat as permanent audience, so every turn the room the last turn built comes back bigger — no spike, just a curve that out-scales the boss.

- **Dominant L3 primitive:** **`steady`** (chain links + brace) + cross-turn **`read(woken:<suit>)`** feeding `gather`; secondary `rest` onto high-fixed-mark pieces.
- **L2 resources:** **R1 attention held in long within-turn chains** + **R5 fired pieces** as the persistent audience store. Barely touches R2.
- **L4 doors:** **the bench** (proud/twice-benched stock → few high-mark fired pieces) + **the loading-gate** (glad-load); buys almost nothing at the Fair. Deck stays deliberately tiny (~9–12).
- **Risk posture:** **lowest variance in the game** — weak openings, strongest boss/crown scaling (`combing-boss-tier`, `closed-round-relics` affinity). Its danger is being *out-tempoed* before the engine matures, never blowing up.

**Signature chain (3 distinct card types + an accumulation loop) — the compounding hearth:**
```jsonc
// C1 — Setterby Trestle (joinery): room grows with every joinery ALREADY fired (CROSS-TURN)
{ "grain":"joinery","mark":2,"ceiling":4,"woken_delight":1, "effects":[
  {"when":"on-play","do":"gather","params":{"amount":{"do":"read","source":"woken:joinery"}}}, // +room per fired joinery
  {"when":"on-chain","do":"steady","params":{"links":1,"brace":true}} ]}                        // hold the room across a pause
// C2 — Calipers at the Bench (joinery): pre-rest the capstone toward its FIXED mark by the held room
{ "grain":"joinery","mark":3,"ceiling":5,"woken_delight":2, "effects":[
  {"when":"on-play","do":"rest","params":{"target":"held:capstone","amount":{"do":"read","source":"room"}}},
  {"when":"on-wake","do":"mark-grain","params":{"target":"hand:offgrain","suit":"joinery"}} ]}  // recruits an OFF-grain hand piece into joinery -> grows read(grain:joinery)
// C3 — The Fired Beam (joinery capstone, high mark): clear it, seat it, pay by joinery-count
{ "grain":"joinery","mark":7,"ceiling":8,"woken_delight":3,"tags":["capstone"], "effects":[
  {"when":"on-play","do":"rest","params":{"target":"self","amount":{"do":"read","source":"room"}}},
  {"when":"on-wake","do":"fill","params":{"amount":{"do":"read","source":"grain:joinery"}}},
  {"when":"on-chain","do":"steady","params":{"brace":true}} ]}
```
**How it chains:** C1 `gather`s the room *by every joinery piece fired on earlier turns* (`read(woken:joinery)` — the engine auto-seats each fired piece as a typed audience-thing, L3 §0), so the room the run built keeps returning. C2 `rest`s that held room **onto** the capstone toward its fixed mark 7 (the mark never moves), and stamps an off-grain hand piece joinery so C1 and C3 both read bigger. C3 clears mark 7 on one `rest self × chain`, `fill`s by the joinery-count C1/C2 grew, **then wakes and seats as one more joinery audience-thing feeding C1 next turn.** The loop *is* the compounder: fired pieces → bigger `gather` → clear bigger marks → more fired pieces. **Every number on C3 was written by C1–C2 through shared state (room, chain, grain-count).** 3 distinct card types + an accumulation loop.

---

#### A2 · The Eveners — *the purse, moving* (starter)

**Identity:** exhaust-heavy, always for conversion — last-light inert pieces into local-table and room income while a handsel engine keeps money bright by keeping it moving. Composts what other decks hoard; wins long runs on consistency.

- **Dominant L3 primitive:** **`retire`** (last-light → **room / table**, *not* `read(handsels)→room`) + **`whittle`** (the shavings-share of the fattened room → bright handsels), glued by the work-**chain**. *The Evener's room is fuelled by retired pieces, never by the purse* (canon R1/R2 law: attention is never banked, handsels never spent inside a turn).
- **L2 resources:** **R2 handsels** (velocity: *"what stops moving, dims"*) + **R1 the local table / room** the retire feeds. Low material dependence.
- **L4 doors:** **whittling** the apprentice floor + **the-shavings-share** + glad-load handsels + waymeet gifting (thinning-as-gift). **Twice-benched** keys ONLY to chosen last-lightings, never failure (the terminal grade, L4).
- **Risk posture:** **low-and-steady** — the control deck; highest consistency in the game. Stands the crown by *prepared board*, not spike.

**Signature chain (depth 3) — the last-lighting velocity loop (grafted from C·E; resolves A's purse→room P1):**
```jsonc
// C1 — The Last Lighting (dance): retire dead weight into fuel, two ways
{ "grain":"dance","mark":3,"ceiling":5,"woken_delight":2, "effects":[
  {"when":"on-play","do":"retire","params":{"target":"inert:hand","to":"room"}},   // dead card -> the room NOW (fatten the pool)
  {"when":"on-play","do":"retire","params":{"target":"inert:pack","to":"table"}} ]}// another -> this node's table for tomorrow's dawn
// C2 — Bright Hand to Hand (thread): carve the fattened room into singing money; grow the chain
{ "grain":"thread","mark":3,"ceiling":5,"woken_delight":1, "effects":[
  {"when":"on-play","do":"whittle","params":{"amount":{"do":"read","source":"room"}}}, // shavings-share off the fattened room -> handsels
  {"when":"on-chain","do":"steady","params":{"links":1}} ]}                            // hold the chain that multiplies C3's rest
// C3 — Even the Rim (dance capstone): the fattened room x chain clears the mark; reload the thin deck
{ "grain":"dance","mark":6,"ceiling":8,"woken_delight":3,"tags":["capstone"], "effects":[
  {"when":"on-play","do":"rest","params":{"target":"self","amount":{"do":"read","source":"room"}}},
  {"when":"on-fulfil","do":"draw","params":{"n":2}} ]}
```
**How it chains:** C1 last-lights two paling-prone pieces — one to **the room now** (fattening the pool), one to **this node's table** (a richer dawn if you camp here). C2 `whittle`s the shavings-share of that fattened room into **bright handsels** (the money-velocity identity) and `steady`s the chain. C3 `rest`s the fattened room **× the chain** onto its mark (both C1's room *and* C2's chain feed the wake), then `draw`s to refill the deliberately-thin deck. Let the money sit and it dims (`handsel-currency-decay`) — the velocity is mandatory. **The room C1 fattens and the chain C2 grows are both consumed by C3.** No attention is banked and no handsel is spent in-turn — the canon R1/R2 laws hold. Depth 3.

---

#### A3 · The Untold — *the pace, ratcheted* (starter, I-022 carrier)

**Identity:** a thin, fast deck of cheap fine-grained one-shots that exhaust and never repeat; clear *many small* needs per morning; the pressure that rises is **contract count and pace**, not tier — until the combing arrives as weather.

- **Dominant L3 primitive:** **`draw`** (thin-deck flow + filtered search) + cheap `fill` one-shots that exhaust; **`read(grain:thread)`** / **`read(chain)`** stack the *count/pace* into one big fill. Distinct exhaust: for **pace**, never conversion (canon).
- **L2 resources:** **R5 deck velocity** (fewest cards, fastest cycle) + the **contract-count** channel as the felt pressure. Deliberately fine-grained gleam (*"a shine like sand, not like beams"*).
- **L4 doors:** thin — **first-gift** + a few fine-grained glad-loads + **doorstep askings** (many small); the between-roads as rumor-silent breathing room, bought with tempo.
- **Risk posture:** **cool and controlled**, thinnest late-game floor (its pieces never seat), with the combing as the honest end of the trick.

**Signature chain (3 distinct card types + an accumulation loop) — the paper-bird ratchet:**
```jsonc
// C1 — Paper-Bird (thread one-shot, exhausts): pay a small fill, draw its own replacement
{ "grain":"thread","mark":1,"ceiling":2,"woken_delight":1,"tags":["one-shot"], "effects":[
  {"when":"on-play","do":"fill","params":{"amount":{"do":"read","source":"grain:thread"}}}, // small, scales with the count
  {"when":"on-play","do":"draw","params":{"n":1,"suit":"thread"}} ]}                          // replace itself -> the deck flows
// C2 — Quick-Hand (thread): search the next one-shot, keep the pace warm across many cheap plays
{ "grain":"thread","mark":2,"ceiling":3,"woken_delight":1, "effects":[
  {"when":"on-play","do":"draw","params":{"n":1,"suit":"thread"}},
  {"when":"on-chain","do":"steady","params":{"links":1,"brace":true}} ]}                       // stalls don't cool the tempo
// C3 — The Standing Count (thread capstone): the fill scales with how MANY thread one-shots fired this turn
{ "grain":"thread","mark":4,"ceiling":6,"woken_delight":2,"tags":["capstone"], "effects":[
  {"when":"on-play","do":"rest","params":{"target":"self","amount":{"do":"read","source":"chain"}}},
  {"when":"on-wake","do":"fill","params":{"amount":{"do":"read","source":"grain:thread"}}},    // COUNT -> one big fill (crown route)
  {"when":"on-fulfil","do":"draw","params":{"n":2,"suit":"thread"}} ]}
```
**How it chains:** each C1 `fill`s a small need and `draw`s its own replacement, so the thin deck **cycles fast** — many one-shots clear many small askings per morning (the tempo channel). C2 searches the next one-shot and `steady`s the chain so the pace doesn't cool. C3 reads **the count** (`read(grain:thread)` = thread pieces fired this turn) and **the pace** (`read(chain)`) and stacks both into **one big fill** — this is how tempo *becomes* burst for the size-clamped crown. **Every C1/C2 that fired raised the chain and count C3 gets paid by.** Mid-run, count-and-pace is the pressure (proven, §2); the crown is the day it arrives as tonnage. 3 distinct card types + an accumulation loop.

---

#### A4 · The Fairwrights — *the room, spiked* (second wave)

**Identity:** make the watching. Assemble a huge transient crowd, dump it all past a ceiling in one enormous public turn, and the overkill runs to Standing at full rate — the biggest gleam swing in the game, feast-and-famine on a delay.

- **Dominant L3 primitive:** **`gather`** (venue + transient crowd tokens → giant room) + **`brim`** (the *only* card gleam-writer; widens the overkill band). The only archetype built around `brim`.
- **L2 resources:** **R1 attention** as transient crowd (venue-bound, expires when the fair moves) + **R3 Standing** as the payoff (`full-cup-overflow` / `overkill-to-standing`).
- **L4 doors:** **festival-glass & crowd-bound stock** (*"no crowd, no glass"*) + the **Fair draft** + fair-intercept routing. A crowd is an occasion, not a faucet.
- **Risk posture:** **highest variance in the game** — a dead room spills hardest, a full one makes the run.

**Signature chain (depth 3) — the one enormous turn:**
```jsonc
// C1 — Raise the Wain-Stage (dance, venue): seat the whole present crowd (transient); brace the peak
{ "grain":"dance","mark":2,"ceiling":4,"woken_delight":1,"tags":["venue"], "effects":[
  {"when":"on-play","do":"gather","params":{"amount":6}},                                  // seat the whole present crowd: a PRINTED transient venue crowd (expires when the fair moves), NOT read(woken:*)
  {"when":"on-chain","do":"steady","params":{"brace":true}} ]}                              // a needed pause won't cool the ground
// C2 — Pitch the Ring (dance, venue): room begets room; swell the transient crowd
{ "grain":"dance","mark":2,"ceiling":4,"woken_delight":1,"tags":["venue"], "effects":[
  {"when":"on-play","do":"gather","params":{"amount":{"do":"read","source":"room"}}},       // pool += the pool (soft-capped)
  {"when":"on-play","do":"mark-grain","params":{"target":"hand:offgrain","suit":"dance"}} ]}// recruits an OFF-grain hand piece into dance -> seats in the transient crowd
// C3 — The Whole-Fair Turn (dance capstone, high ceiling): dump it all, overkill -> Standing
{ "grain":"dance","mark":8,"ceiling":9,"woken_delight":3,"tags":["capstone"], "effects":[
  {"when":"on-play","do":"rest","params":{"target":"self","amount":{"do":"read","source":"room"}}},  // pour PAST the ceiling
  {"when":"on-overkill","do":"brim","params":{"band":{"do":"read","source":"over-ceiling"}}},        // FIREWALL-LEGAL: genuine overkill only
  {"when":"on-fulfil","do":"whittle","params":{"amount":1}} ]}
```
**How it chains:** C1 seats the whole present audience and braces so the setup pause won't cool it; C2 *reads the room and gathers by it* — the multiplier that turns a big ground into an enormous one (bounded by `the-gathered-room`'s soft cap) — and stamps an off-grain hand piece dance (seating it in the transient crowd). C3 `rest`s that whole pool onto its deliberately-high mark **past the ceiling**, and `brim` widens the genuine-overkill→Standing band, read off **`over-ceiling`** (the measured excess), never the board (`brim(read(spiral))` is uncompilable). The crowd is transient by law, so if the room never assembled, C3 falls short and spills — feast or famine. **The room C1/C2 gather is the exact number C3 pours and brims.** Depth 3.

---

#### A5 · The Mannerly — *the proud, courted* (second wave)

**Identity:** high-power shy-material pieces, each dead in a dim hand until its courtship lands; build the term-state, `court` the proud stuff by it, and the benched proud piece pays spectacularly — Standing is a *pure gate*, never spent.

- **Dominant L3 primitive:** **`court`** (perform a term) reading **gleam as a *pure gate*** (widens the market, **never spent**) + the **chain-state C1 built as the performed term**; the benched proud piece then pays by the **courtship depth** — **`fill read(chain)`** (the deeper the term, the bigger the payoff), *not* `read(grain:<suit>)`. Secondary `mark-grain` opens the grain-gated market width; secondary `rest` on the resulting high-delight proud piece.
- **L2 resources:** **R6 courted stock** (the engine) + **R3 Standing as a *pure gate*** — gleam widens the market, **never depleted by use** (`two-gate-courting`, `mannerly-condition-puzzle`). Highest single-piece ceiling in the game.
- **L4 doors:** **the courting-market** (vouch + performed term) + **introduction-jars** + the bench (proud stock → high-mark pieces). Grain-gated width via `grain-tagged-standing`.
- **Risk posture:** **greedy value / swingy** — a term that goes stale is an asking carried past its season → the spilling (the *only* thing a Mannerly risks: the terms themselves). Dead cards in a dim hand; a wedding when the courtship lands.

**Signature chain (depth 3) — the vouching, the term, the payoff (a courtship-unlock chain):**
```jsonc
// C1 — Keep the Silver Singing (song): build the TERM-STATE (the courtship's depth) + open the song market
{ "grain":"song","mark":2,"ceiling":4,"woken_delight":1, "effects":[
  {"when":"on-play","do":"steady","params":{"links":2,"brace":true}},                            // deepen the chain == singing-silver's performed term (the deeper the courtship, the bigger C3 pays)
  {"when":"on-play","do":"mark-grain","params":{"target":"hand:cheapest","suit":"song"}} ]}      // grain-gated width: opens the song-graded market so C2's court can reach singing-silver (grain-tagged-standing)
// C2 — Court the Singing-Silver (song): gleam VOUCHES as a PURE GATE, the held chain SATISFIES the term
{ "grain":"song","mark":3,"ceiling":5,"woken_delight":2, "effects":[
  {"when":"on-play","do":"court","params":{"stock":"singing-silver",
      "term":{"if":{"do":"read","source":"chain"},"at_least":3}}} ]}                              // gleam = gate (width, never spent); chain = performed term -> proud stock into the pack
// C3 — The Silver Refrain (proud benched song piece, high mark/delight): pays by the COURTSHIP DEPTH
{ "grain":"song","mark":6,"ceiling":8,"woken_delight":5,"tags":["proud"], "effects":[
  {"when":"on-play","do":"rest","params":{"target":"self","amount":{"do":"read","source":"room"}}},
  {"when":"on-wake","do":"fill","params":{"amount":{"do":"read","source":"chain"}}},              // CHAIN-AUTHORED: the deeper the courtship (C1's chain), the bigger the proud piece pays
  {"when":"on-fulfil","do":"draw","params":{"n":1,"suit":"song"}} ]}                              // reload the next courtship
```
**How it chains:** C1 holds and **deepens an unbroken chain** — *singing-silver's own performed term* (`graded-material-market`) — and stamps a hand piece **song**, opening the song-graded market width (`grain-tagged-standing`) so the court can reach the singing-silver. C2's `court` reads **gleam as the vouching gate** (width, never spent — *"a key that turns, never a coin that leaves"*) and reads the **chain-state C1 built** as the performed term, so the proud silver enters the pack — **the courtship landing is the Mannerly's winning moment**. C3 is the proud piece the courtship bought — high fixed mark, high `woken_delight` — and pays by the **courtship depth itself** (`fill read(chain)`: the deeper the term C1 sustained, the more spectacularly the silver refrains), then `draw`s toward the next courtship. **C1 writes the chain both C2's term and C3's payoff read; C2 unlocks C3 into the deck.** Miss the chain and C2's term fails, C3 never enters the deck — dead cards in a dim hand. Depth 3.

---

#### A6 · The Morning-Gleaners — *the grey, harvested* (second wave)

**Identity:** walk *toward* the grey; the engine scales with paleness — richest dawns, ripened compounded needs as harvest — then mend the ground you farmed.

- **Dominant L3 primitive:** **`read(season)` / `read(spiral)`** scaling `gather` / `whittle` (paleness feeds attention/handsels, **never Standing** — the firewall), routed into a **pale-fed room** the capstone clears its need by (**`fill read(room)`**, *not* `read(grain:<suit>)`); the *only* archetype that uses **`soothe`** (the board-writer), elevated here as the **signature payoff** — *mend the ripened ground you just harvested* (node-local, scaled by the rings, capped to the once-per-season last-red catalyst, never touching gleam).
- **L2 resources:** **R4 the Paling** (route the weather) + **R1 the richest dawns** on pale nodes (`dawn-income`, `gleaner-adversity-economy`). *(I-017's valley/hilltop elevation law is discharged in L1's `dawn-income` — **paler node = richer dawn**, the-Green-Going's "learn what this year's valleys answer to"; the geography lever lives in the L1 dawn mechanic, not re-stated as a separate L5 number.)*
- **L4 doors:** **the gleaning-supply** (last-red + twice-benched, richest on pale ground) + the loading-gate (rings-in = load-out: the biggest loads are on the palest towns).
- **Risk posture:** **highest route risk in the game** — one mistimed season is standing in deep grey with an asking too big for tonight's hands; boss-affine, steers the map toward the combing on purpose.

**Signature chain (depth 3) — glean the grey, mend it (payoff magnitude chain-authored; the mend is the marquee; resolves depth-critic P1):**
```jsonc
// C1 — Walk the Pale (glaze): paleness fuels the ROOM and pays money (both firewall-legal)
{ "grain":"glaze","mark":3,"ceiling":5,"woken_delight":2, "effects":[
  {"when":"on-play","do":"gather","params":{"amount":{"do":"read","source":"spiral"}}},  // FIREWALL-LEGAL: rings -> ROOM (never gleam)
  {"when":"on-play","do":"whittle","params":{"amount":{"do":"read","source":"season"}}} ]}// FIREWALL-LEGAL: paleness -> HANDSELS (never gleam)
// C2 — Glean the Ground (glaze): the pale-fed room pre-rests the capstone AND deepens on pale ground
{ "grain":"glaze","mark":3,"ceiling":5,"woken_delight":2, "effects":[
  {"when":"on-play","do":"rest","params":{"target":"held:capstone","amount":{"do":"read","source":"room"}}}, // pale room -> capstone (toward the fixed mark)
  {"when":"on-play","do":"gather","params":{"amount":{"do":"read","source":"spiral"}}} ]} // FIREWALL-LEGAL: deepen the pale-fed room C3 fills by (rings -> room, never gleam)
// C3 — Ripe Mending (glaze capstone): clear the poem by the pale-fed room; then MEND the node you farmed
{ "grain":"glaze","mark":7,"ceiling":9,"woken_delight":3,"tags":["capstone"], "effects":[
  {"when":"on-play","do":"rest","params":{"target":"self","amount":{"do":"read","source":"room"}}},
  {"when":"on-wake","do":"fill","params":{"amount":{"do":"read","source":"room"}}},   // CHAIN-AUTHORED: the pale-fed room C1/C2 built (NOT read(grain:<suit>))
  {"when":"on-fulfil","do":"soothe","params":{"amount":1,"scale":{"do":"read","source":"spiral"},"cap":"last-red"}} ]} // MARQUEE: node-local mend, scaled by the rings, capped to the once-per-season last-red catalyst; never touches gleam
```
**How it chains:** on pale, high-ring ground C1 `gather`s a room *scaled by the spiral rings* (`read(spiral)` → room — legal, never Standing) and `whittle`s paleness into handsels (the adversity money). C2 `rest`s that pale-fed room **onto** the capstone toward its fixed mark and `gather`s **again on the same pale ground** — deepening the very room C3 will fill by, so the payoff is **chain-authored** (a preceding card wrote every surface the capstone reads, never board-handed). C3 dumps the pale-fed room onto the ripened need and `fill`s **by that same room** (`fill read(room)` — the board's paleness reached the payoff *through* the room the chain built), then — the Gleaner's signature moment — `soothe`s the node with last-red, **mending the ripened ground you just harvested**: node-local, its magnitude scaled by the spiral rings but capped to the once-per-season last-red catalyst, and it never touches the gleam meter. **The paleness C1 reads becomes the room C2 deepens becomes the fill C3 clears the crown by — then the mend** — route into grey too early and the room is thin, too late and the need out-scales your hands. Depth 3.

### 2. The Untold's I-022 resolution — tempo escalation matched AND clamped

**The obligation (D-005.3 / I-022):** prove the Untold's count-and-pace pressure numerically matches the spine's size-escalation curve, or clamp it. **We do both** — a match-proof for the mid-run *shape*, a forcing argument that it can't be opted out of, and a hard clamp against dominance at the finale. The **load-bearing legs are the forcing argument (c) and the crown clamp (d)**; the (a)/(b) match is not a derived law but the *shape the game-loop tuning must hit* — a calibration target for the per-leg count coefficients (D-005.3). Executable model: `design/proposals/layer-05/napkin.py` and `napkin_l5.py` (both run, both return `napkin_flags = 0`).

**(a) Match — mid-run pressure ≡ size (per-morning form, A's napkin).** Define *pressure* = demand a player must clear **per worked morning** to keep pace with the weather. A tonnage build faces ~1 rising-size need/morning → pressure = size. The Untold faces **flat-small needs but a rising count** — canon: *"more kettles in every town, sooner, closer together, the pace climbing with the brightness."* Because the lantern is fired to peak-Standing, rising brightness → rising kettle-count. Setting count so demand/morning equals the tonnage demand/morning at every leg:

| Leg | tonnage need | Untold #/morning | tonnage pressure | Untold pressure |
|---|---|---|---|---|
| Green Going | 1 | 0.67 | 1 | **1.00** |
| Long Light | 3 | 2.00 | 3 | **3.00** |
| Deep Gold | 5 | 3.33 | 5 | **5.00** |
| Red Walk | 7 | 4.67 | 7 | **7.00** |

The Untold pressure curve is **monotone rising and equals the tonnage pressure at every leg** — tempo carries the same escalation tonnage does, because count rises on the same brightness clock size does.

**(b) Match — seasonal throughput ≡ `15·s(t)` (B's throughput form, kept as a second leg).** Over a season, the size spine delivers `5 asks × 3·s(t) = 15·s(t)` delight; the Untold, held near the floor (`D≈3`), must clear `5·s(t)` asks to hold a region below the combing threshold → `5·s(t) × 3 = 15·s(t)`. **Identical curve, delivered *fewer-bigger* vs *more-smaller-faster*.**

**(c) Forced, not merely possible.** If the Untold refuses to raise its pace while arrivals scale as `s(t)`, the un-cleared surplus accumulates at `5·(s(t)−1)` rings/season → by Deep Gold (`s≈2.33`) that crosses the combing threshold of 7 → **a great asking (size ≈ 7) forms** (`combing-boss-tier`). *Failing to pay in pace materialises the pressure as size.* The Untold cannot opt out of the curve.

**(d) Clamped at the crown (belt-and-suspenders).** The calendar-floored crown *"reads a country's need, not a town's talk"* — a **size event for every way**. The Untold cannot fractionate an 8–9-need crown into kettles; standing it requires a genuine **burst ≥ crown-size in one stand**, produced by converting *pace into size* within the boss turn (chain A3-C3: `fill read(grain:thread)` / `rest read(chain)`). Two bounds cap it at "matches," never "exceeds": (1) delivered demand never exceeds `D_size` on any leg, so it can never farm more total glad-load than a size build; (2) a physical **pace ceiling** (`MORNINGS = [4,6,7,7,3]` × ≤2 clears) *bites* at the Wintering finale (`C_match ≈ 14.4` clamped to `6`), barring a degenerate late-game.

**Verdict:** the Untold's tempo escalation **matches** the size curve mid-run (per-morning and per-season), is **forced** to it by the spiral-clock, and is **clamped to size** at the crown. I-022 discharged (numeric); exact per-leg count coefficients, the `steady{links}` cap, and the burst-capacity coefficient hand off to game-loop per D-005.3.

### 3. The distinctness argument — six engines, not palette-swaps

Distinctness is enforced by **dominant primitive + dominant resource + win-lever + risk axis**, not by flavor — each row is a different *verb doing the load-bearing work* writing a different *resource surface*, standing the same crown by a *different route*:

| Archetype | Dominant primitive | Dominant resource | Win-route | Payoff carried by | Best-on-axis |
|---|---|---|---|---|---|
| **Kilnfast** | `steady` + `read(woken:<suit>)` | R1 held chain + R5 fired persistence | raw-burst / prepared-board | seated-audience count (cross-turn) | scaling |
| **Eveners** | `retire`→room/table + `whittle` | R2 handsel velocity + R1 table | prepared-board | the fattened room + moving purse | consistency |
| **Untold** | `draw` + cheap exhaust `fill` | R5 deck velocity + contract count | count-stack | thread one-shots fired this turn | tempo |
| **Fairwrights** | `gather`(crowd) + **`brim`** | R1 transient crowd + R3 gleam spike | raw-burst / landed-ceiling | overkill past the ceiling | spike/crown |
| **Mannerly** | **`court`** + term-state | R6 courted stock + R3 gleam-*gate* | landed-ceiling | a court-gated proud piece paying by the term/chain depth (`fill read(chain)`) | ceiling |
| **Gleaners** | **`read(season/spiral)`** + **`soothe`** | R4 the Paling + R1 pale dawns | raw-burst | the pale-fed room (`fill read(room)`) + the node-mend (`soothe`) | route/reward |

**The pairwise separations that matter most** (each resolved by the lever, not the theme):
- **Kilnfast vs Fairwrights** — both end in a big `rest self × room`, but Kilnfast's room is a **persistent cross-turn** seated audience (curve, `read(woken)`, no spike); the Fairwright's is a **transient single-turn** crowd dumped through `brim` (spike). Opposite variance poles. `brim` is the Fairwright's alone.
- **Evener vs Untold** — both exhaust, but `retire→room/table` (Evener: R2/R1 *conversion*) vs cheap one-shot exhaust (Untold: contract-count *pace*). Canon's own dividing line; different dominant resource entirely.
- **Gleaner vs Evener** — both feed the table, but the Gleaner's fuel is the **world's** paleness (`read(season/spiral)`, external, high route-risk); the Evener composts its **own** dead cards (`retire`, self-sourced, low variance). Import vs manufacture; only the Gleaner uses `soothe`.
- **Mannerly vs everyone** — the only engine gating on **`court`** with a single benched proud piece as payoff; R6 is a dominant resource for no one else. Uniquely highest ceiling.
- **Untold vs everyone** — the only build whose *pressure axis* is count-and-pace rather than tier (§2). It reads `grain:<suit>` as a **count** into its fill — an idiom that, after the L5 differentiation pass, exactly **two** builds keep (Untold `read(grain:thread)`, Kilnfast `read(grain:joinery)`); the Untold is set apart not by that grain-fill but by count-and-pace as its pressure axis.

The napkin (`napkin.py`, `napkin_l5.py`) confirms structurally: **dominated pairs = ∅** (no archetype ≥ every other on all six lever-axes), **each is strictly best on exactly one axis**, and totals sit in a **7-point band** (Gleaners 44 → Fairwrights 37) — power parity, differentiation by *shape*. Distinct win-levers, not re-skinned stat-sticks.

**Intuitiveness (`intuitiveness ≥ 0.8`).** Each identity is predictable from its Walking-Way name + the world's logic: *Kilnfast* (fired-in-the-kiln, permanent) → the compounding fired-audience deck; *Eveners* (keep the evening / un-hoard) → the retire-and-circulate deck; *Untold* (outrun the tale) → the thin fast tempo deck; *Fairwrights* (make the watching) → the crowd-spike deck; *Mannerly* (courtship, mind your conditions) → the `court`-the-shy-stuff deck; *Gleaners* (glean the pale left-behind) → the paleness-scaling deck. No class menu — the country teaches you in via grain. **Claimed ≥ 0.8.**

### 4. Minimum synergy_depth across archetypes

Every signature chain is spelled as **interacting cards where an earlier card writes the shared-state number a later card reads** — order-and-state sensitive; the same cards in a broken order under-fill. Where the depth critic flagged a payoff magnitude *board-authored* rather than chain-authored (the Gleaner in all three proposals) or a *satellite* card not feeding the payoff (the Evener), the synthesis restructured the chain so a preceding card writes the surface the capstone reads (Gleaner C1/C2 `gather read(spiral)` write the **pale-fed room** the capstone fills by; Evener C1 `retire→room` + C2 `steady` both feed C3's `rest`):

| Archetype | chain length | the read-write spine |
|---|---|---|
| Kilnfast | **3 + loop** | fired-audience → `read(woken:joinery)` → `gather` → clear mark → fire again (cross-turn) |
| Eveners | **3** | `retire`→room + `steady`→chain → `rest read(room) × chain` → fill |
| Untold | **3 + loop** | cheap `fill`+`draw` cycle → count/pace → `read(grain:thread)/read(chain)` → one big fill |
| Fairwrights | **3** | crowd `gather` → room → `rest` past ceiling → `brim read(over-ceiling)` |
| Mannerly | **3** | `steady`→chain (term-state) → `court` term (gleam-gate) → proud piece unlocked → `fill read(chain)` |
| Gleaners | **3** | `read(spiral)`→room → `rest`→capstone → `fill read(room)` → `soothe` the node |

**Minimum synergy_depth across archetypes = 3** (Eveners, Fairwrights, Mannerly, Gleaners at 3; Kilnfast, Untold at 3 distinct card types + an accumulation loop). Gate `synergy_depth ≥ 3` **cleared.**

### 5. Napkin verification (`napkin_flags = 0`)

Both executable models run and return `napkin_flags = 0`:
- **Viability** — all six stand the crown, and by **four different routes** (Kilnfast/Gleaner/Fairwright by raw burst, Evener by prepared board, Untold by count-stack, Mannerly by landed ceiling); viability is not a palette-swap of one crown solution.
- **Non-domination** — dominated pairs = ∅; each archetype uniquely best on exactly one axis; total-power band = 7 points (no runaway generalist).
- **≥3-card chains** — min synergy_depth = 3 (§4).
- **Untold I-022** — mid-run pressure rising-and-matched (`15·s(t)` / per-morning), forced by the spiral-clock, clamped to size at the crown (§2).

**Known limitation (advisory → game-loop).** The napkins execute over **hand-authored ordinal vectors**, so the balance is *asserted*, not *derived* from card-level simulation. This fixes the SHAPE the tuning must preserve; game-loop owns the derivation and the exact coefficients (per-leg count coefficients, the `steady{links}` cap, the burst-capacity/crown coefficient, the six axis magnitudes) — numbers, not structural holes.

### 6. Critic resolutions & verification

- **P1 · Evener `read(handsels)→gather` breaches the LOCKED R1/R2 laws (world-coherence, A) — RESOLVED.** A's defining Evener lever "the purse becomes the room" made handsels a bank/substitute for attention (violating *"attention can't be banked… no substitute"* and *"handsels live between turns, never inside one"*). The synthesis adopts **C's canon-clean Evener**: the room is fattened by **`retire`→room** (C1) and the capstone rests that room × the **chain** (C2's `steady`); **`whittle read(room)`→handsels** is the money-velocity output (money produced FROM the room, never room produced from money). No purse→room; R1/R2 laws hold. ✔ (§A2)
- **P1 · Gleaner "combo" collapses to 2 into-payoff cards, payoff board-authored (depth-balance, all proposals) — RESOLVED.** The capstone's `fill read(spiral)` read a board surface no chain card wrote. Restructured: C1 `gather read(spiral)` routes paleness **into the room** (a chain surface) and C2 `rest read(room)` + `gather read(spiral)` pre-rest the capstone while **deepening that same room**, so C3's `fill read(room)` magnitude is **chain-authored** (a preceding card wrote every surface the capstone reads), and the node-mending **`soothe` is now the Gleaner's marquee payoff**. Route-risk / adversity-economy identity intact (paleness still drives the payoff, now through the chain). ✔ (§A6, §4)
- **P1 · Evener satellite card not feeding the payoff (depth-balance) — RESOLVED.** In the reworked chain **both** preceding cards feed C3's `rest`: C1's `retire→room` grows the pool, C2's `steady` grows the chain that multiplies the wake; `whittle`→handsels is the identity output riding on C2, not an unconnected satellite. ✔ (§A2)
- **P2 · Untold/Evener merge blurs the LOCKED canon distinction (world-coherence, B's Pillar 3) — REJECTED B's consolidation.** WORLD.md separates them explicitly (Evener exhaust = conversion, Untold exhaust = pace). The synthesis keeps them as two distinct archetypes on two distinct dominant resources (§0, §A2/§A3), as A and C both do; no "tempo-velocity" chimera. ✔
- **P2 · Fairwright's `brim`-spike mis-assigned to the Kilnfast (world-coherence, B's Pillar 1) — REJECTED B's inversion.** `brim`/overkill is reserved to the **Fairwrights** (`overkill-to-standing`); the Kilnfast fills by grain-count with **no spike** (canon *"no spike turn"*, `kilnfast-tall-permanence`). The-fairwrights is restored as a distinct archetype, sole `brim`-owner. ✔ (§A1, §A4)
- **P3 · Kilnfast cross-turn compounder mis-sourced as `read(grain:joinery)` (world-coherence, C) — RESOLVED by using A's source.** The cross-turn fired-audience read is **`read(woken:joinery)`** (the persistent seated store), not `grain:joinery` (this-turn suit-tags). ✔ (§A1)
- **P3 · Fairwright `brim` band source (world-coherence, firewall) — TIGHTENED.** The band reads **`over-ceiling`** (the measured genuine-overkill surface), the tightest firewall-legal source; `brim` can never exceed real overflow, never reads a board surface. ✔ (§A4)
- **P3 · `draw{suit:"riverwood"}` filters by a material grade not a craft-suit (world-coherence, B) — AVOIDED.** The Mannerly's search filters by a real craft-suit (`draw{suit:"song"}`); no material name is overloaded as a suit. ✔ (§A5)
- **Gates:** `synergy_depth ≥ 3` — min **3** (§4) ✔ · `napkin_flags ≤ 0` — **0** (§5) ✔ · `intuitiveness ≥ 0.8` — each identity legible from Way-name + world logic, no class menu (§3) ✔ · every archetype composes FROM the 14 L3 primitives, traces to a Walking Way, leans a distinct L2 resource + L4 door (§0–§1) ✔ · fixed marks never moved, `brim` firewalled, `read(season/spiral)` feeds room/handsels/fill never gleam, `court` reads gleam as a gate never spends it, `retire`/`soothe` node-local, no fifth token (§1, §6) ✔.
- **No P0** raised; the locked spine (D-001), every LOCKED L1 mechanic, the LOCKED L2 resource square, the LOCKED L3 vocabulary, and the LOCKED L4 acquisition model are all affirmed.

### 7. Named Layer 5 archetype elements

| id | Walking Way | one-line lever | traces to |
|---|---|---|---|
| **`archetype-kilnfast`** | the-kilnfast | *the fired, held* — `steady` + `read(woken:<suit>)` compound a run-permanent audience floor; low variance, boss scaling, no spike. | `kilnfast-tall-permanence`; `fired-vs-held`; `walking-ways-cardpools` |
| **`archetype-eveners`** | the-eveners | *the purse, moving* — `retire`→room/table + `whittle`→handsels; conversion velocity, low-and-steady; never purse→room. | `evener-sacrifice-velocity`; `handsel-currency-decay`; `the-returning-table` |
| **`archetype-untold`** | the-untold | *the pace, ratcheted* — thin `draw`/exhaust one-shots; count-and-pace as pressure, `fill(read count/chain)` at the crown (I-022). | `untold-ratchet-tempo`; `escalating-contracts`; `combing-boss-tier` |
| **`archetype-fairwrights`** | the-fairwrights | *the room, spiked* — `gather`(transient crowd) + `brim`; one enormous overflow turn, highest variance. | `fairwright-multiplier-spike`; `overkill-to-standing`; `fair-hub-intercept` |
| **`archetype-mannerly`** | the-mannerly | *the proud, courted* — `court` a term-state to unlock one high-power proud piece; gleam a pure gate, never spent. | `mannerly-condition-puzzle`; `two-gate-courting`; `graded-material-market` |
| **`archetype-gleaners`** | the-morning-gleaners | *the grey, harvested* — `read(season/spiral)` into a **pale-fed room** the capstone clears by (`fill read(room)`); `soothe` the ground you farmed as the signature payoff; highest route risk. | `gleaner-adversity-economy`; `pale-route-harvest`; `paling-clock` |
| **`the-lever-census`** | — | The count justification: six L2-square levers, six Walking Ways one-to-one; tiered 3 (Kilnfast/Eveners/Untold) + 3 (Fairwrights/Mannerly/Gleaners) for onboarding, all six shipped. | `walking-ways-cardpools`; `grain-tagged-standing`; L2 `the-resource-square` |
| **`the-untold-clamp`** | the-untold | The I-022 resolution: tempo pressure matches the size curve mid-run (`15·s(t)` / per-morning), forced by the spiral-clock, clamped to size at the crown by a demand-cap + a physical pace ceiling. | `untold-ratchet-tempo`; `escalation-is-the-weather`; `crown-finale-scheduling` |

## Layer 6 — numbers_curves

**Gate (AUTO, no human gate):** `napkin_flags ≤ 0` (engine-run `design/napkin/layer-06.py`) · `decisions_per_turn ≥ 3` (blind audit). Every coefficient traces to a LOCKED L1/L2/L4/L5 mechanic or a WORLD.md id — no generic fantasy defaults. Game-loop tunes exact values; the napkin fixes the *shape* the tuning must preserve (small seeded jitter where a margin is load-bearing). Effect = metaphor throughout.

**Synthesis basis.** The winning set takes the *kettle-to-crown* proposal's dawn/room curve, six-grain starting spread, integer handsels, explicit gleam-firewall line, and I-022 clamp shape; grafts on *taut-curve*'s fitted axis magnitudes, I-044 coefficients, and full-rate-overkill-to-a-band. Both proposals' shared leaks are closed here: the ring-indexed dawn faucet is capped below the weather, the whittle faucet is stock-bounded and tempo-costed, the Untold crown-clamp is reconciled (two quantities, stated apart), and the late-game reach-vs-safe choice is preserved rather than forced maximal (§9).

### 1. Deck & hand

Start **7 apprentice-tier journey-pieces**, all six craft-grains present so *grain emerges by play, not a class menu* (`grain-tagged-standing`); the run also seats **one home-note audience-thing** (a +1 room floor from morning 1, so the thinnest Green room is never below 3 — §8).

| count | grain | mark | ceiling | woken_delight |
|---|---|---|---|---|
| 2 | joinery (home craft, doubled) | 1 | 2 | 1 |
| 1 | thread | 1 | 2 | 1 |
| 1 | dough | 1 | 2 | 1 |
| 1 | song | 2 | 3 | 1 |
| 1 | glaze | 2 | 3 | 1 |
| 1 | dance | 2 | 3 | 1 |

- **Hand size 5.** Dawn refills the hand to 5 each worked morning (no carryover); unplayed pieces **RETURN via `the-returning-table`** to this node's local table (conservation — never discard-to-void). On-dawn draw effects add on top.
- **Deck-size curve by leg-end:** `[7, 9, 14, 18, 20]` (Green Going → Long Light → Deep Gold → Red Walk → run-end), Wintering persists **1 bead** to the meta-layer.
- **Gross influx ≈ 20/run** (~1 taught piece per answered asking, ~20 answered, L4) **+ a bounded Fair burst**; **net thinning 6–10/run** (retire + waymeet-gift + one-shot exhaust).
- **Fair draft (k-of-N):** **k=2 of N=5** shown, **1–2 windowed intercepts/run** (1 guaranteed Long Light + up to 1 Deep Gold); the draft raises a rung AND drafts in one act, bounded so it is never a card-shop.

### 2. Per-tier waking-marks, need-fills, woken-delight

Marks/ceilings read straight off the L5 example cards and are **FIXED — no primitive lowers them; the only lever is bringing more room** (`the-waking-mark`).

| tier | mark | ceiling | woken_delight | attention-to-wake (SET) |
|---|---|---|---|---|
| apprentice | 1–2 | 2–3 | 1 | rest ≥ mark |
| mid | 3–5 | 5–6 | 2 | rest ≥ 3–5 |
| proud | 6–7 | 8 | 3 (5 on the Mannerly proud song) | rest ≥ 6–7 |
| capstone | 7–8 | 8–9 | 3–5 | rest ≥ 7–8 |

- **Twice-benched** wakes at **0.9×** fresh SET (the single canon discount), a one-way **terminal** grade (no stock regeneration on retire).
- **Need-fill sizes by leg** (kettle → great, scaling to crown): Green kettle **1**, Long **3**, Deep Gold poem **5**, Red Walk great **7**, crown **8–9 delivered / 10 demanded**. Fill examples: kettle 1 = 1 apprentice (wd1); poem 5 = 1 proud (wd3) + 1 mid (wd2) or 1 capstone (wd5); great 7 = 1 capstone (wd5) + 1 mid (wd2).

### 3. The seasonal seep / crown curve

The spine is the weather (L1 §5). `MORNINGS=[4,6,7,7,3]` (27 worked mornings); per-morning size-need floor `PER_MORNING_NEED=[1,3,5,7]`; season multiplier `S_OF_T=[1.0,1.667,2.333,3.0]`; season-summed need `[6,18,32,50]` (L4 calibration).

- **Spiral-ring schedule** (`the-spiral-clock`): **3 = a plea, 5 = a poem, 7 = a great asking being born**; one ring per skipped season per node; **`COMBING_THRESHOLD = 7`** summed rings → a great asking.
- **Crown floor by furthest leg reached:** `[3, 5, 7, 10]` (calendar-floored, route-independent); **`CROWN_DEMAND = 10`**; a size-build's raw crown tonnage **`CROWN_SIZE_DELIVERY = 8.5`** — the 8.5→10 gap is closed by *the whole engine* (chain multiplier + overkill-to-band + count-stack), never by one card. **Pace-ceiling:** `MORNINGS[-1] × 2 = 6` clears in the finale.
- **Dawn income** (`dawn-income`, R1): **flat base 2** (guaranteed to wake the cheapest mark-1 piece — no decision-free morning) **+ local-table draw `0.5 × spiral_rings`** (paler node = richer dawn, but **capped 0.5/ring — strictly below the difficulty floor `1.0·s(t)`, so banking a skipped-node ring can never out-pay the weather**, §9) **+ node-local return** (up to ⅔ of yesterday's RETURN if camped) **+ the home-note seat (+1)**. Typical Green room **3–4**; a matured Red Walk **camped** node runs **~13 room + seated audience (softcap ~10) ≈ 20 working room**, so ordinary late mornings keep slack (matured raw delivery ~9–9.5 vs need 7) and only the single crown morning is forced-maximal.

### 4. Standing (gleam) values + the firewall

- **Overkill → Standing:** **full rate 1.0 for the first 6 points past a ceiling per play** (the diminishing_band), then **0.5** beyond — closing bank-then-dump while the on-stage swing stays the biggest in the game (`full-cup-overflow`). Max single dump = `6 + 0.5·excess`.
- **Glad-palm / kettle increment = 1**; **delayed-telling increment 1–2** (lands only when *seen* landing).
- **Gathered-room softcap:** the nth seated audience-thing contributes `2 × 0.8^(n-1)` room → plateaus at **~10** (`the-gathered-room`, closes the snowball).
- **Gleam bands (showing-height / market-width):** `0` = Standing-zero → the Quiet Walk (all but apprentice materials refuse); `1–5` dim (apprentice + first mid vouches); `6–12` warm (mid stock, proud stalls begin to lean in, poems offerable); `13–20` bright (proud stock full width); `21+` singing (capstone / festival-glass, crown-scale teaches).
- **Standing-zero = numeric 0**, the fail-state, any season.
- **The firewall (LOCKED, explicit).** `read(season|spiral)` feeds **room / handsels / fill only — NEVER the gleam meter**; the Paling never touches it. Filter-1 sizes the asking **TIER = max( one-way ratchet on PEAK gleam , the seasonal-seep minimum )** — two *independent* inputs into the need-**size** (the places-pale board channel); the **gleam meter itself is never floored or touched by weather**. Filter-2 offers are gated by **current** gleam (the spiral descends the ladder). Court reads gleam as a gate **never spent**.

### 5. Handsel / decay rates

- **Denominations by wakefulness (integer, mint-clean):** dull **1** / warm **2** / singing **3**. Whittle yields **1 dull**; brightening comes only from circulation.
- **Whittle is bounded (no soft-mint):** whittling **costs 1 play (tempo ≥ the trade cost)**, is **capped 1 dull/morning**, and **consumes one apprentice-stuff** (inventory-bounded faucet, not a free attention faucet, §9).
- **Glad-price brightening = 0.5/trade `< 2` tempo cost (I-044):** buying a teaching is never arbitrage vs answering an asking — net-EV(buy) = +1 inert piece − 2 tempo + 0.5 bright `<` net-EV(answer) = +1 taught piece + glad-load (bright handsels + jar + intel) − 2 tempo, across all gleam bands.
- **Idle-lapse:** −1 denomination-step per idle morning; full lapse after 3 idle mornings → the gloaming-table → **tomorrow's dawn income (the ONLY sink)**. No debt / fee / wage / coin-for-gleam.
- **`the-shavings-share` = 0.333 of the play's RETURN** (a bound sub-portion carved, not minted).

### 6. The six archetype axis magnitudes + Untold I-022

Axis order `[scaling, consistency, tempo, spike, ceiling, route]`. Each archetype carries a **unique 10 in its own column** (strictly best on exactly one L5-§3 axis) and `<10` in every other, so **no row dominates another → dominated pairs = ∅ by construction**. Totals sit in a **4-pt band [37–41]** (≤8 required).

| archetype | scaling | consistency | tempo | spike | ceiling | route | total | best-on | crown mag | stand-rate |
|---|---|---|---|---|---|---|---|---|---|---|
| Kilnfast | **10** | 8 | 3 | 4 | 7 | 5 | 37 | scaling | 11.5 | .95 |
| Eveners | 6 | **10** | 7 | 3 | 5 | 6 | 37 | consistency | 10.3 | .99 |
| Untold | 6 | 8 | **10** | 4 | 4 | 7 | 39 | tempo | 10.2 | .82 |
| Fairwrights | 6 | 2 | 4 | **10** | 9 | 6 | 37 | spike | 12.5 | .70 |
| Mannerly | 7 | 5 | 5 | 6 | **10** | 6 | 39 | ceiling | 12.0 | .85 |
| Gleaners | 7 | 4 | 6 | 7 | 7 | **10** | 41 | route | 11.0 | .78 |

- **Crown magnitudes** all `≥ CROWN_DEMAND 10` and `< runaway 14`; **crown_stand_rates .70–.99** map to L5's band. Routes: Kilnfast prepared-board/raw-burst, Eveners prepared-board, Untold count-stack (clamped), Fairwrights raw-burst/landed-ceiling, Mannerly landed-ceiling, Gleaners pale-fed room-burst.
- **Untold I-022 (calibrated).** `UNTOLD_COUNT = [0.67, 2.0, 3.33, 4.67]`, `D = 1.5` → per-morning pressure `count×D = [1.005, 3.0, 4.995, 7.005] ≈ [1,3,5,7]` (**MATCH**, ±<1%, monotone). Season throughput `= 15·s(t) = [15,25,35,45]`. **FORCED:** cumulative refused surplus `cumsum(5·(s−1)) = [0, 3.33, 10.0, 20.0]` crosses `COMBING_THRESHOLD 7` **during Deep Gold** (3.33 < 7 ≤ 10.0). **CLAMPED (two quantities, reconciled):** the raw count-stack `14.4` (runaway) is (a) **demand-capped on the count channel to `≤ CROWN_SIZE_DELIVERY 8.5`** and (b) **pace-ceiled to `6` clears** (`MORNINGS[-1]×2`); the *final* Untold crown magnitude `10.2` = clamped-count (8.5) **+ chain/overkill on top** — clearing demand via the engine, not raw count, and staying `< 14`.

### 7. Diegetic naming (I-016, LOCKED ban)

WORLD.md I-016 bans **"market" / commerce-vocab** as an in-world metaphor. M1 (the courting stalls) renders diegetically as **the-courting / the-vouching / the-stalls-that-lean-in** — never an in-world "market". The design-label **`graded-material-market`** is retained as a **ledger id only** (never diegetic prose). Recorded as terms.json additions.

### 8. The decisions-per-turn argument (≥ 3)

A worked morning affords **≥ 3 meaningful choices**, each with ≥ 2 real options. Honest per-morning axes, after the critics' correction that route is not free every turn:

- **(a) PLAY-SUBSET** — which 3–4 of a hand of 5 to perform. The six-grain starting spread makes this a real **grain-vs-grain** choice against grain-tagged askings even in Green (≥ 3 viable subsets). *Always active.*
- **(c) ROUTE / NEED** — the pack **always carries ≥ 2 answerable needs**: the node's standing **doorstep kettle asking is always present** plus **≥ 1 carried accepted asking** (`accept-by-hand`). Work-here-vs-trust-forward-to-ripen is therefore a genuine choice **every** morning (credited only because ≥ 2 needs are guaranteed present). *Always active.*
- **(b) CHAIN-ORDER** — back-to-back to hold the pool vs a deliberate stall/brace. Materially matters once a later big play consumes pooled room; **activates ~Deep Gold** (early chains of 2–3 apprentice links, m ≤ 1.5, are near-null). 
- **(d) REACH-vs-SAFE** — dump the room past a ceiling for overkill→Standing (grow, risk the spilling) vs safe-fill under the mark. **Activates once room > ceiling + 2.**

Even the thinnest Green morning (room 3–4, base 2 + home-note seat) affords **2** (a + c; neither (b) nor (d) fires in Green), rising to **4** by Deep Gold; a matured Deep Gold / Red Walk morning multiplies to **4**. **Conservative median = 4 ≥ 3.**

### 9. Critic resolutions

- **P1 · thin Green collapse (depth).** Dawn = base 2 + home-note seat (+1, run-start) + local draw → Green room **3–4** guaranteed; (a)+(c) hold at ≤ 3 links, so the honest per-morning floor is 2 (a + c), with the median across 27 mornings at 4.
- **P1 · route over-counted (depth).** Route (c) is credited only under the guaranteed ≥ 2 answerable needs (doorstep kettle + ≥ 1 carried); the median is rebuilt on (a)+(c) as the always-on pair, (b)/(d) as the conditional third.
- **P1 · ring-indexed dawn out-scales I-018 (degenerate).** Dawn local-draw capped **0.5/ring** — strictly below `1.0·s(t)` for all `s∈[1,3]`; a skip-ripened ring can never out-pay the weather.
- **P1 · unbounded whittle mint (both).** Whittle now **costs 1 play, caps 1 dull/morning, and consumes an apprentice-stuff** — an inventory-bounded, tempo-costed faucet, no free attention.
- **P2 · filter-1 firewall (world-coherence).** Offer **TIER = max(peak-gleam ratchet, seasonal floor)** as two independent inputs into the need-**size** (board channel); the gleam meter itself is never floored by weather. Explicit firewall line adopted.
- **P2 · I-018 fragile margin (world-coherence).** Δwaking-capacity/morning ≤ **0.3** (soft-cap-derived, decaying ~0.4→0.2, ~6 total over 27 mornings) vs Δdifficulty/ring `1.0·s(t) ∈ [1,3]` → margin **≥ 3.3×, widening**, robust to ±10% jitter.
- **P2 · Untold crown-clamp unreconciled (world-coherence + degenerate).** Stated as two quantities: count channel clamped **≤ 8.5** (demand-cap) and **6 clears** (pace-ceiling); final crown **10.2** via chain/overkill, `∈ [10,14)`.
- **P2 · non-strict dawn-per-ring at s=1 (degenerate).** Same 0.5/ring cap resolves it (0.5 < 1.0 even at s=1).
- **P2 · per-season surplus mis-stated (degenerate).** Restated **cumulative** `[0,3.33,10.0,20.0]`, crossing combing 7 during Deep Gold.
- **P2 · P-tight forces maximal late line (depth).** Ordinary matured Red Walk delivery **~9–9.5 vs need 7** (slack preserved); only the crown morning (demand 10) is forced-maximal. Richer late room (softcap ~10, camped ~20) grafted.
- **P3s.** Integer handsels 1/2/3 (not 0.5/1/1.5); soothe = **min(rings, 2)** and **removes the ring-indexed dawn/harvest that node accrued** (no retained skip-capacity); (b) acknowledged as ~Deep Gold-on, (a) carried early by the six-grain spread.

### 10. Named Layer 6 elements

| id | value / coefficient | traces to |
|---|---|---|
| **`dawn-floor-base`** | flat base **2** (guarantees cheapest wake) | `dawn-income` / L1 §2.1 |
| **`the-home-note-seat`** | run-start +1 room seat (Green room ≥ 3) | `the-gathered-room` / L1 §5 |
| **`dawn-ring-draw`** | local-table draw **0.5 × rings** (capped < `1.0·s(t)`) | `the-returning-table` / I-018 |
| **`the-fixed-marks`** | apprentice 1–2 / mid 3–5 / proud 6–7 / capstone 7–8; never lowered | `the-waking-mark` / L5 |
| **`twice-benched-discount`** | 0.9× fresh SET, terminal, no regen | `the-twice-benched` / L2 R6 |
| **`per-morning-need`** | `[1,3,5,7]`; summed `[6,18,32,50]`; `S_OF_T=[1,1.667,2.333,3]` | `escalation-is-the-weather` / L4 |
| **`the-spiral-schedule`** | 3 plea / 5 poem / 7 great; combing = 7 | `the-spiral-clock` |
| **`the-rising-crown-floor`** | floor `[3,5,7,10]`; demand 10; delivery 8.5; pace-ceiling 6 | `crown-finale-scheduling` |
| **`overkill-band`** | full rate 1.0 for 6 pts past ceiling, then 0.5 | `full-cup-overflow` |
| **`gathered-room-softcap`** | nth seat = `2·0.8^(n-1)`, plateau ~10 | `the-gathered-room` |
| **`gleam-bands`** | 0 / 1–5 / 6–12 / 13–20 / 21+ | `diegetic-standing-readout` |
| **`the-gleam-firewall`** | tier = max(peak-gleam, weather-floor); meter never weather-touched | `grain-tagged-standing` / L1 §4 |
| **`handsel-denominations`** | dull 1 / warm 2 / singing 3 (integer) | `handsel-currency-decay` / L2 R2 |
| **`the-bounded-whittle`** | 1 dull/morning, costs 1 play, consumes 1 apprentice-stuff | `handsels` / mint-ban |
| **`glad-price-bound`** | brightening 0.5 < tempo 2 (I-044) | `the-glad-price` / I-044 |
| **`idle-lapse`** | −1 step/idle morning → dawn (only sink) | `handsel-currency-decay` |
| **`the-shavings-share`** | 0.333 of RETURN | `bright-shavings-byproduct` |
| **`the-axis-matrix`** | 6×6, band 4 [37–41], unique-10/column, ∅ dominated | L5 archetype axes |
| **`untold-coefficients`** | count `[0.67,2,3.33,4.67]`, D 1.5, clamp 8.5/6→10.2 | I-022 |
| **`last-red-cap`** | soothe min(rings,2), 1 node/1 knack/1 season, removes ring-dawn | `pale-route-harvest` / I-045 |
| **`red-thread-unlock`** | 1 proud intro → 1 capstone, once/run; ≤ 2 red-thread-days/run | `red-thread-marker` / I-045 |
| **`retire-residual`** | this-cycle unspent only; cycle net material −1, attention < 0 | `the-twice-benched` |
| **`fair-draft`** | k=2 of N=5, 1–2 intercepts/run | `walking-ways-cardpools` |
| **`the-courting-renames`** | market → the-stalls-that-lean-in; courting-market → the-vouching; graded-material-market → the-courting | WORLD.md I-016 |

## Layer 7 — starter_pool

The country hands every player the same seven-piece apprentice hand, then teaches them into one of six grain-tagged builds. Every card below is declarative data over the 14 L3 primitives; `mark`/`ceiling` are **fixed** (LOCKED L1) and every signature C1/C2/C3 reproduces its L5 pseudocode number **verbatim** — the tier bands of L6 §2 govern only the *supports* we add around the spine, never the locked signatures. Every `read(...)` source is in the closed enum `{room, chain, fill, season, spiral, grain:<suit>, woken:<suit>, handsels, over-ceiling}`; the only gleam-writer anywhere in the pool is the single `brim` on the Fairwrights capstone (band reads `over-ceiling`), preserving the L4 firewall and the "only archetype built around `brim`" identity. In each chain, every load-bearing number on the payoff card is a `read` of shared state an earlier card wrote — a combo engine, order-and-state sensitive.

### 1. The shared apprentice starting deck (7 cards, L6 §1 composition, hand 5)

| id | name | grain | m / c / wd | effect | combo hook |
|---|---|---|---|---|---|
| `sprig-trestle` | Sprig Trestle | joinery | 1 / 2 / 1 | `gather read(grain:joinery)` | writes room; reads grain:joinery |
| `pegged-bench` | Pegged Bench | joinery | 1 / 2 / 1 | `steady links:1` | writes chain |
| `loose-thread` | Loose Thread | thread | 1 / 2 / 1 | `keep` | **non-combo baseline** |
| `kettle-loaf` | Kettle-Loaf | dough | 1 / 2 / 1 | `warm n:1` | **non-combo baseline** |
| `hearth-hum` | Hearth-Hum | song | 2 / 3 / 1 | `gather read(grain:song)` | writes room; reads grain:song |
| `grey-bowl` | Grey Bowl | glaze | 2 / 3 / 1 | `gather read(grain:glaze)` | writes room; reads grain:glaze |
| `first-step` | First Step | dance | 2 / 3 / 1 | `gather read(grain:dance)` | writes room; reads grain:dance |

Exact L6 §1 make-up: 2 joinery(m1,c2,wd1), 1 thread(m1,c2,wd1), 1 dough(m1,c2,wd1), 1 song(m2,c3,wd1), 1 glaze(m2,c3,wd1), 1 dance(m2,c3,wd1). The two legible no-combo floors (`keep`, `warm`) are the mandated baseline self-modifiers; the other five each write `room` or a `grain:<suit>` count another card reads, so a newcomer can play any of them alone yet each is already a hook.

### 2. Per-archetype starter cards (locked L5 spine + reachability supports)

Each archetype ships its 3 locked signature cards (C1/C2/C3, numbers verbatim from L5) plus 4 supports: a suit-filtered `on-dawn` **draw-fixer** (the only non-combo support, cycling the pack toward the capstone), a **second combo line**, and **on-ramps** that make the archetype's signature *verb* reachable before the mark-7/8 capstone resolves.

#### A1 · Kilnfast (joinery) — the fired, held

| id | name | m / c / wd | role | effect |
|---|---|---|---|---|
| `setterby-trestle` | Setterby Trestle | 2 / 4 / 1 | **C1** (locked) | `gather read(woken:joinery)` + `steady links:1 brace` |
| `calipers-at-the-bench` | Calipers at the Bench | 3 / 5 / 2 | **C2** (locked) | `rest→held:capstone read(room)` + `mark-grain hand:offgrain joinery` |
| `the-fired-beam` | The Fired Beam | 7 / 8 / 3 | **C3 capstone** (locked) | `rest self read(room)` + `fill read(grain:joinery)` + `steady brace` |
| `bank-the-coals` | Bank the Coals | 3 / 5 / 2 | turn-1 room floor | `gather read(grain:joinery)` + `steady links:1` |
| `seasoned-timber` | Seasoned Timber | 3 / 5 / 2 | second line | `rest self read(room)` + `mark-grain hand:offgrain joinery` |
| `keep-the-kiln` | Keep the Kiln | 2 / 3 / 1 | chain-holder | `steady brace` + `keep` |
| `dovetail-draw` | Dovetail Draw | 3 / 5 / 2 | draw-fix (non-combo) | `on-dawn draw n:1 suit:joinery` |

`bank-the-coals` gives Kilnfast a turn-1 `read(grain:joinery)` room source so its opener does not stall on an empty `woken:joinery` (0 at open); `woken:joinery` then compounds from turn 2 as fired pieces seat.

#### A2 · Eveners (dance/thread) — the purse, moving

| id | name | m / c / wd | role | effect |
|---|---|---|---|---|
| `the-last-lighting` | The Last Lighting | 3 / 5 / 2 | **C1** (locked) | `retire inert:hand→room` + `retire inert:pack→table` |
| `bright-hand-to-hand` | Bright Hand to Hand | 3 / 5 / 1 | **C2** (locked, thread) | `whittle read(room)` + `steady links:1` |
| `even-the-rim` | Even the Rim | 6 / 8 / 3 | **C3 capstone** (locked) | `rest self read(room)` + `on-fulfil draw n:2` |
| `waymeet-gift` | Waymeet Gift | 2 / 3 / 1 | thin-as-gift | `retire inert:hand→table` + `steady links:1` |
| `the-turning-purse` | The Turning Purse | 3 / 5 / 1 | second line | `whittle read(room)` + `draw n:1` |
| `even-fuel` | Even Fuel | 2 / 3 / 1 | on-ramp | `retire inert:hand→room` + `steady links:1` |
| `quick-feet` | Quick Feet | 3 / 5 / 2 | draw-fix (non-combo) | `on-dawn draw n:1 suit:dance` |

#### A3 · Untold (thread) — the pace, ratcheted

| id | name | m / c / wd | role | effect |
|---|---|---|---|---|
| `paper-bird` | Paper-Bird | 1 / 2 / 1 | **C1** (locked, one-shot) | `fill read(grain:thread)` + `draw n:1 suit:thread` |
| `quick-hand` | Quick-Hand | 2 / 3 / 1 | **C2** (locked) | `draw n:1 suit:thread` + `steady links:1 brace` |
| `the-standing-count` | The Standing Count | 4 / 6 / 2 | **C3 capstone** (locked) | `rest self read(chain)` + `fill read(grain:thread)` + `on-fulfil draw n:2 suit:thread` |
| `thread-the-needle` | Thread the Needle | 2 / 3 / 1 | count-writer | `mark-grain hand:offgrain thread` + `draw n:1 suit:thread` |
| `swift-tally` | Swift Tally | 1 / 2 / 1 | second line (one-shot) | `fill read(grain:thread)` + `draw n:1 suit:thread` |
| `keep-the-pace` | Keep the Pace | 2 / 3 / 1 | tempo | `steady links:1 brace` + `draw n:1 suit:thread` |
| `morning-flock` | Morning Flock | 1 / 2 / 1 | draw-fix (non-combo) | `on-dawn draw n:1 suit:thread` |

#### A4 · Fairwrights (dance, venue) — the room, spiked

| id | name | m / c / wd | role | effect |
|---|---|---|---|---|
| `raise-the-wain-stage` | Raise the Wain-Stage | 2 / 4 / 1 | **C1** (locked, venue) | `gather amount:6` + `steady brace` |
| `pitch-the-ring` | Pitch the Ring | 2 / 4 / 1 | **C2** (locked, venue) | `gather read(room)` + `mark-grain hand:offgrain dance` |
| `the-whole-fair-turn` | The Whole-Fair Turn | 8 / 9 / 3 | **C3 capstone** (locked) | `rest self read(room)` + `on-overkill brim read(over-ceiling)` + `on-fulfil whittle 1` |
| `bunting-and-banners` | Bunting and Banners | 3 / 5 / 2 | second line | `gather read(room)` + `mark-grain hand:offgrain dance` |
| `call-the-crowd` | Call the Crowd | 3 / 5 / 2 | on-ramp | `gather amount:4` + `steady brace` |
| `string-the-bunting` | String the Bunting | 3 / 5 / 2 | room-builder | `gather read(room)` + `steady links:1` |
| `the-ringmasters-draw` | The Ringmaster's Draw | 3 / 5 / 2 | draw-fix (non-combo) | `on-dawn draw n:1 suit:dance` |

The Fairwrights carry **exactly one** `brim` card (`the-whole-fair-turn`), preserving the locked "only card gleam-writer" identity — the second-`brim` support of the rejected pool was cut.

#### A5 · Mannerly (song) — the proud, courted

| id | name | m / c / wd | role | effect |
|---|---|---|---|---|
| `keep-the-silver-singing` | Keep the Silver Singing | 2 / 4 / 1 | **C1** (locked) | `steady links:2 brace` + `mark-grain hand:cheapest song` |
| `court-the-singing-silver` | Court the Singing-Silver | 3 / 5 / 2 | **C2** (locked) | `court{stock:singing-silver, term:{if read(chain), at_least:3}}` |
| `the-silver-refrain` | The Silver Refrain | 6 / 8 / **5** | **C3 proud** (locked) | `rest self read(room)` + `fill read(chain)` + `on-fulfil draw n:1 suit:song` |
| `tune-the-strings` | Tune the Strings | 2 / 3 / 1 | chain-deepener on-ramp | `on-chain steady links:2 brace` + `mark-grain hand:cheapest song` |
| `the-standing-introduction` | The Standing Introduction | 3 / 5 / 2 | low-threshold court | `court{stock:singing-silver, term:{if read(chain), at_least:1}}` |
| `grace-note` | Grace-Note | 2 / 3 / 1 | room-feed | `gather read(grain:song)` + `steady links:1` |
| `silver-warm-up` | Silver Warm-Up | 3 / 5 / 2 | draw-fix (non-combo) | `on-dawn draw n:1 suit:song` |

The court verb cannot stall dead: C1 `steady links:2` plus `tune-the-strings`' second `on-chain links:2` reach `chain≥3`, and `the-standing-introduction` (`at_least:1`) lands a proud piece from a shallow chain. The proud C3's `woken_delight:5` is the fixed L6 Mannerly value.

#### A6 · Morning-Gleaners (glaze) — the grey, harvested

| id | name | m / c / wd | role | effect |
|---|---|---|---|---|
| `walk-the-pale` | Walk the Pale | 3 / 5 / 2 | **C1** (locked) | `gather read(spiral)` + `whittle read(season)` |
| `glean-the-ground` | Glean the Ground | 3 / 5 / 2 | **C2** (locked) | `rest→held:capstone read(room)` + `gather read(spiral)` |
| `ripe-mending` | Ripe Mending | 7 / **9** / 3 | **C3 capstone** (locked) | `rest self read(room)` + `fill read(room)` + `on-fulfil soothe{amount:1, scale:read(spiral), cap:last-red}` |
| `grey-gleaning` | Grey-Gleaning | 3 / 5 / 2 | second line + grain-writer | `gather read(spiral)` + `mark-grain hand:offgrain glaze` |
| `mend-the-verge` | Mend the Verge | 5 / 6 / 2 | soothe on-ramp (defanged) | `rest self read(room)` + `on-fulfil soothe{amount:1, scale:read(spiral), cap:last-red}` |
| `slow-the-grey` | Slow the Grey | 2 / 3 / 1 | room on-ramp | `gather read(grain:glaze)` + `steady links:1` |
| `pale-harvest` | Pale Harvest | 3 / 5 / 2 | draw-fix (non-combo) | `on-dawn draw n:1 suit:glaze` |

`mend-the-verge` makes the signature `soothe` reachable at mark-5, long before the mark-7 `ripe-mending` — but it is **not** a capstone clone: the capstone's `fill read(room)` payoff is stripped, leaving a cheaper, narrower mend. `grey-gleaning`'s `mark-grain glaze` closes the `grain:glaze` surface that `grey-bowl` and `slow-the-grey` read, so no `grain:<suit>` hook reads or writes empty air.

### 3. The combo_density argument

- **Total cards:** 49 (7 shared + 7×6 archetype).
- **Combo participants:** 41. A card participates iff a load-bearing effect reads a shared surface (`room`/`chain`/`grain:<suit>`/`woken:<suit>`/`over-ceiling`) another card writes, **or** writes such a surface another card reads. `spiral`/`season` are in the read-enum but are *board weather*, not synergy surfaces, so `gather read(spiral)` counts only via its **room-write**.
- **combo_density = 41 / 49 = 0.837** — clears the ≥0.5 gate and sits at the top of the 0.7–0.85 aim.
- **The 8 legible non-combo cards (the floor):** 2 apprentice baselines (`loose-thread`=`keep`, `kettle-loaf`=`warm`) + 6 suit-filtered `on-dawn` draw-fixers (`dovetail-draw`, `quick-feet`, `morning-flock`, `the-ringmasters-draw`, `silver-warm-up`, `pale-harvest`) that only cycle the pack. Every other card touches a written surface.

**Surface closure (every `grain:<suit>` read has a writer and vice-versa):** `grain:joinery` — written by `calipers`/`seasoned-timber` `mark-grain`, read by `the-fired-beam`/`sprig-trestle`/`bank-the-coals`. `grain:dance` — written by `pitch-the-ring`/`bunting-and-banners`, read by `first-step`. `grain:song` — written by `keep-the-silver-singing`/`tune-the-strings`, read by `hearth-hum`/`grace-note`. `grain:thread` — written by `thread-the-needle`, read by `paper-bird`/`the-standing-count`/`swift-tally`. `grain:glaze` — written by `grey-gleaning`, read by `grey-bowl`/`slow-the-grey`. `woken:joinery` — the engine auto-seats each fired joinery piece (L3 §0), read by `setterby-trestle`. `over-ceiling` — measured excess, read only by `the-whole-fair-turn`'s `brim`.

### 4. Trace + legality (every archetype chain ≥3 authored)

- **Kilnfast:** C1 `gather read(woken:joinery)`+`steady`→room+chain; C2 `rest read(room)`→capstone + `mark-grain joinery`→grows `grain:joinery`; C3 `rest self read(room)`+`fill read(grain:joinery)` reads the room and joinery-count C1/C2 wrote.
- **Eveners:** C1 `retire`→room; C2 `whittle read(room)`+`steady`→chain; C3 `rest self read(room)` consumes C1's fattened room × C2's chain, then `draw`.
- **Untold:** C1 `fill read(grain:thread)`+`draw`; C2 `draw`+`steady`→chain; C3 `rest read(chain)`+`fill read(grain:thread)` stacks the pace and count C1/C2/`thread-the-needle` raised.
- **Fairwrights:** C1 `gather:6`→room; C2 `gather read(room)`+`mark-grain dance`; C3 `rest self read(room)`+`brim read(over-ceiling)` pours the exact room C1/C2 built.
- **Mannerly:** C1 `steady links:2`→chain + `mark-grain song`; C2 `court{term read(chain) at_least:3}`; C3 `fill read(chain)` — C1 writes the chain both C2's term and C3's payoff read.
- **Gleaners:** C1 `gather read(spiral)`→room; C2 `rest read(room)`→capstone + `gather read(spiral)`→room; C3 `rest self read(room)`+`fill read(room)`+`soothe` clears and mends the pale-fed room C1/C2 deepened.

**Firewall & fixed marks:** exactly one `brim` (Fairwrights C3), band=`over-ceiling`; every cross-channel writer (`fill`/`brim`/`court`/`whittle`/`soothe`) binds only to play events (`on-play`/`on-wake`/`on-overkill`/`on-fulfil`); the only `on-dawn` effects are plain `draw` (not cross-channel); `read(season|spiral)` feeds `gather`/`whittle`/`fill`/`soothe-scale` only, never gleam; `court` reads `chain` as a pure gate, never spends gleam; every `soothe` is `cap:last-red`, node-local, non-gleam; no card lowers a mark. All 18 signatures reproduce their L5 numbers verbatim.

### 5. Critic resolutions

- **P0 (L5-fidelity red-team): TIGHT lowered locked values (Silver Refrain wd5→3, Ripe Mending c9→8).** Resolved by taking RICH's faithful base: Silver Refrain `wd5`, Ripe Mending `ceiling9` — verbatim GDD lines 1020/1049.
- **P1 (L5-fidelity): TIGHT rewrote ~13/18 signature marks (raised C1/C2, changed Eveners C2 grain thread→dance).** Resolved — all signatures reproduce L5 exactly; Eveners C2 stays **thread/wd1** (money identity). **Adjudication:** the competing P2 "m2/c4 is off-grid" finding is *overruled* — Setterby/Wain-Stage/Pitch/Keep-Silver are **LOCKED** at m2/c4 in L5, and "marks FIXED (never lowered)" forbids raising them to m3/c5 too; the L6 tier bands govern supports, not the locked spine.
- **P1 (playability): Mannerly court can stall (needs chain≥3); Gleaner soothe locked behind mark-7.** Resolved — added `tune-the-strings` (2nd `links:2`) + `the-standing-introduction` (`court at_least:1`), and `mend-the-verge` (mark-5 soothe on-ramp).
- **P1 (grammar): TIGHT's stray non-enum `source:"venue"` token.** Resolved — venue crowds print bare `gather amount:6`/`amount:4`; `venue` survives only as a tag.
- **P2 (L5-fidelity + playability): RICH's four mark-5 capstone-shaped duplicates.** Resolved — `the-standing-frame`, `a-second-refrain`, `second-wind` **dropped** (`second-wind`'s 2nd `brim` violated the "only brim card" identity); `mend-the-verge` **kept but defanged** (capstone `fill read(room)` stripped) because it is load-bearing for Gleaner playability.
- **P2 (tier-grid): RICH's m2/c4 supports (Call the Crowd et al.).** Resolved — all *supports* re-tiered into valid apprentice (m1-2/c2-3/wd1) or mid (m3-5/c5-6/wd2) bands; only the LOCKED signatures sit at m2/c4.
- **P3 (grain hooks read/write nothing): `grain:glaze` unwritten; TIGHT's `mark-grain song/dance` unread.** Resolved — `grey-gleaning` adds `mark-grain glaze`; every `grain:<suit>` surface is read/write-closed (see §3).
- **P2 (Kilnfast turn-1 empty `woken:joinery`).** Resolved — `bank-the-coals` supplies a turn-1 `read(grain:joinery)` room floor; `woken:joinery` compounds from turn 2.

### 6. Named Layer 7 elements

| element | archetype | tier | signature verb / role |
|---|---|---|---|
| Sprig Trestle, Pegged Bench, Loose Thread, Kettle-Loaf, Hearth-Hum, Grey Bowl, First Step | shared | apprentice | the 7-piece starting hand (2 non-combo floors) |
| Setterby Trestle · Calipers at the Bench · The Fired Beam | Kilnfast | C1·C2·capstone | the compounding hearth (`woken:joinery`→`fill grain:joinery`) |
| Bank the Coals, Seasoned Timber, Keep the Kiln, Dovetail Draw | Kilnfast | mid/appr. | turn-1 floor, second line, holder, draw-fix |
| The Last Lighting · Bright Hand to Hand · Even the Rim | Eveners | C1·C2·capstone | the last-lighting velocity loop |
| Waymeet Gift, The Turning Purse, Even Fuel, Quick Feet | Eveners | appr./mid | gift, second line, on-ramp, draw-fix |
| Paper-Bird · Quick-Hand · The Standing Count | Untold | C1·C2·capstone | the paper-bird ratchet (count→one big fill) |
| Thread the Needle, Swift Tally, Keep the Pace, Morning Flock | Untold | apprentice | count-writer, second line, tempo, draw-fix |
| Raise the Wain-Stage · Pitch the Ring · The Whole-Fair Turn | Fairwrights | C1·C2·capstone | the one enormous turn (sole `brim`) |
| Bunting and Banners, Call the Crowd, String the Bunting, The Ringmaster's Draw | Fairwrights | mid | second line, on-ramp, room-builder, draw-fix |
| Keep the Silver Singing · Court the Singing-Silver · The Silver Refrain | Mannerly | C1·C2·proud | the vouching / term / payoff courtship |
| Tune the Strings, The Standing Introduction, Grace-Note, Silver Warm-Up | Mannerly | appr./mid | chain-deepener, low-court, room-feed, draw-fix |
| Walk the Pale · Glean the Ground · Ripe Mending | Gleaners | C1·C2·capstone | glean the grey, mend it (sole `soothe`) |
| Grey-Gleaning, Mend the Verge, Slow the Grey, Pale Harvest | Gleaners | mid/appr. | grain-writer, soothe on-ramp, room on-ramp, draw-fix |
