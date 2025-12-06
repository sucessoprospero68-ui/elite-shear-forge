import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Agendamento {
  id: string;
  nome: string;
  whatsapp: string;
  email: string;
  servico: string;
  data: string;
  horario: string;
  valor: number;
  status?: string;
  observacoes?: string;
}

type NotificationType = "novo_agendamento" | "cancelamento" | "confirmacao" | "conclusao";

// Link direto do WhatsApp do proprietário
const OWNER_WHATSAPP_LINK = "https://wa.me/message/LZQJBTUALFUYE1";

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('pt-BR');
};

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

const generateMessage = (type: NotificationType, agendamento: Agendamento): string => {
  let emoji = "";
  let titulo = "";
  
  switch (type) {
    case "novo_agendamento":
      emoji = "🆕";
      titulo = "NOVO AGENDAMENTO";
      break;
    case "cancelamento":
      emoji = "❌";
      titulo = "AGENDAMENTO CANCELADO";
      break;
    case "confirmacao":
      emoji = "✅";
      titulo = "AGENDAMENTO CONFIRMADO";
      break;
    case "conclusao":
      emoji = "🎉";
      titulo = "AGENDAMENTO CONCLUÍDO";
      break;
  }
  
  return `${emoji} *${titulo}* ${emoji}

━━━━━━━━━━━━━━━━━━━━
📋 *Detalhes do Agendamento*
━━━━━━━━━━━━━━━━━━━━

👤 *Cliente:* ${agendamento.nome}
📱 *WhatsApp:* ${agendamento.whatsapp}
📧 *Email:* ${agendamento.email}
✂️ *Serviço:* ${agendamento.servico}
📅 *Data:* ${formatDate(agendamento.data)}
🕐 *Horário:* ${agendamento.horario}
💰 *Valor:* ${formatCurrency(agendamento.valor)}
${agendamento.observacoes ? `📝 *Obs:* ${agendamento.observacoes}` : ''}

━━━━━━━━━━━━━━━━━━━━
⏰ ${new Date().toLocaleString('pt-BR')}
━━━━━━━━━━━━━━━━━━━━

🏆 *ZENTRIXIA Barbearia Premium*`;
};

export const sendWhatsAppNotification = async (
  type: NotificationType,
  agendamento: Agendamento,
  showToast: boolean = true
): Promise<{ success: boolean; message?: string }> => {
  try {
    console.log(`Sending WhatsApp notification: ${type}`, agendamento);
    
    // Gerar mensagem localmente
    const mensagem = generateMessage(type, agendamento);
    
    // Abrir WhatsApp em nova aba com a mensagem
    // Usar o link direto fornecido pelo usuário
    const whatsappUrl = `${OWNER_WHATSAPP_LINK}`;
    
    // Mostrar notificação na tela
    if (showToast) {
      let toastMessage = "";
      switch (type) {
        case "novo_agendamento":
          toastMessage = `🆕 Novo agendamento de ${agendamento.nome}!`;
          break;
        case "cancelamento":
          toastMessage = `❌ Agendamento de ${agendamento.nome} foi cancelado`;
          break;
        case "confirmacao":
          toastMessage = `✅ Agendamento de ${agendamento.nome} confirmado!`;
          break;
        case "conclusao":
          toastMessage = `🎉 Agendamento de ${agendamento.nome} concluído!`;
          break;
      }
      
      toast.success(toastMessage, {
        description: `${agendamento.servico} - ${formatDate(agendamento.data)} às ${agendamento.horario}`,
        duration: 8000,
        action: {
          label: "Abrir WhatsApp",
          onClick: () => window.open(whatsappUrl, '_blank')
        }
      });
    }

    return { success: true, message: mensagem };
  } catch (error: any) {
    console.error("Error sending WhatsApp notification:", error);
    if (showToast) {
      toast.error("Erro ao enviar notificação");
    }
    return { success: false };
  }
};

export const useWhatsAppNotify = () => {
  const notify = async (type: NotificationType, agendamento: Agendamento) => {
    return sendWhatsAppNotification(type, agendamento);
  };

  return { notify, sendWhatsAppNotification };
};
