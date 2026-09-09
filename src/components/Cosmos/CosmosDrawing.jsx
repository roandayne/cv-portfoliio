/**
 * The cosmos at rest, as pure SVG.
 *
 * This renders on the server and paints immediately, so it — not the WebGL
 * canvas — is the element the browser measures for LCP. It is also the
 * fallback whenever WebGL is unavailable or the canvas has not mounted yet,
 * which is why it draws the orb whole rather than mid-burst: it has to be a
 * believable first frame of the thing that replaces it.
 *
 * Geometry is computed deterministically, so client and server agree.
 */

const SHELL = 240;
const DISC = 70;
const TILT = 0.26;
const SPIN = -0.5;
const SCALE = 100;

const cosT = Math.cos(TILT);
const sinT = Math.sin(TILT);
const cosS = Math.cos(SPIN);
const sinS = Math.sin(SPIN);

/** Spins about Y, tilts about X, and projects along Z. */
function project(x, y, z) {
  const rx = x * cosS + z * sinS;
  const rz = z * cosS - x * sinS;
  return [rx * SCALE, -(y * cosT - rz * sinT) * SCALE, y * sinT + rz * cosT];
}

/** The same low-discrepancy sequence the shader's shards are placed with. */
function halton(index, base) {
  let result = 0;
  let f = 1 / base;
  let i = index;
  while (i > 0) {
    result += f * (i % base);
    i = Math.floor(i / base);
    f /= base;
  }
  return result;
}

function buildDots() {
  const dots = [];
  const golden = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < SHELL; i += 1) {
    const t = i / (SHELL - 1);
    const uy = 1 - t * 2;
    const ring = Math.sqrt(Math.max(0, 1 - uy * uy));
    const theta = golden * i;
    const radius = 0.88 + halton(i + 1, 2) * 0.14;
    dots.push(
      project(Math.cos(theta) * ring * radius, uy * radius, Math.sin(theta) * ring * radius),
    );
  }

  for (let i = 0; i < DISC; i += 1) {
    const theta = halton(i + 1, 3) * Math.PI * 2;
    const radius = 1.2 + halton(i + 1, 5) * 0.6;
    dots.push(project(Math.cos(theta) * radius, 0, Math.sin(theta) * radius));
  }

  return dots;
}

function buildRing(radius, rotX, rotZ, segments = 96) {
  const points = [];
  for (let i = 0; i <= segments; i += 1) {
    const t = (i / segments) * Math.PI * 2;
    let x = Math.cos(t) * radius;
    let y = 0;
    let z = Math.sin(t) * radius;

    const y1 = y * Math.cos(rotX) - z * Math.sin(rotX);
    const z1 = y * Math.sin(rotX) + z * Math.cos(rotX);
    const x2 = x * Math.cos(rotZ) - y1 * Math.sin(rotZ);
    const y2 = x * Math.sin(rotZ) + y1 * Math.cos(rotZ);
    x = x2;
    y = y2;
    z = z1;

    const [px, py] = project(x, y, z);
    points.push(`${i === 0 ? 'M' : 'L'}${px.toFixed(1)} ${py.toFixed(1)}`);
  }
  return points.join('');
}

const BODY = 0.88 * SCALE;

/* The solid hides everything behind it, exactly as the depth buffer does in
   the WebGL scene. Without this the far half of the crust shows through and
   the orb reads as a hollow cloud. */
const dots = buildDots().filter(([x, y, z]) => z > 0 || Math.hypot(x, y) > BODY);

/** Three depth bands. Opacity standing in for distance is what gives volume. */
const bands = [
  { max: -0.35, opacity: 0.3, r: 1.1 },
  { max: 0.4, opacity: 0.6, r: 1.5 },
  { max: Infinity, opacity: 0.95, r: 1.9 },
];

/** Dots as one path per band: a circle is two half-arcs from its left edge. */
function bandPath(band, lower) {
  return dots
    .filter(([, , z]) => z > lower && z <= band.max)
    .map(([x, y]) => {
      const r = band.r;
      return `M${(x - r).toFixed(1)} ${y.toFixed(1)}a${r} ${r} 0 1 0 ${(r * 2).toFixed(1)} 0a${r} ${r} 0 1 0 ${(-r * 2).toFixed(1)} 0`;
    })
    .join('');
}

const paths = bands.map((band, i) => ({
  ...band,
  d: bandPath(band, i === 0 ? -Infinity : bands[i - 1].max),
}));

const rings = [
  buildRing(1.22, 0.12, -0.35),
  buildRing(1.5, 0.54, -0.05),
  buildRing(1.78, 0.96, 0.25),
];

/* Framed to match the WebGL camera, so the crossfade from drawing to scene
   does not change the size of the object. The camera sits 6.1 out with a 34°
   vertical field, which puts 2 * 6.1 * tan(17°) world units across the height. */
const VIEW = Math.round((2 * 6.1 * Math.tan((17 * Math.PI) / 180)) * SCALE);

const CosmosDrawing = ({
  className,
  tone = 'dark',
  title = 'A dense orb of particles ringed by three orbits, before it detonates',
}) => {
  const dot = tone === 'dark' ? '#cfe6ff' : 'var(--ink)';
  const ring = tone === 'dark' ? '#56a8ff' : 'var(--rule)';

  return (
    <svg
      className={className}
      viewBox={`${-VIEW / 2} ${-VIEW / 2} ${VIEW} ${VIEW}`}
      role="img"
      aria-label={title}
      preserveAspectRatio="xMidYMid meet"
    >
      <g fill="none" stroke={ring} strokeWidth="0.7" opacity="0.32">
        {rings.map((d) => (
          <path key={d.slice(0, 24)} d={d} />
        ))}
      </g>
      <defs>
        <radialGradient id="cosmos-body" cx="38%" cy="30%" r="78%">
          <stop offset="0%" stopColor={ring} stopOpacity="0.42" />
          <stop offset="62%" stopColor={ring} stopOpacity="0.12" />
          <stop offset="100%" stopColor={dot} stopOpacity="0.3" />
        </radialGradient>
      </defs>
      <circle r={BODY} fill="url(#cosmos-body)" />
      <g fill={dot}>
        {paths.map((band) => (
          <path key={band.opacity} d={band.d} opacity={band.opacity} />
        ))}
      </g>
    </svg>
  );
};

export default CosmosDrawing;
