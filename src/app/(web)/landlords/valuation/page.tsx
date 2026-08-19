import { permanentRedirect } from "next/navigation";

/**
 * `/landlords/valuation` redirects to the inline form on the landlord hub.
 *
 * Web doc 04 §5 specified a standalone valuation page. The design supersedes
 * it: the form lives inline at the foot of `/landlords`, at the point where
 * an owner has just read the fee table and is at the highest intent they will
 * reach on this site. Two forms writing the same `valuations` row, with
 * different field sets, would be a maintenance liability and would split the
 * conversion signal between them.
 *
 * The URL survives as a redirect because it is the natural thing to put in an
 * advert, and because doc 04 published it.
 */
export default function ValuationRedirect() {
  permanentRedirect("/landlords#valuation");
}
