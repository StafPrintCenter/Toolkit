import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Download } from "lucide-react";
import { ToolkitShell, Field, Panel, Stat, ImagePicker } from "@/components/site";
import { getTool } from "@/data/toolsRegistry";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { demoImage, downloadCanvas, rgbPixelToCmyk } from "@/lib/imageTools";
import { SITE } from "@/data/site";

const PAGE_TITLE = `Séparateur de typons pour sérigraphie (trame demi-teinte) | ${SITE.tool} | ${SITE.name}`;
const PAGE_DESC = `Tramez votre image en demi-teintes, séparez-la en films monochrome ou CMJN et exportez les typons avec repères pour l'insolation des écrans.`;

const tool = getTool("/screen-print")!;

export const Route = createFileRoute("/_tool/screen-print")({
  head: () => ({
    meta: [
      { title: PAGE_TITLE },
      { name: "description", content: PAGE_DESC },
      { property: "og:title", content: PAGE_TITLE },
      { property: "og:description", content: PAGE_DESC },
    ],
  }),
  component: Page,
});

type Shape = "round" | "ellipse" | "line";
type Mode = "mono" | "cmyk";
const INKS = [
  { key: "c", label: "Cyan", color: "#00a0e3", angle: 15 },
  { key: "m", label: "Magenta", color: "#e6007e", angle: 75 },
  { key: "y", label: "Jaune", color: "#ffed00", angle: 0 },
  { key: "k", label: "Noir", color: "#1d1d1b", angle: 45 },
] as const;

/** Dessine une trame demi-teinte noire sur fond blanc à partir d'une carte de densité 0..1. */
function halftone(canvas: HTMLCanvasElement, dens: Float32Array, w: number, h: number, cell: number, angleDeg: number, shape: Shape, marks: boolean) {
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "#000";
  const a = (angleDeg * Math.PI) / 180, cos = Math.cos(a), sin = Math.sin(a);
  const R = Math.hypot(w, h);
  for (let u = -R; u < R; u += cell) {
    for (let v = -R; v < R; v += cell) {
      const x = w / 2 + u * cos - v * sin, y = h / 2 + u * sin + v * cos;
      if (x < -cell || y < -cell || x > w + cell || y > h + cell) continue;
      const px = Math.min(w - 1, Math.max(0, Math.round(x))), py = Math.min(h - 1, Math.max(0, Math.round(y)));
      const d = dens[py * w + px]!;
      if (d < 0.03) continue;
      ctx.beginPath();
      if (shape === "line") {
        ctx.save(); ctx.translate(x, y); ctx.rotate(a);
        ctx.fillRect(-cell / 2, (-cell * d) / 2, cell, cell * d);
        ctx.restore(); continue;
      }
      const r = (cell / 2) * Math.sqrt(d) * 1.25;
      if (shape === "ellipse") ctx.ellipse(x, y, r * 1.25, r * 0.8, a, 0, Math.PI * 2);
      else ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  if (marks) {
    ctx.strokeStyle = "#000"; ctx.lineWidth = 1.5;
    [[14, 14], [w - 14, 14], [14, h - 14], [w - 14, h - 14]].forEach(([x, y]) => {
      ctx.beginPath(); ctx.arc(x!, y!, 7, 0, Math.PI * 2); ctx.moveTo(x! - 12, y!); ctx.lineTo(x! + 12, y!); ctx.moveTo(x!, y! - 12); ctx.lineTo(x!, y! + 12); ctx.stroke();
    });
  }
}

function Page() {
  const [img, setImg] = useState<ImageData | null>(null);
  const [mode, setMode] = useState<Mode>("mono");
  const [shape, setShape] = useState<Shape>("round");
  const [lpi, setLpi] = useState(45);
  const [angle, setAngle] = useState(22);
  const [garment, setGarment] = useState("#fdfbf7");
  const refs = useRef<(HTMLCanvasElement | null)[]>([]);
  const composite = useRef<HTMLCanvasElement>(null);

  useEffect(() => setImg(demoImage()), []);

  // Aperçu basé sur une impression virtuelle de 25 cm de large
  const cell = img ? Math.max(3, img.width / ((25 / 2.54) * lpi)) : 6;

  const plates = useMemo(() => {
    if (!img) return [];
    const { width: w, height: h, data } = img;
    const n = w * h;
    if (mode === "mono") {
      const d = new Float32Array(n);
      for (let i = 0; i < n; i++) d[i] = 1 - (0.299 * data[i * 4]! + 0.587 * data[i * 4 + 1]! + 0.114 * data[i * 4 + 2]!) / 255;
      return [{ label: "Film unique", color: "#1d1d1b", angle, dens: d }];
    }
    const arr = INKS.map(() => new Float32Array(n));
    for (let i = 0; i < n; i++) {
      const c = rgbPixelToCmyk(data[i * 4]!, data[i * 4 + 1]!, data[i * 4 + 2]!);
      for (let j = 0; j < 4; j++) arr[j]![i] = c[j]!;
    }
    return INKS.map((ink, j) => ({ label: ink.label, color: ink.color, angle: ink.angle + (angle - 22), dens: arr[j]! }));
  }, [img, mode, angle]);

  useEffect(() => {
    if (!img) return;
    const { width: w, height: h } = img;
    plates.forEach((p, i) => { const c = refs.current[i]; if (c) halftone(c, p.dens, w, h, cell, p.angle, shape, true); });
    const cc = composite.current; if (!cc) return;
    cc.width = w; cc.height = h;
    const ctx = cc.getContext("2d")!;
    ctx.fillStyle = garment; ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = "multiply";
    plates.forEach((p, i) => {
      const src = refs.current[i]; if (!src) return;
      const t = document.createElement("canvas"); t.width = w; t.height = h;
      const tctx = t.getContext("2d")!;
      tctx.fillStyle = p.color; tctx.fillRect(0, 0, w, h);
      tctx.globalCompositeOperation = "destination-in";
      // Transforme le noir du film en masque alpha
      const f = src.getContext("2d")!.getImageData(0, 0, w, h);
      for (let k = 0; k < f.data.length; k += 4) { f.data[k + 3] = 255 - f.data[k]!; }
      const mc = document.createElement("canvas"); mc.width = w; mc.height = h; mc.getContext("2d")!.putImageData(f, 0, 0);
      tctx.drawImage(mc, 0, 0);
      ctx.drawImage(t, 0, 0);
    });
    ctx.globalCompositeOperation = "source-over";
  }, [plates, cell, shape, garment, img]);

  return (
    <ToolkitShell tool={tool}>
      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        <Panel title="Réglages de trame">
          <div className="space-y-5">
            <ImagePicker onImage={(d) => setImg(d)} />
            <Field label="Séparation">
              <div className="grid grid-cols-2 gap-2">
                <Button size="sm" variant={mode === "mono" ? "default" : "outline"} onClick={() => setMode("mono")}>1 couleur</Button>
                <Button size="sm" variant={mode === "cmyk" ? "default" : "outline"} onClick={() => setMode("cmyk")}>Quadri CMJN</Button>
              </div>
            </Field>
            <Field label="Forme du point">
              <div className="grid grid-cols-3 gap-2">
                {([["round", "Rond"], ["ellipse", "Elliptique"], ["line", "Ligne"]] as const).map(([k, l]) => (
                  <Button key={k} size="sm" variant={shape === k ? "default" : "outline"} onClick={() => setShape(k)}>{l}</Button>
                ))}
              </div>
            </Field>
            <Field label={`Linéature : ${lpi} lpi`}><Slider min={25} max={85} value={[lpi]} onValueChange={(v) => setLpi(v[0]!)} /></Field>
            <Field label={`Angle de trame : ${angle}°`}><Slider min={0} max={90} value={[angle]} onValueChange={(v) => setAngle(v[0]!)} /></Field>
            <Field label="Couleur du textile"><Input type="color" value={garment} onChange={(e) => setGarment(e.target.value)} className="h-11 p-1" /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Stat label="Maille conseillée" value={`${Math.round((lpi * 4) / 2.54)}–${Math.round((lpi * 5) / 2.54)}`} unit="fils/cm" />
              <Stat label="Films" value={String(plates.length)} />
            </div>
            <p className="text-xs text-muted-foreground">Règle : maille ≈ 4 à 5 × la linéature. Sur textile foncé, prévoyez une sous-couche blanche.</p>
          </div>
        </Panel>
        <div className="space-y-6">
          <Panel title="Simulation sur textile">
            <canvas ref={composite} className="w-full rounded-xl border border-border" />
          </Panel>
          <Panel title="Films d'insolation (noir opaque)">
            <div className="grid gap-4 sm:grid-cols-2">
              {plates.map((p, i) => (
                <div key={p.label} className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium"><span className="size-3 rounded-full" style={{ background: p.color }} /> {p.label} · {Math.round(p.angle)}°</div>
                  <canvas ref={(el) => { refs.current[i] = el; }} className="w-full rounded-lg border border-border" />
                  <Button size="sm" variant="outline" onClick={() => downloadCanvas(refs.current[i] ?? null, `spc-typon-${p.label.toLowerCase().replace(/\s/g, "-")}.png`)}>
                    <Download className="size-4" /> Film PNG
                  </Button>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </ToolkitShell>
  );
}
