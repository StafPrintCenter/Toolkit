import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Download } from "lucide-react";
import { ToolkitShell, Field, Panel } from "@/components/site";
import { getTool } from "@/data/toolsRegistry";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SITE } from "@/data/site";

const PAGE_TITLE = `Générateur de gabarits & fonds perdus 3 mm | ${SITE.tool} | ${SITE.name}`;
const PAGE_DESC = `Créez un gabarit d'impression avec trait de coupe, fond perdu de 3 mm et marge de sécurité, puis exportez-le en PNG ou PDF.`;

const tool = getTool("/bleed-generator")!;

export const Route = createFileRoute("/_tool/bleed-generator")({
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

const FORMATS = [
  { label: "A4", w: 210, h: 297 },
  { label: "A5", w: 148, h: 210 },
  { label: "A3", w: 297, h: 420 },
  { label: "Carte de visite", w: 85, h: 54 },
  { label: "Flyer DL", w: 99, h: 210 },
  { label: "Roll-up", w: 850, h: 2000 },
];

function Page() {
  const [size, setSize] = useState({ w: 210, h: 297 });
  const [bleed, setBleed] = useState(3);
  const [safe, setSafe] = useState(3);

  const total = { w: size.w + bleed * 2, h: size.h + bleed * 2 };
  const scale = Math.min(420 / total.w, 460 / total.h);
  const px = (mm: number) => mm * scale;

  const buildCanvas = () => {
    const dpi = 300;
    const f = dpi / 25.4;
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(total.w * f);
    canvas.height = Math.round(total.h * f);
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const line = (x: number, y: number, w: number, h: number, color: string, dash: number[]) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = Math.max(2, f * 0.3);
      ctx.setLineDash(dash.map((d) => d * f));
      ctx.strokeRect(x * f, y * f, w * f, h * f);
    };
    line(0, 0, total.w, total.h, "#ef4444", [4, 3]);
    line(bleed, bleed, size.w, size.h, "#0f172a", []);
    line(bleed + safe, bleed + safe, size.w - safe * 2, size.h - safe * 2, "#16a34a", [3, 3]);
    ctx.setLineDash([]);
    ctx.fillStyle = "#64748b";
    ctx.font = `${Math.round(f * 3.5)}px monospace`;
    ctx.fillText(
      `STAF PRINT — ${size.w}x${size.h}mm | FP ${bleed}mm | Securite ${safe}mm`,
      bleed * f,
      canvas.height - bleed * f * 0.3,
    );
    return canvas;
  };

  const exportPng = () => {
    const canvas = buildCanvas();
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = `gabarit-${size.w}x${size.h}mm.png`;
    a.click();
  };

  const exportPdf = async () => {
    const { PDFDocument, rgb } = await import("pdf-lib");
    const pt = (mm: number) => (mm * 72) / 25.4;
    const doc = await PDFDocument.create();
    const page = doc.addPage([pt(total.w), pt(total.h)]);
    const rect = (x: number, y: number, w: number, h: number, color: [number, number, number], dashed?: boolean) =>
      page.drawRectangle({
        x: pt(x),
        y: pt(y),
        width: pt(w),
        height: pt(h),
        borderColor: rgb(...color),
        borderWidth: 0.7,
        ...(dashed ? { borderDashArray: [3, 2] } : {}),
      });
    rect(0.5, 0.5, total.w - 1, total.h - 1, [0.94, 0.27, 0.27], true);
    rect(bleed, bleed, size.w, size.h, [0.06, 0.09, 0.16]);
    rect(bleed + safe, bleed + safe, size.w - safe * 2, size.h - safe * 2, [0.09, 0.64, 0.29], true);
    const bytes = await doc.save();
    const blob = new Blob([bytes as unknown as BlobPart], { type: "application/pdf" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `gabarit-${size.w}x${size.h}mm.pdf`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <ToolkitShell tool={tool}>
      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <Panel title="Format du document">
          <div className="flex flex-wrap gap-2">
            {FORMATS.map((f) => (
              <button
                key={f.label}
                onClick={() => setSize({ w: f.w, h: f.h })}
                className={`rounded-full border px-3 py-1.5 text-xs ${size.w === f.w && size.h === f.h ? "border-primary bg-primary text-primary-foreground" : "border-border cursor-pointer"
                  }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <Field label="Largeur (mm)">
              <Input type="number" className="text-num" value={size.w} onChange={(e) => setSize({ ...size, w: +e.target.value })} />
            </Field>
            <Field label="Hauteur (mm)">
              <Input type="number" className="text-num" value={size.h} onChange={(e) => setSize({ ...size, h: +e.target.value })} />
            </Field>
            <Field label="Fond perdu (mm)">
              <Input type="number" className="text-num" value={bleed} onChange={(e) => setBleed(+e.target.value)} />
            </Field>
            <Field label="Sécurité (mm)">
              <Input type="number" className="text-num" value={safe} onChange={(e) => setSafe(+e.target.value)} />
            </Field>
          </div>
          <div className="mt-5 flex gap-2">
            <Button onClick={exportPng} className="flex-1">
              <Download className="size-4" /> PNG
            </Button>
            <Button onClick={exportPdf} variant="outline" className="flex-1">
              <Download className="size-4" /> PDF
            </Button>
          </div>
        </Panel>

        <Panel title="Aperçu du gabarit">
          <div className="flex justify-center rounded-xl bg-secondary/40 p-6">
            <div
              className="relative border-2 border-dashed border-danger bg-card"
              style={{ width: px(total.w), height: px(total.h) }}
            >
              <div
                className="absolute border border-foreground"
                style={{ left: px(bleed), top: px(bleed), width: px(size.w), height: px(size.h) }}
              >
                <div
                  className="absolute border border-dashed border-success"
                  style={{ left: px(safe), top: px(safe), right: px(safe), bottom: px(safe) }}
                />
              </div>
            </div>
          </div>
          <ul className="mt-5 space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <span className="inline-block h-0.5 w-6 bg-danger" /> Fond perdu — {total.w} × {total.h} mm (l'image doit aller jusqu'ici)
            </li>
            <li className="flex items-center gap-2">
              <span className="inline-block h-0.5 w-6 bg-foreground" /> Trait de coupe — {size.w} × {size.h} mm
            </li>
            <li className="flex items-center gap-2">
              <span className="inline-block h-0.5 w-6 bg-success" /> Zone de sécurité — textes et logos à l'intérieur
            </li>
          </ul>
        </Panel>
      </div>
    </ToolkitShell>
  );
}
