import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { AccountLayout } from "@/components/AccountLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import {
  createProduct,
  fetchAttributes,
  fetchCategoryTree,
  fetchProductById,
  updateProduct,
  slugify,
} from "@/lib/products";
import type {
  ProductAttribute,
  ProductCategory,
  ProductImage,
  ProductStatus,
  MediaRole,
  ProductMediaUpload,
  ProductDetails,
} from "@/types/product";
import {
  calculatePricing,
  validatePricing,
  type ProductPricing,
} from "@/lib/pricing";
import {
  defaultDetails,
  mediaLimits,
  validateEvaluation,
  validateMediaCount,
  validateMediaFile,
} from "@/lib/product-form";
import { attachDraftHistory, prepareAnalysisImages } from "@/lib/ai";
import { AnalysisPanel } from "@/components/ai/AnalysisPanel";
import {
  ProductSection,
  TextField,
  StarRating,
} from "@/components/products/FormFields";
import { MediaGroup } from "@/components/products/MediaGroup";
import { PriceStep } from "@/components/products/PriceStep";

const initialForm = {
  nome: "",
  modelo: "",
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
const steps = ["Informação", "Preço", "Imagem"];
const sections = [
  {
    value: "premium",
    title: "Premium",
    description:
      "Produto de luxo, com excelente qualidade e durabilidade, marca de credibilidade e acabamento refinado. O preço deve representar a qualidade e o valor do produto.",
  },
  {
    value: "intermediario",
    title: "Intermediário",
    description:
      "Bom produto, que atende aos padrões e às necessidades dos consumidores. Possui qualidade confiável, segurança, bom acabamento e valor compatível para comercialização.",
  },
  {
    value: "popular",
    title: "Popular",
    description:
      "Produto acessível para consumidores com menor exigência de qualidade e durabilidade. Considere o acabamento, a estética de fabricação e a durabilidade limitada.",
  },
] as const;

const CadastroProduto = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id: productId } = useParams<{ id: string }>();
  const [draftId] = useState(() => crypto.randomUUID());
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [categorias, setCategorias] = useState<ProductCategory[]>([]);
  const [attributes, setAttributes] = useState<ProductAttribute[]>([]);
  const [categoryIds, setCategoryIds] = useState(["", "", "", ""]);
  const [form, setForm] = useState(initialForm);
  const [details, setDetails] = useState<ProductDetails>(defaultDetails);
  const [selectedValues, setSelectedValues] = useState<Set<string>>(new Set());
  const [uploads, setUploads] = useState<ProductMediaUpload[]>([]);
  const [existing, setExisting] = useState<ProductImage[]>([]);
  const [removed, setRemoved] = useState<ProductImage[]>([]);
  const [submitting, setSubmitting] = useState(false);
  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      setLoadError("");
      setNotFound(false);
      setStep(0);
      setForm(initialForm);
      setDetails(defaultDetails());
      setCategoryIds(["", "", "", ""]);
      setSelectedValues(new Set());
      setExisting([]);
      setRemoved([]);
      setUploads([]);
      try {
        const [cats, attrs] = await Promise.all([
          fetchCategoryTree(),
          fetchAttributes(),
        ]);
        if (!active) return;
        setCategorias(cats);
        setAttributes(attrs);
        if (productId) {
          const product = await fetchProductById(productId);
          if (!active) return;
          if (!product || product.sellerId !== user?.id) {
            setNotFound(true);
            return;
          }
          const newForm = { ...initialForm };
          for (const key of Object.keys(initialForm) as Array<
            keyof typeof initialForm
          >) {
            (newForm as Record<string, string>)[key] =
              product[key] ?? initialForm[key];
          }
          setForm(newForm);
          setDetails(product.detalhes);
          setSelectedValues(new Set(product.atributoValorIds));
          setExisting(product.midias);
          setRemoved([]);
          setUploads([]);
          const ids = ["", "", "", ""];
          const map = new Map(cats.map((c) => [c.id, c]));
          let category = map.get(product.categoriaId ?? "");
          while (category) {
            ids[category.nivel] = category.id;
            category = map.get(category.parentId ?? "");
          }
          setCategoryIds(ids);
          const section = attrs.find((a) => a.slug === "secao");
          const value = section?.valores.find((v) =>
            product.atributoValorIds.includes(v.id),
          );
          if (!product.detalhes.secao && value)
            setDetails((prev) => ({
              ...prev,
              secao: slugify(value.valor) as ProductDetails["secao"],
            }));
        }
      } catch {
        if (active)
          setLoadError(
            "Não foi possível carregar os dados do produto. Tente novamente.",
          );
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [productId, user?.id]);
  const leafId = [...categoryIds].reverse().find(Boolean) ?? "";
  const pricing = details.precificacao;
  const summary = calculatePricing(pricing);
  const visibleMedia = existing.filter(
    (image) => !removed.some((item) => item.id === image.id),
  );
  const update = (field: keyof typeof initialForm, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));
  const updateDetail = <K extends keyof ProductDetails>(
    field: K,
    value: ProductDetails[K],
  ) => setDetails((prev) => ({ ...prev, [field]: value }));
  const updatePrice = <K extends keyof ProductPricing>(
    field: K,
    value: ProductPricing[K],
  ) =>
    setDetails((prev) => ({
      ...prev,
      precificacao: { ...prev.precificacao, [field]: value },
    }));
  const updateEval = <K extends keyof ProductDetails["avaliacao"]>(
    field: K,
    value: ProductDetails["avaliacao"][K],
  ) =>
    setDetails((prev) => ({
      ...prev,
      avaliacao: { ...prev.avaliacao, [field]: value },
    }));
  const toggleValue = (attr: ProductAttribute, id: string) =>
    setSelectedValues((prev) => {
      const next = new Set(prev);
      if (attr.selecao === "unica") {
        attr.valores.forEach((v) => next.delete(v.id));
        next.add(id);
      } else if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  const setSection = (value: ProductDetails["secao"]) => {
    updateDetail("secao", value);
    const attr = attributes.find((a) => a.slug === "secao");
    const option = attr?.valores.find((v) => slugify(v.valor) === value);
    if (attr && option) toggleValue(attr, option.id);
  };
  const renderAttributes = (benefits: boolean) =>
    attributes
      .filter(
        (a) =>
          a.slug !== "secao" &&
          (a.slug === "beneficios") === benefits &&
          (a.ativo || a.valores.some((v) => selectedValues.has(v.id))),
      )
      .map((attr) => {
        const values = attr.valores.filter(
          (v) => v.ativo || selectedValues.has(v.id),
        );
        return (
          <div key={attr.id} className="space-y-2">
            <Label className="font-medium">{attr.nome}</Label>
            {!values.length ? (
              <p className="text-sm text-muted-foreground">
                Nenhuma opção cadastrada.
              </p>
            ) : attr.selecao === "unica" ? (
              <Select
                value={values.find((v) => selectedValues.has(v.id))?.id ?? ""}
                onValueChange={(v) => toggleValue(attr, v)}
              >
                <SelectTrigger aria-label={attr.nome}>
                  <SelectValue
                    placeholder={`Selecione ${attr.nome.toLowerCase()}`}
                  />
                </SelectTrigger>
                <SelectContent>
                  {values.map((v) => (
                    <SelectItem key={v.id} value={v.id}>
                      {v.valor}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {values.map((v) => (
                  <label
                    key={v.id}
                    className="flex gap-2 items-center text-sm cursor-pointer"
                  >
                    <Checkbox
                      checked={selectedValues.has(v.id)}
                      onCheckedChange={() => toggleValue(attr, v.id)}
                    />
                    {v.valor}
                  </label>
                ))}
              </div>
            )}
          </div>
        );
      });
  const infoError = () =>
    !form.nome.trim()
      ? "Informe o nome do produto."
      : !categoryIds[0] || !categoryIds[1]
        ? "Selecione o tipo e a categoria do produto."
        : validateEvaluation(details);
  const showError = (message: string) =>
    toast({
      title: "Confira os campos",
      description: message,
      variant: "destructive",
    });
  const goStep = (target: number) => {
    if (submitting) return;
    if (target > step) {
      const message =
        infoError() || (target > 1 ? validatePricing(pricing) : null);
      if (message) {
        showError(message);
        return;
      }
    }
    setStep(target);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const addMedia = (role: MediaRole, files: File[]) => {
    const count =
      visibleMedia.filter((m) => m.papel === role).length +
      uploads.filter((m) => m.papel === role).length;
    if (files.length + count > mediaLimits[role]) {
      showError(
        `Selecione no máximo ${mediaLimits[role]} arquivo(s) neste grupo.`,
      );
      return;
    }
    for (const file of files) {
      const error = validateMediaFile(file, role);
      if (error) {
        showError(error);
        return;
      }
    }
    setUploads((prev) => [
      ...prev,
      ...files.map((file) => ({ file, papel: role })),
    ]);
  };
  const getSnapshot = () => {
    const error = infoError() || validatePricing(pricing);
    if (error) throw new Error(error);
    return {
      ...form,
      conteudoAnuncio: details.conteudoAnuncio,
      nomeLoja: details.nomeLoja,
      qualidade: details.qualidade,
      secao: details.secao,
      avaliacaoAutodeclarada: details.avaliacao,
      precificacao: pricing,
      classificacao: categoryIds
        .map((id) => categorias.find((c) => c.id === id)?.nome)
        .filter(Boolean),
      filtros: attributes
        .map((a) => ({
          nome: a.nome,
          valores: a.valores
            .filter((v) => selectedValues.has(v.id))
            .map((v) => v.valor),
        }))
        .filter((a) => a.valores.length),
      midias: [
        ...visibleMedia.map((m) => ({ papel: m.papel, salvo: true })),
        ...uploads.map((m) => ({
          papel: m.papel,
          nome: m.file.name,
          tamanho: m.file.size,
          tipo: m.file.type,
        })),
      ],
    };
  };
  const submit = async () => {
    if (!user || submitting) return;
    const error =
      infoError() ||
      validatePricing(pricing) ||
      validateMediaCount(visibleMedia, uploads, form.status === "publicado");
    if (error) {
      showError(error);
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        nome: form.nome.trim(),
        categoriaId: leafId,
        preco: summary.preco,
        detalhes: details,
        atributoValorIds: Array.from(selectedValues),
        imagens: uploads,
      };
      const result = productId
        ? await updateProduct(user.id, productId, payload, removed)
        : await createProduct(user.id, payload);
      if (!result.ok) {
        toast({
          title: "Erro ao salvar registro",
          description: result.error,
          variant: "destructive",
        });
        return;
      }
      let warning = result.error;
      if (!productId && "productId" in result && result.productId) {
        try {
          await attachDraftHistory(draftId, result.productId as string);
        } catch (err) {
          warning = [
            warning,
            err instanceof Error ? err.message : "Histórico não vinculado.",
          ]
            .filter(Boolean)
            .join(" ");
        }
      }
      toast({
        title: warning ? "Registro salvo com ressalvas" : "Registro salvo!",
        description:
          warning ??
          (form.status === "publicado"
            ? "Seu produto foi publicado."
            : "As informações foram salvas."),
        variant: warning ? "destructive" : undefined,
      });
      navigate("/account/produtos");
    } catch {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar o registro. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };
  const title = productId ? "Editar Produto" : "Novo Produto";
  if (loading)
    return (
      <AccountLayout title={title}>
        <p className="text-muted-foreground">Carregando...</p>
      </AccountLayout>
    );
  if (loadError || notFound)
    return (
      <AccountLayout title={title}>
        <p role="alert" className="text-muted-foreground mb-4">
          {loadError || "Produto não encontrado ou você não tem acesso a ele."}
        </p>
        <Button variant="outline" onClick={() => navigate("/account/produtos")}>
          Voltar para meus produtos
        </Button>
      </AccountLayout>
    );
  if (!user || !["vendedor", "anunciante"].includes(user.role))
    return (
      <AccountLayout title={title}>
        <p>
          O cadastro de produtos está disponível para vendedores e anunciantes.
        </p>
      </AccountLayout>
    );
  return (
    <AccountLayout title={title}>
      <div className="max-w-4xl space-y-8">
        <nav
          aria-label="Etapas do cadastro"
          className="rounded-xl border bg-card p-5"
        >
          <ol className="grid grid-cols-3 gap-2">
            {steps.map((label, i) => (
              <li key={label}>
                <button
                  type="button"
                  disabled={submitting}
                  aria-current={step === i ? "step" : undefined}
                  onClick={() => goStep(i)}
                  className={`flex w-full flex-col sm:flex-row items-center justify-center gap-2 rounded-lg p-2 text-sm ${step === i ? "font-semibold text-[#0A20E7] bg-blue-50" : "text-muted-foreground"}`}
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${i <= step ? "bg-[#0A20E7] text-white" : "bg-muted"}`}
                  >
                    {i < step ? <Check className="h-4 w-4" /> : i + 1}
                  </span>
                  {label}
                </button>
              </li>
            ))}
          </ol>
          <div
            role="progressbar"
            aria-label="Progresso do cadastro"
            aria-valuenow={step + 1}
            aria-valuemin={0}
            aria-valuemax={3}
            className="mt-4 h-2 overflow-hidden rounded-full bg-muted"
          >
            <div
              className="h-full bg-[#0A20E7] transition-all"
              style={{ width: `${((step + 1) / 3) * 100}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Etapa {step + 1} de 3 · {steps[step]}
          </p>
        </nav>
        <fieldset disabled={submitting} className="space-y-8 min-w-0">
          {step === 0 && (
            <>
              <ProductSection title="CLASSIFICAÇÃO DO PRODUTO">
                <div className="grid sm:grid-cols-2 gap-4">
                  {["Tipo *", "Categoria *", "Subcategoria", "Filtro"].map(
                    (label, level) => {
                      const options = categorias.filter(
                        (c) =>
                          c.nivel === level &&
                          (level === 0 ||
                            c.parentId === categoryIds[level - 1]) &&
                          (c.ativo || c.id === categoryIds[level]),
                      );
                      return (
                        <div key={label}>
                          <Label className="font-normal">{label}</Label>
                          <Select
                            value={categoryIds[level]}
                            onValueChange={(value) =>
                              setCategoryIds((prev) =>
                                prev.map((id, i) =>
                                  i === level ? value : i > level ? "" : id,
                                ),
                              )
                            }
                            disabled={
                              (level > 0 && !categoryIds[level - 1]) ||
                              !options.length
                            }
                          >
                            <SelectTrigger aria-label={label} className="mt-1">
                              <SelectValue
                                placeholder={`Selecione ${label.replace(" *", "").toLowerCase()}`}
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {options.map((c) => (
                                <SelectItem key={c.id} value={c.id}>
                                  {c.nome}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      );
                    },
                  )}
                </div>
                {!categorias.length && (
                  <p className="text-sm text-amber-700">
                    Nenhuma categoria disponível. Solicite o cadastro das
                    categorias ao administrador.
                  </p>
                )}
              </ProductSection>
              <ProductSection title="PUBLICAÇÃO DO PRODUTO">
                <TextField
                  label="Nome do Produto *"
                  value={form.nome}
                  onChange={(v) => update("nome", v)}
                  placeholder="Ex.: Jaqueta de Couro"
                />
                <TextField
                  label="Modelo do Produto"
                  value={form.modelo}
                  onChange={(v) => update("modelo", v)}
                />
                <TextField
                  label="Conteúdo do Anunciado"
                  value={details.conteudoAnuncio}
                  onChange={(v) => updateDetail("conteudoAnuncio", v)}
                  multiline
                  rows={6}
                  placeholder="Vista atitude, elegância e personalidade em uma peça que nunca sai de moda. Sua próxima jaqueta favorita está aqui."
                />
                <TextField
                  label="Minha Loja Meu Produto"
                  value={details.nomeLoja}
                  onChange={(v) => updateDetail("nomeLoja", v)}
                  placeholder="Nome da sua loja cadastrada no Click Cristão"
                />
                <p className="text-xs text-muted-foreground">
                  Informe o nome da loja que deseja destacar no anúncio.
                </p>
              </ProductSection>
              <ProductSection title="CARACTERÍSTICAS DO PRODUTO">
                <TextField
                  label="Descrição do Produto"
                  value={form.descricao}
                  onChange={(v) => update("descricao", v)}
                  multiline
                  placeholder="Produto versátil para o dia a dia."
                />
                <TextField
                  label="Ficha técnica"
                  value={form.fichaTecnica}
                  onChange={(v) => update("fichaTecnica", v)}
                  multiline
                  rows={4}
                  placeholder={
                    "Material Externo — 100% Couro Natural\nMaterial do Forro — 100% Poliéster em veludo\nFechamento — Zíper Frontal"
                  }
                />
                <TextField
                  label="Qualidade do produto"
                  value={details.qualidade}
                  onChange={(v) => updateDetail("qualidade", v)}
                  multiline
                  placeholder="Fabricado com confecção de couro legítimo."
                />
                <TextField
                  label="Benefício do produto"
                  value={form.beneficiosTexto}
                  onChange={(v) => update("beneficiosTexto", v)}
                  multiline
                  placeholder="Proteção contra o frio, modelagem perfeita no corpo."
                />
                <TextField
                  label="Uso e Cuidado"
                  value={form.modoUsoCuidados}
                  onChange={(v) => update("modoUsoCuidados", v)}
                  multiline
                  placeholder="Após o uso, deixar um período para arejar, permitindo que o tecido respire."
                />
                <TextField
                  label="Curiosidade do produto"
                  value={form.curiosidade}
                  onChange={(v) => update("curiosidade", v)}
                  multiline
                />
                <TextField
                  label="Garantia e satisfação"
                  value={form.garantiaSatisfacao}
                  onChange={(v) => update("garantiaSatisfacao", v)}
                  multiline
                />
              </ProductSection>
              <ProductSection title="GESTÃO DE ESTOQUE">
                <TextField
                  label="Código de referência do produto (SKU)"
                  value={form.sku}
                  onChange={(v) => update("sku", v)}
                />
              </ProductSection>
              <ProductSection title="SEÇÃO DO PRODUTO">
                <RadioGroup
                  aria-label="Seção do produto"
                  value={details.secao}
                  onValueChange={(v) =>
                    setSection(v as ProductDetails["secao"])
                  }
                  className="space-y-3"
                >
                  {sections.map((section) => (
                    <label
                      key={section.value}
                      className="flex gap-3 cursor-pointer rounded-lg border p-4 has-[[data-state=checked]]:border-blue-600 has-[[data-state=checked]]:bg-blue-50/50"
                    >
                      <RadioGroupItem
                        value={section.value}
                        className="mt-1 shrink-0"
                      />
                      <span>
                        <strong className="block mb-1">{section.title}</strong>
                        <span className="text-sm text-muted-foreground">
                          {section.description}
                        </span>
                      </span>
                    </label>
                  ))}
                </RadioGroup>
              </ProductSection>
              <ProductSection title="DADOS DE AVALIAÇÃO">
                <p className="text-sm text-muted-foreground">
                  Preencha estas informações para demonstrar a reputação do
                  produto e sua atuação como vendedor. Isso aumenta a confiança
                  dos compradores e melhora a conversão das vendas.
                </p>
                <div className="space-y-2">
                  <p className="font-medium">
                    Você vende seu produto em alguma plataforma da internet?
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Informe se já vende em marketplaces, lojas virtuais,
                    plataformas sociais ou sites próprios.
                  </p>
                  <RadioGroup
                    aria-label="Vende em outras plataformas"
                    value={
                      details.avaliacao.vendeOnline === null
                        ? ""
                        : details.avaliacao.vendeOnline
                          ? "sim"
                          : "nao"
                    }
                    onValueChange={(v) =>
                      updateEval("vendeOnline", v === "sim")
                    }
                    className="flex gap-6"
                  >
                    <label className="flex gap-2 items-center">
                      <RadioGroupItem value="sim" />
                      Sim
                    </label>
                    <label className="flex gap-2 items-center">
                      <RadioGroupItem value="nao" />
                      Não
                    </label>
                  </RadioGroup>
                </div>
                <StarRating
                  label="Qual a avaliação do produto?"
                  value={details.avaliacao.produtoEstrelas}
                  onChange={(v) => updateEval("produtoEstrelas", v)}
                />
                <p className="text-xs text-muted-foreground">
                  Informe a avaliação que seu produto recebe nas outras
                  plataformas.
                </p>
                <StarRating
                  label="Qual a avaliação do atendimento?"
                  value={details.avaliacao.atendimentoEstrelas}
                  onChange={(v) => updateEval("atendimentoEstrelas", v)}
                />
                <p className="text-xs text-muted-foreground">
                  Considere comunicação, suporte e tempo de resposta.
                </p>
                <div>
                  <Label htmlFor="monthly-sales">
                    Qual sua média mensal de vendas por mês?
                  </Label>
                  <Input
                    id="monthly-sales"
                    type="number"
                    min="0"
                    step="1"
                    className="mt-1"
                    value={details.avaliacao.vendasMensais ?? ""}
                    onChange={(e) =>
                      updateEval(
                        "vendasMensais",
                        e.target.value === "" ? null : Number(e.target.value),
                      )
                    }
                    placeholder="Volume médio de unidades vendidas mensalmente"
                  />
                </div>
                <div className="space-y-2">
                  <p className="font-medium">
                    Forneça o(s) link(s) para comprovação desses dados.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Insira URLs para suas avaliações, reputação, páginas do
                    produto ou histórico de vendas.
                  </p>
                  {details.avaliacao.links.map((link, i) => (
                    <div key={i}>
                      <Label htmlFor={`proof-${i}`} className="sr-only">
                        Link de comprovação {i + 1}
                      </Label>
                      <Input
                        id={`proof-${i}`}
                        type="url"
                        value={link}
                        maxLength={1000}
                        onChange={(e) =>
                          updateEval(
                            "links",
                            details.avaliacao.links.map((v, index) =>
                              index === i ? e.target.value : v,
                            ),
                          )
                        }
                        placeholder={`https:// · Link ${i + 1}`}
                      />
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  As avaliações são informadas pelo vendedor. Os links permitem
                  consultar a comprovação.
                </p>
              </ProductSection>
              <ProductSection title="FILTROS DO PRODUTO">
                <div className="grid sm:grid-cols-2 gap-5">
                  {renderAttributes(false)}
                </div>
              </ProductSection>
            </>
          )}
          {step === 1 && (
            <PriceStep
              pricing={pricing}
              updatePrice={updatePrice}
              installment={form.precoParceladoTexto}
              onInstallment={(v) => update("precoParceladoTexto", v)}
              productId={productId}
              draftId={draftId}
              getSnapshot={getSnapshot}
              benefits={renderAttributes(true)}
            />
          )}
          {step === 2 && (
            <>
              {(["destaque", "galeria", "corpo", "video"] as MediaRole[]).map(
                (role) => (
                  <MediaGroup
                    key={role}
                    role={role}
                    existing={visibleMedia.filter((m) => m.papel === role)}
                    uploads={uploads.filter((m) => m.papel === role)}
                    onAdd={addMedia}
                    onRemoveExisting={(image) =>
                      setRemoved((prev) => [...prev, image])
                    }
                    onRemoveUpload={(upload) =>
                      setUploads((prev) =>
                        prev.filter((item) => item !== upload),
                      )
                    }
                  />
                ),
              )}
              <AnalysisPanel
                kind="conteudo"
                productId={productId}
                draftId={draftId}
                getSnapshot={getSnapshot}
                getImages={() => prepareAnalysisImages(visibleMedia, uploads)}
              />
              <ProductSection title="STATUS DA PUBLICAÇÃO">
                <Select
                  value={form.status}
                  onValueChange={(v) => update("status", v)}
                >
                  <SelectTrigger aria-label="Status da publicação">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="publicado">Publicar agora</SelectItem>
                    <SelectItem value="rascunho">
                      Salvar como rascunho
                    </SelectItem>
                    {productId && (
                      <SelectItem value="pausado">Pausado</SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  A publicação requer as 7 imagens e o vídeo. Salve como
                  rascunho para completar as mídias depois.
                </p>
              </ProductSection>
            </>
          )}
        </fieldset>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-6">
          <Button
            type="button"
            variant="outline"
            disabled={submitting}
            onClick={() =>
              step > 0 ? goStep(step - 1) : navigate("/account/produtos")
            }
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {step > 0 ? "ETAPA ANTERIOR" : "Cancelar"}
          </Button>
          {step < 2 ? (
            <Button
              type="button"
              onClick={() => goStep(step + 1)}
              className="bg-[#0A20E7] hover:bg-[#091bc4]"
            >
              PRÓXIMA ETAPA
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              type="button"
              disabled={submitting}
              onClick={submit}
              className="bg-[#0A20E7] hover:bg-[#091bc4]"
            >
              {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {submitting ? "SALVANDO..." : "SALVAR REGISTRO"}
            </Button>
          )}
        </div>
      </div>
    </AccountLayout>
  );
};
export default CadastroProduto;
