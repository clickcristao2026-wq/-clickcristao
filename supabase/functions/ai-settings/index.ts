import {
  authenticate,
  cors,
  failure,
  HttpError,
  json,
  readBody,
  reserve,
} from "../_shared/http.ts";
import { encryptKey } from "../_shared/crypto.ts";
import { openaiFetch } from "../_shared/openai.ts";
import { OPENAI_MODEL } from "../_shared/domain.ts";

export async function handler(req: Request): Promise<Response> {
  try {
    cors(req);
    if (req.method === "OPTIONS")
      return new Response(null, { headers: cors(req) });
    const { userId, db } = await authenticate(req);
    const { action, apiKey } = await readBody(req);
    if (action === "status") {
      const { data, error } = await db
        .from("ai_credentials")
        .select("key_suffix,updated_at")
        .eq("user_id", userId)
        .maybeSingle();
      if (error)
        throw new HttpError(
          503,
          "Integração indisponível. Confira a instalação do banco e das funções.",
        );
      return json(req, {
        configured: Boolean(data),
        suffix: data?.key_suffix,
        updatedAt: data?.updated_at,
        model: OPENAI_MODEL,
      });
    }
    if (action === "remove") {
      const { error } = await db
        .from("ai_credentials")
        .delete()
        .eq("user_id", userId);
      if (error) throw new HttpError(500, "Não foi possível remover a chave.");
      return json(req, { configured: false, model: OPENAI_MODEL });
    }
    if (
      action !== "save" ||
      typeof apiKey !== "string" ||
      !/^sk-[A-Za-z0-9_-]{16,500}$/.test(apiKey.trim())
    )
      throw new HttpError(
        400,
        "Informe uma chave API OpenAI válida (iniciada por sk-).",
      );
    await reserve(db, userId);
    const key = apiKey.trim();
    const encrypted = await encryptKey(key, userId);
    await openaiFetch(`models/${OPENAI_MODEL}`, key);
    const { error } = await db
      .from("ai_credentials")
      .upsert({
        user_id: userId,
        encrypted_key: encrypted,
        key_suffix: key.slice(-4),
        updated_at: new Date().toISOString(),
      });
    if (error) throw new HttpError(500, "Não foi possível guardar a chave.");
    return json(req, {
      configured: true,
      suffix: key.slice(-4),
      model: OPENAI_MODEL,
    });
  } catch (error) {
    return failure(req, error);
  }
}
if (import.meta.main) Deno.serve(handler);
