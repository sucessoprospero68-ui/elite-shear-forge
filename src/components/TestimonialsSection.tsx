import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Ricardo Silva",
    role: "Empresário",
    text: "Melhor investimento que faço todo mês. Atendimento impecável e resultado profissional sempre!",
    rating: 5
  },
  {
    name: "João Pedro",
    role: "CEO",
    text: "Meu visual mudou completamente. Aumentou até minha confiança em reuniões importantes!",
    rating: 5
  },
  {
    name: "Carlos Eduardo",
    role: "Advogado",
    text: "Profissionais de verdade. A atenção aos detalhes faz toda diferença. Nunca mais troco de barbearia.",
    rating: 5
  },
  {
    name: "Fernando Alves",
    role: "Executivo",
    text: "Ambiente premium, atendimento VIP. Realmente se sentem os anos de experiência da equipe.",
    rating: 5
  },
  {
    name: "Marcos Antônio",
    role: "Empreendedor",
    text: "A consultoria de estilo incluída é um diferencial. Sempre saio com um visual impecável!",
    rating: 5
  },
  {
    name: "Paulo Roberto",
    role: "Diretor Comercial",
    text: "Agendamento online facilita muito. E o resultado sempre supera as expectativas!",
    rating: 5
  }
];

export const TestimonialsSection = () => {
  return (
    <section className="py-24 bg-gradient-dark">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-heading mb-4">
            O QUE NOSSOS <span className="text-gradient-gold">CLIENTES VIP</span> DIZEM
          </h2>
          <div className="section-divider w-32 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="card-premium p-8 rounded-xl relative overflow-hidden"
            >
              <Quote className="absolute top-4 right-4 w-16 h-16 text-gold/10" />
              
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-gold fill-gold" />
                ))}
              </div>

              <p className="text-lg mb-6 relative z-10">"{testimonial.text}"</p>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-gold flex items-center justify-center text-black-deep font-heading text-xl">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-gold">{testimonial.role}</div>
                </div>
                <div className="ml-auto">
                  <div className="px-3 py-1 bg-gold/20 rounded-full text-xs font-semibold text-gold border border-gold/30">
                    Cliente VIP
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
