import type { Product } from "@/types/product";

export interface ProductCardData {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  image: string;
}

export interface ProductPageData {
  id: string;
  demo: boolean;
  name: string;
  subtitle: string;
  price: number;
  installments: string;
  sku: string;
  rating: number | null;
  stock: number | null;
  summary: string;
  description: string[];
  images: string[];
  editorial: string[];
  seller: { name: string; rating: number | null; partner: boolean };
  conditions: { kind: "leader" | "affiliate" | "shipping" | "coupon"; text: string }[];
  tabs: { label: string; content: string }[];
  video?: string;
  videoPreview?: string;
  outfitImage?: string;
  related: ProductCardData[];
  recommendations: ProductCardData[];
  breadcrumbs: string[];
}

export const asset = (name: string) => `/images/produto/${name}-960.webp`;
export const money = (value: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

const description = [
  "O nosso sapatênis de couro foi desenvolvido para oferecer o equilíbrio perfeito entre elegância, conforto e versatilidade. Produzido com materiais de alta qualidade, é ideal para o dia a dia, combinando com diferentes ocasiões — do trabalho ao lazer.",
  "Confeccionado em couro legítimo, o sapatênis apresenta costuras bem-acabadas e detalhes discretos que valorizam seu visual. O solado emborrachado proporciona estabilidade ao caminhar, enquanto o interior macio oferece conforto durante a rotina, seja no trabalho, em passeios ou em momentos de lazer.",
];

export const demoProduct: ProductPageData = {
  id: "sapatenis-couro-marrom",
  demo: true,
  name: "Sapatênis de Couro Marrom",
  subtitle: "Marrom Casual",
  price: 189.90,
  installments: "em até 6x de R$ 31,65 sem juros",
  sku: "CC001234",
  rating: 4.9,
  stock: 10,
  summary: "Sapatênis casual em couro legítimo, moderno e confortável, ideal para o dia a dia. Possui solado emborrachado, forro macio e acabamento de alta qualidade, proporcionando durabilidade e estilo em qualquer ocasião.",
  description,
  images: [asset("principal"), ...[2, 3, 4, 5].map(i => asset(`galeria-${i}`))],
  editorial: [asset("editorial-frente"), asset("editorial-verso")],
  seller: { name: "KLÓBER", rating: 5, partner: false },
  conditions: [
    { kind: "leader", text: "Líder em Vendas" },
    { kind: "affiliate", text: "Produto Afiliado" },
    { kind: "shipping", text: "Frete Grátis" },
    { kind: "coupon", text: "Cupom 20% desconto" },
  ],
  tabs: [
    { label: "Ficha Técnica", content: `${description[0]} Seu design moderno garante um visual sofisticado, enquanto o acabamento reforçado proporciona maior durabilidade e bem-estar a cada passo.\n\n${description[1]}\n\nA tonalidade marrom facilita combinações com jeans, calças de sarja e peças casuais. Seu estilo versátil permite compor produções elegantes sem abrir mão da praticidade, tornando-o uma opção para diferentes ocasiões do dia a dia.` },
    { label: "Qualidade do Produto", content: "Couro legítimo com acabamento texturizado, costuras reforçadas e forro macio. O solado emborrachado proporciona estabilidade, enquanto os detalhes discretos valorizam o acabamento do sapatênis." },
    { label: "Benefícios do Produto", content: "Conforto para a rotina, versatilidade para combinar com diferentes peças e um visual que acompanha você do trabalho ao lazer. A tonalidade marrom combina com jeans e calças de sarja." },
    { label: "Uso & Cuidado", content: "Limpe com pano macio levemente umedecido e deixe secar à sombra. Evite imersão, máquina de lavar e exposição direta ao calor. Guarde o calçado em local seco e arejado." },
    { label: "Avaliação", content: "Nota ilustrativa de 4,9 de 5, reproduzida do layout de referência. Este produto de demonstração ainda não recebe avaliações de compradores." },
  ],
  videoPreview: asset("video-capa"),
  outfitImage: asset("look-principal"),
  related: [
    { id: "relogio", name: "Relógio de Couro", subtitle: "Marrom Clássico", price: 249.9, image: asset("relogio") },
    { id: "oculos", name: "Óculos de Sol", subtitle: "Marrom Premium", price: 149.9, image: asset("oculos") },
    { id: "jeans", name: "Calça Jeans", subtitle: "Azul Escuro Slim", price: 189.9, image: asset("jeans") },
  ],
  recommendations: [
    { id: "social", name: "Sapato Social de Couro", subtitle: "Marrom Clássico", price: 329.9, image: asset("recomendado-1") },
    { id: "mocassim", name: "Mocassim de Couro", subtitle: "Marrom Casual", price: 299.9, image: asset("recomendado-2") },
    { id: "slip-on", name: "Tênis Slip On", subtitle: "Preto Casual", price: 279.9, image: asset("recomendado-3") },
    { id: "clog", name: "Sandália Clog", subtitle: "Bege Casual", price: 199.9, image: asset("recomendado-4") },
  ],
  breadcrumbs: ["Calçados", "Tênis Casual"],
};

// Public buyer ratings, stock and commercial conditions have no trusted source
// in the current schema. Seller self-evaluation is deliberately not used here.
export function toProductPage(product: Product): ProductPageData {
  return {
    id: product.id, demo: false, name: product.nome, subtitle: product.modelo ?? "",
    price: product.preco, installments: product.precoParceladoTexto ?? "",
    sku: product.sku ?? "Não informado", rating: null, stock: null,
    summary: product.detalhes.conteudoAnuncio || product.descricao || "",
    description: product.descricao ? product.descricao.split(/\n\s*\n/) : [],
    images: product.imagens.filter(i => i.papel !== "corpo").map(i => i.url),
    editorial: product.midias.filter(i => i.papel === "corpo").map(i => i.url).slice(0, 2),
    seller: { name: product.detalhes.nomeLoja || "Loja do vendedor", rating: null, partner: false },
    conditions: [],
    tabs: [
      { label: "Ficha Técnica", content: product.fichaTecnica || "Ficha técnica ainda não informada pelo vendedor." },
      { label: "Qualidade do Produto", content: product.detalhes.qualidade || "Qualidade ainda não informada pelo vendedor." },
      { label: "Benefícios do Produto", content: product.beneficiosTexto || "Benefícios ainda não informados pelo vendedor." },
      { label: "Uso & Cuidado", content: product.modoUsoCuidados || "Orientações de uso ainda não informadas pelo vendedor." },
      { label: "Avaliação", content: "Este anúncio ainda não possui avaliações verificadas de compradores." },
    ],
    video: product.midias.find(i => i.papel === "video")?.url,
    related: [], recommendations: [], breadcrumbs: ["Produtos"],
  };
}
