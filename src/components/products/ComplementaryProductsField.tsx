import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProductSection } from "./FormFields";
import { fetchPublishedProducts } from "@/lib/products";
import { formatBRL } from "@/lib/pricing";
import type { Product } from "@/types/product";

export function ComplementaryProductsField({ selected, excludeId, onChange }: {
  selected: string[];
  excludeId?: string;
  onChange: (ids: string[]) => void;
}) {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [known, setKnown] = useState<Record<string, Product>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedError, setSelectedError] = useState(false);
  const selectedKey = selected.join(",");

  useEffect(() => {
    const ids = selectedKey.split(",").filter(Boolean);
    if (!ids.length) return;
    let active = true;
    fetchPublishedProducts({ ids, excludeId, limit: 3 }).then(products => {
      if (active) { setKnown(old => ({ ...old, ...Object.fromEntries(products.map(p => [p.id, p])) })); setSelectedError(false); }
    }).catch(() => { if (active) setSelectedError(true); });
    return () => { active = false; };
  }, [selectedKey, excludeId]);

  useEffect(() => {
    let active = true;
    setResults([]);
    setError("");
    if (search.trim().length < 2) { setLoading(false); return; }
    setLoading(true);
    const timer = window.setTimeout(() => {
      fetchPublishedProducts({ search, excludeId, limit: 20 }).then(products => {
        if (!active) return;
        setResults(products);
        setKnown(old => ({ ...old, ...Object.fromEntries(products.map(p => [p.id, p])) }));
      }).catch(() => { if (active) setError("Não foi possível buscar produtos. Altere a busca para tentar novamente."); })
        .finally(() => { if (active) setLoading(false); });
    }, 250);
    return () => { active = false; window.clearTimeout(timer); };
  }, [search, excludeId]);

  return <ProductSection title="PRODUTOS COMPLEMENTARES">
    <p className="text-sm text-muted-foreground">Escolha até três anúncios para o bloco “Seu produto relacionado”. Eles aparecerão com nome, foto e preço atualizados do catálogo. As recomendações da mesma categoria são automáticas.</p>
    {!!selected.length && <ul className="space-y-2" aria-label="Complementares selecionados">{selected.map(id => <li className="flex items-center justify-between gap-3 rounded-md border px-3 py-2 text-sm" key={id}><span>{known[id]?.nome || `Anúncio selecionado (${id.slice(0, 8)})`}</span><Button type="button" variant="ghost" size="sm" onClick={() => onChange(selected.filter(value => value !== id))} aria-label={`Remover complementar ${known[id]?.nome || id}`}><X className="h-4 w-4" /></Button></li>)}</ul>}
    {selectedError && <p className="text-sm text-amber-700" role="status">Os vínculos salvos foram preservados. Alguns nomes não puderam ser carregados.</p>}
    <div><label htmlFor="complementary-search" className="text-sm">Buscar produtos complementares</label><Input id="complementary-search" className="mt-1" value={search} onChange={event => setSearch(event.target.value)} placeholder="Digite pelo menos 2 letras do nome" /></div>
    {loading && <p role="status" className="text-sm text-muted-foreground">Buscando produtos...</p>}
    {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
    {!loading && !error && search.trim().length >= 2 && !results.length && <p className="text-sm text-muted-foreground">Nenhum anúncio publicado encontrado.</p>}
    <div className="max-h-72 overflow-y-auto space-y-1">{results.map(product => <label key={product.id} className="flex cursor-pointer items-center gap-3 rounded-md border p-3 text-sm"><input type="checkbox" aria-label={`Selecionar ${product.nome}`} checked={selected.includes(product.id)} disabled={selected.length >= 3 && !selected.includes(product.id)} onChange={() => onChange(selected.includes(product.id) ? selected.filter(id => id !== product.id) : [...selected, product.id].slice(0, 3))} /><span className="flex-1">{product.nome}</span><span>{formatBRL(product.preco)}</span></label>)}</div>
    <p className="text-xs text-muted-foreground">{selected.length} de 3 selecionados. Anúncios pausados ou removidos não aparecem na página pública.</p>
  </ProductSection>;
}
