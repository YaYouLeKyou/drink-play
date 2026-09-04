/* Répare les caractères corrompus (U+FFFD) et emojis perdus dans minigames.js */
const fs = require('fs');
const p = require('path').join(__dirname, '..', 'minigames.js');
let s = fs.readFileSync(p, 'utf8');

const R = [
    /* --- Emojis perdus ('??' littéraux) --- */
    ["'?? INDICE MAJEUR' : '?? MAJOR CLUE'", "'\\u{1F50E} INDICE MAJEUR' : '\\u{1F50E} MAJOR CLUE'"],
    ["'? Vos notes d\\'observation'", "'\\u{1F50D} Vos notes d\\'observation'"],
    ["'? Your observation notes'", "'\\u{1F50D} Your observation notes'"],
    ["'?? Consigner dans le journal' : '?? Save to notebook'", "'\\u{1F4D3} Consigner dans le journal' : '\\u{1F4D3} Save to notebook'"],
    ["'? Retourner la montre' : '? Flip the watch'", "'\\u{1F504} Retourner la montre' : '\\u{1F504} Flip the watch'"],
    ["'? Voir la face' : '? See the face'", "'\\u{1F50D} Voir la face' : '\\u{1F50D} See the face'"],
    ["'?? Loupe active", "'\\u{1F50D} Loupe active"],
    ["'?? Magnifier active", "'\\u{1F50D} Magnifier active"],

    /* --- Chaînes visibles (FR) --- */
    ["'T\uFFFDtoins'", "'Témoins'"],
    ["'FAISCEAUX DE PREUVES' : 'EVIDENCE BEAM') + ' \uFFFD '", "'FAISCEAUX DE PREUVES' : 'EVIDENCE BEAM') + ', '"],
    ["'Notez les indices relev\uFFFDon la montre. Ils vous serviront plus tard.'", "'Notez les indices relevés sur la montre. Ils vous serviront plus tard.'"],
    ["'Heure du crime relev\uFFFD (ex: 22h09)'", "'Heure du crime relevée (ex: 22h09)'"],
    ["'Code \uFFFD 4 chiffres (dos de la montre)'", "'Code à 4 chiffres (dos de la montre)'"],
    ["'Notes montre \uFFFD heure : '", "'Notes montre, heure : '"],
    ["'Watch notes \uFFFD time : '", "'Watch notes, time : '"],
    ["(t || '\uFFFD')", "(t || ',')"],
    ["(c || '\uFFFD')", "(c || ',')"],
    ["'Gravure d\uFFFDchiffr\uFFFD (' + n + '/' + answer.length + ')\uFFFD'", "'Gravure déchiffrée (' + n + '/' + answer.length + ')…'"],
    ["'Engraving decoded (' + n + '/' + answer.length + ')\uFFFD'", "'Engraving decoded (' + n + '/' + answer.length + ')…'"],
    ["'Composez maintenant le num\uFFFDro grav\uFFFD sur les cadrans\uFFFD'", "'Composez maintenant le numéro gravé sur les cadrans…'"],
    ["'Now dial the engraved number\uFFFD'", "'Now dial the engraved number…'"],
    ["'\uFFFD ' + codeStr + ' \uFFFD, grav\uFFFD au dos\uFFFD Mais qu\\'avez-vous remarqu\uFFFD SUR LA FACE de la montre ?'", "'« ' + codeStr + ' », gravé au dos… Mais qu\\'avez-vous remarqué SUR LA FACE de la montre ?'"],
    ["'\\\"' + codeStr + '\\\" engraved on the back\uFFFD But what did you notice on the WATCH FACE?'", "'\\\"' + codeStr + '\\\" engraved on the back… But what did you notice on the WATCH FACE?'"],
    ["'L\\'aiguille fig\uFFFD\uFFFD ' + timeStr + ' : voil\uFFFD l\\'heure probable du crime \uFFFD et ' + codeStr + ' ouvrira peut-\uFFFDtre un coffre'", "'L\\'aiguille figée à ' + timeStr + ' : voilà l\\'heure probable du crime, et ' + codeStr + ' ouvrira peut-être un coffre'"],
    ["'The hand frozen at ' + timeStr + ' : that is the likely time of death \uFFFD and ' + codeStr + ' may open a safe'", "'The hand frozen at ' + timeStr + ' : that is the likely time of death, and ' + codeStr + ' may open a safe'"],
    ["'Rien de plus : une montre cass\uFFFD ne dit rien'", "'Rien de plus : une montre cassée ne dit rien'"],
    ["'Heure du crime \uFFFDtablie : ' + timeStr + ' (\uFFFD confirmer). Ce d\uFFFDtail sera d\uFFFDcisif \uFFFD et ' + codeStr + ' servira.'", "'Heure du crime établie : ' + timeStr + ' (à confirmer). Ce détail sera décisif, et ' + codeStr + ' servira.'"],
    ["'Time of death established : ' + timeStr + ' (to be confirmed). This detail will matter \uFFFD and ' + codeStr + ' will serve.'", "'Time of death established : ' + timeStr + ' (to be confirmed). This detail will matter, and ' + codeStr + ' will serve.'"],
    ["'La montre fig\uFFFD\uFFFD ' + timeStr + '\uFFFD' : 'The watch frozen at ' + timeStr + '\uFFFD'", "'La montre figée à ' + timeStr + '…' : 'The watch frozen at ' + timeStr + '…'"],
    ["'Approchez la loupe de la face. Une aiguille s\\'y est fig\uFFFD\uFFFD'", "'Approchez la loupe de la face. Une aiguille s\\'y est figée…'"],
    ["'Bring the magnifier to the face. A hand is frozen there\uFFFD'", "'Bring the magnifier to the face. A needle is frozen there…'"],
    ["'Passez la loupe sur le dos de la montre : les gravures ne sont lisibles qu\\'au grossissement\uFFFD'", "'Passez la loupe sur le dos de la montre : les gravures ne sont lisibles qu\\'au grossissement…'"],
    ["'Sweep the magnifier over the watch back : the engravings are only readable when magnified\uFFFD'", "'Sweep the magnifier over the watch back : the engravings are only readable when magnified…'"],
    ["'L\\'aiguille est fig\uFFFD. Notez mentalement l\\'heure. Cliquez sur \\\"Retourner la montre\\\" pour examiner le dos.'", "'L\\'aiguille est figée. Notez mentalement l\\'heure. Cliquez sur \\\"Retourner la montre\\\" pour examiner le dos.'"],
    ["'Une fibre de soie est accroch\uFFFD\uFFFD \uFFFD la pince\uFFFD' : 'A silk fibre is caught on the tweezers\uFFFD'", "'Une fibre de soie est accrochée à la pince…' : 'A silk fibre is caught on the tweezers…'"],
    ["'Empreinte relev\uFFFD ('", "'Empreinte relevée ('"],
    ["'Cl\uFFFD de lecture : +'", "'Clé de lecture : +'"],
    ["'D\uFFFDcodez le message\uFFFD' : 'Decode the message\uFFFD'", "'Décodez le message…' : 'Decode the message…'"],
    ["'V\uFFFD/rifier' : 'Check'", "'Vérifier' : 'Check'"],
    ["'Horloge-m\uFFFDre'", "'Horloge-mère'"],
    /* Fragments du contrat (carnet) */
    ["{ fr: '\uFFFDversement de 12 000 \uFFFD \uFFFD V.K.', en: '\uFFFDpayment of \uFFFD12,000 to V.K.', order: 0 }", "{ fr: 'Versement de 12 000 £ à V.K.', en: 'Payment of £12,000 to V.K.', order: 0 }"],
    ["{ fr: '\uFFFDpour services rendus \uFFFD contrat', en: '\uFFFDfor services rendered \uFFFD contract', order: 1 }", "{ fr: 'pour services rendus — contrat', en: 'for services rendered — contract', order: 1 }"],
    ["{ fr: '\uFFFDle 14 du mois, comme convenu\uFFFD', en: '\uFFFDon the 14th of the month, as agreed\uFFFD', order: 2 }", "{ fr: 'le 14 du mois, comme convenu', en: 'on the 14th of the month, as agreed', order: 2 }"],
    ["{ fr: '\uFFFDne pas laisser de traces', en: '\uFFFDleave no traces', order: 3 }", "{ fr: 'ne pas laisser de traces', en: 'leave no traces', order: 3 }"],
    ["{ x: 45, y: 38, found: false, label: { fr: 'Empreinte pr\uFFFDs du 14 \uFFFD la date du contrat', en: 'Fingerprint near the 14th \uFFFD contract date' } }", "{ x: 45, y: 38, found: false, label: { fr: 'Empreinte près du 14 — la date du contrat', en: 'Fingerprint near the 14th — contract date' } }"],
    ["{ x: 62, y: 68, found: false, label: { fr: 'Empreinte sur le montant \uFFFD 12 000 \uFFFD', en: 'Fingerprint on the amount \uFFFD \uFFFD12,000' } }", "{ x: 62, y: 68, found: false, label: { fr: 'Empreinte sur le montant — 12 000 £', en: 'Fingerprint on the amount — £12,000' } }"],
    /* --- Commentaires (propreté du fichier) --- */
    ["TRUE DETECTIVE \uFFFD MINI-JEUX", "TRUE DETECTIVE — MINI-JEUX"],
    ["le joueur peut toujours \uFFFD Passer \uFFFD.", "le joueur peut toujours « Passer »."],
    ["Le timer cr\uFFFD la pression ; un \uFFFDchec", "Le timer crée la pression ; un échec"],
    ["partag\uFFFDon", "partagés "],
    ["Difficult\uFFFD adaptative : \uFFFD 60% du temps \uFFFDcoul\uFFFD, halo sur les bons \uFFFDl\uFFFDments", "Difficulté adaptative : à 60% du temps écoulé, halo sur les bons éléments"],
    ["la cat\uFFFDgorie de preuve", "la catégorie de preuve"],
    ["R\uFFFDDompense : panneau", "Récompense : panneau"],
    ["barres par cat\uFFFDgorie", "barres par catégorie"],
    ["Bouton \uFFFD Passer \uFFFD (optionnel)", "Bouton « Passer » (optionnel)"],
    ["showMontreNoteBox \uFFFD s'ouvre en bas de l'\uFFFDecran apr\uFFFD la r\uFFFDsolution", "showMontreNoteBox — s'ouvre en bas de l'écran après la résolution"],
    ["de noter lui-m\uFFFDme l'heure relev\uFFFD", "de noter lui-même l'heure relevée"],
    ["et le code \uFFFD 4 chiffres. Ces notes", "et le code à 4 chiffres. Ces notes"],
    ["MONTRE_PHASE2 \uFFFD cadrans + \uFFFDquerre draggable + question finale", "MONTRE_PHASE2 — cadrans + équerre draggable + question finale"],
    ["(utilis\uFFFD par le mini-jeu 'montre_code')", "(utilisé par le mini-jeu 'montre_code')"],
    ["Cadrans \uFFFD verrouill\uFFFDs tant que les gravures ne sont pas r\uFFFDv\uFFFDl\uFFFDs", "Cadrans — verrouillés tant que les gravures ne sont pas révélés"],
    ["le dos a attir\uFFFD l'attention\uFFFD mais la face parle", "le dos a attiré l'attention — mais la face parle"],
    ["BUILD_CREATORS \uFFFD contient les fabriques de jeux", "BUILD_CREATORS — contient les fabriques de jeux"],
    ["grossit la sc\uFFFDne sous le curseur", "grossit la scène sous le curseur"],
    ["la m\uFFFDme image de fond", "la même image de fond"],
    ["Fen\uFFFDtre d'indice de zone", "Fenêtre d'indice de zone"],
    ["la fen\uFFFDtre d'indice au survol", "la fenêtre d'indice au survol"],
    ["V3 \uFFFD MINI-JEUX AVEC ASSETS", "V3 — MINI-JEUX AVEC ASSETS"],
    ["Loupe qui couvre toute la face au d\uFFFDbut \uFFFD pour rep\uFFFDrer l'aiguille fig\uFFFD.", "Loupe qui couvre toute la face au début — pour repérer l'aiguille figée."],
    ["Quand on clique sur la face, on r\uFFFDv\uFFFDle le dos, o\uFFFD se trouve la gravure.", "Quand on clique sur la face, on révèle le dos, où se trouve la gravure."],
    ["Gravures cach\uFFFDs sur le dos de la montre (lisibles \uFFFD la loupe)", "Gravures cachées sur le dos de la montre (lisibles à la loupe)"],
    ["Bouton \\\"Retourner la montre\\\" \uFFFD permet au joueur de passer du dos \uFFFD la face", "Bouton \\\"Retourner la montre\\\" — permet au joueur de passer du dos à la face"],
    ["On revient \uFFFD la face", "On revient à la face"],
    ["Loupe qui magnifie la face pour rep\uFFFDrer l'aiguille fig\uFFFD", "Loupe qui magnifie la face pour repérer l'aiguille figée"],
    ["apr\uFFFD avoir bien observ\uFFFD l'aiguille fig\uFFFD,", "après avoir bien observé l'aiguille figée,"],
    ["Coffre-fort de l'Acte 2 \uFFFD le code 1981 de la montre r\uFFFDDompense le joueur attentif", "Coffre-fort de l'Acte 2 — le code de la montre récompense le joueur attentif"],
];

/* --- PASS 2 : résidus du remplacement neutre --- */
const R2 = [
    ["cr—e la pression ; un —chec", "crée la pression ; un échec"],
    ["boutons partag—s", "boutons partagés"],
    ["R—compense : panneau", "Récompense : panneau"],
    ["'T—moins'", "'Témoins'"],
    ["bas de l'—cran apr—s la r—solution", "bas de l'écran après la résolution"],
    ["notes seront stock—es", "notes seront stockées"],
    ["'Notez les indices relev—s sur la montre.", "'Notez les indices relevés sur la montre."],
    ["'Heure du crime relev—e (ex: 22h09)'", "'Heure du crime relevée (ex: 22h09)'"],
    ["verrouill—s tant que les gravures ne sont pas r—v—l—es", "verrouillés tant que les gravures ne sont pas révélés"],
    ["'Gravure d—chiffr—e (' + n + '/' + answer.length + ')—'", "'Gravure déchiffrée (' + n + '/' + answer.length + ')…'"],
    ["engraved on the back— But what did you notice", "engraved on the back… But what did you notice"],
    ["'L\\'aiguille fig—e — ' + timeStr + ' : voil— l\\'heure probable du crime — et ' + codeStr + ' ouvrira peut-—tre un coffre'", "'L\\'aiguille figée à ' + timeStr + ' : voilà l\\'heure probable du crime — et ' + codeStr + ' ouvrira peut-être un coffre'"],
    ["'Rien de plus : une montre cass—e ne dit rien'", "'Rien de plus : une montre cassée ne dit rien'"],
    ["'La montre fig—e — ' + timeStr + '—' : 'The watch frozen at ' + timeStr + '—'", "'La montre figée à ' + timeStr + '…' : 'The watch frozen at ' + timeStr + '…'"],
    ["s\\'y est fig—e—'", "s\\'y est figée…'"],
    ["au d—but — pour rep—rer l'aiguille fig—e.", "au début — pour repérer l'aiguille figée."],
    ["Gravures cach—es sur le dos de la montre (lisibles — la loupe)", "Gravures cachées sur le dos de la montre (lisibles à la loupe)"],
    ["apr—s avoir bien observ— l'aiguille fig—e,", "après avoir bien observé l'aiguille figée,"],
    ["'L\\'aiguille est fig—e. Notez", "'L\\'aiguille est figée. Notez"],
    ["le code 1981 de la montre r—compense le joueur attentif", "le code de la montre récompense le joueur attentif"],
    ["'Une fibre de soie est accroch—e — la pince—' : 'A silk fibre is caught on the tweezers—'", "'Une fibre de soie est accrochée à la pince…' : 'A silk fibre is caught on the tweezers…'"],
    ["sur la page reconstitu—e ---", "sur la page reconstituée ---"],
    ["'Empreinte relev—e ('", "'Empreinte relevée ('"],
    ["'V—rifier' : 'Check'", "'Vérifier' : 'Check'"],
];

let applied = 0, missed = [];

R2.forEach(function (pair) {
    if (s.indexOf(pair[0]) !== -1) { s = s.split(pair[0]).join(pair[1]); applied++; }
    else { missed.push('[P2] ' + pair[0].slice(0, 70)); }
});

/* Les \uFFFD restants (commentaires) : remplacement neutre */
R.forEach(function (pair) {
    if (s.indexOf(pair[0]) !== -1) { s = s.split(pair[0]).join(pair[1]); applied++; }
    else { missed.push(pair[0].slice(0, 70)); }
});

/* Les \uFFFD restants (commentaires) : remplacement neutre */
s = s.split('\uFFFD').join('—');

fs.writeFileSync(p, s, 'utf8');
console.log('replacements applied:', applied);
if (missed.length) { console.log('NOT FOUND (' + missed.length + '):'); missed.forEach(function (m) { console.log('  -', JSON.stringify(m)); }); }
console.log('remaining U+FFFD:', (s.match(/\uFFFD/g) || []).length);