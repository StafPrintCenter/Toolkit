import { useNavigate } from "@tanstack/react-router";
import { CATEGORIES, TOOLS, type ToolCategory } from "@/data/toolsRegistry";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

/** Liste déroulante pour passer d'un outil à l'autre sans revenir à l'accueil. */
export function ToolSwitcher({ current }: { current: string }) {
  const navigate = useNavigate();
  const cats = Object.keys(CATEGORIES) as ToolCategory[];
  return (
    <Select value={current} onValueChange={(slug) => navigate({ to: slug })}>
      <SelectTrigger className="h-9 w-full max-w-xs sm:w-72" aria-label="Choisir un outil">
        <SelectValue placeholder="Choisir un outil" />
      </SelectTrigger>
      <SelectContent>
        {cats.map((c) => (
          <SelectGroup key={c}>
            <SelectLabel>{CATEGORIES[c].emoji} {CATEGORIES[c].label}</SelectLabel>
            {TOOLS.filter((t) => t.category === c).map((t) => (
              <SelectItem key={t.slug} value={t.slug}>{t.title}</SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
}
