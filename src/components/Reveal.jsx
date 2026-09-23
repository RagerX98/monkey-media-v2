import { useRef, useEffect } from 'react';
import { gsap } from '../lib/gsap';

/**
 * Scroll-triggered fade-up, used for most below-the-fold content on the site.
 *
 * Two behaviours changed together here:
 *
 * 1. `gsap.matchMedia` gates the animation on `prefers-reduced-motion`. Every
 *    Framer component on the site already honoured that setting while all four
 *    GSAP ones ignored it — and since this wrapper carries the majority of the
 *    page, it was the bulk of the problem. Under reduced motion the content is
 *    simply placed in its final state.
 *
 * 2. `once: true` replaces `toggleActions: 'play none none reverse'`, which
 *    faded content back out whenever a visitor scrolled up past it. That was
 *    already judged wrong for CountUp and fixed there; this is the same call.
 */
export default function Reveal({
  children,
  as: Tag = 'div',
  className = '',
  y = 40,
  delay = 0,
  duration = 0.8,
  ...props
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(
        el,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration,
          delay,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        }
      );
    });

    mm.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set(el, { opacity: 1, y: 0 });
    });

    return () => mm.revert();
  }, [y, delay, duration]);

  return (
    <Tag ref={ref} className={className} {...props}>
      {children}
    </Tag>
  );
}
