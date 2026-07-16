// bake-card-audit.mjs — compute the card-design §8 audit scorecard (rubric flags + harness stats)
// and bake it into planning/card-audit.html, codex-style (marker replacement, so the dashboard is a
// self-contained file that works offline). Run after `npm run sim`: `npm run audit`.
//
// Judgment rules (R1/R5 payback etc.) are NOT decided here — the verdict column is a *suggestion*
// derived from the decidable flags; the human audit overrides it.

import { readFileSync, writeFileSync } from "node:fs";

const pool = JSON.parse(readFileSync("src/content/cards/starter-pool.json", "utf8")).cards;
const cardStats = JSON.parse(readFileSync("sim/out/card-stats.json", "utf8"));
const summary = JSON.parse(readFileSync("sim/out/summary.json", "utf8"));

// --- rubric checks decidable from card data (the [LINT]-shaped subset of §1-§2) ---

const hasVerb = (card, verb) => card.effects.some(e => e.do === verb);
const readsSource = (params, source) =>
  JSON.stringify(params ?? {}).includes(`"source":"${source}"`);
const fillReads = (card, source) =>
  card.effects.some(e => e.do === "fill" && readsSource(e.params, source));

const bandOf = (mark) => (mark <= 2 ? "enabler" : mark <= 5 ? "workhorse" : "capstone");
const EXPECTED_WD = { enabler: [1], workhorse: [2], capstone: [3, 4, 5] };

function rubricFlags(card) {
  const flags = [];
  const restSelf = card.effects.some(e => e.do === "rest" && e.params?.target === "self");
  if (restSelf && !hasVerb(card, "fill") && !hasVerb(card, "brim")) flags.push("R2·bare-rest-self");
  if (fillReads(card, "room")) flags.push("R3·fill-reads-room");
  if (card.effects.some(e => e.do === "fill" && /"source":"grain:/.test(JSON.stringify(e.params ?? {}))))
    flags.push("R3·grain-fill");
  if (!EXPECTED_WD[bandOf(card.mark)].includes(card.woken_delight)) flags.push("R4·band-mismatch");
  if (card.tags?.includes("capstone") && !hasVerb(card, "fill") && !hasVerb(card, "brim"))
    flags.push("R6·capstone-no-win");
  return flags;
}

// verbs → the §0 currency each one moves (rest = waking/audience, the compounding line)
const CURRENCY_OF = {
  gather: "room", fill: "fill", brim: "standing", draw: "cards", whittle: "handsels",
  steady: "tempo", retire: "deck", court: "deck", soothe: "board", rest: "audience",
  "mark-grain": "deck", warm: "audience", keep: "audience",
};
const currenciesOf = (card) =>
  [...new Set(card.effects.map(e => CURRENCY_OF[e.do]).filter(Boolean))];

const roleOf = (card) => {
  if (hasVerb(card, "fill")) return "filler";
  if (hasVerb(card, "brim") || card.tags?.includes("capstone")) return "payoff";
  if (hasVerb(card, "draw") || hasVerb(card, "retire") || hasVerb(card, "whittle")) return "cycler";
  if (hasVerb(card, "gather") || hasVerb(card, "steady") || hasVerb(card, "court")) return "builder";
  return "support";
};
const winRelevanceOf = (card, currencies) =>
  hasVerb(card, "fill") || hasVerb(card, "brim") ? "advances"
    : currencies.some(c => ["room", "tempo", "cards", "deck"].includes(c)) ? "enabler"
    : "survival-only";

// --- harness stats: fold a card's cohort rows into the table's headline numbers ---

const WIN_OUTLIER = 0.35;         // |confident win-delta| beyond this is flagged for a look
const EXPLOIT_ENGINE_SHARE = 0.10; // a card carrying >10% of the exploit line's total fill powers it

function harnessOf(report, exploitFillTotal) {
  const way = report.cohorts.filter(k => k.policy === "way");
  const exploit = report.cohorts.filter(k => k.policy === "exploit");
  const runsPresent = way.reduce((n, k) => n + k.runsPresent, 0);
  const wRate = (pick) =>
    runsPresent > 0 ? way.reduce((n, k) => n + pick(k) * k.runsPresent, 0) / runsPresent : 0;
  const confident = way.filter(k => k.winDelta !== null && !k.lowConfidence);
  const top = confident.sort((a, b) => Math.abs(b.winDelta) - Math.abs(a.winDelta))[0] ?? null;
  const exploitFill = exploit.reduce((n, k) => n + k.fill, 0);
  return {
    runsPresent,
    played: way.reduce((n, k) => n + k.played, 0),
    playShare: Math.max(0, ...way.map(k => k.playShare)),
    playRate: wRate(k => k.playRate),
    wokenRate: wRate(k => k.wokenRate),
    fill: way.reduce((n, k) => n + k.fill, 0),
    winDelta: top ? top.winDelta : null,
    winDeltaCohort: top ? top.archetype : null,
    exploitFillShare: exploitFillTotal > 0 ? exploitFill / exploitFillTotal : 0,
    simFlags: [...new Set(way.flatMap(k => k.flags))],   // R14 dead / R15 dominant, identity cohorts
  };
}

function harnessFlags(h) {
  const flags = h.simFlags.map(f => (f === "dead" ? "R14·dead" : f === "dominant" ? "R15·dominant" : f));
  if (h.winDelta !== null && Math.abs(h.winDelta) > WIN_OUTLIER) flags.push("H·win-outlier");
  if (h.exploitFillShare > EXPLOIT_ENGINE_SHARE) flags.push("X·exploit-engine");
  if (h.runsPresent >= 10 && h.playRate < 0.05) flags.push("R9·near-never");
  return flags;
}

// suggested only — the decidable signals ranked; the human audit's verdict column overrides this
function suggestVerdict(flags, h) {
  if (flags.includes("R15·dominant") || flags.includes("X·exploit-engine")) return "fix (tune down)";
  if (flags.some(f => f.startsWith("R2") || f.startsWith("R3") || f.startsWith("R6"))) return "fix";
  if (flags.includes("R14·dead") || flags.includes("R9·near-never")) return "fix (buff or cut)";
  if (flags.includes("H·win-outlier")) return h.winDelta > 0 ? "watch (strong)" : "watch (weak)";
  return "keep";
}

// --- assemble the scorecard ---

const reportOf = new Map(cardStats.cards.map(c => [c.id, c]));
const exploitFillTotal = cardStats.cards
  .flatMap(c => c.cohorts.filter(k => k.policy === "exploit"))
  .reduce((n, k) => n + k.fill, 0);

const rows = pool.map(card => {
  const report = reportOf.get(card.id) ?? { cohorts: [] };
  const h = harnessOf(report, exploitFillTotal);
  const currencies = currenciesOf(card);
  const flags = [...rubricFlags(card), ...harnessFlags(h)];
  return {
    id: card.id, name: card.name, way: card.archetype ?? "shared",
    starter: card.tags?.includes("starter") ?? false,
    capstone: card.tags?.includes("capstone") ?? false,
    mark: card.mark, ceiling: card.ceiling, wd: card.woken_delight, band: bandOf(card.mark),
    role: roleOf(card), currencies, winRelevance: winRelevanceOf(card, currencies),
    effects: card.effects, harness: h, flags,
    verdict: suggestVerdict(flags, h),
    cohorts: report.cohorts,
  };
});

const snapshot = {
  baked: new Date().toISOString().slice(0, 10),
  runsPerCohort: summary.runsPerArchetype,
  byArchetype: summary.byArchetype,
  rows,
};

// --- bake into the dashboard (codex pattern: fail loudly if the anchor drifted) ---

const DASH = "planning/card-audit.html";
const src = readFileSync(DASH, "utf8");
const marker = /const AUDIT_SNAPSHOT = .*?;\n/;
if (!marker.test(src)) {
  console.error("bake-card-audit: AUDIT_SNAPSHOT anchor not found in planning/card-audit.html");
  process.exit(1);
}
writeFileSync(DASH, src.replace(marker, `const AUDIT_SNAPSHOT = ${JSON.stringify(snapshot)};\n`));

const flagged = rows.filter(r => r.flags.length > 0);
const byFlag = {};
for (const r of flagged) for (const f of r.flags) byFlag[f] = (byFlag[f] ?? 0) + 1;
console.log(`card-audit: ${rows.length} cards scored, ${flagged.length} flagged → ${DASH}`);
for (const [f, n] of Object.entries(byFlag).sort((a, b) => b[1] - a[1])) console.log(`  ${f}: ${n}`);
