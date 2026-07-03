import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Eye, CheckCircle, XCircle, Clock, DollarSign } from "lucide-react";

const destaquesPendentes = [
  {
    id: 1,
    produto: "Bíblia de Estudo Premium",
    vendedor: "Livraria Cristã",
    tipo: "Destaque Home",
    periodo: "7 dias",
    valor: "R$ 99,00",
    pagamento: "Confirmado",
    dataEnvio: "02/02/2026",
    imagem: "/placeholder.svg"
  },
  {
    id: 2,
    produto: "Curso de Louvor",
    anunciante: "Escola de Música Gospel",
    tipo: "Banner Principal",
    periodo: "30 dias",
    valor: "R$ 350,00",
    pagamento: "Confirmado",
    dataEnvio: "01/02/2026",
    imagem: "/placeholder.svg"
  },
  {
    id: 3,
    produto: "Kit Decoração Cristã",
    vendedor: "Arte Sacra Store",
    tipo: "Destaque Categoria",
    periodo: "15 dias",
    valor: "R$ 150,00",
    pagamento: "Pendente",
    dataEnvio: "31/01/2026",
    imagem: "/placeholder.svg"
  },
];

const AdminDestaques = () => {
  return (
    <AdminLayout title="Destaques">
      <div className="space-y-6">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">
              <strong>⚡ Sincronização:</strong> Sincronizado com FINANCEIRO DESTAQUE / DESTAQUE USUÁRIO VENDEDOR E ANUNCIANTE. 
              Produtos aprovados vão para a página Home na seção de Destaques.
            </p>
          </CardContent>
        </Card>

        {/* Cards de resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-yellow-100">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">3</p>
                  <p className="text-sm text-muted-foreground">Aguardando Aprovação</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-green-100">
                  <Star className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-sm text-muted-foreground">Destaques Ativos</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-blue-100">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">R$ 2.850</p>
                  <p className="text-sm text-muted-foreground">Receita do Mês</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Solicitações de Destaque
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Confira os produtos e aprove para exibição na página Home
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {destaquesPendentes.map((destaque) => (
                <div
                  key={destaque.id}
                  className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <img
                    src={destaque.imagem}
                    alt={destaque.produto}
                    className="w-20 h-20 object-cover rounded-lg border"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">{destaque.produto}</h4>
                    <p className="text-sm text-muted-foreground">
                      {destaque.vendedor || destaque.anunciante}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">{destaque.tipo}</Badge>
                      <Badge 
                        className={destaque.pagamento === "Confirmado" 
                          ? "bg-green-100 text-green-700 border-green-200" 
                          : "bg-yellow-100 text-yellow-700 border-yellow-200"
                        }
                        variant="outline"
                      >
                        {destaque.pagamento}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                      <span>Período: {destaque.periodo}</span>
                      <span className="font-semibold text-primary">{destaque.valor}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {destaque.dataEnvio}
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
                      disabled={destaque.pagamento !== "Confirmado"}
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

export default AdminDestaques;
