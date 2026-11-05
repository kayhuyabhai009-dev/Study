# गणित गुरु — 60-दिन गणित चैलेंज (v4.0 — मास्टरी पाथ + 37K असली PYQ)

SSC और Railway परीक्षाओं के लिए हिंदी-माध्यम गणित mastery website। Static, offline-friendly; progress browser के `localStorage` में सुरक्षित रहती है।

## 🏆 v4.0 में सबसे बड़ा अपडेट — 60-दिन मास्टरी प्लान + 26,937 नए असली PYQ

**पूरा प्लान देखें: [`docs/PLAN-60.md`](docs/PLAN-60.md)**

- **📚 सीखें = Day 1–60 मास्टरी पाथ** — Learn में अब **Day 1 से Day 60** की ग्रिड (9 सप्ताह, सप्ताह-थीम के साथ)।
  किसी दिन पर क्लिक → उस दिन के topics → topic पेज → sub-topics → **295 concepts**। हर concept में:
  prerequisites → definition → **आसान हिंदी समझ** → formulas → exam-mapping → **⚡ शॉर्टकट पैटर्न (signal → shortcut → ⚠️ trap)** →
  **🗂️ "इस concept के PYQ"** बटन — सीधे PYQ बैंक में उसी chapter+concept के फ़िल्टर के साथ।
- **🔥 90 → 60-दिन चैलेंज** — 8 सप्ताह × (5 सीखने के दिन + 1 रिवीज़न + 1 टेस्ट) + 4 फिनाले दिन =
  **40 सीखने के दिन + 8 रिवीज़न + 8 टेस्ट + 2 ग्रैंड मॉक = 60 दिन**, 31 exam-topics कवर।
  हर सीखने के दिन में **1-3-7 स्पेस्ड रिवीज़न** tasks (कल का + 3-दिन-पुराना + 7-दिन-पुराना) लिखे होते हैं।
- **🗂️ PYQ बैंक = 37,061 प्रश्न** — वही 10,124 पुराने + **26,937 नए असली SSC/Railway प्रश्न**
  (options + answer-key के साथ, पुराने बैंक से dedupe करके)। फ़िल्टर:
  **chapter → concept → परीक्षा → वर्ष → shift** (+भाषा, स्तर, खोज)। हर प्रश्न पर छोटा meta:
  `परीक्षा • तारीख • Shift` और concept-chip (क्लिक करने पर उसी concept के सारे प्रश्न)।
- **📊 PYQ एनालिसिस** — अब 37,061 प्रश्न · 39 टॉपिक · 455 concept-पैटर्न पर weight-map
  (किस concept से कितने प्रश्न, कौन-सी परीक्षा, कौन-सा वर्ष)।
- **रिवीज़न/प्रैक्टिस ट्रैकिंग** — concept mastery (👁️→✍️→🏆), चैलेंज day-done, एरर लॉग, फ्लैशकार्ड — सब आपके नाम से।

## डेटा pipelines (क्रम में चलाएँ)

```bash
node tools/build_full_pyq.js        # data/all-full-questions-with-options.txt → js/data-pyq-full-* (tagged+deduped)
node tools/build_challenge60.js     # → js/data-challenge.js (CHALLENGE_60 + phases + milestones)
node tools/build_mastery_data.js    # → js/data-mastery-path.js (MASTERY_DATA + CHALLENGE_MASTERY 60-दिन)
node tools/build_pyq_analysis.js    # → js/data-pyq-analysis.js (37,061 प्रश्न aggregates)
```

## टेस्ट

```bash
npm i jsdom
python3 -m http.server 8000 &     # jsdom सबरिसोर्स इसी से लेता है
node tools/dom_test60.js          # 39 checks — 60-दिन, Learn grid, PYQ फिल्टर, concept deep-links
```

## v3.x (पिछला रिकॉर्ड)

- Research platform (1,687 पेपर · 42,634 टैग्ड रिकॉर्ड) iframe में मर्ज्ड (`research/`)
- मास्टरी मार्ग, 3-स्तरीय concept tracker, तथ्य-आधारित साप्ताहिक विश्लेषण — सब v4 में बरकरार।
