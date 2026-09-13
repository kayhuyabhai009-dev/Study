/* Legacy pattern library (32): Hindi name+signal, cleaned-English detail. Auto-converted. */
const PATTERNS_LEGACY = [
 {
  "id": "cubic-identity",
  "name": "घन सर्वसमिका (a+b+c=0) — विस्तृत",
  "signal": "a³+b³+c³−3abc वाला व्यंजक + a, b, c पर कोई शर्त दिखे",
  "concept": "a³+b³+c³−3abc = (a+b+c)(a²+b²+c²−ab−bc−ca). If a+b+c = 0 → 0.",
  "method": "Expand the factorised form and substitute values (1-3 min, error−prone).",
  "shortcut": "Check a+b+c = 0 FIRST. If yes → answer 0 in 10 seconds. If a+b−c = 0 → 3abc. If a−b−c = 0 → 3abc.",
  "wording": "If a+b+c = 0, find a³+b³+c³−3abc. If a+b−c = 0, find a³+b³−c³...",
  "variants": [
   "a+b−c = 0 variants",
   "a−b−c = 0 variants",
   "converse: given a³+b³+c³ = 3abc, find condition",
   "reciprocals 1/a+1/b+1/c = 0"
  ],
  "traps": [
   "Mechanically expanding the full formula when a+b+c = 0 is stated",
   "Missing the sign in a+b−c = 0 → a³+b³−c³ = +3abc",
   "Forgetting that a = b = c is the other branch of the converse"
  ],
  "examples": [
   "If a+b+c = 0, find a³+b³+c³−3abc (SSC CHSL 2023) → 0",
   "If x+y+z = 0 and x = 1, y = 2, find x³+y³+z³−3xyz → 0",
   "Find a³+b³+c³−3abc where a = 335, b = 215, c = 180 (SSC CHSL 04/08/2023)"
  ],
  "test": [
   {
    "q": "If a+b+c = 0, find a³+b³+c³−3abc",
    "a": "0"
   },
   {
    "q": "If a+b+c = 3 and a²+b²+c² = 5, find a³+b³+c³−3abc",
    "a": "(a+b+c)[(a+b+c)²−3(ab+bc+ca)]; use a²+b²+c² = 5 → ab+bc+ca = (9−5)/2 = 2 → 3(9−6) = 9"
   },
   {
    "q": "If a³+b³+c³ = 3abc, what must be true?",
    "a": "a = b = c or a+b+c = 0"
   }
  ],
  "time": "10 सेकंड (with condition), 2 मिनट (without)",
  "topic": "algebra",
  "freq": "Very High",
  "lang": "en"
 },
 {
  "id": "x-plus-1-x-chain",
  "name": "x + 1/x श्रृंखला — विस्तृत",
  "signal": "x+1/x या x−1/x (या व्युत्क्रम) दिया हो, xⁿ + 1/xⁿ माँगा हो",
  "concept": "Square the given relation to get the next even power; multiply for the next odd power.",
  "method": "Solve the quadratic for x, then compute powers (slow, messy surds).",
  "shortcut": "Plus chain: x²+1/x² = a²−2, x³+1/x³ = a³−3a, x⁴+1/x⁴ = (a²−2)²−2. Minus chain: x²+1/x² = a²+2, x³−1/x³ = a³+3a, x⁴+1/x⁴ = (a²+2)²−2.",
  "wording": "If x + 1/x = 2√5, find x² + 1/x² / x³ + 1/x³ / x⁴ + 1/x⁴",
  "variants": [
   "x²+1/x² given, find x−1/x (take √(a²+4))",
   "higher powers via (x²+1/x²)(x³+1/x³) ± (x+1/x)",
   "1/a+1/b style reciprocal conditions"
  ],
  "traps": [
   "Using a²+2 for the PLUS chain (that is the minus chain)",
   "Forgetting x⁵+1/x⁵ = (x²+1/x²)(x³+1/x³) − (x+1/x)",
   "Taking the wrong square root sign without the constraint"
  ],
  "examples": [
   "If x+1/x = 2, find x⁴+1/x⁴ (SSC various) → 2",
   "If x−1/x = 3, find x³−1/x³ → 27+9 = 36",
   "If x+1/x = √5, find x²+1/x² → 3"
  ],
  "test": [
   {
    "q": "If x + 1/x = 3, find x³ + 1/x³",
    "a": "3³ − 3·3 = 18"
   },
   {
    "q": "If x − 1/x = 2, find x⁴ + 1/x⁴",
    "a": "(2²+2)²−2 = 50−2 = 48"
   },
   {
    "q": "If x + 1/x = 2, what is x?",
    "a": "x = 1"
   }
  ],
  "time": "30-60 सेकंड",
  "topic": "algebra",
  "freq": "Very High",
  "lang": "en"
 },
 {
  "id": "factor-sum",
  "name": "गुणनखंड योग (सम/विषम/कुल)",
  "signal": "\"N के (सभी/सम/विषम) गुणनखंडों का योग\" या \"गुणनखंडों की संख्या\"",
  "concept": "N = pᵃ·qᵇ·rᶜ → σ(N) = (1+...+pᵃ)(1+...+qᵇ)(1+...+rᶜ); even factors drop the 2⁰ term.",
  "method": "List all factors manually (16 for 120 — slow).",
  "shortcut": "120 = 2³·3·5: total = 15×4×6 = 360; odd = 4×6 = 24; even = 360−24 = 336. Count = (a+1)(b+1)(c+1).",
  "wording": "Find the sum of even factors of 120.",
  "variants": [
   "sum of odd factors",
   "number of factors",
   "sum of factors divisible by k",
   "largest prime factor"
  ],
  "traps": [
   "Answering total (360) when EVEN was asked — the trap option",
   "Including 2⁰ = 1 in the even−factor bracket",
   "Confusing sum with count"
  ],
  "examples": [
   "Sum of even factors of 120 (SSC CHSL/ 2023) → 336",
   "Number of factors of 360 → 24",
   "Sum of odd factors of 120 → 24"
  ],
  "test": [
   {
    "q": "Sum of odd factors of 120",
    "a": "24"
   },
   {
    "q": "Number of factors of 144 = 2⁴·3²",
    "a": "5 × 3 = 15"
   },
   {
    "q": "Sum of all factors of 60",
    "a": "(1+2+4)(1+3)(1+5) = 7×4×6 = 168"
   }
  ],
  "time": "45-60 सेकंड",
  "topic": "number-system",
  "freq": "उच्च",
  "lang": "en"
 },
 {
  "id": "remainder-cycles",
  "name": "शेषफल चक्र (बड़ी घातें)",
  "signal": "बहुत बड़ी N के साथ \"aᴺ को m से भाग पर शेषफल\"",
  "concept": "Powers mod m cycle with small period; reduce the exponent modulo the period.",
  "method": "Big−number arithmetic (impossible).",
  "shortcut": "List a¹..aᵏ mod m until repeat. 5 mod 8: 5, 1, 5, 1... period 2 → 5^(odd) → 5. 7 mod 4: 3, 1, 3, 1 → 7¹⁰⁰ → 1.",
  "wording": "Find the remainder when 5³⁷ is divided by 8.",
  "variants": [
   "last digit = mod 10 (period 4)",
   "unit digit of aᵇᶜ (top−down)",
   "sums/products of powers (distribute mod)"
  ],
  "traps": [
   "Computing the period wrong (5² = 25 ≡ 1 mod 8, not 5)",
   "Not reducing bᶜ first in a^(bᶜ)"
  ],
  "examples": [
   "5³⁷ ÷ 8 → 5",
   "7¹⁰⁰ ÷ 4 → 1",
   "1¹!+2²!+3³! ÷ 5 → 1+4+27≡2 → 7 → 2"
  ],
  "test": [
   {
    "q": "Last digit of 7²⁰²⁴",
    "a": "2024 mod 4 = 0 → 1"
   },
   {
    "q": "Remainder of 3¹⁰⁰ mod 7",
    "a": "3⁶ ≡ 1 mod 7 → 100 mod 6 = 4 → 3⁴ = 81 ≡ 4"
   }
  ],
  "time": "45 सेकंड",
  "topic": "number-system",
  "freq": "उच्च",
  "lang": "en"
 },
 {
  "id": "lcm-hcf-identity",
  "name": "LCM × HCF = गुणनफल",
  "signal": "दो संख्याएँ; LCM/HCF/संख्या में से कोई दिया हो, दूसरी निकालनी हो",
  "concept": "For exactly two numbers: LCM × HCF = N1 × N2. HCF divides the difference.",
  "method": "Factorise and list (slow).",
  "shortcut": "N1·N2 = 96, HCF = 4 → N1 = 4x, N2 = 4y, xy = 6 with x, y co−prime → (1, 6), (2, 3) → pairs (4, 24), (8, 12).",
  "wording": "LCM is 24, HCF is 4; the numbers are... sum/difference of numbers is...",
  "variants": [
   "fractions (LCM = LCM num/HCF den)",
   "three numbers via iteration",
   "HCF from difference"
  ],
  "traps": [
   "Applying the identity to THREE numbers (invalid)",
   "Forgetting x, y must be co−prime"
  ],
  "examples": [
   "HCF 4, LCM 24, one number 8 → other 12",
   "LCM/HCF of fractions"
  ],
  "test": [
   {
    "q": "HCF of 1785, 1995, 3381",
    "a": "21 (iterate: HCF(1785, 1995) = 105, HCF(105, 3381) = 21)"
   },
   {
    "q": "LCM of 96, 36, 18",
    "a": "2⁵·3² = 288"
   }
  ],
  "time": "30-45 सेकंड",
  "topic": "hcf-lcm",
  "freq": "Very High",
  "lang": "en"
 },
 {
  "id": "alligation",
  "name": "मिश्रण नियम (Alligation)",
  "signal": "C और D कीमत की दो चीज़ें मिलाकर माध्य कीमत M; अनुपात निकालना",
  "concept": "Cheaper: Dearer = (D−M): (M−C).",
  "method": "Algebra with variables (works but slow).",
  "shortcut": "(40−36):(36−30) = 4:6 = 2:3.",
  "wording": "How much rice at ₹30/kg must be mixed with rice at ₹40/kg to get a mixture at ₹36/kg?",
  "variants": [
   "concentration problems (milk/water)",
   "profit% on mix",
   "three−ingredient via pairwise",
   "finding M from ratio"
  ],
  "traps": [
   "Reversing the ratio (cheaper gets D−M, dearer gets M−C — the OPPOSITE of intuition)",
   "Applying to 3 ingredients without pairwise alligation"
  ],
  "examples": [
   "Wine 10%, 20%, 30% mixed 2:3:x → 23% (SSC CHSL 02/11/2023) → x = 5",
   "Chemicals P:Q:R blend problems"
  ],
  "test": [
   {
    "q": "Mixture at ₹25 from ₹20 and ₹30 in what ratio?",
    "a": "(30−25):(25−20) = 1:1"
   },
   {
    "q": "Two solutions 20% and 40% mixed 1:2 → concentration?",
    "a": "(20+80)/3 = 33.33%"
   }
  ],
  "time": "20 सेकंड",
  "topic": "ratio-proportion",
  "freq": "Very High",
  "lang": "en"
 },
 {
  "id": "replacement-dilution",
  "name": "निकालना-भरना (तनुकरण)",
  "signal": "\"x लीटर निकालकर पानी भरा, n बार; शुद्ध कितना बचा\"",
  "concept": "Pure left = x(1 − y/x)ⁿ.",
  "method": "Step−by−step volume tracking (works for n = 2, tedious beyond).",
  "shortcut": "30(1−3/30)³ = 30(0.9)³ = 21.87 L.",
  "wording": "A³⁰ L vessel... 3 L removed and replaced with water, done 3 times. Milk left?",
  "variants": [
   "two operations with different y",
   "reverse: find y from final concentration",
   "two−liquid concentration tracking"
  ],
  "traps": [
   "Forgetting to REPEAT the operation (using n = 1)",
   "Using (1−x/y) instead of (1−y/x)"
  ],
  "examples": [
   "Drum blend 3:5:2, 60 L removed, 12 P + 8 Q added (SSC CGL 14/09/2025)"
  ],
  "test": [
   {
    "q": "100 L, remove 10 L replace with water, 2 times → pure left",
    "a": "100(0.9)² = 81 L"
   }
  ],
  "time": "30 सेकंड",
  "topic": "mixture-alligation",
  "freq": "Very High",
  "lang": "en"
 },
 {
  "id": "partner-equivalent",
  "name": "तुल्य निवेश (साझेदारी)",
  "signal": "साझेदारों की अलग-अलग राशि/अवधि; लाभ हिस्सा निकालना",
  "concept": "Profit ∝ capital × months−in−business.",
  "method": "Full algebra (slow).",
  "shortcut": "4×12: 5×12: 15×4 = 48:60:60 = 4:5:5.",
  "wording": "A and B invest in ratio 4:5; C joins after 8 months with 3× B's capital. Ratio of profit?",
  "variants": [
   "partner leaves mid−year",
   "active partner% + salary",
   "find capital from profit"
  ],
  "traps": [
   "Giving the late partner 12 months instead of actual months",
   "Forgetting the active partner's fixed% comes OFF the top first"
  ],
  "examples": [
   "Aftab/Tarun/Aditya ₹8000 each, left after 6 and 8 months → 3:4:6",
   "Rajesh active partner 10% (SSC MTS 2023 style)"
  ],
  "test": [
   {
    "q": "Same capital, A leaves after 6 months, B stays 12 → profit ratio",
    "a": "1:2"
   }
  ],
  "time": "30-45 सेकंड",
  "topic": "partnership",
  "freq": "उच्च",
  "lang": "en"
 },
 {
  "id": "trig-a-b-sin-cos",
  "name": "a·sinX + b·cosX = m तंत्र",
  "signal": "a·sinθ + b·cosθ = m दिया हो, a·cosθ − b·sinθ निकालना",
  "concept": "Square both expressions and add: (a sin+b cos)² + (a cos−b sin)² = a²+b².",
  "method": "Solve θ from the equation (heavy).",
  "shortcut": "a²+b² = m²+n² → n² = a²+b²−m² → n = ±√(a²+b²−m²). Example: 9+25−25 = 9 → ±3.",
  "wording": "If 3sinθ + 5cosθ = 5, find 3cosθ − 5sinθ.",
  "variants": [
   "sec/tan version: a²−b² = m²−n²",
   "cosec/cot version (same as sec/tan)"
  ],
  "traps": [
   "Using + instead of − in the sec−tan version (a²−b² not a²+b²)",
   "Missing the ± sign (both usually offered as options)"
  ],
  "examples": [
   "3sinθ+5cosθ = 5 → 3cosθ−5sinθ = ±3",
   "29secθ−21tanθ = 20 → 29tanθ−21secθ = ±20 (29²−21² = 841−441 = 400)"
  ],
  "test": [
   {
    "q": "If 5sinθ + 12cosθ = 12, find 5cosθ − 12sinθ",
    "a": "±√(25+144−144) = ±5"
   }
  ],
  "time": "20-30 सेकंड",
  "topic": "trigonometry",
  "freq": "उच्च",
  "lang": "en"
 },
 {
  "id": "trig-special-sums",
  "name": "विशेष कोण-समूह परिणाम",
  "signal": "A+B+C = 180° (या 90°, या A+B=45°) के साथ tan/cot व्यंजक",
  "concept": "180°: tanA+tanB+tanC = tanA·tanB·tanC; cot pairs sum = 1. 90°: tan pairs sum = 1; cot sum = cot product. A+B = 45°: (1+tanA)(1+tanB) = 2.",
  "method": "Substitute C = 180°−A−B and expand tan(180°−(A+B)) (slow).",
  "shortcut": "Recognize the set and apply the memorized result directly.",
  "wording": "If A+B+C = 180°, prove/find tanA+tanB+tanC.",
  "variants": [
   "numeric: given two angles, find the expression",
   "cot versions",
   "1−cot variants"
  ],
  "traps": [
   "Confusing the 180° and 90° result sets",
   "Applying (1+tanA)(1+tanB) = 2 without A+B = 45°"
  ],
  "examples": [
   "Triangle angle tan questions (SSC CGL various)"
  ],
  "test": [
   {
    "q": "A+B+C = 180°, tanA+tanB+tanC =?",
    "a": "tanA·tanB·tanC"
   },
   {
    "q": "A+B = 45°, (1+tanA)(1+tanB) =?",
    "a": "2"
   }
  ],
  "time": "15-30 सेकंड",
  "topic": "trigonometry",
  "freq": "उच्च",
  "lang": "en"
 },
 {
  "id": "trig-max-min",
  "name": "त्रिकोणमितीय अधिकतम/न्यूनतम",
  "signal": "त्रिकोणमितीय व्यंजक का अधिकतम/न्यूनतम मान",
  "concept": "a sinx ± b cosx → ±√(a²+b²). a sin²x + b cos²x → max(larger of a, b), min(smaller). a tan²x + b cot²x → min 2√(ab). sin²ⁿx + cos²ⁿx → max 1, min at 45°.",
  "method": "Differentiate (not allowed/slow in SSC).",
  "shortcut": "Match the form to the table. 3sinx+4cosx → max 5. sin²x+cos⁴x → min 1/2+1/4 = 3/4 at x = 45°.",
  "wording": "Maximum value of 3sinx + 4cosx. Minimum of sin²x + cos⁴x.",
  "variants": [
   "sec/cosec forms → min (√a+√b)² style",
   "(sinx·cosx)ⁿ"
  ],
  "traps": [
   "Answering 1 for a sin²x + b cos²x when a≠b",
   "Forgetting the 45° substitution for even−power minima"
  ],
  "examples": [
   "Find max of 3sinx+4cosx → 5",
   "min of sin²x+cos⁴x → 3/4"
  ],
  "test": [
   {
    "q": "Max of 5sinx − 12cosx",
    "a": "√(25+144) = 13"
   },
   {
    "q": "Min of 4tan²x + 9cot²x",
    "a": "2√36 = 12"
   }
  ],
  "time": "20 सेकंड",
  "topic": "trigonometry",
  "freq": "Medium-High",
  "lang": "en"
 },
 {
  "id": "height-shadow",
  "name": "छाया / गतिमान वस्तु ऊँचाई-दूरी",
  "signal": "दो सूर्य-उन्नतांश पर छाया लंबाई, या बदलते अवनमन कोण से मीनार की ओर आती कार",
  "concept": "shadow = H/tan(altitude); difference equation. Moving: 30°→45° covers H(√3−1); 30°→60° covers 2H/√3.",
  "method": "Full trig per case (works, 2-3 min).",
  "shortcut": "Set the difference equation once: H(1/tanθ1 − 1/tanθ2) = Δ. For 30°/45°: H(√3−1) = 40 → H = 20(√3+1).",
  "wording": "Shadow is 40 m longer at altitude 30° than 45°. Find tower height.",
  "variants": [
   "45°→60°",
   "tower on hill",
   "two buildings"
  ],
  "traps": [
   "Subtracting shadows in the wrong order (getting negative)",
   "Rationalising and matching the option form (20(√3+1) vs 20(3−1))"
  ],
  "examples": [
   "Shadow 40 m longer (SSC CHSL 10/01/2024) → 20(√3+1)≈54.6; option c \"20\" is the trap"
  ],
  "test": [
   {
    "q": "Depression 30°→45°, tower 10 m → car distance",
    "a": "10(√3−1) m"
   }
  ],
  "time": "60-90 सेकंड",
  "topic": "heights-distances",
  "freq": "उच्च",
  "lang": "en"
 },
 {
  "id": "two-circles",
  "name": "दो वृत्त और उभयनिष्ठ स्पर्शरेखाएँ",
  "signal": "दो वृत्तों की त्रिज्या/दूरी; स्पर्शरेखा, स्पर्श, प्रतिच्छेदन",
  "concept": "d vs R+r vs |R−r| decides the configuration. Direct tangent √(d²−(R−r)²); transverse √(d²−(R+r)²). Touch: d = R±r.",
  "method": "Draw and guess (dangerous).",
  "shortcut": "Compare d with R+r and |R−r| FIRST, then pick the tangent formula. Equal circles touching externally: direct tangent = d.",
  "wording": "Two circles of diameters 50 cm... common tangent length / number of tangents.",
  "variants": [
   "power of a point",
   "common chord length",
   "angle between circles"
  ],
  "traps": [
   "ASSUMING external touch when not stated (the big two−circles trap)",
   "Mixing up direct and transverse formulas"
  ],
  "examples": [
   "Two circles diameter 50 cm (Geometry)"
  ],
  "test": [
   {
    "q": "Circles radii 3 and 4 touch externally → centre distance",
    "a": "7"
   },
   {
    "q": "d = 10, R = 6, r = 2 → number of common tangents",
    "a": "d = R+r → 3 (touching externally)"
   }
  ],
  "time": "60-90 सेकंड",
  "topic": "geometry",
  "freq": "उच्च",
  "lang": "en"
 },
 {
  "id": "triangle-centres",
  "name": "त्रिभुज केंद्र और त्रिज्याएँ",
  "signal": "अंतःकेंद्र/परिकेंद्र/केंद्रक वाले प्रश्न; r, R, OI, माध्यिकाएँ",
  "concept": "∠BIC = 90°+A/2; r = Δ/s; R = abc/(4Δ); OI² = R²−2Rr; centroid 2:1 on medians; median triangle = 3/4 area; Apollonius.",
  "method": "Construct and measure (impossible in exam).",
  "shortcut": "Apply the memorized formula directly. Right triangle shortcuts: r = (p+b−h)/2, R = h/2.",
  "wording": "∠BIC =? if ∠A = 60°. Distance between circumcentre and incentre.",
  "variants": [
   "right−triangle median = hypotenuse/2",
   "equal−area six parts",
   "angle bisector + altitude: (B−C)/2"
  ],
  "traps": [
   "Using ∠BIC = 90°−A/2 (that is the excenter)",
   "Confusing inradius with circumradius in Δ/s vs abc/4Δ"
  ],
  "examples": [
   "SSC CHSL/CGL centre questions 2023-25"
  ],
  "test": [
   {
    "q": "∠A = 60° → ∠BIC",
    "a": "90+30 = 120°"
   },
   {
    "q": "Right triangle legs 3, 4 → inradius",
    "a": "(3+4−5)/2 = 1"
   }
  ],
  "time": "30-45 सेकंड",
  "topic": "geometry",
  "freq": "Medium-High",
  "lang": "en"
 },
 {
  "id": "cyclic-quadrilateral",
  "name": "चक्रीय चतुर्भुज और जीवा गुण",
  "signal": "वृत्त में चतुर्भुज; सम्मुख कोण; जीवा गुणनफल; स्पर्शरेखा-जीवा कोण",
  "concept": "Opposite angles sum 180°; Ptolemy AC·BD = AB·CD + BC·AD; AE·EB = CE·ED; PT² = PB·PA; tangent ⊥ radius; alternate segment theorem.",
  "method": "Case−by−case trig (slow).",
  "shortcut": "Identify which chord/tangent theorem applies; one−line substitution.",
  "wording": "Cyclic quadrilateral: ∠A = 70°, find ∠C. Chords cut at P: AE·EB = CE·ED...",
  "variants": [
   "tangent−secant power of a point",
   "angle in semicircle 90°",
   "angles in same segment equal"
  ],
  "traps": [
   "Applying Ptolemy to non−cyclic quadrilaterals",
   "Using AE×ED instead of AE×EB (wrong segments)"
  ],
  "examples": [
   "Geometry PYQs 2023-25 chord/tangent cluster"
  ],
  "test": [
   {
    "q": "PT tangent, secant PA = 9, PB = 4 → PT",
    "a": "√(9×4) = 6"
   },
   {
    "q": "Cyclic quad, ∠A = 110° → ∠C",
    "a": "70°"
   }
  ],
  "time": "30-45 सेकंड",
  "topic": "geometry",
  "freq": "Medium-High",
  "lang": "en"
 },
 {
  "id": "polygon-angles",
  "name": "बहुभुज कोण/विकर्ण गिनती",
  "signal": "समबहुभुज: कोण से भुजा निकालना, या विकर्ण गिनना",
  "concept": "Exterior = 360°/n; interior = 180°−360°/n; diagonals = n(n−3)/2.",
  "method": "Draw the polygon (unreliable).",
  "shortcut": "n = 360°/exterior = 360/36 = 10; diagonals = 10×7/2 = 35.",
  "wording": "Each exterior angle of a regular polygon is 36°. How many sides? How many diagonals?",
  "variants": [
   "sum of interior angles (n−2)180°",
   "interior angle given → n"
  ],
  "traps": [
   "Dividing 360 by the INTERIOR angle",
   "Forgetting diagonals excludes the 3 non−diagonals per vertex"
  ],
  "examples": [
   "Regular hexagon/octagon questions (all years)"
  ],
  "test": [
   {
    "q": "Interior angle 135° → n and diagonals",
    "a": "exterior 45° → n = 8, diagonals 20"
   }
  ],
  "time": "20 सेकंड",
  "topic": "geometry",
  "freq": "मध्यम",
  "lang": "en"
 },
 {
  "id": "mens-area-change",
  "name": "क्षेत्रफल में प्रतिशत परिवर्तन",
  "signal": "\"लंबाई/चौड़ाई/भुजा a% बढ़ी-घटी — क्षेत्रफल में % परिवर्तन\"",
  "concept": "Δ%area = a + b + ab/100 (b negative for decrease). All sides a% → area (2a + a²/100)%.",
  "method": "Pick 100×100, compute new area (works, 60s).",
  "shortcut": "20 + (−10) + (20×−10)/100 = 10 − 2 = 8% increase.",
  "wording": "The length of a rectangle is increased by 20% and breadth decreased by 10%. Change in area?",
  "variants": [
   "circle radius change (2a + a²/100)%",
   "cube edge → volume (3a+3a²+a³/100)%",
   "perimeter change = a%"
  ],
  "traps": [
   "Forgetting the ab/100 term (answering 10% instead of 8%)",
   "Using wrong sign for decrease"
  ],
  "examples": [
   "Mensuration PYQs all years — this is the most repeated mensuration pattern"
  ],
  "test": [
   {
    "q": "All sides of a square increase 10% → area change",
    "a": "2(10) + 1 = 21%"
   },
   {
    "q": "Circle radius +50% → area change",
    "a": "100 + 25 = 125%"
   }
  ],
  "time": "15-20 सेकंड",
  "topic": "mensuration",
  "freq": "Very High",
  "lang": "en"
 },
 {
  "id": "mens-solid-volumes",
  "name": "ठोस आयतन और पृष्ठ क्षेत्रफल",
  "signal": "शंकु/बेलन/गोला/अर्धगोला/छिन्नक के आयतन या पृष्ठ प्रश्न",
  "concept": "Memorize the solid table: V and TSA for cube, cuboid, cylinder, cone, sphere, hemisphere, frustum, tetrahedron, prism, box (capacity with thickness).",
  "method": "Derive from first principles (slow).",
  "shortcut": "Table lookup + slant l = √(r²+h²) where needed. Prism: base area × height. Box capacity: subtract 2t from each dimension.",
  "wording": "Cone volume (1/3)πr²h... TSA πr(l+r)... hemisphere TSA 3πr²...",
  "variants": [
   "rotating right triangle about each side → 3 cone volumes",
   "hollow solids (R vs r)",
   "melted/recast (volume conserved)",
   "open box TSA"
  ],
  "traps": [
   "Using TSA instead of CSA for a cylinder WITHOUT a top/bottom",
   "Forgetting the 1/3 in cone volume",
   "Capacity: using external dimensions instead of (l−2t)"
  ],
  "examples": [
   "Equilateral triangle base prism, LSA 120, side 4 → V = 40√3 (SSC CHSL 10/01/2024)"
  ],
  "test": [
   {
    "q": "Cone r = 7, h = 24 → slant and CSA",
    "a": "l = 25, CSA = π×7×25 = 175π"
   },
   {
    "q": "Hemisphere r = 3 → TSA",
    "a": "3π×9 = 27π"
   }
  ],
  "time": "45-75 सेकंड",
  "topic": "mensuration",
  "freq": "Very High",
  "lang": "en"
 },
 {
  "id": "pathway-area",
  "name": "रास्ता / क्रॉस-पथ क्षेत्रफल",
  "signal": "आयताकार भूखंड के चारों/अंदर x चौड़ा रास्ता, या दो कटते रास्ते",
  "concept": "Outer: 2x(L+B+2x). Inner: 2x(L+B−2x). Two crossing: x(L+B−x).",
  "method": "Subtract inner rectangle from outer (works, 60s).",
  "shortcut": "2×2(20+15+4) = 2×2×39 = 156m².",
  "wording": "A² m wide path runs around a²⁰ m × 15 m plot outside. Area of path?",
  "variants": [
   "circular path (π(R²−r²))",
   "path inside only",
   "diagonal path (rare)"
  ],
  "traps": [
   "Double−counting the crossing square in two−path problems (hence the −x)",
   "Using L+B without the ±2x adjustment"
  ],
  "examples": [
   "Mensuration PYQs 2023-25"
  ],
  "test": [
   {
    "q": "Two paths width 2 crossing in 20×15 plot",
    "a": "2(20+15−2) = 66m²"
   }
  ],
  "time": "30 सेकंड",
  "topic": "mensuration",
  "freq": "मध्यम",
  "lang": "en"
 },
 {
  "id": "quadratic-roots",
  "name": "द्विघात मूल और k-मान",
  "signal": "ax²+bx+c=0: मूलों का योग/गुणनफल, या \"वास्तविक-समान मूलों हेतु k का मान\"",
  "concept": "α+β = −b/a; αβ = c/a; D = b²−4ac = 0 for equal roots.",
  "method": "Solve the quadratic each time.",
  "shortcut": "4k² − 36 = 0 → k = ±3 → positive option 3.",
  "wording": "For what k does 3x²+2kx+3 = 0 have real and equal roots?",
  "variants": [
   "sum/product given → build t²−at+b = 0",
   "one root given → find other via sum/product",
   "cubic pair relations"
  ],
  "traps": [
   "Sign errors in −b/a and c/a",
   "Taking k negative when the question asks \"positive value\""
  ],
  "examples": [
   "3x²+2kx+3 = 0 (SSC CHSL 07/08/2023) → k = 3"
  ],
  "test": [
   {
    "q": "x²−5x+6 = 0: sum and product",
    "a": "5 and 6"
   },
   {
    "q": "Roots 2, 3 → equation",
    "a": "t²−5t+6 = 0"
   }
  ],
  "time": "30 सेकंड",
  "topic": "algebra",
  "freq": "उच्च",
  "lang": "en"
 },
 {
  "id": "linear-system-consistency",
  "name": "रैखिक तंत्र संगति",
  "signal": "दो रैखिक समीकरण: अद्वितीय / कोई नहीं / अनंत हल",
  "concept": "a1/a2 vs b1/b2: ≠ unique; = but ≠ c1/c2 → none; all equal → infinite.",
  "method": "Solve fully (slow).",
  "shortcut": "Ratio test in 5 seconds: 2/4 = 3/6 ≠ 5/7 → no solution.",
  "wording": "2x+3y = 5 and 4x+6y = 7 — how many solutions?",
  "variants": [
   "three variables three equations",
   "find c for infinite solutions"
  ],
  "traps": [
   "Comparing only a1/a2 with b1/b2 and forgetting the c−ratio for the no−solution case"
  ],
  "examples": [
   "Algebra PYQs 2023-25"
  ],
  "test": [
   {
    "q": "x+y = 4, 2x+2y = 8 → solutions?",
    "a": "infinite (coincident)"
   }
  ],
  "time": "15 सेकंड",
  "topic": "algebra",
  "freq": "मध्यम",
  "lang": "en"
 },
 {
  "id": "surd-rationalise",
  "name": "करणी परिमेयकरण",
  "signal": "हर में करणी वाला व्यंजक; सरल करना",
  "concept": "Multiply by the conjugate: 1/(a+√b) × (a−√b)/(a−√b) = (a−√b)/(a²−b).",
  "method": "Decimal approximation (wrong for MCQ exact answers).",
  "shortcut": "Conjugate multiply, denominator becomes difference of squares.",
  "wording": "Simplify 1/(3+2√2). (√3−√2)/(√3+√2)...",
  "variants": [
   "two−term surd (√a±√b)",
   "cube−root rationalising factors",
   "nested radical simplification √(a±2√b)"
  ],
  "traps": [
   "Wrong conjugate sign",
   "Forgetting the √3/√3 = √(3/3) form for single surds"
  ],
  "examples": [
   "Simplification PYQs all years"
  ],
  "test": [
   {
    "q": "1/(√5−√3) rationalised",
    "a": "(√5+√3)/2"
   }
  ],
  "time": "20-30 सेकंड",
  "topic": "simplification",
  "freq": "Medium-High",
  "lang": "en"
 },
 {
  "id": "nested-radical",
  "name": "अनंत नेस्टेड मूल",
  "signal": "अनंत तक √(x+√(x+...)) या √(x−√(x−...))",
  "concept": "Set = y, y = √(x+y) → y² − y − x = 0 → y = larger root. Trick: factors of x with difference 1.",
  "method": "Solve the quadratic (fast enough).",
  "shortcut": "Factors of 12 with diff 1: 4, 3 → plus form → 4. Minus form: 30 → 5, 6 → 5.",
  "wording": "Value of √(12+√(12+√(12+...))).",
  "variants": [
   "minus form √(x−√(x−...)) → smaller factor"
  ],
  "traps": [
   "Taking the negative root of the quadratic (y>0 required)",
   "Swapping larger/smaller between + and − forms"
  ],
  "examples": [
   "√(12+√(12+...)) = 4 (simplification)"
  ],
  "test": [
   {
    "q": "√(20+√(20+...))",
    "a": "factors 5, 4 → 5"
   },
   {
    "q": "√(20−√(20−...))",
    "a": "4"
   }
  ],
  "time": "20 सेकंड",
  "topic": "simplification",
  "freq": "Low-Medium (but guaranteed)",
  "lang": "en"
 },
 {
  "id": "age-ratio",
  "name": "आयु अनुपात प्रश्न",
  "signal": "अब/t वर्ष पहले/t वर्ष बाद आयु का अनुपात",
  "concept": "Difference in ages is CONSTANT. Set ages as 3k, 5k; solve (3k+t):(5k+t) = given.",
  "method": "Two−variable algebra (works, 2 min).",
  "shortcut": "Use the constant difference: 2k now = 2k later → solve the shifted ratio directly.",
  "wording": "Present ratio 3:5; 10 years later 4:6. Present ages?",
  "variants": [
   "father−son sum problems",
   "three people ratios",
   "average age of group after join/leave"
  ],
  "traps": [
   "Shifting the ratio without shifting the years consistently",
   "Group problems: forgetting the total changes when someone joins/leaves"
  ],
  "examples": [
   "Ratio & Proportion PYQs 2023-25"
  ],
  "test": [
   {
    "q": "Ratio 3:5, after 5 years 4:6 → present ages",
    "a": "3k+5: 5k+5 = 2:3 → 9k+15 = 10k+5 → k = 10 → 30 and 50"
   }
  ],
  "time": "45-60 सेकंड",
  "topic": "ratio-proportion",
  "freq": "मध्यम",
  "lang": "en"
 },
 {
  "id": "average-weighted",
  "name": "भारित औसत / माध्य",
  "signal": "संयुक्त समूहों का औसत, या अनुपात से माध्य",
  "concept": "Combined mean = (A1W1 + A2W2)/(W1+W2).",
  "method": "Sum all values (impractical for groups).",
  "shortcut": "(20×65 + 15×70)/35 = (1300+1050)/35 = 67.14.",
  "wording": "Average of 20 students 65, 15 students 70. Combined average?",
  "variants": [
   "find weight from mean deviation",
   "one item added/removed shifts mean → its value = new mean × new count − old sum"
  ],
  "traps": [
   "Averaging the averages instead of weighting"
  ],
  "examples": [
   "Ratio & Proportion PYQs 2023-25"
  ],
  "test": [
   {
    "q": "Mean of 1..20",
    "a": "10.5"
   }
  ],
  "time": "30 सेकंड",
  "topic": "ratio-proportion",
  "freq": "मध्यम",
  "lang": "en"
 },
 {
  "id": "congruent-similar",
  "name": "सर्वांगसमता और समरूपता",
  "signal": "समरूप या सर्वांगसम त्रिभुजों से सिद्ध करना/निकालना",
  "concept": "Area ratio = (side ratio)²; perimeter ratio = side ratio; congruency SSS/SAS/ASA/RHS.",
  "method": "Angle chasing (slow).",
  "shortcut": "Identify the similarity → square the ratio for areas.",
  "wording": "Triangles similar, ratio of sides 2:3 → ratio of areas?",
  "variants": [
   "midpoint theorem DE = BC/2",
   "Thales proportionality",
   "median/altitude in similar triangles (same ratio)"
  ],
  "traps": [
   "Using the side ratio for AREA (must square)",
   "Assuming similar when only congruent conditions are given"
  ],
  "examples": [
   "Geometry PYQs 2023-25"
  ],
  "test": [
   {
    "q": "Similar triangles area ratio 1:9 → side ratio",
    "a": "1:3"
   }
  ],
  "time": "20-30 सेकंड",
  "topic": "geometry",
  "freq": "मध्यम",
  "lang": "en"
 },
 {
  "id": "secant-tangent-power",
  "name": "बिंदु की घात",
  "signal": "बाहरी बिंदु से स्पर्शरेखा + छेदक; जीवाओं के प्रतिच्छेदन",
  "concept": "PT² = PA × PB (full secant from P). Chords: AE×EB = CE×ED.",
  "method": "Similar−triangle proof every time (slow).",
  "shortcut": "Direct substitution: PT = √(3×8) = √24 = 2√6.",
  "wording": "PT tangent, PAB secant with PA = 3, AB = 5 → PT?",
  "variants": [
   "two secants (PA×PB = PC×PD)",
   "internal chord angle (x+y)/2"
  ],
  "traps": [
   "Using PB (near part) instead of PA×PB (full) for the tangent−secant",
   "Subtracting instead of multiplying segments"
  ],
  "examples": [
   "Geometry PYQs 2023-25"
  ],
  "test": [
   {
    "q": "Two secants: PA = 2, AB = 6; PC = 3 → CD?",
    "a": "2×8 = 3×(3+CD) → CD = 25/3"
   }
  ],
  "time": "20 सेकंड",
  "topic": "geometry",
  "freq": "मध्यम",
  "lang": "en"
 },
 {
  "id": "trains-speed",
  "name": "रेलगाड़ी और सापेक्ष चाल — विस्तृत",
  "signal": "खंभे/प्लेटफॉर्म/दूसरी रेलगाड़ी को पार करती रेलगाड़ी",
  "concept": "Pole: length = v·t1. Platform: length+150 = v·t2. Relative: sum (opposite) or difference (same) speed; crossing time = total length / relative speed.",
  "method": "Full equations (fine).",
  "shortcut": "v = 150/(20−10) = 15 m/s; length = 150 m. Two trains: (L1+L2)/(v1+v2 or |v1−v2|).",
  "wording": "Train crosses a¹⁵⁰ m platform in 20 s and a pole in 10 s. Find length and speed.",
  "variants": [
   "same−direction catch−up",
   "passenger inside train views other train",
   "unit conversion ×5/18"
  ],
  "traps": [
   "Using only the platform length (ignoring train length)",
   "Wrong relative speed direction"
  ],
  "examples": [
   "Arithmetic PYQs 2023-25"
  ],
  "test": [
   {
    "q": "Two trains 100 m and 150 m, 30 km/h and 50 km/h opposite → crossing time",
    "a": "250/(80×5/18) = 250/22.22 ≈ 11.25 s"
   }
  ],
  "time": "45-60 सेकंड",
  "topic": "ratio-proportion",
  "freq": "Medium (arithmetic)",
  "lang": "en"
 },
 {
  "id": "percentage-chain",
  "name": "प्रतिशत परिवर्तन श्रृंखला",
  "signal": "क्रमागत वृद्धि/कमी, लाभ% + छूट% + MP/CP",
  "concept": "Net = a + b + ab/100. Profit on CP, discount on MP: MP = CP(1+profit%)(1/markup)...",
  "method": "Base 100 step by step (safe, 45s).",
  "shortcut": "1.2 × 0.9 = 1.08 → +8%.",
  "wording": "Price up 20% then down 10% — net change?",
  "variants": [
   "successive discount (single equivalent = a+b+ab/100)",
   "successive raises in salary"
  ],
  "traps": [
   "Adding percentages directly (20−10 = 10% instead of +8%)"
  ],
  "examples": [
   "Arithmetic PYQs all years"
  ],
  "test": [
   {
    "q": "Up 10%, down 10% → net",
    "a": "1.1×0.9 = 0.99 → −1%"
   }
  ],
  "time": "15-20 सेकंड",
  "topic": "ratio-proportion",
  "freq": "High (arithmetic)",
  "lang": "en"
 },
 {
  "id": "divisibility-11",
  "name": "11 से विभाज्यता और बड़ी संख्याएँ",
  "signal": "एकांतर-अंक योग परीक्षण, या बड़ी संख्या की विभाज्यता",
  "concept": "11: (odd−place sum) − (even−place sum) ≡ 0 mod 11.",
  "method": "Direct division (slow for big numbers).",
  "shortcut": "Alternate sum in 5 seconds.",
  "wording": "Which of the following is divisible by 11? The greatest 5−digit number divisible by...",
  "variants": [
   "largest/smallest n−digit divisible by k: k×⌊(10ⁿ−1)/k⌋ etc.",
   "divisibility by 7/13/37 group methods"
  ],
  "traps": [
   "Counting places from the wrong end (result sign flips but divisibility doesn't — still, be consistent)"
  ],
  "examples": [
   "Number system PYQs 2023-25"
  ],
  "test": [
   {
    "q": "Largest 4−digit divisible by 7",
    "a": "9996"
   }
  ],
  "time": "15 सेकंड",
  "topic": "number-system",
  "freq": "मध्यम",
  "lang": "en"
 },
 {
  "id": "base-conversion",
  "name": "संख्या आधार रूपांतरण",
  "signal": "बाइनरी/ऑक्टल/हेक्स या \"आधार n\" रूपांतरण",
  "concept": "Expand powers to convert to decimal; repeated division to convert from decimal.",
  "method": "Full expansion (fine).",
  "shortcut": "(1011)₂ = 8+2+1 = 11. 45 ÷ 3: remainders 0, 2, 1 → 120₃.",
  "wording": "(1011)₂ in decimal? 45 in base 3?",
  "variants": [
   "arithmetic IN another base (carry rules)",
   "find the base given an equation"
  ],
  "traps": [
   "Forgetting place values start at 0 from the right",
   "Using base−10 carry rules in base−n arithmetic"
  ],
  "examples": [
   "Number system PYQs 2023-25"
  ],
  "test": [
   {
    "q": "(202)₃ in decimal",
    "a": "2×9 + 0 + 2 = 20"
   }
  ],
  "time": "30-45 सेकंड",
  "topic": "number-system",
  "freq": "Low-Medium (but high marks)",
  "lang": "en"
 },
 {
  "id": "unit-digit",
  "name": "बड़ी घातों का इकाई अंक — विस्तृत",
  "signal": "aᵇ या a^(b^c) का अंतिम अंक",
  "concept": "Cycles of 4: 2→(2, 4, 8, 6), 3→(3, 9, 7, 1), 7→(7, 9, 3, 1), 8→(8, 4, 2, 6). Reduce exponent mod 4 (0 → 4th element). For a^(bᶜ), compute bᶜ mod 4 top−down.",
  "method": "Repeated multiplication (impossible).",
  "shortcut": "Cycle lookup + mod 4. 7²⁰²⁴: 2024 mod 4 = 0 → 1.",
  "wording": "Unit digit of 7²⁰²⁴. Of 3⁴³¹.",
  "variants": [
   "sum/difference of powers (unit digit distributes)",
   "ending 0, 1, 5, 6 never change",
   "2, 4, 8, 6 cycle"
  ],
  "traps": [
   "Computing the inner exponent wrong in a^(bᶜ)",
   "Using period 3 or 5"
  ],
  "examples": [
   "Number system PYQs all years"
  ],
  "test": [
   {
    "q": "Unit digit of 9⁹⁹",
    "a": "9 (odd) → 9"
   },
   {
    "q": "Unit digit of 6¹⁰⁰ + 7¹⁰⁰",
    "a": "6 + 1 = 7"
   }
  ],
  "time": "20-30 सेकंड",
  "topic": "number-system",
  "freq": "उच्च",
  "lang": "en"
 }
];
