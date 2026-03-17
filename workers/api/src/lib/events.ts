import { flowEvents } from "@fully-open-records/db/src/schema";
import { getDb } from "./db";
import type { SessionUser, Env } from "../types";

function getSessionKey(request: Request) {
  const value =
    request.headers.get("cf-ray") ??
    request.headers.get("cf-connecting-ip") ??
    crypto.randomUUID();

  return value.slice(0, 64);
}

export async function logFlowEvent(
  env: Env,
  request: Request,
  eventType: string,
  options?: {
    user?: SessionUser | null;
    artistId?: number | null;
    meta?: Record<string, unknown>;
  }
) {
  const db = getDb(env);

  await db.insert(flowEvents).values({
    eventType,
    userId: options?.user?.id ?? null,
    artistId: options?.artistId ?? options?.user?.artistId ?? null,
    path: new URL(request.url).pathname,
    sessionKey: getSessionKey(request),
    meta: options?.meta ?? {},
    createdAt: new Date().toISOString()
  });
}
