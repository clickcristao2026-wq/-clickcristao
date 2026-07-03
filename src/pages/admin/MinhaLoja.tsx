import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Store, Eye, CheckCircle, XCircle, Clock } from "lucide-react";

const lojasPendentes = [
  {
    id: 1,
    nome: "Livraria Boas Novas",
    proprietario: "João Silva",
    categoria: "Livraria",
    dataEnvio: "02/02/2026",
    status: "pendente",
    logo: "/placeholder.svg"
  },
  {
    id: 2,
    nome: "Moda Cristã Premium",
    proprietario: "Maria Santos",
    categoria: "Vestuário",
    dataEnvio: "01/02/2026",
    status: "pendente",
    logo: "/placeholder.svg"
  },
  {
    id: 3,
    nome: "Arte Sacra Digital",
    proprietario: "Pedro Oliveira",
    categoria: "Arte",
    dataEnvio: "30/01/2026",
    status: "pendente",
    logo: "/placeholder.svg"
  },
];

const AdminMinhaLoja = () => {
  return (
    <AdminLayout title="Minha Loja">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5" />
              Lojas Aguardando Aprovação
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Confira as lojas enviadas pelos vendedores e aprove para publicação na plataforma
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lojasPendentes.map((loja) => (
                <div
                  key={loja.id}
                  className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <img
                    src={loja.logo}
                    alt={loja.nome}
                    className="w-20 h-20 object-cover rounded-lg border"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">{loja.nome}</h4>
                    <p className="text-sm text-muted-foreground">
                      Proprietário: {loja.proprietario}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">{loja.categoria}</Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {loja.dataEnvio}
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

export default AdminMinhaLoja;
