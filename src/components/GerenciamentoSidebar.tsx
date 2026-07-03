import { useLocation, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { getGerenciamentoMenu } from "@/config/gerenciamentoMenuConfig";
import { BarChart3 } from "lucide-react";

export function GerenciamentoSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const menuSections = getGerenciamentoMenu();

  return (
    <Sidebar className="border-r border-border">
      <SidebarHeader className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">Gerenciamento</h2>
            <p className="text-xs text-muted-foreground">Painel de Gestão</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {menuSections.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            {section.separator && <SidebarSeparator className="my-2" />}
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {section.items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        onClick={() => navigate(item.url)}
                        isActive={location.pathname === item.url}
                        className="w-full justify-start gap-3"
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </div>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
