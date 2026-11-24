import FinanceiroLayout from "@/components/FinanceiroLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { categoriasVariaveis, categoriasFixas, historicosPorCategoria, transacaoParceiro } from "@/data/dashboardTransactions";
import { formatarCentavos, mesesDoAno as meses } from "@/data/gerenciamentoDadosMensais";

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

  const hasData = mesSelecionado === "Janeiro";
  const fixedCards = [transacaoParceiro, ...categoriasFixas];
  const activeVariable = categoriasVariaveis.find((category) => category.id === expandedVar);
  const activeFixed = fixedCards.find((category) => category.id === expandedFixa);

  return (
    <FinanceiroLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Transações</h1>
            <p className="text-muted-foreground">Dados demonstrativos de transações de janeiro de 2025</p>
          </div>
          <Select value={mesSelecionado} onValueChange={setMesSelecionado}>
            <SelectTrigger aria-label="Selecionar mês" className="w-48">
              <SelectValue placeholder="Selecione o mês" />
            </SelectTrigger>
            <SelectContent>
              {meses.map((mes) => (
                <SelectItem key={mes} value={mes}>{mes}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {!hasData && <p role="status" className="text-sm text-muted-foreground">Sem transações detalhadas para este mês.</p>}
        <Tabs defaultValue="variaveis" className="space-y-4">
          <TabsList className="flex h-auto flex-wrap justify-start">
            <TabsTrigger value="variaveis">Vendas Variáveis (Produtos)</TabsTrigger>
            <TabsTrigger value="fixas">Vendas Fixas (Anúncios)</TabsTrigger>
          </TabsList>

          <TabsContent value="variaveis" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {categoriasVariaveis.map((cat) => (
                <Card key={cat.id} className="transition-shadow hover:shadow-md">
                  <CardHeader className="pb-2 flex flex-row items-center justify-between">
                    <CardTitle className="w-full text-lg">
                      <Button
                        type="button"
                        variant="ghost"
                        className="h-auto w-full justify-between gap-2 whitespace-normal p-0 text-left text-inherit hover:bg-transparent hover:text-primary"
                        aria-expanded={hasData && expandedVar === cat.id}
                        disabled={!hasData}
                        onClick={() => setExpandedVar(expandedVar === cat.id ? null : cat.id)}
                      >
                        {cat.nome}
                        {expandedVar === cat.id ? <ChevronUp aria-hidden="true" /> : <ChevronDown aria-hidden="true" />}
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Qtd. Vendas:</span>
                      <span className="font-medium">{hasData ? cat.vendas : "—"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Fechamento:</span>
                      <span className="font-medium">{hasData ? cat.fechamento : "—"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Valor Vendas:</span>
                      <span className="font-medium text-primary">{hasData ? formatarCentavos(cat.valorVendas) : "—"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tx. Plataforma:</span>
                      <span className="font-medium text-green-600">{hasData ? formatarCentavos(cat.taxaPlataforma) : "—"}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {hasData && activeVariable && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Histórico de Vendas - {activeVariable.nome}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <HistoricoBloco categoria={activeVariable.id} />
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="fixas" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {fixedCards.map((cat) => (
                <Card key={cat.id} className="transition-shadow hover:shadow-md">
                  <CardHeader className="pb-2 flex flex-row items-center justify-between">
                    <CardTitle className="w-full text-lg">
                      <Button
                        type="button"
                        variant="ghost"
                        className="h-auto w-full justify-between gap-2 whitespace-normal p-0 text-left text-inherit hover:bg-transparent hover:text-primary"
                        aria-expanded={hasData && expandedFixa === cat.id}
                        disabled={!hasData}
                        onClick={() => setExpandedFixa(expandedFixa === cat.id ? null : cat.id)}
                      >
                        {cat.nome}
                        {expandedFixa === cat.id ? <ChevronUp aria-hidden="true" /> : <ChevronDown aria-hidden="true" />}
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{"vendas" in cat ? "Qtd. Vendas:" : "Qtd. Faturamento:"}</span>
                      <span className="font-medium">{hasData ? ("vendas" in cat ? cat.vendas : cat.faturamento) : "—"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Fechamento:</span>
                      <span className="font-medium">{hasData ? cat.fechamento : "—"}</span>
                    </div>
                    {"valorVendas" in cat && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Valor Vendas:</span>
                        <span className="font-medium text-primary">{hasData ? formatarCentavos(cat.valorVendas) : "—"}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{"taxaPlataforma" in cat ? "Tx. Plataforma:" : "Valor Plataforma:"}</span>
                      <span className="font-medium text-green-600">
                        {hasData ? formatarCentavos("taxaPlataforma" in cat ? cat.taxaPlataforma : cat.valorPlataforma) : "—"}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {hasData && activeFixed && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Histórico de Vendas - {activeFixed.nome}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {activeFixed.id === transacaoParceiro.id ? (
                    <HistoricoBloco categoria={activeFixed.id} />
                  ) : <p className="text-sm text-muted-foreground">Sem histórico detalhado para {activeFixed.nome}.</p>}
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
