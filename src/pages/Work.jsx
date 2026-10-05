import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import PageFade from '../components/PageFade';
import SubtleReveal from '../components/SubtleReveal';
import Reveal from '../components/Reveal';
import BananaRain from '../components/BananaRain';
import CTAButton from '../components/CTAButton';
import SiteThumb from '../components/work/SiteThumb';
import { clients } from '../data/clients';
import { work, WORK_CATEGORIES } from '../data/work';

const ENTRY_RAIN_DURATION = 2200;

// Ceiling on the per-tile entrance delay. Uncapped, i * 0.06 across 12 clients
// left the last tile waiting 0.66s after its own scroll trigger — a pleasant
// ripple on a four-across desktop grid, but plain lag once mobile collapses it
// to one column and each tile triggers on its own.
const STAGGER_CAP = 0.24;
const MOBILE_BANANA_COUNT = 14;
const DESKTOP_BANANA_COUNT = 26;

function WorkCard({ item, index }) {
  const newTab = item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {};

  return (
    <Reveal delay={Math.min((index % 2) * 0.08, 0.2)} y={30}>
      {/* Plain <a>, never <Link>: the demos are static files outside the SPA. */}
      <a
        href={item.href}
        {...newTab}
        aria-label={`${item.title}, ${item.kind}. View the live demo${
          item.external ? ' (opens in a new tab)' : ''
        }.`}
        className="group block"
      >
        <motion.div
          whileHover={{ y: -6 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-3 transition-colors group-hover:border-purple/50"
        >
          <div className="overflow-hidden rounded-xl">
            <div className="transition-transform duration-700 ease-out group-hover:scale-[1.04]">
              <SiteThumb item={item} />
            </div>
          </div>

          <div className="px-3 pb-3 pt-5">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-bold uppercase tracking-widest text-purple">
                {item.kind}
              </span>
              <span className="shrink-0 text-xs font-bold uppercase tracking-widest text-gold">
                View live <span aria-hidden="true">↗</span>
              </span>
            </div>
            <h3 className="mt-2 text-xl font-black uppercase text-paper md:text-2xl">
              {item.title}
            </h3>
            <p className="mt-2 text-sm text-paper/60">{item.description}</p>
            {item.tags?.length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full border border-white/10 px-3 py-1 text-[11px] font-semibold text-paper/60"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </motion.div>
      </a>
    </Reveal>
  );
}

export default function Work() {
  const [raining, setRaining] = useState(true);
  const [bananaCount, setBananaCount] = useState(DESKTOP_BANANA_COUNT);

  useEffect(() => {
    if (window.matchMedia('(max-width: 640px)').matches) {
      setBananaCount(MOBILE_BANANA_COUNT);
    }
    const t = setTimeout(() => setRaining(false), ENTRY_RAIN_DURATION);
    return () => clearTimeout(t);
  }, []);

  // Sections are driven by the data: a category with work in it gets a grid, a
  // category with none yet gets a "coming soon" tile. Add an item to
  // src/data/work.js and it moves from one to the other by itself.
  const sections = WORK_CATEGORIES.map((cat) => ({
    ...cat,
    items: work.filter((w) => w.category === cat.id),
  }));
  const filled = sections.filter((s) => s.items.length > 0);
  const upcoming = sections.filter((s) => s.items.length === 0);

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

      <div className="max-w-3xl">
        <SubtleReveal as="span" className="text-xs font-bold uppercase tracking-widest text-purple">
          Our Work
        </SubtleReveal>
        <SubtleReveal
          as="h1"
          delay={0.06}
          className="mt-4 text-4xl font-display font-extrabold uppercase tracking-tight text-paper md:text-6xl"
        >
          Built with <span className="text-gold">monkey energy</span>.
        </SubtleReveal>
        <SubtleReveal as="p" delay={0.12} className="mt-4 max-w-xl text-paper/60">
          Concept sites, store themes and, soon, AI visuals and reels. Every piece is made to show
          range, motion and craft. Open any one to see it live.
        </SubtleReveal>

        {filled.length > 1 && (
          <SubtleReveal as="nav" delay={0.18} className="mt-8 flex flex-wrap gap-3">
            {filled.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="rounded-full border border-white/15 px-5 py-2 text-xs font-bold uppercase tracking-widest text-paper/70 transition-colors hover:border-purple hover:text-paper"
              >
                {s.label}
              </a>
            ))}
          </SubtleReveal>
        )}
      </div>

      {filled.map((section, idx) => (
        <section key={section.id} id={section.id} className="mt-20 scroll-mt-28">
          <div className="flex flex-wrap items-end justify-between gap-3 border-b border-white/10 pb-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-purple">
                {String(idx + 1).padStart(2, '0')}
              </span>
              <h2 className="mt-1 text-2xl font-display font-extrabold uppercase tracking-tight text-paper md:text-3xl">
                {section.label}
              </h2>
            </div>
            <p className="max-w-md text-sm text-paper/50">{section.blurb}</p>
          </div>

          <div className="mt-8 grid gap-8 md:grid-cols-2">
            {section.items.map((item, i) => (
              <WorkCard key={item.id} item={item} index={i} />
            ))}
          </div>
        </section>
      ))}

      {upcoming.length > 0 && (
        <section className="mt-20">
          <div className="border-b border-white/10 pb-5">
            <span className="text-xs font-bold uppercase tracking-widest text-purple">
              On the way
            </span>
            <h2 className="mt-1 text-2xl font-display font-extrabold uppercase tracking-tight text-paper md:text-3xl">
              More dropping soon
            </h2>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {upcoming.map((s) => (
              <Reveal key={s.id} y={24}>
                <div className="flex h-full flex-col justify-center rounded-2xl border border-dashed border-white/15 px-8 py-10">
                  <span className="text-xs font-bold uppercase tracking-widest text-gold">
                    Coming soon
                  </span>
                  <h3 className="mt-2 text-xl font-black uppercase text-paper">{s.label}</h3>
                  <p className="mt-2 text-sm text-paper/50">{s.blurb}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <section className="mt-28">
        <div className="max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-widest text-purple">Clients</span>
          <h2 className="mt-3 text-3xl font-display font-extrabold uppercase tracking-tight text-paper md:text-5xl">
            Brands we've gone <span className="text-gold">bananas</span> for.
          </h2>
          <p className="mt-4 max-w-lg text-paper/60">
            From global names to fast-growing D2C labels, here's a look at who trusts us.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {clients.map((client, i) => (
            <Reveal key={client.name} delay={Math.min(i * 0.06, STAGGER_CAP)} y={30}>
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
                  <h3 className="text-lg font-black uppercase text-paper">{client.name}</h3>
                  <span className="mt-1 text-xs font-bold uppercase tracking-widest text-purple">
                    {client.category}
                  </span>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </section>

      <Reveal className="mt-20 flex flex-col items-center gap-4 text-center" delay={0.2}>
        <p className="max-w-md text-paper/50">
          Want to see your brand on this wall? Let's talk about what we can build together.
        </p>
        <CTAButton to="/contact">Start a Project</CTAButton>
      </Reveal>
    </PageFade>
  );
}
