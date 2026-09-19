import { useState } from "react";
import { Link } from "@tanstack/react-router";
import * as Icons from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./";
import { SITE_LINK } from "@/data/site";
import { SpcDeskLogo } from "@/components/site";

export function ToolkitHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <SpcDeskLogo className="mx-auto h-12 w-auto" />
        </Link>

        {/* Desktop actions */}
        <div className="hidden items-center gap-1.5 sm:flex sm:gap-2">
          {/* Soutenir */}
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="h-9 px-2.5 text-xs sm:px-3"
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
            className="h-9 px-2.5 text-xs sm:px-3"
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

        {/* Mobile actions */}
        <div className="flex items-center gap-1.5 sm:hidden">
          <ThemeToggle />

          <Button variant="ghost" size="icon" className="h-9 w-9"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <Icons.X className="h-5 w-5" />
            ) : (
              <Icons.Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-border/70 bg-background/95 px-4 py-4 backdrop-blur-xl sm:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-3">
            {/* Actions principales alignées côte à côte */}
            <div className="grid grid-cols-2 gap-2">
              {/* Brief */}
              <a
                href={SITE_LINK.briefUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl bg-primary px-3 py-2.5 text-xs font-medium text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
              >
                <Icons.MessageSquareText className="h-4 w-4 shrink-0" />
                <span>Lancer un brief</span>
              </a>

              {/* Studio 3D */}
              <a
                href={SITE_LINK.studioUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl bg-secondary px-3 py-2.5 text-xs font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
              >
                <Icons.Box className="h-4 w-4 shrink-0" />
                <span>Studio 3D</span>
              </a>
            </div>

            <div className="my-1 h-px w-full bg-border/60" />

            {/* Liens secondaires */}
            <div className="flex flex-col gap-1">
              {/* Soutenir */}
              <a
                href="https://me.fedapay.com/spc-creative-toolkit"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Icons.HeartHandshake className="h-4 w-4 text-rose-500" />
                <span>Soutenir le projet</span>
                <Icons.ExternalLink className="ml-auto h-3.5 w-3.5 opacity-50" />
              </a>

              {/* Suggestions */}
              <a
                href={`${SITE_LINK.roadmapUrl}/submit`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Icons.Lightbulb className="h-4 w-4 text-amber-500" />
                <span>Suggérer une idée</span>
                <Icons.ExternalLink className="ml-auto h-3.5 w-3.5 opacity-50" />
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
