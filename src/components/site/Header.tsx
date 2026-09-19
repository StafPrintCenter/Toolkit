import { useState } from "react";
import { Link } from "@tanstack/react-router";
import * as Icons from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "./";
import { SITE, SITE_LINK } from "@/data/site";
import { SpcDeskLogo } from "@/components/site";

export function ToolkitHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex shrink-0 items-center">
          <SpcDeskLogo className="h-10 w-auto sm:h-12" />
        </Link>

        {/* Menu Desktop */}
        <div className="hidden items-center gap-2 md:flex">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="h-9 px-3 text-xs"
            title="Soutenir le projet"
          >
            <a
              href="https://me.fedapay.com/spc-creative-toolkit"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5"
            >
              <Icons.HeartHandshake className="h-4 w-4 text-rose-500" />
              <span>Soutenir</span>
            </a>
          </Button>

          {/* Suggestions */}
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="h-9 px-3 text-xs"
            title="Suggérer une idée"
          >
            <a
              href={`${SITE_LINK.roadmapUrl}/submit`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5"
            >
              <Icons.Lightbulb className="h-4 w-4 text-amber-500" />
              <span>Suggérer</span>
            </a>
          </Button>

          <div className="mx-0.5 h-4 w-px bg-border/80" />

          {/* Thème */}
          <ThemeToggle />

          {/* Brief */}
          <Button asChild size="sm" className="h-9 text-xs">
            <a
              href={SITE_LINK.briefUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Lancer un brief
            </a>
          </Button>

          {/* Studio 3D */}
          <Button asChild size="sm" variant="secondary" className="h-9 text-xs">
            <a
              href={SITE_LINK.studioUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Studio 3D
            </a>
          </Button>
        </div>

        {/* Actions Rapides Mobile + Bouton Menu */}
        <div className="flex items-center gap-1.5 md:hidden">
          <ThemeToggle />

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9"
                aria-label="Ouvrir le menu"
              >
                <Icons.Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="flex flex-col justify-between p-6">
              <div className="flex flex-col gap-6">
                <SheetHeader className="text-left">
                  <SheetTitle className="flex items-center gap-2">
                    <SpcDeskLogo className="h-8 w-auto" />
                  </SheetTitle>
                </SheetHeader>

                {/* Liens principaux du menu */}
                <nav className="flex flex-col gap-2">
                  <a
                    href={SITE_LINK.briefUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    <span>Lancer un brief</span>
                    <Icons.ArrowUpRight className="h-4 w-4" />
                  </a>

                  <a
                    href={SITE_LINK.studioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between rounded-lg bg-secondary px-4 py-3 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
                  >
                    <span>Studio 3D</span>
                    <Icons.ArrowUpRight className="h-4 w-4" />
                  </a>
                </nav>

                <div className="h-px w-full bg-border" />

                {/* Liens secondaires */}
                <div className="flex flex-col gap-1">
                  <a
                    href="https://me.fedapay.com/spc-creative-toolkit"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  >
                    <Icons.HeartHandshake className="h-4 w-4 text-rose-500" />
                    <span>Soutenir le projet</span>
                  </a>

                  <a
                    href={`${SITE_LINK.roadmapUrl}/submit`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  >
                    <Icons.Lightbulb className="h-4 w-4 text-amber-500" />
                    <span>Suggérer une idée</span>
                  </a>
                </div>
              </div>

              {/* Pied du Drawer */}
              <div className="pt-4 border-t border-border text-center text-xs text-muted-foreground">
                {SITE.name}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}