import PageFade from '../components/PageFade';
import SubtleReveal from '../components/SubtleReveal';
import Reveal from '../components/Reveal';
import MonkeyMascot from '../components/MonkeyMascot';
import AmbientSmoke from '../components/AmbientSmoke';
import { team } from '../data/team';

const STATS = [
  { value: '6+', label: 'Years in the Jungle' },
  { value: '150+', label: 'Brands Launched' },
  { value: '40+', label: 'Team Monkeys' },
  { value: '12', label: 'Countries Reached' },
];

const VALUES = [
  {
    number: '01',
    title: 'Client First, Always',
    blurb: 'Your goals drive the strategy. We measure ourselves by your growth, not our portfolio.',
  },
  {
    number: '02',
    title: 'No-BS Creativity',
    blurb: "Bold ideas, zero fluff. If it doesn't move the needle, it doesn't make the deck.",
  },
  {
    number: '03',
    title: 'Speed Over Perfection',
    blurb: 'We ship, learn, and iterate in public instead of polishing in private for months.',
  },
  {
    number: '04',
    title: 'Data-Backed Chaos',
    blurb: "The wild ideas are backed by real numbers. Fun and rigor aren't mutually exclusive.",
  },
];

export default function About() {
  return (
    <>
      <AmbientSmoke />
      <PageFade className="relative z-10 mx-auto max-w-7xl px-6 pb-32 pt-40 md:px-10">
        <div className="max-w-2xl">
          <SubtleReveal as="span" className="text-xs font-bold uppercase tracking-widest text-purple">
            Who We Are
          </SubtleReveal>
          <SubtleReveal
            as="h1"
            delay={0.06}
            className="mt-4 text-4xl font-black uppercase tracking-tight text-paper md:text-6xl"
          >
            The monkeys behind the <span className="text-gold">madness.</span>
          </SubtleReveal>
          <SubtleReveal as="p" delay={0.12} className="mt-4 max-w-lg text-paper/60">
            Founded by people tired of agencies that talk big and ship slow, Monkey Media exists
            to make brands louder, faster, and a little more unhinged. In a good way.
          </SubtleReveal>
        </div>

        <div className="mt-20 grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <Reveal>
            <span className="text-xs font-bold uppercase tracking-widest text-purple">
              Our Story
            </span>
            <p className="mt-4 text-lg leading-relaxed text-paper/70">
              We started in a one-room office with a laptop, a caffeine problem, and a hunch
              that most agencies were boring on purpose. A few years and a few hundred
              campaigns later, that hunch turned into a team that builds brands the internet
              actually stops for.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-paper/70">
              We're strategists, creators, and certified bananas-for-brands people who believe
              good marketing shouldn't feel like homework, for us or for you.
            </p>
          </Reveal>

          <Reveal delay={0.1} className="grid grid-cols-2 gap-4">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/10 bg-void p-6 transition-colors hover:border-gold"
              >
                <span className="block text-3xl font-black text-gold md:text-4xl">
                  {stat.value}
                </span>
                <span className="mt-2 block text-sm text-paper/60">{stat.label}</span>
              </div>
            ))}
          </Reveal>
        </div>

        <div className="mt-28">
          <Reveal className="max-w-xl">
            <span className="text-xs font-bold uppercase tracking-widest text-purple">
              What We Stand For
            </span>
            <h2 className="mt-4 text-3xl font-black uppercase tracking-tight text-paper md:text-5xl">
              Our <span className="text-gold">values.</span>
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {VALUES.map((value, i) => (
              <Reveal key={value.number} delay={i * 0.08}>
                <div className="h-full rounded-2xl border border-white/10 bg-void p-8 transition-colors hover:border-purple">
                  <span className="text-sm font-bold text-purple">{value.number}</span>
                  <h3 className="mt-2 text-2xl font-black uppercase text-paper">{value.title}</h3>
                  <p className="mt-3 text-paper/60">{value.blurb}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="mt-28">
          <Reveal className="max-w-xl">
            <span className="text-xs font-bold uppercase tracking-widest text-purple">
              Meet the Troop
            </span>
            <h2 className="mt-4 text-3xl font-black uppercase tracking-tight text-paper md:text-5xl">
              The <span className="text-gold">team.</span>
            </h2>
          </Reveal>

          <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member, i) => (
              <Reveal key={member.name} delay={i * 0.08} y={30}>
                <div className="group flex flex-col items-center rounded-2xl border border-white/10 bg-void px-6 py-10 text-center transition-colors hover:border-gold">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full border border-purple/40 bg-purple/10 text-xl font-black text-purple transition-colors group-hover:border-gold group-hover:bg-gold/10 group-hover:text-gold">
                    {member.initials}
                  </div>
                  <h3 className="mt-5 text-base font-black uppercase text-paper">{member.name}</h3>
                  <span className="mt-1 text-xs font-bold uppercase tracking-widest text-paper/50">
                    {member.role}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal className="mt-28 flex flex-col items-center gap-4 text-center" delay={0.1}>
          <MonkeyMascot size={90} />
          <p className="mt-2 max-w-md text-paper/50">
            Think we'd get along? We're always up for meeting brands that want to do things
            differently.
          </p>
        </Reveal>
      </PageFade>
    </>
  );
}
