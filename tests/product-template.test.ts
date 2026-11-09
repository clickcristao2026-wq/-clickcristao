import { describe, expect, it } from "vitest";
import { toProductPage } from "@/components/product-page/data";
import { defaultDetails } from "@/lib/product-form";
import type { Product } from "@/types/product";

export function savedProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: "11111111-1111-4111-8111-111111111111", sellerId: "seller", categoriaId: "leaf", nome: "Jaqueta de Couro",
    modelo: "Preta", preco: 389.9, precoParceladoTexto: "3x de R$ 129,97", descricao: "Descrição cadastrada", fichaTecnica: "Couro natural",
    beneficiosTexto: "Proteção térmica", curiosidade: "", modoUsoCuidados: "Secar à sombra", garantiaSatisfacao: "", sku: "JQ1",
    status: "publicado", vendasCount: 0, createdAt: "", updatedAt: "", imagens: [], midias: [], atributoValorIds: [], detalhes: defaultDetails(), ...overrides,
  };
}

describe("modelo de anúncio cadastrado", () => {
  it("usa conteúdo, mídia, loja e condições comerciais do cadastro", () => {
    const product = savedProduct();
    product.detalhes.nomeLoja = "Loja do Cadastro";
    product.detalhes.conteudoAnuncio = "Resumo cadastrado";
    product.detalhes.qualidade = "Costura reforçada";
    product.detalhes.avaliacao.produtoEstrelas = 5;
    Object.assign(product.detalhes.precificacao, { afiliadoAtivo: true, freteAtivo: true, freteGratis: true, cupomAtivo: true, cupomNome: "BEMVINDO", cupomPercentual: 15 });
    product.imagens = [
      { id: "a", productId: product.id, url: "/principal.jpg", ordem: 2, papel: "destaque" },
      { id: "b", productId: product.id, url: "/galeria.jpg", ordem: 1, papel: "galeria" },
      { id: "c", productId: product.id, url: "/editorial.jpg", ordem: 3, papel: "corpo" },
    ];
    product.midias = [...product.imagens, { id: "d", productId: product.id, url: "/video.mp4", ordem: 4, papel: "video" }];
    const page = toProductPage(product);
    expect(page.demo).toBe(false);
    expect(page.summary).toBe("Resumo cadastrado");
    expect(page.seller.name).toBe("Loja do Cadastro");
    expect(page.images).toEqual(["/principal.jpg", "/galeria.jpg"]);
    expect(page.editorial).toEqual(["/editorial.jpg"]);
    expect(page.video).toBe("/video.mp4");
    expect(page.tabs[1].content).toBe("Costura reforçada");
    expect(page.conditions.map(c => c.text)).toEqual(["Produto Afiliado", "Frete Grátis", "Cupom 15% desconto · BEMVINDO"]);
    expect(page.rating).toBeNull();
  });

  it("combina classificação e somente sugestões publicadas, únicas e diferentes do anúncio", () => {
    const product = savedProduct();
    const related = savedProduct({ id: "related", nome: "Cinto" });
    const suggestion = savedProduct({ id: "suggestion", nome: "Outra jaqueta" });
    const page = toProductPage(product, {
      categories: [
        { id: "type", parentId: null, nivel: 0, nome: "Produto", slug: "produto", ordem: 0, ativo: true },
        { id: "cat", parentId: "type", nivel: 1, nome: "Moda", slug: "moda", ordem: 0, ativo: true },
        { id: "leaf", parentId: "cat", nivel: 2, nome: "Jaquetas", slug: "jaquetas", ordem: 0, ativo: true },
      ],
      related: [related, related, product, savedProduct({ id: "draft", status: "rascunho" })],
      recommendations: [suggestion, product],
    });
    expect(page.breadcrumbs).toEqual(["Moda", "Jaquetas"]);
    expect(page.related.map(p => p.id)).toEqual(["related"]);
    expect(page.recommendations.map(p => p.id)).toEqual(["suggestion"]);
  });
});
