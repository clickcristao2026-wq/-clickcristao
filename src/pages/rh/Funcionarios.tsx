import { RhLayout } from "@/components/RhLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye } from "lucide-react";
import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface Funcionario {
  id: number;
  nome: string;
  contato: string;
  ultimoAcesso: string;
  status: "Ativo" | "Inativo" | "Suspenso";
  setor: string;
  email: string;
  cargo: string;
}

const setores = [
  { label: "RH", count: 1, color: "#3B82F6" },
  { label: "ADM", count: 2, color: "#8B5CF6" },
  { label: "Logística", count: 1, color: "#F59E0B" },
  { label: "Financeiro", count: 1, color: "#10B981" },
  { label: "Comissionado", count: 1, color: "#EF4444" },
  { label: "Gerenciamento", count: 1, color: "#EC4899" },
];

const totalAtivos = setores.reduce((sum, s) => sum + s.count, 0);

const funcionarios: Funcionario[] = [
  { id: 1, nome: "Ana Souza", contato: "(11) 99999-0002", ultimoAcesso: "10/04/2026", status: "Ativo", setor: "RH", email: "ana@clickcristao.com", cargo: "Analista de RH" },
  { id: 2, nome: "Carlos Silva", contato: "(11) 99999-0001", ultimoAcesso: "10/04/2026", status: "Ativo", setor: "ADM", email: "carlos@clickcristao.com", cargo: "Administrador" },
  { id: 3, nome: "Paula Mendes", contato: "(11) 99999-0007", ultimoAcesso: "09/04/2026", status: "Ativo", setor: "ADM", email: "paula@clickcristao.com", cargo: "Assistente" },
  { id: 4, nome: "Bruno Teixeira", contato: "(11) 99999-0008", ultimoAcesso: "10/04/2026", status: "Ativo", setor: "Logística", email: "bruno@clickcristao.com", cargo: "Coordenador" },
  { id: 5, nome: "Maria Oliveira", contato: "(11) 99999-0004", ultimoAcesso: "10/04/2026", status: "Ativo", setor: "Financeiro", email: "maria@clickcristao.com", cargo: "Analista" },
  { id: 6, nome: "João Lima", contato: "(11) 99999-0005", ultimoAcesso: "08/04/2026", status: "Ativo", setor: "Comissionado", email: "joao@clickcristao.com", cargo: "Agente" },
  { id: 7, nome: "Fernanda Costa", contato: "(11) 99999-0006", ultimoAcesso: "10/04/2026", status: "Ativo", setor: "Gerenciamento", email: "fernanda@clickcristao.com", cargo: "Gerente" },
];

const pieData = setores.map((s) => ({ name: s.label, value: s.count, color: s.color }));

const statusColor = {
  Ativo: "bg-green-100 text-green-800",
  Inativo: "bg-gray-100 text-gray-800",
  Suspenso: "bg-red-100 text-red-800",
};

export default function RhFuncionarios() {
  const [selectedSetor, setSelectedSetor] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Funcionario | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFuncionarios = selectedSetor
    ? funcionarios.filter((f) => f.setor === selectedSetor && f.nome.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];

  return (
    <RhLayout title="Funcionários">
      <div className="space-y-6">
        {/* Setor Blocks */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {setores.map((s) => (
            <div
              key={s.label}
              onClick={() => setSelectedSetor(selectedSetor === s.label ? null : s.label)}
              className={`border-2 rounded-xl p-4 text-center cursor-pointer transition-all hover:shadow-md ${selectedSetor === s.label ? "ring-2 ring-primary shadow-lg" : ""}`}
              style={{ borderColor: s.color, backgroundColor: s.color + "15" }}
            >
              <p className="text-2xl font-bold" style={{ color: s.color }}>{s.count}</p>
              <p className="text-xs font-medium text-foreground mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="bg-primary/10 border-2 border-primary rounded-xl p-4 text-center">
          <p className="text-sm text-muted-foreground">Total Cadastrados (Ativos)</p>
          <p className="text-3xl font-bold text-primary">{totalAtivos}</p>
        </div>

        {/* List */}
        {selectedSetor && (
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Lista de Cadastrados - {selectedSetor}</h3>
            <div className="mb-4">
              <Input
                placeholder="Pesquisar funcionário..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-md"
              />
            </div>
            <div className="border border-border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Usuário</TableHead>
                    <TableHead>Contato</TableHead>
                    <TableHead>Último Acesso</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-center">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFuncionarios.map((f) => (
                    <TableRow key={f.id}>
                      <TableCell className="font-medium">{f.nome}</TableCell>
                      <TableCell>{f.contato}</TableCell>
                      <TableCell>{f.ultimoAcesso}</TableCell>
                      <TableCell><Badge className={statusColor[f.status]}>{f.status}</Badge></TableCell>
                      <TableCell className="text-center">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setEditForm({ ...f })}>
                              <Eye className="h-4 w-4 mr-1" /> Detalhes
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader><DialogTitle>Detalhes do Funcionário</DialogTitle></DialogHeader>
                            {editForm && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div><Label>Nome</Label><Input value={editForm.nome} onChange={(e) => setEditForm({ ...editForm, nome: e.target.value })} /></div>
                                  <div><Label>E-mail</Label><Input value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} /></div>
                                  <div><Label>Contato</Label><Input value={editForm.contato} onChange={(e) => setEditForm({ ...editForm, contato: e.target.value })} /></div>
                                  <div><Label>Cargo</Label><Input value={editForm.cargo} onChange={(e) => setEditForm({ ...editForm, cargo: e.target.value })} /></div>
                                  <div><Label>Setor</Label><Input value={editForm.setor} readOnly className="bg-muted" /></div>
                                  <div><Label>Status</Label><Input value={editForm.status} readOnly className="bg-muted" /></div>
                                </div>
                                <div className="flex gap-2 justify-end">
                                  <Button variant="outline">Cancelar</Button>
                                  <Button style={{ backgroundColor: '#2035F2' }} className="text-white">Salvar</Button>
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
        )}

        {/* Pie */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">Percentual de Cadastrados por Categoria</h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={120} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} fontSize={8}>
                  {pieData.map((entry, index) => (<Cell key={index} fill={entry.color} />))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </RhLayout>
  );
}
