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
| protecteur | Major Hale | Garde du corps — COUPABLE |
| femme-fatale | Lady Vivienne | Héritière, menaces anonymes |
| seducteur | Julian Pembrooke | Endetté, faux alibi « panne » |
| suspect | Rupert Blackwood | Créancier, mauvais payeur |
| marginal | Silas Crane | Clochard-témoin (rôdeur de 22h) |
| criminel | Victor Krane | Tueur à gages (ADN inconnu) |
| scientifique | Dr Whitmore | Médecin légiste |
|  |  |  |

## 3. LIEUX (décor)

`universe` (intro), `crimeScene` (bureau du magnat), `alley` (ruelle de Silas), `residence` (Rupert), `bar` (Victor Krane), `laboratoire` (Dr Whitmore), `qg` (quarter general), `clandestine` (planque), `prison`.

---

## 4. DÉROULÉ PHASE PAR PHASE

### INTRO — Phase 1A « Prologue » (narration, musique thème)

1. *(universe)* « La ville murmure sous la pluie. Dans un appartement cossu, un magnat de l'immobilier a été retrouvé sans vie… »
2. *(crimeScene)* Le sang a séché, le coffre est béant, une **montre de poche brisée** sur la table. **⚠ AUCUNE HEURE ÉTABLIE** — « C'est à vous de la trouver. »
3. *(crimeScene, Wexford)* Présentation du Major Hale, unique domestique, découvreur du corps.

### INTRO — Phase 1B « Recherche » (dialogue, musique recherche)

1. **MINI-JEU `scene_fouille` (grand écran + loupe)** — image `scene de crime manoir.png`, 8 zones numérotées :
   - **1** cachet de cire intact → personne n'a forcé le bureau ; l'assassin connaissait la maison.
   - **2** carafe renversée → DEUX verres : la victime attendait un proche de confiance.
   - **3** livre de comptes taché → pages des dettes arrachées.
   - **A** lettre à moitié brûlée sous l'encrier → menaces d'une écriture élégante.
   - **C** encrier intact, plume sèche → on a écrit AVANT le meurtre.
   - **4** fauteuil renversé → lutte brève, près de la fenêtre.
   - **5** mare de sang → aucune trace de défense : il connaissait son agresseur.
   - **6** reçu froissé signé **« V.K. »** → forte somme en espèces.
   - **INDICE MAJEUR (fin)** : meurtre prémédité par un proche ; vol simulé ; reçu V.K.
2. **MINI-JEU `carnet_dechire`** *(prescription-eliane.png)* — reconstitution des pages arrachées + recherche d'empreintes à la loupe :
   - Bandes remises en ordre = un versement régulier à **V.K. (Victor Krane)**.
   - Empreintes révélées → le docteur/majordome a touché la mention V.K.
   - **INDICE MAJEUR** : mobile financier établi — versements à Krane.
3. *(protecteur)* Major Hale tremble : parti à 20h dépanner Pembrooke, retour 21h, corps découvert, coffre vidé. Rupert Blackwood est passé à 19h, « il lui devait beaucoup ».
4. **CHOIX `choisirSuspect`** : Lady Vivienne / Julian Pembrooke / Rupert Blackwood.

### ACTE I — Phase 2A « Piste » (narration, musique thème)

1. *(alley)* Soir, ruelle sombre. Silas Crane surgit de l'ombre.
2. **MINI-JEU `pression`** — remettre dans l'ordre les questions qui font parler Silas :
   1. Le proposer de partager un café → il se détend.
   2. La pièce qu'il garde précieusement → « Elle est à moi. »
   3. Le rôdeur de 22h09 → il craque : « J'ai vu son visage… »
   - **INDICE MAJEUR** : le rôdeur de 22h était « bien habillé, pressé » — ressemble à Pembrooke ; sa panne tombe pile à cette heure.
3. *(residence)* Arrivée chez Rupert Blackwood.
4. *(allier, sans PNJ)* **MINI-JEU `cryptogramme`** *(krane-coded-note.png.jfif)* — décoder la note chiffrée de Victor Krane par substitution (clé dans le décor).
   - **INDICE MAJEUR** : le contrat a été payé par un proche de l'intérieur — « Hale m'a engagé ». Confirme la piste Krane/coffre.

### ACTE I — Phase 2B « Réflexion » (dialogue dynamique `interrogations`, musique réflexion)

- Interrogatoires dans l'ordre choisi par le joueur (`suspectOrdre`), générés par app.js.

### ACTE II — Phase 3A « Énigme » (dialogue, musique énigme)

1. *(laboratoire, Dr Whitmore)* **MINI-JEU `labo_verrou`** — balayage thermique du verrou : 3 zones réchauffées.
   - **INDICE MAJEUR** : verrou ouvert à la clé → accès au trousseau de Hale ; chaleur datée 22h.
   - Whitmore : ADN de Vivienne, Pembrooke, Hale, Blackwood… **et un inconnu**.
2. *(alley, sans PNJ)* **MINI-JEU `montre_code`** — la montre du Duc :
   - Loupe sur le **DOS** → gravure **« 1981 »** (le joueur est volontairement attiré ici).
   - Question finale : *« qu'avez-vous remarqué SUR LA FACE ? »*
     - ✅ **L'aiguille figée à 22h09 = heure probable du crime** (+ 1981 servira pour un coffre).
     - ❌ « Une montre cassée ne dit rien. »
   - **INDICE MINEUR** : 1981 = millésime d'un coffre-fort. **INDICE MAJEUR** : 22h09, à retenir pour le twist.
   - Texte de sortie : « si la montre est sincère, voilà l'heure du crime, que personne n'a encore établie. »
3. **MINI-JEU `adn_analyse`** — relier 5 échantillons ; l'échantillon 5 (INCONNU) n'a aucune correspondance.
   - **INDICE MAJEUR** : tueur professionnel engagé de l'extérieur — un contrat, pas un crime passionnel.
4. *(bar, criminel)* Victor Krane, voix trop calme : « bu un verre à 18h… je rentrais chez moi. »
5. *(alley, femme-fatale)* Vivienne souffle le nom de Krane comme « le corbeau » — brouillage possible.
6. *(crimeScene, Wexford)* **MINI-JEU `coffre_code`** — le coffre familial : composer **1981** (récompense du joueur attentif).
   - **INDICE MAJEUR** : carnet de versements — Hale a payé Krane en plusieurs fois, dernière la veille du meurtre. Hale n'était pas le gardien… mais l'employeur.

### ACTE III — Phase 4A « Le Nœud » (narration, musique thème)

1. *(qg, Wexford)* Chronologie DES SUSPECTS : Rupert 21h→21h30, panne Pembrooke 22h, Hale retrouve le corps 23h. **LE TROU : personne ne sait quand la victime est morte. « À moins que votre montre… »**
2. **MINI-JEU `chronologie`** — reconstituer la soirée (la ligne « 22h09 » est marquée *votre découverte*).
   - **INDICE MAJEUR** : 22h09 est un fait que PERSONNE d'autre ne connaît — et l'alibi de Hale (22h) recouvre exactement ce créneau.
3. *(qg, Wexford)* **MINI-JEU `roue_alibis`** — aligner le cadran de la montre, l'alibi de la panne et l'horloge-mère sur 22h09.
   - **Texte pivot (twist)** : l'horloge-mère **corrobore la montre** : arrêtée net à 22h09. *L'heure du crime est établie* — un choc, pas un vol.

### ACTE III — Phase 4B « Tension » (dialogue, musique Rising Tension)

1. *(clandestine, Wexford)* Pembrooke et Vivienne se voient en secret ; la panne était-elle un mensonge ?
2. *(laboratoire, Dr Whitmore)* **MINI-JEU `sabotage`** — la durite sectionnée.
   - Texte : la panne offrait un alibi à Hale.
3. *(qg, Wexford)* **MINI-JEU `cablage_alarme`** *(alarm-circuit-blueprint.png.jfif)* — rétablir la boucle d'intégrité du circuit.
   - **INDICE MAJEUR** : l'alarme a été neutralisée de l'intérieur par quelqu'un qui connaissait le système (Hale). Pas d'effraction.
4. *(qg, Wexford)* **MINI-JEU `cable_match`** — fils de l'alarme + graffiti au charbon → écriture ≠ Hale.
   - Texte : Hale savait où et quand « dépanner » Pembrooke ; le graffiti n'est pas sa main.

### ACTE III — Phase 4C « Révélation » (dialogue, musique Act III Revelations)

1. *(crimeScene, criminel)* Krane avoue en partie : « je suis payé pour la violence. »
2. *(crimeScene, protecteur)* Hale se contredit : décrit la mare de sang trop précisément, porte verrouillée à son retour.
3. **CHOIX FINAL `accuser`** : protecteur / femme-fatale / seducteur / suspect / marginal / criminel.

### OUTRO « Épilogue » (généré par app.js selon `accuser`)

**Bonne accusation (protecteur)** — écran de victoire avec faisceau de preuves complet :

- Le Major Hale s'effondre : « Tout ça pour elle… mais elle ne m'a jamais aimé. »
- Victor Krane (la lame) avoue : « Le garde du corps m'a payé. »
- Lady Vivienne complice démasquée, Julian Pembrooke alibi tombé.
- Morale : « De l'amour à la folie criminelle, il n'y a qu'une obsession. »

**Mauvaise accusation** — chaque innocent a une réaction unique qui indique au joueur ce qu'il a manqué :

- **femme-fatale** : Vivienne éclate d'un rire amer. « Regardez plutôt Hale : ses dettes, ses versements à Krane, ce faux alibi de panne : c\'est lui qui l\'a monté. » → indices `mobile` + `alibi` manquants.
- **seducteur** : Pembrooke blêmit. « C\'est une erreur… J\'étais en panne ! La panne était un faux — mais moi je n\'était que l'alibi. » → indice `alibi` (sabotage) manquant.
- **suspect** : Rupert ricane. « J\'étais parti à 21h30, Silas peut confirmer. Ce n\'est pas moi qui ai sectionné la durite… ni payé Krane. » → indice `witness` (Silas) manquant.
- **marginal** : Silas secoue la tête. « J\'ai VU le rôdeur à 22h — suivez cette piste. » → indice `timeline` manquant.
- **criminel** : Krane sourit. « Je ne suis que le bras, inspecteur. La main, c\'est Hale — relisez les versements du coffre. » → indice `mobile` (coffre) manquant.
- **protecteur** : Le Major Hale s\'effondre. « Tout ça pour elle… but elle ne m\'a jamais aimé. » La vérité éclate : amour obsessionnel, Krane payé, Pembrooke alibi, crime maîtré. JUSTICE EST FAITE.

**Dans tous les cas d'échec** : le vrai coupable s'échappe, le joueur perd son badge, fin dépressive. Le faisceau de preuves (affiché à l'écran) montre exactement quelles catégories étaient insuffisantes.

---

## 5. ÉCONOMIE DES INDICES (design)

| Énigme | Type (phases.js) | Catégorie | Contenu | Payoff |
|---|---|---|---|---|
| Fouille de scène | `scene_fouille` | `forensic` | Préméditation + vol simulé + reçu V.K. | Cible l'entourage + Krane |
| Carnet déchiré | `carnet_dechire` | `mobile` | Versements à V.K. + empreintes | Mobile financier + preuves matérielles |
| Pression (Silas) | `pression` | `witness` | Rôdeur bien habillé à ~22h | Pointe Pembrooke/Hale |
| Verrou thermique | `labo_verrou` | `timeline` | Ouvert à la clé, 22h | Accès de Hale |
| ADN | `adn_analyse` | `forensic` | Tueur de contrat | Exclut crime passionnel |
| Montre (face) | `montre_code` | `timeline` | **Heure du crime 22h09** | Twist final |
| Montre (dos) | `montre_code` | — | Code 1981 | Coffre Acte II |
| Cryptogramme | `cryptogramme` | `mobile` | Note décodée : Hale engage Krane | Confirme le coffre |
| Coffre | `coffre_code` | `mobile` | Hale payait Krane en plusieurs fois | Lie le mobile |
| Chronologie | `chronologie` | `timeline` | Alibi Hale recouvre 22h09 | Twist final |
| Câblage alarme | `cablage_alarme` | `opportunity` | Alarme neutralisée de l'intérieur | Connaissance des lieux |
| Sabotage | `sabotage` | `alibi` | Durite sectionnée | Fausse panne = faux alibi |
| Câble/graphite | `cable_match` | `opportunity` | Graffiti ≠ main de Hale | Complicité de Pembrooke |
| Roue des alibis | `roue_alibis` | `timeline` | Alignement 22h09 + horloge-mère | Verrouille l'heure |

**Règle d'or** : aucune énigme n'est bloquante (bouton « Passer »). Chaque réussite affiche un panneau « 🔎 INDICE MAJEUR » bien visible — résoudre doit donner un avantage réel.

---

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

(End of file - total 223 lines)