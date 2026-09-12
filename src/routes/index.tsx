import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { useMemo, useState } from "react";
import { CATEGORIES, TOOLS, type ToolCategory } from "@/data/toolsRegistry";
import { ToolkitHeader, ToolkitFooter } from "@/components/site";
import { Input } from "@/components/ui/input";
import { SITE } from "@/data/site";

const PAGE_TITLE = `SPC Creative Toolkit - Outils prépresse & impression | ${SITE.name}`;
const PAGE_DESC = `Le hub d'utilitaires prépresse et impression de${SITE.name}.`;

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
      <ToolkitHeader />
      <main className="flex-1">
        <section className="hero-glow border-b border-border/70">
          <div className="surface-grid">
            <div className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
              <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
                <span className="text-num inline-flex items-center gap-2 rounded-full border border-primary/30 bg-background/70 px-3 py-1 text-xs uppercase tracking-widest">
                  <Icons.ShieldCheck className="size-3.5 text-primary" /> Zero-Server Storage
                </span>
                <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-[1.05] sm:text-6xl">
                  La boîte à outils prépresse de{" "}
                  <span className="text-primary">STAF PRINT CENTER</span>.
                </h1>
                <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
                  Dix utilitaires pensés pour les graphistes, agences et étudiants de Porto-Novo.
                  Tout tourne dans votre navigateur : aucun fichier n'est envoyé sur un serveur.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 }}
                className="mt-8 max-w-xl"
              >
                <div className="relative">
                  <Icons.Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Rechercher un outil : CMJN, DPI, fond perdu, PDF…"
                    className="h-13 rounded-xl border-border bg-card pl-11 text-base shadow-soft"
                  />
                </div>
              </motion.div>

              <div className="mt-5 flex flex-wrap gap-2">
                {FILTERS.map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setFilter(f.key)}
                    className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${filter === f.key
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card hover:border-primary/50"
                      }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-14">
          <div className="flex items-baseline justify-between">
            <h2 className="text-2xl font-bold">Les outils</h2>
            <span className="text-num text-sm text-muted-foreground">
              {results.length} / {TOOLS.length}
            </span>
          </div>

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
            <p className="mt-10 text-center text-muted-foreground">
              Aucun outil ne correspond à « {query} ».
            </p>
          )}
        </section>
      </main>
      <ToolkitFooter />
    </div>
  );
}
