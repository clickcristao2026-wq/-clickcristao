import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Truck, Eye, MapPin, Clock, CheckCircle, Package } from "lucide-react";

const entregasPendentes = [
  {
    id: 1,
    codigo: "ENT-2026-001",
    produto: "Bíblia Sagrada NVI",
    comprador: "Ana Paula",
    endereco: "Rua das Flores, 123 - São Paulo/SP",
    transportadora: "Correios",
    rastreio: "BR123456789",
    status: "em_transito",
    previsao: "05/02/2026"
  },
  {
    id: 2,
    codigo: "ENT-2026-002",
    produto: "Kit Camisetas Gospel",
    comprador: "Carlos Eduardo",
    endereco: "Av. Brasil, 456 - Rio de Janeiro/RJ",
    transportadora: "JadLog",
    rastreio: "JD987654321",
    status: "saiu_entrega",
    previsao: "03/02/2026"
  },
  {
    id: 3,
    codigo: "ENT-2026-003",
    produto: "CD Worship Collection",
    comprador: "Fernanda Lima",
    endereco: "Rua da Paz, 789 - Belo Horizonte/MG",
    transportadora: "Correios",
    rastreio: "BR111222333",
    status: "entregue",
    previsao: "02/02/2026"
  },
];

const AdminEntregados = () => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "em_transito":
        return <Badge className="bg-blue-500">Em Trânsito</Badge>;
      case "saiu_entrega":
        return <Badge className="bg-yellow-500">Saiu para Entrega</Badge>;
      case "entregue":
        return <Badge className="bg-green-500">Entregue</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <AdminLayout title="Entregados">
      <div className="space-y-6">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">
              <strong>⚡ Sincronização:</strong> Este campo está sincronizado com LOGÍSTICA / ENTREGA para acompanhamento em tempo real das entregas.
            </p>
          </CardContent>
        </Card>

        {/* Cards de resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-blue-100">
                  <Truck className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-sm text-muted-foreground">Em Trânsito</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-yellow-100">
                  <Package className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">5</p>
                  <p className="text-sm text-muted-foreground">Saiu p/ Entrega</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-green-100">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">156</p>
                  <p className="text-sm text-muted-foreground">Entregues</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Acompanhamento de Entregas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {entregasPendentes.map((entrega) => (
                <div
                  key={entrega.id}
                  className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{entrega.codigo}</h4>
                      {getStatusBadge(entrega.status)}
                    </div>
                    <p className="text-sm font-medium">{entrega.produto}</p>
                    <p className="text-sm text-muted-foreground">
                      Comprador: {entrega.comprador}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {entrega.endereco}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                      <span>{entrega.transportadora} - {entrega.rastreio}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Previsão: {entrega.previsao}
                      </span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    Rastrear
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminEntregados;
