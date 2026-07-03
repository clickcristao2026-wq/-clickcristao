import { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, MessageSquare, Eye, Clock, Users, Plus, Send } from "lucide-react";

const solicitacoesNovidades = [
  { id: 1, email: "joao.silva@email.com", nome: "João Silva", telefone: "(11) 99999-0001", dataInscricao: "03/02/2026", status: "ativo" },
  { id: 2, email: "maria.santos@email.com", nome: "Maria Santos", telefone: "(11) 99999-0002", dataInscricao: "02/02/2026", status: "ativo" },
  { id: 3, email: "pedro.oliveira@email.com", nome: "Pedro Oliveira", telefone: "(11) 99999-0003", dataInscricao: "01/02/2026", status: "ativo" },
  { id: 4, email: "ana.costa@email.com", nome: "Ana Costa", telefone: "(11) 99999-0004", dataInscricao: "31/01/2026", status: "ativo" },
  { id: 5, email: "carlos.ferreira@email.com", nome: "Carlos Ferreira", telefone: "(11) 99999-0005", dataInscricao: "30/01/2026", status: "cancelado" },
];

const AdminNovidades = () => {
  const [showForm, setShowForm] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [mensagem, setMensagem] = useState("");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ativo":
        return <Badge className="bg-green-500">Ativo</Badge>;
      case "cancelado":
        return <Badge variant="secondary">Cancelado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const inscritos = solicitacoesNovidades.filter(s => s.status === "ativo").length;

  const handleEnviar = () => {
    setShowForm(false);
    setTitulo("");
    setMensagem("");
  };

  return (
    <AdminLayout title="Novidades">
      <div className="space-y-6">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">
              <strong>⚡ Sincronização:</strong> Sincronizado com a página Home: "Receba Novidades". 
              Todas as solicitações dos usuários que querem receber novidades aparecem aqui.
            </p>
          </CardContent>
        </Card>

        {/* Cards de resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-green-100">
                  <Users className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{inscritos}</p>
                  <p className="text-sm text-muted-foreground">Inscritos Ativos</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-blue-100">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-sm text-muted-foreground">Mensagens Enviadas</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-purple-100">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">89%</p>
                  <p className="text-sm text-muted-foreground">Taxa de Recebimento</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Botão Nova Mensagem */}
        <div className="flex justify-end">
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setShowForm(!showForm)}>
            <Plus className="h-4 w-4 mr-1" />
            Nova Mensagem
          </Button>
        </div>

        {/* Formulário inline */}
        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>Nova Mensagem - Click Cristão</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 space-y-2">
                  <Label>Título</Label>
                  <Input
                    placeholder="Título da mensagem"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label>Mensagem</Label>
                  <Textarea
                    placeholder="Escreva a mensagem de novidades da Click Cristão..."
                    rows={6}
                    value={mensagem}
                    onChange={(e) => setMensagem(e.target.value)}
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                A mensagem será enviada via WhatsApp para todos os {inscritos} inscritos ativos.
              </p>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleEnviar}>
                  <Send className="h-4 w-4 mr-1" />
                  Enviar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Lista de Inscritos - Receba Novidades
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {solicitacoesNovidades.map((inscrito) => (
                <div
                  key={inscrito.id}
                  className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="p-2 rounded-full bg-primary/10">
                    <MessageSquare className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{inscrito.nome}</h4>
                    <p className="text-sm text-muted-foreground">{inscrito.email}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {inscrito.dataInscricao}
                    </span>
                    {getStatusBadge(inscrito.status)}
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      Detalhes
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminNovidades;
