import { NotFoundContent } from "@/components/web/layout/not-found-content";
import { SkipLink } from "@/components/web/layout/skip-link";
import { WebFooter } from "@/components/web/layout/web-footer";
import { WebHeader } from "@/components/web/layout/web-header";

/**
 * The root 404.
 *
 * Catches a URL that matches no route at all, which is exactly what a dead
 * backlink from the old WordPress site produces. Without this file Next
 * serves its own bare 404, and a stranger arriving on a stale link from a
 * search result would see an unbranded error page rather than a way back into
 * the site.
 *
 * It rebuilds the marketing shell rather than reusing the `(web)` layout,
 * because a root not-found sits outside every route group and so inherits
 * only the root layout.
 */
export default function RootNotFound() {
  return (
    <div className="web-root flex min-h-screen flex-col overflow-hidden bg-surface-0">
      <SkipLink />
      <WebHeader />
      <main id="content" className="flex-1 flex flex-col">
        <NotFoundContent />
      </main>
    </div>
  );
}
