"""Generates the drawn social card and the apple-touch icon.

Both are drawn from the same axonometric frame the site uses and carry the
monogram from make-logo.py. Run with: python3 scripts/make-images.py

Note: the live social card is public/og.jpg, a capture of the homepage hero.
make_og() writes the drawn alternative to public/og.png, which nothing
references. Point the og:image tags in index.html back at it to use it again.
"""

import importlib.util
import math
import os

from PIL import Image, ImageDraw, ImageFont

# The monogram's geometry, from its own script (hyphenated, so loaded by path).
_spec = importlib.util.spec_from_file_location(
    "make_logo", os.path.join(os.path.dirname(os.path.abspath(__file__)), "make-logo.py"))
make_logo = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(make_logo)

BLUE = tuple(int(make_logo.BLUE[i:i + 2], 16) for i in (1, 3, 5))

PAPER = (240, 240, 238)
INK = (27, 29, 31)
MUTED = (92, 96, 99)
RULE = (203, 204, 200)
ACCENT = (15, 76, 129)
DARK = (12, 14, 16)
DARK_INK = (242, 244, 245)

COS30 = math.cos(math.pi / 6)
SIN30 = math.sin(math.pi / 6)


def font(name, size):
    for path in (
        f"/System/Library/Fonts/Supplemental/{name}.ttf",
        f"/System/Library/Fonts/{name}.ttc",
        "/System/Library/Fonts/Helvetica.ttc",
    ):
        try:
            return ImageFont.truetype(path, size)
        except OSError:
            continue
    return ImageFont.load_default()


def draw_mark(img, x, y, height, ink):
    """The monogram, filled at four times the size and scaled back down."""
    ss = 4
    scale = height * ss / make_logo.H
    size = (int(round(make_logo.W * scale)), int(round(make_logo.H * scale)))
    layer = Image.new("RGBA", size, (0, 0, 0, 0))
    pen = ImageDraw.Draw(layer)
    letters, play = make_logo.outlines()
    for shape in letters:
        pen.polygon([(px * scale, py * scale) for px, py in make_logo.polygon(shape, 0.25)],
                    fill=ink + (255,))
    for shape in play:
        pen.polygon([(px * scale, py * scale) for px, py in make_logo.polygon(shape, 0.25)],
                    fill=BLUE + (255,))
    layer = layer.resize((size[0] // ss, size[1] // ss), Image.LANCZOS)
    img.paste(layer, (int(round(x)), int(round(y))), layer)


def project(x, y, z, scale, ox, oy):
    return (ox + (x - z) * COS30 * scale, oy + ((x + z) * SIN30 - y) * scale)


def draw_frame(draw, ox, oy, scale, bays_x=4, bays_z=3, levels=3, bay=46, storey=40):
    """Columns, beams, and the setting-out grid, in that stacking order."""
    grid, beams, columns = [], [], []
    w, d = bays_x * bay, bays_z * bay
    over = bay * 0.5

    for i in range(bays_x + 1):
        grid.append((project(i * bay, 0, -over, scale, ox, oy),
                     project(i * bay, 0, d + over, scale, ox, oy)))
    for k in range(bays_z + 1):
        grid.append((project(-over, 0, k * bay, scale, ox, oy),
                     project(w + over, 0, k * bay, scale, ox, oy)))

    for level in range(1, levels + 1):
        y = level * storey
        for k in range(bays_z + 1):
            beams.append((project(0, y, k * bay, scale, ox, oy),
                          project(w, y, k * bay, scale, ox, oy)))
        for i in range(bays_x + 1):
            beams.append((project(i * bay, y, 0, scale, ox, oy),
                          project(i * bay, y, d, scale, ox, oy)))

    for i in range(bays_x + 1):
        for k in range(bays_z + 1):
            columns.append((project(i * bay, 0, k * bay, scale, ox, oy),
                            project(i * bay, levels * storey, k * bay, scale, ox, oy)))

    for a, b in grid:
        draw.line([a, b], fill=RULE, width=2)
    for a, b in beams:
        draw.line([a, b], fill=MUTED, width=2)
    for index, (a, b) in enumerate(columns):
        # One highlighted member, matching the selection behaviour on the site.
        draw.line([a, b], fill=ACCENT if index == 15 else INK, width=3)


def make_og(path="public/og.png"):
    img = Image.new("RGB", (1200, 630), PAPER)
    draw = ImageDraw.Draw(img)

    draw_frame(draw, ox=945, oy=398, scale=0.9)

    draw.line([(80, 96), (1120, 96)], fill=INK, width=3)
    draw_mark(img, 80, 32, 44, INK)

    name = font("Helvetica", 30)
    lede = font("Helvetica", 50)
    meta = font("Helvetica", 24)

    draw.text((80, 130), "ROAN DINO", font=name, fill=MUTED)
    draw.text((80, 210), "Building software,", font=lede, fill=INK)
    draw.text((80, 268), "systems, and", font=lede, fill=INK)
    draw.text((80, 326), "interactive experiences.", font=lede, fill=INK)
    draw.text((80, 412), "Web developer · Project manager · QA engineer", font=meta, fill=MUTED)
    draw.text((80, 448), "Golang · Ruby on Rails · Laravel · React · TypeScript", font=meta, fill=MUTED)
    draw.text((80, 484), "Agile delivery · Three.js · IFC / BIM", font=meta, fill=MUTED)

    draw.line([(80, 566), (1120, 566)], fill=RULE, width=2)
    draw.text((80, 582), "roandino.dev", font=meta, fill=MUTED)

    img.save(path, optimize=True)
    print("wrote", path)


def make_icon(path="public/apple-touch-icon.png", size=180):
    """The monogram on the site's dark ground, matching favicon.svg."""
    img = Image.new("RGB", (size, size), DARK)
    width = size * 24 / 32                      # inset so iOS's mask cannot clip it
    height = width * make_logo.H / make_logo.W
    draw_mark(img, (size - width) / 2, (size - height) / 2, height, DARK_INK)
    img.save(path, optimize=True)
    print("wrote", path)


def make_favicon(path="public/favicon.ico"):
    """A raster favicon beside favicon.svg.

    Google's favicon crawler falls back to /favicon.ico at the site root, and
    an HTML 404 there leaves it guessing. The .ico carries the sizes Google
    and the browsers actually ask for.
    """
    sizes = (16, 32, 48, 64, 128, 180)
    largest = max(sizes)
    img = Image.new("RGB", (largest, largest), DARK)
    width = largest * 24 / 32                   # same inset as the touch icon
    height = width * make_logo.H / make_logo.W
    draw_mark(img, (largest - width) / 2, (largest - height) / 2, height, DARK_INK)
    img.save(path, sizes=[(s, s) for s in sizes])
    print("wrote", path)


if __name__ == "__main__":
    make_og()
    make_icon()
    make_favicon()
