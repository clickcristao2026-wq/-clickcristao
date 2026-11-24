import FinanceiroLayout from "@/components/FinanceiroLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Ticket } from "lucide-react";
import { useState } from "react";
import { historicoInBox } from "@/data/dashboardInbox";
import { formatarCentavos, mesesDoAno as meses } from "@/data/gerenciamentoDadosMensais";

const Rifas = () => {
  const [mesSelecionado, setMesSelecionado] = useState("Janeiro");

  const history = mesSelecionado === "Janeiro" ? historicoInBox : [];
  const totalVendas = history.reduce((total, item) => total + item.bilhetes, 0);
  const totalArrecadado = history.reduce((total, item) => total + item.arrecadado, 0);

  return (
    <FinanceiroLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-foreground">inBox</h2>
            <p className="text-muted-foreground">Dados demonstrativos do histórico legado</p>
          </div>
          <Select value={mesSelecionado} onValueChange={setMesSelecionado}>
            <SelectTrigger aria-label="Selecionar mês" className="w-48">
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
              <CardTitle className="text-sm font-medium">Quantidade de Vendas</CardTitle>
              <Ticket className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalVendas.toLocaleString("pt-BR")}</div>
              <p className="text-xs text-muted-foreground">Bilhetes vendidos este mês</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Período de Fechamento</CardTitle>
              <Ticket className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{history.length ? "30/01/2025" : "—"}</div>
              <p className="text-xs text-muted-foreground">Próximo fechamento</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Valor da Plataforma</CardTitle>
              <Ticket className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{formatarCentavos(totalArrecadado)}</div>
              <p className="text-xs text-muted-foreground">inBox arrecadado</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Histórico de caixas vendidas - {mesSelecionado}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nome da Rifa</TableHead>
                  <TableHead>Bilhetes Vendidos</TableHead>
                  <TableHead>Valor Arrecadado</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!history.length && (
                  <TableRow><TableCell colSpan={6}>Sem registros para este mês.</TableCell></TableRow>
                )}
                {history.map((rifa) => (
                  <TableRow key={rifa.id}>
                    <TableCell className="font-medium">{rifa.id}</TableCell>
                    <TableCell>{rifa.nome}</TableCell>
                    <TableCell>{rifa.bilhetes}</TableCell>
                    <TableCell className="text-green-600">{formatarCentavos(rifa.arrecadado)}</TableCell>
                    <TableCell>{rifa.data}</TableCell>
                    <TableCell>
                      <Badge variant={rifa.status === "Em andamento" ? "default" : "secondary"}>
                        {rifa.status}
                      </Badge>
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

export default Rifas;
