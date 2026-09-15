import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ToolkitShell, Panel } from "@/components/site";
import { getTool } from "@/data/toolsRegistry";
import { SITE } from "@/data/site";

const PAGE_TITLE = `Guide des tailles textiles & zones de flocage | ${SITE.tool} | ${SITE.name}`;
const PAGE_DESC = `Tableau des tailles de t-shirts du S au XXL et prévisualisation des emplacements d'impression : cœur, A4 poitrine, A3 dos, manche.`;

const tool = getTool("/textile-guide")!;

export const Route = createFileRoute("/_tool/textile-guide")({
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

const SIZES = [
  { size: "S", chest: 46, length: 69, shoulder: 42 },
  { size: "M", chest: 51, length: 71, shoulder: 45 },
  { size: "L", chest: 56, length: 74, shoulder: 48 },
  { size: "XL", chest: 61, length: 76, shoulder: 51 },
  { size: "XXL", chest: 66, length: 79, shoulder: 54 },
];

type ZoneKey = "coeur" | "a4" | "a3" | "manche" | "dos-large";

const ZONES: Record<
  ZoneKey,
  { label: string; size: string; technique: string; box: { x: number; y: number; w: number; h: number }; side: "front" | "back" }
> = {
  coeur: {
    label: "Cœur (petit logo)",
    size: "8 × 8 cm",
    technique: "Flocage ou broderie",
    box: { x: 60, y: 30, w: 16, h: 16 },
    side: "front",
  },
  a4: {
    label: "A4 poitrine",
    size: "21 × 29,7 cm",
    technique: "Sérigraphie ou DTF",
    box: { x: 30, y: 26, w: 42, h: 52 },
    side: "front",
  },
  a3: {
    label: "A3 dos",
    size: "29,7 × 42 cm",
    technique: "Sérigraphie ou DTF",
    box: { x: 22, y: 22, w: 56, h: 62 },
    side: "back",
  },
  manche: {
    label: "Manche",
    size: "7 × 5 cm",
    technique: "Transfert",
    box: { x: 4, y: 30, w: 14, h: 12 },
    side: "front",
  },
  "dos-large": {
    label: "Dos nuque",
    size: "20 × 6 cm",
    technique: "Flocage",
    box: { x: 30, y: 16, w: 42, h: 12 },
    side: "back",
  },
};

function Shirt({ zone, side }: { zone: ZoneKey; side: "front" | "back" }) {
  const z = ZONES[zone];
  const show = z.side === side;
  return (
    <div className="relative mx-auto aspect-[3/3.6] w-full max-w-65">
      <svg viewBox="0 0 100 120" className="size-full">
        <path
          d="M30 8 L14 16 L6 34 L18 40 L18 112 L82 112 L82 40 L94 34 L86 16 L70 8 C64 16 36 16 30 8 Z"
          className="fill-secondary stroke-border"
          strokeWidth="1.2"
        />
        {side === "front" && <path d="M38 8 C44 18 56 18 62 8" className="fill-none stroke-border" strokeWidth="1.2" />}
        {show && (
          <rect
            x={z.box.x}
            y={z.box.y}
            width={z.box.w}
            height={z.box.h}
            rx="1"
            className="fill-primary/25 stroke-primary"
            strokeDasharray="2 1.5"
            strokeWidth="0.9"
          />
        )}
      </svg>
      <span className="text-num absolute bottom-1 left-1/2 -translate-x-1/2 text-xs uppercase text-muted-foreground">
        {side === "front" ? "Devant" : "Dos"}
      </span>
    </div>
  );
}

function Page() {
  const [zone, setZone] = useState<ZoneKey>("a4");
  const [size, setSize] = useState("L");
  const current = ZONES[zone];
  const row = SIZES.find((s) => s.size === size)!;

  return (
    <ToolkitShell tool={tool}>
      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <Panel title="Emplacement du marquage">
          <div className="space-y-2">
            {(Object.keys(ZONES) as ZoneKey[]).map((k) => (
              <button
                key={k}
                onClick={() => setZone(k)}
                className={`w-full rounded-xl border p-3 text-left text-sm ${zone === k ? "border-primary bg-accent/60" : "border-border hover:border-primary/50 cursor-pointer"
                  }`}
              >
                <span className="font-medium">{ZONES[k].label}</span>
                <span className="text-num mt-0.5 block text-xs text-muted-foreground">
                  {ZONES[k].size} · {ZONES[k].technique}
                </span>
              </button>
            ))}
          </div>
          <div className="mt-6 rounded-xl border border-border bg-secondary/50 p-4 text-sm">
            <p className="font-medium">{current.label}</p>
            <p className="text-num mt-1 text-muted-foreground">Zone imprimable : {current.size}</p>
            <p className="mt-1 text-muted-foreground">Technique conseillée : {current.technique}</p>
          </div>
        </Panel>

        <div className="space-y-6">
          <Panel title="Prévisualisation">
            <div className="grid grid-cols-2 gap-4 rounded-xl bg-secondary/30 p-6">
              <Shirt zone={zone} side="front" />
              <Shirt zone={zone} side="back" />
            </div>
          </Panel>

          <Panel title="Guide des tailles" description="Mesures indicatives d'un t-shirt coupe droite, en centimètres.">
            <div className="mb-4 flex flex-wrap gap-2">
              {SIZES.map((s) => (
                <button
                  key={s.size}
                  onClick={() => setSize(s.size)}
                  className={`text-num rounded-full border px-4 py-1.5 text-sm ${size === s.size ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary cursor-pointer"
                    }`}
                >
                  {s.size}
                </button>
              ))}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground">
                    <th className="py-2 font-medium">Taille</th>
                    <th className="py-2 font-medium">½ Poitrine</th>
                    <th className="py-2 font-medium">Longueur</th>
                    <th className="py-2 font-medium">Épaules</th>
                  </tr>
                </thead>
                <tbody className="text-num">
                  {SIZES.map((s) => (
                    <tr key={s.size} className={`border-b border-border/60 ${s.size === size ? "bg-accent/50" : ""}`}>
                      <td className="py-2 font-semibold">{s.size}</td>
                      <td className="py-2">{s.chest} cm</td>
                      <td className="py-2">{s.length} cm</td>
                      <td className="py-2">{s.shoulder} cm</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Sur une taille {row.size}, un marquage {current.label.toLowerCase()} reste centré et lisible sans déborder
              sur les coutures.
            </p>
          </Panel>
        </div>
      </div>
    </ToolkitShell>
  );
}
