#!/usr/bin/env python3
"""Convert old CONCEPT_NOTES -> js/data-notes.js (Hindi topic+headings, cleaned-English bodies)."""
import json, re, sys, subprocess
sys.path.insert(0, '/tmp')
from cleanmath import clean_math

TOPIC = {'number-system': 'संख्या पद्धति', 'algebra': 'बीजगणित', 'trigonometry': 'त्रिकोणमिति',
 'heights-distances': 'ऊँचाई-दूरी', 'geometry': 'ज्यामिति', 'mensuration': 'क्षेत्रमिति',
 'ratio-proportion': 'अनुपात-समानुपात', 'partnership': 'साझेदारी', 'mixture-alligation': 'मिश्रण',
 'hcf-lcm': 'HCF-LCM', 'simplification': 'सरलीकरण'}
H = {
 'number-system': ['संख्या जगत', 'विभाज्यता — 4-सेकंड परीक्षण', 'HCF और LCM — हर साल आने वाली सर्वसमिकाएँ',
   'गुणनखंड: गिनती, योग, सम, विषम', 'शेषफल टूलकिट'],
 'simplification': ['VBODMAS — उत्तर तय करने वाला क्रम', 'वर्गमूल: 20 सेकंड बचाने वाले शॉर्टकट',
   'घातांक व करणी नियम समूह', 'मानक प्रसार शॉर्टकट'],
 'algebra': ['SSC बीजगणित पर राज करने वाली सर्वसमिका', 'x + 1/x श्रृंखला',
   'समीकरण: मूल, विविक्तकर, संगति', 'अनुपात नियम व असमिका शॉर्टकट'],
 'ratio-proportion': ['12 अनुपात परिभाषाएँ', 'मिश्रण व सम्मिश्रण — दो मास्टर सूत्र', 'आयु व औसत'],
 'partnership': ['सब कुछ हल करने वाला एक सूत्र', 'सक्रिय साझेदार व वेतन रूपांतर'],
 'trigonometry': ['अनुपात, पूरक, चिह्न', 'मानक मान — कंठस्थ करें', 'तीन मूल सर्वसमिकाएँ',
   'संयुक्त कोण व गुणन श्रृंखलाएँ', 'विशेष परिणाम समूह'],
 'heights-distances': ['स्वतः याद होनी वाली परिभाषाएँ', 'अनुपातों सहित पाँच मानक स्थितियाँ'],
 'geometry': ['रेखाएँ, कोण, तिर्यक', 'त्रिभुज — ज़रूरी 20 परिणाम', 'वृत्त — अंक दिलाने वाले गुण',
   'चतुर्भुज व बहुभुज', 'निर्देशांक त्वरित उपकरण'],
 'mensuration': ['2D आकृतियाँ — मुख्य तालिका', '3D ठोस — आयतन व पृष्ठ तालिका', 'प्रतिशत-परिवर्तन शॉर्टकट व इकाइयाँ'],
 'hcf-lcm': ['विधियाँ', 'पाँच सर्वसमिकाएँ'],
 'mixture-alligation': ['मिश्रण नियम', 'प्रतिस्थापन सूत्र'],
}
raw = subprocess.run(['node', '-e',
  "const fs=require('fs');global.window={};eval(fs.readFileSync('/tmp/old-notes.js','utf8'));console.log(JSON.stringify(global.window.CONCEPT_NOTES));"],
  capture_output=True, text=True).stdout
old = json.loads(raw)
out, nsec, carets = [], 0, 0
for key, t in old.items():
    secs = []
    for i, s in enumerate(t.get('sections', [])):
        body = [clean_math(p) for p in s.get('body', [])]
        carets += sum(1 for p in body if '^' in p)
        secs.append({'h': f"{i+1}. {H[key][i]}", 'b': body})
        nsec += 1
    out.append({'id': key, 'name': TOPIC[key], 'minutes': str(t.get('minutes', '')) + ' मिनट',
                'sections': secs, 'lang': 'en'})
js = '/* Concept notes 11 topics / 37 sections: Hindi headings, cleaned-English bodies. Auto-converted. */\nconst STUDY_NOTES = ' + json.dumps(out, ensure_ascii=False, indent=1) + ';\n'
open('js/data-notes.js', 'w', encoding='utf-8').write(js)
print(f'topics: {len(out)}, sections: {nsec}, caret-left: {carets}, bytes: {len(js.encode())}')
