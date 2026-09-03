// Insert roue_alibis puzzle into phases.js (act3-chrono phase)
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'true-detective', 'phases.js');
let content = fs.readFileSync(filePath, 'utf8');

const anchorPage1End = `            },
            {
                decor: 'qg',
                npc: 'detective-partner',
                text: {
                    fr: '« 22h09...`;

const newPage = `            },
            {
                decor: 'qg',
                npc: 'detective-partner',
                minigame: {
                    type: 'roue_alibis',
                    title: { fr: 'La Roue Synchrone des Alibis', en: 'The Synchronous Wheel of Alibis' },
                    desc: { fr: 'Alignez le cadran de la montre (22h09), l\\'alibi de la panne de Pembrooke et l\\'horloge-mère pour pulvériser l\\'alibi de Hale.', en: 'Align the watch dial (10:09pm), Pembrooke\\'s breakdown alibi and the mother clock to shatter Hale\\'s alibi.' },
                    time: 45,
                    asset: 'mini-games/puzzle/pocket-watch-dial.png.jfif',
                    target: '22:09',
                    evidence: 'timeline',
                    clue: { fr: 'Les trois horloges s\\'accordent sur 22h09 : Hale prétendait être en panne avec Pembrooke à cet instant, mais l\\'horloge-mère situe le choc au même moment. Son alibi est pulvérisé. Le dossier d\\'accusation est verrouillé.', en: 'The three clocks agree on 10:09pm : Hale claimed to be broken down with Pembrooke at that instant, but the mother clock places the impact at the same time. His alibi is shattered. The case is sealed.' }
                },
                text: {
                    fr: 'Sur le bureau, la montre figée, le récit de la panne et la grande horloge-mère. « Synchronisons-les… la vérité éclatera. »',
                    en: 'On the desk, the frozen watch, the breakdown story and the great mother clock. "Let\\'s synchronize them... the truth will burst out."'
                }
            },
            {
                decor: 'qg',
                npc: 'detective-partner',
                text: {
                    fr: '« 22h09...`;

if (!content.includes(anchorPage1End)) {
    console.error('ANCHOR NOT FOUND');
    process.exit(1);
}

content = content.replace(anchorPage1End, newPage);
fs.writeFileSync(filePath, content, 'utf8');
console.log('Inserted roue_alibis OK');