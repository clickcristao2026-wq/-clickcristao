import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ChevronRight, Crown, Heart, ListFilter, Megaphone, Minus, Plus, Share2, ShoppingCart, Shuffle, Star, Store, Tag, TicketPercent, Truck, Zap } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { fetchProductForPreview, fetchPublishedProductById } from "@/lib/products";
import { fetchProductPageContext } from "@/lib/product-page-context";
import { productPath } from "@/lib/product-links";
import { useAuth } from "@/contexts/AuthContext";
import { ProductGallery, ProductPhoto } from "@/components/product-page/ProductGallery";
import { ProductTabs } from "@/components/product-page/ProductTabs";
import { RelatedProducts } from "@/components/product-page/RelatedProducts";
import { demoProduct, money, toProductPage, type ProductCardData, type ProductPageData } from "@/components/product-page/data";
import "./Produto.css";

const conditionIcons = { leader: Crown, affiliate: Tag, shipping: Truck, coupon: TicketPercent };
type Panel = "cart" | "checkout" | "seller" | "filter" | "compare" | "report" | "share" | "item" | null;

export function ProductPageView({ product }: { product: ProductPageData }) {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [favorite, setFavorite] = useState(false);
  const [panel, setPanel] = useState<Panel>(null);
  const [item, setItem] = useState<ProductCardData | null>(null);
  const [notice, setNotice] = useState("");
  const purchasable = product.demo && product.stock !== null && product.stock > 0;

  useEffect(() => {
    const previous = document.title;
    document.title = `${product.name} | Click Cristão`;
    return () => { document.title = previous; };
  }, [product.name]);

  const selectItem = (selected: ProductCardData) => {
    if (!product.demo) { navigate(productPath(selected.id)); return; }
    setItem(selected); setPanel("item");
  };
  const purchase = (next: "cart" | "checkout") => { if (purchasable) setPanel(next); };
  const share = async () => {
    try {
      if (navigator.share) await navigator.share({ title: product.name, url: window.location.href });
      else if (navigator.clipboard?.writeText) { await navigator.clipboard.writeText(window.location.href); setNotice("Link do produto copiado."); }
      else setPanel("share");
    } catch (error) { if (!(error instanceof DOMException && error.name === "AbortError")) setPanel("share"); }
  };

  return <div className="product-page" data-demo={product.demo}>
    {product.demo && <aside className="pp-demo-note"><Link to="/" aria-label="Voltar ao Click Cristão"><ArrowLeft size={14} /> Click Cristão</Link><span>Prévia do layout · produtos, preços e condições ilustrativos</span></aside>}
    {product.preview && <aside className="pp-demo-note"><Link to="/account/produtos"><ArrowLeft size={14} /> Meus produtos</Link><span>Pré-visualização privada · este anúncio ainda não está público</span></aside>}
    <main className="pp-container" id="product-content">
      <section className="pp-hero" aria-label="Apresentação do produto">
        <nav className="pp-breadcrumb" aria-label="Navegação estrutural"><Link to="/">Home</Link>{product.breadcrumbs.map(part => <span key={part}><span aria-hidden="true">/</span>{part}</span>)}<span className="pp-breadcrumb-current"><span aria-hidden="true">/</span>{product.name}</span></nav>
        <ProductGallery images={product.images} name={product.name} />
        <div className="pp-title-row"><h1>{product.name}</h1><button type="button" aria-label="Compartilhar produto" className="pp-share" onClick={share}><Share2 /></button></div>
        <div className="pp-meta"><button type="button" className="pp-rating" onClick={() => { document.getElementById("product-tab-4")?.click(); document.getElementById("product-tab-4")?.scrollIntoView({ behavior: "smooth", block: "center" }); }}>
          {product.rating !== null ? <><span className="pp-stars" aria-label={`${product.rating} de 5 estrelas`}>{[0, 1, 2, 3, 4].map(i => <Star key={i} fill="currentColor" />)}</span><strong>{product.rating.toFixed(1)}</strong><span>Avaliações</span></> : <span>Ainda sem avaliações</span>}
        </button><span className="pp-code">Código: {product.sku}</span></div>
        <div className="pp-price"><strong>{money(product.price)}</strong>{product.installments && <p>{product.installments}</p>}{!product.demo && <span className="pp-stock">Disponibilidade a confirmar com o vendedor</span>}</div>
        <button type="button" className="pp-seller" onClick={() => setPanel("seller")} aria-label={`Ver loja ${product.seller.name}`}><span className="pp-store-icon"><Store /></span><span><span className="pp-seller-label">Nome da Loja</span><strong className={product.demo ? "pp-demo-seller-name" : ""}>{product.seller.name}</strong>{product.seller.rating !== null && <span className="pp-seller-rating"><Star fill="currentColor" /><b>{product.seller.rating.toFixed(1)}</b> Avaliações</span>}{product.seller.partner && <span>Parceiro Associado</span>}</span><ChevronRight className="pp-seller-chevron" /></button>
        <p className="pp-summary">{product.summary || "O vendedor ainda não adicionou um resumo deste produto."}</p>
        <div className="pp-purchase"><div className="pp-quantity-group"><label id="quantity-label">Quantidade:</label><div className="pp-quantity" aria-labelledby="quantity-label"><button type="button" aria-label="Diminuir quantidade" disabled={quantity <= 1} onClick={() => setQuantity(q => Math.max(1, q - 1))}><Minus /></button><output aria-label="Quantidade selecionada" aria-live="polite">{quantity}</output><button type="button" aria-label="Aumentar quantidade" disabled={!purchasable || quantity >= (product.stock ?? 1)} onClick={() => setQuantity(q => Math.min(product.stock ?? 1, q + 1))}><Plus /></button></div></div>
          <button type="button" className="pp-button pp-button-primary" disabled={!purchasable} onClick={() => purchase("cart")}><ShoppingCart />Adicionar ao carrinho</button>
          <button type="button" className="pp-button pp-button-outline" disabled={!purchasable} onClick={() => purchase("checkout")}><Zap />Comprar agora</button>
          {!product.demo && <p className="pp-purchase-note">A compra ficará disponível após a integração do estoque e checkout.</p>}
        </div>
        <div className="pp-actions"><button type="button" onClick={() => setPanel("filter")}><ListFilter />Filtrar</button><button type="button" onClick={() => setPanel("compare")}><Shuffle />Comparar</button><button type="button" aria-pressed={favorite} onClick={() => { setFavorite(v => !v); setNotice(favorite ? "Produto removido dos favoritos desta visita." : "Produto favoritado nesta visita."); }}><Heart fill={favorite ? "currentColor" : "none"} />{favorite ? "Favoritado" : "Favoritar"}</button><button type="button" onClick={() => setPanel("report")}><Megaphone />Denunciar</button></div>
      </section>

      <section className="pp-editorial" data-has-photos={product.editorial.length > 0} aria-label="Condições e descrição do produto"><div className="pp-editorial-copy">
        {!!product.conditions.length && <div className="pp-conditions"><h2>Condições do Produto</h2><ul>{product.conditions.map(condition => { const Icon = conditionIcons[condition.kind]; return <li key={condition.kind}><Icon />{condition.text}</li>; })}</ul></div>}
        <div className="pp-description"><h2>Descrição do produto</h2>{product.description.length ? product.description.map((text, i) => <p key={i}>{text}</p>) : <p>Descrição ainda não informada pelo vendedor.</p>}</div>
      </div><EditorialPhotos product={product} /></section>
      <ProductTabs tabs={product.tabs} />
      <div className="pp-mobile-editorial"><EditorialPhotos product={product} /></div>
      {(product.video || product.videoPreview) && <section className="pp-video" aria-labelledby="video-heading"><h2 id="video-heading">Vídeo do produto</h2>{product.video ? <video controls preload="metadata" playsInline poster={product.videoPreview} aria-label={`Vídeo de ${product.name}`} onError={() => setNotice("Não foi possível carregar o vídeo. Tente novamente mais tarde.")}><source src={product.video} />Seu navegador não consegue reproduzir este vídeo.</video> : <figure aria-label="Prévia visual do vídeo"><ProductPhoto src={product.videoPreview!} alt="Referência do vídeo: sapatênis de couro em um smartphone" /><figcaption>Capa da referência visual. O arquivo de vídeo ainda não foi fornecido.</figcaption></figure>}</section>}
      <RelatedProducts product={product} onSelect={selectItem} />
      <p role="status" className={notice ? "pp-notice" : "pp-sr-only"} onClick={() => setNotice("")}>{notice}</p>
    </main>

    <Dialog open={panel !== null} onOpenChange={open => { if (!open) setPanel(null); }}><DialogContent className="pp-dialog">
      <DialogTitle>{panel === "seller" ? product.seller.name : panel === "filter" ? "Características do produto" : panel === "compare" ? "Comparar produtos" : panel === "report" ? "Denunciar anúncio" : panel === "share" ? "Compartilhar produto" : panel === "item" ? item?.name : panel === "checkout" ? "Prévia da compra" : "Prévia do carrinho"}</DialogTitle>
      <DialogDescription>{panel === "cart" || panel === "checkout" || panel === "item" ? "Demonstração do layout. Nenhum pedido ou pagamento será realizado." : panel === "seller" ? "Informações da loja exibidas neste anúncio." : panel === "report" ? "O envio de denúncias estará disponível com a integração de atendimento." : panel === "compare" ? "Consulte os preços e características dos produtos apresentados." : panel === "filter" ? "Informações fornecidas para este anúncio." : "Copie o endereço para compartilhar."}</DialogDescription>
      {(panel === "cart" || panel === "checkout") && <><div className="pp-cart-line"><ProductPhoto src={product.images[0]} alt={product.name} /><div><h3>{product.name}</h3><p>{quantity} {quantity === 1 ? "unidade" : "unidades"}</p><strong>{money(product.price * quantity)}</strong></div></div><button type="button" className="pp-button pp-button-primary" onClick={() => setPanel(null)}>Continuar explorando</button></>}
      {panel === "item" && item && <><ProductPhoto className="pp-item-preview" src={item.image} alt={item.name} /><p>{item.subtitle}</p><strong className="pp-dialog-price">{money(item.price)}</strong><p>Item ilustrativo da composição. A compra depende de um anúncio publicado no catálogo.</p></>}
      {panel === "seller" && <><div className="pp-seller-details"><Store /><strong>{product.seller.name}</strong></div><p>{product.demo ? "Loja ilustrativa da referência. Nome e nota são dados de demonstração." : "Nome informado pelo vendedor no cadastro do produto. A página pública da loja ainda não está disponível."}</p></>}
      {panel === "filter" && <dl className="pp-characteristics"><div><dt>Produto</dt><dd>{product.name}</dd></div><div><dt>Modelo</dt><dd>{product.subtitle || "Não informado"}</dd></div><div><dt>Código</dt><dd>{product.sku}</dd></div>{product.demo && <div><dt>Material</dt><dd>Couro legítimo (referência ilustrativa)</dd></div>}</dl>}
      {panel === "compare" && <div className="pp-comparison"><div><b>{product.name}</b><strong>{money(product.price)}</strong></div>{product.recommendations.map(p => <div key={p.id}><b>{p.name}</b><strong>{money(p.price)}</strong></div>)}{!product.recommendations.length && <p>Outros produtos ainda não foram configurados para comparação.</p>}</div>}
      {panel === "report" && <><label htmlFor="report-reason">Motivo da denúncia</label><textarea id="report-reason" rows={3} placeholder="Descreva o problema encontrado no anúncio" /><p className="pp-purchase-note">O formulário é uma prévia. Nenhuma denúncia será enviada.</p><button type="button" className="pp-button pp-button-outline" onClick={() => setPanel(null)}>Fechar</button></>}
      {panel === "share" && <input aria-label="Link do produto" readOnly value={window.location.href} onFocus={e => e.currentTarget.select()} />}
    </DialogContent></Dialog>
  </div>;
}

function EditorialPhotos({ product }: { product: ProductPageData }) {
  if (!product.editorial.length) return null;
  return <div className="pp-editorial-photos">{product.editorial.map((src, i) => <ProductPhoto key={src} src={src} alt={`${product.name} — detalhe ${i + 1}`} />)}</div>;
}

export default function Produto({ preview = false }: { preview?: boolean }) {
  const { id } = useParams();
  const { user } = useAuth();
  const query = useQuery({ queryKey: ["product-page", id, preview ? user?.id : "public"], queryFn: () => preview ? fetchProductForPreview(id!, user!.id) : fetchPublishedProductById(id!), enabled: Boolean(id) && (!preview || Boolean(user)), retry: 1 });
  const context = useQuery({ queryKey: ["product-page-context", id, query.data?.updatedAt], queryFn: () => fetchProductPageContext(query.data!), enabled: Boolean(query.data), retry: 1 });
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, [id, preview]);
  if (!id) return <ProductPageView key="demo" product={demoProduct} />;
  if (query.isLoading) return <main className="pp-route-state" role="status"><span className="pp-loading" />Carregando produto...</main>;
  if (query.isError || !query.data || (!preview && query.data.status !== "publicado")) return <main className="pp-route-state"><h1>Produto indisponível</h1><p>{query.isError ? "Não foi possível carregar este anúncio. Tente novamente." : "Este anúncio não foi encontrado ou não está publicado."}</p>{query.isError && <button type="button" onClick={() => query.refetch()}>Tentar novamente</button>}<Link to="/">Voltar ao início</Link></main>;
  return <><ProductPageView key={query.data.id} product={{ ...toProductPage(query.data, context.data), preview: preview && query.data.status !== "publicado" }} />{(context.isError || context.data?.incomplete) && <p role="status" className="pp-context-note">Algumas sugestões não puderam ser carregadas. <button type="button" onClick={() => context.refetch()}>Tentar novamente</button></p>}</>;
}
