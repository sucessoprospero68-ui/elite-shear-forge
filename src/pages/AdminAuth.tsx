import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Shield, Lock, Mail } from "lucide-react";
import { toast } from "sonner";

export default function AdminAuth() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      // Verificar se é admin
      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .eq('role', 'admin')
        .single();

      if (roles) {
        navigate('/admin');
      } else {
        toast.error('Acesso negado. Você não é administrador.');
        await supabase.auth.signOut();
      }
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Verificar se o usuário é admin
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', data.user.id)
        .eq('role', 'admin')
        .single();

      if (rolesError || !roles) {
        await supabase.auth.signOut();
        toast.error('Acesso negado. Você não é administrador.');
        return;
      }

      toast.success('Login realizado com sucesso!');
      navigate('/admin');
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
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/admin`,
        },
      });

      if (error) throw error;

      if (data.user) {
        toast.success('Conta criada com sucesso! Entre em contato com um administrador para obter acesso ao painel.');
        setIsSignup(false);
        setEmail('');
        setPassword('');
      }
    } catch (error: any) {
      if (error.message?.includes('already registered')) {
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
        redirectTo: `${window.location.origin}/admin/auth?reset=true`,
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
      navigate('/admin');
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
            <Shield className="w-8 h-8 text-gold" />
          </div>
          <h1 className="text-3xl font-heading text-white mb-2">
            Painel Administrativo
          </h1>
          <p className="text-muted-foreground text-center">
            {isForgotPassword ? 'Recuperar senha' : (isSignup ? 'Criar nova conta' : 'Entre com suas credenciais de admin')}
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
              placeholder="admin@barbearia.com"
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
            🔒 Acesso protegido com autenticação segura
          </p>
        </div>
      </Card>
    </div>
  );
}
