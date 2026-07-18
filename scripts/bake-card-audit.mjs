// bake-card-audit.mjs — compute the card-design §8 audit scorecard (rubric flags + harness stats)
// and bake it into planning/card-audit.html, codex-style (marker replacement, so the dashboard is a
// self-contained file that works offline). Run after `npm run sim`: `npm run audit`.
//
// Judgment rules (R1/R5 payback etc.) are NOT decided here — the verdict column is a *suggestion*
// derived from the decidable flags; the human audit overrides it.

import { existsSync, readFileSync, writeFileSync } from "node:fs";

const fail = (msg) => { console.error(`bake-card-audit: ${msg}`); process.exit(1); };
const readJson = (path) => {
  if (!existsSync(path)) fail(`missing ${path} — run \`npm run sim\` first`);
  return JSON.parse(readFileSync(path, "utf8"));
};

const pool = readJson("src/content/cards/starter-pool.json").cards;
const cardStats = readJson("sim/out/card-stats.json");
const summary = readJson("sim/out/summary.json");

// The two sim outputs must be from the same run (run.ts stamps both with one timestamp) and must
// carry the exploit cohorts — a stale pre-D-023 card-stats.json would bake a silently all-zero audit.
if (cardStats.generated !== summary.generated)
  fail("card-stats.json and summary.json are from different sim runs — re-run `npm run sim`");
if (!cardStats.cards.some(c => c.cohorts.some(k => k.policy === "exploit")))
  fail("card-stats.json has no exploit cohorts (stale shape) — re-run `npm run sim`");

// --- rubric checks decidable from card data (the [LINT]-shaped subset of §1-§2) ---
// The hard [LINT] rules are ALSO enforced at build time by src/engine/card-lint.ts (via its
// pool test); this copy additionally computes [REVIEW]-shaped display flags (R4/R6) the lint
// deliberately does not enforce. Keep the R2/R3 logic in sync with card-lint.ts.

const hasVerb = (card, verb) => card.effects.some(e => e.do === verb);
// Fill amounts are flat numbers or a single read expr ({do:"read", source}); if compound amounts
// ever land, switch to the engine's readsIn() walker (validate.ts) rather than extending this.
const fillReads = (card, pred) =>
  card.effects.some(e => {
    const source = e.do === "fill" ? e.params?.amount?.source : undefined;
    return typeof source === "string" && pred(source);
  });

// Tier bands come from the locked canon (GDD L6 via tiers.json), never a parallel copy here.
// Mark ranges overlap at 7 (proud vs capstone) — the capstone tag disambiguates, else first match.
const TIERS = readJson("src/content/contracts/tiers.json").waking_marks_by_card_tier;
const inRange = (v, r) => (Array.isArray(r) ? v >= r[0] && v <= r[1] : v === r);
function tierOf(card) {
  if (card.tags?.includes("capstone")) return "capstone";
  return Object.keys(TIERS).find(name => inRange(card.mark, TIERS[name].mark)) ?? "capstone";
}
function wdMismatch(card, tier) {
  const t = TIERS[tier];
  if (card.archetype === "mannerly" && t.woken_delight_mannerly === card.woken_delight) return false;
  return !inRange(card.woken_delight, t.woken_delight);
}

// Pool-wide fill-read bans come from the same data card-lint enforces, not a literal here.
const FILL_READ_BANS = readJson("design/way-laws.json").pool.fillReadBans;

function rubricFlags(card, tier) {
  const flags = [];
  // An omitted rest target defaults to self in the engine — same predicate as card-lint.ts.
  const restSelf = card.effects.some(e => e.do === "rest" && (e.params?.target ?? "self") === "self");
  if (restSelf && !hasVerb(card, "fill") && !hasVerb(card, "brim")) flags.push("R2·bare-rest-self");
  for (const ban of FILL_READ_BANS) {
    if (fillReads(card, s => s === ban)) flags.push(`R3·fill-reads-${ban}`);
  }
  // Bare grain-count fills are Untold-only (D-025) — their exhaust loop keeps the count live.
  if (fillReads(card, s => s.startsWith("grain:")) && card.archetype !== "untold") flags.push("R3·grain-fill");
  // mark range matters too: a tag-assigned tier (capstone) can carry an out-of-band mark
  if (!inRange(card.mark, TIERS[tier].mark) || wdMismatch(card, tier)) flags.push("R4·band-mismatch");
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
    playShare: Math.max(0, ...way.map(k => k.playShare)),
    playRate: wRate(k => k.playRate),
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
  if (flags.includes("R4·band-mismatch")) return "watch (calibration)";
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
  const tier = tierOf(card);
  const flags = [...rubricFlags(card, tier), ...harnessFlags(h)];
  return {
    id: card.id, name: card.name, way: card.archetype ?? "shared",
    capstone: card.tags?.includes("capstone") ?? false,
    mark: card.mark, wd: card.woken_delight, band: tier,
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
const anchors = src.match(/const AUDIT_SNAPSHOT = .*?;\n/g) ?? [];
if (anchors.length !== 1) fail(`expected exactly 1 AUDIT_SNAPSHOT anchor in ${DASH}, found ${anchors.length}`);
// function replacer — a string replacement would interpret $-sequences inside the JSON payload
writeFileSync(DASH, src.replace(anchors[0], () => `const AUDIT_SNAPSHOT = ${JSON.stringify(snapshot)};\n`));

const flagged = rows.filter(r => r.flags.length > 0);
const byFlag = {};
for (const r of flagged) for (const f of r.flags) byFlag[f] = (byFlag[f] ?? 0) + 1;
console.log(`card-audit: ${rows.length} cards scored, ${flagged.length} flagged → ${DASH}`);
for (const [f, n] of Object.entries(byFlag).sort((a, b) => b[1] - a[1])) console.log(`  ${f}: ${n}`);
