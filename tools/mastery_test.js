#!/usr/bin/env node
/* ============================================================
   mastery_test.js — "मास्टरी मार्ग" (Learn + Challenge) की जाँच।

   - js/data-mastery-path.js: 35 topics · 154 sub-topics · 295 concepts,
     हर concept में हिंदी समझ + definition + difficulty + exam-mapping,
     formulas, prerequisites (सभी resolved), sub-topic concept-tags
     (counts + कठिनाई), प्रश्न-प्रकार, PYQ shortcut labels
   - CHALLENGE_MASTERY: 90 दिन + 13 सप्ताह mapping, हर learn-दिन mapped
   - research hierarchy से exact मेल (topics.json/sub-topic/concept counts)
   - index.html + mastery.js + main.js integration
   ============================================================ */
'use strict';

const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
let fails = 0;
const ok = (c, m) => { console.log((c ? 'PASS' : 'FAIL') + ' | ' + m); if (!c) fails++; };

/* ---------- data files ---------- */
ok(fs.existsSync(path.join(root, 'js/data-mastery-path.js')), 'js/data-mastery-path.js मौजूद');
ok(fs.existsSync(path.join(root, 'js/mastery.js')), 'js/mastery.js मौजूद');
// पुराना MASTERY roadmap डेटा सुरक्षित है (overwrite नहीं हुआ)
const oldMastery = fs.readFileSync(path.join(root, 'js/data-mastery.js'), 'utf8');
ok(oldMastery.includes('const MASTERY = {'), 'js/data-mastery.js (मास्टरी रोडमैप) बरकरार');
ok(!oldMastery.includes('MASTERY_DATA'), 'data-mastery.js में नया डेटा गलत जगह नहीं लिखा');

const src = fs.readFileSync(path.join(root, 'js/data-mastery-path.js'), 'utf8');
const mod = {};
new Function('module', src + '\nmodule.exports = { MASTERY_DATA, CHALLENGE_MASTERY };')(mod);
const { MASTERY_DATA, CHALLENGE_MASTERY } = mod.exports;

/* ---------- research hierarchy से exact मेल ---------- */
const topicsJson = JSON.parse(fs.readFileSync(path.join(root, 'research/data/topics.json'), 'utf8'));
ok(MASTERY_DATA.topics.length === 35, 'MASTERY_DATA: 35 topics', String(MASTERY_DATA.topics.length));
ok(MASTERY_DATA.totals.subTopics === 154, 'totals: 154 sub-topics', String(MASTERY_DATA.totals.subTopics));
ok(MASTERY_DATA.totals.concepts === 295, 'totals: 295 concepts', String(MASTERY_DATA.totals.concepts));
ok(MASTERY_DATA.totals.formulas === 480, 'totals: 480 formulas', String(MASTERY_DATA.totals.formulas));

// हर research topic MASTERY_DATA में है, उसी order में
const rNames = topicsJson.map(t => t.name);
const mNames = MASTERY_DATA.topics.map(t => t.name);
ok(JSON.stringify(rNames) === JSON.stringify(mNames), 'topic names + order research से मेल खाते हैं');

// concept-level मेल
let conceptMismatch = 0, hiMissing = 0, defMissing = 0, diffMissing = 0, examMapMissing = 0;
topicsJson.forEach((rt, i) => {
    const mt = MASTERY_DATA.topics[i];
    if (mt.sub_topics.length !== rt.sub_topics.length) { conceptMismatch++; return; }
    rt.sub_topics.forEach((rs, j) => {
        const ms = mt.sub_topics[j];
        if (ms.name !== rs.name || ms.concepts.length !== rs.concepts.length) { conceptMismatch++; return; }
        rs.concepts.forEach((rc, k) => {
            const mc = ms.concepts[k];
            if (mc.id !== rc.id || mc.name !== rc.name) conceptMismatch++;
            if (!mc.hi) hiMissing++;
            if (!mc.def) defMissing++;
            if (!mc.diff) diffMissing++;
            if (!mc.examMap) examMapMissing++;
        });
    });
});
ok(conceptMismatch === 0, 'हर sub-topic/concept research से exact मेल', String(conceptMismatch) + ' mismatches');
ok(hiMissing === 0, 'हर concept में हिंदी समझ', String(hiMissing) + ' missing');
ok(defMissing === 0, 'हर concept में definition', String(defMissing) + ' missing');
ok(diffMissing === 0, 'हर concept में difficulty', String(diffMissing) + ' missing');
ok(examMapMissing === 0, 'हर concept में exam-mapping', String(examMapMissing) + ' missing');

// formulas + prerequisites
const withFormulas = MASTERY_DATA.topics.reduce((n, t) =>
    n + t.sub_topics.reduce((m, s) => m + s.concepts.filter(c => c.formulas.length > 0).length, 0), 0);
ok(withFormulas >= 80, 'formulas जुड़े concepts (≥80)', String(withFormulas));
const withPre = MASTERY_DATA.topics.reduce((n, t) =>
    n + t.sub_topics.reduce((m, s) => m + s.concepts.filter(c => c.pre.length > 0).length, 0), 0);
ok(withPre >= 30, 'prerequisites वाले concepts (≥30)', String(withPre));

// concept-tags (किस concept से कितने प्रश्न)
const tagTotal = MASTERY_DATA.topics.reduce((n, t) =>
    n + t.sub_topics.reduce((m, s) => m + s.tags.length, 0), 0);
ok(tagTotal >= 200, 'sub-topic concept-tags (≥200)', String(tagTotal));
const tagCountSum = MASTERY_DATA.topics.reduce((n, t) =>
    n + t.sub_topics.reduce((m, s) => m + s.tags.reduce((k, tg) => k + tg.c, 0), 0), 0);
ok(tagCountSum > 20000, 'tag question-counts (≥20K occurrences)', String(tagCountSum));
const withTypes = MASTERY_DATA.topics.filter(t => t.sub_topics.some(s => Object.keys(s.types).length > 0)).length;
ok(withTypes >= 20, 'प्रश्न-प्रकार (types) वाले topics (≥20)', String(withTypes));
const withTricks = MASTERY_DATA.topics.filter(t => t.sub_topics.some(s => s.tricks.length > 0)).length;
ok(withTricks >= 15, 'PYQ shortcut-label वाले topics (≥15)', String(withTricks));
const withPatterns = MASTERY_DATA.topics.filter(t => t.patterns.length > 0).length;
ok(withPatterns >= 6, 'curated shortcut-pattern वाले topics (≥6)', String(withPatterns));

// exam split + main-site PYQ counts
const withExams = MASTERY_DATA.topics.filter(t => Object.keys(t.exams).length > 0).length;
ok(withExams >= 25, 'exam-split वाले topics (≥25)', String(withExams));
const mainPyqTotal = MASTERY_DATA.topics.reduce((n, t) => n + t.mainPyq, 0);
ok(mainPyqTotal === 10124, 'main-site PYQ counts कुल = 10,124', String(mainPyqTotal));

/* ---------- challenge mapping ---------- */
ok(CHALLENGE_MASTERY.days.length === 90, 'CHALLENGE_MASTERY: 90 दिन', String(CHALLENGE_MASTERY.days.length));
ok(CHALLENGE_MASTERY.weeks.length === 13, 'CHALLENGE_MASTERY: 13 सप्ताह');
const learnDays = CHALLENGE_MASTERY.days.filter(d => d.type === 'learn');
ok(learnDays.every(d => d.topics.length > 0), 'हर learn-दिन के topics mapped',
    String(learnDays.filter(d => !d.topics.length).length) + ' बिना mapping');
ok(learnDays.every(d => d.topics.every(t => t.concepts > 0 && t.certain >= 0)), 'हर mapped topic में concepts + records');
const wkWithRecords = CHALLENGE_MASTERY.weeks.filter(w => w.records > 0).length;
ok(wkWithRecords === 13, 'सभी 13 सप्ताहों में exact records', String(wkWithRecords));
// असली चैलेंज डेटा से day numbers मेल
const chSrc = fs.readFileSync(path.join(root, 'js/data-challenge.js'), 'utf8');
const chDays = new Function(chSrc + '\n; return CHALLENGE_90;')() || [];
ok(chDays.length === 90 && CHALLENGE_MASTERY.days.every((d, i) => d.d === chDays[i].d),
    'चैलेंज day-numbers exact मेल');

/* ---------- integration ---------- */
const indexHtml = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
['id="mastery-hero"', 'id="mastery-topics"', 'id="mastery-detail"', 'id="mastery-search"',
    'id="mastery-chips"', 'id="concepts-mastered-value"',
    'js/data-mastery-path.js', 'js/mastery.js', 'css/mastery-v3.css'].forEach(s =>
    ok(indexHtml.includes(s), 'index.html: ' + s));
// data-mastery.js सिर्फ एक बार लोड हो (duplicate declaration बग)
const masteryTagCount = (indexHtml.match(/js\/data-mastery\.js/g) || []).length;
ok(masteryTagCount === 1, 'data-mastery.js एक ही script tag में', String(masteryTagCount));
const pathTagCount = (indexHtml.match(/js\/data-mastery-path\.js/g) || []).length;
ok(pathTagCount === 1, 'data-mastery-path.js एक ही script tag में', String(pathTagCount));

const masteryJs = fs.readFileSync(path.join(root, 'js/mastery.js'), 'utf8');
['renderMasteryPath', 'initMastery', 'openMasteryTopic', 'renderMasteryDetail', 'setConceptStage',
    'conceptStage', 'masteryStats', 'chMasteryHtml', 'chWeekMasteryHtml', 'resetConceptMastery'].forEach(fn =>
    ok(masteryJs.includes('function ' + fn), 'mastery.js: ' + fn));

const mainJs = fs.readFileSync(path.join(root, 'js/main.js'), 'utf8');
ok(mainJs.includes('initMastery();'), 'main.js: boot में initMastery');
ok(mainJs.includes('concepts: {}'), 'main.js: DEFAULT_STATE में concepts tracker');
ok(mainJs.includes("'concepts'"), 'main.js: normalizeState में concepts');
ok(mainJs.includes('chMasteryHtml(day)'), 'main.js: चैलेंज day में mastery panel');
ok(mainJs.includes('chWeekMasteryHtml(wNo)'), 'main.js: चैलेंज week में exact analysis');
ok(mainJs.includes('concepts-mastered-value'), 'main.js: dashboard concept stat');
ok(mainJs.includes("renderMasteryPath(filter)"), 'main.js: renderLearn → mastery path');

console.log('');
if (fails) { console.error('RESULT: FAIL (' + fails + ')'); process.exit(1); }
console.log('RESULT: MASTERY-ALL-OK');
