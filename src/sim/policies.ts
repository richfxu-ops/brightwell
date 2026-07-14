// policies.ts — the six archetype bot policies (engine Phase 7, Part B). Each Way plays its OWN
// identity: a per-archetype preference for which effects to play and which offers to draft, layered
// on Part A's baseline shape (advance the need / wake / grow the deck / end). Deliberately simple
// (user-decided) — a tilt, not a tuned optimizer, so every number stays a floor. Archetype identity
// lives here in policy + the seeded Way-cards, never in the engine.

import type { Card } from "../engine/vocabulary.js";
import { ACQUISITION_TUNABLES, fairCostOf } from "../engine/acquisition.js";
import { type Action, type Archetype, type Policy, baselinePolicy, runGame } from "./driver.js";
import type { RunObservations } from "./driver.js";

/**
 * The effect verbs each Way leans into, from its card pool (design/starter-pool). The bot prefers
 * hand cards and offers that carry one of these — so the records reflect how the Way actually plays.
 * (eveners/fairwrights carry no `fill`; their tilts lean on their real strengths, and the harness
 * lets the "can't fulfil from the starting deck" weakness show — a Phase-8 balance signal.)
 */
const PREFERRED_DO: Record<Archetype, readonly string[]> = {
  apprentice: [],                                  // no tilt — the generic baseline
  kilnfast: ["rest", "steady"],                    // tempo: fast waking, keep the chain moving
  eveners: ["retire", "whittle", "steady"],        // consistency: cycle the deck, mint handsels
  untold: ["draw", "fill"],                        // count/pace: draw wide, many cheap fills
  fairwrights: ["gather", "brim"],                 // spike: build the room, brim overflow → gleam
  mannerly: ["court", "fill", "steady"],           // chains + courting proud stock
  gleaners: ["soothe", "gather"],                  // board/pale-route: mend and gather
};

const hasDo = (c: Card, dos: readonly string[]): boolean => c.effects.some(e => dos.includes(e.do));
const fillsNeed = (c: Card): boolean => c.effects.some(e => e.do === "fill");

/** Build a Way's policy: prefer its identity's cards, else fall back to the baseline's greedy shape. */
function makePolicy(archetype: Archetype): Policy {
  const preferred = PREFERRED_DO[archetype];
  if (preferred.length === 0) return baselinePolicy;

  return (state, ctx) => {
    const room = state.turn.room;
    const hand = state.pieces.filter(p => p.zone === "hand");

    if (room > 0) {
      const affordable = hand
        .map(p => ({ p, card: ctx.cardOf(p.cardId) }))
        .filter(x => x.card.mark <= room);
      if (affordable.length > 0) {
        // score: the Way's preferred effect first, then advancing an open need, then cheapest
        const score = (x: { card: Card }): number =>
          (hasDo(x.card, preferred) ? 2 : 0) + (state.asking && fillsNeed(x.card) ? 1 : 0);
        const pick = affordable.sort((a, b) => score(b) - score(a) || a.card.mark - b.card.mark)[0];
        return { kind: "play", instanceId: pick.p.instanceId, pour: pick.card.mark };
      }
    }

    // grow the deck: prefer an offer matching the Way, else the cheapest we can pay for, within the cap
    if (state.turn.draftedThisMorning < ACQUISITION_TUNABLES.DRAFT_PER_MORNING) {
      const affordable = state.turn.fairOffers.filter(id => {
        const cost = fairCostOf(id);
        return cost.kind === "handsel"
          ? state.player.handsels.length >= cost.price
          : state.turn.chainLinks >= cost.termChain;
      });
      const offer = affordable.find(id => hasDo(ctx.cardOf(id), preferred)) ?? affordable[0];
      if (offer) return { kind: "draft", cardId: offer };
    }

    return { kind: "end", camp: true } satisfies Action;
  };
}

/** One policy per archetype (built once, exhaustive over the union — no cast). */
export const POLICIES: Record<Archetype, Policy> = {
  apprentice: makePolicy("apprentice"),
  kilnfast: makePolicy("kilnfast"),
  eveners: makePolicy("eveners"),
  untold: makePolicy("untold"),
  fairwrights: makePolicy("fairwrights"),
  mannerly: makePolicy("mannerly"),
  gleaners: makePolicy("gleaners"),
};

/** Play a run with the archetype's own policy — the Part-B entry the harness and sim use. */
export function runArchetype(seed: number, archetype: Archetype): RunObservations {
  return runGame(seed, archetype, POLICIES[archetype]);
}
