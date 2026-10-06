import { forwardRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';

// Created once at module scope — building this inside render would remount the
// underlying <a> on every parent update and kill the press animation mid-tap.
const MotionLink = motion.create(Link);

// Each variant: resting colours, the fill that rises on hover, and the text
// colour once the fill has risen.
const VARIANTS = {
  primary: { base: 'bg-purple text-paper', fill: 'bg-gold', hover: 'group-hover:text-ink' },
  gold: { base: 'bg-gold text-ink', fill: 'bg-purple', hover: 'group-hover:text-paper' },
  dark: { base: 'bg-ink text-paper', fill: 'bg-purple', hover: 'group-hover:text-paper' },
  light: { base: 'bg-paper text-ink', fill: 'bg-gold', hover: 'group-hover:text-ink' },
  ghost: {
    base: 'text-current shadow-[inset_0_0_0_1.5px_currentColor]',
    fill: 'bg-paper',
    hover: 'group-hover:text-ink',
  },
  'ghost-dark': {
    base: 'text-ink shadow-[inset_0_0_0_1.5px_currentColor]',
    fill: 'bg-ink',
    hover: 'group-hover:text-paper',
  },
};

const SIZES = {
  sm: 'h-10 pl-5 pr-2 text-[0.7rem] gap-3',
  md: 'h-13 pl-7 pr-2 text-xs gap-4',
  lg: 'h-16 pl-9 pr-2.5 text-sm gap-5',
};
const ICON = { sm: 'h-7 w-7', md: 'h-9 w-9', lg: 'h-11 w-11' };

const PRESS = { type: 'spring', stiffness: 420, damping: 30, mass: 0.6 };

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-[45%] w-[45%]" aria-hidden="true">
      <path
        d="M5 19L19 5M19 5H8M19 5v11"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * The one button on the site. A pill whose label rolls up to a fresh copy
 * while a second colour rises behind it, with a round arrow chip that turns.
 *
 * Framer owns `transform` (press feedback); everything else is CSS on
 * children, so the two never fight over the same property.
 *
 * Renders a router <Link> for `to`, an <a> for `href`, otherwise a <button>.
 */
const CTAButton = forwardRef(function CTAButton(
  { to, href, variant = 'primary', size = 'md', arrow = true, className = '', children, ...props },
  ref
) {
  const reduceMotion = useReducedMotion();
  const v = VARIANTS[variant] ?? VARIANTS.primary;
  const s = SIZES[size] ?? SIZES.md;

  const classes = `group relative isolate inline-flex select-none items-center overflow-hidden rounded-full font-extrabold uppercase tracking-[0.14em] transition-colors duration-300 ${v.base} ${s} ${
    arrow ? '' : 'pr-7'
  } ${className}`;

  const inner = (
    <>
      <span
        aria-hidden="true"
        className={`absolute -inset-px -z-10 translate-y-[101%] rounded-[50%_50%_0_0/40%_40%_0_0] transition-[transform,border-radius] duration-500 ease-[var(--ease-out-expo)] group-hover:translate-y-0 group-hover:rounded-none ${v.fill}`}
      />
      <span className={`relative block overflow-hidden transition-colors duration-300 ${v.hover}`}>
        <span className="block transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:-translate-y-full">
          {children}
        </span>
        <span
          aria-hidden="true"
          className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-y-0"
        >
          {children}
        </span>
      </span>
      {arrow && (
        <span
          aria-hidden="true"
          className={`relative grid shrink-0 place-items-center rounded-full bg-current/15 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:rotate-45 ${ICON[size] ?? ICON.md} ${v.hover}`}
        >
          <Arrow />
        </span>
      )}
    </>
  );

  const motionProps = reduceMotion ? {} : { whileTap: { scale: 0.95 }, transition: PRESS };

  if (to) {
    return (
      <MotionLink ref={ref} to={to} className={classes} {...motionProps} {...props}>
        {inner}
      </MotionLink>
    );
  }
  if (href) {
    return (
      <motion.a ref={ref} href={href} className={classes} {...motionProps} {...props}>
        {inner}
      </motion.a>
    );
  }
  return (
    <motion.button ref={ref} type="button" className={classes} {...motionProps} {...props}>
      {inner}
    </motion.button>
  );
});

export default CTAButton;
