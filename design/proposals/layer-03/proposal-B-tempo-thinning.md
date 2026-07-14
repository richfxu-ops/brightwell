# Layer 3 — Effect Vocabulary · Proposal B — TEMPO / THINNING-FIRST

**Proposer:** B-tempo-thinning
**Pillar:** design the primitive set around **sequencing, deck-shaping, and the attention economy** — chain-building & sustain, exhaust (perform-to-destruction), draw/dig, node-local banking, handsel flow. **Combos emerge from ORDER and TEMPO** (keeping the chain alive, timing the reach), not from a forest of triggers. One flexible conditional does all the reference-work; everything else is a *flow* primitive that still interacts through the shared **room / chain / pack / need's-fill**.

**Logline:** *A lean set of twelve flow-verbs where power comes from the order you play them — you gather the room, lean on the chain you built, dig and thin the pack, and time the reach — with a single conditional (`attune`) as the only trigger the engine has to grow for.*

---

## The design thesis (why tempo, and why it clears the DEPTH gate honestly)

L1 already hands me a shared, persistent, *tactical* substrate that most deckbuilders have to invent: **the room** (a pool that rises on an unbroken chain and sags on a stall), **the pack** (a run-deck that grows by firing and shrinks by exhaust), **the need's-fill** (the shared target), and **the-returning-table** (node-local carry to tomorrow's dawn). These are already-canon pieces of *mutable shared state*. The tempo pillar's whole move is: **make every primitive read or write one of these, so a card's value is set by what came before it and what it sets up after it.** Depth is then a property of the *sequence*, not of a big trigger vocabulary — which is exactly what LEAN wants.

Crucially, L1 forbids the cheap lever most deckbuilders reach for: **you cannot move a card's waking-mark** ("a fixed property of the card, printed on it — it never moves," L1 §2). So "make the big piece wake" is achieved *only by building a bigger pool* (gather / lean / hold) — the canon tempo levers. That constraint is a gift: it forces the vocabulary to be about **flow into and out of the room**, which is the pillar.

---

## 1. The full primitive list (12)

Two-tier firing is the **engine's** fixed gate, not a primitive: when a piece is played you commit an amount from the room as its multiplier (**SET**); if SET ≥ the piece's fixed **waking-mark** the piece **wakes** (fires to the run-deck, joins the room, runs its `on_wake` effects, and any excess past its ceiling is **overkill**); the unspent **RETURN** share seeps to this node's table (`the-returning-table`). A piece below its mark still runs its `on_play` effects **once** and stays inert (L1 §2.4). Cards therefore split their primitive-lists into `on_play` (always) and `on_wake` (only if woken). The twelve primitives below are what those lists are built from.

**Shared/persistent state a primitive may touch:** `room` (the attention pool) · `chain` (chain-length / stall-state) · `pack` (hand + run-deck) · `fill` (the need's-fill) · `table` (`the-returning-table`, node-local) · `grain` (craft suits + Standing's grain) · `audience` (woken pieces in the room) · `gleam` (Standing, play-gated only) · `handsels` · `paling` (board, read-only to cards).

| # | id | one-line effect | key params | reads → writes | interacts? | traces to |
|---|---|---|---|---|---|---|
| 1 | `pour` | Spend attention from the room as a multiplier onto a target piece (the core SET-toward-the-mark, or a scripted extra pour onto another piece). | `target` (this\|named\|last-played), `amount` (N\|all\|`lean`) | **room** ↓, target SET ↑ | **YES** — consumes the shared pool others filled; a `lean` pour reads the chain | `attention-engine`/`audience-of-things`; `waking-threshold-play`; L1 §2.3 |
| 2 | `gather` | Add attention into the room **now**, mid-turn (raise the pool before a pour). | `amount` (N), `scale?` (per woken `audience` of `grain`) | **room** ↑, opt. reads `audience`/`grain` | **YES** — feeds every later `pour`/`overflow`; order-defining | `the-gathered-room`/`attention-engine` |
| 3 | `lean` | This effect **scales with current chain-length** ("the room leans in") — a multiplier read off the chain you've kept unbroken. | `per` (amount added per chain-step), `cap?` | reads **chain** → amplifies its host effect | **YES** — pure sequencing reward; rewards a long unbroken chain | work-chain, L1 §2.3; `the-gathered-room` |
| 4 | `hold` | **Brace the chain:** the next stall does not cool the room (the pool holds through one break). | `count` (# of stalls braced, default 1) | **chain** (stall-state) ↑ | **YES** — protects future plays; lets a chain survive a needed pause | work-chain sustain, L1 §2.3; `attention-engine` |
| 5 | `draw` | Draw journey-pieces from the pack into hand. | `amount` (N) | **pack** ↓/hand ↑ | weak — writes shared pack; the one *self-contained* verb (digs toward, but does not itself read, prior state) | `journey-pieces-deck`; `dawn-income` |
| 6 | `dig` | Search the pack for a piece of a named **grain** (or tag) and draw it — fetch the combo piece. | `grain`/`tag`, `amount` (default 1) | reads **pack** + **grain** → hand ↑ | **YES** — fetches a specific combo/capstone piece; grain-conditional | `journey-pieces-deck`; `grain-tagged-standing`; `walking-ways-cardpools` |
| 7 | `exhaust` | **Perform to destruction:** remove a piece permanently from the run-deck (thinning) in exchange for an amplified effect. | `who` (self\|target), `amplify` (the effect-list unlocked by destroying) | **pack** (permanent) ↓ | **YES** — thins the deck (raises future `draw`/`dig` quality) and is the payment other primitives amplify off | `journey-pieces-deck` (performed to destruction); `evener-sacrifice-velocity` |
| 8 | `seep` | Send value to this node's **local table for tomorrow's dawn** (bank), or to the **room now** — sourced from unspent attention OR a retired inert piece (last-lighting). Node-bound; **no caravanning**. | `source` (unspent-attention\|inert-piece), `to` (table\|room), `amount` | reads source → **table**↑ or **room**↑ | **YES** — cross-turn tempo (bank) + dead-card→income (last-light); competes with `shave` for the RETURN | `the-returning-table`/`attention-conservation`; `evener-sacrifice-velocity`; `apprentice-floor-materials` (inert) |
| 9 | `shave` | Carve a **shavings-share** from this play's RETURN into a warm **handsel** (money kept moving). Competes with `seep`(→table) for the same RETURN; mints nothing. | `amount` (bounded fraction of RETURN) | reads RETURN(**table**) → **handsels** ↑ | **YES** — trades tomorrow's dawn for warm money; interacts with `seep` over one shared share | `bright-shavings-byproduct`/`the-shavings-share`; `handsel-currency-decay` |
| 10 | `fill` | A **woken** piece pays woken delight into the **need's-fill** (the shared target). Overkill past the ceiling becomes the substrate `overflow` routes. | `amount` (delight) | **fill** ↑ (thing → the need) | **YES** — writes THE shared target; `overflow` and `attune`(fill-progress) key off it | need's-fill, L1 §2.6; `the-glad-load`; `waking-threshold-play` |
| 11 | `overflow` | **The reach:** route this woken play's excess past the ceiling to **Standing**, at full rate (the big on-stage swing). Play-gated; the *only* current→gleam move. | `route` (standing), `amount` (excess\|N) | reads **room**/ceiling → **gleam** ↑ | **YES** — needs a big room built by prior plays; the play-gated cross-channel primitive | `full-cup-overflow`/`overkill-to-standing`; `the-reach` |
| 12 | `attune` | **The one conditional/trigger:** run a wrapped effect-list ONLY if a condition on shared state holds. All reference-logic lives here. | `cond` (chain≥N \| room≥N \| grain-X-woke-this-turn \| fill≥N \| node-rings≥N), `then` (effect-list) | reads **chain/room/audience/grain/fill/paling** → runs `then` | **YES** — the combo glue; makes cards read the board and each other | `play-as-exchange-gate`; `grain-tagged-standing`; `the-gathered-room` |

**Why exactly these twelve — the LEAN audit.** Every primitive is a distinct verb with no synonym: `gather` fills the pool, `pour` empties it toward a mark, `lean` reads the chain, `hold` protects it, `draw` widens options, `dig` narrows to one, `exhaust` thins for power, `seep` banks/composts to the table, `shave` skims to money, `fill` pays the target, `overflow` reaches for gleam, `attune` is the sole conditional. Two merges keep it lean: **banking and last-lighting are one `seep`** (source/destination params), and **all triggers are one `attune`** — the pillar's "fewer trigger primitives" promise, so the engine grows its switch by exactly one conditional no matter how many combos exist.

---

## 2. Example cards as data (a combo chain)

Cards are declarative data over the primitives. `wm` = fixed waking-mark. `on_play` always fires; `on_wake` fires only if SET ≥ `wm`.

```jsonc
// CARD 1 — the chain-opener (cheap; you lead with it)
{
  "id": "tinkers-warm-up", "grain": "joinery", "wm": 2,
  "on_play": [
    { "p": "gather", "amount": 1 },          // lift the room before anything pours
    { "p": "draw",   "amount": 1 }           // dig one deeper for the payoff piece
  ],
  "on_wake": [
    { "p": "fill", "amount": 1 },
    { "p": "hold", "count": 1 }              // brace the chain: one stall won't cool the room
  ]
}

// CARD 2 — the lean payoff (mid-chain; scales with the chain you built)
{
  "id": "kindle-song", "grain": "song", "wm": 5,
  "on_play": [
    { "p": "pour", "target": "this", "amount": "lean", "lean": { "per": 2 } }
    // pours (2 x chain-length) from the room onto itself — a long chain wakes it, no lowered mark
  ],
  "on_wake": [
    { "p": "fill", "amount": 3 },
    { "p": "attune",
      "cond": { "grain_in_chain": "song", "min": 2 },   // if 2+ song plays are in this chain...
      "then": [ { "p": "overflow", "route": "standing", "amount": "excess" } ]  // ...route the excess to Standing (the reach)
    }
  ]
}

// CARD 3 — the thinning capstone (late; converts the turn into tomorrow + a leaner deck)
{
  "id": "last-ember-glaze", "grain": "glaze", "wm": 4,
  "on_play": [
    { "p": "dig", "grain": "glaze", "amount": 1 }        // fetch its own kind for next turn's chain
  ],
  "on_wake": [
    { "p": "fill", "amount": 2 },
    { "p": "exhaust", "who": "self",                      // perform to destruction (permanent thin)...
      "amplify": [ { "p": "seep", "source": "inert-piece", "to": "table", "amount": 3 } ]
      // ...and last-light a dead inert card in hand to THIS node's table for a richer dawn tomorrow
    },
    { "p": "shave", "amount": 1 }                         // skim one warm handsel off the RETURN
  ]
}
```

**The combo chain (ORDER is the whole game):**

1. **Lead with `tinkers-warm-up`.** `gather +1` raises the room *before* any big pour; `draw` digs toward the capstone. It wakes cheaply (wm 2), `fill`s 1, and `hold`s the chain — now you can pause once without the pool sagging.
2. **Keep the chain unbroken** — play more song/joinery pieces back-to-back so **chain-length climbs** (the engine's work-chain holds the pool high).
3. **Drop `kindle-song` mid-chain.** Its `pour` is `lean`-scaled: with a 4-long song chain it pours 8 — it clears its wm-5 on the strength of the *chain you built*, not a discounted mark. It `fill`s 3, and because 2+ song plays sit in the chain, `attune` fires `overflow`: the excess past its ceiling routes to **Standing** — the reach, paid for entirely by good sequencing.
4. **Close with `last-ember-glaze`.** It `dig`s a glaze piece for tomorrow, wakes, `fill`s the need to completion, then `exhaust`es *itself* (deck permanently leaner → better draws all run) while `seep`ing a dead inert card's worth to **this node's table** (richer dawn if you camp here tomorrow), and `shave`s one warm handsel. The turn ends having thinned the deck, banked node-local tempo, moved money, and taken a gleam swing — all from the *order* of twelve flow-verbs.

Re-order the same three cards and it fails: play `kindle-song` first (chain-length 0 → `lean` pours 0 → inert, no wake, no reach); `exhaust` before you've built value wastes the thin. **The sequence is the strategy.**

---

## 3. The interaction story + density

**Who combos with whom (the shared-state graph):**

- **The room (pool):** `gather` (+) → `pour`/`overflow` (–) is the primary spend loop; `lean` reads the chain that holds the room high; `hold` keeps the room from sagging so a *later* `pour` still lands. Four primitives contend over one pool — every one's value depends on the others' order.
- **The chain:** `lean` reads it, `hold` protects it, and `attune`(chain≥N / grain-in-chain) gates off it. Building the chain is a shared investment three primitives cash in.
- **The pack (thinning):** `draw` widens, `dig` narrows to the combo piece, `exhaust` thins for power, `seep`(inert→…) composts a dead card. `exhaust`/`seep`/`dig` together are the thinning engine — each thin raises the next `draw`/`dig`'s hit-rate.
- **The RETURN share (the tempo fork):** `seep`(→table) banks tomorrow's dawn vs `shave` skims a warm handsel — they **compete over the same share**, a genuine per-play tension (node-local growth vs liquid money).
- **The target & the reach:** `fill` writes the need's-fill; `overflow` fires off the excess *above* what `fill` needed; `attune`(fill≥N) can gate a payoff on how full the need already is. Overfilling is a sequencing decision (fill just-enough and bank, or blow past it for gleam).
- **`attune` is the universal glue** — it lets any card read chain / room / grain / fill / node-rings and fire a wrapped list, so cards reference *each other's* prior effects without the engine needing a dozen bespoke triggers.

**Interaction density (the DEPTH gate, floor 0.5):** Nine of twelve primitives are unambiguously **order/combo-driven** — their effect is *set by or sets up* other effects on shared state: `pour`, `gather`, `lean`, `hold`, `dig`, `exhaust`, `seep`, `overflow`, `attune`. Of the remaining three, `fill` writes the shared need's-fill (which `overflow`/`attune` key off) and `shave` contends with `seep` over the RETURN — both genuinely interact — leaving only `draw` as a near-self-contained utility. **Conservative claim: 9/12 = 0.75** (by the strict "touches shared/persistent state or references another effect" letter it is 11/12 ≈ 0.92). **The gate clears with wide margin, and by construction — the pillar makes shared state the substrate of nearly every verb.**

**`interaction_density_claimed`: 0.75.**

---

## 4. Grammar of light + play-is-the-only-gate

**Three channels that never cross (places pale · people gleam · things wake), plus the current (attention).** No primitive silently moves a value across channels:

- **`overflow` is the ONLY current→gleam primitive**, and it fires only as an `on_wake` effect of a **played, woken** piece whose delight exceeded its ceiling (`full-cup-overflow`). There is no menu that turns attention into Standing — you must *perform past enough*. Play-gated. ✔
- **`fill` (thing → places) is play-gated and woke-gated:** only a woken piece pays into the need's-fill, and the node re-colors on **fulfillment**, never per-play (engine) — the thing→places transfer only ever rides a performance. ✔
- **`seep` / `bank` / last-light keep attention AS attention** — the current stays the current, seeping to *this node's* table (node-local, **no caravanning**, per L1 §5). No channel is crossed; nothing is minted (conservation / mint-ban). ✔
- **`shave` stays inside the wake channel:** it carves a **bound sub-portion of the RETURN** (the shavings-share, held signature) into a handsel — *carved from the RETURN, never minted on top*, and it **competes** with `seep`(→table) for that share, so no net regard is created. Handsels are the held signature of *things-wake*, not a fourth channel. ✔
- **No primitive touches the Paling meter.** `attune` may *read* node-rings (board is public information), but nothing writes the Paling except answering a need by play (`fill` → fulfillment). Board pressure never leaks into gleam and gleam never pays the board — the player always knows whose fault a loss is. ✔
- **`dig` / `lean` / `attune` read `grain` but never convert it** — grain is a tag the sequence keys off, never a resource moved between channels. ✔

**Play-is-the-only-gate:** every cross-channel primitive (`overflow`, `fill`) and every value-mover (`seep`, `shave`) fires strictly as an `on_play`/`on_wake` effect of a **performed piece** — `attune` gates on state but its wrapped `then` still fires only through the played card. There is no primitive that converts a resource from a standing menu. The act of play remains the world's single exchange gate; the vocabulary has no bypass. ✔

**Aesthetic (D-002) fit:** every verb is a legible bit of the world's own physics — *gather* the room, *lean* on a held chain, *pour* light into the work, *hold* the room through a pause, *dig* through the pack, *exhaust* a piece by performing it to nothing, *seep* the leftover light to the table for tomorrow, *shave* a warm coin off the leavings, *fill* the need, *overflow* into gleam, *attune* to the room. Effect = metaphor; intuitiveness holds.

---

```json
{"path":"/Users/richardxu/Documents/games/pipeline-test-02/design/proposals/layer-03/proposal-B-tempo-thinning.md","title":"Layer 3 Effect Vocabulary — Proposal B (Tempo / Thinning-First)","logline":"A lean set of twelve flow-verbs where power comes from the order you play them — gather the room, lean on the chain you built, dig and thin the pack, time the reach — with one conditional (attune) as the only trigger the engine must grow for.","primitives":["pour","gather","lean","hold","draw","dig","exhaust","seep","shave","fill","overflow","attune"],"interaction_density_claimed":0.75}
```
