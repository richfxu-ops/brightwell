// card-stats.test.ts — the cross-run reducer on hand-built records: cohort math, win-rate deltas,
// the D-022 flags, and the way-cohorts-only flag rule. Uses real pool ids (the reducer names cards
// via the shared cardOf lookup).
import { describe, it, expect } from "vitest";
import { type CardStatsRecord, reduceCardStats } from "./card-stats.js";
import type { CardStats } from "./metrics.js";

const FILLER = "setterby-trestle";      // real kilnfast ids — cardOf treats a pool miss as a bug
const CAPSTONE = "the-fired-beam";

function rec(
  won: boolean,
  cards: Record<string, Partial<CardStats>>,
  policy = "way",
): CardStatsRecord {
  return {
    archetype: "kilnfast", policy, run_won: won,
    card_stats: Object.fromEntries(Object.entries(cards).map(([id, s]) =>
      [id, { drafted: 0, taught: 0, played: 0, woken: 0, fill: 0, ...s }])),
  };
}

describe("reduceCardStats", () => {
  it("computes the win-rate delta within a cohort, marking thin exposure low-confidence", () => {
    const records = [
      rec(true, { [FILLER]: { played: 2 }, [CAPSTONE]: { played: 1 } }),
      rec(true, { [FILLER]: { played: 1 }, [CAPSTONE]: { played: 1 } }),
      rec(false, { [CAPSTONE]: { played: 1 } }),
      rec(false, { [CAPSTONE]: { played: 1 } }),
    ];
    const filler = reduceCardStats(records).find(c => c.id === FILLER);
    const row = filler?.cohorts[0];
    expect(row?.runsPresent).toBe(2);
    expect(row?.runsAbsent).toBe(2);
    expect(row?.winRatePresent).toBe(1);
    expect(row?.winRateAbsent).toBe(0);
    expect(row?.winDelta).toBe(1);
    expect(row?.lowConfidence).toBe(true);   // both sides under the 5-run floor
  });

  it("flags an always-present card under 3% of plays dead, and one over 25% dominant", () => {
    // 100 plays in the cohort: capstone 2 (dead at 2%), filler 98 (dominant at 98%)
    const records = [rec(true, { [FILLER]: { played: 98 }, [CAPSTONE]: { played: 2 } })];
    const byId = new Map(reduceCardStats(records).map(c => [c.id, c]));
    expect(byId.get(CAPSTONE)?.flags).toContain("dead");
    expect(byId.get(FILLER)?.flags).toContain("dominant");
  });

  it("never flags exploit cohorts — the degenerate line doesn't judge normal play", () => {
    const records = [rec(true, { [FILLER]: { played: 98 }, [CAPSTONE]: { played: 2 } }, "exploit")];
    for (const card of reduceCardStats(records)) expect(card.flags).toEqual([]);
  });

  it("keeps cohorts separate — a card's rows never mix archetypes or policies", () => {
    const records = [
      rec(true, { [FILLER]: { played: 1 } }, "way"),
      rec(false, { [FILLER]: { played: 1 } }, "exploit"),
    ];
    const filler = reduceCardStats(records).find(c => c.id === FILLER);
    expect(filler?.cohorts).toHaveLength(2);
    const policies = filler?.cohorts.map(c => c.policy).sort();
    expect(policies).toEqual(["exploit", "way"]);
    for (const row of filler?.cohorts ?? []) expect(row.runsPresent).toBe(1);
  });
});
