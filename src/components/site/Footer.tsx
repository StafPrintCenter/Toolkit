import { SITE, SITE_LINK } from "@/data/site";

export function ToolkitFooter() {
  return (
    <footer className="border-t border-border/70 bg-card/40">
      <div className="mx-auto flex min-h-16 w-full max-w-6xl flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between sm:py-3">
        {/* Copyright */}
        <p className="text-center text-xs text-muted-foreground sm:text-left">
          © {new Date().getFullYear()} SPC Creative Toolkit · Tous droits réservés.
          <span className="mx-1.5 hidden text-muted-foreground/50 sm:inline">|</span>

          <a
            href={SITE_LINK.landingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 block font-medium underline underline-offset-4 transition-colors hover:text-primary sm:mt-0 sm:inline"
          >
            {SITE.name}
          </a>
        </p>

        {/* Liens */}
        <nav
          aria-label="Liens légaux"
          className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-muted-foreground sm:justify-end"
        >
          <a
            href={`${SITE_LINK.briefUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 transition-colors hover:text-primary"
          >
            Créer un brief
          </a>

          <span className="text-muted-foreground/50">·</span>

          <a
            href={`${SITE_LINK.docsUrl}/docs/toolkit/guide-complet`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 transition-colors hover:text-primary"
          >
            Lire la Documentation
          </a>
        </nav>
      </div>
    </footer>
  );
}
