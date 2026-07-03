import FinanceiroLayout from "@/components/FinanceiroLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const meses = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

// Venda Variável = soma das taxas da plataforma (Bazar 1250 + Outlet 890 + Digital 1560 + Produtos 4580 + Feira 520 = 8800)
const faturamentoData = {
  vendaVariavel: 8800.00,      // Somatória tx da plataforma (inclui Feira)
  vendaFixa: 24200.00,         // Corrigido (+100)
  rifas: 16750.00,
  destaques: 11544.40,
  multasRecuperadas: 2890.00,
  custos: 27700.00,
};

const totalReceitas = 
  faturamentoData.vendaVariavel + 
  faturamentoData.vendaFixa + 
  faturamentoData.rifas + 
  faturamentoData.destaques + 
  faturamentoData.multasRecuperadas;

const receita = totalReceitas - faturamentoData.custos;

const chartData = [
  { name: "Venda Variável", value: faturamentoData.vendaVariavel, color: "#3b82f6" },
  { name: "Venda Fixa (Anúncios)", value: faturamentoData.vendaFixa, color: "#10b981" },
  { name: "Rifas", value: faturamentoData.rifas, color: "#f59e0b" },
  { name: "Destaques", value: faturamentoData.destaques, color: "#8b5cf6" },
  { name: "Multas Recuperadas", value: faturamentoData.multasRecuperadas, color: "#ef4444" },
];

const totalChart = chartData.reduce((acc, d) => acc + d.value, 0);

const Faturamento = () => {
  const [mesSelecionado, setMesSelecionado] = useState("Janeiro");

  return (
    <FinanceiroLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Faturamento</h1>
            <p className="text-muted-foreground">Contabilidade geral da plataforma</p>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Composição do Faturamento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => {
                        const pct = ((value / totalChart) * 100).toFixed(0);
                        const shortName = name.length > 16 ? name.substring(0, 14) + "..." : name;
                        return `${shortName} ${pct}%`;
                      }}
                      fontSize={11}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Receitas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-muted-foreground">Venda Variável (% plataforma)</span>
                  <span className="font-medium text-green-600">+ R$ {faturamentoData.vendaVariavel.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-muted-foreground">Venda Fixa (Anúncios)</span>
                  <span className="font-medium text-green-600">+ R$ {faturamentoData.vendaFixa.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-muted-foreground">Valor Rifas Arrecadadas</span>
                  <span className="font-medium text-green-600">+ R$ {faturamentoData.rifas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-muted-foreground">Valor Destaques Realizados</span>
                  <span className="font-medium text-green-600">+ R$ {faturamentoData.destaques.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-muted-foreground">Valor Multas Recuperadas</span>
                  <span className="font-medium text-green-600">+ R$ {faturamentoData.multasRecuperadas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingDown className="w-5 h-5 text-destructive" />
                  Despesas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center py-2">
                  <span className="text-muted-foreground">Valor de Custos</span>
                  <span className="font-medium text-destructive">- R$ {faturamentoData.custos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-primary/5 border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-primary" />
                  Resultado
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center py-2">
                  <span className="text-lg font-semibold">Valor da Receita Total</span>
                  <span className="text-2xl font-bold text-primary">
                    R$ {receita.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </FinanceiroLayout>
  );
};

export default Faturamento;
