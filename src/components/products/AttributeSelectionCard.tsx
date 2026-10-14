import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import type { ProductAttribute } from "@/types/product";

export function AttributeSelectionCard({
  attribute: a,
  selected,
  onSelect,
}: {
  attribute: ProductAttribute;
  selected: Set<string>;
  onSelect: (id: string) => void;
}) {
  const values = a.valores.filter((v) => v.ativo || selected.has(v.id));
  return (
    <Card className="bg-white shadow-sm">
      <CardContent className="p-4 sm:p-5 space-y-3">
        <div>
          <h4 className="font-semibold">{a.nome}</h4>
          <p className="text-xs text-muted-foreground">
            Seleção {a.selecao === "unica" ? "única" : "múltipla"} ·{" "}
            {values.length} opções
          </p>
        </div>
        {!values.length ? (
          <p className="text-sm text-muted-foreground">
            Nenhuma opção disponível.
          </p>
        ) : a.selecao === "unica" ? (
          <RadioGroup
            aria-label={a.nome}
            value={values.find((v) => selected.has(v.id))?.id ?? ""}
            onValueChange={onSelect}
            className="flex flex-wrap gap-2"
          >
            {values.map((v) => (
              <label
                key={v.id}
                className={`flex cursor-pointer items-start gap-2 rounded-lg border px-3 py-2 text-sm ${selected.has(v.id) ? "border-blue-600 bg-blue-50" : "bg-slate-50"} ${v.descricao ? "w-full" : ""}`}
              >
                <RadioGroupItem
                  value={v.id}
                  aria-label={v.valor}
                  className="mt-0.5 shrink-0"
                />
                <span>
                  <span className="font-medium">{v.valor}</span>
                  {v.descricao && (
                    <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                      {v.descricao}
                    </span>
                  )}
                </span>
              </label>
            ))}
          </RadioGroup>
        ) : (
          <div className="flex flex-wrap gap-2">
            {values.map((v) => (
              <label
                key={v.id}
                className={`flex cursor-pointer items-start gap-2 rounded-lg border px-3 py-2 text-sm ${selected.has(v.id) ? "border-blue-600 bg-blue-50" : "bg-slate-50"} ${v.descricao ? "w-full" : ""}`}
              >
                <Checkbox
                  aria-label={v.valor}
                  checked={selected.has(v.id)}
                  onCheckedChange={() => onSelect(v.id)}
                  className="mt-0.5 shrink-0"
                />
                <span>
                  {v.valor}
                  {v.descricao && (
                    <span className="mt-1 block text-muted-foreground">
                      {v.descricao}
                    </span>
                  )}
                </span>
              </label>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
