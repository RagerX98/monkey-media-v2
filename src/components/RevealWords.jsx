import { motion } from 'framer-motion';

const wordVariants = {
  hidden: { opacity: 0, scale: 0.82, y: 14 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function RevealWords({
  text,
  as: Tag = 'h1',
  className = '',
  accentWords = [],
  accentClassName = 'text-gold',
  delay = 0,
  stagger = 0.1,
}) {
  const words = text.split(' ');

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { delayChildren: delay, staggerChildren: stagger },
    },
  };

  return (
    <Tag className={className}>
      <motion.span
        className="inline"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {words.map((word, i) => (
          <motion.span
            key={`${word}-${i}`}
            variants={wordVariants}
            className={`inline-block will-change-transform ${
              accentWords.includes(word) ? accentClassName : ''
            }`}
          >
            {word}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        ))}
      </motion.span>
    </Tag>
  );
}
