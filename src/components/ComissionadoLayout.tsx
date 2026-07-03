import { ReactNode } from "react";
import ComissionadoSidebar from "./ComissionadoSidebar";
import { SidebarInset } from "@/components/ui/sidebar";

interface ComissionadoLayoutProps {
  children: ReactNode;
}

const ComissionadoLayout = ({ children }: ComissionadoLayoutProps) => {
  return (
    <div className="min-h-screen flex w-full bg-background">
      <ComissionadoSidebar />
      <SidebarInset className="flex-1">
        <main className="p-6">{children}</main>
      </SidebarInset>
    </div>
  );
};

export default ComissionadoLayout;
