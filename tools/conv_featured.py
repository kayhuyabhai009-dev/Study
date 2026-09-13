#!/usr/bin/env python3
"""Convert old FEATURED_PYQS (40) -> js/data-pyq-featured.js (PYQ_BANK-shaped, Hindi questions)."""
import json, re, sys
sys.path.insert(0, '/tmp')
from cleanmath import clean_math

Q = {
 'feat-01': 'छह अंकों की संख्या 11p9q4, 24 से विभाज्य है। तब (p + q) का अधिकतम संभव मान क्या है?',
 'feat-02': '36! के अंत में शून्यों की संख्या ज्ञात कीजिए।',
 'feat-03': '120 के सम गुणनखंडों का योग ज्ञात कीजिए।',
 'feat-04': 'यदि a + b + c = 0 हो, तो a³ + b³ + c³ − 3abc का मान ज्ञात कीजिए।',
 'feat-05': '(a³ + b³ + c³ − 3abc) का मान ज्ञात कीजिए, जहाँ a = 335, b = 215, c = 180 है।',
 'feat-06': 'k के किस धनात्मक मान के लिए समीकरण 3x² + 2kx + 3 = 0 के मूल वास्तविक और बराबर होंगे?',
 'feat-07': 'यदि (x² + 1) = 7 और 0 < x < 1 हो, तो x ज्ञात कीजिए।',
 'feat-08': 'यदि (x⁴ + y⁴)/(x²y²) = 6 हो, तो (x⁶ + y⁶)/(x³y³) का मान क्या है?',
 'feat-09': 'यदि 3·sinθ + 5·cosθ = 5 हो, तो 3·cosθ − 5·sinθ का मान ज्ञात कीजिए।',
 'feat-10': 'यदि 29·secθ − 21·tanθ = 20 हो, तो 29·tanθ − 21·secθ ज्ञात कीजिए।',
 'feat-11': 'यदि A + B + C = 180° हो, तो tanA + tanB + tanC का मान ज्ञात कीजिए।',
 'feat-12': '3·sinx + 4·cosx का अधिकतम मान क्या है?',
 'feat-13': 'sin²x + cos⁴x का न्यूनतम मान क्या है?',
 'feat-14': 'समतल भूमि पर खड़ी मीनार की छाया, सूर्य का उन्नतांश 45° की तुलना में 30° होने पर 40 m लंबी पाई गई। मीनार की ऊँचाई ज्ञात कीजिए।',
 'feat-15': 'ऊर्ध्वाधर मीनार के शीर्ष से एक व्यक्ति सीधे उसकी ओर आती कार देखता है; अवनमन कोण 30° से बदलकर 45° हो जाता है। मीनार 5 m ऊँची है। कार द्वारा तय कुल दूरी कितनी है?',
 'feat-16': 'एक तिर्यक रेखा दो समांतर रेखाओं को काटती है और एक ही तरफ के दो अंतःकोणों का अंतर 40° है। सबसे छोटा कोण कितना है?',
 'feat-17': 'दो वृत्तों में प्रत्येक का व्यास 50 cm है। यदि वे बाह्यतः स्पर्श करते हों, तो उनकी उभयनिष्ठ अनुस्पर्श रेखा की लंबाई कितनी है?',
 'feat-18': 'चक्रीय चतुर्भुज ABCD में ∠A = 70° है। ∠C कितना होगा?',
 'feat-19': 'PT वृत्त के बिंदु T पर स्पर्शरेखा है और PAB एक छेदक रेखा है जिसमें PA = 3 cm और AB = 5 cm है। PT ज्ञात कीजिए।',
 'feat-20': 'दो समरूप त्रिभुजों के क्षेत्रफलों का अनुपात 1:9 है, तो उनकी संगत भुजाओं का अनुपात क्या है?',
 'feat-21': 'त्रिभुज ABC में ∠A = 60° है। I अंतःकेंद्र है। ∠BIC कितना होगा?',
 'feat-22': 'समबहुभुज का प्रत्येक बाह्य कोण 36° है। भुजाओं की संख्या और विकर्णों की संख्या बताइए।',
 'feat-23': '3 cm और 4 cm भुजाओं वाले समकोण त्रिभुज की अंतःत्रिज्या r कितनी है?',
 'feat-24': 'लंब प्रिज़्म का आधार समबाहु त्रिभुज है जिसकी प्रत्येक भुजा 4 cm है। यदि पार्श्व पृष्ठ क्षेत्रफल 120 cm² हो, तो प्रिज़्म का आयतन कितना है?',
 'feat-25': 'आयत की लंबाई 20% बढ़ाई गई और चौड़ाई 10% घटाई गई। क्षेत्रफल में कितना परिवर्तन होगा?',
 'feat-26': 'r = 7, h = 24 वाले शंकु का वक्र पृष्ठ क्षेत्रफल कितना है?',
 'feat-27': '20 m × 15 m के आयताकार भूखंड के बाहर चारों ओर 2 m चौड़ा रास्ता बना है। रास्ते का क्षेत्रफल कितना है?',
 'feat-28': 'तीन शराबों A, B और C की सांद्रता क्रमशः 10%, 20% और 30% है। इन्हें 2 : 3 : x अनुपात में मिलाकर 23% मिश्रण बनाया गया। x ज्ञात कीजिए।',
 'feat-29': '20 विद्यार्थियों का औसत 65 और 15 विद्यार्थियों का औसत 70 है। संयुक्त औसत कितना है?',
 'feat-30': 'किसी कीमत में पहले 10% वृद्धि फिर 10% कमी की गई। शुद्ध परिवर्तन कितना है?',
 'feat-31': 'अमन और भानु 4:5 अनुपात में निवेश करते हैं। 8 महीने बाद चंदन, भानु के निवेश का 3 गुना लेकर जुड़ता है। वार्षिक लाभ किस अनुपात में बाँटा जाएगा?',
 'feat-32': 'राजेश ₹5000 और संजय ₹4000 निवेश करते हैं। राजेश (सक्रिय) को प्रबंधन हेतु लाभ का 10% मिलता है; शेष पूँजी अनुपात में बाँटा जाता है। कुल लाभ ₹1000 हो तो राजेश का कुल हिस्सा कितना होगा?',
 'feat-33': 'एक ड्रम में रसायन P:Q:R का अनुपात 3:5:2 है। 60 L निकालकर फिर 12 L P और 8 L Q वापस डाला गया। यदि नया P:Q अनुपात 2:3 हो, तो मूल मात्रा लगभग कितनी थी?',
 'feat-34': 'x² − 8x + 15 और x² − 5x + 6 का LCM क्या है?',
 'feat-35': '1785, 1995 और 3381 का HCF क्या है?',
 'feat-36': '5³²⁷ को 8 से भाग देने पर शेषफल ज्ञात कीजिए।',
 'feat-37': '7²⁰²⁴ का इकाई अंक क्या है?',
 'feat-38': 'व्यंजक (x²−9)(9x²−1) ÷ [(x−1)³(1−x³)] × (9x+1)/(1+x³) को गुणनखंड विधि से सरल करके x के दिए गए मान पर आधिकारिक उत्तर (10/01/2024 कुंजी) क्या प्राप्त होता है?',
 'feat-39': 'यदि x² − 11x + 1 = 0 हो, तो x⁸ − 14159x⁴ + 11 का मान ज्ञात कीजिए।',
 'feat-40': 'यदि ax + by = 1 और bx + ay = 2ab (a² ≠ b²) हो, तो a और b के पदों में x ज्ञात कीजिए।',
}
TOPIC = {'number-system': 'संख्या पद्धति', 'algebra': 'बीजगणित', 'trigonometry': 'त्रिकोणमिति',
 'heights-distances': 'ऊँचाई-दूरी', 'geometry': 'ज्यामिति', 'mensuration': 'क्षेत्रमिति',
 'ratio-proportion': 'अनुपात', 'partnership': 'साझेदारी', 'mixture-alligation': 'मिश्रण',
 'hcf-lcm': 'HCF-LCM', 'simplification': 'सरलीकरण'}
DF = {'easy': 'आसान', 'medium': 'मध्यम', 'hard': 'कठिन'}
PAT = {'trailing-zeros': 'ट्रेलिंग जीरो पैटर्न', 'divisibility-composite': 'मिश्रित विभाज्यता पैटर्न',
 'cubic-identity': 'घन सर्वसमिका (a+b+c=0)', 'x-plus-1-x-chain': 'x + 1/x श्रृंखला',
 'factor-sum': 'गुणनखंड योग (सम/विषम/कुल)', 'remainder-cycles': 'शेषफल चक्र (बड़ी घातें)',
 'lcm-hcf-identity': 'LCM × HCF = गुणनफल', 'alligation': 'मिश्रण नियम (Alligation)',
 'replacement-dilution': 'निकालना-भरना (तनुकरण)', 'partner-equivalent': 'तुल्य निवेश (साखेदारी)'.replace('साखेदारी', 'साझेदारी'),
 'trig-a-b-sin-cos': 'a·sinX + b·cosX = m तंत्र', 'trig-special-sums': 'विशेष कोण-समूह परिणाम',
 'trig-max-min': 'त्रिकोणमितीय अधिकतम/न्यूनतम', 'height-shadow': 'छाया / गतिमान वस्तु ऊँचाई-दूरी',
 'two-circles': 'दो वृत्त और उभयनिष्ठ स्पर्शरेखाएँ', 'triangle-centres': 'त्रिभुज केंद्र और त्रिज्याएँ',
 'cyclic-quadrilateral': 'चक्रीय चतुर्भुज और जीवा गुण', 'polygon-angles': 'बहुभुज कोण/विकर्ण गिनती',
 'mens-area-change': 'क्षेत्रफल में प्रतिशत परिवर्तन', 'mens-solid-volumes': 'ठोस आयतन और पृष्ठ क्षेत्रफल',
 'pathway-area': 'रास्ता / क्रॉस-पथ क्षेत्रफल', 'quadratic-roots': 'द्विघात मूल और k-मान',
 'linear-system-consistency': 'रैखिक तंत्र संगति', 'surd-rationalise': 'करणी परिमेयकरण',
 'nested-radical': 'अनंत नेस्टेड मूल', 'age-ratio': 'आयु अनुपात प्रश्न',
 'average-weighted': 'भारित औसत / माध्य', 'congruent-similar': 'सर्वांगसमता और समरूपता',
 'secant-tangent-power': 'बिंदु की घात', 'trains-speed': 'रेलगाड़ी और सापेक्ष चाल',
 'percentage-chain': 'प्रतिशत परिवर्तन श्रृंखला', 'divisibility-11': '11 से विभाज्यता और बड़ी संख्याएँ',
 'base-conversion': 'संख्या आधार रूपांतरण', 'unit-digit': 'बड़ी घातों का इकाई अंक'}
OPT_WORDS = [(r'\bNo solution\b', 'कोई हल नहीं'), (r'\band\b', 'और')]

def cl(s):
    s = clean_math(str(s or ''))
    for pat, rep in OPT_WORDS:
        s = re.sub(pat, rep, s)
    return s

import subprocess
raw = subprocess.run(['node', '-e',
  "const fs=require('fs');global.window={};eval(fs.readFileSync('/tmp/old-featured.js','utf8'));console.log(JSON.stringify(global.window.FEATURED_PYQS));"],
  capture_output=True, text=True).stdout
old = json.loads(raw)
out = []
for q in old:
    opts = [clean_math(o) for o in q['options']]
    # translate option words
    opts = [re.sub(r'\bNo solution\b', 'कोई हल नहीं', o) for o in opts]
    opts = [re.sub(r'\band\b', 'और', o) for o in opts]
    m = re.match(r'(SSC\s+[A-Z]+)', q.get('exam', ''))
    exam = m.group(1) if m else 'SSC'
    ym = re.search(r'(20\d{2})', q.get('exam', ''))
    year = ym.group(1) if ym else ''
    n = int(q['id'].split('-')[1])
    out.append({
        'id': f'F{n:02d}', 'question': Q[q['id']], 'options': opts,
        'answer': opts[q['answer']],
        'solution': [clean_math(s) for s in (q.get('solution') or [])],
        'shortcut': clean_math(q.get('fastMethod') or ''), 'trap': clean_math(q.get('trap') or ''),
        'exam': exam, 'year': year, 'topic': TOPIC[q['topic']],
        'difficulty': DF[q['difficulty']], 'pattern': PAT.get(q.get('pattern', ''), q.get('pattern', '')),
        'time': clean_math(q.get('idealTime', '')).replace('s', ' सेकंड'),
        'lang': 'hi', 'solLang': 'en',
    })
js = '/* Featured 40 PYQs: Hindi questions, cleaned-English solutions. Auto-converted. */\nconst PYQ_FEATURED = ' + json.dumps(out, ensure_ascii=False, indent=1) + ';\n'
open('js/data-pyq-featured.js', 'w', encoding='utf-8').write(js)
print('featured:', len(out))
left = [o['id'] for o in out if '^' in o['question'] or any('^' in x for x in o['options'])]
print('caret in Q/opts:', left)
print('bytes:', len(js.encode('utf-8')))
