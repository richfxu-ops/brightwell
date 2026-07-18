---
status: To Do
size: Large
created: 2026-07-18
title: Story & cast bible
---

## Context

The world bible is a *systems* bible — factions, laws, economy, places, voice — and
deliberately contains almost no named people, no specific historical events, and little item
lore. This task fills that gap with a story layer: named characters for the Ways, events, and
wonder-lore, written as **derived canon under `WORLD.md`** (additive; the locked bible is
never edited, and every sentence must pass its register bans and naming laws).

Canon already tells us where each piece plugs in — the layer should be written into these
sockets, not alongside them:

- **Characters → the giving-line** (WORLD.md Layer 6). Every card's flavor is a quote from
  the person who gave it — "the deck is an autobiography of teachers." Today those givers
  are anonymous. A named cast per Way (teachers, elders, rivals) feeds directly into card
  text — the most load-bearing home characters can have, and the piece that pays off
  soonest, since [[way-rebuild]] is authoring cards now.
- **"Legendary items" → the unmarked wonders** (Layer 2). Canon *forbids* the classic
  artifact-with-a-famous-maker: closure ate the attribution, and wonders' makers were "no
  brighter, older, or other than today's." Item lore here means new wonders, near-closures
  (the stair at Setterby), and disputed candidates (the ferry-bell at Hask) — never
  pedigree pieces.
- **Events → the calendar and the two arguments** (Layers 3 & 5). The wander-year, the four
  lights, the Round Fair, the great askings, and the two standing arguments (the mending
  question; fired-or-fed) give the event grammar. No villains, no wars — "two arguments,
  no blades" — so events are fairs, seasons, quarrels-by-courtesy, and riddles.
- **Story → the winter-telling** (Layer 5). Run-end as a telling; any framed narrative
  belongs in that voice.

**Guards:** characters and legendary items are where generic fantasy leaks in fastest
(chosen ones, ancient evils, artifacts of power). The layer is held to the same
anti-generic bar as the original pipeline, and sanctioning derived canon under a locked
bible is itself a decision — log it in `DECISIONS.md` at sign-off.

## Open questions (decide at scoping)

- **Q1 — flavor or constraint?** Does this lore ever *constrain* mechanics (a character
  gating a card, a wonder with rules text), or is it flavor-only over existing data? This
  one choice sets the care level for every sentence. Leaning: flavor-only to start.
- **Q2 — where does it live?** One `planning/STORY.md`, or a `planning/lore/` folder with
  registers (cast / wonders / events)? Decide with an eye to what `bake-codex.py` could
  surface in the codex.
- **Q3 — scope order.** Leaning: cast first (feeds giving-lines and the way-rebuild card
  work), wonders and events after, framed tales last.
- **Q4 — process.** Conversational layer-by-layer with the owner, vs. the story-architect
  skill, vs. a design-council pass per register. Leaning: conversational — the heavy
  pipelines are token-heavy and the world foundation already exists.
- **Q5 — how cast attaches to cards.** Does way-rebuild pick givers from the cast registry
  as cards are designed, and does the giving-note become structured card data
  (`src/content/cards/`) rather than free text?

## Scope to define (when picked up)

- Answer Q1–Q5 with the owner; record the derived-canon sanction in `DECISIONS.md`.
- Define the register format for a cast entry (name, Way, place, voice notes, giving-lines
  bank) before writing any entries.
- Set the acceptance bar: every entry passes the Layer 6 naming laws, the final
  register-ban compilation, and the mug test for any quoted line.
