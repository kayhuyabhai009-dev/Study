#!/usr/bin/env node
/* ============================================================
   research_test.js — merged research platform + PYQ analysis की
   data-integrity जाँच (कोई browser/jsddom ज़रूरत नहीं)।

   जाँचता है:
   - research/ platform के सभी data files मौजूद और संख्याएँ consistent
   - js/data-pyq-analysis.js के aggregates असली PYQ डेटा से मिलते हैं
   - index.html में नए sections/IDs/scripts लगे हैं
   - embedded-mode patches (chrome.js, data.js) मौजूद हैं
   ============================================================ */
'use strict';

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
let fails = 0;
const ok = (c, m) => { console.log((c ? 'PASS' : 'FAIL') + ' | ' + m); if (!c) fails++; };

/* ---------- research platform files ---------- */
const R = 'research';
ok(fs.existsSync(path.join(root, R)), 'research/ फोल्डर मौजूद');
const htmlPages = ['index.html', 'exams.html', 'exam.html', 'library.html', 'paper.html',
    'important.html', 'hierarchy.html', 'patterns.html', 'formulas.html', 'compare.html',
    'learn.html', 'skills.html', 'mistakes.html', 'cis.html', 'tracker.html',
    'calendar.html', 'methodology.html'];
htmlPages.forEach(p => ok(fs.existsSync(path.join(root, R, p)), 'research/' + p + ' मौजूद'));
['index.json', 'topics.json', 'important_index.json', 'hierarchy_formulas.json',
    'papers_index.json', 'questions_text_index.json', 'aggregates.json', 'exams.json',
    'challenge.json', 'calendar.json', 'patterns.json', 'cis.json', 'edges.json',
    'exams_topics.json', 'yt_analysis.json'].forEach(f =>
    ok(fs.existsSync(path.join(root, R, 'data', f)), 'research/data/' + f + ' मौजूद'));

/* ---------- research data संख्याएँ ---------- */
const idx = JSON.parse(fs.readFileSync(path.join(root, R, 'data/index.json'), 'utf8'));
ok(idx.totals.papers === 1687, 'research: 1,687 papers', String(idx.totals.papers));
ok(idx.totals.records === 42634, 'research: 42,634 records', String(idx.totals.records));
ok(idx.totals.certain === 35704, 'research: 35,704 certain', String(idx.totals.certain));
ok(idx.totals.topics === 35, 'research: 35 topics', String(idx.totals.topics));
ok(idx.totals.sub_topics === 154, 'research: 154 sub-topics', String(idx.totals.sub_topics));
ok(idx.totals.concepts === 295, 'research: 295 concepts', String(idx.totals.concepts));

const topics = JSON.parse(fs.readFileSync(path.join(root, R, 'data/topics.json'), 'utf8'));
ok(Array.isArray(topics) && topics.length === 35, 'topics.json: 35 chapters');
const subCount = topics.reduce((n, t) => n + t.sub_topics.length, 0);
ok(subCount === 154, 'topics.json: 154 sub-topics', String(subCount));
const conceptCount = topics.reduce((n, t) => n + t.sub_topics.reduce((m, s) => m + s.concepts.length, 0), 0);
ok(conceptCount === 295, 'topics.json: 295 concepts', String(conceptCount));

const qbtDir = path.join(root, R, 'data/questions_by_topic');
const qbtFiles = fs.readdirSync(qbtDir).filter(f => f.endsWith('.json'));
ok(qbtFiles.length === 32, 'questions_by_topic: 32 topic files', String(qbtFiles.length));
let qbtTotal = 0, qbtCertain = 0;
qbtFiles.forEach(f => {
    const j = JSON.parse(fs.readFileSync(path.join(qbtDir, f), 'utf8'));
    qbtTotal += j.total || 0;
    qbtCertain += j.certain || 0;
});
ok(qbtTotal === 40894, 'questions_by_topic: कुल 40,894 records', String(qbtTotal));
ok(qbtCertain > 34000 && qbtCertain <= 35704, 'questions_by_topic: certain plausible', String(qbtCertain));

const papersIndex = JSON.parse(fs.readFileSync(path.join(root, R, 'data/papers_index.json'), 'utf8'));
ok(Array.isArray(papersIndex) && papersIndex.length === 1687, 'papers_index: 1,687 rows', String(papersIndex.length));
const papersDir = path.join(root, R, 'data/papers');
const paperFiles = fs.readdirSync(papersDir).filter(f => f.endsWith('.json'));
ok(paperFiles.length >= 1600, 'papers/: per-paper detail files', String(paperFiles.length));
// papers_index की हर row एक paper file होनी चाहिए (या जानबूझकर missing)
const have = new Set(paperFiles.map(f => f.replace(/\.json$/, '')));
const missing = papersIndex.filter(r => !have.has(r.i)).length;
ok(missing <= 10, 'papers_index: लगभग सभी paper files मौजूद (missing ' + missing + ')');

const qtIndex = JSON.parse(fs.readFileSync(path.join(root, R, 'data/questions_text_index.json'), 'utf8'));
ok(!Array.isArray(qtIndex) && Object.keys(qtIndex).length >= 1600,
    'questions_text_index: papers indexed', String(Object.keys(qtIndex).length));
const qtDir = path.join(root, R, 'data/questions_text');
const qtFiles = fs.readdirSync(qtDir).filter(f => f.endsWith('.json'));
ok(qtFiles.length <= Object.keys(qtIndex).length,
    'questions_text: files ≤ index rows (कुछ papers के पास text file नहीं)',
    qtFiles.length + ' vs ' + Object.keys(qtIndex).length);
const qtOrphan = qtFiles.filter(f => !qtIndex[f.replace(/\.json$/, '')]).length;
ok(qtOrphan === 0, 'questions_text: हर file index में मौजूद', String(qtOrphan) + ' orphan');

/* ---------- embedded-mode patches ---------- */
const chrome = fs.readFileSync(path.join(root, R, 'js/chrome.js'), 'utf8');
ok(chrome.includes('gems-embedded'), 'chrome.js: embedded mode मौजूद');
ok(chrome.includes('isEmbedded'), 'chrome.js: isEmbedded() मौजूद');
const dataJs = fs.readFileSync(path.join(root, R, 'js/data.js'), 'utf8');
ok(dataJs.includes('unhandledrejection'), 'data.js: unhandled-rejection guard मौजूद');
const impJs = fs.readFileSync(path.join(root, R, 'js/important.js'), 'utf8');
ok(impJs.includes('URLSearchParams(location.search).get("topic")'), 'important.js: ?topic= डीप-लिंक');
const learnJs = fs.readFileSync(path.join(root, R, 'js/learn.js'), 'utf8');
ok(learnJs.includes('URLSearchParams(location.search).get("chapter")'), 'learn.js: ?chapter= डीप-लिंक');

/* ---------- PYQ analysis aggregates ---------- */
const paSrc = fs.readFileSync(path.join(root, 'js/data-pyq-analysis.js'), 'utf8');
ok(paSrc.includes('const PYQ_ANALYSIS'), 'data-pyq-analysis.js: PYQ_ANALYSIS export');
const paMod = {};
new Function('module', paSrc + '\nmodule.exports = PYQ_ANALYSIS;')(paMod);
const PA = paMod.exports;
ok(PA && PA.totals.questions === 10124, 'PYQ analysis: 10,124 प्रश्न', PA ? String(PA.totals.questions) : 'undefined');

// असली PYQ डेटा से मिलान
const parts = ['js/data-pyq.js', 'js/data-pyq-legacy.js', 'js/data-pyq-pdf.js', 'js/data-pyq-featured.js']
    .map(f => fs.readFileSync(path.join(root, f), 'utf8')).join('\n');
const pyqMod = {};
new Function('module', parts + '\nmodule.exports={PYQ_BANK,PYQ_BANK_LEGACY,PYQ_BANK_PDF,PYQ_FEATURED};')(pyqMod);
const { PYQ_BANK, PYQ_BANK_LEGACY, PYQ_BANK_PDF, PYQ_FEATURED } = pyqMod.exports;
const realIds = new Set([
    ...PYQ_BANK.map(q => String(q.id)), ...PYQ_FEATURED.map(q => String(q.id)),
    ...PYQ_BANK_LEGACY.map(q => String(q.id)), ...PYQ_BANK_PDF.map(q => String(q.id))
]);
ok(realIds.size === 10124, 'PYQ डेटा: 10,124 unique ids', String(realIds.size));

let paSum = 0, paIds = 0, badIds = 0, patternMismatch = 0;
PA.topics.forEach(t => {
    paSum += t.total;
    let patSum = 0;
    t.patterns.forEach(p => {
        patSum += p.count;
        p.ids.forEach(id => { paIds++; if (!realIds.has(String(id))) badIds++; });
    });
    if (patSum !== t.total) patternMismatch++;
    // हर topic के ids कुल तय नहीं होते — patterns ids का गुणा ही topic total है
    ok(patSum === t.total, 'analysis: "' + t.name + '" patterns कुल = topic कुल (' + t.total + ')');
});
ok(paSum === 10124, 'analysis: सभी topic कुल = 10,124', String(paSum));
ok(paIds === 10124, 'analysis: सभी pattern ids = 10,124', String(paIds));
ok(badIds === 0, 'analysis: हर id असली PYQ डेटा में मौजूद', String(badIds) + ' बेमान');
ok(patternMismatch === 0, 'analysis: pattern/topic गणना मेल खाती है');
ok(PA.topics.every(t => t.research && t.research.total >= 0), 'analysis: हर topic में research totals');
const withResearch = PA.topics.filter(t => t.research.total > 0).length;
ok(withResearch >= 20, 'analysis: 20+ topics research records से जुड़े', String(withResearch));

/* ---------- index.html integration ---------- */
const indexHtml = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
['id="pyq-analysis"', 'id="research"', 'id="pa-summary"', 'id="pa-topics"', 'id="pa-detail"',
    'id="rs-tabbar"', 'id="rs-frame"', 'id="learn-research-bridge"', 'id="challenge-research-bridge"',
    'data-section="pyq-analysis"', 'data-section="research"',
    'js/data-pyq-analysis.js', 'js/research-hub.js'].forEach(s =>
    ok(indexHtml.includes(s), 'index.html: ' + s));

const hub = fs.readFileSync(path.join(root, 'js/research-hub.js'), 'utf8');
['RESEARCH_PAGES', 'initResearchHub', 'openResearchPage', 'ensureResearchFrame',
    'initPyqAnalysis', 'openPaTopic', 'renderLearnResearchBridge'].forEach(fn =>
    ok(hub.includes('function ' + fn) || hub.includes(fn + ' ='), 'research-hub.js: ' + fn));
const mainJs = fs.readFileSync(path.join(root, 'js/main.js'), 'utf8');
ok(mainJs.includes("initResearchHub();"), 'main.js: initResearchHub boot में');
ok(mainJs.includes("initPyqAnalysis();"), 'main.js: initPyqAnalysis boot में');
ok(mainJs.includes("syncResearchTheme"), 'main.js: theme → iframe sync');

console.log('');
if (fails) { console.error('RESULT: FAIL (' + fails + ')'); process.exit(1); }
console.log('RESULT: RESEARCH-ALL-OK');
