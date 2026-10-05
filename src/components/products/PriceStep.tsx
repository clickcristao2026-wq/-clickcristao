import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  ProductSection,
  PriceField,
  CalculatedField,
  TextField,
} from "./FormFields";
import { AnalysisPanel } from "@/components/ai/AnalysisPanel";
import {
  calculatePricing,
  formatBRL,
  type ProductPricing,
} from "@/lib/pricing";

interface Props {
  pricing: ProductPricing;
  updatePrice: <K extends keyof ProductPricing>(
    field: K,
    value: ProductPricing[K],
  ) => void;
  installment: string;
  onInstallment: (value: string) => void;
  productId?: string;
  draftId: string;
  getSnapshot: () => unknown;
  benefits: ReactNode;
}
export function PriceStep({
  pricing: p,
  updatePrice: update,
  installment,
  onInstallment,
  productId,
  draftId,
  getSnapshot,
  benefits,
}: Props) {
  const s = calculatePricing(p);
  const apply = (price: number) =>
    update(
      p.modalidade === "promocao" ? "precoPromocional" : "precoNormal",
      price,
    );
  return (
    <>
      <ProductSection title="PARÂMETROS DE PRECIFICAÇÃO">
        <div className="grid sm:grid-cols-2 gap-4">
          <PriceField
            label="Valor de Custo do Produto"
            value={p.custo}
            onChange={(v) => update("custo", v)}
            placeholder="84,00"
          />
          <PriceField
            label="Margem de Lucro Desejada"
            value={p.margem}
            onChange={(v) => update("margem", v)}
            placeholder="33,70"
          />
          <CalculatedField
            label="Custo da Plataforma (3%)"
            value={s.custoPlataforma}
            color="blue"
          />
          <CalculatedField
            label="Preço Sugerido do Produto"
            value={s.precoSugerido}
            color="green"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Custo da plataforma = (custo + margem) × 3%. Preço sugerido = custo +
          margem − custo da plataforma.
        </p>
        <Button
          type="button"
          variant="outline"
          disabled={s.precoSugerido <= 0 || !Number.isFinite(s.precoSugerido)}
          onClick={() => apply(s.precoSugerido)}
        >
          Usar preço sugerido
        </Button>
      </ProductSection>
      <ProductSection title="MODALIDADE DE PRECIFICAÇÃO">
        <RadioGroup
          aria-label="Modalidade de precificação"
          value={p.modalidade}
          onValueChange={(v) =>
            update("modalidade", v as ProductPricing["modalidade"])
          }
          className="space-y-4"
        >
          <div className="rounded-lg border p-4 space-y-4">
            <label className="flex gap-3 font-semibold cursor-pointer items-center">
              <RadioGroupItem value="normal" />
              PRECIFICAÇÃO DO PRODUTO
            </label>
            {p.modalidade === "normal" && (
              <>
                <PriceField
                  label="Preço do produto *"
                  value={p.precoNormal}
                  onChange={(v) => update("precoNormal", v)}
                />
                <TextField
                  label="Observação sobre parcelamento"
                  value={installment}
                  onChange={onInstallment}
                  placeholder="Ex.: em até 10x sem juros"
                />
              </>
            )}
          </div>
          <div className="rounded-lg border p-4 space-y-4">
            <label className="flex gap-3 font-semibold cursor-pointer items-center">
              <RadioGroupItem value="promocao" />
              PRECIFICAÇÃO DO PRODUTO EM PROMOÇÃO
            </label>
            {p.modalidade === "promocao" && (
              <>
                <div className="grid sm:grid-cols-3 gap-4">
                  <PriceField
                    label="Preço Original"
                    value={p.precoOriginal}
                    onChange={(v) => update("precoOriginal", v)}
                    placeholder="150,00"
                  />
                  <PriceField
                    label="Preço Promocional"
                    value={p.precoPromocional}
                    onChange={(v) => update("precoPromocional", v)}
                    placeholder="100,00"
                  />
                  <CalculatedField
                    label="Economia"
                    value={s.economia}
                    color="green"
                  />
                </div>
                <TextField
                  label="Observação sobre parcelamento"
                  value={installment}
                  onChange={onInstallment}
                />
              </>
            )}
          </div>
        </RadioGroup>
        <p className="text-xs text-muted-foreground">
          Selecione uma única modalidade de precificação.
        </p>
      </ProductSection>
      <AnalysisPanel
        kind="mercado"
        productId={productId}
        draftId={draftId}
        getSnapshot={getSnapshot}
        onApplyPrice={apply}
      />
      <ProductSection title="BENEFÍCIOS DO ANÚNCIO">
        <div className="space-y-5">{benefits}</div>
      </ProductSection>
      <ProductSection title="VALOR DO CUPOM">
        <label className="flex gap-2 items-center cursor-pointer">
          <Checkbox
            checked={p.cupomAtivo}
            onCheckedChange={(v) => update("cupomAtivo", v === true)}
          />
          Ativar cupom
        </label>
        {p.cupomAtivo && (
          <div className="grid sm:grid-cols-2 gap-4">
            <TextField
              label="Nome do Cupom"
              value={p.cupomNome}
              onChange={(v) => update("cupomNome", v)}
            />
            <PriceField
              label="Percentual de Desconto"
              value={p.cupomPercentual}
              onChange={(v) => update("cupomPercentual", v)}
              percentage
            />
          </div>
        )}
      </ProductSection>
      <ProductSection title="VALOR DO FRETE">
        <label className="flex gap-2 items-center cursor-pointer">
          <Checkbox
            checked={p.freteAtivo}
            onCheckedChange={(v) => update("freteAtivo", v === true)}
          />
          Incluir custo do frete
        </label>
        {p.freteAtivo && (
          <>
            <PriceField
              label="Custo do Frete"
              value={p.freteCusto}
              onChange={(v) => update("freteCusto", v)}
            />
            <label className="flex gap-2 items-center cursor-pointer">
              <Checkbox
                checked={p.freteGratis}
                onCheckedChange={(v) => update("freteGratis", v === true)}
              />
              Frete Grátis para o comprador
            </label>
            <p className="text-xs text-muted-foreground">
              O custo informado é suportado pelo vendedor e entra no cálculo do
              lucro, inclusive com frete grátis.
            </p>
          </>
        )}
      </ProductSection>
      <ProductSection title="VALOR PRODUTO AFILIADO">
        <label className="flex gap-2 items-center cursor-pointer">
          <Checkbox
            checked={p.afiliadoAtivo}
            onCheckedChange={(v) => update("afiliadoAtivo", v === true)}
          />
          Ativar produto afiliado
        </label>
        {p.afiliadoAtivo && (
          <div className="grid sm:grid-cols-2 gap-4">
            <CalculatedField label="Preço do Produto" value={s.preco} />
            <CalculatedField
              label="Valor do Afiliado (5%)"
              value={s.afiliado}
              color="blue"
            />
          </div>
        )}
      </ProductSection>
      <ProductSection title="RESUMO DE PRECIFICAÇÃO">
        <div className="rounded-xl border p-5 space-y-3">
          {(
            [
              ["Preço do Produto", s.preco],
              ["Valor do Cupom", s.cupom],
              ["Valor do Frete", s.frete],
              ["Valor Afiliado", s.afiliado],
            ] as const
          ).map(([label, value]) => (
            <div className="flex justify-between gap-3" key={label}>
              <span>{label}</span>
              <strong>{Number.isFinite(value) ? formatBRL(value) : "—"}</strong>
            </div>
          ))}
          <div className="flex justify-between border-t pt-3">
            <strong>Faturamento líquido</strong>
            <strong>
              {Number.isFinite(s.faturamentoLiquido)
                ? formatBRL(s.faturamentoLiquido)
                : "—"}
            </strong>
          </div>
          <div
            className={`flex justify-between rounded-lg p-3 ${s.lucroLiquido >= 0 ? "bg-green-50 text-green-800" : "bg-red-50 text-red-700"}`}
          >
            <strong>Lucro líquido</strong>
            <strong>
              {Number.isFinite(s.lucroLiquido)
                ? formatBRL(s.lucroLiquido)
                : "—"}
            </strong>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Faturamento líquido = preço − cupom − frete − afiliado. Lucro líquido
          = faturamento líquido − custo do produto. A taxa de 3% está
          considerada no preço sugerido.
        </p>
        {s.lucroLiquido < 0 && (
          <p role="alert" className="text-sm text-destructive">
            O preço atual gera prejuízo. Revise o preço ou os benefícios antes
            de publicar.
          </p>
        )}
      </ProductSection>
      <AnalysisPanel
        kind="lucro"
        productId={productId}
        draftId={draftId}
        getSnapshot={getSnapshot}
        onApplyPrice={apply}
      />
    </>
  );
}
