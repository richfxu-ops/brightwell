// engine.js — a faithful browser port of Roundelay's Toy-Morning loop.
// Ported 1:1 from src/engine/{state,reads,effects,morning}.ts so the redesign
// plays like the real toy. NOTHING here is invented: chain multiplier, the
// decaying-seat law, overkill->gleam bands, the dusk sweep and dawn income are
// the locked L6 numbers. Previews are made the engine's way — a throwaway
// playPiece() on a clone, diffed against the live state.

// ---------------------------------------------------------------- card data
// Compact defs lifted verbatim from planning/roundelay-codex.html (the 49 cards
// rendered from src/content/cards/*.json), normalised to the engine effect shape.
const R = s => ({ read: s });
const GROUPS = [
  { key: "shared", grain: "dough", name: "The Apprentice Hand", tl: "seven plain cards every run begins with", cards: [
    { id: "sprig-trestle", n: "Sprig Trestle", g: "joinery", m: 1, c: 2, d: 1, role: "apprentice", fx: [{ w: "on-play", do: "gather", amt: R("grain:joinery") }] },
    { id: "pegged-bench", n: "Pegged Bench", g: "joinery", m: 1, c: 2, d: 1, role: "apprentice", fx: [{ w: "on-chain", do: "steady", links: 1 }] },
    { id: "loose-thread", n: "Loose Thread", g: "thread", m: 1, c: 2, d: 1, role: "baseline", fx: [{ w: "on-play", do: "keep" }] },
    { id: "kettle-loaf", n: "Kettle-Loaf", g: "dough", m: 1, c: 2, d: 1, role: "baseline", fx: [{ w: "on-play", do: "warm", n: 1 }] },
    { id: "hearth-hum", n: "Hearth-Hum", g: "song", m: 2, c: 3, d: 1, role: "apprentice", fx: [{ w: "on-play", do: "gather", amt: R("grain:song") }] },
    { id: "grey-bowl", n: "Grey Bowl", g: "glaze", m: 2, c: 3, d: 1, role: "apprentice", fx: [{ w: "on-play", do: "gather", amt: R("grain:glaze") }] },
    { id: "first-step", n: "First Step", g: "dance", m: 2, c: 3, d: 1, role: "apprentice", fx: [{ w: "on-play", do: "gather", amt: R("grain:dance") }] },
  ] },
  { key: "kilnfast", grain: "joinery", name: "The Kilnfast", tl: "the fired, held \u2014 fire it once, keep it forever", cards: [
    { id: "setterby-trestle", n: "Setterby Trestle", g: "joinery", m: 2, c: 4, d: 1, role: "chain:C1", fx: [{ w: "on-play", do: "gather", amt: R("woken:joinery") }, { w: "on-chain", do: "steady", links: 1, brace: true }] },
    { id: "calipers-at-the-bench", n: "Calipers at the Bench", g: "joinery", m: 3, c: 5, d: 2, role: "chain:C2", fx: [{ w: "on-play", do: "rest", tgt: "held:capstone", amt: R("room") }, { w: "on-wake", do: "mark-grain", tgt: "hand:offgrain", suit: "joinery" }] },
    { id: "the-fired-beam", n: "The Fired Beam", g: "joinery", m: 7, c: 8, d: 3, role: "capstone", fx: [{ w: "on-play", do: "rest", tgt: "self", amt: R("room") }, { w: "on-wake", do: "fill", amt: R("grain:joinery") }, { w: "on-chain", do: "steady", brace: true }] },
    { id: "bank-the-coals", n: "Bank the Coals", g: "joinery", m: 3, c: 5, d: 2, role: "support", fx: [{ w: "on-play", do: "gather", amt: R("grain:joinery") }, { w: "on-chain", do: "steady", links: 1 }] },
    { id: "seasoned-timber", n: "Seasoned Timber", g: "joinery", m: 3, c: 5, d: 2, role: "support", fx: [{ w: "on-play", do: "rest", tgt: "self", amt: R("room") }, { w: "on-wake", do: "mark-grain", tgt: "hand:offgrain", suit: "joinery" }] },
    { id: "keep-the-kiln", n: "Keep the Kiln", g: "joinery", m: 2, c: 3, d: 1, role: "support", fx: [{ w: "on-chain", do: "steady", brace: true }, { w: "on-play", do: "keep" }] },
    { id: "dovetail-draw", n: "Dovetail Draw", g: "joinery", m: 3, c: 5, d: 2, role: "utility", fx: [{ w: "on-dawn", do: "draw", nn: 1, suit: "joinery" }] },
  ] },
  { key: "eveners", grain: "dance", name: "The Eveners", tl: "the purse, moving \u2014 waste nothing, keep it bright", cards: [
    { id: "the-last-lighting", n: "The Last Lighting", g: "dance", m: 3, c: 5, d: 2, role: "chain:C1", fx: [{ w: "on-play", do: "retire", tgt: "inert:hand", to: "room" }, { w: "on-play", do: "retire", tgt: "inert:pack", to: "table" }] },
    { id: "bright-hand-to-hand", n: "Bright Hand to Hand", g: "thread", m: 3, c: 5, d: 1, role: "chain:C2", fx: [{ w: "on-play", do: "whittle", amt: R("room") }, { w: "on-chain", do: "steady", links: 1 }] },
    { id: "even-the-rim", n: "Even the Rim", g: "dance", m: 6, c: 8, d: 3, role: "capstone", fx: [{ w: "on-play", do: "rest", tgt: "self", amt: R("room") }, { w: "on-fulfil", do: "draw", nn: 2 }] },
    { id: "waymeet-gift", n: "Waymeet Gift", g: "thread", m: 2, c: 3, d: 1, role: "support", fx: [{ w: "on-play", do: "retire", tgt: "inert:hand", to: "table" }, { w: "on-chain", do: "steady", links: 1 }] },
    { id: "the-turning-purse", n: "The Turning Purse", g: "thread", m: 3, c: 5, d: 1, role: "support", fx: [{ w: "on-play", do: "whittle", amt: R("room") }, { w: "on-play", do: "draw", nn: 1 }] },
    { id: "even-fuel", n: "Even Fuel", g: "dance", m: 2, c: 3, d: 1, role: "support", fx: [{ w: "on-play", do: "retire", tgt: "inert:hand", to: "room" }, { w: "on-chain", do: "steady", links: 1 }] },
    { id: "quick-feet", n: "Quick Feet", g: "dance", m: 3, c: 5, d: 2, role: "utility", fx: [{ w: "on-dawn", do: "draw", nn: 1, suit: "dance" }] },
  ] },
  { key: "untold", grain: "thread", name: "The Untold", tl: "the pace, ratcheted \u2014 many small, very fast", cards: [
    { id: "paper-bird", n: "Paper-Bird", g: "thread", m: 1, c: 2, d: 1, role: "chain:C1", tag: "one-shot", fx: [{ w: "on-play", do: "fill", amt: R("grain:thread") }, { w: "on-play", do: "draw", nn: 1, suit: "thread" }] },
    { id: "quick-hand", n: "Quick-Hand", g: "thread", m: 2, c: 3, d: 1, role: "chain:C2", fx: [{ w: "on-play", do: "draw", nn: 1, suit: "thread" }, { w: "on-chain", do: "steady", links: 1, brace: true }] },
    { id: "the-standing-count", n: "The Standing Count", g: "thread", m: 4, c: 6, d: 2, role: "capstone", fx: [{ w: "on-play", do: "rest", tgt: "self", amt: R("chain") }, { w: "on-wake", do: "fill", amt: R("grain:thread") }, { w: "on-fulfil", do: "draw", nn: 2, suit: "thread" }] },
    { id: "thread-the-needle", n: "Thread the Needle", g: "thread", m: 2, c: 3, d: 1, role: "support", fx: [{ w: "on-play", do: "mark-grain", tgt: "hand:offgrain", suit: "thread" }, { w: "on-play", do: "draw", nn: 1, suit: "thread" }] },
    { id: "swift-tally", n: "Swift Tally", g: "thread", m: 1, c: 2, d: 1, role: "support", tag: "one-shot", fx: [{ w: "on-play", do: "fill", amt: R("grain:thread") }, { w: "on-play", do: "draw", nn: 1, suit: "thread" }] },
    { id: "keep-the-pace", n: "Keep the Pace", g: "thread", m: 2, c: 3, d: 1, role: "support", fx: [{ w: "on-chain", do: "steady", links: 1, brace: true }, { w: "on-play", do: "draw", nn: 1, suit: "thread" }] },
    { id: "morning-flock", n: "Morning Flock", g: "thread", m: 1, c: 2, d: 1, role: "utility", fx: [{ w: "on-dawn", do: "draw", nn: 1, suit: "thread" }] },
  ] },
  { key: "fairwrights", grain: "dance", name: "The Fairwrights", tl: "the room, spiked \u2014 one enormous show", cards: [
    { id: "raise-the-wain-stage", n: "Raise the Wain-Stage", g: "dance", m: 2, c: 4, d: 1, role: "chain:C1", tag: "venue", fx: [{ w: "on-play", do: "gather", amt: 6 }, { w: "on-chain", do: "steady", brace: true }] },
    { id: "pitch-the-ring", n: "Pitch the Ring", g: "dance", m: 2, c: 4, d: 1, role: "chain:C2", tag: "venue", fx: [{ w: "on-play", do: "gather", amt: R("room") }, { w: "on-play", do: "mark-grain", tgt: "hand:offgrain", suit: "dance" }] },
    { id: "the-whole-fair-turn", n: "The Whole-Fair Turn", g: "dance", m: 8, c: 9, d: 3, role: "capstone", fx: [{ w: "on-play", do: "rest", tgt: "self", amt: R("room") }, { w: "on-overkill", do: "brim", band: R("over-ceiling") }, { w: "on-fulfil", do: "whittle", amt: 1 }] },
    { id: "bunting-and-banners", n: "Bunting and Banners", g: "dance", m: 3, c: 5, d: 2, role: "support", tag: "venue", fx: [{ w: "on-play", do: "gather", amt: R("room") }, { w: "on-play", do: "mark-grain", tgt: "hand:offgrain", suit: "dance" }] },
    { id: "call-the-crowd", n: "Call the Crowd", g: "dance", m: 3, c: 5, d: 2, role: "support", tag: "venue", fx: [{ w: "on-play", do: "gather", amt: 4 }, { w: "on-chain", do: "steady", brace: true }] },
    { id: "string-the-bunting", n: "String the Bunting", g: "dance", m: 3, c: 5, d: 2, role: "support", fx: [{ w: "on-play", do: "gather", amt: R("room") }, { w: "on-chain", do: "steady", links: 1 }] },
    { id: "the-ringmasters-draw", n: "The Ringmaster's Draw", g: "dance", m: 3, c: 5, d: 2, role: "utility", fx: [{ w: "on-dawn", do: "draw", nn: 1, suit: "dance" }] },
  ] },
  { key: "mannerly", grain: "song", name: "The Mannerly", tl: "the proud, courted \u2014 win over the shy silver", cards: [
    { id: "keep-the-silver-singing", n: "Keep the Silver Singing", g: "song", m: 2, c: 4, d: 1, role: "chain:C1", fx: [{ w: "on-play", do: "steady", links: 2, brace: true }, { w: "on-play", do: "mark-grain", tgt: "hand:cheapest", suit: "song" }] },
    { id: "court-the-singing-silver", n: "Court the Singing-Silver", g: "song", m: 3, c: 5, d: 2, role: "chain:C2", fx: [{ w: "on-play", do: "court", stock: "singing-silver", term: 3 }] },
    { id: "the-silver-refrain", n: "The Silver Refrain", g: "song", m: 6, c: 8, d: 5, role: "proud", fx: [{ w: "on-play", do: "rest", tgt: "self", amt: R("room") }, { w: "on-wake", do: "fill", amt: R("chain") }, { w: "on-fulfil", do: "draw", nn: 1, suit: "song" }] },
    { id: "tune-the-strings", n: "Tune the Strings", g: "song", m: 2, c: 3, d: 1, role: "support", fx: [{ w: "on-chain", do: "steady", links: 2, brace: true }, { w: "on-play", do: "mark-grain", tgt: "hand:cheapest", suit: "song" }] },
    { id: "the-standing-introduction", n: "The Standing Introduction", g: "song", m: 3, c: 5, d: 2, role: "support", fx: [{ w: "on-play", do: "court", stock: "singing-silver", term: 1 }] },
    { id: "grace-note", n: "Grace-Note", g: "song", m: 2, c: 3, d: 1, role: "support", fx: [{ w: "on-play", do: "gather", amt: R("grain:song") }, { w: "on-chain", do: "steady", links: 1 }] },
    { id: "silver-warm-up", n: "Silver Warm-Up", g: "song", m: 3, c: 5, d: 2, role: "utility", fx: [{ w: "on-dawn", do: "draw", nn: 1, suit: "song" }] },
  ] },
  { key: "gleaners", grain: "glaze", name: "The Morning-Gleaners", tl: "the grey, harvested \u2014 feed on the fading, then mend it", cards: [
    { id: "walk-the-pale", n: "Walk the Pale", g: "glaze", m: 3, c: 5, d: 2, role: "chain:C1", fx: [{ w: "on-play", do: "gather", amt: R("spiral") }, { w: "on-play", do: "whittle", amt: R("season") }] },
    { id: "glean-the-ground", n: "Glean the Ground", g: "glaze", m: 3, c: 5, d: 2, role: "chain:C2", fx: [{ w: "on-play", do: "rest", tgt: "held:capstone", amt: R("room") }, { w: "on-play", do: "gather", amt: R("spiral") }] },
    { id: "ripe-mending", n: "Ripe Mending", g: "glaze", m: 7, c: 9, d: 3, role: "capstone", fx: [{ w: "on-play", do: "rest", tgt: "self", amt: R("room") }, { w: "on-wake", do: "fill", amt: R("room") }, { w: "on-fulfil", do: "soothe" }] },
    { id: "grey-gleaning", n: "Grey-Gleaning", g: "glaze", m: 3, c: 5, d: 2, role: "support", fx: [{ w: "on-play", do: "gather", amt: R("spiral") }, { w: "on-play", do: "mark-grain", tgt: "hand:offgrain", suit: "glaze" }] },
    { id: "mend-the-verge", n: "Mend the Verge", g: "glaze", m: 5, c: 6, d: 2, role: "support", fx: [{ w: "on-play", do: "rest", tgt: "self", amt: R("room") }, { w: "on-fulfil", do: "soothe" }] },
    { id: "slow-the-grey", n: "Slow the Grey", g: "glaze", m: 2, c: 3, d: 1, role: "support", fx: [{ w: "on-play", do: "gather", amt: R("grain:glaze") }, { w: "on-chain", do: "steady", links: 1 }] },
    { id: "pale-harvest", n: "Pale Harvest", g: "glaze", m: 3, c: 5, d: 2, role: "utility", fx: [{ w: "on-dawn", do: "draw", nn: 1, suit: "glaze" }] },
  ] },
];

const GRAIN_KEYS = ["joinery", "thread", "song", "glaze", "dance", "dough"];

function normAmount(v) {
  if (v && typeof v === "object" && "read" in v) return { do: "read", source: v.read };
  return v;
}
function normEffect(fx) {
  const p = {};
  if (fx.amt !== undefined) p.amount = normAmount(fx.amt);
  if (fx.band !== undefined) p.band = normAmount(fx.band);
  if (fx.links !== undefined) p.links = fx.links;
  if (fx.brace !== undefined) p.brace = fx.brace;
  if (fx.tgt !== undefined) p.target = fx.tgt;
  if (fx.suit !== undefined) p.suit = fx.suit;
  if (fx.nn !== undefined) p.n = fx.nn;
  if (fx.n !== undefined) p.n = fx.n;
  if (fx.stock !== undefined) p.stock = fx.stock;
  if (fx.term !== undefined) p.term = fx.term;
  if (fx.to !== undefined) p.to = fx.to;
  return { when: fx.w, do: fx.do, params: p };
}

// Flat card table keyed by id (the "content", immutable).
export const CARDS = new Map();
export const DECKS = ["apprentice", "kilnfast", "eveners", "untold", "fairwrights", "mannerly", "gleaners"];
const DECK_META = { apprentice: { name: "Apprentice", grain: "dough" } };
for (const G of GROUPS) {
  if (G.key !== "shared") DECK_META[G.key] = { name: G.name.replace(/^The /, "").replace(/^Morning-/, ""), grain: G.grain };
  for (const c of G.cards) {
    CARDS.set(c.id, {
      id: c.id, name: c.n, grain: c.g, mark: c.m, ceiling: c.c, woken_delight: c.d,
      role: c.role, tags: [c.role === "capstone" || c.role === "proud" ? "capstone" : null, c.tag].filter(Boolean),
      archetype: G.key, way: G.key === "shared" ? null : G.key,
      effects: c.fx.map(normEffect),
      fillsNeed: c.fx.some(e => e.do === "fill"),
    });
  }
}
export function cardOf(id) { return CARDS.get(id); }
export { DECK_META };

const SHARED_IDS = GROUPS[0].cards.map(c => c.id);
const WAY_CARDS = key => (GROUPS.find(G => G.key === key)?.cards ?? []);

const LEG_NAMES = ["Green Going", "Long Light", "Deep Gold", "Red Walk", "the Wintering"];
const TIERS = ["kettle", "plea", "poem", "great", "great"];
const NEED_BY_LEG = [1, 3, 5, 7, 7];
const SEASON_SEEP_BY_LEG = [1, 3, 5, 7, 7];
export { LEG_NAMES };

// ---------------------------------------------------------------- constants (locked L6)
const DAWN_BASE = 2, DAWN_PER_RING = 0.5, CAMP_RETURN_SHARE = 2 / 3, HAND_SIZE = 5, STALL_ROOM_FACTOR = 0.5;
const FULL_RATE_BAND = 6, DIMINISH_RATE = 0.5, SEAT_FIRST = 2, SEAT_DECAY = 0.8;

export function chainMultiplier(links) { return Math.min(2.0, 1 + 0.25 * Math.max(0, links - 1)); }
export function seatContribution(index) { return SEAT_FIRST * SEAT_DECAY ** index; } // 0-indexed nth seat
export function convertOverkill(excess, extraBand = 0) {
  const band = FULL_RATE_BAND + extraBand;
  return Math.min(excess, band) + Math.floor(Math.max(0, excess - band) * DIMINISH_RATE);
}
export const r1 = n => (Math.round(n * 10) / 10).toString();

// ---------------------------------------------------------------- rng (seeded)
function nextInt(rng, n) {
  let t = (rng.seed + rng.counter * 0x6D2B79F5) >>> 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  const v = ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  return [Math.floor(v * n), { seed: rng.seed, counter: rng.counter + 1 }];
}
const clone = s => (typeof structuredClone === "function" ? structuredClone(s) : JSON.parse(JSON.stringify(s)));

// ---------------------------------------------------------------- state
function mkPiece(cardId, instanceId) {
  return {
    instanceId, cardId, zone: "pack", fired: false, set: 0, stampedGrains: [],
    wokeThisMorning: false, stampedThisMorning: false, playedThisMorning: false,
    freshness: 2, delightBonus: 0, overkillCredited: 0, brimBand: 0,
  };
}
function currentNode(s) { return s.board.nodes.find(n => n.id === s.board.hereId); }

export function createInitialState(seed, deck) {
  const pieces = SHARED_IDS.map((id, i) => mkPiece(id, `${id}#${i}`));
  if (deck && deck !== "apprentice") {
    WAY_CARDS(deck).forEach((c, i) => pieces.push(mkPiece(c.id, `${c.id}#w${i}`)));
  }
  return {
    rng: { seed, counter: 0 },
    calendar: { morning: 1, leg: 0 },
    board: { nodes: [{ id: "green-going-1", rings: 0, localTable: 0, lastRed: 0, remade: false, soothed: false }], hereId: "green-going-1", camped: false },
    player: { gleam: 1, gleamGrain: Object.fromEntries(GRAIN_KEYS.map(g => [g, 0])), handsels: [], stock: [{ id: "apprentice-stuff", grade: "apprentice", freshness: 2 }, { id: "apprentice-stuff", grade: "apprentice", freshness: 2 }], soothesUsed: 0 },
    pieces,
    asking: null,
    turn: emptyTurn(),
    events: [],
  };
}
function emptyTurn() {
  return {
    room: 0, chainLinks: 0, braced: false, stalled: false, overCeiling: 0, overkillPieceId: null,
    seatedCount: 0, whittledThisMorning: false, dawned: false, playedOrder: [], firedEffectKeys: [],
    roomAtDawn: 0, pouredThisMorning: 0, dawnIncome: null,
  };
}
function refreshAsking(s) {
  s.asking = { tier: TIERS[s.calendar.leg], needFill: NEED_BY_LEG[s.calendar.leg], progress: 0, acceptedMorning: s.calendar.morning, staleAfterMornings: 99 };
}
export { refreshAsking };

// ---------------------------------------------------------------- reads
function countsAs(piece, grain) { const printed = CARDS.get(piece.cardId).grain; return printed === grain || piece.stampedGrains.includes(grain); }
export function evaluateRead(source, s) {
  if (source.startsWith("grain:")) { const g = source.slice(6); return s.pieces.filter(p => (p.wokeThisMorning || p.stampedThisMorning) && countsAs(p, g)).length; }
  if (source.startsWith("woken:")) { const g = source.slice(6); return s.pieces.filter(p => p.fired && !p.wokeThisMorning && countsAs(p, g)).length; }
  switch (source) {
    case "room": return s.turn.room;
    case "chain": return s.turn.chainLinks;
    case "fill": return s.asking?.progress ?? 0;
    case "season": return SEASON_SEEP_BY_LEG[s.calendar.leg];
    case "spiral": return currentNode(s).rings;
    case "handsels": return s.player.handsels.reduce((a, h) => a + h.brightness, 0);
    case "over-ceiling": return s.turn.overCeiling;
    default: return 0;
  }
}
function amountOf(v, s, fallback = 0) {
  if (v === undefined) return fallback;
  if (typeof v === "number") return v;
  if (v && v.do === "read") return evaluateRead(v.source, s);
  return fallback;
}

// ---------------------------------------------------------------- events
function emit(s, type, data) { s.events.push({ morning: s.calendar.morning, type, ...(data ? { data } : {}) }); }
function refuse(s, effect, why) { emit(s, "refused", { do: effect.do, why }); }

// ---------------------------------------------------------------- gleam + automatics
function creditGleam(s, amount, grain, excess) {
  if (amount <= 0) return;
  s.player.gleam += amount;
  s.player.gleamGrain[grain] += amount;
  emit(s, "gleam", { amount, grain, overkill: excess });
}
function applyWake(s, piece) {
  if (piece.fired) return;
  piece.fired = true; piece.wokeThisMorning = true; piece.zone = "in-play";
  emit(s, "woke", { piece: piece.instanceId, grain: CARDS.get(piece.cardId).grain });
}
function settleOverkill(s, piece) {
  const card = CARDS.get(piece.cardId);
  const excess = Math.max(0, piece.set - card.ceiling);
  if (excess <= 0) return;
  const worth = convertOverkill(excess, piece.brimBand);
  const delta = worth - piece.overkillCredited;
  if (delta <= 0) return;
  piece.overkillCredited = worth;
  emit(s, "overkilled", { piece: piece.instanceId, excess });
  creditGleam(s, delta, card.grain, excess);
}
function pourAttention(s, piece, requested) {
  const spend = Math.min(requested, s.turn.room);
  if (spend <= 0) return 0;
  const landed = spend * chainMultiplier(s.turn.chainLinks);
  const card = CARDS.get(piece.cardId);
  s.turn.room -= spend;
  s.turn.pouredThisMorning += spend;
  piece.set += landed;
  emit(s, "rested", { piece: piece.instanceId, spend, landed, set: piece.set });
  if (!piece.fired && piece.set >= card.mark) applyWake(s, piece);
  const excess = Math.max(0, piece.set - card.ceiling);
  s.turn.overCeiling = excess;
  s.turn.overkillPieceId = excess > 0 ? piece.instanceId : null;
  settleOverkill(s, piece);
  return landed;
}

// ---------------------------------------------------------------- resolvers
function pieceById(s, id) { return s.pieces.find(p => p.instanceId === id); }
function resolveTarget(s, target, selfId, suit) {
  const ps = s.pieces;
  switch (target) {
    case undefined: case "self": return pieceById(s, selfId) ?? null;
    case "held:capstone": return ps.find(p => !p.fired && (p.zone === "hand" || p.zone === "in-play") && (CARDS.get(p.cardId).tags || []).some(t => t === "capstone")) ?? null;
    case "hand:offgrain": return ps.find(p => p.zone === "hand" && suit !== undefined && !countsAs(p, suit)) ?? null;
    case "hand:cheapest": { const h = ps.filter(p => p.zone === "hand"); return h.length ? h.reduce((a, b) => CARDS.get(b.cardId).mark < CARDS.get(a.cardId).mark ? b : a) : null; }
    case "inert:hand": return ps.find(p => p.zone === "hand" && !p.fired) ?? null;
    case "inert:pack": return ps.find(p => p.zone === "pack" && !p.fired) ?? null;
    default: return null;
  }
}
const RESOLVERS = {
  warm(s, e, self) { const p = pieceById(s, self); if (!p) return refuse(s, e, "no acting piece"); const n = amountOf(e.params.n, s, 1); p.delightBonus += n; emit(s, "warmed", { piece: p.instanceId, n }); },
  keep(s, e, self) { const p = pieceById(s, self); if (!p) return refuse(s, e, "no acting piece"); p.freshness += 1; emit(s, "kept", { piece: p.instanceId, freshness: p.freshness }); },
  steady(s, e) { const links = amountOf(e.params.links, s, 0); s.turn.chainLinks += links; if (e.params.brace === true) s.turn.braced = true; emit(s, "steadied", { links, braced: s.turn.braced }); },
  gather(s, e) {
    const seats = Math.floor(amountOf(e.params.amount, s));
    if (seats < 1) return refuse(s, e, "no one to seat");
    let gain = 0; for (let i = 0; i < seats; i++) gain += SEAT_FIRST * SEAT_DECAY ** (s.turn.seatedCount + i);
    s.turn.seatedCount += seats; s.turn.room += gain;
    emit(s, "gathered", { seats, gain, room: s.turn.room });
  },
  "mark-grain"(s, e, self) { const suit = e.params.suit; const t = resolveTarget(s, e.params.target, self, suit); if (!t) return refuse(s, e, "no stampable target"); if (!t.stampedGrains.includes(suit)) t.stampedGrains.push(suit); t.stampedThisMorning = true; emit(s, "stamped", { piece: t.instanceId, suit }); },
  draw(s, e) {
    const n = amountOf(e.params.n, s, 1); const suit = e.params.suit; const pack = s.pieces.filter(p => p.zone === "pack"); const drawn = [];
    for (let i = 0; i < n && pack.length > 0; i++) {
      let idx; if (suit) { idx = pack.findIndex(p => countsAs(p, suit)); if (idx < 0) break; } else { [idx, s.rng] = nextInt(s.rng, pack.length); }
      const [pick] = pack.splice(idx, 1); pick.zone = "hand"; drawn.push(pick.instanceId);
    }
    if (drawn.length === 0) return refuse(s, e, "nothing to draw");
    emit(s, "drew", { pieces: drawn, suit: suit ?? null });
  },
  retire(s, e, self) {
    const t = resolveTarget(s, e.params.target, self); if (!t || t.fired) return refuse(s, e, "no inert piece to last-light");
    const worth = t.set; s.pieces = s.pieces.filter(p => p.instanceId !== t.instanceId);
    const to = e.params.to ?? "table"; if (to === "room") s.turn.room += worth; else currentNode(s).localTable += worth;
    emit(s, "retired", { piece: t.instanceId, worth, to });
  },
  whittle(s, e) {
    if (s.turn.whittledThisMorning) return refuse(s, e, "the shavings are carved for today");
    const share = amountOf(e.params.amount, s); if (share < 1) return refuse(s, e, "too thin a return to carve");
    const at = s.player.stock.findIndex(x => x.grade === "apprentice"); if (at < 0) return refuse(s, e, "no apprentice-stuff to carve");
    s.player.stock.splice(at, 1); s.player.handsels.push({ brightness: 1, idleMornings: 0 }); s.turn.whittledThisMorning = true;
    emit(s, "whittled", { returnShare: share, handsels: 1 });
  },
  court(s, e) {
    const stock = e.params.stock; const grade = stock === "singing-silver" ? "proud" : "mid"; const vouch = { apprentice: 0, mid: 6, proud: 6, capstone: 21 }[grade] ?? 6;
    if (s.player.gleam < vouch) return refuse(s, e, `the vouching is closed (${grade} stock)`);
    const term = e.params.term; let met;
    if (typeof term === "number" || term === undefined) met = s.turn.chainLinks >= (term ?? 1);
    else if (term && term.if) met = evaluateRead(term.if.source, s) >= amountOf(term.at_least, s, 1); else met = false;
    if (!met) return refuse(s, e, "the term is unmet");
    s.player.stock.push({ id: stock, grade, freshness: 2 }); emit(s, "courted", { stock, grade });
  },
  soothe(s, e) {
    if (s.player.soothesUsed >= 4) return refuse(s, e, "the season's soothing is spent");
    const node = currentNode(s); if (node.lastRed < 1) return refuse(s, e, "no last-red catalyst");
    const mend = Math.min(amountOf(e.params.amount, s, 1) * amountOf(e.params.scale, s, 1), node.rings, 2);
    if (mend < 1) return refuse(s, e, "nothing to mend");
    node.lastRed -= 1; node.rings -= mend; node.soothed = true; s.player.soothesUsed += 1;
    emit(s, "soothed", { node: node.id, mend, rings: node.rings });
  },
  fill(s, e) {
    if (!s.asking) return refuse(s, e, "no accepted asking");
    const amount = amountOf(e.params.amount, s); if (amount < 1) return refuse(s, e, "nothing to pour");
    s.asking.progress += amount;
    emit(s, "filled", { amount, progress: s.asking.progress, complete: s.asking.progress >= s.asking.needFill });
  },
  rest(s, e, self) {
    const t = resolveTarget(s, e.params.target, self); if (!t) return refuse(s, e, "no piece to rest on");
    const req = amountOf(e.params.amount, s); if (Math.min(req, s.turn.room) < 1) return refuse(s, e, "the room is empty");
    pourAttention(s, t, req);
  },
  brim(s, e) {
    const op = s.turn.overkillPieceId ? pieceById(s, s.turn.overkillPieceId) : null;
    if (!op || s.turn.overCeiling <= 0) return refuse(s, e, "no genuine overkill to widen");
    const widen = amountOf(e.params.band, s); if (widen < 1) return refuse(s, e, "no band to widen");
    const before = op.overkillCredited; op.brimBand += widen; settleOverkill(s, op);
    const extra = op.overkillCredited - before; if (extra <= 0) return refuse(s, e, "nothing past the band to recover");
    emit(s, "brimmed", { widen, extra });
  },
};
function applyEffect(s, effect, selfId) { const r = RESOLVERS[effect.do]; if (r) r(s, effect, selfId); }

// ---------------------------------------------------------------- cascade
const TRIGGER_OF = { woke: "on-wake", overkilled: "on-overkill", courted: "on-court", stalled: "on-stall", played: "on-chain" };
function fireOnce(s, piece, eff, index, selfId) {
  const key = `${piece.instanceId}#${index}`;
  if (s.turn.firedEffectKeys.includes(key)) return;
  s.turn.firedEffectKeys.push(key);
  applyEffect(s, eff, piece.instanceId);
}
function runCascade(s, cursor) {
  while (cursor < s.events.length) {
    const ev = s.events[cursor++];
    const trigger = ev.type === "filled" && ev.data?.complete === true ? "on-fulfil" : TRIGGER_OF[ev.type];
    if (!trigger) continue;
    const listeners = []; const cause = ev.data?.piece;
    if ((trigger === "on-wake" || trigger === "on-overkill") && typeof cause === "string") listeners.push(cause);
    listeners.push(...s.turn.playedOrder);
    const seen = new Set();
    for (const pid of listeners) {
      if (seen.has(pid)) continue; seen.add(pid);
      const piece = pieceById(s, pid); if (!piece) continue;
      CARDS.get(piece.cardId).effects.forEach((eff, i) => { if (eff.when === trigger) fireOnce(s, piece, eff, i); });
    }
  }
}

// ---------------------------------------------------------------- dawn/play/stall/dusk
function refillHand(s) {
  const drawn = [];
  while (s.pieces.filter(p => p.zone === "hand").length < HAND_SIZE) {
    let pack = s.pieces.filter(p => p.zone === "pack");
    if (pack.length === 0) { const dis = s.pieces.filter(p => p.zone === "discard"); if (dis.length === 0) break; dis.forEach(p => p.zone = "pack"); pack = dis; }
    let idx; [idx, s.rng] = nextInt(s.rng, pack.length); pack[idx].zone = "hand"; drawn.push(pack[idx].instanceId);
  }
  return drawn;
}
function legOf(morning) { const mpl = [4, 6, 7, 7, 3]; let past = 0; for (let l = 0; l < mpl.length; l++) { past += mpl[l]; if (morning <= past) return l; } return 4; }

export function dawn(stateIn) {
  const s = clone(stateIn); const before = s.events.length;
  if (s.turn.dawned) s.calendar.morning += 1;
  s.calendar.leg = legOf(s.calendar.morning);
  for (const p of s.pieces) { p.wokeThisMorning = false; p.stampedThisMorning = false; p.playedThisMorning = false; if (!p.fired) p.set = 0; }
  const node = currentNode(s);
  const seats = 1 + s.pieces.filter(p => p.fired).length;
  let seatRoom = 0; for (let i = 0; i < seats; i++) seatRoom += SEAT_FIRST * SEAT_DECAY ** i;
  const ringDraw = node.soothed ? 0 : DAWN_PER_RING * node.rings;
  const tableDraw = s.board.camped ? CAMP_RETURN_SHARE * node.localTable : 0;
  node.localTable = 0;
  const total = DAWN_BASE + seatRoom + ringDraw + tableDraw;
  s.turn = emptyTurn();
  s.turn.room = total; s.turn.roomAtDawn = total; s.turn.seatedCount = seats; s.turn.dawned = true;
  s.turn.dawnIncome = { base: DAWN_BASE, seats, seatRoom, ringDraw, tableDraw, total, camped: s.board.camped };
  const drawn = refillHand(s);
  emit(s, "dawn", { morning: s.calendar.morning, leg: s.calendar.leg, room: total, seats, seatRoom, base: DAWN_BASE, ringDraw, tableDraw, drew: drawn });
  for (const p of s.pieces) { if (!p.fired) continue; CARDS.get(p.cardId).effects.forEach((eff, i) => { if (eff.when === "on-dawn") fireOnce(s, p, eff, i); }); }
  runCascade(s, before);
  return { state: s, events: s.events.slice(before) };
}
export function playPiece(stateIn, instanceId, pour) {
  const s = clone(stateIn); const before = s.events.length;
  const piece = pieceById(s, instanceId);
  if (!piece || piece.zone !== "hand") { emit(s, "refused", { do: "play", why: "not in hand" }); return { state: s, events: s.events.slice(before) }; }
  piece.zone = "in-play"; piece.playedThisMorning = true; s.turn.playedOrder.push(instanceId); s.turn.chainLinks += 1;
  emit(s, "played", { piece: instanceId, link: s.turn.chainLinks, pour });
  if (pour > 0) pourAttention(s, piece, pour);
  CARDS.get(piece.cardId).effects.forEach((eff, i) => { if (eff.when === "on-play") fireOnce(s, piece, eff, i); });
  runCascade(s, before);
  return { state: s, events: s.events.slice(before) };
}
export function stallAction(stateIn, kind = "errand") {
  const s = clone(stateIn); const before = s.events.length;
  if (s.turn.braced) { s.turn.braced = false; emit(s, "brace-held", { kind }); }
  else { s.turn.room = Math.floor(s.turn.room * STALL_ROOM_FACTOR); s.turn.chainLinks = 0; s.turn.stalled = true; emit(s, "stalled", { kind, room: s.turn.room }); }
  runCascade(s, before);
  return { state: s, events: s.events.slice(before) };
}
export function dusk(stateIn, choice = {}) {
  const s = clone(stateIn); const before = s.events.length;
  for (const p of s.pieces) { if (!p.fired) continue; CARDS.get(p.cardId).effects.forEach((eff, i) => { if (eff.when === "at-dusk") fireOnce(s, p, eff, i); }); }
  runCascade(s, before);
  const node = currentNode(s);
  let sweep = s.turn.room, coldSet = 0;
  for (const p of s.pieces) { if (!p.fired && p.set > 0) { sweep += p.set; coldSet += p.set; p.set = 0; } }
  const unspent = s.turn.room;
  s.turn.room = 0; node.localTable += sweep;
  for (const p of s.pieces) { if (p.zone === "hand" || p.zone === "in-play") p.zone = "discard"; }
  s.player.handsels = s.player.handsels.filter(h => { h.idleMornings += 1; if (h.brightness > 1) { h.brightness -= 1; return true; } if (h.idleMornings >= 3) { node.localTable += 1; return false; } return true; });
  s.board.camped = choice.camp !== false;
  emit(s, "dusk", { sweep, unspent, coldSet, table: node.localTable, camped: s.board.camped });
  return { state: s, events: s.events.slice(before) };
}

// ---------------------------------------------------------------- preview (the engine's way: diff a throwaway play)
export function previewPlay(s, id, pour) {
  const before = pieceById(s, id);
  const card = CARDS.get(before.cardId);
  const spend = Math.min(pour, Math.floor(s.turn.room));
  const m = chainMultiplier(s.turn.chainLinks + 1);
  const landed = spend * m;
  const setAfter = before.set + landed;
  const after = playPiece(s, id, spend).state;
  const played = pieceById(after, id);
  const wakes = !before.fired && played.fired;
  const excess = Math.max(0, setAfter - card.ceiling);
  const gleamGain = after.player.gleam - s.player.gleam;
  const fillGain = (after.asking?.progress ?? 0) - (s.asking?.progress ?? 0);
  const fillDone = (after.asking?.progress ?? 0) >= (after.asking?.needFill ?? Infinity) && fillGain > 0;
  const roomAfter = after.turn.room;
  return {
    spend, m, landed, setBefore: before.set, setAfter, mark: card.mark, ceiling: card.ceiling,
    wakes, alreadyFired: before.fired, crossesMark: setAfter >= card.mark, excess,
    gleamGain, fillGain, fillDone, roomAfter, banks: spend === 0,
  };
}

// ---------------------------------------------------------------- plain-English gloss (ported from the card gallery, + live reads)
const READ_PHRASE = { room: "the room", chain: "your chain", spiral: "this town's grey", season: "the season's fade", "over-ceiling": "the overflow", handsels: "your purse", fill: "the need so far" };
function readPhrase(src) {
  if (READ_PHRASE[src]) return READ_PHRASE[src];
  if (src.startsWith("grain:")) return `your ${src.slice(6)} count`;
  if (src.startsWith("woken:")) return `${src.slice(6)} you woke before`;
  return src;
}
const TGT_PHRASE = { self: "itself", "held:capstone": "your held capstone", "hand:offgrain": "a spare off-suit card", "hand:cheapest": "your cheapest card", "inert:hand": "a sleeping card in hand", "inert:pack": "a sleeping card in your deck" };
const tgtPhrase = t => TGT_PHRASE[t] || (t ?? "itself");
const toPhrase = t => ({ room: "the room now", table: "the town's table" }[t] || t);
export const WHEN_LABEL = { "on-play": "play", "on-wake": "wake", "on-chain": "chain", "on-fulfil": "fulfil", "on-overkill": "overkill", "on-court": "court", "on-dawn": "dawn", "at-dusk": "dusk" };

// Returns { when, text, live } where live (or null) is a "now: N" annotation; zero flags a dead read.
export function glossEffect(effect, s) {
  const p = effect.params || {};
  const readSrc = (v) => (v && v.do === "read") ? v.source : null;
  const amtNum = (v) => (typeof v === "number") ? v : null;
  let text = "", live = null, zero = false;
  const liveOf = (v) => { const src = readSrc(v); if (!src) return null; const n = evaluateRead(src, s); return { src, n }; };
  switch (effect.do) {
    case "gather": { const n = amtNum(p.amount); if (n != null) text = `Gather a crowd of +${n}`; else { const lv = liveOf(p.amount); text = `Gather a crowd by ${readPhrase(p.amount.source)}`; if (lv) { live = `now ${lv.n}`; zero = lv.n === 0; } } break; }
    case "rest": { const lv = liveOf(p.amount); text = `Pour ${lv ? readPhrase(p.amount.source) : "+" + amtNum(p.amount)} onto ${tgtPhrase(p.target)}`; if (lv) live = `now ${r1(lv.n)}`; break; }
    case "steady": { const bits = []; if (p.links) bits.push(`+${p.links} chain link${p.links > 1 ? "s" : ""}`); if (p.brace) bits.push("brace vs the next stall"); text = "Steady \u2014 " + (bits.join(" & ") || "hold the chain"); break; }
    case "fill": { const lv = liveOf(p.amount); text = `Fill the need by ${lv ? readPhrase(p.amount.source) : "+" + amtNum(p.amount)}`; if (lv) { live = `now ${lv.n}`; zero = lv.n === 0; } break; }
    case "brim": { text = `Spill overflow (${readSrc(p.band) ? readPhrase(p.band.source) : "+" + amtNum(p.band)}) into Standing`; break; }
    case "mark-grain": text = `Stamp ${tgtPhrase(p.target)} as \u201c${p.suit}\u201d`; break;
    case "draw": text = `Draw ${p.n} ${p.suit ? p.suit + " " : ""}card${p.n > 1 ? "s" : ""}`; break;
    case "retire": text = `Last-light ${tgtPhrase(p.target)} \u2192 ${toPhrase(p.to)}`; break;
    case "whittle": { const lv = liveOf(p.amount); text = `Carve bright money${lv ? " from " + readPhrase(p.amount.source) : ""}`; if (lv) { live = `now ${r1(lv.n)}`; zero = lv.n < 1; } break; }
    case "court": text = `Court the ${p.stock} \u2014 needs chain ${typeof p.term === "number" ? p.term : 1}+ (gleam is the key, never spent)`; break;
    case "soothe": text = `Mend this town's grey (capped by the last-red)`; break;
    case "warm": text = `+${p.n} delight when woken`; break;
    case "keep": text = `Stays fresh one more season`; break;
    default: text = effect.do;
  }
  return { when: effect.when, whenLabel: WHEN_LABEL[effect.when] || effect.when, text, live, zero };
}

// ---------------------------------------------------------------- events -> a "moment" (grouped, with delta badges)
function nameOf(s, id) { const p = pieceById(s, id); return p ? CARDS.get(p.cardId).name : id; }
// tones: flow | gold | gleam | need | moss | pale | warn
function eventBadge(s, e) {
  const d = e.data || {};
  switch (e.type) {
    case "rested": return { tone: "flow", text: `poured ${r1(d.spend)} \u2192 landed ${r1(d.landed)} on ${nameOf(s, d.piece)}` };
    case "woke": return { tone: "gold", text: `\u2726 ${nameOf(s, d.piece)} wakes \u2014 yours for good`, big: true };
    case "gathered": return { tone: "flow", text: `${d.seats} seated \u2192 room +${r1(d.gain)}` };
    case "steadied": { const b = []; if (d.links) b.push(`chain +${d.links}`); if (d.braced) b.push("braced"); return b.length ? { tone: "moss", text: b.join(" \u00b7 ") } : null; }
    case "stamped": return { tone: "pale", text: `${nameOf(s, d.piece)} stamped ${d.suit}` };
    case "drew": return { tone: "pale", text: `drew ${d.pieces.map(p => nameOf(s, p)).join(", ")}` };
    case "filled": return { tone: "need", text: d.complete ? `need filled \u2014 the town is re-made \ud83c\udf3c` : `+${d.amount} into the need (${d.progress})`, big: d.complete };
    case "overkilled": return null; // covered by the gleam badge
    case "gleam": return { tone: "gleam", text: `+${d.amount} Standing (${d.grain}-tinged)`, big: true };
    case "brimmed": return { tone: "gleam", text: `the brim widens \u2014 +${d.extra} more Standing` };
    case "whittled": return { tone: "moss", text: `carved a handsel from the leavings` };
    case "courted": return { tone: "song", text: `the ${d.stock} is won over` };
    case "soothed": return { tone: "glaze", text: `the grey recedes \u2212${d.mend}` };
    case "retired": return { tone: "pale", text: `last-lit ${nameOf(s, d.piece)} (worth ${r1(d.worth)})` };
    case "warmed": return { tone: "moss", text: `+${d.n} delight warmed in` };
    case "kept": return { tone: "moss", text: `kept fresh a season longer` };
    case "brace-held": return { tone: "moss", text: `the brace holds \u2014 no harm` };
    case "refused": return { tone: "warn", text: `refused: ${d.why}` };
    default: return null;
  }
}
// Build ONE moment object from a play/stall action's events (afterState used for names).
export function buildMoment(afterState, events, header) {
  const badges = [];
  for (const e of events) { if (e.type === "played" || e.type === "dawn" || e.type === "dusk") continue; const b = eventBadge(afterState, e); if (b) badges.push(b); }
  return { ...header, badges, morning: afterState.calendar.morning };
}
