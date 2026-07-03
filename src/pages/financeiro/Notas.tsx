import FinanceiroLayout from "@/components/FinanceiroLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileText, Plus, Printer } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const historicoNotas = [
  { id: "NTA001", fornecedor: "Fornecedor ABC", descricao: "Pagamento mensal", valor: "R$ 5.000,00", data: "15/01/2025", status: "Emitida" },
  { id: "NTA002", fornecedor: "Serviços XYZ", descricao: "Manutenção sistema", valor: "R$ 2.500,00", data: "14/01/2025", status: "Pendente" },
  { id: "NTA003", fornecedor: "Marketing Digital", descricao: "Campanha publicitária", valor: "R$ 8.000,00", data: "13/01/2025", status: "Emitida" },
  { id: "NTA004", fornecedor: "Logística Express", descricao: "Serviço de frete", valor: "R$ 3.200,00", data: "12/01/2025", status: "Paga" },
  { id: "NTA005", fornecedor: "Cloud Services", descricao: "Hospedagem mensal", valor: "R$ 1.800,00", data: "11/01/2025", status: "Paga" },
];

const Notas = () => {
  return (
    <FinanceiroLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Notas</h1>
            <p className="text-muted-foreground">Formulário de relatório de valores para pagamentos</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nova Nota
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Emitir Nova Nota de Pagamento</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Fornecedor / Beneficiário</Label>
                  <Input placeholder="Nome do fornecedor" />
                </div>
                <div>
                  <Label>CNPJ / CPF</Label>
                  <Input placeholder="00.000.000/0000-00" />
                </div>
                <div>
                  <Label>Valor</Label>
                  <Input placeholder="R$ 0,00" />
                </div>
                <div>
                  <Label>Data de Vencimento</Label>
                  <Input type="date" />
                </div>
                <div className="col-span-2">
                  <Label>Descrição</Label>
                  <Textarea placeholder="Descreva o motivo do pagamento..." rows={3} />
                </div>
                <div>
                  <Label>Banco</Label>
                  <Input placeholder="Nome do banco" />
                </div>
                <div>
                  <Label>Agência</Label>
                  <Input placeholder="0000" />
                </div>
                <div>
                  <Label>Conta</Label>
                  <Input placeholder="00000-0" />
                </div>
                <div>
                  <Label>PIX</Label>
                  <Input placeholder="Chave PIX (opcional)" />
                </div>
                <div className="col-span-2">
                  <Label>Observações</Label>
                  <Textarea placeholder="Observações adicionais..." rows={2} />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button className="flex-1">
                  <FileText className="w-4 h-4 mr-2" />
                  Salvar Nota
                </Button>
                <Button variant="outline">
                  <Printer className="w-4 h-4 mr-2" />
                  Salvar e Imprimir
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Notas Emitidas</CardTitle>
              <FileText className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">Este mês</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
              <FileText className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">8</div>
              <p className="text-xs text-muted-foreground">Aguardando pagamento</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
              <FileText className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">R$ 156.800,00</div>
              <p className="text-xs text-muted-foreground">Total em notas</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Histórico de Notas</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Fornecedor</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {historicoNotas.map((nota) => (
                  <TableRow key={nota.id}>
                    <TableCell className="font-medium">{nota.id}</TableCell>
                    <TableCell>{nota.fornecedor}</TableCell>
                    <TableCell>{nota.descricao}</TableCell>
                    <TableCell>{nota.valor}</TableCell>
                    <TableCell>{nota.data}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          nota.status === "Paga" ? "default" : 
                          nota.status === "Emitida" ? "secondary" : "outline"
                        }
                      >
                        {nota.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="ghost">
                        <Printer className="w-4 h-4" />
                      </Button>
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

export default Notas;
