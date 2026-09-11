"""Jeu d'icones du site, engendre depuis public/logo-mark.png.

L'ancienne app/icon.png etait un recadrage d'affiche : cercle coupe a gauche
et a droite, « CLINIQUE OKBA » tranche en bas. On repart du logo seul.

Le PNG source ne monte jamais a alpha 255 (max 209) : tel quel le blanc sort
delave. On renormalise donc le canal alpha avant de peindre la marque.
"""
from PIL import Image

GREEN = (0, 102, 51)

src = Image.open('public/logo-mark.png').convert('RGBA')
alpha = src.split()[3]
peak = max(i for i, c in enumerate(alpha.histogram()) if c)
alpha = alpha.point(lambda v: min(255, round(v * 255 / peak)))
mark = alpha.crop(alpha.getbbox())


def build(size, coverage, out):
    canvas = Image.new('RGBA', (size, size), GREEN + (255,))
    mw, mh = mark.size
    scale = size * coverage / max(mw, mh)
    nm = mark.resize((max(1, round(mw * scale)), max(1, round(mh * scale))), Image.LANCZOS)
    white = Image.new('RGBA', nm.size, (255, 255, 255, 255))
    white.putalpha(nm)
    canvas.alpha_composite(white, ((size - nm.size[0]) // 2, (size - nm.size[1]) // 2))
    canvas.convert('RGB').save(out, 'PNG', optimize=True)
    print(out, size, 'alpha max source =', peak)


build(512, 0.80, 'app/icon.png')
build(180, 0.72, 'app/apple-icon.png')
build(192, 0.80, 'public/icon-192.png')
build(512, 0.80, 'public/icon-512.png')
build(512, 0.56, 'public/icon-maskable-512.png')  # zone sure Android : 80 % du cadre
