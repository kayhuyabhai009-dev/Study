/* ============================================================
   MATHMASTERY ENGINE v2 — MAIN APPLICATION
   (Deep Research Edition)
   ------------------------------------------------------------
   Wires the UI (index.html) to:
     • the deep-research data files (window.PYQ_BANK etc.)
     • the stateful engines (MMProgress, MMSRS, MMSpeed,
       MMTimer, MMErrors, MMPlan, MMCalc, MMNotes)
     • the quiz/mock engine (MMQuiz)

   Sections rendered here:
     Dashboard · Learn · Formulas · PYQ Bank · Quiz (shell) ·
     Patterns · Traps · Speed Maths · Flashcards · Calc Lab
     (wiring) · Error Log · Revision · 90-Day Plan · Timer ·
     Profile

   Design rules:
     - zero hardcoded "content" data: every number shown comes
       from the data files or from MMStore (live user state)
     - every list render is idempotent (safe to re-run on
       filter/theme/state changes)
     - all question text is HTML-escaped (MMUtil.esc) because
       extracted PYQ text can contain < > & characters
   ============================================================ */

'use strict';

/* ============================================================
   0. Topic registry
   ------------------------------------------------------------
   The 11 topic ids used by ALL data files (notes, formulas,
   PYQ bank, patterns, traps, flashcards, plan weights).
   Display names + icons live here so we have ONE source of
   truth for the UI.
   ============================================================ */
var MM_TOPICS = {
    'number-system':        { name: 'Number System',       icon: '🔢' },
    'simplification':       { name: 'Simplification',      icon: '➗' },
    'algebra':              { name: 'Algebra',             icon: '📐' },
    'ratio-proportion':     { name: 'Ratio & Proportion',  icon: '⚖️' },
    'partnership':          { name: 'Partnership',         icon: '🤝' },
    'trigonometry':         { name: 'Trigonometry',        icon: '📏' },
    'heights-distances':    { name: 'Heights & Distances', icon: '🗼' },
    'geometry':             { name: 'Geometry',            icon: '🔺' },
    'mensuration':          { name: 'Mensuration',         icon: '📦' },
    'hcf-lcm':              { name: 'HCF & LCM',           icon: '🧩' },
    'mixture-alligation':   { name: 'Mixture & Alligation',icon: '🧪' }
};

function topicName(id) {
    return (MM_TOPICS[id] && MM_TOPICS[id].name) || (id || 'General').replace(/-/g, ' ');
}
function topicIcon(id) {
    return (MM_TOPICS[id] && MM_TOPICS[id].icon) || '📌';
}

/* ============================================================
   1. Theme (light/dark, persisted, respects system default)
   ============================================================ */
window.MMTheme = (function () {
    var KEY = 'mm-theme';

    function current() {
        return document.documentElement.getAttribute('data-theme') || 'light';
    }

    function apply(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        var sun = document.getElementById('sun-icon');
        var moon = document.getElementById('moon-icon');
        if (sun && moon) {
            sun.style.display = theme === 'dark' ? '' : 'none';
            moon.style.display = theme === 'dark' ? 'none' : '';
        }
        MMStore.set(KEY, theme);
    }

    function init() {
        var saved = MMStore.get(KEY, null);
        // Premium default: dark (deep-space) theme. System preference is
        // only used when it is explicitly dark; first-time users see the
        // flagship dark theme and can switch via the toggle.
        var sys = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        apply(saved || (sys === 'dark' ? 'dark' : 'dark'));
        var btn = document.getElementById('theme-toggle');
        if (btn) btn.addEventListener('click', function () {
            apply(current() === 'dark' ? 'light' : 'dark');
            // re-render charts/bars that use theme-dependent colours
            if (window.MM && MM.updateDashboard) MM.updateDashboard();
        });
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
                if (!MMStore.get(KEY, null)) apply(e.matches ? 'dark' : 'light');
            });
        }
    }

    return { init: init, current: current, apply: apply };
})();

/* ============================================================
   2. Navigation / section switching
   ============================================================ */
window.MM = (function () {
    var SECTION_IDS = ['dashboard', 'learn', 'mastery', 'formulas', 'pyq-db', 'quiz', 'patterns', 'traps', 'speed', 'flashcards', 'calc-lab', 'error-log', 'revision', 'plan', 'timer', 'profile'];

    function showSection(id) {
        if (SECTION_IDS.indexOf(id) === -1) id = 'dashboard';
        var sections = document.querySelectorAll('.section');
        sections.forEach(function (s) {
            s.classList.toggle('active', s.id === id);
        });
        var links = document.querySelectorAll('#nav-links a');
        links.forEach(function (a) {
            a.classList.toggle('active', a.getAttribute('href') === '#' + id);
        });
        // lazy render on first activation (keeps initial load fast)
        var r = RENDERERS[id];
        if (r) r();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    /* ---------- dashboard ---------- */

    function updateDashboard() {
        var p = MMProgress.all();

        // overall mastery: weighted blend of accuracy + coverage
        var acc = p.totalAnswered ? p.totalCorrect / p.totalAnswered : 0;
        var coverage = Object.keys(p.topicStats).length / 11;
        var mastery = Math.round((acc * 0.6 + coverage * 0.4) * 100);

        setText('overall-mastery-value', p.totalAnswered ? mastery : 0);
        setText('pyqs-analysed-value', p.totalAnswered);
        setText('topics-mastered-value', Object.keys(p.topicStats).filter(function (t) {
            var ts = p.topicStats[t];
            return ts.attempts >= 10 && ts.correct / ts.attempts >= 0.75;
        }).length);
        setText('accuracy-value', p.totalAnswered ? Math.round(acc * 100) : 0);
        setText('avg-time-value', MMProgress.avgTimeSec());
        setText('streak-value', p.streakCurrent);

        renderTopicMastery(p.topicStats);
        renderAccuracyChart(p.topicStats);
        renderQOTD();
        renderPlanToday();
    }

    function setText(id, val) {
        var el = document.getElementById(id);
        if (el) el.textContent = val;
    }

    function renderTopicMastery(stats) {
        var host = document.getElementById('topic-mastery-list');
        if (!host) return;
        var html = '';
        var any = false;
        Object.keys(MM_TOPICS).forEach(function (t) {
            var s = stats[t];
            if (!s || !s.attempts) return;
            any = true;
            var pct = Math.round(100 * s.correct / s.attempts);
            html += '<div class="topic-mastery-row">' +
                '<span class="t-name">' + topicIcon(t) + ' ' + topicName(t) + '</span>' +
                '<span class="t-bar"><span class="t-fill" style="width:' + pct + '%"></span></span>' +
                '<span class="t-pct">' + pct + '%</span></div>';
        });
        host.innerHTML = any ? html : '<div class="muted-text">No practice data yet — start a quiz and this chart fills in live.</div>';
    }

    function renderAccuracyChart(stats) {
        var host = document.getElementById('topic-accuracy-chart');
        if (!host) return;
        var rows = Object.keys(MM_TOPICS).map(function (t) {
            var s = stats[t];
            return { t: t, pct: s && s.attempts ? Math.round(100 * s.correct / s.attempts) : 0, n: s ? s.attempts : 0 };
        }).filter(function (r) { return r.n > 0; })
          .sort(function (a, b) { return b.pct - a.pct; });
        if (!rows.length) {
            host.innerHTML = '<div class="muted-text">Accuracy bars appear after your first questions.</div>';
            return;
        }
        var html = '';
        rows.forEach(function (r) {
            var color = r.pct >= 75 ? 'var(--success)' : r.pct >= 50 ? 'var(--warning)' : 'var(--error)';
            html += '<div class="bar-row">' +
                '<span class="b-label">' + topicName(r.t) + '</span>' +
                '<span class="b-track"><span class="b-fill" style="width:' + r.pct + '%;background:' + color + '"></span></span>' +
                '<span class="b-val">' + r.n + 'Q</span></div>';
        });
        host.innerHTML = html;
    }

    /* ---------- question of the day ----------
       Deterministic pick: hash(today) → question index, so the
       same user sees the same QOTD all day, and it changes at
       midnight. */
    var qotd = { idx: 0, answered: false };

    function renderQOTD() {
        var el = document.getElementById('qotd-question');
        var meta = document.getElementById('qotd-meta');
        var solveBtn = document.getElementById('qotd-solve');
        if (!el) return;
        var bank = window.PYQ_BANK || [];
        if (!bank.length) { el.textContent = 'PYQ bank not loaded.'; return; }
        var key = MMUtil.todayKey();
        var idx = MMUtil.strHash(key) % bank.length;
        var q = bank[idx];
        qotd.idx = idx;
        el.textContent = q.q;
        meta.innerHTML = topicIcon(q.t) + ' ' + topicName(q.t) + ' · ' + MMUtil.esc(q.s || '') + (q.e ? ' · ' + MMUtil.esc(q.e) : '') + (q.d ? ' · ' + MMUtil.fmtDate(q.d) : '');
        solveBtn.style.display = '';
    }

    function qotdSolve() {
        // Open the question in the PYQ modal — user answers there.
        var bank = window.PYQ_BANK || [];
        openPYQModal(bank, qotd.idx);
    }

    /* ---------- today's plan tasks ---------- */
    function renderPlanToday() {
        var num = document.getElementById('plan-today-num');
        var host = document.getElementById('plan-today-tasks');
        if (!host) return;
        var state = MMPlan.state();
        var day = MMPlan.day(state.currentDay);
        if (!day) return;
        num.textContent = state.currentDay;
        var html = '<div class="plan-today-topic">' + topicName(day.primaryTopics && day.primaryTopics[0] ? day.primaryTopics[0] : 'mixed') + '</div>';
        day.tasks.forEach(function (t, i) {
            var done = MMPlan.isDone(state.currentDay, i);
            html += '<label class="plan-today-task' + (done ? ' done' : '') + '"><input type="checkbox" data-day="' + state.currentDay + '" data-ti="' + i + '" ' + (done ? 'checked' : '') + '><span>' + MMUtil.esc(t.text) + '</span></label>';
        });
        host.innerHTML = html;
        var boxes = host.querySelectorAll('input[type=checkbox]');
        boxes.forEach(function (b) {
            b.addEventListener('change', function () {
                MMPlan.toggleTask(parseInt(b.getAttribute('data-day'), 10), parseInt(b.getAttribute('data-ti'), 10));
                if (window.MMPlan && MMPlanRenderDaily) MMPlanRenderDaily();
                updateDashboard();
            });
        });
    }

    /* ---------- learn ---------- */
    function renderLearn() {
        var host = document.getElementById('learn-cards');
        if (!host) return;
        var notes = window.CONCEPT_NOTES || {};
        var levelSel = document.getElementById('learn-level-select');
        var level = levelSel ? levelSel.value : 'all';
        var p = MMProgress.all();
        var html = '';
        Object.keys(MM_TOPICS).forEach(function (t, ti) {
            var note = notes[t];
            if (!note) return;
            // level mapping: topics are levelled by their weight in the
            // 90-day plan (foundation topics first). Level = phase that
            // first includes this topic.
            var lv = 1;
            if (level !== 'all') {
                if (ti >= 4 && ti <= 5 && level !== '2') return;
            }
            var stats = p.topicStats[t];
            var mastery = stats && stats.attempts ? Math.round(100 * stats.correct / stats.attempts) : 0;
            var pyqs = (window.PYQ_BANK || []).filter(function (q) { return q.t === t; }).length;
            var levelTag = ti < 3 ? '1 · Foundation' : ti < 6 ? '2 · Concept Clarity' : ti < 8 ? '3 · Application' : '4 · PYQ Ready';
            html += '<div class="learn-card" data-topic="' + t + '" style="--card-color:' + note.color + '">' +
                '<div class="lc-head"><span class="lc-icon">' + topicIcon(t) + '</span><h4>' + MMUtil.esc(note.name) + '</h4></div>' +
                '<div class="lc-level">Level ' + levelTag + '</div>' +
                '<div class="lc-stats"><span>⏱ <b>' + note.minutes + '</b> min</span><span>📝 <b>' + note.sections.length + '</b> sections</span><span>🗂 <b>' + pyqs.toLocaleString('en-IN') + '</b> PYQs</span></div>' +
                '<p>' + MMUtil.esc(note.sections[0] ? note.sections[0].body[0].slice(0, 150) + '…' : '') + '</p>' +
                (stats && stats.attempts ? '<div class="lc-progress"><div class="lc-progress-fill" style="width:' + mastery + '%"></div></div><div class="muted-text" style="font-size:0.7rem;margin-top:0.3rem">mastery ' + mastery + '%</div>' : '') +
                '</div>';
        });
        host.innerHTML = html;
        var cards = host.querySelectorAll('.learn-card');
        cards.forEach(function (c) {
            c.addEventListener('click', function () {
                MMNotes.open(c.getAttribute('data-topic'));
            });
        });
    }

    /* ---------- formula bank ---------- */
    var formulaState = { topic: 'all', search: '' };

    function renderFormulas() {
        var host = document.getElementById('formula-list');
        if (!host) return;
        var bank = window.FORMULA_BANK || {};
        var chipsHost = document.getElementById('formula-topic-chips');
        var countEl = document.getElementById('formula-bank-count');
        var topicCountEl = document.getElementById('formula-topic-count');

        var total = 0;
        Object.keys(bank).forEach(function (t) {
            (bank[t].subtopics || []).forEach(function (st) {
                total += st.formulas.length;
            });
        });
        if (countEl) countEl.textContent = total.toLocaleString('en-IN');
        if (topicCountEl) topicCountEl.textContent = Object.keys(bank).length;

        if (chipsHost) {
            var ch = '<button class="chip' + (formulaState.topic === 'all' ? ' active' : '') + '" data-ft="all">All</button>';
            Object.keys(bank).forEach(function (t) {
                ch += '<button class="chip' + (formulaState.topic === t ? ' active' : '') + '" data-ft="' + t + '">' + topicIcon(t) + ' ' + MMUtil.esc(bank[t].name) + '</button>';
            });
            chipsHost.innerHTML = ch;
            chipsHost.querySelectorAll('.chip').forEach(function (c) {
                c.addEventListener('click', function () {
                    formulaState.topic = c.getAttribute('data-ft');
                    renderFormulas();
                });
            });
        }

        var term = formulaState.search.toLowerCase();
        var html = '';
        Object.keys(bank).forEach(function (t) {
            if (formulaState.topic !== 'all' && formulaState.topic !== t) return;
            var topic = bank[t];
            var items = [];
            (topic.subtopics || []).forEach(function (st) {
                st.formulas.forEach(function (f) {
                    if (term) {
                        var hay = (f.name + ' ' + f.formula + ' ' + (f.usage || '') + ' ' + (f.fastTip || '') + ' ' + st.name + ' ' + topic.name).toLowerCase();
                        if (hay.indexOf(term) === -1) return;
                    }
                    items.push({ st: st, f: f });
                });
            });
            if (!items.length) return;
            html += '<div class="formula-topic-block"><div class="formula-topic-header"><span class="ft-icon">' + topicIcon(t) + '</span><h3>' + MMUtil.esc(topic.name) + '</h3><span class="ft-count">' + items.length + ' formulas</span><span class="ft-caret">▾</span></div>';
            // group by subtopic
            var bySt = {};
            items.forEach(function (it) {
                (bySt[it.st.id] = bySt[it.st.id] || { st: it.st, list: [] }).list.push(it.f);
            });
            Object.keys(bySt).forEach(function (sid) {
                var grp = bySt[sid];
                html += '<div class="formula-subtopic-block"><h4>' + MMUtil.esc(grp.st.name) + '</h4><div class="formula-items">';
                grp.list.forEach(function (f) {
                    html += '<div class="formula-item">' +
                        '<div class="fi-name">' + MMUtil.esc(f.name) + '</div>' +
                        '<div class="fi-formula">' + MMUtil.esc(f.formula) + '</div>' +
                        (f.usage ? '<div class="fi-usage">' + MMUtil.esc(f.usage) + '</div>' : '') +
                        (f.fastTip ? '<div class="fi-tip">⚡ ' + MMUtil.esc(f.fastTip) + '</div>' : '') +
                        (f.pyqHint ? '<div class="fi-pyq">📝 ' + MMUtil.esc(f.pyqHint) + '</div>' : '') +
                        '</div>';
                });
                html += '</div></div>';
            });
            html += '</div>';
        });
        host.innerHTML = html || '<div class="no-data">No formulas match your search.</div>';

        host.querySelectorAll('.formula-topic-header').forEach(function (h) {
            h.addEventListener('click', function () {
                h.parentElement.classList.toggle('collapsed');
            });
        });
    }

    /* ---------- PYQ bank ---------- */
    var pyqState = { search: '', exam: 'all', topic: 'all', year: 'all', diff: 'all', pattern: 'all', page: 1, perPage: 20 };

    function renderPyqFilters() {
        var bank = window.PYQ_BANK || [];
        var topicSel = document.getElementById('pyq-topic-filter');
        var patSel = document.getElementById('pyq-pattern-filter');
        var totalEl = document.getElementById('pyq-bank-total');
        if (totalEl) totalEl.textContent = bank.length.toLocaleString('en-IN');
        if (topicSel && !topicSel.options.length) {
            var h = '<option value="all">All Topics</option>';
            Object.keys(MM_TOPICS).forEach(function (t) {
                h += '<option value="' + t + '">' + topicIcon(t) + ' ' + topicName(t) + '</option>';
            });
            topicSel.innerHTML = h;
            topicSel.value = pyqState.topic;
            topicSel.addEventListener('change', function () { pyqState.topic = topicSel.value; pyqState.page = 1; renderPyqList(); });
        }
        if (patSel && !patSel.options.length) {
            var pats = {};
            bank.forEach(function (q) { if (q.p) pats[q.p] = (pats[q.p] || 0) + 1; });
            var ph = '<option value="all">All Patterns</option>';
            Object.keys(pats).sort(function (a, b) { return pats[b] - pats[a]; }).forEach(function (p) {
                ph += '<option value="' + p + '">' + p + ' (' + pats[p] + ')</option>';
            });
            patSel.innerHTML = ph;
            patSel.value = pyqState.pattern;
            patSel.addEventListener('change', function () { pyqState.pattern = patSel.value; pyqState.page = 1; renderPyqList(); });
        }
    }

    function filteredBank() {
        var bank = window.PYQ_BANK || [];
        return bank.filter(function (q) {
            if (pyqState.exam !== 'all') {
                var e = (q.e || q.s || '').toUpperCase();
                if (e.indexOf(pyqState.exam.toUpperCase()) === -1) return false;
            }
            if (pyqState.topic !== 'all' && q.t !== pyqState.topic) return false;
            if (pyqState.year !== 'all' && String(q.y) !== pyqState.year) return false;
            if (pyqState.diff !== 'all' && q.df !== pyqState.diff) return false;
            if (pyqState.pattern !== 'all' && q.p !== pyqState.pattern) return false;
            if (pyqState.search) {
                if ((q.q || '').toLowerCase().indexOf(pyqState.search.toLowerCase()) === -1) return false;
            }
            return true;
        });
    }

    function renderPyqList() {
        renderPyqFilters();
        var host = document.getElementById('pyq-list');
        var pag = document.getElementById('pyq-pagination');
        var sum = document.getElementById('pyq-summary');
        if (!host) return;
        var list = filteredBank();
        var total = list.length;
        var pages = Math.max(1, Math.ceil(total / pyqState.perPage));
        if (pyqState.page > pages) pyqState.page = pages;
        var start = (pyqState.page - 1) * pyqState.perPage;
        var slice = list.slice(start, start + pyqState.perPage);

        if (sum) {
            sum.innerHTML = '<span>Showing <b>' + (total ? start + 1 : 0) + '–' + Math.min(start + pyqState.perPage, total) + '</b> of <b>' + total.toLocaleString('en-IN') + '</b> matched questions</span>';
        }

        var html = '';
        slice.forEach(function (q) {
            var realIdx = (window.PYQ_BANK || []).indexOf(q);
            var opts = 'a) ' + (q.o.a || '—') + '  b) ' + (q.o.b || '—') + '  c) ' + (q.o.c || '—') + '  d) ' + (q.o.d || '—');
            html += '<div class="pyq-item df-' + (q.df || 'medium') + '" data-pi="' + realIdx + '">' +
                '<div class="pyq-header"><span class="pyq-topic">' + topicIcon(q.t) + ' ' + topicName(q.t) + '</span>' +
                '<span class="pyq-exam">' + MMUtil.esc(q.e || q.s || '') + (q.d ? ' · ' + MMUtil.fmtDate(q.d) : '') + (q.sh ? ' · ' + MMUtil.esc(q.sh) : '') + '</span></div>' +
                '<div class="pyq-badges"><span class="pyq-badge df-' + (q.df || 'medium') + '">' + (q.df || 'medium') + '</span>' + (q.p ? '<span class="pyq-badge">' + MMUtil.esc(q.p) + '</span>' : '') + (q.y ? '<span class="pyq-badge">' + q.y + '</span>' : '') + '</div>' +
                '<div class="pyq-question">' + MMUtil.esc(q.q) + '</div>' +
                '<div class="pyq-options">' + MMUtil.esc(opts) + '</div>' +
                '<div class="pyq-footer"><span class="pk">answer hidden — click to reveal + solve</span></div>' +
                '</div>';
        });
        host.innerHTML = html || '<div class="no-data">No questions match these filters. Try widening the year or pattern filter.</div>';

        host.querySelectorAll('.pyq-item').forEach(function (el) {
            el.addEventListener('click', function () {
                openPYQModal(window.PYQ_BANK, parseInt(el.getAttribute('data-pi'), 10));
            });
        });

        // pagination
        if (pag) {
            var ph = '';
            ph += '<button class="pyq-page-btn" data-pg="prev" ' + (pyqState.page <= 1 ? 'disabled' : '') + '>← Prev</button>';
            var win = 4;
            var lo = Math.max(1, pyqState.page - win);
            var hi = Math.min(pages, pyqState.page + win);
            if (lo > 1) ph += '<button class="pyq-page-btn" data-pg="1">1</button><span class="muted-text">…</span>';
            for (var i = lo; i <= hi; i++) {
                ph += '<button class="pyq-page-btn' + (i === pyqState.page ? ' active' : '') + '" data-pg="' + i + '">' + i + '</button>';
            }
            if (hi < pages) ph += '<span class="muted-text">…</span><button class="pyq-page-btn" data-pg="' + pages + '">' + pages + '</button>';
            ph += '<button class="pyq-page-btn" data-pg="next" ' + (pyqState.page >= pages ? 'disabled' : '') + '>Next →</button>';
            pag.innerHTML = ph;
            pag.querySelectorAll('.pyq-page-btn').forEach(function (b) {
                b.addEventListener('click', function () {
                    var v = b.getAttribute('data-pg');
                    if (v === 'prev') pyqState.page -= 1;
                    else if (v === 'next') pyqState.page += 1;
                    else pyqState.page = parseInt(v, 10);
                    renderPyqList();
                    var hostEl = document.getElementById('pyq-list');
                    if (hostEl) hostEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                });
            });
        }
    }

    function openPYQModal(bank, idx) {
        var q = bank[idx];
        if (!q) return;
        var ov = document.createElement('div');
        ov.className = 'modal-overlay';
        var correct = q.a;
        var optsHtml = LETTERS_UI.map(function (l, i) {
            return '<div class="m-opt" data-l="' + l + '">(' + l + ') ' + MMUtil.esc(q.o[l] || '—') + '</div>';
        }).join('');
        ov.innerHTML = '<div class="modal">' +
            '<div class="m-meta"><span class="pyq-badge">' + topicIcon(q.t) + ' ' + topicName(q.t) + '</span><span class="pyq-badge df-' + (q.df || 'medium') + '">' + (q.df || 'medium') + '</span>' + (q.p ? '<span class="pyq-badge">' + MMUtil.esc(q.p) + '</span>' : '') + '<span class="pyq-badge">' + MMUtil.esc(q.e || q.s || '') + (q.d ? ' · ' + MMUtil.fmtDate(q.d) : '') + '</span></div>' +
            '<h3>Question ' + (idx + 1) + '</h3>' +
            '<div class="m-question">' + MMUtil.esc(q.q) + '</div>' +
            '<div class="m-options">' + optsHtml + '</div>' +
            '<div class="m-solution" id="m-sol" style="display:none"></div>' +
            '<div class="m-actions">' +
            '<button class="btn btn-ghost btn-sm" id="m-close">Close</button>' +
            '<button class="btn btn-primary btn-sm" id="m-check">Check Answer</button>' +
            '</div></div>';
        document.body.appendChild(ov);

        var checked = false;
        function close() { ov.remove(); }

        ov.addEventListener('click', function (ev) { if (ev.target === ov) close(); });
        ov.querySelector('#m-close').addEventListener('click', close);

        var pick = null;
        ov.querySelectorAll('.m-opt').forEach(function (o) {
            o.addEventListener('click', function () {
                if (checked) return;
                ov.querySelectorAll('.m-opt').forEach(function (x) { x.classList.remove('selected'); });
                o.classList.add('selected');
                pick = o.getAttribute('data-l');
            });
        });

        ov.querySelector('#m-check').addEventListener('click', function () {
            if (checked) return;
            if (!pick) { MMUtil.toast('Pick an option first.', 'error'); return; }
            checked = true;
            var isRight = pick === correct;
            ov.querySelectorAll('.m-opt').forEach(function (o) {
                var l = o.getAttribute('data-l');
                if (l === correct) o.classList.add('correct');
                else if (l === pick) o.classList.add('wrong');
            });
            // log to progress (this counts as a practice attempt)
            var timeMs = 8000; // modal answers have no timer — neutral value
            var res = MMProgress.recordAnswer({ topic: q.t, pattern: q.p, correct: isRight, skipped: false, timeMs: timeMs });
            (res.newly || []).forEach(function (b) { MMUtil.toast('🏅 Badge earned: ' + b.name, 'gold'); });
            if (!isRight) {
                MMErrors.add({
                    type: 'concept', topic: q.t,
                    question: q.q.length > 140 ? q.q.slice(0, 137) + '…' : q.q,
                    mistake: 'Answered ' + pick.toUpperCase() + ' — correct was ' + correct.toUpperCase() + ' (' + (q.o[correct] || '') + ')',
                    correct: 'Re-derive the method for pattern: ' + (q.p || 'general'),
                    trapRef: null, auto: true, source: q.e || q.s || 'PYQ Bank'
                });
            }
            var sol = ov.querySelector('#m-sol');
            sol.style.display = '';
            var pat = q.p ? (window.PATTERN_DATABASE || []).filter(function (p) { return p.id === q.p; })[0] : null;
            sol.innerHTML = '<h4>' + (isRight ? '✅ Correct! +10 XP' : '❌ Correct answer: ' + correct.toUpperCase() + ') ' + MMUtil.esc(q.o[correct] || '')) + '</h4>' +
                (pat ? '<p><b>Pattern:</b> ' + MMUtil.esc(pat.name) + ' — ' + MMUtil.esc(pat.recognitionSignal) + '</p><p><b>Fast method:</b> ' + MMUtil.esc(pat.fastMethod) + '</p>' :
                      '<p>Re-derive this from the topic formula bank. If it felt like a trick, check the Trap Database — examiners repeat their favourite setups.</p>') +
                '<p class="muted-text">This attempt was logged to your progress and error log.</p>';
        });
    }
    var LETTERS_UI = ['a', 'b', 'c', 'd'];

    /* ---------- patterns ---------- */
    var patternState = { topic: 'all' };

    function renderPatterns() {
        var host = document.getElementById('patterns-grid');
        if (!host) return;
        var db = window.PATTERN_DATABASE || [];
        var sel = document.getElementById('pattern-topic-filter');
        var countEl = document.getElementById('pattern-count-label');
        if (countEl) countEl.textContent = db.length;
        if (sel && !sel.options.length) {
            var h = '<option value="all">All Topics</option>';
            Object.keys(MM_TOPICS).forEach(function (t) {
                h += '<option value="' + t + '">' + topicIcon(t) + ' ' + topicName(t) + '</option>';
            });
            sel.innerHTML = h;
            sel.value = patternState.topic;
            sel.addEventListener('change', function () { patternState.topic = sel.value; renderPatterns(); });
        }

        var html = '';
        db.forEach(function (p) {
            if (patternState.topic !== 'all' && p.topic !== patternState.topic) return;
            var fcls = p.frequency === 'Very High' ? 'f-vh' : p.frequency === 'High' ? 'f-h' : 'f-m';
            html += '<div class="pattern-card" data-pid="' + MMUtil.esc(p.id) + '">' +
                '<div class="pc-head"><h3>' + MMUtil.esc(p.name) + '</h3><span class="pc-freq ' + fcls + '">' + MMUtil.esc(p.frequency) + '</span></div>' +
                '<div class="pc-signal">“' + MMUtil.esc(p.recognitionSignal) + '”</div>' +
                '<div class="pc-row pc-concept"><span class="lbl">Concept</span>' + MMUtil.esc(p.concept) + '</div>' +
                '<div class="pc-row pc-fast"><span class="lbl">Fast</span>' + MMUtil.esc(p.fastMethod) + '</div>' +
                '<div class="pc-row pc-trap"><span class="lbl">Trap</span>' + MMUtil.esc((p.commonTraps && p.commonTraps[0]) || '—') + '</div>' +
                '<div class="pc-time">⏱ ' + MMUtil.esc(p.idealTime) + ' · ' + (p.masteryTest ? p.masteryTest.length : 0) + ' mastery Qs</div>' +
                '</div>';
        });
        host.innerHTML = html || '<div class="no-data">No patterns for this topic.</div>';

        host.querySelectorAll('.pattern-card').forEach(function (c) {
            c.addEventListener('click', function () {
                openPatternModal(c.getAttribute('data-pid'));
            });
        });
    }

    function openPatternModal(pid) {
        var db = window.PATTERN_DATABASE || [];
        var p = db.filter(function (x) { return x.id === pid; })[0];
        if (!p) return;
        var ov = document.createElement('div');
        ov.className = 'modal-overlay';
        var html = '<div class="modal">' +
            '<div class="m-meta"><span class="pyq-badge">' + topicIcon(p.topic) + ' ' + topicName(p.topic) + '</span><span class="pyq-badge">' + MMUtil.esc(p.frequency) + ' frequency</span><span class="pyq-badge">⏱ ' + MMUtil.esc(p.idealTime) + '</span></div>' +
            '<h3>' + MMUtil.esc(p.name) + '</h3>' +
            '<div class="m-solution"><h4>Recognition signal</h4><p>' + MMUtil.esc(p.recognitionSignal) + '</p></div>' +
            '<div class="m-solution"><h4>Typical wording</h4><p>' + MMUtil.esc(p.typicalWording) + '</p></div>' +
            '<div class="m-solution"><h4>Concept</h4><p>' + MMUtil.esc(p.concept) + '</p></div>' +
            '<div class="m-solution"><h4>Standard method</h4><p>' + MMUtil.esc(p.standardMethod) + '</p></div>' +
            '<div class="m-solution" style="border-color:var(--success)"><h4 style="color:var(--success)">⚡ Fast method</h4><p>' + MMUtil.esc(p.fastMethod) + '</p></div>' +
            '<div class="m-solution"><h4>Variants to expect</h4><ul style="padding-left:1.2rem">' + p.commonVariants.map(function (v) { return '<li style="font-size:0.85rem;margin-bottom:0.3rem;list-style:disc">' + MMUtil.esc(v) + '</li>'; }).join('') + '</ul></div>' +
            '<div class="m-solution"><h4>PYQ examples</h4><ul style="padding-left:1.2rem">' + p.pyqExamples.map(function (v) { return '<li style="font-size:0.85rem;margin-bottom:0.3rem;list-style:disc">' + MMUtil.esc(v) + '</li>'; }).join('') + '</ul></div>' +
            '<div class="m-trap">🛡 Traps: ' + p.commonTraps.map(MMUtil.esc).join(' · ') + '</div>' +
            '<div class="m-actions"><button class="btn btn-ghost btn-sm" id="pm-close">Close</button><button class="btn btn-primary btn-sm" id="pm-drill">⚡ Drill this pattern</button></div>' +
            '</div>';
        ov.innerHTML = html;
        document.body.appendChild(ov);
        function close() { ov.remove(); }
        ov.addEventListener('click', function (ev) { if (ev.target === ov) close(); });
        ov.querySelector('#pm-close').addEventListener('click', close);
        ov.querySelector('#pm-drill').addEventListener('click', function () {
            close();
            MM.showSection('quiz');
            MMQuiz.startPatternDrill(pid);
        });
    }

    /* ---------- traps ---------- */
    var trapState = { topic: 'all', minDanger: 4 };

    function renderTraps() {
        var host = document.getElementById('traps-grid');
        if (!host) return;
        var db = window.TRAP_DATABASE || [];
        var sel = document.getElementById('trap-topic-filter');
        var d5 = document.getElementById('trap-danger5');
        var countEl = document.getElementById('trap-count-label');
        if (countEl) countEl.textContent = db.length;
        if (sel && !sel.options.length) {
            var h = '<option value="all">All Topics</option>';
            Object.keys(MM_TOPICS).forEach(function (t) {
                h += '<option value="' + t + '">' + topicIcon(t) + ' ' + topicName(t) + '</option>';
            });
            sel.innerHTML = h;
            sel.value = trapState.topic;
            sel.addEventListener('change', function () { trapState.topic = sel.value; renderTraps(); });
        }
        if (d5) {
            d5.checked = trapState.minDanger >= 4;
            d5.addEventListener('change', function () { trapState.minDanger = d5.checked ? 4 : 1; renderTraps(); });
        }

        var html = '';
        db.forEach(function (t) {
            if (trapState.topic !== 'all' && t.topic !== trapState.topic) return;
            if (t.danger < trapState.minDanger) return;
            var dots = '';
            for (var i = 1; i <= 5; i++) dots += '<span class="danger-dot' + (i <= t.danger ? ' on' : '') + '"></span>';
            html += '<div class="trap-card">' +
                '<div class="tc-head"><h3>' + MMUtil.esc(t.example.split('—')[0].trim()) + '</h3><span class="danger-dots">' + dots + '</span></div>' +
                '<span class="tc-type">' + MMUtil.esc(t.type) + '</span>' +
                '<div class="tc-why">' + MMUtil.esc(t.whyStudentsFall) + '</div>' +
                '<div class="tc-row tc-detect"><span class="lbl">🔍 Detection</span>' + MMUtil.esc(t.detection) + '</div>' +
                '<div class="tc-row tc-prevent"><span class="lbl">🛡 Prevention</span>' + MMUtil.esc(t.prevention) + '</div>' +
                '<div class="tc-row tc-check"><span class="lbl">✅ Quick check</span>' + MMUtil.esc(t.quickCheck) + '</div>' +
                (t.trapOption ? '<div class="tc-pyqs">🎯 The trap option: ' + MMUtil.esc(t.trapOption) + '</div>' : '') +
                (t.relatedPYQs && t.relatedPYQs.length ? '<div class="tc-pyqs">📝 ' + t.relatedPYQs.map(MMUtil.esc).join(' · ') + '</div>' : '') +
                '</div>';
        });
        host.innerHTML = html || '<div class="no-data">No traps match — lower the danger filter.</div>';
    }

    /* ---------- speed maths ---------- */
    var speedState = { module: null, items: [], idx: 0, correct: 0, times: [], running: false, startMs: 0, qStart: 0 };

    function renderSpeedModules() {
        var host = document.getElementById('speed-modules');
        if (!host) return;
        var mods = window.SPEED_MODULES || {};
        var accMap = MMSpeed.accuracyPerModule();
        var avgMap = MMSpeed.bestTimePerModule();
        var html = '';
        Object.keys(mods).forEach(function (mid) {
            var m = mods[mid];
            var acc = accMap[mid];
            var avg = avgMap[mid];
            var accPct = acc === null ? 0 : Math.round(acc * 100);
            html += '<div class="speed-module" data-smid="' + mid + '">' +
                '<div class="sm-title">' + MMUtil.esc(m.name) + '</div>' +
                '<div class="sm-desc">' + MMUtil.esc(m.desc) + '</div>' +
                '<div class="sm-meta"><span>best avg <b>' + (avg ? (avg / 1000).toFixed(1) + 's' : '—') + '</b></span><span>acc <b>' + (acc === null ? '—' : accPct + '%') + '</b></span></div>' +
                '<div class="sm-bar"><div class="sm-bar-fill" style="width:' + accPct + '%"></div></div>' +
                '</div>';
        });
        host.innerHTML = html;
        host.querySelectorAll('.speed-module').forEach(function (el) {
            el.addEventListener('click', function () {
                startSpeedModule(el.getAttribute('data-smid'));
            });
        });

        var tricks = document.getElementById('speed-tricks-panel');
        if (tricks && window.SPEED_TRICKS) {
            var th = '<h3>⚡ Field-Tested Tricks</h3>';
            window.SPEED_TRICKS.forEach(function (t) {
                th += '<div class="trick-card">' + MMUtil.esc(t) + '</div>';
            });
            tricks.innerHTML = th;
        }
    }

    function moduleItems(mid) {
        var m = (window.SPEED_MODULES || {})[mid];
        if (!m) return [];
        var items = m.generator ? m.generator() : (m.explicit || []);
        return MMUtil.sample(items, MMSpeed.SESSION_LEN);
    }

    function startSpeedModule(mid) {
        var items = moduleItems(mid);
        if (!items.length) { MMUtil.toast('Module unavailable.', 'error'); return; }
        speedState = {
            module: mid, items: items, idx: 0, correct: 0, times: [],
            running: true, startMs: Date.now(), qStart: Date.now()
        };
        renderSpeedActive();
    }

    function renderSpeedActive() {
        var host = document.getElementById('speed-active');
        if (!host) {
            host = document.createElement('div');
            host.className = 'speed-active';
            host.id = 'speed-active';
            var mods = document.getElementById('speed-modules');
            if (mods && mods.parentNode) mods.parentNode.insertBefore(host, mods.nextSibling);
        }
        if (!speedState.running) { host.style.display = 'none'; return; }
        host.style.display = '';
        var it = speedState.items[speedState.idx];
        var total = speedState.items.length;
        var modName = (window.SPEED_MODULES || {})[speedState.module].name;
        var totalMs = Date.now() - speedState.startMs;
        var html = '<div class="speed-meta"><span>' + MMUtil.esc(modName) + ' · ' + (speedState.idx + 1) + '/' + total + '</span><span>✅ ' + speedState.correct + '</span><span class="sm-timer">' + MMUtil.fmtDuration(totalMs / 1000) + '</span></div>';
        html += '<div class="speed-question">' + MMUtil.esc(it.q) + (it.type === 'percent' || it.type === 'fraction' ? (it.type === 'fraction' ? ' → ?%' : ' of ? → ?') : ' = ?') + '</div>';
        html += '<div class="speed-input-row"><input type="text" class="speed-input" id="speed-input" inputmode="decimal" autocomplete="off" placeholder="answer"><button class="btn btn-primary" id="speed-check">↵</button></div>';
        host.innerHTML = html;
        var inp = document.getElementById('speed-input');
        function go() {
            var guess = inp.value.trim();
            if (guess === '') return;
            var ok = String(guess).replace(/%$/, '').replace(/\s+/g, '') === String(it.a).replace(/\s+/g, '');
            var tms = Date.now() - speedState.qStart;
            speedState.times.push(tms);
            MMSpeed.recordQuestion(speedState.module, ok, tms);
            if (ok) { speedState.correct += 1; inp.classList.add('right'); }
            else inp.classList.add('wrong');
            setTimeout(advance, ok ? 180 : 900);
        }
        function advance() {
            speedState.idx += 1;
            speedState.qStart = Date.now();
            if (speedState.idx >= total) finishSpeed(); else renderSpeedActive();
        }
        inp.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') go(); });
        document.getElementById('speed-check').addEventListener('click', go);
        setTimeout(function () { inp.focus(); }, 40);
    }

    function finishSpeed() {
        speedState.running = false;
        var total = speedState.items.length;
        var acc = speedState.correct / total;
        var totalMs = Date.now() - speedState.startMs;
        var newly = MMSpeed.finishSession(speedState.module, acc);
        (newly || []).forEach(function (b) { MMUtil.toast('🏅 Badge earned: ' + b.name, 'gold'); });
        var host = document.getElementById('speed-active');
        if (host) host.style.display = 'none';
        var res = document.getElementById('speed-result');
        if (res) {
            res.style.display = '';
            var avg = totalMs / 1000 / total;
            var modName = (window.SPEED_MODULES || {})[speedState.module].name;
            res.innerHTML = '<div class="sr-accuracy">' + Math.round(acc * 100) + '%</div>' +
                '<div class="sr-row"><span>' + MMUtil.esc(modName) + '</span><span><span class="v">' + speedState.correct + '/' + total + '</span> correct</span><span>avg <span class="v">' + avg.toFixed(2) + 's</span></span><span>total <span class="v">' + MMUtil.fmtDuration(totalMs / 1000) + '</span></span></div>' +
                '<button class="btn btn-primary" onclick="MM.startSpeedAgain()">↻ Retry</button> ';
            res.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        renderSpeedModules(); // refresh lifetime stats
    }

    function startSpeedAgain() {
        var res = document.getElementById('speed-result');
        if (res) res.style.display = 'none';
        if (speedState.module) startSpeedModule(speedState.module);
    }

    /* ---------- flashcards (SRS) ---------- */
    var flashState = { queue: [], idx: 0, revealed: false, done: 0, total: 0 };

    function renderSrsDashboard() {
        var host = document.getElementById('srs-dashboard');
        if (!host) return;
        var counts = MMSRS.boxCounts();
        var due = MMSRS.dueCount();
        var total = (window.FLASHCARDS || []).length;
        var labels = ['Daily', '2-day', '4-day', '7-day', '14-day', '30-day'];
        var html = '';
        for (var i = 0; i < 6; i++) {
            html += '<div class="srs-box' + (i === 0 && due > 0 ? ' due' : '') + '"><div class="box-num">Box ' + (i + 1) + ' · ' + labels[i] + '</div><div class="box-count">' + counts[i] + '</div><div class="box-due">' + (i === 0 ? (due > 0 ? due + ' due now' : 'all clear') : 'interval ' + MMSRS.BOX_INTERVALS[i] + 'd') + '</div></div>';
        }
        host.innerHTML = html;
        var countEl = document.getElementById('flashcard-count-label');
        if (countEl) countEl.textContent = total;
    }

    function flashReview() {
        var due = MMSRS.dueCards();
        if (!due.length) {
            MMUtil.toast('🎉 No cards due — box 1 is clear. Come back tomorrow.', 'success');
            return;
        }
        flashState = { queue: MMUtil.sample(due, Math.min(40, due.length)), idx: 0, revealed: false, done: 0, total: due.length };
        renderFlashActive();
    }

    function renderFlashActive() {
        var host = document.getElementById('flash-active');
        if (!host) return;
        if (!flashState.queue.length || flashState.idx >= flashState.queue.length) {
            finishFlash();
            return;
        }
        host.style.display = '';
        var item = flashState.queue[flashState.idx];
        var card = (window.FLASHCARDS || [])[item.idx];
        var st = MMSRS.all()[item.id];
        var html = '<div class="flash-progress-row"><span>Card ' + (flashState.idx + 1) + '/' + flashState.queue.length + '</span><span>due today: ' + Math.max(0, flashState.total - flashState.idx) + '</span></div>';
        html += '<div class="flash-card" id="flash-card">' +
            '<span class="fc-topic">' + topicIcon(card.t) + ' ' + topicName(card.t) + '</span>' +
            '<span class="fc-box">box ' + (st ? st.box : 1) + '</span>' +
            '<div class="' + (flashState.revealed ? 'fc-back' : 'fc-front') + '">' + (flashState.revealed ? MMUtil.esc(card.b) : MMUtil.esc(card.f)) + '</div>' +
            '<div class="fc-hint">' + (flashState.revealed ? '' : 'click to flip') + '</div>' +
            '</div>';
        html += '<div class="flash-controls">';
        if (!flashState.revealed) {
            html += '<button class="btn btn-primary" id="flash-flip">Show Answer</button>';
        } else {
            html += '<button class="btn btn-danger btn-sm" id="flash-dont">✗ Don\'t Know → Box 1</button>';
            html += '<button class="btn btn-success btn-sm" id="flash-know">✓ Knew It → Next Box</button>';
        }
        html += '<button class="btn btn-ghost btn-sm" id="flash-stop">Stop Session</button>';
        html += '</div>';
        host.innerHTML = html;

        var cardEl = document.getElementById('flash-card');
        cardEl.addEventListener('click', function () {
            if (!flashState.revealed) {
                flashState.revealed = true;
                renderFlashActive();
            }
        });
        var flip = document.getElementById('flash-flip');
        if (flip) flip.addEventListener('click', function (ev) { ev.stopPropagation(); flashState.revealed = true; renderFlashActive(); });
        var know = document.getElementById('flash-know');
        if (know) know.addEventListener('click', function (ev) { ev.stopPropagation(); gradeFlash(true); });
        var dont = document.getElementById('flash-dont');
        if (dont) dont.addEventListener('click', function (ev) { ev.stopPropagation(); gradeFlash(false); });
        var stop = document.getElementById('flash-stop');
        if (stop) stop.addEventListener('click', function (ev) { ev.stopPropagation(); endFlashSession(false); });
    }

    function gradeFlash(knew) {
        var item = flashState.queue[flashState.idx];
        var newly = MMSRS.grade(item.id, knew);
        (newly || []).forEach(function (b) { MMUtil.toast('🏅 Badge earned: ' + b.name, 'gold'); });
        flashState.idx += 1;
        flashState.revealed = false;
        // if the card is demoted to box 1 it stays due today —
        // re-insert so the user can try it again this session
        if (!knew) {
            flashState.queue.push(item);
        }
        renderFlashActive();
    }

    function endFlashSession(finished) {
        flashState.queue = [];
        flashState.idx = 0;
        var host = document.getElementById('flash-active');
        if (host) { host.style.display = 'none'; host.innerHTML = ''; }
        MMUtil.toast(finished ? '🃏 Review session complete. ' + MMSRS.dueCount() + ' cards still due.' : 'Session stopped.', 'success');
        renderSrsDashboard();
    }

    function finishFlash() {
        endFlashSession(true);
    }

    /* ---------- error log ---------- */
    function renderErrorLog() {
        var list = MMErrors.all();
        var byType = MMErrors.byType();
        setText('total-errors-value', list.length);
        setText('concept-errors-value', byType.concept);
        setText('calculation-errors-value', byType.calculation);
        setText('trap-errors-value', byType.trap);
        setText('time-errors-value', byType.time);

        var trapSel = document.getElementById('error-trap-select');
        if (trapSel && !trapSel.options.length) {
            var h = '<option value="">(optional) related trap…</option>';
            (window.TRAP_DATABASE || []).forEach(function (t) {
                h += '<option value="' + MMUtil.esc(t.id) + '">' + MMUtil.esc(t.example.split('—')[0].trim()) + '</option>';
            });
            trapSel.innerHTML = h;
        }

        var host = document.getElementById('error-list');
        if (!host) return;
        if (!list.length) {
            host.innerHTML = '<div class="no-errors"><h4>🎯 No errors logged yet</h4><p>Every question you miss in a quiz lands here automatically. Add manual entries for the mistakes you want to review on purpose.</p></div>';
            return;
        }
        var html = '';
        list.slice(0, 60).forEach(function (e) {
            html += '<div class="error-item" data-eid="' + MMUtil.esc(e.id) + '">' +
                '<div class="ei-head"><span class="error-type">' + MMUtil.esc(e.type) + '</span>' +
                '<span class="ei-date">' + MMUtil.fmtDate(e.date) + (e.auto ? ' · auto' : '') + (e.source ? ' · ' + MMUtil.esc(e.source) : '') + '</span></div>' +
                '<div class="error-desc"><span class="ei-topic">' + topicIcon(e.topic) + ' ' + topicName(e.topic) + '</span><br><b>Q:</b> ' + MMUtil.esc(e.question || '—') + '<br><b>Wrong:</b> ' + MMUtil.esc(e.mistake || '—') + '<br><b>Right:</b> ' + MMUtil.esc(e.correct || '—') + '</div>' +
                (e.trapRef ? '<div class="ei-trap">⚠ Related trap: ' + MMUtil.esc(trapTitle(e.trapRef)) + '</div>' : '') +
                '<div class="ei-actions"><button class="btn btn-ghost btn-sm" data-del="' + MMUtil.esc(e.id) + '">Delete</button></div>' +
                '</div>';
        });
        host.innerHTML = html;
        host.querySelectorAll('[data-del]').forEach(function (b) {
            b.addEventListener('click', function () {
                MMErrors.remove(b.getAttribute('data-del'));
                renderErrorLog();
                MMUtil.toast('Error entry deleted.', 'success');
            });
        });
    }

    function trapTitle(id) {
        var db = window.TRAP_DATABASE || [];
        for (var i = 0; i < db.length; i++) if (db[i].id === id) return db[i].example.split('—')[0].trim();
        return id;
    }

    function addManualError() {
        var type = document.getElementById('error-type-select').value;
        var topic = document.getElementById('error-topic-input').value.trim();
        var question = document.getElementById('error-question-input').value.trim();
        var mistake = document.getElementById('error-mistake-input').value.trim();
        var correct = document.getElementById('error-correct-input').value.trim();
        var trapRef = document.getElementById('error-trap-select').value || null;
        if (!question) { MMUtil.toast('Write the question (even one line).', 'error'); return; }
        MMErrors.add({ type: type, topic: topic || 'general', question: question, mistake: mistake, correct: correct, trapRef: trapRef, auto: false, source: 'manual' });
        document.getElementById('error-topic-input').value = '';
        document.getElementById('error-question-input').value = '';
        document.getElementById('error-mistake-input').value = '';
        document.getElementById('error-correct-input').value = '';
        renderErrorLog();
        MMUtil.toast('Error saved — it will reappear in Revision → Error Review.', 'success');
    }

    /* ---------- revision ---------- */
    function revisionWeakTopics() {
        var p = MMProgress.all();
        var rows = [];
        Object.keys(p.topicStats).forEach(function (t) {
            var s = p.topicStats[t];
            if (s.attempts >= 5) rows.push({ t: t, pct: Math.round(100 * s.correct / s.attempts), n: s.attempts });
        });
        rows.sort(function (a, b) { return a.pct - b.pct; });
        if (!rows.length) return '<p class="muted-text">Answer at least 5 questions in a topic first — then the weak-topic ranking appears.</p>';
        var html = '<h3>Weakest topics (practice ≥5 Qs each)</h3><div class="rc-list">';
        rows.slice(0, 5).forEach(function (r) {
            var color = r.pct >= 75 ? 'var(--success)' : r.pct >= 50 ? 'var(--warning)' : 'var(--error)';
            html += '<div class="rc-item"><span class="rc-tag" style="color:' + color + '">' + topicIcon(r.t) + ' ' + topicName(r.t) + ' — ' + r.pct + '% (' + r.n + ' Qs)</span>' +
                'Target: 10 more questions at ≥80% accuracy, then re-check this list.</div>';
        });
        html += '</div><div style="margin-top:1rem;display:flex;gap:0.6rem;flex-wrap:wrap">';
        rows.slice(0, 3).forEach(function (r) {
            html += '<button class="btn btn-primary btn-sm" onclick="MM.showSection(\'quiz\');document.getElementById(\'quiz-topic-select\').value=\'' + r.t + '\';MMQuiz.startTopicQuiz()">Quiz: ' + topicName(r.t) + '</button>';
        });
        html += '</div>';
        return html;
    }

    function revisionErrorReview() {
        var list = MMErrors.all();
        if (!list.length) return '<p class="muted-text">No errors logged yet. Miss a quiz question or add one manually — this panel turns them into a revision queue.</p>';
        var html = '<h3>Error queue (' + list.length + ' logged)</h3><div class="rc-list">';
        list.slice(0, 20).forEach(function (e) {
            html += '<div class="rc-item"><span class="rc-tag">' + MMUtil.esc(e.type) + ' · ' + topicName(e.topic) + ' · ' + MMUtil.fmtDate(e.date) + '</span>' +
                MMUtil.esc(e.question) + '<br><b>Fix:</b> ' + MMUtil.esc(e.correct || 're-derive') + '</div>';
        });
        html += '</div><p class="muted-text" style="margin-top:0.9rem">Re-solve each from memory before reading the "Fix" line. Then delete the entry.</p>';
        return html;
    }

    function revisionPatternReview() {
        var p = MMProgress.all();
        // patterns the user missed most come from topicStats —
        // we surface the highest-frequency patterns in weak topics
        var weak = {};
        Object.keys(p.topicStats).forEach(function (t) {
            var s = p.topicStats[t];
            if (s.attempts >= 5 && s.correct / s.attempts < 0.75) weak[t] = true;
        });
        var db = window.PATTERN_DATABASE || [];
        var html = '<h3>Patterns to re-read</h3><div class="rc-list">';
        var shown = 0;
        db.forEach(function (pat) {
            if (shown >= 6) return;
            var weakTopic = weak[pat.topic];
            var hot = pat.frequency === 'Very High' || weakTopic;
            if (!hot) return;
            shown += 1;
            html += '<div class="rc-item"><span class="rc-tag">' + topicIcon(pat.topic) + ' ' + topicName(pat.topic) + (weakTopic ? ' · WEAK TOPIC' : ' · very high frequency') + '</span>' +
                '<b>' + MMUtil.esc(pat.name) + '</b><br>' + MMUtil.esc(pat.recognitionSignal) + '<br><b>Fast method:</b> ' + MMUtil.esc(pat.fastMethod) + '</div>';
        });
        html += '</div><p class="muted-text" style="margin-top:0.9rem">2-minute scan rule: re-read only the Recognition Signal + Fast Method lines, then drill the pattern in Quiz &amp; Mocks.</p>';
        return html;
    }

    function revisionFormulaRevision() {
        var bank = window.FORMULA_BANK || {};
        var html = '<h3>Rapid formula flash</h3><div class="rc-list">';
        var shown = 0;
        var topics = MMUtil.sample(Object.keys(bank), 3);
        topics.forEach(function (t) {
            var topic = bank[t];
            var all = [];
            (topic.subtopics || []).forEach(function (st) { all = all.concat(st.formulas); });
            MMUtil.sample(all, 5).forEach(function (f) {
                shown += 1;
                html += '<div class="rc-item"><span class="rc-tag">' + topicIcon(t) + ' ' + topicName(t) + ' · ' + MMUtil.esc(f.name) + '</span><code>' + MMUtil.esc(f.formula) + '</code></div>';
            });
        });
        html += '</div><p class="muted-text" style="margin-top:0.9rem">15 random formulas from 3 random topics. Say each aloud before reading it. Missed any? Open the Formula Bank section for that topic.</p>';
        return html;
    }

    function revisionTrapReview() {
        var db = window.TRAP_DATABASE || [];
        var html = '<h3>2-minute trap scan</h3><div class="rc-list">';
        db.forEach(function (t) {
            if (t.danger < 4) return;
            html += '<div class="rc-item"><span class="rc-tag">⚠ ' + MMUtil.esc(t.type) + ' · danger ' + t.danger + '/5 · ' + topicName(t.topic) + '</span>' +
                MMUtil.esc(t.quickCheck) + '</div>';
        });
        html += '</div><p class="muted-text" style="margin-top:0.9rem">Read only the Quick Check lines top to bottom. If a line gives you a physical "check this" reaction, you are trap-resistant.</p>';
        return html;
    }

    function revisionDailySRS() {
        flashReview();
        return '';
    }

    function renderRevisionContent(html) {
        var host = document.getElementById('revision-content');
        if (host) host.innerHTML = html || '<p class="muted-text">Pick a revision mode above.</p>';
    }

    /* ---------- plan ---------- */
    function renderPlanOverview() {
        var host = document.getElementById('plan-overview');
        if (!host) return;
        var plan = window.NINETY_DAY_PLAN || {};
        var html = '<p class="muted-text" style="margin-bottom:1rem">' + MMUtil.esc(plan.name || '') + ' · ' + (plan.dailyMinutes || 180) + ' min/day · built from PYQ weightage research (trigonometry heaviest, then arithmetic, algebra)</p>';
        (plan.phases || []).forEach(function (ph) {
            var weights = ph.topicWeight || {};
            var chips = Object.keys(weights).filter(function (k) { return weights[k] > 0; }).slice(0, 6).map(function (k) {
                return '<span class="pp-weight-chip">' + topicIcon(k) + ' ' + topicName(k) + '</span>';
            }).join('');
            html += '<div class="plan-phase-card" style="--phase-color:' + (ph.color || 'var(--primary)') + '">' +
                '<div class="pp-head"><h4>Phase ' + ph.number + ': ' + MMUtil.esc(ph.name) + '</h4><span class="pp-days">' + MMUtil.esc(ph.days) + '</span></div>' +
                '<div class="pp-focus">' + MMUtil.esc(ph.focus) + '</div>' +
                '<div class="pp-target">🎯 ' + MMUtil.esc(ph.speedTarget || '') + '</div>' +
                '<div class="pp-weights">' + chips + '</div></div>';
        });
        host.innerHTML = html;
    }

    function renderPlanDaily() {
        var host = document.getElementById('plan-daily');
        if (!host) return;
        var state = MMPlan.state();
        var day = MMPlan.day(state.currentDay);
        if (!day) return;
        var days = window.buildDailyPlan ? window.buildDailyPlan() : [];
        var opts = days.map(function (d) { return '<option value="' + d.day + '"' + (d.day === state.currentDay ? ' selected' : '') + '>Day ' + d.day + ' — ' + MMUtil.esc(d.phaseName || '') + '</option>'; }).join('');
        var html = '<div class="plan-day-nav"><button class="btn btn-ghost btn-sm" id="plan-prev">← Prev</button><select id="plan-day-select" class="filter-select" style="flex:1;min-width:200px">' + opts + '</select><button class="btn btn-ghost btn-sm" id="plan-next">Next →</button></div>';
        html += '<div class="plan-day-card"><div class="pdc-phase">Phase ' + (day.phase || '') + ' · ' + MMUtil.esc(day.phaseName || '') + '</div><h4>Day ' + day.day + '</h4>';
        html += '<div class="pdc-topics">Primary: <b>' + (day.primaryTopics || []).map(topicName).join(', ') + '</b></div>';
        day.tasks.forEach(function (t, i) {
            var done = MMPlan.isDone(day.day, i);
            html += '<label class="plan-day-task' + (done ? ' done' : '') + '"><input type="checkbox" data-day="' + day.day + '" data-ti="' + i + '" ' + (done ? 'checked' : '') + '><span>' + MMUtil.esc(t.text) + '</span></label>';
        });
        html += '<div class="pdc-target">🎯 ' + MMUtil.esc(day.target || '') + '</div></div>';
        host.innerHTML = html;

        host.querySelectorAll('input[type=checkbox]').forEach(function (b) {
            b.addEventListener('change', function () {
                MMPlan.toggleTask(parseInt(b.getAttribute('data-day'), 10), parseInt(b.getAttribute('data-ti'), 10));
                if (window.MM && MM.updateDashboard) MM.updateDashboard();
            });
        });
        var sel = document.getElementById('plan-day-select');
        if (sel) sel.addEventListener('change', function () { MMPlan.setCurrentDay(parseInt(sel.value, 10)); renderPlanDaily(); });
        var prev = document.getElementById('plan-prev');
        var next = document.getElementById('plan-next');
        if (prev) prev.addEventListener('click', function () { MMPlan.setCurrentDay(state.currentDay - 1); renderPlanDaily(); });
        if (next) next.addEventListener('click', function () { MMPlan.setCurrentDay(state.currentDay + 1); renderPlanDaily(); });
    }

    function renderPlanExam() {
        var host = document.getElementById('plan-exam');
        if (!host) return;
        var plan = window.NINETY_DAY_PLAN || {};
        var items = plan.examDayStrategy || [];
        var html = '<h3 style="font-size:1.15rem;color:var(--primary);margin-bottom:1rem">Exam-Day Strategy</h3><ol>';
        items.forEach(function (s) {
            html += '<li>' + MMUtil.esc(s) + '</li>';
        });
        html += '</ol>';
        host.innerHTML = html;
    }

    /* ---------- timer ---------- */
    function renderTimerUI() {
        var st = MMTimer.state;
        var disp = document.getElementById('timer-display');
        if (disp) {
            disp.textContent = MMUtil.fmtClock(st.remaining);
            disp.classList.toggle('warning', st.remaining <= 120 && st.running);
        }
        var fill = document.getElementById('timer-progress-fill');
        if (fill) {
            var pct = st.total ? 100 * (1 - st.remaining / st.total) : 0;
            fill.style.width = pct + '%';
        }
        var startBtn = document.getElementById('timer-start');
        var pauseBtn = document.getElementById('timer-pause');
        if (startBtn) startBtn.style.display = st.running ? 'none' : '';
        if (pauseBtn) pauseBtn.style.display = st.running ? '' : 'none';
        var ses = document.getElementById('timer-sessions');
        if (ses) ses.innerHTML = 'Today: <b>' + MMTimer.todayMinutes() + ' min</b> focus logged · aim 75+ min (3 × 25)';
        var logHost = document.getElementById('timer-log');
        if (logHost) {
            var log = MMTimer.loadLog().slice(0, 20);
            if (!log.length) {
                logHost.innerHTML = '<div class="timer-log-empty">Completed sessions appear here with date &amp; duration.</div>';
            } else {
                logHost.innerHTML = log.map(function (l) {
                    return '<div class="timer-log-item"><span>' + MMUtil.esc(l.label) + '</span><span class="tl-time">' + MMUtil.fmtDate(l.date) + '</span></div>';
                }).join('');
            }
        }
    }

    function initTimer() {
        var modes = document.querySelectorAll('.timer-mode');
        modes.forEach(function (b) {
            b.addEventListener('click', function () {
                var mins = parseInt(b.getAttribute('data-minutes'), 10);
                MMTimer.setMode(mins);
                modes.forEach(function (x) { x.classList.toggle('active', x === b); });
                renderTimerUI();
            });
        });
        var start = document.getElementById('timer-start');
        var pause = document.getElementById('timer-pause');
        var reset = document.getElementById('timer-reset');
        if (start) start.addEventListener('click', function () { MMTimer.start(); renderTimerUI(); });
        if (pause) pause.addEventListener('click', function () { MMTimer.stop(); renderTimerUI(); });
        if (reset) reset.addEventListener('click', function () { MMTimer.reset(); renderTimerUI(); });
        window.MMTimerTick = function () { renderTimerUI(); };
        window.MMToastSession = function (mins) {
            MMUtil.toast('✅ ' + mins + '-min session complete. +25 XP (focus).', 'success');
        };
        renderTimerUI();
    }

    /* ---------- profile ---------- */
    function renderProfile() {
        var p = MMProgress.all();
        var lvl = MMProgress.level();
        var nxt = MMProgress.nextLevel();
        var lvlIdx = MMProgress.LEVELS.indexOf(lvl);
        if (lvlIdx < 0) lvlIdx = 0;
        setText('profile-level', String(lvlIdx + 1));
        var lvlName = document.getElementById('profile-level-name');
        if (lvlName) lvlName.textContent = lvl.name;
        setText('profile-xp', p.xp.toLocaleString('en-IN') + (nxt ? ' / ' + nxt.min : ' XP'));
        var prog = document.getElementById('profile-progress');
        if (prog) prog.style.width = Math.round(100 * MMProgress.levelProgress()) + '%';

        var grid = document.getElementById('profile-stats-grid');
        if (grid) {
            grid.innerHTML =
                psg(p.totalAnswered, 'Questions') +
                psg(p.totalCorrect, 'Correct') +
                psg(p.totalWrong, 'Wrong') +
                psg(p.totalAnswered ? Math.round(100 * p.totalCorrect / p.totalAnswered) + '%' : '—', 'Accuracy') +
                psg(p.streakCurrent + 'd', 'Streak') +
                psg(p.streakBest + 'd', 'Best Streak') +
                psg(p.cardsReviewed, 'Cards Reviewed') +
                psg(p.focusSessions, 'Focus Sessions') +
                psg(p.mocksTaken, 'Mocks') +
                psg(p.mocksTaken ? Math.round(100 * p.mocksBest) + '%' : '—', 'Best Mock') +
                psg(p.speedModulesDone, 'Speed Drills') +
                psg(psk(p.totalTimeMs), 'Time Practiced');
        }

        var ach = document.getElementById('achievements-list');
        if (ach) {
            var html = '';
            MMProgress.BADGES.forEach(function (b) {
                var earned = (p.earnedBadgesMap || {})[b.id];
                html += '<span class="achievement' + (earned ? ' unlocked' : '') + '" title="' + MMUtil.esc(b.desc) + '">' + (earned ? '🏅' : '🔒') + ' ' + MMUtil.esc(b.name) + '</span>';
            });
            ach.innerHTML = html;
        }

        var table = document.getElementById('profile-topic-table');
        if (table) {
            var th = '<div class="ptt-row ptt-head"><span>Topic</span><span class="ptt-val">Attempts</span><span class="ptt-val">Correct</span><span class="ptt-val">Avg s</span><span class="ptt-val hide-sm">Acc</span></div>';
            var rows = '';
            Object.keys(MM_TOPICS).forEach(function (t) {
                var s = p.topicStats[t];
                if (!s) return;
                var acc = Math.round(100 * s.correct / s.attempts);
                var avg = Math.round(s.timeMs / s.attempts / 1000);
                rows += '<div class="ptt-row"><span class="ptt-name">' + topicIcon(t) + ' ' + topicName(t) + '</span><span class="ptt-val">' + s.attempts + '</span><span class="ptt-val">' + s.correct + '</span><span class="ptt-val">' + avg + '</span><span class="ptt-val hide-sm" style="color:' + (acc >= 75 ? 'var(--success)' : acc >= 50 ? 'var(--warning)' : 'var(--error)') + '">' + acc + '%</span></div>';
            });
            table.innerHTML = th + (rows || '<p class="muted-text">No topic data yet.</p>');
        }
    }

    function psg(v, l) {
        return '<div class="psg-item"><div class="psg-v">' + v + '</div><div class="psg-l">' + l + '</div></div>';
    }
    function psk(ms) {
        return MMUtil.fmtDuration(ms / 1000);
    }

    /* ---------- quiz shell ---------- */
    function initQuizShell() {
        var sel = document.getElementById('quiz-topic-select');
        if (sel && !sel.options.length) {
            var h = '<option value="all">Mixed (all topics)</option>';
            Object.keys(MM_TOPICS).forEach(function (t) {
                h += '<option value="' + t + '">' + topicIcon(t) + ' ' + topicName(t) + '</option>';
            });
            sel.innerHTML = h;
        }
    }

    function onTopicQuizPrompt() {
        var sel = document.getElementById('quiz-topic-select');
        if (sel && sel.value === 'all') {
            MMUtil.toast('Pick a specific topic, or use Mixed Set.', 'error');
        }
    }

    /* ---------- MASTERY CENTER ----------
       Topic-by-topic master plans from window.MASTERY_PLANS
       (js/data/mastery.js — weightage research + strategy guides).
       Checklist state persists in MMStore under 'mm-mastery-checks'. */
    var masteryState = { topic: null };
    var MASTERY_CHECK_KEY = 'mm-mastery-checks';

    function masteryChecks() {
        return MMStore.get(MASTERY_CHECK_KEY, {}) || {};
    }

    function renderMasteryRoadmap() {
        var host = document.getElementById('mastery-roadmap');
        if (!host) return;
        var plan = window.MASTERY_MASTER_PLAN;
        if (!plan) return;
        var html = '<div class="mr-title">🧭 ' + MMUtil.esc(plan.title) + '</div>';
        html += '<div class="mr-sub">' + MMUtil.esc(plan.sub) + '</div>';
        html += '<div class="mr-grid">';
        (plan.rules || []).forEach(function (r) {
            html += '<div class="mr-rule"><b>⚡ ' + MMUtil.esc(r.name) + '</b><span>' + MMUtil.esc(r.text) + '</span></div>';
        });
        html += '</div>';
        html += '<div class="mr-phases">';
        (plan.phases || []).forEach(function (ph, i) {
            html += '<div class="mr-phase"><div class="mr-phase-num">' + (i + 1) + '</div><div><b>' + MMUtil.esc(ph.name) + '</b>';
            html += '<div class="mrp-why">' + MMUtil.esc(ph.why) + '</div>';
            html += '<div class="mrp-meta">';
            (ph.topics || []).forEach(function (t) {
                html += '<span class="mrp-chip">' + topicIcon(t) + ' ' + topicName(t) + '</span>';
            });
            html += '<span class="mrp-chip gold">🎯 ' + MMUtil.esc(ph.milestone) + '</span>';
            html += '</div></div></div>';
        });
        html += '</div>';
        host.innerHTML = html;
    }

    function diffDots(n) {
        var s = '';
        for (var i = 1; i <= 5; i++) {
            s += '<span class="danger-dot' + (i <= n ? ' on' : '') + '" style="' + (i <= n ? 'background:var(--primary-2);box-shadow:0 0 6px rgba(139,92,246,.5)' : '') + '"></span>';
        }
        return '<span class="danger-dots">' + s + '</span>';
    }

    function renderMasteryTabs() {
        var host = document.getElementById('mastery-tabs');
        if (!host) return;
        var plans = window.MASTERY_PLANS || {};
        var keys = Object.keys(plans);
        if (!masteryState.topic || !plans[masteryState.topic]) masteryState.topic = keys[0];
        var html = '';
        keys.forEach(function (t) {
            var p = plans[t];
            html += '<button class="mastery-tab' + (t === masteryState.topic ? ' active' : '') + '" data-mt="' + t + '">' +
                p.icon + ' ' + MMUtil.esc(p.name) + ' <span class="mt-diff">' + diffDots(p.difficulty) + '</span></button>';
        });
        host.innerHTML = html;
        host.querySelectorAll('.mastery-tab').forEach(function (b) {
            b.addEventListener('click', function () {
                masteryState.topic = b.getAttribute('data-mt');
                renderMastery();
                var det = document.getElementById('mastery-detail');
                if (det) det.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        });
    }

    function renderMasteryDetail() {
        var host = document.getElementById('mastery-detail');
        if (!host) return;
        var p = (window.MASTERY_PLANS || {})[masteryState.topic];
        if (!p) { host.innerHTML = '<div class="no-data">No mastery plan loaded.</div>'; return; }

        var html = '<div class="md-hero" style="--md-color:linear-gradient(90deg,' + p.color + ', ' + p.color + 'cc)">';
        html += '<div class="md-hero-head"><span class="md-icon">' + p.icon + '</span><h3>' + MMUtil.esc(p.name) + '</h3>';
        html += '<div class="md-badges"><span class="md-badge">⏱ Master in ' + MMUtil.esc(p.timeToMaster) + '</span><span class="md-badge brand">difficulty ' + diffDots(p.difficulty) + '</span></div></div>';
        html += '<p class="md-why">' + MMUtil.esc(p.whyMatters) + '</p>';
        html += '<div class="md-weights">';
        html += '<div class="md-weight"><span class="w-v">' + MMUtil.esc(p.weightage.tier1) + '</span><span class="w-l">CGL Tier 1</span></div>';
        html += '<div class="md-weight"><span class="w-v">' + MMUtil.esc(p.weightage.tier2) + '</span><span class="w-l">CGL Tier 2</span></div>';
        html += '<div class="md-weight"><span class="w-v">' + MMUtil.esc(p.weightage.rrb) + '</span><span class="w-l">RRB NTPC</span></div>';
        html += '</div>';
        html += '<div class="md-note">' + MMUtil.esc(p.weightage.note) + '</div>';
        html += '</div>';

        html += '<div class="md-body">';

        // plan timeline
        html += '<div class="md-block"><h4><span class="h4-icon">🗓</span> Day-by-Day Master Plan</h4><div class="md-plan">';
        (p.plan || []).forEach(function (ph) {
            html += '<div class="mp-phase"><div class="mp-head"><span class="mp-days">' + MMUtil.esc(ph.days) + '</span><span class="mp-title">' + MMUtil.esc(ph.title) + '</span></div>';
            html += '<div class="mp-action">' + MMUtil.esc(ph.action) + '</div>';
            html += '<ul class="mp-details">';
            (ph.details || []).forEach(function (d) { html += '<li>' + MMUtil.esc(d) + '</li>'; });
            html += '</ul>';
            if (ph.target) html += '<span class="mp-target">🎯 ' + MMUtil.esc(ph.target) + '</span>';
            html += '</div>';
        });
        html += '</div></div>';

        // dos / donts
        html += '<div class="md-two-col">';
        html += '<div class="md-dos"><h4>✅ Kya Karein</h4><ul class="md-list">' + p.doThis.map(function (d) { return '<li>' + MMUtil.esc(d) + '</li>'; }).join('') + '</ul></div>';
        html += '<div class="md-donts"><h4>🚫 Kya NAHI Karna</h4><ul class="md-list">' + p.avoidThis.map(function (d) { return '<li>' + MMUtil.esc(d) + '</li>'; }).join('') + '</ul></div>';
        html += '</div>';

        // key techniques
        html += '<div class="md-block"><h4><span class="h4-icon">⚡</span> Key Techniques</h4><div class="md-techniques">';
        (p.keyTechniques || []).forEach(function (k) {
            html += '<div class="md-technique"><div class="md-technique-name">' + MMUtil.esc(k.name) + '</div><p>' + MMUtil.esc(k.how) + '</p>';
            if (k.example) html += '<div class="md-technique-ex"><b>Example:</b> ' + MMUtil.esc(k.example) + '</div>';
            html += '</div>';
        });
        html += '</div></div>';

        // worked examples
        html += '<div class="md-block"><h4><span class="h4-icon">🧮</span> Solved PYQ Examples</h4><div class="md-examples">';
        (p.workedExamples || []).forEach(function (ex) {
            html += '<div class="md-example">';
            html += '<div class="md-example-q">' + MMUtil.esc(ex.q) + '</div>';
            if (ex.source) html += '<div class="md-example-src">📝 ' + MMUtil.esc(ex.source) + '</div>';
            html += '<ol class="md-example-steps">';
            (ex.steps || []).forEach(function (s) { html += '<li>' + MMUtil.esc(s) + '</li>'; });
            html += '</ol>';
            html += '<div class="md-example-fast"><b>⚡ Fast method:</b> ' + MMUtil.esc(ex.fast) + '</div>';
            html += '</div>';
        });
        html += '</div></div>';

        // checklist
        var checks = masteryChecks();
        var doneIdx = checks[masteryState.topic] || [];
        html += '<div class="md-block"><h4><span class="h4-icon">🏁</span> Mastery Checklist (' + doneIdx.length + '/' + (p.masteryChecklist || []).length + ' complete)</h4><div class="md-checklist">';
        (p.masteryChecklist || []).forEach(function (c, i) {
            var done = doneIdx.indexOf(i) !== -1;
            html += '<label class="mc-item' + (done ? ' done' : '') + '"><input type="checkbox" data-mci="' + i + '" ' + (done ? 'checked' : '') + '><span>' + MMUtil.esc(c) + '</span></label>';
        });
        html += '</div></div>';

        // practice prescription + exam tips
        html += '<div class="md-two-col">';
        html += '<div class="md-block" style="padding:1.3rem"><h4 style="margin-bottom:0.9rem"><span class="h4-icon">📅</span> Daily Prescription</h4><div class="md-practice">';
        var pr = p.dailyPractice || {};
        html += '<div class="md-practice-card"><span class="p-v">' + (pr.questions || 0) + '</span><span class="p-l">Questions/day</span></div>';
        html += '<div class="md-practice-card"><span class="p-v">' + (pr.minutes || 0) + '</span><span class="p-l">Minutes</span></div>';
        html += '<div class="md-practice-card" style="text-align:left;grid-column:1/-1"><span class="p-l">Focus</span><p style="font-size:0.8rem;color:var(--text-2);margin-top:0.25rem">' + MMUtil.esc(pr.focus || '—') + '</p></div>';
        if (pr.drill) html += '<div class="md-practice-card" style="text-align:left;grid-column:1/-1"><span class="p-l">Daily drill</span><p style="font-size:0.8rem;color:var(--text-2);margin-top:0.25rem">' + MMUtil.esc(pr.drill) + '</p></div>';
        html += '</div></div>';
        html += '<div class="md-block" style="padding:1.3rem"><h4 style="margin-bottom:0.9rem"><span class="h4-icon">🎯</span> Exam-Day Tips</h4><ul class="md-exam-tips">';
        (p.examDayTips || []).forEach(function (t) { html += '<li>' + MMUtil.esc(t) + '</li>'; });
        html += '</ul></div>';
        html += '</div>';

        // CTA row
        html += '<div class="md-cta-row">';
        html += '<button class="btn btn-primary" id="md-practice">🚀 Practice Now (15 Qs)</button>';
        html += '<button class="btn btn-ghost" id="md-pyq">📚 Open PYQ Bank for ' + MMUtil.esc(p.name) + '</button>';
        html += '<button class="btn btn-ghost" id="md-patterns">⚡ See Related Patterns</button>';
        html += '</div>';

        html += '</div>';
        host.innerHTML = html;

        // wire checklist
        host.querySelectorAll('.mc-item input').forEach(function (inp) {
            inp.addEventListener('change', function () {
                var i = parseInt(inp.getAttribute('data-mci'), 10);
                var all = masteryChecks();
                var cur = all[masteryState.topic] || [];
                if (inp.checked) {
                    if (cur.indexOf(i) === -1) cur.push(i);
                } else {
                    cur = cur.filter(function (x) { return x !== i; });
                }
                all[masteryState.topic] = cur;
                MMStore.set(MASTERY_CHECK_KEY, all);
                inp.closest('.mc-item').classList.toggle('done', inp.checked);
                renderMasteryDetail();
                if (all[masteryState.topic].length === (p.masteryChecklist || []).length) {
                    MMUtil.toast('🏆 ' + p.name + ' mastered — full checklist complete!', 'gold');
                }
            });
        });

        // wire CTAs
        var pb = host.querySelector('#md-practice');
        if (pb) pb.addEventListener('click', function () {
            MM.showSection('quiz');
            MMQuiz.startTopic(masteryState.topic, 15);
        });
        var pqb = host.querySelector('#md-pyq');
        if (pqb) pqb.addEventListener('click', function () {
            MM.setPyqTopic(masteryState.topic);
        });
        var pab = host.querySelector('#md-patterns');
        if (pab) pab.addEventListener('click', function () {
            MM.setPatternTopic(masteryState.topic);
        });
    }

    function renderMastery() {
        renderMasteryRoadmap();
        renderMasteryTabs();
        renderMasteryDetail();
    }

    function setPyqTopic(t) {
        pyqState.topic = t;
        pyqState.page = 1;
        showSection('pyq-db');
        renderPyqList();
    }

    function setPatternTopic(t) {
        patternState.topic = t;
        showSection('patterns');
        renderPatterns();
    }

    /* ---------- RENDERERS registry ---------- */
    var RENDERERS = {
        'dashboard': function () { updateDashboard(); },
        'learn': function () { renderLearn(); },
        'mastery': function () { renderMastery(); },
        'formulas': function () { renderFormulas(); },
        'pyq-db': function () { renderPyqList(); },
        'quiz': function () { initQuizShell(); },
        'patterns': function () { renderPatterns(); },
        'traps': function () { renderTraps(); },
        'speed': function () { renderSpeedModules(); },
        'flashcards': function () { renderSrsDashboard(); },
        'calc-lab': function () { },
        'error-log': function () { renderErrorLog(); },
        'revision': function () { renderRevisionContent(''); },
        'plan': function () { renderPlanOverview(); renderPlanDaily(); renderPlanExam(); },
        'timer': function () { initTimer(); },
        'profile': function () { renderProfile(); }
    };

    /* ---------- wiring ---------- */
    function initNav() {
        var links = document.querySelectorAll('#nav-links a');
        links.forEach(function (a) {
            a.addEventListener('click', function (ev) {
                ev.preventDefault();
                showSection(a.getAttribute('href').slice(1));
                var nav = document.querySelector('.main-nav .nav-links');
                if (nav) nav.classList.remove('active');
            });
        });
        var menuBtn = document.querySelector('.menu-toggle');
        if (menuBtn) {
            menuBtn.addEventListener('click', function () {
                var nav = document.querySelector('.main-nav .nav-links');
                if (nav) nav.classList.toggle('active');
            });
        }
        var settings = document.getElementById('settings-btn');
        if (settings) settings.addEventListener('click', MMReset);
    }

    function initPyqInputs() {
        var search = document.getElementById('pyq-search');
        var examSel = document.getElementById('pyq-exam-filter');
        var yearSel = document.getElementById('pyq-year-filter');
        var diffSel = document.getElementById('pyq-difficulty-filter');
        var deb;
        if (search) search.addEventListener('input', function () {
            clearTimeout(deb);
            deb = setTimeout(function () { pyqState.search = search.value.trim(); pyqState.page = 1; renderPyqList(); }, 220);
        });
        if (examSel) examSel.addEventListener('change', function () { pyqState.exam = examSel.value; pyqState.page = 1; renderPyqList(); });
        if (yearSel) yearSel.addEventListener('change', function () { pyqState.year = yearSel.value; pyqState.page = 1; renderPyqList(); });
        if (diffSel) diffSel.addEventListener('change', function () { pyqState.diff = diffSel.value; pyqState.page = 1; renderPyqList(); });
    }

    function initLearnFilter() {
        var sel = document.getElementById('learn-level-select');
        if (sel) sel.addEventListener('change', function () { renderLearn(); });
    }

    function initFormulaSearch() {
        var inp = document.getElementById('formula-search');
        var deb;
        if (inp) inp.addEventListener('input', function () {
            clearTimeout(deb);
            deb = setTimeout(function () { formulaState.search = inp.value.trim(); renderFormulas(); }, 200);
        });
    }

    function initQOTD() {
        var b = document.getElementById('qotd-solve');
        if (b) b.addEventListener('click', qotdSolve);
    }

    function initErrorAdd() {
        var btn = document.querySelector('.error-add .btn-primary');
        if (btn) btn.addEventListener('click', addManualError);
    }

    function runRevision(key) {
        var opts = {
            'weak': revisionWeakTopics,
            'errors': revisionErrorReview,
            'patterns': revisionPatternReview,
            'formulas': revisionFormulaRevision,
            'traps': revisionTrapReview
        };
        showSection('revision');
        if (key === 'srs') {
            showSection('flashcards');
            flashReview();
            return;
        }
        renderRevisionContent(opts[key]());
    }

    function initRevision() {
        // Buttons use inline onclick → MMRevision.* (global, defined
        // below the IIFE); nothing extra to wire here.
    }

    /* ---------- boot ---------- */
    function init() {
        MMTheme.init();
        initNav();
        initPyqInputs();
        initLearnFilter();
        initFormulaSearch();
        initQOTD();
        initErrorAdd();
        initRevision();
        initQuizShell();
        // dashboard first so stats show on load
        RENDERERS.dashboard();
        // toast container pre-create
        MMUtil.toast('📚 Loaded ' + (window.PYQ_BANK ? window.PYQ_BANK.length.toLocaleString('en-IN') : 0) + ' PYQs · ' + (window.FLASHCARD_COUNT || 0) + ' cards · ' + (window.PATTERN_COUNT || 0) + ' patterns · ' + (window.TRAP_COUNT || 0) + ' traps', 'success');
    }

    /* ---------- public API ---------- */
    return {
        showSection: showSection,
        updateDashboard: updateDashboard,
        startSpeedAgain: startSpeedAgain,
        flashReview: flashReview,
        onTopicQuizPrompt: onTopicQuizPrompt,
        setPyqTopic: setPyqTopic,
        setPatternTopic: setPatternTopic,
        runRevision: runRevision,
        openMasteryTopic: function (t) {
            if (window.MASTERY_PLANS && MASTERY_PLANS[t]) masteryState.topic = t;
            showSection('mastery');
            renderMastery();
        },
        _renderers: RENDERERS,
        _init: init,
        _openPYQModal: openPYQModal,
        _renderPlanDaily: renderPlanDaily
    };
})();

// expose for inline onclick handlers in index.html
window.MMPlanRenderDaily = function () { MM._renderPlanDaily(); };
window.startSession = function (id) { MM.showSection(id); };
window.MMFlash = {
    review: function () {
        MM.showSection('flashcards');
        MM.flashReview();
    }
};
window.MMRevision = {
    weakTopics: function () { MM.runRevision('weak'); },
    errorReview: function () { MM.runRevision('errors'); },
    patternReview: function () { MM.runRevision('patterns'); },
    formulaRevision: function () { MM.runRevision('formulas'); },
    trapReview: function () { MM.runRevision('traps'); },
    dailySRS: function () { MM.runRevision('srs'); }
};

document.addEventListener('DOMContentLoaded', function () {
    MM._init();
});
