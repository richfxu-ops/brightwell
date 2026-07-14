---
status: In Review
size: Medium
created: 2026-07-14
title: The worked morning
---

## Context

Phase 3 of the M3 engine plan: the conductor over Phase 2's instruments — one full turn from
dawn to dusk. The five rule decisions landed as D-010; the formulas are locked L6 canon
(chain multiplier m = 1 + 0.25×(links−1) cap 2.0; dawn = base 2 + 0.5×rings [unless soothed]
+ ⅔ table if camped + the home-note seat; hand refills to 5). Its proof is the golden test
from the GDD: the Kilnfast chain wakes in order and under-fills out of order.

## Approach

**`src/engine/morning.ts`** — pure functions over GameState, same style as effects.ts:

- **`dawn(state)`** — advance the calendar; seat the audience under the seat law (home-note
  first, then every fired piece — the snowball made literal); add the flat base, the ring
  draw (zero if the node is soothed), and ⅔ of the local table if camped; reset the morning
  flags and cold pieces' set (D-010 B1); refill the hand to 5 (reshuffling the discard only
  when the pack runs dry, B4); then fire on-dawn effects of fired pieces (B5) in a B3 cascade.
- **`playPiece(state, instanceId)`** — the one exchange gate: move the piece in-play, count
  the chain link, resolve its on-play effects in played order, cascade any triggered
  listeners (B3, fire-once), track played order for future cascades.
- **`stallAction(state, kind)`** — any non-play action: braced ? consume the brace : halve
  the room and break the chain (B2).
- **`dusk(state)`** — the B1 sweep (unspent room + cold pieces' set → this node's table);
  fire at-dusk effects; move unplayed hand + resolved pieces to the discard (B4); run the
  **conservation check**: dawn's attention must equal woken SET + overflow credited + table
  RETURN, nothing minted or lost (throws in tests, warns in play).
- **Zone change:** add `"discard"` to the Zone union (B4).

## Decisions (interpretations to sign off)

- **A stall breaks the chain too.** Canon calls the chain "unbroken work"; a stall both halves
  the room AND resets chain links; a brace absorbs both effects of one stall.
- **The multiplier applies at rest.** "Spend the room as a multiplier on the play" + the napkin
  formula: a rest spends X room and the piece receives X × m (m from current chain links,
  cap 2.0). The room pays face value; the chain makes it land harder.
- **Fired pieces are cards AND audience.** They cycle through pack/hand/discard and can be
  played again (their on-play still fires); their audience-presence (seat at dawn, woken:
  counts) is permanent regardless of zone.
- **Camping is a dusk choice.** Dusk offers "camp here" alongside travel; Phase 3 stubs travel
  (single node) behind the same choice API Phase 5 will fill — FIDELITY marker.
- **The morning API is what bots and the toy morning will drive:** dawn → (playPiece |
  stallAction)* → dusk. No hidden steps.
- **Playing IS pouring (found writing the golden test).** L1 §2: the play itself spends the
  room as a multiplier onto the played piece — so `playPiece(state, id, pour, ctx)` takes a
  pour amount (0 = bank the piece cold). `rest` and the play share one `pourAttention` helper
  (wake/overkill automatics identical). Pour 1 on a mark-1 apprentice = the guaranteed
  decision-free-morning wake canon promises.
- **"held" = unfired, not in-hand (canon `fired-vs-held`).** `held:capstone` targets an
  unfired capstone in hand OR banked in play — which is what makes the marquee line work:
  bank the capstone cold early in the chain, aim the room at it, detonate. Its on-wake
  effects then fire because it is in the played order (B3).
- **on-chain fires on chain growth:** each `played` event triggers on-chain listeners
  (including the just-played card), fire-once per morning.

## Plan

- [x] Zone "discard" + played-order tracking in TurnState
- [x] dawn(): calendar, seating, income, flag resets, refill, on-dawn cascade
- [x] The trigger cascade (B3): played-order listeners + cause-piece self-triggers, fire-once
- [x] playPiece(): pour-on-play (shared pourAttention), chain links, on-play + cascade
- [x] stallAction(): brace-or-halve + chain break
- [x] dusk(): the B1 sweep, at-dusk effects, discard flow, handsel idle-lapse, camp choice
- [x] Golden test: the Kilnfast chain (in order wakes the Beam + completes the poem; out of order under-fills)
- [x] Conservation test (two-ledger) + a scripted full legal morning end-to-end
- [x] typecheck + suite green (92); board + docs sync
