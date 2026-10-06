import { useEffect, useRef, useState } from 'react';

// Things you *act* on: buttons, cards, CTA links. These get the banana.
const ACTION_SELECTOR = 'a, button, [role="button"], summary, [data-cursor], [data-cursor-grow]';
// …except where a banana would be noise: plain inline text links (.link-line)
// and any region marked data-cursor-native (the footer). Links there keep the
// round cursor, which just grows a little to say "clickable".
const QUIET_SELECTOR = '[data-cursor-native], .link-line';
// Form fields get the system cursor back (a text caret matters there).
const FIELD_SELECTOR = 'input, textarea, select, [contenteditable="true"]';
const LABEL_SELECTOR = '[data-cursor]';
const FRAME_MS = 1000 / 60;

// The banana is drawn in a 32-unit box; its hotspot is the stem tip
// (top-left), so it points like an ordinary arrow.
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
 * The site cursor, in three states:
 *
 *   · round (default) — a gold dot locked to the pointer and a thin ring that
 *     trails softly behind it;
 *   · banana — over buttons, cards and call-to-action links the dot and ring
 *     give way to a small banana that sways with movement and squeezes on
 *     press; elements with data-cursor="Label" add a small gold label pill
 *     beside it ("View" on work cards);
 *   · quiet — over footer links and inline text links the round cursor stays,
 *     its ring just tightening and filling faintly, so a dense list of links
 *     doesn't turn into a parade of bananas.
 *
 * Form fields hand back the system cursor. Fine pointers with no
 * reduced-motion preference only; `has-cursor` (which hides the native
 * cursor) is added only once this is running, so a script failure can never
 * leave a visitor without one. No mix-blend-mode: difference-blended gold
 * vanishes on the site's gold surfaces.
 */
export default function Cursor() {
  const rootRef = useRef(null);
  const dotRef = useRef(null);
  const ringRef = useRef(null);
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
    const root = rootRef.current;
    const dot = dotRef.current;
    const ring = ringRef.current;
    const banana = bananaRef.current;
    const pill = pillRef.current;
    const label = labelRef.current;
    const doc = document.documentElement;
    doc.classList.add('has-cursor');

    let x = -100;
    let y = -100;
    let rx = x; // ring and pill trail softly
    let ry = y;
    let prevX = x;
    let rot = -10;
    let lastT = 0;
    let raf = 0;
    let placed = false;
    let mode = '';

    const render = (now) => {
      const dt = lastT ? Math.min(now - lastT, 50) : FRAME_MS;
      lastT = now;
      const f = dt / FRAME_MS;

      // Banana sway: lean with horizontal speed, settle back when still.
      const vx = (x - prevX) / f;
      prevX = x;
      const target = clamp(vx * 0.9, -20, 20) - 10;
      rot += (target - rot) * (1 - 0.82 ** f);

      const k = 1 - 0.8 ** f;
      rx += (x - rx) * k;
      ry += (y - ry) * k;

      dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      ring.style.transform = `translate3d(${rx.toFixed(2)}px, ${ry.toFixed(2)}px, 0)`;
      pill.style.transform = `translate3d(${rx.toFixed(1)}px, ${ry.toFixed(1)}px, 0)`;
      banana.style.transform = `translate3d(${x - HOT_X}px, ${y - HOT_Y}px, 0) rotate(${rot.toFixed(2)}deg)`;

      const settled =
        Math.abs(target - rot) < 0.05 && Math.abs(x - rx) < 0.1 && Math.abs(y - ry) < 0.1;
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

    const setTarget = (t) => {
      let next = '';
      if (t?.closest?.(FIELD_SELECTOR)) next = 'field';
      else if (t?.closest?.(ACTION_SELECTOR)) next = t.closest(QUIET_SELECTOR) ? 'quiet' : 'banana';

      const labelled = next === 'banana' ? t.closest(LABEL_SELECTOR) : null;
      if (labelled) {
        label.textContent = labelled.getAttribute('data-cursor');
        pill.dataset.show = '';
      } else {
        delete pill.dataset.show;
      }

      if (next !== mode) {
        if (next === 'banana') {
          // Start upright on the pointer, not wherever it was last seen.
          prevX = x;
          rot = -10;
        }
        mode = next;
        root.dataset.mode = mode;
        doc.classList.toggle('cursor-field', mode === 'field');
      }
      kick();
    };

    const onMove = (e) => {
      x = e.clientX;
      y = e.clientY;
      if (!placed) {
        placed = true;
        rx = prevX = x;
        ry = y;
        root.dataset.visible = '';
      }
      kick();
    };
    const onOver = (e) => setTarget(e.target);

    // Scrolling moves the page under a still mouse without reliably firing
    // pointerover, which left the banana or a label stuck on screen.
    // Re-check what is under the pointer once per frame while scrolling.
    let scrollQueued = false;
    const onScroll = () => {
      if (scrollQueued || !placed) return;
      scrollQueued = true;
      requestAnimationFrame(() => {
        scrollQueued = false;
        setTarget(document.elementFromPoint(x, y));
      });
    };
    const onDown = () => (root.dataset.down = '');
    const onUp = () => delete root.dataset.down;
    const onLeave = () => delete root.dataset.visible;
    const onEnter = () => {
      if (placed) root.dataset.visible = '';
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
      doc.classList.remove('has-cursor', 'cursor-field');
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div ref={rootRef} aria-hidden="true" className="cursor-root pointer-events-none fixed inset-0 z-[120]">
      <div ref={ringRef} className="cursor-ring">
        <span className="cursor-ring-shape" />
      </div>
      <div ref={pillRef} className="cursor-pill">
        <span ref={labelRef} className="cursor-pill-label" />
      </div>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={bananaRef} className="cursor-banana" style={{ transformOrigin: `${HOT_X}px ${HOT_Y}px` }}>
        <Banana />
      </div>
    </div>
  );
}
