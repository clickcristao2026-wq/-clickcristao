import { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Headphones, HelpCircle, AlertOctagon, Eye, Send, Clock, MessageSquare } from "lucide-react";

interface Mensagem {
  id: string;
  usuario: string;
  data: string;
  status: string;
  conteudo: string;
  tipo: string;
}

const mensagensMock: Mensagem[] = [
  { id: "SAC-001", usuario: "João Silva", data: "03/02/2026", status: "Pendente", conteudo: "Gostaria de saber sobre o prazo de entrega do meu pedido #4521.", tipo: "sac" },
  { id: "SAC-002", usuario: "Maria Santos", data: "02/02/2026", status: "Respondido", conteudo: "Não consigo acessar minha conta desde ontem.", tipo: "sac" },
  { id: "AJD-001", usuario: "Pedro Oliveira", data: "03/02/2026", status: "Pendente", conteudo: "Como faço para cadastrar meu produto na plataforma?", tipo: "ajuda" },
  { id: "AJD-002", usuario: "Ana Costa", data: "01/02/2026", status: "Respondido", conteudo: "Preciso de ajuda para configurar minha loja.", tipo: "ajuda" },
  { id: "REC-001", usuario: "Carlos Ferreira", data: "03/02/2026", status: "Pendente", conteudo: "Produto veio com defeito e o vendedor não responde.", tipo: "reclamacao" },
  { id: "REC-002", usuario: "Fernanda Lima", data: "31/01/2026", status: "Em Análise", conteudo: "Cobrança indevida no meu cartão.", tipo: "reclamacao" },
];

const AdminContatos = () => {
  const [selectedMsg, setSelectedMsg] = useState<Mensagem | null>(null);
  const [resposta, setResposta] = useState("");

  const sacMsgs = mensagensMock.filter(m => m.tipo === "sac");
  const ajudaMsgs = mensagensMock.filter(m => m.tipo === "ajuda");
  const reclamacaoMsgs = mensagensMock.filter(m => m.tipo === "reclamacao");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pendente":
        return <Badge className="bg-yellow-500">{status}</Badge>;
      case "Respondido":
        return <Badge className="bg-green-500">{status}</Badge>;
      case "Em Análise":
        return <Badge className="bg-blue-500">{status}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleEnviarResposta = () => {
    setResposta("");
    setSelectedMsg(null);
  };

  const renderTabela = (msgs: Mensagem[]) => (
    <div className="space-y-3">
      {msgs.map((msg) => (
        <div key={msg.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
          <div className="flex-1 grid grid-cols-4 gap-4 items-center">
            <span className="font-mono text-sm font-medium">{msg.id}</span>
            <span className="text-sm">{msg.usuario}</span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" /> {msg.data}
            </span>
            {getStatusBadge(msg.status)}
          </div>
          <Button variant="outline" size="sm" onClick={() => setSelectedMsg(msg)}>
            <Eye className="h-4 w-4 mr-1" /> Detalhes
          </Button>
        </div>
      ))}
    </div>
  );

  const renderBloco = (titulo: string, icon: React.ReactNode, msgs: Mensagem[], cor: string) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon}
            {titulo}
          </div>
          <Badge variant="outline" className="text-lg px-3">{msgs.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-3 grid grid-cols-4 gap-4 px-4 text-xs font-medium text-muted-foreground uppercase">
          <span>ID</span>
          <span>Usuário</span>
          <span>Data</span>
          <span>Status</span>
        </div>
        {renderTabela(msgs)}
      </CardContent>
    </Card>
  );

  return (
    <AdminLayout title="Contatos">
      <div className="space-y-6">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">
              <strong>⚡ Sincronização:</strong> Sincronizado com a página Home da plataforma no rodapé: CONTATOS / SAC / AJUDA / RECLAME AQUI.
            </p>
          </CardContent>
        </Card>

        {/* Cards de resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-blue-100">
                  <Headphones className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{sacMsgs.length}</p>
                  <p className="text-sm text-muted-foreground">SAC</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-green-100">
                  <HelpCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{ajudaMsgs.length}</p>
                  <p className="text-sm text-muted-foreground">Ajuda</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-red-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-red-100">
                  <AlertOctagon className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{reclamacaoMsgs.length}</p>
                  <p className="text-sm text-muted-foreground">Reclamações</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs com blocos */}
        <Tabs defaultValue="sac">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="sac">SAC</TabsTrigger>
            <TabsTrigger value="ajuda">Ajuda</TabsTrigger>
            <TabsTrigger value="reclamacoes">Reclamações</TabsTrigger>
          </TabsList>
          <TabsContent value="sac" className="mt-4">
            {renderBloco("SAC", <Headphones className="h-5 w-5 text-blue-500" />, sacMsgs, "blue")}
          </TabsContent>
          <TabsContent value="ajuda" className="mt-4">
            {renderBloco("Ajuda", <HelpCircle className="h-5 w-5 text-green-500" />, ajudaMsgs, "green")}
          </TabsContent>
          <TabsContent value="reclamacoes" className="mt-4">
            {renderBloco("Reclamações", <AlertOctagon className="h-5 w-5 text-red-500" />, reclamacaoMsgs, "red")}
          </TabsContent>
        </Tabs>

        {/* Dialog Detalhes */}
        <Dialog open={!!selectedMsg} onOpenChange={() => setSelectedMsg(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Detalhes - {selectedMsg?.id}</DialogTitle>
            </DialogHeader>
            {selectedMsg && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><span className="font-medium">Usuário:</span> {selectedMsg.usuario}</div>
                  <div><span className="font-medium">Data:</span> {selectedMsg.data}</div>
                  <div><span className="font-medium">Status:</span> {selectedMsg.status}</div>
                  <div><span className="font-medium">Ticket:</span> {selectedMsg.id}</div>
                </div>
                <Card className="bg-muted/50">
                  <CardContent className="p-4">
                    <p className="text-sm font-medium mb-1">Mensagem do Usuário:</p>
                    <p className="text-sm">{selectedMsg.conteudo}</p>
                  </CardContent>
                </Card>
                <div>
                  <label className="text-sm font-medium">Mensagem:</label>
                  <Textarea
                    placeholder="Escreva a resposta para o usuário..."
                    rows={4}
                    value={resposta}
                    onChange={(e) => setResposta(e.target.value)}
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedMsg(null)}>Cancelar</Button>
              <Button onClick={handleEnviarResposta}>
                <Send className="h-4 w-4 mr-1" />
                Enviar Resposta
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminContatos;
