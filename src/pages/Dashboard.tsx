import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  LogOut,
  Phone,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  User,
  Building2
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

interface Profile {
  nome_negocio: string;
  whatsapp: string | null;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/auth');
        return;
      }

      setUserId(session.user.id);
      await loadProfile(session.user.id);
      await loadAgendamentos(session.user.id);
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      navigate('/auth');
    } finally {
      setLoading(false);
    }
  };

  const loadProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('nome_negocio, whatsapp')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Erro ao carregar perfil:', error);
      return;
    }

    setProfile(data);
  };

  const loadAgendamentos = async (userId: string) => {
    const { data, error } = await supabase
      .from('agendamentos')
      .select('*')
      .eq('owner_id', userId)
      .order('data', { ascending: true })
      .order('horario', { ascending: true });

    if (error) {
      toast.error("Erro ao carregar agendamentos");
      console.error(error);
      return;
    }

    setAgendamentos(data || []);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logout realizado com sucesso");
    navigate('/auth');
  };

  const updateStatus = async (id: string, newStatus: string) => {
    if (!userId) return;

    const { error } = await supabase
      .from('agendamentos')
      .update({ status: newStatus })
      .eq('id', id)
      .eq('owner_id', userId);

    if (error) {
      toast.error("Erro ao atualizar status");
      return;
    }

    toast.success("Status atualizado com sucesso!");
    loadAgendamentos(userId);
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
  
  // Relatório Diário
  const hoje = new Date().toISOString().split('T')[0];
  const agendamentosHoje = agendamentos.filter(ag => ag.data === hoje);
  const faturamentoHoje = agendamentosHoje
    .filter(ag => ag.status === "concluido")
    .reduce((sum, ag) => sum + Number(ag.valor), 0);
  const confirmadosHoje = agendamentosHoje.filter(ag => ag.status === "confirmado").length;
  
  // Relatório Semanal
  const getStartOfWeek = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Ajusta para segunda-feira
    return new Date(d.setDate(diff)).toISOString().split('T')[0];
  };
  
  const startOfWeek = getStartOfWeek(new Date());
  const startOfLastWeek = getStartOfWeek(new Date(new Date().setDate(new Date().getDate() - 7)));
  
  const agendamentosSemana = agendamentos.filter(ag => ag.data >= startOfWeek);
  const faturamentoSemana = agendamentosSemana
    .filter(ag => ag.status === "concluido")
    .reduce((sum, ag) => sum + Number(ag.valor), 0);
  
  const agendamentosSemanaPassada = agendamentos.filter(
    ag => ag.data >= startOfLastWeek && ag.data < startOfWeek
  );
  const faturamentoSemanaPassada = agendamentosSemanaPassada
    .filter(ag => ag.status === "concluido")
    .reduce((sum, ag) => sum + Number(ag.valor), 0);
  
  const variacaoSemanal = agendamentosSemanaPassada.length > 0
    ? ((agendamentosSemana.length - agendamentosSemanaPassada.length) / agendamentosSemanaPassada.length * 100)
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-gold text-xl">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 p-6 bg-card border border-gold/20 rounded-lg">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-gold" />
            </div>
            <div>
              <h1 className="text-3xl font-heading">
                {profile?.nome_negocio || "Dashboard"}
              </h1>
              <p className="text-sm text-muted-foreground">Gerenciamento de agendamentos</p>
            </div>
          </div>
          <Button onClick={handleLogout} variant="outline" className="gap-2 border-gold/20 text-gold hover:bg-gold/10">
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
                <p className="text-3xl font-price text-gold">R${faturamentoTotal.toFixed(2)}</p>
              </div>
              <DollarSign className="w-10 h-10 text-gold" />
            </div>
          </Card>

          <Card className="p-6 bg-card border-gold/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Hoje</p>
                <p className="text-3xl font-price text-gold">{agendamentosHoje.length}</p>
              </div>
              <Clock className="w-10 h-10 text-gold" />
            </div>
          </Card>

          <Card className="p-6 bg-card border-gold/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Confirmados</p>
                <p className="text-3xl font-price text-gold">
                  {agendamentos.filter(ag => ag.status === "confirmado").length}
                </p>
              </div>
              <TrendingUp className="w-10 h-10 text-gold" />
            </div>
          </Card>
        </div>

        {/* Relatórios Diário e Semanal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Relatório Diário */}
          <Card className="p-6 bg-card border-gold/20">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-6 h-6 text-gold" />
              <h2 className="text-xl font-heading text-gold">Relatório Diário</h2>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <span className="text-sm text-muted-foreground">Total de Agendamentos</span>
                <span className="text-lg font-semibold text-gold">{agendamentosHoje.length}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <span className="text-sm text-muted-foreground">Confirmados</span>
                <span className="text-lg font-semibold text-green-500">{confirmadosHoje}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <span className="text-sm text-muted-foreground">Pendentes</span>
                <span className="text-lg font-semibold text-yellow-500">
                  {agendamentosHoje.filter(ag => ag.status === "pendente").length}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gradient-gold/10 border border-gold/20 rounded-lg">
                <span className="text-sm font-semibold">Faturamento Hoje</span>
                <span className="text-xl font-price text-gold">R${faturamentoHoje.toFixed(2)}</span>
              </div>
            </div>
          </Card>

          {/* Relatório Semanal */}
          <Card className="p-6 bg-card border-gold/20">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-6 h-6 text-gold" />
              <h2 className="text-xl font-heading text-gold">Relatório Semanal</h2>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <span className="text-sm text-muted-foreground">Esta Semana</span>
                <span className="text-lg font-semibold text-gold">{agendamentosSemana.length}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <span className="text-sm text-muted-foreground">Semana Passada</span>
                <span className="text-lg font-semibold text-muted-foreground">
                  {agendamentosSemanaPassada.length}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <span className="text-sm text-muted-foreground">Variação</span>
                <span className={`text-lg font-semibold ${variacaoSemanal >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {variacaoSemanal >= 0 ? '+' : ''}{variacaoSemanal.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gradient-gold/10 border border-gold/20 rounded-lg">
                <span className="text-sm font-semibold">Faturamento Semana</span>
                <span className="text-xl font-price text-gold">R${faturamentoSemana.toFixed(2)}</span>
              </div>
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

            <div className="flex gap-2 flex-wrap">
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
            {filteredAgendamentos.length === 0 ? (
              <div className="p-12 text-center">
                <User className="w-16 h-16 text-gold/30 mx-auto mb-4" />
                <p className="text-lg text-muted-foreground">
                  {agendamentos.length === 0 
                    ? "Nenhum agendamento ainda. Compartilhe seu link para começar a receber agendamentos!"
                    : "Nenhum agendamento encontrado com os filtros aplicados."}
                </p>
              </div>
            ) : (
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
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
