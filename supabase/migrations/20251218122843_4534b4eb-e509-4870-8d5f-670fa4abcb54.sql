-- Criar tabela para rastrear usuários em demo
CREATE TABLE public.demo_trials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  nome TEXT,
  nome_negocio TEXT,
  whatsapp TEXT,
  data_inicio TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  data_expiracao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '7 days'),
  status TEXT NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'expirado', 'convertido', 'cancelado')),
  origem TEXT DEFAULT 'pagina_vendas',
  ip_address TEXT,
  user_agent TEXT,
  acessos INTEGER DEFAULT 1,
  ultimo_acesso TIMESTAMP WITH TIME ZONE DEFAULT now(),
  convertido_em TIMESTAMP WITH TIME ZONE,
  valor_conversao NUMERIC,
  observacoes TEXT,
  criado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.demo_trials ENABLE ROW LEVEL SECURITY;

-- Política para admins verem todos os demos
CREATE POLICY "Admins can view all demo trials"
ON public.demo_trials
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Política para admins atualizarem demos
CREATE POLICY "Admins can update demo trials"
ON public.demo_trials
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- Política para admins deletarem demos
CREATE POLICY "Admins can delete demo trials"
ON public.demo_trials
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Política para inserção pública (quando alguém inicia demo)
CREATE POLICY "Anyone can start a demo trial"
ON public.demo_trials
FOR INSERT
WITH CHECK (true);

-- Política para usuário ver seu próprio demo
CREATE POLICY "Users can view their own demo trial"
ON public.demo_trials
FOR SELECT
USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- Índices para performance
CREATE INDEX idx_demo_trials_email ON public.demo_trials(email);
CREATE INDEX idx_demo_trials_status ON public.demo_trials(status);
CREATE INDEX idx_demo_trials_data_expiracao ON public.demo_trials(data_expiracao);

-- Função para atualizar status automaticamente
CREATE OR REPLACE FUNCTION public.update_expired_demos()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.demo_trials
  SET status = 'expirado'
  WHERE status = 'ativo'
    AND data_expiracao < now();
END;
$$;