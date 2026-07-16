// run.ts — the sim entry (engine Phase 7): play N seeded runs per archetype through the harness and
// write the per-run records to sim/out/records.json for Phase 8 (the balance sheet). Run via the
// esbuild runner: `npm run sim`. Each archetype runs twice per seed (card-telemetry task): once
// under its identity policy and once under the fill-first exploit policy — the win-rate gap between
// the two cohorts is the "filling the need is trivial" measure.

import { mkdirSync, writeFileSync } from "node:fs";
import { ARCHETYPES, runGame } from "./driver.js";
import { exploitPolicy, runArchetype } from "./policies.js";
import { collectCardStats, collectMetrics, type CardStats, type RoundMetricsPerRun } from "./metrics.js";
import { reduceCardStats } from "./card-stats.js";
import { RUN_TUNABLES } from "../engine/runframe.js";

const RUNS_PER_ARCHETYPE = 50;
const POLICY_KINDS = ["way", "exploit"] as const;
type PolicyKind = (typeof POLICY_KINDS)[number];

type SimRecord = RoundMetricsPerRun & {
  seed: number;
  policy: PolicyKind;
  card_stats: Record<string, CardStats>;
};

const records: SimRecord[] = [];
for (const archetype of ARCHETYPES) {
  for (const policy of POLICY_KINDS) {
    for (let seed = 0; seed < RUNS_PER_ARCHETYPE; seed++) {
      const obs = policy === "way" ? runArchetype(seed, archetype) : runGame(seed, archetype, exploitPolicy);
      records.push({ seed, policy, card_stats: collectCardStats(obs), ...collectMetrics(obs) });
    }
  }
}

mkdirSync("sim/out", { recursive: true });
writeFileSync("sim/out/records.json", `${JSON.stringify(records, null, 2)}\n`);

// a compact per-Way summary the codex Reports tab renders (records.json is gitignored + large).
// totals and the original byArchetype fields stay identity-cohort-only so the codex reads unchanged;
// the exploit cohort lands as ADDITIVE fields the codex can ignore until the Reports tab grows.
const median = (xs: number[]): number => {
  if (xs.length === 0) return 0;
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : Math.round((s[m - 1] + s[m]) / 2);
};
const wayRecords = records.filter(r => r.policy === "way");
const summary = {
  generated: new Date().toISOString(),
  runsPerArchetype: RUNS_PER_ARCHETYPE,
  crownDemand: RUN_TUNABLES.CROWN_DEMAND,
  totalRuns: wayRecords.length,
  totalWins: wayRecords.filter(r => r.run_won).length,
  byArchetype: ARCHETYPES.map(archetype => {
    const way = wayRecords.filter(r => r.archetype === archetype);
    const exploit = records.filter(r => r.archetype === archetype && r.policy === "exploit");
    const wins = way.filter(r => r.run_won).length;
    const exploitWins = exploit.filter(r => r.run_won).length;
    return {
      archetype,
      runs: way.length,
      wins,
      crownStood: way.filter(r => r.crown_stood).length,
      medianDeckEnd: median(way.map(r => r.deck_size_end)),
      medianGleamPeak: median(way.map(r => r.gleam_peak)),
      exploitWins,
      exploitCrownStood: exploit.filter(r => r.crown_stood).length,
      exploitGap: way.length > 0 ? (exploitWins - wins) / way.length : 0,
    };
  }),
};
writeFileSync("sim/out/summary.json", `${JSON.stringify(summary, null, 2)}\n`);

// the per-card report — the card-audit dashboard's data layer (card-telemetry task)
const cards = reduceCardStats(records);
writeFileSync("sim/out/card-stats.json", `${JSON.stringify(
  { generated: summary.generated, runsPerCohort: RUNS_PER_ARCHETYPE, cards }, null, 2)}\n`);

// a one-line-per-archetype smoke summary so a run of the pipeline is legible in the terminal
for (const row of summary.byArchetype) {
  const gap = `${row.exploitGap >= 0 ? "+" : ""}${Math.round(row.exploitGap * 100)}%`;
  console.log(`${row.archetype.padEnd(12)} way ${row.wins}/${row.runs} · exploit ${row.exploitWins}/${row.runs} (gap ${gap})`);
}
const flagged = cards.filter(c => c.flags.length > 0);
console.log(`sim: wrote ${records.length} records (${ARCHETYPES.length} archetypes × ${POLICY_KINDS.length} policies × ${RUNS_PER_ARCHETYPE}) → sim/out/records.json`);
console.log(`card-stats: ${cards.length} cards, ${flagged.filter(c => c.flags.includes("dominant")).length} dominant / ${flagged.filter(c => c.flags.includes("dead")).length} dead → sim/out/card-stats.json`);
