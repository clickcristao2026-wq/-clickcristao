import FinanceiroLayout from "@/components/FinanceiroLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";

const meses = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const historicoMultas = [
  { id: "MLT001", usuario: "Loja ABC", tipo: "Prazo de Postagem", produto: "Smartphone", valor: "R$ 50,00", data: "15/01/2025", status: "Recuperado" },
  { id: "MLT002", usuario: "Tech Store", tipo: "Cancelamento", produto: "Notebook", valor: "R$ 150,00", data: "14/01/2025", status: "Pendente" },
  { id: "MLT003", usuario: "Eletrônicos BR", tipo: "Prazo de Postagem", produto: "Tablet", valor: "R$ 40,00", data: "13/01/2025", status: "Recuperado" },
  { id: "MLT004", usuario: "Mega Shop", tipo: "Cancelamento", produto: "TV LED", valor: "R$ 200,00", data: "12/01/2025", status: "Pendente" },
  { id: "MLT005", usuario: "Loja XYZ", tipo: "Prazo de Postagem", produto: "Fone Bluetooth", valor: "R$ 25,00", data: "11/01/2025", status: "Recuperado" },
];

const Multas = () => {
  const [mesSelecionado, setMesSelecionado] = useState("Janeiro");

  return (
    <FinanceiroLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Multas</h1>
            <p className="text-muted-foreground">Contabilização de multas aplicadas na plataforma</p>
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

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Quantidade de Multas</CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45</div>
              <p className="text-xs text-muted-foreground">Multas aplicadas este mês</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Período de Fechamento</CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">30/01/2025</div>
              <p className="text-xs text-muted-foreground">Próximo fechamento</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Valor de Multas</CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">R$ 4.650,00</div>
              <p className="text-xs text-muted-foreground">Total em multas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Valor Recuperado</CardTitle>
              <AlertTriangle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">R$ 2.890,00</div>
              <p className="text-xs text-muted-foreground">Multas pagas</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Histórico de Multas - {mesSelecionado}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {historicoMultas.map((multa) => (
                  <TableRow key={multa.id}>
                    <TableCell className="font-medium">{multa.id}</TableCell>
                    <TableCell>{multa.usuario}</TableCell>
                    <TableCell>
                      <Badge variant={multa.tipo === "Prazo de Postagem" ? "outline" : "destructive"}>
                        {multa.tipo}
                      </Badge>
                    </TableCell>
                    <TableCell>{multa.produto}</TableCell>
                    <TableCell className="text-destructive">{multa.valor}</TableCell>
                    <TableCell>{multa.data}</TableCell>
                    <TableCell>
                      <Badge variant={multa.status === "Recuperado" ? "default" : "secondary"}>
                        {multa.status}
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

export default Multas;
