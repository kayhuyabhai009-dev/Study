# गणित गुरु

SSC और Railway परीक्षाओं के लिए हिंदी-माध्यम गणित mastery website। यह एक static, offline-friendly app है; progress browser के `localStorage` में सुरक्षित रहती है।

## मुख्य सुविधाएँ

- 14 syllabus chapters और विस्तृत formula book
- 10,124 searchable/filterable PYQ records
- calculation techniques और 12 speed drills
- seeded daily practice तथा Sunday mock
- configurable quiz, 260 flashcards और detailed notes
- pattern engine, trap book, error log और revision center
- topic mastery roadmaps, exam information और 90/180-day plans
- focus timer, achievements, streaks, XP, dark mode और responsive navigation

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
