import {
  User,
  CreditCard,
  Shield,
  DollarSign,
  MapPin,
  ShoppingBag,
  FileText,
  Bell,
  LogOut,
  Gift,
  Package,
  Settings,
  Trash2,
  BarChart3,
  Megaphone,
  MessageSquare,
  LucideIcon,
} from "lucide-react";
import { TipoUsuario, TipoConta } from "@/contexts/UserContext";

export interface MenuItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

export interface MenuSection {
  items: MenuItem[];
  separator?: boolean;
}

// Menu items base por tipo de usuário
const consumidorMenu: MenuItem[] = [
  { title: "Meus Dados", url: "/account/dados", icon: User },
  { title: "Meus Cartões", url: "/account/cartoes", icon: CreditCard },
  { title: "Segurança", url: "/account/seguranca", icon: Shield },
  { title: "Financeiro", url: "/account/financeiro", icon: DollarSign },
  { title: "Benefícios", url: "/account/beneficios", icon: Gift },
  { title: "Mercadoria", url: "/account/mercadoria", icon: Package },
  { title: "Notificação", url: "/account/notificacao", icon: Bell },
  { title: "Histórico", url: "/account/historico", icon: FileText },
  { title: "Avaliação", url: "/account/avaliacao", icon: BarChart3 },
  { title: "Endereço", url: "/account/endereco", icon: MapPin },
  { title: "Compras", url: "/account/compras", icon: ShoppingBag },
  { title: "Contas", url: "/account/contas", icon: FileText },
  { title: "Avisos", url: "/account/avisos", icon: MessageSquare },
  { title: "Sair", url: "/", icon: LogOut },
];

const vendedorMenu: MenuItem[] = [
  { title: "Meus Dados", url: "/account/dados", icon: User },
  { title: "Segurança", url: "/account/seguranca", icon: Shield },
  { title: "Financeiro", url: "/account/financeiro-vendedor", icon: DollarSign },
  { title: "Faturamento", url: "/account/faturamento", icon: BarChart3 },
  { title: "Mercadoria", url: "/account/mercadoria-vendedor", icon: Package },
  { title: "Benefícios", url: "/account/beneficios-vendedor", icon: Gift },
  { title: "Notificação", url: "/account/notificacao", icon: Bell },
  { title: "Produtos", url: "/account/produtos", icon: ShoppingBag },
  { title: "Endereço", url: "/account/endereco", icon: MapPin },
  { title: "Contas", url: "/account/contas", icon: FileText },
  { title: "Avisos", url: "/account/avisos", icon: MessageSquare },
  { title: "Sair", url: "/", icon: LogOut },
];

const anuncianteMenu: MenuItem[] = [
  { title: "Meus Dados", url: "/account/dados", icon: User },
  { title: "Segurança", url: "/account/seguranca", icon: Shield },
  { title: "Mercadoria", url: "/account/mercadoria-anunciante", icon: Megaphone },
  { title: "Benefícios", url: "/account/beneficios-anunciante", icon: Gift },
  { title: "Notificação", url: "/account/notificacao", icon: Bell },
  { title: "Produtos", url: "/account/produtos", icon: ShoppingBag },
  { title: "Endereço", url: "/account/endereco", icon: MapPin },
  { title: "Contas", url: "/account/contas", icon: FileText },
  { title: "Avisos", url: "/account/avisos", icon: MessageSquare },
  { title: "Sair", url: "/", icon: LogOut },
];

const afiliadoMenu: MenuItem[] = [
  { title: "Meus Dados", url: "/account/dados", icon: User },
  { title: "Segurança", url: "/account/seguranca", icon: Shield },
  { title: "Financeiro", url: "/account/financeiro-vendedor", icon: DollarSign },
  { title: "Faturamento", url: "/account/faturamento", icon: BarChart3 },
  { title: "Notificação", url: "/account/notificacao", icon: Bell },
  { title: "Endereço", url: "/account/endereco", icon: MapPin },
  { title: "Contas", url: "/account/contas", icon: FileText },
  { title: "Avisos", url: "/account/avisos", icon: MessageSquare },
  { title: "Sair", url: "/", icon: LogOut },
];

// Items da seção secundária (abaixo do separador)
const configItem: MenuItem = { title: "Configuração", url: "/account/configuracao", icon: Settings };
const excluirContaItem: MenuItem = { title: "Excluir Conta", url: "/account/excluir-conta", icon: Trash2 };

export function getMenuForUser(tipoUsuario: TipoUsuario, tipoConta: TipoConta): MenuSection[] {
  let mainMenu: MenuItem[];
  
  switch (tipoUsuario) {
    case "vendedor":
      mainMenu = vendedorMenu;
      break;
    case "anunciante":
      mainMenu = anuncianteMenu;
      break;
    case "afiliado":
      mainMenu = afiliadoMenu;
      break;
    default:
      mainMenu = consumidorMenu;
  }

  // Seção secundária - varia conforme tipo de conta
  const secondaryItems: MenuItem[] = [];
  
  if (tipoConta === "conta_vinculada" || tipoConta === "conta_compartilhada") {
    secondaryItems.push(configItem);
  }
  
  secondaryItems.push(excluirContaItem);

  return [
    { items: mainMenu },
    { items: secondaryItems, separator: true },
  ];
}

// Labels para permissões baseado no tipo de usuário
export function getPermissionLabels(tipoUsuario: TipoUsuario): string[] {
  if (tipoUsuario === "afiliado") {
    return [
      "Realizar revendas",
      "Visualizar pedidos",
      "Cancelar pedidos",
      "Acessar dados financeiros",
      "Acessar notas fiscais",
      "Gerenciar endereços",
      "Gerenciar vinculantes",
      "Administrador total",
      "Apenas visualização",
    ];
  }

  if (tipoUsuario === "vendedor" || tipoUsuario === "anunciante") {
    return [
      "Visualizar pedidos",
      "Cancelar pedidos",
      "Acessar dados financeiros",
      "Acessar notas fiscais",
      "Gerenciar endereços",
      "Gerenciar vinculantes",
      "Administrador total",
      "Apenas visualização",
    ];
  }
  
  return [
    "Fazer compras",
    "Visualizar pedidos",
    "Cancelar pedidos",
    "Acessar dados financeiros",
    "Acessar notas fiscais",
    "Gerenciar endereços",
    "Gerenciar vinculantes",
    "Administrador total",
    "Apenas visualização",
  ];
}

// Motivos de exclusão de conta baseado no tipo de usuário
export function getExclusionReasons(tipoUsuario: TipoUsuario): string[] {
  if (tipoUsuario === "consumidor") {
    return [
      "Não encontrei os produtos que procurava",
      "Pouca variedade de produtos",
      "Pouca visibilidade das ofertas",
      "Plataforma difícil de usar",
      "Recursos insuficientes para minha experiência de compra",
      "Problemas técnicos e operacionais",
      "Suporte não atendeu minhas necessidades",
      "Regras e políticas da plataforma",
      "Problemas com pedidos ou entregas",
      "Prazos de entrega longos",
      "Recebi produtos com defeito ou diferentes do esperado",
      "Tive dificuldade com devoluções ou trocas",
      "Falta de confiança em alguns vendedores",
      "Estou reduzindo meus gastos",
      "Não tenho comprado pela internet ultimamente",
      "Falta de tempo para utilizar a plataforma",
      "Não estou mais utilizando o Click Cristão",
      "Não vejo necessidade em manter a conta ativa",
    ];
  }
  
  if (tipoUsuario === "afiliado") {
    return [
      "Atualmente poucas revendas",
      "Não tive visibilidade suficiente",
      "Plataforma difícil de usar",
      "Recursos insuficientes para revender",
      "Problemas técnicos e operacionais",
      "Suporte não atendeu minhas necessidades",
      "Regras e políticas da plataforma",
      "Problemas com logística ou envio",
      "Baixa rentabilidade financeira",
      "Mudança de atividade profissional",
      "Falta de tempo para realizar revendas",
      "Preocupação com privacidade",
    ];
  }
  
  // Vendedor e Anunciante
  return [
    "Atualmente poucas vendas",
    "Não tive visibilidade suficiente",
    "Plataforma difícil de usar",
    "Recursos insuficientes para vender",
    "Problemas técnicos e operacionais",
    "Suporte não atendeu minhas necessidades",
    "Regras e políticas da plataforma",
    "Problemas com logística ou envio",
    "Meu produto não se encaixa mais na plataforma",
    "Baixa rentabilidade financeira",
    "Mudança de atividade profissional",
    "Falta de tempo para realizar vendas",
    "Preocupação com privacidade",
  ];
}
