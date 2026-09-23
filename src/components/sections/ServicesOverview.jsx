import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Reveal from '../Reveal';
import ServiceCard from '../ServiceCard';
import CTAButton from '../CTAButton';

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
      "Everything a traditional shoot gives you: product photography, model shoots, social visuals, video, without booking one. Faster. Cheaper. AI-generated.",
  },
];

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
          <h2 className="mt-4 text-4xl font-display font-extrabold uppercase tracking-tight text-paper md:text-6xl">
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
          <CTAButton to="/services" size="lg">
            See All Services
          </CTAButton>
        </Reveal>
      </div>
    </section>
  );
}
