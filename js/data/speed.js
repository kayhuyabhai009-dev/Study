/* ============================================================
   SPEED MATHS TRAINER DATA - Deep Research Edition
   8 modules. Tables/squares/cubes/roots generated at load
   time; fractions, percentages and tricks are explicit
   curated tables (the ones SSC actually asks).
   ============================================================ */
window.SPEED_MODULES = {
    tables: {
        name: 'Tables 2–20',
        desc: 'Multiplication tables. Target: any pair in <1.5s.',
        generator: function() {
            var qs = [];
            for (var a = 2; a <= 20; a++) {
                for (var b = 2; b <= 12; b++) {
                    qs.push({ q: a + ' × ' + b, a: String(a * b), type: 'table' });
                }
            }
            return qs;
        }
    },
    squares: {
        name: 'Squares 1–30',
        desc: 'Squares to 30 and their roots. Target: <2s.',
        generator: function() {
            var qs = [];
            for (var n = 1; n <= 30; n++) {
                qs.push({ q: n + '²', a: String(n * n), type: 'square' });
            }
            for (var m = 1; m <= 30; m++) {
                qs.push({ q: '√' + (m * m), a: String(m), type: 'root' });
            }
            return qs;
        }
    },
    cubes: {
        name: 'Cubes 1–15',
        desc: 'Cubes and cube roots. Target: <3s.',
        generator: function() {
            var qs = [];
            for (var n = 1; n <= 15; n++) {
                qs.push({ q: n + '³', a: String(n * n * n), type: 'cube' });
                qs.push({ q: '∛' + (n * n * n), a: String(n), type: 'cubert' });
            }
            return qs;
        }
    },
    fractions: {
        name: 'Fractions ↔ %',
        desc: 'The 40+ fraction/percent pairs SSC uses as options.',
        explicit: [
            { q: '1/2', a: '50' }, { q: '1/4', a: '25' }, { q: '3/4', a: '75' },
            { q: '1/8', a: '12.5' }, { q: '3/8', a: '37.5' }, { q: '5/8', a: '62.5' }, { q: '7/8', a: '87.5' },
            { q: '1/3', a: '33.33' }, { q: '2/3', a: '66.67' },
            { q: '1/5', a: '20' }, { q: '2/5', a: '40' }, { q: '3/5', a: '60' }, { q: '4/5', a: '80' },
            { q: '1/6', a: '16.67' }, { q: '5/6', a: '83.33' },
            { q: '1/7', a: '14.29' }, { q: '2/7', a: '28.57' }, { q: '3/7', a: '42.86' }, { q: '4/7', a: '57.14' }, { q: '5/7', a: '71.43' }, { q: '6/7', a: '85.71' },
            { q: '1/9', a: '11.11' }, { q: '2/9', a: '22.22' }, { q: '4/9', a: '44.44' }, { q: '5/9', a: '55.56' }, { q: '7/9', a: '77.78' }, { q: '8/9', a: '88.89' },
            { q: '1/11', a: '9.09' }, { q: '2/11', a: '18.18' }, { q: '3/11', a: '27.27' }, { q: '4/11', a: '36.36' }, { q: '5/11', a: '45.45' }, { q: '6/11', a: '54.55' }, { q: '7/11', a: '63.64' }, { q: '8/11', a: '72.73' }, { q: '9/11', a: '81.82' },
            { q: '1/12', a: '8.33' }, { q: '5/12', a: '41.67' }, { q: '7/12', a: '58.33' }, { q: '11/12', a: '91.67' },
            { q: '1/13', a: '7.69' }, { q: '1/16', a: '6.25' }, { q: '3/16', a: '18.75' }, { q: '5/16', a: '31.25' }, { q: '7/16', a: '43.75' }, { q: '9/16', a: '56.25' }, { q: '11/16', a: '68.75' }, { q: '13/16', a: '81.25' }, { q: '15/16', a: '93.75' }
        ],
        generator: function() {
            return this.explicit.map(function(e) { return { q: e.q + ' = ?%', a: e.a, type: 'fraction' }; });
        }
    },
    percentages: {
        name: 'Quick % of numbers',
        desc: '10/20/25/50/75/33/66% of exam-style numbers.',
        generator: function() {
            var qs = [];
            var bases = [120, 150, 180, 200, 240, 300, 320, 360, 400, 480, 600, 720, 800, 960];
            var fracs = [
                { label: '10%', f: 0.10 }, { label: '20%', f: 0.20 }, { label: '25%', f: 0.25 },
                { label: '50%', f: 0.50 }, { label: '75%', f: 0.75 }, { label: '30%', f: 0.30 },
                { label: '40%', f: 0.40 }, { label: '60%', f: 0.60 }, { label: '80%', f: 0.80 },
                { label: '15%', f: 0.15 }, { label: '35%', f: 0.35 }, { label: '65%', f: 0.65 },
                { label: '12.5%', f: 0.125 }, { label: '8.33%', f: 1/12 }
            ];
            for (var b = 0; b < bases.length; b++) {
                for (var i = 0; i < fracs.length; i++) {
                    var v = bases[b] * fracs[i].f;
                    var ans = (v % 1 === 0) ? String(v) : v.toFixed(2);
                    qs.push({ q: fracs[i].label + ' of ' + bases[b], a: ans, type: 'percent' });
                }
            }
            return qs;
        }
    },
    multiplication: {
        name: 'Smart Multiplication',
        desc: 'Near-100, ×11, ×9, ×5 tricks. Target: <4s.',
        generator: function() {
            var qs = [];
            // ×11
            for (var n = 12; n <= 28; n++) qs.push({ q: n + ' × 11', a: String(n * 11), type: 'mult' });
            // ×9
            for (var m = 13; m <= 24; m++) qs.push({ q: m + ' × 9', a: String(m * 9), type: 'mult' });
            // ×5
            for (var p = 17; p <= 34; p++) qs.push({ q: p + ' × 5', a: String(p * 5), type: 'mult' });
            // two-digit near
            var pairs = [[96, 94], [92, 98], [97, 95], [88, 92], [93, 97], [86, 94], [91, 99], [89, 95], [98, 96], [87, 93], [94, 98], [85, 95]];
            pairs.forEach(function(pr) { qs.push({ q: pr[0] + ' × ' + pr[1], a: String(pr[0] * pr[1]), type: 'mult' }); });
            return qs;
        }
    },
    division: {
        name: 'Division & Factors',
        desc: 'Clean divisions and factor recognition. Target: <4s.',
        generator: function() {
            var qs = [];
            var pairs = [
                [144, 12], [225, 15], [196, 14], [169, 13], [198, 11], [240, 16],
                [315, 15], [360, 12], [432, 24], [490, 14], [525, 15], [588, 12],
                [720, 24], [768, 16], [810, 18], [882, 21], [900, 25], [960, 32],
                [1024, 16], [1125, 25], [1152, 32], [1200, 48], [1296, 36], [1344, 28],
                [1440, 36], [1512, 28], [1536, 48], [1600, 40], [1728, 48], [1800, 75]
            ];
            pairs.forEach(function(pr) { qs.push({ q: pr[0] + ' ÷ ' + pr[1], a: String(pr[0] / pr[1]), type: 'div' }); });
            return qs;
        }
    },
    roots: {
        name: 'Square Roots (ending-digit method)',
        desc: 'Use ending digits + bracketing. Target: <5s.',
        explicit: [
            { q: '√81', a: '9' }, { q: '√121', a: '11' }, { q: '√144', a: '12' },
            { q: '√169', a: '13' }, { q: '√196', a: '14' }, { q: '√225', a: '15' },
            { q: '√256', a: '16' }, { q: '√289', a: '17' }, { q: '√324', a: '18' },
            { q: '√361', a: '19' }, { q: '√441', a: '21' }, { q: '√484', a: '22' },
            { q: '√529', a: '23' }, { q: '√576', a: '24' }, { q: '√625', a: '25' },
            { q: '√676', a: '26' }, { q: '√729', a: '27' }, { q: '√784', a: '28' },
            { q: '√841', a: '29' }, { q: '√961', a: '31' }, { q: '√1024', a: '32' },
            { q: '√1089', a: '33' }, { q: '√1225', a: '35' }, { q: '√1369', a: '37' },
            { q: '√1600', a: '40' }, { q: '√2304', a: '48' }, { q: '√2809', a: '53' },
            { q: '√3721', a: '61' }, { q: '√4096', a: '64' }, { q: '√5476', a: '74' }
        ],
        generator: function() {
            return this.explicit.map(function(e) { return { q: e.q, a: e.a, type: 'root' }; });
        }
    }
};

/* Speed trick cards (shown between drills) */
window.SPEED_TRICKS = [
    '×11 trick: 47 × 11 → split 4 _ 7, add 4+7=11 in the middle (carry) → 517.',
    '×9 trick: 27 × 9 = 27 × 10 − 27 = 270 − 27 = 243.',
    '×5 trick: 43 × 5 = 43 × 10 ÷ 2 = 430 ÷ 2 = 215.',
    'Near-100: 96 × 94 = (100−4)(100−6) = 10000 − 1000 + 24 = 9024.',
    'Difference of squares: 31 × 29 = (30+1)(30−1) = 900 − 1 = 899.',
    'Percent flip: 4% of 75 = 75% of 4 = 3. Always take the easier direction.',
    '16.67% = 1/6; 8.33% = 1/12; 14.29% = 1/7 — fraction shortcuts beat decimals.',
    'Square ending 1 → root ends 1 or 9; 4 → 2 or 8; 5 → 5; 6 → 4 or 6; 9 → 3 or 7.',
    'Squares never end in 2, 3, 7, 8 — eliminate options instantly.',
    'Trailing zeros: count 5s in n! by ÷5, ÷25, ÷125 — add everything.',
    'x + 1/x = 2 → x = 1. Use it to sanity-check every chain formula.',
    'Unit digit cycles repeat every 4: check exponent mod 4 (0 means 4th in cycle).'
];
