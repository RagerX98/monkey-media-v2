import { useRef, useState } from 'react';
import { AnimatePresence, LayoutGroup, motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';
import PageHero from '../components/PageHero';
import SiteThumb from '../components/work/SiteThumb';
import ClientsWall from '../components/home/ClientsWall';
import BigCTA from '../components/BigCTA';
import MonkeyFace from '../components/brand/MonkeyFace';
import { work, WORK_CATEGORIES } from '../data/work';

const ALL = 'all';

// Alternating wide / narrow columns on large screens, so the grid reads as an
// editorial spread rather than a wall of identical tiles.
const SPANS = ['lg:col-span-7', 'lg:col-span-5', 'lg:col-span-5', 'lg:col-span-7'];

function WorkCard({ item, index }) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 160, damping: 18 });
  const sry = useSpring(ry, { stiffness: 160, damping: 18 });

  // A gentle 3D tilt toward the mouse.
  const onMove = (e) => {
    if (reduce || e.pointerType !== 'mouse') return;
    const r = ref.current.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 7);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 7);
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: Math.min(index * 0.05, 0.3) }}
      className={`col-span-12 ${SPANS[index % SPANS.length]}`}
    >
      <a
        href={item.href}
        target={item.external ? '_blank' : undefined}
        rel={item.external ? 'noopener noreferrer' : undefined}
        data-cursor="View"
        aria-label={`${item.title}, ${item.kind}. View the live demo${item.external ? ' (opens in a new tab)' : ''}.`}
        className="group block [perspective:1200px]"
        onPointerMove={onMove}
        onPointerLeave={onLeave}
      >
        <motion.div
          ref={ref}
          style={{ rotateX: srx, rotateY: sry }}
          className="overflow-hidden rounded-[1.6rem] bg-void p-2.5 ring-1 ring-white/10 transition-shadow duration-500 group-hover:shadow-[0_40px_80px_-30px_rgba(139,92,246,0.55)] group-hover:ring-purple/60"
        >
          <div className="overflow-hidden rounded-[1.1rem]">
            <div className="transition-transform duration-1000 ease-[var(--ease-out-expo)] group-hover:scale-[1.04]">
              <SiteThumb item={item} />
            </div>
          </div>
        </motion.div>
        <div className="mt-5 flex items-start justify-between gap-6 px-1">
          <div>
            <p className="eyebrow text-purple">{item.kind}</p>
            <h3 className="mt-2 font-display text-3xl font-extrabold uppercase tracking-tight text-paper md:text-4xl">
              {item.title}
            </h3>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-paper/60 md:text-base">
              {item.description}
            </p>
          </div>
          <span className="mt-1 grid h-12 w-12 shrink-0 place-items-center rounded-full border border-white/20 text-paper transition-all duration-500 ease-[var(--ease-out-expo)] group-hover:rotate-45 group-hover:border-gold group-hover:bg-gold group-hover:text-ink">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
              <path d="M5 19L19 5M19 5H8M19 5v11" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
        {item.tags?.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2 px-1">
            {item.tags.map((tag) => (
              <li key={tag} className="rounded-full border border-white/12 px-3 py-1 text-[11px] font-bold text-paper/60">
                {tag}
              </li>
            ))}
          </ul>
        )}
      </a>
    </motion.li>
  );
}

function ComingSoon({ category, big = false }) {
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`col-span-12 ${big ? '' : 'md:col-span-6'}`}
    >
      <div className="relative flex h-full min-h-[260px] flex-col justify-between overflow-hidden rounded-[1.6rem] border-2 border-dashed border-white/15 p-8 md:min-h-[320px] md:p-10">
        <span className="eyebrow text-gold">Dropping soon</span>
        <div>
          <h3 className="font-display text-[clamp(1.8rem,9vw,2.4rem)] font-bold uppercase tracking-tight text-paper md:text-6xl md:font-extrabold">
            {category.label}
          </h3>
          <p className="mt-3 max-w-md text-paper/55">{category.blurb}</p>
        </div>
        <div className="pointer-events-none absolute -bottom-10 -right-6 w-36 rotate-[-14deg] opacity-90 md:w-44">
          <MonkeyFace />
        </div>
      </div>
    </motion.li>
  );
}

export default function Work() {
  const [filter, setFilter] = useState(ALL);
  const counts = Object.fromEntries(WORK_CATEGORIES.map((c) => [c.id, work.filter((w) => w.category === c.id).length]));
  const shown = filter === ALL ? work : work.filter((w) => w.category === filter);
  const upcoming = WORK_CATEGORIES.filter(
    (c) => counts[c.id] === 0 && (filter === ALL || filter === c.id)
  );
  const tabs = [{ id: ALL, label: 'All work', count: work.length }, ...WORK_CATEGORIES.map((c) => ({ id: c.id, label: c.label, count: counts[c.id] }))];

  return (
    <>
      <PageHero
        eyebrow="Our work"
        title={'Built with\nmonkey energy.'}
        accent={{ energy: 'text-gold' }}
        intro="Concept sites, store themes and, very soon, AI visuals and reels. Every piece is made to show range, motion and craft. Open any one to see it live."
      >
        <LayoutGroup>
          <div role="tablist" aria-label="Filter work" className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 md:mx-0 md:flex-wrap md:px-0">
            {tabs.map((t) => {
              const active = filter === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(t.id)}
                  className={`relative shrink-0 rounded-full px-5 py-2.5 text-xs font-extrabold uppercase tracking-[0.12em] transition-colors ${
                    active ? 'text-ink' : 'text-paper/70 hover:text-paper'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="work-tab"
                      className="absolute inset-0 rounded-full bg-gold"
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    />
                  )}
                  {!active && <span className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/15" />}
                  <span className="relative">
                    {t.label}
                    <sup className="ml-1 text-[0.6rem] opacity-70">{t.count > 0 ? t.count : 'soon'}</sup>
                  </span>
                </button>
              );
            })}
          </div>
        </LayoutGroup>
      </PageHero>

      <section className="bg-ink pb-28 md:pb-40">
        <div className="mx-auto max-w-[1600px] px-5 md:px-10">
          <motion.ul layout className="grid grid-cols-12 gap-x-8 gap-y-16 md:gap-y-20">
            <AnimatePresence mode="popLayout">
              {shown.map((item, i) => (
                <WorkCard key={item.id} item={item} index={i} />
              ))}
              {upcoming.map((c) => (
                <ComingSoon key={`soon-${c.id}`} category={c} big={filter !== ALL} />
              ))}
            </AnimatePresence>
          </motion.ul>
        </div>
      </section>

      <ClientsWall index="" />
      <BigCTA tone="purple" title={'Your brand\ncould be\nnext.'} accent={{ next: 'text-gold' }} />
    </>
  );
}
