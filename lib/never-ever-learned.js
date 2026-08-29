const fs = require('fs');
const path = require('path');

// Base de données apprenante : les créations IA réussies enrichissent
// un pool persistant (generated-content.json) relu par le client à chaque session.

const GENERATED_PATH = path.join(__dirname, '..', 'never-ever', 'generated-content.json');
const STATIC_PATH = path.join(__dirname, '..', 'never-ever', 'game-content.json');
const MAX_PER_CATEGORY = 60;

// Types poolables -> catégorie dans la base apprenante
function categoryForType(type, isSpicy) {
    switch (type) {
        case 'question':
            return isSpicy ? 'superSpicyQuestions' : 'questions';
        case 'action':
            return isSpicy ? 'superSpicyActions' : 'actions';
        case 'truth':
            return 'truths';
        case 'group_challenge':
            return 'groupChallenges';
        case 'host_comment':
            return 'hostComments';
        case 'host_pressure':
            return null;
        default:
            return null;
    }
}

let cache = null;
let staticCache = null;
let writeTimer = null;

function loadCache() {
    if (cache) return cache;
    try {
        cache = JSON.parse(fs.readFileSync(GENERATED_PATH, 'utf8'));
    } catch (e) {
        cache = {};
    }
    if (typeof cache !== 'object' || cache === null || Array.isArray(cache)) {
        cache = {};
    }
    for (const lang of Object.keys(cache)) {
        if (typeof cache[lang] !== 'object' || cache[lang] === null || Array.isArray(cache[lang])) {
            cache[lang] = {};
        }
    }
    return cache;
}

function loadStatic() {
    if (staticCache) return staticCache;
    try {
        staticCache = JSON.parse(fs.readFileSync(STATIC_PATH, 'utf8'));
    } catch (e) {
        staticCache = {};
    }
    return staticCache;
}

function normalize(s) {
    return String(s || '').trim().replace(/\s+/g, ' ').toLowerCase();
}

function staticPoolFor(language, category) {
    const langData = loadStatic()[language];
    if (!langData || typeof langData !== 'object') return [];
    const pool = langData[category];
    return Array.isArray(pool) ? pool : [];
}

function listFor(language, category) {
    const data = loadCache();
    if (!data[language]) data[language] = {};
    if (!Array.isArray(data[language][category])) data[language][category] = [];
    return data[language][category];
}

function scheduleWrite() {
    if (writeTimer) clearTimeout(writeTimer);
    writeTimer = setTimeout(writeFile, 400);
}

function writeFile() {
    writeTimer = null;
    try {
        const dir = path.dirname(GENERATED_PATH);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        const tmp = `${GENERATED_PATH}.tmp`;
        fs.writeFileSync(tmp, JSON.stringify(cache, null, 2), 'utf8');
        fs.renameSync(tmp, GENERATED_PATH);
    } catch (error) {
        console.error('[LearnedPool] write failed:', error.message);
    }
}

// Retourne true si le contenu a bien été ajouté au pool apprenant.
function addGeneratedContent({ type, language, isSpicy, content }) {
    if (!content || typeof content !== 'string') return false;
    const trimmed = content.trim();
    if (!trimmed) return false;

    const category = categoryForType(type, !!isSpicy);
    if (!category) return false; // types non-poolables (commentaires, narrations, etc.)

    const norm = normalize(trimmed);
    if (norm.length < 3) return false;

    // Ne pas aller trop loin : jamais de doublon avec le contenu statique de base
    if (staticPoolFor(language, category).some(s => normalize(s) === norm)) return false;

    const list = listFor(language, category);
    if (list.some(s => normalize(s) === norm)) return false;

    list.push(trimmed);
    // Cap : on garde les plus récents
    if (list.length > MAX_PER_CATEGORY) {
        list.splice(0, list.length - MAX_PER_CATEGORY);
    }
    scheduleWrite();
    return true;
}

module.exports = {
    addGeneratedContent,
    MAX_PER_CATEGORY,
};