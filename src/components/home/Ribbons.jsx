import Marquee from '../motion/Marquee';
import { services } from '../../data/services';

function Strip({ tone }) {
  return (
    <>
      {services.map((s) => (
        <span key={s.slug} className="flex shrink-0 items-center">
          <span className="px-5 font-display text-[clamp(1.5rem,4vw,3.4rem)] font-extrabold uppercase leading-none tracking-tight md:px-8">
            {s.short}
          </span>
          <span className={tone === 'gold' ? 'text-purple' : 'text-gold'} aria-hidden="true">
            ✦
          </span>
        </span>
      ))}
    </>
  );
}

/**
 * Two service ribbons crossing over the seam between a light section and a
 * dark one. They drift in opposite directions and both surge (and turn around)
 * with the scroll.
 */
export default function Ribbons({ from = '#ffffff', to = '#0d0d0d' }) {
  return (
    <div
      aria-hidden="true"
      className="relative h-[clamp(9rem,22vw,17rem)] overflow-hidden"
      style={{ background: `linear-gradient(to bottom, ${from} 50%, ${to} 50%)` }}
    >
      <div className="absolute left-[-5%] right-[-5%] top-1/2 -translate-y-1/2 -rotate-[4deg]">
        <Marquee speed={55} className="bg-purple py-4 text-paper shadow-[0_20px_40px_rgba(0,0,0,0.25)] md:py-6">
          <Strip tone="purple" />
        </Marquee>
      </div>
      <div className="absolute left-[-5%] right-[-5%] top-1/2 -translate-y-1/2 rotate-[3deg]">
        <Marquee speed={45} reverse className="bg-gold py-4 text-ink md:py-6">
          <Strip tone="gold" />
        </Marquee>
      </div>
    </div>
  );
}
