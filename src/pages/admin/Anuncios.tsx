import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Megaphone, Eye, CheckCircle, XCircle, Clock } from "lucide-react";

const anunciosPendentes = [
  {
    id: 1,
    titulo: "Promoção Especial - Livros Cristãos",
    anunciante: "Editora Fé",
    tipo: "Banner",
    dataEnvio: "02/02/2026",
    status: "pendente",
    imagem: "/placeholder.svg"
  },
  {
    id: 2,
    titulo: "Campanha Natal Gospel",
    anunciante: "Igreja Central",
    tipo: "Destaque",
    dataEnvio: "01/02/2026",
    status: "pendente",
    imagem: "/placeholder.svg"
  },
  {
    id: 3,
    titulo: "Curso Online de Teologia",
    anunciante: "Seminário Virtual",
    tipo: "Carrossel",
    dataEnvio: "30/01/2026",
    status: "pendente",
    imagem: "/placeholder.svg"
  },
];

const AdminAnuncios = () => {
  return (
    <AdminLayout title="Anúncios">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Megaphone className="h-5 w-5" />
              Anúncios Aguardando Aprovação
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Confira os anúncios enviados pelos anunciantes e aprove para publicação na plataforma
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {anunciosPendentes.map((anuncio) => (
                <div
                  key={anuncio.id}
                  className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <img
                    src={anuncio.imagem}
                    alt={anuncio.titulo}
                    className="w-20 h-20 object-cover rounded-lg border"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">{anuncio.titulo}</h4>
                    <p className="text-sm text-muted-foreground">
                      Anunciante: {anuncio.anunciante}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">{anuncio.tipo}</Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {anuncio.dataEnvio}
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

export default AdminAnuncios;
