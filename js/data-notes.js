/* Concept notes 11 topics / 37 sections: Hindi headings, cleaned-English bodies. Auto-converted. */
const STUDY_NOTES = [
 {
  "id": "number-system",
  "name": "संख्या पद्धति",
  "minutes": "25 मिनट",
  "sections": [
   {
    "h": "1. संख्या जगत",
    "b": [
     "Every SSC number−system question is built on one tower: Natural numbers (N: 1, 2, 3...) sit inside Whole numbers (W: 0, 1, 2, 3...), which sit inside Integers (Z: negatives + positives + 0), inside Rationals (Q: p/q with q≠0), inside Reals (R). Memorize the inclusions cold: N ⊂ W ⊂ Z ⊂ Q ⊂ R.",
     "A rational number always has a decimal expansion that either terminates (denominator only 2s and 5s after reduction) or repeats (e.g. 1/3 = 0.333...). An irrational number — √2, √3, π, e — is non−terminating AND non−repeating. The classic trap: √16 = 4 is RATIONAL even though it looks like a root. Always check whether the root is a perfect square first.",
     "Face value is the digit itself; place value is digit × 10^(position). In 23576 the face value of 5 is 5, its place value is 500; place value of 3 is 3000. Count positions from the right, starting at 0."
    ]
   },
   {
    "h": "2. विभाज्यता — 4-सेकंड परीक्षण",
    "b": [
     "The single most tested skill in number system is instant divisibility checking. By 2: last digit even. By 3 and 9: sum of digits divisible by 3/9. By 4: last two digits divisible by 4. By 8: last three digits divisible by 8. By 5: last digit 0 or 5. By 11: difference between sum of alternate digits is 0 or a multiple of 11. By 7: drop the last digit, double it, subtract from the rest (161 → 16−2 = 14 ✓).",
     "Composite divisors split into CO−PRIME parts: 24 = 3 × 8, so a number is divisible by 24 iff it is divisible by 3 AND by 8. This is exactly how \"six−digit 11p9q4 divisible by 24\" works — check 3 (digit sum) and 8 (last three digits) separately and combine the constraints. Same logic: 36 = 4 × 9, 18 = 2 × 9, 12 = 3 × 4. The trap in every PYQ of this type is checking only one of the two factors."
    ]
   },
   {
    "h": "3. HCF और LCM — हर साल आने वाली सर्वसमिकाएँ",
    "b": [
     "For exactly two numbers: LCM × HCF = product of the numbers. This identity is the backbone of half the HCF−LCM PYQs. For fractions: LCM of fractions = LCM(numerators)/HCF(denominators); HCF of fractions = HCF(numerators)/LCM(denominators). And LCM(fracs) × HCF(fracs) = product of the fractions — the identity extends perfectly.",
     "The HCF of two numbers always divides their difference. So if N1 = 24, N2 = 36, the HCF must divide 12 — instantly cutting candidate work. When one divisor is a factor of another, remainders cascade: if N÷8 leaves 5, then N÷4 leaves 5÷4 → 1.",
     "Co−prime numbers have HCF 1; any two consecutive integers are automatically co−prime. LCM of co−primes is their product."
    ]
   },
   {
    "h": "4. गुणनखंड: गिनती, योग, सम, विषम",
    "b": [
     "If N = pᵃ × qᵇ × rᶜ, then the number of factors is (a+1)(b+1)(c+1) — e.g. 360 = 2³·3²·5 has (4)(3)(2) = 24 factors. The SUM of all factors is (1+p+...+pᵃ)(1+q+...+qᵇ)(1+r+...+rᶜ) — for 120 = 2³·3·5 that is 15 × 4 × 6 = 360.",
     "Sum of EVEN factors: drop the 2⁰ = 1 term from the 2−power bracket: (2+4+8)(1+3)(1+5) = 14 × 4 × 6 = 336. Equivalently total − odd−sum = 360 − 24 = 336. The examiner ALWAYS offers 360 as a trap option. Sum of ODD factors: use only odd−prime brackets: (1+3)(1+5) = 24.",
     "Trailing zeros of n! = ⌊n/5⌋ + ⌊n/25⌋ + ⌊n/125⌋ +... — count ALL extra 5s contributed by 25, 125 etc. 36! gives 7+1 = 8; 100! gives 20+4 = 24 (20 is the trap). Unit digits of powers cycle with period 4: 7²⁰²⁴ → 2024 mod 4 = 0 → last digit 1."
    ]
   },
   {
    "h": "5. शेषफल टूलकिट",
    "b": [
     "Big−exponent remainders (5³⁷ ÷ 8, 7¹⁰⁰ ÷ 4) are solved with cycles: compute a¹, a², a³, a⁴ mod m until the sequence repeats, then reduce the exponent modulo the cycle length. Products distribute: (a×b) mod m = [(a mod m)(b mod m)] mod m; sums distribute the same way.",
     "Polynomial remainder theorem: f(x) ÷ (x−a) leaves remainder f(a). So f(x) ÷ (x+2) → evaluate f(−2). Negative remainders appear in \"least residue\" style questions — if your remainder comes out negative, add the divisor."
    ]
   }
  ],
  "lang": "en"
 },
 {
  "id": "simplification",
  "name": "सरलीकरण",
  "minutes": "20 मिनट",
  "sections": [
   {
    "h": "1. VBODMAS — उत्तर तय करने वाला क्रम",
    "b": [
     "Vinculum (the bar) first, then Brackets — innermost before {} before, then Of (multiplication written as \"of\"), then Division, Multiplication, Addition, Subtraction in that left−to−right order. The PYQ trap is 7 − (5 − 4 with a bar over it): solve the bar expression first (5−4 = 1) then 7−1 = 6, not 7−5+4.",
     "Modulus bars mean magnitude only: |−3| = 3. When a bar sits over a whole expression, that expression is fully evaluated before anything touching it."
    ]
   },
   {
    "h": "2. वर्गमूल: 20 सेकंड बचाने वाले शॉर्टकट",
    "b": [
     "Perfect squares never end in 2, 3, 7 or 8 — that instantly eliminates options. Ending−digit rules: a square ending in 1 has a root ending in 1 or 9; ending in 4 → root ends 2 or 8; ending in 5 → 5; ending in 6 → 4 or 6; ending in 9 → 3 or 7. Combine with the digit−count rule (n digits: even n → n/2 root digits; odd n → (n+1)/2) to bracket the answer and check only one candidate.",
     "Rationalisation: 1/(a+√b) → multiply top and bottom by (a−√b); denominator becomes a²−b. Nested infinite radicals have a one−line trick: √(x+√(x+...)) equals the LARGER factor of x with difference 1 (√(12+√(12+...)) = 4), and √(x−√(x−...)) the smaller (√(30−√(30−...)) = 5). Derivation: set x = √(12+x) → x² = x + 12 → x = 4."
    ]
   },
   {
    "h": "3. घातांक व करणी नियम समूह",
    "b": [
     "pᵐ × pⁿ = pᵐ⁺ⁿ; pᵐ ÷ pⁿ = pᵐ⁻ⁿ; (pᵐ)ⁿ = pᵐⁿ; (pq)ⁿ = pⁿ qⁿ; p⁰ = 1; p⁻ⁿ = 1/pⁿ; p^(1/n) = ⁿ√p. Root laws: ⁿ√a × ⁿ√b = ⁿ√(ab); ⁿ√a ÷ ⁿ√b = ⁿ√(a/b); ᵐ√(ⁿ√a) = ᵐⁿ√a; (ⁿ√a)ᵐ = ⁿ√(aᵐ).",
     "The rationalising factor of √a is √a; of ∛a it is a^(2/3) — you need enough of the same root to make the index a multiple. For 5th−root of 3, multiply by (5th root of 3)⁴."
    ]
   },
   {
    "h": "4. मानक प्रसार शॉर्टकट",
    "b": [
     "(a+b)² + (a−b)² = 2(a²+b²); (a+b)² − (a−b)² = 4ab; a⁴−b⁴ = (a²+b²)(a+b)(a−b). If a question gives a+b and ab (or a−b and ab), the square identities give a²+b² immediately: a²+b² = (a+b)² − 2ab. Keep these four on automatic and simplification questions take 15–30 seconds each."
    ]
   }
  ],
  "lang": "en"
 },
 {
  "id": "algebra",
  "name": "बीजगणित",
  "minutes": "40 मिनट",
  "sections": [
   {
    "h": "1. SSC बीजगणित पर राज करने वाली सर्वसमिका",
    "b": [
     "a³ + b³ + c³ − 3abc = (a+b+c)(a²+b²+c²−ab−bc−ca). This single identity is responsible for a huge share of algebra PYQs. It has two equivalent right−hand forms: ½(a+b+c)[(a−b)²+(b−c)²+(c−a)²] and (a+b+c)[(a+b+c)² − 3(ab+bc+ca)].",
     "The KILLER special case: if a+b+c = 0, then a³+b³+c³ = 3abc, i.e. the whole expression equals 0. In exams: scan for a+b+c = 0 FIRST. If it is there, the answer is 0 in 10 seconds. The examiner deliberately gives you beautiful numbers (like a = 335, b = 215, c = 180 where 335+215−180 = 370≠0... but in many variants a+b−c = 0) so that mechanical expansion produces four large options and the shortcut produces the answer instantly. Variants to memorize: a−b−c = 0 → a³−b³−c³ = 3abc; a+b−c = 0 → a³+b³−c³ = 3abc. And the converse: if a³+b³+c³ = 3abc then either a = b = c or a+b+c = 0."
    ]
   },
   {
    "h": "2. x + 1/x श्रृंखला",
    "b": [
     "If x + 1/x = a, then: x²+1/x² = a²−2; x³+1/x³ = a³−3a; x⁴+1/x⁴ = (a²−2)²−2. If x − 1/x = a, then: x²+1/x² = a²+2; x³−1/x³ = a³+3a; x⁴+1/x⁴ = (a²+2)²−2. Build each power from the previous one — never expand from scratch.",
     "Special anchors: x+1/x = 2 → x = 1; = −2 → x = −1; = ±3 → x⁶ = −1; x+1/x = 1 → x³ = −1; = −1 → x³ = 1. For higher powers use x⁵+1/x⁵ = (x²+1/x²)(x³+1/x³) − (x+1/x) and similar product decompositions.",
     "Reciprocal conditions behave identically: if 1/a + 1/b = 1/(a−b) then a³+b³ = 0; if ab(a+b) = 1 then 1/a³ + 1/b³ − 1/(a³b³) = 3."
    ]
   },
   {
    "h": "3. समीकरण: मूल, विविक्तकर, संगति",
    "b": [
     "Quadratic ax²+bx+c = 0: sum of roots = −b/a, product = c/a. Cubic ax³+bx²+cx+d = 0: sum = −b/a, product = −d/a, pair−sum = c/a. Real & equal roots ↔ discriminant b²−4ac = 0 (the \"value of k\" questions); distinct real ↔ D>0; none ↔ D<0.",
     "Two linear equations a1x+b1y = c1, a2x+b2y = c2: unique solution when a1/a2 ≠ b1/b2; no solution (parallel) when a1/a2 = b1/b2 ≠ c1/c2; infinite solutions (coincident) when all three ratios equal. If x+y = a and xy = b are given, x and y are roots of t²−at+b = 0 — build the quadratic instead of solving the system directly."
    ]
   },
   {
    "h": "4. अनुपात नियम व असमिका शॉर्टकट",
    "b": [
     "Componendo−dividendo: if a/b = c/d then (a+b)/(a−b) = (c+d)/(c−d), and the converse. These four ratio rules (componendo, dividendo, componendo−dividendo, its inverse) turn two−line algebra into one.",
     "For positive x, y: if x+y is fixed, xy is maximized at x = y; if xy is fixed, x+y is minimized at x = y. And the algebra−geometry bridge: (x−a)²+(y−b)²+(z−c)² = 0 forces x = a, y = b, z = c — substitute and finish."
    ]
   }
  ],
  "lang": "en"
 },
 {
  "id": "ratio-proportion",
  "name": "अनुपात-समानुपात",
  "minutes": "25 मिनट",
  "sections": [
   {
    "h": "1. 12 अनुपात परिभाषाएँ",
    "b": [
     "In x:y, x is the antecedent, y the consequent. Duplicate ratio = x²:y²; sub−duplicate = √x:√y; triplicate = x³:y³; sub−triplicate = ∛x:∛y; inverse = y:x. Compound ratio of a:b, c:d, e:f is ace:bdf. Third proportional to a and b: a:b::b:x → x = b²/a. Fourth proportional to a, b, c: x = bc/a. Mean proportion of a, b = √(ab). Componendo−dividendo: a:b = c:d → (a+b)/(a−b) = (c+d)/(c−d).",
     "These definitions are asked DIRECTLY in SSC (\"the triplicate ratio of...\"), so rote mastery pays off with zero calculation."
    ]
   },
   {
    "h": "2. मिश्रण व सम्मिश्रण — दो मास्टर सूत्र",
    "b": [
     "Alligation: cheaper: dearer = (D−M): (M−C) where M is the mean price. This one rule solves price−mixing, concentration−mixing and ratio−mixing questions alike.",
     "The replace−and−repeat formula: if a container has x litres, you remove y litres and replace with water, repeated n times, pure liquid left = x(1 − y/x)ⁿ. This exact pattern appears in nearly every year's paper — learn it as a reflex.",
     "Two−container mixing: convert each container to a fraction (e.g. milk fraction 1/3 vs 4/5), then apply alligation on the fractions to find the mixing ratio; or weight the fractions by the mixing ratio to get the final concentration."
    ]
   },
   {
    "h": "3. आयु व औसत",
    "b": [
     "Average = sum/count. Weighted average: (A1W1+A2W2)/(W1+W2) — this is the engine behind mixture, speed and marks problems. For n consecutive numbers, mean = (first+last)/2.",
     "Age ratios: if the present ratio is a:b, then t years later it is (a+t):(b+t), and t years ago (a−t):(b−t). The difference between two people's ages NEVER changes — set the difference as your k and solve. Sum of ages from a ratio: split the total in the ratio."
    ]
   }
  ],
  "lang": "en"
 },
 {
  "id": "partnership",
  "name": "साझेदारी",
  "minutes": "15 मिनट",
  "sections": [
   {
    "h": "1. सब कुछ हल करने वाला एक सूत्र",
    "b": [
     "Profit ratio = ratio of equivalent investments, where equivalent investment = amount × time in months. Same time for all → profit ratio = capital ratio (simple partnership). Different times → multiply each capital by its months (compound partnership).",
     "Worked reflex: A, B, C invest ₹8000 each; A leaves after 6 months, B after 8 → ratio 6:8:12 = 3:4:6. Out of ₹7800 profit, B gets 8/26 × 7800 = ₹2400.",
     "When a partner joins mid−year (e.g. Chandan joins after 8 months with 3× Bhanu's capital): investment 4:5:15, time 12:12:4 → profit 48:60:60 = 4:5:5. Count ACTUAL months in the business, never assume 12."
    ]
   },
   {
    "h": "2. सक्रिय साझेदार व वेतन रूपांतर",
    "b": [
     "An active/working partner who manages the business typically gets a fixed percentage of the profit FIRST, and the remainder is divided in the capital ratio. Example: profit ₹1000, Rajesh gets 10% = ₹100 as manager; remaining ₹900 splits 5:4 (capitals 5000:4000) → Rajesh total = 100+500 = ₹600.",
     "Other variants: fixed salary to a partner is deducted before sharing; interest on capital at a given rate is credited/adjusted before the profit split. Always identify what the problem says is \"removed first\" and handle the remainder in the equivalent−investment ratio."
    ]
   }
  ],
  "lang": "en"
 },
 {
  "id": "trigonometry",
  "name": "त्रिकोणमिति",
  "minutes": "45 मिनट",
  "sections": [
   {
    "h": "1. अनुपात, पूरक, चिह्न",
    "b": [
     "In a right triangle with P (perpendicular), B (base), H (hypotenuse): sin = P/H, cos = B/H, tan = P/B, and reciprocals cosec, sec, cot. Tan = sin/cos. Complements: sinθ = cos(90°−θ), tanθ = cot(90°−θ). Negative angles: sin and tan are odd (sign flips), cos is even (unchanged). Quadrant signs follow CAST: all positive in Q1, sin in Q2, tan in Q3, cos in Q4.",
     "180°−θ keeps sin positive, flips cos and tan. 270°−θ converts sin → −cos, cos → −sin, tan → cot. These conversion tables are the first 10 seconds of every trig PYQ."
    ]
   },
   {
    "h": "2. मानक मान — कंठस्थ करें",
    "b": [
     "sin at 0, 30, 45, 60, 90: 0, ½, 1/√2, √3/2, 1. Cos is the mirror: 1, √3/2, 1/√2, ½, 0. Tan: 0, 1/√3, 1, √3, ∞. Mnemonic \"0 1 2 3 4\" → √n/2 for sin.",
     "Range facts that eliminate options instantly: sin and cos NEVER exceed 1 in magnitude (even powers ≥ 0, odd powers in [−1, 1]); sec and cosec always have |value| ≥ 1; tan and cot span all reals (odd powers) or [0, ∞) (even powers). For a·sinx ± b·cosx the maximum is √(a²+b²) and minimum −√(a²+b²). For a·sin²x + b·cos²x the max/min are the larger/smaller of a and b. For a·tan²x + b·cot²x the minimum is 2√(ab) (AM−GM at tan²x = √(b/a))."
    ]
   },
   {
    "h": "3. तीन मूल सर्वसमिकाएँ",
    "b": [
     "sin²θ + cos²θ = 1; sec²θ − tan²θ = 1; cosec²θ − cot²θ = 1. Everything else derives from these: 1+tan²θ = sec²θ; sinθ = tanθ/cosecθ... The exam pattern is \"if sinθ =... find the value of an expression\" — rewrite every term in one ratio, substitute, simplify. If you see sin²+cos² you should see 1 within a second."
    ]
   },
   {
    "h": "4. संयुक्त कोण व गुणन श्रृंखलाएँ",
    "b": [
     "sin(A±B) = sinAcosB ± cosAsinB; cos(A±B) = cosAcosB ∓ sinAsinB; tan(A±B) = (tanA±tanB)/(1∓tanAtanB). Double angles: sin2A = 2sinAcosA; cos2A = cos²A−sin²A = 1−2sin²A = 2cos²A−1 = (1−tan²A)/(1+tan²A); tan2A = 2tanA/(1−tan²A). Triple: sin3A = 3sinA−4sin³A; cos3A = 4cos³A−3cosA.",
     "Product chains that appear as \"prove\" or \"value\" questions: sinθ·sin2θ·sin4θ = sin3θ/4; cosθ·cos2θ·cos4θ = cos3θ/4; tanθ·tan2θ·tan4θ = tan3θ. Sum−to−product: sinC+sinD = 2sin((C+D)/2)cos((C−D)/2); cosC−cosD = −2sin((C+D)/2)sin((C−D)/2)."
    ]
   },
   {
    "h": "5. विशेष परिणाम समूह",
    "b": [
     "If A+B+C = 180° (triangle angles): tanA+tanB+tanC = tanA·tanB·tanC and cotA·cotB+cotB·cotC+cotC·cotA = 1. If A+B+C = 90°: tanAtanB+tanBtanC+tanCtanA = 1 and cotA+cotB+cotC = cotA·cotB·cotC. If A+B = 45°: (1+tanA)(1+tanB) = 2.",
     "The two−line system: if a sinX + b cosX = m and a cosX − b sinX = n, then a²+b² = m²+n². Example: 3sinθ+5cosθ = 5 → 3cosθ−5sinθ = ±√(9+25−25) = ±3. The sec−tan version: a secX + b tanX = m, a tanX − b secX = n → a²−b² = m²−n² (e.g. 29secθ−21tanθ = 20 → 29tanθ−21secθ = ±20). And conjugates: (secx+tanx)(secx−tanx) = 1; (cosecx+cotx)(cosecx−cotx) = 1."
    ]
   }
  ],
  "lang": "en"
 },
 {
  "id": "heights-distances",
  "name": "ऊँचाई-दूरी",
  "minutes": "20 मिनट",
  "sections": [
   {
    "h": "1. स्वतः याद होनी वाली परिभाषाएँ",
    "b": [
     "Angle of elevation: line of sight UP from horizontal. Angle of depression: line of sight DOWN from horizontal. The elevation of an object seen from above equals the depression seen from below (alternate interior angles) — this single fact half−solves tower questions. Coming closer increases the elevation angle; moving away decreases it."
    ]
   },
   {
    "h": "2. अनुपातों सहित पाँच मानक स्थितियाँ",
    "b": [
     "Case 1 (45°): height = distance (tan45 = 1). Case 2 (30°): height = distance/√3. Case 3 (ladder at 15°): ratio (√3+1): 2√2. Case 4 (car approaches tower, depression 30°→45°): total distance covered = H(√3−1) — per unit height the car covers √3−1. Case 5 (30°→60°): distance = H(√3 − 1/√3) = 2H/√3.",
     "Shadow problems: shadow length = height/tan(altitude). \"Shadow is 40 m longer when altitude is 30° than 45°\": H/tan30 − H/tan45 = 40 → H(√3−1) = 40 → H = 40/(√3−1) = 20(√3+1) ≈ 54.6 m. Always set up the difference equation — the options are engineered for the unsimplified form (20(√3+1) etc.)."
    ]
   }
  ],
  "lang": "en"
 },
 {
  "id": "geometry",
  "name": "ज्यामिति",
  "minutes": "60 मिनट",
  "sections": [
   {
    "h": "1. रेखाएँ, कोण, तिर्यक",
    "b": [
     "Parallel lines cut by a transversal give: corresponding angles equal (∠1 = ∠5 etc.), alternate angles equal (∠1 = ∠7, ∠2 = ∠8), vertically opposite equal, and same−side interior angles summing to 180°. The bisectors of same−side interior angles meet at 90°. Classic PYQ: same−side interior angles differ by 40° → they are 110° and 70°, smallest = 70°.",
     "Angle vocabulary: acute <90°, right 90°, obtuse 90–180°, straight 180°, reflex 180–360°, complete 360°. Complementary pairs sum to 90°, supplementary to 180°."
    ]
   },
   {
    "h": "2. त्रिभुज — ज़रूरी 20 परिणाम",
    "b": [
     "Core: angles sum 180°; any two sides sum to more than the third; difference less than the third; exterior angle = sum of the two interior opposite angles; bigger angle opposite bigger side. If AM bisects ∠A and AN⊥BC, then ∠MAN = (∠B−∠C)/2 — a direct−mark result.",
     "Right−triangle toolkit: median to hypotenuse = half the hypotenuse; altitude to hypotenuse h = (product of legs)/hypotenuse; leg² = adjacent segment × hypotenuse (AB² = BD·BC); altitude² = BD·DC.",
     "Centres and radii: incenter I (angle bisectors) with ∠BIC = 90° + A/2; excenter with 90° − A/2; centroid divides medians 2:1, six equal areas, median−triangle area = ¾ of original; circumcenter O with R = abc/(4·Area) and OI² = R² − 2Rr. Inradius r = Area/s; right−triangle shortcut r = (p+b−h)/2.",
     "Bisector theorems: internal AB:AC = BD:DC, external the same externally. Thales: DE∥BC → AD:DB = AE:EC. Congruency: SSS, SAS, ASA, RHS. Similarity: area ratio = (side ratio)², perimeter ratio = side ratio. Sine rule a/sinA = 2R; cosine rule cosA = (b²+c²−a²)/2bc; Apollonius AB²+AC² = 2(AD²+BD²). In an equilateral triangle all four centres coincide and any interior point's distance−sum to the sides equals the altitude (Viviani)."
    ]
   },
   {
    "h": "3. वृत्त — अंक दिलाने वाले गुण",
    "b": [
     "Angles in the same segment are equal; angle in a semicircle (diameter as base) is 90°; intersecting chords: AE·EB = CE·ED; tangent ⊥ radius at contact; two tangents from an external point are equal (PA = PB) and the line to the centre bisects the angle; tangent−secant: PT² = PB·PA; alternate segment theorem: angle between tangent and chord equals the angle in the alternate segment.",
     "Two circles: external touch → centre distance = R+r; internal touch → |R−r|. Direct common tangent length = √(d²−(R−r)²); transverse = √(d²−(R+r)²). Number of common tangents: d>R+r → 4, d = R+r → 3, between → 2, internal touch → 1, one inside other → 0. NEVER assume touching — check d against R+r first.",
     "Cyclic quadrilateral: opposite angles sum 180°; Ptolemy AC·BD = AB·CD + BC·AD. Intersecting chords angle = ½(sum of the two central angles); external = ½(difference). Intersecting−chords angle at a point: ∠BPD = (x+y)/2."
    ]
   },
   {
    "h": "4. चतुर्भुज व बहुभुज",
    "b": [
     "Parallelogram: opposite sides equal and parallel, opposite angles equal, diagonals bisect each other, AB²+BC²+CD²+AD² = AC²+BD², area = base×height. Rhombus: 4a² = d1²+d2², diagonals ⊥ and bisect, area = d1·d2/2. Rectangle: diagonals equal. Square: diagonals = a√2, area = d²/2. Trapezium: area = (a+b)h/2; midline = (AB+DC)/2; difference−of−parallel−sides half = PQ.",
     "Regular n−gon: each exterior angle 360°/n; interior = 180° − 360°/n; sum of interior angles (n−2)×180°; diagonals n(n−3)/2. Hexagon area = (3√3/4)a²; pentagon ≈ 1.72a²."
    ]
   },
   {
    "h": "5. निर्देशांक त्वरित उपकरण",
    "b": [
     "Distance √((x2−x1)²+(y2−y1)²); midpoint averaging; section formula for m:n division; slope = Δy/Δx (parallel → equal slopes, perpendicular → product −1); triangle area = ½|x1(y2−y3)+x2(y3−y1)+x3(y1−y2)|; collinear when that area is 0."
    ]
   }
  ],
  "lang": "en"
 },
 {
  "id": "mensuration",
  "name": "क्षेत्रमिति",
  "minutes": "50 मिनट",
  "sections": [
   {
    "h": "1. 2D आकृतियाँ — मुख्य तालिका",
    "b": [
     "Triangle: ½bh; equilateral (√3/4)a² with height (√3/2)a, inradius a/(2√3), circumradius a/√3; Heron √(s(s−a)(s−b)(s−c)); isosceles (b/4)√(4a²−b²); right triangle with r = (p+b−h)/2, R = h/2. Memorize the 8 Pythagoras triplets: (3, 4, 5), (5, 12, 13), (7, 24, 25), (8, 15, 17), (9, 40, 41), (12, 35, 37), (11, 60, 61), (20, 21, 29) — recognition alone saves half a minute.",
     "Quadrilaterals: parallelogram base×height with d1²+d2² = 2(a²+b²); rhombus d1·d2/2 and 4a² = d1²+d2²; trapezium (a+b)h/2; rectangle L×B, diagonal √(L²+B²), walls 2(L+B)H; square a² = d²/2.",
     "Circle: πr², 2πr; arc 2πr·θ/360; sector πr²·θ/360; ring π(R²−r²). Pathway tricks: outer path 2x(L+B+2x), inner 2x(L+B−2x), two crossing paths x(L+B−x). Square inscribed in circle: area 2r². Largest triangle in semicircle: r²."
    ]
   },
   {
    "h": "2. 3D ठोस — आयतन व पृष्ठ तालिका",
    "b": [
     "Cube a³ / 6a² / diagonal a√3. Cuboid lbh / 2(lb+bh+lh) / diagonal √(l²+b²+h²). Box capacity (l−2t)(b−2t)(h−2t); material = external − capacity. Cylinder πr²h / 2πrh / TSA 2πr(h+r). Hollow cylinder π(R²−r²)h / CSA 2π(R+r)h. Prism: volume = base area × height; lateral = perimeter × height; total = lateral + 2 bases. Example: equilateral triangle base side 4, LSA 120 → height 10 → volume = (√3/4)·16·10 = 40√3.",
     "Cone: (1/3)πr²h, slant l = √(r²+h²), CSA πrl, TSA πr(l+r). Rotating a right triangle about a side gives a cone — about height a: (1/3)πb²a; about base b: (1/3)πa²b; about hypotenuse: (1/3)π(ab/c)²·c. Pyramid (1/3)×base×h. Regular tetrahedron: V = a³/(6√2), TSA = √3a², height a√6/3. Frustum of cone: V = (πh/3)(R²+r²+Rr), CSA = π(R+r)l. Sphere (4/3)πr³ / 4πr²; shell (4/3)π(R³−r³). Hemisphere (2/3)πr³ / TSA 3πr² / CSA 2πr²."
    ]
   },
   {
    "h": "3. प्रतिशत-परिवर्तन शॉर्टकट व इकाइयाँ",
    "b": [
     "If length increases a% and breadth b%, area increases (a + b + ab/100)%. If ALL sides change by a%, area changes by (2a + a²/100)% and perimeter by exactly a%. Use negative a for decreases. A circle from the same perimeter as a square has area (π/4)×square area — the circle always wins.",
     "Units: 1/m³ = 1000 L; 1/L = 1000 cm³; 1 km/h = (5/18) m/s. Keep these three conversions reflex — they appear inside every train and capacity question."
    ]
   }
  ],
  "lang": "en"
 },
 {
  "id": "hcf-lcm",
  "name": "HCF-LCM",
  "minutes": "15 मिनट",
  "sections": [
   {
    "h": "1. विधियाँ",
    "b": [
     "Prime−factorisation: HCF = product of common primes at minimum powers; LCM = product of all primes at maximum powers. Division method iterates HCF(a, b) then HCF(result, c). HCF of two primes (or co−primes) is 1."
    ]
   },
   {
    "h": "2. पाँच सर्वसमिकाएँ",
    "b": [
     "LCM × HCF = product (two numbers only). HCF always divides the difference of the numbers. LCM of fractions = LCM(num)/HCF(den); HCF of fractions = HCF(num)/LCM(den). Product of LCM and HCF of fractions = product of the fractions. If N1 = Hx and N2 = Hy with HCF H, then LCM = H·LCM(x, y) and difference = H(x−y).",
     "Repeated−division remainder rule: if d2 divides d1, the remainder of N÷d2 is the remainder of (N÷d1 remainder) ÷ d2 — e.g. 29÷8 leaves 5, so 29÷4 leaves 1. \"Greatest number leaving the same remainder r\" = HCF of (N1−r, N2−r, ...); \"least number leaving remainder r\" = LCM of divisors + r."
    ]
   }
  ],
  "lang": "en"
 },
 {
  "id": "mixture-alligation",
  "name": "मिश्रण",
  "minutes": "15 मिनट",
  "sections": [
   {
    "h": "1. मिश्रण नियम",
    "b": [
     "Cheaper: Dearer = (D−M): (M−C). This applies to prices, concentrations, and fractions alike. Worked: containers A (milk 1:2 → fraction 1/3), B (4:1 → 4/5) mixed to get C (4:5 → 4/9): ratio = (4/5 − 4/9): (4/9 − 1/3) = (16/45): (1/9) = 16:5.",
     "Blending in a fixed ratio: weight the fractions. A (3/4) and B (4/5) in ratio 2:1 → milk = (2·3/4 + 1·4/5)/(3) = (3/2+4/5)/3 = (15/10+8/10)/3 = 23/30 → milk:water = 23:7."
    ]
   },
   {
    "h": "2. प्रतिस्थापन सूत्र",
    "b": [
     "Pure liquid left after n remove−and−replace operations = x(1 − y/x)ⁿ where x = original volume, y = removed each time. Example: 30 L milk, remove 3 L and add 3 L water, three times → 30(1−3/30)³ = 30(0.9)³ = 21.87 L milk.",
     "Cost of mixture: CP per unit = (A1W1 + A2W2)/(W1+W2). ₹4/kg and ₹5/kg in 3:2 → (12+10)/5 = ₹4.4/kg."
    ]
   }
  ],
  "lang": "en"
 }
];
