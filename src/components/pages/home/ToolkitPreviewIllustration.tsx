import { SITE_LINK } from "@/data/site";
import { Check, Crop, FileDown, Palette, ScanLine } from "lucide-react";
import { stripProtocol } from "@/lib/domain";

const CHANNELS = [
  { label: "C", value: "72%", className: "w-[72%] bg-format" },
  { label: "M", value: "38%", className: "w-[38%] bg-prepress" },
  { label: "J", value: "6%", className: "w-[6%] bg-warning" },
  { label: "N", value: "12%", className: "w-[12%] bg-foreground" },
];

export function ToolkitPreviewIllustration() {
  return (
    <div className="relative mx-auto w-full max-w-lg min-w-0 lg:mx-0 lg:max-w-none">
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
        <div className="flex items-center gap-2 border-b border-border bg-muted/60 px-4 py-3">
          <span className="size-2.5 rounded-full bg-danger" />
          <span className="size-2.5 rounded-full bg-warning" />
          <span className="size-2.5 rounded-full bg-success" />
          <span className="text-num ml-3 min-w-0 flex-1 truncate rounded-md bg-background px-3 py-1 text-[10px] text-muted-foreground">
            {stripProtocol(SITE_LINK.toolkitUrl)}/rgb-to-cmyk
          </span>
        </div>

        <div className="grid gap-4 p-4 sm:grid-cols-[1.12fr_.88fr] sm:p-5">
          <div className="relative flex min-h-64 items-center justify-center overflow-hidden rounded-xl border border-border bg-background p-6">
            <div className="surface-grid absolute inset-0 opacity-60" />
            <div className="relative aspect-4/5 w-36 border border-dashed border-primary/70 bg-card p-3 shadow-soft">
              <span className="absolute -left-2 -top-px h-px w-4 bg-primary" />
              <span className="absolute -left-px -top-2 h-4 w-px bg-primary" />
              <span className="absolute -bottom-px -right-2 h-px w-4 bg-primary" />
              <span className="absolute -bottom-2 -right-px h-4 w-px bg-primary" />
              <div className="flex h-full flex-col justify-between border border-primary/30 bg-accent/50 p-3">
                <Palette className="size-8 text-primary" />
                <div>
                  <div className="h-2 w-4/5 rounded bg-foreground/80" />
                  <div className="mt-2 h-1.5 w-full rounded bg-border" />
                  <div className="mt-1.5 h-1.5 w-2/3 rounded bg-border" />
                </div>
              </div>
            </div>
            <span className="text-num absolute bottom-3 left-3 text-[9px] text-muted-foreground">A5 · 148 × 210 mm</span>
          </div>

          <div className="space-y-3">
            <div className="rounded-xl border border-border bg-muted/45 p-3">
              <div className="mb-3 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-semibold"><Palette className="size-3.5 text-primary" /> Profil CMJN</span>
                <span className="text-num text-[9px] text-success">TAC 128%</span>
              </div>
              <div className="space-y-2">
                {CHANNELS.map((channel) => (
                  <div key={channel.label} className="grid grid-cols-[14px_1fr_30px] items-center gap-2">
                    <span className="text-num text-[9px]">{channel.label}</span>
                    <span className="h-1.5 overflow-hidden rounded-full bg-border"><span className={`block h-full rounded-full ${channel.className}`} /></span>
                    <span className="text-num text-right text-[9px] text-muted-foreground">{channel.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg border border-success/35 bg-success/10 p-2.5">
                <ScanLine className="size-4 text-success" />
                <p className="text-num mt-2 text-lg font-semibold">300</p>
                <p className="text-[9px] text-muted-foreground">DPI · optimal</p>
              </div>
              <div className="rounded-lg border border-primary/30 bg-primary/10 p-2.5">
                <Crop className="size-4 text-primary" />
                <p className="text-num mt-2 text-lg font-semibold">3 mm</p>
                <p className="text-[9px] text-muted-foreground">Fond perdu</p>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-foreground px-3 py-2.5 text-background">
              <span className="flex items-center gap-2 text-xs font-medium"><Check className="size-3.5 text-success" /> Fichier conforme</span>
              <FileDown className="size-4" />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute -bottom-5 -left-4 hidden items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 shadow-soft sm:flex">
        <span className="size-2 animate-pulse rounded-full bg-success" />
        <span className="text-xs text-muted-foreground">10 outils · traitement local</span>
      </div>
    </div>
  );
}