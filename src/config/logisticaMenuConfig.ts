import {
  Package,
  Search,
  Truck,
  Timer,
  Bell,
  MessageSquare,
  LogOut,
  LucideIcon,
} from "lucide-react";

export interface LogisticaMenuItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

export interface LogisticaMenuSection {
  items: LogisticaMenuItem[];
  separator?: boolean;
}

const logisticaMenu: LogisticaMenuItem[] = [
  { title: "Pedidos", url: "/logistica/pedidos", icon: Package },
  { title: "Solicitados", url: "/logistica/solicitados", icon: Search },
  { title: "Entregas", url: "/logistica/entregas", icon: Truck },
  { title: "Temporizador", url: "/logistica/temporizador", icon: Timer },
  { title: "Click Transportes", url: "/logistica/transportes", icon: Truck },
  { title: "Notificações", url: "/logistica/notificacoes", icon: Bell },
  { title: "Avisos", url: "/logistica/avisos", icon: MessageSquare },
];

const exitItem: LogisticaMenuItem = { title: "Sair", url: "/", icon: LogOut };

export function getLogisticaMenu(): LogisticaMenuSection[] {
  return [
    { items: logisticaMenu },
    { items: [exitItem], separator: true },
  ];
}
