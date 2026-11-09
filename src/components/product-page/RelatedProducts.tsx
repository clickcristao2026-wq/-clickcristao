import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { productPath } from "@/lib/product-links";
import type { ProductPageData, ProductCardData } from "./data";
import { money } from "./data";
import { ProductPhoto } from "./ProductGallery";

export function RelatedProducts({ product, onSelect }: { product: ProductPageData; onSelect: (item: ProductCardData) => void }) {
  const rail = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [stops, setStops] = useState([0]);
  useEffect(() => {
    const measure = () => {
      const node = rail.current;
      if (!node || !node.children.length) return;
      const max = Math.max(0, node.scrollWidth - node.clientWidth);
      const first = (node.children[0] as HTMLElement).offsetLeft;
      const positions = [...node.children].map(item => Math.min(max, Math.max(0, (item as HTMLElement).offsetLeft - first)));
      const unique = [...new Set(positions)];
      setStops(unique);
      setIndex(i => Math.min(i, unique.length - 1));
    };
    measure();
    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : null;
    if (rail.current) observer?.observe(rail.current);
    window.addEventListener("resize", measure);
    return () => { observer?.disconnect(); window.removeEventListener("resize", measure); };
  }, [product.recommendations]);
  const go = (i: number) => {
    const target = Math.max(0, Math.min(i, stops.length - 1));
    rail.current?.scrollTo({ left: stops[target], behavior: window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
    setIndex(target);
  };
  return <>
    {!!product.related.length && <section className="pp-related" aria-labelledby="related-heading"><h2 id="related-heading">Seu produto relacionado...</h2><div className="pp-outfit-grid" data-count={product.related.length}>
      <article className="pp-outfit-main"><ProductPhoto src={product.outfitImage || product.images[0]} alt={product.name} /><div><h3>{product.demo ? "Sapatênis de Couro" : product.name}</h3><p>{product.subtitle}</p></div></article>
      {product.related.slice(0, 3).map((item, i) => <article key={item.id} className={`pp-outfit-item pp-outfit-item-${i}`}><ProductPhoto src={item.image} alt={item.name} /><div><h3>{product.demo ? item.name : <Link to={productPath(item.id)}>{item.name}</Link>}</h3><p>{item.subtitle}</p><strong>{money(item.price)}</strong></div><button type="button" aria-label={`${product.demo ? "Adicionar" : "Ver anúncio de"} ${item.name}${product.demo ? " ao carrinho" : ""}`} onClick={() => onSelect(item)}><ShoppingCart /></button></article>)}
    </div></section>}
    {!!product.recommendations.length && <section className="pp-recommendations" aria-labelledby="recommendations-heading"><div className="pp-section-heading"><h2 id="recommendations-heading">Você também vai gostar...</h2>{stops.length > 1 && <div className="pp-recommendation-arrows"><button type="button" aria-label="Recomendação anterior" disabled={index === 0} onClick={() => go(index - 1)}><ChevronLeft /></button><button type="button" aria-label="Próxima recomendação" disabled={index === stops.length - 1} onClick={() => go(index + 1)}><ChevronRight /></button></div>}</div>
      <div className="pp-recommendation-rail" ref={rail} onScroll={() => { if (!rail.current) return; const left = rail.current.scrollLeft; setIndex(stops.reduce((nearest, stop, i) => Math.abs(stop - left) < Math.abs(stops[nearest] - left) ? i : nearest, 0)); }}>{product.recommendations.map(item => {
        const content = <><ProductPhoto src={item.image} alt={item.name} /><div><h3>{item.name}</h3><p>{item.subtitle}</p><strong>{money(item.price)}</strong></div></>;
        return product.demo ? <button type="button" key={item.id} className="pp-recommendation" onClick={() => onSelect(item)}>{content}</button> : <Link key={item.id} className="pp-recommendation" to={productPath(item.id)}>{content}</Link>;
      })}</div>
      {stops.length > 1 && <div className="pp-dots" aria-label="Navegar pelas recomendações">{stops.map((stop, i) => <button type="button" key={stop} aria-label={`Mostrar recomendação ${i + 1}`} aria-current={i === index ? "true" : undefined} onClick={() => go(i)} />)}</div>}
    </section>}
  </>;
}
