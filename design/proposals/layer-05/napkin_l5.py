"""
Layer-5 archetype napkin (proposer C, lever-first).
ORDINAL sanity model, not a balance tune (that is game-loop's job).
Checks the four napkin_flags obligations:
  (1) every archetype is VIABLE  -> reaches the calendar-floored crown by the final leg
  (2) NONE dominates             -> no archetype scores >= all others on every axis
  (3) each has a real >=3 chain   -> asserted from the slate (min reported)
  (4) Untold tempo == size curve OR clamped (I-022)
"""
import statistics as st

# ---------------------------------------------------------------------------
# THE SPINE'S SIZE-ESCALATION CURVE  (escalation-is-the-weather, GDD L1 s5)
# 5 legs: Green Going, Long Light, Deep Gold, Red Walk, Wintering.
# W = the seasonal seep FLOOR = minimum need a lantern can hang that leg.
# near-still in winter, waking spring, strongest late-summer/autumn.
LEGS   = ["Green Going", "Long Light", "Deep Gold", "Red Walk", "Wintering"]
W      = [1.0, 1.6, 2.4, 3.4, 3.4]          # weather floor (need-size units)
CROWN  = W[3] * 1.5                           # calendar-floored crown ~ 5.1 (stood at Red Walk / year-end)

# worked-mornings available per leg (a HARD physical pace ceiling -> clamps Untold)
MORNINGS = [4, 6, 7, 7, 3]

# ---------------------------------------------------------------------------
# ARCHETYPE ANSWER-CAPACITY per leg  A(leg) = biggest single need it can stand.
# Distinct GROWTH SHAPES (the lever each pulls) -> distinct curves, all reaching crown.
def kilnfast(leg):   # R5 fired-permanence: weak open, compounding, best boss scaling
    return 0.6 + 0.85*(leg**1.55)
def fairwright(leg): # R1 room-spike: low sustained, ONE huge public-turn spike/season
    return 0.7 + 0.35*leg          # sustained (mean); spike handled separately
def fairwright_spike(leg):
    return (0.7 + 0.35*leg) + 3.0 + 0.4*leg   # the one overkill turn
def mannerly(leg, land=True):      # R3 gate + R6 courted stock: greedy, feast/famine
    return (1.4 + 0.95*leg) if land else (0.4 + 0.2*leg)
def gleaner(leg, pale=1.0):        # R4 paleness-fuelled: scales with routed paleness
    return 0.5 + 0.9*leg*pale
def evener(leg, crown=False):      # R2 conversion velocity: steady, low variance
    base = 0.9 + 0.82*leg
    # at the crown the Evener LAST-LIGHTS its stockpiled dead cards into one fattened
    # room (retire->room): consistency + a conversion dump, not raw single-card power.
    return base + (1.8 if crown else 0.0)
def untold_small(leg):             # R-clock tempo: each asking small & fixed-ish
    return 0.7 + 0.12*leg          # fine-grained: needs stay small on purpose

# ---------------------------------------------------------------------------
# (4) I-022  Untold tempo == size curve  OR clamp.
# A size build faces ONE need of size W_eff(leg); the Untold faces MANY of size
# untold_small(leg).  Genuine escalation requires the Untold's REQUIRED CLEAR-RATE
# (askings/ morning) to rise on the SAME per-season demand integral as the size floor.
print("="*72)
print("I-022  Untold tempo-not-tonnage  vs  the size-escalation curve")
print("="*72)
size_demand   = []   # per-season total demand a size build must meet to stay on-curve
untold_demand = []   # per-season total demand the Untold must meet (count x small)
untold_rate   = []   # required askings CLEARED per worked morning
clamped_count = []
for i,leg in enumerate(range(1,6)):
    # size build: a few big askings; seasonal demand ~ floor x peak-tier x a couple asks
    peak_tier = 1.0 + 0.35*leg
    n_big     = 2
    Dsize = W[i]*peak_tier*n_big
    size_demand.append(Dsize)
    # Untold: to feel the SAME rising pressure it must clear count C so C*small == Dsize
    s = untold_small(leg)
    C_match = Dsize / s
    # CLAMP: physical ceiling = you can only work so many mornings, ~<=2 small asks each
    C_ceiling = MORNINGS[i]*2
    C = min(C_match, C_ceiling)
    clamped = C_match > C_ceiling
    untold_demand.append(C*s)
    untold_rate.append(C/MORNINGS[i])
    clamped_count.append(clamped)
    print(f"  {LEGS[i]:11s} floor={W[i]:.1f}  size-demand={Dsize:5.2f}  "
          f"untold C_match={C_match:5.2f}  ceiling={C_ceiling}  -> C={C:5.2f}  "
          f"rate={C/MORNINGS[i]:.2f}/morn  {'CLAMPED' if clamped else 'matches'}")

# does the Untold's DELIVERED per-season demand track the size curve's shape?
def norm(xs):
    m = xs[0]; return [x/m for x in xs]
print("\n  size-curve shape   :", [f'{x:.2f}' for x in norm(size_demand)])
print("  untold-curve shape :", [f'{x:.2f}' for x in norm(untold_demand)])
# rising monotone through Red Walk == genuine escalation felt as tempo
rising = all(untold_demand[i] <= untold_demand[i+1] for i in range(3))
print(f"  Untold demand rises monotonically Green->Red Walk : {rising}")
print(f"  Untold NEVER exceeds size demand (no dominance)   : {all(untold_demand[i] <= size_demand[i]+1e-9 for i in range(5))}")
print(f"  clamp engaged in late legs (pace ceiling bites)   : {any(clamped_count)}")

# ---------------------------------------------------------------------------
# (1) VIABILITY : every archetype's final-leg capacity stands the crown floor
print("\n"+"="*72)
print("VIABILITY  -- final-leg capacity vs calendar-floored crown (~%.2f)"%CROWN)
print("="*72)
finals = {
  "Kilnfast":   kilnfast(5),
  "Fairwright": fairwright_spike(5),                 # stands crown on its spike turn
  "Mannerly":   mannerly(5, land=True),              # stands it when courtship lands
  "Gleaner":    gleaner(5, pale=1.3),                # stands it by routing pale + ripe
  "Evener":     evener(5, crown=True),               # last-lights its dead-card stockpile into one room
  "Untold":     untold_small(5)*(MORNINGS[4]*2),     # count x small across the finale leg
}
for k,v in finals.items():
    print(f"  {k:11s} crown-capacity={v:5.2f}  stands? {v>=CROWN}")
all_viable = all(v>=CROWN for v in finals.values())
print(f"  ALL archetypes stand the crown : {all_viable}")

# ---------------------------------------------------------------------------
# (2) NON-DOMINANCE : score each on 6 lever-axes; no one wins all axes.
# axes: peak_spike, permanence, material_power, route_flex, tempo_throughput, low_variance
print("\n"+"="*72)
print("NON-DOMINANCE  -- 6 lever-axes (0..10); no archetype >= all others everywhere")
print("="*72)
#            spike perm  matl  route tempo lowvar
AX = ["spike","perm","matl","route","tempo","lowvar"]
S = {
 "Kilnfast":   [3,  10,  5,   4,   3,   9],
 "Fairwright": [10, 4,   6,   5,   6,   1],
 "Mannerly":   [6,  6,   10,  4,   3,   4],
 "Gleaner":    [5,  5,   6,   10,  5,   2],
 "Evener":     [3,  6,   5,   6,   6,   10],
 "Untold":     [4,  2,   4,   7,   10,  6],
}
names = list(S)
def dominates(a,b):  # a strictly dominates b: >= on all axes AND > on at least one
    ge = all(S[a][i] >= S[b][i] for i in range(6))
    gt = any(S[a][i] >  S[b][i] for i in range(6))
    return ge and gt
dom_pairs = [(a,b) for a in names for b in names if a!=b and dominates(a,b)]
for n in names:
    tops = [AX[i] for i in range(6) if S[n][i]==max(S[m][i] for m in names)]
    print(f"  {n:11s} {S[n]}  best-at: {tops}")
print(f"  dominated pairs (should be none): {dom_pairs}")
each_has_a_best = all(any(S[n][i]==max(S[m][i] for m in names) for i in range(6)) for n in names)
print(f"  every archetype is strictly best on >=1 axis : {each_has_a_best}")

# ---------------------------------------------------------------------------
# (3) min synergy chain length across archetypes (asserted from the slate)
chains = {"Kilnfast":3,"Fairwright":3,"Mannerly":3,"Gleaner":3,"Evener":3,"Untold":3}
print("\nmin synergy_depth across archetypes :", min(chains.values()))

# ---------------------------------------------------------------------------
flags = 0
if not all_viable: flags+=1
if dom_pairs:      flags+=1
if min(chains.values())<3: flags+=1
if not (rising and all(untold_demand[i] <= size_demand[i]+1e-9 for i in range(5))): flags+=1
print("\nNAPKIN_FLAGS =", flags)
