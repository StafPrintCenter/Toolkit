import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { useMemo, useState } from "react";
import { CATEGORIES, TOOLS, type ToolCategory } from "@/data/toolsRegistry";
import { ToolkitShell } from "@/components/site";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SITE, SITE_LINK } from "@/data/site";
import { ToolkitPreviewIllustration } from "@/components/pages/home/ToolkitPreviewIllustration";

const PAGE_TITLE = `SPC Creative Toolkit - Outils prépresse & impression | ${SITE.name}`;
const PAGE_DESC = `Le hub d'utilitaires prépresse et impression de ${SITE.name}.`;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: PAGE_TITLE },
      { name: "description", content: PAGE_DESC },
      { property: "og:title", content: PAGE_TITLE },
      { property: "og:description", content: PAGE_DESC },
    ],
  }),
  component: Dashboard,
});

const FILTERS: Array<{ key: ToolCategory | "all"; label: string }> = [
  { key: "all", label: "Tous les outils" },
  { key: "prepression", label: `${CATEGORIES.prepression.emoji} Prépresse` },
  { key: "print", label: `${CATEGORIES.print.emoji} Impression` },
  { key: "format", label: `${CATEGORIES.format.emoji} Grand format` },
  { key: "pdf", label: `${CATEGORIES.pdf.emoji} PDF` },
];

function Dashboard() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<ToolCategory | "all">("all");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return TOOLS.filter(
      (t) =>
        (filter === "all" || t.category === filter) &&
        (q === "" ||
          t.title.toLowerCase().includes(q) ||
          t.shortDescription.toLowerCase().includes(q) ||
          t.slug.includes(q)),
    );
  }, [query, filter]);

  return (
    <div className="flex min-h-screen flex-col">
      <ToolkitShell>
        <main className="flex-1">
          {/* HERO SECTION - Layout 2 colonnes standardisé */}
          <section className="relative mx-auto grid max-w-6xl grid-cols-1 gap-14 px-6 py-16 sm:py-20 lg:grid-cols-2 lg:items-center lg:gap-10">

            {/* COLONNE GAUCHE : Badge, Titre, Description & CTA */}
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

              {/* Boutons d'Action CTA */}
              <div className="mt-8 flex w-full flex-col items-start gap-3 sm:flex-row sm:items-center">
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <a
                    href="https://me.fedapay.com/spc-creative-toolkit"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2"
                  >
                    <Icons.Heart className="h-4 w-4 fill-current text-rose-500" />
                    Soutenir le projet
                  </a>
                </Button>

                <Button asChild size="lg" variant="outline" className="w-full bg-card sm:w-auto">
                  <a
                    href="http://roadmap.stafprint.com/submit"
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

            {/* COLONNE DROITE : Preview Illustration */}
            <div className="w-full flex justify-center lg:justify-end">
              <ToolkitPreviewIllustration />
            </div>
          </section>

          {/* SECTION GRILLE DES OUTILS & RECHERCHE */}
          <section className="mx-auto max-w-6xl px-6 py-12 border-t border-border/70">
            {/* Barre de Recherche & Filtres déplacés ici */}
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

              {/* Filtres par catégorie */}
              <div className="flex flex-wrap gap-2">
                {FILTERS.map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setFilter(f.key)}
                    className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${filter === f.key
                      ? "border-primary bg-primary text-primary-foreground font-medium"
                      : "border-border bg-card hover:border-primary/50 text-muted-foreground cursor-pointer"
                      }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Champ de Recherche */}
              <div className="relative w-full md:w-80">
                <Icons.Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Rechercher (CMJN, DPI, PDF…)"
                  className="h-10 rounded-xl border-border bg-card pl-9 text-sm shadow-sm"
                />
              </div>
            </div>

            {/* En-tête du compteur */}
            <div className="mt-8 flex items-baseline justify-between border-b border-border/50 pb-3">
              <h2 className="text-xl font-bold tracking-tight">Catalogues des outils</h2>
              <span className="text-num text-xs font-medium text-muted-foreground">
                {results.length} sur {TOOLS.length} disponible{TOOLS.length > 1 ? "s" : ""}
              </span>
            </div>

            {/* Grille des cartes d'outils */}
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((tool, i) => {
                const cat = CATEGORIES[tool.category];
                const Icon = (Icons[tool.icon as keyof typeof Icons] ??
                  Icons.Wrench) as React.ComponentType<{ className?: string }>;
                return (
                  <motion.div
                    key={tool.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.04, 0.3) }}
                    whileHover={{ y: -4 }}
                  >
                    <Link
                      to={tool.slug}
                      className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-soft transition-colors hover:border-primary/50"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <span className={`flex size-11 items-center justify-center rounded-xl ${cat.soft}`}>
                          <Icon className="size-5" />
                        </span>
                        {tool.badge && (
                          <span className="text-num rounded-full border border-border px-2.5 py-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                            {tool.badge}
                          </span>
                        )}
                      </div>
                      <h3 className="mt-4 text-lg font-semibold group-hover:text-primary">
                        {tool.title}
                      </h3>
                      <p className="mt-2 flex-1 text-sm text-muted-foreground">
                        {tool.shortDescription}
                      </p>
                      <span className="text-num mt-4 inline-flex items-center gap-1 text-xs text-muted-foreground">
                        {tool.slug}
                        <Icons.ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                      </span>
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {results.length === 0 && (
              <div className="mt-12 text-center text-muted-foreground py-8 border border-dashed rounded-2xl">
                <p>Aucun outil ne correspond à votre recherche « <span className="text-foreground font-medium">{query}</span> ».</p>
              </div>
            )}
          </section>
        </main>
      </ToolkitShell>
    </div>
  );
}
