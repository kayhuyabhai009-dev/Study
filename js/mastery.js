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
let learnTab = 'days';          // 'days' (Day 1-60) | 'topics' (सभी टॉपिक)
let learnOpenDay = null;        // days-view में खुला दिन

/* ---------- FULL PYQ meta helpers (concept→PYQ linking) ---------- */
function pyqMetaChaptersBySlug() {
    const m = {};
    if (typeof PYQ_FULL_META === 'undefined' || !PYQ_FULL_META.chapters) return m;
    PYQ_FULL_META.chapters.forEach(c => {
        if (!m[c.slug]) m[c.slug] = { name: c.name, total: 0, subLabels: {}, subs: c.subs };
        m[c.slug].total += c.total;
        c.subs.forEach(sb => sb.concepts.forEach(cc => {
            m[c.slug].subLabels[cc[0]] = (m[c.slug].subLabels[cc[0]] || 0) + cc[1];
        }));
    });
    return m;
}
/* topic slug → { name, total } of PYQ chapter (data ready या न हो तो null) */
function pyqMetaForSlug(slug) {
    const all = pyqMetaChaptersBySlug();
    return all[slug] || null;
}
/* sub-topic (mastery sub name) के लिए सबसे मज़बूत PYQ concept-label */
function bestConceptLabelForSub(slug, subName) {
    const m = pyqMetaForSlug(slug);
    if (!m) return { label: subName.replace(/-/g, ' '), count: 0 };
    const sub = (m.subs || []).find(x => x.sub === subName);
    if (sub && sub.concepts.length) {
        const sorted = sub.concepts.slice().sort((a, b) => b[1] - a[1]);
        const best = sorted.find(c => c[0] !== 'सामान्य') || sorted[0];
        return { label: best[0], count: best[1] };
    }
    return { label: subName.replace(/-/g, ' '), count: 0 };
}
function pyqChapterCount(slug) {
    const m = pyqMetaForSlug(slug);
    return m ? m.total : 0;
}

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
                ${pyqChapterCount(t.slug) ? `<span class="m-diff pyqfull" title="असली PYQ बैंक में (options+answers के साथ)">🗂️ ${pyqChapterCount(t.slug).toLocaleString('en-IN')} PYQ</span>` : ''}
                ${t.mainPyq && !pyqChapterCount(t.slug) ? `<span class="m-diff pyq">🗂️ ${t.mainPyq} आपके बैंक में</span>` : ''}
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
    learnOpenDay = null;
    // topic पेज खुला हो तो topics list दिखे (context के लिए)
    setLearnTab('topics');
    renderMasteryDetail(t);
    const el = document.getElementById('mastery-detail');
    if (el && typeof el.scrollIntoView === 'function') el.scrollIntoView({ block: 'start', behavior: 'smooth' });
}

function closeMasteryDetail() {
    masteryOpenTopic = null;
    learnOpenDay = null;
    const el = document.getElementById('mastery-detail');
    if (el) el.style.display = 'none';
    renderLearnDays();
    renderMasteryTopics();
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
        const chMeta = pyqMetaForSlug(t.slug);
        const tagsHtml = s.tags.length ? s.tags.slice(0, 12).map(tg => {
            const [e, m, h, u] = tg.d;
            const tot = e + m + h + u;
            const hardPct = tot ? Math.round((h / tot) * 100) : 0;
            const pyqC = chMeta ? (chMeta.subLabels[tg.t] || 0) : 0;
            return `<button class="m-tag" title="आसान ${e} · मध्यम ${m} · कठिन ${h} · uncertain ${u}${pyqC ? ' · 🗂️ ' + pyqC + ' PYQ — क्लिक करके खोलें' : ''}" ${chMeta ? `onclick="event.stopPropagation();openPyqConcept('${esc(chMeta.name).replace(/'/g, "\'")}','${esc(tg.t).replace(/'/g, "\'")}')"` : ''}>
                <span>${esc(tg.t)}</span><b>${tg.c}</b>${pyqC ? `<em class="m-tag-pyq">🗂️${pyqC}</em>` : ''}
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
                <span class="m-sub-meta">${s.concepts.length} concepts · ${s.certain} certain${s.total ? ' · ' + s.total + ' रिकॉर्ड' : ''}
                    ${(() => { const bl = bestConceptLabelForSub(t.slug, s.name); const cm = pyqMetaForSlug(t.slug); return cm && bl.count ? `<button class="m-sub-pyq" onclick="event.stopPropagation();openPyqConcept('${esc(cm.name).replace(/'/g, "\'")}','${esc(bl.label).replace(/'/g, "\'")}')" title="${esc(bl.label)} के असली PYQ">🗂️ ${bl.count} PYQ</button>` : ''; })()}
                </span>
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
                    ${(() => { const cm = pyqMetaForSlug(t.slug); return cm ? `<button class="btn btn-hot" onclick="openPyqTopic('${esc(cm.name).replace(/'/g, "\'")}')">🗂️ इस topic के सभी PYQ (${cm.total.toLocaleString('en-IN')})</button>` : ''; })()}
                    ${mainName ? `<button class="btn btn-primary" onclick="openPaTopic('${esc(mainName)}');openSection('pyq-analysis')">📊 विश्लेषण (${t.mainPyq})</button>` : ''}
                    <button class="btn btn-primary" onclick="openResearchPage('important.html?topic=${t.slug}')">🔬 रिसर्च (${t.certain.toLocaleString('en-IN')})</button>
                    <button class="btn btn-primary" onclick="openResearchPage('learn.html?chapter=${encodeURIComponent(t.name)}')">🎓 रिसर्च लर्न</button>
                    ${t.formulaChapter ? `<button class="btn" style="border:1px solid var(--border-light);" onclick="openChapter('${t.formulaChapter}')">📖 फॉर्मूला बुक</button>` : ''}
                </div>
            </div>
            <div class="m-detail-stats">
                <div class="mds"><b>${conceptsOf(t)}</b><span>concepts</span></div>
                <div class="mds"><b>${t.certain.toLocaleString('en-IN')}</b><span>certain रिकॉर्ड</span></div>
                <div class="mds">${pyqChapterCount(t.slug) ? `<b>${pyqChapterCount(t.slug).toLocaleString('en-IN')}</b><span>असली PYQ</span>` : `<b>${t.mainPyq}</b><span>आपके बैंक में</span>`}</div>
                <div class="mds"><b>${t.patterns.length}</b><span>shortcut पैटर्न</span></div>
                <div class="mds exam-col">${examRows.slice(0, 5).map(([e, c]) => `<span>${e} <b>${c}</b></span>`).join('') || '<span class="muted">—</span>'}</div>
            </div>
            <div class="m-subs">${subsHtml}</div>
            ${patternHtml}
            <div class="m-detail-foot">
                <button class="btn" style="border:1px solid var(--border-light);" onclick="closeMasteryDetail()">⬅ वापस (सूची पर)</button>
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
        ${(() => {
            const cm = pyqMetaForSlug(topic.slug);
            const bl = bestConceptLabelForSub(topic.slug, sub.name);
            if (!cm) return '';
            const cnt = bl.count || 0;
            return `<div class="m-concept-pyq">
                <button class="m-cf-pyq" onclick="openPyqConcept('${esc(cm.name).replace(/'/g, "\'")}','${esc(bl.label).replace(/'/g, "\'")}')">🗂️ इस concept के PYQ${cnt ? ' (' + cnt + ')' : ''}</button>
                <span class="muted small">— ${esc(cm.name)} → ${esc(bl.label)} (exam • date • shift सहित खुलेंगे)</span>
            </div>`;
        })()}
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


/* ================= Day 1–60 लर्न व्यू ================= */
function ch60Days() {
    return (typeof CHALLENGE_60 !== 'undefined') ? CHALLENGE_60 : [];
}
function chMasteryDay(d) {
    if (typeof CHALLENGE_MASTERY === 'undefined') return null;
    return CHALLENGE_MASTERY.days.find(x => x.d === d) || null;
}
const DAY_TYPE_META = {
    learn: { icon: '📚', label: 'सीखने का दिन' },
    revise: { icon: '🔄', label: 'रिवीज़न डे' },
    test: { icon: '📝', label: 'टेस्ट डे' },
    mock: { icon: '🏆', label: 'ग्रैंड मॉक' }
};

function renderLearnDays() {
    const wrap = document.getElementById('learn-days');
    if (!wrap) return;
    if (learnTab !== 'days' || masteryOpenTopic) { wrap.innerHTML = ''; return; }
    const days = ch60Days();
    if (!days.length) { wrap.innerHTML = '<div class="no-data">60-दिन डेटा लोड नहीं हुआ — page refresh करें।</div>'; return; }
    const cd = (typeof state !== 'undefined' && state.challenge && state.challenge.start && typeof challengeCurrentDay === 'function') ? challengeCurrentDay() : null;

    let html = '';
    for (let w = 1; w <= 9; w++) {
        const weekDays = days.filter(x => x.wk === w);
        if (!weekDays.length) continue;
        const isFinale = w === 9;
        const wDone = cd ? weekDays.filter(x => state.challenge.done[x.d]).length : 0;
        html += `<div class="ld-week card">
            <div class="ld-week-head">
                <b>${isFinale ? '👑 सप्ताह 9 — फाइनल मोड' : '🗓️ सप्ताह ' + w}</b>
                <span class="muted">${isFinale ? 'महा-रिवीज़न + ग्रैंड मॉक्स' : esc((weekDays[0].sub.split('•').pop() || '').trim())}${cd ? ' · ✅ ' + wDone + '/' + weekDays.length : ''}</span>
            </div>
            <div class="ld-grid">` + weekDays.map(dy => {
                const tm = DAY_TYPE_META[dy.type] || DAY_TYPE_META.learn;
                const md = chMasteryDay(dy.d);
                const chipNames = md && md.topics.length ? md.topics.map(t => t.name) : (dy.topics || []);
                const isDone = state.challenge.done[dy.d];
                const isToday = cd === dy.d;
                const cls = ['ld-day', 'lt-' + dy.type, isDone ? 'done' : '', isToday ? 'today' : '', (learnOpenDay === dy.d) ? 'open' : ''].filter(Boolean).join(' ');
                return `<button class="${cls}" onclick="openLearnDay(${dy.d})" title="${esc(dy.title)}">
                    <span class="ld-d">${isDone ? '✅' : 'दिन ' + dy.d}</span>
                    <span class="ld-icon">${tm.icon}</span>
                    <span class="ld-title">${esc(shortTitle(dy))}</span>
                    <span class="ld-chips">${chipNames.slice(0, 2).map(esc).join(' · ')}</span>
                </button>`;
            }).join('') + `</div>
        </div>`;
    }
    wrap.innerHTML = html;
}
function shortTitle(dy) {
    let t = dy.title.replace(/\s*—\s*/g, ' — ');
    return t.length > 46 ? t.slice(0, 45) + '…' : t;
}

function openLearnDay(d) {
    learnOpenDay = (learnOpenDay === d) ? null : d;
    masteryOpenTopic = null;
    renderLearnDays();
    const el = document.getElementById('mastery-detail');
    if (learnOpenDay === null) { if (el) el.style.display = 'none'; return; }
    const dy = ch60Days().find(x => x.d === learnOpenDay);
    if (!dy || !el) return;
    const tm = DAY_TYPE_META[dy.type] || DAY_TYPE_META.learn;
    const md = chMasteryDay(dy.d);
    const isDone = state.challenge.done[dy.d];

    const topicCards = (md && md.topics.length ? md.topics : []).map(tp => `
        <button class="ld-topic" onclick="openMasteryTopic('${tp.slug}')">
            <div><b>${esc(tp.name)}</b>
            <span class="muted">${tp.concepts} concepts · ${tp.subs} sub-topics · ${tp.certain.toLocaleString('en-IN')} रिकॉर्ड${pyqChapterCount(tp.slug) ? ' · 🗂️ ' + pyqChapterCount(tp.slug).toLocaleString('en-IN') + ' PYQ' : ''}</span></div>
            <span class="ld-topic-go">खोलें →</span>
        </button>`).join('');

    const taskRows = dy.tasks.map(t => `<div class="ld-task"><span>${t.i}</span> ${esc(t.t)}</div>`).join('');
    const revRows = (dy.rev || []).map(t => `<div class="ld-task rev"><span>${t.i}</span> ${esc(t.t)}</div>`).join('');
    const cd = (state.challenge && state.challenge.start && typeof challengeCurrentDay === 'function') ? challengeCurrentDay() : null;
    const dayDate = (state.challenge && state.challenge.start && typeof challengeDayDate === 'function') ? challengeDayDate(dy.d) : null;

    el.style.display = 'block';
    el.innerHTML = `
    <div class="card m-detail ld-detail">
        <div class="ld-bread">
            <button class="ld-back" onclick="closeMasteryDetail()">⬅ Day 1-60</button>
            <span class="muted">सप्ताह ${dy.wk} • ${tm.label}</span>
        </div>
        <div class="m-detail-head">
            <div>
                <div class="m-detail-eyebrow">दिन ${dy.d}/60 ${dayDate ? ' • 📅 ' + dayDate : ''} ${isDone ? ' • ✅ पूरा' : ''}${cd === dy.d ? ' • 🔥 आज' : ''}</div>
                <h3>${tm.icon} ${esc(dy.title)}</h3>
                <p class="muted">${esc(dy.sub)} • ⏱️ ${dy.mins} मिनट</p>
            </div>
            <div class="m-detail-actions">
                ${!isDone && state.challenge.start && cd && dy.d <= cd ? `<button class="btn btn-primary" onclick="chCompleteDay(${dy.d});openLearnDay(${dy.d})">✅ दिन पूरा करें</button>` : ''}
                <button class="btn" style="border:1px solid var(--border-light);" onclick="chSelectDay(${dy.d});openSection('challenge')">🔥 चैलेंज में खोलें</button>
            </div>
        </div>
        ${topicCards ? `<div class="ld-topics"><h4>📚 आज के topics — क्लिक करके concepts खोलें</h4>${topicCards}</div>` : ''}
        <div class="ch-cols">
            <div class="ch-col"><h4>🎯 आज का पढ़ाई-कार्यक्रम</h4>${taskRows}</div>
            <div class="ch-col"><h4>🔁 स्पेस्ड रिवीज़न (कल/दिन-3/दिन-7)</h4>${revRows}
                <h4 style="margin-top:1rem;">🧮 कैलकुलेशन ड्रिल</h4>
                <div class="muted small">${(dy.calc || []).map(g => esc(g)).join(' + ')} — कैलकुलेशन बूस्टर में</div>
            </div>
        </div>
        <div class="muted small" style="margin-top:.6rem;">💡 क्रम याद रखें: <b>concept समझें → tricks देखें → 🗂️ इस concept के PYQ → traps चेक → 🏆 पक्का टिक</b></div>
    </div>`;
    if (typeof el.scrollIntoView === 'function') el.scrollIntoView({ block: 'start', behavior: 'smooth' });
}

/* ---------------- tabs ---------------- */
function setLearnTab(tab) {
    learnTab = tab;
    document.querySelectorAll('#learn-tabs .lt-tab').forEach(b => b.classList.toggle('on', b.getAttribute('data-lt') === tab));
    const dWrap = document.getElementById('learn-days');
    const tWrap = document.getElementById('learn-topics-wrap');
    if (dWrap) dWrap.style.display = (tab === 'days') ? 'grid' : 'none';
    if (tWrap) tWrap.style.display = (tab === 'topics') ? 'block' : 'none';
    if (tab === 'days') { masteryOpenTopic = null; const el = document.getElementById('mastery-detail'); if (el && !learnOpenDay) el.style.display = 'none'; }
    renderLearnDays();
    renderMasteryTopics();
}

/* ---------------- init ---------------- */
/* renderLearn(filter) से आता है — filter को mastery search में लगाता है */
function renderMasteryPath(filter) {
    if (!MASTERY_TOPICS.length) return;
    if (typeof filter === 'string' && filter) setLearnTab('topics');
    const q = (filter || '').trim().toLowerCase();
    if (q !== masteryFilter.q) {
        masteryFilter.q = q;
        const input = document.getElementById('mastery-search');
        if (input && input.value !== (filter || '')) input.value = filter || '';
    }
    renderMasteryHero();
    renderLearnDays();
    renderMasteryTopics();
}

function initMastery() {
    if (!MASTERY_TOPICS.length) return;
    document.querySelectorAll('#learn-tabs .lt-tab').forEach(b =>
        b.addEventListener('click', () => setLearnTab(b.getAttribute('data-lt'))));
    setLearnTab(learnTab);
    renderMasteryHero();
    renderLearnDays();
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
