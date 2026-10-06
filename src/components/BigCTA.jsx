import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Split from './motion/Split';
import Magnetic from './motion/Magnetic';
import Reveal from './Reveal';
import MonkeyFace from './brand/MonkeyFace';
import BananaRain from './BananaRain';
import { CONTACT } from '../data/site';

const TONES = {
  paper: {
    section: 'bg-paper text-ink',
    eyebrow: 'text-purple',
    rule: 'bg-ink/20',
    button: 'bg-gold text-ink shadow-[0_30px_60px_-20px_rgba(139,92,246,0.6)]',
    fill: 'bg-purple',
    hoverText: 'group-hover:text-paper',
    face: {},
  },
  gold: {
    section: 'bg-gold text-ink',
    eyebrow: 'text-purple',
    rule: 'bg-ink/25',
    button: 'bg-ink text-gold shadow-[0_30px_60px_-20px_rgba(13,13,13,0.6)]',
    fill: 'bg-purple',
    hoverText: 'group-hover:text-paper',
    face: { head: '#0d0d0d', eye: '#0d0d0d' },
  },
  purple: {
    section: 'bg-purple text-paper',
    eyebrow: 'text-gold',
    rule: 'bg-paper/30',
    button: 'bg-gold text-ink shadow-[0_30px_60px_-20px_rgba(13,13,13,0.5)]',
    fill: 'bg-paper',
    hoverText: 'group-hover:text-ink',
    face: {},
  },
};

/**
 * The closing call to action used at the bottom of every page: a big line, a
 * big round button that rains bananas when you go near it, and the mascot
 * peeking up from the bottom edge, watching the cursor.
 */
export default function BigCTA({
  eyebrow = 'Your move',
  title = "Got a brand\nthat won't\nsit still?",
  accent = { still: 'text-purple' },
  button = "Let's talk",
  to = '/contact',
  tone = 'paper',
}) {
  const t = TONES[tone] ?? TONES.paper;
  const [raining, setRaining] = useState(false);
  const timer = useRef(0);

  const rain = () => {
    setRaining(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setRaining(false), 2300);
  };

  return (
    <section className={`relative overflow-hidden ${t.section}`}>
      {raining && (
        <div className="pointer-events-none absolute inset-0 z-20">
          <BananaRain count={22} />
        </div>
      )}
      <div className="mx-auto grid max-w-[1600px] items-center gap-14 px-5 pb-48 pt-24 md:px-10 md:pb-64 md:pt-36 lg:grid-cols-[1.9fr_1fr]">
        <div>
          <Reveal className="flex items-center gap-4">
            <span className={`eyebrow ${t.eyebrow}`}>{eyebrow}</span>
            <span className={`h-px w-10 ${t.rule}`} />
          </Reveal>
          <Split
            text={title}
            accent={accent}
            className="display mt-6 text-[clamp(2.9rem,12.5vw,4.6rem)] font-bold md:text-[clamp(4rem,6.8vw,8.4rem)] md:font-extrabold"
          />
          <Reveal delay={0.15} className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm font-bold">
            <a href={`mailto:${CONTACT.email}`} className="link-line">
              {CONTACT.email}
            </a>
            <a href={CONTACT.whatsapp} target="_blank" rel="noreferrer" className="link-line">
              WhatsApp us
            </a>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="flex justify-center lg:justify-end">
          <Magnetic strength={0.4}>
            <Link
              to={to}
              onMouseEnter={rain}
              onFocus={rain}
              onTouchStart={rain}
              data-cursor="Go!"
              className={`group relative grid aspect-square w-[min(68vw,300px)] place-items-center overflow-hidden rounded-full md:w-[340px] ${t.button}`}
            >
              <span
                aria-hidden="true"
                className={`absolute inset-0 translate-y-full rounded-full transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:translate-y-0 ${t.fill}`}
              />
              <span className={`relative text-center transition-colors duration-500 ${t.hoverText}`}>
                <span className="block font-display text-3xl font-extrabold uppercase leading-none tracking-tight md:text-4xl">
                  {button}
                </span>
                <span className="eyebrow mt-3 block opacity-70">Free discovery call</span>
              </span>
            </Link>
          </Magnetic>
        </Reveal>
      </div>

      {/* Peeking mascot. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-1/2 w-[min(46vw,260px)] -translate-x-1/2 translate-y-[42%]"
      >
        <MonkeyFace {...t.face} />
      </div>
    </section>
  );
}
