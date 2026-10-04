import { Upload } from "lucide-react";
import { loadImageData } from "@/lib/imageTools";

export function ImagePicker({ onImage, label = "Importer une image (PNG, JPG)" }: { onImage: (d: ImageData, name: string) => void; label?: string }) {
  const pick = async (f?: File | null) => {
    if (!f || !f.type.startsWith("image/")) return;
    onImage(await loadImageData(f), f.name);
  };
  return (
    <label
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        void pick(e.dataTransfer.files[0]);
      }}
      className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-secondary/30 p-5 text-center text-sm transition-colors hover:border-primary"
    >
      <Upload className="size-5 text-muted-foreground" />
      <span className="mt-1.5 font-medium">{label}</span>
      <span className="mt-0.5 text-xs text-muted-foreground">Traitement local, aucun envoi.</span>
      <input type="file" accept="image/*" className="hidden" onChange={(e) => void pick(e.target.files?.[0])} />
    </label>
  );
}
