import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/components/web/constants/site";
import { PageHeader } from "@/components/web/layout/page-header";
import { SectionBand } from "@/components/web/primitives/section-band";

export const metadata: Metadata = {
  title: "Terms of use",
  description:
    "The terms on which Sunland Real Estates makes this website and its property listings available.",
};

/**
 * Terms of use.
 *
 * A launch blocker alongside the privacy notice. Kept deliberately short and
 * readable: terms nobody can read protect nobody, and the substance here is
 * genuinely small because this site takes enquiries, it does not transact.
 *
 * TODO: client and counsel to review before launch.
 */
export default function TermsPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ label: "Home", href: "/" }, { label: "Terms" }]}
        title="Terms of use"
        lead="The terms on which we make this website and the listings on it available."
      />

      <SectionBand tone="light">
        <div className="web-prose max-w-[68ch] text-ink-500">
          <p>
            This website is operated by Sunland Real Estates Limited, {SITE.addressLine}{" "}
            {SITE.postalAddress} By using it you accept these terms.
          </p>

          <h2 className="web-title mt-10 text-web-h3 text-ink-900">About the listings</h2>
          <p className="mt-3">
            Listings describe property we are instructed to let or sell. We take care that details,
            prices and photographs are accurate at the time of publication, and we correct them
            when they change. They are a description, not an offer or a contract, and they do not
            form part of any tenancy or sale agreement. Measurements are approximate. Where a price
            is shown as on request, it is because the owner has asked us not to publish it, not
            because we are withholding it from you.
          </p>
          <p className="mt-3">
            Map locations on listing pages are approximate until a viewing is arranged. That is
            deliberate: an exact pin on a vacant property is a security risk to the owner and to
            the neighbours.
          </p>

          <h2 className="web-title mt-10 text-web-h3 text-ink-900">Fees</h2>
          <p className="mt-3">
            We do not charge tenants a fee for being shown a property. Any fee payable by an owner
            is agreed in writing before we act. If anyone asks you to pay to view a Sunland
            property, it is not us, and we would like to hear about it.
          </p>

          <h2 className="web-title mt-10 text-web-h3 text-ink-900">Using this site</h2>
          <p className="mt-3">
            You may browse, print and share pages for your own use. You may not scrape the listings,
            republish them, or use them to build a competing index. The Sunland name, the mark and
            the content of this site belong to us or to our licensors.
          </p>

          <h2 className="web-title mt-10 text-web-h3 text-ink-900">Availability</h2>
          <p className="mt-3">
            We aim to keep the site up and current but we do not guarantee it will always be
            available or free of error. If something looks wrong, tell us on{" "}
            <a href={SITE.phoneHref} className="web-numeric text-ink-900 underline underline-offset-4">
              {SITE.phone}
            </a>{" "}
            and we will fix it.
          </p>

          <h2 className="web-title mt-10 text-web-h3 text-ink-900">Law</h2>
          <p className="mt-3">
            These terms are governed by the laws of Kenya, and the courts of Kenya have exclusive
            jurisdiction.
          </p>

          <p className="mt-10 text-web-xs text-ink-400">
            See also our{" "}
            <Link href="/privacy" className="text-ink-900 underline underline-offset-4">
              privacy notice
            </Link>
            .
          </p>
        </div>
      </SectionBand>
    </>
  );
}
