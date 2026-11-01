"""Colour-grades and exports all site images.

Renders (from the sales-book PDF) get: gentle upscale, calmer saturation
(neon signage toned down), soft S-curve, cool shadows / warm highlights, sharpening.
Real photos (HEIC) get levels, light warmth and clarity.
Every image is exported as WebP: full (<=2000px), -m (<=960px for phones), -t (<=480px thumbs).
"""
import os, sys
import numpy as np
from PIL import Image, ImageOps, ImageFilter
import pillow_heif
import pymupdf

pillow_heif.register_heif_opener()
ROOT = os.path.join(os.path.dirname(__file__), '..')
SRC = os.path.join(ROOT, 'Images')
OUT = os.path.join(ROOT, 'assets', 'img')
os.makedirs(OUT, exist_ok=True)


def to_np(im):
    return np.asarray(im.convert('RGB'), dtype=np.float32) / 255.0


def to_im(a):
    return Image.fromarray((np.clip(a, 0, 1) * 255 + 0.5).astype(np.uint8))


def rgb_to_hsv_sat(a):
    mx, mn = a.max(-1), a.min(-1)
    return np.where(mx > 0, (mx - mn) / np.maximum(mx, 1e-6), 0)


def grade_render(im, upscale=1.0):
    if upscale != 1.0:
        im = im.resize((round(im.width * upscale), round(im.height * upscale)), Image.LANCZOS)
    a = to_np(im)
    lum = (a * [0.2126, 0.7152, 0.0722]).sum(-1, keepdims=True)
    # saturation: overall calmer, strongest colours (neon signs, oversaturated sky) pulled most
    sat = rgb_to_hsv_sat(a)[..., None]
    k = 0.86 - 0.22 * sat
    a = lum + (a - lum) * k
    # soft S-curve
    s = a * a * (3 - 2 * a)
    a = a * 0.78 + s * 0.22
    # split toning: graphite shadows, warm highlights
    lum = (a * [0.2126, 0.7152, 0.0722]).sum(-1, keepdims=True)
    sh = np.clip(1 - lum * 2.2, 0, 1)
    hi = np.clip((lum - 0.55) * 2.2, 0, 1)
    a = a + sh * np.array([-0.012, -0.002, 0.010]) + hi * np.array([0.018, 0.008, -0.012])
    # lift deep blacks slightly (filmic)
    a = 0.018 + a * 0.975
    out = to_im(a)
    return out.filter(ImageFilter.UnsharpMask(radius=1.6, percent=70, threshold=2))


def grade_photo(im, warm=0.015, desat=1.0, cool=False):
    im = ImageOps.autocontrast(im.convert('RGB'), cutoff=(0.4, 0.6))
    a = to_np(im)
    lum = (a * [0.2126, 0.7152, 0.0722]).sum(-1, keepdims=True)
    a = lum + (a - lum) * desat
    a = a + (np.array([-0.01, 0.0, 0.012]) if cool else np.array([warm, warm * 0.4, -warm]))
    s = a * a * (3 - 2 * a)
    a = a * 0.82 + s * 0.18
    out = to_im(a)
    return out.filter(ImageFilter.UnsharpMask(radius=1.2, percent=55, threshold=2))


def export(im, name, full=2000, q=84):
    im = im.convert('RGB')
    for suffix, size, qq in (('', full, q), ('-m', 960, 80), ('-t', 480, 74)):
        c = im.copy()
        c.thumbnail((size, size), Image.LANCZOS)
        c.save(os.path.join(OUT, f'{name}{suffix}.webp'), 'WEBP', quality=qq, method=6)
    print(name, im.size)


# ---------- renders from the PDF ----------
pdf = pymupdf.open(os.path.join(SRC, 'Китоби Фуруш  1.pdf'))
def pdf_img(page):
    x = pdf.extract_image(pdf[page].get_images(full=True)[0][0])
    from io import BytesIO
    return Image.open(BytesIO(x['image']))

renders = {2: 'day-2', 3: 'day-3', 4: 'courtyard', 5: 'retail', 6: 'aerial', 7: 'day', 8: 'detail', 9: 'night', 10: 'night-angle'}
for page, name in renders.items():
    up = 1.38 if name in ('night', 'day', 'night-angle') else 1.2
    export(grade_render(pdf_img(page), up), name)

col = pdf_img(11)
export(grade_render(col.crop((4, 4, 1246, 893)), 1.0), 'mall')
export(grade_render(col.crop((1272, 4, 2513, 893)), 1.0), 'mall-2')

# ---------- real photos ----------
photos = {'IMG_4868': ('lobby', {}), 'IMG_4870': ('corridor', {}), 'IMG_4871': ('lift', {}),
          'IMG_4765': ('office', {'warm': 0.01}), 'IMG_4751': ('office-2', {'warm': 0.01}),
          'IMG_4762': ('build-1', {'desat': 0.75, 'cool': True}), 'IMG_4763': ('build-2', {'desat': 0.75, 'cool': True})}
for f, (name, kw) in photos.items():
    im = ImageOps.exif_transpose(Image.open(os.path.join(SRC, f + '.HEIC')))
    im.thumbnail((1400, 1400), Image.LANCZOS)
    export(grade_photo(im, **kw), name, full=1400)
