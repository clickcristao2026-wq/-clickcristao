import { AccountLayout } from "@/components/AccountLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle, RotateCcw } from "lucide-react";

const Mercadoria = () => {
  return (
    <AccountLayout title="Mercadoria">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="text-center">
            <div className="mx-auto p-4 rounded-full bg-destructive/10 w-fit">
              <XCircle className="h-12 w-12 text-destructive" />
            </div>
            <CardTitle className="mt-4">Cancelar Compra</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">
              Cancele uma compra antes do envio do produto
            </p>
            <Button variant="outline" className="w-full">
              Cancelar Compra
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="text-center">
            <div className="mx-auto p-4 rounded-full bg-primary/10 w-fit">
              <RotateCcw className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="mt-4">Devolver Produto</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">
              Solicite a devolução de um produto recebido
            </p>
            <Button variant="outline" className="w-full">
              Devolver Produto
            </Button>
          </CardContent>
        </Card>
      </div>
    </AccountLayout>
  );
};

export default Mercadoria;
