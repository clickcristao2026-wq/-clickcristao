import type { ReactNode } from "react";
import icon from "@/assets/icons/financeiro.png";
import { financeiroMenuItems } from "@/config/financeiroMenuConfig";
import { OperationalDashboard } from "./OperationalDashboard";

export default function FinanceiroLayout({ children }: { children: ReactNode }) {
  return (
    <OperationalDashboard name="Financeiro" icon={icon} iconColor="#10B981" sections={[{ items: financeiroMenuItems.map(({ path, ...item }) => ({ ...item, url: path })) }]}>
      {children}
    </OperationalDashboard>
  );
}
