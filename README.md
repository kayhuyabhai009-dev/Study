# गणित गुरु — 90-दिन गणित चैलेंज (v3.1 — मास्टरी मार्ग)

SSC और Railway परीक्षाओं के लिए हिंदी-माध्यम गणित mastery website। यह एक static, offline-friendly app है; progress browser के `localStorage` में सुरक्षित रहती है।

## 🔬 v3 में सबसे बड़ा अपडेट — सरकारी एक्ज़ाम रिसर्च प्लेटफ़ॉर्म merge

उसी डेटा-विश्लेषण वाली research platform (`gov-exam-maths-website`) को अब यही website के अंदर मिला दिया गया है — **एक ही website, एक ही navigation**:

- **🔬 सरकारी एक्ज़ाम रिसर्च** (sidebar में नया group) — 1,687 पेपर · 42,634 टैग्ड रिकॉर्ड · 35,704 certain · 35 topics → 154 sub-topics → 295 concepts · 343 dependency edges। सभी 15 pages sub-tabs से: डैशबोर्ड, परीक्षाएँ, PYQ लाइब्रेरी, इंपॉर्टेंट, हायरार्की, पैटर्न, फॉर्मूला, तुलना, लर्न, कैलकुलेशन स्किल्स, मिस्टेक्स, CIS एक्सप्लोरर, मास्टरी ट्रैकर, 90-दिन कैलेंडर, मेथडोलॉजी।
- **📊 PYQ एनालिसिस** (नया सेक्शन) — इस website के 10,124 प्रश्नों का topic → concept(पैटर्न) विश्लेषण: किस concept से कितने प्रश्न, कौन-सी परीक्षा, कौन-सा वर्ष, किस कठिनाई में — precomputed aggregates से तुरंत filter/render।
- **Learn + Challenge सेक्शन** में अब research bridge — हर टॉपिक के concept-वार प्रश्न-गणना और सीधे research pages के लिंक, ताकि "किस concept से किस topic से प्रश्न आता है" सीखते-सीखते ही साफ हो जाए।
- Research platform iframe में चलती है और embedded mode में अपनी sidebar/topbar छिपा देती है — navigation मुख्य site के sub-tabs से; theme दोनों में sync रहता है। Platform standalone भी चलती है (`research/index.html`)।
- सारा research डेटा repo के `research/` फोल्डर में (45 MB): `research/data/` (papers, questions_by_topic, questions_text, topics, hierarchy formulas…), `research/js/`, `research/css/`।

## 🎓 v3.1 — मास्टरी मार्ग (Learn + Challenge पूरी तरह mastery-complete)

Research platform की hierarchy को सिखाने-योग्य मास्टरी पाथ में बदला गया:

- **📚 सीखें = मास्टरी मार्ग** — 35 topics → 154 sub-topics → **295 concepts**। हर concept में:
  पहले यह जानिए (prerequisites) → definition → **आसान हिंदी समझ** → फॉर्मूले → exam-mapping →
  इस sub-topic के concept-tags (**किस concept से कितने प्रश्न**, कठिनाई-बार के साथ) →
  प्रश्न-प्रकार, PYQ shortcut labels, परीक्षा-वितरण → अभ्यास लिंक (आपके बैंक / रिसर्च / फास्ट ट्रिक्स / पैटर्न)।
- **3-स्तरीय concept mastery tracker** — 👁️ समझा → ✍️ अभ्यास → 🏆 पक्का; progress आपके नाम से
  सेव (`state.concepts`), dashboard पर "पक्के concepts x/295", hero में **अगला कौन-सा concept** करना है।
- **⚡ शॉर्टकट** — हर topic के curated shortcut पैटर्न (signal → shortcut → ट्रैप) और हर sub-topic के
  PYQ shortcut labels, साथ में फास्ट ट्रिक्स/पैटर्न इंजन के सीधे लिंक।
- **🔥 90-दिन चैलेंज + exact data** — हर दिन के topics में अब exact concept-count और रिकॉर्ड-संख्या;
  topic chip पर टैप → मास्टरी मार्ग में उस topic के सारे concepts; हर सप्ताह का exact विश्लेषण-लाइन।
- **UI upgrade** (`css/mastery-v3.css`) — mastery ring + progress, topic cards (difficulty/exam/mastery),
  concept accordion (numbered steps, formula chips, tag chips), stage tracker, साफ़ mobile layout।

डेटा दोबारा बनाना (research data बदलने पर):

```bash
node tools/build_mastery_data.js    # → js/data-mastery-path.js
node tools/build_pyq_analysis.js    # → js/data-pyq-analysis.js
```

## PYQ एनालिसिस दोबारा बनाना

PYQ डेटा बदलने के बाद aggregates दोबारा बनाएँ:

```bash
node tools/build_pyq_analysis.js
```

यह `js/data-pyq-analysis.js` बनाता है (10,124 प्रश्न · 22 टॉपिक · 190 कॉन्सेप्ट-पैटर्न · research tagged records के साथ cross-join)।

## v2 में क्या नया था

- **🔥 90-दिन गणित चैलेंज** — पूरा SSC/Railway syllabus 13 सप्ताह / 6 चरणों में बँटा दिन-वाइज़ टाइमटेबल। हर दिन तय: *क्या पढ़ना है — कितना पढ़ना है — क्या रिवाइज़ करना है — क्या प्रैक्टिस करना है*। 90-सेकेंड वाली honeycomb progress-map, दिन-टिक, task checkboxes, milestone badges (🚀 दिन 1 → 🏆 दिन 90), अतिरिक्त XP (+30/दिन) और सप्ताह-वाइज़ detail view।
- **👤 नाम-आधारित personal login** — website खोलते ही नाम-popup; नाम लॉगआउट तक याद रहता है और हर उपयोगकर्ता की progress अलग key (`gg-state-<नाम>`) में सेव होती है। पुराना shared डेटा पहली login पर अपने-आप migrate होता है। Quick-switch chips से दूसरी प्रोफ़ाइल में एक टैप में जाएँ।
- **🌅 Personalized डैशबोर्ड** — समयानुसार हिंदी अभिवादन (🌅 सुप्रभात/🌤️ नमस्कार/🌆 शुभ संध्या/🌙 शुभ दिवस), प्रेरणादायक quote, streak, और चैलेंज-संचालित *आज का फॉकस* — सीधे चैलेंज के आज-के-दिन के tasks के साथ।
- **🧮 कैलकुलेशन बूस्टर 2.0** — 16 स्पीड ड्रिल्स (नए: घन, घनमूल, चेन-जोड़, मिश्रित स्प्रिंट), 3 कठिनाई स्तर, 30/60/सेकंड समय-चयन, हर ड्रिल का target, scorecard, इतिहास-आरेख (trend bars) और रोज़ का 15-प्रश्न *कैलकुलेशन वर्कआउट*।
- **✨ नया app-shell UI** — सुंदर sidebar (मोबाइल drawer सहित), topbar chips (streak + XP), gradient accents, glassmorphism कार्ड, dark/light theme और अलग achievement set (चैलेंज व वर्कआउट की 9 नई उपलब्धियाँ)।

## सभी मूल सुविधाएँ (सब बरकरार)

- 19 official-syllabus-aligned chapters और 188 विस्तृत formula lessons
- SSC Tier-II Statistics/Probability/DI, CGL JSO specialist statistics और RRB Technician Grade-I Sets/AP/Coordinate modules
- RRB के Ages, Calendar, Clock, Pipes/Cistern सहित विस्तृत coverage
- हर chapter में Concept → Formula Recall → Timed Practice → Test mastery tracker
- 10,124 searchable/filterable PYQ records और exam-specific quiz mode
- 13 detailed exam profiles with syllabus, pattern, strategy और bank-question analytics
- calculation techniques (3 स्तर: बेसिक/एडवांस्ड/अल्ट्रा)
- 19/19 chapters के 57 signal-based fast-making methods, examples और safety guards
- daily fast trick तथा 10-round interactive Trick Recognition Trainer with score, timer, feedback और saved best
- 452-question seeded daily-practice bank तथा Sunday mock
- configurable quiz, 260 flashcards और 25 detailed note collections
- 50 pattern modules, 43 exam traps, error log और revision center
- सभी 61 repository PDFs (2,567 pages, 792.53 MB) की searchable library और page-level analysis
- 10,571 keyed source questions में से 3,433 unique PDF PYQs; 7,083 duplicates removed और 10,559 solutions detected
- topic mastery roadmaps, exam information और 90/180-day रणनीति plans
- focus timer, achievements, streaks, XP, dark mode और responsive navigation

## Syllabus research basis

Coverage को official notifications के indicative syllabi से cross-check किया गया है:

- [SSC CGL 2025 official notice](https://ssc.gov.in/api/attachment/uploads/masterData/NoticeBoards/Notice_of_adv_cgl_2025.pdf) — Mathematical Abilities में arithmetic, algebra, geometry, mensuration, trigonometry, statistics और simple probability
- [SSC CHSL 2025 official notice](https://ssc.gov.in/api/attachment/uploads/masterData/NoticeBoards/Notice_of_adv_chsl_2025.pdf) — tables/graphs, central tendency, standard deviation और probability
- [RRB NTPC CEN 06/2024](https://www.rrbcdg.gov.in/uploads/2024/06-NTPCUG/Detailed%20CEN%2006-2024%20NTPC.pdf) — arithmetic से elementary statistics तक
- [RRB ALP CEN 01/2026](https://www.rrbcdg.gov.in/uploads/2026/01-ALP/012026ALP-CEN.pdf) — age calculations, calendar/clock और pipes/cistern सहित Railway coverage

## चलाना

किसी static server से repository root serve करें:

```bash
python3 -m http.server 8000
```

फिर `http://localhost:8000` खोलें। App में backend या build step की जरूरत नहीं है।

पहली बार खोलने पर नाम-मोडल आएगा — अपना नाम लिखें और *🚀 शुरू करें* दबाएँ। इसके बाद हर visit में वही नाम याद रहेगा (लॉगआउट तक), और डैशबोर्ड + चैलेंज आपके लिए personalize हो जाएगा। Sidebar के सबसे ऊपर **🔥 90-दिन चैलेंज** खोलकर चैलेंज शुरू करें — आज का पूरा टाइमटेबल (पढ़ाई + रिवीज़न + प्रैक्टिस + कैलकुलेशन ड्रिल) वहीं मिलेगा। प्रोफ़ाइल card पर *🚪 लॉगआउट* से नाम बदला जा सकता है।

## Fast-trick methodology

Fast methods को केवल answer hacks नहीं बनाया गया। हर method में छह चीजें हैं: पहचानने का **signal**, छोटा method, worked example, expected time saving, prerequisite और गलत प्रयोग रोकने वाला **guard**। SATHEE/IIT Kanpur की [SSC Quant strategy](https://sathee.iitk.ac.in/sathee-ssc/ssc-blogs/mastering_quantitative_aptitude_for_ssc_exams_2025/) की accuracy-first, daily calculation और easy→moderate→hard selection approach को design baseline की तरह उपयोग किया गया है।

## PDF analysis दोबारा बनाना

Repository में PDF बदलने के बाद reproducible report बनाएँ:

```bash
python3 -m venv .venv
.venv/bin/pip install -r tools/requirements.txt
.venv/bin/python tools/analyze_pdf_library.py
```

Report `data/pdf_deep_analysis.json` में बनती है। Scanned/image-only pages को text-understood बताने के बजाय साफ़ तौर पर OCR-required mark किया जाता है।

## जाँच

```bash
node tools/fulltest.js
```

यह सात suites चलाता है — data integrity, merged datasets, PDF inventory, exam profiles, renderers, formula chapters और topic guides validate करने के साथ-साथ v2 checks भी: 90-दिन चैलेंज की संरचना (90 दिन, 13 सप्ताह, 6 चरण, well-planned balance), 16 drills × 3 कठिनाइयों के question generators, user-system persistence helpers, drill-history cap और `index.html` की सभी नई UI IDs की मौजूदगी। साथ ही:

- `tools/mastery_test.js` — मास्टरी मार्ग की data-integrity: 295 concepts research hierarchy से exact मेल, हर concept में हिंदी समझ/definition/difficulty/exam-mapping, formulas, prerequisites, concept-tag counts, प्रश्न-प्रकार, shortcut labels, 90-दिन mapping, index.html/mastery.js/main.js integration (और यह कि पुराना `data-mastery.js` roadmap डेटा overwrite न हुआ हो)।
- `tools/research_test.js` — merged research platform की data-integrity (1,687 papers, 42,634 records, 32 questions_by_topic files, per-paper + questions_text files), embedded-mode patches, PYQ analysis aggregates (10,124 ids असली डेटा से मेल खाते हैं) और index.html/research-hub/main.js integration।
- `tools/dom_test.js` — jsdom में पूरा boot: नए सेक्शन (PYQ एनालिसिस, research sub-tabs, Learn/Challenge bridge) तक। (इसके लिए `npm i -D jsdom` और `http://localhost:8000` पर server चालू रखें।)

> परीक्षा तिथियों और नियमों के लिए आवेदन से पहले संबंधित SSC/RRB की आधिकारिक notification अवश्य जाँचें।

> परीक्षा तिथियों और नियमों के लिए आवेदन से पहले संबंधित SSC/RRB की आधिकारिक notification अवश्य जाँचें।
