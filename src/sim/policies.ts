// policies.ts — the six archetype bot policies (engine Phase 7, Part B). Each Way plays its OWN
// identity: a per-archetype preference for which effects to play and which offers to draft, layered
// on Part A's baseline shape (advance the need / wake / grow the deck / end). Deliberately simple
// (user-decided) — a tilt, not a tuned optimizer, so every number stays a floor. Archetype identity
// lives here in policy + the seeded Way-cards, never in the engine.

import type { Card } from "../engine/vocabulary.js";
import type { GameState } from "../engine/state.js";
import type { MorningContext } from "../engine/morning.js";
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

/** Hand cards the room can pay for right now (the shared first move of every policy). */
function affordablePlays(state: GameState, ctx: MorningContext): { p: GameState["pieces"][number]; card: Card }[] {
  return state.pieces
    .filter(p => p.zone === "hand")
    .map(p => ({ p, card: ctx.cardOf(p.cardId) }))
    .filter(x => x.card.mark <= state.turn.room);
}

/** Fair offers payable right now, empty once the morning's draft cap is spent. */
function affordableOffers(state: GameState): string[] {
  if (state.turn.draftedThisMorning >= ACQUISITION_TUNABLES.DRAFT_PER_MORNING) return [];
  return state.turn.fairOffers.filter(id => {
    const cost = fairCostOf(id);
    return cost.kind === "handsel"
      ? state.player.handsels.length >= cost.price
      : state.turn.chainLinks >= cost.termChain;
  });
}

/** Build a Way's policy: prefer its identity's cards, else fall back to the baseline's greedy shape. */
function makePolicy(archetype: Archetype): Policy {
  const preferred = PREFERRED_DO[archetype];
  if (preferred.length === 0) return baselinePolicy;

  return (state, ctx) => {
    if (state.turn.room > 0) {
      const affordable = affordablePlays(state, ctx);
      if (affordable.length > 0) {
        // score: the Way's preferred effect first, then advancing an open need, then cheapest
        const score = (x: { card: Card }): number =>
          (hasDo(x.card, preferred) ? 2 : 0) + (state.asking && fillsNeed(x.card) ? 1 : 0);
        const pick = affordable.sort((a, b) => score(b) - score(a) || a.card.mark - b.card.mark)[0];
        return { kind: "play", instanceId: pick.p.instanceId, pour: pick.card.mark };
      }
    }

    // grow the deck: prefer an offer matching the Way, else the cheapest we can pay for, within the cap
    const offers = affordableOffers(state);
    const offer = offers.find(id => hasDo(ctx.cardOf(id), preferred)) ?? offers[0];
    if (offer) return { kind: "draft", cardId: offer };

    return { kind: "end", camp: true } satisfies Action;
  };
}

/**
 * The exploit bot (card-telemetry task): the degenerate fill-first line a human found trivializing —
 * pour fill cards into every open asking (cheapest first, so more fills land per morning) and draft
 * every fill-carrying offer over anything else. Deliberately dumb otherwise: its win-rate gap over
 * the identity policies is the harness's "filling the need is trivial" measure, watched downward as
 * cards are rebalanced. A strategy is a policy, never an engine flag (Phase-7 rule).
 */
export const exploitPolicy: Policy = (state, ctx) => {
  if (state.turn.room > 0) {
    const affordable = affordablePlays(state, ctx).sort((a, b) => a.card.mark - b.card.mark);
    const fillers = state.asking ? affordable.filter(x => fillsNeed(x.card)) : [];
    const pick = fillers[0] ?? affordable[0];
    if (pick) return { kind: "play", instanceId: pick.p.instanceId, pour: pick.card.mark };
  }

  const offers = affordableOffers(state);
  const offer = offers.find(id => fillsNeed(ctx.cardOf(id))) ?? offers[0];
  if (offer) return { kind: "draft", cardId: offer };

  return { kind: "end", camp: true } satisfies Action;
};

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
