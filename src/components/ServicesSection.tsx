import { Button } from "@/components/ui/button";
import { Scissors, Award, Users, Sparkles, Palette, CircleDot } from "lucide-react";

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
    <section id="servicos" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-heading mb-4">
            SERVIÇOS <span className="text-gradient-gold">PREMIUM</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Escolha o serviço perfeito para elevar seu visual
          </p>
          <div className="section-divider w-32 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={index}
              className={`card-premium p-8 rounded-xl bg-gradient-to-br ${service.gradient} border border-gold/10`}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-gold rounded-lg shadow-gold">
                  <service.icon className="w-8 h-8 text-black-deep" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-price text-gold">R${service.price}</div>
                  <div className="text-sm text-muted-foreground">{service.duration}</div>
                </div>
              </div>

              <h3 className="text-2xl font-heading mb-3">{service.name}</h3>
              <p className="text-muted-foreground mb-6">{service.description}</p>

              <Button 
                onClick={() => onServiceSelect(service.name, service.price)}
                className="w-full btn-gold"
              >
                Agendar Este Serviço
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
