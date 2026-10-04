import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Download } from "lucide-react";
import { ToolkitShell, Field, Panel, Stat, ImagePicker } from "@/components/site";
import { getTool } from "@/data/toolsRegistry";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { demoImage, downloadCanvas } from "@/lib/imageTools";
import { SITE } from "@/data/site";

const PAGE_TITLE = `Studio vernis sélectif UV & dorure à chaud | ${SITE.tool} | ${SITE.name}`;
const PAGE_DESC = `Prévisualisez un vernis UV sélectif ou une dorure or, argent ou holographique, puis exportez le masque technique noir 100 % pour la production.`;

const tool = getTool("/spot-finish")!;

export const Route = createFileRoute("/_tool/spot-finish")({
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

const FINISHES = {
  uv: { label: "Vernis UV sélectif", stops: ["rgba(255,255,255,0.15)", "rgba(255,255,255,0.75)", "rgba(255,255,255,0.1)"] },
  gold: { label: "Dorure or", stops: ["#8a6a1f", "#f7e08a", "#b8892b"] },
  silver: { label: "Dorure argent", stops: ["#7d8590", "#f4f6f8", "#9aa3ad"] },
  holo: { label: "Holographique", stops: ["#f0abfc", "#67e8f9", "#fde68a"] },
} as const;
type Finish = keyof typeof FINISHES;
type Source = "dark" | "light" | "saturated";

function Page() {
  const [img, setImg] = useState<ImageData | null>(null);
  const [finish, setFinish] = useState<Finish>("gold");
  const [source, setSource] = useState<Source>("dark");
  const [threshold, setThreshold] = useState(110);
  const [angle, setAngle] = useState(35);
  const [coverage, setCoverage] = useState(0);
  const preview = useRef<HTMLCanvasElement>(null);
  const mask = useRef<HTMLCanvasElement>(null);

  useEffect(() => setImg(demoImage()), []);

  useEffect(() => {
    if (!img || !preview.current || !mask.current) return;
    const { width: w, height: h, data } = img;
    const m = new Uint8ClampedArray(w * h);
    let on = 0;
    for (let i = 0; i < w * h; i++) {
      const r = data[i * 4]!, g = data[i * 4 + 1]!, b = data[i * 4 + 2]!;
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;
      const sat = Math.max(r, g, b) - Math.min(r, g, b);
      const hit = source === "dark" ? lum < threshold : source === "light" ? lum > 255 - threshold : sat > 255 - threshold;
      if (hit) { m[i] = 1; on++; }
    }
    setCoverage((on / (w * h)) * 100);

    // Masque technique : noir 100 % = zone de finition
    const mc = mask.current; mc.width = w; mc.height = h;
    const mctx = mc.getContext("2d")!;
    const md = mctx.createImageData(w, h);
    for (let i = 0; i < w * h; i++) { const v = m[i] ? 0 : 255; md.data.set([v, v, v, 255], i * 4); }
    mctx.putImageData(md, 0, 0);

    // Aperçu : visuel + matière métallique / brillance
    const pc = preview.current; pc.width = w; pc.height = h;
    const ctx = pc.getContext("2d")!;
    ctx.putImageData(img, 0, 0);
    const layer = document.createElement("canvas"); layer.width = w; layer.height = h;
    const lctx = layer.getContext("2d")!;
    const rad = (angle * Math.PI) / 180;
    const gr = lctx.createLinearGradient(0, 0, Math.cos(rad) * w, Math.sin(rad) * h + h * 0.3);
    const st = FINISHES[finish].stops;
    gr.addColorStop(0, st[0]); gr.addColorStop(0.5, st[1]); gr.addColorStop(1, st[2]);
    lctx.fillStyle = gr; lctx.fillRect(0, 0, w, h);
    const ld = lctx.getImageData(0, 0, w, h);
    for (let i = 0; i < w * h; i++) if (!m[i]) ld.data[i * 4 + 3] = 0;
    lctx.putImageData(ld, 0, 0);
    ctx.drawImage(layer, 0, 0);
  }, [img, finish, source, threshold, angle]);

  return (
    <ToolkitShell tool={tool}>
      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <Panel title="Réglages">
          <div className="space-y-5">
            <ImagePicker onImage={(d) => setImg(d)} />
            <Field label="Finition">
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(FINISHES) as Finish[]).map((f) => (
                  <Button key={f} size="sm" variant={finish === f ? "default" : "outline"} onClick={() => setFinish(f)}>{FINISHES[f].label}</Button>
                ))}
              </div>
            </Field>
            <Field label="Zones à couvrir">
              <div className="grid grid-cols-3 gap-2">
                {([["dark", "Sombres"], ["light", "Claires"], ["saturated", "Vives"]] as const).map(([k, l]) => (
                  <Button key={k} size="sm" variant={source === k ? "default" : "outline"} onClick={() => setSource(k)}>{l}</Button>
                ))}
              </div>
            </Field>
            <Field label={`Seuil de détection : ${threshold}`}>
              <Slider min={10} max={245} value={[threshold]} onValueChange={(v) => setThreshold(v[0]!)} />
            </Field>
            <Field label={`Angle de la lumière : ${angle}°`}>
              <Slider min={0} max={180} value={[angle]} onValueChange={(v) => setAngle(v[0]!)} />
            </Field>
            <Stat label="Surface couverte" value={coverage.toFixed(1)} unit="%" tone={coverage > 60 ? "warning" : "default"} />
            <p className="text-xs text-muted-foreground">
              Conseil : traits ≥ 0,3 mm pour la dorure, ≥ 0,5 mm pour le vernis UV. Évitez de couvrir plus de 60 % de la surface.
            </p>
          </div>
        </Panel>
        <div className="space-y-6">
          <Panel title="Aperçu de la finition">
            <canvas ref={preview} className="w-full rounded-xl border border-border" />
            <Button className="mt-4" variant="outline" onClick={() => downloadCanvas(preview.current, "spc-apercu-finition.png")}><Download className="size-4" /> Aperçu PNG</Button>
          </Panel>
          <Panel title="Masque technique (noir 100 % = finition)">
            <canvas ref={mask} className="w-full rounded-xl border border-border" />
            <Button className="mt-4" onClick={() => downloadCanvas(mask.current, "spc-masque-finition.png")}><Download className="size-4" /> Télécharger le masque</Button>
          </Panel>
        </div>
      </div>
    </ToolkitShell>
  );
}
