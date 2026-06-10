import os
from fontTools.ttLib import TTFont

src = os.path.join(os.path.dirname(__file__), "..", "public", "fonts")
src = os.path.abspath(src)

for name in ["LEMONMILK-Bold", "LEMONMILK-Regular"]:
    otf = os.path.join(src, name + ".otf")
    f = TTFont(otf)
    f.flavor = "woff2"
    out = os.path.join(src, name + ".woff2")
    f.save(out)
    print("OK", out, os.path.getsize(out), "octets")
