// asking.test.ts — the Phase 4 contract lifecycle: accept · fulfil · escalate · go-stale · flop.
import { describe, it, expect } from "vitest";
import type { Card } from "./vocabulary.js";
import { createInitialState, SEASON_SEEP_BY_LEG } from "./state.js";
import { dawn, playPiece, dusk } from "./morning.js";
import { ASKING_TUNABLES, tierOf } from "./asking.js";
import { testState, testPiece } from "./test-helpers.js";

// a synthetic ctx: one card that pours a flat amount into the need on play (no reads/wakes).
function fillCtx(amount: number): { cardOf: (id: string) => Card } {
  const card = {
    id: "test-filler", name: "Test Filler", grain: "thread", mark: 1, ceiling: 2, woken_delight: 1,
    effects: [{ when: "on-play", do: "fill", params: { amount } }],
  } as unknown as Card;
  return { cardOf: () => card };
}

describe("accept", () => {
  it("dawn hangs a fresh kettle sized to the weather floor when none is carried", () => {
    const { state } = dawn(createInitialState(1), { cardOf: () => ({} as Card) });
    expect(state.asking).not.toBeNull();
    expect(state.asking!.needFill).toBe(SEASON_SEEP_BY_LEG[0]);
    expect(state.asking!.tier).toBe("kettle");
    expect(state.asking!.acceptedLeg).toBe(state.calendar.leg);
  });
});

describe("fulfil → the glad-load", () => {
  it("completing the need pays handsels, emits fulfilled, and clears the asking", () => {
    const ctx = fillCtx(3);
    const s = testState(x => {
      x.turn.dawned = true; x.turn.room = 5;
      x.asking = { tier: "poem", needFill: 3, progress: 0, acceptedMorning: 1, acceptedLeg: 0, staleAfterMornings: 99, touched: false };
      x.board.nodes[0].rings = 2;   // a neglected node — the glad-load scales off rings
      x.pieces = [testPiece("test-filler", { instanceId: "f1" })];
    });
    const purseBefore = s.player.handsels.length;
    const r = playPiece(s, "f1", 0, ctx);
    expect(r.events.some(e => e.type === "filled" && e.data?.complete === true)).toBe(true);
    expect(r.events.some(e => e.type === "fulfilled")).toBe(true);
    expect(r.state.asking).toBeNull();                       // the town is re-made
    expect(r.state.board.nodes[0].rings).toBe(0);            // rings reset on re-make
    // rings-in = load-out: base + per-ring bonus
    const expected = ASKING_TUNABLES.GLAD_LOAD_BASE + 2 * ASKING_TUNABLES.GLAD_LOAD_PER_RING;
    expect(r.state.player.handsels.length).toBe(purseBefore + expected);
  });
});

describe("go-stale → the spilling", () => {
  it("an asking held past its accepting leg spills Standing and chalks a ring", () => {
    const s = testState(x => {
      x.calendar = { morning: 4, leg: 0 }; x.turn.dawned = true;
      x.player.gleam = 8; x.player.peakGleam = 8;
      x.asking = { tier: "poem", needFill: 5, progress: 0, acceptedMorning: 2, acceptedLeg: 0, staleAfterMornings: 99, touched: false };
    });
    const r = dawn(s, { cardOf: () => ({} as Card) });
    expect(r.state.calendar.leg).toBe(1);                    // crossed into Long Light
    expect(r.events.some(e => e.type === "spilled")).toBe(true);
    expect(r.state.player.gleam).toBe(8 - ASKING_TUNABLES.TIER_DEMAND.poem);  // lost the tier size (C1)
    expect(r.state.player.peakGleam).toBe(8);                // peak is one-way — never falls
    expect(r.state.board.nodes[0].rings).toBe(ASKING_TUNABLES.RINGS_PER_SKIP);
    expect(r.state.asking).not.toBeNull();                  // a fresh one is re-accepted same dawn
  });
});

describe("escalate", () => {
  it("a skipped node's chalked ring sizes the next asking bigger", () => {
    const s = testState(x => {
      x.calendar = { morning: 4, leg: 0 }; x.turn.dawned = true;
      x.player.gleam = 9; x.player.peakGleam = 9;
      x.board.nodes[0].rings = 0;
      x.asking = { tier: "kettle", needFill: 1, progress: 0, acceptedMorning: 4, acceptedLeg: 0, staleAfterMornings: 99, touched: false };
    });
    const r = dawn(s, { cardOf: () => ({} as Card) });   // stale → +1 ring; re-accept in leg 1
    // next asking = max(weather floor leg 1, rings, peak-demand) — at least the weather floor
    expect(r.state.asking!.needFill).toBeGreaterThanOrEqual(SEASON_SEEP_BY_LEG[1]);
  });
});

describe("the unmoved-room flop (C2)", () => {
  it("an idle morning — asking untouched, nothing poured — spills at dusk", () => {
    const s = testState(x => {
      x.turn.dawned = true; x.turn.room = 4; x.turn.pouredThisMorning = 0;
      x.player.gleam = 6; x.player.peakGleam = 6;
      x.asking = { tier: "plea", needFill: 3, progress: 0, acceptedMorning: 1, acceptedLeg: 0, staleAfterMornings: 99, touched: false };
    });
    const r = dusk(s, { cardOf: () => ({} as Card) });
    expect(r.events.some(e => e.type === "spilled" && e.data?.reason === "unmoved room")).toBe(true);
    expect(r.state.player.gleam).toBeLessThan(6);
  });

  it("does NOT flop when the room was poured, even if the asking went untouched", () => {
    const s = testState(x => {
      x.turn.dawned = true; x.turn.room = 2; x.turn.pouredThisMorning = 3;
      x.player.gleam = 6;
      x.asking = { tier: "plea", needFill: 3, progress: 0, acceptedMorning: 1, acceptedLeg: 0, staleAfterMornings: 99, touched: false };
    });
    const r = dusk(s, { cardOf: () => ({} as Card) });
    expect(r.events.some(e => e.type === "spilled")).toBe(false);
    expect(r.state.player.gleam).toBe(6);
  });
});

describe("the spilling floors at zero", () => {
  it("never drives Standing negative", () => {
    const s = testState(x => {
      x.calendar = { morning: 4, leg: 0 }; x.turn.dawned = true;
      x.player.gleam = 1; x.player.peakGleam = 5;
      x.asking = { tier: "great", needFill: 7, progress: 0, acceptedMorning: 1, acceptedLeg: 0, staleAfterMornings: 99, touched: false };
    });
    const r = dawn(s, { cardOf: () => ({} as Card) });   // a great asking would cost 7, but only 1 is left
    expect(r.state.player.gleam).toBe(0);
  });
});

describe("tierOf", () => {
  it("maps a demand to the largest tier at or below it", () => {
    expect(tierOf(1)).toBe("kettle");
    expect(tierOf(4)).toBe("plea");
    expect(tierOf(5)).toBe("poem");
    expect(tierOf(9)).toBe("great");
  });
});
