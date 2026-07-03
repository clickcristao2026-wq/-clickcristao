import FinanceiroLayout from "@/components/FinanceiroLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Coins } from "lucide-react";

const creditosMyBank = [
  { id: "MBK001", usuario: "João Silva", valor: "R$ 150,00", data: "15/01/2025", status: "Ativo" },
  { id: "MBK002", usuario: "Maria Santos", valor: "R$ 80,00", data: "14/01/2025", status: "Utilizado" },
  { id: "MBK003", usuario: "Pedro Costa", valor: "R$ 200,00", data: "13/01/2025", status: "Ativo" },
  { id: "MBK004", usuario: "Ana Oliveira", valor: "R$ 50,00", data: "12/01/2025", status: "Expirado" },
];

const creditosMyDoots = [
  { id: "MDT001", usuario: "Carlos Lima", pontos: 1500, equivalente: "R$ 15,00", data: "15/01/2025", status: "Disponível" },
  { id: "MDT002", usuario: "Fernanda Alves", pontos: 3200, equivalente: "R$ 32,00", data: "14/01/2025", status: "Disponível" },
  { id: "MDT003", usuario: "Bruno Santos", pontos: 800, equivalente: "R$ 8,00", data: "13/01/2025", status: "Utilizado" },
  { id: "MDT004", usuario: "Juliana Costa", pontos: 5000, equivalente: "R$ 50,00", data: "12/01/2025", status: "Disponível" },
];

const Credito = () => {
  return (
    <FinanceiroLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Crédito</h1>
          <p className="text-muted-foreground">Gestão de créditos e descontos para usuários</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">My Bank</CardTitle>
              <CreditCard className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">R$ 48.500,00</div>
              <p className="text-sm text-muted-foreground">Total em créditos ativos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">My Doots</CardTitle>
              <Coins className="h-5 w-5 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">156.800 pts</div>
              <p className="text-sm text-muted-foreground">Total de pontos disponíveis</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              My Bank - Histórico de Créditos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {creditosMyBank.map((credito) => (
                  <TableRow key={credito.id}>
                    <TableCell className="font-medium">{credito.id}</TableCell>
                    <TableCell>{credito.usuario}</TableCell>
                    <TableCell className="text-primary">{credito.valor}</TableCell>
                    <TableCell>{credito.data}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          credito.status === "Ativo" ? "default" : 
                          credito.status === "Utilizado" ? "secondary" : "destructive"
                        }
                      >
                        {credito.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-yellow-500" />
              My Doots - Histórico de Pontos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Pontos</TableHead>
                  <TableHead>Equivalente</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {creditosMyDoots.map((credito) => (
                  <TableRow key={credito.id}>
                    <TableCell className="font-medium">{credito.id}</TableCell>
                    <TableCell>{credito.usuario}</TableCell>
                    <TableCell className="text-yellow-600 font-medium">{credito.pontos.toLocaleString()}</TableCell>
                    <TableCell>{credito.equivalente}</TableCell>
                    <TableCell>{credito.data}</TableCell>
                    <TableCell>
                      <Badge variant={credito.status === "Disponível" ? "default" : "secondary"}>
                        {credito.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </FinanceiroLayout>
  );
};

export default Credito;
