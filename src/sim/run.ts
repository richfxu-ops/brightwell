// run.ts — the sim entry (engine Phase 7): play N seeded runs per archetype through the harness and
// write the per-run records to sim/out/records.json for Phase 8 (the balance sheet). Run via the
// esbuild runner: `npm run sim`. N is small in Phase 7 (smoke-test the pipeline); Phase 8 scales it.

import { mkdirSync, writeFileSync } from "node:fs";
import { ARCHETYPES } from "./driver.js";
import { runArchetype } from "./policies.js";
import { collectMetrics, type RoundMetricsPerRun } from "./metrics.js";
import { RUN_TUNABLES } from "../engine/runframe.js";

const RUNS_PER_ARCHETYPE = 50;

const records: (RoundMetricsPerRun & { seed: number })[] = [];
for (const archetype of ARCHETYPES) {
  for (let seed = 0; seed < RUNS_PER_ARCHETYPE; seed++) {
    records.push({ seed, ...collectMetrics(runArchetype(seed, archetype)) });
  }
}

mkdirSync("sim/out", { recursive: true });
writeFileSync("sim/out/records.json", `${JSON.stringify(records, null, 2)}\n`);

// a compact per-Way summary the codex Reports tab renders (records.json is gitignored + large)
const median = (xs: number[]): number => {
  if (xs.length === 0) return 0;
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : Math.round((s[m - 1] + s[m]) / 2);
};
const summary = {
  generated: new Date().toISOString(),
  runsPerArchetype: RUNS_PER_ARCHETYPE,
  crownDemand: RUN_TUNABLES.CROWN_DEMAND,
  totalRuns: records.length,
  totalWins: records.filter(r => r.run_won).length,
  byArchetype: ARCHETYPES.map(archetype => {
    const mine = records.filter(r => r.archetype === archetype);
    return {
      archetype,
      runs: mine.length,
      wins: mine.filter(r => r.run_won).length,
      crownStood: mine.filter(r => r.crown_stood).length,
      medianDeckEnd: median(mine.map(r => r.deck_size_end)),
      medianGleamPeak: median(mine.map(r => r.gleam_peak)),
    };
  }),
};
writeFileSync("sim/out/summary.json", `${JSON.stringify(summary, null, 2)}\n`);

// a one-line-per-archetype smoke summary so a run of the pipeline is legible in the terminal
for (const archetype of ARCHETYPES) {
  const mine = records.filter(r => r.archetype === archetype);
  const won = mine.filter(r => r.run_won).length;
  const avgDeck = (mine.reduce((s, r) => s + r.deck_size_end, 0) / mine.length).toFixed(1);
  console.log(`${archetype.padEnd(12)} won ${won}/${mine.length} · avg end-deck ${avgDeck}`);
}
console.log(`sim: wrote ${records.length} records (${ARCHETYPES.length} archetypes × ${RUNS_PER_ARCHETYPE}) → sim/out/records.json`);
