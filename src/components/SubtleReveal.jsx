import { motion } from 'framer-motion';

export default function SubtleReveal({ children, as = 'div', className = '', delay = 0 }) {
  const MotionTag = motion[as];

  return (
    <MotionTag
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut', delay }}
      className={className}
    >
      {children}
    </MotionTag>
  );
}
