import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { 
  Calendar, 
  DollarSign, 
  Users, 
  TrendingUp, 
  LogOut,
  Phone,
  CheckCircle2,
  XCircle,
  Clock,
  Search
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Agendamento {
  id: string;
  nome: string;
  whatsapp: string;
  email: string;
  servico: string;
  data: string;
  horario: string;
  status: string;
  valor: number;
  criado_em: string;
}

export default function Admin() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");

  useEffect(() => {
    const loggedIn = sessionStorage.getItem("adminLoggedIn");
    if (loggedIn === "true") {
      setIsLoggedIn(true);
      loadAgendamentos();
    }
  }, []);

  const loadAgendamentos = async () => {
    const { data, error } = await supabase
      .from('agendamentos')
      .select('*')
      .order('data', { ascending: true })
      .order('horario', { ascending: true });

    if (error) {
      toast.error("Erro ao carregar agendamentos");
      return;
    }

    setAgendamentos(data || []);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "admin" && password === "barber2024") {
      setIsLoggedIn(true);
      sessionStorage.setItem("adminLoggedIn", "true");
      toast.success("Login realizado com sucesso!");
      loadAgendamentos();
    } else {
      toast.error("Usuário ou senha incorretos");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem("adminLoggedIn");
    navigate("/");
  };

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from('agendamentos')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      toast.error("Erro ao atualizar status");
      return;
    }

    toast.success("Status atualizado com sucesso!");
    loadAgendamentos();
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", label: string }> = {
      pendente: { variant: "outline", label: "Pendente" },
      confirmado: { variant: "default", label: "Confirmado" },
      concluido: { variant: "secondary", label: "Concluído" },
      cancelado: { variant: "destructive", label: "Cancelado" }
    };
    return variants[status] || variants.pendente;
  };

  const filteredAgendamentos = agendamentos.filter(ag => {
    const matchesSearch = ag.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          ag.whatsapp.includes(searchTerm) ||
                          ag.servico.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "todos" || ag.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalAgendamentos = agendamentos.length;
  const faturamentoTotal = agendamentos
    .filter(ag => ag.status === "concluido")
    .reduce((sum, ag) => sum + Number(ag.valor), 0);
  const agendamentosHoje = agendamentos.filter(ag => 
    ag.data === new Date().toISOString().split('T')[0]
  ).length;

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md p-8 bg-card border-gold/20">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-heading mb-2">
              Painel <span className="text-gradient-gold">Administrativo</span>
            </h1>
            <p className="text-muted-foreground">Entre com suas credenciais</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Usuário</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-muted border-gold/20"
                placeholder="admin"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-muted border-gold/20"
                placeholder="barber2024"
                required
              />
            </div>

            <Button type="submit" className="w-full btn-gold">
              Entrar
            </Button>
          </form>

          <Button 
            variant="ghost" 
            className="w-full mt-4"
            onClick={() => navigate("/")}
          >
            Voltar para o site
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-heading">
            Painel <span className="text-gradient-gold">Administrativo</span>
          </h1>
          <Button onClick={handleLogout} variant="outline" className="gap-2">
            <LogOut className="w-4 h-4" />
            Sair
          </Button>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-card border-gold/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Agendamentos</p>
                <p className="text-3xl font-price text-gold">{totalAgendamentos}</p>
              </div>
              <Calendar className="w-10 h-10 text-gold" />
            </div>
          </Card>

          <Card className="p-6 bg-card border-gold/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Faturamento</p>
                <p className="text-3xl font-price text-gold">R${faturamentoTotal}</p>
              </div>
              <DollarSign className="w-10 h-10 text-gold" />
            </div>
          </Card>

          <Card className="p-6 bg-card border-gold/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Hoje</p>
                <p className="text-3xl font-price text-gold">{agendamentosHoje}</p>
              </div>
              <Clock className="w-10 h-10 text-gold" />
            </div>
          </Card>

          <Card className="p-6 bg-card border-gold/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Rating Médio</p>
                <p className="text-3xl font-price text-gold">4.9</p>
              </div>
              <TrendingUp className="w-10 h-10 text-gold" />
            </div>
          </Card>
        </div>

        {/* Filtros */}
        <Card className="p-6 bg-card border-gold/20 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, telefone ou serviço..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-muted border-gold/20"
              />
            </div>

            <div className="flex gap-2">
              {["todos", "pendente", "confirmado", "concluido", "cancelado"].map((status) => (
                <Button
                  key={status}
                  variant={statusFilter === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter(status)}
                  className={statusFilter === status ? "bg-gradient-gold text-black-deep" : ""}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </Card>

        {/* Tabela */}
        <Card className="bg-card border-gold/20">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gold/10">
                  <TableHead>Cliente</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Serviço</TableHead>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAgendamentos.map((agendamento) => {
                  const statusInfo = getStatusBadge(agendamento.status);
                  return (
                    <TableRow key={agendamento.id} className="border-gold/10">
                      <TableCell className="font-medium">{agendamento.nome}</TableCell>
                      <TableCell>
                        <a 
                          href={`https://wa.me/55${agendamento.whatsapp.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-gold hover:text-gold-dark transition-colors"
                        >
                          <Phone className="w-4 h-4" />
                          {agendamento.whatsapp}
                        </a>
                      </TableCell>
                      <TableCell>{agendamento.servico}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-semibold">
                            {new Date(agendamento.data + 'T00:00:00').toLocaleDateString('pt-BR')}
                          </div>
                          <div className="text-sm text-muted-foreground">{agendamento.horario}</div>
                        </div>
                      </TableCell>
                      <TableCell className="font-price text-gold text-lg">
                        R${agendamento.valor}
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusInfo.variant}>
                          {statusInfo.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {agendamento.status === "pendente" && (
                            <Button
                              size="sm"
                              onClick={() => updateStatus(agendamento.id, "confirmado")}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </Button>
                          )}
                          {agendamento.status !== "cancelado" && (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => updateStatus(agendamento.id, "cancelado")}
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          )}
                          {agendamento.status === "confirmado" && (
                            <Button
                              size="sm"
                              onClick={() => updateStatus(agendamento.id, "concluido")}
                              className="btn-gold"
                            >
                              Concluir
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  );
}
