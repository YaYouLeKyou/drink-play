/* Simule un mini-DOM pour executer TDMiniGames.play(scene_fouille) et attraper l'erreur. */
const fs = require('fs');
const path = require('path');

function makeEl(tag) {
    const el = {
        tagName: tag, children: [], style: {}, dataset: {},
        _classes: new Set(), _listeners: {}, innerHTML: '', textContent: '', src: '', title: '',
        classList: {
            add: function (c) { el._classes.add(c); },
            remove: function (c) { el._classes.delete(c); },
            contains: function (c) { return el._classes.has(c); },
        },
        appendChild: function (c) { el.children.push(c); return c; },
        remove: function () {},
        addEventListener: function (ev, fn) { (el._listeners[ev] = el._listeners[ev] || []).push(fn); },
        querySelector: function () { return makeEl('div'); },
        querySelectorAll: function () { return []; },
        getBoundingClientRect: function () { return { left: 0, top: 0, width: 800, height: 600 }; },
        setAttribute: function () {},
        removeAttribute: function () {},
    };
    Object.defineProperty(el, 'className', {
        get: function () { return Array.from(el._classes).join(' '); },
        set: function (v) { el._classes = new Set(String(v).split(/\s+/).filter(Boolean)); },
    });
    return el;
}

const timers = [];
const layerEl = makeEl('div');
global.document = {
    createElement: makeEl,
    getElementById: function (id) { return id === 'minigame-layer' ? layerEl : makeEl('div'); },
    querySelector: function () { return makeEl('div'); },
    querySelectorAll: function () { return []; },
    addEventListener: function () {},
    body: makeEl('body'),
};
global.window = global;
global.requestAnimationFrame = function () { return 1; };
global.setInterval = function (fn) { timers.push(fn); return timers.length; };
global.clearInterval = function () {};
global.setTimeout = function (fn) { try { fn(); } catch (e) { console.log('setTimeout error:', e.message); } return 1; };
global.clearTimeout = function () {};

const code = fs.readFileSync(path.join(__dirname, '..', 'minigames.js'), 'utf8');
try { eval(code); } catch (e) { console.log('LOAD ERROR:', e.message); process.exit(1); }
if (!global.TDMiniGames) { console.log('TDMiniGames NOT exposed'); process.exit(1); }

const hs = ['A|11.6|66.1', 'B|24.1|70.4', '1|31.2|56.8', '2|38.6|57.3', '3|47.2|58.3', '4|66.4|79.2', '5|70.8|85.6', '6|78.2|86.3'];
const hotspots = hs.map(function (s) { const p = s.split('|'); return { label: p[0], x: parseFloat(p[1]), y: parseFloat(p[2]), info: { fr: 'info ' + p[0], en: 'info ' + p[0] } }; });

const cfg = {
    type: 'scene_fouille', wide: true,
    title: { fr: 'Fouille', en: 'Search' },
    desc: { fr: 'Test', en: 'Test' }, time: 60,
    sceneImage: 'test.png', hotspots: hotspots,
    clue: { fr: 'clue', en: 'clue' },
};

try {
    global.TDMiniGames.play(cfg, 'fr', function (res) { console.log('onDone called, won =', res && res.won); });
    console.log('play() returned without throwing');
    console.log('layer active?', layerEl._classes.has('active'));
    timers.forEach(function (fn) { try { fn(); } catch (e) { console.log('TIMER ERROR:', e.message); } });
} catch (e) {
    console.log('PLAY ERROR:', e.message);
    console.log(e.stack.split('\n').slice(0, 4).join('\n'));
}
