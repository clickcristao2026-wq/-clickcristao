import { useState } from "react";
import { Eye, EyeOff, Plus, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { ProductAttribute } from "@/types/product";
type Operation = (
  action: () => Promise<{ ok: boolean; error?: string }>,
) => Promise<boolean>;
import {
  createAttributeValue,
  deleteAttributeValue,
  setAttributeValueActive,
  setAttributeValueDescription,
  setAttributeActive,
  deleteAttribute,
} from "@/lib/products";
export function AdminAttributeCard({
  attribute: a,
  editable,
  operate,
}: {
  attribute: ProductAttribute;
  editable: boolean;
  operate: Operation;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [descriptions, setDescriptions] = useState<Record<string, string>>({});
  const add = async () => {
    if (!name.trim()) return;
    if (
      await operate(() =>
        createAttributeValue(a.id, name.trim(), description.trim()),
      )
    ) {
      setName("");
      setDescription("");
    }
  };
  return (
    <Card className="bg-white shadow-sm">
      <CardContent className="space-y-3 p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3
              className={`font-semibold ${!a.ativo ? "text-muted-foreground line-through" : ""}`}
            >
              {a.nome}
            </h3>
            <p className="text-xs text-muted-foreground">
              Seleção {a.selecao === "unica" ? "única" : "múltipla"} ·{" "}
              {a.valores.length} opções
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={!editable}
              aria-label={`${a.ativo ? "Desativar" : "Ativar"} atributo ${a.nome}`}
              onClick={() => operate(() => setAttributeActive(a.id, !a.ativo))}
            >
              {a.ativo ? (
                <Eye className="h-4 w-4" />
              ) : (
                <EyeOff className="h-4 w-4" />
              )}
            </button>
            <button
              type="button"
              disabled={!editable}
              aria-label={`Excluir atributo ${a.nome}`}
              onClick={() => {
                if (
                  window.confirm(
                    `Excluir o atributo "${a.nome}" desta classificação e suas opções?`,
                  )
                )
                  void operate(() => deleteAttribute(a.id));
              }}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {a.valores.map((v) => (
            <span
              key={v.id}
              className={`inline-flex items-center gap-1.5 rounded-full border bg-slate-50 px-2.5 py-1 text-xs ${!v.ativo ? "text-muted-foreground line-through" : ""}`}
            >
              {v.valor}
              <button
                type="button"
                disabled={!editable}
                aria-label={`${v.ativo ? "Desativar" : "Ativar"} ${v.valor}`}
                onClick={() =>
                  operate(() => setAttributeValueActive(v.id, !v.ativo))
                }
              >
                {v.ativo ? (
                  <Eye className="h-3 w-3" />
                ) : (
                  <EyeOff className="h-3 w-3" />
                )}
              </button>
              <button
                type="button"
                disabled={!editable}
                aria-label={`Excluir ${v.valor}`}
                onClick={() => {
                  if (window.confirm(`Excluir a opção "${v.valor}"?`))
                    void operate(() => deleteAttributeValue(v.id));
                }}
              >
                <Trash2 className="h-3 w-3 text-destructive" />
              </button>
            </span>
          ))}
        </div>
        {a.valores.some((v) => v.descricao) && (
          <div className="space-y-2 text-sm">
            {a.valores
              .filter((v) => v.descricao)
              .map((v) => (
                <p key={v.id}>
                  <strong>{v.valor}: </strong>
                  <span className="text-muted-foreground">{v.descricao}</span>
                </p>
              ))}
          </div>
        )}
        {editable && (
          <>
            <details className="rounded-lg bg-slate-50 p-3">
              <summary className="cursor-pointer text-sm font-medium">
                Editar explicações das opções
              </summary>
              <div className="mt-3 space-y-4">
                {a.valores.map((v) => (
                  <div key={v.id} className="space-y-2">
                    <label
                      htmlFor={`description-${v.id}`}
                      className="text-sm font-medium"
                    >
                      {v.valor}
                    </label>
                    <Textarea
                      id={`description-${v.id}`}
                      value={descriptions[v.id] ?? v.descricao ?? ""}
                      maxLength={1500}
                      onChange={(e) =>
                        setDescriptions((prev) => ({
                          ...prev,
                          [v.id]: e.target.value,
                        }))
                      }
                      placeholder="Explicação apresentada ao vendedor e anunciante"
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        operate(() =>
                          setAttributeValueDescription(
                            v.id,
                            descriptions[v.id] ?? v.descricao ?? "",
                          ),
                        )
                      }
                    >
                      Salvar explicação de {v.valor}
                    </Button>
                  </div>
                ))}
              </div>
            </details>
            <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
              <Input
                aria-label={`Novo valor de ${a.nome}`}
                value={name}
                maxLength={150}
                onChange={(e) => setName(e.target.value)}
                placeholder="Novo valor..."
              />
              <Button
                type="button"
                variant="outline"
                disabled={!name.trim()}
                onClick={add}
              >
                <Plus className="mr-1 h-4 w-4" />
                Adicionar
              </Button>
              <Textarea
                aria-label={`Explicação do novo valor de ${a.nome}`}
                className="sm:col-span-2"
                value={description}
                maxLength={1500}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explicação da opção (opcional)"
                rows={2}
              />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
