/**
 * A structural frame: columns, beams, and slabs on a setting-out grid.
 *
 * Members and slabs are each one InstancedMesh, and every member edge is baked
 * into a single LineSegments, so the whole model is five draw calls regardless
 * of how many members it contains. Pointing at a member selects it and reports
 * its identity, the way an element is selected in a model viewer; dragging
 * orbits the model.
 *
 * `initFrame` returns a handle with `destroy()`. It owns no React state and
 * imports only the parts of three it uses, so it can be code split away from
 * the initial bundle.
 */

import {
  AdditiveBlending,
  AmbientLight,
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  Color,
  DirectionalLight,
  DynamicDrawUsage,
  EdgesGeometry,
  Float32BufferAttribute,
  InstancedMesh,
  LineBasicMaterial,
  LineSegments,
  Matrix4,
  MeshLambertMaterial,
  Object3D,
  PerspectiveCamera,
  Quaternion,
  Raycaster,
  Scene,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three';

const COLOR_MEMBER = 0xa9c4de;
const COLOR_SELECT = 0x9fd8ff;
const COLOR_EDGE = 0x7dc4ff;
const COLOR_GRID = 0x3f7fb8;

const BAY_X = 2.15;
const BAY_Z = 2.0;
const STOREY = 1.55;

const COL_W = 0.14;
const BEAM_W = 0.1;
const BEAM_H = 0.17;
const SLAB_T = 0.06;

const LETTERS = 'ABCDEFGH';

/**
 * Builds the member list for a frame of `bx` x `bz` bays and `levels` storeys.
 * Each member is a box described by centre and extent, which lets one
 * BoxGeometry serve every element through per-instance scale. Each also
 * carries the identity shown in the readout.
 */
function buildMembers(bx, bz, levels) {
  const members = [];
  const spanX = bx * BAY_X;
  const spanZ = bz * BAY_Z;
  const originX = -spanX / 2;
  const originZ = -spanZ / 2;

  for (let level = 0; level < levels; level += 1) {
    const base = level * STOREY;

    for (let i = 0; i <= bx; i += 1) {
      for (let k = 0; k <= bz; k += 1) {
        members.push({
          pos: [originX + i * BAY_X, base + STOREY / 2, originZ + k * BAY_Z],
          size: [COL_W, STOREY, COL_W],
          meta: { kind: 'Column', level: level + 1, ref: `${LETTERS[i]}${k + 1}` },
        });
      }
    }

    const beamY = base + STOREY - BEAM_H / 2;

    for (let k = 0; k <= bz; k += 1) {
      for (let i = 0; i < bx; i += 1) {
        members.push({
          pos: [originX + i * BAY_X + BAY_X / 2, beamY, originZ + k * BAY_Z],
          size: [BAY_X, BEAM_H, BEAM_W],
          meta: {
            kind: 'Beam',
            level: level + 1,
            ref: `${LETTERS[i]}–${LETTERS[i + 1]} / ${k + 1}`,
          },
        });
      }
    }

    for (let i = 0; i <= bx; i += 1) {
      for (let k = 0; k < bz; k += 1) {
        members.push({
          pos: [originX + i * BAY_X, beamY, originZ + k * BAY_Z + BAY_Z / 2],
          size: [BEAM_W, BEAM_H, BAY_Z],
          meta: {
            kind: 'Beam',
            level: level + 1,
            ref: `${LETTERS[i]} / ${k + 1}–${k + 2}`,
          },
        });
      }
    }
  }

  const slabs = [];
  for (let level = 1; level <= levels; level += 1) {
    slabs.push({
      pos: [0, level * STOREY - BEAM_H - SLAB_T / 2, 0],
      size: [spanX - COL_W, SLAB_T, spanZ - COL_W],
    });
  }

  return { members, slabs, spanX, spanZ, height: levels * STOREY };
}

/** Bakes the edges of every box into a single LineSegments geometry. */
function buildEdges(boxes) {
  const unit = new BoxGeometry(1, 1, 1);
  const edges = new EdgesGeometry(unit);
  const src = edges.getAttribute('position');
  const perBox = src.count;
  const out = new Float32Array(boxes.length * perBox * 3);

  let offset = 0;
  for (const box of boxes) {
    const [px, py, pz] = box.pos;
    const [sx, sy, sz] = box.size;
    for (let v = 0; v < perBox; v += 1) {
      out[offset] = src.getX(v) * sx + px;
      out[offset + 1] = src.getY(v) * sy + py;
      out[offset + 2] = src.getZ(v) * sz + pz;
      offset += 3;
    }
  }

  unit.dispose();
  edges.dispose();

  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new BufferAttribute(out, 3));
  return geometry;
}

function buildGrid(spanX, spanZ, bx, bz) {
  const overhang = 1;
  const points = [];
  const halfX = spanX / 2;
  const halfZ = spanZ / 2;

  for (let i = 0; i <= bx; i += 1) {
    const x = -halfX + i * BAY_X;
    points.push(x, 0, -halfZ - overhang, x, 0, halfZ + overhang);
  }
  for (let k = 0; k <= bz; k += 1) {
    const z = -halfZ + k * BAY_Z;
    points.push(-halfX - overhang, 0, z, halfX + overhang, 0, z);
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
 *   onSelect?: (meta: {kind: string, level: number, ref: string} | null) => void,
 * }} options
 */
export function initFrame(canvas, options = {}) {
  const { reducedMotion = false, quality = 'full', onSelect } = options;
  const lowQuality = quality === 'reduced';

  const bays = lowQuality ? [3, 2, 3] : [4, 3, 4];
  const { members, slabs, spanX, spanZ, height } = buildMembers(...bays);

  const renderer = new WebGLRenderer({
    canvas,
    antialias: !lowQuality,
    alpha: true,
    powerPreference: 'low-power',
    stencil: false,
  });
  renderer.setClearAlpha(0);

  const scene = new Scene();
  const camera = new PerspectiveCamera(34, 1, 0.5, 100);

  scene.add(new AmbientLight(0xffffff, 0.55));
  const key = new DirectionalLight(0xcfe6ff, 1.1);
  key.position.set(4, 7, 5);
  scene.add(key);
  const fill = new DirectionalLight(0x4f8fd0, 0.5);
  fill.position.set(-5, 2, -4);
  scene.add(fill);

  const unitBox = new BoxGeometry(1, 1, 1);

  // Members: translucent volumes, so the frame reads as glass rather than mass.
  const memberMaterial = new MeshLambertMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.34,
    depthWrite: false,
  });
  const memberMesh = new InstancedMesh(unitBox, memberMaterial, members.length);
  memberMesh.instanceMatrix.setUsage(DynamicDrawUsage);

  const matrix = new Matrix4();
  const position = new Vector3();
  const scale = new Vector3();
  const rotation = new Quaternion();
  const baseColor = new Color(COLOR_MEMBER);
  const selectColor = new Color(COLOR_SELECT);

  members.forEach((member, i) => {
    position.set(...member.pos);
    scale.set(...member.size);
    matrix.compose(position, rotation, scale);
    memberMesh.setMatrixAt(i, matrix);
    memberMesh.setColorAt(i, baseColor);
  });
  memberMesh.instanceMatrix.needsUpdate = true;
  memberMesh.instanceColor.needsUpdate = true;

  const slabMaterial = new MeshLambertMaterial({
    color: 0x8fb4d6,
    transparent: true,
    opacity: 0.13,
    depthWrite: false,
  });
  const slabMesh = new InstancedMesh(unitBox, slabMaterial, slabs.length);
  slabs.forEach((slab, i) => {
    position.set(...slab.pos);
    scale.set(...slab.size);
    matrix.compose(position, rotation, scale);
    slabMesh.setMatrixAt(i, matrix);
  });
  slabMesh.instanceMatrix.needsUpdate = true;

  // Additive edges give the glow without a post-processing pass.
  const edgeGeometry = buildEdges([...members, ...slabs]);
  const edgeMaterial = new LineBasicMaterial({
    color: COLOR_EDGE,
    transparent: true,
    opacity: 0.4,
    blending: AdditiveBlending,
    depthWrite: false,
  });
  const edgeLines = new LineSegments(edgeGeometry, edgeMaterial);

  const gridGeometry = buildGrid(spanX, spanZ, bays[0], bays[2]);
  const gridMaterial = new LineBasicMaterial({
    color: COLOR_GRID,
    transparent: true,
    opacity: 0.35,
  });
  const gridLines = new LineSegments(gridGeometry, gridMaterial);

  // A single reusable box outline, moved onto whichever member is selected.
  const selectionGeometry = new EdgesGeometry(new BoxGeometry(1, 1, 1));
  const selectionMaterial = new LineBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.95,
  });
  const selectionBox = new LineSegments(selectionGeometry, selectionMaterial);
  selectionBox.visible = false;

  const model = new Object3D();
  model.add(memberMesh, slabMesh, edgeLines, gridLines, selectionBox);
  model.position.y = -height / 2;
  scene.add(model);

  const radius = Math.max(spanX, spanZ) * 1.68;
  let distance = radius;
  let spin = -0.62;
  let tilt = 0.34;
  let targetTilt = 0.34;
  let pointerX = 0;
  let targetPointerX = 0;
  let scrollLift = 0;
  let targetScrollLift = 0;
  let selected = -1;
  let running = false;
  let frameId = 0;
  let lastTime = 0;

  const raycaster = new Raycaster();
  const pointer = new Vector2();
  let pointerActive = false;
  let pointerInside = false;

  let dragging = false;
  let dragMoved = false;
  let lastDrag = { x: 0, y: 0 };

  function resize() {
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const cap = lowQuality ? 1.25 : 1.75;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, cap));
    renderer.setSize(rect.width, rect.height, false);
    camera.aspect = rect.width / rect.height;
    const aspect = rect.width / rect.height;
    distance = radius * (aspect < 1 ? 1.45 : aspect < 1.4 ? 1.18 : 1);
    camera.updateProjectionMatrix();
  }

  function setSelected(index) {
    if (index === selected) return;
    if (selected !== -1) memberMesh.setColorAt(selected, baseColor);

    if (index !== -1) {
      memberMesh.setColorAt(index, selectColor);
      const member = members[index];
      selectionBox.position.set(...member.pos);
      selectionBox.scale.set(member.size[0] * 1.7, member.size[1] * 1.02, member.size[2] * 1.7);
      selectionBox.visible = true;
      if (onSelect) onSelect(member.meta);
    } else {
      selectionBox.visible = false;
      if (onSelect) onSelect(null);
    }

    selected = index;
    memberMesh.instanceColor.needsUpdate = true;
    canvas.style.cursor = index === -1 ? 'grab' : 'crosshair';
  }

  function updateCamera(delta) {
    if (!reducedMotion && !dragging) {
      spin += (pointerInside ? 0.02 : 0.07) * delta;
    }
    pointerX += (targetPointerX - pointerX) * Math.min(1, delta * 4);
    tilt += (targetTilt - tilt) * Math.min(1, delta * 4);
    scrollLift += (targetScrollLift - scrollLift) * Math.min(1, delta * 3);

    const angle = spin + pointerX * 0.3;
    camera.position.set(
      Math.sin(angle) * distance * Math.cos(tilt),
      Math.sin(tilt) * distance + scrollLift,
      Math.cos(angle) * distance * Math.cos(tilt),
    );
    camera.lookAt(0, scrollLift * 0.4, 0);
  }

  /**
   * Resolves the pointer to a member. The camera's world matrix is refreshed
   * first: it is otherwise only updated during render, which would leave the
   * ray a frame behind — and leave picking broken entirely when there is no
   * animation loop running.
   */
  function pick() {
    if (!pointerActive || dragging) return;
    pointerActive = false;
    camera.updateMatrixWorld();
    model.updateMatrixWorld();
    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObject(memberMesh, false)[0];
    setSelected(hit ? hit.instanceId : -1);
  }

  function tick(time) {
    frameId = requestAnimationFrame(tick);
    const delta = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 0.016;
    lastTime = time;

    updateCamera(delta);
    pick();
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
    pick();
    renderer.render(scene, camera);
  }

  function onPointerMove(event) {
    const rect = canvas.getBoundingClientRect();

    if (dragging) {
      const dx = event.clientX - lastDrag.x;
      const dy = event.clientY - lastDrag.y;
      if (Math.abs(dx) + Math.abs(dy) > 2) dragMoved = true;
      spin -= dx * 0.007;
      targetTilt = Math.max(-0.25, Math.min(0.95, targetTilt + dy * 0.005));
      lastDrag = { x: event.clientX, y: event.clientY };
      if (reducedMotion) renderOnce();
      return;
    }

    const nx = (event.clientX - rect.left) / rect.width;
    const ny = (event.clientY - rect.top) / rect.height;
    pointer.set(nx * 2 - 1, -(ny * 2 - 1));
    targetPointerX = nx * 2 - 1;
    targetTilt = 0.34 - (ny - 0.5) * 0.2;
    pointerActive = true;
    pointerInside = true;
    if (reducedMotion) renderOnce();
  }

  function onPointerDown(event) {
    if (event.pointerType === 'touch') return;
    dragging = true;
    dragMoved = false;
    lastDrag = { x: event.clientX, y: event.clientY };
    canvas.setPointerCapture(event.pointerId);
    canvas.style.cursor = 'grabbing';
  }

  function onPointerUp(event) {
    if (!dragging) return;
    dragging = false;
    if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
    canvas.style.cursor = selected === -1 ? 'grab' : 'crosshair';
    // A drag should not leave a stale selection behind.
    if (dragMoved) pointerActive = true;
  }

  function onPointerLeave() {
    pointerInside = false;
    targetPointerX = 0;
    setSelected(-1);
    if (reducedMotion) renderOnce();
  }

  function onScroll() {
    const rect = canvas.getBoundingClientRect();
    const progress = -rect.top / Math.max(rect.height, 1);
    targetScrollLift = Math.max(-1.2, Math.min(1.2, progress * 1.4));
  }

  canvas.style.cursor = 'grab';
  canvas.addEventListener('pointermove', onPointerMove, { passive: true });
  canvas.addEventListener('pointerdown', onPointerDown);
  canvas.addEventListener('pointerup', onPointerUp);
  canvas.addEventListener('pointercancel', onPointerUp);
  canvas.addEventListener('pointerleave', onPointerLeave, { passive: true });

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
    destroy() {
      stop();
      intersectionObserver.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('scroll', onScroll);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointercancel', onPointerUp);
      canvas.removeEventListener('pointerleave', onPointerLeave);

      unitBox.dispose();
      edgeGeometry.dispose();
      gridGeometry.dispose();
      selectionGeometry.dispose();
      memberMaterial.dispose();
      slabMaterial.dispose();
      edgeMaterial.dispose();
      gridMaterial.dispose();
      selectionMaterial.dispose();
      memberMesh.dispose();
      slabMesh.dispose();
      scene.clear();
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
}
