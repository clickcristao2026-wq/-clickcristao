import {
  authenticate,
  cors,
  failure,
  HttpError,
  json,
  readBody,
  reserve,
  uuidPattern,
} from "../_shared/http.ts";
import { decryptKey } from "../_shared/crypto.ts";
import { agentRequest, openaiFetch, parseResponse } from "../_shared/openai.ts";
import {
  agentLabels,
  calculatePricing,
  emptyPricing,
  OPENAI_MODEL,
  validatePricing,
  type AgentKind,
} from "../_shared/domain.ts";

export async function handler(req: Request): Promise<Response> {
  try {
    cors(req);
    if (req.method === "OPTIONS")
      return new Response(null, { headers: cors(req) });
    const { userId, db } = await authenticate(req);
    const body = await readBody(req, 8000000);
    const kind = body.kind as AgentKind;
    if (!Object.hasOwn(agentLabels, kind))
      throw new HttpError(400, "Agente inválido.");
    const question =
      typeof body.question === "string" ? body.question.trim() : "";
    if (question.length > 3000)
      throw new HttpError(400, "Use uma pergunta de até 3.000 caracteres.");
    const sellerAnalysis = ["mercado", "lucro", "conteudo"].includes(kind);
    if (body.productId && !uuidPattern.test(body.productId))
      throw new HttpError(400, "Produto inválido.");
    if (body.draftId && !uuidPattern.test(body.draftId))
      throw new HttpError(400, "Registro inválido.");
    if (sellerAnalysis) {
      const { data: profile } = await db
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .single();
      if (
        !profile ||
        !["vendedor", "anunciante", "admin"].includes(profile.role)
      )
        throw new HttpError(
          403,
          "Somente vendedores e anunciantes podem analisar seus anúncios.",
        );
      if (body.productId) {
        const { data } = await db
          .from("products")
          .select("id")
          .eq("id", body.productId)
          .eq("seller_id", userId)
          .maybeSingle();
        if (!data)
          throw new HttpError(403, "Você não tem acesso a esse produto.");
      }
    } else if (!question)
      throw new HttpError(400, "Descreva o que deseja consultar.");
    let snapshot: Record<string, unknown>;
    let images: string[] = [];
    if (sellerAnalysis) {
      snapshot = body.snapshot;
      if (
        !snapshot ||
        typeof snapshot !== "object" ||
        Array.isArray(snapshot) ||
        JSON.stringify(snapshot).length > 35000
      )
        throw new HttpError(
          400,
          "Dados de anúncio inválidos ou muito grandes.",
        );
      if (typeof snapshot.nome !== "string" || !snapshot.nome.trim())
        throw new HttpError(
          400,
          "Informe o nome do produto antes de analisar.",
        );
      const pricing = { ...emptyPricing, ...(snapshot.precificacao as object) };
      const pricingError = validatePricing(pricing);
      if (pricingError) throw new HttpError(400, pricingError);
      snapshot.resumoFinanceiro = calculatePricing(pricing);
      images =
        kind === "conteudo" && Array.isArray(body.images) ? body.images : [];
      if (
        images.length > 7 ||
        images.some(
          (x) =>
            typeof x !== "string" ||
            x.length > 1000000 ||
            !/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(x),
        )
      )
        throw new HttpError(400, "Imagens inválidas para análise.");
    } else {
      // Catálogo consultado com campos públicos, nunca perfis, pedidos ou dados financeiros.
      const stopWords = new Set([
        "para",
        "com",
        "sem",
        "uma",
        "uns",
        "das",
        "dos",
        "que",
        "qual",
        "quais",
        "como",
        "quero",
        "preciso",
        "melhor",
        "produto",
        "produtos",
        "compare",
        "comparar",
        "encontre",
        "comprar",
      ]);
      const terms = (question.toLowerCase().match(/[\p{L}\p{N}]{3,}/gu) ?? [])
        .filter((t: string) => !stopWords.has(t))
        .slice(0, 12);
      let catalogQuery = db
        .from("products")
        .select(
          "id,nome,modelo,preco,descricao,ficha_tecnica,beneficios_texto,detalhes",
        )
        .eq("status", "publicado")
        .order("created_at", { ascending: false })
        .limit(50);
      if (terms.length)
        catalogQuery = catalogQuery.textSearch(
          "search_document",
          terms.join(" OR "),
          { type: "websearch", config: "portuguese" },
        );
      const { data, error } = await catalogQuery;
      if (error)
        throw new HttpError(503, "Não foi possível consultar o catálogo.");
      const catalog = (data ?? []).map((p) => ({
        id: p.id,
        nome: p.nome,
        modelo: p.modelo,
        preco: p.preco,
        descricao: p.descricao?.slice(0, 1500),
        fichaTecnica: p.ficha_tecnica?.slice(0, 1500),
        beneficios: p.beneficios_texto?.slice(0, 1500),
        qualidade: p.detalhes?.qualidade,
        secao: p.detalhes?.secao,
        promocao: p.detalhes?.precificacao?.modalidade === "promocao",
        freteGratis: Boolean(
          p.detalhes?.precificacao?.freteAtivo &&
            p.detalhes?.precificacao?.freteGratis,
        ),
      }));
      const score = (p: (typeof catalog)[number]) =>
        terms.filter((t: string) =>
          `${p.nome} ${p.modelo ?? ""} ${p.descricao ?? ""}`
            .toLowerCase()
            .includes(t),
        ).length;
      const ranked = catalog.sort((a, b) => score(b) - score(a)).slice(0, 20);
      snapshot = {
        catalogo: ranked,
        cobertura:
          "Busca textual no catálogo publicado; até 50 correspondências recentes e 20 produtos apresentados por consulta. A seleção não representa uma avaliação de todo o catálogo.",
        guia: "Acesse Produtos para cadastrar anúncios; Minha Conta para dados e endereços; Inteligência Artificial para chave e consultas. Não há políticas operacionais ou dados de pedidos disponíveis nesta consulta.",
      };
    }
    const { data: credentials, error } = await db
      .from("ai_credentials")
      .select("encrypted_key")
      .eq("user_id", userId)
      .maybeSingle();
    if (error) throw new HttpError(503, "Integração de IA indisponível.");
    if (!credentials)
      throw new HttpError(
        400,
        "Configure sua chave OpenAI na área Inteligência Artificial.",
      );
    await reserve(db, userId);
    const key = await decryptKey(credentials.encrypted_key, userId);
    const response = await openaiFetch(
      "responses",
      key,
      agentRequest(kind, snapshot, question, images),
    );
    const result = parseResponse(response);
    if (kind === "mercado" && !result.sources.length)
      result.report.alertas.push(
        "A pesquisa não retornou fontes verificáveis. Considere a recomendação uma estimativa, sem comparação comprovada de concorrentes.",
      );
    const { data: run, error: insertError } = await db
      .from("ai_runs")
      .insert({
        user_id: userId,
        product_id: sellerAnalysis ? body.productId || null : null,
        draft_id: sellerAnalysis ? body.draftId || null : null,
        kind,
        model: OPENAI_MODEL,
        report: result.report,
        sources: result.sources,
        snapshot,
      })
      .select("id,kind,model,report,sources,created_at")
      .single();
    if (insertError || !run)
      throw new HttpError(
        500,
        "Análise concluída, mas o histórico não pôde ser salvo. Confira o banco antes de repetir.",
      );
    return json(req, { ...run, createdAt: run.created_at });
  } catch (error) {
    return failure(req, error);
  }
}
if (import.meta.main) Deno.serve(handler);
