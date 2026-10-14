import { describe, it, expect } from "vitest";
import { attributesForCategory, reconcileAttributeValues } from "@/lib/catalog";
import type { ProductAttribute, ProductCategory } from "@/types/product";
const category = (
  id: string,
  parentId: string | null,
  attributesConfigured = false,
) => ({ id, parentId, attributesConfigured }) as ProductCategory;
const attribute = (id: string, categoryId: string | null, valor = "Azul") =>
  ({
    id,
    slug: "cor",
    categoryId,
    valores: [{ id: `${id}-value`, valor, ativo: true }],
  }) as ProductAttribute;
describe("classificação determina os filtros", () => {
  it("usa apenas a configuração mais específica, sem misturar Cropped e Top", () => {
    const categories = [
      category("tipo", null),
      category("blusa", "tipo", true),
      category("cropped", "blusa", true),
      category("top", "blusa", true),
    ];
    const attributes = [
      attribute("global", null),
      attribute("geral", "blusa"),
      attribute("cropped-cor", "cropped"),
      attribute("top-cor", "top"),
    ];
    expect(
      attributesForCategory(categories, attributes, "cropped").map((a) => a.id),
    ).toEqual(["cropped-cor"]);
    expect(
      attributesForCategory(categories, attributes, "top").map((a) => a.id),
    ).toEqual(["top-cor"]);
  });
  it("preserva cores equivalentes de produtos antigos ao personalizar", () => {
    const selected = reconcileAttributeValues(
      [attribute("global", null)],
      [attribute("novo", "cropped")],
      new Set(["global-value"]),
    );
    expect([...selected]).toEqual(["novo-value"]);
  });
  it("uma configuração vazia não reintroduz os filtros do pai", () => {
    expect(
      attributesForCategory(
        [category("tipo", null), category("cropped", "tipo", true)],
        [attribute("global", null)],
        "cropped",
      ),
    ).toEqual([]);
  });
  it("mantém somente uma opção em um atributo de seleção única", () => {
    const old = {
      ...attribute("global", null),
      valores: [
        { id: "old-a", valor: "Azul", ativo: true },
        { id: "old-b", valor: "Preto", ativo: true },
      ],
    } as ProductAttribute;
    const next = {
      ...attribute("novo", "cropped"),
      selecao: "unica",
      valores: [
        { id: "new-a", valor: "Azul", ativo: true },
        { id: "new-b", valor: "Preto", ativo: true },
      ],
    } as ProductAttribute;
    expect(
      reconcileAttributeValues([old], [next], new Set(["old-a", "old-b"])).size,
    ).toBe(1);
  });
});
