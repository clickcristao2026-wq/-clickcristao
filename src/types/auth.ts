// Tipos centrais de autenticação e papéis de usuário da plataforma.
// Usados tanto pela camada de persistência mock (localStorage) quanto,
// futuramente, pela integração com o backend/banco de dados real.

// Os únicos tipos de conta "de fora" são estes 4. Qualquer outra pessoa
// que precise acessar o sistema (RH, financeiro, logística, comissionado,
// gerenciamento, administração geral) é uma conta "admin" — com acesso a
// todos os painéis internos.
export type TipoUsuario = "consumidor" | "vendedor" | "anunciante" | "afiliado";
export type UserRole = TipoUsuario | "admin";

export type TipoConta = "conta_unica" | "conta_vinculada" | "conta_compartilhada";

export const TIPOS_USUARIO: TipoUsuario[] = ["consumidor", "vendedor", "anunciante", "afiliado"];
export const ADMIN_ROLE: UserRole = "admin";

// Setor/departamento é apenas informação descritiva do cooperador (usada no
// cadastro feito pelo RH) — não define nível de acesso, já que todo
// cooperador cadastrado vira uma conta "admin" com acesso a tudo.
export const SETORES_COOPERADOR = [
  "RH",
  "ADM",
  "Logística",
  "Financeiro",
  "Comissionado",
  "Gerenciamento",
] as const;
export type SetorCooperador = (typeof SETORES_COOPERADOR)[number];

export function isTipoUsuario(role: UserRole): role is TipoUsuario {
  return (TIPOS_USUARIO as string[]).includes(role);
}

// Conta registrada na plataforma (usuário final ou cooperador/admin interno).
// A senha nunca é lida de volta do backend — a autenticação é feita pelo
// Supabase Auth, que guarda apenas o hash.
export interface AuthUser {
  id: string;
  nomeCompleto: string;
  email: string;
  nomeUsuario: string;
  role: UserRole;
  tipoConta: TipoConta;
  createdAt: string;
}

// Rota inicial (painel) para onde cada tipo de conta é redirecionado após o login.
export const ROLE_HOME_ROUTE: Record<UserRole, string> = {
  consumidor: "/account/dados",
  vendedor: "/account/dados",
  anunciante: "/account/dados",
  afiliado: "/account/dados",
  admin: "/dashboards",
};

export const ROLE_LABELS: Record<UserRole, string> = {
  consumidor: "Consumidor",
  vendedor: "Vendedor",
  anunciante: "Anunciante",
  afiliado: "Afiliado",
  admin: "Administrador",
};
