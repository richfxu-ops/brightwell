// acquisition.test.ts — Phase 6 Part 1: the deck grows (the glad-load taught card) and thins
// (the release valve). All acquired pieces arrive inert; all rolls are seeded (a run replays).
import { describe, it, expect } from "vitest";
import type { Grain } from "./vocabulary.js";
import { createInitialState } from "./state.js";
import { payGladLoad } from "./asking.js";
import {
  ACQUISITION_TUNABLES, JOURNEY_POOL, mintPiece, releaseCard, teachGladLoad,
} from "./acquisition.js";
import { testState, testPiece } from "./test-helpers.js";

const SHARED_IDS = new Set([
  "sprig-trestle", "pegged-bench", "loose-thread", "kettle-loaf", "hearth-hum", "grey-bowl", "first-step",
]);

describe("mintPiece", () => {
  it("mints an inert piece with a run-unique id, appends it, and advances the ordinal", () => {
    const s = testState();
    const ord = s.nextPieceOrdinal;
    const a = mintPiece(s, "loose-thread", "pack");
    const b = mintPiece(s, "loose-thread", "pack");
    expect(a.fired).toBe(false);
    expect(a.set).toBe(0);
    expect(a.zone).toBe("pack");
    expect(a.instanceId).not.toBe(b.instanceId);   // same card, distinct instances
    expect(s.nextPieceOrdinal).toBe(ord + 2);
    expect(s.pieces).toHaveLength(2);
  });
});

describe("the acquirable pool", () => {
  it("is the journey-pieces only — never an apprentice/shared card", () => {
    expect(JOURNEY_POOL.length).toBeGreaterThan(0);
    for (const c of JOURNEY_POOL) expect(SHARED_IDS.has(c.id)).toBe(false);
  });
});

describe("teachGladLoad", () => {
  it("teaches exactly one inert journey-piece into the pack and emits it", () => {
    const s = testState();
    teachGladLoad(s);
    expect(s.pieces).toHaveLength(1);
    const taught = s.pieces[0];
    expect(taught.fired).toBe(false);
    expect(taught.zone).toBe("pack");
    expect(SHARED_IDS.has(taught.cardId)).toBe(false);
    expect(s.events.some(e => e.type === "taught" && e.data?.cardId === taught.cardId)).toBe(true);
  });

  it("is deterministic — the same seed teaches the same card", () => {
    const a = testState(x => { x.rng = { seed: 42, counter: 0 }; });
    const b = testState(x => { x.rng = { seed: 42, counter: 0 }; });
    teachGladLoad(a);
    teachGladLoad(b);
    expect(a.pieces[0].cardId).toBe(b.pieces[0].cardId);
  });

  it("leans into the maker's Way — a dominant gleam-grain is over-represented", () => {
    // dance is the brightest grain; over many seeds the taught grain should skew far past its
    // uniform share (weight GLAD_GRAIN_WEIGHT tickets vs 1).
    const N = 300;
    const uniform = JOURNEY_POOL.filter(c => c.grain === "dance").length / JOURNEY_POOL.length;
    let danceCount = 0;
    for (let seed = 0; seed < N; seed++) {
      const s = testState(x => { x.rng = { seed, counter: 0 }; x.player.gleamGrain.dance = 5; });
      teachGladLoad(s);
      const taught = JOURNEY_POOL.find(c => c.id === s.pieces[0].cardId) as { grain: Grain };
      if (taught.grain === "dance") danceCount++;
    }
    expect(danceCount / N).toBeGreaterThan(uniform + 0.2);   // meaningfully weighted, not chance
  });
});

describe("releaseCard (last-light)", () => {
  it("removes an un-woken piece, caps at one a morning, and refuses a woken one", () => {
    const s = testState(x => {
      x.turn.dawned = true;
      x.pieces = [
        testPiece("loose-thread", { instanceId: "u1", zone: "pack", fired: false }),
        testPiece("loose-thread", { instanceId: "u2", zone: "pack", fired: false }),
        testPiece("hearth-hum", { instanceId: "w1", zone: "pack", fired: true }),
      ];
    });
    expect(releaseCard(s, "u1")).toBe(true);
    expect(s.pieces.find(p => p.instanceId === "u1")).toBeUndefined();
    expect(s.turn.releasedThisMorning).toBe(1);
    expect(s.events.some(e => e.type === "released" && e.data?.cardId === "loose-thread")).toBe(true);

    // capped: a second release the same morning is refused, the piece stays
    expect(releaseCard(s, "u2")).toBe(false);
    expect(s.pieces.find(p => p.instanceId === "u2")).toBeDefined();
    expect(s.turn.releasedThisMorning).toBe(1);
  });

  it("refuses to last-light a fired (woken) piece", () => {
    const s = testState(x => {
      x.turn.dawned = true;
      x.pieces = [testPiece("hearth-hum", { instanceId: "w1", zone: "pack", fired: true })];
    });
    expect(releaseCard(s, "w1")).toBe(false);
    expect(s.pieces).toHaveLength(1);
    expect(s.events.some(e => e.type === "refused" && e.data?.do === "release")).toBe(true);
  });
});

describe("the glad-load teaches on fulfil (payGladLoad integration)", () => {
  it("an ordinary fulfil grows the deck by one taught piece; fulfilled carries taught:true", () => {
    const s = createInitialState(7);
    s.pieces = [];   // isolate the taught piece
    s.asking = {
      tier: "poem", needFill: 5, progress: 5, acceptedMorning: 1, acceptedLeg: 0,
      staleAfterMornings: 99, touched: true,
    };
    payGladLoad(s);
    expect(s.pieces).toHaveLength(1);
    expect(s.pieces[0].fired).toBe(false);
    expect(s.events.some(e => e.type === "fulfilled" && e.data?.taught === true)).toBe(true);
    expect(s.asking).toBeNull();
  });

  it("standing the crown does NOT teach — its stand ends the run this play", () => {
    const s = createInitialState(7);
    s.pieces = [];
    s.asking = {
      tier: "crown", needFill: 10, progress: 10, acceptedMorning: 25, acceptedLeg: 4,
      staleAfterMornings: 99, touched: true,
    };
    payGladLoad(s);
    expect(s.pieces).toHaveLength(0);
    expect(s.crownStood).toBe(true);
    expect(s.events.some(e => e.type === "fulfilled" && e.data?.taught === false)).toBe(true);
  });
});

describe("ACQUISITION_TUNABLES", () => {
  it("caps release at one a morning (D-013 draft-2 / release-1)", () => {
    expect(ACQUISITION_TUNABLES.RELEASE_PER_MORNING).toBe(1);
  });
});
