import { zValidator } from "@hono/zod-validator";
import {
  artistSchema,
  faqSchema,
  loginSchema,
  pageSchema,
  trackingItemSchema,
  productSchema,
  releaseSchema
} from "@fully-open-records/api/src/contracts";
import { favouriteSongs, songs, trackingItems, users } from "@fully-open-records/db/src/schema";
import { count, desc, eq } from "drizzle-orm";
import { Hono } from "hono";
import { getDb } from "../lib/db";
import { signAdminJwt } from "../lib/auth";
import { fallbackContent } from "../lib/content";
import { requireAdmin } from "../middleware/auth";
import type { AppVariables, Env } from "../types";

export const adminRouter = new Hono<{ Bindings: Env; Variables: AppVariables }>();

function updateById<T extends { id?: number }>(
  collection: T[],
  id: number,
  payload: Partial<T>
) {
  const index = collection.findIndex((item) => item.id === id);
  if (index === -1) return null;
  collection[index] = { ...collection[index], ...payload };
  return collection[index];
}

function deleteById<T extends { id?: number }>(collection: T[], id: number) {
  const index = collection.findIndex((item) => item.id === id);
  if (index === -1) return false;
  collection.splice(index, 1);
  return true;
}

const mutableFallback = fallbackContent as {
  artists: Array<Record<string, unknown> & { id?: number }>;
  releases: Array<Record<string, unknown> & { id?: number }>;
  products: Array<Record<string, unknown> & { id?: number }>;
  faq: Array<Record<string, unknown> & { id?: number }>;
  pages: Array<Record<string, unknown> & { id?: number }>;
  submissions: Array<Record<string, unknown> & { id?: number }>;
};

adminRouter.post("/login", zValidator("json", loginSchema), async (c) => {
  const payload = c.req.valid("json");

  if (payload.email !== c.env.ADMIN_EMAIL || payload.password !== c.env.ADMIN_PASSWORD) {
    return c.json({ error: "Invalid credentials" }, 401);
  }

  return c.json({ token: await signAdminJwt(c.env.JWT_SECRET, payload.email) });
});

adminRouter.use("/*", requireAdmin);

adminRouter.get("/artists", (c) => c.json(fallbackContent.artists));
adminRouter.post("/artists", zValidator("json", artistSchema), (c) => {
  const entry = { ...c.req.valid("json"), id: Date.now() };
  mutableFallback.artists.push(entry);
  return c.json(entry, 201);
});
adminRouter.put("/artists/:id", zValidator("json", artistSchema.partial()), (c) => {
  const updated = updateById(mutableFallback.artists, Number(c.req.param("id")), c.req.valid("json"));
  return updated ? c.json(updated) : c.json({ error: "Not found" }, 404);
});
adminRouter.delete("/artists/:id", (c) => {
  const deleted = deleteById(mutableFallback.artists, Number(c.req.param("id")));
  return deleted ? c.json({ ok: true }) : c.json({ error: "Not found" }, 404);
});

adminRouter.get("/releases", (c) => c.json(fallbackContent.releases));
adminRouter.post("/releases", zValidator("json", releaseSchema), (c) => {
  const entry = { ...c.req.valid("json"), id: Date.now() };
  mutableFallback.releases.push(entry);
  return c.json(entry, 201);
});
adminRouter.put("/releases/:id", zValidator("json", releaseSchema.partial()), (c) => {
  const updated = updateById(mutableFallback.releases, Number(c.req.param("id")), c.req.valid("json"));
  return updated ? c.json(updated) : c.json({ error: "Not found" }, 404);
});
adminRouter.delete("/releases/:id", (c) => {
  const deleted = deleteById(mutableFallback.releases, Number(c.req.param("id")));
  return deleted ? c.json({ ok: true }) : c.json({ error: "Not found" }, 404);
});

adminRouter.get("/products", (c) => c.json(fallbackContent.products));
adminRouter.post("/products", zValidator("json", productSchema), (c) => {
  const entry = { ...c.req.valid("json"), id: Date.now() };
  mutableFallback.products.push(entry);
  return c.json(entry, 201);
});
adminRouter.put("/products/:id", zValidator("json", productSchema.partial()), (c) => {
  const updated = updateById(mutableFallback.products, Number(c.req.param("id")), c.req.valid("json"));
  return updated ? c.json(updated) : c.json({ error: "Not found" }, 404);
});
adminRouter.delete("/products/:id", (c) => {
  const deleted = deleteById(mutableFallback.products, Number(c.req.param("id")));
  return deleted ? c.json({ ok: true }) : c.json({ error: "Not found" }, 404);
});

adminRouter.get("/faq", (c) => c.json(fallbackContent.faq));
adminRouter.post("/faq", zValidator("json", faqSchema), (c) => {
  const entry = { ...c.req.valid("json"), id: Date.now() };
  mutableFallback.faq.push(entry);
  return c.json(entry, 201);
});
adminRouter.put("/faq/:id", zValidator("json", faqSchema.partial()), (c) => {
  const updated = updateById(mutableFallback.faq, Number(c.req.param("id")), c.req.valid("json"));
  return updated ? c.json(updated) : c.json({ error: "Not found" }, 404);
});
adminRouter.delete("/faq/:id", (c) => {
  const deleted = deleteById(mutableFallback.faq, Number(c.req.param("id")));
  return deleted ? c.json({ ok: true }) : c.json({ error: "Not found" }, 404);
});

adminRouter.get("/pages", (c) => c.json(fallbackContent.pages));
adminRouter.post("/pages", zValidator("json", pageSchema), (c) => {
  const entry = { ...c.req.valid("json"), id: Date.now() };
  mutableFallback.pages.push(entry);
  return c.json(entry, 201);
});
adminRouter.put("/pages/:id", zValidator("json", pageSchema.partial()), (c) => {
  const updated = updateById(mutableFallback.pages, Number(c.req.param("id")), c.req.valid("json"));
  return updated ? c.json(updated) : c.json({ error: "Not found" }, 404);
});
adminRouter.delete("/pages/:id", (c) => {
  const deleted = deleteById(mutableFallback.pages, Number(c.req.param("id")));
  return deleted ? c.json({ ok: true }) : c.json({ error: "Not found" }, 404);
});

adminRouter.get("/submissions", (c) => c.json(fallbackContent.submissions));

adminRouter.get("/users", async (c) => {
  const db = getDb(c.env);
  const rows = await db
    .select({
      id: users.id,
      email: users.email,
      username: users.username,
      accountType: users.accountType,
      role: users.role,
      createdAt: users.createdAt
    })
    .from(users)
    .orderBy(desc(users.createdAt));

  return c.json(rows);
});

adminRouter.get("/songs", async (c) => {
  const db = getDb(c.env);
  const rows = await db.select().from(songs).orderBy(desc(songs.createdAt));
  return c.json(rows);
});

adminRouter.post("/songs/:id/approve", async (c) => {
  const db = getDb(c.env);
  const updated = await db
    .update(songs)
    .set({
      approvedForRadio: true,
      updatedAt: new Date().toISOString()
    })
    .where(eq(songs.id, Number(c.req.param("id"))))
    .returning();

  return updated[0] ? c.json(updated[0]) : c.json({ error: "Not found" }, 404);
});

adminRouter.get("/favourites/stats", async (c) => {
  const db = getDb(c.env);
  const mostFavourited = await db
    .select({
      songId: songs.id,
      title: songs.title,
      artistName: songs.artistName,
      favouriteCount: count(favouriteSongs.id)
    })
    .from(songs)
    .leftJoin(favouriteSongs, eq(favouriteSongs.songId, songs.id))
    .groupBy(songs.id, songs.title, songs.artistName)
    .orderBy(desc(count(favouriteSongs.id)));

  const favouritesByUser = await db
    .select({
      userId: users.id,
      email: users.email,
      username: users.username,
      favouriteCount: count(favouriteSongs.id)
    })
    .from(users)
    .leftJoin(favouriteSongs, eq(favouriteSongs.userId, users.id))
    .groupBy(users.id, users.email, users.username)
    .orderBy(desc(count(favouriteSongs.id)));

  return c.json({
    mostFavourited,
    favouritesByUser
  });
});

adminRouter.post("/media", async (c) => {
  const form = await c.req.formData();
  const file = form.get("file");

  if (!(file instanceof File)) {
    return c.json({ error: "File required" }, 400);
  }

  const key = `${Date.now()}-${file.name}`;
  await c.env.MEDIA_BUCKET.put(key, await file.arrayBuffer(), {
    httpMetadata: { contentType: file.type }
  });

  const publicUrl = `${c.env.R2_PUBLIC_URL ?? ""}/${key}`;
  return c.json({ key, url: publicUrl });
});

adminRouter.get("/tracking", async (c) => {
  const db = getDb(c.env);
  const rows = await db.select().from(trackingItems).orderBy(desc(trackingItems.number));
  return c.json(rows);
});

adminRouter.post("/tracking", zValidator("json", trackingItemSchema), async (c) => {
  const db = getDb(c.env);
  const payload = c.req.valid("json");
  const [latest] = await db
    .select({ number: trackingItems.number })
    .from(trackingItems)
    .orderBy(desc(trackingItems.number))
    .limit(1);

  const entryNumber = payload.number ?? (latest?.number ?? 0) + 1;
  const created = await db
    .insert(trackingItems)
    .values({
      number: entryNumber,
      details: payload.details,
      status: payload.status
    })
    .returning();

  return c.json(created[0], 201);
});

adminRouter.put("/tracking/:id", zValidator("json", trackingItemSchema.partial()), async (c) => {
  const db = getDb(c.env);
  const payload = c.req.valid("json");
  const updated = await db
    .update(trackingItems)
    .set({
      ...(payload.number ? { number: payload.number } : {}),
      ...(payload.details ? { details: payload.details } : {}),
      ...(payload.status ? { status: payload.status } : {}),
      updatedAt: new Date().toISOString()
    })
    .where(eq(trackingItems.id, Number(c.req.param("id"))))
    .returning();

  return updated[0] ? c.json(updated[0]) : c.json({ error: "Not found" }, 404);
});
