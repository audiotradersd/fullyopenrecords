import { accountEmailNotifications } from "@fully-open-records/db/src/schema";
import { eq } from "drizzle-orm";
import { getDb } from "./db";
import { sendNewAccountNotification } from "./email";
import type { Env } from "../types";

const NOTIFICATION_TYPE = "new_account_created";

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
