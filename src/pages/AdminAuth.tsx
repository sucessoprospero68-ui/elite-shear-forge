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
      // Verificar se já existe algum admin
      const { data: existingAdmins } = await supabase
        .from('user_roles')
        .select('id')
        .eq('role', 'admin')
        .limit(1);

      if (existingAdmins && existingAdmins.length > 0) {
        toast.error('Já existe um administrador. Entre em contato com o admin atual.');
        setIsSignup(false);
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/admin`,
        },
      });

      if (error) throw error;

      if (data.user) {
        // Criar role de admin para o primeiro usuário
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: data.user.id,
            role: 'admin',
          });

        if (roleError) throw roleError;

        toast.success('Conta admin criada com sucesso! Fazendo login...');
        
        // Fazer login automaticamente
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) throw signInError;

        navigate('/admin');
      }
    } catch (error: any) {
      toast.error(error.message || 'Erro ao criar conta admin');
    } finally {
      setLoading(false);
    }
  };

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
            {isSignup ? 'Criar primeira conta admin' : 'Entre com suas credenciais'}
          </p>
        </div>

        <form onSubmit={isSignup ? handleSignup : handleLogin} className="space-y-4">
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
              placeholder="••••••••"
              minLength={6}
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gold hover:bg-gold/90 text-black font-semibold"
          >
            {loading ? 'Processando...' : (isSignup ? 'Criar Conta Admin' : 'Entrar')}
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsSignup(!isSignup)}
              className="text-sm text-gold hover:text-gold/80 transition-colors"
            >
              {isSignup ? 'Já tem conta? Fazer login' : 'Primeira vez? Criar conta admin'}
            </button>
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
