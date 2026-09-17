import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ToolkitHeader, ToolkitFooter, CtaBanner, CookieConsent } from ".";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { CATEGORIES, type ToolItem } from "@/data/toolsRegistry";

export function ToolkitShell({ tool, children }: { tool?: ToolItem; children: ReactNode }) {
  const cat = tool ? CATEGORIES[tool.category] : null;

  return (
    <div className="flex min-h-screen flex-col">
      {/* Background papier */}
      <div className="pointer-events-none absolute inset-0 surface-grid opacity-50" />
      <ToolkitHeader />

      {tool ? (
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="size-4" />
            <span>Tous les outils</span>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4"
          >
            {cat && (
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${cat.soft}`}
              >
                {cat.emoji} {cat.label}
              </span>
            )}
            <h1 className="mt-3 text-3xl font-bold sm:text-4xl">{tool.title}</h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              {tool.shortDescription}
            </p>
          </motion.div>

          <div className="mt-8">{children}</div>
          <CtaBanner tool={tool} />
        </main>
      ) : (
        children
      )}

      <ToolkitFooter />
      <CookieConsent />
    </div>
  );
}
