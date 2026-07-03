import { AccountLayout } from "@/components/AccountLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShoppingCart, Calendar, DollarSign } from "lucide-react";
import { useState } from "react";

const Faturamento = () => {
  const [mesAtual, setMesAtual] = useState("janeiro");

  const meses = [
    "janeiro", "fevereiro", "março", "abril", "maio", "junho",
    "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"
  ];

  const historicoVendas = [
    { id: 1, produto: "Produto A", valor: 150.00, data: "05/01/2025", status: "Concluída" },
    { id: 2, produto: "Produto B", valor: 89.90, data: "12/01/2025", status: "Concluída" },
    { id: 3, produto: "Produto C", valor: 245.50, data: "18/01/2025", status: "Concluída" },
    { id: 4, produto: "Produto D", valor: 320.00, data: "25/01/2025", status: "Pendente" },
  ];

  const totalVendas = historicoVendas.reduce((acc, venda) => acc + venda.valor, 0);

  return (
    <AccountLayout title="Faturamento">
      <div className="space-y-6">
        {/* Cards de resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Quantidade de Vendas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-primary" />
                <span className="text-2xl font-bold">{historicoVendas.length}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Período de Fechamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span className="text-2xl font-bold capitalize">{mesAtual}/2025</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Valor em Vendas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <span className="text-2xl font-bold">R$ {totalVendas.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Histórico de vendas */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Histórico de Vendas</CardTitle>
            <Select value={mesAtual} onValueChange={setMesAtual}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Selecione o mês" />
              </SelectTrigger>
              <SelectContent>
                {meses.map((mes) => (
                  <SelectItem key={mes} value={mes} className="capitalize">
                    {mes.charAt(0).toUpperCase() + mes.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {historicoVendas.map((venda) => (
                <div
                  key={venda.id}
                  className="flex justify-between items-center p-4 bg-muted rounded-lg"
                >
                  <div>
                    <p className="font-medium">{venda.produto}</p>
                    <p className="text-sm text-muted-foreground">{venda.data}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-green-600">
                      R$ {venda.valor.toFixed(2)}
                    </span>
                    <p className={`text-sm ${venda.status === "Concluída" ? "text-green-600" : "text-yellow-600"}`}>
                      {venda.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AccountLayout>
  );
};

export default Faturamento;
