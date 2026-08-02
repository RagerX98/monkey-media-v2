import Hero from '../components/sections/Hero';
import ServicesOverview from '../components/sections/ServicesOverview';
import Clients from '../components/sections/Clients';
import CTABanner from '../components/sections/CTABanner';

export default function Home() {
  return (
    <>
      <Hero />
      <ServicesOverview />
      <Clients />
      <CTABanner />
    </>
  );
}
