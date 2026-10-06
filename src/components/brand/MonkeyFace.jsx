import { forwardRef, useEffect, useRef } from 'react';
import { watchPointer } from '../../lib/pointer';
import { BANANA, EYES, FACE, HEAD, VIEWBOX } from './monkeyPaths';

const LOOK_X = 26; // max eye travel, in artwork units (face is ~665 wide)
const LOOK_Y = 22;
const EASE = 0.14;

/**
 * The mascot, drawn as vector paths, with eyes that follow the pointer and an
 * occasional blink. On touch screens (or once the mouse has been still for a
 * few seconds) the eyes glance around on their own instead, so the face never
 * looks frozen.
 *
 * Decorative by default; pass `label` to expose it to assistive tech.
 */
const MonkeyFace = forwardRef(function MonkeyFace(
  {
    className = '',
    style,
    track = true,
    blink = true,
    head = BANANA,
    face = '#ffffff',
    eye = BANANA,
    label,
    children,
    viewBox = VIEWBOX,
    group = false,
  },
  ref
) {
  const svgRef = useRef(null);
  const eyeRefs = useRef([]);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    let unwatch = null;
    let visible = false;
    const cur = { x: 0, y: 0 };
    const wander = { x: 0, y: 0, next: 0 };

    const sub = {
      read: () => svg.getBoundingClientRect(),
      write(rect, p, now) {
        let tx = 0;
        let ty = 0;
        const idle = !p.fine || now - p.lastMove > 3200;
        if (track && !idle && rect.width) {
          const dx = p.x - (rect.left + rect.width / 2);
          const dy = p.y - (rect.top + rect.height / 2);
          const dist = Math.hypot(dx, dy) || 1;
          const reach = Math.min(1, dist / (rect.width * 0.9 + 140));
          tx = (dx / dist) * reach * LOOK_X;
          ty = (dy / dist) * reach * LOOK_Y;
        } else {
          if (now > wander.next) {
            const a = Math.random() * Math.PI * 2;
            const r = Math.random() < 0.3 ? 0 : 0.5 + Math.random() * 0.5;
            wander.x = Math.cos(a) * r * LOOK_X;
            wander.y = Math.sin(a) * r * LOOK_Y;
            wander.next = now + 1400 + Math.random() * 2200;
          }
          tx = wander.x;
          ty = wander.y;
        }
        cur.x += (tx - cur.x) * EASE;
        cur.y += (ty - cur.y) * EASE;
        const t = `translate(${cur.x.toFixed(2)}px, ${cur.y.toFixed(2)}px)`;
        for (const el of eyeRefs.current) if (el) el.style.transform = t;
      },
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !unwatch) unwatch = watchPointer(sub);
      if (!visible && unwatch) {
        unwatch();
        unwatch = null;
      }
    });
    io.observe(svg);

    // Blinks: a random rhythm, now and then a double blink.
    let blinkTimer = 0;
    const doBlink = () => {
      if (visible) {
        svg.dataset.blink = '';
        setTimeout(() => delete svg.dataset.blink, 170);
        if (Math.random() < 0.22) {
          setTimeout(() => {
            svg.dataset.blink = '';
            setTimeout(() => delete svg.dataset.blink, 150);
          }, 300);
        }
      }
      blinkTimer = setTimeout(doBlink, 2200 + Math.random() * 3800);
    };
    if (blink) blinkTimer = setTimeout(doBlink, 1200 + Math.random() * 2000);

    return () => {
      io.disconnect();
      if (unwatch) unwatch();
      clearTimeout(blinkTimer);
    };
  }, [track, blink]);

  // `group` renders a bare <g> in artwork units, for drawing the mascot inside
  // a larger SVG (the hero dive), where the parent owns the transform.
  const Root = group ? 'g' : 'svg';
  const rootProps = group
    ? { className: `monkey-face ${className}`, style }
    : {
        viewBox,
        className: `monkey-face ${className}`,
        style,
        role: label ? 'img' : undefined,
        'aria-label': label,
        'aria-hidden': label ? undefined : true,
        focusable: 'false',
      };

  return (
    <Root
      ref={(node) => {
        svgRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      }}
      {...rootProps}
    >
      <path d={HEAD} fill={head} fillRule="evenodd" />
      <path d={FACE} fill={face} />
      {EYES.map((e, i) => (
        // Three layers because each owns one transform: the outer group is
        // moved by the look loop, the middle one squashes for a blink (CSS),
        // and the ellipse keeps the artwork's tilt as an SVG attribute.
        <g key={i} ref={(n) => (eyeRefs.current[i] = n)}>
          <g className="monkey-lid">
            <ellipse
              cx={e.cx}
              cy={e.cy}
              rx={e.rx}
              ry={e.ry}
              fill={eye}
              transform={`rotate(${e.tilt} ${e.cx} ${e.cy})`}
            />
          </g>
        </g>
      ))}
      {children}
    </Root>
  );
});

export default MonkeyFace;
