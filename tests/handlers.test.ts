// @vitest-environment node
import { beforeEach, afterEach, describe, it, expect, vi } from "vitest";
import { handler as settingsHandler } from "../supabase/functions/ai-settings/index";
import { handler as agentHandler } from "../supabase/functions/ai-agent/index";
import { emptyPricing } from "../supabase/functions/_shared/domain";
const mocks = vi.hoisted(() => ({
  getUser: vi.fn(),
  from: vi.fn(),
  rpc: vi.fn(),
  encrypt: vi.fn(),
  decrypt: vi.fn(),
  api: vi.fn(),
}));
vi.mock("@supabase/supabase-js", () => ({
  createClient: () => ({
    auth: { getUser: mocks.getUser },
    from: mocks.from,
    rpc: mocks.rpc,
  }),
}));
vi.mock("../supabase/functions/_shared/crypto", () => ({
  encryptKey: mocks.encrypt,
  decryptKey: mocks.decrypt,
}));
vi.mock("../supabase/functions/_shared/openai", async (importOriginal) => ({
  ...(await importOriginal<object>()),
  openaiFetch: mocks.api,
}));
const userId = "11111111-1111-4111-8111-111111111111";
const draftId = "22222222-2222-4222-8222-222222222222";
const report = {
  resumo: "Análise",
  pontosFortes: [],
  melhorias: [],
  alertas: [],
  precoSugerido: 150,
};
const request = (
  body: unknown,
  origin = "http://localhost:8080",
  auth = "Bearer test-session",
) =>
  new Request("https://test.supabase.co/functions/v1/ai", {
    method: "POST",
    headers: {
      origin,
      authorization: auth,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
const chain = (result: object) => {
  const builder = {
    select: vi.fn(),
    eq: vi.fn(),
    maybeSingle: vi.fn(),
    single: vi.fn(),
    insert: vi.fn(),
    upsert: vi.fn(),
    delete: vi.fn(),
    order: vi.fn(),
    limit: vi.fn(),
    textSearch: vi.fn(),
    then: (resolve: (v: object) => void, reject: (e: unknown) => void) =>
      Promise.resolve(result).then(resolve, reject),
  };
  for (const name of [
    "select",
    "eq",
    "insert",
    "upsert",
    "delete",
    "order",
    "limit",
    "textSearch",
  ] as const)
    builder[name].mockReturnValue(builder);
  builder.maybeSingle.mockResolvedValue(result);
  builder.single.mockResolvedValue(result);
  return builder;
};
beforeEach(() => {
  vi.clearAllMocks();
  vi.stubGlobal("Deno", {
    env: {
      get: (name: string) =>
        ({
          SUPABASE_URL: "https://test.supabase.co",
          SUPABASE_ANON_KEY: "public",
          SUPABASE_SERVICE_ROLE_KEY: "service",
        })[name],
    },
  });
  mocks.getUser.mockResolvedValue({
    data: { user: { id: userId } },
    error: null,
  });
  mocks.rpc.mockResolvedValue({ data: true, error: null });
  mocks.encrypt.mockResolvedValue("ciphertext");
  mocks.decrypt.mockResolvedValue("sk-test-credential");
  mocks.api.mockResolvedValue({
    status: "completed",
    output: [
      {
        type: "message",
        content: [{ type: "output_text", text: JSON.stringify(report) }],
      },
    ],
  });
  mocks.from.mockImplementation((table: string) =>
    chain({
      data:
        table === "profiles"
          ? { role: "vendedor" }
          : table === "ai_credentials"
            ? { encrypted_key: "ciphertext", key_suffix: "1234" }
            : table === "ai_runs"
              ? {
                  id: "r1",
                  kind: "lucro",
                  report,
                  sources: [],
                  created_at: new Date().toISOString(),
                }
              : null,
      error: null,
    }),
  );
});
afterEach(() => vi.unstubAllGlobals());
describe("funções autenticadas de IA", () => {
  it("rejeita sessão inválida e origem não autorizada antes de acessar credenciais", async () => {
    mocks.getUser.mockResolvedValue({
      data: { user: null },
      error: new Error(),
    });
    expect((await settingsHandler(request({ action: "status" }))).status).toBe(
      401,
    );
    expect(mocks.from).not.toHaveBeenCalled();
    expect(
      (
        await settingsHandler(
          request({ action: "status" }, "https://evil.example"),
        )
      ).status,
    ).toBe(403);
  });
  it("retorna somente situação e sufixo, sem devolver a chave", async () => {
    const response = await settingsHandler(request({ action: "status" }));
    const data = await response.json();
    expect(data).toMatchObject({
      configured: true,
      suffix: "1234",
      model: "gpt-6-luna",
    });
    expect(JSON.stringify(data)).not.toContain("ciphertext");
    expect(mocks.from.mock.results[0].value.select).toHaveBeenCalledWith(
      "key_suffix,updated_at",
    );
  });
  it("valida o modelo antes de salvar a chave cifrada", async () => {
    const builder = chain({ error: null });
    mocks.from.mockReturnValue(builder);
    const response = await settingsHandler(
      request({ action: "save", apiKey: "sk-test-project-secret-key-1234" }),
    );
    expect(response.status).toBe(200);
    expect(mocks.api).toHaveBeenCalledWith(
      "models/gpt-6-luna",
      "sk-test-project-secret-key-1234",
    );
    expect(builder.upsert.mock.calls[0][0]).toMatchObject({
      user_id: userId,
      encrypted_key: "ciphertext",
      key_suffix: "1234",
    });
  });
  it("bloqueia análise de produto de outra pessoa", async () => {
    const response = await agentHandler(
      request({
        kind: "lucro",
        productId: draftId,
        draftId,
        snapshot: {
          nome: "Jaqueta",
          precificacao: { ...emptyPricing, precoNormal: 150 },
        },
      }),
    );
    expect(response.status).toBe(403);
    expect(mocks.api).not.toHaveBeenCalled();
  });
  it("recalcula o resumo financeiro em vez de confiar no navegador", async () => {
    const response = await agentHandler(
      request({
        kind: "lucro",
        draftId,
        snapshot: {
          nome: "Jaqueta",
          precificacao: {
            ...emptyPricing,
            custo: 84,
            precoNormal: 150,
            afiliadoAtivo: true,
          },
          resumoFinanceiro: { lucroLiquido: 99999 },
        },
      }),
    );
    expect(response.status).toBe(200);
    const data = JSON.parse(
      mocks.api.mock.calls[0][2].input[0].content[0].text,
    );
    expect(data.dados.resumoFinanceiro.lucroLiquido).toBe(58.5);
  });
  it("não chama a OpenAI quando o limite foi atingido ou a chave está ausente", async () => {
    mocks.rpc.mockResolvedValue({ data: false, error: null });
    const body = {
      kind: "lucro",
      snapshot: {
        nome: "Jaqueta",
        precificacao: { ...emptyPricing, precoNormal: 150 },
      },
    };
    expect((await agentHandler(request(body))).status).toBe(429);
    expect(mocks.api).not.toHaveBeenCalled();
    mocks.from.mockImplementation((table: string) =>
      chain({
        data: table === "profiles" ? { role: "vendedor" } : null,
        error: null,
      }),
    );
    expect((await agentHandler(request(body))).status).toBe(400);
    expect(mocks.api).not.toHaveBeenCalled();
  });
});
