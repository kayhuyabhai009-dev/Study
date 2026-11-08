#!/usr/bin/env python3
# STUDY Ad v2 — "15+ Saal ke PYQ" cinematic 1080x1920 renderer
# Pillow + HarfBuzz + FreeType + numpy — glassmorphism, gradient type, 3D phone comp
import os, math, wave, random, sys, unicodedata
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont
import uharfbuzz as hb
import freetype as FT

random.seed(11); np.random.seed(11)
W, H = 1080, 1920
FPS = 30
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
A = os.path.join(ROOT, 'ad', 'assets')
OUT = '/tmp/adf'; os.makedirs(OUT, exist_ok=True)
SFXWAV = '/tmp/ad_sfx.wav'

from mutagen.mp3 import MP3
VO = os.path.join(A, 'vo2.mp3')
VOD = MP3(VO).info.length
RATE = 1.12
DUR = VOD / RATE + 1.1
NFR = int(DUR * FPS)
SC = [(0, .115), (.115, .26), (.26, .42), (.42, .68), (.68, .90), (.90, 1.0)]
SCA = [a * DUR for a, b in SC]; SCB = [b * DUR for a, b in SC]
BASE = [3.5, 4.5, 5.0, 8.0, 6.8, 3.1]
K = [(SCB[i] - SCA[i]) / BASE[i] for i in range(6)]

# ---------- text engine (harfbuzz + freetype) ----------
FDIR = '/tmp/fonts/package'
F_PATHS = {'b800': f'{FDIR}/800ExtraBold/Baloo2_800ExtraBold.ttf',
           'b700': f'{FDIR}/700Bold/Baloo2_700Bold.ttf',
           'm700': f'{FDIR}/700Bold/Mukta_700Bold.ttf',
           'm400': f'{FDIR}/400Regular/Mukta_400Regular.ttf'}
FTF = {}; HBF = {}; UPEM = {}
for k, p in F_PATHS.items():
    dat = open(p, 'rb').read()
    face = hb.Face(dat); f = hb.Font(face); f.scale = (face.upem, face.upem)
    HBF[k] = f; UPEM[k] = face.upem; FTF[k] = FT.Face(p)

TILE = {}
def text_tile(text, size, weight='b800', color=(255, 255, 255)):
    key = (text, size, weight, color)
    if key in TILE: return TILE[key]
    sc = size / UPEM[weight]
    buf = hb.Buffer(); buf.add_str(text); buf.guess_segment_properties()
    hb.shape(HBF[weight], buf, {})
    infos, poss = buf.glyph_infos, buf.glyph_positions
    advs = [(p.x_advance * sc, -p.y_advance * sc, p.x_offset * sc, -p.y_offset * sc) for p in poss]
    tot = sum(a[0] for a in advs) + 8
    face = FTF[weight]; face.set_pixel_sizes(0, size)
    asc = face.size.ascender / 64.0; desc = -face.size.descender / 64.0
    hgt = int(asc + desc + 16); wdt = int(max(tot, 8) + 16)
    arr = np.zeros((hgt, wdt, 4), np.uint8)
    baseline = int(asc + 8); pen = 8
    for i, g in enumerate(infos):
        face.load_glyph(g.codepoint, FT.FT_LOAD_RENDER)
        slot = face.glyph; bmp = slot.bitmap
        if bmp.width and bmp.rows:
            bm = np.frombuffer(bytes(bmp.buffer), dtype=np.uint8).reshape(bmp.rows, bmp.width)
            x = int(pen + advs[i][2] + slot.bitmap_left); y = int(baseline - slot.bitmap_top + advs[i][3])
            x0, y0 = max(x, 0), max(y, 0); x1 = min(x + bmp.width, wdt); y1 = min(y + bmp.rows, hgt)
            if x1 > x0 and y1 > y0:
                sub = bm[y0 - y:y1 - y, x0 - x:x1 - x]
                region = arr[y0:y1, x0:x1]
                region[..., 0] = color[0]; region[..., 1] = color[1]; region[..., 2] = color[2]
                region[..., 3] = np.maximum(region[..., 3], sub)
        pen += advs[i][0]
    img = Image.fromarray(arr)
    TILE[key] = img
    return img

GLOWC = {}
def grad_tile(text, size, weight='b800', cTop=(255, 205, 120), cBot=(255, 110, 20), glow=(255, 150, 50), gr=16):
    key = ('g', text, size, weight)
    if key in TILE: return TILE[key]
    t = text_tile(text, size, weight, (255, 255, 255))
    am = t.split()[3]
    out = Image.new('RGBA', (t.width + gr * 4, t.height + gr * 4), (0, 0, 0, 0))
    if glow:
        gm = am.filter(ImageFilter.GaussianBlur(gr))
        gl = Image.new('RGBA', t.size, glow + (0,))
        gl.putalpha(gm.point(lambda v: v * .6))
        out.alpha_composite(gl, (gr * 2, gr * 2))
    n = t.height
    grad = np.zeros((n, 4), np.uint8)
    for y in range(n):
        u = y / max(1, n - 1)
        grad[y, :] = [int(cTop[i] + (cBot[i] - cTop[i]) * u) for i in range(3)] + [255]
    body = Image.new('RGBA', t.size, (0, 0, 0, 0))
    bga = np.array(body); bga[..., :3] = grad[:, None, :3].repeat(t.width, 1)
    body = Image.fromarray(bga); body.putalpha(am)
    out.alpha_composite(body, (gr * 2, gr * 2))
    TILE[key] = out
    return out

ALPHA_CACHE = {}
def paste_alpha(dst, tile, x, y, alpha=1.0):
    if alpha <= 0: return
    if alpha < 1.0:
        q = max(1, min(10, int(alpha * 10 + .5)))
        tk = (id(tile), q)
        if tk not in ALPHA_CACHE:
            t2 = tile.copy(); a = np.array(t2)
            a[..., 3] = (a[..., 3].astype(np.float32) * q / 10).astype(np.uint8)
            ALPHA_CACHE[tk] = Image.fromarray(a)
        tile = ALPHA_CACHE[tk]
    dst.paste(tile, (int(x), int(y)), tile)

def eob(u):
    c1 = 1.45; c3 = c1 + 1
    return 1 + c3 * pow(u - 1, 3) + c1 * pow(u - 1, 2)
def eo(u): return 1 - pow(1 - u, 3)
def eoe(u): return 1 if u >= 1 else 1 - pow(2, -10 * u)
def cl(u, a=0, b=1): return min(b, max(a, u))

def graphemes(s):
    out, cur = [], ''
    for ch in s:
        cat = unicodedata.category(ch)
        if not cur: cur = ch
        elif cat in ('Mn', 'Mc') or ch == '्' or cur.endswith('्'): cur += ch
        else: out.append(cur); cur = ch
    if cur: out.append(cur)
    return out

_dark = (6, 9, 18)
def words_kin(img, text, size, y, t_in, tl, wgt='b800', hl=(), hlc=(255, 165, 60), stagger=.09, dur=.5, rise=40, x=W / 2, per_glyph=False, shadow=True):
    units = []
    for wword in text.split(' '):
        clean = wword.strip('…।!?.,\'"‘’')
        col = hlc if clean in hl else (255, 255, 255)
        for u_word in (list(graphemes(wword)) if per_glyph else [wword]):
            units.append((u_word, col))
    gap = int(size * .16) if per_glyph else int(size * .3)
    tiles = [(text_tile(s, size, wgt, c), text_tile(s, size, wgt, _dark)) for s, c in units]
    tot = sum(t.width for t, _ in tiles) + gap * (len(tiles) - 1)
    px = x - tot / 2
    for idx, (t, dk) in enumerate(tiles):
        u = cl((tl - (t_in + idx * stagger)) / dur)
        if u <= 0:
            px += t.width + gap; continue
        a = cl(u * 1.6); dy = (1 - eob(cl(u))) * rise
        if shadow: paste_alpha(img, dk, px + 5, y - t.height / 2 + dy + 7, a * .55)
        paste_alpha(img, t, px, y - t.height / 2 + dy, a)
        px += t.width + gap

def ctext(img, text, size, y, wgt='b800', color=(255, 255, 255), alpha=1.0, x=W / 2, shadow_a=0):
    t = text_tile(text, size, wgt, color)
    if shadow_a:
        dk = text_tile(text, size, wgt, _dark)
        paste_alpha(img, dk, x - t.width / 2 + 5, y - t.height / 2 + 7, alpha * shadow_a)
    paste_alpha(img, t, x - t.width / 2, y - t.height / 2, alpha)
    return t

# ---------- backgrounds ----------
def cover(im, scale=1.0, dy=0):
    w0, h0 = im.size; s = max(W / w0, H / h0) * scale
    im2 = im.resize((int(w0 * s), int(h0 * s)), Image.LANCZOS)
    x = (im2.width - W) // 2; y = (im2.height - H) // 2 + int(dy)
    return im2.crop((x, y, x + W, y + H))

IMG_TUN = Image.open(f'{A}/scene-tunnel.jpg').convert('RGB')
IMG_CHAOS = Image.open(f'{A}/scene-chaos.jpg').convert('RGB')
IMG_PHONE = Image.open(f'{A}/scene-phone.jpg').convert('RGB')
IMG_DATA = Image.open(f'{A}/scene-data.jpg').convert('RGB')
IMG_TRANS = Image.open(f'{A}/scene-transform.jpg').convert('RGB')

def vgrad(c1, c2):
    ar = np.zeros((H, W, 3), np.uint8)
    for y in range(H):
        u = y / (H - 1); ar[y, :] = [int(c1[i] + (c2[i] - c1[i]) * u) for i in range(3)]
    return Image.fromarray(ar, 'RGB')

def rglow(cx, cy, rad, color, amax):
    yy, xx = np.mgrid[0:H, 0:W]
    d = np.sqrt(((xx - cx) * .55) ** 2 + (yy - cy) ** 2) / rad
    g = np.clip(1 - d, 0, 1) ** 2 * amax
    m = Image.new('RGBA', (W, H), color + (0,)); m.putalpha(Image.fromarray(g.astype(np.uint8), 'L'))
    return m

BG3 = vgrad((10, 18, 32), (5, 8, 15))
GLOW3 = rglow(W / 2, H * .42, H * .5, (24, 48, 92), 90)
RED2 = rglow(W / 2, H * 1.15, H * .6, (255, 45, 60), 70)
yy, xx = np.mgrid[0:H, 0:W]
vd = np.sqrt(((xx - W / 2) / (W * .75)) ** 2 + ((yy - H * .44) / (H * .62)) ** 2)
VIG_A = (np.clip(vd - .55, 0, 1) / .45 * 150).astype(np.uint8)
VIG = Image.new('RGBA', (W, H), (2, 5, 12, 0)); VIG.putalpha(Image.fromarray(VIG_A, 'L'))
WARM6 = rglow(W / 2, H * .68, H * .8, (255, 150, 50), 34)

GR_TILES = [np.random.randint(0, 24, (480, 270), np.uint8) for _ in range(4)]
def grain(img, idx):
    g = GR_TILES[idx % 4]
    gm = Image.fromarray(g, 'L').resize((W, H), Image.NEAREST)
    lay = Image.new('RGBA', (W, H), (255, 255, 255, 0)); lay.putalpha(gm.point(lambda v: v * .3))
    return Image.alpha_composite(img, lay)

def rrect(d, box, r, fill): d.rounded_rectangle(box, radius=r, fill=fill)

# ---------- glass chip ----------
def glass_chip(img, bg, text, cx, cy, t0, tl, size=30, gold=False, dx=140):
    u = cl((tl - t0) / .4)
    if u <= 0: return
    slip = (1 - eob(u)) * dx
    t = text_tile(text, size, 'm700', (20, 28, 48) if gold else (230, 240, 255))
    w, h = t.width + 44, t.height + 26
    x0, y0 = cx - w / 2 + slip, cy - h / 2
    bx = bg.crop((int(max(0, x0)), int(max(0, y0)), int(min(W, x0 + w)), int(min(H, y0 + h)))).filter(ImageFilter.GaussianBlur(10))
    lay = Image.new('RGBA', (w, h), (0, 0, 0, 0)); lay.paste(bx, (int(max(0, -x0)), int(max(0, -y0))))
    ov = Image.new('RGBA', (w, h), (0, 0, 0, 0)); dd = ImageDraw.Draw(ov)
    if gold: rrect(dd, (0, 0, w - 1, h - 1), 20, (255, 190, 95, 240))
    else:
        rrect(dd, (0, 0, w - 1, h - 1), 20, (255, 255, 255, 26))
        dd.rounded_rectangle((0, 0, w - 1, h - 1), radius=20, outline=(255, 255, 255, 70), width=2)
    lay.alpha_composite(ov)
    lay.paste(t, (22, 9), t)
    paste_alpha(img, lay, x0, y0, cl(u * 1.5))

# ---------- phone screen composite ----------
PSW, PSH = IMG_PHONE.size
sx_f, sy_f = PSW / 768.0, PSH / 1376.0
QUAD = [(302 * sx_f, 505 * sy_f), (477 * sx_f, 524 * sy_f), (480 * sx_f, 995 * sy_f), (304 * sx_f, 978 * sy_f)]
UIW, UIH = 560, 1160

def find_coeffs(target, source):
    matrix = []
    for p1, p2 in zip(target, source):
        matrix.append([p1[0], p1[1], 1, 0, 0, 0, -p2[0] * p1[0], -p2[0] * p1[1]])
        matrix.append([0, 0, 0, p1[0], p1[1], 1, -p2[1] * p1[0], -p2[1] * p1[1]])
    Am = np.array(matrix, float); Bv = np.array(source).reshape(8)
    return np.linalg.solve(Am, Bv).reshape(8) if False else np.linalg.solve(Am, Bv)

def ui_grid_image():
    ui = Image.new('RGB', (UIW, UIH), (8, 14, 28))
    d = ImageDraw.Draw(ui)
    pill = Image.new('RGBA', (UIW, 86), (0, 0, 0, 0)); dd = ImageDraw.Draw(pill)
    t = text_tile('STUDY · 60-Day Plan', 34, 'b800', (234, 241, 255))
    rrect(dd, (6, 6, t.width + 56, 80), 999, (255, 255, 255, 20))
    dd.rounded_rectangle((6, 6, t.width + 56, 80), radius=999, outline=(255, 255, 255, 50), width=2)
    pill.paste(t, (34, 20), t)
    ui.paste(pill, ((UIW - pill.width) // 2 + 22, 26), pill)
    gw = UIW - 56; gap = 10; cw = (gw - gap * 9) / 10
    tile_n = text_tile('Day Plan', 26, 'm700', (147, 163, 196))
    ui.paste(tile_n, ((UIW - tile_n.width) // 2, 128), tile_n)
    for i in range(60):
        r, c = divmod(i, 10)
        x0 = 28 + c * (cw + gap); y0 = 170 + r * (cw + gap)
        col = (25, 211, 197) if (i + 1) % 7 == 0 else (255, 150, 40)
        rrect(d, (x0, y0, x0 + cw, y0 + cw), 10, col)
        nt = text_tile(str(i + 1), 20, 'm700', (20, 10, 0) if (i + 1) % 7 else (0, 40, 42))
        ui.paste(nt, (int(x0 + cw / 2 - nt.width / 2), int(y0 + cw / 2 - nt.height / 2)), nt)
    pr_y = 170 + 6 * (cw + gap) + 34
    rrect(d, (28, pr_y, UIW - 28, pr_y + 22), 11, (255, 255, 255, 230) if False else (40, 56, 92))
    rrect(d, (28, pr_y, 28 + (UIW - 56) * .35, pr_y + 22), 11, (255, 150, 40))
    pt = text_tile('Progress · Day 21/60', 24, 'm700', (200, 214, 240))
    ui.paste(pt, ((UIW - pt.width) // 2, int(pr_y + 40)), pt)
    # mini cards below
    for j, (cap, col) in enumerate((('Revise · Day 1-7-14', (25, 120, 210)), ('Test · साप्ताहिक', (255, 150, 40)))):
        cy2 = pr_y + 108 + j * 92
        rrect(d, (28, cy2, UIW - 28, cy2 + 74), 18, (col[0], col[1], col[2], 40) if False else (22, 34, 58))
        d.rounded_rectangle((28, cy2, UIW - 28, cy2 + 74), radius=18, outline=col + (140,), width=2)
        ct = text_tile(cap, 26, 'm700', (235, 242, 255))
        ui.paste(ct, (56, int(cy2 + 20)), ct)
    return ui

def ui_concept_image():
    ui = Image.new('RGB', (UIW, UIH), (8, 14, 28))
    d = ImageDraw.Draw(ui)
    t = text_tile('संख्या पद्धति', 44, 'b800', (255, 255, 255))
    ui.paste(t, ((UIW - t.width) // 2, 30), t)
    s2 = text_tile('Sub-topic · Concept deep-dive', 24, 'm700', (147, 163, 196))
    ui.paste(s2, ((UIW - s2.width) // 2, 104), s2)
    chips = ['वर्ग-घन', 'भाज्यता', 'इकाई अंक', 'शेषफल']
    cx = 28; cy2 = 162
    for c in chips:
        ct = text_tile(c, 26, 'm700', (207, 224, 255))
        w2 = ct.width + 36
        if cx + w2 > UIW - 28: cx = 28; cy2 += 76
        rrect(d, (cx, cy2, cx + w2, cy2 + 58), 999, (34, 54, 96))
        d.rounded_rectangle((cx, cy2, cx + w2, cy2 + 58), radius=999, outline=(110, 150, 235, 120), width=2)
        ui.paste(ct, (cx + 18, cy2 + 12), ct)
        cx += w2 + 14
    by = cy2 + 116
    rrect(d, (28, by, UIW - 28, by + 560), 26, (16, 26, 48))
    d.rounded_rectangle((28, by, UIW - 28, by + 560), radius=26, outline=(120, 150, 230, 90), width=2)
    ti = text_tile('Concept: इकाई अंक निकालना', 30, 'b800', (255, 255, 255))
    ui.paste(ti, (52, by + 20), ti)
    a1 = text_tile('⚡'/ '0' if False else 'Shortcut Trick', 26, 'm700', (255, 224, 170))
    b1 = text_tile('Common Trap से बचो', 26, 'm700', (255, 205, 210))
    rrect(d, (52, by + 84, 52 + a1.width + 40, by + 148), 14, (70, 46, 16))
    ui.paste(a1, (72, by + 96), a1)
    rrect(d, (52, by + 164, 52 + b1.width + 40, by + 228), 14, (70, 22, 28))
    ui.paste(b1, (72, by + 176), b1)
    ln = ['Category I: अंतिम अंक नियम', 'Category II: चक्रीयता (Cycle of 4)', 'Trap: 0/1/5/6 हमेशा वही रहते हैं']
    yy3 = by + 258
    for L in ln:
        lt = text_tile('• ' + L, 24, 'm700', (214, 226, 250))
        ui.paste(lt, (52, yy3), lt); yy3 += 54
    bt = text_tile('इस Concept के असली PYQ »', 28, 'b800', (23, 11, 0))
    bw = bt.width + 64
    rrect(d, (28, by + 468, 28 + bw, by + 468 + 72), 20, (255, 152, 40))
    ui.paste(bt, (28 + 32, by + 468 + 16), bt)
    return ui

def phone_composite(ui_img):
    frame = IMG_PHONE.copy().convert('RGBA')
    warped = ui_img.convert('RGBA').transform((PSW, PSH), Image.PERSPECTIVE,
             find_coeffs(QUAD, [(0, 0), (UIW, 0), (UIW, UIH), (0, UIH)]), Image.BICUBIC)
    # soft screen glow
    glow_m = warped.split()[3].filter(ImageFilter.GaussianBlur(18))
    gl = Image.new('RGBA', (PSW, PSH), (200, 225, 255, 0)); gl.putalpha(glow_m.point(lambda v: v * .5))
    frame.alpha_composite(gl)
    frame.alpha_composite(warped)
    return frame

UI_A = None; UI_B = None
def get_phone_bg(which):
    global UI_A, UI_B
    if UI_A is None: UI_A = phone_composite(ui_grid_image().convert('RGBA'))
    if UI_B is None: UI_B = phone_composite(ui_concept_image().convert('RGBA'))
    return (UI_A if which == 0 else UI_B).convert('RGB')

# ---------- particles (S3) ----------
GLY = [g for g in '∑π√∞%θ÷×+=' if FTF['b700'].get_char_index(ord(g)) != 1.9 - .9] or ['+', '=', '%']
GLY = [g for g in '∑π√∞%θ÷×+=' if FTF['b700'].get_char_index(ord(g)) != 0] or ['+', '=', '%']
parts = []
class P: pass
for i in range(24):
    p = P(); p.g = GLY[i % len(GLY)]; p.s = 30 + random.random() * 48
    p.ang = random.random() * math.pi * 2; p.rad = 150 + random.random() * 430
    p.al = .3 + random.random() * .5
    parts.append(p)

def paste_rot(img, tile, x, y, ang, alpha=1.0):
    q = int(ang % 360 / 15) * 15
    RK = (id(tile), q)
    if RK not in ALPHA_CACHE:
        ALPHA_CACHE[RK] = tile.rotate(-q, expand=True, resample=Image.BICUBIC)
    r = ALPHA_CACHE[RK]
    paste_alpha(img, r, x - r.width / 2, y - r.height / 2, alpha)

# ---------- camera / flash ----------
PUNCHES = [(2.45, .08), (SCA[1] + 1.9 * K[1], .06), (a := SCB[2] - 1.02 * K[2], .09),
           (SCA[4] + 3.3 * K[4] + 1.9, .07), (SCA[5] + 1.2 * K[5], .05)]
FLASHES = [(2.45, .35), (SCA[1], .18), (a, .7), (SCA[4] + 3.3 * K[4] + 1.95, .25), (SCA[5] + 1.2 * K[5], .2)]
def cam(tg):
    z = 1.0
    for t0, pk in PUNCHES:
        if tg >= t0: z += pk * math.exp(-(tg - t0) * 6)
    amp = 0
    if SCA[1] <= tg < SCB[1]:
        u = (tg - SCA[1]) / (SCB[1] - SCA[1]); amp = (.8 + u * 1.6) * 2
    if SCB[2] - 1.02 * K[2] <= tg < SCB[2] - 1.02 * K[2] + .5: amp = 5 * 2 * (1 - (tg - (SCB[2] - 1.02 * K[2])) / .5)
    n = tg * 7
    return z, amp * (math.sin(n * 2.3) * .6 + math.sin(n * 5.1) * .4), amp * (math.cos(n * 1.9) * .6 + math.sin(n * 4.3) * .4)
def flash_at(tg):
    o = 0
    for t0, pk in FLASHES:
        if 0 <= tg - t0 < .18: o = max(o, pk * (1 - (tg - t0) / .18))
    return o

# ---------- SCENES ----------
YEARS = ['2011', '2015', '2019', '2023', '2026']
def scene1(img, u, tl):
    im = cover(IMG_TUN, 1.3 - .24 * eo(u))
    img.paste(im, (0, 0))
    d = ImageDraw.Draw(img)
    # letterbox cinema bars
    lb = int(120 * cl(tl / .5))
    d.rectangle((0, 0, W, lb), fill=(2, 4, 9)); d.rectangle((0, H - lb, W, H), fill=(2, 4, 9))
    # year chips streak
    for i, yr in enumerate(YEARS):
        t0 = .55 + i * .34
        uu = cl((tl - t0) / .5)
        if uu <= 0: continue
        dirr = 1 if i % 2 == 0 else -1
        x = (W * .5) + dirr * (1 - eo(uu)) * (W * .9)
        yv = (300 + i * 150) * 1.55
        t = text_tile(yr, 56, 'b800', (255, 196, 100))
        # motion streak
        st = t.resize((int(t.width * 1.9), t.height), Image.BILINEAR).filter(ImageFilter.GaussianBlur(6))
        paste_alpha(img, st, x - st.width / 2 - dirr * 30, yv - st.height / 2, cl(uu) * .5)
        paste_alpha(img, t, x - t.width / 2, yv - t.height / 2, cl(uu * 1.5))
    words_kin(img, '15+ साल के', 92, H * .40, 1.55, tl, per_glyph=False, stagger=.16, dur=.5)
    sl = cl((tl - 2.45) / .35)
    if sl > 0:
        gt = grad_tile('असली PYQ', 168, 'b800')
        s = 2.2 - 1.2 * eob(sl)
        g2 = gt.resize((int(gt.width * s), int(gt.height * s)), Image.BILINEAR)
        paste_alpha(img, g2, W / 2 - g2.width / 2, H * .52 - g2.height / 2, cl(sl * 2.5))
    if tl > 2.9:
        ctext(img, 'हर exam · हर shift · हर सवाल', 46, H * .665, wgt='m700', color=(214, 226, 250), alpha=cl((tl - 2.9) / .4), shadow_a=.6)

NOTIF = [('maths_FINAL_(2).pdf', 38, 150, -3), ('tricks_NEW_2025.mp4', 290, 140, 4.5),
         ('Telegram: 2,304 unread', 60, 330, -7.5), ('booklist_47.xlsx', 310, 330, 6),
         ('PYQ_last_LAST_v9.pdf', 38, 500, -9), ('plan kab bana??', 300, 480, 7.5)]
notif_tiles = None
def scene2(img, u, tl):
    im = cover(IMG_CHAOS, 1.06 + .08 * u)
    img.paste(im, (0, 0))
    img.alpha_composite(Image.new('RGBA', (W, H), (6, 9, 20, 96)))
    img.alpha_composite(Image.new('RGBA', (W, H), (255, 45, 60, 0))) if False else None
    paste_alpha(img, RED2, 0, 0, u * .8)
    global notif_tiles
    if notif_tiles is None:
        notif_tiles = []
        for txt, x, y, rot in NOTIF:
            t = text_tile(txt, 30, 'm700', (223, 232, 255))
            w, h = t.width + 44, t.height + 32
            card = Image.new('RGBA', (w + 8, h + 8), (0, 0, 0, 0))
            dd = ImageDraw.Draw(card)
            rrect(dd, (4, 14, w, h), 24, (14, 22, 40, 225))
            dd.rounded_rectangle((4, 14, w, h), radius=24, outline=(120, 150, 220, 70), width=2)
            card.paste(t, (26, 20), t)
            card = card.rotate(-rot, expand=True, resample=Image.BICUBIC)
            notif_tiles.append((card, x * 2, y * 2))
    for i, (card, x, y) in enumerate(notif_tiles):
        uu = cl((tl - (.15 + i * .14) * K[1]) / .5)
        if uu <= 0: continue
        dy = (1 - eob(uu)) * -680
        paste_alpha(img, card, x, y + dy, cl(uu * 1.7))
    words_kin(img, 'पर तुम्हारा plan?', 92, H * .60, 1.0 * K[1], tl, stagger=.13, dur=.5)
    zl = cl((tl - 1.9 * K[1]) / .35)
    if zl > 0:
        t2 = text_tile('ज़ीरो.', 150, 'b800', (255, 90, 100))
        s = 2.2 - 1.2 * eob(zl)
        t2s = t2.resize((int(t2.width * s), int(t2.height * s)), Image.BILINEAR)
        dk = text_tile('ज़ीरो.', 150, 'b800', _dark).resize(t2s.size, Image.BILINEAR)
        paste_alpha(img, dk, W / 2 - dk.width / 2 + 7, H * .71 - dk.height / 2 + 9, cl(zl * 2) * .6)
        paste_alpha(img, t2s, W / 2 - t2s.width / 2, H * .71 - t2s.height / 2, cl(zl * 2))

def scene3(img, u, tl):
    img.paste(BG3, (0, 0)); img.alpha_composite(GLOW3)
    # converging glyphs → burst
    for p in parts:
        sp = tl - 1.0
        if sp < 0: continue
        slam = (SCB[2] - SCA[2]) - 1.02 * K[2]
        if sp < slam - 1.0:
            ang = p.ang + sp * 2.4; rad = max(16, p.rad * math.exp(-1.7 * sp))
        else:
            bt = sp - (slam - 1.0)
            ang = p.ang + (slam - 1.0) * 2.4 + bt * .8
            rad = max(16, p.rad * math.exp(-1.7 * (slam - 1.0))) + bt * (p.rad * 3 + 420)
            p.al *= (1 - 1.1 * bt * .016)
        x2 = W / 2 + math.cos(ang) * rad * 2; y2 = H * .42 + math.sin(ang) * rad * 1.44
        t = text_tile(p.g, int(p.s * 2), 'b700', (150, 178, 235))
        paste_rot(img, t, x2, y2, ang * 57.3, max(0, min(p.al, .85)))
    ctext(img, '· ' + '  '.join(GLY[:7]) + ' ·', 40, H * .24, wgt='m700', color=(95, 123, 176), alpha=cl(tl / .8) * .9)
    words_kin(img, 'कमी मेहनत की नहीं…', 88, H * .46, 2.3 * K[2] * .6, tl, hl=('नहीं…',), stagger=.14, dur=.55)
    slamT = (SCB[2] - SCA[2]) - 1.02 * K[2]
    if tl >= slamT:
        uu = cl((tl - slamT) / .3)
        gt = grad_tile('दिशा की है.', 150, 'b800')
        s = 2.6 - 1.6 * eob(uu)
        g2 = gt.resize((max(4, int(gt.width * s)), max(4, int(gt.height * s))), Image.BILINEAR)
        cx, cy = W / 2, H * .62
        if 0 < tl - slamT < .38:
            rt = Image.new('RGBA', g2.size, (255, 51, 85, 0))
            ra = g2.split()[3]; rt.putalpha(ra.point(lambda v: v * .8))
            bt = Image.new('RGBA', g2.size, (51, 204, 255, 0)); bt.putalpha(ra.point(lambda v: v * .8))
            paste_alpha(img, rt, cx - g2.width / 2 - 16, cy - g2.height / 2 + 6, .8)
            paste_alpha(img, bt, cx - g2.width / 2 + 16, cy - g2.height / 2 - 6, .8)
        paste_alpha(img, g2, cx - g2.width / 2, cy - g2.height / 2, cl(uu * 3))

def scene4(img, u, tl):
    ph = 0 if tl < 4.4 * K[3] else 1
    bgA = cover(get_phone_bg(0), 1.05 + .03 * u)
    img.paste(bgA, (0, 0))
    if ph == 1:
        cf = cl((tl - 4.4 * K[3]) / .6)
        bgB = cover(get_phone_bg(1), 1.05 + .03 * u)
        paste_alpha(img, bgB.convert('RGBA'), 0, 0, cf)
    # light sweep
    sw_t = 6.0 * K[3]
    if sw_t < tl < sw_t + .7:
        sx = int(((tl - sw_t) / .7) * (W + 900) - 450)
        band = Image.new('RGBA', (W, H), (0, 0, 0, 0)); bd = ImageDraw.Draw(band)
        bd.polygon([(sx - 120, 0), (sx + 60, 0), (sx + 60 + 460, H), (sx - 120 + 460, H)], fill=(255, 255, 255, 34))
        band = band.filter(ImageFilter.GaussianBlur(18))
        img.alpha_composite(band)
    # side glass labels
    words_kin(img, 'Day 1 → Day 60 — हर दिन तय', 54, H - 300, 1.3 * K[3], tl, wgt='b700', stagger=.08 * K[3])
    glass_chip(img, img, 'Shortcuts · Traps · Concept-PYQ', W / 2, H - 200, 5.2 * K[3], tl, size=34, gold=True, dx=0)

def scene5(img, u, tl):
    im = cover(IMG_DATA, 1.16 - .1 * eo(u))
    img.paste(im, (0, 0))
    words_kin(img, 'हर concept के साथ — असली PYQ', 52, 120, .1 * K[4], tl, wgt='b700', hl=('PYQ',), stagger=.06 * K[4])
    FILT = [('अध्याय', 'प्रतिशत'), ('Concept', 'बट्टा / छूट'), ('Exam', 'SSC CGL'), ('Year', '2023'), ('Shift', 'Shift 2')]
    for i, (k2, v) in enumerate(FILT):
        t0 = (0.7 + i * .3) * K[4]
        glass_chip(img, img, f'{k2}: {v}', W * .28, (190 + i * 94), t0, tl, size=30, dx=-160)
    # question glass card
    qu = cl((tl - 2.6 * K[4]) / .5)
    if qu > 0:
        cw2, ch2 = 880, 400; x0 = (W - cw2) / 2; y0 = H * .40 + (1 - eob(qu)) * 160
        bx = img.crop((int(x0), int(y0), int(x0 + cw2), int(y0 + ch2))).filter(ImageFilter.GaussianBlur(12))
        lay = Image.new('RGBA', (cw2, ch2), (0, 0, 0, 0)); lay.paste(bx, (0, 0))
        dd = ImageDraw.Draw(lay)
        rrect(dd, (0, 0, cw2 - 1, ch2 - 1), 36, (10, 16, 32, 120))
        dd.rounded_rectangle((0, 0, cw2 - 1, ch2 - 1), radius=36, outline=(160, 190, 255, 80), width=2)
        paste_alpha(img, lay, x0, y0, cl(qu * 1.5))
        if qu > .45:
            glass_chip(img, img, 'SSC CGL · 2023 · Shift 2', x0 + 190, y0 + 52, 2.9 * K[4], tl, size=26, dx=0)
            q = text_tile('किसी संख्या का 45% = 900, तो 65% = ?', 38, 'm700', (242, 246, 255))
            paste_alpha(img, q, x0 + 46, y0 + 108, cl((tl - 3.0 * K[4]) / .4))
            okU = cl((tl - 3.6 * K[4]) / .3)
            ocols = [(58, 74, 130), (32, 170, 100), (58, 74, 130), (58, 74, 130)]
            labels = ['1200', '1300', '1400', '1500']
            ow = (cw2 - 92 - 48) / 4
            d = ImageDraw.Draw(img)
            for j in range(4):
                ox = x0 + 46 + j * (ow + 16); oy = y0 + 190
                if j == 1 and okU > 0:
                    pop = 1 + .12 * math.sin(min(okU, 1) * math.pi); ex = (pop - 1) * ow / 2
                    rrect(d, (ox - ex, oy - ex, ox + ow + ex, oy + 88 + ex), 18, (35, 190, 115, 255))
                    ot = text_tile(labels[j], 36, 'b800', (3, 37, 15))
                else:
                    rrect(d, (ox, oy, ox + ow, oy + 88), 18, (90, 120, 210, 60))
                    d.rounded_rectangle((ox, oy, ox + ow, oy + 88), radius=18, outline=(150, 180, 255, 80), width=2)
                    ot = text_tile(labels[j], 36, 'b800', (215, 226, 255))
                paste_alpha(img, ot, ox + ow / 2 - ot.width / 2, oy + 44 - ot.height / 2, cl(qu * 2))
    # counter
    c_t = 3.3 * K[4]
    if tl > c_t:
        cu = cl((tl - c_t) / 1.9)
        val = int(round(eoe(cu) * 37061))
        gt = grad_tile(f'{val:,}', 132, 'b800')
        pul = 1 + (.08 * math.exp(-(tl - c_t - 1.9) * 5) if cu >= 1 else 0)
        g2 = gt.resize((int(gt.width * pul), int(gt.height * pul)), Image.BILINEAR)
        paste_alpha(img, g2, W / 2 - g2.width / 2, H * .66 - g2.height / 2, cl(cu * 4))
        if cu >= 1:
            ctext(img, 'असली PYQ — exam · साल · shift के साथ', 38, H * .745, wgt='m700', color=(222, 232, 252), alpha=cl((tl - c_t - 1.9) / .4), shadow_a=.5)
            ctext(img, '2011 ———— 2026', 42, H * .80, wgt='b700', color=(255, 190, 100), alpha=cl((tl - c_t - 2.2) / .4))
            # exam badges
            badges = ['CGL', 'CHSL', 'MTS', 'GD', 'CPO', 'Railway', 'Delhi Police']
            ai = cl((tl - c_t - 2.5) / .5)
            tw = sum(text_tile(b, 26, 'm700', (255, 210, 130)).width + 40 for b in badges) + 14 * 6
            bx = W / 2 - tw / 2
            for b in badges:
                bt = text_tile(b, 26, 'm700', (255, 210, 130))
                w2 = bt.width + 40
                lay = Image.new('RGBA', (w2, 52), (0, 0, 0, 0)); dd = ImageDraw.Draw(lay)
                rrect(dd, (0, 0, w2 - 1, 51), 999, (255, 170, 60, 30))
                dd.rounded_rectangle((0, 0, w2 - 1, 51), radius=999, outline=(255, 190, 100, 100), width=2)
                lay.paste(bt, (20, 8), bt)
                paste_alpha(img, lay, bx, H * .87, ai)
                bx += w2 + 14

def scene6(img, u, tl):
    im = cover(IMG_TRANS, 1.12 - .1 * eo(u))
    img.paste(im, (0, 0))
    img.alpha_composite(WARM6)
    st_u = cl((tl - 1.2 * K[5]) / .34)
    if st_u > 0:
        st = text_tile('DAY 60', 64, 'b800', (28, 232, 110))
        lay = Image.new('RGBA', (st.width + 120, st.height + 40), (0, 0, 0, 0)); dd = ImageDraw.Draw(lay)
        rrect(dd, (2, 2, lay.width - 2, lay.height - 2), 26, (2, 20, 8, 130))
        dd.rounded_rectangle((2, 2, lay.width - 2, lay.height - 2), radius=26, outline=(28, 232, 110, 255), width=10)
        chk_x = st.width + 88; chk_y = 20 + st.height // 2
        dd.line((chk_x - 22, chk_y, chk_x - 6, chk_y + 18), fill=(28, 232, 110, 255), width=12)
        dd.line((chk_x - 6, chk_y + 18, chk_x + 34, chk_y - 22), fill=(28, 232, 110, 255), width=12)
        lay.paste(st, (30, 14), st)
        lay = lay.rotate(8, expand=True, resample=Image.BICUBIC)
        s = 2.4 - 1.4 * eob(st_u)
        l2 = lay.resize((int(lay.width * s), int(lay.height * s)), Image.BILINEAR)
        paste_alpha(img, l2, W / 2 - l2.width / 2, H * .16 - l2.height / 2, cl(st_u * 2))
    words_kin(img, 'Selection लॉटरी नहीं.', 84, H * .34, .3 * K[5], tl, hl=('नहीं.',), stagger=.07 * K[5])
    p2 = cl((tl - 1.05 * K[5]) / .4)
    if p2 > 0:
        gt = grad_tile('PROCESS है.', 116, 'b800')
        s = 1.5 - .5 * eob(p2)
        g2 = gt.resize((int(gt.width * s), int(gt.height * s)), Image.BILINEAR)
        paste_alpha(img, g2, W / 2 - g2.width / 2, H * .45 - g2.height / 2, cl(p2 * 2))
    ec = cl((tl - 1.9 * K[5]) / .45)
    if ec > 0:
        ga = Image.new('RGBA', (W, H), (0, 0, 0, 0)); ga_a = np.array(ga)
        ga_a[..., 3] = (np.clip((yy / H - .40) / .6, 0, 1) * 238 * ec).astype(np.uint8)
        img.alpha_composite(Image.fromarray(ga_a))
        aa = lambda dt2: cl((tl - (1.9 + dt2) * K[5]) / .5)
        lt = text_tile('S', 56, 'b800', (26, 13, 0))
        lay = Image.new('RGBA', (92, 92), (0, 0, 0, 0)); dd = ImageDraw.Draw(lay)
        rrect(dd, (0, 0, 91, 91), 26, (255, 152, 40, 255))
        lay.paste(lt, (46 - lt.width // 2, 46 - lt.height // 2), lt)
        stx = text_tile('STUDY', 80, 'b800', (255, 255, 255))
        tot = lay.width + 22 + stx.width
        ys = H * .68
        paste_alpha(img, lay, W / 2 - tot / 2, ys, aa(0))
        paste_alpha(img, stx, W / 2 - tot / 2 + lay.width + 22, ys + 2, aa(0))
        ctext(img, '60-Day Maths Mastery · 15+ Saal ke PYQ', 36, ys + 150, wgt='m700', color=(215, 226, 248), alpha=aa(.2))
        ac = aa(.45)
        if ac > 0:
            pul = 1 + .05 * math.sin(max(0, tl - 2.35 * K[5]) * math.pi * 2 / 1.2)
            bt = text_tile('» तुम्हारा Day 1 — आज', 50, 'b800', (23, 11, 0))
            bw, bh = bt.width + 84, bt.height + 56
            bl = Image.new('RGBA', (bw, bh), (0, 0, 0, 0)); bd = ImageDraw.Draw(bl)
            rrect(bd, (0, 0, bw - 1, bh - 1), 32, (255, 152, 40, 255))
            bl.paste(bt, (42, 22), bt)
            bl2 = bl.resize((int(bl.width * pul), int(bl.height * pul)), Image.BILINEAR)
            paste_alpha(img, bl2, W / 2 - bl2.width / 2, H * .82 - bl2.height / 2, ac)

# ---------- render ----------
def render():
    for f in range(NFR):
        tg = f / FPS
        img = Image.new('RGBA', (W, H), (7, 13, 26, 255))
        if tg < SCB[0]: scene1(img, (tg - SCA[0]) / (SCB[0] - SCA[0]), tg - SCA[0])
        elif tg < SCB[1]: scene2(img, (tg - SCA[1]) / (SCB[1] - SCA[1]), tg - SCA[1])
        elif tg < SCB[2]: scene3(img, (tg - SCA[2]) / (SCB[2] - SCA[2]), tg - SCA[2])
        elif tg < SCB[3]: scene4(img, (tg - SCA[3]) / (SCB[3] - SCA[3]), tg - SCA[3])
        elif tg < SCB[4]: scene5(img, (tg - SCA[4]) / (SCB[4] - SCA[4]), tg - SCA[4])
        else: scene6(img, min(1, (tg - SCA[5]) / (DUR - SCA[5])), tg - SCA[5])
        z, sx2, sy2 = cam(tg)
        if abs(z - 1) > .004:
            nw, nh = int(W * z), int(H * z)
            img = img.resize((nw, nh), Image.BILINEAR).crop(((nw - W) // 2, (nh - H) // 2, (nw - W) // 2 + W, (nh - H) // 2 + H))
        if sx2 or sy2:
            img2 = Image.new('RGBA', (W, H), (0, 0, 0, 255)); img2.paste(img, (int(sx2), int(sy2))); img = img2
        img = Image.alpha_composite(img, VIG)
        fo = flash_at(tg)
        if fo > .01: img = Image.alpha_composite(img, Image.new('RGBA', (W, H), (255, 255, 255, int(255 * fo))))
        img = grain(img, f)
        img.convert('RGB').save(f'{OUT}/{f + 1:04d}.png')
        if f % 60 == 0: print(f'frame {f}/{NFR}', flush=True)
    print('FRAMES-DONE', flush=True)

# ---------- sfx ----------
SR = 44100
NT = int(DUR * SR)
sfx = np.zeros(NT, np.float32)
def add_env(t0, sig):
    i0 = int(t0 * SR); i1 = min(NT, i0 + len(sig))
    if i1 <= i0: return
    sfx[i0:i1] += sig[:i1 - i0]
def sine_sweep(t0, dur, f0, f1, amp, attack=.01, decay=None):
    if decay is None: decay = dur * .8
    n = int(dur * SR); tt = np.arange(n) / SR
    ph = 2 * np.pi * (f0 * tt + (f1 - f0) / dur * tt ** 2 / 2)
    env = np.minimum(1, tt / attack) * np.exp(-tt / decay) * amp
    add_env(t0, np.sin(ph) * env)
def noise_burst(t0, dur, amp, sweep_up=True, attack=None):
    n = int(dur * SR); tt = np.arange(n) / SR
    if attack is None: attack = dur * .45
    env = (np.minimum(1, tt / attack) * np.minimum(1, (dur - tt) / max(.05, dur * .3)))
    nz = np.random.randn(n).astype(np.float32)
    k = .02 + .5 * (tt / dur) if sweep_up else .5 - .48 * (tt / dur)
    out = np.zeros(n, np.float32); acc = 0.0
    for i in range(0, n, 64):
        blk = nz[i:i + 64]; kk = k[min(i, n - 1)]
        acc = acc * (1 - kk); out[i:i + 64] = acc + blk * kk
    add_env(t0, out * env * amp)
def tone(t0, dur, freq, amp):
    n = int(dur * SR); tt = np.arange(n) / SR
    w = np.sin(2 * np.pi * freq * tt)
    env = np.exp(-tt / (dur * .4)) * np.minimum(1, tt / .01)
    add_env(t0, w * env * amp)
def drone(t0, t1, amp):
    i0, i1 = int(t0 * SR), min(NT, int(t1 * SR)); n = i1 - i0
    if n <= 0: return
    tt = np.arange(n) / SR
    w = sum(np.sin(2 * np.pi * fr * (k + 1) * tt) / ((k + 1) * 2.2) for fr in (73.42, 110, 146.83) for k in range(6))
    sfx[i0:i1] += (w * amp * .5).astype(np.float32)
def padm(t0, t1, amp=.085):
    i0, i1 = int(t0 * SR), min(NT, int(t1 * SR)); n = i1 - i0
    if n <= 0: return
    tt = np.arange(n) / SR
    w = sum(sum(((-1) ** k) * np.sin(2 * np.pi * fr * (2 * k + 1) * tt) / (2 * k + 1) ** 2 for k in range(6)) for fr in (146.83, 220, 293.66, 369.99, 440))
    sw = np.minimum(1, tt / 1.8) * np.clip((t1 - (tt + t0)) / 1.0, 0, 1)
    sfx[i0:i1] += (w * amp * .25 * sw).astype(np.float32)
def boom(t0, amp=.5):
    sine_sweep(t0, .9, 160, 36, amp, .012, .35); noise_burst(t0, .22, amp * .35, sweep_up=False)
def thump(t0, amp=.3): sine_sweep(t0, .25, 62, 40, amp, .006, .1)
def heartbeat(t0): thump(t0); thump(t0 + .17, .18)
def tick(t0, amp=.08): tone(t0, .04, 1750, amp)
def ding(t0): tone(t0, .5, 880, .12); tone(t0 + .09, .55, 1318.5, .11)
def sparkle(t0):
    for i, fr in enumerate((1174.7, 1480, 1760, 2349.3, 2793.8)): tone(t0 + i * .055, .4, fr, .055)
def riser(t0, dur, amp=.14):
    n = int(dur * SR); tt = np.arange(n) / SR
    ph = 2 * np.pi * (73.42 * tt + (880 - 73.42) / dur * tt ** 2 / 2)
    sw = sum(np.sin(ph * (k + 1)) / ((k + 1) * 2) for k in range(6))
    env = (tt / dur) ** 2 * amp
    add_env(t0, (sw * env * .4).astype(np.float32))
    noise_burst(t0, dur, amp * .5, sweep_up=True, attack=dur)

def build_sfx():
    drone(0, SCB[0], .09)
    noise_burst(0, .8, .08, True)
    for i in range(5): tick(.55 + i * .34, .05)
    boom(2.45, .45); sparkle(2.5)
    noise_burst(SCA[1] - .25, .3, .09, True)
    drone(SCA[1], SCB[1], .12)
    heartbeat(SCA[1] + .3); heartbeat(SCA[1] + 1.1); heartbeat(SCA[1] + 1.9)
    for i in range(6): tick(SCA[1] + (.15 + i * .14) * K[1], .04)
    boom(SCA[1] + 1.9 * K[1], .4)
    tv = SCA[1] + 3.4; acc = .5
    while tv < SCB[1] - .5: tick(tv, .07); tv += acc; acc = max(.22, acc * .8)
    noise_burst(SCA[2], .3, .09)
    drone(SCA[2], SCB[2] - 1.02 * K[2], .035)
    riser(SCB[2] - 1.02 * K[2] - 1.15, 1.15, .15)
    boom(SCB[2] - 1.02 * K[2], .55)
    noise_burst(SCA[3], .5, .1)
    drone(SCA[3], SCB[3], .04)
    ding(SCA[3] + 1.3 * K[3] * .6)
    ding(SCA[3] + 4.4 * K[3])
    noise_burst(SCA[3] + 6.0 * K[3], .5, .05)
    for i in range(5): tick(SCA[4] + (0.7 + i * .3) * K[4], .055)
    noise_burst(SCA[4] + 2.6 * K[4], .4, .08)
    ding(SCA[4] + 3.6 * K[4])
    land = SCA[4] + 3.3 * K[4] + 1.9
    boom(land, .42); sparkle(land + .05)
    padm(SCA[5] + .2, DUR + .3)
    boom(SCA[5] + 1.2 * K[5], .4); sparkle(SCA[5] + 1.26 * K[5])
    sfx_i = np.int16(np.clip(sfx / max(1e-6, np.max(np.abs(sfx))) * .9, -1, 1) * 32767)
    with wave.open(SFXWAV, 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(sfx_i.tobytes())
    print('SFX-DONE', flush=True)

if __name__ == '__main__':
    which = sys.argv[1] if len(sys.argv) > 1 else 'sfx'
    if which in ('all', 'sfx'): build_sfx()
    if which in ('all', 'frames'): render()
    print('ALL-DONE', flush=True)
