// Compatibilidade: o estado de usuário/conta agora vem da sessão autenticada
// (AuthContext), não mais de uma seleção manual. Este hook é mantido para não
// exigir alterações nos componentes que já consomem `useUser()`.
import { useAuth } from "@/contexts/AuthContext";
import { ROLE_LABELS, TipoConta, TipoUsuario } from "@/types/auth";

export type { TipoUsuario, TipoConta } from "@/types/auth";

export function useUser() {
  const { user } = useAuth();

  const tipoUsuario: TipoUsuario = (user?.role as TipoUsuario) ?? "consumidor";
  const tipoConta: TipoConta = user?.tipoConta ?? "conta_unica";

  const getUserLabel = () => ROLE_LABELS[tipoUsuario];

  return { tipoUsuario, tipoConta, getUserLabel };
}
