import PageFade from '../components/PageFade';
import SubtleReveal from '../components/SubtleReveal';
import ServiceCard from '../components/ServiceCard';
import CTAButton from '../components/CTAButton';
import { services } from '../data/services';

export default function Services() {
  return (
    <PageFade className="mx-auto max-w-7xl px-6 pb-32 pt-40 md:px-10">
      <SubtleReveal as="h1" className="text-4xl font-display font-extrabold uppercase tracking-tight text-paper md:text-6xl">
        What We <span className="text-purple">Do</span>
      </SubtleReveal>
      <SubtleReveal as="p" delay={0.08} className="mt-4 max-w-xl text-paper/60">
        Eight ways we help brands go bananas (the good kind).
      </SubtleReveal>

      <div className="mt-16 grid gap-6 md:grid-cols-2">
        {services.map((s, i) => (
          <ServiceCard key={s.number} service={s} index={i} />
        ))}
      </div>

      <div className="mt-16 flex justify-center">
        <CTAButton to="/contact" size="lg">
          Start a Project
        </CTAButton>
      </div>
    </PageFade>
  );
}
