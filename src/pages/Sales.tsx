import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Clock, Users, Calendar, MessageSquare, Shield, Zap, ArrowRight, Play, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Sales = () => {
  const navigate = useNavigate();
  const [demoStarted, setDemoStarted] = useState(false);
  const [demoExpired, setDemoExpired] = useState(false);
  const [daysRemaining, setDaysRemaining] = useState(7);

  useEffect(() => {
    const demoStart = localStorage.getItem("demo_start_date");
    if (demoStart) {
      const startDate = new Date(demoStart);
      const now = new Date();
      const diffTime = now.getTime() - startDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays >= 7) {
        setDemoExpired(true);
        setDaysRemaining(0);
      } else {
        setDemoStarted(true);
        setDaysRemaining(7 - diffDays);
      }
    }
  }, []);

  const startDemo = () => {
    localStorage.setItem("demo_start_date", new Date().toISOString());
    setDemoStarted(true);
    setDaysRemaining(7);
    navigate("/auth");
  };

  const testimonials = [
    { name: "Carlos Mendes", business: "Barbearia Premium", text: "Aumentei meu faturamento em 40% no primeiro mês!" },
    { name: "Roberto Silva", business: "Studio Barber", text: "Nunca mais perdi um cliente por esquecimento de horário." },
    { name: "Fernando Costa", business: "Barber Shop VIP", text: "Sistema incrível! Meus clientes adoram a facilidade." },
  ];

  const features = [
    { icon: Calendar, title: "Agenda Inteligente", desc: "Organize seus horários de forma automática" },
    { icon: MessageSquare, title: "WhatsApp Integrado", desc: "Notificações automáticas para você e seus clientes" },
    { icon: Users, title: "Gestão de Clientes", desc: "Histórico completo de cada cliente" },
    { icon: Shield, title: "100% Seguro", desc: "Seus dados protegidos com criptografia" },
    { icon: Zap, title: "Tempo Real", desc: "Atualizações instantâneas em qualquer dispositivo" },
    { icon: Clock, title: "24/7 Disponível", desc: "Sistema sempre online para agendamentos" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 px-4 py-2 text-sm">
              🔥 Oferta Especial por Tempo Limitado
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Pare de Perder Clientes por
              <span className="text-primary block mt-2">Desorganização!</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              O sistema completo que vai <strong className="text-foreground">triplicar seus agendamentos</strong> e 
              fazer seus clientes voltarem sempre.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              {!demoExpired ? (
                <Button 
                  size="lg" 
                  className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 animate-pulse"
                  onClick={startDemo}
                >
                  <Play className="mr-2 h-5 w-5" />
                  {demoStarted ? `Continuar Demo (${daysRemaining} dias)` : "Começar Demo Grátis - 7 Dias"}
                </Button>
              ) : (
                <Button 
                  size="lg" 
                  className="text-lg px-8 py-6 bg-primary hover:bg-primary/90"
                  onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <Lock className="mr-2 h-5 w-5" />
                  Ver Planos de Assinatura
                </Button>
              )}
            </div>

            <p className="text-sm text-muted-foreground">
              ✓ Sem cartão de crédito &nbsp; ✓ Cancele quando quiser &nbsp; ✓ Suporte incluso
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
            {[
              { value: "500+", label: "Barbearias Ativas" },
              { value: "50mil+", label: "Agendamentos/Mês" },
              { value: "98%", label: "Satisfação" },
              { value: "40%", label: "Aumento Médio" },
            ].map((stat, i) => (
              <div key={i} className="text-center p-6 rounded-xl bg-card/50 backdrop-blur border border-border/50">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pain Points */}
      <section className="py-20 px-4 bg-destructive/5">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            Você está cansado de...
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6 text-left">
            {[
              "❌ Perder clientes porque esqueceu de confirmar o horário",
              "❌ Agenda bagunçada em papéis ou WhatsApp",
              "❌ Clientes que marcam e não aparecem",
              "❌ Não saber quanto vai faturar no fim do mês",
              "❌ Trabalhar mais e ganhar menos",
              "❌ Perder tempo com organização manual",
            ].map((pain, i) => (
              <div key={i} className="p-4 bg-background rounded-lg border border-destructive/20 text-lg">
                {pain}
              </div>
            ))}
          </div>
          
          <p className="mt-12 text-2xl font-semibold text-primary">
            Existe uma solução simples para TODOS esses problemas! 👇
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Tudo que Você Precisa em Um Só Lugar
            </h2>
            <p className="text-xl text-muted-foreground">
              Sistema completo desenvolvido especialmente para barbearias
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <Card key={i} className="border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-primary/5">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              O Que Nossos Clientes Dizem
            </h2>
            <p className="text-xl text-muted-foreground">
              Histórias reais de barbeiros que transformaram seus negócios
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <Card key={i} className="border-border/50">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-lg mb-4 italic">"{t.text}"</p>
                  <div>
                    <p className="font-semibold">{t.name}</p>
                    <p className="text-sm text-muted-foreground">{t.business}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-green-500/10 text-green-500 border-green-500/20 px-4 py-2">
              💰 Investimento que se Paga em 1 Semana
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Escolha o Melhor Plano Para Você
            </h2>
            <p className="text-xl text-muted-foreground">
              Comece hoje e veja resultados imediatos
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Implementation Package */}
            <Card className="border-2 border-primary relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-4 py-1 text-sm font-medium">
                MAIS POPULAR
              </div>
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl">Pacote Completo</CardTitle>
                <p className="text-muted-foreground">Implementação + Sistema</p>
              </CardHeader>
              <CardContent className="text-center">
                <div className="mb-6">
                  <span className="text-sm text-muted-foreground line-through">R$ 997</span>
                  <div className="text-5xl font-bold text-primary">R$ 647</div>
                  <span className="text-muted-foreground">pagamento único</span>
                </div>
                
                <ul className="text-left space-y-3 mb-8">
                  {[
                    "Configuração completa do sistema",
                    "Personalização com sua marca",
                    "Importação de clientes existentes",
                    "Treinamento completo (1h)",
                    "Suporte prioritário 30 dias",
                    "Domínio personalizado incluso",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  className="w-full text-lg py-6 bg-primary hover:bg-primary/90"
                  onClick={() => window.open("https://wa.me/5511932071021?text=Olá! Quero contratar o pacote de implementação de R$647", "_blank")}
                >
                  Quero Começar Agora
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </CardContent>
            </Card>

            {/* Monthly Maintenance */}
            <Card className="border-border/50">
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl">Manutenção Mensal</CardTitle>
                <p className="text-muted-foreground">Suporte contínuo</p>
              </CardHeader>
              <CardContent className="text-center">
                <div className="mb-6">
                  <div className="text-5xl font-bold">R$ 120</div>
                  <span className="text-muted-foreground">/mês</span>
                </div>
                
                <ul className="text-left space-y-3 mb-8">
                  {[
                    "Hospedagem ilimitada",
                    "Backups automáticos diários",
                    "Atualizações de segurança",
                    "Suporte via WhatsApp",
                    "Novos recursos inclusos",
                    "Sem limite de agendamentos",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  variant="outline"
                  className="w-full text-lg py-6"
                  onClick={() => window.open("https://wa.me/5511932071021?text=Olá! Quero saber mais sobre a manutenção mensal de R$120", "_blank")}
                >
                  Falar com Consultor
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Guarantee */}
          <div className="mt-12 text-center p-8 bg-green-500/10 rounded-2xl border border-green-500/20 max-w-2xl mx-auto">
            <Shield className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Garantia de 7 Dias</h3>
            <p className="text-muted-foreground">
              Se em 7 dias você não ver resultados, devolvemos 100% do seu investimento. 
              Sem perguntas, sem burocracia.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Pronto Para Transformar Sua Barbearia?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Junte-se a mais de 500 barbeiros que já estão faturando mais com nosso sistema.
          </p>
          
          {!demoExpired ? (
            <Button 
              size="lg" 
              variant="secondary"
              className="text-lg px-8 py-6"
              onClick={startDemo}
            >
              <Play className="mr-2 h-5 w-5" />
              Testar Grátis por 7 Dias
            </Button>
          ) : (
            <Button 
              size="lg" 
              variant="secondary"
              className="text-lg px-8 py-6"
              onClick={() => window.open("https://wa.me/5511932071021?text=Olá! Quero contratar o sistema completo!", "_blank")}
            >
              Falar com Consultor Agora
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border/50">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>© 2024 Sistema de Agendamento para Barbearias. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Sales;
