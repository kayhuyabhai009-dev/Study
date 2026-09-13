/* ============================================================
   गणित गुरु — मुख्य ऐप इंजन
   नेविगेशन, डैशबोर्ड, फॉर्मूला बुक, कैलकुलेशन बूस्टर (ड्रिल सहित),
   डेली प्रैक्टिस, PYQ, पैटर्न/ट्रैप, एरर लॉग, रिवीजन, एग्जाम,
   90-दिन प्लान, प्रोफाइल — सब कुछ localStorage में सेव होता है
   ============================================================ */

'use strict';

/* ================= स्टेट (localStorage) ================= */
const LS_KEY = 'ganit-guru-state';
const DEFAULT_STATE = {
    xp: 0,
    questions: 0,
    correct: 0,
    sets: {},            // { 'YYYY-MM-DD': { score, total } }
    bestDrill: {},       // { genName: score }
    errorLog: [],        // { id, topic, type, desc, lesson, date }
    chaptersRead: [],
    trapsRead: [],
    pyqsSeen: [],
    bestSet: 0,
    bestMock: 0
};

let state = loadState();

function loadState() {
    try {
        const raw = localStorage.getItem(LS_KEY);
        if (raw) return Object.assign({}, DEFAULT_STATE, JSON.parse(raw));
    } catch (e) { /* ignore */ }
    return Object.assign({}, DEFAULT_STATE);
}
function saveState() {
    try { localStorage.setItem(LS_KEY, JSON.stringify(state)); } catch (e) { /* ignore */ }
}
function addXP(n) { state.xp += n; saveState(); updateDashboard(); updateProfile(); }

function todayKey(offsetDays) {
    const d = new Date();
    if (offsetDays) d.setDate(d.getDate() + offsetDays);
    return d.toISOString().slice(0, 10);
}

/* ================= थीम ================= */
function initTheme() {
    const saved = localStorage.getItem('ganit-guru-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (saved === 'dark' || (!saved && prefersDark)) setTheme('dark'); else setTheme('light');
    document.getElementById('theme-toggle').addEventListener('click', () => {
        const cur = document.body.getAttribute('data-theme');
        setTheme(cur === 'dark' ? 'light' : 'dark');
    });
}
function setTheme(t) {
    document.body.setAttribute('data-theme', t);
    document.getElementById('moon-icon').style.display = t === 'dark' ? 'block' : 'none';
    document.getElementById('sun-icon').style.display = t === 'dark' ? 'none' : 'block';
    localStorage.setItem('ganit-guru-theme', t);
}

/* ================= नेविगेशन ================= */
function initNav() {
    const navLinks = document.querySelector('.nav-links');
    const menuBtn = document.createElement('button');
    menuBtn.className = 'menu-toggle';
    menuBtn.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M3 18h18M3 12h18M3 6h18"/></svg>';
    menuBtn.setAttribute('aria-label', 'मेन्यू खोलें');
    const navLogo = document.querySelector('.nav-logo');
    navLogo.parentNode.insertBefore(menuBtn, navLogo.nextSibling);
    menuBtn.addEventListener('click', () => navLinks.classList.toggle('active'));

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            openSection(link.getAttribute('data-section'));
            navLinks.classList.remove('active');
        });
    });
}

function openSection(name) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(name);
    if (target) target.classList.add('active');
    document.querySelectorAll('.nav-links a').forEach(a =>
        a.classList.toggle('active', a.getAttribute('data-section') === name));
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ================= डैशबोर्ड ================= */
function getAccuracy() {
    if (!state.questions) return 0;
    return Math.round(state.correct / state.questions * 100);
}
function getMastery() {
    const ch = Math.min(state.chaptersRead.length / 14, 1) * 40;
    const xp = Math.min(state.xp / 1000, 1) * 30;
    const acc = getAccuracy() * 0.3;
    return Math.round(ch + xp + acc);
}
function getStreak() {
    let streak = 0, off = 0;
    // आज पूरा नहीं हुआ तो कल से गिनें
    if (!state.sets[todayKey()]) off = 1;
    while (state.sets[todayKey(-(off + streak))]) streak++;
    return streak;
}
function getWeekCount() {
    let n = 0;
    for (let i = 0; i < 7; i++) if (state.sets[todayKey(-i)]) n++;
    return n;
}
function getBestDrill() {
    return Math.max(0, ...Object.values(state.bestDrill));
}

function updateDashboard() {
    document.getElementById('overall-mastery-value').textContent = getMastery() + '%';
    document.getElementById('pyqs-analysed-value').textContent = state.questions;
    document.getElementById('topics-mastered-value').textContent = state.chaptersRead.length;
    document.getElementById('accuracy-value').textContent = getAccuracy() + '%';
    document.getElementById('speed-value').textContent = getBestDrill();
    document.getElementById('streak-value').textContent = getStreak();

    // आज का फोकस
    const dow = new Date().getDay();
    let focus;
    if (dow === 0) {
        focus = '<p>आज <b>रविवार</b> है — साप्ताहिक मॉक का दिन! 🎯</p><ul><li>📝 20 प्रश्नों का मॉक (डेली प्रैक्टिस में)</li><li>🔄 इस हफ्ते का एरर लॉग पूरा दोहराएँ</li><li>📖 इस हफ्ते के फॉर्मूले बिना देखे बोलें</li></ul>';
    } else {
        const topic = LEARN_TOPICS[(dow + (new Date().getDate() % 5)) % LEARN_TOPICS.length];
        focus = '<p>आज का टॉपिक: <b>' + topic.name + '</b></p><ul><li>📖 फॉर्मूला बुक में "' + topic.name + '" अध्याय पढ़ें</li><li>🗂️ PYQ बैंक में "' + topic.name + '" के प्रश्न हल करें</li><li>🧮 कैलकुलेशन बूस्टर की रोज़ की ड्रिल न भूलें</li></ul>';
    }
    document.getElementById('today-focus-content').innerHTML = focus;
}

/* ================= सीखें (Learn) ================= */
function renderLearn() {
    const grid = document.getElementById('learn-cards');
    grid.innerHTML = LEARN_TOPICS.map(t => `
        <div class="learn-card" onclick="openChapter('${t.chapter}')" role="button" tabindex="0">
            <div class="lc-icon">${t.icon}</div>
            <h4>${t.name}</h4>
            <p>${t.desc}</p>
            <div class="tags">${t.tags.map(x => `<span class="tag">${x}</span>`).join('')}</div>
        </div>`).join('');
}

/* ================= फॉर्मूला बुक ================= */
function renderFormulaChapters() {
    const wrap = document.getElementById('formula-chapters');
    wrap.style.display = 'grid';
    wrap.innerHTML = FORMULA_BOOK.map(ch => {
        const done = state.chaptersRead.includes(ch.id);
        return `<div class="chapter-card" onclick="openChapter('${ch.id}')" role="button" tabindex="0">
            <div class="cc-head"><span class="cc-icon">${ch.icon}</span><h3>${ch.name}</h3></div>
            <p>${ch.desc}</p>
            <span class="cc-count">${ch.formulas.length} फॉर्मूले ${done ? '✅ पढ़ा' : ''}</span>
        </div>`;
    }).join('');
    document.getElementById('formula-detail').style.display = 'none';
}

function openChapter(id) {
    const ch = FORMULA_BOOK.find(c => c.id === id);
    if (!ch) return;
    const detail = document.getElementById('formula-detail');
    detail.style.display = 'block';
    detail.innerHTML = `
        <button class="back-btn" onclick="renderFormulaChapters()">← सभी अध्याय</button>
        <h3 style="font-weight:800; font-size:1.4rem; margin-bottom:.4rem;">${ch.icon} ${ch.name}</h3>
        <p class="muted" style="margin-bottom:1rem;">${ch.desc} — उपविषय: ${ch.subtopics.join(', ')}</p>
        ${ch.formulas.map((f, i) => formulaBlock(f, i)).join('')}`;
    document.getElementById('formula-chapters').style.display = 'none';
    if (!state.chaptersRead.includes(id)) {
        state.chaptersRead.push(id);
        saveState();
        addXP(10);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function formulaBlock(f, i) {
    return `<div class="formula-block">
        <h3>${i + 1}. ${f.name}</h3>
        <div class="fb-row"><span class="fb-label">📌 सूत्र</span><div class="fb-box formula">${esc(f.rule)}</div></div>
        <div class="fb-row"><span class="fb-label">💡 समझ — यह सूत्र कैसे बना?</span><div class="fb-box">${esc(f.explain)}</div></div>
        <div class="fb-row"><span class="fb-label">✏️ उदाहरण</span><div class="fb-box example">${esc(f.example)}</div></div>
        <div class="fb-row"><span class="fb-label">⚠️ ट्रैप से बचाव</span><div class="fb-box trap">${esc(f.trap)}</div></div>
        <div class="fb-row"><span class="fb-label">🎯 PYQ-शैली प्रश्न</span><div class="fb-box pyq">${esc(f.pyq)}<br><b>उत्तर: ${esc(f.pyqAns)}</b></div></div>
    </div>`;
}

function initFormulaSearch() {
    const input = document.getElementById('formula-search');
    input.addEventListener('input', () => {
        const q = input.value.trim().toLowerCase();
        const wrap = document.getElementById('formula-chapters');
        const detail = document.getElementById('formula-detail');
        if (!q) { renderFormulaChapters(); return; }
        detail.style.display = 'none';
        wrap.innerHTML = '';
        const results = [];
        FORMULA_BOOK.forEach(ch => ch.formulas.forEach(f => {
            if ((f.name + f.rule + f.explain).toLowerCase().includes(q)) results.push({ ch, f });
        }));
        if (!results.length) {
            wrap.innerHTML = '<div class="no-data">😕 "' + esc(q) + '" से कोई फॉर्मूला नहीं मिला — दूसरा शब्द आज़माएँ</div>';
            return;
        }
        wrap.innerHTML = '<div style="grid-column:1/-1; font-size:.9rem; color:var(--text-muted);">🔍 ' + results.length + ' फॉर्मूले मिले — पढ़ने के लिए नीचे स्क्रॉल करें</div>' +
            results.map(({ ch, f }, i) => {
                const blk = formulaBlock(f, i).replace(/<h3>/, '<h3>' + ch.icon + ' ' + ch.name + ' → ');
                return '<div class="formula-block" style="grid-column:1/-1;">' + blk.replace(/<div class="formula-block">/, '').replace(/<\/div>\s*$/, '') + '</div>';
            }).join('');
    });
}

/* ================= कैलकुलेशन बूस्टर ================= */
let calcLevel = 'basic';
let activeDrill = null;
let drillTimer = null;

function initCalculation() {
    document.querySelectorAll('.level-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.level-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            calcLevel = tab.getAttribute('data-level');
            renderCalcLevel();
        });
    });
    renderCalcLevel();
    renderDrillSelect();
    document.getElementById('drill-check').addEventListener('click', checkDrillAnswer);
    document.getElementById('drill-input').addEventListener('keydown', e => { if (e.key === 'Enter') checkDrillAnswer(); });
}

function renderCalcLevel() {
    const lv = CALC_BOOSTER.find(l => l.level === calcLevel);
    const stats = document.getElementById('calc-level-stats');
    stats.innerHTML = CALC_BOOSTER.map(l => {
        return `<div class="calc-stat"><b>${l.techniques.length}</b><span>${l.title.split('—')[0]}</span></div>`;
    }).join('');

    const list = document.getElementById('calc-tech-list');
    list.style.display = 'grid';
    document.getElementById('calc-tech-detail').style.display = 'none';
    list.innerHTML = lv.techniques.map(t => `
        <div class="tech-card" onclick="openTechnique('${t.id}')" role="button" tabindex="0">
            <h4>${t.name}</h4>
            <p>${t.tagline}</p>
        </div>`).join('');
}

function openTechnique(id) {
    let tech = null;
    for (const lv of CALC_BOOSTER) {
        tech = lv.techniques.find(t => t.id === id);
        if (tech) break;
    }
    if (!tech) return;
    const detail = document.getElementById('calc-tech-detail');
    detail.style.display = 'block';
    detail.innerHTML = `
        <button class="back-btn" onclick="renderCalcLevel()">← वापस तकनीकों पर</button>
        <div class="tech-detail">
            <h3>${tech.name}</h3>
            <div class="tech-tagline">${tech.tagline}</div>
            <h4>📌 नियम</h4><ul>${tech.rule.map(r => `<li>${esc(r)}</li>`).join('')}</ul>
            <h4>💡 कैसे काम करता है?</h4><div class="sol-block">${esc(tech.how).split('\n').map(l => `<p>${esc(l)}</p>`).join('')}</div>
            <h4>✏️ हल किए उदाहरण</h4>
            ${tech.examples.map(ex => `<div class="sol-block"><p><b>${esc(ex.q)}</b></p><p>→ ${esc(ex.sol)}</p></div>`).join('')}
            <h4>🎮 अभ्यास (खुद हल करें, फिर देखें)</h4>
            <div class="practice-list" id="practice-list">${tech.practice.map((p, i) => `
                <div class="practice-item" style="border:1px solid var(--border-light); border-radius:10px; padding:.7rem 1rem; margin-bottom:.5rem;">
                    <b>${i + 1}. ${esc(p.q)}</b>
                    <button class="drill-btn" style="padding:.3rem .8rem; font-size:.8rem; margin-left:.6rem;" onclick="this.nextElementSibling.style.display='inline'">उत्तर देखें</button>
                    <span style="display:none; font-weight:800; color:var(--success); margin-left:.6rem;">= ${esc(p.a)}</span>
                </div>`).join('')}</div>
            <h4>🏆 टिप</h4><div class="fb-box formula">${esc(tech.tip)}</div>
        </div>`;
    document.getElementById('calc-tech-list').style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* -------- स्पीड ड्रिल इंजन -------- */
const DRILLS = [
    { gen: 'tables', name: '🎲 पहाड़े', desc: '2-20 तक के गुणा' },
    { gen: 'squares', name: '🔲 वर्ग (1-50)', desc: 'n² बोलिए' },
    { gen: 'fracPercent', name: '💯 भिन्न → %', desc: '1/2 = ?%' },
    { gen: 'addSub', name: '➕ जोड़-घटाव', desc: '2-3 अंकीय' },
    { gen: 'twoDigitMul', name: '✖️ दो अंकीय गुणा', desc: '20-99 × 20-99' },
    { gen: 'baseMul', name: '🎯 100-आधार गुणा', desc: '90-110 के बीच' },
    { gen: 'successive', name: '📉 सतत %', desc: 'a% फिर b%' },
    { gen: 'series', name: '🔢 श्रेणी योग', desc: '1 से n, वर्ग, घन' },
    { gen: 'sqrt', name: '√ वर्गमूल', desc: 'पूर्ण वर्ग 1000-10000' },
    { gen: 'unitDigit', name: '🔚 इकाई अंक', desc: 'a^b का इकाई अंक' },
    { gen: 'remainder', name: '➗ शेषफल', desc: '(n−1)^k ÷ n' },
    { gen: 'percentCalc', name: '💹 % के सवाल', desc: 'x का y%' }
];

function renderDrillSelect() {
    document.getElementById('drill-select').innerHTML = DRILLS.map(d => {
        const best = state.bestDrill[d.gen] || 0;
        return `<button class="drill-btn" onclick="startDrill('${d.gen}')">${d.name} ${best ? '<small>🏆 ' + best + '</small>' : ''}</button>`;
    }).join('');
}

function rnd(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }

function genDrillQuestion(gen) {
    switch (gen) {
        case 'tables': { const a = rnd(2, 20), b = rnd(2, 20); return { q: a + ' × ' + b + ' = ?', a: a * b }; }
        case 'squares': { const n = rnd(1, 50); return { q: n + '² = ?', a: n * n }; }
        case 'fracPercent': {
            const fracs = [[2, 50], [3, 33.33], [4, 25], [5, 20], [6, 16.67], [7, 14.28], [8, 12.5], [9, 11.11], [10, 10], [11, 9.09], [12, 8.33], [16, 6.25], [20, 5], [25, 4]];
            const f = fracs[rnd(0, fracs.length - 1)];
            return { q: '1/' + f[0] + ' = ?%', a: f[1], tol: 0.15 };
        }
        case 'addSub': {
            const a = rnd(20, 499), b = rnd(11, 299), plus = Math.random() < 0.5;
            return { q: a + (plus ? ' + ' : ' − ') + b + ' = ?', a: plus ? a + b : a - b };
        }
        case 'twoDigitMul': { const a = rnd(20, 99), b = rnd(20, 99); return { q: a + ' × ' + b + ' = ?', a: a * b }; }
        case 'baseMul': { const a = rnd(90, 110), b = rnd(90, 110); return { q: a + ' × ' + b + ' = ?', a: a * b }; }
        case 'successive': {
            const a = rnd(5, 40), b = rnd(5, 40), mode = rnd(0, 2);
            let ans, txt;
            if (mode === 0) { ans = a + b + a * b / 100; txt = a + '% वृद्धि फिर ' + b + '% वृद्धि = कुल ?%'; }
            else if (mode === 1) { ans = a + b - a * b / 100; txt = a + '% छूट फिर ' + b + '% छूट = कुल ?%'; }
            else { ans = a - b - a * b / 100; txt = a + '% वृद्धि फिर ' + b + '% कमी = कुल ?%'; }
            return { q: txt, a: Math.round(ans * 100) / 100, tol: 0.05 };
        }
        case 'series': {
            const n = rnd(6, 60), mode = rnd(0, 2);
            if (mode === 0) return { q: '1+2+…+' + n + ' = ?', a: n * (n + 1) / 2 };
            if (mode === 1) return { q: '1²+2²+…+' + n + '² = ?', a: n * (n + 1) * (2 * n + 1) / 6 };
            return { q: '1³+2³+…+' + n + '³ = ?', a: Math.pow(n * (n + 1) / 2, 2) };
        }
        case 'sqrt': { const n = rnd(32, 99); return { q: '√' + (n * n) + ' = ?', a: n }; }
        case 'unitDigit': {
            const base = [2, 3, 4, 7, 8, 9][rnd(0, 5)], exp = rnd(10, 199);
            let u = 1, b = base % 10;
            for (let i = 0; i < exp; i++) u = (u * b) % 10;
            return { q: base + '^' + exp + ' का इकाई अंक = ?', a: u };
        }
        case 'remainder': {
            const n = [9, 11, 12, 14, 16, 18, 20, 24][rnd(0, 7)], exp = rnd(2, 60);
            let r = 1;
            for (let i = 0; i < exp; i++) r = (r * (n - 1)) % n;
            return { q: (n - 1) + '^' + exp + ' ÷ ' + n + ' का शेष = ?', a: r };
        }
        case 'percentCalc': {
            const mode = rnd(0, 3);
            if (mode === 0) { const x = rnd(20, 99) * 10, p = [5, 10, 12.5, 20, 25, 33.33, 37.5, 50, 62.5, 75, 87.5][rnd(0, 10)]; return { q: x + ' का ' + p + '% = ?', a: Math.round(x * p) / 100, tol: 0.5 }; }
            if (mode === 1) { const x = rnd(2, 99) * 10, p = [10, 20, 25, 30, 40, 50, 60, 75][rnd(0, 7)]; return { q: x + ' का ' + p + '% = ?', a: x * p / 100 }; }
            if (mode === 2) { const x = rnd(10, 200), p = [5, 10, 20, 25, 50][rnd(0, 4)]; return { q: 'x का ' + p + '% = ' + (x * p / 100) + ' → x = ?', a: x }; }
            return { q: '25% का 25% = ?%', a: 6.25 };
        }
    }
    return { q: '?', a: 0 };
}

function startDrill(gen) {
    if (drillTimer) { clearInterval(drillTimer); drillTimer = null; }
    activeDrill = { gen, score: 0, correct: 0, wrong: 0, timeLeft: 60, current: null };
    document.getElementById('drill-play').style.display = 'block';
    document.getElementById('drill-result').style.display = 'none';
    document.getElementById('drill-desc').textContent = DRILLS.find(d => d.gen === gen).desc + ' — जितने ज़्यादा सही, उतना अच्छा!';
    document.getElementById('drill-feedback').className = 'drill-feedback';
    document.getElementById('drill-feedback').textContent = '';
    updateDrillHUD();
    nextDrillQuestion();
    document.getElementById('drill-input').focus();
    drillTimer = setInterval(() => {
        activeDrill.timeLeft--;
        updateDrillHUD();
        if (activeDrill.timeLeft <= 0) endDrill();
    }, 1000);
}

function updateDrillHUD() {
    document.getElementById('drill-timer').textContent = activeDrill.timeLeft;
    document.getElementById('drill-score').textContent = activeDrill.score;
    document.getElementById('drill-correct').textContent = activeDrill.correct;
    document.getElementById('drill-wrong').textContent = activeDrill.wrong;
}

function nextDrillQuestion() {
    if (!activeDrill || activeDrill.timeLeft <= 0) return;
    activeDrill.current = genDrillQuestion(activeDrill.gen);
    document.getElementById('drill-question').textContent = activeDrill.current.q;
    const input = document.getElementById('drill-input');
    input.value = '';
    input.focus();
    document.getElementById('drill-feedback').className = 'drill-feedback';
    document.getElementById('drill-feedback').textContent = '';
}

function checkDrillAnswer() {
    if (!activeDrill || activeDrill.timeLeft <= 0) return;
    const val = parseFloat(document.getElementById('drill-input').value.trim().replace(',', '.'));
    const fb = document.getElementById('drill-feedback');
    if (isNaN(val)) { fb.className = 'drill-feedback bad'; fb.textContent = 'कृपया संख्या लिखें!'; return; }
    const tol = activeDrill.current.tol || 0.02;
    if (Math.abs(val - activeDrill.current.a) <= tol) {
        activeDrill.correct++;
        activeDrill.score += 2;
        fb.className = 'drill-feedback good';
        fb.textContent = '✅ सही! ' + activeDrill.current.q + ' = ' + activeDrill.current.a;
    } else {
        activeDrill.wrong++;
        fb.className = 'drill-feedback bad';
        fb.textContent = '❌ सही उत्तर: ' + activeDrill.current.a;
    }
    updateDrillHUD();
    setTimeout(nextDrillQuestion, 350);
}

function endDrill() {
    if (drillTimer) { clearInterval(drillTimer); drillTimer = null; }
    if (!activeDrill) return;
    const d = activeDrill;
    addXP(d.correct);
    const prevBest = state.bestDrill[d.gen] || 0;
    const isBest = d.score > prevBest;
    if (isBest) { state.bestDrill[d.gen] = d.score; saveState(); }
    document.getElementById('drill-play').style.display = 'none';
    const res = document.getElementById('drill-result');
    res.style.display = 'block';
    res.innerHTML = `<h4>⏱️ समय समाप्त!</h4>
        <p class="score-ring">${d.correct}</p><p>सही उत्तर | ${d.wrong} गलत | +${d.correct} XP</p>
        ${isBest ? '<p class="drill-best">🏆 नया रिकॉर्ड!</p>' : '<p class="muted">सर्वश्रेष्ठ: ' + prevBest + ' — और अभ्यास कीजिए!</p>'}
        <button class="btn btn-primary" onclick="startDrill('${d.gen}')">🔁 फिर से खेलें</button>`;
    activeDrill = null;
    updateDashboard();
    updateProfile();
}

/* ================= डेली प्रैक्टिस ================= */
let dailyQuiz = null;

// तारीख से स्थिर (seeded) रैंडम — हर दिन एक ही सेट
function seededRandom(seed) {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < seed.length; i++) { h ^= seed.charCodeAt(i); h = Math.imul(h, 16777619); }
    return function () {
        h += h << 13; h ^= h >>> 7; h += h << 3; h ^= h >>> 17; h += h << 5;
        return ((h >>> 0) % 100000) / 100000;
    };
}

function isSunday() { return new Date().getDay() === 0; }

function buildDailySet() {
    const key = todayKey();
    const rand = seededRandom('ganit-' + key);
    const count = isSunday() ? 20 : 10;
    const pool = DAILY_BANK.slice();
    for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(rand() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    const chosen = pool.slice(0, count);
    return chosen.map(q => {
        const order = [0, 1, 2, 3];
        for (let i = 3; i > 0; i--) {
            const j = Math.floor(rand() * (i + 1));
            [order[i], order[j]] = [order[j], order[i]];
        }
        return { ...q, options: order.map(i => q.options[i]), ans: order.indexOf(q.ans) };
    });
}

function renderDailyHeader() {
    const now = new Date();
    const days = ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'];
    const months = ['जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'];
    const isSun = isSunday();
    document.getElementById('daily-header').innerHTML = `
        <div><h3>${isSun ? '📝 साप्ताहिक मॉक — रविवार विशेष!' : '📅 आज का अभ्यास सेट'}</h3>
        <p>${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()} — ${isSun ? '20 प्रश्न (मॉक मोड)' : '10 प्रश्न'}</p></div>
        <div style="text-align:right;"><div style="font-size:2rem;">${isSun ? '🎯' : '📅'}</div></div>`;
    document.getElementById('daily-streak').textContent = getStreak();
    document.getElementById('daily-week-count').textContent = getWeekCount();
    document.getElementById('daily-total-count').textContent = Object.keys(state.sets).length;
    renderDailyHistory();
}

function renderDailyHistory() {
    const wrap = document.getElementById('daily-history');
    wrap.innerHTML = '';
    for (let i = 13; i >= 0; i--) {
        const key = todayKey(-i);
        const rec = state.sets[key];
        const pct = rec ? Math.round(rec.score / rec.total * 100) : 0;
        const d = new Date(); d.setDate(d.getDate() - i);
        const label = d.getDate() + '/' + (d.getMonth() + 1);
        wrap.innerHTML += `<div class="history-bar ${i === 0 ? 'today' : ''}">
            <div class="bar ${pct > 0 ? 'fill' : ''}" style="height:${Math.max(pct, 4)}%"></div>
            <span>${label}</span>
        </div>`;
    }
}

function startDailyPractice() {
    const key = todayKey();
    if (state.sets[key] && !confirm('आज का सेट पहले ही पूरा हो चुका है (' + state.sets[key].score + '/' + state.sets[key].total + ')। फिर से करना चाहेंगे? (XP दोबारा नहीं मिलेगा)')) return;
    dailyQuiz = {
        questions: buildDailySet(),
        idx: 0, score: 0, correct: 0,
        startTime: Date.now(),
        isMock: isSunday(),
        alreadyDone: !!state.sets[key]
    };
    document.getElementById('daily-start').style.display = 'none';
    document.getElementById('daily-quiz').style.display = 'block';
    document.getElementById('daily-result').style.display = 'none';
    document.getElementById('daily-qno').textContent = '1';
    document.getElementById('daily-score').textContent = '0';
    renderDailyQuestion();
    if (!dailyQuiz.tick) {
        dailyQuiz.tick = setInterval(() => {
            const el = document.getElementById('daily-timer');
            if (!el) return;
            const sec = Math.floor((Date.now() - dailyQuiz.startTime) / 1000);
            el.textContent = Math.floor(sec / 60) + ':' + String(sec % 60).padStart(2, '0');
        }, 1000);
    }
}

function renderDailyQuestion() {
    const q = dailyQuiz.questions[dailyQuiz.idx];
    document.getElementById('daily-qno').textContent = (dailyQuiz.idx + 1);
    document.getElementById('daily-question').textContent = q.q;
    document.getElementById('daily-options').innerHTML = q.options.map((o, i) =>
        `<button class="quiz-option" onclick="answerDaily(${i})">${String.fromCharCode(65 + i)}. ${esc(o)}</button>`).join('');
    document.getElementById('daily-feedback').className = 'quiz-feedback';
    document.getElementById('daily-feedback').style.display = 'none';
    document.getElementById('daily-next').style.display = 'none';
}

function answerDaily(i) {
    const q = dailyQuiz.questions[dailyQuiz.idx];
    const buttons = document.querySelectorAll('#daily-options .quiz-option');
    buttons.forEach(b => b.disabled = true);
    const fb = document.getElementById('daily-feedback');
    const good = i === q.ans;
    if (good) { dailyQuiz.correct++; dailyQuiz.score++; }
    buttons[q.ans].classList.add('correct');
    if (!good) buttons[i].classList.add('wrong');
    fb.className = 'quiz-feedback ' + (good ? 'good' : 'bad');
    fb.innerHTML = `<div class="qf-head">${good ? '✅ बिल्कुल सही!' : '❌ गलत — सही उत्तर: ' + String.fromCharCode(65 + q.ans) + '. ' + esc(q.options[q.ans])}</div>
        <div>💡 ${esc(q.explain)}</div><div style="margin-top:.4rem; font-size:.82rem; color:var(--text-muted);">🏷️ ${q.topic} | ${q.difficulty}</div>`;
    fb.style.display = 'block';
    document.getElementById('daily-score').textContent = dailyQuiz.score;
    const nextBtn = document.getElementById('daily-next');
    if (dailyQuiz.idx < dailyQuiz.questions.length - 1) {
        nextBtn.textContent = 'अगला प्रश्न ➡';
    } else {
        nextBtn.textContent = 'परिणाम देखें 🏁';
    }
    nextBtn.style.display = 'inline-flex';
    nextBtn.onclick = () => {
        if (dailyQuiz.idx < dailyQuiz.questions.length - 1) { dailyQuiz.idx++; renderDailyQuestion(); }
        else finishDaily();
    };
}

function finishDaily() {
    clearInterval(dailyQuiz.tick);
    const q = dailyQuiz;
    const key = todayKey();
    const sec = Math.floor((Date.now() - q.startTime) / 1000);
    document.getElementById('daily-quiz').style.display = 'none';
    const res = document.getElementById('daily-result');
    res.style.display = 'block';
    const pct = Math.round(q.score / q.questions.length * 100);
    const msg = pct === 100 ? '🏆 अविश्वसनीय! परफेक्ट स्कोर!' : pct >= 80 ? '🎉 शानदार! बस थोड़ा और!' : pct >= 60 ? '👍 अच्छी कोशिश — गलतियों का विश्लेषण करें!' : '💪 हिम्मत रखें — एरर लॉग भरें और दोबारा आएँ!';
    res.innerHTML = `<h3>${q.isMock ? '📝 साप्ताहिक मॉक' : '📅 डेली सेट'} समाप्त!</h3>
        <p class="score-ring">${q.score}/${q.questions.length}</p>
        <p style="font-size:1.2rem; font-weight:700; margin:.4rem 0;">${msg}</p>
        <p class="muted">⏱️ समय: ${Math.floor(sec / 60)} मिनट ${sec % 60} सेकंड | सटीकता: ${pct}%</p>
        <div style="margin-top:1rem; display:flex; gap:.7rem; justify-content:center; flex-wrap:wrap;">
            <button class="btn btn-primary" onclick="openSection('revision')">🔄 गलतियों का रिवीजन</button>
            <button class="btn" style="border:1px solid var(--border-light);" onclick="startRevision('errors')">❌ एरर लॉग देखें</button>
        </div>`;

    state.sets[key] = { score: q.score, total: q.questions.length };
    state.questions += q.questions.length;
    state.correct += q.correct;
    if (q.isMock) state.bestMock = Math.max(state.bestMock, q.score);
    else state.bestSet = Math.max(state.bestSet, q.score);
    if (!q.alreadyDone) addXP(q.correct * 5);
    saveState();
    updateDashboard();
    updateProfile();
    renderDailyHeader();
}

/* ================= PYQ बैंक ================= */
let pyqFilters = { exam: 'all', topic: 'all', difficulty: 'all', search: '' };

function initPyq() {
    const exams = [...new Set(PYQ_BANK.map(q => q.exam))];
    const topics = [...new Set(PYQ_BANK.map(q => q.topic))];
    document.getElementById('pyq-exam-filter').innerHTML += exams.map(e => `<option value="${e}">${e}</option>`).join('');
    document.getElementById('pyq-topic-filter').innerHTML += topics.map(t => `<option value="${t}">${t}</option>`).join('');
    ['pyq-exam-filter', 'pyq-topic-filter', 'pyq-difficulty-filter'].forEach(id => {
        document.getElementById(id).addEventListener('change', e => {
            pyqFilters[id.replace('pyq-', '').replace('-filter', '')] = e.target.value;
            renderPyq();
        });
    });
    document.getElementById('pyq-search').addEventListener('input', e => {
        pyqFilters.search = e.target.value.trim().toLowerCase();
        renderPyq();
    });
    renderPyq();
}

function renderPyq() {
    let list = PYQ_BANK.filter(q => {
        if (pyqFilters.exam !== 'all' && q.exam !== pyqFilters.exam) return false;
        if (pyqFilters.topic !== 'all' && q.topic !== pyqFilters.topic) return false;
        if (pyqFilters.difficulty !== 'all' && q.difficulty !== pyqFilters.difficulty) return false;
        if (pyqFilters.search && !(q.question + ' ' + q.topic).toLowerCase().includes(pyqFilters.search)) return false;
        return true;
    });
    document.getElementById('pyq-count').textContent = 'कुल ' + list.length + ' प्रश्न मिले';
    document.getElementById('pyq-detail').style.display = 'none';
    document.getElementById('pyq-list').style.display = 'grid';
    document.getElementById('pyq-list').innerHTML = list.map(q => `
        <div class="pyq-item" onclick="togglePyqSolution(${q.id})" role="button" tabindex="0">
            <div class="pyq-header">
                <span class="pyq-topic">${q.topic}</span>
                <span class="pyq-exam">${q.exam} ${q.year} • ${q.difficulty}</span>
            </div>
            <div class="pyq-question">${esc(q.question)}</div>
            <div class="pyq-options">${q.options.map((o, i) => String.fromCharCode(97 + i) + ') ' + esc(o)).join('  ')}</div>
            <span class="pyq-sol-toggle" id="pyq-toggle-${q.id}">💡 हल देखें (क्लिक करें)</span>
            <div class="pyq-solution" id="pyq-sol-${q.id}">
                ${q.solution.map((s, i) => `<div class="step"><b>चरण ${i + 1}:</b> ${esc(s)}</div>`).join('')}
                <div style="margin-top:.6rem; font-weight:800; color:var(--success);">✔ सही उत्तर: ${esc(q.answer)}</div>
                <div style="margin-top:.4rem; background:var(--primary-soft); border-radius:8px; padding:.5rem .8rem;">⚡ शॉर्टकट: ${esc(q.shortcut)}</div>
                <div class="pyq-trap-warn">⚠️ ट्रैप: ${esc(q.trap)}</div>
            </div>
        </div>`).join('') || '<div class="no-data">कोई प्रश्न नहीं मिला — फिल्टर बदलकर देखें</div>';
}

function togglePyqSolution(id) {
    const sol = document.getElementById('pyq-sol-' + id);
    const toggle = document.getElementById('pyq-toggle-' + id);
    const open = sol.classList.toggle('show');
    toggle.textContent = open ? '🙈 हल छिपाएँ' : '💡 हल देखें (क्लिक करें)';
    if (open && !state.pyqsSeen.includes(id)) {
        state.pyqsSeen.push(id);
        saveState();
        addXP(2);
    }
}

/* ================= पैटर्न इंजन ================= */
function renderPatterns() {
    document.getElementById('patterns-grid').innerHTML = PATTERNS.map(p => `
        <div class="pattern-card" onclick="toggleDetail('pattern-detail-${p.id}')" role="button" tabindex="0">
            <span class="pn">${p.type}</span>
            <h3>${p.name}</h3>
            <div class="row"><b>🔎 पहचान:</b> ${esc(p.signal)}</div>
            <div class="row"><b>💡 अवधारणा:</b> ${esc(p.concept)}</div>
            <div class="pattern-detail" id="pattern-detail-${p.id}">
                <div class="pd-box formula"><b>📌 सूत्र:</b><br>${esc(p.formula)}</div>
                <div class="pd-box pyq"><b>🎯 PYQ उदाहरण:</b><br>${p.pyqExamples.map(e => '• ' + esc(e)).join('<br>')}</div>
                <div class="pd-box"><b>🔀 रूपांतर:</b><br>${p.variants.map(v => '• ' + esc(v)).join('<br>')}</div>
                <div class="td-box detection" style="background:var(--error-soft); border-left:3px solid var(--error);"><b>⚠️ ट्रैप:</b> ${esc(p.trap)}</div>
            </div>
        </div>`).join('');
}

function toggleDetail(id) {
    document.getElementById(id).classList.toggle('show');
}

/* ================= ट्रैप बुक ================= */
function renderTraps() {
    document.getElementById('traps-grid').innerHTML = TRAPS.map(t => `
        <div class="trap-card" onclick="toggleDetail('trap-detail-${t.id}'); markTrapRead('${t.id}')" role="button" tabindex="0">
            <span class="trap-type">${t.type}</span>
            <h3>${t.title}</h3>
            <div class="row"><b>📌 उदाहरण:</b> ${esc(t.example)}</div>
            <div class="row"><b>❓ क्यों फँसते हैं:</b> ${esc(t.why)}</div>
            <div class="trap-detail" id="trap-detail-${t.id}">
                <div class="td-box detection"><b>🔎 पहचान:</b> ${esc(t.detection)}</div>
                <div class="td-box prevention"><b>✅ बचाव:</b> ${esc(t.prevention)}</div>
            </div>
        </div>`).join('');
}

function markTrapRead(id) {
    if (!state.trapsRead.includes(id)) {
        state.trapsRead.push(id);
        saveState();
        addXP(5);
    }
}

/* ================= एरर लॉग ================= */
function initErrorTopicSelect() {
    document.getElementById('error-topic').innerHTML = FORMULA_BOOK.map(ch => `<option>${ch.name}</option>`).join('');
}

function renderErrors() {
    const stats = document.getElementById('error-stats');
    stats.innerHTML = `
        <div class="error-stat"><b>${state.errorLog.length}</b><span>कुल गलतियाँ</span></div>
        <div class="error-stat"><b>${state.errorLog.filter(e => e.type === 'कॉन्सेप्ट की गलती').length}</b><span>कॉन्सेप्ट गलतियाँ</span></div>
        <div class="error-stat"><b>${state.errorLog.filter(e => e.type === 'कैलकुलेशन की गलती').length}</b><span>कैलकुलेशन गलतियाँ</span></div>
        <div class="error-stat"><b>${state.errorLog.filter(e => e.type === 'ट्रैप में फँसे').length}</b><span>ट्रैप में फँसे</span></div>`;
    const list = document.getElementById('error-list');
    document.getElementById('error-empty').style.display = state.errorLog.length ? 'none' : 'block';
    list.innerHTML = state.errorLog.slice().reverse().map(e => `
        <div class="error-item">
            <div class="ei-head">
                <span class="error-type-badge">${e.type}</span>
                <span style="font-size:.72rem; color:var(--text-muted);">${e.topic} • ${e.date}</span>
                <button class="ei-del" onclick="deleteError(${e.id})">🗑️ हटाएँ</button>
            </div>
            <div class="ei-desc">${esc(e.desc)}</div>
            ${e.lesson ? `<div class="ei-lesson">📚 सबक: ${esc(e.lesson)}</div>` : ''}
        </div>`).join('');
}

function openErrorModal() { document.getElementById('error-modal').style.display = 'flex'; }
function closeErrorModal() { document.getElementById('error-modal').style.display = 'none'; }
function saveErrorEntry() {
    const topic = document.getElementById('error-topic').value;
    const type = document.getElementById('error-type').value;
    const desc = document.getElementById('error-desc').value.trim();
    const lesson = document.getElementById('error-lesson').value.trim();
    if (!desc) { alert('कृपया गलती के बारे में लिखें!'); return; }
    state.errorLog.push({ id: Date.now(), topic, type, desc, lesson, date: todayKey() });
    saveState();
    document.getElementById('error-desc').value = '';
    document.getElementById('error-lesson').value = '';
    closeErrorModal();
    renderErrors();
    addXP(3);
}
function deleteError(id) {
    state.errorLog = state.errorLog.filter(e => e.id !== id);
    saveState();
    renderErrors();
}

/* ================= रिवीजन ================= */
function startRevision(type) {
    const wrap = document.getElementById('revision-content');
    if (type === 'weak') {
        const topics = {};
        state.errorLog.forEach(e => { topics[e.topic] = (topics[e.topic] || 0) + 1; });
        const weak = Object.entries(topics).sort((a, b) => b[1] - a[1]);
        wrap.innerHTML = weak.length ? weak.map(([t, n]) => `
            <div class="rev-item"><h4>📉 ${t} (${n} गलतियाँ)</h4>
            <p>इस टॉपिक के फॉर्मूले दोबारा पढ़ें और PYQ बैंक में इसके प्रश्न हल करें।</p>
            <button class="drill-btn" onclick="openChapter('${FORMULA_BOOK.find(c => c.name === t) ? FORMULA_BOOK.find(c => c.name === t).id : 'number-system'}')">📖 फॉर्मूले खोलें</button></div>`).join('')
            : '<div class="rev-item"><h4>🎉 कोई कमजोर टॉपिक नहीं!</h4><p>एरर लॉग खाली है — शानदार काम। प्रैक्टिस जारी रखें।</p></div>';
    } else if (type === 'errors') {
        wrap.innerHTML = state.errorLog.length ? state.errorLog.slice().reverse().map(e => `
            <div class="rev-item"><h4>❌ ${esc(e.desc)}</h4>
            <p><b>सबक:</b> ${esc(e.lesson || '—')}</p>
            <p style="font-size:.78rem; color:var(--text-muted);">${e.topic} • ${e.type}</p></div>`).join('')
            : '<div class="rev-item"><h4>🎉 एरर लॉग खाली है</h4><p>गलतियाँ दर्ज करें — रिवीजन यहीं से बनेगा।</p></div>';
    } else if (type === 'formulas') {
        const flat = FORMULA_BOOK.flatMap(ch => ch.formulas.slice(0, 4).map(f => ({ ch, f })));
        wrap.innerHTML = flat.map(({ ch, f }, i) => `
            <div class="rev-item"><h4>${ch.icon} ${f.name}</h4>
            <div class="fb-box formula" style="margin-top:.4rem;">${esc(f.rule)}</div></div>`).join('');
    } else if (type === 'patterns') {
        wrap.innerHTML = PATTERNS.map(p => `
            <div class="rev-item"><h4>🧠 ${p.name}</h4>
            <div class="fb-box formula" style="margin-top:.4rem;">${esc(p.formula)}</div>
            <p style="font-size:.82rem; margin-top:.4rem;">⚠️ ${esc(p.trap)}</p></div>`).join('');
    }
}

/* ================= एग्जाम इंफो ================= */
function renderExams() {
    document.getElementById('exam-cards').innerHTML = EXAMS.map(e => `
        <div class="exam-card" onclick="openExamDetail('${e.id}')" role="button" tabindex="0">
            <span class="ec-badge ${e.badge === 'SSC' ? 'badge-ssc' : 'badge-rrb'}">${e.badge}</span>
            <h3>${e.name}</h3>
            <p>${e.short}</p>
            <div class="ec-tags">${e.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
        </div>`).join('');
    document.getElementById('exam-tips-list').innerHTML = EXAM_TIPS.map(t => `<li>${t}</li>`).join('');
    document.getElementById('exam-detail').style.display = 'none';
}

function openExamDetail(id) {
    const e = EXAMS.find(x => x.id === id);
    if (!e) return;
    document.getElementById('exam-cards').style.display = 'none';
    const d = document.getElementById('exam-detail');
    d.style.display = 'block';
    d.innerHTML = `
        <button class="back-btn" onclick="document.getElementById('exam-detail').style.display='none'; document.getElementById('exam-cards').style.display='grid';">← सभी परीक्षाएँ</button>
        <div class="exam-detail">
            <span class="ec-badge ${e.badge === 'SSC' ? 'badge-ssc' : 'badge-rrb'}">${e.badge}</span>
            <h3>${e.name}</h3>
            <p>${e.overview}</p>
            <h4>📐 गणित का वेटेज (Topic-wise)</h4>
            <div class="ed-note">${esc(e.mathsWeightage)}</div>
            ${e.structure.map(s => `
                <h4>${s.title}</h4>
                ${s.note ? `<div class="ed-note">${esc(s.note)}</div>` : ''}
                ${s.table ? `<table class="exam-table"><thead><tr>${s.table.head.map(h => `<th>${h}</th>`).join('')}</tr></thead>
                <tbody>${s.table.rows.map(r => `<tr>${r.map((c, i) => i === 0 ? `<td><b>${c}</b></td>` : `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>` : ''}
                ${s.marking ? `<p style="font-size:.9rem;"><b>अंकन:</b> ${esc(s.marking)}</p>` : ''}`).join('')}
            <h4>📚 सिलेबस</h4>
            <ul>${e.syllabus.map(s => `<li>${esc(s)}</li>`).join('')}</ul>
            <h4>🗓️ तारीखें (2025-26 चक्र)</h4>
            <ul>${e.dates.map(dt => `<li>${esc(dt)}</li>`).join('')}</ul>
            <h4>🎯 तैयारी की रणनीति</h4>
            <div class="ed-note">${esc(e.strategy)}</div>
        </div>`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ================= 90-दिन प्लान ================= */
function initPlan() {
    const tabs = document.getElementById('plan-tabs');
    tabs.innerHTML = `
        <button class="plan-tab active" onclick="showPlan('phases', this)">📆 6 चरण</button>
        <button class="plan-tab" onclick="showPlan('routine', this)">⏰ रोज़ का रूटीन</button>`;
    showPlan('phases', tabs.querySelector('.plan-tab'));
}
function showPlan(mode, btn) {
    document.querySelectorAll('.plan-tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    const wrap = document.getElementById('plan-content');
    if (mode === 'phases') {
        wrap.innerHTML = PLAN_PHASES.map(p => `
            <div class="phase-card"><h3>${p.name}</h3><div class="phase-sub">${p.sub}</div>
            <ul>${p.items.map(i => `<li>${esc(i)}</li>`).join('')}</ul></div>`).join('');
    } else {
        wrap.innerHTML = DAILY_ROUTINE.map(r => `
            <div class="day-task"><h4>${r.time} — ${r.title}</h4>
            <ul>${r.items.map(i => `<li>${esc(i)}</li>`).join('')}</ul></div>`).join('');
    }
}

/* ================= प्रोफाइल ================= */
function updateProfile() {
    const lvl = LEVELS.filter(l => state.xp >= l.xp).pop();
    const next = LEVELS[LEVELS.indexOf(lvl) + 1];
    document.getElementById('profile-level-name').textContent = lvl.name;
    let fill = 100;
    if (next) {
        fill = Math.round((state.xp - lvl.xp) / (next.xp - lvl.xp) * 100);
        document.getElementById('profile-next-level').textContent = (next.xp - state.xp) + ' XP और (' + next.name + ')';
    } else {
        document.getElementById('profile-next-level').textContent = 'आप सबसे ऊँचे स्तर पर हैं! 👑';
    }
    document.getElementById('profile-progress-fill').style.width = fill + '%';
    document.getElementById('profile-xp').textContent = state.xp;
    document.getElementById('profile-questions').textContent = state.questions;
    document.getElementById('profile-accuracy').textContent = getAccuracy() + '%';

    const stats = {
        xp: state.xp, questions: state.questions, correct: state.correct,
        accuracy: getAccuracy(), streak: getStreak(), totalSets: Object.keys(state.sets).length,
        bestSet: state.bestSet, bestMock: state.bestMock, bestDrill: getBestDrill(),
        chaptersRead: state.chaptersRead.length, trapsRead: state.trapsRead.length, pyqsSeen: state.pyqsSeen.length
    };
    document.getElementById('achievements-list').innerHTML = '<h4>🏅 उपलब्धियाँ (' +
        ACHIEVEMENTS.filter(a => a.check(stats)).length + '/' + ACHIEVEMENTS.length + ')</h4>' +
        ACHIEVEMENTS.map(a => {
            const got = a.check(stats);
            return `<span class="achievement ${got ? '' : 'locked'}">${a.icon} ${a.name} — ${a.desc}</span>`;
        }).join('');
}

function resetAllData() {
    if (confirm('⚠️ क्या आप पक्का सारा डेटा (XP, स्ट्रीक, एरर लॉग, सब कुछ) मिटाना चाहते हैं?')) {
        localStorage.removeItem(LS_KEY);
        state = loadState();
        updateDashboard();
        updateProfile();
        renderDailyHeader();
        renderErrors();
        renderFormulaChapters();
        renderCalcLevel();
        renderDrillSelect();
        alert('सारा डेटा रीसेट हो गया। नई शुरुआत की शुभकामनाएँ! 🌱');
    }
}

/* ================= सहायक ================= */
function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>');
}

/* ================= बूट ================= */
document.addEventListener('DOMContentLoaded', function () {
    initTheme();
    initNav();
    initFormulaSearch();
    initCalculation();
    initPyq();
    initErrorTopicSelect();
    initPlan();

    updateDashboard();
    renderLearn();
    renderFormulaChapters();
    renderPatterns();
    renderTraps();
    renderErrors();
    renderExams();
    renderDailyHeader();
    updateProfile();
});
