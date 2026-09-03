# Guide de Narration - True Detective

## Fichiers de Narration

Le jeu utilise un système de narration centralisé. Tous les textes du jeu sont stockés dans des fichiers séparés pour faciliter l'édition et les traductions.

### Structure des fichiers

| Fichier | Description |
|---------|-------------|
| `narration.js` | Textes principaux des phases (intro, acte 1) |
| `narration-phases.js` | Textes des phases supplémentaires (actes 2 et 3) |
| `narration-scenario.js` | Textes des suspects (descriptions) |
| `narration-reactions.js` | Réactions à l'accusation (échec) |
| `narration-truths.js` | Vérités révélées (fin réussie) |
| `narration-minigames.js` | Titres et descriptions des mini-jeux |
| `narration-hotspots.js` | Textes des zones de fouille |

### Modifier un texte

1. Ouvrez le fichier concerné (ex: `narration.js` pour les textes des phases)
2. Trouvez le texte à modifier (recherchez par mot-clé ou par clé)
3. Modifiez le texte entre guillemets
4. Sauvegardez le fichier
5. Rechargez le jeu pour voir les changements

### Format des textes

Chaque texte est un objet avec les propriétés `fr` (français) et `en` (anglais) :

```javascript
page1: {
    fr: 'Texte en français',
    en: 'Text in English'
}
```

### Exemple : Modifier le texte de la première page de l'introduction

Dans `narration.js` :

```javascript
N.intro1 = {
    page1: {
        fr: 'La ville murmure sous la pluie...',  // ← Modifiez cette ligne
        en: 'The city whispers under the rain...'  // ← Et celle-ci
    },
    // ...
};
```

## Mode Développeur

Le bouton "🛠️ Developer" est disponible en bas à droite de l'écran d'accueil.

### Fonctionnalités

- **Sauter à une phase** : Cliquez sur le numéro de la phase pour y aller directement
- **Sauter à une page spécifique** : Cliquez sur un bouton de page pour aller à cette page exacte
- **Aperçu du texte** : Chaque bouton affiche un aperçu du texte de la page

### Touches raccourci

- `Escape` : Fermer le mode développeur

## Traductions

Les traductions anglaises sont maintenues à côté des textes français. Lorsque vous modifiez un texte français, pensez aussi à mettre à jour la version anglaise correspondante.

### Conventions de nommage

- Clés de phase : `intro1`, `intro2`, `act1_1`, `act1_2`, `act2_1`, `act2_2`, `act3_1`, `act3_2`, `act3_3`
- Clés de page : `page1`, `page2`, `page3`
- Clés de suspect : `protecteur`, `femme-fatale`, `seducteur`, `suspect`, `marginal`, `criminel`
- Clés de minigame : `scene_fouille`, `carnet_dechire`, `cryptogramme`, `coffre_fort`, `cablage_alarme`, `montre_code`, `adn_match`

## Bonnes pratiques

1. **Toujours tester** : Après modification, testez le jeu pour vérifier que le texte s'affiche correctement
2. **Garder les deux langues** : Ne jamais laisser une traduction vide
3. **Respecter le format** : Ne pas oublier les guillemets, les virgules et les accolades
4. **Commentaires** : Ajoutez un commentaire si le texte a un contexte particulier