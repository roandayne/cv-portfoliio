"""Draws the RD monogram and writes the vector assets that use it.

The mark was supplied as a bitmap. Rather than trace it — which keeps every
wobble the raster had — its construction was measured and rebuilt here: one
stroke weight for both letters, true concentric circles for the bowls, 45
degree cuts on every terminal, and a mark that fills its box exactly. Run with:
python3 scripts/make-logo.py
"""

import math

W, H = 509.75, 283.75
T = 50.8                            # stroke weight, shared by both letters

# R --------------------------------------------------------------------------
RC = (200.13, 95.79)                # bowl centre
R_OUT = 95.79                       # the outer circle is tangent to the cap
R_IN = R_OUT - T
CAP = 0.0
BAR_BOTTOM = RC[1] - R_IN           # cap bar, tangent to the counter above
WAIST = RC[1] + R_IN                # waist bar, tangent to the counter below
LEG_R = 15.7                        # the leg's flanks: y = x + LEG_R / LEG_L
LEG_L = LEG_R + T * math.sqrt(2)
TERMINAL = 183.8                    # the bowl's blunt cut into the leg

# D --------------------------------------------------------------------------
DC = (367.875, 141.875)             # ring centre
D_OUT = 141.875                     # tangent to y = 0 and y = H
D_IN = D_OUT - T
CUT_TOP, CUT_BOTTOM = 277.0, 26.0   # the two parallel cuts: y = x - CUT
COUNTER_TOP = DC[1] - D_IN
COUNTER_BOTTOM = DC[1] + D_IN

# Play mark ------------------------------------------------------------------
TRI_X, TRI_TIP, TRI_HALF = 334.2, 401.5, 58.4

INK = "#1b1d25"
BLUE = "#1668f5"
PAPER = "#f2f4f5"
DARK = "#0c0e10"


def _arc_end_x(cx, cy, r, y):
    return cx + math.sqrt(max(r ** 2 - (y - cy) ** 2, 0.0))


# Each outline is a list of ('L', point) and ('A', centre, radius, clockwise)
# steps, walked from the starting point.
def outlines():
    r_letter = [
        (0.0, CAP),
        ("L", (RC[0], CAP)),
        ("A", RC, R_OUT, True, (_arc_end_x(RC[0], RC[1], R_OUT, TERMINAL), TERMINAL)),
        ("L", (TERMINAL - LEG_R, TERMINAL)),
        ("L", (H - LEG_R, H)),
        ("L", (H - LEG_L, H)),
        ("L", (WAIST - LEG_L, WAIST)),
        ("L", (RC[0], WAIST)),
        ("A", RC, R_IN, False, (RC[0], BAR_BOTTOM)),
        ("L", (BAR_BOTTOM, BAR_BOTTOM)),
    ]
    d_letter = [
        (CUT_TOP, CAP),
        ("L", (DC[0], CAP)),
        ("A", DC, D_OUT, True, (DC[0], H)),
        ("L", (H + CUT_BOTTOM, H)),
        ("L", (COUNTER_BOTTOM + CUT_BOTTOM, COUNTER_BOTTOM)),
        ("L", (DC[0], COUNTER_BOTTOM)),
        ("A", DC, D_IN, False, (DC[0], COUNTER_TOP)),
        ("L", (COUNTER_TOP + CUT_TOP, COUNTER_TOP)),
    ]
    play = [
        (TRI_X, DC[1] - TRI_HALF),
        ("L", (TRI_TIP, DC[1])),
        ("L", (TRI_X, DC[1] + TRI_HALF)),
    ]
    return [r_letter, d_letter], [play]


def _num(v):
    return f"{v:.2f}".rstrip("0").rstrip(".")


def path_data(shapes):
    out = []
    for shape in shapes:
        start = shape[0]
        d = [f"M{_num(start[0])} {_num(start[1])}"]
        for step in shape[1:]:
            if step[0] == "L":
                x, y = step[1]
                d.append(f"L{_num(x)} {_num(y)}")
            else:
                _, centre, radius, clockwise, end = step
                d.append(f"A{_num(radius)} {_num(radius)} 0 0 {1 if clockwise else 0} "
                         f"{_num(end[0])} {_num(end[1])}")
        d.append("Z")
        out.append("".join(d))
    return "".join(out)


def polygon(shape, step=0.5):
    """The same outline as a point list, for raster output."""
    pts = [shape[0]]
    for op in shape[1:]:
        if op[0] == "L":
            pts.append(op[1])
            continue
        _, centre, radius, clockwise, end = op
        a0 = math.atan2(pts[-1][1] - centre[1], pts[-1][0] - centre[0])
        a1 = math.atan2(end[1] - centre[1], end[0] - centre[0])
        if clockwise and a1 <= a0:
            a1 += 2 * math.pi
        if not clockwise and a1 >= a0:
            a1 -= 2 * math.pi
        n = max(8, int(abs(a1 - a0) * radius / step))
        for i in range(1, n + 1):
            a = a0 + (a1 - a0) * i / n
            pts.append((centre[0] + radius * math.cos(a), centre[1] + radius * math.sin(a)))
    return pts


VIEWBOX = f"0 0 {_num(W)} {_num(H)}"


def write_logo(path="public/logo.svg"):
    letters, play = outlines()
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{VIEWBOX}" '
           f'role="img" aria-label="Roan Dino">\n'
           f'  <path fill="{INK}" d="{path_data(letters)}"/>\n'
           f'  <path fill="{BLUE}" d="{path_data(play)}"/>\n'
           f'</svg>\n')
    open(path, "w").write(svg)
    print("wrote", path)


def write_favicon(path="public/favicon.svg"):
    """The mark on the site's dark ground, sized to fill a 32 unit square."""
    letters, play = outlines()
    scale = 28 / W
    x = (32 - W * scale) / 2
    y = (32 - H * scale) / 2
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">\n'
           f'  <rect width="32" height="32" rx="6" fill="{DARK}"/>\n'
           f'  <g transform="translate({x:.3f} {y:.3f}) scale({scale:.5f})">\n'
           f'    <path fill="{PAPER}" d="{path_data(letters)}"/>\n'
           f'    <path fill="{BLUE}" d="{path_data(play)}"/>\n'
           f'  </g>\n'
           f'</svg>\n')
    open(path, "w").write(svg)
    print("wrote", path)


def write_module(path="src/data/logo.js"):
    """The same outlines for the React mark, so both stay in step."""
    letters, play = outlines()
    src = ("// Generated by scripts/make-logo.py — edit the geometry there.\n"
           f"export const viewBox = '{VIEWBOX}';\n\n"
           f"export const letters =\n  '{path_data(letters)}';\n\n"
           f"export const play =\n  '{path_data(play)}';\n")
    open(path, "w").write(src)
    print("wrote", path)


if __name__ == "__main__":
    write_logo()
    write_favicon()
    write_module()
