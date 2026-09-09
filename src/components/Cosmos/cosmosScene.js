/**
 * An exploding cosmos: an orb of shards that detonates, disperses, and reforms.
 *
 * Every shard is one instance of a single eight-triangle solid, and the whole
 * cycle — the blast, the tumble, the vortex, the return — is evaluated in the
 * vertex shader from three per-instance attributes and a phase uniform. The CPU
 * therefore does no per-particle work at all: a frame costs one uniform write
 * and one instanced draw call, which is what makes several thousand tumbling
 * shards affordable on a phone.
 *
 * `initCosmos` returns a handle with `destroy()`. It owns no React state and
 * imports only the parts of three it uses, so it can be code split away from
 * the initial bundle.
 */

import {
  AdditiveBlending,
  BufferGeometry,
  CanvasTexture,
  Color,
  Float32BufferAttribute,
  InstancedBufferAttribute,
  InstancedBufferGeometry,
  LineBasicMaterial,
  LineLoop,
  Mesh,
  MeshBasicMaterial,
  OctahedronGeometry,
  PerspectiveCamera,
  Plane,
  Points,
  PointsMaterial,
  Raycaster,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  Sprite,
  SpriteMaterial,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three';

/* --- Timing -------------------------------------------------------------
   One cycle is a held breath, then a detonation that carries the cloud out
   and brings it home. Phase runs 0 → 1 across BURST; REST is the pause the
   orb sits whole, which is what makes the blast read as an event. */
const REST = 1.6;
const BURST = 6.4;

const COLOR_COOL = 0x2c6aa6;
const COLOR_WARM = 0xcfe6ff;
const COLOR_HAZE = 0x111a24;
const COLOR_RING = 0x56a8ff;
const COLOR_DUST = 0x7fb4e8;

/** Deterministic PRNG, so the orb is the same object on every load. */
function mulberry32(seed) {
  let a = seed >>> 0;
  return function random() {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Places every shard and gives it the four numbers the shader needs.
 *
 * Most sit on a slightly thickened sphere — a Fibonacci lattice, so they space
 * evenly rather than bunching at the poles — and the rest form a thin disc
 * around it. The disc is what separates the silhouette from a plain ball: it
 * reads as an orbiting body rather than a sphere of dots.
 */
function buildParticles(count, random) {
  const origins = new Float32Array(count * 3);
  const directions = new Float32Array(count * 3);
  const seeds = new Float32Array(count * 4);

  const disc = Math.round(count * 0.2);
  const shell = count - disc;
  const golden = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < count; i += 1) {
    let x;
    let y;
    let z;
    let dx;
    let dy;
    let dz;

    if (i < shell) {
      const t = shell > 1 ? i / (shell - 1) : 0.5;
      const uy = 1 - t * 2;
      const ring = Math.sqrt(Math.max(0, 1 - uy * uy));
      const theta = golden * i;
      const radius = 0.88 + random() * 0.14;

      x = Math.cos(theta) * ring * radius;
      y = uy * radius;
      z = Math.sin(theta) * ring * radius;

      // Blast outward from the centre, with enough scatter that the cloud
      // loses the memory of the sphere it came from.
      dx = x + (random() - 0.5) * 0.5;
      dy = y + (random() - 0.5) * 0.5;
      dz = z + (random() - 0.5) * 0.5;
    } else {
      const theta = random() * Math.PI * 2;
      const radius = 1.2 + random() * 0.6;

      x = Math.cos(theta) * radius;
      y = (random() - 0.5) * 0.09;
      z = Math.sin(theta) * radius;

      // Disc shards are flung along the plane they already orbit in.
      dx = x + (random() - 0.5) * 0.3;
      dy = (random() - 0.5) * 0.55;
      dz = z + (random() - 0.5) * 0.3;
    }

    const length = Math.hypot(dx, dy, dz) || 1;

    origins[i * 3] = x;
    origins[i * 3 + 1] = y;
    origins[i * 3 + 2] = z;
    directions[i * 3] = dx / length;
    directions[i * 3 + 1] = dy / length;
    directions[i * 3 + 2] = dz / length;

    seeds[i * 4] = random(); // travel distance and tint
    seeds[i * 4 + 1] = random(); // tumble
    seeds[i * 4 + 2] = random(); // stagger off the detonation
    seeds[i * 4 + 3] = 0.6 + random() * 0.8; // size
  }

  return { origins, directions, seeds };
}

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uPhase;
  uniform float uSpread;
  uniform float uScale;
  uniform vec3  uPointer;
  uniform float uPointerForce;

  attribute vec3 aOrigin;
  attribute vec3 aDir;
  attribute vec4 aSeed;

  varying float vShade;
  varying float vTravel;
  varying float vTint;
  varying float vDepth;

  mat3 axisAngle(vec3 axis, float angle) {
    float s = sin(angle);
    float c = cos(angle);
    float t = 1.0 - c;
    return mat3(
      t * axis.x * axis.x + c,
      t * axis.x * axis.y - s * axis.z,
      t * axis.x * axis.z + s * axis.y,
      t * axis.x * axis.y + s * axis.z,
      t * axis.y * axis.y + c,
      t * axis.y * axis.z - s * axis.x,
      t * axis.x * axis.z - s * axis.y,
      t * axis.y * axis.z + s * axis.x,
      t * axis.z * axis.z + c
    );
  }

  void main() {
    // Shards leave in a ragged wave rather than all at once.
    float stagger = aSeed.z * 0.14;
    float p = clamp((uPhase - stagger) / max(1.0 - stagger, 0.001), 0.0, 1.0);

    // Out hard and fast, then eased all the way home, so phase 1 lands exactly
    // back on the origin and the cycle can repeat without a seam.
    float blast = 1.0 - pow(1.0 - min(p / 0.3, 1.0), 3.0);
    float back = smoothstep(0.55, 1.0, p);
    float travel = blast * (1.0 - back * back * (3.0 - 2.0 * back));

    // Squaring the seed gives the distances a long tail: most shards stay in
    // frame, a few fly right past the camera. That near miss is what puts the
    // burst in front of the viewer instead of safely inside a box.
    vec3 offset = aDir * (uSpread * (0.45 + aSeed.x * aSeed.x * 1.6)) * travel;

    // The cloud turns as it expands; without this it reads as a pure radial
    // burst, which looks mechanical.
    float a = travel * (0.6 + aSeed.x * 0.8);
    float ca = cos(a);
    float sa = sin(a);
    offset = vec3(offset.x * ca - offset.z * sa, offset.y, offset.x * sa + offset.z * ca);

    vec3 turbulence = vec3(
      sin(uTime * 0.8 + aSeed.z * 41.0),
      cos(uTime * 0.65 + aSeed.x * 33.0),
      sin(uTime * 0.95 + aSeed.y * 27.0)
    );
    // A trace of drift even at rest keeps the whole orb alive between bursts.
    offset += turbulence * (0.012 + travel * 0.2);

    vec3 centre = aOrigin + offset;

    // The pointer parts the cloud it passes through.
    vec3 away = centre - uPointer;
    float push = uPointerForce * exp(-dot(away, away) * 2.2) * 0.42;
    centre += normalize(away + vec3(0.0001)) * push;

    float angle = aSeed.y * 6.28318
      + uTime * (0.35 + aSeed.y * 0.5)
      + travel * (5.0 + aSeed.x * 8.0);
    mat3 rotation = axisAngle(normalize(aDir * 0.6 + vec3(0.31, 0.74, 0.19) + aSeed.xyz * 0.5), angle);

    vec3 local = rotation * (position * (uScale * aSeed.w * (1.0 + travel * 0.3)));
    vec4 mv = modelViewMatrix * vec4(centre + local, 1.0);
    vec3 n = normalize(normalMatrix * (rotation * normal));

    float key = max(dot(n, normalize(vec3(0.45, 0.78, 0.62))), 0.0);
    float rim = max(dot(n, normalize(vec3(-0.6, -0.2, 0.5))), 0.0);

    vShade = 0.22 + 0.72 * key + 0.28 * rim * rim;
    vTravel = travel;
    vTint = aSeed.x;
    vDepth = -mv.z;

    gl_Position = projectionMatrix * mv;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3  uCool;
  uniform vec3  uWarm;
  uniform vec3  uHaze;
  uniform float uNear;
  uniform float uFar;
  uniform float uFlash;

  varying float vShade;
  varying float vTravel;
  varying float vTint;
  varying float vDepth;

  void main() {
    vec3 colour = mix(uCool, uWarm, clamp(vTint * 1.15, 0.0, 1.0)) * vShade;

    // The ignition glow catches the shards still bunched at the centre.
    colour += uWarm * uFlash * (1.0 - vTravel) * 0.6;

    // Depth haze: distance is what tells the eye this is a volume, not a plane.
    colour = mix(colour, uHaze, smoothstep(uNear, uFar, vDepth) * 0.85);

    gl_FragColor = vec4(colour, 1.0);
  }
`;

/* The solid the shards are the crust of. It is lit by the same two fake
   lights as the shards, so the surface and the crust agree, and it opens on
   exactly the curve the shader flings the shards along. */
const bodyVertexShader = /* glsl */ `
  varying float vKey;
  varying float vRim;

  void main() {
    vec3 n = normalize(normalMatrix * normal);
    vKey = max(dot(n, normalize(vec3(0.45, 0.78, 0.62))), 0.0);
    vRim = 1.0 - abs(n.z);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const bodyFragmentShader = /* glsl */ `
  uniform vec3  uCool;
  uniform vec3  uWarm;
  uniform float uOpacity;

  varying float vKey;
  varying float vRim;

  void main() {
    vec3 colour = uCool * (0.1 + 0.42 * vKey) + uWarm * pow(vRim, 3.0) * 0.6;
    gl_FragColor = vec4(colour, uOpacity);
  }
`;

/** GLSL smoothstep, for curves the CPU has to keep in step with the shader. */
function smoothstep(edge0, edge1, x) {
  const t = Math.min(Math.max((x - edge0) / (edge1 - edge0), 0), 1);
  return t * t * (3 - 2 * t);
}

/**
 * The shader's travel curve, evaluated on the CPU. The body, the rings, and
 * the glow are driven from this rather than from a curve of their own, so the
 * solid opens exactly as fast as the crust leaves it.
 */
function travelAt(p) {
  const blast = 1 - (1 - Math.min(p / 0.3, 1)) ** 3;
  const back = smoothstep(0.55, 1, p);
  return blast * (1 - back * back * (3 - 2 * back));
}

/** A soft radial gradient, used for the glow around the core. */
function haloTexture() {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;

  const context = canvas.getContext('2d');
  const gradient = context.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, 'rgba(207, 230, 255, 0.9)');
  gradient.addColorStop(0.35, 'rgba(86, 168, 255, 0.28)');
  gradient.addColorStop(1, 'rgba(86, 168, 255, 0)');
  context.fillStyle = gradient;
  context.fillRect(0, 0, size, size);

  return new CanvasTexture(canvas);
}

/** A circle in the XZ plane, drawn as a single line loop. */
function ringGeometry(radius, segments = 128) {
  const points = [];
  for (let i = 0; i < segments; i += 1) {
    const t = (i / segments) * Math.PI * 2;
    points.push(Math.cos(t) * radius, 0, Math.sin(t) * radius);
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(points, 3));
  return geometry;
}

/** Sparse stars, far enough out to read as the space the orb sits in. */
function dustGeometry(count, random) {
  const points = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    const theta = random() * Math.PI * 2;
    const phi = Math.acos(random() * 2 - 1);
    const radius = 12 + random() * 8;
    points[i * 3] = Math.sin(phi) * Math.cos(theta) * radius;
    points[i * 3 + 1] = Math.cos(phi) * radius * 0.7;
    points[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * radius;
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(points, 3));
  return geometry;
}

export function isWebGLAvailable() {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext('webgl2') || canvas.getContext('webgl')),
    );
  } catch {
    return false;
  }
}

/**
 * @param {HTMLCanvasElement} canvas
 * @param {{
 *   reducedMotion?: boolean,
 *   quality?: 'full' | 'reduced',
 *   interactionTarget?: HTMLElement,
 * }} options
 */
export function initCosmos(canvas, options = {}) {
  const { reducedMotion = false, quality = 'full' } = options;

  // The canvas lies over the hero copy and takes no pointer events of its own,
  // so drags and clicks are listened for on the section beneath it. Pointer
  // coordinates still come from the canvas: that is the surface being drawn on.
  const target = options.interactionTarget || canvas;
  const lowQuality = quality === 'reduced';

  const count = lowQuality ? 1600 : 4200;
  const random = mulberry32(0x5eed1);
  const { origins, directions, seeds } = buildParticles(count, random);

  const renderer = new WebGLRenderer({
    canvas,
    antialias: !lowQuality,
    alpha: true,
    powerPreference: 'low-power',
    stencil: false,
  });
  renderer.setClearAlpha(0);

  const scene = new Scene();
  const camera = new PerspectiveCamera(34, 1, 0.5, 40);

  // One shard: an octahedron squeezed along two axes into a grain.
  const shard = new OctahedronGeometry(1, 0);
  shard.scale(0.5, 1, 0.5);

  const geometry = new InstancedBufferGeometry();
  geometry.setAttribute('position', shard.getAttribute('position'));
  geometry.setAttribute('normal', shard.getAttribute('normal'));
  geometry.setAttribute('aOrigin', new InstancedBufferAttribute(origins, 3));
  geometry.setAttribute('aDir', new InstancedBufferAttribute(directions, 3));
  geometry.setAttribute('aSeed', new InstancedBufferAttribute(seeds, 4));
  geometry.instanceCount = count;

  const uniforms = {
    uTime: { value: 0 },
    uPhase: { value: 0 },
    uSpread: { value: 2.6 },
    uScale: { value: lowQuality ? 0.055 : 0.038 },
    uPointer: { value: new Vector3(0, 0, 0) },
    uPointerForce: { value: 0 },
    uCool: { value: new Color(COLOR_COOL) },
    uWarm: { value: new Color(COLOR_WARM) },
    uHaze: { value: new Color(COLOR_HAZE) },
    uNear: { value: 4 },
    uFar: { value: 11 },
    uFlash: { value: 0 },
  };

  const shardMaterial = new ShaderMaterial({ uniforms, vertexShader, fragmentShader });
  const shards = new Mesh(geometry, shardMaterial);
  // The shader moves the shards, so the bounding volume three would compute is
  // meaningless; culling has to be off or the whole cloud can vanish at once.
  shards.frustumCulled = false;
  scene.add(shards);

  const bodyUniforms = {
    uCool: { value: new Color(COLOR_COOL) },
    uWarm: { value: new Color(COLOR_WARM) },
    uOpacity: { value: 1 },
  };
  const bodyGeometry = new SphereGeometry(0.88, 48, 32);
  const bodyMaterial = new ShaderMaterial({
    uniforms: bodyUniforms,
    vertexShader: bodyVertexShader,
    fragmentShader: bodyFragmentShader,
    transparent: true,
  });
  const body = new Mesh(bodyGeometry, bodyMaterial);
  scene.add(body);

  const coreGeometry = new SphereGeometry(0.1, 24, 16);
  const coreMaterial = new MeshBasicMaterial({ color: 0xe6f2ff });
  const core = new Mesh(coreGeometry, coreMaterial);
  scene.add(core);

  const halo = haloTexture();
  const haloMaterial = new SpriteMaterial({
    map: halo,
    blending: AdditiveBlending,
    transparent: true,
    depthWrite: false,
    opacity: 0.8,
  });
  const glow = new Sprite(haloMaterial);
  glow.scale.setScalar(1.6);
  scene.add(glow);

  // Orbit rings. They hold the shape of the object while the shards are away,
  // which is what keeps the composition from emptying out mid-burst.
  const ringMaterial = new LineBasicMaterial({
    color: COLOR_RING,
    transparent: true,
    opacity: 0.32,
    blending: AdditiveBlending,
    depthWrite: false,
  });
  const ringGeometries = [ringGeometry(1.22), ringGeometry(1.5), ringGeometry(1.78)];
  const rings = ringGeometries.map((ring, i) => {
    const loop = new LineLoop(ring, ringMaterial);
    loop.rotation.x = 0.12 + i * 0.42;
    loop.rotation.z = -0.35 + i * 0.3;
    scene.add(loop);
    return loop;
  });

  const dust = dustGeometry(lowQuality ? 140 : 300, random);
  // Screen-space sizing, deliberately: an attenuated point that drifts near
  // the camera is drawn as a quad wider than the viewport, which fills the
  // canvas with one flat rectangle.
  const dustMaterial = new PointsMaterial({
    color: COLOR_DUST,
    size: 1.6,
    sizeAttenuation: false,
    transparent: true,
    opacity: 0.5,
    blending: AdditiveBlending,
    depthWrite: false,
  });
  const stars = new Points(dust, dustMaterial);
  scene.add(stars);

  const radius = 6.1;
  let distance = radius;
  let lateralOffset = 0;
  let verticalOffset = 0;
  let spin = -0.5;
  let tilt = 0.26;
  let targetTilt = 0.26;
  let pointerX = 0;
  let targetPointerX = 0;
  let scrollLift = 0;
  let targetScrollLift = 0;

  let clock = 0;
  let phase = 0;
  let resting = true;
  let restLeft = REST;

  let running = false;
  let frameId = 0;
  let lastTime = 0;

  const raycaster = new Raycaster();
  const pointer = new Vector2();
  const pointerPoint = new Vector3();
  const plane = new Plane();
  const forward = new Vector3();
  const lateral = new Vector3();
  const vertical = new Vector3();
  const origin = new Vector3();
  let pointerInside = false;
  let pointerForce = 0;

  let dragging = false;
  let dragMoved = false;
  let lastDrag = { x: 0, y: 0 };

  function resize() {
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const cap = lowQuality ? 1.25 : 1.75;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, cap));
    renderer.setSize(rect.width, rect.height, false);

    const aspect = rect.width / rect.height;
    camera.aspect = aspect;
    distance = radius * (aspect < 1 ? 1.4 : aspect < 1.4 ? 1.16 : 1);

    // Above the hero's stacking breakpoint the copy holds the left column, so
    // the orb is framed over the right one and the blast crosses the type on
    // its way out.
    //
    // Below it the hero is one column and there is no clear column to cross:
    // the orb drops into the space under the copy and the blast is reined in,
    // because a centred burst at this width buries the headline and the links
    // rather than sweeping past them.
    const halfHeight = Math.tan((34 * Math.PI) / 360) * distance;
    const wide = rect.width >= 992;

    lateralOffset = wide ? halfHeight * aspect * 0.42 : 0;
    verticalOffset = wide ? 0 : halfHeight * 0.42;
    uniforms.uSpread.value = wide ? 2.6 : 1.7;
    // Haze has to track the camera, or the cloud reads as flat when it pulls back.
    uniforms.uNear.value = distance - 2.2;
    uniforms.uFar.value = distance + 5;
    camera.updateProjectionMatrix();
  }

  /** Restarts the cycle from the moment of detonation. */
  function detonate() {
    resting = false;
    phase = 0;
    uniforms.uFlash.value = 1;
  }

  function advance(delta) {
    clock += delta;
    uniforms.uTime.value = clock;

    if (resting) {
      restLeft -= delta;
      if (restLeft <= 0) detonate();
    } else {
      phase += delta / BURST;
      if (phase >= 1) {
        phase = 0;
        resting = true;
        restLeft = REST;
      }
    }

    uniforms.uPhase.value = resting ? 0 : phase;
    uniforms.uFlash.value *= Math.exp(-delta * 7);

    // At rest the body is opaque and writes depth, so the shards behind it are
    // hidden and the orb reads as one solid object. The detonation opens it,
    // uncovering the core that was inside all along.
    const dispersion = resting ? 0 : travelAt(phase);
    const opened = Math.min(dispersion * 1.7, 1);

    body.visible = opened < 0.995;
    bodyUniforms.uOpacity.value = 1 - opened;
    bodyMaterial.depthWrite = opened < 0.08;
    body.scale.setScalar(1 - dispersion * 0.55);

    core.scale.setScalar(1 + uniforms.uFlash.value * 2.4);
    glow.scale.setScalar(1.6 + uniforms.uFlash.value * 2.6);
    haloMaterial.opacity = 0.22 + dispersion * 0.3 + uniforms.uFlash.value * 0.5;
    ringMaterial.opacity = 0.32 * (1 - dispersion * 0.7);

    rings.forEach((ring, i) => {
      ring.rotation.y += delta * (0.12 + i * 0.05);
    });
    stars.rotation.y += delta * 0.012;
  }

  function updateCamera(delta) {
    if (!reducedMotion && !dragging) {
      spin += (pointerInside ? 0.03 : 0.075) * delta;
    }
    pointerX += (targetPointerX - pointerX) * Math.min(1, delta * 4);
    tilt += (targetTilt - tilt) * Math.min(1, delta * 4);
    scrollLift += (targetScrollLift - scrollLift) * Math.min(1, delta * 3);
    pointerForce += ((pointerInside ? 1 : 0) - pointerForce) * Math.min(1, delta * 5);
    uniforms.uPointerForce.value = pointerForce;

    const angle = spin + pointerX * 0.3;
    camera.position.set(
      Math.sin(angle) * distance * Math.cos(tilt),
      Math.sin(tilt) * distance + scrollLift,
      Math.cos(angle) * distance * Math.cos(tilt),
    );
    camera.lookAt(0, scrollLift * 0.4, 0);

    // Slide the camera after aiming it. Moving it rather than turning it shifts
    // the orb across the frame without skewing the perspective.
    if (lateralOffset !== 0 || verticalOffset !== 0) {
      camera.updateMatrixWorld();
      lateral.setFromMatrixColumn(camera.matrixWorld, 0);
      vertical.setFromMatrixColumn(camera.matrixWorld, 1);
      camera.position.addScaledVector(lateral, -lateralOffset);
      camera.position.addScaledVector(vertical, verticalOffset);
    }
  }

  /**
   * Resolves the pointer to a point in the cloud by meeting the ray with the
   * plane through the centre that faces the camera. The camera's world matrix
   * is refreshed first: it is otherwise only updated during render, which
   * would leave the ray a frame behind.
   */
  function updatePointerPoint() {
    if (!pointerInside) return;
    camera.updateMatrixWorld();
    camera.getWorldDirection(forward);
    plane.setFromNormalAndCoplanarPoint(forward, origin);
    raycaster.setFromCamera(pointer, camera);
    if (raycaster.ray.intersectPlane(plane, pointerPoint)) {
      uniforms.uPointer.value.copy(pointerPoint);
    }
  }

  function tick(time) {
    frameId = requestAnimationFrame(tick);
    const delta = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 0.016;
    lastTime = time;

    advance(delta);
    updateCamera(delta);
    updatePointerPoint();
    renderer.render(scene, camera);
  }

  function start() {
    if (running) return;
    running = true;
    lastTime = 0;
    frameId = requestAnimationFrame(tick);
  }

  function stop() {
    if (!running) return;
    running = false;
    cancelAnimationFrame(frameId);
  }

  function renderOnce() {
    updateCamera(0.016);
    updatePointerPoint();
    renderer.render(scene, camera);
  }

  function onPointerMove(event) {
    const rect = canvas.getBoundingClientRect();

    if (dragging) {
      const dx = event.clientX - lastDrag.x;
      const dy = event.clientY - lastDrag.y;
      if (Math.abs(dx) + Math.abs(dy) > 2) dragMoved = true;
      spin -= dx * 0.007;
      targetTilt = Math.max(-0.5, Math.min(0.95, targetTilt + dy * 0.005));
      lastDrag = { x: event.clientX, y: event.clientY };
      if (reducedMotion) renderOnce();
      return;
    }

    const nx = (event.clientX - rect.left) / rect.width;
    const ny = (event.clientY - rect.top) / rect.height;
    pointer.set(nx * 2 - 1, -(ny * 2 - 1));
    targetPointerX = nx * 2 - 1;
    targetTilt = 0.26 - (ny - 0.5) * 0.2;
    pointerInside = true;
    if (reducedMotion) renderOnce();
  }

  /** Links and buttons under the canvas keep their own clicks. */
  function isControl(node) {
    return node instanceof Element && Boolean(node.closest('a, button, input, select, textarea'));
  }

  function onPointerDown(event) {
    if (event.pointerType === 'touch' || isControl(event.target)) return;
    dragging = true;
    dragMoved = false;
    lastDrag = { x: event.clientX, y: event.clientY };
    target.setPointerCapture(event.pointerId);
    target.style.cursor = 'grabbing';
  }

  function onPointerUp(event) {
    if (!dragging) return;
    dragging = false;
    if (target.hasPointerCapture(event.pointerId)) target.releasePointerCapture(event.pointerId);
    target.style.cursor = 'grab';
    // A click that did not drag is a request to set it off.
    if (!dragMoved && !reducedMotion) detonate();
  }

  function onPointerLeave() {
    pointerInside = false;
    targetPointerX = 0;
    if (reducedMotion) renderOnce();
  }

  function onScroll() {
    const rect = canvas.getBoundingClientRect();
    const progress = -rect.top / Math.max(rect.height, 1);
    targetScrollLift = Math.max(-1.2, Math.min(1.2, progress * 1.4));
  }

  target.style.cursor = 'grab';
  target.addEventListener('pointermove', onPointerMove, { passive: true });
  target.addEventListener('pointerdown', onPointerDown);
  target.addEventListener('pointerup', onPointerUp);
  target.addEventListener('pointercancel', onPointerUp);
  target.addEventListener('pointerleave', onPointerLeave, { passive: true });

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas);
  resize();

  let visible = false;

  const intersectionObserver = new IntersectionObserver(
    (entries) => {
      visible = entries[0].isIntersecting;
      if (visible && !reducedMotion && !document.hidden) start();
      else stop();
      if (visible && reducedMotion) renderOnce();
    },
    { threshold: 0 },
  );
  intersectionObserver.observe(canvas);

  function onVisibilityChange() {
    if (document.hidden) stop();
    else if (visible && !reducedMotion) start();
  }

  document.addEventListener('visibilitychange', onVisibilityChange);
  if (!reducedMotion) window.addEventListener('scroll', onScroll, { passive: true });

  renderOnce();

  return {
    detonate,
    destroy() {
      stop();
      intersectionObserver.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('scroll', onScroll);
      target.removeEventListener('pointermove', onPointerMove);
      target.removeEventListener('pointerdown', onPointerDown);
      target.removeEventListener('pointerup', onPointerUp);
      target.removeEventListener('pointercancel', onPointerUp);
      target.removeEventListener('pointerleave', onPointerLeave);
      target.style.cursor = '';

      shard.dispose();
      geometry.dispose();
      bodyGeometry.dispose();
      coreGeometry.dispose();
      dust.dispose();
      ringGeometries.forEach((ring) => ring.dispose());
      halo.dispose();
      shardMaterial.dispose();
      bodyMaterial.dispose();
      coreMaterial.dispose();
      haloMaterial.dispose();
      ringMaterial.dispose();
      dustMaterial.dispose();
      scene.clear();
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
}
