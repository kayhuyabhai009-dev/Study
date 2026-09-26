# गणित गुरु — 90-दिन गणित चैलेंज (v2.0)

SSC और Railway परीक्षाओं के लिए हिंदी-माध्यम गणित mastery website। यह एक static, offline-friendly app है; progress browser के `localStorage` में सुरक्षित रहती है।

## v2 में क्या नया है

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

यह चार suites चलाता है — data integrity, merged datasets, PDF inventory, exam profiles, renderers, formula chapters और topic guides validate करने के साथ-साथ v2 checks भी: 90-दिन चैलेंज की संरचना (90 दिन, 13 सप्ताह, 6 चरण, well-planned balance), 16 drills × 3 कठिनाइयों के question generators, user-system persistence helpers, drill-history cap और `index.html` की सभी नई UI IDs की मौजूदगी।

> परीक्षा तिथियों और नियमों के लिए आवेदन से पहले संबंधित SSC/RRB की आधिकारिक notification अवश्य जाँचें।
