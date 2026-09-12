import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Download } from "lucide-react";
import { Field, Panel, ToolShell } from "@/components/spc/Layout";
import { getTool } from "@/data/toolsRegistry";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const tool = getTool("/barcode-generator")!;

export const Route = createFileRoute("/_tool/barcode-generator")({
  head: () => ({
    meta: [
      { title: "Générateur de QR codes et codes-barres vectoriels | SPC Toolkit" },
      {
        name: "description",
        content:
          "Créez des QR codes avec logo central et des codes-barres EAN-13 ou Code 128, exportables en SVG et PDF pour l'impression.",
      },
      { property: "og:title", content: "QR Code & Code-barres — SPC Creative Toolkit" },
      {
        property: "og:description",
        content: "Codes vectoriels nets à toutes les tailles, générés dans votre navigateur.",
      },
    ],
  }),
  component: Page,
});

function downloadBlob(content: BlobPart, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

async function svgToPdf(svgEl: SVGSVGElement, filename: string) {
  const { PDFDocument, rgb } = await import("pdf-lib");
  const doc = await PDFDocument.create();
  // Rasterisation haute résolution puis intégration dans le PDF.
  const xml = new XMLSerializer().serializeToString(svgEl);
  const url = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(xml)));
  const img = new Image();
  await new Promise((res, rej) => {
    img.onload = res;
    img.onerror = rej;
    img.src = url;
  });
  const scale = 6;
  const canvas = document.createElement("canvas");
  canvas.width = (img.width || 300) * scale;
  canvas.height = (img.height || 300) * scale;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  const png = await fetch(canvas.toDataURL("image/png")).then((r) => r.arrayBuffer());
  const embedded = await doc.embedPng(png);
  const page = doc.addPage([embedded.width / scale + 40, embedded.height / scale + 40]);
  page.drawRectangle({ x: 0, y: 0, width: page.getWidth(), height: page.getHeight(), color: rgb(1, 1, 1) });
  page.drawImage(embedded, { x: 20, y: 20, width: embedded.width / scale, height: embedded.height / scale });
  const bytes = await doc.save();
  downloadBlob(bytes as unknown as BlobPart, filename, "application/pdf");
}

function QrPanel() {
  const [text, setText] = useState("https://stafprint.com");
  const [size, setSize] = useState(280);
  const [dark, setDark] = useState("#0f172a");
  const [logo, setLogo] = useState(true);
  const [svg, setSvg] = useState("");
  const holder = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    import("qrcode").then(async (QR) => {
      const out = await QR.toString(text || " ", {
        type: "svg",
        errorCorrectionLevel: "H",
        margin: 1,
        width: size,
        color: { dark, light: "#ffffff" },
      });
      if (!cancelled) setSvg(out);
    });
    return () => {
      cancelled = true;
    };
  }, [text, size, dark]);

  const exportSvg = () => {
    const el = holder.current?.querySelector("svg");
    if (el) downloadBlob(new XMLSerializer().serializeToString(el), "qrcode-stafprint.svg", "image/svg+xml");
  };
  const exportPdf = () => {
    const el = holder.current?.querySelector("svg");
    if (el) svgToPdf(el as SVGSVGElement, "qrcode-stafprint.pdf");
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
      <Panel title="Paramètres du QR code">
        <div className="space-y-4">
          <Field label="Contenu (URL, texte, téléphone)">
            <Input value={text} onChange={(e) => setText(e.target.value)} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Taille (px)">
              <Input type="number" className="text-num" value={size} onChange={(e) => setSize(+e.target.value || 280)} />
            </Field>
            <Field label="Couleur des modules">
              <Input type="color" value={dark} onChange={(e) => setDark(e.target.value)} className="h-10 p-1" />
            </Field>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={logo} onChange={(e) => setLogo(e.target.checked)} className="accent-primary" />
            Pastille STAF PRINT au centre
          </label>
          <div className="flex gap-2">
            <Button className="flex-1" onClick={exportSvg}>
              <Download className="size-4" /> SVG
            </Button>
            <Button variant="outline" className="flex-1" onClick={exportPdf}>
              <Download className="size-4" /> PDF
            </Button>
          </div>
        </div>
      </Panel>
      <Panel title="Aperçu">
        <div className="flex justify-center rounded-xl bg-secondary/40 p-8">
          <div className="relative bg-white p-3">
            <div ref={holder} dangerouslySetInnerHTML={{ __html: svg }} className="[&>svg]:block" />
            {logo && (
              <span className="text-num absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-primary px-2 py-1 text-[10px] font-bold text-primary-foreground">
                SPC
              </span>
            )}
          </div>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Correction d'erreur niveau H : le code reste lisible même avec le logo central. Taille minimale conseillée à
          l'impression : 2 cm.
        </p>
      </Panel>
    </div>
  );
}

function BarcodePanel() {
  const [format, setFormat] = useState<"EAN13" | "CODE128">("EAN13");
  const [value, setValue] = useState("5901234123457");
  const [error, setError] = useState("");
  const holder = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    import("jsbarcode").then((mod) => {
      if (!active || !holder.current) return;
      const svgEl = holder.current.querySelector("svg");
      if (!svgEl) return;
      try {
        (mod.default as unknown as (el: Element, v: string, o: object) => void)(svgEl, value, {
          format,
          width: 2,
          height: 90,
          displayValue: true,
          fontOptions: "bold",
          font: "monospace",
          margin: 10,
        });
        setError("");
      } catch {
        setError(
          format === "EAN13"
            ? "Code EAN-13 invalide : 13 chiffres avec une clé de contrôle correcte."
            : "Valeur non encodable en Code 128.",
        );
      }
    });
    return () => {
      active = false;
    };
  }, [value, format]);

  const exportSvg = () => {
    const el = holder.current?.querySelector("svg");
    if (el) downloadBlob(new XMLSerializer().serializeToString(el), `${format}-${value}.svg`, "image/svg+xml");
  };
  const exportPdf = () => {
    const el = holder.current?.querySelector("svg");
    if (el) svgToPdf(el as SVGSVGElement, `${format}-${value}.pdf`);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
      <Panel title="Paramètres du code-barres">
        <div className="space-y-4">
          <div className="flex gap-2">
            {(["EAN13", "CODE128"] as const).map((f) => (
              <button
                key={f}
                onClick={() => {
                  setFormat(f);
                  setValue(f === "EAN13" ? "5901234123457" : "STAFPRINT-2026");
                }}
                className={`rounded-full border px-4 py-1.5 text-sm ${
                  format === f ? "border-primary bg-primary text-primary-foreground" : "border-border"
                }`}
              >
                {f === "EAN13" ? "EAN-13" : "Code 128"}
              </button>
            ))}
          </div>
          <Field label="Valeur à encoder" hint={format === "EAN13" ? "13 chiffres, clé de contrôle incluse." : "Lettres, chiffres et symboles acceptés."}>
            <Input className="text-num" value={value} onChange={(e) => setValue(e.target.value)} />
          </Field>
          {error && <p className="text-sm text-danger">{error}</p>}
          <div className="flex gap-2">
            <Button className="flex-1" onClick={exportSvg}>
              <Download className="size-4" /> SVG
            </Button>
            <Button variant="outline" className="flex-1" onClick={exportPdf}>
              <Download className="size-4" /> PDF
            </Button>
          </div>
        </div>
      </Panel>
      <Panel title="Aperçu">
        <div ref={holder} className="flex justify-center rounded-xl bg-white p-8">
          <svg />
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Prévoyez une zone blanche de 3 mm autour du code et évitez de l'imprimer sur un fond sombre : les lecteurs
          optiques ont besoin de contraste.
        </p>
      </Panel>
    </div>
  );
}

function Page() {
  const [tab, setTab] = useState<"qr" | "barcode">("qr");
  return (
    <ToolShell tool={tool}>
      <div className="mb-6 inline-flex rounded-full border border-border p-1">
        {(
          [
            ["qr", "QR Code"],
            ["barcode", "Code-barres"],
          ] as const
        ).map(([k, label]) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={`rounded-full px-5 py-1.5 text-sm ${tab === k ? "bg-primary text-primary-foreground" : ""}`}
          >
            {label}
          </button>
        ))}
      </div>
      {tab === "qr" ? <QrPanel /> : <BarcodePanel />}
    </ToolShell>
  );
}
