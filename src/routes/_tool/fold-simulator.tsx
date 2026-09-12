import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { Field, Panel } from "@/components/spc/Layout";
import { ToolkitShell } from "@/components/site";
import { getTool } from "@/data/toolsRegistry";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { SITE } from "@/data/site";

const PAGE_TITLE = `Simulateur de pliage : dépliants 2, 3 volets & accordéon | SPC Toolkit | ${SITE.name}`;
const PAGE_DESC = `Visualisez le pliage de vos dépliants, obtenez la largeur exacte de chaque volet et l'ordre des pages recto-verso.`;

const tool = getTool("/fold-simulator")!;

export const Route = createFileRoute("/_tool/fold-simulator")({
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

type FoldType = "simple" | "accordeon" | "roule" | "portefeuille";

const FOLDS: Record<FoldType, { label: string; panels: number; desc: string }> = {
  simple: { label: "2 volets (simple)", panels: 2, desc: "Un pli central. 4 pages au total." },
  accordeon: { label: "3 volets accordéon", panels: 3, desc: "Plis en zigzag, volets de largeur égale." },
  roule: { label: "3 volets roulés", panels: 3, desc: "Le volet rentrant est réduit de 2 mm pour ne pas coincer." },
  portefeuille: { label: "4 volets portefeuille", panels: 4, desc: "Deux volets se referment sur le centre." },
};

function Page() {
  const [type, setType] = useState<FoldType>("roule");
  const [total, setTotal] = useState(297);
  const [height, setHeight] = useState(210);
  const [open, setOpen] = useState(100);

  const cfg = FOLDS[type];
  const base = total / cfg.panels;
  const widths =
    type === "roule"
      ? [base + 2, base, base - 2]
      : type === "portefeuille"
        ? [total / 4 - 1, total / 4, total / 4, total / 4 + 1]
        : Array.from({ length: cfg.panels }, () => base);

  const scale = Math.min(620 / total, 260 / height);

  return (
    <ToolkitShell tool={tool}>
      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        <Panel title="Type de pliage">
          <div className="space-y-2">
            {(Object.keys(FOLDS) as FoldType[]).map((k) => (
              <button
                key={k}
                onClick={() => setType(k)}
                className={`w-full rounded-xl border p-3 text-left text-sm transition-colors ${type === k ? "border-primary bg-accent/60" : "border-border hover:border-primary/50"
                  }`}
              >
                <span className="font-medium">{FOLDS[k].label}</span>
                <span className="mt-0.5 block text-xs text-muted-foreground">{FOLDS[k].desc}</span>
              </button>
            ))}
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <Field label="Largeur à plat (mm)">
              <Input type="number" className="text-num" value={total} onChange={(e) => setTotal(+e.target.value)} />
            </Field>
            <Field label="Hauteur (mm)">
              <Input type="number" className="text-num" value={height} onChange={(e) => setHeight(+e.target.value)} />
            </Field>
          </div>
          <div className="mt-5">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Ouverture</span>
              <span className="text-num text-muted-foreground">{open} %</span>
            </div>
            <Slider className="mt-2" value={[open]} max={100} onValueChange={([v]) => setOpen(v!)} />
          </div>
        </Panel>

        <div className="space-y-6">
          <Panel title="Vue 3D du dépliant" description="Faites varier l'ouverture pour voir le pliage se refermer.">
            <div
              className="flex items-center justify-center overflow-hidden rounded-xl bg-secondary/40 p-8"
              style={{ perspective: 1400 }}
            >
              <div className="flex" style={{ transformStyle: "preserve-3d" }}>
                {widths.map((w, i) => (
                  <motion.div
                    key={i}
                    animate={{ rotateY: ((100 - open) / 100) * (i % 2 === 0 ? -65 : 65) }}
                    transition={{ type: "spring", stiffness: 120, damping: 18 }}
                    style={{
                      width: w * scale,
                      height: height * scale,
                      transformOrigin: i % 2 === 0 ? "right center" : "left center",
                      transformStyle: "preserve-3d",
                    }}
                    className="flex flex-col items-center justify-center border border-border bg-card shadow-soft"
                  >
                    <span className="text-num text-sm font-semibold">Volet {i + 1}</span>
                    <span className="text-num text-xs text-muted-foreground">{w.toFixed(1)} mm</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </Panel>

          <Panel title="Positionnement des pages">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-border p-4">
                <p className="text-sm font-medium">Recto (extérieur)</p>
                <div className="text-num mt-2 flex gap-2 text-xs">
                  {widths.map((_, i) => (
                    <span key={i} className="flex-1 rounded bg-secondary p-2 text-center">
                      {type === "roule" && i === 0 ? "Dos" : i === widths.length - 1 ? "Couverture" : `Page ${i + 1}`}
                    </span>
                  ))}
                </div>
              </div>
              <div className="rounded-xl border border-border p-4">
                <p className="text-sm font-medium">Verso (intérieur)</p>
                <div className="text-num mt-2 flex gap-2 text-xs">
                  {widths.map((_, i) => (
                    <span key={i} className="flex-1 rounded bg-secondary p-2 text-center">
                      Int. {i + 1}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Gardez 4 mm de marge de chaque côté des plis : les textes trop proches d'un pli deviennent illisibles.
            </p>
          </Panel>
        </div>
      </div>
    </ToolkitShell>
  );
}
