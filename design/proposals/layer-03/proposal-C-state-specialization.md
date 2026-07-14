# Layer 3 — Effect Vocabulary · Proposal C · STATE / SPECIALIZATION-FIRST

**Proposer:** C-state-specialization
**Pillar:** primitives that **READ and WRITE persistent TAGS** (gleam-*grain*, craft-*suit*, woken-audience *type*, node/season *state*) so a build's identity is the state it grows, and cards synergize by accumulated state that persists **across turns** — not by one-shot value.
**Logline:** *The grain of your gleam, the type of your room, and the paleness of your ground are the game's real memory; every card either stamps that memory or reads it — so a deck becomes a specialist by what it leaves lit behind it.*

---

## 0. The compile model (what a card *is*) and the engine's built-in resolution

A **card is declarative data**: a suit, a printed **waking-mark**, and an ordered **effect list** of primitives below. The engine resolves *a play* with machinery that is **not** a primitive (it is the L1-locked substrate every card assumes):

- Playing a piece draws attention from **the room** as a multiplier on the play (spend); back-to-back plays hold the room high, a stall cools it (**work-chain**).
- The play's attention **splits with nothing lost** (`the-returning-table`): a **SET** share works the piece toward its mark; the **RETURN** share seeps to *this node's* local table for tomorrow. Overkill past the piece's ceiling is available to `pour`.
- A piece with its SET share **at or above its waking-mark WAKES**: gold edge, fired to the run-deck, and it becomes eligible for its `on-wake` effects.

So the primitives are the **verbs printed on cards**. The specialization primitives (`grain`, `seat`, `bench`, `if-grain`, `per-audience`, `per-pale`) are the pillar: they turn the four persistent state-stores — **grain-tag on Standing**, **typed woken-audience in the room**, **suit-tags on pieces**, **node/Paling state** — into the substrate builds compound on.

---

## 1. The full primitive vocabulary (15)

Legend — **State touched:** ROOM = the attention pool · FILL = the need's-fill · GRAIN = the tag on Standing · AUD = typed woken-audience · PACK = deck/hand + suit-tags on pieces · NODE = node/Paling/season board-state · GLEAM = Standing (via play only) · HAND$ = handsels · STOCK = courted-stock. **Int?** = does it read/write shared-or-persistent state, or trigger off other effects/engine state (i.e. does it enable combos)?

### Substrate verbs (the working — spend & target)

| id | one-line effect | params | reads | writes | Int? | traces to |
|---|---|---|---|---|---|---|
| **`gather`** | Add attention to **the room** (the pool this turn). | `amount`; opt `suit_scale` | ROOM | ROOM | ✔ | `attention-engine`/`the-gathered-room` (L1 §2) |
| **`draw`** | Draw journey-pieces from the pack into hand. | `count` | PACK | PACK(hand) | ~ | `journey-pieces-deck`; `dawn-income` |
| **`rouse`** | Spend room to **SET attention onto a *chosen other* piece** toward its waking-mark. | `target`, `amount` | ROOM, PACK | ROOM, PACK | ✔ | `waking-threshold-play`/`the-waking-mark` |
| **`fill`** | Pay woken delight into the accepted asking's **need's-fill**. | `amount` | FILL | FILL | ✔ | `the need's fill` (L1 §2); `escalating-contracts` |
| **`pour`** | Push this play's room **past the piece's ceiling → overkill converts to Standing** at full rate (diminishing past a band). | `amount` | ROOM | GLEAM (+GRAIN if stamped) | ✔ | `full-cup-overflow`/`overkill-to-standing` |

### Specialization writers (grow the persistent memory) — **the pillar**

| id | one-line effect | params | reads | writes | Int? | traces to |
|---|---|---|---|---|---|---|
| **`grain`** | **Stamp** the gleam this working earns with a **craft-suit** (song/joinery/glaze/thread/dough/dance). | `suit` | — | GRAIN | ✔ | `grain-tagged-standing`/`the-grain-of-gleam` |
| **`seat`** | On this piece **waking**, it joins the room as a **typed audience-thing** of a suit — a persistent attention-source on later turns. | `suit` | — | AUD | ✔ | `audience-of-things`; `fired-vs-held` (L1 §2.4) |
| **`bench`** | Consume a **courted-stock** material to **lower this piece's waking-mark and/or add a suit-tag** to it. | `grade`, `effect:{lower_mark? \| tag_suit?}` | STOCK, PACK | STOCK, PACK | ✔ | `two-gate-courting`/`graded-material-market` (L2 System A/C) |
| **`soothe`** | On a woken re-making, spend a **last-red catalyst** to **slow THIS node's future paling**. | `amount` | NODE | NODE | ✔ | `pale-route-harvest`/`last-red`; `paling-clock` |
| **`whittle`** | Carve **handsels** from this play's **shavings-share** — a bound sub-portion of the RETURN (competes with the local-table dawn; never minted on top). | `amount`; opt scale | ROOM(RETURN) | HAND$ | ✔ | `bright-shavings-byproduct`/`the-shavings-share` |

### Readers · conditionals · triggers (the combo glue) — **the pillar**

| id | one-line effect | params | reads | writes | Int? | traces to |
|---|---|---|---|---|---|---|
| **`on-wake`** | **Trigger:** the wrapped effects fire **only if this piece wakes** (SET share crossed its mark). *Things do their real work only when watched.* | `then:[effects]` | PACK(this) | — | ✔ | `waking-threshold-play`/`the-waking-mark` |
| **`if-grain`** | **Conditional:** gate or amplify the wrapped effects on your **Standing's grain** matching a suit. | `suit`, `then:[effects]`, opt `amp` | GRAIN | — | ✔ | `grain-tagged-standing` |
| **`per-audience`** | **Scale** the wrapped effect by the count of **woken audience of a suit/type** present. | `suit`, `effect`, `rate` | AUD | (via effect) | ✔ | `audience-of-things`/`the-gathered-room` |
| **`per-pale`** | **Scale** the wrapped effect by this **node's paleness** (spiral rings / seep). | `effect`, `rate` | NODE | (via effect) | ✔ | `paling-clock`; `dawn-income` (pale = richer); `gleaner-adversity-economy` |
| **`per-chain`** | **Scale** the wrapped effect by the current **work-chain length** (unbroken plays this turn). | `effect`, `rate` | ROOM(chain) | (via effect) | ✔ | `the-gathered-room` (work-chain, L1 §2.3) |

**Why exactly these — the LEAN justification.** Five substrate verbs are the irreducible working (make room, draw, help wake, fill the need, pour the overflow). The other ten are the pillar: **five writers** that grow the four persistent stores, and **five reader/trigger wrappers** that pay those stores back. Every non-substrate primitive either *tags* state or *reads* a tag — nothing else is minted. `rouse` and `bench` are kept distinct because they specialize on **different resources** (attention vs. materials), which is itself a build fork; `grain` and `seat` are kept distinct because one stamps the **maker** (people-gleam) and one stamps the **room** (typed current) — two different memories a build can lean on.

---

## 2. Example cards (declarative data) — a combo chain

### Combo 1 — a **song-grain specialist** compounding across turns

```jsonc
// A · cheap opener — stamps the working song-grained, warms the room
{ "id": "set-the-room-to-singing", "suit": "song", "waking_mark": 2,
  "effects": [ {"gather": 3}, {"grain": "song"} ] }

// B · the engine card — reads the song-audience it helped seat, then seats more
{ "id": "call-the-rafter-larks", "suit": "song", "waking_mark": 3,
  "effects": [ {"per_audience": {"suit":"song", "effect":{"rouse":{"target":"chosen","amount":1}}, "rate":1}},
               {"on_wake": {"then":[ {"seat":"song"} ]}} ] }

// C · the capstone — only pays off inside a song specialization
{ "id": "the-long-air", "suit": "song", "waking_mark": 6,
  "effects": [ {"per_chain": {"effect":{"gather":1}, "rate":2}},
               {"if_grain": {"suit":"song", "then":[ {"fill":4}, {"pour":6} ]}} ] }
```

**The chain, one play at a time:**
1. **A** gathers 3 into the room and **stamps this working `song`** — every drop of gleam it later earns is now song-grained (`grain` → GRAIN).
2. **B** reads the **woken song-audience already seated** (`per_audience`) to `rouse` a hand piece toward its mark for free; because the chain is unbroken the pool stays high, B itself wakes, and **`on-wake` seats another song-audience** (AUD grows — persists into *tomorrow's* room).
3. **C** `per_chain` gathers a large pool off the unbroken chain, then **`if_grain: song` fires**: a big `fill` on the need **and** a `pour` that overkills into **song-grained** gleam → peak-Standing rises → **Filter-1 lantern sizes up *song* askings** next town, and the seated song-audience makes next dawn's room richer in song.

The build's identity is legible entirely in **state it grew**: song-grain on the maker, a room full of song-audience. A joinery deck playing the same three cards gets *nothing* from `if_grain:song` / `per_audience:song` — specialization is enforced by the tags, with no class menu (`grain-tagged-standing`, `walking-ways-cardpools`).

### Combo 2 — a **pale-route glaze specialist** (materials + board-state)

```jsonc
// D · gleaner faucet — the paler the ground, the more it carves
{ "id": "glean-the-last-red", "suit": "glaze", "waking_mark": 2,
  "effects": [ {"per_pale": {"effect":{"whittle":1}, "rate":1}} ] }

// E · material-fueled wake + node repair
{ "id": "kiln-the-faded", "suit": "glaze", "waking_mark": 5,
  "effects": [ {"bench": {"grade":"festival-glass", "effect":{"lower_mark":2, "tag_suit":"glaze"}}},
               {"on_wake": {"then":[ {"fill":3}, {"soothe":1} ]}} ] }
```

**D** reads **node paleness** (`per_pale`) to `whittle` more handsels on faded ground — the gleaner's engine. **E** spends a courted **festival-glass** (`bench`) to cheaply wake, then on waking `fill`s the need and `soothe`s the node's future paling — a build that *routes into* the pale country (`gleaner-adversity-economy`, `pale-route-harvest`) and is rewarded by state on the board, not by flat numbers.

---

## 3. The interaction story & density

**Who combos with whom** (all through persistent/shared state — the pillar):

- **GRAIN** is written by `grain` (+ every `pour`) and read by `if-grain` → the maker's tag is the whole specialization axis; it also feeds the L1 two-filter lantern (which askings size up) and L2 courting (which materials answer).
- **AUD** is written by `seat` (gated on `on-wake`) and read by `per-audience` **and by next turn's `gather`** → the typed room compounds *across* turns, the load-bearing "persist across turns" combo.
- **PACK suit-tags / marks** are written by `bench` and `rouse`, read by `per-audience`/`if-grain`/`per-chain` chains → materials and cross-card waking feed the same tag economy.
- **NODE/Paling** is written by `soothe`, read by `per-pale` (and the dawn) → the board is state a route-build farms and repairs.
- **ROOM/chain** is written by `gather`/`rouse`, read by `per-chain`/`pour` → the tactical spine every build shares.
- **Triggers** `on-wake` and the `if-grain`/`per-*` wrappers reference **other effects**, so they are interacting by construction (they gate or scale wrapped effects).

**Density.** Of 15 primitives, **13 clearly read/write shared-or-persistent state or trigger off other effects** (`gather`, `rouse`, `fill`, `pour`, `grain`, `seat`, `bench`, `soothe`, `on-wake`, `if-grain`, `per-audience`, `per-pale`, `per-chain`). `whittle` reads the shared RETURN share (borderline-interacting); `draw` is the one flat card-advantage verb (non-interacting). **Conservative interaction_density = 13/15 ≈ 0.87** — comfortably above the 0.5 gate. This is intentional: a specialization-first vocabulary is *made of* state-readers, so combos come from accumulated tags rather than one-shot value. The five substrate verbs keep the floor playable; the ten pillar verbs are what a build specializes on.

---

## 4. Grammar of light + play-is-the-only-gate

Every primitive is **printed on a card and fires only when that card is played** — so *play is the only exchange gate*, structurally. No primitive silently moves value across a channel:

- **`pour`** (the current → people-gleam) fires **only** as overkill on a played piece — the one legal attention→gleam door (`full-cup-overflow`); there is no menu conversion.
- **`grain`** and **`if-grain`** only **label/read** gleam *within* the people-gleam channel — a tag is not a value transfer.
- **`seat`** turns a **woken** piece into an audience-thing that sources the **current** (the medium, not a channel) — canon `audience-of-things`, and only on a **wake** (a play).
- **`fill`** pays woken delight (things-wake) into the need; the node **re-colors (places-pale) only on fulfillment**, never per-play.
- **`soothe`** touches **NODE/Paling (places-pale, board-only)** via a woken re-making + last-red catalyst — it slows paling and **never touches the gleam meter** (the Paling↔Standing firewall holds).
- **`whittle`** carves the **shavings-share** — a *bound sub-portion of the RETURN* that **competes with the local-table dawn**, not an additive faucet (`WORLD.md`:590; L2 §4/§5c) — so it is conservation-clean and mint-ban-safe; it is the held signature of the wake channel, produced by a play, never spent inside a working.
- **`bench`** works courted-stock (the loose → things-wake) into a piece within the same channel, gated by a play; gleam only ever **gated** the courting upstream, it was never spent.
- **`rouse`** spends room (current) as the ordinary SET-share attention onto another piece — the normal waking mechanic, play-gated.

**Every primitive traces** to a locked L1 element, an L2 resource, or a `WORLD.md`/ledger id (col. "traces to"), and the four persistent stores it acts on are exactly the four the locked layers already run: grain (`grain-tagged-standing`), typed audience (`audience-of-things`), the Paling (`paling-clock`), and the pack (`journey-pieces-deck`). **No new player-facing quantity is introduced** — the vocabulary only gives cards the verbs to grow and read the memory the world already keeps.
