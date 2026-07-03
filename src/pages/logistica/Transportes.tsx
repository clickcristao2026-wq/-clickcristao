import { LogisticaLayout } from "@/components/LogisticaLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Truck, Send, Eye, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface EnvioTransporte {
  id: number;
  idTransacao: string;
  tipo: "Entrega" | "Devolução";
  usuario: string;
  perfilUsuario: "Consumidor" | "Vendedor";
  valorFrete: string;
  valorDesembolsado: string;
  responsavelRessarcimento: "Consumidor" | "Vendedor";
  status: "Pendente" | "Pago" | "Contestação";
  prazoPagamento: string;
  observacoes: string;
  lido: boolean;
  dataEnvio: string;
}

const enviosMock: EnvioTransporte[] = [
  {
    id: 1,
    idTransacao: "TRX-2026-1001",
    tipo: "Entrega",
    usuario: "Ana Paula Silva",
    perfilUsuario: "Consumidor",
    valorFrete: "R$ 32,50",
    valorDesembolsado: "R$ 32,50",
    responsavelRessarcimento: "Consumidor",
    status: "Pago",
    prazoPagamento: "15/04/2026",
    observacoes: "Entrega padrão dentro do prazo. Cliente confirmou recebimento.",
    lido: true,
    dataEnvio: "08/04/2026",
  },
  {
    id: 2,
    idTransacao: "TRX-2026-1002",
    tipo: "Devolução",
    usuario: "Livraria Cristã",
    perfilUsuario: "Vendedor",
    valorFrete: "R$ 28,90",
    valorDesembolsado: "R$ 28,90",
    responsavelRessarcimento: "Vendedor",
    status: "Pendente",
    prazoPagamento: "20/04/2026",
    observacoes: "Devolução por arrependimento dentro do prazo legal de 7 dias. Vendedor responsável pelo ressarcimento.",
    lido: true,
    dataEnvio: "10/04/2026",
  },
  {
    id: 3,
    idTransacao: "TRX-2026-1003",
    tipo: "Entrega",
    usuario: "Carlos Eduardo",
    perfilUsuario: "Consumidor",
    valorFrete: "R$ 45,00",
    valorDesembolsado: "R$ 45,00",
    responsavelRessarcimento: "Consumidor",
    status: "Contestação",
    prazoPagamento: "18/04/2026",
    observacoes: "Cliente contesta valor cobrado. Em análise pelo financeiro.",
    lido: false,
    dataEnvio: "12/04/2026",
  },
];

const statusColor = {
  Pendente: "bg-yellow-100 text-yellow-800",
  Pago: "bg-green-100 text-green-800",
  Contestação: "bg-red-100 text-red-800",
};

const LogisticaTransportes = () => {
  const [envios, setEnvios] = useState<EnvioTransporte[]>(enviosMock);
  const [detalhes, setDetalhes] = useState<EnvioTransporte | null>(null);

  const [form, setForm] = useState({
    idTransacao: "",
    tipo: "Entrega" as "Entrega" | "Devolução",
    usuario: "",
    perfilUsuario: "Consumidor" as "Consumidor" | "Vendedor",
    valorFrete: "",
    valorDesembolsado: "",
    responsavelRessarcimento: "Consumidor" as "Consumidor" | "Vendedor",
    status: "Pendente" as "Pendente" | "Pago" | "Contestação",
    prazoPagamento: "",
    observacoes: "",
  });

  const handleEnviar = () => {
    if (!form.idTransacao || !form.usuario || !form.valorFrete) {
      toast.error("Preencha os campos obrigatórios.");
      return;
    }
    const novo: EnvioTransporte = {
      id: envios.length + 1,
      ...form,
      lido: false,
      dataEnvio: new Date().toLocaleDateString("pt-BR"),
    };
    setEnvios([novo, ...envios]);
    toast.success(`Formulário enviado para ${form.usuario} (${form.perfilUsuario}).`);
    setForm({
      idTransacao: "",
      tipo: "Entrega",
      usuario: "",
      perfilUsuario: "Consumidor",
      valorFrete: "",
      valorDesembolsado: "",
      responsavelRessarcimento: "Consumidor",
      status: "Pendente",
      prazoPagamento: "",
      observacoes: "",
    });
  };

  return (
    <LogisticaLayout title="Click Transportes">
      <div className="space-y-6">
        {/* Aviso */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">
              <strong>🚚 Click Transportes:</strong> Custos relacionados aos envios de produtos. As notificações são
              sincronizadas automaticamente com o usuário (Consumidor ou Vendedor) registrado.
            </p>
          </CardContent>
        </Card>

        {/* Formulário */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Novo Registro de Transporte
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="font-normal">ID da Transação <span className="text-xs text-muted-foreground">(rastreabilidade)</span></Label>
                <Input
                  placeholder="Ex: TRX-2026-1004"
                  value={form.idTransacao}
                  onChange={(e) => setForm({ ...form, idTransacao: e.target.value })}
                />
              </div>

              <div>
                <Label className="font-normal">Tipo <span className="text-xs text-muted-foreground">(natureza do custo)</span></Label>
                <Select value={form.tipo} onValueChange={(v: "Entrega" | "Devolução") => setForm({ ...form, tipo: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Entrega">Entrega</SelectItem>
                    <SelectItem value="Devolução">Devolução</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="font-normal">Usuário <span className="text-xs text-muted-foreground">(envolvido)</span></Label>
                <Input
                  placeholder="Nome do Consumidor ou Vendedor"
                  value={form.usuario}
                  onChange={(e) => setForm({ ...form, usuario: e.target.value })}
                />
              </div>

              <div>
                <Label className="font-normal">Perfil do Usuário</Label>
                <Select value={form.perfilUsuario} onValueChange={(v: "Consumidor" | "Vendedor") => setForm({ ...form, perfilUsuario: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Consumidor">Consumidor</SelectItem>
                    <SelectItem value="Vendedor">Vendedor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="font-normal">Valor do Frete <span className="text-xs text-muted-foreground">(custo total)</span></Label>
                <Input
                  placeholder="R$ 0,00"
                  value={form.valorFrete}
                  onChange={(e) => setForm({ ...form, valorFrete: e.target.value })}
                />
              </div>

              <div>
                <Label className="font-normal">Valor Desembolsado pelo Click Cristão <span className="text-xs text-muted-foreground">(controle financeiro)</span></Label>
                <Input
                  placeholder="R$ 0,00"
                  value={form.valorDesembolsado}
                  onChange={(e) => setForm({ ...form, valorDesembolsado: e.target.value })}
                />
              </div>

              <div>
                <Label className="font-normal">Responsável pelo Ressarcimento</Label>
                <Select value={form.responsavelRessarcimento} onValueChange={(v: "Consumidor" | "Vendedor") => setForm({ ...form, responsavelRessarcimento: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Consumidor">Consumidor</SelectItem>
                    <SelectItem value="Vendedor">Vendedor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="font-normal">Status <span className="text-xs text-muted-foreground">(acompanhamento)</span></Label>
                <Select value={form.status} onValueChange={(v: "Pendente" | "Pago" | "Contestação") => setForm({ ...form, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pendente">Pendente</SelectItem>
                    <SelectItem value="Pago">Pago</SelectItem>
                    <SelectItem value="Contestação">Contestação</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2">
                <Label className="font-normal">Prazo para Pagamento <span className="text-xs text-muted-foreground">(gestão de cobrança)</span></Label>
                <Input
                  type="date"
                  value={form.prazoPagamento}
                  onChange={(e) => setForm({ ...form, prazoPagamento: e.target.value })}
                />
              </div>

              <div className="md:col-span-2">
                <Label className="font-normal">Observações <span className="text-xs text-muted-foreground">(registro jurídico)</span></Label>
                <Textarea
                  placeholder="Descreva detalhes relevantes para registro jurídico do envio..."
                  value={form.observacoes}
                  onChange={(e) => setForm({ ...form, observacoes: e.target.value })}
                  className="min-h-[140px]"
                />
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button
                onClick={handleEnviar}
                style={{ backgroundColor: "#2035F2" }}
                className="text-white hover:opacity-90"
              >
                <Send className="h-4 w-4 mr-2" />
                Enviar Formulário para o Usuário
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Histórico */}
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Envios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border border-border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>ID Transação</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Valor Frete</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Leitura</TableHead>
                    <TableHead className="text-center">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {envios.map((e) => (
                    <TableRow key={e.id}>
                      <TableCell className="font-medium">{e.idTransacao}</TableCell>
                      <TableCell>{e.tipo}</TableCell>
                      <TableCell>
                        {e.usuario}
                        <p className="text-xs text-muted-foreground">{e.perfilUsuario}</p>
                      </TableCell>
                      <TableCell>{e.valorFrete}</TableCell>
                      <TableCell><Badge className={statusColor[e.status]}>{e.status}</Badge></TableCell>
                      <TableCell>
                        {e.lido ? (
                          <Badge className="bg-green-100 text-green-800 gap-1">
                            <CheckCircle2 className="h-3 w-3" /> Lido
                          </Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-700">Não lido</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setDetalhes(e)}>
                              <Eye className="h-4 w-4 mr-1" /> Detalhes
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Formulário Enviado - {detalhes?.idTransacao}</DialogTitle>
                            </DialogHeader>
                            {detalhes && (
                              <div className="space-y-3 text-sm">
                                <div className="grid grid-cols-2 gap-3">
                                  <div><Label className="font-normal text-xs">ID Transação</Label><p className="font-medium">{detalhes.idTransacao}</p></div>
                                  <div><Label className="font-normal text-xs">Tipo</Label><p className="font-medium">{detalhes.tipo}</p></div>
                                  <div><Label className="font-normal text-xs">Usuário</Label><p className="font-medium">{detalhes.usuario} ({detalhes.perfilUsuario})</p></div>
                                  <div><Label className="font-normal text-xs">Data de Envio</Label><p className="font-medium">{detalhes.dataEnvio}</p></div>
                                  <div><Label className="font-normal text-xs">Valor do Frete</Label><p className="font-medium">{detalhes.valorFrete}</p></div>
                                  <div><Label className="font-normal text-xs">Valor Desembolsado</Label><p className="font-medium">{detalhes.valorDesembolsado}</p></div>
                                  <div><Label className="font-normal text-xs">Responsável Ressarcimento</Label><p className="font-medium">{detalhes.responsavelRessarcimento}</p></div>
                                  <div><Label className="font-normal text-xs">Prazo Pagamento</Label><p className="font-medium">{detalhes.prazoPagamento}</p></div>
                                  <div><Label className="font-normal text-xs">Status</Label><Badge className={statusColor[detalhes.status]}>{detalhes.status}</Badge></div>
                                  <div><Label className="font-normal text-xs">Leitura pelo Usuário</Label>
                                    {detalhes.lido ? (
                                      <Badge className="bg-green-100 text-green-800 gap-1"><CheckCircle2 className="h-3 w-3" /> Lido</Badge>
                                    ) : (
                                      <Badge className="bg-gray-100 text-gray-700">Não lido</Badge>
                                    )}
                                  </div>
                                </div>
                                <div>
                                  <Label className="font-normal text-xs">Observações</Label>
                                  <p className="bg-muted p-3 rounded-md mt-1">{detalhes.observacoes}</p>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </LogisticaLayout>
  );
};

export default LogisticaTransportes;
