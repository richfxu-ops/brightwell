// The worked morning: dawn → plays/stalls → dusk, plus the golden Kilnfast test.
import { describe, it, expect } from "vitest";
import type { Card } from "./vocabulary.js";
import { createInitialState, type GameState } from "./state.js";
import { dawn, playPiece, stallAction, dusk, legOf, HAND_SIZE } from "./morning.js";
import { testPiece, testState } from "./test-helpers.js";
import starterPool from "../content/cards/starter-pool.json" with { type: "json" };

const POOL = new Map((starterPool.cards as unknown as Card[]).map(c => [c.id, c]));
const poolCtx = { cardOf: (id: string) => POOL.get(id)! };

// small synthetic cards for unit tests
const TEST_CARDS: Record<string, Card> = {
  blank:   { id: "blank",   name: "Blank",   grain: "song",   mark: 3, ceiling: 5, woken_delight: 1, effects: [] },
  cheap:   { id: "cheap",   name: "Cheap",   grain: "dough",  mark: 1, ceiling: 2, woken_delight: 1, effects: [] },
  utility: { id: "utility", name: "Utility", grain: "thread", mark: 1, ceiling: 2, woken_delight: 1,
             effects: [{ when: "on-dawn", do: "draw", params: { n: 1 } } as Card["effects"][number]] },
  warmA:   { id: "warmA", name: "WarmA", grain: "song", mark: 1, ceiling: 2, woken_delight: 1,
             effects: [{ when: "on-fulfil", do: "warm", params: { n: 1 } } as Card["effects"][number]] },
  keepB:   { id: "keepB", name: "KeepB", grain: "song", mark: 1, ceiling: 2, woken_delight: 1,
             effects: [{ when: "on-fulfil", do: "keep", params: {} } as Card["effects"][number]] },
  filler:  { id: "filler", name: "Filler", grain: "glaze", mark: 2, ceiling: 3, woken_delight: 1,
             effects: [{ when: "on-play", do: "fill", params: { amount: 3 } } as Card["effects"][number]] },
};
const ctx = { cardOf: (id: string) => TEST_CARDS[id] ?? TEST_CARDS.blank };

describe("the calendar", () => {
  it("legOf follows the 4·6·7·7·3 mornings", () => {
    expect([1, 4, 5, 10, 11, 17, 18, 24, 25, 27].map(legOf)).toEqual([0, 0, 1, 1, 2, 2, 3, 3, 4, 4]);
  });
});

describe("dawn", () => {
  it("a fresh Green dawn: base 2 + the home-note seat, hand of 5, morning stays 1", () => {
    const { state: s } = dawn(createInitialState(5), poolCtx);
    expect(s.turn.room).toBeCloseTo(4, 5);   // base 2 + first seat 2
    expect(s.pieces.filter(p => p.zone === "hand")).toHaveLength(HAND_SIZE);
    expect(s.calendar.morning).toBe(1);
    expect(s.turn.dawned).toBe(true);
  });
  it("the snowball: fired pieces seat into the dawn room", () => {
    const s0 = testState(s => {
      s.pieces = [testPiece("blank", { fired: true, zone: "discard" }),
                  testPiece("blank", { fired: true, zone: "discard" })];
    });
    const { state: s } = dawn(s0, ctx);
    expect(s.turn.room).toBeCloseTo(2 + 2 + 1.6 + 1.28, 5);   // base + 3 seats
  });
  it("ring draw pays 0.5/ring — and a soothed node pays nothing", () => {
    const pale = testState(s => { s.board.nodes[0].rings = 4; });
    expect(dawn(pale, ctx).state.turn.room).toBeCloseTo(4 + 2, 5);
    const soothed = testState(s => { s.board.nodes[0].rings = 4; s.board.nodes[0].soothed = true; });
    expect(dawn(soothed, ctx).state.turn.room).toBeCloseTo(4, 5);
  });
  it("a camped dawn recovers ⅔ of yesterday's table; the table then clears", () => {
    const s0 = testState(s => { s.board.camped = true; s.board.nodes[0].localTable = 6; });
    const { state: s } = dawn(s0, ctx);
    expect(s.turn.room).toBeCloseTo(4 + 4, 5);
    expect(s.board.nodes[0].localTable).toBe(0);
  });
  it("the discard reshuffles into the pack only when the pack runs dry", () => {
    const s0 = testState(s => {
      s.pieces = [testPiece("blank", { zone: "pack" }),
                  testPiece("blank", { zone: "discard" }), testPiece("blank", { zone: "discard" })];
    });
    const { state: s } = dawn(s0, ctx);
    expect(s.pieces.filter(p => p.zone === "hand")).toHaveLength(3);   // all of them
  });
  it("on-dawn effects fire from FIRED pieces only (D-010 B5)", () => {
    const fired = testState(s => {
      s.pieces = [testPiece("utility", { fired: true, zone: "discard" }),
                  ...Array.from({ length: 7 }, () => testPiece("blank", { zone: "pack" }))];
    });
    const a = dawn(fired, ctx);
    expect(a.state.pieces.filter(p => p.zone === "hand")).toHaveLength(HAND_SIZE + 1);   // refill + dawn draw
    const unfired = testState(s => {
      s.pieces = [testPiece("utility", { zone: "pack" }),
                  ...Array.from({ length: 7 }, () => testPiece("blank", { zone: "pack" }))];
    });
    const b = dawn(unfired, ctx);
    expect(b.state.pieces.filter(p => p.zone === "hand")).toHaveLength(HAND_SIZE);
  });
  it("a second dawn advances the calendar", () => {
    const day1 = dawn(createInitialState(5), poolCtx);
    const night = dusk(day1.state, poolCtx);
    const day2 = dawn(night.state, poolCtx);
    expect(day2.state.calendar.morning).toBe(2);
  });
});

describe("plays and stalls", () => {
  it("playing IS pouring: pour 1 wakes a mark-1 apprentice", () => {
    const s0 = testState(s => {
      s.turn.dawned = true; s.turn.room = 4;
      s.pieces = [testPiece("cheap", { instanceId: "c#1" })];
    });
    const { state: s, events } = playPiece(s0, "c#1", 1, ctx);
    expect(events.some(e => e.type === "woke")).toBe(true);
    expect(s.turn.room).toBe(3);
  });
  it("pour 0 banks the piece cold", () => {
    const s0 = testState(s => {
      s.turn.dawned = true; s.turn.room = 4;
      s.pieces = [testPiece("blank", { instanceId: "b#1" })];
    });
    const { state: s } = playPiece(s0, "b#1", 0, ctx);
    const b = s.pieces[0];
    expect(b.zone).toBe("in-play");
    expect(b.set).toBe(0);
    expect(b.fired).toBe(false);
  });
  it("the chain multiplies the pour: third link lands ×1.5", () => {
    const s0 = testState(s => {
      s.turn.dawned = true; s.turn.room = 6;
      s.pieces = [testPiece("cheap", { instanceId: "c#1" }), testPiece("cheap", { instanceId: "c#2" }),
                  testPiece("blank", { instanceId: "b#1" })];
    });
    let r = playPiece(s0, "c#1", 0, ctx);
    r = playPiece(r.state, "c#2", 0, ctx);
    r = playPiece(r.state, "b#1", 2, ctx);   // links 3 → m 1.5 → lands 3 ≥ mark 3
    expect(r.state.pieces.find(p => p.instanceId === "b#1")!.fired).toBe(true);
  });
  it("an unbraced stall halves the room and breaks the chain; a brace absorbs it", () => {
    const s0 = testState(s => { s.turn.dawned = true; s.turn.room = 7; s.turn.chainLinks = 3; });
    const { state: s } = stallAction(s0, ctx);
    expect(s.turn.room).toBe(3);
    expect(s.turn.chainLinks).toBe(0);
    const braced = testState(x => { x.turn.dawned = true; x.turn.room = 7; x.turn.chainLinks = 3; x.turn.braced = true; });
    const { state: b } = stallAction(braced, ctx);
    expect(b.turn.room).toBe(7);
    expect(b.turn.chainLinks).toBe(3);
    expect(b.turn.braced).toBe(false);
  });
});

describe("the cascade (D-010 B3)", () => {
  function fulfilSetup(first: string, second: string): GameState {
    return testState(s => {
      s.turn.dawned = true; s.turn.room = 4;
      s.asking = { tier: "kettle", needFill: 3, progress: 0, acceptedMorning: 1, staleAfterMornings: 4 };
      s.pieces = [testPiece("warmA", { instanceId: "A#1" }), testPiece("keepB", { instanceId: "B#1" }),
                  testPiece("filler", { instanceId: "F#1" })];
    });
  }
  it("listeners fire in played order", () => {
    let r = playPiece(fulfilSetup("A", "B"), "A#1", 0, ctx);
    r = playPiece(r.state, "B#1", 0, ctx);
    r = playPiece(r.state, "F#1", 0, ctx);   // fill 3 completes → on-fulfil cascade
    const types = r.state.events.filter(e => e.type === "warmed" || e.type === "kept").map(e => e.type);
    expect(types).toEqual(["warmed", "kept"]);   // A before B
    // reversed play order reverses the cascade
    let q = playPiece(fulfilSetup("B", "A"), "B#1", 0, ctx);
    q = playPiece(q.state, "A#1", 0, ctx);
    q = playPiece(q.state, "F#1", 0, ctx);
    const qtypes = q.state.events.filter(e => e.type === "warmed" || e.type === "kept").map(e => e.type);
    expect(qtypes).toEqual(["kept", "warmed"]);
  });
  it("fire-once: a second completion the same morning re-triggers nothing", () => {
    let r = playPiece(fulfilSetup("A", "B"), "A#1", 0, ctx);
    r = playPiece(r.state, "F#1", 0, ctx);                      // completes (3/3) → warmA fires
    const warmsAfterFirst = r.state.events.filter(e => e.type === "warmed").length;
    // a second filler instance would complete "again" (progress 6/3); warmA must not re-fire
    r.state.pieces.push(testPiece("filler", { instanceId: "F#2", zone: "hand" }));
    const r2 = playPiece(r.state, "F#2", 0, ctx);
    expect(warmsAfterFirst).toBe(1);
    expect(r2.state.events.filter(e => e.type === "warmed")).toHaveLength(1);
  });
});

describe("dusk", () => {
  it("the B1 sweep: unspent room + cold pieces' set seep to this node's table", () => {
    const s0 = testState(s => {
      s.turn.dawned = true; s.turn.room = 3;
      s.pieces = [testPiece("blank", { zone: "in-play", set: 4 }),
                  testPiece("blank", { zone: "hand" })];
    });
    const { state: s } = dusk(s0, ctx);
    expect(s.board.nodes[0].localTable).toBe(7);
    expect(s.turn.room).toBe(0);
    expect(s.pieces.every(p => p.zone === "discard")).toBe(true);
    expect(s.pieces[0].set).toBe(0);
    expect(s.board.camped).toBe(true);   // camp is the Phase-3 default
  });
  it("idle handsels dim, and a dull gone three mornings seeps to the table", () => {
    const s0 = testState(s => {
      s.player.handsels = [{ brightness: 3, idleMornings: 0 }, { brightness: 1, idleMornings: 2 }];
    });
    const { state: s } = dusk(s0, ctx);
    expect(s.player.handsels).toHaveLength(1);
    expect(s.player.handsels[0].brightness).toBe(2);           // singing dimmed to warm
    expect(s.board.nodes[0].localTable).toBeGreaterThanOrEqual(1);   // the lapsed dull
  });
});

describe("GOLDEN: the Kilnfast chain (GDD L7)", () => {
  function kilnfastMorning(): GameState {
    return testState(s => {
      s.turn.dawned = true;
      s.turn.room = 9;          // a matured Deep Gold room (L6)
      s.turn.seatedCount = 5;   // home-note + 4 fired seated at dawn
      s.asking = { tier: "poem", needFill: 3, progress: 0, acceptedMorning: 15, staleAfterMornings: 7 };
      s.pieces = [
        testPiece("setterby-trestle", { instanceId: "c1" }),
        testPiece("calipers-at-the-bench", { instanceId: "c2" }),
        testPiece("the-fired-beam", { instanceId: "cap" }),
        testPiece("loose-thread", { instanceId: "spare" }),           // the stamp target
        ...Array.from({ length: 4 }, (_, i) =>
          testPiece("dovetail-draw", { instanceId: `fired#${i}`, fired: true, zone: "discard" })),
      ];
    });
  }
  it("in order, the chain wakes The Fired Beam and completes the poem", () => {
    let r = playPiece(kilnfastMorning(), "c1", 2, poolCtx);    // Setterby: wakes, gathers, steadies
    r = playPiece(r.state, "c2", 2, poolCtx);                  // Calipers: wakes, aims the room at the Beam
    const beam = r.state.pieces.find(p => p.instanceId === "cap")!;
    expect(beam.fired).toBe(true);                             // the Beam woke
    expect(r.state.asking!.progress).toBeGreaterThanOrEqual(3);
    expect(r.state.events.some(e => e.type === "filled" && e.data?.complete === true)).toBe(true);
    expect(r.state.player.gleam).toBeGreaterThan(1);           // the reach overflowed
  });
  it("out of order, the same cards under-fill — the reach falls short", () => {
    let r = playPiece(kilnfastMorning(), "c2", 2, poolCtx);    // Calipers FIRST: cold, dumps a bare room
    r = playPiece(r.state, "c1", 2, poolCtx);                  // Setterby after — too late
    expect(r.state.asking!.progress).toBeLessThan(3);
    expect(r.state.events.some(e => e.type === "filled" && e.data?.complete === true)).toBe(false);
  });
});

describe("conservation: a full scripted morning", () => {
  it("room in = room spent + room swept; the dusk sweep carries every cold drop", () => {
    const day = dawn(createInitialState(11), poolCtx);
    const income = day.state.turn.room;
    let s = day.state;
    for (const p of s.pieces.filter(x => x.zone === "hand")) {
      s = playPiece(s, p.instanceId, 1, poolCtx).state;
    }
    const gathered = s.events.filter(e => e.type === "gathered")
      .reduce((sum, e) => sum + ((e.data?.gain as number) ?? 0), 0);
    const spent = s.events.filter(e => e.type === "rested")
      .reduce((sum, e) => sum + ((e.data?.spend as number) ?? 0), 0);
    const roomBeforeDusk = s.turn.room;
    const coldSet = s.pieces.filter(p => !p.fired).reduce((sum, p) => sum + p.set, 0);
    // ledger 1: everything the room received was either poured or is still there
    expect(spent + roomBeforeDusk).toBeCloseTo(income + gathered, 5);
    // ledger 2: the dusk sweep carries exactly the unspent room + the cold pieces' attention
    const night = dusk(s, poolCtx);
    const swept = night.events.find(e => e.type === "dusk")!.data!.sweep as number;
    expect(swept).toBeCloseTo(roomBeforeDusk + coldSet, 5);
    expect(night.state.board.nodes[0].localTable).toBeCloseTo(swept, 5);
  });
});
