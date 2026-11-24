export const transacaoParceiro = { id: "bazar", nome: "Parceiro", vendas: 145, fechamento: "30/01/2025", valorVendas: 1250000, taxaPlataforma: 125000 };

export const categoriasVariaveis = [
  { id: "outlet", nome: "Kit", vendas: 89, fechamento: "30/01/2025", valorVendas: 890000, taxaPlataforma: 89000 },
  { id: "digital", nome: "Digital", vendas: 234, fechamento: "30/01/2025", valorVendas: 1560000, taxaPlataforma: 156000 },
  { id: "produto", nome: "Produto", vendas: 312, fechamento: "30/01/2025", valorVendas: 4580000, taxaPlataforma: 458000 },
  { id: "feira", nome: "Feira", vendas: 67, fechamento: "30/01/2025", valorVendas: 520000, taxaPlataforma: 52000 },
];

export const categoriasFixas = [
  { id: "imobiliario", nome: "Imobiliário", faturamento: 12, fechamento: "30/01/2025", valorPlataforma: 360000 },
  { id: "maquinario", nome: "Maquinário", faturamento: 8, fechamento: "30/01/2025", valorPlataforma: 240000 },
  { id: "motocicleta", nome: "Motocicleta", faturamento: 45, fechamento: "30/01/2025", valorPlataforma: 450000 },
  { id: "transporte", nome: "Transporte", faturamento: 23, fechamento: "30/01/2025", valorPlataforma: 230000 },
  { id: "aeronave", nome: "Aeronave", faturamento: 3, fechamento: "30/01/2025", valorPlataforma: 150000 },
  { id: "nautico", nome: "Náutico", faturamento: 7, fechamento: "30/01/2025", valorPlataforma: 210000 },
  { id: "servico", nome: "Serviço", faturamento: 156, fechamento: "30/01/2025", valorPlataforma: 780000 },
];

export const historicosPorCategoria: Record<string, Array<{ id: string; produto: string; data: string; valor: string; taxa: string; status: string }>> = {
  feira: [
    { id: "TRX040", produto: "Artesanato Regional", data: "15/01/2025", valor: "R$ 65,00", taxa: "R$ 6,50", status: "Concluído" },
    { id: "TRX041", produto: "Produto de Feira Livre", data: "14/01/2025", valor: "R$ 42,00", taxa: "R$ 4,20", status: "Concluído" },
  ],
  bazar: [
    { id: "TRX001", produto: "Camiseta Gospel", data: "15/01/2025", valor: "R$ 79,90", taxa: "R$ 7,99", status: "Concluído" },
    { id: "TRX002", produto: "Caneca Cristã", data: "14/01/2025", valor: "R$ 35,00", taxa: "R$ 3,50", status: "Concluído" },
    { id: "TRX003", produto: "Adesivo Religioso", data: "13/01/2025", valor: "R$ 12,00", taxa: "R$ 1,20", status: "Pendente" },
  ],
  outlet: [
    { id: "TRX010", produto: "Livro Devocional (Outlet)", data: "15/01/2025", valor: "R$ 25,00", taxa: "R$ 2,50", status: "Concluído" },
    { id: "TRX011", produto: "CD Gospel Antigo", data: "14/01/2025", valor: "R$ 15,00", taxa: "R$ 1,50", status: "Concluído" },
  ],
  digital: [
    { id: "TRX020", produto: "E-book Bíblia Comentada", data: "15/01/2025", valor: "R$ 49,90", taxa: "R$ 4,99", status: "Concluído" },
    { id: "TRX021", produto: "Curso Online Teologia", data: "14/01/2025", valor: "R$ 199,00", taxa: "R$ 19,90", status: "Concluído" },
    { id: "TRX022", produto: "Música Digital Gospel", data: "13/01/2025", valor: "R$ 9,90", taxa: "R$ 0,99", status: "Pendente" },
  ],
  produto: [
    { id: "TRX030", produto: "Bíblia Sagrada NVI", data: "15/01/2025", valor: "R$ 89,90", taxa: "R$ 8,99", status: "Concluído" },
    { id: "TRX031", produto: "Kit Artigos Religiosos", data: "14/01/2025", valor: "R$ 150,00", taxa: "R$ 15,00", status: "Concluído" },
    { id: "TRX032", produto: "Quadro Decorativo", data: "13/01/2025", valor: "R$ 120,00", taxa: "R$ 12,00", status: "Pendente" },
  ],
};
