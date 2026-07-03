import ComissionadoLayout from "@/components/ComissionadoLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, Send, Link, Package, ShoppingBag, Monitor } from "lucide-react";
import { useState } from "react";

const meses = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const comissoesPorCategoria = [
  { categoria: "Afiliados de Produtos", valor: 18500.00, icone: Package, cor: "text-blue-600" },
  { categoria: "Afiliados de Outlet", valor: 12350.00, icone: ShoppingBag, cor: "text-purple-600" },
  { categoria: "Afiliados Digital", valor: 15040.00, icone: Monitor, cor: "text-green-600" },
];

const historicoComissoes = [
  { id: "COM001", afiliado: "Ricardo Santos", categoria: "Produtos", vendas: 45, comissao: "R$ 1.350,00", data: "15/01/2025", status: "Pendente" },
  { id: "COM002", afiliado: "Fernanda Lima", categoria: "Digital", vendas: 32, comissao: "R$ 960,00", data: "14/01/2025", status: "Enviado" },
  { id: "COM003", afiliado: "Bruno Costa", categoria: "Outlet", vendas: 28, comissao: "R$ 840,00", data: "13/01/2025", status: "Enviado" },
  { id: "COM004", afiliado: "Juliana Alves", categoria: "Produtos", vendas: 67, comissao: "R$ 2.010,00", data: "12/01/2025", status: "Pendente" },
  { id: "COM005", afiliado: "Marcos Silva", categoria: "Digital", vendas: 19, comissao: "R$ 570,00", data: "11/01/2025", status: "Enviado" },
];

const Comissao = () => {
  const [mesSelecionado, setMesSelecionado] = useState("Janeiro");
  const totalComissoes = comissoesPorCategoria.reduce((acc, cat) => acc + cat.valor, 0);

  return (
    <ComissionadoLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Comissão</h1>
            <p className="text-muted-foreground">Valores para repasse aos afiliados</p>
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
              <span className="text-sm font-medium">Sincronizado com: Histórico de Revendas → Enviado para FINANCEIRO / COMISSÕES</span>
            </div>
          </CardContent>
        </Card>

        {/* Blocos fixos no cabeçalho */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {comissoesPorCategoria.map((cat) => (
            <Card key={cat.categoria}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{cat.categoria}</CardTitle>
                <cat.icone className={`h-4 w-4 ${cat.cor}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${cat.cor}`}>
                  R$ {cat.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-muted-foreground">
                  {((cat.valor / totalComissoes) * 100).toFixed(1)}% do total
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Total em Comissões abaixo */}
        <Card className="bg-green-50 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Total em Comissões</CardTitle>
            <DollarSign className="h-6 w-6 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-green-600">
              R$ {totalComissoes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-sm text-muted-foreground">Valor total para repasse em {mesSelecionado}</p>
          </CardContent>
        </Card>

        {/* Histórico sem botão azul no título */}
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
                  <TableHead>Categoria</TableHead>
                  <TableHead>Vendas</TableHead>
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
                    <TableCell>{comissao.categoria}</TableCell>
                    <TableCell>{comissao.vendas}</TableCell>
                    <TableCell className="text-green-600 font-medium">{comissao.comissao}</TableCell>
                    <TableCell>{comissao.data}</TableCell>
                    <TableCell>
                      <Badge variant={comissao.status === "Enviado" ? "default" : "secondary"}>
                        {comissao.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {comissao.status === "Pendente" && (
                        <Button size="sm" variant="outline">
                          <Send className="w-3 h-3 mr-1" />
                          Enviar
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
    </ComissionadoLayout>
  );
};

export default Comissao;
