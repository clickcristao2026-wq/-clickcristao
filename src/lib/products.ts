import { supabase } from "@/lib/supabaseClient";
import {
  AttributeSelectionMode,
  CategoryLevel,
  Product,
  ProductAttribute,
  ProductCategory,
  ProductFormPayload,
  ProductImage,
  ProductStatus,
  ProductDetails,
  ProductMediaUpload,
  MediaRole,
} from "@/types/product";
import { normalizeDetails } from "@/lib/product-form";

interface OpResult {
  ok: boolean;
  error?: string;
}

const DIACRITICS_REGEX = /\p{Diacritic}/gu;

export function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(DIACRITICS_REGEX, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Formatos das linhas cruas retornadas pelo Supabase (snake_case).
interface CategoryRow {
  id: string;
  parent_id: string | null;
  nivel: CategoryLevel;
  nome: string;
  slug: string;
  ordem: number;
  ativo: boolean;
}

interface AttributeValueRow {
  id: string;
  attribute_id: string;
  valor: string;
  ordem: number;
  ativo: boolean;
}

interface AttributeRow {
  id: string;
  nome: string;
  slug: string;
  selecao: AttributeSelectionMode;
  ordem: number;
  ativo: boolean;
  product_attribute_values: AttributeValueRow[] | null;
}

interface ProductImageRow {
  id: string;
  product_id: string;
  url: string;
  ordem: number;
  papel: MediaRole;
}

interface ProductRow {
  id: string;
  seller_id: string;
  categoria_id: string | null;
  nome: string;
  modelo: string | null;
  preco: number | string;
  preco_parcelado_texto: string | null;
  descricao: string | null;
  ficha_tecnica: string | null;
  beneficios_texto: string | null;
  curiosidade: string | null;
  modo_uso_cuidados: string | null;
  garantia_satisfacao: string | null;
  sku: string | null;
  status: ProductStatus;
  vendas_count: number;
  created_at: string;
  updated_at: string;
  product_images: ProductImageRow[] | null;
  product_attribute_selections: { attribute_value_id: string }[] | null;
  detalhes: ProductDetails | null;
  product_pricing: { data: ProductDetails["precificacao"] } | null;
}

// =============================================================================
// Categorias (Tipo / Categoria / Subcategoria / Filtro)
// =============================================================================

function mapCategoryRow(row: CategoryRow): ProductCategory {
  return {
    id: row.id,
    parentId: row.parent_id,
    nivel: row.nivel,
    nome: row.nome,
    slug: row.slug,
    ordem: row.ordem,
    ativo: row.ativo,
  };
}

export async function fetchCategoryTree(): Promise<ProductCategory[]> {
  const { data, error } = await supabase
    .from("product_categories")
    .select("*")
    .order("nivel", { ascending: true })
    .order("ordem", { ascending: true });
  if (error || !data) return [];
  return (data as CategoryRow[]).map(mapCategoryRow);
}

export async function createCategory(input: {
  parentId: string | null;
  nivel: CategoryLevel;
  nome: string;
}): Promise<OpResult> {
  const { error } = await supabase.from("product_categories").insert({
    parent_id: input.parentId,
    nivel: input.nivel,
    nome: input.nome,
    slug: slugify(input.nome),
  });
  return { ok: !error, error: error?.message };
}

export async function setCategoryActive(
  id: string,
  ativo: boolean,
): Promise<OpResult> {
  const { error } = await supabase
    .from("product_categories")
    .update({ ativo })
    .eq("id", id);
  return { ok: !error, error: error?.message };
}

export async function deleteCategory(id: string): Promise<OpResult> {
  const { error } = await supabase
    .from("product_categories")
    .delete()
    .eq("id", id);
  return { ok: !error, error: error?.message };
}

// =============================================================================
// Atributos (facetas) e valores
// =============================================================================

function mapAttributeRow(row: AttributeRow): ProductAttribute {
  const valores = (row.product_attribute_values ?? [])
    .map((v) => ({
      id: v.id,
      attributeId: v.attribute_id,
      valor: v.valor,
      ordem: v.ordem,
      ativo: v.ativo,
    }))
    .sort((a, b) => a.ordem - b.ordem);

  return {
    id: row.id,
    nome: row.nome,
    slug: row.slug,
    selecao: row.selecao,
    ordem: row.ordem,
    ativo: row.ativo,
    valores,
  };
}

export async function fetchAttributes(): Promise<ProductAttribute[]> {
  const { data, error } = await supabase
    .from("product_attributes")
    .select("*, product_attribute_values(*)")
    .order("ordem", { ascending: true });
  if (error || !data) return [];
  return (data as AttributeRow[]).map(mapAttributeRow);
}

export async function createAttribute(input: {
  nome: string;
  selecao: AttributeSelectionMode;
}): Promise<OpResult> {
  const { error } = await supabase.from("product_attributes").insert({
    nome: input.nome,
    slug: slugify(input.nome),
    selecao: input.selecao,
  });
  return { ok: !error, error: error?.message };
}

export async function setAttributeActive(
  id: string,
  ativo: boolean,
): Promise<OpResult> {
  const { error } = await supabase
    .from("product_attributes")
    .update({ ativo })
    .eq("id", id);
  return { ok: !error, error: error?.message };
}

export async function deleteAttribute(id: string): Promise<OpResult> {
  const { error } = await supabase
    .from("product_attributes")
    .delete()
    .eq("id", id);
  return { ok: !error, error: error?.message };
}

export async function createAttributeValue(
  attributeId: string,
  valor: string,
): Promise<OpResult> {
  const { error } = await supabase.from("product_attribute_values").insert({
    attribute_id: attributeId,
    valor,
  });
  return { ok: !error, error: error?.message };
}

export async function setAttributeValueActive(
  id: string,
  ativo: boolean,
): Promise<OpResult> {
  const { error } = await supabase
    .from("product_attribute_values")
    .update({ ativo })
    .eq("id", id);
  return { ok: !error, error: error?.message };
}

export async function deleteAttributeValue(id: string): Promise<OpResult> {
  const { error } = await supabase
    .from("product_attribute_values")
    .delete()
    .eq("id", id);
  return { ok: !error, error: error?.message };
}

// =============================================================================
// Produtos
// =============================================================================

function mapProductRow(row: ProductRow): Product {
  return {
    id: row.id,
    sellerId: row.seller_id,
    categoriaId: row.categoria_id,
    nome: row.nome,
    modelo: row.modelo,
    preco: Number(row.preco),
    precoParceladoTexto: row.preco_parcelado_texto,
    descricao: row.descricao,
    fichaTecnica: row.ficha_tecnica,
    beneficiosTexto: row.beneficios_texto,
    curiosidade: row.curiosidade,
    modoUsoCuidados: row.modo_uso_cuidados,
    garantiaSatisfacao: row.garantia_satisfacao,
    sku: row.sku,
    status: row.status,
    vendasCount: row.vendas_count,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    imagens: (row.product_images ?? [])
      .map((img) => ({
        id: img.id,
        productId: img.product_id,
        url: img.url,
        ordem: img.ordem,
        papel: img.papel ?? "galeria",
      }))
      .filter((img) => img.papel !== "video")
      .sort(
        (a, b) =>
          Number(b.papel === "destaque") - Number(a.papel === "destaque") ||
          a.ordem - b.ordem,
      ),
    atributoValorIds: (row.product_attribute_selections ?? []).map(
      (s) => s.attribute_value_id,
    ),
    detalhes: normalizeDetails(
      {
        ...row.detalhes,
        precificacao: row.product_pricing?.data ?? row.detalhes?.precificacao,
      },
      Number(row.preco),
    ),
    midias: (row.product_images ?? [])
      .map((img) => ({
        id: img.id,
        productId: img.product_id,
        url: img.url,
        ordem: img.ordem,
        papel: img.papel ?? "galeria",
      }))
      .sort((a, b) => a.ordem - b.ordem),
  };
}

const PRODUCT_SELECT =
  "*, product_images(*), product_attribute_selections(attribute_value_id), product_pricing(data)";

export async function fetchMyProducts(sellerId: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("seller_id", sellerId)
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return (data as unknown as ProductRow[]).map(mapProductRow);
}

export async function fetchAllProductsForAdmin(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return (data as unknown as ProductRow[]).map(mapProductRow);
}

const STORAGE_BUCKET = "product-images";

// Envia os arquivos para o Storage e registra cada um em product_images.
// Devolve quantos foram enviados com sucesso.
async function uploadProductImages(
  sellerId: string,
  productId: string,
  files: ProductMediaUpload[],
  ordemInicial = 0,
): Promise<number> {
  const uploads = await Promise.all(
    files.map(async ({ file, papel }, idx) => {
      const bucket = papel === "video" ? "product-videos" : STORAGE_BUCKET;
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const path = `${sellerId}/${productId}/${crypto.randomUUID()}_${safeName}`;
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(path, file);
      if (uploadError) return null;
      const { data: pub } = supabase.storage.from(bucket).getPublicUrl(path);
      const { error: insertError } = await supabase
        .from("product_images")
        .insert({
          product_id: productId,
          url: pub.publicUrl,
          ordem: ordemInicial + idx,
          papel,
        });
      if (insertError) {
        await supabase.storage.from(bucket).remove([path]);
        return null;
      }
      return true;
    }),
  );

  const validRows = uploads.filter(
    (row): row is NonNullable<typeof row> => row !== null,
  );
  return validRows.length;
}

// A URL pública tem o formato .../object/public/product-images/{caminho};
// recuperar o caminho permite apagar o arquivo do Storage junto com o registro,
// em vez de deixar arquivo órfão no bucket.
function storagePathFromPublicUrl(url: string, bucket: string): string | null {
  const bucketMarker = `/object/public/${bucket}/`;
  const marker = url.indexOf(bucketMarker);
  if (marker === -1) return null;
  return decodeURIComponent(url.slice(marker + bucketMarker.length));
}

async function removeProductImages(
  imagens: ProductImage[],
): Promise<string | null> {
  if (imagens.length === 0) return null;
  const { error } = await supabase
    .from("product_images")
    .delete()
    .in(
      "id",
      imagens.map((img) => img.id),
    );
  if (error) return "Algumas mídias não puderam ser removidas.";
  for (const bucket of [STORAGE_BUCKET, "product-videos"]) {
    const paths = imagens
      .map((img) => storagePathFromPublicUrl(img.url, bucket))
      .filter((p): p is string => Boolean(p));
    if (paths.length) {
      const { error: storageError } = await supabase.storage
        .from(bucket)
        .remove(paths);
      if (storageError)
        return "As mídias foram removidas do anúncio, mas alguns arquivos ainda estão no armazenamento.";
    }
  }
  return null;
}

interface CreateProductResult extends OpResult {
  productId?: string;
}

async function saveRecord(
  productId: string | null,
  payload: ProductFormPayload,
): Promise<CreateProductResult> {
  if (
    !payload.nome.trim() ||
    !payload.categoriaId ||
    !Number.isFinite(payload.preco) ||
    payload.preco <= 0
  ) {
    return { ok: false, error: "Preencha nome, categoria e preço do produto." };
  }
  const { data, error } = await supabase.rpc("save_product_record", {
    p_product_id: productId,
    p_data: {
      categoria_id: payload.categoriaId,
      nome: payload.nome.trim(),
      modelo: payload.modelo,
      preco: payload.preco,
      preco_parcelado_texto: payload.precoParceladoTexto,
      descricao: payload.descricao,
      ficha_tecnica: payload.fichaTecnica,
      beneficios_texto: payload.beneficiosTexto,
      curiosidade: payload.curiosidade,
      modo_uso_cuidados: payload.modoUsoCuidados,
      garantia_satisfacao: payload.garantiaSatisfacao,
      sku: payload.sku,
      detalhes: payload.detalhes,
    },
    p_attribute_ids: payload.atributoValorIds,
  });
  if (error || !data)
    return {
      ok: false,
      error: error?.message ?? "Não foi possível salvar o produto.",
    };
  return { ok: true, productId: data as string };
}

async function finishMedia(
  sellerId: string,
  productId: string,
  payload: ProductFormPayload,
  removed: ProductImage[] = [],
): Promise<OpResult> {
  const warnings: string[] = [];
  try {
    const removalWarning = await removeProductImages(removed);
    if (removalWarning) warnings.push(removalWarning);
    if (payload.imagens.length) {
      const { data: last, error } = await supabase
        .from("product_images")
        .select("ordem")
        .eq("product_id", productId)
        .order("ordem", { ascending: false })
        .limit(1);
      if (error) warnings.push("Não foi possível consultar as mídias salvas.");
      else {
        const initialOrder = last?.length ? Number(last[0].ordem) + 1 : 0;
        const uploaded = await uploadProductImages(
          sellerId,
          productId,
          payload.imagens,
          initialOrder,
        );
        if (uploaded < payload.imagens.length)
          warnings.push("Algumas mídias não puderam ser enviadas.");
      }
    }
  } catch {
    warnings.push("Houve uma falha ao salvar as mídias.");
  }
  if (!warnings.length) {
    const status = await updateProductStatus(productId, payload.status);
    if (!status.ok)
      warnings.push(status.error ?? "Não foi possível atualizar o status.");
  }
  return {
    ok: true,
    error: warnings.length
      ? `Os dados foram salvos como rascunho. ${warnings.join(" ")} Abra o produto para completar o registro.`
      : undefined,
  };
}

export async function createProduct(
  sellerId: string,
  payload: ProductFormPayload,
): Promise<CreateProductResult> {
  const result = await saveRecord(null, payload);
  if (!result.ok || !result.productId) return result;
  const media = await finishMedia(sellerId, result.productId, payload);
  return { ...result, error: media.error };
}

export async function fetchProductById(
  productId: string,
): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("id", productId)
    .maybeSingle();
  if (error || !data) return null;
  return mapProductRow(data as unknown as ProductRow);
}

export async function updateProduct(
  sellerId: string,
  productId: string,
  payload: ProductFormPayload,
  removed: ProductImage[] = [],
): Promise<OpResult> {
  const result = await saveRecord(productId, payload);
  if (!result.ok) return result;
  return finishMedia(sellerId, productId, payload, removed);
}

export async function updateProductStatus(
  productId: string,
  status: ProductStatus,
): Promise<OpResult> {
  const { error } = await supabase
    .from("products")
    .update({ status })
    .eq("id", productId)
    .select("id")
    .single();
  return { ok: !error, error: error?.message };
}
