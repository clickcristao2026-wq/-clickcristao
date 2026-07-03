import { LogisticaLayout } from "@/components/LogisticaLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Timer, Clock, DollarSign, RotateCcw, CheckCircle, Eye, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";

interface ItemTemporizador {
  id: number;
  codigo: string;
  produto: string;
  comprador: string;
  vendedor: string;
  valor: string;
  dataEntrega: string;
  diasRestantes: number;
  status: "aguardando" | "devolvido" | "concluido";
}

const itensMock: ItemTemporizador[] = [
  {
    id: 1,
    codigo: "TMP-2026-034",
    produto: "Bíblia Sagrada NVI",
    comprador: "Ana Paula Silva",
    vendedor: "Livraria Cristã",
    valor: "R$ 89,90",
    dataEntrega: "01/02/2026",
    diasRestantes: 5,
    status: "aguardando"
  },
  {
    id: 2,
    codigo: "TMP-2026-033",
    produto: "Kit Camisetas Gospel",
    comprador: "Carlos Eduardo",
    vendedor: "Moda Cristã Store",
    valor: "R$ 149,90",
    dataEntrega: "30/01/2026",
    diasRestantes: 2,
    status: "aguardando"
  },
  {
    id: 3,
    codigo: "TMP-2026-032",
    produto: "CD Worship Collection",
    comprador: "Fernanda Lima",
    vendedor: "Gospel Music",
    valor: "R$ 45,00",
    dataEntrega: "27/01/2026",
    diasRestantes: 0,
    status: "concluido"
  },
  {
    id: 4,
    codigo: "TMP-2026-031",
    produto: "Quadro Decorativo",
    comprador: "Roberto Santos",
    vendedor: "Arte Sacra",
    valor: "R$ 120,00",
    dataEntrega: "28/01/2026",
    diasRestantes: 3,
    status: "devolvido"
  },
];

const LogisticaTemporizador = () => {
  const [itens] = useState<ItemTemporizador[]>(itensMock);

  const getStatusBadge = (status: string, diasRestantes: number) => {
    if (status === "devolvido") {
      return <Badge className="bg-orange-500">Devolvido</Badge>;
    }
    if (status === "concluido" || diasRestantes === 0) {
      return <Badge className="bg-green-500">Prazo Concluído</Badge>;
    }
    if (diasRestantes <= 2) {
      return <Badge className="bg-yellow-500">Finalizando ({diasRestantes}d)</Badge>;
    }
    return <Badge className="bg-blue-500">Em Prazo ({diasRestantes}d)</Badge>;
  };

  const getDiasColor = (dias: number) => {
    if (dias === 0) return "text-green-600";
    if (dias <= 2) return "text-yellow-600";
    return "text-blue-600";
  };

  return (
    <LogisticaLayout title="Temporizador">
      <div className="space-y-6">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                <strong>⏱️ Prazo de 7 dias:</strong> Após o produto ser entregue, ele aguarda aqui o prazo legal de 7 dias 
                para possível devolução pelo consumidor.
              </p>
              <p>
                <strong>✅ Não devolvido:</strong> Enviar para FINANCEIRO / TRANSAÇÃO para contabilização.
              </p>
              <p>
                <strong>↩️ Devolvido:</strong> Sincronizado com ADM / PRODUTO DEVOLVIDO. Acompanhar rastreamento até 
                chegar ao vendedor para processar reembolso.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Cards de resumo */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-blue-100">
                  <Timer className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {itens.filter(i => i.status === "aguardando").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Aguardando Prazo</p>
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
                    {itens.filter(i => i.status === "concluido").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Prazo Concluído</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-orange-100">
                  <RotateCcw className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {itens.filter(i => i.status === "devolvido").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Devolvidos</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-yellow-100">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {itens.filter(i => i.diasRestantes <= 2 && i.status === "aguardando").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Finalizando</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de itens */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Timer className="h-5 w-5" />
              Itens no Temporizador (7 dias)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {itens.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 border rounded-lg transition-colors ${
                    item.status === "devolvido"
                      ? "border-orange-200 bg-orange-50/50"
                      : item.status === "concluido"
                      ? "border-green-200 bg-green-50/50"
                      : item.diasRestantes <= 2
                      ? "border-yellow-200 bg-yellow-50/50"
                      : "hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{item.codigo}</h4>
                        {getStatusBadge(item.status, item.diasRestantes)}
                      </div>
                      <p className="text-sm font-medium">{item.produto}</p>
                      <p className="text-sm text-muted-foreground">
                        Comprador: {item.comprador} | Vendedor: {item.vendedor}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span className="font-semibold text-primary">{item.valor}</span>
                        <span>Entregue em: {item.dataEntrega}</span>
                      </div>
                      
                      {/* Timer visual */}
                      {item.status === "aguardando" && (
                        <div className="flex items-center gap-2 mt-3">
                          <Clock className={`h-5 w-5 ${getDiasColor(item.diasRestantes)}`} />
                          <div className="flex-1 bg-muted rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                item.diasRestantes <= 2 ? 'bg-yellow-500' : 'bg-blue-500'
                              }`}
                              style={{ width: `${((7 - item.diasRestantes) / 7) * 100}%` }}
                            />
                          </div>
                          <span className={`text-sm font-medium ${getDiasColor(item.diasRestantes)}`}>
                            {item.diasRestantes} dias restantes
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Botões de ação */}
                    <div className="flex flex-col gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        Detalhes
                      </Button>
                      
                      {(item.status === "concluido" || item.diasRestantes === 0) && 
                       item.status !== "devolvido" && (
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <DollarSign className="h-4 w-4 mr-1" />
                          Transação Financeira
                        </Button>
                      )}
                      
                      {item.status === "devolvido" && (
                        <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                          <RotateCcw className="h-4 w-4 mr-1" />
                          Ver Devolução
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

export default LogisticaTemporizador;
