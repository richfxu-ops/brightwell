// Run the simulation harness (src/sim/run.ts + the engine) and write sim/out/records.json.
// Mirrors build-toy.mjs: esbuild resolves the engine's .js→.ts imports and inlines the JSON content;
// we bundle to a temp ESM file and import it (which executes the run). Node built-ins stay external.
//   npm run sim
import { build } from "esbuild";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const result = await build({
  entryPoints: ["src/sim/run.ts"],
  bundle: true,
  format: "esm",
  platform: "node",
  target: "es2022",
  packages: "external",
  write: false,
});

const dir = mkdtempSync(join(tmpdir(), "roundelay-sim-"));
const file = join(dir, "run.mjs");
writeFileSync(file, result.outputFiles[0].text);
await import(pathToFileURL(file).href);
