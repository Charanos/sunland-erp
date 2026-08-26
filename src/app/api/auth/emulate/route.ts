import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { setSession } from "@/lib/auth/session";
import { getDefaultPortal } from "@/lib/auth/roles";
import type { UserRole } from "@/types";

type DbUser = typeof users.$inferSelect;
type MockUser = { id: string; email: string; name: string; role: UserRole };

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { role: rawRole, email: rawEmail } = body;

    const email = rawEmail ? String(rawEmail).toLowerCase().trim() : undefined;
    let user: DbUser | MockUser | null = null;

    // 1. Try finding user by email in database if provided
    if (email) {
      try {
        const [dbUser] = await db
          .select()
          .from(users)
          .where(eq(users.email, email))
          .limit(1);
        if (dbUser) user = dbUser;
      } catch (dbErr) {
        console.warn("DB email lookup failed in login:", dbErr);
      }
    }

    // 2. Resolve target role
    let role = user ? user.role : rawRole;
    if (!role && email) {
      if (email.includes("gm") || email.includes("general")) role = "general_manager";
      else if (email.includes("strategy")) role = "head_of_strategy";
      else if (email.includes("finance") || email.includes("finance.head")) role = "finance_head";
      else if (email.includes("account")) role = "accounts_manager";
      else if (email.includes("hr")) role = "hr_head";
      else if (email.includes("property") || email.includes("line.manager")) role = "property_manager";
      else if (email.includes("front") || email.includes("front.office")) role = "front_office_head";
      else if (email.includes("audit") || email.includes("compliance")) role = "auditor";
      else role = "ceo";
    }
    if (!role) role = "ceo";

    // 3. If user wasn't found by email, try finding by role in DB
    if (!user) {
      try {
        const [dbUser] = await db
          .select()
          .from(users)
          .where(eq(users.role, role as (typeof users.$inferInsert)["role"]))
          .limit(1);
        user = dbUser;
      } catch (dbErr) {
        console.warn("DB lookup failed in login emulation:", dbErr);
      }
    }

    if (!user) {
      user = {
        id: `usr-mock-${role}`,
        email: `${role}@sunland.co.ke`,
        name: role
          .split("_")
          .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" "),
        role: role as UserRole,
      };
    }

    await setSession(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role as UserRole,
      },
      {
        ip: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim(),
        userAgent: request.headers.get("user-agent") ?? undefined,
      }
    );

    const redirectPath = getDefaultPortal(user.role as UserRole);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        portal: redirectPath,
      },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Access delegation failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
