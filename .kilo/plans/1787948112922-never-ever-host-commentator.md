# Plan : Maître du jeu IA + Solo/Multi + TTS + Base apprenante commentaires

## Contexte actuel
- `never-ever/script.js` possède déjà : base apprenante via `generated-content.json`, prompt joueurs non bloquant, mood spicy/funny, narrations/conséquences.
- `lib/never-ever-learned.js` gère dédup, cap 60, écriture différée.
- `lib/never-ever-ai.js` couvre déjà `question`, `action`, `truth`, `group_challenge`, `sarcastic_comment`, `narrative`, `consequence`, `most_likely`, `party_summary`.
- HTML/CSS existants sont intacts.

## Objectif
Ajouter un **maître du jeu / commentateur IA** qui :
- s’adresse au joueur en cours en mode solo (`tu / ton tour`) ou par prénom en multi,
- commentaire la question/action comme un animateur fun/cool,
- lit le texte à haute voix via Web Speech API,
- dispose d’un bouton muet (aucun HTML/CSS cassé, réutilisation d’éléments existants),
- enrichit automatiquement la base apprenante avec ses meilleures répliques pour fonctionner hors ligne.

## Décisions de conception

| Décision | Choix |
|----------|-------|
| Adresse joueur | Solo → `tu / ton tour` ; Multi → prénom si dispo sinon `tu` |
| TTS | Web Speech API natif, pas de dépendance externe |
| Mute | Bouton dédié dans la top-bar (HTML déjà modifiable si besoin, sinon statut console) |
| Stockage commentateur | `localStorage` + `generated-content.json` pour persistance |
| Catégories apprenantes | `hostComments` (générique) + `hostCommentsFr` selon langue |
| Fallback | Si IA KO → pioche dans `hostComments` du JSON apprenant ; si vide → silencieux |
| Mode sans joueurs | Fully supported, commentateur reste optionnel |

## Tâches d’implémentation

### 1. Base apprenante étendue (`lib/never-ever-learned.js`)
- Ajouter `categoryForType('host_comment', language)` → `hostComments` par défaut.
- Mettre à jour `addGeneratedContent` pour accepter `type === 'host_comment'`.
- Aucun changement de structure de fichier.

### 2. Backend IA (`lib/never-ever-ai.js`)
- Ajouter un type `host_comment` avec prompt système dédié :
  - Rôle : maître du jeu fun/cool, 1 phrase max, jamais plus de 2 phrases.
  - Contexte : round, mood, isSpicy, players, lastQuestion/action, language.
  - Ton : solo → `tu / ton tour` ; multi → `{prenom}, c'est ton tour !` si dispo.
  - Interdictions : pas de spoil, pas de répétition d’historique.
- Retour `{ source, model, content }` comme les autres types.
- Enrichissement auto de la base apprenante après succès.

### 3. Frontend (`never-ever/script.js`)
#### État
- Ajouter : `hostEnabled`, `hostMuted`, `currentHostPlayer`, `hostCommentsHistory`.

#### Initialisation joueurs
- `promptForPlayers()` existe déjà. On ajoute un choix initial clair :
  - Si l’utilisateur clique Cancel / vide → mode solo, `players = []`.
  - Sinon → mode multi, prénoms stockés dans `localStorage`.
- Stocker `playersMode = 'solo' | 'multi'` dans `localStorage`.

#### Commentateur IA
- Nouvelle fonction `getHostComment(contextType, extra = {})` :
  - Si `!hostEnabled` → résoudre silencieux.
  - Si `hostMuted` → log mais pas de TTS.
  - Tenter d’abord IA (`/api/never-ever/generate` avec `type: 'host_comment'`).
  - Si IA KO → piocher dans `getPool('hostComments')` via `pickFresh`.
  - Si pool vide → silencieux.
- Appels du commentateur :
  - Avant chaque nouvelle question/action → `await getHostComment('question_start')`.
  - Après clic Do → `await getHostComment('action_result')`.
  - Sur Next Question → `await getHostComment('next_round')`.

#### TTS (Web Speech API)
- Ajouter `speak(text)` :
  - Si `hostMuted` → return.
  - Utiliser `SpeechSynthesisUtterance` avec `lang = currentLanguage`.
  - Queue propre : annuler les utterances en cours avant nouveau speak.
- Ajouter toggle muet dans l’UI existante :
  - Option A : bouton dans `.top-bar` à côté du lang menu.
  - Option B : si on ne touche pas au HTML, toggle via console shortcut et stockage `hostMuted`.
  - Recommandation : **bouton dédié** `#host-mute-button` dans la top-bar, classe `styled-button`, texte `🔊 / 🔇`.

#### Lecture des questions
- Dans `displayNewQuestion()` et après choix action :
  - Si `hostEnabled && !hostMuted` → `speak(displayText)`.
- Pas de double lecture : gérer via flag `isSpeaking`.

### 4. Endpoint API (`server.js`)
- Aucun changement nécessaire : l’endpoint existant `/api/never-ever/generate` accepte déjà les nouveaux types envoyés par le front.

### 5. Données initiales (`never-ever/generated-content.json`)
- Créer un seed minimal dans `en.hostComments` et `fr.hostComments` avec 10-15 répliques génériques pour démarrer sans IA.
- Ces réplices sont utilisées comme fallback offline.

### 6. Validation
- Syntax check Node sur tous les fichiers modifiés.
- Vérifier création auto de `generated-content.json` au premier appel IA.
- Vérifier mode solo : commentateur dit `tu`, pas de prénom.
- Vérifier mode multi : commentateur dit `Alice, c'est ton tour !`.
- Vérifier mute : TTS stoppé, commentaires toujours affichés.
- Vérifier déconnexion IA : fallback JSON fonctionne, jeu ne bloque jamais.

## Hors périmètre (à reporter)
- Voix IA sélectionnable (male/female/accent) → pas dans ce plan, utiliser la voix système par défaut.
- Historique des commentaires affiché dans l’UI → pas dans ce plan, seulement log console.
- Extension au jeu Jackpot → mentionné par l’utilisateur comme prochaine étape, hors scope ici.

## Fichiers à modifier
- `lib/never-ever-learned.js`
- `lib/never-ever-ai.js`
- `never-ever/script.js`
- `never-ever/generated-content.json` (création)
- `never-ever/index.html` (bouton muet uniquement)
