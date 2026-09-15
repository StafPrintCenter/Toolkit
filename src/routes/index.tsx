import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CATEGORIES, TOOLS, type ToolCategory } from "@/data/toolsRegistry";
import { ToolkitShell } from "@/components/site";
import { SITE } from "@/data/site";
import { HeroSection, ToolkitFilterBar, ToolGrid, EmptyState, ToolkitPreviewIllustration } from "@/components/pages/home";

const PAGE_TITLE = `${SITE.tool} - Outils prépresse & impression | ${SITE.name}`;
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

  const handleResetFilters = () => {
    setQuery("");
    setFilter("all");
  };

  return (
    <div className="flex min-h-screen flex-col">
      <ToolkitShell>
        <main className="flex-1">
          {/* SECTION HERO */}
          <section className="relative mx-auto grid max-w-6xl grid-cols-1 gap-14 px-6 py-16 sm:py-20 lg:grid-cols-2 lg:items-center lg:gap-10">
            <HeroSection />
            <div className="w-full flex justify-center lg:justify-end">
              <ToolkitPreviewIllustration />
            </div>
          </section>

          {/* SECTION Outils & Filtres */}
          <section className="mx-auto max-w-6xl px-6 py-12 border-t border-border/70">
            <ToolkitFilterBar
              filters={FILTERS}
              activeFilter={filter}
              onSelectFilter={setFilter}
              query={query}
              onQueryChange={setQuery}
            />

            <div className="mt-8 flex items-baseline justify-between border-b border-border/50 pb-3">
              <h2 className="text-xl font-bold tracking-tight">Catalogue des outils</h2>
              <span className="text-num text-xs font-medium text-muted-foreground">
                {results.length} sur {TOOLS.length} disponible{TOOLS.length > 1 ? "s" : ""}
              </span>
            </div>

            {results.length > 0 ? (
              <ToolGrid tools={results} />
            ) : (
              <EmptyState query={query} onReset={handleResetFilters} />
            )}
          </section>
        </main>
      </ToolkitShell>
    </div>
  );
}
