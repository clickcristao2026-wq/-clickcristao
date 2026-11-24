import { useState } from "react";
import { GerenciamentoLayout } from "@/components/GerenciamentoLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { TrendingUp, TrendingDown, DollarSign, Percent, Star, Ticket, AlertTriangle, Wallet } from "lucide-react";
import { dadosMensaisGerenciamento, mesesDoAno, calcularReceita, formatarCentavos } from "@/data/gerenciamentoDadosMensais";

const GerenciamentoFinanceiro = () => {
  const [mesSelecionado, setMesSelecionado] = useState("janeiro");
  const dados = dadosMensaisGerenciamento[mesSelecionado] || dadosMensaisGerenciamento.janeiro;

  const itensFinanceiros = [
    { nome: "Venda Variável", valor: dados.vendaVariavel, icon: Percent, cor: "#2035F2", tipo: "receita" },
    { nome: "Venda Fixa (Anúncios)", valor: dados.vendaFixa + dados.parceiro, icon: DollarSign, cor: "#10B981", tipo: "receita" },
    { nome: "inBox Arrecadado", valor: dados.inbox, icon: Ticket, cor: "#F59E0B", tipo: "receita" },
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

  return (
    <GerenciamentoLayout title="Financeiro">
      <div className="space-y-6">
        {/* Filtro */}
        <div className="flex flex-wrap justify-between items-center gap-3">
          <p className="text-sm text-muted-foreground">
            Dados demonstrativos de 2025, compartilhados com <span className="font-medium text-primary">Financeiro / Faturamento</span>
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
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-muted-foreground">{item.nome}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-xl font-bold" style={{ color: item.cor }}>
                        {formatarCentavos(item.valor)}
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
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-lg font-medium text-muted-foreground">Resultado líquido</span>
                <p className="text-sm text-muted-foreground mt-1">Total = Receitas - Custos</p>
              </div>
              <div className="sm:text-right">
                <span className="text-3xl font-bold text-primary sm:text-4xl">{formatarCentavos(valorReceita)}</span>
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
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dadosGrafico}
                    cx="50%"
                    cy="50%"
                    outerRadius="90%"
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {dadosGrafico.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [formatarCentavos(value), 'Valor']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="grid gap-2 text-sm sm:grid-cols-2">
              {dadosGrafico.map(({ name, value, color }) => (
                <li key={name} className="flex items-center gap-2">
                  <span aria-hidden="true" className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: color }} />
                  <span>{name} · {formatarCentavos(value)}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </GerenciamentoLayout>
  );
};

export default GerenciamentoFinanceiro;
