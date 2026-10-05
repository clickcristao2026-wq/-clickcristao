import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Plus, Eye, EyeOff, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  createAttribute,
  createAttributeValue,
  createCategory,
  deleteAttribute,
  deleteAttributeValue,
  deleteCategory,
  fetchAttributes,
  fetchCategoryTree,
  setAttributeActive,
  setAttributeValueActive,
  setCategoryActive,
} from "@/lib/products";
import { AttributeSelectionMode, CategoryLevel, ProductAttribute, ProductCategory } from "@/types/product";

interface ColunaProps {
  titulo: string;
  itens: ProductCategory[];
  selecionadoId: string;
  onSelect: (id: string) => void;
  onAdd: (nome: string) => void;
  onToggleActive: (item: ProductCategory) => void;
  onDelete: (item: ProductCategory) => void;
  disabledAdd?: boolean;
}

function CategoriaColuna({ titulo, itens, selecionadoId, onSelect, onAdd, onToggleActive, onDelete, disabledAdd }: ColunaProps) {
  const [novoNome, setNovoNome] = useState("");

  return (
    <div className="border rounded-lg p-3 flex flex-col gap-2">
      <h4 className="font-semibold text-sm text-foreground">{titulo}</h4>
      <div className="flex-1 space-y-1 overflow-auto max-h-72 min-h-[80px]">
        {itens.length === 0 && <p className="text-xs text-muted-foreground py-2">Nenhum item.</p>}
        {itens.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelect(item.id)}
            className={cn(
              "flex items-center justify-between gap-1 px-2 py-1.5 rounded cursor-pointer text-sm",
              selecionadoId === item.id ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted"
            )}
          >
            <span className={!item.ativo ? "line-through text-muted-foreground" : ""}>{item.nome}</span>
            <div className="flex items-center gap-1.5 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
              <button type="button" onClick={() => onToggleActive(item)} title={item.ativo ? "Desativar" : "Ativar"}>
                {item.ativo ? <Eye className="h-3.5 w-3.5 text-muted-foreground" /> : <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />}
              </button>
              <button type="button" onClick={() => onDelete(item)} title="Excluir">
                <Trash2 className="h-3.5 w-3.5 text-destructive" />
              </button>
            </div>
          </div>
        ))}
      </div>
      {!disabledAdd && (
        <div className="flex gap-1 pt-2 border-t">
          <Input
            value={novoNome}
            onChange={(e) => setNovoNome(e.target.value)}
            placeholder="Adicionar..."
            className="h-8 text-sm"
            onKeyDown={(e) => {
              if (e.key === "Enter" && novoNome.trim()) {
                onAdd(novoNome.trim());
                setNovoNome("");
              }
            }}
          />
          <Button
            size="sm"
            className="h-8 px-2"
            onClick={() => {
              if (novoNome.trim()) {
                onAdd(novoNome.trim());
                setNovoNome("");
              }
            }}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

function AtributoCard({
  attr,
  onToggleActive,
  onDelete,
  onAddValue,
  onToggleValueActive,
  onDeleteValue,
}: {
  attr: ProductAttribute;
  onToggleActive: () => void;
  onDelete: () => void;
  onAddValue: (valor: string) => void;
  onToggleValueActive: (id: string, ativo: boolean) => void;
  onDeleteValue: (id: string) => void;
}) {
  const [novoValor, setNovoValor] = useState("");

  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className={cn("font-semibold", !attr.ativo && "line-through text-muted-foreground")}>{attr.nome}</h4>
            <p className="text-xs text-muted-foreground">
              Seleção {attr.selecao === "unica" ? "única" : "múltipla"} · {attr.valores.length} opções
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={onToggleActive} title={attr.ativo ? "Desativar" : "Ativar"}>
              {attr.ativo ? <Eye className="h-4 w-4 text-muted-foreground" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}
            </button>
            <button type="button" onClick={onDelete} title="Excluir atributo">
              <Trash2 className="h-4 w-4 text-destructive" />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {attr.valores.map((v) => (
            <span
              key={v.id}
              className={cn(
                "inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-full border",
                v.ativo ? "bg-muted" : "bg-muted/40 text-muted-foreground line-through"
              )}
            >
              {v.valor}
              <button type="button" onClick={() => onToggleValueActive(v.id, !v.ativo)}>
                {v.ativo ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
              </button>
              <button type="button" onClick={() => onDeleteValue(v.id)}>
                <Trash2 className="h-3 w-3 text-destructive" />
              </button>
            </span>
          ))}
        </div>

        <div className="flex gap-2">
          <Input
            value={novoValor}
            onChange={(e) => setNovoValor(e.target.value)}
            placeholder="Novo valor..."
            className="h-8 text-sm max-w-xs"
            onKeyDown={(e) => {
              if (e.key === "Enter" && novoValor.trim()) {
                onAddValue(novoValor.trim());
                setNovoValor("");
              }
            }}
          />
          <Button
            size="sm"
            variant="outline"
            className="h-8"
            onClick={() => {
              if (novoValor.trim()) {
                onAddValue(novoValor.trim());
                setNovoValor("");
              }
            }}
          >
            <Plus className="h-4 w-4 mr-1" /> Adicionar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminCatalogo() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [categorias, setCategorias] = useState<ProductCategory[]>([]);
  const [attributes, setAttributes] = useState<ProductAttribute[]>([]);

  const [tipoSel, setTipoSel] = useState("");
  const [catSel, setCatSel] = useState("");
  const [subSel, setSubSel] = useState("");

  const [novoAttrNome, setNovoAttrNome] = useState("");
  const [novoAttrSelecao, setNovoAttrSelecao] = useState<AttributeSelectionMode>("multipla");

  const carregarCategorias = async () => setCategorias(await fetchCategoryTree());
  const carregarAtributos = async () => setAttributes(await fetchAttributes());

  useEffect(() => {
    Promise.all([carregarCategorias(), carregarAtributos()]).then(() => setLoading(false));
  }, []);

  const tipos = categorias.filter((c) => c.nivel === 0);
  const catsNivel1 = categorias.filter((c) => c.nivel === 1 && c.parentId === tipoSel);
  const subsNivel2 = categorias.filter((c) => c.nivel === 2 && c.parentId === catSel);
  const filtrosNivel3 = categorias.filter((c) => c.nivel === 3 && c.parentId === subSel);

  const adicionarCategoria = async (parentId: string | null, nivel: CategoryLevel, nome: string) => {
    const result = await createCategory({ parentId, nivel, nome });
    if (!result.ok) {
      toast({ title: "Erro ao adicionar", description: result.error, variant: "destructive" });
      return;
    }
    carregarCategorias();
  };

  const alternarAtivoCategoria = async (item: ProductCategory) => {
    await setCategoryActive(item.id, !item.ativo);
    carregarCategorias();
  };

  const excluirCategoria = async (item: ProductCategory) => {
    if (!window.confirm(`Excluir "${item.nome}"? Isso também remove tudo que está abaixo dele na hierarquia.`)) return;
    const result = await deleteCategory(item.id);
    if (!result.ok) {
      toast({ title: "Erro ao excluir", description: result.error, variant: "destructive" });
      return;
    }
    carregarCategorias();
  };

  const adicionarAtributo = async () => {
    if (!novoAttrNome.trim()) return;
    const result = await createAttribute({ nome: novoAttrNome.trim(), selecao: novoAttrSelecao });
    if (!result.ok) {
      toast({ title: "Erro ao adicionar atributo", description: result.error, variant: "destructive" });
      return;
    }
    setNovoAttrNome("");
    carregarAtributos();
  };

  if (loading) {
    return (
      <AdminLayout title="Categorias e Atributos">
        <p className="text-muted-foreground">Carregando...</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Categorias">
      <Tabs defaultValue="categorias">
        <TabsList>
          <TabsTrigger value="categorias">Categorias</TabsTrigger>
          <TabsTrigger value="atributos">Atributos (filtros)</TabsTrigger>
        </TabsList>

        <TabsContent value="categorias" className="space-y-4 pt-4">
          <p className="text-sm text-muted-foreground">
            Clique num item para ver/editar seus filhos na coluna ao lado. O ícone de olho ativa/desativa (some da tela
            de cadastro sem apagar os produtos já usando aquela categoria).
          </p>
          <div className="grid md:grid-cols-4 gap-4">
            <CategoriaColuna
              titulo="Tipo"
              itens={tipos}
              selecionadoId={tipoSel}
              onSelect={(id) => { setTipoSel(id); setCatSel(""); setSubSel(""); }}
              onAdd={(nome) => adicionarCategoria(null, 0, nome)}
              onToggleActive={alternarAtivoCategoria}
              onDelete={excluirCategoria}
            />
            <CategoriaColuna
              titulo="Categoria"
              itens={catsNivel1}
              selecionadoId={catSel}
              onSelect={(id) => { setCatSel(id); setSubSel(""); }}
              onAdd={(nome) => adicionarCategoria(tipoSel, 1, nome)}
              onToggleActive={alternarAtivoCategoria}
              onDelete={excluirCategoria}
              disabledAdd={!tipoSel}
            />
            <CategoriaColuna
              titulo="Subcategoria"
              itens={subsNivel2}
              selecionadoId={subSel}
              onSelect={setSubSel}
              onAdd={(nome) => adicionarCategoria(catSel, 2, nome)}
              onToggleActive={alternarAtivoCategoria}
              onDelete={excluirCategoria}
              disabledAdd={!catSel}
            />
            <CategoriaColuna
              titulo="Filtro"
              itens={filtrosNivel3}
              selecionadoId=""
              onSelect={() => {}}
              onAdd={(nome) => adicionarCategoria(subSel, 3, nome)}
              onToggleActive={alternarAtivoCategoria}
              onDelete={excluirCategoria}
              disabledAdd={!subSel}
            />
          </div>
        </TabsContent>

        <TabsContent value="atributos" className="space-y-4 pt-4">
          <Card>
            <CardContent className="p-4 space-y-3">
              <h4 className="font-semibold text-sm">Novo atributo</h4>
              <div className="flex flex-wrap items-end gap-4">
                <div>
                  <Label className="font-normal text-xs">Nome</Label>
                  <Input
                    className="mt-1 h-9 w-56"
                    value={novoAttrNome}
                    onChange={(e) => setNovoAttrNome(e.target.value)}
                    placeholder="Ex: Cor, Material..."
                  />
                </div>
                <div>
                  <Label className="font-normal text-xs mb-1 block">Tipo de seleção</Label>
                  <RadioGroup
                    value={novoAttrSelecao}
                    onValueChange={(v) => setNovoAttrSelecao(v as AttributeSelectionMode)}
                    className="flex gap-4"
                  >
                    <div className="flex items-center gap-1.5">
                      <RadioGroupItem value="multipla" id="sel-multipla" />
                      <Label htmlFor="sel-multipla" className="font-normal text-sm cursor-pointer">Múltipla</Label>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <RadioGroupItem value="unica" id="sel-unica" />
                      <Label htmlFor="sel-unica" className="font-normal text-sm cursor-pointer">Única</Label>
                    </div>
                  </RadioGroup>
                </div>
                <Button onClick={adicionarAtributo} style={{ backgroundColor: "#2035F2" }} className="text-white">
                  <Plus className="h-4 w-4 mr-1" /> Criar atributo
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4">
            {attributes.map((attr) => (
              <AtributoCard
                key={attr.id}
                attr={attr}
                onToggleActive={async () => { await setAttributeActive(attr.id, !attr.ativo); carregarAtributos(); }}
                onDelete={async () => {
                  if (!window.confirm(`Excluir o atributo "${attr.nome}" e todos os seus valores?`)) return;
                  await deleteAttribute(attr.id);
                  carregarAtributos();
                }}
                onAddValue={async (valor) => {
                  const result = await createAttributeValue(attr.id, valor);
                  if (!result.ok) toast({ title: "Erro", description: result.error, variant: "destructive" });
                  carregarAtributos();
                }}
                onToggleValueActive={async (id, ativo) => { await setAttributeValueActive(id, ativo); carregarAtributos(); }}
                onDeleteValue={async (id) => { await deleteAttributeValue(id); carregarAtributos(); }}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}
