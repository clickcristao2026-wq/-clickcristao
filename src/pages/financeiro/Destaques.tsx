import FinanceiroLayout from "@/components/FinanceiroLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { useState } from "react";

const meses = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const historicoDestaques = [
  { id: "DST001", usuario: "João Silva", produto: "Smartphone Samsung", data: "15/01/2025", valor: "R$ 49,90", status: "Ativo" },
  { id: "DST002", usuario: "Maria Santos", produto: "Notebook Dell", data: "14/01/2025", valor: "R$ 99,90", status: "Ativo" },
  { id: "DST003", usuario: "Pedro Costa", produto: "TV LG 55\"", data: "13/01/2025", valor: "R$ 79,90", status: "Expirado" },
  { id: "DST004", usuario: "Ana Oliveira", produto: "Geladeira Brastemp", data: "12/01/2025", valor: "R$ 69,90", status: "Ativo" },
  { id: "DST005", usuario: "Carlos Lima", produto: "Ar Condicionado", data: "11/01/2025", valor: "R$ 59,90", status: "Expirado" },
];

const Destaques = () => {
  const [mesSelecionado, setMesSelecionado] = useState("Janeiro");

  return (
    <FinanceiroLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Destaques</h1>
            <p className="text-muted-foreground">Contabilização de destaques realizados na plataforma</p>
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
              <Star className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground">Destaques vendidos este mês</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Período de Fechamento</CardTitle>
              <Star className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">30/01/2025</div>
              <p className="text-xs text-muted-foreground">Próximo fechamento</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Valor da Plataforma</CardTitle>
              <Star className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">R$ 11.544,40</div>
              <p className="text-xs text-muted-foreground">Receita com destaques</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Histórico de Destaques - {mesSelecionado}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {historicoDestaques.map((destaque) => (
                  <TableRow key={destaque.id}>
                    <TableCell className="font-medium">{destaque.id}</TableCell>
                    <TableCell>{destaque.usuario}</TableCell>
                    <TableCell>{destaque.produto}</TableCell>
                    <TableCell>{destaque.data}</TableCell>
                    <TableCell className="text-green-600">{destaque.valor}</TableCell>
                    <TableCell>
                      <Badge variant={destaque.status === "Ativo" ? "default" : "secondary"}>
                        {destaque.status}
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

export default Destaques;
