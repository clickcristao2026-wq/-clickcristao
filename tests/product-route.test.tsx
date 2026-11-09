import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Produto from "@/pages/Produto";
import { defaultDetails } from "@/lib/product-form";

const mocks = vi.hoisted(() => ({ published: vi.fn(), preview: vi.fn(), context: vi.fn() }));
vi.mock("@/contexts/AuthContext", () => ({ useAuth: () => ({ user: { id: "seller-a", role: "vendedor" } }) }));
vi.mock("@/lib/products", () => ({ fetchPublishedProductById: mocks.published, fetchProductForPreview: mocks.preview }));
vi.mock("@/lib/product-page-context", () => ({ fetchProductPageContext: mocks.context }));

const product = () => ({ id: "new-product", sellerId: "seller-a", status: "publicado", nome: "Produto cadastrado", modelo: "Modelo do cadastro", preco: 123.45, sku: "REAL-1", detalhes: defaultDetails(), imagens: [], midias: [], atributoValorIds: [], updatedAt: "now" });
const mount = (preview = false, path = "/produto/new-product") => render(<QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false, retryDelay: 0 } } })}><MemoryRouter initialEntries={[path]}><Routes><Route path="/produto/:id" element={<Produto />} /><Route path="/produto/:id/previa" element={<Produto preview={preview} />} /><Route path="/produto/demonstracao" element={<Produto />} /></Routes></MemoryRouter></QueryClientProvider>);

beforeEach(() => {
  vi.clearAllMocks();
  mocks.published.mockResolvedValue(product());
  mocks.preview.mockResolvedValue({ ...product(), status: "rascunho" });
  mocks.context.mockResolvedValue({ categories: [], related: [], recommendations: [] });
});

describe("modelo público e prévia privada", () => {
  it("renderiza os dados salvos no mesmo modelo, sem dados do sapatênis", async () => {
    mount();
    await screen.findByRole("heading", { name: "Produto cadastrado", exact: true });
    expect(screen.getByText("R$ 123,45")).toBeTruthy();
    expect(screen.queryByText("KLÓBER")).toBeNull();
    expect(screen.queryByText(/dados ilustrativos/)).toBeNull();
    expect(mocks.published).toHaveBeenCalledWith("new-product");
  });
  it("não revela rascunho pela rota pública", async () => {
    mocks.published.mockResolvedValue(null);
    mount();
    await screen.findByRole("heading", { name: "Produto indisponível" });
    expect(screen.queryByText("Produto cadastrado")).toBeNull();
    expect(mocks.preview).not.toHaveBeenCalled();
  });
  it("usa uma consulta com identificação do proprietário na prévia", async () => {
    mount(true, "/produto/new-product/previa");
    await screen.findByRole("heading", { name: "Produto cadastrado", exact: true });
    expect(screen.getByText(/Pré-visualização privada/)).toBeTruthy();
    expect(mocks.preview).toHaveBeenCalledWith("new-product", "seller-a");
  });
  it("preserva demonstração sem consultar anúncios do catálogo", async () => {
    mount(false, "/produto/demonstracao");
    await screen.findByRole("heading", { name: "Sapatênis de Couro Marrom", exact: true });
    expect(mocks.published).not.toHaveBeenCalled();
    expect(mocks.context).not.toHaveBeenCalled();
  });
  it("mantém o produto visível se as sugestões falharem", async () => {
    mocks.context.mockRejectedValue(new Error("offline"));
    mount();
    await screen.findByRole("heading", { name: "Produto cadastrado", exact: true });
    await screen.findByText(/Algumas sugestões não puderam ser carregadas/);
  });
});
