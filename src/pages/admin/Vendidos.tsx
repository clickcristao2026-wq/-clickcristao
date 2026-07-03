import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Eye, CheckCircle } from "lucide-react";

const produtosVendidos = [
  {
    id: 1,
    nome: "Bíblia Sagrada NVI",
    comprador: "Ana Paula",
    vendedor: "Livraria Cristã",
    valor: "R$ 89,90",
    pagamento: "Confirmado",
    data: "03/02/2026",
    status: "aguardando_envio"
  },
  {
    id: 2,
    nome: "Kit Camisetas Gospel",
    comprador: "Carlos Eduardo",
    vendedor: "Moda Cristã Store",
    valor: "R$ 149,90",
    pagamento: "Confirmado",
    data: "02/02/2026",
    status: "aguardando_envio"
  },
  {
    id: 3,
    nome: "CD Worship Collection",
    comprador: "Fernanda Lima",
    vendedor: "Gospel Music",
    valor: "R$ 45,00",
    pagamento: "Confirmado",
    data: "01/02/2026",
    status: "enviado"
  },
];

const AdminVendidos = () => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "aguardando_envio":
        return <Badge className="bg-yellow-500">Aguardando Envio</Badge>;
      case "enviado":
        return <Badge className="bg-green-500">Enviado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <AdminLayout title="Vendidos">
      <div className="space-y-6">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">
              <strong>Sincronização:</strong> Os produtos pagos são sincronizados com a gateway de pagamento e enviados para LOGÍSTICA / PEDIDOS para rastreamento.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Produtos Vendidos - Pagamento Confirmado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {produtosVendidos.map((produto) => (
                <div
                  key={produto.id}
                  className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <h4 className="font-medium">{produto.nome}</h4>
                    <p className="text-sm text-muted-foreground">
                      Comprador: {produto.comprador} | Vendedor: {produto.vendedor}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-semibold text-primary">{produto.valor}</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {produto.pagamento}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{produto.data}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(produto.status)}
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      Detalhes
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

export default AdminVendidos;
