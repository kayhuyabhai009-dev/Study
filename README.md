# गणित गुरु

SSC और Railway परीक्षाओं के लिए हिंदी-माध्यम गणित mastery website। यह एक static, offline-friendly app है; progress browser के `localStorage` में सुरक्षित रहती है।

## मुख्य सुविधाएँ

- 19 official-syllabus-aligned chapters और 188 विस्तृत formula lessons
- SSC Tier-II Statistics/Probability/DI, CGL JSO specialist statistics और RRB Technician Grade-I Sets/AP/Coordinate modules
- RRB के Ages, Calendar, Clock, Pipes/Cistern सहित विस्तृत coverage
- हर chapter में Concept → Formula Recall → Timed Practice → Test mastery tracker
- 10,124 searchable/filterable PYQ records और exam-specific quiz mode
- 13 detailed exam profiles with syllabus, pattern, strategy और bank-question analytics
- calculation techniques और 12 speed drills
- 452-question seeded daily-practice bank तथा Sunday mock
- configurable quiz, 260 flashcards और 25 detailed note collections
- 50 pattern modules, 43 exam traps, error log और revision center
- सभी 61 repository PDFs (2,567 pages, 792.53 MB) की searchable library और page-level analysis
- 10,571 keyed source questions में से 3,433 unique PDF PYQs; 7,083 duplicates removed और 10,559 solutions detected
- topic mastery roadmaps, exam information और 90/180-day plans
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

यह data integrity, merged datasets, PDF inventory, exam profiles, renderers, formula chapters और topic guides validate करता है।

> परीक्षा तिथियों और नियमों के लिए आवेदन से पहले संबंधित SSC/RRB की आधिकारिक notification अवश्य जाँचें।
