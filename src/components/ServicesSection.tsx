import { Button } from "@/components/ui/button";
import { Scissors, Award, Users, Sparkles, Palette, CircleDot, ArrowRight } from "lucide-react";

interface ServicesSectionProps {
  onServiceSelect: (service: string, price: number) => void;
}

const services = [
  {
    icon: Award,
    name: "Corte Executivo Premium",
    description: "O corte que executivos e empresários escolhem. Consultoria de estilo incluída.",
    price: 80,
    duration: "45min",
    gradient: "from-gold/20 to-gold-dark/20"
  },
  {
    icon: Scissors,
    name: "Corte + Barba Modelada",
    description: "Transformação completa. Saia com visual de CEO.",
    price: 120,
    duration: "60min",
    gradient: "from-red-intense/20 to-red-dark/20"
  },
  {
    icon: Users,
    name: "Pacote Noivo/Eventos",
    description: "Para o dia mais importante. Tratamento VIP total.",
    price: 200,
    duration: "90min",
    gradient: "from-gold/20 to-primary/20"
  },
  {
    icon: CircleDot,
    name: "Degradê Profissional",
    description: "Precisão milimétrica. O degradê que virou tendência.",
    price: 70,
    duration: "40min",
    gradient: "from-gold-dark/20 to-gold/20"
  },
  {
    icon: Sparkles,
    name: "Tratamento Capilar Premium",
    description: "Produtos importados. Cabelo renovado e saudável.",
    price: 150,
    duration: "50min",
    gradient: "from-primary/20 to-gold/20"
  },
  {
    icon: Palette,
    name: "Pigmentação de Barba",
    description: "Barba sempre perfeita. Resultado por semanas.",
    price: 100,
    duration: "45min",
    gradient: "from-red-intense/20 to-gold/20"
  }
];

export const ServicesSection = ({ onServiceSelect }: ServicesSectionProps) => {
  return (
    <section id="servicos" className="py-24 bg-background particles-bg relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-1/4 left-0 w-72 h-72 bg-gold/5 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-red-intense/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 animate-blur-in">
          <h2 className="text-4xl md:text-6xl font-heading mb-4">
            SERVIÇOS <span className="text-gradient-gold text-glow-animate">PREMIUM</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Escolha o serviço perfeito para elevar seu visual
          </p>
          <div className="section-divider w-32 mx-auto shimmer"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-children">
          {services.map((service, index) => (
            <div 
              key={index}
              className={`card-premium p-8 rounded-xl bg-gradient-to-br ${service.gradient} border border-gold/10 card-3d border-glow group relative overflow-hidden`}
            >
              {/* Shimmer overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              
              <div className="flex items-start justify-between mb-6 relative z-10">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-gold rounded-lg shadow-gold group-hover:glow-pulse transition-all duration-300 group-hover:animate-rotate-pulse">
                  <service.icon className="w-8 h-8 text-black-deep" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-price text-gold text-glow-animate">R${service.price}</div>
                  <div className="text-sm text-muted-foreground">{service.duration}</div>
                </div>
              </div>

              <h3 className="text-2xl font-heading mb-3 relative z-10 underline-animate inline-block">{service.name}</h3>
              <p className="text-muted-foreground mb-6 relative z-10">{service.description}</p>

              <Button 
                onClick={() => onServiceSelect(service.name, service.price)}
                className="w-full btn-gold btn-magnetic ripple group/btn relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Agendar Este Serviço
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </span>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
