import { useState } from "react";
import { Link } from "react-router-dom";
import { HeroSection } from "@/components/HeroSection";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { ServicesSection } from "@/components/ServicesSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { UrgencySection } from "@/components/UrgencySection";
import { BookingModal } from "@/components/BookingModal";
import { Footer } from "@/components/Footer";
import { Rocket } from "lucide-react";

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
      {/* Banner para página de vendas */}
      <Link 
        to="/vendas" 
        className="block bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-3 px-4 text-center hover:opacity-90 transition-opacity"
      >
        <div className="flex items-center justify-center gap-2 text-sm md:text-base font-medium">
          <Rocket className="h-4 w-4 animate-pulse" />
          <span>🔥 Quer ter esse sistema na sua barbearia? Clique aqui e teste grátis por 7 dias!</span>
          <Rocket className="h-4 w-4 animate-pulse" />
        </div>
      </Link>
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
