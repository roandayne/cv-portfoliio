import { useCallback, useEffect, useRef, useState } from 'react';
import CosmosDrawing from './CosmosDrawing';
import './cosmos.css';

/**
 * Decides how much work this device should be asked to do.
 *
 * 'none'      — save-data or a slow connection: the drawing is enough.
 * 'deferred'  — phones and low-core devices: load the scene, but only after
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
 * The hero visual: a full-bleed layer over the whole hero, so the burst carries
 * across the copy rather than staying boxed in a column.
 *
 * An SVG drawing paints first and is what the browser measures; the WebGL
 * cosmos loads afterwards, on devices that can afford it, and fades in over the
 * drawing. If WebGL is unavailable, three fails to load, or the device is
 * constrained, the drawing simply stays.
 */
const Cosmos = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const [live, setLive] = useState(false);
  const [animated, setAnimated] = useState(false);

  const detonate = useCallback(() => {
    if (sceneRef.current) sceneRef.current.detonate();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const strategy = loadStrategy();
    if (strategy === 'none') return undefined;

    let cancelled = false;
    const cancellers = [];

    async function load() {
      if (cancelled) return;
      try {
        const { initCosmos, isWebGLAvailable } = await import('./cosmosScene');
        if (cancelled || !isWebGLAvailable() || !canvasRef.current) return;

        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        sceneRef.current = initCosmos(canvasRef.current, {
          reducedMotion: reduced,
          quality: strategy === 'deferred' ? 'reduced' : 'full',
          // The layer covers the hero and passes pointer events through, so the
          // section beneath it is what drags and clicks are heard on.
          interactionTarget: container.parentElement || undefined,
        });
        setLive(true);
        // Without an animation loop there is nothing for a detonation to play
        // out in, so the control is not offered rather than offered and inert.
        setAnimated(!reduced);
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
      if (sceneRef.current) {
        sceneRef.current.destroy();
        sceneRef.current = null;
      }
    };
  }, []);

  return (
    <div className="cosmos" ref={containerRef}>
      <CosmosDrawing className={`cosmos__drawing${live ? ' is-replaced' : ''}`} tone="dark" />
      <canvas
        ref={canvasRef}
        className={`cosmos__canvas${live ? ' is-live' : ''}`}
        aria-hidden="true"
      />

      {/* Held in a .page so the control lines up with the hero's own copy. */}
      {live && animated ? (
        <div className="cosmos__hud">
          <div className="page cosmos__hudInner">
            {/* The pointer can set the burst off by clicking the hero; this is
                the same action for anyone reaching the page by keyboard. */}
            <button className="cosmos__action" type="button" onClick={detonate}>
              <span className="cosmos__actionDot" />
              Detonate
              <span className="cosmos__actionHint" aria-hidden="true">
                · drag to orbit
              </span>
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Cosmos;
