import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Reveal from '../Reveal';
import CTAButton from '../CTAButton';
import MonkeyMascot from '../MonkeyMascot';
import BananaRain from '../BananaRain';
import { gsap } from '../../lib/gsap';

const RAIN_DURATION = 2200;
const TAP_NAV_DELAY = 350;

export default function CTABanner() {
  const sectionRef = useRef(null);
  const buttonWrapRef = useRef(null);
  const glowRef = useRef(null);
  const [raining, setRaining] = useState(false);
  const rainTimer = useRef(null);
  const navigate = useNavigate();

  function startRain() {
    setRaining(true);
    clearTimeout(rainTimer.current);
    rainTimer.current = setTimeout(() => setRaining(false), RAIN_DURATION);
  }

  function handleClick(e) {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    startRain();
    setTimeout(() => navigate('/pricing'), TAP_NAV_DELAY);
  }

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const trigger = {
        trigger: sectionRef.current,
        start: 'top 85%',
        end: 'top 40%',
        scrub: 0.6,
      };

      // Scrubbed on the wrapper, never on the button: CTAButton animates its
      // own transform via Framer (hover/press), and two libraries writing the
      // same transform would overwrite each other frame to frame.
      gsap.fromTo(
        buttonWrapRef.current,
        { scale: 0.9 },
        { scale: 1, ease: 'none', scrollTrigger: trigger }
      );

      gsap.fromTo(
        glowRef.current,
        { opacity: 0, scale: 0.6 },
        { opacity: 0.6, scale: 1.2, ease: 'none', scrollTrigger: trigger }
      );
    });

    // A scrub ties motion directly to the scroll wheel, which is the most
    // uncomfortable kind for a motion-sensitive visitor. Settle both at their
    // end state instead.
    mm.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set(buttonWrapRef.current, { scale: 1 });
      gsap.set(glowRef.current, { opacity: 0.6, scale: 1.2 });
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-ink py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple/15 blur-[140px]"
      />
      {raining && <BananaRain />}
      <div className="relative mx-auto flex max-w-4xl flex-col items-center px-6 text-center md:px-10">
        <Reveal>
          <MonkeyMascot size={110} className="mx-auto mb-8" />
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="text-4xl font-display font-extrabold uppercase leading-tight tracking-tight text-paper md:text-6xl">
            Ready to go <span className="text-purple">bananas?</span>
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mt-6 max-w-lg text-paper/60">
            No price lists, no fixed packages. Just a free discovery call to figure out how we
            can help your brand win.
          </p>
        </Reveal>
        <Reveal delay={0.3} className="relative mt-10 inline-block">
          <span
            ref={glowRef}
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-gold blur-2xl"
            style={{ opacity: 0, transform: 'scale(0.6)' }}
          />
          <span ref={buttonWrapRef} className="inline-block will-change-transform">
            <CTAButton
              to="/pricing"
              size="lg"
              onMouseEnter={startRain}
              onFocus={startRain}
              onTouchStart={startRain}
              onClick={handleClick}
              className={raining ? 'bg-gold text-ink' : undefined}
            >
              Book a Discovery Call
            </CTAButton>
          </span>
        </Reveal>
      </div>
    </section>
  );
}
