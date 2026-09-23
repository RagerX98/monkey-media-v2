import { useCallback, useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1];

/**
 * The service card used by both the homepage teaser and the full Services
 * page. Previously the teaser had the full treatment (slide-in, lift, glow)
 * while Services.jsx rendered a plain bordered div, so the page that lists
 * what the agency sells looked plainer than its own teaser.
 *
 * Visuals live in `.svc-card` in index.css — see the note there on why the
 * spotlight and rim are opacity-only pseudo-elements.
 *
 * `index` drives both the entrance direction and its delay. `staggerCap`
 * bounds that delay so a long single-column grid on mobile doesn't leave the
 * last card waiting most of a second after its own scroll trigger.
 */
export default function ServiceCard({ service, index = 0, staggerCap = 0.24 }) {
  const ref = useRef(null);
  const frame = useRef(0);
  const reduceMotion = useReducedMotion();

  const handlePointerMove = useCallback((e) => {
    // Coarse pointers get no spotlight: there is no hover to track, and the
    // work would run on every scroll-induced touchmove.
    if (e.pointerType !== 'mouse') return;

    // Read coordinates now, act on them at most once per frame.
    const { clientX, clientY } = e;
    if (frame.current) return;

    frame.current = requestAnimationFrame(() => {
      frame.current = 0;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${clientX - rect.left}px`);
      el.style.setProperty('--my', `${clientY - rect.top}px`);
    });
  }, []);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  const fromLeft = index % 2 === 0;
  const delay = Math.min(index * 0.08, staggerCap);

  const entrance = reduceMotion
    ? { initial: { opacity: 0 }, whileInView: { opacity: 1 }, transition: { duration: 0.3 } }
    : {
        initial: { opacity: 0, x: fromLeft ? -70 : 70 },
        whileInView: { opacity: 1, x: 0 },
        transition: { duration: 0.7, delay, ease: EASE },
      };

  return (
    <motion.article
      ref={ref}
      onPointerMove={handlePointerMove}
      viewport={{ once: true, amount: 0.3 }}
      {...entrance}
      className="svc-card group rounded-3xl border border-white/10 bg-void p-8 transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_26px_54px_-20px_rgba(139,92,246,0.55)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 lg:p-10"
    >
      <span className="text-sm font-bold text-purple">{service.number}</span>
      <h3 className="mt-6 text-2xl font-black uppercase leading-tight text-paper lg:text-[1.75rem]">
        {service.title}
      </h3>
      <p className="mt-3 text-sm text-paper/60 transition-colors duration-300 ease-out group-hover:text-paper/85">
        {service.blurb}
      </p>
    </motion.article>
  );
}
