import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import PageFade from '../components/PageFade';
import SubtleReveal from '../components/SubtleReveal';
import Reveal from '../components/Reveal';
import BananaRain from '../components/BananaRain';
import { clients } from '../data/clients';

const ENTRY_RAIN_DURATION = 2200;
const MOBILE_BANANA_COUNT = 14;
const DESKTOP_BANANA_COUNT = 26;

export default function Portfolio() {
  const [raining, setRaining] = useState(true);
  const [bananaCount, setBananaCount] = useState(DESKTOP_BANANA_COUNT);

  useEffect(() => {
    if (window.matchMedia('(max-width: 640px)').matches) {
      setBananaCount(MOBILE_BANANA_COUNT);
    }
    const t = setTimeout(() => setRaining(false), ENTRY_RAIN_DURATION);
    return () => clearTimeout(t);
  }, []);

  return (
    <PageFade className="mx-auto max-w-7xl px-6 pb-32 pt-40 md:px-10">
      <AnimatePresence>
        {raining && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none fixed inset-0 z-40"
          >
            <BananaRain count={bananaCount} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-2xl">
        <SubtleReveal as="span" className="text-xs font-bold uppercase tracking-widest text-purple">
          Our Work
        </SubtleReveal>
        <SubtleReveal
          as="h1"
          delay={0.06}
          className="mt-4 text-4xl font-black uppercase tracking-tight text-paper md:text-6xl"
        >
          Brands we've gone <span className="text-gold">bananas</span> for.
        </SubtleReveal>
        <SubtleReveal as="p" delay={0.12} className="mt-4 max-w-lg text-paper/60">
          From global names to fast-growing D2C labels, here's a look at who trusts us.
        </SubtleReveal>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {clients.map((client, i) => (
          <Reveal key={client.name} delay={i * 0.06} y={30}>
            <motion.div
              whileHover={{ y: -6 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] transition-colors hover:border-purple/50"
            >
              <div className="aspect-[2/1] overflow-hidden">
                <picture>
                  <source srcSet={client.logoWebp} type="image/webp" />
                  <img
                    src={client.logo}
                    alt={client.name}
                    className="h-full w-full object-cover"
                    draggable={false}
                  />
                </picture>
              </div>
              <div className="flex flex-1 flex-col justify-center px-6 py-5">
                <h2 className="text-lg font-black uppercase text-paper">{client.name}</h2>
                <span className="mt-1 text-xs font-bold uppercase tracking-widest text-purple">
                  {client.category}
                </span>
              </div>
            </motion.div>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-20 flex flex-col items-center gap-4 text-center" delay={0.2}>
        <p className="max-w-md text-paper/50">
          Want to see your brand on this wall? Let's talk about what we can build together.
        </p>
        <Link
          to="/contact"
          className="rounded-full bg-purple px-8 py-4 text-sm font-bold uppercase tracking-wide text-paper transition-transform hover:scale-105 hover:bg-gold hover:text-ink"
        >
          Start a Project
        </Link>
      </Reveal>
    </PageFade>
  );
}
