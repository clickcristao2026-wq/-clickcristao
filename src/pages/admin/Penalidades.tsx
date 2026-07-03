import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Clock, Eye, Send, XCircle } from "lucide-react";

const penalidadesPrazo = [
  {
    id: 1,
    codigo: "PEN-2026-015",
    produto: "Livro Devocional",
    vendedor: "Editora Graça",
    prazoLimite: "01/02/2026 14:00",
    atraso: "26 horas",
    multa: "R$ 15,00",
    status: "pendente"
  },
  {
    id: 2,
    codigo: "PEN-2026-014",
    produto: "CD Gospel Hits",
    vendedor: "Gospel Music",
    prazoLimite: "31/01/2026 10:00",
    atraso: "48 horas",
    multa: "R$ 25,00",
    status: "notificado"
  },
];

const penalidadesCancelamento = [
  {
    id: 1,
    codigo: "CAN-2026-008",
    produto: "Bíblia Infantil",
    vendedor: "Kids Cristão",
    motivo: "Produto não disponível em estoque",
    data: "02/02/2026",
    multa: "R$ 35,00",
    status: "pendente"
  },
  {
    id: 2,
    codigo: "CAN-2026-007",
    produto: "Kit Artigos Religiosos",
    vendedor: "Arte Sacra Store",
    motivo: "Vendedor cancelou sem justificativa",
    data: "30/01/2026",
    multa: "R$ 50,00",
    status: "aplicada"
  },
];

const AdminPenalidades = () => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pendente":
        return <Badge className="bg-yellow-500">Pendente</Badge>;
      case "notificado":
        return <Badge className="bg-blue-500">Notificado</Badge>;
      case "aplicada":
        return <Badge className="bg-red-500">Multa Aplicada</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <AdminLayout title="Penalidades">
      <div className="space-y-6">
        {/* Cards de resumo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-red-100">
                  <Clock className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-red-700">{penalidadesPrazo.length}</p>
                  <p className="text-sm text-red-600">Prazo de Postagem</p>
                  <p className="text-xs text-red-500 mt-1">Produtos não enviados em 24h</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-orange-100">
                  <XCircle className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-orange-700">{penalidadesCancelamento.length}</p>
                  <p className="text-sm text-orange-600">Cancelamento de Fornecimento</p>
                  <p className="text-xs text-orange-500 mt-1">Vendedor cancelou a venda</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">
              <strong>⚡ Sincronização:</strong> Campo sincronizado com PEDIDOS / LOGÍSTICA. 
              Multas são enviadas para FINANCEIRO / TRANSAÇÃO e contabilizadas no faturamento do vendedor.
            </p>
          </CardContent>
        </Card>

        {/* Prazo de Postagem */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-red-500" />
              Prazo de Postagem Excedido (24h)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {penalidadesPrazo.map((penalidade) => (
                <div
                  key={penalidade.id}
                  className="flex items-center gap-4 p-4 border border-red-200 rounded-lg bg-red-50/50"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{penalidade.codigo}</h4>
                      {getStatusBadge(penalidade.status)}
                    </div>
                    <p className="text-sm font-medium">{penalidade.produto}</p>
                    <p className="text-sm text-muted-foreground">Vendedor: {penalidade.vendedor}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs">
                      <span className="text-red-600">
                        Prazo: {penalidade.prazoLimite}
                      </span>
                      <span className="text-red-700 font-semibold">
                        Atraso: {penalidade.atraso}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-red-600">{penalidade.multa}</p>
                    <p className="text-xs text-muted-foreground">Valor da multa</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      Detalhes
                    </Button>
                    <Button size="sm" className="bg-red-600 hover:bg-red-700">
                      <Send className="h-4 w-4 mr-1" />
                      Enviar p/ Financeiro
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Cancelamento de Fornecimento */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-orange-500" />
              Cancelamento de Fornecimento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {penalidadesCancelamento.map((penalidade) => (
                <div
                  key={penalidade.id}
                  className="flex items-center gap-4 p-4 border border-orange-200 rounded-lg bg-orange-50/50"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{penalidade.codigo}</h4>
                      {getStatusBadge(penalidade.status)}
                    </div>
                    <p className="text-sm font-medium">{penalidade.produto}</p>
                    <p className="text-sm text-muted-foreground">Vendedor: {penalidade.vendedor}</p>
                    <p className="text-xs text-orange-600 mt-1">Motivo: {penalidade.motivo}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {penalidade.data}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-orange-600">{penalidade.multa}</p>
                    <p className="text-xs text-muted-foreground">Valor da multa</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      Detalhes
                    </Button>
                    {penalidade.status === "pendente" && (
                      <Button size="sm" className="bg-red-600 hover:bg-red-700">
                        <Send className="h-4 w-4 mr-1" />
                        Enviar p/ Financeiro
                      </Button>
                    )}
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

export default AdminPenalidades;
