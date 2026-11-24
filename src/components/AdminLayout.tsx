import type { ReactNode } from "react";
import icon from "@/assets/icons/adm.png";
import { getAdminMenu } from "@/config/adminMenuConfig";
import { OperationalDashboard } from "./OperationalDashboard";

export function AdminLayout({ children, title }: { children: ReactNode; title: string }) {
  return (
    <OperationalDashboard name="Administrativo" icon={icon} iconColor="#EF4444" sections={getAdminMenu()} title={title}>
      {children}
    </OperationalDashboard>
  );
}
