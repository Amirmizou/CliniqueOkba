import os
from fontTools.ttLib import TTFont

from otf2ttf.cli import otf_to_ttf

src = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "public", "fonts"))

for name in ["LEMONMILK-Bold", "LEMONMILK-Regular"]:
    f = TTFont(os.path.join(src, name + ".otf"))
    otf_to_ttf(f)
    ttf = os.path.join(src, name + ".ttf")
    f.save(ttf)
    print("TTF ", ttf, os.path.getsize(ttf), "->", f.sfntVersion)
    # Réécrit aussi le woff2 en version TrueType
    f.flavor = "woff2"
    w = os.path.join(src, name + ".woff2")
    f.save(w)
    print("WOFF2", w, os.path.getsize(w))
