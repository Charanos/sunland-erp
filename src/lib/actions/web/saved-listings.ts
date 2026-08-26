"use server";

import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { userSavedListings } from "@/db/schema/web";
import { getCurrentUser } from "@/lib/auth/session";
import type { ActionResult } from "./shared";

/**
 * Saving and unsaving a listing.
 *
 * The one public write path that needs a session, and so the only one that
 * skips the enquiry staging table — there is nothing to triage about a
 * bookmark, and the row is meaningless without a real user to hang it on.
 *
 * `getCurrentUser()` is re-checked inside the action rather than trusted from
 * whatever the client sent. A server action is a public HTTP endpoint: the
 * fact that the button only renders for signed-in visitors says nothing about
 * who can POST to it.
 *
 * No cache tag is revalidated: `getSavedListingIds` reads the table directly
 * on every request rather than through a cached function, so there is nothing
 * for a tag to invalidate. The action returns the resulting state instead and
 * the control holds it, which is also what makes the optimistic update honest.
 */

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export type SaveResult = ActionResult<{ saved: boolean }>;

export async function toggleSavedListing(propertyId: string): Promise<SaveResult> {
  if (!UUID.test(propertyId)) {
    return { ok: false, message: "That listing could not be found." };
  }

  const user = await getCurrentUser();
  if (!user) {
    // Not an error state in the UI — the caller turns this into a sign-in
    // prompt. Saying "sign in to save" is more useful than "unauthorised".
    return { ok: false, message: "Sign in to save listings." };
  }

  try {
    const existing = await db
      .select({ id: userSavedListings.id })
      .from(userSavedListings)
      .where(
        and(
          eq(userSavedListings.userId, user.id),
          eq(userSavedListings.propertyId, propertyId)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      await db.delete(userSavedListings).where(eq(userSavedListings.id, existing[0].id));
      return { ok: true, data: { saved: false }, message: "Removed from saved." };
    }

    await db
      .insert(userSavedListings)
      .values({ userId: user.id, propertyId })
      // The unique index makes this idempotent at the database rather than in
      // a read-then-write race, which two fast clicks would otherwise lose.
      .onConflictDoNothing();

    return { ok: true, data: { saved: true }, message: "Saved." };
  } catch (error) {
    console.error("[web/actions] toggle saved listing failed", error);
    return { ok: false, message: "We could not save that just now." };
  }
}

/** The listing ids this visitor has saved. Empty for anonymous visitors. */
export async function getSavedListingIds(): Promise<string[]> {
  const user = await getCurrentUser();
  if (!user) return [];

  try {
    const rows = await db
      .select({ propertyId: userSavedListings.propertyId })
      .from(userSavedListings)
      .where(eq(userSavedListings.userId, user.id));

    return rows.map((row) => row.propertyId);
  } catch (error) {
    // A failure here should hide the saved state, not break the listing grid.
    console.error("[web/actions] read saved listings failed", error);
    return [];
  }
}
