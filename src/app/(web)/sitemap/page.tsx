import type { Metadata } from "next";
import Link from "next/link";
import { CATEGORY_FACETS, STATUS_FACETS } from "@/components/web/constants/listing-taxonomy";
import { publishedPosts } from "@/components/web/constants/insights.content";
import { AREA_GROUPS, WEB_AREAS } from "@/components/web/constants/locations.content";
import { SERVICES_HERO } from "@/components/web/constants/services.content";
import { PageHeader } from "@/components/web/layout/page-header";
import { SectionBand } from "@/components/web/primitives/section-band";

export const metadata: Metadata = {
  title: "Sitemap",
  description: "Every page on sunland.co.ke, in one list.",
};

export const revalidate = 3600;

/**
 * The human sitemap.
 *
 * The safety net behind doc 02 §6's rule that no page is an orphan. Linked
 * from the footer, so anything reachable from here is reachable from
 * everywhere, which matters most for the facet and area pages that otherwise
 * depend on a single link from one hub.
 *
 * Built from the same constants the pages are, so a new area or facet appears
 * here automatically. A hand-maintained sitemap is wrong within a month.
 *
 * Distinct from `sitemap.xml`, which is W5-2 and is for crawlers.
 */
export default function SitemapPage() {
  const posts = publishedPosts();

  const groups: { title: string; links: { label: string; href: string }[] }[] = [
    {
      title: "Main",
      links: [
        { label: "Home", href: "/" },
        { label: "Properties", href: "/properties" },
        { label: "Landlords", href: "/landlords" },
        { label: "Services", href: "/services" },
        { label: "Areas", href: "/locations" },
        { label: "Insights", href: "/insights" },
        { label: "About", href: "/about" },
        { label: "Contact", href: "/contact" },
      ],
    },
    {
      title: "Property search",
      links: [
        ...STATUS_FACETS.map((facet) => ({
          label: facet.label,
          href: `/properties/${facet.segment}`,
        })),
        ...CATEGORY_FACETS.map((facet) => ({
          label: facet.label,
          href: `/properties/${facet.segment}`,
        })),
      ],
    },
    {
      title: "For owners",
      links: [
        { label: "Request a valuation", href: "/landlords#valuation" },
        { label: "How management works", href: "/landlords#how" },
        { label: "Fees", href: "/landlords#valuation" },
        // Services is one page with four anchored sections, so the sitemap
        // links the anchors rather than pretending four pages exist.
        ...SERVICES_HERO.jumpLinks.map((link) => ({
          label: link.label,
          href: `/services${link.href}`,
        })),
      ],
    },
    ...AREA_GROUPS.map((group) => ({
      title: group.title,
      links: WEB_AREAS.filter((area) => area.group === group.id).map((area) => ({
        label: area.name,
        href: `/locations/${area.slug}`,
      })),
    })),
    {
      title: "Company",
      links: [
        { label: "About", href: "/about" },
        { label: "The team", href: "/about#team" },
        { label: "Tenant portal", href: "/login" },
        { label: "Landlord portal", href: "/login" },
      ],
    },
    // Only rendered when something is published, so the section never sits
    // empty under a heading promising articles.
    ...(posts.length > 0
      ? [
          {
            title: "Insights",
            links: posts.map((post) => ({
              label: post.title,
              href: `/insights/${post.slug}`,
            })),
          },
        ]
      : []),
    {
      title: "Legal",
      links: [
        { label: "Privacy notice", href: "/privacy" },
        { label: "Terms of use", href: "/terms" },
        { label: "Cookies", href: "/privacy#cookies" },
      ],
    },
  ];

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Home", href: "/" }, { label: "Sitemap" }]}
        title="Sitemap"
        lead="Every page on this site, in one list."
      />

      <SectionBand tone="light" labelledBy="sitemap-heading">
        <h2 id="sitemap-heading" className="sr-only">
          All pages
        </h2>
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <h3 className="web-control text-web-micro uppercase tracking-[0.2em] text-ink-400">
                {group.title}
              </h3>
              <ul className="mt-4 flex flex-col gap-2.5">
                {group.links.map((link) => (
                  <li key={`${group.title}-${link.href}-${link.label}`}>
                    <Link
                      href={link.href}
                      className="text-web-sm text-ink-700 transition-colors hover:text-ink-900"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </SectionBand>
    </>
  );
}
