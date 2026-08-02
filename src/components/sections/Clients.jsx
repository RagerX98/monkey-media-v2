import { motion } from 'framer-motion';
import Reveal from '../Reveal';
import { clients } from '../../data/clients';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const logoVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

function LogoCard({ client }) {
  return (
    <div className="h-24 w-56 shrink-0 overflow-hidden rounded-2xl shadow-[0_0_0_1px_rgba(255,255,255,0.06)] transition-transform hover:scale-105">
      <picture>
        <source srcSet={client.logoWebp} type="image/webp" />
        <img
          src={client.logo}
          alt={client.name}
          className="h-full w-full object-cover"
          draggable={false}
          loading="lazy"
          decoding="async"
        />
      </picture>
    </div>
  );
}

export default function Clients() {
  return (
    <section className="relative border-y border-white/10 bg-ink py-24">
      <div className="mx-auto max-w-7xl px-6 text-center md:px-10">
        <Reveal>
          <span className="text-xs font-bold uppercase tracking-widest text-gold">
            Brands We've Worked With
          </span>
          <h2 className="mx-auto mt-4 max-w-xl text-3xl font-black uppercase tracking-tight text-paper md:text-5xl">
            From inside these teams to building for you
          </h2>
          <p className="mx-auto mt-4 max-w-md text-paper/50">
            Whether we built with them or for them, we understand what it takes to move fast and
            win.
          </p>
        </Reveal>
      </div>

      <div className="relative mt-14 overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-ink to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-ink to-transparent" />
        <motion.div
          className="flex w-max animate-marquee gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
        >
          {clients.map((client) => (
            <motion.div key={`a-${client.name}`} variants={logoVariants}>
              <LogoCard client={client} />
            </motion.div>
          ))}
          {clients.map((client) => (
            <LogoCard key={`b-${client.name}`} client={client} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
