/* ============================================================
   MATHMASTERY ENGINE v2 — QUIZ & MOCK ENGINE
   (Deep Research Edition)
   ------------------------------------------------------------
   Four practice modes, all driven by the data files:

   1. Solved PYQ mode   — 40 hand-solved questions (featured.js)
      with step-by-step solutions, fast method and trap note.
   2. Topic quiz        — N questions from one topic of the
      10,518-question PYQ bank (pyq-bank.js).
   3. Mixed set         — random cross-topic mix, optional
      medium/hard only.
   4. Full mock         — 30 Qs · 18 min · +1 / −0.25, question
      palette, exam-style navigation, full analysis report.

   Every answered question is routed to MMProgress (XP, topic
   stats, streak, badges). Mock results additionally call
   MMProgress.recordMock.

   The engine is mode-agnostic inside: start(mode, opts) builds
   a session object, then render()/answer()/finish() drive it.
   ============================================================ */

'use strict';

window.MMQuiz = (function () {
    /* ---------- constants ---------- */
    var QUESTION_PAGE = 25;          // mock: questions per page in report
    var MOCK_SIZE = 30;
    var MOCK_SECONDS = 18 * 60;
    var MOCK_NEGATIVE = 0.25;
    var LETTERS = ['a', 'b', 'c', 'd'];

    /* ---------- session state ---------- */
    var S = {
        active: false,
        mode: null,               // 'solved' | 'topic' | 'mixed' | 'mock' | 'pattern'
        questions: [],            // normalised question list
        idx: 0,
        answers: {},              // qIndex → {pick, correct, timeMs, skipped}
        perQStart: 0,
        sessionStart: 0,
        timerHandle: null,
        timeLeft: 0,
        negative: false,
        locked: false             // solved mode: lock until user answers
    };

    /* ==========================================================
       Question normalisation
       PYQ_BANK entries: {t,s,q,o:{a..d},a,e,d,y,sh,p,df}
       FEATURED entries: {id,topic,exam,difficulty,question,options[4],
       answer(index),pattern,idealTime,solution[],fastMethod,trap}
       Pattern mastery: {question, answer}
       Normalised: {topic, source, text, opts[4], key (0-3),
       pattern, diff, exam, date, patternId, solution, fast, trap,
       idealTime, hasSolution}
       ========================================================== */
    function normBank(q, i) {
        return {
            topic: q.t || 'general',
            source: q.s || 'PYQ Bank',
            text: q.q || '',
            opts: [q.o.a, q.o.b, q.o.c, q.o.d].map(function (x) { return x || ''; }),
            key: LETTERS.indexOf(q.a),
            pattern: q.p || '',
            diff: q.df || 'medium',
            exam: q.e || q.s || 'PYQ Bank',
            date: q.d,
            patternId: null,
            solution: null,
            fast: null,
            trap: null,
            idealTime: null,
            hasSolution: false,
            _i: i
        };
    }

    function normFeatured(f) {
        return {
            topic: f.topic,
            source: f.exam || 'Featured PYQ',
            text: f.question,
            opts: f.options.slice(0, 4),
            key: f.answer,
            pattern: f.pattern || '',
            diff: f.difficulty || 'medium',
            exam: f.exam || 'Featured',
            date: null,
            patternId: f.pattern || null,
            solution: f.solution || [],
            fast: f.fastMethod || null,
            trap: f.trap || null,
            idealTime: f.idealTime || null,
            hasSolution: true,
            _i: null
        };
    }

    function normMastery(m, pattern) {
        // mastery test items are open: render 4 options if given,
        // otherwise "show answer" check style (opts = ['', '', '', ''] → special render)
        return {
            topic: pattern.topic,
            source: 'Pattern Drill — ' + pattern.name,
            text: m.question,
            opts: m.options || [],
            key: -1, // open answer; compare by text
            openAnswer: m.answer,
            pattern: pattern.id,
            diff: 'medium',
            exam: 'Pattern Mastery Test',
            date: null,
            patternId: pattern.id,
            solution: [pattern.concept, pattern.fastMethod].filter(Boolean),
            fast: null,
            trap: (pattern.commonTraps && pattern.commonTraps[0]) || null,
            idealTime: pattern.idealTime || null,
            hasSolution: true,
            _i: null,
            _patternName: pattern.name
        };
    }

    /* ==========================================================
       Mode 1: Solved PYQ practice
       ========================================================== */
    function startSolvedMode() {
        var featured = window.FEATURED_PYQS || [];
        if (!featured.length) {
            MMUtil.toast('No solved PYQs loaded.', 'error');
            return;
        }
        var qs = MMUtil.sample(featured, 10).map(normFeatured);
        begin({
            mode: 'solved',
            title: 'Solved PYQ Practice',
            questions: qs,
            negative: false,
            timer: null,
            showSolutionAfter: true
        });
    }

    /* Some extracted PYQs lost one or more option labels in the
       PDF linearisation (roughly 8-15% of the bank). For QUIZING
       we always prefer questions with all 4 options present so
       the options render cleanly; we fall back to the full pool
       only if a topic has too few complete questions. */
    function completePool(pool, minComplete) {
        var complete = pool.filter(function (q) {
            return q.o && q.o.a && q.o.b && q.o.c && q.o.d && q.q && q.q.length >= 10;
        });
        return complete.length >= minComplete ? complete : pool;
    }

    /* ==========================================================
       Mode 2: Topic quiz
       ========================================================== */
    function startTopicQuizPrompt(prefTopic) {
        var sel = document.getElementById('quiz-topic-select');
        if (sel && prefTopic) {
            sel.value = prefTopic;
        }
        if (window.MM && MM.onTopicQuizPrompt) MM.onTopicQuizPrompt();
    }

    function startTopicQuiz() {
        var sel = document.getElementById('quiz-topic-select');
        var cntSel = document.getElementById('quiz-count-select');
        var topic = sel ? sel.value : 'all';
        var count = cntSel ? (parseInt(cntSel.value, 10) || 20) : 20;
        if (topic === 'all') return startMixed();
        startTopic(topic, count);
    }

    function startTopic(topic, count) {
        var bank = window.PYQ_BANK || [];
        var pool = completePool(bank.filter(function (q) { return q.t === topic; }), Math.min(count, 10));
        if (pool.length < 5) {
            MMUtil.toast('Not enough PYQs in this topic — trying mixed set instead.', 'error');
            return startMixed();
        }
        var qs = MMUtil.sample(pool, Math.min(count, pool.length)).map(normBank);
        begin({
            mode: 'topic',
            title: 'Topic Quiz — ' + (topic.replace(/-/g, ' ')),
            questions: qs,
            negative: false,
            timer: null,
            showSolutionAfter: false
        });
    }

    /* ==========================================================
       Mode 3: Mixed set
       ========================================================== */
    function startMixed() {
        var cntSel = document.getElementById('mixed-count-select');
        var hardOnly = document.getElementById('mixed-hard');
        var count = cntSel ? (parseInt(cntSel.value, 10) || 15) : 15;
        var hard = hardOnly ? hardOnly.checked : false;
        var bank = window.PYQ_BANK || [];
        var pool = hard
            ? bank.filter(function (q) { return q.df === 'medium' || q.df === 'hard'; })
            : bank;
        pool = completePool(pool, count);
        var qs = MMUtil.sample(pool, count).map(normBank);
        begin({
            mode: 'mixed',
            title: 'Mixed Set' + (hard ? ' (medium/hard)' : ''),
            questions: qs,
            negative: false,
            timer: null,
            showSolutionAfter: false
        });
    }

    /* ==========================================================
       Mode 4: Full mock (exam simulation)
       ========================================================== */
    function startMockTest() {
        var bank = window.PYQ_BANK || [];
        if (bank.length < MOCK_SIZE) {
            MMUtil.toast('PYQ bank not loaded.', 'error');
            return;
        }
        // Weighted sampling: reflect the real paper mix —
        // trigonometry + arithmetic-heavy (research: trig 152,
        // arithmetic 96, algebra 62 of the 312-paper sample).
        var weights = {
            'trigonometry': 0.16,
            'number-system': 0.12,
            'simplification': 0.10,
            'algebra': 0.14,
            'geometry': 0.10,
            'mensuration': 0.09,
            'ratio-proportion': 0.10,
            'hcf-lcm': 0.06,
            'partnership': 0.06,
            'heights-distances': 0.05,
            'mixture-alligation': 0.02
        };
        var picked = [];
        var byTopic = {};
        bank.forEach(function (q, i) {
            (byTopic[q.t] = byTopic[q.t] || []).push(q);
        });
        // prefer complete 4-option questions in the mock paper too
        Object.keys(byTopic).forEach(function (t) {
            byTopic[t] = completePool(byTopic[t], 5);
        });
        var remaining = MOCK_SIZE;
        var topics = Object.keys(weights);
        while (remaining > 0 && picked.length < MOCK_SIZE) {
            var totalW = 0;
            topics.forEach(function (t) { totalW += weights[t] * (byTopic[t] ? byTopic[t].length : 0); });
            if (totalW <= 0) break;
            var r = Math.random() * totalW;
            var acc = 0, chosen = null;
            for (var i = 0; i < topics.length; i++) {
                var t = topics[i];
                var w = weights[t] * (byTopic[t] ? byTopic[t].length : 0);
                acc += w;
                if (r <= acc && byTopic[t] && byTopic[t].length) { chosen = t; break; }
            }
            if (!chosen) {
                var fallbacks = topics.filter(function (t) { return byTopic[t] && byTopic[t].length; });
                if (!fallbacks.length) break;
                chosen = fallbacks[Math.floor(Math.random() * fallbacks.length)];
            }
            var q = MMUtil.sample(byTopic[chosen], 1)[0];
            picked.push(q);
            remaining -= 1;
            if (picked.length >= MOCK_SIZE) break;
        }
        // Top up with pure random if weighting ran dry.
        while (picked.length < MOCK_SIZE) {
            picked.push(MMUtil.sample(bank, 1)[0]);
        }
        var qs = MMUtil.sample(picked, MOCK_SIZE).map(normBank);
        begin({
            mode: 'mock',
            title: 'Full Mock Test',
            questions: qs,
            negative: true,
            timer: MOCK_SECONDS,
            showSolutionAfter: false,
            isMock: true
        });
    }

    /* ==========================================================
       Mode 5: Pattern drill (from masteryTest items)
       ========================================================== */
    function startPatternDrill(patternId) {
        var db = window.PATTERN_DATABASE || [];
        var list = patternId
            ? db.filter(function (p) { return p.id === patternId; })
            : MMUtil.sample(db, 5);
        var qs = [];
        list.forEach(function (p) {
            (p.masteryTest || []).forEach(function (m) {
                qs.push(normMastery(m, p));
            });
        });
        if (!qs.length) {
            MMUtil.toast('No mastery questions found for that pattern.', 'error');
            return;
        }
        begin({
            mode: 'pattern',
            title: 'Pattern Drill — ' + (patternId ? patternName(patternId) : list[0].name),
            questions: qs,
            negative: false,
            timer: null,
            showSolutionAfter: true
        });
    }

    function patternName(id) {
        var db = window.PATTERN_DATABASE || [];
        for (var i = 0; i < db.length; i++) if (db[i].id === id) return db[i].name;
        return id;
    }

    /* ==========================================================
       Session lifecycle
       ========================================================== */
    function begin(cfg) {
        S.active = true;
        S.mode = cfg.mode;
        S.title = cfg.title;
        S.questions = cfg.questions;
        S.idx = 0;
        S.answers = {};
        S.negative = cfg.negative;
        S.isMock = !!cfg.isMock;
        S.showSolutionAfter = cfg.showSolutionAfter;
        S.sessionStart = Date.now();
        S.perQStart = Date.now();
        S.locked = false;
        S.timeLeft = cfg.timer || 0;

        if (S.timerHandle) clearInterval(S.timerHandle);
        if (cfg.timer) {
            S.timerHandle = setInterval(tick, 1000);
        }
        render();
    }

    function tick() {
        if (!S.active) return;
        S.timeLeft -= 1;
        renderTimer();
        if (S.timeLeft <= 0) {
            MMUtil.toast('⏰ Time up! Submitting…', 'error');
            finish(true);
        }
    }

    function renderTimer() {
        var el = document.getElementById('quiz-timer');
        if (!el) return;
        el.textContent = MMUtil.fmtClock(S.timeLeft);
        el.classList.toggle('warn', S.timeLeft <= 120);
    }

    /* ---------- rendering ---------- */
    function render() {
        var host = document.getElementById('quiz-active');
        if (!host) return;
        host.style.display = '';
        if (S.mode === 'mock') renderMock(); else renderRegular();
    }

    function progressPct() {
        var answered = Object.keys(S.answers).length;
        return Math.round(100 * answered / S.questions.length);
    }

    function renderRegular() {
        var host = document.getElementById('quiz-active');
        var q = S.questions[S.idx];
        var total = S.questions.length;
        var answered = Object.keys(S.answers).length;

        var html = '';
        html += '<div class="quiz-topbar">';
        html += '<div class="qt-title">' + MMUtil.esc(S.title) + ' <span class="muted-text">· Q' + (S.idx + 1) + '/' + total + '</span></div>';
        if (S.timeLeft > 0) html += '<div class="qt-timer" id="quiz-timer">' + MMUtil.fmtClock(S.timeLeft) + '</div>';
        html += '</div>';
        html += '<div class="quiz-progress"><div class="quiz-progress-fill" style="width:' + progressPct() + '%"></div></div>';
        html += qCardHtml(q, S.idx);
        html += '<div class="quiz-nav">';
        html += '<button class="btn btn-ghost btn-sm" id="q-prev" ' + (S.idx === 0 ? 'disabled' : '') + '>← Previous</button>';
        if (S.showSolutionAfter) {
            html += '<button class="btn btn-ghost btn-sm" id="q-show-sol" ' + (!S.answers[S.idx] ? 'disabled' : '') + '>💡 Show Solution</button>';
        }
        if (S.idx < total - 1) {
            html += '<button class="btn btn-primary btn-sm" id="q-next">Next →</button>';
        } else {
            html += '<button class="btn btn-success" id="q-finish">Finish &amp; Review</button>';
        }
        html += '</div>';
        html += '<div class="quiz-feedback" id="quiz-feedback"></div>';
        host.innerHTML = html;

        bindRegular();
    }

    function qCardHtml(q, idx) {
        var h = '<div class="quiz-question-card">';
        h += '<div class="qnum">Question ' + (idx + 1) + (q.pattern ? ' · pattern: ' + MMUtil.esc(q.pattern) : '') + (q.idealTime ? ' · ideal: ' + MMUtil.esc(q.idealTime) : '') + '</div>';
        h += '<div class="qtext">' + MMUtil.esc(q.text) + '</div>';
        if (q.key === -1) {
            // Open mastery question: free text entry
            h += '<div class="quiz-options"><div class="quiz-option" style="cursor:default"><input type="text" id="q-open-input" class="filter-select" style="flex:1;min-width:200px" placeholder="Your answer…" autocomplete="off"></div></div>';
        } else {
            h += '<div class="quiz-options">';
            var sel = S.answers[idx];
            q.opts.forEach(function (opt, i) {
                var cls = 'quiz-option';
                var letter = LETTERS[i].toUpperCase();
                if (sel && !sel.pending) {
                    if (i === q.key) cls += ' correct';
                    else if (i === sel.pick) cls += ' wrong';
                    h += '<div class="' + cls + '" disabled><span class="qo-letter">' + letter + '</span><span>' + MMUtil.esc(opt) + '</span></div>';
                } else {
                    if (sel && sel.pick === i) cls += ' selected';
                    h += '<div class="' + cls + '" data-qi="' + i + '"><span class="qo-letter">' + letter + '</span><span>' + MMUtil.esc(opt) + '</span></div>';
                }
            });
            h += '</div>';
        }
        h += '</div>';
        return h;
    }

    function bindRegular() {
        var host = document.getElementById('quiz-active');
        var prev = document.getElementById('q-prev');
        var next = document.getElementById('q-next');
        var finishBtn = document.getElementById('q-finish');
        var showSol = document.getElementById('q-show-sol');

        if (prev) prev.onclick = function () { S.idx -= 1; S.perQStart = Date.now(); render(); };
        if (next) next.onclick = function () { S.idx += 1; S.perQStart = Date.now(); render(); };
        if (finishBtn) finishBtn.onclick = function () { finish(false); };
        if (showSol) showSol.onclick = function () { renderSolution(S.idx, true); };

        // option clicks
        var opts = host.querySelectorAll('.quiz-option[data-qi]');
        opts.forEach(function (el) {
            el.onclick = function () {
                var pick = parseInt(el.getAttribute('data-qi'), 10);
                selectOption(pick);
            };
        });

        // open input: Enter to submit
        var openIn = document.getElementById('q-open-input');
        if (openIn) {
            openIn.onkeydown = function (ev) {
                if (ev.key === 'Enter') {
                    ev.preventDefault();
                    submitOpenAnswer(openIn.value);
                }
            };
            setTimeout(function () { openIn.focus(); }, 50);
        }
    }

    function selectOption(pick) {
        var q = S.questions[S.idx];
        if (S.answers[S.idx]) return; // already answered
        var timeMs = Date.now() - S.perQStart;
        var correct = pick === q.key;
        S.answers[S.idx] = { pick: pick, correct: correct, timeMs: timeMs, skipped: false };
        recordAnswer(q, correct, timeMs);
        render();
        renderFeedback(q, correct);
    }

    function submitOpenAnswer(text) {
        var q = S.questions[S.idx];
        if (S.answers[S.idx]) return;
        var timeMs = Date.now() - S.perQStart;
        var correct = normalize(text) === normalize(q.openAnswer);
        S.answers[S.idx] = { pick: -2, correct: correct, timeMs: timeMs, skipped: false, open: text };
        recordAnswer(q, correct, timeMs);
        render();
        renderFeedback(q, correct);
    }

    function normalize(s) {
        return String(s || '').toLowerCase().replace(/\s+/g, '').replace(/[−–]/g, '-').replace(/[^a-z0-9.\-+\/^√²³!()]/g, '');
    }

    function recordAnswer(q, correct, timeMs) {
        var res = MMProgress.recordAnswer({
            topic: q.topic,
            pattern: q.pattern || q.patternId,
            correct: correct,
            skipped: false,
            timeMs: timeMs
        });
        (res.newly || []).forEach(function (b) {
            MMUtil.toast('🏅 Badge earned: ' + b.name, 'gold');
        });
    }

    function renderFeedback(q, correct) {
        var fb = document.getElementById('quiz-feedback');
        if (!fb) return;
        var q2 = S.questions[S.idx];
        var detail = '';
        if (correct) {
            fb.className = 'quiz-feedback show good';
            fb.innerHTML = '<div class="qf-title">✅ Correct! +10 XP</div><div class="qf-detail">' + MMUtil.esc(q.source) + (q.idealTime ? ' · ideal time: ' + MMUtil.esc(q.idealTime) : '') + '</div>';
        } else {
            fb.className = 'quiz-feedback show bad';
            var ans = q.key >= 0 ? LETTERS[q.key].toUpperCase() + ') ' + (q.opts[q.key] || '') : (q.openAnswer || '');
            detail = 'Correct answer: <b>' + MMUtil.esc(ans) + '</b>';
            if (q.trap) detail += '<br>⚠ Trap: ' + MMUtil.esc(q.trap);
            fb.innerHTML = '<div class="qf-title">❌ Not quite.</div><div class="qf-detail">' + detail + '</div>';
        }
    }

    function renderSolution(idx, forceShow) {
        var fb = document.getElementById('quiz-feedback');
        var q = S.questions[idx];
        if (!fb || !q) return;
        if (!q.hasSolution && !forceShow) return;
        var html = '<div class="m-solution"><h4>Step-by-step solution</h4>';
        if (q.solution && q.solution.length) {
            html += '<ol>';
            q.solution.forEach(function (step) {
                html += '<li>' + MMUtil.esc(step) + '</li>';
            });
            html += '</ol>';
        }
        if (q.fast) html += '<p style="margin-top:0.5rem"><b style="color:var(--success)">⚡ Fast method:</b> ' + MMUtil.esc(q.fast) + '</p>';
        html += '</div>';
        if (q.trap) html += '<div class="m-trap">🛡 <b>Trap:</b> ' + MMUtil.esc(q.trap) + '</div>';
        fb.className = 'quiz-feedback show';
        fb.innerHTML = html;
    }

    /* ==========================================================
       Mock rendering (question palette + free navigation)
       ========================================================== */
    function renderMock() {
        var host = document.getElementById('quiz-active');
        var q = S.questions[S.idx];
        var total = S.questions.length;

        var html = '';
        html += '<div class="quiz-topbar">';
        html += '<div class="qt-title">🏆 ' + MMUtil.esc(S.title) + ' <span class="muted-text">· +1 / −0.25</span></div>';
        html += '<div class="qt-timer" id="quiz-timer">' + MMUtil.fmtClock(S.timeLeft) + '</div>';
        html += '</div>';
        html += '<div class="quiz-progress"><div class="quiz-progress-fill" style="width:' + progressPct() + '%"></div></div>';
        html += '<div class="mock-layout">';
        html += '<div id="mock-q-area">' + mockQCardHtml(q, S.idx) + '</div>';
        html += '<div class="mock-palette" id="mock-palette">';
        for (var i = 0; i < total; i++) {
            var cls = 'mock-pal-btn';
            if (S.answers[i]) cls += ' answered';
            if (i === S.idx) cls += ' current';
            html += '<button class="' + cls + '" data-mi="' + i + '">' + (i + 1) + '</button>';
        }
        html += '</div></div>';
        html += '<div class="quiz-nav">';
        html += '<button class="btn btn-ghost btn-sm" id="q-prev" ' + (S.idx === 0 ? 'disabled' : '') + '>← Previous</button>';
        html += '<button class="btn btn-ghost btn-sm" id="q-clear" ' + (!S.answers[S.idx] ? 'disabled' : '') + '>Clear Answer</button>';
        if (S.idx < total - 1) {
            html += '<button class="btn btn-primary btn-sm" id="q-next">Next →</button>';
        } else {
            html += '<button class="btn btn-success" id="q-submit">Submit Test</button>';
        }
        html += '</div>';
        host.innerHTML = html;

        var prev = document.getElementById('q-prev');
        var next = document.getElementById('q-next');
        var submit = document.getElementById('q-submit');
        var clear = document.getElementById('q-clear');
        if (prev) prev.onclick = function () { S.idx -= 1; S.perQStart = Date.now(); render(); };
        if (next) next.onclick = function () { S.idx += 1; S.perQStart = Date.now(); render(); };
        if (submit) submit.onclick = function () {
            var answered = Object.keys(S.answers).length;
            var left = total - answered;
            var msg = 'Submit now? You have answered ' + answered + ' of ' + total + (left ? ' (' + left + ' unanswered — no penalty, no marks).' : '') + '.';
            if (confirm(msg)) finish(false);
        };
        if (clear) clear.onclick = function () {
            delete S.answers[S.idx];
            render();
        };

        var palBtns = host.querySelectorAll('.mock-pal-btn');
        palBtns.forEach(function (el) {
            el.onclick = function () {
                var mi = parseInt(el.getAttribute('data-mi'), 10);
                S.idx = mi;
                S.perQStart = Date.now();
                render();
            };
        });

        var opts = host.querySelectorAll('.quiz-option[data-qi]');
        opts.forEach(function (el) {
            el.onclick = function () {
                var pick = parseInt(el.getAttribute('data-qi'), 10);
                selectMockOption(pick);
            };
        });
    }

    function mockQCardHtml(q, idx) {
        var h = '<div class="quiz-question-card">';
        h += '<div class="qnum">Question ' + (idx + 1) + ' of ' + S.questions.length + '</div>';
        h += '<div class="qtext">' + MMUtil.esc(q.text) + '</div>';
        h += '<div class="quiz-options">';
        var sel = S.answers[idx];
        q.opts.forEach(function (opt, i) {
            var cls = 'quiz-option';
            if (sel && sel.pick === i) cls += ' selected';
            h += '<div class="' + cls + '" data-qi="' + i + '"><span class="qo-letter">' + LETTERS[i].toUpperCase() + '</span><span>' + MMUtil.esc(opt) + '</span></div>';
        });
        h += '</div></div>';
        return h;
    }

    /* Mock: picking an option stores the answer without revealing
       correctness (exam style). */
    function selectMockOption(pick) {
        var q = S.questions[S.idx];
        var timeMs = Date.now() - S.perQStart;
        var correct = pick === q.key;
        S.answers[S.idx] = { pick: pick, correct: correct, timeMs: timeMs, skipped: false, revealed: false };
        recordAnswer(q, correct, timeMs);
        render();
    }

    /* ==========================================================
       Finish + result report
       ========================================================== */
    function finish(timedOut) {
        if (S.timerHandle) {
            clearInterval(S.timerHandle);
            S.timerHandle = null;
        }
        S.active = false;
        var total = S.questions.length;
        var answered = 0, correct = 0, wrong = 0, skipped = 0;
        var totalTimeMs = 0;
        var patternWrong = {};
        var topicWrong = {};

        S.questions.forEach(function (q, i) {
            var a = S.answers[i];
            if (!a) {
                skipped += 1;
                return;
            }
            answered += 1;
            totalTimeMs += a.timeMs;
            if (a.correct) correct += 1;
            else {
                wrong += 1;
                var pk = q.pattern || q.patternId || 'general';
                patternWrong[pk] = (patternWrong[pk] || 0) + 1;
                topicWrong[q.topic] = (topicWrong[q.topic] || 0) + 1;
            }
        });

        var marks = 0;
        if (S.negative) {
            marks = correct - MOCK_NEGATIVE * wrong;
        } else {
            marks = correct;
        }
        var pct = correct / total;
        var accuracy = answered ? correct / answered : 0;
        var avgSec = answered ? Math.round(totalTimeMs / 1000 / answered) : 0;

        // session-level achievements
        if (total >= 20 && accuracy >= 0.9 && wrong === 0) MMProgress.flag('sharpShooter');
        if (S.isMock && pct >= 0.7) MMProgress.flag('mockMaster');
        if (S.isMock) MMProgress.recordMock(pct);

        renderResult({
            timedOut: timedOut,
            total: total, answered: answered, correct: correct,
            wrong: wrong, skipped: skipped, marks: marks, pct: pct,
            accuracy: accuracy, avgSec: avgSec,
            patternWrong: patternWrong, topicWrong: topicWrong,
            totalTimeMs: totalTimeMs
        });

        // auto-log wrong questions into the error log (type: trap if
        // the question carries a pattern tag, else concept) — the
        // Revision Center then re-surfaces them.
        S.questions.forEach(function (q, i) {
            var a = S.answers[i];
            if (a && !a.correct) {
                MMErrors.add({
                    type: q.pattern ? 'trap' : 'concept',
                    topic: q.topic,
                    question: q.text.length > 140 ? q.text.slice(0, 137) + '…' : q.text,
                    mistake: 'Answered ' + (a.pick >= 0 ? LETTERS[a.pick].toUpperCase() : '?') + ' — correct was ' + LETTERS[q.key].toUpperCase() + ' (' + (q.opts[q.key] || q.openAnswer || '') + ')',
                    correct: q.fast || q.pattern || 'Re-derive from concept.',
                    trapRef: null,
                    auto: true,
                    source: q.source
                });
            }
        });
    }

    function renderResult(r) {
        var host = document.getElementById('quiz-active');
        var html = '';
        html += '<div class="quiz-result">';
        html += '<div class="qr-score">' + (S.negative ? r.marks.toFixed(2) + ' / 30' : r.correct + ' / ' + r.total) + '</div>';
        html += '<div class="qr-sub">' + MMUtil.esc(S.title) + (r.timedOut ? ' · ⏰ auto-submitted (time up)' : '') + '</div>';
        html += '<div class="qr-stats">';
        html += '<div class="qr-stat good"><div class="v">' + r.correct + '</div><div class="l">Correct</div></div>';
        html += '<div class="qr-stat bad"><div class="v">' + r.wrong + '</div><div class="l">Wrong</div></div>';
        html += '<div class="qr-stat neutral"><div class="v">' + r.skipped + '</div><div class="l">Skipped</div></div>';
        html += '<div class="qr-stat"><div class="v">' + Math.round(r.accuracy * 100) + '%</div><div class="l">Accuracy</div></div>';
        html += '<div class="qr-stat"><div class="v">' + r.avgSec + 's</div><div class="l">Avg / Q</div></div>';
        if (S.negative) html += '<div class="qr-stat"><div class="v">' + Math.round(r.pct * 100) + '%</div><div class="l">Raw %</div></div>';
        html += '</div>';

        // weak patterns in this session
        var pk = Object.keys(r.patternWrong);
        if (pk.length) {
            html += '<div class="qr-sub" style="text-align:left;margin-top:0.5rem"><b>Patterns that cost you marks:</b></div>';
            html += '<div class="qr-sub" style="text-align:left">';
            pk.slice(0, 5).forEach(function (p) {
                html += '<span class="pyq-badge" style="margin-right:0.35rem">' + MMUtil.esc(patternName(p) || p) + ' ×' + r.patternWrong[p] + '</span>';
            });
            html += '</div>';
        }
        var tk = Object.keys(r.topicWrong);
        if (tk.length) {
            html += '<div class="qr-sub" style="text-align:left;margin-top:0.5rem"><b>Topics to revise:</b> ';
            tk.sort(function (a, b) { return r.topicWrong[b] - r.topicWrong[a]; }).slice(0, 4).forEach(function (t) {
                html += MMUtil.esc(t.replace(/-/g, ' ')) + ' (' + r.topicWrong[t] + ') · ';
            });
            html += '</div>';
        }
        html += '<div style="margin-top:1.25rem;display:flex;gap:0.75rem;justify-content:center;flex-wrap:wrap">';
        html += '<button class="btn btn-primary" id="q-review-btn">📋 Review All Questions</button>';
        html += '<button class="btn btn-ghost" onclick="MMQuiz.exitToSetup()">Exit</button>';
        html += '</div>';
        html += '<div id="quiz-review-holder"></div>';
        html += '</div>';
        host.innerHTML = html;

        document.getElementById('q-review-btn').onclick = function () {
            renderReview(document.getElementById('quiz-review-holder'));
        };
        window.scrollTo({ top: host.offsetTop - 90, behavior: 'smooth' });
    }

    function renderReview(holder) {
        var html = '<div class="quiz-review-list">';
        S.questions.forEach(function (q, i) {
            var a = S.answers[i];
            var cls = !a ? 'quiz-review-item' : (a.correct ? 'quiz-review-item ok' : 'quiz-review-item no');
            html += '<div class="' + cls + '">';
            html += '<div class="rq-text"><b>Q' + (i + 1) + '.</b> ' + MMUtil.esc(q.text) + '</div>';
            html += '<div class="rq-ans">';
            if (a && a.pick >= 0) {
                html += 'You: ' + LETTERS[a.pick].toUpperCase() + ' (' + MMUtil.esc(q.opts[a.pick]) + ') · ';
            } else if (!a) {
                html += 'You: skipped · ';
            }
            html += 'Correct: ' + (q.key >= 0 ? LETTERS[q.key].toUpperCase() + ' (' + MMUtil.esc(q.opts[q.key]) + ')' : MMUtil.esc(q.openAnswer || ''));
            html += ' · ' + Math.round((a && a.timeMs ? a.timeMs : 0) / 1000) + 's</div></div>';
        });
        html += '</div>';
        holder.innerHTML = html;
    }

    function exitToSetup() {
        if (S.timerHandle) {
            clearInterval(S.timerHandle);
            S.timerHandle = null;
        }
        S.active = false;
        S.mode = null;
        S.questions = [];
        S.answers = {};
        var host = document.getElementById('quiz-active');
        if (host) {
            host.style.display = 'none';
            host.innerHTML = '';
        }
        if (window.MM && MM.updateDashboard) MM.updateDashboard();
    }

    /* ---------- API ---------- */
    return {
        startSolvedMode: startSolvedMode,
        startTopic: startTopic,
        startTopicQuiz: startTopicQuiz,
        startTopicQuizPrompt: startTopicQuizPrompt,
        startMixed: startMixed,
        startMockTest: startMockTest,
        startPatternDrill: startPatternDrill,
        exitToSetup: exitToSetup,
        isActive: function () { return S.active; }
    };
})();
