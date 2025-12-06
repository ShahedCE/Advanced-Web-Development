import HeroSection from './components/home/hero';
import ServicesShowcase from './components/home/ServicesShowcase';
import WhyChooseUs from './components/home/WhyChooseUs';

export default function Home() {
  return (
    <>
      <HeroSection />
      <WhyChooseUs />
      <ServicesShowcase />
    </>
  );
}
