import { LogisticaLayout } from "@/components/LogisticaLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Send, Plus, Clock, User, Eye, Package, RotateCcw } from "lucide-react";
import { useState } from "react";

const mensagensEnviadas = [
  {
    id: 1,
    titulo: "Produto Chegou",
    mensagem: "Seu produto foi entregue com sucesso! Você tem 7 dias para solicitar devolução se necessário.",
    destinatario: "Ana Paula Silva",
    tipoMensagem: "entrega",
    dataEnvio: "03/02/2026 14:45",
    status: "lida"
  },
  {
    id: 2,
    titulo: "Devolução em Andamento",
    mensagem: "Recebemos sua solicitação de devolução. Aguarde as instruções de envio.",
    destinatario: "Roberto Santos",
    tipoMensagem: "devolucao",
    dataEnvio: "02/02/2026 10:30",
    status: "lida"
  },
  {
    id: 3,
    titulo: "Produto Reenviado",
    mensagem: "Seu produto foi reenviado. Novo código de rastreamento: BR999888777",
    destinatario: "Carlos Eduardo",
    tipoMensagem: "reenvio",
    dataEnvio: "01/02/2026 16:00",
    status: "pendente"
  },
];

const LogisticaAvisos = () => {
  const [showForm, setShowForm] = useState(false);

  const getTipoBadge = (tipo: string) => {
    switch (tipo) {
      case "entrega":
        return <Badge className="bg-green-500">Entrega</Badge>;
      case "devolucao":
        return <Badge className="bg-orange-500">Devolução</Badge>;
      case "reenvio":
        return <Badge className="bg-blue-500">Reenvio</Badge>;
      default:
        return <Badge variant="outline">{tipo}</Badge>;
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case "entrega":
        return <Package className="h-5 w-5 text-green-600" />;
      case "devolucao":
        return <RotateCcw className="h-5 w-5 text-orange-600" />;
      case "reenvio":
        return <Package className="h-5 w-5 text-blue-600" />;
      default:
        return <MessageSquare className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <LogisticaLayout title="Avisos">
      <div className="space-y-6">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">
              <strong>⚡ Sincronização:</strong> As mensagens enviadas são sincronizadas com as notificações dos usuários destinatários.
            </p>
          </CardContent>
        </Card>

        <div className="flex justify-between items-center">
          <p className="text-muted-foreground">
            Destinar mensagens para os usuários sobre entregas e devoluções
          </p>
          <Button onClick={() => setShowForm(!showForm)} className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Novo Aviso
          </Button>
        </div>

        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>Enviar Aviso para Usuário</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tipo de Aviso</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entrega">Produto Chegou</SelectItem>
                      <SelectItem value="devolucao">Devolução</SelectItem>
                      <SelectItem value="reenvio">Reenvio</SelectItem>
                      <SelectItem value="atraso">Atraso na Entrega</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Código do Pedido</Label>
                  <Input placeholder="PED-2026-XXX" />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label>Buscar Usuário</Label>
                  <Input placeholder="Nome ou e-mail do usuário" />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label>Título do Aviso</Label>
                  <Input placeholder="Ex: Produto Chegou" />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label>Mensagem</Label>
                  <Textarea 
                    placeholder="Digite a mensagem do aviso..."
                    rows={4}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setShowForm(false)}>
                  Cancelar
                </Button>
                <Button className="bg-primary hover:bg-primary/90">
                  <Send className="h-4 w-4 mr-2" />
                  Enviar Aviso
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Cards de resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-blue-100">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">28</p>
                  <p className="text-sm text-muted-foreground">Avisos Enviados</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-green-100">
                  <Eye className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">24</p>
                  <p className="text-sm text-muted-foreground">Lidos</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-yellow-100">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">4</p>
                  <p className="text-sm text-muted-foreground">Pendentes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Histórico de avisos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Histórico de Avisos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mensagensEnviadas.map((mensagem) => (
                <div
                  key={mensagem.id}
                  className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="p-2 rounded-full bg-muted">
                    {getTipoIcon(mensagem.tipoMensagem)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{mensagem.titulo}</h4>
                      {getTipoBadge(mensagem.tipoMensagem)}
                      {mensagem.status === "lida" ? (
                        <Badge variant="outline" className="text-green-600">Lida</Badge>
                      ) : (
                        <Badge variant="outline" className="text-yellow-600">Pendente</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{mensagem.mensagem}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {mensagem.destinatario}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {mensagem.dataEnvio}
                      </span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    Ver Detalhes
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </LogisticaLayout>
  );
};

export default LogisticaAvisos;
