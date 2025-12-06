import { Button } from "@/components/ui/button";
import { Clock, AlertTriangle, CheckCircle2, Zap, Timer } from "lucide-react";
import { useEffect, useState } from "react";

interface UrgencySectionProps {
  onBookNowClick: () => void;
}

export const UrgencySection = ({ onBookNowClick }: UrgencySectionProps) => {
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 34, seconds: 15 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          seconds--;
        } else {
          seconds = 59;
          if (minutes > 0) {
            minutes--;
          } else {
            minutes = 59;
            if (hours > 0) {
              hours--;
            }
          }
        }
        
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-24 bg-gradient-to-br from-red-intense/20 via-red-dark/20 to-black-deep relative overflow-hidden particles-bg">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(220,38,38,0.15),transparent)]"></div>
      <div className="absolute top-1/4 left-10 w-64 h-64 bg-red-intense/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-gold/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Urgency Badge */}
          <div className="inline-flex items-center gap-3 bg-red-intense/20 backdrop-blur-md px-6 py-3 rounded-full mb-8 border border-red-intense/30 animate-scale-bounce glow-pulse">
            <AlertTriangle className="w-6 h-6 text-red-intense heartbeat" />
            <span className="text-sm font-semibold uppercase tracking-wider">Atenção: Agenda Lotando Rápido</span>
            <Zap className="w-5 h-5 text-gold animate-pulse" />
          </div>

          {/* Main Headline */}
          <h2 className="text-4xl md:text-6xl font-heading mb-6 animate-blur-in">
            <span className="neon-text">NÃO PERCA SUA VAGA</span>
          </h2>

          <p className="text-xl md:text-2xl text-muted-foreground mb-10 animate-slide-in-up" style={{ animationDelay: '0.3s' }}>
            Homens de sucesso não deixam para depois.
          </p>

          {/* Countdown Timer */}
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-10 stagger-children">
            <div className="card-premium p-6 rounded-xl card-3d border-glow group">
              <Timer className="w-5 h-5 text-gold mx-auto mb-2 opacity-50 group-hover:opacity-100 transition-opacity" />
              <div className="text-4xl md:text-5xl font-price text-gold text-glow-animate">{String(timeLeft.hours).padStart(2, '0')}</div>
              <div className="text-sm text-muted-foreground uppercase mt-2">Horas</div>
            </div>
            <div className="card-premium p-6 rounded-xl card-3d border-glow group">
              <Timer className="w-5 h-5 text-gold mx-auto mb-2 opacity-50 group-hover:opacity-100 transition-opacity" />
              <div className="text-4xl md:text-5xl font-price text-gold text-glow-animate">{String(timeLeft.minutes).padStart(2, '0')}</div>
              <div className="text-sm text-muted-foreground uppercase mt-2">Minutos</div>
            </div>
            <div className="card-premium p-6 rounded-xl card-3d border-glow group">
              <Timer className="w-5 h-5 text-gold mx-auto mb-2 opacity-50 group-hover:opacity-100 transition-opacity" />
              <div className="text-4xl md:text-5xl font-price text-gold heartbeat">{String(timeLeft.seconds).padStart(2, '0')}</div>
              <div className="text-sm text-muted-foreground uppercase mt-2">Segundos</div>
            </div>
          </div>

          {/* Next slot info */}
          <div className="mb-8 animate-slide-in-up" style={{ animationDelay: '0.6s' }}>
            <div className="inline-flex items-center gap-2 text-sm text-muted-foreground mb-4 shimmer px-4 py-2 rounded-full bg-card/30 backdrop-blur-sm">
              <Clock className="w-5 h-5 text-gold" />
              Próxima vaga disponível em: <span className="text-gold font-semibold">{timeLeft.hours}h {timeLeft.minutes}min</span>
            </div>
          </div>

          {/* CTA Button */}
          <div className="animate-scale-bounce flex justify-center w-full px-4" style={{ animationDelay: '0.8s' }}>
            <Button 
              onClick={onBookNowClick}
              size="lg"
              className="btn-hero text-base md:text-xl px-8 md:px-16 py-6 md:py-8 mb-6 btn-magnetic ripple relative overflow-hidden group w-full max-w-xs md:max-w-none md:w-auto"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
              <Zap className="w-5 h-5 md:w-6 md:h-6 mr-2 heartbeat" />
              <span className="text-center">GARANTIR MINHA VAGA AGORA</span>
            </Button>
          </div>

          {/* Confirmation message */}
          <div className="flex items-center justify-center gap-2 text-sm animate-slide-in-up" style={{ animationDelay: '1s' }}>
            <CheckCircle2 className="w-5 h-5 text-green-500 animate-pulse" />
            <span>Confirmação Imediata por WhatsApp</span>
          </div>
        </div>
      </div>

      {/* Bottom gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 gradient-flow"></div>
    </section>
  );
};
