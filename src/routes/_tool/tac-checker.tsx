import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ToolkitShell, Field, Panel, Stat } from "@/components/site";
import { getTool } from "@/data/toolsRegistry";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { cmykToRgb, hexToRgb, rgbToCmyk, rgbToHex } from "@/lib/color";
import { SITE } from "@/data/site";

const PAGE_TITLE = `Simulateur de taux d'encrage maximum (TAC) | SPC Toolkit | ${SITE.name}`;
const PAGE_DESC = `Vérifiez la somme C+M+J+N de vos aplats et évitez le maculage : limites conseillées par support, du journal au couché brillant.`;

const tool = getTool("/tac-checker")!;

export const Route = createFileRoute("/_tool/tac-checker")({
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

const SUPPORTS = [
  { label: "Journal / offset non couché", limit: 240 },
  { label: "Offset couché standard", limit: 300 },
  { label: "Numérique couché brillant", limit: 330 },
  { label: "Grand format solvant", limit: 280 },
];

function Page() {
  const [cmyk, setCmyk] = useState({ c: 60, m: 50, y: 50, k: 100 });
  const [support, setSupport] = useState(SUPPORTS[1]!);
  const tac = cmyk.c + cmyk.m + cmyk.y + cmyk.k;
  const over = tac > support.limit;
  const rgb = cmykToRgb(cmyk);

  const factor = over ? support.limit / tac : 1;
  const fixed = {
    c: Math.round(cmyk.c * factor),
    m: Math.round(cmyk.m * factor),
    y: Math.round(cmyk.y * factor),
    k: Math.round(cmyk.k * factor),
  };

  const fromHex = (hex: string) => {
    const r = hexToRgb(hex);
    if (r) setCmyk(rgbToCmyk(r.r, r.g, r.b));
  };

  return (
    <ToolkitShell tool={tool}>
      <div className="grid gap-6 lg:grid-cols-[400px_1fr]">
        <Panel title="Composition de l'encre">
          <Field label="Depuis une couleur écran">
            <Input type="color" defaultValue={rgbToHex(rgb.r, rgb.g, rgb.b)} onChange={(e) => fromHex(e.target.value)} className="h-11 p-1" />
          </Field>
          <div className="mt-5 space-y-5">
            {(
              [
                ["c", "Cyan"],
                ["m", "Magenta"],
                ["y", "Jaune"],
                ["k", "Noir"],
              ] as const
            ).map(([key, label]) => (
              <div key={key}>
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{label}</span>
                  <span className="text-num text-muted-foreground">{cmyk[key]} %</span>
                </div>
                <Slider
                  className="mt-2"
                  value={[cmyk[key]]}
                  max={100}
                  onValueChange={([v]) => setCmyk({ ...cmyk, [key]: v! })}
                />
              </div>
            ))}
          </div>
        </Panel>

        <div className="space-y-6">
          <Panel title="Support d'impression">
            <div className="flex flex-wrap gap-2">
              {SUPPORTS.map((s) => (
                <button
                  key={s.label}
                  onClick={() => setSupport(s)}
                  className={`rounded-full border px-3 py-1.5 text-xs ${support.label === s.label ? "border-primary bg-primary text-primary-foreground" : "border-border"
                    }`}
                >
                  {s.label} · {s.limit}%
                </button>
              ))}
            </div>
          </Panel>

          <div className="grid gap-4 sm:grid-cols-3">
            <Stat label="TAC mesuré" value={`${tac}`} unit="%" tone={over ? "danger" : tac > support.limit - 30 ? "warning" : "success"} />
            <Stat label="Limite support" value={`${support.limit}`} unit="%" />
            <Stat label="Marge" value={`${support.limit - tac}`} unit="%" tone={over ? "danger" : "success"} />
          </div>

          <Panel>
            <div className="flex items-center gap-4">
              <div
                className="size-20 shrink-0 rounded-xl border border-border"
                style={{ backgroundColor: rgbToHex(rgb.r, rgb.g, rgb.b) }}
              />
              <div>
                <p className={`font-semibold ${over ? "text-danger" : "text-success"}`}>
                  {over ? "Surcharge d'encre détectée" : "Encrage conforme"}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {over
                    ? `Réduisez à ${support.limit} % maximum : au-delà, l'encre ne sèche pas, macule et colle au massicot.`
                    : "Cet aplat sèche correctement sur le support choisi."}
                </p>
              </div>
            </div>
            <div className="mt-5 h-4 overflow-hidden rounded-full bg-secondary">
              <div
                className={`h-full ${over ? "bg-danger" : "bg-success"}`}
                style={{ width: `${Math.min(100, (tac / 400) * 100)}%` }}
              />
            </div>
            {over && (
              <div className="mt-5 rounded-xl border border-border bg-secondary/50 p-4">
                <p className="text-sm font-medium">Correction proposée</p>
                <p className="text-num mt-2 text-lg">
                  C {fixed.c} · M {fixed.m} · J {fixed.y} · N {fixed.k} → {fixed.c + fixed.m + fixed.y + fixed.k} %
                </p>
              </div>
            )}
            <p className="mt-5 text-sm text-muted-foreground">
              Rappel STAF PRINT : pour un noir riche, utilisez C40 M30 J30 N100 (200 %) plutôt qu'un 400 %.
            </p>
          </Panel>
        </div>
      </div>
    </ToolkitShell>
  );
}
