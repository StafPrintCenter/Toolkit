import { Link } from "@tanstack/react-router";
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
