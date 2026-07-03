import { AccountLayout } from "@/components/AccountLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";

const Compras = () => {
  const pedidos = [
    {
      id: "1235",
      data: "18/11/2025",
      status: "Em Trânsito",
      total: 89.90,
      itens: 2,
      statusColor: "bg-blue-500",
    },
    {
      id: "1234",
      data: "15/11/2025",
      status: "Entregue",
      total: 245.50,
      itens: 3,
      statusColor: "bg-green-500",
    },
    {
      id: "1233",
      data: "10/11/2025",
      status: "Cancelado",
      total: 150.00,
      itens: 1,
      statusColor: "bg-destructive",
    },
  ];

  return (
    <AccountLayout title="Minhas Compras">
      <div className="space-y-4">
        {pedidos.map((pedido) => (
          <Card key={pedido.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Package className="h-5 w-5 text-primary" />
                  <span>Pedido #{pedido.id}</span>
                </div>
                <Badge className={`${pedido.statusColor} text-white`}>
                  {pedido.status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Data do Pedido</p>
                  <p className="font-medium">{pedido.data}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="font-medium">R$ {pedido.total.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Itens</p>
                  <p className="font-medium">{pedido.itens} produtos</p>
                </div>
                <div className="flex items-end justify-end">
                  <Button variant="outline" size="sm">
                    Ver Detalhes
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AccountLayout>
  );
};

export default Compras;
