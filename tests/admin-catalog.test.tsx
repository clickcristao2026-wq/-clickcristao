import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AdminCatalogo from "@/pages/admin/Catalogo";
const mocks = vi.hoisted(() => ({ customize: vi.fn(), toast: vi.fn() }));
vi.mock("@/components/AdminLayout", () => ({
  AdminLayout: ({ children }: { children: React.ReactNode }) => (
    <main>{children}</main>
  ),
}));
vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toast: mocks.toast }),
}));
vi.mock("@/lib/products", () => ({
  fetchCategoryTree: async () => [
    { id: "t", nome: "Produto", nivel: 0, ativo: true },
    { id: "c", parentId: "t", nome: "Gestante", nivel: 1, ativo: true },
    { id: "s", parentId: "c", nome: "Blusa", nivel: 2, ativo: true },
    { id: "f", parentId: "s", nome: "Cropped", nivel: 3, ativo: true },
  ],
  fetchAttributes: async () => [
    {
      id: "color",
      nome: "Cor",
      slug: "cor",
      selecao: "multipla",
      ativo: true,
      valores: [],
    },
  ],
  customizeCategoryAttributes: mocks.customize,
  createAttribute: vi.fn(),
  createAttributeValue: vi.fn(),
  createCategory: vi.fn(),
  deleteAttribute: vi.fn(),
  deleteAttributeValue: vi.fn(),
  deleteCategory: vi.fn(),
  setAttributeActive: vi.fn(),
  setAttributeValueActive: vi.fn(),
  setCategoryActive: vi.fn(),
  setAttributeValueDescription: vi.fn(),
}));
describe("contexto dos atributos administrativos", () => {
  it("mantém a seleção de Cropped ao trocar de aba e mostra o caminho completo", async () => {
    const user = userEvent.setup();
    render(<AdminCatalogo />);
    await user.click(await screen.findByText("Produto", { exact: true }));
    await user.click(screen.getByText("Gestante", { exact: true }));
    await user.click(screen.getByText("Blusa", { exact: true }));
    await user.click(screen.getByText("Cropped", { exact: true }));
    await user.click(screen.getByRole("tab", { name: "Atributos (filtros)" }));
    expect(
      screen.getByText("Produto / Gestante / Blusa / Cropped"),
    ).toBeTruthy();
    await user.click(
      screen.getByRole("button", { name: "Personalizar filtros de Cropped" }),
    );
    await waitFor(() => expect(mocks.customize).toHaveBeenCalledWith("f"));
    await user.click(screen.getByRole("tab", { name: "Categorias" }));
    expect(
      screen
        .getByRole("button", { name: "Selecionar Cropped" })
        .getAttribute("aria-pressed"),
    ).toBe("true");
  });
});
