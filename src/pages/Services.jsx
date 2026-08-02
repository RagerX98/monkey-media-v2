import PageFade from '../components/PageFade';
import SubtleReveal from '../components/SubtleReveal';
import { services } from '../data/services';

export default function Services() {
  return (
    <PageFade className="mx-auto max-w-7xl px-6 pb-32 pt-40 md:px-10">
      <SubtleReveal as="h1" className="text-4xl font-black uppercase tracking-tight text-paper md:text-6xl">
        What We <span className="text-purple">Do</span>
      </SubtleReveal>
      <SubtleReveal as="p" delay={0.08} className="mt-4 max-w-xl text-paper/60">
        Eight ways we help brands go bananas (the good kind).
      </SubtleReveal>

      <div className="mt-16 grid gap-6 md:grid-cols-2">
        {services.map((s) => (
          <div
            key={s.number}
            className="rounded-2xl border border-white/10 p-8 transition-colors hover:border-gold"
          >
            <span className="text-sm font-bold text-purple">{s.number}</span>
            <h2 className="mt-2 text-2xl font-black uppercase text-paper">{s.title}</h2>
            <p className="mt-3 text-paper/60">{s.blurb}</p>
          </div>
        ))}
      </div>
    </PageFade>
  );
}
