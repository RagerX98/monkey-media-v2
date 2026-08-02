import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Reveal from '../Reveal';

const TEASER_SERVICES = [
  {
    number: '01',
    title: 'Social Media Management',
    blurb:
      'Feeds that people actually stop for. Strategy, content calendars, and community energy handled end to end.',
  },
  {
    number: '02',
    title: 'Content Creation',
    blurb: 'Photo, video, and design that stops the scroll. Made for the feed, not the boardroom.',
  },
  {
    number: '03',
    title: 'Branding',
    blurb:
      'Identity systems with teeth: name, logo, voice, and vibe, built to survive contact with the real world.',
  },
  {
    number: '04',
    title: 'AI Photography & Visuals',
    blurb:
      'Test a thousand looks before the real shoot. AI product photography, model creation, and visual experiments. Perfect for D2C brands that move fast.',
  },
];

function ServiceCard({ service, index }) {
  const fromLeft = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: fromLeft ? -70 : 70 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-void p-8 transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-1.5 hover:border-purple/60 hover:shadow-[0_20px_50px_-14px_rgba(139,92,246,0.4)] lg:p-10"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-purple/0 blur-3xl transition-colors duration-300 ease-out group-hover:bg-purple/20"
      />

      <span className="relative text-sm font-bold text-purple">{service.number}</span>
      <h3 className="relative mt-6 text-2xl font-black uppercase leading-tight text-paper lg:text-[1.75rem]">
        {service.title}
      </h3>
      <p className="relative mt-3 text-sm text-paper/60 transition-colors duration-300 ease-out group-hover:text-paper/85">
        {service.blurb}
      </p>
    </motion.div>
  );
}

function Chevron({ isOpen }) {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-5 w-5 shrink-0 text-gold"
      animate={{ rotate: isOpen ? 180 : 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
    >
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </motion.svg>
  );
}

function AccordionItem({ service, isOpen, onToggle }) {
  const panelId = `service-panel-${service.number}`;

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-void">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left"
      >
        <span className="flex items-center gap-3">
          <span className="text-xs font-bold text-purple">{service.number}</span>
          <span className="text-base font-black uppercase leading-tight text-paper">
            {service.title}
          </span>
        </span>
        <Chevron isOpen={isOpen} />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={panelId}
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-5 text-sm text-paper/60">{service.blurb}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ServicesOverview() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="relative overflow-hidden bg-ink py-28">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-purple">
            What We Do
          </span>
          <h2 className="mt-4 text-4xl font-black uppercase tracking-tight text-paper md:text-6xl">
            A taste of the <span className="text-gold">jungle.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-paper/50">
            Four to warm up. Eight to go full monkey mode. Which vibe?
          </p>
        </Reveal>

        <div className="mt-16 hidden sm:grid sm:grid-cols-2 sm:gap-6">
          {TEASER_SERVICES.map((service, i) => (
            <ServiceCard key={service.number} service={service} index={i} />
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-4 sm:hidden">
          {TEASER_SERVICES.map((service, i) => (
            <AccordionItem
              key={service.number}
              service={service}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex((prev) => (prev === i ? null : i))}
            />
          ))}
        </div>

        <Reveal delay={0.25} className="mt-14 flex justify-center">
          <Link
            to="/services"
            className="rounded-full bg-purple px-10 py-4 text-sm font-bold uppercase tracking-wide text-paper transition-transform duration-300 hover:scale-105 hover:bg-gold hover:text-ink"
          >
            See All Services
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
