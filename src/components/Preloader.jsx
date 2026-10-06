import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import MonkeyFace from './brand/MonkeyFace';
import { gsap, prefersReducedMotion } from '../lib/gsap';
import { lockScroll } from '../lib/smooth';
import { markReady } from '../lib/ready';

const WORDS = ['Ideas', 'Content', 'Campaigns', 'Brands', 'Energy'];
const SEEN_KEY = 'mm-intro-seen';

function seenThisSession() {
  try {
    return sessionStorage.getItem(SEEN_KEY) === '1';
  } catch {
    return false;
  }
}

/**
 * First-visit intro. The mascot wakes up while a counter runs to 100, then
 * the screen opens like an eye: two curved lids part to reveal the site.
 * Shown once per browser session; skipped entirely under reduced motion.
 */
export default function Preloader() {
  const [show, setShow] = useState(() => !seenThisSession() && !prefersReducedMotion());
  const root = useRef(null);
  const countRef = useRef(null);
  const wordRef = useRef(null);

  // Nothing to show: the page is ready immediately.
  useEffect(() => {
    if (!show) markReady();
  }, [show]);

  useLayoutEffect(() => {
    if (!show) return undefined;
    const el = root.current;
    lockScroll(true);
    const q = gsap.utils.selector(el);
    const counter = { v: 0 };
    let wordIndex = 0;

    const ctx = gsap.context(() => {
      const fonts = document.fonts?.ready ?? Promise.resolve();
      const tl = gsap.timeline({ paused: true });

      tl.from(q('[data-face]'), { scale: 0, rotate: -25, duration: 0.9, ease: 'back.out(2.2)' }, 0)
        .from(q('[data-meta]'), { opacity: 0, y: 20, duration: 0.6, stagger: 0.08 }, 0.15)
        .to(
          counter,
          {
            v: 100,
            duration: 1.9,
            ease: 'power2.inOut',
            onUpdate: () => {
              const v = Math.round(counter.v);
              if (countRef.current) countRef.current.textContent = String(v).padStart(3, '0');
              const next = Math.min(WORDS.length - 1, Math.floor((counter.v / 100) * WORDS.length));
              if (next !== wordIndex && wordRef.current) {
                wordIndex = next;
                wordRef.current.textContent = WORDS[next];
                gsap.fromTo(wordRef.current, { yPercent: 100 }, { yPercent: 0, duration: 0.35, ease: 'power3.out' });
              }
            },
          },
          0.1
        )
        .to(q('[data-bar]'), { scaleX: 1, duration: 1.9, ease: 'power2.inOut' }, 0.1)
        // The mascot blinks once, the content steps back…
        .call(() => {
          const svg = el.querySelector('[data-face] svg');
          if (!svg) return;
          svg.dataset.blink = '';
          setTimeout(() => delete svg.dataset.blink, 160);
        })
        .to(q('[data-content]'), { opacity: 0, scale: 0.94, duration: 0.45, ease: 'power2.in' }, '+=0.25')
        // …a gleam opens across the middle, and the lids part.
        .fromTo(q('[data-gleam]'), { scaleX: 0 }, { scaleX: 1, duration: 0.45, ease: 'expo.out' }, '<0.15')
        .add('open')
        .to(q('[data-lid="top"]'), { yPercent: -101, duration: 1.05, ease: 'expo.inOut' }, 'open')
        .to(q('[data-lid="bottom"]'), { yPercent: 101, duration: 1.05, ease: 'expo.inOut' }, 'open')
        .to(q('[data-gleam]'), { opacity: 0, duration: 0.3 }, 'open+=0.2')
        .call(
          () => {
            lockScroll(false);
            markReady();
          },
          null,
          'open+=0.35'
        )
        .call(() => {
          try {
            sessionStorage.setItem(SEEN_KEY, '1');
          } catch {
            /* private mode: the intro will simply play again next time */
          }
          setShow(false);
        });

      // Never sit on the loader longer than ~3.5s waiting for fonts.
      Promise.race([fonts, new Promise((r) => setTimeout(r, 1500))]).then(() => tl.play());
    }, el);

    return () => {
      ctx.revert();
      lockScroll(false);
    };
  }, [show]);

  if (!show) return null;

  return (
    <div ref={root} className="fixed inset-0 z-[110]" aria-hidden="true">
      <div
        data-lid="top"
        className="absolute inset-x-0 top-0 h-[56%] rounded-b-[50%_14vh] bg-ink will-change-transform"
      />
      <div
        data-lid="bottom"
        className="absolute inset-x-0 bottom-0 h-[56%] rounded-t-[50%_14vh] bg-ink will-change-transform"
      />
      <div
        data-gleam
        className="absolute left-0 right-0 top-1/2 h-[3px] -translate-y-1/2 origin-center bg-gold shadow-[0_0_24px_6px_rgba(255,215,0,0.45)]"
        style={{ transform: 'scaleX(0)' }}
      />

      <div data-content className="absolute inset-0 grid place-items-center">
        <div data-face>
          <MonkeyFace className="w-[clamp(120px,24vw,200px)]" />
        </div>

        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 px-5 pb-8 md:px-10 md:pb-10">
          <div data-meta className="pb-2">
            <p className="eyebrow text-paper/50">Loading</p>
            <p className="mt-2 overflow-hidden font-display text-2xl font-extrabold uppercase text-paper md:text-4xl">
              <span ref={wordRef} className="inline-block">
                {WORDS[0]}
              </span>
            </p>
          </div>
          <p
            data-meta
            ref={countRef}
            className="font-display text-[clamp(4.5rem,18vw,13rem)] font-extrabold leading-[0.8] tracking-tight text-gold tabular-nums"
          >
            000
          </p>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-1 bg-paper/10">
          <div data-bar className="h-full origin-left bg-gold" style={{ transform: 'scaleX(0)' }} />
        </div>
      </div>
    </div>
  );
}
