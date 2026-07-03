import FinanceiroLayout from "@/components/FinanceiroLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCcw, DollarSign } from "lucide-react";
import { useState } from "react";

const meses = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const historicoReembolsos = [
  { id: "RMB001", usuario: "João Silva", produto: "Smartphone Samsung", valor: "R$ 1.899,00", data: "15/01/2025", motivo: "Produto com defeito", status: "Pendente" },
  { id: "RMB002", usuario: "Maria Santos", produto: "Tênis Nike", valor: "R$ 459,90", data: "14/01/2025", motivo: "Tamanho incorreto", status: "Processado" },
  { id: "RMB003", usuario: "Pedro Costa", produto: "Relógio Apple", valor: "R$ 3.299,00", data: "13/01/2025", motivo: "Arrependimento", status: "Processado" },
  { id: "RMB004", usuario: "Ana Oliveira", produto: "Bolsa Gucci", valor: "R$ 890,00", data: "12/01/2025", motivo: "Produto diferente", status: "Pendente" },
  { id: "RMB005", usuario: "Carlos Lima", produto: "Headphone JBL", valor: "R$ 299,90", data: "11/01/2025", motivo: "Não funciona", status: "Processado" },
];

const Reembolso = () => {
  const [mesSelecionado, setMesSelecionado] = useState("Janeiro");

  return (
    <FinanceiroLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Reembolso</h1>
            <p className="text-muted-foreground">Gestão de reembolsos para usuários</p>
          </div>
          <Select value={mesSelecionado} onValueChange={setMesSelecionado}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Selecione o mês" />
            </SelectTrigger>
            <SelectContent>
              {meses.map((mes) => (
                <SelectItem key={mes} value={mes}>{mes}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Quantidade de Usuários</CardTitle>
              <RefreshCcw className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">28</div>
              <p className="text-xs text-muted-foreground">Solicitações de reembolso</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Período de Fechamento</CardTitle>
              <RefreshCcw className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">30/01/2025</div>
              <p className="text-xs text-muted-foreground">Próximo fechamento</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Valor de Repasse</CardTitle>
              <DollarSign className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">R$ 12.847,80</div>
              <p className="text-xs text-muted-foreground">Total a reembolsar</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Histórico de Reembolsos - {mesSelecionado}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Motivo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {historicoReembolsos.map((reembolso) => (
                  <TableRow key={reembolso.id}>
                    <TableCell className="font-medium">{reembolso.id}</TableCell>
                    <TableCell>{reembolso.usuario}</TableCell>
                    <TableCell>{reembolso.produto}</TableCell>
                    <TableCell className="text-destructive">{reembolso.valor}</TableCell>
                    <TableCell>{reembolso.data}</TableCell>
                    <TableCell className="max-w-32 truncate">{reembolso.motivo}</TableCell>
                    <TableCell>
                      <Badge variant={reembolso.status === "Processado" ? "default" : "secondary"}>
                        {reembolso.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {reembolso.status === "Pendente" && (
                        <Button size="sm" variant="outline">
                          <DollarSign className="w-3 h-3 mr-1" />
                          Processar
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </FinanceiroLayout>
  );
};

export default Reembolso;
