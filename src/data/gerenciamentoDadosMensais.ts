// Dados compartilhados entre Gerenciamento/Financeiro e Gerenciamento/Faturamento
// Fonte única de verdade para sincronização

export interface DadosMensais {
  vendaVariavel: number;
  vendaFixa: number;
  rifas: number;
  destaques: number;
  multasRecuperadas: number;
  custos: number;
}

export const dadosMensaisGerenciamento: Record<string, DadosMensais> = {
  janeiro: { vendaVariavel: 8800, vendaFixa: 24200, rifas: 16750, destaques: 11544.40, multasRecuperadas: 2890, custos: 27700 },
  fevereiro: { vendaVariavel: 9150, vendaFixa: 26800, rifas: 18200, destaques: 12800, multasRecuperadas: 3200, custos: 29500 },
  março: { vendaVariavel: 10200, vendaFixa: 28500, rifas: 19800, destaques: 13500, multasRecuperadas: 3500, custos: 31200 },
  abril: { vendaVariavel: 7500, vendaFixa: 21000, rifas: 14500, destaques: 9800, multasRecuperadas: 2400, custos: 24800 },
  maio: { vendaVariavel: 11000, vendaFixa: 30200, rifas: 21000, destaques: 14200, multasRecuperadas: 3800, custos: 33500 },
  junho: { vendaVariavel: 9800, vendaFixa: 27500, rifas: 18500, destaques: 12300, multasRecuperadas: 3100, custos: 30200 },
  julho: { vendaVariavel: 12500, vendaFixa: 33000, rifas: 23500, destaques: 15800, multasRecuperadas: 4200, custos: 36500 },
  agosto: { vendaVariavel: 13200, vendaFixa: 35500, rifas: 25000, destaques: 16800, multasRecuperadas: 4500, custos: 38800 },
  setembro: { vendaVariavel: 11500, vendaFixa: 31000, rifas: 22000, destaques: 14800, multasRecuperadas: 3900, custos: 34500 },
  outubro: { vendaVariavel: 14200, vendaFixa: 38000, rifas: 27500, destaques: 18500, multasRecuperadas: 5000, custos: 42000 },
  novembro: { vendaVariavel: 15000, vendaFixa: 40000, rifas: 29000, destaques: 19500, multasRecuperadas: 5300, custos: 44500 },
  dezembro: { vendaVariavel: 17500, vendaFixa: 45000, rifas: 33500, destaques: 22500, multasRecuperadas: 6200, custos: 50000 },
};

export const mesesDoAno = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

export function calcularReceita(dados: DadosMensais): number {
  return dados.vendaVariavel + dados.vendaFixa + dados.rifas + dados.destaques + dados.multasRecuperadas;
}
