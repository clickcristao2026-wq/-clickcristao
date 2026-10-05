// Tipos do catálogo de produtos — espelham supabase/schema_products.sql.

export type CategoryLevel = 0 | 1 | 2 | 3; // Tipo, Categoria, Subcategoria, Filtro

export interface ProductCategory {
  id: string;
  parentId: string | null;
  nivel: CategoryLevel;
  nome: string;
  slug: string;
  ordem: number;
  ativo: boolean;
}

export type AttributeSelectionMode = "unica" | "multipla";

export interface ProductAttributeValue {
  id: string;
  attributeId: string;
  valor: string;
  ordem: number;
  ativo: boolean;
}

export interface ProductAttribute {
  id: string;
  nome: string;
  slug: string;
  selecao: AttributeSelectionMode;
  ordem: number;
  ativo: boolean;
  valores: ProductAttributeValue[];
}

export type ProductStatus = "rascunho" | "publicado" | "pausado" | "removido";
export type MediaRole = "destaque" | "galeria" | "corpo" | "video";
export interface ProductEvaluation {
  vendeOnline: boolean | null;
  produtoEstrelas: number;
  atendimentoEstrelas: number;
  vendasMensais: number | null;
  links: string[];
}
export interface ProductDetails {
  conteudoAnuncio: string;
  nomeLoja: string;
  qualidade: string;
  secao: "premium" | "intermediario" | "popular" | "";
  avaliacao: ProductEvaluation;
  precificacao: import("@/lib/pricing").ProductPricing;
}
export interface ProductMediaUpload {
  file: File;
  papel: MediaRole;
}

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  ordem: number;
  papel: MediaRole;
}

export interface Product {
  id: string;
  sellerId: string;
  categoriaId: string | null;
  nome: string;
  modelo: string | null;
  preco: number;
  precoParceladoTexto: string | null;
  descricao: string | null;
  fichaTecnica: string | null;
  beneficiosTexto: string | null;
  curiosidade: string | null;
  modoUsoCuidados: string | null;
  garantiaSatisfacao: string | null;
  sku: string | null;
  status: ProductStatus;
  vendasCount: number;
  createdAt: string;
  updatedAt: string;
  imagens: ProductImage[];
  midias: ProductImage[];
  atributoValorIds: string[];
  detalhes: ProductDetails;
}

// Payload usado ao criar/editar um produto pelo formulário.
export interface ProductFormPayload {
  categoriaId: string;
  nome: string;
  modelo: string;
  preco: number;
  precoParceladoTexto: string;
  descricao: string;
  fichaTecnica: string;
  beneficiosTexto: string;
  curiosidade: string;
  modoUsoCuidados: string;
  garantiaSatisfacao: string;
  sku: string;
  status: ProductStatus;
  atributoValorIds: string[];
  imagens: ProductMediaUpload[];
  detalhes: ProductDetails;
}
