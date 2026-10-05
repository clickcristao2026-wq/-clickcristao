import { describe, it, expect } from "vitest";
import {
  calculatePricing,
  emptyPricing,
  parseMoney,
  validatePricing,
} from "../supabase/functions/_shared/domain";
import {
  defaultDetails,
  normalizeDetails,
  validateEvaluation,
  validateMediaCount,
  validateMediaFile,
} from "@/lib/product-form";
describe("precificação", () => {
  it("calcula a taxa e a sugestão segundo a fórmula solicitada", () => {
    const result = calculatePricing({
      ...emptyPricing,
      custo: 84,
      margem: 33.7,
    });
    expect(result.custoPlataforma).toBe(3.53);
    expect(result.precoSugerido).toBe(114.17);
  });
  it("calcula cupom percentual, frete e afiliado sem duplicar a taxa", () => {
    const result = calculatePricing({
      ...emptyPricing,
      custo: 84,
      precoNormal: 114.16,
      cupomAtivo: true,
      cupomNome: "CLICK",
      cupomPercentual: 10,
      freteAtivo: true,
      freteGratis: true,
      freteCusto: 7,
      afiliadoAtivo: true,
    });
    expect(result.cupom).toBe(11.42);
    expect(result.afiliado).toBe(5.71);
    expect(result.frete).toBe(7);
    expect(result.faturamentoLiquido).toBe(90.03);
    expect(result.lucroLiquido).toBe(6.03);
  });
  it("usa exclusivamente a promoção para preço, economia e comissão", () => {
    const p = {
      ...emptyPricing,
      modalidade: "promocao" as const,
      precoNormal: 300,
      precoOriginal: 150,
      precoPromocional: 100,
      afiliadoAtivo: true,
    };
    expect(calculatePricing(p)).toMatchObject({
      preco: 100,
      economia: 50,
      afiliado: 5,
    });
    expect(validatePricing({ ...p, precoPromocional: 150 })).toContain("menor");
  });
  it("ignora custos de benefícios desativados e mostra prejuízo", () => {
    const result = calculatePricing({
      ...emptyPricing,
      custo: 200,
      precoNormal: 100,
      cupomPercentual: 20,
      freteCusto: 50,
    });
    expect(result).toMatchObject({
      cupom: 0,
      frete: 0,
      afiliado: 0,
      lucroLiquido: -100,
    });
  });
  it("aceita moeda brasileira e rejeita valores inválidos", () => {
    expect(parseMoney("R$ 1.234,56")).toBe(1234.56);
    expect(parseMoney("114,16")).toBe(114.16);
    expect(parseMoney("114.16")).toBe(114.16);
    expect(validatePricing({ ...emptyPricing, precoNormal: NaN })).toContain(
      "válidos",
    );
    expect(validatePricing({ ...emptyPricing, precoNormal: -1 })).toContain(
      "válidos",
    );
    expect(
      validatePricing({
        ...emptyPricing,
        precoNormal: 100,
        cupomAtivo: true,
        cupomNome: "A",
        cupomPercentual: 101,
      }),
    ).toContain("100%");
  });
});
describe("dados e mídias do produto", () => {
  it("abre produtos antigos com valores padrão, preservando o preço", () => {
    expect(normalizeDetails({}, 123.45).precificacao.precoNormal).toBe(123.45);
    const details = defaultDetails();
    details.avaliacao.links[0] = "javascript:alert(1)";
    expect(validateEvaluation(details)).toContain("https://");
    details.avaliacao.links = ["", "", ""];
    details.avaliacao.produtoEstrelas = 4.5;
    expect(validateEvaluation(details)).toBeNull();
  });
  it("valida tipos, limites e rascunhos incompletos", () => {
    expect(
      validateMediaFile(
        new File(["x"], "test.svg", { type: "image/svg+xml" }),
        "destaque",
      ),
    ).toContain("JPG");
    expect(
      validateMediaFile(
        new File(["x"], "test.mp4", { type: "video/mp4" }),
        "video",
      ),
    ).toBeNull();
    expect(validateMediaCount([], [], false)).toBeNull();
    expect(validateMediaCount([], [], true)).toContain("rascunho");
  });
});
