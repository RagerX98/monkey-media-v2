import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PeekingMonkey from '../components/PeekingMonkey';

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-ink">
      <PeekingMonkey />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
