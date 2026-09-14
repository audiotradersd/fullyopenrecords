import { accountEmailNotifications, artists, users } from "@fully-open-records/db/src/schema";
import { and, asc, eq, isNull, ne, or } from "drizzle-orm";
import { getDb } from "./db";
import { sendAccountWelcomeEmail, sendNewAccountNotification } from "./email";
import type { Env } from "../types";

const NOTIFICATION_TYPE = "new_account_created";
const GETTING_STARTED_NOTIFICATION_TYPE = "artist_getting_started";

type AccountNotificationInput = {
  userId: number;
  email: string;
  username: string;
  accountType: "artist" | "listener";
  artist?: { name: string; slug: string };
};

/** Sends the internal account alert and records Postmark's outcome. */
export async function sendAndRecordNewAccountNotification(env: Env, input: AccountNotificationInput) {
  const db = getDb(env);
  const [existing] = await db.select().from(accountEmailNotifications)
    .where(eq(accountEmailNotifications.userId, input.userId)).limit(1);
  if (existing?.status === "sent" && existing.notificationType === NOTIFICATION_TYPE) {
    return { ok: true, skipped: true } as const;
  }

  const result = await sendNewAccountNotification(env, input);
  const now = new Date().toISOString();
  const values = {
    userId: input.userId,
    notificationType: NOTIFICATION_TYPE,
    status: result.ok ? "sent" : "failed",
    postmarkMessageId: result.ok ? result.messageId : null,
    error: result.ok ? null : result.error,
    attempts: (existing?.attempts ?? 0) + 1,
    sentAt: result.ok ? now : null,
    updatedAt: now
  } as const;

  if (existing) {
    await db.update(accountEmailNotifications).set(values).where(eq(accountEmailNotifications.id, existing.id));
  } else {
    await db.insert(accountEmailNotifications).values(values);
  }
  return { ok: result.ok, skipped: false } as const;
}

/** Sends the artist getting-started template once per account and records its outcome. */
export async function sendAndRecordArtistGettingStartedEmail(env: Env, input: AccountNotificationInput) {
  if (input.accountType !== "artist") return { ok: false as const, skipped: true, error: "Artist account required." };

  const db = getDb(env);
  const [existingGettingStarted] = await db.select().from(accountEmailNotifications)
    .where(and(
      eq(accountEmailNotifications.userId, input.userId),
      eq(accountEmailNotifications.notificationType, GETTING_STARTED_NOTIFICATION_TYPE)
    )).limit(1);
  if (existingGettingStarted?.status === "sent") return { ok: true as const, skipped: true };

  const result = await sendAccountWelcomeEmail(env, {
    email: input.email,
    username: input.username,
    accountType: "artist",
    artistSlug: input.artist?.slug
  });
  const now = new Date().toISOString();
  const values = {
    userId: input.userId,
    notificationType: GETTING_STARTED_NOTIFICATION_TYPE,
    status: result.ok ? "sent" : "failed",
    postmarkMessageId: result.ok ? result.messageId : null,
    error: result.ok ? null : result.error,
    attempts: (existingGettingStarted?.attempts ?? 0) + 1,
    sentAt: result.ok ? now : null,
    updatedAt: now
  } as const;

  if (existingGettingStarted) {
    await db.update(accountEmailNotifications).set(values).where(eq(accountEmailNotifications.id, existingGettingStarted.id));
  } else {
    await db.insert(accountEmailNotifications).values(values);
  }
  return { ok: result.ok, skipped: false } as const;
}

/** Sends a bounded batch to active artist accounts that have not yet received the campaign. */
export async function sendPendingArtistGettingStartedEmails(env: Env, limit = 25) {
  const db = getDb(env);
  const pending = await db
    .select({ user: users, artist: artists })
    .from(users)
    .leftJoin(artists, eq(artists.userId, users.id))
    .leftJoin(accountEmailNotifications, and(
      eq(accountEmailNotifications.userId, users.id),
      eq(accountEmailNotifications.notificationType, GETTING_STARTED_NOTIFICATION_TYPE)
    ))
    .where(and(
      eq(users.accountType, "artist"),
      eq(users.active, true),
      or(isNull(accountEmailNotifications.id), ne(accountEmailNotifications.status, "sent"))
    ))
    .orderBy(asc(users.id))
    .limit(limit);

  let sent = 0;
  let failed = 0;
  for (const row of pending) {
    const result = await sendAndRecordArtistGettingStartedEmail(env, {
      userId: row.user.id,
      email: row.user.email,
      username: row.user.username,
      accountType: "artist",
      artist: row.artist ? { name: row.artist.name, slug: row.artist.slug } : undefined
    });
    if (result.ok) sent += 1; else failed += 1;
  }
  return { attempted: pending.length, sent, failed, hasMore: pending.length === limit };
}
