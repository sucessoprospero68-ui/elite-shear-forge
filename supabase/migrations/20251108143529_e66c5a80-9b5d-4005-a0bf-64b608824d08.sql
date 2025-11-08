-- Criar tabela de perfis de usuários
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome_completo TEXT,
  nome_negocio TEXT NOT NULL,
  whatsapp TEXT,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Habilitar RLS na tabela profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies para profiles: usuários podem ver e editar apenas seu próprio perfil
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Adicionar coluna owner_id à tabela agendamentos
ALTER TABLE public.agendamentos 
ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Remover as políticas antigas baseadas em admin
DROP POLICY IF EXISTS "Anyone can create appointments" ON public.agendamentos;
DROP POLICY IF EXISTS "Only admins can delete appointments" ON public.agendamentos;
DROP POLICY IF EXISTS "Only admins can update appointments" ON public.agendamentos;
DROP POLICY IF EXISTS "Only admins can view appointments" ON public.agendamentos;

-- Criar novas políticas baseadas em owner
CREATE POLICY "Users can view their own appointments"
  ON public.agendamentos FOR SELECT
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can create their own appointments"
  ON public.agendamentos FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own appointments"
  ON public.agendamentos FOR UPDATE
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own appointments"
  ON public.agendamentos FOR DELETE
  USING (auth.uid() = owner_id);

-- Public appointments: qualquer pessoa pode criar (para formulário público)
CREATE POLICY "Anyone can create appointments for business owners"
  ON public.agendamentos FOR INSERT
  WITH CHECK (owner_id IS NOT NULL);

-- Função para criar perfil automaticamente quando usuário se registra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, nome_negocio)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'nome_negocio', 'Meu Negócio')
  );
  RETURN NEW;
END;
$$;

-- Trigger para criar perfil automaticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Trigger para atualizar updated_at em profiles
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();