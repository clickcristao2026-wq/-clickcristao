import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

import bazarIcon from "@/assets/icons/categorias/bazar.png";
import outletIcon from "@/assets/icons/categorias/outlet.png";
import digitalIcon from "@/assets/icons/categorias/digital.png";
import produtoIcon from "@/assets/icons/categorias/produto.png";
import imobiliarioIcon from "@/assets/icons/categorias/imobiliario.png";
import maquinarioIcon from "@/assets/icons/categorias/maquinario.png";
import motocicletaIcon from "@/assets/icons/categorias/motocicleta.png";
import transporteIcon from "@/assets/icons/categorias/transporte.png";
import aeronaveIcon from "@/assets/icons/categorias/aeronave.png";
import nauticoIcon from "@/assets/icons/categorias/nautico.png";
import servicoIcon from "@/assets/icons/categorias/servico.png";
import feiraIcon from "@/assets/icons/categorias/feira.png";

const categorias = [
  { nome: "Bazar", quantidade: 245, icone: bazarIcon, cor: "#2035F2" },
  { nome: "Outlet", quantidade: 128, icone: outletIcon, cor: "#10B981" },
  { nome: "Digital", quantidade: 89, icone: digitalIcon, cor: "#F59E0B" },
  { nome: "Produto", quantidade: 567, icone: produtoIcon, cor: "#EF4444" },
  { nome: "Imobiliário", quantidade: 34, icone: imobiliarioIcon, cor: "#8B5CF6" },
  { nome: "Maquinário", quantidade: 56, icone: maquinarioIcon, cor: "#EC4899" },
  { nome: "Motocicleta", quantidade: 78, icone: motocicletaIcon, cor: "#14B8A6" },
  { nome: "Transporte", quantidade: 45, icone: transporteIcon, cor: "#F97316" },
  { nome: "Aeronave", quantidade: 12, icone: aeronaveIcon, cor: "#6366F1" },
  { nome: "Náutico", quantidade: 23, icone: nauticoIcon, cor: "#0EA5E9" },
  { nome: "Serviço", quantidade: 156, icone: servicoIcon, cor: "#84CC16" },
  { nome: "Feira", quantidade: 89, icone: feiraIcon, cor: "#A855F7" },
];

const meses = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const AdminCadastrados = () => {
  const dadosGrafico = categorias.map(cat => ({
    name: cat.nome,
    value: cat.quantidade,
    color: cat.cor
  }));

  const total = categorias.reduce((acc, cat) => acc + cat.quantidade, 0);

  return (
    <AdminLayout title="Cadastrados - Produtos e Anúncios">
      <div className="space-y-6">
        <div className="flex justify-end">
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

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
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
              <span className="text-lg font-medium">Total de Cadastros</span>
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
                  <Tooltip formatter={(value: number) => [`${value} cadastros`, 'Quantidade']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminCadastrados;
