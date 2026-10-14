import { useState } from "react";
import { Eye, EyeOff, Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { ProductCategory } from "@/types/product";
interface Props {
  title: string;
  items: ProductCategory[];
  selectedId: string;
  onSelect: (id: string) => void;
  onAdd: (name: string) => Promise<boolean>;
  onToggle: (category: ProductCategory) => void;
  onDelete: (category: ProductCategory) => void;
  disabledAdd?: boolean;
}
export function CategoryColumn({
  title,
  items,
  selectedId,
  onSelect,
  onAdd,
  onToggle,
  onDelete,
  disabledAdd,
}: Props) {
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const add = async () => {
    if (busy || !name.trim()) return;
    setBusy(true);
    try {
      if (await onAdd(name.trim())) setName("");
    } finally {
      setBusy(false);
    }
  };
  return (
    <section className="flex flex-col gap-2 rounded-lg border bg-white p-3">
      <h3 className="text-sm font-semibold">{title}</h3>
      <div className="min-h-24 max-h-80 flex-1 space-y-1 overflow-y-auto">
        {!items.length && (
          <p className="py-2 text-xs text-muted-foreground">Nenhum item.</p>
        )}
        {items.map((item) => (
          <div
            key={item.id}
            className={`flex items-center gap-1 rounded-md ${selectedId === item.id ? "bg-blue-50 text-blue-700" : "hover:bg-slate-50"}`}
          >
            <button
              type="button"
              aria-label={`Selecionar ${item.nome}`}
              aria-pressed={selectedId === item.id}
              onClick={() => onSelect(item.id)}
              className={`min-w-0 flex-1 rounded-md px-2 py-2 text-left text-sm ${!item.ativo ? "text-muted-foreground line-through" : ""}`}
            >
              {item.nome}
            </button>
            <button
              type="button"
              aria-label={`${item.ativo ? "Desativar" : "Ativar"} ${item.nome}`}
              onClick={() => onToggle(item)}
              className="rounded p-1"
            >
              {item.ativo ? (
                <Eye className="h-3.5 w-3.5" />
              ) : (
                <EyeOff className="h-3.5 w-3.5" />
              )}
            </button>
            <button
              type="button"
              aria-label={`Excluir ${item.nome}`}
              onClick={() => onDelete(item)}
              className="rounded p-1 text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
      {!disabledAdd && (
        <div className="flex gap-1 border-t pt-2">
          <Input
            aria-label={`Adicionar ${title.toLowerCase()}`}
            value={name}
            maxLength={150}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                void add();
              }
            }}
            disabled={busy}
            placeholder="Adicionar..."
            className="h-9 text-sm"
          />
          <Button
            type="button"
            size="sm"
            aria-label={`Salvar ${title.toLowerCase()}`}
            disabled={busy || !name.trim()}
            onClick={add}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      )}
    </section>
  );
}
