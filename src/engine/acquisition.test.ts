// acquisition.test.ts — Phase 6 Part 1: the deck grows (the glad-load taught card) and thins
// (the release valve). All acquired pieces arrive inert; all rolls are seeded (a run replays).
import { describe, it, expect } from "vitest";
import type { Grain } from "./vocabulary.js";
import { createInitialState } from "./state.js";
import { payGladLoad } from "./asking.js";
import {
  ACQUISITION_TUNABLES, cardTierOf, draftFair, fairCostOf, JOURNEY_POOL, mintPiece,
  releaseCard, rollFair, standingUnlockedTier, teachGladLoad,
} from "./acquisition.js";
import { testState, testPiece } from "./test-helpers.js";

const SHARED_IDS = new Set([
  "sprig-trestle", "pegged-bench", "loose-thread", "kettle-loaf", "hearth-hum", "grey-bowl", "first-step",
]);

describe("mintPiece", () => {
  it("mints an inert piece with a run-unique id, appends it, and advances the ordinal", () => {
    const s = testState();
    const ord = s.nextPieceOrdinal;
    const a = mintPiece(s, "loose-thread", "pack");
    const b = mintPiece(s, "loose-thread", "pack");
    expect(a.fired).toBe(false);
    expect(a.set).toBe(0);
    expect(a.zone).toBe("pack");
    expect(a.instanceId).not.toBe(b.instanceId);   // same card, distinct instances
    expect(s.nextPieceOrdinal).toBe(ord + 2);
    expect(s.pieces).toHaveLength(2);
  });
});

describe("the acquirable pool", () => {
  it("is the journey-pieces only — never an apprentice/shared card", () => {
    expect(JOURNEY_POOL.length).toBeGreaterThan(0);
    for (const c of JOURNEY_POOL) expect(SHARED_IDS.has(c.id)).toBe(false);
  });
});

describe("teachGladLoad", () => {
  it("teaches exactly one inert journey-piece into the pack and emits it", () => {
    const s = testState();
    teachGladLoad(s);
    expect(s.pieces).toHaveLength(1);
    const taught = s.pieces[0];
    expect(taught.fired).toBe(false);
    expect(taught.zone).toBe("pack");
    expect(SHARED_IDS.has(taught.cardId)).toBe(false);
    expect(s.events.some(e => e.type === "taught" && e.data?.cardId === taught.cardId)).toBe(true);
  });

  it("is deterministic — the same seed teaches the same card", () => {
    const a = testState(x => { x.rng = { seed: 42, counter: 0 }; });
    const b = testState(x => { x.rng = { seed: 42, counter: 0 }; });
    teachGladLoad(a);
    teachGladLoad(b);
    expect(a.pieces[0].cardId).toBe(b.pieces[0].cardId);
  });

  it("leans into the maker's Way — a dominant gleam-grain is over-represented", () => {
    // dance is the brightest grain; over many seeds the taught grain should skew far past its
    // uniform share (weight GLAD_GRAIN_WEIGHT tickets vs 1).
    const N = 300;
    const uniform = JOURNEY_POOL.filter(c => c.grain === "dance").length / JOURNEY_POOL.length;
    let danceCount = 0;
    for (let seed = 0; seed < N; seed++) {
      const s = testState(x => { x.rng = { seed, counter: 0 }; x.player.gleamGrain.dance = 5; });
      teachGladLoad(s);
      const taught = JOURNEY_POOL.find(c => c.id === s.pieces[0].cardId) as { grain: Grain };
      if (taught.grain === "dance") danceCount++;
    }
    expect(danceCount / N).toBeGreaterThan(uniform + 0.2);   // meaningfully weighted, not chance
  });
});

describe("releaseCard (last-light)", () => {
  it("removes an un-woken piece, caps at one a morning, and refuses a woken one", () => {
    const s = testState(x => {
      x.turn.dawned = true;
      x.pieces = [
        testPiece("loose-thread", { instanceId: "u1", zone: "pack", fired: false }),
        testPiece("loose-thread", { instanceId: "u2", zone: "pack", fired: false }),
        testPiece("hearth-hum", { instanceId: "w1", zone: "pack", fired: true }),
      ];
    });
    expect(releaseCard(s, "u1")).toBe(true);
    expect(s.pieces.find(p => p.instanceId === "u1")).toBeUndefined();
    expect(s.turn.releasedThisMorning).toBe(1);
    expect(s.events.some(e => e.type === "released" && e.data?.cardId === "loose-thread")).toBe(true);

    // capped: a second release the same morning is refused, the piece stays
    expect(releaseCard(s, "u2")).toBe(false);
    expect(s.pieces.find(p => p.instanceId === "u2")).toBeDefined();
    expect(s.turn.releasedThisMorning).toBe(1);
  });

  it("refuses to last-light a fired (woken) piece", () => {
    const s = testState(x => {
      x.turn.dawned = true;
      x.pieces = [testPiece("hearth-hum", { instanceId: "w1", zone: "pack", fired: true })];
    });
    expect(releaseCard(s, "w1")).toBe(false);
    expect(s.pieces).toHaveLength(1);
    expect(s.events.some(e => e.type === "refused" && e.data?.do === "release")).toBe(true);
  });
});

describe("the glad-load teaches on fulfil (payGladLoad integration)", () => {
  it("an ordinary fulfil grows the deck by one taught piece; fulfilled carries taught:true", () => {
    const s = createInitialState(7);
    s.pieces = [];   // isolate the taught piece
    s.asking = {
      tier: "poem", needFill: 5, progress: 5, acceptedMorning: 1, acceptedLeg: 0,
      staleAfterMornings: 99, touched: true,
    };
    payGladLoad(s);
    expect(s.pieces).toHaveLength(1);
    expect(s.pieces[0].fired).toBe(false);
    expect(s.events.some(e => e.type === "fulfilled" && e.data?.taught === true)).toBe(true);
    expect(s.asking).toBeNull();
  });

  it("standing the crown does NOT teach — its stand ends the run this play", () => {
    const s = createInitialState(7);
    s.pieces = [];
    s.asking = {
      tier: "crown", needFill: 10, progress: 10, acceptedMorning: 25, acceptedLeg: 4,
      staleAfterMornings: 99, touched: true,
    };
    payGladLoad(s);
    expect(s.pieces).toHaveLength(0);
    expect(s.crownStood).toBe(true);
    expect(s.events.some(e => e.type === "fulfilled" && e.data?.taught === false)).toBe(true);
  });
});

describe("standingUnlockedTier / fairCostOf", () => {
  it("gleam opens richer tiers by the bands (6·12)", () => {
    expect(standingUnlockedTier(0)).toBe(1);
    expect(standingUnlockedTier(5)).toBe(1);
    expect(standingUnlockedTier(6)).toBe(2);
    expect(standingUnlockedTier(12)).toBe(3);
    expect(standingUnlockedTier(20)).toBe(3);
  });

  it("apprentice-floor tiers are bought, the proud tier is courted", () => {
    const apprentice = JOURNEY_POOL.find(c => c.tier === 1) as { id: string };
    const proud = JOURNEY_POOL.find(c => c.tier === ACQUISITION_TUNABLES.PROUD_TIER) as { id: string };
    expect(fairCostOf(apprentice.id)).toEqual({ kind: "handsel", price: 1 });
    expect(fairCostOf(proud.id)).toEqual({ kind: "court", termChain: ACQUISITION_TUNABLES.PROUD_TERM_CHAIN });
    expect(cardTierOf(proud.id)).toBe(3);
  });
});

describe("rollFair", () => {
  it("offers OFFER_N unowned journey-pieces, gated to the Standing-unlocked tier, deterministically", () => {
    const a = createInitialState(9);
    const b = createInitialState(9);
    rollFair(a);
    rollFair(b);
    expect(a.turn.fairOffers).toEqual(b.turn.fairOffers);          // same seed → same row
    expect(a.turn.fairOffers).toHaveLength(ACQUISITION_TUNABLES.OFFER_N);
    const owned = new Set(a.pieces.map(p => p.cardId));
    for (const id of a.turn.fairOffers) {
      expect(owned.has(id)).toBe(false);                            // never a card you already hold
      expect(cardTierOf(id)).toBeLessThanOrEqual(standingUnlockedTier(a.player.gleam));  // gated (tier 1 at gleam 5)
    }
    expect(new Set(a.turn.fairOffers).size).toBe(a.turn.fairOffers.length);   // no duplicate offers
  });

  it("widens the row as Standing rises — proud cards only appear once gleam opens tier 3", () => {
    const dim = createInitialState(3);            // gleam 5 → tier 1 only
    rollFair(dim);
    expect(Math.max(...dim.turn.fairOffers.map(cardTierOf))).toBe(1);
    const bright = createInitialState(3);
    bright.player.gleam = 20;                     // tier 3 open
    rollFair(bright);
    expect(Math.max(...bright.turn.fairOffers.map(cardTierOf))).toBeGreaterThan(1);
  });

  it("stays within the gate when the unlocked tier is drafted out — no backdoor to higher stock", () => {
    const s = createInitialState(4);              // gleam 5 → tier 1 only
    for (const c of JOURNEY_POOL.filter(c => c.tier === 1)) mintPiece(s, c.id, "pack");
    rollFair(s);
    expect(s.turn.fairOffers).toHaveLength(0);    // drafted out the gate → empty, NOT tier 2/3
    s.player.gleam = 20;                          // raise Standing → the row repopulates with what it opens
    rollFair(s);
    expect(s.turn.fairOffers.length).toBeGreaterThan(0);
    expect(Math.max(...s.turn.fairOffers.map(cardTierOf))).toBeGreaterThan(1);
  });
});

describe("draftFair — the hybrid cost", () => {
  it("bands 1–2 are bought with handsels; the take mints an inert piece and caps at 3/morning", () => {
    const s = testState(x => {
      x.turn.dawned = true;
      x.player.handsels = [1, 2, 3, 4].map(() => ({ brightness: 2 as const, idleMornings: 0 }));
    });
    const t1 = JOURNEY_POOL.filter(c => c.tier === 1).slice(0, 4).map(c => c.id);
    s.turn.fairOffers = [...t1];
    expect(draftFair(s, t1[0])).toBe(true);
    expect(s.pieces.some(p => p.cardId === t1[0] && !p.fired && p.zone === "pack")).toBe(true);
    expect(s.player.handsels).toHaveLength(3);              // paid 1
    expect(s.turn.fairOffers).not.toContain(t1[0]);        // drafted offers leave the row
    expect(draftFair(s, t1[1])).toBe(true);
    expect(draftFair(s, t1[2])).toBe(true);
    expect(draftFair(s, t1[3])).toBe(false);               // capped at DRAFT_PER_MORNING (3)
    expect(s.turn.draftedThisMorning).toBe(3);
  });

  it("refuses a handsel take you can't afford, and one that isn't on offer", () => {
    const s = testState(x => { x.turn.dawned = true; x.player.handsels = []; });
    const t1 = JOURNEY_POOL.find(c => c.tier === 1) as { id: string };
    s.turn.fairOffers = [t1.id];
    expect(draftFair(s, t1.id)).toBe(false);               // 0 handsels
    expect(draftFair(s, "not-offered")).toBe(false);       // not in the row
    expect(s.pieces).toHaveLength(0);
  });

  it("the proud tier is courted — refused until the term is performed, and no coin leaves", () => {
    const proud = JOURNEY_POOL.find(c => c.tier === ACQUISITION_TUNABLES.PROUD_TIER) as { id: string };
    const s = testState(x => {
      x.turn.dawned = true; x.turn.chainLinks = 0;
      x.player.handsels = [{ brightness: 2, idleMornings: 0 }];
      x.turn.fairOffers = [proud.id];
    });
    expect(draftFair(s, proud.id)).toBe(false);            // chain 0 < PROUD_TERM_CHAIN
    s.turn.chainLinks = ACQUISITION_TUNABLES.PROUD_TERM_CHAIN;
    expect(draftFair(s, proud.id)).toBe(true);             // term performed
    expect(s.player.handsels).toHaveLength(1);             // gleam gated, term performed — no coin spent
    expect(s.pieces.some(p => p.cardId === proud.id)).toBe(true);
    expect(s.events.some(e => e.type === "drafted" && e.data?.cost === "court")).toBe(true);
  });
});

describe("ACQUISITION_TUNABLES", () => {
  it("release 1/morning; the wider Fair drafts 3 of 7 (D-019 flow bump)", () => {
    expect(ACQUISITION_TUNABLES.RELEASE_PER_MORNING).toBe(1);
    expect(ACQUISITION_TUNABLES.DRAFT_PER_MORNING).toBe(3);
    expect(ACQUISITION_TUNABLES.OFFER_N).toBe(7);
  });
});
