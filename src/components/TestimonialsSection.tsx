import { Star, Quote, BadgeCheck } from "lucide-react";
import testimonialRicardo from "@/assets/testimonial-ricardo.jpg";
import testimonialJoao from "@/assets/testimonial-joao.jpg";
import testimonialCarlos from "@/assets/testimonial-carlos.jpg";
import testimonialFernando from "@/assets/testimonial-fernando.jpg";
import testimonialMarcos from "@/assets/testimonial-marcos.jpg";
import testimonialPaulo from "@/assets/testimonial-paulo.jpg";

const testimonials = [
  {
    name: "Ricardo Silva",
    role: "Empresário",
    text: "Melhor investimento que faço todo mês. Atendimento impecável e resultado profissional sempre!",
    rating: 5,
    image: testimonialRicardo
  },
  {
    name: "João Pedro",
    role: "CEO",
    text: "Meu visual mudou completamente. Aumentou até minha confiança em reuniões importantes!",
    rating: 5,
    image: testimonialJoao
  },
  {
    name: "Carlos Eduardo",
    role: "Advogado",
    text: "Profissionais de verdade. A atenção aos detalhes faz toda diferença. Nunca mais troco de barbearia.",
    rating: 5,
    image: testimonialCarlos
  },
  {
    name: "Fernando Alves",
    role: "Executivo",
    text: "Ambiente premium, atendimento VIP. Realmente se sentem os anos de experiência da equipe.",
    rating: 5,
    image: testimonialFernando
  },
  {
    name: "Marcos Antônio",
    role: "Empreendedor",
    text: "A consultoria de estilo incluída é um diferencial. Sempre saio com um visual impecável!",
    rating: 5,
    image: testimonialMarcos
  },
  {
    name: "Paulo Roberto",
    role: "Diretor Comercial",
    text: "Agendamento online facilita muito. E o resultado sempre supera as expectativas!",
    rating: 5,
    image: testimonialPaulo
  }
];

export const TestimonialsSection = () => {
  return (
    <section className="py-24 bg-gradient-dark particles-bg relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-1/4 w-64 h-64 bg-gold/5 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-gold/3 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 animate-blur-in">
          <h2 className="text-4xl md:text-6xl font-heading mb-4">
            O QUE NOSSOS <span className="text-gradient-gold text-glow-animate">CLIENTES VIP</span> DIZEM
          </h2>
          <div className="section-divider w-32 mx-auto shimmer"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-children">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="card-premium p-8 rounded-xl relative overflow-hidden card-3d border-glow group"
            >
              {/* Animated Quote Background */}
              <Quote className="absolute top-4 right-4 w-16 h-16 text-gold/10 group-hover:text-gold/20 transition-colors duration-500 group-hover:animate-rotate-pulse" />
              
              {/* Shimmer effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              
              {/* Stars with animation */}
              <div className="flex gap-1 mb-4 relative z-10">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star 
                    key={i} 
                    className="w-5 h-5 text-gold fill-gold" 
                    style={{ 
                      animation: 'heartbeat 1.5s ease-in-out infinite',
                      animationDelay: `${i * 0.1}s`
                    }}
                  />
                ))}
              </div>

              <p className="text-lg mb-6 relative z-10 italic">"{testimonial.text}"</p>

              <div className="flex items-center gap-4 relative z-10">
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-gold/50 glow-pulse">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="font-semibold flex items-center gap-2">
                    {testimonial.name}
                    <BadgeCheck className="w-4 h-4 text-gold" />
                  </div>
                  <div className="text-sm text-gold">{testimonial.role}</div>
                </div>
                <div className="ml-auto">
                  <div className="px-3 py-1 bg-gold/20 rounded-full text-xs font-semibold text-gold border border-gold/30 shimmer">
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
