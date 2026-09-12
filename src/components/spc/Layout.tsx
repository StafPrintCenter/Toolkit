import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, Printer } from "lucide-react";
import type { ReactNode } from "react";
import { CATEGORIES, type ToolItem } from "@/data/toolsRegistry";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-glow">
            <Printer className="size-5" />
          </span>
          <span className="leading-tight">
            <span className="block font-display text-sm font-bold">OLD</span>
            <span className="block text-num text-[10px] uppercase tracking-widest text-muted-foreground">
              tot.com
            </span>
          </span>
        </Link>
        <div className="flex items-center gap-1">
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <a href="https://brief.stafprint.com" target="_blank" rel="noreferrer">
              Lancer un brief
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}

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

export function ToolShell({ tool, children }: { tool: ToolItem; children: ReactNode }) {
  const cat = CATEGORIES[tool.category];
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
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
    </div>
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
