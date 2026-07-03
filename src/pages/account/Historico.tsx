import { AccountLayout } from "@/components/AccountLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye } from "lucide-react";

const Historico = () => {
  const produtosAcessados = [
    { id: 1, nome: "Bíblia Sagrada NVI", data: "20/11/2025", categoria: "Produto" },
    { id: 2, nome: "Camiseta Gospel", data: "18/11/2025", categoria: "Bazar" },
    { id: 3, nome: "E-book Devocional", data: "15/11/2025", categoria: "Digital" },
    { id: 4, nome: "CD Gospel Worship", data: "12/11/2025", categoria: "Outlet" },
    { id: 5, nome: "Quadro Decorativo Cristão", data: "10/11/2025", categoria: "Produto" },
  ];

  return (
    <AccountLayout title="Histórico">
      <div className="space-y-6">
        <p className="text-muted-foreground">
          Produtos acessados na plataforma pelo usuário consumidor.
        </p>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Produtos Visualizados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {produtosAcessados.map((produto) => (
                <div
                  key={produto.id}
                  className="flex justify-between items-center p-4 bg-muted rounded-lg"
                >
                  <div>
                    <p className="font-medium">{produto.nome}</p>
                    <p className="text-sm text-muted-foreground">{produto.categoria}</p>
                  </div>
                  <span className="text-sm text-muted-foreground">{produto.data}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AccountLayout>
  );
};

export default Historico;
