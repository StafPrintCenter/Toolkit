import * as Icons from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE, SITE_LINK } from "@/data/site";

export function HeroSection() {
  return (
    <div className="flex flex-col items-start text-left">
      <a
        href={SITE_LINK.landingUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-muted-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
      >
        <Icons.Wrench className="h-3.5 w-3.5 text-primary" />
        La boîte à outils de {SITE.name}
      </a>

      <h1 className="mt-7 text-balance text-4xl font-extralight leading-[1.08] tracking-tight sm:text-6xl">
        Optimisez vos visuels avec <span className="font-black">{SITE.name}</span><br />
        en un <span className="text-primary">instant.</span>
      </h1>

      <p className="mt-6 max-w-xl text-balance text-base leading-relaxed text-muted-foreground sm:text-lg">
        Des utilitaires prépresse et impression gratuits pensés pour les graphistes, agences et étudiants.
        Tout fonctionne à 100% dans votre navigateur, sans aucun stockage serveur.
      </p>

      <div className="mt-8 flex w-full flex-col items-start gap-3 sm:flex-row sm:items-center">
        <Button asChild size="lg" className="w-full sm:w-auto">
          <a
            href="https://me.fedapay.com/spc-creative-toolkit"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2"
          >
            <Icons.HeartHandshake className="h-4 w-4" />
            Soutenir le projet
          </a>
        </Button>

        <Button asChild size="lg" variant="outline" className="w-full bg-card sm:w-auto">
          <a
            href={`${SITE_LINK.roadmapUrl}/submit`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2"
          >
            <Icons.Lightbulb className="h-4 w-4 text-amber-500" />
            Suggérer une idée
          </a>
        </Button>
      </div>

      <div className="mt-6 flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <Icons.ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
        Traitement local · Aucun fichier envoyé sur un serveur
      </div>
    </div>
  );
}