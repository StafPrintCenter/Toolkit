import { Link } from "@tanstack/react-router";
import { Home, ArrowLeft, RefreshCw, Layers, ShieldAlert, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NotFoundComponent() {
  return (
    <div className="relative flex min-h-screen w-full flex-col justify-between p-4 md:p-8 select-none bg-background text-foreground overflow-hidden">
      {/* Fond grille de précision / Plan de coupe */}
      <div className="pointer-events-none absolute inset-0 grid-field opacity-60" />

      {/* Repères de coupe d'imprimerie aux 4 coins de l'écran */}
      <div className="pointer-events-none absolute top-3 left-3 h-6 w-6 border-t-2 border-l-2 border-muted-foreground/30" />
      <div className="pointer-events-none absolute top-3 right-3 h-6 w-6 border-t-2 border-r-2 border-muted-foreground/30" />
      <div className="pointer-events-none absolute bottom-3 left-3 h-6 w-6 border-b-2 border-l-2 border-muted-foreground/30" />
      <div className="pointer-events-none absolute bottom-3 right-3 h-6 w-6 border-b-2 border-r-2 border-muted-foreground/30" />

      {/* Barre supérieure : Statut Hors Ligne / Moteur d'Atelier */}
      <header className="relative z-10 mx-auto flex w-full max-w-4xl items-center justify-between rounded-2xl border border-border bg-card/80 px-4 py-3 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Cpu size={16} />
          </div>
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            LOCAL_ENGINE // OFFLINE_UTILITIES
          </span>
        </div>

        {/* Témoin de couleur CMJN en erreur */}
        <div className="flex items-center gap-1.5 font-mono text-xs">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-cyan-500" title="Cyan 0%" />
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-magenta-500" title="Magenta 0%" />
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-yellow-400" title="Yellow 0%" />
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-slate-900 dark:bg-slate-100" title="Key 100%" />
          <span className="text-destructive font-bold ml-1">ERR_404</span>
        </div>
      </header>

      {/* Contenu principal : Plan de travail / Fichier manquant */}
      <main className="relative z-10 my-auto mx-auto flex w-full max-w-xl flex-col items-center text-center py-8">

        {/* Badge d'erreur Atelier / Marge Perdue */}
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-destructive/30 bg-destructive/10 px-4 py-1.5 font-mono text-xs font-semibold text-destructive shadow-sm">
          <ShieldAlert size={14} />
          HORS_GABARIT // OUT_OF_BOUNDS
        </div>

        {/* Titre Technique */}
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          Utilitaire introuvable.
        </h1>

        <p className="mt-3 text-sm sm:text-base leading-relaxed text-muted-foreground max-w-md">
          L'outil, le convertisseur ou le script de calcul demandé n'est pas chargé dans la suite hors ligne locale.
        </p>

        {/* Carte style Fiche de Fab / Mire Technique */}
        <div className="mt-6 w-full rounded-2xl border border-border bg-card p-5 text-left shadow-panel backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-3">
            <span className="font-mono text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1.5">
              <Layers size={14} className="text-primary" /> [ Diagnostic de la matrice ]
            </span>
            <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-muted text-muted-foreground font-medium">
              STATUS: NULL
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 font-mono text-xs">
            <div className="rounded-lg border border-border/60 bg-muted/40 p-2.5">
              <span className="text-[10px] text-muted-foreground block">Moteur local :</span>
              <span className="text-foreground font-semibold">Client-side / WASM</span>
            </div>

            <div className="rounded-lg border border-border/60 bg-muted/40 p-2.5">
              <span className="text-[10px] text-muted-foreground block">Taux d'encrage :</span>
              <span className="text-destructive font-semibold">0% (Inconnu)</span>
            </div>

            <div className="col-span-2 rounded-lg border border-border/60 bg-muted/40 p-2.5 flex justify-between items-center">
              <span className="text-[10px] text-muted-foreground">Erreur d'adressage :</span>
              <span className="text-destructive font-semibold">MODULE_NOT_INITIALIZED</span>
            </div>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
          <Button asChild size="lg" className="w-full sm:w-auto rounded-full font-semibold shadow-md">
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Sommaire des outils
            </Link>
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="w-full sm:w-auto rounded-full font-semibold"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Outil précédent
          </Button>

          <Button
            variant="ghost"
            size="lg"
            className="w-full sm:w-auto rounded-full text-muted-foreground"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="mr-2 h-3.5 w-3.5" />
            Réinitialiser
          </Button>
        </div>

      </main>

      {/* Footer style Ruban de graduation / Réglette */}
      <footer className="relative z-10 mx-auto flex items-center justify-between w-full max-w-xl rounded-full border border-border bg-card/60 px-6 py-2.5 backdrop-blur-md font-mono text-[11px] text-muted-foreground">
        <span>0 mm</span>
        <span className="hidden sm:inline">| | | | | | | | | | | | | | | | | | | | | | |</span>
        <span className="font-semibold text-foreground">GABARIT A4 / A3 / ROLL</span>
        <span className="hidden sm:inline">| | | | | | | | | | | | | | | | | | | | | | |</span>
        <span>297 mm</span>
      </footer>
    </div>
  );
}