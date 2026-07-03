import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, Eye, CheckCircle, XCircle, Clock } from "lucide-react";

const produtosPendentes = [
  {
    id: 1,
    nome: "Bíblia Sagrada Edição Luxo",
    vendedor: "Livraria Cristã",
    categoria: "Produto",
    dataEnvio: "02/02/2026",
    status: "pendente",
    imagem: "/placeholder.svg"
  },
  {
    id: 2,
    nome: "Camiseta Gospel - Fé",
    vendedor: "Moda Cristã Store",
    categoria: "Produto",
    dataEnvio: "01/02/2026",
    status: "pendente",
    imagem: "/placeholder.svg"
  },
  {
    id: 3,
    nome: "CD Louvor e Adoração",
    vendedor: "Gospel Music",
    categoria: "Digital",
    dataEnvio: "31/01/2026",
    status: "pendente",
    imagem: "/placeholder.svg"
  },
];

const AdminProdutos = () => {
  return (
    <AdminLayout title="Produtos">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Produtos Aguardando Aprovação
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Confira os produtos enviados pelos vendedores e aprove para publicação na plataforma
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {produtosPendentes.map((produto) => (
                <div
                  key={produto.id}
                  className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <img
                    src={produto.imagem}
                    alt={produto.nome}
                    className="w-20 h-20 object-cover rounded-lg border"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">{produto.nome}</h4>
                    <p className="text-sm text-muted-foreground">
                      Vendedor: {produto.vendedor}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">{produto.categoria}</Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {produto.dataEnvio}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      Visualizar
                    </Button>
                    <Button 
                      size="sm" 
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Aprovar
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Rejeitar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminProdutos;
