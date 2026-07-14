// metrics.ts — the metrics emitter (engine Phase 7): reduce one run's observations into a per-run
// round_metrics record. Every PER_RUN key (keys.ts) is produced here — real values off the event
// log + final state + leg samples, and honest zeros for the deferred-system keys. Cross-run
// aggregates (win rates, axes, spreads) are NOT here — Phase 8 derives them over the record set.

import { MORNINGS_PER_LEG, WORKED_MORNINGS_TOTAL } from "../engine/state.js";
import { cardOf, type RunObservations } from "./driver.js";

// typed as readonly string[] (not `as const`) so `.indexOf(tier)` accepts a plain string — no cast
const TIER_ORDER: readonly string[] = ["kettle", "plea", "poem", "great", "crown"];
const LEGS = MORNINGS_PER_LEG.length;   // 5

export interface RoundMetricsPerRun {
  archetype: string;
  run_won: boolean;
  run_end_reason: string;
  crown_stood: boolean;
  crown_tier_reached: string;
  standing_zero_season: number | null;
  worked_mornings_total: number;
  decisions_per_turn_median: number;
  decisions_per_turn_min: number;
  deck_size_by_leg: number[];
  deck_size_end: number;
  cards_woken_total: number;
  cards_retired_total: number;
  cards_gifted_total: number;
  combo_activations_per_run: number;
  combo_density_played: number;
  attention_room_peak: number;
  attention_return_to_table: number;
  chain_length_max: number;
  chain_length_median: number;
  overkill_to_gleam_total: number;
  gleam_peak: number;
  gleam_end: number;
  gleam_spilled_total: number;
  paling_rings_accrued: number;
  acquisition_source_shares: { taught: number; fairHandsel: number; fairCourt: number; glean: number };
  fair_drafts_taken: number;
  courtings_landed: number;
  soothe_applications: number;
  last_red_used: number;
  waking_capacity_by_leg: number[];
  difficulty_by_ring: Record<number, number>;
  skip_ripen_margin: number;
  need_fill_clear_rate_by_leg: number[];
  retire_cycle_net: number;
  handsels_whittled_total: number;
  handsels_bright_share: number;
  // --- per-run structural zeros (deferred systems; see keys.ts DEFERRED_REASON) ---
  combing_events: number;
  gleanings_taken: number;
  handsels_idle_lapsed_total: number;
  glad_price_net_ev: number;
  untold_per_leg_count: number;
  untold_pressure_vs_size_ratio: number;
  untold_crown_delivery: number;
}

const num = (v: unknown): number => (typeof v === "number" ? v : 0);

function median(xs: number[]): number {
  if (xs.length === 0) return 0;
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

/** Which leg a 1-based morning falls in, from the season clock. */
function legOfMorning(morning: number): number {
  let acc = 0;
  for (let i = 0; i < LEGS; i++) {
    acc += MORNINGS_PER_LEG[i];
    if (morning <= acc) return i;
  }
  return LEGS - 1;
}

export function collectMetrics(obs: RunObservations): RoundMetricsPerRun {
  const { events, finalState, legSamples, decisionsPerMorning } = obs;
  const dataOf = (type: string): Record<string, unknown>[] =>
    events.filter(e => e.type === type).map(e => e.data ?? {});
  const count = (type: string): number => events.filter(e => e.type === type).length;
  const sum = (type: string, field: string): number =>
    dataOf(type).reduce((s, d) => s + num(d[field]), 0);

  const played = dataOf("played");
  const links = played.map(d => num(d.link));
  const drafted = dataOf("drafted");
  // a combo activation: a combo card played into a chain (link ≥ 2) — computed once, used twice below
  const comboActivations = played.filter(d =>
    num(d.link) >= 2 && cardOf(String(d.piece).split("#")[0]).combo === true).length;
  const fulfilledTiers = dataOf("fulfilled").map(d => String(d.tier));
  const maxTierIdx = fulfilledTiers.reduce((m, t) => Math.max(m, TIER_ORDER.indexOf(t)), -1);

  // acquisition source counts → shares of total deck-growth events
  const taught = count("taught");
  const fairHandsel = drafted.filter(d => d.cost === "handsel").length;
  const fairCourt = drafted.filter(d => d.cost === "court").length;
  const glean = 0;   // deferred (no gleaning system)
  const acqTotal = taught + fairHandsel + fairCourt + glean;
  const share = (n: number): number => (acqTotal > 0 ? n / acqTotal : 0);

  // per-leg means over the per-morning samples
  const byLegMean = (pick: (s: (typeof legSamples)[number]) => number): number[] => {
    const total = Array<number>(LEGS).fill(0);
    const n = Array<number>(LEGS).fill(0);
    for (const s of legSamples) { total[s.leg] += pick(s); n[s.leg] += 1; }
    return total.map((v, i) => (n[i] > 0 ? v / n[i] : 0));
  };

  // difficulty (asking demand) grouped by the node's ring count
  const ringAgg = new Map<number, { sum: number; n: number }>();
  for (const s of legSamples) {
    const a = ringAgg.get(s.rings) ?? { sum: 0, n: 0 };
    a.sum += s.difficulty; a.n += 1; ringAgg.set(s.rings, a);
  }
  const difficulty_by_ring: Record<number, number> = {};
  for (const [rings, a] of ringAgg) difficulty_by_ring[rings] = a.sum / a.n;

  // need-fill clear rate by leg: fulfils / askings accepted, per leg
  const acceptedByLeg = Array<number>(LEGS).fill(0);
  const clearedByLeg = Array<number>(LEGS).fill(0);
  for (const d of dataOf("accepted")) acceptedByLeg[num(d.leg)] += 1;
  for (const e of events.filter(e => e.type === "fulfilled")) clearedByLeg[legOfMorning(e.morning)] += 1;

  const first = legSamples[0];
  const last = legSamples[legSamples.length - 1];
  const skip_ripen_margin = first && last
    ? (last.wakingCapacity - first.wakingCapacity) - (last.difficulty - first.difficulty)
    : 0;

  const purse = finalState.player.handsels;
  const end = finalState.runEnded;

  return {
    archetype: obs.archetype,
    run_won: end?.reason === "won",
    run_end_reason: end?.reason ?? "unended",
    crown_stood: finalState.crownStood,
    crown_tier_reached: finalState.crownStood ? "crown" : maxTierIdx >= 0 ? TIER_ORDER[maxTierIdx] : "none",
    standing_zero_season: end?.reason === "quiet-walk" ? finalState.calendar.leg : null,
    worked_mornings_total: Math.min(finalState.calendar.morning, WORKED_MORNINGS_TOTAL),
    decisions_per_turn_median: median(decisionsPerMorning),
    decisions_per_turn_min: decisionsPerMorning.length ? Math.min(...decisionsPerMorning) : 0,
    deck_size_by_leg: byLegMean(s => s.deckSize),
    deck_size_end: finalState.pieces.length,
    cards_woken_total: count("woke"),
    cards_retired_total: count("retired") + count("released"),   // both remove a card from the run
    cards_gifted_total: taught,
    combo_activations_per_run: comboActivations,
    combo_density_played: played.length ? comboActivations / played.length : 0,
    attention_room_peak: Math.max(0, ...dataOf("dawn").map(d => num(d.room))),
    attention_return_to_table: sum("dusk", "sweep"),
    chain_length_max: links.length ? Math.max(...links) : 0,
    chain_length_median: median(links),
    overkill_to_gleam_total: sum("gleam", "amount"),
    gleam_peak: finalState.player.peakGleam,
    gleam_end: finalState.player.gleam,
    gleam_spilled_total: sum("spilled", "amount"),
    paling_rings_accrued: dataOf("spilled").filter(d => d.reason === "stale asking").length,
    acquisition_source_shares: {
      taught: share(taught), fairHandsel: share(fairHandsel), fairCourt: share(fairCourt), glean: share(glean),
    },
    fair_drafts_taken: drafted.length,
    courtings_landed: fairCourt + count("courted"),
    soothe_applications: count("soothed"),
    last_red_used: count("soothed"),   // each soothe consumes one last-red catalyst (effects.ts)
    waking_capacity_by_leg: byLegMean(s => s.wakingCapacity),
    difficulty_by_ring,
    skip_ripen_margin,
    need_fill_clear_rate_by_leg: clearedByLeg.map((c, i) => (acceptedByLeg[i] > 0 ? c / acceptedByLeg[i] : 0)),
    retire_cycle_net: sum("retired", "worth"),
    handsels_whittled_total: count("whittled"),
    handsels_bright_share: purse.length ? purse.filter(h => h.brightness >= 2).length / purse.length : 0,
    combing_events: 0,
    gleanings_taken: 0,
    handsels_idle_lapsed_total: 0,
    glad_price_net_ev: 0,
    untold_per_leg_count: 0,
    untold_pressure_vs_size_ratio: 0,
    untold_crown_delivery: 0,
  };
}
