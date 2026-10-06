import { useEffect, useRef, useState } from 'react';

const LINK_SELECTOR = 'a, button, [role="button"], label, summary, [data-cursor-grow]';
const LABEL_SELECTOR = '[data-cursor]';
const FRAME_MS = 1000 / 60;

// Drawn in a 32-unit box; the hotspot is the tip of the stem, top-left, so
// the banana points like an ordinary arrow cursor.
const SIZE = 30;
const HOT_X = (8.1 / 32) * SIZE;
const HOT_Y = (2.5 / 32) * SIZE;

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

function Banana() {
  return (
    <svg viewBox="0 0 32 32" width={SIZE} height={SIZE} className="cursor-banana-svg" aria-hidden="true">
      <defs>
        <linearGradient id="cursor-banana-fill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffe14a" />
          <stop offset="1" stopColor="#ffbf00" />
        </linearGradient>
      </defs>
      <path
        d="M5.4 7.2C2.2 17.6 9.4 28.8 25.6 28.7C28.4 28.6 28.9 25.6 26.4 25.1C17.4 23.6 12 16.9 10.6 6.8C10.3 5.6 6 5.7 5.4 7.2Z"
        fill="url(#cursor-banana-fill)"
        stroke="#0d0d0d"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path d="M10.6 7.6C11.8 16.6 17 23 25.4 25.1" fill="none" stroke="#c98a00" strokeOpacity=".55" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M6.9 10.5C6.4 17.6 11 24.4 19.6 26.6" fill="none" stroke="#fff" strokeOpacity=".6" strokeWidth="1.1" strokeLinecap="round" />
      <path d="M6.3 6.6L9.7 6.2L9.1 2.4L7.1 2.7Z" fill="#4a3510" stroke="#0d0d0d" strokeWidth="1.2" strokeLinejoin="round" />
      <circle cx="26.9" cy="27" r="1" fill="#4a3510" />
    </svg>
  );
}

/**
 * The pointer is a small banana. It sits exactly on the real pointer (no
 * lag, so it never feels like input delay), sways a little with sideways
 * movement, leans in over links and buttons, and squeezes on press. Over any
 * element with data-cursor="Label" a small gold pill with that label trails
 * beside it ("View" on work cards, "Open" on service rows).
 *
 * Fine pointers with no reduced-motion preference only; touch screens and
 * reduced motion keep the native cursor. `has-cursor` (which hides the native
 * one) is added only once this is running, so a script failure can never
 * leave a visitor with no cursor.
 */
export default function Cursor() {
  const bananaRef = useRef(null);
  const pillRef = useRef(null);
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
    const banana = bananaRef.current;
    const pill = pillRef.current;
    const label = labelRef.current;
    const doc = document.documentElement;
    doc.classList.add('has-cursor');

    let x = -100;
    let y = -100;
    let px = x; // pill follows softly
    let py = y;
    let prevX = x;
    let rot = 0;
    let lastT = 0;
    let raf = 0;
    let placed = false;
    let mode = '';

    const render = (now) => {
      const dt = lastT ? Math.min(now - lastT, 50) : FRAME_MS;
      lastT = now;
      const f = dt / FRAME_MS;

      // Sway: lean with horizontal speed, settle back when still.
      const vx = (x - prevX) / f;
      prevX = x;
      const target = clamp(vx * 0.9, -20, 20) + (mode === 'link' ? -14 : 0);
      rot += (target - rot) * (1 - 0.82 ** f);

      const k = 1 - 0.78 ** f;
      px += (x - px) * k;
      py += (y - py) * k;

      banana.style.transform = `translate3d(${x - HOT_X}px, ${y - HOT_Y}px, 0) rotate(${rot.toFixed(2)}deg)`;
      pill.style.transform = `translate3d(${px.toFixed(1)}px, ${py.toFixed(1)}px, 0)`;

      const settled =
        Math.abs(target - rot) < 0.05 && Math.abs(x - px) < 0.1 && Math.abs(y - py) < 0.1;
      if (settled) {
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
      x = e.clientX;
      y = e.clientY;
      if (!placed) {
        placed = true;
        prevX = px = x;
        py = y;
        banana.style.opacity = '1';
      }
      kick();
    };

    const onOver = (e) => setTarget(e.target);
    const setTarget = (t) => {
      const labelled = t?.closest?.(LABEL_SELECTOR);
      if (labelled) {
        label.textContent = labelled.getAttribute('data-cursor');
        pill.dataset.show = '';
      } else {
        delete pill.dataset.show;
      }
      mode = t?.closest?.(LINK_SELECTOR) ? 'link' : '';
      banana.dataset.mode = mode;
      kick();
    };
    // Scrolling moves the page under a still mouse without reliably firing
    // pointerover, which left labels like "View" stuck on screen. Re-check
    // what is under the pointer once per frame while scrolling.
    let scrollQueued = false;
    const onScroll = () => {
      if (scrollQueued || !placed) return;
      scrollQueued = true;
      requestAnimationFrame(() => {
        scrollQueued = false;
        setTarget(document.elementFromPoint(x, y));
      });
    };
    const onDown = () => (banana.dataset.down = '');
    const onUp = () => delete banana.dataset.down;
    const onLeave = () => {
      banana.style.opacity = '0';
      delete pill.dataset.show;
    };
    const onEnter = () => {
      if (placed) banana.style.opacity = '1';
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerover', onOver, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });
    doc.addEventListener('mouseleave', onLeave);
    doc.addEventListener('mouseenter', onEnter);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerover', onOver);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      doc.removeEventListener('mouseleave', onLeave);
      doc.removeEventListener('mouseenter', onEnter);
      doc.classList.remove('has-cursor');
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[120]">
      <div ref={pillRef} className="cursor-pill">
        <span ref={labelRef} className="cursor-pill-label" />
      </div>
      <div
        ref={bananaRef}
        className="cursor-banana"
        style={{ opacity: 0, transformOrigin: `${HOT_X}px ${HOT_Y}px` }}
      >
        <Banana />
      </div>
    </div>
  );
}
