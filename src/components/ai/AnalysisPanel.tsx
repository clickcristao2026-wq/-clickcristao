import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, Loader2, History, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  agentLabels,
  fetchAIHistory,
  runAgent,
  type AgentKind,
  type AIRun,
} from "@/lib/ai";
import { formatBRL } from "@/lib/pricing";

export function AnalysisResult({
  run,
  onApplyPrice,
}: {
  run: AIRun;
  onApplyPrice?: (price: number) => void;
}) {
  return (
    <Card className="border-blue-100">
      <CardContent className="p-5 space-y-4">
        <div className="flex flex-wrap justify-between gap-2 text-sm">
          <strong>{agentLabels[run.kind]}</strong>
          <span className="text-muted-foreground">
            {new Date(run.createdAt).toLocaleString("pt-BR")} · {run.model}
          </span>
        </div>
        <p className="whitespace-pre-wrap">{run.report.resumo}</p>
        {(
          [
            ["Pontos fortes", run.report.pontosFortes],
            ["Melhorias sugeridas", run.report.melhorias],
            ["Pontos de atenção", run.report.alertas],
          ] as const
        ).map(
          ([label, items]) =>
            items.length > 0 && (
              <div key={label}>
                <h4 className="font-medium mb-1">{label}</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  {items.map((text, i) => (
                    <li key={i}>{text}</li>
                  ))}
                </ul>
              </div>
            ),
        )}
        {run.report.precoSugerido !== null && (
          <div className="flex flex-wrap items-center gap-3 rounded-lg bg-green-50 p-3">
            <strong className="text-green-800">
              Preço sugerido: {formatBRL(run.report.precoSugerido)}
            </strong>
            {onApplyPrice && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onApplyPrice(run.report.precoSugerido!)}
              >
                Usar este preço
              </Button>
            )}
          </div>
        )}
        {run.sources.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Fontes consultadas</h4>
            <ul className="space-y-2">
              {run.sources.map(
                (source) =>
                  /^https?:\/\//i.test(source.url) && (
                    <li key={source.url}>
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-blue-700 underline break-all"
                      >
                        {source.title}
                        <ExternalLink className="h-3 w-3 shrink-0" />
                      </a>
                    </li>
                  ),
              )}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
interface Props {
  kind: AgentKind;
  productId?: string;
  draftId?: string;
  getSnapshot: () => unknown;
  getImages?: () => Promise<string[]>;
  onApplyPrice?: (price: number) => void;
}
export function AnalysisPanel({
  kind,
  productId,
  draftId,
  getSnapshot,
  getImages,
  onApplyPrice,
}: Props) {
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);
  const [history, setHistory] = useState<AIRun[]>([]);
  const [error, setError] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  useEffect(() => {
    let active = true;
    fetchAIHistory({ productId, draftId, kind })
      .then((runs) => {
        if (active) {
          setHistory(runs);
          setError("");
        }
      })
      .catch((err) => {
        if (active) setError(err.message);
      });
    return () => {
      active = false;
    };
  }, [productId, draftId, kind]);
  const analyze = async () => {
    setBusy(true);
    setError("");
    try {
      const snapshot = getSnapshot();
      const images = getImages ? await getImages() : undefined;
      const run = await runAgent({
        kind,
        productId,
        draftId,
        snapshot,
        images,
      });
      setHistory((prev) => [run, ...prev]);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Não foi possível analisar.";
      setError(message);
      toast({
        title: "Análise indisponível",
        description: message,
        variant: "destructive",
      });
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="space-y-4 rounded-xl border bg-blue-50/40 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h4 className="font-semibold flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#0A20E7]" />
            {agentLabels[kind]}
          </h4>
          <p className="text-sm text-muted-foreground mt-1">
            {kind === "mercado"
              ? "Pesquisa preços de concorrentes e registra as fontes."
              : kind === "lucro"
                ? "Avalia os benefícios e o lucro previsto do produto."
                : "Revisa as informações, os preços e as imagens do anúncio."}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            onClick={analyze}
            disabled={busy}
            className="bg-[#0A20E7] hover:bg-[#091bc4]"
          >
            {busy ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4 mr-2" />
            )}
            {busy
              ? "Analisando..."
              : kind === "conteudo"
                ? "ANALISAR CONTEÚDO"
                : "ANALISAR PREÇO"}
          </Button>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        Usa sua chave OpenAI e o GPT-6 Luna. Os dados desta análise são enviados
        à OpenAI.{" "}
        <Link
          to="/account/inteligencia-artificial"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-700 underline"
        >
          Configurar integração
        </Link>
      </p>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      {history[0] && (
        <AnalysisResult run={history[0]} onApplyPrice={onApplyPrice} />
      )}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => setShowHistory((v) => !v)}
      >
        <History className="h-4 w-4 mr-2" />
        {showHistory
          ? "Ocultar histórico"
          : `Ver histórico (${history.length})`}
      </Button>
      {showHistory && (
        <div className="space-y-3">
          {history.length < 2 ? (
            <p className="text-sm text-muted-foreground">
              Não há análises anteriores além da exibida acima.
            </p>
          ) : (
            history
              .slice(1)
              .map((run) => <AnalysisResult key={run.id} run={run} />)
          )}
        </div>
      )}
    </div>
  );
}
