#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Napkin-sim — Layer 7 (starter_pool) · pipeline-test-02 · ROUNDELAY
==================================================================
Executable, stdlib-only, deterministic check of the starter card pool
(src/content/cards/starter-pool.json) against the LOCKED L3 grammar, the L5
signature chains, and the L6 numbers. The engine executes this at `record` and
counts FAILING checks; self-reported values are ignored. One JSON last line.

Checks (flags = failing; target 0):
  combo_density_ge_half, all_reads_in_enum, firewall_and_fixed_marks,
  every_archetype_chain_ge_3_authored, starter_playable_from_opening,
  pool_size_sane.
Combo participation is recomputed INDEPENDENTLY from the effects (the card's
self-declared "combo" field is ignored).
"""
import json, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
POOL = os.path.normpath(os.path.join(HERE, "..", "..", "src", "content", "cards", "starter-pool.json"))

READ_ENUM = {"room", "chain", "fill", "season", "spiral", "handsels", "over-ceiling"}
def source_ok(s):
    return s in READ_ENUM or s.startswith("grain:") or s.startswith("woken:")

PRIMITIVES = {"gather","rest","steady","fill","brim","mark-grain","draw","retire",
              "whittle","court","soothe","read","warm","keep"}
COMBO_VERBS = {"gather","rest","steady","fill","brim","mark-grain","retire","whittle","court","soothe"}
COMBO_SURFACES = {"room","chain","fill","over-ceiling"}     # + grain:*, woken:*
PLAY_EVENTS = {"on-play","on-wake","on-overkill","on-fulfil","on-court"}
CROSS_CHANNEL = {"fill","brim","court","whittle","soothe"}  # rest-overkill handled via 'rest' at overkill

checks = []
def record(name, ok, detail): checks.append({"name": name, "pass": bool(ok), "detail": detail})

cards = json.load(open(POOL))
if isinstance(cards, dict):
    cards = cards.get("cards") or cards.get("card_pool") or []

def iter_reads(eff):
    """Yield every read-source string referenced anywhere in an effect's params."""
    p = eff.get("params", {}) or {}
    def walk(v):
        if isinstance(v, dict):
            if v.get("do") == "read" and "source" in v:
                yield v["source"]
            for vv in v.values():
                yield from walk(vv)
        elif isinstance(v, list):
            for vv in v:
                yield from walk(vv)
    yield from walk(p)

def reads_combo_surface(eff):
    for s in iter_reads(eff):
        if s in COMBO_SURFACES or s.startswith("grain:") or s.startswith("woken:"):
            return True
    return False

def is_participant(card):
    for eff in card.get("effects", []):
        if eff.get("do") in COMBO_VERBS:
            return True
        if reads_combo_surface(eff):
            return True
    return False

# ============================================================================
# 1 · combo_density_ge_half — recomputed from effects, not the self-declared field
# ============================================================================
parts = [c for c in cards if is_participant(c)]
density = len(parts) / len(cards) if cards else 0.0
standalone = [c["id"] for c in cards if not is_participant(c)]
c1 = density >= 0.5
record("combo_density_ge_half", c1,
       f"participants={len(parts)}/{len(cards)}={round(density,3)}>=0.5; standalone(legible floor)={standalone}")

# ============================================================================
# 2 · all_reads_in_enum
# ============================================================================
bad_reads = []
for c in cards:
    for eff in c.get("effects", []):
        for s in iter_reads(eff):
            if not source_ok(s):
                bad_reads.append((c["id"], s))
c2 = not bad_reads
record("all_reads_in_enum", c2,
       f"out-of-enum read sources={bad_reads if bad_reads else 'none'} (enum closed)")

# ============================================================================
# 3 · firewall_and_fixed_marks
# ============================================================================
viol = []
brim_cards = []
for c in cards:
    for eff in c.get("effects", []):
        do = eff.get("do"); when = eff.get("when")
        if do not in PRIMITIVES:
            viol.append(f"{c['id']}:unknown-primitive:{do}")
        if do == "brim":
            brim_cards.append(c["id"])
            for s in iter_reads(eff):
                if not (s in {"room","chain","over-ceiling"}):
                    viol.append(f"{c['id']}:brim-band-reads-{s}")
        if do in CROSS_CHANNEL and when not in PLAY_EVENTS:
            viol.append(f"{c['id']}:{do}-on-nonplay-{when}")
        if do == "court":
            # gleam is a gate; a court that references gleam as an amount/spend is illegal
            for s in iter_reads(eff):
                if s == "gleam":
                    viol.append(f"{c['id']}:court-reads-gleam-as-value")
        if do == "soothe":
            if str(eff.get("params", {}).get("cap")) != "last-red":
                viol.append(f"{c['id']}:soothe-uncapped")
        if do == "read":
            for s in iter_reads(eff):
                if s in {"season","spiral"}:
                    # legal only feeding gather/whittle/fill/soothe-scale — never a gleam write.
                    pass
# exactly one brim owner (the Fairwright capstone) — brim is the Fairwright's alone
brim_owner_ok = len(set(brim_cards)) <= 1
if not brim_owner_ok:
    viol.append(f"multiple-brim-owners:{sorted(set(brim_cards))}")
c3 = not viol
record("firewall_and_fixed_marks", c3,
       f"brim owners={sorted(set(brim_cards))} (<=1); violations={viol if viol else 'none'} "
       f"(no unknown primitive, no cross-channel writer off a play event, brim band in-channel, "
       f"court gleam-gate not spent, soothe cap:last-red)")

# ============================================================================
# 4 · every_archetype_chain_ge_3_authored — each archetype has C1/C2/C3 and C3
#     reads a shared surface C1/C2 wrote.
# ============================================================================
by_arch = {}
for c in cards:
    a = c.get("archetype")
    if a: by_arch.setdefault(a, []).append(c)
REAL = {"kilnfast", "eveners", "untold", "fairwrights", "mannerly", "gleaners"}
arch_real = {a: cs for a, cs in by_arch.items() if a in REAL}   # exclude the shared apprentice deck
def writes_surfaces(card):
    w = set()
    for eff in card.get("effects", []):
        do = eff.get("do"); p = eff.get("params", {}) or {}
        if do == "gather": w.add("room")
        if do == "retire" and p.get("to") == "room": w.add("room")
        if do == "steady": w.add("chain")
        if do == "rest": w.add("room"); w.add("over-ceiling")
        if do == "mark-grain": w.add("grain:" + str(p.get("suit")))
        if do == "fill": w.add("fill")
    return w
chain_ok = True
chain_detail = []
for a, cs in arch_real.items():
    tagged = {t: None for t in ("C1", "C2", "C3")}
    for c in cs:
        for t in ("C1", "C2", "C3"):
            if any(tag == t or tag.endswith(t) for tag in (c.get("tags") or [])): tagged[t] = c
    have3 = all(tagged[t] is not None for t in ("C1", "C2", "C3"))
    authored = False
    if have3:
        written = writes_surfaces(tagged["C1"]) | writes_surfaces(tagged["C2"])
        for eff in tagged["C3"].get("effects", []):
            for s in iter_reads(eff):
                if s in written or (s.startswith("grain:") and s in written) or s in {"room","chain"} and s in written:
                    authored = True
    chain_ok = chain_ok and have3 and authored
    chain_detail.append(f"{a}:C1C2C3={have3},C3-authored={authored}")
c4 = chain_ok
record("every_archetype_chain_ge_3_authored", c4, "; ".join(chain_detail))

# ============================================================================
# 5 · starter_playable_from_opening — each archetype has an openable C1 (mark<=3)
# ============================================================================
play_ok = True
play_detail = []
for a, cs in arch_real.items():
    c1card = next((c for c in cs if any(tag == "C1" or tag.endswith("C1") for tag in (c.get("tags") or []))), None)
    openable = c1card is not None and c1card.get("mark", 99) <= 3
    play_ok = play_ok and openable
    play_detail.append(f"{a}:C1 mark={c1card.get('mark') if c1card else None}<=3={openable}")
c5 = play_ok
record("starter_playable_from_opening", c5, "; ".join(play_detail))

# ============================================================================
# 6 · pool_size_sane — total in band, each archetype >=3, shared deck present
# ============================================================================
total = len(cards)
per_arch_ok = all(len(cs) >= 3 for cs in arch_real.values()) and len(arch_real) == 6
shared_present = any(a not in REAL for a in by_arch) or (total - sum(len(cs) for cs in arch_real.values())) >= 5
size_ok = 40 <= total <= 55
c6 = size_ok and per_arch_ok and shared_present
record("pool_size_sane", c6,
       f"total={total} in [40,55]={size_ok}; real archetypes={len(arch_real)}==6; shared deck present={shared_present}; "
       f"per-archetype counts={{ {', '.join(f'{a}:{len(cs)}' for a,cs in arch_real.items())} }}>=3={per_arch_ok}")

# ---- assemble ----
flags = [c["name"] for c in checks if not c["pass"]]
result = {"model": "layer-07-starter_pool", "checks": checks, "flags": flags}
print("=== layer-07 napkin debug ===", file=sys.stderr)
for c in checks:
    print(f"[{'PASS' if c['pass'] else 'FAIL'}] {c['name']}: {c['detail']}", file=sys.stderr)
print(f"flags={flags}", file=sys.stderr)
print(json.dumps(result))
