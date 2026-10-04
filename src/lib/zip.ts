import { zipSync } from "fflate";

async function canvasBytes(c: HTMLCanvasElement): Promise<Uint8Array> {
  const blob = await new Promise<Blob | null>((r) => c.toBlob(r, "image/png"));
  return new Uint8Array(await (blob ?? new Blob()).arrayBuffer());
}

/** Regroupe plusieurs canvas en PNG dans une archive ZIP téléchargée côté navigateur. */
export async function downloadCanvasesZip(items: { name: string; canvas: HTMLCanvasElement | null }[], zipName: string) {
  const files: Record<string, Uint8Array> = {};
  for (const it of items) if (it.canvas) files[it.name] = await canvasBytes(it.canvas);
  const data = zipSync(files, { level: 0 });
  const url = URL.createObjectURL(new Blob([data as BlobPart], { type: "application/zip" }));
  const a = document.createElement("a");
  a.href = url; a.download = zipName; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
