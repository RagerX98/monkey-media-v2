import { useLayoutEffect, useRef } from 'react';
import SiteThumb from '../work/SiteThumb';
import Split from '../motion/Split';
import Reveal from '../Reveal';
import CTAButton from '../CTAButton';
import { work } from '../../data/work';
import { gsap } from '../../lib/gsap';

const pad = (n) => String(n).padStart(2, '0');

// The homepage shows a curated running order (ids from data/work.js); the
// full set, Nova included, lives on /work. Phones show the first four.
const HOME_ORDER = ['fynn', 'loudly', 'volt', 'ember-oak', 'halcyon', 'monkey-street', 'monkey-bloom'];

function Card({ item, index, total }) {
  return (
    <a
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor="View"
      data-card
      aria-label={`${item.title}, ${item.kind}. Opens the live demo in a new tab.`}
      className="group block w-full shrink-0 lg:w-[min(46vw,780px)]"
    >
      <div className="overflow-hidden rounded-2xl bg-ink/30 p-2 shadow-[0_30px_60px_-20px_rgba(13,13,13,0.55)] ring-1 ring-paper/15 transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:-translate-y-2">
        <div className="overflow-hidden rounded-xl">
          <div data-thumb className="transition-transform duration-1000 ease-[var(--ease-out-expo)] group-hover:scale-[1.05]">
            <SiteThumb item={item} />
          </div>
        </div>
      </div>
      <div className="mt-5 flex items-start justify-between gap-4 px-1">
        <div>
          <p className="eyebrow text-paper/70">{item.kind}</p>
          <h3 className="mt-2 font-display text-3xl font-extrabold uppercase tracking-tight text-paper md:text-4xl">
            {item.title}
          </h3>
        </div>
        <span className="eyebrow pt-1 text-gold">
          {pad(index + 1)} / {pad(total)}
        </span>
      </div>
    </a>
  );
}

/**
 * Selected work on a purple stage. On large screens the section pins and the
 * cards travel sideways as you scroll down; on phones and tablets it is a
 * plain vertical list (sideways scroll-jacking on touch fights the thumb).
 */
export default function WorkRail() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const items = HOME_ORDER.map((id) => work.find((w) => w.id === id)).filter(Boolean);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const mm = gsap.matchMedia();

    mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      const distance = () => track.scrollWidth - window.innerWidth;
      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });

      // Each thumbnail drifts against the travel for a touch of depth.
      gsap.utils.toArray(track.querySelectorAll('[data-thumb]')).forEach((el) => {
        gsap.fromTo(
          el,
          { xPercent: 6 },
          {
            xPercent: -6,
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              containerAnimation: tween,
              start: 'left right',
              end: 'right left',
              scrub: true,
            },
          }
        );
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-purple text-paper">
      <div
        ref={trackRef}
        className="flex flex-col gap-16 px-5 py-24 md:px-10 lg:h-[100svh] lg:w-max lg:flex-row lg:items-center lg:gap-14 lg:py-0 lg:pl-10 lg:pr-[8vw]"
      >
        <div className="shrink-0 lg:w-[34vw] lg:max-w-[560px]">
          <Reveal className="flex items-center gap-4">
            <span className="eyebrow text-gold">03</span>
            <span className="h-px w-10 bg-paper/35" />
            <span className="eyebrow text-paper/75">Selected work</span>
          </Reveal>
          <Split
            text={'Made to\nbe seen.'}
            accent={{ seen: 'text-gold' }}
            className="display mt-6 text-[clamp(3rem,13vw,4.6rem)] font-bold md:font-extrabold lg:text-[clamp(3.4rem,5.2vw,6.6rem)]"
          />
          <Reveal delay={0.1} className="mt-8 max-w-sm">
            <p className="text-paper/80">
              Concept sites and store themes, each with its own look and its own way of moving.
              Open any of them: they are live, and they are fast.
            </p>
            <CTAButton to="/work" variant="light" className="mt-8">
              All our work
            </CTAButton>
          </Reveal>
        </div>

        {/* Phones get the first four; the full set is one tap away. */}
        {items.map((item, i) => (
          <Reveal key={item.id} y={50} className={i >= 4 ? 'hidden lg:contents' : 'lg:contents'}>
            <Card item={item} index={i} total={items.length} />
          </Reveal>
        ))}

        <div className="flex shrink-0 items-center justify-center lg:w-[22vw]">
          <a
            href="/work"
            data-cursor="Explore"
            className="group grid aspect-square w-48 place-items-center rounded-full bg-gold text-center text-ink transition-transform duration-700 ease-[var(--ease-out-expo)] hover:scale-105 md:w-60"
          >
            <span className="font-display text-xl font-extrabold uppercase leading-tight tracking-tight md:text-2xl">
              See all
              <br />
              the work
              <span className="mt-2 block text-3xl transition-transform duration-500 group-hover:translate-x-2">→</span>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
