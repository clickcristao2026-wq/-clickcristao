import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Box, XCircle, RotateCcw, AlertTriangle, Eye, Send, Clock } from "lucide-react";

const produtosCancelados = [
  {
    id: 1,
    codigo: "PED-2026-045",
    produto: "Bíblia de Estudo",
    comprador: "Roberto Silva",
    vendedor: "Livraria Cristã",
    motivo: "Desistência do comprador",
    data: "02/02/2026",
    valor: "R$ 189,90"
  },
  {
    id: 2,
    codigo: "PED-2026-032",
    produto: "Quadro Decorativo",
    comprador: "Juliana Costa",
    vendedor: "Arte Sacra",
    motivo: "Produto indisponível",
    data: "01/02/2026",
    valor: "R$ 79,90"
  },
];

const produtosDevolvidos = [
  {
    id: 1,
    codigo: "DEV-2026-012",
    produto: "Camiseta Gospel M",
    comprador: "Paulo Henrique",
    vendedor: "Moda Cristã",
    motivo: "Tamanho incorreto",
    dataDevol: "03/02/2026",
    prazo: "7 dias",
    status: "em_transito",
    valor: "R$ 59,90"
  },
  {
    id: 2,
    codigo: "DEV-2026-011",
    produto: "Livro - Vida com Propósito",
    comprador: "Mariana Souza",
    vendedor: "Editora Fé",
    motivo: "Produto com defeito",
    dataDevol: "31/01/2026",
    prazo: "7 dias",
    status: "entregue_vendedor",
    valor: "R$ 45,00"
  },
];

const produtosDenunciados = [
  {
    id: 1,
    codigo: "DEN-2026-003",
    produto: "Curso Online Teologia",
    vendedor: "Seminário Virtual",
    denunciante: "José Ferreira",
    motivo: "Conteúdo não corresponde ao anunciado",
    data: "02/02/2026",
    status: "em_analise"
  },
  {
    id: 2,
    codigo: "DEN-2026-002",
    produto: "Acessório Religioso",
    vendedor: "Artesanato Cristão",
    denunciante: "Ana Clara",
    motivo: "Suspeita de falsificação",
    data: "30/01/2026",
    status: "em_analise"
  },
];

const AdminMercadorias = () => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "em_transito":
        return <Badge className="bg-blue-500">Em Trânsito</Badge>;
      case "entregue_vendedor":
        return <Badge className="bg-green-500">Entregue ao Vendedor</Badge>;
      case "em_analise":
        return <Badge className="bg-yellow-500">Em Análise</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <AdminLayout title="Mercadorias">
      <div className="space-y-6">
        {/* Cards de resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-red-100">
                  <XCircle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-700">{produtosCancelados.length}</p>
                  <p className="text-sm text-red-600">Cancelados</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-yellow-100">
                  <RotateCcw className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-yellow-700">{produtosDevolvidos.length}</p>
                  <p className="text-sm text-yellow-600">Devolvidos</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-orange-100">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-orange-700">{produtosDenunciados.length}</p>
                  <p className="text-sm text-orange-600">Denunciados</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="cancelados" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="cancelados">Produto Cancelado</TabsTrigger>
            <TabsTrigger value="devolvidos">Produto Devolvido</TabsTrigger>
            <TabsTrigger value="denunciados">Produto Denunciado</TabsTrigger>
          </TabsList>

          <TabsContent value="cancelados">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-500" />
                  Produtos Cancelados
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  ⚡ Sincronizado com Usuário Consumidor em MERCADORIA / CANCELAR PRODUTO
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {produtosCancelados.map((produto) => (
                    <div
                      key={produto.id}
                      className="flex items-center gap-4 p-4 border border-red-200 rounded-lg bg-red-50/50"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{produto.codigo}</h4>
                          <Badge variant="destructive">Cancelado</Badge>
                        </div>
                        <p className="text-sm font-medium">{produto.produto}</p>
                        <p className="text-sm text-muted-foreground">
                          Comprador: {produto.comprador} | Vendedor: {produto.vendedor}
                        </p>
                        <p className="text-xs text-red-600 mt-1">Motivo: {produto.motivo}</p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {produto.data} | {produto.valor}
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        Detalhes
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="devolvidos">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RotateCcw className="h-5 w-5 text-yellow-500" />
                  Produtos Devolvidos
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  ⚡ Sincronizado com Usuário Consumidor em MERCADORIA / DEVOLVER PRODUTO e LOGÍSTICA / TEMPORIZADOR
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {produtosDevolvidos.map((produto) => (
                    <div
                      key={produto.id}
                      className="flex items-center gap-4 p-4 border border-yellow-200 rounded-lg bg-yellow-50/50"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{produto.codigo}</h4>
                          {getStatusBadge(produto.status)}
                        </div>
                        <p className="text-sm font-medium">{produto.produto}</p>
                        <p className="text-sm text-muted-foreground">
                          Comprador: {produto.comprador} | Vendedor: {produto.vendedor}
                        </p>
                        <p className="text-xs text-yellow-600 mt-1">Motivo: {produto.motivo}</p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {produto.dataDevol} | Prazo: {produto.prazo} | {produto.valor}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          Detalhes
                        </Button>
                        <Button size="sm" className="bg-primary hover:bg-primary/90">
                          <Send className="h-4 w-4 mr-1" />
                          Enviar p/ Logística
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="denunciados">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  Produtos Denunciados
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Todos os produtos denunciados pelos usuários chegam aqui para averiguação
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {produtosDenunciados.map((produto) => (
                    <div
                      key={produto.id}
                      className="flex items-center gap-4 p-4 border border-orange-200 rounded-lg bg-orange-50/50"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{produto.codigo}</h4>
                          {getStatusBadge(produto.status)}
                        </div>
                        <p className="text-sm font-medium">{produto.produto}</p>
                        <p className="text-sm text-muted-foreground">
                          Vendedor: {produto.vendedor} | Denunciante: {produto.denunciante}
                        </p>
                        <p className="text-xs text-orange-600 mt-1">Motivo: {produto.motivo}</p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {produto.data}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          Investigar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminMercadorias;
