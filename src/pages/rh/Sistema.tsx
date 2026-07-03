import { RhLayout } from "@/components/RhLayout";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface CooperadorOnline {
  id: number;
  nome: string;
  setor: string;
  loginDesde: string;
}

const onlineMock: CooperadorOnline[] = [
  { id: 1, nome: "Carlos Silva", setor: "ADM", loginDesde: "08:30" },
  { id: 2, nome: "Ana Souza", setor: "RH", loginDesde: "09:00" },
  { id: 3, nome: "Maria Oliveira", setor: "Financeiro", loginDesde: "08:45" },
  { id: 4, nome: "Fernanda Costa", setor: "Gerenciamento", loginDesde: "09:15" },
  { id: 5, nome: "Bruno Teixeira", setor: "Logística", loginDesde: "07:50" },
  { id: 6, nome: "Ricardo Moraes", setor: "Comissionado", loginDesde: "10:00" },
  { id: 7, nome: "Paula Mendes", setor: "ADM", loginDesde: "08:00" },
];

const setores = [
  { label: "RH", count: 1, color: "#3B82F6" },
  { label: "ADM", count: 2, color: "#8B5CF6" },
  { label: "Logística", count: 1, color: "#F59E0B" },
  { label: "Financeiro", count: 1, color: "#10B981" },
  { label: "Comissionado", count: 1, color: "#EF4444" },
  { label: "Gerenciamento", count: 1, color: "#EC4899" },
];

const totalLogados = setores.reduce((sum, s) => sum + s.count, 0);

const pieData = setores.map((s) => ({ name: s.label, value: s.count, color: s.color }));

export default function RhSistema() {
  const [selectedSetor, setSelectedSetor] = useState<string | null>(null);

  const filteredOnline = selectedSetor
    ? onlineMock.filter((c) => c.setor === selectedSetor)
    : [];

  return (
    <RhLayout title="Sistema">
      <div className="space-y-6">
        {/* Blocos por setor */}
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
          <p className="text-sm text-muted-foreground">Total Logados</p>
          <p className="text-3xl font-bold text-primary">{totalLogados}</p>
        </div>

        {/* Online List */}
        {selectedSetor && (
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Cooperadores Online - {selectedSetor}
            </h3>
            <div className="border border-border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Nome</TableHead>
                    <TableHead>Setor</TableHead>
                    <TableHead>Online desde</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOnline.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium">{c.nome}</TableCell>
                      <TableCell>{c.setor}</TableCell>
                      <TableCell>{c.loginDesde}</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">
                          <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1.5 animate-pulse"></span>
                          Online
                        </Badge>
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
