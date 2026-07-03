import { AccountLayout } from "@/components/AccountLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Plus } from "lucide-react";

const Endereco = () => {
  const enderecos = [
    {
      id: 1,
      tipo: "Casa",
      endereco: "Rua das Flores, 123",
      complemento: "Apto 45",
      bairro: "Centro",
      cidade: "São Paulo",
      estado: "SP",
      cep: "01234-567",
      principal: true,
    },
    {
      id: 2,
      tipo: "Trabalho",
      endereco: "Av. Paulista, 1000",
      complemento: "Sala 201",
      bairro: "Bela Vista",
      cidade: "São Paulo",
      estado: "SP",
      cep: "01310-100",
      principal: false,
    },
  ];

  return (
    <AccountLayout title="Endereços">
      <div className="space-y-6">
        <div className="flex justify-end">
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Endereço
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {enderecos.map((endereco) => (
            <Card key={endereco.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    {endereco.tipo}
                  </div>
                  {endereco.principal && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                      Principal
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="font-medium">{endereco.endereco}</p>
                <p className="text-sm text-muted-foreground">
                  {endereco.complemento}
                </p>
                <p className="text-sm text-muted-foreground">
                  {endereco.bairro}, {endereco.cidade} - {endereco.estado}
                </p>
                <p className="text-sm text-muted-foreground">
                  CEP: {endereco.cep}
                </p>
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm">
                    Editar
                  </Button>
                  {!endereco.principal && (
                    <Button variant="outline" size="sm">
                      Definir como Principal
                    </Button>
                  )}
                  <Button variant="destructive" size="sm">
                    Remover
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AccountLayout>
  );
};

export default Endereco;
