import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AccountLayout } from "@/components/AccountLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { createProduct, fetchAttributes, fetchCategoryTree } from "@/lib/products";
import { ProductAttribute, ProductCategory, ProductStatus } from "@/types/product";
import { X } from "lucide-react";

const initialForm = {
  nome: "",
  modelo: "",
  preco: "",
  precoParceladoTexto: "",
  descricao: "",
  fichaTecnica: "",
  beneficiosTexto: "",
  curiosidade: "",
  modoUsoCuidados: "",
  garantiaSatisfacao: "",
  sku: "",
  status: "publicado" as ProductStatus,
};

const CadastroProduto = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [categorias, setCategorias] = useState<ProductCategory[]>([]);
  const [attributes, setAttributes] = useState<ProductAttribute[]>([]);

  const [tipoId, setTipoId] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [subcategoriaId, setSubcategoriaId] = useState("");
  const [filtroId, setFiltroId] = useState("");

  const [form, setForm] = useState(initialForm);
  const [selectedAttrValues, setSelectedAttrValues] = useState<Set<string>>(new Set());
  const [imagens, setImagens] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([fetchCategoryTree(), fetchAttributes()]).then(([cats, attrs]) => {
      setCategorias(cats);
      setAttributes(attrs);
      setLoading(false);
    });
  }, []);

  const tipos = useMemo(() => categorias.filter((c) => c.nivel === 0), [categorias]);
  const categoriasNivel1 = useMemo(
    () => categorias.filter((c) => c.nivel === 1 && c.parentId === tipoId),
    [categorias, tipoId]
  );
  const subcategoriasNivel2 = useMemo(
    () => categorias.filter((c) => c.nivel === 2 && c.parentId === categoriaId),
    [categorias, categoriaId]
  );
  const filtrosNivel3 = useMemo(
    () => categorias.filter((c) => c.nivel === 3 && c.parentId === subcategoriaId),
    [categorias, subcategoriaId]
  );

  const leafCategoriaId = filtroId || subcategoriaId || categoriaId || tipoId;

  const update = (field: keyof typeof initialForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleAttrValue = (attr: ProductAttribute, valueId: string) => {
    setSelectedAttrValues((prev) => {
      const next = new Set(prev);
      if (attr.selecao === "unica") {
        attr.valores.forEach((v) => next.delete(v.id));
        next.add(valueId);
      } else if (next.has(valueId)) {
        next.delete(valueId);
      } else {
        next.add(valueId);
      }
      return next;
    });
  };

  const selectedSingleValue = (attr: ProductAttribute) =>
    attr.valores.find((v) => selectedAttrValues.has(v.id))?.id ?? "";

  const canSubmit = Boolean(user) && form.nome.trim() !== "" && leafCategoriaId !== "" && Number(form.preco) > 0;

  const handleSubmit = async () => {
    if (!user || !canSubmit) return;
    setSubmitting(true);

    const result = await createProduct(user.id, {
      categoriaId: leafCategoriaId,
      nome: form.nome,
      modelo: form.modelo,
      preco: Number(form.preco.replace(",", ".")) || 0,
      precoParceladoTexto: form.precoParceladoTexto,
      descricao: form.descricao,
      fichaTecnica: form.fichaTecnica,
      beneficiosTexto: form.beneficiosTexto,
      curiosidade: form.curiosidade,
      modoUsoCuidados: form.modoUsoCuidados,
      garantiaSatisfacao: form.garantiaSatisfacao,
      sku: form.sku,
      status: form.status,
      atributoValorIds: Array.from(selectedAttrValues),
      imagens,
    });

    setSubmitting(false);

    if (!result.ok) {
      toast({ title: "Erro ao publicar produto", description: result.error, variant: "destructive" });
      return;
    }

    toast({
      title: result.error ? "Produto criado com ressalvas" : "Produto publicado!",
      description: result.error ?? "Seu produto já está cadastrado.",
      variant: result.error ? "destructive" : undefined,
    });
    navigate("/account/produtos");
  };

  if (loading) {
    return (
      <AccountLayout title="Novo Produto">
        <p className="text-muted-foreground">Carregando categorias e atributos...</p>
      </AccountLayout>
    );
  }

  return (
    <AccountLayout title="Novo Produto">
      <div className="max-w-4xl space-y-10">
        {/* FLUXO: Tipo / Categoria / Subcategoria / Filtro */}
        <section className="space-y-4">
          <h3 className="text-lg font-bold text-foreground border-b pb-2">CLASSIFICAÇÃO DO PRODUTO</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label className="font-normal">Tipo *</Label>
              <Select value={tipoId} onValueChange={(v) => { setTipoId(v); setCategoriaId(""); setSubcategoriaId(""); setFiltroId(""); }}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Selecione o tipo" /></SelectTrigger>
                <SelectContent>
                  {tipos.map((t) => <SelectItem key={t.id} value={t.id}>{t.nome}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="font-normal">Categoria *</Label>
              <Select
                value={categoriaId}
                onValueChange={(v) => { setCategoriaId(v); setSubcategoriaId(""); setFiltroId(""); }}
                disabled={!tipoId || categoriasNivel1.length === 0}
              >
                <SelectTrigger className="mt-1"><SelectValue placeholder="Selecione a categoria" /></SelectTrigger>
                <SelectContent>
                  {categoriasNivel1.map((c) => <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="font-normal">Subcategoria</Label>
              <Select
                value={subcategoriaId}
                onValueChange={(v) => { setSubcategoriaId(v); setFiltroId(""); }}
                disabled={!categoriaId || subcategoriasNivel2.length === 0}
              >
                <SelectTrigger className="mt-1"><SelectValue placeholder="Selecione a subcategoria" /></SelectTrigger>
                <SelectContent>
                  {subcategoriasNivel2.map((c) => <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            {filtrosNivel3.length > 0 && (
              <div>
                <Label className="font-normal">Filtro</Label>
                <Select value={filtroId} onValueChange={setFiltroId}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Selecione o filtro" /></SelectTrigger>
                  <SelectContent>
                    {filtrosNivel3.map((c) => <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </section>

        <Separator />

        {/* PUBLICAÇÃO DO PRODUTO */}
        <section className="space-y-4">
          <h3 className="text-lg font-bold text-foreground border-b pb-2">PUBLICAÇÃO DO PRODUTO</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label className="font-normal">Nome do produto *</Label>
              <Input className="mt-1" value={form.nome} onChange={(e) => update("nome", e.target.value)} placeholder="Ex: Blusa Cropped Manga Longa" />
            </div>
            <div>
              <Label className="font-normal">Modelo do produto</Label>
              <Input className="mt-1" value={form.modelo} onChange={(e) => update("modelo", e.target.value)} />
            </div>
            <div>
              <Label className="font-normal">Preço do produto (R$) *</Label>
              <Input className="mt-1" type="number" min="0" step="0.01" value={form.preco} onChange={(e) => update("preco", e.target.value)} placeholder="0,00" />
            </div>
            <div className="md:col-span-2">
              <Label className="font-normal">Observação sobre parcelamento</Label>
              <Input className="mt-1" value={form.precoParceladoTexto} onChange={(e) => update("precoParceladoTexto", e.target.value)} placeholder="Ex: em até 10x de R$ 9,90 sem juros" />
            </div>
          </div>
        </section>

        <Separator />

        {/* CARACTERÍSTICAS DO PRODUTO */}
        <section className="space-y-4">
          <h3 className="text-lg font-bold text-foreground border-b pb-2">CARACTERÍSTICAS DO PRODUTO</h3>
          <div className="grid gap-4">
            <div>
              <Label className="font-normal">Descrição do produto</Label>
              <Textarea className="mt-1" value={form.descricao} onChange={(e) => update("descricao", e.target.value)} placeholder="Descreva o produto..." />
            </div>
            <div>
              <Label className="font-normal">Ficha técnica</Label>
              <Textarea className="mt-1" value={form.fichaTecnica} onChange={(e) => update("fichaTecnica", e.target.value)} />
            </div>
            <div>
              <Label className="font-normal">Benefícios do produto</Label>
              <Textarea className="mt-1" value={form.beneficiosTexto} onChange={(e) => update("beneficiosTexto", e.target.value)} />
            </div>
            <div>
              <Label className="font-normal">Curiosidade do produto</Label>
              <Textarea className="mt-1" value={form.curiosidade} onChange={(e) => update("curiosidade", e.target.value)} />
            </div>
            <div>
              <Label className="font-normal">Modo de uso e cuidados</Label>
              <Textarea className="mt-1" value={form.modoUsoCuidados} onChange={(e) => update("modoUsoCuidados", e.target.value)} />
            </div>
            <div>
              <Label className="font-normal">Garantia e satisfação</Label>
              <Textarea className="mt-1" value={form.garantiaSatisfacao} onChange={(e) => update("garantiaSatisfacao", e.target.value)} />
            </div>
          </div>
        </section>

        <Separator />

        {/* GESTÃO DE ESTOQUE */}
        <section className="space-y-4">
          <h3 className="text-lg font-bold text-foreground border-b pb-2">GESTÃO DE ESTOQUE</h3>
          <div>
            <Label className="font-normal">Código de referência do produto (SKU)</Label>
            <Input className="mt-1 max-w-xs" value={form.sku} onChange={(e) => update("sku", e.target.value)} />
          </div>
        </section>

        <Separator />

        {/* ATRIBUTOS DINÂMICOS (Seção, Cor, Tamanho, Marca, Material, Modelagem, Benefícios, Localização, Internacional) */}
        {attributes.map((attr) => (
          <section key={attr.id} className="space-y-3">
            <h3 className="text-lg font-bold text-foreground border-b pb-2 uppercase">{attr.nome}</h3>
            {attr.valores.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhuma opção cadastrada ainda.</p>
            ) : attr.selecao === "unica" ? (
              <Select value={selectedSingleValue(attr)} onValueChange={(v) => toggleAttrValue(attr, v)}>
                <SelectTrigger className="max-w-xs"><SelectValue placeholder={`Selecione ${attr.nome.toLowerCase()}`} /></SelectTrigger>
                <SelectContent>
                  {attr.valores.map((v) => <SelectItem key={v.id} value={v.id}>{v.valor}</SelectItem>)}
                </SelectContent>
              </Select>
            ) : (
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {attr.valores.map((v) => (
                  <div key={v.id} className="flex items-center gap-2">
                    <Checkbox
                      id={`attr-${v.id}`}
                      checked={selectedAttrValues.has(v.id)}
                      onCheckedChange={() => toggleAttrValue(attr, v.id)}
                    />
                    <Label htmlFor={`attr-${v.id}`} className="font-normal cursor-pointer">{v.valor}</Label>
                  </div>
                ))}
              </div>
            )}
          </section>
        ))}

        <Separator />

        {/* IMAGENS */}
        <section className="space-y-3">
          <h3 className="text-lg font-bold text-foreground border-b pb-2">FOTOS DO PRODUTO</h3>
          <Input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setImagens(Array.from(e.target.files ?? []))}
          />
          {imagens.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-2">
              {imagens.map((file, idx) => (
                <div key={idx} className="relative w-24 h-24 rounded-lg overflow-hidden border">
                  <img src={URL.createObjectURL(file)} alt={file.name} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setImagens((prev) => prev.filter((_, i) => i !== idx))}
                    className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <Separator />

        {/* STATUS */}
        <section className="space-y-3">
          <h3 className="text-lg font-bold text-foreground border-b pb-2">STATUS DA PUBLICAÇÃO</h3>
          <Select value={form.status} onValueChange={(v) => update("status", v)}>
            <SelectTrigger className="max-w-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="publicado">Publicar agora</SelectItem>
              <SelectItem value="rascunho">Salvar como rascunho</SelectItem>
            </SelectContent>
          </Select>
        </section>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={() => navigate("/account/produtos")}>Cancelar</Button>
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit || submitting}
            className="text-white px-8"
            style={{ backgroundColor: "#2035F2" }}
          >
            {submitting ? "Publicando..." : "Publicar Produto"}
          </Button>
        </div>
      </div>
    </AccountLayout>
  );
};

export default CadastroProduto;
