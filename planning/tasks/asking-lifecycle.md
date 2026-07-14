---
status: Complete
size: Medium
created: 2026-07-14
completed: 2026-07-14
title: Asking lifecycle
---

## Context

Engine Phase 4 of the 8-phase plan (`docs/engine-plan.html`): make the **asking** (the town's
contract) a real lifecycle — **accept · work · fulfil · escalate · go-stale** — replacing the
toy's FIDELITY stub (an asking that just auto-refreshes each dawn at the leg's floor size). This
is the first piece of the *run* the engine doesn't have yet, and the prerequisite (with Phases 5
and 6) for the simulation harness ([sim-harness.md](sim-harness.md)).

Canon lives in GDD §3 (the contract lifecycle) and `planning/QUESTIONS.md` §C, which already
fixes most numbers as [CANON] and recommends answers for the open items (C1–C6). This task
adopts those; the decisions section records which and why.

## Scope boundary (what is NOT in Phase 4)

Kept out, to land in Phase 5, so this task stays reviewable:
- **The map** — multiple nodes, offers-per-dusk, routing (C4). Phase 4 works the asking on the
  single current node the engine already has.
- **The crown / win-gate / endings** — standing the Wintering crown, the Quiet Walk fail-state
  (C5). Phase 4 makes askings fulfil, escalate, and spill; whether the *run* is won or lost is
  Phase 5.
- **Acquisition** — the glad-load's "one taught card / one material" arrive as events, but the
  deck-growth and courting economy is Phase 6. Phase 4 pays the handsel + card-teach portions
  that already have engine surfaces.

## Approach

Five moving parts, all on the existing single node and calendar:

1. **Accept.** An asking becomes a first-class carried object: a doorstep **kettle** (tier 1) is
   always present, plus the town's own carried asking. Replace `refreshAsking`'s blind
   auto-refresh with a real accept step that records the tier, demand, and the season (leg) it
   was accepted in.
2. **Work.** Already built — the `fill` effect pours woken delight into `asking.progress`. No
   change beyond reading it through the new lifecycle.
3. **Fulfil → the glad-load.** When `progress ≥ needFill`, pay `the-glad-load` scaled off the
   node's spiral rings (rings-in = load-out): bright handsels + one taught card event, emitted
   across the sub-economies that have surfaces today. The `on-fulfil` trigger already fires in
   the cascade; this wires its payout.
4. **Escalate.** The two-filter lantern sizes the next asking: Filter 1 tier =
   `max(peak-gleam ratchet, weather/season floor)`, fired one-way; Filter 2 gates which offers
   are lit by *current* gleam. Skipped needs chalk **1 spiral ring per season** on the node
   (3 = plea, 5 = poem, 7 = great; combing at 7 summed — combing itself is Phase 5).
5. **Go-stale → the spilling.** An accepted asking carried past the leg it was accepted in goes
   stale at the next leg's first dawn → an outcome-only **Standing loss** (the spilling).

New engine surfaces (kept in `morning.ts`/`effects.ts`, tested like the rest): an `accept`
step, a `fulfil` payout, ring accrual on skip, and a staleness/spill check at dawn. The toy
consumes these instead of its stub; its FIDELITY note for the asking lifecycle is retired.

## Decisions (adopting QUESTIONS.md §C recommendations)

- **[CANON] taken as given:** tiers kettle 1 → great 7; rings 3/5/7; combing at 7 summed;
  filter-1 = max(peak-gleam, weather floor), filter-2 gated by current gleam; rings accrue 1 per
  skipped season per node; glad-palm +1, delayed tellings +1–2.
- **C1 · spilling size** → lost gleam = the stale asking's **tier size** (a stale poem costs 5),
  floor 1. Big enough to fear, scales with ambition, M4-tunable.
- **C2 · "unmoved room" flop** → a morning ends with an accepted asking **untouched AND** a room
  that was never poured (reaching-and-idle), distinct from merely under-filling.
- **C3 · staleness window** → the leg it was accepted in; an asking taken in Long Light spills at
  Deep Gold's first dawn.
- **C6 · glad palms now, tellings deferred** → glad palms (+1 on doorstep kettles) land in this
  phase; delayed tellings (the road-graph walk) get a FIDELITY marker and defer to post-M4 —
  flavor-critical but sim-marginal.

These are recommendations in the register, not yet ratified — **user sign-off promotes them to
`DECISIONS.md` (a new dated entry) at review**, closing C1/C2/C3/C6.

- **Everything is a named, centralized tunable (user call, 2026-07-14).** The user approved the
  above provisionally — "let me feel things out first." So every Phase-4 number (spilling size &
  floor, staleness window, glad-load ring scaling, glad-palm bonus, unmoved-room definition)
  lives as a **named constant in one `ASKING_TUNABLES` block**, each with a one-line comment,
  matching the existing `STALL_ROOM_FACTOR`/`DAWN_BASE` pattern — changing any is a one-line edit,
  no logic hunting. The toy **surfaces these mechanics** (a fulfil paying out, rings escalating,
  the spilling costing Standing) so they can actually be felt, since the engine change is
  invisible without it.

## Plan

- [x] `src/engine/asking.ts` — the `ASKING_TUNABLES` block + accept · fulfil · escalate · stale · flop
- [x] `accept` + carried-asking state (`acceptedLeg`/`touched` on Asking; doorstep kettle at dawn)
- [x] `fulfil` glad-load payout (handsels rings-scaled + glad-palm + taught-card event; node re-made)
- [x] ring accrual on skip; next-asking sizing = max(weather floor, rings, peak-gleam ratchet)
- [x] `spillGleam` (the Standing-loss path) + `peakGleam` one-way ratchet in `creditGleam`
- [x] staleness check at dawn → the spilling (C1 size, C3 window); unmoved-room flop at dusk (C2)
- [x] tests: `asking.test.ts` (8 new — accept/fulfil/stale/escalate/flop/floor/tierOf); 100 total pass
- [x] toy consumes real askings (retired the FIDELITY `refreshAsking` stub); surfaces glad-load,
      the spilling, rings, and a re-made panel; preview reads fulfilment from events
- [x] promote C1/C2/C3/C6 to DECISIONS.md (D-012); board + docs sync; merged to main

Verified in-browser (2026-07-14): the engine accepts the doorstep kettle at dawn (no stub);
waking The Standing Count completes the kettle → glad-load +2 to the purse, panel shows "Re-made
🌼", moment feed narrates the whole chain; an idle morning flops at dusk → the spilling −1
Standing, floored at 0 (never negative). Staleness + escalation covered by unit tests.

**Open at review:** promote C1/C2/C3/C6 to `DECISIONS.md`. Every number is an `ASKING_TUNABLES`
entry (per the user's "feel it out" constraint) — the values are provisional and one-line-changeable.
