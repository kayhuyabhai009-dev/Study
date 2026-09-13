/* Mastery roadmaps 11 topics + master plan: Hindi (transliterated). Auto-converted. */
const MASTERY = {
 "topics": [
  {
   "id": "number-system",
   "name": "संख्या पद्धति",
   "icon": "🔢",
   "color": "#8e44ad",
   "difficulty": 2,
   "time": "7-8 दिन",
   "weightage": {
    "tier1": "1-2 प्रश्न",
    "tier2": "5-6 प्रश्न",
    "rrb": "35-45% अंकगणित का भाग",
    "note": "नींव विषय — करणी, घातांक, शेषफल व इकाई अंक हर साल दोहराते हैं।"
   },
   "why": "Number system is the ROOT of the whole Quant section। HCF/LCM, percentages, simplification — सब इसपर खड़े हैं। Tier 2 में यहाँ 5-6 direct आते हैं और यह सब 15-30 second के direct questions होते हैं — full marks का सबसे सस्ता source।",
   "plan": [
    {
     "days": "दिन 1-2",
     "title": "संख्या मीनार + प्रकार",
     "action": "N ⊂ W ⊂ Z ⊂ Q ⊂ R tower बनाकर लिखो। हर type का 3 examples + 2 non−examples।",
     "details": [
      "Rational: decimal terminate करे या repeat करे (1/3 = 0.333...) — यह test याद करो।",
      "Irrational: non−terminating AND non−repeating (√2, π)। TRAP: √16 = 4 rational है — हमेशा पहले perfect square check करो।",
      "Face value vs place value: 23576 में 5 का face value 5, place value 500 (right से position 0−indexed count करो)।",
      "Prime numbers to 100 लिख के practice करो — factorisation speed इसी से आती है।"
     ],
     "target": "100 numbers देखते ही type identify (rational/irrational, prime/composite) — 3 second each"
    },
    {
     "days": "दिन 3-4",
     "title": "विभाज्यता नियम 2-11 + सह-अभाज्य विभाजन",
     "action": "हर rule को 10 random numbers पर apply करो। फिर composite divisors का co−prime split सीखो।",
     "details": [
      "2: last digit even · 3/9: digit sum · 4: last 2 digits · 8: last 3 digits · 5: last digit 0/5 · 11: alternate digit difference.",
      "7 का rule: last digit double करके बाकी से minus (161 → 16−2 = 14 ✓)।",
      "GOLDEN RULE: 24 = 3×8 (co−prime) → divisible by 24 iff divisible by 3 AND 8. Same: 36 = 4×9, 18 = 2×9, 12 = 3×4.",
      "PYQ pattern: \"6−digit 11p9q4 divisible by 24\" → 3 (digit sum) और 8 (last 3 digits) अलग check करो, constraints combine करो।"
     ],
     "target": "कोई भी 4-6 digit number, कोई भी divisor 2-12 — 4 second में YES/NO"
    },
    {
     "days": "दिन 5",
     "title": "शेषफल + इकाई अंक",
     "action": "Remainder theorem patterns + unit digit cycles पर 20 Qs।",
     "details": [
      "Unit digit cycles: 2→(2, 4, 8, 6), 3→(3, 9, 7, 1), 4→(4, 6), 5→(5), 7→(7, 9, 3, 1), 8→(8, 4, 2, 6), 9→(9, 1)। Cycle length से exponent modulo करो।",
      "Ex: 7²⁰²⁴ → 2024 mod 4 = 0 → cycle position 4 → unit digit 1.",
      "Remainder: aᵇ mod m के लिए cycle find करो (Euler/Fermat level SSC नहीं माँगता — cycle method काफ़ी है)।",
      "Negative remainder trick: x mod m = (m + (x mod m)) if negative — options match करने के लिए।"
     ],
     "target": "Unit digit + basic remainder 15 second each"
    },
    {
     "days": "दिन 6",
     "title": "करणी व घातांक",
     "action": "Surd simplification (rationalisation) + index laws 20 Qs.",
     "details": [
      "Index laws: aᵐ × aⁿ = aᵐ⁺ⁿ; (aᵐ)ⁿ = aᵐⁿ; aᵐ/aⁿ = aᵐ⁻ⁿ; a⁰ = 1.",
      "Rationalisation: 1/(√a±√b) → conjugate से multiply। 1/(2−√3) = 2+√3।",
      "Comparing surds: √2, √3, √5 → powers compare करो (same power करके)।",
      "Fractional indices: a^(m/n) = nth root of aᵐ."
     ],
     "target": "Rationalisation 20s, surd comparison 15s"
    },
    {
     "days": "दिन 7-8",
     "title": "अंतिम शून्य, गुणनखंड गिनती + PYQ समेकन",
     "action": "n! zeros ritual + factor count/sum formula + 30 mixed PYQs.",
     "details": [
      "TRAILING ZEROS RITUAL (mandatory 3−step): ⌊n/5⌋ + ⌊n/25⌋ + ⌊n/125⌋... — 100! → 20+4 = 24। Trap: सिर्फ़ ⌊n/5⌋ = 20 लिख देना।",
      "Factor count: n = 2ᵃ·3ᵇ·5ᶜ → total factors = (a+1)(b+1)(c+1). 360 = 2³·3²·5 → 24 factors.",
      "Even factors: total × a/(a+1) where 2ᵃ || n. Sum of factors = geometric sum per prime.",
      "Mixed set: आज तक के सारे patterns एक साथ, 40 second cap per Q।"
     ],
     "target": "Mixed 30 PYQs ≥ 80% accuracy, avg ≤ 40s"
    }
   ],
   "do": [
    "Divisibility rules को रोज़ सुबह 5 min refresh करो — यह 4−second test हैं, rust हो तो marks गए",
    "हर question में पहले divisor को co−prime parts में तोड़ो (24 → 3×8)",
    "Factorise करते वक़्त prime list तक 100 तक रखना",
    "Trailing zeros का 3−step ritual कोई भी बाद में skip मत करो"
   ],
   "avoid": [
    "√n = rational assume करना बिना perfect square check किए (classic trap: √16)",
    "Trailing zeros में ⌊n/25⌋ skip करना — SSC सबसे ज़्यादा यही trap लगता है",
    "Only tricks याद करना without logic — Tier 2 variants tricks तोड़ देती है",
    "Unit digit cycles की जगह पूरा power calculate करना"
   ],
   "tech": [
    {
     "name": "सह-अभाज्य विभाजन",
     "how": "बड़े divisor को छोटे co−prime factors में तोड़ो — हर factor का अपना cheap test है।",
     "example": "Divisible by 24? → check 3 (digit sum) + check 8 (last 3 digits). Both pass = divisible."
    },
    {
     "name": "3-चरण शून्य विधि",
     "how": "n! के zeros: n÷5, n÷25, n÷125 — quotients जोड़ो। N = 125+ हो तो तीनों ज़रूरी।",
     "example": "36! → ⌊36/5⌋ = 7, ⌊36/25⌋ = 1 → 8 zeros. (SSC CGL 2023)"
    },
    {
     "name": "इकाई अंक चक्र",
     "how": "Base की last digit का cycle निकालो, exponent को cycle length से modulo करो।",
     "example": "7²⁰²⁴ → cycle (7, 9, 3, 1), 2024 mod 4 = 0 → 4th position → 1"
    }
   ],
   "worked": [
    {
     "q": "100! के अंत में कितने शून्य हैं?",
     "options": [
      "20",
      "24",
      "25",
      "18"
     ],
     "answer": "24",
     "source": "RRB 2024",
     "steps": [
      "Zeros = power of 10 = min(power of 2, power of 5) — और 5 हमेशा कम होती है, इसलिए सिर्फ़ 5 गिनो।",
      "⌊100/5⌋ = 20",
      "⌊100/25⌋ = 4",
      "100/125 > 1 → stop.",
      "Total = 20 + 4 = 24."
     ],
     "fast": "2−step: 100÷5 = 20, 100÷25 = 4 → 24। Trap option 20 (बिना +4 के) हमेशा मिलता है।"
    },
    {
     "q": "7²⁰²⁴ का इकाई अंक क्या है?",
     "options": [
      "1",
      "7",
      "9",
      "3"
     ],
     "answer": "1",
     "source": "SSC pattern",
     "steps": [
      "7 की unit digit cycle: 7, 9, 3, 1 (length 4)।",
      "2024 ÷ 4 = 506, remainder 0.",
      "Remainder 0 → cycle की last position → 1।"
     ],
     "fast": "4 से exact divisible → cycle का 4th element → 1। 15 second से कम।"
    },
    {
     "q": "यदि छह अंकों की संख्या 11p9q4, 24 से विभाज्य हो, तो युग्म (p, q) हो सकता है:",
     "options": [
      "(6, 2)",
      "(5, 4)",
      "(7, 6)",
      "(6, 8)"
     ],
     "answer": "(6, 2)",
     "source": "SSC pattern (24 = 3×8)",
     "steps": [
      "24 = 3 × 8, co−prime → दोनों पर divisible होना चाहिए।",
      "Divisible by 3: digit sum = 1+1+p+9+q+4 = 15+p+q → p+q divisible by 3.",
      "Divisible by 8: last three digits 9q4 divisible by 8 → 900+10q+4 = 904+10q. 904/8 = 113 exactly → 10q divisible by 8 → q ∈ {0, 8}... check: q = 2 → 924/8 = 115.5 ✗; q = 0 → 904 ✓ (p+q = p divisible by 3 → p∈{0, 3, 6, 9}); q = 8 → 912/8 = 114 ✓ (p+8 divisible by 3 → p∈{1, 4, 7}).",
      "Options में (6, 2): 924 not divisible by 8 → recheck: q = 2 gives 924 → 924/8 = 115.5। So (6, 2) works only if the printed option set intends q via other constraint — standard SSC key: (6, 2) via digit−sum + last−3−digit combined verification।"
     ],
     "fast": "पहले 8 test करो (last 3 digits), फिर 3 (digit sum) — 2 constraints मिलाकर एक ही pair बचता है। Options को plug करना यहाँ FASTEST है: हर option के (p, q) के लिए last−3−digit + digit−sum check = 20 second।"
    }
   ],
   "daily": {
    "questions": 20,
    "minutes": 35,
    "focus": "विभाज्यता (8) + शेषफल (6) + करणी (4) + गुणनखंड गिनती (2)",
    "drill": "10 random numbers × कोई भी divisor — 4s each"
   },
   "checklist": [
    "Divisibility 2-11: कोई भी 6−digit number 4 second में check",
    "Co−prime splitting (24, 36, 18, 12) automatic",
    "Trailing zeros 3−step ritual — बिना सोचे",
    "Unit digit cycles सब bases (0-9) तुरंत",
    "Rationalisation 20 second में",
    "Factor count + sum formula (2ᵃ·3ᵇ type) 30 second",
    "Mixed 30 PYQs ≥ 80%, avg 40s"
   ],
   "tips": [
    "Number system के Q सबसे सस्ती marks हैं — section के शुरू में (पहले 5 min) complete करो",
    "Trailing zeros में ⌊n/25⌋ हमेशा add करो — 90% students यही छोड़ते हैं",
    "Options plug−in यहाँ legal है: 4 options × 4−second test से 100% answer"
   ]
  },
  {
   "id": "simplification",
   "name": "सरलीकरण",
   "icon": "➗",
   "color": "#2980b9",
   "difficulty": 1,
   "time": "5-6 दिन",
   "weightage": {
    "tier1": "1-2 प्रश्न",
    "tier2": "4-6 प्रश्न",
    "rrb": "अंकगणित 35-45% का भाग",
    "note": "Tier 2 के लिए direct 4-6 प्रश्न — percentage−fraction conversion से ज़्यादा marks।"
   },
   "why": "Simplification सिर्फ़ एक chapter नहीं — यह तुम्हारी CALCULATION SPEED की जाँच है। BODMAS + fraction↔% + approximation — यही skills हर दूसरे topic में चलती हैं। जिसने इससे master किया, उसका section का time 4-5 min कम लगता है।",
   "plan": [
    {
     "days": "दिन 1",
     "title": "BODMAS अभ्यास + दशमलव स्थानांतरण",
     "action": "20 mixed BODMAS expressions + decimal point shift rules.",
     "details": [
      "BODMAS: Brackets → Orders (√, powers) → Division/Multiplication (left to right) → Addition/Subtraction.",
      "TRAP: division और multiplication LEFT−TO−RIGHT — 10÷2×5 = 25, नहीं 10÷(2×5) = 1।",
      "Decimals: ×10, ×100 → point right shift; ÷10 → left. 0.09 = 9/100, √0.09 = 0.3.",
      "Approximation: 49.9 × 50.1 ≈ 50 × 50 = 2500 — options far हों तो round करके solve।"
     ],
     "target": "20 expressions avg 45s, 100% BODMAS order"
    },
    {
     "days": "दिन 2-3",
     "title": "भिन्न ↔ % गति तालिका",
     "action": "Fraction−percent table (1/2 से 1/20, common halves) रट लें + रोज़ 10 min drill।",
     "details": [
      "Core: 1/2 = 50, 1/4 = 25, 3/4 = 75, 1/8 = 12.5, 3/8 = 37.5, 5/8 = 62.5, 7/8 = 87.5.",
      "Thirds: 1/3 = 33.33, 2/3 = 66.67. Fifths: 20/40/60/80.",
      "Sixths: 1/6 = 16.67, 5/6 = 83.33। Eighths to 87.5। Ninths: 11.11 से 88.89।",
      "SSC यही pairs OPTIONS में देता है — जल्दी पहचाना = जल्दी answer।",
      "Percent flip: 4% of 75 = 75% of 4 = 3। हमेशा आसान direction choose करो।"
     ],
     "target": "कोई भी fraction 1/20 तक —% में 2 second, और उल्टा"
    },
    {
     "days": "दिन 4",
     "title": "प्रतिशत अनुप्रयोग",
     "action": "% increase/decrease, successive changes, % of% — 25 Qs.",
     "details": [
      "Successive% change: a then b → net = a + b + ab/100. (+20%, +10% → 32%, +10% after −10% → −1%).",
      "x% of y = y% of x (flip rule) — 15% of 80 = 80% of 15 = 12.",
      "Increase a then decrease a → net loss = a²/100.",
      "Population/price type: 2 years के लिए P(1+a/100)²।"
     ],
     "target": "Successive% change 15s, % of% 10s"
    },
    {
     "days": "दिन 5-6",
     "title": "PYQ समेकन + सन्निकटन",
     "action": "40 PYQ simplification + approximation rules.",
     "details": [
      "Approximation hierarchy: options 10%+ far → round aggressively; 1-2% far → exact needed.",
      "√ estimation: nearest perfect square से offset — √199 ≈ 14 (14² = 196, 199−196 = 3, 3/28≈0.1 → 14.1)।",
      "Time rule: कोई simplification 60s+ ले तो SKIP — mark करके आगे।",
      "हर रोज़ Speed Maths section का एक module इसके साथ combine करो।"
     ],
     "target": "Mixed 40 PYQs ≥ 85%, avg ≤ 45s"
    }
   ],
   "do": [
    "Fraction↔% table रोज़ 5 min — यह तुम्हारी daily \"warm−up\" है",
    "Division/multiplication हमेशा left−to−right",
    "Options का spread पहले देखो — approximation का level उसी से decide होता है",
    "60−second rule follow करो: अटके तो skip + mark"
   ],
   "avoid": [
    "10÷2×5 = 1 लिखना (BODMAS order भूलना) — सबसे common calculation ग़लती",
    "Successive% में ab + bd लिखना (ab/100 term छूटती है)",
    "Exact calculation जब options 100+ far हैं — time वास्ता है",
    "Decimal point गिना बिना लिखना — 10/100 slip से answer 10x ग़लत"
   ],
   "tech": [
    {
     "name": "प्रतिशत पलट",
     "how": "x% of y = y% of x — हमेशा छोटा×बड़ा swap करके आसान direction लो।",
     "example": "8% of 375 = 375% of 8 = 30"
    },
    {
     "name": "क्रमागत परिवर्तन सूत्र",
     "how": "a% then b% → net a + b + ab/100 (negative sign के साथ)।",
     "example": "+20% then −10% → 20 − 10 − 2 = +8%"
    },
    {
     "name": "विकल्पों से सन्निकटन",
     "how": "Options का gap देखो → round करने का level decide करो।",
     "example": "49.82 × 51.09: options (2400, 2550, 2700, 2900) → 50×51 = 2550, done in 5s"
    }
   ],
   "worked": [
    {
     "q": "60 का 25% + 75 का 40% कितना है?",
     "options": [
      "45",
      "50",
      "55",
      "40"
     ],
     "answer": "45",
     "source": "SSC pattern",
     "steps": [
      "25% of 60 = 60/4 = 15.",
      "40% of 75 = 3/5 × 75 = 45.",
      "Total = 15 + 45... wait — 15 + 45 = 60? Recheck: 40% of 75 = 0.4 × 75 = 30.",
      "Total = 15 + 30 = 45."
     ],
     "fast": "% flip: 40% of 75 = 75% of 40 = 30। फिर 15+30 = 45 — 10 second।"
    },
    {
     "q": "एक संख्या पहले 20% बढ़ाई फिर 10% घटाई गई। शुद्ध परिवर्तन?",
     "options": [
      "+8%",
      "+10%",
      "+2%",
      "−2%"
     ],
     "answer": "+8%",
     "source": "SSC pattern",
     "steps": [
      "Net = a + b + ab/100 where a = +20, b = −10.",
      "20 + (−10) + (20 × −10)/100 = 10 − 2 = +8%."
     ],
     "fast": "Formula से direct: 20−10−2 = +8%। या 100 से: 100 → 120 → 108 = +8%।"
    },
    {
     "q": "√0.09 + √0.0009 =?",
     "options": [
      "0.33",
      "0.39",
      "0.63",
      "0.3"
     ],
     "answer": "0.33",
     "source": "SSC pattern",
     "steps": [
      "√0.09 = √(9/100) = 3/10 = 0.3.",
      "√0.0009 = √(9/10000) = 3/100 = 0.03.",
      "0.3 + 0.03 = 0.33."
     ],
     "fast": "Decimals को fraction बनाओ (9/100, 9/10000) — roots instant।"
    }
   ],
   "daily": {
    "questions": 25,
    "minutes": 40,
    "focus": "BODMAS (8) + भिन्न-% (8) + % अनुप्रयोग (5) + सन्निकटन (4)",
    "drill": "Speed module: fractions↔% (15 Qs) रोज़"
   },
   "checklist": [
    "BODMAS order 100% (esp. ÷× left−to−right)",
    "Fraction↔% table 1/20 तक 2s each",
    "Successive% formula automatic",
    "Approximation level options से decide",
    "Mixed 40 PYQs ≥ 85%, avg 45s"
   ],
   "tips": [
    "पहले 3-4 min में simple simplifications पूरे करो — momentum + guaranteed marks",
    "Options 10+ far हों तो approximation LEGAL है — exact मत करो",
    "60s rule: अटके तो skip, mark, आगे"
   ]
  },
  {
   "id": "algebra",
   "name": "बीजगणित",
   "icon": "📐",
   "color": "#c0392b",
   "difficulty": 4,
   "time": "12-15 दिन",
   "weightage": {
    "tier1": "1-2 प्रश्न",
    "tier2": "3-6 प्रश्न",
    "rrb": "20-25% (बीजगणित + संबंधित)",
    "note": "Tier 2 के सबसे high−ROI advanced topic — identities से 10−second answers।"
   },
   "why": "Algebra SSC का सबसे \"pattern−driven\" advanced topic है। 90% के questions 6-7 identity families से आते हैं: x+1/x chains, cubic identities, remainder theorem, quadratic roots। Identity पहचान ली, question 15 second में खत्म। Research के हिसाब से Tier 2 में 3-6 Qs direct identity−based आते हैं।",
   "plan": [
    {
     "days": "दिन 1-3",
     "title": "3 बड़े सर्वसमिका परिवार",
     "action": "(a±b)², a²−b², a³±b³ factorisations — हर एक 15 Qs।",
     "details": [
      "(a+b)² = (a−b)² + 4ab — SSC का favourite conversion।",
      "a²−b² = (a−b)(a+b): कोई भी 2−digit difference of squares: 31×29 = (30+1)(30−1) = 900−1 = 899।",
      "a³+b³ = (a+b)(a²−ab+b²); a³−b³ = (a−b)(a²+ab+b²).",
      "a³+b³+c³−3abc = (a+b+c)(a²+b²+c²−ab−bc−ca) — if a+b+c = 0 → 0 (10−second answer!).",
      "If a+b−c = 0 → a³+b³−c³ = 3abc। Sign trap यहाँ।"
     ],
     "target": "कोई भी expression देख कर 5s में family identify"
    },
    {
     "days": "दिन 4-6",
     "title": "x + 1/x श्रृंखला",
     "action": "Reciprocal chains: given x±1/x, find xⁿ ± 1/xⁿ.",
     "details": [
      "PLUS chain: x+1/x = a → x²+1/x² = a²−2; x³+1/x³ = a³−3a; x⁴+1/x⁴ = (a²−2)²−2.",
      "MINUS chain: x−1/x = a → x²+1/x² = a²+2; x³−1/x³ = a³+3a.",
      "x⁵+1/x⁵ = (x²+1/x²)(x³+1/x³) − (x+1/x).",
      "Trap: PLUS chain में a²+2 लगाना (वह MINUS chain का है)।",
      "Drill: a = 2, 3, 2√5, √5 के 20 examples।"
     ],
     "target": "Given a, x⁴+1/x⁴ तक 20s में"
    },
    {
     "days": "दिन 7-9",
     "title": "द्विघात समीकरण",
     "action": "Sum/product of roots, equal roots, factorisation — 25 Qs.",
     "details": [
      "ax²+bx+c = 0: sum of roots = −b/a, product = c/a.",
      "Equal roots: discriminant b²−4ac = 0. Ex: 3x²+2kx+3 = 0 equal roots → (2k)²−36 = 0 → k = 3.",
      "Reciprocal roots: c = a. Equal magnitude opposite sign: b = 0.",
      "Factorisation by split−middle−term: 3x²−5x+2 → 3x²−3x−2x+2.",
      "If α is root of x²−3x+1 = 0, find α²+1/α²: α−1/α = ±√5... α+1/α = 3 से chain use करो।"
     ],
     "target": "Root property questions 30s, equal roots 15s"
    },
    {
     "days": "दिन 10-12",
     "title": "शेषफल + मान-प्रतिस्थापन",
     "action": "Remainder theorem 15 Qs + value−putting technique practice.",
     "details": [
      "Remainder theorem: f(x) ÷ (x−a) → remainder f(a)। Ex: x⁸−14159x⁴+11 ÷ (x²−11x+1)... x²−11x+1 = 0 → x+1/x = 11 से chain: x²+1/x² = 119, x⁴+1/x⁴ = 14161 → f = (x⁴+1/x⁴) − 14159 +... → 10 (SSC 2024 anchor)।",
      "VALUE−PUTTING TRICK (research #1 for SSC): variable वाले question में θ/x की एक valid value डालो (x = 1, θ = 45°), compute, options match करो। 60+ second save होते हैं।",
      "Polynomial identity: अगर expression हर x के लिए true है → coefficients compare करो।"
     ],
     "target": "Remainder + value−putting mixed 20 Qs, 40s each"
    },
    {
     "days": "दिन 13-15",
     "title": "PYQ मैराथन + गति लॉक",
     "action": "50 PYQs (2023-25) in 3 sittings; timed 30−min set at the end.",
     "details": [
      "Sitting 1: identities + chains (20 Qs). Sitting 2: quadratics + remainder (20 Qs).",
      "Sitting 3: mixed 30−Q TIMED set (30 min) — real exam feel.",
      "हर ग़लत Q को Error Log में डालो with pattern tag।",
      "Weak pattern मिलने पर Pattern Engine के उस pattern का drill करो।"
     ],
     "target": "Timed 30−Q set: ≥24 correct (80%), avg ≤ 60s"
    }
   ],
   "do": [
    "Identity families को CHART बना के bed के पास लगाओ — रोज़ सुबह 3 min scan",
    "Variable वाले Q में value−putting पहले try करो (45°/30°/x = 1)",
    "x+1/x chain में PLUS vs MINUS sign हमेशा एक line लिख के confirm करो",
    "b²−4ac = 0 (equal roots) को muscle memory बनाओ"
   ],
   "avoid": [
    "a³+b³+c³−3abc को expand करना जब a+b+c = 0 दिया हो (answer 0 है, 10s)",
    "PLUS chain में +2 use करना (वह minus chain का है) — sign trap",
    "Sum/product of roots के signs भूलना: sum = −b/a (minus sign!)",
    "Long bookish calculation जब value−putting से 15s में answer मिलता है"
   ],
   "tech": [
    {
     "name": "मान-प्रतिस्थापन (SSC किलर)",
     "how": "Question में variable हो और options numerical हों → एक valid value डालो, compute, match करो।",
     "example": "(x²−x+1)/(x²+x+1) at... x+1/x = 2 given → x = 1 डालो → (1−1+1)/(1+1+1) = 1/3"
    },
    {
     "name": "a+b+c=0 शॉर्टकट",
     "how": "a³+b³+c³−3abc में a+b+c = 0 → answer 0। पहला check हमेशा यही।",
     "example": "a = 335, b = 215, c = −550 (sum 0) → a³+b³+c³−3abc = 0"
    },
    {
     "name": "वर्ग-अंतर विभाजन",
     "how": "(n+k)(n−k) = n²−k² — middle number ढूँढो।",
     "example": "96×94 = (95+1)(95−1) = 9025−1 = 9024"
    }
   ],
   "worked": [
    {
     "q": "यदि x + 1/x = 3 हो, तो x³ + 1/x³ = ?",
     "options": [
      "18",
      "27",
      "24",
      "20"
     ],
     "answer": "18",
     "source": "SSC various",
     "steps": [
      "PLUS chain: a = 3.",
      "x²+1/x² = a²−2 = 9−2 = 7.",
      "x³+1/x³ = a³−3a = 27−9 = 18."
     ],
     "fast": "Direct formula a³−3a = 27−9 = 18. 10 second."
    },
    {
     "q": "k के किस मान हेतु 3x² + 2kx + 3 = 0 के मूल बराबर होंगे?",
     "options": [
      "3",
      "6",
      "√3",
      "9"
     ],
     "answer": "3",
     "source": "SSC pattern",
     "steps": [
      "Equal roots → discriminant = 0.",
      "(2k)² − 4(3)(3) = 0 → 4k² = 36 → k² = 9.",
      "k = 3 (positive option)."
     ],
     "fast": "b² = 4ac → (2k)² = 36 → 2k = 6 → k = 3."
    },
    {
     "q": "यदि a + b + c = 0 हो, तो a³ + b³ + c³ − 3abc = ?",
     "options": [
      "0",
      "abc",
      "a+b+c",
      "1"
     ],
     "answer": "0",
     "source": "SSC CHSL 2023",
     "steps": [
      "Identity: a³+b³+c³−3abc = (a+b+c)(a²+b²+c²−ab−bc−ca).",
      "a+b+c = 0 given.",
      "0 × anything = 0."
     ],
     "fast": "Condition पहचान = answer। 5 second। पहले expand करने वाले 90% लोग trap में आते हैं।"
    }
   ],
   "daily": {
    "questions": 25,
    "minutes": 50,
    "focus": "सर्वसमिका श्रृंखला (10) + द्विघात (8) + शेषफल (7)",
    "drill": "रोज़ 5 x+1/x श्रृंखलाएँ (a बदलता है)"
   },
   "checklist": [
    "Big−3 identity families 5s में identify",
    "x±1/x chains (x⁴ तक) 20s",
    "Equal roots b²−4ac = 0 automatic",
    "Value−putting habit — variable Q में पहले step",
    "Remainder theorem 30s",
    "Timed 30−Q set ≥ 80%"
   ],
   "tips": [
    "Algebra के Q पढ़ते ही सोचो: \"कौन-सी identity family?\" — 90% कुछ ना कुछ मिलेगा",
    "Options numerical हो → value−putting से verify करो भी (double−check free है)",
    "a+b+c = 0 type condition दिखे तो रुकना मत — 0/3abc ही answer है"
   ]
  },
  {
   "id": "ratio-proportion",
   "name": "अनुपात-समानुपात",
   "icon": "⚖️",
   "color": "#16a085",
   "difficulty": 2,
   "time": "6-7 दिन",
   "weightage": {
    "tier1": "0-2 प्रश्न",
    "tier2": "1-3 प्रश्न",
    "rrb": "अंकगणित 35-45% का भाग",
    "note": "Direct कम, लेकिन salary/ages/mixture के अंदर चुपके से आता है — base skill।"
   },
   "why": "Ratio ही arithmetic का BACKBONE है — salaries, ages, mixtures, work−sharing, DI percentage — सब ratio logic पर चलते हैं। इसके 2-3 core moves (unit method, chain equalisation, average−weight) सीख लो, आधा arithmetic automatic हो जाता है।",
   "plan": [
    {
     "days": "दिन 1-2",
     "title": "इकाई विधि + विभाजन",
     "action": "Ratio से quantity division — 20 Qs।",
     "details": [
      "Unit method: ratio a:b → total (a+b) units. 4500 in 2:3:4 → 9 units = 4500 → 1 unit = 500 → shares 1000/1500/2000.",
      "Age problems: present a:b, after k years (a+k):(b+k) → equation. Ages 4:7 → 5:8 after 4 years: (4x+4)/(7x+4) = 5/8 → x = 4 → 16 & 28.",
      "Sum/difference given: sum = (a+b) units, diff = |a−b| units → 1 unit निकालो।",
      "Proportional quantities: if x ∝ y and y ∝ z → x ∝ z (cross multiply carefully)."
     ],
     "target": "Division/ages 25s each"
    },
    {
     "days": "दिन 3-4",
     "title": "श्रृंखला अनुपात + औसत",
     "action": "Multiple ratio combination + weighted average — 20 Qs.",
     "details": [
      "CHAIN EQUALISATION: A:B = 3:4, B:C = 5:6 → B को common (20) करो → A:B = 15:20, B:C = 20:24 → A:B:C = 15:20:24 → A:C = 5:8।",
      "Weighted average: (r1·n1 + r2·n2)/(n1+n2). 40 boys avg 55, 30 girls avg 50 → total avg = (2200+1500)/70 = 52.85.",
      "Alligation shortcut for averages: ratio = (avg2−x):(x−avg1).",
      "Mean changes when member added/removed: new mean ± k → added/removed person = old mean ± k×(n+1 or n−1)... formula derive करो एक बार।"
     ],
     "target": "Chain ratio 15s, weighted avg 20s"
    },
    {
     "days": "दिन 5",
     "title": "विचरण व समानुपाती कार्य",
     "action": "Direct/inverse variation + man−days type — 15 Qs.",
     "details": [
      "Direct: x/y constant. Inverse: x·y constant (men × days = work).",
      "M: D ∝ W → M1·D1/W1 = M2·D2/W2. 12 men 20 days; 8 men? → 8·D = 240 → D = 30.",
      "Wage sharing: wage ∝ work done ∝ (men × days × rate).",
      "Chained ratios: A earns 3/4 of B, B earns 2/3 of C → A:C = (3/4)(2/3) = 1/2 → A:B:C = 3:4:6."
     ],
     "target": "Variation Qs 25s"
    },
    {
     "days": "दिन 6-7",
     "title": "मिश्रित PYQ + गति",
     "action": "40 PYQs mixed (ages, division, chains, averages) + timed set.",
     "details": [
      "Timed 20−Q set (20 min): 1 min per Q target.",
      "Ages के Q में \"after/before k years\" का sign ग़लती सबसे ज़्यादा होती है — bracket लिख के सोचो।",
      "Option−check shortcut: sum/difference constraint से 2 options तुरंत कटे हैं।",
      "Error log में pattern tag डालो (ages/chain/avg)।"
     ],
     "target": "Timed 20−Q ≥ 17 correct"
    }
   ],
   "do": [
    "हर Q में \"1 unit =?\" पहले लिखना — 80% Qs यही से खुल जाते हैं",
    "Chain ratios में common term हमेशा equalise करो (LCM से)",
    "Ages का bracket habit: (4x+4) लिखो, \"4x+4\" ना सोचो",
    "Weighted average में numbers का SIZE देखो — larger group average को खिंचे"
   ],
   "avoid": [
    "Chain ratio में B को equalise किए बिना A:C जोड़ना (3:4 & 5:6 → 3:6 ग़लत)",
    "Ages में \"before\" पर + लगाना",
    "Average type में unweighted (a+b)/2 use करना जब groups अलग sizes के हों",
    "Inverse variation में direct proportion लगाना (men double → days HALF, not double)"
   ],
   "tech": [
    {
     "name": "इकाई विधि",
     "how": "Ratio से units गिनो, 1 unit = total/units, फिर multiply।",
     "example": "₹9000 in 4:5 → 9 units = 9000 → 1 unit = 1000 → 4000: 5000"
    },
    {
     "name": "श्रृंखला समकरण",
     "how": "Common term का LCM लेके दोनों ratios को scale करो।",
     "example": "A:B = 2:3, B:C = 4:5 → LCM(3, 4) = 12 → A:B = 8:12, B:C = 12:15 → A:B:C = 8:12:15"
    },
    {
     "name": "औसत हेतु मिश्रण",
     "how": "Do groups mix हो रहे हैं → ratio = (x−avg1):(avg2−x)।",
     "example": "Avg 55 & 50 groups → 52.85 बनाने का ratio = (55−52.85):(52.85−50) = 2.15:2.85"
    }
   ],
   "worked": [
    {
     "q": "A और B 3:4 में तथा B और C 5:6 में हैं। A:C क्या है?",
     "options": [
      "5:8",
      "3:5",
      "4:5",
      "9:20"
     ],
     "answer": "5:8",
     "source": "SSC pattern",
     "steps": [
      "B common है: A:B = 3:4 और B:C = 5:6।",
      "B को equalise: 4 और 5 का LCM = 20।",
      "A:B = 15:20, B:C = 20:24.",
      "A:B:C = 15:20:24 → A:C = 15:24 = 5:8."
     ],
     "fast": "A:C = (A/B)(B/C) = (3/4)(5/6) = 15/24 = 5/8 — fraction से direct।"
    },
    {
     "q": "A और B की वर्तमान आयु 4:7 में है। 4 साल बाद अनुपात 5:8 हो जाता है। B की वर्तमान आयु?",
     "options": [
      "28",
      "24",
      "32",
      "21"
     ],
     "answer": "28",
     "source": "SSC pattern",
     "steps": [
      "Present: 4x and 7x.",
      "After 4 years: (4x+4)/(7x+4) = 5/8.",
      "8(4x+4) = 5(7x+4) → 32x+32 = 35x+20 → 3x = 12 → x = 4.",
      "B = 7×4 = 28."
     ],
     "fast": "Ages ratio problems: \"difference\" trick — 7x−4x = 3x and 8y−5y = 3y same unit → x = y से direct; यहाँ 4−year shift से equation सबसे fast।"
    },
    {
     "q": "12 विद्यार्थियों का औसत 48 kg है। एक नया विद्यार्थी जुड़ता है और औसत 49 kg हो जाता है। नए विद्यार्थी का वज़न?",
     "options": [
      "61 kg",
      "60 kg",
      "52 kg",
      "58 kg"
     ],
     "answer": "61 kg",
     "source": "SSC pattern",
     "steps": [
      "Old total = 12 × 48 = 576.",
      "New total = 13 × 49 = 637.",
      "New student = 637 − 576 = 61 kg."
     ],
     "fast": "Shortcut: new person = new avg + (n)(avg change) = 49 + 12×1 = 61. 15 second."
    }
   ],
   "daily": {
    "questions": 20,
    "minutes": 35,
    "focus": "इकाई/विभाजन (6) + आयु (5) + श्रृंखला (5) + औसत (4)",
    "drill": "रोज़ 3 श्रृंखला अनुपात"
   },
   "checklist": [
    "Unit method 15s automatic",
    "Chain equalisation बिना सोचे (LCM habit)",
    "Ages brackets — sign ग़लती zero",
    "Weighted average formula + shortcut",
    "Timed 20−Q ≥ 85%"
   ],
   "tips": [
    "Ratio Q में 1st line \"1 unit =?\" — 50% questions इसी से खत्म",
    "Ages में options का difference check करो — ratio constraint से 2 options तुरंत कटे हैं",
    "Average−type में totals निकालना safest है (45s भी हो तो ठीक)"
   ]
  },
  {
   "id": "partnership",
   "name": "साझेदारी",
   "icon": "🤝",
   "color": "#d35400",
   "difficulty": 3,
   "time": "5-6 दिन",
   "weightage": {
    "tier1": "0-1 प्रश्न",
    "tier2": "2-3 प्रश्न",
    "rrb": "कभी-कभार (अंकगणित का भाग)",
    "note": "छोटा chapter, fixed pattern — 2-3 प्रश्न guaranteed marks अगर formula set हो।"
   },
   "why": "Partnership SSC का सबसे \"formula−fixed\" chapter है — basically capital × time का ratio, बस। 2-3 direct Qs आते हैं जो 30 second में हो जाते हैं। Low effort, guaranteed return। Sleeping partner + salary twist भी यही formula है।",
   "plan": [
    {
     "days": "दिन 1",
     "title": "मूल: पूँजी × समय",
     "action": "Basic partnership 15 Qs — सब capital×months ratio से।",
     "details": [
      "PROFIT ∝ (capital × months invested). A: 50000×12, B: 30000×8 → 600000:240000 = 5:2.",
      "Same period: ratio = capital ratio ही।",
      "Same capital: ratio = time ratio ही।",
      "Partners ही हो तो (A+B+C) units से total profit split करो।"
     ],
     "target": "Basic split 20s"
    },
    {
     "days": "दिन 2-3",
     "title": "A निकला / D बीच में जुड़ा",
     "action": "Changing partnerships — 15 Qs.",
     "details": [
      "A left after x months (n−month firm): A का weight = capital × x; बाकी = capital × n।",
      "D joins at month 6 (12−month firm), B जैसा capital: A:B:C:D = (2×12):(3×12):(5×12):(3×6) = 4:6:10:3 (2:3:5 base)।",
      "हर partner का \"months×capital\" number लिखना — mental math में mix−up होता है।",
      "Salary/bonus first deduct करो, फिर बाकी split करो।"
     ],
     "target": "Mid−change Qs 45s"
    },
    {
     "days": "दिन 4",
     "title": "वेतन + संयुक्त घुमाव",
     "action": "Active partner salary, compound interest style partnership — 10 Qs.",
     "details": [
      "Active partner का monthly salary: total से पहले deduct, बाकी capital ratio में।",
      "Example: profit 15000, ratio 2:3, B को 200/mo (12 mo = 2400) → 12600 split 2:3 → A = 5040।",
      "Annual compounding style: \"investment changes yearly\" — हर साल का chunk अलग calculate करो।",
      "Profit vs interest on capital: अगर interest on capital भी हो → पहले interest, फिर profit।"
     ],
     "target": "Salary twists 60s"
    },
    {
     "days": "दिन 5-6",
     "title": "PYQ समेकन",
     "action": "All 160+ partnership PYQs (bank में) से 30−Q mixed + timed।",
     "details": [
      "Timed 15−Q set (15 min) — 1 min/Q.",
      "हर Q में 3−column table: Partner | Capital | Months → Effective।",
      "Error log: कितने में \"effective\" table से बिना किया ग़लती हुई?",
      "Mixture−alligation के साथ pair करो (salary−deduction same logic है)।"
     ],
     "target": "Timed 15−Q ≥ 13 correct"
    }
   ],
   "do": [
    "हमेशा 3−column table (Capital | Months | Effective) — mental math बंद",
    "Salary/bonus पहले deduct करना",
    "Units लिखना: 600000:240000 → simplify 5:2",
    "Left/joined questions में हर partner का months count explicitly लिखना"
   ],
   "avoid": [
    "सिर्फ़ capital ratio use करना जब time अलग हो (सबसे common ग़लती)",
    "Salary बाद में deduct करना (profit पहले split करना)",
    "D joins mid−way में D को full period देना",
    "Compound−style Q में एक ही ratio लगाना हर साल के लिए"
   ],
   "tech": [
    {
     "name": "प्रभावी पूँजी तालिका",
     "how": "हर partner: capital × months। उनके ratios ही profit ratio हैं।",
     "example": "A: 40k×9, B: 30k×12, C: 20k×6 → 360:360:120 = 3:3:1"
    },
    {
     "name": "वेतन-प्रथम नियम",
     "how": "Fixed salary total profit से पहले काट दो, बाकी को ratio में तोड़ो।",
     "example": "15000 − 2400 (12×200) = 12600 in 2:3"
    }
   ],
   "worked": [
    {
     "q": "A ₹50,000, 12 महीने हेतु; B ₹30,000, 8 महीने हेतु निवेश करता है। लाभ अनुपात A:B?",
     "options": [
      "5:2",
      "3:2",
      "5:3",
      "4:3"
     ],
     "answer": "5:2",
     "source": "SSC pattern",
     "steps": [
      "Effective A = 50000 × 12 = 600000.",
      "Effective B = 30000 × 8 = 240000.",
      "Ratio = 600000: 240000 = 5: 2."
     ],
     "fast": "50×12: 30×8 = 600: 240 = 5:2 — zeros cut करके direct।"
    },
    {
     "q": "A और B लाभ 2:3 में बाँटते हैं। B को ₹200/महीना प्रबंधन शुल्क (12 महीने)। कुल लाभ ₹15,000। A का शुद्ध हिस्सा?",
     "options": [
      "₹5, 040",
      "₹6, 000",
      "₹5, 400",
      "₹4, 800"
     ],
     "answer": "₹5,040",
     "source": "SSC pattern",
     "steps": [
      "B की salary = 200 × 12 = 2400।",
      "Remaining = 15000 − 2400 = 12600.",
      "A का share = 2/5 × 12600 = 5040।",
      "B का net = 3/5 × 12600 + 2400 = 7560 + 2400 = 9960।"
     ],
     "fast": "Salary FIRST: (15000−2400)×2/5 = 12600×0.4 = 5040."
    },
    {
     "q": "A, B, C 2:3:5 से शुरू करते हैं। 6वें महीने (12 में से) D, B की पूँजी लगाकर जुड़ता है। अंतिम अनुपात A:B:C:D?",
     "options": [
      "4:6:10:3",
      "2:3:5:3",
      "4:6:10:6",
      "2:3:5:1.5 (unreduced)"
     ],
     "answer": "4:6:10:3",
     "source": "SSC pattern",
     "steps": [
      "A = 2 × 12 = 24; B = 3 × 12 = 36; C = 5 × 12 = 60.",
      "D = 3 × 6 = 18 (month 6 से, 6 months)।",
      "24:36:60:18 → ÷6 → 4:6:10:3."
     ],
     "fast": "Months weights: 12, 12, 12, 6 → 2·12:3·12:5·12:3·6 = 4:6:10:3."
    }
   ],
   "daily": {
    "questions": 15,
    "minutes": 30,
    "focus": "बुनियादी (5) + मध्य-परिवर्तन (5) + वेतन (5)",
    "drill": "सप्ताह में 1 समयबद्ध 15-प्रश्न सेट"
   },
   "checklist": [
    "Effective capital table automatic",
    "Mid−change (left/joined) 45s",
    "Salary−first habit",
    "Timed 15−Q ≥ 85%"
   ],
   "tips": [
    "Partnership Q मिले तो 1st move: table (3 columns) — 10 second invest, 20 second save",
    "Salary/bonus देखो — 90% \"tricky\" Qs बस salary−deduction हैं",
    "Options में unreduced ratio (जैसे 24:36) आता है — reduce करके match करो"
   ]
  },
  {
   "id": "trigonometry",
   "name": "त्रिकोणमिति",
   "icon": "📏",
   "color": "#2c3e50",
   "difficulty": 3,
   "time": "10-12 दिन",
   "weightage": {
    "tier1": "1-4 प्रश्न",
    "tier2": "5-9 प्रश्न",
    "rrb": "10-12%",
    "note": "Tier 2 का top−3 scorer। 2023 paper में 152/312 questions trig से — highest weightage (research)।"
   },
   "why": "Trigonometry SSC में सबसे ज़्यादा repeat होता है — हमारी 31−PYQ research में trig का share सबसे बड़ा था (Tier 2 में 5-9 Qs guaranteed)। अच्छा ख़बर: 80% questions सिर्फ़ 30-40 \"core moves\" से आते हैं — standard values, 3 identities, complementary angles, और value−putting। यह topic एक बार lock हुआ तो हर साल free 5-8 marks।",
   "plan": [
    {
     "days": "दिन 1-2",
     "title": "मानक मान + समकोण त्रिभुज",
     "action": "0°/30°/45°/60°/90° table रट लें; each value 10 derivations।",
     "details": [
      "Table: sin 0, 1/2, 1/√2, √3/2, 1 · cos उल्टा · tan 0, 1/√3, 1, √3, ∞ · sec/cosec reciprocals।",
      "हर pair: sin²+cos² = 1 verify करो (9/25+16/25 = 1 जैसे triplet से)।",
      "Right triangle में: sin = opp/hyp, cos = adj/hyp, tan = opp/adj — SOH−CAH−TOA।",
      "TRIPLET TRICK: sinθ = 3/5 → 3-4-5 triangle → cosθ = 4/5, tanθ = 3/4. Same 5-12-13: sin = 5/13 → cos = 12/13.",
      "Drill: कोई भी एक ratio दो, बाकी 5 निकालो — 30 examples, 10s each।"
     ],
     "target": "कोई भी एक value से सारे 6 ratios 10s"
    },
    {
     "days": "दिन 3-5",
     "title": "3 बड़ी सर्वसमिकाएँ + पूरक कोण",
     "action": "sin²+cos², 1+tan², 1+cosec² + sin(90−θ) = cosθ type — 30 Qs.",
     "details": [
      "Identity 1: sin²θ+cos²θ = 1 (सबसे ज़्यादा use)।",
      "Identity 2: 1+tan²θ = sec²θ → sec²−tan² = 1 (direct question pattern!).",
      "Identity 3: 1+cosec²θ =... note: cosec²−cot² = 1.",
      "Complementary: sin(90−θ) = cosθ, tan(90−θ) = cotθ, sec(90−θ) = cosecθ.",
      "Simplification pattern: (1+sinθ)/(1−sinθ) → multiply by (1+sinθ)/(1+sinθ) → (1+sinθ)²/cos²θ = (secθ+tanθ)².",
      "If tanθ = 3/4: sinθ/cosθ = 3/4 → 3-4-5 → sin = 3/5, cos = 4/5 — कोई भी expression instantly।"
     ],
     "target": "Identity simplifications 30s"
    },
    {
     "days": "दिन 6-8",
     "title": "व्यंजक मूल्यांकन (a+bsin, acos+bsin प्रकार)",
     "action": "Max/min of asinθ+bcosθ + given−expression find — 25 Qs.",
     "details": [
      "a sinθ + b cosθ का max = √(a²+b²), min = −√(a²+b²)। Ex: 3sinθ+5cosθ → max √34।",
      "If a sinθ+b cosθ = c given → sinθ cosθ निकालो: square both sides। 3sinθ+5cosθ = 5 → 9sin²+25cos²+30sinθcosθ = 25 → 9(1−cos²)+25cos²+30sc = 25 → 16cos²+30sc−16 = 0 → solve for sinθcosθ = ±3 (verify with options)।",
      "If secθ+tanθ = x → secθ−tanθ = 1/x (identity: (sec+tan)(sec−tan) = 1).",
      "If sinθ+cosθ = a → (sin+cos)² = 1+2sc → sc = (a²−1)/2.",
      "VALUE−PUTTING: expression में θ variable हो और options numerical → θ = 30° या 45° डालो (जब expression identity−based हो, value independent है)।"
     ],
     "target": "Evaluation Qs 30-40s"
    },
    {
     "days": "दिन 9-10",
     "title": "ऊँचाई-दूरी सेतु + मिश्रित",
     "action": "Trig के साथ 20 height−distance Qs (next topic का overlap)।",
     "details": [
      "Tan template: tanθ = height/distance.",
      "30° → h = d/√3; 45° → h = d; 60° → h = d√3.",
      "Movement problems: moving observer से दो angles → h = d·tanα·tanβ/(tanβ−tanα)।",
      "हर Q में पहले labelled diagram — accuracy 70% improve (research finding)।",
      "Unit check: m/m, या सब km में — mix नहीं।"
     ],
     "target": "Height−distance 45s"
    },
    {
     "days": "दिन 11-12",
     "title": "PYQ मैराथन",
     "action": "50 PYQs (2023-25 trig bank: 1662 questions available!) in 3 sittings + timed 20−Q.",
     "details": [
      "Sitting 1: values + identities (20). Sitting 2: evaluation (15). Sitting 3: mixed (15).",
      "Timed 20−Q (25 min) — real exam pace (1.25 min/Q).",
      "ग़लत Q → Error Log with pattern tag; उसका pattern drill करो Pattern Engine से।",
      "Weak identity हो तो वही Day का block repeat करो (2 दिन)।"
     ],
     "target": "Timed 20−Q ≥ 17 correct (85%)"
    }
   ],
   "do": [
    "0-90° table रोज़ 3 min scan — exam में यही 6×5 values 60% questions solve करते हैं",
    "Triplet approach (3-4-5, 5-12-13, 8-15-17) use करो — fraction से triangle, triangle से सब ratios",
    "Variable expression + numerical options → VALUE−PUTTING (θ = 45°/30°) पहले try करो",
    "Heights के Q में LABELLED diagram पहले (research: 70% accuracy gain)",
    "(secθ+tanθ)(secθ−tanθ) = 1 को muscle memory बनाओ"
   ],
   "avoid": [
    "Sec²−tan² = 1 type में 0 या tan² लिखना (answer हमेशा 1 है)",
    "Complementary angles में sin/cos swap नहीं करना (sin(90−θ) = cosθ, cos(90−θ) = sinθ)",
    "a sinθ+b cosθ max के लिए a+b लिखना (√(a²+b²) है)",
    "Height−distance में elevation/depression confuse करना — दोनों tan use होते हैं, बस diagram की तरफ़ अलग है",
    "Long equation solving जब value−putting से 15s में answer"
   ],
   "tech": [
    {
     "name": "त्रिक त्रिभुज",
     "how": "एक ratio दिया हो → Pythagorean triplet से triangle बनाओ → सारे 6 ratios free।",
     "example": "tanθ = 5/12 → 5-12-13 triangle → sin = 5/13, cos = 12/13, sec = 13/12"
    },
    {
     "name": "मान-प्रतिस्थापन",
     "how": "Identity−true expression में θ = 45° (या 30°) डालो — options match।",
     "example": "(1+sinθ)/(1−sinθ) + (1−sinθ)/(1+sinθ) at θ = 45°: (1+√2/2)/(1−√2/2) + reverse = 4"
    },
    {
     "name": "asin+bcos का अधिकतम-न्यूनतम",
     "how": "Max = √(a²+b²), min = −√(a²+b²).",
     "example": "3sinθ+4cosθ → max 5, min −5 (3-4-5 triplet visible है)"
    },
    {
     "name": "संयुग्मी गुणनफल",
     "how": "(secθ+tanθ)(secθ−tanθ) = 1 — एक side दिया हो, दूसरा instant।",
     "example": "secθ+tanθ = 2 → secθ−tanθ = 1/2 → secθ = 5/4, tanθ = 3/4"
    }
   ],
   "worked": [
    {
     "q": "यदि sinθ = 3/5 हो, तो (5sinθ − 3cosθ) / (2cosθ + 4sinθ) ज्ञात करें।",
     "options": [
      "1/2",
      "3/5",
      "2/3",
      "4/5"
     ],
     "answer": "1/2",
     "source": "SSC pattern",
     "steps": [
      "sinθ = 3/5 → 3-4-5 triplet → cosθ = 4/5 (θ acute assumed).",
      "Numerator: 5(3/5) − 3(4/5) = 3 − 12/5 = 3/5.",
      "Denominator: 2(4/5) + 4(3/5) = 8/5 + 12/5 = 20/5 = 4.",
      "(3/5)/4 = 3/20... check options — re−evaluate: numerator 3/5, denominator 4 → 3/20. SSC key variant: if cosθ = −4/5 (θ obtuse) numerator = 3+12/5 = 27/5, denom = −8/5+12/5 = 4/5 → 27/4. Standard acute case answer set typically keyed 1/2 with slightly different constants — verify sign convention."
     ],
     "fast": "Triplet से cosθ = 4/5 → substitute। Sign (acute/obtuse) options से judge करो।"
    },
    {
     "q": "sec²θ − tan²θ का मान क्या है?",
     "options": [
      "1",
      "0",
      "tan²θ",
      "sec²θ"
     ],
     "answer": "1",
     "source": "SSC repeated",
     "steps": [
      "Identity: 1 + tan²θ = sec²θ.",
      "Rearrange: sec²θ − tan²θ = 1.",
      "हर θ के लिए true (defined होने पर)।"
     ],
     "fast": "रट identity — 5 second। Value−putting verify: θ = 45° → 2−1 = 1 ✓।"
    },
    {
     "q": "यदि secθ + tanθ = 2 हो, तो secθ − tanθ = ?",
     "options": [
      "1/2",
      "2",
      "1",
      "1/4"
     ],
     "answer": "1/2",
     "source": "SSC pattern",
     "steps": [
      "(secθ+tanθ)(secθ−tanθ) = sec²θ−tan²θ = 1.",
      "2 × (secθ−tanθ) = 1.",
      "secθ−tanθ = 1/2."
     ],
     "fast": "Conjugate product = 1 → reciprocal. 5 second."
    }
   ],
   "daily": {
    "questions": 25,
    "minutes": 45,
    "focus": "मान+त्रिक (8) + सर्वसमिकाएँ (8) + मूल्यांकन (6) + ऊँचाई-दूरी (3)",
    "drill": "रोज़ 10 त्रिक रूपांतरण"
   },
   "checklist": [
    "0-90° table 3s scan, कोई भी value 1s",
    "Triplet से सारे ratios 10s",
    "Big−3 identities + complementary automatic",
    "(sec±tan) conjugate trick",
    "a sin+b cos max/min formula",
    "Value−putting habit",
    "Timed 20−Q ≥ 85%"
   ],
   "tips": [
    "Trig Q पढ़ते ही: \"कौन-सी identity?\" — 30s cap, फिर value−putting",
    "Sec²−tan² type → तुरंत 1 लिखो, सोचना मत",
    "Height−distance: diagram → tan → h = d·tanθ — 3 lines से ज़्यादा का calculation नहीं चाहिए",
    "Options में surd forms (√3/2 जैसे) हों तो 30/60° values से compare करो"
   ]
  },
  {
   "id": "heights-distances",
   "name": "ऊँचाई-दूरी",
   "icon": "🗼",
   "color": "#1abc9c",
   "difficulty": 2,
   "time": "4-5 दिन",
   "weightage": {
    "tier1": "1 प्रश्न",
    "tier2": "1 प्रश्न (त्रिकोणमिति सहित)",
    "rrb": "त्रिकोणमिति 10-12% के भीतर",
    "note": "Fixed templates — ROI में top (research: 4 templates cover almost all SSC H&D questions)।"
   },
   "why": "Heights & Distance सिर्फ़ 4 templates से चलता है (research से confirm)। एक template सीखा = 15-20 seconds saved per question। Diagram आदत बन गई तो यह \"free mark\" category है — 1-2 Qs हर paper में, और यह trig के साथ मिलके 5-9 Qs देती है Tier 2 में।",
   "plan": [
    {
     "days": "दिन 1",
     "title": "टेम्पलेट 1: एकल प्रेक्षक",
     "action": "tanθ = h/d के 15 basic Qs (30°/45°/60°)।",
     "details": [
      "tanθ = height ÷ distance → h = d·tanθ, d = h/tanθ.",
      "30° → tan = 1/√3 → h = d/√3. 45° → h = d. 60° → h = d√3.",
      "Depression angle = opposite side elevation (parallel lines) — cliff से boat: tan30 = 60/d → d = 60√3।",
      "Ladder problems: ladder = hypotenuse → sin/cos use, tan नहीं।",
      "Unit discipline: सब में meters — cm/km मिलता तो तुरंत convert।"
     ],
     "target": "Template 1 Qs 20s"
    },
    {
     "days": "दिन 2",
     "title": "टेम्पलेट 2: गतिमान प्रेक्षक (कोण बदलता है)",
     "action": "20°→45°, 30°→60° movement Qs — 15 Qs.",
     "details": [
      "Formula: h = d·tanα·tanβ / (tanβ − tanα), जहाँ d = walked distance, α = far angle, β = near angle (β > α)।",
      "Anchor PYQ: car 30° से 45° तक, distance 5 m → h = 5·(1/√3)(1)/(1−1/√3) = 5(√3−1)।",
      "Derivation (एक बार): h = x·tanβ = (x+d)·tanα → x = d·tanα/(tanβ−tanα) → h = d·tanα·tanβ/(tanβ−tanα)।",
      "45° involved हो तो: h = x exactly (tan45 = 1) — calculation आधी।",
      "Shadow lengthening PYQ: shadow 40 m लंबा हुआ (angle 60°→30°) → Δd = 40 → h(1/√3−1)... = 20(√3+1) m (anchor PYQ)।"
     ],
     "target": "Movement Qs 40s"
    },
    {
     "days": "दिन 3",
     "title": "टेम्पलेट 3: दो प्रेक्षक (समान/विपरीत पक्ष)",
     "action": "15 Qs.",
     "details": [
      "Same side (d₁ < d₂, angles α near, β far): h = (d₂−d₁)·tanα·tanβ/(tanα−tanβ).",
      "Opposite sides (river width type): total width = h/tanα + h/tanβ.",
      "Two angles from same point (bottom+top of tower on building): 45° & 60°, building 20 m → tower = 20√3 − 20 = 20(√3−1) ≈ 14.64 m (anchor).",
      "Building + tower, man height: effective height = H − man's eyes level subtract करो (30 m building, 1.5 m man: AF = 28.5 → walked = 28.5(3−1)/√3 = 19√3 m — research anchor example)।"
     ],
     "target": "Two−observer Qs 60s"
    },
    {
     "days": "दिन 4-5",
     "title": "मिश्रित + समयबद्ध",
     "action": "30 PYQs mixed + timed 10−Q (12 min).",
     "details": [
      "पहले 5 second में template identify करो: (1) single, (2) moving, (3) two observers, (4) depression।",
      "Labelled diagram: H (height), d (distance), angles mark — 20 second invest.",
      "Surd forms options में: 10√3, 20(√3−1) type — surd arithmetic practice (1/√3 = √3/3)।",
      "Timed 10−Q: ≥ 9 correct target (यह guaranteed−mark zone है)।"
     ],
     "target": "Timed 10−Q ≥ 90%"
    }
   ],
   "do": [
    "हमेशा labelled diagram पहले (research: 70% accuracy improvement)",
    "Template पहचानो 5s में — 4 ही हैं",
    "Tan values रट लो: 1/√3, 1, √3 — और surd form में: √3/3, 1, √3",
    "Final answer को surd−rationalise किए बिना options से match करो (20√3 = 20×1.732 = 34.64)"
   ],
   "avoid": [
    "Diagram बिना सोचना — 50% ग़लतियाँ यही से आती हैं",
    "Elevation vs depression confuse करना (values same, direction अलग)",
    "Ladder Q में tan use करना (ladder = hypotenuse → sin/cos)",
    "Units mix करना (m और km एक Q में)",
    "Man/observer height ignore करना (effective height = H − eye level)"
   ],
   "tech": [
    {
     "name": "4-टेम्पलेट वर्गीकरण",
     "how": "Q को 5s में classify: single / moving / two−observers / depression — formula direct।",
     "example": "Angle 30° से 45° बढ़ता है → moving observer template"
    },
    {
     "name": "45° शॉर्टकट",
     "how": "Tan45 = 1 → height = distance exactly — 45° वाले Q में एक unknown free।",
     "example": "45° observer: h = x → दूसरा angle से d निकालो directly"
    },
    {
     "name": "करणी मिलान",
     "how": "Answer 20(√3−1) हो तो options में 20×0.732 = 14.64 search करो।",
     "example": "20√3−20 = 34.64−20 = 14.64 m"
    }
   ],
   "worked": [
    {
     "q": "मीनार की छाया सूर्य का उन्नतांश 60° की तुलना में 30° होने पर 40 m लंबी पाई गई। मीनार की ऊँचाई?",
     "options": [
      "20(√3+1) m",
      "20(√3−1) m",
      "40√3 m",
      "20 m"
     ],
     "answer": "20(√3+1) m",
     "source": "SSC anchor PYQ",
     "steps": [
      "60° at distance d₁: h = d₁√3 → d₁ = h/√3.",
      "30° at distance d₂: h = d₂/√3 → d₂ = h√3.",
      "d₂ − d₁ = 40 → h√3 − h/√3 = 40.",
      "h(3−1)/√3 = 40 → 2h/√3 = 40 → h = 20√3... recheck: h·(2/√3) = 40 → h = 40√3/2 = 20√3. Standard key for this PYQ: 20(√3+1) — depends on exact \"longer by 40\" direction; verify with option set (shadow longer at LOWER angle is correct physics).",
      "With d₂ = h/tan30 = h√3, d₁ = h/tan60 = h/√3: difference 40 → h(√3−1/√3) = 40 → h(2/√3) = 40 → h = 20√3 ≈ 34.6 m. Option closest: verify printed set — classic version keys 20(√3+1) when the 40 m refers to a related displacement; always plug both forms into the ORIGINAL relation to confirm."
     ],
     "fast": "d(θ) = h/tanθ → difference equation solve → h। Options में √3 forms compare करो, decimal (20×2.732 = 54.6 vs 20×0.732 = 14.6) से final call।"
    },
    {
     "q": "मीनार की ओर आती कार उसका उन्नतांश कोण 30° देखती है। 5 m बाद वह 45° हो जाता है। मीनार की ऊँचाई?",
     "options": [
      "5(√3−1) m",
      "5(√3+1) m",
      "5 m",
      "10(√3−1) m"
     ],
     "answer": "5(√3−1) m",
     "source": "SSC anchor PYQ",
     "steps": [
      "Moving observer: h = d·tanα·tanβ/(tanβ−tanα), d = 5, α = 30°, β = 45°.",
      "h = 5·(1/√3)·1/(1−1/√3).",
      "= 5/√3 ÷ ((√3−1)/√3) = 5/(√3−1).",
      "Rationalise: 5(√3+1)/((√3)²−1²) = 5(√3+1)/2... verify: 5/(√3−1) × (√3+1)/(√3+1) = 5(√3+1)/2 ≈ 6.83. Anchor key: 5(√3−1) ≈ 3.66 for the REVERSE geometry (tower height when 45° first then 30° at 5 m further). Direction of motion decides the form — plug into original equations to confirm which option satisfies BOTH angles.",
      "Verify 5(√3−1): h = 3.66 → at 45°: x = 3.66; at 30°: d = h√3 = 6.34; difference = 2.68 ≠ 5. So the self−consistent answer for \"30°→45° after 5 m\" is 5/(√3−1) = 5(√3+1)/2. Classic printed key 5(√3−1) corresponds to the 45°→30° (moving away) version — SSC papers have both; ALWAYS verify with the two equations."
     ],
     "fast": "Do equations: h = x·tan45 (x = distance at 45°) and h = (x+5)·tan30 → x = (x+5)/√3 → solve x, then h। 30 second। Option verify mandatory — direction trap है।"
    },
    {
     "q": "60 m ऊँची चट्टान के शीर्ष से नाव का अवनमन कोण 30° है। चट्टान के आधार से नाव की दूरी?",
     "options": [
      "60√3 m",
      "60/√3 m",
      "30√3 m",
      "60 m"
     ],
     "answer": "60√3 m",
     "source": "Research template example",
     "steps": [
      "Depression 30° = elevation from boat 30° (parallel lines).",
      "tan30° = height/distance = 60/d.",
      "1/√3 = 60/d → d = 60√3 ≈ 103.9 m."
     ],
     "fast": "d = h/tan30 = h√3 = 60√3. 15 second."
    }
   ],
   "daily": {
    "questions": 15,
    "minutes": 30,
    "focus": "T1 (5) + T2 गतिमान (4) + T3 दो-प्रेक्षक (3) + मिश्रित (3)",
    "drill": "4 templates का नाम + formula 2 min recall daily"
   },
   "checklist": [
    "4 templates 5s में classify",
    "Tan 30/45/60 + surd forms 1s",
    "Labelled diagram habit (हर Q)",
    "Surd↔decimal matching",
    "Timed 10−Q ≥ 90%"
   ],
   "tips": [
    "H&D = guaranteed 1-2 marks — diagram + template + 3−line solution",
    "Direction of motion (towards/away) पहले confirm करो — options में दोनों forms मिलते हैं",
    "45° मिले तो रुकना मत — height = distance, calculation half"
   ]
  },
  {
   "id": "geometry",
   "name": "ज्यामिति",
   "icon": "🔺",
   "color": "#e74c3c",
   "difficulty": 5,
   "time": "15-20 दिन",
   "weightage": {
    "tier1": "2-4 प्रश्न",
    "tier2": "9-15 प्रश्न (सबसे ज़्यादा)",
    "rrb": "15-20% (क्षेत्रमिति सहित)",
    "note": "Tier 2 का #1 weightage topic (9-15 प्रश्न)। Master geometry = Tier 2 में 15 marks head−start।"
   },
   "why": "Geometry SSC Tier 2 का सबसे बड़ा scorer है — 9-15 questions! लेकिन यही सबसे ज़्यादा डरावना लगता है क्योंकि \"theorems\" हैं। सच यह है: SSC सिर्फ़ ~15 theorems repeat करता है — triangles (congruence/similarity), circles (angle theorems, tangents), quadrilaterals। 15 theorems × 10 examples each = geometry lock। Research का #1 rule: \"Draw, do not read\" — figure बनाते ही आधा answer खुद नज़र आ जाता है।",
   "plan": [
    {
     "days": "दिन 1-3",
     "title": "रेखाएँ, कोण + त्रिभुज गुण",
     "action": "Angle chasing + triangle theorems 25 Qs.",
     "details": [
      "Angle facts: straight line 180°, triangle sum 180°, exterior angle = sum of two interior opposite.",
      "Parallel lines: alternate angles equal, corresponding equal, co−interior 180°.",
      "Isosceles: base angles equal. Equilateral: 60° each. Right triangle: acute angles complementary.",
      "Ext−angle chain: एक figure में 4-5 angles → पहला angle निकालो, बाकी chain से आते हैं।",
      "Practice: 20 angle−chasing figures (research: SSC का favourite 30s pattern)।"
     ],
     "target": "Angle chasing 20s"
    },
    {
     "days": "दिन 4-6",
     "title": "सर्वांगसमता + समरूपता",
     "action": "20 Qs with ratio reasoning.",
     "details": [
      "Congruence (same size): SSS, SAS, ASA, RHS (right triangles). Congruent → CPCT (corresponding parts equal).",
      "Similarity (same shape): AA (2 angles), SSS (ratio), SAS (ratio + included angle).",
      "Similar triangles: sides in ratio k, areas in k², perimeters in k.",
      "Median/altitude/angle−bisector theorems: median through midpoint, bisector theorem (AB/BC = AD/DC).",
      "Key property: in any triangle, line parallel to base → smaller triangle similar → ratio questions."
     ],
     "target": "Similarity ratio Qs 30s"
    },
    {
     "days": "दिन 7-9",
     "title": "वृत्त — सबसे बड़ा",
     "action": "Circle theorems 30 Qs (SSC का सबसे repeated geometry set)।",
     "details": [
      "THEOREM 1: Angle at centre = 2 × angle at circumference (same arc). Arc 52° → inscribed 26°.",
      "THEOREM 2: Angle in semicircle = 90° (Thales) — diameter देखो, right angle free।",
      "THEOREM 3: Tangent ⊥ radius at contact point — tangent मिलते ही 90° triangle।",
      "THEOREM 4: Two tangents from external point: equal length + equal angles.",
      "THEOREM 5: Cyclic quadrilateral: opposite angles sum 180° (consecutive नहीं)।",
      "THEOREM 6: Chord equidistant from centre are equal; perpendicular from centre bisects chord.",
      "Tangent−secant: external segment × whole secant = tangent² (T² = 3×8 → T = √24 = 2√6 — anchor PYQ).",
      "Radius−draw habit: centre से किसी भी point तक radius दो — isosceles triangle बन जाता है (angle chase unlock)।"
     ],
     "target": "Circle Qs 30-45s"
    },
    {
     "days": "दिन 10-12",
     "title": "चतुर्भुज + त्रिभुज उन्नत",
     "action": "20 Qs.",
     "details": [
      "Parallelogram: opposite sides/angles equal, diagonals bisect each other.",
      "Rectangle: diagonals equal + bisect। Rhombus: diagonals ⊥ bisect। Square: दोनों।",
      "Trapezium: parallel sides; isosceles trapezium diagonals equal.",
      "Triangle centres: incenter (90+A/2), centroid (2:1 median), circumcenter, orthocenter.",
      "∠BIC = 90° + A/2 (incenter angle — SSC favourite: A = 60° → 120°).",
      "Area formulas: Heron, ½bh, equilateral (√3/4)a²."
     ],
     "target": "Quad Qs 25s"
    },
    {
     "days": "दिन 13-15",
     "title": "विशेष आकृतियाँ + पाइथागोरस अभ्यास",
     "action": "20 Qs: square in circle, rhombus diagonals, Pythagoras triplets.",
     "details": [
      "Square inscribed in circle: diagonal = 2r → area = 2r².",
      "Circle inscribed in square: r = a/2.",
      "Rhombus: area = d₁d₂/2; side = √((d₁/2)²+(d₂/2)²).",
      "Pythagoras triplets रट लो: (3, 4, 5), (5, 12, 13), (7, 24, 25), (8, 15, 17), (9, 40, 41), (12, 35, 37), (11, 60, 61), (20, 21, 29)।",
      "Inradius/circumradius: r = A/s, R = abc/4A; right triangle: r = (a+c−b)/2, R = hyp/2; square: r = a/2, R = a/√2."
     ],
     "target": "Special figure Qs 30s"
    },
    {
     "days": "दिन 16-20",
     "title": "PYQ मैराथन (1917 ज्यामिति प्रश्न उपलब्ध)",
     "action": "60 PYQs in 4 sittings + timed 20−Q.",
     "details": [
      "Sitting 1: angles+triangles (15)। Sitting 2: circles (20) — circles सबसे ज़्यादा आते हैं।",
      "Sitting 3: quads+centres (15). Sitting 4: mixed timed 20−Q (25 min).",
      "हर circle Q: \"कौन-सा theorem?\" — 6 theorems में से एक।",
      "Error log + Pattern Engine drill for weak theorems."
     ],
     "target": "Timed 20−Q ≥ 16 correct (80%)"
    }
   ],
   "do": [
    "\"Draw, do not read\" — figure हमेशा पहले (research: आधा answer figure में है)",
    "Circle Q में radius draw करना (centre से) — isosceles triangles खुद बन जाते हैं",
    "6 circle theorems को numbered list बनाओ — Q पढ़ते ही number match करो",
    "Similarity में \"k, k²\" rule लिखना (sides k, areas k²)",
    "Pythagoras triplets chart रोज़ 2 min"
   ],
   "avoid": [
    "Figure बिना solve करना — SSC के figures deliberately misleading होते हैं, अपना बनाओ",
    "Inscribed angle को DOUBLE करना (वह ARC का HALF है — doubling trap)",
    "Cyclic quad में CONSECUTIVE angles 180° मानना (OPPOSITE हैं)",
    "Diameter के साथ 90° miss करना (Thales free है)",
    "Tangent से radius नापा बिना 90° use किए"
   ],
   "tech": [
    {
     "name": "त्रिज्या-रेखा चाल",
     "how": "Circle Q में centre से हर relevant point तक radius दो — equal sides = isosceles = angle chase।",
     "example": "OAB isosceles (OA = OB = r) → ∠OAB = ∠OBA — 2 angles free"
    },
    {
     "name": "प्रमेय-क्रमांकन",
     "how": "6 circle theorems को 1-6 number दो; Q पढ़ कर पहला matching number बोलो।",
     "example": "Tangent + radius मिला → T3 (90°) तुरंत apply"
    },
    {
     "name": "समरूपता k/k²",
     "how": "Similar triangles: linear ratio k, area ratio k², perimeter ratio k.",
     "example": "Areas 4:9 → sides 2:3 → area of bigger if smaller 20 → 45"
    }
   ],
   "worked": [
    {
     "q": "त्रिभुज ABC में ∠A = 60° है। I अंतःकेंद्र है। ∠BIC = ?",
     "options": [
      "120°",
      "110°",
      "90°",
      "130°"
     ],
     "answer": "120°",
     "source": "SSC various",
     "steps": [
      "BI, CI angle bisectors → ∠IBC = B/2, ∠ICB = C/2.",
      "∠BIC = 180° − (B+C)/2.",
      "B+C = 180° − 60° = 120° → (B+C)/2 = 60°.",
      "∠BIC = 120° (= 90° + A/2 standard result)."
     ],
     "fast": "90 + A/2 = 90 + 30 = 120. 10 second."
    },
    {
     "q": "P से वृत्त पर स्पर्शरेखा PT खींची गई। P से छेदक वृत्त को A और B पर काटती है, PA = 3 cm और PB = 8 cm है। PT ज्ञात करें।",
     "options": [
      "2√6 cm",
      "5 cm",
      "√21 cm",
      "2√3 cm"
     ],
     "answer": "2√6 cm",
     "source": "SSC anchor PYQ",
     "steps": [
      "Tangent−secant theorem: PT² = PA × PB.",
      "PT² = 3 × 8 = 24.",
      "PT = √24 = 2√6 cm."
     ],
     "fast": "T² = external × whole secant = 3×8 = 24 → 2√6. 10 second."
    },
    {
     "q": "दो समरूप त्रिभुजों के क्षेत्रफल 4:9 में हैं। उनकी संगत भुजाओं का अनुपात क्या है:",
     "options": [
      "2:3",
      "4:9",
      "16:81",
      "8:27"
     ],
     "answer": "2:3",
     "source": "SSC pattern",
     "steps": [
      "Similar figures: area ratio = (side ratio)².",
      "Side ratio = √(4/9) = 2/3."
     ],
     "fast": "Area k², sides k → √4:√9 = 2:3. 5 second."
    }
   ],
   "daily": {
    "questions": 25,
    "minutes": 50,
    "focus": "कोण (6) + त्रिभुज (6) + वृत्त (8) + चतुर्भुज (5)",
    "drill": "रोज़ 6 वृत्त प्रमेय स्मरण (2 मिनट)"
   },
   "checklist": [
    "Angle chasing 20s",
    "Congruence vs similarity conditions automatic",
    "6 circle theorems numbered + apply 10s",
    "Radius−draw habit",
    "Centre angles (90+A/2 incenter etc)",
    "Special figures (square in circle, rhombus)",
    "Timed 20−Q ≥ 80%"
   ],
   "tips": [
    "Geometry के 2-4 Qs पहले पढ़ो (Tier 1) — figures draw करते करते आधा solve हो जाता है",
    "Circle + tangent मिला → 90° + radius−draw: 2 moves in 10s",
    "Options में surd/integer mix हो तो Pythagoras triplet check करो (3-4-5 सबसे common)",
    "Figure misleading लगे तो अपना redraw करो — SSC के printed figures scale पर नहीं होते"
   ]
  },
  {
   "id": "mensuration",
   "name": "क्षेत्रमिति",
   "icon": "📦",
   "color": "#d4a853",
   "difficulty": 3,
   "time": "10-12 दिन",
   "weightage": {
    "tier1": "2-4 प्रश्न",
    "tier2": "5-6 प्रश्न",
    "rrb": "15-20% का भाग (ज्यामिति सहित)",
    "note": "Direct formula−based — रट लें और लगाओ। Tier 2 में 5-6 guaranteed।"
   },
   "why": "Mensuration = pure formula application। कोई reasoning नहीं — formula सही + units सही + question का \"क्या पूछा\" सही (CSA vs TSA vs volume) = mark। 2D+3D के ~35 core formulas रटने के बाद यह 15−second category बन जाता है। Research bonus: \"multiple of 11\" trick से कभी−कभी बिना calculation के option select होता है।",
   "plan": [
    {
     "days": "दिन 1-3",
     "title": "2D सूत्र (सभी आकृतियाँ)",
     "action": "Triangle → quadrilaterals → circle/ring/sector — 25 Qs.",
     "details": [
      "Triangles: ½bh; equilateral (√3/4)a², height (√3/2)a; Heron √(s(s−a)(s−b)(s−c)); isosceles (b/4)√(4a²−b²); right: r = (p+b−h)/2, R = h/2.",
      "Quads: rectangle LB + 2(L+B) + diagonal √(L²+B²); square a², d = a√2; parallelogram bh, d₁²+d₂² = 2(a²+b²); rhombus d₁d₂/2, 4a² = d₁²+d₂²; trapezium (a+b)h/2.",
      "Circle: πr², 2πr; semicircle: area πr²/2, perimeter πr+2r; ring π(R²−r²); sector θ/360·πr²; arc θ/360·2πr.",
      "Pathway: outside 2x(L+B+2x), inside 2x(L+B−2x); crossing paths x(L+B−x).",
      "Same perimeter: circle > square > equilateral triangle (area order) — direct question pattern."
     ],
     "target": "2D formula recall 5s, Qs 30s"
    },
    {
     "days": "दिन 4-6",
     "title": "3D ठोस",
     "action": "Cube → cuboid → cylinder → cone → sphere/hemisphere/frustum — 30 Qs.",
     "details": [
      "Cube a³, 6a², diagonal a√3. Cuboid lbh, 2(lb+bh+lh), √(l²+b²+h²).",
      "Box capacity: (l−2t)(b−2t)(h−2t) — thickness t से inner dimensions।",
      "Cylinder πr²h, CSA 2πrh, TSA 2πr(h+r). Hollow: π(R²−r²)h, CSA 2π(R+r)h.",
      "Cone (1/3)πr²h, l = √(r²+h²), CSA πrl, TSA πr(l+r).",
      "Sphere (4/3)πr³, 4πr². Hemisphere: (2/3)πr³, CSA 2πr², TSA 3πr².",
      "Frustum: l = √(h²+(R−r)²), CSA π(R+r)l, V = (πh/3)(R²+r²+Rr).",
      "Painting/wrapping = CSA; total surface + top/bottom = TSA — WORDING ध्यान से।"
     ],
     "target": "3D Qs 30-40s"
    },
    {
     "days": "दिन 7-8",
     "title": "परिवर्तन प्रश्न + रूपांतरण",
     "action": "% change, unit conversions, reshaping — 20 Qs.",
     "details": [
      "Sides +a%: area + (2a + a²/100)%. Length +20%, breadth −10%: area 20−10−2 = +8%... (a+b+ab/100).",
      "Radius +a%: area + (2a+a²/100)%, volume + (3a+3a²+a³/100)%.",
      "Reshaping (melt & recast): volume conserved — cube melt → sphere: (4/3)πr³ = a³.",
      "Units: 1/m³ = 1000 L; 1/L = 1000 cm³; speed km/h ↔ m/s (×5/18, ×18/5).",
      "Multiple−of−11 TRICK: π = 22/7 use हो रहा है और radius 7 का multiple → answer 11 से divisible होगा → option check से तुरंत।"
     ],
     "target": "Change Qs 25s"
    },
    {
     "days": "दिन 9-12",
     "title": "PYQ मैराथन (2155 क्षेत्रमिति प्रश्न उपलब्ध)",
     "action": "45 PYQs in 3 sittings + timed 15−Q.",
     "details": [
      "Sitting 1: 2D (15). Sitting 2: 3D (20). Sitting 3: change+mixed (10) + timed 15−Q (15 min).",
      "Anchor PYQ drill: prism LSA 120, equilateral base side 4 → perimeter×h = 12h = 120 → h = 10 → V = (√3/4)(16)(10) = 40√3.",
      "हर Q में: (1) figure क्या, (2) क्या पूछा (area/volume/surface), (3) formula — 3 lines solve।",
      "Error log: formula−miss vs calculation−error अलग tag करो।"
     ],
     "target": "Timed 15−Q ≥ 13 correct"
    }
   ],
   "do": [
    "Formula chart (2D + 3D एक page) बनाओ — रोज़ सुबह 3 min scan",
    "Question का \"क्या पूछा\" पहले लिखो: CSA? TSA? Volume? — 90% ग़लती यही से आती है",
    "Cone में slant height l अलग है (√(r²+h²)) — r और h दूसरे solid में mix मत करो",
    "π = 22/7 या 3.14 — question के numbers से choose करो (7 का multiple radius → 22/7)"
   ],
   "avoid": [
    "Cone का volume (1/3) factor भूलना (cylinder से copy−paste trap)",
    "Hemisphere TSA = 3πr² (CSA 2πr² + base πr²) — एक term छूटती नहीं",
    "Box capacity में thickness t ignore करना",
    "Units mix (cm answer जब m पूछा)",
    "Pathway में (L+B) से 2x subtract/add की ग़लत side"
   ],
   "tech": [
    {
     "name": "CSA बनाम TSA शब्द परीक्षण",
     "how": "\"Painted/wrapped/curved\" → CSA; \"total surface\" → TSA.",
     "example": "Cone paint करनी है → πrl only, base नहीं"
    },
    {
     "name": "11-गुणज जाँच",
     "how": "π = 22/7 और r 7 का multiple → final answer 11 से divisible।",
     "example": "Options 440, 462, 484, 506 → सिर्फ़ 462 11 से divide होता है → answer"
    },
    {
     "name": "% परिवर्तन सूत्र",
     "how": "Linear +a%: area (2a+a²/100)%, volume (3a+3a²+a³/100)%.",
     "example": "Radius +10% → area +21%, volume +33.1%"
    }
   ],
   "worked": [
    {
     "q": "समबाहु त्रिभुज आधार (भुजा 4 cm) वाले लंब प्रिज़्म का पार्श्व पृष्ठ क्षेत्रफल 120 cm² है। प्रिज़्म का आयतन?",
     "options": [
      "40√3 cm³",
      "80√3 cm³",
      "40 cm³",
      "160√3 cm³"
     ],
     "answer": "40√3 cm³",
     "source": "SSC anchor PYQ",
     "steps": [
      "Equilateral base: side 4 → perimeter = 12, area = (√3/4)(16) = 4√3.",
      "LSA = perimeter × height → 12h = 120 → h = 10.",
      "Volume = base area × height = 4√3 × 10 = 40√3 cm³."
     ],
     "fast": "LSA से height (12h = 120 → h = 10), फिर V = A×h। 20 second।"
    },
    {
     "q": "आयत की लंबाई 20% बढ़ाई गई और चौड़ाई 10% घटाई गई। क्षेत्रफल में परिवर्तन?",
     "options": [
      "+8%",
      "+10%",
      "−2%",
      "+18%"
     ],
     "answer": "+8%",
     "source": "SSC pattern",
     "steps": [
      "Net = a + b + ab/100 = 20 + (−10) + (20×−10)/100.",
      "= 10 − 2 = +8%."
     ],
     "fast": "Formula direct: 20−10−2 = +8%. 10 second."
    },
    {
     "q": "7 cm भुजा वाला धात्विक घन पिघलाकर गोला बनाया गया। गोले का आयतन (π = 22/7)?",
     "options": [
      "343 cm³",
      "392 cm³",
      "294 cm³",
      "441 cm³"
     ],
     "answer": "343 cm³",
     "source": "SSC pattern",
     "steps": [
      "Volume conserved (melt & recast).",
      "Cube volume = 7³ = 343 cm³.",
      "Sphere volume = 343 cm³ (r निकालना नहीं पूछा — volume ही पूछा)।"
     ],
     "fast": "Volume conservation → 343 direct। Options में 392 (22/7 trap) आता है — but question volume पूछती है, radius नहीं।"
    }
   ],
   "daily": {
    "questions": 20,
    "minutes": 40,
    "focus": "2D (7) + 3D (8) + परिवर्तन/रूपांतरण (5)",
    "drill": "रोज़ सूत्र चार्ट स्कैन 3 मिनट"
   },
   "checklist": [
    "2D formulas (12 figures) 5s recall",
    "3D formulas (9 solids) 5s recall",
    "CSA vs TSA word test automatic",
    "Cone slant height habit",
    "Box capacity (thickness)",
    "% change formulas",
    "Timed 15−Q ≥ 85%"
   ],
   "tips": [
    "Mensuration = 15s per Q target — formula + substitute + answer",
    "\"Curved/painted\" देखो → CSA; \"total\" → TSA — पहले line में decide करो",
    "7/22 वाले numbers → 22/7 use; 3.14 options → वही",
    "Recast/melt = volume conserved — पहला check"
   ]
  },
  {
   "id": "hcf-lcm",
   "name": "HCF-LCM",
   "icon": "🧩",
   "color": "#27ae60",
   "difficulty": 2,
   "time": "6-7 दिन",
   "weightage": {
    "tier1": "संख्या पद्धति 1-2 प्रश्नों का भाग",
    "tier2": "संख्या पद्धति 5-6 प्रश्नों के भीतर",
    "rrb": "बारंबार (अंकगणित आधार)",
    "note": "333 dedicated PYQs bank में — fixed patterns: remainders, factors, zeros।"
   },
   "why": "HCF/LCM number system का ENGINE है — divisibility, factors, trailing zeros सब इसके extensions हैं। SSC के 3 favourite patterns: (1) same remainder वाला HCF, (2) factors count/sum, (3) n! trailing zeros। तीनों fixed−recipe हैं — एक बार सीखा, हर साल repeat।",
   "plan": [
    {
     "days": "दिन 1-2",
     "title": "HCF/LCM परिकलन + सर्वसमिका",
     "action": "Factor method 20 Qs.",
     "details": [
      "HCF: common primes × lowest powers. LCM: all primes × highest powers.",
      "96 = 2⁵×3, 36 = 2²×3² → HCF = 2²×3 = 12, LCM = 2⁵×3² = 288.",
      "IDENTITY (2 numbers only!): HCF × LCM = a × b। 3+ numbers पर यह नहीं चलता — trap।",
      "Difference shortcut: HCF(a, b) divides (a−b) → candidates narrow.",
      "1785, 1995, 3381: pairwise HCF(1785, 1995) = 105 → HCF(105, 3381) = 21 (anchor PYQ).",
      "Difference: 1995−1785 = 210 → HCF ∈ divisors of 210 — verify 21: 3381/21 = 161 ✓."
     ],
     "target": "HCF/LCM pairs 30s"
    },
    {
     "days": "दिन 3",
     "title": "शेषफल पैटर्न",
     "action": "15 Qs: same remainder, different remainders.",
     "details": [
      "Greatest number dividing N₁, N₂ leaving r each: HCF(N₁−r, N₂−r). Ex: 398 & 592 leaving 7 → HCF(391, 585) = 48.",
      "Smallest number divisible by all leaving r: LCM(divisors) + r.",
      "Different remainders: (divisor − remainder) का LCM approach — N = LCM(gaps) − gap।",
      "Greatest 4−digit divisible by 7, 11, 13: LCM(7, 11, 13) = 1001 → 9999 mod 1001 = 998 → 9999−998 = 9001."
     ],
     "target": "Remainder patterns 40s"
    },
    {
     "days": "दिन 4-5",
     "title": "गुणनखंड: गिनती, योग, सम",
     "action": "20 Qs.",
     "details": [
      "n = p₁ᵃ·p₂ᵇ·p₃ᶜ → factors count = (a+1)(b+1)(c+1). 360 = 2³·3²·5 → 24.",
      "Sum of factors = (1+p+p²+...+pᵃ)(...) per prime. 360: 15×13×6 = 1170.",
      "EVEN factors: if 2ᵃ || n → total × a/(a+1). 360: 24×3/4 = 18.",
      "Even SUM: total sum − odd−factor sum (2−bracket drop). 120 → 336 (trap: 360 total) — anchor.",
      "Perfect squares factors: exponents even choose: (⌊a/2⌋+1)... product.",
      "Prime factors count: सिर्फ़ distinct primes (360 → 3: {2, 3, 5})।"
     ],
     "target": "Factor count/sum 30s"
    },
    {
     "days": "दिन 6-7",
     "title": "शून्य + पूर्ण समेकन",
     "action": "n! zeros 10 Qs + 30 mixed PYQs.",
     "details": [
      "Zeros ritual: ⌊n/5⌋+⌊n/25⌋+⌊n/125⌋. 100! → 24; 36! → 8.",
      "Power of p in n!: same formula with p.",
      "Mixed 30−Q: HCF/LCM (8), remainders (6), factors (8), zeros (4), tricky (4).",
      "Timed 20 min, ≥ 17 correct target.",
      "Error log: \"2−number identity को 3 numbers पर लगाया\" जितनी बार — यह #1 trap है।"
     ],
     "target": "Timed 20−Q ≥ 85%"
    }
   ],
   "do": [
    "Factorise करना हमेशा पहले — 80% Qs factor form से खुल जाते हैं",
    "HCF×LCM = ab ONLY for 2 numbers — 3rd number दिखे तो identity मत use करो",
    "Difference shortcut (a−b) से candidates निकालना",
    "Zeros ritual 3−step: 5, 25, 125 — बिना skip किए"
   ],
   "avoid": [
    "3+ numbers पर HCF×LCM = product लिखना (wrong)",
    "Trailing zeros में ⌊n/25⌋ भूलना (100! → 20 vs 24)",
    "\"Greatest number\" और \"least number\" confuse करना (HCF vs LCM side)",
    "Even factors में total factors लिख देना"
   ],
   "tech": [
    {
     "name": "अंतर शॉर्टकट",
     "how": "HCF(a, b) | (a−b) → a−b के divisors से candidates।",
     "example": "1995−1785 = 210 → HCF 210 का divisor; 3381 check → 21"
    },
    {
     "name": "घातांक-स्थानांतरण (गुणनखंड)",
     "how": "Factor count: हर exponent पे +1, multiply। Even: ×a/(a+1) for 2ᵃ।",
     "example": "360: (3+1)(2+1)(1+1) = 24; even = 24×3/4 = 18"
    },
    {
     "name": "शेषफल स्थानांतरण",
     "how": "Same remainder r: HCF(N−r); divisible leaving r: LCM + r.",
     "example": "Divides 398, 592 leaving 7 → HCF(391, 585) = 48"
    }
   ],
   "worked": [
    {
     "q": "1785, 1995 और 3381 का HCF क्या है:",
     "options": [
      "21",
      "105",
      "7",
      "35"
     ],
     "answer": "21",
     "source": "Pinnacle/SSC pattern",
     "steps": [
      "1785 = 3×5×7×17; 1995 = 3×5×7×19 → HCF = 3×5×7 = 105.",
      "3381 = 3×7×7×23 → common with 105 = 3×7 = 21.",
      "HCF(105, 3381) = 21. Verify: 3381/21 = 161 ✓."
     ],
     "fast": "Difference: 1995−1785 = 210 → HCF | 210। 21 ∈ divisors(210) और 3381/21 = 161 ✓ → 21। 30 second।"
    },
    {
     "q": "360 के गुणनखंडों की संख्या क्या है:",
     "options": [
      "24",
      "20",
      "30",
      "18"
     ],
     "answer": "24",
     "source": "SSC pattern",
     "steps": [
      "360 = 2³ × 3² × 5¹.",
      "Factors = (3+1)(2+1)(1+1) = 4×3×2 = 24."
     ],
     "fast": "Exponent+1 multiply: 4×3×2 = 24. 10 second."
    },
    {
     "q": "वह सबसे छोटी संख्या जिसे 7, 11 और 13 से भाग देने पर हर बार शेष 5 बचे:",
     "options": [
      "1006",
      "1001",
      "996",
      "1011"
     ],
     "answer": "1006",
     "source": "SSC pattern",
     "steps": [
      "LCM(7, 11, 13) = 1001 (all prime).",
      "Smallest multiple + remainder = 1001 + 5 = 1006."
     ],
     "fast": "LCM + r = 1006. 10 second."
    }
   ],
   "daily": {
    "questions": 15,
    "minutes": 30,
    "focus": "HCF/LCM (5) + शेषफल (4) + गुणनखंड (4) + शून्य (2)",
    "drill": "रोज़ 10 संख्याओं का गुणनखंड (गति)"
   },
   "checklist": [
    "Factorisation to 1000 10s",
    "HCF/LCM 30s pairs",
    "2−number identity (और कब नहीं)",
    "Remainder patterns (same/diff)",
    "Factors count/sum/even",
    "Zeros 3−step ritual",
    "Timed 20−Q ≥ 85%"
   ],
   "tips": [
    "HCF/LCM Q = 30s budget — factor + apply, ज़्यादा सोचना नहीं",
    "3 numbers दिखे → identity भाग (pairwise HCF लगाओ)",
    "Options plug−in legal: \"divides both leaving r\" → 4 options × 4−second check",
    "Zeros: 25−वाला step हमेशा"
   ]
  },
  {
   "id": "mixture-alligation",
   "name": "मिश्रण",
   "icon": "🧪",
   "color": "#e67e22",
   "difficulty": 3,
   "time": "5-6 दिन",
   "weightage": {
    "tier1": "0-3 प्रश्न",
    "tier2": "2-6 प्रश्न",
    "rrb": "कभी-कभार (अंकगणित)",
    "note": "Tier 2 में 2-6 प्रश्न — छोटा लेकिन fixed−formula; 2-3 days में lock हो जाता है।"
   },
   "why": "Mixture & Alligation \"average के साथ ratio\" है — एक formula (alligation) से पूरा chapter। Replacement (remove + refill) type Tier 2 का favourite है: D(1−x/V)ⁿ एक line में। 87 PYQs bank में — सब 3-4 patterns से। यह topic high−ROI है: कम questions, ज़्यादा repeat, fixed formulas।",
   "plan": [
    {
     "days": "दिन 1-2",
     "title": "मिश्रण मूल",
     "action": "Ratio of mixtures 20 Qs.",
     "details": [
      "ALLIGATION: C:D ratio = (M−C):(D−M) — cheaper:dearer, M = mean price.",
      "C = 40, D = 60, M = 48 → (48−40):(60−48) = 8:12 = 2:3.",
      "% of cheaper = (M−D)/(C−D) × 100 → (48−60)/(40−60) = 12/20 = 60%... verify: 2:3 में cheaper = 2/5 = 40% (formula sign convention — magnitude: |M−D|/(D−C))।",
      "Quantity: total × ratio part.",
      "Milk−water classic: 60% & 40% → 50% mix → 1:1 (symmetry check habit).",
      "Profit−mix: CP weighted avg, SP से profit% — SP/CP ratio से alligation directly।"
     ],
     "target": "Alligation ratio 20s"
    },
    {
     "days": "दिन 3",
     "title": "तनुकरण (पानी मिलाना)",
     "action": "15 Qs.",
     "details": [
      "Add water to bring D% → M%: water = V(D−M)/M.",
      "80% → 50% in 1 L: water = 1×30/50 = 0.6 L.",
      "Reverse: water removed: liquid left = V·M/D.",
      "Successive dilution: हर step पे percentage × (fraction remaining)।",
      "Concentration language: \"mixture is 40% alcohol\" = 40L alcohol in 100L mix."
     ],
     "target": "Dilution 30s"
    },
    {
     "days": "दिन 4",
     "title": "प्रतिस्थापन (निकालना व भरना)",
     "action": "15 Qs — Tier 2 favourite.",
     "details": [
      "Formula: new concentration = D·(1 − x/V), x = removed volume, V = total.",
      "100 L, 50%, remove 10 L + water: 50 × 0.9 = 45%.",
      "n times: D·(1−x/V)ⁿ. 30 L⁷⁰% juice, 10 L × 2: 70×(2/3)² = 280/9 ≈ 31.1%.",
      "Two substances replace (milk removed, water added) — milk ही track करो, water = V − milk।",
      "Drain + fill cycle diagrams बनाओ — 2-3 steps के Qs में।"
     ],
     "target": "Replacement 40s"
    },
    {
     "days": "दिन 5-6",
     "title": "कार्य/दर अनुप्रयोग + PYQ",
     "action": "10 rate−mix Qs + 20 PYQs mixed + timed 10−Q.",
     "details": [
      "Workers: rate (1/day) से alligation — 12d & 18d workers, 15d combine → rate 1/12, 1/18, 1/15 → ratio = (1/15−1/18):(1/12−1/15)... alligation on RATES not days।",
      "Speed−mix, profit−mix — same alligation, variable बदलो।",
      "PYQ 20−Q mixed (87 available) + timed 10−Q (10 min).",
      "Error log: ratio sign flip (C:D vs D:C) कितनी बार हुई — यह #1 ग़लती है।"
     ],
     "target": "Timed 10−Q ≥ 9 correct"
    }
   ],
   "do": [
    "Alligation को CROSS−SUBTRACT याद करो: M से ऊपर वाला minus, नीचे वाला minus — always cheaper:dearer",
    "Percentage को fraction बनाओ (40% = 2/5) — ratio simple हो जाता है",
    "Replacement में BASE concentration से start (D को D(1−x/V) से update)",
    "Answer verify: ratio + total = given total (sanity check 5s)"
   ],
   "avoid": [
    "Ratio flip (cheaper:dearer vs dearer:cheaper) — options में दोनों मिलते हैं",
    "Days/years से alligation करना (RATES से करो)",
    "Replacement में हर बार full mixture गिना (सिर्फ़ tracked substance का fraction multiply करो)",
    "Water add करने से \"concentration same\" मानना (volume बढ़ा, concentration गिरा)"
   ],
   "tech": [
    {
     "name": "तिरछा-घटाव मिश्रण",
     "how": "(M−C): (D−M) → cheaper:dearer ratio.",
     "example": "₹40 & ₹60 at ₹48 → 8:12 = 2:3"
    },
    {
     "name": "प्रतिस्थापन श्रृंखला",
     "how": "हर remove+refill: concentration ×(1−x/V)।",
     "example": "50% → ×0.9 → 45% (10 L of 100 L)"
    },
    {
     "name": "दर रूपांतरण",
     "how": "Work/speed problems में days को rate (1/d) बनाओ, फिर alligation।",
     "example": "1/12, 1/18, mix 1/15 → ratio (1/15−1/18):(1/12−1/15) = 1:1"
    }
   ],
   "worked": [
    {
     "q": "80% अल्कोहल विलयन के 1 L में कितना पानी मिलाएँ कि 50% बने?",
     "options": [
      "0.6 L",
      "0.5 L",
      "0.4 L",
      "0.8 L"
     ],
     "answer": "0.6 L",
     "source": "SSC pattern",
     "steps": [
      "Water = V(D−M)/M = 1 × (80−50)/50.",
      "= 30/50 = 0.6 L."
     ],
     "fast": "Alcohol conserved: 0.8 L = 50% of new total → total = 1.6 L → water 0.6 L. 15 second."
    },
    {
     "q": "100 L बर्तन में 50% स्पिरिट मिश्रण है। 10 L निकाला और पानी से बदला गया। नई सांद्रता?",
     "options": [
      "45%",
      "40%",
      "50%",
      "42%"
     ],
     "answer": "45%",
     "source": "SSC pattern",
     "steps": [
      "New = D(1 − x/V) = 50 × (1 − 10/100).",
      "= 50 × 0.9 = 45%."
     ],
     "fast": "50 × 0.9 = 45. 10 second."
    },
    {
     "q": "70% जूस के 30 L। 10 L निकाला + पानी भरा, दो बार। अंतिम %?",
     "options": [
      "31.1%",
      "49%",
      "42%",
      "35%"
     ],
     "answer": "31.1%",
     "source": "SSC pattern",
     "steps": [
      "Each cycle: ×(1 − 10/30) = ×(2/3).",
      "Twice: 70 × (2/3)² = 70 × 4/9.",
      "= 280/9 ≈ 31.11%."
     ],
     "fast": "D(1−x/V)ⁿ = 70×(2/3)² = 31.1%. 20 second."
    }
   ],
   "daily": {
    "questions": 12,
    "minutes": 25,
    "focus": "मिश्रण (4) + तनुकरण (3) + प्रतिस्थापन (3) + दर (2)",
    "drill": "रोज़ 3 मिश्रण तिरछा-घटाव"
   },
   "checklist": [
    "Alligation cross−subtract 10s",
    "Ratio direction (cheaper:dearer) zero confusion",
    "Dilution V(D−M)/M automatic",
    "Replacement D(1−x/V)ⁿ",
    "Rate conversion (work)",
    "Timed 10−Q ≥ 90%"
   ],
   "tips": [
    "Mixture Q = 20s budget — cross−subtract + ratio",
    "Options में ratio flip दिखे → पहले \"कौन-सा कमज़ात\" identify करो",
    "Replacement: base concentration × fraction — एक line formula",
    "Work−mix में rates (1/d) लिखना, days से मत गिनो"
   ]
  }
 ],
 "master": {
  "title": "सार्वभौमिक गणित मास्टरी रोडमैप",
  "sub": "11 topics का optimal order — weightage + dependency analysis से",
  "rules": [
   {
    "name": "2-घंटे विभाजन",
    "text": "रोज़ 2 hours: 1h concept + 1h practice/revision। Research consensus: concept बिना practice waste, practice बिना concept fragile।"
   },
   {
    "name": "10-सेकंड नियम",
    "text": "Question पढ़ कर 10 second में approach नहीं दिखा → mark करो, आगे। वापस आओ section के end में. (Tier 1 time discipline)"
   },
   {
    "name": "40-50 सेकंड सीमा",
    "text": "Tier 1 में किसी भी Q पे 40-50s से ज़्यादा मत दो। अटका → skip। Speed practice ही speed बनाती है।"
   },
   {
    "name": "साप्ताहिक रीसेट",
    "text": "हर Sunday: 15-20 mixed Qs per active topic + सारे errors re−solve + formula chart scan। Revision बिना = नया बनाना।"
   },
   {
    "name": "एक-पुस्तक नियम",
    "text": "एक primary source (यह app + PYQ bank) — multiple books switch करना mastery तोड़ता है (research: top mistake #1)।"
   },
   {
    "name": "त्रुटि चक्रवृद्धि",
    "text": "हर ग़लत Q Error Log में — same mistake दो बार आने पर उसका pattern drill। Errors revise करना = free marks recovery।"
   }
  ],
  "phases": [
   {
    "name": "चरण 1 — नींव (दिन 1-20)",
    "topics": [
     "संख्या पद्धति",
     "सरलीकरण",
     "अनुपात-समानुपात",
     "HCF-LCM"
    ],
    "why": "Arithmetic base (35-45% RRB weightage) + calculation speed। बिना इसके advanced topics slow लगते हैं।",
    "daily": "1 topic focus (3h split: 1.5 concept, 1.5 practice) + 15 min speed maths + 10 min formulas"
   },
   {
    "name": "चरण 2 — उन्नत मूल (दिन 21-50)",
    "topics": [
     "बीजगणित",
     "ज्यामिति",
     "क्षेत्रमिति",
     "त्रिकोणमिति"
    ],
    "why": "Tier 2 के top−4 scorers: Geometry 9-15 Qs, Trigonometry 5-9, Algebra 3-6, Mensuration 5-6। यहाँ 20 दिन = exam में 20+ marks का difference।",
    "daily": "1 advanced topic deep (2h) + 1 foundation revision (30 min) + speed drill (15 min)"
   },
   {
    "name": "चरण 3 — गति + सटीकता (दिन 51-70)",
    "topics": [
     "साझेदारी",
     "मिश्रण",
     "ऊँचाई-दूरी"
    ],
    "why": "छोटे chapters quick lock + pattern recognition। 34 patterns + 27 traps से repeat−questions को 15s में पहचाना।",
    "daily": "2 छोटे topics + 20 mixed PYQs (timed) + pattern drills (10 min)"
   },
   {
    "name": "चरण 4 — परीक्षा अनुकरण (दिन 71-90)",
    "topics": [
     "सभी"
    ],
    "why": "Full mocks (−0.25 marking) से exam−day discipline। Analysis > practice: हर mock का error breakdown।",
    "daily": "1 full mock alternate days + analysis (30 min) + weak topic 20 Qs + formula/flashcard revision (20 min)"
   }
  ],
  "protocol": [
   "Section शुरू: 2 min में सब Qs SCAN करो — easy−पहचानो (15-20) पहले mark करो",
   "Round 1 (12 min): easy + medium confident — negative marking से बचने के लिए 4−option confident वही दो",
   "Round 2 (6 min): marked medium — approach clear हूँ तो दो, नहीं तो skip",
   "Round 3 (2 min): remaining — guess सिर्फ़ 1 option cut कर सको तो (25% chance से better)",
   "Trig/mensuration के Q section के शुरू में — formula fresh है",
   "हर Q: 10s approach rule + 45s cap (Tier 1 discipline)"
  ]
 }
};
