import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { CATEGORIES, type ToolDef } from "@/data/toolsRegistry";

interface ToolGridProps {
  tools: ToolDef[];
}

export function ToolGrid({ tools }: ToolGridProps) {
  return (
    <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {tools.map((tool, i) => {
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
  );
}