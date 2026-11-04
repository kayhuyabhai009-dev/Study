/* ============================================================
   गणित गुरु — mastery.js — "मास्टरी मार्ग" (Learn सेक्शन का नया रूप)

   Research platform की पूरी hierarchy (35 topics → 154 sub-topics
   → 295 concepts) को सिखाने-योग्य मास्टरी पाथ में बदलता है:
   • हर topic: records/certain, exam-split, आपके बैंक के प्रश्न, shortcut patterns
   • हर sub-topic: concept-tags (किस concept से कितने प्रश्न + कठिनाई), प्रश्न-प्रकार,
     PYQ shortcut labels, exams
   • हर concept: prerequisites → definition → आसान हिंदी समझ → formulas →
     exam mapping → अभ्यास लिंक → 3-स्तरीय mastery tracker (समझा/अभ्यास/पक्का)
   • चैलेंज के हर दिन में exact records/concepts का panel (chMasteryHtml)
   ============================================================ */

/* ---------------- indexes + state ---------------- */
const MASTERY_TOPICS = (typeof MASTERY_DATA !== 'undefined') ? MASTERY_DATA.topics : [];
const MASTERY_BY_SLUG = {};
MASTERY_TOPICS.forEach(t => { MASTERY_BY_SLUG[t.slug] = t; });

let masteryFilter = { q: '', f: 'all' };
let masteryOpenTopic = null;

function conceptsOf(topic) {
    let n = 0;
    topic.sub_topics.forEach(s => { n += s.concepts.length; });
    return n;
}
function topicDiffCounts(topic) {
    const d = { basic: 0, intermediate: 0, advanced: 0 };
    topic.sub_topics.forEach(s => s.concepts.forEach(c => { if (d[c.diff] !== undefined) d[c.diff]++; }));
    return d;
}

/* ---------------- concept mastery tracker (per-user state) ---------------- */
function conceptStage(id) {
    return (state.concepts && state.concepts[id]) || 0;
}
function setConceptStage(id, stage) {
    if (!state.concepts) state.concepts = {};
    if (conceptStage(id) === stage) delete state.concepts[id];
    else state.concepts[id] = stage;
    saveState();
    addXP(stage === 3 ? 8 : 4);
    renderMasteryHero();
    renderMasteryTopics();
    if (masteryOpenTopic) renderMasteryDetail(MASTERY_BY_SLUG[masteryOpenTopic]);
}
function topicMasteryPct(topic) {
    const total = conceptsOf(topic);
    if (!total) return 0;
    let done = 0;
    topic.sub_topics.forEach(s => s.concepts.forEach(c => { if (conceptStage(c.id) >= 2) done++; }));
    return Math.round(done / total * 100);
}
function masteryStats() {
    let total = 0, learned = 0, practiced = 0, mastered = 0;
    MASTERY_TOPICS.forEach(t => t.sub_topics.forEach(s => s.concepts.forEach(c => {
        total++;
        const st = conceptStage(c.id);
        if (st >= 1) learned++;
        if (st >= 2) practiced++;
        if (st >= 3) mastered++;
    })));
    return { total, learned, practiced, mastered, pct: total ? Math.round(practiced / total * 100) : 0 };
}

/* अगला concept जो पक्का करना है (syllabus order में पहला अधूरा) */
function nextConceptToMaster() {
    for (const t of MASTERY_TOPICS) {
        for (const s of t.sub_topics) {
            for (const c of s.concepts) {
                const st = conceptStage(c.id);
                if (st < 3) return { topic: t, sub: s, concept: c, stage: st };
            }
        }
    }
    return null;
}

/* ---------------- hero (progress overview) ---------------- */
function renderMasteryHero() {
    const el = document.getElementById('mastery-hero');
    if (!el || !MASTERY_TOPICS.length) return;
    const st = masteryStats();
    const totals = MASTERY_DATA.totals;
    const next = nextConceptToMaster();
    const nextHtml = next ? `
        <div class="mh-next">
            <div class="mh-next-label">${next.stage === 0 ? '👁️ अगला — समझें' : (next.stage === 1 ? '✍️ अगला — अभ्यास करें' : '🏆 अगला — पक्का करें')}</div>
            <div class="mh-next-name">${esc(next.concept.name)}</div>
            <div class="mh-next-path muted">${esc(next.topic.name)} → ${esc(next.sub.name)}</div>
            <button class="mh-next-btn" onclick="openMasteryTopic('${next.topic.slug}')">खोलें →</button>
        </div>` : '<div class="mh-next win"><div class="mh-next-label">🏆 शानदार!</div><div class="mh-next-name">सभी 295 concepts पक्के!</div></div>';
    el.innerHTML = `
        <div class="mh-ring" style="background:conic-gradient(var(--primary) ${st.pct}%, var(--track) ${st.pct}%);">
            <div class="ring-core"><b>${st.pct}%</b><span>मास्टरी</span></div>
        </div>
        <div class="mh-stats">
            <div class="mh-stat"><b>${totals.topics}</b><span>Topics</span></div>
            <div class="mh-stat"><b>${totals.subTopics}</b><span>Sub-topics</span></div>
            <div class="mh-stat hot"><b>${totals.concepts}</b><span>Concepts</span></div>
            <div class="mh-stat"><b>${totals.formulas}</b><span>Formulas</span></div>
            <div class="mh-stat"><b>${(totals.records / 1000).toFixed(1)}K</b><span>टैग्ड रिकॉर्ड</span></div>
        </div>
        ${nextHtml}
        <div class="mh-mine">
            <h4>आपकी प्रगति</h4>
            <div class="mh-mine-row"><span>👁️ समझे</span><b>${st.learned}/${st.total}</b></div>
            <div class="mh-mine-row"><span>✍️ अभ्यास किए</span><b>${st.practiced}/${st.total}</b></div>
            <div class="mh-mine-row win"><span>🏆 पक्के (mastered)</span><b>${st.mastered}/${st.total}</b></div>
            <div class="mh-bar"><span style="width:${st.pct}%"></span></div>
            <button class="mh-reset" onclick="resetConceptMastery()">🔄 mastery रीसेट</button>
        </div>`;
}

function resetConceptMastery() {
    if (!confirm('सभी concepts की mastery प्रगति हटा दी जाए? (यह सिर्फ concept-tracker है, बाकी progress सुरक्षित)')) return;
    state.concepts = {};
    saveState();
    renderMasteryHero();
    renderMasteryTopics();
    if (masteryOpenTopic) renderMasteryDetail(MASTERY_BY_SLUG[masteryOpenTopic]);
}

/* ---------------- topic grid ---------------- */
const DIFF_HI = { basic: '🌱 बेसिक', intermediate: '💪 मध्यम', advanced: '🔥 एडवांस्ड' };

function masteryTopicsFiltered() {
    const q = masteryFilter.q;
    let list = MASTERY_TOPICS.filter(t => {
        if (masteryFilter.f === 'basic' || masteryFilter.f === 'intermediate' || masteryFilter.f === 'advanced') {
            const d = topicDiffCounts(t);
            const f = masteryFilter.f;
            if (!(d[f] > 0 && d[f] >= d.basic && d[f] >= d.intermediate && d[f] >= d.advanced)) return false;
        }
        if (masteryFilter.f === 'todo' && topicMasteryPct(t) >= 100) return false;
        if (!q) return true;
        const hay = (t.name + ' ' + t.slug + ' ' + t.sub_topics.map(s => s.name + ' ' + s.concepts.map(c => c.name).join(' ')).join(' ')).toLowerCase();
        return hay.includes(q);
    });
    if (masteryFilter.f === 'top') list = list.slice().sort((a, b) => b.certain - a.certain);
    return list;
}

function renderMasteryTopics() {
    const grid = document.getElementById('mastery-topics');
    if (!grid) return;
    const list = masteryTopicsFiltered();
    if (!list.length) {
        grid.innerHTML = '<div class="no-data">कोई topic नहीं मिला — फिल्टर या खोज बदलकर देखें</div>';
        return;
    }
    grid.innerHTML = list.map(t => {
        const pct = topicMasteryPct(t);
        const d = topicDiffCounts(t);
        const examChips = Object.entries(t.exams).sort((a, b) => b[1] - a[1]).slice(0, 3)
            .map(([e, c]) => `<span class="m-exam">${e} ${c}</span>`).join('');
        return `
        <div class="m-topic ${masteryOpenTopic === t.slug ? 'open' : ''}" onclick="openMasteryTopic('${t.slug}')" role="button" tabindex="0">
            <div class="m-topic-top">
                <b>${esc(t.name)}</b>
                <span class="m-topic-pct ${pct === 100 ? 'full' : ''}">${pct}%</span>
            </div>
            <div class="m-topic-meta">${conceptsOf(t)} concepts · ${t.sub_topics.length} sub-topics · <b>${t.certain.toLocaleString('en-IN')}</b> certain रिकॉर्ड</div>
            <div class="m-topic-diffs">
                <span class="m-diff b">${d.basic}</span><span class="m-diff i">${d.intermediate}</span><span class="m-diff a">${d.advanced}</span>
                ${t.mainPyq ? `<span class="m-diff pyq">🗂️ ${t.mainPyq} आपके बैंक में</span>` : ''}
            </div>
            <div class="m-topic-bar"><span style="width:${pct}%"></span></div>
            <div class="m-topic-exams">${examChips || '<span class="muted small">corpus में रिकॉर्ड नहीं</span>'}</div>
        </div>`;
    }).join('');
}

/* ---------------- topic detail ---------------- */
function openMasteryTopic(slug) {
    const t = MASTERY_BY_SLUG[slug];
    if (!t) return;
    masteryOpenTopic = slug;
    renderMasteryTopics();
    renderMasteryDetail(t);
    const el = document.getElementById('mastery-detail');
    if (el && typeof el.scrollIntoView === 'function') el.scrollIntoView({ block: 'start', behavior: 'smooth' });
}

function mainTopicNameFor(slug) {
    if (typeof PYQ_ANALYSIS === 'undefined') return null;
    const t = PYQ_ANALYSIS.topics.find(x => x.slug === slug);
    return t ? t.name : null;
}

function renderMasteryDetail(t) {
    const el = document.getElementById('mastery-detail');
    if (!el) return;
    el.style.display = 'block';
    const pct = topicMasteryPct(t);
    const examRows = Object.entries(t.exams).sort((a, b) => b[1] - a[1]);
    const mainName = mainTopicNameFor(t.slug);

    const subsHtml = t.sub_topics.map((s, si) => {
        const tagsHtml = s.tags.length ? s.tags.slice(0, 12).map(tg => {
            const [e, m, h, u] = tg.d;
            const tot = e + m + h + u;
            const hardPct = tot ? Math.round((h / tot) * 100) : 0;
            return `<button class="m-tag" title="आसान ${e} · मध्यम ${m} · कठिन ${h} · uncertain ${u}">
                <span>${esc(tg.t)}</span><b>${tg.c}</b>
                <i style="width:${hardPct}%"></i>
            </button>`;
        }).join('') : '<span class="muted small">इस sub-topic के लिए corpus में टैग्ड रिकॉर्ड नहीं हैं।</span>';

        const typeChips = Object.entries(s.types).sort((a, b) => b[1] - a[1]).slice(0, 5)
            .map(([ty, c]) => `<span class="m-mini">${esc(ty)} ${c}</span>`).join('');
        const trickChips = s.tricks.length
            ? s.tricks.map(tr => `<span class="m-trick">⚡ ${esc(tr.label)} <b>${tr.c}</b></span>`).join('')
            : '';
        const examMini = Object.entries(s.exams).sort((a, b) => b[1] - a[1]).slice(0, 4)
            .map(([ex, c]) => `<span class="m-mini">${ex} ${c}</span>`).join('');

        const conceptsHtml = s.concepts.map(c => conceptCardHtml(t, s, c)).join('');

        return `
        <details class="m-sub" ${si === 0 ? 'open' : ''}>
            <summary>
                <span class="m-sub-name">${esc(s.name)}</span>
                <span class="m-sub-meta">${s.concepts.length} concepts · ${s.certain} certain${s.total ? ' · ' + s.total + ' रिकॉर्ड' : ''}</span>
            </summary>
            <div class="m-sub-body">
                <div class="m-sub-block">
                    <h5>🔖 इस sub-topic के concept-tags — किस concept से कितने प्रश्न</h5>
                    <div class="m-tags">${tagsHtml}</div>
                    ${typeChips ? `<div class="m-mini-row">प्रश्न-प्रकार: ${typeChips}</div>` : ''}
                    ${examMini ? `<div class="m-mini-row">परीक्षाएँ: ${examMini}</div>` : ''}
                    ${trickChips ? `<div class="m-trick-row"><b>⚡ PYQ shortcut labels:</b> ${trickChips}</div>` : ''}
                </div>
                <div class="m-sub-block">
                    <h5>📖 Concepts — समझ से पक्का तक</h5>
                    ${conceptsHtml}
                </div>
            </div>
        </details>`;
    }).join('');

    const patternHtml = t.patterns.length ? `
        <div class="m-patterns">
            <h4>⚡ शॉर्टकट पैटर्न — इस topic के लिए</h4>
            ${t.patterns.map(p => `
                <details class="m-pat"><summary>⚡ ${esc(p.name)}</summary>
                    <div class="m-pat-body">
                        <p><b>संकेत (signal):</b> ${esc(p.signal)}</p>
                        <p><b>विचार:</b> ${esc(p.concept)}</p>
                        <p><b>शॉर्टकट:</b> ${esc(p.shortcut)}</p>
                        ${p.variants && p.variants.length ? `<p><b>रूप:</b> ${p.variants.map(esc).join(' · ')}</p>` : ''}
                        ${p.traps && p.traps.length ? `<p class="m-pat-trap"><b>⚠️ ट्रैप:</b> ${p.traps.map(esc).join(' · ')}</p>` : ''}
                    </div>
                </details>`).join('')}
        </div>` : '';

    el.innerHTML = `
        <div class="card m-detail">
            <div class="m-detail-head">
                <div>
                    <div class="m-detail-eyebrow">मास्टरी मार्ग · ${MASTERY_TOPICS.indexOf(t) + 1}/35</div>
                    <h3>${esc(t.name)}</h3>
                    <p class="muted">${conceptsOf(t)} concepts · ${t.sub_topics.length} sub-topics · <b>${t.certain.toLocaleString('en-IN')}</b> certain रिकॉर्ड (${t.total.toLocaleString('en-IN')} कुल) · आपकी mastery <b>${pct}%</b></p>
                </div>
                <div class="m-detail-actions">
                    ${mainName ? `<button class="btn btn-primary" onclick="openPaTopic('${esc(mainName)}');openSection('pyq-analysis')">📊 मेरे ${t.mainPyq} प्रश्न</button>` : ''}
                    <button class="btn btn-primary" onclick="openResearchPage('important.html?topic=${t.slug}')">🔬 रिसर्च (${t.certain.toLocaleString('en-IN')})</button>
                    <button class="btn btn-primary" onclick="openResearchPage('learn.html?chapter=${encodeURIComponent(t.name)}')">🎓 रिसर्च लर्न</button>
                    ${t.formulaChapter ? `<button class="btn" style="border:1px solid var(--border-light);" onclick="openChapter('${t.formulaChapter}')">📖 फॉर्मूला बुक</button>` : ''}
                </div>
            </div>
            <div class="m-detail-stats">
                <div class="mds"><b>${conceptsOf(t)}</b><span>concepts</span></div>
                <div class="mds"><b>${t.certain.toLocaleString('en-IN')}</b><span>certain रिकॉर्ड</span></div>
                <div class="mds"><b>${t.mainPyq}</b><span>आपके बैंक में</span></div>
                <div class="mds"><b>${t.patterns.length}</b><span>shortcut पैटर्न</span></div>
                <div class="mds exam-col">${examRows.slice(0, 5).map(([e, c]) => `<span>${e} <b>${c}</b></span>`).join('') || '<span class="muted">—</span>'}</div>
            </div>
            <div class="m-subs">${subsHtml}</div>
            ${patternHtml}
            <div class="m-detail-foot">
                <button class="btn" style="border:1px solid var(--border-light);" onclick="masteryOpenTopic=null;renderMasteryTopics();document.getElementById('mastery-detail').style.display='none';">⬅ सभी topics पर वापस</button>
            </div>
        </div>`;
}

/* ---------------- concept card ---------------- */
function conceptCardHtml(topic, sub, c) {
    const stage = conceptStage(c.id);
    const pre = c.pre && c.pre.length ? c.pre.map(esc).join(' → ') : 'कोई नहीं — यहीं से शुरू करें';
    const formulas = c.formulas && c.formulas.length
        ? c.formulas.map(f => `<span class="m-formula">${esc(f)}</span>`).join('')
        : '<span class="muted small">इस concept के लिए अलग formula नहीं — समझ पर ध्यान दें।</span>';
    const mainName = mainTopicNameFor(topic.slug);
    return `
    <div class="m-concept st-${stage}">
        <div class="m-concept-head">
            <div class="m-concept-title">
                <span class="m-concept-id">${esc(c.id)}</span>
                <b>${esc(c.name)}</b>
                <span class="m-diff-badge ${c.diff}">${DIFF_HI[c.diff] || esc(c.diff)}</span>
            </div>
            <div class="m-stage-btns" title="mastery चिह्नित करें">
                <button class="m-stage ${stage >= 1 ? 'on' : ''}" onclick="setConceptStage('${c.id}',1)" title="समझ लिया">👁️</button>
                <button class="m-stage ${stage >= 2 ? 'on' : ''}" onclick="setConceptStage('${c.id}',2)" title="अभ्यास किया">✍️</button>
                <button class="m-stage ${stage >= 3 ? 'on' : ''}" onclick="setConceptStage('${c.id}',3)" title="पक्का (mastered)">🏆</button>
            </div>
        </div>
        <div class="m-steps">
            <div class="m-step"><span class="m-step-n">1</span><div><b>पहले यह जानिए (prerequisites)</b><p>${pre}</p></div></div>
            <div class="m-step"><span class="m-step-n">2</span><div><b>यह क्या है (definition)</b><p>${esc(c.def)}</p></div></div>
            <div class="m-step hi"><span class="m-step-n">3</span><div><b>आसान हिंदी में</b><p>${esc(c.hi)}</p></div></div>
            <div class="m-step"><span class="m-step-n">4</span><div><b>फॉर्मूले (fast tools)</b><div class="m-formulas">${formulas}</div></div></div>
            <div class="m-step"><span class="m-step-n">5</span><div><b>कहाँ आता है (exam mapping)</b><p>${esc(c.examMap)}</p></div></div>
        </div>
        <div class="m-concept-foot">
            ${sub.tags.length ? `<span class="m-cf">🔖 इस topic से <b>${sub.tags.length}</b> concept-tags में प्रश्न</span>` : ''}
            ${mainName ? `<button class="m-cf-btn" onclick="openPaTopic('${esc(mainName)}');openSection('pyq-analysis')">📊 मेरे प्रश्न</button>` : ''}
            <button class="m-cf-btn" onclick="openResearchPage('important.html?topic=${topic.slug}')">🔬 रिसर्च प्रश्न</button>
            <button class="m-cf-btn" onclick="openSection('fast-tricks')">⚡ फास्ट ट्रिक्स</button>
            <button class="m-cf-btn" onclick="openSection('patterns')">🧠 पैटर्न</button>
        </div>
    </div>`;
}

/* ---------------- challenge day enrichment ---------------- */
function chMasteryHtml(day) {
    if (typeof CHALLENGE_MASTERY === 'undefined') return '';
    const d = CHALLENGE_MASTERY.days.find(x => x.d === day.d);
    if (!d || !d.topics.length) return '';
    const isLearn = day.type === 'learn';
    const chips = d.topics.map(t => `
        <button class="chm-chip" onclick="openMasteryTopic('${t.slug}');openSection('learn')" title="${t.concepts} concepts · ${t.subs} sub-topics · ${t.mainPyq} आपके बैंक में">
            <b>${esc(t.name)}</b>
            <span>${t.concepts} concepts · ${t.certain.toLocaleString('en-IN')} रिकॉर्ड${t.mainPyq ? ' · 🗂️ ' + t.mainPyq : ''}</span>
        </button>`).join('');
    return `
    <div class="ch-mastery">
        <div class="chm-head">
            <b>${isLearn ? '📊 आज के topics — exact concept-count' : '📊 इस दिन के topics — exact concept-count'}</b>
            <button class="chm-btn" onclick="openMasteryTopic('${d.topics[0].slug}');openSection('learn')">📚 concepts खोलें</button>
        </div>
        <div class="chm-chips">${chips}</div>
        <div class="chm-note muted">किसी topic पर टैप करें → मास्टरी मार्ग में उसके सारे concepts (समझ + formulas + प्रश्न-गणना) खुल जाएँगे।</div>
    </div>`;
}

function chWeekMasteryHtml(wkNo) {
    if (typeof CHALLENGE_MASTERY === 'undefined') return '';
    const w = CHALLENGE_MASTERY.weeks.find(x => x.wk === wkNo);
    if (!w || !w.topics.length) return '';
    return `<div class="chwm"><b>📊 सप्ताह ${wkNo} का exact विश्लेषण:</b> ${w.topics.length} topics · <b>${w.concepts}</b> concepts · <b>${w.records.toLocaleString('en-IN')}</b> certain रिकॉर्ड · ${w.learnDays} सीखने के दिन</div>`;
}

/* ---------------- init ---------------- */
/* renderLearn(filter) से आता है — filter को mastery search में लगाता है */
function renderMasteryPath(filter) {
    if (!MASTERY_TOPICS.length) return;
    const q = (filter || '').trim().toLowerCase();
    if (q !== masteryFilter.q) {
        masteryFilter.q = q;
        const input = document.getElementById('mastery-search');
        if (input && input.value !== (filter || '')) input.value = filter || '';
    }
    renderMasteryHero();
    renderMasteryTopics();
}

function initMastery() {
    if (!MASTERY_TOPICS.length) return;
    renderMasteryHero();
    renderMasteryTopics();
    const search = document.getElementById('mastery-search');
    if (search) search.addEventListener('input', () => {
        masteryFilter.q = search.value.trim().toLowerCase();
        renderMasteryTopics();
    });
    document.querySelectorAll('#mastery-chips .m-chip').forEach(b =>
        b.addEventListener('click', () => {
            document.querySelectorAll('#mastery-chips .m-chip').forEach(x => x.classList.toggle('on', x === b));
            masteryFilter.f = b.getAttribute('data-f');
            renderMasteryTopics();
        }));
}
