// @vitest-environment node
import { beforeAll, beforeEach, afterAll, describe, it, expect, vi } from "vitest";
const mocks = vi.hoisted(() => ({ client: vi.fn(), getUser: vi.fn() }));
vi.mock("@supabase/supabase-js", () => ({ createClient: mocks.client }));
const callbacks: Array<(request: Request) => Response | Promise<Response>> = [];
let environment: Record<string, string> = {};
beforeAll(async () => {
  vi.stubGlobal("Deno", {
    env: { get: (name: string) => environment[name] },
    serve: (callback: (request: Request) => Response | Promise<Response>) => callbacks.push(callback),
  });
  await import("../supabase/dashboard/ai-settings");
  await import("../supabase/dashboard/ai-agent");
});
beforeEach(() => {
  vi.clearAllMocks();
  environment = {
    SUPABASE_URL: "https://xqmvlozonwudwewjlpfe.supabase.co",
    APP_ALLOWED_ORIGINS: "https://clickcristao.vercel.app",
    SUPABASE_ANON_KEY: "test-public-key",
  };
  mocks.client.mockReturnValue({ auth: { getUser: mocks.getUser } });
  mocks.getUser.mockResolvedValue({ data: { user: null }, error: new Error("invalid") });
});
afterAll(() => vi.unstubAllGlobals());
const request = (method = "POST", authorization?: string) => new Request("https://test/functions/v1/ai", {
  method,
  headers: { Origin: "https://clickcristao.vercel.app", ...(authorization ? { Authorization: authorization } : {}) },
  ...(method === "POST" ? { body: JSON.stringify({ action: "status" }) } : {}),
});
describe("arquivos completos para o editor do Supabase", () => {
  it("registra um servidor para cada função, sem depender de import.meta.main", () => {
    expect(callbacks).toHaveLength(2);
  });
  it("recusa outro projeto antes de acessar autenticação ou banco", async () => {
    environment.SUPABASE_URL = "https://outro-projeto.supabase.co";
    for (const callback of callbacks) {
      const response = await callback(request());
      expect(response.status).toBe(503);
      expect((await response.json()).error).toContain("exclusivamente");
    }
    expect(mocks.client).not.toHaveBeenCalled();
  });
  it("responde ao preflight da plataforma no projeto correto", async () => {
    for (const callback of callbacks) {
      const response = await callback(request("OPTIONS"));
      expect(response.status).toBe(200);
      expect(response.headers.get("Access-Control-Allow-Origin")).toBe("https://clickcristao.vercel.app");
    }
    expect(mocks.client).not.toHaveBeenCalled();
  });
  it("exige sessão e rejeita tokens inválidos nas duas funções", async () => {
    for (const callback of callbacks) {
      expect((await callback(request())).status).toBe(401);
      expect((await callback(request("POST", "Bearer invalid-token"))).status).toBe(401);
    }
    expect(mocks.getUser).toHaveBeenCalledTimes(2);
  });
});
