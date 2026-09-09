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
} from "@/types/product";

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

export async function setCategoryActive(id: string, ativo: boolean): Promise<OpResult> {
  const { error } = await supabase.from("product_categories").update({ ativo }).eq("id", id);
  return { ok: !error, error: error?.message };
}

export async function deleteCategory(id: string): Promise<OpResult> {
  const { error } = await supabase.from("product_categories").delete().eq("id", id);
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

export async function setAttributeActive(id: string, ativo: boolean): Promise<OpResult> {
  const { error } = await supabase.from("product_attributes").update({ ativo }).eq("id", id);
  return { ok: !error, error: error?.message };
}

export async function deleteAttribute(id: string): Promise<OpResult> {
  const { error } = await supabase.from("product_attributes").delete().eq("id", id);
  return { ok: !error, error: error?.message };
}

export async function createAttributeValue(attributeId: string, valor: string): Promise<OpResult> {
  const { error } = await supabase.from("product_attribute_values").insert({
    attribute_id: attributeId,
    valor,
  });
  return { ok: !error, error: error?.message };
}

export async function setAttributeValueActive(id: string, ativo: boolean): Promise<OpResult> {
  const { error } = await supabase.from("product_attribute_values").update({ ativo }).eq("id", id);
  return { ok: !error, error: error?.message };
}

export async function deleteAttributeValue(id: string): Promise<OpResult> {
  const { error } = await supabase.from("product_attribute_values").delete().eq("id", id);
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
      .map((img) => ({ id: img.id, productId: img.product_id, url: img.url, ordem: img.ordem }))
      .sort((a, b) => a.ordem - b.ordem),
    atributoValorIds: (row.product_attribute_selections ?? []).map((s) => s.attribute_value_id),
  };
}

const PRODUCT_SELECT = "*, product_images(*), product_attribute_selections(attribute_value_id)";

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
const STORAGE_PUBLIC_MARKER = `/${STORAGE_BUCKET}/`;

// Envia os arquivos para o Storage e registra cada um em product_images.
// Devolve quantos foram enviados com sucesso.
async function uploadProductImages(
  sellerId: string,
  productId: string,
  files: File[],
  ordemInicial = 0
): Promise<number> {
  const uploads = await Promise.all(
    files.map(async (file, idx) => {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const path = `${sellerId}/${productId}/${Date.now()}_${idx}_${safeName}`;
      const { error: uploadError } = await supabase.storage.from(STORAGE_BUCKET).upload(path, file);
      if (uploadError) return null;
      const { data: pub } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
      return { product_id: productId, url: pub.publicUrl, ordem: ordemInicial + idx };
    })
  );

  const validRows = uploads.filter((row): row is NonNullable<typeof row> => row !== null);
  if (validRows.length > 0) {
    await supabase.from("product_images").insert(validRows);
  }
  return validRows.length;
}

// A URL pública tem o formato .../object/public/product-images/{caminho};
// recuperar o caminho permite apagar o arquivo do Storage junto com o registro,
// em vez de deixar arquivo órfão no bucket.
function storagePathFromPublicUrl(url: string): string | null {
  const marker = url.indexOf(STORAGE_PUBLIC_MARKER);
  if (marker === -1) return null;
  return decodeURIComponent(url.slice(marker + STORAGE_PUBLIC_MARKER.length));
}

async function removeProductImages(imagens: ProductImage[]): Promise<void> {
  if (imagens.length === 0) return;

  const paths = imagens
    .map((img) => storagePathFromPublicUrl(img.url))
    .filter((path): path is string => Boolean(path));
  if (paths.length > 0) {
    await supabase.storage.from(STORAGE_BUCKET).remove(paths);
  }

  await supabase
    .from("product_images")
    .delete()
    .in(
      "id",
      imagens.map((img) => img.id)
    );
}

interface CreateProductResult extends OpResult {
  productId?: string;
}

export async function createProduct(sellerId: string, payload: ProductFormPayload): Promise<CreateProductResult> {
  if (!payload.nome || !payload.categoriaId || !(payload.preco > 0)) {
    return { ok: false, error: "Preencha nome, categoria e preço do produto." };
  }

  const { data: product, error } = await supabase
    .from("products")
    .insert({
      seller_id: sellerId,
      categoria_id: payload.categoriaId,
      nome: payload.nome,
      modelo: payload.modelo || null,
      preco: payload.preco,
      preco_parcelado_texto: payload.precoParceladoTexto || null,
      descricao: payload.descricao || null,
      ficha_tecnica: payload.fichaTecnica || null,
      beneficios_texto: payload.beneficiosTexto || null,
      curiosidade: payload.curiosidade || null,
      modo_uso_cuidados: payload.modoUsoCuidados || null,
      garantia_satisfacao: payload.garantiaSatisfacao || null,
      sku: payload.sku || null,
      status: payload.status,
    })
    .select()
    .single();

  if (error || !product) {
    return { ok: false, error: error?.message ?? "Não foi possível criar o produto." };
  }

  const productId = (product as { id: string }).id;

  if (payload.atributoValorIds.length > 0) {
    const rows = payload.atributoValorIds.map((attribute_value_id) => ({
      product_id: productId,
      attribute_value_id,
    }));
    const { error: selError } = await supabase.from("product_attribute_selections").insert(rows);
    if (selError) {
      return {
        ok: true,
        productId,
        error: `Produto criado, mas houve um erro ao salvar os atributos: ${selError.message}`,
      };
    }
  }

  if (payload.imagens.length > 0) {
    const enviadas = await uploadProductImages(sellerId, productId, payload.imagens);
    if (enviadas < payload.imagens.length) {
      return { ok: true, productId, error: "Produto criado, mas algumas imagens não puderam ser enviadas." };
    }
  }

  return { ok: true, productId };
}

export async function fetchProductById(productId: string): Promise<Product | null> {
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
  imagensRemovidas: ProductImage[] = []
): Promise<OpResult> {
  if (!payload.nome || !payload.categoriaId || !(payload.preco > 0)) {
    return { ok: false, error: "Preencha nome, categoria e preço do produto." };
  }

  const { error } = await supabase
    .from("products")
    .update({
      categoria_id: payload.categoriaId,
      nome: payload.nome,
      modelo: payload.modelo || null,
      preco: payload.preco,
      preco_parcelado_texto: payload.precoParceladoTexto || null,
      descricao: payload.descricao || null,
      ficha_tecnica: payload.fichaTecnica || null,
      beneficios_texto: payload.beneficiosTexto || null,
      curiosidade: payload.curiosidade || null,
      modo_uso_cuidados: payload.modoUsoCuidados || null,
      garantia_satisfacao: payload.garantiaSatisfacao || null,
      sku: payload.sku || null,
      status: payload.status,
    })
    .eq("id", productId);

  if (error) {
    return { ok: false, error: error.message };
  }

  // A seleção de atributos é trocada por inteiro pela nova.
  const { error: delSelError } = await supabase
    .from("product_attribute_selections")
    .delete()
    .eq("product_id", productId);
  if (delSelError) {
    return { ok: true, error: `Produto salvo, mas os atributos não puderam ser atualizados: ${delSelError.message}` };
  }

  if (payload.atributoValorIds.length > 0) {
    const rows = payload.atributoValorIds.map((attribute_value_id) => ({
      product_id: productId,
      attribute_value_id,
    }));
    const { error: insSelError } = await supabase.from("product_attribute_selections").insert(rows);
    if (insSelError) {
      return { ok: true, error: `Produto salvo, mas os atributos não puderam ser atualizados: ${insSelError.message}` };
    }
  }

  await removeProductImages(imagensRemovidas);

  if (payload.imagens.length > 0) {
    const { data: ultima } = await supabase
      .from("product_images")
      .select("ordem")
      .eq("product_id", productId)
      .order("ordem", { ascending: false })
      .limit(1);
    const proximaOrdem = ultima && ultima.length > 0 ? (ultima[0] as { ordem: number }).ordem + 1 : 0;

    const enviadas = await uploadProductImages(sellerId, productId, payload.imagens, proximaOrdem);
    if (enviadas < payload.imagens.length) {
      return { ok: true, error: "Produto salvo, mas algumas imagens novas não puderam ser enviadas." };
    }
  }

  return { ok: true };
}

export async function updateProductStatus(productId: string, status: ProductStatus): Promise<OpResult> {
  const { error } = await supabase.from("products").update({ status }).eq("id", productId);
  return { ok: !error, error: error?.message };
}
