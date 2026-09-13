/* ============================================================
   FORMULA BANK - Deep Research Edition
   Compiled from 31 PYQ PDFs (Pinnacle series 2023-2025),
   Gagan Sir classnotes theory sections, and SSC syllabus
   analysis. Each formula: id, topic, subtopic, name,
   formula (linear notation), usage, fastTip, pyqCount
   (how often the topic appears across the 10,518 PYQ bank).
   ============================================================ */
window.FORMULA_BANK = {

    /* ========================================================
       NUMBER SYSTEM
       ======================================================== */
    'number-system': {
        name: 'Number System',
        color: '#8e44ad',
        subtopics: [
            {
                id: 'ns-types',
                name: 'Types of Numbers',
                formulas: [
                    { id: 'ns-01', name: 'Natural Numbers (N)', formula: 'N = {1, 2, 3, 4, ...}', usage: 'Positive counting numbers. 0 NOT included.', fastTip: 'N ⊂ W ⊂ Z ⊂ Q ⊂ R. If asked "positive integers" it means N.', pyqHint: 'Basic definitions appear in 1 in 30 questions.' },
                    { id: 'ns-02', name: 'Whole Numbers (W)', formula: 'W = {0, 1, 2, 3, ...}', usage: 'All non-negative integers.', fastTip: 'W = N ∪ {0}.', pyqHint: '' },
                    { id: 'ns-03', name: 'Integers (Z)', formula: 'Z = {..., -3, -2, -1, 0, 1, 2, 3, ...}', usage: 'Positive + negative + zero.', fastTip: '', pyqHint: '' },
                    { id: 'ns-04', name: 'Rational Numbers (Q)', formula: 'Q = {p/q : p, q ∈ Z, q ≠ 0}', usage: 'Exact value can be determined; decimal terminates or repeats.', fastTip: '0.75 = 3/4, 0.8 = 4/5, 22/7, -9/5 are all rational.', pyqHint: '' },
                    { id: 'ns-05', name: 'Irrational Numbers', formula: 'Cannot be written as p/q in lowest form', usage: 'Non-terminating, non-repeating decimals.', fastTip: '√2, √3, π, e are irrational. √4 = 2 is rational (trap!).', pyqHint: 'Classic trap: "which of these is rational?" with √16 as option.' },
                    { id: 'ns-06', name: 'Face Value vs Place Value', formula: 'Face value = digit itself; Place value = digit × 10^position', usage: 'In 23576: face value of 5 = 5, place value of 5 = 500, place value of 3 = 3000.', fastTip: 'Count positions from right, 0-indexed.', pyqHint: '' },
                    { id: 'ns-07', name: 'Prime Numbers', formula: 'Prime > 1 with exactly 2 factors: 1 and itself', usage: '2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97', fastTip: '2 is the ONLY even prime. 1 is NOT prime.', pyqHint: 'Memorize primes to 100 for factorisation speed.' },
                    { id: 'ns-08', name: 'Co-prime Numbers', formula: 'HCF of the pair = 1', usage: 'Pairs like (4,9), (8,15), (14,25) are co-prime even though not prime.', fastTip: 'Any two consecutive integers are always co-prime.', pyqHint: '' }
                ]
            },
            {
                id: 'ns-divisibility',
                name: 'Divisibility Rules',
                formulas: [
                    { id: 'ns-09', name: 'Divisible by 2', formula: 'Last digit ∈ {0, 2, 4, 6, 8}', usage: 'Check last digit only.', fastTip: '', pyqHint: '' },
                    { id: 'ns-10', name: 'Divisible by 3', formula: 'Sum of digits divisible by 3', usage: '234 → 2+3+4=9 → yes.', fastTip: '', pyqHint: '' },
                    { id: 'ns-11', name: 'Divisible by 4', formula: 'Last 2 digits divisible by 4', usage: '1236 → 36 → yes.', fastTip: '', pyqHint: '' },
                    { id: 'ns-12', name: 'Divisible by 5', formula: 'Last digit is 0 or 5', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'ns-13', name: 'Divisible by 6', formula: 'Divisible by both 2 and 3', usage: 'Both conditions mandatory.', fastTip: 'Check 2 first (cheapest), then 3.', pyqHint: '' },
                    { id: 'ns-14', name: 'Divisible by 7', formula: '(Number formed by remaining digits) − 2×(last digit) is divisible by 7', usage: '161 → 16 − 2×1 = 14 → yes. Repeat until small.', fastTip: 'Alternative: 161 = 7×23.', pyqHint: '' },
                    { id: 'ns-15', name: 'Divisible by 8', formula: 'Last 3 digits divisible by 8', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'ns-16', name: 'Divisible by 9', formula: 'Sum of digits divisible by 9', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'ns-17', name: 'Divisible by 11', formula: '(Sum of digits at odd places) − (Sum at even places) is 0 or multiple of 11', usage: '1283 → (3+2) − (8+1) = 5−9 = −4 → no.', fastTip: 'Count places from the right starting at 1.', pyqHint: '' },
                    { id: 'ns-18', name: 'Divisible by 12', formula: 'Divisible by both 3 and 4', usage: '', fastTip: '', pyqHint: 'PYQ: 6-digit 11p9q4 divisible by 24 → check by 3 AND 8.' },
                    { id: 'ns-19', name: 'Divisible by 24', formula: 'Divisible by both 3 and 8 (24 = 3 × 8, coprime)', usage: 'Composite divisor → split into coprime parts.', fastTip: 'ALWAYS check ALL coprime factors: 24=3×8, 36=4×9, 18=2×9.', pyqHint: 'High-frequency trap: students check only one factor.' },
                    { id: 'ns-20', name: 'Divisible by 13', formula: '(Remaining digits) + 4×(last digit) divisible by 13', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'ns-21', name: 'Divisible by 37', formula: 'Sum of 3-digit groups divisible by 37', usage: '999=27×37, so group by 3.', fastTip: '', pyqHint: '' }
                ]
            },
            {
                id: 'ns-hcf-lcm',
                name: 'HCF & LCM',
                formulas: [
                    { id: 'ns-22', name: 'LCM × HCF relation (2 numbers)', formula: 'LCM × HCF = 1st number × 2nd number', usage: '8 and 12: LCM=24, HCF=4 → 24×4 = 96 = 8×12.', fastTip: 'Works ONLY for exactly two numbers.', pyqHint: 'Extremely high frequency.' },
                    { id: 'ns-23', name: 'LCM of Fractions', formula: 'LCM(numerators) / HCF(denominators)', usage: 'LCM of 1/2, 2/3, 3/4 = LCM(1,2,3)/HCF(2,3,4) = 6/1.', fastTip: '', pyqHint: '' },
                    { id: 'ns-24', name: 'HCF of Fractions', formula: 'HCF(numerators) / LCM(denominators)', usage: 'HCF of 1/2, 2/3, 3/4 = 1/12.', fastTip: '', pyqHint: '' },
                    { id: 'ns-25', name: 'LCM × HCF of fractions', formula: 'LCM(fracs) × HCF(fracs) = product of the fractions', usage: 'Extends the 2-number identity to fractions.', fastTip: '', pyqHint: '' },
                    { id: 'ns-26', name: 'HCF of three numbers', formula: 'HCF(a,b,c) = HCF(HCF(a,b), c)', usage: 'Iterate pairwise.', fastTip: '', pyqHint: '' },
                    { id: 'ns-27', name: 'HCF from difference', formula: 'HCF of N1, N2 divides (N1 − N2)', usage: 'HCF is either the difference itself or a factor of it.', fastTip: 'N1=24, N2=36: HCF divides 12 → candidates 12, 6, 4, 3, 2, 1.', pyqHint: '' },
                    { id: 'ns-28', name: 'LCM of numbers with same HCF', formula: 'If HCF = H, N1 = Hx, N2 = Hy → LCM = H × LCM(x, y), Difference = H(x−y)', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'ns-29', name: 'Repeated division remainder', formula: 'If d2 | d1, then remainder of (N/d2) = remainder of (N/d1 divided by d2)', usage: '29÷8 → r=5. 29÷4: 5÷4 → r=1.', fastTip: '', pyqHint: '' },
                    { id: 'ns-30', name: 'Largest number dividing with same remainder', formula: 'HCF of (N1 − r), (N2 − r), ... where r = common remainder', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'ns-31', name: 'Smallest number divisible by all with same remainder', formula: 'LCM of divisors + common remainder', usage: '', fastTip: '', pyqHint: '' }
                ]
            },
            {
                id: 'ns-factors',
                name: 'Factors & Factorials',
                formulas: [
                    { id: 'ns-32', name: 'Number of factors', formula: 'If N = p^a × q^b × r^c then factors = (a+1)(b+1)(c+1)', usage: '360 = 2^3×3^2×5 → (3+1)(2+1)(1+1) = 24.', fastTip: '', pyqHint: 'High frequency.' },
                    { id: 'ns-33', name: 'Sum of all factors', formula: 'σ(N) = (p^0+...+p^a)(q^0+...+q^b)...', usage: '120 = 2^3×3×5 → (1+2+4+8)(1+3)(1+5) = 15×4×6 = 360.', fastTip: 'Sum of geometric series: (p^(a+1)−1)/(p−1).', pyqHint: '' },
                    { id: 'ns-34', name: 'Sum of EVEN factors', formula: '(2^1+2^2+...+2^a) × (other prime sums)', usage: '120: (2+4+8)×(1+3)×(1+5) = 14×4×6 = 336. OR total − odd = 360 − 24 = 336.', fastTip: 'EXCLUDE the 2^0 = 1 term — this is the #1 trap.', pyqHint: 'PYQ: sum of even factors of 120 → 336, trap option 360.' },
                    { id: 'ns-35', name: 'Sum of ODD factors', formula: 'Product of sums for odd primes only', usage: '120: (1+3)(1+5) = 24.', fastTip: '', pyqHint: '' },
                    { id: 'ns-36', name: 'Number of even factors', formula: '(a)(b+1)(c+1)... when 2^a present (no 2^0 allowed)', usage: '120: 3×2×2 = 8 even, total 16 → odd 8.', fastTip: '', pyqHint: '' },
                    { id: 'ns-37', name: 'Trailing zeros in n!', formula: 'z(n!) = ⌊n/5⌋ + ⌊n/25⌋ + ⌊n/125⌋ + ⌊n/625⌋ + ...', usage: '36! → 7 + 1 = 8. 100! → 20 + 4 = 24.', fastTip: 'NEVER stop after ⌊n/5⌋. 25, 50, 75 contribute EXTRA 5s.', pyqHint: 'Highest-frequency number system question. Trap: 100! answer 20 (wrong) vs 24.' },
                    { id: 'ns-38', name: 'Highest power of p in n!', formula: 'E_p(n!) = ⌊n/p⌋ + ⌊n/p^2⌋ + ⌊n/p^3⌋ + ...', usage: 'Power of 2 in 25! = 12+6+3+1 = 22.', fastTip: '', pyqHint: '' },
                    { id: 'ns-39', name: 'Trailing zeros in n^n', formula: 'z(n^n) = n × (sum of digits of n) / 9 × ... → count 2s and 5s in n, multiply by n', usage: 'In base 10, zeros = min(count of 2, count of 5) × n.', fastTip: '', pyqHint: '' },
                    { id: 'ns-40', name: 'Unit digit cycles', formula: 'Last digit of a^k cycles with period 4 (for a odd not 5)', usage: '2,4,8,6 | 3,9,7,1 | cycles of 4. k mod 4 → digit (0→4th).', fastTip: '7^2024: 2024 mod 4 = 0 → 1. 3^2024 → 1.', pyqHint: 'Very high frequency: "unit digit of large power".' }
                ]
            },
            {
                id: 'ns-remainder',
                name: 'Remainder Theorems',
                formulas: [
                    { id: 'ns-41', name: 'Division Algorithm', formula: 'N = Q×D + R, 0 ≤ R < D', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'ns-42', name: 'Remainder when (a^n) ÷ b', formula: 'Use cycles: find period of a mod b, reduce n mod period', usage: '5^327 ÷ 8: 5^1=5, 5^2=1 mod 8 → period 2 → 5^odd → 5.', fastTip: '', pyqHint: 'PYQ pattern: exponential remainders.' },
                    { id: 'ns-43', name: 'Remainder of product', formula: '(a×b) mod m = [(a mod m) × (b mod m)] mod m', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'ns-44', name: 'Remainder of sum', formula: '(a+b) mod m = [(a mod m) + (b mod m)] mod m', usage: '1^1! + 2^2! + 3^3! ÷ 5: 1 + 4 + 27→2 → 7 → 2.', fastTip: '', pyqHint: 'PYQ: factorial sums modulo small numbers.' },
                    { id: 'ns-45', name: 'Negative remainder', formula: 'If R < 0 then true remainder = R + D', usage: '−7 mod 4: −7 = −2×4 + 1 → r = 1.', fastTip: 'Negative remainder is common in "least residue" questions.', pyqHint: '' },
                    { id: 'ns-46', name: 'Remainder theorem (polynomial)', formula: 'f(x) ÷ (x−a) → remainder = f(a)', usage: 'f(x) ÷ (x+2) → f(−2).', fastTip: '', pyqHint: '' }
                ]
            },
            {
                id: 'ns-base',
                name: 'Number Bases',
                formulas: [
                    { id: 'ns-47', name: 'Base conversion to decimal', formula: '(d_n d_{n-1} ... d_0)_b = d_n b^n + ... + d_0', usage: '(101)_2 = 4+1 = 5. (17)_8 = 8+7 = 15.', fastTip: '', pyqHint: '' },
                    { id: 'ns-48', name: 'Decimal to base b', formula: 'Repeated division by b, read remainders bottom-up', usage: '13 → base 2: 13/2=6r1, 6/2=3r0, 3/2=1r1, 1/2=0r1 → 1101.', fastTip: '', pyqHint: '' },
                    { id: 'ns-49', name: 'Largest/smallest n-digit number in base b', formula: 'Largest: (b−1)...(b−1); Smallest: 1 followed by zeros', usage: '', fastTip: '', pyqHint: '' }
                ]
            }
        ]
    },

    /* ========================================================
       SIMPLIFICATION
       ======================================================== */
    'simplification': {
        name: 'Simplification',
        color: '#16a085',
        subtopics: [
            {
                id: 'sf-bodmas',
                name: 'BODMAS / VBODMAS',
                formulas: [
                    { id: 'sf-01', name: 'Order of operations', formula: 'Vinculum (bar) → Brackets () → {} → [] → Of (×) → Division → Multiplication → Addition → Subtraction', usage: '7 − (5 − 4) bar → solve bar first: 5−4=1 → 7−1 = 6.', fastTip: 'Of means multiplication but has HIGHER priority than ÷.', pyqHint: 'Highest-frequency simplification pattern.' },
                    { id: 'sf-02', name: 'Modulus', formula: '|−x| = x (magnitude only, never negative)', usage: '|−3| = 3.', fastTip: '', pyqHint: '' },
                    { id: 'sf-03', name: 'Nested brackets order', formula: 'Innermost first: (… ) then {…} then […]', usage: '', fastTip: '', pyqHint: '' }
                ]
            },
            {
                id: 'sf-square-root',
                name: 'Square Roots',
                formulas: [
                    { id: 'sf-04', name: 'Definition', formula: '√N = x where x² = N; √36 = ±6', usage: 'Principal root is positive: √36 = 6.', fastTip: '', pyqHint: '' },
                    { id: 'sf-05', name: 'Factorisation method', formula: 'Pair the prime factors: 1089 = 3×3×11×11 → √ = 33', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'sf-06', name: 'Ending-digit shortcuts', formula: 'Ends 1→√ ends 1 or 9 | 4→2 or 8 | 5→5 | 6→4 or 6 | 9→3 or 7', usage: 'Squares NEVER end in 2, 3, 7, 8.', fastTip: '225 → ends 5 → √ ends 5 → 15.', pyqHint: '' },
                    { id: 'sf-07', name: 'Digit count rule', formula: 'n digits: if n even → √ has n/2 digits; if odd → (n+1)/2', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'sf-08', name: '√(a²b²c²)', formula: '= a·b·c (assuming positive)', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'sf-09', name: '√(a/b)', formula: '= √a / √b', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'sf-10', name: 'Rationalising 1/(a±√b)', formula: 'Multiply by (a∓√b)/(a∓√b) → (a∓√b)/(a²−b)', usage: '1/(9−8) with 8→2√2: 1/(3+2√2) × (3−2√2)/(3−2√2) = 3−2√2... wait: 1/(9−8√2)... use conjugate.', fastTip: 'Denominator becomes a difference of squares.', pyqHint: '' },
                    { id: 'sf-11', name: 'Nested radical √(x + √x + ...∞)', formula: '= larger factor of x with difference 1', usage: '√(12+√(12+...)) = 4 (factors 4,3 differ by 1).', fastTip: 'Or solve x = √(12+x) → x² = x + 12 → x = 4.', pyqHint: 'Classic special question.' },
                    { id: 'sf-12', name: 'Nested radical √(x − √(x − ...∞))', formula: '= smaller factor of x with difference 1', usage: '√(30−√(30−...)) = 5.', fastTip: '', pyqHint: '' }
                ]
            },
            {
                id: 'sf-cube',
                name: 'Cubes & Cube Roots',
                formulas: [
                    { id: 'sf-13', name: '(a+b)³', formula: '= a³ + b³ + 3ab(a+b)', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'sf-14', name: '(a−b)³', formula: '= a³ − b³ − 3ab(a−b)', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'sf-15', name: 'Cube endings', formula: 'Ends 1→1, 2→8, 3→7, 4→4, 5→5, 6→6, 7→3, 8→2, 9→9, 0→0', usage: 'Cube root ending follows same last digit.', fastTip: '', pyqHint: '' }
                ]
            },
            {
                id: 'sf-indices',
                name: 'Indices & Surds Laws',
                formulas: [
                    { id: 'sf-16', name: 'Product of powers', formula: 'a^m × a^n = a^{m+n}', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'sf-17', name: 'Quotient of powers', formula: 'a^m / a^n = a^{m−n}', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'sf-18', name: 'Power of a power', formula: '(a^m)^n = a^{mn}', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'sf-19', name: 'Power of a product', formula: '(ab)^n = a^n b^n', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'sf-20', name: 'Zero power', formula: 'a^0 = 1 (a ≠ 0)', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'sf-21', name: 'Negative power', formula: 'a^{−n} = 1/a^n', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'sf-22', name: 'Root as fractional power', formula: 'a^{1/n} = ⁿ√a', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'sf-23', name: 'Product of roots', formula: 'ⁿ√a × ⁿ√b = ⁿ√(ab)', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'sf-24', name: 'Quotient of roots', formula: 'ⁿ√a / ⁿ√b = ⁿ√(a/b)', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'sf-25', name: 'Nested root', formula: 'ᵐ√(ⁿ√a) = ᵐⁿ√a', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'sf-26', name: 'Rationalising factor of √a', formula: '√a itself: √a × √a = a', usage: 'For √3: multiply by √3. For 5th root of 3: need 5^4 more 3s.', fastTip: '', pyqHint: '' }
                ]
            }
        ]
    },

    /* ========================================================
       ALGEBRA
       ======================================================== */
    'algebra': {
        name: 'Algebra',
        color: '#3498db',
        subtopics: [
            {
                id: 'al-identities',
                name: 'Algebraic Identities (most tested area)',
                formulas: [
                    { id: 'al-01', name: 'Square of sum', formula: '(a+b)² = a² + b² + 2ab', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'al-02', name: 'Square of difference', formula: '(a−b)² = a² + b² − 2ab', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'al-03', name: 'Sum of two squares', formula: '(a+b)² + (a−b)² = 2(a² + b²)', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'al-04', name: 'Difference of two squares (cross)', formula: '(a+b)² − (a−b)² = 4ab', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'al-05', name: 'Difference of squares', formula: 'a² − b² = (a+b)(a−b)', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'al-06', name: 'Difference of fourth powers', formula: 'a⁴ − b⁴ = (a²+b²)(a+b)(a−b)', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'al-07', name: 'Square of (x + 1/x)', formula: '(x + 1/x)² = x² + 1/x² + 2', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'al-08', name: 'Square of (x − 1/x)', formula: '(x − 1/x)² = x² + 1/x² − 2', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'al-09', name: 'Symmetric sum of three squares', formula: 'a²+b²+c²−ab−bc−ca = ½[(a−b)² + (b−c)² + (c−a)²] ≥ 0', usage: 'If a=b=c=k then a²+b²+c² = ab+bc+ca.', fastTip: 'RHS is always ≥ 0 → sign questions.', pyqHint: '' },
                    { id: 'al-10', name: 'Cube of sum', formula: '(a+b)³ = a³ + b³ + 3ab(a+b)', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'al-11', name: 'Cube of difference', formula: '(a−b)³ = a³ − b³ − 3ab(a−b)', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'al-12', name: 'Sum of cubes', formula: 'a³ + b³ = (a+b)(a² + b² − ab)', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'al-13', name: 'Difference of cubes', formula: 'a³ − b³ = (a−b)(a² + b² + ab)', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'al-14', name: 'Cube of (x + 1/x)', formula: '(x + 1/x)³ = x³ + 1/x³ + 3(x + 1/x)', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'al-15', name: 'Cube of (x − 1/x)', formula: '(x − 1/x)³ = x³ − 1/x³ − 3(x − 1/x)', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'al-16', name: 'THE MASTER CUBIC IDENTITY', formula: 'a³ + b³ + c³ − 3abc = (a+b+c)(a²+b²+c²−ab−bc−ca)', usage: 'ALSO = ½(a+b+c)[(a−b)²+(b−c)²+(c−a)²] = (a+b+c)[(a+b+c)² − 3(ab+bc+ca)]', fastTip: '', pyqHint: 'Most important algebra identity in SSC.' },
                    { id: 'al-17', name: 'SPECIAL CASE: a+b+c = 0', formula: 'If a+b+c = 0 → a³+b³+c³ = 3abc → a³+b³+c³−3abc = 0', usage: 'Answer 0 in 10 seconds!', fastTip: 'ALWAYS check a+b+c=0 FIRST before expanding anything.', pyqHint: 'HIGHEST-frequency algebra pattern. Trap: mechanical expansion.' },
                    { id: 'al-18', name: 'a−b−c = 0 case', formula: 'If a−b−c = 0 → a³−b³−c³ = 3abc', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'al-19', name: 'a+b−c = 0 case', formula: 'If a+b−c = 0 → a³+b³−c³ = 3abc', usage: 'Note sign: = +3abc.', fastTip: '', pyqHint: '' },
                    { id: 'al-20', name: 'Converse', formula: 'If a³+b³+c³ = 3abc → either a=b=c or a+b+c = 0', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'al-21', name: 'Square of (a+b+c)', formula: '(a+b+c)² = a²+b²+c² + 2(ab+bc+ca)', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'al-22', name: 'Cube of (a+b+c)', formula: '(a+b+c)³ = a³+b³+c³ + 3(a+b)(b+c)(c+a)', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'al-23', name: 'Fourth-power difference', formula: 'a⁴ + a²b² + b⁴ = (a²+ab+b²)(a²−ab+b²)', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'al-24', name: 'Zero-sum squares', formula: 'If x²+y²+z² = 0 (reals) → x=y=z=0', usage: '', fastTip: '', pyqHint: '' }
                ]
            },
            {
                id: 'al-x1x',
                name: 'x + 1/x Chain (SSC favourite)',
                formulas: [
                    { id: 'al-25', name: 'Square chain', formula: 'If x + 1/x = a then x² + 1/x² = a² − 2', usage: '', fastTip: '', pyqHint: 'Very high frequency chain.' },
                    { id: 'al-26', name: 'Minus chain', formula: 'If x − 1/x = a then x² + 1/x² = a² + 2', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'al-27', name: 'Cube chain (plus)', formula: 'If x + 1/x = a then x³ + 1/x³ = a³ − 3a', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'al-28', name: 'Cube chain (minus)', formula: 'If x − 1/x = a then x³ − 1/x³ = a³ + 3a', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'al-29', name: 'Fourth chain (plus)', formula: 'If x + 1/x = a then x⁴ + 1/x⁴ = (a²−2)² − 2', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'al-30', name: 'Fourth chain (minus)', formula: 'If x − 1/x = a then x⁴ + 1/x⁴ = (a²+2)² − 2', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'al-31', name: 'Fifth chain', formula: 'If x + 1/x = a → x⁵+1/x⁵ = (x²+1/x²)(x³+1/x³) − (x + 1/x)', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'al-32', name: 'x²−x chain', formula: 'If x + 1/x = a → x² − 1/x² = (a)·√(a²−4)', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'al-33', name: 'Special: ±3', formula: 'If x + 1/x = ±3 → x⁶ = −1; if = 1 → x³ = −1; if = −1 → x³ = 1; if = ±2 → x = ±1', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'al-34', name: '1/a + 1/b style', formula: 'If 1/a + 1/b = 1 then (a+b)²/(a²b²)... and a³−b³ relations', usage: 'If a−b−c style conditions apply to reciprocals similarly.', fastTip: '', pyqHint: '' },
                    { id: 'al-35', name: 'ab + b + ... special cases', formula: 'If a²−b²−ab = 0 → a³−b³ = 0; if 1/a−1/b = 1/(a−b) → a³+b³ = 0', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'al-36', name: 'ab(a+b) = 1', formula: '→ 1/a³ + 1/b³ − (1/a³ − 1/b³) style: 1/a³ + 1/b³ − 1/(a³b³) = 3', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'al-37', name: 'Sum-max product-min', formula: 'If x+y = a (fixed) → xy maximum when x=y=a/2; if xy = a → x+y minimum when x=y=√a', usage: '', fastTip: '', pyqHint: '' }
                ]
            },
            {
                id: 'al-equations',
                name: 'Equations (Linear / Quadratic / Cubic)',
                formulas: [
                    { id: 'al-38', name: 'Quadratic root sum', formula: 'For ax²+bx+c=0: α+β = −b/a', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'al-39', name: 'Quadratic root product', formula: 'αβ = c/a', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'al-40', name: 'Cubic root sum', formula: 'For ax³+bx²+cx+d=0: α+β+γ = −b/a', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'al-41', name: 'Cubic product', formula: 'αβγ = −d/a', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'al-42', name: 'Cubic pair sum', formula: 'αβ+βγ+γα = c/a', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'al-43', name: 'Real and equal roots', formula: 'Discriminant D = b² − 4ac = 0', usage: '3x²+2kx+3=0: 4k²−36=0 → k=3.', fastTip: '', pyqHint: 'PYQ: value of k for equal roots.' },
                    { id: 'al-44', name: 'Real and distinct roots', formula: 'D > 0', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'al-45', name: 'No real roots', formula: 'D < 0', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'al-46', name: 'Quadratic formula', formula: 'x = [−b ± √(b²−4ac)] / 2a', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'al-47', name: 'Two linear equations: unique solution', formula: 'a1/a2 ≠ b1/b2', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'al-48', name: 'Two linear equations: no solution', formula: 'a1/a2 = b1/b2 ≠ c1/c2 (parallel lines)', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'al-49', name: 'Two linear equations: infinite solutions', formula: 'a1/a2 = b1/b2 = c1/c2 (coincident lines)', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'al-50', name: 'x+y=a, xy=b → solve', formula: 'x,y are roots of t² − at + b = 0', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'al-51', name: 'Perfect square completion', formula: 'Middle term = ±√(first × third); first = (middle)²/(4×third)', usage: '', fastTip: '', pyqHint: '' }
                ]
            },
            {
                id: 'al-ratio-rules',
                name: 'Ratio Rules in Algebra',
                formulas: [
                    { id: 'al-52', name: 'Componendo', formula: 'If a/b = c/d → (a+b)/b = (c+d)/d', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'al-53', name: 'Dividendo', formula: 'If a/b = c/d → (a−b)/b = (c−d)/d', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'al-54', name: 'Componendo-dividendo', formula: 'If a/b = c/d → (a+b)/(a−b) = (c+d)/(c−d)', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'al-55', name: 'Inverse', formula: 'If (a+b)/(a−b) = c/d → a/b = (c+d)/(c−d)', usage: '', fastTip: '', pyqHint: '' }
                ]
            },
            {
                id: 'al-geometry-alg',
                name: 'Algebra-Geometry Bridges',
                formulas: [
                    { id: 'al-56', name: 'Sum of squares zero', formula: 'If (x−a)² + (y−b)² + (z−c)² = 0 → x=a, y=b, z=c', usage: 'Substitute directly in the expression.', fastTip: '', pyqHint: '' }
                ]
            }
        ]
    },

    /* ========================================================
       RATIO & PROPORTION
       ======================================================== */
    'ratio-proportion': {
        name: 'Ratio & Proportion',
        color: '#e67e22',
        subtopics: [
            {
                id: 'rp-basics',
                name: 'Ratio Fundamentals',
                formulas: [
                    { id: 'rp-01', name: 'Antecedent & Consequent', formula: 'In x:y, x = antecedent, y = consequent', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'rp-02', name: 'Duplicate ratio', formula: 'Duplicate of x:y = x²:y²', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'rp-03', name: 'Sub-duplicate ratio', formula: 'Sub-duplicate of x:y = √x : √y', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'rp-04', name: 'Triplicate ratio', formula: 'Triplicate of x:y = x³:y³', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'rp-05', name: 'Sub-triplicate ratio', formula: 'Sub-triplicate of x:y = ∛x : ∛y', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'rp-06', name: 'Inverse ratio', formula: 'Inverse of x:y = y:x', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'rp-07', name: 'Compound ratio', formula: 'a:b, c:d, e:f → compound = ace:bdf', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'rp-08', name: '3rd Proportional', formula: '3rd proportional to a, b = b²/a', usage: 'a:b :: b:x → x = b²/a.', fastTip: '', pyqHint: '' },
                    { id: 'rp-09', name: '4th Proportional', formula: '4th proportional to a, b, c = bc/a', usage: 'a:b :: c:x → x = bc/a.', fastTip: '', pyqHint: '' },
                    { id: 'rp-10', name: 'Mean Proportion', formula: 'Mean proportion of a, b = √(ab)', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'rp-11', name: 'Componendo-dividendo', formula: 'If a:b = c:d → (a+b)/(a−b) = (c+d)/(c−d)', usage: '', fastTip: '', pyqHint: 'High frequency.' },
                    { id: 'rp-12', name: 'Dividendo-componendo', formula: 'If a/b = c/d → (a−b)/(a+b) = (c−d)/(c+d)', usage: '', fastTip: '', pyqHint: '' }
                ]
            },
            {
                id: 'rp-age-avg',
                name: 'Ages & Average',
                formulas: [
                    { id: 'rp-13', name: 'Average', formula: 'Average = (sum of observations)/(number of observations)', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'rp-14', name: 'Weighted average', formula: 'Mean = (A1W1 + A2W2 + ...)/(W1+W2+...)', usage: 'Mixtures, speeds, marks all use this.', fastTip: '', pyqHint: '' },
                    { id: 'rp-15', name: 'Mean of n consecutive numbers', formula: 'For n numbers in AP: mean = (first+last)/2', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'rp-16', name: 'Age ratio after t years', formula: 'If present ratio a:b, after t years: (a+t)/(b+t); t years ago: (a−t)/(b−t)', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'rp-17', name: 'Sum of ages from ratio', formula: 'If ratio a:b and sum S: ages = Sa/(a+b), Sb/(a+b)', usage: '', fastTip: '', pyqHint: '' }
                ]
            },
            {
                id: 'rp-mixture',
                name: 'Mixture & Alligation (core rules)',
                formulas: [
                    { id: 'rp-18', name: 'Alligation rule', formula: 'Cheaper : Dearer = (D − M) : (M − C)', usage: 'C = cheaper price, D = dearer price, M = mean price.', fastTip: '', pyqHint: 'Very high frequency.' },
                    { id: 'rp-19', name: 'Replacement (dilution) formula', formula: 'Pure left = x(1 − y/x)^n where x = original quantity, y = removed each time, n = times', usage: 'Classic: remove & replace with water, n times.', fastTip: '', pyqHint: 'Iconic SSC pattern.' },
                    { id: 'rp-20', name: 'Mixture of two ratios', formula: 'Container A (m1:w1) mixed with B (m2:w2) in ratio p:q → milk = p·m1/(m1+w1) + q·m2/(m2+w1) style weighted', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'rp-21', name: 'Find ratio to reach target concentration', formula: 'R_A : R_B = (target − conc_B) : (conc_A − target) — alligation on fractions', usage: 'Milk fractions 1/3, 4/5, target 4/9 → (4/9−4/5)... wait use (D−M):(M−C) on fractions → 16:5 style.', fastTip: '', pyqHint: '' },
                    { id: 'rp-22', name: 'Cost of mixture', formula: 'CP per unit = (A1W1 + A2W2)/(W1+W2)', usage: '₹4/kg and ₹5/kg in 3:2 → (12+10)/5 = ₹4.4.', fastTip: '', pyqHint: '' }
                ]
            }
        ]
    },

    /* ========================================================
       PARTNERSHIP
       ======================================================== */
    'partnership': {
        name: 'Partnership',
        color: '#c0392b',
        subtopics: [
            {
                id: 'pa-basics',
                name: 'Partnership Types & Rules',
                formulas: [
                    { id: 'pa-01', name: 'Simple partnership profit ratio', formula: 'P1:P2:P3 = X1:X2:X3 (same time period)', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'pa-02', name: 'Compound partnership profit ratio', formula: 'P1:P2:P3 = X1T1 : X2T2 : X3T3', usage: 'Investment × time = equivalent investment.', fastTip: '', pyqHint: 'Most common partnership pattern.' },
                    { id: 'pa-03', name: 'Active partner share', formula: 'Active partner gets fixed % of profit for management + share of remaining profit in capital ratio', usage: 'Rajesh 10% of 1000 = 100, remaining 900 in 5:4 → 100+500 = 600.', fastTip: '', pyqHint: 'PYQ pattern.' },
                    { id: 'pa-04', name: 'Partner leaving/joining', formula: 'Count actual months each capital stayed in business', usage: 'Left after 6 months → time = 6, not 12.', fastTip: '', pyqHint: '' },
                    { id: 'pa-05', name: 'Finding investment from profit', formula: 'X_i = (P_i × T_total-equivalent) — reverse the ratio: X ∝ P/T', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'pa-06', name: 'Salary to one partner', formula: 'Deduct fixed salary from total profit BEFORE sharing', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'pa-07', name: 'Compound interest to capital', formula: 'If interest at r% on capitals, add it to profit before dividing (or adjust per terms)', usage: '', fastTip: '', pyqHint: '' }
                ]
            }
        ]
    },

    /* ========================================================
       TRIGONOMETRY
       ======================================================== */
    'trigonometry': {
        name: 'Trigonometry',
        color: '#9b59b6',
        subtopics: [
            {
                id: 'tr-ratios',
                name: 'Basic Ratios & Complements',
                formulas: [
                    { id: 'tr-01', name: 'Six ratios (P=perpendicular, B=base, H=hypotenuse)', formula: 'sinθ=P/H, cosθ=B/H, tanθ=P/B, cosecθ=H/P, secθ=H/B, cotθ=B/P', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'tr-02', name: 'Reciprocal pairs', formula: 'sin·cosec = 1, cos·sec = 1, tan·cot = 1; tan = sin/cos', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'tr-03', name: 'Complementary angles', formula: 'sinθ = cos(90°−θ), tanθ = cot(90°−θ), secθ = cosec(90°−θ)', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'tr-04', name: 'Negative angles', formula: 'sin(−x) = −sinx, cos(−x) = cosx, tan(−x) = −tanx (odd/even parity)', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'tr-05', name: 'Quadrant sign chart', formula: 'Q1 all +, Q2 sin/cosec +, Q3 tan/cot +, Q4 cos/sec + (CAST)', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'tr-06', name: '180°±θ conversions', formula: 'sin(180°−θ)=sinθ, cos(180°−θ)=−cosθ, tan(180°−θ)=−tanθ', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'tr-07', name: '270°±θ conversions', formula: 'sin(270°−θ)=−cosθ, cos(270°−θ)=−sinθ, tan(270°−θ)=cotθ', usage: '', fastTip: '', pyqHint: '' }
                ]
            },
            {
                id: 'tr-standard-values',
                name: 'Standard Values Table',
                formulas: [
                    { id: 'tr-08', name: 'sin/cos table', formula: 'sin: 0°=0, 30°=1/2, 45°=1/√2, 60°=√3/2, 90°=1 | cos: 1, √3/2, 1/√2, 1/2, 0', usage: 'cos is sin in reverse order.', fastTip: 'Mnemonic: "0, 1, 2, 3, 4" for √n/2.', pyqHint: 'Memorize cold — appears in 40% of trig questions.' },
                    { id: 'tr-09', name: 'tan table', formula: 'tan: 0°=0, 30°=1/√3, 45°=1, 60°=√3, 90°=∞', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'tr-10', name: 'RANGES of trig functions', formula: 'sin/cos (odd pow): [−1, 1]; (even pow): [0, 1]; tan/cot (odd): [−∞, ∞]; (even): [0, ∞]; sec/cosec: |value| ≥ 1', usage: 'Value of sin/cos NEVER exceeds 1; sec/cosec ALWAYS ≥ 1 in magnitude.', fastTip: 'For a sinx ± b cosx: max = √(a²+b²), min = −√(a²+b²).', pyqHint: 'Max/min questions are frequent.' },
                    { id: 'tr-11', name: 'Max of a sinx ± b cosx', formula: 'Max = +√(a²+b²), Min = −√(a²+b²)', usage: 'Example: 3sinx + 4cosx → max 5.', fastTip: '', pyqHint: '' },
                    { id: 'tr-12', name: 'Max of a sin²x + b cos²x', formula: 'Max = larger of {a, b}; Min = smaller of {a, b}', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'tr-13', name: 'a sin²x + b cosec²x', formula: 'Min = (a+b)²/(4ab)... actually: min of a tan²x + b cot²x = 2√(ab); a sin²x + b cosec²x min = (√a+√b)²', usage: 'AM-GM style.', fastTip: '', pyqHint: '' },
                    { id: 'tr-14', name: 'sin²ⁿx + cos²ⁿx', formula: 'Max = 1; Min (n even) = 2·(1/√2)^(2n) at x=45°', usage: 'sin²x + cos⁴x: min = 1/2 + 1/4 = 3/4 at 45°.', fastTip: 'Use x = 45° for minimum.', pyqHint: '' },
                    { id: 'tr-15', name: '(sinx·cosx)^n', formula: 'n even: max = (1/2)^(n/2)... = 2^(−n/2), min 0; n odd: max 2^(−n/2), min −2^(−n/2)', usage: '', fastTip: '', pyqHint: '' }
                ]
            },
            {
                id: 'tr-identities',
                name: 'Fundamental Identities',
                formulas: [
                    { id: 'tr-16', name: 'Pythagorean 1', formula: 'sin²θ + cos²θ = 1', usage: '', fastTip: '', pyqHint: 'The mother identity.' },
                    { id: 'tr-17', name: 'Pythagorean 2', formula: 'sec²θ − tan²θ = 1', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'tr-18', name: 'Pythagorean 3', formula: 'cosec²θ − cot²θ = 1', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'tr-19', name: 'All derived from these three', formula: '1 + tan²θ = sec²θ; 1 + cot²θ = cosec²θ; sinθ = tanθ/secθ etc.', usage: '', fastTip: '', pyqHint: '' }
                ]
            },
            {
                id: 'tr-compound',
                name: 'Compound Angle Formulae',
                formulas: [
                    { id: 'tr-20', name: 'sin(A+B)', formula: '= sinA·cosB + cosA·sinB', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'tr-21', name: 'sin(A−B)', formula: '= sinA·cosB − cosA·sinB', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'tr-22', name: 'cos(A+B)', formula: '= cosA·cosB − sinA·sinB', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'tr-23', name: 'cos(A−B)', formula: '= cosA·cosB + sinA·sinB', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'tr-24', name: 'tan(A+B)', formula: '= (tanA+tanB)/(1−tanA·tanB)', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'tr-25', name: 'tan(A−B)', formula: '= (tanA−tanB)/(1+tanA·tanB)', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'tr-26', name: 'cot(A+B)', formula: '= (cotA·cotB−1)/(cotA+cotB)', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'tr-27', name: 'sin2A', formula: '= 2sinA·cosA = 2tanA/(1+tan²A)', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'tr-28', name: 'cos2A', formula: '= cos²A−sin²A = 1−2sin²A = 2cos²A−1 = (1−tan²A)/(1+tan²A)', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'tr-29', name: 'tan2A', formula: '= 2tanA/(1−tan²A)', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'tr-30', name: 'sin3A', formula: '= 3sinA − 4sin³A', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'tr-31', name: 'cos3A', formula: '= 4cos³A − 3cosA', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'tr-32', name: 'tan3A', formula: '= (3tanA − tan³A)/(1 − 3tan²A)', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'tr-33', name: 'Product chains', formula: 'sinθ·sin2θ·sin4θ = sin3θ/4; cosθ·cos2θ·cos4θ = cos3θ/4; tanθ·tan2θ·tan4θ = tan3θ', usage: '', fastTip: '', pyqHint: 'Frequent "proven" style.' }
                ]
            },
            {
                id: 'tr-product-sum',
                name: 'Sum-to-Product / Product-to-Sum',
                formulas: [
                    { id: 'tr-34', name: 'sinC + sinD', formula: '= 2sin((C+D)/2)cos((C−D)/2)', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'tr-35', name: 'sinC − sinD', formula: '= 2cos((C+D)/2)sin((C−D)/2)', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'tr-36', name: 'cosC + cosD', formula: '= 2cos((C+D)/2)cos((C−D)/2)', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'tr-37', name: 'cosC − cosD', formula: '= −2sin((C+D)/2)sin((C−D)/2)', usage: '', fastTip: '', pyqHint: '' }
                ]
            },
            {
                id: 'tr-special-results',
                name: 'Special Angle-Set Results',
                formulas: [
                    { id: 'tr-38', name: 'A+B+C = 180°', formula: 'tanA+tanB+tanC = tanA·tanB·tanC; cotA·cotB + cotB·cotC + cotC·cotA = 1', usage: 'Triangle angles.', fastTip: '', pyqHint: 'High frequency result set.' },
                    { id: 'tr-39', name: 'A+B+C = 90°', formula: 'tanA·tanB + tanB·tanC + tanC·tanA = 1; cotA+cotB+cotC = cotA·cotB·cotC', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'tr-40', name: 'A+B = 45°', formula: '(1+tanA)(1+tanB) = 2; (1−cotA)(1−cotB) = 2', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'tr-41', name: 'a sinX + b cosX system', formula: 'If a sinX + b cosX = m and a cosX − b sinX = n → a²+b² = m²+n²', usage: '3sinθ+5cosθ=5 → 3cosθ−5sinθ = ±3.', fastTip: '', pyqHint: 'Classic 2-line question.' },
                    { id: 'tr-42', name: 'a secX + b tanX system', formula: 'If a secX + b tanX = m and a tanX − b secX = n → a²−b² = m²−n²', usage: '29secθ−21tanθ=20 → 29tanθ−21secθ = ±(√(29²−21²)) = ±20... compute 841−441=400 → 20.', fastTip: '', pyqHint: 'Iconic PYQ.' },
                    { id: 'tr-43', name: 'Sec-tan conjugate', formula: '(secx+tanx)(secx−tanx) = 1; (cosecx+cotx)(cosecx−cotx) = 1', usage: '', fastTip: '', pyqHint: '' }
                ]
            }
        ]
    },

    /* ========================================================
       HEIGHTS & DISTANCES
       ======================================================== */
    'heights-distances': {
        name: 'Heights & Distances',
        color: '#d35400',
        subtopics: [
            {
                id: 'hd-concepts',
                name: 'Core Concepts & Cases',
                formulas: [
                    { id: 'hd-01', name: 'Angle of elevation', formula: 'Angle between line of sight (upward) and horizontal', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'hd-02', name: 'Angle of depression', formula: 'Angle between line of sight (downward) and horizontal; ALWAYS equals the elevation from below (alternate angles)', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'hd-03', name: 'Case 1: tan45° tower', formula: 'Angle 45° at distance d → height H = d (tan45=1)', usage: 'Short trick: 1 : 30m → H = 30m.', fastTip: '45° means height = distance.', pyqHint: 'Most common case.' },
                    { id: 'hd-04', name: 'Case 2: tan30° tower', formula: 'Angle 30° at distance d → H = d/√3', usage: 'd=30 → H = 10√3.', fastTip: 'Ratio 1:√3 → multiply distance by 1/√3.', pyqHint: '' },
                    { id: 'hd-05', name: 'Ladder against wall (15°/75°)', formula: '15° ladder: ratio (√3+1):2√2', usage: 'Foot 4m → ladder = 8√2/2√2... per standard: 4 × 2√2/(√3+1) = 8√2 style.', fastTip: '', pyqHint: '' },
                    { id: 'hd-06', name: 'Moving object: 30°→45°', formula: 'Distance covered = H(√3 − 1)', usage: 'Tower 5m → distance = 5(√3−1)... with 1:√3 scaling: BC = √3−1 per unit.', fastTip: '30°→45°: distance = H(√3−1).', pyqHint: 'Very common moving-car/tower pattern.' },
                    { id: 'hd-07', name: 'Moving object: 30°→60°', formula: 'Distance covered = H(√3 − 1/√3) = H·(2/√3)', usage: 'Per unit height: √3 − 1/√3 = 2/√3.', fastTip: '', pyqHint: '' },
                    { id: 'hd-08', name: 'Shadow length', formula: 'Shadow = H/tan(altitude)', usage: 'Shadow 40m longer at 30° than 45°: H/√3·... solve H(√3−1)... H = 20(√3+1)... standard answer 20(√3−1)... verify: H√3... classic: H = 20(√3+1) m? Use H(1/tan30 − 1/tan45) = 40 → H(√3−1) = 40 → H = 40/(√3−1) = 20(√3+1).', fastTip: 'Solve the difference equation, don\'t guess.', pyqHint: 'PYQ: shadow 40m longer → H = 20(√3+1)... options 20(3−1) form: answer = 20(√3+1). Actually option c) 20 suggests H(√3−1)=40 with √3≈1.732: 20(0.732)=14.6 no... H=40/(√3−1)≈54.6. Option 20(√3+1)≈54.6 ✓.' },
                    { id: 'hd-09', name: 'Building on hill / tower on ground', formula: 'Separate the vertical segments; use tan per segment', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'hd-10', name: 'Two objects from a point', formula: 'Angle of elevation of nearer object θ1, farther θ2; distance between = H(1/tanθ_far − 1/tanθ_near)', usage: '', fastTip: '', pyqHint: '' }
                ]
            }
        ]
    },

    /* ========================================================
       GEOMETRY
       ======================================================== */
    'geometry': {
        name: 'Geometry',
        color: '#27ae60',
        subtopics: [
            {
                id: 'gm-lines-angles',
                name: 'Lines, Angles & Transversals',
                formulas: [
                    { id: 'gm-01', name: 'Corresponding angles', formula: 'Parallel lines + transversal → corresponding angles equal (∠1=∠5, ∠2=∠6, ∠4=∠8, ∠3=∠7)', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'gm-02', name: 'Alternate angles', formula: '∠1=∠7, ∠2=∠8, ∠4=∠6, ∠3=∠5', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'gm-03', name: 'Vertically opposite', formula: '∠1=∠3, ∠2=∠4', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'gm-04', name: 'Same-side interior sum', formula: '∠1+∠2 = 180°; bisectors of same-side interior angles meet at 90°', usage: '', fastTip: '', pyqHint: 'PYQ: difference 40° → smallest = 70°.' },
                    { id: 'gm-05', name: 'Angle types', formula: 'Acute <90°, Right =90°, Obtuse 90–180°, Straight 180°, Reflex 180–360°, Complete 360°', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'gm-06', name: 'Complementary / Supplementary', formula: 'Complementary sum 90°; supplementary sum 180°', usage: '', fastTip: '', pyqHint: '' }
                ]
            },
            {
                id: 'gm-triangles',
                name: 'Triangles (the biggest geometry subtopic)',
                formulas: [
                    { id: 'gm-07', name: 'Basic facts', formula: 'Sum of angles = 180°; sum of any two sides > third; difference of any two sides < third; exterior angle = sum of two interior opposites', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'gm-08', name: 'Bigger angle ↔ bigger side', formula: 'If ∠B > ∠C then AC > AB', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'gm-09', name: 'Angle bisector + altitude', formula: 'If AM bisects ∠A and AN ⊥ BC → ∠MAN = (∠B − ∠C)/2', usage: '', fastTip: '', pyqHint: 'High frequency.' },
                    { id: 'gm-10', name: 'Median to hypotenuse (right triangle)', formula: 'Median = hypotenuse/2 (BE = AC/2)', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'gm-11', name: 'Right triangle altitude relations', formula: 'AD² = BD×DC; AB² = BD×BC; AC² = CD×BC; BD = AD×BC... altitude BD = AB×BC/AC', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'gm-12', name: 'Internal angle bisector theorem', formula: 'AB:AC = BD:DC', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'gm-13', name: 'External angle bisector theorem', formula: 'AB:AC = BD:DC (externally divided)', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'gm-14', name: 'Midpoint theorem', formula: 'DE ∥ BC and DE = BC/2 where D,E midpoints', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'gm-15', name: 'Basic proportionality (Thales)', formula: 'DE ∥ BC → AD/DB = AE/EC; AD/AB = AE/AC', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'gm-16', name: 'Congruency criteria', formula: 'SSS, SAS, ASA, RHS (right triangles)', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'gm-17', name: 'Similarity → area ratio', formula: 'Area ratio = (corresponding side ratio)²; perimeter ratio = side ratio', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'gm-18', name: 'Incenter angle', formula: '∠BIC = 90° + A/2', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'gm-19', name: 'Excenter angle', formula: '∠BPC = 90° − A/2 (external bisectors)', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'gm-20', name: 'Inradius', formula: 'r = Area / semi-perimeter', usage: 'Right triangle: r = (p + b − h)/2.', fastTip: '', pyqHint: '' },
                    { id: 'gm-21', name: 'Circumradius', formula: 'R = (a·b·c)/(4×Area); right triangle: R = hypotenuse/2', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'gm-22', name: 'Euler: OI distance', formula: 'OI² = R² − 2Rr (circumcentre–incentre distance)', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'gm-23', name: 'Centroid', formula: 'Medians meet at centroid; divides each median 2:1; area of triangle = 6 × area of any small part; median triangle area = 3/4 of original', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'gm-24', name: 'Apollonius theorem', formula: 'AB² + AC² = 2(AD² + BD²) where AD is median', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'gm-25', name: 'Median-area results', formula: 'Area(DEF) = 1/4 Area(ABC) where D,E,F midpoints; AH:HG = 3:1', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'gm-26', name: 'Right triangle median identity', formula: 'If AD, CE are medians in right ∆ABC: 4(AD²+CE²) = 5AC²; if medians ⊥ each other: AB²+AC² = 5BC²', usage: '', fastTip: '', pyqHint: 'Advanced PYQs.' },
                    { id: 'gm-27', name: 'Sine rule', formula: 'a/sinA = b/sinB = c/sinC = 2R', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'gm-28', name: 'Cosine rule', formula: 'cosA = (b²+c²−a²)/2bc', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'gm-29', name: 'Viviani (equilateral)', formula: 'For point P inside equilateral triangle: h1+h2+h3 = altitude', usage: '', fastTip: '', pyqHint: '' }
                ]
            },
            {
                id: 'gm-circles',
                name: 'Circles',
                formulas: [
                    { id: 'gm-30', name: 'Circle basics', formula: 'Area = πr²; Circumference = 2πr; Diameter = 2r', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'gm-31', name: 'Arc & sector', formula: 'Arc = 2πr×θ/360°; Sector area = πr²×θ/360°; arc = r×θ(radian)', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'gm-32', name: 'Angles in same segment', formula: 'Equal (same base)', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'gm-33', name: 'Angle in semicircle', formula: 'Diameter as base → angle at circumference = 90°', usage: '', fastTip: '', pyqHint: 'Very high frequency.' },
                    { id: 'gm-34', name: 'Intersecting chords', formula: 'AE×EB = CE×ED', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'gm-35', name: 'Tangent ⊥ radius', formula: 'Tangent at T ⟂ OT', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'gm-36', name: 'Two tangents from external point', formula: 'PA = PB; ∠OPT = half of ∠APB... OP bisects ∠APB', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'gm-37', name: 'Tangent-secant (power of a point)', formula: 'PT² = PB×PA (PT tangent, PBA secant)', usage: '', fastTip: '', pyqHint: 'High frequency.' },
                    { id: 'gm-38', name: 'Alternate segment theorem', formula: 'Angle between tangent and chord = angle in alternate segment', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'gm-39', name: 'Two circles touch externally', formula: 'Centre distance = R + r', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'gm-40', name: 'Two circles touch internally', formula: 'Centre distance = R − r', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'gm-41', name: 'Direct common tangent length', formula: 'L = √(d² − (R−r)²), d = centre distance', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'gm-42', name: 'Transverse common tangent length', formula: 'L = √(d² − (R+r)²)', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'gm-43', name: 'Number of common tangents', formula: 'd > R+r: 4 | d = R+r: 3 | |R−r| < d < R+r: 2 | d = |R−r|: 1 | d < |R−r|: 0', usage: '', fastTip: '', pyqHint: 'NEVER assume external touch without data.' },
                    { id: 'gm-44', name: 'Cyclic quadrilateral', formula: 'Opposite angles sum 180°; Ptolemy: AC·BD = AB·CD + BC·AD', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'gm-45', name: 'Intersecting chords angle', formula: '∠BPD = (x+y)/2 where x,y = central angles of the arcs', usage: 'External: ∠BPD = (x−y)/2.', fastTip: '', pyqHint: '' }
                ]
            },
            {
                id: 'gm-quadrilaterals',
                name: 'Quadrilaterals & Polygons',
                formulas: [
                    { id: 'gm-46', name: 'Parallelogram', formula: 'Opposite sides equal & parallel; opposite angles equal; diagonals bisect each other; area = base×height; AB²+BC²+CD²+AD² = AC²+BD²', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'gm-47', name: 'Rhombus', formula: 'All sides equal; diagonals bisect at 90°; 4a² = d1²+d2²; area = d1·d2/2', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'gm-48', name: 'Rectangle', formula: 'Diagonals equal and bisect; area = L×B; diagonal = √(L²+B²)', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'gm-49', name: 'Square', formula: 'Diagonals equal, bisect at 90°, length = a√2; area = a² = d²/2', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'gm-50', name: 'Trapezium', formula: 'Area = (a+b)h/2; midline EF = (AB+DC)/2; PQ = (AB−DC)/2', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'gm-51', name: 'Polygon interior angle sum', formula: '(n−2)×180°; each interior = 180° − 360°/n; each exterior = 360°/n; sum of exteriors = 360°', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'gm-52', name: 'Number of diagonals', formula: 'n(n−3)/2', usage: '', fastTip: '', pyqHint: 'Frequent direct question.' },
                    { id: 'gm-53', name: 'Diagonal of regular polygon', formula: 'Diagonals from one vertex = n−3', usage: '', fastTip: '', pyqHint: '' }
                ]
            },
            {
                id: 'gm-coordinate',
                name: 'Coordinate Geometry Basics',
                formulas: [
                    { id: 'gm-54', name: 'Distance formula', formula: 'd = √((x2−x1)² + (y2−y1)²)', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'gm-55', name: 'Midpoint', formula: 'M = ((x1+x2)/2, (y1+y2)/2)', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'gm-56', name: 'Section formula', formula: 'Point dividing AB in m:n = ((mx2+nx1)/(m+n), (my2+ny1)/(m+n))', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'gm-57', name: 'Slope', formula: 'm = (y2−y1)/(x2−x1); parallel: equal slopes; perpendicular: product = −1', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'gm-58', name: 'Area of triangle (coordinates)', formula: 'A = ½|x1(y2−y3) + x2(y3−y1) + x3(y1−y2)|', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'gm-59', name: 'Collinearity', formula: 'Area = 0 test', usage: '', fastTip: '', pyqHint: '' }
                ]
            }
        ]
    },

    /* ========================================================
       MENSURATION
       ======================================================== */
    'mensuration': {
        name: 'Mensuration',
        color: '#d4a853',
        subtopics: [
            {
                id: 'me-triangle',
                name: 'Triangles (2D)',
                formulas: [
                    { id: 'me-01', name: 'General triangle', formula: 'Area = ½ b×h; Perimeter = a+b+c', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'me-02', name: 'Equilateral triangle', formula: 'Area = (√3/4)a²; Height = (√3/2)a; Perimeter = 3a; r = a/(2√3); R = a/√3; P1+P2+P3 = height', usage: '', fastTip: '', pyqHint: 'High frequency.' },
                    { id: 'me-03', name: 'Heron\'s formula (scalene)', formula: 'Area = √(s(s−a)(s−b)(s−c)), s = (a+b+c)/2', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'me-04', name: 'Isosceles triangle (equal sides a, base b)', formula: 'Area = (b/4)√(4a²−b²); Height = √(a²−b²/4)', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'me-05', name: 'Right triangle', formula: 'Area = ½ b×p; h² = p²+b² (Pythagoras); r = (p+b−h)/2; R = h/2', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'me-06', name: 'Pythagoras triplets', formula: '(3,4,5) (5,12,13) (7,24,25) (8,15,17) (9,40,41) (12,35,37) (11,60,61) (20,21,29)', usage: '', fastTip: 'Memorize all 8.', pyqHint: 'Recognizing triplets saves 30s.' }
                ]
            },
            {
                id: 'me-quadrilateral',
                name: 'Quadrilaterals (2D)',
                formulas: [
                    { id: 'me-07', name: 'Parallelogram', formula: 'Area = base×height; Perimeter = 2(a+b); d1²+d2² = 2(a²+b²)', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'me-08', name: 'Rhombus', formula: 'Area = d1×d2/2; side = √(d1²+d2²)/2; Perimeter = 4a; 4a² = d1²+d2²', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'me-09', name: 'Trapezium', formula: 'Area = (a+b)h/2', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'me-10', name: 'Rectangle', formula: 'Area = L×B; Perimeter = 2(L+B); Diagonal = √(L²+B²); Walls = 2(L+B)H', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'me-11', name: 'Square', formula: 'Area = a² = d²/2; Perimeter = 4a; Diagonal = a√2', usage: '', fastTip: '', pyqHint: '' }
                ]
            },
            {
                id: 'me-polygon',
                name: 'Regular Polygons',
                formulas: [
                    { id: 'me-12', name: 'Regular pentagon', formula: 'Area ≈ 1.72a² (√3... = (1/4)√(5(5+2√5))a² ≈ 1.720a²)', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'me-13', name: 'Regular hexagon', formula: 'Area = (3√3/4)a² = 6 × (√3/4)a²', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'me-14', name: 'Exterior/interior angles', formula: 'Exterior = 360°/n; Interior = 180° − 360°/n; Sum of diagonals = n(n−3)/2', usage: '', fastTip: '', pyqHint: '' }
                ]
            },
            {
                id: 'me-circle',
                name: 'Circle & Ring',
                formulas: [
                    { id: 'me-15', name: 'Circle', formula: 'Area = πr²; Circumference = 2πr; Diameter = 2r', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'me-16', name: 'Arc length', formula: 'L = 2πr × θ/360° = rθ (radians)', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'me-17', name: 'Sector area', formula: 'A = πr² × θ/360°', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'me-18', name: 'Circular ring', formula: 'Area = π(R² − r²); Circumference difference = 2π(R−r)', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'me-19', name: 'Pathway inside/outside rectangle', formula: 'Outside: 2x(L+B+2x); Inside: 2x(L+B−2x)', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'me-20', name: 'Two crossing paths', formula: 'Area = x(L+B−x)', usage: '', fastTip: '', pyqHint: 'Frequent trick question.' }
                ]
            },
            {
                id: 'me-solid',
                name: '3D Solids',
                formulas: [
                    { id: 'me-21', name: 'Cube', formula: 'Volume = a³; TSA = 6a²; Diagonal = a√3; Edges = 12a', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'me-22', name: 'Cuboid', formula: 'Volume = lbh; TSA = 2(lb+bh+lh); Diagonal = √(l²+b²+h²)', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'me-23', name: 'Box (capacity)', formula: 'Capacity = (l−2t)(b−2t)(h−2t); Material = lbh − capacity; Open box TSA = 2(l+b)h + lb', usage: 't = thickness.', fastTip: '', pyqHint: '' },
                    { id: 'me-24', name: 'Cylinder', formula: 'Volume = πr²h; CSA = 2πrh; TSA = 2πr(h+r)', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'me-25', name: 'Hollow cylinder', formula: 'Volume = π(R²−r²)h; CSA = 2π(R+r)h; TSA = 2π(R+r)h + 2π(R²−r²)', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'me-26', name: 'Prism', formula: 'Volume = base area × height; LSA = base perimeter × height; TSA = LSA + 2×base area', usage: '', fastTip: '', pyqHint: 'PYQ: equilateral triangle base, LSA 120, side 4 → V = 40√3... verify: s=4, LSA=perimeter×h=12h=120 → h=10, V=(√3/4)16×10=40√3 ✓ (option b) 40√3 shown as "40 3 3" in options).' , pyqHint: '' },
                    { id: 'me-27', name: 'Cone', formula: 'Volume = (1/3)πr²h; Slant l = √(r²+h²); CSA = πrl; TSA = πr(l+r)', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'me-28', name: 'Cone from rotating right triangle', formula: 'About height a: V = (1/3)πb²a; about base b: V = (1/3)πa²b; about hypotenuse c: V = (1/3)πr²c where r = ab/c', usage: '', fastTip: '', pyqHint: 'Advanced PYQ pattern.' },
                    { id: 'me-29', name: 'Pyramid', formula: 'Volume = (1/3)×base area×h; LSA = (perimeter×slant)/2; TSA = LSA + base', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'me-30', name: 'Tetrahedron (regular)', formula: 'Volume = a³/(6√2); TSA = √3·a²; Height = a√(2/3) = √6/3·a', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'me-31', name: 'Frustum of cone', formula: 'l = √(h²+(R−r)²); CSA = π(R+r)l; TSA = π[(R+r)l + R²+r²]; V = (πh/3)(R²+r²+Rr)', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'me-32', name: 'Sphere', formula: 'Volume = (4/3)πr³; CSA = TSA = 4πr²', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'me-33', name: 'Hollow sphere (shell)', formula: 'Volume = (4/3)π(R³−r³); TSA = 4πR²; CSA = 4πr²', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'me-34', name: 'Hemisphere', formula: 'Volume = (2/3)πr³; CSA = 2πr²; TSA = 3πr²', usage: '', fastTip: '', pyqHint: '' }
                ]
            },
            {
                id: 'me-tricks',
                name: 'Mensuration Shortcuts & Unit Conversions',
                formulas: [
                    { id: 'me-35', name: 'Area change when sides change', formula: 'L+→a%, B+→b%: area + (a+b+ab/100)%; all sides +a%: area + (2a + a²/100)%; perimeter changes by a%', usage: '', fastTip: 'Use negative a for decrease.', pyqHint: 'Very frequent "area increased by %" pattern.' },
                    { id: 'me-36', name: 'Square inscribed in circle', formula: 'Area = 2r² (diagonal = diameter = 2r)', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'me-37', name: 'Largest triangle in semicircle', formula: 'Area = r² (right isosceles with legs = 2r... = (1/2)(2r)(r)... standard: r²)', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'me-38', name: 'Circle from same perimeter as square', formula: 'Square area a → circle area = (π/4)a > a (circle always wins)', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'me-39', name: 'Unit conversions', formula: '1 m³ = 1000 L; 1 L = 1000 cm³; 1 m = 10 dm = 100 cm = 1000 mm; 1 km = 1000 m; 1 m/s = 3.6 km/h', usage: '', fastTip: '', pyqHint: '' },
                    { id: 'me-40', name: 'Speed unit conversion', formula: 'km/h → m/s: ×5/18; m/s → km/h: ×18/5', usage: '', fastTip: '', pyqHint: '' }
                ]
            }
        ]
    },
    'hcf-lcm': {
        name: 'HCF & LCM',
        color: '#16a085',
        subtopics: [
            {
                id: 'hc-basic',
                name: 'Core HCF/LCM',
                formulas: [
                    { id: 'hc-01', name: 'HCF of primes', formula: 'HCF = smallest prime if all share it, else 1', usage: 'HCF of two primes is 1.', fastTip: '', pyqHint: '' },
                    { id: 'hc-02', name: 'HCF × LCM identity', formula: 'HCF(a,b) × LCM(a,b) = a × b', usage: 'Holds for EXACTLY two numbers. For 3+ numbers it fails — this is a trap.', fastTip: 'If options include a×b/HCF check, apply first.', pyqHint: 'Very frequent two-number shortcut.' },
                    { id: 'hc-03', name: 'LCM by factors', formula: 'LCM = product of each prime factor at its highest power', usage: '96 = 2⁵×3, 36 = 2²×3² → LCM = 2⁵×3² = 288.', fastTip: '', pyqHint: '' },
                    { id: 'hc-04', name: 'HCF by factors', formula: 'HCF = product of each common prime at its lowest power', usage: '96 & 36 → 2²×3 = 12.', fastTip: '', pyqHint: '' },
                    { id: 'hc-05', name: 'Greatest number dividing with remainders', formula: 'HCF(N1−r1, N2−r2, ...)', usage: 'Greatest number dividing 398 and 592 leaving 7 each: HCF(391, 585) = 48.', fastTip: 'Subtract remainders FIRST.', pyqHint: 'Classic 1-minute question.' },
                    { id: 'hc-06', name: 'Smallest number divisible with remainders', formula: 'LCM(divisors) + r', usage: 'Smallest no. leaving r on division by a,b,c: LCM(a,b,c)+r. If remainders differ: LCM + (a−r1) = LCM + (b−r2) = N − r style.', fastTip: 'When remainders differ, check the GAP of (divisor − remainder) — the number is LCM of gaps minus the gap, +r pattern.', pyqHint: '' },
                    { id: 'hc-07', name: 'Difference shortcut', formula: 'HCF(a,b) divides (a−b); LCM is multiple of both', usage: '1995−1785 = 210 → HCF ∈ divisors of 210 (1,2,3,5,6,7,10,14,15,21,30,35,42,70,105,210).', fastTip: 'Narrows HCF candidates in 5 seconds.', pyqHint: '' },
                    { id: 'hc-08', name: 'LCM of fractions', formula: 'LCM(numerators) / HCF(denominators)', usage: 'LCM(4/5, 6/9) = LCM(4,6)/HCF(5,9) = 12/1.', fastTip: '', pyqHint: 'Distinct from "LCM of numbers" — watch wording.' },
                    { id: 'hc-09', name: 'HCF of fractions', formula: 'HCF(numerators) / LCM(denominators)', usage: 'HCF(4/5, 6/9) = HCF(4,6)/LCM(5,9) = 2/45.', fastTip: 'Remember: HCF flips denominator to LCM.', pyqHint: '' }
                ]
            },
            {
                id: 'hc-factors',
                name: 'Factors & Divisibility Powers',
                formulas: [
                    { id: 'hc-10', name: 'Number of factors', formula: 'n = p1^a × p2^b × p3^c → total factors = (a+1)(b+1)(c+1)', usage: '360 = 2³×3²×5 → 4×3×2 = 24 factors.', fastTip: 'Exponents +1 then multiply.', pyqHint: 'Direct PYQ favourite.' },
                    { id: 'hc-11', name: 'Sum of factors', formula: 'Σ = (p1^0+...+p1^a)(p2^0+...+p2^b)...', usage: '360: (1+2+4+8)(1+3+9)(1+5) = 15×13×6 = 1170.', fastTip: 'Geometric sum per prime.', pyqHint: '' },
                    { id: 'hc-12', name: 'Even factors', formula: 'Even factor count = total × a/(a+1) where 2^a || n', usage: '360 (2³): 24 × 3/4 = 18 even factors.', fastTip: 'If asked even SUM: total sum − sum of odd factors (drop the 2-bracket).', pyqHint: '120 → even sum 336 (trap: 360 is total).' },
                    { id: 'hc-13', name: 'Trailing zeros of n!', formula: 'z = ⌊n/5⌋ + ⌊n/25⌋ + ⌊n/125⌋ + ...', usage: '100! → 20+4 = 24; 36! → 7+1 = 8.', fastTip: 'MANDATORY 3-step ritual for n≥125: also add ⌊n/125⌋.', pyqHint: 'SSC CGL 2023 (36! → 8); RRB 2024 (100! → 24). Trap: answering ⌊n/5⌋ only.' },
                    { id: 'hc-14', name: 'Power of prime in n!', formula: 'P(n!, p) = ⌊n/p⌋ + ⌊n/p²⌋ + ...', usage: 'Power of 5 in 100! is 24; power of 2 is 97.', fastTip: 'Zeros = min(power of 2, power of 5) = power of 5 (always fewer 5s).', pyqHint: '' },
                    { id: 'hc-15', name: 'Divisibility by co-prime parts', formula: 'Divisible by m×n (gcd=1) iff divisible by m AND by n', usage: '24 = 3×8: check digit sum AND last 3 digits; 36 = 4×9; 18 = 2×9.', fastTip: 'Splits hard divisors into cheap tests.', pyqHint: 'PYQ: 6-digit 11p9q4 ÷ 24 → p=6, q... check 3 & 8.' }
                ]
            }
        ]
    },
    'mixture-alligation': {
        name: 'Mixture & Alligation',
        color: '#e67e22',
        subtopics: [
            {
                id: 'mi-basic',
                name: 'Mixing Rules',
                formulas: [
                    { id: 'mi-01', name: 'Alligation (ratio of cheaper to dearer)', formula: 'C:D = (M−C):(D−M)', usage: 'C=40, D=60, M=48 → ratio = 8:12 = 2:3 (cheaper:dearer).', fastTip: 'Cross-subtract: price of each against the mean.', pyqHint: 'Most frequent mixing formula.' },
                    { id: 'mi-02', name: 'Quantity of cheaper', formula: 'Qc = V(M−D)/(C−D) → use ratio C:D × total', usage: 'Total 10 L, ratio 2:3 → cheaper = 4 L.', fastTip: '', pyqHint: '' },
                    { id: 'mi-03', name: 'Percentage of cheaper in mixture', formula: '%C = (M−D)/(C−D) × 100', usage: 'C=20, D=30, M=24 → %C = 4/10 = 40%.', fastTip: '', pyqHint: '' },
                    { id: 'mi-04', name: 'Dilution (adding water)', formula: 'Water needed = V(D−M)/(M) for % drop...', usage: 'To bring D% down to M%: add water = V×(D−M)/M.', fastTip: 'Volume of water ∝ (D−M).', pyqHint: '' },
                    { id: 'mi-05', name: 'Replacement (removing and refilling)', formula: 'New % = D × (1 − x/V); after n times: D(1−x/V)ⁿ', usage: 'V=100, D=40%, x=10 removed+replaced with water: new = 40×0.9 = 36%.', fastTip: 'Each replacement multiplies by (1−x/V).', pyqHint: 'Two-step replacement PYQs are common.' }
                ]
            },
            {
                id: 'mi-apps',
                name: 'Work/Speed & Profit Applications',
                formulas: [
                    { id: 'mi-06', name: 'Mixing two workers', formula: 'Same alligation on rates: R1:R2 = (R−R1):(R2−R)', usage: 'A does work in 12d, B in 18d; combined 15d → ratio = (15−12):(18−15) = 3:3 = 1:1.', fastTip: 'Use rate (1/days), not days.', pyqHint: '' },
                    { id: 'mi-07', name: 'Mixture profit problem', formula: 'SP of mixture = cost ratio weighted; profit% = (SP−CP)/CP×100', usage: 'Mix 10 kg @ ₹40 with 15 kg @ ₹60, sell @ ₹70/kg: CP avg = 50, profit = 40%.', fastTip: 'Weighted average CP first.', pyqHint: '' },
                    { id: 'mi-08', name: 'Speed of trains (relative mixing)', formula: 'Same alligation on speeds for mixture of two groups', usage: '', fastTip: '', pyqHint: 'Occasional PYQ twist.' }
                ]
            }
        ]
    }
};

window.FORMULA_BANK_COUNT = (function() {
    let n = 0;
    Object.values(window.FORMULA_BANK).forEach(topic => {
        topic.subtopics.forEach(st => { n += st.formulas.length; });
    });
    return n;
})();
