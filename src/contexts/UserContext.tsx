import { createContext, useContext, useState, ReactNode } from "react";

export type TipoUsuario = "consumidor" | "vendedor" | "anunciante" | "afiliado";
export type TipoConta = "conta_unica" | "conta_vinculada" | "conta_compartilhada";

interface UserContextType {
  tipoUsuario: TipoUsuario;
  tipoConta: TipoConta;
  setTipoUsuario: (tipo: TipoUsuario) => void;
  setTipoConta: (tipo: TipoConta) => void;
  getUserLabel: () => string;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  // Default para consumidor conta única (para testes, depois virá do cadastro/auth)
  const [tipoUsuario, setTipoUsuario] = useState<TipoUsuario>("consumidor");
  const [tipoConta, setTipoConta] = useState<TipoConta>("conta_unica");

  const getUserLabel = () => {
    const labels: Record<TipoUsuario, string> = {
      consumidor: "Consumidor",
      vendedor: "Vendedor",
      anunciante: "Anunciante",
      afiliado: "Afiliado",
    };
    return labels[tipoUsuario];
  };

  return (
    <UserContext.Provider
      value={{
        tipoUsuario,
        tipoConta,
        setTipoUsuario,
        setTipoConta,
        getUserLabel,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
