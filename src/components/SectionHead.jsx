import Reveal from './Reveal';
import Split from './motion/Split';

/**
 * The standard section opener: a numbered eyebrow, a big split-reveal title
 * and an optional aside (copy, a button) that sits right of the title on wide
 * screens and below it on phones.
 *
 * `tone` sets the colours for the surface it sits on.
 */
const TONES = {
  dark: { index: 'text-gold', rule: 'bg-paper/25', label: 'text-paper/55', title: 'text-paper' },
  light: { index: 'text-purple', rule: 'bg-ink/20', label: 'text-ink/55', title: 'text-ink' },
  purple: { index: 'text-gold', rule: 'bg-paper/35', label: 'text-paper/75', title: 'text-paper' },
  gold: { index: 'text-purple', rule: 'bg-ink/25', label: 'text-ink/65', title: 'text-ink' },
};

export default function SectionHead({
  index,
  label,
  title,
  accent,
  aside,
  tone = 'dark',
  as = 'h2',
  className = '',
  titleClassName = 'text-[clamp(2.6rem,11vw,4.2rem)] font-bold md:text-[clamp(3.4rem,6.2vw,7.4rem)] md:font-extrabold',
}) {
  const t = TONES[tone] ?? TONES.dark;
  return (
    <div className={`flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between ${className}`}>
      <div>
        <Reveal className="flex items-center gap-4">
          {index && <span className={`eyebrow ${t.index}`}>{index}</span>}
          {index && <span className={`h-px w-10 ${t.rule}`} />}
          <span className={`eyebrow ${t.label}`}>{label}</span>
        </Reveal>
        <Split
          as={as}
          text={title}
          accent={accent}
          className={`display mt-6 ${t.title} ${titleClassName}`}
        />
      </div>
      {aside && (
        <Reveal delay={0.15} className="max-w-sm lg:pb-3">
          {aside}
        </Reveal>
      )}
    </div>
  );
}
