import { AccountLayout } from "@/components/AccountLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Plus } from "lucide-react";

const MeusCartoes = () => {
  const cartoes = [
    { id: 1, numero: "**** **** **** 1234", bandeira: "Visa", validade: "12/25" },
    { id: 2, numero: "**** **** **** 5678", bandeira: "Mastercard", validade: "06/26" },
  ];

  return (
    <AccountLayout title="Meus Cartões">
      <div className="space-y-6">
        <div className="flex justify-end">
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Cartão
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cartoes.map((cartao) => (
            <Card key={cartao.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  {cartao.bandeira}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-2xl font-mono tracking-wider">{cartao.numero}</p>
                <p className="text-sm text-muted-foreground">
                  Validade: {cartao.validade}
                </p>
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm">
                    Editar
                  </Button>
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

export default MeusCartoes;
