import { Link } from 'react-router-dom';
import PageFade from '../components/PageFade';
import SubtleReveal from '../components/SubtleReveal';
import MonkeyMascot from '../components/MonkeyMascot';

export default function Pricing() {
  return (
    <PageFade className="mx-auto flex max-w-3xl flex-col items-center px-6 pb-32 pt-40 text-center md:px-10">
      <MonkeyMascot size={120} />
      <SubtleReveal
        as="h1"
        delay={0.06}
        className="mt-8 text-4xl font-black uppercase tracking-tight text-paper md:text-6xl"
      >
        Let's Talk <span className="text-purple">Numbers</span>
      </SubtleReveal>
      <SubtleReveal as="p" delay={0.14} className="mt-4 max-w-lg text-paper/60">
        Every brand's needs are different, so we don't do cookie-cutter pricing. Book a free
        discovery call and we'll figure out exactly what you need: no fluff, no fixed
        packages, just a real conversation.
      </SubtleReveal>
      <Link
        to="/contact"
        className="mt-10 rounded-full bg-purple px-10 py-4 text-sm font-bold uppercase tracking-wide text-paper transition-transform hover:scale-105 hover:bg-gold hover:text-ink"
      >
        Book a Discovery Call
      </Link>
    </PageFade>
  );
}
