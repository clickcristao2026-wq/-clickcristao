import type { ReactNode } from "react";
import icon from "@/assets/icons/gerenciamento.png";
import { getGerenciamentoMenu } from "@/config/gerenciamentoMenuConfig";
import { OperationalDashboard } from "./OperationalDashboard";

export function GerenciamentoLayout({ children, title }: { children: ReactNode; title: string }) {
  return (
    <OperationalDashboard name="Gerenciamento" icon={icon} iconColor="#14B8A6" sections={getGerenciamentoMenu()} title={title}>
      {children}
    </OperationalDashboard>
  );
}
