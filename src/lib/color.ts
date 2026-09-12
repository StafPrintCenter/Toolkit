export interface Cmyk {
  c: number;
  m: number;
  y: number;
  k: number;
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.trim().replace("#", "");
  const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return null;
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
}

export function rgbToHex(r: number, g: number, b: number) {
  return (
    "#" +
    [r, g, b]
      .map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0"))
      .join("")
  );
}

export function rgbToCmyk(r: number, g: number, b: number): Cmyk {
  const rr = r / 255;
  const gg = g / 255;
  const bb = b / 255;
  const k = 1 - Math.max(rr, gg, bb);
  if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
  const c = (1 - rr - k) / (1 - k);
  const m = (1 - gg - k) / (1 - k);
  const y = (1 - bb - k) / (1 - k);
  return {
    c: Math.round(c * 100),
    m: Math.round(m * 100),
    y: Math.round(y * 100),
    k: Math.round(k * 100),
  };
}

export function cmykToRgb({ c, m, y, k }: Cmyk) {
  const cc = c / 100;
  const mm = m / 100;
  const yy = y / 100;
  const kk = k / 100;
  return {
    r: Math.round(255 * (1 - cc) * (1 - kk)),
    g: Math.round(255 * (1 - mm) * (1 - kk)),
    b: Math.round(255 * (1 - yy) * (1 - kk)),
  };
}

/** Simulation grossière du rendu imprimé selon le support. */
export function simulatePaper(
  rgb: { r: number; g: number; b: number },
  paper: "mat" | "brillant",
) {
  const desat = paper === "mat" ? 0.22 : 0.1;
  const lift = paper === "mat" ? 10 : 3;
  const gray = 0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b;
  const mix = (v: number) => Math.round(v * (1 - desat) + gray * desat);
  return {
    r: Math.min(255, mix(rgb.r) + lift * 0.4),
    g: Math.min(255, mix(rgb.g) + lift * 0.4),
    b: Math.min(255, mix(rgb.b) + lift * 0.2),
  };
}

/** Une couleur est hors gamme CMJN si l'aller-retour RVB→CMJN→RVB dérive trop. */
export function gamutDelta(rgb: { r: number; g: number; b: number }) {
  const back = cmykToRgb(rgbToCmyk(rgb.r, rgb.g, rgb.b));
  const sat = Math.max(rgb.r, rgb.g, rgb.b) - Math.min(rgb.r, rgb.g, rgb.b);
  const drift = Math.sqrt(
    (rgb.r - back.r) ** 2 + (rgb.g - back.g) ** 2 + (rgb.b - back.b) ** 2,
  );
  // Les couleurs très saturées et lumineuses (néon) sortent du gamut d'encre.
  const neon = sat > 170 && Math.max(rgb.r, rgb.g, rgb.b) > 210 ? sat / 3 : 0;
  return drift + neon;
}
