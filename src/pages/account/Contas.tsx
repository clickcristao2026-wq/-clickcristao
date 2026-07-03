import { AccountLayout } from "@/components/AccountLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";

const Contas = () => {
  const contas = [
    {
      id: 1,
      numero: "2025-001",
      data: "20/11/2025",
      vencimento: "25/11/2025",
      valor: 89.90,
      status: "Pendente",
      statusColor: "bg-yellow-500",
    },
    {
      id: 2,
      numero: "2025-002",
      data: "18/11/2025",
      vencimento: "23/11/2025",
      valor: 245.50,
      status: "Pago",
      statusColor: "bg-green-500",
    },
    {
      id: 3,
      numero: "2025-003",
      data: "15/11/2025",
      vencimento: "20/11/2025",
      valor: 150.00,
      status: "Vencido",
      statusColor: "bg-destructive",
    },
  ];

  return (
    <AccountLayout title="Contas">
      <div className="space-y-4">
        {contas.map((conta) => (
          <Card key={conta.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-primary" />
                  <span>Conta #{conta.numero}</span>
                </div>
                <Badge className={`${conta.statusColor} text-white`}>
                  {conta.status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Data de Emissão</p>
                  <p className="font-medium">{conta.data}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Vencimento</p>
                  <p className="font-medium">{conta.vencimento}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Valor</p>
                  <p className="font-medium">R$ {conta.valor.toFixed(2)}</p>
                </div>
                <div className="flex items-end justify-end gap-2">
                  <Button variant="outline" size="sm">
                    Baixar PDF
                  </Button>
                  {conta.status !== "Pago" && (
                    <Button className="bg-primary hover:bg-primary/90" size="sm">
                      Pagar
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AccountLayout>
  );
};

export default Contas;
