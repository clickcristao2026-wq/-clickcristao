import { NavLink } from "@/components/NavLink";
import { ShoppingCart, Store, Megaphone, Users } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { useUser, TipoUsuario } from "@/contexts/UserContext";
import { getMenuForUser } from "@/config/menuConfig";

const userIcons: Record<TipoUsuario, React.ElementType> = {
  consumidor: ShoppingCart,
  vendedor: Store,
  anunciante: Megaphone,
  afiliado: Users,
};

export function AccountSidebar() {
  const { open } = useSidebar();
  const { tipoUsuario, tipoConta, getUserLabel } = useUser();
  
  const menuSections = getMenuForUser(tipoUsuario, tipoConta);
  const UserIcon = userIcons[tipoUsuario];

  return (
    <Sidebar className={open ? "w-64" : "w-20"} collapsible="icon">
      <SidebarContent className="bg-card border-r border-border">
        {/* Header com tipo de usuário */}
        <div className={`border-b border-border ${open ? 'p-6' : 'p-4'}`}>
          <div className="flex items-center justify-center gap-3">
            {!open ? (
              <div className="p-2 rounded-lg bg-primary/10">
                <UserIcon className="h-6 w-6 text-primary flex-shrink-0" />
              </div>
            ) : (
              <>
                <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                  <UserIcon className="h-6 w-6 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="font-semibold text-sm uppercase tracking-wide text-foreground">
                    Usuário
                  </h2>
                  <p className="text-sm text-muted-foreground">{getUserLabel()}</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Menu items */}
        {menuSections.map((section, sectionIndex) => (
          <SidebarGroup key={sectionIndex}>
            {section.separator && (
              <Separator className="my-2 bg-border" />
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors rounded-lg"
                        activeClassName="bg-primary/10 text-primary font-medium"
                      >
                        <item.icon className="h-5 w-5 flex-shrink-0" />
                        {open && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
