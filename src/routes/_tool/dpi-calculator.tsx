import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { ToolkitShell, Field, Panel, Stat } from "@/components/site";
import { getTool } from "@/data/toolsRegistry";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SITE } from "@/data/site";

const PAGE_TITLE = `Calculateur de DPI & diagnostic résolution | SPC Toolkit | ${SITE.name}`;
const PAGE_DESC = `Calculez la résolution réelle d'une image à la taille d'impression voulue et vérifiez si elle est suffisante pour le flyer ou le grand format.`;

const tool = getTool("/dpi-calculator")!;

export const Route = createFileRoute("/_tool/dpi-calculator")({
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

const PRESETS = [
  { label: "Carte de visite", w: 8.5, h: 5.4 },
  { label: "Flyer A5", w: 14.8, h: 21 },
  { label: "Affiche A3", w: 29.7, h: 42 },
  { label: "Roll-up 85×200", w: 85, h: 200 },
  { label: "Bâche 3×2 m", w: 300, h: 200 },
];

function verdict(dpi: number) {
  if (dpi >= 300) return { tone: "success" as const, dot: "🟢", text: "Qualité maximale : parfait pour l'offset et le numérique." };
  if (dpi >= 150) return { tone: "success" as const, dot: "🟢", text: "Bonne qualité pour l'impression courante." };
  if (dpi >= 100) return { tone: "warning" as const, dot: "🟡", text: "Acceptable en grand format vu à distance (bâche, roll-up)." };
  return { tone: "danger" as const, dot: "🔴", text: "Insuffisant : l'image sera floue ou pixellisée. Fournissez un fichier plus grand." };
}

function Page() {
  const [px, setPx] = useState({ w: 3000, h: 2000 });
  const [cm, setCm] = useState({ w: 29.7, h: 21 });
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const dpiW = cm.w > 0 ? px.w / (cm.w / 2.54) : 0;
  const dpiH = cm.h > 0 ? px.h / (cm.h / 2.54) : 0;
  const dpi = Math.min(dpiW, dpiH);
  const v = verdict(dpi);
  const maxCm300 = ((px.w / 300) * 2.54).toFixed(1);
  const maxCm300H = ((px.h / 300) * 2.54).toFixed(1);

  const onFile = (file: File) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setPx({ w: img.naturalWidth, h: img.naturalHeight });
      setPreview(url);
    };
    img.src = url;
  };

  return (
    <ToolkitShell tool={tool}>
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Votre image" description="Importez le fichier ou saisissez ses dimensions en pixels.">
          <div className="space-y-4">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
            />
            <Button variant="outline" className="w-full" onClick={() => fileRef.current?.click()}>
              <Upload className="size-4" /> Importer une image
            </Button>
            {preview && (
              <img src={preview} alt="Aperçu du fichier analysé" className="max-h-40 w-full rounded-xl border border-border object-contain" />
            )}
            <div className="grid grid-cols-2 gap-3">
              <Field label="Largeur (px)">
                <Input type="number" className="text-num" value={px.w} onChange={(e) => setPx({ ...px, w: +e.target.value })} />
              </Field>
              <Field label="Hauteur (px)">
                <Input type="number" className="text-num" value={px.h} onChange={(e) => setPx({ ...px, h: +e.target.value })} />
              </Field>
            </div>
          </div>
        </Panel>

        <Panel title="Taille d'impression" description="Format final souhaité, en centimètres.">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Largeur (cm)">
              <Input type="number" className="text-num" value={cm.w} onChange={(e) => setCm({ ...cm, w: +e.target.value })} />
            </Field>
            <Field label="Hauteur (cm)">
              <Input type="number" className="text-num" value={cm.h} onChange={(e) => setCm({ ...cm, h: +e.target.value })} />
            </Field>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                onClick={() => setCm({ w: p.w, h: p.h })}
                className="rounded-full border border-border px-3 py-1.5 text-xs hover:border-primary cursor-pointer"
              >
                {p.label}
              </button>
            ))}
          </div>
        </Panel>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Stat label="Résolution effective" value={dpi ? dpi.toFixed(0) : "—"} unit="DPI" tone={v.tone} />
        <Stat label="Taille max à 300 DPI" value={`${maxCm300} × ${maxCm300H}`} unit="cm" />
        <Stat label="Mégapixels" value={((px.w * px.h) / 1_000_000).toFixed(1)} unit="Mpx" />
      </div>

      <Panel className="mt-6">
        <p className="text-lg">
          <span className="mr-2">{v.dot}</span>
          {v.text}
        </p>
        <div className="mt-5 h-3 overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${Math.min(100, (dpi / 300) * 100)}%` }}
          />
        </div>
        <div className="text-num mt-2 flex justify-between text-xs text-muted-foreground">
          <span>0</span>
          <span>100 · grand format</span>
          <span>150</span>
          <span>300 DPI</span>
        </div>
      </Panel>
    </ToolkitShell>
  );
}
