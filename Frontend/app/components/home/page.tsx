import BookingScheduler from "./BookingScheduler";
import CoverageMap from "./CoverageMap";
import HeroSection from "./hero";
import PricingCard from "./PricingCard";
import ProcessSteps from "./ProcessSteps";
import ServicesShowcase from "./ServicesShowcase";
import Testimonials from "./Testimonials";
import WhyChooseUs from "./WhyChooseUs";



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
