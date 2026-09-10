import { mediaJobs, songs } from "@fully-open-records/db/src/schema";
import { and, asc, eq } from "drizzle-orm";
import { Hono } from "hono";
import { getDb } from "../lib/db";
import type { AppVariables, Env } from "../types";

export const mediaWorkerRouter = new Hono<{ Bindings: Env; Variables: AppVariables }>();

function processorAuthorized(request: Request, env: Env) {
  const token = request.headers.get("Authorization")?.replace(/^Bearer\s+/i, "");
  return Boolean(token && env.MEDIA_PROCESSOR_TOKEN && token === env.MEDIA_PROCESSOR_TOKEN);
}

function publicMediaUrl(request: Request, env: Env, key: string) {
  return `${env.R2_PUBLIC_URL || new URL(request.url).origin}/media/${key}`;
}

mediaWorkerRouter.use("/*", async (c, next) => {
  if (!processorAuthorized(c.req.raw, c.env)) return c.json({ error: "Unauthorized" }, 401);
  await next();
});

// Oracle polls this endpoint. Claiming changes the status atomically, so a
// second worker cannot process the same item.
mediaWorkerRouter.post("/jobs/claim", async (c) => {
  const db = getDb(c.env);
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const [candidate] = await db
      .select({ job: mediaJobs, song: songs })
      .from(mediaJobs)
      .innerJoin(songs, eq(mediaJobs.songId, songs.id))
      .where(eq(mediaJobs.status, "queued"))
      .orderBy(asc(mediaJobs.createdAt))
      .limit(1);
    if (!candidate) return c.json({ job: null });

    const now = new Date().toISOString();
    const claimed = await db
      .update(mediaJobs)
      .set({ status: "processing", attempts: candidate.job.attempts + 1, claimedAt: now, updatedAt: now })
      .where(and(eq(mediaJobs.id, candidate.job.id), eq(mediaJobs.status, "queued")))
      .returning();
    if (!claimed.length) continue;

    return c.json({
      job: {
        id: candidate.job.id,
        type: candidate.job.jobType,
        sourceBucket: candidate.job.sourceBucket,
        sourceKey: candidate.job.sourceKey,
        masterKey: candidate.job.masterKey,
        outputKey: candidate.job.outputKey,
        song: { id: candidate.song.id, title: candidate.song.title, artistName: candidate.song.artistName }
      }
    });
  }
  return c.json({ error: "Could not claim a job. Try again." }, 409);
});

mediaWorkerRouter.post("/jobs/:id/complete", async (c) => {
  const jobId = Number(c.req.param("id"));
  const payload = await c.req.json<{ duration?: unknown }>();
  if (!Number.isInteger(jobId)) return c.json({ error: "Invalid job id" }, 400);
  const db = getDb(c.env);
  const [job] = await db.select().from(mediaJobs).where(eq(mediaJobs.id, jobId)).limit(1);
  if (!job || job.status !== "processing") return c.json({ error: "Job is not being processed" }, 409);
  const now = new Date().toISOString();

  if (job.jobType === "encode") {
    if (!job.outputKey) return c.json({ error: "Encode job has no output key" }, 500);
    await db.update(songs).set({
      audioUrl: publicMediaUrl(c.req.raw, c.env, job.outputKey),
      masterKey: job.masterKey ?? undefined,
      duration: typeof payload.duration === "number" && Number.isFinite(payload.duration) ? Math.round(payload.duration) : null,
      processingStatus: "ready",
      updatedAt: now
    }).where(eq(songs.id, job.songId));

    // A legacy upload is first copied by Oracle into MASTER_BUCKET. Only then
    // is its publicly served original removed, leaving the encoded MP3 live.
    if (job.sourceBucket === "media" && job.sourceKey !== job.outputKey && job.masterKey) {
      await c.env.MEDIA_BUCKET.delete(job.sourceKey);
    }
  }

  await db.update(mediaJobs).set({ status: "completed", completedAt: now, error: null, updatedAt: now }).where(eq(mediaJobs.id, jobId));
  return c.json({ ok: true });
});

mediaWorkerRouter.post("/jobs/:id/fail", async (c) => {
  const jobId = Number(c.req.param("id"));
  const payload = await c.req.json<{ error?: unknown }>();
  if (!Number.isInteger(jobId)) return c.json({ error: "Invalid job id" }, 400);
  const db = getDb(c.env);
  const [job] = await db.select().from(mediaJobs).where(eq(mediaJobs.id, jobId)).limit(1);
  if (!job || job.status !== "processing") return c.json({ error: "Job is not being processed" }, 409);
  const now = new Date().toISOString();
  const error = typeof payload.error === "string" ? payload.error.slice(0, 2000) : "Media processor failed without an error message.";
  await db.update(mediaJobs).set({ status: "failed", error, updatedAt: now }).where(eq(mediaJobs.id, jobId));
  if (job.jobType === "encode") await db.update(songs).set({ processingStatus: "failed", updatedAt: now }).where(eq(songs.id, job.songId));
  return c.json({ ok: true });
});
