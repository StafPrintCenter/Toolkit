import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, createRootRouteWithContext, HeadContent, Scripts } from "@tanstack/react-router";
import { type ReactNode } from "react";
import { Toaster } from "sonner";
import appCss from "../styles.css?url";
import { SITE, SITE_LINK } from "@/data/site";
import logo from "@/assets/logos.json";
import { NotFoundComponent, ErrorComponent } from "@/components/errors";

const PAGE_TITLE = `SPC Creative Toolkit - Outils prépresse & impression | ${SITE.name}`;
const PAGE_DESC = `Assistant interactif de qualification de projet de ${SITE.name}. Décrivez votre projet d'impression, branding, packaging ou web en 6 étapes simples et recevez un devis gratuit.`;

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "SPC Creative Toolkit — Outils prépresse & impression" },
      {
        name: "description",
        content:
          "Le hub d'utilitaires prépresse et impression de STAF PRINT CENTER, Porto-Novo. 100 % côté navigateur.",
      },
      { name: "author", content: "STAF PRINT CENTER" },
      { property: "og:title", content: "SPC Creative Toolkit" },
      {
        property: "og:description",
        content: "Dix outils prépresse gratuits : couleurs, DPI, fonds perdus, façonnage, grand format et PDF.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@Lovable" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter+Tight:wght@400;500;600&family=JetBrains+Mono:wght@400;600&display=swap",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
