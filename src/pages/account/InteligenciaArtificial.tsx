import { useEffect, useState } from "react";
import { Bot, KeyRound, Loader2, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { AccountLayout } from "@/components/AccountLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AnalysisResult } from "@/components/ai/AnalysisPanel";
import { useToast } from "@/hooks/use-toast";
import {
  getAISettings,
  saveAIKey,
  removeAIKey,
  fetchAIHistory,
  runAgent,
  OPENAI_MODEL,
  agentLabels,
  type AISettings,
  type AIRun,
  type AgentKind,
} from "@/lib/ai";
import { useAuth } from "@/contexts/AuthContext";

const InteligenciaArtificial = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [settings, setSettings] = useState<AISettings | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [busy, setBusy] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [historyError, setHistoryError] = useState("");
  const [kind, setKind] = useState<AgentKind>("investigador");
  const [question, setQuestion] = useState("");
  const [runs, setRuns] = useState<AIRun[]>([]);
  useEffect(() => {
    let active = true;
    getAISettings()
      .then((data) => {
        if (active) setSettings(data);
      })
      .catch((err) => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    fetchAIHistory()
      .then((data) => {
        if (active) setRuns(data);
      })
      .catch((err) => {
        if (active) setHistoryError(err.message);
      });
    return () => {
      active = false;
    };
  }, [user?.id]);
  const changeKey = async (remove = false) => {
    setBusy(true);
    setError("");
    try {
      const data = remove
        ? await removeAIKey()
        : await saveAIKey(apiKey.trim());
      setSettings(data);
      setApiKey("");
      toast({
        title: remove ? "Chave removida" : "Integração configurada",
        description: remove
          ? "Sua conta não fará novas consultas de IA até configurar outra chave."
          : "Sua chave foi validada e protegida no servidor.",
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível atualizar a chave.",
      );
    } finally {
      setBusy(false);
    }
  };
  const ask = async () => {
    setAnalyzing(true);
    try {
      const run = await runAgent({ kind, question });
      setRuns((prev) => [run, ...prev]);
      setHistoryError("");
    } catch (err) {
      toast({
        title: "Consulta indisponível",
        description: err instanceof Error ? err.message : "Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setAnalyzing(false);
    }
  };
  return (
    <AccountLayout title="Inteligência Artificial">
      <div className="max-w-4xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-[#0A20E7]" />
              Integração OpenAI
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Configure sua chave API para usar os agentes. Modelo:{" "}
              <strong>{OPENAI_MODEL}</strong>. O consumo é cobrado na sua conta
              OpenAI.
            </p>
            <p className="text-sm">
              {loading
                ? "Consultando integração..."
                : settings === null
                  ? "Não foi possível verificar a chave configurada."
                  : settings.configured
                    ? `Chave configurada: ••••${settings.suffix ?? ""}`
                    : "Nenhuma chave configurada."}
            </p>
            <div>
              <Label htmlFor="openai-key">Chave API OpenAI</Label>
              <Input
                id="openai-key"
                type="password"
                autoComplete="off"
                spellCheck={false}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="mt-1"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              A chave é guardada cifrada no servidor e nunca aparece no
              histórico. Ao consultar um agente, os dados necessários são
              enviados à OpenAI.
            </p>
            {error && (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}
            <div className="flex flex-wrap gap-3">
              <Button
                disabled={busy || loading || !apiKey.trim()}
                onClick={() => changeKey()}
                className="bg-[#0A20E7] hover:bg-[#091bc4]"
              >
                {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Validar e salvar chave
              </Button>
              {settings?.configured && (
                <Button
                  variant="outline"
                  disabled={busy || analyzing}
                  onClick={() => changeKey(true)}
                >
                  Remover chave
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
        <div className="grid sm:grid-cols-2 gap-4">
          {(
            [
              [
                "Precificação",
                "Pesquisa o mercado e avalia o lucro durante o cadastro do produto.",
              ],
              [
                "Comparação",
                "Compara características e preços dos produtos publicados.",
              ],
              [
                "Suporte ao consumidor",
                "Orienta sobre a plataforma e os produtos disponíveis.",
              ],
              [
                "Investigador",
                "Encontra produtos e benefícios conforme sua necessidade.",
              ],
            ] as const
          ).map(([title, description]) => (
            <Card key={title}>
              <CardContent className="p-4">
                <h3 className="font-semibold flex gap-2 items-center">
                  <Bot className="h-4 w-4 text-[#0A20E7]" />
                  {title}
                </h3>
                <p className="text-sm text-muted-foreground mt-2">
                  {description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        {(user?.role === "vendedor" || user?.role === "anunciante") && (
          <p className="text-sm">
            As análises de mercado, lucro e conteúdo ficam nas etapas de{" "}
            <Link
              className="text-blue-700 underline"
              to="/account/produtos/novo"
            >
              cadastro do produto
            </Link>
            .
          </p>
        )}
        <Card>
          <CardHeader>
            <CardTitle>Consultar um agente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Agente</Label>
              <Select
                value={kind}
                onValueChange={(v) => setKind(v as AgentKind)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(
                    ["comparacao", "suporte", "investigador"] as AgentKind[]
                  ).map((k) => (
                    <SelectItem key={k} value={k}>
                      {agentLabels[k]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="agent-question">O que você precisa?</Label>
              <Textarea
                id="agent-question"
                className="mt-1 min-h-28"
                maxLength={3000}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ex.: compare jaquetas de couro para uso no frio, considerando o preço e os benefícios."
              />
            </div>
            <Button
              disabled={!settings?.configured || analyzing || !question.trim()}
              onClick={ask}
              className="bg-[#0A20E7] hover:bg-[#091bc4]"
            >
              {analyzing ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4 mr-2" />
              )}
              {analyzing ? "Consultando..." : "Consultar agente"}
            </Button>
          </CardContent>
        </Card>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Histórico de análises</h3>
          {historyError && (
            <p role="alert" className="text-sm text-destructive">
              {historyError}
            </p>
          )}
          {!runs.length && !historyError && (
            <p className="text-sm text-muted-foreground">
              Suas consultas e análises serão exibidas aqui.
            </p>
          )}
          {runs.map((run) => (
            <AnalysisResult key={run.id} run={run} />
          ))}
        </div>
      </div>
    </AccountLayout>
  );
};
export default InteligenciaArtificial;
