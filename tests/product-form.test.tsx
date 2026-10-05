import { beforeEach, describe, it, expect, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import CadastroProduto from "@/pages/account/CadastroProduto";
import { defaultDetails } from "@/lib/product-form";
const mocks = vi.hoisted(() => ({
  create: vi.fn(),
  update: vi.fn(),
  fetch: vi.fn(),
  toast: vi.fn(),
  attach: vi.fn(),
}));
vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({ user: { id: "seller-a", role: "vendedor" } }),
}));
vi.mock("@/components/AccountLayout", () => ({
  AccountLayout: ({ children }: { children: React.ReactNode }) => (
    <main>{children}</main>
  ),
}));
vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toast: mocks.toast }),
}));
vi.mock("@/lib/products", () => ({
  fetchCategoryTree: async () => [
    { id: "tipo", nivel: 0, nome: "Produto", ativo: true },
    { id: "cat", parentId: "tipo", nivel: 1, nome: "Moda", ativo: true },
  ],
  fetchAttributes: async () => [
    {
      id: "benefits",
      slug: "beneficios",
      nome: "Benefícios",
      selecao: "multipla",
      ativo: true,
      valores: [{ id: "cupom", valor: "Cupom", ativo: true }],
    },
  ],
  createProduct: mocks.create,
  updateProduct: mocks.update,
  fetchProductById: mocks.fetch,
  slugify: (text: string) => text.toLowerCase(),
}));
vi.mock("@/lib/ai", () => ({
  attachDraftHistory: mocks.attach,
  prepareAnalysisImages: vi.fn(),
}));
vi.mock("@/components/ai/AnalysisPanel", () => ({
  AnalysisPanel: ({ kind }: { kind: string }) => (
    <div data-testid={`ai-${kind}`} />
  ),
}));
const mount = (path = "/produtos/novo") =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/produtos/novo" element={<CadastroProduto />} />
        <Route path="/produtos/:id/editar" element={<CadastroProduto />} />
        <Route path="/account/produtos" element={<p>Meus produtos</p>} />
      </Routes>
    </MemoryRouter>,
  );
const choose = async (
  user: ReturnType<typeof userEvent.setup>,
  label: string,
  option: string,
) => {
  await user.click(screen.getByRole("combobox", { name: label }));
  await user.click(screen.getByRole("option", { name: option }));
};
beforeEach(() => {
  vi.clearAllMocks();
  mocks.create.mockResolvedValue({ ok: true, productId: "new-product" });
  mocks.update.mockResolvedValue({ ok: true });
  mocks.attach.mockResolvedValue(undefined);
});
describe("cadastro em três etapas", () => {
  it("preserva dados ao voltar, calcula preços e salva rascunho com todos os campos", async () => {
    const user = userEvent.setup();
    mount();
    await user.type(
      await screen.findByLabelText("Nome do Produto *"),
      "Jaqueta de Couro",
    );
    await user.type(
      screen.getByLabelText("Conteúdo do Anunciado"),
      "Elegância para o frio",
    );
    await choose(user, "Tipo *", "Produto");
    await choose(user, "Categoria *", "Moda");
    expect(screen.queryByText("Cupom")).toBeNull();
    await user.click(screen.getByRole("button", { name: /PRÓXIMA ETAPA/ }));
    await user.type(
      screen.getByLabelText("Valor de Custo do Produto (R$)"),
      "84,00",
    );
    await user.type(
      screen.getByLabelText("Margem de Lucro Desejada (R$)"),
      "33,70",
    );
    await user.click(
      screen.getByRole("button", { name: "Usar preço sugerido" }),
    );
    expect(
      (screen.getByLabelText("Preço do produto * (R$)") as HTMLInputElement)
        .value,
    ).toBe("114,17");
    await user.click(screen.getByRole("button", { name: "ETAPA ANTERIOR" }));
    expect(
      (screen.getByLabelText("Conteúdo do Anunciado") as HTMLTextAreaElement)
        .value,
    ).toBe("Elegância para o frio");
    await user.click(screen.getByRole("button", { name: /PRÓXIMA ETAPA/ }));
    await user.click(screen.getByRole("button", { name: /PRÓXIMA ETAPA/ }));
    await choose(user, "Status da publicação", "Salvar como rascunho");
    await user.upload(screen.getByLabelText("Imagens destacadas"), [
      new File(["jpg"], "foto.jpg", { type: "image/jpeg" }),
    ]);
    await user.click(screen.getByRole("button", { name: "SALVAR REGISTRO" }));
    await waitFor(() => expect(mocks.create).toHaveBeenCalledOnce());
    expect(mocks.create.mock.calls[0][1]).toMatchObject({
      nome: "Jaqueta de Couro",
      preco: 114.17,
      status: "rascunho",
      detalhes: {
        conteudoAnuncio: "Elegância para o frio",
        precificacao: { custo: 84, margem: 33.7 },
      },
      imagens: [{ papel: "destaque" }],
    });
    await waitFor(() => expect(mocks.attach).toHaveBeenCalled());
  });
  it("impede avanço sem campos obrigatórios e publicação sem mídias", async () => {
    const user = userEvent.setup();
    mount();
    await screen.findByLabelText("Nome do Produto *");
    await user.click(screen.getByRole("button", { name: /PRÓXIMA ETAPA/ }));
    expect(mocks.toast.mock.calls[0][0].description).toContain("nome");
    await user.type(screen.getByLabelText("Nome do Produto *"), "Produto");
    await choose(user, "Tipo *", "Produto");
    await choose(user, "Categoria *", "Moda");
    await user.click(screen.getByRole("button", { name: /PRÓXIMA ETAPA/ }));
    await user.type(screen.getByLabelText("Preço do produto * (R$)"), "100");
    await user.click(screen.getByRole("button", { name: /PRÓXIMA ETAPA/ }));
    await user.click(screen.getByRole("button", { name: "SALVAR REGISTRO" }));
    expect(mocks.create).not.toHaveBeenCalled();
    expect(mocks.toast.mock.lastCall?.[0].description).toContain("rascunho");
  });
  it("carrega edição e mantém reputação, vídeo e precificação", async () => {
    const details = defaultDetails();
    details.conteudoAnuncio = "Conteúdo salvo";
    details.precificacao.precoNormal = 150;
    details.avaliacao.produtoEstrelas = 4;
    mocks.fetch.mockResolvedValue({
      id: "p1",
      sellerId: "seller-a",
      categoriaId: "cat",
      nome: "Jaqueta",
      preco: 150,
      status: "rascunho",
      detalhes: details,
      atributoValorIds: [],
      midias: [
        { id: "v1", papel: "video", url: "https://example.com/video.mp4" },
      ],
    });
    const user = userEvent.setup();
    mount("/produtos/p1/editar");
    expect(
      (
        (await screen.findByLabelText(
          "Conteúdo do Anunciado",
        )) as HTMLTextAreaElement
      ).value,
    ).toBe("Conteúdo salvo");
    expect(
      within(
        screen.getByRole("radiogroup", {
          name: "Qual a avaliação do produto?",
        }),
      )
        .getByRole("radio", { name: "4 estrelas" })
        .getAttribute("aria-checked"),
    ).toBe("true");
    await user.click(screen.getByRole("button", { name: /PRÓXIMA ETAPA/ }));
    expect(
      (screen.getByLabelText("Preço do produto * (R$)") as HTMLInputElement)
        .value,
    ).toBe("150");
    await user.click(screen.getByRole("button", { name: /PRÓXIMA ETAPA/ }));
    expect(screen.getByText("1 de 1 arquivo(s)")).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "SALVAR REGISTRO" }));
    await waitFor(() => expect(mocks.update).toHaveBeenCalledOnce());
    expect(mocks.create).not.toHaveBeenCalled();
  });
});
