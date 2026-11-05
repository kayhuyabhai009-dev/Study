#!/usr/bin/env node
/* ============================================================
   build_full_pyq.js — "all-full-questions-with-options.txt" को
   parse करके टैग्ड PYQ डेटा बनाता है:

     js/data-pyq-full-index.js   → PYQ_FULL_META (chapters → concepts, exams, years, shifts)
     js/data-pyq-full-1.js ...   → PYQ_FULL_PUSH(...) chunks (compact array records)

   हर record (compact array):
     [examIdx, dateInt yyyymmdd, shiftIdx, chapterIdx, subIdx, conceptIdx,
      stem, optA, optB, optC, optD, ansIdx(-1 = unknown/unsolved), ansText('' अगर ansIdx>=0)]

   Tagging:
   • chapter = हमारा 35-topic mastery chapter (Hindi नाम + slug)
   • sub/concept = research mastery के sub_topic tags से keyword-match (phrase boost सहित)
   • legacy/pdf/curated बैंक के सामने normalized-stem dedupe

   चलाना:  node tools/build_full_pyq.js
   ============================================================ */
'use strict';

const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');

const SRC = path.join(root, 'data', 'all-full-questions-with-options.txt');
const OUT_DIR = path.join(root, 'js');
const CHUNK_SIZE = 1800;

/* ---------------- 1. mastery lexicon (chapters, sub-topics, concept-tags) ---------------- */
const mpSrc = fs.readFileSync(path.join(OUT_DIR, 'data-mastery-path.js'), 'utf8');
const MASTERY = new Function(mpSrc + '; return MASTERY_DATA;')();

/* txt topic name → { slug, hi (chapter display name) } */
const CHAPTER_MAP = {
    'Percentage': { slug: 'percentage', hi: 'प्रतिशत' },
    'Ratio-Proportion': { slug: 'ratio-proportion', hi: 'अनुपात-समानुपात' },
    'Simplification': { slug: 'simplification', hi: 'सरलीकरण' },
    'Profit-Loss': { slug: 'profit-loss', hi: 'लाभ-हानि' },
    'Average': { slug: 'average', hi: 'औसत' },
    'Number System': { slug: 'number-system', hi: 'संख्या पद्धति' },
    'Time-Speed-Distance': { slug: 'time-speed-distance', hi: 'समय-चाल-दूरी' },
    'TSD': { slug: 'time-speed-distance', hi: 'समय-चाल-दूरी' },
    'Discount': { slug: 'discount', hi: 'छूट (बट्टा)' },
    'Mensuration 3D': { slug: 'mensuration-3d', hi: 'क्षेत्रमिति 3D' },
    'Time-Work': { slug: 'time-work', hi: 'समय-कार्य' },
    'Algebra': { slug: 'algebra', hi: 'बीजगणित' },
    'Simple Interest': { slug: 'simple-interest', hi: 'साधारण ब्याज' },
    'Trigonometry': { slug: 'trigonometry', hi: 'त्रिकोणमिति' },
    'Mensuration 2D': { slug: 'mensuration-2d', hi: 'क्षेत्रमिति 2D' },
    'Compound Interest': { slug: 'compound-interest', hi: 'चक्रवृद्धि ब्याज' },
    'Data Interpretation': { slug: 'data-interpretation', hi: 'आँकड़े (DI)' },
    'HCF-LCM': { slug: 'hcf-lcm', hi: 'HCF-LCM' },
    'Geometry': { slug: 'geometry', hi: 'ज्यामिति' },
    'Circles-Polygons': { slug: 'circles-polygons', hi: 'वृत्त-बहुभुज' },
    'Trains': { slug: 'trains', hi: 'रेलगाड़ी' },
    'Ages': { slug: 'ages', hi: 'आयु' },
    'Elementary Statistics': { slug: 'elementary-statistics', hi: 'सांख्यिकी' },
    'Statistics': { slug: 'elementary-statistics', hi: 'सांख्यिकी' },
    'Pipes-Cisterns': { slug: 'pipes-cisterns', hi: 'पाइप-टंकी' },
    'Mixture-Alligation': { slug: 'mixture-alligation', hi: 'मिश्रण-एलीगेशन' },
    'Boats-Streams': { slug: 'boats-streams', hi: 'नाव-धारा' },
    'Mixed / Composite': { slug: 'mixed-composite', hi: 'विविध' },
    'Unknown': { slug: 'mixed-composite', hi: 'विविध' },
    'Coordinate Geometry': { slug: 'coordinate-geometry', hi: 'निर्देशांक ज्यामिति' },
    'Sequences and Series': { slug: 'sequences-and-series', hi: 'श्रेणी (AP/GP)' },
    'Set Theory': { slug: 'set-theory', hi: 'समुच्चय' },
    'Permutation and Combination': { slug: 'permutation-and-combination', hi: 'क्रमचय-संचय' },
    'Probability': { slug: 'probability', hi: 'प्रायिकता' }
};

const EXAM_MAP = {
    'ALP': 'RRB ALP', 'NTPC': 'RRB NTPC', 'Group D': 'RRB Group D',
    'Technician': 'RRB Technician', 'Paramedical': 'RRB Paramedical',
    'GD Constable': 'SSC GD', 'GD': 'SSC GD', 'CHSL': 'SSC CHSL', 'CGL': 'SSC CGL',
    'MTS': 'SSC MTS', 'CPO': 'SSC CPO', 'Selection Post': 'SSC Selection Post',
    'Delhi Police Constable': 'Delhi Police', 'Delhi Police HC': 'Delhi Police HC',
    'MI Translator': 'SSC MI', 'MI Non-Translator': 'SSC MI',
    'JE': 'SSC JE', 'RPF SI': 'RPF SI', 'RPF Constable': 'RPF Constable',
    'DPC': 'Delhi Police', 'HC': 'Delhi Police HC'
};

/* mastery topic lookup by slug */
const MTOPIC = {};
MASTERY.topics.forEach(t => { MTOPIC[t.slug] = t; });

/* stopwords for tokenization */
const STOP = new Set(['the', 'of', 'a', 'an', 'in', 'to', 'is', 'and', 'or', 'by', 'on', 'at', 'for', 'with', 'be', 'if', 'it', 'its', 'as', 'from', 'that', 'this', 'are', 'was', 'were', 'what', 'which', 'how', 'many', 'find', 'value', 'then', 'will', 'than', 'per', 'two', 'each', 'such', 'between', 'respectively']);
const KEEP2 = new Set(['ap', 'gp', 'hp', 'ci', 'si', 'di', '2d', '3d', '10', '11', '15', '45', '60', '90', '30', 'x']);

function tokensOf(s) {
    const out = [];
    String(s || '').toLowerCase().split(/[^a-z0-9\u0900-\u097F]+/).forEach(w => {
        if (!w) return;
        if (w.length < 2 && !KEEP2.has(w)) return;
        if (STOP.has(w)) return;
        out.push(w);
    });
    return out;
}

/* per-chapter concept lexicon: [{ slugTopic, sub, subIdx, label, labelTokens, phrase }] */
function chapterLexicon(slug) {
    const t = MTOPIC[slug];
    if (!t) return [];
    const lex = [];
    t.sub_topics.forEach((s, si) => {
        const subPretty = s.name.replace(/-/g, ' ');
        const subToks = tokensOf(subPretty);
        // sub-topic itself as a candidate (label = pretty sub name)
        lex.push({ sub: s.name, subIdx: si, label: subPretty, toks: subToks, phrase: subPretty.toLowerCase(), weight: 1 });
        s.tags.forEach(tg => {
            const lbl = tg.t;
            if (!lbl || lbl === 'सामान्य') return;
            lex.push({ sub: s.name, subIdx: si, label: lbl, toks: tokensOf(lbl), phrase: lbl.toLowerCase(), weight: 2 });
        });
    });
    return lex;
}

const LEXICON = {};   // slug → lex array
Object.values(CHAPTER_MAP).forEach(c => {
    if (!LEXICON[c.slug]) LEXICON[c.slug] = chapterLexicon(c.slug);
});

/* curated aliases: stems में आने वाले synonym शब्द → concept label token boost */
const ALIAS = {
    'percentage': { 'marks-and-exam': ['marks', 'score', 'pass', 'fail', 'exam'], 'population-and-depreciation': ['population', 'depreci', 'census'], 'income-expenditure': ['income', 'salary', 'expend', 'spend', 'saving'], 'successive-change': ['successive', 'respectively', 'overall'], 'increase-decrease': ['increase', 'decrease', 'reduce', 'rise'], 'basic-percentage': ['percent', '%'] },
    'profit-loss': { 'basic-profit-loss': ['cost price', 'selling price', 'cp', 'sp', 'gain'], 'dishonest-dealer': ['dishonest', 'false weight', 'weigh'], 'marked-price-discount': ['marked'], 'two-transactions': ['two articles', 'both'] },
    'discount': { 'successive-discount': ['successive', 'two successive', 'equivalent'], 'marked-price': ['marked', 'mark up'], 'basic-discount': ['discount'] },
    'time-speed-distance': { 'relative-speed': ['opposite direction', 'same direction', 'towards each other', 'relative'], 'average-speed': ['average speed', 'equal distances'], 'early-late': ['early', 'late', 'usual time', 'reaches'], 'circular-track': ['circular', 'lap', 'round'], 'basic-tsd': ['speed', 'km/h', 'kmph', 'm/s', 'distance'] },
    'trains': { 'crossing-pole-man': ['pole', 'man', 'signal'], 'crossing-platform-bridge': ['platform', 'bridge', 'tunnel'], 'two-trains': ['two trains', 'opposite', 'same direction'], 'train-and-speed-units': ['km/hr', 'm/s'] },
    'algebra': { 'identities': ['x + 1/x', 'a+b', 'identity'], 'linear-equations': ['equation', 'satisfy'], 'polynomials': ['polynomial', 'factor'], 'quadratic': ['quadratic', 'roots'] },
    'geometry': { 'triangles': ['triangle'], 'circles': ['circle', 'chord', 'tangent'], 'lines-and-angles': ['angle', 'parallel lines', 'transversal'], 'quadrilaterals': ['quadrilateral', 'parallelogram', 'rhombus'] },
    'ratio-proportion': { 'basic-ratio': ['ratio'], 'proportion-third-fourth': ['third proportional', 'fourth proportional', 'mean proportional'], 'coins-and-shares': ['coins', 'share'], 'partnership-mixture-link': ['partner'], 'ages-link': ['age'] },
    'simple-interest': { 'basic-si': ['simple interest'], 'rate-time-variations': ['rate', 'annum', 'doubles', 'trebles'], 'installments': ['installment'] },
    'compound-interest': { 'basic-ci': ['compound interest'], 'ci-si-difference': ['difference between', 'simple and compound'], 'half-yearly-quarterly': ['half-yearly', 'quarterly', 'compounded'], 'growth-decay': ['growth', 'depreciation', 'population'] },
    'elementary-statistics': { 'mean-median-mode': ['mean', 'median', 'mode'], 'range-and-deviation': ['range', 'deviation', 'variance', 'standard'], 'frequency-distribution': ['frequency', 'distribution'] },
    'boats-streams': { 'downstream-upstream': ['downstream', 'upstream'], 'still-water-speed': ['still water'], 'stream-speed': ['stream', 'current'] },
    'pipes-cisterns': { 'inlet-outlet': ['inlet', 'outlet', 'empty', 'leak'], 'filling-tank': ['fill', 'tank', 'pipe'] },
    'time-work': { 'basic-work': ['work', 'days'], 'efficiency': ['efficien', 'twice', 'thrice'], 'mdh-formula': ['men', 'women', 'boys', 'workers'], 'work-and-wages': ['wage'] },
    'hcf-lcm': { 'hcf-lcm-of-numbers': ['hcf', 'lcm', 'h.c.f', 'l.c.m', 'greatest'], 'remainder-based': ['remainder', 'leaves'], 'application-problems': ['bells', 'toll', 'longest', 'maximum number'] },
    'number-system': { 'divisibility-rules': ['divisib', 'divisible by'], 'remainder': ['remainder', 'divided by'], 'unit-digit': ['unit', 'digit'], 'factors-divisors': ['factor', 'divisor', 'number of'], 'types-of-numbers': ['prime', 'composite', 'rational', 'irrational', 'integer', 'natural', 'whole'] },
    'simplification': { 'bodmas': ['simplify', 'value of', 'evaluate'], 'roots': ['square root', 'cube root', 'sqrt'], 'surds-and-indices': ['surd', 'indices', 'exponent', '^'], 'approximation': ['approximate'] },
    'data-interpretation': { 'table-data': ['table', 'data below'], 'bar-graph': ['bar', 'graph'], 'pie-chart': ['pie', 'chart'], 'line-graph': ['line graph'], 'ratio-percentage-in-di': ['percentage', 'ratio'] },
    'probability': { 'basic-probability': ['probability', 'chance'], 'cards-coins-dice': ['card', 'coin', 'dice', 'die'], 'balls-from-bag': ['ball', 'bag', 'drawn'] },
    'coordinate-geometry': { 'distance-midpoint': ['distance', 'midpoint', 'mid point'], 'slope-section': ['slope', 'section', 'collinear'], 'area-of-triangle': ['area of the triangle'] },
    'sequences-and-series': { 'ap-nth-sum': ['a.p', 'arithmetic'], 'gp-nth-sum': ['g.p', 'geometric'], 'number-series': ['series', 'next term', 'missing'] },
    'set-theory': { 'venn-two-sets': ['venn', 'union', 'intersection', 'neither'], 'three-sets': ['three sets'] },
    'ages': { 'present-age': ['present age', 'years old'], 'ratio-of-ages': ['ratio of their ages', 'ratio of ages'], 'sum-difference': ['sum of their ages', 'difference'], 'average-age': ['average age'] },
    'average': { 'basic-average': ['average'], 'include-exclude': ['included', 'excluded', 'replaced', 'joins', 'leaves'], 'consecutive-numbers': ['consecutive'], 'weighted-average': ['boys', 'girls', 'students'] },
    'mixture-alligation': { 'alligation-rule': ['alligation', 'mixed', 'mixture'], 'replacement': ['replaced', 'drawn off', 'liquid'], 'two-mixtures': ['two mixtures'] },
    'permutation-and-combination': { 'arrangements': ['arrange', 'ways', 'arrangement'], 'selections': ['select', 'committee', 'choose'], 'digits-words': ['digits', 'letters', 'word'] },
    'trigonometry': { 'ratios-and-tables': ['sin', 'cos', 'tan', 'sec', 'cosec', 'cot'], 'identities': ['identity', 'equal to'], 'heights-and-distances': ['angle of elevation', 'angle of depression', 'height', 'shadow', 'tower'], 'complementary-angles': ['complement'] },
    'mensuration-2d': { 'triangle-area': ['triangle', 'area'], 'quadrilaterals-parallelogram': ['parallelogram', 'rhombus', 'trapezium'], 'circle-sector': ['circle', 'sector', 'arc', 'circumference'], 'paths-carpets': ['path', 'carpet', 'verandah'] },
    'mensuration-3d': { 'cuboid-cube': ['cuboid', 'cube', 'room'], 'cylinder': ['cylinder', 'cylindrical'], 'cone': ['cone', 'conical'], 'sphere-hemisphere': ['sphere', 'hemisphere', 'ball'], 'volume-surface': ['volume', 'surface area'] },
    'circles-polygons': { 'chords-and-tangents': ['chord', 'tangent'], 'angles-in-circle': ['angle', 'arc', 'subtend'], 'cyclic-quadrilateral': ['cyclic'], 'polygon-angles': ['polygon', 'hexagon', 'pentagon', 'octagon'] }
};

function chapterAliasLex(slug) {
    const a = ALIAS[slug];
    if (!a) return [];
    return Object.entries(a).map(([sub, words]) => ({
        sub, subIdx: -1, label: null, toks: words, phrase: null, weight: 3, alias: true
    }));
}

/* ---------------- 2. dedupe keys from existing banks ---------------- */
function normStem(s) {
    return String(s || '').toLowerCase().replace(/[^a-z0-9\u0900-\u097F]+/g, ' ').trim().slice(0, 120);
}
const existingKeys = new Set();
['data-pyq.js', 'data-pyq-legacy.js', 'data-pyq-pdf.js', 'data-pyq-featured.js'].forEach(f => {
    const src = fs.readFileSync(path.join(OUT_DIR, f), 'utf8');
    let bank = [];
    try {
        const sandbox = {};
        new Function('window', 'module', src + ';module.exports=window;')(sandbox, { exports: sandbox });
        bank = sandbox.PYQ_BANK || sandbox.PYQ_BANK_LEGACY || sandbox.PYQ_BANK_PDF || sandbox.PYQ_FEATURED || [];
    } catch (e) { /* some files define multiple consts; try combined */ }
    if (!bank.length) {
        try {
            const mod = {};
            new Function('module', src + '\nmodule.exports={PYQ_BANK:typeof PYQ_BANK!=="undefined"?PYQ_BANK:[],L:typeof PYQ_BANK_LEGACY!=="undefined"?PYQ_BANK_LEGACY:[],P:typeof PYQ_BANK_PDF!=="undefined"?PYQ_BANK_PDF:[],F:typeof PYQ_FEATURED!=="undefined"?PYQ_FEATURED:[]};')(mod);
            bank = [].concat(mod.exports.PYQ_BANK, mod.exports.L, mod.exports.P, mod.exports.F);
        } catch (e2) { console.error('डेटा पढ़ने में दिक्कत: ' + f, e2.message); }
    }
    bank.forEach(q => {
        const stem = q.question || q.q || q.stem || '';
        if (stem) existingKeys.add(normStem(stem));
    });
    console.log('dedupe स्रोत:', f, '→ कुल keys', existingKeys.size);
});

/* ---------------- 3. txt parse ---------------- */
const raw = fs.readFileSync(SRC, 'utf8').split(/\r?\n/);
let cur = { exam: '', date: '', shift: '', file: '' };
const questions = [];
let q = null;

function flush() {
    if (!q) return;
    questions.push(q);
    q = null;
}

for (const line of raw) {
    const h = line.match(/^##\s+([^|]+)\|\s*([0-9]{4}-[0-9]{2}-[0-9]{2})\s*\|\s*Shift\s+(\S+)\s*\|\s*(.+)$/);
    if (h) { flush(); cur = { exam: h[1].trim(), date: h[2].trim(), shift: h[3].trim(), file: h[4].trim() }; continue; }
    const qm = line.match(/^Q\.\s*(\d+)\s*\[([^\]]*)\]\s*(.*)$/);
    if (qm) {
        flush();
        const meta = qm[2].split('|').map(s => s.trim());
        q = {
            exam: meta[0] || cur.exam, date: meta[1] || cur.date, shift: (meta[2] || cur.shift).replace(/^Shift\s*/i, ''),
            topic: meta.slice(3).join(' | ') || 'Unknown', stem: qm[3] || '', opts: [], answer: null
        };
        continue;
    }
    if (!q) continue;
    const om = line.match(/^\(([A-D])\)\s*(\(\+\))?\s*(.*)$/);
    if (om) {
        const idx = om[1].charCodeAt(0) - 65;
        if (q.opts[idx] === undefined) q.opts[idx] = '';
        q.opts[idx] = (q.opts[idx] ? q.opts[idx] + ' ' : '') + om[3].trim();
        q.lastOpt = idx;
        continue;
    }
    const am = line.match(/^Answer\s*:?\s*(.*)$/i);
    if (am) {
        const t = am[1].trim();
        q.answer = (/unavailable/i.test(t) || !t) ? null : t;
        q.lastOpt = undefined;
        continue;
    }
    if (!line.trim()) { q.lastOpt = undefined; continue; }
    /* wrapped line: option continuation or stem continuation */
    if (q.lastOpt !== undefined && q.opts[q.lastOpt] !== undefined) {
        q.opts[q.lastOpt] += ' ' + line.trim();
    } else {
        q.stem += (q.stem ? ' ' : '') + line.trim();
    }
}
flush();
console.log('parsed questions:', questions.length);

/* ---------------- 4. chapter lists (meta) ---------------- */
const examList = [], examIdx = {};
const shiftList = ['S1', 'S2', 'S3', 'S4', 'NA'], shiftIdx = { S1: 0, S2: 1, S3: 2, S4: 3, NA: 4 };
const chapterList = [];   // {name,en,slug,subs:[{sub,concepts:[[label,count]]}]}
const chapterIdx = {};

function examId(name) {
    const n = EXAM_MAP[name] || name || 'अज्ञात';
    if (examIdx[n] === undefined) { examIdx[n] = examList.length; examList.push(n); }
    return examIdx[n];
}
function chapterId(srcName) {
    const norm = (srcName || 'Unknown').trim();
    const map = CHAPTER_MAP[norm] || null;
    const slug = map ? map.slug : 'mixed-composite';
    const hi = map ? map.hi : 'विविध';
    const en = map ? map.slug.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ') : norm;
    if (chapterIdx[hi] === undefined) {
        chapterIdx[hi] = chapterList.length;
        const t = MTOPIC[slug];
        const subs = (t ? t.sub_topics.map(s => ({ sub: s.name, concepts: [['सामान्य', 0]] })) : [{ sub: 'general', concepts: [['सामान्य', 0]] }]);
        chapterList.push({ name: hi, en, slug, total: 0, withAns: 0, exams: {}, years: {}, subs });
    }
    return chapterIdx[hi];
}

/* ---------------- 5. tagging ---------------- */
function tagQuestion(chId, text) {
    const ch = chapterList[chId];
    const slug = ch.slug;
    const lex = (LEXICON[slug] || []).concat(chapterAliasLex(slug));
    if (!lex.length) return { subIdx: 0, conIdx: 0 };
    const lt = ' ' + text.toLowerCase() + ' ';
    let best = null, bestScore = 0;
    for (const cand of lex) {
        let sc = 0;
        for (const tk of cand.toks) {
            if (lt.includes(tk)) sc += cand.weight;
        }
        if (cand.phrase && lt.includes(cand.phrase)) sc += cand.weight + 5;
        if (sc > bestScore) { bestScore = sc; best = cand; }
    }
    if (!best) return { subIdx: 0, conIdx: 0 };
    // sub index in chapter.subs
    let subIdx = ch.subs.findIndex(s => s.sub === best.sub);
    if (subIdx === -1) {
        // alias sub not in list → append as new sub bucket
        ch.subs.push({ sub: best.sub, concepts: [['सामान्य', 0]] });
        subIdx = ch.subs.length - 1;
    }
    const sub = ch.subs[subIdx];
    let label = best.label || 'सामान्य';
    let conIdx = sub.concepts.findIndex(c => c[0] === label);
    if (conIdx === -1) { sub.concepts.push([label, 0]); conIdx = sub.concepts.length - 1; }
    return { subIdx, conIdx };
}

/* ---------------- 6. build records ---------------- */
const records = [];
let droppedDup = 0, ansResolved = 0, ansUnresolved = 0, ansNone = 0;
const stemSeen = new Set();

for (const qq of questions) {
    const stem = qq.stem.replace(/\s+/g, ' ').trim();
    if (stem.length < 8) continue;
    const key = normStem(stem);
    if (existingKeys.has(key)) { droppedDup++; continue; }
    if (stemSeen.has(key)) { droppedDup++; continue; }
    stemSeen.add(key);

    const opts = [0, 1, 2, 3].map(i => (qq.opts[i] || '').replace(/\s+/g, ' ').trim());
    let ansIdx = -1, ansText = '';
    if (qq.answer) {
        const a = qq.answer.replace(/\s+/g, ' ').trim().toLowerCase();
        ansIdx = opts.findIndex(o => o.toLowerCase() === a);
        if (ansIdx === -1) ansIdx = opts.findIndex(o => o.toLowerCase().replace(/[₹,\s]/g, '') === a.replace(/[₹,\s]/g, ''));
        if (ansIdx === -1) { ansText = qq.answer.trim(); ansUnresolved++; } else { ansResolved++; }
    } else { ansNone++; }

    const eId = examId(qq.exam);
    const cId = chapterId(qq.topic);
    const ch = chapterList[cId];
    const { subIdx, conIdx } = tagQuestion(cId, stem + ' ' + opts.join(' '));

    const y = (qq.date || '').slice(0, 4);
    ch.total++;
    if (qq.answer) ch.withAns++;
    ch.exams[examList[eId]] = (ch.exams[examList[eId]] || 0) + 1;
    if (y) ch.years[y] = (ch.years[y] || 0) + 1;
    ch.subs[subIdx].concepts[conIdx][1]++;

    const dateInt = qq.date ? parseInt(qq.date.replace(/-/g, ''), 10) : 0;
    const sId = shiftIdx[qq.shift] !== undefined ? shiftIdx[qq.shift] : 4;
    records.push([eId, dateInt, sId, cId, subIdx, conIdx, stem, opts[0], opts[1], opts[2], opts[3], ansIdx, ansText]);
}

console.log('kept:', records.length, '| dedup-dropped:', droppedDup, '| answers resolved:', ansResolved, 'unresolved-text:', ansUnresolved, 'unavailable:', ansNone);

/* ids: stable "Fxxxxx" */
records.forEach((r, i) => r.unshift('F' + String(i + 1).padStart(5, '0')));

/* ---------------- 7. emit index + chunks ---------------- */
function jsEsc(s) { return JSON.stringify(String(s == null ? '' : s)); }

const meta = {
    generated: new Date().toISOString().slice(0, 10),
    source: 'all-full-questions-with-options.txt (SSC + Railway PYQ library)',
    total: records.length,
    withAnswer: ansResolved + ansUnresolved,
    exactAnswer: ansResolved,
    textAnswer: ansUnresolved,
    noAnswer: ansNone,
    dedupDropped: droppedDup,
    exams: examList,
    shifts: shiftList,
    chapters: chapterList
};

let idxOut = '/* ============================================================\n' +
    '   गणित गुरु — FULL PYQ meta (auto-generated, हाथ से बदलें नहीं)\n' +
    '   स्रोत: data/all-full-questions-with-options.txt → tools/build_full_pyq.js\n' +
    '   record fields: [id, examIdx, dateInt yyyymmdd, shiftIdx, chapterIdx, subIdx, conceptIdx,\n' +
    '                   stem, optA..optD, ansIdx(-1=अनुपलब्ध), ansText]\n' +
    '   ============================================================ */\n' +
    'const PYQ_FULL=[];\nfunction PYQ_FULL_PUSH(a){for(let i=0;i<a.length;i++)PYQ_FULL.push(a[i]);}\n' +
    'const PYQ_FULL_META=' + JSON.stringify(meta) + ';\n';
fs.writeFileSync(path.join(OUT_DIR, 'data-pyq-full-index.js'), idxOut);

let files = [];
for (let i = 0; i < records.length; i += CHUNK_SIZE) {
    const chunk = records.slice(i, i + CHUNK_SIZE);
    const no = i / CHUNK_SIZE + 1;
    const fname = `data-pyq-full-${no}.js`;
    let out = '/* FULL PYQ chunk ' + no + ' (auto-generated) */\nPYQ_FULL_PUSH([';
    out += chunk.map(r => {
        // numbers as-is, strings JSON-escaped
        return '[' + r.map(v => typeof v === 'number' ? v : jsEsc(v)).join(',') + ']';
    }).join(',\n');
    out += ']);\n';
    fs.writeFileSync(path.join(OUT_DIR, fname), out);
    files.push(fname);
}

console.log('files written:', files.join(', '));
console.log('chapters:', chapterList.map(c => `${c.name}=${c.total}`).join(' | '));
console.log('exams:', examList.join(', '));
const sizes = fs.readdirSync(OUT_DIR).filter(f => f.startsWith('data-pyq-full')).map(f => f + '=' + (fs.statSync(path.join(OUT_DIR, f)).size / 1048576).toFixed(2) + 'MB');
console.log(sizes.join(' '));
