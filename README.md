# Drink & Play

A collection of mini-games to play during your parties, now enhanced with AI-powered features!

## Games included:

*   **Drunkin Alien**: A game where you control a drunk alien. Get the highest score to prove you're the least drunk!
*   **Gaginator**: A guessing game where you're the sorcerer's puppet - do it or drink!
*   **Jackpot**: A slot machine game with AI-powered challenges and player setup.
*   **Never Ever**: The classic "Never Have I Ever" game, now with AI host, player customization, and spicy content!

## How to play

Each game is in its own folder. To play a game, open the `index.html` file in the corresponding game folder.

## 🤖 AI Assistant (DrinkBot)

This project includes an AI-powered party assistant powered by [Gemini](https://gemini.google.com/) and [OpenRouter](https://openrouter.ai/).

### Setup

1. Create a `.env` file in the project root:
   ```
   # Gemini (primary provider)
   GEMINI_API_KEY=your-gemini-api-key

   # OpenRouter (fallback provider)
   OPENROUTER_API_KEY=your-openrouter-api-key
   OPENROUTER_BASE_URL=https://openrouter.ai/api/v1

   PORT=4000
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   ```
4. Open `http://localhost:4000` in your browser.

### How it works

- The assistant tries **Gemini** models first (primary provider).
- If all Gemini models fail, it **falls back to OpenRouter** (free models first, then all available models).
- Click the robot button (bottom-right) on the main page to open the chat.

## 🎮 Never Ever - Enhanced with AI

Never Ever now features:

*   **AI Host (April O'Neil persona)**: Funny, witty, and slightly teasing commentary
*   **Custom players**: Add player names via prompts at game start - AI roasts/names players specifically
*   **New content types**:
    *   `truth` - Personal truth questions (18% chance)
    *   `group_challenge` - Group challenges everyone does together (10% chance)
    *   `party_summary` - Humorous summary at game end (12% chance)
*   **Anti-repetition**: Learns from previous sessions via `localStorage` - never repeats questions
*   **Adaptive spice**: AI chance increased to 35%, adjustable based on group mood
*   **Sarcastic comments**: AI comments on specific actions, not generic reactions
*   **Host commentator**: AI game master/commentator with text-to-speech via Web Speech API
*   **Mute toggle**: Button to silence the AI commentator

## 🎰 Jackpot - AI-Powered

*   Player setup with name input
*   Game modes: Classic, Spicy, Funny, Mixed
*   AI-generated challenges per slot combination
*   Language support: English, French, Spanish, Italian
*   Timer and round tracking
*   "Too Hot" fallback for intense challenges

## 📝 Player Customization

All games support:
*   Player name entry and persistence via `localStorage`
*   Solo or multiplayer mode selection
*   Language switching (EN/FR/ES/IT)

## 🤖 DrinkBot Chat Interface

Interact with the AI assistant from the main hub:
*   Generate Never Ever questions
*   Get Jackpot challenges
*   Get game recommendations
*   Ask for rules and tips

## 🕵️ True Detective — Le jeu

Un jeu d'enquête **textuel et visuel** hautement logique, en 4 actes (fixes) :

- **Phase 1** — Intro & Fouille de scène : 8 zones interactives à la loupe (image plein écran `scene de crime manoir.png`), reconstitution du carnet déchiré + recherche d'empreintes (`prescription-eliane.png`).
- **Phase 2** — Piste & Interrogatoires : témoignage de Silas Crane, confrontation des suspects, cryptogramme de la note de Krane.
- **Phase 3** — Indices techniques & énigmes : verrou thermique, montre (heure du crime), ADN, code du coffre.
- **Phase 4** — Le Nœud, Tension & Révélation : chronologie, roue synchrone des alibis, sabotage, accusation finale.

### Faisceau de preuves (mécanique de résolution)

Pas d'indice « clé unique ». Chaque mini-jeu gagné alimente **6 catégories** de preuves (`alibi`, `mobile`, `opportunity`, `forensic`, `witness`, `timeline`), cumulées en un score de dossier. Le coupable fixe est **le Major Hale**, maître d'œuvre, avec Victor Krane comme exécutant et Julian Pembrooke comme fausse piste.

L'**heure du crime (22h09)** se reconstitue de multiples façons (montre = raccourci, sinon croisement { Silas + verrou + horloge-mère }) et détruit l'alibi du coupable. Le joueur qui rate la montre peut toujours aboutir logiquement.

Aucun mini-jeu n'est bloquant : résoudre récompense d'un **indice majeur** visible et renforce le dossier d'accusation.

### Les 13 mini-jeux

| Type | Evidence | Indice (payoff) |
|---|---|---|
| `scene_fouille` | forensic | Proche de confiance, vol simulé, reçu V.K. |
| `carnet_dechire` | mobile | Versements à Krane + empreintes |
| `pression` | witness | Rôdeur bien habillé à ~22h |
| `cryptogramme` | mobile | Contrat payé par Hale |
| `labo_verrou` | timeline | Ouvert à la clé, chaleur 22h |
| `adn_analyse` | forensic | Tueur de contrat (Krane) |
| `montre_code` | timeline | **22h09** = heure du crime (twist) |
| `coffre_code` | mobile | Hale payait Krane |
| `chronologie` | timeline | Trou dans l'alibi de Hale |
| `roue_alibis` | timeline | Aligne montre + panne + horloge-mère |
| `sabotage` | alibi | Durite sectionnée = faux alibi |
| `cablage_alarme` | opportunity | Alarme neutralisée de l'intérieur |
| `cable_match` | opportunity | Graffiti ≠ main de Hale |

### Permutations (rejouabilité)

Quatre variantes du scénario partagent la même structure fixe et la même heure du crime (**22h09**) ; seul le coupable / co-complice / fausse piste change, avec les textes de fouille et les indices adaptés.

| Id | Coupable | Activer |
|---|---|---|
| `protecteur` (défaut) | Major Hale | `npm run permute -- protecteur` |
| `femme-fatale` | Lady Vivienne | `npm run permute -- femme-fatale` |
| `criminel` | Victor Krane | `npm run permute -- criminel` |
| `suspect` | Rupert Blackwood | `npm run permute -- suspect` |

Moteur : `true-detective/permutations.js` (données) + `tools/generate-permutation.js` (écriture dans `phases.js`/`scenario.js`). Chaque exécution fait un backup horodaté.

---

## 🕵️ True Detective — Pont de scénario

True Detective possède un **document canonique** (`true-detective/scenario-complet.md`) qui sert de base de travail narrative. Un petit « pont » vérifie que ce document reste aligné avec le code de l'app (`phases.js`), puis expose la lecture/écriture du scénario à travers l'API du serveur.

### Pourquoi
La face cachée de l'app : elle peut **écrire un scénario complet dans un fichier** et l'améliorer en continu. Ce pont matérialise cette capacité — `scenario-complet.md` est la source de vérité, `phases.js` est l'implémentation.

### Validation (CLI)
```bash
npm run validate:scenario
# ou
node tools/validate-scenario.js
```
Compare le doc et l'app et liste les **dérives** (bloquantes) et **avertissements** (info). Vérifie notamment :
- que chaque mini-jeu `type` du doc existe dans `phases.js` (et inversement),
- les codes `1981` montre / coffre et que l'heure du crime n'est **pas** établie dans l'intro,
- que chaque mini-jeu a un `clue` de récompense,
- la présence des choix clés (`choisirSuspect`, `accuser`).

### Endpoints serveur
| Méthode | Route | Description |
|---|---|---|
| GET | `/api/scenario` | Renvoie le document markdown (source de vérité) |
| POST | `/api/scenario` | Écrit une nouvelle version (`{ content }`) + **backup horodaté** auto |
| GET | `/api/scenario/validate` | Renvoie le résultat de la validation (JSON) |

### Flux recommandé
1. On améliore le scénario **dans `scenario-complet.md`** (ou via `POST /api/scenario`).
2. On reporte le changement dans `phases.js`.
3. `npm run validate:scenario` confirme que tout est aligné.

Chaque `POST /api/scenario` crée automatiquement un backup (`scenario-complet.backup-<horodatage>.md`) : jamais de perte de travail.

### Structure du pont
```
tools/scenario-bridge.js     — logique (lecture/écriture/validation)
tools/validate-scenario.js   — CLI
server.js                    — expose /api/scenario*
true-detective/scenario-complet.md — document canonique
```
