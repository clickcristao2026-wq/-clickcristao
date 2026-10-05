import { useEffect, useState } from "react";
import { X, ImagePlus, Video } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProductSection } from "./FormFields";
import type {
  MediaRole,
  ProductImage,
  ProductMediaUpload,
} from "@/types/product";
import { mediaLabels, mediaLimits } from "@/lib/product-form";

function LocalPreview({ file, video }: { file: File; video: boolean }) {
  const [url, setUrl] = useState("");
  useEffect(() => {
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);
  return video ? (
    <video
      src={url}
      controls
      preload="metadata"
      className="w-full rounded-md"
    />
  ) : (
    <img
      src={url}
      alt={file.name}
      className="h-28 w-full object-cover rounded-md"
    />
  );
}
export function MediaGroup({
  role,
  existing,
  uploads,
  onAdd,
  onRemoveExisting,
  onRemoveUpload,
}: {
  role: MediaRole;
  existing: ProductImage[];
  uploads: ProductMediaUpload[];
  onAdd: (role: MediaRole, files: File[]) => void;
  onRemoveExisting: (image: ProductImage) => void;
  onRemoveUpload: (upload: ProductMediaUpload) => void;
}) {
  const video = role === "video";
  const total = existing.length + uploads.length;
  const description =
    role === "destaque"
      ? "Selecione duas fotos para a apresentação inicial do produto nas prateleiras."
      : role === "galeria"
        ? "Escolha três imagens que apresentem as características do produto."
        : role === "corpo"
          ? "Separe duas imagens adicionais para integrar ao conteúdo do anúncio."
          : "Selecione um vídeo profissional referente ao produto.";
  return (
    <ProductSection title={mediaLabels[role].toUpperCase()}>
      <p className="text-sm text-muted-foreground">{description}</p>
      <div className="flex items-center gap-2 text-sm">
        {video ? (
          <Video className="h-4 w-4 text-[#0A20E7]" />
        ) : (
          <ImagePlus className="h-4 w-4 text-[#0A20E7]" />
        )}
        <span>
          {total} de {mediaLimits[role]} arquivo(s)
        </span>
      </div>
      <Label className="sr-only" htmlFor={`upload-${role}`}>
        {mediaLabels[role]}
      </Label>
      <Input
        id={`upload-${role}`}
        type="file"
        accept={
          video ? "video/mp4,video/webm" : "image/jpeg,image/png,image/webp"
        }
        multiple={!video}
        disabled={total >= mediaLimits[role]}
        onChange={(e) => {
          onAdd(role, Array.from(e.target.files ?? []));
          e.target.value = "";
        }}
      />
      <p className="text-xs text-muted-foreground">
        {video
          ? "MP4 ou WebM, até 100 MB. A IA considera os metadados do vídeo."
          : "JPG, PNG ou WebP, até 10 MB por imagem."}
      </p>
      <div
        className={`grid gap-3 ${video ? "sm:grid-cols-2" : "grid-cols-2 sm:grid-cols-3"}`}
      >
        {existing.map((image, i) => (
          <div key={image.id} className="relative rounded-lg border p-2">
            {video ? (
              <video
                src={image.url}
                controls
                preload="metadata"
                className="w-full rounded-md"
              />
            ) : (
              <img
                src={image.url}
                alt={`${mediaLabels[role]} ${i + 1}`}
                className="h-28 w-full rounded-md object-cover"
              />
            )}
            <button
              type="button"
              aria-label={`Remover ${mediaLabels[role].toLowerCase()} ${i + 1}`}
              onClick={() => onRemoveExisting(image)}
              className="absolute right-1 top-1 rounded-full bg-black/70 p-1 text-white"
            >
              <X className="h-4 w-4" />
            </button>
            <p className="text-xs text-muted-foreground mt-1">Arquivo salvo</p>
          </div>
        ))}
        {uploads.map((upload, i) => (
          <div
            key={`${upload.file.name}-${i}`}
            className="relative rounded-lg border p-2"
          >
            <LocalPreview file={upload.file} video={video} />
            <button
              type="button"
              aria-label={`Remover arquivo ${upload.file.name}`}
              onClick={() => onRemoveUpload(upload)}
              className="absolute right-1 top-1 rounded-full bg-black/70 p-1 text-white"
            >
              <X className="h-4 w-4" />
            </button>
            <p className="mt-1 truncate text-xs text-muted-foreground">
              {upload.file.name}
            </p>
          </div>
        ))}
      </div>
    </ProductSection>
  );
}
