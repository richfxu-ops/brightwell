import { describe, it, expect } from "vitest";
import type { Grain } from "./vocabulary.js";
import { createInitialState, type PieceInstance } from "./state.js";
import { evaluateRead, type ReadContext } from "./reads.js";
import { testPiece, testState } from "./test-helpers.js";

// A tiny content table for tests, so reads stay independent of the real card pool.
const TEST_GRAINS: Record<string, Grain> = {
  "test-song-a": "song",
  "test-song-b": "song",
  "test-trestle": "joinery",
};
const ctx: ReadContext = { grainOf: id => TEST_GRAINS[id] ?? "dough" };

const piece = (cardId: string, over: Partial<PieceInstance> = {}): PieceInstance =>
  testPiece(cardId, { zone: "pack", ...over });
const state = testState;

describe("simple surfaces", () => {
  it("room / chain / over-ceiling read the turn", () => {
    const s = state(s => { s.turn.room = 6; s.turn.chainLinks = 3; s.turn.overCeiling = 2; });
    expect(evaluateRead("room", s, ctx)).toBe(6);
    expect(evaluateRead("chain", s, ctx)).toBe(3);
    expect(evaluateRead("over-ceiling", s, ctx)).toBe(2);
  });

  it("fill reads the accepted asking's progress (0 with no asking)", () => {
    const s = state(s => {
      s.asking = { tier: "plea", needFill: 3, progress: 2, acceptedMorning: 5, staleAfterMornings: 6 };
    });
    expect(evaluateRead("fill", s, ctx)).toBe(2);
    expect(evaluateRead("fill", createInitialState(1), ctx)).toBe(0);
  });

  it("season follows the leg's seep stage: 1·3·5·7, Wintering holds at 7", () => {
    const byLeg = [0, 1, 2, 3, 4].map(leg => {
      const s = state(() => {});
      s.calendar.leg = leg;
      return evaluateRead("season", s, ctx);
    });
    expect(byLeg).toEqual([1, 3, 5, 7, 7]);
  });

  it("spiral reads this node's rings", () => {
    const s = state(s => { s.board.nodes[0].rings = 5; });
    expect(evaluateRead("spiral", s, ctx)).toBe(5);
  });

  it("handsels reads the purse's total brightness (dull 1 / warm 2 / singing 3)", () => {
    const s = state(s => {
      s.player.handsels = [
        { brightness: 1, idleMornings: 0 },
        { brightness: 3, idleMornings: 0 },
      ];
    });
    expect(evaluateRead("handsels", s, ctx)).toBe(4);
  });
});

describe("grain: vs woken: (the D-009 ruling)", () => {
  it("grain:<suit> counts this morning's working — wakes and stamps today", () => {
    const s = state(s => {
      s.pieces = [
        piece("test-song-a", { wokeThisMorning: true, fired: true }),          // woke today: counts
        piece("test-trestle", { stampedThisMorning: true, stampedGrains: ["song"] }), // stamped song today: counts
        piece("test-song-b", { fired: true }),                                  // fired an earlier morning: does NOT count
        piece("test-song-b", { playedThisMorning: true }),                      // played but neither woke nor stamped: does NOT count
      ];
    });
    expect(evaluateRead("grain:song", s, ctx)).toBe(2);
  });

  it("grain:<suit> resets at dawn — nothing in the working means zero", () => {
    const s = state(s => {
      s.pieces = [piece("test-song-a", { fired: true }), piece("test-song-b", { fired: true })];
    });
    expect(evaluateRead("grain:song", s, ctx)).toBe(0);
  });

  it("woken:<suit> counts the fired audience from earlier mornings only", () => {
    const s = state(s => {
      s.pieces = [
        piece("test-song-a", { fired: true }),                          // seated earlier: counts
        piece("test-song-b", { fired: true, wokeThisMorning: true }),   // woke today — seats tomorrow: does NOT count
        piece("test-trestle", { fired: true }),                         // wrong suit: does NOT count
      ];
    });
    expect(evaluateRead("woken:song", s, ctx)).toBe(1);
  });

  it("a stamp makes a fired piece also count as the stamped suit", () => {
    const s = state(s => {
      s.pieces = [piece("test-trestle", { fired: true, stampedGrains: ["song"] })];
    });
    expect(evaluateRead("woken:song", s, ctx)).toBe(1);
    expect(evaluateRead("woken:joinery", s, ctx)).toBe(1);
  });
});

describe("createInitialState", () => {
  it("deals the 7-card apprentice deck into the pack, morning 1, empty room", () => {
    const s = createInitialState(42);
    expect(s.pieces).toHaveLength(7);
    expect(s.pieces.every(p => p.zone === "pack" && !p.fired)).toBe(true);
    expect(s.calendar).toEqual({ morning: 1, leg: 0 });
    expect(s.turn.room).toBe(0);
    expect(s.rng).toEqual({ seed: 42, counter: 0 });
  });

  it("is fully JSON-serializable (save/replay comes free)", () => {
    const s = createInitialState(7);
    expect(JSON.parse(JSON.stringify(s))).toEqual(s);
  });
});
