import PageHero from '../components/PageHero';
import SectionHead from '../components/SectionHead';
import Reveal from '../components/Reveal';
import CTAButton from '../components/CTAButton';
import Marquee from '../components/motion/Marquee';
import BigCTA from '../components/BigCTA';

const STEPS = [
  {
    number: '01',
    title: 'Book a free call',
    blurb: 'A real conversation, no pitch deck. Tell us where the brand is and where you want it to go.',
  },
  {
    number: '02',
    title: 'We dig in',
    blurb: 'We look at your channels, audience and numbers, and work out what will actually move them.',
  },
  {
    number: '03',
    title: 'A plan with a price',
    blurb: 'You get a proposal built for your goals: the work, the timeline and exactly what it costs.',
  },
];

const FACTORS = ['Which services', 'How many channels', 'Content volume', 'Ad spend', 'Timeline', 'One-off or ongoing'];

export default function Pricing() {
  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title={"Let's talk\nnumbers."}
        accent={{ numbers: 'text-gold' }}
        intro="Every brand's needs are different, so we don't do cookie-cutter packages. No fluff, no fixed bundles: a real conversation, then a plan priced for what you actually need."
      >
        <CTAButton to="/contact" variant="gold" size="lg">
          Book a discovery call
        </CTAButton>
      </PageHero>

      <section className="bg-paper py-24 text-ink md:py-36">
        <div className="mx-auto max-w-[1600px] px-5 md:px-10">
          <SectionHead tone="light" index="01" label="How it works" title={'Three steps\nto a quote.'} accent={{ quote: 'text-purple' }} />
          <ol className="mt-16 grid gap-6 md:mt-24 lg:grid-cols-3">
            {STEPS.map((s, i) => (
              <Reveal as="li" key={s.number} delay={i * 0.1}>
                <div className="group flex h-full min-h-[320px] flex-col justify-between rounded-[2rem] border-2 border-ink p-8 transition-colors duration-500 hover:bg-ink hover:text-paper md:p-10">
                  <span className="font-display text-7xl font-extrabold leading-none tracking-tight text-purple transition-colors duration-500 group-hover:text-gold md:text-8xl">
                    {s.number}
                  </span>
                  <div>
                    <h3 className="font-display text-3xl font-extrabold uppercase leading-[0.95] tracking-tight">
                      {s.title}
                    </h3>
                    <p className="mt-4 text-base leading-relaxed opacity-70">{s.blurb}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="overflow-hidden bg-ink py-24 md:py-32">
        <div className="mx-auto max-w-[1600px] px-5 md:px-10">
          <SectionHead index="02" label="What shapes a quote" title={'What moves\nthe number.'} accent={{ number: 'text-gold' }} />
        </div>
        <div className="mt-14 flex flex-col gap-4 md:mt-20">
          <Marquee speed={50} copies={3}>
            {FACTORS.map((f) => (
              <span key={f} className="mx-2 shrink-0 rounded-full bg-purple px-7 py-4 font-display text-xl font-extrabold uppercase tracking-tight text-paper md:mx-3 md:px-10 md:py-6 md:text-3xl">
                {f}
              </span>
            ))}
          </Marquee>
          <Marquee speed={50} copies={3} reverse>
            {[...FACTORS].reverse().map((f) => (
              <span key={f} className="mx-2 shrink-0 rounded-full border-2 border-gold px-7 py-4 font-display text-xl font-extrabold uppercase tracking-tight text-gold md:mx-3 md:px-10 md:py-6 md:text-3xl">
                {f}
              </span>
            ))}
          </Marquee>
        </div>
      </section>

      <BigCTA tone="gold" title={'Ready to go\nbananas?'} accent={{ bananas: 'text-purple' }} button="Book a call" />
    </>
  );
}
