import * as Icons from "lucide-react";
import { Input } from "@/components/ui/input";
import { type ToolCategory } from "@/data/toolsRegistry";

interface ToolkitFilterBarProps {
  filters: Array<{ key: ToolCategory | "all"; label: string }>;
  activeFilter: ToolCategory | "all";
  onSelectFilter: (filter: ToolCategory | "all") => void;
  query: string;
  onQueryChange: (query: string) => void;
}

export function ToolkitFilterBar({
  filters,
  activeFilter,
  onSelectFilter,
  query,
  onQueryChange,
}: ToolkitFilterBarProps) {
  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => onSelectFilter(f.key)}
            className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${activeFilter === f.key
              ? "border-primary bg-primary text-primary-foreground font-medium"
              : "border-border bg-card hover:border-primary/50 text-muted-foreground cursor-pointer"
              }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="relative w-full md:w-80">
        <Icons.Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Rechercher (CMJN, DPI, PDF…)"
          className="h-10 rounded-xl border-border bg-card pl-9 text-sm shadow-sm"
        />
      </div>
    </div>
  );
}