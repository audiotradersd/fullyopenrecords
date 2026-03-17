import { and, eq, gt, lt } from "drizzle-orm";
import { getCookie } from "hono/cookie";
import { artists, sessions, users } from "@fully-open-records/db/src/schema";
import { getDb } from "./db";
import { hashSessionToken, SESSION_COOKIE_NAME } from "./auth";
import type { Context } from "hono";
import type { AppVariables, Env, SessionUser } from "../types";

function getRequestToken(c: Context<{ Bindings: Env; Variables: AppVariables }>) {
  const bearer = c.req.header("Authorization")?.replace("Bearer ", "");
  if (bearer) return bearer;
  return getCookie(c, SESSION_COOKIE_NAME);
}

export async function resolveSessionUser(
  c: Context<{ Bindings: Env; Variables: AppVariables }>
): Promise<SessionUser | null> {
  const token = getRequestToken(c);
  if (!token) return null;

  const db = getDb(c.env);
  const now = new Date().toISOString();
  await db.delete(sessions).where(lt(sessions.expiresAt, now));
  const tokenHash = await hashSessionToken(token);
  const rows = await db
    .select({
      userId: users.id,
      email: users.email,
      username: users.username,
      accountType: users.accountType,
      role: users.role,
      artistId: artists.id,
      artistSlug: artists.slug
    })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .leftJoin(artists, eq(artists.userId, users.id))
    .where(and(eq(sessions.tokenHash, tokenHash), gt(sessions.expiresAt, now)))
    .limit(1);

  const row = rows[0];
  if (!row) return null;

  return {
    id: row.userId,
    email: row.email,
    username: row.username,
    accountType: row.accountType as SessionUser["accountType"],
    role: row.role,
    artistId: row.artistId ?? null,
    artistSlug: row.artistSlug ?? null
  };
}
