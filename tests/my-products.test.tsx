import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import Produtos from "@/pages/account/Produtos";
const mocks = vi.hoisted(() => ({ fetch: vi.fn(), update: vi.fn() }));
vi.mock("@/contexts/AuthContext", () => ({ useAuth: () => ({ user: { id: "seller-a" } }) }));
vi.mock("@/components/AccountLayout", () => ({ AccountLayout: ({ children }: { children: React.ReactNode }) => <main>{children}</main> }));
vi.mock("@/lib/products", () => ({ fetchMyProducts: mocks.fetch, updateProductStatus: mocks.update }));
vi.mock("@/hooks/use-toast", () => ({ useToast: () => ({ toast: vi.fn() }) }));
beforeEach(() => {
  vi.clearAllMocks();
  mocks.fetch.mockResolvedValue([
    { id: "published", nome: "Publicado", preco: 100, status: "publicado", imagens: [] },
    { id: "draft", nome: "Rascunho", preco: 100, status: "rascunho", imagens: [] },
  ]);
  mocks.update.mockResolvedValue({ ok: true });
});
const mount = () => render(<MemoryRouter><Routes><Route path="/" element={<Produtos />} /><Route path="/produto/:id" element={<p>Página pública</p>} /></Routes></MemoryRouter>);
describe("acesso ao modelo em Meus produtos", () => {
  it("oferece anúncio público e prévia privada conforme o status", async () => {
    mount();
    expect((await screen.findByRole("link", { name: "Ver anúncio de Publicado" })).getAttribute("href")).toBe("/produto/published");
    expect(screen.getByRole("link", { name: "Pré-visualizar Rascunho" }).getAttribute("href")).toBe("/produto/draft/previa");
  });
  it("abre a página pública ao publicar um rascunho", async () => {
    mount();
    await userEvent.click(await screen.findByRole("button", { name: "Publicar" }));
    await screen.findByText("Página pública");
    expect(mocks.update).toHaveBeenCalledWith("draft", "publicado");
  });
});
