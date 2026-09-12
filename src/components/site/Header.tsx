import { Link } from "@tanstack/react-router";
import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./";

export function ToolkitHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-glow">
            <Printer className="size-5" />
          </span>
          <span className="leading-tight">
            <span className="block font-display text-sm font-bold">SPC Creative Toolkit</span>
            <span className="block text-num text-[10px] uppercase tracking-widest text-muted-foreground">
              tools.stafprint.com
            </span>
          </span>
        </Link>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <a href="https://brief.stafprint.com" target="_blank" rel="noreferrer">
              Lancer un brief
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}
