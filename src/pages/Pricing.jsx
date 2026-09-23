import PageFade from '../components/PageFade';
import SubtleReveal from '../components/SubtleReveal';
import MonkeyMascot from '../components/MonkeyMascot';
import CTAButton from '../components/CTAButton';

export default function Pricing() {
  return (
    <PageFade className="mx-auto flex max-w-3xl flex-col items-center px-6 pb-32 pt-40 text-center md:px-10">
      <MonkeyMascot size={120} />
      <SubtleReveal
        as="h1"
        delay={0.06}
        className="mt-8 text-4xl font-display font-extrabold uppercase tracking-tight text-paper md:text-6xl"
      >
        Let's Talk <span className="text-purple">Numbers</span>
      </SubtleReveal>
      <SubtleReveal as="p" delay={0.14} className="mt-4 max-w-lg text-paper/60">
        Every brand's needs are different, so we don't do cookie-cutter pricing. Book a free
        discovery call and we'll figure out exactly what you need: no fluff, no fixed
        packages, just a real conversation.
      </SubtleReveal>
      <CTAButton to="/contact" size="lg" className="mt-10">
        Book a Discovery Call
      </CTAButton>
    </PageFade>
  );
}
