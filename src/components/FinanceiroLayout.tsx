import { ReactNode } from "react";
import FinanceiroSidebar from "./FinanceiroSidebar";
import { SidebarInset } from "@/components/ui/sidebar";

interface FinanceiroLayoutProps {
  children: ReactNode;
}

const FinanceiroLayout = ({ children }: FinanceiroLayoutProps) => {
  return (
    <div className="min-h-screen flex w-full bg-background">
      <FinanceiroSidebar />
      <SidebarInset className="flex-1">
        <main className="p-6">{children}</main>
      </SidebarInset>
    </div>
  );
};

export default FinanceiroLayout;
