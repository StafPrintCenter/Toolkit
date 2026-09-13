import { Link } from "@tanstack/react-router";
import * as Icons from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./";
import { SITE_LINK } from "@/data/site";
import { SpcDeskLogo } from "@/components/site";

export function ToolkitHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center">
          <SpcDeskLogo className="mx-auto h-14 w-auto" />
        </Link>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Bouton Soutien (FedaPay) */}
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
              <Icons.HeartHandshake className="h-4 w-4  text-rose-500" />
              <span className="hidden sm:inline">Soutenir</span>
            </a>
          </Button>

          {/* Bouton Suggestions (Idées) */}
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="h-9 px-2.5 text-xs sm:px-3"
            title="Suggérer une idée"
          >
            <a
              href="http://roadmap.stafprint.com/submit"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5"
            >
              <Icons.Lightbulb className="h-4 w-4 text-amber-500" />
              <span className="hidden sm:inline">Suggérer</span>
            </a>
          </Button>

          <div className="h-4 w-px bg-border/80 mx-0.5" />

          {/* Theme Switcher */}
          <ThemeToggle />

          {/* CTA Brief principal */}
          <Button asChild size="sm" className="hidden md:inline-flex h-9 text-xs">
            <a
              href={SITE_LINK.briefUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Lancer un brief
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}
