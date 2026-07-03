import FinanceiroLayout from "@/components/FinanceiroLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Bell, Send, Plus, Clock, DollarSign, AlertTriangle, RefreshCcw, Award, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

const meses = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const blocosNotificacao = [
  { titulo: "Pagamento Confirmado", icone: DollarSign, cor: "text-green-600", bgCor: "bg-green-100", quantidade: 45 },
  { titulo: "Reembolso Processado", icone: RefreshCcw, cor: "text-blue-600", bgCor: "bg-blue-100", quantidade: 12 },
  { titulo: "Comissão Liberada", icone: Award, cor: "text-purple-600", bgCor: "bg-purple-100", quantidade: 28 },
  { titulo: "Multa Aplicada", icone: AlertTriangle, cor: "text-red-600", bgCor: "bg-red-100", quantidade: 8 },
];

const historicosPorBloco: Record<string, Array<{ id: number; usuario: string; mensagem: string; data: string; status: string }>> = {
  "Pagamento Confirmado": [
    { id: 1, usuario: "Ana Paula Silva", mensagem: "Pagamento de R$ 89,90 confirmado - PED-2026-089", data: "03/02/2026 10:30", status: "lida" },
    { id: 2, usuario: "Carlos Eduardo", mensagem: "Pagamento de R$ 149,90 confirmado - PED-2026-088", data: "02/02/2026 14:00", status: "lida" },
  ],
  "Reembolso Processado": [
    { id: 3, usuario: "Roberto Santos", mensagem: "Reembolso de R$ 120,00 processado - PED-2026-086", data: "02/02/2026 16:00", status: "lida" },
  ],
  "Comissão Liberada": [
    { id: 4, usuario: "Maria Oliveira", mensagem: "Comissão de R$ 45,00 liberada - Afiliado Digital", data: "01/02/2026 09:00", status: "pendente" },
    { id: 5, usuario: "João Pereira", mensagem: "Comissão de R$ 78,50 liberada - Afiliado Produtos", data: "01/02/2026 10:00", status: "lida" },
  ],
  "Multa Aplicada": [
    { id: 6, usuario: "Editora Graça", mensagem: "Multa de R$ 15,00 aplicada - Atraso na postagem PEN-2026-015", data: "02/02/2026 14:00", status: "pendente" },
  ],
};

const FinanceiroNotificacoes = () => {
  const [showForm, setShowForm] = useState(false);
  const [mesSelecionado, setMesSelecionado] = useState("Fevereiro");
  const [blocosAbertos, setBlocosAbertos] = useState<Record<string, boolean>>({});

  const toggleBloco = (titulo: string) => {
    setBlocosAbertos(prev => ({ ...prev, [titulo]: !prev[titulo] }));
  };

  return (
    <FinanceiroLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Notificações</h1>
            <p className="text-muted-foreground">Emitir notificações financeiras para usuários</p>
          </div>
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

        {/* Blocos fixos no cabeçalho com histórico integrado */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {blocosNotificacao.map((bloco) => (
            <Card
              key={bloco.titulo}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => toggleBloco(bloco.titulo)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${bloco.bgCor}`}>
                      <bloco.icone className={`h-5 w-5 ${bloco.cor}`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{bloco.titulo}</p>
                      <p className="text-2xl font-bold">{bloco.quantidade}</p>
                      <p className="text-xs text-muted-foreground">Notificações enviadas</p>
                    </div>
                  </div>
                  {blocosAbertos[bloco.titulo] ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">
              <strong>⚡ Sincronização:</strong> Notificações sincronizadas com a área de Notificações dos Usuários na plataforma.
            </p>
          </CardContent>
        </Card>

        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Emitir Nova Notificação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tipo de Notificação</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pagamento">Pagamento Confirmado</SelectItem>
                      <SelectItem value="reembolso">Reembolso Processado</SelectItem>
                      <SelectItem value="comissao">Comissão Liberada</SelectItem>
                      <SelectItem value="multa">Multa Aplicada</SelectItem>
                      <SelectItem value="lembrete">Lembrete de Pagamento</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
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
                  <Label>Título da Notificação</Label>
                  <Input placeholder="Ex: Seu pagamento foi confirmado!" />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label>Mensagem</Label>
                  <Textarea placeholder="Digite a mensagem da notificação..." rows={4} />
                </div>
                <div className="space-y-2">
                  <Label>Valor Relacionado (opcional)</Label>
                  <Input placeholder="R$ 0,00" />
                </div>
                <div className="space-y-2">
                  <Label>ID da Transação (opcional)</Label>
                  <Input placeholder="TRX000000" />
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

        {/* Histórico integrado em cada bloco */}
        {blocosNotificacao.map((bloco) => {
          const historico = historicosPorBloco[bloco.titulo] || [];
          const isOpen = blocosAbertos[bloco.titulo];
          if (!isOpen) return null;
          return (
            <Card key={bloco.titulo}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <bloco.icone className={`h-5 w-5 ${bloco.cor}`} />
                  Histórico - {bloco.titulo}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {historico.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Nenhuma notificação enviada.</p>
                ) : (
                  <div className="space-y-3">
                    {historico.map((notif) => (
                      <div key={notif.id} className="flex items-center gap-4 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-sm">{notif.usuario}</h4>
                            {notif.status === "lida" ? (
                              <Badge variant="outline" className="text-green-600 text-xs">Lida</Badge>
                            ) : (
                              <Badge variant="outline" className="text-yellow-600 text-xs">Pendente</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{notif.mensagem}</p>
                          <span className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {notif.data}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </FinanceiroLayout>
  );
};

export default FinanceiroNotificacoes;
