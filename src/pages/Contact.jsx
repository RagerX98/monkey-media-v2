import PageFade from '../components/PageFade';
import SubtleReveal from '../components/SubtleReveal';

export default function Contact() {
  return (
    <PageFade className="mx-auto flex max-w-3xl flex-col items-center px-6 pb-32 pt-40 text-center md:px-10">
      <SubtleReveal as="h1" className="text-4xl font-black uppercase tracking-tight text-paper md:text-6xl">
        Say <span className="text-purple">Hey</span>
      </SubtleReveal>
      <SubtleReveal as="p" delay={0.08} className="mt-4 max-w-md text-paper/60">
        No forms, no gatekeeping. Pick whichever's easiest and we'll get back to you fast.
      </SubtleReveal>

      <div className="mt-12 flex w-full flex-col gap-4 sm:flex-row sm:justify-center">
        <a
          href="mailto:hello@monkeymedia.agency"
          className="flex-1 rounded-2xl border border-white/15 px-8 py-6 transition-colors hover:border-purple"
        >
          <span className="block text-xs font-bold uppercase tracking-widest text-purple">
            Email
          </span>
          <span className="mt-2 block font-semibold text-paper">hello@monkeymedia.agency</span>
        </a>
        <a
          href="https://wa.me/918796767274"
          target="_blank"
          rel="noreferrer"
          className="flex-1 rounded-2xl border border-white/15 px-8 py-6 transition-colors hover:border-gold"
        >
          <span className="block text-xs font-bold uppercase tracking-widest text-gold">
            WhatsApp
          </span>
          <span className="mt-2 block font-semibold text-paper">Chat with us</span>
        </a>
      </div>
    </PageFade>
  );
}
