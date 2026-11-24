import type { ReactNode } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { LogOut, type LucideIcon } from "lucide-react";
import dashboardHeader from "@/assets/dashboard-header.png";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardIcon } from "./DashboardIcon";
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent,
  SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

interface MenuSection {
  items: ReadonlyArray<{ title: string; url: string; icon: LucideIcon }>;
}

interface OperationalDashboardProps {
  name: string;
  icon: string;
  iconColor: string;
  sections: ReadonlyArray<MenuSection>;
  title?: string;
  children: ReactNode;
}

const menuItemClass = "h-auto min-h-10 rounded-lg px-3 text-muted-foreground hover:bg-[#EDEEFE] hover:text-[#2035F2] focus-visible:ring-[#2035F2] aria-[current=page]:bg-[#EDEEFE] aria-[current=page]:font-semibold aria-[current=page]:text-[#2035F2]";

export function OperationalDashboard({ name, icon, iconColor, sections, title, children }: OperationalDashboardProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { isMobile, setOpenMobile } = useSidebar();

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar className="border-r border-border" collapsible="icon">
        <SidebarHeader className="border-b border-border p-4 group-data-[collapsible=icon]:p-1">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#EBF2FE]">
              <DashboardIcon src={icon} color={iconColor} className="h-6 w-6" />
            </div>
            <div className="min-w-0 group-data-[collapsible=icon]:hidden">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Painel</p>
              <p className="truncate text-sm font-semibold">{name}</p>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <nav aria-label={name}>
            {sections.filter((section) => section.items.some((item) => item.title !== "Sair")).map((section, index) => (
              <SidebarGroup key={index}>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {section.items.filter((item) => item.title !== "Sair").map(({ title: label, url, icon: Icon }) => (
                      <SidebarMenuItem key={url}>
                        <SidebarMenuButton asChild tooltip={label} className={menuItemClass}>
                          <NavLink to={url} end aria-label={label} onClick={() => isMobile && setOpenMobile(false)}>
                            <Icon aria-hidden="true" />
                            <span>{label}</span>
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
          </nav>
        </SidebarContent>
        <SidebarFooter className="border-t border-border">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="Sair"
                aria-label="Sair"
                className={menuItemClass}
                onClick={async () => {
                  await logout();
                  navigate("/login");
                }}
              >
                <LogOut aria-hidden="true" />
                <span>Sair</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <div className="flex min-w-0 flex-1 flex-col">
        <header
          className="border-b border-border bg-[#2035F2] bg-cover bg-center px-4 py-7 text-white sm:px-6 sm:py-10"
          style={{ backgroundImage: `url(${dashboardHeader})` }}
        >
          <div className="mx-auto max-w-7xl">
            <SidebarTrigger aria-label="Alternar menu lateral" className="mb-3 text-white hover:bg-white/20 hover:text-white focus-visible:ring-white" />
            <h1 className="mb-2 text-3xl font-bold sm:text-4xl">{name}</h1>
            <nav aria-label="Navegação estrutural" className="text-sm font-semibold sm:text-base">
              <Link to="/dashboards" className="rounded-sm underline-offset-4 hover:text-white hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-white">
                Home
              </Link>
              <span aria-hidden="true"> / </span>
              <span>{name}</span>
            </nav>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6">
          <div className="mx-auto max-w-7xl">
            {title && <h2 className="mb-6 text-2xl font-semibold">{title}</h2>}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
