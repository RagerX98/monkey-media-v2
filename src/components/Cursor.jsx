import { useEffect, useRef, useState } from 'react';
import mascotSolid from '../assets/mascot-icon-solid.webp';

const LINK_SELECTOR = 'a, button, [role="button"], label, summary, [data-cursor-grow]';
const LABEL_SELECTOR = '[data-cursor]';
const FRAME_MS = 1000 / 60;

/**
 * Two-part cursor: a dot locked to the pointer and a softer follower that
 * changes shape with context —
 *   · resting: a thin ring
 *   · over a link or button: the mascot
 *   · over anything with data-cursor="Label": a gold bubble with that label
 *
 * Fine pointers with no reduced-motion preference only; everyone else keeps
 * the native cursor. `has-cursor` (which hides the native one) is added only
 * once this is running, so a script failure can never leave a visitor with no
 * cursor at all.
 *
 * Deliberately no mix-blend-mode: difference-blended gold turns black over
 * the site's gold surfaces and the cursor vanishes exactly where it matters.
 */
export default function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const labelRef = useRef(null);
  const [enabled, setEnabled] = useState(false);

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
    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    const doc = document.documentElement;
    doc.classList.add('has-cursor');

    let tx = -100;
    let ty = -100;
    let rx = tx;
    let ry = ty;
    let lastT = 0;
    let raf = 0;
    let placed = false;

    const render = (now) => {
      const dt = lastT ? Math.min(now - lastT, 50) : FRAME_MS;
      lastT = now;
      const k = 1 - (1 - 0.2) ** (dt / FRAME_MS);
      rx += (tx - rx) * k;
      ry += (ty - ry) * k;
      dot.style.transform = `translate3d(${tx}px,${ty}px,0)`;
      ring.style.transform = `translate3d(${rx.toFixed(2)}px,${ry.toFixed(2)}px,0)`;
      if (Math.abs(tx - rx) < 0.1 && Math.abs(ty - ry) < 0.1) {
        raf = 0;
        lastT = 0;
        return;
      }
      raf = requestAnimationFrame(render);
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(render);
    };

    const onMove = (e) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!placed) {
        placed = true;
        rx = tx;
        ry = ty;
        dot.style.opacity = '1';
        ring.style.opacity = '1';
      }
      kick();
    };

    const setMode = (target) => {
      const labelled = target?.closest?.(LABEL_SELECTOR);
      if (labelled) {
        ring.dataset.mode = 'label';
        label.textContent = labelled.getAttribute('data-cursor');
        return;
      }
      ring.dataset.mode = target?.closest?.(LINK_SELECTOR) ? 'link' : '';
    };
    const onOver = (e) => setMode(e.target);
    const onDown = () => (ring.dataset.down = '');
    const onUp = () => delete ring.dataset.down;
    const onLeave = () => {
      dot.style.opacity = '0';
      ring.style.opacity = '0';
    };
    const onEnter = () => {
      if (!placed) return;
      dot.style.opacity = '1';
      ring.style.opacity = '1';
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerover', onOver, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);
    document.documentElement.addEventListener('mouseenter', onEnter);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerover', onOver);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      document.documentElement.removeEventListener('mouseenter', onEnter);
      doc.classList.remove('has-cursor');
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[120]">
      <div ref={ringRef} className="cursor-ring" style={{ opacity: 0 }}>
        <span className="cursor-ring-shape" />
        <img src={mascotSolid} alt="" className="cursor-mascot" draggable={false} />
        <span ref={labelRef} className="cursor-label" />
      </div>
      <div ref={dotRef} className="cursor-dot" style={{ opacity: 0 }} />
    </div>
  );
}
