import { Fragment, useLayoutEffect, useRef } from 'react';
import { gsap, prefersReducedMotion } from '../../lib/gsap';
import { onReady } from '../../lib/ready';

/**
 * Headline reveal: every word (or character) slides up from behind a mask.
 *
 * `text` is a plain string; `\n` forces a line break. `accent` maps words to an
 * extra class (e.g. { bananas: 'text-gold' }) — matched case-insensitively,
 * ignoring trailing punctuation.
 *
 * `trigger="load"` plays once the page is visible (after preloader / page
 * transition); `trigger="scroll"` plays when the element scrolls into view.
 */
export default function Split({
  text,
  as: Tag = 'h2',
  by = 'word',
  trigger = 'scroll',
  delay = 0,
  stagger,
  duration = 1.1,
  accent = {},
  className = '',
  ...props
}) {
  const ref = useRef(null);
  const reduced = typeof window !== 'undefined' && prefersReducedMotion();

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || reduced) return undefined;
    const pieces = el.querySelectorAll('[data-piece]');
    const ctx = gsap.context(() => {});
    let cancel = () => {};

    const play = () =>
      ctx.add(() => {
        // fromTo with an explicit y: 0 — GSAP would otherwise parse the inline
        // translateY(115%) placeholder into pixels and add it to yPercent.
        gsap.fromTo(pieces, { y: 0, yPercent: 115, rotate: 4 }, {
          yPercent: 0,
          rotate: 0,
          duration,
          delay,
          ease: 'expo.out',
          stagger: stagger ?? (by === 'char' ? 0.025 : 0.07),
          scrollTrigger:
            trigger === 'scroll' ? { trigger: el, start: 'top 88%', once: true } : undefined,
        });
      });

    if (trigger === 'load') cancel = onReady(play);
    else play();

    return () => {
      cancel();
      ctx.revert();
    };
  }, [reduced, trigger, delay, duration, stagger, by]);

  const hidden = reduced ? undefined : { transform: 'translateY(115%) rotate(4deg)' };
  const lines = String(text).split('\n');

  return (
    <Tag ref={ref} className={className} aria-label={text.replace(/\n/g, ' ')} {...props}>
      {lines.map((line, li) => (
        <Fragment key={li}>
          {li > 0 && <br />}
          {line.split(' ').map((word, wi, arr) => {
            const key = word.toLowerCase().replace(/[^a-z0-9&]/g, '');
            const extra = accent[key] ?? '';
            const space = wi < arr.length - 1 ? ' ' : '';
            if (by === 'char') {
              return (
                <Fragment key={wi}>
                  <span aria-hidden="true" className={`inline-block whitespace-nowrap ${extra}`}>
                    {[...word].map((ch, ci) => (
                      <span key={ci} className="mask">
                        <span data-piece style={hidden}>
                          {ch}
                        </span>
                      </span>
                    ))}
                  </span>
                  {space}
                </Fragment>
              );
            }
            return (
              <Fragment key={wi}>
                <span aria-hidden="true" className={`mask ${extra}`}>
                  <span data-piece style={hidden}>
                    {word}
                  </span>
                </span>
                {space}
              </Fragment>
            );
          })}
        </Fragment>
      ))}
    </Tag>
  );
}
