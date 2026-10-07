import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AlertTriangle, Download, FileText, Loader2, Upload, X } from "lucide-react";
import { ToolkitShell, Field, Panel, Stat } from "@/components/site";
import { getTool } from "@/data/toolsRegistry";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SITE } from "@/data/site";

const PAGE_TITLE = `Imposition livret piqûre à cheval : ordre des pages et PDF imposé | ${SITE.tool} | ${SITE.name}`;
const PAGE_DESC = `Calculez le montage d'un livret agrafé (P8/P1, P2/P7…) et imposez votre PDF en planches recto-verso avec chasse, gouttière et repères, sans serveur.`;

const tool = getTool("/booklet-imposition")!;

export const Route = createFileRoute("/_tool/booklet-imposition")({
  staticData: { sitemap: true },
  head: () =>
    toolMeta(
      "Imposition livret piqûre à cheval : ordre des pages et PDF imposé | SPC Toolkit",
      "Calculez le montage d'un livret agrafé (P8/P1, P2/P7…) et imposez votre PDF en planches recto-verso avec chasse, gouttière et repères, sans serveur.",
      "/booklet-imposition",
    ),
  component: Page,
});

const MM = 72 / 25.4;

type Sheet = { index: number; recto: [number, number]; verso: [number, number]; creep: number };
type Binding = "long" | "short";
type OutFmt = "auto" | "a4" | "a3" | "custom";

const PAPERS = [
  { label: "80 g", t: 0.1 },
  { label: "115 g", t: 0.11 },
  { label: "135 g", t: 0.12 },
  { label: "170 g", t: 0.16 },
  { label: "250 g", t: 0.25 },
];

function impose(n: number, thickness: number): Sheet[] {
  const N = Math.max(4, Math.ceil(n / 4) * 4);
  const sheets: Sheet[] = [];
  for (let i = 0; i < N / 4; i++) {
    sheets.push({
      index: i,
      recto: [N - 2 * i, 1 + 2 * i],
      verso: [2 + 2 * i, N - 1 - 2 * i],
      creep: i * thickness,
    });
  }
  return sheets;
}

function detectFormat(w: number, h: number) {
  const mw = Math.round(Math.min(w, h) / MM);
  const mh = Math.round(Math.max(w, h) / MM);
  const near = (a: number, b: number) => Math.abs(a - b) <= 3;
  if (near(mw, 148) && near(mh, 210)) return "A5";
  if (near(mw, 210) && near(mh, 297)) return "A4";
  if (near(mw, 105) && near(mh, 148)) return "A6";
  return `${mw} × ${mh} mm`;
}

function download(data: Uint8Array | Blob, name: string, type = "application/pdf") {
  const blob = data instanceof Blob ? data : new Blob([data as BlobPart], { type });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

function Page() {
  const [pagesInput, setPagesInput] = useState(8);
  const [duplex, setDuplex] = useState(true);
  const [binding, setBinding] = useState<Binding>("long");
  const [marks, setMarks] = useState(true);
  const [gutter, setGutter] = useState(0);
  const [paper, setPaper] = useState(PAPERS[0]!);
  const [creepOn, setCreepOn] = useState(true);
  const [outFmt, setOutFmt] = useState<OutFmt>("auto");
  const [custom, setCustom] = useState({ w: 420, h: 297 });
  const [file, setFile] = useState<{ name: string; bytes: ArrayBuffer; count: number; w: number; h: number } | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const count = file ? file.count : pagesInput;
  const sheets = useMemo(() => impose(count, creepOn ? paper.t : 0), [count, creepOn, paper]);
  const N = sheets.length * 4;
  const blanks = N - count;
  const totalCreep = creepOn ? (sheets.length - 1) * paper.t : 0;

  const pageW = file ? file.w / MM : 148;
  const pageH = file ? file.h / MM : 210;
  const fmtName = file ? detectFormat(file.w, file.h) : "A5";

  // Taille de planche (mm)
  const plate = useMemo(() => {
    const natural = binding === "long" ? { w: pageW * 2 + gutter, h: pageH } : { w: pageW, h: pageH * 2 + gutter };
    const land = (a: number, b: number) => (binding === "long" ? { w: Math.max(a, b), h: Math.min(a, b) } : { w: Math.min(a, b), h: Math.max(a, b) });
    if (outFmt === "a4") return land(297, 210);
    if (outFmt === "a3") return land(420, 297);
    if (outFmt === "custom") return custom;
    return natural;
  }, [binding, pageW, pageH, gutter, outFmt, custom]);

  const suggested = fmtName === "A5" ? "A4 paysage" : fmtName === "A4" ? "A3 paysage" : "Taille naturelle";

  const onFile = async (f: File | undefined) => {
    if (!f || f.type !== "application/pdf") return setMsg("Choisissez un fichier PDF.");
    setBusy(true);
    setMsg("");
    try {
      const { PDFDocument } = await import("pdf-lib");
      const bytes = await f.arrayBuffer();
      const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const p = doc.getPage(0);
      const { width, height } = p.getSize();
      setFile({ name: f.name, bytes, count: doc.getPageCount(), w: width, h: height });
      const fmt = detectFormat(width, height);
      setOutFmt(fmt === "A5" ? "a4" : fmt === "A4" ? "a3" : "auto");
    } catch {
      setMsg("Ce PDF n'a pas pu être lu (protégé ou endommagé).");
    } finally {
      setBusy(false);
    }
  };

  const consigne = () => {
    const lines = [
      "STAF PRINT CENTER — Consigne atelier : Imposition livret piqûre à cheval",
      "=".repeat(70),
      `Document : ${file?.name ?? "simulation"}`,
      `Pages d'origine : ${count} — Pages imposées : ${N} (${blanks} page(s) blanche(s) ajoutée(s) en fin)`,
      `Feuilles : ${sheets.length} — Format page : ${fmtName} — Planche : ${Math.round(plate.w)} × ${Math.round(plate.h)} mm`,
      `Reliure : ${binding === "long" ? "bord long (classique)" : "bord court (à l'italienne)"} — Gouttière : ${gutter} mm`,
      `Chasse : ${creepOn ? `${paper.label}, ${paper.t} mm/feuille, total ${totalCreep.toFixed(2)} mm` : "non appliquée"}`,
      `Impression : ${duplex ? "recto-verso continu (duplex)" : "deux passes (rectos puis versos)"}`,
      binding === "long" ? "Retournement : bord long" : "Retournement : bord court",
      "",
      "ORDRE DE MONTAGE",
      ...sheets.flatMap((s) => [
        `Feuille ${s.index + 1}  Recto : P${s.recto[0]} | P${s.recto[1]}   Verso : P${s.verso[0]} | P${s.verso[1]}   Chasse : ${s.creep.toFixed(2)} mm`,
      ]),
      "",
      "PLIAGE : empiler les feuilles dans l'ordre (feuille 1 à l'extérieur), plier au centre, agrafer sur le pli (2 agrafes), puis massicoter la gouttière de tête/pied/devant.",
      marks ? "Repères : trait de pli central + traits de coupe aux angles." : "Repères : désactivés.",
    ];
    return lines.join("\n");
  };

  const build = async () => {
    if (!file) return null;
    const { PDFDocument, rgb } = await import("pdf-lib");
    const src = await PDFDocument.load(file.bytes, { ignoreEncryption: true });
    const make = () => PDFDocument.create();
    const all = await make();
    const rectos = await make();
    const versos = await make();
    const PW = plate.w * MM;
    const PH = plate.h * MM;
    const slotW = binding === "long" ? (PW - gutter * MM) / 2 : PW;
    const slotH = binding === "long" ? PH : (PH - gutter * MM) / 2;

    const draw = async (doc: Awaited<ReturnType<typeof make>>, pair: [number, number], creep: number) => {
      const page = doc.addPage([PW, PH]);
      for (let k = 0; k < 2; k++) {
        const num = pair[k]!;
        if (num > file.count) continue;
        const [emb] = await doc.embedPdf(src, [num - 1]);
        if (!emb) continue;
        const s = Math.min(slotW / emb.width, slotH / emb.height);
        const w = emb.width * s;
        const h = emb.height * s;
        const shift = creep * MM; // décalage vers le pli
        let x: number, y: number;
        if (binding === "long") {
          const ox = k === 0 ? 0 : slotW + gutter * MM;
          x = k === 0 ? ox + slotW - w + shift : ox - shift;
          y = (PH - h) / 2;
        } else {
          // k=0 en haut, k=1 en bas, pli horizontal au centre
          const oy = k === 0 ? slotH + gutter * MM : 0;
          x = (PW - w) / 2;
          y = k === 0 ? oy - shift : oy + slotH - h + shift;
        }
        page.drawPage(emb, { x, y, width: w, height: h });
      }
      if (marks) {
        const c = rgb(0, 0, 0);
        const L = 5 * MM;
        if (binding === "long") {
          for (let yy = 0; yy < PH; yy += 8) page.drawLine({ start: { x: PW / 2, y: yy }, end: { x: PW / 2, y: Math.min(yy + 4, PH) }, thickness: 0.3, color: c });
        } else {
          for (let xx = 0; xx < PW; xx += 8) page.drawLine({ start: { x: xx, y: PH / 2 }, end: { x: Math.min(xx + 4, PW), y: PH / 2 }, thickness: 0.3, color: c });
        }
        for (const [cx, cy] of [[0, 0], [PW, 0], [0, PH], [PW, PH]] as const) {
          const dx = cx === 0 ? 1 : -1;
          const dy = cy === 0 ? 1 : -1;
          page.drawLine({ start: { x: cx, y: cy }, end: { x: cx + dx * L, y: cy }, thickness: 0.4, color: c });
          page.drawLine({ start: { x: cx, y: cy }, end: { x: cx, y: cy + dy * L }, thickness: 0.4, color: c });
        }
      }
    };

    for (const s of sheets) {
      await draw(all, s.recto, s.creep);
      await draw(all, s.verso, s.creep);
      await draw(rectos, s.recto, s.creep);
      await draw(versos, s.verso, s.creep);
    }
    return { all: await all.save(), rectos: await rectos.save(), versos: await versos.save() };
  };

  const run = async (kind: "duplex" | "split" | "zip") => {
    setBusy(true);
    setMsg("");
    try {
      const base = (file?.name ?? "livret").replace(/\.pdf$/i, "");
      const out = await build();
      if (!out) return;
      if (kind === "duplex") download(out.all, `${base}-impose-recto-verso.pdf`);
      else if (kind === "split") {
        download(out.rectos, `${base}-passe1-rectos.pdf`);
        setTimeout(() => download(out.versos, `${base}-passe2-versos.pdf`), 400);
      } else {
        const { zipSync, strToU8 } = await import("fflate");
        const zip = zipSync({
          [`${base}-impose-recto-verso.pdf`]: out.all,
          [`${base}-passe1-rectos.pdf`]: out.rectos,
          [`${base}-passe2-versos.pdf`]: out.versos,
          "consigne-atelier.txt": strToU8(consigne()),
        });
        download(new Blob([zip as BlobPart], { type: "application/zip" }), `${base}-imposition.zip`);
      }
      setMsg(`${sheets.length} feuille(s) imposée(s), ${N * 1} pages.`);
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "L'imposition a échoué.");
    } finally {
      setBusy(false);
    }
  };

  const rows = duplex
    ? sheets.flatMap((s) => [
      { label: `Feuille ${s.index + 1} · Recto`, pair: s.recto, creep: s.creep },
      { label: `Feuille ${s.index + 1} · Verso`, pair: s.verso, creep: s.creep },
    ])
    : [
      ...sheets.map((s) => ({ label: `Passe 1 · Feuille ${s.index + 1} Recto`, pair: s.recto, creep: s.creep })),
      ...sheets.map((s) => ({ label: `Passe 2 · Feuille ${s.index + 1} Verso`, pair: s.verso, creep: s.creep })),
    ];

  const chip = (on: boolean) =>
    `rounded-lg border px-3 py-1.5 text-sm ${on ? "border-primary bg-accent/60 font-medium" : "border-border hover:border-primary/50"}`;

  return (
    <ToolShell tool={tool}>
      <div className="grid gap-6 lg:grid-cols-[400px_1fr]">
        <div className="space-y-6">
          <Panel title="Document">
            {file ? (
              <div className="flex items-center gap-3 rounded-xl border border-border p-3 text-sm">
                <FileText className="size-4 text-pdf" />
                <div className="flex-1 truncate">
                  <div className="truncate font-medium">{file.name}</div>
                  <div className="text-xs text-muted-foreground">{file.count} pages · {fmtName}</div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setFile(null)} aria-label="Retirer le PDF">
                  <X className="size-4" />
                </Button>
              </div>
            ) : (
              <>
                <Field label="Nombre de pages" hint="Mode simulateur, sans fichier">
                  <Input type="number" min={1} max={400} className="text-num" value={pagesInput} onChange={(e) => setPagesInput(Math.max(1, Math.min(400, +e.target.value || 1)))} />
                </Field>
                <label
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => { e.preventDefault(); onFile(e.dataTransfer.files[0]); }}
                  className="mt-4 flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed border-border bg-secondary/30 p-6 text-center hover:border-primary"
                >
                  {busy ? <Loader2 className="size-5 animate-spin" /> : <Upload className="size-5 text-muted-foreground" />}
                  <span className="mt-2 text-sm font-medium">…ou glissez votre PDF ici</span>
                  <span className="mt-1 text-xs text-muted-foreground">Lu dans votre navigateur, rien n'est envoyé.</span>
                  <input type="file" accept="application/pdf" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
                </label>
              </>
            )}
            {blanks > 0 && (
              <p className="mt-4 flex gap-2 rounded-lg bg-warning/10 p-3 text-xs text-warning">
                <AlertTriangle className="size-4 shrink-0" />
                {count} pages n'est pas un multiple de 4 : {blanks} page(s) blanche(s) ajoutée(s) en fin de livret ({N} pages).
              </p>
            )}
          </Panel>

          <Panel title="Options d'atelier">
            <div className="space-y-5">
              <Field label="Impression">
                <div className="flex flex-wrap gap-2">
                  <button className={chip(duplex)} onClick={() => setDuplex(true)}>Recto-verso continu</button>
                  <button className={chip(!duplex)} onClick={() => setDuplex(false)}>Deux passes</button>
                </div>
              </Field>
              <Field label="Sens de reliure">
                <div className="flex flex-wrap gap-2">
                  <button className={chip(binding === "long")} onClick={() => setBinding("long")}>Bord long</button>
                  <button className={chip(binding === "short")} onClick={() => setBinding("short")}>Bord court (italienne)</button>
                </div>
              </Field>
              <Field label="Format de planche" hint={`Suggestion pour ${fmtName} : ${suggested}`}>
                <div className="flex flex-wrap gap-2">
                  {([["auto", "Taille naturelle"], ["a4", "A4"], ["a3", "A3"], ["custom", "Personnalisé"]] as const).map(([k, l]) => (
                    <button key={k} className={chip(outFmt === k)} onClick={() => setOutFmt(k)}>{l}</button>
                  ))}
                </div>
                {outFmt === "custom" && (
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <Input type="number" className="text-num" value={custom.w} onChange={(e) => setCustom({ ...custom, w: +e.target.value || 1 })} aria-label="Largeur mm" />
                    <Input type="number" className="text-num" value={custom.h} onChange={(e) => setCustom({ ...custom, h: +e.target.value || 1 })} aria-label="Hauteur mm" />
                  </div>
                )}
              </Field>
              <Field label="Gouttière centrale (mm)">
                <Input type="number" min={0} max={30} step={0.5} className="text-num" value={gutter} onChange={(e) => setGutter(Math.max(0, +e.target.value || 0))} />
              </Field>
              <Field label="Chasse (creep) selon le grammage">
                <label className="mb-2 flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={creepOn} onChange={(e) => setCreepOn(e.target.checked)} /> Compenser la chasse
                </label>
                <div className="flex flex-wrap gap-2">
                  {PAPERS.map((p) => (
                    <button key={p.label} disabled={!creepOn} className={chip(paper === p) + " disabled:opacity-40"} onClick={() => setPaper(p)}>{p.label}</button>
                  ))}
                </div>
              </Field>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={marks} onChange={(e) => setMarks(e.target.checked)} /> Repères de pli/agrafage et traits de coupe
              </label>
            </div>
          </Panel>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="Pages imposées" value={String(N)} />
            <Stat label="Feuilles" value={String(sheets.length)} />
            <Stat label="Planche" value={`${Math.round(plate.w)}×${Math.round(plate.h)}`} unit="mm" />
            <Stat label="Chasse max" value={totalCreep.toFixed(2)} unit="mm" tone={totalCreep > 1 ? "warning" : "default"} />
          </div>

          <Panel title="Table de montage">
            <div className="grid gap-3 sm:grid-cols-2">
              {rows.map((r) => (
                <div key={r.label} className="rounded-xl border border-border p-3">
                  <div className="mb-2 flex justify-between text-xs text-muted-foreground">
                    <span>{r.label}</span>
                    {r.creep > 0 && <span className="text-num">chasse {r.creep.toFixed(2)} mm</span>}
                  </div>
                  <div className={`flex gap-1 ${binding === "short" ? "flex-col" : ""}`}>
                    {r.pair.map((p, k) => {
                      const blank = p > count;
                      return (
                        <div
                          key={k}
                          className={`text-num flex flex-1 items-center justify-center rounded-md border py-5 text-lg font-semibold ${blank ? "border-dashed border-border text-muted-foreground" : "border-primary/40 bg-accent/40"}`}
                        >
                          P{p}{blank && <span className="ml-1 text-xs font-normal">(blanche)</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Export">
            {!file && <p className="mb-3 text-sm text-muted-foreground">Importez votre PDF pour générer les planches imposées. Vous pouvez déjà télécharger la consigne d'atelier.</p>}
            <div className="flex flex-wrap gap-2">
              <Button disabled={!file || busy} onClick={() => run("duplex")}>
                {busy ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />} PDF recto-verso
              </Button>
              <Button variant="outline" disabled={!file || busy} onClick={() => run("split")}>Rectos + Versos (2 PDF)</Button>
              <Button variant="outline" disabled={!file || busy} onClick={() => run("zip")}>Archive ZIP complète</Button>
              <Button variant="ghost" onClick={() => download(new Blob([consigne()], { type: "text/plain" }), "consigne-atelier.txt")}>Consigne atelier (.txt)</Button>
            </div>
            {msg && <p className="mt-3 text-sm text-muted-foreground">{msg}</p>}
          </Panel>
        </div>
      </div>
    </ToolShell>
  );
}
