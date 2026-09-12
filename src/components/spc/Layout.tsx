import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { type ToolItem } from "@/data/toolsRegistry";
import { Button } from "@/components/ui/button";

export function CtaBanner({ tool }: { tool: ToolItem }) {
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
          L'équipe STAF PRINT CENTER prend le relais : contrôle prépresse, épreuve et production.
        </p>
      </div>
      <div className="mt-4 flex flex-wrap gap-2 sm:mt-0 sm:shrink-0">
        <Button asChild>
          <a href={tool.ctaTargetUrl} target="_blank" rel="noreferrer">
            Continuer <ArrowUpRight className="size-4" />
          </a>
        </Button>
        <Button asChild variant="outline">
          <a href="https://docs.stafprint.com" target="_blank" rel="noreferrer">
            Documentation
          </a>
        </Button>
      </div>
    </motion.aside>
  );
}

export function Panel({
  title,
  description,
  children,
  className = "",
}: {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-2xl border border-border bg-card p-6 shadow-soft ${className}`}>
      {title && <h2 className="text-lg font-semibold">{title}</h2>}
      {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      <div className={title ? "mt-5" : ""}>{children}</div>
    </section>
  );
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium">{label}</span>
      {children}
      {hint && <span className="block text-xs text-muted-foreground">{hint}</span>}
    </label>
  );
}

export function Stat({ label, value, unit, tone = "default" }: { label: string; value: string; unit?: string; tone?: "default" | "success" | "warning" | "danger" }) {
  const tones = {
    default: "border-border bg-secondary/50",
    success: "border-success/40 bg-success/10",
    warning: "border-warning/40 bg-warning/10",
    danger: "border-danger/40 bg-danger/10",
  } as const;
  return (
    <div className={`rounded-xl border p-4 ${tones[tone]}`}>
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="text-num mt-1 text-2xl font-semibold">
        {value}
        {unit && <span className="ml-1 text-sm text-muted-foreground">{unit}</span>}
      </p>
    </div>
  );
}
