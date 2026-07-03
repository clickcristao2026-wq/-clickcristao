import FinanceiroLayout from "@/components/FinanceiroLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, DollarSign, Link } from "lucide-react";
import { useState } from "react";

const meses = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const historicoComissoes = [
  { id: "COM001", afiliado: "Ricardo Santos", vendas: 45, comissao: "R$ 1.350,00", data: "15/01/2025", status: "Pendente" },
  { id: "COM002", afiliado: "Fernanda Lima", vendas: 32, comissao: "R$ 960,00", data: "14/01/2025", status: "Pago" },
  { id: "COM003", afiliado: "Bruno Costa", vendas: 28, comissao: "R$ 840,00", data: "13/01/2025", status: "Pago" },
  { id: "COM004", afiliado: "Juliana Alves", vendas: 67, comissao: "R$ 2.010,00", data: "12/01/2025", status: "Pendente" },
  { id: "COM005", afiliado: "Marcos Silva", vendas: 19, comissao: "R$ 570,00", data: "11/01/2025", status: "Pago" },
];

const Comissoes = () => {
  const [mesSelecionado, setMesSelecionado] = useState("Janeiro");

  return (
    <FinanceiroLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Comissões</h1>
            <p className="text-muted-foreground">Gestão de comissões para afiliados</p>
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

        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-primary">
              <Link className="w-4 h-4" />
              <span className="text-sm font-medium">Sincronizado com: Logística e Afiliado</span>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Quantidade de Afiliados</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89</div>
              <p className="text-xs text-muted-foreground">Afiliados ativos este mês</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Período de Fechamento</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">30/01/2025</div>
              <p className="text-xs text-muted-foreground">Próximo fechamento</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Valor de Repasse</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">R$ 18.730,00</div>
              <p className="text-xs text-muted-foreground">Total em comissões</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Histórico de Comissões - {mesSelecionado}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Afiliado</TableHead>
                  <TableHead>Vendas Realizadas</TableHead>
                  <TableHead>Comissão</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {historicoComissoes.map((comissao) => (
                  <TableRow key={comissao.id}>
                    <TableCell className="font-medium">{comissao.id}</TableCell>
                    <TableCell>{comissao.afiliado}</TableCell>
                    <TableCell>{comissao.vendas}</TableCell>
                    <TableCell className="text-green-600">{comissao.comissao}</TableCell>
                    <TableCell>{comissao.data}</TableCell>
                    <TableCell>
                      <Badge variant={comissao.status === "Pago" ? "default" : "secondary"}>
                        {comissao.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {comissao.status === "Pendente" && (
                        <Button size="sm" variant="outline">
                          <DollarSign className="w-3 h-3 mr-1" />
                          Pagar
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

export default Comissoes;
