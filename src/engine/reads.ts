// reads.ts — the read evaluator: turns any source of the closed ReadSource enum
// into a number from live state. "Amounts are references, not constants" (GDD L3);
// the grain:/woken: split follows the D-009 ruling.

import type { Grain, ReadSource } from "./vocabulary.js";
import type { GameState, PieceInstance } from "./state.js";
import { SEASON_SEEP_BY_LEG, currentNode } from "./state.js";

/** Does a piece count as this grain — printed suit or a mark-grain stamp? */
export function countsAs(piece: PieceInstance, grain: Grain, printedGrain: Grain): boolean {
  return printedGrain === grain || piece.stampedGrains.includes(grain);
}

export interface ReadContext {
  // printed grains by cardId — supplied by the caller so reads stay content-agnostic
  grainOf: (cardId: string) => Grain;
}

export function evaluateRead(source: ReadSource, state: GameState, ctx: ReadContext): number {
  if (source.startsWith("grain:")) {
    // D-009: this morning's working — pieces that woke or were stamped today.
    const grain = source.slice("grain:".length) as Grain;
    return state.pieces.filter(
      p => (p.wokeThisMorning || p.stampedThisMorning) && countsAs(p, grain, ctx.grainOf(p.cardId)),
    ).length;
  }
  if (source.startsWith("woken:")) {
    // D-009: the cross-turn fired audience — today's wakes seat tomorrow.
    const grain = source.slice("woken:".length) as Grain;
    return state.pieces.filter(
      p => p.fired && !p.wokeThisMorning && countsAs(p, grain, ctx.grainOf(p.cardId)),
    ).length;
  }

  // startsWith() above handled the parameterized members; what remains is the plain enum.
  const plain = source as Exclude<ReadSource, `grain:${Grain}` | `woken:${Grain}`>;
  switch (plain) {
    case "room":
      return state.turn.room;
    case "chain":
      return state.turn.chainLinks;
    case "fill":
      return state.asking?.progress ?? 0;
    case "season":
      return SEASON_SEEP_BY_LEG[state.calendar.leg];
    case "spiral":
      return currentNode(state).rings;
    case "handsels":
      return state.player.handsels.reduce((sum, h) => sum + h.brightness, 0);
    case "over-ceiling":
      return state.turn.overCeiling;
    default: {
      const impossible: never = plain;
      throw new Error(`unknown read source: ${String(impossible)}`);
    }
  }
}
