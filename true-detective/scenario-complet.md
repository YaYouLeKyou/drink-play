# TRUE DETECTIVE, SCÉNARIO COMPLET (document de référence V3)

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
# permutation #1, Lady Vivienne
npm run permute -- femme-fatale
# permutation #2, Victor Krane
npm run permute -- criminel
# permutation #3, Rupert Blackwood
npm run permute -- suspect
```
Chaque exécution crée un backup horodaté de `phases.js`/`scenario.js` (jamais de perte). L'heure du crime reste **22h09** dans toutes les permutations ; seuls les textes de fouille, les indices de mini-jeux et le coupable actif changent.

> ⚠️ **Cohérence** : les textes détaillés ci-dessous décrivent la permutation `protecteur` (défaut canonique). Si vous activez une autre permutation, les indices affichés en jeu correspondent, le validateur (`validate:scenario`) ne vérifie que la structure, pas l'identité du coupable.

---

## 1. VÉRITÉ (fixe par design)

- **Coupable (maître d'œuvre)** : le Major Hale, « LE PROTECTEUR », garde du corps de la victime.
- **La lame** : Victor Krane, « LE CRIMINEL », tueur payé, ADN inconnu sur la scène.
- **Complicité passive** : Lady Vivienne (menaces rédigées de sa main élégante) et Julian Pembrooke (fausse panne montée avec Hale).
- **Le mobile de Hale** : dettes, chantage, jalousie de serviteur ; il a payé Krane (versements révélés au fur et à mesure des interrogatoires et des réseaux d'alibis).

### L'heure du crime, MÉCANIQUE CENTRALE (twist final)
- **Aucune heure n'est établie au départ.** Personne ne sait quand la victime est morte.
- La montre du Duc attire volontairement l'attention sur son **DOS** (gravure à 4 chiffres) → le joueur distrait n'y voit qu'un code.
- Le **joueur attentif** remarque sur la **FACE** l'aiguille figée à **22h09** → il établit l'heure du crime, un fait que PERSONNE d'autre ne possède.
- **Payoff** : l'alibi de Hale (22h, panne avec Pembrooke) recouvre exactement 22h09. L'horloge-mère du pavillon, remontée en Acte 3, **confirme** 22h09. Sans la montre, le twist tombe à plat ; avec elle, le joueur « sait » avant les personnages.
- **Note** : le code à 4 chiffres au dos de la montre a été conservé comme indice narratif (consigné dans le journal du détective) ; il n'ouvre plus de coffre en V6. L'essentiel des « documents du coffre » (dettes de Blackwood, liaison Vivienne-Hale) est désormais délivré par les dépositions des suspects dans les Réseaux d'Alibis.

### Le FAISCEAU DE PREUVES, mécanique de résolution (V3)
- **Principe** : aucune énigme n'est « clé unique ». Chaque mini-jeu alimente une catégorie de preuves parmi 6 : `alibi`, `mobile`, `opportunity`, `forensic`, `witness`, `timeline`.
- **Accumulation** : plus le joueur résout d'énigmes, plus le faisceau est solide (score /18). Chaque catégorie monte à 3 max.
- **Reconstruction de l'heure du crime** : même si le joueur rate la montre, il peut déduire 22h09 en croisant :
  1. **Silas Crane** (témoin) : rôdeur pressé vers 22h.
  2. **Verrou thermique** : ouverture à 22h.
  3. **Horloge-mère** (Acte 3) : corrobore le moment du choc.
- **La montre** = raccourci fulgurant pour l'observateur, pas un prérequis bloquant.
- **L'accusation finale** : le faisceau est affiché à l'écran. Plus le score est élevé, plus l'accusation est « irréfutable » visuellement. Le joueur choisit parmi 6 suspects, bonne ou mauvaise fin.

---

## 2. PERSONNAGES

| id | Nom | Rôle |
|---|---|---|
| detective-partner | Inspecteur Wexford | Partenaire, guide |
| protecteur | Major Hale | **Garde du corps et majordome en chef**, COUPABLE |
| femme-fatale | Lady Vivienne | Héritière, menaces anonymes |
| seducteur | Julian Pembrooke | Endetté, faux alibi « panne » |
| suspect | Rupert Blackwood | Créancier, mauvais payeur |
| marginal | Silas Crane | Clochard-témoin (rôdeur de 22h) |
| criminel | Victor Krane | Tueur à gages (ADN inconnu) |
| scientifique | Dr Whitmore | Médecin légiste |

> **Note de cohérence** : Le Major Hale cumule deux fonctions indissociables, **garde du corps** de la victime ET **majordome en chef** de la maison. Cette double casquette lui donne l'accès (clé, alarme, coffre) et la confiance nécessaires au crime. Le joueur ne doit jamais lire « docteur » ou « simple domestique » à son sujet.

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

### INTRO, Phase 1A « Prologue » (narration, musique thème)
1. *(universe)* « La ville murmure sous la pluie. Dans un appartement cossu, un magnat de l'immobilier a été retrouvé sans vie… »
2. *(crimeScene)* Le sang a séché, le coffre est béant, une **montre de poche brisée** sur la table. **⚠ AUCUNE HEURE ÉTABLIE**, « C'est à vous de la trouver. »
3. *(crimeScene, Wexford)* Présentation du Major Hale, unique domestique, découvreur du corps.

### INTRO, Phase 1B « Recherche » (dialogue, musique recherche)
1. **MINI-JEU `scene_fouille` (grand écran + loupe)**, image `scene de crime manoir.png`, 8 zones numérotées (positions exactes sur l'image) :
   - **A** (x=11.6%, y=66.1%) sceau en or et cachet → matériel de correspondance intact, l'intrus connaissait les lieux.
   - **B** (x=24.1%, y=70.4%) encrier central et bloc d'écriture → zone où la victime rédigeait.
   - **1** (x=31.2%, y=56.8%) papiers administratifs et plume ouverte → recherche rapide.
   - **2** (x=38.6%, y=57.3%) deux verres de vin et coupelle → présence d'un invité de confiance.
   - **3** (x=47.2%, y=58.3%) livre ouvert taché de sang → lutte en plein travail.
   - **4** (x=66.4%, y=79.2%) fauteuil de bureau renversé → bousculade violente.
   - **5** (x=70.8%, y=85.6%) trace de sang au sol → épicentre de l'agression.
   - **6** (x=78.2%, y=86.3%) papier froissé à côté du corps → première énigme (chiffres/inscriptions).
   - **INDICE MAJEUR (fin)** : meurtre prémédité par un proche ; vol simulé ; indices physiques précis.
2. *(crimeScene, Wexford)* Les indices relevés sur la montre s'accumulent dans le journal : heure figée, code à 4 chiffres au dos. Wexford : « Le testament, l'argent, les relations du Duc. Tout converge. Continuons. »
3. *(crimeScene, Wexford)* Le partenaire : « Vous tenez quelque chose ? Ces indices dessinent un mobile. Continuons. »

### ACTE I, Phase 1 « Interrogatoires » (dialogue, musique recherche)
1. *(residence, Hale)* Major Hale, **garde du corps et majordome en chef**, accueille le détective dans le salon du manoir. Vous l'interrogez : « Vous sembliez proche de la victime. Quel genre d'homme était-il ? » Hale hésite : « Distant. Il parlait souvent de changer le testament, c'est l'affaire de Blackwood. » **[Indice Témoin]** Hale mentionne le testament et Blackwood spontanément.
2. *(residence, Lady Vivienne)* Dans le boudoir, vous la testez : « Votre mari voyait d'autres femmes ? » Elle sourit froidement : « Nous avions nos arrangements. » **[Indice Mobile]** Aucune émotion visible : à creuser.
3. **MINI-JEU `reseau_alibis` (Cartographie mentale)** *(salon du manoir)*, Wexford étale les deux dépositions : « Deux visages, deux versions. À vous de croiser les informations et de trouver le mensonge. » Le joueur dispose de 2 cartes-témoins (Hale + Vivienne) et doit cliquer sur le MENSONGE.
    - **Hale** (vrai) : « J'étais en panne avec Pembrooke sur la route à 22h. Sa voiture, sa durite, son capot ouvert. »
    - **Vivienne** (mensonge) : « J'étais au théâtre avec des amies, puis ici, seule. Les domestiques avaient congé. Sauf un, qui rôdait près du pavillon vers 22h. » (incohérence avec l'alibi de Hale et l'heure du crime)
    - **INDICE MAJEUR** : le mensonge est identifié. Le Duc a engagé Krane pour liquider Pembrooke (le séducteur qui trompait Vivienne), mais l'arme a tué le VICTIME, pas Pembrooke. Krane a gardé l'arme car la victime la lui avait tendue. L'excuse s'effondre : « je travaillais pour le Duc » ne justifie pas le meurtre du mari.
4. *(residence, Wexford)* Conclusion de Wexford : « Le mensonge est isolé. Maintenant, le notaire Blackwood tenait les cordons de la bourse du Duc, et le clochard a vu une ombre dans la ruelle. Allons les découvrir. »

### ACTE I, Phase 2 « Témoignages » (dialogue, musique réflexion)
1. *(residence, Wexford)* Dans le vestibule du manoir, avant de partir : « Le clochard de la ruelle a vu quelque chose cette nuit-là. Mais passons d'abord chez Blackwood, le notaire, il gérait les affaires du Duc. Et le clochard, on l'interceptera au retour. » → transition cohérente.
2. *(secretPlace, Rupert Blackwood)* Chez Blackwood, dans son appartement. « Je ne sais pas ce que trafique le Duc, mais les tensions sur le testament se multiplient. Assez pour savoir qu'il voulait déshériter sa femme. » **[Indice Mobile / Témoin]** Blackwood mentionne la déshérence, il en sait plus qu'il ne le dit.
3. *(alley, Silas Crane)* **À la sortie du manoir**, dans la ruelle adjacente. Vous glissez une pièce au clochard. Il se détend : « Un rôdeur bien habillé est passé par ici vers les 22h. Pressé, nerveux. Il regardait sans arrêt sa montre, une tocante en or. » **[Indice Témoin / Chronologie]** À corréler avec la montre du Duc et l'alibi de Pembrooke.

### ACTE II, Phase 1 « Piste du bar » (dialogue, musique énigme)
1. **MINI-JEU `reseau_alibis` (2e cartographie mentale, QG)**, quatre dépositions sur la table de Wexford, à étiqueter une par une (Mensonge ou Vérité) :
   - **Hale** (vrai) : « À 22h j'étais avec Pembrooke en panne sur la route. On a passé vingt minutes sur le bas-côté, sa durite était sectionnée. »
   - **Pembrooke** (mensonge) : « Ma voiture est tombée en panne à 22h, Hale m'a rejoint. J'étais SEUL à attendre, personne d'autre n'est passé. » (contredit Silas, qui a vu un rôdeur à la même heure)
   - **Blackwood** (vrai) : « J'ai dîné avec le Duc à 19h, je suis parti vers 20h, Silas m'a vu passer au portail. Le testament m'importe peu. »
   - **Vivienne** (mensonge) : « Au théâtre avec des amies jusqu'à 22h, puis ici seule. Les domestiques avaient congé, le manoir était vide. » (contredit Hale, qui est domestique et rôdait près du pavillon)
   - **INDICE MAJEUR** : le réseau d'alibis révèle deux menteurs. Suivez les incohérences.
2. *(bar, Julian Pembrooke)* « Je n'ai rien vu, rien entendu. Mais si vous cherchez un mobile, regardez du côté des dettes de Hale. », alibi de panne.
3. *(alley, Victor Krane)* **Interrogatoire du criminel** : Krane, accroupi dans la ruelle derrière le bar, mâchonne un clou. « Tiens, l'inspecteur. Vous voulez quoi, cette fois ? » Wexford étale ensuite **MINI-JEU `reseau_alibis` (3e cartographie mentale)**, six dépositions à étiqueter (Mensonge ou Vérité) :
   - **Hale** (vrai) : « J'étais en panne avec Pembrooke à 22h. Le verrou a été ouvert avec une clé, pas forcé. Whitmore, le rapport toxicologique est formel. »
   - **Vivienne** (mensonge) : « J'étais au théâtre, puis seule au manoir. Mon mari et moi avions une relation basée sur l'argent, pas l'amour, je n'avais aucune raison de le tuer. » (contredit l'ADN de la scène et l'alibi de Hale)
   - **Pembrooke** (mensonge) : « Ma voiture est tombée en panne, Hale m'a rejoint à 22h. J'étais SEUL à attendre, aucun rôdeur n'est passé. » (contredit le témoignage de Silas)
   - **Blackwood** (vrai) : « J'ai dîné avec le Duc à 19h, je suis parti vers 20h, Silas m'a vu passer. Le testament m'importe peu, c'est l'héritier qui compte. »
   - **Silas** (vrai) : « J'ai vu un rôdeur à 22h près du pavillon, montre en or. Blackwood est réglo. »
   - **Krane** (mensonge) : « Pour qui paye. Cette nuit-là, j'étais seul. Silas, un vagabond au passé trouble. » (contredit tout le faisceau d'indices, l'ADN et les aveux partiels précédents)
   - **INDICE MAJEUR** : le réseau complet révèle trois menteurs (Vivienne + Pembrooke + Krane) qui se couvrent mutuellement. Le commanditaire se dessine.

### ACTE II, Phase 2 « Laboratoire » (dialogue, musique énigme)
**6 interrogatoires ADN** *(laboratoire, Dr Whitmore, scientifique)*, un par suspect, ordre imposé : Protecteur → Femme-fatale → Séducteur → Marginal → Suspect → Criminel.

1. **Whitmore intro** : « L'ADN sur l'arme, les poignées, le corps… a des traces de TOUS. Chaque suspect a approché la victime. La science ne tranchera pas. » (Tolérance zéro certitude.)
2. **Protecteur (Hale)** : interrogatoire + commentaire Whitmore. Hale nie, l'ADN confirme sa présence (garde du corps, vie sur place).
3. **Femme-fatale (Vivienne)** : interrogatoire + commentaire Whitmore. ADN présent, relation intime avec la victime.
4. **Séducteur (Pembrooke)** : interrogatoire + commentaire Whitmore. ADN présent, alibi de panne à vérifier.
5. **Marginal (Silas)** : interrogatoire + commentaire Whitmore. ADN présent, fréquentait la ruelle, a vu le rôdeur.
6. **Suspect (Blackwood)** : interrogatoire + commentaire Whitmore. ADN présent, dîners réguliers, testament.
7. **Criminel (Krane)** : interrogatoire + commentaire Whitmore. **TWIST** : l'ADN de Krane est sur l'arme car la victime le lui a tendue pour montrer la cible (Pembrooke). L'arme a tué le VICTIME. Krane : « Le Duc m'a engagé pour le séducteur. J'ai raté la cible ? Non, l'arme a tourné. » Whitmore : « L'échantillon ne ment pas. Mais il ne dit pas POURQUOI. »
8. **Whitmore conclusion** : « Six profils. Zéro certitude. L'ADN place tout le monde sur scène. C'est à vous de choisir qui a tiré. »

### ACTE III, Phase 1 « Tension » (dialogue, musique tension)
1. **MINI-JEU `cryptogramme` (QG)**, décoder la note chiffrée de Victor Krane :
   - **« HALE ENGAGE KRANE »**, la complicité est établie.
   - **INDICE MAJEUR** : le contrat a été payé par un proche de l'intérieur.
2. *(residence, Lady Vivienne)* Les fichiers du coffre : Vivienne trompait la victime avec Hale.
3. *(residence, Hale)* « Je n'ai rien dit de tout cela ! Vous n'avez aucune preuve ! »

### ACTE III, Phase 2 « Révélation » (dialogue, musique tension)
1. *(qg, Wexford)* « Si la durite a été coupée, alors Hale savait où et quand aider Pembrooke. » → la panne était un faux alibi coordonné.
2. *(secretPlace, Silas Crane)* « Blackwood m'a payé pour mentir. Le rôdeur, c'était Pembrooke. » → confirmation du complice.
3. *(alley, Krane)* Le téléphone de Hale sonne. C'est Krane : « Tu m'as payé pour le meurtre. C'est fini. »

### ACTE III, Phase 3 « Révélation finale » (dialogue, musique stress)
1. *(alley, Krane)* « Je ne connaissais pas la victime par hasard. C'est Hale qui m'a contacté. »
2. *(residence, Hale)* Hale se contredit : il décrit la mare de sang avec trop de précision, porte verrouillée à son retour.
3. **CHOIX FINAL `accuser`** (QG, Wexford) : protecteur / femme-fatale / seducteur / suspect / marginal / criminel.

### OUTRO « Épilogue » (généré par app.js selon `accuser`)

**Bonne accusation (protecteur)**, écran de victoire avec faisceau de preuves complet :
- Le Major Hale s'effondre : « Tout ça pour elle… mais elle ne m'a jamais aimé. »
- Victor Krane (la lame) avoue : « Le garde du corps m'a payé. »
- Lady Vivienne complice démasquée, Julian Pembrooke alibi tombé.
- Morale : « De l'amour à la folie criminelle, il n'y a qu'une obsession. »

**Mauvaise accusation**, chaque innocent a une **réaction unique** qui indique au joueur ce qu'il a manqué :
- **femme-fatale** : Lady Vivienne esquisse un sourire glacial. « Vous croyez vraiment que je me serais salie les mains ? Vous manquez de preuves, inspecteur. » → Le véritable commanditaire vous échappe. ÉCHEC.
- **seducteur** : Julian Pembrooke pâle. « C'est une erreur… j'étais en panne, je vous l'ai dit ! » → La panne était factice, mais il n'était que l'alibi. ÉCHEC.
- **suspect** : Rupert Blackwood ricane. « J'étais parti à 21h30, Silas Crane peut le confirmer. Ce n'est pas moi qui ai sectionné cette durite… ni payé Krane. » ÉCHEC.
- **marginal** : Silas Crane secoue la tête. « Je ne suis qu'un clochard, pas un meurtrier. J'ai VU le rôdeur à 22h, suivez cette piste, trouvez qui il était. » ÉCHEC.
- **criminel** : Victor Krane sourit lentement. « Je ne suis que le bras, inspecteur. La main qui m'a guidé, c'est Hale, mon employeur. Relisez les versements dans le coffre. » ÉCHEC.

**Dans tous les cas d'échec** : le vrai coupable s'échappe, le joueur perd son badge, fin dépressive. Le faisceau de preuves (affiché à l'écran) montre exactement quelles catégories étaient insuffisantes.

---

## 5. ÉCONOMIE DES INDICES (design), V4 (intégration organique)

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
- **Acte 2** (QG + bar + ruelle) : Réseaux d'Alibis (2e et 3e cartographie) puis preuves scientifiques (ADN, alarme)
- **Acte 3** (Confrontations) : cryptogramme = preuve textuelle avant l'accusation

**Règle d'or** : aucune énigme n'est bloquante (bouton « Passer »). Chaque réussite :
- Affiche un panneau « 🔎 INDICE MAJEUR »
- Enregistre l'indice dans le **journal du détective** (carnet 📓) via `TDNarrativeEngine.addClue()`
- Enregistre l'étape via `TDNarrativeEngine.addStep()` pour l'historique

**Journal/notebook** : tous les indices collectés (fouille, mini-jeux, dialogues) sont stockés dans `gameState.discoveredClues` et visibles en jeu via le bouton 📓 de la barre supérieure.

## 6. MINI-PUZZLES (énigmes logiques sans assets externes)

| Puzzle | Phase | Type | Mécanique | Asset utilisé | Récompense |
|---|---|---|---|---|---|
| Réseau d'Alibis 1 | act1_1 (3/4) | `reseau_alibis` | Identifier le mensonge parmi 2 dépositions | aucun | Point d'entrée dans le réseau |
| Réseau d'Alibis 2 | act2_1 (1/3) | `reseau_alibis` | Identifier 2 menteurs parmi 4 dépositions croisées | aucun | Deux menteurs isolés, complicité |
| Réseau d'Alibis 3 | act2_1 (3/3) | `reseau_alibis` | Identifier 3 menteurs parmi 6 dépositions croisées | aucun | Trois menteurs se couvrent, commanditaire identifié |
| Cryptogramme | 2 (bar) | `cryptogramme` | Substitution de César à décoder | `krane-coded-note.png.jfif` | Confirme Hale→Krane |
| Câblage alarme | 3B (labo) | `cablage_alarme` | SVG : pivoter segments pour boucle intacte | `alarm-circuit-blueprint.png.jfif` | Intrusion non forcée |
| Roue des alibis | 4A (QG) | `roue_alibis` | Aligner 3 cadrans (montre, alibi, horloge-mère) | `pocket-watch-dial.png.jfif` | Pulvérise l'alibi de Hale |

Chaque puzzle respecte l'architecture existante (fabrique dans `minigames.js`, `cfg.clue` de récompense, non-bloquant).

---

## 7. ROADMAP / AMÉLIORATIONS CONTINUES
- [x] **Faisceau de preuves** (V3), 6 catégories, accumulation, affichage à l'accusation. ✅
- [x] **Réactions d'accusation**, 5 innocents avec réaction unique indiquant l'indice manqué. ✅
- [x] **Heure du crime reconstruisable**, montre (raccourci) OU croisement Silas + verrou + horloge-mère. ✅
- [x] **4 mini-puzzles logiques**, Carnet, Cryptogramme, Câblage, Roue. ✅
- [x] **Intégration prescription-eliane**, reconstitution page + empreintes à la loupe. ✅
- [ ] Textes détaillés par zone zoomée de la fouille (à fournir ultérieurement).
- [ ] Variante du twist si le joueur n'a PAS relevé 22h09 (Wexford le déduit plus difficilement).
- [ ] Sons d'ambiance par zone de la fouille.
- [ ] Loupe ajustée au curseur du mini-jeu montre (précision).
- [ ] Intégration du code 1981 → coffre-fort en Acte II.

