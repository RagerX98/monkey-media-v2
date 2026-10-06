import { useLayoutEffect, useRef } from 'react';
import PageHero from '../components/PageHero';
import SectionHead from '../components/SectionHead';
import ScrubWords from '../components/motion/ScrubWords';
import CountUp from '../components/CountUp';
import Reveal from '../components/Reveal';
import OrbitField from '../components/OrbitField';
import BigCTA from '../components/BigCTA';
import MonkeyFace from '../components/brand/MonkeyFace';
import { STATS, VALUES } from '../data/site';
import { gsap, prefersReducedMotion } from '../lib/gsap';

const VALUE_SKINS = [
  'bg-purple text-paper',
  'bg-gold text-ink',
  'bg-paper text-ink',
  'bg-void text-paper ring-1 ring-white/10',
];
const TILTS = [-5, 4, -3, 6];

function Values() {
  const ref = useRef(null);

  // The cards start scattered like stickers on a board and straighten up as
  // they scroll into place.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return undefined;
    const ctx = gsap.context(() => {
      el.querySelectorAll('[data-value]').forEach((card, i) => {
        gsap.fromTo(
          card,
          { rotate: TILTS[i % TILTS.length] * 2, y: 120 },
          {
            rotate: TILTS[i % TILTS.length] * 0.25,
            y: 0,
            ease: 'none',
            scrollTrigger: { trigger: card, start: 'top bottom', end: 'top 45%', scrub: 0.6 },
          }
        );
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section className="relative overflow-hidden bg-ink py-24 md:py-36">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <SectionHead index="03" label="What we stand for" title={'Four rules\nwe swing by.'} accent={{ swing: 'text-gold' }} />
        <div ref={ref} className="mt-16 grid gap-6 md:mt-24 md:grid-cols-2 md:gap-8">
          {VALUES.map((v, i) => (
            <article
              key={v.number}
              data-value
              className={`flex min-h-[300px] flex-col justify-between rounded-[2rem] p-8 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.7)] md:min-h-[380px] md:p-12 ${VALUE_SKINS[i % VALUE_SKINS.length]}`}
            >
              <span className="font-display text-6xl font-extrabold leading-none tracking-tight opacity-90 md:text-8xl">
                {v.number}
              </span>
              <div>
                <h3 className="font-display text-[clamp(1.6rem,8vw,2rem)] font-bold uppercase leading-[0.95] tracking-tight md:text-[clamp(2.2rem,3.6vw,3rem)] md:font-extrabold">
                  {v.title}
                </h3>
                <p className="mt-4 max-w-md text-base leading-relaxed opacity-75 md:text-lg">{v.blurb}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function About() {
  return (
    <>
      <PageHero
        eyebrow="About us"
        size="lg"
        title={'The monkeys\nbehind the\nmadness.'}
        accent={{ madness: 'text-gold' }}
        intro="We built Monkey Media because we got tired of watching brilliant ideas die in bad execution."
      />

      <section className="bg-paper text-ink">
        <div className="mx-auto max-w-[1600px] px-5 py-24 md:px-10 md:py-36">
          <Reveal className="flex items-center gap-4">
            <span className="eyebrow text-purple">01</span>
            <span className="h-px w-10 bg-ink/20" />
            <span className="eyebrow text-ink/55">Our story</span>
          </Reveal>
          <ScrubWords
            className="mt-10 max-w-[24ch] font-display text-[clamp(1.9rem,5.2vw,5rem)] font-bold leading-[1.05] tracking-[-0.03em]"
            parts={[
              'Two people. One vision: build an agency that actually delivers.',
              <MonkeyFace key="f" className="inline-block h-[0.82em] w-auto rotate-6" />,
              "Now we're growing, and every new monkey we bring in shares the same obsession. Strategists, creators and full-blown brand nerds who believe good marketing should never feel like homework. Not for us, and not for you.",
            ]}
          />
        </div>
      </section>

      <section className="bg-purple text-paper">
        <div className="mx-auto grid max-w-[1600px] grid-cols-2 px-5 md:px-10 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal
              key={s.label}
              delay={i * 0.08}
              className={`border-paper/20 py-12 md:py-16 ${i % 2 === 1 ? 'border-l pl-6 md:pl-10' : 'pr-6'} ${
                i < 2 ? 'border-b lg:border-b-0' : ''
              } ${i === 2 ? 'lg:border-l lg:pl-10' : ''}`}
            >
              <CountUp
                value={s.value}
                className="block font-display text-[clamp(2.8rem,13vw,4.5rem)] font-extrabold leading-none tracking-[-0.04em] text-gold lg:text-[clamp(3rem,5.6vw,6.2rem)]"
              />
              <span className="eyebrow mt-4 block text-paper/80">{s.label}</span>
            </Reveal>
          ))}
        </div>
      </section>

      <Values />

      <section className="relative bg-ink pb-28 md:pb-40">
        <div className="mx-auto max-w-[1600px] px-5 md:px-10">
          <SectionHead
            index="04"
            label="Meet the troop"
            title={'The team.'}
            accent={{ team: 'text-gold' }}
            aside={
              <p className="text-paper/60">
                Profiles are swinging in soon. Until then, tap the bananas and feed the monkey.
              </p>
            }
          />
          <Reveal delay={0.1} className="mt-14">
            <OrbitField />
          </Reveal>
        </div>
      </section>

      <BigCTA title={"Think we'd\nget along?"} accent={{ along: 'text-purple' }} />
    </>
  );
}
