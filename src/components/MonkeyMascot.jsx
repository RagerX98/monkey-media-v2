import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion';
import mascotIcon from '../assets/mascot-icon.png';
import mascotIconWebp from '../assets/mascot-icon.webp';

const GLOW = 'drop-shadow(0 0 32px rgba(139,92,246,0.4))';

export default function MonkeyMascot({ size = 96, interactive = true, className = '' }) {
  const ref = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const reduceMotion = useReducedMotion();

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [14, -14]), {
    stiffness: 150,
    damping: 12,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-14, 14]), {
    stiffness: 150,
    damping: 12,
  });

  function handleMouseMove(e) {
    if (!interactive || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  function handleTouchMove(e) {
    if (!interactive || !ref.current) return;
    const touch = e.touches[0];
    if (!touch) return;
    const rect = ref.current.getBoundingClientRect();
    mouseX.set((touch.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((touch.clientY - rect.top) / rect.height - 0.5);
  }

  function handleTouchEnd() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      style={{ width: size, height: size, perspective: 600 }}
      className={`relative select-none ${className}`}
      animate={reduceMotion ? undefined : { y: [0, -14, 0], rotate: [-4, 4, -4] }}
      transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
    >
      <picture>
        <source srcSet={mascotIconWebp} type="image/webp" />
        <motion.img
          src={mascotIcon}
          alt="Monkey Media mascot"
          draggable={false}
          style={{
            width: '100%',
            height: '100%',
            rotateX: interactive ? rotateX : 0,
            rotateY: interactive ? rotateY : 0,
            transformStyle: 'preserve-3d',
            filter: GLOW,
          }}
          whileHover={interactive ? { scale: 1.08 } : undefined}
        />
      </picture>
    </motion.div>
  );
}
