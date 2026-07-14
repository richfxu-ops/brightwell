// state.ts — the table: one plain, JSON-serializable object holding the whole game.
// Cards stay data in src/content; a PieceInstance holds only per-run facts and points
// at its card by id. Nothing here changes except through a pure transition function.

import type { Grain } from "./vocabulary.js";
import type { RngState } from "./rng.js";
import shared from "../content/cards/shared.json" with { type: "json" };
import tiers from "../content/contracts/tiers.json" with { type: "json" };

export type Zone = "pack" | "hand" | "in-play";

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
}

export interface Asking {
  tier: "kettle" | "plea" | "poem" | "great" | "crown";
  needFill: number;
  progress: number;
  acceptedMorning: number;
  staleAfterMornings: number;
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
}

export interface GameEvent {
  morning: number;
  type: string;
  data?: Record<string, unknown>;
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
  };
  player: {
    gleam: number;
    gleamGrain: Record<Grain, number>;   // grain-tagged Standing
    handsels: Handsel[];
    stock: StockItem[];
  };
  pieces: PieceInstance[];
  asking: Asking | null;
  turn: TurnState;
  events: GameEvent[];
}

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
    playedThisMorning: false,
    freshness: 2,
  }));

  const startNode: NodeState = {
    id: "green-going-1",
    rings: 0,
    localTable: 0,
    lastRed: 0,
    remade: false,
  };

  return {
    rng: { seed, counter: 0 },
    calendar: { morning: 1, leg: 0 },
    board: { nodes: [startNode], hereId: startNode.id, offers: [] },
    player: {
      // Starting gleam is a placeholder inside the kettle band (1-5); the true
      // opening value is fixed in Phase 5 with the run frame.
      gleam: 1,
      gleamGrain: { ...NO_GRAIN_GLEAM },
      handsels: [],
      stock: [],
    },
    pieces,
    asking: null,
    turn: { room: 0, chainLinks: 0, braced: false, stalled: false, overCeiling: 0 },
    events: [],
  };
}
