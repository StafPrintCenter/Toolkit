import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ToolkitShell, Field, Panel, Stat } from "@/components/site";
import { getTool } from "@/data/toolsRegistry";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SITE } from "@/data/site";
import { useIsMobile } from "@/hooks/use-mobile";

const PAGE_TITLE = `Simulateur de lisibilité d'enseigne, bâche et véhicule | ${SITE.tool} | ${SITE.name}`;
const PAGE_DESC = `Calculez si votre texte reste lisible selon la hauteur des lettres, la distance et la vitesse de passage, avec aperçu flou et recommandations.`;

const tool = getTool("/legibility")!;

export const Route = createFileRoute("/_tool/legibility")({
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

const CONTRASTS = [
  { label: "Fort (noir / blanc, jaune / noir)", factor: 1, fg: "#0f172a", bg: "#fdfbf7" },
  { label: "Moyen (orange / blanc)", factor: 0.8, fg: "#f97316", bg: "#fdfbf7" },
  { label: "Faible (gris / blanc)", factor: 0.55, fg: "#94a3b8", bg: "#f1f5f9" },
];

// Règle signalétique : distance de lecture confortable ≈ 250 × hauteur de capitale.
const RATIO = 250;

function Page() {
  const isMobile = useIsMobile();
  const [text, setText] = useState("STAF PRINT CENTER");
  const [height, setHeight] = useState(10);
  const [distance, setDistance] = useState(30);
  const [speed, setSpeed] = useState(50);
  const [contrast, setContrast] = useState(0);
  const c = CONTRASTS[contrast]!;

  const maxDist = (height / 100) * RATIO * c.factor;
  const ratio = maxDist / Math.max(distance, 0.1);
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const needed = 0.5 + words / 2.5; // secondes nécessaires
  const available = speed > 0 ? maxDist / (speed / 3.6) : Infinity;
  const timeOk = available >= needed;
  const minHeight = (distance / (RATIO * c.factor)) * 100;
  const minHeightMoving = speed > 0 ? ((needed * speed) / 3.6 / (RATIO * c.factor)) * 100 : 0;
  const ok = ratio >= 1 && timeOk;

  const blur = Math.max(0, (1 / Math.max(ratio, 0.05) - 1) * 2.5);
  const motion = Math.min(12, speed / 12);

  // Adaptabilité responsive de la taille maximale du texte calculé sur mobile
  const maxFontPx = isMobile ? 48 : 90;
  const minFontPx = isMobile ? 8 : 6;
  const fontPx = Math.max(minFontPx, Math.min(maxFontPx, (isMobile ? 40 : 60) * ratio));

  return (
    <ToolkitShell tool={tool}>
      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <Panel title="Paramètres">
          <div className="space-y-5">
            <Field label="Texte affiché">
              <Input value={text} onChange={(e) => setText(e.target.value)} />
            </Field>
            <Field label={`Hauteur des lettres : ${height} cm`}>
              <Slider min={1} max={100} value={[height]} onValueChange={(v) => setHeight(v[0]!)} />
            </Field>
            <Field label={`Distance du lecteur : ${distance} m`}>
              <Slider min={1} max={300} value={[distance]} onValueChange={(v) => setDistance(v[0]!)} />
            </Field>
            <Field label={`Vitesse de passage : ${speed} km/h`} hint="0 = piéton à l'arrêt">
              <Slider min={0} max={130} value={[speed]} onValueChange={(v) => setSpeed(v[0]!)} />
            </Field>
            <Field label="Contraste">
              <div className="space-y-2">
                {CONTRASTS.map((x, i) => (
                  <Button
                    key={x.label}
                    size="sm"
                    className="w-full justify-start text-xs sm:text-sm"
                    variant={contrast === i ? "default" : "outline"}
                    onClick={() => setContrast(i)}
                  >
                    {x.label}
                  </Button>
                ))}
              </div>
            </Field>
          </div>
        </Panel>

        <div className="space-y-6">
          <Panel title="Vue simulée du lecteur">
            <div
              className="flex h-44 sm:h-56 items-center justify-center overflow-hidden rounded-xl border border-border p-2 sm:p-4"
              style={{ background: c.bg }}
            >
              <span
                className="font-display font-bold whitespace-nowrap truncate max-w-full"
                style={{
                  color: c.fg,
                  fontSize: fontPx,
                  filter: `blur(${blur.toFixed(2)}px)`,
                  textShadow:
                    motion > 0.5
                      ? `${motion}px 0 ${motion}px ${c.fg}, -${motion}px 0 ${motion}px ${c.fg}`
                      : undefined,
                }}
              >
                {text || "…"}
              </span>
            </div>
            <p className={`mt-4 text-xs sm:text-sm font-medium ${ok ? "text-success" : "text-danger"}`}>
              {ok
                ? "Lisible dans ces conditions."
                : ratio < 1
                  ? "Texte trop petit pour cette distance."
                  : "Le lecteur n'a pas le temps de lire le message à cette vitesse."}
            </p>
          </Panel>

          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
            <Stat label="Distance de lecture max" value={maxDist.toFixed(0)} unit="m" tone={ratio >= 1 ? "success" : "danger"} />
            <Stat label="Hauteur min. pour cette distance" value={minHeight.toFixed(1)} unit="cm" />
            <Stat label="Temps de lecture disponible" value={Number.isFinite(available) ? available.toFixed(1) : "∞"} unit="s" tone={timeOk ? "success" : "warning"} />
            <Stat label="Temps nécessaire" value={needed.toFixed(1)} unit={`s (${words} mots)`} />
            {speed > 0 && <Stat label="Hauteur min. en mouvement" value={Math.max(minHeight, minHeightMoving).toFixed(1)} unit="cm" />}
          </div>

          <p className="text-xs text-muted-foreground">
            Repères : 1 cm de lettre ≈ 2,5 m de lecture avec un bon contraste. Pour un véhicule ou une route, limitez-vous à 5–7 mots.
          </p>
        </div>
      </div>
    </ToolkitShell>
  );
}
