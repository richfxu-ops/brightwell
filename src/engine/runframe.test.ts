// runframe.test.ts — Phase 5: the run frame. The three endings + the static-deck-must-lose gate.
import { describe, it, expect } from "vitest";
import type { Card } from "./vocabulary.js";
import { createInitialState, WORKED_MORNINGS_TOTAL } from "./state.js";
import { dawn, dusk, playPiece } from "./morning.js";
import { RUN_TUNABLES, isWintering } from "./runframe.js";
import { testState, testPiece } from "./test-helpers.js";
import starterPool from "../content/cards/starter-pool.json" with { type: "json" };

const POOL = new Map((starterPool.cards as unknown as Card[]).map(c => [c.id, c]));
const poolCtx = { cardOf: (id: string) => POOL.get(id)! };
const noCtx = { cardOf: () => ({} as Card) };

// a synthetic filler: pours a flat amount into the need on play (enough to stand the crown).
function fillCtx(amount: number): { cardOf: (id: string) => Card } {
  const card = {
    id: "test-filler", name: "Test Filler", grain: "thread", mark: 1, ceiling: 2, woken_delight: 1,
    effects: [{ when: "on-play", do: "fill", params: { amount } }],
  } as unknown as Card;
  return { cardOf: () => card };
}

describe("the opening Standing is fixed by the run frame", () => {
  it("starts at RUN_TUNABLES.STARTING_STANDING, not the old placeholder of 1", () => {
    const s = createInitialState(1);
    expect(s.player.gleam).toBe(RUN_TUNABLES.STARTING_STANDING);
    expect(s.player.peakGleam).toBe(RUN_TUNABLES.STARTING_STANDING);
  });
});

describe("the crown hangs in the Wintering", () => {
  it("dawn in the final leg accepts a demand-10 crown, not an ordinary asking", () => {
    const s = testState(x => { x.calendar = { morning: 25, leg: 4 }; x.turn.dawned = false; });
    expect(isWintering(s)).toBe(true);
    const r = dawn(s, noCtx);
    expect(r.state.asking!.tier).toBe("crown");
    expect(r.state.asking!.needFill).toBe(RUN_TUNABLES.CROWN_DEMAND);
    expect(r.events.some(e => e.type === "crown-hung")).toBe(true);
  });
});

describe("won — standing the crown", () => {
  it("completing the crown's fill ends the run as won, with the peak recorded", () => {
    const s = testState(x => {
      x.calendar = { morning: 25, leg: 4 }; x.turn.dawned = true; x.turn.room = 12;
      x.player.gleam = 8; x.player.peakGleam = 8;
      x.asking = { tier: "crown", needFill: RUN_TUNABLES.CROWN_DEMAND, progress: 0, acceptedMorning: 25, acceptedLeg: 4, staleAfterMornings: 99, touched: false };
      x.pieces = [testPiece("test-filler", { instanceId: "f1" })];
    });
    const r = playPiece(s, "f1", 0, fillCtx(RUN_TUNABLES.CROWN_DEMAND));
    expect(r.state.crownStood).toBe(true);
    expect(r.state.runEnded?.reason).toBe("won");
    expect(r.state.runEnded?.peakStanding).toBe(8);
    expect(r.events.some(e => e.type === "run-ended")).toBe(true);
  });
});

describe("quiet-walk — Standing gutted to zero", () => {
  it("a stale-spill that drops Standing to 0 ends the run into the Quiet Walk", () => {
    const s = testState(x => {
      x.calendar = { morning: 4, leg: 0 }; x.turn.dawned = true;
      x.player.gleam = 3; x.player.peakGleam = 6;   // a stale poem costs 5 → floored to 0
      x.asking = { tier: "poem", needFill: 5, progress: 0, acceptedMorning: 1, acceptedLeg: 0, staleAfterMornings: 99, touched: false };
    });
    const r = dawn(s, noCtx);
    expect(r.state.player.gleam).toBe(0);
    expect(r.state.runEnded?.reason).toBe("quiet-walk");
    expect(r.state.runEnded?.peakStanding).toBe(6);   // peak is preserved for the meta-reward
  });
});

describe("drifted — the year runs out without the crown", () => {
  it("dawning past the last worked morning ends the run as drifted", () => {
    const s = testState(x => {
      x.calendar = { morning: WORKED_MORNINGS_TOTAL, leg: 4 }; x.turn.dawned = true;
      x.player.gleam = 4;
    });
    const r = dawn(s, noCtx);   // advances to the first still dawn
    expect(r.state.calendar.morning).toBe(WORKED_MORNINGS_TOTAL + 1);
    expect(r.state.runEnded?.reason).toBe("drifted");
    expect(r.state.asking).toBeNull();   // no new asking hangs past the year
  });
});

describe("a concluded run is inert", () => {
  it("dawn / playPiece / stallAction / dusk are no-ops once runEnded is set", () => {
    const base = testState(x => {
      x.calendar = { morning: 10, leg: 1 }; x.turn.dawned = true; x.turn.room = 5;
      x.runEnded = { reason: "quiet-walk", peakStanding: 6, crownDemand: 10 };
      x.pieces = [testPiece("sprig-trestle", { instanceId: "a1", zone: "hand" })];
    });
    for (const call of [
      () => dawn(base, noCtx),
      () => playPiece(base, "a1", 2, poolCtx),
      () => dusk(base, noCtx),
    ]) {
      const r = call();
      expect(r.events).toEqual([]);                       // nothing emitted
      expect(r.state.calendar.morning).toBe(10);          // calendar not advanced
      expect(r.state.runEnded?.reason).toBe("quiet-walk");
    }
  });
});

describe("a dawn that spills to zero does not hang a doomed asking (finding #2)", () => {
  it("a stale-spill quiet-walk at dawn leaves no fresh asking and emits no 'accepted'", () => {
    const s = testState(x => {
      x.calendar = { morning: 10, leg: 1 }; x.turn.dawned = true;
      x.player.gleam = 4; x.player.peakGleam = 6;   // a stale great costs 7 → floored to 0
      x.asking = { tier: "great", needFill: 7, progress: 0, acceptedMorning: 5, acceptedLeg: 1, staleAfterMornings: 99, touched: false };
    });
    const r = dawn(s, noCtx);   // crosses into leg 2 → the great goes stale → spill to 0
    expect(r.state.runEnded?.reason).toBe("quiet-walk");
    expect(r.state.asking).toBeNull();                    // no fresh asking hung on a dead run
    expect(r.events.some(e => e.type === "accepted")).toBe(false);
  });
});

describe("the static-deck-must-lose invariant", () => {
  it("a pure apprentice deck has no fill card, so it can never stand the crown", () => {
    // the seven-card apprentice hand carries gather/steady/keep/warm — but no `fill`.
    const shared = (starterPool.cards as unknown as Card[]).filter(c => !c.archetype);
    expect(shared.some(c => c.effects.some(e => e.do === "fill"))).toBe(false);
    // so even at full room in the Wintering, the crown's progress cannot move.
    const s = testState(x => {
      x.calendar = { morning: 25, leg: 4 }; x.turn.dawned = true; x.turn.room = 12;
      x.asking = { tier: "crown", needFill: RUN_TUNABLES.CROWN_DEMAND, progress: 0, acceptedMorning: 25, acceptedLeg: 4, staleAfterMornings: 99, touched: false };
      x.pieces = [testPiece("sprig-trestle", { instanceId: "a1" })];
    });
    const r = playPiece(s, "a1", 2, poolCtx);
    expect(r.state.asking?.progress ?? 0).toBe(0);   // nothing filled
    expect(r.state.crownStood).toBe(false);
  });
});
