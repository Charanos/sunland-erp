import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/components/web/constants/site";
import { PageHeader } from "@/components/web/layout/page-header";
import { SectionBand } from "@/components/web/primitives/section-band";

export const metadata: Metadata = {
  title: "Privacy notice",
  description:
    "What Sunland Real Estates collects when you enquire, why, how long we keep it, and how to ask us to delete it.",
};

/**
 * Privacy notice.
 *
 * A launch blocker, per doc 06. The current WordPress site points both this
 * and Terms at "#", which is a compliance gap rather than an oversight, and
 * the single easiest thing on the whole rebuild to get right.
 *
 * The content below describes what the forms on this site actually collect,
 * which is the acceptance criterion in W2-5. It is deliberately specific: a
 * generic privacy page that does not match the forms is not a privacy notice,
 * it is decoration.
 *
 * TODO: client and counsel to review before launch. The processing described
 * here is accurate to the build; the retention periods and the lawful basis
 * wording need sign-off under the Kenyan Data Protection Act 2019.
 */
export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ label: "Home", href: "/" }, { label: "Privacy notice" }]}
        title="Privacy notice"
        lead="What we collect when you contact us, why we collect it, and what you can ask us to do with it."
      />

      <SectionBand tone="light">
        <div className="web-prose max-w-[68ch] text-ink-500">
          <p>
            Sunland Real Estates Limited is the data controller for the information collected
            through this website. We are at {SITE.addressLine} {SITE.postalAddress} You can reach
            us at{" "}
            <a href={SITE.emailHref} className="text-ink-900 underline underline-offset-4">
              {SITE.email}
            </a>{" "}
            or on{" "}
            <a href={SITE.phoneHref} className="web-numeric text-ink-900 underline underline-offset-4">
              {SITE.phone}
            </a>
            .
          </p>

          <h2 className="web-title mt-10 text-web-h3 text-ink-900">What we collect</h2>
          <p className="mt-3">
            Only what the form you filled in asks for. A property enquiry collects your name, your
            phone number, an optional email address and your message, plus the reference of the
            listing you were looking at. A valuation request additionally collects the property
            type, its location, the number of units and what you need from us. The contact form
            collects your name, phone, optional email and message.
          </p>
          <p className="mt-3">
            We do not ask for identification documents, payment details or financial information
            through this website, and you should never send them to us through it.
          </p>

          <h2 className="web-title mt-10 text-web-h3 text-ink-900">Why we collect it</h2>
          <p className="mt-3">
            To answer you. An enquiry is passed to the consultant who handles that property or that
            area so they can call you back, arrange a viewing, or attend a valuation. We keep a
            record of the enquiry so that the next person you speak to knows what you have already
            told us.
          </p>

          <h2 className="web-title mt-10 text-web-h3 text-ink-900">Who sees it</h2>
          <p className="mt-3">
            Sunland staff who need it to do the work: the assigned consultant, their manager, and
            the office administrator. We do not sell your details, we do not pass them to other
            agents, and we do not add you to a marketing list because you enquired about a
            property. If you subscribe to property alerts, that is a separate choice you make
            explicitly and can undo in one click.
          </p>

          <h2 className="web-title mt-10 text-web-h3 text-ink-900">How long we keep it</h2>
          <p className="mt-3">
            Enquiry records are kept while the enquiry is live and for a period afterwards so we
            can pick up the conversation if you come back. Where a tenancy or a mandate follows, the
            record is kept for as long as the law requires us to keep tenancy and financial records.
          </p>

          <h2 className="web-title mt-10 text-web-h3 text-ink-900">Your rights</h2>
          <p className="mt-3">
            You can ask us what we hold about you, ask us to correct it, and ask us to delete it
            where we are not required to keep it. Write to{" "}
            <a href={SITE.emailHref} className="text-ink-900 underline underline-offset-4">
              {SITE.email}
            </a>{" "}
            and we will respond. You also have the right to complain to the Office of the Data
            Protection Commissioner.
          </p>

          <h2 id="cookies" className="web-title mt-10 text-web-h3 text-ink-900">
            Cookies
          </h2>
          <p className="mt-3">
            This site sets no advertising or tracking cookies. Analytics, when we enable it, will
            not load until you accept it, and declining will not change how the site works for you.
          </p>

          <p className="mt-10 text-[13.5px] text-ink-400">
            See also our{" "}
            <Link href="/terms" className="text-ink-900 underline underline-offset-4">
              terms of use
            </Link>
            .
          </p>
        </div>
      </SectionBand>
    </>
  );
}
