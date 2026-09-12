export type ToolCategory = "prepression" | "print" | "format" | "pdf";

export interface ToolItem {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  category: ToolCategory;
  icon: string;
  badge?: string;
  ctaText: string;
}

export const CATEGORIES: Record<
  ToolCategory,
  { label: string; emoji: string; color: string; soft: string }
> = {
  prepression: {
    label: "Prépresse & Couleurs",
    emoji: "🎨",
    color: "text-prepress",
    soft: "bg-prepress-soft text-prepress",
  },
  print: {
    label: "Impression & Façonnage",
    emoji: "📐",
    color: "text-print",
    soft: "bg-print-soft text-print",
  },
  format: {
    label: "Grand Format & Textile",
    emoji: "📦",
    color: "text-format",
    soft: "bg-format-soft text-format",
  },
  pdf: {
    label: "Utilitaires PDF",
    emoji: "📄",
    color: "text-pdf",
    soft: "bg-pdf-soft text-pdf",
  },
};

export const TOOLS: ToolItem[] = [
  {
    id: "t1",
    slug: "/rgb-to-cmyk",
    title: "Convertisseur RVB ➔ CMJN",
    shortDescription: "Convertissez vos couleurs écran en encres CMJN et simulez le rendu papier mat ou brillant.",
    category: "prepression",
    icon: "Palette",
    badge: "Simulateur",
    ctaText: "Fichier prêt ? Lancez votre brief",
  },
  {
    id: "t2",
    slug: "/dpi-calculator",
    title: "Diagnostic Résolution DPI",
    shortDescription: "Vérifiez si votre image tient la route à la taille d'impression voulue, du flyer au roll-up.",
    category: "prepression",
    icon: "ScanEye",
    ctaText: "Doute sur votre fichier ? Consultez la doc technique",
  },
  {
    id: "t3",
    slug: "/bleed-generator",
    title: "Gabarits & Fonds Perdus",
    shortDescription: "Générez un gabarit avec coupe, fond perdu 3 mm et marge de sécurité. Export PNG / PDF.",
    category: "prepression",
    icon: "Crop",
    badge: "Export PDF",
    ctaText: "Gabarit téléchargé ? Envoyez votre brief",
  },
  {
    id: "t4",
    slug: "/tac-checker",
    title: "Taux d'Encrage Max (TAC)",
    shortDescription: "Contrôlez la somme C+M+J+N de vos aplats pour éviter maculage et surcharge d'encre.",
    category: "prepression",
    icon: "Droplets",
    ctaText: "Besoin d'un profil ICC adapté ? Parlons-en",
  },
  {
    id: "t5",
    slug: "/spine-calculator",
    title: "Épaisseur de Tranche & Poids",
    shortDescription: "Calculez le dos d'un livre ou catalogue selon le grammage, les pages et le type de reliure.",
    category: "print",
    icon: "BookOpen",
    ctaText: "Prêt à imprimer votre ouvrage ? Demandez un devis",
  },
  {
    id: "t6",
    slug: "/fold-simulator",
    title: "Simulateur de Pliage & Volets",
    shortDescription: "Visualisez dépliants 2 volets, accordéon ou roulé, avec la largeur exacte de chaque volet.",
    category: "print",
    icon: "Layers",
    badge: "Interactif",
    ctaText: "Votre dépliant est calé ? Lancez la production",
  },
  {
    id: "t7",
    slug: "/barcode-generator",
    title: "QR Code & Code-barres",
    shortDescription: "Créez des QR codes et codes-barres EAN-13 / Code 128 vectoriels, prêts pour l'impression.",
    category: "print",
    icon: "QrCode",
    badge: "SVG / PDF",
    ctaText: "Intégrez ce code à votre packaging avec nous",
  },
  {
    id: "t8",
    slug: "/nesting-calc",
    title: "Calepinage Bâche & Vinyle",
    shortDescription: "Optimisez la pose de vos visuels sur laize 1,60 m ou 3,20 m et réduisez le gâchis matière.",
    category: "format",
    icon: "Grid2x2",
    ctaText: "Réservez votre impression grand format",
  },
  {
    id: "t9",
    slug: "/textile-guide",
    title: "Guide Textile & Flocage",
    shortDescription: "Tailles S à XXL et zones d'impression : cœur, A4 poitrine, A3 dos, manche.",
    category: "format",
    icon: "Shirt",
    ctaText: "Commandez vos textiles personnalisés",
  },
  {
    id: "t10",
    slug: "/pdf-tools",
    title: "Boîte à Outils PDF Express",
    shortDescription: "Fusionnez, extrayez des pages et passez en niveaux de gris, 100 % dans votre navigateur.",
    category: "pdf",
    icon: "FileText",
    badge: "Zero-Server",
    ctaText: "PDF conforme ? Déposez-le sur votre brief",
  },
];

export const getTool = (slug: string) => TOOLS.find((t) => t.slug === slug);
