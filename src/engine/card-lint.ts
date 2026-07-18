// card-lint.ts — the quality tripwire: the machine-checkable [LINT] subset of the card
// design bible (planning/card-design.md) as a static check. validate.ts answers "is this
// card canon-legal?"; this answers "does it meet the quality bar?" for the rules decidable
// from card data alone: R2 (overflow must be spent), R3 (fills scale right), and the
// per-Way machine laws in design/way-laws.json (banned primitives, fill-read allowlists,
// amount bans). Judgment rules (R1/R4/R5…) stay in design review and the audit dashboard;
// bake-card-audit.mjs keeps a display copy of these flags — keep the R2/R3 logic in sync.
// Enforced by card-lint.test.ts asserting the whole starter pool lints clean.

import type { Card, Effect } from "./vocabulary.js";
import { isReadExpr } from "./vocabulary.js";

export interface WayLawset {
  readonly bannedPrimitives?: readonly { id: string; why: string }[];
  /** Allowed read-sources for fill amounts (exact id or `id:*` prefix). */
  readonly fillReads?: readonly string[];
  readonly amountBans?: readonly { source: string; on: readonly string[]; why: string }[];
}

export interface WayLaws {
  readonly pool: { readonly fillReadBans: readonly string[] };
  readonly ways: Readonly<Record<string, WayLawset>>;
}

// The six Walking Ways plus the shared pool. An archetype outside this set would silently
// receive zero way-law enforcement (the ways lookup falls back to {}), so unknown values
// are themselves a lint violation — fail loud, not quiet.
const ARCHETYPES: ReadonlySet<string> = new Set([
  "kilnfast", "eveners", "untold", "fairwrights", "mannerly", "gleaners", "shared",
]);

const hasVerb = (card: Card, verb: string): boolean => card.effects.some(e => e.do === verb);

/** The read-source feeding an effect's amount, if the amount is a read at all. */
function amountReadSource(e: Effect): string | undefined {
  const amount = e.params?.amount;
  return isReadExpr(amount) ? amount.source : undefined;
}

const matchesAllowed = (source: string, allowed: readonly string[]): boolean =>
  allowed.some(a => source === a || source.startsWith(`${a}:`));

function lintWayLaws(card: Card, way: WayLawset): string[] {
  const out: string[] = [];
  for (const ban of way.bannedPrimitives ?? []) {
    if (hasVerb(card, ban.id)) out.push(`way-law: uses ${ban.id} — ${ban.why}`);
  }
  for (const e of card.effects) {
    const source = amountReadSource(e);
    if (source === undefined) continue;
    for (const ban of way.amountBans ?? []) {
      if (ban.on.includes(e.do) && source === ban.source) {
        out.push(`way-law: read(${ban.source}) feeds ${e.do} — ${ban.why}`);
      }
    }
    if (e.do === "fill" && way.fillReads && !matchesAllowed(source, way.fillReads)) {
      out.push(`way-law: fill reads ${source} — this Way's fills read only ${way.fillReads.join("/")}`);
    }
  }
  return out;
}

/**
 * All quality violations in one card's data. Empty = meets the bar's [LINT] subset.
 * Rule ids reference planning/card-design.md.
 */
export function lintCard(card: Card, laws: WayLaws): string[] {
  const out: string[] = [];
  if (card.archetype !== undefined && !ARCHETYPES.has(card.archetype)) {
    out.push(`unknown archetype "${card.archetype}" — way-laws cannot be applied (typo?)`);
  }
  // An omitted rest target is a rest-self: the engine's resolveTarget defaults to self.
  const restSelf = card.effects.some(e => e.do === "rest" && (e.params?.target ?? "self") === "self");
  if (restSelf && !hasVerb(card, "fill") && !hasVerb(card, "brim")) {
    out.push("R2: bare rest-self — overflow feeds only a Standing trickle; pair it with a fill or brim");
  }
  for (const e of card.effects) {
    if (e.do !== "fill") continue;
    const source = amountReadSource(e);
    if (source === undefined) continue;
    if (laws.pool.fillReadBans.includes(source)) {
      out.push(`R3: fill reads ${source} — banned pool-wide (one-shots the crown)`);
    }
    if (source.startsWith("grain:") && card.archetype !== "untold") {
      out.push(`R3: bare grain-count fill is Untold-only (D-025) — dries up once the deck is woken`);
    }
  }
  out.push(...lintWayLaws(card, laws.ways[card.archetype ?? ""] ?? {}));
  return out.map(v => `${card.id}: ${v}`);
}

/** Lint a whole pool; the enforcing test asserts this returns []. */
export function lintPool(cards: readonly Card[], laws: WayLaws): string[] {
  return cards.flatMap(c => lintCard(c, laws));
}
