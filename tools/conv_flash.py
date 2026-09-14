#!/usr/bin/env python3
"""Convert old FLASHCARDS (260) -> js/data-flashcards.js. Exact-match Hindi dicts + coverage report."""
import json, re, sys, subprocess
sys.path.insert(0, '/tmp')
from cleanmath import clean_math

def norm(s):
    return (s or '').replace('\u2019', "'").replace('\u2018', "'").strip()

FHI = {
'Number of factors of 360 (360 = 2^3·3^2·5)': '360 के गुणनखंडों की संख्या (360 = 2³·3²·5)',
'Sum of all factors of 120': '120 के सभी गुणनखंडों का योग',
'Sum of EVEN factors of 120': '120 के सम गुणनखंडों का योग',
'Trailing zeros in 36!': '36! के अंत में शून्य',
'Trailing zeros in 100!': '100! के अंत में शून्य',
'Highest power of 2 in 25!': '25! में 2 की उच्चतम घात',
'Unit digit of 7^2024': '7²⁰²⁴ का इकाई अंक',
'24 = 3 × ? (coprime parts for divisibility)': '24 = 3 × ? (विभाज्यता हेतु सह-अभाज्य भाग)',
'LCM of fractions rule': 'भिन्नों के LCM का नियम',
'HCF of fractions rule': 'भिन्नों के HCF का नियम',
'LCM × HCF identity': 'LCM × HCF सर्वसमिका',
'Remainder when 5^327 ÷ 8': 'शेषफल: 5³²⁷ ÷ 8',
'Divisibility by 11': '11 से विभाज्यता',
'Divisibility by 8': '8 से विभाज्यता',
'(1011)₂ in decimal': '(1011)₂ का दशमलव मान',
'45 in base 3': 'आधार 3 में 45',
'Negative remainder −3 mod 4': 'ऋणात्मक शेषफल −3 mod 4',
'Largest 4-digit number divisible by 7': '7 से भाज्य सबसे बड़ी 4-अंकीय संख्या',
'f(x) ÷ (x−a) leaves remainder': 'f(x) ÷ (x−a) शेषफल देता है',
'Only even prime': 'एकमात्र सम अभाज्य',
'Is 1 prime?': 'क्या 1 अभाज्य है?',
'Co-prime example that are not prime': 'सह-अभाज्य पर अभाज्य नहीं — उदाहरण',
'Any two consecutive integers are...': 'कोई दो क्रमागत पूर्णांक ...',
'Zeros in 1000!': '1000! में शून्य',
'Square of a number never ends with': 'किसी संख्या का वर्ग अंत में कभी नहीं आता',
'Root of a number ending in 4 ends with': 'अंत में 4 वाली संख्या का मूल अंत में आता है',
'VBODMAS order (first 3)': 'VBODMAS क्रम (पहले 3)',
'7 − (bar over 5−4)': '7 − (5−4 पर बार)',
'1/(3+2√2) rationalised': '1/(3+2√2) परिमेयकृत',
'Rationalising factor of √3': '√3 का परिमेयकारी गुणनखंड',
'If a+b+c = 0, then a³+b³+c³ = ?': 'यदि a+b+c = 0, तो a³+b³+c³ = ?',
'If a+b−c = 0, then a³+b³−c³ = ?': 'यदि a+b−c = 0, तो a³+b³−c³ = ?',
'If a³+b³+c³ = 3abc, then either': 'यदि a³+b³+c³ = 3abc, तो दोनों में से एक',
'a³+b³+c³−3abc factorised': 'a³+b³+c³−3abc का गुणनखंड',
'Quadratic ax²+bx+c: sum of roots': 'द्विघात ax²+bx+c: मूलों का योग',
'Quadratic: product of roots': 'द्विघात: मूलों का गुणनफल',
'Equal real roots condition': 'बराबर वास्तविक मूलों की शर्त',
'Cubic ax³+bx²+cx+d: product of roots': 'त्रिघात ax³+bx²+cx+d: मूलों का गुणनफल',
'Two lines a1x+b1y=c1, a2x+b2y=c2: no solution when': 'दो रेखाएँ a1x+b1y=c1, a2x+b2y=c2: कोई हल नहीं जब',
'Componendo-dividendo': 'योगानुपात-व्युत्क्रमानुपात',
'x+y fixed → xy maximum when': 'x+y नियत → xy अधिकतम जब',
'a²+b² given with a+b → find a²−b²... need also': 'a+b के साथ a²+b² दिया → a²−b²... और चाहिए',
'If x+1/x = ±3 then x⁶ = ?': 'यदि x+1/x = ±3 तो x⁶ = ?',
'x²−5x+6 roots': 'x²−5x+6 के मूल',
'Triplicate ratio of x:y': 'x:y का त्रिघाती अनुपात',
'Sub-duplicate ratio of x:y': 'x:y का उप-द्विघाती अनुपात',
'3rd proportional to a and b': 'a और b का तृतीयानुपाती',
'4th proportional to a, b, c': 'a, b, c का चतुर्थानुपाती',
'Mean proportion of a and b': 'a और b का मध्यानुपाती',
'Compound ratio of a:b, c:d, e:f': 'a:b, c:d, e:f का मिश्र अनुपात',
'Alligation: cheaper : dearer': 'मिश्रण: सस्ता : महँगा',
'Replace-and-replace n times: pure left': 'n बार निकालना-भरना: बचा शुद्ध',
'Weighted average': 'भारित औसत',
'Mean of n consecutive integers': 'n क्रमागत पूर्णांकों का माध्य',
'Age difference over time': 'समय के साथ आयु अंतर',
'Net % change: up a% then down b%': 'शुद्ध % परिवर्तन: a% वृद्धि फिर b% कमी',
'Up 20% then down 10%': '20% वृद्धि फिर 10% कमी',
'Up 10% then down 10%': '10% वृद्धि फिर 10% कमी',
'Profit ratio (compound partnership)': 'लाभ अनुपात (संयुक्त साझेदारी)',
'Partner joins after 8 months of a year → his time': 'साझेदार साल के 8 महीने बाद जुड़ा → उसका समय',
'Active partner management share': 'सक्रिय साझेदार का प्रबंधन हिस्सा',
'Simple partnership profit ratio': 'सरल साझेदारी लाभ अनुपात',
'Find capital from profit (compound)': 'लाभ से पूँजी निकालें (संयुक्त)',
'cos2A forms (3 of them)': 'cos2A के रूप (3)',
'Max of a·sinx ± b·cosx': 'a·sinx ± b·cosx का अधिकतम',
'Max of 3sinx + 4cosx': '3sinx + 4cosx का अधिकतम',
'a sinX+b cosX=m, a cosX−b sinX=n → identity': 'a sinX+b cosX=m, a cosX−b sinX=n → सर्वसमिका',
'a secX+b tanX=m, a tanX−b secX=n → identity': 'a secX+b tanX=m, a tanX−b secX=n → सर्वसमिका',
'Range of sinx': 'sinx का परिसर',
'Minimum of secx': 'secx का न्यूनतम',
'Max of a·sin²x + b·cos²x': 'a·sin²x + b·cos²x का अधिकतम',
'Min of a·tan²x + b·cot²x': 'a·tan²x + b·cot²x का न्यूनतम',
'Min of sin²x + cos⁴x': 'sin²x + cos⁴x का न्यूनतम',
'Angle of depression equals...': 'अवनमन कोण बराबर...',
'45° elevation at distance d → height': 'दूरी d पर 45° उन्नतांश → ऊँचाई',
'30° elevation at distance d → height': 'दूरी d पर 30° उन्नतांश → ऊँचाई',
'Car: depression 30°→45°, distance covered': 'कार: अवनमन 30°→45°, तय दूरी',
'Car: depression 30°→60°, distance covered': 'कार: अवनमन 30°→60°, तय दूरी',
'Shadow length formula': 'छाया लंबाई सूत्र',
'Shadow 40 m longer at 30° vs 45° → H': '30° पर 45° की तुलना में 40 m लंबी छाया → H',
'Ladder at 15° ratio': '15° पर सीढ़ी अनुपात',
'Same-side interior angles (parallel lines)': 'एकतरफा अंतःकोण (समांतर रेखाएँ)',
'Bisectors of same-side interior angles meet at': 'एकतरफा अंतःकोणों के समद्विभाजक मिलते हैं',
'Triangle: sum of two sides vs third': 'त्रिभुज: दो भुजाओं का योग बनाम तीसरी',
'AM bisects A, AN⊥BC → ∠MAN = ?': 'AM, A को समद्विभाजित करता है, AN⊥BC → ∠MAN = ?',
'Right triangle: median to hypotenuse': 'समकोण त्रिभुज: कर्ण की माध्यिका',
'Right triangle inradius r': 'समकोण त्रिभुज अंतःत्रिज्या r',
'Right triangle circumradius R': 'समकोण त्रिभुज परित्रिज्या R',
'Incenter angle ∠BIC': 'अंतःकेंद्र कोण ∠BIC',
'Excenter angle': 'बाह्यकेंद्र कोण',
'Inradius r general': 'अंतःत्रिज्या r (सामान्य)',
'Circumradius R general': 'परित्रिज्या R (सामान्य)',
'Distance circumcentre–incentre': 'परिकेंद्र–अंतःकेंद्र दूरी',
'Centroid divides median in ratio': 'केंद्रक माध्यिका को अनुपात में बाँटता है',
'Area of triangle from its medians': 'माध्यिकाओं से त्रिभुज का क्षेत्रफल',
'Apollonius theorem': 'अपोलोनियस प्रमेय',
'Internal angle bisector theorem': 'अंतःकोण समद्विभाजक प्रमेय',
'Midpoint theorem': 'मध्यबिंदु प्रमेय',
'Thales (basic proportionality)': 'थेल्स (आधारभूत समानुपातिकता)',
'Congruency criteria': 'सर्वांगसमता कसौटियाँ',
'Similar triangles: area ratio': 'समरूप त्रिभुज: क्षेत्रफल अनुपात',
'Sine rule': 'ज्या नियम',
'Cosine rule (cos A)': 'कोज्या नियम (cos A)',
'Angle in semicircle': 'अर्धवृत्त में कोण',
'Intersecting chords at P': 'P पर प्रतिच्छेदी जीवाएँ',
'Tangent from P, secant PAB: PT² = ?': 'P से स्पर्शरेखा, छेदक PAB: PT² = ?',
'Tangent at T is... to radius OT': 'T पर स्पर्शरेखा त्रिज्या OT पर...',
'Two tangents from P': 'P से दो स्पर्शरेखाएँ',
'Alternate segment theorem': 'एकांतर खंड प्रमेय',
'Two circles touch externally → distance': 'दो वृत्त बाह्य स्पर्श → दूरी',
'Two circles touch internally → distance': 'दो वृत्त अंतः स्पर्श → दूरी',
'Direct common tangent length': 'अनुस्पर्श उभयनिष्ठ स्पर्शरेखा की लंबाई',
'Transverse common tangent length': 'तिर्यक उभयनिष्ठ स्पर्शरेखा की लंबाई',
'd > R+r → number of common tangents': 'd > R+r → उभयनिष्ठ स्पर्शरेखाओं की संख्या',
'd = R+r → number of common tangents': 'd = R+r → उभयनिष्ठ स्पर्शरेखाओं की संख्या',
'Cyclic quadrilateral: opposite angles': 'चक्रीय चतुर्भुज: सम्मुख कोण',
'Ptolemy (cyclic quad)': 'टॉलेमी (चक्रीय चतुर्भुज)',
'Parallelogram: diagonals': 'समांतर चतुर्भुज: विकर्ण',
'Rhombus: 4a² = ?': 'समचतुर्भुज: 4a² = ?',
'Rhombus area': 'समचतुर्भुज क्षेत्रफल',
'Regular n-gon: diagonals': 'सम n-भुज: विकर्ण',
'Regular n-gon: each exterior angle': 'सम n-भुज: प्रत्येक बाह्य कोण',
'Sum of interior angles of n-gon': 'n-भुज के अंतःकोणों का योग',
'Distance formula (coordinates)': 'दूरी सूत्र (निर्देशांक)',
'Midpoint formula': 'मध्यबिंदु सूत्र',
'Perpendicular slopes': 'लंब प्रवणताएँ',
'Equilateral triangle area (side a)': 'समबाहु त्रिभुज क्षेत्रफल (भुजा a)',
'Equilateral triangle height': 'समबाहु त्रिभुज ऊँचाई',
'Equilateral inradius / circumradius': 'समबाहु अंतःत्रिज्या / परित्रिज्या',
"Heron's formula": 'हीरोन सूत्र',
'Isosceles triangle (sides a,a, base b) area': 'समद्विबाहु त्रिभुज (भुजाएँ a,a, आधार b) क्षेत्रफल',
'Trapezium area': 'समलंब क्षेत्रफल',
'Rectangle diagonal': 'आयत विकर्ण',
'Square area from diagonal d': 'विकर्ण d से वर्ग क्षेत्रफल',
'Circle: area, circumference': 'वृत्त: क्षेत्रफल, परिधि',
'Sector area (θ°)': 'त्रिज्यखंड क्षेत्रफल (θ°)',
'Arc length (θ°)': 'चाप लंबाई (θ°)',
'Ring area': 'वलय क्षेत्रफल',
'Outer pathway width x around L×B': 'L×B के बाहर x चौड़ा बाहरी रास्ता',
'Inner pathway width x inside L×B': 'L×B के अंदर x चौड़ा भीतरी रास्ता',
'Two crossing paths width x in L×B': 'L×B में x चौड़े दो कटते रास्ते',
'Cube: V, TSA, diagonal': 'घन: आयतन, कुल पृष्ठ, विकर्ण',
'Cuboid: V, TSA, diagonal': 'घनाभ: आयतन, कुल पृष्ठ, विकर्ण',
'Cylinder: V, CSA, TSA': 'बेलन: आयतन, वक्र पृष्ठ, कुल पृष्ठ',
'Cone: V, CSA, TSA': 'शंकु: आयतन, वक्र पृष्ठ, कुल पृष्ठ',
'Cone slant height': 'शंकु तिर्यक ऊँचाई',
'Sphere: V, TSA': 'गोला: आयतन, कुल पृष्ठ',
'Hemisphere: V, CSA, TSA': 'अर्धगोला: आयतन, वक्र पृष्ठ, कुल पृष्ठ',
'Hollow sphere volume': 'खोखले गोले का आयतन',
'Frustum of cone volume': 'शंकु छिन्नक आयतन',
'Frustum CSA': 'छिन्नक वक्र पृष्ठ',
'Prism volume': 'प्रिज़्म आयतन',
'Pyramid volume': 'पिरामिड आयतन',
'Regular tetrahedron volume': 'सम चतुष्फलक आयतन',
'Box capacity (thickness t)': 'डिब्बा धारिता (मोटाई t)',
'All sides +a% → area change': 'सभी भुजाएँ +a% → क्षेत्रफल परिवर्तन',
'L +a%, B +b% → area change': 'L +a%, B +b% → क्षेत्रफल परिवर्तन',
'Perimeter change when all sides +a%': 'सभी भुजाएँ +a% तो परिमाप परिवर्तन',
'Square inscribed in circle radius r: area': 'r त्रिज्या वृत्त में अंकित वर्ग: क्षेत्रफल',
'1 m³ = ? litres': '1 m³ = ? लीटर',
'1 km/h in m/s': 'm/s में 1 km/h',
'Pythagoras triplet (7, ?, 25)': 'पाइथागोरस त्रिक (7, ?, 25)',
'Pythagoras triplet (?, 35, 37)': 'पाइथागोरस त्रिक (?, 35, 37)',
'Alligation ratio': 'मिश्रण अनुपात',
'Mean price of ₹4/kg & ₹5/kg in 3:2': '3:2 में ₹4/kg और ₹5/kg का माध्य मूल्य',
'Pure liquid after n replacements': 'n प्रतिस्थापन बाद शुद्ध द्रव',
'30 L, replace 3 L × 3 times → milk left': '30 L, 3 L × 3 बार बदलें → बचा दूध',
'Milk fractions 1/3 and 4/5 mixed to get 4/9 → ratio': '1/3 और 4/5 दूध भिन्न मिलाकर 4/9 बनाया → अनुपात',
'LCM × HCF = ? (two numbers)': 'LCM × HCF = ? (दो संख्याएँ)',
'LCM of 96, 36, 18': '96, 36, 18 का LCM',
'HCF of 96, 36, 18': '96, 36, 18 का HCF',
'HCF of two co-prime numbers': 'दो सह-अभाज्य संख्याओं का HCF',
'LCM of fractions': 'भिन्नों का LCM',
'HCF of 1/2, 2/3, 3/4': '1/2, 2/3, 3/4 का HCF',
'LCM of 1/2, 2/3, 3/4': '1/2, 2/3, 3/4 का LCM',
'29 ÷ 8 leaves 5 → 29 ÷ 4 leaves': '29 ÷ 8 शेष 5 → 29 ÷ 4 शेष',
'Greatest number dividing N1,N2 leaving same remainder r': 'N1,N2 को भाग देकर समान शेष r छोड़ने वाली सबसे बड़ी संख्या',
'Smallest number divisible by all leaving remainder r': 'सभी से भाज्य, शेष r छोड़ने वाली सबसे छोटी संख्या',
'LCM of 12 and 18': '12 और 18 का LCM',
'Greatest number dividing 176 and 212 leaving remainder 5 in each case': '176 और 212 को भाग देकर हर बार शेष 5 छोड़ने वाली सबसे बड़ी संख्या',
'Profit ratio when capitals AND time differ': 'पूँजी और समय दोनों भिन्न हों तो लाभ अनुपात',
'Active partner gets a fixed monthly salary; how to split the rest': 'सक्रिय साझेदार को निश्चित मासिक वेतन मिलता है; शेष कैसे बाँटें',
"A, B, C in ratio 2:3:5; D joins at month 6 (12-month firm) investing B's capital": 'A, B, C अनुपात 2:3:5 में; D 6वें महीने जुड़ता है (12-महीने की फर्म), B की पूँजी लगाकर',
"Profit ₹15,000, ratio 2:3, B gets ₹200/month management fee (12 months). A's net share": 'लाभ ₹15,000, अनुपात 2:3, B को ₹200/महीना प्रबंधन शुल्क (12 महीने)। A का शुद्ध हिस्सा',
'A invests ₹50,000 for 12 months; B invests ₹30,000 for 8 months. Ratio': 'A ₹50,000, 12 महीने हेतु निवेश करता है; B ₹30,000, 8 महीने हेतु। अनुपात',
'A leaves a 12-month partnership after 8 months. His effective weight': 'A 12-महीने की साझेदारी 8 महीने बाद छोड़ता है। उसका प्रभावी भार',
"Ages 4:7 now, become 5:8 after 4 years. Elder's present age": 'आयु अभी 4:7, 4 साल बाद 5:8। बड़े की वर्तमान आयु',
'Split ₹4,500 in ratio 2:3:4. Largest share': '₹4,500 को 2:3:4 में बाँटें। सबसे बड़ा हिस्सा',
'A:B = 3:4 and B:C = 5:6. Find A:C': 'A:B = 3:4 और B:C = 5:6। A:C ज्ञात करें',
'Boys:girls = 7:5. 4 girls leave, 6 boys join → ratio 4:3. Total after change': 'लड़के:लड़कियाँ = 7:5। 4 लड़कियाँ गईं, 6 लड़के जुड़े → अनुपात 4:3। परिवर्तन के बाद कुल',
'a:b = 2:3. Find (2a+3b):(a+b)': 'a:b = 2:3। (2a+3b):(a+b) ज्ञात करें',
'Two numbers in ratio 5:8 differ by 12': 'अनुपात 5:8 की दो संख्याओं का अंतर 12 है',
'A runs 100 m in 12 s, B in 15 s; B starts 30 m ahead. Who wins, by how much': 'A 100 m 12 s में, B 15 s में दौड़ता है; B 30 m आगे से शुरू करता है। कौन जीता, कितने से',
'Milk 60% and 40% mixed to get 50%. Ratio of first to second': '60% और 40% दूध मिलाकर 50% बनाया। पहले : दूसरे का अनुपात',
'Add how much water to 1 L of 80% alcohol to make it 50%': '80% अल्कोहल के 1 L में कितना पानी मिलाएँ कि 50% बने',
'100 L jug with 50% spirit; 10 L drawn and replaced by water. New %': '50% स्पिरिट वाला 100 L जार; 10 L निकाला और पानी से बदला। नया %',
'Vessels with milk:water 3:2 and 5:3, equal volumes mixed. New ratio': 'दूध:पानी 3:2 और 5:3 वाले बर्तन, बराबर आयतन मिलाया। नया अनुपात',
'Rice @ ₹40/kg and ₹20/kg mixed to get ₹30/kg. Ratio': '₹40/kg और ₹20/kg चावल मिलाकर ₹30/kg बनाया। अनुपात',
'30 L of 70% juice; remove 10 L + add water, twice. Final %': '70% जूस के 30 L; 10 L निकालें + पानी मिलाएँ, दो बार। अंतिम %',
'25% of 60 + 40% of 75': '60 का 25% + 75 का 40%',
'A number ÷ 4 = 96. What does it give when ÷ 12': 'एक संख्या ÷ 4 = 96। ÷ 12 पर क्या मिलेगा',
"A tower's shadow is √3 times its height. Angle of elevation of the sun": 'मीनार की छाया ऊँचाई की √3 गुना। सूर्य का उन्नतांश कोण',
'50 m tree seen at 30° elevation. Distance from base': '30° उन्नतांश पर दिखता 50 m पेड़। आधार से दूरी',
'Tower base and two points 90 m apart: angles 30° and 60°. Height': 'मीनार आधार से 90 m दूरी पर दो बिंदु: कोण 30° और 60°। ऊँचाई',
'Kite string 100 m at 45°. Height of kite': '45° पर 100 m पतंग डोरी। पतंग की ऊँचाई',
'x + 1/x = 3. Find x² + 1/x²': 'x + 1/x = 3। x² + 1/x² ज्ञात करें',
'a + b = 3, a³ + b³ = 27. Find ab': 'a + b = 3, a³ + b³ = 27। ab ज्ञात करें',
'sin²θ + cos²θ + tan²θ at θ = 45°': 'θ = 45° पर sin²θ + cos²θ + tan²θ',
}

BHI = {
'(2+4+8)(1+3)(1+5) = 14×4×6 = 336 (exclude 2^0 or subtract odd sum 24)': '(2+4+8)(1+3)(1+5) = 14×4×6 = 336 (2⁰ हटाकर या विषम योग 24 घटाकर)',
'20+4 = 24 (the trap is 20)': '20+4 = 24 (जाल 20 है)',
'Cycle 7,9,3,1; 2024 mod 4 = 0 → 1': 'चक्र 7,9,3,1; 2024 mod 4 = 0 → 1',
'8 — check divisibility by 3 AND 8': '8 — 3 और 8 दोनों से विभाज्यता जाँचें',
'LCM(numerators) / HCF(denominators)': 'LCM(अंशों) / HCF(हरों)',
'HCF(numerators) / LCM(denominators)': 'HCF(अंशों) / LCM(हरों)',
'= product of the two numbers (exactly TWO numbers only)': '= दो संख्याओं का गुणनफल (सिर्फ दो संख्याओं हेतु)',
'5^2 ≡ 1 mod 8 → period 2 → 5^odd → 5': '5² ≡ 1 mod 8 → आवर्त 2 → विषम घात पर 5',
'Difference of sums of alternate digits is 0 or multiple of 11': 'एकांतर अंकों के योगों का अंतर 0 या 11 का गुणज होता है',
'Last three digits divisible by 8': 'अंतिम तीन अंक 8 से भाज्य',
'Add divisor: 1': 'भाजक जोड़ें: 1',
'f(a) (polynomial remainder theorem)': 'f(a) (बहुपद शेषफल प्रमेय)',
'No — primes have exactly two factors': 'नहीं — अभाज्यों के ठीक दो गुणनखंड होते हैं',
'Co-prime (HCF = 1)': 'सह-अभाज्य (HCF = 1)',
'Vinculum (bar) → Brackets → Of (×)': 'विनकुलम (बार) → कोष्ठक → का (×)',
'Bar first: 5−4=1 → 7−1 = 6': 'बार पहले: 5−4=1 → 7−1 = 6',
'4 (factors of 12 differing by 1: 4,3; plus form → larger)': '4 (12 के 1-अंतर वाले गुणनखंड: 4,3; धन-रूप → बड़ा)',
'5 (minus form → smaller factor: 5,6)': '5 (ऋण-रूप → छोटा गुणनखंड: 5,6)',
'3 (modulus = magnitude, never negative)': '3 (मापांक = परिमाण, कभी ऋणात्मक नहीं)',
'3abc (so a³+b³+c³−3abc = 0)': '3abc (अतः a³+b³+c³−3abc = 0)',
'a = b = c OR a + b + c = 0': 'a = b = c या a + b + c = 0',
'a² − 2 (PLUS chain loses 2)': 'a² − 2 (धन श्रृंखला में 2 घटता है)',
'a² + 2 (MINUS chain gains 2)': 'a² + 2 (ऋण श्रृंखला में 2 बढ़ता है)',
'Discriminant b²−4ac = 0': 'विविक्तकर b²−4ac = 0',
'a1/a2 = b1/b2 ≠ c1/c2 (parallel)': 'a1/a2 = b1/b2 ≠ c1/c2 (समांतर)',
'x=a, y=b, z=c (substitute directly)': 'x=a, y=b, z=c (सीधे प्रतिस्थापित करें)',
'ab or a−b; use (a−b)² = (a+b)²−4ab': 'ab या a−b; (a−b)² = (a+b)²−4ab इस्तेमाल करें',
'(2x+1)² (perfect square)': '(2x+1)² (पूर्ण वर्ग)',
'2 and 3': '2 और 3',
'(first + last)/2': '(पहला + अंतिम)/2',
'Constant — never changes': 'अचर — कभी नहीं बदलता',
'X1·T1 : X2·T2 : X3·T3 (investment × months)': 'X1·T1 : X2·T2 : X3·T3 (निवेश × महीने)',
'4 months': '4 महीने',
'Deduct fixed % from total FIRST, share the rest by capital ratio': 'कुल से निश्चित % पहले घटाएँ, शेष पूँजी अनुपात में बाँटें',
'Capital ratio (same time for all)': 'पूँजी अनुपात (सबका समय समान)',
'Capital ∝ Profit / Time': 'पूँजी ∝ लाभ / समय',
'+sinθ (Q2: sin positive)': '+sinθ (Q2: sin धनात्मक)',
'sec ≥ 1 or ≤ −1; |secx| ≥ 1': 'sec ≥ 1 या ≤ −1; |secx| ≥ 1',
'The LARGER of a and b': 'a और b में से बड़ा',
'The angle of elevation from the object (alternate angles)': 'वस्तु से उन्नतांश कोण (एकांतर कोण)',
'H / tan(altitude of sun)': 'H / tan(सूर्य का उन्नतांश)',
'Sum = 180°': 'योग = 180°',
'Greater than the third': 'तीसरी से बड़ा',
'Half the hypotenuse': 'कर्ण का आधा',
'h/2 (hypotenuse/2)': 'h/2 (कर्ण/2)',
'Area / semi-perimeter': 'क्षेत्रफल / अर्धपरिमाप',
'abc / (4 × Area)': 'abc / (4 × क्षेत्रफल)',
'2 : 1 (from vertex)': '2 : 1 (शीर्ष से)',
'Original = 4/3 × median triangle area': 'मूल = 4/3 × माध्यिका त्रिभुज क्षेत्रफल',
'DE ∥ BC and DE = BC/2': 'DE ∥ BC और DE = BC/2',
'(side ratio)²': '(भुजा अनुपात)²',
'90° (diameter as base)': '90° (व्यास आधार हो तो)',
'PA × PB (full secant)': 'PA × PB (पूरी छेदक)',
'Perpendicular': 'लंब',
'PA = PB; OP bisects ∠APB': 'PA = PB; OP, ∠APB को समद्विभाजित करता है',
'Tangent-chord angle = angle in alternate segment': 'स्पर्शरेखा-जीवा कोण = एकांतर खंड का कोण',
'3 (external touch)': '3 (बाह्य स्पर्श)',
'Bisect each other; d1²+d2² = 2(a²+b²)': 'एक-दूसरे को समद्विभाजित करते हैं; d1²+d2² = 2(a²+b²)',
'Product = −1': 'गुणनफल = −1',
'Base area × height': 'आधार क्षेत्रफल × ऊँचाई',
'(1/3) × base area × height': '(1/3) × आधार क्षेत्रफल × ऊँचाई',
'Exactly a%': 'ठीक a%',
'Cheaper : Dearer = (D−M) : (M−C)': 'सस्ता : महँगा = (D−M) : (M−C)',
'Product of the numbers': 'संख्याओं का गुणनफल',
'LCM(divisors) + r': 'LCM(भाजकों) + r',
'36 (= 2² × 3² — highest power of each prime)': '36 (= 2² × 3² — हर अभाज्य की उच्चतम घात)',
'Ratio of (capital × months invested). A: ₹60k×6m vs B: ₹30k×12m → 360:360 = 1:1.': '(पूँजी × निवेशित महीने) का अनुपात। A: ₹60k×6m बनाम B: ₹30k×12m → 360:360 = 1:1।',
'Subtract the salary from total profit FIRST, then split the balance in the capital ratio.': 'कुल लाभ से वेतन पहले घटाएँ, फिर शेष पूँजी अनुपात में बाँटें।',
'Capital × 8 (others keep capital × 12) — he earns 8/12 of what equal-capital share would give.': 'पूँजी × 8 (अन्य पूँजी × 12 रखते हैं) — समान पूँजी हिस्से का 8/12 मिलता है।',
'(4x+4)/(7x+4) = 5/8 → 32x+32 = 35x+20 → x=4 → elder = 28.': '(4x+4)/(7x+4) = 5/8 → 32x+32 = 35x+20 → x=4 → बड़ा = 28।',
'9 parts = 4500 → 1 part ₹500 → largest = ₹2,000.': '9 भाग = 4500 → 1 भाग ₹500 → सबसे बड़ा = ₹2,000।',
'Equalise B (20): A:B = 15:20, B:C = 20:24 → A:C = 15:24 = 5:8.': 'B बराबर करें (20): A:B = 15:20, B:C = 20:24 → A:C = 15:24 = 5:8।',
'(7x+6)/(5x−4) = 4/3 → 21x+18 = 20x−16 → x = 34 → 250+132 = 382. (Boys 244, girls 138.)': '(7x+6)/(5x−4) = 4/3 → 21x+18 = 20x−16 → x = 34 → 250+132 = 382। (लड़के 244, लड़कियाँ 138।)',
'3 parts = 12 → numbers are 20 and 32.': '3 भाग = 12 → संख्याएँ 20 और 32 हैं।',
'When A finishes (12 s), B has run 100×12/15 = 80 m → B is at 110 m: B wins by 10 m.': 'जब A समाप्त करता है (12 s), B ने 100×12/15 = 80 m दौड़ा → B 110 m पर है: B 10 m से जीतता है।',
'Alligation: (50−40):(60−50) = 1:1.': 'मिश्रण: (50−40):(60−50) = 1:1।',
'Water = V(D−M)/M = 1×(80−50)/50 = 0.6 L.': 'पानी = V(D−M)/M = 1×(80−50)/50 = 0.6 L।',
'Milk = 3/5 + 5/8 = 49/40; water = 2/5 + 3/8 = 31/40 → 49:31.': 'दूध = 3/5 + 5/8 = 49/40; पानी = 2/5 + 3/8 = 31/40 → 49:31।',
'Number = 384; 384/12 = 32. (÷12 is ÷4 then ÷3: 96/3 = 32.)': 'संख्या = 384; 384/12 = 32। (÷12 अर्थात ÷4 फिर ÷3: 96/3 = 32।)',
'1 (identity: sec²θ = 1 + tan²θ).': '1 (सर्वसमिका: sec²θ = 1 + tan²θ)।',
'2, 3, 7 or 8': '2, 3, 7 या 8',
'2 or 8': '2 या 8',
'3/4 (at x = 45°)': '3/4 (x = 45° पर)',
'15000 − 2400 = 12600 in 2:3 → A = 2/5 × 12600 = ₹5,040.': '15000 − 2400 = 12600, 2:3 में → A = 2/5 × 12600 = ₹5,040।',
}

TOPIC = {'number-system': 'संख्या पद्धति', 'algebra': 'बीजगणित', 'trigonometry': 'त्रिकोणमिति',
 'heights-distances': 'ऊँचाई-दूरी', 'geometry': 'ज्यामिति', 'mensuration': 'क्षेत्रमिति',
 'ratio-proportion': 'अनुपात', 'partnership': 'साझेदारी', 'mixture-alligation': 'मिश्रण',
 'hcf-lcm': 'HCF-LCM', 'simplification': 'सरलीकरण'}

ENGLISH_WORDS = set(('of,in,at,by,to,or,is,are,and,the,for,all,add,bar,age,up,down,max,min,sum,odd,even,'
'old,new,top,per,vs,now,who,how,not,no,yes,if,then,either,than,from,with,when,what,first,last,'
'times,time,ratio,mean,parts,part,share,month,months,price,profit,capital,boys,girls,leave,join,'
'total,change,after,find,leaves,leaving,greatest,smallest,largest,elder,years,year,present,become,'
'split,differ,runs,starts,ahead,wins,number,numbers,square,root,ends,never,fixed,order,form,forms,'
'given,need,also,only,exactly,same,each,side,sides,common,length,formula,triangle,height,base,prime,'
'divisible,divisibility,rule,identity,theorem,factors,product,roots,alternate,interior,right,angle,'
'angles,distance,elevation,depression,shadow,tangent,area,areas,volume,slope,slopes,radius,diagonal,'
'exterior,regular,perimeter,triplet,mixed,milk,water,rice,salary,rest,balance,monthly,invests,invested,'
'equal,equalise,highest,power,trailing,zeros,zero,unit,digit,remainder,negative,consecutive,integers,'
'weighted,average,compound,simple,active,partner,cheaper,dearer,vessels,vessel,alcohol,spirit,juice,'
'tower,tree,kite,string,ladder,car,sun,outer,inner,crossing,paths,path,sector,ring,hollow,cube,cuboid,'
'cylinder,cone,sphere,hemisphere,frustum,prism,pyramid,box,capacity,thickness,rectangle,circle,polygon,'
'rhombus,trapezium,parallelogram,isosceles,equilateral,heron,thales,sine,cosine,midpoint,centroid,'
'inradius,circumradius,incenter,excenter,apollonius,ptolemy,bisector,bisectors,congruency,similar,'
'perpendicular,parallel,chords,chord,cyclic,secant,coordinates,two,three,four,five,six,seven,eight,'
'nine,ten,twelve,thirty,fifty,third,fourth,triplicate,duplicate,rationalising,rationalised,substitute,'
'directly,discriminant,perfect,jug,drawn,replaced,pure,liquid,gets,has,have,would,more,most,less,'
'between,into,over,once,twice,always,often,other,plus,minus,seen,apart,points,earns,earn,keep,give,'
'full,via,an,cycle,period,larger,smaller,bisects,month,forms,can,get,got,let,was,were,been,does,did').split(','))
MATH_OK = set(('lcm,hcf,tsa,csa,sss,sas,asa,rhs,vbodmas,mod,log,num,den,sin,cos,tan,sec,cosec,'
'cot,sinx,cosx,tanx,secx,q2,v,l,m,s,kg,km,h,w,pt,op,de,bc,ad,db,ae,ec,ac,bd,ab,cd,bic,oi,am,an,man,xy,rr').split(','))
TRIGC = re.compile(r'^(?:sin|cos|tan|sec|cosec|cot)[a-d]?(?:(?:sin|cos|tan|sec|cosec|cot)[a-d]?)*$', re.I)

def has_english(s):
    for tok in re.findall(r'[A-Za-z]+', s or ''):
        if len(tok) < 2: continue
        lo = tok.lower()
        if TRIGC.match(tok) or lo in MATH_OK: continue
        if lo in ENGLISH_WORDS: return True
        if 2 <= len(tok) <= 4 and tok.isupper(): continue  # geometry labels: AB, PT, PAB
        if tok.islower() and len(tok) <= 4: continue  # math products: lbh, ace
        return True
    return False

raw = subprocess.run(['node', '-e',
  "const fs=require('fs');global.window={};eval(fs.readFileSync('/tmp/old-flash.js','utf8'));console.log(JSON.stringify(global.window.FLASHCARDS));"],
  capture_output=True, text=True).stdout
old = json.loads(raw)
out, hi, unF, unB = [], 0, [], []
for i, c in enumerate(old):
    f_raw, b_raw = norm(c.get('f', '')), norm(c.get('b', ''))
    f = FHI.get(f_raw)
    if f is None:
        f = clean_math(f_raw)
        if has_english(f): unF.append((i, f_raw))
    b = BHI.get(b_raw)
    if b is None:
        b = clean_math(b_raw)
        if has_english(b): unB.append((i, b_raw))
    lang = 'hi' if (not has_english(f) and not has_english(b)) else 'en'
    if lang == 'hi': hi += 1
    out.append({'id': f'C{i+1:03d}', 'topic': TOPIC.get(c.get('t', ''), c.get('t', '')), 'f': f, 'b': b, 'lang': lang})
js = '/* Flashcards 260: Hindi (exact-match translated). Auto-converted. */\nconst FLASHCARDS = ' + json.dumps(out, ensure_ascii=False, indent=1) + ';\n'
open('js/data-flashcards.js', 'w', encoding='utf-8').write(js)
print(f'cards: {len(out)}, hi: {hi}, en: {len(out)-hi}')
print('--- unmatched fronts with EN:', len(unF))
for i, s in unF[:20]: print(' F#%d: %s' % (i, s))
print('--- unmatched backs with EN:', len(unB))
for i, s in unB[:20]: print(' B#%d: %s' % (i, s))
print('--- en cards:')
for c in out:
    if c['lang'] == 'en': print(' ', c['id'], '|', c['f'][:60], '||', c['b'][:60])
print('bytes:', len(js.encode('utf-8')))
