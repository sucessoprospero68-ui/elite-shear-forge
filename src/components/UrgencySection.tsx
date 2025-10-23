import { Button } from "@/components/ui/button";
import { Clock, AlertTriangle, CheckCircle2 } from "lucide-react";
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
    <section className="py-24 bg-gradient-to-br from-red-intense/20 via-red-dark/20 to-black-deep relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(220,38,38,0.1),transparent)]"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-3 bg-red-intense/20 backdrop-blur-md px-6 py-3 rounded-full mb-8 border border-red-intense/30">
            <AlertTriangle className="w-6 h-6 text-red-intense animate-pulse" />
            <span className="text-sm font-semibold uppercase tracking-wider">Atenção: Agenda Lotando Rápido</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-heading mb-6">
            NÃO PERCA SUA VAGA
          </h2>

          <p className="text-xl md:text-2xl text-muted-foreground mb-10">
            Homens de sucesso não deixam para depois.
          </p>

          {/* Countdown Timer */}
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-10">
            <div className="card-premium p-6 rounded-xl">
              <div className="text-4xl font-price text-gold mb-2">{String(timeLeft.hours).padStart(2, '0')}</div>
              <div className="text-sm text-muted-foreground uppercase">Horas</div>
            </div>
            <div className="card-premium p-6 rounded-xl">
              <div className="text-4xl font-price text-gold mb-2">{String(timeLeft.minutes).padStart(2, '0')}</div>
              <div className="text-sm text-muted-foreground uppercase">Minutos</div>
            </div>
            <div className="card-premium p-6 rounded-xl">
              <div className="text-4xl font-price text-gold mb-2 animate-pulse">{String(timeLeft.seconds).padStart(2, '0')}</div>
              <div className="text-sm text-muted-foreground uppercase">Segundos</div>
            </div>
          </div>

          <div className="mb-8">
            <div className="inline-flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Clock className="w-5 h-5" />
              Próxima vaga disponível em: {timeLeft.hours}h {timeLeft.minutes}min
            </div>
          </div>

          <Button 
            onClick={onBookNowClick}
            size="lg"
            className="btn-hero text-xl px-16 py-8 mb-6 animate-pulse"
          >
            GARANTIR MINHA VAGA AGORA
          </Button>

          <div className="flex items-center justify-center gap-2 text-sm">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <span>Confirmação Imediata por WhatsApp</span>
          </div>
        </div>
      </div>
    </section>
  );
};
