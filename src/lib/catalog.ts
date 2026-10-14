import type { ProductAttribute, ProductCategory } from "@/types/product";
export function categoryPath(
  categories: ProductCategory[],
  id: string,
): ProductCategory[] {
  const map = new Map(categories.map((c) => [c.id, c]));
  const path: ProductCategory[] = [];
  const visited = new Set<string>();
  let current = map.get(id);
  while (current && !visited.has(current.id)) {
    visited.add(current.id);
    path.unshift(current);
    current = map.get(current.parentId ?? "");
  }
  return path;
}
export function attributesForCategory(
  categories: ProductCategory[],
  attributes: ProductAttribute[],
  id: string,
): ProductAttribute[] {
  const scope = [...categoryPath(categories, id)]
    .reverse()
    .find((c) => c.attributesConfigured);
  return attributes.filter(
    (a) => (a.categoryId ?? null) === (scope?.id ?? null) && a.slug !== "marca",
  );
}
export function reconcileAttributeValues(
  previous: ProductAttribute[],
  next: ProductAttribute[],
  selected: Set<string>,
): Set<string> {
  const result = new Set<string>();
  for (const target of next) {
    const selectedLabels = new Set(
      previous
        .filter((a) => a.slug === target.slug)
        .flatMap((a) => a.valores)
        .filter((v) => selected.has(v.id))
        .map((v) => v.valor),
    );
    for (const value of target.valores)
      if (
        selected.has(value.id) ||
        selectedLabels.has(value.valor)
      ) {
        result.add(value.id);
        if (target.selecao === "unica") break;
      }
  }
  return result;
}
