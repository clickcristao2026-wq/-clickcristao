import { createClient } from "npm:@supabase/supabase-js@2";

import { HttpError } from "./errors.ts";
export { HttpError } from "./errors.ts";
export function cors(req: Request) {
  const origin = req.headers.get("origin");
  const allowed = (
    Deno.env.get("APP_ALLOWED_ORIGINS") ??
    "http://localhost:8080,http://localhost:5173"
  )
    .split(",")
    .map((x) => x.trim());
  if (origin && !allowed.includes(origin))
    throw new HttpError(403, "Origem não autorizada.");
  return {
    "Access-Control-Allow-Origin": origin ?? allowed[0],
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    Vary: "Origin",
  };
}
export function json(req: Request, body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...cors(req),
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
}
export async function authenticate(req: Request) {
  if (req.method !== "POST") throw new HttpError(405, "Use POST.");
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer "))
    throw new HttpError(401, "Entre novamente na sua conta.");
  const url = Deno.env.get("SUPABASE_URL")!;
  const client = createClient(url, Deno.env.get("SUPABASE_ANON_KEY")!, {
    auth: { persistSession: false },
  });
  const { data, error } = await client.auth.getUser(auth.slice(7));
  if (error || !data.user)
    throw new HttpError(401, "Sessão inválida. Entre novamente.");
  const db = createClient(url, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
    auth: { persistSession: false },
  });
  return { userId: data.user.id, db };
}
export async function readBody(req: Request, maxBytes = 25000) {
  if (Number(req.headers.get("content-length")) > maxBytes)
    throw new HttpError(413, "Conteúdo muito grande.");
  // Limita o stream antes de construir JSON, inclusive para requisições sem Content-Length.
  const reader = req.body?.getReader();
  if (!reader) throw new HttpError(400, "Informe os dados da solicitação.");
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > maxBytes) {
      await reader.cancel();
      throw new HttpError(413, "Conteúdo muito grande.");
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  try {
    return JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    throw new HttpError(400, "JSON inválido.");
  }
}
export async function reserve(
  db: Awaited<ReturnType<typeof authenticate>>["db"],
  userId: string,
) {
  const { data, error } = await db.rpc("reserve_ai_request", {
    p_user_id: userId,
  });
  if (error)
    throw new HttpError(
      503,
      "Serviço de IA indisponível. Confira a instalação do banco.",
    );
  if (!data)
    throw new HttpError(
      429,
      "Limite de análises atingido. Aguarde antes de tentar novamente.",
    );
}
export function failure(req: Request, error: unknown) {
  const known = error instanceof HttpError;
  const status = known ? error.status : 500;
  const message = known
    ? error.message
    : "Não foi possível concluir a operação de IA. Tente novamente.";
  // Não registra payload, credenciais nem respostas do provedor.
  let headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Cache-Control": "no-store",
  };
  try {
    headers = { ...headers, ...cors(req) };
  } catch {
    /* origem rejeitada */
  }
  return new Response(JSON.stringify({ error: message }), { status, headers });
}
export const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
