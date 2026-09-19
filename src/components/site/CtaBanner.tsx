import { motion } from "framer-motion";
import { ArrowUpRight, Box } from "lucide-react";
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
      className="mt-8 overflow-hidden rounded-2xl border border-primary/25 bg-accent/60 p-4 sm:mt-10 sm:p-6 sm:flex sm:items-center sm:justify-between sm:gap-6"
    >
      <div className="text-center sm:text-left">
        <h3 className="text-base font-semibold sm:text-lg">{tool.ctaText}</h3>
        <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
          L'équipe {SITE.name} prend le relais : contrôle prépresse, épreuve et production.
        </p>
      </div>

      <div className="mt-4 flex flex-col gap-2 w-full sm:w-auto sm:flex-row sm:mt-0 sm:shrink-0">
        <Button asChild className="w-full sm:w-auto">
          <a
            href={SITE_LINK.briefUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Continuer <ArrowUpRight className="size-4" />
          </a>
        </Button>

        <Button asChild variant="secondary" className="w-full sm:w-auto">
          <a
            href={SITE_LINK.studioUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Création 3D <Box className="size-4" />
          </a>
        </Button>

        <Button asChild variant="outline" className="w-full sm:w-auto">
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
