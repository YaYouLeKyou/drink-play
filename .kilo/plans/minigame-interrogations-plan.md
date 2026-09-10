# Plan d'implémentation — Interrogatoires mini-jeux True Detective

## 1. Architecture générale

### A. Modification du format `N.interrogations`

Ajouter pour chaque suspect un bloc `minigame` décrivant le jeu d'interrogatoire :

```javascript
femme-fatale: {
    // ... existing intro/questions/rounds2/rounds3 ...
    minigame: {
        type: 'chess',
        difficulty: [
            { depth: 1, clue: { fr: "...", en: "..." } },   // Acte 1
            { depth: 2, clue: { fr: "...", en: "..." } },   // Acte 2
            { depth: 3, clue: { fr: "...", en: "..." } }    // Acte 3
        ]
    }
}
```

### B. Nouveau flux d'interrogatoire (3 manches = 3 mini-jeux)

**Ancien flux :**
1. Bouton "Interroger" → 3 questions texte → bouton "Continuer"

**Nouveau flux :**
1. Bouton "Interroger" → Manche 1 du mini-jeu
2. Victoire Manche 1 → Réponse + Indice partiel
3. Défaite Manche 1 → Réponse évasive
4. Bouton "Continuer la partie" → Manche 2
5. Victoire Manche 2 → Réponse + Indice partiel
6. Défaite Manche 2 → Réponse évasive
7. Bouton "Continuer la partie" → Manche 3
8. Victoire Manche 3 → Réponse + Indice final (qualité selon difficulté)
9. Défaite Manche 3 → Réponse évasive, PAS d'indice
10. Fin de l'interrogatoire → bouton "Continuer"

### C. Système de difficulté croissante

**Femme-fatale (Échecs) :**
- Acte 1 : Profundidad 1 (IA très faible) → Indice basique
- Acte 2 : Profundidad 2 → Indice moyen
- Acte 3 : Profundidad 3 → Indice complet

**Criminel (Puzzle 9x9) :**
- Acte 1 : 3x3 (grille 3x3, 2 cases vides)
- Acte 2 : 6x6 (grille 6x6, 4 cases vides)
- Acte 3 : 9x9 (grille 9x9, 8 cases vides)

**Séducteur (Jackpot) :**
- Acte 1 : 1 tour, gain minimum requis
- Acte 2 : 2 tours
- Acte 3 : 3 tours

**Marginal (Domino Three.js) :**
- Acte 1 : 5 dominos
- Acte 2 : 8 dominos
- Acte 3 : 12 dominos

**Suspect (Sudoku) :**
- Acte 1 : 4x4 (2 cases vides par ligne)
- Acte 2 : 6x6 (3 cases vides par ligne)
- Acte 3 : 9x9 (4 cases vides par ligne)

## 2. Structure des fichiers

### Nouveaux fichiers :
- `true-detective/chess-game.js` — moteur d'échecs + IA
- `true-detective/puzzle-game.js` — puzzle 9x9 sliding
- `true-detective/sudoku-game.js` — générateur + solveur
- `true-detective/domino-game.js` — Three.js tower builder

### Fichiers modifiés :
- `true-detective/app.js` — intégration du nouveau flux
- `true-detective/minigames.js` — factory pour les nouveaux jeux
- `true-detective/narration.js` — ajout des blocs `minigame` aux interrogations
- `true-detective/styles.css` — styles responsive mobile/laptop pour chaque jeu

## 3. Design responsive

### Mobile-first approach :
- Chaque mini-jeu aura :
  - Version mobile (< 768px) : tactile, boutons larges, layout vertical
  - Version desktop (>= 768px) : hover, clavier, layout adapté

### Thème visuel commun :
- Fond sombre avec effet glassmorphism
- Couleurs selon le suspect :
  - Femme-fatale : violet/rose (#ff6b9d)
  - Criminel : rouge sombre (#c0392b)
  - Séducteur : doré (#f39c12)
  - Marginal : vert forêt (#27ae60)
  - Suspect : bleu-gris (#7f8c8d)

## 4. Implementation order

1. **Framework commun** (`minigame-framework.js`) — timer, win/lose, score
2. **Chess** (femme-fatale) — premier prototype avec chess.js
3. **Puzzle 9x9** (criminel) — sliding puzzle avec génération
4. **Sudoku** (suspect) — générateur + solveur
5. **Jackpot integration** (séducteur) — intégration de l'app existante
6. **Domino Three.js** (marginal) — physique + construction
7. **Intégration narration** — ajout des données dans `narration.js`
8. **Tests et polissage**

## 5. Assets

### Images à générer/créer :
- Échecs : pièces SVG inline (pas d'image externe)
- Puzzle : image placeholder générée en canvas
- Sudoku : grille CSS pure
- Jackpot : réutilisation de l'app existante
- Domino : primitive Three.js + texture procédurale

## 6. Contraintes

- Aucune régression sur les interrogatoires existants (protecteur)
- Mobile ET laptop doivent fonctionner
- Performance Three.js sur mobile
- Pas de dépendances externes lourdes
- Garder le système de sauvegarde localStorage
