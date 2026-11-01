"""Builds the vector logo of «Yusuf Bunyodkor» (mark + outlined wordmark).

Geometry was traced from the client's Instagram avatar and the office wall sign.
Outputs (assets/logo/):
  mark.svg          – the building mark only, currentColor
  logo.svg          – mark + wordmark, currentColor
  logo-gold.svg     – mark + wordmark with a gold gradient (brand file)
  wordmark-path.txt – outlined text path (used inline on the site)
"""
import os, sys
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

OUT = os.path.join(os.path.dirname(__file__), '..', 'assets', 'logo')
os.makedirs(OUT, exist_ok=True)
FONT = sys.argv[1] if len(sys.argv) > 1 else 'Oswald.ttf'

GAP = 7  # knockout gap between overlapping volumes


def lerp(a, b, t):
    return (a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t)


def quad_point(q, u, v):
    """Bilinear point on quad q = [tl, tr, br, bl]; u along top edge, v downwards."""
    top = lerp(q[0], q[1], u)
    bot = lerp(q[3], q[2], u)
    return lerp(top, bot, v)


def poly(pts):
    return 'M' + ' L'.join(f'{x:.1f} {y:.1f}' for x, y in pts) + ' Z'


def bars(q, n, bar, gap, v0=0.0, v1=1.0):
    """Horizontal (perspective) bars across quad q."""
    out = []
    total = n * bar + (n - 1) * gap
    for i in range(n):
        a = v0 + (v1 - v0) * (i * (bar + gap)) / total
        b = v0 + (v1 - v0) * (i * (bar + gap) + bar) / total
        out.append(poly([quad_point(q, 0, a), quad_point(q, 1, a), quad_point(q, 1, b), quad_point(q, 0, b)]))
    return ' '.join(out)


def grid(q, cols, rows, frame):
    """Face filled with a window grid: outer quad + window holes (evenodd)."""
    W = abs(q[1][0] - q[0][0])
    H = abs(q[3][1] - q[0][1])
    fu, fv = frame / W, frame / H
    d = [poly(q)]
    for c in range(cols):
        for r in range(rows):
            u0 = c / cols + (fu if c == 0 else fu / 2)
            u1 = (c + 1) / cols - (fu if c == cols - 1 else fu / 2)
            v0 = r / rows + (fv if r == 0 else fv / 2)
            v1 = (r + 1) / rows - (fv / 2)
            d.append(poly([quad_point(q, u0, v0), quad_point(q, u1, v0), quad_point(q, u1, v1), quad_point(q, u0, v1)]))
    return ' '.join(d)


# ---------------- volumes (back → front) ----------------
SLAB = [(272, 132), (378, 56), (378, 152), (338, 138), (338, 360), (272, 360)]
STRIPE_Q = [(338, 138), (452, 182), (452, 352), (338, 352)]          # central tower, right face
LEFT_Q = [(196, 266), (306, 238), (306, 410), (196, 410)]            # left tower, front face
BLOCK = [(418, 314), (462, 292), (524, 304), (524, 440), (418, 440)]  # right low block
BLOCK_CREASE = [(462, 292), (462, 440)]
BASE_L = [(160, 406), (380, 338), (380, 506), (168, 503)]
BASE_R = [(380, 338), (546, 426), (540, 506), (380, 506)]
BASE_SIL = [(160, 406), (380, 338), (546, 426), (540, 506), (168, 503)]

# crescent "plaza" under the building + fan of floor tiles
def qbez(p0, c, p1, n=28):
    return [((1 - t) ** 2 * p0[0] + 2 * (1 - t) * t * c[0] + t * t * p1[0],
             (1 - t) ** 2 * p0[1] + 2 * (1 - t) * t * c[1] + t * t * p1[1]) for t in [i / n for i in range(n + 1)]]

A0, A1 = (70, 546), (622, 566)
OUTER = qbez(A0, (378, 444), A1)
INNER = qbez(A1, (372, 478), A0)
CRESCENT = OUTER + INNER
T_TOP = qbez((120, 556), (372, 500), (588, 574))
T_BOT = qbez((120, 556), (352, 656), (588, 574))


def tiles():
    # 2 rows × 6 columns, columns converge to a point below (perspective)
    cols, rows = 5, 2
    out = []
    n = len(T_TOP) - 1
    vp = (352, 980)
    def at(curve, u):
        i = min(int(u * n), n - 1); f = u * n - i
        return lerp(curve[i], curve[i + 1], f)
    def mid_curve(u, v):
        a, b = at(T_TOP, u), at(T_BOT, u)
        return lerp(a, b, v)
    g = 0.012
    for c in range(cols):
        for r in range(rows):
            u0, u1 = c / cols + g, (c + 1) / cols - g
            v0, v1 = r / rows + 0.06, (r + 1) / rows - 0.06
            pts = []
            for k in range(6):
                pts.append(mid_curve(u0 + (u1 - u0) * k / 5, v0))
            for k in range(6):
                pts.append(mid_curve(u1 - (u1 - u0) * k / 5, v1))
            out.append(poly(pts))
    return ' '.join(out)


layers = [
    ('slab', poly(SLAB), SLAB),
    ('stripes', bars(STRIPE_Q, 10, 9, 8), STRIPE_Q),
    ('left', bars(LEFT_Q, 8, 10, 8, 0, 0.98), LEFT_Q),
    ('block', poly(BLOCK), BLOCK),
    ('base', grid(BASE_L, 6, 3, 9) + ' ' + grid(BASE_R, 4, 3, 9), BASE_SIL),
    ('crescent', poly(CRESCENT), CRESCENT),
    ('tiles', tiles(), T_TOP + T_BOT[::-1]),
]


def mark_svg_group(prefix):
    """Returns (defs, body) — each layer is knocked out by every layer in front of it."""
    defs, body = [], []
    for i, (name, d, sil) in enumerate(layers):
        front = layers[i + 1:]
        extra = ''
        if name == 'block':
            extra = f'<path d="M{BLOCK_CREASE[0][0]} {BLOCK_CREASE[0][1]} L{BLOCK_CREASE[1][0]} {BLOCK_CREASE[1][1]}" stroke="#000" stroke-width="5"/>'
        if front or extra:
            cut = ''.join(f'<path d="{poly(f[2])}" fill="#000" stroke="#000" stroke-width="{GAP * 2}" stroke-linejoin="round"/>' for f in front)
            defs.append(f'<mask id="{prefix}{name}" maskUnits="userSpaceOnUse" x="0" y="0" width="720" height="760">'
                        f'<rect width="720" height="760" fill="#fff"/>{cut}{extra}</mask>')
            body.append(f'<path d="{d}" fill-rule="evenodd" mask="url(#{prefix}{name})"/>')
        else:
            body.append(f'<path d="{d}" fill-rule="evenodd"/>')
    return ''.join(defs), ''.join(body)


# ---------------- wordmark ----------------
def wordmark(text='YUSUF BUNYODKOR', width=640, cx=360, baseline=724, track=0.04):
    f = TTFont(FONT)
    if 'fvar' in f:
        f = instantiateVariableFont(f, {'wght': 600})
    gs = f.getGlyphSet(); cmap = f.getBestCmap(); upm = f['head'].unitsPerEm
    adv = [gs[cmap[ord(ch)]].width + (upm * track if ch != ' ' else 0) for ch in text]
    total = sum(adv) - upm * track
    s = width / total
    x = cx - width / 2
    pen = SVGPathPen(gs)
    for ch, a in zip(text, adv):
        g = gs[cmap[ord(ch)]]
        g.draw(TransformPen(pen, (s, 0, 0, -s, x, baseline)))
        x += a * s
    cap = f['OS/2'].sCapHeight * s
    return pen.getCommands(), cap


WM, CAP = wordmark()
open(os.path.join(OUT, 'wordmark-path.txt'), 'w').write(WM)

VB_MARK = '60 40 580 600'
VB_LOGO = '20 40 680 700'

d1, b1 = mark_svg_group('m')
open(os.path.join(OUT, 'mark.svg'), 'w').write(
    f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{VB_MARK}" fill="currentColor"><defs>{d1}</defs>{b1}</svg>')
open(os.path.join(OUT, 'logo.svg'), 'w').write(
    f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{VB_LOGO}" fill="currentColor"><defs>{d1}</defs>{b1}<path d="{WM}"/></svg>')
grad = ('<linearGradient id="gold" x1="0" y1="0" x2="0.35" y2="1">'
        '<stop offset="0" stop-color="#F6E3B4"/><stop offset=".5" stop-color="#D9AE62"/><stop offset="1" stop-color="#A9772F"/></linearGradient>')
open(os.path.join(OUT, 'logo-gold.svg'), 'w').write(
    f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{VB_LOGO}"><defs>{grad}{d1}</defs><g fill="url(#gold)">{b1}<path d="{WM}"/></g></svg>')
# inline-friendly mark body for the site (masks with a unique prefix)
d2, b2 = mark_svg_group('yb')
open(os.path.join(OUT, 'mark-inline.txt'), 'w').write(f'<defs>{d2}</defs>{b2}')
print('ok', round(CAP, 1))

# flat colour variants for <img> use on the site
for name, col, body in (('logo-white', '#F5F5F4', b1 + f'<path d="{WM}"/>'), ('mark-white', '#F5F5F4', b1), ('mark-orange', '#FF6A2A', b1)):
    vb = VB_LOGO if name.startswith('logo') else VB_MARK
    open(os.path.join(OUT, name + '.svg'), 'w').write(
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" fill="{col}"><defs>{d1}</defs>{body}</svg>')
