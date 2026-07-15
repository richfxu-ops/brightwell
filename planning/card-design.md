---
status: Draft v0
created: 2026-07-14
title: Card Design Bible
---

# Card Design Bible

> The quality bar for Brightwell cards. `validate.ts` enforces card *legality* (canon firewall);
> this enforces card *quality*. Every rule is tagged by how it's enforced:
> **[LINT]** decidable from card data → a build-time check (`card-lint`);
> **[REVIEW]** needs judgment → checked in design review + the card-smith brief;
> **[HARNESS]** only provable by play → measured by the sim.
>
> This doc is the source the card-smith brief is built from, and the yardstick the pool is audited
> against. Seeded from the 2026-07-14 playtest session (the room-fill one-shot, the grain-fill dry-up,
> Even the Rim's dead headline).

## 0. The core question

**Does the card's benefit warrant its cost — on the turn you play it AND every time you replay it?**

The compounding game (GDD §2) replays woken cards for their on-play effects, so "good on turn one"
is not enough — the failure mode we keep hitting is **replay payback**: a card that does nothing
meaningful once the deck is woken and you're playing it for the fifth time.

### The currencies

| Currency | What it is | Produced by | The lever it moves |
|---|---|---|---|
| **Room** | the per-turn attention budget | gather, dawn, woken audience | everything — you spend it |
| **Fill** | progress on an asking / the crown | `fill` | **the win** |
| **Standing** | the fail-resource + Fair/asking gate | overflow (rest past ceiling), `brim` | survival, not victory |
| **Cards** | hand refill | `draw` | keeps the engine fed |
| **Handsels** | money for Fair purchases | `whittle` | deck growth |
| **Tempo** | chain multiplier + stall-brace | `steady` | amplifies the room |
| **Deck** | thin (retire) / grow (court, draft) | `retire`, `court` | shape the draws |
| **Board** | slow this node's paling | `soothe` | route/pressure relief |
| **Audience** | permanent room-seaters | waking (rest past mark) | the compounding itself |

### The cost of a card

- **1 play** — you get only a handful of plays per morning; each is an opportunity cost.
- **the wake-mark** — one-time attention to wake it (then it's permanent audience).
- **room consumed** — rest/gather spend the room.
- **a deck slot** — every card dilutes your draws.
- **acquisition** — Fair tier: handsels (tier 1–2) or a courted term (tier 3).

**Standing ≠ winning.** Overflow→Standing keeps you lit and widens the Fair, but you win by *filling*
the crown. A card whose only payoff is a Standing trickle is servicing the *survival* line, and a deck
of them is the turtle that drifts (the playtest that started all this: Standing 250, crown 0/10).

---

## 1. Value — benefit vs cost

- **R1 · Replay payback [REVIEW]** — the card must do meaningful work when replayed in the woken
  late-game, not only on its first play. On-wake-only gifts and bare rest-self dumps fail here.
- **R2 · Overflow must be spent [LINT]** — a `rest self` that can push past the ceiling must be paired
  with a `fill` or `brim` that *uses* the overflow. A bare rest-self (overflow → only a Standing
  trickle) is a dead headline. *(Even the Rim fails this.)*
- **R3 · Fills scale right [LINT]** — a repeatable `fill` reads `woken:<suit>` (the engine) or `chain`
  (bounded, rebuildable). **Never `room`** (one-shots the crown) and never bare `grain:<suit>` alone
  (dries up once the deck is woken).
- **R4 · Cost calibrates power [REVIEW]** — mark + Fair tier must track effect magnitude, both ways: no
  cheap card with a capstone effect, no expensive card with a weak one. (Bands in §5.)
- **R5 · Net-positive in a currency that matters [REVIEW]** — score cost (play + room + mark + slot)
  against benefit by currency; the benefit must beat the cost in ≥1 currency that matters
  (fill / Standing / tempo / cards / room), **on play and on replay**.

## 2. Role — a clear job

- **R6 · Capstones win [REVIEW]** — a Way's marquee card (woken_delight ≥ 3, proud/capstone) must
  advance the win (`fill` or `brim`), not merely be a big audience piece or a conditional engine.
- **R7 · Every Way has a complete win-path in its starter core [LINT+HARNESS]** — a repeatable filler
  **+** a room/count builder **+** a payoff, all seeded. (The eveners/fairwrights 0-win trap.)
- **R8 · One legible role [REVIEW]** — each card is primarily one thing: filler, builder, payoff,
  cycler, or support. Cards that try to be everything read as noise.

## 3. Decision — interesting choices

- **R9 · No auto-includes, no auto-cuts [HARNESS+REVIEW]** — every card is the right call in some
  states and the wrong call in others. Played ~always or ~never = flat.
- **R10 · Legibility [REVIEW]** — the *headline* effect is the card's actual point. Value must not hide
  in a conditional clause (a dead front + all the payoff in `on-fulfil`). *(Even the Rim again.)*
- **R11 · Floor/ceiling matches the Way [REVIEW]** — high-variance (big ceiling, low floor) → spike
  Ways (Fairwrights); tight/consistent → control Ways (Eveners).

## 4. Identity — belongs to its Way

- **R12 · Way-primitive fit [REVIEW]** — leans on the Way's signature verbs (§6).
- **R13 · Canon laws [LINT]** — never violates a locked law: Evener no `read(handsels)→gather`; `brim`
  Fairwright-only; `soothe` Gleaner-only; `season`/`spiral` feed only gather/whittle/fill/soothe;
  play-gated verbs bind only to play events. *(Mostly already in `validate.ts`.)*

## 5. Empirical — proven by the harness

- **R14 · No dead cards [HARNESS]** — played in a reasonable share of runs where it's available.
- **R15 · No dominant card [HARNESS]** — no single card is played ~every run or drives an outsized
  win-share. (Current diversity is healthy: top card 7–10% of plays.)
- **R16 · Every Way wins [HARNESS]** — each archetype stands the crown at a non-zero rate.

---

## 6. Cost-calibration bands (rough, tune with the harness)

| Band | mark | tier (wd) | acquire | expected shape |
|---|---|---|---|---|
| **Enabler** | 1–2 | 1 (wd 1) | 1 handsel | one small effect or a combo on-ramp; low ceiling |
| **Workhorse** | 3–5 | 2 (wd 2) | 2 handsels | a builder + a rider, or a mid `fill` |
| **Capstone** | 6–8 | 3 (wd 3+) | courted (chain ≥3) | must win (`fill`/`brim`); big payoff; the Way's marquee |

## 7. Way identity + signature verbs (for R12 and the card-smith brief)

| Way | grain | signature | win-path |
|---|---|---|---|
| **Kilnfast** | joinery | `steady` + `woken:joinery` compounder feeding `gather`/`fill` | fill by the woken joinery audience |
| **Eveners** | dance/thread | `retire`→room + `whittle`, glued by `steady`/chain | fill by chain; consistency/control |
| **Untold** | thread | `draw` (thin fast deck) + cheap `fill` by count-and-pace | fill by chain; many cheap plays |
| **Fairwrights** | dance | `gather` (giant room) + `brim` (the only gleam-writer) | brim overflow → Standing; fill by woken:dance |
| **Mannerly** | song | `court` + `mark-grain`/`read(grain:song)` growing the count | fill by the song count; highest ceiling |
| **Gleaners** | glaze | `read(spiral/season)` scaling `gather`/`whittle` + `soothe` | fill by woken:glaze; board/pale route |

**Canon laws (never break):** Evener's room comes from retires, never the purse. `brim`/overkill-spike
is the Fairwright's alone. `soothe` is the only board-writer, Gleaner-only. Courting reads gleam as a
gate, never spends it. `season`/`spiral` never touch a gleam path.

---

## 8. The audit scorecard (one row per card)

For the pool audit, each card gets: **id · Way · role · costs** (mark, tier, room-use) **· benefits**
(by currency) **· payback** (play? replay?) **· win-relevance** (advances / survival-only / enabler)
**· decision** (auto-include / auto-cut / situational) **· flags** (rule violations) **· harness**
(play-freq, win-share) **· verdict** (keep / fix / cut).

## 9. Open questions (to settle together)

- **Q1** — Do we want hard *numeric* payback thresholds (e.g. "a wd-2 card must return ≥ its mark in a
  key currency within 2 plays"), or keep R5 qualitative until the economy is more built?
- **Q2** — R7 says every Way needs a full win-path *in its starter core*. Should some of that path be
  allowed to live in the Fair-only pool (drafted), or must the opening deck be self-sufficient?
- **Q3** — R9/R14 need thresholds: what play-frequency counts as "dead" vs "dominant"? (Propose:
  dead < 3% of plays for a starter it's always in the deck for; dominant > 25%.)
- **Q4** — Do bare rest-self *support* pieces (non-capstone: seasoned-timber, set-the-keel-block,
  feed-and-fire, even-by-lastlight, mend-the-verge, ease-the-grey) get fixed too, or are they
  acceptable as self-waking utility with a real secondary effect?
