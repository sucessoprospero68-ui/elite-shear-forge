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
  Shield,
  Users,
  PlayCircle,
  Mail,
  Building2,
  AlertTriangle,
  BadgeCheck
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

interface DemoTrial {
  id: string;
  email: string;
  nome: string | null;
  nome_negocio: string | null;
  whatsapp: string | null;
  data_inicio: string;
  data_expiracao: string;
  status: string;
  origem: string | null;
  acessos: number;
  ultimo_acesso: string | null;
  convertido_em: string | null;
  valor_conversao: number | null;
  criado_em: string;
}

export default function Admin() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [demoTrials, setDemoTrials] = useState<DemoTrial[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [demoStatusFilter, setDemoStatusFilter] = useState("todos");
  const [activeTab, setActiveTab] = useState("agendamentos");

  useEffect(() => {
    checkAdminAuth();
  }, []);

  const checkAdminAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/admin/auth');
        return;
      }

      // Verificar se o usuário é admin
      const { data: roles, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .eq('role', 'admin')
        .single();

      if (error || !roles) {
        toast.error('Acesso negado. Você não é administrador.');
        await supabase.auth.signOut();
        navigate('/admin/auth');
        return;
      }

      setIsAdmin(true);
      loadAgendamentos();
      loadDemoTrials();
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      navigate('/admin/auth');
    } finally {
      setLoading(false);
    }
  };

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

  const loadDemoTrials = async () => {
    const { data, error } = await supabase
      .from('demo_trials')
      .select('*')
      .order('criado_em', { ascending: false });

    if (error) {
      console.error("Erro ao carregar demos:", error);
      return;
    }

    setDemoTrials(data || []);
  };

  const updateDemoStatus = async (id: string, newStatus: string) => {
    const updateData: Record<string, any> = { status: newStatus };
    
    if (newStatus === 'convertido') {
      updateData.convertido_em = new Date().toISOString();
    }

    const { error } = await supabase
      .from('demo_trials')
      .update(updateData)
      .eq('id', id);

    if (error) {
      toast.error("Erro ao atualizar status do demo");
      return;
    }

    toast.success("Status atualizado!");
    loadDemoTrials();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logout realizado com sucesso");
    navigate('/admin/auth');
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

  const filteredDemoTrials = demoTrials.filter(demo => {
    const matchesSearch = 
      (demo.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (demo.nome?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (demo.nome_negocio?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (demo.whatsapp || '').includes(searchTerm);
    const matchesStatus = demoStatusFilter === "todos" || demo.status === demoStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalAgendamentos = agendamentos.length;
  const faturamentoTotal = agendamentos
    .filter(ag => ag.status === "concluido")
    .reduce((sum, ag) => sum + Number(ag.valor), 0);
  const agendamentosHoje = agendamentos.filter(ag => 
    ag.data === new Date().toISOString().split('T')[0]
  ).length;

  // Stats de demos
  const totalDemos = demoTrials.length;
  const demosAtivos = demoTrials.filter(d => d.status === 'ativo').length;
  const demosConvertidos = demoTrials.filter(d => d.status === 'convertido').length;
  const demosExpirados = demoTrials.filter(d => d.status === 'expirado').length;
  const taxaConversao = totalDemos > 0 ? ((demosConvertidos / totalDemos) * 100).toFixed(1) : '0';

  const getDemoStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", label: string, color: string }> = {
      ativo: { variant: "default", label: "Ativo", color: "bg-green-500" },
      expirado: { variant: "outline", label: "Expirado", color: "bg-yellow-500" },
      convertido: { variant: "secondary", label: "Convertido", color: "bg-blue-500" },
      cancelado: { variant: "destructive", label: "Cancelado", color: "bg-red-500" }
    };
    return variants[status] || variants.ativo;
  };

  const getDaysLeft = (dataExpiracao: string) => {
    const expDate = new Date(dataExpiracao);
    const now = new Date();
    const diff = expDate.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-gold text-xl">Carregando...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 p-6 bg-card border border-gold/20 rounded-lg">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center">
              <Shield className="w-6 h-6 text-gold" />
            </div>
            <div>
              <h1 className="text-3xl font-heading">
                Painel <span className="text-gradient-gold">Administrativo</span>
              </h1>
              <p className="text-sm text-muted-foreground">Gerenciamento completo do sistema</p>
            </div>
          </div>
          <Button onClick={handleLogout} variant="outline" className="gap-2 border-gold/20 text-gold hover:bg-gold/10">
            <LogOut className="w-4 h-4" />
            Sair
          </Button>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full max-w-md grid-cols-2 bg-card border border-gold/20">
            <TabsTrigger value="agendamentos" className="data-[state=active]:bg-gold data-[state=active]:text-black">
              <Calendar className="w-4 h-4 mr-2" />
              Agendamentos
            </TabsTrigger>
            <TabsTrigger value="demos" className="data-[state=active]:bg-gold data-[state=active]:text-black">
              <PlayCircle className="w-4 h-4 mr-2" />
              Demos ({totalDemos})
            </TabsTrigger>
          </TabsList>

          {/* Tab Agendamentos */}
          <TabsContent value="agendamentos">
            {/* Métricas de Agendamentos */}
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

            {/* Filtros Agendamentos */}
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

            {/* Tabela Agendamentos */}
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
          </TabsContent>

          {/* Tab Demos */}
          <TabsContent value="demos">
            {/* Métricas de Demos */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
              <Card className="p-6 bg-card border-gold/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Demos</p>
                    <p className="text-3xl font-price text-gold">{totalDemos}</p>
                  </div>
                  <Users className="w-10 h-10 text-gold" />
                </div>
              </Card>

              <Card className="p-6 bg-card border-green-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Ativos</p>
                    <p className="text-3xl font-price text-green-500">{demosAtivos}</p>
                  </div>
                  <PlayCircle className="w-10 h-10 text-green-500" />
                </div>
              </Card>

              <Card className="p-6 bg-card border-blue-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Convertidos</p>
                    <p className="text-3xl font-price text-blue-500">{demosConvertidos}</p>
                  </div>
                  <BadgeCheck className="w-10 h-10 text-blue-500" />
                </div>
              </Card>

              <Card className="p-6 bg-card border-yellow-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Expirados</p>
                    <p className="text-3xl font-price text-yellow-500">{demosExpirados}</p>
                  </div>
                  <AlertTriangle className="w-10 h-10 text-yellow-500" />
                </div>
              </Card>

              <Card className="p-6 bg-card border-primary/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Taxa Conversão</p>
                    <p className="text-3xl font-price text-primary">{taxaConversao}%</p>
                  </div>
                  <TrendingUp className="w-10 h-10 text-primary" />
                </div>
              </Card>
            </div>

            {/* Filtros Demos */}
            <Card className="p-6 bg-card border-gold/20 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por email, nome ou negócio..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-muted border-gold/20"
                  />
                </div>

                <div className="flex gap-2 flex-wrap">
                  {["todos", "ativo", "expirado", "convertido", "cancelado"].map((status) => (
                    <Button
                      key={status}
                      variant={demoStatusFilter === status ? "default" : "outline"}
                      size="sm"
                      onClick={() => setDemoStatusFilter(status)}
                      className={demoStatusFilter === status ? "bg-gradient-gold text-black-deep" : ""}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
            </Card>

            {/* Tabela Demos */}
            <Card className="bg-card border-gold/20">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gold/10">
                      <TableHead>Email</TableHead>
                      <TableHead>Nome/Negócio</TableHead>
                      <TableHead>WhatsApp</TableHead>
                      <TableHead>Início</TableHead>
                      <TableHead>Dias Restantes</TableHead>
                      <TableHead>Acessos</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDemoTrials.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                          Nenhum demo encontrado
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredDemoTrials.map((demo) => {
                        const statusInfo = getDemoStatusBadge(demo.status);
                        const daysLeft = getDaysLeft(demo.data_expiracao);
                        return (
                          <TableRow key={demo.id} className="border-gold/10">
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-muted-foreground" />
                                <span className="font-medium">{demo.email}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <div className="font-semibold">{demo.nome || '-'}</div>
                                <div className="text-sm text-muted-foreground flex items-center gap-1">
                                  <Building2 className="w-3 h-3" />
                                  {demo.nome_negocio || '-'}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              {demo.whatsapp ? (
                                <a 
                                  href={`https://wa.me/55${demo.whatsapp.replace(/\D/g, '')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 text-gold hover:text-gold-dark transition-colors"
                                >
                                  <Phone className="w-4 h-4" />
                                  {demo.whatsapp}
                                </a>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                {new Date(demo.data_inicio).toLocaleDateString('pt-BR')}
                              </div>
                            </TableCell>
                            <TableCell>
                              {demo.status === 'ativo' ? (
                                <span className={`font-bold ${daysLeft <= 2 ? 'text-destructive' : daysLeft <= 4 ? 'text-yellow-500' : 'text-green-500'}`}>
                                  {daysLeft > 0 ? `${daysLeft} dias` : 'Expirando hoje'}
                                </span>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <span className="font-price">{demo.acessos}</span>
                            </TableCell>
                            <TableCell>
                              <Badge variant={statusInfo.variant}>
                                {statusInfo.label}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                {demo.status === 'ativo' && (
                                  <>
                                    <Button
                                      size="sm"
                                      onClick={() => updateDemoStatus(demo.id, "convertido")}
                                      className="bg-blue-600 hover:bg-blue-700"
                                      title="Marcar como convertido"
                                    >
                                      <BadgeCheck className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() => updateDemoStatus(demo.id, "cancelado")}
                                      title="Cancelar demo"
                                    >
                                      <XCircle className="w-4 h-4" />
                                    </Button>
                                  </>
                                )}
                                {demo.status === 'expirado' && (
                                  <Button
                                    size="sm"
                                    onClick={() => updateDemoStatus(demo.id, "convertido")}
                                    className="bg-blue-600 hover:bg-blue-700"
                                    title="Marcar como convertido"
                                  >
                                    <BadgeCheck className="w-4 h-4" />
                                  </Button>
                                )}
                                {demo.whatsapp && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-green-500/50 text-green-500 hover:bg-green-500/10"
                                    onClick={() => window.open(`https://wa.me/55${demo.whatsapp?.replace(/\D/g, '')}?text=Olá ${demo.nome || ''}! Vi que você testou nosso sistema de agendamento. Posso te ajudar?`, '_blank')}
                                    title="Contatar via WhatsApp"
                                  >
                                    <Phone className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
