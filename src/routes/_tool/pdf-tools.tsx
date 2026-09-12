import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FileText, Loader2, Trash2, Upload } from "lucide-react";
import { ToolkitShell, Field, Panel } from "@/components/site";
import { getTool } from "@/data/toolsRegistry";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SITE } from "@/data/site";

const PAGE_TITLE = `Boîte à outils PDF : fusion, extraction, niveaux de gris | SPC Toolkit | ${SITE.name}`;
const PAGE_DESC = `Fusionnez des PDF, extrayez des pages et convertissez en niveaux de gris sans rien envoyer sur un serveur : tout se passe dans votre navigateur.`;

const tool = getTool("/pdf-tools")!;

export const Route = createFileRoute("/_tool/pdf-tools")({
  head: () => ({
    meta: [
      { title: PAGE_TITLE },
      { name: "description", content: PAGE_DESC },
      { property: "og:title", content: PAGE_TITLE },
      { property: "og:description", content: PAGE_DESC },
    ],
  }),
  component: Page,
});

type Mode = "merge" | "extract" | "gray";

function download(bytes: Uint8Array, name: string) {
  const blob = new Blob([bytes as unknown as BlobPart], { type: "application/pdf" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  URL.revokeObjectURL(a.href);
}

function parseRange(input: string, max: number) {
  const pages = new Set<number>();
  input.split(",").forEach((part) => {
    const [a, b] = part.split("-").map((v) => parseInt(v.trim(), 10));
    if (!a || Number.isNaN(a)) return;
    const end = b && !Number.isNaN(b) ? b : a;
    for (let i = a; i <= Math.min(end, max); i++) if (i > 0) pages.add(i - 1);
  });
  return [...pages].sort((x, y) => x - y);
}

function Page() {
  const [mode, setMode] = useState<Mode>("merge");
  const [files, setFiles] = useState<File[]>([]);
  const [range, setRange] = useState("1-3");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    setFiles((f) => [...f, ...Array.from(list).filter((x) => x.type === "application/pdf")]);
    setMessage("");
  };

  const run = async () => {
    if (files.length === 0) return;
    setBusy(true);
    setMessage("");
    try {
      const { PDFDocument, rgb } = await import("pdf-lib");
      if (mode === "merge") {
        const out = await PDFDocument.create();
        for (const f of files) {
          const src = await PDFDocument.load(await f.arrayBuffer());
          const copied = await out.copyPages(src, src.getPageIndices());
          copied.forEach((p) => out.addPage(p));
        }
        download(await out.save(), "spc-fusion.pdf");
        setMessage(`${files.length} fichiers fusionnés (${out.getPageCount()} pages).`);
      } else if (mode === "extract") {
        const src = await PDFDocument.load(await files[0]!.arrayBuffer());
        const idx = parseRange(range, src.getPageCount());
        if (idx.length === 0) throw new Error("Aucune page valide dans la plage indiquée.");
        const out = await PDFDocument.create();
        const copied = await out.copyPages(src, idx);
        copied.forEach((p) => out.addPage(p));
        download(await out.save(), "spc-extrait.pdf");
        setMessage(`${idx.length} page(s) extraite(s) sur ${src.getPageCount()}.`);
      } else {
        const src = await PDFDocument.load(await files[0]!.arrayBuffer());
        src.getPages().forEach((p) => {
          const { width, height } = p.getSize();
          // Voile désaturant : simulation d'un rendu noir & blanc à l'écran.
          p.drawRectangle({
            x: 0,
            y: 0,
            width,
            height,
            color: rgb(0.5, 0.5, 0.5),
            opacity: 0.55,
            blendMode: "Saturation" as never,
          });
        });
        download(await src.save(), "spc-niveaux-de-gris.pdf");
        setMessage("Conversion en niveaux de gris appliquée sur toutes les pages.");
      }
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Ce fichier PDF n'a pas pu être traité.");
    } finally {
      setBusy(false);
    }
  };

  const labels: Record<Mode, { title: string; desc: string; cta: string }> = {
    merge: { title: "Fusionner des PDF", desc: "Les fichiers sont assemblés dans l'ordre affiché.", cta: "Fusionner et télécharger" },
    extract: { title: "Extraire des pages", desc: "Indiquez les pages à conserver, ex : 1-3, 7, 10-12.", cta: "Extraire et télécharger" },
    gray: { title: "Passer en niveaux de gris", desc: "Utile pour un tirage noir & blanc économique.", cta: "Convertir et télécharger" },
  };

  return (
    <ToolkitShell tool={tool}>
      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <Panel title="Opération">
          <div className="space-y-2">
            {(Object.keys(labels) as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`w-full rounded-xl border p-3 text-left text-sm ${mode === m ? "border-primary bg-accent/60" : "border-border hover:border-primary/50"
                  }`}
              >
                <span className="font-medium">{labels[m].title}</span>
                <span className="mt-0.5 block text-xs text-muted-foreground">{labels[m].desc}</span>
              </button>
            ))}
          </div>
          {mode === "extract" && (
            <div className="mt-5">
              <Field label="Pages à extraire">
                <Input className="text-num" value={range} onChange={(e) => setRange(e.target.value)} placeholder="1-3, 7" />
              </Field>
            </div>
          )}
        </Panel>

        <div className="space-y-6">
          <Panel title="Vos fichiers PDF">
            <label
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                addFiles(e.dataTransfer.files);
              }}
              className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-secondary/30 p-10 text-center transition-colors hover:border-primary"
            >
              <Upload className="size-6 text-muted-foreground" />
              <span className="mt-2 text-sm font-medium">Glissez vos PDF ici ou cliquez pour choisir</span>
              <span className="mt-1 text-xs text-muted-foreground">
                Aucun envoi vers un serveur : tout reste sur votre appareil.
              </span>
              <input type="file" accept="application/pdf" multiple className="hidden" onChange={(e) => addFiles(e.target.files)} />
            </label>

            {files.length > 0 && (
              <ul className="mt-4 space-y-2">
                {files.map((f, i) => (
                  <li key={i} className="flex items-center gap-3 rounded-xl border border-border p-3 text-sm">
                    <FileText className="size-4 text-pdf" />
                    <span className="flex-1 truncate">{f.name}</span>
                    <span className="text-num text-xs text-muted-foreground">{(f.size / 1024).toFixed(0)} Ko</span>
                    <Button variant="ghost" size="icon" onClick={() => setFiles((s) => s.filter((_, j) => j !== i))}>
                      <Trash2 className="size-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-5 flex items-center gap-3">
              <Button onClick={run} disabled={busy || files.length === 0}>
                {busy && <Loader2 className="size-4 animate-spin" />}
                {labels[mode].cta}
              </Button>
              {files.length > 0 && (
                <Button variant="ghost" onClick={() => setFiles([])}>
                  Tout retirer
                </Button>
              )}
            </div>
            {message && <p className="mt-4 text-sm text-muted-foreground">{message}</p>}
          </Panel>
        </div>
      </div>
    </ToolkitShell>
  );
}
