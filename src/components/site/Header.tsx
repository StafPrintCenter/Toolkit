import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./";
import { SITE, SITE_LINK } from "@/data/site";
import logo from "@/assets/logos.json";

export function ToolkitHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center">
          <img src={logo.dc} alt="Logo SPC" className="h-10 md:h-12 w-auto transition-all duration-300" />
        </Link>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Button asChild size="sm" className="hidden sm:inline-flex">
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
