import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Ticket, Plus, Eye, Clock, Percent, Gift } from "lucide-react";
import { useState } from "react";

const campanhasAtivas = [
  {
    id: 1,
    nome: "Black Friday Gospel",
    tipo: "Cupom",
    codigo: "GOSPEL30",
    desconto: "30%",
    validade: "30/11/2026",
    usos: 156,
    limite: 500,
    status: "ativa"
  },
  {
    id: 2,
    nome: "Primeira Compra",
    tipo: "Voucher",
    codigo: "BEMVINDO10",
    desconto: "R$ 10,00",
    validade: "31/12/2026",
    usos: 89,
    limite: 1000,
    status: "ativa"
  },
  {
    id: 3,
    nome: "Natal Abençoado",
    tipo: "Cupom",
    codigo: "NATAL25",
    desconto: "25%",
    validade: "25/12/2026",
    usos: 45,
    limite: 300,
    status: "programada"
  },
];

const AdminCampanhas = () => {
  const [showForm, setShowForm] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ativa":
        return <Badge className="bg-green-500">Ativa</Badge>;
      case "programada":
        return <Badge className="bg-blue-500">Programada</Badge>;
      case "encerrada":
        return <Badge variant="secondary">Encerrada</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <AdminLayout title="Campanhas">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <p className="text-muted-foreground">
            Emissão de cupons e vouchers por parte da plataforma
          </p>
          <Button onClick={() => setShowForm(!showForm)} className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Nova Campanha
          </Button>
        </div>

        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>Criar Nova Campanha</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome da Campanha</Label>
                  <Input placeholder="Ex: Promoção de Páscoa" />
                </div>
                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cupom">Cupom</SelectItem>
                      <SelectItem value="voucher">Voucher</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Código</Label>
                  <Input placeholder="Ex: PASCOA20" />
                </div>
                <div className="space-y-2">
                  <Label>Tipo de Desconto</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="porcentagem">Porcentagem (%)</SelectItem>
                      <SelectItem value="valor">Valor Fixo (R$)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Valor do Desconto</Label>
                  <Input type="number" placeholder="Ex: 20" />
                </div>
                <div className="space-y-2">
                  <Label>Limite de Usos</Label>
                  <Input type="number" placeholder="Ex: 500" />
                </div>
                <div className="space-y-2">
                  <Label>Data de Início</Label>
                  <Input type="date" />
                </div>
                <div className="space-y-2">
                  <Label>Data de Validade</Label>
                  <Input type="date" />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label>Descrição</Label>
                  <Textarea placeholder="Descreva os termos e condições da campanha..." />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setShowForm(false)}>
                  Cancelar
                </Button>
                <Button className="bg-primary hover:bg-primary/90">
                  Criar Campanha
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
                <div className="p-2 rounded-full bg-green-100">
                  <Ticket className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">3</p>
                  <p className="text-sm text-muted-foreground">Campanhas Ativas</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-blue-100">
                  <Percent className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">290</p>
                  <p className="text-sm text-muted-foreground">Cupons Utilizados</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-purple-100">
                  <Gift className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">R$ 2.450</p>
                  <p className="text-sm text-muted-foreground">Descontos Aplicados</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de campanhas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ticket className="h-5 w-5" />
              Campanhas Cadastradas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {campanhasAtivas.map((campanha) => (
                <div
                  key={campanha.id}
                  className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="p-3 rounded-full bg-primary/10">
                    {campanha.tipo === "Cupom" ? (
                      <Percent className="h-5 w-5 text-primary" />
                    ) : (
                      <Gift className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{campanha.nome}</h4>
                      {getStatusBadge(campanha.status)}
                      <Badge variant="outline">{campanha.tipo}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Código: <span className="font-mono font-semibold text-primary">{campanha.codigo}</span>
                    </p>
                    <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                      <span>Desconto: {campanha.desconto}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Validade: {campanha.validade}
                      </span>
                      <span>Usos: {campanha.usos}/{campanha.limite}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    Gerenciar
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

export default AdminCampanhas;
