import { historicoInBox } from "./dashboardInbox";
import { categoriasFixas, categoriasVariaveis, transacaoParceiro } from "./dashboardTransactions";

export interface DadosMensais {
  vendaVariavel: number;
  vendaFixa: number;
  inbox: number;
  parceiro: number;
  destaques: number;
  multasRecuperadas: number;
  custos: number;
}

// Valores demonstrativos em centavos. Janeiro usa os mesmos registros de Transação e inBox.
export const dadosMensaisGerenciamento: Record<string, DadosMensais> = {
  janeiro: {
    vendaVariavel: categoriasVariaveis.reduce((total, item) => total + item.taxaPlataforma, 0),
    vendaFixa: categoriasFixas.reduce((total, item) => total + item.valorPlataforma, 0),
    parceiro: transacaoParceiro.taxaPlataforma,
    inbox: historicoInBox.reduce((total, item) => total + item.arrecadado, 0),
    destaques: 1154440,
    multasRecuperadas: 289000,
    custos: 2770000,
  },
  fevereiro: { vendaVariavel: 915000, vendaFixa: 2680000, inbox: 1820000, parceiro: 0, destaques: 1280000, multasRecuperadas: 320000, custos: 2950000 },
  março: { vendaVariavel: 1020000, vendaFixa: 2850000, inbox: 1980000, parceiro: 0, destaques: 1350000, multasRecuperadas: 350000, custos: 3120000 },
  abril: { vendaVariavel: 750000, vendaFixa: 2100000, inbox: 1450000, parceiro: 0, destaques: 980000, multasRecuperadas: 240000, custos: 2480000 },
  maio: { vendaVariavel: 1100000, vendaFixa: 3020000, inbox: 2100000, parceiro: 0, destaques: 1420000, multasRecuperadas: 380000, custos: 3350000 },
  junho: { vendaVariavel: 980000, vendaFixa: 2750000, inbox: 1850000, parceiro: 0, destaques: 1230000, multasRecuperadas: 310000, custos: 3020000 },
  julho: { vendaVariavel: 1250000, vendaFixa: 3300000, inbox: 2350000, parceiro: 0, destaques: 1580000, multasRecuperadas: 420000, custos: 3650000 },
  agosto: { vendaVariavel: 1320000, vendaFixa: 3550000, inbox: 2500000, parceiro: 0, destaques: 1680000, multasRecuperadas: 450000, custos: 3880000 },
  setembro: { vendaVariavel: 1150000, vendaFixa: 3100000, inbox: 2200000, parceiro: 0, destaques: 1480000, multasRecuperadas: 390000, custos: 3450000 },
  outubro: { vendaVariavel: 1420000, vendaFixa: 3800000, inbox: 2750000, parceiro: 0, destaques: 1850000, multasRecuperadas: 500000, custos: 4200000 },
  novembro: { vendaVariavel: 1500000, vendaFixa: 4000000, inbox: 2900000, parceiro: 0, destaques: 1950000, multasRecuperadas: 530000, custos: 4450000 },
  dezembro: { vendaVariavel: 1750000, vendaFixa: 4500000, inbox: 3350000, parceiro: 0, destaques: 2250000, multasRecuperadas: 620000, custos: 5000000 },
};

export const mesesDoAno = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

export const linhasReceita = [
  { key: "vendaVariavel", name: "Venda Variável", label: "Venda Variável (% plataforma)", color: "#3b82f6" },
  { key: "vendaFixa", name: "Venda Fixa (Anúncios)", label: "Venda Fixa (Anúncios)", color: "#10b981" },
  { key: "parceiro", name: "Parceiro Associado", label: "Valor Parceiro Associado", color: "#2035f2" },
  { key: "inbox", name: "inBox", label: "Valor inBox Arrecadado", color: "#f59e0b" },
  { key: "destaques", name: "Destaques", label: "Valor Destaques Realizados", color: "#8b5cf6" },
  { key: "multasRecuperadas", name: "Multas Recuperadas", label: "Valor Multas Recuperadas", color: "#ef4444" },
] as const;

export function calcularReceita(dados: DadosMensais): number {
  return linhasReceita.reduce((total, { key }) => total + dados[key], 0);
}

const moeda = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
export const formatarCentavos = (value: number) => moeda.format(value / 100);
