/* ============================================================
   गणित गुरु — मुख्य ऐप इंजन
   नेविगेशन, डैशबोर्ड, फॉर्मूला बुक, कैलकुलेशन बूस्टर (ड्रिल सहित),
   डेली प्रैक्टिस, PYQ, पैटर्न/ट्रैप, एरर लॉग, रिवीजन, एग्जाम,
   90-दिन प्लान, प्रोफाइल — सब कुछ localStorage में सेव होता है
   ============================================================ */

'use strict';

/* ================= उपयोगकर्ता (नाम से लॉगिन, लॉगआउट तक सेव) ================= */
const LS_KEY = 'ganit-guru-state';          // पुराना shared key (legacy/migration fallback)
const LS_USER = 'gg-current-user';          // अभी लॉगिन उपयोगकर्ता का नाम
const LS_USERS = 'gg-users-list';           // अब तक के सभी उपयोगकर्ता
function stateKeyFor(name) { return 'gg-state-' + String(name || '').trim().toLowerCase(); }
function currentUser() {
    try { return localStorage.getItem(LS_USER); } catch (e) { return null; }
}
function getUsersList() {
    try { return JSON.parse(localStorage.getItem(LS_USERS) || '[]'); } catch (e) { return []; }
}
function rememberUser(name) {
    const list = getUsersList().filter(u => u.toLowerCase() !== name.toLowerCase());
    list.unshift(name);
    try {
        localStorage.setItem(LS_USERS, JSON.stringify(list.slice(0, 8)));
        localStorage.setItem(LS_USER, name);
    } catch (e) { /* ignore */ }
}

/* ================= स्टेट (localStorage, प्रति-उपयोगकर्ता) ================= */
const DEFAULT_STATE = {
    xp: 0,
    questions: 0,
    correct: 0,
    sets: {},            // { 'YYYY-MM-DD': { score, total } }
    bestDrill: {},       // { genName: score }
    drillHistory: [],    // [{ gen, score, correct, wrong, sec, diff, date }]
    calcWorkout: {},     // { 'YYYY-MM-DD': { score, total, sec, best:boolean } }
    errorLog: [],        // { id, topic, type, desc, lesson, date }
    chaptersRead: [],
    trapsRead: [],
    pyqsSeen: [],
    bestSet: 0,
    bestMock: 0,
    quizDone: 0,
    flashKnown: 0,
    notesRead: [],
    masterySteps: {},     // { chapterId: ['concept','formula','practice','test'] }
    masteryAwarded: [],   // XP is awarded once per chapter/stage
    tricksRead: [],       // fast-making playbooks opened
    trickTrainerBest: 0,
    trickTrainerAttempts: 0,
    joinedAt: null,
    challenge: { start: null, done: {}, checks: {}, rewards: [] }  // 90-दिन चैलेंज
};

let state = loadState();

function normalizeState(s) {
    const out = Object.assign({}, DEFAULT_STATE, s);
    out.challenge = Object.assign({ start: null, done: {}, checks: {}, rewards: [] }, (s && s.challenge) || {});
    if (!out.challenge.done || typeof out.challenge.done !== 'object') out.challenge.done = {};
    if (!out.challenge.checks || typeof out.challenge.checks !== 'object') out.challenge.checks = {};
    if (!Array.isArray(out.challenge.rewards)) out.challenge.rewards = [];
    out.xp = Math.max(0, parseInt(out.xp, 10) || 0);
    out.questions = Math.max(0, parseInt(out.questions, 10) || 0);
    out.correct = Math.max(0, parseInt(out.correct, 10) || 0);
    ['notesRead', 'errorLog', 'chaptersRead', 'trapsRead', 'pyqsSeen', 'masteryAwarded', 'tricksRead'].forEach(k => {
        if (!Array.isArray(out[k])) out[k] = [];
    });
    ['sets', 'bestDrill', 'masterySteps'].forEach(k => {
        if (!out[k] || typeof out[k] !== 'object' || Array.isArray(out[k])) out[k] = {};
    });
    out.drillHistory = Array.isArray(out.drillHistory) ? out.drillHistory.slice(0, 60) : [];
    if (!out.calcWorkout || typeof out.calcWorkout !== 'object' || Array.isArray(out.calcWorkout)) out.calcWorkout = {};
    return out;
}

function loadState() {
    const u = currentUser();
    if (u) {
        try {
            const raw = localStorage.getItem(stateKeyFor(u));
            if (raw) return normalizeState(JSON.parse(raw));
        } catch (e) { /* ignore */ }
        // पहली बार लॉगिन: पुराना shared डेटा migrate करें ताकि progress न मिटे
        try {
            const legacy = localStorage.getItem(LS_KEY);
            if (legacy) { localStorage.setItem(stateKeyFor(u), legacy); return normalizeState(JSON.parse(legacy)); }
        } catch (e) { /* ignore */ }
        return normalizeState({ joinedAt: todayKey() });
    }
    try {
        const raw = localStorage.getItem(LS_KEY);
        if (raw) return normalizeState(JSON.parse(raw));
    } catch (e) { /* ignore */ }
    return normalizeState({});
}
function saveState() {
    try {
        const u = currentUser();
        localStorage.setItem(u ? stateKeyFor(u) : LS_KEY, JSON.stringify(state));
    } catch (e) { /* ignore */ }
}
function addXP(n) { state.xp += n; saveState(); updateDashboard(); updateProfile(); updateTopbarChips(); }

function todayKey(offsetDays) {
    const d = new Date();
    if (offsetDays) d.setDate(d.getDate() + offsetDays);
    return d.toISOString().slice(0, 10);
}

/* ================= मर्ज किया डेटा (curated + featured + legacy) ================= */
function legacyPyqToFull(q, srcName) {
    const opts = q.o || [];
    const letters = (q.ol && q.ol.length === opts.length) ? q.ol : opts.map((_, i) => 'abcd'[i]);
    const ai = letters.indexOf(q.a);
    return {
        id: q.id, question: q.q, options: opts, optLetters: letters,
        answer: ai >= 0 ? opts[ai] : '', answerLetter: q.a || '',
        solution: q.sol ? [q.sol] : [], shortcut: '', trap: '',
        exam: q.e || '', year: (q.y === '' || q.y == null) ? '' : String(q.y),
        topic: q.t || 'विविध', difficulty: q.d || 'मध्यम', pattern: '',
        lang: q.lang || 'en', src: srcName || 'legacy', solLang: q.sol ? 'en' : ''
    };
}

const PYQ_ALL = PYQ_BANK.map(q => Object.assign({}, q, {
    year: String(q.year || ''), lang: q.lang || 'hi', src: 'curated', optLetters: null, answerLetter: ''
})).concat(
    (typeof PYQ_FEATURED !== 'undefined' ? PYQ_FEATURED : []).map(q => Object.assign({}, q, {
        year: String(q.year || ''), lang: q.lang || 'hi', src: 'featured', optLetters: null, answerLetter: ''
    })),
    (typeof PYQ_BANK_LEGACY !== 'undefined' ? PYQ_BANK_LEGACY : []).map(q => legacyPyqToFull(q, 'legacy')),
    (typeof PYQ_BANK_PDF !== 'undefined' ? PYQ_BANK_PDF : []).map(q => legacyPyqToFull(q, 'pdf'))
);

const PATTERNS_ALL = PATTERNS.map(p => Object.assign({}, p, { src: 'curated' })).concat(
    (typeof PATTERNS_LEGACY !== 'undefined' ? PATTERNS_LEGACY : []).map(p => Object.assign({}, p, { src: 'legacy' }))
);

const FLASH_ALL = (typeof FLASHCARDS !== 'undefined' ? FLASHCARDS : []);
const NOTES_ALL = (typeof STUDY_NOTES !== 'undefined' ? STUDY_NOTES : []);
const MASTERY_ALL = (typeof MASTERY !== 'undefined' ? MASTERY : { topics: [], master: null });

/* ================= थीम ================= */
function initTheme() {
    const saved = localStorage.getItem('ganit-guru-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (saved === 'dark' || (!saved && prefersDark)) setTheme('dark'); else setTheme('light');
    document.getElementById('theme-toggle').addEventListener('click', () => {
        const cur = document.documentElement.getAttribute('data-theme');
        setTheme(cur === 'dark' ? 'light' : 'dark');
    });
}
function setTheme(t) {
    // Theme is kept on the root element so CSS variables, browser chrome and
    // dynamically rendered content all switch together.
    document.documentElement.setAttribute('data-theme', t);
    document.body.setAttribute('data-theme', t);
    document.documentElement.style.colorScheme = t;
    document.getElementById('moon-icon').style.display = t === 'dark' ? 'block' : 'none';
    document.getElementById('sun-icon').style.display = t === 'dark' ? 'none' : 'block';
    localStorage.setItem('ganit-guru-theme', t);
}

/* ================= नेविगेशन (साइडबार + टॉपबार) ================= */
const SECTION_LABELS = {
    dashboard: '📊 डैशबोर्ड', challenge: '🔥 90-दिन चैलेंज', learn: '📚 सीखें',
    formulas: '📖 फॉर्मूला बुक', calculation: '🧮 कैलकुलेशन बूस्टर', 'fast-tricks': '⚡ फास्ट ट्रिक्स',
    daily: '📅 डेली प्रैक्टिस', quiz: '🎮 क्विज़', pyq: '🗂️ PYQ बैंक', flashcards: '🃏 फ्लैशकार्ड',
    notes: '📓 नोट्स', patterns: '🧠 पैटर्न इंजन', traps: '🛡️ ट्रैप बुक', mastery: '🏆 मास्टरी',
    'error-log': '❌ एरर लॉग', revision: '🔄 रिवीजन', timer: '⏱️ टाइमर',
    'pdf-research': '🔬 PDF रिसर्च', exams: '🏛️ एग्जाम इंफो', plan: '🗓️ रणनीति प्लान', profile: '👤 प्रोफाइल'
};

function initNav() {
    const menuBtn = document.getElementById('menu-toggle');
    if (menuBtn) menuBtn.addEventListener('click', () => document.body.classList.toggle('drawer-open'));
    const scrim = document.getElementById('drawer-scrim');
    if (scrim) scrim.addEventListener('click', () => document.body.classList.remove('drawer-open'));

    document.querySelectorAll('.side-nav a').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            openSection(link.getAttribute('data-section'));
            document.body.classList.remove('drawer-open');
        });
    });

    // फुटर लिंक भी सेक्शन खोलें
    document.querySelectorAll('.footer-links a').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const href = link.getAttribute('href') || '';
            if (href.charAt(0) === '#') openSection(href.slice(1));
        });
    });

    // onclick वाले कार्ड भी कीबोर्ड से चलें; Escape से खुले UI बंद हों।
    document.addEventListener('keydown', e => {
        if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[role="button"]')) {
            e.preventDefault();
            e.target.click();
        }
        if (e.key === 'Escape') {
            document.body.classList.remove('drawer-open');
            const modal = document.getElementById('error-modal');
            if (modal && modal.style.display !== 'none') closeErrorModal();
        }
    });

    // ब्राउज़र Back/Forward और सीधे #section लिंक को सपोर्ट करें।
    window.addEventListener('popstate', () => openSection(window.location.hash.slice(1) || 'dashboard', false));
    window.addEventListener('hashchange', () => openSection(window.location.hash.slice(1) || 'dashboard', false));
}

function openSection(name, updateUrl = true) {
    const target = document.getElementById(name);
    if (!target || !target.classList.contains('section')) return;
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    target.classList.add('active');
    document.querySelectorAll('.side-nav a').forEach(a =>
        a.classList.toggle('active', a.getAttribute('data-section') === name));
    const tb = document.getElementById('topbar-title');
    if (tb) tb.textContent = SECTION_LABELS[name] || 'गणित गुरु';
    if (name === 'challenge') renderChallenge();
    if (updateUrl && window.location && window.location.hash !== '#' + name) {
        try { window.history.pushState(null, '', '#' + name); }
        catch (e) { window.location.hash = name; }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ================= टॉपबार चिप्स (स्ट्रीक + XP) ================= */
function updateTopbarChips() {
    const st = document.getElementById('chip-streak');
    if (st) st.textContent = getStreak();
    const xp = document.getElementById('chip-xp');
    if (xp) xp.textContent = state.xp || 0;
    const hs = document.getElementById('hero-streak');
    if (hs) hs.textContent = getStreak();
}

/* ================= उपयोगकर्ता मोडल (नाम पूछें/सेव करें) ================= */
function initUserModal() {
    const modal = document.getElementById('user-modal');
    if (!modal) return;
    const input = document.getElementById('user-name-input');
    const hint = document.getElementById('user-modal-hint');
    const chipsBox = document.getElementById('user-quick-list');

    const users = getUsersList();
    if (users.length && chipsBox) {
        chipsBox.innerHTML = '<p class=\"um-quick-label\">🙋 पहले से मौजूद हैं:</p><div class=\"um-chips\">' +
            users.map(u => `<button class=\"um-chip\" data-u=\"${esc(u)}\">${esc(u)}</button>`).join('') + '</div>';
        chipsBox.querySelectorAll('.um-chip').forEach(b => b.addEventListener('click', () => loginUser(b.getAttribute('data-u'))));
    }
    document.getElementById('user-name-save').addEventListener('click', () => {
        const name = (input.value || '').trim();
        if (name.length < 2) { hint.textContent = 'कम-से-कम 2 अक्षर लिखें 🙏'; input.focus(); return; }
        if (name.length > 24) { hint.textContent = 'नाम 24 अक्षरों से छोटा रखें'; input.focus(); return; }
        loginUser(name);
    });
    input.addEventListener('keydown', e => { if (e.key === 'Enter') document.getElementById('user-name-save').click(); });

    if (!currentUser()) {
        modal.style.display = 'flex';
        document.body.classList.add('locked');
        setTimeout(() => input.focus(), 250);
    } else {
        modal.style.display = 'none';
        document.body.classList.remove('locked');
        refreshUserChrome();
    }
}

function loginUser(name) {
    rememberUser(name);
    state = loadState();
    if (!state.joinedAt) { state.joinedAt = todayKey(); saveState(); }
    const modal = document.getElementById('user-modal');
    if (modal) modal.style.display = 'none';
    document.body.classList.remove('locked');
    refreshAllViews();
    refreshUserChrome();
}

function logoutUser() {
    if (!confirm('लॉगआउट करें? आपकी सारी progress इसी डिवाइस पर सुरक्षित रहेगी — दोबारा नाम डालकर वहीं से शुरू कर सकते हैं।')) return;
    try { localStorage.removeItem(LS_USER); } catch (e) { /* ignore */ }
    location.reload();
}

function userInitial(name) {
    const s = String(name || 'ग').trim();
    return s.charAt(0).toUpperCase();
}

function refreshUserChrome() {
    const u = currentUser();
    const nameEl = document.getElementById('side-user-name');
    if (nameEl) nameEl.textContent = u || 'अतिथि';
    const av = document.getElementById('side-user-avatar');
    if (av) av.textContent = userInitial(u);
    const lvl = document.getElementById('side-user-level');
    if (lvl) {
        const L = LEVELS.filter(l => state.xp >= l.xp).pop();
        lvl.textContent = L ? L.name.replace(/^\S+\s/, '') : 'शुरुआती';
    }
    const ring = document.getElementById('side-user-xpbar');
    if (ring) ring.style.width = Math.min(100, state.xp % 100) + '%';
    updateTopbarChips();
    updateDashboard();
}

/* ================= डैशबोर्ड ================= */
function getAccuracy() {
    if (!state.questions) return 0;
    return Math.round(state.correct / state.questions * 100);
}
function getMastery() {
    const totalChapters = Math.max(FORMULA_BOOK.length, 1);
    const readScore = Math.min(state.chaptersRead.length / totalChapters, 1) * 20;
    const doneSteps = Object.values(state.masterySteps || {}).reduce((n, steps) => n + new Set(steps).size, 0);
    const stepScore = Math.min(doneSteps / (totalChapters * 4), 1) * 30;
    const xpScore = Math.min(state.xp / 1500, 1) * 20;
    const accuracyScore = getAccuracy() * 0.3;
    return Math.round(readScore + stepScore + xpScore + accuracyScore);
}

function chapterMastery(id) {
    const steps = new Set((state.masterySteps && state.masterySteps[id]) || []);
    return Math.round(steps.size / 4 * 100);
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

function hindiGreeting() {
    const h = new Date().getHours();
    if (h < 12) return '🌅 सुप्रभात';
    if (h < 17) return '☀️ शुभ दोपहर';
    if (h < 21) return '🌇 शुभ संध्या';
    return '🌙 शुभ रात्रि';
}
const DASH_QUOTES = [
    'प्रतिदिन छोटी-छोटी progress = 90 दिन बाद बड़ा परिणाम।',
    'स्पीड तभी आती है जब नींव पक्की हो — आज भी कैलकुलेशन ड्रिल मत छोड़ें।',
    'गलती दर्ज नहीं की तो गलती दोहराई जाएगी।',
    'Formula रटना नहीं, समझना — exam hall में समझ ही काम आती है।',
    'PYQ आपके सबसे अच्छे शिक्षक हैं — रोज़ थोड़ा, लगातार।',
    'Challenge का असली इनाम: परीक्षा हॉल का आत्मविश्वास।'
];

function updateDashboard() {
    document.getElementById('overall-mastery-value').textContent = getMastery() + '%';
    document.getElementById('pyqs-analysed-value').textContent = state.questions;
    document.getElementById('topics-mastered-value').textContent = FORMULA_BOOK.filter(ch => chapterMastery(ch.id) === 100).length;
    document.getElementById('accuracy-value').textContent = getAccuracy() + '%';
    document.getElementById('speed-value').textContent = getBestDrill();
    document.getElementById('streak-value').textContent = getStreak();

    // हीरो — नाम, तारीख, चैलेंज स्थिति
    const u = currentUser();
    const greet = document.getElementById('hero-greet');
    if (greet) greet.innerHTML = hindiGreeting() + (u ? ', <b>' + esc(u) + '</b>' : '') + ' 👋';
    const dateEl = document.getElementById('hero-date');
    if (dateEl) {
        const now = new Date();
        const days = ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'];
        const months = ['जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'];
        dateEl.textContent = days[now.getDay()] + ', ' + now.getDate() + ' ' + months[now.getMonth()] + ' ' + now.getFullYear();
    }
    const quoteEl = document.getElementById('hero-quote');
    if (quoteEl) quoteEl.textContent = '💡 ' + DASH_QUOTES[new Date().getDate() % DASH_QUOTES.length];

    renderChallengeMini();

    // आज का फोकस — चैलेंज चालू हो तो चैलेंज ड्रिव्हन, नहीं तो सामान्य
    const cd = challengeCurrentDay();
    const focus = document.getElementById('today-focus-content');
    if (state.challenge.start && cd) {
        const day = CHALLENGE_90_DATA[cd - 1];
        if (day && !state.challenge.done[cd]) {
            focus.innerHTML = '<p>🔥 आज चैलेंज का <b>दिन ' + cd + '</b> है — <b>' + esc(day.title) + '</b></p><ul>' +
                day.tasks.slice(0, 3).map(t => '<li>' + t.i + ' ' + esc(t.t) + '</li>').join('') +
                '<li class="tf-more">⭐ पूरी चेकलिस्ट चैलेंज पेज पर देखें</li></ul>';
        } else {
            focus.innerHTML = '<p>✅ आज का चैलेंज दिन पूरा! अब गेहराई वाला काम:</p><ul><li>🧮 कैलकुलेशन ड्रिल के 2 राउंड — अपना रिकॉर्ड तोड़ें</li><li>🃏 भूले हुए फ्लैशकार्ड दोहराएँ</li><li>🗂️ PYQ बैंक से अपने कमज़ोर टॉपिक के 10 प्रश्न</li></ul>';
        }
    } else {
        const dow = new Date().getDay();
        let f;
        if (dow === 0) {
            f = '<p>आज <b>रविवार</b> है — साप्ताहिक मॉक का दिन! 🎯</p><ul><li>📝 20 प्रश्नों का मॉक (डेली प्रैक्टिस में)</li><li>🔄 इस हफ्ते का एरर लॉग पूरा दोहराएँ</li><li>📖 इस हफ्ते के फॉर्मूले बिना देखे बोलें</li></ul>';
        } else {
            const topic = LEARN_TOPICS[(dow + (new Date().getDate() % 5)) % LEARN_TOPICS.length];
            f = '<p>आज का टॉपिक: <b>' + topic.name + '</b></p><ul><li>📖 फॉर्मूला बुक में "' + topic.name + '" अध्याय पढ़ें</li><li>🗂️ PYQ बैंक में "' + topic.name + '" के प्रश्न हल करें</li><li>🧮 कैलकुलेशन बूस्टर की रोज़ की ड्रिल न भूलें</li></ul>';
        }
        focus.innerHTML = f;
    }
    updateTopbarChips();
}

/* ================= सीखें (Learn) ================= */
function renderLearn(filter = '') {
    const grid = document.getElementById('learn-cards');
    const q = filter.trim().toLowerCase();
    const topics = LEARN_TOPICS.filter(t => !q || (t.name + ' ' + t.desc + ' ' + t.tags.join(' ')).toLowerCase().includes(q));
    const formulaCount = FORMULA_BOOK.reduce((n, ch) => n + ch.formulas.length, 0);
    const completed = FORMULA_BOOK.filter(ch => chapterMastery(ch.id) === 100).length;
    document.getElementById('learn-overview').innerHTML = `
        <div><b>${FORMULA_BOOK.length}</b><span>पूर्ण अध्याय</span></div>
        <div><b>${formulaCount}+</b><span>गहरे फॉर्मूले</span></div>
        <div><b>${DAILY_BANK.length}+</b><span>Practice Questions</span></div>
        <div><b>${completed}/${FORMULA_BOOK.length}</b><span>100% Mastered</span></div>`;
    grid.innerHTML = topics.map(t => {
        const ch = FORMULA_BOOK.find(c => c.id === t.chapter);
        const g = (typeof TOPIC_GUIDES !== 'undefined' ? TOPIC_GUIDES : []).find(x => x.id === t.id);
        const mastery = chapterMastery(t.chapter);
        const fc = ch ? `<span class="learn-badge">📖 ${ch.formulas.length} फॉर्मूले</span>` : '<span class="learn-badge soon">⏳ जल्द आ रहा</span>';
        const wt = g ? `<span class="learn-badge wt">⚖️ CGL-T1: ${g.exams.cgl1} • T2: ${g.exams.cgl2}</span>` : '';
        return `
        <div class="learn-card" onclick="openChapter('${t.chapter}')" role="button" tabindex="0">
            <div class="lc-icon">${t.icon}</div>
            <h4>${t.name}</h4>
            <p>${t.desc}</p>
            <div class="learn-badges">${fc}${wt}<span class="learn-badge mastery">🏆 ${mastery}% mastery</span></div>
            <div class="mini-progress"><span style="width:${mastery}%"></span></div>
            <div class="tags">${t.tags.map(x => `<span class="tag">${x}</span>`).join('')}</div>
        </div>`;
    }).join('') || '<div class="no-data">इस खोज से कोई टॉपिक नहीं मिला। दूसरा शब्द आज़माएँ।</div>';
}

function initLearnSearch() {
    document.getElementById('learn-search').addEventListener('input', e => renderLearn(e.target.value));
}

const MASTERY_STAGES = [
    ['concept', '🧠 कॉन्सेप्ट समझा'],
    ['formula', '📖 फॉर्मूला Recall'],
    ['practice', '✍️ Timed Practice'],
    ['test', '🎯 Chapter Test 90%+']
];

function masteryTrackerHtml(chapterId) {
    const done = new Set((state.masterySteps && state.masterySteps[chapterId]) || []);
    return `<div class="chapter-mastery">
        <div class="chapter-mastery-head"><h3>🏆 Chapter Mastery Tracker</h3><b>${chapterMastery(chapterId)}%</b></div>
        <p>हर चरण ईमानदारी से पूरा करने के बाद टिक करें। लक्ष्य: चारों चरण + timed revision.</p>
        <div class="mastery-stage-grid">${MASTERY_STAGES.map(([id, label]) => `
            <button class="mastery-stage ${done.has(id) ? 'done' : ''}" onclick="toggleMasteryStep('${chapterId}','${id}')">
                ${done.has(id) ? '✅' : '⬜'} ${label}
            </button>`).join('')}</div>
    </div>`;
}

function toggleMasteryStep(chapterId, step) {
    if (!state.masterySteps) state.masterySteps = {};
    const steps = new Set(state.masterySteps[chapterId] || []);
    const wasDone = steps.has(step);
    if (wasDone) steps.delete(step); else steps.add(step);
    state.masterySteps[chapterId] = [...steps];
    const awardKey = chapterId + ':' + step;
    if (!state.masteryAwarded) state.masteryAwarded = [];
    if (!wasDone && !state.masteryAwarded.includes(awardKey)) {
        state.masteryAwarded.push(awardKey);
        state.xp += 15;
    }
    saveState();
    openChapter(chapterId);
    renderLearn(document.getElementById('learn-search').value);
    updateDashboard();
    updateProfile();
}

/* टॉपिक गाइड पैनल (अध्याय के ऊपर): वेटेज + प्रश्न-प्रकार + ट्रैप + प्लान */
function guidePanelHtml(g) {
    if (!g) return '';
    return `
    <div class="guide-panel">
        <h3>📊 परीक्षा-वाइज़ वेटेज (पिछले वर्षों के विश्लेषण से)</h3>
        <div class="wt-table">
            <div><b>CGL Tier 1</b><span>${g.exams.cgl1} प्रश्न</span></div>
            <div><b>CGL Tier 2</b><span>${g.exams.cgl2} प्रश्न</span></div>
            <div><b>CHSL</b><span>${g.exams.chsl} प्रश्न</span></div>
            <div><b>NTPC</b><span>${g.exams.ntpc} प्रश्न</span></div>
            <div><b>Group D</b><span>${g.exams.groupd} प्रश्न</span></div>
        </div>
        <h3>🎯 पूछे जाने वाले प्रश्न-प्रकार</h3>
        ${g.types.map((x, i) => `<div class="gtype"><b>${i + 1}. ${esc(x.t)}</b><br>🔎 पहचान: ${esc(x.p)}<br>✏️ ${esc(x.e)}</div>`).join('')}
        <h3>⚠️ ट्रैप</h3>
        <ul>${g.traps.map(x => `<li>${esc(x)}</li>`).join('')}</ul>
        <h3>🗓️ 5-दिन माइक्रो-प्लान</h3>
        <ul>${g.plan.map(x => `<li>${esc(x)}</li>`).join('')}</ul>
        <div class="pd-box pyq">📚 <b>स्रोत:</b> ${esc(g.books)}<br>🏁 <b>लक्ष्य:</b> ${esc(g.target)}</div>
        <h3>📖 सिलेबस चेकलिस्ट</h3>
        <div class="tags">${g.syllabus.map(x => `<span class="tag">${esc(x)}</span>`).join('')}</div>
    </div>`;
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
    openSection('formulas'); // सीखें/रिवीजन से क्लिक पर फॉर्मूला सेक्शन पर ले जाएँ
    const detail = document.getElementById('formula-detail');
    detail.style.display = 'block';
    const gd = (typeof TOPIC_GUIDES !== 'undefined' ? TOPIC_GUIDES : []).find(x => x.id === id);
    detail.innerHTML = `
        <button class="back-btn" onclick="renderFormulaChapters()">← सभी अध्याय</button>
        <h3 style="font-weight:800; font-size:1.4rem; margin-bottom:.4rem;">${ch.icon} ${ch.name}</h3>
        <p class="muted" style="margin-bottom:1rem;">${ch.desc} — उपविषय: ${ch.subtopics.join(', ')}</p>
        ${masteryTrackerHtml(ch.id)}
        ${guidePanelHtml(gd)}
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

/* -------- स्पीड ड्रिल इंजन (कठिनाई-स्तर + इतिहास + लक्ष्य सहित) -------- */
const DRILLS = [
    { gen: 'tables', name: '🎲 पहाड़े', desc: '2-30 तक के गुणा', target: 15 },
    { gen: 'squares', name: '🔲 वर्ग (1-60)', desc: 'n² बोलिए', target: 12 },
    { gen: 'cubes', name: '🧊 घन (1-20)', desc: 'n³ याद/निकालिए', target: 12 },
    { gen: 'fracPercent', name: '💯 भिन्न ↔ %', desc: '1/2 = ?%', target: 15 },
    { gen: 'addSub', name: '➕ जोड़-घटाव', desc: '2-3 अंकीय', target: 15 },
    { gen: 'chainAdd', name: '⛓️ जंजीरी जोड़', desc: '4-6 संख्याएँ एक साथ', target: 10 },
    { gen: 'twoDigitMul', name: '✖️ दो अंकीय गुणा', desc: '20-99 × 20-99', target: 10 },
    { gen: 'baseMul', name: '🎯 100-आधार गुणा', desc: '90-110 के बीच', target: 12 },
    { gen: 'successive', name: '📉 सतत %', desc: 'a% फिर b%', target: 10 },
    { gen: 'percentCalc', name: '💹 % के सवाल', desc: 'x का y%', target: 12 },
    { gen: 'series', name: '🔢 श्रेणी योग', desc: '1 से n, वर्ग, घन', target: 8 },
    { gen: 'sqrt', name: '√ वर्गमूल', desc: 'पूर्ण वर्ग 1000-10000', target: 10 },
    { gen: 'cubeRoot', name: '∛ घनमूल', desc: 'पूर्ण घन से जड़ तक', target: 10 },
    { gen: 'unitDigit', name: '🔚 इकाई अंक', desc: 'aᵇ का इकाई अंक', target: 12 },
    { gen: 'remainder', name: '➗ शेषफल', desc: '(n−1)ᵏ ÷ n', target: 8 },
    { gen: 'mixedSprint', name: '⚡ मिक्स्ड स्प्रिंट', desc: 'सब कुछ मिलाकर — असली परीक्षण', target: 12 }
];

function renderDrillSelect() {
    document.getElementById('drill-select').innerHTML = DRILLS.map(d => {
        const best = state.bestDrill[d.gen] || 0;
        const tgt = d.target || 12;
        const done = best >= tgt;
        return `<button class="drill-btn ${done ? 'done' : ''}" onclick="startDrill('${d.gen}')" title="${esc(d.desc)} — लक्ष्य: ${tgt} सही/60से">
            ${d.name} <small>${done ? '✅' : '🏆 ' + best + '/' + tgt}</small></button>`;
    }).join('');
}

function rnd(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }

/* संख्या को सुंदर घात-अंकों (superscript) में बदलें: 95 → ⁹⁵ */
function supNum(n) {
    const m = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '−': '⁻', '+': '⁺' };
    return String(n).split('').map(c => m[c] || c).join('');
}

/* diff: 0 आसान, 1 मध्यम, 2 कठिन — रेंज अपने-आप बदलती है */
function genDrillQuestion(gen, diff = 1) {
    const D = diff;
    switch (gen) {
        case 'tables': { const hi = [12, 20, 30][D], lo = [2, 7, 11][D]; const a = rnd(lo, hi), b = rnd(lo, hi); return { q: a + ' × ' + b + ' = ?', a: a * b }; }
        case 'squares': { const hi = [25, 50, 60][D]; const n = rnd(1, hi); return { q: n + '² = ?', a: n * n }; }
        case 'cubes': { const hi = [10, 15, 20][D]; const n = rnd(2, hi); return { q: n + '³ = ?', a: n * n * n }; }
        case 'cubeRoot': { const hi = [12, 18, 25][D]; const n = rnd(3, hi); return { q: '∛' + (n * n * n) + ' = ?', a: n }; }
        case 'fracPercent': {
            const fracs = [[2, 50], [3, 33.33], [4, 25], [5, 20], [6, 16.67], [7, 14.28], [8, 12.5], [9, 11.11], [10, 10], [11, 9.09], [12, 8.33], [16, 6.25], [20, 5], [25, 4]];
            const f = fracs[rnd(0, fracs.length - 1)];
            if (D === 2 && Math.random() < 0.5) return { q: f[1] + '% = 1/?', a: f[0] };
            return { q: '1/' + f[0] + ' = ?%', a: f[1], tol: 0.15 };
        }
        case 'addSub': {
            const hiA = [99, 499, 999][D], hiB = [49, 299, 899][D];
            const a = rnd(20, hiA), b = rnd(11, hiB), plus = Math.random() < 0.5;
            return { q: a + (plus ? ' + ' : ' − ') + b + ' = ?', a: plus ? a + b : a - b };
        }
        case 'chainAdd': {
            const n = [4, 5, 6][D];
            const nums = [];
            for (let i = 0; i < n; i++) nums.push(rnd([9, 25, 45][D], [49, 89, 199][D]));
            let txt = nums[0] + '', total = nums[0];
            for (let i = 1; i < n; i++) {
                const minus = D > 0 && Math.random() < 0.3 && total - nums[i] > 0;
                txt += (minus ? ' − ' : ' + ') + nums[i];
                total += minus ? -nums[i] : nums[i];
            }
            return { q: txt + ' = ?', a: total };
        }
        case 'twoDigitMul': { const lo = [11, 20, 25][D], hi = [19, 99, 99][D]; const a = rnd(lo, hi), b = rnd(lo, hi); return { q: a + ' × ' + b + ' = ?', a: a * b }; }
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
            const n = rnd(6, [40, 60, 80][D]), mode = rnd(0, 2);
            if (mode === 0) return { q: '1+2+…+' + n + ' = ?', a: n * (n + 1) / 2 };
            if (mode === 1) return { q: '1²+2²+…+' + n + '² = ?', a: n * (n + 1) * (2 * n + 1) / 6 };
            return { q: '1³+2³+…+' + n + '³ = ?', a: Math.pow(n * (n + 1) / 2, 2) };
        }
        case 'sqrt': { const n = rnd([25, 32, 45][D], 99); return { q: '√' + (n * n) + ' = ?', a: n }; }
        case 'unitDigit': {
            const base = [2, 3, 4, 7, 8, 9][rnd(0, 5)], exp = rnd(10, [99, 199, 999][D]);
            let u = 1, b = base % 10;
            for (let i = 0; i < exp; i++) u = (u * b) % 10;
            return { q: base + supNum(exp) + ' का इकाई अंक = ?', a: u };
        }
        case 'remainder': {
            const n = [9, 11, 12, 14, 16, 18, 20, 24][rnd(0, 7)], exp = rnd(2, [30, 60, 120][D]);
            let r = 1;
            for (let i = 0; i < exp; i++) r = (r * (n - 1)) % n;
            return { q: (n - 1) + supNum(exp) + ' ÷ ' + n + ' का शेष = ?', a: r };
        }
        case 'percentCalc': {
            const mode = rnd(0, 3);
            if (mode === 0) { const x = rnd(20, 99) * 10, p = [5, 10, 12.5, 20, 25, 33.33, 37.5, 50, 62.5, 75, 87.5][rnd(0, 10)]; return { q: x + ' का ' + p + '% = ?', a: Math.round(x * p) / 100, tol: 0.5 }; }
            if (mode === 1) { const x = rnd(2, 99) * 10, p = [10, 20, 25, 30, 40, 50, 60, 75][rnd(0, 7)]; return { q: x + ' का ' + p + '% = ?', a: x * p / 100 }; }
            if (mode === 2) { const x = rnd(10, 200), p = [5, 10, 20, 25, 50][rnd(0, 4)]; return { q: 'x का ' + p + '% = ' + (x * p / 100) + ' → x = ?', a: x }; }
            return { q: '25% का 25% = ?%', a: 6.25 };
        }
        case 'mixedSprint': {
            const gens = ['tables', 'squares', 'fracPercent', 'addSub', 'percentCalc', 'cubes'];
            if (D >= 1) gens.push('twoDigitMul', 'baseMul');
            if (D >= 2) gens.push('sqrt', 'unitDigit', 'series', 'chainAdd');
            return genDrillQuestion(gens[rnd(0, gens.length - 1)], D);
        }
    }
    return { q: '?', a: 0 };
}

function startDrill(gen) {
    if (drillTimer) { clearInterval(drillTimer); drillTimer = null; }
    const secs = (document.getElementById('drill-duration') ? parseInt(document.getElementById('drill-duration').value, 10) : null) || drillConfig.secs || 60;
    const diff = (document.getElementById('drill-difficulty') ? parseInt(document.getElementById('drill-difficulty').value, 10) : null);
    activeDrill = { gen, score: 0, correct: 0, wrong: 0, timeLeft: secs, totalSecs: secs, diff: isNaN(diff) ? drillConfig.diff : diff, current: null, answered: 0 };
    const dMeta = DRILLS.find(d => d.gen === gen);
    document.getElementById('drill-play').style.display = 'block';
    document.getElementById('drill-result').style.display = 'none';
    document.getElementById('drill-desc').textContent = dMeta.desc + ' — ' + DIFF_LABEL[activeDrill.diff] + ' • ' + secs + ' सेकंड • लक्ष्य ' + (dMeta.target || 12) + '+ सही';
    document.getElementById('drill-feedback').className = 'drill-feedback';
    document.getElementById('drill-feedback').textContent = '';
    const stEl = document.getElementById('calc-workout-status');
    if (stEl) stEl.style.display = 'none';
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
    activeDrill.current = genDrillQuestion(activeDrill.gen, activeDrill.diff);
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
    activeDrill.answered++;
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
    if (isBest) { state.bestDrill[d.gen] = d.score; }
    updateDrillHistoryAfter(d);
    renderDrillSelect();
    renderCalcScorecard();
    const attempts = d.correct + d.wrong;
    const acc = attempts ? Math.round(d.correct / attempts * 100) : 0;
    const perQ = d.correct ? Math.round(d.totalSecs / d.correct * 10) / 10 : 0;
    const target = (DRILLS.find(x => x.gen === d.gen) || {}).target || 12;
    const hitTarget = d.correct >= target;
    document.getElementById('drill-play').style.display = 'none';
    const res = document.getElementById('drill-result');
    res.style.display = 'block';
    res.innerHTML = `<h4>⏱️ समय समाप्त — ${hitTarget ? '🎯 लक्ष्य हासिल!' : '💪 लक्ष्य ' + target + ' है'}</h4>
        <p class="score-ring">${d.correct}</p>
        <p>सही उत्तर | ${d.wrong} गलत | सटीकता ${acc}% | ⚡ ${perQ} से/सही | +${d.correct} XP</p>
        ${isBest ? '<p class="drill-best">🏆 नया रिकॉर्ड!</p>' : '<p class="muted">सर्वश्रेष्ठ: ' + prevBest + '</p>'}
        ${drillTrendHtml(d.gen)}
        <button class="btn btn-primary" style="margin-top:.8rem;" onclick="startDrill('${d.gen}')">🔁 फिर से खेलें</button>`;
    activeDrill = null;
    updateDashboard();
    updateProfile();
}

/* ================= FAST-MAKING TRICK LAB ================= */
let fastSearch = '';

function initFastTricks() {
    document.getElementById('fast-search').addEventListener('input', e => {
        fastSearch = e.target.value.trim().toLowerCase();
        renderFastTopics();
    });
    document.getElementById('fast-trainer-next').addEventListener('click', nextFastTrainerQuestion);
    renderDailyFastTrick();
    renderFastTopics();
}

function allFastMethods() {
    return FAST_TRICKS.flatMap(topic => topic.tricks.map(trick => ({ ...trick, topicId: topic.id, topic: topic.topic, icon: topic.icon })));
}

function renderDailyFastTrick() {
    const all = allFastMethods();
    const key = todayKey();
    let hash = 0;
    for (const ch of key) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
    const t = all[hash % all.length];
    document.getElementById('daily-fast-trick').innerHTML = `<div class="daily-trick-label">⚡ आज की Fast Trick</div>
        <h3>${t.icon} ${t.name}</h3><p><b>Signal:</b> ${esc(t.signal)}</p>
        <button class="drill-btn" onclick="openFastTopic('${t.topicId}')">पूरी method देखें →</button>`;
}

let fastTrainer = null;
function shuffledCopy(items) {
    const out = items.slice();
    for (let i=out.length-1;i>0;i--) { const j=Math.floor(Math.random()*(i+1)); [out[i],out[j]]=[out[j],out[i]]; }
    return out;
}

function startFastTrainer() {
    const all = allFastMethods();
    fastTrainer = { questions: shuffledCopy(all).slice(0,10), idx:0, score:0, answered:false, started:Date.now(), tick:null, options:[] };
    document.getElementById('fast-trainer-launch').style.display='none';
    document.getElementById('fast-trainer').style.display='block';
    document.getElementById('fast-trainer-result').style.display='none';
    renderFastTrainerQuestion();
    fastTrainer.tick=setInterval(()=>{
        if (!fastTrainer) return;
        const sec=Math.floor((Date.now()-fastTrainer.started)/1000);
        document.getElementById('fast-trainer-time').textContent=Math.floor(sec/60)+':'+String(sec%60).padStart(2,'0');
    },1000);
}

function renderFastTrainerQuestion() {
    const q=fastTrainer.questions[fastTrainer.idx];
    const wrong=shuffledCopy(allFastMethods().filter(x=>x.name!==q.name)).slice(0,3);
    fastTrainer.options=shuffledCopy([q,...wrong]); fastTrainer.answered=false;
    document.getElementById('fast-trainer-no').textContent=fastTrainer.idx+1;
    document.getElementById('fast-trainer-score').textContent=fastTrainer.score;
    document.getElementById('fast-trainer-topic').textContent=q.icon+' '+q.topic;
    document.getElementById('fast-trainer-signal').innerHTML='<small>इस signal पर कौन-सी trick सबसे तेज़ है?</small><br>'+esc(q.signal);
    document.getElementById('fast-trainer-options').innerHTML=fastTrainer.options.map((x,i)=>`<button class="quiz-option" onclick="answerFastTrainer(${i})">${String.fromCharCode(65+i)}. ${x.name}</button>`).join('');
    const fb=document.getElementById('fast-trainer-feedback'); fb.className='quiz-feedback'; fb.innerHTML='';
    document.getElementById('fast-trainer-next').style.display='none';
}

function answerFastTrainer(index) {
    if (!fastTrainer || fastTrainer.answered) return;
    fastTrainer.answered=true;
    const q=fastTrainer.questions[fastTrainer.idx], chosen=fastTrainer.options[index];
    const correct=chosen.name===q.name;
    if (correct) fastTrainer.score++;
    document.querySelectorAll('#fast-trainer-options .quiz-option').forEach((b,i)=>{
        b.disabled=true;
        if (fastTrainer.options[i].name===q.name) b.classList.add('correct');
        else if (i===index) b.classList.add('wrong');
    });
    const fb=document.getElementById('fast-trainer-feedback'); fb.className='quiz-feedback '+(correct?'good':'bad');
    fb.innerHTML=`<div class="qf-head">${correct?'✅ सही पहचान!':'❌ सही trick: '+q.name}</div>
        <p><b>Fast method:</b> ${esc(q.method)}</p><p><b>Example:</b> ${esc(q.example)}</p><p><b>🛡️ Guard:</b> ${esc(q.guard)}</p>`;
    document.getElementById('fast-trainer-score').textContent=fastTrainer.score;
    document.getElementById('fast-trainer-next').style.display='inline-flex';
}

function nextFastTrainerQuestion() {
    if (!fastTrainer || !fastTrainer.answered) return;
    fastTrainer.idx++;
    if (fastTrainer.idx>=fastTrainer.questions.length) finishFastTrainer(); else renderFastTrainerQuestion();
}

function finishFastTrainer() {
    clearInterval(fastTrainer.tick);
    const result={score:fastTrainer.score,seconds:Math.floor((Date.now()-fastTrainer.started)/1000)};
    state.trickTrainerAttempts=(state.trickTrainerAttempts||0)+1;
    state.trickTrainerBest=Math.max(state.trickTrainerBest||0,result.score);
    state.xp+=result.score*2; saveState(); updateDashboard(); updateProfile();
    fastTrainer=null;
    document.getElementById('fast-trainer').style.display='none';
    document.getElementById('fast-trainer-launch').style.display='block';
    const el=document.getElementById('fast-trainer-result'); el.style.display='block';
    el.innerHTML=`<h3>${result.score>=9?'🏆 Signal Master!':result.score>=7?'⚡ Speed बढ़ रही है':'📚 Signals दोहराएँ'}</h3>
        <div class="score-ring">${result.score}/10</div><p>समय: ${fmtTime(result.seconds)} • Best: ${state.trickTrainerBest}/10 • +${result.score*2} XP</p>
        <button class="btn btn-primary" onclick="startFastTrainer()">🔁 फिर खेलें</button>`;
    renderFastTopics();
}

function renderFastTopics() {
    const total = FAST_TRICKS.reduce((n,t)=>n+t.tricks.length,0);
    const read = (state.tricksRead || []).length;
    document.getElementById('fast-stats').innerHTML = `
        <div class="stat-card card-blue"><div class="stat-icon">📚</div><div><div class="stat-value">${FAST_TRICKS.length}/19</div><div class="stat-label">Chapters covered</div></div></div>
        <div class="stat-card card-gold"><div class="stat-icon">⚡</div><div><div class="stat-value">${total}</div><div class="stat-label">Validated tricks</div></div></div>
        <div class="stat-card card-green"><div class="stat-icon">✅</div><div><div class="stat-value">${read}/${FAST_TRICKS.length}</div><div class="stat-label">Playbooks पढ़े</div></div></div>
        <div class="stat-card card-purple"><div class="stat-icon">🎮</div><div><div class="stat-value">${state.trickTrainerBest||0}/10</div><div class="stat-label">Trainer best</div></div></div>`;
    const list = FAST_TRICKS.filter(t => !fastSearch || (t.topic+' '+t.prereq+' '+t.tricks.map(x=>x.name+' '+x.signal+' '+x.method).join(' ')).toLowerCase().includes(fastSearch));
    const grid = document.getElementById('fast-topic-grid');
    grid.style.display='grid';
    grid.innerHTML = list.map(t => `<button class="fast-topic-card" onclick="openFastTopic('${t.id}')">
        <span class="fast-icon">${t.icon}</span><div><h3>${t.topic}</h3><p>${t.tricks.length} fast methods • लक्ष्य ${t.target}</p></div>
        <span class="fast-arrow">${(state.tricksRead||[]).includes(t.id)?'✅':'→'}</span></button>`).join('') || '<div class="no-data">कोई matching trick नहीं मिली। दूसरा keyword आज़माएँ।</div>';
    document.getElementById('fast-detail').style.display='none';
}

function openFastTopic(id) {
    const topic = FAST_TRICKS.find(t=>t.id===id);
    if (!topic) return;
    if (!state.tricksRead) state.tricksRead=[];
    if (!state.tricksRead.includes(id)) { state.tricksRead.push(id); state.xp+=8; saveState(); updateDashboard(); updateProfile(); }
    document.getElementById('fast-topic-grid').style.display='none';
    const detail=document.getElementById('fast-detail');
    detail.style.display='block';
    detail.innerHTML=`<button class="back-btn" onclick="renderFastTopics()">← सभी फास्ट ट्रिक्स</button>
        <div class="fast-detail-head"><span>${topic.icon}</span><div><h2>${topic.topic}</h2><p>Target: <b>${topic.target}</b> • पहले पक्का करें: ${esc(topic.prereq)}</p></div></div>
        <div class="fast-drill">🎯 <b>Speed Drill:</b> ${esc(topic.drill)}</div>
        <div class="fast-trick-list">${topic.tricks.map((tr,i)=>`<article class="fast-trick-card">
            <div class="fast-trick-title"><b>⚡ Trick ${i+1}</b><h3>${tr.name}</h3><span>${tr.save}</span></div>
            <div class="fast-trick-row signal"><strong>👀 Signal</strong><p>${esc(tr.signal)}</p></div>
            <div class="fast-trick-row method"><strong>🚀 Fast Method</strong><p>${esc(tr.method)}</p></div>
            <div class="fast-example"><strong>✍️ Example</strong><p>${esc(tr.example)}</p></div>
            <div class="fast-guard"><strong>🛡️ Guard — यहाँ गलती मत करना</strong><p>${esc(tr.guard)}</p></div>
        </article>`).join('')}</div>`;
    window.scrollTo({top:0,behavior:'smooth'});
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
let pyqFilters = { exam: 'all', topic: 'all', difficulty: 'all', lang: 'all', search: '' };
let pyqShown = 40;
const PYQ_PAGE = 40;

function initPyq() {
    const exams = [...new Set(PYQ_ALL.map(q => q.exam).filter(Boolean))].sort();
    const topics = [...new Set(PYQ_ALL.map(q => q.topic).filter(Boolean))].sort();
    document.getElementById('pyq-exam-filter').innerHTML += exams.map(e => `<option value="${e}">${e}</option>`).join('');
    document.getElementById('pyq-topic-filter').innerHTML += topics.map(t => `<option value="${t}">${t}</option>`).join('');
    ['pyq-exam-filter', 'pyq-topic-filter', 'pyq-difficulty-filter', 'pyq-lang-filter'].forEach(id => {
        document.getElementById(id).addEventListener('change', e => {
            pyqFilters[id.replace('pyq-', '').replace('-filter', '')] = e.target.value;
            pyqShown = PYQ_PAGE;
            renderPyq();
        });
    });
    document.getElementById('pyq-search').addEventListener('input', e => {
        pyqFilters.search = e.target.value.trim().toLowerCase();
        pyqShown = PYQ_PAGE;
        renderPyq();
    });
    renderPyq();
}

function pyqFiltered() {
    return PYQ_ALL.filter(q => {
        if (pyqFilters.exam !== 'all' && q.exam !== pyqFilters.exam) return false;
        if (pyqFilters.topic !== 'all' && q.topic !== pyqFilters.topic) return false;
        if (pyqFilters.difficulty !== 'all' && q.difficulty !== pyqFilters.difficulty) return false;
        if (pyqFilters.lang === 'hi' && q.lang === 'en') return false;
        if (pyqFilters.lang === 'en' && q.lang !== 'en') return false;
        if (pyqFilters.search && !(q.question + ' ' + q.topic + ' ' + q.exam).toLowerCase().includes(pyqFilters.search)) return false;
        return true;
    });
}

function renderPyq() {
    const list = pyqFiltered();
    const hi = list.filter(q => q.lang !== 'en').length;
    document.getElementById('pyq-count').innerHTML = 'कुल <b>' + list.length + '</b> प्रश्न मिले (🇮🇳 ' + hi + ' हिंदी + ' + (list.length - hi) + ' English)';
    document.getElementById('pyq-detail').style.display = 'none';
    const wrap = document.getElementById('pyq-list');
    wrap.style.display = 'grid';
    const vis = list.slice(0, pyqShown);
    wrap.innerHTML = vis.map(pyqCard).join('') || '<div class="no-data">कोई प्रश्न नहीं मिला — फिल्टर बदलकर देखें</div>';
    const more = document.getElementById('pyq-load-more');
    if (list.length > vis.length) {
        more.style.display = 'inline-flex';
        more.textContent = '⬇ और प्रश्न दिखाएँ (' + vis.length + '/' + list.length + ')';
    } else {
        more.style.display = 'none';
    }
}

function pyqLoadMore() {
    pyqShown += PYQ_PAGE;
    renderPyq();
}

function pyqCard(q) {
    const letters = q.optLetters || q.options.map((_, i) => 'abcd'[i]);
    const opts = q.options.map((o, i) => (letters[i] || 'abcd'[i]) + ') ' + esc(o)).join('  ');
    const badge = q.lang === 'en' ? '<span class="lang-badge en">EN</span>' : '<span class="lang-badge hi">हिं</span>';
    const srcBadge = q.src === 'featured' ? '<span class="src-badge">⭐ चर्चित</span>' : '';
    const yr = q.year ? ' ' + q.year : '';
    return `
        <div class="pyq-item" onclick="togglePyqSolution('${q.id}')" role="button" tabindex="0">
            <div class="pyq-header">
                <span class="pyq-topic">${q.topic}</span>
                <span class="pyq-exam">${badge}${srcBadge}${esc(q.exam)}${yr} • ${q.difficulty}</span>
            </div>
            <div class="pyq-question">${esc(q.question)}</div>
            <div class="pyq-options">${opts}</div>
            <span class="pyq-sol-toggle" id="pyq-toggle-${q.id}">💡 हल देखें (क्लिक करें)</span>
            <div class="pyq-solution" id="pyq-sol-${q.id}">${pyqSolutionHtml(q)}</div>
        </div>`;
}

function pyqSolutionHtml(q) {
    if (q.solution && q.solution.length) {
        let html = '';
        if (q.solLang === 'en') html += '<div class="en-note">📝 नोट: विस्तृत हल मूल English में है — प्रश्न हिंदी में दिया गया है</div>';
        html += q.solution.map((s, i) => `<div class="step"><b>चरण ${i + 1}:</b> ${esc(s)}</div>`).join('');
        html += `<div style="margin-top:.6rem; font-weight:800; color:var(--success);">✔ सही उत्तर: ${esc(q.answer)}</div>`;
        if (q.shortcut) html += `<div style="margin-top:.4rem; background:var(--primary-soft); border-radius:8px; padding:.5rem .8rem;">⚡ शॉर्टकट: ${esc(q.shortcut)}</div>`;
        if (q.trap) html += `<div class="pyq-trap-warn">⚠️ ट्रैप: ${esc(q.trap)}</div>`;
        return html;
    }
    // लेगेसी प्रश्न — उत्तर-पत्र (answer key) शैली
    let ansLine;
    if (q.answer) ansLine = '✔ सही उत्तर: (' + q.answerLetter + ') ' + esc(q.answer);
    else if (q.answerLetter) ansLine = '✔ सही उत्तर: विकल्प (' + q.answerLetter + ')';
    else ansLine = '✔ उत्तर उपलब्ध नहीं';
    return `<div style="font-weight:800; color:var(--success);">${ansLine}</div>
        <div style="margin-top:.4rem; font-size:.85rem; color:var(--text-muted);">🏷️ ${esc(q.topic)}${q.exam ? ' • ' + esc(q.exam) : ''}${q.year ? ' ' + q.year : ''}</div>
        <div class="en-note">📝 विस्तृत हल जल्द आ रहा है — तब तक विकल्पों से पीछे की ओर हल करने का अभ्यास करें!</div>`;
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
let patternSearch = '';

function renderPatterns() {
    const q = patternSearch.trim().toLowerCase();
    const list = PATTERNS_ALL.filter(p => {
        if (!q) return true;
        return (p.name + ' ' + (p.signal || '') + ' ' + (p.concept || '') + ' ' + (p.topic || '')).toLowerCase().includes(q);
    });
    document.getElementById('patterns-grid').innerHTML = list.map(p => {
        const badge = p.src === 'legacy'
            ? `<span class="pn">${esc(p.topic || 'पैटर्न')}${p.freq ? ' • ' + esc(p.freq) : ''}</span>`
            : `<span class="pn">${p.type}</span>`;
        let detail = '';
        if (p.formula) detail += `<div class="pd-box formula"><b>📌 सूत्र:</b><br>${esc(p.formula)}</div>`;
        if (p.method) detail += `<div class="pd-box"><b>🧪 लंबी विधि:</b><br>${esc(p.method)}</div>`;
        if (p.shortcut) detail += `<div class="pd-box"><b>⚡ शॉर्टकट:</b><br>${esc(p.shortcut)}</div>`;
        if (p.wording) detail += `<div class="pd-box"><b>📝 प्रश्न की भाषा:</b><br>${esc(p.wording)}</div>`;
        if (p.pyqExamples && p.pyqExamples.length) detail += `<div class="pd-box pyq"><b>🎯 PYQ उदाहरण:</b><br>${p.pyqExamples.map(e => '• ' + esc(e)).join('<br>')}</div>`;
        if (p.examples && p.examples.length) detail += `<div class="pd-box pyq"><b>🎯 उदाहरण:</b><br>${p.examples.map(e => '• ' + esc(e)).join('<br>')}</div>`;
        if (p.variants && p.variants.length) detail += `<div class="pd-box"><b>🔀 रूपांतर:</b><br>${p.variants.map(v => '• ' + esc(v)).join('<br>')}</div>`;
        if (p.test) detail += `<div class="pd-box"><b>✏️ खुद जाँचें:</b><br>${esc(p.test)}</div>`;
        if (p.time) detail += `<div class="pd-box"><b>⏱️ लक्ष्य समय:</b> ${esc(p.time)}</div>`;
        if (p.trap) detail += `<div class="td-box detection" style="background:var(--error-soft); border-left:3px solid var(--error);"><b>⚠️ ट्रैप:</b> ${esc(p.trap)}</div>`;
        if (p.traps && p.traps.length) detail += `<div class="td-box detection" style="background:var(--error-soft); border-left:3px solid var(--error);"><b>⚠️ ट्रैप:</b><br>${p.traps.map(t => '• ' + esc(t)).join('<br>')}</div>`;
        return `
        <div class="pattern-card" onclick="toggleDetail('pattern-detail-${p.id}')" role="button" tabindex="0">
            ${badge}
            <h3>${p.name}</h3>
            ${p.signal ? `<div class="row"><b>🔎 पहचान:</b> ${esc(p.signal)}</div>` : ''}
            ${p.concept ? `<div class="row"><b>💡 अवधारणा:</b> ${esc(p.concept)}</div>` : ''}
            <div class="pattern-detail" id="pattern-detail-${p.id}">${detail}</div>
        </div>`;
    }).join('') || '<div class="no-data">😕 कोई पैटर्न नहीं मिला — दूसरा शब्द आज़माएँ</div>';
}

function toggleDetail(id) {
    document.getElementById(id).classList.toggle('show');
}

/* ================= ट्रैप बुक ================= */
let trapSearch = '';

function renderTraps() {
    const q = trapSearch.trim().toLowerCase();
    const list = TRAPS.filter(t => {
        if (!q) return true;
        return (t.title + ' ' + t.example + ' ' + t.type).toLowerCase().includes(q);
    });
    document.getElementById('traps-grid').innerHTML = list.map(t => `
        <div class="trap-card" onclick="toggleDetail('trap-detail-${t.id}'); markTrapRead('${t.id}')" role="button" tabindex="0">
            <span class="trap-type">${t.type}</span>
            <h3>${t.title}</h3>
            <div class="row"><b>📌 उदाहरण:</b> ${esc(t.example)}</div>
            <div class="row"><b>❓ क्यों फँसते हैं:</b> ${esc(t.why)}</div>
            <div class="trap-detail" id="trap-detail-${t.id}">
                <div class="td-box detection"><b>🔎 पहचान:</b> ${esc(t.detection)}</div>
                <div class="td-box prevention"><b>✅ बचाव:</b> ${esc(t.prevention)}</div>
            </div>
        </div>`).join('') || '<div class="no-data">😕 कोई ट्रैप नहीं मिला — दूसरा शब्द आज़माएँ</div>';
}

function initPatternTrapSearch() {
    const ps = document.getElementById('pattern-search');
    if (ps) ps.addEventListener('input', e => { patternSearch = e.target.value; renderPatterns(); });
    const ts = document.getElementById('trap-search');
    if (ts) ts.addEventListener('input', e => { trapSearch = e.target.value; renderTraps(); });
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
        wrap.innerHTML = PATTERNS_ALL.filter(p => p.formula || p.shortcut || p.method).map(p => `
            <div class="rev-item"><h4>🧠 ${p.name}</h4>
            <div class="fb-box formula" style="margin-top:.4rem;">${esc(p.formula || p.shortcut || p.method)}</div>
            ${(p.trap || (p.traps && p.traps[0])) ? `<p style="font-size:.82rem; margin-top:.4rem;">⚠️ ${esc(p.trap || p.traps[0])}</p>` : ''}</div>`).join('');
    }
}

/* ================= PDF LIBRARY DEEP ANALYSIS ================= */
let pdfCollectionFilter = 'all';
let pdfSearch = '';

function initPdfResearch() {
    const collections = Object.keys(PDF_ANALYSIS.collections);
    document.getElementById('pdf-collection-filter').innerHTML = '<option value="all">सभी collections</option>' +
        collections.map(c => `<option value="${c}">${c}</option>`).join('');
    document.getElementById('pdf-collection-filter').addEventListener('change', e => { pdfCollectionFilter = e.target.value; renderPdfFiles(); });
    document.getElementById('pdf-search').addEventListener('input', e => { pdfSearch = e.target.value.trim().toLowerCase(); renderPdfFiles(); });
    renderPdfResearch();
}

function renderPdfResearch() {
    const t = PDF_ANALYSIS.totals;
    document.getElementById('pdf-summary').innerHTML = [
        ['📚', t.pdf_files, 'कुल PDFs'], ['📄', t.pages.toLocaleString('en-IN'), 'हर page scan'],
        ['❓', t.pyq_source_questions_with_keys.toLocaleString('en-IN'), 'Answer-key questions'],
        ['✅', t.pyq_unique_imported.toLocaleString('en-IN'), 'Unique PDF PYQs'],
        ['♻️', t.pyq_duplicates_removed.toLocaleString('en-IN'), 'Duplicates हटे'],
        ['🧾', t.pyq_solutions_detected.toLocaleString('en-IN'), 'Solutions मिले']
    ].map(x => `<div class="stat-card"><div class="stat-icon">${x[0]}</div><div class="stat-info"><div class="stat-value">${x[1]}</div><div class="stat-label">${x[2]}</div></div></div>`).join('');
    document.getElementById('pdf-collections').innerHTML = Object.entries(PDF_ANALYSIS.collections).map(([name,c]) => `
        <div class="card pdf-collection"><h3>${name}</h3><div><b>${c.files}</b> files • <b>${c.pages}</b> pages • ${c.size_mb} MB</div>
        <div class="mini-progress"><span style="width:${c.text_coverage_percent}%"></span></div>
        <small>${c.text_coverage_percent}% pages text-readable ${c.text_coverage_percent < 50 ? '• बाकी scanned/image pages को OCR चाहिए' : ''}</small></div>`).join('');
    const years = ['2023','2024','2025'];
    const matrix = PDF_ANALYSIS.topicYear;
    document.getElementById('pdf-topic-matrix').innerHTML = `<thead><tr><th>टॉपिक</th>${years.map(y=>`<th>${y}</th>`).join('')}<th>Unique total</th></tr></thead><tbody>` +
        Object.entries(matrix).map(([topic, vals]) => {
            const total = years.reduce((n,y)=>n+(vals[y]?.unique_imported||0),0);
            return `<tr><td><b>${topic}</b></td>${years.map(y=>`<td>${vals[y] ? vals[y].source_questions.toLocaleString('en-IN')+' / '+vals[y].unique_imported : '—'}</td>`).join('')}<td><b>${total}</b></td></tr>`;
        }).join('') + '</tbody>';
    renderPdfFiles();
}

function renderPdfFiles() {
    const files = PDF_ANALYSIS.files.filter(f => {
        if (pdfCollectionFilter !== 'all' && f.collection !== pdfCollectionFilter) return false;
        return !pdfSearch || (f.file + ' ' + f.topic + ' ' + f.collection).toLowerCase().includes(pdfSearch);
    });
    document.getElementById('pdf-file-count').innerHTML = `<b>${files.length}</b> PDF मिले • ${files.reduce((n,f)=>n+f.pages,0).toLocaleString('en-IN')} pages`;
    document.getElementById('pdf-file-list').innerHTML = files.map(f => {
        const p = f.pipeline || {};
        const href = encodeURI(f.file).replace(/'/g, '%27');
        return `<a class="pdf-file-card" href="${href}" target="_blank" rel="noopener">
            <div class="pdf-file-icon">📕</div><div class="pdf-file-info"><h4>${f.file.split('/').pop()}</h4>
            <p>${f.topic} • ${f.pages} pages • ${f.size_mb} MB • text coverage ${f.text_coverage_percent}%</p>
            ${p.answer_keys != null ? `<div class="pdf-badges"><span>${p.answer_keys} source Q</span><span>${p.unique_imported} unique</span><span>${p.duplicates} duplicate</span><span>${p.solutions} solutions</span></div>` : '<div class="pdf-badges"><span>Classnotes/Book</span><span>Visual study source</span></div>'}
            </div><span class="pdf-open">खोलें ↗</span></a>`;
    }).join('') || '<div class="no-data">कोई PDF नहीं मिला। Filter बदलकर देखें।</div>';
}

/* ================= एग्जाम इंफो ================= */
function examMatches(q, examId) {
    const rules = {
        'ssc-cgl': /CGL/i, 'ssc-chsl': /CHSL/i, 'ssc-cpo': /CPO|SI/i, 'ssc-mts': /MTS/i,
        'ssc-gd': /SSC GD|CONSTABLE/i, 'ssc-selection-post': /SELECTION/i, 'ssc-stenographer': /STENO/i,
        'rrb-ntpc': /NTPC/i, 'rrb-group-d': /GROUP D/i, 'rrb-alp': /ALP/i,
        'rrb-technician': /TECHNICIAN/i, 'rpf-constable': /RPF/i, 'rrb-je': /RRB JE|RAILWAY JE/i
    };
    return (rules[examId] || /$a/).test(q.exam || '');
}
function examQuestions(examId) { return PYQ_ALL.filter(q => examMatches(q, examId)); }

function renderExams() {
    document.getElementById('exam-cards').innerHTML = EXAMS.map(e => {
        const qCount = examQuestions(e.id).length;
        return `<div class="exam-card" onclick="openExamDetail('${e.id}')" role="button" tabindex="0">
            <span class="ec-badge ${e.badge === 'SSC' ? 'badge-ssc' : 'badge-rrb'}">${e.badge}</span>
            <span class="exam-q-count">${qCount ? qCount.toLocaleString('en-IN') + ' bank questions' : 'Syllabus profile'}</span>
            <h3>${e.name}</h3>
            <p>${e.short}</p>
            <div class="ec-tags">${e.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
        </div>`;
    }).join('');
    document.getElementById('exam-tips-list').innerHTML = EXAM_TIPS.map(t => `<li>${t}</li>`).join('');
    document.getElementById('exam-detail').style.display = 'none';
}

function openExamDetail(id) {
    const e = EXAMS.find(x => x.id === id);
    if (!e) return;
    const bank = examQuestions(id);
    const topicCounts = {};
    bank.forEach(q => { topicCounts[q.topic || 'विविध'] = (topicCounts[q.topic || 'विविध'] || 0) + 1; });
    const topTopics = Object.entries(topicCounts).sort((a,b)=>b[1]-a[1]).slice(0,8);
    document.getElementById('exam-cards').style.display = 'none';
    const d = document.getElementById('exam-detail');
    d.style.display = 'block';
    d.innerHTML = `
        <button class="back-btn" onclick="document.getElementById('exam-detail').style.display='none'; document.getElementById('exam-cards').style.display='grid';">← सभी परीक्षाएँ</button>
        <div class="exam-detail">
            <span class="ec-badge ${e.badge === 'SSC' ? 'badge-ssc' : 'badge-rrb'}">${e.badge}</span>
            <h3>${e.name}</h3>
            <p>${e.overview}</p>
            <div class="exam-bank-analysis">
                <h4>🧪 Question Bank Deep Analysis</h4>
                <div class="exam-bank-number"><b>${bank.length.toLocaleString('en-IN')}</b><span>इस exam-tag के उपलब्ध questions</span></div>
                ${topTopics.length ? `<div class="exam-topic-bars">${topTopics.map(([topic,n])=>`<div><span>${esc(topic)}</span><div class="mini-progress"><span style="width:${Math.round(n/topTopics[0][1]*100)}%"></span></div><b>${n}</b></div>`).join('')}</div>
                <button class="btn btn-primary" onclick="practiceExam('${id}')">🎯 ${Math.min(25,bank.length)}-Question Exam Quiz</button>` : '<p class="muted">इस exact exam tag के questions PDF bank में नहीं हैं; नीचे official syllabus profile से तैयारी करें।</p>'}
            </div>
            <h4>📐 गणित का वेटेज (टॉपिक अनुसार)</h4>
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
        <button class="plan-tab" onclick="showPlan('routine', this)">⏰ रोज़ का रूटीन</button>
        <button class="plan-tab" onclick="showPlan('macro', this)">🗓️ 180-दिन मैक्रो</button>`;
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
    } else if (mode === 'routine') {
        wrap.innerHTML = DAILY_ROUTINE.map(r => `
            <div class="day-task"><h4>${r.time} — ${r.title}</h4>
            <ul>${r.items.map(i => `<li>${esc(i)}</li>`).join('')}</ul></div>`).join('');
    } else if (mode === 'macro' && typeof MACRO_180_PLAN !== 'undefined') {
        wrap.innerHTML = `<div class="phase-card" style="border-left:4px solid var(--accent-gold);"><h3>${MACRO_180_PLAN.name}</h3><div class="phase-sub">${esc(MACRO_180_PLAN.sub)}</div></div>` +
            MACRO_180_PLAN.phases.map(p => `
            <div class="phase-card"><h3>${esc(p.name)}</h3><div class="phase-sub">📅 ${esc(p.days)} &nbsp;•&nbsp; 🎯 लक्ष्य: ${esc(p.goal)}</div>
            <h4 style="margin:.6rem 0 .3rem;">🏁 मील के पत्थर</h4>
            <ul>${p.milestones.map(m => `<li>${esc(m)}</li>`).join('')}</ul>
            <h4 style="margin:.6rem 0 .3rem;">📌 रोज़ के काम</h4>
            <ul>${p.tasks.map(t => `<li>${esc(t)}</li>`).join('')}</ul></div>`).join('');
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
        chaptersRead: state.chaptersRead.length, trapsRead: state.trapsRead.length, pyqsSeen: state.pyqsSeen.length,
        quizDone: state.quizDone || 0, flashKnown: state.flashKnown || 0, notesRead: state.notesRead || [],
        challengeDone: challengeDoneCount(), workoutDays: Object.keys(state.calcWorkout || {}).length,
        drillsMastered: DRILLS.filter(d => (state.bestDrill[d.gen] || 0) >= (d.target || 12)).length
    };
    const allAch = ACHIEVEMENTS.concat(CH_ACHIEVEMENTS);
    const gotCount = allAch.filter(a => a.check(stats)).length;
    document.getElementById('achievements-list').innerHTML = '<h4>🏅 उपलब्धियाँ (' + gotCount + '/' + allAch.length + ')</h4>' +
        allAch.map(a => {
            const got = a.check(stats);
            return `<span class="achievement ${got ? '' : 'locked'}">${a.icon} ${a.name} — ${a.desc}</span>`;
        }).join('');

    // प्रोफाइल: उपयोगकर्ता + चैलेंज लाइन
    const uEl = document.getElementById('profile-user-line');
    if (uEl) {
        const u = currentUser() || 'अतिथि';
        const cd = state.challenge.start ? challengeCurrentDay() : null;
        uEl.innerHTML = '👤 <b>' + esc(u) + '</b> • 📅 ' + (state.joinedAt || todayKey()) + ' से' +
            (state.challenge.start ? ' • 🔥 चैलेंज दिन ' + cd + ' (' + stats.challengeDone + ' पूरे)' : ' • 🚩 चैलेंज अभी शुरू नहीं हुआ');
    }
}

/* चैलेंज/वर्कआउट से जुड़ी अतिरिक्त उपलब्धियाँ */
const CH_ACHIEVEMENTS = [
    { id: 'ch-1', icon: '🚀', name: 'शुभारंभ', desc: '90-दिन चैलेंज शुरू करें', check: s => s.challengeDone >= 1 },
    { id: 'ch-7', icon: '🔥', name: 'हफ्ते का सिपाही', desc: 'चैलेंज के 7 दिन पूरे', check: s => s.challengeDone >= 7 },
    { id: 'ch-30', icon: '⚔️', name: '30-दिन योद्धा', desc: 'चैलेंज के 30 दिन पूरे', check: s => s.challengeDone >= 30 },
    { id: 'ch-60', icon: '🛡️', name: '60-दिन वीर', desc: 'चैलेंज के 60 दिन पूरे', check: s => s.challengeDone >= 60 },
    { id: 'ch-90', icon: '👑', name: 'गणित चैंपियन', desc: '90 दिन पूरे — महा-उपलब्धि!', check: s => s.challengeDone >= 90 },
    { id: 'wo-1', icon: '🧮', name: 'पहला वर्कआउट', desc: 'पहला कैलकुलेशन वर्कआउट पूरा', check: s => s.workoutDays >= 1 },
    { id: 'wo-10', icon: '💪', name: 'कड़िया मेहनत', desc: '10 दिन के वर्कआउट', check: s => s.workoutDays >= 10 },
    { id: 'drill-5', icon: '🎯', name: 'पाँच-ड्रिल मास्टर', desc: '5 अलग ड्रिल में लक्ष्य पूरा', check: s => s.drillsMastered >= 5 },
    { id: 'drill-all', icon: '🏆', name: 'ड्रिल साम्राज्य', desc: '12+ ड्रिल में लक्ष्य पूरा', check: s => s.drillsMastered >= 12 }
];

function resetAllData() {
    if (confirm('⚠️ क्या आप पक्का सारा डेटा (XP, स्ट्रीक, चैलेंज, एरर लॉग, सब कुछ) मिटाना चाहते हैं?')) {
        const u = currentUser();
        localStorage.removeItem(u ? stateKeyFor(u) : LS_KEY);
        state = normalizeState({ joinedAt: todayKey() });
        saveState();
        refreshAllViews();
        alert('सारा डेटा रीसेट हो गया। नई शुरुआत की शुभकामनाएँ! 🌱');
    }
}

/* ================= क्विज़ (कस्टम सेट) ================= */
let customQuiz = null;
let lastQuizWrong = [];
let quizExamOverride = null;

function quizAnswerIndex(q) {
    if (q.optLetters && q.answerLetter) return q.optLetters.indexOf(q.answerLetter);
    return (q.options || []).indexOf(q.answer);
}

function quizPool() {
    const topic = document.getElementById('quiz-topic').value;
    const lang = document.getElementById('quiz-lang').value;
    return PYQ_ALL.filter(q => {
        if (quizExamOverride && !examMatches(q, quizExamOverride)) return false;
        if (topic !== 'all' && q.topic !== topic) return false;
        if (lang === 'hi' && q.lang === 'en') return false;
        if (lang === 'en' && q.lang !== 'en') return false;
        if ((q.options || []).length < 2) return false;
        return quizAnswerIndex(q) >= 0;
    });
}

function initQuiz() {
    const topics = [...new Set(PYQ_ALL.map(q => q.topic).filter(Boolean))].sort();
    document.getElementById('quiz-topic').innerHTML = '<option value="all">सभी टॉपिक</option>' +
        topics.map(t => `<option value="${t}">${t}</option>`).join('');
    const upd = () => {
        document.getElementById('quiz-pool-info').textContent = 'इस चयन में ' + quizPool().length + ' प्रश्न उपलब्ध हैं';
    };
    const manualUpdate = () => { quizExamOverride = null; upd(); };
    document.getElementById('quiz-topic').addEventListener('change', manualUpdate);
    document.getElementById('quiz-lang').addEventListener('change', manualUpdate);
    upd();
}

function practiceExam(examId) {
    const exam = EXAMS.find(e => e.id === examId);
    const pool = examQuestions(examId).filter(q => (q.options || []).length >= 2 && quizAnswerIndex(q) >= 0);
    if (!exam || !pool.length) return;
    quizExamOverride = examId;
    document.getElementById('quiz-topic').value = 'all';
    document.getElementById('quiz-lang').value = 'all';
    document.getElementById('quiz-count').value = String(Math.min(25, pool.length));
    document.getElementById('quiz-pool-info').innerHTML = `<b>${exam.name}</b> के ${pool.length.toLocaleString('en-IN')} valid questions में से exam-mode quiz`;
    openSection('quiz');
    startQuiz();
}

function startQuiz() {
    const pool = quizPool();
    if (!pool.length) { alert('इस चयन में कोई प्रश्न नहीं मिला — चयन बदलकर देखें'); return; }
    const count = Math.min(parseInt(document.getElementById('quiz-count').value, 10) || 10, pool.length);
    const shuffled = pool.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    if (customQuiz && customQuiz.tick) clearInterval(customQuiz.tick);
    customQuiz = { questions: shuffled.slice(0, count), idx: 0, score: 0, correct: 0, wrong: [], startTime: Date.now(), tick: null };
    document.getElementById('quiz-start').style.display = 'none';
    document.getElementById('quiz-play').style.display = 'block';
    document.getElementById('quiz-result').style.display = 'none';
    document.getElementById('quiz-total').textContent = count;
    document.getElementById('quiz-score').textContent = '0';
    renderQuizQuestion();
    customQuiz.tick = setInterval(() => {
        if (!customQuiz) return;
        const el = document.getElementById('quiz-timer');
        if (!el) return;
        const sec = Math.floor((Date.now() - customQuiz.startTime) / 1000);
        el.textContent = Math.floor(sec / 60) + ':' + String(sec % 60).padStart(2, '0');
    }, 1000);
}

function renderQuizQuestion() {
    const q = customQuiz.questions[customQuiz.idx];
    document.getElementById('quiz-qno').textContent = (customQuiz.idx + 1);
    const langTag = q.lang === 'en' ? ' <span class="lang-badge en">EN</span>' : '';
    document.getElementById('quiz-question').innerHTML = esc(q.question) + langTag +
        `<div style="font-size:.78rem; color:var(--text-muted); margin-top:.4rem;">🏷️ ${esc(q.topic)}${q.exam ? ' • ' + esc(q.exam) : ''}${q.year ? ' ' + q.year : ''}</div>`;
    const letters = q.optLetters || q.options.map((_, i) => 'abcd'[i]);
    document.getElementById('quiz-options').innerHTML = q.options.map((o, i) =>
        `<button class="quiz-option" onclick="answerQuiz(${i})">${(letters[i] || 'abcd'[i]).toUpperCase()}. ${esc(o)}</button>`).join('');
    const fb = document.getElementById('quiz-feedback');
    fb.className = 'quiz-feedback';
    fb.style.display = 'none';
    document.getElementById('quiz-next').style.display = 'none';
}

function quizExplain(q) {
    if (q.solution && q.solution.length) {
        let h = '💡 ' + esc(q.solution[0]);
        if (q.solution.length > 1) h += '<br>…(पूरा हल PYQ बैंक में देखें)';
        if (q.shortcut) h += '<br>⚡ ' + esc(q.shortcut);
        return h;
    }
    return '💡 सही उत्तर: (' + q.answerLetter + ') ' + esc(q.answer) + '<br>🏷️ ' + esc(q.topic) + ' • ऐसे और प्रश्न PYQ बैंक में खोजें';
}

function answerQuiz(i) {
    const q = customQuiz.questions[customQuiz.idx];
    const ans = quizAnswerIndex(q);
    const buttons = document.querySelectorAll('#quiz-options .quiz-option');
    buttons.forEach(b => b.disabled = true);
    const good = i === ans;
    if (good) { customQuiz.correct++; customQuiz.score++; }
    else customQuiz.wrong.push(q);
    if (buttons[ans]) buttons[ans].classList.add('correct');
    if (!good && buttons[i]) buttons[i].classList.add('wrong');
    const letters = q.optLetters || q.options.map((_, k) => 'abcd'[k]);
    const fb = document.getElementById('quiz-feedback');
    fb.className = 'quiz-feedback ' + (good ? 'good' : 'bad');
    fb.innerHTML = `<div class="qf-head">${good ? '✅ बिल्कुल सही!' : '❌ गलत — सही उत्तर: ' + (letters[ans] || '').toUpperCase() + '. ' + esc(q.options[ans])}</div>
        <div>${quizExplain(q)}</div>`;
    fb.style.display = 'block';
    document.getElementById('quiz-score').textContent = customQuiz.score;
    const nextBtn = document.getElementById('quiz-next');
    nextBtn.textContent = customQuiz.idx < customQuiz.questions.length - 1 ? 'अगला प्रश्न ➡' : 'परिणाम देखें 🏁';
    nextBtn.style.display = 'inline-flex';
    nextBtn.onclick = () => {
        if (customQuiz.idx < customQuiz.questions.length - 1) { customQuiz.idx++; renderQuizQuestion(); }
        else finishQuiz();
    };
}

function finishQuiz() {
    if (customQuiz.tick) clearInterval(customQuiz.tick);
    const qz = customQuiz;
    lastQuizWrong = qz.wrong;
    const sec = Math.floor((Date.now() - qz.startTime) / 1000);
    document.getElementById('quiz-play').style.display = 'none';
    const res = document.getElementById('quiz-result');
    res.style.display = 'block';
    const pct = Math.round(qz.score / qz.questions.length * 100);
    const msg = pct === 100 ? '🏆 परफेक्ट स्कोर!' : pct >= 80 ? '🎉 शानदार!' : pct >= 60 ? '👍 अच्छी कोशिश!' : '💪 अभ्यास जारी रखें!';
    res.innerHTML = `<h3>🎮 क्विज़ समाप्त!</h3>
        <p class="score-ring">${qz.score}/${qz.questions.length}</p>
        <p style="font-size:1.2rem; font-weight:700; margin:.4rem 0;">${msg}</p>
        <p class="muted">⏱️ समय: ${Math.floor(sec / 60)} मिनट ${sec % 60} सेकंड | सटीकता: ${pct}% | +${qz.correct * 5} XP</p>
        <div style="margin-top:1rem; display:flex; gap:.7rem; justify-content:center; flex-wrap:wrap;">
            <button class="btn btn-primary" onclick="backToQuizStart()">🔁 नया क्विज़</button>
            ${qz.wrong.length ? `<button class="btn" style="border:1px solid var(--border-light);" id="quiz-to-errors" onclick="quizWrongToErrors()">❌ ${qz.wrong.length} गलतियाँ एरर लॉग में जोड़ें</button>` : ''}
            <button class="btn" style="border:1px solid var(--border-light);" onclick="openSection('pyq')">🗂️ PYQ बैंक</button>
        </div>`;
    state.questions += qz.questions.length;
    state.correct += qz.correct;
    state.quizDone = (state.quizDone || 0) + 1;
    saveState();
    addXP(qz.correct * 5);
    updateDashboard();
    updateProfile();
    customQuiz = null;
}

function backToQuizStart() {
    document.getElementById('quiz-result').style.display = 'none';
    document.getElementById('quiz-start').style.display = 'block';
    document.getElementById('quiz-pool-info').textContent = 'इस चयन में ' + quizPool().length + ' प्रश्न उपलब्ध हैं';
}

function quizWrongToErrors() {
    lastQuizWrong.forEach(q => {
        const ai = quizAnswerIndex(q);
        state.errorLog.push({
            id: Date.now() + Math.floor(Math.random() * 1000000),
            topic: q.topic, type: 'क्विज़ में गलत',
            desc: String(q.question).slice(0, 140),
            lesson: 'सही उत्तर: ' + (q.options[ai] || q.answerLetter || ''),
            date: todayKey()
        });
    });
    saveState();
    renderErrors();
    const btn = document.getElementById('quiz-to-errors');
    if (btn) { btn.disabled = true; btn.textContent = '✅ एरर लॉग में जुड़ गईं'; }
    addXP(3);
}

/* ================= फ्लैशकार्ड ================= */
let flashDeck = [], flashIdx = 0, flashFlipped = false, flashKnownCount = 0, flashForgotCount = 0;
let flashRetry = [];
let flashKnownSession = new Set();

function initFlashcards() {
    const topics = [...new Set(FLASH_ALL.map(c => c.topic).filter(Boolean))].sort();
    document.getElementById('flash-topic').innerHTML = '<option value="all">सभी टॉपिक</option>' +
        topics.map(t => `<option value="${t}">${t}</option>`).join('');
}

function startFlashDeck(retryOnly) {
    let deck = retryOnly ? flashRetry.slice() : FLASH_ALL.slice();
    if (!retryOnly) {
        const topic = document.getElementById('flash-topic').value;
        if (topic !== 'all') deck = deck.filter(c => c.topic === topic);
    }
    if (!deck.length) { alert(retryOnly ? 'रिव्यू pile खाली है — पहले कुछ कार्ड खेलें!' : 'इस टॉपिक में कोई कार्ड नहीं मिला'); return; }
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    flashDeck = deck; flashIdx = 0; flashKnownCount = 0; flashForgotCount = 0;
    document.getElementById('flash-result').style.display = 'none';
    document.getElementById('flash-empty').style.display = 'none';
    document.getElementById('flash-wrap').style.display = 'block';
    renderFlash();
}

function renderFlash() {
    if (flashIdx >= flashDeck.length) { finishFlashDeck(); return; }
    flashFlipped = false;
    const c = flashDeck[flashIdx];
    document.getElementById('flash-topic-label').textContent = '🏷️ ' + c.topic + ' • कार्ड ' + (flashIdx + 1) + '/' + flashDeck.length;
    document.getElementById('flash-face').textContent = c.f;
    document.getElementById('flash-card').classList.remove('flipped');
    document.getElementById('flash-progress').innerHTML = 'कार्ड <b>' + (flashIdx + 1) + '/' + flashDeck.length + '</b> • ✅ याद: ' + flashKnownCount + ' • ❌ भूले: ' + flashForgotCount;
}

function flipFlash() {
    const c = flashDeck[flashIdx];
    if (!c) return;
    flashFlipped = !flashFlipped;
    document.getElementById('flash-face').textContent = flashFlipped ? c.b : c.f;
    document.getElementById('flash-card').classList.toggle('flipped', flashFlipped);
}

function gradeFlash(knew) {
    const c = flashDeck[flashIdx];
    if (!c) return;
    if (knew) {
        flashKnownCount++;
        if (!flashKnownSession.has(c.id)) {
            flashKnownSession.add(c.id);
            state.flashKnown = (state.flashKnown || 0) + 1;
            addXP(1);
        }
        flashRetry = flashRetry.filter(x => x.id !== c.id);
    } else {
        flashForgotCount++;
        if (!flashRetry.some(x => x.id === c.id)) flashRetry.push(c);
    }
    document.getElementById('flash-retry-count').textContent = flashRetry.length;
    flashIdx++;
    saveState();
    renderFlash();
}

function finishFlashDeck() {
    document.getElementById('flash-wrap').style.display = 'none';
    const res = document.getElementById('flash-result');
    res.style.display = 'block';
    const total = flashKnownCount + flashForgotCount;
    const pct = total ? Math.round(flashKnownCount / total * 100) : 0;
    res.innerHTML = `<h3>🃏 सेट पूरा!</h3>
        <p class="score-ring">${flashKnownCount}/${total}</p>
        <p class="muted">याद रखने की दर: ${pct}% • कुल याद: ${state.flashKnown || 0} कार्ड</p>
        <div style="margin-top:1rem; display:flex; gap:.7rem; justify-content:center; flex-wrap:wrap;">
            <button class="btn btn-primary" onclick="startFlashDeck(false)">🔀 नया सेट</button>
            ${flashRetry.length ? `<button class="btn" style="border:1px solid var(--border-light);" onclick="startFlashDeck(true)">🔁 ${flashRetry.length} भूले कार्ड दोहराएँ</button>` : ''}
        </div>`;
    updateProfile();
}

/* ================= नोट्स ================= */
function renderNotes() {
    if (!NOTES_ALL.length) {
        document.getElementById('notes-content').innerHTML = '<div class="no-data">नोट्स लोड नहीं हो पाए</div>';
        return;
    }
    document.getElementById('notes-pills').innerHTML = NOTES_ALL.map((t, i) =>
        `<button class="pill${i === 0 ? ' active' : ''}" data-notes="${t.id}" onclick="openNotesTopic('${t.id}')">${t.name}</button>`).join('');
    openNotesTopic(NOTES_ALL[0].id, true);
}

function openNotesTopic(id, silent) {
    const t = NOTES_ALL.find(x => x.id === id);
    if (!t) return;
    document.querySelectorAll('#notes-pills .pill').forEach(p =>
        p.classList.toggle('active', p.getAttribute('data-notes') === id));
    document.getElementById('notes-content').innerHTML = `
        <div class="notes-head"><h3>📓 ${t.name}</h3><span class="muted">⏱️ ${esc(t.minutes || '')}</span></div>
        ${t.sections.map(s => `
            <div class="note-sec">
                <h4>${esc(s.h)}</h4>
                ${s.b.map(p => `<p>${esc(p)}</p>`).join('')}
                ${(s.f || []).map(x => `<div class="note-formula">📌 ${esc(x)}</div>`).join('')}
                ${(s.ex || []).map(x => `<div class="note-ex"><b>✏️ ${esc(x.q)}</b><br>→ ${esc(x.s)}</div>`).join('')}
                ${s.lang === 'hi' ? '<span class="lang-badge hi">हिंदी विस्तृत</span>' : '<span class="lang-badge en">EN रेफरेंस</span>'}
            </div>`).join('')}`;
    if (!silent && !(state.notesRead || []).includes(id)) {
        state.notesRead.push(id);
        saveState();
        addXP(5);
    }
}

/* ================= मास्टरी रोडमैप ================= */
function renderMastery() {
    const M = MASTERY_ALL;
    if (!M || !M.topics || !M.topics.length) {
        document.getElementById('mastery-content').innerHTML = '<div class="no-data">मास्टरी डेटा लोड नहीं हो पाया</div>';
        return;
    }
    const m = M.master;
    if (m) {
        document.getElementById('mastery-master').innerHTML = `
            <div class="phase-card mastery-master">
                <h3>👑 ${esc(m.title)}</h3><div class="phase-sub">${esc(m.sub)}</div>
                <h4 style="margin:.8rem 0 .4rem;">📜 सुनहरे नियम</h4>
                <div class="rules-grid">${m.rules.map(r => `<div class="rule-card"><b>${esc(r.name)}</b><p>${esc(r.text)}</p></div>`).join('')}</div>
                <h4 style="margin:.8rem 0 .4rem;">🗺️ चरण</h4>
                ${m.phases.map(p => `<div class="pd-box"><b>${esc(p.name)}</b><br>📌 टॉपिक: ${p.topics.map(esc).join(', ')}<br>💡 ${esc(p.why)}<br>📅 रोज़: ${esc(p.daily)}</div>`).join('')}
                <h4 style="margin:.8rem 0 .4rem;">🔁 परीक्षा-हॉल प्रोटोकॉल</h4>
                <ul>${m.protocol.map(x => `<li>${esc(x)}</li>`).join('')}</ul>
            </div>`;
    }
    document.getElementById('mastery-pills').innerHTML = M.topics.map((t, i) =>
        `<button class="pill${i === 0 ? ' active' : ''}" data-mastery="${t.id}" onclick="openMasteryTopic('${t.id}')">${t.icon} ${t.name}</button>`).join('');
    openMasteryTopic(M.topics[0].id);
}

function openMasteryTopic(id) {
    const t = MASTERY_ALL.topics.find(x => x.id === id);
    if (!t) return;
    document.querySelectorAll('#mastery-pills .pill').forEach(p =>
        p.classList.toggle('active', p.getAttribute('data-mastery') === id));
    const stars = '⭐'.repeat(t.difficulty || 1);
    document.getElementById('mastery-content').innerHTML = `
        <div class="phase-card" style="border-top:4px solid ${t.color || 'var(--primary)'};">
            <h3>${t.icon} ${t.name} — मास्टरी प्लान</h3>
            <div class="phase-sub">${stars} &nbsp;•&nbsp; ⏱️ ${esc(t.time || '')}</div>
            <div class="weight-grid">
                <div class="weight-box"><b>Tier 1</b><span>${esc(t.weightage.tier1)}</span></div>
                <div class="weight-box"><b>Tier 2</b><span>${esc(t.weightage.tier2)}</span></div>
                <div class="weight-box"><b>RRB</b><span>${esc(t.weightage.rrb)}</span></div>
            </div>
            <div class="pd-box">💡 <b>क्यों ज़रूरी:</b> ${esc(t.weightage.note)}</div>
            <div class="pd-box">${esc(t.why)}</div>
            <h4 style="margin:.8rem 0 .4rem;">🗓️ दिन-वाइज़ प्लान</h4>
            ${t.plan.map(p => `<div class="pd-box"><b>${esc(p.days)} — ${esc(p.title)}</b><br>🎯 ${esc(p.action)}
                <ul style="margin:.4rem 0;">${p.details.map(d => `<li>${esc(d)}</li>`).join('')}</ul>
                <span style="font-size:.85rem; color:var(--success); font-weight:700;">🏁 लक्ष्य: ${esc(p.target)}</span></div>`).join('')}
            <div class="do-avoid">
                <div class="do-box"><h4>✅ करें</h4><ul>${t.do.map(d => `<li>${esc(d)}</li>`).join('')}</ul></div>
                <div class="avoid-box"><h4>🚫 न करें</h4><ul>${t.avoid.map(d => `<li>${esc(d)}</li>`).join('')}</ul></div>
            </div>
            <h4 style="margin:.8rem 0 .4rem;">⚡ तकनीकें</h4>
            ${t.tech.map(x => `<div class="pd-box formula"><b>${esc(x.name)}</b><br>${esc(x.how)}<br><span style="font-size:.88rem;">✏️ ${esc(x.example)}</span></div>`).join('')}
            <h4 style="margin:.8rem 0 .4rem;">✏️ हल किए प्रश्न</h4>
            ${t.worked.map((w, i) => `
                <div class="practice-item" style="border:1px solid var(--border-light); border-radius:10px; padding:.7rem 1rem; margin-bottom:.5rem;">
                    <b>${i + 1}. ${esc(w.q)}</b>${w.source ? ` <span class="muted" style="font-size:.78rem;">(${esc(w.source)})</span>` : ''}
                    ${w.options ? `<div class="pyq-options" style="margin:.4rem 0;">${w.options.map((o, k) => 'abcd'[k] + ') ' + esc(o)).join('  ')}</div>` : ''}
                    <button class="drill-btn" style="padding:.3rem .8rem; font-size:.8rem;" onclick="this.nextElementSibling.style.display=this.nextElementSibling.style.display==='none'?'block':'none'">💡 हल देखें</button>
                    <div style="display:none; margin-top:.5rem;">
                        ${w.steps.map((s, k) => `<div class="step"><b>चरण ${k + 1}:</b> ${esc(s)}</div>`).join('')}
                        <div style="font-weight:800; color:var(--success);">✔ उत्तर: ${esc(w.answer)}</div>
                        ${w.fast ? `<div class="pd-box">⚡ ${esc(w.fast)}</div>` : ''}
                    </div>
                </div>`).join('')}
            <div class="pd-box pyq"><b>📅 रोज़ का अभ्यास:</b> ${t.daily.questions} प्रश्न / ${t.daily.minutes} मिनट<br>🎯 फोकस: ${esc(t.daily.focus)}<br>🏋️ ड्रिल: ${esc(t.daily.drill)}</div>
            <h4 style="margin:.8rem 0 .4rem;">☑️ चेकलिस्ट</h4>
            <ul>${t.checklist.map(c => `<li>${esc(c)}</li>`).join('')}</ul>
            <h4 style="margin:.8rem 0 .4rem;">💡 टिप्स</h4>
            <ul>${t.tips.map(x => `<li>${esc(x)}</li>`).join('')}</ul>
        </div>`;
}

/* ================= टाइमर ================= */
let timerTotal = 600, timerLeft = 600, timerInt = null;

function fmtTime(s) {
    s = Math.max(0, s);
    return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
}

function updateTimerUI() {
    document.getElementById('timer-display').textContent = fmtTime(timerLeft);
    const pct = timerTotal ? Math.round((timerTotal - timerLeft) / timerTotal * 100) : 0;
    document.getElementById('timer-fill').style.width = pct + '%';
}

function setTimer(m) {
    if (timerInt) { clearInterval(timerInt); timerInt = null; }
    timerTotal = m * 60; timerLeft = timerTotal;
    document.getElementById('timer-toggle').textContent = '▶ शुरू करें';
    document.getElementById('timer-status').textContent = m + ' मिनट का टाइमर तैयार है — शुरू करें!';
    updateTimerUI();
}

function setTimerCustom() {
    const m = parseInt(document.getElementById('timer-minutes').value, 10);
    if (!m || m < 1 || m > 180) { alert('1 से 180 के बीच मिनट लिखें'); return; }
    setTimer(m);
}

function toggleTimer() {
    const btn = document.getElementById('timer-toggle');
    if (timerInt) {
        clearInterval(timerInt); timerInt = null;
        btn.textContent = '▶ फिर से शुरू करें';
        document.getElementById('timer-status').textContent = '⏸️ रुका हुआ — ' + fmtTime(timerLeft) + ' बचा है';
        return;
    }
    if (timerLeft <= 0) timerLeft = timerTotal;
    btn.textContent = '⏸️ रोकें';
    document.getElementById('timer-status').textContent = '⏳ चल रहा है… ध्यान लगाकर हल कीजिए!';
    updateTimerUI();
    timerInt = setInterval(() => {
        timerLeft--;
        updateTimerUI();
        if (timerLeft <= 0) {
            clearInterval(timerInt); timerInt = null;
            btn.textContent = '▶ फिर से शुरू करें';
            document.getElementById('timer-status').textContent = '⏰ समय समाप्त! शाबाश! 🎉';
            timerBeep();
        }
    }, 1000);
}

function resetTimer() {
    if (timerInt) { clearInterval(timerInt); timerInt = null; }
    timerLeft = timerTotal;
    document.getElementById('timer-toggle').textContent = '▶ शुरू करें';
    document.getElementById('timer-status').textContent = 'टाइमर तैयार है — समय चुनकर शुरू करें';
    updateTimerUI();
}

function timerBeep() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        [0, 0.3, 0.6].forEach(delay => {
            const o = ctx.createOscillator();
            const g = ctx.createGain();
            o.connect(g); g.connect(ctx.destination);
            o.frequency.value = 880;
            g.gain.setValueAtTime(0.001, ctx.currentTime + delay);
            g.gain.exponentialRampToValueAtTime(0.5, ctx.currentTime + delay + 0.05);
            g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.25);
            o.start(ctx.currentTime + delay);
            o.stop(ctx.currentTime + delay + 0.3);
        });
    } catch (e) { /* ऑडियो नहीं चला तो कोई बात नहीं */ }
}

/* ================= 🔥 90-दिन चैलेंज इंजन ================= */
const CHALLENGE_90_DATA = (typeof CHALLENGE_90 !== 'undefined') ? CHALLENGE_90 : [];
const CH_MILESTONES_DATA = (typeof CH_MILESTONES !== 'undefined') ? CH_MILESTONES : [];
let chViewDay = null;  // चैलेंज सेक्शन में चुना हुआ दिन (null = आज का दिन)

function challengeCurrentDay() {
    if (!state.challenge.start) return null;
    const start = new Date(state.challenge.start + 'T00:00:00');
    const diff = Math.floor((new Date(todayKey() + 'T00:00:00') - start) / 86400000);
    return Math.min(Math.max(diff + 1, 1), 90);
}
function challengeDoneCount() { return Object.keys(state.challenge.done).filter(k => state.challenge.done[k]).length; }
function challengeProgressPct() { return Math.round(challengeDoneCount() / 90 * 100); }
function challengeDayDate(d) {
    const start = new Date(state.challenge.start + 'T00:00:00');
    start.setDate(start.getDate() + d - 1);
    return start.getDate() + '/' + (start.getMonth() + 1);
}
function challengePhaseOf(day) {
    const groups = [ [1, 28, ['🟢', 'नींव व अंकगणित कोर']], [29, 56, ['🟡', 'PYQ अभियान + मेंसुरेशन + बीजगणित']],
        [57, 84, ['🟠', 'एडवांस्ड — ज्यामिति त्रिग आँकड़े']], [85, 90, ['👑', 'फाइनल मोड']] ];
    const g = groups.find(x => day >= x[0] && day <= x[1]);
    return g ? g[2] : ['', ''];
}

function renderChallengeMini() {
    const ring = document.getElementById('hero-ch-ring');
    if (!ring) return;
    const btn = document.getElementById('hero-ch-action');
    const info = document.getElementById('hero-ch-info');
    if (!state.challenge.start) {
        ring.style.background = 'conic-gradient(var(--primary) 0%, var(--track) 0%)';
        ring.innerHTML = '<div class="ring-core"><b>0</b><span>/90</span></div>';
        info.innerHTML = '<b>90-दिन गणित चैलेंज</b><span>पूरा syllabus, दिन-वाइज़ टाइमटेबल के साथ — आज Day 1 बनाइए!</span>';
        btn.innerHTML = '🚀 चैलेंज शुरू करें';
        btn.onclick = () => { openSection('challenge'); };
        return;
    }
    const cd = challengeCurrentDay();
    const done = challengeDoneCount();
    const pct = challengeProgressPct();
    ring.style.background = 'conic-gradient(var(--primary) ' + pct + '%, var(--track) ' + pct + '%)';
    ring.innerHTML = '<div class="ring-core"><b>' + pct + '%</b><span>पूरा</span></div>';
    const behind = Math.max(0, cd - 1 - done);
    info.innerHTML = '<b>दिन ' + cd + '/90</b> • ' + done + ' दिन पूरे' +
        (behind > 0 ? '<span class="warn">⚠️ ' + behind + ' दिन पीछे — आज पकड़ लें!</span>' : '<span>⭐ शानदार रफ्तार है!</span>');
    if (cd >= 90 && done >= 90) {
        btn.innerHTML = '🏆 चैंपियन रिपोर्ट देखें';
    } else if (state.challenge.done[cd]) {
        btn.innerHTML = '✅ आज का दिन पूरा — फिर भी देखें';
    } else {
        btn.innerHTML = '▶ दिन ' + cd + ' की चेकलिस्ट';
    }
    btn.onclick = () => { chViewDay = null; openSection('challenge'); };
}

function startChallenge() {
    if (state.challenge.start) return;
    const errStart = todayKey();
    state.challenge.start = errStart;
    state.challenge.done = {};
    state.challenge.checks = {};
    saveState();
    addXP(20);
    chViewDay = null;
    renderChallenge();
}

function restartChallenge() {
    if (!confirm('चैलेंज दोबारा शुरू करें? पुराने दिनों के टिक हट जाएँगे (XP, प्रश्न-डेटा, एरर लॉग सुरक्षित रहेगा)।')) return;
    state.challenge = { start: todayKey(), done: {}, checks: {}, rewards: [] };
    saveState();
    chViewDay = null;
    renderChallenge();
}

function renderChallenge() {
    const wrap = document.getElementById('ch-stage');
    if (!wrap || !CHALLENGE_90_DATA.length) return;

    if (!state.challenge.start) {
        wrap.innerHTML = `<div class="ch-start card">
            <div class="ch-start-emoji">🏔️</div>
            <h3>90-दिन गणित चैलेंज — पूरा syllabus, एक मिशन</h3>
            <p>SSC व Railway गणित का <b>पूरा sillebus</b> 13 सप्ताह में: हर दिन <b>क्या पढ़ना है, क्या रिवाइज़ करना है, क्या प्रैक्टिस करना है</b> — सब तय। हर सप्ताह रिवीज़न + टेस्ट। हर दिन पूरा करने पर XP, मील-स्टोन बैज और streak।</p>
            <div class="ch-start-grid">
                <div><b>90</b><span>दिन की journey</span></div>
                <div><b>13</b><span>सप्ताह की संरचना</span></div>
                <div><b>64</b><span>सीखने के दिन</span></div>
                <div><b>25+</b><span>रिवीज़न/टेस्ट दिन</span></div>
            </div>
            <ul class="ch-start-rules">
                <li>📅 हर दिन 2-3 घंटे — चेकलिस्ट सच बोलेगी</li>
                <li>🧮 रोज़ की कैलकुलेशन ड्रिल चैलेंज में शामिल</li>
                <li>🔄 शनिवार रिवीज़न, रविवार टेस्ट — लय नहीं टूटेगी</li>
                <li>🏆 90 दिन पूरे = 'गणित चैंपियन' सम्मान</li>
            </ul>
            <button class="btn btn-primary btn-lg" onclick="startChallenge()">🚀 आज से Day 1 शुरू करें</button>
            <small class="muted">शुरुआत आज की तारीख से गिनी जाएगी; progress आपके नाम के साथ सुरक्षित रहेगी।</small>
        </div>`;
        return;
    }

    const cd = challengeCurrentDay();
    const viewDay = (chViewDay && chViewDay >= 1 && chViewDay <= 90) ? chViewDay : cd;
    const day = CHALLENGE_90_DATA[viewDay - 1];
    const done = challengeDoneCount();
    const pct = challengeProgressPct();
    const phase = challengePhaseOf(viewDay);
    const isDone = !!state.challenge.done[viewDay];
    const isToday = viewDay === cd;
    const isFuture = viewDay > cd;
    const typeLabel = { learn: '📚 सीखने का दिन', revise: '🔄 रिवीज़न डे', test: '📝 टेस्ट डे', mock: '🏆 फिनाले मॉक' };

    // हीरो बार
    let html = `<div class="ch-hero card">
        <div class="ch-hero-left">
            <div class="ch-hero-title">${phase[0]} ${CH_MILESTONES_DATA.length ? esc(challengePhaseOf(viewDay)[1]) : ''}</div>
            <div class="ch-hero-big">दिन <b>${cd}</b><span>/90</span></div>
            <div class="ch-hero-sub">${state.challenge.start} से शुरू • ${done} दिन पूरे • ${pct}% सम्पन्न</div>
            <div class="ch-progress-bar"><span style="width:${pct}%"></span></div>
            <div class="ch-hero-btns">
                ${!isDone && !isFuture && isToday ? `<button class="btn btn-primary" onclick="chCompleteDay(${viewDay})">✅ दिन ${viewDay} पूरा करें</button>` : ''}
                ${!isDone && !isFuture && !isToday ? `<button class="btn btn-primary" onclick="chCompleteDay(${viewDay})">✅ छूटा दिन ${viewDay} पूरा करें</button>` : ''}
                ${isDone ? `<button class="btn" style="border:1px solid var(--border-light);" onclick="chCompleteDay(${viewDay})">↩️ दिन वापस खोलें</button>` : ''}
                <button class="btn" style="border:1px solid var(--border-light);" onclick="restartChallenge()">🔁 चैलेंज रीस्थট</button>
            </div>
        </div>
        <div class="ch-ring-lg" style="background:conic-gradient(var(--primary) ${pct}%, var(--track) ${pct}%);">
            <div class="ring-core"><b>${pct}%</b><span>पूरा</span></div>
        </div>
    </div>`;

    // दिन-वाइज़ स्ट्रिप (90 सेल)
    html += '<div class="ch-strip card"><div class="ch-strip-grid">' + CHALLENGE_90_DATA.map(dz => {
        const cls = state.challenge.done[dz.d] ? 'done' : (dz.d === viewDay ? 'view' : (dz.d === cd ? 'today' : (dz.d > cd ? 'lock' : 'miss')));
        const typeDot = dz.type === 'learn' ? '' : (dz.type === 'revise' ? 'R' : (dz.type === 'test' ? 'T' : '🏆'));
        return `<button class="ch-cell ${cls} t-${dz.type}" title="दिन ${dz.d} — ${esc(dz.title)}" onclick="chSelectDay(${dz.d})">${typeDot || dz.d}</button>`;
    }).join('') + '</div><div class="ch-strip-legend"><span><i class="dot done"></i>पूरा</span><span><i class="dot today"></i>आज</span><span><i class="dot miss"></i>छूटा</span><span><i class="dot lock"></i>आगे का</span><span><i class="dot view"></i>देख रहे हैं</span> • R=रिवीज़न, T=टेस्ट</div></div>';

    // चुने हुए दिन का विवरण
    const checks = state.challenge.checks || {};
    const taskHtml = (list, gi) => list.map((t, i) => {
        const key = viewDay + '-' + gi + '-' + i;
        const ck = !!checks[key] || isDone;
        const goBtn = chActionBtn(t.go);
        return `<div class="ch-task ${ck ? 'done' : ''}">
            <button class="ch-check" ${isFuture ? '' : `onclick="chToggleTask('${key}',${viewDay})"`} aria-label="टिक करें">${ck ? '✅' : '⬜'}</button>
            <div class="ch-task-text"><span>${t.i} ${esc(t.t)}</span></div>
            ${goBtn}
        </div>`;
    }).join('');

    const calcNames = { tables: '🎲 पहाड़े', squares: '🔲 वर्ग', fracPercent: '💯 भिन्न→%', addSub: '➕ जोड़-घटाव', twoDigitMul: '✖️ 2-अंकीय गुणा', percentCalc: '💹 % सवाल', successive: '📉 सतत %', series: '🔢 श्रेणी योग', sqrt: '√ वर्गमूल', unitDigit: '🔚 इकाई अंक', remainder: '➗ शेषफल', cubes: '🧊 घन', cubeRoot: '∛ घनमूल', chainAdd: '⛓️ जंजीरी जोड़', mixedSprint: '⚡ मिक्स्ड स्प्रिंट' };

    html += `<div class="ch-day card ${isDone ? 'is-done' : ''}">
        <div class="ch-day-head">
            <div>
                <div class="ch-day-type">${typeLabel[day.type]} • दिन ${day.d}/90 ${viewDay !== cd ? `<button class="ch-today-btn" onclick="chSelectDay(${cd})">⤳ आज के दिन पर जाएँ (दिन ${cd})</button>` : ''}</div>
                <h3>${esc(day.title)}</h3>
                <p class="muted">${esc(day.sub)} • ⏱️ अनुमानित समय: ${day.mins} मिनट ${state.challenge.start ? '• 📅 ' + challengeDayDate(day.d) : ''}</p>
            </div>
            <div class="ch-day-badge">${isDone ? '✅ पूरा' : (isFuture ? '🔒 आगामी' : (isToday ? '🔥 आज' : '⏳ पेंडिंग'))}</div>
        </div>
        ${day.chap && FORMULA_BOOK.find(c => c.id === day.chap) ? `<div class="ch-chap-link">📚 आज का अध्याय: <b>${FORMULA_BOOK.find(c => c.id === day.chap).name}</b> <button class="drill-btn" onclick="openChapter('${day.chap}')">खोलें →</button></div>` : ''}
        <div class="ch-cols">
            <div class="ch-col"><h4>🎯 आज का पढ़ाई-कार्यक्रम</h4>${taskHtml(day.tasks, 0)}</div>
            <div class="ch-col"><h4>🔁 रिवीज़न (कल/पुराना)</h4>${taskHtml(day.rev, 1)}
                <h4 style="margin-top:1rem;">🧮 आज की कैलकुलेशन ड्रिल</h4>
                ${day.calc.map(g => `<button class="drill-btn ch-drill" onclick="openSection('calculation');startDrill('${g}')">${calcNames[g] || g} ▶</button>`).join(' ')}
                <div class="muted" style="margin-top:.4rem; font-size:.8rem;">60 सेकंड के 2 राउंड — कैलकुलेशन बूस्टर में target तक पहुँचें।</div>
            </div>
        </div>
        ${day.topics && day.topics.length ? `<div class="ch-topic-chips">${day.topics.map(tp => `<button class="tag ch-tag" onclick="openPyqTopic('${esc(tp)}')">🗂️ ${esc(tp)} PYQ</button>`).join('')}</div>` : ''}
    </div>`;

    // मील-स्टोन
    html += '<div class="ch-miles card"><h4>🏅 मील के पत्थर</h4><div class="ch-mile-grid">' + CH_MILESTONES_DATA.map(mz => {
        const got = done >= mz.d;
        return `<div class="ch-mile ${got ? 'got' : ''}" title="${esc(mz.hint)}"><span>${mz.icon}</span><b>दिन ${mz.d}</b><small>${mz.name}</small></div>`;
    }).join('') + '</div></div>';

    // पूरा टाइमटेबल (सप्ताहवार, मुड़ने वाला)
    let table = '<div class="ch-full"><h4>🗓️ पूरा 90-दिन टाइमटेबल</h4>';
    for (let wNo = 1; wNo <= 13; wNo++) {
        const weekDays = CHALLENGE_90_DATA.filter(dz => dz.wk === wNo);
        const wDone = weekDays.filter(dz => state.challenge.done[dz.d]).length;
        const open = weekDays.some(dz => dz.d === viewDay);
        table += `<details class="ch-week" ${open ? 'open' : ''}>
            <summary>सप्ताह ${wNo} <b>${wDone}/${weekDays.length}</b> — दिन ${weekDays[0].d}–${weekDays[weekDays.length - 1].d} (${esc(weekDays[0].sub.split('•').pop().trim())})</summary>
            <div class="ch-week-days">` + weekDays.map(dz => `
                <button class="ch-week-row t-${dz.type} ${state.challenge.done[dz.d] ? 'done' : ''} ${dz.d === viewDay ? 'view' : ''}" onclick="chSelectDay(${dz.d})">
                    <span class="cwr-d">${state.challenge.done[dz.d] ? '✅' : 'दिन ' + dz.d}</span>
                    <span class="cwr-t">${esc(dz.title)}</span>
                    <span class="cwr-mins">${dz.mins} मि</span>
                </button>`).join('') + `</div></details>`;
    }
    html += table + '</div>';

    wrap.innerHTML = html;
}

function chSelectDay(d) { chViewDay = d; renderChallenge(); }

function chToggleTask(key, dayNo) {
    if (!state.challenge.checks) state.challenge.checks = {};
    state.challenge.checks[key] = !state.challenge.checks[key];
    saveState();
    renderChallenge();
}

function chCompleteDay(d) {
    if (!state.challenge.start) return;
    const was = !!state.challenge.done[d];
    state.challenge.done[d] = !was;
    if (!was) {
        state.xp += 30;
        // दिन के सारे टास्क भी टिक मानें
        const day = CHALLENGE_90_DATA[d - 1];
        day.tasks.forEach((t, i) => { state.challenge.checks[d + '-0-' + i] = true; });
        day.rev.forEach((t, i) => { state.challenge.checks[d + '-1-' + i] = true; });
    }
    saveState();
    renderChallenge();
    updateDashboard();
    updateProfile();
}

function chActionBtn(go) {
    if (!go) return '';
    const map = {
        chapter: [`openChapter('${go[1]}')`, '📖 खोलें'],
        pyq: [`openPyqTopic('${go[1]}')`, '🗂️ PYQ'],
        quiz: [`startPresetQuiz(${go[1]})`, '🎮 शुरू'],
        daily: [`openSection('daily')`, '📅 खोलें'],
        flash: [`openSection('flashcards')`, '🃏 खोलें'],
        errors: [`openSection('error-log')`, '❌ खोलें'],
        traps: [`openSection('traps')`, '🛡️ खोलें'],
        revision: [`openSection('revision')`, '🔄 खोलें'],
        section: [`openSection('${go[1]}')`, '➜ खोलें'],
        calc: [`openSection('calculation')`, '🧮 खोलें'],
        profile: [`openSection('profile')`, '👤 खोलें'],
    };
    const m = map[go[0]];
    if (!m) return '';
    return `<button class="ch-go" onclick="${m[0]}">${m[1]}</button>`;
}

function openPyqTopic(topic) {
    openSection('pyq');
    const sel = document.getElementById('pyq-topic-filter');
    let found = false;
    if (sel) {
        for (const opt of sel.options) { if (opt.value === topic) { found = true; break; } }
        sel.value = found ? topic : 'all';
    }
    pyqFilters.topic = found ? topic : 'all';
    if (!found) {
        const search = document.getElementById('pyq-search');
        if (search) { search.value = topic; pyqFilters.search = topic.toLowerCase(); }
    } else {
        const search = document.getElementById('pyq-search');
        if (search) search.value = '';
        pyqFilters.search = '';
    }
    pyqShown = PYQ_PAGE;
    renderPyq();
}

function startPresetQuiz(count) {
    openSection('quiz');
    document.getElementById('quiz-topic').value = 'all';
    document.getElementById('quiz-lang').value = 'all';
    const cnt = document.getElementById('quiz-count');
    cnt.value = String(Math.min(30, Math.max(10, count || 25)));
    quizExamOverride = null;
    startQuiz();
}

/* ================= 🧮 कैलकुलेशन बूस्टर 2.0: कॉन्फ़िग + इतिहास + वर्कआउट ================= */
let drillConfig = { secs: 60, diff: 1 };  // diff: 0 आसान, 1 मध्यम, 2 कठिन

function drillConfigInit() {
    const sSel = document.getElementById('drill-duration');
    const dSel = document.getElementById('drill-difficulty');
    if (sSel) sSel.addEventListener('change', e => { drillConfig.secs = parseInt(e.target.value, 10) || 60; });
    if (dSel) dSel.addEventListener('change', e => { drillConfig.diff = parseInt(e.target.value, 10) || 0; });
    renderCalcScorecard();
}

const DIFF_LABEL = ['🌱 आसान', '💪 मध्यम', '🔥 कठिन'];

function renderCalcScorecard() {
    const el = document.getElementById('calc-scorecard');
    if (!el) return;
    const hist = state.drillHistory || [];
    const workoutDays = Object.keys(state.calcWorkout || {}).length;
    const totalBest = Object.values(state.bestDrill || {}).reduce((a, b) => a + (b || 0), 0);
    const drillsPlayed = new Set(hist.map(h => h.gen)).size;
    el.innerHTML = [
        ['🏆', totalBest, 'कुल best स्कोर-योग'],
        ['🎯', drillsPlayed + '/' + DRILLS.length, 'ड्रिल्स आज़माई'],
        ['💪', workoutDays, 'वर्कआउट दिन'],
        ['⚡', getBestDrill(), 'सर्वश्रेष्ठ (एक ड्रिल)']
    ].map(x => `<div class="calc-stat"><b>${x[0]} ${x[1]}</b><span>${x[2]}</span></div>`).join('');
    renderWorkoutStatus();
}

function updateDrillHistoryAfter(d) {
    if (!state.drillHistory) state.drillHistory = [];
    state.drillHistory.unshift({ gen: d.gen, score: d.score, correct: d.correct, wrong: d.wrong, sec: d.totalSecs || 60, diff: d.diff == null ? 1 : d.diff, date: todayKey() });
    state.drillHistory = state.drillHistory.slice(0, 60);
    saveState();
}

function drillTrendHtml(gen) {
    const hist = (state.drillHistory || []).filter(h => h.gen === gen).slice(0, 10).reverse();
    if (!hist.length) return '';
    const max = Math.max(...hist.map(h => h.score), 1);
    return '<div class="drill-trend">' + hist.map(h =>
        `<div class="dt-bar" style="height:${Math.max(8, Math.round(h.score / max * 60))}px" title="${h.date}: ${h.score} (${DIFF_LABEL[h.diff] || ''})"></div>`).join('') + '</div><div class="muted" style="font-size:.75rem;">पिछले ' + hist.length + ' प्रयास</div>';
}

/* -------- दैनिक कैलकुलेशन वर्कआउट (तारीख-seeded 15 मिश्रित सवाल) -------- */
let calcWorkout = null;

function buildWorkoutSet() {
    const key = todayKey();
    const rand = seededRandom('calc-' + key);
    const gens = ['tables', 'squares', 'fracPercent', 'addSub', 'percentCalc', 'twoDigitMul', 'baseMul', 'successive', 'cubes', 'chainAdd', 'sqrt', 'unitDigit'];
    const pool = [];
    for (let i = 0; i < 15; i++) {
        const g = gens[Math.floor(rand() * gens.length)];
        pool.push(genDrillQuestion(g, 1));
    }
    return pool;
}

function renderWorkoutStatus() {
    const el = document.getElementById('calc-workout-status');
    if (!el) return;
    const key = todayKey();
    const rec = state.calcWorkout[key];
    const recent = Object.keys(state.calcWorkout).sort().slice(-10);
    let bars = '';
    if (recent.length) {
        const entries = recent.map(k => ({ k, r: state.calcWorkout[k] }));
        const max = Math.max(...entries.map(e => e.r.score), 1);
        bars = '<div class="wo-bars">' + entries.map(e => {
            const pctv = Math.round(e.r.score / e.r.total * 100);
            return `<div class="wo-bar ${e.k === key ? 'today' : ''}" style="height:${Math.max(10, Math.round(pctv * 0.7))}px" title="${e.k}: ${e.r.score}/${e.r.total}"></div>`;
        }).join('') + '</div>';
    }
    el.innerHTML = rec
        ? `<div class="wo-done">✅ आज का वर्कआउट पूरा: <b>${rec.score}/${rec.total}</b> • ${rec.sec} सेकंड</div>${bars}<button class="btn btn-primary" onclick="startCalcWorkout()">🔁 फिर से वर्कआउट</button>`
        : `<p class="muted">आज का वर्कआउट बाकी है — 15 मिश्रित सवाल, टाइमर के साथ। हर दिन 3 मिनट = 90 दिन में कैलकुलेटर-स्पीड!</p>${bars}
           <button class="btn btn-primary btn-lg" onclick="startCalcWorkout()">▶ आज का वर्कआउट शुरू करें</button>`;
}

function startCalcWorkout() {
    calcWorkout = { questions: buildWorkoutSet(), idx: 0, correct: 0, start: Date.now() };
    document.getElementById('calc-workout-status').style.display = 'none';
    const play = document.getElementById('calc-workout-play');
    play.style.display = 'block';
    renderWorkoutQuestion();
}

function renderWorkoutQuestion() {
    const q = calcWorkout.questions[calcWorkout.idx];
    document.getElementById('wo-qno').textContent = (calcWorkout.idx + 1);
    document.getElementById('wo-qtotal').textContent = calcWorkout.questions.length;
    document.getElementById('wo-score').textContent = calcWorkout.correct;
    document.getElementById('wo-question').textContent = q.q;
    const inp = document.getElementById('wo-input');
    inp.value = '';
    inp.focus();
    const fb = document.getElementById('wo-feedback');
    fb.className = 'drill-feedback';
    fb.textContent = '';
}

function checkWorkoutAnswer() {
    const q = calcWorkout.questions[calcWorkout.idx];
    const val = parseFloat(document.getElementById('wo-input').value.trim().replace(',', '.'));
    const fb = document.getElementById('wo-feedback');
    if (isNaN(val)) { fb.className = 'drill-feedback bad'; fb.textContent = 'कृपया संख्या लिखें!'; return; }
    const tol = q.tol || 0.02;
    const good = Math.abs(val - q.a) <= tol;
    if (good) calcWorkout.correct++;
    fb.className = 'drill-feedback ' + (good ? 'good' : 'bad');
    fb.textContent = (good ? '✅ इन्होंने सही!' : '❌ सही उत्तर: ' + q.a);
    document.getElementById('wo-score').textContent = calcWorkout.correct;
    setTimeout(() => {
        calcWorkout.idx++;
        if (calcWorkout.idx >= calcWorkout.questions.length) finishCalcWorkout();
        else renderWorkoutQuestion();
    }, 600);
}

function finishCalcWorkout() {
    const sec = Math.round((Date.now() - calcWorkout.start) / 1000);
    const key = todayKey();
    const prev = state.calcWorkout[key];
    const isBest = !prev || calcWorkout.correct > prev.score;
    state.calcWorkout[key] = { score: calcWorkout.correct, total: calcWorkout.questions.length, sec };
    saveState();
    addXP(calcWorkout.correct * 2);
    document.getElementById('calc-workout-play').style.display = 'none';
    const stEl = document.getElementById('calc-workout-status');
    stEl.style.display = 'block';
    renderWorkoutStatus();
    renderCalcScorecard();
    const pct = Math.round(calcWorkout.correct / calcWorkout.questions.length * 100);
    const msg = pct >= 93 ? '🏆 कैलकुलेटर-लेवल!' : pct >= 80 ? '🚀 स्पीड बढ़ रही है!' : pct >= 60 ? '💪 अच्छी शुरुआत — रोज़ आएँ!' : '📚 आज के formulas दोहराकर कल फिर आएँ!';
    stEl.insertAdjacentHTML('afterbegin', `<div class="wo-result-flash">${msg} Score: <b>${calcWorkout.correct}/15</b> (${sec} सेकंड) ${isBest ? '• 🆕 नया best!' : ''}</div>`);
    setTimeout(() => { const x = stEl.querySelector('.wo-result-flash'); if (x) x.remove(); }, 4000);
    calcWorkout = null;
    updateDashboard();
    updateProfile();
}

/* ================= बूट ================= */
/* ================= सहायक ================= */
function esc(s) {
    return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/\n/g, '<br>');
}

/* सभी व्यूज़ को दोबारा खींचें (लॉगिन/रीসet के बाद) */
function refreshAllViews() {
    updateDashboard();
    updateProfile();
    renderLearn();
    renderFormulaChapters();
    renderPatterns();
    renderTraps();
    renderErrors();
    renderExams();
    renderMastery();
    renderDailyHeader();
    renderFastTopics();
    renderCalcLevel();
    renderDrillSelect();
    renderCalcScorecard();
    renderChallenge();
}

/* ================= बूट ================= */
let appBooted = false;
function bootApp() {
    if (appBooted) return;
    appBooted = true;
    initTheme();
    initNav();
    initLearnSearch();
    initFormulaSearch();
    initCalculation();
    initFastTricks();
    initPyq();
    initQuiz();
    initFlashcards();
    initErrorTopicSelect();
    initPdfResearch();
    initPlan();
    initPatternTrapSearch();
    drillConfigInit();

    // वर्कआउट बटन/इनपुट
    const woCheck = document.getElementById('wo-check');
    if (woCheck) woCheck.addEventListener('click', checkWorkoutAnswer);
    const woInput = document.getElementById('wo-input');
    if (woInput) woInput.addEventListener('keydown', e => { if (e.key === 'Enter') checkWorkoutAnswer(); });

    updateDashboard();
    renderLearn();
    renderFormulaChapters();
    renderPatterns();
    renderTraps();
    renderErrors();
    renderExams();
    renderNotes();
    renderMastery();
    renderDailyHeader();
    updateTimerUI();
    updateProfile();
    renderCalcScorecard();
    renderChallenge();
    updateTopbarChips();

    const initialSection = window.location.hash.slice(1);
    if (initialSection) openSection(initialSection, false);

    const errorModal = document.getElementById('error-modal');
    if (errorModal) errorModal.addEventListener('click', e => {
        if (e.target === errorModal) closeErrorModal();
    });
}

document.addEventListener('DOMContentLoaded', function () {
    bootApp();
    initUserModal();
});
