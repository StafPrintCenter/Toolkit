import { SITE_LINK } from "@/data/site";
import { Palette, ScanEye, CheckCircle2, Shield, Wrench, Sparkles } from "lucide-react";
import { stripProtocol } from "@/lib/domain";

export function ToolkitPreviewIllustration() {
  return (
    <div className="relative mx-auto w-full max-w-md min-w-0 lg:mx-0 lg:max-w-none">
      {/* Halo lumineux de fond */}
      <div className="absolute -inset-10 -z-10 rounded-full bg-primary/10 blur-3xl" />

      <div className="w-full overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
        {/* En-tête Navigateur / Hub */}
        <div className="flex items-center justify-between border-b border-border bg-muted px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-danger shrink-0" />
            <span className="size-2.5 rounded-full bg-warning shrink-0" />
            <span className="size-2.5 rounded-full bg-success shrink-0" />
            <span className="ml-2 font-mono text-[10px] text-muted-foreground">
              {stripProtocol(SITE_LINK.toolkitUrl)}
            </span>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
            <Shield className="h-3 w-3" /> Client-Side
          </span>
        </div>

        {/* Studio Prépresse Interactif */}
        <div className="p-4 space-y-3 bg-background/50">
          {/* Card 1 : Simulation CMJN & TAC */}
          <div className="rounded-xl border border-border bg-card p-3 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-prepress-soft text-prepress">
                  <Palette className="h-3.5 w-3.5" />
                </div>
                <span className="text-xs font-semibold">Convertisseur RVB ➔ CMJN</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-500 font-semibold bg-emerald-500/10 px-1.5 py-0.5 rounded">
                TAC OK (280%)
              </span>
            </div>

            {/* Nuancier CMJN */}
            <div className="grid grid-cols-4 gap-1.5 pt-1">
              <div className="rounded bg-cyan-500/15 border border-cyan-500/30 p-1.5 text-center">
                <span className="block font-mono text-[9px] text-cyan-600 dark:text-cyan-400">C: 85%</span>
              </div>
              <div className="rounded bg-pink-500/15 border border-pink-500/30 p-1.5 text-center">
                <span className="block font-mono text-[9px] text-pink-600 dark:text-pink-400">M: 50%</span>
              </div>
              <div className="rounded bg-yellow-500/15 border border-yellow-500/30 p-1.5 text-center">
                <span className="block font-mono text-[9px] text-yellow-600 dark:text-yellow-400">J: 0%</span>
              </div>
              <div className="rounded border border-slate-900/30 bg-slate-900/15 p-1.5 text-center dark:border-black/40 dark:bg-black/40">
                <span className="block font-mono text-[9px] text-foreground">N: 10%</span>
              </div>
            </div>
          </div>

          {/* Card 2 : Diagnostic Résolution DPI */}
          <div className="rounded-xl border border-border bg-card p-3 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-print-soft text-print">
                  <ScanEye className="h-3.5 w-3.5" />
                </div>
                <span className="text-xs font-semibold">Contrôle DPI & Fonds Perdus</span>
              </div>
              <span className="text-[10px] font-mono text-primary font-bold">300 DPI</span>
            </div>

            {/* Progress Bar Résolution */}
            <div className="space-y-1">
              <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                <div className="h-full w-full rounded-full bg-primary" />
              </div>
              <div className="flex justify-between text-[9px] text-muted-foreground font-mono">
                <span>Format: A3 (29.7 × 42 cm)</span>
                <span>Fonds perdus: +3mm</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pied de carte / Status */}
        <div className="flex items-center justify-between border-t border-border bg-muted/40 px-4 py-2.5 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
            <span className="text-[11px]">Prêt pour la production</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-medium text-primary">
            <Sparkles className="h-3 w-3" />
            <span>Export SVG / PDF</span>
          </div>
        </div>
      </div>

      {/* Badge flottant */}
      <div className="absolute -bottom-4 -left-4 hidden items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 shadow-lg sm:flex">
        <Wrench className="size-4 text-primary" />
        <span className="text-xs font-medium text-foreground">
          10 utilitaires prépresse inclus
        </span>
      </div>
    </div>
  );
}