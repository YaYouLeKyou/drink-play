# True Detective — Améliorations proposées

## Contexte actuel (lu dans le codebase)
- Jeu d'enquête narratif en 3 actes + outro, ~12 phases, bilingue FR/EN.
- 6 suspects, 1 coupable, système de permutations (4 scénarios).
- Mini-jeux variés : fouille, réseau d'alibis, montre, puzzle, chimie, échecs, bataille navale, etc.
- Faisceau de preuves en 6 catégories (`alibi`, `mobile`, `opportunity`, `forensic`, `witness`, `timeline`).
- Déjà présent : journal du détective, bouton "Passer", musique par phase, thèmes visuels.

## Suggestions d'amélioration (par ordre d'impact / effort)

### 1. Ambiance sonore spatialisée (effort moyen, impact fort)
- Ajouter des boucles audio par lieu (manoir, ruelle, bar, QG, labo).
- Sons d'ambiance dynamiques : pluie, néons, horloge, téléphone qui sonne.
- **Fichiers concernés** : `app.js` (contrôle audio), nouveaux assets audio.
- **Validation** : vérifier que les sons ne se superposent pas lors des transitions de phase.

### 2. Système d'indices progressifs (effort faible, impact moyen)
- Remplacer/améliorer le simple bouton "Passer" par un système de 3 niveaux d'indices :
  1. Indice textuel subtil
  2. Indice plus direct
  3. Solution complète (coût en points ou temps)
- **Fichiers concernés** : `minigames.js`, chaque mini-jeu standalone.
- **Validation** : `npm run validate:scenario` + test manuel de chaque mini-jeu.

### 3. Réactions visuelles des suspects (effort faible, impact fort)
- Pendant l'interrogatoire, ajouter des micro-expressions CSS/animations selon que le suspect ment ou dit la vérité.
- Exemple : teint qui pâlit, yeux qui fuient, mains qui tremblent.
- **Fichiers concernés** : `interrogation-system.js`, `styles.css`, `phases.js` (nouvelles classes par suspect).
- **Validation** : vérifier que les animations ne gênent pas la lecture sur mobile.

### 4. Plateau de déduction visuel (effort moyen, impact fort)
- Un tableau de liège virtuel où le joueur peut épingler des indices et tirer des fils entre eux.
- Accessible depuis le bouton 📓 du notebook.
- **Fichiers concernés** : nouveau `deduction-board.js`, `app.js` (intégration), `styles.css`.
- **Validation** : s'assurer que le tableau persiste entre les phases via `gameState`.

### 5. Variations de difficulté dynamiques (effort faible, impact moyen)
- Ajuster automatiquement la difficulté des mini-jeux selon le nombre d'échecs du joueur.
- Exemple : plus le joueur échoue à `reseau_alibis`, plus les cartes sont claires ou le temps augmente.
- **Fichiers concernés** : `app.js` (`applyDifficultyToCfg`), chaque mini-jeu.
- **Validation** : tester 3 profils de joueurs (débutant, moyen, expert).

### 6. Effets de tension narrative (effort faible, impact moyen)
- Ajouter des "coups de théâtre" visuels : écran qui tremble, vignette rouge, battement de cœur audio quand le joueur est proche de la vérité.
- **Fichiers concernés** : `styles.css` (animations), `app.js` (déclencheurs).
- **Validation** : vérifier les performances mobile (60fps).

### 7. New Game+ / Mode challenge (effort moyen, impact moyen)
- Débloquer un mode "Inspecteur chevronné" après avoir fini le jeu :
  - Indices cachés supplémentaires
  - Dialogues alternatifs
  - Mini-jeux plus durs
- **Fichiers concernés** : `permutations.js`, `app.js` (vérification fin), `index.html` (nouvel écran).
- **Validation** : s'assurer que les sauvegardes old/new sont séparées.

### 8. Accessibilité (effort faible, impact fort pour certains publics)
- Sous-titres optionnels pour les sons d'ambiance.
- Mode daltonien (palette alternative pour les couleurs d'indices).
- Contrôles tactiles agrandis / gestes swipe pour le notebook.
- **Fichiers concernés** : `styles.css`, `settings-menu.css`, chaque mini-jeu.
- **Validation** : tests avec outils d'accessibilité browser.

### 9. Sauvegarde multi-slots (effort moyen, impact moyen)
- Actuellement : 1 seule sauvegarde implicite + "Resume".
- Proposer 3 slots de sauvegarde + export/import JSON.
- **Fichiers concernés** : `app.js` (`checkSavedGame`, sauvegarde), `index.html` (UI slots).
- **Validation** : vérifier la migration des anciennes sauvegardes.

### 10. Mini-jeux narratifs contextuels (effort élevé, impact fort)
- Remplacer certains mini-jeux "génériques" par des versions contextualisées :
  - Bataille navale → "Course-poursuite en bateau" sur le port
  - Échecs → "Duel psychologique" avec Vivienne (déjà fait mais peut être enrichi)
  - Memory → "Reconnaissance de profil" au labo
- **Fichiers concernés** : chaque mini-jeu standalone + `phases.js`.
- **Validation** : `validate:scenario` + tests utilisateur.

## Recommandation de priorisation
1. **Réactions visuelles des suspects** — rapide à implémenter, renforce beaucoup l'immersion.
2. **Système d'indices progressifs** — améliore l'expérience sans casser l'équilibre existant.
3. **Ambiance sonore** — fort impact émotionnel, effort modéré.
4. **Plateau de déduction** — différencie le jeu d'autres narratifs interactifs.
5. **Accessibilité** — important, relativement simple.

Les points 6-10 sont gardés pour des itérations futures.
