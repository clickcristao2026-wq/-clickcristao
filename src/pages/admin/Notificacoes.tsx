import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Bell, Send, Plus, Clock, Users, AlertCircle, CheckCircle, Info } from "lucide-react";
import { useState } from "react";

const meses = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const notificacoesEnviadas = [
  {
    id: 1,
    titulo: "Promoção Especial de Natal",
    mensagem: "Aproveite até 50% de desconto em livros cristãos!",
    tipo: "promocao",
    destino: "Todos os usuários",
    dataEnvio: "02/02/2026 14:30",
    lidas: 1250,
    total: 1500
  },
  {
    id: 2,
    titulo: "Atualização da Plataforma",
    mensagem: "Novos recursos disponíveis para vendedores.",
    tipo: "sistema",
    destino: "Vendedores",
    dataEnvio: "01/02/2026 10:00",
    lidas: 89,
    total: 120
  },
  {
    id: 3,
    titulo: "Manutenção Programada",
    mensagem: "A plataforma estará em manutenção das 02h às 04h.",
    tipo: "alerta",
    destino: "Todos os usuários",
    dataEnvio: "30/01/2026 18:00",
    lidas: 980,
    total: 1500
  },
];

const AdminNotificacoes = () => {
  const [showForm, setShowForm] = useState(false);
  const [mesSelecionado, setMesSelecionado] = useState("Fevereiro");

  const getTipoBadge = (tipo: string) => {
    switch (tipo) {
      case "promocao":
        return <Badge className="bg-green-500">Promoção</Badge>;
      case "sistema":
        return <Badge className="bg-blue-500">Sistema</Badge>;
      case "alerta":
        return <Badge className="bg-yellow-500">Alerta</Badge>;
      default:
        return <Badge variant="outline">{tipo}</Badge>;
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case "promocao":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "sistema":
        return <Info className="h-5 w-5 text-blue-600" />;
      case "alerta":
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <AdminLayout title="Notificações">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <p className="text-muted-foreground">
            Emitir notificações para os usuários da plataforma
          </p>
          <div className="flex items-center gap-3">
            <Select value={mesSelecionado} onValueChange={setMesSelecionado}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Mês" />
              </SelectTrigger>
              <SelectContent>
                {meses.map((mes) => (
                  <SelectItem key={mes} value={mes}>{mes}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={() => setShowForm(!showForm)} className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Nova Notificação
            </Button>
          </div>
        </div>

        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>Emitir Nova Notificação</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Título</Label>
                  <Input placeholder="Ex: Promoção Especial" />
                </div>
                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="promocao">Promoção</SelectItem>
                      <SelectItem value="sistema">Sistema</SelectItem>
                      <SelectItem value="alerta">Alerta</SelectItem>
                      <SelectItem value="info">Informativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Tipo de Usuário</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="consumidor">Consumidor</SelectItem>
                      <SelectItem value="vendedor">Vendedor</SelectItem>
                      <SelectItem value="anunciante">Anunciante</SelectItem>
                      <SelectItem value="afiliado">Afiliado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Buscar Usuário</Label>
                  <Input placeholder="Nome ou email do usuário" />
                </div>
                <div className="space-y-2">
                  <Label>Agendamento</Label>
                  <Input type="datetime-local" />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label>Mensagem</Label>
                  <Textarea placeholder="Digite a mensagem da notificação..." rows={4} />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setShowForm(false)}>
                  Cancelar
                </Button>
                <Button className="bg-primary hover:bg-primary/90">
                  <Send className="h-4 w-4 mr-2" />
                  Enviar Notificação
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">
              <strong>⚡ Sincronização:</strong> Notificações sincronizadas com a área de Notificações dos Usuários na plataforma.
            </p>
          </CardContent>
        </Card>

        {/* Cards de resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-blue-100">
                  <Bell className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">24</p>
                  <p className="text-sm text-muted-foreground">Enviadas este mês</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-green-100">
                  <Users className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">1.500</p>
                  <p className="text-sm text-muted-foreground">Usuários Alcançados</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-purple-100">
                  <CheckCircle className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">78%</p>
                  <p className="text-sm text-muted-foreground">Taxa de Leitura</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Histórico de notificações */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Histórico de Notificações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {notificacoesEnviadas.map((notificacao) => (
                <div
                  key={notificacao.id}
                  className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="p-2 rounded-full bg-muted">
                    {getTipoIcon(notificacao.tipo)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{notificacao.titulo}</h4>
                      {getTipoBadge(notificacao.tipo)}
                    </div>
                    <p className="text-sm text-muted-foreground">{notificacao.mensagem}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {notificacao.destino}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {notificacao.dataEnvio}
                      </span>
                      <span>
                        Lidas: {notificacao.lidas}/{notificacao.total} ({Math.round((notificacao.lidas/notificacao.total)*100)}%)
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminNotificacoes;
