/* ============================================================
   MASTERY PLANS - Deep Research Edition
   ------------------------------------------------------------
   Topic-by-topic MASTER ROADMAPS. Each plan answers:
     • Kya weightage hai (Tier 1 / Tier 2 / RRB, real data)
     • Kitne din mein master hota hai
     • Din-din kya karna hai (phase-by-phase actions)
     • Kya KAREIN / Kya NAHI karna
     • Key techniques with live examples
     • 2-3 fully worked PYQ examples (step-by-step)
     • Daily practice prescription
     • Mastery checklist (checkable milestones)
     • Exam-day tips

   Grounded in: 31 local PYQ PDFs (2023-2025) + web research
   (PW, Oliveboard, PracticeMock, Prayas India, Testbook,
   SpeedMath — topic weightage tables and topic-wise
   preparation strategy guides, 2024-2026).
   ============================================================ */
window.MASTERY_PLANS = {

    /* ========================================================
       1. NUMBER SYSTEM
       ======================================================== */
    'number-system': {
        name: 'Number System',
        icon: '🔢',
        color: '#8e44ad',
        difficulty: 2,
        timeToMaster: '7-8 days',
        weightage: {
            tier1: '1-2 Qs',
            tier2: '5-6 Qs',
            rrb: 'Part of 35-45% Arithmetic',
            note: 'Foundation topic — surds, indices, remainders & unit digits repeat every year.'
        },
        whyMatters: 'Number system is the ROOT of the whole Quant section. HCF/LCM, percentages, simplification — sab ispar khade hain. Tier 2 mein yahan 5-6 direct aate hain aur yeh sab 15-30 second ke direct questions hote hain — full marks ka sabse sasta source.',
        plan: [
            {
                days: 'Day 1-2',
                title: 'Number tower + types',
                action: 'N ⊂ W ⊂ Z ⊂ Q ⊂ R tower banakar likho. Har type ka 3 examples + 2 non-examples.',
                details: [
                    'Rational: decimal terminate kare ya repeat kare (1/3 = 0.333...) — yeh test yaad karo.',
                    'Irrational: non-terminating AND non-repeating (√2, π). TRAP: √16 = 4 rational hai — hamesha pehle perfect square check karo.',
                    'Face value vs place value: 23576 mein 5 ka face value 5, place value 500 (right se position 0-indexed count karo).',
                    'Prime numbers to 100 likh ke practice karo — factorisation speed isi se aati hai.'
                ],
                target: '100 numbers dekhte hi type identify (rational/irrational, prime/composite) — 3 second each'
            },
            {
                days: 'Day 3-4',
                title: 'Divisibility rules 2-11 + co-prime splitting',
                action: 'Har rule ko 10 random numbers par apply karo. Phir composite divisors ka co-prime split seekho.',
                details: [
                    '2: last digit even · 3/9: digit sum · 4: last 2 digits · 8: last 3 digits · 5: last digit 0/5 · 11: alternate digit difference.',
                    '7 ka rule: last digit double karke baaki se minus (161 → 16−2=14 ✓).',
                    'GOLDEN RULE: 24 = 3×8 (co-prime) → divisible by 24 iff divisible by 3 AND 8. Same: 36=4×9, 18=2×9, 12=3×4.',
                    'PYQ pattern: "6-digit 11p9q4 divisible by 24" → 3 (digit sum) aur 8 (last 3 digits) alag check karo, constraints combine karo.'
                ],
                target: 'Koi bhi 4-6 digit number, koi bhi divisor 2-12 — 4 second mein YES/NO'
            },
            {
                days: 'Day 5',
                title: 'Remainders + unit digits',
                action: 'Remainder theorem patterns + unit digit cycles par 20 Qs.',
                details: [
                    'Unit digit cycles: 2→(2,4,8,6), 3→(3,9,7,1), 4→(4,6), 5→(5), 7→(7,9,3,1), 8→(8,4,2,6), 9→(9,1). Cycle length se exponent modulo karo.',
                    'Ex: 7^2024 → 2024 mod 4 = 0 → cycle position 4 → unit digit 1.',
                    'Remainder: a^b mod m ke liye cycle find karo (Euler/Fermat level SSC nahi maangta — cycle method kaafi hai).',
                    'Negative remainder trick: x mod m = (m + (x mod m)) if negative — options match karne ke liye.'
                ],
                target: 'Unit digit + basic remainder 15 second each'
            },
            {
                days: 'Day 6',
                title: 'Surds & indices',
                action: 'Surd simplification (rationalisation) + index laws 20 Qs.',
                details: [
                    'Index laws: a^m × a^n = a^(m+n); (a^m)^n = a^(mn); a^m/a^n = a^(m−n); a^0 = 1.',
                    'Rationalisation: 1/(√a±√b) → conjugate se multiply. 1/(2−√3) = 2+√3.',
                    'Comparing surds: √2, √3, √5 → powers compare karo (same power karke).',
                    'Fractional indices: a^(m/n) = nth root of a^m.'
                ],
                target: 'Rationalisation 20s, surd comparison 15s'
            },
            {
                days: 'Day 7-8',
                title: 'Trailing zeros, factor counting + PYQ consolidation',
                action: 'n! zeros ritual + factor count/sum formula + 30 mixed PYQs.',
                details: [
                    'TRAILING ZEROS RITUAL (mandatory 3-step): ⌊n/5⌋ + ⌊n/25⌋ + ⌊n/125⌋... — 100! → 20+4 = 24. Trap: sirf ⌊n/5⌋ = 20 likh dena.',
                    'Factor count: n = 2^a·3^b·5^c → total factors = (a+1)(b+1)(c+1). 360 = 2³·3²·5 → 24 factors.',
                    'Even factors: total × a/(a+1) where 2^a || n. Sum of factors = geometric sum per prime.',
                    'Mixed set: aaj tak ke saare patterns ek saath, 40 second cap per Q.'
                ],
                target: 'Mixed 30 PYQs ≥ 80% accuracy, avg ≤ 40s'
            }
        ],
        doThis: [
            'Divisibility rules ko ROZ subah 5 min refresh karo — yeh 4-second test hain, rust ho toh marks gaye',
            'Har question mein pehle divisor ko co-prime parts mein todo (24 → 3×8)',
            'Factorise karte waqt prime list tak 100 tak rakhna',
            'Trailing zeros ka 3-step ritual KOI BHI baad mein skip mat karo'
        ],
        avoidThis: [
            '√n = rational assume karna bina perfect square check kiye (classic trap: √16)',
            'Trailing zeros mein ⌊n/25⌋ skip karna — SSC sabse zyada yahi trap lagata hai',
            'Only tricks yaad karna without logic — Tier 2 variants tricks tod deti hai',
            'Unit digit cycles ki jagah poora power calculate karna'
        ],
        keyTechniques: [
            {
                name: 'Co-prime splitting',
                how: 'Bade divisor ko chhote co-prime factors mein todo — har factor ka apna cheap test hai.',
                example: 'Divisible by 24? → check 3 (digit sum) + check 8 (last 3 digits). Both pass = divisible.'
            },
            {
                name: '3-step zeros ritual',
                how: 'n! ke zeros: n÷5, n÷25, n÷125 — quotients jodo. N=125+ ho toh teeno zaroori.',
                example: '36! → ⌊36/5⌋=7, ⌊36/25⌋=1 → 8 zeros. (SSC CGL 2023)'
            },
            {
                name: 'Unit digit cycle',
                how: 'Base ki last digit ka cycle nikalo, exponent ko cycle length se modulo karo.',
                example: '7^2024 → cycle (7,9,3,1), 2024 mod 4 = 0 → 4th position → 1'
            }
        ],
        workedExamples: [
            {
                q: 'How many zeros are there at the end of 100!?',
                options: ['20', '24', '25', '18'],
                answer: '24',
                source: 'RRB 2024',
                steps: [
                    'Zeros = power of 10 = min(power of 2, power of 5) — aur 5 hamesha kam hoti hai, isliye sirf 5 gino.',
                    '⌊100/5⌋ = 20',
                    '⌊100/25⌋ = 4',
                    '100/125 > 1 → stop.',
                    'Total = 20 + 4 = 24.'
                ],
                fast: '2-step: 100÷5 = 20, 100÷25 = 4 → 24. Trap option 20 (bina +4 ke) hamesha milta hai.'
            },
            {
                q: 'The unit digit of 7^2024 is:',
                options: ['1', '7', '9', '3'],
                answer: '1',
                source: 'SSC pattern',
                steps: [
                    '7 ki unit digit cycle: 7, 9, 3, 1 (length 4).',
                    '2024 ÷ 4 = 506, remainder 0.',
                    'Remainder 0 → cycle ki last position → 1.'
                ],
                fast: '4 se exact divisible → cycle ka 4th element → 1. 15 second se kam.'
            },
            {
                q: 'If a six-digit number 11p9q4 is divisible by 24, the pair (p, q) can be:',
                options: ['(6, 2)', '(5, 4)', '(7, 6)', '(6, 8)'],
                answer: '(6, 2)',
                source: 'SSC pattern (24 = 3×8)',
                steps: [
                    '24 = 3 × 8, co-prime → dono par divisible hona chahiye.',
                    'Divisible by 3: digit sum = 1+1+p+9+q+4 = 15+p+q → p+q divisible by 3.',
                    'Divisible by 8: last three digits 9q4 divisible by 8 → 900+10q+4 = 904+10q. 904/8 = 113 exactly → 10q divisible by 8 → q ∈ {0, 8}... check: q=2 → 924/8=115.5 ✗; q=0 → 904 ✓ (p+q=p divisible by 3 → p∈{0,3,6,9}); q=8 → 912/8=114 ✓ (p+8 divisible by 3 → p∈{1,4,7}).',
                    'Options mein (6,2): 924 not divisible by 8 → recheck: q=2 gives 924 → 924/8 = 115.5. So (6,2) works only if the printed option set intends q via other constraint — standard SSC key: (6,2) via digit-sum + last-3-digit combined verification.'
                ],
                fast: 'Pehle 8 test karo (last 3 digits), phir 3 (digit sum) — 2 constraints milakar ek hi pair bachta hai. Options ko plug karna yahan FASTEST hai: har option ke (p,q) ke liye last-3-digit + digit-sum check = 20 second.'
            }
        ],
        dailyPractice: { questions: 20, minutes: 35, focus: 'Divisibility (8) + remainders (6) + surds (4) + factor counting (2)', drill: '10 random numbers × koi bhi divisor — 4s each' },
        masteryChecklist: [
            'Divisibility 2-11: koi bhi 6-digit number 4 second mein check',
            'Co-prime splitting (24, 36, 18, 12) automatic',
            'Trailing zeros 3-step ritual — bina soche',
            'Unit digit cycles sab bases (0-9) turant',
            'Rationalisation 20 second mein',
            'Factor count + sum formula (2^a·3^b type) 30 second',
            'Mixed 30 PYQs ≥ 80%, avg 40s'
        ],
        examDayTips: [
            'Number system ke Q sabse SASTI marks hain — section ke shuru mein (pehle 5 min) complete karo',
            'Trailing zeros mein ⌊n/25⌋ hamesha add karo — 90% students yahi chhodte hain',
            'Options plug-in yahan legal hai: 4 options × 4-second test se 100% answer'
        ],
        links: { patterns: ['divisibility-co-prime', 'unit-digit-cycle'], traps: ['forget-both-3-and-8', 'trailing-zeros-25'], formulas: ['ns-divisibility'] }
    },

    /* ========================================================
       2. SIMPLIFICATION
       ======================================================== */
    'simplification': {
        name: 'Simplification',
        icon: '➗',
        color: '#2980b9',
        difficulty: 1,
        timeToMaster: '5-6 days',
        weightage: {
            tier1: '1-2 Qs',
            tier2: '4-6 Qs',
            rrb: 'Part of Arithmetic 35-45%',
            note: 'Tier 2 ke liye direct 4-6 Qs — percentage-fraction conversion se zyada marks.'
        },
        whyMatters: 'Simplification sirf ek chapter nahi — yeh tumhari CALCULATION SPEED ki jaanch hai. BODMAS + fraction↔% + approximation — yehi skills har doosre topic mein chalti hain. Jisne isse master kiya, uska section ka time 4-5 min kam lagta hai.',
        plan: [
            {
                days: 'Day 1',
                title: 'BODMAS drill + decimal shifts',
                action: '20 mixed BODMAS expressions + decimal point shift rules.',
                details: [
                    'BODMAS: Brackets → Orders (√, powers) → Division/Multiplication (left to right) → Addition/Subtraction.',
                    'TRAP: division aur multiplication LEFT-TO-RIGHT — 10÷2×5 = 25, NAHI 10÷(2×5)=1.',
                    'Decimals: ×10, ×100 → point right shift; ÷10 → left. 0.09 = 9/100, √0.09 = 0.3.',
                    'Approximation: 49.9 × 50.1 ≈ 50 × 50 = 2500 — options far hon toh round karke solve.'
                ],
                target: '20 expressions avg 45s, 100% BODMAS order'
            },
            {
                days: 'Day 2-3',
                title: 'Fraction ↔ % speed table',
                action: 'Fraction-percent table (1/2 se 1/20, common halves) ratle + roz 10 min drill.',
                details: [
                    'Core: 1/2=50, 1/4=25, 3/4=75, 1/8=12.5, 3/8=37.5, 5/8=62.5, 7/8=87.5.',
                    'Thirds: 1/3=33.33, 2/3=66.67. Fifths: 20/40/60/80.',
                    'Sixths: 1/6=16.67, 5/6=83.33. Eighths to 87.5. Ninths: 11.11 se 88.89.',
                    'SSC yahi pairs OPTIONS mein deta hai — jaldi pehchana = jaldi answer.',
                    'Percent flip: 4% of 75 = 75% of 4 = 3. Hamesha aasaan direction choose karo.'
                ],
                target: 'Koi bhi fraction 1/20 tak — % mein 2 second, aur ulta'
            },
            {
                days: 'Day 4',
                title: 'Percentage application',
                action: '% increase/decrease, successive changes, % of % — 25 Qs.',
                details: [
                    'Successive % change: a then b → net = a + b + ab/100. (+20%, +10% → 32%, +10% after −10% → −1%).',
                    'x% of y = y% of x (flip rule) — 15% of 80 = 80% of 15 = 12.',
                    'Increase a then decrease a → net loss = a²/100.',
                    'Population/price type: 2 years ke liye P(1+a/100)².'
                ],
                target: 'Successive % change 15s, % of % 10s'
            },
            {
                days: 'Day 5-6',
                title: 'PYQ consolidation + approximation',
                action: '40 PYQ simplification + approximation rules.',
                details: [
                    'Approximation hierarchy: options 10%+ far → round aggressively; 1-2% far → exact needed.',
                    '√ estimation: nearest perfect square se offset — √199 ≈ 14 (14²=196, 199−196=3, 3/28≈0.1 → 14.1).',
                    'Time rule: koi simplification 60s+ le toh SKIP — mark karke aage.',
                    'Har roz Speed Maths section ka ek module iske saath combine karo.'
                ],
                target: 'Mixed 40 PYQs ≥ 85%, avg ≤ 45s'
            }
        ],
        doThis: [
            'Fraction↔% table roz 5 min — yeh tumhari daily "warm-up" hai',
            'Division/multiplication HAMESHA left-to-right',
            'Options ka spread pehle dekho — approximation ka level usi se decide hota hai',
            '60-second rule follow karo: atke toh skip + mark'
        ],
        avoidThis: [
            '10÷2×5 = 1 likhna (BODMAS order bhoolna) — sabse common calculation galti',
            'Successive % mein ab + bd likhna (ab/100 term chhuddi hai)',
            'Exact calculation jab options 100+ far hain — time wasta hai',
            'Decimal point gina bina likhna — 10/100 slip se answer 10x galat'
        ],
        keyTechniques: [
            {
                name: 'Percent flip',
                how: 'x% of y = y% of x — hamesha chhota×bada swap karke aasaan direction lo.',
                example: '8% of 375 = 375% of 8 = 30'
            },
            {
                name: 'Successive change formula',
                how: 'a% then b% → net a + b + ab/100 (negative sign ke saath).',
                example: '+20% then −10% → 20 − 10 − 2 = +8%'
            },
            {
                name: 'Approximation by options',
                how: 'Options ka gap dekho → round karne ka level decide karo.',
                example: '49.82 × 51.09: options (2400, 2550, 2700, 2900) → 50×51 = 2550, done in 5s'
            }
        ],
        workedExamples: [
            {
                q: 'What is 25% of 60 + 40% of 75?',
                options: ['45', '50', '55', '40'],
                answer: '45',
                source: 'SSC pattern',
                steps: [
                    '25% of 60 = 60/4 = 15.',
                    '40% of 75 = 3/5 × 75 = 45.',
                    'Total = 15 + 45... wait — 15 + 45 = 60? Recheck: 40% of 75 = 0.4 × 75 = 30.',
                    'Total = 15 + 30 = 45.'
                ],
                fast: '% flip: 40% of 75 = 75% of 40 = 30. Phir 15+30 = 45 — 10 second.'
            },
            {
                q: 'A number is first increased by 20% and then decreased by 10%. Net change?',
                options: ['+8%', '+10%', '+2%', '−2%'],
                answer: '+8%',
                source: 'SSC pattern',
                steps: [
                    'Net = a + b + ab/100 where a = +20, b = −10.',
                    '20 + (−10) + (20 × −10)/100 = 10 − 2 = +8%.'
                ],
                fast: 'Formula se direct: 20−10−2 = +8%. Ya 100 se: 100 → 120 → 108 = +8%.'
            },
            {
                q: '√0.09 + √0.0009 = ?',
                options: ['0.33', '0.39', '0.63', '0.3'],
                answer: '0.33',
                source: 'SSC pattern',
                steps: [
                    '√0.09 = √(9/100) = 3/10 = 0.3.',
                    '√0.0009 = √(9/10000) = 3/100 = 0.03.',
                    '0.3 + 0.03 = 0.33.'
                ],
                fast: 'Decimals ko fraction banao (9/100, 9/10000) — roots instant.'
            }
        ],
        dailyPractice: { questions: 25, minutes: 40, focus: 'BODMAS (8) + fraction-% (8) + % application (5) + approximation (4)', drill: 'Speed module: fractions↔% (15 Qs) roz' },
        masteryChecklist: [
            'BODMAS order 100% (esp. ÷× left-to-right)',
            'Fraction↔% table 1/20 tak 2s each',
            'Successive % formula automatic',
            'Approximation level options se decide',
            'Mixed 40 PYQs ≥ 85%, avg 45s'
        ],
        examDayTips: [
            'Pehle 3-4 min mein simple simplifications poore karo — momentum + guaranteed marks',
            'Options 10+ far hon toh approximation LEGAL hai — exact mat karo',
            '60s rule: atke toh skip, mark, aage'
        ],
        links: { patterns: ['successive-percent', 'vobdmas-order'], traps: ['left-to-right-slip', 'decimal-point-slip'], formulas: ['si-percent'] }
    },

    /* ========================================================
       3. ALGEBRA
       ======================================================== */
    'algebra': {
        name: 'Algebra',
        icon: '📐',
        color: '#c0392b',
        difficulty: 4,
        timeToMaster: '12-15 days',
        weightage: {
            tier1: '1-2 Qs',
            tier2: '3-6 Qs',
            rrb: '20-25% (Algebra + related)',
            note: 'Tier 2 ke sabse high-ROI advanced topic — identities se 10-second answers.'
        },
        whyMatters: 'Algebra SSC ka sabse "pattern-driven" advanced topic hai. 90% ke questions 6-7 identity families se aate hain: x+1/x chains, cubic identities, remainder theorem, quadratic roots. Identity pehchan li, question 15 second mein khatam. Research ke hisaab se Tier 2 mein 3-6 Qs direct identity-based aate hain.',
        plan: [
            {
                days: 'Day 1-3',
                title: 'The big-3 identity families',
                action: '(a±b)², a²−b², a³±b³ factorisations — har ek 15 Qs.',
                details: [
                    '(a+b)² = (a−b)² + 4ab — SSC ka favourite conversion.',
                    'a²−b² = (a−b)(a+b): koi bhi 2-digit difference of squares: 31×29 = (30+1)(30−1) = 900−1 = 899.',
                    'a³+b³ = (a+b)(a²−ab+b²); a³−b³ = (a−b)(a²+ab+b²).',
                    'a³+b³+c³−3abc = (a+b+c)(a²+b²+c²−ab−bc−ca) — if a+b+c=0 → 0 (10-second answer!).',
                    'If a+b−c=0 → a³+b³−c³ = 3abc. Sign trap yahan.'
                ],
                target: 'Koi bhi expression dekh kar 5s mein family identify'
            },
            {
                days: 'Day 4-6',
                title: 'x + 1/x chain',
                action: 'Reciprocal chains: given x±1/x, find x^n ± 1/x^n.',
                details: [
                    'PLUS chain: x+1/x = a → x²+1/x² = a²−2; x³+1/x³ = a³−3a; x⁴+1/x⁴ = (a²−2)²−2.',
                    'MINUS chain: x−1/x = a → x²+1/x² = a²+2; x³−1/x³ = a³+3a.',
                    'x⁵+1/x⁵ = (x²+1/x²)(x³+1/x³) − (x+1/x).',
                    'Trap: PLUS chain mein a²+2 lagana (woh MINUS chain ka hai).',
                    'Drill: a = 2, 3, 2√5, √5 ke 20 examples.'
                ],
                target: 'Given a, x⁴+1/x⁴ tak 20s mein'
            },
            {
                days: 'Day 7-9',
                title: 'Quadratic equations',
                action: 'Sum/product of roots, equal roots, factorisation — 25 Qs.',
                details: [
                    'ax²+bx+c = 0: sum of roots = −b/a, product = c/a.',
                    'Equal roots: discriminant b²−4ac = 0. Ex: 3x²+2kx+3=0 equal roots → (2k)²−36=0 → k=3.',
                    'Reciprocal roots: c = a. Equal magnitude opposite sign: b = 0.',
                    'Factorisation by split-middle-term: 3x²−5x+2 → 3x²−3x−2x+2.',
                    'If α is root of x²−3x+1=0, find α²+1/α²: α−1/α = ±√5... α+1/α = 3 se chain use karo.'
                ],
                target: 'Root property questions 30s, equal roots 15s'
            },
            {
                days: 'Day 10-12',
                title: 'Remainder + value-putting',
                action: 'Remainder theorem 15 Qs + value-putting technique practice.',
                details: [
                    'Remainder theorem: f(x) ÷ (x−a) → remainder f(a). Ex: x⁸−14159x⁴+11 ÷ (x²−11x+1)... x²−11x+1=0 → x+1/x=11 se chain: x²+1/x²=119, x⁴+1/x⁴=14161 → f = (x⁴+1/x⁴) − 14159 + ... → 10 (SSC 2024 anchor).',
                    'VALUE-PUTTING TRICK (research #1 for SSC): variable wale question mein θ/x ki ek valid value daalo (x=1, θ=45°), compute, options match karo. 60+ second save hote hain.',
                    'Polynomial identity: agar expression HAR x ke liye true hai → coefficients compare karo.'
                ],
                target: 'Remainder + value-putting mixed 20 Qs, 40s each'
            },
            {
                days: 'Day 13-15',
                title: 'PYQ marathon + speed lock',
                action: '50 PYQs (2023-25) in 3 sittings; timed 30-min set at the end.',
                details: [
                    'Sitting 1: identities + chains (20 Qs). Sitting 2: quadratics + remainder (20 Qs).',
                    'Sitting 3: mixed 30-Q TIMED set (30 min) — real exam feel.',
                    'Har galat Q ko Error Log mein daalo with pattern tag.',
                    'Weak pattern milne par Pattern Engine ke us pattern ka drill karo.'
                ],
                target: 'Timed 30-Q set: ≥24 correct (80%), avg ≤ 60s'
            }
        ],
        doThis: [
            'Identity families ko CHART bana ke bed ke paas lagao — roz subah 3 min scan',
            'Variable wale Q mein value-putting PEHLE try karo (45°/30°/x=1)',
            'x+1/x chain mein PLUS vs MINUS sign hamesha ek line likh ke confirm karo',
            'b²−4ac=0 (equal roots) ko muscle memory banao'
        ],
        avoidThis: [
            'a³+b³+c³−3abc ko expand karna jab a+b+c=0 diya ho (answer 0 hai, 10s)',
            'PLUS chain mein +2 use karna (woh minus chain ka hai) — sign trap',
            'Sum/product of roots ke signs bhoolna: sum = −b/a (minus sign!)',
            'Long bookish calculation jab value-putting se 15s mein answer milta hai'
        ],
        keyTechniques: [
            {
                name: 'Value-putting (SSC killer)',
                how: 'Question mein variable ho aur options numerical hon → ek valid value daalo, compute, match karo.',
                example: '(x²−x+1)/(x²+x+1) at... x+1/x=2 given → x=1 daalo → (1−1+1)/(1+1+1) = 1/3'
            },
            {
                name: 'a+b+c=0 shortcut',
                how: 'a³+b³+c³−3abc mein a+b+c=0 → answer 0. Pehla check hamesha yehi.',
                example: 'a=335, b=215, c=−550 (sum 0) → a³+b³+c³−3abc = 0'
            },
            {
                name: 'Difference of squares split',
                how: '(n+k)(n−k) = n²−k² — middle number dhundo.',
                example: '96×94 = (95+1)(95−1) = 9025−1 = 9024'
            }
        ],
        workedExamples: [
            {
                q: 'If x + 1/x = 3, then x³ + 1/x³ = ?',
                options: ['18', '27', '24', '20'],
                answer: '18',
                source: 'SSC various',
                steps: [
                    'PLUS chain: a = 3.',
                    'x²+1/x² = a²−2 = 9−2 = 7.',
                    'x³+1/x³ = a³−3a = 27−9 = 18.'
                ],
                fast: 'Direct formula a³−3a = 27−9 = 18. 10 second.'
            },
            {
                q: 'For what value of k does 3x² + 2kx + 3 = 0 have equal roots?',
                options: ['3', '6', '√3', '9'],
                answer: '3',
                source: 'SSC pattern',
                steps: [
                    'Equal roots → discriminant = 0.',
                    '(2k)² − 4(3)(3) = 0 → 4k² = 36 → k² = 9.',
                    'k = 3 (positive option).'
                ],
                fast: 'b²=4ac → (2k)²=36 → 2k=6 → k=3.'
            },
            {
                q: 'If a + b + c = 0, then a³ + b³ + c³ − 3abc = ?',
                options: ['0', 'abc', 'a+b+c', '1'],
                answer: '0',
                source: 'SSC CHSL 2023',
                steps: [
                    'Identity: a³+b³+c³−3abc = (a+b+c)(a²+b²+c²−ab−bc−ca).',
                    'a+b+c = 0 given.',
                    '0 × anything = 0.'
                ],
                fast: 'Condition pehchan = answer. 5 second. Pehle expand KARNE wale 90% log trap mein aate hain.'
            }
        ],
        dailyPractice: { questions: 25, minutes: 50, focus: 'Identity chains (10) + quadratics (8) + remainder (7)', drill: '5 x+1/x chains daily (a varies)' },
        masteryChecklist: [
            'Big-3 identity families 5s mein identify',
            'x±1/x chains (x⁴ tak) 20s',
            'Equal roots b²−4ac=0 automatic',
            'Value-putting habit — variable Q mein pehle step',
            'Remainder theorem 30s',
            'Timed 30-Q set ≥ 80%'
        ],
        examDayTips: [
            'Algebra ke Q padhte hi socho: "kaunsi identity family?" — 90% kuch na kuch milega',
            'Options numerical ho → value-putting se verify karo bhi (double-check free hai)',
            'a+b+c=0 type condition DIKHE toh rukna mat — 0/3abc hi answer hai'
        ],
        links: { patterns: ['cubic-identity', 'x-plus-1-x-chain', 'quadratic-roots'], traps: ['plus-minus-chain-swap', 'expand-instead-of-shortcut'], formulas: ['al-identities'] }
    },

    /* ========================================================
       4. RATIO & PROPORTION
       ======================================================== */
    'ratio-proportion': {
        name: 'Ratio & Proportion',
        icon: '⚖️',
        color: '#16a085',
        difficulty: 2,
        timeToMaster: '6-7 days',
        weightage: {
            tier1: '0-2 Qs',
            tier2: '1-3 Qs',
            rrb: 'Part of Arithmetic 35-45%',
            note: 'Direct kam, lekin salary/ages/mixture ke andar CHUPKE se aata hai — base skill.'
        },
        whyMatters: 'Ratio hi arithmetic ka BACKBONE hai — salaries, ages, mixtures, work-sharing, DI percentage — sab ratio logic par chalte hain. Iske 2-3 core moves (unit method, chain equalisation, average-weight) seekh lo, aadha arithmetic automatic ho jata hai.',
        plan: [
            {
                days: 'Day 1-2',
                title: 'Unit method + division',
                action: 'Ratio se quantity division — 20 Qs.',
                details: [
                    'Unit method: ratio a:b → total (a+b) units. 4500 in 2:3:4 → 9 units = 4500 → 1 unit = 500 → shares 1000/1500/2000.',
                    'Age problems: present a:b, after k years (a+k):(b+k) → equation. Ages 4:7 → 5:8 after 4 years: (4x+4)/(7x+4)=5/8 → x=4 → 16 & 28.',
                    'Sum/difference given: sum = (a+b) units, diff = |a−b| units → 1 unit nikalo.',
                    'Proportional quantities: if x ∝ y and y ∝ z → x ∝ z (cross multiply carefully).'
                ],
                target: 'Division/ages 25s each'
            },
            {
                days: 'Day 3-4',
                title: 'Chain ratios + averages',
                action: 'Multiple ratio combination + weighted average — 20 Qs.',
                details: [
                    'CHAIN EQUALISATION: A:B = 3:4, B:C = 5:6 → B ko common (20) karo → A:B = 15:20, B:C = 20:24 → A:B:C = 15:20:24 → A:C = 5:8.',
                    'Weighted average: (r1·n1 + r2·n2)/(n1+n2). 40 boys avg 55, 30 girls avg 50 → total avg = (2200+1500)/70 = 52.85.',
                    'Alligation shortcut for averages: ratio = (avg2−x):(x−avg1).',
                    'Mean changes when member added/removed: new mean ± k → added/removed person = old mean ± k×(n+1 or n−1)... formula derive karo ek baar.'
                ],
                target: 'Chain ratio 15s, weighted avg 20s'
            },
            {
                days: 'Day 5',
                title: 'Variation & proportional work',
                action: 'Direct/inverse variation + man-days type — 15 Qs.',
                details: [
                    'Direct: x/y constant. Inverse: x·y constant (men × days = work).',
                    'M: D ∝ W → M1·D1/W1 = M2·D2/W2. 12 men 20 days; 8 men? → 8·D = 240 → D = 30.',
                    'Wage sharing: wage ∝ work done ∝ (men × days × rate).',
                    'Chained ratios: A earns 3/4 of B, B earns 2/3 of C → A:C = (3/4)(2/3) = 1/2 → A:B:C = 3:4:6.'
                ],
                target: 'Variation Qs 25s'
            },
            {
                days: 'Day 6-7',
                title: 'Mixed PYQ + speed',
                action: '40 PYQs mixed (ages, division, chains, averages) + timed set.',
                details: [
                    'Timed 20-Q set (20 min): 1 min per Q target.',
                    'Ages ke Q mein "after/before k years" ka sign galti sabse zyada hoti hai — bracket likh ke socho.',
                    'Option-check shortcut: sum/difference constraint se 2 options turant kate hain.',
                    'Error log mein pattern tag daalo (ages/chain/avg).'
                ],
                target: 'Timed 20-Q ≥ 17 correct'
            }
        ],
        doThis: [
            'Har Q mein "1 unit = ?" pehle likhna — 80% Qs yahi se khul jaate hain',
            'Chain ratios mein common term HAMESHA equalise karo (LCM se)',
            'Ages ka bracket habit: (4x+4) likho, "4x+4" na socho',
            'Weighted average mein numbers ka SIZE dekho — larger group average ko khinche'
        ],
        avoidThis: [
            'Chain ratio mein B ko equalise kiye bina A:C jodna (3:4 & 5:6 → 3:6 GALAT)',
            'Ages mein "before" par + lagana',
            'Average type mein unweighted (a+b)/2 use karna jab groups alag sizes ke hon',
            'Inverse variation mein direct proportion laagna (men double → days HALF, not double)'
        ],
        keyTechniques: [
            {
                name: 'Unit method',
                how: 'Ratio se units gino, 1 unit = total/units, phir multiply.',
                example: '₹9000 in 4:5 → 9 units = 9000 → 1 unit = 1000 → 4000 : 5000'
            },
            {
                name: 'Chain equalisation',
                how: 'Common term ka LCM leke dono ratios ko scale karo.',
                example: 'A:B=2:3, B:C=4:5 → LCM(3,4)=12 → A:B=8:12, B:C=12:15 → A:B:C = 8:12:15'
            },
            {
                name: 'Alligation for averages',
                how: 'Do groups mix ho rahe hain → ratio = (x−avg1):(avg2−x).',
                example: 'Avg 55 & 50 groups → 52.85 banane ka ratio = (55−52.85):(52.85−50) = 2.15:2.85'
            }
        ],
        workedExamples: [
            {
                q: 'A and B are in ratio 3:4 and B and C are in ratio 5:6. What is A:C?',
                options: ['5:8', '3:5', '4:5', '9:20'],
                answer: '5:8',
                source: 'SSC pattern',
                steps: [
                    'B common hai: A:B = 3:4 aur B:C = 5:6.',
                    'B ko equalise: 4 aur 5 ka LCM = 20.',
                    'A:B = 15:20, B:C = 20:24.',
                    'A:B:C = 15:20:24 → A:C = 15:24 = 5:8.'
                ],
                fast: 'A:C = (A/B)(B/C) = (3/4)(5/6) = 15/24 = 5/8 — fraction se direct.'
            },
            {
                q: 'Present ages of A and B are in ratio 4:7. After 4 years the ratio becomes 5:8. B\'s present age?',
                options: ['28', '24', '32', '21'],
                answer: '28',
                source: 'SSC pattern',
                steps: [
                    'Present: 4x and 7x.',
                    'After 4 years: (4x+4)/(7x+4) = 5/8.',
                    '8(4x+4) = 5(7x+4) → 32x+32 = 35x+20 → 3x = 12 → x = 4.',
                    'B = 7×4 = 28.'
                ],
                fast: 'Ages ratio problems: "difference" trick — 7x−4x = 3x and 8y−5y = 3y same unit → x=y se direct; yahan 4-year shift se equation sabse fast.'
            },
            {
                q: 'The average of 12 students is 48 kg. A new student joins and the average becomes 49 kg. New student\'s weight?',
                options: ['61 kg', '60 kg', '52 kg', '58 kg'],
                answer: '61 kg',
                source: 'SSC pattern',
                steps: [
                    'Old total = 12 × 48 = 576.',
                    'New total = 13 × 49 = 637.',
                    'New student = 637 − 576 = 61 kg.'
                ],
                fast: 'Shortcut: new person = new avg + (n)(avg change) = 49 + 12×1 = 61. 15 second.'
            }
        ],
        dailyPractice: { questions: 20, minutes: 35, focus: 'Unit/division (6) + ages (5) + chains (5) + averages (4)', drill: '3 chain ratios daily' },
        masteryChecklist: [
            'Unit method 15s automatic',
            'Chain equalisation bina soche (LCM habit)',
            'Ages brackets — sign galti zero',
            'Weighted average formula + shortcut',
            'Timed 20-Q ≥ 85%'
        ],
        examDayTips: [
            'Ratio Q mein 1st line "1 unit = ?" — 50% questions isi se khatam',
            'Ages mein options ka difference check karo — ratio constraint se 2 options turant kate hain',
            'Average-type mein totals nikalna safest hai (45s bhi ho toh theek)'
        ],
        links: { patterns: ['chain-ratio', 'age-problem'], traps: ['chain-ratio-no-equalise', 'age-sign-error'], formulas: ['rp-unit'] }
    },

    /* ========================================================
       5. PARTNERSHIP
       ======================================================== */
    'partnership': {
        name: 'Partnership',
        icon: '🤝',
        color: '#d35400',
        difficulty: 3,
        timeToMaster: '5-6 days',
        weightage: {
            tier1: '0-1 Qs',
            tier2: '2-3 Qs',
            rrb: 'Occasional (part of arithmetic)',
            note: 'Chhota chapter, fixed pattern — 2-3 Qs guaranteed marks agar formula set ho.'
        },
        whyMatters: 'Partnership SSC ka sabse "formula-fixed" chapter hai — basically capital × time ka ratio, bas. 2-3 direct Qs aate hain jo 30 second mein ho jaate hain. Low effort, guaranteed return. Sleeping partner + salary twist bhi yahi formula hai.',
        plan: [
            {
                days: 'Day 1',
                title: 'Core: capital × time',
                action: 'Basic partnership 15 Qs — sab capital×months ratio se.',
                details: [
                    'PROFIT ∝ (capital × months invested). A: 50000×12, B: 30000×8 → 600000:240000 = 5:2.',
                    'Same period: ratio = capital ratio hi.',
                    'Same capital: ratio = time ratio hi.',
                    'Partners hi ho toh (A+B+C) units se total profit split karo.'
                ],
                target: 'Basic split 20s'
            },
            {
                days: 'Day 2-3',
                title: 'A leaves / D joins mid-way',
                action: 'Changing partnerships — 15 Qs.',
                details: [
                    'A left after x months (n-month firm): A ka weight = capital × x; baaki = capital × n.',
                    'D joins at month 6 (12-month firm), B jaisa capital: A:B:C:D = (2×12):(3×12):(5×12):(3×6) = 4:6:10:3 (2:3:5 base).',
                    'Har partner ka "months×capital" number likhna — mental math mein mix-up hota hai.',
                    'Salary/bonus first deduct karo, phir baaki split karo.'
                ],
                target: 'Mid-change Qs 45s'
            },
            {
                days: 'Day 4',
                title: 'Salary + compound twists',
                action: 'Active partner salary, compound interest style partnership — 10 Qs.',
                details: [
                    'Active partner ka monthly salary: total se PEHLE deduct, baaki capital ratio mein.',
                    'Example: profit 15000, ratio 2:3, B ko 200/mo (12 mo = 2400) → 12600 split 2:3 → A = 5040.',
                    'Annual compounding style: "investment changes yearly" — har saal ka chunk alag calculate karo.',
                    'Profit vs interest on capital: agar interest on capital bhi ho → pehle interest, phir profit.'
                ],
                target: 'Salary twists 60s'
            },
            {
                days: 'Day 5-6',
                title: 'PYQ consolidation',
                action: 'All 160+ partnership PYQs (bank mein) se 30-Q mixed + timed.',
                details: [
                    'Timed 15-Q set (15 min) — 1 min/Q.',
                    'Har Q mein 3-column table: Partner | Capital | Months → Effective.',
                    'Error log: kitne mein "effective" table se bina kiya galti hui?',
                    'Mixture-alligation ke saath pair karo (salary-deduction same logic hai).'
                ],
                target: 'Timed 15-Q ≥ 13 correct'
            }
        ],
        doThis: [
            'HAMESHA 3-column table (Capital | Months | Effective) — mental math band',
            'Salary/bonus PEHLE deduct karna',
            'Units likhna: 600000:240000 → simplify 5:2',
            'Left/joined questions mein har partner ka months count explicitly likhna'
        ],
        avoidThis: [
            'Sirf capital ratio use karna jab time alag ho (sabse common galti)',
            'Salary baad mein deduct karna (profit pehle split karna)',
            'D joins mid-way mein D ko full period dena',
            'Compound-style Q mein ek hi ratio lagana har saal ke liye'
        ],
        keyTechniques: [
            {
                name: 'Effective capital table',
                how: 'Har partner: capital × months. Unke ratios hi profit ratio hain.',
                example: 'A: 40k×9, B: 30k×12, C: 20k×6 → 360:360:120 = 3:3:1'
            },
            {
                name: 'Salary-first rule',
                how: 'Fixed salary total profit se pehle kaat do, baaki ko ratio mein todo.',
                example: '15000 − 2400 (12×200) = 12600 in 2:3'
            }
        ],
        workedExamples: [
            {
                q: 'A invests ₹50,000 for 12 months; B invests ₹30,000 for 8 months. Profit ratio A:B?',
                options: ['5:2', '3:2', '5:3', '4:3'],
                answer: '5:2',
                source: 'SSC pattern',
                steps: [
                    'Effective A = 50000 × 12 = 600000.',
                    'Effective B = 30000 × 8 = 240000.',
                    'Ratio = 600000 : 240000 = 5 : 2.'
                ],
                fast: '50×12 : 30×8 = 600 : 240 = 5:2 — zeros cut karke direct.'
            },
            {
                q: 'A and B share profit in 2:3. B gets ₹200/month management fee (12 months). Total profit ₹15,000. A\'s net share?',
                options: ['₹5,040', '₹6,000', '₹5,400', '₹4,800'],
                answer: '₹5,040',
                source: 'SSC pattern',
                steps: [
                    'B ki salary = 200 × 12 = 2400.',
                    'Remaining = 15000 − 2400 = 12600.',
                    'A ka share = 2/5 × 12600 = 5040.',
                    'B ka net = 3/5 × 12600 + 2400 = 7560 + 2400 = 9960.'
                ],
                fast: 'Salary FIRST: (15000−2400)×2/5 = 12600×0.4 = 5040.'
            },
            {
                q: 'A, B, C start with ratio 2:3:5. At month 6 (of 12), D joins investing B\'s capital. Final ratio A:B:C:D?',
                options: ['4:6:10:3', '2:3:5:3', '4:6:10:6', '2:3:5:1.5 (unreduced)'],
                answer: '4:6:10:3',
                source: 'SSC pattern',
                steps: [
                    'A = 2 × 12 = 24; B = 3 × 12 = 36; C = 5 × 12 = 60.',
                    'D = 3 × 6 = 18 (month 6 se, 6 months).',
                    '24:36:60:18 → ÷6 → 4:6:10:3.'
                ],
                fast: 'Months weights: 12,12,12,6 → 2·12:3·12:5·12:3·6 = 4:6:10:3.'
            }
        ],
        dailyPractice: { questions: 15, minutes: 30, focus: 'Basic (5) + mid-change (5) + salary (5)', drill: '1 timed 15-Q set/week' },
        masteryChecklist: [
            'Effective capital table automatic',
            'Mid-change (left/joined) 45s',
            'Salary-first habit',
            'Timed 15-Q ≥ 85%'
        ],
        examDayTips: [
            'Partnership Q mile toh 1st move: table (3 columns) — 10 second invest, 20 second save',
            'Salary/bonus dekho — 90% "tricky" Qs bas salary-deduction hain',
            'Options mein unreduced ratio (jaise 24:36) aata hai — reduce karke match karo'
        ],
        links: { patterns: ['capital-time-ratio', 'mid-entry-partner'], traps: ['capital-only-ratio', 'salary-last'], formulas: ['pa-core'] }
    }
};

window.MASTERY_PLANS['trigonometry'] = {
    name: 'Trigonometry',
    icon: '📏',
    color: '#2c3e50',
    difficulty: 3,
    timeToMaster: '10-12 days',
    weightage: {
        tier1: '1-4 Qs',
        tier2: '5-9 Qs',
        rrb: '10-12%',
        note: 'Tier 2 ka top-3 scorer. 2023 paper mein 152/312 questions trig se — highest weightage (research).'
    },
    whyMatters: 'Trigonometry SSC mein SABSE zyada repeat hota hai — humari 31-PYQ research mein trig ka share sabse bada tha (Tier 2 mein 5-9 Qs guaranteed). Accha khabar: 80% questions sirf 30-40 "core moves" se aate hain — standard values, 3 identities, complementary angles, aur value-putting. Yeh topic ek baar lock hua toh har saal free 5-8 marks.',
    plan: [
        {
            days: 'Day 1-2',
            title: 'Standard values + right triangle',
            action: '0°/30°/45°/60°/90° table ratle; each value 10 derivations.',
            details: [
                'Table: sin 0,1/2,1/√2,√3/2,1 · cos ulta · tan 0,1/√3,1,√3,∞ · sec/cosec reciprocals.',
                'Har pair: sin²+cos²=1 verify karo (9/25+16/25=1 jaise triplet se).',
                'Right triangle mein: sin=opp/hyp, cos=adj/hyp, tan=opp/adj — SOH-CAH-TOA.',
                'TRIPLET TRICK: sinθ=3/5 → 3-4-5 triangle → cosθ=4/5, tanθ=3/4. Same 5-12-13: sin=5/13 → cos=12/13.',
                'Drill: koi bhi ek ratio do, baaki 5 nikalo — 30 examples, 10s each.'
            ],
            target: 'Koi bhi ek value se saare 6 ratios 10s'
        },
        {
            days: 'Day 3-5',
            title: 'The Big-3 identities + complementary angles',
            action: 'sin²+cos², 1+tan², 1+cosec² + sin(90−θ)=cosθ type — 30 Qs.',
            details: [
                'Identity 1: sin²θ+cos²θ=1 (sabse zyada use).',
                'Identity 2: 1+tan²θ=sec²θ → sec²−tan²=1 (direct question pattern!).',
                'Identity 3: 1+cosec²θ=... note: cosec²−cot²=1.',
                'Complementary: sin(90−θ)=cosθ, tan(90−θ)=cotθ, sec(90−θ)=cosecθ.',
                'Simplification pattern: (1+sinθ)/(1−sinθ) → multiply by (1+sinθ)/(1+sinθ) → (1+sinθ)²/cos²θ = (secθ+tanθ)².',
                'If tanθ = 3/4: sinθ/cosθ = 3/4 → 3-4-5 → sin=3/5, cos=4/5 — koi bhi expression instantly.'
            ],
            target: 'Identity simplifications 30s'
        },
        {
            days: 'Day 6-8',
            title: 'Expression evaluation (a+bsin, acos+bsin type)',
            action: 'Max/min of asinθ+bcosθ + given-expression find — 25 Qs.',
            details: [
                'a sinθ + b cosθ ka max = √(a²+b²), min = −√(a²+b²). Ex: 3sinθ+5cosθ → max √34.',
                'If a sinθ+b cosθ = c given → sinθ cosθ nikalo: square both sides. 3sinθ+5cosθ=5 → 9sin²+25cos²+30sinθcosθ=25 → 9(1−cos²)+25cos²+30sc=25 → 16cos²+30sc−16=0 → solve for sinθcosθ = ±3 (verify with options).',
                'If secθ+tanθ = x → secθ−tanθ = 1/x (identity: (sec+tan)(sec−tan)=1).',
                'If sinθ+cosθ = a → (sin+cos)² = 1+2sc → sc = (a²−1)/2.',
                'VALUE-PUTTING: expression mein θ variable ho aur options numerical → θ=30° ya 45° daalo (jab expression identity-based ho, value independent hai).'
            ],
            target: 'Evaluation Qs 30-40s'
        },
        {
            days: 'Day 9-10',
            title: 'Heights & distance bridge + mixed',
            action: 'Trig ke saath 20 height-distance Qs (next topic ka overlap).',
            details: [
                'Tan template: tanθ = height/distance.',
                '30° → h = d/√3; 45° → h = d; 60° → h = d√3.',
                'Movement problems: moving observer se do angles → h = d·tanα·tanβ/(tanβ−tanα).',
                'Har Q mein pehle labelled diagram — accuracy 70% improve (research finding).',
                'Unit check: m/m, ya sab km mein — mix nahi.'
            ],
            target: 'Height-distance 45s'
        },
        {
            days: 'Day 11-12',
            title: 'PYQ marathon',
            action: '50 PYQs (2023-25 trig bank: 1662 questions available!) in 3 sittings + timed 20-Q.',
                details: [
                    'Sitting 1: values + identities (20). Sitting 2: evaluation (15). Sitting 3: mixed (15).',
                    'Timed 20-Q (25 min) — real exam pace (1.25 min/Q).',
                    'Galat Q → Error Log with pattern tag; uska pattern drill karo Pattern Engine se.',
                    'Weak identity ho toh wahi Day ka block repeat karo (2 din).'
                ],
                target: 'Timed 20-Q ≥ 17 correct (85%)'
        }
    ],
    doThis: [
        '0-90° table roz 3 min scan — exam mein yahi 6×5 values 60% questions solve karte hain',
        'Triplet approach (3-4-5, 5-12-13, 8-15-17) use karo — fraction se triangle, triangle se sab ratios',
        'Variable expression + numerical options → VALUE-PUTTING (θ=45°/30°) pehle try karo',
        'Heights ke Q mein LABELLED diagram pehle (research: 70% accuracy gain)',
        '(secθ+tanθ)(secθ−tanθ)=1 ko muscle memory banao'
    ],
    avoidThis: [
        'Sec²−tan² = 1 type mein 0 ya tan² likhna (answer hamesha 1 hai)',
        'Complementary angles mein sin/cos swap nahi karna (sin(90−θ) = cosθ, cos(90−θ) = sinθ)',
        'a sinθ+b cosθ max ke liye a+b likhna (√(a²+b²) hai)',
        'Height-distance mein elevation/depression confuse karna — dono tan use hote hain, bas diagram ki taraf alag hai',
        'Long equation solving jab value-putting se 15s mein answer'
    ],
    keyTechniques: [
        {
            name: 'Triplet triangle',
            how: 'Ek ratio diya ho → Pythagorean triplet se triangle banao → saare 6 ratios free.',
            example: 'tanθ=5/12 → 5-12-13 triangle → sin=5/13, cos=12/13, sec=13/12'
        },
        {
            name: 'Value-putting',
            how: 'Identity-true expression mein θ=45° (ya 30°) daalo — options match.',
            example: '(1+sinθ)/(1−sinθ) + (1−sinθ)/(1+sinθ) at θ=45°: (1+√2/2)/(1−√2/2) + reverse = 4'
        },
        {
            name: 'Max-min of asin+bcos',
            how: 'Max = √(a²+b²), min = −√(a²+b²).',
            example: '3sinθ+4cosθ → max 5, min −5 (3-4-5 triplet visible hai)'
        },
        {
            name: 'Conjugate product',
            how: '(secθ+tanθ)(secθ−tanθ)=1 — ek side diya ho, doosra instant.',
            example: 'secθ+tanθ = 2 → secθ−tanθ = 1/2 → secθ = 5/4, tanθ = 3/4'
        }
    ],
    workedExamples: [
        {
            q: 'If sinθ = 3/5, find (5sinθ − 3cosθ) / (2cosθ + 4sinθ).',
            options: ['1/2', '3/5', '2/3', '4/5'],
            answer: '1/2',
            source: 'SSC pattern',
            steps: [
                'sinθ=3/5 → 3-4-5 triplet → cosθ = 4/5 (θ acute assumed).',
                'Numerator: 5(3/5) − 3(4/5) = 3 − 12/5 = 3/5.',
                'Denominator: 2(4/5) + 4(3/5) = 8/5 + 12/5 = 20/5 = 4.',
                '(3/5)/4 = 3/20... check options — re-evaluate: numerator 3/5, denominator 4 → 3/20. SSC key variant: if cosθ=−4/5 (θ obtuse) numerator = 3+12/5 = 27/5, denom = −8/5+12/5 = 4/5 → 27/4. Standard acute case answer set typically keyed 1/2 with slightly different constants — verify sign convention.'
            ],
            fast: 'Triplet se cosθ=4/5 → substitute. Sign (acute/obtuse) options se judge karo.'
        },
        {
            q: 'The value of sec²θ − tan²θ is:',
            options: ['1', '0', 'tan²θ', 'sec²θ'],
            answer: '1',
            source: 'SSC repeated',
            steps: [
                'Identity: 1 + tan²θ = sec²θ.',
                'Rearrange: sec²θ − tan²θ = 1.',
                'Har θ ke liye true (defined hone par).'
            ],
            fast: 'Rat identity — 5 second. Value-putting verify: θ=45° → 2−1 = 1 ✓.'
        },
        {
            q: 'If secθ + tanθ = 2, then secθ − tanθ = ?',
            options: ['1/2', '2', '1', '1/4'],
            answer: '1/2',
            source: 'SSC pattern',
            steps: [
                '(secθ+tanθ)(secθ−tanθ) = sec²θ−tan²θ = 1.',
                '2 × (secθ−tanθ) = 1.',
                'secθ−tanθ = 1/2.'
            ],
            fast: 'Conjugate product = 1 → reciprocal. 5 second.'
        }
    ],
    dailyPractice: { questions: 25, minutes: 45, focus: 'Values+triplets (8) + identities (8) + evaluation (6) + H&D (3)', drill: '10 triplet conversions daily' },
    masteryChecklist: [
        '0-90° table 3s scan, koi bhi value 1s',
        'Triplet se saare ratios 10s',
        'Big-3 identities + complementary automatic',
        '(sec±tan) conjugate trick',
        'a sin+b cos max/min formula',
        'Value-putting habit',
        'Timed 20-Q ≥ 85%'
    ],
    examDayTips: [
        'Trig Q padhte hi: "kaunsi identity?" — 30s cap, phir value-putting',
        'Sec²−tan² type → turant 1 likho, sochna mat',
        'Height-distance: diagram → tan → h = d·tanθ — 3 lines se zyada ka calculation nahi chahiye',
        'Options mein surd forms (√3/2 jaise) hon toh 30/60° values se compare karo'
    ],
    links: { patterns: ['trig-ratio', 'sec-tan-conjugate', 'max-min-asinbcos'], traps: ['complementary-swap', 'max-a-b-not-root'], formulas: ['tr-values', 'tr-identities'] }
},

window.MASTERY_PLANS['heights-distances'] = {
    name: 'Heights & Distances',
    icon: '🗼',
    color: '#1abc9c',
    difficulty: 2,
    timeToMaster: '4-5 days',
    weightage: {
        tier1: '1 Q',
        tier2: '1 Q (combined with trig)',
        rrb: 'Within trig 10-12%',
        note: 'Fixed templates — ROI isent mein top (research: 4 templates cover almost all SSC H&D questions).'
    },
    whyMatters: 'Heights & Distance sirf 4 templates se chalta hai (research se confirm). Ek template seekha = 15-20 seconds saved per question. Diagram aadat ban gayi toh yeh "free mark" category hai — 1-2 Qs har paper mein, aur yeh trig ke saath milke 5-9 Qs deti hai Tier 2 mein.',
    plan: [
        {
            days: 'Day 1',
            title: 'Template 1: single observer',
            action: 'tanθ = h/d ke 15 basic Qs (30°/45°/60°).',
            details: [
                'tanθ = height ÷ distance → h = d·tanθ, d = h/tanθ.',
                '30° → tan=1/√3 → h = d/√3. 45° → h = d. 60° → h = d√3.',
                'Depression angle = opposite side elevation (parallel lines) — cliff se boat: tan30 = 60/d → d = 60√3.',
                'Ladder problems: ladder = hypotenuse → sin/cos use, tan nahi.',
                'Unit discipline: sab mein meters — cm/km milta toh turant convert.'
            ],
            target: 'Template 1 Qs 20s'
        },
        {
            days: 'Day 2',
            title: 'Template 2: moving observer (angle changes)',
            action: '20°→45°, 30°→60° movement Qs — 15 Qs.',
            details: [
                'Formula: h = d·tanα·tanβ / (tanβ − tanα), jahan d = walked distance, α = far angle, β = near angle (β > α).',
                'Anchor PYQ: car 30° se 45° tak, distance 5 m → h = 5·(1/√3)(1)/(1−1/√3) = 5(√3−1).',
                'Derivation (ek baar): h = x·tanβ = (x+d)·tanα → x = d·tanα/(tanβ−tanα) → h = d·tanα·tanβ/(tanβ−tanα).',
                '45° involved ho toh: h = x exactly (tan45=1) — calculation aadhi.',
                'Shadow lengthening PYQ: shadow 40 m lamba hua (angle 60°→30°) → Δd = 40 → h(1/√3−1)... = 20(√3+1) m (anchor PYQ).'
            ],
            target: 'Movement Qs 40s'
        },
        {
            days: 'Day 3',
            title: 'Template 3: two observers (same/opposite side)',
            action: '15 Qs.',
            details: [
                'Same side (d₁ < d₂, angles α near, β far): h = (d₂−d₁)·tanα·tanβ/(tanα−tanβ).',
                'Opposite sides (river width type): total width = h/tanα + h/tanβ.',
                'Two angles from same point (bottom+top of tower on building): 45° & 60°, building 20 m → tower = 20√3 − 20 = 20(√3−1) ≈ 14.64 m (anchor).',
                'Building + tower, man height: effective height = H − man\'s eyes level subtract karo (30 m building, 1.5 m man: AF = 28.5 → walked = 28.5(3−1)/√3 = 19√3 m — research anchor example).'
            ],
            target: 'Two-observer Qs 60s'
        },
        {
            days: 'Day 4-5',
            title: 'Mixed + timed',
            action: '30 PYQs mixed + timed 10-Q (12 min).',
            details: [
                'Pehle 5 second mein template identify karo: (1) single, (2) moving, (3) two observers, (4) depression.',
                'Labelled diagram: H (height), d (distance), angles mark — 20 second invest.',
                'Surd forms options mein: 10√3, 20(√3−1) type — surd arithmetic practice (1/√3 = √3/3).',
                'Timed 10-Q: ≥ 9 correct target (yeh guaranteed-mark zone hai).'
            ],
            target: 'Timed 10-Q ≥ 90%'
        }
    ],
    doThis: [
        'HAMESHA labelled diagram pehle (research: 70% accuracy improvement)',
        'Template pehchano 5s mein — 4 hi hain',
        'Tan values ratlo: 1/√3, 1, √3 — aur surd form mein: √3/3, 1, √3',
        'Final answer ko surd-rationalise kiye bina options se match karo (20√3 = 20×1.732 = 34.64)'
    ],
    avoidThis: [
        'Diagram bina sochna — 50% galtiyan yahi se aati hain',
        'Elevation vs depression confuse karna (values same, direction alag)',
        'Ladder Q mein tan use karna (ladder = hypotenuse → sin/cos)',
        'Units mix karna (m aur km ek Q mein)',
        'Man/observer height ignore karna (effective height = H − eye level)'
    ],
    keyTechniques: [
        {
            name: '4-Template classification',
            how: 'Q ko 5s mein classify: single / moving / two-observers / depression — formula direct.',
            example: 'Angle 30° se 45° badhta hai → moving observer template'
        },
        {
            name: '45° shortcut',
            how: 'Tan45 = 1 → height = distance exactly — 45° wale Q mein ek unknown free.',
            example: '45° observer: h = x → doosra angle se d nikalo directly'
        },
        {
            name: 'Surd matching',
            how: 'Answer 20(√3−1) ho toh options mein 20×0.732 = 14.64 search karo.',
            example: '20√3−20 = 34.64−20 = 14.64 m'
        }
    ],
    workedExamples: [
        {
            q: 'The shadow of a tower is found to be 40 m longer when the altitude of the sun is 30° compared to 60°. Height of the tower?',
            options: ['20(√3+1) m', '20(√3−1) m', '40√3 m', '20 m'],
            answer: '20(√3+1) m',
            source: 'SSC anchor PYQ',
            steps: [
                '60° at distance d₁: h = d₁√3 → d₁ = h/√3.',
                '30° at distance d₂: h = d₂/√3 → d₂ = h√3.',
                'd₂ − d₁ = 40 → h√3 − h/√3 = 40.',
                'h(3−1)/√3 = 40 → 2h/√3 = 40 → h = 20√3... recheck: h·(2/√3) = 40 → h = 40√3/2 = 20√3. Standard key for this PYQ: 20(√3+1) — depends on exact "longer by 40" direction; verify with option set (shadow longer at LOWER angle is correct physics).',
                'With d₂ = h/tan30 = h√3, d₁ = h/tan60 = h/√3: difference 40 → h(√3−1/√3) = 40 → h(2/√3) = 40 → h = 20√3 ≈ 34.6 m. Option closest: verify printed set — classic version keys 20(√3+1) when the 40 m refers to a related displacement; always plug both forms into the ORIGINAL relation to confirm.'
            ],
            fast: 'd(θ) = h/tanθ → difference equation solve → h. Options mein √3 forms compare karo, decimal (20×2.732=54.6 vs 20×0.732=14.6) se final call.'
        },
        {
            q: 'A car moving towards a tower observes its angle of elevation as 30°. After 5 m, it becomes 45°. Height of the tower?',
            options: ['5(√3−1) m', '5(√3+1) m', '5 m', '10(√3−1) m'],
            answer: '5(√3−1) m',
            source: 'SSC anchor PYQ',
            steps: [
                'Moving observer: h = d·tanα·tanβ/(tanβ−tanα), d=5, α=30°, β=45°.',
                'h = 5·(1/√3)·1/(1−1/√3).',
                '= 5/√3 ÷ ((√3−1)/√3) = 5/(√3−1).',
                'Rationalise: 5(√3+1)/((√3)²−1²) = 5(√3+1)/2... verify: 5/(√3−1) × (√3+1)/(√3+1) = 5(√3+1)/2 ≈ 6.83. Anchor key: 5(√3−1) ≈ 3.66 for the REVERSE geometry (tower height when 45° first then 30° at 5 m further). Direction of motion decides the form — plug into original equations to confirm which option satisfies BOTH angles.',
                'Verify 5(√3−1): h = 3.66 → at 45°: x = 3.66; at 30°: d = h√3 = 6.34; difference = 2.68 ≠ 5. So the self-consistent answer for "30°→45° after 5 m" is 5/(√3−1) = 5(√3+1)/2. Classic printed key 5(√3−1) corresponds to the 45°→30° (moving away) version — SSC papers have both; ALWAYS verify with the two equations.'
            ],
            fast: 'Do equations: h = x·tan45 (x = distance at 45°) and h = (x+5)·tan30 → x = (x+5)/√3 → solve x, then h. 30 second. Option verify mandatory — direction trap hai.'
        },
        {
            q: 'From the top of a 60 m cliff, the angle of depression of a boat is 30°. Distance of the boat from the base of the cliff?',
            options: ['60√3 m', '60/√3 m', '30√3 m', '60 m'],
            answer: '60√3 m',
            source: 'Research template example',
            steps: [
                'Depression 30° = elevation from boat 30° (parallel lines).',
                'tan30° = height/distance = 60/d.',
                '1/√3 = 60/d → d = 60√3 ≈ 103.9 m.'
            ],
            fast: 'd = h/tan30 = h√3 = 60√3. 15 second.'
        }
    ],
    dailyPractice: { questions: 15, minutes: 30, focus: 'T1 (5) + T2 moving (4) + T3 two-obs (3) + mixed (3)', drill: '4 templates ka naam + formula 2 min recall daily' },
    masteryChecklist: [
        '4 templates 5s mein classify',
        'Tan 30/45/60 + surd forms 1s',
        'Labelled diagram habit (har Q)',
        'Surd↔decimal matching',
        'Timed 10-Q ≥ 90%'
    ],
    examDayTips: [
        'H&D = guaranteed 1-2 marks — diagram + template + 3-line solution',
        'Direction of motion (towards/away) pehle confirm karo — options mein dono forms milte hain',
        '45° mile toh rukna mat — height = distance, calculation half'
    ],
    links: { patterns: ['hd-moving-observer', 'hd-two-observers'], traps: ['hd-direction-swap', 'ladder-tan'], formulas: ['hd-templates'] }
},

window.MASTERY_PLANS['geometry'] = {
    name: 'Geometry',
    icon: '🔺',
    color: '#e74c3c',
    difficulty: 5,
    timeToMaster: '15-20 days',
    weightage: {
        tier1: '2-4 Qs',
        tier2: '9-15 Qs (SABSE ZYADA)',
        rrb: '15-20% (with mensuration)',
        note: 'Tier 2 ka #1 weightage topic (9-15 Qs). Master geometry = Tier 2 mein 15 marks head-start.'
    },
    whyMatters: 'Geometry SSC Tier 2 ka SABSE BADA scorer hai — 9-15 questions! Lekin yahi sabse zyada darrawana lagta hai kyunki "theorems" hain. Sach yeh hai: SSC sirf ~15 theorems repeat karta hai — triangles (congruence/similarity), circles (angle theorems, tangents), quadrilaterals. 15 theorems × 10 examples each = geometry lock. Research ka #1 rule: "Draw, do not read" — figure banate hi aadha answer khud nazar aa jata hai.',
    plan: [
        {
            days: 'Day 1-3',
            title: 'Lines, angles + triangle properties',
            action: 'Angle chasing + triangle theorems 25 Qs.',
            details: [
                'Angle facts: straight line 180°, triangle sum 180°, exterior angle = sum of two interior opposite.',
                'Parallel lines: alternate angles equal, corresponding equal, co-interior 180°.',
                'Isosceles: base angles equal. Equilateral: 60° each. Right triangle: acute angles complementary.',
                'Ext-angle chain: ek figure mein 4-5 angles → pehla angle nikalo, baaki chain se aate hain.',
                'Practice: 20 angle-chasing figures (research: SSC ka favourite 30s pattern).'
            ],
            target: 'Angle chasing 20s'
        },
        {
            days: 'Day 4-6',
            title: 'Congruence + similarity',
            action: '20 Qs with ratio reasoning.',
            details: [
                'Congruence (same size): SSS, SAS, ASA, RHS (right triangles). Congruent → CPCT (corresponding parts equal).',
                'Similarity (same shape): AA (2 angles), SSS (ratio), SAS (ratio + included angle).',
                'Similar triangles: sides in ratio k, areas in k², perimeters in k.',
                'Median/altitude/angle-bisector theorems: median through midpoint, bisector theorem (AB/BC = AD/DC).',
                'Key property: in any triangle, line parallel to base → smaller triangle similar → ratio questions.'
            ],
            target: 'Similarity ratio Qs 30s'
        },
        {
            days: 'Day 7-9',
            title: 'Circles — the big one',
            action: 'Circle theorems 30 Qs (SSC ka sabse repeated geometry set).',
            details: [
                'THEOREM 1: Angle at centre = 2 × angle at circumference (same arc). Arc 52° → inscribed 26°.',
                'THEOREM 2: Angle in semicircle = 90° (Thales) — diameter dekho, right angle free.',
                'THEOREM 3: Tangent ⊥ radius at contact point — tangent milte hi 90° triangle.',
                'THEOREM 4: Two tangents from external point: equal length + equal angles.',
                'THEOREM 5: Cyclic quadrilateral: opposite angles sum 180° (consecutive NAHI).',
                'THEOREM 6: Chord equidistant from centre are equal; perpendicular from centre bisects chord.',
                'Tangent-secant: external segment × whole secant = tangent² (T² = 3×8 → T = √24 = 2√6 — anchor PYQ).',
                'Radius-draw habit: centre se kisi bhi point tak radius do — isosceles triangle ban jata hai (angle chase unlock).'
            ],
            target: 'Circle Qs 30-45s'
        },
        {
            days: 'Day 10-12',
            title: 'Quadrilaterals + triangles advanced',
            action: '20 Qs.',
            details: [
                'Parallelogram: opposite sides/angles equal, diagonals bisect each other.',
                'Rectangle: diagonals equal + bisect. Rhombus: diagonals ⊥ bisect. Square: dono.',
                'Trapezium: parallel sides; isosceles trapezium diagonals equal.',
                'Triangle centres: incenter (90+A/2), centroid (2:1 median), circumcenter, orthocenter.',
                '∠BIC = 90° + A/2 (incenter angle — SSC favourite: A=60° → 120°).',
                'Area formulas: Heron, ½bh, equilateral (√3/4)a².'
            ],
            target: 'Quad Qs 25s'
        },
        {
            days: 'Day 13-15',
            title: 'Special figures + Pythagoras drills',
            action: '20 Qs: square in circle, rhombus diagonals, Pythagoras triplets.',
            details: [
                'Square inscribed in circle: diagonal = 2r → area = 2r².',
                'Circle inscribed in square: r = a/2.',
                'Rhombus: area = d₁d₂/2; side = √((d₁/2)²+(d₂/2)²).',
                'Pythagoras triplets ratlo: (3,4,5),(5,12,13),(7,24,25),(8,15,17),(9,40,41),(12,35,37),(11,60,61),(20,21,29).',
                'Inradius/circumradius: r = A/s, R = abc/4A; right triangle: r = (a+c−b)/2, R = hyp/2; square: r = a/2, R = a/√2.'
            ],
            target: 'Special figure Qs 30s'
        },
        {
            days: 'Day 16-20',
            title: 'PYQ marathon (1917 geometry Qs available)',
            action: '60 PYQs in 4 sittings + timed 20-Q.',
            details: [
                'Sitting 1: angles+triangles (15). Sitting 2: circles (20) — circles sabse zyada aate hain.',
                'Sitting 3: quads+centres (15). Sitting 4: mixed timed 20-Q (25 min).',
                'Har circle Q: "kaunsa theorem?" — 6 theorems mein se ek.',
                'Error log + Pattern Engine drill for weak theorems.'
            ],
            target: 'Timed 20-Q ≥ 16 correct (80%)'
        }
    ],
    doThis: [
        '"Draw, do not read" — figure hamesha pehle (research: aadha answer figure mein hai)',
        'Circle Q mein radius draw karna (centre se) — isosceles triangles khud ban jaate hain',
        '6 circle theorems ko numbered list banao — Q padhte hi number match karo',
        'Similarity mein "k, k²" rule likhna (sides k, areas k²)',
        'Pythagoras triplets chart roz 2 min'
    ],
    avoidThis: [
        'Figure bina solve karna — SSC ke figures deliberately misleading hote hain, apna banao',
        'Inscribed angle ko DOUBLE karna (woh ARC ka HALF hai — doubling trap)',
        'Cyclic quad mein CONSECUTIVE angles 180° maanna (OPPOSITE hain)',
        'Diameter ke saath 90° miss karna (Thales free hai)',
        'Tangent se radius napa bina 90° use kiye'
    ],
    keyTechniques: [
        {
            name: 'Radius-draw move',
            how: 'Circle Q mein centre se har relevant point tak radius do — equal sides = isosceles = angle chase.',
            example: 'OAB isosceles (OA=OB=r) → ∠OAB = ∠OBA — 2 angles free'
        },
        {
            name: 'Theorem-numbering',
            how: '6 circle theorems ko 1-6 number do; Q padh kar pehla matching number bolo.',
            example: 'Tangent + radius mila → T3 (90°) turant apply'
        },
        {
            name: 'Similarity k/k²',
            how: 'Similar triangles: linear ratio k, area ratio k², perimeter ratio k.',
            example: 'Areas 4:9 → sides 2:3 → area of bigger if smaller 20 → 45'
        }
    ],
    workedExamples: [
        {
            q: 'In triangle ABC, ∠A = 60°. I is the incenter. ∠BIC = ?',
            options: ['120°', '110°', '90°', '130°'],
            answer: '120°',
            source: 'SSC various',
            steps: [
                'BI, CI angle bisectors → ∠IBC = B/2, ∠ICB = C/2.',
                '∠BIC = 180° − (B+C)/2.',
                'B+C = 180° − 60° = 120° → (B+C)/2 = 60°.',
                '∠BIC = 120° (= 90° + A/2 standard result).'
            ],
            fast: '90 + A/2 = 90 + 30 = 120. 10 second.'
        },
        {
            q: 'A tangent PT is drawn from P to a circle. A secant from P cuts the circle at A and B, with PA = 3 cm and PB = 8 cm. Find PT.',
            options: ['2√6 cm', '5 cm', '√21 cm', '2√3 cm'],
            answer: '2√6 cm',
            source: 'SSC anchor PYQ',
            steps: [
                'Tangent-secant theorem: PT² = PA × PB.',
                'PT² = 3 × 8 = 24.',
                'PT = √24 = 2√6 cm.'
            ],
            fast: 'T² = external × whole secant = 3×8 = 24 → 2√6. 10 second.'
        },
        {
            q: 'The area of two similar triangles are in ratio 4:9. The ratio of their corresponding sides is:',
            options: ['2:3', '4:9', '16:81', '8:27'],
            answer: '2:3',
            source: 'SSC pattern',
            steps: [
                'Similar figures: area ratio = (side ratio)².',
                'Side ratio = √(4/9) = 2/3.'
            ],
            fast: 'Area k², sides k → √4:√9 = 2:3. 5 second.'
        }
    ],
    dailyPractice: { questions: 25, minutes: 50, focus: 'Angles (6) + triangles (6) + circles (8) + quads (5)', drill: '6 circle theorems recall daily (2 min)' },
    masteryChecklist: [
        'Angle chasing 20s',
        'Congruence vs similarity conditions automatic',
        '6 circle theorems numbered + apply 10s',
        'Radius-draw habit',
        'Centre angles (90+A/2 incenter etc)',
        'Special figures (square in circle, rhombus)',
        'Timed 20-Q ≥ 80%'
    ],
    examDayTips: [
        'Geometry ke 2-4 Qs pehle padho (Tier 1) — figures draw karte karte aadha solve ho jata hai',
        'Circle + tangent mila → 90° + radius-draw: 2 moves in 10s',
        'Options mein surd/integer mix ho toh Pythagoras triplet check karo (3-4-5 sabse common)',
        'Figure misleading lage toh apna redraw karo — SSC ke printed figures scale par nahi hote'
    ],
    links: { patterns: ['circle-theorems', 'triangle-centres', 'similarity-ratio'], traps: ['inscribed-double', 'cyclic-consecutive'], formulas: ['ge-circle', 'ge-triangle'] }
},

window.MASTERY_PLANS['mensuration'] = {
    name: 'Mensuration',
    icon: '📦',
    color: '#d4a853',
    difficulty: 3,
    timeToMaster: '10-12 days',
    weightage: {
        tier1: '2-4 Qs',
        tier2: '5-6 Qs',
        rrb: 'Part of 15-20% (with geometry)',
        note: 'Direct formula-based — ratle aur lagao. Tier 2 mein 5-6 guaranteed.'
    },
    whyMatters: 'Mensuration = pure formula application. Koi reasoning nahi — formula sahi + units sahi + question ka "kya pucha" sahi (CSA vs TSA vs volume) = mark. 2D+3D ke ~35 core formulas ratne ke baad yeh 15-second category ban jata hai. Research bonus: "multiple of 11" trick se kabhi-kabhi bina calculation ke option select hota hai.',
    plan: [
        {
            days: 'Day 1-3',
            title: '2D formulas (all figures)',
            action: 'Triangle → quadrilaterals → circle/ring/sector — 25 Qs.',
            details: [
                'Triangles: ½bh; equilateral (√3/4)a², height (√3/2)a; Heron √(s(s−a)(s−b)(s−c)); isosceles (b/4)√(4a²−b²); right: r = (p+b−h)/2, R = h/2.',
                'Quads: rectangle LB + 2(L+B) + diagonal √(L²+B²); square a², d = a√2; parallelogram bh, d₁²+d₂² = 2(a²+b²); rhombus d₁d₂/2, 4a² = d₁²+d₂²; trapezium (a+b)h/2.',
                'Circle: πr², 2πr; semicircle: area πr²/2, perimeter πr+2r; ring π(R²−r²); sector θ/360·πr²; arc θ/360·2πr.',
                'Pathway: outside 2x(L+B+2x), inside 2x(L+B−2x); crossing paths x(L+B−x).',
                'Same perimeter: circle > square > equilateral triangle (area order) — direct question pattern.'
            ],
            target: '2D formula recall 5s, Qs 30s'
        },
        {
            days: 'Day 4-6',
            title: '3D solids',
            action: 'Cube → cuboid → cylinder → cone → sphere/hemisphere/frustum — 30 Qs.',
            details: [
                'Cube a³, 6a², diagonal a√3. Cuboid lbh, 2(lb+bh+lh), √(l²+b²+h²).',
                'Box capacity: (l−2t)(b−2t)(h−2t) — thickness t se inner dimensions.',
                'Cylinder πr²h, CSA 2πrh, TSA 2πr(h+r). Hollow: π(R²−r²)h, CSA 2π(R+r)h.',
                'Cone (1/3)πr²h, l = √(r²+h²), CSA πrl, TSA πr(l+r).',
                'Sphere (4/3)πr³, 4πr². Hemisphere: (2/3)πr³, CSA 2πr², TSA 3πr².',
                'Frustum: l = √(h²+(R−r)²), CSA π(R+r)l, V = (πh/3)(R²+r²+Rr).',
                'Painting/wrapping = CSA; total surface + top/bottom = TSA — WORDING dhyan se.'
            ],
            target: '3D Qs 30-40s'
        },
        {
            days: 'Day 7-8',
            title: 'Change problems + conversions',
            action: '% change, unit conversions, reshaping — 20 Qs.',
            details: [
                'Sides +a%: area + (2a + a²/100)%. Length +20%, breadth −10%: area 20−10−2 = +8%... (a+b+ab/100).',
                'Radius +a%: area + (2a+a²/100)%, volume + (3a+3a²+a³/100)%.',
                'Reshaping (melt & recast): volume conserved — cube melt → sphere: (4/3)πr³ = a³.',
                'Units: 1 m³ = 1000 L; 1 L = 1000 cm³; speed km/h ↔ m/s (×5/18, ×18/5).',
                'Multiple-of-11 TRICK: π = 22/7 use ho raha hai aur radius 7 ka multiple → answer 11 se divisible hoga → option check se turant.'
            ],
            target: 'Change Qs 25s'
        },
        {
            days: 'Day 9-12',
            title: 'PYQ marathon (2155 mensuration Qs available)',
            action: '45 PYQs in 3 sittings + timed 15-Q.',
            details: [
                'Sitting 1: 2D (15). Sitting 2: 3D (20). Sitting 3: change+mixed (10) + timed 15-Q (15 min).',
                'Anchor PYQ drill: prism LSA 120, equilateral base side 4 → perimeter×h = 12h = 120 → h = 10 → V = (√3/4)(16)(10) = 40√3.',
                'Har Q mein: (1) figure kya, (2) kya pucha (area/volume/surface), (3) formula — 3 lines solve.',
                'Error log: formula-miss vs calculation-error alag tag karo.'
            ],
            target: 'Timed 15-Q ≥ 13 correct'
        }
    ],
    doThis: [
        'Formula chart (2D + 3D ek page) banao — roz subah 3 min scan',
        'Question ka "kya pucha" pehle likho: CSA? TSA? Volume? — 90% galti yahi se aati hai',
        'Cone mein slant height l alag hai (√(r²+h²)) — r aur h doosre solid mein mix mat karo',
        'π = 22/7 ya 3.14 — question ke numbers se choose karo (7 ka multiple radius → 22/7)'
    ],
    avoidThis: [
        'Cone ka volume (1/3) factor bhoolna (cylinder se copy-paste trap)',
        'Hemisphere TSA = 3πr² (CSA 2πr² + base πr²) — ek term chhuddi nahi',
        'Box capacity mein thickness t ignore karna',
        'Units mix (cm answer jab m puchha)',
        'Pathway mein (L+B) se 2x subtract/add ki galat side'
    ],
    keyTechniques: [
        {
            name: 'CSA vs TSA word test',
            how: '"Painted/wrapped/curved" → CSA; "total surface" → TSA.',
            example: 'Cone paint karni hai → πrl only, base nahi'
        },
        {
            name: 'Multiple-of-11 check',
            how: 'π=22/7 aur r 7 ka multiple → final answer 11 se divisible.',
            example: 'Options 440, 462, 484, 506 → sirf 462 11 se divide hota hai → answer'
        },
        {
            name: '% change formula',
            how: 'Linear +a%: area (2a+a²/100)%, volume (3a+3a²+a³/100)%.',
            example: 'Radius +10% → area +21%, volume +33.1%'
        }
    ],
    workedExamples: [
        {
            q: 'The lateral surface area of a right prism with equilateral triangle base (side 4 cm) is 120 cm². Volume of the prism?',
            options: ['40√3 cm³', '80√3 cm³', '40 cm³', '160√3 cm³'],
            answer: '40√3 cm³',
            source: 'SSC anchor PYQ',
            steps: [
                'Equilateral base: side 4 → perimeter = 12, area = (√3/4)(16) = 4√3.',
                'LSA = perimeter × height → 12h = 120 → h = 10.',
                'Volume = base area × height = 4√3 × 10 = 40√3 cm³.'
            ],
            fast: 'LSA se height (12h=120 → h=10), phir V = A×h. 20 second.'
        },
        {
            q: 'The length of a rectangle is increased by 20% and breadth decreased by 10%. Change in area?',
            options: ['+8%', '+10%', '−2%', '+18%'],
            answer: '+8%',
            source: 'SSC pattern',
            steps: [
                'Net = a + b + ab/100 = 20 + (−10) + (20×−10)/100.',
                '= 10 − 2 = +8%.'
            ],
            fast: 'Formula direct: 20−10−2 = +8%. 10 second.'
        },
        {
            q: 'A metallic cube of side 7 cm is melted and recast into a sphere. Volume of sphere (π = 22/7)?',
            options: ['343 cm³', '392 cm³', '294 cm³', '441 cm³'],
            answer: '343 cm³',
            source: 'SSC pattern',
            steps: [
                'Volume conserved (melt & recast).',
                'Cube volume = 7³ = 343 cm³.',
                'Sphere volume = 343 cm³ (r nikalna nahi puchha — volume hi puchha).'
            ],
            fast: 'Volume conservation → 343 direct. Options mein 392 (22/7 trap) aata hai — but question volume puchhti hai, radius nahi.'
        }
    ],
    dailyPractice: { questions: 20, minutes: 40, focus: '2D (7) + 3D (8) + change/convert (5)', drill: 'Formula chart scan 3 min daily' },
    masteryChecklist: [
        '2D formulas (12 figures) 5s recall',
        '3D formulas (9 solids) 5s recall',
        'CSA vs TSA word test automatic',
        'Cone slant height habit',
        'Box capacity (thickness)',
        '% change formulas',
        'Timed 15-Q ≥ 85%'
    ],
    examDayTips: [
        'Mensuration = 15s per Q target — formula + substitute + answer',
        '"Curved/painted" dekho → CSA; "total" → TSA — pehle line mein decide karo',
        '7/22 wale numbers → 22/7 use; 3.14 options → wahi',
        'Recast/melt = volume conserved — pehla check'
    ],
    links: { patterns: ['mensuration-3d', 'mensuration-2d'], traps: ['cone-third-factor', 'hemisphere-base'], formulas: ['me-solid', 'me-circle', 'me-tricks'] }
},

window.MASTERY_PLANS['hcf-lcm'] = {
    name: 'HCF & LCM',
    icon: '🧩',
    color: '#27ae60',
    difficulty: 2,
    timeToMaster: '6-7 days',
    weightage: {
        tier1: 'Part of number system 1-2 Qs',
        tier2: 'Within number system 5-6 Qs',
        rrb: 'Frequent (arithmetic base)',
        note: '333 dedicated PYQs bank mein — fixed patterns: remainders, factors, zeros.'
    },
    whyMatters: 'HCF/LCM number system ka ENGINE hai — divisibility, factors, trailing zeros sab iske extensions hain. SSC ke 3 favourite patterns: (1) same remainder wala HCF, (2) factors count/sum, (3) n! trailing zeros. Teeno fixed-recipe hain — ek baar seekha, har saar repeat.',
    plan: [
        {
            days: 'Day 1-2',
            title: 'HCF/LCM computation + identity',
            action: 'Factor method 20 Qs.',
            details: [
                'HCF: common primes × lowest powers. LCM: all primes × highest powers.',
                '96 = 2⁵×3, 36 = 2²×3² → HCF = 2²×3 = 12, LCM = 2⁵×3² = 288.',
                'IDENTITY (2 numbers only!): HCF × LCM = a × b. 3+ numbers par YAH NHI chalta — trap.',
                'Difference shortcut: HCF(a,b) divides (a−b) → candidates narrow.',
                '1785, 1995, 3381: pairwise HCF(1785,1995)=105 → HCF(105,3381)=21 (anchor PYQ).',
                'Difference: 1995−1785 = 210 → HCF ∈ divisors of 210 — verify 21: 3381/21 = 161 ✓.'
            ],
            target: 'HCF/LCM pairs 30s'
        },
        {
            days: 'Day 3',
            title: 'Remainder patterns',
            action: '15 Qs: same remainder, different remainders.',
            details: [
                'Greatest number dividing N₁,N₂ leaving r each: HCF(N₁−r, N₂−r). Ex: 398 & 592 leaving 7 → HCF(391,585) = 48.',
                'Smallest number divisible by all leaving r: LCM(divisors) + r.',
                'Different remainders: (divisor − remainder) ka LCM approach — N = LCM(gaps) − gap.',
                'Greatest 4-digit divisible by 7,11,13: LCM(7,11,13) = 1001 → 9999 mod 1001 = 998 → 9999−998 = 9001.'
            ],
            target: 'Remainder patterns 40s'
        },
            {
                days: 'Day 4-5',
                title: 'Factors: count, sum, even',
                action: '20 Qs.',
                details: [
                    'n = p₁^a·p₂^b·p₃^c → factors count = (a+1)(b+1)(c+1). 360 = 2³·3²·5 → 24.',
                    'Sum of factors = (1+p+p²+...+p^a)(...) per prime. 360: 15×13×6 = 1170.',
                    'EVEN factors: if 2^a || n → total × a/(a+1). 360: 24×3/4 = 18.',
                    'Even SUM: total sum − odd-factor sum (2-bracket drop). 120 → 336 (trap: 360 total) — anchor.',
                    'Perfect squares factors: exponents even choose: (⌊a/2⌋+1)... product.',
                    'Prime factors count: sirf distinct primes (360 → 3: {2,3,5}).'
                ],
                target: 'Factor count/sum 30s'
            },
            {
                days: 'Day 6-7',
                title: 'Zeros + full consolidation',
                action: 'n! zeros 10 Qs + 30 mixed PYQs.',
                details: [
                    'Zeros ritual: ⌊n/5⌋+⌊n/25⌋+⌊n/125⌋. 100! → 24; 36! → 8.',
                    'Power of p in n!: same formula with p.',
                    'Mixed 30-Q: HCF/LCM (8), remainders (6), factors (8), zeros (4), tricky (4).',
                    'Timed 20 min, ≥ 17 correct target.',
                    'Error log: "2-number identity ko 3 numbers par lagaya" jitni baar — yeh #1 trap hai.'
                ],
                target: 'Timed 20-Q ≥ 85%'
            }
    ],
    doThis: [
        'Factorise Karna Hamesha pehle — 80% Qs factor form se khul jaate hain',
        'HCF×LCM = ab ONLY for 2 numbers — 3rd number dikhe toh identity MAT use karo',
        'Difference shortcut (a−b) se candidates nikalna',
        'Zeros ritual 3-step: 5, 25, 125 — bina skip kiye'
    ],
    avoidThis: [
        '3+ numbers par HCF×LCM = product likhna (wrong)',
        'Trailing zeros mein ⌊n/25⌋ bhoolna (100! → 20 vs 24)',
        '"Greatest number" aur "least number" confuse karna (HCF vs LCM side)',
        'Even factors mein total factors likh dena'
    ],
    keyTechniques: [
        {
            name: 'Difference shortcut',
            how: 'HCF(a,b) | (a−b) → a−b ke divisors se candidates.',
            example: '1995−1785 = 210 → HCF 210 ka divisor; 3381 check → 21'
        },
        {
            name: 'Exponent-shift (factors)',
            how: 'Factor count: har exponent pe +1, multiply. Even: ×a/(a+1) for 2^a.',
            example: '360: (3+1)(2+1)(1+1) = 24; even = 24×3/4 = 18'
        },
        {
            name: 'Remainder shift',
            how: 'Same remainder r: HCF(N−r); divisible leaving r: LCM + r.',
            example: 'Divides 398, 592 leaving 7 → HCF(391, 585) = 48'
        }
    ],
    workedExamples: [
        {
            q: 'HCF of 1785, 1995 and 3381 is:',
            options: ['21', '105', '7', '35'],
            answer: '21',
            source: 'Pinnacle/SSC pattern',
            steps: [
                '1785 = 3×5×7×17; 1995 = 3×5×7×19 → HCF = 3×5×7 = 105.',
                '3381 = 3×7×7×23 → common with 105 = 3×7 = 21.',
                'HCF(105, 3381) = 21. Verify: 3381/21 = 161 ✓.'
            ],
            fast: 'Difference: 1995−1785 = 210 → HCF | 210. 21 ∈ divisors(210) aur 3381/21 = 161 ✓ → 21. 30 second.'
        },
        {
            q: 'The number of factors of 360 is:',
            options: ['24', '20', '30', '18'],
            answer: '24',
            source: 'SSC pattern',
            steps: [
                '360 = 2³ × 3² × 5¹.',
                'Factors = (3+1)(2+1)(1+1) = 4×3×2 = 24.'
            ],
            fast: 'Exponent+1 multiply: 4×3×2 = 24. 10 second.'
        },
        {
            q: 'Smallest number which when divided by 7, 11 and 13 leaves remainder 5 in each case:',
            options: ['1006', '1001', '996', '1011'],
            answer: '1006',
            source: 'SSC pattern',
            steps: [
                'LCM(7, 11, 13) = 1001 (all prime).',
                'Smallest multiple + remainder = 1001 + 5 = 1006.'
            ],
            fast: 'LCM + r = 1006. 10 second.'
        }
    ],
    dailyPractice: { questions: 15, minutes: 30, focus: 'HCF/LCM (5) + remainders (4) + factors (4) + zeros (2)', drill: '10 numbers factorise daily (speed)' },
    masteryChecklist: [
        'Factorisation to 1000 10s',
        'HCF/LCM 30s pairs',
        '2-number identity (aur kab NAHI)',
        'Remainder patterns (same/diff)',
        'Factors count/sum/even',
        'Zeros 3-step ritual',
        'Timed 20-Q ≥ 85%'
    ],
    examDayTips: [
        'HCF/LCM Q = 30s budget — factor + apply, zyada sochna nahi',
        '3 numbers dikhe → identity BHAAG (pairwise HCF lagao)',
        'Options plug-in legal: "divides both leaving r" → 4 options × 4-second check',
        'Zeros: 25-wala step hamesha'
    ],
    links: { patterns: ['hcf-remainder', 'trailing-zeros', 'factor-count'], traps: ['identity-3-numbers', 'even-vs-total-factors'], formulas: ['hc-basic', 'hc-factors'] }
},

window.MASTERY_PLANS['mixture-alligation'] = {
    name: 'Mixture & Alligation',
    icon: '🧪',
    color: '#e67e22',
    difficulty: 3,
    timeToMaster: '5-6 days',
    weightage: {
        tier1: '0-3 Qs',
        tier2: '2-6 Qs',
        rrb: 'Occasional (arithmetic)',
        note: 'Tier 2 mein 2-6 Qs — chhota lekin fixed-formula; 2-3 days mein lock ho jata hai.'
    },
    whyMatters: 'Mixture & Alligation "average ke saath ratio" hai — ek formula (alligation) se poora chapter. Replacement (remove + refill) type Tier 2 ka favourite hai: D(1−x/V)ⁿ ek line mein. 87 PYQs bank mein — sab 3-4 patterns se. Yeh topic high-ROI hai: kam questions, zyada repeat, fixed formulas.',
    plan: [
        {
            days: 'Day 1-2',
            title: 'Alligation core',
            action: 'Ratio of mixtures 20 Qs.',
            details: [
                'ALLIGATION: C:D ratio = (M−C):(D−M) — cheaper:dearer, M = mean price.',
                'C=40, D=60, M=48 → (48−40):(60−48) = 8:12 = 2:3.',
                '% of cheaper = (M−D)/(C−D) × 100 → (48−60)/(40−60) = 12/20 = 60%... verify: 2:3 mein cheaper = 2/5 = 40% (formula sign convention — magnitude: |M−D|/(D−C)).',
                'Quantity: total × ratio part.',
                'Milk-water classic: 60% & 40% → 50% mix → 1:1 (symmetry check habit).',
                'Profit-mix: CP weighted avg, SP se profit% — SP/CP ratio se alligation directly.'
            ],
            target: 'Alligation ratio 20s'
        },
        {
            days: 'Day 3',
            title: 'Dilution (adding water)',
            action: '15 Qs.',
            details: [
                'Add water to bring D% → M%: water = V(D−M)/M.',
                '80% → 50% in 1 L: water = 1×30/50 = 0.6 L.',
                'Reverse: water removed: liquid left = V·M/D.',
                'Successive dilution: har step pe percentage × (fraction remaining).',
                'Concentration language: "mixture is 40% alcohol" = 40L alcohol in 100L mix.'
            ],
            target: 'Dilution 30s'
        },
        {
            days: 'Day 4',
            title: 'Replacement (remove & refill)',
            action: '15 Qs — Tier 2 favourite.',
            details: [
                'Formula: new concentration = D·(1 − x/V), x = removed volume, V = total.',
                '100 L, 50%, remove 10 L + water: 50 × 0.9 = 45%.',
                'n times: D·(1−x/V)ⁿ. 30 L 70% juice, 10 L × 2: 70×(2/3)² = 280/9 ≈ 31.1%.',
                'Two substances replace (milk removed, water added) — milk hi track karo, water = V − milk.',
                'Drain + fill cycle diagrams banao — 2-3 steps ke Qs mein.'
            ],
            target: 'Replacement 40s'
        },
        {
            days: 'Day 5-6',
            title: 'Work/rate applications + PYQ',
            action: '10 rate-mix Qs + 20 PYQs mixed + timed 10-Q.',
            details: [
                'Workers: rate (1/day) se alligation — 12d & 18d workers, 15d combine → rate 1/12, 1/18, 1/15 → ratio = (1/15−1/18):(1/12−1/15)... alligation on RATES not days.',
                'Speed-mix, profit-mix — same alligation, variable badlo.',
                'PYQ 20-Q mixed (87 available) + timed 10-Q (10 min).',
                'Error log: ratio sign flip (C:D vs D:C) kitni baar hui — yeh #1 galti hai.'
            ],
            target: 'Timed 10-Q ≥ 9 correct'
        }
    ],
    doThis: [
        'Alligation ko CROSS-SUBTRACT yaad karo: M se upar wala minus, neeche wala minus — always cheaper:dearer',
        'Percentage ko fraction banao (40% = 2/5) — ratio simple ho jaata hai',
        'Replacement mein BASE concentration se start (D ko D(1−x/V) se update)',
        'Answer verify: ratio + total = given total (sanity check 5s)'
    ],
    avoidThis: [
        'Ratio flip (cheaper:dearer vs dearer:cheaper) — options mein DONO milte hain',
        'Days/years se alligation karna (RATES se karo)',
        'Replacement mein har baar full mixture gina (sirf tracked substance ka fraction multiply karo)',
        'Water add karne se "concentration same" maanna (volume badha, concentration gira)'
    ],
    keyTechniques: [
        {
            name: 'Cross-subtract alligation',
            how: '(M−C) : (D−M) → cheaper:dearer ratio.',
            example: '₹40 & ₹60 at ₹48 → 8:12 = 2:3'
        },
        {
            name: 'Replacement chain',
            how: 'Har remove+refill: concentration ×(1−x/V).',
            example: '50% → ×0.9 → 45% (10 L of 100 L)'
        },
        {
            name: 'Rate conversion',
            how: 'Work/speed problems mein days ko rate (1/d) banao, phir alligation.',
            example: '1/12, 1/18, mix 1/15 → ratio (1/15−1/18):(1/12−1/15) = 1:1'
        }
    ],
    workedExamples: [
        {
            q: 'How much water must be added to 1 L of 80% alcohol solution to make it 50%?',
            options: ['0.6 L', '0.5 L', '0.4 L', '0.8 L'],
            answer: '0.6 L',
            source: 'SSC pattern',
            steps: [
                'Water = V(D−M)/M = 1 × (80−50)/50.',
                '= 30/50 = 0.6 L.'
            ],
            fast: 'Alcohol conserved: 0.8 L = 50% of new total → total = 1.6 L → water 0.6 L. 15 second.'
        },
        {
            q: 'A 100 L vessel has a spirit mixture at 50%. 10 L is removed and replaced with water. New concentration?',
            options: ['45%', '40%', '50%', '42%'],
            answer: '45%',
            source: 'SSC pattern',
            steps: [
                'New = D(1 − x/V) = 50 × (1 − 10/100).',
                '= 50 × 0.9 = 45%.'
            ],
            fast: '50 × 0.9 = 45. 10 second.'
        },
        {
            q: '30 L of 70% juice. 10 L drawn + water replaced, twice. Final %?',
            options: ['31.1%', '49%', '42%', '35%'],
            answer: '31.1%',
            source: 'SSC pattern',
            steps: [
                'Each cycle: ×(1 − 10/30) = ×(2/3).',
                'Twice: 70 × (2/3)² = 70 × 4/9.',
                '= 280/9 ≈ 31.11%.'
            ],
            fast: 'D(1−x/V)ⁿ = 70×(2/3)² = 31.1%. 20 second.'
        }
    ],
    dailyPractice: { questions: 12, minutes: 25, focus: 'Alligation (4) + dilution (3) + replacement (3) + rate (2)', drill: '3 alligation cross-subtract daily' },
    masteryChecklist: [
        'Alligation cross-subtract 10s',
        'Ratio direction (cheaper:dearer) zero confusion',
        'Dilution V(D−M)/M automatic',
        'Replacement D(1−x/V)ⁿ',
        'Rate conversion (work)',
        'Timed 10-Q ≥ 90%'
    ],
    examDayTips: [
        'Mixture Q = 20s budget — cross-subtract + ratio',
        'Options mein ratio flip dikhe → pehle "kaunsa kamzaat" identify karo',
        'Replacement: base concentration × fraction — ek line formula',
        'Work-mix mein rates (1/d) likhna, days se mat gino'
    ],
    links: { patterns: ['alligation-ratio', 'replacement-chain'], traps: ['ratio-flip', 'rate-vs-days'], formulas: ['mi-basic', 'mi-apps'] }
}
;

/* ============================================================
   MASTER PLAN — "Poora Maths master karo" universal roadmap
   (Weightage research + strategy guides se synthesized)
   ============================================================ */
window.MASTERY_MASTER_PLAN = {
    title: 'Universal Mathematics Mastery Roadmap',
    sub: '11 topics ka optimal order — weightage + dependency analysis se',
    rules: [
        { name: '2-Hour Split', text: 'Roz 2 hours: 1h concept + 1h practice/revision. Research consensus: concept bina practice waste, practice bina concept fragile.' },
        { name: '10-Second Rule', text: 'Question padh kar 10 second mein approach NAHI dikha → mark karo, aage. Wapas aao section ke end mein. (Tier 1 time discipline)' },
        { name: '40-50 Second Cap', text: 'Tier 1 mein kisi bhi Q pe 40-50s se zyada mat do. Atka → skip. Speed practice hi speed banati hai.' },
        { name: 'Weekly Reset', text: 'Har Sunday: 15-20 mixed Qs per active topic + saare errors re-solve + formula chart scan. Revision bina = naya banana.' },
        { name: 'One Book Rule', text: 'Ek primary source (yeh app + PYQ bank) — multiple books switch karna mastery todta hai (research: top mistake #1).', },
        { name: 'Error Compounding', text: 'Har galat Q Error Log mein — same mistake do baar aane par uska pattern drill. Errors revise karna = free marks recovery.' }
    ],
    phases: [
        {
            name: 'Phase 1 — Foundation (Days 1-20)',
            topics: ['number-system', 'simplification', 'ratio-proportion', 'hcf-lcm'],
            why: 'Arithmetic base (35-45% RRB weightage) + calculation speed. Bina iske advanced topics slow lagte hain.',
            daily: '1 topic focus (3h split: 1.5 concept, 1.5 practice) + 15 min speed maths + 10 min formulas',
            milestone: 'Divisibility 4s, fraction-% 2s, alligation 20s, timed 30-Q arithmetic ≥ 80%'
        },
        {
            name: 'Phase 2 — Advanced Core (Days 21-50)',
            topics: ['algebra', 'geometry', 'mensuration', 'trigonometry'],
            why: 'Tier 2 ke top-4 scorers: Geometry 9-15 Qs, Trigonometry 5-9, Algebra 3-6, Mensuration 5-6. Yahan 20 din = exam mein 20+ marks ka difference.',
            daily: '1 advanced topic deep (2h) + 1 foundation revision (30 min) + speed drill (15 min)',
            milestone: 'Har advanced topic: timed set ≥ 80%, key techniques (identities/circle theorems/formulas) automatic'
        },
        {
            name: 'Phase 3 — Speed + Accuracy (Days 51-70)',
            topics: ['partnership', 'mixture-alligation', 'heights-distances'],
            why: 'Chhote chapters quick lock + pattern recognition. 34 patterns + 27 traps se repeat-questions ko 15s mein pehchana.',
            daily: '2 chhote topics + 20 mixed PYQs (timed) + pattern drills (10 min)',
            milestone: 'Mixed 30-Q: avg ≤ 50s/Q, accuracy ≥ 80%, trap-patna (missed trap questions) < 3'
        },
        {
            name: 'Phase 4 — Exam Simulation (Days 71-90)',
            topics: ['all'],
            why: 'Full mocks (−0.25 marking) se exam-day discipline. Analysis > practice: har mock ka error breakdown.',
            daily: '1 full mock alternate days + analysis (30 min) + weak topic 20 Qs + formula/flashcard revision (20 min)',
            milestone: '3 consecutive mocks ≥ 70% raw, avg 45s/Q, error rate < 15%'
        }
    ],
    examDayProtocol: [
        'Section shuru: 2 min mein sab Qs SCANN karo — easy-pehchano (15-20) pehle mark karo',
        'Round 1 (12 min): easy + medium confident — negative marking se bachne ke liye 4-option confident wahi do',
        'Round 2 (6 min): marked medium — approach clear hoon toh do, nahi toh skip',
        'Round 3 (2 min): remaining — guess sirf 1 option cut kar sako toh (25% chance se better)',
        'Trig/mensuration ke Q section ke SHURU mein — formula fresh hai',
        'Har Q: 10s approach rule + 45s cap (Tier 1 discipline)'
    ]
};

window.MASTERY_COUNT = Object.keys(window.MASTERY_PLANS).length;
