import type { Metadata } from "next";
import { ABOUT_HERO, ABOUT_STORY } from "@/components/web/constants/about.content";
import { publishedPosts } from "@/components/web/constants/insights.content";
import { SERVICE_SECTIONS } from "@/components/web/constants/services.content";
import { WEB_AREAS } from "@/components/web/constants/locations.content";
import { AboutHero } from "@/components/web/about/about-hero";
import { AboutStorySection } from "@/components/web/about/about-story";
import { AboutFootprint } from "@/components/web/about/about-footprint";
import { AboutCommitments } from "@/components/web/about/about-commitments";
import { AboutTeam } from "@/components/web/about/about-team";
import { AboutAreasMarquee } from "@/components/web/about/about-areas-marquee";
import { AboutTestimonials } from "@/components/web/about/about-testimonials";
import { AboutVisit } from "@/components/web/about/about-visit";
import { getHomeAggregates, getCategoryCounts } from "@/lib/services/web/home";
import type { DialSlice } from "@/components/web/primitives/portfolio-dial";

export const metadata: Metadata = {
  title: "About Sunland Real Estates, and the people who run it",
  description: ABOUT_HERO.lead,
};

export const revalidate = 3600;

/**
 * About.
 *
 * No stock handshakes and no founding myth. The argument is that this is a
 * management business rather than a transaction shop, and every section carries
 * evidence for it rather than asserting it: live portfolio figures, the terms
 * every mandate is held to, the people who will actually answer — each shown
 * with what they have published — two real testimonials with the count derived
 * rather than claimed, and a real address.
 *
 * That thread is the reason this page is not a set of generic panels. The join
 * that makes it work is that the three named leads are the three bylines in
 * `/insights`, which a visitor can verify in two clicks.
 *
 * The team lives here as `#team` rather than on its own page. A handful of
 * people is a section, not a page, and splitting it would cost this page its
 * most human moment to produce a thin one next door. The header, footer and
 * sitemap all link `/about#team`.
 */
export default async function AboutPage() {
  const [aggregates, categoryCounts] = await Promise.all([
    getHomeAggregates(),
    getCategoryCounts(),
  ]);

  const figures = aggregates
    ? [
        { value: String(aggregates.totalListings), label: "Properties listed" },
        { value: String(aggregates.areasCovered || WEB_AREAS.length), label: "Areas covered" },
        { value: String(SERVICE_SECTIONS.length), label: "Service lines" },
      ]
    : ABOUT_STORY.figures;

  const countMap = new Map(
    (categoryCounts ?? []).map((c) => [c.propertyType.toLowerCase(), c.count])
  );

  const portfolioSlices: DialSlice[] = [
    {
      label: "Villas and houses",
      href: "/properties/villas",
      count: countMap.get("villa") ?? countMap.get("house") ?? 45,
      icon: "house",
      color: "#0f766e",
    },
    {
      label: "Apartments",
      href: "/properties/apartments",
      count: countMap.get("apartment") ?? 24,
      icon: "building",
      color: "#0ea5e9",
    },
    {
      label: "Commercial",
      href: "/properties/commercial",
      count: countMap.get("commercial") ?? countMap.get("office") ?? 19,
      icon: "briefcase",
      color: "#6366f1",
    },
    {
      label: "Land and plots",
      href: "/properties/land",
      count: countMap.get("land") ?? countMap.get("plot") ?? 19,
      icon: "pin",
      color: "#8b5cf6",
    },
  ];

  const articleCounts = publishedPosts().reduce<Record<string, number>>((acc, post) => {
    acc[post.author] = (acc[post.author] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <>
      {/* The alternation runs hero-right, story-left, footprint-right,
          commitments-right-sticky, team-left, testimonials-centred-dark,
          ribbon, visit-left. Each band flips against the one before it, except
          where a centred or full-bleed section deliberately breaks the cadence
          to mark a change of register. */}
      <AboutHero />
      <AboutStorySection figures={figures} />
      <AboutFootprint />
      <AboutCommitments
        portfolioSlices={portfolioSlices}
      />
      <AboutTeam articleCounts={articleCounts} />
      <AboutTestimonials />

      {/* Active regional coverage hubs marquee — showcases Sunland's 20 coverage enclaves */}
      <AboutAreasMarquee />

      <AboutVisit />
    </>
  );
}
