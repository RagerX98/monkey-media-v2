import { useEffect, useRef } from 'react';
import Reveal from '../Reveal';
import { gsap } from '../../lib/gsap';
import { clients } from '../../data/clients';

const FRAME_MS = 1000 / 60;

// Idle drift, px per 60fps frame (~96px/s — close to the 28s CSS loop this
// replaces, so the resting feel is unchanged).
const BASE_SPEED = 1.6;

// How much a pixel of scrolling feeds the marquee's velocity.
const SCROLL_GAIN = 0.45;

// Momentum scrolling on iOS produces very large per-frame deltas; without a
// ceiling a single flick sends the strip into a blur.
const MAX_VELOCITY = 45;

// Per-60fps-frame velocity decay. Normalised by real frame time below.
const DECAY = 0.9;

const VELOCITY_GAIN = 0.5;
const SKEW_GAIN = 0.12;
const MAX_SKEW = 7;

const clamp = (v, min, max) => (v < min ? min : v > max ? max : v);

function LogoCard({ client }) {
  return (
    <div className="h-24 w-56 shrink-0 overflow-hidden rounded-2xl shadow-[0_0_0_1px_rgba(255,255,255,0.06)]">
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
  const sectionRef = useRef(null);
  const trackRef = useRef(null);

  // Entrance fade for the first set of logos. Kept separate from the marquee
  // loop below: this touches the cards, that touches only the track.
  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const cards = sectionRef.current.querySelectorAll('[data-logo-card]');
      gsap.fromTo(
        cards,
        { opacity: 0, y: 14 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power2.out',
          stagger: 0.06,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 85%', once: true },
        }
      );
    });

    mm.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set(sectionRef.current.querySelectorAll('[data-logo-card]'), { opacity: 1, y: 0 });
    });

    return () => mm.revert();
  }, []);

  // Scroll-velocity marquee.
  useEffect(() => {
    const track = trackRef.current;
    const section = sectionRef.current;
    if (!track || !section) return undefined;

    const reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    let raf = 0;
    let running = false;
    let pos = 0;
    let velocity = 0;
    let half = 0;
    let lastScroll = 0;
    let lastT = 0;

    // Measured on resize only. Reading scrollWidth inside the loop would force
    // a layout every frame, which is the usual reason marquees stutter.
    const measure = () => {
      half = track.scrollWidth / 2;
    };

    function tick(now) {
      const dt = lastT ? Math.min(now - lastT, 50) : FRAME_MS;
      lastT = now;
      const f = dt / FRAME_MS;

      // scrollY is read here rather than in a scroll listener on purpose:
      // iOS throttles scroll events during momentum — precisely when this
      // effect should be most alive — while rAF keeps running.
      const y = window.scrollY;
      velocity += (y - lastScroll) * SCROLL_GAIN;
      lastScroll = y;

      velocity = clamp(velocity, -MAX_VELOCITY, MAX_VELOCITY);
      velocity *= DECAY ** f;
      if (Math.abs(velocity) < 0.02) velocity = 0;

      pos -= (BASE_SPEED + Math.abs(velocity) * VELOCITY_GAIN) * f;

      // The track holds two identical sets, so rewinding by exactly half its
      // width is invisible.
      if (half > 0) {
        if (pos <= -half) pos += half;
        else if (pos > 0) pos -= half;
      }

      const skew = clamp(velocity * SKEW_GAIN, -MAX_SKEW, MAX_SKEW);
      track.style.transform = `translate3d(${pos.toFixed(2)}px, 0, 0) skewX(${skew.toFixed(2)}deg)`;

      raf = requestAnimationFrame(tick);
    }

    function start() {
      if (running || reduceQuery.matches) return;
      running = true;
      lastT = 0;
      lastScroll = window.scrollY;
      raf = requestAnimationFrame(tick);
    }

    function stop() {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    }

    // The loop only runs while the strip is near the viewport. Off-screen it
    // costs nothing, which matters most on a phone.
    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { rootMargin: '150px 0px' }
    );

    const ro = new ResizeObserver(measure);

    // Returning from a background tab: rAF has been parked, so both the clock
    // and the scroll baseline are stale. Without this the first frame back
    // sees a huge delta and the strip lurches.
    const onVisibility = () => {
      if (!document.hidden) {
        lastT = 0;
        lastScroll = window.scrollY;
      }
    };

    const onReduceChange = () => {
      if (reduceQuery.matches) {
        stop();
        track.style.transform = '';
      } else {
        start();
      }
    };

    measure();
    ro.observe(track);
    io.observe(section);
    document.addEventListener('visibilitychange', onVisibility);
    reduceQuery.addEventListener('change', onReduceChange);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      reduceQuery.removeEventListener('change', onReduceChange);
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative border-y border-white/10 bg-ink py-24">
      <div className="mx-auto max-w-7xl px-6 text-center md:px-10">
        <Reveal>
          <span className="text-xs font-bold uppercase tracking-widest text-gold">
            Brands We've Worked With
          </span>
          <h2 className="mx-auto mt-4 max-w-xl text-3xl font-display font-extrabold uppercase tracking-tight text-paper md:text-5xl">
            From global names to fast-growing D2C labels, here's a look at who trusts us.
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
        <div ref={trackRef} className="flex w-max gap-6 will-change-transform">
          {clients.map((client) => (
            <div key={`a-${client.name}`} data-logo-card>
              <LogoCard client={client} />
            </div>
          ))}
          {/* Duplicate set purely to make the wrap seamless — hidden from
              assistive tech so the list isn't announced twice. */}
          {clients.map((client) => (
            <div key={`b-${client.name}`} aria-hidden="true">
              <LogoCard client={client} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
