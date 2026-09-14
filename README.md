# गणित गुरु

SSC और Railway परीक्षाओं के लिए हिंदी-माध्यम गणित mastery website। यह एक static, offline-friendly app है; progress browser के `localStorage` में सुरक्षित रहती है।

## मुख्य सुविधाएँ

- 17 official-syllabus-aligned chapters और 160 विस्तृत formula lessons
- SSC Tier-II के Statistics, Probability, DI तथा RRB के Ages/Calendar/Clock modules
- हर chapter में Concept → Formula Recall → Timed Practice → Test mastery tracker
- 10,124 searchable/filterable PYQ records
- calculation techniques और 12 speed drills
- 437-question seeded daily-practice bank तथा Sunday mock
- configurable quiz, 260 flashcards और 23 detailed note collections
- 50 pattern modules, 43 exam traps, error log और revision center
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

## जाँच

```bash
node tools/fulltest.js
```

यह data integrity, merged datasets, renderers, formula chapters और topic guides validate करता है।

> परीक्षा तिथियों और नियमों के लिए आवेदन से पहले संबंधित SSC/RRB की आधिकारिक notification अवश्य जाँचें।
