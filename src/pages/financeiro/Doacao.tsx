import FinanceiroLayout from "@/components/FinanceiroLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Heart } from "lucide-react";
import { useState } from "react";

const meses = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const historicoDoacoes = [
  { id: "DOA001", doador: "Anônimo", beneficiario: "Igreja São Paulo", valor: "R$ 500,00", data: "15/01/2025" },
  { id: "DOA002", doador: "João Silva", beneficiario: "Projeto Amparo", valor: "R$ 150,00", data: "14/01/2025" },
  { id: "DOA003", doador: "Maria Santos", beneficiario: "Casa de Acolhimento", valor: "R$ 300,00", data: "13/01/2025" },
  { id: "DOA004", doador: "Anônimo", beneficiario: "Missão Cristã", valor: "R$ 1.000,00", data: "12/01/2025" },
  { id: "DOA005", doador: "Pedro Costa", beneficiario: "Igreja São Paulo", valor: "R$ 200,00", data: "11/01/2025" },
  { id: "DOA006", doador: "Ana Oliveira", beneficiario: "Projeto Amparo", valor: "R$ 80,00", data: "10/01/2025" },
];

const Doacao = () => {
  const [mesSelecionado, setMesSelecionado] = useState("Janeiro");

  const totalDoacoes = historicoDoacoes.reduce((acc, d) => {
    const valor = parseFloat(d.valor.replace("R$ ", "").replace(".", "").replace(",", "."));
    return acc + valor;
  }, 0);

  return (
    <FinanceiroLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Doação</h1>
            <p className="text-muted-foreground">Gestão de doações realizadas na plataforma</p>
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
              <CardTitle className="text-sm font-medium">Quantidade</CardTitle>
              <Heart className="h-4 w-4 text-pink-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{historicoDoacoes.length}</div>
              <p className="text-xs text-muted-foreground">Doações realizadas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Período</CardTitle>
              <Heart className="h-4 w-4 text-pink-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mesSelecionado}</div>
              <p className="text-xs text-muted-foreground">Mês selecionado</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
              <Heart className="h-4 w-4 text-pink-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-pink-600">
                R$ {totalDoacoes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-foreground">Total arrecadado</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Histórico de Doações - {mesSelecionado}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Doador</TableHead>
                  <TableHead>Beneficiário</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Data</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {historicoDoacoes.map((doacao) => (
                  <TableRow key={doacao.id}>
                    <TableCell className="font-medium">{doacao.id}</TableCell>
                    <TableCell>{doacao.doador}</TableCell>
                    <TableCell>{doacao.beneficiario}</TableCell>
                    <TableCell className="text-pink-600">{doacao.valor}</TableCell>
                    <TableCell>{doacao.data}</TableCell>
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

export default Doacao;
