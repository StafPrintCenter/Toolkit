export async function loadImageData(file: File, maxSize = 900): Promise<ImageData> {
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
    const w = Math.max(1, Math.round(img.width * scale));
    const h = Math.max(1, Math.round(img.height * scale));
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(img, 0, 0, w, h);
    return ctx.getImageData(0, 0, w, h);
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function downloadCanvas(canvas: HTMLCanvasElement | null, name: string) {
  if (!canvas) return;
  const a = document.createElement("a");
  a.href = canvas.toDataURL("image/png");
  a.download = name;
  a.click();
}

export function downloadText(text: string, name: string, type: string) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([text], { type }));
  a.download = name;
  a.click();
  URL.revokeObjectURL(a.href);
}

/** Démo générée si l'utilisateur n'a pas encore importé d'image. */
export function demoImage(w = 600, h = 400): ImageData {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d")!;
  const g = ctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, "#f97316");
  g.addColorStop(0.5, "#0ea5e9");
  g.addColorStop(1, "#4f46e5");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "#fdfbf7";
  ctx.beginPath();
  ctx.arc(w * 0.28, h * 0.5, h * 0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#0f172a";
  ctx.font = `bold ${Math.round(h * 0.2)}px sans-serif`;
  ctx.fillText("SPC", w * 0.5, h * 0.6);
  return ctx.getImageData(0, 0, w, h);
}

export function rgbPixelToCmyk(r: number, g: number, b: number) {
  const rr = r / 255, gg = g / 255, bb = b / 255;
  const k = 1 - Math.max(rr, gg, bb);
  if (k >= 1) return [0, 0, 0, 1] as const;
  return [(1 - rr - k) / (1 - k), (1 - gg - k) / (1 - k), (1 - bb - k) / (1 - k), k] as const;
}
