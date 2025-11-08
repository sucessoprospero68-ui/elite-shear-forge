import { Button } from "@/components/ui/button";
import { Star, Calendar, User } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-barber.jpg";

interface HeroSectionProps {
  onBookNowClick: () => void;
}

export const HeroSection = ({ onBookNowClick }: HeroSectionProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-hero"></div>
      </div>

      {/* Top Navigation */}
      <div className="absolute top-0 right-0 z-20 p-6">
        <Link to="/auth">
          <Button 
            variant="outline" 
            className="border-gold/30 hover:border-gold hover:bg-gold/10 backdrop-blur-md"
          >
            <User className="w-4 h-4 mr-2" />
            Área do Profissional
          </Button>
        </Link>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 text-center animate-fade-in-up">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-card/50 backdrop-blur-md px-6 py-3 rounded-full mb-8 border border-gold/20">
          <Star className="w-5 h-5 text-gold fill-gold" />
          <span className="text-sm font-semibold">500+ Clientes Satisfeitos</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading mb-6 leading-tight">
          TRANSFORME SEU VISUAL.
          <br />
          <span className="text-gradient-gold gold-glow">ELEVE SUA CONFIANÇA.</span>
        </h1>

        {/* Subheadline */}
        <p className="text-xl md:text-2xl mb-10 text-muted-foreground max-w-3xl mx-auto">
          A barbearia que homens de sucesso escolhem
        </p>

        {/* CTA Button */}
        <Button 
          onClick={onBookNowClick}
          size="lg"
          className="btn-hero pulse-gold text-lg px-12 py-7 mb-6"
        >
          <Calendar className="w-6 h-6 mr-3" />
          AGENDAR AGORA - VAGAS LIMITADAS
        </Button>

        {/* Availability Counter */}
        <div className="inline-flex items-center gap-3 bg-red-intense/20 backdrop-blur-md px-6 py-3 rounded-lg border border-red-intense/30">
          <div className="w-3 h-3 bg-red-intense rounded-full animate-pulse"></div>
          <span className="text-sm font-semibold">Apenas 3 vagas disponíveis hoje</span>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gold rounded-full flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-gold rounded-full"></div>
        </div>
      </div>
    </section>
  );
};
