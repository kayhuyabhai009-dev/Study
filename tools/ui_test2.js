// UI integration smoke test: loads ALL data files + main.js in a stubbed DOM context.
const fs = require('fs');
const vm = require('vm');

const files = [
    'js/data-formulas.js', 'js/data-formulas-mensuration.js',
    'js/data-topic-guides-1.js', 'js/data-topic-guides-2.js',
    'js/data-calculation.js', 'js/data-exams.js', 'js/data-pyq.js',
    'js/data-pyq-featured.js', 'js/data-pyq-legacy.js', 'js/data-pyq-pdf.js',
    'js/data-patterns-legacy.js', 'js/data-flashcards.js', 'js/data-notes.js',
    'js/data-notes-detailed-1.js', 'js/data-notes-detailed-2.js', 'js/data-mastery.js',
    'js/data-practice.js', 'js/data-practice-bank-1.js', 'js/data-practice-bank-2.js',
    'js/data-misc.js', 'js/data-advanced-topics.js', 'js/main.js'
];
let src = '';
for (const f of files) {
    let s = fs.readFileSync(f, 'utf8').replace(/\nif \(typeof module[\s\S]*$/, '');
    src += '\n/* ===== ' + f + ' ===== */\n' + s;
}
src += '\n;globalThis.__T = { PYQ_ALL, PATTERNS_ALL, FLASH_ALL, NOTES_ALL, MASTERY_ALL, MACRO_180_PLAN, legacyPyqToFull, quizAnswerIndex, pyqCard, pyqSolutionHtml, quizExplain, startQuiz, startFlashDeck, openNotesTopic, openMasteryTopic, toggleTimer, pyqLoadMore };';

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

let fails = 0;
function ok(cond, msg) {
    console.log((cond ? 'PASS' : 'FAIL') + ' | ' + msg);
    if (!cond) fails++;
}

ok(T.PYQ_ALL.length === 50 + 40 + 6601 + 3433, 'PYQ_ALL = ' + T.PYQ_ALL.length + ' (expect 10124)');
ok(T.PATTERNS_ALL.length >= 32, 'PATTERNS_ALL = ' + T.PATTERNS_ALL.length);
ok(T.FLASH_ALL.length === 260, 'FLASH_ALL = ' + T.FLASH_ALL.length);
ok(T.NOTES_ALL.length === 23, 'NOTES_ALL = ' + T.NOTES_ALL.length);
ok(T.MASTERY_ALL.topics.length === 11, 'MASTERY topics = ' + T.MASTERY_ALL.topics.length);
ok(!!(T.MASTERY_ALL.master && T.MASTERY_ALL.master.rules), 'MASTERY master present');

const legacy = T.PYQ_ALL.filter(q => q.src === 'legacy');
ok(legacy.length === 6601, 'legacy count 6601');
const badQ = legacy.filter(q => !q.question || !q.options || !q.options.length);
ok(badQ.length === 0, 'legacy all have question+options (bad=' + badQ.length + ')');
const noAns = legacy.filter(q => T.quizAnswerIndex(q) < 0);
console.log('INFO | legacy quiz-valid: ' + (legacy.length - noAns.length) + '/' + legacy.length);
const feat = T.PYQ_ALL.filter(q => q.src === 'featured');
ok(feat.every(q => T.quizAnswerIndex(q) >= 0), 'featured all quiz-valid');
const cur = T.PYQ_ALL.filter(q => q.src === 'curated');
ok(cur.every(q => T.quizAnswerIndex(q) >= 0), 'curated all quiz-valid');

for (const q of [cur[0], feat[0], legacy[0], legacy.find(x => x.options.length < 4)]) {
    try {
        const html = T.pyqCard(q);
        ok(html.includes('pyq-sol-' + q.id) && html.includes('togglePyqSolution'), 'pyqCard ' + q.id + ' (' + q.options.length + ' opts)');
        const sol = T.pyqSolutionHtml(q);
        ok(sol.includes('सही उत्तर') || sol.includes('उत्तर उपलब्ध'), 'pyqSolutionHtml ' + q.id);
        ok(T.quizExplain(q).length > 10, 'quizExplain ' + q.id);
    } catch (e) { ok(false, 'pyqCard ' + q.id + ' threw: ' + e.message); }
}

const lp = T.PATTERNS_ALL.filter(p => p.src === 'legacy');
ok(lp.length === 32 && lp.every(p => p.name), 'legacy patterns 32, all named');
const exShapes = new Set();
lp.forEach(p => (p.examples || []).forEach(e => exShapes.add(typeof e)));
ok(!exShapes.has('object'), 'legacy pattern examples are strings: ' + [...exShapes].join(','));

ok(T.FLASH_ALL.every(c => c.f && c.b && c.topic), 'flashcards f/b/topic complete');
ok(T.NOTES_ALL.every(t => t.sections.length && t.sections.every(s => s.h && s.b.length)), 'notes sections h/b complete');
ok(T.MASTERY_ALL.topics.every(t => t.weightage && t.plan.length && t.do.length && t.avoid.length &&
    t.tech.every(x => x.name && x.how) && t.worked.every(w => w.q && w.steps && w.steps.length && w.answer) &&
    t.daily && t.checklist.length && t.tips.length), 'mastery topics complete for renderer');
ok(T.MASTERY_ALL.master.phases.every(p => p.name && p.topics && p.why && p.daily), 'master phases complete');

ok(typeof T.MACRO_180_PLAN !== 'undefined' && T.MACRO_180_PLAN.phases.length === 3, 'MACRO_180_PLAN 3 phases');
ok(typeof T.startQuiz === 'function' && typeof T.startFlashDeck === 'function' &&
   typeof T.openNotesTopic === 'function' && typeof T.openMasteryTopic === 'function' &&
   typeof T.toggleTimer === 'function' && typeof T.pyqLoadMore === 'function', 'all new section handlers defined');

console.log(fails ? '\nRESULT: ' + fails + ' FAILURES' : '\nRESULT: ALL-CHECK-OK');
process.exit(fails ? 1 : 0);
