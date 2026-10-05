import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AccountLayout } from "@/components/AccountLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Pause, Play, Pencil, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { fetchMyProducts, updateProductStatus } from "@/lib/products";
import { formatBRL } from "@/lib/pricing";
import { Product, ProductStatus } from "@/types/product";
import { useToast } from "@/hooks/use-toast";

const statusLabel: Record<ProductStatus, string> = {
  rascunho: "Rascunho",
  publicado: "Publicado",
  pausado: "Pausado",
  removido: "Removido",
};

const statusColor: Record<ProductStatus, string> = {
  rascunho: "bg-gray-100 text-gray-800",
  publicado: "bg-green-100 text-green-800",
  pausado: "bg-amber-100 text-amber-800",
  removido: "bg-red-100 text-red-800",
};

const Produtos = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [produtos, setProdutos] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const carregar = async () => {
    if (!user) return;
    setLoading(true);
    setProdutos(await fetchMyProducts(user.id));
    setLoading(false);
  };

  useEffect(() => {
    carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const alternarStatus = async (produto: Product) => {
    const novoStatus: ProductStatus = produto.status === "publicado" ? "pausado" : "publicado";
    const result = await updateProductStatus(produto.id, novoStatus);
    if (!result.ok) {
      toast({ title: "Erro", description: result.error, variant: "destructive" });
      return;
    }
    carregar();
  };

  const remover = async (produto: Product) => {
    const result = await updateProductStatus(produto.id, "removido");
    if (!result.ok) {
      toast({ title: "Erro", description: result.error, variant: "destructive" });
      return;
    }
    toast({ title: "Produto removido" });
    carregar();
  };

  const produtosVisiveis = produtos.filter((p) => p.status !== "removido");

  return (
    <AccountLayout title="Produtos">
      <div className="space-y-6">
        <div className="flex justify-end">
          <Button onClick={() => navigate("/account/produtos/novo")} style={{ backgroundColor: "#10B981" }} className="text-white">
            <Plus className="h-4 w-4 mr-2" /> Adicionar Publicação
          </Button>
        </div>

        {loading ? (
          <p className="text-muted-foreground">Carregando...</p>
        ) : produtosVisiveis.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              Você ainda não cadastrou nenhum produto.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {produtosVisiveis.map((produto) => (
              <Card key={produto.id}>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-20 h-20 rounded-lg overflow-hidden border flex-shrink-0 bg-muted">
                    {(produto.imagens.find(image => image.papel === "destaque") ?? produto.imagens[0]) ? (
                      <img src={(produto.imagens.find(image => image.papel === "destaque") ?? produto.imagens[0]).url} alt={produto.nome} className="w-full h-full object-cover" />
                    ) : null}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{produto.nome}</h4>
                      <Badge className={statusColor[produto.status]}>{statusLabel[produto.status]}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formatBRL(produto.preco)}
                      {produto.sku ? ` · SKU ${produto.sku}` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/account/produtos/${produto.id}/editar`)}
                    >
                      <Pencil className="h-4 w-4 mr-1" /> Editar
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => alternarStatus(produto)}>
                      {produto.status !== "publicado" ? (
                        <><Play className="h-4 w-4 mr-1" /> {produto.status === "rascunho" ? "Publicar" : "Reativar"}</>
                      ) : (
                        <><Pause className="h-4 w-4 mr-1" /> Pausar</>
                      )}
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => remover(produto)}>
                      <Trash2 className="h-4 w-4 mr-1" /> Remover
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AccountLayout>
  );
};

export default Produtos;
