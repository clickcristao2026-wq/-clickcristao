import { describe, it, expect, vi } from "vitest";
import {
  agentRequest,
  openaiFetch,
  parseResponse,
} from "../supabase/functions/_shared/openai";
import { OPENAI_MODEL } from "../supabase/functions/_shared/domain";
const report = {
  resumo: "Boa oferta",
  pontosFortes: [],
  melhorias: [],
  alertas: [],
  precoSugerido: 100,
};
describe("agentes OpenAI", () => {
  it("preserva o modelo, exige pesquisa de mercado e envia imagens somente quando fornecidas", () => {
    expect(agentRequest("mercado", {}, "")).toMatchObject({
      model: OPENAI_MODEL,
      store: false,
      tool_choice: { type: "web_search" },
    });
    expect(agentRequest("lucro", {}, "")).not.toHaveProperty("tools");
    expect(
      agentRequest("conteudo", {}, "", ["data:image/jpeg;base64,YQ=="]).input[0]
        .content[1],
    ).toMatchObject({ type: "input_image" });
  });
  it("extrai somente fontes reais retornadas pela API e remove duplicatas", () => {
    const result = parseResponse({
      status: "completed",
      output: [
        {
          type: "message",
          content: [
            {
              type: "output_text",
              text: JSON.stringify(report),
              annotations: [
                {
                  type: "url_citation",
                  title: "Loja",
                  url: "https://example.com/p",
                },
              ],
            },
          ],
        },
        {
          type: "web_search_call",
          action: {
            sources: [
              { title: "Loja", url: "https://example.com/p" },
              { title: "Inválido", url: "javascript:alert(1)" },
            ],
          },
        },
      ],
    });
    expect(result.report).toEqual(report);
    expect(result.sources).toEqual([
      { title: "Loja", url: "https://example.com/p" },
    ]);
  });
  it("rejeita saída incompleta, recusa, JSON inválido e preço impossível", () => {
    expect(() => parseResponse({ status: "incomplete" })).toThrow("incompleta");
    expect(() =>
      parseResponse({
        status: "completed",
        output: [{ type: "message", content: [{ type: "refusal" }] }],
      }),
    ).toThrow("não pôde");
    expect(() =>
      parseResponse({
        status: "completed",
        output: [
          {
            type: "message",
            content: [{ type: "output_text", text: "not JSON" }],
          },
        ],
      }),
    ).toThrow("inválida");
    expect(() =>
      parseResponse({
        status: "completed",
        output: [
          {
            type: "message",
            content: [
              {
                type: "output_text",
                text: JSON.stringify({ ...report, precoSugerido: -1 }),
              },
            ],
          },
        ],
      }),
    ).toThrow("validada");
  });
  it("não expõe erro bruto ou chave ao usuário", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(
          new Response('{"error":"secret sk-test"}', { status: 401 }),
        ),
    );
    await expect(openaiFetch("responses", "sk-test", {})).rejects.toThrow(
      "Chave OpenAI inválida",
    );
    vi.unstubAllGlobals();
  });
});
