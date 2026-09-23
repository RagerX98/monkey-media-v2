import { useEffect, useRef } from 'react';
import Reveal from '../Reveal';
import { gsap } from '../../lib/gsap';
import { clients } from '../../data/clients';

const FRAME_MS = 1000 / 60;

// Idle drift, px per 60fps frame (~45px/s). Deliberately slower than the 28s
// CSS loop this replaced (~106px/s), which read as restless on a logo wall.
const BASE_SPEED = 0.75;

// How much a pixel of scrolling feeds the marquee's velocity.
const SCROLL_GAIN = 0.45;

// Momentum scrolling on iOS produces very large per-frame deltas; without a
// ceiling a single flick sends the strip into a blur.
const MAX_VELOCITY = 45;

// Per-60fps-frame velocity decay. Normalised by real frame time below.
const DECAY = 0.9;

const VELOCITY_GAIN = 0.35;
const SKEW_GAIN = 0.12;
const MAX_SKEW = 7;

// Drag-throw momentum. Signed, unlike the scroll velocity above, so a flick
// can carry the strip either way before the base drift reasserts itself.
const MOMENTUM_DECAY = 0.94;
const THROW_GAIN = 1.1;
const MAX_MOMENTUM = 60;

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
  const viewportRef = useRef(null);

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
    const viewport = viewportRef.current;
    if (!track || !section || !viewport) return undefined;

    const reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    let raf = 0;
    let running = false;
    let pos = 0;
    let velocity = 0;
    let momentum = 0;
    let half = 0;
    let lastScroll = 0;
    let lastT = 0;

    // Drag state. Pointer events cover touch and mouse alike, so the strip is
    // draggable on a phone and on a desktop without separate code paths.
    let dragging = false;
    let lastPointerX = 0;
    let lastPointerDX = 0;

    // Measured on resize only. Reading scrollWidth inside the loop would force
    // a layout every frame, which is the usual reason marquees stutter.
    const measure = () => {
      half = track.scrollWidth / 2;
    };

    function tick(now) {
      const dt = lastT ? Math.min(now - lastT, 50) : FRAME_MS;
      lastT = now;
      const f = dt / FRAME_MS;

      if (dragging) {
        // The finger owns the position. Keep the scroll baseline fresh so
        // letting go doesn't register the whole drag as one scroll jump.
        lastScroll = window.scrollY;
      } else {
        // scrollY is read here rather than in a scroll listener on purpose:
        // iOS throttles scroll events during momentum — precisely when this
        // effect should be most alive — while rAF keeps running.
        const y = window.scrollY;
        velocity += (y - lastScroll) * SCROLL_GAIN;
        lastScroll = y;

        velocity = clamp(velocity, -MAX_VELOCITY, MAX_VELOCITY);
        velocity *= DECAY ** f;
        if (Math.abs(velocity) < 0.02) velocity = 0;

        momentum *= MOMENTUM_DECAY ** f;
        if (Math.abs(momentum) < 0.02) momentum = 0;

        pos -= (BASE_SPEED + Math.abs(velocity) * VELOCITY_GAIN) * f;
        pos += momentum * f;
      }

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

    // --- drag to scrub -------------------------------------------------
    // `touch-action: pan-y` on the viewport (set in the markup) lets the
    // browser keep vertical page scrolling while we take horizontal drags,
    // so grabbing the strip never traps a thumb trying to scroll the page.
    function onPointerDown(e) {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      if (reduceQuery.matches) return;
      dragging = true;
      lastPointerX = e.clientX;
      lastPointerDX = 0;
      momentum = 0;
      velocity = 0;
      viewport.dataset.dragging = 'true';
      // Capture is an optimisation, not a requirement — it throws
      // NotFoundError if the pointer is already gone, and that must not take
      // the drag down with it.
      try {
        viewport.setPointerCapture(e.pointerId);
      } catch {
        /* pointer already released; dragging still works via the listeners */
      }
    }

    function onPointerMove(e) {
      if (!dragging) return;
      const dx = e.clientX - lastPointerX;
      lastPointerX = e.clientX;
      lastPointerDX = dx;
      pos += dx; // 1:1 with the finger
    }

    function endDrag(e) {
      if (!dragging) return;
      dragging = false;
      delete viewport.dataset.dragging;

      // Set the throw BEFORE releasing capture: releasePointerCapture throws
      // NotFoundError when the pointer has already gone, and doing it first
      // would abort this handler and silently swallow every flick.
      momentum = clamp(lastPointerDX * THROW_GAIN, -MAX_MOMENTUM, MAX_MOMENTUM);
      lastScroll = window.scrollY;

      try {
        viewport.releasePointerCapture(e.pointerId);
      } catch {
        /* already released */
      }
    }

    measure();
    ro.observe(track);
    io.observe(section);
    document.addEventListener('visibilitychange', onVisibility);
    reduceQuery.addEventListener('change', onReduceChange);
    viewport.addEventListener('pointerdown', onPointerDown, { passive: true });
    viewport.addEventListener('pointermove', onPointerMove, { passive: true });
    viewport.addEventListener('pointerup', endDrag, { passive: true });
    viewport.addEventListener('pointercancel', endDrag, { passive: true });

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      reduceQuery.removeEventListener('change', onReduceChange);
      viewport.removeEventListener('pointerdown', onPointerDown);
      viewport.removeEventListener('pointermove', onPointerMove);
      viewport.removeEventListener('pointerup', endDrag);
      viewport.removeEventListener('pointercancel', endDrag);
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

      <div
        ref={viewportRef}
        className="relative mt-14 touch-pan-y select-none overflow-hidden [&[data-dragging]]:cursor-grabbing md:cursor-grab">
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
