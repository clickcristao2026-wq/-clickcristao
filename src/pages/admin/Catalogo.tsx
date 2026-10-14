import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Loader2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CategoryColumn } from "@/components/products/CategoryColumn";
import { AdminAttributeCard } from "@/components/products/AdminAttributeCard";
import { attributesForCategory, categoryPath } from "@/lib/catalog";
import {
  createAttribute,
  createCategory,
  customizeCategoryAttributes,
  deleteCategory,
  fetchAttributes,
  fetchCategoryTree,
  setCategoryActive,
} from "@/lib/products";
import type {
  AttributeSelectionMode,
  CategoryLevel,
  ProductAttribute,
  ProductCategory,
} from "@/types/product";

export default function AdminCatalogo() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [attributes, setAttributes] = useState<ProductAttribute[]>([]);
  const [selection, setSelection] = useState(["", "", "", ""]);
  const [tab, setTab] = useState("categorias");
  const [attributeName, setAttributeName] = useState("");
  const [selectionMode, setSelectionMode] =
    useState<AttributeSelectionMode>("multipla");
  const refresh = async () => {
    const [cats, attrs] = await Promise.all([
      fetchCategoryTree(),
      fetchAttributes(),
    ]);
    setCategories(cats);
    setAttributes(attrs);
    return cats;
  };
  useEffect(() => {
    let active = true;
    Promise.all([fetchCategoryTree(), fetchAttributes()])
      .then(([cats, attrs]) => {
        if (active) {
          setCategories(cats);
          setAttributes(attrs);
        }
      })
      .catch((err) => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);
  const leafId = [...selection].reverse().find(Boolean) ?? "";
  const leaf = categories.find((c) => c.id === leafId);
  const path = categoryPath(categories, leafId);
  const applicable = leaf
    ? attributesForCategory(categories, attributes, leafId)
    : [];
  const editable = Boolean(leaf?.attributesConfigured);
  const select = (level: number, id: string) =>
    setSelection((prev) =>
      prev.map((old, i) => (i === level ? id : i > level ? "" : old)),
    );
  const operate = async (
    action: () => Promise<{ ok: boolean; error?: string }>,
  ) => {
    if (busy) return false;
    setBusy(true);
    try {
      const result = await action();
      if (!result.ok)
        throw new Error(result.error ?? "Não foi possível salvar.");
      await refresh();
      return true;
    } catch (err) {
      toast({
        title: "Não foi possível salvar",
        description: err instanceof Error ? err.message : "Tente novamente.",
        variant: "destructive",
      });
      return false;
    } finally {
      setBusy(false);
    }
  };
  const addCategory = async (
    parentId: string | null,
    level: CategoryLevel,
    name: string,
  ) => operate(() => createCategory({ parentId, nivel: level, nome: name }));
  const removeCategory = async (c: ProductCategory) => {
    if (!window.confirm(`Excluir "${c.nome}" e os itens abaixo dela?`)) return;
    if (await operate(() => deleteCategory(c.id)))
      setSelection((prev) => prev.map((id, i) => (i >= c.nivel ? "" : id)));
  };
  const customize = () => operate(() => customizeCategoryAttributes(leafId));
  const addAttribute = async () => {
    if (!leafId || !attributeName.trim()) return;
    const saved = await operate(async () => {
      if (!editable) {
        const setup = await customizeCategoryAttributes(leafId);
        if (!setup.ok) return setup;
      }
      return createAttribute({
        nome: attributeName.trim(),
        selecao: selectionMode,
        categoryId: leafId,
      });
    });
    if (saved) setAttributeName("");
  };
  if (loading)
    return (
      <AdminLayout title="Categorias">
        <p className="text-muted-foreground">Carregando...</p>
      </AdminLayout>
    );
  if (error)
    return (
      <AdminLayout title="Categorias">
        <p role="alert" className="text-destructive">
          {error}
        </p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Tentar novamente
        </Button>
      </AdminLayout>
    );
  return (
    <AdminLayout title="Categorias">
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="categorias">Categorias</TabsTrigger>
          <TabsTrigger value="atributos">Atributos (filtros)</TabsTrigger>
        </TabsList>
        <TabsContent value="categorias" className="space-y-4 pt-4">
          <p className="text-sm text-muted-foreground">
            Selecione Tipo, Categoria, Subcategoria e Filtro. A seleção
            permanece ativa na aba de atributos. O olho mostra ou oculta um item
            no cadastro.
          </p>
          <div className="grid gap-4 rounded-xl bg-slate-100 p-3 sm:grid-cols-2 xl:grid-cols-4">
            {["Tipo", "Categoria", "Subcategoria", "Filtro"].map(
              (title, level) => (
                <CategoryColumn
                  key={title}
                  title={title}
                  items={categories.filter(
                    (c) =>
                      c.nivel === level &&
                      (level === 0 || c.parentId === selection[level - 1]),
                  )}
                  selectedId={selection[level]}
                  onSelect={(id) => select(level, id)}
                  onAdd={(name) =>
                    addCategory(
                      level === 0 ? null : selection[level - 1],
                      level as CategoryLevel,
                      name,
                    )
                  }
                  onToggle={(c) =>
                    operate(() => setCategoryActive(c.id, !c.ativo))
                  }
                  onDelete={removeCategory}
                  disabledAdd={level > 0 && !selection[level - 1]}
                />
              ),
            )}
          </div>
        </TabsContent>
        <TabsContent
          value="atributos"
          className="space-y-4 rounded-xl bg-slate-100 p-3 sm:p-4 mt-4"
        >
          <div className="rounded-lg border bg-slate-200/60 p-4">
            <p className="text-xs font-medium text-muted-foreground">
              Classificação selecionada
            </p>
            <p className="mt-1 break-words font-semibold">
              {path.length
                ? path.map((c) => c.nome).join(" / ")
                : "Selecione uma classificação na aba Categorias."}
            </p>
          </div>
          {!leaf ? (
            <p className="p-3 text-sm text-muted-foreground">
              Selecione o produto na coluna Filtro para configurar os atributos
              que serão apresentados no cadastro.
            </p>
          ) : (
            <>
              {!editable && (
                <Card className="bg-white">
                  <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
                    <p className="text-sm text-muted-foreground max-w-xl">
                      Esta classificação usa os filtros herdados. Personalize
                      para editar somente os filtros de {leaf.nome}.
                    </p>
                    <Button type="button" disabled={busy} onClick={customize}>
                      {busy && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Personalizar filtros de {leaf.nome}
                    </Button>
                  </CardContent>
                </Card>
              )}
              <Card className="bg-white">
                <CardContent className="space-y-3 p-4">
                  <h3 className="text-sm font-semibold">
                    Novo atributo para {leaf.nome}
                  </h3>
                  <div className="flex flex-wrap items-end gap-4">
                    <div>
                      <Label
                        htmlFor="new-attribute"
                        className="text-xs font-normal"
                      >
                        Nome
                      </Label>
                      <Input
                        id="new-attribute"
                        className="mt-1 w-56"
                        maxLength={150}
                        value={attributeName}
                        onChange={(e) => setAttributeName(e.target.value)}
                        placeholder="Ex.: Cor, Material..."
                      />
                    </div>
                    <div>
                      <p className="mb-2 text-xs">Tipo de seleção</p>
                      <RadioGroup
                        aria-label="Tipo de seleção"
                        value={selectionMode}
                        onValueChange={(v) =>
                          setSelectionMode(v as AttributeSelectionMode)
                        }
                        className="flex gap-4"
                      >
                        <label className="flex items-center gap-2 text-sm">
                          <RadioGroupItem value="multipla" />
                          Múltipla
                        </label>
                        <label className="flex items-center gap-2 text-sm">
                          <RadioGroupItem value="unica" />
                          Única
                        </label>
                      </RadioGroup>
                    </div>
                    <Button
                      type="button"
                      disabled={busy || !attributeName.trim()}
                      onClick={addAttribute}
                      className="bg-[#0A20E7]"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Criar atributo
                    </Button>
                  </div>
                </CardContent>
              </Card>
              <fieldset disabled={busy} className="space-y-4">
                {applicable.map((a) => (
                  <AdminAttributeCard
                    key={a.id}
                    attribute={a}
                    editable={editable}
                    operate={operate}
                  />
                ))}
                {!applicable.length && (
                  <p className="p-3 text-sm text-muted-foreground">
                    Nenhum atributo configurado para esta classificação.
                  </p>
                )}
              </fieldset>
            </>
          )}
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}
