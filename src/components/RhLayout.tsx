import { ReactNode } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { RhSidebar } from "./RhSidebar";
import headerBg from "@/assets/header-bg.png";

interface RhLayoutProps {
  children: ReactNode;
  title: string;
}

export function RhLayout({ children, title }: RhLayoutProps) {
  return (
    <div className="min-h-screen flex w-full">
      <RhSidebar />
      
      <div className="flex-1 flex flex-col">
        <header 
          className="text-white py-12 px-6 border-b border-border bg-cover bg-center bg-no-repeat relative"
          style={{ backgroundImage: `url(${headerBg})` }}
        >
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <SidebarTrigger className="text-white hover:text-white/80" />
            </div>
            <h1 className="text-4xl font-bold mb-2">Recursos Humanos</h1>
            <p className="text-white/90">
              Home / <span className="text-white font-semibold">Recursos Humanos</span>
            </p>
          </div>
        </header>
        
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6 text-foreground">{title}</h2>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
