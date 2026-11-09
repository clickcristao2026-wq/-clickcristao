"""Extract responsive photos from supplied mockups without modifying originals.

Run from the repository root with Python + Pillow. The originals remain local.
"""
from pathlib import Path
from PIL import Image
import hashlib
import json

root = Path("Pagina Produtos/1. Pacote Pagina - Produtos/01_Layouts_Originais")
out = Path("public/images/produto")
out.mkdir(parents=True, exist_ok=True)


def crop(prefix, box, name):
    photo = Image.open(next(root.glob(prefix + "*"))).crop(box).convert("RGB")
    if name == "principal":
        # Replace the mockup's baked zoom icon with adjacent photo background.
        # The UI supplies its own accessible, functional zoom button.
        for y in range(600, 731):
            for x in range(128):
                photo.putpixel((x, y), photo.getpixel((135, y)))
    for width in (480, 960):
        responsive = photo.copy()
        responsive.thumbnail((width, width * 2))
        responsive.save(out / f"{name}-{width}.webp", "WEBP", quality=91)


crop("1.", (198, 8, 1013, 739), "principal")
for index, box in enumerate([
    (40, 12, 168, 131), (39, 150, 168, 275), (39, 289, 168, 405),
    (39, 420, 168, 534), (39, 550, 168, 675),
], 1):
    crop("1.", box, f"galeria-{index}")
crop("2.", (695, 18, 1364, 711), "editorial-frente")
crop("2.", (1382, 18, 2048, 711), "editorial-verso")
crop("5.", (42, 95, 798, 721), "look-principal")
crop("5.", (825, 95, 1190, 443), "relogio")
crop("5.", (820, 470, 1220, 705), "oculos")
crop("5.", (1248, 464, 1630, 719), "jeans")
for index, box in enumerate([
    (118, 98, 584, 495), (606, 98, 1071, 495),
    (1094, 98, 1557, 495), (1580, 98, 2045, 495),
], 1):
    crop("6.", box, f"recomendado-{index}")
crop("4.", (0, 0, 1671, 855), "video-capa")

hashes = {p.name: hashlib.sha256(p.read_bytes()).hexdigest() for p in root.glob("*.png")}
manifest = Path("qa/produto/originais-sha256.json")
manifest.parent.mkdir(parents=True, exist_ok=True)
manifest.write_text(json.dumps(hashes, ensure_ascii=False, indent=2), encoding="utf-8")
print(f"Extracted {len(list(out.glob('*.webp')))} WebP files; preserved {len(hashes)} originals.")
