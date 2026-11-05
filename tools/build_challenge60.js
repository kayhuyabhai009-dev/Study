#!/usr/bin/env node
/* ============================================================
   build_challenge60.js — 🔥 60-दिन गणित चैलेंज का डेटा बनाता है।

   संरचना: 8 पूर्ण सप्ताह (5 सीखने के दिन + 1 रिवीज़न + 1 टेस्ट = 56)
   + 4 फिनाले दिन (महा-रिवीज़न I/II + ग्रैंड मॉक ×2) = 60 दिन
   • कुल 40 सीखने के दिन — 31 exam topics कवर (बड़े topics 2 दिन)
   • स्पेस्ड रिवीज़न (1-3-7): हर सीखने के दिन कल + 3-दिन-पुराना + 7-दिन-पुराना
   • हर दिन के tasks में topic के असली PYQ counts (PYQ_FULL_META) और
     mastery concept-counts (MASTERY_DATA) लिखे जाते हैं

   आउटपुट: js/data-challenge.js → CHALLENGE_60, CHALLENGE_PHASES, CH_MILESTONES
   (CHALLENGE_MASTERY build_mastery_data.js से आता है)

   चलाना:  node tools/build_challenge60.js   (फिर node tools/build_mastery_data.js)
   ============================================================ */
'use strict';

const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');

/* ---------- inputs ---------- */
const MASTERY = new Function(fs.readFileSync(path.join(root, 'js/data-mastery-path.js'), 'utf8') + '; return MASTERY_DATA;')();
const MT = {};
MASTERY.topics.forEach(t => { MT[t.slug] = t; });

let FULL_META = null;
try {
    FULL_META = new Function(fs.readFileSync(path.join(root, 'js/data-pyq-full-index.js'), 'utf8') + '; return PYQ_FULL_META;')();
} catch (e) { FULL_META = { chapters: [] }; }
const FULL_BY_SLUG = {};
FULL_META.chapters.forEach(c => { (FULL_BY_SLUG[c.slug] = FULL_BY_SLUG[c.slug] || []).push(c); });
function fullCount(slug) {
    return (FULL_BY_SLUG[slug] || []).reduce((s, c) => s + c.total, 0);
}
function conceptCount(slug) {
    const t = MT[slug];
    if (!t) return 0;
    let n = 0; t.sub_topics.forEach(s => { n += s.concepts.length; });
    return n;
}
function topPatterns(slug, n) {
    const t = MT[slug];
    if (!t) return [];
    return (t.patterns || []).slice(0, n).map(p => p.name);
}

/* ---------- topic display meta (chip Hindi नाम PYQ canonical से मिलता-जुलता) ---------- */
const TOPIC = {
    'number-system': { hi: 'संख्या पद्धति', chip: 'संख्या पद्धति', chap: 'number-system' },
    'hcf-lcm': { hi: 'HCF-LCM', chip: 'HCF-LCM', chap: 'number-system' },
    'simplification': { hi: 'सरलीकरण', chip: 'सरलीकरण', chap: 'simplification' },
    'percentage': { hi: 'प्रतिशत', chip: 'प्रतिशत', chap: 'percentage' },
    'average': { hi: 'औसत', chip: 'औसत', chap: 'average' },
    'elementary-statistics': { hi: 'सांख्यिकी', chip: 'सांख्यिकी', chap: 'statistics-di' },
    'ratio-proportion': { hi: 'अनुपात-समानुपात', chip: 'अनुपात-समानुपात', chap: 'ratio' },
    'profit-loss': { hi: 'लाभ-हानि', chip: 'लाभ-हानि', chap: 'profit-loss' },
    'discount': { hi: 'छूट (बट्टा)', chip: 'छूट (बट्टा)', chap: 'profit-loss' },
    'simple-interest': { hi: 'साधारण ब्याज', chip: 'साधारण ब्याज', chap: 'interest' },
    'compound-interest': { hi: 'चक्रवृद्धि ब्याज', chip: 'चक्रवृद्धि ब्याज', chap: 'interest' },
    'mixture-alligation': { hi: 'मिश्रण-एलीगेशन', chip: 'मिश्रण-एलीगेशन', chap: 'ratio' },
    'ages': { hi: 'आयु', chip: 'आयु', chap: 'average' },
    'sequences-and-series': { hi: 'श्रेणी (AP/GP)', chip: 'श्रेणी (AP/GP)', chap: 'sets-ap-coordinate' },
    'set-theory': { hi: 'समुच्चय', chip: 'समुच्चय', chap: 'sets-ap-coordinate' },
    'probability': { hi: 'प्रायिकता', chip: 'प्रायिकता', chap: 'sets-ap-coordinate' },
    'permutation-and-combination': { hi: 'क्रमचय-संचय', chip: 'क्रमचय-संचय', chap: 'sets-ap-coordinate' },
    'time-work': { hi: 'समय-कार्य', chip: 'समय-कार्य', chap: 'time-work' },
    'pipes-cisterns': { hi: 'पाइप-टंकी', chip: 'पाइप-टंकी', chap: 'time-work' },
    'time-speed-distance': { hi: 'समय-चाल-दूरी', chip: 'समय-चाल-दूरी', chap: 'speed-distance' },
    'trains': { hi: 'रेलगाड़ी', chip: 'रेलगाड़ी', chap: 'speed-distance' },
    'boats-streams': { hi: 'नाव-धारा', chip: 'नाव-धारा', chap: 'speed-distance' },
    'mensuration-2d': { hi: 'क्षेत्रमिति 2D', chip: 'क्षेत्रमिति 2D', chap: 'mensuration-2d' },
    'mensuration-3d': { hi: 'क्षेत्रमिति 3D', chip: 'क्षेत्रमिति 3D', chap: 'mensuration-3d' },
    'geometry': { hi: 'ज्यामिति', chip: 'ज्यामिति', chap: 'geometry' },
    'circles-polygons': { hi: 'वृत्त-बहुभुज', chip: 'वृत्त-बहुभुज', chap: 'geometry' },
    'coordinate-geometry': { hi: 'निर्देशांक ज्यामिति', chip: 'निर्देशांक ज्यामिति', chap: 'geometry' },
    'algebra': { hi: 'बीजगणित', chip: 'बीजगणित', chap: 'algebra' },
    'trigonometry': { hi: 'त्रिकोणमिति', chip: 'त्रिकोणमिति', chap: 'trigonometry' },
    'data-interpretation': { hi: 'आँकड़े (DI)', chip: 'आँकड़े (DI)', chap: 'statistics-di' }
};

/* ---------- 60-दिन schedule (40 सीखने के दिन) ---------- */
const SCHEDULE = [
    { wk: 1, phase: 1, theme: 'नींव — संख्या पद्धति व सरलीकरण', days: [
        ['number-system', 'संख्या प्रकार + विभाज्यता नियम'],
        ['number-system', 'शेषफल + इकाई अंक + गुणनखंड'],
        ['hcf-lcm', 'HCF-LCM के सारे प्रमाण (घंटियाँ/सीढ़ियाँ तक)'],
        ['simplification', 'BODMAS + भिन्न बार-विभाजन'],
        ['simplification', 'वर्गमूल-घनमूल + घातांक-करणी'],
    ] },
    { wk: 2, phase: 1, theme: 'प्रतिशत से अनुपात तक', days: [
        ['percentage', 'प्रतिशत आधार + fraction↔% टेबल'],
        ['percentage', 'successive change + जनसंख्या + चुनाव-अंक'],
        ['average', 'औसत के सारे पैटर्न (जुड़ना/हटना/क्रमागत)'],
        ['elementary-statistics', 'mean-median-mode + range'],
        ['ratio-proportion', 'अनुपात के नियम + proportion'],
    ] },
    { wk: 3, phase: 2, theme: 'व्यापारी अंकगणित', days: [
        ['ratio-proportion', 'ratio applications + coins/shares'],
        ['profit-loss', 'CP-SP + profit% के बुनियादी पैटर्न'],
        ['profit-loss', 'दो-वस्तु सौदे + बेईमान दुकानदार'],
        ['discount', 'छूट + successive discount + MP'],
        ['simple-interest', 'SI के सारे सूत्र व प्रमाण'],
    ] },
    { wk: 4, phase: 2, theme: 'CI, मिश्रण व छोटे विषय', days: [
        ['compound-interest', 'CI + CI−SI difference + half-yearly'],
        ['mixture-alligation', 'एलीगेशन रूल + replacement'],
        ['ages', 'आयु के सारे पैटर्न'],
        ['sequences-and-series', 'AP/GP nth-term + योग', ['set-theory', 'समुच्चय (Venn) परिचय']],
        ['probability', 'प्रायिकता की बुनियाद', ['permutation-and-combination', 'क्रमचय-संचय की झलक']],
    ] },
    { wk: 5, phase: 3, theme: 'कार्य व गति', days: [
        ['time-work', 'LCM विधि + efficiency की भाषा'],
        ['time-work', 'M-D-H + alternate days + wages'],
        ['pipes-cisterns', 'पाइप-टंकी (inlet/outlet/leak)'],
        ['time-speed-distance', 'चाल-दूरी आधार + average speed'],
        ['time-speed-distance', 'early-late + relative speed'],
    ] },
    { wk: 6, phase: 3, theme: 'रेल-नाव + क्षेत्रमिति 2D', days: [
        ['trains', 'रेल के सारे पैटर्न (खंभा/प्लेटफ़ॉर्म/दो ट्रेनें)'],
        ['boats-streams', 'नाव-धारा up/down stream'],
        ['mensuration-2d', 'त्रिभुज, चतुर्भुज क्षेत्रफल'],
        ['mensuration-2d', 'वृत्त + क्षेत्र-पथ (paths/flooring)'],
        ['mensuration-3d', 'घन-घनाभ + बेलन'],
    ] },
    { wk: 7, phase: 4, theme: '3D सील + ज्यामिति', days: [
        ['mensuration-3d', 'शंकु-गोला + पिघलाकर ढलाई'],
        ['geometry', 'रेखाएँ-कोण + त्रिभुज के केंद्र'],
        ['geometry', 'सर्वांगसमता-समरूपता + क्षेत्र जोड़'],
        ['circles-polygons', 'वृत्त (chord/tangent) + बहुभुज'],
        ['coordinate-geometry', 'निर्देशांक: दूरी, midpoint, क्षेत्रफल'],
    ] },
    { wk: 8, phase: 4, theme: 'बीजगणित-त्रिग-DI', days: [
        ['algebra', 'सर्वसमिकाएँ + x+1/x परिवार'],
        ['algebra', 'द्विघात + बहुपद + शेषफल प्रमेय'],
        ['trigonometry', 'अनुपात-तालिका + सर्वसमिकाएँ'],
        ['trigonometry', 'पूरक कोण + ऊँचाई-दूरी'],
        ['data-interpretation', 'DI — table, bar, pie, line'],
    ] },
];

const CALC_PAIRS = {
    1: ['tables', 'squares'], 2: ['squares', 'fracPercent'], 3: ['fracPercent', 'percentCalc'],
    4: ['addSub', 'percentCalc'], 5: ['percentCalc', 'twoDigitMul'], 6: ['twoDigitMul', 'successive'],
    7: ['baseMul', 'chainAdd'], 8: ['cubes', 'cubeRoot'], 9: ['mixedSprint', 'series']
};

/* ---------- दिन बनाना ---------- */
const days = [];
const learnDayTopics = [];   // { d, slugs, chips } — spaced repetition हेतु
let d = 0;

function pushDay(o) { d++; o.d = d; days.push(o); }

SCHEDULE.forEach((w) => {
    const ordinals = ['पहला', 'दूसरा', 'तीसरा', 'चौथा', 'पाँचवाँ'];
    w.days.forEach((spec, k) => {
        const slug = spec[0], focus = spec[1], extra = spec[2] || null;
        const meta = TOPIC[slug];
        const allSpecs = [spec].concat(extra ? [[extra[0], extra[1]]] : []);
        const slugs = allSpecs.map(s => s[0]);
        const chips = allSpecs.map(s => TOPIC[s[0]].chip);
        const nC = slugs.reduce((s, sg) => s + conceptCount(sg), 0);
        const nPyq = slugs.reduce((s, sg) => s + fullCount(sg), 0);
        const pats = slugs.flatMap(sg => topPatterns(sg, 2)).slice(0, 3);
        const entry = { d: d + 1, slugs, chips };

        const tasks = [
            { i: '📖', t: 'फॉर्मूला बुक — 「' + meta.hi + '」 अध्याय के सूत्र: रट्टा नहीं, derivation के साथ समझें', go: ['chapter', meta.chap] },
            { i: '📚', t: `मास्टरी मार्ग में आज के topic के ${nC} concepts खोलें — हर concept: समझ → पहचान → शॉर्टकट → ट्रैप`, go: ['mastery', slug] },
            { i: '⚡', t: pats.length ? 'आज के मुख्य शॉर्टकट पैटर्न: ' + pats.join(' · ') : 'आज के topic की ⚡ फास्ट ट्रिक्स + 🧠 पैटर्न इंजन देखें', go: ['mastery', slug] },
            { i: '🗂️', t: `PYQ अभ्यास — इस topic के ${nPyq ? nPyq.toLocaleString('en-IN') + ' असली' : ''} प्रश्नों में से कम से कम 20 टाइमर से (लक्ष्य 80%+, ≤45 से/प्रश्न)`, go: ['pyq', chips[0]] },
            { i: '📅', t: 'डेली प्रैक्टिस का आज का सेट (10 प्रश्न)', go: ['daily'] },
        ];
        const rev = [
            { i: '🔁', t: k === 0 ? 'सेट-अप: कल की study-table तैयार; इस सप्ताह के सभी सूत्रों की झलक देखें' : spacedRecall(k, entry) },
            { i: '🃏', t: 'फ्लैशकार्ड — आज के topic के 12 कार्ड पलटें', go: ['flash'] },
        ];
        const back3 = learnDayTopics.find(x => entry.d - x.d === 3);
        const back7 = learnDayTopics.find(x => entry.d - x.d === 7);
        if (back3) rev.push({ i: '🎯', t: `दिन ${back3.d} (${back3.chips.join(', ')}) के 5 PYQ quick-fire — बिना रुके`, go: ['pyq', back3.chips[0]] });
        if (back7) rev.push({ i: '⏪', t: `दिन ${back7.d} (${back7.chips.join(', ')}) — formulas बिना देखे बोलकर टेस्ट`, go: ['mastery', back7.slugs[0]] });

        pushDay({
            wk: w.wk, phase: w.phase, type: 'learn', chap: meta.chap,
            title: meta.hi + ' — ' + focus,
            sub: 'सप्ताह ' + w.wk + ' • ' + ordinals[k] + ' दिन • ' + w.theme,
            topics: chips, slugs,
            tasks, rev, calc: CALC_PAIRS[w.wk] || ['tables', 'squares'], mins: 150
        });
        learnDayTopics.push(entry);
    });

    /* शनिवार रिवीज़न */
    const wkChips = [...new Set(learnDayTopics.slice(-5).flatMap(x => x.chips))];
    pushDay({
        wk: w.wk, phase: w.phase, type: 'revise', chap: TOPIC[SCHEDULE[w.wk - 1].days[0][0]].chap,
        title: 'सप्ताह ' + w.wk + ' रिवीज़न — एकत्र दोहराव + कमज़ोर concepts',
        sub: 'सप्ताह ' + w.wk + ' • छठा दिन • ' + w.theme,
        topics: wkChips, slugs: learnDayTopics.slice(-5).flatMap(x => x.slugs),
        tasks: [
            { i: '📖', t: 'पूरे हफ्ते के सूत्र — हर सूत्र 10 सेकंड में बिना देखे बोलें/लिखें', go: ['section', 'formulas'] },
            { i: '👁️', t: 'इस हफ्ते के concepts में 👁️/✍️ वाले बचे थे तो आज 🏆 तक ले जाएँ', go: ['section', 'learn'] },
            { i: '🎮', t: 'मिश्रित क्विज़ 15 प्रश्न (इस हफ्ते + पुराने टॉपिक मिक्स)', go: ['quiz', 15] },
            { i: '❌', t: 'एरर लॉग: हफ्ते भर की गलतियाँ दोबारा solve — बिना copy देखे', go: ['errors'] },
            { i: '🗂️', t: 'PYQ बैंक: जिस concept में अटके थे, उसके 10 प्रश्न फिर से', go: ['section', 'pyq'] },
        ],
        rev: [{ i: '🛡️', t: 'ट्रैप बुक: इस हफ्ते के टॉपिक से जुड़े traps दोहराएँ', go: ['traps'] }],
        calc: CALC_PAIRS[w.wk] || ['mixedSprint', 'percentCalc'], mins: 120
    });

    /* रविवार टेस्ट */
    pushDay({
        wk: w.wk, phase: w.phase, type: 'test', chap: TOPIC[SCHEDULE[w.wk - 1].days[0][0]].chap,
        title: 'सप्ताह ' + w.wk + ' टेस्ट — परीक्षा-परिस्थिति में',
        sub: 'सप्ताह ' + w.wk + ' • सातवाँ दिन • ' + w.theme,
        topics: wkChips, slugs: learnDayTopics.slice(-5).flatMap(x => x.slugs),
        tasks: [
            { i: '📝', t: 'इग्ज़ाम-मोड क्विज़ 25 प्रश्न — 25 मिनट, बिना रुके (इसी सप्ताह के टॉपिक)', go: ['quiz', 25] },
            { i: '🗂️', t: 'PYQ टाइम-टेस्ट: इस सप्ताह के टॉपिक के 15 प्रश्न 12 मिनट में', go: ['pyq', wkChips[0]] },
            { i: '📊', t: 'Score analysis: हर गलत प्रश्न का "क्यों गलत हुआ" एरर लॉग में', go: ['errors'] },
            { i: '🔁', t: 'सबसे कमज़ोर टॉपिक का फॉर्मूला quick-scan (रिवीज़न सेंटर)', go: ['revision'] },
            { i: '🗓️', t: 'अगले हफ्ते का 5-दिन प्लान Learn पेज पर देख लें — मानसिक तैयारी', go: ['section', 'learn'] },
        ],
        rev: [{ i: '😴', t: 'पढ़ाई के बाद 20-30 मिनट आराम — burnout सबसे बड़ा दुश्मन' }],
        calc: ['mixedSprint', 'percentCalc'], mins: 150
    });
});

/* कल (पिछले सीखने के दिन) के recall के लिए helper */
function spacedRecall(k, entry) {
    const prev = learnDayTopics[learnDayTopics.length - 1];
    if (!prev) return 'सेट-अप दिन — नियोजित शुरुआत करें';
    return `कल (दिन ${prev.d}) पढ़े ${prev.chips.join(', ')} के हर सूत्र को बिना देखे बोलें/लिखें (10 मिनट)`;
}

/* ---------- फिनाले (दिन 57-60) ---------- */
const finale = [
    { type: 'revise', title: '👑 महा-रिवीज़न I — अंकगणित (सप्ताह 1-4)', t: 'संख्या पद्धति से चक्रवृद्धि ब्याज तक का पूरा अंकगणित', chips: ['संख्या पद्धति', 'HCF-LCM', 'सरलीकरण', 'प्रतिशत', 'औसत', 'अनुपात-समानुपात', 'लाभ-हानि', 'छूट (बट्टा)', 'साधारण ब्याज', 'चक्रवृद्धि ब्याज', 'मिश्रण-एलीगेशन', 'आयु'], slugs: ['number-system', 'hcf-lcm', 'simplification', 'percentage', 'average', 'ratio-proportion', 'profit-loss', 'discount', 'simple-interest', 'compound-interest', 'mixture-alligation', 'ages'] },
    { type: 'revise', title: '👑 महा-रिवीज़न II — कार्य-गति व एडवांस्ड (सप्ताह 5-8)', t: 'समय-कार्य से DI तक — बची हुई पूरी syllabus', chips: ['समय-कार्य', 'पाइप-टंकी', 'समय-चाल-दूरी', 'रेलगाड़ी', 'नाव-धारा', 'क्षेत्रमिति 2D', 'क्षेत्रमिति 3D', 'ज्यामिति', 'वृत्त-बहुभुज', 'निर्देशांक ज्यामिति', 'बीजगणित', 'त्रिकोणमिति', 'आँकड़े (DI)'], slugs: ['time-work', 'pipes-cisterns', 'time-speed-distance', 'trains', 'boats-streams', 'mensuration-2d', 'mensuration-3d', 'geometry', 'circles-polygons', 'coordinate-geometry', 'algebra', 'trigonometry', 'data-interpretation'] },
    { type: 'mock', title: '🏆 ग्रैंड मॉक-1 — पूरा पेपर simulation', t: 'एक बैठक, पूरा दबाव, असली परीक्षा भावना', chips: [], slugs: [] },
    { type: 'mock', title: '🏆 ग्रैंड मॉक-2 + चैंपियन समीक्षा', t: 'कमज़ोर कड़ियों का अंतिम निराकरण — फिर जश्न', chips: [], slugs: [] },
];
finale.forEach((f, i) => {
    const isMock = f.type === 'mock';
    pushDay({
        wk: 9, phase: 5, type: f.type, chap: i < 2 ? 'number-system' : null,
        title: f.title,
        sub: 'सप्ताह 9 • फिनाले • ' + (isMock ? 'परीक्षा-हॉल simulation' : 'पूरी syllabus एकत्र-दोहराव'),
        topics: f.chips, slugs: f.slugs,
        tasks: isMock ? [
            { i: '📝', t: 'फुल मॉक: क्विज़ 25 प्रश्न, exam-mode, एक ही बैठक में', go: ['quiz', 25] },
            { i: '🗂️', t: 'PYQ बैंक-speed test: मिश्रित 15 प्रश्न (all filters open)', go: ['section', 'pyq'] },
            { i: '📊', t: 'मॉक score analysis + elapsed ≈ Day-1 से trend तुलना लिखें', go: ['profile'] },
            { i: '🔁', t: 'केवल 2 weakest topics का अंतिम रिवीज़न — नया कुछ नहीं', go: ['revision'] },
            { i: '🏆', t: i === 3 ? '60-दिन champion report प्रोफ़ाइल में देखें — आप जीत गए!' : 'कल finale-2 — आज आराम और आत्मविश्वास', go: ['profile'] },
        ] : [
            { i: '📖', t: f.t + ' — फॉर्मूला बुक का तेज़ स्कैन (हर formula 5 सेकंड में verbal)', go: ['section', 'formulas'] },
            { i: '🏆', t: 'इन topics के 🏆-pending concepts पक्के करें', go: ['section', 'learn'] },
            { i: '🗂️', t: 'PYQ बैंक: इन chapters के मिश्रित 30 प्रश्न (सिर्फ concepts जिनका कम score)', go: ['section', 'pyq'] },
            { i: '❌', t: 'एरर लॉग का पूरा revision — 100% सही होने तक दोहराएँ', go: ['errors'] },
            { i: '🛡️', t: 'ट्रैप बुक — सभी traps ज़ुबानी दोहराएँ', go: ['traps'] },
        ],
        rev: [{ i: '🧘', t: 'नींद 7-8 घंटे तय — दिमाग़ tools हैं, आराम बैटरी है' }],
        calc: i < 2 ? ['series', 'mixedSprint'] : ['mixedSprint', 'chainAdd'],
        mins: isMock ? 180 : 150
    });
});

console.assert(days.length === 60, 'days must be 60, got ' + days.length);
const learnCount = days.filter(x => x.type === 'learn').length;
console.assert(learnCount === 40, 'learn days must be 40, got ' + learnCount);

/* ---------- phases + milestones ---------- */
const CHALLENGE_PHASES = [
    { id: 1, days: '1–14', name: '🟢 चरण 1 — नींव', goal: 'संख्या, सरलीकरण, प्रतिशत, औसत की रीढ़; fraction↔% table रट जाए' },
    { id: 2, days: '15–28', name: '🔵 चरण 2 — व्यापारी अंकगणित', goal: 'लाभ-हानि, छूट, ब्याज, अनुपात, मिश्रण के सारे पैटर्न पक्के' },
    { id: 3, days: '29–42', name: '🟠 चरण 3 — कार्य, गति व 2D', goal: 'समय-कार्य से लेकर रेल-नाव; क्षेत्रमिति 2D formulas reflex में' },
    { id: 4, days: '43–56', name: '🟣 चरण 4 — एडवांस्ड + DI', goal: '3D, ज्यामिति, बीजगणित, त्रिग का आत्मविश्वास; DI reflex' },
    { id: 5, days: '57–60', name: '👑 चरण 5 — फाइनल मोड', goal: 'महा-रिवीज़न + ग्रैंड मॉक — कमज़ोरी शून्य, confidence शिखर' },
];

const CH_MILESTONES = [
    { d: 1, icon: '🚀', name: 'शुभारंभ', hint: '60-दिन चैलेंज शुरू — पहला दिन पूरा' },
    { d: 7, icon: '🥉', name: 'पहला सप्ताह', hint: '7 दिन लगातार अनुशासन — नींव पक्की होने लगी' },
    { d: 14, icon: '🌱', name: 'नींव पक्की', hint: 'संख्या पद्धति से अनुपात तक का आधार' },
    { d: 21, icon:'🧮', name: 'व्यापारी सेट', hint: 'लाभ-हानि, छूट, ब्याज के पैटर्न आत्मसात' },
    { d: 28, icon: '⚖️', name: 'CI-मिश्रण क्लीयर', hint: 'आधी syllabus पार — लय न टूटने दें' },
    { d: 35, icon: '🏃', name: 'कार्य-गति पक्की', hint: 'समय-कार्य और चाल-दूरी के सारे shortcuts' },
    { d: 42, icon: '📐', name: 'रेल से 2D तक', hint: 'रेलगाड़ी, नाव-धारा, क्षेत्रमिति 2D जीत ली' },
    { d: 49, icon: '🔺', name: 'ज्यामिति सफ़र', hint: '3D + ज्यामिति के कोणे-कोणे तक' },
    { d: 56, icon: '📊', name: 'एडवांस्ड+DI पूरा', hint: 'बीजगणित, त्रिग, DI — सीखना पूर्ण' },
    { d: 60, icon: '👑', name: 'गणित चैंपियन', hint: '60 दिन पूरे — Certificate-Worthy जीत!' },
];

/* ---------- emit ---------- */
function js(o) { return JSON.stringify(o); }
const out =
`/* ============================================================
   गणित गुरु — 🔥 60-दिन गणित चैलेंज (auto-generated, हाथ से बदलें नहीं)
   संरचना: 8 सप्ताह × (5 सीखने + 1 रिवीज़न + 1 टेस्ट) + 4 फिनाले दिन
   = 40 सीखने के दिन + 8 रिवीज़न + 8 टेस्ट + 4 फिनाले = 60 दिन
   स्पेस्ड रिवीज़न: 1-3-7 नियम (rev tasks में दिन-संदर्भ लिखे हैं)
   दोबारा बनाने के लिए:  node tools/build_challenge60.js
   ============================================================ */

const CHALLENGE_60 = ${JSON.stringify(days)};

const CHALLENGE_PHASES = ${JSON.stringify(CHALLENGE_PHASES)};

const CH_MILESTONES = ${JSON.stringify(CH_MILESTONES)};

if (typeof module !== 'undefined') module.exports = { CHALLENGE_60, CHALLENGE_PHASES, CH_MILESTONES };
`;
fs.writeFileSync(path.join(root, 'js', 'data-challenge.js'), out);
console.log('✔ js/data-challenge.js — 60 दिन लिखे गए (learn:', learnCount, ')');
