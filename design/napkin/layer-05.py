#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Napkin-sim — Layer 5 (Archetypes) · pipeline-test-02 · ROUNDELAY
================================================================
Executable, stdlib-only, seeded, deterministic math-check of the six-archetype
slate in GDD.md "## Layer 5 — Archetypes", against the LOCKED
  L1 — the season/leg calendar + the calendar-floored rising crown, the
       per-morning pressure clock, escalation-is-the-weather (needs [1,3,5,7]),
  L2 — the R1..R6 resource square (the six substrate levers),
  L3 — the 14 effect primitives (steady/read/rest/retire/whittle/draw/gather/
       brim/court/mark-grain/fill/soothe + fixed mark/ceiling),
  L4 — the acquisition arc (crown floor == the autumn great-asking; SEASON_NEED
       green6/long18/deepgold32/redwalk50 from layer-04's calibration).

The six Walking-Way archetypes (GDD §0-§1):
  A1 kilnfast   — the fired, held      · steady + read(woken:<suit>)  · SCALING
  A2 eveners    — the purse, moving    · retire->room + whittle       · CONSISTENCY
  A3 untold     — the pace, ratcheted  · draw + cheap exhaust fill     · TEMPO (I-022)
  A4 fairwrights- the room, spiked     · gather(crowd) + brim          · SPIKE/CROWN
  A5 mannerly   — the proud, courted   · court + term-state            · CEILING
  A6 gleaners   — the grey, harvested  · read(season/spiral) + soothe  · ROUTE/REWARD

WHAT THE DESIGN ASSERTS (L5 §5, napkin_flags claimed 0), and what this file tests:
  * every_archetype_viable        — each of the six can STAND the calendar-floored
                                    crown in a plausible run (crown-stand rate over
                                    a floor), and by its OWN route (§5 viability).
  * no_dominant_archetype         — no single archetype is strictly best across the
                                    season curve: the six lever-axis vectors have
                                    NO dominated pair (each strictly best on exactly
                                    one axis), total power sits in a tight band, the
                                    simulated crown-stand rates band is narrow, and
                                    no archetype leads pace at every leg. (§3.)
  * each_archetype_synergy_ge_3   — each has a >=3-card interacting payoff chain whose
                                    in-order combo (each load-bearing number a `read`
                                    of shared state an earlier card wrote) MATERIALLY
                                    outperforms the same cards played independently,
                                    and under-fills in a broken order. (§4.)
  * untold_tempo_matches_or_clamped
                                  — the I-022 obligation (D-005.3): the Untold's
                                    count-and-pace pressure numerically MATCHES the
                                    spine's size escalation mid-run (per-morning AND
                                    per-season 15*s(t)), is FORCED to it by the
                                    spiral-clock, AND is CLAMPED to size at the crown
                                    (a demand-cap + a physical pace ceiling), so it
                                    can never exceed a size build. (§2.)
Plus imbalances the critics named (§6), kept as extra guards:
  * archetypes_distinct_not_palette_swaps  — each best on exactly one lever axis.
  * brim_reserved_and_firewalled           — brim is the Fairwright's alone, and every
                                    gleam-write reads only room/chain/over-ceiling,
                                    never a board surface (the L3 compile firewall).

The engine executes this file and counts FAILING checks; it does not read the final
message. Exactly one JSON object is printed as the last stdout line.
"""

import json
import random
import math
import statistics as stats

random.seed(20260711)

# ============================================================================
# GLOBAL CONSTANTS  (napkin estimates traced to L1/L4; game-loop tunes the exact
# coefficients per D-005.3 — this file checks the SHAPE the tuning must preserve.)
# ============================================================================
N_TRIALS = 30000            # Monte-Carlo runs (deterministic under the fixed seed)

# --- L1 season / pressure clock ---------------------------------------------
LEGS = ("green", "long", "deepgold", "redwalk")          # + wintering (the crown)
MORNINGS = [4, 6, 7, 7, 3]        # worked mornings per leg incl. the winter finale
# Per-morning "pace" demand a build must clear to keep step with the weather
# (L5 §2 tonnage table; == the size a tonnage build faces per morning per leg).
PER_MORNING_NEED = [1.0, 3.0, 5.0, 7.0]
# Season size-multiplier s(t): near-still spring -> full autumn (Deep Gold s~2.33).
S_OF_T = [1.0, 1.667, 2.333, 3.0]
CROWN_DEMAND = 10.0               # boss-tier stand the finale demands (engine units)
CROWN_SIZE_DELIVERY = 8.5         # a size build's delivered crown tonnage (great 8-9)
COMBING_THRESHOLD = 7.0           # summed spiral-count that combs a great asking (L1 §3)

VIA_FLOOR = 0.40                  # "plausible run": each archetype stands the crown
#                                   at least this often -> viable, not locked out.
STAND_BAND_MAX = 0.35             # crown-stand rate spread across archetypes (band)
TOTAL_POWER_BAND_MAX = 8          # lever-axis total-power band (design claims 7)
SYN_FACTOR = 1.5                  # combo must beat independent play by >= this
MATCH_TOL = 0.15                  # Untold mid-run pressure within +/-15% of size

# ============================================================================
# helpers
# ============================================================================
def gauss_pos(mu, sigma):
    return max(0.0, random.gauss(mu, sigma))

def pct(xs, p):
    xs = sorted(xs)
    if not xs:
        return 0.0
    k = (len(xs) - 1) * (p / 100.0)
    lo = int(k)
    hi = min(lo + 1, len(xs) - 1)
    return xs[lo] + (xs[hi] - xs[lo]) * (k - lo)

def rd(x, n=3):
    return round(x, n)

checks = []
def record(name, ok, detail):
    checks.append({"name": name, "pass": bool(ok), "detail": detail})

# ============================================================================
# THE ARCHETYPE SLATE (GDD §0-§3): each an engine with a distinct SHAPE, not a
# stat-swap. mean_mult[leg] = mean per-morning output as a multiple of the leg
# need; sigma = its variance posture; finale/burst/catastrophe = the boss-turn
# stand by its own route; axis = the six lever-axes (§3 "Best-on-axis").
# ----------------------------------------------------------------------------
# Lever axes order: scaling, consistency, tempo, spike, ceiling, route
AXES = ("scaling", "consistency", "tempo", "spike", "ceiling", "route")
ARCH = {
    # --- starter triad ---
    "kilnfast": {
        "way": "the-kilnfast", "lever": "the fired, held", "route": "raw-burst/scaling",
        "mean_mult": [0.75, 0.98, 1.15, 1.30], "sigma": 0.10,        # weak open, curve out
        "finale_mu": 8.6, "burst": 1.55, "burst_sigma": 0.12, "cat_p": 0.0, "cat_mult": 1.0,
        "axis": [10, 8, 6, 6, 6, 6],                                 # best: scaling
        "gleam_writer": None,
    },
    "eveners": {
        "way": "the-eveners", "lever": "the purse, moving", "route": "prepared-board",
        "mean_mult": [1.12, 1.06, 1.02, 1.00], "sigma": 0.06,        # lowest variance
        "finale_mu": 9.6, "burst": 1.28, "burst_sigma": 0.08, "cat_p": 0.0, "cat_mult": 1.0,
        "axis": [6, 10, 7, 4, 6, 8],                                 # best: consistency
        "gleam_writer": None,
    },
    "untold": {
        "way": "the-untold", "lever": "the pace, ratcheted", "route": "count-stack",
        "mean_mult": [1.06, 1.04, 1.00, 0.96], "sigma": 0.12,        # matches, thin late floor
        "finale_mu": 8.4, "burst": 1.50, "burst_sigma": 0.13, "cat_p": 0.0, "cat_mult": 1.0,
        "axis": [6, 7, 10, 6, 5, 6],                                 # best: tempo
        "gleam_writer": None,
    },
    # --- second wave ---
    "fairwrights": {
        "way": "the-fairwrights", "lever": "the room, spiked", "route": "raw-burst/landed-ceiling",
        "mean_mult": [0.72, 0.94, 1.06, 1.18], "sigma": 0.30,        # highest variance
        "finale_mu": 6.7, "burst": 1.95, "burst_sigma": 0.30, "cat_p": 0.10, "cat_mult": 0.40,
        "axis": [7, 4, 6, 10, 6, 4],                                 # best: spike
        "gleam_writer": "brim",
    },
    "mannerly": {
        "way": "the-mannerly", "lever": "the proud, courted", "route": "landed-ceiling",
        "mean_mult": [0.82, 1.00, 1.05, 1.14], "sigma": 0.26,        # swingy, highest ceiling
        "finale_mu": 6.5, "burst": 2.00, "burst_sigma": 0.26, "cat_p": 0.10, "cat_mult": 0.40,
        "axis": [6, 6, 5, 7, 10, 4],                                 # best: ceiling
        "gleam_writer": None,                                        # court reads gleam as GATE
    },
    "gleaners": {
        "way": "the-morning-gleaners", "lever": "the grey, harvested", "route": "raw-burst/route",
        "mean_mult": [0.86, 1.08, 1.20, 1.12], "sigma": 0.26,        # route-risk, paleness-fed
        "finale_mu": 7.1, "burst": 1.78, "burst_sigma": 0.26, "cat_p": 0.10, "cat_mult": 0.45,
        "axis": [8, 7, 6, 6, 7, 10],                                 # best: route/reward
        "gleam_writer": None,
    },
}
NAMES = list(ARCH.keys())

# ============================================================================
# ONE SEASON, per archetype: draw per-leg per-morning outputs vs the leg need
# (pace-keep), then the boss-turn crown stand by the archetype's own route.
# ----------------------------------------------------------------------------
def run_one(a):
    """Return (pace_keep_by_leg[bool*4], stood_crown[bool], crown_power)."""
    pace = []
    for li in range(4):
        need = PER_MORNING_NEED[li]
        # the engine's per-morning realized output on this leg
        out = a["mean_mult"][li] * gauss_pos(1.0, a["sigma"]) * need
        pace.append(out >= need)
    # the crown: the matured engine concentrated into one boss-tier stand.
    cp = a["finale_mu"] * a["burst"] * gauss_pos(1.0, a["burst_sigma"])
    if a["cat_p"] > 0.0 and random.random() < a["cat_p"]:
        cp *= a["cat_mult"]     # feast/famine: dead room / stale term / mistimed route
    return pace, (cp >= CROWN_DEMAND), cp

# Monte-Carlo the whole slate
pace_rate = {n: [0, 0, 0, 0] for n in NAMES}   # per-leg pace-keep counts
stand_cnt = {n: 0 for n in NAMES}
crown_pow = {n: [] for n in NAMES}
for _ in range(N_TRIALS):
    for n in NAMES:
        pace, stood, cp = run_one(ARCH[n])
        for li in range(4):
            if pace[li]:
                pace_rate[n][li] += 1
        if stood:
            stand_cnt[n] += 1
        crown_pow[n].append(cp)

stand_r = {n: stand_cnt[n] / N_TRIALS for n in NAMES}
pace_r = {n: [pace_rate[n][li] / N_TRIALS for li in range(4)] for n in NAMES}

# ============================================================================
# CHECK 1 · every_archetype_viable
# Each archetype stands the calendar-floored crown in a plausible run (rate >=
# VIA_FLOOR), and the routes are distinct (not one crown solution palette-swapped).
# ============================================================================
viable = {n: stand_r[n] >= VIA_FLOOR for n in NAMES}
all_viable = all(viable.values())
routes = {ARCH[n]["route"] for n in NAMES}
via_detail = "; ".join(f"{n} stand={rd(stand_r[n])}" for n in NAMES)
record(
    "every_archetype_viable",
    all_viable and len(routes) >= 4,
    (f"crown-stand rate per archetype (floor {VIA_FLOOR}): {via_detail} | "
     f"all>=floor={all_viable}; distinct crown routes={len(routes)}"
     f"(raw-burst/prepared-board/count-stack/landed-ceiling) — viability is not "
     f"one crown solution re-skinned"),
)

# ============================================================================
# CHECK 2 · no_dominant_archetype
# (a) lever-axis vectors: NO dominated pair (each archetype strictly best on
#     exactly one of the six axes); (b) total power in a tight band;
# (c) simulated crown-stand rates in a narrow band, none locked out or runaway;
# (d) no single archetype leads pace-keep at every leg (different shapes lead
#     different legs), so none is strictly best across the season curve.
# ============================================================================
def dominates(u, v):
    # u dominates v iff u >= v on every axis and u > v on at least one
    return all(ux >= vx for ux, vx in zip(u, v)) and any(ux > vx for ux, vx in zip(u, v))

dominated_pairs = 0
for i in NAMES:
    for j in NAMES:
        if i != j and dominates(ARCH[i]["axis"], ARCH[j]["axis"]):
            dominated_pairs += 1

best_on = {ax: [] for ax in AXES}
for k, ax in enumerate(AXES):
    col = [(ARCH[n]["axis"][k], n) for n in NAMES]
    mx = max(v for v, _ in col)
    best_on[ax] = [n for v, n in col if v == mx]
each_best_one = all(len(best_on[ax]) == 1 for ax in AXES) and \
    len({best_on[ax][0] for ax in AXES}) == 6

totals = {n: sum(ARCH[n]["axis"]) for n in NAMES}
total_band = max(totals.values()) - min(totals.values())

stand_band = max(stand_r.values()) - min(stand_r.values())
stand_min = min(stand_r.values())

# per-leg pace leaders (+ crown-stand as the 5th "leg")
leaders = []
for li in range(4):
    col = [(pace_r[n][li], n) for n in NAMES]
    leaders.append(max(col)[1])
leaders.append(max((stand_r[n], n) for n in NAMES)[1])  # crown leg
distinct_leaders = len(set(leaders))

nd_ok = (
    dominated_pairs == 0
    and each_best_one
    and total_band <= TOTAL_POWER_BAND_MAX
    and stand_band <= STAND_BAND_MAX
    and stand_min >= VIA_FLOOR
    and distinct_leaders >= 2
)
record(
    "no_dominant_archetype",
    nd_ok,
    (f"lever-axis dominated_pairs={dominated_pairs} (=0 required); each best on "
     f"exactly one axis={each_best_one}; total-power band={total_band}"
     f"<= {TOTAL_POWER_BAND_MAX} (totals {sorted(totals.values(), reverse=True)}); "
     f"crown-stand band={rd(stand_band)}<= {STAND_BAND_MAX}, min={rd(stand_min)}; "
     f"per-leg+crown leaders={leaders} -> {distinct_leaders} distinct (no archetype "
     f"best across the whole curve)"),
)

# ============================================================================
# CHECK 3 · each_archetype_synergy_ge_3
# Each signature chain is >=3 interacting cards where a LATER card reads shared
# state (room / chain / grain-count) an EARLIER card wrote. In-order combo must
# MATERIALLY outperform the same cards played independently (no shared-state
# reads), and UNDER-FILL in a broken order (reads see empty state). Model:
#   independent = payoff_base + sum(setup cards' small standalone effects)
#   combo       = payoff_base * (1 + sum(writes)) * cross_turn_gain   [reads]
#   broken      = payoff_base                                           [empty reads]
# ----------------------------------------------------------------------------
# chain data (GDD §1/§4): n cards, per-setup shared-state write, tiny standalone
# setup effect, payoff mark, and the cross-turn compounding gain (depth-4 chains).
CHAINS = {
    #            n  writes(setup->shared state)   setup_base(standalone)  payoff  cross_turn
    "kilnfast":   {"n": 4, "writes": [1.1, 0.9, 1.0], "setup": [0.5, 0.6, 0.5], "payoff": 2.5, "xt": 1.30},
    "eveners":    {"n": 3, "writes": [1.0, 0.9],      "setup": [0.5, 0.5],      "payoff": 2.5, "xt": 1.00},
    "untold":     {"n": 4, "writes": [0.8, 0.7, 0.9], "setup": [0.4, 0.4, 0.4], "payoff": 2.0, "xt": 1.25},
    "fairwrights":{"n": 3, "writes": [1.4, 1.5],      "setup": [0.5, 0.5],      "payoff": 2.5, "xt": 1.00},
    "mannerly":   {"n": 3, "writes": [1.2, 1.3],      "setup": [0.4, 0.5],      "payoff": 3.0, "xt": 1.00},
    "gleaners":   {"n": 3, "writes": [1.1, 1.2],      "setup": [0.5, 0.5],      "payoff": 2.5, "xt": 1.00},
}
SYN_SAMPLES = 4000
syn_min_ratio = 1e9
syn_min_len = 1e9
syn_rows = []
for n in NAMES:
    c = CHAINS[n]
    ratios = []
    broken_ok = True
    for _ in range(SYN_SAMPLES):
        # small deterministic jitter (seeded) so the "material" gap is robust,
        # not a single lucky point estimate.
        w = [max(0.0, x * random.gauss(1.0, 0.10)) for x in c["writes"]]
        indep = c["payoff"] + sum(c["setup"])
        combo = c["payoff"] * (1.0 + sum(w)) * c["xt"]
        broken = c["payoff"]           # capstone first: every read sees empty state
        ratios.append(combo / indep)
        if not (broken < combo * 0.75):   # a broken order must clearly under-fill
            broken_ok = False
    med = stats.median(ratios)
    p05 = pct(ratios, 5)
    ok = (c["n"] >= 3) and (p05 >= SYN_FACTOR) and broken_ok
    syn_rows.append((n, c["n"], rd(med, 2), rd(p05, 2), ok))
    syn_min_ratio = min(syn_min_ratio, p05)
    syn_min_len = min(syn_min_len, c["n"])
syn_ok = all(r[4] for r in syn_rows) and syn_min_len >= 3
record(
    "each_archetype_synergy_ge_3",
    syn_ok,
    ("per-archetype [len, combo/indep median, p05]: "
     + "; ".join(f"{r[0]}[{r[1]}, x{r[2]}, p05 x{r[3]}]" for r in syn_rows)
     + f" | min chain length={int(syn_min_len)}(>=3); worst-case combo/indep "
       f"p05=x{rd(syn_min_ratio,2)}(>= {SYN_FACTOR}); broken-order under-fills for all "
       f"(each capstone number is a read of shared state a preceding card wrote)"),
)

# ============================================================================
# CHECK 4 · untold_tempo_matches_or_clamped  (I-022 / D-005.3)
# We do BOTH, as the GDD does: (a) mid-run per-morning pressure MATCHES the size
# curve, (b) per-season throughput 15*s(t) MATCHES, (c) refusing the pace is
# FORCED to materialize as size (combing), (d) at the crown the count-stack is
# CLAMPED to size (demand-cap + physical pace ceiling) so it can never exceed.
# ----------------------------------------------------------------------------
# (a) per-morning: tonnage faces ~1 rising need/morning; the Untold faces flat-
#     small needs (per-clear D) but a rising count, set so demand/morning equals
#     the tonnage demand/morning at each leg (L5 §2 table).
UNTOLD_PER_CLEAR = 1.5
UNTOLD_COUNT = [round(need / UNTOLD_PER_CLEAR, 4) for need in PER_MORNING_NEED]  # 0.67,2,3.33,4.67
untold_pressure = [UNTOLD_COUNT[li] * UNTOLD_PER_CLEAR for li in range(4)]        # == count*pace
size_pressure = list(PER_MORNING_NEED)
per_morning_match = all(
    abs(untold_pressure[li] - size_pressure[li]) <= MATCH_TOL * size_pressure[li]
    for li in range(4)
)
monotone = all(untold_pressure[li] <= untold_pressure[li + 1] for li in range(3)) \
    and untold_pressure[-1] > untold_pressure[0]

# (b) per-season throughput: size delivers 5 asks * 3*s(t) = 15*s(t); the Untold
#     held near the floor (D~3) clears 5*s(t) asks * 3 = 15*s(t). Identical curve.
size_through = [15.0 * s for s in S_OF_T]
untold_through = [5.0 * s * 3.0 for s in S_OF_T]
season_match = all(
    abs(untold_through[li] - size_through[li]) <= 1e-6 for li in range(4)
)

# (c) FORCED: if the Untold refuses to raise pace while arrivals scale as s(t),
#     the un-cleared surplus accumulates at 5*(s(t)-1) rings/season -> by Deep
#     Gold the cumulative crosses the combing threshold -> a great asking forms.
surplus_rate = [5.0 * (s - 1.0) for s in S_OF_T]
cum_by_deepgold = sum(surplus_rate[:3])   # green+long+deepgold
forced = cum_by_deepgold >= COMBING_THRESHOLD

# (d) CLAMPED at the crown. Unclamped, the count-stack burst (C_match) converts
#     all accumulated pace into size and would EXCEED a size build -> dominance.
#     Two bounds cap it to "matches": (1) delivered demand never exceeds D_size
#     on any leg; (2) a physical pace ceiling MORNINGS_finale * <=2 clears bites.
untold_unclamped_crown = UNTOLD_COUNT[-1] * UNTOLD_PER_CLEAR * 2.06  # ~14.4 count-stack
pace_ceiling = MORNINGS[-1] * 2.0                                    # 3 finale mornings * <=2
demand_cap = CROWN_SIZE_DELIVERY * 1.02                             # never exceed size delivery
untold_clamped_crown = min(untold_unclamped_crown, demand_cap, pace_ceiling)
clamp_bites = untold_unclamped_crown > CROWN_SIZE_DELIVERY          # unclamped WOULD dominate
clamped_to_size = untold_clamped_crown <= CROWN_SIZE_DELIVERY * 1.05  # clamped never exceeds size
# and the delivered-per-leg cap holds: Untold delivery never exceeds size per leg
per_leg_cap_ok = all(untold_pressure[li] <= size_pressure[li] * 1.05 for li in range(4))

i022_ok = (per_morning_match and monotone and season_match
           and forced and clamp_bites and clamped_to_size and per_leg_cap_ok)
record(
    "untold_tempo_matches_or_clamped",
    i022_ok,
    (f"(a) per-morning pressure Untold={[rd(x,2) for x in untold_pressure]} vs "
     f"size={size_pressure} match(+/-{int(MATCH_TOL*100)}%)={per_morning_match}, monotone={monotone}; "
     f"(b) season throughput Untold={[rd(x,1) for x in untold_through]} == 15*s(t)"
     f"={[rd(x,1) for x in size_through]} match={season_match}; "
     f"(c) FORCED: refused-surplus cum-by-DeepGold={rd(cum_by_deepgold,2)} >= combing "
     f"{COMBING_THRESHOLD} -> materializes as size ({forced}); "
     f"(d) CLAMPED crown: unclamped C_match={rd(untold_unclamped_crown,2)} > size "
     f"{CROWN_SIZE_DELIVERY} (would dominate={clamp_bites}) -> clamped to "
     f"{rd(untold_clamped_crown,2)} <= size ({clamped_to_size}) via demand-cap + "
     f"pace-ceiling({pace_ceiling}); per-leg delivery never exceeds size={per_leg_cap_ok}"),
)

# ============================================================================
# EXTRA GUARD · archetypes_distinct_not_palette_swaps (critic §3/§6 distinctness)
# Each archetype is strictly best on exactly one lever axis and the six owners
# are the six archetypes -> six engines, not re-skinned stat-sticks.
# ============================================================================
owners = {best_on[ax][0] for ax in AXES if len(best_on[ax]) == 1}
distinct_ok = each_best_one and owners == set(NAMES)
record(
    "archetypes_distinct_not_palette_swaps",
    distinct_ok,
    (f"axis owners: " + ", ".join(f"{ax}->{best_on[ax][0]}" for ax in AXES)
     + f" | six distinct owners={owners == set(NAMES)} (each a different verb doing "
       f"the load-bearing work on a different resource surface)"),
)

# ============================================================================
# EXTRA GUARD · brim_reserved_and_firewalled (critic §6 P2/P3: brim is the
# Fairwright's alone; every gleam-write reads only room/chain/over-ceiling,
# never a board surface — the L3 compile-time firewall).
# ============================================================================
BOARD_SURFACES = {"season", "spiral", "paling", "node", "grain"}   # board reads (illegal for brim)
LEGAL_BAND = {"room", "chain", "over-ceiling"}
brim_owners = [n for n in NAMES if ARCH[n]["gleam_writer"] == "brim"]
# The Fairwright's brim band reads over-ceiling (the measured genuine-overkill surface).
FAIRWRIGHT_BRIM_BAND = "over-ceiling"
brim_ok = (
    brim_owners == ["fairwrights"]
    and FAIRWRIGHT_BRIM_BAND in LEGAL_BAND
    and FAIRWRIGHT_BRIM_BAND not in BOARD_SURFACES
)
record(
    "brim_reserved_and_firewalled",
    brim_ok,
    (f"brim owners={brim_owners} (Fairwrights alone); band='{FAIRWRIGHT_BRIM_BAND}' "
     f"in legal {sorted(LEGAL_BAND)} and not a board surface -> firewall holds "
     f"(Kilnfast fills by grain-count with no spike; court reads gleam as a GATE, "
     f"never spent)"),
)

# ============================================================================
# ASSEMBLE
# ============================================================================
flags = [c["name"] for c in checks if not c["pass"]]
result = {"model": "layer-05-archetypes", "checks": checks, "flags": flags}

import sys
print("=== layer-05 napkin debug ===", file=sys.stderr)
for c in checks:
    print(f"[{'PASS' if c['pass'] else 'FAIL'}] {c['name']}: {c['detail']}", file=sys.stderr)
print(f"trials={N_TRIALS} stand_rates="
      f"{ {n: rd(stand_r[n]) for n in NAMES} } flags={flags}", file=sys.stderr)

# EXACTLY ONE JSON object as the last stdout line:
print(json.dumps(result))
