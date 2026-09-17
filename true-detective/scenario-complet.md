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
- **Complicité passive** : Lady Vivienne (liaison avec le Duc) et Julian Pembrooke (faux alibi « panne »).
- **Le mobile de Hale** : jaloux de la liaison entre Vivienne et Pembrooke, Hale a manipulé le Duc pour qu'il engage Krane contre Pembrooke. L'arme a tué le Duc, et Hale a orchestré le tout pour éliminer Pembrooke (versements révélés au fur et à mesure des interrogatoires et des réseaux d'alibis).

### L'heure du crime, MÉCANIQUE CENTRALE (twist final)
- **Aucune heure n'est établie au départ.** Personne ne sait quand la victime est morte.
- La montre du Duc attire volontairement l'attention sur son **DOS** (gravure à 4 chiffres) → le joueur distrait n'y voit qu'un code.
- Le **joueur attentif** remarque sur la **FACE** l'aiguille figée à **22h09** → il établit l'heure du crime, un fait que PERSONNE d'autre ne possède.
- **Payoff** : l'alibi de Hale (22h, panne avec Pembrooke) recouvre exactement 22h09. L'horloge-mère du pavillon, remontée en Acte 3, **confirme** 22h09. Sans la montre, le twist tombe à plat ; avec elle, le joueur « sait » avant les personnages.
- **Le code 1981** au dos de la montre ouvre le coffre-fort en Acte 3 — mais le coffre est **vide**. Le vrai coffre a été vidé par **Wexford** la nuit du crime.
- **Note** : le code à 4 chiffres au dos de la montre a été conservé comme indice narratif (consigné dans le journal du détective). Le vrai contenu des documents du coffre (dettes de Blackwood, liaison Vivienne-Hale, **paiements de Wexford**) est délivré par les dépositions des suspects dans les Réseaux d'Alibis et par la **muraille de reconstruction** en Acte 3.

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
   - **Vivienne** (vrai) : « J'étais au théâtre avec des amies, puis seule au manoir. Mon mari et moi avions une relation basée sur l'argent, pas l'amour, je n'avais aucune raison de le tuer. »
   - **Hale** (vrai) : « À 22h j'étais avec Pembrooke en panne sur la route. On a passé vingt minutes sur le bas-côté, sa durite était sectionnée. »
   - **Silas** (mensonge) : « J'ai vu un rôdeur à 22h près du pavillon, montre en or, nerveux. » (ment — il a vu Pembrooke, pas un rôdeur)
   - **Krane** (mensonge) : « Pour qui paye. Cette nuit-là, j'étais seul. » (ment — le Duc l'a engagé pour tuer Pembrooke, mais l'arme a tué le Duc)
   - **INDICE MAJEUR** : le réseau révèle deux menteurs. La victime devait de l'argent à Krane et voulait qu'il élimine Pembrooke, mais l'arme a tué le Duc.
2. *(bar, Julian Pembrooke)* **Interrogatoire du séducteur** : Pembrooke, voix trop calme. « Le Duc m'avait engagé pour une élimination, pas pour un vol. Mais l'arme a mal tourné. », alibi de panne.
3. *(alley, Victor Krane)* **Interrogatoire du criminel** : Krane, accroupi dans la ruelle derrière le bar, mâchonne un clou. « Tiens, l'inspecteur. Vous voulez quoi, cette fois ? » Wexford étale ensuite **MINI-JEU `reseau_alibis` (3e cartographie mentale)**, six dépositions à étiqueter (Mensonge ou Vérité) :
   - **Hale** (vrai) : « J'étais en panne avec Pembrooke à 22h. Le verrou a été ouvert avec une clé, pas forcé. Whitmore, le rapport toxicologique est formel. »
   - **Vivienne** (mensonge) : « J'étais au théâtre, puis seule au manoir. Mon mari et moi avions une relation basée sur l'argent, pas l'amour, je n'avais aucune raison de le tuer. »
   - **Pembrooke** (mensonge) : « Ma voiture est tombée en panne, Hale m'a rejoint à 22h. J'étais SEUL à attendre, aucun rôdeur n'est passé. » (contredit le témoignage de Silas)
   - **Blackwood** (vrai) : « J'ai dîné avec le Duc à 19h, je suis parti vers 20h, Silas m'a vu passer. Le testament m'importe peu, c'est l'héritier qui compte. »
   - **Silas** (vrai) : « J'ai vu un rôdeur à 22h près du pavillon, montre en or, nerveux. »
   - **Krane** (mensonge) : « Pour qui paye. Cette nuit-là, j'étais seul. Silas, un vagabond au passé trouble. » (contredit le faisceau d'indices et l'ADN)
   - **INDICE MAJEUR** : le réseau complet révèle trois menteurs (Vivienne + Pembrooke + Krane) qui se couvrent mutuellement. Le Duc a engagé Krane pour tuer Pembrooke, mais l'arme a tué le maître.

### ACTE II, Phase 2 « Laboratoire » (dialogue, musique énigme)
1. *(laboratoire, Whitmore + partenaire)* Intro ADN, puis **MINI-JEU `chemistry` (analyse toxico, éprouvettes)** : transvasez les réactifs mélangés pour isoler chaque fluide pur dans son éprouvette (45 s). Réussite = **INDICE MAJEUR** (forensique) : le poison rare et coûteux, administré avec précision, prouve un meurtre prémédité commandité par un initié qui connaissait la maison. Échec = perte de l'indice, jamais de game over (le joueur peut toujours « Passer »).
2. **Whitmore** : « L'ADN sur l'arme, les poignées, le corps… il y en a de TOUS. Mais la scène a été fréquentée par chacun pour des raisons légites. Confrontez-les un par un, dans leurs lieux. »

### ACTE II, Phase 3 « Interrogatoires sur site » (dialogue, musique réflexion)
1. **Réseau d'Alibis 3** *(QG)* — Wexford étale six dépositions révélées par les interrogatoires. Chacun a une raison légitime d'être au manoir, mais tous mentionnent le coffre, et personne ne sait pourquoi leur ADN est sur l'arme.
    - **Hale** (mensonge) : « J'étais en panne avec Pembrooke à 22h. Le verrou a été ouvert avec une clé. » (lie sur l'arme)
    - **Vivienne** (mensonge) : « J'étais au théâtre, puis seule au manoir. » (ADN sur l'arme)
    - **Pembrooke** (mensonge) : « Ma voiture est tombée en panne, Hale m'a rejoint à 22h. » (ADN sur la porte)
    - **Blackwood** (vrai) : « J'ai dîné avec le Duc à 19h, je suis parti vers 20h. »
    - **Silas** (vrai) : « J'ai vu un rôdeur à 22h. »
    - **Krane** (mensonge) : « Cette nuit-là, j'étais seul dans le bureau du Duc. » (ADN sur l'arme)
    - **INDICE MAJEUR** : le réseau révèle que chacun avait une raison légitime d'être au manoir, mais le coffre est la clé. Silas et Krane corroborent leur rencontre.

### ACTE III, Phase 1 « Le Coffre vide » (dialogue, musique tension)

**Le twist central** : le coffre-fort est **déjà vide** lorsque le joueur arrive.  
1. *(crimeScene, Wexford)* « Allez, inspecteur. La combinaison de la montre... et ouvrez-moi ce coffre. » → Le coffre grince, s'ouvre... et est **vide**. Plus aucun document, plus aucun billet.  
   **INDICE MAJEUR** : le coffre a été vidé **avant** que la police n'arrive. Quelqu'un connaissait la combinaison.
2. *(crimeScene, Wexford)* « Regardez cette muraille de reconstruction. Elle couvre une ancienne porte secrète... » → En poussant le panneau latéral, le mur **basculle** révélant un **compartiment caché**. À l'intérieur : des contrats falsifiés, des registres de versements, et une **lettre signée Wexford** (datée de la semaine précédente).  
   **INDICE MAJEUR** : le partenaire… a-t-il été dans le manoir ?
3. Wexford, pâle, tente de justifier : « Ces papiers... ils datent de la semaine dernière. Je les ai ramenés de l'extérieur. » Mais la pluie de la veille a lavé les empreintes du hall. Personne n'a pu franchi le seuil sans être vu.  
   **INDICE MAJEUR** : Wexford est entré **la nuit du crime**, seul, sans laisser de traces.

### ACTE III, Phase 2 « Les 6 branches » (dialogue, musique tension)

Le coffre vide a transformé l'enquête. Chacun des 6 suspects est convoqué au parloir. Le joueur choisit qui interroger en premier — **ce choix déclenche une branche unique**. Chaque branche se termine par une **bataille navale** contre le suspect : un duel tactique où la victoire révèle un indice, la défaite le cache.

**BRAIVCHE 1 — protecteur (Major Hale)** : Hale nie avec violence. « Ce n'est pas moi qui ai vidé le coffre. Wexford était dans la maison, pas moi ! »  
- **Bataille navale** : Hale joue avec férocité. Victoire = il avoue avoir vu Wexford sortir du bureau à 22h09. Défaite = il accuse Pembrooke.  
- **Indice** : Hale mentionne une **conversation téléphonique** avec Wexford la veille.

**BRAIVCHE 2 — femme-fatale (Lady Vivienne)** : Vivienne se frotte le cou. « Ce coffre contenait des preuves contre moi... mais pas celles que je craignais. »  
- **Bataille navale** : Elle joue d'une élégance glacialle. Victoire = elle avoue avoir payé Wexford pour saboter l'enquête. Défaite = elle s'accroît à l'innocence.  
- **Indice** : La lettre au coffre est en réalité **un faux** signé Wexford.

**BRAIVCHE 3 — seducteur (Julian Pembrooke)** : « Le coffre ? Je suis resté au bar toute la nuit. Mais Wexford... il est passé chez moi à 21h30, en sueur. »  
- **Bataille navale** : Pembrooke mise gros. Victoire = il décrit le **code du coffre** (1981) qu'il n'aurait pas dû connaître. Défaite = il se ferme.  
- **Indice** : Pembrooke avait vu Wexford avec Krane une semaine avant.

**BRAIVCHE 4 — suspect (Rupert Blackwood)** : « Wexford m'a appelé mardi dernier. Il voulait acheter mes registres de notaire. »  
- **Bataille navale** : Blackwood joue froid, calculé. Victoire = il avoue avoir effacé des pages du carnet pour Wexford. Défaite = il jurait de loyauté au Duc.  
- **Indice** : Un paiement de 12 000 £ porte le nom **Wexford** dans les registres.

**BRAIVCHE 5 — marginal (Silas Crane)** : « Le coffre n'était pas verrouillé ce soir-là. Wexford a utilisé une de ses propres clefs. »  
- **Bataille navale** : Silas joue avec la ruse du clochard. Victoire = il décrit **exactement** le visage de Wexford dans le hall. Défaite = il se tait.  
- **Indice** : Wexford portait un manteau de police **noir**, pas le bleu habituel.

**BRAIVCHE 6 — criminel (Victor Krane)** : « Wexford m'a payé pour le vol. Mais le meurtre... c'était un accident. »  
- **Bataille navale** : Krane joue avec la précision d'un tueur. Victoire = il avoue tout : la lettre de Wexford, le code du coffre, le coupable final. Défeate = il protège Wexford.  
- **Indice** : Krane a reçu **50 000 £** de Wexford, pas du Duc.

### ACTE III, Phase 3 « Le twist final » (dialogue, musique stress)

Après la bataille navale contre **le suspect accusé**, le joueur peut accuser ou demander une autre branche. Mais **chaque victoire de bataille navale révèle un élément du puzzle final** :

1. **Wexford** a orchestré le tout : il a vidé le coffre pour cacher ses **escroqueries** (dettes de jeu, trafic d'art).
2. **Le Duc** l'a découvert. Wexford a engagé **Krane** pour une élimination, mais **Hale** (jaloux de la liaison entre le Duc et un autre) a **pris l'arme** lui-même.
3. **Hale** a tué le Duc, mais Wexford a **blâmé Krane** et a vidé le coffre pour **couvrir** le meurtre.
4. **La vraie vérité** : Wexford est le commanditaire. Il a manipulé chaque suspect, utilisé le coffre comme **leurre**, et a compté sur la confusion pour s'échapper.

### OUTRE « Épilogue » (généré par app.js selon `accuser`)

**Accusation de Wexford (twist final)** : le joueur, s'il a collecté suffisamment d'indices des 6 branches, peut accuser **Wexford**.  
- Morale : « Certains draps sont trop longs pour finir proprement. »

**Accusation erronée** : chaque suspect a une **réaction unique** qui indique au joueur ce qu'il a manqué :
- **femme-fatale** : « Regardez du côté de votre partenaire. » ÉCHEC.
- **seducteur** : « La panne était factice, mais Wexford était dans la maison. » ÉCHEC.
- **suspect** : « Wexford m'a payé pour effacer les traces. » ÉCHEC.
- **marginal** : « Le vrai tueur, c'est celui qui vous a guidé. » ÉCHEC.
- **criminel** : « Wexford m'a engagé, pas le Duc. Relisez les encaisses du bar. » ÉCHEC.
- **protecteur** : « Wexford m'a manipulé. Il a tout orchestré. » ÉCHEC.

**Dans tous les cas d'échec** : le vrai coupable (Wexford) s'échappe, le joueur perd son badge, fin dépressive. Le faisceau d'indices montre quelles branches étaient insuffisantes.

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
- **Acte 3** (Confrontations) : puzzle = preuve textuelle avant l'accusation

**Règle d'or** : aucune énigme n'est bloquante (bouton « Passer »). Chaque réussite :
- Affiche un panneau « 🔎 INDICE MAJEUR »
- Enregistre l'indice dans le **journal du détective** (carnet 📓) via `TDNarrativeEngine.addClue()`
- Enregistre l'étape via `TDNarrativeEngine.addStep()` pour l'historique

**Journal/notebook** : tous les indices collectés (fouille, mini-jeux, dialogues) sont stockés dans `gameState.discoveredClues` et visibles en jeu via le bouton 📓 de la barre supérieure.

## 6. MINI-PUZZLES (énigmes logiques sans assets externes)

| Puzzle | Phase | Type | Mécanique | Asset utilisé | Récompense |
|---|---|---|---|---|---|
| Réseau d'Alibis 1 | act1_1 (3/4) | `reseau_alibis` | Identifier le mensonge parmi 2 dépositions | aucun | Point d'entrée dans le réseau |
| Réseau d'Alibis 2 | act2_1 (1/3) | `reseau_alibis` | Identifier 2 menteurs parmi 4 dépositions croisées | aucun | La victime devait de l'argent à Krane |
| Réseau d'Alibis 3 | act2_1 (3/3) | `reseau_alibis` | Identifier 3 menteurs parmi 6 dépositions croisées | aucun | Chacun a une raison légitime, le coffre est la clé |
| Réseau d'Alibis 4 | act2_3 (6/6) | `reseau_alibis` | Réseau final : 6 dépositions post-interrogatoires | aucun | Confusion ADN, coffre = vérité |
| Puzzle Krane | 2 (bar) | `puzzle` | Emboîter des formes géométriques | aucun | Confirme Duc→Krane, Hale orchestrateur |
| Coffre vide | 3A (crimeScene) | `coffre_code` | Combinaison 1981 → coffre ouvert, MAIS VIDE | aucun | Twist : le coffre a été vidé avant |
| Mur de reconstruction | 3A (crimeScene) | `scene_fouille` | Découvrir le compartiment caché derrière la muraille | aucun | Lettre signée Wexford → véritable twist |
| Câblage alarme | 3B (labo) | `cablage_alarme` | SVG : pivoter segments pour boucle intacte | `alarm-circuit-blueprint.png.jfif` | Intrusion non forcée |
| Bataille navale ×6 | 3C (branches) | `bataille-navale` | Duel tactique contre chaque suspect | `bataille-navale.html` | Révèle les mensonges de Wexford |
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
- [x] **6 branches Acte 3** : coffre vide → mur de reconstruction → 6 bras de bataille navale → twist final (Wexford). ✅
- [x] **Twist final Wexford** : le partenaire est le vrai commanditaire. ✅

