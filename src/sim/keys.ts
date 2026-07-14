// keys.ts — the round_metrics manifest (engine Phase 7): the single source of truth for how each
// of the 57 canonical metric keys (design/round_metrics.json) is produced. Every key falls in
// exactly one bucket. The emitter reads PER_RUN_* to build a record; the completeness gate reads
// these lists to check a record; a test asserts the three buckets partition exactly the 57 keys, so
// the manifest can never silently drift from the contract.

import roundMetrics from "../../design/round_metrics.json" with { type: "json" };

/** The 57 canonical keys, verbatim from the locked contract. */
export const CANONICAL_KEYS: readonly string[] = roundMetrics.keys;

/**
 * Per-run, real now (~37): produced with real values in every record, read off the event log +
 * final state. These are what the run/deck/gleam/asking/chain/acquisition/room systems already emit.
 */
export const PER_RUN_REAL = [
  "run_won", "run_end_reason", "crown_stood", "crown_tier_reached", "standing_zero_season",
  "worked_mornings_total", "decisions_per_turn_median", "decisions_per_turn_min",
  "deck_size_by_leg", "deck_size_end", "cards_woken_total", "cards_retired_total",
  "cards_gifted_total", "combo_activations_per_run", "combo_density_played", "archetype",
  "attention_room_peak", "attention_return_to_table", "chain_length_max", "chain_length_median",
  "overkill_to_gleam_total", "gleam_peak", "gleam_end", "gleam_spilled_total", "paling_rings_accrued",
  "acquisition_source_shares", "fair_drafts_taken", "courtings_landed", "soothe_applications",
  "last_red_used", "waking_capacity_by_leg", "difficulty_by_ring", "skip_ripen_margin",
  "need_fill_clear_rate_by_leg", "retire_cycle_net", "handsels_whittled_total", "handsels_bright_share",
] as const;

/**
 * Per-run, structural zero (~7): the metric is in the record (so the shape is stable), but its
 * system isn't observable yet — emitted as 0/null tagged with what it awaits (DEFERRED_REASON).
 * "Honest zeros" per the agreed completeness gate; values fill in as these systems land.
 */
export const PER_RUN_ZERO = [
  "combing_events", "gleanings_taken", "handsels_idle_lapsed_total", "glad_price_net_ev",
  "untold_per_leg_count", "untold_pressure_vs_size_ratio", "untold_crown_delivery",
] as const;

/** Why each PER_RUN_ZERO key is still zero — the system it awaits. */
export const DEFERRED_REASON: Record<(typeof PER_RUN_ZERO)[number], string> = {
  combing_events: "no combing boss built (Paling clock summing to 7)",
  gleanings_taken: "no gleaning / pale-route harvest built",
  handsels_idle_lapsed_total: "idle-lapse runs in dusk but emits no `lapsed` event to count",
  glad_price_net_ev: "no glad-price circulation economy built",
  untold_per_leg_count: "the Untold's count-and-pace pressure variant isn't modeled (askings are size-based)",
  untold_pressure_vs_size_ratio: "same — no Untold tempo model",
  untold_crown_delivery: "same — no Untold tempo model",
};

/**
 * Cross-run aggregate (~13): a single run's record CANNOT hold these — they reduce over the whole
 * record set (win rates, the six axes, dominated pairs, spreads, power-share formulas). Phase 8
 * (balance-sheet.md) computes them; they are deliberately NOT fields of a per-run record.
 */
export const PHASE8_AGGREGATE = [
  "archetype_win_rate", "archetype_crown_stand_rate",
  "axis_scaling", "axis_consistency", "axis_tempo", "axis_spike", "axis_ceiling", "axis_route",
  "gleam_centrality_share", "glad_load_power_share",
  "dominated_archetype_pairs", "power_band_width", "crown_stand_spread",
] as const;

/** The keys a single per-run record must carry (real + honest-zero). The gate validates against this. */
export const PER_RUN_KEYS: readonly string[] = [...PER_RUN_REAL, ...PER_RUN_ZERO];
