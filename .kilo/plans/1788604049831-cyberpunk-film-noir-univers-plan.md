# Implementation Plan: Cyberpunk & Film Noir Universes for True Detective

## Objective
Add Cyberpunk (🌃) and Film Noir (🎩) as selectable universes for the True Detective scenario game. Both share the same scenario logic but get universe-specific:
- Decor/location images
- NPC character images
- NPC character names
- Theme music (already partially done)
- Narrative text (character name references, location references)

---

## Context — Current State

### Themes Already Declared
`app.js:4-13` — THEMES array already includes `cyberpunk` and `film-noir` with IDs `cyberpunk` and `film-noir`.

### All Themes Point to Classic Assets
`app.js:41-57` — `THEME_ASSETS` maps both `cyberpunk` and `film-noir` to `CLASSIC_ASSETS`.

### Theme Cards Only Show Classic
`app.js:379-398` — `renderThemeCards()` filters to only `th.id === 'agatha-christie'`.

### NPC Image Bypass Bug
`app.js:2551-2555` — `EXTRA_NPC_IMAGES` hardcodes classic paths for `protecteur`, `scientifique`, `criminel`, bypassing `THEME_ASSETS` entirely. `scrNpcImage()` at `app.js:2616-2621` checks `EXTRA_NPC_IMAGES` first.

### NPC Names Hardcoded
`app.js:2539-2548` — `SCENARIO_NPC_NAMES` uses classic names (Major Hale, Lady Vivienne, etc.) for all themes.

### Choice Labels Hardcoded
`app.js:2629-2639` — `scrChoiceLabel()` uses classic names.

### Decor Image Hardcoding
`app.js:2591-2614` — `scrDecorImage()` hardcodes `universeSherlock` and `sherlock` to `univers/sherlock.jfif`.

### Missing Theme Asset Maps
No `CYBERPUNK_ASSETS` or `FILM_NOIR_ASSETS` objects exist. All themes reference `CLASSIC_ASSETS`.

### Narrative Text Hardcoded in FR/EN
`phases.js` and `narration.js` — Character names ("Major Hale", "Lady Vivienne", etc.) are embedded directly in text strings. No placeholder/substitution system exists.

### Scene Image Hardcoded in Phases
`phases.js:52` and `phases.js:79` — `sceneImage` field hardcoded to `lieux/classic/scene de crime manoir.png`.

### Music Already Wired
`audioService.js:13-22` — `THEME_MUSIC` and `THEME_MUSIC_TRACKS` already map `cyberpunk` → `cyberpunk.mp3` and `film-noir` → `noire.mp3`.
`index.html:227` — Both tracks already listed in the music player.

### Outro Uses Hardcoded Sherlocked Decor
`app.js:3277` and `app.js:3301-3305` — `buildOutroPages()` uses `decor: 'sherlock'` for the final page, hardcoded to `univers/sherlock.jfif`.

### Asset Inventory (verified)

#### Characters — ALL present
- **Classic** (`characteres/classic/`): `Le_Protecteur.png`, `femme-fatal.png`, `le-seducteur.png`, `Le-suspect.png`, `le-scientific.png`, `Le-marginal.png`, `le-criminel.png`, `detective-partenaire.png`
- **Cyberpunk** (`characteres/cyberpunk/`): `protecteur.png`, `femme-fatal.png`, `seducteur.png`, `suspect.png`, `scientific.png`, `marginal.png`, `criminel.png`, `detective-partenaire.png`
- **Noire** (`characteres/noire/`): `protecteur.png`, `femme fatal.png` (space), `seducteur.png`, `suspect.png`, `scientific.png`, `marginal.png`, `criminel.png`, `detective partenaire.png` (space)
- **Universe illustrations** (converted to .png): `univers/cyberpunk.png`, `univers/noire.png`, `univers/sherlock.jfif` (classic unchanged)

#### Locations — cyberpunk complete (now .png with hyphens), noire still missing residence
- **Classic** (`lieux/classic/`): `manoir.png` (universe), `scene de crime manoir.png`, `interieur manoir.png`, `ruelle.png`, `exterieur bar.png`, `interieur bar.png`, `appartement suspect.png`, `laboratoire.png`, `quartier general.png`, `prison.jfif`, `paradisique.png`, `exterieur quartier général.png`
- **Cyberpunk** (`lieux/cyberpunk/` → all .png, hyphens for multi-word): `exterieur-manoir.png`, `scene-de-crime.png`, `interieur-manoir.png`, `ruelle.png`, `exterieur-bar.png`, `interieur-bar.png`, `appartement-suspect.png`, `appartement-pauvre.png`, `laboratoire.png`, `interieur-quartier-général.png`, `exterieur-quartier-général.png`, `prison.png`, `paradisique.png`
- **Noire** (`lieux/noire/` → all .png, spaces retained): `exterieur manoir.png`, `scene de crime.png`, `ruelle.png`, `exterieur bar.png`, `interieur bar.png`, `appartement suspect.png`, `appartement pauvre.png`, `laboratoire.png`, `interieur quartier général.png`, `exterieur quartier général.png`, `prison.png`, `paradisique.png`, `chicago.png`
- **Noire STILL MISSING**: `interieur manoir.png` (residence interior — used extensively in phases)

### Decor Key → Asset Key Mapping (from scrDecorImage)
| Decor Key | Asset Key | Classic File | Cyberpunk File | Noire File |
|-----------|-----------|-------------|----------------|------------|
| `universe` | `assets.universe` | `lieux/classic/manoir.png` | `lieux/cyberpunk/exterieur-manoir.png` | `lieux/noire/exterieur manoir.png` |
| `universeSherlock` | hardcoded → `assets.universeImg` | `univers/sherlock.jfif` | `univers/cyberpunk.png` | `univers/noire.png` |
| `sherlock` (outro) | hardcoded → `assets.universeImg` | `univers/sherlock.jfif` | `univers/cyberpunk.png` | `univers/noire.png` |
| `crimeScene` | `assets.crimeScene` | `lieux/classic/scene de crime manoir.png` | `lieux/cyberpunk/scene-de-crime.png` | `lieux/noire/scene de crime.png` |
| `residence` | `assets.residence` | `lieux/classic/interieur manoir.png` | `lieux/cyberpunk/interieur-manoir.png` | **MISSING** |
| `alley` | `assets.alley` | `lieux/classic/ruelle.png` | `lieux/cyberpunk/ruelle.png` | `lieux/noire/ruelle.png` |
| `bar` | `assets.publicPlace` | `lieux/classic/exterieur bar.png` | `lieux/cyberpunk/exterieur-bar.png` | `lieux/noire/exterieur bar.png` |
| `barInterieur` | `assets.barInterieur` | `lieux/classic/interieur bar.png` | `lieux/cyberpunk/interieur-bar.png` | `lieux/noire/interieur bar.png` |
| `secretPlace` | `assets.secretPlace` | `lieux/classic/appartement suspect.png` | `lieux/cyberpunk/appartement-suspect.png` | `lieux/noire/appartement suspect.png` |
| `laboratoire` | `assets.laboratory` | `lieux/classic/laboratoire.png` | `lieux/cyberpunk/laboratoire.png` | `lieux/noire/laboratoire.png` |
| `qg` | `assets.headquarters` | `lieux/classic/quartier general.png` | `lieux/cyberpunk/interieur-quartier-général.png` | `lieux/noire/interieur quartier général.png` |
| `prison` | `assets.prison` | `lieux/classic/prison.jfif` | `lieux/cyberpunk/prison.png` | `lieux/noire/prison.png` |
| `exile` | `assets.exile` | fallback to universe | `lieux/cyberpunk/paradisique.png` | `lieux/noire/paradisique.png` |

### NPC Character Name Mapping (proposed)
| NPC Key | Classic | Cyberpunk | Film Noir |
|---------|---------|-----------|-----------|
| `detective-partner` | Wexford | Detective Vega | Detective Reeves |
| `protecteur` | Major Hale | Cipher-7 | Mike Malone |
| `femme-fatale` | Lady Vivienne | Lyra Noir | Vivian Noir |
| `seducteur` | Julian Pembrooke | Dex Rook | Johnny Lorraine |
| `suspect` | Rupert Blackwood | Ledger-9 | Vincent Crowe |
| `marginal` | Silas Crane | Ghost | Eddie |
| `scientifique` | Dr Whitmore | Dr. Synapse | Dr. Coroner |
| `criminel` | Victor Krane | Razor | Louie the Blade |

---

## Implementation Steps

### Step 1: Create CYBERPUNK_ASSETS and FILM_NOIR_ASSETS maps
**File**: `app.js` (after `CLASSIC_ASSETS` definition, around line 38)

Create two new asset maps mirroring CLASSIC_ASSETS but pointing to cyberpunk/noire folders:
- All location paths → `lieux/cyberpunk/*.png` and `lieux/noire/*.png`
- Cyberpunk locations use hyphenated filenames (e.g., `exterieur-manoir.png`, `scene-de-crime.png`)
- Noire locations retain spaces (e.g., `exterieur manoir.png`, `scene de crime.png`)
- All character paths → `characteres/cyberpunk/*.png` and `characteres/noire/*.png`
- Add `universeImg` key → `univers/cyberpunk.png` and `univers/noire.png`
- Add `exile` key → `lieux/{theme}/paradisique.png`
- Set `music` key → `cyberpunk.mp3` / `noire.mp3`
- Add `protecteur`, `scientifique`, `criminel` keys for character images (replacing EXTRA_NPC_IMAGES bypass)

### Step 2: Update THEME_ASSETS mapping
**File**: `app.js` (lines 41-57)

Replace `cyberpunk: CLASSIC_ASSETS` and `film-noir: CLASSIC_ASSETS` with their respective new asset maps.

### Step 3: Make EXTRA_NPC_IMAGES theme-aware
**File**: `app.js` (lines 2550-2555)

Current: `EXTRA_NPC_IMAGES` hardcodes classic paths for `protecteur`, `scientifique`, `criminel`, and `scrNpcImage()` checks it first, bypassing THEME_ASSETS.

Fix: Add `protecteur`, `scientifique`, `criminel` to both `CYBERPUNK_ASSETS` and `FILM_NOIR_ASSETS` (they already exist as character files). Then modify `scrNpcImage()` to resolve through `THEME_ASSETS` instead of checking `EXTRA_NPC_IMAGES` first. Remove or repurpose `EXTRA_NPC_IMAGES`.

### Step 4: Create THEME_NPC_NAMES
**File**: `app.js` (near SCENARIO_NPC_NAMES, lines 2539-2548)

Create a `THEME_NPC_NAMES` object mapping theme IDs to NPC name dictionaries:
```javascript
var THEME_NPC_NAMES = {
    'agatha-christie': SCENARIO_NPC_NAMES,  // classic names
    'cyberpunk': { ... },                      // cyberpunk names
    'film-noir': { ... },                      // noir names
};
```
Modify `scrNpcName()` to look up names from `THEME_NPC_NAMES[getThemeId()]`.

### Step 5: Update scrChoiceLabel()
**File**: `app.js` (lines 2629-2639)

Make `scrChoiceLabel()` use per-theme names from `THEME_NPC_NAMES` instead of hardcoded classic names.

### Step 6: Fix scrDecorImage for universeSherlock and sherlock keys
**File**: `app.js` (lines 2591-2614)

Change `universeSherlock` and `sherlock` mappings from hardcoded `ASSETS_BASE + 'univers/sherlock.jfif'` to `assets.universeImg` (the new per-theme universe illustration key).

### Step 7: Update renderThemeCards()
**File**: `app.js` (lines 379-398)

Change the filter from `th.id === 'agatha-christie'` to include `cyberpunk` and `film-noir`:
```javascript
var visibleThemes = THEMES.filter(function (th) {
    return th.id === 'agatha-christie' || th.id === 'cyberpunk' || th.id === 'film-noir';
});
```

### Step 8: Fix sceneImage in phases.js
**File**: `phases.js` (line 52 and line 79)

Remove hardcoded `sceneImage` paths. Instead, resolve at runtime using `scrDecorImage('crimeScene')` — modify `scrLaunchMinigame()` in app.js to inject the theme-corrected `sceneImage` into the minigame config.

Alternatively: Set `sceneImage` in the minigame config to a special value like `'theme:crimeScene'` and resolve it in `scrLaunchMinigame()`.

### Step 9: Post-translation name substitution (no narrative file edits needed)
**File**: `app.js`

Instead of tokenizing text in phases.js, narration.js, and scenario.js, use **post-translation string replacement**:

1. Create `THEME_NAME_OVERRIDES` object mapping theme ID → map of { classic_name → theme_name }:
```javascript
var THEME_NAME_OVERRIDES = {
    'cyberpunk': {
        'Major Hale': 'Cipher-7',
        'Lady Vivienne': 'Lyra Noir',
        'Julian Pembrooke': 'Dex Rook',
        'Rupert Blackwood': 'Ledger-9',
        'Silas Crane': 'Ghost',
        'Victor Krane': 'Razor',
        'Krane': 'Razor',
        'Dr Whitmore': 'Dr. Synapse',
        'Whitmore': 'Synapse',
        'Wexford': 'Detective Vega',
    },
    'film-noir': {
        'Major Hale': 'Mike Malone',
        'Lady Vivienne': 'Vivian Noir',
        'Julian Pembrooke': 'Johnny Lorraine',
        'Rupert Blackwood': 'Vincent Crowe',
        'Silas Crane': 'Eddie',
        'Victor Krane': 'Louie the Blade',
        'Krane': 'Louie',
        'Dr Whitmore': 'Dr. Coroner',
        'Whitmore': 'Coroner',
        'Wexford': 'Detective Reeves',
    },
};
```

2. Create `scrSubstituteNames(text, themeId)` function that:
   - Returns text unchanged if theme is 'agatha-christie' or 'sherlock-holmes'
   - Sorts substitution keys by length (longest first) to prevent partial replacements
     (e.g., "Major Hale" replaced before "Hale", "Victor Krane" before "Krane")
   - Iterates keys and replaces all occurrences using `String.prototype.split().join()`

3. Call `scrSubstituteNames()` in these locations:
   - `renderScenarioPage()` — after `TDScenario.t(page.text, ui.language)` (line ~2750)
   - `scrAskInterroQuestion()` — after `TDScenario.t(q.response, ui.language)` (line ~2991)
   - `scrShowInterroQuestions()` — after `itl(q.label)` for question labels (line ~2979)
   - `buildOutroPages()` — after text retrieval for all reaction/summary text
   - `buildEnding()` — after `TDScenario.t()` calls for truth data

4. None of the replacement names contain classic name substrings, so no collision risk.

**Classic names requiring substitution** (verified across phases.js, narration.js, scenario.js):
- `Major Hale` — appears in phases.js, narration.js interrogations, scenario.js TRUTH
- `Lady Vivienne` — same
- `Julian Pembrooke` — same
- `Rupert Blackwood` — same
- `Silas Crane` — same
- `Victor Krane` / `Krane` (standalone) — in narration.js interrogations
- `Dr Whitmore` / `Whitmore` (standalone) — in narration.js interrogations
- `Wexford` — in narration.js detective-partner interrogations, phases.js intro text

### Step 10: Override TRUTH titles per theme
**File**: `app.js`

Create `THEME_TRUTH_TITLES` for per-theme culprit display names (used in outro "X is guilty"):
```javascript
var THEME_TRUTH_TITLES = {
    'agatha-christie': null,  // use original from scenario.js
    'cyberpunk': {
        protecteur: { fr: 'Cipher-7', en: 'Cipher-7' },
        'femme-fatale': { fr: 'Lyra Noir', en: 'Lyra Noir' },
        seducteur: { fr: 'Dex Rook', en: 'Dex Rook' },
        suspect: { fr: 'Ledger-9', en: 'Ledger-9' },
        marginal: { fr: 'Ghost', en: 'Ghost' },
        criminel: { fr: 'Razor', en: 'Razor' },
    },
    'film-noir': {
        protecteur: { fr: 'Mike Malone', en: 'Mike Malone' },
        'femme-fatale': { fr: 'Vivian Noir', en: 'Vivian Noir' },
        seducteur: { fr: 'Johnny Lorraine', en: 'Johnny Lorraine' },
        suspect: { fr: 'Vincent Crowe', en: 'Vincent Crowe' },
        marginal: { fr: 'Eddie', en: 'Eddie' },
        criminel: { fr: 'Louie the Blade', en: 'Louie the Blade' },
    },
};
```

In `buildOutroPages()` and `buildEnding()`, when theme ID is not 'agatha-christie', use `THEME_TRUTH_TITLES[themeId][culprit]` instead of `truth.title`. Still apply name substitution to the remaining truth fields (mobile, methode, etc.).

### Step 11: Override buildOutroPages city/location text
**File**: `app.js` (buildOutroPages, lines 3277, 3301-3305, 3324-3330, 3338+)

Current outro text references "Londres" / "London", "becs de gaz" / "gas lamps", and "tropical sun" / "soleil des tropiques" — hardcoded to Victorian London.

Create `THEME_OUTRO_TEXT` map for universe-specific outro descriptions:
```javascript
var THEME_OUTRO_TEXT = {
    'agatha-christie': {
        win_fr: 'Sous le ciel de Londres, les becs de gaz dessinent des halos orange. La vérité a émergé, même par le bas.',
        win_en: 'Under the London sky, gas lamps draw orange halos. The truth emerged, even if by the back door.',
        fail_fr: 'Le mystère reste entier dans les ruelles de Londres.',
        fail_en: 'The mystery remains unsolved in the London alleys.',
        exile_fr: 'Sous le soleil des tropiques, le vrai coupable sirote un cocktail au bord de la piscine d\'un palace.',
        exile_en: 'Under the tropical sun, the real culprit sips a cocktail by the pool of a palace.',
    },
    'cyberpunk': {
        win_fr: 'Sous les néons de la mégapole, la pluie digitale caresse les façades. La vérité a émergé de la boue holographique.',
        win_en: 'Under the neon megacity, digital rain washes the facades. The truth emerged from the holographic mire.',
        exile_fr: 'Dans les néons clignotants de la mégapole, le vrai coupable se fait discret parmi la foule cybernétique.',
        exile_en: 'Among the flashing neon of the megacity, the real culprit melts into the cybernetic crowd.',
    },
    'film-noir': {
        win_fr: 'Sous le ciel pluvieux de Chicago, les réverbères dessinent des halos rouges. La vérité a émergé dans la brume.',
        win_en: 'Under the rainy Chicago sky, streetlamps cast red halos. The truth emerged from the fog.',
        exile_fr: 'Dans les ruelles sombres de Chicago, le vrai coupable s\'enfuit dans la nuit au gré des ombres.',
        exile_en: 'In the dark alleys of Chicago, the real culprit flees into the night through shifting shadows.',
    },
};
```

Use `THEME_OUTRO_TEXT[getThemeId()]` for outro page 3 (win/fail) and exile page 1 text. Fall back to agatha-christie text for any missing theme keys.

---

## Dependencies & Ordering

1. Steps 1-2 (asset maps + THEME_ASSETS) must be done before Step 3 (NPC images) and Step 6 (decor resolution)
2. Step 4 (NPC names) must be done before Steps 5 (choice labels) and 9 (name substitution)
3. Steps 4-5 must be done before Step 10 (TRUTH titles)
4. Step 6 (decor resolution) must be done before Step 11 (intro/outro)
5. Step 7 (theme cards) is independent
6. Step 8 (sceneImage) is independent but requires changes to both `phases.js` and `minigames.js`
7. Steps 9-11 (narrative substitution) depend on Steps 1-5 being complete

## Files to Modify
1. `app.js` — Steps 1-7, 8(partial), 9-11 (asset maps, NPC names, name substitution, outro text)
2. `phases.js` — Step 8 (remove hardcoded sceneImage paths, or replace with theme-aware reference)
3. `minigames.js` — Step 8 (inject theme-aware sceneImage into minigame config)

## Files to Create
- None required. All narrative adaptation is handled via runtime substitution in `app.js`.

## Open Questions / Gaps

1. **Missing asset**: `lieux/noire/interieur manoir.png` does not exist. This is the `residence` location used in ~10 phase pages for interior manor interrogations. Cyberpunk now HAS `interieur-manoir.png` (was previously missing, now present as .png).
   - **Risk**: Without this asset, noir residence scenes will show a broken image.
   - **Proposed fix**: Create a new `interieur manoir.png` for noire, or fall back to `exterieur manoir.png` in the asset map.

2. **Filename inconsistencies** between universes — handled by per-theme asset maps (no action needed):
   - Classic: `Le_Protecteur.png` (underscore, capital L) vs cyberpunk/noire: `protecteur.png`
   - Noire: `femme fatal.png` (space) vs classic: `femme-fatal.png` (hyphen)
   - Cyberpunk locations use hyphens (e.g., `exterieur-manoir.png`, `scene-de-crime.png`), noire uses spaces (e.g., `exterieur manoir.png`, `scene de crime.png`)
   - All location/universe images converted from `.jfif` to `.png` for cyberpunk and noire (classic remains `.jfif`/`.png` mix)
   - `univers/sherlock.jfif` remains `.jfif` (classic only)

3. **Name substitution safety**: Verify no replacement names contain classic name substrings.
   - Cyberpunk names: Cipher-7, Lyra Noir, Dex Rook, Ledger-9, Ghost, Razor, Dr. Synapse, Detective Vega — safe ✓
   - Film Noir names: Mike Malone, Vivian Noir, Johnny Lorraine, Vincent Crowe, Eddie, Louie the Blade, Dr. Coroner, Detective Reeves — safe ✓

4. **Voice profiles** in `audioService.js`: Already archetype-based, theme-agnostic. No changes needed.

5. **Phase music** in `scrMusicPlaying()`: Phase tracks (`recherche.mp3`, `enigme.mp3`, etc.) are shared across themes. Theme music (`cyberpunk.mp3`, `noire.mp3`) already mapped. No changes needed.

6. **buildTransitionPages()** (app.js:1287+): Uses `assets.alley`, `assets.universe`, etc. — already theme-aware via `THEME_ASSETS`. No changes needed beyond Steps 1-2.

## Validation Plan

1. **Asset path verification**: Confirm all `CYBERPUNK_ASSETS` and `FILM_NOIR_ASSETS` paths point to existing files (verified via glob: all .png, cyberpunk uses hyphens, noire uses spaces).
2. **Theme card rendering**: Verify cyberpunk and film-noir cards appear on the theme selector screen.
3. **Theme selection**: Verify selecting cyberpunk plays `cyberpunk.mp3`, film-noir plays `noire.mp3`.
4. **NPC image resolution**: Verify NPC images load from the correct themed character folder (characteres/cyberpunk/*.png, characteres/noire/*.png).
5. **NPC name display**: Verify character names appear as cyberpunk/noir variants in NPC labels, choice labels, interrogation text, and truth data.
6. **Decor image resolution**: Verify all decor keys show themed images (crimeScene → `scene-de-crime.png`/`scene de crime.png`, residence → `interieur-manoir.png`/MISSING for noire, barInterieur → `interieur-bar.png`/`interieur bar.png`, etc.).
7. **Universe illustration**: Verify intro prologue uses `univers/cyberpunk.png` or `univers/noire.png`.
8. **Minigame scene image**: Verify crime scene minigame loads the correct themed image (`scene-de-crime.png` / `scene de crime.png`).
9. **Name substitution**: Verify all character names in phases.js, narration.js, and scenario.js appear as theme-specific names at runtime.
10. **Outro text**: Verify city/location references adapt per theme (neon megacity for cyberpunk, Chicago fog for noir).
11. **Music playback**: Verify theme music plays on game start, phase music plays on transitions.

## Risk Assessment

- **Low risk**: Asset maps, theme card rendering, NPC image/decor resolution, universe illustration (mechanical changes, well-understood code paths)
- **Medium risk**: Name substitution coverage — need to verify all name variants are covered (standalone "Krane", "Whitmore", "Wexford")
- **Medium risk**: Outro text overrides — ensure all ending branches (win/fail/exile/partial) have theme-appropriate text
- **Gap risk**: Missing `lieux/noire/interieur manoir.png` for noire residence — requires new asset or fallback to `exterieur manoir.png`
- **Low risk**: sceneImage fix — simple config injection in minigame launcher
