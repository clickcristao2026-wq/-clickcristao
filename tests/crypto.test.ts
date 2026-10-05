// @vitest-environment node
import { describe, it, expect, vi, afterEach } from "vitest";
import { encryptKey, decryptKey } from "../supabase/functions/_shared/crypto";
afterEach(() => vi.unstubAllGlobals());
describe("credenciais cifradas", () => {
  const configure = (value = btoa("x".repeat(32))) =>
    vi.stubGlobal("Deno", { env: { get: () => value } });
  it("cifra por usuário, usa IV aleatório e abre somente para o dono", async () => {
    configure();
    const key = "sk-private-project-key-for-test";
    const encrypted = await encryptKey(key, "seller-a");
    expect(encrypted).not.toContain(key);
    expect(await decryptKey(encrypted, "seller-a")).toBe(key);
    expect(await encryptKey(key, "seller-a")).not.toBe(encrypted);
    await expect(decryptKey(encrypted, "seller-b")).rejects.toThrow(
      "Não foi possível abrir",
    );
  });
  it("rejeita segredo de servidor ausente e conteúdo adulterado", async () => {
    configure("");
    await expect(encryptKey("sk-test", "a")).rejects.toThrow(
      "não foi configurada",
    );
    configure();
    const encrypted = await encryptKey("sk-test", "a");
    await expect(
      decryptKey(encrypted.slice(0, -4) + "AAAA", "a"),
    ).rejects.toThrow("Não foi possível abrir");
  });
});
