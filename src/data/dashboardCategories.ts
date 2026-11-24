import parceiro from "@/assets/icons/categorias/parceiro.png";
import kit from "@/assets/icons/categorias/outlet.png";
import digital from "@/assets/icons/categorias/digital.png";
import produto from "@/assets/icons/categorias/produto.png";
import feira from "@/assets/icons/categorias/feira.png";
import feiraGerenciamento from "@/assets/icons/categorias/loja.png";
import imobiliario from "@/assets/icons/categorias/imobiliario.png";
import maquinario from "@/assets/icons/categorias/maquinario.png";
import motocicleta from "@/assets/icons/categorias/motocicleta.png";
import transporte from "@/assets/icons/categorias/transporte.png";
import aeronave from "@/assets/icons/categorias/aeronave.png";
import nautico from "@/assets/icons/categorias/nautico.png";
import servico from "@/assets/icons/categorias/servico.png";
import lojasProdutos from "@/assets/icons/lojas-admin/produtos.png";
import lojasMotores from "@/assets/icons/lojas-admin/motores.png";
import lojasImobiliarias from "@/assets/icons/lojas-admin/imobiliarias.png";
import lojasServicos from "@/assets/icons/lojas-admin/corporativos.png";
import lojasFeiras from "@/assets/icons/lojas-admin/feiras.png";
import lojasOficiais from "@/assets/icons/lojas-admin/oficiais.png";

export interface DashboardCategory {
  id: string;
  nome: string;
  quantidade: number;
  icone: string;
  cor: string;
  corIcone?: string;
}

export const produtos: DashboardCategory[] = [
  { id: "outlet", nome: "Kit", quantidade: 128, icone: kit, cor: "#10B981" },
  { id: "digital", nome: "Digital", quantidade: 89, icone: digital, cor: "#F59E0B" },
  { id: "produto", nome: "Produto", quantidade: 567, icone: produto, cor: "#EF4444" },
  { id: "feira", nome: "Feira", quantidade: 89, icone: feira, cor: "#A855F7" },
];

export const produtosGerenciamento = produtos.map((category) =>
  category.id === "feira"
    ? { ...category, icone: feiraGerenciamento, cor: "#EC4899", corIcone: category.cor }
    : category,
);

export const anuncios: DashboardCategory[] = [
  { id: "bazar", nome: "Parceiro", quantidade: 245, icone: parceiro, cor: "#2035F2" },
  { id: "imobiliario", nome: "Imobiliário", quantidade: 34, icone: imobiliario, cor: "#8B5CF6" },
  { id: "maquinario", nome: "Maquinário", quantidade: 56, icone: maquinario, cor: "#EC4899" },
  { id: "motocicleta", nome: "Motocicleta", quantidade: 78, icone: motocicleta, cor: "#14B8A6" },
  { id: "transporte", nome: "Transporte", quantidade: 45, icone: transporte, cor: "#F97316" },
  { id: "aeronave", nome: "Aeronave", quantidade: 12, icone: aeronave, cor: "#6366F1" },
  { id: "nautico", nome: "Náutico", quantidade: 23, icone: nautico, cor: "#0EA5E9" },
  { id: "servico", nome: "Serviço", quantidade: 156, icone: servico, cor: "#84CC16" },
];

export const lojas: DashboardCategory[] = [
  { id: "produtos", nome: "Produtos", quantidade: 234, icone: lojasProdutos, cor: "#EF4444" },
  { id: "motores", nome: "Motores", quantidade: 87, icone: lojasMotores, cor: "#14B8A6" },
  { id: "imobiliarias", nome: "Imobiliárias", quantidade: 45, icone: lojasImobiliarias, cor: "#8B5CF6" },
  { id: "corporativos", nome: "Serviços", quantidade: 62, icone: lojasServicos, cor: "#F97316" },
  { id: "feiras", nome: "Feiras", quantidade: 38, icone: lojasFeiras, cor: "#EC4899" },
  { id: "oficiais", nome: "Oficiais", quantidade: 29, icone: lojasOficiais, cor: "#0EA5E9" },
];
