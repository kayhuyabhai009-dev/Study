/* ============================================================
   गणित गुरु — research-hub.js
   दो merged हिस्सों की SPA-side logic:

   1) 🔬 सरकारी एक्ज़ाम रिसर्च प्लेटफ़ॉर्म (research/ फोल्डर)
      — sub-tabs + iframe; iframe के अंदर research platform अपनी
        chrome छिपाकर (embedded mode) सिर्फ content दिखाती है।
   2) 📊 PYQ एनालिसिस — 37,000+ प्रश्नों का topic → concept
      विश्लेषण (js/data-pyq-analysis.js के aggregates से instant render)
   ============================================================ */

/* ================= 1) रिसर्च प्लेटफ़ॉर्म (iframe + tabs) ================= */
const RESEARCH_PAGES = [
    { file: 'index.html', label: 'डैशबोर्ड', icon: '📊' },
    { file: 'exams.html', label: 'परीक्षाएँ', icon: '🏛️' },
    { file: 'library.html', label: 'PYQ लाइब्रेरी', icon: '📚' },
    { file: 'important.html', label: 'इंपॉर्टेंट', icon: '🚩' },
    { file: 'hierarchy.html', label: 'हायरार्की', icon: '🌳' },
    { file: 'patterns.html', label: 'पैटर्न', icon: '🧩' },
    { file: 'formulas.html', label: 'फॉर्मूला', icon: '∑' },
    { file: 'compare.html', label: 'तुलना', icon: '⚖️' },
    { file: 'learn.html', label: 'लर्न', icon: '🎓' },
    { file: 'skills.html', label: 'कैलकुलेशन स्किल्स', icon: '🧮' },
    { file: 'mistakes.html', label: 'मिस्टेक्स', icon: '⚠️' },
    { file: 'cis.html', label: 'CIS एक्सप्लोरर', icon: '⭐' },
    { file: 'tracker.html', label: 'मास्टरी ट्रैकर', icon: '✅' },
    { file: 'calendar.html', label: '60-दिन कैलेंडर', icon: '📅' },
    { file: 'methodology.html', label: 'मेथडोलॉजी', icon: 'ℹ️' }
];

function researchFrame() { return document.getElementById('rs-frame'); }

/* iframe lazy-load — मुख्य site हल्की रहे, research platform तभी लोड हो
   जब उपयोगकर्ता पहली बार research section खोले */
let researchFrameLoaded = false;
function ensureResearchFrame() {
    const frame = researchFrame();
    if (!frame || researchFrameLoaded) return;
    researchFrameLoaded = true;
    if (!frame.getAttribute('src')) frame.setAttribute('src', 'research/index.html');
}

function initResearchHub() {
    const bar = document.getElementById('rs-tabbar');
    if (!bar) return;
    bar.innerHTML = RESEARCH_PAGES.map(p =>
        `<button class="rs-tab" data-page="${p.file}">${p.icon} ${p.label}</button>`).join('');
    bar.querySelectorAll('.rs-tab').forEach(b =>
        b.addEventListener('click', () => setResearchPage(b.getAttribute('data-page'))));

    const frame = researchFrame();
    if (frame) {
        frame.addEventListener('load', () => {
            let page = 'index.html';
            try { page = frame.contentWindow.location.pathname.split('/').pop() || 'index.html'; }
            catch (e) { /* cross-origin — default रखें */ }
            highlightResearchTab(page.split('?')[0]);
        });
    }
    // #research/<page>.html डीप-लिंक सपोर्ट
    window.addEventListener('hashchange', () => {
        const h = window.location.hash.slice(1);
        if (h.indexOf('research/') === 0) openResearchPage(h.slice('research/'.length));
    });
}

function setResearchPage(file) {
    const frame = researchFrame();
    if (!frame) return;
    const target = 'research/' + file;
    const cur = frame.getAttribute('src') || '';
    if (cur !== target) frame.setAttribute('src', target);
    highlightResearchTab(file.split('?')[0]);
}

function highlightResearchTab(file) {
    document.querySelectorAll('#rs-tabbar .rs-tab').forEach(b =>
        b.classList.toggle('active', b.getAttribute('data-page') === file));
}

/* कहीं से भी research platform का कोई page खोलने के लिए */
function openResearchPage(file) {
    if (typeof openSection === 'function') openSection('research');
    ensureResearchFrame();
    setResearchPage(file);
    const frame = researchFrame();
    if (frame && typeof frame.scrollIntoView === 'function') frame.scrollIntoView({ block: 'start' });
}

/* मुख्य site का theme बदलने पर iframe को भी बताएँ */
function syncResearchTheme(t) {
    const frame = researchFrame();
    try { if (frame && frame.contentWindow) frame.contentWindow.postMessage({ gemsTheme: t }, '*'); }
    catch (e) { /* ignore */ }
}

/* ================= 2) PYQ एनालिसिस (10,000+ प्रश्न) ================= */
const PA_PAGE = 30;
let paState = { search: '', exam: 'all', topic: null, pattern: null, shown: PA_PAGE };

/* id → question तेज़ lookup (PYQ_ALL main.js में बनता है) */
let PA_BY_ID = null;
function paById() {
    if (!PA_BY_ID) {
        PA_BY_ID = new Map();
        (typeof PYQ_ALL !== 'undefined' ? PYQ_ALL : []).forEach(q => PA_BY_ID.set(String(q.id), q));
    }
    return PA_BY_ID;
}

function initPyqAnalysis() {
    if (typeof PYQ_ANALYSIS === 'undefined') return;
    const sel = document.getElementById('pa-exam-filter');
    if (sel) {
        PYQ_ANALYSIS.exams.forEach(e => {
            const o = document.createElement('option');
            o.value = e; o.textContent = e;
            sel.appendChild(o);
        });
        sel.addEventListener('change', () => {
            paState.exam = sel.value;
            paState.topic = null; paState.pattern = null;
            renderPaTopics();
        });
    }
    const search = document.getElementById('pa-search');
    if (search) search.addEventListener('input', () => {
        paState.search = search.value.trim().toLowerCase();
        renderPaTopics();
    });
    renderPaSummary();
    renderPaTopics();
    renderLearnResearchBridge();
}

function paFmt(n) { return Number(n || 0).toLocaleString('en-IN'); }

/* ================= Learn + Challenge सेक्शन में research bridge ================= */
/* "किस concept से किस topic से प्रश्न आते हैं" — सीधे Learn सेक्शन में।
   डेटा: PYQ_ANALYSIS (इस website के 37,061 प्रश्न) + research tagged records। */
function renderLearnResearchBridge() {
    const el = document.getElementById('learn-research-bridge');
    if (!el || typeof PYQ_ANALYSIS === 'undefined') return;
    const cards = PYQ_ANALYSIS.topics.map(t => {
        const top2 = t.patterns.slice(0, 2).map(p => esc(p.label)).join(' · ') || '—';
        return `<div class="lr-topic">
            <div class="lr-topic-head"><b>${t.name}</b><span class="lr-topic-num">${paFmt(t.total)}</span></div>
            <div class="lr-topic-sub muted">${t.en} · ${t.patterns.length} कॉन्सेप्ट · 🔬 ${paFmt(t.research.total)} टैग्ड</div>
            <div class="lr-topic-pats">🔺 ${top2}</div>
            <div class="lr-topic-btns">
                <button onclick="openPaTopic('${t.name.replace(/'/g, "\\'")}');openSection('pyq-analysis')">📊 विश्लेषण</button>
                <button onclick="openResearchPage('important.html?topic=${t.slug}')">🔬 रिसर्च</button>
            </div>
        </div>`;
    }).join('');
    el.innerHTML = `
        <div class="lr-bridge-head">
            <div>
                <h3>🔬 कॉन्सेप्ट-वाइज़ विश्लेषण — किस concept से कितने प्रश्न आते हैं</h3>
                <p class="muted">हर टॉपिक के concept(पैटर्न)-वार प्रश्न-गणना। "विश्लेषण" = इस website के 37,061 प्रश्न, "रिसर्च" = 42,634 टैग्ड रिकॉर्ड (1,687 पेपर) के concept-tags।</p>
            </div>
            <div class="lr-bridge-links">
                <button onclick="openResearchPage('learn.html')">🎓 कॉन्सेप्ट-वाइज़ लर्न</button>
                <button onclick="openResearchPage('hierarchy.html')">🌳 हायरार्की</button>
                <button onclick="openSection('pyq-analysis')">📊 PYQ एनालिसिस</button>
            </div>
        </div>
        <div class="lr-topic-grid">${cards}</div>`;
}

function renderPaSummary() {
    const el = document.getElementById('pa-summary');
    if (!el) return;
    const t = PYQ_ANALYSIS.totals;
    const cards = [
        { icon: '🗂️', v: paFmt(t.questions), l: 'PYQ प्रश्न (इस website के)' },
        { icon: '📚', v: paFmt(t.topics), l: 'टॉपिक' },
        { icon: '🧩', v: paFmt(t.patterns), l: 'कॉन्सेप्ट-पैटर्न' },
        { icon: '💡', v: paFmt(t.withSolution), l: 'हल सहित प्रश्न' },
        { icon: '🔬', v: paFmt(t.researchRecords), l: 'रिसर्च टैग्ड रिकॉर्ड (साथ में)' },
        { icon: '🏛️', v: paFmt(t.exams), l: 'परीक्षाएँ · ' + paFmt(t.years) + ' वर्ष' }
    ];
    el.innerHTML = cards.map(c =>
        `<div class="card stat-card"><div class="stat-icon">${c.icon}</div>
         <div class="stat-value">${c.v}</div><div class="stat-label">${c.l}</div></div>`).join('');
}

function renderPaTopics() {
    const grid = document.getElementById('pa-topics');
    if (!grid) return;
    const q = paState.search;
    let list = PYQ_ANALYSIS.topics.filter(t => {
        if (paState.exam !== 'all' && !(t.exams[paState.exam] > 0)) return false;
        if (!q) return true;
        if (t.name.toLowerCase().includes(q) || t.en.toLowerCase().includes(q)) return true;
        return t.patterns.some(p => p.label.toLowerCase().includes(q));
    });
    if (q) {
        // खोजे गए कॉन्सेप्ट वाले टॉपिक ऊपर
        list = list.slice().sort((a, b) => {
            const ap = a.patterns.some(p => p.label.toLowerCase().includes(q)) ? 0 : 1;
            const bp = b.patterns.some(p => p.label.toLowerCase().includes(q)) ? 0 : 1;
            return ap - bp || b.total - a.total;
        });
    }
    const detail = document.getElementById('pa-detail');
    if (paState.topic && !list.some(t => t.name === paState.topic)) {
        paState.topic = null; paState.pattern = null;
        if (detail) detail.style.display = 'none';
    }
    if (!list.length) {
        grid.innerHTML = '<div class="no-data">कोई टॉपिक नहीं मिला — फिल्टर बदलकर देखें</div>';
        return;
    }
    grid.innerHTML = list.map(t => {
        const d = t.diff || {};
        const top = t.patterns.slice(0, 3).map(p => `${p.label} (${p.count})`).join(' · ') || '—';
        const active = paState.topic === t.name ? ' active' : '';
        return `<div class="pa-topic-card${active}" onclick="openPaTopic('${t.name.replace(/'/g, "\\'")}')" role="button" tabindex="0">
            <div class="pa-topic-head"><b>${t.name}</b><span class="pa-topic-total">${paFmt(t.total)}</span></div>
            <div class="pa-topic-en muted">${t.en} · ${t.patterns.length} कॉन्सेप्ट</div>
            <div class="pa-diff-bar" title="कठिनाई वितरण">
                <span style="width:${pctPa(d['आसान'], t.total)}%" class="pa-diff-easy"></span>
                <span style="width:${pctPa(d['मध्यम'], t.total)}%" class="pa-diff-med"></span>
                <span style="width:${pctPa(d['कठिन'], t.total)}%" class="pa-diff-hard"></span>
            </div>
            <div class="pa-topic-pats muted">🔺 ${top}</div>
            <div class="pa-topic-rs">🔬 रिसर्च: ${paFmt(t.research.total)} टैग्ड प्रश्न</div>
        </div>`;
    }).join('');
}

function pctPa(n, total) { return total ? (100 * (n || 0) / total) : 0; }

function openPaTopic(name) {
    const t = PYQ_ANALYSIS.topics.find(x => x.name === name);
    if (!t) return;
    paState.topic = name; paState.pattern = null; paState.shown = PA_PAGE;
    renderPaTopics();
    const el = document.getElementById('pa-detail');
    if (!el) return;
    el.style.display = 'block';

    const d = t.diff || {}, langs = t.langs || {};
    const examRows = Object.entries(t.exams).sort((a, b) => b[1] - a[1]);
    const yearRows = Object.entries(t.years).sort((a, b) => b[0].localeCompare(a[0]));
    const stat = (label, val, cls) => `<div class="pa-stat ${cls || ''}"><b>${paFmt(val)}</b><span>${label}</span></div>`;

    el.innerHTML = `
        <div class="card pa-detail-card">
            <div class="pa-detail-head">
                <div>
                    <h3>${t.name} <span class="muted">— ${t.en}</span></h3>
                    <p class="muted">${paFmt(t.total)} प्रश्न · ${t.patterns.length} कॉन्सेप्ट-पैटर्न · हल सहित ${paFmt(t.sol)}</p>
                </div>
                <button class="btn btn-primary" onclick="openResearchPage('important.html?topic=${t.slug}')">
                    🔬 रिसर्च में ${paFmt(t.research.total)} टैग्ड प्रश्न खोलें
                </button>
            </div>
            <div class="pa-stat-row">
                ${stat('आसान', d['आसान'] || 0, 'pa-easy')}
                ${stat('मध्यम', d['मध्यम'] || 0, 'pa-med')}
                ${stat('कठिन', d['कठिन'] || 0, 'pa-hard')}
                ${stat('🇮🇳 हिंदी', langs.hi || 0)}
                ${stat('EN', langs.en || 0)}
            </div>
            <div class="pa-split">
                <div><h4>परीक्षा-वार</h4>
                    ${examRows.map(([e, c]) => `<div class="pa-bar-row"><span class="pa-bar-label">${esc(e)}</span>
                        <span class="pa-bar"><span style="width:${(100 * c / t.total).toFixed(1)}%"></span></span>
                        <b>${paFmt(c)}</b></div>`).join('')}
                </div>
                <div><h4>वर्ष-वार</h4>
                    ${yearRows.map(([y, c]) => `<div class="pa-bar-row"><span class="pa-bar-label">${esc(y)}</span>
                        <span class="pa-bar"><span style="width:${(100 * c / t.total).toFixed(1)}%"></span></span>
                        <b>${paFmt(c)}</b></div>`).join('')}
                </div>
            </div>
            <h4>कॉन्सेप्ट-पैटर्न — किस concept से कितने प्रश्न</h4>
            <div class="pa-pat-chips">
                <button class="pa-pat-chip${paState.pattern ? '' : ' on'}" onclick="selectPaPattern(null)">सभी (${paFmt(t.total)})</button>
                ${t.patterns.map(p => `<button class="pa-pat-chip${paState.pattern === p.label ? ' on' : ''}" onclick="selectPaPattern('${p.label.replace(/'/g, "\\'")}')">${esc(p.label)} (${p.count})</button>`).join('')}
            </div>
            <div class="pa-qcount" id="pa-qcount"></div>
            <div class="pa-qlist" id="pa-qlist"></div>
            <div class="load-more-wrap"><button class="btn btn-primary" id="pa-more" style="display:none;" onclick="paLoadMore()">⬇ और प्रश्न दिखाएँ</button></div>
        </div>`;
    renderPaQuestions();
}

function selectPaPattern(label) {
    paState.pattern = label;
    paState.shown = PA_PAGE;
    // chips को दोबारा बनाएँ बिना पूरा panel खोए
    document.querySelectorAll('.pa-pat-chip').forEach((b, i) => {
        const t = PYQ_ANALYSIS.topics.find(x => x.name === paState.topic);
        const want = label === null ? 'सभी' : label;
        b.classList.toggle('on', (i === 0 && label === null) || (i > 0 && t && t.patterns[i - 1] && t.patterns[i - 1].label === want));
    });
    renderPaQuestions();
}

function paCurrentIds() {
    const t = PYQ_ANALYSIS.topics.find(x => x.name === paState.topic);
    if (!t) return [];
    if (!paState.pattern) {
        // सभी patterns के ids मिलाएँ (topic के सभी प्रश्न)
        const all = [];
        t.patterns.forEach(p => all.push(...p.ids));
        return all;
    }
    const p = t.patterns.find(x => x.label === paState.pattern);
    return p ? p.ids.slice() : [];
}

function renderPaQuestions() {
    const listEl = document.getElementById('pa-qlist');
    const countEl = document.getElementById('pa-qcount');
    if (!listEl) return;
    const ids = paCurrentIds();
    const byId = paById();
    const qs = ids.map(id => byId.get(String(id))).filter(Boolean);
    const total = qs.length;
    if (countEl) countEl.innerHTML = `<b>${paFmt(total)}</b> प्रश्न${paState.pattern ? ' — कॉन्सेप्ट: <b>' + esc(paState.pattern) + '</b>' : ''}`;
    const vis = qs.slice(0, paState.shown);
    listEl.innerHTML = vis.map(paQuestionCard).join('') ||
        '<div class="no-data">इस कॉन्सेप्ट के प्रश्न इस website के बैंक में नहीं हैं — रिसर्च प्लेटफ़ॉर्म में टैग्ड रिकॉर्ड देखें।</div>';
    const more = document.getElementById('pa-more');
    if (more) more.style.display = total > vis.length ? 'inline-flex' : 'none';
}

function paLoadMore() {
    paState.shown += PA_PAGE;
    renderPaQuestions();
}

function paQuestionCard(q) {
    const letters = q.optLetters || (q.options || []).map((_, i) => 'abcd'[i]);
    const opts = (q.options || []).map((o, i) => (letters[i] || 'abcd'[i]) + ') ' + esc(o)).join('  ');
    const sol = (q.solution && q.solution.length)
        ? `<div class="pa-sol"><b>💡 हल:</b> ${q.solution.map(esc).join('<br>')}</div>
           <div class="pa-ans">✔ सही उत्तर: ${esc(q.answer || q.answerLetter || '—')}</div>`
        : `<div class="pa-ans">✔ सही उत्तर: ${q.answerLetter ? '(' + q.answerLetter + ') ' : ''}${esc(q.answer || '—')}</div>`;
    const yr = q.year ? ' ' + q.year : '';
    return `<div class="pa-q">
        <div class="pa-q-head"><span class="pyq-topic">${esc(q.topic)}</span>
            <span class="pyq-exam">${esc(q.exam)}${yr} • ${esc(q.difficulty)}${q.lang === 'en' ? ' • EN' : ''}</span></div>
        <div class="pa-q-text">${esc(q.question)}</div>
        <div class="pa-q-opts">${opts}</div>
        ${sol}
    </div>`;
}
