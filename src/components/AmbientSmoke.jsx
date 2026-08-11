import { useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion';

const SPRING = { stiffness: 30, damping: 20, mass: 1 };

export default function AmbientSmoke({ className = '' }) {
  const reduceMotion = useReducedMotion();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, SPRING);
  const springY = useSpring(mouseY, SPRING);

  const purpleX = useTransform(springX, [-0.5, 0.5], [-50, 50]);
  const purpleY = useTransform(springY, [-0.5, 0.5], [-36, 36]);
  const goldX = useTransform(springX, [-0.5, 0.5], [40, -40]);
  const goldY = useTransform(springY, [-0.5, 0.5], [30, -30]);

  useEffect(() => {
    if (reduceMotion) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    function handleMove(e) {
      mouseX.set(e.clientX / window.innerWidth - 0.5);
      mouseY.set(e.clientY / window.innerHeight - 0.5);
    }

    window.addEventListener('mousemove', handleMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMove);
  }, [reduceMotion, mouseX, mouseY]);

  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-0 z-0 overflow-hidden ${className}`}
    >
      <motion.div
        style={{ x: purpleX, y: purpleY }}
        className="absolute -right-32 top-0 h-72 w-72 will-change-transform md:-right-40 md:top-1/4 md:h-[520px] md:w-[520px]"
      >
        <motion.div
          animate={
            reduceMotion
              ? undefined
              : { x: [0, 110, -70, 40, -110, 0], y: [0, -90, 60, 120, -50, 0] }
          }
          transition={{
            x: { duration: 19, repeat: Infinity, ease: 'easeInOut' },
            y: { duration: 14, repeat: Infinity, ease: 'easeInOut' },
          }}
          className="h-full w-full rounded-full bg-purple/20 blur-[70px] md:blur-[90px]"
        />
      </motion.div>

      <motion.div
        style={{ x: goldX, y: goldY }}
        className="absolute -left-32 bottom-0 h-64 w-64 will-change-transform md:-left-40 md:h-[440px] md:w-[440px]"
      >
        <motion.div
          animate={
            reduceMotion
              ? undefined
              : { x: [0, -100, 80, -40, 100, 0], y: [0, 80, -100, -50, 60, 0] }
          }
          transition={{
            x: { duration: 21, repeat: Infinity, ease: 'easeInOut' },
            y: { duration: 16, repeat: Infinity, ease: 'easeInOut' },
          }}
          className="h-full w-full rounded-full bg-gold/[0.19] blur-[70px] md:blur-[90px]"
        />
      </motion.div>
    </div>
  );
}
