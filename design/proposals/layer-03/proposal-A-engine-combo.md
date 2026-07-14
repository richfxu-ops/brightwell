# Layer 3 — Effect Vocabulary · Proposal A · ENGINE-COMBO-FIRST

**Proposer:** A-engine-combo
**Pillar:** design the primitives to *chain*. Maximise interaction via triggers (`when a piece wakes…`, `while the chain holds…`), conditionals/references that *read* the turn's shared state (the room, the fill, the season, the grain, the woken audience, the pack), and writes that *land* on that same shared state so the next card's effect is bigger. A lean set where nearly every primitive can feed another.

**Logline:** *Thirteen verbs of the working; eleven of them touch the room, the fill, the grain, the pack, or the season, so a hand is a machine — every play you make loads the next.*

---

## 0. The design thesis — where the depth lives

L1/L2 already lock the *engine*: a turn is a pool (**the room**) you spend as a multiplier on plays; pieces have **fixed waking-marks**; crossing a mark **wakes** a piece (fires it, joins the room, pays woken delight into **the need's-fill**); attention past a ceiling **overkills to gleam**; the node re-colours **only on fulfilment**. Cards are declarative data over a small effect set; the engine's switch runs that set.

The combo-first move is not to invent new nouns — the resource square is locked at four (§L2). It is to make the *verbs* read and write **the same shared state**, so a card is never a self-contained one-shot. Concretely, the vocabulary carries **one reference primitive (`read`)** that turns any live quantity (the room's size, the fill's progress, the season's seep, a suit's count) into the *amount* of another effect. That single primitive is what converts a pile of cards into an engine: `rest self by read(room)`, `pay-fill by read(grain:song)`, `crown by read(spiral)`. The room you build with card 1 *is* the number card 3 dumps. **Power from composition, not from primitive count.**

Everything below traces to a locked L1 element, an L2 resource/system, or a WORLD.md/ledger id, and **nothing crosses a channel except through a played piece.**

---

## 1. The full primitive list

Schema for a card's effect entry: `{ when: <trigger>, if: <read-guard?>, do: <primitive>, params }`. The `when`/`if` clauses are the combo harness (§1b); the `do` is one of the 13 primitives below.

**State surfaces the primitives share** (the combo substrate): **the-room** (R1 pool, per-turn), **the-chain** (unbroken-work momentum, per-turn), **need's-fill** (accepted asking demand), **piece-set** (attention rested on a played piece vs its fixed mark/ceiling), **woken-audience** (fired things now seating the room), **tags/grain** (craft-suits on pieces + Standing's grain), **season/Paling** (seep stage + a node's spiral-rings — *read-only to cards*), **the-pack** (run-deck + hand), **handsels** (R2), **courted-stock** (R6), **gleam** (R3 — *written only positive, via overkill; never spent by a card*).

### 1a. The primitives

| # | id | one-line effect | params | reads → writes | interacts? | traces to |
|---|---|---|---|---|:--:|---|
| 1 | **`gather`** | Seat more of the present audience into the room, raising the pool (soft-capped). | `amount` (may be a `read`), `source?` | reads **woken-audience/venue** → writes **the-room** | **yes** | L1 `the-gathered-room`; `attention-engine`/`audience-of-things` |
| 2 | **`rest`** | Spend the room to rest attention on a target played piece (× the-chain); at/above its **fixed** mark it wakes, past its ceiling it overkills. | `target` (self\|held\|hand), `amount` (may be a `read`) | reads **the-room + the-chain** → writes **piece-set, the-room (spend); gleam via overkill; woken-audience on wake** | **yes** | L1 `the-waking-mark`, `the-returning-table` (SET/RETURN split); `waking-threshold-play` |
| 3 | **`steady`** | Manipulate the work-chain: count this play as extra links, or keep the chain from cooling on the next stall. | `links?`, `guard?` | reads/writes **the-chain** | **yes** | L1 `the-gathered-room` (chain holds the pool); `attention-engine` |
| 4 | **`pay-fill`** | Pour woken delight (from this play) into the accepted need's-fill; amount may read the room/grain. | `amount` (may be a `read`) | reads **piece delight + (via read) fill/grain** → writes **need's-fill** | **yes** | L1 `the-need's-fill`, fulfil (§2.6); `the-glad-load` |
| 5 | **`crown`** | Widen this play's **overkill→gleam** band, so more attention past the ceiling runs to Standing (grain-stamped). | `band` (may be a `read`) | reads **piece-set over ceiling** → writes **gleam** (play-gated, positive only) | **yes** | L1 `full-cup-overflow`; `overkill-to-standing`/`gleam-runoff` |
| 6 | **`mark-grain`** | Stamp a craft-suit tag onto a target piece or this play (it now *also* counts as that grain this turn). | `target`, `suit` | writes **tags/grain** | **yes** | `grain-tagged-standing` (the-grain-of-gleam); `journey-pieces-deck` suits |
| 7 | **`draw`** | Draw journey-pieces into hand, optionally filtered by grain — more plays, longer chains. | `n`, `suit?` | reads/writes **the-pack, hand** | **yes** | L1 `journey-pieces-deck`; `dawn-income` (hand) |
| 8 | **`retire`** | Last-light a held/inert piece: exhaust it and RETURN its attention to *this node's* table (fuel), thinning the deck. | `target` | writes **the-pack**; writes **the-room/local-table** (node-bound) | **yes** | `evener-sacrifice-velocity`; `attention-conservation`/`the-returning-table` |
| 9 | **`whittle`** | Carve **the-shavings-share** of this play's bench-RETURN into handsels (or brighten one) — bench→money coupling. | `amount` | reads **RETURN share** → writes **handsels** | **yes** | L2 `the-shavings-share`; `bright-shavings-byproduct`; `handsel-currency-decay` |
| 10 | **`court`** | This play *performs a courting term*: a gleam-**vouched** material enters the pack (gleam gates, is never spent). | `stock`, `term` | reads **gleam (gate) + tags (term)** → writes **courted-stock** | **yes** | L2 `two-gate-courting`; `graded-material-market` |
| 11 | **`read`** | Reference/value-source: return a scalar from live shared state, used as the `amount`/`if` of any primitive above. | `source` ∈ {`room`,`fill`,`season`,`spiral`,`grain:<suit>`,`woken`,`chain`} | reads **the named surface** → writes nothing | **yes** (the combo pivot) | `attention-conservation`; `paling-arithmetic-compounding`; `grain-tagged-standing` |
| 12 | **`warm`** | Add a flat printed value to **this piece's own** woken-delight (baseline value, no combo). | `n` | reads/writes **this card only** | no | L1 §2 (delight); `journey-pieces-deck` |
| 13 | **`keep`** | This piece resists the Paling / stays warm one extra season (self-persistence, no combo). | — | reads/writes **this card only** | no | `red-thread-marker`; `introduction-jars-freshness` |

**Interacting: 11 / 13.** The two non-interacting primitives (`warm`, `keep`) are deliberate: every game needs a legible *baseline* value a newcomer can play without a combo, and their presence keeps the density claim honest rather than a suspicious 1.0.

### 1b. The combo harness — triggers (`when`) and guards (`if`)

These are the binding mechanism, not extra nouns; they are what let one card's effect fire *off another card's event* (the second half of the interaction gate):

- **`when`** ∈ `on-play` · **`on-wake`** *(this or a named piece crosses its fixed mark — the marquee hook)* · **`on-chain`** *(while unbroken / at chain-length ≥ n)* · **`on-stall`** · **`on-overkill`** · **`on-fulfil`** *(the need's-fill completes)* · `on-court` · `on-dawn` · `at-dusk`.
- **`if`** = a `read` comparison, e.g. `if read(fill) ≥ half`, `if read(season) ≥ deep-gold`, `if read(grain:song) ≥ 3`.

**Hard gate on cross-channel primitives (play-is-the-only-gate, §2):** `crown`, `pay-fill`, `court`, and `whittle` — the four whose writes sit adjacent to another channel — may only bind to a **play event** (`on-play`/`on-wake`/`on-overkill`/`on-fulfil`/`on-court`). None may fire on `on-dawn`/`at-dusk`. The engine rejects a card that binds them otherwise. This is what makes "a played piece is the only exchange gate" a *compile-time* property, not a hope.

---

## 2. Example cards as data (a three-play combo chain)

Suits shown as `grain`. Marks are **fixed** (locked L1). The chain reads: **build the room → point it at the capstone → dump it, overflow to gleam, bank the byproduct.**

```jsonc
// CARD 1 — the room-builder / chain-keeper
{
  "id": "long-trestle", "name": "The Long Trestle", "grain": "joinery",
  "mark": 2, "ceiling": 4, "woken_delight": 1,
  "effects": [
    { "when": "on-play", "do": "gather",
      "params": { "amount": { "do": "read", "source": "grain:joinery" } } },   // +1 room per joinery already woken
    { "when": "on-chain", "if": null, "do": "steady", "params": { "links": 1 } } // this play counts double toward the chain
  ]
}
```

```jsonc
// CARD 2 — the pointer: stamp the capstone's grain, help it toward its fixed mark
{
  "id": "kiln-bloom", "name": "Kiln-Bloom Glaze", "grain": "glaze",
  "mark": 3, "ceiling": 5, "woken_delight": 2,
  "effects": [
    { "when": "on-play", "do": "rest",
      "params": { "target": "held:capstone",                                    // pre-rest the big piece toward ITS fixed mark
                  "amount": { "do": "read", "source": "room" } } },             // by the size of the room you just built
    { "when": "on-wake", "do": "mark-grain", "params": { "target": "held:capstone", "suit": "song" } } // now it also counts as song
  ]
}
```

```jsonc
// CARD 3 — the capstone: dump the room, pay the fill by song-count, crown the overflow, bank + refill
{
  "id": "whole-town-refrain", "name": "The Whole-Town Refrain", "grain": "song",
  "mark": 7, "ceiling": 8, "woken_delight": 3,
  "tags": ["capstone"],
  "effects": [
    { "when": "on-play", "do": "rest",
      "params": { "target": "self",
                  "amount": { "do": "read", "source": "room" } } },             // one big rest × the-chain crosses the fixed mark 7
    { "when": "on-wake", "do": "pay-fill",
      "params": { "amount": { "do": "read", "source": "grain:song" } } },        // delight into the fill, per song woken this turn
    { "when": "on-overkill", "do": "crown",
      "params": { "band": { "do": "read", "source": "spiral" } } },             // paler country (more rings) → wider overflow→gleam
    { "when": "on-fulfil", "do": "whittle", "params": { "amount": 1 } },         // the shavings-share of THIS fulfilment → a handsel
    { "when": "on-fulfil", "do": "draw", "params": { "n": 1, "suit": "song" } }  // and refill toward the next chain
  ]
}
```

**How the chain fires, one play at a time:**
1. **Long Trestle** — `gather` reads how many joinery you've woken and seats that much room; `steady` banks the chain so the multiplier holds. *Nothing has fulfilled anything yet — it is pure setup that lifts shared state.*
2. **Kiln-Bloom Glaze** — `rest` spends the now-big room **onto the capstone** (helping it toward its *fixed* mark 7 — the mark never moves; you brought more attention); on waking it `mark-grain`s the capstone **song**, so its later `read(grain:song)` will count higher.
3. **The Whole-Town Refrain** — one `rest self by read(room)` × the-chain clears mark 7; `pay-fill by read(grain:song)` pours delight scaled by the song-count Card 2 just inflated; the overkill `crown`s to gleam **wider because the node was pale** (`read(spiral)`); on fulfil `whittle` banks a handsel and `draw` reloads.

Every one of Card 3's numbers was *written by* Cards 1–2 through shared state (room, chain, grain-count). Remove any earlier card and the capstone under-fills — **a reach that falls short, the spilling (L1 §4).** That is the intended risk: the combo is the growth, and the growth is the Standing at stake.

---

## 3. The interaction story

**Which primitive feeds which (shared-state edges):**

- **`gather` → the-room →** every `rest`, and every `read(room)` that scales `rest`/`pay-fill`/`ease-by-room`. The room is the busiest bus in the vocabulary.
- **`steady` → the-chain →** the multiplier on all `rest`, and `read(chain)`.
- **`rest` → piece-set → wake** → fires `on-wake` effects (`mark-grain`, `pay-fill`, `crown`) and → **woken-audience**, which loops back to raise future `gather`/`read(woken)`.
- **`mark-grain` → tags →** `read(grain:*)` (feeds `pay-fill`/`gather` amounts), `court` terms (a stamped suit satisfies a term), and grain-sizing of Standing.
- **`pay-fill` → need's-fill →** `on-fulfil` (fires `whittle`/`draw`/`teach`) and `read(fill)` guards.
- **`crown` → gleam →** (positive only) which off-turn widens the lantern tier; never read *into* a card's write across a channel except as an amount via `read`.
- **`read` →** the universal glue: it makes `room`, `fill`, `season`, `spiral`, `grain`, `woken`, `chain` into live amounts for any other primitive. **This is the single most combo-dense primitive** — it is why the density is high with only 13 verbs.
- **`draw` → the-pack/hand →** more plays → longer `steady`/`rest` chains.
- **`retire` → the-room (local table) + the-pack →** fuels `gather`/`rest` while thinning (the Evener line), and feeds `read(room)` next turn.
- **`whittle` → handsels** and **`court` → courted-stock →** the two couplings out to L2's strategic systems (Handsel Round, Courting Web); both are play-gated and read tags/gleam.

**Non-interacting (baseline only):** `warm` (+delight on its own card), `keep` (its own freshness). They combo with *nothing* by design.

**Interaction_density estimate:** 11 interacting / 13 total = **0.846 → claimed 0.85.** Comfortably over the 0.5 gate. The claim is honest, not maxed: two primitives are deliberately inert so the game has a legible floor.

**Depth argument (why this is combos, not a stat-stick):** the three example cards share *no printed number* — every load-bearing value is a `read` of state an earlier play wrote. The same three cards in a different order (or with a broken chain) under-fill. That order-and-state sensitivity is the definition of a combo engine, and it is produced by exactly one structural choice: **amounts are references, not constants.**

---

## 4. Grammar of light + play-is-the-only-gate compliance

**The three channels never cross except through a played piece.** Audited primitive by primitive:

| Primitive | Channel it touches | Cross-channel? | Legal because… |
|---|---|---|---|
| `gather` | the current (room) | no | draws present audience into the pool; soft-capped; mints nothing (the Breath) |
| `rest` | current → thing (wake) / current → people (overkill) | yes | **play-gated**: attention becomes fired-work or gleam *only* by resting it on a played piece at/over its mark/ceiling |
| `steady` | the current (chain) | no | reorganises momentum within the turn's pool |
| `pay-fill` | thing → places | yes | **play-gated**: pours *woken delight already produced by this play* into the fill; re-colour still happens only on fulfil, never per-play |
| `crown` | current → people | yes | **play-gated + overkill-only**: fires solely `on-overkill`; writes gleam positive; the mint is the canonical "full cup runs to the pourer" |
| `mark-grain` | within things-wake (tags) | no | grain is metadata on pieces; no value moves between channels |
| `draw` / `retire` | within things-wake / current | no | deck ops; `retire`'s RETURN is **node-local attention** (no caravanning) |
| `whittle` | current-RETURN → handsels (held signature of wake) | within-channel, telling-bound | the-shavings-share is *carved from* the RETURN bound by the telling (L2 §4) — no mint on top; play-gated |
| `court` | gleam **gates** → courted-stock enters | no gleam moved | gleam is **read as a gate, never written/spent**; the material enters only via a **performed term** (a play) — "a key that turns, never a coin that leaves" |
| `read` | reads any surface | **never** — read ≠ transfer | reading the season/spiral to *scale* a within-channel effect moves no value; the gleam a `crown(read(spiral))` mints still comes only from played overkill. This is `escalation-is-the-weather` read as opportunity, not a Paling→gleam pipe |
| `warm` / `keep` | this card only | no | static self-modifiers |

**The compile-time gate (§1b):** the four cross-channel-adjacent primitives (`rest`'s overkill, `crown`, `pay-fill`, `court`; plus `whittle`) are *only* bindable to play events. A card that tries to `crown` on `on-dawn` or `court` at `at-dusk` **fails to compile** — so "play is the world's only exchange gate" is enforced by the engine, not merely respected by convention.

**Locked-fact conformance check:**
- Waking-marks are **fixed** — no primitive lowers a mark; the combo lever is bringing *more attention* (`gather`/`steady`/`rest`), exactly as L1 §2.3 states. ✔
- Gleam **only via overkill** (`crown`), **never spent** by any card (`court` reads it as a gate). ✔
- Node **re-colours on fulfilment only** — `pay-fill` pushes the fill; the engine re-colours on `on-fulfil`; no per-play re-colour. ✔
- Attention **node-local** — `rest`'s RETURN and `retire`'s fuel land on *this* node's table; no primitive caravans attention. ✔
- Handsels **not spent inside a turn** — no primitive spends handsels; `whittle` only *produces* them (between-turn wealth). ✔
- The Paling is **board-only, read-only to cards** — `read(season|spiral)` reads it; only engine fulfilment writes it; it never touches the gleam meter. ✔
- Conservation / mint-ban — `gather` from seated audience, `rest`'s conserved SET+RETURN+overkill split, `retire`'s return-to-table, `whittle`'s carved share: no primitive creates or destroys regard. ✔

**D-002 (wonder/whimsy) & D-003 (do-not-resemble):** the verbs are the world's own craft-physics — *gather the room, rest the light onto the work, steady the working, crown the overflow, mark the grain, whittle the shavings, court the shy stuff, keep it warm.* No debt, no fee, no court, no paperwork; every primitive paints (a lifting room, a gold edge taking, light running up into the knuckles). ✔

---

## 5. Why this set (lean + expensive-to-add discipline)

Thirteen verbs, each earning its place against "the engine grows with it":
- **`gather`, `rest`, `steady`, `crown`, `pay-fill`** — the five that *are* the locked working (room → wake → overkill → fill). Non-negotiable.
- **`read`** — the one primitive that turns the other twelve into an engine; deleting it collapses the set to stat-sticks. Highest leverage per byte in the whole vocabulary.
- **`mark-grain`** — the identity/synergy surface (grain), read by sizing, courting, and `read(grain)`; without it there are no "song-grained" builds (L5 archetypes need it).
- **`draw`, `retire`** — the pack levers (tempo + the Evener conversion line); each is one L5 archetype's core verb.
- **`whittle`, `court`** — the two card-level couplings into L2's strategic systems (Handsel Round, Courting Web); without them the four systems don't touch the deck.
- **`warm`, `keep`** — the honest floor: baseline value and freshness, so not every card must combo.

Rejected as primitives (kept as engine events or params, to stay lean): *wake* (an engine state-transition, exposed as the `on-wake` trigger, not a card verb — protects the fixed-mark law); *fulfil/re-colour* (engine event on the fill completing, exposed as `on-fulfil`); *ease/lower-mark* (**would violate the locked fixed-mark law — rejected outright**); *spend-handsels* (between-turn menu, not an in-turn primitive); *four separate readers* (folded into one `read(source)` — composition over count).

---

### Trace table (every primitive → a locked id)

`gather`→`the-gathered-room`/`attention-engine`; `rest`→`the-waking-mark`/`the-returning-table`/`waking-threshold-play`; `steady`→`the-gathered-room`(chain)/`attention-engine`; `pay-fill`→need's-fill(L1 §2.6)/`contract-payoff-bundle`; `crown`→`full-cup-overflow`/`overkill-to-standing`; `mark-grain`→`grain-tagged-standing`; `draw`→`journey-pieces-deck`; `retire`→`evener-sacrifice-velocity`/`attention-conservation`; `whittle`→`the-shavings-share`/`bright-shavings-byproduct`; `court`→`two-gate-courting`/`graded-material-market`; `read`→`attention-conservation`/`paling-arithmetic-compounding`/`grain-tagged-standing`; `warm`→L1 delight/`journey-pieces-deck`; `keep`→`red-thread-marker`/`introduction-jars-freshness`.
