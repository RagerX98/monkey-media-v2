import { useLayoutEffect, useRef } from 'react';
import PageHero from '../components/PageHero';
import Process from '../components/home/Process';
import Ribbons from '../components/home/Ribbons';
import BigCTA from '../components/BigCTA';
import MonkeyFace from '../components/brand/MonkeyFace';
import { services } from '../data/services';
import { gsap, prefersReducedMotion } from '../lib/gsap';
import useHashScroll from '../lib/useHashScroll';

// Card surfaces cycle through the brand palette.
const SKINS = [
  { card: 'bg-purple text-paper', chip: 'bg-paper/15 text-paper', num: 'text-gold', sub: 'text-paper/80' },
  { card: 'bg-gold text-ink', chip: 'bg-ink/10 text-ink', num: 'text-purple', sub: 'text-ink/75' },
  { card: 'bg-paper text-ink', chip: 'bg-ink/8 text-ink', num: 'text-purple', sub: 'text-ink/70' },
  { card: 'bg-void text-paper ring-1 ring-white/10', chip: 'bg-paper/10 text-paper', num: 'text-gold', sub: 'text-paper/70' },
];

function ServiceCard({ service, index }) {
  const s = SKINS[index % SKINS.length];
  return (
    <article
      id={service.slug}
      data-stack
      className={`sticky top-24 flex min-h-[70svh] flex-col justify-between overflow-hidden rounded-[2rem] p-7 shadow-[0_-20px_60px_-30px_rgba(0,0,0,0.6)] md:top-28 md:min-h-[72svh] md:rounded-[2.5rem] md:p-14 ${s.card}`}
      style={{ marginTop: index === 0 ? 0 : '6vh' }}
    >
      {/* Darkens as the next card covers this one (opacity, not a filter:
          a scrubbed filter on a card this size repaints it every frame). */}
      <div data-shade aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 bg-ink opacity-0" />
      <div className="flex items-start justify-between gap-6">
        <span className={`font-display text-[clamp(4.5rem,18vw,12rem)] font-extrabold leading-[0.8] tracking-tight ${s.num}`}>
          {service.number}
        </span>
        <span className="eyebrow mt-3 hidden text-right opacity-70 sm:block">{service.short}</span>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-end lg:gap-16">
        <div>
          <h2 className="font-display text-[clamp(1.7rem,8.4vw,3.2rem)] font-bold uppercase leading-[0.95] tracking-[-0.03em] md:text-[clamp(2.8rem,5vw,5.4rem)] md:font-extrabold">
            {service.title}
          </h2>
          <p className={`mt-6 max-w-xl text-base leading-relaxed md:text-xl ${s.sub}`}>{service.blurb}</p>
        </div>
        <div>
          <p className="eyebrow opacity-60">What you get</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {service.deliverables.map((d) => (
              <li key={d} className={`rounded-full px-4 py-2 text-sm font-bold ${s.chip}`}>
                {d}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}

export default function Services() {
  const stackRef = useRef(null);
  useHashScroll();

  // Each card sinks back a little as the next one slides over it.
  useLayoutEffect(() => {
    const stack = stackRef.current;
    if (!stack || prefersReducedMotion()) return undefined;
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray(stack.querySelectorAll('[data-stack]'));
      cards.forEach((card, i) => {
        const next = cards[i + 1];
        if (!next) return;
        const st = { trigger: next, start: 'top bottom', end: 'top 20%', scrub: true };
        gsap.to(card, { scale: 0.92, ease: 'none', scrollTrigger: st });
        gsap.to(card.querySelector('[data-shade]'), { opacity: 0.45, ease: 'none', scrollTrigger: st });
      });
    }, stack);
    return () => ctx.revert();
  }, []);

  return (
    <>
      <PageHero
        eyebrow="Services"
        title={'What we\ndo best.'}
        accent={{ best: 'text-gold' }}
        intro="Eight ways we help brands get noticed, get talked about and grow. Take one, or let us run the whole jungle: every service plugs into the same strategy."
      >
        <ul className="flex flex-wrap gap-2">
          {services.map((s) => (
            <li key={s.slug}>
              <a
                href={`#${s.slug}`}
                className="block rounded-full border border-white/15 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-paper/75 transition-colors hover:border-gold hover:bg-gold hover:text-ink"
              >
                {s.short}
              </a>
            </li>
          ))}
        </ul>
      </PageHero>

      <section className="relative bg-ink pb-28 md:pb-40">
        <div ref={stackRef} className="mx-auto max-w-[1600px] px-3 md:px-8">
          {services.map((s, i) => (
            <ServiceCard key={s.slug} service={s} index={i} />
          ))}
        </div>
        <div className="mx-auto mt-24 flex max-w-[1600px] items-center gap-6 px-5 md:px-10">
          <MonkeyFace className="w-16 shrink-0 md:w-20" />
          <p className="max-w-xl text-lg text-paper/70 md:text-2xl">
            Not sure which you need? Most brands are not. That is what the free discovery call is
            for.
          </p>
        </div>
      </section>

      <Ribbons from="#0d0d0d" to="#ffffff" />
      <Process index="" tone="light" />
      <BigCTA tone="gold" title={"Let's build\nyour plan."} accent={{ plan: 'text-purple' }} />
    </>
  );
}
