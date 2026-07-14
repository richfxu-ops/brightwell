// Firewall suite: attempt each forbidden move; the engine must refuse.
// Plus: the whole 49-card starter pool must validate clean AND every one of its
// effects must resolve without throwing (content bugs never reach play time).
import { describe, it, expect } from "vitest";
import type { Card, Effect } from "./vocabulary.js";
import type { GameState } from "./state.js";
import { resolveEffect, creditGleam, type EffectContext } from "./effects.js";
import { validateCard, assertPoolValid } from "./validate.js";
import { testPiece, testState, fx } from "./test-helpers.js";
import starterPool from "../content/cards/starter-pool.json" with { type: "json" };

const CARD: Card = { id: "t", name: "T", grain: "song", mark: 2, ceiling: 4, woken_delight: 1, effects: [] };
const ctx: EffectContext = { selfId: "t#0", cardOf: () => CARD };

function state(over: (s: GameState) => void = () => {}): GameState {
  return testState(s => {
    s.pieces = [testPiece("t", { instanceId: "t#0" })];
    over(s);
  });
}

describe("the starter pool is canon-legal AND playable", () => {
  const cards = starterPool.cards as unknown as Card[];

  it("all 49 cards pass the static firewall check", () => {
    expect(() => assertPoolValid(cards)).not.toThrow();
  });

  it("every effect of every real card resolves without throwing", () => {
    const table = new Map(cards.map(c => [c.id, c]));
    for (const card of cards) {
      // a permissive state so situational refusals don't mask throws
      const s = testState(x => {
        x.pieces = [testPiece(card.id, { instanceId: "live#0" }),
                    testPiece(card.id, { instanceId: "spare#0" })];
        x.turn.room = 9; x.turn.chainLinks = 5; x.player.gleam = 5;
        x.board.nodes[0].lastRed = 2; x.board.nodes[0].rings = 3;
        x.asking = { tier: "plea", needFill: 3, progress: 0, acceptedMorning: 1, staleAfterMornings: 6 };
      });
      const cardCtx: EffectContext = { selfId: "live#0", cardOf: id => table.get(id) ?? card };
      for (const effect of card.effects) {
        expect(() => resolveEffect(s, effect, cardCtx), `${card.id} / ${effect.do}`).not.toThrow();
      }
    }
  });
});

describe("static firewalls (validate.ts)", () => {
  const bad = (effects: Effect[]): Card => ({ ...CARD, effects });

  it("a brim band reading the spiral fails to compile", () => {
    const v = validateCard(bad([fx("brim", { band: { do: "read", source: "spiral" } }, "on-overkill")]));
    expect(v.join()).toMatch(/gleam firewall/);
  });
  it("a rest amount reading the spiral fails to compile (board never drives gleam)", () => {
    const v = validateCard(bad([fx("rest", { target: "self", amount: { do: "read", source: "spiral" } })]));
    expect(v.join()).toMatch(/gleam firewall/);
  });
  it("gather/whittle/fill/soothe MAY read board surfaces (canon-legal yields)", () => {
    expect(validateCard(bad([fx("gather", { amount: { do: "read", source: "spiral" } })]))).toEqual([]);
    expect(validateCard(bad([fx("whittle", { amount: { do: "read", source: "season" } })]))).toEqual([]);
  });
  it("a brim gated by a board surface fails to compile", () => {
    const e = fx("brim", { band: 2 }, "on-overkill");
    (e as { if?: unknown }).if = { do: "read", source: "season" };
    expect(validateCard(bad([e])).join()).toMatch(/board surface/);
  });
  it("a cross-channel writer on a non-play event fails to compile", () => {
    expect(validateCard(bad([fx("whittle", { amount: 2 }, "at-dusk")])).join()).toMatch(/non-play event/);
  });
  it("no primitive may touch a waking-mark", () => {
    expect(validateCard(bad([fx("steady", { mark: 1 })])).join()).toMatch(/fixed-marks law/);
  });
  it("read as a standalone verb fails to compile", () => {
    expect(validateCard(bad([fx("read", { source: "room" })])).join()).toMatch(/amount-syntax/);
  });
  it("misspelled read sources fail to compile (closed enum, incl. grain suffixes)", () => {
    expect(validateCard(bad([fx("gather", { amount: { do: "read", source: "rooom" } })])).join()).toMatch(/closed enum/);
    expect(validateCard(bad([fx("gather", { amount: { do: "read", source: "grain:jionery" } })])).join()).toMatch(/closed enum/);
  });
  it("missing/malformed required params fail to compile", () => {
    expect(validateCard(bad([fx("court", { term: 2 })])).join()).toMatch(/stock/);
    expect(validateCard(bad([fx("court", { stock: "s", term: { at_least: 2 } })])).join()).toMatch(/court term/);
    expect(validateCard(bad([fx("rest", { target: "hand:proudest", amount: 1 })])).join()).toMatch(/unknown rest target/);
    expect(validateCard(bad([fx("soothe", { amount: 1, cap: "rings" })])).join()).toMatch(/last-red/);
    expect(validateCard(bad([fx("retire", { target: "self" })])).join()).toMatch(/retire targets/);
  });
});

describe("runtime firewalls", () => {
  it("a spiral-fed brim band throws even if it reaches the resolver", () => {
    const s = state(x => {
      x.pieces[0].set = 13;   // ceiling 4 → excess 9
      x.turn.overCeiling = 9;
      x.turn.overkillPieceId = "t#0";
    });
    expect(() => resolveEffect(s, fx("brim", { band: { do: "read", source: "spiral" } }, "on-overkill"), ctx))
      .toThrow(/gleam firewall/);
  });
  it("gleam cannot be credited without overflow provenance", () => {
    const s = state();
    expect(() => creditGleam(s, 3, "song", { overkillExcess: 0 })).toThrow(/no free mint/);
    expect(() => creditGleam(s, 3, "song", undefined as never)).toThrow(/no free mint/);
  });
  it("a gleam credit can never exceed the measured overflow", () => {
    const s = state();
    expect(() => creditGleam(s, 5, "song", { overkillExcess: 3 })).toThrow(/exceeds measured overflow/);
  });
  it("brim with a missing overkill piece refuses — it never invents a grain", () => {
    const s = state(x => {
      x.turn.overCeiling = 4;
      x.turn.overkillPieceId = "gone#9";   // stale id
      x.player.gleam = 2;
    });
    const { state: after, events } = resolveEffect(s, fx("brim", { band: 3 }, "on-overkill"), ctx);
    expect(events[0].type).toBe("refused");
    expect(after.player.gleam).toBe(2);
    expect(after.player.gleamGrain.dough).toBe(0);
  });
  it("court reads gleam as a gate and never decrements it — met or unmet", () => {
    const met = state(x => { x.turn.chainLinks = 3; x.player.gleam = 7; });
    const unmet = state(x => { x.turn.chainLinks = 0; x.player.gleam = 7; });
    expect(resolveEffect(met, fx("court", { stock: "s", term: 2 }), ctx).state.player.gleam).toBe(7);
    expect(resolveEffect(unmet, fx("court", { stock: "s", term: 2 }), ctx).state.player.gleam).toBe(7);
  });
  it("soothe writes the board and nothing else — gleam and purse untouched", () => {
    const s0 = state(x => {
      x.board.nodes[0].rings = 4;
      x.board.nodes[0].lastRed = 1;
      x.player.gleam = 5;
      x.player.handsels = [{ brightness: 2, idleMornings: 0 }];
    });
    const { state: s } = resolveEffect(s0, fx("soothe", { amount: 1 }), ctx);
    expect(s.player.gleam).toBe(5);
    expect(s.player.handsels).toEqual(s0.player.handsels);
    expect(s.board.nodes[0].rings).toBeLessThan(4);
  });
  it("no resolver path raises Standing except through measured overflow", () => {
    const s0 = state(x => {
      x.turn.room = 6; x.turn.chainLinks = 3; x.player.gleam = 2;
      x.board.nodes[0].lastRed = 1; x.board.nodes[0].rings = 2;
      x.asking = { tier: "kettle", needFill: 1, progress: 0, acceptedMorning: 1, staleAfterMornings: 4 };
    });
    let s = s0;
    for (const e of [
      fx("warm", { n: 1 }), fx("keep"), fx("steady", { links: 1 }), fx("gather", { amount: 2 }),
      fx("mark-grain", { target: "self", suit: "song" }), fx("draw", { n: 1 }),
      fx("whittle", { amount: 3 }), fx("court", { stock: "s", term: 1 }),
      fx("soothe", { amount: 1 }), fx("fill", { amount: 1 }),
    ]) {
      s = resolveEffect(s, e, ctx).state;
    }
    expect(s.player.gleam).toBe(2);
  });
});
