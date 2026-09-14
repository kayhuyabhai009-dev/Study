#!/usr/bin/env python3
"""Convert old MASTERY_PLANS + MASTERY_MASTER_PLAN -> js/data-mastery.js.
Hinglish->Hindi word transliteration (hand-verified map) + exact Hindi labels."""
import json, re, sys, subprocess
sys.path.insert(0, '/tmp')
from cleanmath import clean_math

TR = {
'mein': 'में', 'se': 'से', 'ka': 'का', 'ke': 'के', 'ki': 'की', 'ko': 'को', 'pe': 'पे',
'par': 'पर', 'tak': 'तक', 'bina': 'बिना', 'saath': 'साथ', 'liye': 'लिए', 'wasta': 'वास्ता',
'yeh': 'यह', 'yah': 'यह', 'yehi': 'यही', 'yahi': 'यही', 'woh': 'वह', 'wahi': 'वही',
'jo': 'जो', 'jisne': 'जिसने', 'isse': 'इससे', 'iske': 'इसके', 'isi': 'इसी', 'ispar': 'इसपर',
'isliye': 'इसलिए', 'uska': 'उसका', 'usi': 'उसी', 'us': 'उस', 'unke': 'उनके', 'apna': 'अपना',
'humari': 'हमारी', 'tumhari': 'तुम्हारी', 'khud': 'खुद',
'hai': 'है', 'hain': 'हैं', 'ho': 'हो', 'hon': 'हों', 'hoon': 'हूँ', 'hota': 'होता',
'hoti': 'होती', 'hote': 'होते', 'hua': 'हुआ', 'hui': 'हुई', 'hoga': 'होगा', 'hone': 'होने',
'hona': 'होना', 'tha': 'था',
'karo': 'करो', 'karna': 'करना', 'karne': 'करने', 'karte': 'करते', 'karta': 'करता',
'kare': 'करे', 'kar': 'कर', 'karke': 'करके', 'karni': 'करनी', 'kiya': 'किया', 'kiye': 'किए',
'gaya': 'गया', 'gaye': 'गए', 'gayi': 'गई', 'jata': 'जाता', 'jaate': 'जाते', 'jaata': 'जाता',
'aata': 'आता', 'aate': 'आते', 'aane': 'आने', 'aao': 'आओ',
'padh': 'पढ़', 'padhte': 'पढ़ते', 'padho': 'पढ़ो', 'likh': 'लिख', 'likho': 'लिखो',
'likhna': 'लिखना', 'dekh': 'देख', 'dekho': 'देखो', 'dekhte': 'देखते', 'dikha': 'दिखा',
'dikhe': 'दिखे', 'socho': 'सोचो', 'sochna': 'सोचना', 'soche': 'सोचे', 'seekh': 'सीख',
'seekho': 'सीखो', 'seekha': 'सीखा', 'nikalo': 'निकालो', 'nikalna': 'निकालना',
'lagao': 'लगाओ', 'lagana': 'लगाना', 'laagna': 'लगाना', 'lagta': 'लगता', 'lagata': 'लगता',
'lagte': 'लगते', 'lagaya': 'लगाया', 'khatam': 'खत्म', 'shuru': 'शुरू', 'banao': 'बनाओ',
'banate': 'बनाते', 'banane': 'बनाने', 'banakar': 'बनाकर', 'banati': 'बनाती', 'bana': 'बना',
'ban': 'बन', 'banana': 'बनाना', 'tod': 'तोड़', 'todo': 'तोड़ो', 'todta': 'तोड़ता',
'jodo': 'जोड़ो', 'jodna': 'जोड़ना', 'kaat': 'काट', 'kate': 'कटे', 'khul': 'खुल',
'gino': 'गिनो', 'gina': 'गिना', 'mile': 'मिले', 'mila': 'मिला', 'milte': 'मिलते',
'milta': 'मिलता', 'milne': 'मिलने', 'milega': 'मिलेगा', 'milakar': 'मिलाकर', 'milke': 'मिलके',
'dena': 'देना', 'deta': 'देता', 'deti': 'देती', 'diya': 'दिया', 'le': 'ले', 'lo': 'लो',
'li': 'ली', 'leke': 'लेके', 'daalo': 'डालो', 'rakhna': 'रखना', 'pehchan': 'पहचान',
'pehchana': 'पहचाना', 'pehchano': 'पहचानो', 'ratle': 'रट लें', 'ratlo': 'रट लो',
'ratne': 'रटने', 'rat': 'रट', 'maanna': 'मानना', 'maangta': 'माँगता', 'bhoolna': 'भूलना',
'rukna': 'रुकना', 'atke': 'अटके', 'atka': 'अटका', 'chalte': 'चलते', 'chalta': 'चलता',
'chalti': 'चलती', 'chhodte': 'छोड़ते', 'chhuddi': 'छूटती', 'badlo': 'बदलो', 'badha': 'बढ़ा',
'gira': 'गिरा', 'badhta': 'बढ़ता', 'pucha': 'पूछा', 'puchha': 'पूछा', 'puchhti': 'पूछती',
'bolo': 'बोलो', 'dhundo': 'ढूँढो', 'sako': 'सको', 'bachne': 'बचने',
'pehle': 'पहले', 'baad': 'बाद', 'phir': 'फिर', 'turant': 'तुरंत', 'jaldi': 'जल्दी',
'hamesha': 'हमेशा', 'kabhi': 'कभी', 'roz': 'रोज़', 'subah': 'सुबह', 'aaj': 'आज',
'din': 'दिन', 'saal': 'साल', 'saar': 'साल', 'baar': 'बार', 'pehla': 'पहला',
'doosra': 'दूसरा', 'doosre': 'दूसरे', 'teeno': 'तीनों', 'dono': 'दोनों', 'sab': 'सब',
'saare': 'सारे', 'sabse': 'सबसे', 'sirf': 'सिर्फ़', 'bas': 'बस', 'bhi': 'भी', 'hi': 'ही',
'toh': 'तो', 'ya': 'या', 'aur': 'और', 'lekin': 'लेकिन', 'agar': 'अगर', 'kyunki': 'क्योंकि',
'jab': 'जब', 'mat': 'मत', 'na': 'ना', 'nahi': 'नहीं', 'nhi': 'नहीं', 'kaafi': 'काफ़ी',
'zyada': 'ज़्यादा', 'kam': 'कम', 'chahiye': 'चाहिए', 'bada': 'बड़ा', 'bade': 'बड़े',
'chhota': 'छोटा', 'chhote': 'छोटे', 'lamba': 'लंबा', 'accha': 'अच्छा', 'theek': 'ठीक',
'sahi': 'सही', 'galat': 'ग़लत', 'galti': 'ग़लती', 'galtiyan': 'ग़लतियाँ', 'sach': 'सच',
'zaroori': 'ज़रूरी', 'aasaan': 'आसान', 'ulta': 'उल्टा', 'poora': 'पूरा', 'poore': 'पूरे',
'aadha': 'आधा', 'aadhi': 'आधी', 'alag': 'अलग', 'khinche': 'खिंचे', 'jaisa': 'जैसा',
'jaise': 'जैसे', 'jitni': 'जितनी', 'kitne': 'कितने', 'kitni': 'कितनी', 'kaunsa': 'कौन-सा',
'kaunsi': 'कौन-सी', 'kuch': 'कुछ', 'koi': 'कोई', 'kya': 'क्या', 'kab': 'कब',
'wapas': 'वापस', 'upar': 'ऊपर', 'neeche': 'नीचे', 'andar': 'अंदर', 'yahan': 'यहाँ',
'jahan': 'जहाँ', 'aage': 'आगे', 'taraf': 'तरफ़', 'paas': 'पास', 'nazar': 'नज़र',
'khabar': 'ख़बर', 'dhyan': 'ध्यान', 'yaad': 'याद', 'aadat': 'आदत', 'hisaab': 'हिसाब',
'waqt': 'वक़्त', 'jagah': 'जगह', 'bhaag': 'भाग', 'kamzaat': 'कमज़ात', 'darrawana': 'डरावना',
'napa': 'नापा', 'sasta': 'सस्ता', 'sasti': 'सस्ती', 'khade': 'खड़े', 'naya': 'नया',
'ek': 'एक', 'wale': 'वाले', 'wala': 'वाला', 'scann': 'SCAN', 'isent': '',
'har': 'हर', 'baaki': 'बाकी', 'aati': 'आती', 'kisi': 'किसी', 'bachta': 'बचता',
'jaanch': 'जाँच', 'chupke': 'चुपके', 'rahe': 'रहे', 'band': 'बंद', 'naam': 'नाम',
'lage': 'लगे', 'raha': 'रहा',
}
TR_KEYS = sorted(TR.keys(), key=len, reverse=True)
TR_RX = re.compile(r'\b(' + '|'.join(TR_KEYS) + r')\b', re.I)
DO_RX = re.compile(r'\b[Dd]o\b(?!\s+(groups|equations|not)\b)', re.I)
LOG_RX = re.compile(r'(?<![Ee]rror )\b[Ll]og\b')
AA_RX = re.compile(r'\baa\b')  # case-sensitive: keep 'AA' (similarity)

def translit(s):
    if not s: return ''
    s = clean_math(str(s))
    s = AA_RX.sub('आ', s)
    s = DO_RX.sub('दो', s)
    s = LOG_RX.sub('लोग', s)
    s = TR_RX.sub(lambda m: TR[m.group(1).lower()], s)
    if re.search(r'[\u0900-\u097F]', s):
        s = re.sub(r'\. ([A-Z0-9\u0900-\u097F])', '। \\1', s)
        s = re.sub(r'\.\s*$', '।', s)
    s = re.sub(r'\s{2,}', ' ', s).strip()
    return s

TOPIC = {'number-system': 'संख्या पद्धति', 'algebra': 'बीजगणित', 'trigonometry': 'त्रिकोणमिति',
 'heights-distances': 'ऊँचाई-दूरी', 'geometry': 'ज्यामिति', 'mensuration': 'क्षेत्रमिति',
 'ratio-proportion': 'अनुपात-समानुपात', 'partnership': 'साझेदारी', 'mixture-alligation': 'मिश्रण',
 'hcf-lcm': 'HCF-LCM', 'simplification': 'सरलीकरण', 'all': 'सभी'}

TITLE = {
'Number tower + types': 'संख्या मीनार + प्रकार',
'Divisibility rules 2-11 + co-prime splitting': 'विभाज्यता नियम 2-11 + सह-अभाज्य विभाजन',
'Remainders + unit digits': 'शेषफल + इकाई अंक',
'Surds & indices': 'करणी व घातांक',
'Trailing zeros, factor counting + PYQ consolidation': 'अंतिम शून्य, गुणनखंड गिनती + PYQ समेकन',
'BODMAS drill + decimal shifts': 'BODMAS अभ्यास + दशमलव स्थानांतरण',
'Fraction ↔ % speed table': 'भिन्न ↔ % गति तालिका',
'Percentage application': 'प्रतिशत अनुप्रयोग',
'PYQ consolidation + approximation': 'PYQ समेकन + सन्निकटन',
'The big-3 identity families': '3 बड़े सर्वसमिका परिवार',
'x + 1/x chain': 'x + 1/x श्रृंखला',
'Quadratic equations': 'द्विघात समीकरण',
'Remainder + value-putting': 'शेषफल + मान-प्रतिस्थापन',
'PYQ marathon + speed lock': 'PYQ मैराथन + गति लॉक',
'Unit method + division': 'इकाई विधि + विभाजन',
'Chain ratios + averages': 'श्रृंखला अनुपात + औसत',
'Variation & proportional work': 'विचरण व समानुपाती कार्य',
'Mixed PYQ + speed': 'मिश्रित PYQ + गति',
'Core: capital × time': 'मूल: पूँजी × समय',
'A leaves / D joins mid-way': 'A निकला / D बीच में जुड़ा',
'Salary + compound twists': 'वेतन + संयुक्त घुमाव',
'PYQ consolidation': 'PYQ समेकन',
'Standard values + right triangle': 'मानक मान + समकोण त्रिभुज',
'The Big-3 identities + complementary angles': '3 बड़ी सर्वसमिकाएँ + पूरक कोण',
'Expression evaluation (a+bsin, acos+bsin type)': 'व्यंजक मूल्यांकन (a+bsin, acos+bsin प्रकार)',
'Heights & distance bridge + mixed': 'ऊँचाई-दूरी सेतु + मिश्रित',
'PYQ marathon': 'PYQ मैराथन',
'Template 1: single observer': 'टेम्पलेट 1: एकल प्रेक्षक',
'Template 2: moving observer (angle changes)': 'टेम्पलेट 2: गतिमान प्रेक्षक (कोण बदलता है)',
'Template 3: two observers (same/opposite side)': 'टेम्पलेट 3: दो प्रेक्षक (समान/विपरीत पक्ष)',
'Mixed + timed': 'मिश्रित + समयबद्ध',
'Lines, angles + triangle properties': 'रेखाएँ, कोण + त्रिभुज गुण',
'Congruence + similarity': 'सर्वांगसमता + समरूपता',
'Circles — the big one': 'वृत्त — सबसे बड़ा',
'Quadrilaterals + triangles advanced': 'चतुर्भुज + त्रिभुज उन्नत',
'Special figures + Pythagoras drills': 'विशेष आकृतियाँ + पाइथागोरस अभ्यास',
'PYQ marathon (1917 geometry Qs available)': 'PYQ मैराथन (1917 ज्यामिति प्रश्न उपलब्ध)',
'2D formulas (all figures)': '2D सूत्र (सभी आकृतियाँ)',
'3D solids': '3D ठोस',
'Change problems + conversions': 'परिवर्तन प्रश्न + रूपांतरण',
'PYQ marathon (2155 mensuration Qs available)': 'PYQ मैराथन (2155 क्षेत्रमिति प्रश्न उपलब्ध)',
'HCF/LCM computation + identity': 'HCF/LCM परिकलन + सर्वसमिका',
'Remainder patterns': 'शेषफल पैटर्न',
'Factors: count, sum, even': 'गुणनखंड: गिनती, योग, सम',
'Zeros + full consolidation': 'शून्य + पूर्ण समेकन',
'Alligation core': 'मिश्रण मूल',
'Dilution (adding water)': 'तनुकरण (पानी मिलाना)',
'Replacement (remove & refill)': 'प्रतिस्थापन (निकालना व भरना)',
'Work/rate applications + PYQ': 'कार्य/दर अनुप्रयोग + PYQ',
}
TECH = {
'Co-prime splitting': 'सह-अभाज्य विभाजन', '3-step zeros ritual': '3-चरण शून्य विधि',
'Unit digit cycle': 'इकाई अंक चक्र', 'Percent flip': 'प्रतिशत पलट',
'Successive change formula': 'क्रमागत परिवर्तन सूत्र', 'Approximation by options': 'विकल्पों से सन्निकटन',
'Value-putting (SSC killer)': 'मान-प्रतिस्थापन (SSC किलर)', 'a+b+c=0 shortcut': 'a+b+c=0 शॉर्टकट',
'Difference of squares split': 'वर्ग-अंतर विभाजन', 'Unit method': 'इकाई विधि',
'Chain equalisation': 'श्रृंखला समकरण', 'Alligation for averages': 'औसत हेतु मिश्रण',
'Effective capital table': 'प्रभावी पूँजी तालिका', 'Salary-first rule': 'वेतन-प्रथम नियम',
'Triplet triangle': 'त्रिक त्रिभुज', 'Value-putting': 'मान-प्रतिस्थापन',
'Max-min of asin+bcos': 'asin+bcos का अधिकतम-न्यूनतम', 'Conjugate product': 'संयुग्मी गुणनफल',
'4-Template classification': '4-टेम्पलेट वर्गीकरण', '45° shortcut': '45° शॉर्टकट',
'Surd matching': 'करणी मिलान', 'Radius-draw move': 'त्रिज्या-रेखा चाल',
'Theorem-numbering': 'प्रमेय-क्रमांकन', 'Similarity k/k²': 'समरूपता k/k²',
'CSA vs TSA word test': 'CSA बनाम TSA शब्द परीक्षण', 'Multiple-of-11 check': '11-गुणज जाँच',
'% change formula': '% परिवर्तन सूत्र', 'Difference shortcut': 'अंतर शॉर्टकट',
'Exponent-shift (factors)': 'घातांक-स्थानांतरण (गुणनखंड)', 'Remainder shift': 'शेषफल स्थानांतरण',
'Cross-subtract alligation': 'तिरछा-घटाव मिश्रण', 'Replacement chain': 'प्रतिस्थापन श्रृंखला',
'Rate conversion': 'दर रूपांतरण',
}
WQ = {
'How many zeros are there at the end of 100!?': '100! के अंत में कितने शून्य हैं?',
'The unit digit of 7^2024 is:': '7²⁰²⁴ का इकाई अंक क्या है?',
'If a six-digit number 11p9q4 is divisible by 24, the pair (p, q) can be:': 'यदि छह अंकों की संख्या 11p9q4, 24 से विभाज्य हो, तो युग्म (p, q) हो सकता है:',
'What is 25% of 60 + 40% of 75?': '60 का 25% + 75 का 40% कितना है?',
'A number is first increased by 20% and then decreased by 10%. Net change?': 'एक संख्या पहले 20% बढ़ाई फिर 10% घटाई गई। शुद्ध परिवर्तन?',
'If x + 1/x = 3, then x³ + 1/x³ = ?': 'यदि x + 1/x = 3 हो, तो x³ + 1/x³ = ?',
'For what value of k does 3x² + 2kx + 3 = 0 have equal roots?': 'k के किस मान हेतु 3x² + 2kx + 3 = 0 के मूल बराबर होंगे?',
'If a + b + c = 0, then a³ + b³ + c³ − 3abc = ?': 'यदि a + b + c = 0 हो, तो a³ + b³ + c³ − 3abc = ?',
'A and B are in ratio 3:4 and B and C are in ratio 5:6. What is A:C?': 'A और B 3:4 में तथा B और C 5:6 में हैं। A:C क्या है?',
"Present ages of A and B are in ratio 4:7. After 4 years the ratio becomes 5:8. B's present age?": 'A और B की वर्तमान आयु 4:7 में है। 4 साल बाद अनुपात 5:8 हो जाता है। B की वर्तमान आयु?',
"The average of 12 students is 48 kg. A new student joins and the average becomes 49 kg. New student's weight?": '12 विद्यार्थियों का औसत 48 kg है। एक नया विद्यार्थी जुड़ता है और औसत 49 kg हो जाता है। नए विद्यार्थी का वज़न?',
"A invests ₹50,000 for 12 months; B invests ₹30,000 for 8 months. Profit ratio A:B?": 'A ₹50,000, 12 महीने हेतु; B ₹30,000, 8 महीने हेतु निवेश करता है। लाभ अनुपात A:B?',
"A and B share profit in 2:3. B gets ₹200/month management fee (12 months). Total profit ₹15,000. A's net share?": 'A और B लाभ 2:3 में बाँटते हैं। B को ₹200/महीना प्रबंधन शुल्क (12 महीने)। कुल लाभ ₹15,000। A का शुद्ध हिस्सा?',
"A, B, C start with ratio 2:3:5. At month 6 (of 12), D joins investing B's capital. Final ratio A:B:C:D?": 'A, B, C 2:3:5 से शुरू करते हैं। 6वें महीने (12 में से) D, B की पूँजी लगाकर जुड़ता है। अंतिम अनुपात A:B:C:D?',
'If sinθ = 3/5, find (5sinθ − 3cosθ) / (2cosθ + 4sinθ).': 'यदि sinθ = 3/5 हो, तो (5sinθ − 3cosθ) / (2cosθ + 4sinθ) ज्ञात करें।',
'The value of sec²θ − tan²θ is:': 'sec²θ − tan²θ का मान क्या है?',
'If secθ + tanθ = 2, then secθ − tanθ = ?': 'यदि secθ + tanθ = 2 हो, तो secθ − tanθ = ?',
'The shadow of a tower is found to be 40 m longer when the altitude of the sun is 30° compared to 60°. Height of the tower?': 'मीनार की छाया सूर्य का उन्नतांश 60° की तुलना में 30° होने पर 40 m लंबी पाई गई। मीनार की ऊँचाई?',
'A car moving towards a tower observes its angle of elevation as 30°. After 5 m, it becomes 45°. Height of the tower?': 'मीनार की ओर आती कार उसका उन्नतांश कोण 30° देखती है। 5 m बाद वह 45° हो जाता है। मीनार की ऊँचाई?',
'From the top of a 60 m cliff, the angle of depression of a boat is 30°. Distance of the boat from the base of the cliff?': '60 m ऊँची चट्टान के शीर्ष से नाव का अवनमन कोण 30° है। चट्टान के आधार से नाव की दूरी?',
'In triangle ABC, ∠A = 60°. I is the incenter. ∠BIC = ?': 'त्रिभुज ABC में ∠A = 60° है। I अंतःकेंद्र है। ∠BIC = ?',
'A tangent PT is drawn from P to a circle. A secant from P cuts the circle at A and B, with PA = 3 cm and PB = 8 cm. Find PT.': 'P से वृत्त पर स्पर्शरेखा PT खींची गई। P से छेदक वृत्त को A और B पर काटती है, PA = 3 cm और PB = 8 cm है। PT ज्ञात करें।',
'The area of two similar triangles are in ratio 4:9. The ratio of their corresponding sides is:': 'दो समरूप त्रिभुजों के क्षेत्रफल 4:9 में हैं। उनकी संगत भुजाओं का अनुपात क्या है:',
'The lateral surface area of a right prism with equilateral triangle base (side 4 cm) is 120 cm². Volume of the prism?': 'समबाहु त्रिभुज आधार (भुजा 4 cm) वाले लंब प्रिज़्म का पार्श्व पृष्ठ क्षेत्रफल 120 cm² है। प्रिज़्म का आयतन?',
'The length of a rectangle is increased by 20% and breadth decreased by 10%. Change in area?': 'आयत की लंबाई 20% बढ़ाई गई और चौड़ाई 10% घटाई गई। क्षेत्रफल में परिवर्तन?',
'A metallic cube of side 7 cm is melted and recast into a sphere. Volume of sphere (π = 22/7)?': '7 cm भुजा वाला धात्विक घन पिघलाकर गोला बनाया गया। गोले का आयतन (π = 22/7)?',
'HCF of 1785, 1995 and 3381 is:': '1785, 1995 और 3381 का HCF क्या है:',
'The number of factors of 360 is:': '360 के गुणनखंडों की संख्या क्या है:',
'Smallest number which when divided by 7, 11 and 13 leaves remainder 5 in each case:': 'वह सबसे छोटी संख्या जिसे 7, 11 और 13 से भाग देने पर हर बार शेष 5 बचे:',
'How much water must be added to 1 L of 80% alcohol solution to make it 50%?': '80% अल्कोहल विलयन के 1 L में कितना पानी मिलाएँ कि 50% बने?',
'A 100 L vessel has a spirit mixture at 50%. 10 L is removed and replaced with water. New concentration?': '100 L बर्तन में 50% स्पिरिट मिश्रण है। 10 L निकाला और पानी से बदला गया। नई सांद्रता?',
'30 L of 70% juice. 10 L drawn + water replaced, twice. Final %?': '70% जूस के 30 L। 10 L निकाला + पानी भरा, दो बार। अंतिम %?',
}
WLABEL = {
'Part of 35-45% Arithmetic': '35-45% अंकगणित का भाग',
'Foundation topic — surds, indices, remainders & unit digits repeat every year.': 'नींव विषय — करणी, घातांक, शेषफल व इकाई अंक हर साल दोहराते हैं।',
'Part of Arithmetic 35-45%': 'अंकगणित 35-45% का भाग',
'20-25% (Algebra + related)': '20-25% (बीजगणित + संबंधित)',
'Occasional (part of arithmetic)': 'कभी-कभार (अंकगणित का भाग)',
'Within trig 10-12%': 'त्रिकोणमिति 10-12% के भीतर',
'1 Q (combined with trig)': '1 प्रश्न (त्रिकोणमिति सहित)',
'1 Q': '1 प्रश्न',
'Part of number system 1-2 Qs': 'संख्या पद्धति 1-2 प्रश्नों का भाग',
'Within number system 5-6 Qs': 'संख्या पद्धति 5-6 प्रश्नों के भीतर',
'Frequent (arithmetic base)': 'बारंबार (अंकगणित आधार)',
'Occasional (arithmetic)': 'कभी-कभार (अंकगणित)',
'Part of 15-20% (with geometry)': '15-20% का भाग (ज्यामिति सहित)',
'15-20% (with mensuration)': '15-20% (क्षेत्रमिति सहित)',
}
FOCUS = {
'Divisibility (8) + remainders (6) + surds (4) + factor counting (2)': 'विभाज्यता (8) + शेषफल (6) + करणी (4) + गुणनखंड गिनती (2)',
'BODMAS (8) + fraction-% (8) + % application (5) + approximation (4)': 'BODMAS (8) + भिन्न-% (8) + % अनुप्रयोग (5) + सन्निकटन (4)',
'Identity chains (10) + quadratics (8) + remainder (7)': 'सर्वसमिका श्रृंखला (10) + द्विघात (8) + शेषफल (7)',
'Unit/division (6) + ages (5) + chains (5) + averages (4)': 'इकाई/विभाजन (6) + आयु (5) + श्रृंखला (5) + औसत (4)',
'Basic (5) + mid-change (5) + salary (5)': 'बुनियादी (5) + मध्य-परिवर्तन (5) + वेतन (5)',
'Values+triplets (8) + identities (8) + evaluation (6) + H&D (3)': 'मान+त्रिक (8) + सर्वसमिकाएँ (8) + मूल्यांकन (6) + ऊँचाई-दूरी (3)',
'T1 (5) + T2 moving (4) + T3 two-obs (3) + mixed (3)': 'T1 (5) + T2 गतिमान (4) + T3 दो-प्रेक्षक (3) + मिश्रित (3)',
'Angles (6) + triangles (6) + circles (8) + quads (5)': 'कोण (6) + त्रिभुज (6) + वृत्त (8) + चतुर्भुज (5)',
'2D (7) + 3D (8) + change/convert (5)': '2D (7) + 3D (8) + परिवर्तन/रूपांतरण (5)',
'HCF/LCM (5) + remainders (4) + factors (4) + zeros (2)': 'HCF/LCM (5) + शेषफल (4) + गुणनखंड (4) + शून्य (2)',
'Alligation (4) + dilution (3) + replacement (3) + rate (2)': 'मिश्रण (4) + तनुकरण (3) + प्रतिस्थापन (3) + दर (2)',
}
DRILL = {
'5 x+1/x chains daily (a varies)': 'रोज़ 5 x+1/x श्रृंखलाएँ (a बदलता है)',
'3 chain ratios daily': 'रोज़ 3 श्रृंखला अनुपात',
'1 timed 15-Q set/week': 'सप्ताह में 1 समयबद्ध 15-प्रश्न सेट',
'10 triplet conversions daily': 'रोज़ 10 त्रिक रूपांतरण',
'6 circle theorems recall daily (2 min)': 'रोज़ 6 वृत्त प्रमेय स्मरण (2 मिनट)',
'Formula chart scan 3 min daily': 'रोज़ सूत्र चार्ट स्कैन 3 मिनट',
'10 numbers factorise daily (speed)': 'रोज़ 10 संख्याओं का गुणनखंड (गति)',
'3 alligation cross-subtract daily': 'रोज़ 3 मिश्रण तिरछा-घटाव',
}
RULE = {'2-Hour Split': '2-घंटे विभाजन', '10-Second Rule': '10-सेकंड नियम',
 '40-50 Second Cap': '40-50 सेकंड सीमा', 'Weekly Reset': 'साप्ताहिक रीसेट',
 'One Book Rule': 'एक-पुस्तक नियम', 'Error Compounding': 'त्रुटि चक्रवृद्धि'}
PHASE = {'Phase 1 — Foundation (Days 1-20)': 'चरण 1 — नींव (दिन 1-20)',
 'Phase 2 — Advanced Core (Days 21-50)': 'चरण 2 — उन्नत मूल (दिन 21-50)',
 'Phase 3 — Speed + Accuracy (Days 51-70)': 'चरण 3 — गति + सटीकता (दिन 51-70)',
 'Phase 4 — Exam Simulation (Days 71-90)': 'चरण 4 — परीक्षा अनुकरण (दिन 71-90)'}

def day_hi(s):
    s = re.sub(r'\bDay\b', 'दिन', str(s or ''))
    s = re.sub(r'\bdays\b', 'दिन', s)
    return s

def wlabel(s):
    if s in WLABEL: return WLABEL[s]
    s = re.sub(r'(\d[\d\-]*) Qs\b', r'\1 प्रश्न', str(s))
    return translit(s)

raw = subprocess.run(['node', '-e',
  "const fs=require('fs');global.window={};eval(fs.readFileSync('/tmp/old-mastery.js','utf8'));console.log(JSON.stringify({p:global.window.MASTERY_PLANS,m:global.window.MASTERY_MASTER_PLAN}));"],
  capture_output=True, text=True).stdout
data = json.loads(raw)
topics = []
miss_title, miss_tech, miss_wq = [], [], []
for key, t in data['p'].items():
    plan = []
    for p in (t.get('plan') or []):
        if p.get('title') not in TITLE: miss_title.append(p.get('title'))
        plan.append({'days': day_hi(p.get('days')), 'title': TITLE.get(p.get('title'), translit(p.get('title'))),
                     'action': translit(p.get('action')),
                     'details': [translit(d) for d in (p.get('details') or [])],
                     'target': translit(p.get('target'))})
    tech = []
    for x in (t.get('keyTechniques') or []):
        if x.get('name') not in TECH: miss_tech.append(x.get('name'))
        tech.append({'name': TECH.get(x.get('name'), translit(x.get('name'))),
                     'how': translit(x.get('how')), 'example': translit(x.get('example'))})
    worked = []
    for w in (t.get('workedExamples') or []):
        if w.get('q') not in WQ: miss_wq.append(w.get('q'))
        worked.append({'q': WQ.get(w.get('q'), clean_math(w.get('q'))),
                       'options': [clean_math(o) for o in (w.get('options') or [])],
                       'answer': w.get('answer'), 'source': w.get('source'),
                       'steps': [translit(s) for s in (w.get('steps') or [])],
                       'fast': translit(w.get('fast'))})
    dp = t.get('dailyPractice') or {}
    topics.append({
        'id': key, 'name': TOPIC.get(key, key), 'icon': t.get('icon'), 'color': t.get('color'),
        'difficulty': t.get('difficulty'), 'time': day_hi(t.get('timeToMaster')),
        'weightage': {'tier1': wlabel((t.get('weightage') or {}).get('tier1')),
                      'tier2': wlabel((t.get('weightage') or {}).get('tier2')),
                      'rrb': wlabel((t.get('weightage') or {}).get('rrb')),
                      'note': wlabel((t.get('weightage') or {}).get('note'))},
        'why': translit(t.get('whyMatters')), 'plan': plan,
        'do': [translit(d) for d in (t.get('doThis') or [])],
        'avoid': [translit(d) for d in (t.get('avoidThis') or [])],
        'tech': tech, 'worked': worked,
        'daily': {'questions': dp.get('questions'), 'minutes': dp.get('minutes'),
                  'focus': FOCUS.get(dp.get('focus'), translit(dp.get('focus'))),
                  'drill': DRILL.get(dp.get('drill'), translit(dp.get('drill')))},
        'checklist': [translit(d) for d in (t.get('masteryChecklist') or [])],
        'tips': [translit(d) for d in (t.get('examDayTips') or [])],
    })
mp = data['m']
master = {'title': 'सार्वभौमिक गणित मास्टरी रोडमैप', 'sub': translit(mp.get('sub')),
    'rules': [{'name': RULE.get(r.get('name'), translit(r.get('name'))), 'text': translit(r.get('text'))} for r in (mp.get('rules') or [])],
    'phases': [{'name': PHASE.get(p.get('name'), translit(p.get('name'))),
                'topics': [TOPIC.get(x, x) for x in (p.get('topics') or [])],
                'why': translit(p.get('why')), 'daily': translit(p.get('daily'))} for p in (mp.get('phases') or [])],
    'protocol': [translit(x) for x in (mp.get('examDayProtocol') or [])]}
js = '/* Mastery roadmaps 11 topics + master plan: Hindi (transliterated). Auto-converted. */\nconst MASTERY = ' + json.dumps({'topics': topics, 'master': master}, ensure_ascii=False, indent=1) + ';\n'
open('js/data-mastery.js', 'w', encoding='utf-8').write(js)
print(f'topics: {len(topics)}')
print('miss title:', miss_title, '| tech:', miss_tech, '| wq:', len(miss_wq), miss_wq[:2])
print('bytes:', len(js.encode('utf-8')))
# QA sample
import random
random.seed(7)
all_s = []
for t in topics:
    all_s += [(t['id'], 'why', t['why'])] + [(t['id'], 'do', d) for d in t['do'][:2]] + [(t['id'], 'step', w['steps'][0]) for w in t['worked'][:1] if w['steps']]
for s in random.sample(all_s, 8): print('SAMPLE', s[0], '|', s[2][:160])
