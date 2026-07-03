import { AccountLayout } from "@/components/AccountLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Avaliacao = () => {
  const produtosParaAvaliar = [
    { id: 1, nome: "Bíblia Sagrada NVI", data: "20/11/2025", status: "entregue", avaliado: false },
    { id: 2, nome: "Camiseta Gospel Branca", data: "15/11/2025", status: "entregue", avaliado: true },
    { id: 3, nome: "Kit Artigos Religiosos", data: "10/11/2025", status: "entregue", avaliado: false },
  ];

  return (
    <AccountLayout title="Avaliação">
      <div className="space-y-6">
        <p className="text-muted-foreground">
          Conteúdo de produtos comprados para serem avaliados. Sincronizado com os produtos do item de compra que contém a sinalização de: <strong>entregue.</strong>
        </p>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Produtos para Avaliar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {produtosParaAvaliar.map((produto) => (
                <div
                  key={produto.id}
                  className="flex justify-between items-center p-4 bg-muted rounded-lg"
                >
                  <div>
                    <p className="font-medium">{produto.nome}</p>
                    <p className="text-sm text-muted-foreground">{produto.data}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={produto.avaliado ? "default" : "secondary"}>
                      {produto.avaliado ? "Avaliado" : "Pendente"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AccountLayout>
  );
};

export default Avaliacao;
