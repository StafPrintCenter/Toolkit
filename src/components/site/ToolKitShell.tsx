import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ToolkitHeader, ToolkitFooter, CtaBanner } from ".";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { CATEGORIES, type ToolItem } from "@/data/toolsRegistry";

export function ToolKitShell({ tool, children }: { tool: ToolItem; children: ReactNode }) {
  const cat = CATEGORIES[tool.category];
  return (
    <div className="flex min-h-screen flex-col">
      <ToolkitHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="size-4" /> Tous les outils
        </Link>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${cat.soft}`}
          >
            {cat.emoji} {cat.label}
          </span>
          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">{tool.title}</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">{tool.shortDescription}</p>
        </motion.div>
        <div className="mt-8">{children}</div>
        <CtaBanner tool={tool} />
      </main>
      <ToolkitFooter />
    </div>
  );
}
