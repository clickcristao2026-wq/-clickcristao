import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { GerenciamentoSidebar } from "./GerenciamentoSidebar";

interface GerenciamentoLayoutProps {
  children: React.ReactNode;
  title: string;
}

export function GerenciamentoLayout({ children, title }: GerenciamentoLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <GerenciamentoSidebar />
        <main className="flex-1 flex flex-col">
          <header className="h-14 border-b border-border flex items-center px-4 gap-4">
            <SidebarTrigger />
            <h1 className="text-lg font-semibold text-foreground">{title}</h1>
          </header>
          <div className="flex-1 p-6 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
