#!/usr/bin/env python3
"""Build a reproducible inventory/coverage report for every repository PDF.

This does not OCR image-only pages. It records that limitation explicitly instead
of pretending scanned pages were text-analyzed.
"""
from pathlib import Path
from pypdf import PdfReader
import json, re
from collections import Counter, defaultdict

ROOT = Path(__file__).resolve().parents[1]
PDF_ROOT = ROOT / 'PDFs'
OUT = ROOT / 'data' / 'pdf_deep_analysis.json'
REPORT = ROOT / 'tools' / 'pdf_report.txt'

TOPICS = {
    'ALGEBRA': 'बीजगणित', 'GEOMETRY': 'ज्यामिति', 'HCF': 'HCF-LCM',
    'HEIGHT': 'ऊँचाई-दूरी', 'MENSURATION': 'क्षेत्रमिति', 'MIXTURE': 'मिश्रण-अलिगेशन',
    'NUMBER SYSTEM': 'संख्या पद्धति', 'PARTNERSHIP': 'साझेदारी',
    'RATIO': 'अनुपात-समानुपात', 'SIMPLIFICATION': 'सरलीकरण',
    'TRIGONOMETRY': 'त्रिकोणमिति'
}
KEYWORDS = {
    'algebra': r'\balgebra|quadratic|identity|polynomial',
    'geometry': r'\bgeometry|triangle|circle|chord|tangent',
    'mensuration': r'\bmensuration|area|volume|cylinder|cone|sphere',
    'trigonometry': r'\btrigonometry|sin\b|cos\b|tan\b|height.{0,5}distance',
    'arithmetic': r'percentage|profit|loss|interest|ratio|average|mixture|partnership',
    'time_work_distance': r'time.{0,4}work|pipe|cistern|train|boat|stream|speed|distance',
    'number_system': r'number system|hcf|lcm|divisib|remainder|factor'
}

def parse_pipeline_report():
    found = {}
    rx = re.compile(r'^(.*?)\s+new=\s*(\d+)\s+dup=\s*(\d+)\s+skip=(\d+)\s+col=(\d+)\s+key=(\d+)\s+sol=(\d+)')
    for line in REPORT.read_text(encoding='utf-8').splitlines():
        m = rx.match(line)
        if m:
            name = m.group(1).strip()
            found[name] = dict(unique_imported=int(m[2]), duplicates=int(m[3]), skipped=int(m[4]),
                               column_repairs=int(m[5]), answer_keys=int(m[6]), solutions=int(m[7]))
    return found

def collection(path):
    s = str(path)
    if path.parent == PDF_ROOT: return 'Topic-wise PYQ 2023-2025'
    if 'Gagan_Sir_Advance' in s: return 'Gagan Sir Advance Maths 2026 Classnotes'
    if 'SSC_MATHS_KING' in s: return 'SSC Maths King Maker Hindi'
    if 'railway_Maths' in s: return 'Railway Maths 3rd Edition'
    return 'Other'

def topic_for(name):
    up = name.upper()
    return next((v for k,v in TOPICS.items() if k in up), 'सम्पूर्ण गणित/मिश्रित')

pipeline = parse_pipeline_report()
rows, keyword_totals = [], Counter()
for path in sorted(PDF_ROOT.rglob('*.pdf')):
    rel = path.relative_to(ROOT)
    reader = PdfReader(path)
    page_chars, all_text = [], []
    for page in reader.pages:
        try: text = page.extract_text() or ''
        except Exception: text = ''
        clean = re.sub(r'(?i)join\s*@\w+|search on TG-@\w+|@\w+|CLICK HERE', '', text)
        clean = re.sub(r'\s+', ' ', clean).strip()
        page_chars.append(len(clean)); all_text.append(clean.lower())
    corpus = ' '.join(all_text)
    kws = {k: len(re.findall(rx, corpus, re.I)) for k,rx in KEYWORDS.items()}
    keyword_totals.update(kws)
    text_pages = sum(n >= 100 for n in page_chars)
    year_m = re.search(r'20\d{2}', path.name)
    base_key = re.sub(r'\s+', ' ', path.name)[:40].strip()
    pipe = pipeline.get(base_key, {})
    row = {
        'file': str(rel), 'collection': collection(path), 'topic': topic_for(path.name),
        'year': int(year_m.group()) if year_m else None, 'pages': len(reader.pages),
        'size_mb': round(path.stat().st_size / 1048576, 2), 'text_characters': sum(page_chars),
        'text_rich_pages': text_pages, 'image_or_low_text_pages': len(page_chars)-text_pages,
        'text_coverage_percent': round(100*text_pages/max(len(page_chars),1), 1),
        'keyword_signals': kws, 'pipeline': pipe
    }
    rows.append(row)

collections = defaultdict(lambda: {'files':0,'pages':0,'size_mb':0,'text_rich_pages':0})
for r in rows:
    c=collections[r['collection']]; c['files']+=1;c['pages']+=r['pages'];c['size_mb']+=r['size_mb'];c['text_rich_pages']+=r['text_rich_pages']
for c in collections.values():
    c['size_mb']=round(c['size_mb'],2);c['text_coverage_percent']=round(100*c['text_rich_pages']/c['pages'],1)

matrix = defaultdict(lambda: defaultdict(lambda: {'source_questions':0,'unique_imported':0,'duplicates':0,'solutions':0}))
for r in rows:
    if not r['pipeline']: continue
    y=str(r['year']); m=matrix[r['topic']][y]; p=r['pipeline']
    m['source_questions']+=p['answer_keys'];m['unique_imported']+=p['unique_imported'];m['duplicates']+=p['duplicates'];m['solutions']+=p['solutions']

result = {
    'generated_on': '2026-09-14',
    'methodology': {
        'scope': 'Every PDF currently under PDFs/',
        'text_analysis': 'pypdf extraction on every page; keyword signals are descriptive, not question classification',
        'pyq_pipeline': '31 topic-year PDFs parsed into question/option/answer/solution records, normalized and deduplicated',
        'limitation': 'Image-only/scanned pages cannot be semantically analyzed without OCR; they are counted and flagged, never presented as fully text-analyzed.'
    },
    'totals': {
        'pdf_files': len(rows), 'pages': sum(r['pages'] for r in rows),
        'size_mb': round(sum(r['size_mb'] for r in rows),2),
        'text_rich_pages': sum(r['text_rich_pages'] for r in rows),
        'image_or_low_text_pages': sum(r['image_or_low_text_pages'] for r in rows),
        'pyq_source_questions_with_keys': sum(r.get('pipeline',{}).get('answer_keys',0) for r in rows),
        'pyq_unique_imported': sum(r.get('pipeline',{}).get('unique_imported',0) for r in rows),
        'pyq_duplicates_removed': sum(r.get('pipeline',{}).get('duplicates',0) for r in rows),
        'pyq_solutions_detected': sum(r.get('pipeline',{}).get('solutions',0) for r in rows)
    },
    'collections': dict(collections), 'topic_year_matrix': matrix,
    'keyword_signals_all_extractable_text': dict(keyword_totals), 'files': rows
}
OUT.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding='utf-8')
compact = {
    'totals': result['totals'], 'collections': result['collections'],
    'topicYear': result['topic_year_matrix'],
    'files': [{k: row[k] for k in ('file','collection','topic','year','pages','size_mb','text_coverage_percent','pipeline')} for row in rows]
}
js_out = ROOT / 'js' / 'data-pdf-analysis.js'
js_out.write_text(
    '/* Generated by tools/analyze_pdf_library.py — all repository PDFs. */\n' +
    'const PDF_ANALYSIS = ' + json.dumps(compact, ensure_ascii=False, separators=(',', ':')) + ';\n\n' +
    "if (typeof module !== 'undefined') module.exports = { PDF_ANALYSIS };\n",
    encoding='utf-8'
)
print(json.dumps(result['totals'], ensure_ascii=False, indent=2))
