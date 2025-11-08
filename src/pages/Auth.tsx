import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { UserCircle, Lock, Mail, Building2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

const signupSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(12, "Senha deve ter pelo menos 12 caracteres"),
  nomeNegocio: z.string().min(3, "Nome do negócio deve ter pelo menos 3 caracteres"),
});

export default function Auth() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nomeNegocio, setNomeNegocio] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      navigate('/dashboard');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success('Login realizado com sucesso!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validar dados
      signupSchema.parse({ email, password, nomeNegocio });

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: {
            nome_negocio: nomeNegocio,
          },
        },
      });

      if (error) throw error;

      toast.success('Conta criada com sucesso! Você já pode fazer login.');
      setIsSignup(false);
      setEmail('');
      setPassword('');
      setNomeNegocio('');
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else if (error.message?.includes('already registered')) {
        toast.error('Este email já está cadastrado. Use o formulário de login.');
        setIsSignup(false);
      } else {
        toast.error(error.message || 'Erro ao criar conta');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?reset=true`,
      });

      if (error) throw error;

      toast.success('Email de recuperação enviado! Verifique sua caixa de entrada.');
      setIsForgotPassword(false);
    } catch (error: any) {
      toast.error(error.message || 'Erro ao enviar email de recuperação');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      toast.success('Senha atualizada com sucesso!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao atualizar senha');
    }
  };

  // Verificar se é redirect de reset de senha
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('reset') === 'true') {
      const newPassword = prompt('Digite sua nova senha (mínimo 12 caracteres):');
      if (newPassword && newPassword.length >= 12) {
        handleUpdatePassword(newPassword);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-black-deep flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 bg-gray-dark border-gold/20">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mb-4">
            <UserCircle className="w-8 h-8 text-gold" />
          </div>
          <h1 className="text-3xl font-heading text-white mb-2">
            {isSignup ? 'Criar Conta' : 'Bem-vindo'}
          </h1>
          <p className="text-muted-foreground text-center">
            {isForgotPassword 
              ? 'Recuperar senha' 
              : (isSignup 
                ? 'Cadastre seu negócio e comece a gerenciar agendamentos' 
                : 'Entre para acessar seu painel')}
          </p>
        </div>

        <form onSubmit={isForgotPassword ? handleForgotPassword : (isSignup ? handleSignup : handleLogin)} className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">
              <Mail className="w-4 h-4 inline mr-2" />
              Email
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-black-deep border-gold/20 text-white"
              placeholder="seu@email.com"
            />
          </div>

          {!isForgotPassword && (
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">
                <Lock className="w-4 h-4 inline mr-2" />
                Senha
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-black-deep border-gold/20 text-white"
                placeholder="Mínimo 12 caracteres"
                minLength={12}
              />
            </div>
          )}

          {isSignup && (
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">
                <Building2 className="w-4 h-4 inline mr-2" />
                Nome do Negócio
              </label>
              <Input
                type="text"
                value={nomeNegocio}
                onChange={(e) => setNomeNegocio(e.target.value)}
                required
                className="bg-black-deep border-gold/20 text-white"
                placeholder="Minha Barbearia Premium"
              />
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gold hover:bg-gold/90 text-black font-semibold"
          >
            {loading ? 'Processando...' : (isForgotPassword ? 'Enviar Email de Recuperação' : (isSignup ? 'Criar Conta' : 'Entrar'))}
          </Button>

          <div className="text-center space-y-2">
            {!isForgotPassword && !isSignup && (
              <button
                type="button"
                onClick={() => setIsForgotPassword(true)}
                className="text-sm text-muted-foreground hover:text-gold transition-colors block w-full"
              >
                Esqueceu a senha?
              </button>
            )}
            
            <button
              type="button"
              onClick={() => {
                setIsSignup(!isSignup);
                setIsForgotPassword(false);
              }}
              className="text-sm text-gold hover:text-gold/80 transition-colors block w-full"
            >
              {isSignup ? 'Já tem conta? Fazer login' : 'Não tem conta? Criar conta'}
            </button>

            {isForgotPassword && (
              <button
                type="button"
                onClick={() => setIsForgotPassword(false)}
                className="text-sm text-muted-foreground hover:text-gold transition-colors block w-full"
              >
                Voltar para login
              </button>
            )}
          </div>
        </form>

        <div className="mt-8 p-4 bg-gold/5 rounded-lg border border-gold/20">
          <p className="text-xs text-muted-foreground text-center">
            🔒 Seus dados estão protegidos com criptografia de ponta a ponta
          </p>
        </div>
      </Card>
    </div>
  );
}
