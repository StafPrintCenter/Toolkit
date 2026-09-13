import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { AlertTriangle, CheckCircle2, Upload } from "lucide-react";
import { ToolkitShell, Field, Panel } from "@/components/site";
import { getTool } from "@/data/toolsRegistry";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { gamutDelta, hexToRgb, rgbToCmyk, rgbToHex, simulatePaper } from "@/lib/color";
import { SITE } from "@/data/site";

const PAGE_TITLE = `Convertisseur RVB vers CMJN & simulateur papier | SPC Toolkit | ${SITE.name}`;
const PAGE_DESC = `Convertissez une couleur hex/RVB en CMJN, simulez le rendu sur papier mat ou brillant et détectez les couleurs hors gamme d'impression.`;

const tool = getTool("/rgb-to-cmyk")!;

export const Route = createFileRoute("/_tool/rgb-to-cmyk")({
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

function Page() {
  const [hex, setHex] = useState("#f97316");
  const [paper, setPaper] = useState<"mat" | "brillant">("mat");
  const [split, setSplit] = useState(50);
  const fileRef = useRef<HTMLInputElement>(null);
  const [palette, setPalette] = useState<string[]>([]);

  const rgb = hexToRgb(hex) ?? { r: 249, g: 115, b: 22 };
  const cmyk = useMemo(() => rgbToCmyk(rgb.r, rgb.g, rgb.b), [rgb.r, rgb.g, rgb.b]);
  const printed = simulatePaper(rgb, paper);
  const delta = gamutDelta(rgb);
  const outOfGamut = delta > 40;

  const handleImage = (file: File) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 60;
      canvas.height = 60;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, 60, 60);
      const data = ctx.getImageData(0, 0, 60, 60).data;
      const buckets = new Map<string, { n: number; r: number; g: number; b: number }>();
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i]!;
        const g = data[i + 1]!;
        const b = data[i + 2]!;
        const key = `${r >> 5}-${g >> 5}-${b >> 5}`;
        const cur = buckets.get(key) ?? { n: 0, r: 0, g: 0, b: 0 };
        buckets.set(key, { n: cur.n + 1, r: cur.r + r, g: cur.g + g, b: cur.b + b });
      }
      const top = [...buckets.values()]
        .sort((a, b) => b.n - a.n)
        .slice(0, 6)
        .map((c) => rgbToHex(c.r / c.n, c.g / c.n, c.b / c.n));
      setPalette(top);
      if (top[0]) setHex(top[0]);
      URL.revokeObjectURL(img.src);
    };
    img.src = URL.createObjectURL(file);
  };

  return (
    <ToolkitShell tool={tool}>
      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <Panel title="Couleur source" description="Saisissez un code hex, réglez le RVB ou importez une image.">
          <div className="space-y-5">
            <Field label="Code hexadécimal">
              <div className="flex gap-2">
                <input
                  type="color"
                  value={hexToRgb(hex) ? hex : "#f97316"}
                  onChange={(e) => setHex(e.target.value)}
                  className="h-10 w-14 cursor-pointer rounded-lg border border-border bg-card"
                  aria-label="Sélecteur de couleur"
                />
                <Input value={hex} onChange={(e) => setHex(e.target.value)} className="text-num" />
              </div>
            </Field>

            {(["r", "g", "b"] as const).map((k) => (
              <div key={k}>
                <div className="flex justify-between text-sm">
                  <span className="font-medium uppercase">{k}</span>
                  <span className="text-num text-muted-foreground">{rgb[k]}</span>
                </div>
                <Slider
                  className="mt-2"
                  value={[rgb[k]]}
                  max={255}
                  step={1}
                  onValueChange={([v]) => setHex(rgbToHex(
                    k === "r" ? v! : rgb.r,
                    k === "g" ? v! : rgb.g,
                    k === "b" ? v! : rgb.b,
                  ))}
                />
              </div>
            ))}

            <div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleImage(e.target.files[0])}
              />
              <Button variant="outline" className="w-full" onClick={() => fileRef.current?.click()}>
                <Upload className="size-4" /> Extraire les couleurs d'une image
              </Button>
              {palette.length > 0 && (
                <div className="mt-3 flex gap-2">
                  {palette.map((p) => (
                    <button
                      key={p}
                      onClick={() => setHex(p)}
                      style={{ backgroundColor: p }}
                      className="size-9 rounded-lg border border-border"
                      aria-label={`Choisir ${p}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </Panel>

        <div className="space-y-6">
          <Panel title="Avant / Après" description="Glissez le curseur pour comparer l'écran et la simulation d'impression.">
            <div className="relative h-56 overflow-hidden rounded-xl border border-border">
              <div className="absolute inset-0" style={{ backgroundColor: rgbToHex(printed.r, printed.g, printed.b) }} />
              <div
                className="absolute inset-y-0 left-0 overflow-hidden"
                style={{ width: `${split}%`, backgroundColor: hex }}
              />
              <div className="absolute inset-y-0" style={{ left: `${split}%` }}>
                <div className="h-full w-0.5 bg-background" />
              </div>
              <span className="text-num absolute bottom-3 left-3 rounded bg-background/85 px-2 py-1 text-xs">
                Écran RVB
              </span>
              <span className="text-num absolute bottom-3 right-3 rounded bg-background/85 px-2 py-1 text-xs">
                Papier {paper}
              </span>
            </div>
            <Slider className="mt-4" value={[split]} max={100} onValueChange={([v]) => setSplit(v!)} />
            <div className="mt-4 flex gap-2">
              {(["mat", "brillant"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPaper(p)}
                  className={`rounded-full border px-4 py-1.5 text-sm capitalize ${paper === p ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary cursor-pointer"
                    }`}
                >
                  Papier {p}
                </button>
              ))}
            </div>
          </Panel>

          <Panel title="Valeurs CMJN">
            <div className="grid grid-cols-4 gap-3">
              {([["C", cmyk.c], ["M", cmyk.m], ["J", cmyk.y], ["N", cmyk.k]] as const).map(([l, v]) => (
                <div key={l} className="rounded-xl border border-border bg-secondary/50 p-4 text-center">
                  <p className="text-xs text-muted-foreground">{l}</p>
                  <p className="text-num text-2xl font-semibold">{v}%</p>
                </div>
              ))}
            </div>
            <p className="text-num mt-4 text-sm text-muted-foreground">
              TAC total : {cmyk.c + cmyk.m + cmyk.y + cmyk.k} %
            </p>
            <div
              className={`mt-4 flex items-start gap-3 rounded-xl border p-4 text-sm ${outOfGamut ? "border-danger/40 bg-danger/10" : "border-success/40 bg-success/10"
                }`}
            >
              {outOfGamut ? <AlertTriangle className="mt-0.5 size-4 shrink-0" /> : <CheckCircle2 className="mt-0.5 size-4 shrink-0" />}
              <p>
                {outOfGamut
                  ? "Couleur hors gamme CMJN : elle sera nettement plus terne à l'impression. Prévoyez un ton de remplacement ou un Pantone."
                  : "Couleur reproductible en quadrichromie avec une dérive faible."}
              </p>
            </div>
          </Panel>
        </div>
      </div>
    </ToolkitShell>
  );
}
