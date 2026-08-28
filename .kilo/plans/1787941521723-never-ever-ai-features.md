# Plan : Fonctionnalités AI pour Never Ever

## Objectif
Ajouter 6 fonctionnalités AI au jeu **Never Ever** sans toucher au design HTML/CSS, en mode **hybride** (statique + IA aléatoire/secours).

## Architecture globale

### Backend
- **Nouveau endpoint** : `POST /api/never-ever/generate`
  - Reçoit : `{ type, language, isSpicy, history[], round }`
  - Retourne : `{ source: 'ai'|'fallback', content, model? }`
- **Nouvelle classe** : `lib/never-ever-ai.js` (inspiré de `JackpotAI`)
  - Prompt système dédié au jeu Never Ever
  - Génération de : questions, actions, sarcastic comments, narrative wrappers, consequences, "most likely to"

### Frontend (`script.js`)
- **État additionnel** : `questionHistory[]`, `actionHistory[]`, `roundCounter`, `aiChance = 0.25`
- **Intégration hybride** :
  - 25% de chance d'utiliser l'IA au lieu du pool statique
  - Si le pool statique est épuisé (toutes les questions déjà servies), bascule automatique sur l'IA
  - Si l'IA échoue, fallback sur le pool statique restant

---

## Fonctionnalité 1 : Moteur de contenu infini

### Backend
- Endpoint `/api/never-ever/generate` avec paramètre `type: 'question' | 'action'`
- `lib/never-ever-ai.js` génère du contenu basé sur :
  - `language` (en/fr/es/ar/zh)
  - `isSpicy` (booléen)
  - `history[]` (évite les doublons)
  - `round` (nombre)

### Frontend
- `getNewQuestion()` et `getNewAction()` modifiées :
  ```javascript
  if (Math.random() < aiChance || isPoolExhausted('questions')) {
      return await fetchAIContent('question', ...);
  }
  // sinon : pool statique existant
  ```
- Historique des questions/actions renvoyé au backend pour éviter les répétitions

---

## Fonctionnalité 2 : IA "Juge Sarcastique"

### Backend
- Même endpoint avec `type: 'sarcastic_comment'`
- Prompt : ton playful, sarcastique, pression sociale légère

### Frontend
- Dans `doButton` click handler, après avoir récupéré l'action :
  - 30% de chance d'appeler l'IA pour un commentaire sarcastique
  - Le commentaire s'affiche **dans `#action-modal`**, au-dessus ou en dessous du texte de l'action
  - HTML/CSS inchangé : on enrichit juste `actionText.innerText` ou on ajoute un span

```javascript
const comment = await fetchAIContent('sarcastic_comment', language, context);
actionText.innerHTML = `${action}<br><em class="sarcasm">${comment}</em>`;
```

---

## Fonctionnalité 3 : IA "Maître du Jeu" narratif

### Backend
- Même endpoint avec `type: 'narrative'`
- Prompt : enrichir la question avec un mini-scénario (1 phrase max)

### Frontend
- `getNewQuestion()` : 20% de chance de demander une version narrative
- Le texte narratif remplace ou précède la question dans `#question-text`
- Exemple d'affichage :
  ```
  "Dans une soirée arrosée à Berlin... 
   Never have I ever envoyé un nu par erreur à la mauvaise personne."
  ```

---

## Fonctionnalité 4 : IA "Suite logique" / Chain Reaction

### Backend
- Même endpoint avec `type: 'consequence'`
- Reçoit l'action précédente comme contexte
- Prompt : générer une conséquence/défi enchaîné court (1 phrase)

### Frontend
- Quand l'utilisateur ferme la modale (`closeModalButton` click) :
  - 25% de chance d'afficher une conséquence dans la `.card` avant la prochaine question
  - La conséquence s'affiche dans un élément temporaire qui disparaît au prochain clic sur "Next Question"
  - Pas de nouveau HTML : on réutilise `.card` avec un message temporaire

```javascript
closeModalButton.addEventListener('click', async () => {
    actionModal.classList.add('hidden');
    if (Math.random() < 0.25) {
        const consequence = await fetchAIContent('consequence', language, { lastAction });
        showTemporaryCardMessage(consequence);
    }
});
```

---

## Fonctionnalité 5 : IA "Le plus probable à..."

### Backend
- Même endpoint avec `type: 'most_likely'`
- Prompt : générer un pronom/nom humoristique basé sur la question

### Frontend
- Après chaque question affichée :
  - 20% de chance d'appeler l'IA
  - Le résultat s'insère dans `#question-text` ou un span en dessous
  - Exemple : `"Le plus probable à avoir fait ça : c'est sûrement Julien..."`

---

## Fonctionnalité 6 : IA Adaptive Spice Level

### Backend
- Pas de nouvel endpoint, logique côté client
- Analyse des clics utilisateur :
  - `doClicks` vs `nextClicks` ratio
  - `sarcasmAccepted` (temps passé sur la modale)

### Frontend
- Ajustement dynamique de `aiChance` et de `nextSpicy` :
  ```javascript
  if (doClicks / totalClicks > 0.6) {
      aiChance = 0.4; // groupe chaud, plus d'IA spicy
      nextSpicy = Math.floor(Math.random() * 2) + 2; // spicy plus fréquent
  } else {
      aiChance = 0.15;
      nextSpicy = Math.floor(Math.random() * 3) + 4;
  }
  ```
- L'IA peut aussi injecter plus de questions spicy quand le groupe est "chaud"

---

## Fichiers modifiés

| Fichier | Changements |
|---------|-------------|
| `server.js` | Ajout endpoint `POST /api/never-ever/generate` |
| `lib/never-ever-ai.js` | Nouvelle classe `NeverEverAI` (prompts, génération) |
| `never-ever/script.js` | Intégration hybride, appels IA, état additionnel, features 2-6 |

---

## Gestion des erreurs et fallback

- Si l'IA est indisponible (timeout, 500, quota dépassé) :
  - **Feature 1** : fallback immédiat sur le pool statique
  - **Features 2-5** : simplement pas de contenu IA, le jeu continue normalement
  - **Feature 6** : continue avec les valeurs par défaut
- Timeout recommandé : 5 secondes par appel IA
- Pas de blocage UX : tous les appels IA sont `async` non-bloquants

---

## Validation

1. Tester chaque feature indépendamment avec `aiChance = 1.0` (forcer l'IA)
2. Tester avec `aiChance = 0.0` (forcer le statique) pour vérifier le fallback
3. Tester la déconnexion réseau : le jeu doit rester jouable
4. Vérifier les performances : pas de lag perceptible sur les clics
5. Vérifier les 5 langues : les prompts IA doivent respecter la langue sélectionnée

---

## Risques

- **Dépendance API** : mitigé par le mode hybride et le fallback statique
- **Coût** : les modèles gratuits OpenRouter + Gemini sont utilisés en priorité
- **Qualité du contenu IA** : prompts restrictifs + filtrage côté backend si nécessaire
- **Temps de réponse** : 5s timeout + skeleton/loading si besoin (pas de modification HTML demandée)
