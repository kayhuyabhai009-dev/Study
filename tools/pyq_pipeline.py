#!/usr/bin/env python3
"""Restore legacy PYQ bank: dedupe + math cleanup + safe Hindi templates + convert format."""
import json, re, sys

SUP = str.maketrans('0123456789-+', '⁰¹²³⁴⁵⁶⁷⁸⁹⁻⁺')
SUP_CHARS = '⁰¹²³⁴⁵⁶⁷⁸⁹⁻⁺ⁿᵐ'

def sup(s):
    return str(s).translate(SUP)

def clean_math(s):
    if not s:
        return s
    # 1. watermarks
    s = re.sub(r'www\.\S+', ' ', s)
    s = re.sub(r'Download\s+\w+(\s+\w+)?(\s+Exam)?(\s+Preparation)?(\s+App)?', ' ', s)
    s = re.sub(r'Pinnacle\s+Exam\s+Preparation\s+App', ' ', s)
    s = re.sub(r'(Search\s+on\s+)?TG:\s*@\S+', ' ', s)
    s = re.sub(r'Pinnacle\s+Day:?\s*\S*(?:\s*-\s*\S*\s*[A-Za-z]*)?', ' ', s)
    s = re.sub(r'-\s*\d{1,3}(st|nd|rd|th)\s+[A-Z][a-z]+', ' ', s)
    s = re.sub(r'\bPinnacle\b', ' ', s)
    # 2. fullwidth parens
    s = s.replace('（', '(').replace('）', ')')
    s = s.replace('⍺', 'α').replace('⍵', 'ω')
    # 3. split function names
    s = re.sub(r'\bt\s+an\b', 'tan', s)
    s = re.sub(r'\bc\s+os\b', 'cos', s)
    s = re.sub(r'\bs\s+in\b', 'sin', s)
    # 4. carets -> superscript (letter^d, (N)^d, digit^digit)
    s = re.sub(r'\^(\d+)', lambda m: sup(m.group(1)), s)
    # 5. letter + space + digits -> superscript (guarded: not before 2+ letter word)
    s = re.sub(r'(?<![A-Za-z])([A-Za-z]) (\d+)(?![\d])(?![ \t]+[A-Za-z]{2})',
               lambda m: m.group(1) + sup(m.group(2)), s)
    # 5b. letter/digit + space + superscript char -> join
    s = re.sub(r'([A-Za-z0-9)\]})]) ([²³⁴⁵⁶⁷⁸⁹⁰¹ⁿᵐ])', r'\1\2', s)
    # 6. () 2 group wrap: ((...vars...)²) when letters present nearby, else bare ²
    def wrap_grp(m):
        start = m.start()
        # scan backwards up to 60 chars for group start
        j = start - 1
        while j >= 0 and s[j] in ' \t':
            j -= 1
        depth = 0
        k = j
        toks = 0
        has_letter = False
        while k >= 0 and toks < 12:
            c = s[k]
            if c in ')]}':
                depth += 1
            elif c in '([{':
                if depth == 0:
                    break
                depth -= 1
            if depth == 0 and c in '=,?:;':
                break
            if c.isalpha():
                # english word (2+ letters) stops the group
                if k - 1 >= 0 and s[k-1].isalpha():
                    break
                has_letter = True
            if c in ' \t':
                toks += 1
            k -= 1
        grp = s[k+1:start].strip()
        if has_letter and grp and len(grp) <= 40 and not re.search(r'[A-Za-z]{2}', grp):
            return '(' + grp + ')²' + s[m.start():m.start()]  # placeholder fixed below
        return '²'
    # implement wrap carefully with manual scan (avoid nested mess)
    out = []
    i = 0
    while i < len(s):
        m = re.match(r'\(\s*\)\s*2(?![\d])', s[i:])
        if m:
            # backwards scan on original s
            j = i - 1
            while j >= 0 and s[j] in ' \t':
                j -= 1
            k = j
            toks = 0
            has_letter = False
            ok = True
            while k >= 0 and toks < 14:
                c = s[k]
                if c in '([{=,?:;.':
                    break
                if c in ')]}!':
                    ok = False
                    break
                if c.isalpha():
                    if k - 1 >= 0 and s[k-1].isalpha():
                        break
                    has_letter = True
                if c in ' \t':
                    toks += 1
                k -= 1
            grp = s[k+1:i].strip()
            if ok and has_letter and grp and len(grp) <= 42 and not re.search(r'[A-Za-z]{2}', grp):
                # remove grp from out tail and re-add wrapped
                tail = ''.join(out)
                assert tail.endswith(grp), (tail[-50:], grp)
                out = [tail[:len(tail)-len(grp)] + '(' + grp + ')²']
            else:
                out.append('²')
            i += m.end()
        else:
            out.append(s[i])
            i += 1
    s = ''.join(out)
    # collapse duplicated square X²² -> X²  (from X²() 2 cases)
    s = re.sub(r'([²³])²', r'\1', s)
    # 6b. footnote junk: sup digits stuck to English words (of³, If²) -> strip
    s = re.sub(r'(?<![A-Za-z])(if|of|and|the|to|in|is|on|for|are|was|be|by|or|an|as|at|it|from|that|this|with)([⁰¹²³⁴⁵⁶⁷⁸⁹]+)',
               lambda m: m.group(1), s, flags=re.IGNORECASE)
    # 7. lone empty parens -> remove
    s = re.sub(r'\(\s*\)', '', s)
    # 6c. decimals missing leading zero: '(. 91)' -> '(0.91)'
    s = re.sub(r'\(\.\s+(\d)', r'(0.\1', s)
    s = re.sub(r'([+\-−×÷=])\s*\.\s+(\d)', r'\1 0.\2', s)
    s = re.sub(r'\[\s*\]', '', s)
    # 7b. stray '-,' artifacts
    s = re.sub(r'=\s*-\s*,', '=', s)
    s = re.sub(r'\(\s*-\s*,', '(', s)
    # 8. 1 x -> 1/x (guarded math context)
    s = re.sub(r'\b1 ([a-zA-Z](?:[²³]|[⁰¹²³⁴⁵⁶⁷⁸⁹]+)?)(?=\s*(?:[+\-−×÷*=),;?.!]|$))', r'1/\1', s)
    # 9. digit before power -> join (16 a² -> 16a²)
    s = re.sub(r'(\d) ([a-zA-Z](?=[²³]))', r'\1\2', s)
    # 10. hyphen -> minus (guarded, keep digit-digit ranges)
    s = re.sub(r'(?<=[A-Za-z²³)\]})])-(?=[A-Za-z0-9(√\[{])', '−', s)
    s = re.sub(r'(?<=[0-9])-(?=[A-Za-z(√\[{])', '−', s)
    # 10b. spaced hyphen -> minus, except digit-digit ranges
    s = re.sub(r'(?<!\d) - (?!\d)', ' − ', s)
    s = re.sub(r'(?<=[²³]) - (?=\d)', ' − ', s)
    # 11. operator spacing
    s = re.sub(r'(\S)([=])(?=\S)', r'\1 \2 ', s)
    s = re.sub(r'\s*=\s*=\s*', ' = ', s)
    s = re.sub(r'\s*=\s*', ' = ', s)
    # 12. punctuation spacing
    s = re.sub(r'\s+([,.?;:!%])', r'\1', s)
    s = re.sub(r',(\S)', r', \1', s)
    s = re.sub(r'([(])( +)', r'\1', s)
    s = re.sub(r'( +)([)\]}])', r'\2', s)
    m2 = re.match(r'^²\s+(.+)$', s)
    if m2 and re.search(r'[A-Za-z]', m2.group(1)):
        s = '(' + m2.group(1) + ')²'
    # final safety pass (idempotent)
    s = re.sub(r'(?<![A-Za-z])(if|of|and|the|to|in|is|on|for|are|was|be|by|or|an|as|at|it|from|that|this|with)([⁰¹²³⁴⁵⁶⁷⁸⁹]+)',
               lambda m: m.group(1), s, flags=re.IGNORECASE)
    s = re.sub(r'(?<=[A-Za-z²³)\]}]) - (?==)', ' − ', s)
    s = re.sub(r'(?<!\d) - (?!\d)', ' − ', s)
    s = re.sub(r'\(\s*\)', '', s)
    s = re.sub(r'\s{2,}', ' ', s).strip()
    return s


def to_hindi(q):
    """Safe whole-sentence template translations. Returns (text, lang)."""
    s = q.strip()
    # Simplify frames
    m = re.match(r'^Simplify(?:\s+the\s+following\s+expression[.:]?|\s+the\s+following[.:]?|\s+the\s+expression\s*:|:)?\s*(.+)$', s, re.S | re.IGNORECASE)
    if m and len(m.group(1)) > 3:
        return 'निम्नलिखित व्यंजक को सरल कीजिए: ' + m.group(1), 'hi'
    # What is the value of X?
    m = re.match(r'^What is the value of (.+?)\??$', s, re.S)
    if m and len(m.group(1)) > 2 and not re.search(r'\b(for|if|when|such that|closest to)\b', m.group(1)):
        return m.group(1).rstrip('? ') + ' का मान क्या है?', 'hi'
    # Find the value of X
    m = re.match(r'^(?:Please\s+)?[Ff]ind the value of (.+?)[?.:]*$', s, re.S)
    if m and len(m.group(1)) > 2 and not re.search(r'\b(for which|if|when|such that)\b', m.group(1)):
        return m.group(1) + ' का मान ज्ञात कीजिए।', 'hi'
    # The value of X is:
    m = re.match(r'^The value of (.+?)\s+is\s*:\s*$', s, re.S)
    if m and len(m.group(1)) > 2:
        return m.group(1) + ' का मान है:', 'hi'
    # If A, then find the value of B
    m = re.match(r'^If (.+?),\s*then find the value of (.+?)[?.:]*$', s, re.S)
    if m and len(m.group(1)) > 1 and len(m.group(2)) > 1:
        _enw = re.findall(r'[a-zA-Z]{3,}', m.group(1))
        if len(_enw) >= 3 and re.search(r'\d', m.group(1)):
            return q, 'en'
        return 'यदि ' + m.group(1) + ', तो ' + m.group(2) + ' का मान ज्ञात कीजिए।', 'hi'
    # Pure-math X is equal to
    m = re.match(r"^([0-9x-zX-Z²³+\-−×÷*/().\s^=|]+?)\s+is equal to\s*[:_?.]*\s*$", s)
    if m and len(m.group(1).strip()) > 2:
        return m.group(1).strip() + ' बराबर है:', 'hi'
    # Evaluate X
    m = re.match(r'^Evaluate\s*:?\s*(.+?)[?.:]*$', s, re.S)
    if m and len(m.group(1)) > 2:
        return m.group(1) + ' का मान निकालिए।', 'hi'
    # Solve: X
    m = re.match(r'^Solve\s*:?\s*(.+)$', s, re.S)
    if m and len(m.group(1)) > 2:
        return 'हल कीजिए: ' + m.group(1), 'hi'
    return q, 'en'


TOPIC_HI = {
    'algebra': 'बीजगणित', 'geometry': 'ज्यामिति', 'mensuration': 'क्षेत्रमिति',
    'trigonometry': 'त्रिकोणमिति', 'number-system': 'संख्या पद्धति',
    'ratio-proportion': 'अनुपात', 'simplification': 'सरलीकरण', 'hcf-lcm': 'HCF-LCM',
    'partnership': 'साझेदारी', 'heights-distances': 'ऊँचाई-दूरी',
    'mixture-alligation': 'मिश्रण',
}
DF_HI = {'easy': 'आसान', 'medium': 'मध्यम', 'hard': 'कठिन'}


def pair_d_only(dtxt):
    """Try to split d-only linearized options into 4. Returns list or None."""
    t = clean_math(dtxt)
    # attach leading minus to numbers
    t = re.sub(r'−\s+(\d)', r'−\1', t)
    # digit^digit -> fraction inside d-only strings
    t = re.sub(r'(\d)\^(\d)', r'\1/\2', t)
    toks = t.split(' ')
    if len(toks) == 4 and all(re.fullmatch(r'−?\d+', x) for x in toks):
        return toks  # 4 plain options
    if len(toks) == 8 and all(re.fullmatch(r'−?\d+', x) for x in toks):
        return [f'{toks[i]}/{toks[i+1]}' for i in (0, 2, 4, 6)]
    return None


def main():
    lines = open('/tmp/old-pyq-bank.js', encoding='utf-8').read().split('\n')
    recs = []
    for ln in lines:
        s = ln.strip().rstrip(',')
        if s.startswith('{"t":'):
            recs.append(json.loads(s))
    print(f'input records: {len(recs)}', file=sys.stderr)

    out = []
    seen = set()
    stats = {'hi': 0, 'en': 0, 'dup': 0, 'donly_split': 0, 'donly_raw': 0}
    for r in recs:
        q = clean_math(r.get('q', '') or '')
        if len(q) < 8:
            continue
        q, lang = to_hindi(q)
        stats[lang] += 1
        o = r.get('o') or {}
        keys = sorted(o.keys())
        opts, letters = [], []
        if keys == ['d']:
            paired = pair_d_only(o['d'])
            if paired:
                opts, letters = paired, ['a', 'b', 'c', 'd']
                stats['donly_split'] += 1
            else:
                opts, letters = [clean_math(o['d'])], ['d']
                stats['donly_raw'] += 1
        else:
            for k in ['a', 'b', 'c', 'd']:
                if k in o and (o[k] or '').strip():
                    co = clean_math(o[k])
                    if not co.strip() or re.fullmatch(r'[²³⁴⁵⁶⁷⁸⁹⁰¹⁻⁺\s]+', co):
                        continue
                    opts.append(co)
                    letters.append(k)
        a = (r.get('a') or '').strip().lower()
        if a not in ('a', 'b', 'c', 'd'):
            a = ''
        # dedupe on cleaned question + options
        dk = (re.sub(r'\s+', ' ', q.lower()).strip(), '|'.join(opts).lower())
        if dk in seen:
            stats['dup'] += 1
            continue
        seen.add(dk)
        out.append({
            'id': f"L{len(out)+1:04d}",
            'q': q,
            'o': opts,
            'ol': letters,
            'a': a,
            'e': r.get('e') or 'SSC',
            'y': r.get('y') or '',
            't': TOPIC_HI.get(r.get('t'), r.get('t')),
            'd': DF_HI.get(r.get('df'), 'मध्यम'),
            'p': r.get('p') or '',
            'lang': lang,
        })
    print(f'unique out: {len(out)}, stats: {stats}', file=sys.stderr)
    # write JS
    with open('js/data-pyq-legacy.js', 'w', encoding='utf-8') as f:
        f.write('/* ============================================================\n')
        f.write('   गणित गुरु — PYQ बैंक (लेगेसी: 2021-2025 के हज़ारों प्रश्न)\n')
        f.write('   पुराने 10,518-प्रश्न बैंक से साफ करके लाए गए अद्वितीय प्रश्न।\n')
        f.write('   गणित के टूटे निशान ठीक किए गए; कुछ प्रश्न मूल English में हैं।\n')
        f.write('   ============================================================ */\n\n')
        f.write('const PYQ_BANK_LEGACY = [\n')
        for r in out:
            f.write(json.dumps(r, ensure_ascii=False) + ',\n')
        f.write('];\n\n')
        f.write("if (typeof module !== 'undefined') module.exports = { PYQ_BANK_LEGACY };\n")
    print(f'wrote js/data-pyq-legacy.js', file=sys.stderr)


if __name__ == '__main__':
    main()
