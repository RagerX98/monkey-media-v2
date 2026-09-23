import { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1];

// Per-character stagger. Small, because a long headline multiplies it — the
// hero's "Pure Monkey Energy" is 16 glyphs, so 0.03 gives a ~0.5s sweep.
const CHAR_STAGGER = 0.03;

// Gap between each accent glyph's shine, which is what turns a row of
// individual pulses into one travelling highlight.
const SHINE_STAGGER = 0.05;

const charVariants = {
  hidden: { y: '105%' },
  visible: { y: '0%', transition: { duration: 0.72, ease: EASE } },
};

/**
 * Headline reveal: characters slide up from behind a clipping mask, then
 * accent words catch a single light sweep once they land.
 *
 * Replaces a whole-word fade+scale. The mask is what sells it — letters
 * emerge from behind a hard edge rather than fading in mid-air, which is the
 * difference between "animated" and "art-directed".
 *
 * Accessibility: per-character spans make screen readers announce a headline
 * letter by letter, so the visual spans are hidden and the real string is
 * exposed once through aria-label.
 *
 * `will-change` is deliberately not set here — Framer applies and, crucially,
 * removes it around each animation. Hard-coding it would leave a composited
 * layer alive per glyph for the life of the page.
 */
export default function RevealWords({
  text,
  as: Tag = 'h1',
  className = '',
  accentWords = [],
  accentClassName = 'text-gold',
  delay = 0,
  stagger = CHAR_STAGGER,
}) {
  const reduceMotion = useReducedMotion();
  const accentKey = accentWords.join('|');

  // Each word keeps its glyphs together so words still wrap as units, while
  // the stagger index runs continuously across the whole line.
  const { words, totalChars } = useMemo(() => {
    let i = 0;
    const parsed = text.split(' ').map((word) => ({
      word,
      isAccent: accentWords.includes(word),
      chars: word.split('').map((char) => ({ char, index: i++ })),
    }));
    return { words: parsed, totalChars: i };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, accentKey]);

  // Reduced motion: plain text, no masks, no sweep.
  if (reduceMotion) {
    return (
      <Tag className={className}>
        {words.map(({ word, isAccent }, i) => (
          <span key={`${word}-${i}`} className={isAccent ? accentClassName : undefined}>
            {word}
            {i < words.length - 1 ? ' ' : ''}
          </span>
        ))}
      </Tag>
    );
  }

  // The sweep starts as the final glyph lands.
  const sweepDelay = delay + totalChars * stagger + 0.45;

  return (
    <Tag className={className} aria-label={text}>
      <span aria-hidden="true">
        {words.map(({ word, isAccent, chars }, wi) => (
          <span
            key={`${word}-${wi}`}
            // nowrap is load-bearing: every glyph is its own inline-block, so
            // without it a line can break in the middle of a word ("MONK/EY").
            className={`inline-block whitespace-nowrap${isAccent ? ` ${accentClassName}` : ''}`}
          >
            {chars.map(({ char, index }, ci) => (
              <span key={index} className="reveal-mask">
                <motion.span
                  className={isAccent ? 'inline-block reveal-shine' : 'inline-block'}
                  // Staggered per glyph so the highlight travels across the
                  // word rather than flashing all of it at once.
                  style={
                    isAccent
                      ? { animationDelay: `${sweepDelay + ci * SHINE_STAGGER}s` }
                      : undefined
                  }
                  variants={charVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: delay + index * stagger }}
                >
                  {char}
                </motion.span>
              </span>
            ))}
            {wi < words.length - 1 ? ' ' : ''}
          </span>
        ))}
      </span>
    </Tag>
  );
}
