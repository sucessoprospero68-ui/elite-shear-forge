import { useState } from "react";
import { HeroSection } from "@/components/HeroSection";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { ServicesSection } from "@/components/ServicesSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { UrgencySection } from "@/components/UrgencySection";
import { BookingModal } from "@/components/BookingModal";
import { Footer } from "@/components/Footer";

const Index = () => {
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string | undefined>();
  const [selectedPrice, setSelectedPrice] = useState<number | undefined>();

  const handleServiceSelect = (service: string, price: number) => {
    setSelectedService(service);
    setSelectedPrice(price);
    setBookingModalOpen(true);
  };

  const handleBookNowClick = () => {
    setSelectedService(undefined);
    setSelectedPrice(undefined);
    setBookingModalOpen(true);
  };

  return (
    <div className="min-h-screen">
      <HeroSection onBookNowClick={handleBookNowClick} />
      <WhyChooseUs />
      <ServicesSection onServiceSelect={handleServiceSelect} />
      <TestimonialsSection />
      <UrgencySection onBookNowClick={handleBookNowClick} />
      <Footer />
      
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        selectedService={selectedService}
        selectedPrice={selectedPrice}
      />
    </div>
  );
};

export default Index;
