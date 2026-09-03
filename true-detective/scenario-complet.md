# TRUE DETECTIVE — SCÉNARIO COMPLET (document de référence V3)

> **Fichier de travail canonique.** L'app (`phases.js`) est générée/alignée sur ce document.
> Toute évolution du scénario se fait ICI d'abord, puis est reportée dans `phases.js`.
> Bilingue : les dialogues sont écrits en FR (l'app garde la version EN dans `phases.js`).

---

## 0. SYSTÈME DE PERMUTATIONS (rejouabilité)

Le jeu offre **4 permutations** du scénario (même structure fixe, coupable / co-complice / fausse piste / lame variables) :

| Id | Coupable | Co-complice | Fausse piste | Lame |
|---|---|---|---|---|
| `protecteur` (défaut) | Major Hale | Victor Krane | Julian Pembrooke | Victor Krane |
| `femme-fatale` | Lady Vivienne | Major Hale | Julian Pembrooke | Victor Krane |
| `criminel` | Victor Krane | Rupert Blackwood | Major Hale | Homme de main |
| `suspect` | Rupert Blackwood | Silas Crane | Major Hale | Victor Krane |

**Moteur** : `true-detective/permutations.js` (données) + `tools/generate-permutation.js` (écriture dans `phases.js` + `scenario.js`).
**Activer une permutation** :
```bash
# désactive/défaut (canonique, documenté par ce fichier)
npm run permute -- protecteur
# permutation #1 — Lady Vivienne
npm run permute -- femme-fatale
# permutation #2 — Victor Krane
npm run permute -- criminel
# permutation #3 — Rupert Blackwood
npm run permute -- suspect
```
Chaque exécution crée un backup horodaté de `phases.js`/`scenario.js` (jamais de perte). L'heure du crime reste **22h09** dans toutes les permutations ; seuls les textes de fouille, les indices de mini-jeux et le coupable actif changent.

> ⚠️ **Cohérence** : les textes détaillés ci-dessous décrivent la permutation `protecteur` (défaut canonique). Si vous activez une autre permutation, les indices affichés en jeu correspondent — le validateur (`validate:scenario`) ne vérifie que la structure, pas l'identité du coupable.

---

## 1. VÉRITÉ (fixe par design)

- **Coupable (maître d'œuvre)** : le Major Hale, « LE PROTECTEUR », garde du corps de la victime.
- **La lame** : Victor Krane, « LE CRIMINEL », tueur payé, ADN inconnu sur la scène.
- **Complicité passive** : Lady Vivienne (menaces rédigées de sa main élégante) et Julian Pembrooke (fausse panne montée avec Hale).
- **Le mobile de Hale** : dettes, chantage, jalousie de serviteur ; il a payé Krane (carnet dans le coffre).

### L'heure du crime — MÉCANIQUE CENTRALE (twist final)
- **Aucune heure n'est établie au départ.** Personne ne sait quand la victime est morte.
- La montre du Duc attire volontairement l'attention sur son **DOS** (gravure « 1981 ») → le joueur distrait n'y voit qu'un code.
- Le **joueur attentif** remarque sur la **FACE** l'aiguille figée à **22h09** → il établit l'heure du crime, un fait que PERSONNE d'autre ne possède.
- **Payoff** : l'alibi de Hale (22h, panne avec Pembrooke) recouvre exactement 22h09. L'horloge-mère du pavillon, remontée en Acte 3, **confirme** 22h09. Sans la montre, le twist tombe à plat ; avec elle, le joueur « sait » avant les personnages.

### Le FAISCEAU DE PREUVES — mécanique de résolution (V3)
- **Principe** : aucune énigme n'est « clé unique ». Chaque mini-jeu alimente une catégorie de preuves parmi 6 : `alibi`, `mobile`, `opportunity`, `forensic`, `witness`, `timeline`.
- **Accumulation** : plus le joueur résout d'énigmes, plus le faisceau est solide (score /18). Chaque catégorie monte à 3 max.
- **Reconstruction de l'heure du crime** : même si le joueur rate la montre, il peut déduire 22h09 en croisant :
  1. **Silas Crane** (témoin) : rôdeur pressé vers 22h.
  2. **Verrou thermique** : ouverture à 22h.
  3. **Horloge-mère** (Acte 3) : corrobore le moment du choc.
- **La montre** = raccourci fulgurant pour l'observateur, pas un prérequis bloquant.
- **L'accusation finale** : le faisceau est affiché à l'écran. Plus le score est élevé, plus l'accusation est « irréfutable » visuellement. Le joueur choisit parmi 6 suspects — bonne ou mauvaise fin.

---

## 2. PERSONNAGES

| id | Nom | Rôle |
|---|---|---|
| detective-partner | Inspecteur Wexford | Partenaire, guide |
| protecteur | Major Hale | **Garde du corps et majordome en chef** — COUPABLE |
| femme-fatale | Lady Vivienne | Héritière, menaces anonymes |
| seducteur | Julian Pembrooke | Endetté, faux alibi « panne » |
| suspect | Rupert Blackwood | Créancier, mauvais payeur |
| marginal | Silas Crane | Clochard-témoin (rôdeur de 22h) |
| criminel | Victor Krane | Tueur à gages (ADN inconnu) |
| scientifique | Dr Whitmore | Médecin légiste |

> **Note de cohérence** : Le Major Hale cumule deux fonctions indissociables — **garde du corps** de la victime ET **majordome en chef** de la maison. Cette double casquette lui donne l'accès (clé, alarme, coffre) et la confiance nécessaires au crime. Le joueur ne doit jamais lire « docteur » ou « simple domestique » à son sujet.

**Règle de lieu par défaut (hors besoin scénario)** :
- Scientifique (Whitmore) → laboratoire
- Femme fatale (Vivienne) → intérieur manoir
- Protecteur (Hale) → intérieur manoir
- Détective partenaire → QG (exception : manoir en intro+acte 1)
- Séducteur (Pembrooke) → intérieur bar
- Marginal (Silas) → appartement pauvre (ruelle en narration)
- Suspect (Blackwood) → appartement du suspect
- Criminel (Krane) → extérieur bar ou ruelle

## 3. LIEUX (décor)
`universe` (intro), `crimeScene` (bureau du magnat), `alley` (ruelle de Silas), `residence` (Rupert), `bar` (Victor Krane), `laboratoire` (Dr Whitmore), `qg` (quarter general), `clandestine` (planque), `prison`.

---

## 4. DÉROULÉ PHASE PAR PHASE

### INTRO — Phase 1A « Prologue » (narration, musique thème)
1. *(universe)* « La ville murmure sous la pluie. Dans un appartement cossu, un magnat de l'immobilier a été retrouvé sans vie… »
2. *(crimeScene)* Le sang a séché, le coffre est béant, une **montre de poche brisée** sur la table. **⚠ AUCUNE HEURE ÉTABLIE** — « C'est à vous de la trouver. »
3. *(crimeScene, Wexford)* Présentation du Major Hale, unique domestique, découvreur du corps.

### INTRO — Phase 1B « Recherche » (dialogue, musique recherche)
1. **MINI-JEU `scene_fouille` (grand écran + loupe)** — image `scene de crime manoir.png`, 8 zones numérotées (positions exactes sur l'image) :
   - **A** (x=11.6%, y=66.1%) sceau en or et cachet → matériel de correspondance intact, l'intrus connaissait les lieux.
   - **B** (x=24.1%, y=70.4%) encrier central et bloc d'écriture → zone où la victime rédigeait.
   - **1** (x=31.2%, y=56.8%) papiers administratifs et plume ouverte → recherche rapide.
   - **2** (x=38.6%, y=57.3%) deux verres de vin et coupelle → présence d'un invité de confiance.
   - **3** (x=47.2%, y=58.3%) livre ouvert taché de sang → lutte en plein travail.
   - **4** (x=66.4%, y=79.2%) fauteuil de bureau renversé → bousculade violente.
   - **5** (x=70.8%, y=85.6%) trace de sang au sol → épicentre de l'agression.
   - **6** (x=78.2%, y=86.3%) papier froissé à côté du corps → première énigme (chiffres/inscriptions).
   - **INDICE MAJEUR (fin)** : meurtre prémédité par un proche ; vol simulé ; indices physiques précis.
2. *(crimeScene, Wexford)* Le carnet déchiré révèle des pages manquantes → versements réguliers à « V.K. ».
3. *(crimeScene, Wexford)* Le partenaire : « Vous tenez quelque chose ? Ces indices dessinent un mobile. Continuons. »

### ACTE I — Phase 1 « Confrontation » (dialogue, musique recherche)
1. *(residence, Hale)* Major Hale, **garde du corps et majordome en chef**, accueille le détective avec nervosité. « La maison est en deuil, faites vite. »
2. *(residence, Lady Vivienne)* « Mon mari avait des ennemis, certes. Mais l'auteur de ce crime… c'est quelqu'un de la maison. »
3. **MINI-JEU `montre_code`** *(scène de crime, manoir)* — examiner la montre du Duc :
   - Face : aiguille figée à **22h09** = heure probable du crime.
   - Dos : gravure « 1981 » = code du coffre (Acte II).
   - **INDICE MAJEUR** : 22h09, à retenir pour le twist final. 1981 pour le coffre.

### ACTE I — Phase 2 « Témoignages » (dialogue, musique réflexion)
1. *(alley, Silas Crane)* « J'ai vu un rôdeur bien habillé aux alentours de 22h. » Premier maillon témoin.
2. *(residence)* Le coffre-fort est vide mais 50 000 £ y figuraient → mobile financier.
3. *(secretPlace, Rupert Blackwood)* « Quelqu'un a vidé les comptes ! Le testament a été modifié la semaine dernière. »

### ACTE II — Phase 1 « Piste du bar » (dialogue, musique énigme)
1. **MINI-JEU `carnet_dechire` (QG)** — reconstituer les pages arrachées du livre de comptes :
   - Bandes remises en ordre → versements réguliers à **V.K. (Victor Krane)**.
   - **Empreintes du Major Hale** sur la mention V.K. → lien direct.
   - **INDICE MAJEUR** : mobile financier établi — Hale a payé Krane.
2. *(bar, Julian Pembrooke)* « Je n'ai rien vu, rien entendu. Mais si vous cherchez un mobile, regardez du côté des dettes de Hale. » — alibi de panne.
3. **MINI-JEU `coffre_fort` (QG)** — entrer le code 1981 (issu de la montre) :
   - Documents : dettes de Blackwood, liaison de l'épouse avec Hale.
   - **INDICE MAJEUR** : carnets de versements — Hale a payé Krane plusieurs fois, dernière fois la veille du meurtre.

### ACTE II — Phase 2 « Laboratoire » (dialogue, musique énigme)
1. **MINI-JEU `adn_match` (Whitmore)** — comparer les échantillons ADN :
   - Échantillon inconnu → **Victor Krane**.
   - **INDICE MAJEUR** : tueur professionnel engagé, pas un crime passionnel.
2. **MINI-JEU `cablage_alarme` (Whitmore)** — réparer le circuit de l'alarme :
   - Câble marqué au charbon **AVANT** le sabotage → une main avertie a guidé l'intrus.
   - **INDICE MAJEUR** : alarme neutralisée de l'intérieur par quelqu'un qui connaissait le système.
3. *(residence, Hale)* Au manoir, la montre du Duc est intacte. Hale détourne le regard quand on la lui montre.

### ACTE III — Phase 1 « Tension » (dialogue, musique tension)
1. **MINI-JEU `cryptogramme` (QG)** — décoder la note chiffrée de Victor Krane :
   - **« HALE ENGAGE KRANE »** — la complicité est établie.
   - **INDICE MAJEUR** : le contrat a été payé par un proche de l'intérieur.
2. *(residence, Lady Vivienne)* Les fichiers du coffre : Vivienne trompait la victime avec Hale.
3. *(residence, Hale)* « Je n'ai rien dit de tout cela ! Vous n'avez aucune preuve ! »

### ACTE III — Phase 2 « Révélation » (dialogue, musique tension)
1. *(qg, Wexford)* « Si la durite a été coupée, alors Hale savait où et quand aider Pembrooke. » → la panne était un faux alibi coordonné.
2. *(secretPlace, Silas Crane)* « Blackwood m'a payé pour mentir. Le rôdeur, c'était Pembrooke. » → confirmation du complice.
3. *(alley, Krane)* Le téléphone de Hale sonne. C'est Krane : « Tu m'as payé pour le meurtre. C'est fini. »

### ACTE III — Phase 3 « Révélation finale » (dialogue, musique stress)
1. *(alley, Krane)* « Je ne connaissais pas la victime par hasard. C'est Hale qui m'a contacté. »
2. *(residence, Hale)* Hale se contredit : il décrit la mare de sang avec trop de précision, porte verrouillée à son retour.
3. **CHOIX FINAL `accuser`** (QG, Wexford) : protecteur / femme-fatale / seducteur / suspect / marginal / criminel.

### OUTRO « Épilogue » (généré par app.js selon `accuser`)

**Bonne accusation (protecteur)** — écran de victoire avec faisceau de preuves complet :
- Le Major Hale s'effondre : « Tout ça pour elle… mais elle ne m'a jamais aimé. »
- Victor Krane (la lame) avoue : « Le garde du corps m'a payé. »
- Lady Vivienne complice démasquée, Julian Pembrooke alibi tombé.
- Morale : « De l'amour à la folie criminelle, il n'y a qu'une obsession. »

**Mauvaise accusation** — chaque innocent a une **réaction unique** qui indique au joueur ce qu'il a manqué :
- **femme-fatale** : Lady Vivienne esquisse un sourire glacial. « Vous croyez vraiment que je me serais salie les mains ? Vous manquez de preuves, inspecteur. » → Le véritable commanditaire vous échappe. ÉCHEC.
- **seducteur** : Julian Pembrooke pâle. « C'est une erreur… j'étais en panne, je vous l'ai dit ! » → La panne était factice, mais il n'était que l'alibi. ÉCHEC.
- **suspect** : Rupert Blackwood ricane. « J'étais parti à 21h30, Silas Crane peut le confirmer. Ce n'est pas moi qui ai sectionné cette durite… ni payé Krane. » ÉCHEC.
- **marginal** : Silas Crane secoue la tête. « Je ne suis qu'un clochard, pas un meurtrier. J'ai VU le rôdeur à 22h — suivez cette piste, trouvez qui il était. » ÉCHEC.
- **criminel** : Victor Krane sourit lentement. « Je ne suis que le bras, inspecteur. La main qui m'a guidé, c'est Hale — mon employeur. Relisez les versements dans le coffre. » ÉCHEC.

**Dans tous les cas d'échec** : le vrai coupable s'échappe, le joueur perd son badge, fin dépressive. Le faisceau de preuves (affiché à l'écran) montre exactement quelles catégories étaient insuffisantes.

---

## 5. ÉCONOMIE DES INDICES (design) — V4 (intégration organique)

| Énigme | Phase | Catégorie | Contenu | Payoff |
|---|---|---|---|---|
| Fouille de scène | intro-2 | `forensic` | 8 indices visuels (positions exactes) + clic = consigné au journal | Préméditation + indices physiques |
| Montre du Duc | act1_1 | `timeline` | Face 22h09 + Dos 1981 | Heure du crime + code coffre |
| Carnet déchiré | act2_1 (QG) | `mobile` | Versements à V.K. + empreintes Hale | Mobile financier |
| Coffre-fort | act2_1 (QG) | `mobile` | Code 1981 → documents/dettes/liaison | Lie Hale à l'argent |
| ADN | act2_2 (Labo) | `forensic` | Échantillon B = Krane | Tueur professionnel |
| Câblage alarme | act2_2 (Labo) | `opportunity` | Charbon AVANT sabotage | Intrusion interne |
| Cryptogramme | act3_1 (QG) | `mobile` | « HALE ENGAGE KRANE » | Complicité prouvée |

**Placement narratif** :
- **Acte 1** (Manoir + scène de crime) : fouille + montre = indices matériels directs
- **Acte 2** (QG + Labo) : documents (carnet, coffre) puis preuves scientifiques (ADN, alarme)
- **Acte 3** (Confrontations) : cryptogramme = preuve textuelle avant l'accusation

**Règle d'or** : aucune énigme n'est bloquante (bouton « Passer »). Chaque réussite :
- Affiche un panneau « 🔎 INDICE MAJEUR »
- Enregistre l'indice dans le **journal du détective** (carnet 📓) via `TDNarrativeEngine.addClue()`
- Enregistre l'étape via `TDNarrativeEngine.addStep()` pour l'historique

**Journal/notebook** : tous les indices collectés (fouille, mini-jeux, dialogues) sont stockés dans `gameState.discoveredClues` et visibles en jeu via le bouton 📓 de la barre supérieure.

## 6. MINI-PUZZLES (énigmes logiques sans assets externes)

| Puzzle | Phase | Type | Mécanique | Asset utilisé | Récompense |
|---|---|---|---|---|---|
| Carnet déchiré | 1B | `carnet_dechire` | Reconstituer 4 bandes + loupe pour empreintes | `prescription-eliane.png` | Mobile financier + empreintes |
| Cryptogramme | 2 (bar) | `cryptogramme` | Substitution de César à décoder | `krane-coded-note.png.jfif` | Confirme Hale→Krane |
| Câblage alarme | 3B (labo) | `cablage_alarme` | SVG : pivoter segments pour boucle intacte | `alarm-circuit-blueprint.png.jfif` | Intrusion non forcée |
| Roue des alibis | 4A (QG) | `roue_alibis` | Aligner 3 cadrans (montre, alibi, horloge-mère) | `pocket-watch-dial.png.jfif` | Pulvérise l'alibi de Hale |

Chaque puzzle respecte l'architecture existante (fabrique dans `minigames.js`, `cfg.clue` de récompense, non-bloquant).

---

## 7. ROADMAP / AMÉLIORATIONS CONTINUES
- [x] **Faisceau de preuves** (V3) — 6 catégories, accumulation, affichage à l'accusation. ✅
- [x] **Réactions d'accusation** — 5 innocents avec réaction unique indiquant l'indice manqué. ✅
- [x] **Heure du crime reconstruisable** — montre (raccourci) OU croisement Silas + verrou + horloge-mère. ✅
- [x] **4 mini-puzzles logiques** — Carnet, Cryptogramme, Câblage, Roue. ✅
- [x] **Intégration prescription-eliane** — reconstitution page + empreintes à la loupe. ✅
- [ ] Textes détaillés par zone zoomée de la fouille (à fournir ultérieurement).
- [ ] Variante du twist si le joueur n'a PAS relevé 22h09 (Wexford le déduit plus difficilement).
- [ ] Sons d'ambiance par zone de la fouille.
- [ ] Loupe ajustée au curseur du mini-jeu montre (précision).
- [ ] Intégration du code 1981 → coffre-fort en Acte II.

