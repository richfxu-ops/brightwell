// card-stats.ts — the cross-run per-card reducer (card-telemetry task): fold each run's card
// tallies into one row per card per cohort (archetype × policy), carrying the play-share and
// win-rate-delta signals plus the D-022 flags (R14 dead / R15 dominant) the card-audit dashboard
// consumes. Pure over the record set; run.ts writes the JSON.

import { cardOf } from "./driver.js";
import type { CardStats } from "./metrics.js";

/** The slice of a sim record this reducer reads (run.ts's decorated record satisfies it). */
export interface CardStatsRecord {
  archetype: string;
  policy: string;
  run_won: boolean;
  card_stats: Record<string, CardStats>;
}

export interface CohortCardRow {
  archetype: string;
  policy: string;
  runsPresent: number;
  runsAbsent: number;
  drafted: number;
  taught: number;
  played: number;
  woken: number;
  fill: number;
  playShare: number;             // this card's plays / the cohort's total plays — R14/R15's denominator
  playRate: number;              // share of present-runs where it was played at least once
  wokenRate: number;             // share of present-runs where it woke
  winRatePresent: number | null; // win rate of runs holding the card (null: no such runs)
  winRateAbsent: number | null;
  winDelta: number | null;       // present minus absent — null when either side is empty
  lowConfidence: boolean;        // either side of the delta thinner than LOW_CONFIDENCE_RUNS
  alwaysPresent: boolean;        // in every run of the cohort — R14's "always in the deck"
  flags: string[];               // "dead" (R14) / "dominant" (R15); identity cohorts only
}

export interface CardReport {
  id: string;
  name: string;
  home: string;                  // the card's own Way, or "pool"
  flags: string[];               // union over this card's cohort rows
  cohorts: CohortCardRow[];
}

export const DEAD_PLAY_SHARE = 0.03;      // R14 (D-022): an always-present card below this share is dead
export const DOMINANT_PLAY_SHARE = 0.25;  // R15 (D-022): any card above this share dominates
export const LOW_CONFIDENCE_RUNS = 5;

/**
 * Reduce the record set to one report per card. Cohorts are archetype × policy: pooling across Ways
 * would confound a card's effect with its Way's strength (every fairwrights card would look dominant
 * against eveners' win rate). Flags fire only on `way` cohorts — the exploit cohort exists to measure
 * the degenerate line, not to judge a card's normal play.
 */
export function reduceCardStats(records: readonly CardStatsRecord[]): CardReport[] {
  const cohorts = new Map<string, CardStatsRecord[]>();
  for (const r of records) {
    const key = `${r.archetype}|${r.policy}`;
    cohorts.set(key, [...(cohorts.get(key) ?? []), r]);
  }

  const rowsByCard = new Map<string, CohortCardRow[]>();
  for (const [key, runs] of cohorts) {
    const [archetype, policy] = key.split("|");
    const totalPlays = runs.reduce(
      (n, r) => n + Object.values(r.card_stats).reduce((m, s) => m + s.played, 0), 0);
    const cardIds = new Set(runs.flatMap(r => Object.keys(r.card_stats)));

    for (const id of cardIds) {
      const present = runs.filter(r => id in r.card_stats);
      const absent = runs.filter(r => !(id in r.card_stats));
      const sum = (pick: (s: CardStats) => number): number =>
        present.reduce((n, r) => n + pick(r.card_stats[id]), 0);
      const rate = (rs: CardStatsRecord[]): number | null =>
        rs.length > 0 ? rs.filter(r => r.run_won).length / rs.length : null;

      const played = sum(s => s.played);
      const playShare = totalPlays > 0 ? played / totalPlays : 0;
      const alwaysPresent = absent.length === 0;
      const winRatePresent = rate(present);
      const winRateAbsent = rate(absent);
      const flags: string[] = [];
      if (policy === "way" && alwaysPresent && playShare < DEAD_PLAY_SHARE) flags.push("dead");
      if (policy === "way" && playShare > DOMINANT_PLAY_SHARE) flags.push("dominant");

      const rows = rowsByCard.get(id) ?? [];
      rows.push({
        archetype, policy,
        runsPresent: present.length, runsAbsent: absent.length,
        drafted: sum(s => s.drafted), taught: sum(s => s.taught), played,
        woken: sum(s => s.woken), fill: sum(s => s.fill),
        playShare,
        playRate: present.length > 0 ? present.filter(r => r.card_stats[id].played > 0).length / present.length : 0,
        wokenRate: present.length > 0 ? present.filter(r => r.card_stats[id].woken > 0).length / present.length : 0,
        winRatePresent, winRateAbsent,
        winDelta: winRatePresent !== null && winRateAbsent !== null ? winRatePresent - winRateAbsent : null,
        lowConfidence: present.length < LOW_CONFIDENCE_RUNS || absent.length < LOW_CONFIDENCE_RUNS,
        alwaysPresent,
        flags,
      });
      rowsByCard.set(id, rows);
    }
  }

  return [...rowsByCard.entries()]
    .map(([id, cohortRows]) => ({
      id,
      name: cardOf(id).name,
      home: cardOf(id).archetype ?? "pool",
      flags: [...new Set(cohortRows.flatMap(r => r.flags))],
      cohorts: cohortRows,
    }))
    .sort((a, b) => a.id.localeCompare(b.id));
}
