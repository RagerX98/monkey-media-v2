import { useLayoutEffect, useRef } from 'react';
import MonkeyFace from './MonkeyFace';
import { gsap, prefersReducedMotion } from '../../lib/gsap';

function Letters({ text }) {
  return [...text].map((ch, i) => (
    <span key={i} className="mask">
      <span data-ch>{ch}</span>
    </span>
  ));
}

/**
 * "MONKEY / MEDIA" set huge across two lines, with the mascot standing in for
 * the O the way the logo does it. Letters rise into place when scrolled into
 * view. Font size is set here so the lines run edge to edge: Bold on phones,
 * ExtraBold (much wider) from md up.
 */
export default function Wordmark({ className = '' }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return undefined;
    const ctx = gsap.context(() => {
      gsap.from(el.querySelectorAll('[data-ch]'), {
        yPercent: 105,
        rotate: 6,
        duration: 1.2,
        ease: 'expo.out',
        stagger: 0.04,
        scrollTrigger: { trigger: el, start: 'top 95%', once: true },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={ref}
      role="img"
      aria-label="Monkey Media"
      className={`display select-none whitespace-nowrap text-[16vw] font-bold leading-[0.82] md:text-[13vw] md:font-extrabold min-[1600px]:text-[208px] ${className}`}
    >
      <div className="flex items-end">
        <Letters text="M" />
        <span className="mask">
          <span data-ch className="block">
            <MonkeyFace className="mx-[0.03em] mb-[0.03em] h-[0.765em] w-[0.84em]" />
          </span>
        </span>
        <Letters text="NKEY" />
      </div>
      <div className="flex justify-end">
        <Letters text="MEDIA" />
      </div>
    </div>
  );
}
