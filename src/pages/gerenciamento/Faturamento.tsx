import { useState } from "react";
import { GerenciamentoLayout } from "@/components/GerenciamentoLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { TrendingUp, TrendingDown, ArrowRight } from "lucide-react";
import { dadosMensaisGerenciamento, mesesDoAno, calcularReceita } from "@/data/gerenciamentoDadosMensais";

const GerenciamentoFaturamento = () => {
  const [periodoDe, setPeriodoDe] = useState("janeiro");
  const [periodoAte, setPeriodoAte] = useState("março");

  const dadosFinDe = dadosMensaisGerenciamento[periodoDe] || dadosMensaisGerenciamento.janeiro;
  const dadosFinAte = dadosMensaisGerenciamento[periodoAte] || dadosMensaisGerenciamento.janeiro;

  const receitaDe = calcularReceita(dadosFinDe);
  const receitaAte = calcularReceita(dadosFinAte);
  const custoDe = dadosFinDe.custos;
  const custoAte = dadosFinAte.custos;

  const lucroLiquidoDe = receitaDe - custoDe;
  const lucroLiquidoAte = receitaAte - custoAte;

  const evolucaoReceita = receitaDe > 0 ? ((receitaAte - receitaDe) / receitaDe) * 100 : 0;
  const evolucaoCusto = custoDe > 0 ? ((custoAte - custoDe) / custoDe) * 100 : 0;
  const evolucaoLucro = lucroLiquidoDe > 0 ? ((lucroLiquidoAte - lucroLiquidoDe) / lucroLiquidoDe) * 100 : 0;

  const dadosGrafico = [
    { name: `Receita ${periodoDe}`, value: receitaDe, color: "#2035F2" },
    { name: `Receita ${periodoAte}`, value: receitaAte, color: "#10B981" },
    { name: `Custo ${periodoDe}`, value: custoDe, color: "#F59E0B" },
    { name: `Custo ${periodoAte}`, value: custoAte, color: "#EF4444" },
  ];

  const totalGrafico = dadosGrafico.reduce((acc, d) => acc + d.value, 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const formatPercent = (value: number) => {
    const prefix = value >= 0 ? "+" : "";
    return `${prefix}${value.toFixed(1)}%`;
  };

  return (
    <GerenciamentoLayout title="Faturamento">
      <div className="space-y-6">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">
              <strong>⚡ Sincronização:</strong> Dados sincronizados com <span className="font-medium text-primary">Gerenciamento / Financeiro</span> de cada mês.
            </p>
          </CardContent>
        </Card>

        {/* Seleção de Período */}
        <Card>
          <CardHeader>
            <CardTitle>Selecionar Período de Comparação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="flex-1 w-full">
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Período de:</label>
                <Select value={periodoDe} onValueChange={setPeriodoDe}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o mês inicial" />
                  </SelectTrigger>
                  <SelectContent>
                    {mesesDoAno.map((mes) => (
                      <SelectItem key={mes} value={mes.toLowerCase()}>{mes}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <ArrowRight className="h-6 w-6 text-muted-foreground hidden md:block" />
              <div className="flex-1 w-full">
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Período até:</label>
                <Select value={periodoAte} onValueChange={setPeriodoAte}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o mês final" />
                  </SelectTrigger>
                  <SelectContent>
                    {mesesDoAno.map((mes) => (
                      <SelectItem key={mes} value={mes.toLowerCase()}>{mes}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comparativo de Valores */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg capitalize">{periodoDe}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">Valor Receita:</span>
                <span className="font-bold text-primary">{formatCurrency(receitaDe)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">Valor Custo:</span>
                <span className="font-bold text-destructive">{formatCurrency(custoDe)}</span>
              </div>
              <div className="flex justify-between items-center py-2 bg-muted/50 rounded-lg px-3">
                <span className="font-medium">Lucro Líquido:</span>
                <span className="font-bold text-green-600">{formatCurrency(lucroLiquidoDe)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg capitalize">{periodoAte}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">Valor Receita:</span>
                <span className="font-bold text-primary">{formatCurrency(receitaAte)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">Valor Custo:</span>
                <span className="font-bold text-destructive">{formatCurrency(custoAte)}</span>
              </div>
              <div className="flex justify-between items-center py-2 bg-muted/50 rounded-lg px-3">
                <span className="font-medium">Lucro Líquido:</span>
                <span className="font-bold text-green-600">{formatCurrency(lucroLiquidoAte)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Card de Evolução */}
        <Card className="bg-gradient-to-r from-primary/5 to-green-500/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Evolução do Período
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-background rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Evolução Receita</p>
                <div className="flex items-center justify-center gap-2">
                  {evolucaoReceita >= 0 ? (
                    <TrendingUp className="h-6 w-6 text-green-500" />
                  ) : (
                    <TrendingDown className="h-6 w-6 text-red-500" />
                  )}
                  <span className={`text-3xl font-bold ${evolucaoReceita >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatPercent(evolucaoReceita)}
                  </span>
                </div>
              </div>
              <div className="text-center p-4 bg-background rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Evolução Custo</p>
                <div className="flex items-center justify-center gap-2">
                  {evolucaoCusto <= 0 ? (
                    <TrendingDown className="h-6 w-6 text-green-500" />
                  ) : (
                    <TrendingUp className="h-6 w-6 text-red-500" />
                  )}
                  <span className={`text-3xl font-bold ${evolucaoCusto <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatPercent(evolucaoCusto)}
                  </span>
                </div>
              </div>
              <div className="text-center p-4 bg-background rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Evolução Lucro</p>
                <div className="flex items-center justify-center gap-2">
                  {evolucaoLucro >= 0 ? (
                    <TrendingUp className="h-6 w-6 text-green-500" />
                  ) : (
                    <TrendingDown className="h-6 w-6 text-red-500" />
                  )}
                  <span className={`text-3xl font-bold ${evolucaoLucro >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatPercent(evolucaoLucro)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Gráfico de Pizza */}
        <Card>
          <CardHeader>
            <CardTitle>Comparativo Visual do Período</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dadosGrafico}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={140}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => {
                      const pct = ((value / totalGrafico) * 100).toFixed(0);
                      return `${name} ${pct}%`;
                    }}
                    fontSize={8}
                  >
                    {dadosGrafico.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [formatCurrency(value), 'Valor']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </GerenciamentoLayout>
  );
};

export default GerenciamentoFaturamento;
