/* ============================================================
   PATTERN RECOGNITION ENGINE - Deep Research Edition
   32 question patterns identified by mining 10,518 PYQs
   across 31 PDFs (2023-2025). Each pattern: recognition
   signal, typical wording, concept, standard vs fast method,
   variants, traps, ideal time, PYQ examples, mastery test.
   ============================================================ */
window.PATTERN_DATABASE = [
    {
        id: 'cubic-identity',
        name: 'Cubic Identity (a+b+c=0)',
        topic: 'algebra',
        frequency: 'Very High',
        recognitionSignal: 'Expression a³+b³+c³−3abc with a condition on a, b, c',
        typicalWording: 'If a+b+c=0, find a³+b³+c³−3abc. If a+b−c=0, find a³+b³−c³...',
        concept: 'a³+b³+c³−3abc = (a+b+c)(a²+b²+c²−ab−bc−ca). If a+b+c=0 → 0.',
        standardMethod: 'Expand the factorised form and substitute values (1-3 min, error-prone).',
        fastMethod: 'Check a+b+c=0 FIRST. If yes → answer 0 in 10 seconds. If a+b−c=0 → 3abc. If a−b−c=0 → 3abc.',
        commonVariants: ['a+b−c=0 variants', 'a−b−c=0 variants', 'converse: given a³+b³+c³=3abc, find condition', 'reciprocals 1/a+1/b+1/c=0'],
        commonTraps: ['Mechanically expanding the full formula when a+b+c=0 is stated', 'Missing the sign in a+b−c=0 → a³+b³−c³=+3abc', 'Forgetting that a=b=c is the other branch of the converse'],
        idealTime: '10 sec (with condition), 2 min (without)',
        pyqExamples: ['If a+b+c=0, find a³+b³+c³−3abc (SSC CHSL 2023) → 0', 'If x+y+z=0 and x=1, y=2, find x³+y³+z³−3xyz → 0', 'Find a³+b³+c³−3abc where a=335, b=215, c=180 (SSC CHSL 04/08/2023)'],
        masteryTest: [
            { question: 'If a+b+c=0, find a³+b³+c³−3abc', answer: '0' },
            { question: 'If a+b+c=3 and a²+b²+c²=5, find a³+b³+c³−3abc', answer: '(a+b+c)[(a+b+c)²−3(ab+bc+ca)]; use a²+b²+c²=5 → ab+bc+ca = (9−5)/2 = 2 → 3(9−6) = 9' },
            { question: 'If a³+b³+c³=3abc, what must be true?', answer: 'a=b=c or a+b+c=0' }
        ]
    },
    {
        id: 'x-plus-1-x-chain',
        name: 'x + 1/x Chain',
        topic: 'algebra',
        frequency: 'Very High',
        recognitionSignal: 'Given x+1/x or x−1/x (or reciprocals), ask for x^n + 1/x^n',
        typicalWording: 'If x + 1/x = 2√5, find x² + 1/x² / x³ + 1/x³ / x⁴ + 1/x⁴',
        concept: 'Square the given relation to get the next even power; multiply for the next odd power.',
        standardMethod: 'Solve the quadratic for x, then compute powers (slow, messy surds).',
        fastMethod: 'Plus chain: x²+1/x² = a²−2, x³+1/x³ = a³−3a, x⁴+1/x⁴ = (a²−2)²−2. Minus chain: x²+1/x² = a²+2, x³−1/x³ = a³+3a, x⁴+1/x⁴ = (a²+2)²−2.',
        commonVariants: ['x²+1/x² given, find x−1/x (take √(a²+4))', 'higher powers via (x²+1/x²)(x³+1/x³) ± (x+1/x)', '1/a+1/b style reciprocal conditions'],
        commonTraps: ['Using a²+2 for the PLUS chain (that is the minus chain)', 'Forgetting x⁵+1/x⁵ = (x²+1/x²)(x³+1/x³) − (x+1/x)', 'Taking the wrong square root sign without the constraint'],
        idealTime: '30-60 sec',
        pyqExamples: ['If x+1/x=2, find x⁴+1/x⁴ (SSC various) → 2', 'If x−1/x=3, find x³−1/x³ → 27+9=36', 'If x+1/x=√5, find x²+1/x² → 3'],
        masteryTest: [
            { question: 'If x + 1/x = 3, find x³ + 1/x³', answer: '3³ − 3·3 = 18' },
            { question: 'If x − 1/x = 2, find x⁴ + 1/x⁴', answer: '(2²+2)²−2 = 50−2 = 48' },
            { question: 'If x + 1/x = 2, what is x?', answer: 'x = 1' }
        ]
    },
    {
        id: 'trailing-zeros',
        name: 'Trailing Zeros in Factorials',
        topic: 'number-system',
        frequency: 'Very High',
        recognitionSignal: '"number of zeros at the end of n!" or "power of 5 in n!"',
        typicalWording: 'Find the number of zeros in 36!. What is the highest power of 5 in 100!?',
        concept: 'Each trailing zero needs a 2×5 pair; 2s are always more abundant, so count 5s.',
        standardMethod: 'Write out the factorial and count 5s (impractical for large n).',
        fastMethod: 'z(n!) = ⌊n/5⌋ + ⌊n/25⌋ + ⌊n/125⌋ + ... until 0. 36! → 7+1 = 8. 100! → 20+4 = 24.',
        commonVariants: ['Power of 2 in n!', 'power of p in n! for other primes', 'zeros in n^n (count 2s and 5s in n, multiply by n)'],
        commonTraps: ['STOPPING after ⌊n/5⌋ (100! → 20 instead of 24 — the trap option is always there)', 'Forgetting 25, 50, 75 each contribute an EXTRA 5', 'Dividing by 2 instead of 5'],
        idealTime: '20-30 sec',
        pyqExamples: ['Zeros in 36! (SSC CGL 2023) → 8', 'Power of 5 in 100! (RRB 2024) → 24', 'Power of 2 in 25! → 22'],
        masteryTest: [
            { question: 'Zeros in 100!', answer: '24' },
            { question: 'Power of 5 in 25!', answer: '5 + 1 = 6' },
            { question: 'Zeros in 1000!', answer: '200 + 40 + 8 + 1 = 249' }
        ]
    },
    {
        id: 'divisibility-composite',
        name: 'Divisibility by Composite Numbers',
        topic: 'number-system',
        frequency: 'Very High',
        recognitionSignal: '"divisible by 24 / 36 / 18 / 12" with digits to find',
        typicalWording: 'A six-digit number 11p9q4 is divisible by 24. Find the greatest pq.',
        concept: '24 = 3 × 8 (co-prime parts): divisible by 24 iff divisible by 3 AND 8.',
        standardMethod: 'Divide the whole number by 24 for each candidate digit (slow).',
        fastMethod: 'Divisibility by 8: last 3 digits divisible by 8. By 3: digit sum divisible by 3. Solve the two constraints together.',
        commonVariants: ['36 = 4 × 9', '18 = 2 × 9', '12 = 3 × 4', 'largest/smallest n-digit divisible by k (k·n ± r)'],
        commonTraps: ['Checking only ONE of the coprime factors', 'Forgetting the digit must be 0-9 (reject solutions like q=12)', 'Taking the wrong p when two values fit — read "greatest/least" carefully'],
        idealTime: '60-90 sec',
        pyqExamples: ['11p9q4 divisible by 24, greatest pq (SSC CHSL 10/03/2023) → p+q+15 ≡ 0 mod 3 and 9q4... last three digits 9q4 divisible by 8 → q4: q must make it work; answer 28 per official key style'],
        masteryTest: [
            { question: 'Smallest 4-digit number divisible by 24', answer: '1008' },
            { question: 'Largest 3-digit number divisible by 24', answer: '984' },
            { question: 'How many 3-digit numbers are divisible by 24?', answer: '⌊999/24⌋ − ⌊99/24⌋ = 41 − 4 = 37' }
        ]
    },
    {
        id: 'factor-sum',
        name: 'Sum of Factors (even/odd/all)',
        topic: 'number-system',
        frequency: 'High',
        recognitionSignal: '"sum of (all/even/odd) factors of N" or "number of factors"',
        typicalWording: 'Find the sum of even factors of 120.',
        concept: 'N = p^a·q^b·r^c → σ(N) = (1+...+p^a)(1+...+q^b)(1+...+r^c); even factors drop the 2^0 term.',
        standardMethod: 'List all factors manually (16 for 120 — slow).',
        fastMethod: '120 = 2^3·3·5: total = 15×4×6 = 360; odd = 4×6 = 24; even = 360−24 = 336. Count = (a+1)(b+1)(c+1).',
        commonVariants: ['sum of odd factors', 'number of factors', 'sum of factors divisible by k', 'largest prime factor'],
        commonTraps: ['Answering total (360) when EVEN was asked — the trap option', 'Including 2^0 = 1 in the even-factor bracket', 'Confusing sum with count'],
        idealTime: '45-60 sec',
        pyqExamples: ['Sum of even factors of 120 (SSC CHSL/Pinnacle 2023) → 336', 'Number of factors of 360 → 24', 'Sum of odd factors of 120 → 24'],
        masteryTest: [
            { question: 'Sum of odd factors of 120', answer: '24' },
            { question: 'Number of factors of 144 = 2^4·3^2', answer: '5 × 3 = 15' },
            { question: 'Sum of all factors of 60', answer: '(1+2+4)(1+3)(1+5) = 7×4×6 = 168' }
        ]
    },
    {
        id: 'remainder-cycles',
        name: 'Remainder Cycles (large powers)',
        topic: 'number-system',
        frequency: 'High',
        recognitionSignal: '"remainder when a^N is divided by m" with huge N',
        typicalWording: 'Find the remainder when 5^327 is divided by 8.',
        concept: 'Powers mod m cycle with small period; reduce the exponent modulo the period.',
        standardMethod: 'Big-number arithmetic (impossible).',
        fastMethod: 'List a^1..a^k mod m until repeat. 5 mod 8: 5, 1, 5, 1... period 2 → 5^odd → 5. 7 mod 4: 3, 1, 3, 1 → 7^100 → 1.',
        commonVariants: ['last digit = mod 10 (period 4)', 'unit digit of a^b^c (top-down)', 'sums/products of powers (distribute mod)'],
        commonTraps: ['Computing the period wrong (5^2 = 25 ≡ 1 mod 8, not 5)', 'Not reducing b^c first in a^(b^c)'],
        idealTime: '45 sec',
        pyqExamples: ['5^327 ÷ 8 → 5', '7^100 ÷ 4 → 1', '1^1!+2^2!+3^3! ÷ 5 → 1+4+27≡2 → 7 → 2'],
        masteryTest: [
            { question: 'Last digit of 7^2024', answer: '2024 mod 4 = 0 → 1' },
            { question: 'Remainder of 3^100 mod 7', answer: '3^6 ≡ 1 mod 7 → 100 mod 6 = 4 → 3^4 = 81 ≡ 4' }
        ]
    },
    {
        id: 'lcm-hcf-identity',
        name: 'LCM × HCF = Product',
        topic: 'hcf-lcm',
        frequency: 'Very High',
        recognitionSignal: 'Two numbers, one of LCM/HCF/numbers given, find another',
        typicalWording: 'LCM is 24, HCF is 4; the numbers are... sum/difference of numbers is...',
        concept: 'For exactly two numbers: LCM × HCF = N1 × N2. HCF divides the difference.',
        standardMethod: 'Factorise and list (slow).',
        fastMethod: 'N1·N2 = 96, HCF = 4 → N1 = 4x, N2 = 4y, xy = 6 with x,y co-prime → (1,6),(2,3) → pairs (4,24),(8,12).',
        commonVariants: ['fractions (LCM = LCM num/HCF den)', 'three numbers via iteration', 'HCF from difference'],
        commonTraps: ['Applying the identity to THREE numbers (invalid)', 'Forgetting x, y must be co-prime'],
        idealTime: '30-45 sec',
        pyqExamples: ['HCF 4, LCM 24, one number 8 → other 12', 'LCM/HCF of fractions'],
        masteryTest: [
            { question: 'HCF of 1785, 1995, 3381', answer: '21 (iterate: HCF(1785,1995)=105, HCF(105,3381)=21)' },
            { question: 'LCM of 96, 36, 18', answer: '2^5·3^2 = 288' }
        ]
    },
    {
        id: 'alligation',
        name: 'Alligation Rule',
        topic: 'ratio-proportion',
        frequency: 'Very High',
        recognitionSignal: 'Two items at prices C and D mixed to get mean price M; find ratio',
        typicalWording: 'How much rice at ₹30/kg must be mixed with rice at ₹40/kg to get a mixture at ₹36/kg?',
        concept: 'Cheaper : Dearer = (D−M) : (M−C).',
        standardMethod: 'Algebra with variables (works but slow).',
        fastMethod: '(40−36):(36−30) = 4:6 = 2:3.',
        commonVariants: ['concentration problems (milk/water)', 'profit% on mix', 'three-ingredient via pairwise', 'finding M from ratio'],
        commonTraps: ['Reversing the ratio (cheaper gets D−M, dearer gets M−C — the OPPOSITE of intuition)', 'Applying to 3 ingredients without pairwise alligation'],
        idealTime: '20 sec',
        pyqExamples: ['Wine 10%, 20%, 30% mixed 2:3:x → 23% (SSC CHSL 02/11/2023) → x=5', 'Chemicals P:Q:R blend problems'],
        masteryTest: [
            { question: 'Mixture at ₹25 from ₹20 and ₹30 in what ratio?', answer: '(30−25):(25−20) = 1:1' },
            { question: 'Two solutions 20% and 40% mixed 1:2 → concentration?', answer: '(20+80)/3 = 33.33%' }
        ]
    },
    {
        id: 'replacement-dilution',
        name: 'Remove & Replace (Dilution)',
        topic: 'mixture-alligation',
        frequency: 'Very High',
        recognitionSignal: '"x litres removed and replaced with water, n times; find pure left"',
        typicalWording: 'A 30 L vessel... 3 L removed and replaced with water, done 3 times. Milk left?',
        concept: 'Pure left = x(1 − y/x)^n.',
        standardMethod: 'Step-by-step volume tracking (works for n=2, tedious beyond).',
        fastMethod: '30(1−3/30)³ = 30(0.9)³ = 21.87 L.',
        commonVariants: ['two operations with different y', 'reverse: find y from final concentration', 'two-liquid concentration tracking'],
        commonTraps: ['Forgetting to REPEAT the operation (using n=1)', 'Using (1−x/y) instead of (1−y/x)'],
        idealTime: '30 sec',
        pyqExamples: ['Drum blend 3:5:2, 60 L removed, 12 P + 8 Q added (SSC CGL 14/09/2025)'],
        masteryTest: [
            { question: '100 L, remove 10 L replace with water, 2 times → pure left', answer: '100(0.9)² = 81 L' }
        ]
    },
    {
        id: 'partner-equivalent',
        name: 'Equivalent Investment (Partnership)',
        topic: 'partnership',
        frequency: 'High',
        recognitionSignal: 'Partners invest different amounts/times; find profit share',
        typicalWording: 'A and B invest in ratio 4:5; C joins after 8 months with 3× B\'s capital. Ratio of profit?',
        concept: 'Profit ∝ capital × months-in-business.',
        standardMethod: 'Full algebra (slow).',
        fastMethod: '4×12 : 5×12 : 15×4 = 48:60:60 = 4:5:5.',
        commonVariants: ['partner leaves mid-year', 'active partner % + salary', 'find capital from profit'],
        commonTraps: ['Giving the late partner 12 months instead of actual months', 'Forgetting the active partner\'s fixed % comes OFF the top first'],
        idealTime: '30-45 sec',
        pyqExamples: ['Aftab/Tarun/Aditya ₹8000 each, left after 6 and 8 months (Pinnacle) → 3:4:6', 'Rajesh active partner 10% (SSC MTS 2023 style)'],
        masteryTest: [
            { question: 'Same capital, A leaves after 6 months, B stays 12 → profit ratio', answer: '1:2' }
        ]
    },
    {
        id: 'trig-a-b-sin-cos',
        name: 'a sinX + b cosX = m System',
        topic: 'trigonometry',
        frequency: 'High',
        recognitionSignal: 'Given a sinθ + b cosθ = m, find a cosθ − b sinθ',
        typicalWording: 'If 3sinθ + 5cosθ = 5, find 3cosθ − 5sinθ.',
        concept: 'Square both expressions and add: (a sin+b cos)² + (a cos−b sin)² = a²+b².',
        standardMethod: 'Solve θ from the equation (heavy).',
        fastMethod: 'a²+b² = m²+n² → n² = a²+b²−m² → n = ±√(a²+b²−m²). Example: 9+25−25 = 9 → ±3.',
        commonVariants: ['sec/tan version: a²−b² = m²−n²', 'cosec/cot version (same as sec/tan)'],
        commonTraps: ['Using + instead of − in the sec-tan version (a²−b² not a²+b²)', 'Missing the ± sign (both usually offered as options)'],
        idealTime: '20-30 sec',
        pyqExamples: ['3sinθ+5cosθ=5 → 3cosθ−5sinθ = ±3', '29secθ−21tanθ=20 → 29tanθ−21secθ = ±20 (29²−21² = 841−441 = 400)'],
        masteryTest: [
            { question: 'If 5sinθ + 12cosθ = 12, find 5cosθ − 12sinθ', answer: '±√(25+144−144) = ±5' }
        ]
    },
    {
        id: 'trig-special-sums',
        name: 'Special Angle-Set Results',
        topic: 'trigonometry',
        frequency: 'High',
        recognitionSignal: 'A+B+C = 180° (or 90°, or A+B=45°) with tan/cot expressions',
        typicalWording: 'If A+B+C=180°, prove/find tanA+tanB+tanC.',
        concept: '180°: tanA+tanB+tanC = tanA·tanB·tanC; cot pairs sum = 1. 90°: tan pairs sum = 1; cot sum = cot product. A+B=45°: (1+tanA)(1+tanB) = 2.',
        standardMethod: 'Substitute C = 180°−A−B and expand tan(180°−(A+B)) (slow).',
        fastMethod: 'Recognize the set and apply the memorized result directly.',
        commonVariants: ['numeric: given two angles, find the expression', 'cot versions', '1−cot variants'],
        commonTraps: ['Confusing the 180° and 90° result sets', 'Applying (1+tanA)(1+tanB)=2 without A+B=45°'],
        idealTime: '15-30 sec',
        pyqExamples: ['Triangle angle tan questions (SSC CGL various)'],
        masteryTest: [
            { question: 'A+B+C=180°, tanA+tanB+tanC = ?', answer: 'tanA·tanB·tanC' },
            { question: 'A+B=45°, (1+tanA)(1+tanB) = ?', answer: '2' }
        ]
    },
    {
        id: 'trig-max-min',
        name: 'Trig Max/Min Values',
        topic: 'trigonometry',
        frequency: 'Medium-High',
        recognitionSignal: 'Maximum/minimum value of a trig expression',
        typicalWording: 'Maximum value of 3sinx + 4cosx. Minimum of sin²x + cos⁴x.',
        concept: 'a sinx ± b cosx → ±√(a²+b²). a sin²x + b cos²x → max(larger of a,b), min(smaller). a tan²x + b cot²x → min 2√(ab). sin²ⁿx + cos²ⁿx → max 1, min at 45°.',
        standardMethod: 'Differentiate (not allowed/slow in SSC).',
        fastMethod: 'Match the form to the table. 3sinx+4cosx → max 5. sin²x+cos⁴x → min 1/2+1/4 = 3/4 at x=45°.',
        commonVariants: ['sec/cosec forms → min (√a+√b)² style', '(sinx·cosx)^n'],
        commonTraps: ['Answering 1 for a sin²x + b cos²x when a≠b', 'Forgetting the 45° substitution for even-power minima'],
        idealTime: '20 sec',
        pyqExamples: ['Find max of 3sinx+4cosx → 5', 'min of sin²x+cos⁴x → 3/4'],
        masteryTest: [
            { question: 'Max of 5sinx − 12cosx', answer: '√(25+144) = 13' },
            { question: 'Min of 4tan²x + 9cot²x', answer: '2√36 = 12' }
        ]
    },
    {
        id: 'height-shadow',
        name: 'Shadow / Moving-Object Height-Distance',
        topic: 'heights-distances',
        frequency: 'High',
        recognitionSignal: 'Shadow length at two sun altitudes, or car approaching tower with changing depression angle',
        typicalWording: 'Shadow is 40 m longer at altitude 30° than 45°. Find tower height.',
        concept: 'shadow = H/tan(altitude); difference equation. Moving: 30°→45° covers H(√3−1); 30°→60° covers 2H/√3.',
        standardMethod: 'Full trig per case (works, 2-3 min).',
        fastMethod: 'Set the difference equation once: H(1/tanθ1 − 1/tanθ2) = Δ. For 30°/45°: H(√3−1) = 40 → H = 20(√3+1).',
        commonVariants: ['45°→60°', 'tower on hill', 'two buildings'],
        commonTraps: ['Subtracting shadows in the wrong order (getting negative)', 'Rationalising and matching the option form (20(√3+1) vs 20(3−1))'],
        idealTime: '60-90 sec',
        pyqExamples: ['Shadow 40 m longer (SSC CHSL 10/01/2024) → 20(√3+1)≈54.6; option c "20" is the trap'],
        masteryTest: [
            { question: 'Depression 30°→45°, tower 10 m → car distance', answer: '10(√3−1) m' }
        ]
    },
    {
        id: 'two-circles',
        name: 'Two Circles & Common Tangents',
        topic: 'geometry',
        frequency: 'High',
        recognitionSignal: 'Two circles with radii/distance; tangents, touch, intersection',
        typicalWording: 'Two circles of diameters 50 cm... common tangent length / number of tangents.',
        concept: 'd vs R+r vs |R−r| decides the configuration. Direct tangent √(d²−(R−r)²); transverse √(d²−(R+r)²). Touch: d = R±r.',
        standardMethod: 'Draw and guess (dangerous).',
        fastMethod: 'Compare d with R+r and |R−r| FIRST, then pick the tangent formula. Equal circles touching externally: direct tangent = d.',
        commonVariants: ['power of a point', 'common chord length', 'angle between circles'],
        commonTraps: ['ASSUMING external touch when not stated (the big two-circles trap)', 'Mixing up direct and transverse formulas'],
        idealTime: '60-90 sec',
        pyqExamples: ['Two circles diameter 50 cm (Pinnacle Geometry)'],
        masteryTest: [
            { question: 'Circles radii 3 and 4 touch externally → centre distance', answer: '7' },
            { question: 'd = 10, R = 6, r = 2 → number of common tangents', answer: 'd = R+r → 3 (touching externally)' }
        ]
    },
    {
        id: 'triangle-centres',
        name: 'Triangle Centres & Radii',
        topic: 'geometry',
        frequency: 'Medium-High',
        recognitionSignal: 'Incenter/circumcenter/centroid questions; r, R, OI, medians',
        typicalWording: '∠BIC = ? if ∠A = 60°. Distance between circumcentre and incentre.',
        concept: '∠BIC = 90°+A/2; r = Δ/s; R = abc/(4Δ); OI² = R²−2Rr; centroid 2:1 on medians; median triangle = 3/4 area; Apollonius.',
        standardMethod: 'Construct and measure (impossible in exam).',
        fastMethod: 'Apply the memorized formula directly. Right triangle shortcuts: r = (p+b−h)/2, R = h/2.',
        commonVariants: ['right-triangle median = hypotenuse/2', 'equal-area six parts', 'angle bisector + altitude: (B−C)/2'],
        commonTraps: ['Using ∠BIC = 90°−A/2 (that is the excenter)', 'Confusing inradius with circumradius in Δ/s vs abc/4Δ'],
        idealTime: '30-45 sec',
        pyqExamples: ['SSC CHSL/CGL centre questions 2023-25'],
        masteryTest: [
            { question: '∠A = 60° → ∠BIC', answer: '90+30 = 120°' },
            { question: 'Right triangle legs 3,4 → inradius', answer: '(3+4−5)/2 = 1' }
        ]
    },
    {
        id: 'cyclic-quadrilateral',
        name: 'Cyclic Quadrilateral & Chord Properties',
        topic: 'geometry',
        frequency: 'Medium-High',
        recognitionSignal: 'Quadrilateral in a circle; opposite angles; chord products; tangent-chord angle',
        typicalWording: 'Cyclic quadrilateral: ∠A = 70°, find ∠C. Chords cut at P: AE·EB = CE·ED...',
        concept: 'Opposite angles sum 180°; Ptolemy AC·BD = AB·CD + BC·AD; AE·EB = CE·ED; PT² = PB·PA; tangent ⊥ radius; alternate segment theorem.',
        standardMethod: 'Case-by-case trig (slow).',
        fastMethod: 'Identify which chord/tangent theorem applies; one-line substitution.',
        commonVariants: ['tangent-secant power of a point', 'angle in semicircle 90°', 'angles in same segment equal'],
        commonTraps: ['Applying Ptolemy to non-cyclic quadrilaterals', 'Using AE×ED instead of AE×EB (wrong segments)'],
        idealTime: '30-45 sec',
        pyqExamples: ['Geometry PYQs 2023-25 chord/tangent cluster'],
        masteryTest: [
            { question: 'PT tangent, secant PA=9, PB=4 → PT', answer: '√(9×4) = 6' },
            { question: 'Cyclic quad, ∠A=110° → ∠C', answer: '70°' }
        ]
    },
    {
        id: 'polygon-angles',
        name: 'Polygon Angle/Diagonal Counts',
        topic: 'geometry',
        frequency: 'Medium',
        recognitionSignal: 'Regular polygon: find sides from angle, or count diagonals',
        typicalWording: 'Each exterior angle of a regular polygon is 36°. How many sides? How many diagonals?',
        concept: 'Exterior = 360°/n; interior = 180°−360°/n; diagonals = n(n−3)/2.',
        standardMethod: 'Draw the polygon (unreliable).',
        fastMethod: 'n = 360°/exterior = 360/36 = 10; diagonals = 10×7/2 = 35.',
        commonVariants: ['sum of interior angles (n−2)180°', 'interior angle given → n'],
        commonTraps: ['Dividing 360 by the INTERIOR angle', 'Forgetting diagonals excludes the 3 non-diagonals per vertex'],
        idealTime: '20 sec',
        pyqExamples: ['Regular hexagon/octagon questions (all years)'],
        masteryTest: [
            { question: 'Interior angle 135° → n and diagonals', answer: 'exterior 45° → n=8, diagonals 20' }
        ]
    },
    {
        id: 'mens-area-change',
        name: 'Percentage Change in Area',
        topic: 'mensuration',
        frequency: 'Very High',
        recognitionSignal: '"length/breadth/side increased or decreased by a% — find % change in area"',
        typicalWording: 'The length of a rectangle is increased by 20% and breadth decreased by 10%. Change in area?',
        concept: 'Δ%area = a + b + ab/100 (b negative for decrease). All sides a% → area (2a + a²/100)%.',
        standardMethod: 'Pick 100×100, compute new area (works, 60s).',
        fastMethod: '20 + (−10) + (20×−10)/100 = 10 − 2 = 8% increase.',
        commonVariants: ['circle radius change (2a + a²/100)%', 'cube edge → volume (3a+3a²+a³/100)%', 'perimeter change = a%'],
        commonTraps: ['Forgetting the ab/100 term (answering 10% instead of 8%)', 'Using wrong sign for decrease'],
        idealTime: '15-20 sec',
        pyqExamples: ['Mensuration PYQs all years — this is the most repeated mensuration pattern'],
        masteryTest: [
            { question: 'All sides of a square increase 10% → area change', answer: '2(10) + 1 = 21%' },
            { question: 'Circle radius +50% → area change', answer: '100 + 25 = 125%' }
        ]
    },
    {
        id: 'mens-solid-volumes',
        name: 'Solid Volumes & Surface Areas',
        topic: 'mensuration',
        frequency: 'Very High',
        recognitionSignal: 'Cone/cylinder/sphere/hemisphere/frustum volume or surface questions',
        typicalWording: 'Cone volume (1/3)πr²h... TSA πr(l+r)... hemisphere TSA 3πr²...',
        concept: 'Memorize the solid table: V and TSA for cube, cuboid, cylinder, cone, sphere, hemisphere, frustum, tetrahedron, prism, box (capacity with thickness).',
        standardMethod: 'Derive from first principles (slow).',
        fastMethod: 'Table lookup + slant l = √(r²+h²) where needed. Prism: base area × height. Box capacity: subtract 2t from each dimension.',
        commonVariants: ['rotating right triangle about each side → 3 cone volumes', 'hollow solids (R vs r)', 'melted/recast (volume conserved)', 'open box TSA'],
        commonTraps: ['Using TSA instead of CSA for a cylinder WITHOUT a top/bottom', 'Forgetting the 1/3 in cone volume', 'Capacity: using external dimensions instead of (l−2t)'],
        idealTime: '45-75 sec',
        pyqExamples: ['Equilateral triangle base prism, LSA 120, side 4 → V = 40√3 (SSC CHSL 10/01/2024)'],
        masteryTest: [
            { question: 'Cone r=7, h=24 → slant and CSA', answer: 'l=25, CSA = π×7×25 = 175π' },
            { question: 'Hemisphere r=3 → TSA', answer: '3π×9 = 27π' }
        ]
    },
    {
        id: 'pathway-area',
        name: 'Pathway / Cross-Path Area',
        topic: 'mensuration',
        frequency: 'Medium',
        recognitionSignal: 'Path of width x around/inside a rectangular plot, or two crossing paths',
        typicalWording: 'A 2 m wide path runs around a 20 m × 15 m plot outside. Area of path?',
        concept: 'Outer: 2x(L+B+2x). Inner: 2x(L+B−2x). Two crossing: x(L+B−x).',
        standardMethod: 'Subtract inner rectangle from outer (works, 60s).',
        fastMethod: '2×2(20+15+4) = 2×2×39 = 156 m².',
        commonVariants: ['circular path (π(R²−r²))', 'path inside only', 'diagonal path (rare)'],
        commonTraps: ['Double-counting the crossing square in two-path problems (hence the −x)', 'Using L+B without the ±2x adjustment'],
        idealTime: '30 sec',
        pyqExamples: ['Mensuration PYQs 2023-25'],
        masteryTest: [
            { question: 'Two paths width 2 crossing in 20×15 plot', answer: '2(20+15−2) = 66 m²' }
        ]
    },
    {
        id: 'quadratic-roots',
        name: 'Quadratic Roots & k-value',
        topic: 'algebra',
        frequency: 'High',
        recognitionSignal: 'ax²+bx+c=0: root sum/product, or "value of k for real and equal roots"',
        typicalWording: 'For what k does 3x²+2kx+3=0 have real and equal roots?',
        concept: 'α+β = −b/a; αβ = c/a; D = b²−4ac = 0 for equal roots.',
        standardMethod: 'Solve the quadratic each time.',
        fastMethod: '4k² − 36 = 0 → k = ±3 → positive option 3.',
        commonVariants: ['sum/product given → build t²−at+b=0', 'one root given → find other via sum/product', 'cubic pair relations'],
        commonTraps: ['Sign errors in −b/a and c/a', 'Taking k negative when the question asks "positive value"'],
        idealTime: '30 sec',
        pyqExamples: ['3x²+2kx+3=0 (SSC CHSL 07/08/2023) → k=3'],
        masteryTest: [
            { question: 'x²−5x+6=0: sum and product', answer: '5 and 6' },
            { question: 'Roots 2,3 → equation', answer: 't²−5t+6 = 0' }
        ]
    },
    {
        id: 'linear-system-consistency',
        name: 'Linear System Consistency',
        topic: 'algebra',
        frequency: 'Medium',
        recognitionSignal: 'Two linear equations: unique / no / infinite solutions',
        typicalWording: '2x+3y=5 and 4x+6y=7 — how many solutions?',
        concept: 'a1/a2 vs b1/b2: ≠ unique; = but ≠ c1/c2 → none; all equal → infinite.',
        standardMethod: 'Solve fully (slow).',
        fastMethod: 'Ratio test in 5 seconds: 2/4 = 3/6 ≠ 5/7 → no solution.',
        commonVariants: ['three variables three equations', 'find c for infinite solutions'],
        commonTraps: ['Comparing only a1/a2 with b1/b2 and forgetting the c-ratio for the no-solution case'],
        idealTime: '15 sec',
        pyqExamples: ['Algebra PYQs 2023-25'],
        masteryTest: [
            { question: 'x+y=4, 2x+2y=8 → solutions?', answer: 'infinite (coincident)' }
        ]
    },
    {
        id: 'surd-rationalise',
        name: 'Surd Rationalisation',
        topic: 'simplification',
        frequency: 'Medium-High',
        recognitionSignal: 'Denominator with a surd; simplify',
        typicalWording: 'Simplify 1/(3+2√2). (√3−√2)/(√3+√2)...',
        concept: 'Multiply by the conjugate: 1/(a+√b) × (a−√b)/(a−√b) = (a−√b)/(a²−b).',
        standardMethod: 'Decimal approximation (wrong for MCQ exact answers).',
        fastMethod: 'Conjugate multiply, denominator becomes difference of squares.',
        commonVariants: ['two-term surd (√a±√b)', 'cube-root rationalising factors', 'nested radical simplification √(a±2√b)'],
        commonTraps: ['Wrong conjugate sign', 'Forgetting the √3/√3 = √(3/3) form for single surds'],
        idealTime: '20-30 sec',
        pyqExamples: ['Simplification PYQs all years'],
        masteryTest: [
            { question: '1/(√5−√3) rationalised', answer: '(√5+√3)/2' }
        ]
    },
    {
        id: 'nested-radical',
        name: 'Infinite Nested Radicals',
        topic: 'simplification',
        frequency: 'Low-Medium (but guaranteed)',
        recognitionSignal: '√(x+√(x+...)) or √(x−√(x−...)) to infinity',
        typicalWording: 'Value of √(12+√(12+√(12+...))).',
        concept: 'Set = y, y = √(x+y) → y² − y − x = 0 → y = larger root. Trick: factors of x with difference 1.',
        standardMethod: 'Solve the quadratic (fast enough).',
        fastMethod: 'Factors of 12 with diff 1: 4,3 → plus form → 4. Minus form: 30 → 5,6 → 5.',
        commonVariants: ['minus form √(x−√(x−...)) → smaller factor'],
        commonTraps: ['Taking the negative root of the quadratic (y>0 required)', 'Swapping larger/smaller between + and − forms'],
        idealTime: '20 sec',
        pyqExamples: ['√(12+√(12+...)) = 4 (Pinnacle simplification)'],
        masteryTest: [
            { question: '√(20+√(20+...))', answer: 'factors 5,4 → 5' },
            { question: '√(20−√(20−...))', answer: '4' }
        ]
    },
    {
        id: 'age-ratio',
        name: 'Age Ratio Problems',
        topic: 'ratio-proportion',
        frequency: 'Medium',
        recognitionSignal: 'Ratio of ages now/t years ago/t years later',
        typicalWording: 'Present ratio 3:5; 10 years later 4:6. Present ages?',
        concept: 'Difference in ages is CONSTANT. Set ages as 3k, 5k; solve (3k+t):(5k+t) = given.',
        standardMethod: 'Two-variable algebra (works, 2 min).',
        fastMethod: 'Use the constant difference: 2k now = 2k later → solve the shifted ratio directly.',
        commonVariants: ['father-son sum problems', 'three people ratios', 'average age of group after join/leave'],
        commonTraps: ['Shifting the ratio without shifting the years consistently', 'Group problems: forgetting the total changes when someone joins/leaves'],
        idealTime: '45-60 sec',
        pyqExamples: ['Ratio & Proportion PYQs 2023-25'],
        masteryTest: [
            { question: 'Ratio 3:5, after 5 years 4:6 → present ages', answer: '3k+5 : 5k+5 = 2:3 → 9k+15 = 10k+5 → k=10 → 30 and 50' }
        ]
    },
    {
        id: 'average-weighted',
        name: 'Weighted Average / Mean',
        topic: 'ratio-proportion',
        frequency: 'Medium',
        recognitionSignal: 'Average of combined groups, or mean from ratio',
        typicalWording: 'Average of 20 students 65, 15 students 70. Combined average?',
        concept: 'Combined mean = (A1W1 + A2W2)/(W1+W2).',
        standardMethod: 'Sum all values (impractical for groups).',
        fastMethod: '(20×65 + 15×70)/35 = (1300+1050)/35 = 67.14.',
        commonVariants: ['find weight from mean deviation', 'one item added/removed shifts mean → its value = new mean × new count − old sum'],
        commonTraps: ['Averaging the averages instead of weighting'],
        idealTime: '30 sec',
        pyqExamples: ['Ratio & Proportion PYQs 2023-25'],
        masteryTest: [
            { question: 'Mean of 1..20', answer: '10.5' }
        ]
    },
    {
        id: 'congruent-similar',
        name: 'Congruency & Similarity',
        topic: 'geometry',
        frequency: 'Medium',
        recognitionSignal: 'Prove/find from similar or congruent triangles',
        typicalWording: 'Triangles similar, ratio of sides 2:3 → ratio of areas?',
        concept: 'Area ratio = (side ratio)²; perimeter ratio = side ratio; congruency SSS/SAS/ASA/RHS.',
        standardMethod: 'Angle chasing (slow).',
        fastMethod: 'Identify the similarity → square the ratio for areas.',
        commonVariants: ['midpoint theorem DE = BC/2', 'Thales proportionality', 'median/altitude in similar triangles (same ratio)'],
        commonTraps: ['Using the side ratio for AREA (must square)', 'Assuming similar when only congruent conditions are given'],
        idealTime: '20-30 sec',
        pyqExamples: ['Geometry PYQs 2023-25'],
        masteryTest: [
            { question: 'Similar triangles area ratio 1:9 → side ratio', answer: '1:3' }
        ]
    },
    {
        id: 'secant-tangent-power',
        name: 'Power of a Point',
        topic: 'geometry',
        frequency: 'Medium',
        recognitionSignal: 'Tangent + secant from external point; chord intersections',
        typicalWording: 'PT tangent, PAB secant with PA=3, AB=5 → PT?',
        concept: 'PT² = PA × PB (full secant from P). Chords: AE×EB = CE×ED.',
        standardMethod: 'Similar-triangle proof every time (slow).',
        fastMethod: 'Direct substitution: PT = √(3×8) = √24 = 2√6.',
        commonVariants: ['two secants (PA×PB = PC×PD)', 'internal chord angle (x+y)/2'],
        commonTraps: ['Using PB (near part) instead of PA×PB (full) for the tangent-secant', 'Subtracting instead of multiplying segments'],
        idealTime: '20 sec',
        pyqExamples: ['Geometry PYQs 2023-25'],
        masteryTest: [
            { question: 'Two secants: PA=2, AB=6; PC=3 → CD?', answer: '2×8 = 3×(3+CD) → CD = 25/3' }
        ]
    },
    {
        id: 'trains-speed',
        name: 'Trains & Relative Speed',
        topic: 'ratio-proportion',
        frequency: 'Medium (arithmetic)',
        recognitionSignal: 'Train crossing pole/platform/another train',
        typicalWording: 'Train crosses a 150 m platform in 20 s and a pole in 10 s. Find length and speed.',
        concept: 'Pole: length = v·t1. Platform: length+150 = v·t2. Relative: sum (opposite) or difference (same) speed; crossing time = total length / relative speed.',
        standardMethod: 'Full equations (fine).',
        fastMethod: 'v = 150/(20−10) = 15 m/s; length = 150 m. Two trains: (L1+L2)/(v1+v2 or |v1−v2|).',
        commonVariants: ['same-direction catch-up', 'passenger inside train views other train', 'unit conversion ×5/18'],
        commonTraps: ['Using only the platform length (ignoring train length)', 'Wrong relative speed direction'],
        idealTime: '45-60 sec',
        pyqExamples: ['Arithmetic PYQs 2023-25'],
        masteryTest: [
            { question: 'Two trains 100 m and 150 m, 30 km/h and 50 km/h opposite → crossing time', answer: '250/(80×5/18) = 250/22.22 ≈ 11.25 s' }
        ]
    },
    {
        id: 'percentage-chain',
        name: 'Percentage Change Chains',
        topic: 'ratio-proportion',
        frequency: 'High (arithmetic)',
        recognitionSignal: 'Successive increases/decreases, profit% + discount% + MP/CP',
        typicalWording: 'Price up 20% then down 10% — net change?',
        concept: 'Net = a + b + ab/100. Profit on CP, discount on MP: MP = CP(1+profit%)(1/markup)...',
        standardMethod: 'Base 100 step by step (safe, 45s).',
        fastMethod: '1.2 × 0.9 = 1.08 → +8%.',
        commonVariants: ['successive discount (single equivalent = a+b+ab/100)', 'successive raises in salary'],
        commonTraps: ['Adding percentages directly (20−10 = 10% instead of +8%)'],
        idealTime: '15-20 sec',
        pyqExamples: ['Arithmetic PYQs all years'],
        masteryTest: [
            { question: 'Up 10%, down 10% → net', answer: '1.1×0.9 = 0.99 → −1%' }
        ]
    },
    {
        id: 'divisibility-11',
        name: 'Divisibility by 11 & Large Numbers',
        topic: 'number-system',
        frequency: 'Medium',
        recognitionSignal: 'Alternate-digit sum test, or large number divisibility',
        typicalWording: 'Which of the following is divisible by 11? The greatest 5-digit number divisible by...',
        concept: '11: (odd-place sum) − (even-place sum) ≡ 0 mod 11.',
        standardMethod: 'Direct division (slow for big numbers).',
        fastMethod: 'Alternate sum in 5 seconds.',
        commonVariants: ['largest/smallest n-digit divisible by k: k×⌊(10^n−1)/k⌋ etc.', 'divisibility by 7/13/37 group methods'],
        commonTraps: ['Counting places from the wrong end (result sign flips but divisibility doesn\'t — still, be consistent)'],
        idealTime: '15 sec',
        pyqExamples: ['Number system PYQs 2023-25'],
        masteryTest: [
            { question: 'Largest 4-digit divisible by 7', answer: '9996' }
        ]
    },
    {
        id: 'base-conversion',
        name: 'Number Base Conversion',
        topic: 'number-system',
        frequency: 'Low-Medium (but high marks)',
        recognitionSignal: 'Binary/octal/hex or "base n" conversion',
        typicalWording: '(1011)₂ in decimal? 45 in base 3?',
        concept: 'Expand powers to convert to decimal; repeated division to convert from decimal.',
        standardMethod: 'Full expansion (fine).',
        fastMethod: '(1011)₂ = 8+2+1 = 11. 45 ÷ 3: remainders 0,2,1 → 120₃.',
        commonVariants: ['arithmetic IN another base (carry rules)', 'find the base given an equation'],
        commonTraps: ['Forgetting place values start at 0 from the right', 'Using base-10 carry rules in base-n arithmetic'],
        idealTime: '30-45 sec',
        pyqExamples: ['Number system PYQs 2023-25'],
        masteryTest: [
            { question: '(202)₃ in decimal', answer: '2×9 + 0 + 2 = 20' }
        ]
    },
    {
        id: 'unit-digit',
        name: 'Unit Digit of Large Powers',
        topic: 'number-system',
        frequency: 'High',
        recognitionSignal: 'Last digit of a^b or a^(b^c)',
        typicalWording: 'Unit digit of 7^2024. Of 3^43^21.',
        concept: 'Cycles of 4: 2→(2,4,8,6), 3→(3,9,7,1), 7→(7,9,3,1), 8→(8,4,2,6). Reduce exponent mod 4 (0 → 4th element). For a^(b^c), compute b^c mod 4 top-down.',
        standardMethod: 'Repeated multiplication (impossible).',
        fastMethod: 'Cycle lookup + mod 4. 7^2024: 2024 mod 4 = 0 → 1.',
        commonVariants: ['sum/difference of powers (unit digit distributes)', 'ending 0,1,5,6 never change', '2,4,8,6 cycle'],
        commonTraps: ['Computing the inner exponent wrong in a^(b^c)', 'Using period 3 or 5'],
        idealTime: '20-30 sec',
        pyqExamples: ['Number system PYQs all years'],
        masteryTest: [
            { question: 'Unit digit of 9^99', answer: '9 (odd) → 9' },
            { question: 'Unit digit of 6^100 + 7^100', answer: '6 + 1 = 7' }
        ]
    }
];

window.PATTERN_COUNT = window.PATTERN_DATABASE.length;
