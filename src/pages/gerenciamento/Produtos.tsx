import { GerenciamentoLayout } from "@/components/GerenciamentoLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

import bazarIcon from "@/assets/icons/categorias/bazar.png";
import outletIcon from "@/assets/icons/categorias/outlet.png";
import digitalIcon from "@/assets/icons/categorias/digital.png";
import produtoIcon from "@/assets/icons/categorias/produto.png";
import lojaIcon from "@/assets/icons/categorias/loja.png";

const categorias = [
  { nome: "Bazar", quantidade: 245, icone: bazarIcon, cor: "#2035F2" },
  { nome: "Outlet", quantidade: 128, icone: outletIcon, cor: "#10B981" },
  { nome: "Digital", quantidade: 89, icone: digitalIcon, cor: "#F59E0B" },
  { nome: "Produto", quantidade: 567, icone: produtoIcon, cor: "#EF4444" },
  { nome: "Feira", quantidade: 89, icone: lojaIcon, cor: "#EC4899" },
];

const meses = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const GerenciamentoProdutos = () => {
  const dadosGrafico = categorias.map(cat => ({
    name: cat.nome,
    value: cat.quantidade,
    color: cat.cor
  }));

  const total = categorias.reduce((acc, cat) => acc + cat.quantidade, 0);

  return (
    <GerenciamentoLayout title="Produtos">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Sincronizado com: <span className="font-medium text-primary">ADM / Cadastrados</span>
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

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
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
                  <Tooltip formatter={(value: number) => [`${value} produtos`, 'Quantidade']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </GerenciamentoLayout>
  );
};

export default GerenciamentoProdutos;
