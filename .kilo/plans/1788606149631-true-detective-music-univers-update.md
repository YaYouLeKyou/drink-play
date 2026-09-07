# Plan: Music System for 3 Universes (Classic / Cyberpunk / Noir)

## Contexte (commit `bbd414a`)

Le système musicale dans le mode scénario fonctionne via :
- `PHASE_MUSIC_TRACKS` (`app.js`, ~line 100) — map les clés de phase vers les fichiers audio
- `scrMusicPlaying()` (`app.js`, ~line 3000) — lit `PHASE_MUSIC_TRACKS` ou `getThemeMusic()` pour `'theme'`
- `THEME_MUSIC` (`audioService.js`, ~line 13) — map les thèmes vers les morceaux de thème
- `scrShowActPage()` (`app.js`, ~line 2841) — montre l'overlay "Acte X" entre les actes

## Bugs actuels

1. **`PHASE_MUSIC_TRACKS['reflexion']`** = `'recherche.mp3'` → doit être `'reflexion.mp3'`
2. **`PHASE_MUSIC_TRACKS['tension']`** = `'stress.mp3'` → doit être `'tension.mp3'`
3. **Loading overlay** (`index.html:229`) — pas de classe `hidden`, donc visible au chargement

## Changements (3 fichiers)

### 1. `true-detective/index.html` ligne 229
Ajouter `hidden` à la div de loading overlay :
```html
<div id="loading-overlay" class="loading-overlay hidden">
```

### 2. `true-detective/app.js` ligne ~100 — corriger + étendre `PHASE_MUSIC_TRACKS`
```js
var PHASE_MUSIC_TRACKS = {
    'recherche': 'recherche.mp3',      // OK
    'reflexion': 'reflexion.mp3',       // CORRECTION : était recherche.mp3
    'enigme': 'enigme.mp3',             // OK
    'tension': 'tension.mp3',           // CORRECTION : était stress.mp3
    'mystere': 'mystere flipant.mp3',   // AJOUT : pour les pages d'acte
};
```

### 3. `true-detective/app.js` ligne ~2842 — jouer la musique mystère sur les pages d'acte
Dans `scrShowActPage()`, après la validation `if (!data) { onContinue(); return; }`, ajouter :
```js
scrMusicPlaying('mystere');
```
Cela déclenche `PHASE_MUSIC_TRACKS['mystere']` → `'mystere flipant.mp3'`.

Quand l'utilisateur clique "Continuer", `onContinue()` → `renderScenarioPage()` → `scrMusicPlaying(phase.music)` restaure la musique de phase normale.

### 4. `true-detective/audioService.js` ligne ~245 — ajouter `mystere` à `MUSIC_PHASES`
```js
mystere: { label: 'Mystère', intensity: 'low', tempo: 70 },
```
Pour que le label UI affiche "Mystère" au lieu de "mystere".

## Ce qui fonctionne déjà (pas de changement)

- **Narration** (`music: 'theme'` dans `phases.js`) → `scrMusicPlaying('theme')` → `getThemeMusic(themeId)` → `THEME_MUSIC[themeId]` :
  - `agatha-christie` → `sherlock.mp3` ✓
  - `cyberpunk` → `cyberpunk.mp3` ✓
  - `film-noir` → `noire.mp3` ✓
- **`credits`** → `night ride.mp3` ✓
- **`intro`** → handled by `scrMusicPlaying` (routed to themeTrack) ✓

## Validation

1. `node -c true-detective/app.js` — syntaxe OK
2. `npm run validate:scenario` — 0 erreur
3. `npm run permute protecteur` — génération OK
4. Vérifier que `mystere flipant.mp3`, `tension.mp3`, `reflexion.mp3` existent dans `music true detective/phases/`
