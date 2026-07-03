import FinanceiroLayout from "@/components/FinanceiroLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wallet, Plus } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const meses = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const tiposCusto = ["Total", "Cupom", "Voucher", "Frete", "My Doots", "Amparo", "Premiação", "Rifa"];

const historicoCustos = [
  { id: "CST001", tipo: "Cupom", finalidade: "Campanha Black Friday", periodo: "15/01/2025", valor: "R$ 5.000,00", responsavel: "Marketing" },
  { id: "CST002", tipo: "Frete", finalidade: "Frete grátis promocional", periodo: "14/01/2025", valor: "R$ 3.200,00", responsavel: "Logística" },
  { id: "CST003", tipo: "Voucher", finalidade: "Programa fidelidade", periodo: "13/01/2025", valor: "R$ 2.800,00", responsavel: "Marketing" },
  { id: "CST004", tipo: "Premiação", finalidade: "Sorteio mensal", periodo: "12/01/2025", valor: "R$ 1.500,00", responsavel: "Comercial" },
  { id: "CST005", tipo: "My Doots", finalidade: "Cashback clientes", periodo: "11/01/2025", valor: "R$ 4.300,00", responsavel: "Financeiro" },
  { id: "CST006", tipo: "Amparo", finalidade: "Programa social", periodo: "10/01/2025", valor: "R$ 2.000,00", responsavel: "Social" },
  { id: "CST007", tipo: "Rifa", finalidade: "Prêmio rifa mensal", periodo: "09/01/2025", valor: "R$ 8.900,00", responsavel: "Comercial" },
];

const Custos = () => {
  const [mesSelecionado, setMesSelecionado] = useState("Janeiro");
  const [filtroTipo, setFiltroTipo] = useState("Total");

  const custosFiltrados = filtroTipo === "Total" 
    ? historicoCustos 
    : historicoCustos.filter(c => c.tipo === filtroTipo);

  const totalCustos = historicoCustos.reduce((acc, c) => {
    const valor = parseFloat(c.valor.replace("R$ ", "").replace(".", "").replace(",", "."));
    return acc + valor;
  }, 0);

  return (
    <FinanceiroLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Custos</h1>
            <p className="text-muted-foreground">Registro de custos da plataforma</p>
          </div>
          <div className="flex gap-2">
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
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Registro
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Registrar Novo Custo</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Tipo</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {tiposCusto.filter(t => t !== "Total").map((tipo) => (
                          <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Finalidade</Label>
                    <Input placeholder="Descreva a finalidade" />
                  </div>
                  <div>
                    <Label>Período</Label>
                    <Input type="date" />
                  </div>
                  <div>
                    <Label>Valor</Label>
                    <Input placeholder="R$ 0,00" />
                  </div>
                  <div>
                    <Label>Responsável</Label>
                    <Input placeholder="Setor responsável" />
                  </div>
                  <Button className="w-full">Salvar Registro</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Valor Total de Custos</CardTitle>
            <Wallet className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">
              R$ {totalCustos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">Total de custos em {mesSelecionado}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Histórico de Custos</CardTitle>
              <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filtrar por tipo" />
                </SelectTrigger>
                <SelectContent>
                  {tiposCusto.map((tipo) => (
                    <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Finalidade</TableHead>
                  <TableHead>Período</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Responsável</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {custosFiltrados.map((custo) => (
                  <TableRow key={custo.id}>
                    <TableCell className="font-medium">{custo.id}</TableCell>
                    <TableCell>{custo.tipo}</TableCell>
                    <TableCell>{custo.finalidade}</TableCell>
                    <TableCell>{custo.periodo}</TableCell>
                    <TableCell className="text-destructive">{custo.valor}</TableCell>
                    <TableCell>{custo.responsavel}</TableCell>
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

export default Custos;
