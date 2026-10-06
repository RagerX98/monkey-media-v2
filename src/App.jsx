import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './layouts/Layout';
import Home from './pages/Home';

const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const Work = lazy(() => import('./pages/Work'));
const Pricing = lazy(() => import('./pages/Pricing'));
const Contact = lazy(() => import('./pages/Contact'));

// Scroll position on route change is handled by PageTransition (under the
// curtain for clicked links, immediately for back/forward).
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<Suspense fallback={null}><About /></Suspense>} />
          <Route path="services" element={<Suspense fallback={null}><Services /></Suspense>} />
          <Route path="work" element={<Suspense fallback={null}><Work /></Suspense>} />
          {/* The old Portfolio page now lives at the bottom of Our Work. */}
          <Route path="portfolio" element={<Navigate to="/work" replace />} />
          <Route path="pricing" element={<Suspense fallback={null}><Pricing /></Suspense>} />
          <Route path="contact" element={<Suspense fallback={null}><Contact /></Suspense>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
