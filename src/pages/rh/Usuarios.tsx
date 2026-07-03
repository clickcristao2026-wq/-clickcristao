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

interface User {
  id: number;
  nome: string;
  contato: string;
  ultimoAcesso: string;
  status: "Ativo" | "Inativo" | "Suspenso";
  categoria: string;
  email: string;
}

const categorias = [
  { label: "Consumidor", count: 3, color: "#3B82F6" },
  { label: "Vendedor", count: 3, color: "#8B5CF6" },
  { label: "Anunciante", count: 2, color: "#F59E0B" },
  { label: "Afiliado", count: 2, color: "#10B981" },
];

const totalAtivos = categorias.reduce((sum, c) => sum + c.count, 0);

const allUsers: User[] = [
  { id: 1, nome: "Lucas Martins", contato: "(11) 98888-1001", ultimoAcesso: "09/04/2026", status: "Ativo", categoria: "Consumidor", email: "lucas@email.com" },
  { id: 2, nome: "Bruna Alves", contato: "(21) 97777-2002", ultimoAcesso: "08/04/2026", status: "Ativo", categoria: "Consumidor", email: "bruna@email.com" },
  { id: 3, nome: "Diego Rocha", contato: "(51) 94444-5005", ultimoAcesso: "10/04/2026", status: "Ativo", categoria: "Consumidor", email: "diego@email.com" },
  { id: 4, nome: "Marcos Pereira", contato: "(11) 98888-6001", ultimoAcesso: "09/04/2026", status: "Ativo", categoria: "Vendedor", email: "marcos@email.com" },
  { id: 5, nome: "Juliana Costa", contato: "(21) 97777-7002", ultimoAcesso: "07/04/2026", status: "Ativo", categoria: "Vendedor", email: "juliana@email.com" },
  { id: 6, nome: "Patricia Ramos", contato: "(41) 95555-9004", ultimoAcesso: "10/04/2026", status: "Ativo", categoria: "Vendedor", email: "patricia@email.com" },
  { id: 7, nome: "Rafael Mendes", contato: "(11) 98888-1101", ultimoAcesso: "10/04/2026", status: "Ativo", categoria: "Anunciante", email: "rafael@email.com" },
  { id: 8, nome: "Larissa Gomes", contato: "(21) 97777-1202", ultimoAcesso: "05/04/2026", status: "Ativo", categoria: "Anunciante", email: "larissa@email.com" },
  { id: 9, nome: "Gustavo Lima", contato: "(11) 98888-2101", ultimoAcesso: "09/04/2026", status: "Ativo", categoria: "Afiliado", email: "gustavo@email.com" },
  { id: 10, nome: "Amanda Ribeiro", contato: "(21) 97777-2202", ultimoAcesso: "08/04/2026", status: "Ativo", categoria: "Afiliado", email: "amanda@email.com" },
];

const pieData = categorias.map((c) => ({ name: c.label, value: c.count, color: c.color }));

const statusColor = {
  Ativo: "bg-green-100 text-green-800",
  Inativo: "bg-gray-100 text-gray-800",
  Suspenso: "bg-red-100 text-red-800",
};

export default function RhUsuarios() {
  const [selectedCategoria, setSelectedCategoria] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = selectedCategoria
    ? allUsers.filter((u) => u.categoria === selectedCategoria && u.nome.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];

  return (
    <RhLayout title="Usuários">
      <div className="space-y-6">
        {/* Category Blocks */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categorias.map((c) => (
            <div
              key={c.label}
              onClick={() => setSelectedCategoria(selectedCategoria === c.label ? null : c.label)}
              className={`border-2 rounded-xl p-6 text-center cursor-pointer transition-all hover:shadow-md ${selectedCategoria === c.label ? "ring-2 ring-primary shadow-lg" : ""}`}
              style={{ borderColor: c.color, backgroundColor: c.color + "15" }}
            >
              <p className="text-3xl font-bold" style={{ color: c.color }}>{c.count}</p>
              <p className="text-sm font-medium text-foreground mt-1">{c.label}</p>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="bg-primary/10 border-2 border-primary rounded-xl p-4 text-center">
          <p className="text-sm text-muted-foreground">Total Cadastrados (Ativos)</p>
          <p className="text-3xl font-bold text-primary">{totalAtivos}</p>
        </div>

        {/* List */}
        {selectedCategoria && (
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Lista de Cadastrados - {selectedCategoria}</h3>
            <div className="mb-4">
              <Input
                placeholder="Pesquisar usuário..."
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
                  {filteredUsers.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium">{u.nome}</TableCell>
                      <TableCell>{u.contato}</TableCell>
                      <TableCell>{u.ultimoAcesso}</TableCell>
                      <TableCell><Badge className={statusColor[u.status]}>{u.status}</Badge></TableCell>
                      <TableCell className="text-center">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setEditForm({ ...u })}>
                              <Eye className="h-4 w-4 mr-1" /> Detalhes
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader><DialogTitle>Detalhes do Usuário</DialogTitle></DialogHeader>
                            {editForm && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div><Label>Nome</Label><Input value={editForm.nome} onChange={(e) => setEditForm({ ...editForm, nome: e.target.value })} /></div>
                                  <div><Label>E-mail</Label><Input value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} /></div>
                                  <div><Label>Contato</Label><Input value={editForm.contato} onChange={(e) => setEditForm({ ...editForm, contato: e.target.value })} /></div>
                                  <div><Label>Categoria</Label><Input value={editForm.categoria} readOnly className="bg-muted" /></div>
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
