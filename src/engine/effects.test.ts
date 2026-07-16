// Behavior suite: every verb's documented outcomes, on hand-built states.
import { describe, it, expect } from "vitest";
import type { Card } from "./vocabulary.js";
import { type GameState, STARTING_STANDING } from "./state.js";
import { resolveEffect, type EffectContext, FULL_RATE_BAND, SEAT_FIRST, SEAT_DECAY } from "./effects.js";
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
const gleamGained = (s: GameState) => s.player.gleam - STARTING_STANDING;   // delta from the opening Standing

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
  it("gather seats the audience under the decaying-seat law (2 · 0.8^(n-1))", () => {
    const { state: s } = resolveEffect(state(), fx("gather", { amount: 2 }), ctx);
    expect(s.turn.room).toBeCloseTo(SEAT_FIRST + SEAT_FIRST * SEAT_DECAY, 5);   // 3.6
    expect(s.turn.seatedCount).toBe(2);
  });
  it("seating plateaus near 10 — the softcap is structural, not a ceiling", () => {
    const { state: s } = resolveEffect(state(), fx("gather", { amount: 50 }), ctx);
    expect(s.turn.room).toBeGreaterThan(9.9);
    expect(s.turn.room).toBeLessThan(10);
  });
  it("later seats contribute less — the same gather is worth less in a full room", () => {
    const first = resolveEffect(state(), fx("gather", { amount: 3 }), ctx);
    const second = resolveEffect(first.state, fx("gather", { amount: 3 }), ctx);
    const g1 = first.events.find(e => e.type === "gathered")!.data!.gain as number;
    const g2 = second.events.find(e => e.type === "gathered")!.data!.gain as number;
    expect(g2).toBeLessThan(g1);
  });
  it("gather resolves a read amount as seats", () => {
    const s0 = state(s => { s.pieces.push(piece("mid", { fired: true })); });   // woken:song = 1
    const { state: s } = resolveEffect(s0, fx("gather", { amount: { do: "read", source: "woken:song" } }), ctx);
    expect(s.turn.room).toBeCloseTo(SEAT_FIRST, 5);
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
  it("retire last-lights an inert piece; its worth is this-cycle unspent set only", () => {
    const s0 = state(s => { s.pieces[0].set = 2; });   // the acting self, partially worked
    const { state: s, events } = resolveEffect(s0, fx("retire", { target: "inert:hand", to: "table" }), ctx);
    expect(s.pieces).toHaveLength(0);
    expect(events.find(e => e.type === "retired")?.data?.worth).toBe(2);
    expect(s.board.nodes[0].localTable).toBe(2);
  });
  it("a never-rested piece retires for 0 — the thinning is the payoff", () => {
    const { state: s, events } = resolveEffect(state(), fx("retire", { target: "inert:hand", to: "room" }), ctx);
    expect(s.pieces).toHaveLength(0);
    expect(events.find(e => e.type === "retired")?.data?.worth).toBe(0);
    expect(s.turn.room).toBe(0);
  });
  it("retire refuses when nothing inert remains", () => {
    const s0 = state(s => { s.pieces.forEach(p => { p.fired = true; }); });
    const { events } = resolveEffect(s0, fx("retire", { target: "inert:hand", to: "room" }), ctx);
    expect(events[0].type).toBe("refused");
  });

  it("whittle is the bounded faucet: 1 dull, consumes an apprentice-stuff", () => {
    const s0 = state(s => { s.turn.room = 6; });
    const { state: s } = resolveEffect(s0, fx("whittle", { amount: { do: "read", source: "room" } }), ctx);
    expect(s.player.handsels).toHaveLength(1);
    expect(s.player.handsels[0].brightness).toBe(1);
    expect(s.player.stock.filter(x => x.grade === "apprentice")).toHaveLength(1);   // one consumed
    expect(s.turn.whittledThisMorning).toBe(true);
  });
  it("whittle refuses a second carve the same morning", () => {
    const s0 = state(s => { s.turn.room = 6; });
    const once = resolveEffect(s0, fx("whittle", { amount: 6 }), ctx);
    const twice = resolveEffect(once.state, fx("whittle", { amount: 6 }), ctx);
    expect(twice.events[0].type).toBe("refused");
    expect(twice.state.player.handsels).toHaveLength(1);
  });
  it("whittle refuses without an apprentice-stuff or a real return", () => {
    const noStuff = state(s => { s.turn.room = 6; s.player.stock = []; });
    expect(resolveEffect(noStuff, fx("whittle", { amount: 6 }), ctx).events[0].type).toBe("refused");
    expect(resolveEffect(state(), fx("whittle", { amount: 0 }), ctx).events[0].type).toBe("refused");
  });

  it("court lands on a met numeric term — and never spends gleam", () => {
    const s0 = state(s => { s.turn.chainLinks = 3; s.player.gleam = 7; });
    const { state: s } = resolveEffect(s0, fx("court", { stock: "singing-silver", term: 3 }), ctx);
    expect(s.player.stock.map(x => x.id)).toContain("singing-silver");
    expect(s.player.gleam).toBe(7);
  });
  it("court understands the real cards' object terms: { if: read(chain), at_least: n }", () => {
    const term = { if: { do: "read", source: "chain" }, at_least: 3 };
    const met = state(s => { s.turn.chainLinks = 3; s.player.gleam = 6; s.player.stock = []; });
    const unmet = state(s => { s.turn.chainLinks = 2; s.player.gleam = 6; s.player.stock = []; });
    expect(resolveEffect(met, fx("court", { stock: "s", term }), ctx).state.player.stock).toHaveLength(1);
    expect(resolveEffect(unmet, fx("court", { stock: "s", term }), ctx).events[0].type).toBe("refused");
  });
  it("the vouching gates by the stock's grade band: proud stock needs a warm gleam", () => {
    const dim = state(s => { s.turn.chainLinks = 5; s.player.gleam = 5; });
    const { state: s, events } = resolveEffect(dim, fx("court", { stock: "singing-silver", term: 3 }), ctx);
    expect(events[0].type).toBe("refused");
    expect(s.player.gleam).toBe(5);   // gated, never spent — even on refusal
  });

  it("soothe spends one last-red, mends min(requested, rings, 2), marks the node soothed", () => {
    const s0 = state(s => {
      s.board.nodes[0].rings = 5;
      s.board.nodes[0].lastRed = 2;
      s.player.gleam = 3;
    });
    const { state: s } = resolveEffect(s0,
      fx("soothe", { amount: 1, scale: { do: "read", source: "spiral" }, cap: "last-red" }), ctx);
    expect(s.board.nodes[0].lastRed).toBe(1);
    expect(s.board.nodes[0].rings).toBe(3);   // mend = min(1×5, rings 5, CAP 2) = 2
    expect(s.board.nodes[0].soothed).toBe(true);
    expect(s.player.soothesUsed).toBe(1);
    expect(s.player.gleam).toBe(3);
  });
  it("soothe refuses past the 4-per-run cap", () => {
    const s0 = state(s => {
      s.board.nodes[0].rings = 3;
      s.board.nodes[0].lastRed = 2;
      s.player.soothesUsed = 4;
    });
    const { state: s, events } = resolveEffect(s0, fx("soothe", { amount: 2 }), ctx);
    expect(events[0].type).toBe("refused");
    expect(s.board.nodes[0].lastRed).toBe(2);
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
      s.asking = { tier: "plea", needFill: 3, progress: 2, acceptedMorning: 1, staleAfterMornings: 6, acceptedLeg: 0, touched: false };
    });
    const { state: s, events } = resolveEffect(s0, fx("fill", { amount: 1 }), ctx);
    expect(s.asking!.progress).toBe(3);
    expect(events.find(e => e.type === "filled")?.data?.complete).toBe(true);
  });
  it("fill names the piece that poured — per-card attribution for the harness", () => {
    const s0 = state(s => {
      s.asking = { tier: "plea", needFill: 3, progress: 0, acceptedMorning: 1, staleAfterMornings: 6, acceptedLeg: 0, touched: false };
    });
    const { events } = resolveEffect(s0, fx("fill", { amount: 1 }), ctx);
    expect(events.find(e => e.type === "filled")?.data?.piece).toBe("self#0");
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
    expect(gleamGained(s)).toBe(FULL_RATE_BAND + 1);   // D-018: excess 10 → 3 full + floor(7*0.25)=1
  });
  it("REGRESSION: splitting one big rest into two cannot bypass the diminishing band", () => {
    const oneDump = resolveEffect(withCapstone(18), fx("rest", { target: "self", amount: 18 }), capCtx);
    const twoStep0 = withCapstone(18);
    const twoStep1 = resolveEffect(twoStep0, fx("rest", { target: "self", amount: 13 }), capCtx);   // excess 5
    const twoStep2 = resolveEffect(twoStep1.state, fx("rest", { target: "self", amount: 5 }), capCtx); // excess 10
    expect(gleamGained(twoStep2.state)).toBe(gleamGained(oneDump.state));   // both 4 (D-018)
  });
  it("rest spends only what the room holds", () => {
    const s0 = state(s => { s.turn.room = 2; });
    const { state: s } = resolveEffect(s0, fx("rest", { target: "self", amount: 9 }), ctx);
    expect(s.pieces[0].set).toBe(2);
    expect(s.turn.room).toBe(0);
  });

  it("brim widens the band and recovers the diminished share, in the overkill piece's grain", () => {
    const first = resolveEffect(withCapstone(18), fx("rest", { target: "self", amount: 18 }), capCtx);
    expect(gleamGained(first.state)).toBe(4);   // D-018: excess 10 → 3 + floor(7*0.25)=1
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
