import {
  Users,
  Package,
  Megaphone,
  Store,
  ShoppingCart,
  Truck,
  Box,
  AlertTriangle,
  Ticket,
  Star,
  Sparkles,
  Phone,
  Bell,
  MessageSquare,
  LogOut,
  Tags,
  LucideIcon,
} from "lucide-react";

export interface AdminMenuItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

export interface AdminMenuSection {
  items: AdminMenuItem[];
  separator?: boolean;
}

const adminMenu: AdminMenuItem[] = [
  { title: "Cadastrados", url: "/admin/cadastrados", icon: Users },
  { title: "Registrados", url: "/admin/registrados", icon: Store },
  { title: "Produtos", url: "/admin/produtos", icon: Package },
  { title: "Categorias e Atributos", url: "/admin/catalogo", icon: Tags },
  { title: "Anúncios", url: "/admin/anuncios", icon: Megaphone },
  { title: "Minha Loja", url: "/admin/minha-loja", icon: Store },
  { title: "Vendidos", url: "/admin/vendidos", icon: ShoppingCart },
  { title: "Entregados", url: "/admin/entregados", icon: Truck },
  { title: "Mercadorias", url: "/admin/mercadorias", icon: Box },
  { title: "Penalidades", url: "/admin/penalidades", icon: AlertTriangle },
  { title: "Campanhas", url: "/admin/campanhas", icon: Ticket },
  { title: "Destaques", url: "/admin/destaques", icon: Star },
  { title: "Novidades", url: "/admin/novidades", icon: Sparkles },
  { title: "Contatos", url: "/admin/contatos", icon: Phone },
  { title: "Notificações", url: "/admin/notificacoes", icon: Bell },
  { title: "Avisos", url: "/admin/avisos", icon: MessageSquare },
];

const exitItem: AdminMenuItem = { title: "Sair", url: "/", icon: LogOut };

export function getAdminMenu(): AdminMenuSection[] {
  return [
    { items: adminMenu },
    { items: [exitItem], separator: true },
  ];
}
