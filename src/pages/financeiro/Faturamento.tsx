import { useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import FinanceiroLayout from "@/components/FinanceiroLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { calcularReceita, dadosMensaisGerenciamento, formatarCentavos, linhasReceita, mesesDoAno } from "@/data/gerenciamentoDadosMensais";

export default function Faturamento() {
  const [month, setMonth] = useState("Janeiro");
  const data = dadosMensaisGerenciamento[month.toLowerCase()];
  const total = calcularReceita(data);
  const chartData = linhasReceita.filter(({ key }) => data[key] > 0).map((line) => ({ ...line, value: data[line.key] }));
  const showChart = total > 0 && linhasReceita.every(({ key }) => data[key] >= 0);

  return (
    <FinanceiroLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold">Faturamento</h2>
            <p className="text-sm text-muted-foreground">Dados demonstrativos de 2025</p>
          </div>
          <Select value={month} onValueChange={setMonth}>
            <SelectTrigger aria-label="Selecionar mês" className="w-48"><SelectValue /></SelectTrigger>
            <SelectContent>
              {mesesDoAno.map((name) => <SelectItem key={name} value={name}>{name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <Card>
            <CardHeader><CardTitle>Composição do Faturamento</CardTitle></CardHeader>
            <CardContent>
              {showChart ? (
                <>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={chartData} dataKey="value" nameKey="name" outerRadius="90%">
                          {chartData.map(({ key, color }) => <Cell key={key} fill={color} />)}
                        </Pie>
                        <Tooltip formatter={(value: number) => formatarCentavos(value)} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <ul className="grid gap-2 text-sm sm:grid-cols-2">
                    {chartData.map(({ key, name, value, color }) => (
                      <li key={key} className="flex items-center gap-2">
                        <span aria-hidden="true" className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: color }} />
                        <span>{name} · {(100 * value / total).toLocaleString("pt-BR", { maximumFractionDigits: 2 })}%</span>
                      </li>
                    ))}
                  </ul>
                </>
              ) : <p className="text-sm text-muted-foreground">Sem composição de receitas para este período.</p>}
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card>
              <CardHeader><CardTitle className="text-lg">Receitas</CardTitle></CardHeader>
              <CardContent>
                <dl className="divide-y">
                  {linhasReceita.map(({ key, label }) => (
                    <div key={key} className="flex justify-between gap-3 py-2">
                      <dt className="text-muted-foreground">{label}</dt>
                      <dd className="shrink-0 font-medium tabular-nums">{formatarCentavos(data[key])}</dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-lg">Despesas</CardTitle></CardHeader>
              <CardContent className="flex justify-between gap-3">
                <span className="text-muted-foreground">Valor de Custos</span>
                <span className="shrink-0 font-medium text-destructive tabular-nums">{formatarCentavos(data.custos)}</span>
              </CardContent>
            </Card>
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader><CardTitle className="text-lg">Resultado</CardTitle></CardHeader>
              <CardContent>
                <dl className="space-y-3">
                  <div className="flex justify-between gap-3">
                    <dt className="font-semibold">Valor da Receita Total</dt>
                    <dd className="shrink-0 font-bold text-primary tabular-nums">{formatarCentavos(total)}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt>Resultado líquido</dt>
                    <dd className="shrink-0 font-semibold tabular-nums">{formatarCentavos(total - data.custos)}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </FinanceiroLayout>
  );
}
