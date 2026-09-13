/* ============================================================
   MATHMASTERY ENGINE v2 — CORE ENGINES (Deep Research Edition)
   ------------------------------------------------------------
   This file contains all the stateful engines that the UI
   (main.js / quiz-engine.js) drives. Everything persists to
   localStorage under the 'mathmastery_v2_' namespace so that:

   • progress survives page reloads
   • SRS (Leitner) schedules stay stable across sessions
   • the 90-day plan checkbox state is never lost
   • error log + speed stats compound over days

   Engines (all namespaced under window):
     MMStore    – safe localStorage wrapper
     MMUtil     – shared helpers (shuffle, fmt, date, dom)
     MMProgress – XP / levels / badges / topic stats / streak
     MMSRS      – Leitner-box spaced repetition for 260 cards
     MMSpeed    – speed drill sessions with per-question log
     MMTimer    – pomodoro / exam timers + session log
     MMErrors   – manual + auto error log with typed reasons
     MMPlan     – 90-day plan tracker (day selection + tasks)
     MMCalc     – the 8 Calculator Lab tools
     MMNotes    – notes reader open/close
   ============================================================ */

'use strict';

/* ============================================================
   1. MMStore — safe localStorage wrapper
   ------------------------------------------------------------
   Why a wrapper?
   - Some browsers (private mode, blocked storage) throw on
     setItem. Every call is try/catch'd so the app degrades to
     in-memory mode instead of crashing.
   - All keys are namespaced so v1 data ('mathmastery-*') never
     collides with v2 data ('mathmastery_v2_*').
   ============================================================ */
window.MMStore = (function () {
    var NS = 'mathmastery_v2_';
    var memory = {};

    function usable() {
        try {
            var k = NS + '__probe__';
            localStorage.setItem(k, '1');
            localStorage.removeItem(k);
            return true;
        } catch (e) {
            return false;
        }
    }

    var storageOK = usable();

    return {
        get: function (key, fallback) {
            try {
                if (storageOK) {
                    var raw = localStorage.getItem(NS + key);
                    if (raw !== null) return JSON.parse(raw);
                }
            } catch (e) {
                console.warn('[MMStore] get failed for', key, e);
            }
            if (Object.prototype.hasOwnProperty.call(memory, key)) return memory[key];
            return fallback;
        },
        set: function (key, value) {
            memory[key] = value;
            try {
                if (storageOK) localStorage.setItem(NS + key, JSON.stringify(value));
            } catch (e) {
                console.warn('[MMStore] set failed for', key, e);
            }
            return value;
        },
        remove: function (key) {
            delete memory[key];
            try {
                if (storageOK) localStorage.removeItem(NS + key);
            } catch (e) { /* ignore */ }
        },
        clearAll: function () {
            memory = {};
            try {
                if (storageOK) {
                    var toDelete = [];
                    for (var i = 0; i < localStorage.length; i++) {
                        var k = localStorage.key(i);
                        if (k && k.indexOf(NS) === 0) toDelete.push(k);
                    }
                    toDelete.forEach(function (k) { localStorage.removeItem(k); });
                }
            } catch (e) { /* ignore */ }
        }
    };
})();

/* ============================================================
   2. MMUtil — shared helpers
   ============================================================ */
window.MMUtil = {
    /* Fisher–Yates shuffle (non-mutating). */
    shuffle: function (arr) {
        var a = arr.slice();
        for (var i = a.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
        }
        return a;
    },

    /* Pick n random items from an array (non-mutating). */
    sample: function (arr, n) {
        return MMUtil.shuffle(arr).slice(0, n);
    },

    /* Escape HTML to prevent injection from question text
       (extracted PYQ text can contain < > & characters). */
    esc: function (str) {
        if (str === null || str === undefined) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    },

    /* Human-friendly date: 14/09/2026 */
    fmtDate: function (dateStr) {
        if (!dateStr) return '—';
        var d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        var dd = d.getDate();
        var mm = d.getMonth() + 1;
        var yyyy = d.getFullYear();
        return (dd < 10 ? '0' + dd : dd) + '/' + (mm < 10 ? '0' + mm : mm) + '/' + yyyy;
    },

    /* Today key: 2026-09-13 */
    todayKey: function () {
        var d = new Date();
        var mm = d.getMonth() + 1;
        var dd = d.getDate();
        return d.getFullYear() + '-' + (mm < 10 ? '0' + mm : mm) + '-' + (dd < 10 ? '0' + dd : dd);
    },

    /* Yesterday key for streak logic. */
    yesterdayKey: function () {
        var d = new Date();
        d.setDate(d.getDate() - 1);
        var mm = d.getMonth() + 1;
        var dd = d.getDate();
        return d.getFullYear() + '-' + (mm < 10 ? '0' + mm : mm) + '-' + (dd < 10 ? '0' + dd : dd);
    },

    /* Seconds → mm:ss */
    fmtClock: function (secs) {
        if (secs < 0) secs = 0;
        var m = Math.floor(secs / 60);
        var s = Math.floor(secs % 60);
        return (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s);
    },

    /* Seconds → "1h 05m 30s" */
    fmtDuration: function (secs) {
        secs = Math.round(secs);
        var h = Math.floor(secs / 3600);
        var m = Math.floor((secs % 3600) / 60);
        var s = secs % 60;
        var parts = [];
        if (h) parts.push(h + 'h');
        if (m) parts.push(m + 'm');
        if (s || !parts.length) parts.push(s + 's');
        return parts.join(' ');
    },

    /* Simple deterministic hash for stable "question of the day". */
    strHash: function (str) {
        var h = 5381;
        for (var i = 0; i < str.length; i++) {
            h = ((h << 5) + h + str.charCodeAt(i)) >>> 0;
        }
        return h;
    },

    /* Build <el> with className + innerHTML + child text safely. */
    el: function (tag, className, html) {
        var e = document.createElement(tag);
        if (className) e.className = className;
        if (html !== undefined && html !== null) e.innerHTML = html;
        return e;
    },

    /* Text node helper. */
    txt: function (tag, className, text) {
        var e = MMUtil.el(tag, className);
        e.textContent = text;
        return e;
    },

    /* Toast notifications. */
    toast: function (msg, type) {
        var container = document.getElementById('toast-container');
        if (!container) {
            container = MMUtil.el('div', 'toast-container');
            container.id = 'toast-container';
            document.body.appendChild(container);
        }
        var t = MMUtil.el('div', 'toast ' + (type || ''), MMUtil.esc(msg));
        container.appendChild(t);
        setTimeout(function () {
            t.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            t.style.opacity = '0';
            t.style.transform = 'translateX(30px)';
            setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 420);
        }, 3200);
    }
};

/* ============================================================
   3. MMProgress — XP, levels, badges, topic stats, streak
   ------------------------------------------------------------
   XP model:
     +10 XP per correct PYQ-style question
     +5 XP per flashcard that reaches a higher box
     +15 XP per completed speed module (≥80% accuracy)
     +25 XP per completed 25-min focus session
     +40 XP per completed mock test (bonus +20 if ≥70%)
   Levels (cumulative thresholds), names from the 90-day plan
   phases so the learner feels the progression is the plan.
   ============================================================ */
window.MMProgress = (function () {
    var KEY = 'progress';

    var LEVELS = [
        { min: 0, name: 'Foundation' },
        { min: 200, name: 'Apprentice' },
        { min: 500, name: 'Concept Clarity' },
        { min: 900, name: 'Pattern Reader' },
        { min: 1400, name: 'Speed Builder' },
        { min: 2000, name: 'Trap Aware' },
        { min: 2700, name: 'Exam Ready' },
        { min: 3500, name: 'Advanced' },
        { min: 4500, name: 'Mastery' },
        { min: 6000, name: 'Grandmaster' }
    ];

    var BADGES = [
        { id: 'first-steps', name: 'First Steps', desc: 'Practice 10 questions', check: function (p) { return p.totalAnswered >= 10; } },
        { id: 'hundred', name: 'Century Club', desc: 'Practice 100 questions', check: function (p) { return p.totalAnswered >= 100; } },
        { id: 'five-hundred', name: 'Half-K', desc: 'Practice 500 questions', check: function (p) { return p.totalAnswered >= 500; } },
        { id: 'sharp-shooter', name: 'Sharp Shooter', desc: '90%+ accuracy in a 20-question set', check: function (p) { return p.sharpShooter; } },
        { id: 'mock-master', name: 'Mock Master', desc: 'Score ≥70% in a full mock', check: function (p) { return p.mockMaster; } },
        { id: 'speed-demon', name: 'Speed Demon', desc: 'Finish a speed module at 80%+', check: function (p) { return p.speedDemon; } },
        { id: 'trap-avoider', name: 'Trap Avoider', desc: '100 correct in one session with no trap-pattern question missed', check: function (p) { return p.trapAvoider; } },
        { id: 'streak-3', name: 'On Fire ×3', desc: '3-day practice streak', check: function (p) { return p.streakBest >= 3; } },
        { id: 'streak-7', name: 'Week Warrior', desc: '7-day practice streak', check: function (p) { return p.streakBest >= 7; } },
        { id: 'srs-veteran', name: 'SRS Veteran', desc: 'Review 200 flashcards', check: function (p) { return p.cardsReviewed >= 200; } },
        { id: 'focus-10', name: 'Deep Worker', desc: 'Complete 10 focus sessions', check: function (p) { return p.focusSessions >= 10; } },
        { id: 'all-topics', name: 'Full Spectrum', desc: 'Answer questions from all 11 topics', check: function (p) { return Object.keys(p.topicStats).length >= 11; } }
    ];

    function blank() {
        return {
            xp: 0,
            totalAnswered: 0,
            totalCorrect: 0,
            totalWrong: 0,
            totalSkipped: 0,
            totalTimeMs: 0,
            cardsReviewed: 0,
            focusSessions: 0,
            focusMinutesToday: 0,
            focusMinutesTodayKey: '',
            streakCurrent: 0,
            streakBest: 0,
            lastPracticeDay: '',
            topicStats: {},      // topicId → {attempts, correct, timeMs, firstSeen}
            mocksTaken: 0,
            mocksBest: 0,
            speedModulesDone: 0,
            sharpShooter: false,
            mockMaster: false,
            speedDemon: false,
            trapAvoider: false,
            earnedBadges: [],
            earnedBadgesMap: {},
            history: []          // rolling 60 days: {day, answered, correct}
        };
    }

    function load() {
        var p = MMStore.get(KEY, null);
        if (!p) {
            p = blank();
            MMStore.set(KEY, p);
        }
        return p;
    }

    function levelOf(xp) {
        var lvl = LEVELS[0];
        for (var i = 0; i < LEVELS.length; i++) {
            if (xp >= LEVELS[i].min) lvl = LEVELS[i];
        }
        return lvl;
    }

    function nextLevel(xp) {
        for (var i = 0; i < LEVELS.length; i++) {
            if (xp < LEVELS[i].min) return LEVELS[i];
        }
        return null;
    }

    /* Check streak against the practice-day records. */
    function updateStreak(p) {
        var today = MMUtil.todayKey();
        if (p.lastPracticeDay === today) return p.streakCurrent;
        if (p.lastPracticeDay === MMUtil.yesterdayKey()) {
            p.streakCurrent += 1;
        } else {
            p.streakCurrent = 1;
        }
        p.lastPracticeDay = today;
        if (p.streakCurrent > p.streakBest) p.streakBest = p.streakCurrent;
        return p.streakCurrent;
    }

    function pushHistory(p, answered, correct) {
        var today = MMUtil.todayKey();
        var found = null;
        for (var i = 0; i < p.history.length; i++) {
            if (p.history[i].day === today) { found = p.history[i]; break; }
        }
        if (found) {
            found.answered += answered;
            found.correct += correct;
        } else {
            p.history.push({ day: today, answered: answered, correct: correct });
            if (p.history.length > 90) p.history = p.history.slice(-90);
        }
    }

    function checkBadges(p) {
        var newly = [];
        BADGES.forEach(function (b) {
            if (!p.earnedBadgesMap[b.id] && b.check(p)) {
                p.earnedBadgesMap[b.id] = true;
                p.earnedBadges.push({ id: b.id, name: b.name, at: MMUtil.todayKey() });
                newly.push(b);
            }
        });
        return newly;
    }

    return {
        LEVELS: LEVELS,
        BADGES: BADGES,

        load: load,

        level: function () {
            return levelOf(load().xp);
        },

        nextLevel: function () {
            return nextLevel(load().xp);
        },

        /* Progress 0-1 toward next level. */
        levelProgress: function () {
            var p = load();
            var cur = levelOf(p.xp);
            var nxt = nextLevel(p.xp);
            if (!nxt) return 1;
            return (p.xp - cur.min) / (nxt.min - cur.min);
        },

        badges: function () {
            return load().earnedBadges;
        },

        /* Record a question answer. opts: {topic, pattern, correct, skipped, timeMs, isMock} */
        recordAnswer: function (opts) {
            var p = load();
            p.totalAnswered += 1;
            if (opts.skipped) p.totalSkipped += 1;
            else if (opts.correct) p.totalCorrect += 1;
            else p.totalWrong += 1;
            p.totalTimeMs += (opts.timeMs || 0);
            p.xp += opts.correct ? 10 : 0;

            var ts = p.topicStats[opts.topic] || { attempts: 0, correct: 0, timeMs: 0, firstSeen: MMUtil.todayKey() };
            ts.attempts += 1;
            if (opts.correct) ts.correct += 1;
            ts.timeMs += (opts.timeMs || 0);
            p.topicStats[opts.topic] = ts;

            pushHistory(p, 1, opts.correct ? 1 : 0);
            updateStreak(p);
            var newly = checkBadges(p);
            MMStore.set(KEY, p);
            return { newly: newly, streak: p.streakCurrent };
        },

        recordCardReviewed: function () {
            var p = load();
            p.cardsReviewed += 1;
            var newly = checkBadges(p);
            MMStore.set(KEY, p);
            return newly;
        },

        recordSpeedModule: function (accuracy) {
            var p = load();
            p.speedModulesDone += 1;
            if (accuracy >= 0.8) {
                p.xp += 15;
                p.speedDemon = true;
            }
            updateStreak(p);
            var newly = checkBadges(p);
            MMStore.set(KEY, p);
            return newly;
        },

        recordMock: function (pct) {
            var p = load();
            p.mocksTaken += 1;
            p.xp += 40;
            if (pct >= 0.7) {
                p.xp += 20;
                p.mockMaster = true;
            }
            if (pct > p.mocksBest) p.mocksBest = pct;
            updateStreak(p);
            var newly = checkBadges(p);
            MMStore.set(KEY, p);
            return newly;
        },

        recordFocusSession: function (minutes) {
            var p = load();
            p.focusSessions += 1;
            p.xp += 25;
            var today = MMUtil.todayKey();
            if (p.focusMinutesTodayKey !== today) {
                p.focusMinutesToday = 0;
                p.focusMinutesTodayKey = today;
            }
            p.focusMinutesToday += minutes;
            updateStreak(p);
            var newly = checkBadges(p);
            MMStore.set(KEY, p);
            return newly;
        },

        /* Flag a session-level achievement (e.g. sharp shooter). */
        flag: function (name) {
            var p = load();
            p[name] = true;
            var newly = checkBadges(p);
            MMStore.set(KEY, p);
            return newly;
        },

        accuracy: function () {
            var p = load();
            if (!p.totalAnswered) return 0;
            return p.totalCorrect / p.totalAnswered;
        },

        avgTimeSec: function () {
            var p = load();
            var answered = p.totalAnswered - p.totalSkipped;
            if (!answered) return 0;
            return Math.round(p.totalTimeMs / 1000 / answered);
        },

        topicStats: function () {
            return load().topicStats;
        },

        history: function () {
            return load().history;
        },

        all: function () {
            return load();
        },

        reset: function () {
            MMStore.remove(KEY);
        }
    };
})();

/* ============================================================
   4. MMSRS — Leitner-box spaced repetition
   ------------------------------------------------------------
   260 cards. Each card lives in a box 1..6:
     box 1 → due every day
     box 2 → every 2 days
     box 3 → every 4 days
     box 4 → every 7 days
     box 5 → every 14 days
     box 6 → every 30 days
   'Knew it'  → box + 1 (max 6)
   'Don't know' → back to box 1, due again today.
   Cards start in box 1, all due from day 0 (a fresh install
   gets a full review on first visit — by design, the first
   session should burn through at least one full pass).
   ============================================================ */
window.MMSRS = (function () {
    var KEY = 'srs';
    var INTERVALS = [0, 1, 2, 4, 7, 14, 30]; // index = box-1 → days
    var TODAY = MMUtil.todayKey();
    var epoch = Date.parse('2026-01-01T00:00:00Z') / 86400000;

    function dayNum(key) {
        return Math.round(Date.parse(key + 'T00:00:00Z') / 86400000 - epoch);
    }

    function addDays(key, days) {
        var d = new Date(key + 'T00:00:00Z');
        d.setUTCDate(d.getUTCDate() + days);
        var mm = d.getUTCMonth() + 1;
        var dd = d.getUTCDate();
        return d.getUTCFullYear() + '-' + (mm < 10 ? '0' + mm : mm) + '-' + (dd < 10 ? '0' + dd : dd);
    }

    function load() {
        var s = MMStore.get(KEY, null);
        if (s && s.version === 2) return s;
        var state = { version: 2, cards: {} };
        var cards = window.FLASHCARDS || [];
        for (var i = 0; i < cards.length; i++) {
            state.cards['c' + i] = { box: 1, due: TODAY };
        }
        MMStore.set(KEY, state);
        return state;
    }

    return {
        BOX_INTERVALS: INTERVALS,

        /* All card states. */
        all: function () {
            return load().cards;
        },

        /* Count per box. */
        boxCounts: function () {
            var s = load();
            var counts = [0, 0, 0, 0, 0, 0];
            for (var id in s.cards) {
                counts[s.cards[id].box - 1] += 1;
            }
            return counts;
        },

        /* Cards due today (box ≤ dueDay). */
        dueCards: function () {
            var s = load();
            var out = [];
            for (var id in s.cards) {
                if (s.cards[id].due <= TODAY) out.push({ id: id, idx: parseInt(id.slice(1), 10) });
            }
            return out;
        },

        dueCount: function () {
            return this.dueCards().length;
        },

        /* Grade a reviewed card. knew=true → promote. */
        grade: function (id, knew) {
            var s = load();
            var c = s.cards[id];
            if (!c) return;
            if (knew) {
                if (c.box < 6) c.box += 1;
                c.due = addDays(TODAY, INTERVALS[c.box - 1]);
            } else {
                c.box = 1;
                c.due = TODAY; // due again immediately
            }
            MMStore.set(KEY, s);
            var newly = MMProgress.recordCardReviewed();
            return newly;
        },

        reset: function () {
            MMStore.remove(KEY);
        }
    };
})();

/* ============================================================
   5. MMSpeed — speed drill session state
   ------------------------------------------------------------
   Each drill: 15 questions from a module, timed.
   Per-question results are logged (module, correct?, seconds)
   so the trainer can show per-module lifetime stats.
   ============================================================ */
window.MMSpeed = (function () {
    var KEY = 'speed-stats';
    var SESSION_LEN = 15;

    function load() {
        return MMStore.get(KEY, { modules: {}, sessions: 0 });
    }

    return {
        SESSION_LEN: SESSION_LEN,

        stats: function () {
            return load();
        },

        moduleStat: function (moduleId) {
            var s = load();
            return s.modules[moduleId] || { total: 0, correct: 0, totalTimeMs: 0 };
        },

        /* Record one question inside a drill. */
        recordQuestion: function (moduleId, correct, timeMs) {
            var s = load();
            var m = s.modules[moduleId] || { total: 0, correct: 0, totalTimeMs: 0 };
            m.total += 1;
            if (correct) m.correct += 1;
            m.totalTimeMs += timeMs;
            s.modules[moduleId] = m;
            MMStore.set(KEY, s);
        },

        /* Record a finished session (counts distinct sessions). */
        finishSession: function (moduleId, accuracy) {
            var s = load();
            s.sessions += 1;
            MMStore.set(KEY, s);
            return MMProgress.recordSpeedModule(accuracy);
        },

        bestTimePerModule: function () {
            // average per-question time in ms for each module
            var s = load();
            var out = {};
            for (var id in s.modules) {
                var m = s.modules[id];
                out[id] = m.total ? Math.round(m.totalTimeMs / m.total) : null;
            }
            return out;
        },

        accuracyPerModule: function () {
            var s = load();
            var out = {};
            for (var id in s.modules) {
                var m = s.modules[id];
                out[id] = m.total ? m.correct / m.total : null;
            }
            return out;
        }
    };
})();

/* ============================================================
   6. MMTimer — pomodoro / exam timers
   ------------------------------------------------------------
   Modes: Focus 25, Break 5, Break 15, Mock 18, Exam 30.
   Completed Focus sessions are logged with timestamps and
   count toward XP (25 min deep work) + the daily streak.
   ============================================================ */
window.MMTimer = (function () {
    var LOG_KEY = 'timer-log';

    var state = {
        modeMinutes: 25,
        remaining: 25 * 60,
        total: 25 * 60,
        running: false,
        tickHandle: null,
        startedAt: null
    };

    function logToday() {
        var log = MMStore.get(LOG_KEY, []);
        var today = MMUtil.todayKey();
        return log.filter(function (l) { return l.date === today; });
    }

    return {
        state: state,

        loadLog: function () {
            return MMStore.get(LOG_KEY, []);
        },

        logToday: logToday,

        todayMinutes: function () {
            var m = 0;
            logToday().forEach(function (l) { m += l.minutes; });
            return m;
        },

        logSession: function (minutes, label) {
            var log = this.loadLog();
            log.unshift({ date: MMUtil.todayKey(), minutes: minutes, label: label, at: new Date().toISOString() });
            if (log.length > 200) log = log.slice(0, 200);
            MMStore.set(LOG_KEY, log);
            return log;
        },

        /* Set mode; resets the countdown. */
        setMode: function (minutes) {
            this.stop();
            state.modeMinutes = minutes;
            state.total = minutes * 60;
            state.remaining = minutes * 60;
            state.running = false;
            return state;
        },

        start: function () {
            if (state.running || state.remaining <= 0) return;
            state.running = true;
            state.startedAt = Date.now();
            var self = this;
            state.tickHandle = setInterval(function () {
                state.remaining -= 1;
                if (window.MMTimerTick) window.MMTimerTick(state);
                if (state.remaining <= 0) {
                    self.stop();
                    self.complete();
                }
            }, 1000);
        },

        stop: function () {
            state.running = false;
            if (state.tickHandle) {
                clearInterval(state.tickHandle);
                state.tickHandle = null;
            }
        },

        reset: function () {
            this.stop();
            state.remaining = state.total;
            if (window.MMTimerTick) window.MMTimerTick(state);
        },

        /* Called automatically when the countdown reaches zero. */
        complete: function () {
            var label = state.modeMinutes + ' min session';
            this.logSession(state.modeMinutes, label);
            if (state.modeMinutes === 25) {
                var newly = MMProgress.recordFocusSession(25);
                newly.forEach(function (b) {
                    MMUtil.toast('🏅 Badge earned: ' + b.name, 'gold');
                });
            }
            if (window.MMToastSession) window.MMToastSession(state.modeMinutes);
            if (window.MMTimerTick) window.MMTimerTick(state);
        }
    };
})();

/* ============================================================
   7. MMErrors — error log
   ------------------------------------------------------------
   Types: concept | calculation | trap | reading | time
   Entries can reference a trap from TRAP_DATABASE so the
   Revision Center can jump straight to the prevention card.
   ============================================================ */
window.MMErrors = (function () {
    var KEY = 'errors';

    function load() {
        return MMStore.get(KEY, []);
    }

    return {
        all: load,

        count: function () {
            return load().length;
        },

        byType: function () {
            var list = load();
            var out = { concept: 0, calculation: 0, trap: 0, reading: 0, time: 0 };
            list.forEach(function (e) {
                if (out[e.type] !== undefined) out[e.type] += 1;
            });
            return out;
        },

        add: function (entry) {
            var list = load();
            entry.id = 'err-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
            entry.date = MMUtil.todayKey();
            list.unshift(entry);
            if (list.length > 500) list = list.slice(0, 500);
            MMStore.set(KEY, list);
            return entry;
        },

        remove: function (id) {
            var list = load().filter(function (e) { return e.id !== id; });
            MMStore.set(KEY, list);
            return list;
        },

        reset: function () {
            MMStore.remove(KEY);
        }
    };
})();

/* ============================================================
   8. MMPlan — 90-day plan tracker
   ------------------------------------------------------------
   State: { currentDay, tasks: { 'd5': {t0: true, ...} } }
   Tasks come from window.buildDailyPlan() (plans.js).
   The dashboard's "Today" card shows the currentDay tasks.
   ============================================================ */
window.MMPlan = (function () {
    var KEY = 'plan-state';

    function load() {
        var s = MMStore.get(KEY, null);
        if (!s) s = { currentDay: 1, tasks: {} };
        return s;
    }

    function plan() {
        return window.buildDailyPlan ? window.buildDailyPlan() : [];
    }

    return {
        state: load,

        /* Days for the given day number. */
        day: function (n) {
            var days = plan();
            for (var i = 0; i < days.length; i++) {
                if (days[i].day === n) return days[i];
            }
            return days[0] || null;
        },

        setCurrentDay: function (n) {
            var s = load();
            s.currentDay = Math.max(1, Math.min(90, n));
            MMStore.set(KEY, s);
            return s;
        },

        toggleTask: function (day, taskIdx) {
            var s = load();
            var key = 'd' + day;
            if (!s.tasks[key]) s.tasks[key] = {};
            s.tasks[key][taskIdx] = !s.tasks[key][taskIdx];
            MMStore.set(KEY, s);
            return s;
        },

        isDone: function (day, taskIdx) {
            var s = load();
            return !!(s.tasks['d' + day] && s.tasks['d' + day][taskIdx]);
        },

        doneCount: function (day) {
            var s = load();
            var key = 'd' + day;
            if (!s.tasks[key]) return 0;
            var n = 0;
            for (var k in s.tasks[key]) if (s.tasks[key][k]) n += 1;
            return n;
        },

        /* Tab switching helper used by main.js. */
        showTab: function (tab) {
            var ov = document.getElementById('plan-overview');
            var dd = document.getElementById('plan-daily');
            var ex = document.getElementById('plan-exam');
            var tabs = document.querySelectorAll('.plan-tab');
            if (ov) ov.style.display = tab === 'overview' ? '' : 'none';
            if (dd) dd.style.display = tab === 'daily' ? '' : 'none';
            if (ex) ex.style.display = tab === 'exam' ? '' : 'none';
            var idx = tab === 'overview' ? 0 : tab === 'daily' ? 1 : 2;
            tabs.forEach(function (t, i) {
                t.classList.toggle('active', i === idx);
            });
        },

        reset: function () {
            MMStore.remove(KEY);
        }
    };
})();

/* ============================================================
   9. MMCalc — Calculator Lab tools
   ------------------------------------------------------------
   Eight tools that apply the exact formulas from the bank.
   Each returns an HTML string for its result pane (safe:
   all interpolated values are numbers computed in JS).
   ============================================================ */
window.MMCalc = (function () {
    function gcd(a, b) { return b ? gcd(b, a % b) : a; }
    function lcm(a, b) { return (a * b) / gcd(a, b); }

    function factoriseN(n) {
        var factors = {};
        var x = n;
        for (var d = 2; d * d <= x; d++) {
            while (x % d === 0) {
                factors[d] = (factors[d] || 0) + 1;
                x = x / d;
            }
        }
        if (x > 1) factors[x] = (factors[x] || 0) + 1;
        return factors;
    }

    function factorString(n) {
        if (n === 1) return '1';
        var f = factoriseN(n);
        var parts = [];
        for (var p in f) {
            parts.push(f[p] === 1 ? String(p) : p + '^' + f[p]);
        }
        return parts.join(' × ');
    }

    function divLines(n) {
        var lines = [];
        var s = String(Math.abs(n));
        var sum = 0;
        for (var i = 0; i < s.length; i++) sum += parseInt(s[i], 10);
        var alt = 0;
        for (var j = 0; j < s.length; j++) {
            alt += (j % 2 === 0 ? parseInt(s[j], 10) : -parseInt(s[j], 10));
        }
        function div(d) { return n % d === 0; }
        lines.push('<div class="cr-line">2 → <span class="' + (div(2) ? 'cr-ok">YES' : 'cr-no">NO') + '</span> (last digit ' + s.slice(-1) + ')</div>');
        lines.push('<div class="cr-line">3 → <span class="' + (div(3) ? 'cr-ok">YES' : 'cr-no">NO') + '</span> (digit sum ' + sum + ')</div>');
        lines.push('<div class="cr-line">4 → <span class="' + (div(4) ? 'cr-ok">YES' : 'cr-no">NO') + '</span> (last two ' + (s.length >= 2 ? s.slice(-2) : s) + ')</div>');
        lines.push('<div class="cr-line">5 → <span class="' + (div(5) ? 'cr-ok">YES' : 'cr-no">NO') + '</span></div>');
        lines.push('<div class="cr-line">6 → <span class="' + (div(6) ? 'cr-ok">YES' : 'cr-no">NO') + '</span> (2 &amp; 3)</div>');
        lines.push('<div class="cr-line">7 → <span class="' + (div(7) ? 'cr-ok">YES' : 'cr-no">NO') + '</span> (long division)</div>');
        lines.push('<div class="cr-line">8 → <span class="' + (div(8) ? 'cr-ok">YES' : 'cr-no">NO') + '</span> (last three ' + s.slice(-3) + ')</div>');
        lines.push('<div class="cr-line">9 → <span class="' + (sum % 9 === 0 ? 'cr-ok">YES' : 'cr-no">NO') + '</span> (digit sum ' + sum + ')</div>');
        lines.push('<div class="cr-line">10 → <span class="' + (div(10) ? 'cr-ok">YES' : 'cr-no">NO') + '</span></div>');
        lines.push('<div class="cr-line">11 → <span class="' + (alt % 11 === 0 ? 'cr-ok">YES' : 'cr-no">NO') + '</span> (alternate diff ' + Math.abs(alt) + ')</div>');
        return lines.join('');
    }

    return {
        hcfLcm: function () {
            var out = document.getElementById('calc-hcf-result');
            var input = document.getElementById('calc-hcf-input').value;
            var nums = input.split(/[,\s]+/).map(Number).filter(function (x) { return x > 0 && isFinite(x); });
            if (nums.length < 2) {
                out.innerHTML = '<span class="cr-no">Enter at least 2 positive numbers.</span>';
                return;
            }
            var g = nums.reduce(gcd);
            var l = nums.reduce(lcm);
            var fHtml = nums.map(function (n) { return n + ' = ' + factorString(n); }).join('<br>');
            out.innerHTML =
                '<div class="cr-line">' + nums.join(' , ') + '</div>' +
                '<div class="cr-line">HCF = <span class="cr-hi">' + g + '</span></div>' +
                '<div class="cr-line">LCM = <span class="cr-hi">' + l + '</span></div>' +
                '<div class="cr-line" style="font-size:0.75rem;color:var(--text-muted)">' + fHtml + '</div>';
        },

        factorise: function () {
            var out = document.getElementById('calc-prime-result');
            var n = parseInt(document.getElementById('calc-prime-input').value, 10);
            if (!n || n < 2) {
                out.innerHTML = '<span class="cr-no">Enter an integer ≥ 2.</span>';
                return;
            }
            if (n > 1e9) {
                out.innerHTML = '<span class="cr-no">Keep it under 1,000,000,000.</span>';
                return;
            }
            var f = factoriseN(n);
            var count = 0, sum = 0;
            for (var p in f) {
                count += 1;
            }
            var totalFactors = 1;
            var factorSum = 1;
            for (var q in f) {
                totalFactors *= (f[q] + 1);
                var geo = 1, base = parseInt(q, 10);
                for (var e = 0; e <= f[q]; e++) {
                    geo += base ** e;
                }
                factorSum *= geo;
            }
            var isPrime = totalFactors === 2;
            out.innerHTML =
                '<div class="cr-line">' + n + ' = <span class="cr-hi">' + factorString(n) + '</span></div>' +
                '<div class="cr-line">Number of factors: <span class="cr-hi">' + totalFactors + '</span></div>' +
                '<div class="cr-line">Sum of all factors: <span class="cr-hi">' + factorSum + '</span></div>' +
                '<div class="cr-line">' + (isPrime ? '<span class="cr-ok">PRIME</span>' : 'Composite') + '</div>';
        },

        zeros: function () {
            var out = document.getElementById('calc-zeros-result');
            var n = parseInt(document.getElementById('calc-zeros-input').value, 10);
            if (!n || n < 1) {
                out.innerHTML = '<span class="cr-no">Enter n ≥ 1.</span>';
                return;
            }
            if (n > 1e7) {
                out.innerHTML = '<span class="cr-no">Keep n under 10,000,000.</span>';
                return;
            }
            var steps = [];
            var total = 0;
            var div = 5;
            while (div <= n) {
                var q = Math.floor(n / div);
                total += q;
                steps.push('⌊' + n + '/' + div + '⌋ = ' + q);
                div *= 5;
            }
            out.innerHTML =
                '<div class="cr-line">n! = ' + n + '!</div>' +
                '<div class="cr-line" style="font-size:0.78rem">' + steps.join(' + ') + '</div>' +
                '<div class="cr-line">Trailing zeros = <span class="cr-hi">' + total + '</span></div>';
        },

        factors: function () {
            var out = document.getElementById('calc-factors-result');
            var n = parseInt(document.getElementById('calc-factors-input').value, 10);
            if (!n || n < 1) {
                out.innerHTML = '<span class="cr-no">Enter n ≥ 1.</span>';
                return;
            }
            if (n > 1e8) {
                out.innerHTML = '<span class="cr-no">Keep n under 100,000,000.</span>';
                return;
            }
            var f = factoriseN(n);
            var total = 1;
            var evenTotal = 0;
            for (var p in f) total *= (f[p] + 1);
            // even factors: if n has 2^k (k≥1), even factor count = total × (k/(k+1))
            var twoExp = f[2] || 0;
            var evenCount = twoExp ? Math.round(total * twoExp / (twoExp + 1)) : 0;
            // sum of all factors
            var factorSum = 1;
            for (var q in f) {
                var geo = 1, base = parseInt(q, 10);
                for (var e = 0; e <= f[q]; e++) geo += base ** e;
                factorSum *= geo;
            }
            out.innerHTML =
                '<div class="cr-line">' + n + ' = <span class="cr-hi">' + factorString(n) + '</span></div>' +
                '<div class="cr-line">Total factors: <span class="cr-hi">' + total + '</span></div>' +
                '<div class="cr-line">Even factors: <span class="cr-hi">' + evenCount + '</span></div>' +
                '<div class="cr-line">Sum of factors: <span class="cr-hi">' + factorSum + '</span></div>' +
                '<div class="cr-line" style="font-size:0.75rem;color:var(--text-muted)">Trap check: if asked EVEN sum, it must be &lt; total sum.</div>';
        },

        divisibility: function () {
            var out = document.getElementById('calc-div-result');
            var n = parseInt(document.getElementById('calc-div-input').value, 10);
            if (!isFinite(n) || n === 0) {
                out.innerHTML = '<span class="cr-no">Enter a non-zero integer.</span>';
                return;
            }
            out.innerHTML = divLines(n);
        },

        areaChange: function () {
            var out = document.getElementById('calc-area-result');
            var a = parseFloat(document.getElementById('calc-area-a').value);
            var b = parseFloat(document.getElementById('calc-area-b').value);
            if (isNaN(a) || isNaN(b)) {
                out.innerHTML = '<span class="cr-no">Enter both % changes.</span>';
                return;
            }
            var pct = a + b + (a * b) / 100;
            out.innerHTML =
                '<div class="cr-line">ΔArea = x + y + (x·y)/100</div>' +
                '<div class="cr-line">= ' + a + ' + (' + b + ') + (' + a + '×' + b + ')/100</div>' +
                '<div class="cr-line">= <span class="cr-hi">' + (pct > 0 ? '+' : '') + pct + '%</span></div>' +
                '<div class="cr-line">' + (pct > 0 ? '<span class="cr-ok">Area increases</span>' : pct < 0 ? '<span class="cr-no">Area decreases</span>' : 'No change') + '</div>';
        },

        interest: function () {
            var out = document.getElementById('calc-int-result');
            var P = parseFloat(document.getElementById('calc-int-p').value);
            var R = parseFloat(document.getElementById('calc-int-r').value);
            var T = parseFloat(document.getElementById('calc-int-t').value);
            if (isNaN(P) || isNaN(R) || isNaN(T) || P <= 0 || T <= 0) {
                out.innerHTML = '<span class="cr-no">Enter P &gt; 0, R, T &gt; 0.</span>';
                return;
            }
            var SI = (P * R * T) / 100;
            var amt = P * Math.pow(1 + R / 100, T);
            var CI = amt - P;
            var diff = CI - SI;
            out.innerHTML =
                '<div class="cr-line">SI = <span class="cr-hi">' + SI.toLocaleString('en-IN', { maximumFractionDigits: 2 }) + '</span></div>' +
                '<div class="cr-line">CI = <span class="cr-hi">' + CI.toLocaleString('en-IN', { maximumFractionDigits: 2 }) + '</span></div>' +
                '<div class="cr-line">CI − SI = <span class="cr-hi">' + diff.toLocaleString('en-IN', { maximumFractionDigits: 2 }) + '</span></div>' +
                '<div class="cr-line" style="font-size:0.75rem;color:var(--text-muted)">2-year shortcut: CI−SI ≈ P·R²/100</div>';
        },

        unitDigit: function () {
            var out = document.getElementById('calc-ud-result');
            var base = parseInt(document.getElementById('calc-ud-base').value, 10);
            var exp = parseInt(document.getElementById('calc-ud-exp').value, 10);
            if (!isFinite(base) || !isFinite(exp) || exp < 0) {
                out.innerHTML = '<span class="cr-no">Enter base and exponent ≥ 0.</span>';
                return;
            }
            var last = ((base % 10) + 10) % 10;
            var ud = 1;
            for (var i = 0; i < Math.min(exp, 200); i++) {
                ud = (ud * last) % 10;
            }
            // cycle patterns
            var cycles = { 0: [0], 1: [1], 2: [2, 4, 8, 6], 3: [3, 9, 7, 1], 4: [4, 6], 5: [5], 6: [6], 7: [7, 9, 3, 1], 8: [8, 4, 2, 6], 9: [9, 1] };
            var cyc = cycles[last];
            var pos = (exp === 0 ? 0 : ((exp - 1) % cyc.length));
            var udCycle = cyc[pos];
            out.innerHTML =
                '<div class="cr-line">' + base + '^' + exp + '</div>' +
                '<div class="cr-line">Unit digit cycle of ' + last + ': [' + cyc.join(', ') + ']</div>' +
                '<div class="cr-line">Position (' + exp + ' mod ' + cyc.length + ') = ' + pos + '</div>' +
                '<div class="cr-line">Unit digit = <span class="cr-hi">' + udCycle + '</span></div>';
        }
    };
})();

/* ============================================================
   10. MMNotes — notes reader
   ============================================================ */
window.MMNotes = (function () {
    function open(topicId) {
        var notes = window.CONCEPT_NOTES || {};
        var note = notes[topicId];
        var reader = document.getElementById('notes-reader');
        var cards = document.getElementById('learn-cards');
        var body = document.getElementById('notes-reader-body');
        if (!note || !reader || !body) return;

        reader.style.display = '';
        if (cards) cards.style.display = 'none';

        var html = '';
        html += '<h3>' + MMUtil.esc(note.name) + '</h3>';
        html += '<div class="notes-meta">⏱ ' + (note.minutes || 10) + ' min read · ' + note.sections.length + ' sections · distilled from 31 PYQ PDFs + classnotes theory</div>';
        note.sections.forEach(function (sec) {
            html += '<div class="note-section"><h4>' + MMUtil.esc(sec.heading) + '</h4>';
            sec.body.forEach(function (para) {
                html += '<p>' + MMUtil.esc(para) + '</p>';
            });
            html += '</div>';
        });
        html += '<div style="margin-top:1.5rem;display:flex;gap:0.75rem;flex-wrap:wrap">';
        html += '<button class="btn btn-primary btn-sm" onclick="MMNotes.close();MM.showSection(\'formulas\')">📖 Formula Bank for this topic →</button>';
        html += '<button class="btn btn-ghost btn-sm" onclick="MMNotes.close();MM.showSection(\'quiz\');MMQuiz.startTopicQuizPrompt(\'' + MMUtil.esc(topicId) + '\')">🎯 Quiz this topic →</button>';
        html += '</div>';
        body.innerHTML = html;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function close() {
        var reader = document.getElementById('notes-reader');
        var cards = document.getElementById('learn-cards');
        if (reader) reader.style.display = 'none';
        if (cards) cards.style.display = '';
    }

    return { open: open, close: close };
})();

/* ============================================================
   11. Global: settings / reset
   ============================================================ */
window.MMReset = function () {
    if (!confirm('Reset ALL MathMastery v2 progress (XP, SRS boxes, plan, errors, stats)? This cannot be undone.')) return;
    MMStore.clearAll();
    location.reload();
};

/* Boot: run on DOM ready so every engine is available before
   main.js initialises the UI (script order: data → engines →
   quiz-engine → main). */
window.addEventListener('DOMContentLoaded', function () {
    // No-op hook: engines are stateless until called.
    if (window.console) {
        var bank = window.PYQ_BANK ? window.PYQ_BANK.length : 0;
        console.log('%c[MM v2] engines loaded — PYQ bank: ' + bank + ' | formulas: ' + (window.FORMULA_BANK_COUNT || '?') + ' | flashcards: ' + (window.FLASHCARD_COUNT || '?') + ' | patterns: ' + (window.PATTERN_COUNT || '?') + ' | traps: ' + (window.TRAP_COUNT || '?'), 'color:#d4a853;font-weight:bold');
    }
});
