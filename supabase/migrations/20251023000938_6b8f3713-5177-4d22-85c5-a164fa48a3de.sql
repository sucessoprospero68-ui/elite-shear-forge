-- Criar tabela de agendamentos
CREATE TABLE IF NOT EXISTS public.agendamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  email TEXT NOT NULL,
  servico TEXT NOT NULL,
  data DATE NOT NULL,
  horario TIME NOT NULL,
  status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'confirmado', 'concluido', 'cancelado')),
  valor DECIMAL(10,2) NOT NULL,
  observacoes TEXT,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE public.agendamentos ENABLE ROW LEVEL SECURITY;

-- Política para permitir que todos vejam agendamentos (necessário para o site público)
CREATE POLICY "Permitir leitura pública de agendamentos"
  ON public.agendamentos
  FOR SELECT
  USING (true);

-- Política para permitir inserção pública (formulário de agendamento)
CREATE POLICY "Permitir inserção pública de agendamentos"
  ON public.agendamentos
  FOR INSERT
  WITH CHECK (true);

-- Política para permitir admin atualizar agendamentos
CREATE POLICY "Admin pode atualizar agendamentos"
  ON public.agendamentos
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_agendamentos_data ON public.agendamentos(data);
CREATE INDEX IF NOT EXISTS idx_agendamentos_status ON public.agendamentos(status);
CREATE INDEX IF NOT EXISTS idx_agendamentos_criado_em ON public.agendamentos(criado_em DESC);

-- Habilitar realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.agendamentos;