import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Send, Plus, Clock, User, Eye } from "lucide-react";
import { useState } from "react";

const mensagensEnviadas = [
  {
    id: 1,
    titulo: "Produto líder em vendas",
    mensagem: "Parabéns! Seu produto está entre os mais vendidos. Retifique as descrições para melhorar ainda mais.",
    destinatario: "Livraria Cristã",
    tipoUsuario: "Vendedor",
    dataEnvio: "03/02/2026 09:15",
    status: "lida"
  },
  {
    id: 2,
    titulo: "Atualização necessária",
    mensagem: "Por favor, atualize as fotos do seu anúncio para melhor qualidade.",
    destinatario: "Moda Gospel Store",
    tipoUsuario: "Anunciante",
    dataEnvio: "02/02/2026 14:30",
    status: "pendente"
  },
  {
    id: 3,
    titulo: "Verificação de documentos",
    mensagem: "Precisamos de uma atualização dos seus documentos cadastrais.",
    destinatario: "Arte Sacra Digital",
    tipoUsuario: "Vendedor",
    dataEnvio: "01/02/2026 11:00",
    status: "lida"
  },
];

const AdminAvisos = () => {
  const [showForm, setShowForm] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "lida":
        return <Badge className="bg-green-500">Lida</Badge>;
      case "pendente":
        return <Badge className="bg-yellow-500">Pendente</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <AdminLayout title="Avisos">
      <div className="space-y-6">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">
              <strong>⚡ Sincronização:</strong> As mensagens enviadas são sincronizadas com as notificações dos usuários destinatários.
            </p>
          </CardContent>
        </Card>

        <div className="flex justify-between items-center">
          <p className="text-muted-foreground">
            Destinar mensagens personalizadas para os usuários
          </p>
          <Button onClick={() => setShowForm(!showForm)} className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Novo Aviso
          </Button>
        </div>

        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>Enviar Aviso para Usuário</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tipo de Usuário</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="consumidor">Consumidor</SelectItem>
                      <SelectItem value="vendedor">Vendedor</SelectItem>
                      <SelectItem value="anunciante">Anunciante</SelectItem>
                      <SelectItem value="afiliado">Afiliado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Buscar Usuário</Label>
                  <Input placeholder="Nome ou e-mail do usuário" />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label>Título do Aviso</Label>
                  <Input placeholder="Ex: Produto líder em vendas" />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label>Mensagem</Label>
                  <Textarea 
                    placeholder="Digite a mensagem do aviso..."
                    rows={4}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setShowForm(false)}>
                  Cancelar
                </Button>
                <Button className="bg-primary hover:bg-primary/90">
                  <Send className="h-4 w-4 mr-2" />
                  Enviar Aviso
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Cards de resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-blue-100">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">45</p>
                  <p className="text-sm text-muted-foreground">Avisos Enviados</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-green-100">
                  <Eye className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">38</p>
                  <p className="text-sm text-muted-foreground">Lidos</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-yellow-100">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">7</p>
                  <p className="text-sm text-muted-foreground">Pendentes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Histórico de avisos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Histórico de Avisos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mensagensEnviadas.map((mensagem) => (
                <div
                  key={mensagem.id}
                  className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="p-2 rounded-full bg-primary/10">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{mensagem.titulo}</h4>
                      {getStatusBadge(mensagem.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">{mensagem.mensagem}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {mensagem.destinatario} ({mensagem.tipoUsuario})
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {mensagem.dataEnvio}
                      </span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    Ver Detalhes
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminAvisos;
