import { Link } from "@tanstack/react-router";
import {
  Palette,
  FileText,
  Grid,
  QrCode,
  Scissors,
  Layers,
  Sliders,
  AlertTriangle,
  RotateCcw,
  Home,
  ArrowLeft,
  Ruler,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function NotFoundComponent() {
  return (
    <div className="flex h-screen w-full flex-col bg-background text-foreground select-none overflow-hidden font-sans">

      {/* 1. BARRE D'EN-TÊTE / MENU APPLICATIF */}
      <header className="flex h-12 w-full shrink-0 items-center justify-between border-b border-border bg-card px-4 text-xs font-medium">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 font-mono font-bold tracking-wider text-primary">
            <span className="flex h-2 w-2 rounded-full bg-destructive animate-pulse" />
            SPC_STUDIO // OFFLINE
          </div>
          <div className="hidden sm:flex items-center gap-3 text-muted-foreground border-l border-border pl-4 font-mono text-[11px]">
            <span>Fichier</span>
            <span>Édition</span>
            <span>Affichage</span>
            <span>Espace de travail</span>
          </div>
        </div>

        {/* Profil de couleur CMJN en erreur */}
        <div className="flex items-center gap-3 font-mono text-[11px]">
          <span className="hidden md:inline text-muted-foreground">Profil: FOGRA39</span>
          <div className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-cyan-500" title="C: 0%" />
            <span className="h-2.5 w-2.5 rounded-full bg-magenta-500" title="M: 0%" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" title="J: 0%" />
            <span className="h-2.5 w-2.5 rounded-full bg-slate-900 dark:bg-slate-100" title="N: 100%" />
          </div>
          <span className="rounded bg-destructive/10 px-2 py-0.5 text-[10px] font-bold text-destructive">
            404_ERR
          </span>
        </div>
      </header>

      {/* 2. CORPS PRINCIPAL DU STUDIO */}
      <div className="flex flex-1 overflow-hidden">

        {/* BARRE D'OUTILS LATÉRALE GAUCHE (Désactivée) */}
        <aside className="flex w-14 shrink-0 flex-col items-center justify-between border-r border-border bg-card/50 py-3 text-muted-foreground/50">
          <div className="flex flex-col gap-4">
            <div className="p-2 rounded-lg bg-muted text-muted-foreground cursor-not-allowed" title="Sélection">
              <Palette size={18} />
            </div>
            <div className="p-2 hover:bg-muted/50 rounded-lg cursor-not-allowed" title="PDF Extract">
              <FileText size={18} />
            </div>
            <div className="p-2 hover:bg-muted/50 rounded-lg cursor-not-allowed" title="Calepinage">
              <Grid size={18} />
            </div>
            <div className="p-2 hover:bg-muted/50 rounded-lg cursor-not-allowed" title="QR Code">
              <QrCode size={18} />
            </div>
            <div className="p-2 hover:bg-muted/50 rounded-lg cursor-not-allowed" title="Flocage / Textile">
              <Scissors size={18} />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Ruler size={18} />
            <Layers size={18} />
          </div>
        </aside>

        {/* CANVA CENTRAL (Zone de travail / Plan de coupe perdu) */}
        <main className="relative flex flex-1 flex-col items-center justify-center p-6 bg-muted/20 overflow-hidden">
          {/* Motifs de fond : Grille de découpe et repères d'imprimerie */}
          <div className="pointer-events-none absolute inset-0 grid-field opacity-60" />

          {/* Repères de coupe d'atelier au centre */}
          <div className="relative flex w-full max-w-xl flex-col items-center rounded-3xl border-2 border-dashed border-destructive/40 bg-card p-8 sm:p-10 shadow-2xl backdrop-blur-md">

            {/* Repères d'angles de découpe */}
            <div className="pointer-events-none absolute -top-3 -left-3 h-6 w-6 border-t-2 border-l-2 border-destructive" />
            <div className="pointer-events-none absolute -top-3 -right-3 h-6 w-6 border-t-2 border-r-2 border-destructive" />
            <div className="pointer-events-none absolute -bottom-3 -left-3 h-6 w-6 border-b-2 border-l-2 border-destructive" />
            <div className="pointer-events-none absolute -bottom-3 -right-3 h-6 w-6 border-b-2 border-r-2 border-destructive" />

            {/* Badge de statut central */}
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-destructive/30 bg-destructive/10 px-4 py-1.5 font-mono text-xs font-semibold text-destructive">
              <AlertTriangle size={14} />
              UTILITAIRE_HORS_GABARIT // 404
            </div>

            <h1 className="font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl text-center">
              Fichier ou outil introuvable
            </h1>

            <p className="mt-3 text-sm text-muted-foreground text-center leading-relaxed max-w-md">
              Le gabarit, le convertisseur ou le module d'atelier sélectionné n'est pas chargé sur votre plan de travail local.
            </p>

            {/* Fiche technique / Diagnostic */}
            <div className="mt-6 w-full rounded-xl border border-border bg-muted/40 p-4 font-mono text-xs space-y-2">
              <div className="flex justify-between text-muted-foreground">
                <span>Coordonnées canvas :</span>
                <span className="text-destructive font-bold">X: -999 | Y: -999</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Taux d'ancrage (TAC) :</span>
                <span className="text-foreground">0% (Inconnu)</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Diagnostic :</span>
                <span className="text-destructive">MODULE_UNAVAILABLE</span>
              </div>
            </div>

            {/* Actions de réinitialisation */}
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
              <Button asChild size="default" className="w-full sm:w-auto rounded-full font-semibold shadow-md">
                <Link to="/">
                  <Home className="mr-2 h-4 w-4" />
                  Catalogue des outils
                </Link>
              </Button>

              <Button
                variant="outline"
                size="default"
                className="w-full sm:w-auto rounded-full font-semibold"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour
              </Button>

              <Button
                variant="ghost"
                size="default"
                className="w-full sm:w-auto rounded-full text-muted-foreground"
                onClick={() => window.location.reload()}
              >
                <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                Recharger le plan
              </Button>
            </div>
          </div>
        </main>

        {/* PANNEAU LATÉRAL DROIT (Réglages désactivés) */}
        <aside className="hidden lg:flex w-64 shrink-0 flex-col border-l border-border bg-card/50 p-4 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-border pb-3 mb-4 text-muted-foreground">
            <span className="flex items-center gap-1.5 font-bold text-foreground">
              <Sliders size={14} /> PROPRIÉTÉS
            </span>
            <span className="text-[10px]">VERROUILLÉ</span>
          </div>

          <div className="space-y-4 opacity-50 pointer-events-none">
            <div>
              <label className="text-[10px] text-muted-foreground block mb-1">Format de sortie</label>
              <div className="h-8 w-full rounded-md border border-border bg-muted/60 px-2 flex items-center justify-between text-muted-foreground">
                <span>Inconnu (0 x 0 mm)</span>
              </div>
            </div>

            <div>
              <label className="text-[10px] text-muted-foreground block mb-1">Résolution (DPI)</label>
              <div className="h-8 w-full rounded-md border border-border bg-muted/60 px-2 flex items-center justify-between text-muted-foreground">
                <span>0 DPI</span>
              </div>
            </div>

            <div>
              <label className="text-[10px] text-muted-foreground block mb-1">Calques d'impression</label>
              <div className="space-y-1.5 pt-1">
                <div className="h-6 rounded bg-muted/80 w-full" />
                <div className="h-6 rounded bg-muted/80 w-3/4" />
              </div>
            </div>
          </div>
        </aside>

      </div>

      {/* 3. BARRE DE STATUT ET RÉGLETTE EN BAS */}
      <footer className="flex h-8 w-full shrink-0 items-center justify-between border-t border-border bg-card px-4 font-mono text-[11px] text-muted-foreground">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Maximize2 size={12} /> ÉCHELLE: N/A
          </span>
          <span className="hidden sm:inline">UNITÉ: MILLIMÈTRES (MM)</span>
        </div>

        <div className="flex items-center gap-4">
          <span>MODE: OFFLINE_WASM</span>
          <Minimize2 size={12} className="cursor-pointer hover:text-foreground" />
        </div>
      </footer>

    </div>
  );
}