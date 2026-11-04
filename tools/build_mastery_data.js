#!/usr/bin/env node
/* ============================================================
   build_mastery_data.js — "मास्टरी मार्ग" का डेटा बनाता है।

   Research platform की पूरी hierarchy (35 topics → 154 sub-topics
   → 295 concepts) + हर concept की Hindi समझ, definition, formulas,
   prerequisites, exam-mapping — और हर sub-topic के concept-tags
   (किस concept से कितने प्रश्न, कठिनाई, प्रश्न-प्रकार, shortcut
   labels) — सब एक compact JSON में: js/data-mastery.js

   साथ ही CHALLENGE_MASTERY: मुख्य site के 90-दिन चैलेंज के हर दिन
   के topics को exact research आँकड़ों (records, concepts,
   sub-topics) से जोड़ता है।

   चलाना:  node tools/build_mastery_data.js
   ============================================================ */
'use strict';

const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');

const readJSON = p => JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'));

/* ---------- research data ---------- */
const topics = readJSON('research/data/topics.json');
const formulas = readJSON('research/data/hierarchy_formulas.json');
const papersIndex = readJSON('research/data/papers_index.json');
const paperExam = {};
papersIndex.forEach(p => { paperExam[p.i] = p.e; });

/* ---------- main-site data ---------- */
const paSrc = fs.readFileSync(path.join(root, 'js/data-pyq-analysis.js'), 'utf8');
const paMod = {};
new Function('module', paSrc + '\nmodule.exports = PYQ_ANALYSIS;')(paMod);
const PA = paMod.exports;

const patternSrc = fs.readFileSync(path.join(root, 'js/data-patterns-legacy.js'), 'utf8');
let PATTERNS_LEGACY = [];
try { PATTERNS_LEGACY = new Function(patternSrc + '; return PATTERNS_LEGACY;')() || []; }
catch (e) { PATTERNS_LEGACY = []; }

/* ---------- mappings ---------- */
// research topic → मुख्य site का फॉर्मूला-बुक अध्याय
const FORMULA_CHAPTER = {
    'Number System': 'number-system', 'Simplification': 'simplification', 'Percentage': 'percentage',
    'Profit-Loss': 'profit-loss', 'Discount': 'profit-loss', 'Simple Interest': 'interest',
    'Compound Interest': 'interest', 'Ratio-Proportion': 'ratio', 'Partnership': 'ratio',
    'Mixture-Alligation': 'ratio', 'Average': 'average', 'Time-Work': 'time-work',
    'Pipes-Cisterns': 'time-work', 'Time-Speed-Distance': 'speed-distance', 'Trains': 'speed-distance',
    'Boats-Streams': 'speed-distance', 'Mensuration 2D': 'mensuration-2d', 'Mensuration 3D': 'mensuration-3d',
    'Algebra': 'algebra', 'Geometry': 'geometry', 'Trigonometry': 'trigonometry', 'HCF-LCM': 'number-system'
};
// curated shortcut patterns (slug) → research topics
const PATTERN_TOPIC_MAP = {
    'algebra': ['Algebra'], 'number-system': ['Number System'], 'hcf-lcm': ['HCF-LCM'],
    'ratio-proportion': ['Ratio-Proportion'], 'mixture-alligation': ['Mixture-Alligation'],
    'trigonometry': ['Trigonometry'], 'heights-distances': ['Trigonometry'],
    'geometry': ['Geometry'], 'mensuration': ['Mensuration 2D', 'Mensuration 3D'],
    'simplification': ['Simplification']
};
// main-site topic → research slug (PYQ_ANALYSIS से)
const MAIN_TO_RESEARCH_SLUG = {};
PA.topics.forEach(t => { MAIN_TO_RESEARCH_SLUG[t.slug] = (MAIN_TO_RESEARCH_SLUG[t.slug] || 0) + t.total; });

/* ---------- concept id → name (prerequisites resolve करने के लिए) ---------- */
const conceptNameById = {};
topics.forEach(t => t.sub_topics.forEach(s => s.concepts.forEach(c => { conceptNameById[c.id] = c.name; })));

/* ---------- formulas: topic → concept → [formula] ---------- */
const formulasByConcept = {};
formulas.forEach(f => {
    const key = f.topic + '||' + f.concept;
    (formulasByConcept[key] = formulasByConcept[key] || []).push(f.formula);
});

/* ---------- questions_by_topic: sub-topic analytics ---------- */
const qbtDir = path.join(root, 'research/data/questions_by_topic');
const MAX_TAGS = 30, MAX_TRICKS = 10;

function subTopicAnalytics(file) {
    let j;
    try { j = JSON.parse(fs.readFileSync(path.join(qbtDir, file), 'utf8')); }
    catch (e) { return null; }
    const bySub = {};
    (j.questions || []).forEach(q => {
        const sub = q.s || 'unknown';
        const b = bySub[sub] = bySub[sub] || { total: 0, certain: 0, types: {}, exams: {}, tricks: {}, tags: {} };
        b.total++;
        if (q.c === 1) b.certain++;
        if (q.ty) b.types[q.ty] = (b.types[q.ty] || 0) + 1;
        const ex = paperExam[q.p];
        if (ex) b.exams[ex] = (b.exams[ex] || 0) + 1;
        if (q.tr) b.tricks[q.tr] = (b.tricks[q.tr] || 0) + 1;
        (q.t || []).forEach(tag => {
            const g = b.tags[tag] = b.tags[tag] || { c: 0, easy: 0, medium: 0, hard: 0, uncertain: 0 };
            g.c++;
            if (q.d === 'easy' || q.d === 'medium' || q.d === 'hard' || q.d === 'uncertain') g[q.d]++;
        });
    });
    return { total: j.total || 0, certain: j.certain || 0, bySub };
}

/* ---------- topics बनाएँ ---------- */
const outTopics = topics.map(t => {
    const slug = t.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const an = subTopicAnalytics(slug + '.json');
    const examTotals = {};
    if (an) Object.values(an.bySub).forEach(b => Object.entries(b.exams).forEach(([e, c]) => { examTotals[e] = (examTotals[e] || 0) + c; }));

    const mainPyq = MAIN_TO_RESEARCH_SLUG[slug] || 0;
    const mainPatterns = PA.topics.filter(x => x.slug === slug)
        .flatMap(x => x.patterns.map(p => ({ label: p.label, count: p.count })))
        .sort((a, b) => b.count - a.count).slice(0, 12);

    const sub_topics = t.sub_topics.map(s => {
        const b = (an && an.bySub[s.name]) || null;
        const tags = b ? Object.entries(b.tags)
            .map(([tag, g]) => ({ t: tag, c: g.c, d: [g.easy, g.medium, g.hard, g.uncertain] }))
            .sort((x, y) => y.c - x.c).slice(0, MAX_TAGS) : [];
        const tricks = b ? Object.entries(b.tricks)
            .map(([label, c]) => ({ label, c }))
            .sort((x, y) => y.c - x.c).slice(0, MAX_TRICKS) : [];
        const concepts = s.concepts.map(c => {
            const key = t.name + '||' + c.name;
            return {
                id: c.id,
                name: c.name,
                def: c.definition_en || '',
                hi: c.explanation_hi || '',
                diff: c.difficulty || 'basic',
                examMap: c.exam_mapping || '',
                pre: (c.prerequisites || []).map(id => conceptNameById[id] || id),
                formulas: formulasByConcept[key] || []
            };
        });
        return {
            name: s.name,
            certain: s.certain || 0,
            total: b ? b.total : 0,
            types: b ? b.types : {},
            exams: b ? b.exams : {},
            tricks,
            tags,
            concepts
        };
    });

    // curated shortcut patterns इस topic के लिए
    const curPatterns = [];
    PATTERNS_LEGACY.forEach(p => {
        const targets = PATTERN_TOPIC_MAP[p.topic] || [];
        if (targets.includes(t.name)) {
            curPatterns.push({
                name: p.name, signal: p.signal || '', concept: p.concept || '',
                shortcut: p.shortcut || '', variants: (p.variants || []).slice(0, 4),
                traps: (p.traps || []).slice(0, 3)
            });
        }
    });

    return {
        name: t.name,
        slug,
        certain: t.certain || 0,
        total: an ? an.total : 0,
        exams: examTotals,
        formulaChapter: FORMULA_CHAPTER[t.name] || null,
        mainPyq,
        mainPatterns,
        patterns: curPatterns.slice(0, 10),
        sub_topics
    };
});

/* ---------- चैलेंज mapping ---------- */
// data-challenge.js से 90 दिन पढ़ें (buildChallenge() चलाकर)
const chSrc = fs.readFileSync(path.join(root, 'js/data-challenge.js'), 'utf8');
let CHALLENGE_DAYS = [];
try {
    const fn = new Function(chSrc + '\n; return CHALLENGE_90;');
    CHALLENGE_DAYS = fn() || [];
} catch (e) {
    console.error('चैलेंज डेटा पढ़ने में समस्या:', e.message);
}
// चैलेंज day topics (हिंदी) → research topic
const CH_TOPIC_TO_RESEARCH = {
    'संख्या पद्धति': 'Number System', 'शेषफल': 'Number System', 'HCF-LCM': 'HCF-LCM',
    'सरलीकरण': 'Simplification', 'प्रतिशत': 'Percentage', 'लाभ-हानि': 'Profit-Loss',
    'ब्याज': 'Simple Interest', 'अनुपात': 'Ratio-Proportion', 'औसत': 'Average',
    'समय-कार्य': 'Time-Work', 'रेलगाड़ी': 'Trains', 'नाव-धारा': 'Boats-Streams',
    'त्रिकोणमिति': 'Trigonometry', 'ऊँचाई-दूरी': 'Trigonometry', 'क्षेत्रमिति': 'Mensuration 2D',
    'क्षेत्रमिति 3D': 'Mensuration 3D', 'ज्यामिति': 'Geometry', 'मिश्रण': 'Mixture-Alligation',
    'साझेदारी': 'Ratio-Proportion', 'आयु': 'Ages', 'घड़ी': 'Time-Speed-Distance',
    'आँकड़े': 'Elementary Statistics', 'संयोग': 'Permutation and Combination'
};
const topicByName = {};
outTopics.forEach(t => { topicByName[t.name] = t; });

const chDays = CHALLENGE_DAYS.map(d => {
    const mapped = [];
    (d.topics || []).forEach(tp => {
        const rName = CH_TOPIC_TO_RESEARCH[tp];
        if (!rName) return;
        const rt = topicByName[rName];
        if (!rt) return;
        if (mapped.some(m => m.name === rt.name)) return;
        mapped.push({
            name: rt.name, slug: rt.slug, certain: rt.certain, total: rt.total,
            concepts: rt.sub_topics.reduce((n, s) => n + s.concepts.length, 0),
            subs: rt.sub_topics.length,
            mainPyq: rt.mainPyq,
            subNames: rt.sub_topics.map(s => s.name)
        });
    });
    return { d: d.d, wk: d.wk, type: d.type, chap: d.chap || null, topics: mapped };
});

const chWeeks = [];
for (let w = 1; w <= 13; w++) {
    const days = chDays.filter(x => x.wk === w);
    const tset = new Map();
    days.forEach(d => d.topics.forEach(t => {
        const cur = tset.get(t.name) || { name: t.name, slug: t.slug, certain: t.certain, concepts: t.concepts, subs: t.subs, mainPyq: t.mainPyq };
        tset.set(t.name, cur);
    }));
    chWeeks.push({
        wk: w,
        learnDays: days.filter(d => d.type === 'learn').length,
        records: [...tset.values()].reduce((n, t) => n + t.certain, 0),
        concepts: [...tset.values()].reduce((n, t) => n + t.concepts, 0),
        topics: [...tset.values()]
    });
}

/* ---------- लिखें ---------- */
const totals = {
    topics: outTopics.length,
    subTopics: outTopics.reduce((n, t) => n + t.sub_topics.length, 0),
    concepts: outTopics.reduce((n, t) => n + t.sub_topics.reduce((m, s) => m + s.concepts.length, 0), 0),
    formulas: formulas.length,
    records: outTopics.reduce((n, t) => n + t.total, 0),
    certain: outTopics.reduce((n, t) => n + t.certain, 0),
    mainPyq: PA.totals.questions
};

const banner = `/* ============================================================\n   गणित गुरु — मास्टरी मार्ग डेटा (auto-generated, हाथ से बदलें नहीं)\n   ${totals.topics} topics · ${totals.subTopics} sub-topics · ${totals.concepts} concepts · ${totals.formulas} formulas\n   Research hierarchy + PYQ concept-tag analytics + 90-दिन चैलेंज mapping।\n   दोबारा बनाने के लिए:  node tools/build_mastery_data.js\n   ============================================================ */\n\n`;

const out = banner +
    'const MASTERY_DATA = ' + JSON.stringify({ generated: new Date().toISOString().slice(0, 10), totals, topics: outTopics }) + ';\n\n' +
    'const CHALLENGE_MASTERY = ' + JSON.stringify({ days: chDays, weeks: chWeeks }) + ';\n';

const outPath = path.join(root, 'js/data-mastery-path.js');
fs.writeFileSync(outPath, out);
console.log('✔ js/data-mastery-path.js —', totals.topics, 'topics ·', totals.subTopics, 'sub-topics ·', totals.concepts, 'concepts ·', totals.formulas, 'formulas ·', totals.records, 'records');
console.log('  चैलेंज:', chDays.length, 'दिन mapped ·', chWeeks.filter(w => w.records > 0).length, 'सप्ताहों में exact records');
const unmappedDays = chDays.filter(d => d.type === 'learn' && !d.topics.length).length;
console.log('  बिना mapping के learn-दिन:', unmappedDays);
console.log('  आकार:', (fs.statSync(outPath).size / 1024).toFixed(0), 'KB');
