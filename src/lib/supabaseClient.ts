import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  console.error(
    "Supabase não configurado: defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY " +
      "(arquivo .env local, ou nas variáveis de ambiente do projeto na Vercel)."
  );
}

// Cliente principal — mantém a sessão do usuário logado (persistida em localStorage).
export const supabase = createClient(supabaseUrl || "https://placeholder.supabase.co", supabaseAnonKey || "placeholder", {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Cliente descartável, sem sessão persistida — usado para criar contas de
// terceiros (ex.: um admin cadastrando um cooperador) sem substituir a
// sessão de quem está logado no momento.
export function createEphemeralClient() {
  return createClient(supabaseUrl || "https://placeholder.supabase.co", supabaseAnonKey || "placeholder", {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}
