import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  query: string;
  onReset: () => void;
}

export function EmptyState({ query, onReset }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mt-12 flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/80 bg-card/40 px-6 py-16 text-center shadow-sm"
    >
      <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-border bg-background shadow-inner">
        <div className="absolute -inset-2 -z-10 rounded-3xl bg-primary/10 blur-xl" />
        <Icons.SearchX className="h-10 w-10 text-muted-foreground/70" />
        <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white">
          !
        </span>
      </div>

      <h3 className="mt-6 text-lg font-semibold text-foreground">
        Aucun utilitaire trouvé
      </h3>
      <p className="mt-2 max-w-sm text-balance text-sm text-muted-foreground">
        Aucun outil ne correspond à votre recherche «{" "}
        <span className="font-mono font-medium text-foreground">{query}</span> ».
        Vérifiez l'orthographe ou changez de filtre.
      </p>

      <div className="mt-6 flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          className="h-9 gap-2 rounded-xl border-border bg-card px-4 text-xs font-medium transition-colors hover:bg-accent"
        >
          <Icons.RotateCcw className="h-3.5 w-3.5" />
          Réinitialiser les filtres
        </Button>
      </div>
    </motion.div>
  );
}