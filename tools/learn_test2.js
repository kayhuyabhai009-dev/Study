// Learn-fix + guides test
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
    'js/data-misc.js', 'js/data-advanced-topics.js', 'js/data-specialist-maths.js', 'js/data-pdf-analysis.js', 'js/data-fast-tricks.js', 'js/main.js'
];
let src = '';
for (const f of files) src += '\n/*' + f + '*/\n' + fs.readFileSync(f, 'utf8').replace(/\nif \(typeof module[\s\S]*$/, '');
src += '\n;globalThis.__T = { FORMULA_BOOK, TOPIC_GUIDES, LEARN_TOPICS, guidePanelHtml };';
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

ok(T.FORMULA_BOOK.length === 19, 'chapters = ' + T.FORMULA_BOOK.length + ' (expect 19, no dupes)');
const ids = T.FORMULA_BOOK.map(c => c.id);
ok(new Set(ids).size === ids.length, 'no duplicate chapter ids');
const mens = T.FORMULA_BOOK.filter(c => c.id.startsWith('mensuration'));
ok(mens.length === 2 && mens.every(c => c.formulas.length >= 20), 'mensuration enriched: ' + mens.map(c => c.formulas.length).join('/'));
ok(T.FORMULA_BOOK.every(c => c.formulas.every(f => f.name && f.rule && f.explain && f.example && f.trap && f.pyq && f.pyqAns)), 'all formulas complete (7 fields)');
ok(T.TOPIC_GUIDES.length === 19, 'TOPIC_GUIDES = ' + T.TOPIC_GUIDES.length);
const chIds = new Set(ids);
const broken = T.LEARN_TOPICS.filter(t => !chIds.has(t.chapter));
ok(broken.length === 0, 'all 19 learn cards map to chapters (broken=' + broken.length + ')');
const gIds = new Set(T.TOPIC_GUIDES.map(g => g.id));
const noGuide = T.FORMULA_BOOK.filter(c => !gIds.has(c.id));
ok(noGuide.length === 0, 'all chapters have guides');
ok(T.TOPIC_GUIDES.every(g => g.exams.cgl1 && g.exams.cgl2 && g.exams.chsl && g.exams.ntpc && g.exams.groupd &&
    g.syllabus.length >= 6 && g.types.length >= 6 && g.traps.length >= 4 && g.plan.length >= 5 && g.books && g.target),
    'guides complete');
try {
    for (const g of T.TOPIC_GUIDES) {
        const h = T.guidePanelHtml(g);
        if (!h.includes('वेटेज') || !h.includes('माइक्रो-प्लान')) throw new Error('panel incomplete for ' + g.id);
    }
    ok(true, 'guidePanelHtml renders all 19 guides');
} catch (e) { ok(false, e.message); }
console.log(fails ? 'RESULT: ' + fails + ' FAILURES' : 'RESULT: ALL-CHECK-OK');
process.exit(fails ? 1 : 0);
