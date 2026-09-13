/* ============================================================
   90-DAY MASTER PLAN + 180-DAY MACRO PLAN - Deep Research
   Plan is phase-structured with DAILY tasks generated from
   the 10,518-PYQ topic weightage research:
   Trigonometry 152 (highest), Arithmetic 96, Algebra 62,
   Geometry 26, Number System 24, Mensuration 2 (2023 set),
   plus the full 2024-25 PYQ distribution across 11 topics.
   ============================================================ */
window.NINETY_DAY_PLAN = {
    name: '90-Day Mathematics Master Plan',
    dailyMinutes: 180,
    phases: [
        {
            number: 1,
            name: 'Foundation + Calculation',
            days: 'Days 1-15',
            startDay: 1,
            endDay: 15,
            color: '#2c3e50',
            focus: 'Tables to 20, squares to 30, cubes to 15, VBODMAS, fraction↔% table, divisibility rules 2-11, HCF/LCM basics, BODMAS simplification.',
            topicWeight: { 'number-system': 0.35, 'simplification': 0.35, 'ratio-proportion': 0.30 },
            speedTarget: '20 speed questions in 5 min, 85% accuracy',
            dailyTasks: [
                'Speed: 20 tables/squares questions (timed)',
                'Study: 1 concept note section (25-40 min read)',
                'Formulas: 10 flashcards (SRS review)',
                'PYQs: 10 solved questions from today\'s topic',
                'Simplify: 10 BODMAS/surd questions',
                'Error log: write every mistake with the rule violated'
            ]
        },
        {
            number: 2,
            name: 'Core Concepts + Basic PYQs',
            days: 'Days 16-30',
            startDay: 16,
            endDay: 30,
            color: '#27ae60',
            focus: 'All arithmetic topics (ratio, mixture, partnership, ages, averages), algebraic identities, triangle properties, circle theorems, trig standard values.',
            topicWeight: { 'algebra': 0.30, 'geometry': 0.25, 'trigonometry': 0.25, 'ratio-proportion': 0.20 },
            speedTarget: '20 questions in 8 min, 85% accuracy',
            dailyTasks: [
                'Study: 1 full concept note section',
                'PYQs: 15 questions, 5 of them TIMED (90s each)',
                'Formulas: 15 flashcards + 5 self-quizzed',
                'Patterns: read 1 pattern card, note its recognition signal',
                'SRS: review all due flashcards',
                'Error log review: re-solve 3 old errors'
            ]
        },
        {
            number: 3,
            name: 'Pattern Recognition',
            days: 'Days 31-45',
            startDay: 31,
            endDay: 45,
            color: '#9b59b6',
            focus: 'The 32-pattern engine: cubic identity, x+1/x chains, trailing zeros, divisibility composites, alligation, trig special results, two-circles, area-change %.',
            topicWeight: { 'algebra': 0.30, 'number-system': 0.25, 'trigonometry': 0.25, 'mixture-alligation': 0.20 },
            speedTarget: '20 questions in 10 min, 90% accuracy',
            dailyTasks: [
                'Patterns: master 1 pattern (read + 5 practice questions)',
                'Traps: study 1 trap card, note its quick-check',
                'PYQs: 15 questions tagged with today\'s pattern',
                'Mastery test: each pattern\'s 3 mastery questions',
                'SRS: all due cards',
                'Timed set: 10 questions, 40s each'
            ]
        },
        {
            number: 4,
            name: 'Speed + Accuracy',
            days: 'Days 46-60',
            startDay: 46,
            endDay: 60,
            color: '#f39c11',
            focus: 'Option-based solving, elimination via ranges, unit-digit shortcuts, % change formulas, mensuration solid table, heights & distances cases.',
            topicWeight: { 'mensuration': 0.30, 'heights-distances': 0.20, 'trigonometry': 0.25, 'algebra': 0.25 },
            speedTarget: '20 questions in 12 min, 90% accuracy',
            dailyTasks: [
                'Speed drill: 1 full module (timed, logged)',
                'PYQs: 20 questions, average 60s target',
                'Trick of the day: apply SPEED_TRICKS card 3×',
                'Range-elimination practice: 10 trig options-elimination',
                'SRS: all due cards',
                'Weak topic: 10 extra questions in your lowest-accuracy topic'
            ]
        },
        {
            number: 5,
            name: 'Trap Resistance + Mixed PYQs',
            days: 'Days 61-75',
            startDay: 61,
            endDay: 75,
            color: '#e74c3c',
            focus: 'The 26-trap database. Multi-concept questions. Wording traps (even vs total factors, positive k, same direction trains). Mixed-topic sets.',
            topicWeight: { 'geometry': 0.25, 'algebra': 0.25, 'number-system': 0.20, 'mensuration': 0.15, 'trigonometry': 0.15 },
            speedTarget: '20 questions in 15 min, 85% accuracy',
            dailyTasks: [
                'Traps: master 1 trap (example + prevention + quick check)',
                'MIXED set: 15 questions across 4+ topics',
                'Trap hunt: for each solved question name the trap that could have been set',
                'Error log: full review, re-solve all from last 7 days',
                'SRS: all due cards',
                'Timed mini-mock: 10 questions, 6 min'
            ]
        },
        {
            number: 6,
            name: 'Advanced Adaptability + Mocks',
            days: 'Days 76-90',
            startDay: 76,
            endDay: 90,
            color: '#8e44ad',
            focus: 'Full mock tests (30 Q, 18 min, −0.25 marking), unfamiliar wording, exam simulation, final weak-topic sweep, exam-day strategy.',
            topicWeight: { 'algebra': 0.20, 'trigonometry': 0.20, 'geometry': 0.20, 'number-system': 0.15, 'mensuration': 0.15, 'mixed': 0.10 },
            speedTarget: 'Full mock: 30 questions in 18 min, 80%+ net score',
            dailyTasks: [
                'MOCK every alternate day (full conditions, timer, negative marking)',
                'Mock analysis: every wrong question → trap/pattern/factor',
                'Unfamiliar wording: 10 re-worded PYQs',
                'SRS: all due cards + 20 new',
                'Formula scan: 1 topic table per day',
                'Rest: 1 full rest day per week (Day 84 style) — sleep 7h+'
            ]
        }
    ],
    examDayStrategy: [
        'Night before: NO new topics. Scan formula bank once, sleep 7+ hours.',
        'First 5 minutes: scan the whole paper. Mark 3-question clusters you can do blind.',
        'Pass 1 (60% of time): only questions you can solve in <60s. Skip anything that stalls 45s.',
        'Pass 2 (25% of time): medium questions. Use range-elimination before solving.',
        'Pass 3 (15% of time): remaining + review flagged questions.',
        'Every 10 questions: 10-second sanity scan (units, even/odd, range).',
        'Last 2 minutes: verify negative-marking damage — skip uncertain 50-50s.',
        'Section-wise: never spend > 3 minutes on one question.',
        'Trig first (highest weightage in CGL Tier-I sets), then algebra, geometry, number system.'
    ]
};

window.MACRO_180_PLAN = {
    name: '180-Day Macro Roadmap',
    phases: [
        { name: 'Months 1-2: Foundation & Arithmetic Core', goal: 'All arithmetic topics at 80%+; speed table complete; 500 PYQs solved', milestones: ['Tables/squares/cubes automatic', 'Divisibility reflex', 'HCF/LCM identity set', 'Ratio/mixture/partnership core'] },
        { name: 'Months 3-4: Algebra + Trigonometry', goal: 'Identity sets + trig tables cold; 1000 more PYQs', milestones: ['Cubic identity reflex', 'x+1/x chain', 'Trig standard values <3s', 'Compound angles', 'Heights & distances 5 cases'] },
        { name: 'Months 5-6: Geometry + Mensuration + Mocks', goal: 'Circle theorems + solid tables; weekly full mocks', milestones: ['Two-circles protocol', 'Triangle centres', 'Mensuration solid table', 'Mock score 80%+ consistent'] }
    ]
};

/* Daily plan generator: maps each day 1-90 to concrete tasks */
window.buildDailyPlan = function() {
    var plan = [];
    var day = 1;
    window.NINETY_DAY_PLAN.phases.forEach(function(phase) {
        for (var d = phase.startDay; d <= phase.endDay; d++) {
            var topicNames = Object.keys(phase.topicWeight)
                .sort(function(a, b) { return phase.topicWeight[b] - phase.topicWeight[a]; })
                .slice(0, 2)
                .map(function(k) {
                    var t = (window.FORMULA_BANK || {})[k];
                    return t ? t.name : k;
                });
            plan.push({
                day: d,
                phase: phase.number,
                phaseName: phase.name,
                primaryTopics: topicNames,
                tasks: phase.dailyTasks.map(function(t) { return { text: t, done: false }; }),
                target: phase.speedTarget
            });
        }
    });
    return plan;
};
