"""Extract PYQ questions+answers+solutions from PDFs/*.pdf into js/data-pyq-pdf.js"""
import re, glob, os, json
from pypdf import PdfReader

TOPIC_MAP = [
    ('ALGEBRA', 'बीजगणित'), ('GEOMETRY', 'ज्यामिति'), ('HCF', 'HCF-LCM'),
    ('HEIGHT', 'ऊँचाई-दूरी'), ('MENSURATION', 'क्षेत्रमिति'), ('MIXTURE', 'मिश्रण'),
    ('NUMBER SYSTEM', 'संख्या पद्धति'), ('PARTNERSHIP', 'साझेदारी'),
    ('RATIO', 'अनुपात'), ('SIMPLIFICATION', 'सरलीकरण'), ('TRIGONOMETRY', 'त्रिकोणमिति'),
]
D3 = re.compile(r'\b(cube|cuboid|cylinder|cone|sphere|hemisphere|frustum|prism|volume)\b', re.I)
REM = re.compile(r'\b(remainder|divisor|quotient)\b', re.I)

def exam_name(tag):
    t = tag.upper()
    if 'CGL' in t: return 'SSC CGL'
    if 'CHSL' in t: return 'SSC CHSL'
    if 'MTS' in t: return 'SSC MTS'
    if 'CPO' in t: return 'SSC CPO'
    if 'STENO' in t: return 'SSC Steno'
    if 'GD' in t or 'CONSTABLE' in t: return 'SSC GD'
    if 'NTPC' in t: return 'RRB NTPC'
    if 'GROUP D' in t: return 'RRB Group D'
    if 'ALP' in t: return 'RRB ALP'
    if 'JE' in t: return 'RRB JE'
    return 'SSC'

def difficulty(tag):
    t = tag.upper()
    if 'TIER II' in t or 'TIER 2' in t or 'MAINS' in t: return 'कठिन'
    if 'GD' in t or 'MTS' in t or 'GROUP D' in t: return 'आसान'
    return 'मध्यम'

def clean(s):
    s = re.sub(r'\s+', ' ', s or '').strip()
    s = s.replace('\x00', '')
    return s

def norm(s):
    return re.sub(r'[^a-z0-9]', '', (s or '').lower())

# existing bank normalized set
exist = set()
for f in ['js/data-pyq.js', 'js/data-pyq-featured.js', 'js/data-pyq-legacy.js']:
    src = open(f, encoding='utf-8').read()
    for m in re.finditer(r'"(?:question|q)"\s*:\s*"((?:[^"\\]|\\.)*)"', src):
        exist.add(norm(m.group(1)))
print('existing bank size:', len(exist))

TAG_RE = re.compile(r'((?:SSC|RRB)[^(]*\([^)]*20\d{2}[^)]*\))')
TAG_RE2 = re.compile(r'((?:SSC|RRB)[^\(]*?\([^\)]*\))')
OPT_RE = re.compile(r'\(([a-d])\)')

all_q, seen_new, report = [], set(), []
for f in sorted(glob.glob('PDFs/*.pdf')):
    base = os.path.basename(f)
    year = re.search(r'20\d{2}', base).group(0)
    topic = next((t for k, t in TOPIC_MAP if k in base.upper()), 'विविध')
    r = PdfReader(f)
    t = ' '.join([(p.extract_text() or '') for p in r.pages])
    t = re.sub(r'\s+', ' ', t)
    # split regions
    m1 = t.find('Q.1.')
    mkey = t.find('Answer Key')
    msol = t.find('Solutions')
    if m1 < 0 or mkey < 0:
        report.append((base, 0, 0, 'NO-REGIONS')); continue
    qreg, keyreg, solreg = t[m1:mkey], t[mkey:(msol if msol > 0 else mkey + 20000)], t[msol:] if msol > 0 else ''
    # answer key
    key = {}
    for m in re.finditer(r'(\d+)\.\s*\(([a-d])\)', keyreg):
        key[int(m.group(1))] = m.group(2)
    # solutions
    sols = {}
    parts = re.split(r'Sol\.(\d+)\.\s*\(([a-d])\)', solreg)
    for i in range(1, len(parts) - 1, 3):
        try: n = int(parts[i])
        except ValueError: continue
        s = clean(parts[i + 2][:2000])
        # cut at next Sol marker remnant & truncate to ~350 chars at sentence end
        s = s[:380]
        cut = max(s.rfind('. '), s.rfind('? '), s.rfind('! '))
        sols[n] = s[:cut + 1] if cut > 120 else s
    # questions
    segs = re.split(r'Q\.(\d+)\.', qreg)
    n_new, n_dup, n_skip, base_off, prev = 0, 0, 0, 0, 0
    for i in range(1, len(segs) - 1, 2):
        try: num = int(segs[i])
        except ValueError: continue
        if num <= prev: base_off += prev  # numbering restarted (Day-wise) -> offset
        prev = num
        num += base_off
        seg = segs[i + 1]
        # exam tag
        tm = TAG_RE.search(seg) or TAG_RE2.search(seg)
        if tm:
            stem, rest = clean(seg[:tm.start()]), seg[tm.end():]
            tag = clean(tm.group(1))
        else:
            # fallback: cut at first option marker
            om = OPT_RE.search(seg)
            if not om:
                n_skip += 1; continue
            stem, rest, tag = clean(seg[:om.start()]), seg[om.start():], ''
        if len(stem) < 15:
            n_skip += 1; continue
        # options
        marks = [(m.group(1), m.start(), m.end()) for m in OPT_RE.finditer(rest)]
        # keep only a,b,c,d in order runs
        opts, ol = [], []
        for j, (L, s0, e0) in enumerate(marks):
            e1 = marks[j + 1][1] if j + 1 < len(marks) else len(rest)
            if j + 1 >= len(marks):
                e1 = min(e1, e0 + 400)
            txt = clean(rest[e0:e1])
            if len(txt) > 0:
                opts.append(txt[:300]); ol.append(L)
        # require at least a-d present (allow 2-4)
        if len(opts) < 2:
            n_skip += 1; continue
        a = key.get(num, '')
        if a and a not in ol:
            # answer letter not among parsed options -> still keep, mark
            pass
        nk = norm(stem)
        if nk in exist or nk in seen_new:
            n_dup += 1; continue
        seen_new.add(nk)
        y = (re.search(r'20\d{2}', tag).group(0)) if re.search(r'20\d{2}', tag) else year
        tt = topic
        if topic == 'क्षेत्रमिति' and D3.search(stem): tt = 'क्षेत्रमिति 3D'
        if topic == 'संख्या पद्धति' and REM.search(stem): tt = 'शेषफल'
        all_q.append({
            'id': 'P%04d' % (len(all_q) + 1), 'q': stem, 'o': opts, 'ol': ol,
            'a': a, 'e': exam_name(tag), 'y': y, 't': tt,
            'd': difficulty(tag), 'p': 'general', 'lang': 'en',
            'sol': sols.get(num, ''),
        })
        n_new += 1
    report.append((base, n_new, n_dup, 'skip=%d keyN=%d solN=%d' % (n_skip, len(key), len(sols))))

with open('/tmp/pdf_report.txt', 'w', encoding='utf-8') as fh:
    tot = 0
    for base, n, d, x in report:
        fh.write(f'{base[:40]:40s} new={n:4d} dup={d:4d} {x}\n'); tot += n
    fh.write(f'TOTAL NEW: {tot}\n')
print('TOTAL NEW:', len(all_q))

with open('js/data-pyq-pdf.js', 'w', encoding='utf-8') as fh:
    fh.write('/* ============================================================\n')
    fh.write('   गणित गुरु — PYQ बैंक (PDF निष्कर्षण: 31 PDFs, 2023-2025)\n')
    fh.write('   Pinnacle PYQ PDFs से निकाले गए अद्वितीय प्रश्न (उत्तर-कुंजी सहित)।\n')
    fh.write('   प्रश्न व हल मूल English में हैं; lang/en बैज से फ़िल्टर करें।\n')
    fh.write('   ============================================================ */\n\n')
    fh.write('const PYQ_BANK_PDF = [\n')
    for q in all_q:
        fh.write(json.dumps(q, ensure_ascii=False) + ',\n')
    fh.write('];\n\n')
    fh.write("if (typeof module !== 'undefined') module.exports = { PYQ_BANK_PDF };\n")
print('written js/data-pyq-pdf.js')
