import { RhLayout } from "@/components/RhLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Eye, UserPlus } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Cooperador {
  id: number;
  nome: string;
  email: string;
  setor: string;
  status: "Ativo" | "Inativo" | "Suspenso";
  telefone: string;
  cargo: string;
  dataAdmissao: string;
  login: string;
}

const cooperadoresMock: Cooperador[] = [
  { id: 1, nome: "Carlos Silva", email: "carlos@clickcristao.com", setor: "ADM", status: "Ativo", telefone: "(11) 99999-0001", cargo: "Administrador", dataAdmissao: "10/01/2024", login: "carlos.silva" },
  { id: 2, nome: "Ana Souza", email: "ana@clickcristao.com", setor: "RH", status: "Ativo", telefone: "(11) 99999-0002", cargo: "Analista de RH", dataAdmissao: "15/02/2024", login: "ana.souza" },
  { id: 3, nome: "Pedro Santos", email: "pedro@clickcristao.com", setor: "Logística", status: "Inativo", telefone: "(11) 99999-0003", cargo: "Coordenador", dataAdmissao: "20/03/2024", login: "pedro.santos" },
  { id: 4, nome: "Maria Oliveira", email: "maria@clickcristao.com", setor: "Financeiro", status: "Ativo", telefone: "(11) 99999-0004", cargo: "Analista Financeiro", dataAdmissao: "05/04/2024", login: "maria.oliveira" },
  { id: 5, nome: "João Lima", email: "joao@clickcristao.com", setor: "Comissionado", status: "Suspenso", telefone: "(11) 99999-0005", cargo: "Agente Comercial", dataAdmissao: "12/05/2024", login: "joao.lima" },
  { id: 6, nome: "Fernanda Costa", email: "fernanda@clickcristao.com", setor: "Gerenciamento", status: "Ativo", telefone: "(11) 99999-0006", cargo: "Gerente", dataAdmissao: "01/06/2024", login: "fernanda.costa" },
];

const statusColor = {
  Ativo: "bg-green-100 text-green-800",
  Inativo: "bg-gray-100 text-gray-800",
  Suspenso: "bg-red-100 text-red-800",
};

export default function RhCooperador() {
  const [search, setSearch] = useState("");
  const [setorFilter, setSetorFilter] = useState("todos");
  const [editingCooperador, setEditingCooperador] = useState<Cooperador | null>(null);
  const [editForm, setEditForm] = useState<Cooperador | null>(null);
  const navigate = useNavigate();

  const filtered = cooperadoresMock.filter((c) => {
    const matchSearch = c.nome.toLowerCase().includes(search.toLowerCase());
    const matchSetor = setorFilter === "todos" || c.setor === setorFilter;
    return matchSearch && matchSetor;
  });

  const handleEdit = (cooperador: Cooperador) => {
    setEditingCooperador(cooperador);
    setEditForm({ ...cooperador });
  };

  return (
    <RhLayout title="Cooperador">
      <div className="space-y-6">
        {/* Header with button */}
        <div className="flex justify-end">
          <Button onClick={() => navigate("/rh/cadastro-cooperador")} style={{ backgroundColor: '#2035F2' }} className="text-white">
            <UserPlus className="h-4 w-4 mr-2" /> Novo Cooperador
          </Button>
        </div>

        {/* Filters */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label className="text-foreground font-semibold mb-2 block">Cooperador</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar funcionário"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div>
            <Label className="text-foreground font-semibold mb-2 block">Setor</Label>
            <Select value={setorFilter} onValueChange={setSetorFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Selecionar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="RH">RH</SelectItem>
                <SelectItem value="ADM">ADM</SelectItem>
                <SelectItem value="Logística">Logística</SelectItem>
                <SelectItem value="Financeiro">Financeiro</SelectItem>
                <SelectItem value="Comissionado">Comissionado</SelectItem>
                <SelectItem value="Gerenciamento">Gerenciamento</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">Lista de Cooperadores</h3>
          <div className="border border-border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Nome</TableHead>
                  <TableHead>Setor</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.nome}</TableCell>
                    <TableCell>{c.setor}</TableCell>
                    <TableCell>{c.email}</TableCell>
                    <TableCell>
                      <Badge className={statusColor[c.status]}>{c.status}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => handleEdit(c)}>
                            <Eye className="h-4 w-4 mr-1" /> Detalhes
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg">
                          <DialogHeader>
                            <DialogTitle>Detalhes do Cooperador</DialogTitle>
                          </DialogHeader>
                          {editForm && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>Nome</Label>
                                  <Input value={editForm.nome} onChange={(e) => setEditForm({ ...editForm, nome: e.target.value })} />
                                </div>
                                <div>
                                  <Label>E-mail</Label>
                                  <Input value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} />
                                </div>
                                <div>
                                  <Label>Telefone</Label>
                                  <Input value={editForm.telefone} onChange={(e) => setEditForm({ ...editForm, telefone: e.target.value })} />
                                </div>
                                <div>
                                  <Label>Cargo</Label>
                                  <Input value={editForm.cargo} onChange={(e) => setEditForm({ ...editForm, cargo: e.target.value })} />
                                </div>
                                <div>
                                  <Label>Setor</Label>
                                  <Select value={editForm.setor} onValueChange={(v) => setEditForm({ ...editForm, setor: v })}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="RH">RH</SelectItem>
                                      <SelectItem value="ADM">ADM</SelectItem>
                                      <SelectItem value="Logística">Logística</SelectItem>
                                      <SelectItem value="Financeiro">Financeiro</SelectItem>
                                      <SelectItem value="Comissionado">Comissionado</SelectItem>
                                      <SelectItem value="Gerenciamento">Gerenciamento</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label>Status</Label>
                                  <Select value={editForm.status} onValueChange={(v) => setEditForm({ ...editForm, status: v as Cooperador["status"] })}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Ativo">Ativo</SelectItem>
                                      <SelectItem value="Inativo">Inativo</SelectItem>
                                      <SelectItem value="Suspenso">Suspenso</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label>Login</Label>
                                  <Input value={editForm.login} onChange={(e) => setEditForm({ ...editForm, login: e.target.value })} />
                                </div>
                                <div>
                                  <Label>Data de Admissão</Label>
                                  <Input value={editForm.dataAdmissao} readOnly className="bg-muted" />
                                </div>
                              </div>
                              <div className="flex gap-2 justify-end">
                                <Button variant="outline">Cancelar</Button>
                                <Button style={{ backgroundColor: '#2035F2' }} className="text-white">Salvar Alterações</Button>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </RhLayout>
  );
}
