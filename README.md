# STAF Creative Hub

# PROMPT : DEVELOPPEMENT DU HUB "SPC CREATIVE TOOLKIT" (`tools.stafprint.com`)

Tu es un développeur Full-Stack Senior, UI/UX Designer Expert React / TypeScript / Tailwind CSS / Framer Motion / TanStack Router.

Tu dois concevoir et développer une application web moderne, ultra-rapide et exhaustive appelée **SPC Creative Toolkit** (`tools.stafprint.com`). C'est le hub d'utilitaires prépresse et d'impression officiel de l'écosystème **STAF PRINT CENTER** (Porto-Novo, Bénin). 

Il s'adresse aux graphistes, agences, étudiants et clients. Tous les outils s'exécutent à **100 % côté client (Zero-Server Storage)** via l'API Canvas HTML5, WebAssembly et du JavaScript pur dans le navigateur.

---

## 🎨 1. DESIGN SYSTEM & CHARTE GRAPHIQUE

- **Palette STAF PRINT :**
  - **Background :** Off-white chaud (`#fdfbf7`) ou Slate très sombre (`#0f172a` / `#020617`) pour le mode sombre.
  - **Accentuation :** Orange Ambre signature (`#f97316` / `#ea580c`) pour les boutons d'action, curseurs et sélections actives.
  - **Badges de Catégorie :**
    - 🎨 *Prépresse & Couleurs* : Indigo / Violet
    - 📐 *Impression & Façonnage* : Orange Ambre
    - 📦 *Grand Format & Textile* : Cyan / Bleu
    - 📄 *Utilitaires PDF* : Émeraude / Vert
- **Typographies :** **Space Grotesk** ou **Fraunces** (Titres), **Inter Tight** (Navigation et formulaires), **JetBrains Mono** (Valeurs numériques, codes hex, dimensions).

---

## 🗺️ 2. ARCHITECTURE MULTI-ROUTES (`TanStack Router`)



tools.stafprint.com

├── / --> Dashboard Hub (Recherche, Filtres par catégorie, Grille des 10 outils)

├── /rgb-to-cmyk --> 1. Convertisseur & Simulateur RVB ➔ CMJN

├── /dpi-calculator --> 2. Calculateur de Résolution & Diagnostic DPI

├── /bleed-generator --> 3. Générateur de Gabarits & Fonds Perdus (3mm)

├── /tac-checker --> 4. Simulateur de Taux d'Encrage Max (TAC %)

├── /spine-calculator --> 5. Calculateur d'Épaisseur de Tranche & Poids

├── /fold-simulator --> 6. Simulateur 3D de Plieuse & Volets

├── /barcode-generator --> 7. Générateur QR Code & Code-Barres Vectoriel (SVG/PDF)

├── /nesting-calc --> 8. Calculateur de Calepinage Bâche & Vinyle

├── /textile-guide --> 9. Guide Tailles Textiles & Emplacements Flocage

└── /pdf-tools --> 10. Boîte à Outils PDF Express Client-Side





---

## 🧰 3. SPECIFICATIONS DES 10 MODULES

### 🎨 SECTION 1 : PREPRESSE & CONTRÔLE COULEURS
1. **`/rgb-to-cmyk` — Convertisseur RVB ➔ CMJN :**
   - Saisie Hex/RVB ou upload d'image. Convertit en valeurs CMJN.
   - Curseur comparatif Avant/Après simulant le rendu imprimé (Papier Mat vs Brillant) avec alerte si la couleur est "Hors Gamme".
2. **`/dpi-calculator` — Diagnostic Résolution DPI :**
   - Calcul des DPI selon les pixels et les dimensions en cm.
   - Indicateur visuel couleur : 🔴 Insuffisant (<100 DPI), 🟡 Acceptable Grand Format (100-150 DPI), 🟢 Qualité Maximale (300 DPI).
3. **`/bleed-generator` — Gabarits & Fonds Perdus :**
   - Choix de formats standards (A4, A5, Carte de visite 85x54mm, Roll-up 85x200cm) ou dimensions personnalisées.
   - Visualisation des 3 zones : Coupe, Fond Perdu (+3mm), Marge de Sécurité (-3mm). Export en PDF/PNG.
4. **`/tac-checker` — Taux d'Encrage Maximum (TAC) :**
   - Analyse la somme C + M + J + N pour éviter les surcharges d'encre (>300 %).

### 📐 SECTION 2 : IMPRESSION & FAÇONNAGE
5. **`/spine-calculator` — Épaisseur de Tranche & Poids :**
   - Choix du grammage (80g, 135g, 300g, etc.) et nombre de pages. Calcule l'épaisseur de la tranche du livre et le poids total du lot.
6. **`/fold-simulator` — Plieuse & Volets :**
   - Visualiseur interactif pour dépliants (2 volets, 3 volets accordéon, 3 volets roulés) indiquant le positionnement des pages.
7. **`/barcode-generator` — QR Code & Code-barres Vectoriel :**
   - Génération de QR Codes (avec logo STAF PRINT central optionnel) et codes-barres (EAN-13, Code 128) au format SVG/PDF.

### 📦 SECTION 3 : GRAND FORMAT & TEXTILE
8. **`/nesting-calc` — Calepinage Bâche & Vinyle :**
   - Optimisation de la disposition de plusieurs visuels sur la laize du rouleau (1,60m ou 3,20m) pour réduire le gâchis de matière.
9. **`/textile-guide` — Guide Textile & Sérigraphie :**
   - Guide des tailles (S au XXL) et prévisualisation des zones d'impression (Cœur, A4 Poitrine, A3 Dos).

### 📄 SECTION 4 : UTILITAIRES PDF
10. **`/pdf-tools` — Boîte à Outils PDF Client-Side :**
    - Fusion de PDF, extraction de pages et conversion couleur ➔ Niveau de Gris (100 % navigateur via `pdf-lib`).

---

## 🔗 4. BANIÈRE ET CTAS CLIENTS (INTÉGRATION ÉCOSYSSTÈME)

Chaque outil doit inclure une bannière inférieure d'appel à l'action (*CTA*) redirigeant de façon pertinente vers l'écosystème STAF PRINT CENTER :
- Ex: *"Votre fichier est prêt et conforme ? Lancez votre brief sur `brief.stafprint.com`"*
- Ex: *"Besoin d'aide sur les contraintes techniques ? Consultez `docs.stafprint.com`"*

---

## 📊 5. STRUCTURE DES DONNEES (MOCK TYPESCRIPT)

Créer un fichier `toolsRegistry.ts` :

```typescript
export interface ToolItem {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  category: 'prepression' | 'print' | 'format' | 'pdf';
  icon: string;
  badge?: string;
  ctaText: string;
  ctaTargetUrl: string;
}


🎯 LIVRABLE ATTENDU

Génère le code TypeScript / React / Tailwind CSS / Framer Motion complet pour le hub SPC Creative Toolkit (tools.stafprint.com), incluant TanStack Router pour l'ensemble des 10 routes, le Dashboard d'accueil avec recherche/filtres, et les composants réactifs de chaque outil prépresse.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/b033e3a1-09f1-459d-b3dc-3359a7c9a5e7).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
