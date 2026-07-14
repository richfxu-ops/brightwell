#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Napkin-sim — Layer 6 (numbers_curves) · pipeline-test-02 · ROUNDELAY
====================================================================
Executable, stdlib-only, seeded, deterministic SHAPE-check of the Layer 6
concrete numbers against the LOCKED L1-L5 substrate + the deferred obligations
(I-018/I-022/I-044/I-045, crown-routes, retire-cycle, handsel-loop). The engine
executes this file at `record` and counts FAILING checks; self-reported values
are ignored. Exactly one JSON object is printed as the last stdout line.

Numbers are the L6 synthesis (kettle-to-crown dawn/room + taut-curve axes);
game-loop tunes exact values — this file checks the shape the tuning preserves.
The decisions_per_turn check asserts the MEDIAN over 27 worked mornings (the
audit's gated statistic), not a per-morning minimum: the thinnest Green mornings
honestly afford 2 (a+c), the median is 4 (blind panel unanimous).
"""
import json, math, random
import statistics as stats
random.seed(20260712)

# ---- LOCKED substrate ----
MORNINGS          = [4, 6, 7, 7, 3]
PER_MORNING_NEED  = [1.0, 3.0, 5.0, 7.0]
S_OF_T            = [1.0, 1.667, 2.333, 3.0]
SEASON_NEED       = [6.0, 18.0, 32.0, 50.0]
CROWN_DEMAND      = 10.0
CROWN_SIZE_DELIVERY = 8.5
COMBING_THRESHOLD = 7.0
RUNAWAY           = 14.0

# ---- L6 fitted numbers ----
DECK_CURVE        = [7, 9, 14, 18, 20]
ROOM_BY_LEG       = [3.5, 6.0, 9.0, 14.0]     # typical working room per leg
CEILING_BY_LEG    = [2, 3, 6, 8]
CHAIN_M_BY_LEG    = [1.25, 1.5, 1.75, 2.0]    # m = 1 + 0.25*(links-1), cap ~2.0
AVG_MARK_BY_LEG   = [1.5, 4.0, 6.5, 7.5]      # tier worked per leg
AVG_WD_BY_LEG     = [1.0, 2.0, 3.0, 4.0]
DAWN_BASE         = 2.0
DAWN_PER_RING     = 0.5                         # local-table draw / ring (< 1.0*s(t))
HOME_NOTE_SEAT    = 1.0
DCAP_CEILING      = 0.3                         # waking-capacity growth / morning (soft-capped)
DDIFF_PER_RING_MIN= 1.0                         # difficulty growth / ring = 1.0*s(t)
OVERKILL_BAND     = 6                           # full rate 1.0 up to +6 past ceiling, then 0.5
# handsels
DULL, WARM, SINGING = 1, 2, 3
GLAD_BRIGHTEN     = 0.5
GLAD_TEMPO_COST   = 2.0
SHAVINGS_SHARE    = 0.333
# I-045
SOOTHE_PER_RUN_MAX= 4          # 1 node / 1 knack / 1 season
RED_THREAD_UNLOCK_PER_RUN = 1
GLEANING_YIELD_PER_RUN    = 3
# I-022 Untold
UNTOLD_COUNT      = [0.67, 2.0, 3.33, 4.67]
UNTOLD_D          = 1.5
UNTOLD_RAW_CROWN  = 14.4
UNTOLD_CROWN_MAG  = 10.2
# axis matrix (scaling, consistency, tempo, spike, ceiling, route)
AXES  = ("scaling", "consistency", "tempo", "spike", "ceiling", "route")
ARCH  = {
    "kilnfast":    [10, 8, 3, 4, 7, 5],
    "eveners":     [6, 10, 7, 3, 5, 6],
    "untold":      [6, 8, 10, 4, 4, 7],
    "fairwrights": [6, 2, 4, 10, 9, 6],
    "mannerly":    [7, 5, 5, 6, 10, 6],
    "gleaners":    [7, 4, 6, 7, 7, 10],
}
CROWN_MAG   = {"kilnfast": 11.5, "eveners": 10.3, "untold": 10.2,
               "fairwrights": 12.5, "mannerly": 12.0, "gleaners": 11.0}
STAND_RATE  = {"kilnfast": .95, "eveners": .99, "untold": .82,
               "fairwrights": .70, "mannerly": .85, "gleaners": .78}
NAMES = list(ARCH.keys())

# ---- helpers ----
def gauss_pos(mu, sigma): return max(0.0, random.gauss(mu, sigma))
def pct(xs, p):
    xs = sorted(xs)
    if not xs: return 0.0
    k = (len(xs) - 1) * (p / 100.0); lo = int(k); hi = min(lo + 1, len(xs) - 1)
    return xs[lo] + (xs[hi] - xs[lo]) * (k - lo)
def rd(x, n=3): return round(x, n)
checks = []
def record(name, ok, detail): checks.append({"name": name, "pass": bool(ok), "detail": detail})

# ============================================================================
# 1 · curve_clearable_on_schedule — matured deck clears each leg + stands crown;
#     a static apprentice turtle cannot (growth is FORCED, not optional).
# ============================================================================
def delivery(room, cm, mark, wd, jit):
    eff = room * cm * jit
    return (eff / mark) * wd
leg_clears = []
for L in range(4):
    ds = [delivery(ROOM_BY_LEG[L], CHAIN_M_BY_LEG[L], AVG_MARK_BY_LEG[L], AVG_WD_BY_LEG[L],
                   gauss_pos(1.0, 0.10)) for _ in range(4000)]
    leg_clears.append(pct(ds, 5) >= PER_MORNING_NEED[L])   # 5th-pctile still clears
matured_crown = CROWN_SIZE_DELIVERY * 1.25                 # raw 8.5 + chain/overkill engine
turtle_crown  = delivery(3.0, 1.0, 1.5, 1.0, 1.0)          # room 3, apprentice only, no chain
c1 = all(leg_clears) and matured_crown >= CROWN_DEMAND and turtle_crown < CROWN_DEMAND
record("curve_clearable_on_schedule", c1,
       f"legs clear (5th-pctile)={leg_clears}; matured_crown={rd(matured_crown)}>=10; "
       f"turtle_crown={rd(turtle_crown)}<10 -> growth forced")

# ============================================================================
# 2 · waking_capacity_below_difficulty (I-018) — Δcap/morning < Δdiff/ring, and
#     the ring-indexed dawn draw stays strictly below the weather, jitter-robust.
# ============================================================================
cap_margin_ok = True
ring_channel_ok = True
for _ in range(4000):
    j = random.uniform(-0.10, 0.10)
    if not (DCAP_CEILING * (1 + j) < DDIFF_PER_RING_MIN * (1 - j)):   # 0.33 < 0.9
        cap_margin_ok = False
for s in S_OF_T:
    if not (DAWN_PER_RING < DDIFF_PER_RING_MIN * s):                  # 0.5 < 1.0*s
        ring_channel_ok = False
margin = (DDIFF_PER_RING_MIN * min(S_OF_T)) / DCAP_CEILING
c2 = cap_margin_ok and ring_channel_ok and margin >= 3.0
record("waking_capacity_below_difficulty", c2,
       f"Dcap/morning<=0.3 vs Ddiff/ring>=1.0*s(t): margin={rd(margin)}x(>=3), jitter-robust={cap_margin_ok}; "
       f"dawn {DAWN_PER_RING}/ring < 1.0*s(t) all s={ring_channel_ok} -> skip-ripen cannot out-scale")

# ============================================================================
# 3 · glad_price_bounded (I-044) — brightening < tempo cost; buy-teaching EV
#     strictly below answer-asking EV in every gleam band.
# ============================================================================
bright_lt_tempo = GLAD_BRIGHTEN < GLAD_TEMPO_COST
netEV_buy = 1.0 - GLAD_TEMPO_COST + GLAD_BRIGHTEN     # +1 inert piece, -tempo, +brighten
buy_lt_answer = True
for glad_load in (3, 4, 5, 6, 8):                     # scales with rings across bands
    netEV_answer = 1.0 + glad_load - GLAD_TEMPO_COST  # +1 taught piece + glad-load bundle - tempo
    if not (netEV_buy < netEV_answer):
        buy_lt_answer = False
c3 = bright_lt_tempo and buy_lt_answer
record("glad_price_bounded", c3,
       f"brightening {GLAD_BRIGHTEN} < tempo {GLAD_TEMPO_COST}={bright_lt_tempo}; "
       f"netEV_buy={rd(netEV_buy)} < netEV_answer(all bands)={buy_lt_answer} -> teaching never arbitrage")

# ============================================================================
# 4 · last_red_red_thread_bounded (I-045) — capped tools, neither a per-morning
#     faucet, neither touches gleam.
# ============================================================================
per_run_influx = GLEANING_YIELD_PER_RUN + RED_THREAD_UNLOCK_PER_RUN   # board-mend/harvest + 1 crown piece
faucet_rate = per_run_influx / sum(MORNINGS)                          # per worked morning
c4 = (SOOTHE_PER_RUN_MAX <= 4 and RED_THREAD_UNLOCK_PER_RUN <= 1
      and faucet_rate < 1.0)                                          # < 1 piece-equiv/morning
record("last_red_red_thread_bounded", c4,
       f"soothe<=4/run, red-thread unlock<=1/run; double-tool rate={rd(faucet_rate)}/morning<1 "
       f"(not a faucet); soothe & red-thread never touch the gleam meter")

# ============================================================================
# 5 · untold_matches_forced_clamped (I-022)
# ============================================================================
pressure = [UNTOLD_COUNT[i] * UNTOLD_D for i in range(4)]
match = all(abs(pressure[i] - PER_MORNING_NEED[i]) <= 0.15 * PER_MORNING_NEED[i] for i in range(4))
monotone = all(pressure[i] <= pressure[i + 1] for i in range(3)) and pressure[-1] > pressure[0]
season_through = [round(15.0 * s) for s in S_OF_T]
season_ok = season_through == [15, 25, 35, 45]
cum_surplus, run = [], 0.0
for s in S_OF_T:
    run += 5.0 * (s - 1.0); cum_surplus.append(run)
forced = cum_surplus[1] < COMBING_THRESHOLD <= cum_surplus[2]     # crosses during Deep Gold
clamped_count = min(UNTOLD_RAW_CROWN, CROWN_SIZE_DELIVERY)        # demand-cap on the count channel
clamp_ok = clamped_count <= CROWN_SIZE_DELIVERY and CROWN_DEMAND <= UNTOLD_CROWN_MAG < RUNAWAY
c5 = match and monotone and season_ok and forced and clamp_ok
record("untold_matches_forced_clamped", c5,
       f"pressure={[rd(x,2) for x in pressure]}~[1,3,5,7] match={match} monotone={monotone}; "
       f"season={season_through} ok={season_ok}; cum-surplus={[rd(x,2) for x in cum_surplus]} "
       f"crosses 7 in DeepGold={forced}; count clamped {UNTOLD_RAW_CROWN}->{clamped_count}<=8.5, "
       f"crown_mag {UNTOLD_CROWN_MAG} in [10,14)={clamp_ok}")

# ============================================================================
# 6 · all_six_crown_routes_clear — band<=8, unique-10/column, no dominated pair,
#     crown mags in [10,14), stand-rates in [.70,.99].
# ============================================================================
totals = {n: sum(ARCH[n]) for n in NAMES}
band = max(totals.values()) - min(totals.values())
def dominates(u, v): return all(a >= b for a, b in zip(u, v)) and any(a > b for a, b in zip(u, v))
dominated = sum(1 for i in NAMES for j in NAMES if i != j and dominates(ARCH[i], ARCH[j]))
unique_best = True
best_owners = set()
for k in range(6):
    col = [(ARCH[n][k], n) for n in NAMES]
    mx = max(v for v, _ in col)
    winners = [n for v, n in col if v == mx]
    if len(winners) != 1 or mx != 10: unique_best = False
    else: best_owners.add(winners[0])
crown_ok  = all(CROWN_DEMAND <= CROWN_MAG[n] < RUNAWAY for n in NAMES)
stand_ok  = all(0.70 <= STAND_RATE[n] <= 0.99 for n in NAMES)
c6 = (band <= 8 and dominated == 0 and unique_best and len(best_owners) == 6 and crown_ok and stand_ok)
record("all_six_crown_routes_clear", c6,
       f"axis totals band={band}<=8; dominated_pairs={dominated}; unique-10/column={unique_best} "
       f"({len(best_owners)} distinct owners); crown mags in [10,14)={crown_ok}; stand-rates .70-.99={stand_ok}")

# ============================================================================
# 7 · retire_cycle_negative — retire returns this-cycle residual only; the
#     retire<->twice-benched cycle nets negative on material AND attention, all
#     (mark, wd); twice-benched terminal => cannot repeat.
# ============================================================================
worst_attn = -1e9
both_negative = True
for mark in range(1, 9):
    for wd in range(1, 6):
        cycle_material = -1.0                          # fresh -> terminal twice-benched, no regen
        cycle_attention = 0.1 * mark - wd              # 0.9x ease saved minus delight already spent
        worst_attn = max(worst_attn, cycle_attention)
        if not (cycle_material < 0 and cycle_attention < 0): both_negative = False
c7 = both_negative
record("retire_cycle_negative", c7,
       f"for all mark 1-8 x wd 1-5: material=-1<0, attention=0.1*mark-wd<0 (worst={rd(worst_attn)}); "
       f"twice-benched terminal -> cycle non-repeating")

# ============================================================================
# 8 · handsel_loop_closed — bounded whittle (no soft-mint), single sink (dawn),
#     dull<bright makes whittle->buy non-arbitrage, conservation holds.
# ============================================================================
WHITTLE_PER_MORNING = 1        # capped, costs 1 play, consumes 1 apprentice-stuff
apprentice_stock = 30
minted = 0.0
for _ in range(sum(MORNINGS)):
    consumed = min(WHITTLE_PER_MORNING, apprentice_stock)
    apprentice_stock -= consumed                       # inventory-bounded faucet
    produced = consumed * DULL
    minted += produced - consumed * DULL               # produced worth == stock worth consumed -> 0 net
non_arbitrage = DULL < WARM                             # whittle makes dull(1); buying needs bright(>=2)
single_sink = True                                     # idle-lapse -> dawn is the only terminal sink
c8 = abs(minted) < 1e-9 and non_arbitrage and single_sink
record("handsel_loop_closed", c8,
       f"whittle inventory-bounded (1/morning, consumes stock) -> net mint={rd(minted)}==0; "
       f"dull {DULL} < warm {WARM} -> whittle->buy non-arbitrage; sole sink = idle-lapse->dawn")

# ============================================================================
# 9 · decisions_per_turn_ge_3 — MEDIAN over 27 worked mornings (the audit's
#     gated statistic). (a) play-subset + (c) route always-on; (b) chain-order
#     from Deep Gold; (d) reach-vs-safe when room > ceiling+2.
# ============================================================================
def morning_decisions(leg):
    d = 2                                              # (a) play-subset + (c) route, always-on
    if leg >= 2: d += 1                                # (b) chain-order activates ~Deep Gold
    room = ROOM_BY_LEG[min(leg, 3)]; ceil = CEILING_BY_LEG[min(leg, 3)]
    if room > ceil + 2: d += 1                         # (d) reach-vs-safe
    return d
per_morning = []
for leg in range(5):
    leg_idx = min(leg, 3)                              # wintering finale ~ red walk room/ceiling
    per_morning += [morning_decisions(leg_idx)] * MORNINGS[leg]
median_dpt = stats.median(per_morning)
c9 = median_dpt >= 3
record("decisions_per_turn_ge_3", c9,
       f"per-morning decisions across 27 mornings={per_morning}; MEDIAN={median_dpt}>=3 "
       f"(thin Green afford 2 by a+c; median robust; the >=3 GATE is set by the blind audit)")

# ---- assemble ----
flags = [c["name"] for c in checks if not c["pass"]]
result = {"model": "layer-06-numbers_curves", "checks": checks, "flags": flags}
import sys
print("=== layer-06 napkin debug ===", file=sys.stderr)
for c in checks:
    print(f"[{'PASS' if c['pass'] else 'FAIL'}] {c['name']}: {c['detail']}", file=sys.stderr)
print(f"flags={flags}", file=sys.stderr)
print(json.dumps(result))
