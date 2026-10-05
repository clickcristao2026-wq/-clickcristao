import { supabase } from "@/lib/supabaseClient";
import type { ProductImage, ProductMediaUpload } from "@/types/product";
export {
  OPENAI_MODEL,
  agentLabels,
} from "../../supabase/functions/_shared/domain";
export type {
  AgentKind,
  AIReport,
  AISource,
  AIRun,
} from "../../supabase/functions/_shared/domain";
import type { AgentKind, AIRun } from "../../supabase/functions/_shared/domain";

export interface AISettings {
  configured: boolean;
  suffix?: string;
  updatedAt?: string;
  model: string;
}
async function invoke<T>(name: string, body: unknown): Promise<T> {
  const { data, error } = await supabase.functions.invoke(name, { body });
  if (error) {
    let message =
      "Não foi possível acessar a integração de IA. Confira se as funções do Supabase estão instaladas.";
    try {
      if (error.context instanceof Response) {
        const result = await error.context.json();
        if (typeof result.error === "string") message = result.error;
      }
    } catch {
      /* mantém a mensagem amigável */
    }
    throw new Error(message);
  }
  return data as T;
}
export const getAISettings = () =>
  invoke<AISettings>("ai-settings", { action: "status" });
export const saveAIKey = (apiKey: string) =>
  invoke<AISettings>("ai-settings", { action: "save", apiKey });
export const removeAIKey = () =>
  invoke<AISettings>("ai-settings", { action: "remove" });
export const runAgent = (body: {
  kind: AgentKind;
  question?: string;
  snapshot?: unknown;
  productId?: string;
  draftId?: string;
  images?: string[];
}) => invoke<AIRun>("ai-agent", body);

export async function fetchAIHistory(
  filter: {
    productId?: string;
    draftId?: string;
    kind?: AgentKind;
    portal?: boolean;
  } = {},
): Promise<AIRun[]> {
  let query = supabase
    .from("ai_runs")
    .select("id,kind,model,report,sources,created_at")
    .order("created_at", { ascending: false })
    .limit(50);
  if (filter.productId) query = query.eq("product_id", filter.productId);
  else if (filter.draftId) query = query.eq("draft_id", filter.draftId);
  if (filter.portal) query = query.is("product_id", null).is("draft_id", null);
  if (filter.kind) query = query.eq("kind", filter.kind);
  const { data, error } = await query;
  if (error)
    throw new Error(
      "Não foi possível carregar o histórico. Confira a instalação da integração de IA.",
    );
  return (data ?? []).map((row) => ({
    ...row,
    createdAt: row.created_at,
  })) as AIRun[];
}
export async function attachDraftHistory(draftId: string, productId: string) {
  const { error } = await supabase.rpc("attach_ai_draft", {
    p_draft_id: draftId,
    p_product_id: productId,
  });
  if (error)
    throw new Error(
      "O produto foi salvo, mas as análises ainda não foram vinculadas. Elas continuam disponíveis no histórico da IA.",
    );
}

async function imageDataUrl(file: Blob): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const ratio = Math.min(1, 1024 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * ratio));
  canvas.height = Math.max(1, Math.round(bitmap.height * ratio));
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    throw new Error("Não foi possível preparar as imagens para análise.");
  }
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const data = canvas.toDataURL("image/jpeg", 0.7);
  if (data.length > 1000000)
    throw new Error(
      "Uma imagem excedeu o limite de análise. Reduza sua resolução.",
    );
  return data;
}
export async function prepareAnalysisImages(
  existing: ProductImage[],
  uploads: ProductMediaUpload[],
): Promise<string[]> {
  const files = uploads.filter((x) => x.papel !== "video").map((x) => x.file);
  const saved = existing.filter((x) => x.papel !== "video");
  const blobs = await Promise.all(
    saved.map(async (image) => {
      const response = await fetch(image.url, {
        signal: AbortSignal.timeout(20000),
      });
      if (!response.ok)
        throw new Error(
          "Não foi possível carregar uma foto salva para análise.",
        );
      return response.blob();
    }),
  );
  return Promise.all([...blobs, ...files].slice(0, 7).map(imageDataUrl));
}
