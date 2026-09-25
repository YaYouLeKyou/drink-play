/* =====================================================================
   TRUE DETECTIVE — DUELS DU RÉSEAU D'ALIBIS (données scénario)
   ---------------------------------------------------------------------
   Pools de paires pour l'énigme `reseau_alibis` : chaque paire (duel)
   présente EXACTEMENT 2 cartes — une dit vrai, l'autre ment. Chaque
   énigme a son propre pool, tiré au sort à chaque partie (mélange des
   duels + ordre gauche/droite), ancré sur le scénario canonique
   (scenario+dialogues.md, permutation `protecteur`).

   Ancrages par pool :
     act1_1 — montre 22h09, verrou ouvert à la clé, vol simulé / 2 gobelets
     act1_2 — rôdeur à 22h, portail 20h, retour de Hale vers 23h
     act2_1 — bar (Pembrooke / Krane), reçus V.K., dettes du Duc
     act2_3 — registre du coffre, ADN sur la porte, clés du Major

   Usage : cfg.alibiPool = 'act1_1' (le moteur appelle ensuite
   TDAlibiDuels.resolve(cfg)), ou cfg.duels = [[card, card], ...] +
   cfg.rounds. Rétrocompatible : l'ancien format `testimonies` reste
   géré par le moteur (appariement mensonges/vérités).
   ===================================================================== */
(function (global) {
    'use strict';

    function C(id, frWitness, enWitness, frStatement, enStatement, isLie) {
        return {
            id: id,
            witness: { fr: frWitness, en: enWitness },
            statement: { fr: frStatement, en: enStatement },
            isLie: !!isLie
        };
    }

    var POOLS = {
        /* Énigme 1 — Acte 1 : Hale vs Vivienne (1 manche tirée parmi 3) */
        act1_1: {
            rounds: 1,
            pairs: [
                [
                    C('hale', 'Major Hale', 'Major Hale',
                        "J'étais en panne avec Pembrooke à 22h, sur la route. Toute la soirée, nous avons réparé sa voiture ensemble — personne d'autre n'était avec nous.",
                        "I was broken down with Pembrooke on the road at 10pm. We spent the whole evening repairing his car together — no one else was with us.",
                        true),
                    C('vivienne', 'Lady Vivienne', 'Lady Vivienne',
                        "L'aiguille de la montre du Duc s'est figée à 22h09. C'est à cet instant précis qu'il a été frappé, dans son bureau.",
                        "The Duke's watch hand is frozen at 10:09pm. That is the exact moment he was struck, in his study.",
                        false)
                ],
                [
                    C('vivienne', 'Lady Vivienne', 'Lady Vivienne',
                        "La porte du bureau a été forcée dans la nuit : le pêne était cassé, il n'y a rien à discuter.",
                        "The study door was forced during the night: the bolt was broken, there is nothing to discuss.",
                        true),
                    C('hale', 'Major Hale', 'Major Hale',
                        "Le verrou du manoir a été ouvert avec une clé, pas forcé. La victime n'a pas opposé de résistance.",
                        "The manor lock was opened with a key, not forced. The victim did not resist.",
                        false)
                ],
                [
                    C('hale', 'Major Hale', 'Major Hale',
                        "Le bureau a été retourné : tiroirs sortis, papiers éparpillés. Le tueur cherchait quelque chose — c'était un vol qui a mal tourné.",
                        "The study was ransacked: drawers pulled out, papers scattered. The killer was looking for something — a robbery gone wrong.",
                        true),
                    C('vivienne', 'Lady Vivienne', 'Lady Vivienne',
                        "Rien n'a été volé. La carafe renversée et les deux gobelets suffisent : la victime attendait quelqu'un qu'elle connaissait.",
                        "Nothing was stolen. The overturned decanter and the two glasses say it all: the victim was expecting someone they knew.",
                        false)
                ]
            ]
        },
        /* Énigme 2 — Acte 1 : + Blackwood & Silas (2 manches parmi 4) */
        act1_2: {
            rounds: 2,
            pairs: [
                [
                    C('silas', 'Silas Crane', 'Silas Crane',
                        "J'ai vu un rôdeur vers 22h, près du pavillon : costard sur mesure, montre en or, nerveux. Il guettait le manoir.",
                        "I saw a prowler around 10pm, near the pavilion: tailored suit, gold watch, nervous. He was watching the manor.",
                        false),
                    C('hale', 'Major Hale', 'Major Hale',
                        "La soirée était calme : aucune ombre, aucun rôdeur près du manoir. Le quartier dormait, je m'en porte garant.",
                        "The evening was quiet: no shadow, no prowler near the manor. The neighbourhood was asleep, I can vouch for it.",
                        true)
                ],
                [
                    C('blackwood', 'Rupert Blackwood', 'Rupert Blackwood',
                        "J'ai dîné avec le Duc à 19h : il voulait retirer des fonds. Je suis parti vers 20h, comme d'habitude.",
                        "I dined with the Duke at 7pm: he wanted to withdraw funds. I left around 8pm, as usual.",
                        false),
                    C('vivienne', 'Lady Vivienne', 'Lady Vivienne',
                        "Mon mari n'a reçu aucun visiteur ce soir-là. Ni notaire, ni rendez-vous d'affaires : la maison était fermée.",
                        "My husband received no visitor that evening. No notary, no business appointment: the house was closed.",
                        true)
                ],
                [
                    C('hale', 'Major Hale', 'Major Hale',
                        "J'ai retrouvé le corps vers minuit, après avoir raccompagné Pembrooke jusqu'à chez lui. Nous étions ensemble.",
                        "I found the body around midnight, after taking Pembrooke home. We were together.",
                        true),
                    C('vivienne', 'Lady Vivienne', 'Lady Vivienne',
                        "Le Major est rentré vers 23h, seul. C'est lui qui a découvert la victime — je l'ai entendu crier.",
                        "The Major came back around 11pm, alone. He is the one who found the victim — I heard him cry out.",
                        false)
                ],
                [
                    C('silas', 'Silas Crane', 'Silas Crane',
                        "J'ai vu Blackwood passer au portail vers 20h. Le notaire a toujours été réglo, il ne traînait pas.",
                        "I saw Blackwood pass the gate around 8pm. The notary has always been straight, he doesn't linger.",
                        false),
                    C('blackwood', 'Rupert Blackwood', 'Rupert Blackwood',
                        "Je suis sorti du manoir sans croiser personne. Aucun témoin ne m'a vu quitter les lieux cette nuit-là.",
                        "I left the manor without meeting anyone. No witness saw me leave that night.",
                        true)
                ]
            ]
        },
        /* Énigme 3 — Acte 2 : + Pembrooke & Krane, duels du bar (3 manches parmi 5) */
        act2_1: {
            rounds: 3,
            pairs: [
                [
                    C('pembrooke', 'Julian Pembrooke', 'Julian Pembrooke',
                        "Ma voiture est tombée en panne, Hale m'a rejoint à 22h. J'étais SEUL à attendre : aucun rôdeur n'est passé près du manoir cette nuit-là.",
                        "My car broke down, Hale joined me at 10pm. I was ALONE waiting: no prowler passed near the manor that night.",
                        true),
                    C('silas', 'Silas Crane', 'Silas Crane',
                        "Vers 22h, un homme bien habillé rôdait près du pavillon, nerveux, le regard fixé sur le manoir. J'ai noté sa montre en or.",
                        "Around 10pm, a well-dressed man was prowling near the pavilion, nervous, eyes fixed on the manor. I noted his gold watch.",
                        false)
                ],
                [
                    C('krane', 'Victor Krane', 'Victor Krane',
                        "Le Duc m'a engagé pour une élimination — et m'a donné un nom : Pembrooke. Je devais frapper près du pavillon.",
                        "The Duke hired me for an elimination — and gave me a name: Pembrooke. I was to strike near the pavilion.",
                        false),
                    C('pembrooke', 'Julian Pembrooke', 'Julian Pembrooke',
                        "Personne ne m'a jamais visé. Le Duc et moi, nous nous entendions à merveille : aucune raison qu'il me craigne.",
                        "No one has ever targeted me. The Duke and I got along wonderfully: no reason for him to fear me.",
                        true)
                ],
                [
                    C('blackwood', 'Rupert Blackwood', 'Rupert Blackwood',
                        "« V.K. » ? Les initiales reviennent dans les comptes du Duc. C'était un créancier qu'il réglait en liquide, régulièrement.",
                        "'V.K.'? The initials recur in the Duke's accounts. A creditor he paid in cash, regularly.",
                        false),
                    C('hale', 'Major Hale', 'Major Hale',
                        "Ce reçu « V.K. » ne veut rien dire : une signature griffonnée au poker. Le Duc n'a jamais payé d'assassin.",
                        "That 'V.K.' receipt means nothing: a scrawled signature from a poker game. The Duke never paid any killer.",
                        true)
                ],
                [
                    C('blackwood', 'Rupert Blackwood', 'Rupert Blackwood',
                        "Le Duc voulait retirer de lourds fonds. Il avait des créanciers, des paiements en espèces qu'il notait lui-même.",
                        "The Duke wanted to withdraw large sums. He had creditors, cash payments he recorded himself.",
                        false),
                    C('vivienne', 'Lady Vivienne', 'Lady Vivienne',
                        "Mon mari n'avait aucune dette, aucun paiement à faire. Ses comptes étaient d'une propreté irréprochable.",
                        "My husband had no debts, no payments due. His accounts were spotless.",
                        true)
                ],
                [
                    C('krane', 'Victor Krane', 'Victor Krane',
                        "Ce clochard raconte n'importe quoi. Personne n'a vu de rôdeur : tout le quartier dormait, et Silas vend des rêves pour une pièce.",
                        "That vagrant talks nonsense. Nobody saw a prowler: the whole neighbourhood was asleep, and Silas sells dreams for a coin.",
                        true),
                    C('silas', 'Silas Crane', 'Silas Crane',
                        "L'homme que j'ai vu portait des gants et une montre en or. Il n'attendait personne : il guettait les allées du manoir.",
                        "The man I saw wore gloves and a gold watch. He wasn't waiting for anyone: he was watching the manor's grounds.",
                        false)
                ]
            ]
        },
        /* Énigme 4 — réseau final post-ADN / coffre (3 manches parmi 5) */
        act2_3: {
            rounds: 3,
            pairs: [
                [
                    C('krane', 'Victor Krane', 'Victor Krane',
                        "Le Duc m'a engagé, oui. Ses versements sont dans son propre registre, signés de sa main. Relisez le coffre.",
                        "The Duke hired me, yes. His payments are in his own ledger, signed by his hand. Re-read the safe.",
                        false),
                    C('hale', 'Major Hale', 'Major Hale',
                        "Je n'ai jamais payé personne de ma vie. Ce carnet ne me concerne pas — je ne sais même pas qui est V.K.",
                        "I have never paid anyone in my life. That ledger has nothing to do with me — I don't even know who V.K. is.",
                        true)
                ],
                [
                    C('pembrooke', 'Julian Pembrooke', 'Julian Pembrooke',
                        "Mon ADN sur la porte ? Je n'ai jamais touché ce manoir : je vous le jure, je suis resté dans ma voiture.",
                        "My DNA on the door? I never touched this manor: I swear it, I stayed in my car.",
                        true),
                    C('vivienne', 'Lady Vivienne', 'Lady Vivienne',
                        "Julian m'a avoué être entré ce soir-là. Il est venu me voir au manoir, comme par le passé.",
                        "Julian admitted to me that he came in that night. He came to see me at the manor, as in the past.",
                        false)
                ],
                [
                    C('vivienne', 'Lady Vivienne', 'Lady Vivienne',
                        "Le testament ne me concernait pas du tout. Mon mari ne changeait rien : tout était calme de ce côté-là.",
                        "The will had nothing to do with me. My husband changed nothing: all was quiet on that front.",
                        true),
                    C('blackwood', 'Rupert Blackwood', 'Rupert Blackwood',
                        "La tension sur le testament était à son comble. Le Duc voulait changer de dispositions ce mois-ci — je le sais, je le notariais.",
                        "Tension over the will was at its peak. The Duke wanted to change his provisions this month — I know, I was drafting it.",
                        false)
                ],
                [
                    C('krane', 'Victor Krane', 'Victor Krane',
                        "Mon ADN sur l'arme ? Impossible : je n'ai jamais tenu de pistolet de ma vie. Cette nuit-là, je buvais au comptoir.",
                        "My DNA on the weapon? Impossible: I have never held a pistol in my life. That night, I was drinking at the bar.",
                        true),
                    C('silas', 'Silas Crane', 'Silas Crane',
                        "L'homme près du pavillon portait des gants et une montre en or. Il guettait les allées du manoir, pas la route.",
                        "The man near the pavilion wore gloves and a gold watch. He was watching the manor's grounds, not the road.",
                        false)
                ],
                [
                    C('hale', 'Major Hale', 'Major Hale',
                        "Quand j'ai retrouvé le corps, la porte était close : je l'ai enfoncée. Je n'avais aucune clé sur moi à ce moment-là.",
                        "When I found the body, the door was shut: I broke it open. I had no keys on me at that moment.",
                        true),
                    C('vivienne', 'Lady Vivienne', 'Lady Vivienne',
                        "Le Major a ouvert la porte sans forcer. Il garde toujours les clés du manoir sur lui — c'est son métier.",
                        "The Major opened the door without forcing it. He always keeps the manor keys on him — it's his job.",
                        false)
                ]
            ]
        }
    };

    function get(poolId) {
        return POOLS[poolId] || null;
    }

    var ROLE_POOLS = {
        act1_1: ['vivienne', 'hale'],
        // Réseau 2 : Rupert Blackwood (suspect) et Silas Crane (marginal).
        act1_2: ['blackwood', 'silas'],
        // Réseau 3 : Julian Pembrooke (séducteur) et Victor Krane (criminel).
        act2_1: ['pembrooke', 'krane'],
        // Réseau 4 : les six suspects sont éligibles au tirage aléatoire.
        act2_3: ['vivienne', 'hale', 'blackwood', 'silas', 'pembrooke', 'krane']
    };

    var ALL_ROLES = ROLE_POOLS.act2_3.slice();

    function cloneCard(card) {
        return {
            id: card.id,
            witness: { fr: card.witness.fr, en: card.witness.en },
            statement: { fr: card.statement.fr, en: card.statement.en },
            isLie: !!card.isLie
        };
    }

    function collectCards(pool) {
        var byRole = {};
        pool.pairs.forEach(function (duel) {
            duel.forEach(function (card) {
                if (!byRole[card.id]) byRole[card.id] = [];
                byRole[card.id].push(card);
            });
        });
        return byRole;
    }

    function shuffled(list) {
        var copy = list.slice();
        for (var i = copy.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var tmp = copy[i]; copy[i] = copy[j]; copy[j] = tmp;
        }
        return copy;
    }

    function pickCompatiblePair(cardsByRole, roleIds) {
        var roles = shuffled(roleIds.filter(function (id) {
            return cardsByRole[id] && cardsByRole[id].length;
        }));
        for (var i = 0; i < roles.length; i++) {
            for (var j = i + 1; j < roles.length; j++) {
                var first = shuffled(cardsByRole[roles[i]]);
                var second = shuffled(cardsByRole[roles[j]]);
                for (var a = 0; a < first.length; a++) {
                    for (var b = 0; b < second.length; b++) {
                        if (first[a].isLie !== second[b].isLie) {
                            return [cloneCard(first[a]), cloneCard(second[b])];
                        }
                    }
                }
            }
        }
        return null;
    }
    function buildRoleDuels(pool, roleIds, rounds) {
        var cards = collectCards(pool);
        var duels = [];
        for (var i = 0; i < rounds; i++) {
            var pair = pickCompatiblePair(cards, roleIds);
            if (!pair) return null;
            duels.push(pair);
        }
        return duels;
    }

    function buildRandomDuels(pool, rounds) {
        var cards = collectCards(pool);
        var roles = shuffled(ROLE_POOLS.act2_3);
        var duels = [];

        function pairRemaining(remaining) {
            if (!remaining.length) return [];
            if (remaining.length < 2) return null;
            var firstRole = remaining[0];
            for (var i = 1; i < remaining.length; i++) {
                var secondRole = remaining[i];
                var pair = pickCompatiblePair(cards, [firstRole, secondRole]);
                if (!pair) continue;
                var rest = remaining.slice(1, i).concat(remaining.slice(i + 1));
                var tail = pairRemaining(rest);
                if (tail) return [pair].concat(tail);
            }
            return null;
        }

        var paired = pairRemaining(roles);
        if (!paired) return null;
        duels = paired.slice(0, rounds);
        return duels.length === rounds ? duels : null;
    }
    function resolve(cfg) {
        if (!cfg || !cfg.alibiPool || !POOLS[cfg.alibiPool]) return cfg;
        var pool = POOLS[cfg.alibiPool];
        var duels;
        if (cfg.alibiPool === 'act2_3') {
            duels = buildRandomDuels(pool, pool.rounds);
            cfg.rounds = pool.rounds;
        } else {
            duels = buildRoleDuels(pool, ROLE_POOLS[cfg.alibiPool] || [], pool.rounds);
            cfg.rounds = pool.rounds;
        }
        if (duels) cfg.duels = duels;
        else {
            cfg.duels = pool.pairs.map(function (duel) {
                return duel.slice();
            });
            cfg.rounds = pool.rounds;
        }
        cfg._alibiPool = cfg.alibiPool;
        return cfg;
    }

    global.TDAlibiDuels = {
        POOLS: POOLS,
        get: get,
        resolve: resolve
    };
})(typeof window !== 'undefined' ? window : global);
