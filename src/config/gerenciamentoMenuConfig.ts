import {
  Package,
  Megaphone,
  Wallet,
  TrendingUp,
  Store,
  LogOut,
  LucideIcon,
} from "lucide-react";

export interface GerenciamentoMenuItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

export interface GerenciamentoMenuSection {
  items: GerenciamentoMenuItem[];
  separator?: boolean;
}

const gerenciamentoMenu: GerenciamentoMenuItem[] = [
  { title: "Lojas", url: "/gerenciamento/lojas", icon: Store },
  { title: "Produtos", url: "/gerenciamento/produtos", icon: Package },
  { title: "Anúncios", url: "/gerenciamento/anuncios", icon: Megaphone },
  { title: "Financeiro", url: "/gerenciamento/financeiro", icon: Wallet },
  { title: "Faturamento", url: "/gerenciamento/faturamento", icon: TrendingUp },
];

const exitItem: GerenciamentoMenuItem = { title: "Sair", url: "/", icon: LogOut };

export function getGerenciamentoMenu(): GerenciamentoMenuSection[] {
  return [
    { items: gerenciamentoMenu },
    { items: [exitItem], separator: true },
  ];
}
