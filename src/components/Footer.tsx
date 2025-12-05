import { MapPin, Phone, Mail, Clock, Instagram, Facebook, Award, Sparkles, Heart } from "lucide-react";
import zentrixiaLogo from "@/assets/zentrixia-logo.png";

export const Footer = () => {
  return (
    <footer className="bg-black-deep border-t border-gold/10 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-gold/5 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-gold/3 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12 stagger-children">
          {/* Sobre */}
          <div className="animate-slide-in-left">
            <img 
              src={zentrixiaLogo} 
              alt="ZENTRIXIA - Elite. Unrivaled. Yours." 
              className="w-64 mb-6 hover:scale-105 transition-transform duration-300"
            />
            <p className="text-muted-foreground mb-4">
              Transformando homens em homens de sucesso desde 2012.
            </p>
            <div className="inline-flex items-center gap-2 bg-gold/20 px-4 py-2 rounded-full border border-gold/30 shimmer glow-pulse">
              <Award className="w-5 h-5 text-gold heartbeat" />
              <span className="text-sm font-semibold text-gold">Eleita Melhor Barbearia 2024</span>
            </div>
          </div>

          {/* Links Rápidos */}
          <div className="animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
            <h4 className="text-xl font-heading mb-4 text-gold flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Links Rápidos
            </h4>
            <ul className="space-y-3">
              <li>
                <a href="#servicos" className="text-muted-foreground hover:text-gold transition-colors underline-animate inline-block">
                  Serviços
                </a>
              </li>
              <li>
                <a href="#depoimentos" className="text-muted-foreground hover:text-gold transition-colors underline-animate inline-block">
                  Depoimentos
                </a>
              </li>
              <li>
                <a 
                  href="/admin/auth" 
                  className="inline-flex items-center gap-2 text-gold hover:text-gold-dark transition-colors font-semibold underline-animate"
                >
                  <Award className="w-4 h-4" />
                  Área Administrativa
                </a>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div className="animate-slide-in-right" style={{ animationDelay: '0.4s' }}>
            <h4 className="text-xl font-heading mb-4 text-gold flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Contato & Localização
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 group">
                <MapPin className="w-5 h-5 text-gold shrink-0 mt-1 group-hover:animate-pulse" />
                <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                  Av. Paulista, 1000 - Bela Vista<br />
                  São Paulo - SP, 01310-100
                </span>
              </li>
              <li className="flex items-center gap-3 group">
                <Phone className="w-5 h-5 text-gold group-hover:animate-pulse" />
                <a href="tel:+5511999999999" className="text-muted-foreground hover:text-gold transition-colors underline-animate">
                  (11) 99999-9999
                </a>
              </li>
              <li className="flex items-center gap-3 group">
                <Mail className="w-5 h-5 text-gold group-hover:animate-pulse" />
                <a href="mailto:contato@barberiapremium.com" className="text-muted-foreground hover:text-gold transition-colors underline-animate">
                  contato@barberiapremium.com
                </a>
              </li>
              <li className="flex items-start gap-3 group">
                <Clock className="w-5 h-5 text-gold shrink-0 mt-1 group-hover:animate-pulse" />
                <div className="text-muted-foreground">
                  <div className="font-semibold text-gold mb-1">Horário de Funcionamento</div>
                  <div className="group-hover:text-foreground transition-colors">Seg - Sex: 9h às 20h</div>
                  <div className="group-hover:text-foreground transition-colors">Sábado: 9h às 18h</div>
                  <div className="group-hover:text-foreground transition-colors">Domingo: Fechado</div>
                </div>
              </li>
            </ul>

            {/* Redes Sociais */}
            <div className="flex gap-4 mt-6">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gradient-gold flex items-center justify-center btn-magnetic glow-pulse"
              >
                <Instagram className="w-5 h-5 text-black-deep" />
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gradient-gold flex items-center justify-center btn-magnetic glow-pulse"
              >
                <Facebook className="w-5 h-5 text-black-deep" />
              </a>
            </div>
          </div>
        </div>

        <div className="section-divider shimmer"></div>

        <div className="text-center text-muted-foreground text-sm animate-slide-in-up">
          <p className="flex items-center justify-center gap-2">
            &copy; {new Date().getFullYear()} Barbearia Premium. Feito com 
            <Heart className="w-4 h-4 text-red-intense heartbeat fill-red-intense" />
            Todos os direitos reservados.
          </p>
        </div>
      </div>

      {/* Top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-1 gradient-flow"></div>
    </footer>
  );
};
