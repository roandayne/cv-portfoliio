import { useCallback, useEffect, useRef, useState } from 'react';
import FrameDrawing from './FrameDrawing';
import './frame.css';

/**
 * Decides how much work this device should be asked to do.
 *
 * 'none'      — save-data or a slow connection: the drawing is enough.
 * 'deferred'  — phones and low-core devices: load the model, but only after
 *               the visitor has interacted, so it can never be measured as
 *               the page's largest contentful paint.
 * 'idle'      — everything else: load as soon as the main thread is free.
 */
function loadStrategy() {
  const connection = navigator.connection;
  if (connection) {
    if (connection.saveData) return 'none';
    if (/^(slow-)?2g$/.test(connection.effectiveType || '')) return 'none';
  }

  const smallScreen = window.matchMedia('(max-width: 48rem)').matches;
  const lowMemory = navigator.deviceMemory ? navigator.deviceMemory < 4 : false;
  const fewCores = navigator.hardwareConcurrency ? navigator.hardwareConcurrency <= 4 : false;

  return smallScreen || lowMemory || fewCores ? 'deferred' : 'idle';
}

/** Runs `callback` once the browser is idle, and returns a canceller. */
function whenIdle(callback) {
  if (typeof requestIdleCallback === 'function') {
    const id = requestIdleCallback(callback, { timeout: 2000 });
    return () => cancelIdleCallback(id);
  }
  const id = setTimeout(callback, 400);
  return () => clearTimeout(id);
}

/** Runs `callback` after the first scroll, pointer, or key input. */
function whenInteracted(callback) {
  const events = ['scroll', 'pointerdown', 'keydown'];
  const handler = () => {
    events.forEach((event) => window.removeEventListener(event, handler));
    callback();
  };
  events.forEach((event) => window.addEventListener(event, handler, { passive: true, once: true }));
  return () => events.forEach((event) => window.removeEventListener(event, handler));
}

/**
 * The hero visual. An SVG drawing paints first and is what the browser
 * measures; the WebGL model loads afterwards, on devices that can afford it,
 * and fades in over the drawing. If WebGL is unavailable, three fails to load,
 * or the device is constrained, the drawing simply stays.
 */
const StructuralFrame = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [live, setLive] = useState(false);
  const [selection, setSelection] = useState(null);

  const handleSelect = useCallback((meta) => setSelection(meta), []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const strategy = loadStrategy();
    if (strategy === 'none') return undefined;

    let handle = null;
    let cancelled = false;
    const cancellers = [];

    async function load() {
      if (cancelled) return;
      try {
        const { initFrame, isWebGLAvailable } = await import('./frameScene');
        if (cancelled || !isWebGLAvailable() || !canvasRef.current) return;

        handle = initFrame(canvasRef.current, {
          reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
          quality: strategy === 'deferred' ? 'reduced' : 'full',
          onSelect: handleSelect,
        });
        setLive(true);
      } catch {
        // The drawing is already on screen; nothing further is needed.
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        observer.disconnect();

        if (strategy === 'deferred') {
          cancellers.push(whenInteracted(() => cancellers.push(whenIdle(load))));
        } else {
          cancellers.push(whenIdle(load));
        }
      },
      { rootMargin: '200px' },
    );

    observer.observe(container);

    return () => {
      cancelled = true;
      observer.disconnect();
      cancellers.forEach((cancel) => cancel());
      if (handle) handle.destroy();
    };
  }, [handleSelect]);

  return (
    <div className="frame" ref={containerRef}>
      <FrameDrawing
        className={`frame__drawing${live ? ' is-replaced' : ''}`}
        tone="dark"
        title="Axonometric drawing of a four-bay, three-storey structural frame"
      />
      <canvas
        ref={canvasRef}
        className={`frame__canvas${live ? ' is-live' : ''}`}
        aria-hidden="true"
      />

      {live ? (
        <p className="frame__hint" aria-hidden="true">
          <span className="frame__hintDot" />
          Drag to rotate · point at a member
        </p>
      ) : null}

      {/* The readout mirrors how a model viewer identifies a picked element. */}
      <p className="frame__readout" role="status" aria-live="off">
        {selection ? (
          <>
            <span className="frame__readoutKind">{selection.kind}</span>
            <span className="frame__readoutRef">
              Level {selection.level} · Grid {selection.ref}
            </span>
          </>
        ) : (
          <span className="frame__readoutIdle">
            {live ? 'No element selected' : 'Structural frame — axonometric'}
          </span>
        )}
      </p>
    </div>
  );
};

export default StructuralFrame;
