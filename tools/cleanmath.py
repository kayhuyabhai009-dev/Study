#!/usr/bin/env python3
"""Shared math-cleanup module (extracted from pyq_pipeline). Import clean_math, sup, SUP_CHARS."""
import json, re, sys

SUP = str.maketrans('0123456789-+', '⁰¹²³⁴⁵⁶⁷⁸⁹⁻⁺')
SUP_CHARS = '⁰¹²³⁴⁵⁶⁷⁸⁹⁻⁺ⁿᵐ'

SUP_LETTERS = {'a':'ᵃ','b':'ᵇ','c':'ᶜ','d':'ᵈ','e':'ᵉ','f':'ᶠ','g':'ᵍ','h':'ʰ','i':'ⁱ','j':'ʲ','k':'ᵏ','l':'ˡ','m':'ᵐ','n':'ⁿ','o':'ᵒ','p':'ᵖ','r':'ʳ','s':'ˢ','t':'ᵗ','u':'ᵘ','v':'ᵛ','w':'ʷ','x':'ˣ','y':'ʸ','z':'ᶻ','A':'ᴬ','B':'ᴮ','D':'ᴰ','E':'ᴱ','G':'ᴳ','H':'ᴴ','I':'ᴵ','J':'ᴶ','K':'ᴷ','L':'ᴸ','M':'ᴹ','N':'ᴺ','O':'ᴼ','P':'ᴾ','R':'ᴿ','T':'ᵀ','U':'ᵁ','V':'ⱽ','W':'ᵂ'}

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
    s = re.sub(r'\^([a-zA-Z])(?![a-zA-Z])', lambda m: SUP_LETTERS.get(m.group(1), '^' + m.group(1)), s)
    def _sup_paren(m):
        out = []
        for ch in m.group(1):
            if ch == '−':
                out.append('⁻')
            elif ch.isdigit() or ch in '-+':
                out.append(str(ch).translate(SUP))
            elif ch in SUP_LETTERS:
                out.append(SUP_LETTERS[ch])
            else:
                return m.group(0)
        return ''.join(out)
    s = re.sub(r'\^\(([^()]{1,10})\)', _sup_paren, s)
    def _sup_brace(m):
        out = []
        for ch in m.group(1):
            if ch.isdigit() or ch in '-+−':
                out.append('⁻' if ch == '−' else str(ch).translate(SUP))
            elif ch in SUP_LETTERS:
                out.append(SUP_LETTERS[ch])
            else:
                return '^(' + m.group(1) + ')'
        return ''.join(out)
    s = re.sub(r'\^\{([^{}]{1,12})\}', _sup_brace, s)
    s = re.sub(r'\^([a-zA-Z]{2,})', r'^(\1)', s)
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
