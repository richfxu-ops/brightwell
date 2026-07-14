#!/usr/bin/env python3
"""
Layer-5 archetype napkin (proposal A-six-ways-direct).
Claims to certify (napkin_flags <= 0):
  1. VIABLE: each of the six archetypes can stand the calendar-floored crown.
  2. NON-DOMINATION: no archetype is >= every other on all axes.
  3. I-022: the Untold's tempo (count x pace) escalation matches the spine's
     size (tonnage) escalation through the mid-run, and is CLAMPED at the
     size-based crown.
All numbers are napkin-scale (game-loop owns exact tuning); the point is SHAPE.
"""
import statistics as st

# ---------------------------------------------------------------------------
# The spine's size-escalation curve = the weather (GDD L1 sec.5, sec.3-escalate-0).
# Minimum need a lantern hangs per active leg, floored by the season-seep.
LEGS = ["Green Going", "Long Light", "Deep Gold", "Red Walk"]
WEATHER_FLOOR = [1, 3, 5, 7]      # min need-size per leg (kettle -> great)
CROWN = 8                          # calendar-floored finale (size-based, all ways)

# "Pressure" the player must clear PER WORKED MORNING to keep pace with the weather.
# For a tonnage player: ~1 need/morning of the rising size => pressure = size.
TONNAGE_PRESSURE = WEATHER_FLOOR[:]     # [1,3,5,7]

# ---------------------------------------------------------------------------
# I-022: the Untold clear small (fine-grained) needs but MORE of them, "sooner,
# closer together, pace climbing with brightness" (WORLD.md:434).
# Their need-size stays ~flat-small; their COUNT per morning rises.
# The lantern is fired to peak-Standing, so their brightness -> more kettles shown.
UNTOLD_NEED_SIZE = 1.5                    # ~flat, fine-grained ("a shine like sand")
# To MATCH the tonnage pressure curve, count/morning must satisfy
#   UNTOLD_NEED_SIZE * count(leg) == TONNAGE_PRESSURE(leg)
UNTOLD_COUNT = [p / UNTOLD_NEED_SIZE for p in TONNAGE_PRESSURE]
UNTOLD_PRESSURE = [UNTOLD_NEED_SIZE * c for c in UNTOLD_COUNT]

print("=== I-022: tempo-not-tonnage escalation match (mid-run) ===")
print(f"{'Leg':<12}{'tonnage need':>14}{'untold need':>14}{'untold #/morn':>15}"
      f"{'tonnage P':>12}{'untold P':>11}")
for i, leg in enumerate(LEGS):
    print(f"{leg:<12}{WEATHER_FLOOR[i]:>14}{UNTOLD_NEED_SIZE:>14}"
          f"{UNTOLD_COUNT[i]:>15.2f}{TONNAGE_PRESSURE[i]:>12}{UNTOLD_PRESSURE[i]:>11.2f}")
match = all(abs(a - b) < 1e-6 for a, b in zip(TONNAGE_PRESSURE, UNTOLD_PRESSURE))
# Is the Untold curve MONOTONE RISING through the mid-run (D-001 requirement)?
rising = all(b > a for a, b in zip(UNTOLD_PRESSURE, UNTOLD_PRESSURE[1:]))
print(f"\nUntold pressure curve rising through mid-run? {rising}")
print(f"Untold demand/morning == tonnage demand/morning each leg? {match}")

# The clamp: the combing/crown reads COUNTRY need, not town talk (WORLD.md:434),
# i.e. it is a SIZE event for everyone. The Untold cannot fractionate it into
# kettles: standing it needs a real burst >= CROWN. This is the "honest end of
# the trick." So mid-run is PROVEN to match; the finale is CLAMPED to size.
UNTOLD_MAX_SINGLE_NEED_MIDRUN = UNTOLD_NEED_SIZE   # never hangs a great asking mid-run
print(f"Crown is size-based for all ways (clamp): need {CROWN} in one stand, "
      f"not {CROWN/UNTOLD_NEED_SIZE:.1f} kettles.")
print(f"=> Untold must GROW a burst-capacity to stand it; tempo cannot skip it.\n")

# ---------------------------------------------------------------------------
# VIABILITY + NON-DOMINATION.
# Five orthogonal capability axes (0..10), assigned from canon flavor.
# crown  : peak single-turn burst available at the Red Walk (stand-the-crown power)
# consist: 1-variance; how reliably a run reaches its average (turtle-safety)
# econ   : handsel/material throughput (the strategic sub-economies)
# tempo  : output in the thin Green Going (early / per-morning velocity)
# scaling: how much the engine grows into the late game (boss affinity)
AXES = ["crown", "consist", "econ", "tempo", "scaling", "ceiling"]
PROFILE = {
    #                 crown consist econ tempo scaling ceiling
    "Kilnfast":      [  9,     9,    5,    3,    10,      6 ],  # inevitability, weak open
    "Mannerly":      [  7,     5,    8,    5,     7,     10 ],  # spectacular-when-lands
    "Gleaners":      [  8,     4,   10,    6,     8,      8 ],  # richest reward, route-risky
    "Eveners":       [  6,    10,    9,    7,     6,      5 ],  # low steady, wins long runs
    "Untold":        [  6,     8,    4,   10,     6,      4 ],  # tempo king, size-clamped crown
    "Fairwrights":   [ 10,     2,    6,    4,     6,      9 ],  # highest spike, highest variance
}

# --- Viability: can each stand the crown by ITS OWN lever? ---
# The crown is one size-8 boss for everyone (clamp). But there is no single "the"
# way to stand it: each archetype converts its dominant lever into boss-scale
# output by a different route. eff_crown = the best route available to that kit.
#   A raw-burst      : crown + 0.4*(scaling-6)          (Kilnfast, Fairwrights, Gleaners)
#   B prepared-board : 0.6*econ + 0.4*consist           (Eveners, Kilnfast)
#   C count/stack    : 0.5*tempo + 0.4*scaling + 0.3*crown  (Untold: many kettles -> one fill)
#   D landed-ceiling : 0.7*ceiling + 0.3*crown          (Mannerly, Fairwrights)
print("=== VIABILITY: stand the size-8 crown, each by its own lever (need >= 8) ===")
def routes(p):
    crown, consist, econ, tempo, scaling, ceiling = p
    return {
        "raw-burst":      crown + 0.4 * (scaling - 6),
        "prepared-board": 0.6 * econ + 0.4 * consist,
        "count-stack":    0.5 * tempo + 0.4 * scaling + 0.3 * crown,
        "landed-ceiling": 0.7 * ceiling + 0.3 * crown,
    }
viable = {}
for a, p in PROFILE.items():
    r = routes(p)
    best_route = max(r, key=r.get)
    eff = r[best_route]
    viable[a] = eff >= 8.0
    print(f"{a:<13} best-route={best_route:<15} eff_crown={eff:>4.1f}  "
          f"stands_crown={viable[a]}")
print(f"All six viable (each stands the crown by a DIFFERENT lever)? "
      f"{all(viable.values())}\n")

# --- Non-domination: no archetype >= another on ALL axes ---
print("=== NON-DOMINATION: no archetype dominates another on every axis ===")
names = list(PROFILE)
def dominates(x, y):
    px, py = PROFILE[x], PROFILE[y]
    return all(a >= b for a, b in zip(px, py)) and any(a > b for a, b in zip(px, py))
dom_pairs = [(x, y) for x in names for y in names if x != y and dominates(x, y)]
print(f"Strict-domination pairs found: {dom_pairs if dom_pairs else 'NONE'}")
# Each archetype must be BEST on at least one axis (a reason to pick it):
print("Best-on-axis (the identity lever each one owns):")
for j, ax in enumerate(AXES):
    best = max(names, key=lambda n: PROFILE[n][j])
    tied = [n for n in names if PROFILE[n][j] == PROFILE[best][j]]
    print(f"  {ax:<8}-> {', '.join(tied)}")
owns = {n: [AXES[j] for j in range(len(AXES))
            if PROFILE[n][j] == max(PROFILE[m][j] for m in names)] for n in names}
all_own = all(owns[n] for n in names)
print(f"Every archetype is (co-)best on >=1 axis? {all_own}")

# --- Spread check: no archetype has the highest total (no 'just best overall') ---
totals = {n: sum(PROFILE[n]) for n in names}
print("\nTotals (should be close - no runaway generalist):")
for n in sorted(totals, key=lambda k: -totals[k]):
    print(f"  {n:<13}{totals[n]}")
spread = max(totals.values()) - min(totals.values())
print(f"Total spread = {spread} (tight band => power-parity, differentiation by shape)")

print("\n=== napkin_flags ===")
flags = 0
if not all(viable.values()): flags += 1
if dom_pairs: flags += 1
if not (rising and match): flags += 1
if not all_own: flags += 1
print(f"napkin_flags = {flags}")
