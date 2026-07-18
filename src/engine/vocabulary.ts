// vocabulary.ts — the game-loop seam, effects.ts-ready.
// The 14 LOCKED L3 effect primitives of Brightwell as typed data. Cards
// (src/content/cards) are declarative data over these; the game-loop engine
// (effects.ts) implements a resolver per primitive. Emitted at DESIGN_COMPLETE
// from GDD Layer 3 (locked) + Layer 6 numbers (locked). See design/vocabulary.json
// for the canonical JSON and the full trace/notes.

export type Grain = "joinery" | "thread" | "song" | "glaze" | "dance" | "dough";

// The closed read-source enum. `grain:<suit>` / `woken:<suit>` are parameterized.
export type ReadSource =
  | "room" | "chain" | "fill" | "season" | "spiral" | "handsels" | "over-ceiling"
  | `grain:${Grain}` | `woken:${Grain}`;

export type Trigger =
  | "on-play" | "on-wake" | "on-chain" | "on-stall" | "on-overkill"
  | "on-fulfil" | "on-court" | "on-dawn" | "at-dusk";

// Cross-channel writers may bind ONLY to these (compile-time firewall).
export const PLAY_EVENTS = [
  "on-play", "on-wake", "on-overkill", "on-fulfil", "on-court",
] as const;

export type PrimitiveId =
  | "gather" | "rest" | "steady" | "fill" | "brim" | "mark-grain" | "draw"
  | "retire" | "whittle" | "court" | "soothe" | "read" | "warm" | "keep";

// A read expression: `{ do: "read", source }`. `read` is amount-syntax (per/by),
// never printed on a card face.
export interface ReadExpr { do: "read"; source: ReadSource; }
export type Amount = number | ReadExpr;

export interface Effect {
  when: Trigger;
  if?: ReadExpr;               // a read-guard, e.g. { do:"read", source:"chain" } compared via a term
  do: PrimitiveId;
  params?: Record<string, unknown>;
}

export interface Card {
  id: string;
  name: string;
  note?: string;               // plain-English "what this card is for" (shown in the codex, ignored by the engine)
  grain: Grain;
  mark: number;                // FIXED — no primitive lowers it
  ceiling: number;             // FIXED
  woken_delight: number;
  tags?: string[];
  archetype?: string;
  combo?: boolean;
  effects: Effect[];
}

export interface PrimitiveSpec {
  id: PrimitiveId;
  interacts: boolean;
  playGated: boolean;
  gleamWriter: boolean;
  note: string;
}

// The 14 primitives. `interacts:false` for the two no-combo baselines (warm/keep).
export const PRIMITIVES: readonly PrimitiveSpec[] = [
  { id: "gather", interacts: true, playGated: false, gleamWriter: false, note: "seat present audience into the room (soft-capped, plateau ~10)" },
  { id: "rest", interacts: true, playGated: true, gleamWriter: false, note: "spend room x chain onto a piece; at/above fixed mark it wakes, past ceiling it overkills" },
  { id: "steady", interacts: true, playGated: false, gleamWriter: false, note: "count extra links and/or brace so the next stall does not cool the room" },
  { id: "fill", interacts: true, playGated: true, gleamWriter: false, note: "pour woken delight into the accepted need's fill; amount may read room/grain/chain" },
  { id: "brim", interacts: true, playGated: true, gleamWriter: true, note: "THE ONLY card gleam-writer; widens overkill->gleam on genuine excess; band reads room/chain/over-ceiling only" },
  { id: "mark-grain", interacts: true, playGated: false, gleamWriter: false, note: "stamp a craft-suit; flows to seated-audience type, grain-of-gleam, and court terms" },
  { id: "draw", interacts: true, playGated: false, gleamWriter: false, note: "draw pieces; with a suit/tag filter it searches the pack" },
  { id: "retire", interacts: true, playGated: false, gleamWriter: false, note: "last-light a piece; RETURN worth to this node's table or the room; residual-only" },
  { id: "whittle", interacts: true, playGated: true, gleamWriter: false, note: "carve the-shavings-share (0.333 of RETURN) into handsels; read(season) may scale (yield, never gleam)" },
  { id: "court", interacts: true, playGated: true, gleamWriter: false, note: "perform a term; gleam is read as a pure GATE, never spent; a stamped suit or chain-state satisfies the term" },
  { id: "soothe", interacts: true, playGated: true, gleamWriter: false, note: "the ONE board-writer; node-local; slows this node's paling; capped to the last-red; never touches gleam" },
  { id: "read", interacts: true, playGated: false, gleamWriter: false, note: "amount-syntax; the single reference primitive; source in the closed ReadSource enum" },
  { id: "warm", interacts: false, playGated: false, gleamWriter: false, note: "flat +delight on its own card; no combo (legible baseline)" },
  { id: "keep", interacts: false, playGated: false, gleamWriter: false, note: "resist the Paling one extra season; no combo (legible baseline)" },
] as const;

// Compile-time invariants the engine (effects.ts) must enforce.
export const FIREWALLS = {
  gleamFirewall: "read(season|spiral) feeds gather/whittle/fill only, never gleam; brim band reads room/chain/over-ceiling only",
  playIsTheOnlyGate: "cross-channel writers (brim/fill/court/whittle/soothe/rest-overkill) bind only to PLAY_EVENTS",
  fixedMarks: "no primitive lowers a waking-mark or ceiling; the only lever is bringing more room",
  gleamNeverSpent: "court reads gleam as a gate; no card spends or decrements gleam",
  palingSootheOnly: "the Paling is board-only; read(season|spiral) reads it, soothe writes it; it never touches the gleam meter",
} as const;

export const INTERACTION_DENSITY = 12 / 14; // 0.857

// ---- shared firewall machinery (single source of truth for validate.ts + effects.ts) ----

/** The only surfaces a brim band may read (FIREWALLS.gleamFirewall). */
export const BRIM_BAND_SOURCES: readonly ReadSource[] = ["room", "chain", "over-ceiling"];

/** Board surfaces: may feed gather/whittle/fill amounts (and soothe's board-to-board
 *  mend scale) — never anything on a gleam path (FIREWALLS.gleamFirewall). */
export const BOARD_READ_SOURCES: readonly ReadSource[] = ["season", "spiral"];

/** Runtime guard for the one ReadExpr shape, shared by the static and runtime firewalls. */
export function isReadExpr(v: unknown): v is ReadExpr {
  return !!v && typeof v === "object" && (v as ReadExpr).do === "read"
    && typeof (v as ReadExpr).source === "string";
}

/** Is this string a member of the closed ReadSource enum? */
export function isReadSource(s: string): s is ReadSource {
  const PLAIN = ["room", "chain", "fill", "season", "spiral", "handsels", "over-ceiling"];
  const GRAINS = ["joinery", "thread", "song", "glaze", "dance", "dough"];
  if (PLAIN.includes(s)) return true;
  for (const prefix of ["grain:", "woken:"]) {
    if (s.startsWith(prefix)) return GRAINS.includes(s.slice(prefix.length));
  }
  return false;
}
