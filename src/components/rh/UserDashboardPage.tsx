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
  email: string;
  endereco: string;
  cpf: string;
}

interface UserDashboardPageProps {
  title: string;
  categoria: string;
  ativos: number;
  inativos: number;
  suspensos: number;
  usuarios: User[];
  pieData: { name: string; value: number; color: string }[];
}

const statusColor = {
  Ativo: "bg-green-100 text-green-800",
  Inativo: "bg-gray-100 text-gray-800",
  Suspenso: "bg-red-100 text-red-800",
};

export function UserDashboardPage({ title, categoria, ativos, inativos, suspensos, usuarios, pieData }: UserDashboardPageProps) {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<User | null>(null);

  const filteredUsers = selectedStatus
    ? usuarios.filter((u) => u.status === selectedStatus)
    : [];

  const blocos = [
    { label: "Ativos", value: ativos, status: "Ativo", color: "border-green-500 bg-green-50 text-green-700" },
    { label: "Inativos", value: inativos, status: "Inativo", color: "border-gray-400 bg-gray-50 text-gray-700" },
    { label: "Suspensos", value: suspensos, status: "Suspenso", color: "border-red-500 bg-red-50 text-red-700" },
  ];

  return (
    <RhLayout title={title}>
      <div className="space-y-6">
        {/* Status Blocks */}
        <div className="grid grid-cols-3 gap-4">
          {blocos.map((b) => (
            <div
              key={b.label}
              onClick={() => setSelectedStatus(selectedStatus === b.status ? null : b.status)}
              className={`border-2 rounded-xl p-6 text-center cursor-pointer transition-all hover:shadow-md ${b.color} ${selectedStatus === b.status ? "ring-2 ring-primary shadow-lg" : ""}`}
            >
              <p className="text-3xl font-bold">{b.value}</p>
              <p className="text-sm font-medium mt-1">{b.label}</p>
            </div>
          ))}
        </div>

        {/* User List (when block clicked) */}
        {selectedStatus && (
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Lista de Cadastrados - {selectedStatus}s
            </h3>
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
                      <TableCell>
                        <Badge className={statusColor[u.status]}>{u.status}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setEditForm({ ...u })}>
                              <Eye className="h-4 w-4 mr-1" /> Detalhes
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-lg">
                            <DialogHeader>
                              <DialogTitle>Detalhes do {categoria}</DialogTitle>
                            </DialogHeader>
                            {editForm && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div><Label>Nome</Label><Input value={editForm.nome} onChange={(e) => setEditForm({ ...editForm, nome: e.target.value })} /></div>
                                  <div><Label>E-mail</Label><Input value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} /></div>
                                  <div><Label>Contato</Label><Input value={editForm.contato} onChange={(e) => setEditForm({ ...editForm, contato: e.target.value })} /></div>
                                  <div><Label>CPF</Label><Input value={editForm.cpf} onChange={(e) => setEditForm({ ...editForm, cpf: e.target.value })} /></div>
                                  <div className="col-span-2"><Label>Endereço</Label><Input value={editForm.endereco} onChange={(e) => setEditForm({ ...editForm, endereco: e.target.value })} /></div>
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

        {/* Pie Chart */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">Percentual de Logados por Categoria</h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  fontSize={8}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </RhLayout>
  );
}
