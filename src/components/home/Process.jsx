import { useLayoutEffect, useRef } from 'react';
import SectionHead from '../SectionHead';
import MonkeyFace from '../brand/MonkeyFace';
import { PROCESS } from '../../data/site';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../../lib/gsap';

/**
 * How an engagement runs, as a vine the mascot slides down while you scroll.
 * Each step lights up as the mascot reaches it.
 */
export default function Process({ index = '05', tone = 'dark' }) {
  const listRef = useRef(null);
  const fillRef = useRef(null);
  const riderRef = useRef(null);
  const dark = tone === 'dark';

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return undefined;
    const steps = list.querySelectorAll('[data-step]');

    if (prefersReducedMotion()) {
      steps.forEach((s) => s.setAttribute('data-active', ''));
      return undefined;
    }

    const ctx = gsap.context(() => {
      const trigger = { trigger: list, start: 'top 62%', end: 'bottom 62%', scrub: 0.5 };
      gsap.fromTo(fillRef.current, { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: trigger });
      gsap.fromTo(
        riderRef.current,
        { y: 0 },
        { y: () => list.offsetHeight, ease: 'none', scrollTrigger: { ...trigger, invalidateOnRefresh: true } }
      );
      // A little swing as it travels.
      gsap.to(riderRef.current.firstElementChild, {
        rotate: 14,
        duration: 1.1,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        startAt: { rotate: -14 },
      });
      steps.forEach((step) => {
        ScrollTrigger.create({
          trigger: step,
          start: 'top 62%',
          onEnter: () => step.setAttribute('data-active', ''),
          onLeaveBack: () => step.removeAttribute('data-active'),
        });
      });
    }, list);
    return () => ctx.revert();
  }, []);

  return (
    <section className={`relative py-24 md:py-36 ${dark ? 'bg-ink text-paper' : 'bg-paper text-ink'}`}>
      <div className="mx-auto grid max-w-[1600px] gap-16 px-5 md:px-10 lg:grid-cols-[1fr_1.1fr] lg:gap-24">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionHead
            tone={dark ? 'dark' : 'light'}
            index={index}
            label="How we swing"
            title={'From first\ncall to\nfull swing.'}
            accent={{ swing: 'text-gold' }}
            titleClassName="text-[clamp(2.4rem,10.5vw,4.2rem)] font-bold md:text-[clamp(3.6rem,6vw,6.6rem)] md:font-extrabold"
          />
          <p className={`mt-8 max-w-md ${dark ? 'text-paper/60' : 'text-ink/65'}`}>
            No mystery, no endless decks. Four moves, on repeat, every month we work together.
          </p>
        </div>

        <div ref={listRef} className="relative pl-16 md:pl-24">
          <div aria-hidden="true" className={`absolute bottom-0 left-[22px] top-0 w-[3px] rounded-full md:left-[30px] ${dark ? 'bg-paper/10' : 'bg-ink/10'}`} />
          <div
            ref={fillRef}
            aria-hidden="true"
            className="absolute bottom-0 left-[22px] top-0 w-[3px] origin-top rounded-full bg-gold md:left-[30px]"
          />
          <div ref={riderRef} aria-hidden="true" className="absolute left-[23.5px] top-0 z-10 md:left-[31.5px]">
            <div className="-ml-[24px] -mt-[22px] w-12 origin-top md:-ml-[30px] md:w-[60px]">
              <MonkeyFace />
            </div>
          </div>

          <ol>
            {PROCESS.map((step) => (
              <li
                key={step.number}
                data-step
                className="group/step py-10 transition-opacity duration-500 first:pt-2 md:py-16 [&:not([data-active])]:opacity-40"
              >
                <span className="font-display text-[clamp(3.4rem,9vw,6rem)] font-extrabold leading-none tracking-tight text-transparent [-webkit-text-stroke:1.5px_currentColor] transition-colors duration-500 group-data-[active]/step:text-gold group-data-[active]/step:[-webkit-text-stroke:0px]">
                  {step.number}
                </span>
                <h3 className="mt-4 font-display text-[clamp(1.6rem,8vw,1.9rem)] font-bold uppercase leading-[0.95] tracking-tight md:text-5xl md:font-extrabold">
                  {step.title}
                </h3>
                <p className={`mt-4 max-w-md text-base leading-relaxed md:text-lg ${dark ? 'text-paper/65' : 'text-ink/65'}`}>
                  {step.blurb}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
