-- Criar enum para roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Criar tabela de roles de usuários
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (user_id, role)
);

-- Enable RLS na tabela user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Policy para admins verem todos os roles
CREATE POLICY "Admins can view all user roles"
ON public.user_roles
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
  )
);

-- Criar função security definer para verificar role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Remover políticas antigas da tabela agendamentos
DROP POLICY IF EXISTS "Permitir leitura pública de agendamentos" ON public.agendamentos;
DROP POLICY IF EXISTS "Permitir inserção pública de agendamentos" ON public.agendamentos;
DROP POLICY IF EXISTS "Admin pode atualizar agendamentos" ON public.agendamentos;

-- Nova policy: Permitir INSERT público (para clientes agendarem)
CREATE POLICY "Anyone can create appointments"
ON public.agendamentos
FOR INSERT
WITH CHECK (true);

-- Nova policy: Apenas admins podem ver agendamentos (proteger dados sensíveis)
CREATE POLICY "Only admins can view appointments"
ON public.agendamentos
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Nova policy: Apenas admins podem atualizar agendamentos
CREATE POLICY "Only admins can update appointments"
ON public.agendamentos
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Nova policy: Apenas admins podem deletar agendamentos
CREATE POLICY "Only admins can delete appointments"
ON public.agendamentos
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Inserir um usuário admin padrão (você precisará criar este usuário no Supabase Auth depois)
-- Este é apenas um placeholder - você precisará criar o usuário real via Supabase Auth
COMMENT ON TABLE public.user_roles IS 'Para criar um admin: 1) Registre um usuário via Supabase Auth, 2) Insira um registro aqui com o user_id e role=admin';