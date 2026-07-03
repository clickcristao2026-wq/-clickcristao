import ComissionadoLayout from "@/components/ComissionadoLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Calendar, DollarSign } from "lucide-react";
import { useState } from "react";

const meses = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const historicoRevendas = [
  { id: "RVD001", afiliado: "Ricardo Santos", produto: "Smartphone Samsung", valor: "R$ 2.499,00", comissao: "R$ 124,95", data: "15/01/2025", status: "Confirmada" },
  { id: "RVD002", afiliado: "Fernanda Lima", produto: "Notebook Dell", valor: "R$ 4.299,00", comissao: "R$ 214,95", data: "14/01/2025", status: "Confirmada" },
  { id: "RVD003", afiliado: "Bruno Costa", produto: "Fone JBL", valor: "R$ 349,00", comissao: "R$ 17,45", data: "13/01/2025", status: "Pendente" },
  { id: "RVD004", afiliado: "Juliana Alves", produto: "Smart TV 55\"", valor: "R$ 3.199,00", comissao: "R$ 159,95", data: "12/01/2025", status: "Confirmada" },
  { id: "RVD005", afiliado: "Marcos Silva", produto: "Tablet iPad", valor: "R$ 5.499,00", comissao: "R$ 274,95", data: "11/01/2025", status: "Pendente" },
  { id: "RVD006", afiliado: "Ana Paula", produto: "Câmera Canon", valor: "R$ 2.899,00", comissao: "R$ 144,95", data: "10/01/2025", status: "Confirmada" },
];

const Financeiro = () => {
  const [mesSelecionado, setMesSelecionado] = useState("Janeiro");

  return (
    <ComissionadoLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Financeiro</h1>
            <p className="text-muted-foreground">Resumo financeiro de revendas e comissões</p>
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
              <CardTitle className="text-sm font-medium">Total de Revendas</CardTitle>
              <ShoppingCart className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1.456</div>
              <p className="text-xs text-muted-foreground">Revendas realizadas este mês</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Período de Fechamento</CardTitle>
              <Calendar className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">30/01/2025</div>
              <p className="text-xs text-muted-foreground">Próximo fechamento</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Valor em Comissões</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">R$ 45.890,00</div>
              <p className="text-xs text-muted-foreground">Total a pagar em comissões</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Histórico de Revendas - {mesSelecionado}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Afiliado</TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead>Valor Venda</TableHead>
                  <TableHead>Comissão</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {historicoRevendas.map((revenda) => (
                  <TableRow key={revenda.id}>
                    <TableCell className="font-medium">{revenda.id}</TableCell>
                    <TableCell>{revenda.afiliado}</TableCell>
                    <TableCell>{revenda.produto}</TableCell>
                    <TableCell>{revenda.valor}</TableCell>
                    <TableCell className="text-green-600 font-medium">{revenda.comissao}</TableCell>
                    <TableCell>{revenda.data}</TableCell>
                    <TableCell>
                      <Badge variant={revenda.status === "Confirmada" ? "default" : "secondary"}>
                        {revenda.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </ComissionadoLayout>
  );
};

export default Financeiro;
