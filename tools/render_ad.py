#!/usr/bin/env python3
# STUDY 30s Ad — offline 1080x1920 renderer (Pillow + HarfBuzz + FreeType + numpy)
# Mirrors ad/index.html timeline; writes PNG frames + synthesized SFX wav.
import os, math, wave, random, subprocess, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import uharfbuzz as hb
import freetype as FT

random.seed(7); np.random.seed(7)

W, H = 1080, 1920            # output px (2x of 540x960 design space)
FPS = 30
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
A = os.path.join(ROOT, 'ad', 'assets')
OUT = '/tmp/adf'; os.makedirs(OUT, exist_ok=True)
SFXWAV = '/tmp/ad_sfx.wav'

# ---------- timing ----------
from mutagen.mp3 import MP3
VO = os.path.join(A, 'vo.mp3')
VOD = MP3(VO).info.length
RATE = 1.12
DUR = VOD / RATE + 1.1
NFR = int(DUR * FPS)
SC = [(0, .10), (.10, .233), (.233, .40), (.40, .667), (.667, .867), (.867, 1.0)]
SCA = [a * DUR for a, b in SC]; SCB = [b * DUR for a, b in SC]
BASE = [3.0, 4.0, 5.0, 8.0, 6.0, 4.0]
K = [(SCB[i] - SCA[i]) / BASE[i] for i in range(6)]

# ---------- fonts / text engine ----------
FDIR = '/tmp/fonts/package'
F_PATHS = {
    'b800': f'{FDIR}/800ExtraBold/Baloo2_800ExtraBold.ttf',
    'b700': f'{FDIR}/700Bold/Baloo2_700Bold.ttf',
    'm700': f'{FDIR}/700Bold/Mukta_700Bold.ttf',
    'm400': f'{FDIR}/400Regular/Mukta_400Regular.ttf',
}
FTF = {}; HBF = {}; UPEM = {}
for k, p in F_PATHS.items():
    dat = open(p, 'rb').read()
    face = hb.Face(dat); f = hb.Font(face); f.scale = (face.upem, face.upem)
    HBF[k] = f; UPEM[k] = face.upem
    FTF[k] = FT.Face(p)

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
    img = Image.new('RGBA', (wdt, hgt), (0, 0, 0, 0))
    arr = np.array(img)
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

ALPHA_CACHE = {}
def paste_alpha(dst, tile, x, y, alpha=1.0):
    if alpha <= 0 or tile is None: return
    if alpha < 1.0:
        q = max(1, min(10, int(alpha * 10 + .5)))
        tk = (id(tile), q)
        if tk not in ALPHA_CACHE:
            t2 = tile.copy()
            a = np.array(t2); a[..., 3] = (a[..., 3].astype(np.float32) * q / 10).astype(np.uint8)
            ALPHA_CACHE[tk] = Image.fromarray(a)
        tile = ALPHA_CACHE[tk]
    dst.paste(tile, (int(x), int(y)), tile)

# ---------- easing ----------
def eob(u):  # ease out back
    c1 = 1.45; c3 = c1 + 1
    return 1 + c3 * pow(u - 1, 3) + c1 * pow(u - 1, 2)
def eo(u): return 1 - pow(1 - u, 3)                     # ease out cubic
def eoe(u): return 1 if u >= 1 else 1 - pow(2, -10 * u)  # ease out expo
def cl(u, a=0, b=1): return min(b, max(a, u))

# ---------- assets ----------
def cover(im, scale=1.0, dy=0):
    w0, h0 = im.size; s = max(W / w0, H / h0) * scale
    im2 = im.resize((int(w0 * s), int(h0 * s)), Image.LANCZOS)
    x = (im2.width - W) // 2; y = (im2.height - H) // 2 + int(dy * 2)
    return im2.crop((x, y, x + W, y + H))
IMG_CHAOS = Image.open(f'{A}/scene-chaos.jpg').convert('RGB')
IMG_TRANS = Image.open(f'{A}/scene-transform.jpg').convert('RGB')

def vgrad(c1, c2):
    ar = np.zeros((H, W, 3), np.uint8)
    for y in range(H):
        u = y / (H - 1); ar[y, :] = [int(c1[i] + (c2[i] - c1[i]) * u) for i in range(3)]
    return Image.fromarray(ar, 'RGB')

def rglow(cx, cy, rad, color, amax):
    yy, xx = np.mgrid[0:H, 0:W]
    d = np.sqrt(((xx - cx) * .55) ** 2 / 1 + (yy - cy) ** 2) / rad
    g = np.clip(1 - d, 0, 1) ** 2 * amax
    m = Image.new('RGBA', (W, H), color + (0,))
    m.putalpha(Image.fromarray(g.astype(np.uint8), 'L'))
    return m

BG2 = vgrad((6, 11, 22), (18, 10, 20))
BG3base = vgrad((10, 18, 32), (5, 8, 15))
BG4 = vgrad((8, 16, 31), (13, 21, 38))
BG5 = vgrad((8, 16, 31), (10, 18, 36))
GLOW4 = rglow(W / 2, H * 1.12, H * .62, (255, 122, 20), 42)
GLOW5 = rglow(W / 2, -H * .06, H * .5, (25, 211, 197), 26)
GLOW3 = rglow(W / 2, H * .42, H * .5, (24, 48, 92), 90)
RED2 = rglow(W / 2, H * 1.15, H * .6, (255, 45, 60), 82)

yy, xx = np.mgrid[0:H, 0:W]
vd = np.sqrt(((xx - W / 2) / (W * .75)) ** 2 + ((yy - H * .44) / (H * .62)) ** 2)
VIG_A = (np.clip(vd - .55, 0, 1) / .45 * 158).astype(np.uint8)
VIG = Image.new('RGBA', (W, H), (2, 5, 12, 0)); VIG.putalpha(Image.fromarray(VIG_A, 'L'))

GR_TILES = [np.random.randint(0, 24, (480, 270), np.uint8) for _ in range(4)]
def grain(img, idx):
    g = GR_TILES[idx % 4]
    gm = Image.fromarray(g, 'L').resize((W, H), Image.NEAREST)
    lay = Image.new('RGBA', (W, H), (255, 255, 255, 0)); lay.putalpha(gm.point(lambda v: v * .3))
    return Image.alpha_composite(img, lay)

# ---------- helpers ----------
def rrect(d, box, r, fill):
    d.rounded_rectangle(box, radius=r, fill=fill)

def chip(img, text, x, y, size, wgt, fg, bg, border, pad=(18, 12), br=20, alpha=1.0, anchor='la'):
    t = text_tile(text, size, wgt, fg)
    w, h = t.width + pad[0] * 2, t.height + pad[1] * 2
    lay = Image.new('RGBA', (w + 4, h + 4), (0, 0, 0, 0))
    dd = ImageDraw.Draw(lay)
    rrect(dd, (2, 2, w + 2, h + 2), br, bg)
    if border:
        dd.rounded_rectangle((2, 2, w + 2, h + 2), radius=br, outline=border, width=2)
    lay.paste(t, (pad[0] + 2, pad[1] + 2 - 4), t)
    if anchor == 'mm': x, y = x - w / 2, y - h / 2
    paste_alpha(img, lay, x, y, alpha)
    return w, h

def ctext(img, text, size, y, wgt='b800', color=(255, 255, 255), alpha=1.0, x=W / 2):
    t = text_tile(text, size, wgt, color)
    paste_alpha(img, t, x - t.width / 2, y - t.height / 2, alpha)
    return t

_dark = (6, 9, 18)
def words_kin(img, text, size, y, t_in, tl, wgt='b800', hl=(), hlc=(255, 165, 60), stagger=.09, dur=.5, rise=40, x=W / 2, per_glyph=False, shadow=False):
    ws = text.split(' ')
    units = []
    for wword in ws:
        clean = wword.strip('…।!?.,\'"‘’')
        col = hlc if clean in hl else (255, 255, 255)
        for u_word in (list(_graphemes(wword)) if per_glyph else [wword]):
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
        if shadow:
            paste_alpha(img, dk, px + 5, y - t.height / 2 + dy + 7, a * .55)
        paste_alpha(img, t, px, y - t.height / 2 + dy, a)
        px += t.width + gap

import unicodedata
def _graphemes(s):
    out, cur = [], ''
    for ch in s:
        cat = unicodedata.category(ch)
        if not cur:
            cur = ch
        elif cat in ('Mn', 'Mc') or ch == '्' or cur.endswith('्'):
            cur += ch
        else:
            out.append(cur); cur = ch
    if cur: out.append(cur)
    return out
def _is_word_end(text, tiles, i):
    return True  # spacing handled by uniform small gap; safe default

def paste_rot(img, tile, x, y, ang, alpha=1.0):
    q = int(ang % 360 / 15) * 15
    RK = (id(tile), q)
    if RK not in ALPHA_CACHE:
        ALPHA_CACHE[RK] = tile.rotate(-q, expand=True, resample=Image.BICUBIC)
    r = ALPHA_CACHE[RK]
    paste_alpha(img, r, x - r.width / 2, y - r.height / 2, alpha)

# ---------- particles (precomputed per frame) ----------
GLY = [g for g in '∑π√∞%θ÷×+=∫Δ' if FTF['b700'].get_char_index(ord(g)) != 0] or ['+', '=', '%', 'x']
def cov_ok(s, wgt='b700'): return all(FTF[wgt].get_char_index(ord(c)) != 0 or c == ' ' for c in s)
class P:
    pass
parts = []
for i in range(26):
    p = P(); p.s = 28 + random.random() * 52; p.g = GLY[i % len(GLY)]
    p.x0 = random.random() * 540; p.y0 = -40 - random.random() * 300
    p.vy = 90 + random.random() * 160; p.vx = (random.random() - .5) * 40
    p.rot = random.random() * 360; p.vr = (random.random() - .5) * 140
    p.ang = random.random() * math.pi * 2; p.rad = 120 + random.random() * 420
    p.al = .35 + random.random() * .45
    parts.append(p)
dust = []
for i in range(46):
    p = P(); p.x0 = random.random() * 540; p.y0 = random.random() * 960
    p.vy = 13 + random.random() * 20; p.s = 1.5 + random.random() * 3; p.al = .12 + random.random() * .2
    dust.append(p)
S2A, S2B = SCA[1], SCB[1]; S3A, S3B = SCA[2], SCB[2]
PT = {}  # frameIndex -> list[(glyph,size,x540,y540,rot,alpha)]
for f in range(NFR):
    tg = f / FPS
    if S2A <= tg < S3B:
        rel = tg - S2A; lst = []
        mode_freeze = tg >= S3A
        fr = tg - S3A
        for p in parts:
            if mode_freeze:
                t_pass = S2B - S2A
                x = (p.x0 + p.vx * t_pass + math.sin((p.y0 + p.vy * t_pass) * .01) * 30 * t_pass % 60) % 540
                y = (p.y0 + p.vy * t_pass) % 1140 - 90
                x2 = x; y2 = y
            else:
                y = (p.y0 + p.vy * rel) % 1140 - 90
                x = (p.x0 + p.vx * rel + math.sin((p.y0 + p.vy * rel) * .01) * 30) % 540
                x2, y2 = x, y
            p._fx, p._fy, p._fr = x2, y2, p.rot + p.vr * rel
            if fr > 0:
                sp_t = fr - (0.6 * K[2])
                if sp_t > 0:
                    if sp_t < (S3B - S3A) - 1.02 * K[2] - 0.6 * K[2]:
                        ang = p.ang + sp_t * 2.6
                        rad = max(14, p.rad * math.exp(-1.9 * sp_t))
                        xx2 = 270 + math.cos(ang) * rad; yy2 = 430 + math.sin(ang) * rad * .72
                        lst.append((p.g, p.s, xx2, yy2, ang * 57.3 + 90, p.al))
                    else:
                        bt = sp_t - ((S3B - S3A) - 1.02 * K[2] - 0.6 * K[2])
                        ang = p.ang + sp_t * .7
                        rad = p.rad + bt * (p.rad * 3.2 + 380)
                        al = max(0, p.al * (1 - 1.4 * bt))
                        xx2 = 270 + math.cos(ang) * rad; yy2 = 430 + math.sin(ang) * rad * .72
                        if al > 0.02: lst.append((p.g, p.s, xx2, yy2, ang, al))
                    continue
            if not mode_freeze:
                lst.append((p.g, p.s, x2, y2, p._fr, p.al))
            else:
                lst.append((p.g, p.s, x2, y2, p._fr, p.al * .55))
        PT[f] = lst

# ---------- camera events ----------
PUNCHES = [(SCA[0] + 1.81, .07), (SCA[1] + 2.18 * K[1], .04), (SCA[1] + 3.52 * K[1], .05),
           (SCB[2] - 1.02 * K[2], .09), (SCA[4] + (3.62 + 1.9) * K[4], .07), (SCA[5] + 1.25 * K[5], .05),
           (SCA[5] + 1.18 * K[5], .06)]
FLASHES = [(SCA[0] + 1.81, .30), (SCA[2], .22), (SCB[2] - 1.02 * K[2], .75),
           (SCA[4] + (3.62 + 1.9) * K[4] + .05, .28), (SCA[5] + 1.25 * K[5] + .05, .22)]

def cam(tg):
    z = 1.0
    for t0, pk in PUNCHES:
        if tg >= t0:
            z += pk * math.exp(-(tg - t0) * 6)
    shx = shy = 0
    amp = 0
    if SCA[0] <= tg < SCB[0]: amp = (0.5 + (tg - SCA[0]) / BASE[0] * .6) * 2
    elif SCA[1] <= tg < SCB[1]:
        u = (tg - SCA[1]) / (SCB[1] - SCA[1]); amp = (1.2 + u * 1.4) * 2
    elif SCA[2] <= tg < SCB[2]:
        dt_slam = tg - (SCB[2] - 1.02 * K[2])
        if 0 < dt_slam < .45: amp = 5.5 * 2 * (1 - dt_slam / .45)
    n = tg * 7
    if amp:
        shx = amp * (math.sin(n * 2.3) * .6 + math.sin(n * 5.1) * .4)
        shy = amp * (math.cos(n * 1.9) * .6 + math.sin(n * 4.3) * .4)
    return z, shx, shy

def flash_at(tg):
    o = 0
    for t0, pk in FLASHES:
        if 0 <= tg - t0 < .18:
            o = max(o, pk * (1 - (tg - t0) / .18))
    return o

# ---------- scenes ----------
NOTIF = [('maths_FINAL_(2).pdf', 38, 150, -3), ('tricks_NEW_2025.mp4', 290, 140, 4.5),
         ('Telegram: 2,304 unread', 60, 330, -7.5), ('booklist_47.xlsx', 310, 330, 6),
         ('PYQ_last_LAST_v9.pdf', 38, 500, -9), ('plan kab bana??', 300, 480, 7.5)]
notif_tiles = None

def scene1(img, u, tl):
    im = cover(IMG_CHAOS, 1.02 + .11 * u, 6 - 16 * u)
    img.paste(im, (0, 0))
    img.alpha_composite(Image.new('RGBA', (W, H), (4, 8, 18, 105)))
    d = ImageDraw.Draw(img)
    # alarm chip flicker
    fl = 1 if (tl * 10) % 2.6 < 1.8 or (tl * 10) % 7 < 5.2 else .55
    chip(img, '4:58 AM', (30 + 8) * 2, (52 + 8) * 2, 48, 'b800', (255, 215, 160), (10, 6, 2, 150), (255, 170, 80, 90), alpha=fl)
    global notif_tiles
    if notif_tiles is None:
        notif_tiles = []
        for txt, x, y, rot in NOTIF:
            t = text_tile(txt, 30, 'm700', (223, 232, 255))
            w, h = t.width + 44, t.height + 32
            lay = Image.new('RGBA', (w + 1300, h + 60), (0, 0, 0, 0))  # room for fall anim crop
            card = Image.new('RGBA', (w + 8, h + 8), (0, 0, 0, 0))
            dd = ImageDraw.Draw(card)
            rrect(dd, (4, 14, w, h), 24, (14, 22, 40, 220))
            dd.rounded_rectangle((4, 14, w, h), radius=24, outline=(120, 150, 220, 70), width=2)
            card.paste(t, (26, 20), t)
            card = card.rotate(-rot, expand=True, resample=Image.BICUBIC)
            notif_tiles.append((card, x * 2, y * 2))
    for i, (card, x, y) in enumerate(notif_tiles):
        t0 = .12 + i * .14
        uu = cl((tl - t0) / .52)
        if uu <= 0: continue
        a = cl(uu * 1.7); dy = (1 - eob(uu)) * -680
        paste_alpha(img, card, x, y + dy, a)
    words_kin(img, '3 साल से…', 84, H * .62, .85, tl, per_glyph=True, stagger=.07, rise=-60, shadow=True)
    slam = cl((tl - 1.8) / .42)
    if slam > 0:
        t2 = text_tile("'कल से' पढ़ूंगा?", 128, 'b800', (255, 255, 255))
        s = 2.4 - 1.4 * eob(cl(slam))
        t2s = t2.resize((int(t2.width * s), int(t2.height * s)), Image.LANCZOS)
        dk = text_tile("'कल से' पढ़ूंगा?", 128, 'b800', _dark).resize(t2s.size, Image.BILINEAR)
        paste_alpha(img, dk, W / 2 - dk.width / 2 + 6, H * .72 - dk.height / 2 + 9, cl(slam * 2) * .6)
        paste_alpha(img, t2s, W / 2 - t2s.width / 2, H * .72 - t2s.height / 2, cl(slam * 2))
        th = text_tile("'कल से'", 128, 'b800', (255, 150, 50))
        if slam >= .98:
            paste_alpha(img, th, W / 2 - t2.width / 2 + 6, H * .72 - t2.height / 2, 1)
    return

CHIPS2 = ['syllabus.pdf ×31', '190 घंटे की playlist', 'notes_FINAL.docx', 'कौन सा batch?', 'mock_43_pending', 'revision?? kab??']
def scene2(img, u, tl):
    img.paste(BG2, (0, 0))
    paste_alpha(img, RED2, 0, 0, u)
    d = ImageDraw.Draw(img)
    if (S2A + tl) < NFR and (int((S2A + tl) * FPS) in PT):
        for g, s, x, y, r, a in PT[int((S2A + tl) * FPS)]:
            t = text_tile(g, int(s * 2), 'b700', (210, 225, 250))
            paste_rot(img, t, x * 2, y * 2, r, a * .9)
    for i, c in enumerate(CHIPS2):
        t0 = i * .16 * K[1]; uu = cl((tl - t0) / .38)
        if uu <= 0: continue
        dx = (1 - eob(uu)) * -120
        chip(img, c, (30 + (i * 53) % 300 + 40) * 2 + dx, (120 + i * 72) * 2, 32, 'm700', (191, 224, 255), (10, 18, 34, 230), (90, 140, 230, 80), br=999, alpha=cl(uu * 1.6))
    if tl < 2.0 * K[1]:
        uu = cl((tl - .35) / .5)
        big = text_tile('क्या पढ़ूं?', 116, 'b800', (255, 255, 255))
        s = 1 + (1 - eob(uu)) * .5
        if tl > 2.0 * K[1] - .17: s = 1 + (2.0 * K[1] - tl) * .7; a = cl((2.0 * K[1] - tl) / .17)
        else: a = cl(uu * 1.8)
        big2 = big.resize((int(big.width * s), int(big.height * s)), Image.BILINEAR)
        paste_alpha(img, big2, W / 2 - big2.width / 2, H * .4 - big2.height / 2, a)
    elif tl < 3.35 * K[1]:
        uu = cl((tl - 2.18 * K[1]) / .45)
        big = text_tile('कब पढ़ूं?', 126, 'b800', (255, 230, 235))
        s = 1 + (1 - eob(uu)) * .5
        big2 = big.resize((int(big.width * s), int(big.height * s)), Image.BILINEAR)
        paste_alpha(img, big2, W / 2 - big2.width / 2, H * .42 - big2.height / 2, cl(uu * 1.8))
    else:
        uu = cl((tl - 3.52 * K[1]) / .45)
        ctext(img, 'कितना बचा है??', 96, H * .44, color=(255, 176, 184), alpha=cl(uu * 1.8))

def scene3(img, u, tl):
    img.paste(BG3base, (0, 0))
    img.paste(GLOW3, (0, 0), GLOW3)
    d = ImageDraw.Draw(img)
    fi = int((S3A + tl) * FPS)
    if fi in PT:
        for g, s, x, y, r, a in PT[fi]:
            t = text_tile(g, int(s * 2), 'b700', (214, 228, 255))
            paste_rot(img, t, x * 2, y * 2, r, a)
    if tl > .5:
        ctext(img, '· ' + '  '.join(GLY[:7]) + ' ·', 40, H * .30, wgt='m700', color=(95, 123, 176), alpha=cl((tl - .5) / .6) * .9)
    words_kin(img, 'Problem मेहनत नहीं है.', 92, H * .46, 2.5 * K[2], tl, hl=('नहीं',), stagger=.16 * K[2], dur=.55)
    slamT = (S3B - S3A) - 1.02 * K[2]
    if tl >= slamT:
        uu = cl((tl - slamT) / .3)
        txt = 'PLAN है.'
        big = text_tile(txt, 184, 'b800', (255, 150, 40))
        s = 3.4 - 2.4 * eob(uu)
        b2 = big.resize((max(4, int(big.width * s)), max(4, int(big.height * s))), Image.BILINEAR)
        dk = text_tile(txt, 184, 'b800', _dark).resize(b2.size, Image.BILINEAR)
        cx, cy = W / 2, H * .60
        paste_alpha(img, dk, cx - dk.width / 2 + 7, cy - dk.height / 2 + 10, cl(uu * 3) * .6)
        if 0 < tl - slamT < .38:  # glitch rgb
            rt = text_tile(txt, 184, 'b800', (255, 51, 85)).resize(b2.size, Image.BILINEAR)
            paste_alpha(img, rt, cx - rt.width / 2 - 16, cy - rt.height / 2 + 6, .75)
            bt = text_tile(txt, 184, 'b800', (51, 204, 255)).resize(b2.size, Image.BILINEAR)
            paste_alpha(img, bt, cx - bt.width / 2 + 16, cy - bt.height / 2 - 6, .75)
        paste_alpha(img, b2, cx - b2.width / 2, cy - b2.height / 2, cl(uu * 3))

DREV = set(range(1, 61, 7))
def scene4(img, u, tl):
    img.paste(BG4, (0, 0)); img.paste(GLOW4, (0, 0), GLOW4)
    d = ImageDraw.Draw(img)
    for p in dust:
        yy2 = (p.y0 - p.vy * .5 * (SCA[3] + tl)) % 990
        xx2 = (p.x0 + math.sin(yy2 * .008) * 8) % 540
        d.ellipse((xx2 * 2 - p.s * 2, yy2 * 2 - p.s * 2, xx2 * 2 + p.s * 2, yy2 * 2 + p.s * 2), fill=(255, 190, 110, int(180 * p.al)))
    # logo chip
    uu = cl(tl / .48)
    if uu > 0:
        t = text_tile('S  STUDY', 52, 'b800', (234, 241, 255))
        w, h = t.width + 56, t.height + 32
        lay = Image.new('RGBA', (w + 10, h + 10), (0, 0, 0, 0)); dd = ImageDraw.Draw(lay)
        rrect(dd, (5, 5, w + 5, h + 5), 999, (255, 255, 255, 16))
        dd.rounded_rectangle((5, 5, w + 5, h + 5), radius=999, outline=(255, 255, 255, 40), width=2)
        lay.paste(t, (28 + 5, 16 + 5 - 4), t)
        s = .5 + .5 * eob(uu); l2 = lay.resize((int(lay.width * s), int(lay.height * s)), Image.BILINEAR)
        paste_alpha(img, l2, W / 2 - l2.width / 2, (66 + 8) * 2 + (1 - eob(uu)) * -40, cl(uu * 1.6))
    words_kin(img, 'Day 1 से Day 60 — हर दिन तय', 54, (66 + 120) * 2, .35 * K[3], tl, wgt='b700', hl=('60',), stagger=.09 * K[3])
    # day grid
    t0g = .9 * K[3]
    cols, rows = 10, 6; gw = 940; gap = 12; cw = (gw - gap * (cols - 1)) / cols
    gx = (W - gw) / 2; gy = (66 + 190) * 2
    for i in range(60):
        r, c = divmod(i, cols)
        lit_u = cl((tl - (t0g + i * .042 * K[3])) / .26)
        x0 = gx + c * (cw + gap); y0 = gy + r * (cw + gap)
        if lit_u <= 0:
            rrect(d, (x0, y0, x0 + cw, y0 + cw), 14, (120, 150, 220, 26))
        else:
            pop = 1 + .18 * math.sin(min(lit_u, 1) * math.pi)
            ex = (pop - 1) * cw / 2
            col = (25, 211, 197, 235) if (i + 1) in DREV else (255, 140, 40, 235)
            rrect(d, (x0 - ex, y0 - ex, x0 + cw + ex, y0 + cw + ex), 14, col)
            tt = text_tile(str(i + 1), 30, 'm700', (20, 10, 0) if (i + 1) not in DREV else (0, 40, 42))
            paste_alpha(img, tt, x0 + cw / 2 - tt.width / 2, y0 + cw / 2 - tt.height / 2, lit_u)
    # topic card
    tc_t = 3.8 * K[3]; uu = cl((tl - tc_t) / .6)
    if uu > 0:
        cw2, ch2 = 936, 560; x0 = (1080 - cw2) / 2; y0 = 1920 - 88 - ch2 + (1 - eob(uu)) * 240
        lay = Image.new('RGBA', (cw2, ch2), (0, 0, 0, 0)); dd = ImageDraw.Draw(lay)
        rrect(dd, (0, 0, cw2, ch2), 40, (13, 21, 40, 240))
        dd.rounded_rectangle((0, 0, cw2, ch2), radius=40, outline=(140, 170, 255, 60), width=3)
        paste_alpha(img, lay, x0, y0, cl(uu * 1.5))
        if uu > .5:
            title = text_tile('संख्या पद्धति', 56, 'b800', (255, 255, 255))
            paste_alpha(img, title, x0 + 36, y0 + 26, cl((tl - tc_t - .3) / .3))
            subs = ['वर्ग-घन', 'भाज्यता', 'इकाई अंक', 'शेषफल', 'अप्रोक्स.']
            sx = x0 + 36
            for j, s2 in enumerate(subs):
                au = cl((tl - (tc_t + .8 * K[3] + j * .18 * K[3])) / .3)
                wch, _ = chip(img, s2, sx, y0 + 112, 30, 'm700', (207, 224, 255), (80, 120, 220, 45), (120, 160, 255, 90), pad=(22, 12), br=999, alpha=au)
                sx += wch + 14
            con = text_tile('इकाई अंक निकालना — Concept', 40, 'b800', (255, 255, 255))
            paste_alpha(img, con, x0 + 36, y0 + 190, cl((tl - tc_t - 1.1) / .3))
            a1 = cl((tl - tc_t - 1.95 * K[3] + .0) / .32); a2 = cl((tl - tc_t - 2.25 * K[3]) / .32)
            chip(img, 'Shortcut Trick', x0 + 36, y0 + 268, 30, 'm700', (255, 230, 196), (255, 150, 40, 40), (255, 150, 40, 100), br=18, alpha=a1)
            chip(img, 'Common Trap', x0 + 36 + 300, y0 + 268, 30, 'm700', (255, 210, 214), (255, 60, 80, 35), (255, 60, 80, 100), br=18, alpha=a2)
            ab = cl((tl - tc_t - 2.65 * K[3]) / .32)
            if ab > 0:
                pul = 1 + .05 * math.sin((tl - tc_t - 2.65 * K[3]) * math.pi * 2 / 1.15)
                bt = text_tile('इस Concept के असली PYQ »', 34, 'b800', (21, 10, 0))
                bw, bh = bt.width + 60, bt.height + 36
                blay = Image.new('RGBA', (bw + 8, bh + 8), (0, 0, 0, 0)); bd = ImageDraw.Draw(blay)
                rrect(bd, (4, 4, bw + 4, bh + 4), 26, (255, 152, 40, 255))
                blay.paste(bt, (34, 22), bt)
                bl2 = blay.resize((int(blay.width * pul), int(blay.height * pul)), Image.BILINEAR)
                paste_alpha(img, bl2, x0 + 36, y0 + 370, ab)

FILT = [('अध्याय', 'प्रतिशत'), ('Concept', 'बट्टा / छूट'), ('Exam', 'SSC CGL'), ('Year', '2023'), ('Shift', 'Shift 2')]
def scene5(img, u, tl):
    img.paste(BG5, (0, 0)); img.paste(GLOW5, (0, 0), GLOW5)
    d = ImageDraw.Draw(img)
    for p in dust:
        yy2 = (p.y0 - p.vy * .4 * (SCA[4] + tl)) % 990
        xx2 = (p.x0 + math.sin(yy2 * .008) * 8) % 540
        d.ellipse((xx2 * 2 - 3, yy2 * 2 - 3, xx2 * 2 + 3, yy2 * 2 + 3), fill=(255, 190, 110, 40))
    words_kin(img, 'हर concept के साथ — असली PYQ', 54, 120, .15 * K[4], tl, wgt='b700', hl=('PYQ',), stagger=.07 * K[4])
    for i, (k2, v) in enumerate(FILT):
        uu = cl((tl - (0.6 * K[4] + i * .26 * K[4])) / .34)
        if uu <= 0: continue
        dx = (1 - eob(uu)) * 180
        ktile = text_tile(k2, 30, 'm700', (143, 165, 216))
        paste_alpha(img, ktile, 80 + dx, (120 + i * 48) * 2 - 14, cl(uu * 1.6))
        vtile = text_tile(v, 32, 'b800', (16, 27, 51))
        vw, vh = vtile.width + 44, vtile.height + 26
        lay = Image.new('RGBA', (vw + 6, vh + 6), (0, 0, 0, 0)); dd = ImageDraw.Draw(lay)
        rrect(dd, (3, 3, vw + 3, vh + 3), 20, (255, 195, 110, 255))
        lay.paste(vtile, (25, 10), vtile)
        paste_alpha(img, lay, 80 + ktile.width + 16 + dx, (120 + i * 48) * 2 - vh / 2 - 8, cl(uu * 1.6))
    q_t = 2.3 * K[4]; uu = cl((tl - q_t) / .52)
    if uu > 0:
        cw2, ch2 = 940, 420; x0 = (W - cw2) / 2; y0 = 400 * 2 + (1 - eob(uu)) * 180
        lay = Image.new('RGBA', (cw2, ch2), (0, 0, 0, 0)); dd = ImageDraw.Draw(lay)
        rrect(dd, (0, 0, cw2, ch2), 40, (13, 21, 40, 245))
        dd.rounded_rectangle((0, 0, cw2, ch2), radius=40, outline=(140, 170, 255, 60), width=3)
        paste_alpha(img, lay, x0, y0, cl(uu * 1.6))
        if uu > .4:
            chip(img, 'SSC CGL · 2023 · Shift 2', x0 + 34, y0 + 30, 28, 'm700', (191, 233, 255), (25, 140, 211, 50), (25, 150, 211, 110), br=16)
            q = text_tile('किसी संख्या का 45% = 900 है, तो उसका 65% कितना?', 36, 'm700', (238, 243, 255))
            paste_alpha(img, q, x0 + 34, y0 + 112, 1)
            opts = ['1200', '1300', '1400', '1500']
            ok_u = cl((tl - 3.4 * K[4]) / .3)
            ow = (cw2 - 68 - 3 * 16) / 4
            for j, o in enumerate(opts):
                ox = x0 + 34 + j * (ow + 16); oy = y0 + 200
                okk = (j == 1)
                if okk and ok_u > 0:
                    pop = 1 + .1 * math.sin(min(ok_u, 1) * math.pi)
                    ex = (pop - 1) * ow / 2
                    rrect(d, (ox - ex, oy - ex, ox + ow + ex, oy + 84 + ex), 20, (35, 190, 115, 255))
                    ot = text_tile(o, 34, 'b800', (3, 37, 15))
                else:
                    rrect(d, (ox, oy, ox + ow, oy + 84), 20, (90, 130, 230, 38))
                    d.rounded_rectangle((ox, oy, ox + ow, oy + 84), radius=20, outline=(120, 160, 255, 70), width=2)
                    ot = text_tile(o, 34, 'b800', (207, 224, 255))
                paste_alpha(img, ot, ox + ow / 2 - ot.width / 2, oy + 42 - ot.height / 2, 1)
    c_t = 3.62 * K[4]
    if tl > c_t:
        cu = cl((tl - c_t) / 1.9)
        val = int(round(eoe(cu) * 37061))
        s = f'{val:,}'
        big = text_tile(s, 148, 'b800', (255, 140, 40))
        pul = 1 + (.1 * math.exp(-(tl - (c_t + 1.9)) * 5) if cu >= 1 else 0)
        b2 = big.resize((int(big.width * pul), int(big.height * pul)), Image.BILINEAR)
        paste_alpha(img, b2, W / 2 - b2.width / 2, H * .76 - b2.height / 2, cl(cu * 4))
        if cu >= 1:
            ctext(img, 'असली PYQ', 56, H * .84, alpha=cl((tl - c_t - 1.9) / .3))
            ctext(img, 'exam · साल · shift — हर सवाल के साथ', 32, H * .885, wgt='m700', color=(147, 163, 196), alpha=cl((tl - c_t - 2.15) / .3))

def scene6(img, u, tl):
    im = cover(IMG_TRANS, 1.12 - .12 * u, 0)
    img.paste(im, (0, 0))
    wash = Image.new('RGBA', (W, H), (255, 140, 40, 0))
    wa = np.array(wash); alpha_grad = np.linspace(20, 110, H, dtype=np.uint8)[:, None].repeat(W, 1)
    wa[..., 3] = (alpha_grad * cl(tl / 1.6)).astype(np.uint8)
    img.paste(Image.fromarray(wa), (0, 0), Image.fromarray(wa))
    d = ImageDraw.Draw(img)
    for p in dust[:22]:
        yy2 = (p.y0 - p.vy * .4 * (SCA[5] + tl)) % 990
        d.ellipse((p.x0 * 2 - 3, yy2 * 2 - 3, p.x0 * 2 + 3, yy2 * 2 + 3), fill=(255, 200, 120, 60))
    st_t = 1.25 * K[5]; uu = cl((tl - st_t) / .34)
    if uu > 0:
        st = text_tile('DAY 60', 68, 'b800', (28, 232, 110))
        lay = Image.new('RGBA', (st.width + 120, st.height + 40), (0, 0, 0, 0)); dd = ImageDraw.Draw(lay)
        rrect(dd, (2, 2, lay.width - 2, lay.height - 2), 28, (2, 20, 8, 110))
        dd.rounded_rectangle((2, 2, lay.width - 2, lay.height - 2), radius=28, outline=(28, 232, 110, 255), width=10)
        chk_x = st.width + 92; chk_y = 20 + st.height // 2
        dd.line((chk_x - 22, chk_y, chk_x - 6, chk_y + 18), fill=(28, 232, 110, 255), width=12)
        dd.line((chk_x - 6, chk_y + 18, chk_x + 34, chk_y - 22), fill=(28, 232, 110, 255), width=12)
        lay.paste(st, (30, 16), st)
        lay = lay.rotate(8, expand=True, resample=Image.BICUBIC)
        s = 2.4 - 1.4 * eob(uu)
        l2 = lay.resize((int(lay.width * s), int(lay.height * s)), Image.BILINEAR)
        paste_alpha(img, l2, W / 2 - l2.width / 2, H * .21 - l2.height / 2, cl(uu * 2))
    words_kin(img, 'Selection लॉटरी नहीं.', 88, H * .36, .35 * K[5], tl, hl=('नहीं',), stagger=.08 * K[5], shadow=True)
    sl2 = cl((tl - 1.15 * K[5]) / .4)
    if sl2 > 0:
        t2 = text_tile('PROCESS है.', 120, 'b800', (255, 150, 50))
        s = 1.6 - .6 * eob(sl2)
        t2s = t2.resize((int(t2.width * s), int(t2.height * s)), Image.BILINEAR)
        dk = text_tile('PROCESS है.', 120, 'b800', _dark).resize(t2s.size, Image.BILINEAR)
        paste_alpha(img, dk, W / 2 - dk.width / 2 + 6, H * .46 - dk.height / 2 + 9, cl(sl2 * 2) * .65)
        paste_alpha(img, t2s, W / 2 - t2s.width / 2, H * .46 - t2s.height / 2, cl(sl2 * 2))
    # end card
    ec = cl((tl - 2.2 * K[5]) / .4)
    if ec > 0:
        gr = Image.new('RGBA', (W, H), (0, 0, 0, 0)); ga = np.array(gr)
        ga[..., 3] = (np.clip((yy / H - .45) / .55, 0, 1) * 235 * ec).astype(np.uint8)
        img.paste(Image.fromarray(ga), (0, 0), Image.fromarray(ga))
        a = lambda dt2: cl((tl - (2.2 + dt2) * K[5]) / .5)
        lt = text_tile('S', 56, 'b800', (26, 13, 0))
        lay = Image.new('RGBA', (92, 92), (0, 0, 0, 0)); dd = ImageDraw.Draw(lay)
        rrect(dd, (0, 0, 91, 91), 26, (255, 152, 40, 255))
        lay.paste(lt, (46 - lt.width // 2, 46 - lt.height // 2), lt)
        st = text_tile('STUDY', 84, 'b800', (255, 255, 255))
        tot = lay.width + 22 + st.width
        paste_alpha(img, lay, W / 2 - tot / 2, H * .66, a(0))
        paste_alpha(img, st, W / 2 - tot / 2 + lay.width + 22, H * .66 + 2, a(0))
        ctext(img, '60-Day Maths Mastery', 36, H * .66 + 150, wgt='m700', color=(201, 214, 242), alpha=a(.25))
        ac = a(.5)
        if ac > 0:
            pul = 1 + .05 * math.sin(max(0, tl - (2.7) * K[5]) * math.pi * 2 / 1.25)
            bt = text_tile('» Day 1 शुरू करो', 52, 'b800', (23, 11, 0))
            bw, bh = bt.width + 84, bt.height + 52
            bl = Image.new('RGBA', (bw, bh), (0, 0, 0, 0)); bd = ImageDraw.Draw(bl)
            rrect(bd, (0, 0, bw - 1, bh - 1), 34, (255, 152, 40, 255))
            bl.paste(bt, (42, 20), bt)
            bl2 = bl.resize((int(bl.width * pul), int(bl.height * pul)), Image.BILINEAR)
            paste_alpha(img, bl2, W / 2 - bl2.width / 2, H * .79 - bl2.height / 2, ac)
        ctext(img, 'हर दिन · एक कदम · सिलेक्शन तक', 28, H * .90, wgt='m700', color=(126, 144, 184), alpha=a(.8))

# ---------- frames ----------
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
        z, sx, sy = cam(tg)
        if abs(z - 1) > .004:
            nw, nh = int(W * z), int(H * z)
            img = img.resize((nw, nh), Image.BILINEAR).crop(((nw - W) // 2, (nh - H) // 2, (nw - W) // 2 + W, (nh - H) // 2 + H))
        if sx or sy:
            img2 = Image.new('RGBA', (W, H), (0, 0, 0, 255)); img2.paste(img, (int(sx), int(sy)))
            img = img2
        img = Image.alpha_composite(img, VIG)
        fo = flash_at(tg)
        if fo > .01: img = Image.alpha_composite(img, Image.new('RGBA', (W, H), (255, 255, 255, int(255 * fo))))
        img = grain(img, f)
        img.convert('RGB').save(f'{OUT}/{f + 1:04d}.png')
        if f % 60 == 0: print(f'frame {f}/{NFR}', flush=True)
    print('FRAMES-DONE', flush=True)

# ---------- SFX synthesis ----------
SR = 44100
NT = int(DUR * SR)
t_ax = np.arange(NT) / SR
sfx = np.zeros(NT, np.float32)

def add_env(t0, dur, sig):
    i0 = int(t0 * SR); i1 = min(NT, i0 + len(sig))
    if i1 <= i0: return
    sfx[i0:i1] += sig[:i1 - i0]

def sine_sweep(t0, dur, f0, f1, amp, attack=.01, decay=None):
    if decay is None: decay = dur * .8
    n = int(dur * SR); tt = np.arange(n) / SR
    ph = 2 * np.pi * (f0 * tt + (f1 - f0) / dur * tt ** 2 / 2)
    env = np.minimum(1, tt / attack) * np.exp(-tt / decay) * amp
    add_env(t0, dur, np.sin(ph) * env)

def noise_burst(t0, dur, amp, sweep_up=True, attack=None):
    n = int(dur * SR); tt = np.arange(n) / SR
    if attack is None: attack = dur * .45
    env = (np.minimum(1, tt / attack) * np.minimum(1, (dur - tt) / max(.05, dur * .3)))
    nz = np.random.randn(n).astype(np.float32)
    k = .02 + .5 * (tt / dur) if sweep_up else .5 - .48 * (tt / dur)
    out = np.zeros(n, np.float32); acc = 0.0
    for i in range(0, n, 64):  # cheap one-pole sweep
        blk = nz[i:i + 64]; kk = k[min(i, n - 1)]
        acc = acc * (1 - kk)
        out[i:i + 64] = acc + blk * kk
    add_env(t0, dur, out * env * amp)

def tone(t0, dur, freq, amp, shape='sine'):
    n = int(dur * SR); tt = np.arange(n) / SR
    if shape == 'saw': w = sum(np.sin(2 * np.pi * freq * (k + 1) * tt) / (k + 1) for k in range(10)) * .6
    elif shape == 'tri': w = sum(((-1) ** k) * np.sin(2 * np.pi * freq * (2 * k + 1) * tt) / (2 * k + 1) ** 2 for k in range(8))
    else: w = np.sin(2 * np.pi * freq * tt)
    env = np.exp(-tt / (dur * .4)) * np.minimum(1, tt / .01)
    add_env(t0, dur, w * env * amp)

def drone(t0, t1, amp=.10):
    i0, i1 = int(t0 * SR), min(NT, int(t1 * SR))
    n = i1 - i0
    if n <= 0: return
    tt = np.arange(n) / SR
    w = sum(np.sin(2 * np.pi * fr * (k + 1) * tt) / ((k + 1) * 2.2) for fr in (73.42, 110, 146.83) for k in range(6))
    sfx[i0:i1] += (w * amp * .5).astype(np.float32)

def pad(t0, t1, amp=.09):
    i0, i1 = int(t0 * SR), min(NT, int(t1 * SR))
    n = i1 - i0
    if n <= 0: return
    tt = np.arange(n) / SR
    w = sum(sum(((-1) ** k) * np.sin(2 * np.pi * fr * (2 * k + 1) * tt) / (2 * k + 1) ** 2 for k in range(6)) for fr in (146.83, 220, 293.66, 369.99, 440))
    sw = np.minimum(1, tt / 2.2) * min(1, (t1 - t0)) * np.clip((t1 - (tt + t0)) / 1.2, 0, 1)
    sfx[i0:i1] += (w * amp * .25 * sw).astype(np.float32)

def boom(t0, amp=.5):
    sine_sweep(t0, .9, 160, 36, amp, .012, .35)
    noise_burst(t0, .22, amp * .35, sweep_up=False)

def thump(t0, amp=.32): sine_sweep(t0, .25, 62, 40, amp, .006, .1)
def heartbeat(t0): thump(t0); thump(t0 + .17, .2)
def tick(t0, amp=.09): tone(t0, .04, 1750, amp, 'sine')
def ding(t0): tone(t0, .5, 880, .13); tone(t0 + .09, .55, 1318.5, .12)
def sparkle(t0):
    for i, fr in enumerate((1174.7, 1480, 1760, 2349.3, 2793.8)):
        tone(t0 + i * .055, .4, fr, .06)
def riser(t0, dur, amp=.14):
    n = int(dur * SR); tt = np.arange(n) / SR
    ph = 2 * np.pi * (73.42 * tt + (880 - 73.42) / dur * tt ** 2 / 2)
    sw = sum(np.sin(ph * (k + 1)) / ((k + 1) * 2) for k in range(6))
    env = (tt / dur) ** 2 * amp
    add_env(t0, dur, (sw * env * .4).astype(np.float32))
    noise_burst(t0, dur, amp * .5, sweep_up=True, attack=dur)

def build_sfx():
    # drone bed with scene-shaped gain segments
    drone(0, SCB[0], .10)
    drone(SCA[1], SCB[1], .135)
    drone(SCA[2], SCB[2] - 1.02 * K[2], .035)
    drone(SCA[3], SCB[4], .05)
    # heartbeats
    for tt in (.35, 1.25, 2.15): heartbeat(tt)
    heartbeat(SCA[1] + .3); heartbeat(SCA[1] + 3.4 * K[1] - .55)
    # S2 accelerating ticks
    tv = .15 * 0 + SCA[1] + .15; acc = .78
    while tv < SCB[1] - .55:
        tick(tv, .08); tv += acc; acc = max(.24, acc * .84)
    # S1 notif ticks + boom
    for i in range(6): tick(SCA[0] + .12 + i * .14, .045)
    boom(SCA[0] + 1.81, .4)
    # S2 end whip → shutter
    noise_burst(SCB[1] - .3, .3, .10, True)
    noise_burst(SCA[2], .26, .10)
    # riser → slam
    riser(SCB[2] - 2.08 * K[2] - .02, 1.1 * K[2], .15)
    boom(SCB[2] - 1.02 * K[2], .55)
    # S4 grid ticks + dings + card whoosh
    tg0 = SCA[3] + .9 * K[3]
    for i in range(1, 61, 6): tick(tg0 + i * .042 * K[3], .05)
    ding(SCA[3] + (.9 + 59 * .042) * K[3])
    noise_burst(SCA[3] + 3.8 * K[3], .35, .09)
    for j in range(5): tick(SCA[3] + (4.6 + j * .18) * K[3], .04)
    ding(SCA[3] + 6.45 * K[3])
    # S5
    for i in range(5): tick(SCA[4] + (0.6 + i * .26) * K[4], .06)
    noise_burst(SCA[4] + 2.3 * K[4], .35, .08)
    ding(SCA[4] + 3.4 * K[4])
    land = SCA[4] + (3.62 + 1.9) * K[4]
    boom(land, .4); sparkle(land + .05)
    # S6
    pad(SCA[5] + .4, DUR + .4, .09)
    boom(SCA[5] + 1.25 * K[5], .42); sparkle(SCA[5] + 1.25 * K[5] + .06)
    boom(SCA[5] + 1.18 * K[5], .3)
    sparkle(SCA[5] + 2.6 * K[5])
    # normalize & write
    sfx_i = np.int16(np.clip(sfx / max(1e-6, np.max(np.abs(sfx))) * .9, -1, 1) * 32767)
    with wave.open(SFXWAV, 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes(sfx_i.tobytes())
    print('SFX-DONE', flush=True)

if __name__ == '__main__':
    which = sys.argv[1] if len(sys.argv) > 1 else 'all'
    if which in ('all', 'sfx'): build_sfx()
    if which in ('all', 'frames'): render()
    print('ALL-DONE', flush=True)
