import { useEffect, useState, type ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Star } from "lucide-react";
import { formatBRL, parseMoney } from "@/lib/pricing";

export function ProductSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-4">
      <h3 className="text-lg font-bold border-b pb-2">{title}</h3>
      {children}
    </section>
  );
}
export function TextField({
  label,
  value,
  onChange,
  placeholder,
  multiline = false,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
}) {
  const id = `product-${label
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-zA-Z0-9]/g, "-")
    .toLowerCase()}`;
  return (
    <div>
      <Label htmlFor={id} className="font-normal">
        {label}
      </Label>
      {multiline ? (
        <Textarea
          id={id}
          className="mt-1 resize-y placeholder:text-gray-400"
          rows={rows}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={5000}
        />
      ) : (
        <Input
          id={id}
          className="mt-1"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={500}
        />
      )}
    </div>
  );
}
export function PriceField({
  label,
  value,
  onChange,
  placeholder,
  percentage = false,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  placeholder?: string;
  percentage?: boolean;
}) {
  const [text, setText] = useState(
    value ? String(value).replace(".", ",") : "",
  );
  useEffect(() => {
    setText((prev) =>
      Object.is(parseMoney(prev), value)
        ? prev
        : value === 0
          ? ""
          : Number.isFinite(value)
            ? String(value).replace(".", ",")
            : prev,
    );
  }, [value]);
  const id = `price-${label.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()}`;
  return (
    <div>
      <Label htmlFor={id} className="font-normal">
        {label}
        {percentage ? " (%)" : " (R$)"}
      </Label>
      <Input
        id={id}
        inputMode="decimal"
        className="mt-1"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          onChange(parseMoney(e.target.value));
        }}
        placeholder={placeholder ?? "0,00"}
      />
    </div>
  );
}
export function CalculatedField({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color?: "blue" | "green";
}) {
  return (
    <div>
      <Label className="font-normal">{label}</Label>
      <output
        className={`mt-1 flex h-10 items-center rounded-md border px-3 font-semibold ${color === "blue" ? "border-blue-200 bg-blue-50 text-[#0A20E7]" : color === "green" ? "border-green-200 bg-green-50 text-green-700" : "bg-muted"}`}
      >
        {Number.isFinite(value) ? formatBRL(value) : "—"}
      </output>
    </div>
  );
}
export function StarRating({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-2">
      <p className="font-medium">{label}</p>
      <RadioGroup
        aria-label={label}
        value={String(value)}
        onValueChange={(v) => onChange(Number(v))}
        className="flex flex-wrap gap-2"
      >
        {[1, 2, 3, 4, 5].map((n) => (
          <label
            key={n}
            className="cursor-pointer rounded-md border p-2 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-blue-600"
          >
            <RadioGroupItem
              className="sr-only"
              value={String(n)}
              aria-label={`${n} ${n === 1 ? "estrela" : "estrelas"}`}
            />
            <span className="relative block h-6 w-6">
              <Star className="h-6 w-6 text-gray-300" />
              <span
                className="absolute left-0 top-0 overflow-hidden"
                style={{
                  width: `${Math.max(0, Math.min(1, value - n + 1)) * 100}%`,
                }}
              >
                <Star className="h-6 w-6 min-w-6 fill-amber-400 text-amber-400" />
              </span>
            </span>
          </label>
        ))}
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <RadioGroupItem value="0" />
          Sem avaliação
        </label>
      </RadioGroup>
      <div className="max-w-48">
        <Label
          htmlFor={`rating-${label}`}
          className="text-xs text-muted-foreground"
        >
          Nota média (ex.: 4,5 de 5)
        </Label>
        <Input
          id={`rating-${label}`}
          aria-label={`Nota média: ${label}`}
          type="number"
          inputMode="decimal"
          min="0"
          max="5"
          step="0.1"
          value={value || ""}
          onChange={(e) =>
            onChange(e.target.value === "" ? 0 : Number(e.target.value))
          }
          className="mt-1"
        />
      </div>
      <span className="text-sm text-muted-foreground">
        {value
          ? `${value.toLocaleString("pt-BR")} de 5 estrelas`
          : "Não informado"}
      </span>
    </div>
  );
}
