"use client";

import { useEffect } from "react";
import { SITE } from "@/components/web/constants/site";
import { WebButton, WebButtonLink } from "@/components/web/primitives/button";
import { Container } from "@/components/web/primitives/container";

/**
 * 500.
 *
 * Plain, with a phone number. The business does not stop because the site
 * did: someone who wanted to enquire about a property five seconds ago still
 * wants to, and the fastest recovery from a broken page is a working phone
 * line, not an apology.
 *
 * Must be a client component. That is a Next.js requirement for an error
 * boundary, not a choice.
 */
export default function WebError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // The visitor sees a phone number; the digest is what makes the incident
    // findable in logs afterwards.
    console.error("[web] unhandled render error", error);
  }, [error]);

  return (
    <Container className="flex min-h-[60vh] flex-col justify-center py-24">
      <p className="web-eyebrow text-ink-400">Something went wrong</p>
      <h1 className="web-title mt-4 max-w-[16em] text-web-h1 text-ink-900">
        This page did not load.
      </h1>
      <p className="web-prose mt-5 text-ink-500">
        The fault is ours, not yours. Try again in a moment, or call the office and we will help you
        straight away.
      </p>

      <div className="mt-10 flex flex-wrap gap-4">
        <WebButton onClick={reset} variant="secondary" size="lg">
          Try again
        </WebButton>
        <WebButtonLink href={SITE.phoneHref} external variant="outline" size="lg" icon="phone">
          {SITE.phone}
        </WebButtonLink>
        <WebButtonLink
          href={SITE.whatsappHref}
          external
          variant="outline"
          size="lg"
          icon="chat"
          target="_blank"
        >
          WhatsApp
        </WebButtonLink>
      </div>

      {error.digest && (
        <p className="web-numeric mt-10 text-[13px] text-ink-400">Reference {error.digest}</p>
      )}
    </Container>
  );
}
