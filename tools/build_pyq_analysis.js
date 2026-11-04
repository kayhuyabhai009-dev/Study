#!/usr/bin/env node
/* ============================================================
   build_pyq_analysis.js — गणित गुरु के 10,000+ PYQ प्रश्नों का
   topic → concept(पैटर्न) → प्रश्न aggregates बनाता है।

   यह скрипт चार PYQ डेटा-फाइलें पढ़ता है (data-pyq, data-pyq-legacy,
   data-pyq-pdf, data-pyq-featured) और एक compact JSON बनाता है:
   js/data-pyq-analysis.js

   View (PYQ एनालिसिस सेक्शन) इन precomputed aggregates से instant
   filter/render करती है — हर बार 10,124 प्रश्न scan नहीं होते।

   चलाना:  node tools/build_pyq_analysis.js
   ============================================================ */
'use strict';

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const outFile = path.join(root, 'js', 'data-pyq-analysis.js');

/* ---- PYQ डेटा लोड (browser globals को Node में reproduce) ---- */
const parts = ['js/data-pyq.js', 'js/data-pyq-legacy.js', 'js/data-pyq-pdf.js', 'js/data-pyq-featured.js']
    .map(f => fs.readFileSync(path.join(root, f), 'utf8')).join('\n');
const mod = {};
new Function('module', parts + '\nmodule.exports={PYQ_BANK,PYQ_BANK_LEGACY,PYQ_BANK_PDF,PYQ_FEATURED};')(mod);
const { PYQ_BANK, PYQ_BANK_LEGACY, PYQ_BANK_PDF, PYQ_FEATURED } = mod.exports;

/* ---- हिंदी टॉपिक → research platform (English topic + slug) ---- */
const TOPIC_META = {
    'संख्या पद्धति': { en: 'Number System', slug: 'number-system' },
    'शेषफल': { en: 'Number System (Remainder)', slug: 'number-system' },
    'बीजगणित': { en: 'Algebra', slug: 'algebra' },
    'प्रतिशत': { en: 'Percentage', slug: 'percentage' },
    'लाभ-हानि': { en: 'Profit-Loss', slug: 'profit-loss' },
    'ब्याज': { en: 'Interest (SI/CI)', slug: 'simple-interest' },
    'अनुपात': { en: 'Ratio-Proportion', slug: 'ratio-proportion' },
    'साझेदारी': { en: 'Partnership (Ratio family)', slug: 'ratio-proportion' },
    'औसत': { en: 'Average', slug: 'average' },
    'समय-कार्य': { en: 'Time-Work', slug: 'time-work' },
    'रेलगाड़ी': { en: 'Trains', slug: 'trains' },
    'नाव-धारा': { en: 'Boats-Streams', slug: 'boats-streams' },
    'त्रिकोणमिति': { en: 'Trigonometry', slug: 'trigonometry' },
    'ऊँचाई-दूरी': { en: 'Height & Distance', slug: 'trigonometry' },
    'क्षेत्रमिति': { en: 'Mensuration 2D', slug: 'mensuration-2d' },
    'क्षेत्रमिति 3D': { en: 'Mensuration 3D', slug: 'mensuration-3d' },
    'ज्यामिति': { en: 'Geometry', slug: 'geometry' },
    'HCF-LCM': { en: 'HCF-LCM', slug: 'hcf-lcm' },
    'घड़ी': { en: 'Clock (Time family)', slug: 'time-speed-distance' },
    'सरलीकरण': { en: 'Simplification', slug: 'simplification' },
    'मिश्रण': { en: 'Mixture-Alligation', slug: 'mixture-alligation' },
    'आयु': { en: 'Ages', slug: 'ages' },
    'विविध': { en: 'Mixed', slug: 'mixed-composite' }
};

/* ---- लेगेसी English pattern-slug → हिंदी कॉन्सेप्ट लेबल ---- */
const PATTERN_HI = {
    'general': 'सामान्य', 'algebraic-identity': 'सर्वसमिका', 'quadratic': 'द्विघात',
    'simplification': 'सरलीकरण', 'simultaneous': 'रैखिक तंत्र', 'ratio-proportion': 'अनुपात-समानुपात',
    'divisibility': 'विभाज्यता', 'mensuration-3d': 'क्षेत्रमिति 3D', 'quadrilaterals': 'चतुर्भुज',
    'average': 'औसत', 'hcf-lcm': 'HCF-LCM', 'surds': 'करणी', 'trig-ratio': 'त्रिकोणमितीय अनुपात',
    'remainder': 'शेषफल', 'mixture': 'मिश्रण', 'angles': 'कोण', 'circles': 'वृत्त',
    'triangles': 'त्रिभुज', 'mensuration-2d': 'क्षेत्रमिति 2D', 'tph': 'समय-कार्य (TPH)',
    'height-distance': 'ऊँचाई-दूरी', 'probability': 'प्रायिकता', 'percentage': 'प्रतिशत',
    'ages': 'आयु', 'base-conversion': 'आधार-रूपांतरण', 'profit-loss': 'लाभ-हानि',
    'time-work': 'समय-कार्य', 'factor-sum': 'गुणनखंड योग', 'trailing-zeros': 'ट्रेलिंग जीरो',
    'partnership': 'साझेदारी'
};

function normYear(y) {
    const s = String(y == null ? '' : y).trim();
    return /^\d{4}$/.test(s) ? s : 'अज्ञात';
}

/* ---- research platform के per-topic टैग्ड-रिकॉर्ड totals ---- */
function researchTotals() {
    const dir = path.join(root, 'research', 'data', 'questions_by_topic');
    const out = {};
    if (!fs.existsSync(dir)) return out;
    for (const f of fs.existsSync(dir) ? fs.readdirSync(dir) : []) {
        if (!f.endsWith('.json')) continue;
        try {
            const j = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
            out[j.slug || f.replace(/\.json$/, '')] = { total: j.total || 0, certain: j.certain || 0 };
        } catch (e) { /* corrupt file छोड़ दें */ }
    }
    return out;
}

/* ---- मुख्य aggregates ---- */
const raw = [
    ...PYQ_BANK.map(q => ({ id: String(q.id), topic: q.topic, pattern: q.pattern, diff: q.difficulty, exam: q.exam, year: q.year, lang: q.lang, sol: !!(q.solution && q.solution.length) })),
    ...PYQ_FEATURED.map(q => ({ id: String(q.id), topic: q.topic, pattern: q.pattern, diff: q.difficulty, exam: q.exam, year: q.year, lang: q.lang, sol: !!(q.solution && q.solution.length) })),
    ...PYQ_BANK_LEGACY.map(q => ({ id: String(q.id), topic: q.t, pattern: q.p, diff: q.d, exam: q.e, year: q.y, lang: q.lang, sol: !!q.sol })),
    ...PYQ_BANK_PDF.map(q => ({ id: String(q.id), topic: q.t, pattern: q.p, diff: q.d, exam: q.e, year: q.y, lang: q.lang, sol: !!q.sol }))
];

const research = researchTotals();
const byTopic = new Map();
const examSet = new Set(), yearSet = new Set(), patternSet = new Set();
let withSol = 0, hi = 0, en = 0;

for (const q of raw) {
    const topic = (q.topic || 'विविध').trim();
    const meta = TOPIC_META[topic] || { en: topic, slug: 'mixed-composite' };
    const patRaw = (q.pattern || '').trim();
    const patLabel = patRaw ? (PATTERN_HI[patRaw] || patRaw) : 'सामान्य';
    const exam = (q.exam || '').trim() || 'अज्ञात';
    const year = normYear(q.year);
    const diff = (q.diff || '').trim() || 'मध्यम';
    if (q.sol) withSol++;
    if (q.lang === 'en') en++; else hi++;
    examSet.add(exam); yearSet.add(year); patternSet.add(topic + '||' + patLabel);

    if (!byTopic.has(topic)) {
        byTopic.set(topic, {
            name: topic, en: meta.en, slug: meta.slug, total: 0,
            diff: {}, exams: {}, years: {}, langs: { hi: 0, en: 0 }, sol: 0,
            patterns: new Map(), ids: []
        });
    }
    const t = byTopic.get(topic);
    t.total++;
    t.diff[diff] = (t.diff[diff] || 0) + 1;
    t.exams[exam] = (t.exams[exam] || 0) + 1;
    t.years[year] = (t.years[year] || 0) + 1;
    t.langs[q.lang === 'en' ? 'en' : 'hi']++;
    if (q.sol) t.sol++;
    t.ids.push(q.id);
    if (!t.patterns.has(patLabel)) t.patterns.set(patLabel, []);
    t.patterns.get(patLabel).push(q.id);
}

const topics = [...byTopic.values()].map(t => {
    const rt = research[t.slug] || { total: 0, certain: 0 };
    return {
        name: t.name, en: t.en, slug: t.slug, total: t.total,
        diff: t.diff, exams: t.exams, years: t.years,
        langs: t.langs, sol: t.sol,
        patterns: [...t.patterns.entries()]
            .map(([label, ids]) => ({ label, count: ids.length, ids }))
            .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label)),
        research: { slug: t.slug, total: rt.total, certain: rt.certain }
    };
}).sort((a, b) => b.total - a.total);

const analysis = {
    generated: new Date().toISOString().slice(0, 10),
    source: 'PYQ_BANK + PYQ_FEATURED + PYQ_BANK_LEGACY + PYQ_BANK_PDF',
    totals: {
        questions: raw.length,
        topics: topics.length,
        patterns: patternSet.size,
        exams: examSet.size,
        years: yearSet.size,
        withSolution: withSol,
        hindi: hi, english: en,
        researchRecords: Object.values(research).reduce((s, r) => s + r.total, 0)
    },
    exams: [...examSet].sort(),
    years: [...yearSet].sort(),
    topics
};

const banner = `/* ============================================================\n   गणित गुरु — PYQ एनालिसिस (auto-generated, हाथ से बदलें नहीं)\n   ${raw.length} प्रश्नों के topic → concept(पैटर्न) aggregates।\n   दोबारा बनाने के लिए:  node tools/build_pyq_analysis.js\n   ============================================================ */\n\n`;
fs.writeFileSync(outFile, banner + 'const PYQ_ANALYSIS = ' + JSON.stringify(analysis) + ';\n');
console.log('✔ js/data-pyq-analysis.js लिखा गया —', raw.length, 'प्रश्न,', topics.length, 'टॉपिक,', patternSet.size, 'कॉन्सेप्ट-पैटर्न');
console.log('  research tagged records जोड़े गए:', analysis.totals.researchRecords);
