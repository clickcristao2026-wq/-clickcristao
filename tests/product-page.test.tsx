import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { ProductPageView } from "@/pages/Produto";
import { demoProduct } from "@/components/product-page/data";
import { ProductPhoto } from "@/components/product-page/ProductGallery";
import { RelatedProducts } from "@/components/product-page/RelatedProducts";

function mount(data = demoProduct) {
  return render(<MemoryRouter><ProductPageView product={data} /></MemoryRouter>);
}

describe("página pública do produto", () => {
  it("limita recomendações ao final real do trilho", async () => {
    const view = render(<RelatedProducts product={demoProduct} onSelect={() => {}} />);
    const rail = view.container.querySelector(".pp-recommendation-rail") as HTMLElement;
    Object.defineProperties(rail, { clientWidth: { value: 358, configurable: true }, scrollWidth: { value: 652, configurable: true }, scrollLeft: { value: 0, writable: true } });
    [...rail.children].forEach((child, i) => Object.defineProperty(child, "offsetLeft", { value: i * 166 }));
    Object.defineProperty(rail, "scrollTo", { value: ({ left }: { left: number }) => { rail.scrollLeft = left; fireEvent.scroll(rail); } });
    act(() => { window.dispatchEvent(new Event("resize")); });
    const next = screen.getByRole("button", { name: "Próxima recomendação" });
    await userEvent.click(next);
    await userEvent.click(next);
    expect(rail.scrollLeft).toBe(294);
    expect(next.hasAttribute("disabled")).toBe(true);
  });
  it("recupera a imagem ao navegar após uma foto quebrada", () => {
    const view = render(<ProductPhoto src="/quebrada.jpg" alt="Foto ampliada" />);
    fireEvent.error(screen.getByRole("img", { name: "Foto ampliada" }));
    expect(screen.getByText("Imagem indisponível")).toBeTruthy();
    view.rerender(<ProductPhoto src="/valida.jpg" alt="Foto ampliada" />);
    expect(screen.getByRole("img", { name: "Foto ampliada" }).getAttribute("src")).toBe("/valida.jpg");
  });
  it("navega pela galeria e amplia a foto", async () => {
    mount();
    await userEvent.click(screen.getByRole("button", { name: "Ver foto 2" }));
    expect(screen.getByRole("img", { name: "Sapatênis de Couro Marrom — foto 2" }).getAttribute("src")).toContain("galeria-2");
    await userEvent.click(screen.getByRole("button", { name: "Ampliar imagem" }));
    expect(screen.getByRole("dialog")).toBeTruthy();
  });

  it("limita quantidade ao intervalo disponível", async () => {
    mount({ ...demoProduct, stock: 2 });
    const less = screen.getByRole("button", { name: "Diminuir quantidade" });
    const more = screen.getByRole("button", { name: "Aumentar quantidade" });
    expect(less.hasAttribute("disabled")).toBe(true);
    await userEvent.click(more);
    expect(screen.getByLabelText("Quantidade selecionada").textContent).toBe("2");
    expect(more.hasAttribute("disabled")).toBe(true);
    await userEvent.click(less);
    expect(screen.getByLabelText("Quantidade selecionada").textContent).toBe("1");
  });

  it("troca o conteúdo das abas com teclado", () => {
    mount();
    fireEvent.keyDown(screen.getByRole("tab", { name: "Ficha Técnica" }), { key: "ArrowRight" });
    expect(screen.getByRole("tab", { name: "Qualidade do Produto" }).getAttribute("aria-selected")).toBe("true");
    expect(screen.getByRole("tabpanel").textContent).toContain(demoProduct.tabs[1].content);
  });

  it("identifica a simulação de compra e permite favoritar", async () => {
    mount();
    await userEvent.click(screen.getByRole("button", { name: "Favoritar" }));
    expect(screen.getByRole("button", { name: "Favoritado" }).getAttribute("aria-pressed")).toBe("true");
    await userEvent.click(screen.getByRole("button", { name: "Comprar agora" }));
    expect(screen.getByRole("dialog").textContent).toContain("Nenhum pedido ou pagamento será realizado");
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("não permite comprar anúncio sem estoque validado nem mostra vídeo inexistente", () => {
    mount({ ...demoProduct, demo: false, stock: null, videoPreview: undefined });
    expect(screen.getByRole("button", { name: "Comprar agora" }).hasAttribute("disabled")).toBe(true);
    expect(screen.queryByLabelText("Prévia visual do vídeo")).toBeNull();
  });
});
