import { beforeEach, describe, expect, it, vi } from "vitest";
import { fetchCategoryTree, fetchPublishedProductById } from "@/lib/products";
const mocks = vi.hoisted(() => ({ from: vi.fn() }));
vi.mock("@/lib/supabaseClient", () => ({ supabase: { from: mocks.from } }));
beforeEach(() => vi.clearAllMocks());

describe("consulta pública do produto", () => {
  it("propaga erros de rede para permitir recuperação na página", async () => {
    const query = { select: vi.fn(), eq: vi.fn(), maybeSingle: vi.fn().mockResolvedValue({ data: null, error: { message: "Serviço indisponível" } }) };
    query.select.mockReturnValue(query);
    query.eq.mockReturnValue(query);
    mocks.from.mockReturnValue(query);
    await expect(fetchPublishedProductById("id")).rejects.toThrow("Serviço indisponível");
    expect(query.eq).toHaveBeenCalledWith("status", "publicado");
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
