import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Clock, Users, Calendar, MessageSquare, Shield, Zap, ArrowRight, Play, Lock, AlertTriangle, TrendingUp, BadgeCheck, Flame, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Importando fotos reais dos clientes
import testimonialCarlos from "@/assets/testimonial-carlos.jpg";
import testimonialFernando from "@/assets/testimonial-fernando.jpg";
import testimonialJoao from "@/assets/testimonial-joao.jpg";
import testimonialMarcos from "@/assets/testimonial-marcos.jpg";
import testimonialPaulo from "@/assets/testimonial-paulo.jpg";
import testimonialRicardo from "@/assets/testimonial-ricardo.jpg";

const Sales = () => {
  const navigate = useNavigate();
  const [demoStarted, setDemoStarted] = useState(false);
  const [demoExpired, setDemoExpired] = useState(false);
  const [daysRemaining, setDaysRemaining] = useState(7);
  const [spotsLeft, setSpotsLeft] = useState(7);

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
    
    // Simular vagas limitadas
    const randomSpots = Math.floor(Math.random() * 5) + 3;
    setSpotsLeft(randomSpots);
  }, []);

  const startDemo = () => {
    localStorage.setItem("demo_start_date", new Date().toISOString());
    setDemoStarted(true);
    setDaysRemaining(7);
    navigate("/auth");
  };

  const testimonials = [
    { 
      name: "Carlos Mendes", 
      business: "Barbearia Premium - São Paulo", 
      text: "Cara, eu estava QUEBRADO. Perdia 5-6 clientes por semana porque esquecia de confirmar horário. Em 30 dias com o sistema, meu faturamento EXPLODIU. Aumentei 47% e nunca mais perdi um cliente. Isso aqui salvou meu negócio!",
      image: testimonialCarlos,
      revenue: "R$ 12.400/mês"
    },
    { 
      name: "Fernando Costa", 
      business: "Barber Shop VIP - Rio de Janeiro", 
      text: "Eu duvidei no início, achei que era mais um sistema inútil. Mas em UMA SEMANA eu já tinha recuperado o investimento. Meus clientes recebem lembrete automático, ninguém mais falta. É surreal a diferença!",
      image: testimonialFernando,
      revenue: "R$ 18.700/mês"
    },
    { 
      name: "João Paulo", 
      business: "Studio Barber - Belo Horizonte", 
      text: "Trabalhava 12 horas por dia e não via resultado. Agora trabalho 8 horas e ganho o DOBRO. O sistema organiza tudo automaticamente. Minha esposa até voltou a sorrir porque agora tenho tempo pra família!",
      image: testimonialJoao,
      revenue: "R$ 15.200/mês"
    },
    { 
      name: "Marcos Silva", 
      business: "Barbearia do Marcos - Curitiba", 
      text: "Se você está em dúvida, PARA de pensar e contrata logo! Eu perdi 3 meses pensando e calculei que deixei de ganhar uns R$ 8.000 nesse período. Não seja burro igual eu fui!",
      image: testimonialMarcos,
      revenue: "R$ 9.800/mês"
    },
    { 
      name: "Paulo Roberto", 
      business: "Barber House - Brasília", 
      text: "Meu concorrente usa esse sistema e estava roubando TODOS os meus clientes. Quando eu descobri e comecei a usar também, recuperei tudo e ainda peguei clientes dele. Agora ele que está correndo atrás!",
      image: testimonialPaulo,
      revenue: "R$ 21.300/mês"
    },
    { 
      name: "Ricardo Alves", 
      business: "The Barber Co. - Porto Alegre", 
      text: "O suporte é ABSURDO de bom. Tive uma dúvida às 11 da noite e me responderam em 15 minutos. Nunca vi atendimento assim. O sistema é perfeito, mas o suporte é o diferencial que me fez indicar pra 8 amigos barbeiros!",
      image: testimonialRicardo,
      revenue: "R$ 16.500/mês"
    },
  ];

  const features = [
    { icon: Calendar, title: "Agenda Inteligente", desc: "Seus clientes agendam sozinhos 24h. Você só aparece pra cortar!" },
    { icon: MessageSquare, title: "WhatsApp Automático", desc: "Lembrete 24h antes = ZERO faltas. Seu dinheiro garantido." },
    { icon: Users, title: "Gestão de Clientes", desc: "Saiba exatamente quanto cada cliente te dá de lucro." },
    { icon: Shield, title: "Anti-Furo", desc: "Cliente que marca e não vem? Sistema bloqueia automaticamente." },
    { icon: Zap, title: "Relatórios em Tempo Real", desc: "Saiba HOJE quanto vai faturar no mês. Sem surpresas." },
    { icon: Clock, title: "Funciona Dormindo", desc: "Clientes agendando às 3h da manhã enquanto você descansa." },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      {/* Urgency Banner */}
      <div className="bg-destructive text-destructive-foreground py-3 px-4 text-center animate-pulse">
        <div className="flex items-center justify-center gap-2 text-sm md:text-base font-bold">
          <AlertTriangle className="h-5 w-5" />
          <span>⚠️ ATENÇÃO: Restam apenas {spotsLeft} vagas com preço promocional este mês!</span>
          <AlertTriangle className="h-5 w-5" />
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-destructive/10 text-destructive border-destructive/20 px-4 py-2 text-sm font-bold animate-bounce">
              🔥 ÚLTIMA CHANCE - Preço sobe em 48 horas!
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Enquanto Você Lê Isso, Seu 
              <span className="text-destructive block mt-2">Concorrente Está Roubando</span>
              <span className="text-primary">Seus Clientes!</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-4 max-w-3xl mx-auto">
              <strong className="text-foreground">Barbeiros que NÃO usam esse sistema perdem em média R$ 3.200/mês</strong> com clientes que esquecem, não aparecem ou vão pro concorrente.
            </p>
            
            <p className="text-lg text-destructive font-semibold mb-8">
              Você vai continuar PERDENDO dinheiro ou vai agir AGORA?
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              {!demoExpired ? (
                <Button 
                  size="lg" 
                  className="text-lg px-10 py-7 bg-primary hover:bg-primary/90 shadow-2xl shadow-primary/40 animate-pulse text-xl"
                  onClick={startDemo}
                >
                  <Flame className="mr-2 h-6 w-6" />
                  {demoStarted ? `CONTINUAR DEMO (${daysRemaining} dias)` : "QUERO PARAR DE PERDER DINHEIRO"}
                </Button>
              ) : (
                <Button 
                  size="lg" 
                  className="text-lg px-10 py-7 bg-primary hover:bg-primary/90 text-xl"
                  onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <Lock className="mr-2 h-6 w-6" />
                  GARANTIR MINHA VAGA AGORA
                </Button>
              )}
            </div>

            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <span className="flex items-center gap-1 text-green-500">
                <Check className="h-4 w-4" /> Sem cartão de crédito
              </span>
              <span className="flex items-center gap-1 text-green-500">
                <Check className="h-4 w-4" /> 7 dias grátis
              </span>
              <span className="flex items-center gap-1 text-green-500">
                <Check className="h-4 w-4" /> Garantia total
              </span>
            </div>
          </div>

          {/* Stats with Impact */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-16">
            {[
              { value: "547", label: "Barbeiros Lucrando", icon: Users },
              { value: "R$ 2.1M", label: "Faturado Este Mês", icon: TrendingUp },
              { value: "99.2%", label: "Recomendam", icon: Star },
              { value: "+47%", label: "Aumento Médio", icon: Zap },
            ].map((stat, i) => (
              <div key={i} className="text-center p-4 md:p-6 rounded-xl bg-card/50 backdrop-blur border border-primary/30 hover:border-primary transition-all hover:scale-105">
                <stat.icon className="h-6 w-6 md:h-8 md:w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl md:text-4xl font-bold text-primary mb-1">{stat.value}</div>
                <div className="text-xs md:text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pain Points - Provocação */}
      <section className="py-16 md:py-20 px-4 bg-destructive/10 border-y border-destructive/20">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Seja HONESTO Consigo Mesmo...
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Quantos desses problemas você enfrenta TODO DIA?
          </p>
          
          <div className="grid md:grid-cols-2 gap-4 text-left">
            {[
              { text: "Cliente marca e NÃO aparece (você perdeu tempo E dinheiro)", emoji: "💸" },
              { text: "Agenda bagunçada - você nem sabe quem vem amanhã", emoji: "📋" },
              { text: "Trabalha que nem louco mas o dinheiro some no fim do mês", emoji: "😤" },
              { text: "Concorrente lotado enquanto sua cadeira fica vazia", emoji: "😡" },
              { text: "Esquece de confirmar horário e perde cliente pra sempre", emoji: "🤦" },
              { text: "Final de semana? Só se for trabalhando!", emoji: "😔" },
            ].map((pain, i) => (
              <div key={i} className="p-4 bg-background rounded-lg border border-destructive/30 flex items-start gap-3 hover:border-destructive transition-colors">
                <XCircle className="h-6 w-6 text-destructive flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-2xl mr-2">{pain.emoji}</span>
                  <span className="text-base md:text-lg">{pain.text}</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 p-6 bg-primary/10 rounded-2xl border border-primary/30">
            <p className="text-xl md:text-2xl font-bold text-primary">
              Se você marcou 2 ou mais, você está LITERALMENTE jogando dinheiro fora todo mês!
            </p>
            <p className="text-lg text-muted-foreground mt-2">
              A boa notícia? Em 7 dias você pode resolver TODOS esses problemas. 👇
            </p>
          </div>
        </div>
      </section>

      {/* Features - Com mais persuasão */}
      <section className="py-16 md:py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 md:mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 px-4 py-2">
              ⚡ Sistema Usado por +500 Barbearias de Sucesso
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Enquanto Você Dorme, Seu Negócio 
              <span className="text-primary"> Trabalha Por Você</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Funcionalidades que seus concorrentes PAGAM CARO pra ter
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature, i) => (
              <Card key={i} className="border-border/50 hover:border-primary/50 transition-all hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials com Fotos Reais */}
      <section className="py-16 md:py-20 px-4 bg-gradient-to-b from-primary/5 to-primary/10">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 md:mb-16">
            <Badge className="mb-4 bg-green-500/10 text-green-500 border-green-500/20 px-4 py-2">
              ✅ Resultados REAIS de Barbeiros REAIS
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Eles Duvidaram... Agora Estão <span className="text-primary">Faturando Alto!</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Veja o que barbeiros de todo o Brasil estão dizendo
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <Card key={i} className="border-border/50 hover:border-primary/50 transition-all overflow-hidden group">
                <CardContent className="p-0">
                  {/* Header com foto */}
                  <div className="relative h-20 bg-gradient-to-r from-primary to-primary/80">
                    <div className="absolute -bottom-10 left-6">
                      <div className="relative">
                        <img 
                          src={t.image} 
                          alt={t.name}
                          className="w-20 h-20 rounded-full border-4 border-background object-cover shadow-lg"
                        />
                        <BadgeCheck className="absolute -bottom-1 -right-1 h-6 w-6 text-primary bg-background rounded-full" />
                      </div>
                    </div>
                    <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                      {t.revenue}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="pt-14 px-6 pb-6">
                    <div className="flex gap-0.5 mb-3">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    
                    <p className="text-sm md:text-base mb-4 text-muted-foreground leading-relaxed">
                      "{t.text}"
                    </p>
                    
                    <div className="border-t border-border pt-4">
                      <p className="font-bold text-foreground">{t.name}</p>
                      <p className="text-sm text-muted-foreground">{t.business}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Social Proof Extra */}
          <div className="mt-12 text-center">
            <p className="text-lg text-muted-foreground">
              <span className="text-primary font-bold">+547 barbeiros</span> já transformaram seus negócios. 
              <span className="text-destructive font-semibold"> Você vai ficar de fora?</span>
            </p>
          </div>
        </div>
      </section>

      {/* Comparison - Você vs Concorrente */}
      <section className="py-16 md:py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              A Diferença Entre <span className="text-destructive">Fracassar</span> e <span className="text-primary">Lucrar</span>
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Sem Sistema */}
            <Card className="border-destructive/30 bg-destructive/5">
              <CardHeader>
                <CardTitle className="text-destructive flex items-center gap-2">
                  <XCircle className="h-6 w-6" />
                  Barbeiro SEM Sistema
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  "Perde 5-10 clientes por semana",
                  "Trabalha 12h e ganha pouco",
                  "Agenda bagunçada em papel",
                  "Cliente marca e não aparece",
                  "Não sabe quanto vai faturar",
                  "Concorrente rouba clientes",
                  "Faturamento: R$ 4.000 - 6.000/mês"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-destructive">
                    <XCircle className="h-4 w-4 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
            
            {/* Com Sistema */}
            <Card className="border-primary/30 bg-primary/5 ring-2 ring-primary/20">
              <CardHeader>
                <CardTitle className="text-primary flex items-center gap-2">
                  <BadgeCheck className="h-6 w-6" />
                  Barbeiro COM Sistema
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  "Zero faltas com lembretes automáticos",
                  "Trabalha 8h e ganha mais",
                  "Agenda organizada 24h/dia",
                  "Clientes confirmam pelo WhatsApp",
                  "Relatórios em tempo real",
                  "Rouba clientes do concorrente",
                  "Faturamento: R$ 12.000 - 25.000/mês"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-primary">
                    <Check className="h-4 w-4 flex-shrink-0" />
                    <span className="font-medium">{item}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
          
          <p className="text-center mt-8 text-xl font-bold">
            A pergunta é: <span className="text-primary">qual barbeiro você quer ser?</span>
          </p>
        </div>
      </section>

      {/* Pricing com Urgência */}
      <section id="pricing" className="py-16 md:py-20 px-4 bg-gradient-to-b from-background to-primary/5">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12 md:mb-16">
            <Badge className="mb-4 bg-destructive/10 text-destructive border-destructive/20 px-4 py-2 animate-pulse">
              ⏰ OFERTA EXPIRA EM 48 HORAS - Restam {spotsLeft} vagas!
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Investimento Que Se Paga em <span className="text-primary">1 Semana</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Quanto custa NÃO ter esse sistema? <span className="text-destructive font-semibold">R$ 3.200/mês em clientes perdidos!</span>
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-3xl mx-auto">
            {/* Implementation Package */}
            <Card className="border-2 border-primary relative overflow-hidden shadow-2xl shadow-primary/20">
              <div className="absolute top-0 left-0 right-0 bg-primary text-primary-foreground py-2 text-center text-sm font-bold">
                🔥 MAIS ESCOLHIDO - 73% dos barbeiros
              </div>
              <CardHeader className="text-center pb-2 pt-12">
                <CardTitle className="text-2xl">Pacote Completo</CardTitle>
                <p className="text-muted-foreground">Implementação + Sistema + Suporte</p>
              </CardHeader>
              <CardContent className="text-center">
                <div className="mb-6">
                  <span className="text-lg text-muted-foreground line-through">De R$ 997</span>
                  <div className="text-5xl md:text-6xl font-bold text-primary">R$ 647</div>
                  <span className="text-muted-foreground">pagamento único</span>
                  <p className="text-sm text-green-500 font-semibold mt-2">
                    Economize R$ 350 HOJE!
                  </p>
                </div>
                
                <ul className="text-left space-y-3 mb-8">
                  {[
                    "✅ Configuração COMPLETA em 24h",
                    "✅ Sua logo e cores personalizadas",
                    "✅ Importamos seus clientes atuais",
                    "✅ Treinamento VIP 1-a-1 (1h)",
                    "✅ Suporte PRIORITÁRIO 30 dias",
                    "✅ Domínio personalizado GRÁTIS",
                    "✅ Bônus: Template de mensagens",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm md:text-base">
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  className="w-full text-lg py-7 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30"
                  onClick={() => window.open("https://wa.me/5511932071021?text=🔥 QUERO GARANTIR MINHA VAGA no pacote de R$647 AGORA!", "_blank")}
                >
                  GARANTIR MINHA VAGA AGORA
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                
                <p className="text-xs text-muted-foreground mt-3">
                  ⚡ Últimas {spotsLeft} vagas com esse preço
                </p>
              </CardContent>
            </Card>

            {/* Monthly Maintenance */}
            <Card className="border-border/50">
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl">Manutenção Mensal</CardTitle>
                <p className="text-muted-foreground">Após implementação</p>
              </CardHeader>
              <CardContent className="text-center">
                <div className="mb-6">
                  <div className="text-5xl md:text-6xl font-bold">R$ 120</div>
                  <span className="text-muted-foreground">/mês</span>
                  <p className="text-sm text-muted-foreground mt-2">
                    Menos de R$ 4/dia para lucrar mais!
                  </p>
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
                    <li key={i} className="flex items-center gap-2 text-sm md:text-base">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  variant="outline"
                  className="w-full text-lg py-7"
                  onClick={() => window.open("https://wa.me/5511932071021?text=Olá! Quero saber mais sobre a manutenção mensal", "_blank")}
                >
                  Falar com Consultor
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Guarantee */}
          <div className="mt-12 text-center p-6 md:p-8 bg-green-500/10 rounded-2xl border border-green-500/20 max-w-2xl mx-auto">
            <Shield className="h-12 w-12 md:h-16 md:w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl md:text-3xl font-bold mb-2">Garantia INCONDICIONAL de 7 Dias</h3>
            <p className="text-muted-foreground text-lg">
              Se em 7 dias você não ver resultados, devolvemos <strong>100% do seu dinheiro</strong>. 
              Sem perguntas, sem burocracia, sem mimimi. <span className="text-primary font-semibold">Risco ZERO pra você!</span>
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA - Provocação Final */}
      <section className="py-16 md:py-20 px-4 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Você Tem DUAS Opções Agora:
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-10 text-left">
            <div className="p-6 bg-background/10 rounded-xl">
              <h3 className="text-xl font-bold mb-3 text-destructive-foreground opacity-80">❌ Opção 1: Não fazer nada</h3>
              <p className="opacity-90">
                Continuar perdendo clientes, trabalhando igual louco, vendo o concorrente crescer enquanto você fica pra trás. Daqui a 6 meses, vai estar no mesmo lugar (ou pior).
              </p>
            </div>
            <div className="p-6 bg-background/20 rounded-xl ring-2 ring-white/30">
              <h3 className="text-xl font-bold mb-3">✅ Opção 2: Agir AGORA</h3>
              <p className="opacity-90">
                Testar por 7 dias GRÁTIS, ver seu faturamento aumentar, ter mais tempo livre, e finalmente ter o negócio que você sempre sonhou. <strong>Sem risco!</strong>
              </p>
            </div>
          </div>
          
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Seus concorrentes já estão usando. <span className="font-bold">E você?</span>
          </p>
          
          {!demoExpired ? (
            <Button 
              size="lg" 
              variant="secondary"
              className="text-lg md:text-xl px-10 py-7 shadow-2xl hover:scale-105 transition-transform"
              onClick={startDemo}
            >
              <Play className="mr-2 h-6 w-6" />
              QUERO TESTAR GRÁTIS POR 7 DIAS
            </Button>
          ) : (
            <Button 
              size="lg" 
              variant="secondary"
              className="text-lg md:text-xl px-10 py-7 shadow-2xl hover:scale-105 transition-transform"
              onClick={() => window.open("https://wa.me/5511932071021?text=🔥 QUERO GARANTIR MINHA VAGA AGORA!", "_blank")}
            >
              GARANTIR MINHA VAGA AGORA
              <ArrowRight className="ml-2 h-6 w-6" />
            </Button>
          )}
          
          <p className="mt-6 text-sm opacity-75">
            ⏰ Esta oferta expira em breve. Não perca sua chance!
          </p>
        </div>
      </section>

      {/* FAQ Rápido */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
            Ainda Com Dúvidas?
          </h2>
          
          <div className="space-y-4">
            {[
              { q: "E se eu não gostar?", a: "Devolvemos 100% do seu dinheiro em até 7 dias. Sem perguntas!" },
              { q: "Preciso saber mexer em computador?", a: "NÃO! Fazemos toda a configuração pra você. É só usar!" },
              { q: "Funciona no celular?", a: "SIM! Você gerencia tudo pelo WhatsApp ou navegador do celular." },
              { q: "Em quanto tempo vejo resultados?", a: "A maioria dos barbeiros vê aumento de 20-30% já na primeira semana!" },
            ].map((faq, i) => (
              <div key={i} className="p-4 bg-card rounded-lg border border-border/50">
                <p className="font-bold mb-1">{faq.q}</p>
                <p className="text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border/50">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>© 2024 Sistema de Agendamento para Barbearias. Todos os direitos reservados.</p>
          <p className="text-sm mt-2">Feito com ❤️ para barbeiros que querem crescer</p>
        </div>
      </footer>
    </div>
  );
};

export default Sales;
