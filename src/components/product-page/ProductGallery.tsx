import { useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Expand, ImageOff } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

export function ProductPhoto({ src, alt, priority = false, className = "" }: { src: string; alt: string; priority?: boolean; className?: string }) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  if (!src || failedSrc === src) return <div className={`pp-photo-empty ${className}`} role="img" aria-label={alt}><ImageOff /><span>Imagem indisponível</span></div>;
  const local = src.startsWith("/images/produto/");
  return <img className={className} src={src} alt={alt} onError={() => setFailedSrc(src)} loading={priority ? "eager" : "lazy"} {...{ fetchpriority: priority ? "high" : "auto" }} decoding="async" width="960" height="960" sizes="(max-width: 767px) 92vw, (max-width: 1023px) 46vw, 42vw" srcSet={local ? `${src.replace("-960.webp", "-480.webp")} 480w, ${src} 960w` : undefined} />;
}

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const photos = images.length ? images : [""];
  const step = (delta: number) => setActive(i => (i + delta + photos.length) % photos.length);
  return <div className="pp-gallery">
    <div className="pp-thumbnails" aria-label="Fotos do produto">
      <div className="pp-thumbnail-list">{photos.map((src, i) => <button type="button" key={`${src}-${i}`} className={active === i ? "is-active" : ""} aria-label={`Ver foto ${i + 1}`} aria-pressed={active === i} onClick={() => setActive(i)}><ProductPhoto src={i === 0 && src.startsWith("/images/produto/") ? "/images/produto/galeria-1-480.webp" : src} alt={`Miniatura ${i + 1}`} /></button>)}</div>
      {photos.length > 1 && <div className="pp-gallery-navigation"><button type="button" aria-label="Foto anterior" onClick={() => step(-1)}><ChevronUp /></button><button type="button" aria-label="Próxima foto" onClick={() => step(1)}><ChevronDown /></button></div>}
    </div>
    <div className="pp-main-photo" onTouchStart={e => { e.currentTarget.dataset.touchX = String(e.touches[0].clientX); }} onTouchEnd={e => { const start = Number(e.currentTarget.dataset.touchX); const delta = e.changedTouches[0].clientX - start; if (Math.abs(delta) > 45) step(delta < 0 ? 1 : -1); }}>
      <ProductPhoto key={photos[active]} src={photos[active]} alt={`${name} — foto ${active + 1}`} priority />
      <button type="button" className="pp-expand" aria-label="Ampliar imagem" onClick={() => setExpanded(true)}><Expand /></button>
    </div>
    <Dialog open={expanded} onOpenChange={setExpanded}><DialogContent className="pp-dialog pp-lightbox"><DialogTitle>{name}</DialogTitle><DialogDescription>Visualização ampliada das fotos do produto. Use as setas para navegar.</DialogDescription><ProductPhoto src={photos[active]} alt={`${name} ampliado`} priority /><div className="pp-lightbox-nav"><button type="button" onClick={() => step(-1)} aria-label="Imagem ampliada anterior"><ChevronLeft /></button><span>{active + 1} / {photos.length}</span><button type="button" onClick={() => step(1)} aria-label="Próxima imagem ampliada"><ChevronRight /></button></div></DialogContent></Dialog>
  </div>;
}
