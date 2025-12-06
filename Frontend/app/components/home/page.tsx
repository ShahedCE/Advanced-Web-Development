import BookingScheduler from '@/components/booking-scheduler/booking-scheduler';
import CoverageMap from '@/components/coverage-map/coverage-map';
import HeroSection from '@/components/hero-section/hero-section';
import PricingCard from '@/components/pricing-card/pricing-card';       
import ProcessSteps from '@/components/process-steps/process-steps';
import ServicesShowcase from '@/components/services-showcase/services-showcase';
import Testimonials from '@/components/testimonials/testimonials';
import WhyChooseUs from '@/components/why-choose-us/why-choose-us';


export default function Home() {
  return (
    <>
      <HeroSection />
      <ServicesShowcase />
      <ProcessSteps />
      <WhyChooseUs />
      <PricingCard />
      <Testimonials />
      <CoverageMap />
      <BookingScheduler />
    </>
  );
}
