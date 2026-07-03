import { GerenciamentoLayout } from "@/components/GerenciamentoLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

import produtosIcon from "@/assets/icons/lojas/produtos.png";
import motoresIcon from "@/assets/icons/lojas/motores.png";
import imobiliariasIcon from "@/assets/icons/lojas/imobiliarias.png";
import corporativosIcon from "@/assets/icons/lojas/corporativos.png";
import feirasIcon from "@/assets/icons/lojas/feiras.png";
import oficiaisIcon from "@/assets/icons/lojas/oficiais.png";

const categorias = [
  { nome: "Produtos", quantidade: 234, icone: produtosIcon, cor: "#EF4444" },
  { nome: "Motores", quantidade: 87, icone: motoresIcon, cor: "#14B8A6" },
  { nome: "Imobiliárias", quantidade: 45, icone: imobiliariasIcon, cor: "#8B5CF6" },
  { nome: "Corporativos", quantidade: 62, icone: corporativosIcon, cor: "#F97316" },
  { nome: "Feiras", quantidade: 38, icone: feirasIcon, cor: "#EC4899" },
  { nome: "Oficiais", quantidade: 29, icone: oficiaisIcon, cor: "#0EA5E9" },
];

const meses = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const GerenciamentoLojas = () => {
  const dadosGrafico = categorias.map(cat => ({
    name: cat.nome,
    value: cat.quantidade,
    color: cat.cor
  }));

  const total = categorias.reduce((acc, cat) => acc + cat.quantidade, 0);

  return (
    <GerenciamentoLayout title="Lojas">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Sincronizado com: <span className="font-medium text-primary">ADM / Registrados</span>
          </p>
          <Select defaultValue="todos">
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrar por mês" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os meses</SelectItem>
              {meses.map((mes, index) => (
                <SelectItem key={index} value={mes.toLowerCase()}>{mes}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categorias.map((categoria) => (
            <Card key={categoria.nome} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex flex-col items-center text-center gap-2">
                  <div 
                    className="p-3 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${categoria.cor}15` }}
                  >
                    <img 
                      src={categoria.icone} 
                      alt={categoria.nome} 
                      className="h-6 w-6"
                      style={{ filter: `brightness(0) saturate(100%)` }}
                    />
                  </div>
                  <div>
                    <p className="text-2xl font-bold" style={{ color: categoria.cor }}>
                      {categoria.quantidade}
                    </p>
                    <p className="text-sm text-muted-foreground">{categoria.nome}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-medium">Total Cadastrados</span>
              <span className="text-3xl font-bold text-primary">{total}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dadosGrafico}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    fontSize={8}
                  >
                    {dadosGrafico.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [`${value} lojas`, 'Quantidade']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </GerenciamentoLayout>
  );
};

export default GerenciamentoLojas;
