import { Award, Zap, Diamond, Smartphone } from "lucide-react";

const features = [
  {
    icon: Award,
    title: "Profissionais Certificados",
    description: "12+ anos de experiência em cortes premium"
  },
  {
    icon: Zap,
    title: "Atendimento VIP Exclusivo",
    description: "Seu conforto e satisfação em primeiro lugar"
  },
  {
    icon: Diamond,
    title: "Produtos Premium Importados",
    description: "As melhores marcas do mercado internacional"
  },
  {
    icon: Smartphone,
    title: "Agendamento Online 24/7",
    description: "Reserve seu horário quando quiser, de onde estiver"
  }
];

export const WhyChooseUs = () => {
  return (
    <section className="py-24 bg-gradient-dark particles-bg relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold/3 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 animate-blur-in">
          <h2 className="text-4xl md:text-6xl font-heading mb-4">
            POR QUE NOS <span className="text-gradient-gold text-glow-animate">ESCOLHER?</span>
          </h2>
          <div className="section-divider w-32 mx-auto shimmer"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 stagger-children">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="card-premium p-8 rounded-xl text-center card-3d border-glow group"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-gold rounded-full mb-6 glow-pulse group-hover:animate-rotate-pulse transition-all duration-300">
                <feature.icon className="w-10 h-10 text-black-deep" />
              </div>
              <h3 className="text-xl font-heading mb-3 text-gold underline-animate">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
