// Learn-fix + guides test
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
for (const f of files) src += '\n/*' + f + '*/\n' + fs.readFileSync(f, 'utf8').replace(/\nif \(typeof module[\s\S]*$/, '');
src += '\n;globalThis.__T = { FORMULA_BOOK, TOPIC_GUIDES, LEARN_TOPICS, guidePanelHtml, renderLearn };';
const store = {};
const ctx = {
    console, alert: () => {}, confirm: () => false,
    localStorage: { getItem: k => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); }, removeItem: k => { delete store[k]; } },
    window: { matchMedia: () => ({ matches: false }), scrollTo: () => {} },
    document: { addEventListener: () => {}, querySelectorAll: () => [], querySelector: () => null, getElementById: () => null, createElement: () => ({ classList: { toggle: () => {} }, setAttribute: () => {}, addEventListener: () => {} }) },
    setInterval: () => 0, clearInterval: () => {}, setTimeout: () => 0
};
vm.createContext(ctx);
vm.runInContext(src, ctx);
const T = ctx.__T;
let fails = 0;
const ok = (c, m) => { console.log((c ? 'PASS' : 'FAIL') + ' | ' + m); if (!c) fails++; };

ok(T.FORMULA_BOOK.length === 17, 'FORMULA_BOOK chapters = ' + T.FORMULA_BOOK.length + ' (expect 17)');
ok(T.FORMULA_BOOK.every(c => c.id && c.name && c.formulas.length >= 5), 'all chapters have 5+ detailed formulas');
const mens = T.FORMULA_BOOK.filter(c => c.id.startsWith('mensuration'));
ok(mens.length === 2 && mens.every(c => c.formulas.length >= 14), 'mensuration 2D/3D present with 14+ formulas each');
ok(T.TOPIC_GUIDES.length === 17, 'TOPIC_GUIDES = ' + T.TOPIC_GUIDES.length);
// every learn card opens a real chapter
const chIds = new Set(T.FORMULA_BOOK.map(c => c.id));
const broken = T.LEARN_TOPICS.filter(t => !chIds.has(t.chapter));
ok(broken.length === 0, 'all 17 learn cards map to chapters (broken=' + broken.length + ')');
// every chapter has a guide
const gIds = new Set(T.TOPIC_GUIDES.map(g => g.id));
const noGuide = T.FORMULA_BOOK.filter(c => !gIds.has(c.id));
ok(noGuide.length === 0, 'all chapters have guides (missing=' + noGuide.map(c => c.id).join(',') + ')');
// guide completeness
ok(T.TOPIC_GUIDES.every(g => g.exams.cgl1 && g.exams.cgl2 && g.exams.chsl && g.exams.ntpc && g.exams.groupd &&
    g.syllabus.length >= 6 && g.types.length >= 6 && g.traps.length >= 4 && g.plan.length >= 5 && g.books && g.target),
    'guides complete (exams/syllabus/types/traps/plan/books/target)');
// panel renders for every guide
try {
    for (const g of T.TOPIC_GUIDES) {
        const h = T.guidePanelHtml(g);
        if (!h.includes('वेटेज') || !h.includes('माइक्रो-प्लान')) throw new Error('panel incomplete for ' + g.id);
    }
    ok(true, 'guidePanelHtml renders all 17 guides');
} catch (e) { ok(false, e.message); }
console.log(fails ? 'RESULT: ' + fails + ' FAILURES' : 'RESULT: ALL-CHECK-OK');
process.exit(fails ? 1 : 0);
