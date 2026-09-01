# Plan v2 : Mise à niveau hybride IA pour Never Ever

## Objectif
Rendre Never Ever plus **funny et spicy** en exploitant pleinement l'infrastructure IA existante, **sans toucher au HTML/CSS** et sans casser la structure (mode hybride + fallback statique).

## Fonctionnalités ajoutées

### 1. Joueurs personnalisés (🥇)
- `promptForPlayers()` : saisie des prénoms via `window.prompt()` à l'ouverture (aucun HTML ajouté)
- Persistés dans `localStorage` (clé `neverEverAIState`)
- Envoyés comme `players[]` dans **tous** les appels IA
- Effet : sarcasmes nominatifs, « le plus probable = Julien… », résumés qui blâment/louent des joueurs précis

### 2. Nouveaux types de contenu IA (🥇)
- **`truth`** 🎤 (18% des clics « Do ») : vérités personnelles épicées
- **`group_challenge`** 👥 (10% des clics « Do ») : défis que tout le groupe fait ensemble
- **`party_summary`** 🧠 (12% à la fermeture de la modale) : récap humoristique de la soirée en cours
- Fallback : si l'IA échoue sur un type → retour à l'action statique normale (aucun blocage)

### 3. Anti-répétition persistante (🥈)
- `questionHistory` / `actionHistory` sauvegardés dans `localStorage`
- Restaurés au chargement → l'IA ne répète pas une question posée lors d'une soirée précédente
- Borné aux 40 derniers éléments pour limiter la taille du prompt

### 4. Sarcasme contextuel (🥈)
- `sarcastic_comment` reçoit désormais `lastAction` (l'action exacte effectuée)
- L'IA commente le défi précis au lieu d'un commentaire générique

### 5. Plus d'IA, plus spicy (🥈)
- `aiChance` : 0.25 → 0.35
- `updateAdaptiveSpice()` inchangé (monte déjà à 0.40 / 0.30 si le groupe est chaud)
- Contexte `players` transmis au prompt pour un ton plus personnel

## Fichiers modifiés

| Fichier | Changements |
|---------|-------------|
| `never-ever/script.js` | `players`, `promptForPlayers`, `loadAISettings`/`saveAISettings`, flavors vérité/groupe, sarcasme contextuel, récap, aiChance 0.35 |
| `lib/never-ever-ai.js` | Nouveaux types `truth`, `group_challenge`, `party_summary`; `sarcastic_comment` enrichi avec `lastAction` + `players` |

## Validation
- `node --check` sur les 2 fichiers : ✅
- Endpoint testé : `truth`, `group_challenge`, `party_summary`, `sarcastic_comment` (avec players) → tous 200 `source: ai`
- Serveur redémarré (PID actuel 3092, port 4000) pour recharger le module backend
- Fallback statique intact : tout type IA échoué → pool statique existant