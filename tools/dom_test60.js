/* DOM smoke test (jsdom) — 60-दिन अपग्रेड के बाद का पूरा boot + नई सुविधाएँ।
   चलाना: node tools/dom_test60.js   (पहले npm i jsdom) */
const fs = require('fs');
const path = require('path');
const { JSDOM, VirtualConsole } = require('jsdom');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const errs = [];
const vc = new VirtualConsole();
vc.on('jsdomError', e => { if (!/Could not (load|parse) (css|stylesheet|link)/i.test(e.message) && !/Not implemented: navigation/i.test(e.message)) errs.push('jsdomError: ' + e.message); });
vc.on('error', (...a) => errs.push('console.error: ' + a.join(' ')));

const dom = new JSDOM(html, {
    url: 'http://localhost:8000/',
    runScripts: 'dangerously',
    resources: 'usable',
    pretendToBeVisual: true,
    virtualConsole: vc,
    beforeParse(window) {
        window.matchMedia = window.matchMedia || (() => ({ matches: false, addEventListener: () => {}, removeEventListener: () => {} }));
        window.scrollTo = () => {};
        window.confirm = () => true;
        window.alert = () => {};
    }
});

(async () => {
    const deadline = Date.now() + 30000;
    while (dom.window.document.readyState !== 'complete' && Date.now() < deadline) await new Promise(r => setTimeout(r, 200));
    await new Promise(r => setTimeout(r, 4000));
    const w = dom.window, doc = w.document;
    let fails = 0;
    const ok = (c, m) => { console.log((c ? 'PASS' : 'FAIL') + ' | ' + m); if (!c) fails++; };

    // बूट + लॉगिन
    const modal = doc.getElementById('user-modal');
    ok(modal && modal.style.display !== 'none', 'नाम-मोडल खुला');
    doc.getElementById('user-name-input').value = 'राहुल';
    doc.getElementById('user-name-save').click();
    await new Promise(r => setTimeout(r, 100));
    ok(modal.style.display === 'none', 'लॉगिन के बाद मोडल बंद');

    // 60-दिन चैलेंज
    ok(w.eval('typeof CHALLENGE_60 !== "undefined" && CHALLENGE_60.length') === 60, 'CHALLENGE_60 = 60 दिन');
    ok(w.eval('CHALLENGE_60.filter(d=>d.type==="learn").length') === 40, '40 सीखने के दिन');
    ok(w.eval('CHALLENGE_60.filter(d=>d.type==="revise").length') === 10, '8 साप्ताहिक + 2 महा रिवीज़न');
    ok(w.eval('typeof CHALLENGE_MASTERY!=="undefined" && CHALLENGE_MASTERY.days.length') === 60, 'CHALLENGE_MASTERY 60 दिन mapped');
    w.eval('startChallenge()');
    await new Promise(r => setTimeout(r, 150));
    const stage = doc.getElementById('ch-stage');
    ok(stage.querySelectorAll('.ch-cell').length === 60, 'चैलेंज strip: 60 day-cells');
    ok(stage.querySelectorAll('.ch-week').length === 9, 'टाइमटेबल: 9 सप्ताह');
    ok(stage.innerHTML.includes('/60'), 'चैलेंज /60 labels');
    // spaced revision: दिन 9 के rev में दिन 6/2 का ज़िक्र
    w.eval('chSelectDay(9)');
    const revText = doc.getElementById('ch-stage').textContent;
    ok(/दिन 8|कल/.test(revText) && /दिन 6/.test(revText) && /दिन 2/.test(revText), '1-3-7 स्पेस्ड रिवीज़न दिन 9 में (कल-8, दिन-6, दिन-2)');
    w.eval('chCompleteDay(1)');
    await new Promise(r => setTimeout(r, 100));
    ok(w.eval('state.challenge.done["1"]') === true, 'दिन 1 done सेव');

    // Learn: Day view
    w.eval('startChallenge && openSection("learn")');
    await new Promise(r => setTimeout(r, 100));
    const cells = doc.querySelectorAll('#learn-days .ld-day');
    ok(cells.length === 60, 'Learn: Day 1-60 ग्रिड — 60 दिन मिले (मिले: ' + cells.length + ')');
    ok(doc.querySelectorAll('#learn-days .ld-week').length === 9, 'Learn: 9 सप्ताह कार्ड');
    // दिन खोलें
    w.eval('openLearnDay(1)');
    await new Promise(r => setTimeout(r, 50));
    const dd = doc.getElementById('mastery-detail');
    ok(dd && dd.innerHTML.includes('ld-topic'), 'दिन 1 detail + topic कार्ड');
    ok(dd.innerHTML.includes('स्पेस्ड रिवीज़न'), 'दिन detail में स्पेस्ड रिवीज़न');
    ok(dd.innerHTML.includes('चैलेंज में खोलें'), 'दिन → चैलेंज लिंक');

    // Learn: topics tab + topic page
    w.eval('setLearnTab("topics")');
    ok(doc.querySelectorAll('#mastery-topics .m-topic').length === 35, 'सभी टॉपिक: 35 cards');
    ok(doc.querySelector('.lt-tab[data-lt="topics"]').classList.contains('on'), 'topics tab active');
    w.eval('openMasteryTopic("number-system")');
    await new Promise(r => setTimeout(r, 50));
    ok(doc.querySelectorAll('#mastery-detail .m-concept').length >= 4, 'topic पेज: concept cards');
    ok(doc.querySelectorAll('#mastery-detail .m-cf-pyq').length >= 4, 'हर concept में "इस concept के PYQ" बटन');
    ok(doc.querySelector('#mastery-detail .btn-hot') !== null, 'topic पेज: सभी PYQ बटन');

    // PYQ bank: FULL data merged + filters
    w.eval('openSection("pyq")');
    await new Promise(r => setTimeout(r, 100));
    const total = w.eval('PYQ_ALL.length');
    ok(total > 36000, 'PYQ_ALL merged > 36,000 (वर्तमान: ' + total + ')');
    ok(w.eval('PYQ_FULL.length') > 26000, 'PYQ_FULL rows loaded');
    const cnt = doc.getElementById('pyq-count').textContent;
    ok(/37,?000|कुल/.test(cnt), 'PYQ count render: ' + cnt.trim().slice(0, 60));
    ok(doc.getElementById('pyq-year-filter').options.length > 5, 'वर्ष फिल्टर भरा');
    ok(doc.getElementById('pyq-shift-filter').options.length > 3, 'shift फिल्टर भरा');
    ok(doc.getElementById('pyq-concept-filter') !== null, 'concept फिल्टर मौजूद');

    // chapter filter → प्रतिशत
    w.eval('openPyqTopic("प्रतिशत")');
    await new Promise(r => setTimeout(r, 50));
    const listCnt = doc.getElementById('pyq-count').textContent;
    ok(/📚 प्रतिशत/.test(listCnt), 'chapter फिल्टर: प्रतिशत');
    const cards = doc.querySelectorAll('#pyq-list .pyq-item');
    ok(cards.length > 10, 'प्रतिशत प्रश्न कार्ड render (' + cards.length + ')');
    ok(doc.querySelector('#pyq-list .pyq-item .pyq-meta') !== null, 'कार्ड पर exam•date•shift meta');
    ok(doc.querySelector('#pyq-list .pyq-item .pyq-concept') !== null, 'कार्ड पर concept chip');

    // concept deep-link (Learn से) — संख्या पद्धति/शेषफल
    w.eval('openPyqConcept("संख्या पद्धति", "remainder")');
    await new Promise(r => setTimeout(r, 50));
    const cc = doc.getElementById('pyq-count').textContent;
    ok(/🔖 remainder/.test(cc), 'concept फिल्टर deep-link: ' + cc.trim().slice(0, 80));
    ok(doc.querySelectorAll('#pyq-list .pyq-item').length > 0, 'concept-filtered प्रश्न मिले');

    // exam+year filter combo
    w.eval('pyqResetFilters && (pyqFilters.exam="SSC CGL", pyqFilters.year="2024", renderPyq())');
    const combo = doc.getElementById('pyq-count').textContent;
    ok(/SSC CGL/.test(combo) && /2024/.test(combo), 'exam+year कॉम्बो फिल्टर');

    // PYQ एनालिसिस नए aggregates
    w.eval('openSection("pyq-analysis")');
    await new Promise(r => setTimeout(r, 100));
    ok(w.eval('PYQ_ANALYSIS.totals.questions') === 37061, 'PYQ_ANALYSIS: 37,061 प्रश्न');
    ok(doc.querySelectorAll('#pa-topics .pa-topic-card').length >= 30, 'PYQ एनालिसिस: 30+ टॉपिक कार्ड');

    // हर सेक्शन खोलें — कोई error नहीं आनी चाहिए
    const sections = ['dashboard','formulas','calculation','fast-tricks','daily','quiz','flashcards','notes','patterns','traps','mastery','error-log','revision','timer','pdf-research','exams','plan','profile'];
    for (const s2 of sections) { w.openSection(s2); }
    ok(true, 'सभी सेक्शन खुल गए');

    const realErrs = errs.filter(e => !/localStorage|quota/i.test(e));
    ok(realErrs.length === 0, 'कोई runtime error नहीं' + (realErrs.length ? ' — ' + realErrs[0].slice(0, 300) : ''));

    console.log(fails === 0 ? '\n🎉 ALL PASS' : '\n❌ FAILS: ' + fails);
    process.exit(fails === 0 ? 0 : 1);
})().catch(e => { console.error('CRASH:', e); process.exit(1); });
