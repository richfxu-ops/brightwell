// card-lint.test.ts — the [LINT] rules of the card design bible, plus the enforcing
// pool test: the whole starter pool must lint clean, so `npm run check` fails the
// moment a card slips under the quality bar. Sibling of firewalls.test.ts (legality).

import { describe, expect, it } from "vitest";
import wayLaws from "../../design/way-laws.json" with { type: "json" };
import starterPool from "../content/cards/starter-pool.json" with { type: "json" };
import { type WayLaws, lintCard, lintPool } from "./card-lint.js";
import { fx, testCard } from "./test-helpers.js";
import type { Card } from "./vocabulary.js";

const LAWS: WayLaws = {
  pool: { fillReadBans: ["room"] },
  ways: {
    eveners: {
      bannedPrimitives: [{ id: "brim", why: "Fairwright-only" }],
      fillReads: ["chain"],
      amountBans: [{ source: "handsels", on: ["gather", "rest"], why: "room from retires, never the purse" }],
    },
  },
};

const read = (source: string) => ({ do: "read", source });

describe("R2 — overflow must be spent", () => {
  it("flags a bare rest-self with no fill or brim", () => {
    const v = lintCard(testCard({ effects: [fx("rest", { target: "self", amount: 3 })] }), LAWS);
    expect(v).toEqual(["test-card: R2: bare rest-self — overflow feeds only a Standing trickle; pair it with a fill or brim"]);
  });
  it("flags a rest with omitted target (the engine defaults to self)", () => {
    const v = lintCard(testCard({ effects: [fx("rest", { amount: 3 })] }), LAWS);
    expect(v).toEqual(["test-card: R2: bare rest-self — overflow feeds only a Standing trickle; pair it with a fill or brim"]);
  });
  it("accepts rest-self when the card also fills", () => {
    const effects = [fx("rest", { target: "self", amount: 3 }), fx("fill", { amount: 2 })];
    expect(lintCard(testCard({ effects }), LAWS)).toEqual([]);
  });
  it("accepts rest-self when the card also brims", () => {
    const effects = [fx("rest", { target: "self", amount: 3 }), fx("brim", { band: 1 })];
    expect(lintCard(testCard({ effects }), LAWS)).toEqual([]);
  });
  it("ignores rest on other targets", () => {
    expect(lintCard(testCard({ effects: [fx("rest", { target: "held:capstone", amount: 3 })] }), LAWS)).toEqual([]);
  });
});

describe("R3 — fills scale right", () => {
  it("flags a fill that reads the room (pool-wide ban)", () => {
    const v = lintCard(testCard({ effects: [fx("fill", { amount: read("room") })] }), LAWS);
    expect(v).toEqual(["test-card: R3: fill reads room — banned pool-wide (one-shots the crown)"]);
  });
  it("flags a bare grain-count fill outside the Untold", () => {
    const v = lintCard(testCard({ archetype: "kilnfast", effects: [fx("fill", { amount: read("grain:joinery") })] }), LAWS);
    expect(v).toHaveLength(1);
    expect(v[0]).toContain("Untold-only");
  });
  it("accepts a grain-count fill on an Untold card", () => {
    const v = lintCard(testCard({ archetype: "untold", effects: [fx("fill", { amount: read("grain:thread") })] }), LAWS);
    expect(v).toEqual([]);
  });
  it("accepts flat-number fills (bounded, no read)", () => {
    expect(lintCard(testCard({ effects: [fx("fill", { amount: 2 })] }), LAWS)).toEqual([]);
  });
});

describe("archetype guard — way-laws must be applicable", () => {
  it("flags an unknown archetype (way-laws would silently not apply)", () => {
    const v = lintCard(testCard({ archetype: "evener", effects: [fx("brim", { band: 1 })] }), LAWS);
    expect(v).toEqual(['test-card: unknown archetype "evener" — way-laws cannot be applied (typo?)']);
  });
  it("accepts every known archetype and the shared pool", () => {
    expect(lintCard(testCard({ archetype: "shared", effects: [] }), LAWS)).toEqual([]);
    expect(lintCard(testCard({ archetype: "kilnfast", effects: [] }), LAWS)).toEqual([]);
    expect(lintCard(testCard({ effects: [] }), LAWS)).toEqual([]);
  });
});

describe("way-laws — per-Way machine rules", () => {
  it("flags a banned primitive for the card's Way", () => {
    const v = lintCard(testCard({ archetype: "eveners", effects: [fx("brim", { band: 1 })] }), LAWS);
    expect(v).toEqual(["test-card: way-law: uses brim — Fairwright-only"]);
  });
  it("flags a banned amount source feeding a listed verb", () => {
    const v = lintCard(testCard({ archetype: "eveners", effects: [fx("gather", { amount: read("handsels") })] }), LAWS);
    expect(v).toEqual(["test-card: way-law: read(handsels) feeds gather — room from retires, never the purse"]);
  });
  it("ignores the banned source on verbs outside the ban list", () => {
    const v = lintCard(testCard({ archetype: "eveners", effects: [fx("whittle", { amount: read("handsels") })] }), LAWS);
    expect(v).toEqual([]);
  });
  it("flags a read-driven fill outside the Way's allowlist", () => {
    const v = lintCard(testCard({ archetype: "eveners", effects: [fx("fill", { amount: read("woken:dance") })] }), LAWS);
    expect(v).toEqual(["test-card: way-law: fill reads woken:dance — this Way's fills read only chain"]);
  });
  it("accepts an allowlisted fill read", () => {
    const v = lintCard(testCard({ archetype: "eveners", effects: [fx("fill", { amount: read("chain") })] }), LAWS);
    expect(v).toEqual([]);
  });
  it("applies no way-laws to known Ways without a laws entry", () => {
    const v = lintCard(testCard({ archetype: "kilnfast", effects: [fx("brim", { band: 1 })] }), LAWS);
    expect(v).toEqual([]);
  });
});

describe("the enforcing test — the pool meets the bar", () => {
  it("a violating pool returns the violation (the tripwire can fire)", () => {
    const bad = testCard({ id: "bad-card", effects: [fx("rest", { target: "self", amount: 3 })] });
    const good = testCard({ id: "good-card", effects: [fx("fill", { amount: 2 })] });
    const v = lintPool([good, bad], LAWS);
    expect(v).toHaveLength(1);
    expect(v[0]).toContain("bad-card: R2");
  });
  it("whole starter pool lints clean against design/way-laws.json", () => {
    // JSON import widens literals to string; safe — firewalls.test.ts validates the same
    // pool against the closed enums at runtime (house idiom, same cast there).
    const cards = starterPool.cards as unknown as Card[];
    expect(lintPool(cards, wayLaws)).toEqual([]);
  });
});
