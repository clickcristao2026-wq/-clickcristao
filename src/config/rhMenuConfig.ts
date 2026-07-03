import {
  Users,
  ShoppingBag,
  Store,
  Megaphone,
  UserCheck,
  Monitor,
  UsersRound,
  Briefcase,
  Bell,
  MessageSquare,
  LogOut,
  LucideIcon,
} from "lucide-react";

export interface RhMenuItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

export interface RhMenuSection {
  items: RhMenuItem[];
  separator?: boolean;
}

const rhMenu: RhMenuItem[] = [
  { title: "Cooperador", url: "/rh/cooperador", icon: Users },
  { title: "Consumidor", url: "/rh/consumidor", icon: ShoppingBag },
  { title: "Vendedor", url: "/rh/vendedor", icon: Store },
  { title: "Anunciante", url: "/rh/anunciante", icon: Megaphone },
  { title: "Afiliado", url: "/rh/afiliado", icon: UserCheck },
  { title: "Sistema", url: "/rh/sistema", icon: Monitor },
  { title: "Usuários", url: "/rh/usuarios", icon: UsersRound },
  { title: "Funcionários", url: "/rh/funcionarios", icon: Briefcase },
];

const exitItem: RhMenuItem = { title: "Sair", url: "/", icon: LogOut };

export function getRhMenu(): RhMenuSection[] {
  return [
    { items: rhMenu },
    { items: [exitItem], separator: true },
  ];
}
