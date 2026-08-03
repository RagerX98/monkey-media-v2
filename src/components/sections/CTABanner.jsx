import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Reveal from '../Reveal';
import MonkeyMascot from '../MonkeyMascot';
import BananaRain from '../BananaRain';
import { gsap, ScrollTrigger } from '../../lib/gsap';

const RAIN_DURATION = 2200;
const TAP_NAV_DELAY = 350;

export default function CTABanner() {
  const sectionRef = useRef(null);
  const buttonRef = useRef(null);
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
    const ctx = gsap.context(() => {
      const trigger = {
        trigger: sectionRef.current,
        start: 'top 85%',
        end: 'top 40%',
        scrub: 0.6,
      };

      gsap.fromTo(
        buttonRef.current,
        { scale: 0.9 },
        { scale: 1, ease: 'none', scrollTrigger: trigger }
      );

      gsap.fromTo(
        glowRef.current,
        { opacity: 0, scale: 0.6 },
        { opacity: 0.6, scale: 1.2, ease: 'none', scrollTrigger: trigger }
      );
    }, sectionRef);

    return () => ctx.revert();
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
          <h2 className="text-4xl font-black uppercase leading-tight tracking-tight text-paper md:text-6xl">
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
          <Link
            ref={buttonRef}
            to="/pricing"
            onMouseEnter={startRain}
            onFocus={startRain}
            onTouchStart={startRain}
            onClick={handleClick}
            className={`inline-block rounded-full px-10 py-4 text-sm font-bold uppercase tracking-wide transition-colors hover:bg-gold hover:text-ink ${
              raining ? 'bg-gold text-ink' : 'bg-purple text-paper'
            }`}
          >
            Book a Discovery Call
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
