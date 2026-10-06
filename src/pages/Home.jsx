import Hero from '../components/home/Hero';
import Manifesto from '../components/home/Manifesto';
import Ribbons from '../components/home/Ribbons';
import ServicesList from '../components/home/ServicesList';
import WorkRail from '../components/home/WorkRail';
import ClientsWall from '../components/home/ClientsWall';
import Process from '../components/home/Process';
import BigCTA from '../components/BigCTA';

export default function Home() {
  return (
    <>
      <Hero />
      <Manifesto />
      <Ribbons />
      <ServicesList />
      <WorkRail />
      <ClientsWall />
      <Process />
      <BigCTA />
    </>
  );
}
