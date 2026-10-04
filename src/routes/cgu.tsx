import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { ToolkitShell } from "@/components/site";
import { SITE } from "@/data/site";

const PAGE_TITLE = `Conditions générales d'utilisation | ${SITE.tool} | ${SITE.name}`;
const PAGE_DESC = `CGU du SPC Creative Toolkit de STAF PRINT CENTER : accès gratuit, traitement local des fichiers, responsabilités et propriété intellectuelle.`;

export const Route = createFileRoute("/cgu")({
  head: () => ({
    meta: [
      { title: PAGE_TITLE },
      { name: "description", content: PAGE_DESC },
      { property: "og:title", content: PAGE_TITLE },
      { property: "og:description", content: PAGE_DESC },
    ],
  }),
  component: CguPage,
});


const SECTIONS: { t: string; p: string[] }[] = [
  { t: "1. Objet", p: ["Les présentes conditions générales d'utilisation (CGU) encadrent l'accès et l'utilisation du SPC Creative Toolkit, accessible à l'adresse tools.stafprint.com, édité par STAF PRINT CENTER, Porto-Novo, Bénin.", "Toute utilisation du service vaut acceptation pleine et entière des présentes CGU."] },
  { t: "2. Accès au service", p: ["Le service est accessible gratuitement, sans création de compte, à toute personne disposant d'un accès à Internet et d'un navigateur récent.", "STAF PRINT CENTER peut suspendre, modifier ou interrompre tout ou partie du service, notamment pour maintenance, sans préavis ni indemnité."] },
  { t: "3. Traitement des fichiers et confidentialité", p: ["Les calculs et traitements (images, PDF, couleurs, gabarits) sont réalisés exclusivement dans votre navigateur. Vos fichiers ne sont ni envoyés, ni stockés sur nos serveurs.", "Des préférences techniques (par exemple le thème clair ou sombre) peuvent être enregistrées localement sur votre appareil. Des statistiques de fréquentation anonymes peuvent être collectées pour améliorer le service."] },
  { t: "4. Nature des résultats", p: ["Les outils fournissent des simulations et des aides à la décision (conversions CMJN, diagnostics DPI, TAC, tracés de découpe, typons, séparations…). Les rendus à l'écran ne remplacent ni une épreuve contractuelle, ni un contrôle prépresse professionnel.", "Il appartient à l'utilisateur de vérifier ses fichiers avant toute impression. Pour une production, l'équipe STAF PRINT CENTER réalise un contrôle via brief.stafprint.com."] },
  { t: "5. Responsabilité", p: ["STAF PRINT CENTER met en œuvre les moyens raisonnables pour assurer l'exactitude des outils, sans garantie de résultat. Sa responsabilité ne saurait être engagée pour tout dommage direct ou indirect résultant de l'utilisation des outils, d'erreurs de calcul, d'une indisponibilité du service ou d'une impression réalisée par un tiers.", "L'utilisateur est seul responsable des contenus qu'il importe et garantit disposer des droits nécessaires sur ceux-ci."] },
  { t: "6. Propriété intellectuelle", p: ["La marque, le logo, les textes, les illustrations et le code du service sont la propriété de STAF PRINT CENTER. Toute reproduction non autorisée est interdite.", "Les fichiers exportés à partir de vos propres visuels (gabarits, masques, films, QR codes…) restent votre propriété et peuvent être librement utilisés."] },
  { t: "7. Usage acceptable", p: ["L'utilisateur s'engage à ne pas détourner le service, perturber son fonctionnement, ni l'utiliser à des fins illicites ou pour produire des contenus contrefaisants."] },
  { t: "8. Liens externes et soutien", p: ["Le service contient des liens vers des sites tiers (FedaPay pour les dons, roadmap, documentation). STAF PRINT CENTER n'est pas responsable de leur contenu. Les dons sont volontaires et ne donnent droit à aucune contrepartie."] },
  { t: "9. Modification des CGU", p: ["Les présentes CGU peuvent être modifiées à tout moment. La version applicable est celle en ligne au moment de l'utilisation."] },
  { t: "10. Droit applicable", p: ["Les présentes CGU sont régies par le droit béninois. Tout litige relève de la compétence des juridictions de Porto-Novo, après tentative de résolution amiable.", "Contact : via brief.stafprint.com ou roadmap.stafprint.com/submit."] },
];

function CguPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <ToolkitShell />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="size-4" /> Tous les outils
        </Link>
        <h1 className="mt-4 text-3xl font-bold sm:text-4xl">Conditions générales d'utilisation</h1>
        <p className="mt-2 text-sm text-muted-foreground">Dernière mise à jour : 4 octobre 2026</p>
        <div className="mt-8 space-y-8">
          {SECTIONS.map((s) => (
            <section key={s.t}>
              <h2 className="text-xl font-semibold">{s.t}</h2>
              {s.p.map((x, i) => <p key={i} className="mt-2 leading-relaxed text-muted-foreground">{x}</p>)}
            </section>
          ))}
        </div>
      </main>
      <ToolkitShell />
    </div>
  );
}
