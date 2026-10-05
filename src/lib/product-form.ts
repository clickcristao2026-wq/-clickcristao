import type {
  ProductDetails,
  ProductImage,
  ProductMediaUpload,
  MediaRole,
} from "@/types/product";
import { emptyPricing } from "@/lib/pricing";

export function defaultDetails(): ProductDetails {
  return {
    conteudoAnuncio: "",
    nomeLoja: "",
    qualidade: "",
    secao: "",
    avaliacao: {
      vendeOnline: null,
      produtoEstrelas: 0,
      atendimentoEstrelas: 0,
      vendasMensais: null,
      links: ["", "", ""],
    },
    precificacao: { ...emptyPricing },
  };
}
export function normalizeDetails(
  details?: Partial<ProductDetails> | null,
  price = 0,
): ProductDetails {
  const defaults = defaultDetails();
  return {
    ...defaults,
    ...details,
    avaliacao: { ...defaults.avaliacao, ...details?.avaliacao },
    precificacao: {
      ...defaults.precificacao,
      precoNormal: price,
      ...details?.precificacao,
    },
  };
}
export const mediaLimits: Record<MediaRole, number> = {
  destaque: 2,
  galeria: 3,
  corpo: 2,
  video: 1,
};
export const mediaLabels: Record<MediaRole, string> = {
  destaque: "Imagens destacadas",
  galeria: "Galeria do produto",
  corpo: "Imagens no corpo do anúncio",
  video: "Vídeo do produto",
};
export function validateMediaFile(file: File, role: MediaRole): string | null {
  const allowed =
    role === "video"
      ? ["video/mp4", "video/webm"]
      : ["image/jpeg", "image/png", "image/webp"];
  if (!allowed.includes(file.type))
    return role === "video"
      ? "Envie um vídeo MP4 ou WebM."
      : "Envie imagens JPG, PNG ou WebP.";
  if (!file.size || file.size > (role === "video" ? 100 : 10) * 1024 * 1024)
    return `O arquivo deve ter até ${role === "video" ? 100 : 10} MB e não pode estar vazio.`;
  return null;
}
export function validateMediaCount(
  existing: ProductImage[],
  uploads: ProductMediaUpload[],
  publish: boolean,
): string | null {
  for (const role of Object.keys(mediaLimits) as MediaRole[]) {
    const count =
      existing.filter((x) => x.papel === role).length +
      uploads.filter((x) => x.papel === role).length;
    if (count > mediaLimits[role])
      return `${mediaLabels[role]}: o limite é ${mediaLimits[role]} arquivo(s).`;
    if (publish && count !== mediaLimits[role])
      return `Para publicar, selecione ${mediaLimits[role]} arquivo(s) em ${mediaLabels[role].toLowerCase()}. Você pode salvar um rascunho enquanto prepara as mídias.`;
  }
  return null;
}
export function validateEvaluation(details: ProductDetails): string | null {
  const e = details.avaliacao;
  if (
    [e.produtoEstrelas, e.atendimentoEstrelas].some(
    (x) => !Number.isFinite(x) || x < 0 || x > 5,
    )
  )
    return "As avaliações devem estar entre 0 e 5 estrelas.";
  if (
    e.vendasMensais !== null &&
    (!Number.isInteger(e.vendasMensais) || e.vendasMensais < 0)
  )
    return "Informe uma média mensal de vendas válida, em unidades.";
  for (const link of e.links) {
    if (!link.trim()) continue;
    try {
      const url = new URL(link);
      if (!["https:", "http:"].includes(url.protocol)) throw new Error();
    } catch {
      return "Os links de comprovação devem começar com https:// ou http://.";
    }
  }
  return null;
}
