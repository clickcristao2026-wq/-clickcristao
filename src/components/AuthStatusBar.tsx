import { useNavigate } from "react-router-dom";
import { LayoutGrid, LogOut, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { ROLE_LABELS } from "@/types/auth";

// Barra fixa exibida em todos os painéis internos enquanto houver uma sessão
// ativa, independente do layout/sidebar de cada módulo (eles não são
// consistentes entre si). Mostra quem está logado e permite sair de qualquer tela.
export function AuthStatusBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="fixed top-2 right-2 z-50 flex items-center gap-2 rounded-full bg-card/95 border border-border shadow-md pl-3 pr-1.5 py-1.5 backdrop-blur">
      <UserCircle className="h-4 w-4 text-primary flex-shrink-0" />
      <div className="text-xs leading-tight hidden sm:block">
        <p className="font-medium text-foreground truncate max-w-[160px]">{user.nomeCompleto}</p>
        <p className="text-muted-foreground">{ROLE_LABELS[user.role]}</p>
      </div>
      {user.role === "admin" && (
        <Button
          size="sm"
          variant="ghost"
          className="h-7 gap-1 px-2 text-xs text-muted-foreground hover:text-primary"
          onClick={() => navigate("/dashboards")}
        >
          <LayoutGrid className="h-3.5 w-3.5" />
          Painéis
        </Button>
      )}
      <Button
        size="sm"
        variant="ghost"
        className="h-7 gap-1 px-2 text-xs text-muted-foreground hover:text-destructive"
        onClick={handleLogout}
      >
        <LogOut className="h-3.5 w-3.5" />
        Sair
      </Button>
    </div>
  );
}
