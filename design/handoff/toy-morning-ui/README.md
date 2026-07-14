# Handoff: Toy Morning — redesigned playtest UI

## Overview
A ground-up redesign of the **Toy Morning** UI (the playable slice of ROUNDELAY that lives in
`src/toy/main.tsx`, rendered into `#toyRoot` inside `planning/roundelay-codex.html`). The current
toy works but scatters information and buries causality in a text log. This redesign turns it into a
single-screen **dashboard**: the room read as a luminous pool, every card read as a pourable vessel,
an always-on visual pour preview, a dedicated Woken Crowd panel (the snowball made visible), and a
grouped moment-by-moment causality feed replacing the flat log — all in the codex's Daylight
watercolor palette.

It addresses the 11 ranked needs in the original brief (room provenance, card-as-vessel, visual pour
preview, chain, woken crowd, need + fillers, standing, plain-English effects, causality grouping,
dusk/dawn screens, deck picker + seed + guide).

## About the design files
The files in this bundle are **design references created in HTML** — a working prototype showing the
intended look and behavior. They are **not production code to copy directly**. The task is to
**recreate this UI inside the real toy** — i.e. rewrite `src/toy/main.tsx` (React 19, esbuild) and its
hand-authored CSS in `planning/roundelay-codex.html` (the `.tcard`/`.tmeter`/`.tguide` region) to look
and behave like this prototype, following the repo's existing patterns and the Daylight theme.

### ⚠ THE IRON RULE (unchanged from the brief)
The prototype ships with `engine.js` — **a faithful browser PORT of the real engine** (`src/engine/{state,reads,effects,morning}.ts`) so the design could be driven live. **Do NOT keep or reimplement `engine.js` in the real toy.** In the real toy, the UI's only rule-source is the actual engine:
`dawn` / `playPiece` / `stallAction` / `dusk` from `morning.ts`, and previews are made by calling
`playPiece` on the **current** state (it is pure — returns a new state without mutating) and **diffing**.
Never compute an outcome in the UI. `engine.js` exists only to prove the layout; use it to understand
what data each panel needs, then read those values from the real `GameState` / engine calls.

## Fidelity
**High-fidelity.** Final colors, typography, spacing, and interactions are all specified below and are
exact in the prototype. Recreate the UI pixel-close using the repo's Daylight CSS variables. The prototype
uses literal hex inline (design-tool constraint) — in the codex, prefer the existing `--*` Daylight tokens
(they map 1:1, see Design Tokens).

## How the prototype maps to the real engine
Everything the UI shows already exists in `GameState` / engine events. Mapping:

| Panel | Real source |
|---|---|
| The Room number + bar | `state.turn.room`; bar = `room / turn.roomAtDawn` |
| Room provenance chips ("base 2 · N seated +X · rings +Y · table +Z") | the `dawn` event's `data` (`base`, `seats`, `seatRoom`/derive per-seat, `ringDraw`, `tableDraw`). In the port these are bundled on `turn.dawnIncome`; in the real engine read them from the emitted `dawn` event. |
| "poured so far" | sum of `spend` from `rested`/play events this morning (port tracks `turn.pouredThisMorning`) |
| Chain: links, ×now, ×next, braced | `turn.chainLinks`; `chainMultiplier(links)` and `chainMultiplier(links+1)` from `effects.ts`; `turn.braced` |
| Stall cost preview (`R → floor(R/2)`) | `turn.room` and `STALL_ROOM_FACTOR` (0.5), or braced ⇒ "brace absorbs it" |
| The Need: tier / progress / needFill | `state.asking` |
| Need fillers (which hand cards can fill) | hand pieces whose card has a `fill` effect |
| Card vessel (set vs mark vs ceiling) | `piece.set`, `card.mark`, `card.ceiling` |
| Pour preview (spend → ×chain → landed, wakes?, past ceiling?, +gleam, +fill, room after) | `playPiece(state, id, spend)` on a clone, **diffed** — exactly the existing `previewPlay` pattern in `main.tsx` |
| Woken Crowd (seat contribution 2×0.8ⁿ, dawn effect, grain, payoff, delight) | fired pieces (`piece.fired`); seat value = `SEAT_FIRST * SEAT_DECAY**index` (home-note = index 0); effects glossed by `when` |
| Moments (grouped causality) | the `events` array returned by each engine call, grouped under the action header with delta badges |
| Standing | `state.player.gleam` (+ `gleamGrain` for the grain tint) |
| Dusk screen | the `dusk` event's `data` (`unspent`, `coldSet`, `sweep`, `table`, `camped`) |
| Dawn income line | the `dawn` event's `data` |
| Plain-English effects + zero-value flags | port the `gloss()`/`GROUPS` glossers from `planning/roundelay-card-gallery.html`; evaluate `read()` amounts against current state to show "now N" and flag 0 |

The port's `glossEffect`, `previewPlay`, and `buildMoment` functions in `engine.js` show the exact shape
each panel wants — reuse that logic against the real engine's data.

## Screens / views

### 1. Play workspace (the dashboard) — default
Full-viewport column: **masthead → guide strip → status strip → body(center + right rail)**.

- **Masthead** (top bar, ~`padding:7px 16px`, bottom border `rgba(74,54,32,0.15)`, bg `linear-gradient(180deg,#fffaf0,#fdf5e6)`):
  - Left: "Toy Morning" (Cormorant Garamond 22px 600, `#8f671d`), then "Morning N · {leg}" (Mulish 12px, `#8a765b`), then 5 season dots (current = 22px wide pill `#b8862e`, past `#caa044`, future `rgba(74,54,32,0.2)`).
  - Center: 7 deck chips (Apprentice, Kilnfast, Eveners, Untold, Fairwrights, Mannerly, Gleaners) — Mulish 9.5px 700 uppercase, `padding:4px 8px`, radius 99px; active chip filled with its Way color (see tokens), text `#fffaf0`; inactive transparent, border `rgba(74,54,32,0.15)`, text `#8a765b`. Then a "seed" number input (mono, width ~56px).
  - Right: Standing (`✦ N`, Cormorant 24px 700 `#d99a2a`), Woken (`#b8862e`), Purse (`#6f8f4a`), each with a mono 9px uppercase label; then a "guide off / 🧭 guide" toggle chip.
- **Guide strip** (dismissable): bg `rgba(184,134,46,0.12)`, border `#8f671d`, radius 11px, 🧭 + progress-aware text (Spectral 14.5px). See Interactions → guide.
- **Status strip** (row of 3 cards, `gap:10px`, `padding:10px 16px 0`):
  - **The Room** (flex 1.7): mono label, big Cormorant 38px `#3f8fa6` number, a thin fill bar (`#efe6d3` track, fill gradient `linear-gradient(90deg,#8ccadb,#3f8fa6)`), and a row of provenance chips ("from base gathering +2", "1 seated +2", "poured 0") — mono 9px, each tinted by tone (flow `#3f8fa6`, moss `#6f8f4a`, pale `#7f92a6`, need `#c1653a`) at ~11% bg.
  - **The Chain** (flex 1.15): mono label, link beads (12px dots, lit = `#b8862e` with glow), two mini stat boxes "now ×M" (neutral `#f7f1e4`) and "next ×M" (gold-tinted), and a braced badge (moss when braced, faint otherwise).
  - **The Need** (flex 1.35): "The {tier}'s Need" label, `progress/needFill` (Cormorant 17px `#c1653a`), a fill bar (gradient `linear-gradient(90deg,#d98a5f,#c1653a)`), and a one-line "can fill: …" / "no card in hand can fill it" (ellipsis). Border turns `rgba(193,101,58,0.5)` when a hand card can fill.
- **Body** (`display:flex; gap:11px; padding:11px 16px 14px; flex:1; min-height:0`):
  - **Center** (`flex:1`, column): an inner **scroll area** (`flex:1; overflow-y:auto`) containing, top-to-bottom: the **Pour panel** (only when a card is selected; `order:-1` floats it above the hand), the **Hand** grid, and **On the table**. Below the scroll area, a **pinned actions footer** (`flex:none`, right-aligned): "Run an errand" (shows its cost, e.g. `7 → 3`, or "brace absorbs it") and "End the morning →" (gold gradient primary).
  - **Right rail** (width 300px, column): **Woken Crowd** (top, ~flex 55%, own scroll) and **Moments** (bottom, ~flex 45%, own scroll).

**Hand card** (uniform grid, `grid-template-columns:repeat(auto-fill,minmax(178px,1fr)); gap:10px`; each card `min-height:150px`, column flex, bg `linear-gradient(168deg,#fffdf7,#fffaf0)`, `border-top:4px solid {grainColor}`, radius 11px, `padding:9px 11px`; selected ⇒ border = grain color + ring shadow; fillable ⇒ border `rgba(193,101,58,0.55)`):
- Row 1: grain dot + name (Cormorant 16.5px 600) + inline `✦` if woken + grain label (mono 9px, grain color).
- Row 2: chips `wake {mark}` · `ceil {ceiling}` · `gift {delight}` (mono 9px, `rgba(74,54,32,0.06)` bg) + a `set N` chip in flow color when attention is on it.
- Row 3+: each effect as `[when]` tag (mono 8px) + plain-English text (Mulish 11.5px). Zero-value reads render in `#a8552f` with "— nothing to feed yet".
- **No vessel in hand** (a hand card has 0 set — an empty vessel confused testers). The vessel appears only where poured attention is shown: the pour panel and the table.

**Pour panel** (compact; appears on select, floats to top of center): a small glass vessel (66×148px) on the left showing current fill (blue `linear-gradient(180deg,#63b0c4,#3f8fa6)`), amber overflow above the ceiling (`linear-gradient(180deg,#e7b647,#d99a2a)`), a dashed gold **mark line** (`#b8862e`) and dashed gleam **ceiling line** (`#d99a2a`), plus an animated striped **ghost** rising from current set to the previewed landing. Right side: name + "wake M · ceil C", a pour **slider** (0..floor(room)), the flow row **spend → × chain → lands** (three labelled chips: spend `#c1653a`, chain `#b8862e`, lands `#3f8fa6`), delta **badges** (wakes / past-ceiling / +Standing / +need / room after), and **Pour it** / **Never mind** buttons.

**On the table**: small vessels (34×74px) for banked-cold pieces (`set/mark cold`) and woken pieces (gold left border + `✦`, "woken").

**Woken Crowd**: a home-note row (🏠, "always seat #1", `+2`), then one card per fired piece — grain dot + name + "seat #N", and grant lines: ☼ "seats the room +X at dawn" (X = `2×0.8^index`), ◈ "feeds 'woken:{grain}' reads", ✦ "each dawn: …" (if on-dawn), ✧ "{when}: …" payoff, ❀ "pours {delight} delight into needs".

**Moments**: newest first, each = an action header (dot in the action's accent + title + sub like "link 2 · ×1.3") with indented **delta badges** for its consequences (poured/landed, ✦ wakes, room +X, chain +N, +Standing, +need, refused, …). Tones map to the palette below.

### 2. Dusk screen
Replaces the workspace when the morning ends. Centered card (~520px): eyebrow "Dusk settles", title "The light goes long and gold", a blurb, an itemized **"what seeps to the town's table"** table (unspent room, cold pieces released, → total to the table with "⅔ returns at dawn" when camped), an audience line ("N woken pieces will seat tomorrow's room — worth about +X"), and a **"Take the next dawn →"** button.

### 3. Dawn
Not a separate screen — taking the next dawn returns to the workspace with the room recomputed and a **Dawn moment** at the top of the feed itemizing the income (base, seated, rings, table, drew N).

## Interactions & behavior
- **Select a card** → pour panel opens above the hand; slider defaults to `min(floor(room), card.mark)` (just enough to wake).
- **Slider** → live preview via `playPiece` clone-and-diff; the ghost fill and all badges/numbers update.
- **Pour it** → `playPiece(state, id, spend)`; append a moment; clear selection. Pour 0 = "Bank it cold".
- **Run an errand** → `stallAction`; unbraced halves the room + breaks the chain, braced absorbs one stall.
- **End the morning** → `dusk`; show dusk screen.
- **Take the next dawn** → refresh asking (FIDELITY stand-in) + `dawn`; back to workspace.
- **Deck chip / seed** → new run (`createInitialState(seed, deck)` → dawn); apprentice = shared 7, a Way = shared 7 + that Way's 7.
- **Guide** is progress-aware: it reads milestone markers derived from engine events (played / woke / chain≥2 / dusk / morning≥2 / gleam / need-complete / banked) and shows the next un-done step; "guide off" hides it. Never drives rules.
- **Transitions**: vessel fills `.4s cubic-bezier(.2,.7,.2,1)`; ghost pulse `tmGhost 1.1s`; moments/pour rise-in `.28–.3s`; a `tmWake` glow when a table piece is freshly woken. `prefers-reduced-motion` should disable these.
- **Refusals** surface as a warn-tone badge in the moment ("refused: …") — from the engine's own `refused` events, never suppressed.

## State management
Run state mirrors the existing toy: `{ s: GameState, phase: "play"|"dusk", moments: Moment[], seen: string[] }`, plus UI-only `selected: instanceId|null`, `pour: number`, `guideOn: boolean`, `deck`, `seed`. Every action replaces `s` with the engine's returned state and appends the events (grouped into a Moment). No derived rule-state is stored — panels compute from `s` each render.

## Design tokens (Daylight — already in the codex `:root`)
Use the codex's existing `--*` variables; hex equivalents (as used in the prototype):
- Surfaces: `--bg #f7f1e4`, `--bg-deep #efe6d3`, `--panel #fffaf0`, `--panel-2 #fdf5e6`, `--panel-hi #fffdf7`
- Lines: `--line rgba(74,54,32,0.30)`, `--line-soft rgba(74,54,32,0.15)`
- Ink: `--ink #33271a`, `--ink-dim #5c4a33`, `--ink-faint #8a765b`
- Accents: `--gold #b8862e`, `--gold-soft #caa044`, `--gold-deep #8f671d`, `--gleam #d99a2a`, `--pale #7f92a6`, `--flow #3f8fa6`, `--need #c1653a`, `--moss #6f8f4a`
- Grains: joinery `#bf8a34`, thread `#4f7fb0`, song `#8a63b8`, glaze `#2f9e90`, dance `#c85f8c`, dough `#b7973f`
- Ways: kilnfast `#c47b2b`, eveners `#3f9977`, untold `#4f83bf`, fairwrights `#c85f8c`, mannerly `#8a63b8`, gleaners `#6f9440`
- Type: display `Cormorant Garamond`, body `Spectral`, ui `Mulish`, mono `Spline Sans Mono`. **Force lining figures** (`font-variant-numeric:lining-nums`) — Cormorant's default old-style "1" reads as "I", bad for a numbers UI.
- Radii ~9–14px; soft ink shadows `0 3px 16px rgba(74,54,32,0.07)`.

## Assets
None external beyond the four Google Fonts above (already loaded by the codex). No images; the home-note/grant icons are Unicode glyphs (🏠 ☼ ◈ ✦ ✧ ❀). Vessels are pure CSS.

## Files
- `Toy Morning.dc.html` — the full interactive prototype (design of record). Layout, styling, copy, and interaction logic all live here.
- `engine.js` — **reference port only** (see IRON RULE). Read it to see exactly what each panel needs from state/events and reuse its `glossEffect` / `previewPlay` / `buildMoment` logic against the real engine — do not ship it.
- In the target repo, the work lands in: `src/toy/main.tsx` (React app) and the Toy-Morning CSS region of `planning/roundelay-codex.html`; re-bundle with `npm run build:toy`.
