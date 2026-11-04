/* DOM smoke test (jsdom): असली index.html पर पूरा boot — गलती आए तो fail। */
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

function waitForResources() {
    return new Promise(res => {
        const deadline = Date.now() + 25000;
        const t = setInterval(() => {
            const doc = dom.window.document;
            const scriptsLoaded = !doc.querySelector('script[src]') || [...doc.querySelectorAll('script[src]')]
                .every(s => s.__done || s.sheet || true);
            if (doc.readyState === 'complete' || Date.now() > deadline) { clearInterval(t); res(); }
        }, 150);
    });
}

(async () => {
    await waitForResources();
    await new Promise(r => setTimeout(r, 2500));
    const w = dom.window, doc = w.document;
    let fails = 0;
    const ok = (c, m) => { console.log((c ? 'PASS' : 'FAIL') + ' | ' + m); if (!c) fails++; };

    ok(doc.getElementById('ch-stage'), 'चैलेंज seक्शन मौजूद');
    ok(typeof w.startChallenge === 'function', 'startChallenge global (onclick-ready)');

    // नाम मोडल + लॉगिन
    const modal = doc.getElementById('user-modal');
    ok(modal && modal.style.display !== 'none', 'शुरू में नाम-मोडल खुला');
    doc.getElementById('user-name-input').value = 'राहुल';
    doc.getElementById('user-name-save').click();
    await new Promise(r => setTimeout(r, 100));
    ok(modal.style.display === 'none', 'नाम save के बाद मोडल बंद');
    ok(w.localStorage.getItem('gg-current-user') === 'राहुल', 'नाम persist (रिविज़िट तक)');
    ok(doc.getElementById('side-user-name').textContent.includes('राहुल'), 'sidebar में नाम');
    ok(doc.getElementById('hero-greet').textContent.includes('राहुल'), 'hero greeting personalized');

    // चैलेंज
    w.startChallenge();
    await new Promise(r => setTimeout(r, 100));
    const stage = doc.getElementById('ch-stage');
    ok(stage.innerHTML.includes('ch-strip-grid'), 'चैलेंज strip render');
    ok(stage.querySelectorAll('.ch-cell').length === 90, '90 day-cells');
    w.chCompleteDay(1);
    await new Promise(r => setTimeout(r, 100));
    ok(stage.querySelector('.ch-cell.done'), 'दिन 1 done mark hua');
    ok(w.eval('state.challenge.done["1"]') === true, 'state saved दिन 1');
    ok(doc.getElementById('hero-ch-ring').innerHTML.includes('ring-core'), 'dashboard ring updated');

    // सेक्शन नेविगेशन — हर सेक्शन खोलते हुए render error न आए
    // (research सेक्शन अलग है — iframe lazy-load; नीचे अलग से जाँच)
    const sections = ['learn','formulas','calculation','fast-tricks','daily','quiz','pyq','pyq-analysis','flashcards','notes','patterns','traps','mastery','error-log','revision','timer','pdf-research','exams','plan','profile'];
    for (const s of sections) { w.openSection(s); }
    ok(doc.querySelector('.section.active'), 'सेक्शन्स खुलते हैं');
    ok(doc.getElementById('achievements-list').innerHTML.includes('उपलब्धियाँ'), 'प्रोफाइल achievements render');

    // नए merged हिस्से: PYQ एनालिसिस + research bridge
    ok(w.eval('typeof PYQ_ANALYSIS !== "undefined" && PYQ_ANALYSIS.totals.questions') === 10124, 'PYQ_ANALYSIS: 10,124 प्रश्न (script scope)');
    ok(doc.querySelectorAll('#pa-topics .pa-topic-card').length >= 20, 'PYQ एनालिसिस: टॉपिक कार्ड render');
    w.eval("openPaTopic('बीजगणित')");
    ok(doc.querySelectorAll('.pa-pat-chip').length > 3, 'PYQ एनालिसिस: कॉन्सेप्ट chips');
    ok(doc.querySelectorAll('#pa-qlist .pa-q').length > 0, 'PYQ एनालिसिस: प्रश्न कार्ड');
    w.eval("selectPaPattern('सर्वसमिका')");
    ok(/सर्वसमिका/.test(doc.getElementById('pa-qcount').textContent), 'PYQ एनालिसिस: कॉन्सेप्ट फिल्टर');
    ok(doc.getElementById('learn-research-bridge').innerHTML.includes('lr-topic'), 'Learn सेक्शन: research bridge render');
    ok(doc.getElementById('challenge-research-bridge') !== null, 'Challenge सेक्शन: research bridge मौजूद');
    ok(doc.querySelectorAll('#rs-tabbar .rs-tab').length >= 14, 'research sub-tabs render');
    ok(doc.getElementById('rs-frame') !== null, 'research iframe मौजूद (lazy-load)');
    ok(typeof w.openResearchPage === 'function', 'openResearchPage global (onclick-ready)');

    // मास्टरी मार्ग (Learn का नया रूप) + चैलेंज exact-data
    w.openSection('learn');
    ok(w.eval('typeof MASTERY_DATA !== "undefined" && MASTERY_DATA.totals.concepts') === 295, 'MASTERY_DATA: 295 concepts (script scope)');
    ok(doc.querySelectorAll('#mastery-topics .m-topic').length === 35, 'मास्टरी मार्ग: 35 topic cards');
    w.eval("openMasteryTopic('number-system')");
    ok(doc.querySelectorAll('#mastery-detail .m-concept').length >= 4, 'मास्टरी मार्ग: concept cards');
    ok(doc.querySelectorAll('#mastery-detail .m-tag').length >= 10, 'मास्टरी मार्ग: concept-tag chips');
    ok(doc.getElementById('mastery-hero').textContent.includes('295'), 'मास्टरी hero: 295 concepts');
    const cid = w.eval('MASTERY_DATA.topics[0].sub_topics[0].concepts[0].id');
    w.eval(`setConceptStage('${cid}', 3)`);
    ok(w.eval(`conceptStage('${cid}')`) === 3, 'concept mastery tracker सेव');
    w.eval('startChallenge()');
    ok(doc.getElementById('ch-stage').textContent.includes('exact concept-count'), 'चैलेंज: exact concept-count panel');
    ok(doc.querySelectorAll('.chm-chip').length >= 1, 'चैलेंज: topic chips (concepts + records)');
    ok(doc.querySelectorAll('.chwm').length === 13, 'चैलेंज: 13 सप्ताह exact analysis');

    // कैलकुलेशन: scorecard + drills + workout
    w.openSection('calculation');
    ok(doc.getElementById('calc-scorecard').innerHTML.includes('calc-stat'), 'calc scorecard render');
    ok(doc.querySelectorAll('#drill-select .drill-btn').length === 16, '16 drill buttons');
    w.startDrill('squares');
    ok(doc.getElementById('drill-play').style.display !== 'none', 'drill play खुला');
    ok(doc.getElementById('drill-question').textContent.trim().length > 0, 'drill सवाल सेट');
    doc.getElementById('drill-check').click();
    w.endDrill();
    ok(doc.getElementById('drill-result').style.display !== 'none', 'drill result दिखा');
    ok(w.eval('state.drillHistory.length') >= 1, 'drill history सेव हुई');
    w.startCalcWorkout();
    ok(doc.getElementById('calc-workout-play').style.display !== 'none', 'workout play खुला');
    ok(doc.getElementById('wo-question').textContent.trim().length > 0, 'workout सवाल सेट');

    ok(w.eval('CHALLENGE_90.length') === 90, 'script scope mein CHALLENGE_90 = 90');
    w.logoutUser(); // confirm=true stub; location.reload jsdom में no-op
    await new Promise(r => setTimeout(r, 50));
    ok(w.localStorage.getItem('gg-current-user') === null, 'लॉगआउट पर सत्र-नाम हटा (गुमनाम भूल गया — लेकिन state सुरक्षित)');
    ok(w.localStorage.getItem('gg-state-राहुल') !== null, 'लॉगआउट के बाद भी progress संरक्षित');

    const realErrs = errs.filter(e => !/localStorage|quota/i.test(e));
    ok(realErrs.length === 0, 'कोई runtime error नहीं' + (realErrs.length ? ' — ' + realErrs[0].slice(0, 300) : ''));
    if (realErrs.length) realErrs.slice(0, 6).forEach(e => console.log('   ⤷ ' + e.slice(0, 400)));

    dom.window.close();
    if (fails) { console.error('RESULT: FAIL (' + fails + ')'); process.exit(1); }
    console.log('RESULT: DOM-BOOT-OK');
})().catch(e => { console.error('RESULT: FAIL', e); process.exit(1); });
