// policies.test.ts — Phase 7 Part B: the six archetype policies are legal, terminate, and actually
// tilt play away from the generic baseline (so the records are archetype-real, not one bot in six hats).
import { describe, it, expect } from "vitest";
import { ARCHETYPES, WAYS, runGame } from "./driver.js";
import { POLICIES, runArchetype } from "./policies.js";
import { collectMetrics } from "./metrics.js";

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
