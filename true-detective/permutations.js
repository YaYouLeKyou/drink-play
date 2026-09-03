/* =====================================================================
   TRUE DETECTIVE — PERMUTATIONS (variations rejouables du scenario)
   Chaque permutation = un coupable maitre d'oeuvre + co-complice + fausse
   piste + lame, avec textes de fouille (8 zones) et indices de mini-jeux.
   La structure des phases est IDENTIQUE (fixe). Le pont
   tools/generate-permutation.js injecte ces textes dans phases.js +
   scenario.js pour rendre la permutation jouable.
   ===================================================================== */
(function (global) {
    'use strict';

    var PERMUTATIONS = {};

    /* ===== DEFAUT / CANONIQUE — Major Hale ===== */
    PERMUTATIONS['protecteur'] = {
        id: 'protecteur',
        coupable: { fr: 'Le Major Hale', en: 'Major Hale' },
        coComplice: { fr: 'Victor Krane (la lame)', en: 'Victor Krane (the blade)' },
        faussePiste: { fr: 'Julian Pembrooke', en: 'Julian Pembrooke' },
        lame: { fr: 'Victor Krane', en: 'Victor Krane' },
        heure: '22:09',
        mobile: { fr: 'Amoureux obsessionnel de Lady Vivienne, il a fait executer le meurtre pour l assurance et les bijoux, croyant la conquerir.', en: 'Hopelessly in love with Lady Vivienne, he had the murder carried out for the insurance and jewels, believing it would win her.' },
        alibi: { fr: 'Il pretendait depanner Pembrooke en panne a 22h - mais la montre et l horloge-mere le placent sur les lieux au moment du choc.', en: 'He claimed to be helping Pembrooke\'s breakdown at 10pm - but the watch and the mother clock place him on scene at the moment of the blow.' },
        fouille: [
            { label: '1', info: { fr: 'Un cachet de cire intact. Personne n a force le bureau : l assassin connaissait la maison ou y avait acces.', en: 'An intact wax seal. No one forced the desk : the killer knew the house or had access to it.' } },
            { label: '2', info: { fr: 'La carafe renversee. DEUX verres ont ete utilises : la victime attendait quelqu un en qui elle avait confiance.', en: 'The overturned decanter. TWO glasses were used : the victim was expecting someone they trusted.' } },
            { label: '3', info: { fr: 'Un livre de comptes tache de sang. Plusieurs pages d impayes arrachees : celles qui mentionnaient les dettes de Hale.', en: 'A blood-stained ledger. Several debt pages torn out : the ones mentioning Hale\'s debts.' } },
            { label: 'A', info: { fr: 'Sous l encrier renverse, une lettre a moitie brulee : des menaces redigees d une ecriture elegante.', en: 'Under the overturned inkwell, a half-burned letter : threats in an elegant hand.' } },
            { label: 'C', info: { fr: 'L autre encrier est intact et la plume seche : on a ecrit ici AVANT le meurtre, pas apres.', en: 'The other inkwell is untouched and the pen dry : writing happened here BEFORE the murder.' } },
            { label: '4', info: { fr: 'Un fauteuil renverse pres de la fenetre : la lutte a ete breve, loin du bureau.', en: 'An overturned chair by the window : the struggle was brief, away from the desk.' } },
            { label: '5', info: { fr: 'La mare de sang, la victime face a son effigie, aucune trace de defense : elle connaissait son agresseur.', en: 'The pool of blood, the victim facing his portrait, no trace of defense : he knew his attacker.' } },
            { label: '6', info: { fr: 'Pres de la main : un recu froisse signe V.K. - une forte somme en especes.', en: 'Near the hand : a crumpled receipt signed "V.K." - a large sum in cash.' } }
        ],
        fouilleClue: { fr: 'Un proche de confiance, deux verres, des dettes effacees, une ecriture elegante et un recu signe V.K. Le meurtre etait prevu - le vol, simule.', en: 'A trusted close one, two glasses, erased debts, elegant handwriting and a receipt signed "V.K.". The murder was planned - the robbery, staged.' },
        clues: {
            carnet_dechire: { fr: 'Le carnet reconstitue revele des versements reguliers a V.K. (Victor Krane). Le mobile financier de Hale est etabli.', en: 'The rebuilt ledger reveals regular payments to V.K. (Victor Krane). Hale\'s financial motive is proven.' },
            pression: { fr: 'Silas Crane a vu un rodeur bien habille vers 22h - ressemble a Pembrooke, mais la panne etait une couverture.', en: 'Silas Crane saw a well-dressed lurker around 10pm - looks like Pembrooke, but the breakdown was a cover.' },
            labo_verrou: { fr: 'Le verrou s est ouvert avec une cle, pas force : acces au trousseau du garde du corps Hale. Chaleur datee 22h.', en: 'The lock opened with a key, not forced : access to bodyguard Hale\'s keys. Heat dated 10pm.' },
            montre_code: { fr: 'INDICE MINEUR : 1981 (coffre). INDICE MAJEUR : l aiguille figee a 22h09 - l heure du crime. Retenez-la.', en: 'MINOR : 1981 (safe). MAJOR : the hand frozen at 10:09pm - the time of death. Remember it.' },
            coffre_code: { fr: 'Le carnet du coffre (code 1981) : Hale payait Victor Krane en plusieurs fois, dernier paiement la veille du meurtre.', en: 'The safe ledger (code 1981) : Hale paid Victor Krane in installments, last one the day before the murder.' },
            chronologie: { fr: 'La chronologie revele le trou : Hale pretendait etre en panne a 22h, mais le verrou et le rodeur le placent sur les lieux. Son alibi s effondre.', en: 'The timeline reveals the gap : Hale claimed to be broken down at 10pm, but the lock and the prowler place him on scene. His alibi collapses.' },
            roue_alibis: { fr: 'Les trois horloges s accordent sur 22h09 : l alibi de panne de Hale est pulverise. Le dossier est verrouille.', en: 'The three clocks agree on 10:09pm : Hale\'s breakdown alibi is shattered. The case is sealed.' }
        }
    };
    /* ===== PERMUTATION 1 - Lady Vivienne (maitresse d'oeuvre) ===== */
    PERMUTATIONS['femme-fatale'] = {
        id: 'femme-fatale',
        coupable: { fr: 'Lady Vivienne', en: 'Lady Vivienne' },
        coComplice: { fr: 'le Major Hale (l amoureux manipule)', en: 'Major Hale (the manipulated lover)' },
        faussePiste: { fr: 'Julian Pembrooke (la fausse panne)', en: 'Julian Pembrooke (the staged breakdown)' },
        lame: { fr: 'Victor Krane', en: 'Victor Krane' },
        heure: '22:09',
        mobile: { fr: 'Heritiere designee, elle apprend que la victime la RAYE du testament. Pour garder la fortune et sa liberte, le vieux doit mourir ce soir-la.', en: 'The named heiress, she learns the victim is CUTTING her from the will. To keep the fortune and her freedom, the old man must die that very night.' },
        alibi: { fr: 'Je passais la soiree au theatre. Mais la montre figee a 22h09 et l horloge-mere la placent dans la chambre au moment du choc.', en: 'I spent the evening at the theatre. But the watch frozen at 10:09pm and the mother clock place her in the room at the moment of the blow.' },
        fouille: [
            { label: '1', info: { fr: 'Bureau non force, cachet de cire entier. L assassin avait une cle ou le regard de quelqu un qu on laissait entrer sans sonner.', en: 'Desk unforced, wax seal intact. The killer had a key or the look of someone let in without knocking.' } },
            { label: '2', info: { fr: 'La carafe renversee. DEUX verres, dont la trace pale d un rouge a levres rose. La victime a installe quelqu un en face de soi.', en: 'The overturned decanter. TWO glasses, one with the faint trace of pink lipstick. The victim sat someone across from himself.' } },
            { label: '3', info: { fr: 'Le registre tache : non des dettes, mais un CO DICILLE testamentaire date du mois, qui rayait l heritiere au profit d un neveu. Jamais signe.', en: 'The stained ledger : not debts, but a testamentary CO DICIL dated this month, cutting the heiress in favor of a nephew. Never signed.' } },
            { label: 'A', info: { fr: 'Sous l encrier renverse, une lettre a moitie consume, des menaces. Une ecriture feminine, elegante, trop nette pour etre de panique.', en: 'Under the overturned inkwell, a half-burned letter, threats. A feminine, elegant hand, too neat to be panic.' } },
            { label: 'C', info: { fr: 'L autre encrier est intact, la plume seche depuis des heures. On a ecrit ici AVANT le meurtre, posement. Une mise en scene preparee.', en: 'The other inkwell is untouched, the pen dry for hours. Writing happened here BEFORE the murder, calmly. A staged scene.' } },
            { label: '4', info: { fr: 'Pres de la fenetre, un fauteuil bascule. La lutte fut breve, a distance d un verre offert - un sursaut de surprise, pas de peur.', en: 'By the window, a chair topples. The struggle was brief, within reach of an offered glass - a start of surprise, not fear.' } },
            { label: '5', info: { fr: 'La mare de sang, la victime face a son effigie, sans une egratignure de defense. Il a regarde la mort arriver par une porte qu il avait ouverte.', en: 'The pool of blood, the victim facing his portrait, not a scratch of defense. He watched death arrive through a door he had opened.' } },
            { label: '6', info: { fr: 'Pres de la main, un recu froisse : une forte somme en especes, signee V.K. Pas un creancier qu on menace - un homme qu on paye.', en: 'Near the hand, a crumpled receipt : a large sum in cash, signed V.K. Not a creditor you threaten - a man you pay.' } }
        ],
        fouilleClue: { fr: 'Une femme qu il a fait asseoir, un testament qui la rayait, une ecriture trop soignee et une main qui a paye un tueur. Le vol etait un decor - le rouge a levres, on ne l efface pas en tirant le rideau.', en: 'A woman he sat down, a will that cut her, too-neat handwriting and a hand that paid a killer. The robbery was decoration - lipstick does not come off by drawing the curtain.' },
        clues: {
            carnet_dechire: { fr: 'Le carnet rapporte un versement regulier a V.K. ET la mention d un codicille testamentaire : Vivienne etait sur le point d etre desheritee.', en: 'The ledger shows a regular payment to V.K. AND mention of a testamentary codicil : Vivienne was about to be disinherited.' },
            pression: { fr: 'Le rodeur bien habille vers 22h ressemble a Pembrooke, mais il a ete paye pour etre la : l homme qui a fait disparaitre sa voiture est Hale, pour Vivienne.', en: 'The well-dressed lurker around 10pm looks like Pembrooke, but he was put there : the man who made his car vanish is Hale, for Vivienne.' },
            labo_verrou: { fr: 'Le verrou s est ouvert avec une cle, pas force : la main qui a neutralise l alarme et ouvert est celle du garde du corps Hale - agissant pour Vivienne.', en: 'The lock opened with a key, not forced : the hand that disabled the alarm and opened is bodyguard Hale\'s - acting for Vivienne.' },
            montre_code: { fr: 'INDICE MINEUR : 1981 (coffre). INDICE MAJEUR : l aiguille figee a 22h09. L alibi de theatre de Vivienne s effondre sur cet horaire.', en: 'MINOR : 1981 (safe). MAJOR : the hand frozen at 10:09pm. Vivienne\'s theatre alibi collapses on that hour.' },
            coffre_code: { fr: 'Le carnet du coffre (code 1981) : les versements a V.K. portent pour ordre Estate de Lady Vivienne - elle regissait les paiements.', en: 'The safe ledger (code 1981) : the payments to V.K. are ordered from "Estate of Lady Vivienne" - she controlled the payments.' },
            chronologie: { fr: 'La chronologie aligne l alibi de theatre de Vivienne a 22h09 : impossible d etre en coulisses et dans la chambre a la fois. Elle se contredit.', en: 'The timeline sets Vivienne\'s theatre alibi against 10:09pm : impossible to be backstage and in the room at once. She contradicts herself.' },
            roue_alibis: { fr: 'Les trois horloges s accordent sur 22h09 : l alibi de theatre de Vivienne est pulverise par l horloge-mere. Le dossier est verrouille.', en: 'The three clocks agree on 10:09pm : Vivienne\'s theatre alibi is shattered by the mother clock. The case is sealed.' }
        }
    };
    /* ===== PERMUTATION 2 - Victor Krane (maitre d'oeuvre) ===== */
    PERMUTATIONS['criminel'] = {
        id: 'criminel',
        coupable: { fr: 'Victor Krane', en: 'Victor Krane' },
        coComplice: { fr: 'Rupert Blackwood (debiteur accule)', en: 'Rupert Blackwood (cornered debtor)' },
        faussePiste: { fr: 'le Major Hale (la cle / l interieur)', en: 'Major Hale (the key / from inside)' },
        lame: { fr: 'un homme de main sans visage', en: 'a faceless enforcer' },
        heure: '22:09',
        mobile: { fr: 'Renverse, endette, Krane a vu la victime le ruiner. Il monte un cambriolage simule pour la vider - et regler la dette qui l etouffait.', en: 'Ruined and in debt, Krane watched the victim destroy him. He stages a fake burglary to empty the safe - and settle the debt that was smothering him.' },
        alibi: { fr: 'Je rentrais du bar a 18h. Mais les paiements du coffre et la chronologie le lient a la scene a 22h09.', en: 'I was heading home from the bar at 6pm. But the safe payments and the timeline tie him to the scene at 10:09pm.' },
        fouille: [
            { label: '1', info: { fr: 'Bureau non force, cachet intact. Quelqu un de l interieur - un domestique, un garde - a ouvert la voie a un predateur qui aurait sue pour entrer seul.', en: 'Desk unforced, seal intact. Someone inside - a servant, a guard - opened the way for a predator who would have sweated to enter alone.' } },
            { label: '2', info: { fr: 'La carafe renversee, UN SEUL verre usage et une bouteille de liqueur que la victime ne buvait pas. Un invite s est servi chez lui.', en: 'The overturned decanter, ONE used glass and a liqueur the victim never drank. A guest helped himself in his own home.' } },
            { label: '3', info: { fr: 'Le livre de comptes montre la signature de la victime sur un pret recent : une creance importante contractee aupres du bar de Krane.', en: 'The ledger shows the victim\'s signature on a recent loan : a large debt taken from Krane\'s bar.' } },
            { label: 'A', info: { fr: 'Une liste de dettes au nom de Krane, a moitie brulee - effacees d un trait de plume nerveux, comme pour les faire disparaitre.', en: 'A list of debts in Krane\'s name, half burned - struck out with a nervous stroke, as if to make them vanish.' } },
            { label: 'C', info: { fr: 'Sur le buvard, l empreinte d un fond de verre et un grain de cafe - on a bu ici, debout, presse, en attendant.', en: 'On the blotter, the ring of a glass bottom and a coffee grain - someone drank here standing, hurried, waiting.' } },
            { label: '4', info: { fr: 'Le fauteuil renverse loin du bureau : la victime a ete jetee au sol par un assaillant plus fort, pas par une femme.', en: 'The overturned chair away from the desk : the victim was thrown down by a stronger assailant, not a woman.' } },
            { label: '5', info: { fr: 'La mare de sang pres de l entree, pas du bureau : on l a frappe de face, au retour d un rendez-vous, sans bruit ni lutte.', en: 'The pool of blood near the entrance, not the desk : he was struck head-on, returning from a meeting, without noise or struggle.' } },
            { label: '6', info: { fr: 'Un recu V.K. - mais libelle pour dette soldee, signe par la victime. Krane venait encaisser, et pas seulement de l argent.', en: 'A receipt V.K. - but marked "for settled debt", signed by the victim. Krane came to collect, and not only money.' } }
        ],
        fouilleClue: { fr: 'Une creance de la victime envers le bar de Krane, une dette soldee par un meurtre, un invite qui se sert chez lui. Le cambriolage etait la mise en scene d un reglement de compte.', en: 'A debt of the victim to Krane\'s bar, a debt settled by murder, a guest who helped himself. The burglary was the staging of a settling of accounts.' },
        clues: {
            carnet_dechire: { fr: 'Le carnet montre la creance de la victime envers le bar de Krane et le versement pour dette soldee - le mobile financier de Krane.', en: 'The ledger shows the victim\'s debt to Krane\'s bar and the "for settled debt" payment - Krane\'s financial motive.' },
            pression: { fr: 'Le rodeur bien habille vers 22h : un homme presse qui ne traine pas, connait la porte de service - un habitue des lieux, pas un voleur.', en: 'The well-dressed lurker around 10pm : a hurried man who hangs around, knows the service door - a regular, not a thief.' },
            labo_verrou: { fr: 'Le verrou s est ouvert par l interieur (pas force) : un initie a laisse entrer. La force du choc et la position trahissent un executant - et son donneur d ordre.', en: 'The lock opened from inside (not forced) : an insider let him in. The force of the blow and the position betray an enforcer - and its contractor.' },
            montre_code: { fr: 'INDICE MINEUR : 1981 (coffre). INDICE MAJEUR : 22h09 - il fallait un homme deja sur place a cette heure pour frapper et repartir sans etre vu.', en: 'MINOR : 1981 (safe). MAJOR : 10:09pm - it took a man already present at that hour to strike and leave unseen.' },
            coffre_code: { fr: 'Le coffre (code 1981) ne contient pas de carnet de versements mais la dette SOL DEE au bar de Krane : l argent a ete liquide le soir meme du meurtre.', en: 'The safe (code 1981) holds no payment ledger but the debt SETTLED at Krane\'s bar : the money was liquidated the very night of the murder.' },
            chronologie: { fr: 'La chronologie n attache d abord aucun suspect, puis une note du bar situe Krane sur les lieux a 22h09 pour encaisser.', en: 'The timeline first ties no suspect, then a bar note places Krane on scene at 10:09pm to collect.' },
            roue_alibis: { fr: 'Les trois horloges s accordent sur 22h09 : l appartement 18h de Krane ne tient plus. Le dossier de Krane est verrouille.', en: 'The three clocks agree on 10:09pm : Krane\'s home at 6pm no longer holds. The case against Krane is sealed.' }
        }
    };
    /* ===== PERMUTATION 3 - Rupert Blackwood (maitre d'oeuvre) ===== */
    PERMUTATIONS['suspect'] = {
        id: 'suspect',
        coupable: { fr: 'Rupert Blackwood', en: 'Rupert Blackwood' },
        coComplice: { fr: 'Silas Crane (le temoin achete)', en: 'Silas Crane (the bought witness)' },
        faussePiste: { fr: 'le Major Hale (l acces de confiance)', en: 'Major Hale (the trusted access)' },
        lame: { fr: 'Victor Krane', en: 'Victor Krane' },
        heure: '22:09',
        mobile: { fr: 'Rupert doit d enormes sommes a la victime. Ruine et accule, il la fait tuer pour effacer ses dettes et repartir a zero.', en: 'Rupert owes the victim enormous sums. Ruined and cornered, he has him killed to erase his debts and start over.' },
        alibi: { fr: 'Je suis parti a 21h30, Silas peut confirmer. Mais Silas a ete paye, et la montre/chronologie le place sur les lieux a 22h09.', en: 'I left at 9:30pm, Silas can confirm. But Silas was paid, and the watch/timeline place him on scene at 10:09pm.' },
        fouille: [
            { label: '1', info: { fr: 'Cachet intact, bureau non force : quelqu un de confiance a ouvert. Mais les comptes revelent que ce proche etait un debiteur accule.', en: 'Seal intact, desk unforced : someone trusted opened. But the accounts show this close one was a cornered debtor.' } },
            { label: '2', info: { fr: 'La carafe renversee et un verre au bord marque de la trace d une chevaliere - le sceau de Rupert Blackwood. Il est venu avant.', en: 'The overturned decanter and a rim glass marked by a signet ring - Rupert Blackwood\'s crest. He came before.' } },
            { label: '3', info: { fr: 'Le livre de comptes : la colonne Rupert Blackwood montre une dette enorme, soulignee trois fois, puis une note : a regler avant la fin du mois.', en: 'The ledger : the "Rupert Blackwood" column shows a huge debt, underlined three times, then a note : due before month\'s end.' } },
            { label: 'A', info: { fr: 'Une lettre de menace adressee a mon debiteur le plus cher - arrachee en partie, mais le cachet de cire aux armes de Blackwood est reconnaissable.', en: 'A threat letter addressed to my dearest debtor - partly torn, but Blackwood\'s wax crest is recognizable.' } },
            { label: 'C', info: { fr: 'L encrier intact et la plume seche depuis des heures : l ultime echange de mots eu lieu bien AVANT, a voix basse, autour d une table.', en: 'The inkwell untouched and the pen dry for hours : the last exchange of words happened long BEFORE, whispered, around a table.' } },
            { label: '4', info: { fr: 'Le fauteuil renverse et une montre de poche au sol : la victime a recu un visiteur de nuit, a l heure ou l on ne recoit que les creanciers.', en: 'The overturned chair and a pocket watch on the floor : the victim received a night visitor, at the hour one only receives creditors.' } },
            { label: '5', info: { fr: 'La mare de sang face au bureau : frappe par surprise au milieu d une ultime conversation d argent. Pas de lutte - on a frappe debout.', en: 'The pool of blood facing the desk : struck by surprise in a final money conversation. No struggle - struck standing.' } },
            { label: '6', info: { fr: 'Un recu V.K. plie : une forte somme versee pour services - et au dos, l ecriture de l obligataire : Rupert.', en: 'A folded V.K. receipt : a large sum paid for services - and on the back, the debtor\'s handwriting : Rupert.' } }
        ],
        fouilleClue: { fr: 'Une dette colossale soulignee trois fois, une chevaliere au bord du verre, une menace cachetee aux armes de Blackwood et un recu V.K. au dos signe Rupert. Le vol masquait un creancier qui faisait payer son du par le sang.', en: 'A colossal debt underlined three times, a signet ring on the glass rim, a wax-sealed threat bearing Blackwood\'s crest and a V.K. receipt signed Rupert on the back. The robbery masked a creditor collecting his due in blood.' },
        clues: {
            carnet_dechire: { fr: 'Le carnet montre la dette colossale de Rupert, soulignee trois fois, et le versement a V.K. signe de son ecriture au dos.', en: 'The ledger shows Rupert\'s colossal debt, underlined three times, and the payment to V.K. signed in his hand on the back.' },
            pression: { fr: 'Le rodeur bien habille vers 22h : Silas le decrit trop precisement - son temoignage a ete prepare. Il confirme l alibi de Rupert pour de l argent.', en: 'The well-dressed lurker around 10pm : Silas describes him too precisely - his testimony was rehearsed. He confirms Rupert\'s alibi for money.' },
            labo_verrou: { fr: 'Le verrou s est ouvert par l interieur : un initie. Mais la position du choc et l ecriture du recu relient Rupert, pas le garde qui a ouvert.', en: 'The lock opened from inside : an insider. But the position of the blow and the receipt handwriting tie Rupert, not the guard who opened.' },
            montre_code: { fr: 'INDICE MINEUR : 1981 (coffre). INDICE MAJEUR : 22h09 - Rupert, qui pretend etre parti a 21h30, a eu tout le temps de revenir.', en: 'MINOR : 1981 (safe). MAJOR : 10:09pm - Rupert, who claims he left at 9:30pm, had plenty of time to return.' },
            coffre_code: { fr: 'Le coffre (code 1981) vide des dettes de Rupert : les pages du carnet montrent qu elles ont ete reglees - et non par la victime.', en: 'The safe (code 1981) empty of Rupert\'s debts : the ledger pages show they were settled - and not by the victim.' },
            chronologie: { fr: 'La chronologie montre Rupert sur les lieux a 19h ET a 22h09 : son depart annonce a 21h30 est un mensonge que Silas couvre.', en: 'The timeline shows Rupert on scene at 7pm AND at 10:09pm : his announced 9:30pm departure is a lie Silas covers.' },
            roue_alibis: { fr: 'Les trois horloges s accordent sur 22h09 : l alibi de Rupert appuye par Silas ne tient pas. Le dossier est verrouille.', en: 'The three clocks agree on 10:09pm : Rupert\'s alibi backed by Silas does not hold. The case is sealed.' }
        }
    };

    /* API */
    var API = {
        DATA: PERMUTATIONS,
        list: function () { return ['protecteur', 'femme-fatale', 'criminel', 'suspect']; },
        get: function (id) { return PERMUTATIONS[id] || PERMUTATIONS['protecteur']; }
    };

    global.TDPermutations = API;

}(typeof globalThis !== 'undefined' ? globalThis : this));
