import { AREA_GROUPS, WEB_AREAS } from "@/components/web/constants/locations.content";
import { Container } from "@/components/web/primitives/container";
import { getAreasWithStock, getCategoryCounts } from "@/lib/services/web/home";
import { AboutFootprintInteractive, type FootprintGroupData } from "./about-footprint-interactive";

/**
 * 02b — the footprint, in numbers that come from the database.
 *
 * This section connects the 3 submarket categories directly to the live chart,
 * allowing instant filtering and submarket exploration.
 */
export async function AboutFootprint() {
  const [areas, types] = await Promise.all([
    getAreasWithStock(12),
    getCategoryCounts(),
  ]);

  const totalAreas = WEB_AREAS.length;
  const groups: FootprintGroupData[] = AREA_GROUPS.map((group) => {
    const matchingAreas = WEB_AREAS.filter((area) => area.group === group.id);
    const count = matchingAreas.length;
    const share = Math.round((count / totalAreas) * 100);
    return {
      id: group.id,
      title: group.title,
      count,
      share,
      sampleAreas: matchingAreas.slice(0, 3).map((a) => a.name).join(", "),
      areas: matchingAreas,
    };
  });

  const regions = Object.entries(
    WEB_AREAS.reduce<Record<string, number>>((acc, area) => {
      acc[area.region] = (acc[area.region] ?? 0) + 1;
      return acc;
    }, {})
  ).map(([region, count]) => ({ region, count }));

  return (
    <section
      aria-labelledby="footprint-heading"
      className="border-t border-line bg-surface-0 py-20 sm:py-24 lg:py-28"
    >
      <Container>
        <AboutFootprintInteractive
          areas={areas}
          types={types}
          regions={regions}
          groups={groups}
          allAreas={WEB_AREAS}
        />
      </Container>
    </section>
  );
}
