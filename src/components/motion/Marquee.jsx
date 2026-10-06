import { useEffect, useRef } from 'react';
import { gsap, prefersReducedMotion } from '../../lib/gsap';

/**
 * An endless strip that drifts on its own, surges with scroll speed and turns
 * around when you scroll back up. One copy of `children` is measured and the
 * track holds `copies` of it, so the wrap is invisible.
 *
 * Only runs while on screen; reduced motion leaves it still.
 */
export default function Marquee({
  children,
  speed = 60, // px per second at rest
  reverse = false,
  copies = 4,
  className = '',
  trackClassName = '',
}) {
  const rootRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    if (!root || !track || prefersReducedMotion()) return undefined;

    let unit = 0;
    let x = 0;
    let dir = reverse ? 1 : -1;
    let boost = 0;
    let lastY = window.scrollY;
    let running = false;

    const measure = () => {
      unit = track.firstElementChild ? track.firstElementChild.offsetWidth : 0;
    };

    const tick = (_t, deltaMs) => {
      const dt = Math.min(deltaMs, 50) / 1000;
      const y = window.scrollY;
      const dy = y - lastY;
      lastY = y;
      if (Math.abs(dy) > 0.5) {
        // Follow the scroll direction, and add a burst proportional to speed.
        dir = (dy > 0 ? -1 : 1) * (reverse ? -1 : 1);
        boost = Math.min(boost + Math.abs(dy) * 6, 1600);
      }
      boost *= Math.pow(0.04, dt); // decays to ~4% per second
      x += dir * (speed + boost) * dt;
      if (unit > 0) {
        if (x <= -unit) x += unit;
        else if (x > 0) x -= unit;
      }
      track.style.transform = `translate3d(${x.toFixed(2)}px,0,0)`;
    };

    const start = () => {
      if (running) return;
      running = true;
      lastY = window.scrollY;
      gsap.ticker.add(tick);
    };
    const stop = () => {
      running = false;
      gsap.ticker.remove(tick);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), {
      rootMargin: '100px 0px',
    });
    io.observe(root);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
    };
  }, [speed, reverse]);

  return (
    <div ref={rootRef} className={`overflow-hidden ${className}`}>
      <div ref={trackRef} className={`marquee-track ${trackClassName}`}>
        {Array.from({ length: copies }, (_, i) => (
          <div key={i} className="flex shrink-0" aria-hidden={i > 0 ? true : undefined}>
            {children}
          </div>
        ))}
      </div>
    </div>
  );
}
