import ScrubWords from '../motion/ScrubWords';
import CountUp from '../CountUp';
import Reveal from '../Reveal';
import MonkeyFace from '../brand/MonkeyFace';
import { clients } from '../../data/clients';
import { STATS } from '../../data/site';

const byName = (n) => clients.find((c) => c.name === n);

function LogoPill({ name }) {
  const c = byName(name);
  if (!c) return null;
  return (
    <span className="inline-block h-[0.86em] w-[1.75em] overflow-hidden rounded-full align-[-0.1em] shadow-[0_0_0_2px_#fff,0_6px_18px_rgba(13,13,13,0.18)]">
      <picture>
        <source srcSet={c.logoWebp} type="image/webp" />
        <img src={c.logo} alt={c.name} className="h-full w-full object-cover" loading="lazy" />
      </picture>
    </span>
  );
}

/**
 * The white page the hero dives into. Opens on the same pure white as the
 * mascot's face, so the end of the zoom and the start of this section are
 * indistinguishable.
 */
export default function Manifesto() {
  return (
    <section className="relative bg-paper text-ink">
      <div className="mx-auto max-w-[1600px] px-5 pb-24 pt-20 md:px-10 md:pb-36 md:pt-32">
        <Reveal className="flex items-center gap-4">
          <span className="eyebrow text-purple">01</span>
          <span className="h-px w-10 bg-ink/20" />
          <span className="eyebrow text-ink/50">Who we are</span>
        </Reveal>

        <ScrubWords
          className="mt-10 max-w-[22ch] font-display text-[clamp(1.9rem,5.4vw,5.2rem)] font-bold leading-[1.04] tracking-[-0.03em] md:mt-14"
          parts={[
            'We are Monkey Media',
            <MonkeyFace key="face" className="inline-block h-[0.82em] w-auto -rotate-6" />,
            'a creative agency for brands that would rather stand out than fit in. We turn bold ideas into feeds people stop for, campaigns people talk about and growth you can measure. Trusted by',
            <LogoPill key="adidas" name="Adidas" />,
            <LogoPill key="nykaa" name="Nykaa" />,
            <LogoPill key="reebok" name="Reebok" />,
            'and the next big thing.',
          ]}
        />

        <div className="mt-20 grid grid-cols-2 border-t border-ink/15 md:mt-28 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal
              key={s.label}
              delay={i * 0.08}
              className={`border-b border-ink/15 py-8 pr-4 lg:border-b-0 lg:py-10 ${
                i % 2 === 0 ? 'pr-6' : 'pl-6 border-l'
              } ${i > 0 ? 'lg:border-l lg:pl-8' : ''}`}
            >
              <CountUp
                value={s.value}
                className="block font-display text-[clamp(2.8rem,13vw,4.5rem)] font-extrabold leading-none tracking-[-0.04em] lg:text-[clamp(3rem,5.6vw,6.2rem)]"
              />
              <span className="eyebrow mt-4 block text-ink/55">{s.label}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
