import { useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { DashboardIcon } from "./DashboardIcon";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { DashboardCategory } from "@/data/dashboardCategories";
import { mesesDoAno } from "@/data/gerenciamentoDadosMensais";

export function DashboardCategorySummary({ categories, totalLabel }: {
  categories: DashboardCategory[];
  totalLabel: string;
}) {
  const [month, setMonth] = useState("todos");
  const hasData = month === "todos";
  const total = categories.reduce((sum, category) => sum + category.quantidade, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {hasData ? "Dados demonstrativos sem divisão mensal." : "Sem dados para este mês."}
        </p>
        <Select value={month} onValueChange={setMonth}>
          <SelectTrigger aria-label="Filtrar por mês" className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os meses</SelectItem>
            {mesesDoAno.map((name) => <SelectItem key={name} value={name}>{name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {categories.map(({ id, nome, quantidade, icone, cor, corIcone = cor }) => (
          <Card key={id} className="hover:shadow-md transition-shadow">
            <CardContent className="flex flex-col items-center gap-2 p-4 text-center">
              <div className="rounded-full p-3" style={{ backgroundColor: `${cor}15` }}>
                <DashboardIcon src={icone} color={corIcone} className="block h-6 w-6" />
              </div>
              <p className="text-2xl font-bold" style={{ color: cor }}>{hasData ? quantidade : "—"}</p>
              <p className="break-words text-sm text-muted-foreground">{nome}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardContent className="flex items-center justify-between gap-3 p-4">
          <span className="text-lg font-medium">{totalLabel}</span>
          <span className="text-3xl font-bold text-primary">{hasData ? total : "—"}</span>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Distribuição por Categoria</CardTitle></CardHeader>
        <CardContent>
          {hasData ? (
            <>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={categories} dataKey="quantidade" nameKey="nome" outerRadius="90%">
                      {categories.map(({ id, cor }) => <Cell key={id} fill={cor} />)}
                    </Pie>
                    <Tooltip formatter={(value: number) => [value, "Quantidade"]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <ul className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-3 lg:grid-cols-4">
                {categories.map(({ id, nome, quantidade, cor }) => (
                  <li key={id} className="flex items-center gap-2">
                    <span aria-hidden="true" className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: cor }} />
                    <span>{nome} · {(100 * quantidade / total).toFixed(0)}%</span>
                  </li>
                ))}
              </ul>
            </>
          ) : <p className="text-sm text-muted-foreground">Sem dados para exibir no gráfico.</p>}
        </CardContent>
      </Card>
    </div>
  );
}
