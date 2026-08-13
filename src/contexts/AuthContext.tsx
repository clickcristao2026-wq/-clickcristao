import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase, createEphemeralClient } from "@/lib/supabaseClient";
import { ADMIN_ROLE, AuthUser, TipoConta, UserRole } from "@/types/auth";

export interface RegisterPayload {
  nomeCompleto: string;
  email: string;
  nomeUsuario: string;
  senha: string;
  role: UserRole;
  tipoConta: TipoConta;
}

interface AuthResult {
  ok: boolean;
  error?: string;
  user?: AuthUser;
  /** true quando a conta foi criada mas exige confirmação de e-mail antes de poder logar. */
  needsEmailConfirmation?: boolean;
}

// Formato da linha da tabela public.profiles (ver supabase/schema.sql).
interface ProfileRow {
  id: string;
  email: string;
  nome_completo: string;
  nome_usuario: string;
  role: UserRole;
  tipo_conta: TipoConta;
  created_at: string;
}

function mapProfile(row: ProfileRow): AuthUser {
  return {
    id: row.id,
    nomeCompleto: row.nome_completo,
    email: row.email,
    nomeUsuario: row.nome_usuario,
    role: row.role,
    tipoConta: row.tipo_conta,
    createdAt: row.created_at,
  };
}

function friendlyAuthError(message: string | undefined): string {
  if (!message) return "Não foi possível concluir a operação.";
  if (message.includes("Invalid login credentials")) return "E-mail/usuário ou senha inválidos.";
  if (message.includes("User already registered")) return "Já existe uma conta cadastrada com este e-mail.";
  if (message.includes("Password should be at least")) return "A senha precisa ter pelo menos 6 caracteres.";
  if (message.includes("Email not confirmed")) return "Confirme seu e-mail antes de entrar.";
  if (message.includes("Failed to fetch") || message.includes("NetworkError")) {
    return "Não foi possível conectar ao servidor. Verifique sua internet ou a configuração do Supabase.";
  }
  return message;
}

async function fetchProfile(userId: string): Promise<AuthUser | null> {
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
  if (error || !data) return null;
  return mapProfile(data as ProfileRow);
}

// Login aceita e-mail OU nome de usuário. Quando não é um e-mail, resolve o
// e-mail correspondente via RPC (get_email_by_username) antes de autenticar
// — o Supabase Auth só faz login por e-mail.
async function resolveEmail(identifier: string): Promise<string | null> {
  if (identifier.includes("@")) return identifier;
  const { data, error } = await supabase.rpc("get_email_by_username", { p_username: identifier });
  if (error) return null;
  return (data as string | null) ?? null;
}

async function isUsernameTaken(nomeUsuario: string): Promise<boolean> {
  const { data } = await supabase.rpc("get_email_by_username", { p_username: nomeUsuario });
  return Boolean(data);
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (identifier: string, senha: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
  /** Autocadastro: cria a conta e já efetua login (fluxo de /cadastro). */
  register: (payload: RegisterPayload) => Promise<AuthResult>;
  /** Criação de conta por um terceiro (ex.: RH cadastrando um cooperador) — não altera a sessão atual. */
  createManagedAccount: (payload: RegisterPayload) => Promise<AuthResult>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function validatePayload(payload: RegisterPayload): string | null {
  if (!payload.nomeCompleto || !payload.email || !payload.nomeUsuario || !payload.senha) {
    return "Preencha todos os campos obrigatórios.";
  }
  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!active) return;
      if (session?.user) {
        const profile = await fetchProfile(session.user.id);
        if (active) setUser(profile);
      }
      if (active) setIsLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const profile = await fetchProfile(session.user.id);
        setUser(profile);
      } else {
        setUser(null);
      }
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const login = async (identifier: string, senha: string): Promise<AuthResult> => {
    const email = await resolveEmail(identifier.trim());
    if (!email) return { ok: false, error: "E-mail/usuário ou senha inválidos." };

    const { data, error } = await supabase.auth.signInWithPassword({ email, password: senha });
    if (error || !data.user) {
      return { ok: false, error: friendlyAuthError(error?.message) };
    }

    const profile = await fetchProfile(data.user.id);
    if (!profile) {
      return { ok: false, error: "Login efetuado, mas o perfil da conta não foi encontrado." };
    }
    setUser(profile);
    return { ok: true, user: profile };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const register = async (payload: RegisterPayload): Promise<AuthResult> => {
    const validationError = validatePayload(payload);
    if (validationError) return { ok: false, error: validationError };

    if (await isUsernameTaken(payload.nomeUsuario)) {
      return { ok: false, error: "Este nome de usuário já está em uso." };
    }

    const { data, error } = await supabase.auth.signUp({
      email: payload.email,
      password: payload.senha,
      options: {
        data: {
          nome_completo: payload.nomeCompleto,
          nome_usuario: payload.nomeUsuario,
          // O trigger no banco (handle_new_user) ignora qualquer valor que não
          // seja um dos 4 tipos de usuário — "admin" nunca é aceito por aqui.
          role: payload.role,
          tipo_conta: payload.tipoConta,
        },
      },
    });

    if (error || !data.user) {
      return { ok: false, error: friendlyAuthError(error?.message) };
    }

    if (!data.session) {
      // Confirmação de e-mail está ativada no projeto Supabase: a conta foi
      // criada, mas só poderá logar depois de confirmar o e-mail.
      return { ok: true, needsEmailConfirmation: true };
    }

    const profile = await fetchProfile(data.user.id);
    setUser(profile);
    return { ok: true, user: profile ?? undefined };
  };

  const createManagedAccount = async (payload: RegisterPayload): Promise<AuthResult> => {
    const validationError = validatePayload(payload);
    if (validationError) return { ok: false, error: validationError };

    if (await isUsernameTaken(payload.nomeUsuario)) {
      return { ok: false, error: "Este nome de usuário já está em uso." };
    }

    // Cliente descartável: cria a conta sem substituir a sessão de quem está
    // logado agora (o admin que está cadastrando o cooperador).
    const ephemeral = createEphemeralClient();
    const { data, error } = await ephemeral.auth.signUp({
      email: payload.email,
      password: payload.senha,
      options: {
        data: {
          nome_completo: payload.nomeCompleto,
          nome_usuario: payload.nomeUsuario,
          role: payload.role === ADMIN_ROLE ? "consumidor" : payload.role,
          tipo_conta: payload.tipoConta,
        },
      },
    });

    if (error || !data.user) {
      return { ok: false, error: friendlyAuthError(error?.message) };
    }

    if (payload.role === ADMIN_ROLE) {
      // Promove a conta recém-criada a admin. A RLS só permite esse update
      // porque quem está executando (o cliente principal, autenticado) já é
      // um admin — ver policy "profiles_update_admin_any" no schema.sql.
      const { error: promoteError } = await supabase
        .from("profiles")
        .update({ role: ADMIN_ROLE })
        .eq("id", data.user.id);

      if (promoteError) {
        return {
          ok: false,
          error: `Conta criada, mas não foi possível conceder acesso de administrador: ${promoteError.message}`,
        };
      }
    }

    return { ok: true };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: user !== null,
        isLoading,
        login,
        logout,
        register,
        createManagedAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
