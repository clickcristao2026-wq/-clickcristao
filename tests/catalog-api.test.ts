import { beforeEach, describe, expect, it, vi } from "vitest";
import { fetchCategoryTree, fetchProductForPreview, fetchPublishedProductById, fetchPublishedProducts } from "@/lib/products";
const mocks = vi.hoisted(() => ({ from: vi.fn() }));
vi.mock("@/lib/supabaseClient", () => ({ supabase: { from: mocks.from } }));
beforeEach(() => vi.clearAllMocks());

describe("consulta pública do produto", () => {
  it("filtra as sugestões por publicação e classificação e exclui o próprio anúncio", async () => {
    const query = { select: vi.fn(), eq: vi.fn(), in: vi.fn(), neq: vi.fn(), order: vi.fn(), limit: vi.fn().mockResolvedValue({ data: [], error: null }) };
    for (const method of [query.select, query.eq, query.in, query.neq, query.order]) method.mockReturnValue(query);
    mocks.from.mockReturnValue(query);
    await expect(fetchPublishedProducts({ categoryIds: ["category"], excludeId: "current", limit: 8 })).resolves.toEqual([]);
    expect(query.eq).toHaveBeenCalledWith("status", "publicado");
    expect(query.in).toHaveBeenCalledWith("categoria_id", ["category"]);
    expect(query.neq).toHaveBeenCalledWith("id", "current");
    expect(query.select.mock.calls[0][0]).not.toContain("product_pricing");
  });
  it("não consulta o catálogo inteiro quando a seleção de complementares está vazia", async () => {
    await expect(fetchPublishedProducts({ ids: [] })).resolves.toEqual([]);
    expect(mocks.from).not.toHaveBeenCalled();
  });
  it("restringe a prévia ao vendedor e exclui anúncios removidos", async () => {
    const query = { select: vi.fn(), eq: vi.fn(), neq: vi.fn(), maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }) };
    for (const method of [query.select, query.eq, query.neq]) method.mockReturnValue(query);
    mocks.from.mockReturnValue(query);
    await expect(fetchProductForPreview("id", "owner")).resolves.toBeNull();
    expect(query.eq).toHaveBeenCalledWith("seller_id", "owner");
    expect(query.neq).toHaveBeenCalledWith("status", "removido");
  });
  it("propaga erros de rede para permitir recuperação na página", async () => {
    const query = { select: vi.fn(), eq: vi.fn(), maybeSingle: vi.fn().mockResolvedValue({ data: null, error: { message: "Serviço indisponível" } }) };
    query.select.mockReturnValue(query);
    query.eq.mockReturnValue(query);
    mocks.from.mockReturnValue(query);
    await expect(fetchPublishedProductById("id")).rejects.toThrow("Serviço indisponível");
    expect(query.eq).toHaveBeenCalledWith("status", "publicado");
    expect(query.select.mock.calls[0][0]).not.toContain("product_pricing");
  });
  it("devolve null apenas quando o anúncio não existe", async () => {
    const query = { select: vi.fn(), eq: vi.fn(), maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }) };
    query.select.mockReturnValue(query);
    query.eq.mockReturnValue(query);
    mocks.from.mockReturnValue(query);
    await expect(fetchPublishedProductById("inexistente")).resolves.toBeNull();
  });
});
describe("árvore completa de classificação", () => {
  it("carrega todos os registros depois do limite de 1.000 do Supabase", async () => {
    const rows = Array.from({ length: 1034 }, (_, i) => ({
      id: String(i),
      nivel: 3,
      nome: i === 1033 ? "Cropped Gestante" : `Filtro ${i}`,
      parent_id: "blusa",
      ativo: true,
      ordem: 0,
    }));
    const query = {
      select: vi.fn(),
      order: vi.fn(),
      range: vi.fn(),
      then: (resolve: (v: unknown) => void) =>
        Promise.resolve({ data: rows.slice(0, 1000), error: null }).then(
          resolve,
        ),
    };
    query.select.mockReturnValue(query);
    query.order.mockReturnValue(query);
    query.range.mockImplementation((start: number, end: number) =>
      Promise.resolve({ data: rows.slice(start, end + 1), error: null }),
    );
    mocks.from.mockReturnValue(query);
    const result = await fetchCategoryTree();
    expect(result).toHaveLength(1034);
    expect(result[1033].nome).toBe("Cropped Gestante");
    expect(query.range).toHaveBeenNthCalledWith(1, 0, 999);
    expect(query.range).toHaveBeenNthCalledWith(2, 1000, 1999);
  });
  it("não devolve uma lista parcial como sucesso quando uma página falha", async () => {
    const query = {
      select: vi.fn(),
      order: vi.fn(),
      range: vi.fn(),
      then: (resolve: (v: unknown) => void) =>
        Promise.resolve({ data: [], error: null }).then(resolve),
    };
    query.select.mockReturnValue(query);
    query.order.mockReturnValue(query);
    query.range
      .mockResolvedValueOnce({
        data: Array.from({ length: 1000 }, (_, i) => ({ id: String(i) })),
        error: null,
      })
      .mockResolvedValueOnce({
        data: null,
        error: { message: "Página indisponível" },
      });
    mocks.from.mockReturnValue(query);
    await expect(fetchCategoryTree()).rejects.toThrow("Página indisponível");
  });
});
