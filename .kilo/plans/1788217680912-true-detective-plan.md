# True Detective — Plan d'Implémentation

## Vision
Un jeu d'enquête interactive entièrement piloté par l'IA : 3 actes structurés, 2-3 rebondissements, 1-2 sous-intrigues, personnages avec dialogue vocal et images générées dynamiquement. Durée cible 30+ minutes.

## Architecture Existante à Réutiliser
- **server.js** : Express.js + route `/api/chat` + `/api/never-ever/generate` + `/api/jackpot/challenge`
- **lib/ai-client.js** : AIClient avec Gemini (primary) + OpenRouter (fallback)
- **music-player.js** : Lecteur audio partagé avec contrôle volume/mute
- **Patterns existants** : localStorage pour persistence, Web Speech API pour TTS/STT, design mobile-first
- **Hub index.html** : Cartes de jeux en CSS 3D flip, responsive grid

## Structure du Projet
```
true-detective/
├── index.html          # Interface principale UI
├── styles.css          # Dark, noir, cinematic styling
├── app.js              # Orchestrateur (logique client)
├── imageService.js     # Génération images avec fallback
├── audioService.js     # TTS/STT via Web Speech API
├── narrativeEngine.js  # Appels LLM pour trame + avancement
└── assets/
    └── true-detective.png  # Cover image (fourni par utilisateur)
```

Backend additions to existing server.js + new lib file:
```
server.js              # Ajouter /api/true-detective/* routes
lib/true-detective-ai.js  # Master script generation + step engine
```

## Taches d'Implémentation

### 1. Backend — lib/true-detective-ai.js + server routes
**Priorité : haute**

#### lib/true-detective-ai.js
- Classe `TrueDetectiveAI` avec `aiClient` (réutilise AIClient existant)
- **Méthode `generateMasterScript(context)`** :
  - Prompt système : "Vous êtes le maître-narrateur d'un jeu d'enquête interactif..."
  - Génère JSON structuré : 3 actes, personnages (nom, rôle, personnalité, secrets, alibis, imagePrompt, voiceProfile), 2-3 rebondissements, 1-2 sous-intrigues, affaire principale, solution finale
  - Retourne le script complet
- **Méthode `advanceStory(state)`** :
  - Reçoit l'historique complet : currentAct, currentSceneIndex, playerChoices, npcsEncountered, discoveredClues, investigationSteps
  - Prompt : "Continue l'histoire en cohérence avec le master script..."
  - Retourne : dialogue du PNJ, nouvelles options de choix, indice découvert, événement subtil, flags d'acte/scène
- **Méthode `generateNPCResponse(state, npcId, playerText)`** :
  - Pour chaque interaction PNJ : répond avec la personnalité du personnage, peut révéler ou cacher des indices
- Persistance via `sessionId` (généré côté client, stocké dans localStorage)

#### server.js routes
- `POST /api/true-detective/master-script` → appelle `generateMasterScript`
- `POST /api/true-detective/advance` → appelle `advanceStory`
- `POST /api/true-detective/npc-response` → appelle `generateNPCResponse`
- Même pattern error handling que never-ever routes

### 2. Frontend — true-detective/imageService.js
**Priorité : haute**

Image generation avec fallback chain:
1. **Pollinations.ai** (primary) : `https://image.pollinations.ai/prompt/{prompt}?width=...&height=...&model=flux` — gratuit, pas de clé
2. **Puter.js** (fallback 1) : `<script src="https://js.puter.com/v2/">` + `puter.ai.txt2img(prompt)` — gratuit, no key
3. **HuggingFace** (fallback 2) : Via `https://api-inference.hf-mirror.com/models/{model}` avec retry sur modèles publics (gptimage, stablediffusion, flux)

Fonctions exportées :
- `generateBackground(prompt, theme)` → Promise<string url>
- `generateCharacter(prompt, theme)` → Promise<string url> (avec fond transparent)
- `generateImage(prompt, opts)` → Promise<string url> (core, gère le fallback)

Caches les images générées dans un Map pour éviter les régénérations.

### 3. Frontend — true-detective/audioService.js
**Priorité : haute**

Basé sur patterns existants (jackpot cowboy TTS, never-ever speak/TTS):
- **TTS** : Web Speech API (déjà utilisé dans jackpot + never-ever)
  - `speak(text, voiceProfile)` : modifie pitch/rate selon la personnalité du PNJ
  - Voice profiles : `{name, lang, pitch, rate}` par personnage
- **STT** : Web Speech API recognition (speech-to-text)
  - `startListening(onResult)` : active le micro, callback avec texte
  - `stopListening()` : arrête l'écoute
- Fallback texte si SpeechRecognition indisponible

### 4. Frontend — true-detective/narrativeEngine.js
**Priorité : haute**

Module client qui orchestre les appels backend :
- `createInvestigation(theme)` → POST /api/true-detective/master-script → stocke gameState
- `advanceGameState(playerChoice)` → POST /api/true-detective/advance → met à jour gameState
- `talkToNPC(npcId, text)` → POST /api/true-detective/npc-response → retourne réponse
- Toutes les réponses sont mises en cache dans gameState
- Gère la persistance via localStorage (vérifie sessionId existant au démARRAGE)

### 5. Frontend — true-detective/styles.css
**Priorité : haute**

Design mobile-first, sombre, noir & néon :
- Body : background noir, police monospace ou serif pour ambiance
- Game screen : 
  - Background layer (image plein écran, dark overlay)
  - Character layer (image détachée, positionné en bas/centre)
  - Dialog box (bas d'écran, style "speech bubble")
  - Typewriter effect pour le texte
- Theme selectors : grid de cartes visuelles
- Investigation notebook panel (slide-up, carnet d'indices)
- Responsive : laptop (3 colonnes max), tablette (2 colonnes), mobile (1 colonne)

### 6. Frontend — true-detective/app.js
**Priorité : haute**

Orchestrateur principal :
- **Écran de départ** : sélection du thème (8 options en cards)
  - Themes : Agatha Christie 🏚️, Sherlock Holmes 🔍, Film Noir 🎩, Cyberpunk 🌃, Heroic Fantasy ⚔️, Sci-Fi 👽, Lovecraftian 🐙, Antiquité 🏛️
- **Game screen** : 
  1. Génère master script via `narrativeEngine.createInvestigation(theme)`
  2. Affiche background + premier PNJ + dialogue
  3. Attend input (texte ou vocal)
  4. Envoie au backend, reçoit continuation
  5. Met à jour UI (dialogue, indices, options)
  6. Répète jusqu'à la fin (3 actes)
- **Écran de fin** : révélation du coupable, bouton "Nouvelle enquête"

### 7. Hub — index.html
**Priorité : moyenne**

- Ajouter True Detective comme 5ème carte
- Image : `assets/true-detective.png` (cover fourni par utilisateur)
- Position : entre Never Ever et Drunkin Alien
- Layout : passer de 4 à 5 cartes par ligne
  - Laptop (max-width: 1024px) : 3 cartes haut + 2 cartes bas (flexbox wrap)
  - Tablette (max-width: 768px) : 2 cartes
  - Mobile (max-width: 480px) : 1 carte

### 8. Hub — style.css
**Priorité : moyenne**

- `.col` : `width: calc(20% - 2rem)` (5 cartes par ligne sur desktop)
- Media queries ajustées :
  - `max-width: 1024px` : `calc(33.333% - 2rem)` → 3 cartes
  - `max-width: 768px` : `calc(50% - 2rem)` → 2 cartes
  - `max-width: 480px` : 100% → 1 carte
- Pas de flex-wrap change, mais le `.cols` container gère déjà le wrap

## Prompts Spécifiques (précis)

### Master Script Prompt
```
You are the master narrator of an interactive detective game. The player chooses a universe/theme and you generate a COMPLETE investigation script. Output STRICT JSON with this structure:
{
  "title": "string",
  "theme": "string",
  "act1": { "setting": "string", "scenes": [{ "location": "string", "npcId": "string", "dialogue": "string", "choices": ["string","string"], "clue": "string" }],
  "act2": { ... },
  "act3": { ... },
  "plotTwists": ["string"],
  "subplots": ["string"],
  "npcs": [{ "id": "string", "name": "string", "role": "string", "personality": "string", "secrets": ["string"], "imagePrompt": "string", "voiceHint": "string" }],
  "solution": { "culprit": "string", "motive": "string", "method": "string", "revealed": "string" }
}
Ensure: 3 acts, 2-3 twists, 1-2 subplots, coherent narrative, minimum 30min gameplay.
```

### Advance Story Prompt
Template: "Continue the story from this point. The investigation is in Acte {act}, Scene {scene}. The player just chose: '{choice}'. History: {choicesHistory}. Clues discovered: {clues}. Keep coherent with the master script. Output JSON: {dialogue, choices, clue, npcId, event, nextActTransition}."

### Image Prompts
- **Background** : `"{theme} detective scene, {location}, cinematic lighting, moody atmosphere, dark blues and greys, digital art style, 16:9"`
- **Character** : `"{character personality}, {theme} style portrait, clean transparent background, professional headshot, detailed, studio lighting"`

## Validation
1. All JS files pass `node --check`
2. Image service fallback tested (Pollinations → Puter → HuggingFace)
3. TTS/STT works on both desktop and mobile browsers
4. 30-min gameplay minimum (10+ scenes across 3 acts)
5. Theme cards render correctly on all screen sizes (3+2 layout on laptop)
