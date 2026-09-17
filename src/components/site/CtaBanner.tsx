import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { ToolItem } from "@/data/toolsRegistry";
import { Button } from "@/components/ui/button";
import { SITE, SITE_LINK } from "@/data/site";

export function CtaBanner({ tool }: { tool: ToolItem }) {
  const docSlug = tool.slug.replace(/^\//, "");
  const docsHref = `${SITE_LINK.docsUrl}/docs/tools/${docSlug}`;

  return (
    <motion.aside
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mt-10 overflow-hidden rounded-2xl border border-primary/25 bg-accent/60 p-6 sm:flex sm:items-center sm:justify-between sm:gap-6"
    >
      <div>
        <h3 className="text-lg font-semibold">{tool.ctaText}</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          L'équipe ${SITE.name} prend le relais : contrôle prépresse, épreuve et production.
        </p>
      </div>
      <div className="mt-4 flex flex-wrap gap-2 sm:mt-0 sm:shrink-0">
        <Button asChild>
          <a
            href={SITE_LINK.briefUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Continuer <ArrowUpRight className="size-4" />
          </a>
        </Button>
        <Button asChild variant="outline">
          <a
            href={docsHref}
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </Button>
      </div>
    </motion.aside>
  );
}
