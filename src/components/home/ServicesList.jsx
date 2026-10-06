import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import SectionHead from '../SectionHead';
import CTAButton from '../CTAButton';
import Reveal from '../Reveal';
import { services } from '../../data/services';

function Row({ service, open, onToggle }) {
  const id = `svc-${service.slug}`;
  return (
    <li className="border-b border-white/12">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={id}
        data-cursor={open ? 'Close' : 'Open'}
        className="group relative block w-full overflow-hidden text-left"
      >
        {/* Fill that rises behind the row on hover (and stays while open). */}
        <span
          aria-hidden="true"
          className={`absolute inset-0 origin-bottom bg-purple transition-transform duration-700 ease-[var(--ease-out-expo)] ${
            open ? 'scale-y-100' : 'scale-y-0 group-hover:scale-y-100'
          }`}
        />
        <span className="relative flex items-center gap-4 px-1 py-6 md:gap-10 md:px-4 md:py-8">
          <span className="eyebrow w-8 shrink-0 text-gold transition-colors md:w-14">
            {service.number}
          </span>
          <span className="flex-1 font-display text-[clamp(1.55rem,6.6vw,2.6rem)] font-bold uppercase leading-[0.95] tracking-[-0.03em] transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:translate-x-2 md:text-[clamp(2.4rem,4.6vw,5rem)] md:font-extrabold md:group-hover:translate-x-6">
            {service.title}
          </span>
          <span
            aria-hidden="true"
            className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/25 transition-all duration-500 ease-[var(--ease-out-expo)] md:h-14 md:w-14 ${
              open ? 'rotate-45 border-gold bg-gold text-ink' : 'group-hover:border-paper'
            }`}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 md:h-5 md:w-5" fill="none">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
            </svg>
          </span>
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={id}
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden bg-purple"
          >
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="grid gap-6 px-1 pb-8 md:grid-cols-[3.5rem_1fr_1fr] md:gap-10 md:px-4 md:pb-10"
            >
              <span className="hidden md:block" />
              <p className="max-w-xl text-base leading-relaxed text-paper/85 md:text-lg">
                {service.blurb}
              </p>
              <div className="flex flex-col items-start gap-6">
                <ul className="flex flex-wrap gap-2">
                  {service.deliverables.map((d) => (
                    <li
                      key={d}
                      className="rounded-full bg-paper/15 px-3.5 py-1.5 text-xs font-bold text-paper"
                    >
                      {d}
                    </li>
                  ))}
                </ul>
                <Link
                  to={`/services#${service.slug}`}
                  className="link-line text-xs font-extrabold uppercase tracking-[0.16em] text-gold"
                >
                  More on {service.short} →
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

export default function ServicesList() {
  const [open, setOpen] = useState(null);

  return (
    <section className="relative bg-ink pb-28 pt-16 md:pb-40 md:pt-24">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <SectionHead
          index="02"
          label="What we do"
          title={'Eight ways\nto get loud.'}
          accent={{ loud: 'text-gold' }}
          aside={
            <>
              <p className="text-paper/60">
                Pick one, or let us run the whole jungle. Every service plugs into the same
                strategy, so it all pulls in one direction.
              </p>
              <CTAButton to="/services" variant="ghost" className="mt-6">
                All services
              </CTAButton>
            </>
          }
        />

        <Reveal as="ul" className="mt-14 border-t border-white/12 md:mt-20">
          {services.map((s, i) => (
            <Row
              key={s.slug}
              service={s}
              open={open === i}
              onToggle={() => setOpen((v) => (v === i ? null : i))}
            />
          ))}
        </Reveal>
      </div>
    </section>
  );
}
