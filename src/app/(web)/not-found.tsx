import { NotFoundContent } from "@/components/web/layout/not-found-content";

/**
 * 404 for a `notFound()` thrown inside a marketing page, most often a listing
 * slug that resolves to nothing. The `(web)` layout already supplies the
 * header, footer and token scope, so this only needs the body.
 */
export default function WebNotFound() {
  return <NotFoundContent />;
}
