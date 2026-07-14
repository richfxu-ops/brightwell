// run.ts — the sim entry (engine Phase 7): play N seeded runs per archetype through the harness and
// write the per-run records to sim/out/records.json for Phase 8 (the balance sheet). Run via the
// esbuild runner: `npm run sim`. N is small in Phase 7 (smoke-test the pipeline); Phase 8 scales it.

import { mkdirSync, writeFileSync } from "node:fs";
import { ARCHETYPES, runGame } from "./driver.js";
import { collectMetrics, type RoundMetricsPerRun } from "./metrics.js";

const RUNS_PER_ARCHETYPE = 50;

const records: (RoundMetricsPerRun & { seed: number })[] = [];
for (const archetype of ARCHETYPES) {
  for (let seed = 0; seed < RUNS_PER_ARCHETYPE; seed++) {
    records.push({ seed, ...collectMetrics(runGame(seed, archetype)) });
  }
}

mkdirSync("sim/out", { recursive: true });
writeFileSync("sim/out/records.json", `${JSON.stringify(records, null, 2)}\n`);

// a one-line-per-archetype smoke summary so a run of the pipeline is legible in the terminal
for (const archetype of ARCHETYPES) {
  const mine = records.filter(r => r.archetype === archetype);
  const won = mine.filter(r => r.run_won).length;
  const avgDeck = (mine.reduce((s, r) => s + r.deck_size_end, 0) / mine.length).toFixed(1);
  console.log(`${archetype.padEnd(12)} won ${won}/${mine.length} · avg end-deck ${avgDeck}`);
}
console.log(`sim: wrote ${records.length} records (${ARCHETYPES.length} archetypes × ${RUNS_PER_ARCHETYPE}) → sim/out/records.json`);
