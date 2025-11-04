import { MapPin, Phone, Mail, Clock, Instagram, Facebook, Award } from "lucide-react";
import zentrixLogo from "@/assets/zentrix-logo.png";

export const Footer = () => {
  return (
    <footer className="bg-black-deep border-t border-gold/10">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Sobre */}
          <div>
            <img 
              src={zentrixLogo} 
              alt="ZENTRIX - Elite. Unriavled. Yours." 
              className="w-64 mb-6"
            />
            <p className="text-muted-foreground mb-4">
              Transformando homens em homens de sucesso desde 2012.
            </p>
            <div className="inline-flex items-center gap-2 bg-gold/20 px-4 py-2 rounded-full border border-gold/30">
              <Award className="w-5 h-5 text-gold" />
              <span className="text-sm font-semibold text-gold">Eleita Melhor Barbearia 2024</span>
            </div>
          </div>

          {/* Links Rápidos */}
          <div>
            <h4 className="text-xl font-heading mb-4 text-gold">Links Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <a href="#servicos" className="text-muted-foreground hover:text-gold transition-colors">
                  Serviços
                </a>
              </li>
              <li>
                <a href="#depoimentos" className="text-muted-foreground hover:text-gold transition-colors">
                  Depoimentos
                </a>
              </li>
              <li>
                <a 
                  href="/admin/auth" 
                  className="inline-flex items-center gap-2 text-gold hover:text-gold-dark transition-colors font-semibold"
                >
                  <Award className="w-4 h-4" />
                  Área Administrativa
                </a>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h4 className="text-xl font-heading mb-4 text-gold">Contato & Localização</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gold shrink-0 mt-1" />
                <span className="text-muted-foreground">
                  Av. Paulista, 1000 - Bela Vista<br />
                  São Paulo - SP, 01310-100
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gold" />
                <a href="tel:+5511999999999" className="text-muted-foreground hover:text-gold transition-colors">
                  (11) 99999-9999
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gold" />
                <a href="mailto:contato@barberiapremium.com" className="text-muted-foreground hover:text-gold transition-colors">
                  contato@barberiapremium.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-gold shrink-0 mt-1" />
                <div className="text-muted-foreground">
                  <div className="font-semibold text-gold mb-1">Horário de Funcionamento</div>
                  <div>Seg - Sex: 9h às 20h</div>
                  <div>Sábado: 9h às 18h</div>
                  <div>Domingo: Fechado</div>
                </div>
              </li>
            </ul>

            {/* Redes Sociais */}
            <div className="flex gap-4 mt-6">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gradient-gold flex items-center justify-center hover:shadow-gold-glow transition-all hover-scale"
              >
                <Instagram className="w-5 h-5 text-black-deep" />
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gradient-gold flex items-center justify-center hover:shadow-gold-glow transition-all hover-scale"
              >
                <Facebook className="w-5 h-5 text-black-deep" />
              </a>
            </div>
          </div>
        </div>

        <div className="section-divider"></div>

        <div className="text-center text-muted-foreground text-sm">
          <p>&copy; {new Date().getFullYear()} Barbearia Premium. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};
