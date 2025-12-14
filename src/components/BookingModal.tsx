import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Lock, CheckCircle2, MessageCircle } from "lucide-react";
import { pt } from "date-fns/locale";
import { format } from "date-fns";
import { z } from "zod";
import { sendWhatsAppNotification } from "@/hooks/useWhatsAppNotify";

// Número do WhatsApp da barbearia (formato internacional, sem espaços)
const OWNER_WHATSAPP_NUMBER = "5511932071021";

// ID do dono padrão (sua conta do painel) para receber todos os agendamentos
// Usuário: multflaviopassivo@gmail.com
const DEFAULT_OWNER_ID = "f8de8fa6-e8ed-41d3-8fc8-2aded8d71682";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedService?: string;
  selectedPrice?: number;
}

const services = [
  { name: "Corte Executivo Premium", price: 80 },
  { name: "Corte + Barba Modelada", price: 120 },
  { name: "Pacote Noivo/Eventos", price: 200 },
  { name: "Degradê Profissional", price: 70 },
  { name: "Tratamento Capilar Premium", price: 150 },
  { name: "Pigmentação de Barba", price: 100 }
];

const bookingSchema = z.object({
  nome: z.string()
    .trim()
    .min(3, "Nome deve ter pelo menos 3 caracteres")
    .max(100, "Nome muito longo (máximo 100 caracteres)")
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "Nome deve conter apenas letras"),
  whatsapp: z.string()
    .trim()
    .min(10, "WhatsApp deve ter pelo menos 10 dígitos")
    .max(20, "WhatsApp inválido")
    .regex(/^[\d\s\(\)-]+$/, "WhatsApp deve conter apenas números e caracteres válidos"),
  email: z.string()
    .trim()
    .email("Email inválido")
    .max(255, "Email muito longo"),
  observacoes: z.string()
    .max(500, "Observações muito longas (máximo 500 caracteres)")
    .optional(),
  servico: z.string().min(1, "Selecione um serviço"),
  data: z.date({ required_error: "Selecione uma data" }),
  horario: z.string().min(1, "Selecione um horário"),
  valor: z.number()
});

const timeSlots = [
  "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"
];

export const BookingModal = ({ isOpen, onClose, selectedService, selectedPrice }: BookingModalProps) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    nome: "",
    whatsapp: "",
    email: "",
    servico: selectedService || "",
    data: undefined as Date | undefined,
    horario: "",
    observacoes: "",
    valor: selectedPrice || 0
  });

  const handleWhatsAppBooking = () => {
    // Validar dados básicos antes de abrir WhatsApp
    try {
      bookingSchema.parse({
        nome: formData.nome,
        whatsapp: formData.whatsapp,
        email: formData.email,
        observacoes: formData.observacoes || undefined,
        servico: formData.servico,
        data: formData.data,
        horario: formData.horario,
        valor: formData.valor
      });

      const dataFormatada = formData.data 
        ? format(formData.data, "dd/MM/yyyy", { locale: pt })
        : "";

      const mensagem = `Olá! 👋 Gostaria de agendar um horário na *ZENTRIXIA Barbearia Premium* ✨

*📋 Dados do Agendamento:*
━━━━━━━━━━━━━━━━━━━━
👤 *Nome:* ${formData.nome}
✂️ *Serviço:* ${formData.servico}
💰 *Valor:* R$${formData.valor}
📅 *Data:* ${dataFormatada}
🕐 *Horário:* ${formData.horario}
📱 *WhatsApp:* ${formData.whatsapp}
📧 *Email:* ${formData.email}
${formData.observacoes ? `\n📝 *Observações:* ${formData.observacoes}` : ''}
━━━━━━━━━━━━━━━━━━━━

Aguardo confirmação! 🙏`;

      const encodedMessage = encodeURIComponent(mensagem);
      const whatsappUrl = `https://wa.me/${OWNER_WHATSAPP_NUMBER}?text=${encodedMessage}`;

      window.open(whatsappUrl, '_blank');
      
      toast.success("Abrindo WhatsApp...");
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        toast.error(firstError.message);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar dados com zod
    try {
      const validatedData = bookingSchema.parse({
        nome: formData.nome,
        whatsapp: formData.whatsapp,
        email: formData.email,
        observacoes: formData.observacoes || undefined,
        servico: formData.servico,
        data: formData.data,
        horario: formData.horario,
        valor: formData.valor
      });

      setLoading(true);

      const { error } = await supabase
        .from('agendamentos')
        .insert([{
          nome: validatedData.nome,
          whatsapp: validatedData.whatsapp,
          email: validatedData.email,
          servico: validatedData.servico,
          data: validatedData.data.toISOString().split('T')[0],
          horario: validatedData.horario,
          observacoes: validatedData.observacoes || null,
          valor: validatedData.valor,
          status: 'pendente',
          owner_id: DEFAULT_OWNER_ID
        }]);

      if (error) throw error;

      // Enviar notificação via WhatsApp
      await sendWhatsAppNotification("novo_agendamento", {
        id: "",
        nome: validatedData.nome,
        whatsapp: validatedData.whatsapp,
        email: validatedData.email,
        servico: validatedData.servico,
        data: validatedData.data.toISOString().split('T')[0],
        horario: validatedData.horario,
        valor: validatedData.valor,
        observacoes: validatedData.observacoes || undefined
      });

      setShowSuccess(true);
      toast.success("Agendamento confirmado com sucesso!");
      
      setTimeout(() => {
        onClose();
        setShowSuccess(false);
        setStep(1);
        setFormData({
          nome: "",
          whatsapp: "",
          email: "",
          servico: "",
          data: undefined,
          horario: "",
          observacoes: "",
          valor: 0
        });
      }, 3000);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        toast.error(firstError.message);
      } else {
        toast.error("Erro ao realizar agendamento. Tente novamente.");
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  };

  if (showSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md bg-card border-gold/20">
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-gold rounded-full mb-6 animate-bounce">
              <CheckCircle2 className="w-10 h-10 text-black-deep" />
            </div>
            <h3 className="text-3xl font-heading mb-4 text-gold">Agendamento Confirmado!</h3>
            <p className="text-muted-foreground mb-2">Você receberá uma confirmação no WhatsApp em breve.</p>
            <p className="text-sm text-gold">Prepare-se para uma experiência premium!</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-card border-gold/20 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-heading text-center">
            Agende Seu <span className="text-gradient-gold">Horário VIP</span>
          </DialogTitle>
        </DialogHeader>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-4 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                step >= s ? 'bg-gradient-gold text-black-deep' : 'bg-muted text-muted-foreground'
              }`}>
                {s}
              </div>
              {s < 3 && <div className={`w-16 h-1 ${step > s ? 'bg-gold' : 'bg-muted'}`}></div>}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 1 && (
            <div className="space-y-4 animate-fade-in-up">
              <h3 className="text-xl font-heading text-gold mb-4">PASSO 1: Escolha o Serviço</h3>
              
              <div className="space-y-2">
                <Label htmlFor="servico">Serviço *</Label>
                <Select 
                  value={formData.servico} 
                  onValueChange={(value) => {
                    const service = services.find(s => s.name === value);
                    setFormData({ ...formData, servico: value, valor: service?.price || 0 });
                  }}
                  required
                >
                  <SelectTrigger className="bg-muted border-gold/20">
                    <SelectValue placeholder="Selecione um serviço" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-gold/20">
                    {services.map((service) => (
                      <SelectItem key={service.name} value={service.name}>
                        {service.name} - R${service.price}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formData.valor > 0 && (
                <div className="bg-gradient-gold/10 border border-gold/20 rounded-lg p-4">
                  <div className="text-sm text-muted-foreground">Valor do Serviço</div>
                  <div className="text-3xl font-price text-gold">R${formData.valor}</div>
                </div>
              )}

              <Button 
                type="button"
                onClick={() => setStep(2)}
                disabled={!formData.servico}
                className="w-full btn-gold"
              >
                Próximo Passo
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-fade-in-up">
              <h3 className="text-xl font-heading text-gold mb-4">PASSO 2: Data e Horário</h3>
              
              <div className="space-y-2">
                <Label>Escolha a Data *</Label>
                <Calendar
                  mode="single"
                  selected={formData.data}
                  onSelect={(date) => setFormData({ ...formData, data: date })}
                  disabled={(date) => date < new Date() || date.getDay() === 0}
                  locale={pt}
                  className="rounded-lg border border-gold/20 bg-card p-3 pointer-events-auto"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="horario">Horário *</Label>
                <Select 
                  value={formData.horario} 
                  onValueChange={(value) => setFormData({ ...formData, horario: value })}
                  required
                >
                  <SelectTrigger className="bg-muted border-gold/20">
                    <SelectValue placeholder="Selecione um horário" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-gold/20">
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-3">
                <Button type="button" onClick={() => setStep(1)} variant="outline" className="flex-1">
                  Voltar
                </Button>
                <Button 
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={!formData.data || !formData.horario}
                  className="flex-1 btn-gold"
                >
                  Próximo Passo
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-fade-in-up">
              <h3 className="text-xl font-heading text-gold mb-4">PASSO 3: Seus Dados</h3>
              
              <div className="space-y-2">
                <Label htmlFor="nome">Nome Completo *</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="bg-muted border-gold/20"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp *</Label>
                <Input
                  id="whatsapp"
                  type="tel"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  placeholder="(00) 00000-0000"
                  className="bg-muted border-gold/20"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-muted border-gold/20"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações (opcional)</Label>
                <Textarea
                  id="observacoes"
                  value={formData.observacoes}
                  onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                  className="bg-muted border-gold/20"
                  rows={3}
                />
              </div>

              <div className="space-y-3">
                <div className="flex gap-3">
                  <Button type="button" onClick={() => setStep(2)} variant="outline" className="flex-1">
                    Voltar
                  </Button>
                  <Button 
                    type="submit"
                    disabled={loading}
                    className="flex-1 btn-hero"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Confirmando...
                      </>
                    ) : (
                      <>
                        <Lock className="w-5 h-5 mr-2" />
                        CONFIRMAR AGENDAMENTO
                      </>
                    )}
                  </Button>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gold/20" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">ou</span>
                  </div>
                </div>

                <Button 
                  type="button"
                  onClick={handleWhatsAppBooking}
                  variant="outline"
                  className="w-full border-green-500/50 hover:bg-green-500/10 hover:border-green-500 text-green-500 font-semibold transition-all"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Agendar pelo WhatsApp
                </Button>
                
                <p className="text-xs text-center text-muted-foreground">
                  💬 Prefere conversar direto? Clique acima para abrir o WhatsApp com seus dados pré-preenchidos!
                </p>
              </div>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};
