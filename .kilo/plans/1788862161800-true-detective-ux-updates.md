# True Detective — UX Updates Plan

## Scope
All changes target `true-detective/` only. Mini-games (`scene_fouille`, `montre_code`) keep current styling.

## Task 1 — Mobile decor image: enlarge + brighten (narration/game phases, not mini-games)

**Files:** `styles.css`

- In `@media (max-width: 768px)` and `@media (max-width: 480px)`:
  - `#game-screen .game-visuals` already `height: 50vh` — keep.
  - `#game-screen .bg-layer`: add `filter: brightness(1.25) contrast(1.05) saturate(1.1);` so the background decor is visibly brighter/more luminous on mobile.
  - `#game-screen .npc-image`: bump `max-height` to `98%` and add `filter: brightness(1.15) drop-shadow(...)` so the character reads larger and brighter.
- Desktop (>768px) unchanged.
- Mini-game screens are not affected (they use `.minigame-*` classes, not `#game-screen .game-visuals`).

## Task 2 — Orientation toggle button in settings

**Files:** `index.html`, `app.js`, `styles.css`

- Add a toggle button in the settings menu panel (top-bar-right, id `orientation-toggle`), visible only on mobile (`max-width: 768px`). Icon rotates ( ↻ / ↺ ) and aria-pressed reflects state.
- Add a CSS class `.orientation-vertical` / `.orientation-horizontal` on `#game-screen`. Vertical = current layout. Horizontal = a wider, side-by-side layout (dialogue left, visuals right) for landscape phones / tablets.
- `app.js`:
  - `ui.orientation = 'vertical'` (default), persisted in `localStorage` under `trueDetective_settings.orientation`.
  - `applyOrientation()` reads the stored value, toggles the class, updates the button icon/aria.
  - Called at init and on the toggle click.
- The toggle is hidden on desktop via CSS.

## Task 3 — Settings title in hamburger menu

**Files:** `index.html`

- Add a title element (e.g. `<span class="settings-title">Settings</span>`) inside `.settings-menu-panel` (or as the first child) so the hamburger-opened menu shows a heading.

## Task 4 — Enforce 3 phases × 3 questions interrogation limit

**Files:** `narrativeEngine.js`, `app.js`, possibly `server.js`

- Track per-NPC interrogation counters in game state:
  - `interrogationPhaseCounts`: `{ [npcId]: { phase1: 0, phase2: 0, phase3: 0 } }` (or a flat array of 3 counters per NPC).
- In `talkToNPC` (narrativeEngine.js): increment the current phase counter; if it reaches 3, set a flag `interrogationComplete` for that NPC and return a response indicating the interrogation is over.
- In `app.js` `sendPlayerText` / choice handling: when `interrogationComplete` is true for the current NPC, disable the conversation input and show a toast "Interrogation complete — 3 questions per phase reached." Then auto-advance to the next scene/page (call `handleContinue`).
- Server-side (`server.js` / `lib/true-detective-ai`): the `npc-response` handler should also respect the limit if state is sent; but the primary enforcement is client-side to avoid extra API calls.

## Task 5 — Shorten continue button width on laptop

**Files:** `styles.css`

- `.btn-continue` currently `width: calc(100vw - 40px); max-width: 400px;` on all sizes.
- Add a desktop-only rule (min-width: 769px) that sets `width: auto` and `max-width: 320px` (or matches the dialogue box width) so the button is not full-screen wide on laptop. Keep padding/font-size.

## Validation
- `npm run validate:scenario` (scenario coherence)
- `node -c` on changed `.js` files for syntax
- Manual: start a scenario game, test mobile decor brightness, toggle orientation, open settings menu, interrogate an NPC 9+ times and confirm it stops at 3×3, check continue button width on a >768px viewport.

## Out of scope
- No changes to mini-game internals.
- No backend API contract changes beyond optional enforcement in `npc-response`.