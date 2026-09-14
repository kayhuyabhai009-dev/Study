#!/usr/bin/env python3
"""Convert old PATTERN_DATABASE (34) -> js/data-patterns-legacy.js (32, minus 2 exact dupes).
Hindi name+signal (hand-translated); bodies math-cleaned English reference."""
import json, re, sys
sys.path.insert(0, '/tmp')
from cleanmath import clean_math

HI = {
 'cubic-identity': ('घन सर्वसमिका (a+b+c=0) — विस्तृत', 'a³+b³+c³−3abc वाला व्यंजक + a, b, c पर कोई शर्त दिखे'),
 'x-plus-1-x-chain': ('x + 1/x श्रृंखला — विस्तृत', 'x+1/x या x−1/x (या व्युत्क्रम) दिया हो, xⁿ + 1/xⁿ माँगा हो'),
 'factor-sum': ('गुणनखंड योग (सम/विषम/कुल)', '"N के (सभी/सम/विषम) गुणनखंडों का योग" या "गुणनखंडों की संख्या"'),
 'remainder-cycles': ('शेषफल चक्र (बड़ी घातें)', 'बहुत बड़ी N के साथ "aᴺ को m से भाग पर शेषफल"'),
 'lcm-hcf-identity': ('LCM × HCF = गुणनफल', 'दो संख्याएँ; LCM/HCF/संख्या में से कोई दिया हो, दूसरी निकालनी हो'),
 'alligation': ('मिश्रण नियम (Alligation)', 'C और D कीमत की दो चीज़ें मिलाकर माध्य कीमत M; अनुपात निकालना'),
 'replacement-dilution': ('निकालना-भरना (तनुकरण)', '"x लीटर निकालकर पानी भरा, n बार; शुद्ध कितना बचा"'),
 'partner-equivalent': ('तुल्य निवेश (साझेदारी)', 'साझेदारों की अलग-अलग राशि/अवधि; लाभ हिस्सा निकालना'),
 'trig-a-b-sin-cos': ('a·sinX + b·cosX = m तंत्र', 'a·sinθ + b·cosθ = m दिया हो, a·cosθ − b·sinθ निकालना'),
 'trig-special-sums': ('विशेष कोण-समूह परिणाम', 'A+B+C = 180° (या 90°, या A+B=45°) के साथ tan/cot व्यंजक'),
 'trig-max-min': ('त्रिकोणमितीय अधिकतम/न्यूनतम', 'त्रिकोणमितीय व्यंजक का अधिकतम/न्यूनतम मान'),
 'height-shadow': ('छाया / गतिमान वस्तु ऊँचाई-दूरी', 'दो सूर्य-उन्नतांश पर छाया लंबाई, या बदलते अवनमन कोण से मीनार की ओर आती कार'),
 'two-circles': ('दो वृत्त और उभयनिष्ठ स्पर्शरेखाएँ', 'दो वृत्तों की त्रिज्या/दूरी; स्पर्शरेखा, स्पर्श, प्रतिच्छेदन'),
 'triangle-centres': ('त्रिभुज केंद्र और त्रिज्याएँ', 'अंतःकेंद्र/परिकेंद्र/केंद्रक वाले प्रश्न; r, R, OI, माध्यिकाएँ'),
 'cyclic-quadrilateral': ('चक्रीय चतुर्भुज और जीवा गुण', 'वृत्त में चतुर्भुज; सम्मुख कोण; जीवा गुणनफल; स्पर्शरेखा-जीवा कोण'),
 'polygon-angles': ('बहुभुज कोण/विकर्ण गिनती', 'समबहुभुज: कोण से भुजा निकालना, या विकर्ण गिनना'),
 'mens-area-change': ('क्षेत्रफल में प्रतिशत परिवर्तन', '"लंबाई/चौड़ाई/भुजा a% बढ़ी-घटी — क्षेत्रफल में % परिवर्तन"'),
 'mens-solid-volumes': ('ठोस आयतन और पृष्ठ क्षेत्रफल', 'शंकु/बेलन/गोला/अर्धगोला/छिन्नक के आयतन या पृष्ठ प्रश्न'),
 'pathway-area': ('रास्ता / क्रॉस-पथ क्षेत्रफल', 'आयताकार भूखंड के चारों/अंदर x चौड़ा रास्ता, या दो कटते रास्ते'),
 'quadratic-roots': ('द्विघात मूल और k-मान', 'ax²+bx+c=0: मूलों का योग/गुणनफल, या "वास्तविक-समान मूलों हेतु k का मान"'),
 'linear-system-consistency': ('रैखिक तंत्र संगति', 'दो रैखिक समीकरण: अद्वितीय / कोई नहीं / अनंत हल'),
 'surd-rationalise': ('करणी परिमेयकरण', 'हर में करणी वाला व्यंजक; सरल करना'),
 'nested-radical': ('अनंत नेस्टेड मूल', 'अनंत तक √(x+√(x+...)) या √(x−√(x−...))'),
 'age-ratio': ('आयु अनुपात प्रश्न', 'अब/t वर्ष पहले/t वर्ष बाद आयु का अनुपात'),
 'average-weighted': ('भारित औसत / माध्य', 'संयुक्त समूहों का औसत, या अनुपात से माध्य'),
 'congruent-similar': ('सर्वांगसमता और समरूपता', 'समरूप या सर्वांगसम त्रिभुजों से सिद्ध करना/निकालना'),
 'secant-tangent-power': ('बिंदु की घात', 'बाहरी बिंदु से स्पर्शरेखा + छेदक; जीवाओं के प्रतिच्छेदन'),
 'trains-speed': ('रेलगाड़ी और सापेक्ष चाल — विस्तृत', 'खंभे/प्लेटफॉर्म/दूसरी रेलगाड़ी को पार करती रेलगाड़ी'),
 'percentage-chain': ('प्रतिशत परिवर्तन श्रृंखला', 'क्रमागत वृद्धि/कमी, लाभ% + छूट% + MP/CP'),
 'divisibility-11': ('11 से विभाज्यता और बड़ी संख्याएँ', 'एकांतर-अंक योग परीक्षण, या बड़ी संख्या की विभाज्यता'),
 'base-conversion': ('संख्या आधार रूपांतरण', 'बाइनरी/ऑक्टल/हेक्स या "आधार n" रूपांतरण'),
 'unit-digit': ('बड़ी घातों का इकाई अंक — विस्तृत', 'aᵇ या a^(b^c) का अंतिम अंक'),
}
SKIP = {'trailing-zeros', 'divisibility-composite'}
FREQ = {'High': 'उच्च', 'Medium': 'मध्यम', 'Low': 'कम'}

def cl(s):
    if s is None: return ''
    return clean_math(str(s))

def cl_list(v):
    return [cl(x) for x in (v or [])]

def cl_time(s):
    s = cl(s or '')
    s = s.replace('sec', 'सेकंड').replace('min', 'मिनट')
    return s

old = json.load(open('/tmp/old-patterns.json', encoding='utf-8'))
out = []
for p in old:
    if p['id'] in SKIP: continue
    name, sig = HI[p['id']]
    test = [{'q': cl(t.get('question', '')), 'a': cl(t.get('answer', ''))} for t in (p.get('masteryTest') or [])]
    out.append({
        'id': p['id'], 'name': name, 'signal': sig,
        'concept': cl(p.get('concept')), 'method': cl(p.get('standardMethod')),
        'shortcut': cl(p.get('fastMethod')), 'wording': cl(p.get('typicalWording')),
        'variants': cl_list(p.get('commonVariants')), 'traps': cl_list(p.get('commonTraps')),
        'examples': cl_list(p.get('pyqExamples')), 'test': test,
        'time': cl_time(p.get('idealTime')), 'topic': p.get('topic', ''),
        'freq': FREQ.get(p.get('frequency', ''), p.get('frequency', '')),
        'lang': 'en',
    })
js = '/* Legacy pattern library (32): Hindi name+signal, cleaned-English detail. Auto-converted. */\nconst PATTERNS_LEGACY = ' + json.dumps(out, ensure_ascii=False, indent=1) + ';\n'
open('js/data-patterns-legacy.js', 'w', encoding='utf-8').write(js)
print('patterns:', len(out))
# leftover caret check
left = [(p['id'], f) for p in out for f in ['concept','method','shortcut','wording'] if '^' in p[f]]
print('caret leftovers:', left[:10], '...total', len(left))
for p in out:
    for k in ('variants','traps','examples'):
        for v in p[k]:
            if '^' in v: print('CARET:', p['id'], k, v[:80])
print('bytes:', len(js.encode('utf-8')))
