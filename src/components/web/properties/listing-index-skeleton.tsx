import { Container } from "../primitives/container";
import { ListingCardSkeleton } from "../primitives/listing-card";

/**
 * Loading state for the listing index.
 *
 * Deliberately NOT a `loading.tsx` route file. A `loading.tsx` at
 * `/properties` creates a Suspense boundary covering `/properties/[segment]`
 * as well, which flushes the shell with a 200 before the segment resolves and
 * turns every listing `notFound()` into a soft 404: the visitor sees the
 * right page, and a crawler sees a 200 and indexes a listing that does not
 * exist. Same problem one level up for a group-level `loading.tsx`.
 *
 * So the boundary is placed explicitly, in the one page that needs it, with
 * `<Suspense>` around the part that does the database work.
 *
 * Every block matches the dimensions of the component it stands in for,
 * because a skeleton of a different height spends the whole CLS budget the
 * moment real data arrives.
 */
export function ListingIndexSkeleton() {
  return (
    <>
      <div className="web-dark pb-10 pt-9">
        <Container>
          <div className="web-skeleton h-3 w-40 rounded-web-sm opacity-20" />
          <div className="web-skeleton mt-6 h-12 w-[28ch] max-w-full rounded-web-sm opacity-20" />
          <div className="web-skeleton mt-3 h-4 w-[52ch] max-w-full rounded-web-sm opacity-15" />
        </Container>
      </div>

      <div className="bg-surface-1 pb-24 pt-8">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[300px_minmax(0,1fr)] lg:items-start">
            <div className="hidden h-[520px] rounded-web-card border border-line bg-surface-0 lg:block" />
            <div className="min-w-0">
              <div className="mb-5 h-[54px] rounded-web-full border border-line bg-surface-0" />
              <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <li key={index}>
                    <ListingCardSkeleton />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}
