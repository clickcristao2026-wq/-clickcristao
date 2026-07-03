import ComissionadoLayout from "@/components/ComissionadoLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Send, Link } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const historicoAvisos = [
  { id: "AVS001", usuario: "Ricardo Santos", ticket: "TKT-2025-101", data: "15/01/2025", finalidade: "Pagamento de comissão", status: "Enviado" },
  { id: "AVS002", usuario: "Fernanda Lima", ticket: "TKT-2025-102", data: "14/01/2025", finalidade: "Reembolso solicitado", status: "Lido" },
  { id: "AVS003", usuario: "Bruno Costa", ticket: "TKT-2025-103", data: "13/01/2025", finalidade: "Multa por cancelamento", status: "Enviado" },
  { id: "AVS004", usuario: "Juliana Alves", ticket: "TKT-2025-104", data: "12/01/2025", finalidade: "Atualização de dados bancários", status: "Lido" },
  { id: "AVS005", usuario: "Marcos Silva", ticket: "TKT-2025-105", data: "11/01/2025", finalidade: "Liberação de comissão", status: "Pendente" },
];

const Avisos = () => {
  return (
    <ComissionadoLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Avisos</h1>
            <p className="text-muted-foreground">Destinar mensagens para os afiliados</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <MessageSquare className="w-4 h-4 mr-2" />
                Novo Aviso
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Enviar Novo Aviso</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Usuário</Label>
                  <Input placeholder="Nome ou ID do afiliado" />
                </div>
                <div>
                  <Label>Ticket</Label>
                  <Input placeholder="TKT-2025-000" />
                </div>
                <div>
                  <Label>Finalidade</Label>
                  <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option value="">Selecione a finalidade</option>
                    <option value="pagamento">Pagamento de Comissão</option>
                    <option value="reembolso">Reembolso</option>
                    <option value="multa">Multa</option>
                    <option value="atualizacao">Atualização de Dados</option>
                    <option value="liberacao">Liberação de Valores</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>
                <div>
                  <Label>Mensagem</Label>
                  <Textarea 
                    placeholder="Digite a mensagem do aviso..."
                    rows={4}
                  />
                </div>
                <Button className="w-full">
                  <Send className="w-4 h-4 mr-2" />
                  Enviar Aviso
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-primary">
              <Link className="w-4 h-4" />
              <span className="text-sm font-medium">Sincronizado com: Avisos dos Usuários</span>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Enviados</CardTitle>
              <MessageSquare className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89</div>
              <p className="text-xs text-muted-foreground">Este mês</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Lidos</CardTitle>
              <MessageSquare className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">72</div>
              <p className="text-xs text-muted-foreground">81% de leitura</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
              <MessageSquare className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">17</div>
              <p className="text-xs text-muted-foreground">Aguardando leitura</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Histórico de Avisos</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Ticket</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Finalidade</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {historicoAvisos.map((aviso) => (
                  <TableRow key={aviso.id}>
                    <TableCell className="font-medium">{aviso.id}</TableCell>
                    <TableCell>{aviso.usuario}</TableCell>
                    <TableCell>{aviso.ticket}</TableCell>
                    <TableCell>{aviso.data}</TableCell>
                    <TableCell>{aviso.finalidade}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          aviso.status === "Lido" ? "default" : 
                          aviso.status === "Enviado" ? "secondary" : "outline"
                        }
                      >
                        {aviso.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </ComissionadoLayout>
  );
};

export default Avisos;
