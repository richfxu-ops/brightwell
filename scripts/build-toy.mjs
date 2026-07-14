// Bundle the toy morning (src/toy/main.ts + the engine + card data) and inject it
// into the codex's TOY-BUNDLE marker region. Idempotent: safe to re-run any time.
//   npm run build:toy
import { build } from "esbuild";
import { readFileSync, writeFileSync } from "node:fs";

const result = await build({
  entryPoints: ["src/toy/main.tsx"],
  bundle: true,
  format: "iife",
  target: "es2022",
  minify: true,
  write: false,
});
const js = result.outputFiles[0].text.replace(/<\/script>/g, "<\\/script>");

const path = "planning/brightwell-codex.html";
let html = readFileSync(path, "utf8");
const BEGIN = "<!-- TOY-BUNDLE:BEGIN";
const END = "<!-- TOY-BUNDLE:END -->";
const i = html.indexOf(BEGIN);
const j = html.indexOf(END);
if (i < 0 || j < 0) throw new Error("TOY-BUNDLE markers missing from the codex");
const head = html.slice(0, html.indexOf("-->", i) + 3);
html = `${head}\n<script>${js}</script>\n${html.slice(j)}`;
writeFileSync(path, html);
console.log(`toy bundle injected: ${(js.length / 1024).toFixed(1)} KB`);
