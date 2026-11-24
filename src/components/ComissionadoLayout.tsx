import type { ReactNode } from "react";
import icon from "@/assets/icons/comissionado.png";
import { comissionadoMenuItems } from "@/config/comissionadoMenuConfig";
import { OperationalDashboard } from "./OperationalDashboard";

export default function ComissionadoLayout({ children }: { children: ReactNode }) {
  return (
    <OperationalDashboard name="Comissionado" icon={icon} iconColor="#8B5CF6" sections={[{ items: comissionadoMenuItems.map(({ path, ...item }) => ({ ...item, url: path })) }]}>
      {children}
    </OperationalDashboard>
  );
}
