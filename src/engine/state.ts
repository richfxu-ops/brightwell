// state.ts — the table: one plain, JSON-serializable object holding the whole game.
// Cards stay data in src/content; a PieceInstance holds only per-run facts and points
// at its card by id. Nothing here changes except through a pure transition function.

import type { Grain } from "./vocabulary.js";
import type { RngState } from "./rng.js";
import shared from "../content/cards/shared.json" with { type: "json" };
import tiers from "../content/contracts/tiers.json" with { type: "json" };

export type Zone = "pack" | "hand" | "in-play" | "discard";   // discard cycles (D-010 B4)

export interface PieceInstance {
  instanceId: string;          // unique within a run: "<cardId>#<n>"
  cardId: string;              // content id in src/content/cards
  zone: Zone;
  fired: boolean;              // woken permanently — the fired never unfires
  set: number;                 // attention currently rested vs the printed fixed mark/ceiling
  stampedGrains: Grain[];      // mark-grain stamps, in addition to the printed grain
  wokeThisMorning: boolean;    // dawn-reset; feeds read(grain:) per D-009
  stampedThisMorning: boolean; // dawn-reset; feeds read(grain:) per D-009
  playedThisMorning: boolean;  // dawn-reset
  freshness: number;           // seasons before an inert piece fades (semantics land in Phase 3/6)
  delightBonus: number;        // flat additions from `warm` on top of the printed woken_delight
  // the overkill ledger: gleam already credited for this piece's excess, and any band
  // widening from brim. credited = convert(excess, band) always, so cumulative gleam
  // can never exceed the measured overflow no matter how rests and brims are split.
  overkillCredited: number;
  brimBand: number;
}

export interface Handsel {
  brightness: 1 | 2 | 3;       // dull / warm / singing (L6)
  idleMornings: number;
}

export interface StockItem {
  id: string;
  grade: "apprentice" | "named" | "twice-benched";
  freshness: number;
}

export interface NodeState {
  id: string;
  rings: number;               // the Paling's spiral rings (3 plea · 5 poem · 7 great)
  localTable: number;          // RETURNed attention waiting for tomorrow's dawn (node-bound)
  lastRed: number;             // harvestable last-red catalysts
  remade: boolean;
  soothed: boolean;            // a soothe removes this node's ring-indexed dawn draw (L6 §9)
}

export interface Asking {
  tier: "kettle" | "plea" | "poem" | "great" | "crown";
  needFill: number;
  progress: number;
  acceptedMorning: number;
  acceptedLeg: number;          // the leg (season) it was accepted in — drives staleness (C3)
  staleAfterMornings: number;
  touched: boolean;             // any fill poured into it this lifetime (for the unmoved-room flop, C2)
}

export interface CalendarState {
  morning: number;             // 1..27 worked mornings
  leg: number;                 // 0..4: Green Going · Long Light · Deep Gold · Red Walk · Wintering
}

export interface TurnState {
  room: number;                // the attention pool (R1)
  chainLinks: number;          // unbroken-work momentum
  braced: boolean;
  stalled: boolean;
  overCeiling: number;         // measured genuine overkill of the current play
  overkillPieceId: string | null; // the piece whose excess overCeiling measures (brim's target)
  seatedCount: number;         // audience seats this morning — drives the decaying seat law
  whittledThisMorning: boolean; // whittle is capped at 1 dull per morning (L6 §5)
  dawned: boolean;             // this turn's dawn has run (dawn() advances the calendar after)
  pouredThisMorning: number;   // room spent on pours this morning — provenance + the flop check (C2)
  playedOrder: string[];       // instanceIds in played order — cascade order (D-010 B3)
  firedEffectKeys: string[];   // "<instanceId>#<effectIndex>" — fire-once per morning (B3)
}

export interface GameEvent {
  morning: number;
  type: string;
  data?: Record<string, unknown>;
}

export type RunEndReason = "won" | "quiet-walk" | "drifted";
export interface RunEnd {
  reason: RunEndReason;
  peakStanding: number;   // brightest Standing reached — sizes the (deferred) meta-reward
  crownDemand: number;    // the crown's demand this run
}

export interface GameState {
  rng: RngState;
  calendar: CalendarState;
  // FIDELITY: simplified map (D-008 rule 3) — a flat node list + 2-3 offered next
  // towns per dusk stands in for the full road-memory graph.
  board: {
    nodes: NodeState[];
    hereId: string;
    offers: string[];
    camped: boolean;   // stayed the night — dawn recovers ⅔ of this node's table (L6)
  };
  player: {
    gleam: number;
    peakGleam: number;                   // brightest Standing this run — one-way, never falls (filter-1 ratchet)
    gleamGrain: Record<Grain, number>;   // grain-tagged Standing
    handsels: Handsel[];
    stock: StockItem[];
    soothesUsed: number;                 // max 4/run — 1 node / 1 knack / 1 season (L6)
  };
  pieces: PieceInstance[];
  asking: Asking | null;
  crownStood: boolean;         // the Wintering crown was stood — the bright win (Phase 5)
  runEnded: RunEnd | null;     // set once the run concludes; the toy/bots stop here
  turn: TurnState;
  events: GameEvent[];
}

// Opening Standing (Phase 5 run frame; RUN_TUNABLES mirrors it). Kept here beside
// createInitialState to avoid a state↔runframe import cycle.
export const STARTING_STANDING = 5;

// Season-clock constants, straight from the locked tiers.json.
export const LEGS: readonly string[] = tiers.season_clock.legs;
export const MORNINGS_PER_LEG: readonly number[] = tiers.season_clock.mornings_per_leg;
export const WORKED_MORNINGS_TOTAL: number = tiers.season_clock.worked_mornings_total;
// read(season): the seep stage as the current leg's need floor (1·3·5·7; the
// Wintering holds at 7). Traced to tiers.json per_morning_need_floor.
export const SEASON_SEEP_BY_LEG: readonly number[] = [
  ...tiers.season_clock.per_morning_need_floor,
  tiers.season_clock.per_morning_need_floor[3],
];

const NO_GRAIN_GLEAM: Record<Grain, number> = {
  joinery: 0, thread: 0, song: 0, glaze: 0, dance: 0, dough: 0,
};

/** A fresh run: morning 1 of the Green Going, the 7-card apprentice deck in the pack. */
export function createInitialState(seed: number): GameState {
  const pieces: PieceInstance[] = shared.cards.map((card, i) => ({
    instanceId: `${card.id}#${i}`,
    cardId: card.id,
    zone: "pack",
    fired: false,
    set: 0,
    stampedGrains: [],
    wokeThisMorning: false,
    stampedThisMorning: false,
    playedThisMorning: false,   // owned by the Phase-3 turn loop (set on play, dawn-reset)
    freshness: 2,
    delightBonus: 0,
    overkillCredited: 0,
    brimBand: 0,
  }));

  const startNode: NodeState = {
    id: "green-going-1",
    rings: 0,
    localTable: 0,
    lastRed: 0,
    remade: false,
    soothed: false,
  };

  return {
    rng: { seed, counter: 0 },
    calendar: { morning: 1, leg: 0 },
    board: { nodes: [startNode], hereId: startNode.id, offers: [], camped: false },
    player: {
      // Opening Standing — fixed by the run frame (Phase 5) inside the kettle band, high
      // enough that one flop doesn't end the run. Tunable; mirrored in RUN_TUNABLES.
      gleam: STARTING_STANDING,
      peakGleam: STARTING_STANDING,
      gleamGrain: { ...NO_GRAIN_GLEAM },
      handsels: [],
      // PLACEHOLDER count pending QUESTIONS.md §D3 — whittle consumes these
      stock: [
        { id: "apprentice-stuff", grade: "apprentice", freshness: 2 },
        { id: "apprentice-stuff", grade: "apprentice", freshness: 2 },
      ],
      soothesUsed: 0,
    },
    pieces,
    asking: null,
    crownStood: false,
    runEnded: null,
    turn: {
      room: 0, chainLinks: 0, braced: false, stalled: false,
      overCeiling: 0, overkillPieceId: null, seatedCount: 0, whittledThisMorning: false,
      dawned: false, pouredThisMorning: 0, playedOrder: [], firedEffectKeys: [],
    },
    events: [],
  };
}

/** The node the maker is standing at. One lookup, one missing-node policy. */
export function currentNode(state: GameState): NodeState {
  const node = state.board.nodes.find(n => n.id === state.board.hereId);
  if (!node) throw new Error(`no node ${state.board.hereId}`);
  return node;
}
