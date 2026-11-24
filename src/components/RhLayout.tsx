import type { ReactNode } from "react";
import icon from "@/assets/icons/rh.png";
import { getRhMenu } from "@/config/rhMenuConfig";
import { OperationalDashboard } from "./OperationalDashboard";

export function RhLayout({ children, title }: { children: ReactNode; title: string }) {
  return (
    <OperationalDashboard name="Recursos Humanos" icon={icon} iconColor="#3C83F6" sections={getRhMenu()} title={title}>
      {children}
    </OperationalDashboard>
  );
}
