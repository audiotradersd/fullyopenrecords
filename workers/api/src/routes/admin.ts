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
import { accountEmailNotifications, albums, artists, artistTiers, editorialSlotItems, editorialSlots, favouriteSongs, flowEvents, media, mediaJobs, photos, sessions, songs, trackingItems, users, videos } from "@fully-open-records/db/src/schema";
import { and, asc, count, desc, eq, inArray, isNotNull, isNull, like, ne, or } from "drizzle-orm";
import { Hono } from "hono";
import { getDb } from "../lib/db";
import { signAdminJwt } from "../lib/auth";
import { fallbackContent } from "../lib/content";
import { resolveArtistImage } from "../lib/artist-images";
import { requireAdmin } from "../middleware/auth";
import { sendAndRecordNewAccountNotification } from "../lib/account-notifications";
import type { AppVariables, Env } from "../types";

export const adminRouter = new Hono<{ Bindings: Env; Variables: AppVariables }>();

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);
}

function managedPublicMediaKey(url: string | null) {
  if (!url) return null;
  try {
    const path = new URL(url).pathname;
    return path.startsWith("/media/") ? decodeURIComponent(path.slice("/media/".length)) : null;
  } catch {
    return null;
  }
}

function encodedAudioKey(artistName: string, songId: number, title: string) {
  return `artists/${slugify(artistName) || `artist-${songId}`}/songs/audio/encoded/${songId}-${slugify(title) || "track"}.mp3`;
}

async function queueRadioUpload(db: ReturnType<typeof getDb>, song: typeof songs.$inferSelect) {
  const sourceKey = managedPublicMediaKey(song.audioUrl);
  if (!sourceKey) return { queued: false, error: "This track is not stored in Fully Open Records media." };
  const [existing] = await db.select({ id: mediaJobs.id }).from(mediaJobs)
    .where(and(eq(mediaJobs.songId, song.id), eq(mediaJobs.jobType, "radio_upload"), or(eq(mediaJobs.status, "queued"), eq(mediaJobs.status, "processing"))))
    .limit(1);
  if (existing) return { queued: true, duplicate: true };
  await db.insert(mediaJobs).values({ songId: song.id, jobType: "radio_upload", sourceBucket: "media", sourceKey });
  return { queued: true, duplicate: false };
}

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

adminRouter.get("/artist-tiers", async (c) => c.json(await getDb(c.env).select().from(artistTiers).orderBy(asc(artistTiers.id))));
adminRouter.post("/artist-tiers", async (c) => {
  const payload = await c.req.json<Record<string, unknown>>(); const slug = typeof payload.slug === "string" ? slugify(payload.slug) : "";
  if (!slug || typeof payload.name !== "string" || !payload.name.trim()) return c.json({ error: "A tier name and slug are required." }, 400);
  const limit = (key: string) => payload[key] === null ? null : Number.isInteger(payload[key]) && Number(payload[key]) >= 0 ? Number(payload[key]) : null;
  const [tier] = await getDb(c.env).insert(artistTiers).values({ slug, name: payload.name.trim(), trackLimit: limit("trackLimit"), albumLimit: limit("albumLimit"), photoLimit: limit("photoLimit"), videoLimit: limit("videoLimit"), radioTrackLimit: limit("radioTrackLimit") }).returning(); return c.json(tier, 201);
});
adminRouter.put("/artist-tiers/:id", async (c) => {
  const payload = await c.req.json<Record<string, unknown>>(); const limit = (key: string) => payload[key] === null ? null : Number.isInteger(payload[key]) && Number(payload[key]) >= 0 ? Number(payload[key]) : null;
  const [tier] = await getDb(c.env).update(artistTiers).set({ ...(typeof payload.name === "string" ? { name: payload.name.trim() } : {}), ...(payload.trackLimit !== undefined ? { trackLimit: limit("trackLimit") } : {}), ...(payload.albumLimit !== undefined ? { albumLimit: limit("albumLimit") } : {}), ...(payload.photoLimit !== undefined ? { photoLimit: limit("photoLimit") } : {}), ...(payload.videoLimit !== undefined ? { videoLimit: limit("videoLimit") } : {}), ...(payload.radioTrackLimit !== undefined ? { radioTrackLimit: limit("radioTrackLimit") } : {}), updatedAt: new Date().toISOString() }).where(eq(artistTiers.id, Number(c.req.param("id")))).returning(); return tier ? c.json(tier) : c.json({ error: "Tier not found." }, 404);
});

const homepageSlotRules = {
  home_featured_artists: { itemType: "artist", count: 4 },
  home_latest_releases: { itemType: "song", count: 3 },
  home_our_pick: { itemType: "mixed", count: 1 }
} as const;

adminRouter.get("/editorial/home", async (c) => {
  const db = getDb(c.env);
  const slotKeys = Object.keys(homepageSlotRules) as Array<keyof typeof homepageSlotRules>;
  const [slotRows, artistCandidates, songCandidates, imageMedia] = await Promise.all([
    db.select().from(editorialSlots).where(inArray(editorialSlots.slotKey, slotKeys)),
    db.select({ id: artists.id, name: artists.name, slug: artists.slug, bio: artists.bio, image: artists.profileImage, heroImage: artists.heroImage, genres: artists.genres }).from(artists).orderBy(asc(artists.name)),
    db.select({ id: songs.id, title: songs.title, artistName: songs.artistName, artistId: songs.artistId, artistBio: artists.bio, audioUrl: songs.audioUrl, image: songs.coverImage, artistImage: artists.profileImage, heroImage: artists.heroImage, artistSlug: artists.slug }).from(songs).leftJoin(artists, eq(songs.artistId, artists.id)).where(isNotNull(songs.audioUrl)).orderBy(desc(songs.id)),
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
      return [key, items.filter((item) => item.slotId === slot?.id).map((item) => ({ itemId: item.itemId, itemType: item.itemType, artistId: item.artistId, customTitle: item.customTitle ?? "", customSubtitle: item.customSubtitle ?? "", customDescription: item.customDescription ?? "", customImage: item.customImage ?? "" }))];
    }))
  });
});

adminRouter.put("/editorial/home/:slotKey", async (c) => {
  const slotKey = c.req.param("slotKey") as keyof typeof homepageSlotRules;
  const rule = homepageSlotRules[slotKey];
  if (!rule) return c.json({ error: "Unknown homepage slot" }, 404);
  const payload = await c.req.json<{ items?: Array<{ itemId?: unknown; itemType?: unknown; customTitle?: unknown; customSubtitle?: unknown; customDescription?: unknown; customImage?: unknown }> }>();
  if (!Array.isArray(payload.items) || payload.items.length !== rule.count) return c.json({ error: `Select exactly ${rule.count} ${rule.itemType === "artist" ? "artists" : "songs"}.` }, 400);
  const itemIds = payload.items.map((item) => Number(item.itemId));
  if (itemIds.some((id) => !Number.isInteger(id)) || new Set(itemIds).size !== itemIds.length) return c.json({ error: "Selections must be unique." }, 400);
  const db = getDb(c.env);
  const selectedType = rule.itemType === "mixed" ? payload.items[0]?.itemType : rule.itemType;
  if (selectedType !== "artist" && selectedType !== "song") return c.json({ error: "Choose an artist or a song." }, 400);
  const candidates = selectedType === "artist"
    ? await db.select({ id: artists.id, artistId: artists.id, slug: artists.slug, profileImage: artists.profileImage, heroImage: artists.heroImage }).from(artists).where(inArray(artists.id, itemIds))
    : await db.select({ id: songs.id, artistId: songs.artistId, coverImage: songs.coverImage, artistSlug: artists.slug, artistProfileImage: artists.profileImage, artistHeroImage: artists.heroImage }).from(songs).leftJoin(artists, eq(songs.artistId, artists.id)).where(inArray(songs.id, itemIds));
  if (candidates.length !== rule.count) return c.json({ error: "One or more selected items no longer exist." }, 400);
  let [slot] = await db.select().from(editorialSlots).where(eq(editorialSlots.slotKey, slotKey)).limit(1);
  if (!slot) [slot] = await db.insert(editorialSlots).values({ slotKey, title: slotKey, active: true }).returning();
  await db.delete(editorialSlotItems).where(eq(editorialSlotItems.slotId, slot.id));
  await db.insert(editorialSlotItems).values(payload.items.map((item, sortOrder) => {
    const candidate: any = candidates.find((entry) => entry.id === itemIds[sortOrder]);
    const suppliedImage = typeof item.customImage === "string" && item.customImage.trim() ? item.customImage.trim() : "";
    const defaultImage = candidate && selectedType === "artist"
      ? resolveArtistImage(candidate.slug, candidate.profileImage, candidate.heroImage)
      : candidate && rule.itemType === "song"
        ? candidate.coverImage || resolveArtistImage(candidate.artistSlug, candidate.artistProfileImage, candidate.artistHeroImage)
        : "";
    return { slotId: slot.id, itemType: selectedType, itemId: itemIds[sortOrder], artistId: candidate?.artistId ?? (selectedType === "artist" ? candidate?.id ?? null : null), sortOrder, customTitle: typeof item.customTitle === "string" && item.customTitle.trim() ? item.customTitle.trim() : null, customSubtitle: typeof item.customSubtitle === "string" && item.customSubtitle.trim() ? item.customSubtitle.trim() : null, customDescription: typeof item.customDescription === "string" && item.customDescription.trim() ? item.customDescription.trim() : null, customImage: suppliedImage || defaultImage || null, active: true };
  }));
  return c.json({ ok: true });
});

adminRouter.get("/editorial/artists", async (c) => {
  const db = getDb(c.env);
  const [songRows, slots, imageMedia] = await Promise.all([
    db.select({ id: songs.id, title: songs.title, artistId: songs.artistId, artistName: songs.artistName, audioUrl: songs.audioUrl, artistSlug: artists.slug, genres: artists.genres, image: artists.profileImage, heroImage: artists.heroImage }).from(songs).leftJoin(artists, eq(songs.artistId, artists.id)).where(isNotNull(songs.audioUrl)).orderBy(asc(songs.artistName), asc(songs.title)),
    db.select().from(editorialSlots).where(inArray(editorialSlots.slotKey, ["artists_hero", "artists_grid"])),
    db.select({ id: media.id, fileName: media.fileName, url: media.url }).from(media).where(like(media.mimeType, "image/%")).orderBy(desc(media.id)).limit(150)
  ]);
  const ids = slots.map((slot) => slot.id); const selected = ids.length ? await db.select().from(editorialSlotItems).where(inArray(editorialSlotItems.slotId, ids)).orderBy(asc(editorialSlotItems.sortOrder)) : [];
  return c.json({ songs: songRows.map((song) => ({ ...song, image: resolveArtistImage(song.artistSlug, song.image, song.heroImage) })), images: imageMedia, hero: selected.find((item) => item.slotId === slots.find((slot) => slot.slotKey === "artists_hero")?.id) ?? null, artists: selected.filter((item) => item.slotId === slots.find((slot) => slot.slotKey === "artists_grid")?.id) });
});

adminRouter.put("/editorial/artists/:slotKey", async (c) => {
  try {
  const key = c.req.param("slotKey"); if (key !== "artists_hero" && key !== "artists_grid") return c.json({ error: "Unknown artists slot." }, 404);
  const payload = await c.req.json<{ items?: Array<Record<string, unknown>> }>(); const items = payload.items ?? [];
  if ((key === "artists_hero" && items.length !== 1) || (key === "artists_grid" && (items.length < 6 || items.length > 30))) return c.json({ error: key === "artists_hero" ? "Choose one hero artist track." : "Choose between 6 and 30 artists." }, 400);
  const ids = items.map((item) => Number(item.itemId)); if (ids.some((id) => !Number.isInteger(id)) || new Set(ids).size !== ids.length) return c.json({ error: "Selections must be unique." }, 400);
  const db = getDb(c.env);
  let [slot] = await db.select().from(editorialSlots).where(eq(editorialSlots.slotKey, key)).limit(1); if (!slot) [slot] = await db.insert(editorialSlots).values({ slotKey: key, title: key, active: true }).returning();
  await db.delete(editorialSlotItems).where(eq(editorialSlotItems.slotId, slot.id));
  const rows = items.map((item, sortOrder) => ({ slotId: slot.id, itemType: "song" as const, itemId: ids[sortOrder], artistId: null, sortOrder, customTitle: typeof item.customTitle === "string" ? item.customTitle : null, customSubtitle: typeof item.customSubtitle === "string" ? item.customSubtitle : null, customDescription: typeof item.customDescription === "string" ? item.customDescription : null, customImage: typeof item.customImage === "string" ? item.customImage : null, customHref: typeof item.customHref === "string" ? item.customHref : null, active: true }));
  // D1 limits the number of bound SQL variables in a single statement. Each row
  // has eleven values, so inserting the full 6–30 item grid at once can exceed it.
  const insertBatchSize = 8;
  for (let start = 0; start < rows.length; start += insertBatchSize) {
    await db.insert(editorialSlotItems).values(rows.slice(start, start + insertBatchSize));
  }
  return c.json({ ok: true });
  } catch (error) {
    console.error("artists editorial save failed", error);
    return c.json({ error: error instanceof Error ? error.message : "Could not save artists editorial selections." }, 500);
  }
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
      artistId: artists.id,
      artistName: artists.name,
      artistSlug: artists.slug,
      artistPlan: artists.plan,
      accountNotificationStatus: accountEmailNotifications.status,
      accountNotificationSentAt: accountEmailNotifications.sentAt
    })
    .from(users)
    .leftJoin(artists, eq(artists.userId, users.id))
    .leftJoin(accountEmailNotifications, and(eq(accountEmailNotifications.userId, users.id), eq(accountEmailNotifications.notificationType, "new_account_created")))
    .orderBy(desc(users.createdAt));

  const artistIds = rows.flatMap((row) => row.artistId === null ? [] : [row.artistId]);
  const [trackCounts, albumCounts, photoCounts, videoCounts] = artistIds.length ? await Promise.all([
    db.select({ artistId: songs.artistId, total: count() }).from(songs).where(inArray(songs.artistId, artistIds)).groupBy(songs.artistId),
    db.select({ artistId: albums.artistId, total: count() }).from(albums).where(inArray(albums.artistId, artistIds)).groupBy(albums.artistId),
    db.select({ artistId: photos.artistId, total: count() }).from(photos).where(inArray(photos.artistId, artistIds)).groupBy(photos.artistId),
    db.select({ artistId: videos.artistId, total: count() }).from(videos).where(inArray(videos.artistId, artistIds)).groupBy(videos.artistId)
  ]) : [[], [], [], []];
  const usage = (counts: Array<{ artistId: number | null; total: number }>) => new Map(counts.flatMap((row) => row.artistId === null ? [] : [[row.artistId, Number(row.total)]]));
  const tracksByArtist = usage(trackCounts);
  const albumsByArtist = usage(albumCounts);
  const photosByArtist = usage(photoCounts);
  const videosByArtist = usage(videoCounts);

  return c.json(rows.map(({ artistId, ...row }) => ({
    ...row,
    trackCount: artistId === null ? 0 : tracksByArtist.get(artistId) ?? 0,
    albumCount: artistId === null ? 0 : albumsByArtist.get(artistId) ?? 0,
    photoCount: artistId === null ? 0 : photosByArtist.get(artistId) ?? 0,
    videoCount: artistId === null ? 0 : videosByArtist.get(artistId) ?? 0
  })));
});

// Sends at most 25 unsent account notifications per request. The dashboard
// repeats this endpoint until it reports no remaining records.
adminRouter.post("/account-notifications/backfill", async (c) => {
  const db = getDb(c.env);
  const pending = await db
    .select({ user: users, artist: artists })
    .from(users)
    .leftJoin(artists, eq(artists.userId, users.id))
    .leftJoin(accountEmailNotifications, and(eq(accountEmailNotifications.userId, users.id), eq(accountEmailNotifications.notificationType, "new_account_created")))
    .where(and(eq(users.active, true), or(isNull(accountEmailNotifications.id), ne(accountEmailNotifications.status, "sent"))))
    .orderBy(asc(users.id))
    .limit(25);

  let sent = 0;
  let failed = 0;
  for (const row of pending) {
    const result = await sendAndRecordNewAccountNotification(c.env, {
      userId: row.user.id,
      email: row.user.email,
      username: row.user.username,
      accountType: row.user.accountType === "artist" ? "artist" : "listener",
      artist: row.artist ? { name: row.artist.name, slug: row.artist.slug } : undefined
    });
    if (result.ok) sent += 1; else failed += 1;
  }
  return c.json({ attempted: pending.length, sent, failed, hasMore: pending.length === 25 });
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
  const songId = Number(c.req.param("id"));
  const [song] = await db.select().from(songs).where(eq(songs.id, songId)).limit(1);
  if (!song) return c.json({ error: "Not found" }, 404);
  if (payload.enabled && !song.audioUrl) return c.json({ error: "This track is still processing and cannot be sent to radio yet." }, 409);
  const updated = await db
    .update(songs)
    .set({ approvedForRadio: payload.enabled, updatedAt: new Date().toISOString() })
    .where(eq(songs.id, songId))
    .returning();

  const radioUpload = payload.enabled && updated[0] ? await queueRadioUpload(db, updated[0]) : null;
  if (radioUpload && !radioUpload.queued) return c.json({ error: radioUpload.error }, 409);
  return updated[0] ? c.json({ ...updated[0], radioUploadQueued: Boolean(radioUpload?.queued) }) : c.json({ error: "Not found" }, 404);
});

// Queues every existing public media object for archival and 128 kbps encoding.
// It is idempotent: songs already linked to a private master are skipped.
adminRouter.post("/media/backfill", async (c) => {
  const db = getDb(c.env);
  const candidates = await db.select().from(songs).where(and(isNotNull(songs.audioUrl), isNull(songs.masterKey)));
  let queued = 0;
  let skipped = 0;
  const now = new Date().toISOString();
  for (const song of candidates) {
    const sourceKey = managedPublicMediaKey(song.audioUrl);
    if (!sourceKey) { skipped += 1; continue; }
    const masterKey = `archive/legacy/${song.id}/${sourceKey}`;
    await db.update(songs).set({ masterKey, processingStatus: "queued", updatedAt: now }).where(eq(songs.id, song.id));
    await db.insert(mediaJobs).values({
      songId: song.id,
      jobType: "encode",
      sourceBucket: "media",
      sourceKey,
      masterKey,
      outputKey: encodedAudioKey(song.artistName, song.id, song.title)
    });
    queued += 1;
  }
  return c.json({ queued, skipped, total: candidates.length });
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
