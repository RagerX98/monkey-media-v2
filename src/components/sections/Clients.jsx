import { useEffect, useRef } from 'react';
import Reveal from '../Reveal';
import { gsap, ScrollTrigger } from '../../lib/gsap';
import { clients } from '../../data/clients';

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
  const wrapperRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = wrapperRef.current.querySelectorAll('[data-logo-card]');
      gsap.fromTo(
        cards,
        { opacity: 0, y: 14 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power2.out',
          stagger: 0.06,
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="relative border-y border-white/10 bg-ink py-24">
      <div className="mx-auto max-w-7xl px-6 text-center md:px-10">
        <Reveal>
          <span className="text-xs font-bold uppercase tracking-widest text-gold">
            Brands We've Worked With
          </span>
          <h2 className="mx-auto mt-4 max-w-xl text-3xl font-black uppercase tracking-tight text-paper md:text-5xl">
            From global names to fast-growing D2C labels, here's a look at who trusts us.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-paper/50">
            Whether we built with them or for them, we understand what it takes to move fast and
            win.
          </p>
        </Reveal>
      </div>

      <div ref={wrapperRef} className="relative mt-14 overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-ink to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-ink to-transparent" />
        <div className="flex w-max animate-marquee gap-6">
          {clients.map((client) => (
            <div key={`a-${client.name}`} data-logo-card>
              <LogoCard client={client} />
            </div>
          ))}
          {clients.map((client) => (
            <LogoCard key={`b-${client.name}`} client={client} />
          ))}
        </div>
      </div>
    </section>
  );
}
