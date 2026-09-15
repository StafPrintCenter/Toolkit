import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ToolkitShell, Field, Panel, Stat } from "@/components/site";
import { getTool } from "@/data/toolsRegistry";
import { Input } from "@/components/ui/input";
import { SITE } from "@/data/site";

const PAGE_TITLE = `Calculateur d'épaisseur de tranche et de poids | ${SITE.tool} | ${SITE.name}`;
const PAGE_DESC = `Calculez le dos d'un livre, catalogue ou magazine selon le grammage, le nombre de pages et la reliure, ainsi que le poids du tirage.`;

const tool = getTool("/spine-calculator")!;

export const Route = createFileRoute("/_tool/spine-calculator")({
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

// Main de papier (mm d'épaisseur par g/m², approximation métier)
const PAPERS = [
  { label: "Offset 80 g", grammage: 80, bulk: 1.3 },
  { label: "Offset 90 g", grammage: 90, bulk: 1.3 },
  { label: "Couché mat 115 g", grammage: 115, bulk: 0.95 },
  { label: "Couché brillant 135 g", grammage: 135, bulk: 0.9 },
  { label: "Couché 170 g", grammage: 170, bulk: 0.9 },
  { label: "Carte 300 g", grammage: 300, bulk: 0.85 },
];

const BINDINGS = [
  { label: "Dos carré collé", extra: 1, min: 3 },
  { label: "Piqûre à cheval", extra: 0, min: 0 },
  { label: "Reliure cousue", extra: 1.6, min: 4 },
];

function Page() {
  const [paper, setPaper] = useState(PAPERS[2]!);
  const [pages, setPages] = useState(120);
  const [binding, setBinding] = useState(BINDINGS[0]!);
  const [cover, setCover] = useState(300);
  const [format, setFormat] = useState({ w: 210, h: 297 });
  const [qty, setQty] = useState(500);

  const sheets = pages / 2;
  const sheetThickness = (paper.grammage * paper.bulk) / 1000; // mm
  const rawSpine = sheets * sheetThickness + (cover * 0.9 * 2) / 1000 + binding.extra;
  const spine = Math.max(binding.min, rawSpine);

  const areaM2 = (format.w / 1000) * (format.h / 1000);
  const weightUnit = sheets * areaM2 * paper.grammage + 2 * areaM2 * cover; // grammes
  const totalKg = (weightUnit * qty) / 1000;
  const coverWidth = format.w * 2 + spine;

  return (
    <ToolkitShell tool={tool}>
      <div className="grid gap-6 lg:grid-cols-[400px_1fr]">
        <Panel title="Caractéristiques de l'ouvrage">
          <div className="space-y-5">
            <Field label="Papier intérieur">
              <div className="flex flex-wrap gap-2">
                {PAPERS.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => setPaper(p)}
                    className={`rounded-full border px-3 py-1.5 text-xs ${paper.label === p.label ? "border-primary bg-primary text-primary-foreground" : "border-border cursor-pointer"
                      }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </Field>
            <Field label="Reliure">
              <div className="flex flex-wrap gap-2">
                {BINDINGS.map((b) => (
                  <button
                    key={b.label}
                    onClick={() => setBinding(b)}
                    className={`rounded-full border px-3 py-1.5 text-xs ${binding.label === b.label ? "border-primary bg-primary text-primary-foreground" : "border-border cursor-pointer"
                      }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Nombre de pages">
                <Input type="number" className="text-num" value={pages} onChange={(e) => setPages(+e.target.value)} />
              </Field>
              <Field label="Couverture (g/m²)">
                <Input type="number" className="text-num" value={cover} onChange={(e) => setCover(+e.target.value)} />
              </Field>
              <Field label="Largeur page (mm)">
                <Input type="number" className="text-num" value={format.w} onChange={(e) => setFormat({ ...format, w: +e.target.value })} />
              </Field>
              <Field label="Hauteur page (mm)">
                <Input type="number" className="text-num" value={format.h} onChange={(e) => setFormat({ ...format, h: +e.target.value })} />
              </Field>
              <Field label="Quantité du tirage">
                <Input type="number" className="text-num" value={qty} onChange={(e) => setQty(+e.target.value)} />
              </Field>
            </div>
          </div>
        </Panel>

        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <Stat label="Épaisseur du dos" value={spine.toFixed(1)} unit="mm" tone="success" />
            <Stat label="Poids unitaire" value={weightUnit.toFixed(0)} unit="g" />
            <Stat label={`Poids de ${qty} ex.`} value={totalKg.toFixed(1)} unit="kg" />
          </div>

          <Panel title="Gabarit de couverture (à plat)" description={`Largeur totale : ${coverWidth.toFixed(1)} mm × ${format.h} mm, fond perdu non compris.`}>
            <div className="flex justify-center overflow-x-auto rounded-xl bg-secondary/40 p-6">
              <div className="flex" style={{ height: Math.min(280, format.h * 0.8) }}>
                <div className="flex w-40 items-center justify-center border border-border bg-card text-xs text-muted-foreground">
                  4e de couverture
                </div>
                <div
                  className="flex items-center justify-center border-y border-border bg-primary/15 text-[10px]"
                  style={{ width: Math.max(10, spine * 1.4) }}
                >
                  <span className="text-num rotate-90 whitespace-nowrap">{spine.toFixed(1)} mm</span>
                </div>
                <div className="flex w-40 items-center justify-center border border-border bg-card text-xs text-muted-foreground">
                  1re de couverture
                </div>
              </div>
            </div>
            {binding.label === "Piqûre à cheval" && pages % 4 !== 0 && (
              <p className="mt-4 text-sm text-danger">
                En piqûre à cheval, le nombre de pages doit être un multiple de 4.
              </p>
            )}
          </Panel>
        </div>
      </div>
    </ToolkitShell>
  );
}
