import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  FileCog,
  Home,
  Layers3,
  MoreHorizontal,
  PanelLeft,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function NotFoundComponent() {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-background text-foreground">
      {/* Subtle workspace background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 paper-grid opacity-40"
      />

      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Application top bar */}
        <header className="flex h-12 shrink-0 items-center border-b border-border/70 bg-card/95 px-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Wrench className="h-4 w-4" />
            </div>

            <span className="font-mono text-xs font-semibold">
              OFFLINE TOOLS
            </span>
          </div>

          <div className="mx-4 hidden h-5 w-px bg-border sm:block" />

          {/* Fake document / tool tabs */}
          <div className="hidden h-full items-end gap-1 sm:flex">
            <div className="flex h-9 items-center gap-2 border-x border-t border-border/70 bg-background px-4 font-mono text-[10px] text-muted-foreground">
              <FileCog className="h-3.5 w-3.5" />
              outil-inconnu
              <span className="text-destructive">×</span>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-1">
            <button className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted">
              <Search className="h-4 w-4" />
            </button>

            <button className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
        </header>

        {/* Workspace */}
        <div className="relative flex min-h-0 flex-1">
          {/* Left toolbar */}
          <aside className="hidden w-14 shrink-0 flex-col items-center border-r border-border/70 bg-card/70 py-3 sm:flex">
            <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <PanelLeft className="h-4 w-4" />
            </button>

            <div className="my-3 h-px w-6 bg-border" />

            <button className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground">
              <Layers3 className="h-4 w-4" />
            </button>

            <button className="mt-1 flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground">
              <SlidersHorizontal className="h-4 w-4" />
            </button>
          </aside>

          {/* Tools panel */}
          <aside className="hidden w-56 shrink-0 border-r border-border/70 bg-card/50 p-4 md:block">
            <div className="mb-5">
              <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                OUTILS
              </p>
            </div>

            <div className="space-y-1">
              {[
                "Couleurs",
                "PDF",
                "Gabarits",
                "Taux d'encre",
                "QR Code",
                "Textile",
                "Calepinage",
              ].map((tool) => (
                <div
                  key={tool}
                  className="flex items-center rounded-md px-3 py-2 font-sans text-xs text-muted-foreground"
                >
                  <span className="mr-2 h-1.5 w-1.5 rounded-full bg-border" />
                  {tool}
                </div>
              ))}
            </div>
          </aside>

          {/* Main canvas */}
          <main className="relative flex min-w-0 flex-1 flex-col">
            {/* Canvas toolbar */}
            <div className="flex h-10 shrink-0 items-center justify-between border-b border-border/60 bg-card/40 px-4">
              <div className="flex items-center gap-2 font-mono text-[10px] text-muted-foreground">
                <span>WORKSPACE</span>
                <span>/</span>
                <span className="text-foreground">outil-inconnu</span>
              </div>

              <div className="font-mono text-[9px] text-muted-foreground">
                LOCAL
              </div>
            </div>

            {/* Lost tool canvas */}
            <div className="relative flex flex-1 items-center justify-center overflow-auto p-6 sm:p-10">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-[0.025] [background-image:linear-gradient(to_bottom,transparent_50%,currentColor_50%)] [background-size:100%_4px]"
              />

              <div className="relative w-full max-w-xl">
                {/* Tool window */}
                <div className="overflow-hidden rounded-xl border border-border/80 bg-card shadow-xl">
                  {/* Tool title bar */}
                  <div className="flex h-10 items-center justify-between border-b border-border/70 bg-muted/30 px-3">
                    <div className="flex items-center gap-2">
                      <FileCog className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="font-mono text-[10px] text-muted-foreground">
                        TOOL_INSTANCE
                      </span>
                    </div>

                    <span className="font-mono text-[9px] text-destructive">
                      NOT_FOUND
                    </span>
                  </div>

                  {/* Tool content */}
                  <div className="px-6 py-10 text-center sm:px-10 sm:py-12">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl border border-destructive/20 bg-destructive/10 text-destructive">
                      <FileCog className="h-6 w-6" />
                    </div>

                    <p className="mt-5 font-mono text-[10px] font-semibold tracking-widest text-destructive">
                      TOOL_404
                    </p>

                    <h1 className="mt-3 font-display text-2xl font-bold tracking-tight sm:text-3xl">
                      Cet outil s'est perdu.
                    </h1>

                    <p className="mx-auto mt-3 max-w-md font-sans text-sm leading-relaxed text-muted-foreground">
                      L'outil demandé n'est plus disponible à cette adresse.
                      L'espace de travail existe toujours, mais cette
                      fonctionnalité n'a pas pu être chargée.
                    </p>

                    {/* Fake tool parameters */}
                    <div className="mx-auto mt-7 max-w-sm overflow-hidden rounded-lg border border-border/70 bg-muted/20 text-left">
                      <div className="grid grid-cols-2 border-b border-border/60 px-3 py-2.5 font-mono text-[9px]">
                        <span className="text-muted-foreground">MODULE</span>
                        <span className="text-right text-destructive">
                          UNKNOWN
                        </span>
                      </div>

                      <div className="grid grid-cols-2 border-b border-border/60 px-3 py-2.5 font-mono text-[9px]">
                        <span className="text-muted-foreground">STATUS</span>
                        <span className="text-right text-destructive">
                          404
                        </span>
                      </div>

                      <div className="grid grid-cols-2 px-3 py-2.5 font-mono text-[9px]">
                        <span className="text-muted-foreground">
                          WORKSPACE
                        </span>
                        <span className="text-right text-primary">
                          AVAILABLE
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-7 flex flex-col justify-center gap-2 sm:flex-row">
                      <Button asChild size="sm">
                        <Link to="/">
                          <Home className="mr-2 h-3.5 w-3.5" />
                          Ouvrir les outils
                        </Link>
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.history.back()}
                      >
                        <ArrowLeft className="mr-2 h-3.5 w-3.5" />
                        Retour
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.location.reload()}
                      >
                        <RefreshCw className="mr-2 h-3.5 w-3.5" />
                        Recharger
                      </Button>
                    </div>
                  </div>

                  {/* Tool status bar */}
                  <div className="flex items-center justify-between border-t border-border/60 bg-muted/20 px-3 py-2 font-mono text-[8px] text-muted-foreground">
                    <span>READY</span>
                    <span>LOCAL PROCESSING</span>
                    <span>HTTP 404</span>
                  </div>
                </div>

                {/* Canvas coordinates */}
                <div className="mt-3 flex justify-between px-1 font-mono text-[8px] text-muted-foreground/50">
                  <span>X: 0000</span>
                  <span>Y: 0000</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
          </main>

          {/* Right properties panel */}
          <aside className="hidden w-48 shrink-0 border-l border-border/70 bg-card/50 p-4 lg:block">
            <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
              PROPRIÉTÉS
            </p>

            <div className="mt-5 space-y-4">
              <div>
                <p className="font-mono text-[8px] text-muted-foreground">
                  FORMAT
                </p>
                <div className="mt-1 h-7 rounded border border-border/60 bg-muted/20" />
              </div>

              <div>
                <p className="font-mono text-[8px] text-muted-foreground">
                  MODE
                </p>
                <div className="mt-1 h-7 rounded border border-border/60 bg-muted/20" />
              </div>

              <div>
                <p className="font-mono text-[8px] text-muted-foreground">
                  OPTIONS
                </p>
                <div className="mt-1 h-20 rounded border border-border/60 bg-muted/20" />
              </div>
            </div>
          </aside>
        </div>

        {/* Application status bar */}
        <footer className="flex h-7 shrink-0 items-center justify-between border-t border-border/70 bg-card px-3 font-mono text-[8px] text-muted-foreground">
          <div className="flex items-center gap-3">
            <span>OFFLINE</span>
            <span className="text-primary">● LOCAL</span>
          </div>

          <span>TOOLBOX v1.0</span>

          <span>NO DATA SENT</span>
        </footer>
      </div>
    </div>
  );
}