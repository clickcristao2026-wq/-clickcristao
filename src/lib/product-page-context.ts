import type { Product, ProductCategory } from "@/types/product";
import { categoryPath } from "@/lib/catalog";
import { fetchCategoryTree, fetchPublishedProducts } from "@/lib/products";
import type { ProductPageContext } from "@/components/product-page/data";

export function recommendationCategoryIds(categories: ProductCategory[], categoryId: string | null): string[] {
  if (!categoryId) return [];
  const path = categoryPath(categories, categoryId);
  const root = path.find(c => c.nivel === 2) ?? path.find(c => c.nivel === 1) ?? path.at(-1);
  if (!root) return [categoryId];
  return categories.filter(c => c.ativo && categoryPath(categories, c.id).some(parent => parent.id === root.id)).map(c => c.id);
}

// Ancillary sections fail independently: a temporarily unavailable suggestion
// must never prevent a buyer from opening the current product.
export async function fetchProductPageContext(product: Product): Promise<ProductPageContext & { incomplete: boolean }> {
  const ids = (product.detalhes.paginaProduto?.complementares ?? []).filter(id => id !== product.id);
  const [categoriesResult, relatedResult] = await Promise.allSettled([
    fetchCategoryTree(),
    ids.length ? fetchPublishedProducts({ ids, excludeId: product.id, limit: 3 }) : Promise.resolve([]),
  ]);
  const categories = categoriesResult.status === "fulfilled" ? categoriesResult.value : [];
  const relatedProducts = relatedResult.status === "fulfilled" ? relatedResult.value : [];
  const related = ids.map(id => relatedProducts.find(p => p.id === id)).filter((p): p is Product => Boolean(p));
  try {
    const recommendations = await fetchPublishedProducts({ categoryIds: recommendationCategoryIds(categories, product.categoriaId), excludeId: product.id, limit: 8 });
    return { categories, related, recommendations, incomplete: categoriesResult.status === "rejected" || relatedResult.status === "rejected" };
  } catch {
    return { categories, related, recommendations: [], incomplete: true };
  }
}
