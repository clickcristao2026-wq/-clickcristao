export const OPENAI_MODEL = "gpt-6-luna";
export type AgentKind =
  | "mercado"
  | "lucro"
  | "conteudo"
  | "comparacao"
  | "suporte"
  | "investigador";
export interface ProductPricing {
  custo: number;
  margem: number;
  modalidade: "normal" | "promocao";
  precoNormal: number;
  precoOriginal: number;
  precoPromocional: number;
  cupomAtivo: boolean;
  cupomNome: string;
  cupomPercentual: number;
  freteAtivo: boolean;
  freteCusto: number;
  freteGratis: boolean;
  afiliadoAtivo: boolean;
}
export const emptyPricing: ProductPricing = {
  custo: 0,
  margem: 0,
  modalidade: "normal",
  precoNormal: 0,
  precoOriginal: 0,
  precoPromocional: 0,
  cupomAtivo: false,
  cupomNome: "",
  cupomPercentual: 0,
  freteAtivo: false,
  freteCusto: 0,
  freteGratis: false,
  afiliadoAtivo: false,
};
export function money(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}
export function parseMoney(value: string): number {
  const normalized = value
    .trim()
    .replace(/R\$\s*/g, "")
    .replace(/\s/g, "");
  const number = Number(
    normalized.includes(",")
      ? normalized.replace(/\./g, "").replace(",", ".")
      : normalized,
  );
  return Number.isFinite(number) ? number : NaN;
}
export function calculatePricing(p: ProductPricing) {
  const base = money(p.custo + p.margem);
  const custoPlataforma = money(base * 0.03);
  const precoSugerido = money(base - custoPlataforma);
  const preco = money(
    p.modalidade === "promocao" ? p.precoPromocional : p.precoNormal,
  );
  const economia =
    p.modalidade === "promocao"
      ? money(p.precoOriginal - p.precoPromocional)
      : 0;
  const cupom = p.cupomAtivo ? money((preco * p.cupomPercentual) / 100) : 0;
  // O custo de envio é suportado pelo vendedor mesmo quando o comprador recebe frete grátis.
  const frete = p.freteAtivo ? money(p.freteCusto) : 0;
  const afiliado = p.afiliadoAtivo ? money(preco * 0.05) : 0;
  const faturamentoLiquido = money(preco - cupom - frete - afiliado);
  const lucroLiquido = money(faturamentoLiquido - p.custo);
  return {
    base,
    custoPlataforma,
    precoSugerido,
    preco,
    economia,
    cupom,
    frete,
    afiliado,
    faturamentoLiquido,
    lucroLiquido,
  };
}
export function validatePricing(p: ProductPricing): string | null {
  if (
    [p.cupomAtivo, p.freteAtivo, p.freteGratis, p.afiliadoAtivo].some(
      (v) => typeof v !== "boolean",
    ) ||
    typeof p.cupomNome !== "string"
  )
    return "Dados de precificação inválidos.";
  const values = [
    p.custo,
    p.margem,
    p.precoNormal,
    p.precoOriginal,
    p.precoPromocional,
    p.cupomPercentual,
    p.freteCusto,
  ];
  if (values.some((v) => !Number.isFinite(v) || v < 0 || v > 99999999.99))
    return "Preencha valores numéricos válidos e não negativos.";
  if (!["normal", "promocao"].includes(p.modalidade))
    return "Selecione uma modalidade de precificação.";
  if (calculatePricing(p).preco <= 0)
    return "Informe um preço do produto maior que zero.";
  if (p.modalidade === "promocao" && p.precoOriginal <= p.precoPromocional)
    return "O preço promocional deve ser menor que o preço original.";
  if (
    p.cupomAtivo &&
    (!p.cupomNome.trim() || p.cupomPercentual <= 0 || p.cupomPercentual > 100)
  )
    return "Informe o nome do cupom e um desconto entre 0 e 100%.";
  return null;
}
export const agentLabels: Record<AgentKind, string> = {
  mercado: "Análise de Mercado",
  lucro: "Análise de Lucro",
  conteudo: "Análise de Conteúdo",
  comparacao: "Comparação de Produtos",
  suporte: "Suporte ao Consumidor",
  investigador: "Investigador de Produtos",
};
export interface AIReport {
  resumo: string;
  pontosFortes: string[];
  melhorias: string[];
  alertas: string[];
  precoSugerido: number | null;
}
export interface AISource {
  title: string;
  url: string;
}
export interface AIRun {
  id: string;
  kind: AgentKind;
  report: AIReport;
  sources: AISource[];
  createdAt: string;
  model: string;
}
