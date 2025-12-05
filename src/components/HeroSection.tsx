import { Button } from "@/components/ui/button";
import { Star, Calendar, User, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-barber.jpg";

interface HeroSectionProps {
  onBookNowClick: () => void;
}

export const HeroSection = ({ onBookNowClick }: HeroSectionProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden particles-bg">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-hero"></div>
        {/* Animated Overlay Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,hsl(var(--black-deep)/0.8)_100%)]"></div>
      </div>

      {/* Floating Decorative Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-gold/5 blur-3xl animate-float"></div>
      <div className="absolute bottom-40 right-10 w-48 h-48 rounded-full bg-red-intense/5 blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/3 right-1/4 w-24 h-24 rounded-full bg-gold/10 blur-2xl animate-float" style={{ animationDelay: '4s' }}></div>

      {/* Top Navigation */}
      <div className="absolute top-0 right-0 z-20 p-6">
        <Link to="/auth">
          <Button 
            variant="outline" 
            className="border-gold/30 hover:border-gold hover:bg-gold/10 backdrop-blur-md btn-magnetic ripple"
          >
            <User className="w-4 h-4 mr-2" />
            Área do Profissional
          </Button>
        </Link>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-card/50 backdrop-blur-md px-6 py-3 rounded-full mb-8 border border-gold/20 animate-slide-in-up shimmer glow-pulse">
          <Star className="w-5 h-5 text-gold fill-gold heartbeat" />
          <span className="text-sm font-semibold">500+ Clientes Satisfeitos</span>
          <Sparkles className="w-4 h-4 text-gold animate-pulse" />
        </div>

        {/* Main Headline */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading mb-6 leading-tight animate-blur-in">
          <span className="inline-block animate-slide-in-left" style={{ animationDelay: '0.2s' }}>TRANSFORME SEU VISUAL.</span>
          <br />
          <span className="text-gradient-gold neon-text inline-block animate-slide-in-right" style={{ animationDelay: '0.4s' }}>ELEVE SUA CONFIANÇA.</span>
        </h1>

        {/* Subheadline */}
        <p className="text-xl md:text-2xl mb-10 text-muted-foreground max-w-3xl mx-auto animate-slide-in-up" style={{ animationDelay: '0.6s' }}>
          A barbearia que homens de sucesso escolhem
        </p>

        {/* CTA Button */}
        <div className="animate-scale-bounce" style={{ animationDelay: '0.8s' }}>
          <Button 
            onClick={onBookNowClick}
            size="lg"
            className="btn-hero pulse-gold text-lg px-12 py-7 mb-6 btn-magnetic ripple relative overflow-hidden group"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
            <Calendar className="w-6 h-6 mr-3 animate-rotate-pulse" />
            AGENDAR AGORA - VAGAS LIMITADAS
          </Button>
        </div>

        {/* Availability Counter */}
        <div className="inline-flex items-center gap-3 bg-red-intense/20 backdrop-blur-md px-6 py-3 rounded-lg border border-red-intense/30 animate-slide-in-up border-glow" style={{ animationDelay: '1s' }}>
          <div className="w-3 h-3 bg-red-intense rounded-full animate-pulse shadow-[0_0_10px_hsl(var(--red-intense))]"></div>
          <span className="text-sm font-semibold">Apenas 3 vagas disponíveis hoje</span>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gold rounded-full flex items-start justify-center p-2 glow-pulse">
          <div className="w-1.5 h-3 bg-gold rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Bottom Gradient Line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 gradient-flow"></div>
    </section>
  );
};
