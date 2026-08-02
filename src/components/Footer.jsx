import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import logoFull from '../assets/logo-full.png';

const SERVICE_LINKS = [
  'Social Media Management',
  'Influencer Marketing',
  'Branding',
  'Content Creation',
  'Performance Marketing',
  'Website Design',
];

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="relative overflow-hidden border-t border-white/10 bg-ink pt-20"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="grid gap-12 pb-16 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <img src={logoFull} alt="Monkey Media" className="w-56" />
            <p className="mt-6 max-w-xs text-sm text-paper/60">
              A next level creative agency for brands that refuse to sit still. Built with pure
              monkey energy.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-gold">
              Services
            </h4>
            <ul className="space-y-2 text-sm text-paper/70">
              {SERVICE_LINKS.map((s) => (
                <li key={s}>
                  <Link to="/services" className="transition-colors hover:text-paper">
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-gold">
              Agency
            </h4>
            <ul className="space-y-2 text-sm text-paper/70">
              <li>
                <Link to="/" className="transition-colors hover:text-paper">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/portfolio" className="transition-colors hover:text-paper">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="transition-colors hover:text-paper">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/contact" className="transition-colors hover:text-paper">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-gold">
              Get In Touch
            </h4>
            <ul className="space-y-2 text-sm text-paper/70">
              <li>
                <a
                  href="mailto:hello@monkeymedia.agency"
                  className="transition-colors hover:text-paper"
                >
                  hello@monkeymedia.agency
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/918796767274"
                  target="_blank"
                  rel="noreferrer"
                  className="transition-colors hover:text-paper"
                >
                  WhatsApp Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 py-6 text-xs text-paper/40 md:flex-row">
          <p>&copy; {new Date().getFullYear()} Monkey Media. All rights reserved.</p>
          <p>Fun, funky, active like a monkey.</p>
        </div>
      </div>
    </motion.footer>
  );
}
