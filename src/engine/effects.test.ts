// Behavior suite: every verb's documented outcomes, on hand-built states.
import { describe, it, expect } from "vitest";
import type { Card } from "./vocabulary.js";
import type { GameState, PieceInstance } from "./state.js";
import { resolveEffect, type EffectContext, ROOM_SOFT_CAP, FULL_RATE_BAND } from "./effects.js";
import { testPiece, testState, fx } from "./test-helpers.js";

// a tiny content table so tests are independent of the real pool
const TEST_CARDS: Record<string, Card> = {
  cheap:    { id: "cheap",    name: "Cheap",    grain: "thread",  mark: 1, ceiling: 2, woken_delight: 1, effects: [] },
  mid:      { id: "mid",      name: "Mid",      grain: "song",    mark: 3, ceiling: 5, woken_delight: 2, effects: [] },
  capstone: { id: "capstone", name: "Capstone", grain: "joinery", mark: 7, ceiling: 8, woken_delight: 3, tags: ["capstone"], effects: [] },
};
const ctx: EffectContext = { selfId: "self#0", cardOf: id => TEST_CARDS[id] ?? TEST_CARDS.cheap };
const capCtx: EffectContext = { selfId: "cap#1", cardOf: ctx.cardOf };

const piece = testPiece;
function state(over: (s: GameState) => void = () => {}): GameState {
  return testState(s => {
    s.pieces = [piece("cheap", { instanceId: "self#0" })];
    over(s);
  });
}
function withCapstone(room: number): GameState {
  return state(s => {
    s.turn.room = room;
    s.pieces.push(piece("capstone", { instanceId: "cap#1" }));
  });
}
const gleamGained = (s: GameState) => s.player.gleam - 1;   // initial state starts at 1

describe("the honest floor", () => {
  it("warm adds to the piece's own delight", () => {
    const { state: s } = resolveEffect(state(), fx("warm", { n: 1 }), ctx);
    expect(s.pieces[0].delightBonus).toBe(1);
  });
  it("keep adds a season of freshness", () => {
    const { state: s } = resolveEffect(state(), fx("keep"), ctx);
    expect(s.pieces[0].freshness).toBe(3);
  });
});

describe("turn-state verbs", () => {
  it("steady adds links and can brace", () => {
    const { state: s } = resolveEffect(state(), fx("steady", { links: 2, brace: true }), ctx);
    expect(s.turn.chainLinks).toBe(2);
    expect(s.turn.braced).toBe(true);
  });
  it("gather raises the room, soft-capped at the plateau", () => {
    const s0 = state(s => { s.turn.room = 8; });
    const { state: s, events } = resolveEffect(s0, fx("gather", { amount: 5 }), ctx);
    expect(s.turn.room).toBe(ROOM_SOFT_CAP);
    expect(events.find(e => e.type === "gathered")?.data?.gain).toBe(2);
  });
  it("gather resolves a read amount", () => {
    const s0 = state(s => { s.pieces.push(piece("mid", { fired: true })); });
    const { state: s } = resolveEffect(s0, fx("gather", { amount: { do: "read", source: "woken:song" } }), ctx);
    expect(s.turn.room).toBe(1);
  });
});

describe("specialization verbs", () => {
  it("mark-grain stamps the cheapest hand piece", () => {
    const s0 = state(s => { s.pieces.push(piece("mid")); });
    const { state: s } = resolveEffect(s0, fx("mark-grain", { target: "hand:cheapest", suit: "song" }), ctx);
    const cheap = s.pieces.find(p => p.cardId === "cheap")!;
    expect(cheap.stampedGrains).toContain("song");
    expect(cheap.stampedThisMorning).toBe(true);
  });
  it("a filtered draw searches the pack deterministically", () => {
    const s0 = state(s => {
      s.pieces.push(piece("mid", { zone: "pack" }), piece("cheap", { zone: "pack" }));
    });
    const { state: s } = resolveEffect(s0, fx("draw", { n: 1, suit: "song" }), ctx);
    expect(s.pieces.find(p => p.cardId === "mid")!.zone).toBe("hand");
  });
  it("an unfiltered draw uses the seeded dice and advances the counter", () => {
    const s0 = state(s => {
      s.pieces.push(piece("mid", { zone: "pack" }), piece("cheap", { zone: "pack" }));
    });
    const a = resolveEffect(s0, fx("draw", { n: 1 }), ctx);
    const b = resolveEffect(s0, fx("draw", { n: 1 }), ctx);
    expect(a.state.pieces.map(p => p.zone)).toEqual(b.state.pieces.map(p => p.zone)); // deterministic
    expect(a.state.rng.counter).toBe(s0.rng.counter + 1);
  });
  it("retire last-lights an inert piece (the acting self here) and returns its worth to this node's table", () => {
    const s0 = state(s => { s.pieces.push(piece("mid", { set: 2 })); });
    const { state: s, events } = resolveEffect(s0, fx("retire", { target: "inert:hand", to: "table" }), ctx);
    expect(s.pieces).toHaveLength(1);
    expect(events.find(e => e.type === "retired")).toBeTruthy();
    expect(s.board.nodes[0].localTable).toBeGreaterThan(0);
  });
  it("retire refuses when nothing inert remains", () => {
    const s0 = state(s => { s.pieces.forEach(p => { p.fired = true; }); });
    const { events } = resolveEffect(s0, fx("retire", { target: "inert:hand", to: "room" }), ctx);
    expect(events[0].type).toBe("refused");
  });

  it("whittle carves exactly the shavings-share — a thin return refuses instead of rounding up", () => {
    const carve = (amount: number) =>
      resolveEffect(state(s => { s.turn.room = amount; }), fx("whittle", { amount: { do: "read", source: "room" } }), ctx);
    expect(carve(1).events[0].type).toBe("refused");
    expect(carve(2).events[0].type).toBe("refused");
    expect(carve(3).state.player.handsels).toHaveLength(1);
    expect(carve(6).state.player.handsels).toHaveLength(2);
  });

  it("court lands on a met numeric term — and never spends gleam", () => {
    const s0 = state(s => { s.turn.chainLinks = 3; s.player.gleam = 4; });
    const { state: s } = resolveEffect(s0, fx("court", { stock: "singing-silver", term: 3 }), ctx);
    expect(s.player.stock.map(x => x.id)).toContain("singing-silver");
    expect(s.player.gleam).toBe(4);
  });
  it("court understands the real cards' object terms: { if: read(chain), at_least: n }", () => {
    const term = { if: { do: "read", source: "chain" }, at_least: 3 };
    const met = state(s => { s.turn.chainLinks = 3; s.player.gleam = 2; });
    const unmet = state(s => { s.turn.chainLinks = 2; s.player.gleam = 2; });
    expect(resolveEffect(met, fx("court", { stock: "s", term }), ctx).state.player.stock).toHaveLength(1);
    expect(resolveEffect(unmet, fx("court", { stock: "s", term }), ctx).events[0].type).toBe("refused");
  });

  it("soothe spends one last-red, mends capped to the last-red, touches only the node", () => {
    const s0 = state(s => {
      s.board.nodes[0].rings = 5;
      s.board.nodes[0].lastRed = 2;
      s.player.gleam = 3;
    });
    const { state: s } = resolveEffect(s0,
      fx("soothe", { amount: 1, scale: { do: "read", source: "spiral" }, cap: "last-red" }), ctx);
    expect(s.board.nodes[0].lastRed).toBe(1);
    expect(s.board.nodes[0].rings).toBe(3);   // mend = min(1*5, lastRed 2) = 2
    expect(s.player.gleam).toBe(3);
  });
  it("soothe refuses a zero mend WITHOUT burning the catalyst", () => {
    const s0 = state(s => {
      s.board.nodes[0].rings = 3;
      s.board.nodes[0].lastRed = 1;
      s.turn.chainLinks = 0;
    });
    const { state: s, events } = resolveEffect(s0,
      fx("soothe", { amount: 1, scale: { do: "read", source: "chain" } }), ctx);
    expect(events[0].type).toBe("refused");
    expect(s.board.nodes[0].lastRed).toBe(1);
  });
  it("soothe refuses without a catalyst", () => {
    const { events } = resolveEffect(state(), fx("soothe", { amount: 1 }), ctx);
    expect(events[0].type).toBe("refused");
  });
});

describe("the working core", () => {
  it("fill pours into the accepted asking and flags completion", () => {
    const s0 = state(s => {
      s.asking = { tier: "plea", needFill: 3, progress: 2, acceptedMorning: 1, staleAfterMornings: 6 };
    });
    const { state: s, events } = resolveEffect(s0, fx("fill", { amount: 1 }), ctx);
    expect(s.asking!.progress).toBe(3);
    expect(events.find(e => e.type === "filled")?.data?.complete).toBe(true);
  });
  it("fill refuses with no asking", () => {
    const { events } = resolveEffect(state(), fx("fill", { amount: 2 }), ctx);
    expect(events[0].type).toBe("refused");
  });

  it("rest below the mark: the piece stays cold", () => {
    const { state: s } = resolveEffect(withCapstone(4), fx("rest", { target: "held:capstone", amount: 4 }), ctx);
    const cap = s.pieces.find(p => p.instanceId === "cap#1")!;
    expect(cap.set).toBe(4);
    expect(cap.fired).toBe(false);
    expect(s.turn.room).toBe(0);
  });
  it("rest at the mark: it WAKES — fired forever, typed by its grain", () => {
    const { state: s, events } = resolveEffect(withCapstone(7), fx("rest", { target: "held:capstone", amount: 7 }), ctx);
    const cap = s.pieces.find(p => p.instanceId === "cap#1")!;
    expect(cap.fired).toBe(true);
    expect(cap.wokeThisMorning).toBe(true);
    expect(events.some(e => e.type === "woke")).toBe(true);
  });
  it("rest past the ceiling: the overkill converts at full rate within the band", () => {
    const { state: s } = resolveEffect(withCapstone(11), fx("rest", { target: "held:capstone", amount: 11 }), ctx);
    expect(gleamGained(s)).toBe(3);                // excess 11-8=3, all in band
    expect(s.player.gleamGrain.joinery).toBe(3);   // grain-stamped
  });
  it("a mega-dump diminishes past the band", () => {
    const { state: s } = resolveEffect(withCapstone(18), fx("rest", { target: "held:capstone", amount: 18 }), ctx);
    expect(gleamGained(s)).toBe(FULL_RATE_BAND + 2);   // excess 10: 6 full + floor(4*0.5)
  });
  it("REGRESSION: splitting one big rest into two cannot bypass the diminishing band", () => {
    const oneDump = resolveEffect(withCapstone(18), fx("rest", { target: "self", amount: 18 }), capCtx);
    const twoStep0 = withCapstone(18);
    const twoStep1 = resolveEffect(twoStep0, fx("rest", { target: "self", amount: 13 }), capCtx);   // excess 5
    const twoStep2 = resolveEffect(twoStep1.state, fx("rest", { target: "self", amount: 5 }), capCtx); // excess 10
    expect(gleamGained(twoStep2.state)).toBe(gleamGained(oneDump.state));   // both 8
  });
  it("rest spends only what the room holds", () => {
    const s0 = state(s => { s.turn.room = 2; });
    const { state: s } = resolveEffect(s0, fx("rest", { target: "self", amount: 9 }), ctx);
    expect(s.pieces[0].set).toBe(2);
    expect(s.turn.room).toBe(0);
  });

  it("brim widens the band and recovers the diminished share, in the overkill piece's grain", () => {
    const first = resolveEffect(withCapstone(18), fx("rest", { target: "self", amount: 18 }), capCtx);
    expect(gleamGained(first.state)).toBe(8);   // excess 10 → 6 + 2
    const { state: s, events } = resolveEffect(first.state,
      fx("brim", { band: { do: "read", source: "over-ceiling" } }, "on-overkill"), capCtx);
    expect(events.some(e => e.type === "brimmed")).toBe(true);
    expect(gleamGained(s)).toBe(10);            // band widened past the excess: full conversion
    expect(s.player.gleamGrain.joinery).toBe(10);
  });
  it("REGRESSION: repeated brims can never mint past the measured overflow", () => {
    const rest = resolveEffect(withCapstone(18), fx("rest", { target: "self", amount: 18 }), capCtx);
    const brim1 = resolveEffect(rest.state, fx("brim", { band: 10 }, "on-overkill"), capCtx);
    const brim2 = resolveEffect(brim1.state, fx("brim", { band: 10 }, "on-overkill"), capCtx);
    expect(gleamGained(brim1.state)).toBe(10);          // capped at the measured excess of 10
    expect(gleamGained(brim2.state)).toBe(10);          // second brim recovers nothing
    expect(brim2.events[0].type).toBe("refused");
  });
  it("brim refuses without genuine overkill", () => {
    const { events } = resolveEffect(state(), fx("brim", { band: 3 }, "on-overkill"), ctx);
    expect(events[0].type).toBe("refused");
  });
});

describe("purity", () => {
  it("resolveEffect never mutates its input", () => {
    const s0 = state(s => { s.turn.room = 5; });
    const frozen = JSON.stringify(s0);
    resolveEffect(s0, fx("gather", { amount: 3 }), ctx);
    resolveEffect(s0, fx("rest", { target: "self", amount: 5 }), ctx);
    expect(JSON.stringify(s0)).toBe(frozen);
  });
});
