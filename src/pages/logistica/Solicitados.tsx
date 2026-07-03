import { LogisticaLayout } from "@/components/LogisticaLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Search, MapPin, Mail, MessageSquare, Clock, Eye, Send, Phone } from "lucide-react";

const solicitacoes = [
  {
    id: 1,
    codigo: "RAT-2026-045",
    solicitante: "Maria Santos",
    email: "maria.santos@email.com",
    telefone: "(11) 99999-1234",
    codigoRastreio: "BR123456789",
    transportadora: "Correios",
    status: "em_andamento",
    dataSolicitacao: "03/02/2026 09:15",
    ultimaAtualizacao: "Em trânsito - São Paulo/SP"
  },
  {
    id: 2,
    codigo: "RAT-2026-044",
    solicitante: "João Silva",
    email: "joao.silva@email.com",
    telefone: "(21) 98888-5678",
    codigoRastreio: "JD987654321",
    transportadora: "JadLog",
    status: "pendente",
    dataSolicitacao: "02/02/2026 14:30",
    ultimaAtualizacao: "Aguardando coleta"
  },
  {
    id: 3,
    codigo: "RAT-2026-043",
    solicitante: "Ana Costa",
    email: "ana.costa@email.com",
    telefone: "(31) 97777-9012",
    codigoRastreio: "BR111222333",
    transportadora: "Correios",
    status: "concluido",
    dataSolicitacao: "01/02/2026 10:00",
    ultimaAtualizacao: "Entregue ao destinatário"
  },
];

const LogisticaSolicitados = () => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "em_andamento":
        return <Badge className="bg-blue-500">Em Andamento</Badge>;
      case "pendente":
        return <Badge className="bg-yellow-500">Pendente</Badge>;
      case "concluido":
        return <Badge className="bg-green-500">Concluído</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <LogisticaLayout title="Solicitados">
      <div className="space-y-6">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">
              <strong>⚡ Sincronização:</strong> Vinculado ao formulário da página Home "CLICK RASTREÁVEL". 
              As solicitações de rastreamento chegam aqui para monitoramento e envio ao usuário consumidor em tempo real.
            </p>
          </CardContent>
        </Card>

        {/* Cards de resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-yellow-100">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {solicitacoes.filter(s => s.status === "pendente").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Pendentes</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-blue-100">
                  <Search className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {solicitacoes.filter(s => s.status === "em_andamento").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Em Andamento</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-green-100">
                  <MapPin className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {solicitacoes.filter(s => s.status === "concluido").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Concluídos</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de solicitações */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Histórico de Solicitações de Rastreamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {solicitacoes.map((solicitacao) => (
                <div
                  key={solicitacao.id}
                  className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{solicitacao.codigo}</h4>
                        {getStatusBadge(solicitacao.status)}
                      </div>
                      <p className="text-sm font-medium">{solicitacao.solicitante}</p>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {solicitacao.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {solicitacao.telefone}
                        </span>
                      </div>
                      <div className="mt-2 p-2 bg-muted/50 rounded text-sm">
                        <p><strong>Rastreio:</strong> {solicitacao.codigoRastreio} ({solicitacao.transportadora})</p>
                        <p className="text-muted-foreground mt-1">
                          <MapPin className="h-3 w-3 inline mr-1" />
                          {solicitacao.ultimaAtualizacao}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        Solicitado em: {solicitacao.dataSolicitacao}
                      </div>
                    </div>

                    {/* Botões de ação */}
                    <div className="flex flex-col gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        Rastrear
                      </Button>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <Mail className="h-4 w-4 mr-1" />
                        E-mail
                      </Button>
                      <Button size="sm" className="bg-[#25D366] hover:bg-[#128C7E]">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        WhatsApp
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Formulário de envio de atualização */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Enviar Atualização de Rastreamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Código da Solicitação</Label>
                <Input placeholder="RAT-2026-XXX" />
              </div>
              <div className="space-y-2">
                <Label>Canal de Envio</Label>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    <Mail className="h-4 w-4 mr-1" />
                    E-mail
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    WhatsApp
                  </Button>
                </div>
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label>Mensagem de Atualização</Label>
                <Textarea 
                  placeholder="Digite a atualização do rastreamento..."
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button className="bg-primary hover:bg-primary/90">
                <Send className="h-4 w-4 mr-2" />
                Enviar Atualização
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </LogisticaLayout>
  );
};

export default LogisticaSolicitados;
