import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, type CSSProperties, type ReactNode } from "react";
import { Download } from "lucide-react";
import { ToolkitShell, Field, Panel, Stat, ImagePicker } from "@/components/site";
import { getTool } from "@/data/toolsRegistry";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { downloadText } from "@/lib/imageTools";
import { SITE } from "@/data/site";

const PAGE_TITLE = `Générateur de tracé de découpe packaging (étui) | ${SITE.tool} | ${SITE.name}`;
const PAGE_DESC = `Créez le patron d'un étui à rabats à partir de ses dimensions : lignes de coupe et de rainage distinctes, export SVG et pliage 3D interactif`;

const tool = getTool("/dieline")!;

export const Route = createFileRoute("/_tool/dieline")({
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

type Seg = { d: string; kind: "cut" | "crease" };

function buildDieline(L: number, W: number, H: number) {
  const G = Math.min(15, W * 0.8); // patte de collage
  const T = Math.min(15, W * 0.6); // languette
  const D = W * 0.55; // rabats anti-poussière
  const M = 10;
  const Y0 = M + W + T, Y1 = Y0 + H;
  const xb = M + G, xs1 = xb + L, xf = xs1 + W, xs2 = xf + L, xe = xs2 + W;
  const s: Seg[] = [];
  const cut = (d: string) => s.push({ d, kind: "cut" });
  const crease = (d: string) => s.push({ d, kind: "crease" });
  const r = Math.min(T * 0.6, 8);
  // Patte de collage
  cut(`M${xb} ${Y0} L${M} ${Y0 + 5} L${M} ${Y1 - 5} L${xb} ${Y1}`);
  // Haut : dos (bord libre), rabats et couvercle sur la face
  cut(`M${xb} ${Y0} L${xs1} ${Y0}`);
  cut(`M${xs1} ${Y0} L${xs1 + 2} ${Y0 - D} L${xf - 4} ${Y0 - D} L${xf} ${Y0 - 4} L${xf} ${Y0}`);
  cut(`M${xf} ${Y0} L${xf} ${Y0 - W} L${xf + 2} ${Y0 - W - T + r} Q${xf + 2} ${Y0 - W - T} ${xf + 2 + r} ${Y0 - W - T} L${xs2 - 2 - r} ${Y0 - W - T} Q${xs2 - 2} ${Y0 - W - T} ${xs2 - 2} ${Y0 - W - T + r} L${xs2} ${Y0 - W} L${xs2} ${Y0}`);
  cut(`M${xs2} ${Y0} L${xs2 + 4} ${Y0 - D} L${xe - 2} ${Y0 - D} L${xe} ${Y0}`);
  cut(`M${xe} ${Y0} L${xe} ${Y1}`);
  // Bas : couvercle sur le dos (rabats inversés)
  cut(`M${xb} ${Y1} L${xb} ${Y1 + W} L${xb + 2} ${Y1 + W + T - r} Q${xb + 2} ${Y1 + W + T} ${xb + 2 + r} ${Y1 + W + T} L${xs1 - 2 - r} ${Y1 + W + T} Q${xs1 - 2} ${Y1 + W + T} ${xs1 - 2} ${Y1 + W + T - r} L${xs1} ${Y1 + W} L${xs1} ${Y1}`);
  cut(`M${xs1} ${Y1} L${xs1 + 4} ${Y1 + D} L${xf - 2} ${Y1 + D} L${xf} ${Y1}`);
  cut(`M${xf} ${Y1} L${xs2} ${Y1}`);
  cut(`M${xs2} ${Y1} L${xs2 + 2} ${Y1 + D} L${xe - 4} ${Y1 + D} L${xe} ${Y1 + 4} L${xe} ${Y1}`);
  // Rainages
  [xb, xs1, xf, xs2].forEach((x) => crease(`M${x} ${Y0} L${x} ${Y1}`));
  crease(`M${xs1} ${Y0} L${xe} ${Y0}`);
  crease(`M${xf} ${Y0 - W} L${xs2} ${Y0 - W}`);
  crease(`M${xb} ${Y1} L${xf} ${Y1}`);
  crease(`M${xs2} ${Y1} L${xe} ${Y1}`);
  crease(`M${xb} ${Y1 + W} L${xs1} ${Y1 + W}`);
  const width = xe + M, height = Y1 + W + T + M;
  return { segs: s, width, height };
}

function toSvg(segs: Seg[], w: number, h: number, L: number, W: number, H: number) {
  const paths = segs
    .map((x) => `<path d="${x.d}" fill="none" stroke="${x.kind === "cut" ? "#e11d48" : "#0284c7"}" stroke-width="0.4" ${x.kind === "crease" ? 'stroke-dasharray="3 2"' : ""} data-type="${x.kind === "cut" ? "CUT" : "CREASE"}"/>`)
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${w}mm" height="${h}mm" viewBox="0 0 ${w} ${h}">
<title>Etui ${L}x${W}x${H} mm - SPC Toolkit - rouge: coupe / bleu pointillé: rainage</title>
${paths}
</svg>`;
}

function Face({ w, h, style, children, label }: { w: number; h: number; style: CSSProperties; children?: ReactNode; label?: string }) {
  return (
    <div
      className="absolute flex items-center justify-center border border-primary/60 bg-card/90 text-[10px] font-medium text-muted-foreground"
      style={{ width: w, height: h, transformStyle: "preserve-3d", ...style }}
    >
      {label}
      {children}
    </div>
  );
}

function Fold3D({ L, W, H, fold, spin }: { L: number; W: number; H: number; fold: number; spin: number }) {
  const k = 160 / Math.max(L, W, H);
  const l = L * k, w = W * k, h = H * k;
  const a = fold * 90;
  return (
    <div className="flex h-80 items-center justify-center overflow-hidden rounded-xl border border-border surface-grid" style={{ perspective: 900 }}>
      <div style={{ transformStyle: "preserve-3d", transform: `rotateX(-20deg) rotateY(${spin}deg) translateX(${-l / 2 + (w * fold) / 2}px)`, width: l, height: h, position: "relative" }}>
        <Face w={l} h={h} style={{ left: 0, top: 0 }} label="Face">
          <Face w={l} h={w} style={{ left: 0, bottom: "100%", transformOrigin: "bottom", transform: `rotateX(${a}deg)` }} label="Couvercle" />
          <Face w={w} h={h} style={{ right: "100%", top: 0, transformOrigin: "right", transform: `rotateY(${-a}deg)` }} label="Côté" />
          <Face w={w} h={h} style={{ left: "100%", top: 0, transformOrigin: "left", transform: `rotateY(${a}deg)` }} label="Côté">
            <Face w={l} h={h} style={{ left: "100%", top: 0, transformOrigin: "left", transform: `rotateY(${a}deg)` }} label="Dos">
              <Face w={l} h={w} style={{ left: 0, top: "100%", transformOrigin: "top", transform: `rotateX(${-a}deg)` }} label="Fond" />
            </Face>
          </Face>
        </Face>
      </div>
    </div>
  );
}

function Page() {
  const [L, setL] = useState(80);
  const [W, setW] = useState(40);
  const [H, setH] = useState(120);
  const [fold, setFold] = useState(0.6);
  const [spin, setSpin] = useState(-30);
  const { segs, width, height } = useMemo(() => buildDieline(L, W, H), [L, W, H]);
  const num = (v: string, set: (n: number) => void) => set(Math.max(10, Math.min(400, Number(v) || 10)));

  return (
    <ToolkitShell tool={tool}>
      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        <Panel title="Étui à rabats inversés (mm)">
          <div className="space-y-4">
            <Field label="Longueur (face)"><Input className="text-num" type="number" value={L} onChange={(e) => num(e.target.value, setL)} /></Field>
            <Field label="Largeur (côté)"><Input className="text-num" type="number" value={W} onChange={(e) => num(e.target.value, setW)} /></Field>
            <Field label="Hauteur"><Input className="text-num" type="number" value={H} onChange={(e) => num(e.target.value, setH)} /></Field>
            <Stat label="Format à plat" value={`${width.toFixed(0)} × ${height.toFixed(0)}`} unit="mm" />
            <div className="flex gap-4 text-xs">
              <span className="flex items-center gap-1.5"><span className="h-0.5 w-5 bg-danger" /> Coupe</span>
              <span className="flex items-center gap-1.5"><span className="h-0.5 w-5 border-t-2 border-dashed border-format" /> Rainage</span>
            </div>
            <Button className="w-full" onClick={() => downloadText(toSvg(segs, width, height, L, W, H), `spc-etui-${L}x${W}x${H}.svg`, "image/svg+xml")}>
              <Download className="size-4" /> Exporter le tracé SVG
            </Button>
            <p className="text-xs text-muted-foreground">Ajoutez 3 mm de fond perdu autour du tracé dans votre visuel. Le SVG est à l'échelle 1:1.</p>
          </div>
        </Panel>
        <div className="space-y-6">
          <Panel title="Patron à plat">
            <svg viewBox={`0 0 ${width} ${height}`} className="max-h-120 w-full rounded-xl border border-border bg-card">
              {segs.map((x, i) => (
                <path key={i} d={x.d} fill="none" stroke={x.kind === "cut" ? "var(--color-danger)" : "var(--color-format)"} strokeWidth={0.8} strokeDasharray={x.kind === "crease" ? "3 2" : undefined} />
              ))}
            </svg>
          </Panel>
          <Panel title="Pliage en 3D">
            <Fold3D L={L} W={W} H={H} fold={fold} spin={spin} />
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label={`Pliage : ${Math.round(fold * 100)} %`}><Slider min={0} max={100} value={[fold * 100]} onValueChange={(v) => setFold(v[0]! / 100)} /></Field>
              <Field label={`Rotation : ${spin}°`}><Slider min={-180} max={180} value={[spin]} onValueChange={(v) => setSpin(v[0]!)} /></Field>
            </div>
          </Panel>
        </div>
      </div>
    </ToolkitShell>
  );
}
