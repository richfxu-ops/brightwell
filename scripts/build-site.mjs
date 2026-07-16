// Assemble the deployable static site into _site/ — a single self-contained index.html.
// Runs the sim (so the Reports snapshot has data), builds the toy bundle, bakes the planning
// snapshots into the codex, then copies it as _site/index.html. The codex fetches its live data
// files when served locally; on a static host those 404 and it falls back to the baked snapshots,
// so the one file is fully functional on its own.
//   npm run build:site
import { execSync } from "node:child_process";
import { mkdirSync, rmSync, copyFileSync, readdirSync, readFileSync, writeFileSync } from "node:fs";

const run = cmd => execSync(cmd, { stdio: "inherit" });

run("node scripts/run-sim.mjs");          // → sim/out/summary.json (Reports data), deterministic + seeded
run("node scripts/bake-card-audit.mjs");  // → planning/card-audit.html (the Reports shelf links it)
run("node scripts/build-toy.mjs");        // → toy bundle injected into the codex
run("python3 scripts/bake-codex.py");     // → TASKS/DECISIONS/QUESTIONS/RUBRIC/REPORTS/REPORT_PAGES baked

rmSync("_site", { recursive: true, force: true });
mkdirSync("_site", { recursive: true });
copyFileSync("planning/brightwell-codex.html", "_site/index.html");

// Bundle the pages the codex links out to, so those links resolve on the static host too
// (the codex tabs cover most content; these are the standalone pages it still points at).
for (const f of readdirSync("planning")) {
  if (f.startsWith("brightwell-") && f.endsWith(".html") && f !== "brightwell-codex.html")
    copyFileSync(`planning/${f}`, `_site/${f}`);
}
copyFileSync("planning/dashboard.html", "_site/dashboard.html");
copyFileSync("planning/card-audit.html", "_site/card-audit.html");
copyFileSync("planning/card-design.md", "_site/card-design.md");   // card-audit.html links the rubric
copyFileSync("planning/TASKS.md", "_site/TASKS.md");   // dashboard.html fetches this at runtime

// every docs/ page ships (engine plan, findings narratives, …); their links back into planning/
// re-point to the site root, where those pages actually land
mkdirSync("_site/docs", { recursive: true });
for (const f of readdirSync("docs")) {
  if (!f.endsWith(".html")) continue;
  writeFileSync(`_site/docs/${f}`,
    readFileSync(`docs/${f}`, "utf8").replaceAll("../planning/", "../"));
}

// index.html sits at the site root, not planning/, so the codex's "../docs" paths must drop a level.
const index = "_site/index.html";
writeFileSync(index, readFileSync(index, "utf8").replaceAll("../docs/", "docs/"));

console.log("build:site — wrote _site/ (codex + linked pages, self-contained)");
