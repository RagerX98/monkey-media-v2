import { useEffect, useRef, useState } from 'react';
import mascotSolid from '../assets/mascot-icon-solid.webp';

const GROW_SELECTOR = 'a, button, [role="button"], label, [data-cursor-grow]';

// Fraction of the remaining distance covered per 60fps frame. Normalised by
// real frame time below, so the feel is identical at 60Hz and 120Hz — a fixed
// per-frame fraction silently doubles in speed on a 120Hz display.
//
// 0.4 closes 95% of a gap in ~6 frames (~100ms): enough weight to read as
// designed, short enough that it never feels like input lag. Raise toward 1
// for a cursor locked to the pointer, lower for more trail.
const FOLLOW = 0.4;

// Below this the chase is visually finished, so the loop parks.
const SETTLE_PX = 0.1;

const FRAME_MS = 1000 / 60;

/**
 * Cursor: a small dot that becomes the Monkey Media mascot over anything
 * interactive. Mounted once in Layout.
 *
 * Deliberately carries no `mix-blend-mode`. The first version used
 * difference-blended gold, which turned into a black hole over the gold
 * button hover state — difference(#ffd700, #ffd700) is pure black — so the
 * cursor broke down exactly where it was meant to be most expressive. The
 * mascot swap solves that properly: over a button there is no dot left to
 * clash with the button's colour.
 *
 * Only runs for a fine pointer with no reduced-motion preference. Touch
 * devices and anyone who asked their OS for less motion keep the native
 * cursor, and `has-custom-cursor` (which hides it) is applied only once this
 * component is live, so a JS failure can never leave a visitor with no cursor.
 *
 * Position is written straight to the node in a rAF loop rather than through
 * React state, which would re-render every frame. The loop parks itself once
 * the dot catches up and restarts on the next move, so an idle page is free.
 */
export default function CustomCursor() {
  const rootRef = useRef(null);
  const [enabled, setEnabled] = useState(false);

  // A visitor can change the OS motion setting, or dock a laptop to a mouse,
  // mid-session — so keep watching rather than deciding once.
  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

    const sync = () => setEnabled(fine.matches && !reduce.matches);
    sync();

    fine.addEventListener('change', sync);
    reduce.addEventListener('change', sync);
    return () => {
      fine.removeEventListener('change', sync);
      reduce.removeEventListener('change', sync);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return undefined;

    const root = rootRef.current;
    if (!root) return undefined;

    const doc = document.documentElement;
    doc.classList.add('has-custom-cursor');

    let raf = 0;
    let curX = 0;
    let curY = 0;
    let targetX = 0;
    let targetY = 0;
    let lastT = 0;
    let placed = false;

    function render(now) {
      // Frame-time normalised smoothing, clamped so a long stall (a tab
      // regaining focus, a GC pause) can't teleport the dot.
      const dt = lastT ? Math.min(now - lastT, 50) : FRAME_MS;
      lastT = now;
      const t = 1 - (1 - FOLLOW) ** (dt / FRAME_MS);

      const dx = targetX - curX;
      const dy = targetY - curY;
      curX += dx * t;
      curY += dy * t;

      // A pure translate, with no percentage terms: centring lives in CSS on
      // an inner layer of fixed size. A `translate(-50%,-50%)` here would
      // shift the cursor as the mascot changed size mid-transition.
      root.style.transform = `translate3d(${curX}px, ${curY}px, 0)`;

      if (Math.abs(dx) < SETTLE_PX && Math.abs(dy) < SETTLE_PX) {
        raf = 0; // caught up — park until the pointer moves again
        lastT = 0;
        return;
      }
      raf = requestAnimationFrame(render);
    }

    function kick() {
      if (!raf) raf = requestAnimationFrame(render);
    }

    function onMove(e) {
      targetX = e.clientX;
      targetY = e.clientY;

      // First sighting: drop it straight onto the pointer rather than flying
      // it in from the top-left corner.
      if (!placed) {
        placed = true;
        curX = targetX;
        curY = targetY;
        root.style.opacity = '1';
      }
      kick();
    }

    function onOver(e) {
      if (e.target.closest?.(GROW_SELECTOR)) root.dataset.grown = 'true';
    }

    function onOut(e) {
      if (e.target.closest?.(GROW_SELECTOR)) delete root.dataset.grown;
    }

    const onLeave = () => {
      root.style.opacity = '0';
    };
    const onEnter = () => {
      if (placed) root.style.opacity = '1';
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover', onOver, { passive: true });
    document.addEventListener('mouseout', onOut, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      doc.classList.remove('has-custom-cursor');
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      style={{ opacity: 0 }}
      className="pointer-events-none fixed left-0 top-0 z-[100] will-change-transform"
    >
      {/* Fixed-size stacking layer, so the outer transform stays a pure
          translate. Both children share one grid cell and cross-fade.
          Styled in index.css. */}
      <span className="cursor-layer">
        <span className="cursor-dot" />
        {/* Mounted from the start rather than on first hover, so the mascot
            is already decoded before it is ever shown. */}
        <img src={mascotSolid} alt="" className="cursor-monkey" draggable={false} />
      </span>
    </div>
  );
}
