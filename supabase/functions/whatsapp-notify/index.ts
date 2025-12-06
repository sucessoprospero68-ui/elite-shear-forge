import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.76.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Link do WhatsApp fornecido pelo usuário
const WHATSAPP_LINK = "https://wa.me/message/LZQJBTUALFUYE1";

interface NotificationPayload {
  type: "novo_agendamento" | "cancelamento" | "confirmacao" | "conclusao";
  agendamento: {
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
  };
}

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

const generateWhatsAppMessage = (payload: NotificationPayload): string => {
  const { type, agendamento } = payload;
  
  let emoji = "";
  let titulo = "";
  let acao = "";
  
  switch (type) {
    case "novo_agendamento":
      emoji = "🆕";
      titulo = "NOVO AGENDAMENTO";
      acao = "foi criado";
      break;
    case "cancelamento":
      emoji = "❌";
      titulo = "AGENDAMENTO CANCELADO";
      acao = "foi cancelado";
      break;
    case "confirmacao":
      emoji = "✅";
      titulo = "AGENDAMENTO CONFIRMADO";
      acao = "foi confirmado";
      break;
    case "conclusao":
      emoji = "🎉";
      titulo = "AGENDAMENTO CONCLUÍDO";
      acao = "foi concluído";
      break;
  }
  
  const mensagem = `${emoji} *${titulo}* ${emoji}

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
⏰ Notificação enviada em: ${new Date().toLocaleString('pt-BR')}
━━━━━━━━━━━━━━━━━━━━

🏆 *ZENTRIXIA Barbearia Premium*`;

  return mensagem;
};

const handler = async (req: Request): Promise<Response> => {
  console.log("WhatsApp Notify function called");
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload: NotificationPayload = await req.json();
    console.log("Received payload:", JSON.stringify(payload, null, 2));

    // Gerar mensagem formatada
    const mensagem = generateWhatsAppMessage(payload);
    console.log("Generated message:", mensagem);

    // Criar link do WhatsApp com a mensagem
    // Extrair número do link fornecido (o link já está configurado)
    const whatsappUrl = `${WHATSAPP_LINK}`;
    
    // Retornar a mensagem e URL para o frontend processar
    return new Response(
      JSON.stringify({
        success: true,
        message: mensagem,
        whatsappUrl: whatsappUrl,
        encodedMessage: encodeURIComponent(mensagem),
        type: payload.type
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in whatsapp-notify function:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);
