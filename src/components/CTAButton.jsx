import { forwardRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';

// Created once at module scope — building this inside render would remount the
// underlying <a> on every parent update and kill the press animation mid-tap.
const MotionLink = motion.create(Link);

const BASE =
  'inline-block select-none rounded-full text-center text-sm font-bold uppercase tracking-wide transition-colors';

const VARIANTS = {
  primary: 'bg-purple text-paper hover:bg-gold hover:text-ink',
  ghost: 'border border-white/25 text-paper hover:border-paper',
};

const SIZES = {
  sm: 'px-5 py-2',
  md: 'px-8 py-4',
  lg: 'px-10 py-4',
};

// A spring rather than a duration: a tap that is released early settles from
// wherever it actually got to, instead of snapping. Stiff and well damped so it
// reads as firm, not springy.
const PRESS = { type: 'spring', stiffness: 420, damping: 32, mass: 0.6 };

/**
 * The one button on the site.
 *
 * Every CTA used to carry its own copy of the same Tailwind string plus
 * `transition-transform hover:scale-105`. That CSS transition fought any
 * Framer transform applied on top of it, so a press state could not be added
 * without the two cancelling each other. Here Framer owns `transform`
 * outright and CSS is left with colour only, which is also why touch devices
 * finally get feedback: `whileTap` fires on pointerdown, `hover:` never did.
 *
 * Renders a router <Link> for `to`, an <a> for `href`, otherwise a <button>.
 */
const CTAButton = forwardRef(function CTAButton(
  { to, href, variant = 'primary', size = 'md', className = '', children, ...props },
  ref
) {
  const reduceMotion = useReducedMotion();

  const classes = `${BASE} ${VARIANTS[variant] ?? VARIANTS.primary} ${
    SIZES[size] ?? SIZES.md
  } ${className}`;

  // Reduced motion keeps the colour swap and drops the movement entirely.
  const motionProps = reduceMotion
    ? {}
    : {
        whileHover: { scale: 1.05 },
        whileTap: { scale: 0.95 },
        transition: PRESS,
      };

  if (to) {
    return (
      <MotionLink ref={ref} to={to} className={classes} {...motionProps} {...props}>
        {children}
      </MotionLink>
    );
  }

  if (href) {
    return (
      <motion.a ref={ref} href={href} className={classes} {...motionProps} {...props}>
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button ref={ref} type="button" className={classes} {...motionProps} {...props}>
      {children}
    </motion.button>
  );
});

export default CTAButton;
