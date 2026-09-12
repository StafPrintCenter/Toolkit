import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Field, Panel, Stat } from "@/components/spc/Layout";
import { ToolkitShell } from "@/components/site";
import { getTool } from "@/data/toolsRegistry";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SITE } from "@/data/site";

const PAGE_TITLE = `Calculateur de calepinage bâche et vinyle | SPC Toolkit | ${SITE.name}`;
const PAGE_DESC = `Optimisez la disposition de vos visuels sur une laize de 1,60 m ou 3,20 m, calculez le métrage consommé et le taux de chute.`;

const tool = getTool("/nesting-calc")!;

export const Route = createFileRoute("/_tool/nesting-calc")({
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

interface Piece {
  id: number;
  w: number;
  h: number;
  qty: number;
}

interface Placed {
  x: number;
  y: number;
  w: number;
  h: number;
  id: number;
}

const LAIZES = [1600, 3200, 1370, 1060];

function pack(pieces: Piece[], laize: number, gap: number, rotate: boolean) {
  const items: Array<{ w: number; h: number; id: number }> = [];
  pieces.forEach((p) => {
    for (let i = 0; i < p.qty; i++) items.push({ w: p.w, h: p.h, id: p.id });
  });
  items.sort((a, b) => b.h - a.h);
  const placed: Placed[] = [];
  let shelfY = 0;
  let shelfH = 0;
  let cursorX = 0;
  for (const it of items) {
    let { w, h } = it;
    if (rotate && w > laize && h <= laize) [w, h] = [h, w];
    if (rotate && h > w && w + cursorX > laize && h + cursorX <= laize) [w, h] = [h, w];
    if (w > laize) continue;
    if (cursorX + w > laize) {
      shelfY += shelfH + gap;
      shelfH = 0;
      cursorX = 0;
    }
    placed.push({ x: cursorX, y: shelfY, w, h, id: it.id });
    cursorX += w + gap;
    shelfH = Math.max(shelfH, h);
  }
  const usedLength = shelfY + shelfH;
  const areaPieces = placed.reduce((s, p) => s + p.w * p.h, 0);
  const areaRoll = laize * usedLength;
  return { placed, usedLength, waste: areaRoll ? 1 - areaPieces / areaRoll : 0, skipped: items.length - placed.length };
}

function Page() {
  const [laize, setLaize] = useState(1600);
  const [gap, setGap] = useState(10);
  const [rotate, setRotate] = useState(true);
  const [price, setPrice] = useState(4500);
  const [pieces, setPieces] = useState<Piece[]>([
    { id: 1, w: 800, h: 1200, qty: 4 },
    { id: 2, w: 600, h: 400, qty: 6 },
  ]);

  const result = useMemo(() => pack(pieces, laize, gap, rotate), [pieces, laize, gap, rotate]);
  const scale = 520 / laize;
  const colors = ["bg-primary/70", "bg-prepress/60", "bg-format/60", "bg-pdf/60", "bg-warning/60"];

  const update = (id: number, patch: Partial<Piece>) =>
    setPieces((p) => p.map((x) => (x.id === id ? { ...x, ...patch } : x)));

  return (
    <ToolkitShell tool={tool}>
      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <Panel title="Support et visuels">
          <Field label="Laize du rouleau (mm)">
            <div className="flex flex-wrap gap-2">
              {LAIZES.map((l) => (
                <button
                  key={l}
                  onClick={() => setLaize(l)}
                  className={`text-num rounded-full border px-3 py-1.5 text-xs ${laize === l ? "border-primary bg-primary text-primary-foreground" : "border-border"
                    }`}
                >
                  {(l / 1000).toFixed(2)} m
                </button>
              ))}
            </div>
          </Field>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Field label="Espacement (mm)">
              <Input type="number" className="text-num" value={gap} onChange={(e) => setGap(+e.target.value)} />
            </Field>
            <Field label="Prix au m² (FCFA)">
              <Input type="number" className="text-num" value={price} onChange={(e) => setPrice(+e.target.value)} />
            </Field>
          </div>
          <label className="mt-3 flex items-center gap-2 text-sm">
            <input type="checkbox" checked={rotate} onChange={(e) => setRotate(e.target.checked)} className="accent-primary" />
            Autoriser la rotation à 90°
          </label>

          <div className="mt-5 space-y-3">
            {pieces.map((p, i) => (
              <div key={p.id} className="flex items-end gap-2 rounded-xl border border-border p-3">
                <span className={`mb-2 size-4 shrink-0 rounded ${colors[i % colors.length]}`} />
                <Field label="L (mm)">
                  <Input type="number" className="text-num h-9" value={p.w} onChange={(e) => update(p.id, { w: +e.target.value })} />
                </Field>
                <Field label="H (mm)">
                  <Input type="number" className="text-num h-9" value={p.h} onChange={(e) => update(p.id, { h: +e.target.value })} />
                </Field>
                <Field label="Qté">
                  <Input type="number" className="text-num h-9" value={p.qty} onChange={(e) => update(p.id, { qty: +e.target.value })} />
                </Field>
                <Button variant="ghost" size="icon" onClick={() => setPieces((s) => s.filter((x) => x.id !== p.id))}>
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setPieces((s) => [...s, { id: Date.now(), w: 500, h: 500, qty: 1 }])}
            >
              <Plus className="size-4" /> Ajouter un visuel
            </Button>
          </div>
        </Panel>

        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <Stat label="Métrage consommé" value={(result.usedLength / 1000).toFixed(2)} unit="m linéaires" tone="success" />
            <Stat
              label="Taux de chute"
              value={(result.waste * 100).toFixed(1)}
              unit="%"
              tone={result.waste > 0.35 ? "danger" : result.waste > 0.2 ? "warning" : "success"}
            />
            <Stat
              label="Coût matière"
              value={Math.round(((result.usedLength / 1000) * (laize / 1000) * price) / 100) * 100 + ""}
              unit="FCFA"
            />
          </div>

          <Panel title="Plan de découpe" description={`Laize ${(laize / 1000).toFixed(2)} m — le rouleau se déroule vers le bas.`}>
            <div className="overflow-auto rounded-xl bg-secondary/40 p-4">
              <div
                className="relative border border-dashed border-border bg-card"
                style={{ width: laize * scale, height: Math.max(120, result.usedLength * scale) }}
              >
                {result.placed.map((p, i) => (
                  <div
                    key={i}
                    className={`absolute flex items-center justify-center border border-background/60 ${colors[pieces.findIndex((x) => x.id === p.id) % colors.length]
                      }`}
                    style={{ left: p.x * scale, top: p.y * scale, width: p.w * scale, height: p.h * scale }}
                  >
                    <span className="text-num text-[10px]">
                      {p.w}×{p.h}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            {result.skipped > 0 && (
              <p className="mt-4 text-sm text-danger">
                {result.skipped} visuel(s) dépassent la laize choisie : prévoyez un raccord ou une laize plus large.
              </p>
            )}
          </Panel>
        </div>
      </div>
    </ToolkitShell>
  );
}
