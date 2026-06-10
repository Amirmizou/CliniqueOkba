import os
from fontTools.ttLib import TTFont

src = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "public", "fonts"))

for fname in ["LEMONMILK-Bold.otf", "LEMONMILK-Bold.woff2"]:
    path = os.path.join(src, fname)
    f = TTFont(path)
    print("=====", fname, "=====")
    print("  sfntVersion:", f.sfntVersion)
    print("  tables:", sorted(f.keys()))
    # name table family
    try:
        name = f["name"]
        fam = name.getDebugName(1)
        full = name.getDebugName(4)
        print("  family(1):", fam, "| full(4):", full)
    except Exception as e:
        print("  name error:", e)
    # cmap
    try:
        cmap = f.getBestCmap()
        print("  cmap entries:", len(cmap))
        for ch in ["A", "C", "O", "K", "I", "Q", "U", "E", "B", "N", "L"]:
            print(f"    {ch} ({ord(ch)}): {cmap.get(ord(ch))}")
    except Exception as e:
        print("  cmap error:", e)
