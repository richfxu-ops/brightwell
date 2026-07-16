---
status: Complete
size: Large
created: 2026-07-16
completed: 2026-07-16
title: Card fix pass
---

> **Superseded after Part 1 by [way-rebuild](way-rebuild.md) (D-024).** Part 1 (trivializer nerfs)
> shipped and stands; Parts 2–3 are absorbed into the rebuild program; Part 4's difficulty knobs
> fold into the rebuild's final phase.

## Context

Step 4 of the balance strategy: act on the first real balance findings
(`docs/balance-findings-2026-07-16.html`, D-023 telemetry). Measured problems: the fill-first
exploit line beats every Way's identity line (gaps up to +42 pts); `the-long-tally` alone produces
15% of all exploit fill; 15 cards are dead; Eveners (8%) and Mannerly (16%) barely function played
as designed. Every change here is verified the same way: `npm run sim && npm run audit`, watching
the exploit gaps, dead count, and flag counts move.

This task absorbs the [card-quality-rubric](card-quality-rubric.md) plan item "fix the cards the
audit + lint flag" (that task keeps card-lint + the card-smith brief). The M4 numeric obligations
(I-022 Untold coefficients; I-044/I-045) route into Parts 1 and 4.

## Approach

Four parts, each its own branch/PR, sim-verified before the next starts. All card changes are data
over the locked 14 primitives — `Amount` is a flat number or a bare read (`vocabulary.ts:31`); there
are **no caps or coefficients** in card data, so the levers are: swap a read source, retune
mark/ceiling/woken_delight, or add/remove effects. If a fix genuinely needs a capped/scaled amount,
that's a vocabulary change — a logged decision, proposed separately, not slipped in.

- **Part 1 · Nerf the trivializers.**
  - `the-long-tally` (Untold capstone): its fill reads `woken:thread` — Kilnfast-style audience
    scaling on the Way whose canon win-path is *chain*-fill (GDD Way table), at mark 5 when canon
    capstones sit at mark 7–8. Fix = identity correction + calibration: fill reads `chain`, mark
    5→7. Both a nerf and a canon repair; resolves its I-022 entanglement in the simplest way first.
  - `ring-up-the-lanterns` + `string-the-bunting` (Fairwrights room-builders): `gather` reads
    `room` — a room snowball any Way can draft (+54% off-Way win delta). Fix: read `woken:dance`
    instead — scales with the Fairwrights' own woken audience, near-useless as an off-Way splash.
  - Audit gap found while designing: a tag-assigned capstone with an out-of-band mark (the-long-tally,
    mark 5) passes R4 because only woken_delight is checked. Extend the R4 check to also flag mark
    outside the tier's range — the-long-tally's flag then disappears exactly when the nerf lands.
  - Success: exploit gaps shrink (esp. eveners/mannerly/apprentice), long-tally exploit-fill share
    ≪ 15%, no Way's identity win rate collapses.
  - **Results (2026-07-16, 50 seeds/cohort).** Gaps (way→exploit wins): apprentice +32→+10,
    eveners +42→+28, mannerly +36→+30, gleaners +14→**−4** (first Way whose identity beats its
    exploit line); totals identity 131→99, exploit 200→146 — the game got harder everywhere.
    Long-tally: 15%→3% exploit-fill share, all flags cleared. **Exception: Untold identity
    collapsed 27→10.** A controlled variant (proud-only, mark 6) restored almost nothing (11 wins)
    — the collapse comes from losing the woken-count read itself: the card *was* the Way's engine.
    Untold therefore joins Part 3's kit-completion scope. Side effects: the next fill engines
    surfaced (`the-whole-fair-turn` 12%, `feed-the-crown` 11% of exploit fill; fairwrights gap grew
    +6→+16 on the latter) and the R4 mark-range check found 9 miscalibrated cards — both queue as
    a Part-1 batch 2 / Part 2 input.
- **Part 2 · Repair the dead 15, by group.**
  - *Pale-route readers* (`walk-the-pale`, `pale-harvest`, `mend-the-verge`): they read
    `spiral` (current node's rings — ~0 early) and `season` (small per-leg constant), so they're
    near-dead early and merely weak late. Decide per card: re-point the early read, add a flat
    floor (e.g. `gather 2` + the spiral read as upside), or lean in and make rings-camping a real
    Gleaner strategy. Needs the numbers checked against actual ring accrual in records.
  - *D-022 Q4 leftovers* (`even-the-rim`, `seasoned-timber`, `silver-warm-up`, …): the trickle
    clauses are already gone; they're dead from unattractiveness. Give each the on-identity ability
    D-022 ordered, sized to its band.
  - *Shared chaff* (`first-step`, `grey-bowl`, `hearth-hum`, `kettle-loaf`, `loose-thread`,
    `pegged-bench`, `sprig-trestle`): give each a real job or cut it; decide pool-size impact
    (97→90 if all cut) against Fair variety before cutting.
  - Success: dead count trends toward 0 with no new dominant flags.
- **Part 3 · Complete the Eveners + Mannerly + Untold identity loops (R7).** (Untold added after
  Part 1: its kit collapsed without the long-tally crutch — same one-card disease.) Mannerly's only working pieces
  are its two song-fillers (+49/+40 deltas inside a losing cohort) — the rest of the kit is drag;
  Eveners' chain-fill payoff is so weak the bots skip it. Per Way: make the seeded
  filler + builder + payoff loop strong enough that the identity line beats the exploit line.
  Likely includes bot-policy sanity checks (a kit can look dead because the bot won't play it).
  - Success: each Way's identity win rate ≥ its exploit win rate — the headline goal of the whole
    strategy.
- **Part 4 · Global difficulty knobs, last.** Only after cards settle: crown demand (20), asking
  tier `need_fill`, Paling pressure — plus the deferred I-044/I-045 sizing checks. Tuning
  difficulty while cards are broken bakes the brokenness in. Human "too easy" is measured against
  the exploit bot's post-fix win rate, not the identity bots'.

## Decisions

- **Data levers only; vocabulary stays locked.** Any fix needing capped/scaled amounts becomes its
  own logged proposal instead (see Approach).
- **Nerf by identity-correction where possible** (long-tally → chain-read; lanterns → woken:dance)
  rather than raw stat taxes — it fixes the number *and* the "cards all play the same" complaint at
  once.
- **Parts are sequential and sim-gated** — each part's success metric must hold before the next
  starts, so a regression is attributable to one batch.
- **Variant A over B for the long-tally (2026-07-16).** Capstone mark 7 (A) vs proud-only mark 6
  (B) measured head-to-head: B doesn't restore Untold (11 vs 10 wins) and worsens kilnfast (12 vs
  19). Kept A — canon-cleaner and better overall; the Untold repair belongs to Part 3, not to
  re-buffing the one card that masked the problem.

## Plan

- [x] Part 1 — nerf `the-long-tally` (fill→chain, mark 7), `ring-up-the-lanterns` +
      `string-the-bunting` (gather→woken:dance); extend R4 to check tier mark ranges; re-sim,
      re-audit, record before/after gaps in the task file — done; results + the Untold exception
      recorded above, pending review
- [ ] Part 2 — dead-15 repairs by group (pale-route floors, Q4 on-identity abilities, chaff
      jobs-or-cuts); re-sim; dead count recorded
- [ ] Part 3 — Eveners + Mannerly loop completion (per-Way design + bot-policy sanity check);
      re-sim; identity-vs-exploit per Way recorded
- [ ] Part 4 — difficulty knobs + I-044/I-045; final balance readout vs GDD targets
- [ ] Findings report v2 (`docs/balance-findings-*.html`, auto-appears in the codex Reports shelf);
      update DECISIONS.md; Review Card
