-- Atualizar policies para permitir agendamentos públicos sem owner_id
-- Manter as policies existentes e adicionar uma para inserções públicas

DROP POLICY IF EXISTS "Anyone can create appointments for business owners" ON public.agendamentos;

CREATE POLICY "Public can create appointments without owner"
  ON public.agendamentos FOR INSERT
  WITH CHECK (owner_id IS NULL);

CREATE POLICY "Public can create appointments with owner"
  ON public.agendamentos FOR INSERT
  WITH CHECK (owner_id IS NOT NULL);