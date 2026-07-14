// Smoke test: the toolchain compiles the seam files and the design data is intact.
import { describe, it, expect } from "vitest";
import { PRIMITIVES, PLAY_EVENTS, FIREWALLS, INTERACTION_DENSITY } from "./vocabulary.js";
import starterPool from "../content/cards/starter-pool.json" with { type: "json" };

describe("vocabulary (GDD Layer 3, locked)", () => {
  it("exports the 14 effect primitives", () => {
    expect(PRIMITIVES).toHaveLength(14);
    const ids = PRIMITIVES.map(p => p.id);
    expect(new Set(ids).size).toBe(14);
  });

  it("brim is the only gleam-writer", () => {
    const writers = PRIMITIVES.filter(p => p.gleamWriter).map(p => p.id);
    expect(writers).toEqual(["brim"]);
  });

  it("interaction density matches the locked value", () => {
    const interacting = PRIMITIVES.filter(p => p.interacts).length;
    expect(interacting / PRIMITIVES.length).toBeCloseTo(INTERACTION_DENSITY, 5);
  });

  it("play events and firewalls are present", () => {
    expect(PLAY_EVENTS.length).toBeGreaterThan(0);
    expect(Object.keys(FIREWALLS).length).toBe(5);
  });
});

describe("the card pool", () => {
  it("contains 97 cards — the L7 starter 49 plus the card-flow Part 3 expansion", () => {
    expect(starterPool.cards).toHaveLength(97);
  });
});
