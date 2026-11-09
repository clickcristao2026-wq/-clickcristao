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
  selectedAttributes: vi.fn(),
  publicProducts: vi.fn(),
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
      id: "section",
      slug: "secao",
      nome: "Seção",
      selecao: "unica",
      ativo: true,
      valores: [
        {
          id: "premium",
          valor: "Premium",
          ativo: true,
          descricao: "Produto de luxo com durabilidade.",
        },
      ],
    },
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
  fetchProductSelectedAttributes: mocks.selectedAttributes,
  fetchPublishedProducts: mocks.publicProducts,
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
        <Route path="/produto/:id" element={<p>Anúncio publicado</p>} />
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
  mocks.selectedAttributes.mockResolvedValue([]);
  mocks.publicProducts.mockResolvedValue([]);
});

async function fillForPublication(user: ReturnType<typeof userEvent.setup>) {
  await user.type(await screen.findByLabelText("Nome do Produto *"), "Jaqueta de Couro");
  await choose(user, "Tipo *", "Produto");
  await choose(user, "Categoria *", "Moda");
  await user.click(screen.getByRole("button", { name: /PRÓXIMA ETAPA/ }));
  await user.type(screen.getByLabelText("Preço do produto * (R$)"), "389,90");
  await user.click(screen.getByRole("button", { name: /PRÓXIMA ETAPA/ }));
  const photo = (name: string) => new File(["photo"], name, { type: "image/jpeg" });
  await user.upload(screen.getByLabelText("Imagens destacadas"), [photo("a.jpg"), photo("b.jpg")]);
  await user.upload(screen.getByLabelText("Galeria do produto"), [photo("c.jpg")]);
  await user.upload(screen.getByLabelText("Imagens no corpo do anúncio"), [photo("d.jpg"), photo("e.jpg")]);
  await user.upload(screen.getByLabelText("Vídeo do produto"), new File(["video"], "v.mp4", { type: "video/mp4" }));
}
describe("cadastro em três etapas", () => {
  it("abre o modelo público após cadastrar e publicar, salvando os complementares", async () => {
    const user = userEvent.setup();
    mocks.publicProducts.mockResolvedValue([{ id: "cinto", nome: "Cinto de Couro", preco: 89.9, modelo: "Marrom", imagens: [] }]);
    mount();
    await fillForPublication(user);
    await user.type(screen.getByLabelText("Buscar produtos complementares"), "Cinto");
    await user.click(await screen.findByRole("checkbox", { name: "Selecionar Cinto de Couro" }));
    await user.click(screen.getByRole("button", { name: "SALVAR REGISTRO" }));
    await screen.findByText("Anúncio publicado");
    expect(mocks.create.mock.calls[0][1].detalhes.paginaProduto.complementares).toEqual(["cinto"]);
  });
  it("mantém o vendedor no gerenciamento se a publicação teve falha nas mídias", async () => {
    mocks.create.mockResolvedValue({ ok: true, productId: "new-product", error: "Dados salvos como rascunho. Falha ao enviar vídeo." });
    const user = userEvent.setup();
    mount();
    await fillForPublication(user);
    await user.click(screen.getByRole("button", { name: "SALVAR REGISTRO" }));
    await screen.findByText("Meus produtos");
    expect(screen.queryByText("Anúncio publicado")).toBeNull();
  });
  it("preserva marca e cor antigas desativadas durante a edição", async () => {
    const details = defaultDetails();
    details.precificacao.precoNormal = 100;
    mocks.fetch.mockResolvedValue({
      id: "p1",
      sellerId: "seller-a",
      categoriaId: "cat",
      nome: "Antigo",
      preco: 100,
      status: "rascunho",
      detalhes: details,
      atributoValorIds: ["brand-old", "color-old"],
      midias: [],
      curiosidade: "Texto antigo",
      garantiaSatisfacao: "Garantia antiga",
    });
    mocks.selectedAttributes.mockResolvedValue([
      {
        id: "brand-attr",
        slug: "marca",
        nome: "Marca",
        categoryId: null,
        valores: [{ id: "brand-old", valor: "Polo", ativo: false }],
      },
      {
        id: "color-attr",
        slug: "cor",
        nome: "Cor",
        selecao: "multipla",
        ativo: true,
        categoryId: null,
        valores: [{ id: "color-old", valor: "Azul", ativo: false }],
      },
    ]);
    const user = userEvent.setup();
    mount("/produtos/p1/editar");
    expect(
      ((await screen.findByLabelText("Marca do produto")) as HTMLInputElement)
        .value,
    ).toBe("Polo");
    expect(
      screen
        .getByRole("checkbox", { name: "Azul" })
        .getAttribute("aria-checked"),
    ).toBe("true");
    await user.click(screen.getByRole("button", { name: /PRÓXIMA ETAPA/ }));
    await user.click(screen.getByRole("button", { name: /PRÓXIMA ETAPA/ }));
    await user.click(screen.getByRole("button", { name: "SALVAR REGISTRO" }));
    await waitFor(() => expect(mocks.update).toHaveBeenCalledOnce());
    expect(mocks.update.mock.calls[0][2]).toMatchObject({
      curiosidade: "Texto antigo",
      garantiaSatisfacao: "Garantia antiga",
      atributoValorIds: ["color-old"],
      detalhes: { marca: "Polo" },
    });
  });
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
    expect(screen.queryByLabelText("Curiosidade do produto")).toBeNull();
    expect(screen.queryByLabelText("Garantia e satisfação")).toBeNull();
    await user.type(screen.getByLabelText("Marca do produto"), "Minha Marca");
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
    ).toBe("121,23");
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
      preco: 121.23,
      status: "rascunho",
      detalhes: {
        conteudoAnuncio: "Elegância para o frio",
        marca: "Minha Marca",
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
