import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Cursor from '../components/Cursor';
import Preloader from '../components/Preloader';
import PageTransition from '../components/PageTransition';
import PeekingMonkey from '../components/PeekingMonkey';
import { startSmoothScroll } from '../lib/smooth';
import { onReady } from '../lib/ready';

// Fetch every lazy page once the first one is on screen, so a route change
// never lifts the transition curtain onto an empty Suspense fallback.
const prefetchPages = () => {
  import('../pages/Services');
  import('../pages/Work');
  import('../pages/About');
  import('../pages/Pricing');
  import('../pages/Contact');
};

export default function Layout() {
  useEffect(() => {
    startSmoothScroll();
    return onReady(() => {
      const idle = window.requestIdleCallback ?? ((cb) => setTimeout(cb, 1200));
      idle(prefetchPages);
    });
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col bg-ink">
      <Preloader />
      <PageTransition />
      <Cursor />
      <PeekingMonkey />
      <Navbar />
      <main className="relative flex-1">
        <Outlet />
      </main>
      <Footer />
      <div className="grain hidden md:block" aria-hidden="true" />
    </div>
  );
}
