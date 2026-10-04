import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { ToolkitShell, Field, Panel, Stat, ImagePicker } from "@/components/site";
import { getTool } from "@/data/toolsRegistry";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { demoImage, rgbPixelToCmyk } from "@/lib/imageTools";
import { SITE } from "@/data/site";

const PAGE_TITLE = `Contrôle et séparation des plaques offset CMJN | ${SITE.tool} | ${SITE.name}`;
const PAGE_DESC = `ffichez séparément les plaques Cyan, Magenta, Jaune et Noir, simulez la superposition et le défaut de repérage, et repérez surcharge d'encre et noirs riches.`;

const tool = getTool("/cmyk-plates")!;

export const Route = createFileRoute("/_tool/cmyk-plates")({
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

const PLATES = [
  { label: "Cyan", rgb: [0, 160, 227] },
  { label: "Magenta", rgb: [230, 0, 126] },
  { label: "Jaune", rgb: [255, 237, 0] },
  { label: "Noir", rgb: [29, 29, 27] },
] as const;

function Page() {
  const [img, setImg] = useState<ImageData | null>(null);
  const [visible, setVisible] = useState([true, true, true, true]);
  const [tinted, setTinted] = useState(true);
  const [limit, setLimit] = useState(300);
  const [shift, setShift] = useState(0);
  const [showRisk, setShowRisk] = useState(false);
  const plateRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  const comp = useRef<HTMLCanvasElement>(null);

  useEffect(() => setImg(demoImage()), []);

  const sep = useMemo(() => {
    if (!img) return null;
    const { width: w, height: h, data } = img;
    const n = w * h;
    const ch = [0, 1, 2, 3].map(() => new Float32Array(n));
    const sums = [0, 0, 0, 0];
    for (let i = 0; i < n; i++) {
      // GCR léger : on transfère une partie du gris commun vers le noir
      const [c, m, y, k] = rgbPixelToCmyk(data[i * 4]!, data[i * 4 + 1]!, data[i * 4 + 2]!);
      const vals = [c * 0.95 + k * 0.6 * (1 - c), m * 0.92 + k * 0.5 * (1 - m), y * 0.92 + k * 0.5 * (1 - y), k];
      for (let j = 0; j < 4; j++) { ch[j]![i] = Math.min(1, vals[j]!); sums[j]! += ch[j]![i]!; }
    }
    return { w, h, ch, coverage: sums.map((s) => (s / n) * 100) };
  }, [img]);

  const stats = useMemo(() => {
    if (!sep) return null;
    const n = sep.w * sep.h;
    let maxTac = 0, over = 0, rich = 0, reg = 0;
    for (let i = 0; i < n; i++) {
      const c = sep.ch[0]![i]!, m = sep.ch[1]![i]!, y = sep.ch[2]![i]!, k = sep.ch[3]![i]!;
      const tac = (c + m + y + k) * 100;
      if (tac > maxTac) maxTac = tac;
      if (tac > limit) over++;
      if (k > 0.9 && c + m + y > 0.6) rich++;
      if (c > 0.85 && m > 0.85 && y > 0.85 && k > 0.85) reg++;
    }
    return { maxTac, over: (over / n) * 100, rich: (rich / n) * 100, reg: (reg / n) * 100 };
  }, [sep, limit]);

  useEffect(() => {
    if (!sep) return;
    const { w, h, ch } = sep;
    PLATES.forEach((p, j) => {
      const c = plateRefs.current[j]; if (!c) return;
      c.width = w; c.height = h;
      const ctx = c.getContext("2d")!;
      const d = ctx.createImageData(w, h);
      for (let i = 0; i < w * h; i++) {
        const v = ch[j]![i]!;
        if (tinted) { d.data[i * 4] = 255 - (255 - p.rgb[0]) * v; d.data[i * 4 + 1] = 255 - (255 - p.rgb[1]) * v; d.data[i * 4 + 2] = 255 - (255 - p.rgb[2]) * v; }
        else { const g = 255 - 255 * v; d.data[i * 4] = g; d.data[i * 4 + 1] = g; d.data[i * 4 + 2] = g; }
        d.data[i * 4 + 3] = 255;
      }
      ctx.putImageData(d, 0, 0);
    });
    const cc = comp.current; if (!cc) return;
    cc.width = w; cc.height = h;
    const ctx = cc.getContext("2d")!;
    const out = ctx.createImageData(w, h);
    // Décalage de repérage simulé : C vers la droite, M vers le bas, J vers la gauche
    const offs = [[shift, 0], [0, shift], [-shift, 0], [0, 0]];
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const i = y * w + x;
      let r = 1, g = 1, b = 1, tac = 0;
      for (let j = 0; j < 4; j++) {
        if (!visible[j]) continue;
        const sx = x - offs[j]![0]!, sy = y - offs[j]![1]!;
        if (sx < 0 || sy < 0 || sx >= w || sy >= h) continue;
        const v = ch[j]![sy * w + sx]!;
        tac += v;
        const p = PLATES[j]!.rgb;
        r *= 1 - (1 - p[0] / 255) * v; g *= 1 - (1 - p[1] / 255) * v; b *= 1 - (1 - p[2] / 255) * v;
      }
      const risk = showRisk && tac * 100 > limit;
      out.data[i * 4] = risk ? 255 : r * 255;
      out.data[i * 4 + 1] = risk ? 0 : g * 255;
      out.data[i * 4 + 2] = risk ? 64 : b * 255;
      out.data[i * 4 + 3] = 255;
    }
    ctx.putImageData(out, 0, 0);
  }, [sep, visible, tinted, shift, showRisk, limit]);

  return (
    <ToolkitShell tool={tool}>
      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        <Panel title="Fichier et contrôle">
          <div className="space-y-5">
            <ImagePicker onImage={(d) => setImg(d)} label="Importer un visuel (PNG, JPG)" />
            <Field label="Plaques affichées dans la superposition">
              <div className="grid grid-cols-4 gap-2">
                {PLATES.map((p, j) => (
                  <Button key={p.label} size="sm" variant={visible[j] ? "default" : "outline"} onClick={() => setVisible((v) => v.map((x, k) => (k === j ? !x : x)))}>{p.label[0]}</Button>
                ))}
              </div>
            </Field>
            <Field label={`Limite d'encrage : ${limit} %`}><Slider min={220} max={360} step={10} value={[limit]} onValueChange={(v) => setLimit(v[0]!)} /></Field>
            <Field label={`Défaut de repérage simulé : ${shift} px`}><Slider min={0} max={8} value={[shift]} onValueChange={(v) => setShift(v[0]!)} /></Field>
            <div className="grid grid-cols-2 gap-2">
              <Button size="sm" variant={showRisk ? "default" : "outline"} onClick={() => setShowRisk((s) => !s)}>Zones à risque</Button>
              <Button size="sm" variant="outline" onClick={() => setTinted((t) => !t)}>{tinted ? "Plaques en gris" : "Plaques colorées"}</Button>
            </div>
            {stats && (
              <div className="grid grid-cols-2 gap-3">
                <Stat label="TAC max" value={stats.maxTac.toFixed(0)} unit="%" tone={stats.maxTac > limit ? "danger" : "success"} />
                <Stat label="Surface en surcharge" value={stats.over.toFixed(1)} unit="%" tone={stats.over > 0.5 ? "warning" : "default"} />
                <Stat label="Noir riche" value={stats.rich.toFixed(1)} unit="%" />
                <Stat label="Noir de repérage" value={stats.reg.toFixed(1)} unit="%" tone={stats.reg > 0 ? "danger" : "default"} />
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Séparation simulée à partir des couleurs écran. Pour un PDF CMJN natif, contrôlez aussi avec l'aperçu des séparations d'Acrobat. Petits textes : 100 % noir seul, jamais en quadri.
            </p>
          </div>
        </Panel>
        <div className="space-y-6">
          <Panel title="Superposition des plaques">
            <canvas ref={comp} className="w-full rounded-xl border border-border" />
          </Panel>
          <Panel title="Plaques séparées">
            <div className="grid gap-4 sm:grid-cols-2">
              {PLATES.map((p, j) => (
                <div key={p.label} className="space-y-1.5">
                  <div className="flex justify-between text-sm font-medium"><span>{p.label}</span><span className="text-num text-muted-foreground">{sep ? sep.coverage[j]!.toFixed(0) : 0} %</span></div>
                  <canvas ref={(el) => { plateRefs.current[j] = el; }} className="w-full rounded-lg border border-border" />
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </ToolkitShell>
  );
}
