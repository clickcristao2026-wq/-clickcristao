import FinanceiroLayout from "@/components/FinanceiroLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

const meses = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const categoriasVariaveis = [
  { nome: "Bazar", vendas: 145, fechamento: "30/01/2025", valorVendas: "R$ 12.500,00", taxaPlataforma: "R$ 1.250,00" },
  { nome: "Outlet", vendas: 89, fechamento: "30/01/2025", valorVendas: "R$ 8.900,00", taxaPlataforma: "R$ 890,00" },
  { nome: "Digital", vendas: 234, fechamento: "30/01/2025", valorVendas: "R$ 15.600,00", taxaPlataforma: "R$ 1.560,00" },
  { nome: "Produtos", vendas: 312, fechamento: "30/01/2025", valorVendas: "R$ 45.800,00", taxaPlataforma: "R$ 4.580,00" },
  { nome: "Feira", vendas: 67, fechamento: "30/01/2025", valorVendas: "R$ 5.200,00", taxaPlataforma: "R$ 520,00" },
];

const categoriasFixas = [
  { nome: "Imobiliário", faturamento: 12, fechamento: "30/01/2025", valorPlataforma: "R$ 3.600,00" },
  { nome: "Maquinário", faturamento: 8, fechamento: "30/01/2025", valorPlataforma: "R$ 2.400,00" },
  { nome: "Motocicleta", faturamento: 45, fechamento: "30/01/2025", valorPlataforma: "R$ 4.500,00" },
  { nome: "Transporte", faturamento: 23, fechamento: "30/01/2025", valorPlataforma: "R$ 2.300,00" },
  { nome: "Aeronave", faturamento: 3, fechamento: "30/01/2025", valorPlataforma: "R$ 1.500,00" },
  { nome: "Náutico", faturamento: 7, fechamento: "30/01/2025", valorPlataforma: "R$ 2.100,00" },
  { nome: "Serviço", faturamento: 156, fechamento: "30/01/2025", valorPlataforma: "R$ 7.800,00" },
];

const historicosPorCategoria: Record<string, Array<{ id: string; produto: string; data: string; valor: string; taxa: string; status: string }>> = {
  Feira: [
    { id: "TRX040", produto: "Artesanato Regional", data: "15/01/2025", valor: "R$ 65,00", taxa: "R$ 6,50", status: "Concluído" },
    { id: "TRX041", produto: "Produto de Feira Livre", data: "14/01/2025", valor: "R$ 42,00", taxa: "R$ 4,20", status: "Concluído" },
  ],
  Bazar: [
    { id: "TRX001", produto: "Camiseta Gospel", data: "15/01/2025", valor: "R$ 79,90", taxa: "R$ 7,99", status: "Concluído" },
    { id: "TRX002", produto: "Caneca Cristã", data: "14/01/2025", valor: "R$ 35,00", taxa: "R$ 3,50", status: "Concluído" },
    { id: "TRX003", produto: "Adesivo Religioso", data: "13/01/2025", valor: "R$ 12,00", taxa: "R$ 1,20", status: "Pendente" },
  ],
  Outlet: [
    { id: "TRX010", produto: "Livro Devocional (Outlet)", data: "15/01/2025", valor: "R$ 25,00", taxa: "R$ 2,50", status: "Concluído" },
    { id: "TRX011", produto: "CD Gospel Antigo", data: "14/01/2025", valor: "R$ 15,00", taxa: "R$ 1,50", status: "Concluído" },
  ],
  Digital: [
    { id: "TRX020", produto: "E-book Bíblia Comentada", data: "15/01/2025", valor: "R$ 49,90", taxa: "R$ 4,99", status: "Concluído" },
    { id: "TRX021", produto: "Curso Online Teologia", data: "14/01/2025", valor: "R$ 199,00", taxa: "R$ 19,90", status: "Concluído" },
    { id: "TRX022", produto: "Música Digital Gospel", data: "13/01/2025", valor: "R$ 9,90", taxa: "R$ 0,99", status: "Pendente" },
  ],
  Produtos: [
    { id: "TRX030", produto: "Bíblia Sagrada NVI", data: "15/01/2025", valor: "R$ 89,90", taxa: "R$ 8,99", status: "Concluído" },
    { id: "TRX031", produto: "Kit Artigos Religiosos", data: "14/01/2025", valor: "R$ 150,00", taxa: "R$ 15,00", status: "Concluído" },
    { id: "TRX032", produto: "Quadro Decorativo", data: "13/01/2025", valor: "R$ 120,00", taxa: "R$ 12,00", status: "Pendente" },
  ],
};

const HistoricoBloco = ({ categoria }: { categoria: string }) => {
  const historico = historicosPorCategoria[categoria] || [];
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Produto</TableHead>
          <TableHead>Data</TableHead>
          <TableHead>Valor</TableHead>
          <TableHead>Taxa</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {historico.map((venda) => (
          <TableRow key={venda.id}>
            <TableCell className="font-medium">{venda.id}</TableCell>
            <TableCell>{venda.produto}</TableCell>
            <TableCell>{venda.data}</TableCell>
            <TableCell>{venda.valor}</TableCell>
            <TableCell className="text-green-600">{venda.taxa}</TableCell>
            <TableCell>
              <Badge variant={venda.status === "Concluído" ? "default" : "secondary"}>{venda.status}</Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const Transacao = () => {
  const [mesSelecionado, setMesSelecionado] = useState("Janeiro");
  const [expandedVar, setExpandedVar] = useState<string | null>(null);
  const [expandedFixa, setExpandedFixa] = useState<string | null>(null);

  return (
    <FinanceiroLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Transações</h1>
            <p className="text-muted-foreground">Contabilização sincronizada com gateway de pagamentos</p>
          </div>
          <Select value={mesSelecionado} onValueChange={setMesSelecionado}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Selecione o mês" />
            </SelectTrigger>
            <SelectContent>
              {meses.map((mes) => (
                <SelectItem key={mes} value={mes}>{mes}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="variaveis" className="space-y-4">
          <TabsList>
            <TabsTrigger value="variaveis">Vendas Variáveis (Produtos)</TabsTrigger>
            <TabsTrigger value="fixas">Vendas Fixas (Anúncios)</TabsTrigger>
          </TabsList>

          <TabsContent value="variaveis" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {categoriasVariaveis.map((cat) => (
                <Card key={cat.nome} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setExpandedVar(expandedVar === cat.nome ? null : cat.nome)}>
                  <CardHeader className="pb-2 flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">{cat.nome}</CardTitle>
                    {expandedVar === cat.nome ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Qtd. Vendas:</span>
                      <span className="font-medium">{cat.vendas}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Fechamento:</span>
                      <span className="font-medium">{cat.fechamento}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Valor Vendas:</span>
                      <span className="font-medium text-primary">{cat.valorVendas}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tx. Plataforma:</span>
                      <span className="font-medium text-green-600">{cat.taxaPlataforma}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {expandedVar && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Histórico de Vendas - {expandedVar}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <HistoricoBloco categoria={expandedVar} />
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="fixas" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {categoriasFixas.map((cat) => (
                <Card key={cat.nome} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setExpandedFixa(expandedFixa === cat.nome ? null : cat.nome)}>
                  <CardHeader className="pb-2 flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">{cat.nome}</CardTitle>
                    {expandedFixa === cat.nome ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Qtd. Faturamento:</span>
                      <span className="font-medium">{cat.faturamento}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Fechamento:</span>
                      <span className="font-medium">{cat.fechamento}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Valor Plataforma:</span>
                      <span className="font-medium text-green-600">{cat.valorPlataforma}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {expandedFixa && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Histórico de Vendas - {expandedFixa}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Histórico de anúncios da categoria {expandedFixa} sincronizado com gateway.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </FinanceiroLayout>
  );
};

export default Transacao;
