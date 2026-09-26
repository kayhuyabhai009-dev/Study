// V2 smoke test: 90-day challenge data, drill engine v2, user-system helpers,
// और index.html की सभी ज़रूरी IDs की मौजूदगी।
const fs = require('fs');
const vm = require('vm');

const files = [
    'js/data-formulas.js', 'js/data-formulas-mensuration.js',
    'js/data-topic-guides-1.js', 'js/data-topic-guides-2.js',
    'js/data-calculation.js', 'js/data-exams.js', 'js/data-exams-extended.js', 'js/data-pyq.js',
    'js/data-pyq-featured.js', 'js/data-pyq-legacy.js', 'js/data-pyq-pdf.js',
    'js/data-patterns-legacy.js', 'js/data-flashcards.js', 'js/data-notes.js',
    'js/data-notes-detailed-1.js', 'js/data-notes-detailed-2.js', 'js/data-mastery.js',
    'js/data-practice.js', 'js/data-practice-bank-1.js', 'js/data-practice-bank-2.js',
    'js/data-misc.js', 'js/data-advanced-topics.js', 'js/data-specialist-maths.js', 'js/data-pdf-analysis.js',
    'js/data-fast-tricks.js', 'js/data-challenge.js', 'js/main.js'
];
let src = '';
for (const f of files) {
    const s = fs.readFileSync(f, 'utf8').replace(/\nif \(typeof module[\s\S]*$/, '');
    src += '\n/* ===== ' + f + ' ===== */\n' + s;
}

let fails = 0;
function ok(cond, msg) {
    console.log((cond ? 'PASS' : 'FAIL') + ' | ' + msg);
    if (!cond) fails++;
}

// ===== index.html ज़रूरी ID जाँच =====
const html = fs.readFileSync('index.html', 'utf8');
const WANT_IDS = [
    'user-modal', 'user-name-input', 'user-modal-hint', 'user-quick-list', 'user-name-save',
    'menu-toggle', 'drawer-scrim', 'topbar-title', 'chip-streak', 'chip-xp',
    'side-user-name', 'side-user-avatar', 'side-user-level', 'side-user-xpbar',
    'hero-greet', 'hero-date', 'hero-quote', 'hero-streak', 'hero-ch-ring', 'hero-ch-info', 'hero-ch-action',
    'ch-stage',
    'drill-duration', 'drill-difficulty', 'calc-scorecard',
    'calc-workout-status', 'calc-workout-play', 'wo-qno', 'wo-qtotal', 'wo-score', 'wo-question', 'wo-input', 'wo-check', 'wo-feedback',
    'daily-header', 'quiz-start', 'pyq-search', 'flash-topic', 'notes-pills', 'error-modal',
    'profile-user-line', 'achievements-list'
];
const missingIds = WANT_IDS.filter(id => !html.includes('id="' + id + '"'));
ok(missingIds.length === 0, 'index.html में सभी v2 IDs (' + WANT_IDS.length + ')' + (missingIds.length ? ' — छूटी: ' + missingIds.join(',') : ''));

const scripts = [...html.matchAll(/<script src="([^"]+)"/g)].map(m => m[1]);
ok(scripts.includes('js/data-challenge.js') && scripts.indexOf('js/data-challenge.js') < scripts.indexOf('js/main.js'), 'data-challenge.js main.js से पहले loaded');
for (const s of scripts) ok(fs.existsSync(s), 'script exists: ' + s);
for (const l of [...html.matchAll(/<link rel="stylesheet" href="([^"]+)"/g)].map(m => m[1])) ok(fs.existsSync(l), 'css exists: ' + l);

// ===== VM में डेटा + रीजन =====
src += '\n;globalThis.__T = { CHALLENGE_90, CHALLENGE_PHASES, CH_MILESTONES, CH_WEEK_ORDER, DRILLS, DIFF_LABEL, genDrillQuestion, updateDrillHistoryAfter, currentUser, getUsersList, rememberUser, normalizeState, esc, seededRandom, hindiGreeting, stateKeyFor };';

const store = {};
const ctx = {
    console, alert: () => {}, confirm: () => false,
    localStorage: {
        getItem: k => (k in store ? store[k] : null),
        setItem: (k, v) => { store[k] = String(v); },
        removeItem: k => { delete store[k]; }
    },
    window: { matchMedia: () => ({ matches: false }), scrollTo: () => {}, AudioContext: undefined },
    document: {
        addEventListener: () => {}, querySelectorAll: () => [], querySelector: () => null,
        getElementById: () => null, createElement: () => ({ classList: { toggle: () => {} }, setAttribute: () => {}, addEventListener: () => {} })
    },
    setInterval: () => 0, clearInterval: () => {}, setTimeout: () => 0
};
ctx.window.window = ctx.window;
vm.createContext(ctx);
vm.runInContext(src, ctx);
const T = ctx.__T;

// ===== चैलेंज डेटा =====
ok(T.CHALLENGE_90.length === 90, 'CHALLENGE_90 = 90 दिन');
ok(T.CH_WEEK_ORDER.length === 13, '13 सप्ताह');
ok(T.CHALLENGE_PHASES.length === 6 && T.CH_MILESTONES.length === 9, '6 चरण / 9 milestones');
ok(T.CHALLENGE_90.every((d, i) => d.d === i + 1), 'days 1..90 sequential');
ok(T.CHALLENGE_90.every(d => ['learn', 'revise', 'test', 'mock'].includes(d.type)), 'सभी day types valid');
ok(T.CHALLENGE_90.every(d => Array.isArray(d.tasks) && d.tasks.length >= 3), 'हर दिन 3+ tasks');
ok(T.CHALLENGE_90.every(d => d.tasks.every(t => t.i && t.t && (!t.go || (Array.isArray(t.go) && t.go.length >= 1)))), 'tasks with ids + valid go tuples');
ok(T.CHALLENGE_90.every(d => Array.isArray(d.rev) && Array.isArray(d.calc) && d.calc.length >= 1), 'हर दिन revision + calc drill');
ok(T.CHALLENGE_90.every(d => typeof d.mins === 'number' && d.mins >= 30 && d.mins <= 150), 'हर दिन realistic minutes (30-150 सहित)');
ok(T.CHALLENGE_90.every(d => d.title && d.sub), 'हर दिन title + sub');
ok(T.CHALLENGE_90.every(d => d.calc.every(g => T.DRILLS.some(D => D.gen === g))), 'सभी calc gens, मौजूदा drills में');
const learnDays = T.CHALLENGE_90.filter(d => d.type === 'learn').length;
const testDays = T.CHALLENGE_90.filter(d => d.type === 'test').length;
const mockDays = T.CHALLENGE_90.filter(d => d.type === 'mock').length;
ok(learnDays >= 60 && testDays >= 10 && mockDays >= 2, 'समता: learn=' + learnDays + ' test=' + testDays + ' mock=' + mockDays);

// ===== DRILLS 2.0 =====
ok(T.DRILLS.length === 16, '16 drills (expect 16)');
ok(T.DRILLS.every(d => d.target >= 8), 'हर drill में target');
ok(T.DIFF_LABEL.length === 3, '3 कठिनाई labels');
let badQ = 0;
for (const d of T.DRILLS) {
    for (let diff = 0; diff < 3; diff++) {
        for (let k = 0; k < 8; k++) {
            const q = T.genDrillQuestion(d.gen, diff);
            if (!q || !q.q || typeof q.a === 'undefined' || Number.isNaN(q.a)) badQ++;
        }
    }
}
ok(badQ === 0, 'genDrillQuestion: 16 gens × 3 diffs × 8 samples सब valid');

// ===== यूज़र-सिस्टम हेल्पर्स =====
ok(T.esc('<b>&"x</b>') === '&lt;b&gt;&amp;&quot;x&lt;/b&gt;', 'esc() HTML-escapes');
ok(Array.isArray(T.getUsersList()), 'users list array');
ok(T.currentUser() === null, 'बिना login currentUser null');
T.rememberUser('राहुल');
ok(T.currentUser() === 'राहुल' && T.getUsersList()[0] === 'राहुल', 'rememberUser: नाम persist (लॉगआउट तक)');
T.rememberUser('सीमा'); T.rememberUser('राहुल');
ok(T.getUsersList()[0] === 'राहुल' && T.getUsersList().length === 2, 'quick-list dedupe + recent-first');
ok(T.stateKeyFor('राहुल') === 'gg-state-राहुल', 'प्रति-उपयोगकर्ता state key');
ok(typeof T.hindiGreeting() === 'string' && T.hindiGreeting().length > 3, 'hindiGreeting() काम करता है');
const ns = T.normalizeState({ xp: 'x' });
ok(ns.xp === 0 && ns.challenge && typeof ns.challenge.done === 'object' && Array.isArray(ns.drillHistory), 'normalizeState default-safe');

// ===== drill history cap =====
vm.runInContext('(function(){ for (let i=0;i<70;i++) updateDrillHistoryAfter({gen:"tables",score:2,correct:1,wrong:0,totalSecs:60,diff:1}); })()', ctx);
const histLen = vm.runInContext('state.drillHistory.length', ctx);
ok(histLen === 60, 'drill history capped at 60 (got ' + histLen + ')');

if (fails) { console.error('RESULT: FAIL (' + fails + ')'); process.exit(1); }
console.log('RESULT: ALL-CHECK-OK');
