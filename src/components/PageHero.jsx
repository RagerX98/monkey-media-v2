import { useLayoutEffect, useRef } from 'react';
import Split from './motion/Split';
import MonkeyFace from './brand/MonkeyFace';
import { gsap, prefersReducedMotion } from '../lib/gsap';
import { onReady } from '../lib/ready';

/**
 * Opening block for the inner pages: an eyebrow, a giant headline that rises
 * in once the page is visible, an intro line, and the mascot watching from the
 * corner. `children` render under the intro (chips, buttons).
 */
export default function PageHero({
  eyebrow,
  title,
  accent,
  intro,
  children,
  face = true,
  size = 'xl',
  className = '',
}) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return undefined;
    const q = gsap.utils.selector(el);
    const ctx = gsap.context(() => {});
    gsap.set(q('[data-hero-fade]'), { opacity: 0, y: 24 });
    gsap.set(q('[data-hero-face]'), { scale: 0, rotate: -30 });
    const cancel = onReady(() =>
      ctx.add(() => {
        gsap.to(q('[data-hero-fade]'), { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out', stagger: 0.08, delay: 0.35 });
        gsap.to(q('[data-hero-face]'), { scale: 1, rotate: 0, duration: 1.1, ease: 'back.out(1.8)', delay: 0.2 });
      })
    );
    return () => {
      cancel();
      ctx.revert();
    };
  }, []);

  return (
    <section ref={ref} className={`relative overflow-hidden bg-ink pb-16 pt-36 md:pb-24 md:pt-48 ${className}`}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-40 h-[620px] w-[620px] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.28),transparent_65%)]"
      />
      <div className="relative mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="flex items-center gap-4" data-hero-fade>
          <span className="h-2 w-2 rounded-full bg-gold" />
          <span className="eyebrow text-paper/60">{eyebrow}</span>
        </div>

        <Split
          as="h1"
          trigger="load"
          text={title}
          accent={accent}
          className={`display mt-8 text-[clamp(3rem,15vw,5.6rem)] font-bold text-paper md:font-extrabold ${
            size === 'lg' ? 'md:text-[clamp(4rem,7.4vw,9rem)]' : 'md:text-[clamp(5rem,9.6vw,11.5rem)]'
          }`}
        />
        {face && (
          <div
            data-hero-face
            className="absolute bottom-0 right-10 hidden w-[clamp(120px,11vw,180px)] rotate-6 xl:block"
          >
            <MonkeyFace />
          </div>
        )}

        {intro && (
          <p data-hero-fade className="mt-10 max-w-xl text-lg leading-relaxed text-paper/65 md:text-xl">
            {intro}
          </p>
        )}
        {children && (
          <div data-hero-fade className="mt-10">
            {children}
          </div>
        )}
      </div>
    </section>
  );
}
