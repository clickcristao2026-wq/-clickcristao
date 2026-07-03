import ComissionadoLayout from "@/components/ComissionadoLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Package, ShoppingBag, Monitor } from "lucide-react";

const categorias = [
  { nome: "Afiliados de Produtos", quantidade: 1248, icone: Package, cor: "text-blue-600", bgCor: "bg-blue-100" },
  { nome: "Afiliados de Outlet", quantidade: 856, icone: ShoppingBag, cor: "text-purple-600", bgCor: "bg-purple-100" },
  { nome: "Afiliados Digital", quantidade: 2134, icone: Monitor, cor: "text-green-600", bgCor: "bg-green-100" },
];

const Cadastrados = () => {
  const totalAfiliados = categorias.reduce((acc, cat) => acc + cat.quantidade, 0);

  return (
    <ComissionadoLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Cadastrados</h1>
          <p className="text-muted-foreground">Quantidade de afiliados cadastrados na plataforma</p>
        </div>

        {/* Blocos fixos no cabeçalho */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categorias.map((cat) => (
            <Card key={cat.nome} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium">{cat.nome}</CardTitle>
                <div className={`p-2 rounded-full ${cat.bgCor}`}>
                  <cat.icone className={`h-5 w-5 ${cat.cor}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold ${cat.cor}`}>
                  {cat.quantidade.toLocaleString()}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {((cat.quantidade / totalAfiliados) * 100).toFixed(1)}% do total
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Total de Afiliados abaixo */}
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Total de Afiliados</CardTitle>
            <Users className="h-6 w-6 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary">{totalAfiliados.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground">Afiliados ativos na plataforma</p>
          </CardContent>
        </Card>
      </div>
    </ComissionadoLayout>
  );
};

export default Cadastrados;
