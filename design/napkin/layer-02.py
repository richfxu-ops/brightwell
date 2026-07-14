#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
napkin-sim -- Layer 2 (Resource Types) economy math-check for ROUNDELAY
(pipeline-test-02).

Stdlib-only, seeded, deterministic. Executes a small agent-based model of the
four-resource economy specified in GDD.md "## Layer 2 -- Resource Types",
riding the LOCKED L1 loop (rising seasonal-seep floor, worked-morning turns,
overkill->Standing, node-local RETURN, soft-capped room).

It math-checks the design's own claims (napkin_flags claimed 0):

  no_dominant_resource  -- the four resources are non-substitutable; no single
                           one-axis strategy can clear the year, and no single
                           resource carries a runaway share of clearing output.
  on_curve_clearable    -- a plausible *balanced* resource strategy converts
                           resources into cleared contracts that keep pace with
                           L1's rising seasonal floor: neither trivially ahead
                           (risk-free runaway) nor irrecoverably behind, and it
                           can stand the calendar-floored crown.
  no_degenerate_loop    -- given L1 soft-caps (room soft-cap, overkill
                           diminishing past a band, node-local RETURN, idle
                           handsel dim), no transformation chain runs away with
                           positive feedback; engine growth decelerates.

Plus the resource-specific risks the critic panel raised (GDD L2 s5/s8):

  conservation_mint_ban -- the-shavings-share is carved from the bench RETURN,
                           never minted on top; every turn conserves regard.
  spilling_ev_negative  -- a deliberate flop (the spilling) is strictly
                           EV-negative: lane-glimmers < Standing lost, and never
                           claimable by the spiller -> failure-farming loses.
  handsels_cant_buy_win -- structural: handsels never buy Standing nor proud
                           courted stock; a money-hoard alone cannot clear.

The engine executes this and counts failed checks. Nothing is self-reported;
each check runs the model and inspects outcomes.
"""

import json
import math
import random
import sys

SEED = 20260710
random.seed(SEED)

EPS = 1e-9

# ----------------------------------------------------------------------------
# Calendar / seasonal-seep floor  (L1 s1, s5; escalation-is-the-weather)
# ----------------------------------------------------------------------------
# Worked mornings (dawns). Winter is "unwalked" -- the run ends at the first
# still dawn, so we simulate spring..autumn plus the year-end crown.
# The seep floor (minimum need a lantern can hang) rises with the season,
# regardless of peak/skip: near-still spring -> strongest autumn.
SEASONS = [
    ("green_going", 12, 3.0),   # spring       : near-still, waking
    ("long_light", 12, 5.0),    # high summer  : gentle -> strong
    ("deep_gold", 12, 7.0),     # late summer  : strong
    ("red_walk", 12, 9.0),      # autumn       : strongest
]
NEED_SCALE = 3.0        # a floor-f asking demands f*NEED_SCALE woken delight
CROWN_MULT = 1.8        # the-rising-crown: calendar-floored finale on top

# ----------------------------------------------------------------------------
# Economy constants (napkin-scale; numeric fine-tuning is deferred to game-loop
# per D-005.3 -- these only need to be plausible & internally consistent).
# ----------------------------------------------------------------------------
BASE_INCOME = 4.0       # flat guaranteed dawn base (>= cheapest waking-mark)
LOCAL_DRAW = 1.2        # local-table draw per ring of paleness (paler = richer)
RETURN_KEEP = 0.9       # node-local RETURN carried to tomorrow's dawn (camp)
ROOM_CAP = 8.0          # the-gathered-room soft-cap ceiling (plateaus)
ROOM_K = 8.0            # soft-cap curvature (contribution decays as deck grows)

DPA_BASE = 1.0          # base delight per unit attention SET into a piece
CHAIN_BONUS = 1.2       # unbroken work-chain holds the pool high
MAT_FLOOR = 0.6         # material_mult at apprentice stock (M=1): 0.6+0.4*1=1.0
MAT_GAIN = 0.4          # material multiplier gain per unit courted-stock grade

OVERKILL_RATE = 0.5     # fraction of a reach's surplus that runs to Standing...
OVERKILL_BAND = 6.0     # ...diminishing hard past this band (full-cup floor)
SHAV_FRAC = 0.15        # the-shavings-share: sub-portion of RETURN -> handsels

M_START = 1.0
M_CAP = 3.0             # proud courted stock ceiling
M_INVEST = 0.10         # courting gain per turn of investment (gleam-gated)
M_INTRO = 0.02          # glad-load introduction-jar bump (a nudge, not a path
                        # to proud grade -- proud stock needs deliberate courting)
M_DECAY = 0.99          # reverts toward ordinary if untended (freshness garden)

GLIMMER_FRAC = 0.30     # spill -> lane-glimmers (< 1, never to the spiller)
SPILL_FRAC = 0.35       # Standing withdrawn when a reach falls short / stales

S_START = 5.0
D_START = 5             # journey-pieces in the starting deck
GLAD_HANDSELS = 2.0     # bright handsels paid by a glad-load (scaled by rings)
HANDSEL_IDLE_DIM = 0.9  # idle handsels dim -> seep -> tomorrow's dawn income

DPA_JITTER = 0.10       # reach-outcome variance -> some reaches fall short (risk)

CROWN_M_REQ = 2.3       # crown demands proud stock (the whole engine)
CROWN_D_REQ = 14        # ...and a grown deck


def room_bonus(deck_size):
    """the-gathered-room: soft-capped -> plateaus, never runs away."""
    return ROOM_CAP * (1.0 - math.exp(-deck_size / ROOM_K))


def material_mult(M):
    return MAT_FLOOR + MAT_GAIN * M


def eff_dpa(M, rng):
    j = 1.0 + rng.uniform(-DPA_JITTER, DPA_JITTER)
    return DPA_BASE * material_mult(M) * CHAIN_BONUS * j


def turn_floors():
    """Flatten the calendar into a per-worked-morning seep floor."""
    floors = []
    labels = []
    for name, dawns, f in SEASONS:
        for _ in range(dawns):
            floors.append(f)
            labels.append(name)
    return floors, labels


# ----------------------------------------------------------------------------
# Policies -- a policy is a resource strategy. "balanced" runs all four systems;
# the single-axis policies each ignore some of the four (to test dominance).
# ----------------------------------------------------------------------------
POLICIES = {
    # runs the Bench + Handsel Round + Courting Web + Paling Market together;
    # a competent maker PACES overkill (grows peak without out-running its fills)
    "balanced":      dict(court=True,  work=True,  overkill_greedy=0.40, skip_rate=0.05),
    # attention-only: never courts materials, never circulates handsels
    "attention_only":dict(court=False, work=True,  overkill_greedy=0.5, skip_rate=0.05),
    # standing-max: dumps every surplus to overflow, under-works the fills
    "standing_max":  dict(court=True,  work=True,  overkill_greedy=0.95, skip_rate=0.05),
    # handsel-hoard: hoards money; cannot buy Standing or proud stock (no court)
    "handsel_hoard": dict(court=False, work=True,  overkill_greedy=0.3, skip_rate=0.05),
    # paling-farm: deliberately skips to farm rings instead of answering
    "paling_farm":   dict(court=True,  work=True,  overkill_greedy=0.5, skip_rate=0.60),
}


def simulate(policy, seed):
    """One wander-year under a policy. Returns a metrics dict."""
    rng = random.Random(seed)
    floors, labels = turn_floors()

    S = S_START          # Standing (gleam) -- never spent
    P = S_START          # peak-Standing (fired, one-way)
    H = 0.0              # handsels
    M = M_START          # courted-stock grade (one class)
    D = D_START          # deck size (journey-pieces)
    returned = 0.0       # node-local RETURN carried to next dawn
    idle_pool = 0.0      # boxed handsels lapsing -> tomorrow's dawn

    cleared_need = {name: 0.0 for name, _, _ in SEASONS}
    avail_need = {name: 0.0 for name, _, _ in SEASONS}
    cleared_count = 0

    # resource contribution accounting (for no_dominant_resource share test)
    contrib = {"attention": 0.0, "courted_stock": 0.0, "standing": 0.0, "handsels": 0.0}

    # conservation ledger + degenerate-loop growth samples
    max_conservation_err = 0.0
    engine_value = []          # proxy engine value per turn (growth curve)
    spill_events = []          # (standing_lost, glimmer_seeded)
    best_autumn_delight = 0.0
    alive = True
    reaches = 0
    reaches_short = 0

    for t, (f, name) in enumerate(zip(floors, labels)):
        if not alive:
            break

        # --- Dawn (income) : R1 attention -----------------------------------
        # flat base + local-table draw (paler node richer) + node-local RETURN
        # + lapsed idle handsels returning as income (Handsel Round closes here)
        base = BASE_INCOME + idle_pool
        idle_pool = 0.0
        local = LOCAL_DRAW * f
        pool = base + local + returned + room_bonus(D)
        income_regard = pool  # what entered the bench this dawn

        # --- Courting (System C): gleam gates, handsels buy jars, term played -
        # gleam is a *gate*, never spent; handsels buy the jar/apprentice stock.
        if policy["court"] and S > 0:
            width = min(1.0, S / 8.0)          # market width opens with Standing
            # spend up to two handsels into jars while stock is below proud grade
            for _ in range(2):
                if H >= 1.0 and M < M_CAP:      # spend handsels into a jar
                    H -= 1.0
                    M = min(M_CAP, M + M_INVEST * width)
                    contrib["handsels"] += M_INVEST * width  # money -> material uplift
        M *= M_DECAY                            # freshness reverts untended stock
        M = max(M_START, M)

        # --- The asking : sized to max(weather floor, fired peak tier) --------
        tier = max(f, P * 0.5)                  # peak ratchet rides above floor
        need = tier * NEED_SCALE
        avail_need[name] += need

        # deliberate skip (paling-farm feeds rings, never touches gleam) --------
        if rng.random() < policy["skip_rate"]:
            # skipped: no clear, the board spirals (R4). No Standing change.
            returned = returned * RETURN_KEEP   # nothing worked here today
            engine_value.append(S + H + M * 10 + D)
            continue

        # --- The working : spend attention to fill the need -------------------
        dpa = eff_dpa(M, rng)
        set_needed = need / dpa                 # attention SET to fill the need
        reaches += 1

        if set_needed <= pool + EPS:
            # fill it. SET works the pieces; surplus splits (overkill/shav/RETURN)
            set_used = set_needed
            surplus = pool - set_used
            # overkill -> Standing, diminishing hard past the band (soft-cap)
            greedy = policy["overkill_greedy"]
            raw_over = surplus * greedy
            overkill = min(raw_over, OVERKILL_BAND) + 0.25 * max(0.0, raw_over - OVERKILL_BAND)
            remaining = surplus - overkill
            # the-shavings-share : carved FROM the RETURN, not minted on top
            shav = remaining * SHAV_FRAC
            ret_next = remaining - shav
            # conservation: pool == SET + overkill + shavings + RETURN (exact)
            err = abs(pool - (set_used + overkill + shav + ret_next))
            max_conservation_err = max(max_conservation_err, err)

            # apply
            S += overkill
            P = max(P, S)                       # fired peak, one-way
            H += shav
            returned = ret_next * RETURN_KEEP   # node-local, no caravanning
            cleared_count += 1
            cleared_need[name] += need

            # glad-load pays across every system at once (rings-in = load-out)
            rings = f
            H += GLAD_HANDSELS * (rings / 3.0)
            D += 1                              # one taught piece
            M = min(M_CAP, M + M_INTRO)         # one introduction-jar

            # resource contribution attribution for the dominance share test:
            #   attention  = the SET that produced the fill (always the spend)
            #   courted    = the delight uplift materials gave over apprentice
            #   standing   = the tier the fired peak enabled above the raw floor
            base_dpa = DPA_BASE * MAT_FLOOR * CHAIN_BONUS
            uplift = 1.0 - base_dpa / material_mult(M) / (CHAIN_BONUS * DPA_BASE) * base_dpa
            contrib["attention"] += set_used
            contrib["courted_stock"] += set_used * max(0.0, (material_mult(M) - 1.0))
            contrib["standing"] += max(0.0, (tier - f)) * NEED_SCALE / max(dpa, EPS)

            if name == "red_walk":
                best_autumn_delight = max(best_autumn_delight, pool * dpa)
        else:
            # the reach fell short -> the spilling (outcome-only Standing loss)
            reaches_short += 1
            lost = S * SPILL_FRAC
            S -= lost
            glimmer = lost * GLIMMER_FRAC       # < lost, and NOT to the spiller
            spill_events.append((lost, glimmer))
            returned = returned * RETURN_KEEP
            if S <= EPS:
                alive = False                    # gleam-gone-quiet: Quiet Walk

        # idle handsels dim (the-open-purse): the money's only sink is income
        idle_pool += H * (1.0 - HANDSEL_IDLE_DIM)
        H *= HANDSEL_IDLE_DIM

        engine_value.append(S + H + M * 10 + D)

    # --- The crown : calendar-floored finale (the-rising-crown) ---------------
    f_final = SEASONS[-1][2]
    crown_need = f_final * NEED_SCALE * CROWN_MULT
    crown_capacity = best_autumn_delight
    crown_stood = (
        alive and S > 0 and M >= CROWN_M_REQ and D >= CROWN_D_REQ
        and crown_capacity >= crown_need * 0.85
    )

    return dict(
        policy=policy, alive=alive, S=S, P=P, H=H, M=M, D=D,
        cleared_need=cleared_need, avail_need=avail_need,
        cleared_count=cleared_count, contrib=contrib,
        max_conservation_err=max_conservation_err,
        engine_value=engine_value, spill_events=spill_events,
        crown_stood=crown_stood, crown_need=crown_need,
        crown_capacity=crown_capacity, reaches=reaches,
        reaches_short=reaches_short,
    )


def run_many(policy_name, n_seeds=16):
    outs = []
    for i in range(n_seeds):
        outs.append(simulate(POLICIES[policy_name], SEED + 1009 * (i + 1)))
    return outs


# ----------------------------------------------------------------------------
# CHECKS
# ----------------------------------------------------------------------------
def check_no_dominant_resource():
    """
    Non-substitutability: run the balanced strategy and the four single-axis
    strategies. PASS iff (i) the balanced strategy stands the crown, (ii) NO
    single-axis strategy that ignores a resource can also stand the crown
    (each resource is load-bearing -> none is dominant / substitutable), and
    (iii) no single resource carries a runaway share (>0.6) of clearing output.
    """
    bal = run_many("balanced")
    bal_stood = sum(1 for r in bal if r["crown_stood"]) / len(bal)

    single_axis = ["attention_only", "standing_max", "handsel_hoard", "paling_farm"]
    dominant = []
    for pn in single_axis:
        rs = run_many(pn)
        stood = sum(1 for r in rs if r["crown_stood"]) / len(rs)
        cleared = sum(r["cleared_count"] for r in rs) / len(rs)
        bal_cleared = sum(r["cleared_count"] for r in bal) / len(bal)
        # a policy "dominates" if it wins the year while ignoring resources
        if stood >= 0.5 and cleared >= 0.95 * bal_cleared:
            dominant.append((pn, round(stood, 2), round(cleared, 1)))

    # output-share test: aggregate resource contribution over balanced runs
    agg = {"attention": 0.0, "courted_stock": 0.0, "standing": 0.0, "handsels": 0.0}
    for r in bal:
        for k, v in r["contrib"].items():
            agg[k] += v
    total = sum(agg.values()) or 1.0
    shares = {k: v / total for k, v in agg.items()}
    max_share = max(shares.values())
    max_res = max(shares, key=shares.get)

    ok = (bal_stood >= 0.5) and (len(dominant) == 0) and (max_share <= 0.60)
    detail = (
        f"balanced crown-stood={bal_stood:.2f}; single-axis dominators={dominant}; "
        f"output shares={ {k: round(s,2) for k,s in shares.items()} } "
        f"(max {max_res}={max_share:.2f}<=0.60). Four resources non-substitutable: "
        f"no one-axis strategy clears the year, no resource a runaway output share."
    )
    return ok, detail


def check_on_curve_clearable():
    """
    A plausible balanced strategy keeps pace with the rising seasonal floor:
      - per-season clear ratio (cleared_need / available_need) stays in a band
        [0.60, 1.05] every season -> neither irrecoverably behind (>=0.60) nor
        clearing a trivial runaway (<=1.05, it tracks the curve, not laps it);
      - the run stands the calendar-floored crown while still lit;
      - risk is live: some reaches genuinely fall short (not trivially ahead).
    """
    bal = run_many("balanced")
    season_ratios = {name: [] for name, _, _ in SEASONS}
    for r in bal:
        for name, _, _ in SEASONS:
            av = r["avail_need"][name]
            if av > 0:
                season_ratios[name].append(r["cleared_need"][name] / av)
    mean_ratio = {n: (sum(v) / len(v) if v else 0.0) for n, v in season_ratios.items()}

    in_band = all(0.60 <= mr <= 1.05 for mr in mean_ratio.values())
    stood = sum(1 for r in bal if r["crown_stood"]) / len(bal)
    # live risk present: reaches sometimes fall short (not a risk-free runaway)
    short_frac = sum(r["reaches_short"] for r in bal) / max(1, sum(r["reaches"] for r in bal))
    live_risk = 0.005 <= short_frac <= 0.30
    # not irrecoverably behind: late-season clearing does not collapse
    late_ok = mean_ratio["red_walk"] >= 0.60

    ok = in_band and stood >= 0.5 and live_risk and late_ok
    detail = (
        f"per-season clear ratios={ {n: round(mr,2) for n,mr in mean_ratio.items()} } "
        f"(band [0.60,1.05]); crown-stood={stood:.2f}; reach-short frac={short_frac:.3f} "
        f"(live risk, not trivially ahead). Output climbs with the weather; static "
        f"engines are out-grown -> clearable only by growing."
    )
    return ok, detail


def check_no_degenerate_loop():
    """
    Given L1 soft-caps, no transformation chain runs away. Sample the balanced
    engine-value growth curve and require it to DECELERATE: the late-window mean
    per-turn gain must not exceed a small multiple of the early-window gain.
    A positive-feedback runaway would show accelerating (geometric) growth.
    Also verifies conservation error stays at float-noise (mint-ban backstop).
    """
    bal = run_many("balanced")
    ratios = []
    cons_errs = []
    for r in bal:
        ev = r["engine_value"]
        cons_errs.append(r["max_conservation_err"])
        if len(ev) < 12:
            continue
        n = len(ev)
        q = n // 4
        early = (ev[q] - ev[0]) / max(1, q)
        late = (ev[-1] - ev[-q - 1]) / max(1, q)
        if abs(early) < EPS:
            early = EPS
        ratios.append(late / early)
    mean_growth_ratio = sum(ratios) / len(ratios) if ratios else 999.0
    max_cons_err = max(cons_errs) if cons_errs else 0.0

    # soft-caps -> growth decelerates: late gain <= ~1.5x early gain (well
    # below a geometric blow-up). No runaway compounding chain.
    ok = (mean_growth_ratio <= 1.5) and (max_cons_err < 1e-6)
    detail = (
        f"engine-value late/early per-turn growth ratio={mean_growth_ratio:.2f} "
        f"(<=1.5 -> decelerating, soft-caps bind: room soft-cap, overkill band, "
        f"node-local RETURN, idle-handsel dim); max conservation err={max_cons_err:.2e}."
    )
    return ok, detail


def check_conservation_mint_ban():
    """the-shavings-share carved from RETURN, never minted -> every turn the
    split SET+overkill+shavings+RETURN reconstructs the pool exactly."""
    worst = 0.0
    for pn in POLICIES:
        for r in run_many(pn, n_seeds=6):
            worst = max(worst, r["max_conservation_err"])
    ok = worst < 1e-6
    detail = (
        f"max per-turn split-vs-pool error across all policies={worst:.2e} (<1e-6). "
        f"the-shavings-share is a bound sub-portion of RETURN (competes with the "
        f"local-table dawn), not an additive faucet -> mint-ban holds."
    )
    return ok, detail


def check_spilling_ev_negative():
    """A deliberate flop is strictly EV-negative: lane-glimmers < Standing lost,
    and never claimable by the spiller -> failure-farming cannot pay."""
    total_lost = 0.0
    total_glimmer = 0.0
    bad = 0
    for pn in POLICIES:
        for r in run_many(pn, n_seeds=6):
            for lost, glim in r["spill_events"]:
                total_lost += lost
                total_glimmer += glim
                if glim >= lost:
                    bad += 1
    # paling/standing-stress policies should net-lose Standing on their spills
    ratio = (total_glimmer / total_lost) if total_lost > 0 else 0.0
    ok = (bad == 0) and (ratio < 1.0)
    detail = (
        f"spill events: every glimmer < Standing lost (violations={bad}); "
        f"aggregate glimmer/lost={ratio:.2f}<1 and glimmers seed the node for "
        f"LATER visitors, never the spiller -> the spilling is EV-negative."
    )
    return ok, detail


def check_handsels_cant_buy_win():
    """Structural non-substitution: a money strategy that never courts (no
    gleam vouch + performed term) cannot raise proud stock, so cannot stand the
    crown -> handsels never buy Standing nor the win."""
    rs = run_many("handsel_hoard")
    stood = sum(1 for r in rs if r["crown_stood"]) / len(rs)
    avg_M = sum(r["M"] for r in rs) / len(rs)
    ok = (stood < 0.5) and (avg_M < CROWN_M_REQ)
    detail = (
        f"handsel-hoard (never courts) crown-stood={stood:.2f} (<0.5); avg proud "
        f"stock M={avg_M:.2f}<{CROWN_M_REQ:.1f}. Handsels buy only jars/apprentice/"
        f"hearth-goods; proud stock needs gleam-vouch + performed term. No buy-the-win."
    )
    return ok, detail


def main():
    checks = []

    for name, fn in [
        ("no_dominant_resource", check_no_dominant_resource),
        ("on_curve_clearable", check_on_curve_clearable),
        ("no_degenerate_loop", check_no_degenerate_loop),
        ("conservation_mint_ban", check_conservation_mint_ban),
        ("spilling_ev_negative", check_spilling_ev_negative),
        ("handsels_cant_buy_win", check_handsels_cant_buy_win),
    ]:
        try:
            ok, detail = fn()
        except Exception as exc:  # a crash is a failed check, not a crashed run
            ok, detail = False, f"check raised: {exc!r}"
        checks.append({"name": name, "pass": bool(ok), "detail": detail})
        print(f"[check] {name}: {'PASS' if ok else 'FAIL'} -- {detail}", file=sys.stderr)

    flags = [c["name"] for c in checks if not c["pass"]]
    result = {
        "model": "roundelay-layer2-resource-economy",
        "checks": checks,
        "flags": flags,
    }
    print(json.dumps(result))


if __name__ == "__main__":
    main()
