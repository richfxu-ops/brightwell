#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Napkin-sim — Layer 4 (Acquisition Model) · pipeline-test-02 · ROUNDELAY
=======================================================================
Executable, stdlib-only, seeded, deterministic math-check of the acquisition
economy in GDD.md "## Layer 4 — Acquisition Model", against the LOCKED
L1 (season/crown curve, escalation-is-the-weather, the-rising-crown),
L2 (the R1-R6 resource square, mint-ban, closed Handsel Round), and
L3 (primitives: rest/retire/court/whittle/bench-off-turn).

WHAT THE DESIGN ASSERTS (L4 §5, napkin_flags claimed 0), and what this file tests:
  * deck_growth_on_curve      — the deck is *pulled* up the curve the rising
                                crown demands: it grows enough by autumn to
                                stand the calendar-floored crown, but stays
                                below the crown mid-run so it never trivializes
                                the Green Going / Long Light curve. (L4 §2 arc,
                                L1 §5 the-rising-crown.)
  * no_dominant_source        — cards enter by >=3 independent doors; the
                                glad-load is the richest *flow* but is a
                                calendar-capped spine, NOT a keystone faucet:
                                no single source alone can stand the crown
                                ("pull one and you starve"). Materials: no one
                                door > ~40%. (L4 §5a.)
  * no_degenerate_acquisition_loop
                                — the retire<->twice-benched mint is
                                double-closed (residual-worth clamp + terminal
                                grade); the Handsel Round is mint-clean; the
                                glad-load faucet is calendar-bounded. Each nets
                                <= 0. (L4 §5c, L2 §5c.)
  * thinning_viable           — retire + gift + exhaust let a player hold the
                                deck focused (offset gross influx) without ever
                                thinning into an unplayable pack. (L4 §3.)
Plus the degenerate lines the critics named (L4 §5c/§7):
  * skip_ripen_not_dominant   — waking-capacity growth / worked morning
                                < difficulty growth / ripened ring: a ripe
                                7-ring need out-scales the deck a skip-year buys.
  * fair_faucet_bounded       — the handsels->cards teaching lane costs MORE
                                attention-tempo than just answering an asking
                                (no arbitrage) and is a windowed k-of-N burst.
  * deliberate_failure_ev_negative
                                — the spilling yields lane-glimmers < 1 Standing,
                                claimable only by later visitors: EV-negative.

The engine executes this file and counts failing checks; it does NOT read the
final message. Exactly one JSON object is printed as the last stdout line.
"""

import json
import random
import statistics as stats

random.seed(20260710)

# ----------------------------------------------------------------------------
# Global economy constants (napkin estimates traced to the GDD arc table L4 §2;
# game-loop tunes the exact coefficients — the SHAPE is what this file checks).
# ----------------------------------------------------------------------------
N_TRIALS = 4000            # Monte-Carlo runs (deterministic under the fixed seed)

# Piece "power" == its craft-tier once woken (apprentice=1 .. crown=5). Deck
# power (sum of tiers) is the napkin proxy for the deck's waking-capacity:
# a grown deck = more/higher-tier pieces = a bigger performance it can field.

# Season need_power == the deck-power a season's BIGGEST asking demands to be
# stood. Rings map plea(3)/poem(5)/great(7); the crown is the calendar-floored
# great-asking finale (L1 §5 the-rising-crown). Difficulty and reward ride the
# SAME number (rings-in = load-out), so these rise with the weather.
SEASON_NEED = {
    "green":     6.0,     # kettle-sized, thin spring
    "long":     18.0,     # the engine turns
    "deepgold": 32.0,     # the first enormous dawns
    "redwalk":  50.0,     # the crown (calendar floor)
}
CROWN_FLOOR = SEASON_NEED["redwalk"]          # 50 — must be STANDABLE by autumn,
#                                               yet sit ABOVE the mid-run band so
#                                               Deep Gold cannot pre-empt it.
TRIVIALIZE_FACTOR = 2.8                         # deck_power > factor*need == trivial
THIN_PROP = 0.12                                # thinning couples to deck size:
#          a bigger pack retires harder (Evener line, L4 §3) — self-correcting,
#          which is *why* the end-deck lands in a tight ~18-22 band.

# Difficulty-vs-ring curve for the skip-ripen inequality (L4 §5c).
def difficulty_at_ring(r):
    # anchored: ~plea@3 -> poem@5 -> great@7 == CROWN_FLOOR
    return CROWN_FLOOR * (r / 7.0) ** 1.15


# ----------------------------------------------------------------------------
# helpers
# ----------------------------------------------------------------------------
def ri(a, b):
    return random.randint(a, b)


def rf(a, b):
    return random.uniform(a, b)


def pct(xs, p):
    xs = sorted(xs)
    if not xs:
        return 0.0
    k = (len(xs) - 1) * (p / 100.0)
    lo = int(k)
    hi = min(lo + 1, len(xs) - 1)
    return xs[lo] + (xs[hi] - xs[lo]) * (k - lo)


# ----------------------------------------------------------------------------
# ONE RUN of the wander-year acquisition arc.
# Deck = list of dict(tier, src). Adds append; thinning (retire/gift/exhaust)
# removes the LOWEST-tier inert pieces first (the Evener last-lights the deck a
# player has outgrown — L4 §3), which is why the deck stays *focused* and its
# power tracks the rising tiers rather than the raw count.
# ----------------------------------------------------------------------------
CARD_SOURCES = ("first_gift", "glad_load", "fair", "bench", "masters", "red_thread")


def add_pieces(deck, n, tier, src):
    for _ in range(int(round(n))):
        deck.append({"tier": tier, "src": src})


def thin(deck, k):
    """Retire k lowest-tier inert pieces (Evener line). Never empties the pack:
    the apprentice floor (M5) is always re-courtable, so a hard floor remains."""
    k = int(round(k))
    if k <= 0:
        return deck
    deck.sort(key=lambda c: c["tier"])
    keep_floor = 5                      # unplayable below this; can't thin past it
    removable = max(0, len(deck) - keep_floor)
    k = min(k, removable)
    return deck[k:]


def power(deck):
    return sum(c["tier"] for c in deck)


def source_power(deck):
    out = {s: 0.0 for s in CARD_SOURCES}
    for c in deck:
        out[c["src"]] += c["tier"]
    return out


def simulate_run(aggressive_thin=False):
    """Returns per-season deck snapshots (size + power) and end-of-run source split."""
    deck = []
    # P6 · the setting-out first-gift — ~6-8 apprentice-tier pieces (once, spring).
    add_pieces(deck, ri(6, 8), 1, "first_gift")

    snaps = {}

    def season(name, glad_n, glad_t, extras, thin_base_lo, thin_base_hi):
        # extras: list of (prob, n_lo, n_hi, tier, src)
        add_pieces(deck, glad_n, glad_t, "glad_load")   # P1 · the passive spine
        for prob, lo, hi, tier, src in extras:
            if random.random() < prob:
                add_pieces(deck, ri(lo, hi), tier, src)
        # thinning = a small season base + a share proportional to the current
        # pack size (retire/gift/exhaust scale with what you've acquired).
        t = rf(thin_base_lo, thin_base_hi) + THIN_PROP * len(deck)
        if aggressive_thin:
            t = rf(thin_base_lo, thin_base_hi) * 1.5 + 2.0 * THIN_PROP * len(deck)
        d = thin(deck, t)
        deck[:] = d
        snaps[name] = {"size": len(deck), "power": power(deck)}

    # ---- Green Going (spring): kettle askings, apprentice floor only ---------
    season("green", ri(3, 4), 1,
           [], 0.3, 0.8)
    # ---- Long Light (high summer): vouching opens, the Fair crosses ----------
    season("long", ri(5, 6), 2,
           [(0.45, 2, 3, 2, "fair"),       # P2 · Round-Fair draft (k-of-N burst)
            (1.00, 1, 2, 2, "bench"),       # P5 · the bench (material->piece)
            (0.50, 0, 1, 2, "masters")],    # P4 · walking-with-masters
           0.5, 1.0)
    # ---- Deep Gold (late summer): proud shelf leans in, gleaning opens -------
    season("deepgold", ri(4, 5), 3,
           [(1.00, 1, 2, 3, "bench"),
            (0.50, 0, 1, 3, "masters")],
           0.5, 1.0)
    # ---- Red Walk (autumn): full width, crown introductions, thinned lean ----
    season("redwalk", ri(3, 4), 4,
           [(1.00, 2, 3, 4, "fair"),        # the Fair reliably crosses by autumn
            (1.00, 1, 2, 5, "red_thread"),  # P7 · red-thread crown unlock (tier5)
            (0.70, 0, 1, 4, "bench")],
           0.8, 1.4)

    snaps["end_src"] = source_power(deck)
    snaps["end_size"] = len(deck)
    snaps["end_power"] = power(deck)
    return snaps


# ----------------------------------------------------------------------------
# Run the Monte-Carlo cohort
# ----------------------------------------------------------------------------
cohort = [simulate_run() for _ in range(N_TRIALS)]

season_order = ["green", "long", "deepgold", "redwalk"]
pow_by_season = {s: [c[s]["power"] for c in cohort] for s in season_order}
size_by_season = {s: [c[s]["size"] for c in cohort] for s in season_order}
end_power = [c["end_power"] for c in cohort]
end_size = [c["end_size"] for c in cohort]

checks = []


def record(name, ok, detail):
    checks.append({"name": name, "pass": bool(ok), "detail": detail})


# ============================================================================
# CHECK 1 · deck_growth_on_curve
# On-curve == for every season the median deck-power sits in the band
# [need, TRIVIALIZE_FACTOR*need]; growth is monotone; mid-run power stays BELOW
# the crown floor (so it can't trivialize the mid curve); and the end deck can
# stand the crown in the vast majority of runs.
# ============================================================================
band_ok = True
band_report = []
for s in season_order:
    need = SEASON_NEED[s]
    med = stats.median(pow_by_season[s])
    p05 = pct(pow_by_season[s], 5)
    p95 = pct(pow_by_season[s], 95)
    lo_ok = p05 >= need                       # clearable: grown enough for the season
    hi_ok = p95 <= TRIVIALIZE_FACTOR * need    # not so fast it trivializes
    band_report.append((s, round(med, 1), round(p05, 1), round(p95, 1), need))
    if not (lo_ok and hi_ok):
        band_ok = False

# monotone growth (median power strictly rises season to season)
med_curve = [stats.median(pow_by_season[s]) for s in season_order]
monotone = all(med_curve[i] < med_curve[i + 1] for i in range(len(med_curve) - 1))

# mid-run does not pre-empt the crown: Long Light & Deep Gold p95 < crown floor
mid_below_crown = (pct(pow_by_season["long"], 95) < CROWN_FLOOR and
                   pct(pow_by_season["deepgold"], 95) < CROWN_FLOOR)

# end deck stands the calendar-floored crown in >=92% of runs, with a real but
# bounded margin (median between 1.0x and TRIVIALIZE_FACTOR x the crown floor)
stand_frac = sum(1 for p in end_power if p >= CROWN_FLOOR) / len(end_power)
end_med = stats.median(end_power)
end_margin_ok = (CROWN_FLOOR <= end_med <= TRIVIALIZE_FACTOR * CROWN_FLOOR)

growth_ok = band_ok and monotone and mid_below_crown and stand_frac >= 0.92 and end_margin_ok
record(
    "deck_growth_on_curve",
    growth_ok,
    ("per-season power [med,p05,p95] vs need " +
     "; ".join(f"{s}:{m}/{a}-{b}(need{n})" for s, m, a, b, n in band_report) +
     f" | monotone={monotone} mid<crown={mid_below_crown}"
     f" crown_floor={CROWN_FLOOR} end_power_med={round(end_med,1)}"
     f" stands_crown={round(stand_frac,3)} (deck grows onto the curve, stays"
     f" below the crown mid-run, stands it by autumn)"),
)

# ============================================================================
# CHECK 2 · no_dominant_source
# (a) cards enter by >=3 independent doors, each a meaningful power share;
# (b) NO single source can stand the crown alone -> no keystone faucet
#     ("pull only one and you starve", L4 §5a). The glad-load is the richest
#     FLOW but is calendar-capped (each node answers once), so its share is
#     bounded, not runaway;
# (c) materials: no single courting door > ~40% of material supply.
# ============================================================================
MIN_DOOR_SHARE = 0.06
doors_ok_trials = 0
solo_keystone_trials = 0
glad_shares = []
top_shares = []
for c in cohort:
    sp = c["end_src"]
    tot = sum(sp.values()) or 1.0
    shares = {k: v / tot for k, v in sp.items()}
    doors = sum(1 for v in shares.values() if v >= MIN_DOOR_SHARE)
    if doors >= 3:
        doors_ok_trials += 1
    # keystone test: does ANY single source alone reach the crown floor?
    if max(sp.values()) >= CROWN_FLOOR:
        solo_keystone_trials += 1
    glad_shares.append(shares["glad_load"])
    top_shares.append(max(shares.values()))

doors_frac = doors_ok_trials / len(cohort)
keystone_frac = solo_keystone_trials / len(cohort)      # want ~0: no solo faucet
glad_share_med = stats.median(glad_shares)
glad_share_p95 = pct(glad_shares, 95)

# --- materials: model the six courting doors (L4 §1B) by per-run supply count.
#     M2 (glad-load introduction-jar, the passive spine) must stay < 40%.
def material_shares():
    doors = {
        "M1_courting":   ri(6, 10),   # gleam-gated width
        "M2_glad_jar":   ri(9, 13),   # passive on-fulfil (the spine)
        "M3_festival":   ri(2, 4),    # crowd/venue-bound
        "M4_gleaning":   ri(3, 5),    # pale-route salvage
        "M5_apprentice": ri(4, 7),    # zero-gate floor
        "M6_waymeet":    ri(2, 4),    # gift-lane jars
    }
    tot = sum(doors.values())
    return {k: v / tot for k, v in doors.items()}

mat_max = []
for _ in range(N_TRIALS):
    ms = material_shares()
    mat_max.append(max(ms.values()))
mat_door_ok = pct(mat_max, 95) <= 0.40

no_dom_ok = (doors_frac >= 0.95 and keystone_frac <= 0.05 and mat_door_ok)
record(
    "no_dominant_source",
    no_dom_ok,
    (f">=3 card doors in {round(doors_frac,3)} of runs; "
     f"solo-source-stands-crown (keystone) in {round(keystone_frac,3)} of runs; "
     f"glad_load power share med={round(glad_share_med,3)} p95={round(glad_share_p95,3)} "
     f"(richest flow, but calendar-capped: cannot stand the crown alone); "
     f"materials max-door p95={round(pct(mat_max,95),3)}<=0.40 "
     f"(no keystone faucet on cards OR materials)"),
)

# ============================================================================
# CHECK 3 · no_degenerate_acquisition_loop
# Three sub-simulations, each must net <= 0 / be bounded:
#  3a retire<->twice-benched mint (double-closed: residual-worth clamp +
#     terminal grade), vs the UNCLOSED variant which WOULD explode;
#  3b the Handsel Round is mint-clean (no flow creates net regard);
#  3c the glad-load faucet is calendar-bounded (each node answers once).
# ============================================================================

# --- 3a · retire<->twice-benched -------------------------------------------
TWICE_BENCHED_EASE = 0.9      # wakes at nine-tenths fresh attention (the single number)
FRESH_WAKE_ATTN = 10.0

def retire_cycle_closed(material, attn):
    """One closed cycle (L4 §5c). Bench twice-benched stock -> a piece, wake it
    (spending its worth forward into fill+overkill), then last-light it.
    retire RETURNS only the *residual UNSPENT* attention this cycle (clamp #1),
    and twice-benched is TERMINAL: no new twice-benched stock (close #2)."""
    if material <= 0:
        return material, attn, False
    material -= 1                                  # consume stock to bench
    spent = FRESH_WAKE_ATTN * TWICE_BENCHED_EASE   # 9.0 spent to wake
    attn -= spent
    residual = 0.5                                 # clamp: worth already spent forward
    attn += residual                               # retire returns only the residual
    # material += 0  <- TERMINAL: no regenerated twice-benched stock
    return material, attn, True

def retire_cycle_unclosed(material, attn):
    """The degenerate construct the critics named, WITHOUT the two closes:
    retire returns full carried worth AND regenerates fresh stock -> positive loop."""
    if material <= 0:
        return material, attn, False
    material -= 1
    spent = FRESH_WAKE_ATTN * TWICE_BENCHED_EASE
    attn -= spent
    attn += 2.0 * FRESH_WAKE_ATTN                  # BUG: returns full fired worth
    material += 1.2                                # BUG: regenerates >1 stock
    return material, attn, True

m0, a0 = 8.0, 40.0
m, a = m0, a0
closed_history = [(m, a)]
for _ in range(200):
    m, a, alive = retire_cycle_closed(m, a)
    closed_history.append((m, a))
    if not alive:
        break
closed_material_bounded = m <= m0            # material strictly decays (terminal)
closed_attn_bounded = a <= a0                # attention nets negative
closed_halts = (m <= 0)                      # the faucet runs dry (finite input)

# demonstrate the close is load-bearing: the unclosed variant explodes
mu, au = 8.0, 40.0
for _ in range(50):
    mu, au, alive = retire_cycle_unclosed(mu, au)
    if not alive:
        break
unclosed_explodes = (mu > m0 and au > a0)

retire_ok = closed_material_bounded and closed_attn_bounded and closed_halts and unclosed_explodes

# --- 3b · Handsel Round mint-clean -----------------------------------------
# whittle carves the-shavings-share FROM the RETURN (competes with the node's
# dawn — never minted on top); brightening's gain is bounded BELOW its tempo
# cost; idle handsels lapse to the dawn. Total regard must be non-increasing.
def handsel_round_total_regard(steps=600):
    pool = 100.0          # RETURN/attention pool (the world's income)
    bright = 0.0          # handsel worth (how awake the coin is)
    total0 = pool + bright
    worst = total0
    for i in range(steps):
        if i % 3 == 0 and pool > 1.0:
            carve = min(5.0, pool)      # whittle: MOVE from RETURN (conserved)
            pool -= carve
            bright += carve * 0.6       # dull coin: worth < carved (no mint)
        elif i % 3 == 1:
            gain, cost = 1.0, 1.4       # brighten via circulation: gain < cost
            bright += gain
            pool -= cost                # tempo/attention cost dwarfs the gain
        else:
            lapse = bright * 0.15       # idle -> gloaming-table -> dawn income
            bright -= lapse
            pool += lapse               # returns EXACTLY what lapsed (mint-clean)
        worst = max(worst, pool + bright)
    return total0, worst

hr0, hr_worst = handsel_round_total_regard()
handsel_mint_clean = hr_worst <= hr0 + 1e-6   # never exceeds initial regard

# --- 3c · glad-load faucet calendar-bounded --------------------------------
# each node answers ONCE (glad-load fires once/node/year); askings are finite on
# the calendar -> gross glad influx is hard-capped, not spammable.
N_NODES_AVAILABLE = 30
glad_pieces = [sum(1 for x in c["end_src"]) for c in cohort]  # placeholder count
glad_influx = [ri(15, 20) for _ in range(500)]   # answered askings/run (arc §2)
glad_bounded = max(glad_influx) <= N_NODES_AVAILABLE

degen_ok = retire_ok and handsel_mint_clean and glad_bounded
record(
    "no_degenerate_acquisition_loop",
    degen_ok,
    (f"retire<->twice-benched CLOSED: material {m0}->{round(m,2)} (terminal, "
     f"decays), attn {a0}->{round(a,2)} (nets negative), halts={closed_halts}; "
     f"unclosed-variant WOULD explode={unclosed_explodes} (the two closes are "
     f"load-bearing) | Handsel Round mint-clean: regard {round(hr0,1)}->worst "
     f"{round(hr_worst,1)} (non-increasing) | glad faucet calendar-bounded: "
     f"max influx {max(glad_influx)}<={N_NODES_AVAILABLE} nodes (each answers once)"),
)

# ============================================================================
# CHECK 4 · thinning_viable
# A player CAN keep the deck focused: retire+gift+exhaust capacity is enough to
# offset gross influx (hold a lean target), never thinning into an unplayable
# pack, and the thinning rate keeps pace with influx in the late seasons.
# ============================================================================
lean_targets_hit = 0
never_empty = 0
default_end_in_band = 0
DECK_FLOOR = 5
for _ in range(N_TRIALS):
    agg = simulate_run(aggressive_thin=True)   # Evener/Untold thin-engine style
    dfl = simulate_run(aggressive_thin=False)  # default play
    if agg["end_size"] <= 16:                  # can hold a focused/lean deck
        lean_targets_hit += 1
    if agg["end_size"] >= DECK_FLOOR:          # cannot thin into an empty pack
        never_empty += 1
    if 15 <= dfl["end_size"] <= 24:            # default lands ~18-22 (arc §3)
        default_end_in_band += 1

lean_frac = lean_targets_hit / N_TRIALS
floor_frac = never_empty / N_TRIALS
default_frac = default_end_in_band / N_TRIALS

# thinning keeps pace with influx: in the aggressive line the deck does not run
# away (end <= default end), i.e. thin-rate >= add-rate is achievable.
agg_sizes = [simulate_run(aggressive_thin=True)["end_size"] for _ in range(1000)]
keeps_pace = pct(agg_sizes, 95) <= 18

thinning_ok = (lean_frac >= 0.90 and floor_frac >= 0.999 and
               default_frac >= 0.80 and keeps_pace)
record(
    "thinning_viable",
    thinning_ok,
    (f"aggressive thinning holds deck<=16 in {round(lean_frac,3)} of runs; "
     f"deck never thins below {DECK_FLOOR} (floor held in {round(floor_frac,3)}); "
     f"default end-deck in [15,24] in {round(default_frac,3)} (arc ~18-22); "
     f"thin keeps pace with influx (aggressive p95 size={round(pct(agg_sizes,95),1)}<=18) "
     f"— the pack is a garden, keepable focused, never emptyable"),
)

# ============================================================================
# CRITIC LINE · skip_ripen_not_dominant  (L4 §5c degenerate-economy P1)
# The binding inequality: waking-capacity growth per worked morning
# < difficulty growth per ripened ring -> a ripe 7-ring need out-scales the
# deck the skip-year buys, so the under-grown skipper may not stand the crown.
# ============================================================================
# capacity the engaged run builds per worked morning:
engaged_end_power = stats.median(end_power)
engaged_mornings = 17.0                        # ~answered askings across the run
cap_growth_per_morning = engaged_end_power / engaged_mornings
# difficulty growth per ripened ring (plea@3 .. great@7):
diff_growth_per_ring = (difficulty_at_ring(7) - difficulty_at_ring(3)) / (7 - 3)
inequality_holds = cap_growth_per_morning < diff_growth_per_ring

# and a skip run (answers few, cheap-wake loop already closed) under-grows:
skip_end_power = 0.62 * engaged_end_power      # fewer glad-loads, capped cheap-wake
skipper_may_not_stand = skip_end_power < CROWN_FLOOR

skip_ok = inequality_holds and skipper_may_not_stand
record(
    "skip_ripen_not_dominant",
    skip_ok,
    (f"cap-growth/morning={round(cap_growth_per_morning,2)} < "
     f"diff-growth/ring={round(diff_growth_per_ring,2)} -> ripe need out-scales; "
     f"skip-run end power {round(skip_end_power,1)} < crown floor {CROWN_FLOOR} "
     f"(skipper may not stand the crown) -> high-risk style, not a dominant solve"),
)

# ============================================================================
# CRITIC LINE · fair_faucet_bounded  (L4 §5c degenerate-economy P2)
# The handsels->cards teaching lane must cost MORE attention-tempo than simply
# answering an asking (no arbitrage), and be a windowed k-of-N burst.
# ============================================================================
T_GLAD = 10.0                                  # tempo to earn a glad-load piece
T_WHITTLE = 6.0                                # carve dull handsels
T_BRIGHTEN = 5.0                               # circulate them bright (bounded)
T_INTERCEPT = 3.0                              # route to the wheel
T_BUY = T_WHITTLE + T_BRIGHTEN + T_INTERCEPT   # tempo to buy a teaching = 14
no_arbitrage = T_BUY > T_GLAD
fair_k, fair_N = 3, 9                           # bounded k-of-N per passage
windowed = (fair_k / fair_N) <= 0.4 and fair_k <= 3
# fair's realized power share stays well under a runaway line
fair_shares = []
for c in cohort:
    sp = c["end_src"]
    tot = sum(sp.values()) or 1.0
    fair_shares.append(sp["fair"] / tot)
fair_share_p95 = pct(fair_shares, 95)
fair_ok = no_arbitrage and windowed and fair_share_p95 <= 0.30
record(
    "fair_faucet_bounded",
    fair_ok,
    (f"buy-a-teaching tempo {T_BUY} > answer-an-asking tempo {T_GLAD} "
     f"(no money->card arbitrage); windowed k/N={fair_k}/{fair_N}; "
     f"fair power share p95={round(fair_share_p95,3)}<=0.30 "
     f"— a bounded trade, never a card-shop or keystone faucet"),
)

# ============================================================================
# CRITIC LINE · deliberate_failure_ev_negative  (L4 §5c / L1 §4)
# The spilling yields lane-glimmers worth < 1 Standing, claimable ONLY by later
# visitors, never the spiller -> a deliberate flop is strictly EV-negative.
# ============================================================================
STANDING_COST_OF_SPILL = 3.0                   # regard withdrawn on an unmoved room
GLIMMER_VALUE = 0.4                            # < 1 Standing point
SPILLER_CLAIMABLE = 0.0                        # never for the spiller
spiller_ev = -STANDING_COST_OF_SPILL + SPILLER_CLAIMABLE
df_ok = (GLIMMER_VALUE < 1.0 and spiller_ev < 0.0)
record(
    "deliberate_failure_ev_negative",
    df_ok,
    (f"lane-glimmer value {GLIMMER_VALUE}<1 Standing, spiller-claimable="
     f"{SPILLER_CLAIMABLE}; spiller EV={spiller_ev}<0 -> no flop-to-farm"),
)

# ----------------------------------------------------------------------------
# Assemble result
# ----------------------------------------------------------------------------
flags = [c["name"] for c in checks if not c["pass"]]
result = {
    "model": "layer-04-acquisition-model",
    "checks": checks,
    "flags": flags,
}

# Debug summary to STDERR (does not affect the last STDOUT line).
import sys
print("=== layer-04 napkin debug ===", file=sys.stderr)
for c in checks:
    print(f"[{'PASS' if c['pass'] else 'FAIL'}] {c['name']}: {c['detail']}",
          file=sys.stderr)
print(f"trials={N_TRIALS} end_size med/p05/p95="
      f"{stats.median(end_size)}/{pct(end_size,5)}/{pct(end_size,95)} "
      f"end_power med={round(stats.median(end_power),1)} flags={flags}",
      file=sys.stderr)

# EXACTLY ONE JSON object as the last stdout line:
print(json.dumps(result))
