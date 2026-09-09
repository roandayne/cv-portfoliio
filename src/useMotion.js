import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * The scroll-reveal driver.
 *
 * Markup opts in with `data-reveal` (this element) or `data-reveal-group`
 * (its children, in sequence). Everything else — the hidden state, the
 * easing, the reduced-motion escape — lives in styles/motion.css; this file
 * only says *when*, by adding `is-in` once an element has entered the
 * viewport. Each element is unobserved as soon as it has played: the reveal
 * is an entrance, not a state that toggles on the way back up.
 *
 * The observer is rebuilt on every route change, which is when the tree it
 * watches is replaced.
 */

const DEFAULT_STEP = 80;

function armGroup(group) {
  const step = Number(group.dataset.revealStep) || DEFAULT_STEP;
  Array.from(group.children).forEach((child, i) => {
    child.style.setProperty('--reveal-delay', `${i * step}ms`);
  });
}

function useScrollReveal(pathname) {
  useEffect(() => {
    const targets = document.querySelectorAll('[data-reveal], [data-reveal-group]');
    if (!targets.length || typeof IntersectionObserver !== 'function') return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-in');
          observer.unobserve(entry.target);
        });
      },
      // A little short of the bottom edge, so a section starts moving once it
      // is properly in the frame rather than the instant it clears it.
      { rootMargin: '0px 0px -10% 0px', threshold: 0 },
    );

    targets.forEach((el) => {
      if (el.hasAttribute('data-reveal-group')) armGroup(el);
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [pathname]);
}

/**
 * The cursor-tracked highlight on the dark project cards.
 *
 * Position is handed to CSS as two custom properties and read by the card's
 * radial gradient. Pointer-capable devices only — on a touch screen there is
 * no pointer to follow, and the card keeps its plain hover-less state.
 */
function useSpotlight(pathname) {
  useEffect(() => {
    if (!window.matchMedia?.('(hover: hover) and (pointer: fine)').matches) return undefined;

    const cards = Array.from(document.querySelectorAll('[data-spotlight]'));
    if (!cards.length) return undefined;

    // The box is measured once per hover rather than once per move: a card
    // cannot change size while the pointer is inside it.
    let box = null;

    const onEnter = (event) => {
      box = event.currentTarget.getBoundingClientRect();
    };

    const onMove = (event) => {
      if (!box) box = event.currentTarget.getBoundingClientRect();
      const x = ((event.clientX - box.left) / box.width) * 100;
      const y = ((event.clientY - box.top) / box.height) * 100;
      event.currentTarget.style.setProperty('--mx', `${x}%`);
      event.currentTarget.style.setProperty('--my', `${y}%`);
    };

    const onLeave = () => {
      box = null;
    };

    cards.forEach((card) => {
      card.addEventListener('pointerenter', onEnter);
      card.addEventListener('pointermove', onMove);
      card.addEventListener('pointerleave', onLeave);
    });

    return () => {
      cards.forEach((card) => {
        card.removeEventListener('pointerenter', onEnter);
        card.removeEventListener('pointermove', onMove);
        card.removeEventListener('pointerleave', onLeave);
      });
    };
  }, [pathname]);
}

/** Everything motion-related, mounted once from App. */
export default function useMotion() {
  const { pathname } = useLocation();

  // Tells the failsafe in index.html that the bundle arrived, so it leaves the
  // `js` class — and with it every hidden reveal state — in place.
  useEffect(() => {
    document.documentElement.setAttribute('data-motion', 'on');
  }, []);

  useScrollReveal(pathname);
  useSpotlight(pathname);
}
