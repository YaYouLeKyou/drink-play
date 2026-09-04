const fs = require('fs');
const path = require('path');

console.log('=== AUDIT DE COHÉRENCE SCÉNARISTIQUE ===\n');

// Vérifier minigames.js
const minigames = fs.readFileSync(path.join(__dirname, '..', 'minigames.js'), 'utf8');

// 1. Vérifier qu'il n'y a plus de fuite de 22h09 dans les titres/tooltips
console.log('--- Vérification des fuites de 22h09 dans minigames.js ---');
const timeLeaks = minigames.match(/22h09|22:09|10:09pm/g);
if (timeLeaks) {
    console.log('⚠ Fuites trouvées:', timeLeaks);
} else {
    console.log('✅ Aucune fuite de 22h09 dans minigames.js');
}

// 2. Vérifier que le placeholder de l'heure ne donne pas 22h09
console.log('\n--- Vérification du placeholder de l\'heure ---');
const placeholderMatch = minigames.match(/timeCell\.placeholder = .+?;/);
if (placeholderMatch) {
    console.log('Placeholder:', placeholderMatch[0]);
    if (placeholderMatch[0].includes('22h09') || placeholderMatch[0].includes('22:09')) {
        console.log('⚠ PROBLÈME: Le placeholder contient 22h09');
    } else {
        console.log('✅ Placeholder OK');
    }
}

// Vérifier narration.js
const narration = fs.readFileSync(path.join(__dirname, '..', 'narration.js'), 'utf8');

// 3. Vérifier les occurrences de 22h09 dans narration.js
console.log('\n--- Occurrences de 22h09 dans narration.js ---');
const narrationMatches = narration.match(/22h09|22:09|10:09/g);
if (narrationMatches) {
    console.log('Trouvé:', narrationMatches.length, 'occurrences');
    // Trouver le contexte
    const lines = narration.split('\n');
    lines.forEach((line, i) => {
        if (line.includes('22h09') || line.includes('22:09') || line.includes('10:09')) {
            console.log(`  Ligne ${i+1}: ${line.trim().substring(0, 80)}...`);
        }
    });
} else {
    console.log('✅ Aucune occurrence de 22h09');
}

// Vérifier phases.js
const phases = fs.readFileSync(path.join(__dirname, '..', 'phases.js'), 'utf8');

// 4. Vérifier les occurrences de 22h09 dans phases.js
console.log('\n--- Occurrences de 22h09 dans phases.js ---');
const phasesMatches = phases.match(/22h09|22:09|10:09/g);
if (phasesMatches) {
    console.log('Trouvé:', phasesMatches.length, 'occurrences');
    const lines = phases.split('\n');
    lines.forEach((line, i) => {
        if (line.includes('22h09') || line.includes('22:09') || line.includes('10:09')) {
            console.log(`  Ligne ${i+1}: ${line.trim().substring(0, 80)}...`);
        }
    });
} else {
    console.log('✅ Aucune occurrence de 22h09');
}

// Vérifier scenario.js
const scenario = fs.readFileSync(path.join(__dirname, '..', 'scenario.js'), 'utf8');

// 5. Vérifier les occurrences de 22h09 dans scenario.js
console.log('\n--- Occurrences de 22h09 dans scenario.js ---');
const scenarioMatches = scenario.match(/22h09|22:09|10:09/g);
if (scenarioMatches) {
    console.log('Trouvé:', scenarioMatches.length, 'occurrences');
    const lines = scenario.split('\n');
    lines.forEach((line, i) => {
        if (line.includes('22h09') || line.includes('22:09') || line.includes('10:09')) {
            console.log(`  Ligne ${i+1}: ${line.trim().substring(0, 80)}...`);
        }
    });
} else {
    console.log('✅ Aucune occurrence de 22h09');
}

console.log('\n=== AUDIT TERMINÉ ===');
