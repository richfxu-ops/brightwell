// Assemble the deployable static site into _site/ — a single self-contained index.html.
// Runs the sim (so the Reports snapshot has data), builds the toy bundle, bakes the planning
// snapshots into the codex, then copies it as _site/index.html. The codex fetches its live data
// files when served locally; on a static host those 404 and it falls back to the baked snapshots,
// so the one file is fully functional on its own.
//   npm run build:site
import { execSync } from "node:child_process";
import { mkdirSync, rmSync, copyFileSync } from "node:fs";

const run = cmd => execSync(cmd, { stdio: "inherit" });

run("node scripts/run-sim.mjs");        // → sim/out/summary.json (Reports data), deterministic + seeded
run("node scripts/build-toy.mjs");      // → toy bundle injected into the codex
run("python3 scripts/bake-codex.py");   // → TASKS/DECISIONS/QUESTIONS/RUBRIC/REPORTS snapshots baked

rmSync("_site", { recursive: true, force: true });
mkdirSync("_site", { recursive: true });
copyFileSync("planning/brightwell-codex.html", "_site/index.html");
console.log("build:site — wrote _site/index.html (self-contained codex)");
