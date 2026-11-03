#!/usr/bin/env python3
"""Prepares the supplied photos / textures / sound clips for the video (run once; outputs are committed in public/)."""
import os, sys, glob, subprocess
import numpy as np
from PIL import Image, ImageOps, ImageFilter, ImageEnhance
SRC = sys.argv[1]            # folder holding the supplied images
OTHER = sys.argv[2]          # folder of the generated pack (images/, sfx/)
PAPER = sys.argv[3]          # Paper001_4K-PNG_Color.png
OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'public')

def halftone(gray, cell=7, mix=0.55):
    """Dot-screen look mixed with the photo so detail is kept."""
    w, h = gray.size
    a = np.asarray(gray, dtype=np.float32) / 255.0
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    th = np.deg2rad(45); u = (xx * np.cos(th) + yy * np.sin(th)) / cell; v = (-xx * np.sin(th) + yy * np.cos(th)) / cell
    d = np.sqrt((u - np.round(u)) ** 2 + (v - np.round(v)) ** 2)  # 0..0.7 distance to dot centre
    dots = (d < (1 - a) ** 0.5 * 0.62).astype(np.float32)          # dark => big dot
    out = a * (1 - mix) + (1 - dots) * mix
    return Image.fromarray((np.clip(out, 0, 1) * 255).astype(np.uint8))

def save_bw(name, src, width, crop=None, ht=True, contrast=1.15):
    im = Image.open(os.path.join(SRC, src)).convert('RGB')
    if crop: im = im.crop(crop)
    g = ImageOps.grayscale(im); g = ImageOps.autocontrast(g, cutoff=0.5); g = ImageEnhance.Contrast(g).enhance(contrast)
    r = width / g.width; g = g.resize((width, int(g.height * r)), Image.LANCZOS)
    if ht: g = halftone(g, cell=max(5, width // 160))
    g.save(os.path.join(OUT, 'assets/photos', name), quality=90)
    print(name, g.size)

save_bw('franklin.jpg', '790b5195-image.jpg', 1000)
save_bw('einstein.jpg', '1c411de1-image.jpg', 1000)
save_bw('kite1.jpg', 'db1df14e-image.jpg', 900, ht=False)
k2 = Image.open(os.path.join(SRC, 'fc587604-image.png')).convert('RGBA'); bg = Image.new('RGBA', k2.size, (255, 255, 255, 255)); bg.alpha_composite(k2); bg.convert('RGB').save('/tmp/kite2.jpg')
os.replace('/tmp/kite2.jpg', os.path.join(SRC, 'kite2_flat.jpg'))
save_bw('kite2.jpg', 'kite2_flat.jpg', 900, ht=False)
ph = Image.open(os.path.join(SRC, '1ca13bd9-press.jpg')) if False else None
im = Image.open(os.path.join(SRC, 'ffbb753c-image.jpg')); W, H = im.size
save_bw('press.jpg', 'ffbb753c-image.jpg', 1300, crop=(int(W*0.0), int(H*0.07), W, int(H*0.915)), ht=False)  # drops the printed credit line
# almanack: small source, upscale gently
al = Image.open(os.path.join(SRC, '3f1e8147-image.jpg')).convert('RGB'); al = al.resize((al.width * 2, al.height * 2), Image.LANCZOS).filter(ImageFilter.UnsharpMask(2, 60, 3)); al.save(os.path.join(OUT, 'assets/photos/almanack.jpg'), quality=92)
save_bw('virtues.jpg', 'c5ac9b0c-image.jpg', 900, ht=False, contrast=1.0)
# phoenix engraving: ink on transparent
p = ImageOps.grayscale(Image.open(os.path.join(SRC, '3bf94614-image.jpg'))); p = p.resize((p.width * 3, p.height * 3), Image.LANCZOS)
a = ImageOps.invert(ImageOps.autocontrast(p, cutoff=2)); rgba = Image.new('RGBA', p.size, (13, 13, 13, 0)); rgba.putalpha(a); rgba.save(os.path.join(OUT, 'assets/photos/phoenix.png'))
# paper: neutral, soft texture (ambientCG Paper001, CC0), tiled to 1920x1080
pp = ImageOps.grayscale(Image.open(PAPER).convert('RGB')); pp = ImageOps.autocontrast(pp, cutoff=1).resize((1920, 1126), Image.LANCZOS).crop((0, 0, 1920, 1080))
pp = pp.point(lambda v: 228 + v * 27 // 255)  # light, so multiply only adds fibre texture
pp.save(os.path.join(OUT, 'assets/overlay/paper.jpg'), quality=88)
for n in ('handdrawn_arrow', 'handdrawn_circle', 'handdrawn_star', 'handdrawn_underline', 'masking_tape', 'dust_white'):
    im = Image.open(os.path.join(OTHER, 'images', n + '_RGBA.png'))
    if n == 'dust_white': im = im.resize((1920, 1280), Image.LANCZOS)
    else:
        bb = im.getchannel('A').getbbox()
        if bb: im = im.crop(bb)
        im.thumbnail((1500, 1500), Image.LANCZOS)
    im.save(os.path.join(OUT, 'assets/overlay', n + '.png'))
print('images done')
