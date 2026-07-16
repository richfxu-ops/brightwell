// policies.test.ts — Phase 7 Part B: the six archetype policies are legal, terminate, and actually
// tilt play away from the generic baseline (so the records are archetype-real, not one bot in six hats).
import { describe, it, expect } from "vitest";
import { ARCHETYPES, WAYS, cardOf, runGame, type RunObservations } from "./driver.js";
import { POLICIES, exploitPolicy, runArchetype } from "./policies.js";
import { collectCardStats, collectMetrics } from "./metrics.js";

describe("the archetype policies", () => {
  it("exist for every archetype (exhaustive, no gaps)", () => {
    for (const archetype of ARCHETYPES) expect(POLICIES[archetype]).toBeTypeOf("function");
  });

  it("every Way completes a run across seeds with a valid end reason", () => {
    for (const archetype of WAYS) {
      for (const seed of [0, 1, 2, 3, 4]) {
        const { finalState } = runArchetype(seed, archetype);
        expect(finalState.runEnded, `${archetype}#${seed}`).not.toBeNull();
        expect(["won", "quiet-walk", "drifted"]).toContain(finalState.runEnded?.reason);
      }
    }
  });

  it("tilts play away from the generic baseline — at least one Way diverges on the same seed+deck", () => {
    // same seed and seeded deck; only the policy differs, so a divergent record proves the tilt bites
    const diverges = WAYS.some(archetype =>
      JSON.stringify(collectMetrics(runArchetype(1, archetype)))
      !== JSON.stringify(collectMetrics(runGame(1, archetype))));
    expect(diverges).toBe(true);
  });
});

describe("the exploit bot (card-telemetry task)", () => {
  it("completes runs for every archetype with a valid end reason", () => {
    for (const archetype of ARCHETYPES) {
      const { finalState } = runGame(1, archetype, exploitPolicy);
      expect(finalState.runEnded, archetype).not.toBeNull();
      expect(["won", "quiet-walk", "drifted"]).toContain(finalState.runEnded?.reason);
    }
  });

  it("plays a different line than the identity policies on the same seed+deck", () => {
    const diverges = WAYS.some(archetype =>
      JSON.stringify(collectMetrics(runGame(1, archetype, exploitPolicy)))
      !== JSON.stringify(collectMetrics(runArchetype(1, archetype))));
    expect(diverges).toBe(true);
  });

  it("drafts fill-carrying cards at least as eagerly as the identity policies", () => {
    // deterministic over these seeds — the bot's defining tilt is fill-first drafting
    const fillDrafts = (obs: RunObservations): number =>
      Object.entries(collectCardStats(obs))
        .filter(([id]) => cardOf(id).effects.some(e => e.do === "fill"))
        .reduce((n, [, s]) => n + s.drafted, 0);
    let exploit = 0;
    let way = 0;
    for (const archetype of WAYS) {
      for (const seed of [0, 1, 2]) {
        exploit += fillDrafts(runGame(seed, archetype, exploitPolicy));
        way += fillDrafts(runArchetype(seed, archetype));
      }
    }
    expect(exploit).toBeGreaterThanOrEqual(way);
  });
});
