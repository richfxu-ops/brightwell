// Shared test fixtures — one PieceInstance default literal for every suite,
// so a new state field means one edit, not three. Not a test file (no .test.).
import type { Card, Effect } from "./vocabulary.js";
import { createInitialState, type GameState, type PieceInstance } from "./state.js";

let n = 0;

export function testPiece(cardId: string, over: Partial<PieceInstance> = {}): PieceInstance {
  return {
    instanceId: `${cardId}#t${n++}`,
    cardId,
    zone: "hand",
    fired: false,
    set: 0,
    stampedGrains: [],
    wokeThisMorning: false,
    stampedThisMorning: false,
    playedThisMorning: false,
    freshness: 2,
    delightBonus: 0,
    overkillCredited: 0,
    brimBand: 0,
    ...over,
  };
}

/** A fresh seeded state with an EMPTY pieces list; compose your own fixtures. */
export function testState(over: (s: GameState) => void = () => {}): GameState {
  const s = createInitialState(1);
  s.pieces = [];
  over(s);
  return s;
}

export const fx = (do_: string, params: Record<string, unknown> = {}, when = "on-play"): Effect =>
  ({ when, do: do_, params } as unknown as Effect);

/** A minimal canon-shaped Card; override what the test cares about. */
export function testCard(over: Partial<Card> & Pick<Card, "effects">): Card {
  return {
    id: "test-card", name: "Test Card", grain: "thread", mark: 3, ceiling: 6,
    woken_delight: 2, ...over,
  };
}
