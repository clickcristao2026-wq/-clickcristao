import type { ReactNode } from "react";
import icon from "@/assets/icons/logistica.png";
import { getLogisticaMenu } from "@/config/logisticaMenuConfig";
import { OperationalDashboard } from "./OperationalDashboard";

export function LogisticaLayout({ children, title }: { children: ReactNode; title: string }) {
  return (
    <OperationalDashboard name="Logística" icon={icon} iconColor="#F97316" sections={getLogisticaMenu()} title={title}>
      {children}
    </OperationalDashboard>
  );
}
