import { AccountLayout } from "@/components/AccountLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, TrendingUp, AlertCircle, Percent } from "lucide-react";
import { useState } from "react";

const FinanceiroVendedor = () => {
  const [ordenarPor, setOrdenarPor] = useState("saldo");

  const transacoes = [
    { id: 1, tipo: "credito", descricao: "Venda - Pedido #1234", valor: 150.00, data: "20/01/2025" },
    { id: 2, tipo: "debito", descricao: "Taxa plataforma - Pedido #1234", valor: 15.00, data: "20/01/2025" },
    { id: 3, tipo: "credito", descricao: "Venda - Pedido #1235", valor: 89.90, data: "18/01/2025" },
    { id: 4, tipo: "debito", descricao: "Taxa plataforma - Pedido #1235", valor: 8.99, data: "18/01/2025" },
    { id: 5, tipo: "credito", descricao: "Venda - Pedido #1233", valor: 245.50, data: "15/01/2025" },
  ];

  return (
    <AccountLayout title="Financeiro">
      <div className="space-y-6">
        {/* Cards de resumo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Saldo Disponível
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <span className="text-2xl font-bold">R$ 461,41</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total em Vendas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span className="text-2xl font-bold">R$ 485,40</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Valor Devedor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-destructive" />
                <span className="text-2xl font-bold">R$ 0,00</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Taxa Plataforma
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Percent className="h-5 w-5 text-yellow-600" />
                <span className="text-2xl font-bold">R$ 23,99</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Histórico de transações */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Histórico de Transações</CardTitle>
            <Select value={ordenarPor} onValueChange={setOrdenarPor}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="saldo">Saldo Disponível</SelectItem>
                <SelectItem value="vendas">Total Vendas</SelectItem>
                <SelectItem value="data">Data</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transacoes.map((transacao) => (
                <div
                  key={transacao.id}
                  className="flex justify-between items-center p-4 bg-muted rounded-lg"
                >
                  <div>
                    <p className="font-medium">{transacao.descricao}</p>
                    <p className="text-sm text-muted-foreground">{transacao.data}</p>
                  </div>
                  <span
                    className={`font-semibold ${
                      transacao.tipo === "credito"
                        ? "text-green-600"
                        : "text-destructive"
                    }`}
                  >
                    {transacao.tipo === "credito" ? "+" : "-"}R${" "}
                    {transacao.valor.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AccountLayout>
  );
};

export default FinanceiroVendedor;
