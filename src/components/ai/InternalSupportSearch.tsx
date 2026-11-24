import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabaseClient";

interface Program {
  id: string;
  name: string;
  requirements: string;
  instructions: string;
  ends_at: string | null;
}

interface Offer {
  id: string;
  name: string;
  price: number;
  commission_percent: number;
  estimated_commission: number;
  terms: string;
}

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const date = new Intl.DateTimeFormat("pt-BR", { timeZone: "America/Sao_Paulo" });

export function InternalSupportSearch({ role }: { role: "consumidor" | "afiliado" }) {
  const programs = role === "consumidor";
  const [input, setInput] = useState("");
  const [search, setSearch] = useState({ term: "" });
  const [results, setResults] = useState<Array<Program | Offer>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const rpc = programs ? "list_eligible_consumer_programs" : "list_available_affiliate_offers";
    async function load() {
      try {
        const result = await supabase.rpc(rpc, { search_term: search.term }).abortSignal(controller.signal);
        if (controller.signal.aborted) return;
        setResults(result.data ?? []);
        setError(Boolean(result.error));
      } catch {
        if (!controller.signal.aborted) setError(true);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    void load();
    return () => controller.abort();
  }, [programs, search]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{programs ? "Programas" : "Precificação"}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {programs
            ? "Consulte os programas vigentes disponíveis para sua conta."
            : "Pesquise produtos disponíveis para afiliação e consulte a comissão estimada por venda."}
        </p>
        <form
          className="space-y-2"
          onSubmit={(event) => {
            event.preventDefault();
            setLoading(true);
            setError(false);
            setSearch({ term: input.trim() });
          }}
        >
          <Label htmlFor="internal-support-search">{programs ? "Nome do programa" : "Nome ou modelo do produto"}</Label>
          <div className="flex flex-wrap items-center gap-2">
            <Input className="w-full sm:flex-1" id="internal-support-search" value={input} maxLength={120} onChange={(event) => setInput(event.target.value)} />
            <Button type="submit" variant="outline" disabled={loading}>
              <Search aria-hidden="true" className="mr-2 h-4 w-4" />
              Pesquisar
            </Button>
          </div>
        </form>
        {loading && <p role="status" className="text-sm text-muted-foreground">Consultando a plataforma…</p>}
        {error && <p role="alert" className="text-sm text-destructive">Consulta indisponível no momento. Tente novamente.</p>}
        {!loading && !error && !results.length && (
          <p role="status" className="text-sm text-muted-foreground">
            {programs ? "Nenhum programa elegível encontrado." : "Nenhum produto disponível para afiliação encontrado."}
          </p>
        )}
        {!loading && !error && results.length > 0 && (
          <ul className="divide-y rounded-lg border px-4">
            {results.map((item) => (
              <li key={item.id} className="space-y-1 break-words py-3 text-sm">
                <h3 className="font-semibold">{item.name}</h3>
                {"requirements" in item ? (
                  <>
                    <p className="text-muted-foreground">{item.ends_at ? `Ativo até ${date.format(new Date(item.ends_at))}` : "Ativo, sem data de encerramento informada"}</p>
                    <p><strong>Requisitos</strong> {item.requirements}</p>
                    <p><strong>Como participar</strong> {item.instructions}</p>
                  </>
                ) : (
                  <>
                    <p>{currency.format(item.price)} · {item.commission_percent.toLocaleString("pt-BR")}% de comissão</p>
                    <p><strong>Comissão estimada por venda</strong> {currency.format(item.estimated_commission)}</p>
                    <p>{item.terms}</p>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
        {!programs && (
          <p className="text-xs text-muted-foreground">Estimativa calculada sobre o preço atual multiplicado pela taxa de comissão, antes de custos próprios e ajustes da venda.</p>
        )}
      </CardContent>
    </Card>
  );
}
