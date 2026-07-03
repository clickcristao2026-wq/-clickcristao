import { LogisticaLayout } from "@/components/LogisticaLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Truck, MapPin, Clock, Timer, CheckCircle, Eye, Package } from "lucide-react";

const entregas = [
  {
    id: 1,
    codigo: "ENT-2026-078",
    produto: "Bíblia Sagrada NVI",
    comprador: "Ana Paula Silva",
    endereco: "Rua das Flores, 123 - São Paulo/SP",
    rastreio: "BR123456789",
    transportadora: "Correios",
    status: "entregue",
    dataEntrega: "03/02/2026 14:30"
  },
  {
    id: 2,
    codigo: "ENT-2026-077",
    produto: "Kit Camisetas Gospel",
    comprador: "Carlos Eduardo",
    endereco: "Av. Brasil, 456 - Rio de Janeiro/RJ",
    rastreio: "JD987654321",
    transportadora: "JadLog",
    status: "entregue",
    dataEntrega: "03/02/2026 10:15"
  },
  {
    id: 3,
    codigo: "ENT-2026-076",
    produto: "Quadro Decorativo Cristão",
    comprador: "Fernanda Lima",
    endereco: "Rua da Paz, 789 - Belo Horizonte/MG",
    rastreio: "BR111222333",
    transportadora: "Correios",
    status: "em_transito",
    previsao: "04/02/2026"
  },
  {
    id: 4,
    codigo: "ENT-2026-075",
    produto: "Livro Devocional",
    comprador: "Roberto Santos",
    endereco: "Av. Paulista, 1000 - São Paulo/SP",
    rastreio: "BR444555666",
    transportadora: "Correios",
    status: "saiu_entrega",
    previsao: "03/02/2026"
  },
];

const LogisticaEntregas = () => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "entregue":
        return <Badge className="bg-green-500">Entregue</Badge>;
      case "em_transito":
        return <Badge className="bg-blue-500">Em Trânsito</Badge>;
      case "saiu_entrega":
        return <Badge className="bg-yellow-500">Saiu p/ Entrega</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <LogisticaLayout title="Entregas">
      <div className="space-y-6">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">
              <strong>⚠️ Importante:</strong> Após a entrega do produto ao destinatário, envie o item para o TEMPORIZADOR 
              para aguardar o prazo legal de 7 dias (direito de devolução do consumidor).
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
                  <p className="text-2xl font-bold">{entregas.length}</p>
                  <p className="text-sm text-muted-foreground">Total</p>
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
                  <p className="text-2xl font-bold">
                    {entregas.filter(e => e.status === "entregue").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Entregues</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-blue-100">
                  <Truck className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {entregas.filter(e => e.status === "em_transito").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Em Trânsito</p>
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
                  <p className="text-2xl font-bold">
                    {entregas.filter(e => e.status === "saiu_entrega").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Saiu p/ Entrega</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de entregas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Histórico de Produtos para Entrega
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {entregas.map((entrega) => (
                <div
                  key={entrega.id}
                  className={`p-4 border rounded-lg transition-colors ${
                    entrega.status === "entregue" 
                      ? "border-green-200 bg-green-50/50" 
                      : "hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{entrega.codigo}</h4>
                        {getStatusBadge(entrega.status)}
                      </div>
                      <p className="text-sm font-medium">{entrega.produto}</p>
                      <p className="text-sm text-muted-foreground">
                        Comprador: {entrega.comprador}
                      </p>
                      <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {entrega.endereco}
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span>{entrega.transportadora} - {entrega.rastreio}</span>
                        {entrega.status === "entregue" ? (
                          <span className="text-green-600 font-medium">
                            Entregue em: {entrega.dataEntrega}
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Previsão: {entrega.previsao}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Botões de ação */}
                    <div className="flex flex-col gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        Rastrear
                      </Button>
                      
                      {entrega.status === "entregue" && (
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          <Timer className="h-4 w-4 mr-1" />
                          Temporizador
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

export default LogisticaEntregas;
