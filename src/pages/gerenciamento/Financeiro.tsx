import { useState } from "react";
import { GerenciamentoLayout } from "@/components/GerenciamentoLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { TrendingUp, TrendingDown, DollarSign, Percent, Star, Ticket, AlertTriangle, Wallet } from "lucide-react";
import { dadosMensaisGerenciamento, mesesDoAno, calcularReceita } from "@/data/gerenciamentoDadosMensais";

const GerenciamentoFinanceiro = () => {
  const [mesSelecionado, setMesSelecionado] = useState("janeiro");
  const dados = dadosMensaisGerenciamento[mesSelecionado] || dadosMensaisGerenciamento.janeiro;

  const itensFinanceiros = [
    { nome: "Venda Variável", valor: dados.vendaVariavel, icon: Percent, cor: "#2035F2", tipo: "receita" },
    { nome: "Venda Fixa (Anúncios)", valor: dados.vendaFixa, icon: DollarSign, cor: "#10B981", tipo: "receita" },
    { nome: "Rifas Arrecadadas", valor: dados.rifas, icon: Ticket, cor: "#F59E0B", tipo: "receita" },
    { nome: "Destaques Realizados", valor: dados.destaques, icon: Star, cor: "#8B5CF6", tipo: "receita" },
    { nome: "Multas Recuperadas", valor: dados.multasRecuperadas, icon: AlertTriangle, cor: "#EF4444", tipo: "receita" },
    { nome: "Custos", valor: dados.custos, icon: Wallet, cor: "#6B7280", tipo: "despesa" },
  ];

  const totalReceitas = calcularReceita(dados);
  const valorReceita = totalReceitas - dados.custos;

  const dadosGrafico = itensFinanceiros.map(item => ({
    name: item.nome,
    value: item.valor,
    color: item.cor
  }));

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <GerenciamentoLayout title="Financeiro">
      <div className="space-y-6">
        {/* Filtro */}
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Sincronizado com: <span className="font-medium text-primary">Financeiro / Faturamento</span>
          </p>
          <Select value={mesSelecionado} onValueChange={setMesSelecionado}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrar por mês" />
            </SelectTrigger>
            <SelectContent>
              {mesesDoAno.map((mes) => (
                <SelectItem key={mes} value={mes.toLowerCase()}>{mes}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Cards de itens financeiros */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {itensFinanceiros.map((item) => (
            <Card key={item.nome} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div 
                    className="p-3 rounded-full"
                    style={{ backgroundColor: `${item.cor}15` }}
                  >
                    <item.icon 
                      className="h-6 w-6" 
                      style={{ color: item.cor }}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">{item.nome}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-xl font-bold" style={{ color: item.cor }}>
                        {formatCurrency(item.valor)}
                      </p>
                      {item.tipo === "receita" ? (
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Valor da Receita Total */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-lg font-medium text-muted-foreground">Valor da Receita</span>
                <p className="text-sm text-muted-foreground mt-1">Total = Receitas - Custos</p>
              </div>
              <div className="text-right">
                <span className="text-4xl font-bold text-primary">{formatCurrency(valorReceita)}</span>
                <div className="flex items-center justify-end gap-2 mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600">+12.5% este mês</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Gráfico de Pizza */}
        <Card>
          <CardHeader>
            <CardTitle>Composição Financeira</CardTitle>
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
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
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

export default GerenciamentoFinanceiro;
