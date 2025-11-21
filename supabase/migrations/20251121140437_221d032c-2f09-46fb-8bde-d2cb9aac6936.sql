-- Criar perfil para o usuário do painel (se não existir)
INSERT INTO public.profiles (id, email, nome_negocio)
VALUES (
  'f8de8fa6-e8ed-41d3-8fc8-2aded8d71682',
  'multflaviopassivo@gmail.com',
  'ZENTRIXIA Barbearia Premium'
)
ON CONFLICT (id) DO UPDATE
SET email = EXCLUDED.email,
    nome_negocio = EXCLUDED.nome_negocio;