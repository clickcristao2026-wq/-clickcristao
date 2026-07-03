import ComissionadoLayout from "@/components/ComissionadoLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Bell, Send, Plus, Clock, DollarSign, CheckCircle, ShoppingCart, RefreshCcw, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

const meses = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const blocosNotificacao = [
  { titulo: "Comissão Liberada", icone: DollarSign, cor: "text-green-600", bgCor: "bg-green-100", quantidade: 89 },
  { titulo: "Pagamento Realizado", icone: CheckCircle, cor: "text-blue-600", bgCor: "bg-blue-100", quantidade: 67 },
  { titulo: "Nova Venda", icone: ShoppingCart, cor: "text-purple-600", bgCor: "bg-purple-100", quantidade: 234 },
  { titulo: "Atualização de Conta", icone: RefreshCcw, cor: "text-orange-600", bgCor: "bg-orange-100", quantidade: 45 },
];

const historicosPorBloco: Record<string, Array<{ id: number; usuario: string; mensagem: string; data: string; status: string }>> = {
  "Comissão Liberada": [
    { id: 1, usuario: "Ricardo Santos", mensagem: "Comissão de R$ 1.350,00 liberada - Afiliado Produtos", data: "03/02/2026 10:30", status: "lida" },
    { id: 2, usuario: "Marcos Silva", mensagem: "Comissão de R$ 570,00 liberada - Afiliado Digital", data: "02/02/2026 14:00", status: "pendente" },
  ],
  "Pagamento Realizado": [
    { id: 3, usuario: "Fernanda Lima", mensagem: "Pagamento de R$ 960,00 realizado via PIX", data: "02/02/2026 16:00", status: "lida" },
    { id: 4, usuario: "Bruno Costa", mensagem: "Pagamento de R$ 840,00 realizado via PIX", data: "01/02/2026 09:00", status: "lida" },
  ],
  "Nova Venda": [
    { id: 5, usuario: "Ana Paula Silva", mensagem: "Nova venda realizada - Bíblia Sagrada NVI R$ 89,90", data: "03/02/2026 10:30", status: "lida" },
    { id: 6, usuario: "Carlos Eduardo", mensagem: "Nova venda realizada - Kit Camisetas Gospel R$ 149,90", data: "02/02/2026 14:00", status: "pendente" },
  ],
  "Atualização de Conta": [
    { id: 7, usuario: "Juliana Alves", mensagem: "Dados bancários atualizados com sucesso", data: "01/02/2026 11:00", status: "lida" },
  ],
};

const ComissionadoNotificacoes = () => {
  const [showForm, setShowForm] = useState(false);
  const [mesSelecionado, setMesSelecionado] = useState("Fevereiro");
  const [blocosAbertos, setBlocosAbertos] = useState<Record<string, boolean>>({});

  const toggleBloco = (titulo: string) => {
    setBlocosAbertos(prev => ({ ...prev, [titulo]: !prev[titulo] }));
  };

  return (
    <ComissionadoLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Notificações</h1>
            <p className="text-muted-foreground">Emitir notificações para afiliados</p>
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
                      <SelectItem value="comissao">Comissão Liberada</SelectItem>
                      <SelectItem value="pagamento">Pagamento Realizado</SelectItem>
                      <SelectItem value="venda">Nova Venda Realizada</SelectItem>
                      <SelectItem value="atualizacao">Atualização de Conta</SelectItem>
                      <SelectItem value="promocao">Nova Promoção</SelectItem>
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
                  <Input placeholder="Ex: Sua comissão foi liberada!" />
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
                  <Input placeholder="COM000000" />
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
    </ComissionadoLayout>
  );
};

export default ComissionadoNotificacoes;
