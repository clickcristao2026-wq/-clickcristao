import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { createProduct, fetchAttributes, fetchCategoryTree, fetchProductById, updateProduct } from "@/lib/products";
import { Product, ProductAttribute, ProductCategory, ProductImage, ProductStatus } from "@/types/product";
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
  const { id: productId } = useParams<{ id: string }>();
  const isEdicao = Boolean(productId);

  const [loading, setLoading] = useState(true);
  const [naoEncontrado, setNaoEncontrado] = useState(false);
  const [categorias, setCategorias] = useState<ProductCategory[]>([]);
  const [attributes, setAttributes] = useState<ProductAttribute[]>([]);

  const [tipoId, setTipoId] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [subcategoriaId, setSubcategoriaId] = useState("");
  const [filtroId, setFiltroId] = useState("");

  const [form, setForm] = useState(initialForm);
  const [selectedAttrValues, setSelectedAttrValues] = useState<Set<string>>(new Set());
  const [imagens, setImagens] = useState<File[]>([]);
  const [imagensExistentes, setImagensExistentes] = useState<ProductImage[]>([]);
  const [imagensRemovidas, setImagensRemovidas] = useState<ProductImage[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const carregar = async () => {
      const [cats, attrs] = await Promise.all([fetchCategoryTree(), fetchAttributes()]);
      setCategorias(cats);
      setAttributes(attrs);

      if (productId) {
        const produto = await fetchProductById(productId);
        // A RLS deixa qualquer um LER produtos publicados, mas só o dono
        // consegue salvar. Sem esta checagem, abrir o produto de outro
        // vendedor mostraria o formulário e um falso "salvo com sucesso".
        if (!produto || produto.sellerId !== user?.id) {
          setNaoEncontrado(true);
          setLoading(false);
          return;
        }
        preencherFormulario(produto, cats);
      }

      setLoading(false);
    };

    carregar();
  }, [productId, user?.id]);

  const preencherFormulario = (produto: Product, cats: ProductCategory[]) => {
    setForm({
      nome: produto.nome,
      modelo: produto.modelo ?? "",
      preco: String(produto.preco),
      precoParceladoTexto: produto.precoParceladoTexto ?? "",
      descricao: produto.descricao ?? "",
      fichaTecnica: produto.fichaTecnica ?? "",
      beneficiosTexto: produto.beneficiosTexto ?? "",
      curiosidade: produto.curiosidade ?? "",
      modoUsoCuidados: produto.modoUsoCuidados ?? "",
      garantiaSatisfacao: produto.garantiaSatisfacao ?? "",
      sku: produto.sku ?? "",
      status: produto.status,
    });
    setSelectedAttrValues(new Set(produto.atributoValorIds));
    setImagensExistentes(produto.imagens);

    // Reconstrói a cadeia Tipo → Categoria → Subcategoria → Filtro subindo pelos
    // pais a partir da categoria (folha) que ficou salva no produto.
    if (produto.categoriaId) {
      const porId = new Map(cats.map((c) => [c.id, c]));
      let atual = porId.get(produto.categoriaId);
      while (atual) {
        if (atual.nivel === 0) setTipoId(atual.id);
        else if (atual.nivel === 1) setCategoriaId(atual.id);
        else if (atual.nivel === 2) setSubcategoriaId(atual.id);
        else if (atual.nivel === 3) setFiltroId(atual.id);
        atual = atual.parentId ? porId.get(atual.parentId) : undefined;
      }
    }
  };

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

  // Fotos salvas que ainda não foram marcadas para remoção.
  const imagensVisiveis = imagensExistentes.filter(
    (img) => !imagensRemovidas.some((removida) => removida.id === img.id)
  );

  const canSubmit = Boolean(user) && form.nome.trim() !== "" && leafCategoriaId !== "" && Number(form.preco) > 0;

  const handleSubmit = async () => {
    if (!user || !canSubmit) return;
    setSubmitting(true);

    const payload = {
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
    };

    const result =
      isEdicao && productId
        ? await updateProduct(user.id, productId, payload, imagensRemovidas)
        : await createProduct(user.id, payload);

    setSubmitting(false);

    if (!result.ok) {
      toast({
        title: isEdicao ? "Erro ao salvar alterações" : "Erro ao publicar produto",
        description: result.error,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: result.error
        ? "Salvo com ressalvas"
        : isEdicao
          ? "Produto atualizado!"
          : "Produto publicado!",
      description: result.error ?? (isEdicao ? "As alterações foram salvas." : "Seu produto já está cadastrado."),
      variant: result.error ? "destructive" : undefined,
    });
    navigate("/account/produtos");
  };

  const tituloPagina = isEdicao ? "Editar Produto" : "Novo Produto";

  if (loading) {
    return (
      <AccountLayout title={tituloPagina}>
        <p className="text-muted-foreground">Carregando...</p>
      </AccountLayout>
    );
  }

  if (naoEncontrado) {
    return (
      <AccountLayout title={tituloPagina}>
        <div className="space-y-4">
          <p className="text-muted-foreground">Produto não encontrado ou você não tem acesso a ele.</p>
          <Button variant="outline" onClick={() => navigate("/account/produtos")}>
            Voltar para meus produtos
          </Button>
        </div>
      </AccountLayout>
    );
  }

  return (
    <AccountLayout title={tituloPagina}>
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

          {imagensVisiveis.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Fotos já salvas</p>
              <div className="flex flex-wrap gap-3">
                {imagensVisiveis.map((img) => (
                  <div key={img.id} className="relative w-24 h-24 rounded-lg overflow-hidden border">
                    <img src={img.url} alt="Foto do produto" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setImagensRemovidas((prev) => [...prev, img])}
                      className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5"
                      title="Remover foto"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {isEdicao && <p className="text-sm text-muted-foreground">Adicionar novas fotos</p>}
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
              <SelectItem value="publicado">{isEdicao ? "Publicado" : "Publicar agora"}</SelectItem>
              <SelectItem value="rascunho">{isEdicao ? "Rascunho" : "Salvar como rascunho"}</SelectItem>
              {isEdicao && <SelectItem value="pausado">Pausado</SelectItem>}
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
            {submitting
              ? isEdicao
                ? "Salvando..."
                : "Publicando..."
              : isEdicao
                ? "Salvar Alterações"
                : "Publicar Produto"}
          </Button>
        </div>
      </div>
    </AccountLayout>
  );
};

export default CadastroProduto;
