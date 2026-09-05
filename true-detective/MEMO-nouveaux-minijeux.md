# Mémo : 3 Nouveaux Mini-jeux

## 1. reconstitution_fievreuse

- **Placement** : Acte I, après la fouille de la scène de crime (Phase 1B), avant la synthèse HQ
- **Mécanique** : Drag-and-drop de 3 cartes-pièces dans l'ordre chronologique de la lutte
  - Carte 1 : Verre renversé par un geste brusque
  - Carte 2 : Livre taché de sang, pendant la lutte
  - Carte 3 : Fauteuil repoussé vers la porte
- **Asset image** : `mini-games/reconstitution/sequence-murder.png`
- **Catégorie d'indice** : `forensic` (+1 forensic, max 3)
- **Payoff narratif** : Wexford remarque que la victime n'a pas tenté de fuir vers la porte, prouvant qu'elle connaissait l'agresseur
  - Bonus : `opportunity` (+1 opportunity si réussi)
- **Intégration** : Mini-jeu optionnel avec `complete(true)` pour progresser
  - N'oblige pas la réussite mais enrichit le faisceau d'indices

## 2. analyse_sonore

- **Placement** : Acte II, Phase 2 (laboratoire), juste avant l'interrogatoire avec le Dr Whitmore
- **Mécanique** : Clique sur la forme d'onde pour isoler le pic sonore à 22h09
  - Confirmation par le scientifique
- **Asset image** : `mini-games/audio/dictaphone-waveform.png`
- **Catégorie d'indice** : `timeline` (+1 timeline) + `forensic` (+1 forensic)
- **Payoff narratif** : L'écho confirme une pièce fermée, démentant l'idée d'un tireur extérieur
  - Renforce les preuves contre les suspects intimes
- **Intégration** : Séquence dialogue → mini-jeu → dialogue Whitmore → interrogatoire ADN

## 3. documents_dechires

- **Placement** : Acte I, intégré dans la fouille de la scène (Phase 1A) comme découverte secondaire dans la corbeille du bureau
- **Mécanique** : Puzzle de reconstitution de 12 fragments de papier (glisser-déposer)
- **Asset image** : `mini-games/documents/frayed-letter-fragments.png`
- **Catégorie d'indice** : `mobile` (+1 mobile, max 3)
- **Payoff narratif** : Le document révèle une lettre de menace de la victime envers Hale
  - Texte : "Licencié pour vol ou trahison"
  - Bonus : `opportunity` (+1 opportunity)
- **Intégration** : Hotspot B6 dans la `scene_fouille` existante déclenche ce mini-jeu

---

## Notes d'intégration communes

- Tous les assets image sont fournis par l'utilisateur
- Code JS dans `minigames.js` (fonction du mini-jeu)
- Déclencheur dans `phases.js` (page ou hotspot)
- Catégorie d'indice dans `evidence` score (scenario.js)
- Références dans `[ENRICH:clues]` pour le journal
