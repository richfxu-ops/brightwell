// sim.test.ts — Phase 7's completeness gate: every run emits all per-run keys, the manifest
// partitions exactly the 57 canonical keys, and a run is deterministic. This is Phase 7's
// definition of done — the pipeline stands up and the record shape is honest.
import { describe, it, expect } from "vitest";
import { ARCHETYPES, runGame } from "./driver.js";
import { collectMetrics } from "./metrics.js";
import {
  CANONICAL_KEYS, PER_RUN_KEYS, PER_RUN_REAL, PER_RUN_ZERO, PHASE8_AGGREGATE,
} from "./keys.js";

describe("the keys manifest", () => {
  it("partitions exactly the 57 canonical keys — no key missed, none duplicated or invented", () => {
    const union = [...PER_RUN_REAL, ...PER_RUN_ZERO, ...PHASE8_AGGREGATE];
    expect(union.length).toBe(CANONICAL_KEYS.length);           // 57, no overlap padding the count
    expect(new Set(union).size).toBe(union.length);             // no duplicates across buckets
    expect(new Set(union)).toEqual(new Set(CANONICAL_KEYS));    // exactly the contract's keys
  });
});

describe("the completeness gate", () => {
  it("every archetype's run emits every per-run key, with honest zeros for deferred systems", () => {
    for (const archetype of ARCHETYPES) {
      const record = collectMetrics(runGame(1, archetype));
      const bag: Record<string, unknown> = { ...record };   // structural copy — index by dynamic key
      // the record carries exactly the per-run keys — nothing missing, nothing extra
      expect(Object.keys(record).sort()).toEqual([...PER_RUN_KEYS].sort());
      // no key is left undefined
      for (const key of PER_RUN_KEYS) {
        expect(bag, `${archetype}.${key}`).toHaveProperty(key);
        expect(bag[key], `${archetype}.${key}`).not.toBeUndefined();
      }
      // deferred-system keys are honest zeros
      for (const key of PER_RUN_ZERO) {
        expect(bag[key], `${archetype}.${key}`).toBe(0);
      }
    }
  });

  it("runs terminate and conclude with a run-end reason", () => {
    for (const archetype of ARCHETYPES) {
      const { finalState } = runGame(3, archetype);
      expect(finalState.runEnded, archetype).not.toBeNull();
      expect(["won", "quiet-walk", "drifted"]).toContain(finalState.runEnded?.reason);
    }
  });
});

describe("determinism", () => {
  it("the same (seed, archetype) replays an identical record", () => {
    for (const archetype of ARCHETYPES) {
      expect(collectMetrics(runGame(9, archetype))).toEqual(collectMetrics(runGame(9, archetype)));
    }
  });
});

describe("the harness measures real play", () => {
  it("a Way's deck grows past the apprentice start (glad-load + Fair) over a run", () => {
    // not every seed wins, but a Way with fillers should acquire *something* across a full year
    const records = [1, 2, 3, 4, 5].map(seed => collectMetrics(runGame(seed, "mannerly")));
    const anyGrowth = records.some(r => r.cards_gifted_total + r.fair_drafts_taken > 0);
    expect(anyGrowth).toBe(true);
  });
});
