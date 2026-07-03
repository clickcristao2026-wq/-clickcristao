import { LogisticaLayout } from "@/components/LogisticaLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, Timer, Clock, AlertTriangle, XCircle, Truck, Eye } from "lucide-react";
import { useState } from "react";

interface Pedido {
  id: number;
  codigo: string;
  produto: string;
  comprador: string;
  vendedor: string;
  valor: string;
  dataPagamento: string;
  horasPagamento: number;
  status: "aguardando_envio" | "enviado" | "atrasado" | "cancelado";
}

const pedidosMock: Pedido[] = [
  {
    id: 1, codigo: "PED-2026-089", produto: "Bíblia Sagrada NVI",
    comprador: "Ana Paula Silva", vendedor: "Livraria Cristã",
    valor: "R$ 89,90", dataPagamento: "03/02/2026 10:30", horasPagamento: 12, status: "aguardando_envio"
  },
  {
    id: 2, codigo: "PED-2026-088", produto: "Kit Camisetas Gospel",
    comprador: "Carlos Eduardo", vendedor: "Moda Cristã Store",
    valor: "R$ 149,90", dataPagamento: "02/02/2026 14:00", horasPagamento: 26, status: "atrasado"
  },
  {
    id: 3, codigo: "PED-2026-087", produto: "CD Worship Collection",
    comprador: "Fernanda Lima", vendedor: "Gospel Music",
    valor: "R$ 45,00", dataPagamento: "02/02/2026 09:00", horasPagamento: 4, status: "enviado"
  },
  {
    id: 4, codigo: "PED-2026-086", produto: "Quadro Decorativo",
    comprador: "Roberto Santos", vendedor: "Arte Sacra",
    valor: "R$ 120,00", dataPagamento: "01/02/2026 16:00", horasPagamento: 0, status: "cancelado"
  },
];

const LogisticaPedidos = () => {
  const [pedidos] = useState<Pedido[]>(pedidosMock);

  const getStatusBadge = (status: string, horas: number) => {
    if (status === "cancelado") return <Badge className="bg-gray-500">Cancelado</Badge>;
    if (status === "enviado") return <Badge className="bg-green-500">Enviado</Badge>;
    if (horas >= 24 || status === "atrasado") return <Badge className="bg-red-500">Atrasado (24h+)</Badge>;
    return <Badge className="bg-yellow-500">Aguardando Envio</Badge>;
  };

  const getTempoRestante = (horas: number) => {
    if (horas >= 24) return "Prazo expirado";
    return `${24 - horas}h restantes`;
  };

  const getTempoColor = (horas: number) => {
    if (horas >= 24) return "text-red-600";
    if (horas >= 20) return "text-orange-500";
    if (horas >= 12) return "text-yellow-600";
    return "text-green-600";
  };

  return (
    <LogisticaLayout title="Pedidos">
      <div className="space-y-6">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">
              <strong>⚡ Sincronização:</strong> Os produtos são sincronizados com o gateway de pagamento e ADM / VENDIDOS. 
              Temporizador de 24h ativo após confirmação do pagamento para monitoramento de postagem.
            </p>
          </CardContent>
        </Card>

        {/* Cards de resumo */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-blue-100">
                  <Package className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{pedidos.length}</p>
                  <p className="text-sm text-muted-foreground">Total Pedidos</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-yellow-100">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{pedidos.filter(p => p.status === "aguardando_envio").length}</p>
                  <p className="text-sm text-muted-foreground">Aguardando Envio</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-red-100">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{pedidos.filter(p => p.status === "atrasado" || p.horasPagamento >= 24).length}</p>
                  <p className="text-sm text-muted-foreground">Atrasados (24h+)</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-green-100">
                  <Truck className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{pedidos.filter(p => p.status === "enviado").length}</p>
                  <p className="text-sm text-muted-foreground">Enviados</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de pedidos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Histórico de Produtos Vendidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pedidos.map((pedido) => (
                <div
                  key={pedido.id}
                  className={`p-4 border rounded-lg ${
                    pedido.status === "atrasado" || pedido.horasPagamento >= 24
                      ? "border-red-200 bg-red-50/50"
                      : pedido.status === "cancelado"
                      ? "border-gray-200 bg-gray-50/50"
                      : "border-border hover:bg-muted/50"
                  } transition-colors`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{pedido.codigo}</h4>
                        {getStatusBadge(pedido.status, pedido.horasPagamento)}
                      </div>
                      <p className="text-sm font-medium">{pedido.produto}</p>
                      <p className="text-sm text-muted-foreground">
                        Comprador: {pedido.comprador} | Vendedor: {pedido.vendedor}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span className="font-semibold text-primary">{pedido.valor}</span>
                        <span>Pagamento: {pedido.dataPagamento}</span>
                      </div>
                      
                      {pedido.status !== "cancelado" && pedido.status !== "enviado" && (
                        <div className="flex items-center gap-2 mt-2">
                          <Timer className={`h-4 w-4 ${getTempoColor(pedido.horasPagamento)}`} />
                          <span className={`text-sm font-medium ${getTempoColor(pedido.horasPagamento)}`}>
                            {getTempoRestante(pedido.horasPagamento)}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        Detalhes
                      </Button>
                      
                      {pedido.status === "enviado" && (
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          <Truck className="h-4 w-4 mr-1" />
                          Entregas
                        </Button>
                      )}
                      
                      {(pedido.status === "atrasado" || pedido.horasPagamento >= 24) && 
                       pedido.status !== "cancelado" && pedido.status !== "enviado" && (
                        <Button size="sm" className="bg-red-600 hover:bg-red-700">
                          <Clock className="h-4 w-4 mr-1" />
                          Prazo 24h
                        </Button>
                      )}
                      
                      {pedido.status === "cancelado" && (
                        <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                          <XCircle className="h-4 w-4 mr-1" />
                          Cancelamento
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </LogisticaLayout>
  );
};

export default LogisticaPedidos;
