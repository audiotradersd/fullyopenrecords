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
import { artists, editorialSlotItems, editorialSlots, favouriteSongs, flowEvents, media, sessions, songs, trackingItems, users } from "@fully-open-records/db/src/schema";
import { asc, count, desc, eq, inArray, isNotNull, like } from "drizzle-orm";
import { Hono } from "hono";
import { getDb } from "../lib/db";
import { signAdminJwt } from "../lib/auth";
import { fallbackContent } from "../lib/content";
import { resolveArtistImage } from "../lib/artist-images";
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

const homepageSlotRules = {
  home_featured_artists: { itemType: "artist", count: 4 },
  home_latest_releases: { itemType: "song", count: 3 }
} as const;

adminRouter.get("/editorial/home", async (c) => {
  const db = getDb(c.env);
  const slotKeys = Object.keys(homepageSlotRules) as Array<keyof typeof homepageSlotRules>;
  const [slotRows, artistCandidates, songCandidates, imageMedia] = await Promise.all([
    db.select().from(editorialSlots).where(inArray(editorialSlots.slotKey, slotKeys)),
    db.select({ id: artists.id, name: artists.name, slug: artists.slug, image: artists.profileImage, heroImage: artists.heroImage, genres: artists.genres }).from(artists).orderBy(asc(artists.name)),
    db.select({ id: songs.id, title: songs.title, artistName: songs.artistName, artistId: songs.artistId, audioUrl: songs.audioUrl, image: songs.coverImage, artistImage: artists.profileImage, heroImage: artists.heroImage, artistSlug: artists.slug }).from(songs).leftJoin(artists, eq(songs.artistId, artists.id)).where(isNotNull(songs.audioUrl)).orderBy(desc(songs.id)),
    db.select({ id: media.id, fileName: media.fileName, url: media.url }).from(media).where(like(media.mimeType, "image/%")).orderBy(desc(media.id)).limit(150)
  ]);
  const slotIds = slotRows.map((slot) => slot.id);
  const items = slotIds.length ? await db.select().from(editorialSlotItems).where(inArray(editorialSlotItems.slotId, slotIds)).orderBy(asc(editorialSlotItems.sortOrder)) : [];
  return c.json({
    artists: artistCandidates.map((artist) => ({ ...artist, image: resolveArtistImage(artist.slug, artist.image, artist.heroImage) })),
    songs: songCandidates.map((song) => ({ ...song, image: song.image || resolveArtistImage(song.artistSlug, song.artistImage, song.heroImage) })),
    images: imageMedia,
    slots: Object.fromEntries(slotKeys.map((key) => {
      const slot = slotRows.find((entry) => entry.slotKey === key);
      return [key, items.filter((item) => item.slotId === slot?.id).map((item) => ({ itemId: item.itemId, artistId: item.artistId, customImage: item.customImage ?? "" }))];
    }))
  });
});

adminRouter.put("/editorial/home/:slotKey", async (c) => {
  const slotKey = c.req.param("slotKey") as keyof typeof homepageSlotRules;
  const rule = homepageSlotRules[slotKey];
  if (!rule) return c.json({ error: "Unknown homepage slot" }, 404);
  const payload = await c.req.json<{ items?: Array<{ itemId?: unknown; customImage?: unknown }> }>();
  if (!Array.isArray(payload.items) || payload.items.length !== rule.count) return c.json({ error: `Select exactly ${rule.count} ${rule.itemType === "artist" ? "artists" : "songs"}.` }, 400);
  const itemIds = payload.items.map((item) => Number(item.itemId));
  if (itemIds.some((id) => !Number.isInteger(id)) || new Set(itemIds).size !== itemIds.length) return c.json({ error: "Selections must be unique." }, 400);
  const db = getDb(c.env);
  const candidates = rule.itemType === "artist"
    ? await db.select({ id: artists.id, artistId: artists.id, slug: artists.slug, profileImage: artists.profileImage, heroImage: artists.heroImage }).from(artists).where(inArray(artists.id, itemIds))
    : await db.select({ id: songs.id, artistId: songs.artistId, coverImage: songs.coverImage, artistSlug: artists.slug, artistProfileImage: artists.profileImage, artistHeroImage: artists.heroImage }).from(songs).leftJoin(artists, eq(songs.artistId, artists.id)).where(inArray(songs.id, itemIds));
  if (candidates.length !== rule.count) return c.json({ error: "One or more selected items no longer exist." }, 400);
  let [slot] = await db.select().from(editorialSlots).where(eq(editorialSlots.slotKey, slotKey)).limit(1);
  if (!slot) [slot] = await db.insert(editorialSlots).values({ slotKey, title: slotKey, active: true }).returning();
  await db.delete(editorialSlotItems).where(eq(editorialSlotItems.slotId, slot.id));
  await db.insert(editorialSlotItems).values(payload.items.map((item, sortOrder) => {
    const candidate: any = candidates.find((entry) => entry.id === itemIds[sortOrder]);
    const suppliedImage = typeof item.customImage === "string" && item.customImage.trim() ? item.customImage.trim() : "";
    const defaultImage = candidate && rule.itemType === "artist"
      ? resolveArtistImage(candidate.slug, candidate.profileImage, candidate.heroImage)
      : candidate && rule.itemType === "song"
        ? candidate.coverImage || resolveArtistImage(candidate.artistSlug, candidate.artistProfileImage, candidate.artistHeroImage)
        : "";
    return { slotId: slot.id, itemType: rule.itemType, itemId: itemIds[sortOrder], artistId: candidate?.artistId ?? null, sortOrder, customImage: suppliedImage || defaultImage || null, active: true };
  }));
  return c.json({ ok: true });
});

adminRouter.get("/editorial/artists", async (c) => {
  const db = getDb(c.env);
  const [songRows, slots] = await Promise.all([
    db.select({ id: songs.id, title: songs.title, artistId: songs.artistId, artistName: songs.artistName, audioUrl: songs.audioUrl, artistSlug: artists.slug, image: artists.profileImage, heroImage: artists.heroImage }).from(songs).leftJoin(artists, eq(songs.artistId, artists.id)).where(isNotNull(songs.audioUrl)).orderBy(asc(songs.artistName), asc(songs.title)),
    db.select().from(editorialSlots).where(inArray(editorialSlots.slotKey, ["artists_hero", "artists_grid"]))
  ]);
  const ids = slots.map((slot) => slot.id); const selected = ids.length ? await db.select().from(editorialSlotItems).where(inArray(editorialSlotItems.slotId, ids)).orderBy(asc(editorialSlotItems.sortOrder)) : [];
  return c.json({ songs: songRows.map((song) => ({ ...song, image: resolveArtistImage(song.artistSlug, song.image, song.heroImage) })), hero: selected.find((item) => item.slotId === slots.find((slot) => slot.slotKey === "artists_hero")?.id) ?? null, artists: selected.filter((item) => item.slotId === slots.find((slot) => slot.slotKey === "artists_grid")?.id) });
});

adminRouter.put("/editorial/artists/:slotKey", async (c) => {
  const key = c.req.param("slotKey"); if (key !== "artists_hero" && key !== "artists_grid") return c.json({ error: "Unknown artists slot." }, 404);
  const payload = await c.req.json<{ items?: Array<Record<string, unknown>> }>(); const items = payload.items ?? [];
  if ((key === "artists_hero" && items.length !== 1) || (key === "artists_grid" && (items.length < 6 || items.length > 30))) return c.json({ error: key === "artists_hero" ? "Choose one hero artist track." : "Choose between 6 and 30 artists." }, 400);
  const ids = items.map((item) => Number(item.itemId)); if (ids.some((id) => !Number.isInteger(id)) || new Set(ids).size !== ids.length) return c.json({ error: "Selections must be unique." }, 400);
  const db = getDb(c.env); const selectedSongs = await db.select({ id: songs.id, artistId: songs.artistId }).from(songs).where(inArray(songs.id, ids));
  if (selectedSongs.length !== ids.length) return c.json({ error: "One or more selected tracks no longer exist." }, 400);
  let [slot] = await db.select().from(editorialSlots).where(eq(editorialSlots.slotKey, key)).limit(1); if (!slot) [slot] = await db.insert(editorialSlots).values({ slotKey: key, title: key, active: true }).returning();
  await db.delete(editorialSlotItems).where(eq(editorialSlotItems.slotId, slot.id));
  await db.insert(editorialSlotItems).values(items.map((item, sortOrder) => { const song = selectedSongs.find((entry) => entry.id === ids[sortOrder]); return { slotId: slot.id, itemType: "song", itemId: ids[sortOrder], artistId: song?.artistId ?? null, sortOrder, customTitle: typeof item.customTitle === "string" ? item.customTitle : null, customSubtitle: typeof item.customSubtitle === "string" ? item.customSubtitle : null, customDescription: typeof item.customDescription === "string" ? item.customDescription : null, customImage: typeof item.customImage === "string" ? item.customImage : null, customHref: typeof item.customHref === "string" ? item.customHref : null, active: true }; }));
  return c.json({ ok: true });
});

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
      active: users.active,
      createdAt: users.createdAt,
      artistName: artists.name,
      artistSlug: artists.slug,
      artistPlan: artists.plan
    })
    .from(users)
    .leftJoin(artists, eq(artists.userId, users.id))
    .orderBy(desc(users.createdAt));

  return c.json(rows);
});

adminRouter.put("/users/:id/active", async (c) => {
  const payload = await c.req.json<{ active?: unknown }>();
  if (typeof payload.active !== "boolean") return c.json({ error: "Active status must be true or false" }, 400);
  const db = getDb(c.env);
  const userId = Number(c.req.param("id"));
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user) return c.json({ error: "Account not found" }, 404);
  if (user.role === "admin" || user.email === c.env.ADMIN_EMAIL) return c.json({ error: "The administrator account cannot be changed here" }, 403);
  const updated = await db.update(users).set({ active: payload.active, updatedAt: new Date().toISOString() }).where(eq(users.id, userId)).returning();
  if (!payload.active) await db.delete(sessions).where(eq(sessions.userId, userId));
  return c.json(updated[0]);
});

adminRouter.put("/users/:id/plan", async (c) => {
  const payload = await c.req.json<{ plan?: unknown }>();
  if (payload.plan !== "free" && payload.plan !== "paid") return c.json({ error: "Plan must be free or paid" }, 400);
  const db = getDb(c.env);
  const updated = await db.update(artists).set({ plan: payload.plan, updatedAt: new Date().toISOString() }).where(eq(artists.userId, Number(c.req.param("id")))).returning();
  return updated[0] ? c.json(updated[0]) : c.json({ error: "Artist account not found" }, 404);
});

adminRouter.delete("/users/:id", async (c) => {
  const db = getDb(c.env);
  const userId = Number(c.req.param("id"));
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user) return c.json({ error: "Account not found" }, 404);
  if (user.role === "admin" || user.email === c.env.ADMIN_EMAIL) return c.json({ error: "The administrator account cannot be deleted here" }, 403);
  const linkedArtists = await db.select({ id: artists.id, slug: artists.slug }).from(artists).where(eq(artists.userId, userId));
  await db.delete(flowEvents).where(eq(flowEvents.userId, userId));
  for (const artist of linkedArtists) {
    const prefix = `artists/${artist.slug}/`;
    let cursor: string | undefined;
    do {
      const listed = await c.env.MEDIA_BUCKET.list({ prefix, cursor });
      if (listed.objects.length) await c.env.MEDIA_BUCKET.delete(listed.objects.map((object) => object.key));
      cursor = listed.truncated ? listed.cursor : undefined;
    } while (cursor);
    await db.delete(media).where(like(media.r2Key, `${prefix}%`));
    await db.delete(flowEvents).where(eq(flowEvents.artistId, artist.id));
  }
  await db.delete(artists).where(eq(artists.userId, userId));
  await db.delete(users).where(eq(users.id, userId));
  return c.json({ ok: true });
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

adminRouter.put("/songs/:id/radio", async (c) => {
  const payload = await c.req.json<{ enabled?: unknown }>();

  if (typeof payload.enabled !== "boolean") {
    return c.json({ error: "Radio status must be true or false" }, 400);
  }

  const db = getDb(c.env);
  const updated = await db
    .update(songs)
    .set({ approvedForRadio: payload.enabled, updatedAt: new Date().toISOString() })
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

  const key = `editorial/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
  await c.env.MEDIA_BUCKET.put(key, await file.arrayBuffer(), {
    httpMetadata: { contentType: file.type }
  });

  const publicUrl = `${c.env.R2_PUBLIC_URL || new URL(c.req.url).origin}/media/${key}`;
  const db = getDb(c.env);
  await db.insert(media).values({ fileName: file.name, mimeType: file.type || "application/octet-stream", url: publicUrl, r2Key: key });
  return c.json({ key, url: publicUrl }, 201);
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
