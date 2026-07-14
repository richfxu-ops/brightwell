// validate.ts — the "fails to compile" firewall (GDD L3 §2) as a static card check.
// Canon violations in card DATA are content bugs: they must be caught before a run
// starts, never handled at play time. Returns violations; empty array = valid.

import type { Card, Effect } from "./vocabulary.js";
import {
  BOARD_READ_SOURCES, BRIM_BAND_SOURCES, PLAY_EVENTS, PRIMITIVES, isReadExpr, isReadSource,
} from "./vocabulary.js";

const VERB_IDS = new Set(PRIMITIVES.map(p => p.id));
// Derived from the vocabulary itself: rest/fill/brim/whittle/court/soothe carry
// playGated:true — cross-channel writers bind only to play events (L3 §2).
const PLAY_GATED = new Set(PRIMITIVES.filter(p => p.playGated).map(p => p.id));
// Board surfaces may feed only these verbs' amounts: gather/whittle/fill by the
// gleam firewall's own words, plus soothe's board-to-board mend scale.
const BOARD_FED_VERBS = new Set(["gather", "whittle", "fill", "soothe"]);
const GRAINS = new Set<string>(["joinery", "thread", "song", "glaze", "dance", "dough"]);
const TARGETS = new Set<string>([
  "self", "held:capstone", "hand:offgrain", "hand:cheapest", "inert:hand", "inert:pack",
]);

/** Every ReadExpr anywhere in a params tree (amounts, bands, scales, term.if, term.at_least…). */
function* readsIn(value: unknown): Generator<{ source: string }> {
  if (isReadExpr(value)) { yield value; return; }
  if (value && typeof value === "object") {
    for (const v of Object.values(value)) yield* readsIn(v);
  }
}

function isAmount(v: unknown): boolean {
  return typeof v === "number" || isReadExpr(v);
}

// Per-verb param-shape rules: presence and type of what each resolver will read.
function checkParams(e: Effect): string[] {
  const p = e.params ?? {};
  const out: string[] = [];
  const need = (cond: boolean, msg: string) => { if (!cond) out.push(msg); };
  switch (e.do) {
    case "gather": case "fill": case "whittle":
      need(isAmount(p.amount), `${e.do} needs a numeric or read amount`);
      break;
    case "rest":
      need(isAmount(p.amount), "rest needs a numeric or read amount");
      need(p.target === undefined || TARGETS.has(String(p.target)), `unknown rest target "${String(p.target)}"`);
      break;
    case "steady":
      need(p.links !== undefined || p.brace !== undefined, "steady needs links and/or brace");
      break;
    case "brim":
      need(isAmount(p.band), "brim needs a numeric or read band");
      break;
    case "mark-grain":
      need(GRAINS.has(String(p.suit)), `mark-grain needs a grain suit, got "${String(p.suit)}"`);
      need(p.target === undefined || TARGETS.has(String(p.target)), `unknown mark-grain target "${String(p.target)}"`);
      break;
    case "draw":
      need(p.n === undefined || typeof p.n === "number", "draw n must be a number");
      need(p.suit === undefined || GRAINS.has(String(p.suit)), `unknown draw suit "${String(p.suit)}"`);
      break;
    case "retire":
      need(p.target === "inert:hand" || p.target === "inert:pack", "retire targets inert:hand or inert:pack");
      need(p.to === undefined || p.to === "room" || p.to === "table", `unknown retire destination "${String(p.to)}"`);
      break;
    case "court": {
      need(typeof p.stock === "string", "court needs a stock name");
      const term = p.term;
      const termExpr = !!term && typeof term === "object" && isReadExpr((term as { if?: unknown }).if);
      need(term === undefined || typeof term === "number"
        || (termExpr && ((term as { at_least?: unknown }).at_least === undefined
                         || isAmount((term as { at_least?: unknown }).at_least))),
        "court term must be a number or { if: <read>, at_least: <amount> }");
      break;
    }
    case "soothe":
      need(p.amount === undefined || isAmount(p.amount), "soothe amount must be numeric or a read");
      need(p.scale === undefined || isAmount(p.scale), "soothe scale must be numeric or a read");
      need(p.cap === undefined || p.cap === "last-red", `soothe cap is engine law; only "last-red" is legal, got "${String(p.cap)}"`);
      break;
    case "warm":
      need(p.n === undefined || typeof p.n === "number", "warm n must be a number");
      break;
  }
  return out;
}

function checkEffect(e: Effect, i: number): string[] {
  const at = `effect ${i} (${e.do} @ ${e.when})`;
  const out: string[] = [];
  if (!VERB_IDS.has(e.do)) {
    return [`${at}: unknown primitive "${e.do}"`];
  }
  if ((e.do as string) === "read") out.push(`${at}: read is amount-syntax, never a standalone verb`);
  if (PLAY_GATED.has(e.do) && !(PLAY_EVENTS as readonly string[]).includes(e.when)) {
    out.push(`${at}: cross-channel writer bound to non-play event "${e.when}"`);
  }
  // every read anywhere in params: closed enum + board-source firewall
  for (const r of readsIn(e.params)) {
    if (!isReadSource(r.source)) {
      out.push(`${at}: unknown read source "${r.source}" (closed enum)`);
    } else if ((BOARD_READ_SOURCES as readonly string[]).includes(r.source) && !BOARD_FED_VERBS.has(e.do)) {
      out.push(`${at}: read(${r.source}) may feed gather/whittle/fill/soothe only — never a ${e.do} (gleam firewall)`);
    }
  }
  if (e.do === "brim") {
    const band = e.params?.band;
    if (isReadExpr(band) && !BRIM_BAND_SOURCES.includes(band.source)) {
      out.push(`${at}: brim band reads "${band.source}" — within-channel surfaces only (gleam firewall)`);
    }
    if (e.if && (BOARD_READ_SOURCES as readonly string[]).includes(e.if.source)) {
      out.push(`${at}: brim gated by board surface "${e.if.source}" (gleam firewall)`);
    }
  }
  if (e.if && !isReadSource(e.if.source)) {
    out.push(`${at}: unknown if-guard source "${e.if.source}" (closed enum)`);
  }
  for (const key of Object.keys(e.params ?? {})) {
    if (key === "mark" || key === "ceiling") {
      out.push(`${at}: params.${key} — no primitive touches a waking-mark or ceiling (fixed-marks law)`);
    }
  }
  out.push(...checkParams(e).map(v => `${at}: ${v}`));
  return out;
}

/** All firewall violations in one card's data. Empty = canon-legal. */
export function validateCard(card: Card): string[] {
  return card.effects.flatMap((e, i) => checkEffect(e, i).map(v => `${card.id}: ${v}`));
}

/** Validate a whole pool; throws listing every violation (content bugs stop the run). */
export function assertPoolValid(cards: readonly Card[]): void {
  const violations = cards.flatMap(validateCard);
  if (violations.length > 0) {
    throw new Error(`card pool violates locked canon:\n${violations.join("\n")}`);
  }
}
