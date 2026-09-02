# TRUE DETECTIVE — Scénario V2 (Fil conducteur complet)

> **Objectif** : sortir d'une trame trop linéaire, densifier les dialogues, structurer tout le
> jeu en **phases fixées de 3 pages**, compléter **l'Acte 3 (climax + 2 rebondissements)** et
> toutes les **fins (bonne + alternative)**. Ce fichier sert de fil conducteur avant implémentation.

---

## 1. RÈGLES STRUCTURELLES FIXES

- Chaque **phase** contient exactement **3 pages**, quel que soit son type.
- Après une phase de **narration** vient toujours une phase de **jeu** (et inversement), jusqu'à la fin.
- **Musique de narration** = toujours la musique du thème/univers choisi à la config (pour toute la run). Ex :
  - cyberpunk → `univers/cyberpunk.mp3`
  - heroic fantasy → `univers/heroic fantasy.mp3`
  - film noire → `univers/noire.mp3` *(asset existant)*
  - sci-fi → `univers/SF.mp3`
  - antiquité (péplum) → **à confirmer** (`gaginator.mp3` manquant dans le dossier univers — à ajouter)
  - agatha christie → `univers/noire.mp3`
  - sherlock holmes → `univers/sherlock.mp3`
  - lovecraft → `univers/peur.mp3` *(actuellement dupliqué dans phases — à copier dans univers)*
- **Musique de phase** (fixe) :
  - Phase RECHERCHE → `phases/recherche.mp3`
  - Phase RÉFLEXION → `phases/reflexion.mp3`
  - Phase ÉNIGME → `phases/enigme.mp3`
  - Phase RISING TENSION → `phases/Rising Tension.mp3`
  - Phase ACT3/RÉVÉLATION → `phases/Act III Revelations.mp3`
  - Générique → `phases/generique.mp3`
- **Règle clé** : dès que l'on charge la 1ère page narration d'un nouvel acte, la musique de la phase précédente se coupe et on passe à la nouvelle musique.
- Décors et personnages : tout le nécessaire existe dans `assets/image true detective/{lieux,characteres,univers}`.
- **Choix du prochain suspect** en fin d'INTRO (page 3 de la phase 1B) → **mémoriser** et réutilisé en phase 2A page3 et phase 2B (ordre d'interrogation).

---

## 2. ROSTER DES PERSONNAGES (rôle / mobile / secret / alibi)

| Personnage | Rôle | Mobile (plausible) | Secret | Alibi |
|---|---|---|---|---|
| Détective Partenaire | Allié, oracle | — | A confiance, guide du joueur | — |
| Le Protecteur (garde du corps) | Main | Obsession amoureuse de la Femme Fatale + fortune/assurance/bijoux | ⭐ COUPABLE (maître d'œuvre) | "avec le séducteur" — MAIS panne sabotée (faux alibi) |
| La Femme Fatale | Ex-amante / amante | Héritage (testament) | Aime/voit encore le séducteur ; reçoit des menaces du Protecteur | — |
| Le Sédуcteur | Ami de la victime | Relation avec la Femme Fatale, veut la fortune | Voit en secret la Femme Fatale ; panne pas accidentelle | Panne (~20h) aidé du Protecteur |
| Le Suspect | Homme d'affaires débiteur | Dettes envers la victime | Devrait énormément ; serait parti avant 20h | 19h→19h30 (témoin : Marginal, pièce) |
| Le Marginal | SDF / ancien cambrioleur de la ruelle | Néant (fausse piste) | Casier judiciaire cambriolage | Sur place, mendiait ; pièce de la victime puis du Suspect |
| Le Criminel | Tueur à gage, l'ombre | Payé — vrai mobile | Le "rôdeur" vu par le Marginal | 18h verre avec la victime au bar |
| Le Scientifique | Expert (labo) | — | Révélations ADN | — |

---

## 3. ARCHITECTURE D'ENSEMBLE (vue d'ensemble)

* [N] = narration (musique thème), [J] = jeu (musique de phase), [REV] = révélation (musique Act III), [RT] = rising tension (musique RT), [G] = générique, [O] = outro (musique thème)

```
INTRO
  Phase 1A  [N]  Narration d'ouverture ..... musique thème     3 pages
  Phase 1B  [J]  RECHERCHE .............. recherche.mp3        3 pages (choix du suspect mémorisé)
ACTE 1
  Phase 2A  [N]  Narration acte1 ......... musique thème       3 pages
  Phase 2B  [J]  RÉFLEXION .............. reflexion.mp3        3 pages
ACTE 2
  Phase 3A  [N]  Narration acte2 ......... musique thème       3 pages
  Phase 3B  [J]  ÉNIGME ................. enigme.mp3           3 pages
ACTE 3  (le climax)
  Phase 4A  [N]  Narration acte3 ......... musique thème       3 pages
  Phase 4B  [RT] RISING TENSION .......... Rising Tension     3 pages
  Phase 4C  [REV] ACTE3 RÉVÉLATION ....... Act III Revelations 3 pages  ← CHOIX DU COUPABLE p3
OUTRO + FIN
  Phase 5A  [O]  Narration outro ......... musique thème       3 pages  (dépend du choix)
  Page fin  [G]  Générique ............... generique.mp3       1 page
```

Total ≈ 2 + 2 + 2 + 3 phases + 1 générique = **9 phases de 3 pages + 1 page** = **28 pages** minimum.

> **VÉRITÉ (fixe par design)** : le coupable est **LE PROTECTEUR**, maître d'œuvre.
> Le **CRIMINEL** est le bras armé / la "lame" qui a tué physiquement à 20h12 (ADN inconnue sur la scène).
> Tous les autres sont des innocents qui peuvent être accusés à tort.

---

## 4. INTRO

### Phase 1A — NARRATION D'OUVERTURE (musique thème)
**P1** — *Connaître l'univers*.
Fond = image **univers**. Voix-off. Présentation de l'univers (issue du descriptif univers.txt, adapté au thème) + "Une affaire de taille vous attend : le crime d'un magnat de l'immobilier retrouvé sans vie dans son appartement." Choix : [Continuer].

**P2** — *la découverte de la scène de crime*.
Fond = **Scène-du-Crime** (utiliser le descriptif lieux #1). Narration illustrant la pièce, l'appartement retourné, le coffre, et un exterior du manoir de la victime. "Vous êtes sur le lieu du drame." Choix : [Entrer / Inspecter].

**P3** — *arrivée du Détective Partenaire*.
Fond = **Scène-du-Crime**, personnage = **Détective Partenaire**, apparaît en bord. Dialogue (enrichi) : il nous informe que la victime est un **riche magnat de l'immobilier** ; 1 seule personne a découvert le cadavre : **LE PROTECTEUR**, son garde du corps. Base d'enquête posée.

### Phase 1B — JEU "RECHERCHE" (musique `recherche.mp3`)

**P1** — *réel début de l'enquête sur la scène*.
Fond **Scène-du-Crime**, personnage = **Détective Partenaire** (+ notre "on constate"). Dialogue interactif : on récolte des indices en discutant / interrogeant :
  1. Victime = magnat immobilier (confirmé).
  2. Le **Protecteur** a trouvé le corps en rentrant à **21h** ; il était **allé dépanner le Séducteur** (en panne).
  3. En discutant avec discernement : la **montre** de la victime s'est brisée **dans la chute** → **s'arrête à 20h12** (indice clé : heure de la mort).
  4. En discutant davantage : la victime **entretenait une relation** avec la **Femme Fatale**.
→ Plusieurs choix de questions (chacune révèle un indice). Fin de page : on décide de pousser les questions.

**P2** — *interrogation du PROTECTEUR*.
Fond **Scène-du-Crime**, personnage = **Le_Protecteur**. Il raconte (dialogue enrichi) :
  - Part à 20h pour dépanner le Séducteur, revient à 21h.
  - À son retour, la victime gisait au sol, mare de sang, appartement cambriolé, coffre-fort **VIDÉ**.
  - Indice : lors du dialogue, nous apprenons qu'un ami de la victime, **LE SUSPECT**, était **présent à 19h** au domicile.
  - Précision : le Suspect **doit beaucoup d'argent** à la victime.
  - Le Protecteur a donc un **alibi** : il était avec le Séducteur.

**P3** — *retour au Détective Partenaire : synthèse*.
Fond **Scène-du-Crime**, personnage = **Détective Partenaire**. Il synthétise :
  - Protecteur a pour l'instant un alibi.
  - 3 nouvelles personnes à interroger : **LE SUSPECT**, **LE SÉDUCTEUR**, **LA FEMME FATALE**.
→ **CHOIX DU PROCHAIN SUSPECT** (mémorisé) : [Femme Fatale] / [Séducteur] / [Suspect].
*FIN de l'INTRO.*

---

## 5. ACTE 1

### Phase 2A — NARRATION ACTE1 (musique thème ; la musique `recherche` se coupe dès la P1)

**P1** — *la ruelle*.
Fond = **Le-Quartier-Sombre-La-Ruelle** (descriptif #3). Narration d'ambiance (brume, une pièce, éclairage faible). "Vous prenez une lane par la ruelle pour rejoindre la résidence du Suspect." Choix : [Avancer].

**P2** — *le Marginal*.
Fond = **La-Ruelle**, personnage = **Le_Marginal** (son image devant le décor). Interrogatoire (dialogue enrichi) :
  - Il a vu **UN RÔDEUR** dans le coin **vers 20h** (pas vu le visage).
  - Il était là, assis, à faire la manche ; la victime **lui a donné une pièce**.
  - Il n'en sait pas plus (peu de détails).
  - "Si j'ai vu le Séducteur ? Oui, il passe son temps au **bar**." → Introduction du Séducteur.

**P3** — *à la résidence du Suspect — premier suspect selon le choix mémorisé*.
Fond = **La-Résidence-du-Suspect** (descriptif #5). Le personnage qui apparaît est **celui choisi à l'INTRO P3** :
  - Soit la **Femme Fatale** ; soit le **Séducteur** (décor note : un bar → **Le-Lieu-Public**) ; soit le **Suspect** (décor lieu clandestin → **Le-Lieu-Clandestin**).
Dialogue (bref) présentant les mobiles des 3 :
  - **Femme Fatale** : sur le **testament**, va hériter d'une bonne partie de la fortune.
  - **Séducteur** : ami de la victime, mais si on interroge le Suspect, on apprend qu'il a une relation avec la Femme Fatale.
  - **Suspect** : de gros **problèmes d'argent**, devait beaucoup à la victime.

### Phase 2B — JEU "RÉFLEXION" (musique `reflexion.mp3`)

> **Ordre d'interrogation** : dépend du choix du joueur à la phase 1B P3. Ex : si le prochain est le Suspect → P1=Suspect, P2=Femme Fatale, P3=Séducteur ; et ainsi de suite, en faisant le tour.

**P1** — *interrogation du PREMIER suspect* (selon choix mémorisé).
Décor selon personnage (voir plus haut). Dialogue enrichi où chacun **accuse les autres** :
  - **Femme Fatale** : "Le Suspect doit une fortune à la victime. Et la pauvre victime recevait des **menaces de mort**. Oui, j'étais sur place la veille — j'étais l'amante."
  - **Séducteur** : "Le Suspect doit de l'argent, c'est connu de tous."
  - **Suspect** : "Le Séducteur et la Femme Fatale **ont une relation** ; ils auraient voulu se débarrasser de la victime pour l'héritage. Moi j'ai vu la victime à 19h, 30 minutes, puis je suis sorti. Mon témoin : j'ai donné une pièce au Marginal."

**P2** — *interrogation du SECOND suspect*.
Même principe, décor adapté, nouveaux thèmes d'accusation. Chacun creuse, chacun a un témoin ou une excuse. Le ton s'assombrit.

**P3** — *interrogation du TROISIÈME suspect*.
Accusations croisées. Le **Suspect** offre un témoin (le Marginal) pour 19h30. La **Femme Fatale** insiste sur les menaces. Le **Séducteur** sur son alibi (panne). Fin de phase dans le questionnement — aucune conviction parfaite.

*FIN ACTE 1.*
| Le Criminel | Tueur à gage, l'ombre | Payé — vrai bouclier | Le "rôdeur" vu par le Marginal | 18h verre avec la victime au bar |
| Le Scientifique | Expert (labo) | — | Révélations ADN | — |

> **VÉRITÉ (fixe par design)** : le coupable est **LE PROTECTEUR**, maître d'œuvre.
> Le **CRIMINEL** est le bras armé / la "lame" qui a tué physiquement à 20h12 (ADN inconnue sur la scène).
> Tous les autres sont des innocents que l'on peut accuser à tort.

---

## 6. ACTE 2

### Phase 3A — NARRATION ACTE2 (musique thème)

**P1** — *le Bureau / Quartier Général (QG)*.
Fond = **Le-Bureau-Quartier-Général** (descriptif #2), personnage = **Détective Partenaire**. Il nous informe :
  - Le **Scientifique** est passé sur les lieux du crime, il aurait des infos.
  - En discutant avec lui : le **Marginal a un casier judiciaire de cambrioleur** (révélé+, neutraliser).

**P2** — *le Scientifique au laboratoire*.
Fond = **Le-Laboratoire-L_Atelier** (descriptif #5), personnage = **Le_Scientifique**. Révélations clés :
  - L'assassin est *probablement* un **homme** (violence du meurtre).
  - **ADN retrouvée (plusieurs)** :
    - ADN **Femme Fatale** (amante → ne prouve rien).
    - ADN **Séducteur** (ami, déjà invité → rien).
    - ADN **Protecteur** (employé, a découvert le corps → rien).
    - ADN **Suspect** (n'a pas nié être passé à 19h pour affaires/business, serait parti avant 20h avec témoin).
    - → **ADN INCONNUE** (= le Criminel ; possible rôdeur vu par le Marginal).

**P3** — *retour à la ruelle*.
Fond = **La-Ruelle**. Nous sommes **en route pour ré-interroger le Marginal**. Narration transitive (la piste de l'ADN inconnue + le rôdeur nous assaille...). Choix : [Rendre au Marginal] / [Noter quelque chose].

### Phase 3B — JEU "ÉNIGME" (musique `enigme.mp3`)

**P1** — *ré-interrogation du MARGINAL*.
Fond = **La-Ruelle**, personnage = **Le_Marginal**.
  - Il ne nie pas le **casier de cambrioleur** mais jure qu'il est innocent POUR CE CRIME.
  - On lui dit qu'on a retrouvé son ADN : "La victime m'a donné une pièce."
  - On lui demande : te souviens-tu du **Suspect** qui t'aurait donné une pièce ? "Oui, c'était **entre 19h et 20h** (cohérent avec 19h30)."
  - Et il apporte l'élément clé : "Il y avait **un homme patibulaire et peu rassurant** qui rôdait dans le quartier." → **LE CRIMINEL** (nom dévoilé).

**P2** — *le Séducteur au bar / puis LE CRIMINEL*.
Fond = **Le-Lieu-Public** (bar), personnage = **Le_Séducteur**.
  - Sur son ADN : "Je suis l'ami de la victime, j'ai un **alibi** : j'étais en panne, le Protecteur en témoigne."
  - Puis : on remarque **quelqu'un au bar** correspondant à la description du rôdeur (= **Criminel**). On décide de l'interroger. Le personnage passe à **Le_Criminel**, même décor bar :
    - Il reconnaît avoir été dans le quartier et avoir croisé le Marginal.
    - "Oui, je connais la victime — on se voyait des fois au bar."
    - "On a même bu un verre ensemble à **18h**, le barman peut confirmer. Je rentrais simplement chez moi."
    - → Alibi (18h) mais peut-être mensonge ? Gout de moût. Possibilité de choix.

**P3** — *la ruelle, croise la FEMME FATALE*.
Fond = **La-Ruelle**, personnage = **La_Femme_Fatale**. Elle allait au bar (peut-être rejoindre le Séducteur — indice romance). Elle nous dit :
  - La victime **recevait des menaces de mort**.
  - "Le **Criminel**, pourrait **être le corbeau** derrière tout ça."
  - Question : essaie-t-elle de **brouiller les pistes** pour s'innocenter ?
→ FIN ACTE 2. La musique revient sur le thème à l'arrivée de l'ACTE 3.

---
## 7. ACTE 3 — LE CLIMAX (à compléter entièrement)

> 2 **rebondissements** nécessaires : (1) l'effondrement du faux alibi ; (2) la véritable
> révélation. La progression :

### Phase 4A — NARRATION ACTE3 (musique thème)
**P1** — *QG : synthèse + scènes de suspens*.
Fond **Le-Bureau-QG**, personnage = **Détective Partenaire**. Il résume tous les indices et note les pistes troublantes. On pose les questions. Il ajoute : "Tout le monde a un alibi, tout le monde a un mobile. On approche." Choix : [Approfondir la chronologie].

**P2** — *la chronologie flâche*.
Fond **La-Ruelle** ou **QG**. Révélation de la **faille** : 19h (Suspect) → 19h30 (suspect, témoin) → 20h12 (**montre brisée = meurtre**) → 20h (panne Séducteur) → 21h (Protecteur retrouve).
Lacune : l'alibi du Protecteur (20h) recouvre TRÈS près l'heure de la mort (20h12). Premier doute. Choix : Insister.

**P3** — *vers la confrontation*.
Fond **Le-Bureau-QG** ou **Scène-du-crime**. Narration tendue : "Tuons le meurtrier... le bras armé est dans la main. Il ne reste plus qu'à confronter." Choix : [Avancer à la confrontation].

### Phase 4B — JEU "RISING TENSION" (musique `Rising Tension.mp3`)
**P1** — *tout le monde se rassemble / stake-out*.
Fond **Le-Lieu-Public-Le-Point** (bar). On surveille chacun des suspects au travers de la journée. Tension montante. Chacun peut se faire détacher. Options de qui surveiller.

**P2** — *la double-vie révélée*.
Fond **Le-Lieu-Clandestin** (cachette). On prend à l'improviste **LE SÉDUCTEUR et LA FEMME FATALE** se retrouvant **en secret** dans la cachette. Excuse :
  - Le "dépannage" du Séducteur ? Il était en fait **en bonne compagnie** avec elle (rendez-vous secret).
  - La panne n'a **PAS** été fortuite... ? Ou vraiment ? Ambiguïté.
→ Indice : le Séducteur a un mobile + une excuse dissimulée. Mais quelqu'un d'autre a réagi... Tension.

**P3** — *l'étau se resserre*.
Fond **Scène-du-crime** ou **QG**. Le Détective Partenaire présente les deux grandes pistes. Il faudra **trancher**. Choix : [Accuser maintenant] (→ la phase 4C) ; [Révéler la vérité qu'à l'acte 4C].

### Phase 4C — JEU/RÉVÉLATION "ACTE3 — RÉVÉLATION" (musique `Act III Revelations.mp3`)

**P1** — *rère interrogation du PROTECTEUR*.
Fond **Scène-du-crime**, personnage = **Le_Protecteur**. Sous la pression, il se contredit : trop de détails sur le crime. Il craque à demi. Il désigne le Suspect et la Femme Fatale. Mais une disposition trahit.
=> Pose les questions (pas de choix d'issue encore).

**P2** — *REBONDISSEMENT 1 — la panne sabotée*.
Fond **QG**, personnage = **Détective Partenaire** + **Scientifique** (papel). Le mécanicien a un rapport : la panne du Séducteur n'était **PAS naturelle** — quelqu'un a **saboté la voiture**. Qui ?
- Le Séducteur a un alibi *imparfait*. Mais si l'on creuse LE PROTECTEUR, qui était "là pour l'aider", l'événement du dépannage devient... **suspect**.
→ Rebondissement (1er) : l'alibi du Protecteur est **un faux alibi fabriqué**.

**P3** — *REBONDISSEMENT 2 — l'amour + le tueur à gages*.
Fond **QG** ou **Scène-du-crime**. La **Femme Fatale**, dans le coin (elle était là par hasard ?) se déferle : elle révèle le côté du Protecteur :
- Elle révèle qu'il la **poursuivait / menaçait** depuis des mois ; il était **amoureux** d'elle insensément.
- Le **Criminel**, sous la contrainte (ou trahi), confesse : il a été **payé par "le garde du corps"** pour l'ombre du drame, et pour **perpétrer le meurtre physique** (violence = homme).
- Les **ADN inconnues** = la main du Criminel ; la montre à 20h12 date le meurtre, l'appartement cambriolé + coffre vidé = "vol" simulé pour égarer la piste.
=> **TOUT CONCORDE. La vérité : LE PROTECTEUR est le coupable (maître d'œuvre), le Criminel la lame.**
- **CHOIX DU COUPABLE** (page 3) — 6 options :
  1. **LE PROTECTEUR** ✅ (bonne réponse)
  2. La FEMME FATALE
  3. Le SÉDUCTEUR
  4. Le SUSPECT
  5. Le MARGINAL
  6. Le CRIMINEL
---

## 8. FINS — OUTRO (3 pages si bonne / 3 pages si mauvaise) + GÉNÉRIQUE

### BONNE FIN — Accuser **LE PROTECTEUR** ✅
Phase 5A (3 pages, musique de thème) :
- **P1** : la dégradation du Protecteur. Il **avoue** dans une scène au QG/scène-du-crime. "Tout ça pour elle... elle ne m'a jamais aimé." Il est maîtrisé.
- **P2** : **en prison** (décor = prison / fin de la salle des interrogatoires). Le Détective Partenaire récapitule la solution complète (méthode, mobile, maître d'œuvre + la lame).
- **P3** : **promotion** au QG (`Bureau-QG`). Nous recevons une **médaille de détective supérieur**. Retrouvailles de la Femme Fatale (libre/innocente) et du Séducteur qui peuvent vivre ensemble. Clôture chaleureuse.
- **Générique** (`generique.mp3`).

### MAUVAISES FINS (choisir un innocent → LE PROTECTEUR s'échappe)
Cadre commun (phase 5A, musique thème) :
- **P1** : la raison nous échappe → le Détective Partenaire mélancolique ; **la/le personne accusé innocent** relâché(e). La recherche se réduit.
- **P2** : le véritable coupable **PROTECTEUR** a **pris la fuite avec l'argent + les bijoux + assurance**, roule vers l'étranger (soleil). Révélation.
- **P3** : **perte de notre badge + dépression**. Portrait sombre, caméra qui se détourne.
Variantes (selon l'innocent accusé) :
1. **Accuser la FEMME FATALE** : elle était prête à s'enfuir seule, mais sera retenue jusqu'à ce qu'on découvre son innocence. Le vrai coupable s'enfuit. "Moral : l'homme est un loup pour l'homme et souvent pour la femme aussi."
2. **Accuser le SÉDUCTEUR** : la Femme Fatale le venge et l'enterre ; le Protecteur s'échappe au soleil. "Moral : l'homme est un loup pour l'homme et la femme aussi."
3. **Accuser le SUSPECT** : il avait de grosses dettes, mais il échappe à l'accusation ; le vrai coupable s'enfuit ; le Suspect est innocent. Variante : il **revend les bijoux** pour rembourser + payer le Criminel (si celui-ci n'est pas en prison).
4. **Accuser LE MARGINAL** : il est relâché (toujours innocent), mais dans l'écho : le vrai coupable s'échappe avec l'argent + bijoux ; le Marginal retourne à la manche. "Il s'échappe avec l'argent des bijoux."
5. **Accuser le CRIMINEL** : il avoue être la lame, mais pas le maître d'œuvre ; on l'enferre, pourtant LE PROTECTEUR, le cerveau, disparaît avec le pactole. Double défaite.

> La "vérité dérangeante" + amour + mensonges → inspiré de *Usual Suspects*, *Reservoir Dogs*, un trait *Noir*.

---

## 9. NOTES D'IMPLÉMENTATION (pour le code)

- **État / Choix mémorisés** : `prochainSuspect` (choix INTRO P3) ; `suspectOrdre` (rotation de l'acte1) ; `coupableChoisi` (acte3 P3) ; `indicesDecouverts` (liste) ; `themeChoisi` (musique univers).
- **Musique** : un assistant `loadMusic(chemin, loop)` réutilisant `music-player.js` ; à chaque changement de phase, stop + nouveau. La musique de narration reste la même sur toute la run (pas de boucle de changement).
- **SuspectOrdre** : si P1 INTRO = Suspect → Ordre [Suspect, Femme, Séducteur] ; si = Femme → [Femme, Séducteur, Suspect] ; si = Séducteur → [Séducteur, Suspect, Femme].
- **Décor selon suspect** : Suspect→Lieu-Clandestin ; Femme→Résidence ; Séducteur→Lieu-Public (bar).
- **Données** : tout le dialogue/choices/musique/décors/personnages des phases dans une constante `SCENARIO` (data-driven), pas de code en dur répété. La décision "coupable" = la bonne = `LE PROTECTEUR`.

## 10. À VALIDER / DÉCISIONS OUVERTES
- [ ] Vérifier la musique peur.mp3 pour lovecraft dans `univers/` (ou la dupliquer).
- [ ] Créer/ajouter `univers/gaginator.mp3` pour péplum (actuellement on assigne `SF` ou autre).
- [ ] Confirmer : l'ADN "inconnue" du Criminel et la relation amour Protecteur/Femme vous conviennent — à réviser si besoin.
- [ ] Acte 3 : on peut vouloir être flexible sur le vrai coupable (`Protecteur`) ; à vos retours pour éventuellement varier la fin.