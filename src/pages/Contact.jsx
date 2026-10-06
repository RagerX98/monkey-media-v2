import { useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Split from '../components/motion/Split';
import Magnetic from '../components/motion/Magnetic';
import MonkeyFace from '../components/brand/MonkeyFace';
import { CONTACT } from '../data/site';
import { gsap, prefersReducedMotion } from '../lib/gsap';
import { onReady } from '../lib/ready';

function EmailCard() {
  const [copied, setCopied] = useState(false);

  const copy = async (e) => {
    // Copy and still open the mail app; the label just confirms the copy.
    try {
      await navigator.clipboard.writeText(CONTACT.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      /* clipboard blocked: the mailto still opens */
    }
    return e;
  };

  return (
    <a
      href={`mailto:${CONTACT.email}`}
      onClick={copy}
      data-cursor={copied ? 'Copied!' : 'Email'}
      className="group relative flex min-h-[230px] flex-col justify-between overflow-hidden rounded-[2rem] bg-gold p-7 text-ink md:min-h-[300px] md:p-10"
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 translate-y-full bg-purple transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:translate-y-0"
      />
      <span className="relative flex items-center justify-between transition-colors duration-500 group-hover:text-paper">
        <span className="eyebrow">Email</span>
        <span className="eyebrow" aria-live="polite">
          {copied ? 'Copied to clipboard' : 'Tap to write'}
        </span>
      </span>
      <span className="relative font-display text-[clamp(1.15rem,5.6vw,3.4rem)] font-bold leading-tight tracking-tight transition-colors duration-500 group-hover:text-paper">
        hello@
        <wbr />
        monkeymedia.agency
      </span>
    </a>
  );
}

export default function Contact() {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return undefined;
    const q = gsap.utils.selector(el);
    const ctx = gsap.context(() => {});
    gsap.set(q('[data-fade]'), { opacity: 0, y: 30 });
    gsap.set(q('[data-face]'), { scale: 0, rotate: -40 });
    const cancel = onReady(() =>
      ctx.add(() => {
        gsap.to(q('[data-face]'), { scale: 1, rotate: 0, duration: 1.2, ease: 'back.out(1.7)', delay: 0.15 });
        gsap.to(q('[data-fade]'), { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out', stagger: 0.1, delay: 0.45 });
      })
    );
    return () => {
      cancel();
      ctx.revert();
    };
  }, []);

  return (
    <section ref={ref} className="relative overflow-hidden bg-ink pb-28 pt-36 md:pb-40 md:pt-44">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-40 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.3),transparent_65%)]"
      />
      <div className="relative mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="grid items-center gap-10 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <div data-fade className="flex items-center gap-4">
              <span className="h-2 w-2 rounded-full bg-gold" />
              <span className="eyebrow text-paper/60">Contact</span>
            </div>
            <Split
              as="h1"
              trigger="load"
              text={'Say\nhey.'}
              accent={{ hey: 'text-gold' }}
              className="display mt-8 text-[clamp(5rem,30vw,9rem)] font-bold text-paper md:text-[clamp(8rem,15vw,16rem)] md:font-extrabold"
            />
            <p data-fade className="mt-8 max-w-md text-lg leading-relaxed text-paper/65 md:text-xl">
              No forms, no gatekeeping. Pick whichever is easiest and we will get back to you fast.
            </p>
          </div>
          <div data-face className="mx-auto w-[min(70vw,440px)]">
            <Magnetic strength={0.12} className="w-full">
              <MonkeyFace label="The Monkey Media mascot, watching you" />
            </Magnetic>
          </div>
        </div>

        <div className="mt-16 grid gap-5 md:mt-24 lg:grid-cols-[1.5fr_1fr]">
          <div data-fade>
            <EmailCard />
          </div>
          <a
            data-fade
            href={CONTACT.whatsapp}
            target="_blank"
            rel="noreferrer"
            data-cursor="Chat"
            className="group relative flex min-h-[230px] flex-col justify-between overflow-hidden rounded-[2rem] bg-void p-7 text-paper ring-1 ring-white/10 md:min-h-[300px] md:p-10"
          >
            <span
              aria-hidden="true"
              className="absolute inset-0 translate-y-full bg-[#25D366] transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:translate-y-0"
            />
            <span className="relative flex items-center justify-between">
              <span className="eyebrow text-[#25D366] transition-colors duration-500 group-hover:text-ink">WhatsApp</span>
              <span className="eyebrow text-paper/50 transition-colors duration-500 group-hover:text-ink/70">Opens in a new tab</span>
            </span>
            <span className="relative font-display text-[clamp(2rem,9vw,4rem)] font-extrabold uppercase leading-[0.95] tracking-tight transition-colors duration-500 group-hover:text-ink">
              Chat
              <br />
              with us
            </span>
          </a>
        </div>

        <p data-fade className="mt-14 text-center text-paper/55">
          Want to see what we make first?{' '}
          <Link to="/work" className="link-line font-bold text-paper">
            Browse our work
          </Link>
          {' '}or{' '}
          <Link to="/services" className="link-line font-bold text-paper">
            see what we do
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
