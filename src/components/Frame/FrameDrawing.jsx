/**
 * An axonometric line drawing of the same structural frame, as pure SVG.
 *
 * This renders on the server and paints immediately, so it — not the WebGL
 * canvas — is the element the browser measures for LCP. It is also the
 * fallback whenever WebGL is unavailable or the canvas has not mounted yet.
 * Geometry is computed deterministically, so client and server agree.
 */

const BAYS_X = 4;
const BAYS_Z = 3;
const LEVELS = 3;
const BAY = 46;
const STOREY = 40;

const COS30 = Math.cos(Math.PI / 6);
const SIN30 = Math.sin(Math.PI / 6);

/** Isometric projection of a scene point onto the drawing plane. */
function project(x, y, z) {
  return [(x - z) * COS30, (x + z) * SIN30 - y];
}

function buildSegments() {
  const columns = [];
  const beams = [];
  const grid = [];

  const w = BAYS_X * BAY;
  const d = BAYS_Z * BAY;

  for (let i = 0; i <= BAYS_X; i += 1) {
    for (let k = 0; k <= BAYS_Z; k += 1) {
      const x = i * BAY;
      const z = k * BAY;
      columns.push([project(x, 0, z), project(x, LEVELS * STOREY, z)]);
    }
  }

  for (let level = 1; level <= LEVELS; level += 1) {
    const y = level * STOREY;
    for (let k = 0; k <= BAYS_Z; k += 1) {
      beams.push([project(0, y, k * BAY), project(w, y, k * BAY)]);
    }
    for (let i = 0; i <= BAYS_X; i += 1) {
      beams.push([project(i * BAY, y, 0), project(i * BAY, y, d)]);
    }
  }

  const over = BAY * 0.5;
  for (let i = 0; i <= BAYS_X; i += 1) {
    grid.push([project(i * BAY, 0, -over), project(i * BAY, 0, d + over)]);
  }
  for (let k = 0; k <= BAYS_Z; k += 1) {
    grid.push([project(-over, 0, k * BAY), project(w + over, 0, k * BAY)]);
  }

  return { columns, beams, grid };
}

const { columns, beams, grid } = buildSegments();

const all = [...columns, ...beams, ...grid].flat();
const xs = all.map((p) => p[0]);
const ys = all.map((p) => p[1]);
const pad = 14;
const minX = Math.min(...xs) - pad;
const minY = Math.min(...ys) - pad;
const width = Math.max(...xs) - minX + pad;
const height = Math.max(...ys) - minY + pad;

function path(segments) {
  return segments
    .map(([a, b]) => `M${a[0].toFixed(1)} ${a[1].toFixed(1)}L${b[0].toFixed(1)} ${b[1].toFixed(1)}`)
    .join('');
}

const FrameDrawing = ({
  className,
  tone = 'light',
  title = 'Axonometric drawing of a structural frame',
}) => {
  const stroke = tone === 'dark' ? 'rgba(180, 214, 245, 0.75)' : 'var(--ink)';
  const faint = tone === 'dark' ? 'rgba(120, 170, 220, 0.3)' : 'var(--rule)';
  return (
  <svg
    className={className}
    viewBox={`${minX.toFixed(1)} ${minY.toFixed(1)} ${width.toFixed(1)} ${height.toFixed(1)}`}
    role="img"
    aria-label={title}
    preserveAspectRatio="xMidYMid meet"
  >
    <g fill="none" strokeLinecap="square" vectorEffect="non-scaling-stroke">
      <path d={path(grid)} stroke={faint} strokeWidth="0.7" />
      <path d={path(beams)} stroke={stroke} strokeWidth="0.9" opacity="0.6" />
      <path d={path(columns)} stroke={stroke} strokeWidth="1.3" opacity="0.85" />
    </g>
    </svg>
  );
};

export default FrameDrawing;
