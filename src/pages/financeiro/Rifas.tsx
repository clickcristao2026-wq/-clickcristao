import FinanceiroLayout from "@/components/FinanceiroLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Ticket } from "lucide-react";
import { useState } from "react";

const meses = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const historicoRifas = [
  { id: "RIF001", nome: "iPhone 15 Pro", bilhetes: 500, arrecadado: "R$ 5.000,00", data: "15/01/2025", status: "Em andamento" },
  { id: "RIF002", nome: "PlayStation 5", bilhetes: 300, arrecadado: "R$ 1.500,00", data: "14/01/2025", status: "Finalizada" },
  { id: "RIF003", nome: "Smart TV 65\"", bilhetes: 450, arrecadado: "R$ 2.250,00", data: "13/01/2025", status: "Finalizada" },
  { id: "RIF004", nome: "Notebook Gamer", bilhetes: 600, arrecadado: "R$ 6.000,00", data: "12/01/2025", status: "Em andamento" },
  { id: "RIF005", nome: "Bicicleta Elétrica", bilhetes: 200, arrecadado: "R$ 2.000,00", data: "11/01/2025", status: "Finalizada" },
];

const Rifas = () => {
  const [mesSelecionado, setMesSelecionado] = useState("Janeiro");

  return (
    <FinanceiroLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Rifas</h1>
            <p className="text-muted-foreground">Contabilização de rifas realizadas na plataforma</p>
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
              <CardTitle className="text-sm font-medium">Quantidade de Vendas</CardTitle>
              <Ticket className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2.050</div>
              <p className="text-xs text-muted-foreground">Bilhetes vendidos este mês</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Período de Fechamento</CardTitle>
              <Ticket className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">30/01/2025</div>
              <p className="text-xs text-muted-foreground">Próximo fechamento</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Valor da Plataforma</CardTitle>
              <Ticket className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">R$ 16.750,00</div>
              <p className="text-xs text-muted-foreground">Receita com rifas</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Histórico de Rifas - {mesSelecionado}</CardTitle>
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
                {historicoRifas.map((rifa) => (
                  <TableRow key={rifa.id}>
                    <TableCell className="font-medium">{rifa.id}</TableCell>
                    <TableCell>{rifa.nome}</TableCell>
                    <TableCell>{rifa.bilhetes}</TableCell>
                    <TableCell className="text-green-600">{rifa.arrecadado}</TableCell>
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
