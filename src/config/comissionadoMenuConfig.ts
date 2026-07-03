import {
  Users,
  Wallet,
  DollarSign,
  Bell,
  MessageSquare,
} from "lucide-react";

export const comissionadoMenuItems = [
  { title: "Cadastrados", icon: Users, path: "/comissionado/cadastrados" },
  { title: "Financeiro", icon: Wallet, path: "/comissionado/financeiro" },
  { title: "Comissão", icon: DollarSign, path: "/comissionado/comissao" },
  { title: "Notificações", icon: Bell, path: "/comissionado/notificacoes" },
  { title: "Avisos", icon: MessageSquare, path: "/comissionado/avisos" },
];
