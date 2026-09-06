import { zValidator } from "@hono/zod-validator";
import {
  albumSchema,
  artistProfileSchema,
  checkoutSchema,
  contactSchema,
  currentRadioFavouriteSchema,
  favouriteSongSchema,
  gigSchema,
  loginSchema,
  photoSchema,
  pressSchema,
  registerSchema,
  songSchema,
  submissionSchema,
  trackVersionCreateSchema,
  trackVersionUpdateSchema,
  videoSchema
} from "@fully-open-records/api/src/contracts";
import {
  albums,
  artists,
  contacts,
  faqItems,
  favouriteSongs,
  gigs,
  media,
  pages,
  pressItems,
  products,
  photos,
  radioHistory,
  releases,
  sessions,
  submissions,
  songs,
  trackVersionPhotos,
  trackVersions,
  users,
  videos
} from "@fully-open-records/db/src/schema";
import { and, asc, count, desc, eq, gt, inArray, isNull, lt, or, sql } from "drizzle-orm";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { Hono } from "hono";
import { fallbackContent } from "../lib/content";
import { generateRandomToken, hashPassword, hashSessionToken, SESSION_COOKIE_NAME, SESSION_MAX_AGE_SECONDS, verifyPassword } from "../lib/auth";
import { getDb } from "../lib/db";
import { logFlowEvent } from "../lib/events";
import { getRadioStatus } from "../lib/radio";
import { getStripe } from "../lib/stripe";
import { rateLimit } from "../middleware/rate-limit";
import { optionalUser, requireArtist, requireUser } from "../middleware/auth";
import type { AppVariables, Env } from "../types";

export const publicRouter = new Hono<{ Bindings: Env; Variables: AppVariables }>();

const FREE_PLAN_LIMITS = {
  songs: 5,
  photos: 10,
  videos: 3,
  radioTracks: 1
} as const;

const NUMBERED_VERSION_TYPES = new Set([
  "Demo", "Rehearsal", "Live Recording", "Home Recording", "Studio Recording", "Rough Mix", "Mix", "Master"
]);

function versionLabel(versionType: string, versionNumber: number | null) {
  return versionNumber ? `${versionType} ${versionNumber}` : versionType;
}

const mutableFallback = fallbackContent as {
  submissions: Array<Record<string, unknown>>;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function reserveLegacySlug(value: string, id: number) {
  const base = slugify(value) || "artist";
  return `${base}-legacy-${id}`.slice(0, 60);
}

async function generateUniqueArtistSlug(
  db: ReturnType<typeof getDb>,
  baseValue: string,
  excludeArtistId?: number
) {
  const baseSlug = slugify(baseValue) || "artist";
  let candidateSlug = baseSlug;
  let suffix = 1;

  while (true) {
    const existing = await db
      .select({ id: artists.id })
      .from(artists)
      .where(
        excludeArtistId !== undefined
          ? and(eq(artists.slug, candidateSlug), sql`${artists.id} != ${excludeArtistId}`)
          : eq(artists.slug, candidateSlug)
      )
      .limit(1);

    if (!existing.length) {
      return candidateSlug;
    }

    suffix += 1;
    candidateSlug = `${baseSlug}-${suffix}`.slice(0, 60);
  }
}

function getCookieOptions(c: { env: Env }) {
  return {
    httpOnly: true,
    sameSite: "Strict" as const,
    secure: c.env.SITE_URL.startsWith("https://"),
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS
  };
}

async function createSession(c: Parameters<typeof setCookie>[0], userId: number) {
  const db = getDb(c.env);
  const now = new Date().toISOString();
  await db.delete(sessions).where(lt(sessions.expiresAt, now));
  await db.delete(sessions).where(eq(sessions.userId, userId));
  const token = generateRandomToken();
  const tokenHash = await hashSessionToken(token);
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_SECONDS * 1000).toISOString();

  await db.insert(sessions).values({
    userId,
    tokenHash,
    expiresAt
  });

  setCookie(c, SESSION_COOKIE_NAME, token, getCookieOptions(c));
  return token;
}

async function destroySession(c: Parameters<typeof setCookie>[0]) {
  const token = getCookie(c, SESSION_COOKIE_NAME);

  if (token) {
    const db = getDb(c.env);
    const tokenHash = await hashSessionToken(token);
    await db.delete(sessions).where(eq(sessions.tokenHash, tokenHash));
  }

  deleteCookie(c, SESSION_COOKIE_NAME, {
    path: "/"
  });
}

async function getArtistUsage(db: ReturnType<typeof getDb>, artistId: number) {
  const [songCountResult] = await db
    .select({ total: count() })
    .from(songs)
    .where(and(eq(songs.artistId, artistId), eq(songs.enabled, true)));
  const [photoCountResult] = await db.select({ total: count() }).from(photos).where(eq(photos.artistId, artistId));
  const [videoCountResult] = await db.select({ total: count() }).from(videos).where(eq(videos.artistId, artistId));
  const [radioSelectedResult] = await db
    .select({ total: count() })
    .from(songs)
    .where(and(eq(songs.artistId, artistId), eq(songs.radioSelected, true)));

  return {
    songs: songCountResult?.total ?? 0,
    photos: photoCountResult?.total ?? 0,
    videos: videoCountResult?.total ?? 0,
    radioTracks: radioSelectedResult?.total ?? 0
  };
}

function limitsExceeded(current: number, limit: number) {
  return current >= limit;
}

function isFreePlanArtist(artist: typeof artists.$inferSelect) {
  return artist.plan === "free" && !artist.adminOverride;
}

function getArtistLimits(artist: typeof artists.$inferSelect) {
  return isFreePlanArtist(artist) ? FREE_PLAN_LIMITS : { songs: null, photos: null, videos: null, radioTracks: null };
}

function songOrderBy() {
  return [
    asc(sql`CASE WHEN ${songs.albumId} IS NULL THEN 1 ELSE 0 END`),
    asc(songs.albumId),
    asc(sql`COALESCE(${songs.trackNumber}, 9999)`),
    asc(songs.title),
    desc(songs.createdAt)
  ] as const;
}

async function normalizeFreePlanActiveTracks(
  db: ReturnType<typeof getDb>,
  artist: typeof artists.$inferSelect,
  existingSongs?: Array<typeof songs.$inferSelect>
) {
  const orderedSongs =
    existingSongs ??
    (await db
      .select()
      .from(songs)
      .where(eq(songs.artistId, artist.id))
      .orderBy(...songOrderBy()));

  if (!isFreePlanArtist(artist)) {
    return orderedSongs;
  }

  const enabledSongs = orderedSongs.filter((song) => song.enabled);
  if (enabledSongs.length <= FREE_PLAN_LIMITS.songs) {
    return orderedSongs;
  }

  const idsToDisable = enabledSongs.slice(FREE_PLAN_LIMITS.songs).map((song) => song.id);
  if (idsToDisable.length) {
    await db
      .update(songs)
      .set({
        enabled: false,
        updatedAt: new Date().toISOString()
      })
      .where(and(eq(songs.artistId, artist.id), inArray(songs.id, idsToDisable)));
  }

  const disabledIdSet = new Set(idsToDisable);
  return orderedSongs.map((song) =>
    disabledIdSet.has(song.id)
      ? {
          ...song,
          enabled: false
        }
      : song
  );
}

function mapArtistRecord(artist: typeof artists.$inferSelect) {
  return {
    ...artist,
    profileImage: artist.profileImage ?? artist.heroImage,
    bannerImage: artist.bannerImage ?? artist.heroImage,
    galleryImages: artist.galleryImages ?? [],
    socialLinks: artist.socialLinks ?? {},
    genres: artist.genres ?? []
  };
}

function mapReleaseRecord(release: typeof releases.$inferSelect) {
  return {
    ...release,
    streamingLinks: release.streamingLinks ?? {},
    trackSnapshot: release.trackSnapshot ?? [],
    mediaSnapshot: release.mediaSnapshot ?? []
  };
}

function mapProductRecord(product: typeof products.$inferSelect) {
  return {
    ...product,
    images: product.images ?? [],
    variants: product.variants ?? []
  };
}

function mapPageRecord(page: typeof pages.$inferSelect) {
  return {
    ...page,
    blocks: page.blocks ?? []
  };
}

function mapAlbumRecord(album: typeof albums.$inferSelect) {
  return {
    ...album
  };
}

function mapGigRecord(gig: typeof gigs.$inferSelect) {
  return {
    ...gig
  };
}

function mapPressRecord(item: typeof pressItems.$inferSelect) {
  return {
    ...item,
    date: item.pressDate
  };
}

function getManagedMediaKey(url: string | null | undefined, requestUrl: string) {
  if (!url) return null;

  try {
    const parsed = new URL(url, requestUrl);
    const requestOrigin = new URL(requestUrl).origin;

    if (parsed.origin !== requestOrigin) {
      return null;
    }

    if (parsed.pathname.startsWith("/media/")) {
      return decodeURIComponent(parsed.pathname.replace(/^\/media\//, ""));
    }

    if (parsed.pathname.startsWith("/api/media/")) {
      return decodeURIComponent(parsed.pathname.replace(/^\/api\/media\//, ""));
    }
  } catch {
    return null;
  }

  return null;
}

async function uploadMediaObject(
  c: Parameters<typeof setCookie>[0],
  file: File,
  prefix: string,
  alt = ""
) {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]+/g, "-");
  const key = `${prefix}/${Date.now()}-${safeName}`;
  const contentType = file.type || "application/octet-stream";

  await c.env.MEDIA_BUCKET.put(key, await file.arrayBuffer(), {
    httpMetadata: { contentType }
  });

  const url = `${new URL(c.req.url).origin}/media/${key}`;
  const db = getDb(c.env);

  try {
    await db.insert(media).values({
      fileName: file.name,
      alt,
      mimeType: contentType,
      url,
      r2Key: key
    });
  } catch (error) {
    console.error("media metadata insert failed", error);
  }

  return { key, url };
}

publicRouter.get("/artists", async (c) => {
  const db = getDb(c.env);
  const rows = await db
    .select({ artist: artists })
    .from(artists)
    .leftJoin(users, eq(artists.userId, users.id))
    .where(or(isNull(artists.userId), eq(users.active, true)))
    .orderBy(desc(artists.featured), artists.name);
  await logFlowEvent(c.env, c.req.raw, "artists.list.view", { meta: { count: rows.length } });
  return c.json(rows.length ? rows.map(({ artist }) => mapArtistRecord(artist)) : fallbackContent.artists);
});

publicRouter.get("/artists/:slug", async (c) => {
  const db = getDb(c.env);
  const [record] = await db
    .select({ artist: artists, active: users.active })
    .from(artists)
    .leftJoin(users, eq(artists.userId, users.id))
    .where(eq(artists.slug, c.req.param("slug")))
    .limit(1);
  const artist = record?.artist;

  if (artist && (artist.userId === null || record.active)) {
    await logFlowEvent(c.env, c.req.raw, "artist.profile.view", {
      artistId: artist.id,
      meta: { slug: artist.slug }
    });
    return c.json(mapArtistRecord(artist));
  }

  if (artist) return c.json({ error: "Not found" }, 404);

  const fallbackArtist = fallbackContent.artists.find((entry) => entry.slug === c.req.param("slug"));
  return fallbackArtist ? c.json(fallbackArtist) : c.json({ error: "Not found" }, 404);
});

publicRouter.get("/artists/:slug/content", async (c) => {
  const db = getDb(c.env);
  const [record] = await db
    .select({ artist: artists, active: users.active })
    .from(artists)
    .leftJoin(users, eq(artists.userId, users.id))
    .where(eq(artists.slug, c.req.param("slug")))
    .limit(1);
  const artist = record?.artist;

  if (!artist || (artist.userId !== null && !record?.active)) {
    return c.json({
      albums: [],
      tracks: [],
      photos: [],
      videos: [],
      gigs: [],
      press: []
    });
  }

  const [artistAlbums, fetchedTracks, artistVideos, artistPhotos, artistGigs, artistPress, artistTrackVersions] = await Promise.all([
    db.select().from(albums).where(eq(albums.artistId, artist.id)).orderBy(desc(albums.releaseDate), desc(albums.createdAt)),
    db.select().from(songs).where(eq(songs.artistId, artist.id)).orderBy(...songOrderBy()),
    db.select().from(videos).where(eq(videos.artistId, artist.id)).orderBy(desc(videos.createdAt)),
    db.select().from(photos).where(eq(photos.artistId, artist.id)).orderBy(desc(photos.createdAt)),
    db.select().from(gigs).where(eq(gigs.artistId, artist.id)).orderBy(gigs.eventDate),
    db.select().from(pressItems).where(eq(pressItems.artistId, artist.id)).orderBy(desc(pressItems.pressDate), desc(pressItems.createdAt)),
    db.select({ version: trackVersions, songId: songs.id }).from(trackVersions).innerJoin(songs, eq(trackVersions.songId, songs.id)).where(eq(songs.artistId, artist.id)).orderBy(asc(trackVersions.recordedAt), asc(trackVersions.createdAt), asc(trackVersions.id))
  ]);
  const artistTracks = await normalizeFreePlanActiveTracks(db, artist, fetchedTracks);
  const versionIds = artistTrackVersions.map(({ version }) => version.id);
  const versionPhotos = versionIds.length ? await db.select().from(trackVersionPhotos).where(inArray(trackVersionPhotos.trackVersionId, versionIds)).orderBy(asc(trackVersionPhotos.sortOrder), asc(trackVersionPhotos.id)) : [];
  const photosByVersion = new Map<number, typeof versionPhotos>();
  for (const photo of versionPhotos) photosByVersion.set(photo.trackVersionId, [...(photosByVersion.get(photo.trackVersionId) ?? []), photo]);

  return c.json({
    albums: artistAlbums.map(mapAlbumRecord),
    tracks: artistTracks,
    photos: artistPhotos,
    videos: artistVideos,
    gigs: artistGigs.map(mapGigRecord),
    press: artistPress.map(mapPressRecord),
    trackVersions: artistTrackVersions.map(({ version }) => ({ ...version, label: versionLabel(version.versionType, version.versionNumber), photos: photosByVersion.get(version.id) ?? [] }))
  });
});

publicRouter.get("/releases", async (c) => {
  const db = getDb(c.env);
  const rows = await db
    .select()
    .from(releases)
    .where(eq(releases.published, true))
    .orderBy(desc(releases.releaseDate));
  await logFlowEvent(c.env, c.req.raw, "releases.list.view", { meta: { count: rows.length } });
  return c.json(rows.map(mapReleaseRecord));
});

publicRouter.get("/releases/:slug", async (c) => {
  const db = getDb(c.env);
  const [release] = await db
    .select()
    .from(releases)
    .where(and(eq(releases.slug, c.req.param("slug")), eq(releases.published, true)))
    .limit(1);

  if (!release) return c.json({ error: "Not found" }, 404);
  await logFlowEvent(c.env, c.req.raw, "release.view", { meta: { slug: release.slug } });
  return c.json(mapReleaseRecord(release));
});

publicRouter.get("/products", async (c) => {
  const db = getDb(c.env);
  const rows = await db.select().from(products).orderBy(desc(products.featured), products.title);
  await logFlowEvent(c.env, c.req.raw, "products.list.view", { meta: { count: rows.length } });
  return c.json(rows.length ? rows.map(mapProductRecord) : fallbackContent.products);
});

publicRouter.get("/products/:slug", async (c) => {
  const db = getDb(c.env);
  const rows = await db.select().from(products).where(eq(products.slug, c.req.param("slug"))).limit(1);
  const product = rows[0];
  if (product) {
    await logFlowEvent(c.env, c.req.raw, "product.view", {
      meta: { slug: product.slug, productId: product.id }
    });
    return c.json(mapProductRecord(product));
  }

  const fallbackProduct = fallbackContent.products.find((entry) => entry.slug === c.req.param("slug"));
  return fallbackProduct ? c.json(fallbackProduct) : c.json({ error: "Not found" }, 404);
});

publicRouter.get("/faq", async (c) => {
  const db = getDb(c.env);
  const rows = await db.select().from(faqItems).orderBy(faqItems.order);
  return c.json(rows.length ? rows : fallbackContent.faq);
});

publicRouter.get("/pages/:slug", async (c) => {
  const db = getDb(c.env);
  const rows = await db.select().from(pages).where(eq(pages.slug, c.req.param("slug"))).limit(1);
  const page = rows[0];
  if (page) {
    await logFlowEvent(c.env, c.req.raw, "page.view", {
      meta: { slug: page.slug, pageId: page.id }
    });
    return c.json(mapPageRecord(page));
  }

  const fallbackPage = fallbackContent.pages.find((entry) => entry.slug === c.req.param("slug"));
  return fallbackPage ? c.json(fallbackPage) : c.json({ error: "Not found" }, 404);
});

async function serveMediaObject(c: Parameters<typeof setCookie>[0]) {
  const key = c.req.path.replace(/^\/media\//, "");
  if (!key) {
    return c.json({ error: "Not found" }, 404);
  }

  const rangeHeader = c.req.header("range");
  const object = await c.env.MEDIA_BUCKET.get(
    key,
    rangeHeader ? { range: c.req.raw.headers } : undefined
  );

  if (!object) {
    return c.json({ error: "Not found" }, 404);
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);
  headers.set("accept-ranges", "bytes");
  headers.set("cache-control", "public, max-age=31536000, immutable");

  if (object.range) {
    const offset = object.range.offset ?? 0;
    const length = object.range.length ?? object.size;
    const end = offset + Math.max(length - 1, 0);
    headers.set("content-range", `bytes ${offset}-${end}/${object.size}`);
    headers.set("content-length", length.toString());
  } else {
    headers.set("content-length", object.size.toString());
  }

  return new Response(c.req.method === "HEAD" ? null : object.body, {
    status: object.range ? 206 : 200,
    headers
  });
}

publicRouter.on(["GET", "HEAD"], "/media/*", serveMediaObject);

publicRouter.post("/auth/register", rateLimit, zValidator("json", registerSchema), async (c) => {
  try {
    const payload = c.req.valid("json");
    const db = getDb(c.env);

    const existing = await db
      .select({ id: users.id, email: users.email, username: users.username })
      .from(users)
      .where(sql`${users.email} = ${payload.email} OR ${users.username} = ${payload.username}`)
      .limit(1);

    if (existing.length) {
      const conflictReasons = [];
      const existingRow = existing[0];
      const providedEmail = payload.email.toLowerCase();
      const providedUsername = payload.username.toLowerCase();
      const existingEmail = (existingRow.email ?? "").toLowerCase();
      const existingUsername = (existingRow.username ?? "").toLowerCase();

      if (existingEmail === providedEmail) {
        conflictReasons.push("email");
      }

      if (existingUsername === providedUsername) {
        conflictReasons.push("username");
      }

      const errorMessage =
        conflictReasons.length === 2
          ? "Email and username already in use"
          : conflictReasons[0] === "email"
            ? "Email already in use"
            : "Username already in use";

      await logFlowEvent(c.env, c.req.raw, "auth.register.rejected", {
        meta: {
          reason: "duplicate",
          email: payload.email,
          accountType: payload.accountType
        }
      });

      return c.json({ error: errorMessage }, 400);
    }

    const { hash, salt } = await hashPassword(payload.password);
    const created = await db
      .insert(users)
      .values({
        email: payload.email,
        username: payload.username,
        passwordHash: hash,
        passwordSalt: salt,
        accountType: payload.accountType
      })
      .returning({
        id: users.id,
        email: users.email,
        username: users.username,
        accountType: users.accountType,
        role: users.role
      });

    const user = created[0];

    if (payload.accountType === "artist") {
      const candidateSlug = await generateUniqueArtistSlug(db, payload.username || `artist-${user.id}`);

      await db.insert(artists).values({
        userId: user.id,
        name: payload.username,
        slug: candidateSlug,
        bio: "New artist profile coming soon.",
        heroImage: "",
        profileImage: "",
        bannerImage: "",
        location: ""
      });
    }

    const sessionToken = await createSession(c, user.id);

    const [artist] = await db
      .select({ id: artists.id, slug: artists.slug })
      .from(artists)
      .where(eq(artists.userId, user.id))
      .limit(1);

    return c.json({
      sessionToken,
      user: {
        ...user,
        artistId: artist?.id ?? null,
        artistSlug: artist?.slug ?? null
      }
    });
  } catch (error) {
    console.error("auth.register failed", error);
    return c.json(
      {
        error: "Registration failed"
      },
      500
    );
  }
});

publicRouter.post("/auth/login", rateLimit, zValidator("json", loginSchema), async (c) => {
  const payload = c.req.valid("json");
  const db = getDb(c.env);
  const results = await db
    .select()
    .from(users)
    .where(eq(users.email, payload.email))
    .limit(1);

  const user = results[0];
  if (!user || !user.active) {
    await logFlowEvent(c.env, c.req.raw, "auth.login.rejected", {
      meta: { reason: "invalid_credentials", email: payload.email }
    });
    return c.json({ error: "Invalid credentials" }, 401);
  }

  const isValid = await verifyPassword(payload.password, user.passwordSalt, user.passwordHash);
  if (!isValid) {
    await logFlowEvent(c.env, c.req.raw, "auth.login.rejected", {
      meta: { reason: "invalid_password", email: payload.email }
    });
    return c.json({ error: "Invalid credentials" }, 401);
  }

  const sessionToken = await createSession(c, user.id);

  const [artist] = await db
    .select({ id: artists.id, slug: artists.slug })
    .from(artists)
    .where(eq(artists.userId, user.id))
    .limit(1);

  return c.json({
    sessionToken,
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      accountType: user.accountType,
      role: user.role,
      artistId: artist?.id ?? null,
      artistSlug: artist?.slug ?? null
    }
  });
});

publicRouter.post("/auth/logout", async (c) => {
  const user = c.get("user");
  await destroySession(c);
  await logFlowEvent(c.env, c.req.raw, "auth.logout", { user: user ?? null });
  return c.json({ ok: true });
});

publicRouter.get("/auth/session", optionalUser, (c) => {
  const user = c.get("user");
  return c.json({ user: user ?? null });
});

publicRouter.get("/account/favourites", requireUser, async (c) => {
  const db = getDb(c.env);
  const user = c.get("user");
  const rows = await db
    .select({
      id: songs.id,
      title: songs.title,
      artistName: songs.artistName,
      coverImage: songs.coverImage,
      audioUrl: songs.audioUrl,
      createdAt: favouriteSongs.createdAt
    })
    .from(favouriteSongs)
    .innerJoin(songs, eq(favouriteSongs.songId, songs.id))
    .where(eq(favouriteSongs.userId, user.id))
    .orderBy(desc(favouriteSongs.createdAt));

  return c.json(rows);
});

publicRouter.post(
  "/account/favourites",
  requireUser,
  zValidator("json", favouriteSongSchema),
  async (c) => {
    const db = getDb(c.env);
    const user = c.get("user");
    const payload = c.req.valid("json");

    const [song] = await db.select({ id: songs.id }).from(songs).where(eq(songs.id, payload.songId)).limit(1);
    if (!song) {
      return c.json({ error: "Song not found" }, 404);
    }

    try {
      await db.insert(favouriteSongs).values({
        userId: user.id,
        songId: payload.songId
      });
    } catch {
      await logFlowEvent(c.env, c.req.raw, "song.favourite.duplicate", {
        user,
        meta: { songId: payload.songId }
      });
      return c.json({ ok: true, alreadyFavourited: true });
    }

    await logFlowEvent(c.env, c.req.raw, "song.favourite.created", {
      user,
      meta: { songId: payload.songId }
    });
    return c.json({ ok: true });
  }
);

publicRouter.post(
  "/account/favourites/current",
  requireUser,
  zValidator("json", currentRadioFavouriteSchema),
  async (c) => {
    try {
      const db = getDb(c.env);
      const user = c.get("user");
      const payload = c.req.valid("json");

      const existing = await db
        .select({ id: songs.id })
        .from(songs)
        .where(and(eq(songs.title, payload.title), eq(songs.artistName, payload.artistName)))
        .limit(1);

      let songId = existing[0]?.id;

      if (!songId) {
        const created = await db
          .insert(songs)
          .values({
            artistName: payload.artistName,
            title: payload.title,
            slug: slugify(`${payload.artistName}-${payload.title}`),
            audioUrl: null,
            duration: payload.duration ?? null,
            coverImage: payload.coverImage ?? null
          })
          .returning({ id: songs.id });
        songId = created[0].id;
      }

      try {
        await db.insert(favouriteSongs).values({
          userId: user.id,
          songId
        });
      } catch {
        try {
          await logFlowEvent(c.env, c.req.raw, "radio.favourite.duplicate", {
            user,
            meta: { songId, title: payload.title, artistName: payload.artistName }
          });
        } catch (error) {
          console.error("radio favourite duplicate log failed", error);
        }
        return c.json({ ok: true, alreadyFavourited: true, songId });
      }

      try {
        await logFlowEvent(c.env, c.req.raw, "radio.favourite.created", {
          user,
          meta: { songId, title: payload.title, artistName: payload.artistName }
        });
      } catch (error) {
        console.error("radio favourite created log failed", error);
      }

      return c.json({ ok: true, songId });
    } catch (error) {
      console.error("radio favourite save failed", error);
      return c.json({ error: "Could not save favourite." }, 500);
    }
  }
);

publicRouter.delete("/account/favourites/:songId", requireUser, async (c) => {
  const db = getDb(c.env);
  const user = c.get("user");
  await db
    .delete(favouriteSongs)
    .where(and(eq(favouriteSongs.userId, user.id), eq(favouriteSongs.songId, Number(c.req.param("songId")))));
  await logFlowEvent(c.env, c.req.raw, "song.favourite.deleted", {
    user,
    meta: { songId: Number(c.req.param("songId")) }
  });
  return c.json({ ok: true });
});

publicRouter.get("/artist/me", requireArtist, async (c) => {
  const db = getDb(c.env);
  const user = c.get("user");
  const [artist] = await db.select().from(artists).where(eq(artists.userId, user.id)).limit(1);

  if (!artist) {
    return c.json({ error: "Artist profile not found" }, 404);
  }

  await normalizeFreePlanActiveTracks(db, artist);
  const usage = await getArtistUsage(db, artist.id);
  return c.json({
    artist: mapArtistRecord(artist),
    usage,
    limits: getArtistLimits(artist)
  });
});

publicRouter.put(
  "/artist/me",
  requireArtist,
  zValidator("json", artistProfileSchema),
  async (c) => {
    const db = getDb(c.env);
    const user = c.get("user");
    const payload = c.req.valid("json");

    const [currentArtist] = await db.select().from(artists).where(eq(artists.userId, user.id)).limit(1);
    if (!currentArtist) {
      return c.json({ error: "Artist profile not found" }, 404);
    }

    let normalizedSlug = await generateUniqueArtistSlug(db, payload.slug || payload.name, currentArtist.id);
    const normalizedName = slugify(payload.name);

    if (normalizedSlug !== currentArtist.slug) {
      const conflict = await db
        .select({ id: artists.id, userId: artists.userId, name: artists.name, slug: artists.slug })
        .from(artists)
        .where(and(eq(artists.slug, normalizedSlug), sql`${artists.id} != ${currentArtist.id}`))
        .limit(1);

      if (conflict.length) {
        const targetArtist = conflict[0];
        const canClaimExistingArtist =
          targetArtist.userId == null && slugify(targetArtist.name) === normalizedName;

        if (!canClaimExistingArtist) {
          normalizedSlug = await generateUniqueArtistSlug(db, payload.slug || payload.name, currentArtist.id);
          if (normalizedSlug === currentArtist.slug) {
            return c.json({ error: "Slug already in use" }, 409);
          }
          const updated = await db
            .update(artists)
            .set({
              name: payload.name,
              slug: normalizedSlug,
              bio: payload.bio,
              heroImage: payload.heroImage,
              profileImage: payload.profileImage || payload.heroImage,
              bannerImage: payload.bannerImage || payload.heroImage,
              location: payload.location,
              socialLinks: payload.socialLinks,
              embeddedPlayer: payload.embeddedPlayer ?? null,
              galleryImages: payload.galleryImages,
              genres: payload.genres,
              updatedAt: new Date().toISOString()
            })
            .where(eq(artists.id, currentArtist.id))
            .returning();

          await logFlowEvent(c.env, c.req.raw, "artist.profile.updated", {
            user,
            artistId: currentArtist.id,
            meta: { slug: normalizedSlug }
          });
          return c.json({ artist: mapArtistRecord(updated[0]) });
        }

        await db
          .update(artists)
          .set({
            userId: null,
            slug: reserveLegacySlug(currentArtist.slug || currentArtist.name, currentArtist.id),
            updatedAt: new Date().toISOString()
          })
          .where(eq(artists.id, currentArtist.id));

        const claimed = await db
          .update(artists)
          .set({
            userId: user.id,
            name: payload.name,
            slug: normalizedSlug,
            bio: payload.bio,
            heroImage: payload.heroImage,
            profileImage: payload.profileImage || payload.heroImage,
            bannerImage: payload.bannerImage || payload.heroImage,
            location: payload.location,
            socialLinks: payload.socialLinks,
            embeddedPlayer: payload.embeddedPlayer ?? null,
            galleryImages: payload.galleryImages,
            genres: payload.genres,
            updatedAt: new Date().toISOString()
          })
          .where(eq(artists.id, targetArtist.id))
          .returning();

        await logFlowEvent(c.env, c.req.raw, "artist.profile.claimed", {
          user,
          artistId: targetArtist.id,
          meta: { slug: normalizedSlug, previousArtistId: currentArtist.id }
        });

        return c.json({ artist: mapArtistRecord(claimed[0]) });
      }
    }

    const updated = await db
      .update(artists)
      .set({
        name: payload.name,
        slug: normalizedSlug,
        bio: payload.bio,
        heroImage: payload.heroImage,
        profileImage: payload.profileImage || payload.heroImage,
        bannerImage: payload.bannerImage || payload.heroImage,
        location: payload.location,
        socialLinks: payload.socialLinks,
        embeddedPlayer: payload.embeddedPlayer ?? null,
        galleryImages: payload.galleryImages,
        genres: payload.genres,
        updatedAt: new Date().toISOString()
      })
      .where(eq(artists.id, currentArtist.id))
      .returning();

    await logFlowEvent(c.env, c.req.raw, "artist.profile.updated", {
      user,
      artistId: currentArtist.id,
      meta: { slug: normalizedSlug }
    });
    return c.json({ artist: mapArtistRecord(updated[0]) });
  }
);

publicRouter.get("/artist/me/content", requireArtist, async (c) => {
  try {
    const db = getDb(c.env);
    const user = c.get("user");
    const [artist] = await db.select().from(artists).where(eq(artists.userId, user.id)).limit(1);

    if (!artist) {
      return c.json({ error: "Artist profile not found" }, 404);
    }

    const [artistAlbums, fetchedSongs, artistVideos, artistPhotos, artistGigs, artistPress] = await Promise.all([
      db.select().from(albums).where(eq(albums.artistId, artist.id)).orderBy(desc(albums.releaseDate), desc(albums.createdAt)),
      db.select().from(songs).where(eq(songs.artistId, artist.id)).orderBy(...songOrderBy()),
      db.select().from(videos).where(eq(videos.artistId, artist.id)).orderBy(desc(videos.createdAt)),
      db.select().from(photos).where(eq(photos.artistId, artist.id)).orderBy(desc(photos.createdAt)),
      db.select().from(gigs).where(eq(gigs.artistId, artist.id)).orderBy(desc(gigs.eventDate), desc(gigs.createdAt)),
      db.select().from(pressItems).where(eq(pressItems.artistId, artist.id)).orderBy(desc(pressItems.pressDate), desc(pressItems.createdAt))
    ]);
    const artistSongs = await normalizeFreePlanActiveTracks(db, artist, fetchedSongs);
    const usage = await getArtistUsage(db, artist.id);

    return c.json({
      albums: artistAlbums.map(mapAlbumRecord),
      songs: artistSongs,
      videos: artistVideos,
      photos: artistPhotos,
      gigs: artistGigs.map(mapGigRecord),
      press: artistPress.map(mapPressRecord),
      usage,
      limits: getArtistLimits(artist)
    });
  } catch (error) {
    console.error("artist content route failed", error);
    return c.json({ error: "Could not load artist content." }, 500);
  }
});

publicRouter.post("/artist/me/albums", requireArtist, zValidator("json", albumSchema), async (c) => {
  const db = getDb(c.env);
  const user = c.get("user");
  const payload = c.req.valid("json");
  const [artist] = await db.select().from(artists).where(eq(artists.userId, user.id)).limit(1);

  if (!artist) {
    return c.json({ error: "Artist profile not found" }, 404);
  }

  const created = await db
    .insert(albums)
    .values({
      artistId: artist.id,
      title: payload.title,
      releaseDate: payload.releaseDate ?? null,
      description: payload.description ?? null,
      coverArt: payload.coverArt ?? null
    })
    .returning();

  await logFlowEvent(c.env, c.req.raw, "artist.album.created", {
    user,
    artistId: artist.id,
    meta: { albumId: created[0].id, title: payload.title }
  });

  return c.json({ album: mapAlbumRecord(created[0]) }, 201);
});

publicRouter.put("/artist/me/albums/:id", requireArtist, zValidator("json", albumSchema.partial()), async (c) => {
  const db = getDb(c.env);
  const user = c.get("user");
  const payload = c.req.valid("json");
  const albumId = Number(c.req.param("id"));
  const [artist] = await db.select().from(artists).where(eq(artists.userId, user.id)).limit(1);

  if (!artist) {
    return c.json({ error: "Artist profile not found" }, 404);
  }

  const [existingAlbum] = await db
    .select()
    .from(albums)
    .where(and(eq(albums.id, albumId), eq(albums.artistId, artist.id)))
    .limit(1);

  if (!existingAlbum) {
    return c.json({ error: "Album not found" }, 404);
  }

  const updated = await db
    .update(albums)
    .set({
      ...(payload.title !== undefined ? { title: payload.title } : {}),
      ...(payload.releaseDate !== undefined ? { releaseDate: payload.releaseDate ?? null } : {}),
      ...(payload.description !== undefined ? { description: payload.description ?? null } : {}),
      ...(payload.coverArt !== undefined ? { coverArt: payload.coverArt ?? null } : {}),
      updatedAt: new Date().toISOString()
    })
    .where(eq(albums.id, albumId))
    .returning();

  await logFlowEvent(c.env, c.req.raw, "artist.album.updated", {
    user,
    artistId: artist.id,
    meta: { albumId, title: payload.title ?? existingAlbum.title }
  });

  return c.json({ album: mapAlbumRecord(updated[0]) });
});

publicRouter.post("/artist/me/songs", requireArtist, zValidator("json", songSchema), async (c) => {
  const db = getDb(c.env);
  const user = c.get("user");
  const payload = c.req.valid("json");
  const [artist] = await db.select().from(artists).where(eq(artists.userId, user.id)).limit(1);

  if (!artist) {
    return c.json({ error: "Artist profile not found" }, 404);
  }

  const usage = await getArtistUsage(db, artist.id);

  if (isFreePlanArtist(artist) && payload.radioSelected && limitsExceeded(usage.radioTracks, FREE_PLAN_LIMITS.radioTracks)) {
    await logFlowEvent(c.env, c.req.raw, "artist.song.create.rejected", {
      user,
      artistId: artist.id,
      meta: { reason: "radio_track_limit", title: payload.title }
    });
    return c.json({ error: "Free plan allows only one radio-selected track" }, 403);
  }

  let enabled = payload.enabled;
  let warning: string | undefined;

  if (isFreePlanArtist(artist) && payload.enabled && limitsExceeded(usage.songs, FREE_PLAN_LIMITS.songs)) {
    enabled = false;
    warning = "Free plan allows only 5 active tracks. This track was uploaded as inactive.";
  }

  const created = await db
    .insert(songs)
    .values({
      artistId: artist.id,
      artistName: artist.name,
      trackNumber: payload.trackNumber ?? null,
      title: payload.title,
      slug: slugify(`${artist.name}-${payload.title}`),
      audioUrl: payload.audioUrl ?? null,
      duration: payload.duration ?? null,
      coverImage: payload.coverImage ?? null,
      albumId: payload.albumId ?? null,
      description: payload.description ?? null,
      enabled,
      isRadioEligible: payload.isRadioEligible,
      radioSelected: payload.radioSelected
    })
    .returning();

  await logFlowEvent(c.env, c.req.raw, "artist.song.created", {
    user,
    artistId: artist.id,
    meta: { songId: created[0].id, title: payload.title, radioSelected: payload.radioSelected, enabled }
  });
  return c.json({ song: created[0], warning }, 201);
});

publicRouter.put("/artist/me/songs/:id", requireArtist, zValidator("json", songSchema.partial()), async (c) => {
  const db = getDb(c.env);
  const user = c.get("user");
  const payload = c.req.valid("json");
  const songId = Number(c.req.param("id"));
  const [artist] = await db.select().from(artists).where(eq(artists.userId, user.id)).limit(1);

  if (!artist) {
    return c.json({ error: "Artist profile not found" }, 404);
  }

  const [existingSong] = await db
    .select()
    .from(songs)
    .where(and(eq(songs.id, songId), eq(songs.artistId, artist.id)))
    .limit(1);

  if (!existingSong) {
    return c.json({ error: "Track not found" }, 404);
  }

  if (isFreePlanArtist(artist) && payload.radioSelected === true && !existingSong.radioSelected) {
    const usage = await getArtistUsage(db, artist.id);
    if (limitsExceeded(usage.radioTracks, FREE_PLAN_LIMITS.radioTracks)) {
      await logFlowEvent(c.env, c.req.raw, "artist.song.update.rejected", {
        user,
        artistId: artist.id,
        meta: { reason: "radio_track_limit", songId }
      });
      return c.json({ error: "Free plan allows only one radio-selected track" }, 403);
    }
  }

  let enabled = payload.enabled;
  let warning: string | undefined;

  if (isFreePlanArtist(artist) && payload.enabled === true && !existingSong.enabled) {
    const usage = await getArtistUsage(db, artist.id);
    if (limitsExceeded(usage.songs, FREE_PLAN_LIMITS.songs)) {
      enabled = false;
      warning = "Free plan allows only 5 active tracks. Disable another track before enabling this one.";
    }
  }

  const updated = await db
    .update(songs)
    .set({
      ...(payload.title !== undefined ? { title: payload.title } : {}),
      ...(payload.trackNumber !== undefined ? { trackNumber: payload.trackNumber ?? null } : {}),
      ...(payload.audioUrl !== undefined ? { audioUrl: payload.audioUrl ?? null } : {}),
      ...(payload.duration !== undefined ? { duration: payload.duration ?? null } : {}),
      ...(payload.coverImage !== undefined ? { coverImage: payload.coverImage ?? null } : {}),
      ...(payload.albumId !== undefined ? { albumId: payload.albumId ?? null } : {}),
      ...(payload.description !== undefined ? { description: payload.description ?? null } : {}),
      ...(payload.enabled !== undefined ? { enabled } : {}),
      ...(payload.isRadioEligible !== undefined ? { isRadioEligible: payload.isRadioEligible } : {}),
      ...(payload.radioSelected !== undefined ? { radioSelected: payload.radioSelected } : {}),
      ...(payload.title !== undefined ? { slug: slugify(`${artist.name}-${payload.title}`) } : {}),
      updatedAt: new Date().toISOString()
    })
    .where(eq(songs.id, songId))
    .returning();

  await logFlowEvent(c.env, c.req.raw, "artist.song.updated", {
    user,
    artistId: artist.id,
    meta: { songId, albumId: payload.albumId ?? existingSong.albumId ?? null, enabled: enabled ?? existingSong.enabled }
  });

  return c.json({ song: updated[0], warning });
});

publicRouter.delete("/artist/me/songs/:id", requireArtist, async (c) => {
  const db = getDb(c.env);
  const user = c.get("user");
  const songId = Number(c.req.param("id"));
  const [artist] = await db.select().from(artists).where(eq(artists.userId, user.id)).limit(1);

  if (!artist) {
    return c.json({ error: "Artist profile not found" }, 404);
  }

  const [existingSong] = await db
    .select()
    .from(songs)
    .where(and(eq(songs.id, songId), eq(songs.artistId, artist.id)))
    .limit(1);

  if (!existingSong) {
    return c.json({ error: "Track not found" }, 404);
  }

  const managedKeys = [existingSong.audioUrl, existingSong.coverImage]
    .map((value) => getManagedMediaKey(value, c.req.url))
    .filter((value): value is string => Boolean(value));

  for (const key of managedKeys) {
    try {
      await c.env.MEDIA_BUCKET.delete(key);
    } catch (error) {
      console.error("song media delete failed", { key, error });
    }
  }

  if (managedKeys.length) {
    await db.delete(media).where(sql`${media.r2Key} in (${sql.join(managedKeys.map((key) => sql`${key}`), sql`, `)})`);
  }

  await db.delete(favouriteSongs).where(eq(favouriteSongs.songId, songId));
  await db.delete(songs).where(eq(songs.id, songId));

  await logFlowEvent(c.env, c.req.raw, "artist.song.deleted", {
    user,
    artistId: artist.id,
    meta: { songId, title: existingSong.title }
  });

  return c.json({ success: true, deletedId: songId });
});

publicRouter.post("/artist/me/gigs", requireArtist, zValidator("json", gigSchema), async (c) => {
  const db = getDb(c.env);
  const user = c.get("user");
  const payload = c.req.valid("json");
  const [artist] = await db.select().from(artists).where(eq(artists.userId, user.id)).limit(1);

  if (!artist) {
    return c.json({ error: "Artist profile not found" }, 404);
  }

  const created = await db
    .insert(gigs)
    .values({
      artistId: artist.id,
      title: payload.title,
      venue: payload.venue ?? null,
      city: payload.city ?? null,
      eventDate: payload.eventDate,
      ticketUrl: payload.ticketUrl ?? null,
      description: payload.description ?? null
    })
    .returning();

  await logFlowEvent(c.env, c.req.raw, "artist.gig.created", {
    user,
    artistId: artist.id,
    meta: { gigId: created[0].id, title: payload.title }
  });

  return c.json({ gig: mapGigRecord(created[0]) }, 201);
});

publicRouter.post("/artist/me/videos", requireArtist, zValidator("json", videoSchema), async (c) => {
  const db = getDb(c.env);
  const user = c.get("user");
  const payload = c.req.valid("json");
  const [artist] = await db.select().from(artists).where(eq(artists.userId, user.id)).limit(1);

  if (!artist) {
    return c.json({ error: "Artist profile not found" }, 404);
  }

  const usage = await getArtistUsage(db, artist.id);
  if (artist.plan === "free" && !artist.adminOverride && limitsExceeded(usage.videos, FREE_PLAN_LIMITS.videos)) {
    return c.json({ error: "Free plan video upload limit reached" }, 403);
  }

  const created = await db
    .insert(videos)
    .values({
      artistId: artist.id,
      title: payload.title,
      videoUrl: payload.videoUrl,
      thumbnailUrl: payload.thumbnailUrl ?? null
    })
    .returning();

  await logFlowEvent(c.env, c.req.raw, "artist.video.created", {
    user,
    artistId: artist.id,
    meta: { videoId: created[0].id, title: payload.title }
  });
  return c.json({ video: created[0] }, 201);
});

publicRouter.post("/artist/me/photos", requireArtist, zValidator("json", photoSchema), async (c) => {
  const db = getDb(c.env);
  const user = c.get("user");
  const payload = c.req.valid("json");
  const [artist] = await db.select().from(artists).where(eq(artists.userId, user.id)).limit(1);

  if (!artist) {
    return c.json({ error: "Artist profile not found" }, 404);
  }

  const usage = await getArtistUsage(db, artist.id);
  if (artist.plan === "free" && !artist.adminOverride && limitsExceeded(usage.photos, FREE_PLAN_LIMITS.photos)) {
    return c.json({ error: "Free plan photo upload limit reached" }, 403);
  }

  const created = await db
    .insert(photos)
    .values({
      artistId: artist.id,
      imageUrl: payload.imageUrl,
      alt: payload.alt
    })
    .returning();

  await logFlowEvent(c.env, c.req.raw, "artist.photo.created", {
    user,
    artistId: artist.id,
    meta: { photoId: created[0].id }
  });
  return c.json({ photo: created[0] }, 201);
});

publicRouter.post("/artist/me/press", requireArtist, zValidator("json", pressSchema), async (c) => {
  const db = getDb(c.env);
  const user = c.get("user");
  const payload = c.req.valid("json");
  const [artist] = await db.select().from(artists).where(eq(artists.userId, user.id)).limit(1);

  if (!artist) {
    return c.json({ error: "Artist profile not found" }, 404);
  }

  const created = await db
    .insert(pressItems)
    .values({
      artistId: artist.id,
      title: payload.title,
      publication: payload.publication,
      pressDate: payload.date ?? null,
      articleLink: payload.articleLink ?? null,
      excerpt: payload.excerpt ?? null,
      featureImage: payload.featureImage ?? null
    })
    .returning();

  await logFlowEvent(c.env, c.req.raw, "artist.press.created", {
    user,
    artistId: artist.id,
    meta: { pressId: created[0].id, title: payload.title }
  });

  return c.json({ press: mapPressRecord(created[0]) }, 201);
});

publicRouter.post("/artist/me/track-versions", requireArtist, zValidator("json", trackVersionCreateSchema), async (c) => {
  const db = getDb(c.env);
  const user = c.get("user");
  const payload = c.req.valid("json");
  const [artist] = await db.select().from(artists).where(eq(artists.userId, user.id)).limit(1);
  if (!artist) return c.json({ error: "Artist profile not found" }, 404);
  const [song] = await db.select().from(songs).where(and(eq(songs.id, payload.songId), eq(songs.artistId, artist.id))).limit(1);
  if (!song) return c.json({ error: "Track not found" }, 404);

  let versionNumber: number | null = null;
  if (NUMBERED_VERSION_TYPES.has(payload.versionType)) {
    const existing = await db.select({ number: trackVersions.versionNumber }).from(trackVersions)
      .where(and(eq(trackVersions.songId, song.id), eq(trackVersions.versionType, payload.versionType)))
      .orderBy(desc(trackVersions.versionNumber)).limit(1);
    versionNumber = (existing[0]?.number ?? 0) + 1;
  }

  const created = await db.insert(trackVersions).values({
    songId: song.id, versionType: payload.versionType, versionNumber, audioUrl: payload.audioUrl,
    duration: payload.duration ?? null, notes: payload.notes ?? null, recordedAt: payload.recordedAt ?? null, uploadedBy: user.id,
    updatedAt: new Date().toISOString()
  }).returning();
  const version = created[0];
  if (payload.photoUrls.length) await db.insert(trackVersionPhotos).values(payload.photoUrls.map((imageUrl, sortOrder) => ({ trackVersionId: version.id, imageUrl, sortOrder })));
  if (payload.versionType === "Final Master") {
    await db.update(songs).set({ audioUrl: payload.audioUrl, duration: payload.duration ?? null, updatedAt: new Date().toISOString() }).where(eq(songs.id, song.id));
  }
  await logFlowEvent(c.env, c.req.raw, "artist.track_version.created", { user, artistId: artist.id, meta: { songId: song.id, versionId: version.id, label: versionLabel(version.versionType, version.versionNumber) } });
  return c.json({ version: { ...version, label: versionLabel(version.versionType, version.versionNumber), photos: payload.photoUrls.map((imageUrl, sortOrder) => ({ imageUrl, sortOrder })) } }, 201);
});

publicRouter.put("/artist/me/track-versions/:id", requireArtist, zValidator("json", trackVersionUpdateSchema), async (c) => {
  const db = getDb(c.env); const user = c.get("user"); const payload = c.req.valid("json"); const versionId = Number(c.req.param("id"));
  const [artist] = await db.select().from(artists).where(eq(artists.userId, user.id)).limit(1);
  if (!artist) return c.json({ error: "Artist profile not found" }, 404);
  const [version] = await db.select({ version: trackVersions }).from(trackVersions).innerJoin(songs, eq(trackVersions.songId, songs.id)).where(and(eq(trackVersions.id, versionId), eq(songs.artistId, artist.id))).limit(1);
  if (!version) return c.json({ error: "Track version not found" }, 404);
  const updated = await db.update(trackVersions).set({ ...(payload.versionType !== undefined ? { versionType: payload.versionType } : {}), ...(payload.notes !== undefined ? { notes: payload.notes } : {}), ...(payload.recordedAt !== undefined ? { recordedAt: payload.recordedAt } : {}), updatedAt: new Date().toISOString() }).where(eq(trackVersions.id, versionId)).returning();
  if (payload.photoUrls !== undefined) { await db.delete(trackVersionPhotos).where(eq(trackVersionPhotos.trackVersionId, versionId)); if (payload.photoUrls.length) await db.insert(trackVersionPhotos).values(payload.photoUrls.map((imageUrl, sortOrder) => ({ trackVersionId: versionId, imageUrl, sortOrder }))); }
  return c.json({ version: { ...updated[0], label: versionLabel(updated[0].versionType, updated[0].versionNumber), photos: payload.photoUrls ?? await db.select().from(trackVersionPhotos).where(eq(trackVersionPhotos.trackVersionId, versionId)) } });
});

publicRouter.delete("/artist/me/track-versions/:id", requireArtist, async (c) => {
  const db = getDb(c.env); const user = c.get("user"); const versionId = Number(c.req.param("id"));
  const [artist] = await db.select().from(artists).where(eq(artists.userId, user.id)).limit(1);
  if (!artist) return c.json({ error: "Artist profile not found" }, 404);
  const [record] = await db.select({ version: trackVersions, song: songs }).from(trackVersions).innerJoin(songs, eq(trackVersions.songId, songs.id)).where(and(eq(trackVersions.id, versionId), eq(songs.artistId, artist.id))).limit(1);
  if (!record) return c.json({ error: "Track version not found" }, 404);
  if (record.song.audioUrl === record.version.audioUrl) return c.json({ error: "This is the current public audio. Upload and select another master before deleting it." }, 409);
  const urls = [record.version.audioUrl, ...(await db.select({ imageUrl: trackVersionPhotos.imageUrl }).from(trackVersionPhotos).where(eq(trackVersionPhotos.trackVersionId, versionId))).map((photo) => photo.imageUrl)];
  for (const url of urls) { const key = getManagedMediaKey(url, c.req.url); if (key) { await c.env.MEDIA_BUCKET.delete(key).catch(() => undefined); await db.delete(media).where(eq(media.r2Key, key)); } }
  await db.delete(trackVersions).where(eq(trackVersions.id, versionId));
  await logFlowEvent(c.env, c.req.raw, "artist.track_version.deleted", { user, artistId: artist.id, meta: { versionId, songId: record.song.id } });
  return c.json({ success: true, deletedId: versionId });
});

publicRouter.post("/artist/me/media", requireArtist, async (c) => {
  try {
    const db = getDb(c.env);
    const user = c.get("user");
    const [artist] = await db.select().from(artists).where(eq(artists.userId, user.id)).limit(1);

    if (!artist) {
      return c.json({ error: "Artist profile not found" }, 404);
    }

    const form = await c.req.formData();
    const file = form.get("file");
    const alt = String(form.get("alt") ?? "");
    const kind = String(form.get("kind") ?? "media");

    if (!(file instanceof File)) {
      console.error("artist media upload invalid file", {
        artistId: artist.id,
        userId: user.id,
        kind,
        fileType: typeof file
      });
      return c.json({ error: "File required" }, 400);
    }

    const artistPath = slugify(artist.slug || artist.name) || `artist-${artist.id}`;
    const uploaded = await uploadMediaObject(c, file, `artists/${artistPath}/${kind}`, alt);
    await logFlowEvent(c.env, c.req.raw, "artist.media.uploaded", {
      user,
      artistId: artist.id,
      meta: { kind, key: uploaded.key, url: uploaded.url, fileName: file.name }
    });
    return c.json(uploaded, 201);
  } catch (error) {
    console.error("artist media upload failed", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      path: c.req.path
    });
    return c.json({ error: "Could not upload media." }, 500);
  }
});

publicRouter.get("/radio", async (c) => {
  try {
    const radio = await getRadioStatus(c.env);
    c.header("Cache-Control", "public, max-age=30, s-maxage=60, stale-while-revalidate=300");
    return c.json(radio);
  } catch (error) {
    console.error("radio route failed", error);
    return c.json({
      streamUrl: c.env.RADIO_STREAM_URL,
      metadataUrl: c.env.RADIO_METADATA_URL,
      embedUrl: c.env.RADIO_EMBED_URL,
      nowPlaying: "Fully Open Radio",
      listeners: "Live",
      host: undefined
    });
  }
});

publicRouter.get("/radio/history", async (c) => {
  try {
    const db = getDb(c.env);
    const rows = await db
      .select({
        id: radioHistory.id,
        artistName: radioHistory.artistName,
        title: radioHistory.title,
        coverImage: radioHistory.coverImage,
        playedAt: radioHistory.playedAt
      })
      .from(radioHistory)
      .orderBy(desc(radioHistory.playedAt), desc(radioHistory.id))
      .limit(8);

    return c.json(rows);
  } catch (error) {
    console.error("radio history route failed", error);
    return c.json([]);
  }
});

publicRouter.post("/submit-music", rateLimit, zValidator("json", submissionSchema), async (c) => {
  const payload = c.req.valid("json");
  const db = getDb(c.env);
  const created = await db
    .insert(submissions)
    .values({
      name: payload.name,
      email: payload.email,
      socials: payload.socials,
      musicLink: payload.musicLink,
      message: payload.message,
      rightsConfirmed: payload.rightsConfirmed,
      status: "new",
      createdAt: new Date().toISOString()
    })
    .returning({ id: submissions.id });

  mutableFallback.submissions.push({
    id: created[0].id,
    status: "new",
    createdAt: new Date().toISOString(),
    ...payload
  });
  await logFlowEvent(c.env, c.req.raw, "submission.created", {
    meta: { submissionId: created[0].id, email: payload.email }
  });
  return c.json({ ok: true, id: created[0].id });
});

publicRouter.post("/contact", rateLimit, zValidator("json", contactSchema), async (c) => {
  const payload = c.req.valid("json");
  const db = getDb(c.env);
  const created = await db
    .insert(contacts)
    .values({
      name: payload.name,
      email: payload.email,
      message: payload.message,
      createdAt: new Date().toISOString()
    })
    .returning({ id: contacts.id });

  await logFlowEvent(c.env, c.req.raw, "contact.created", {
    meta: { contactId: created[0].id, email: payload.email }
  });
  return c.json({ ok: true, received: payload.email, id: created[0].id });
});

publicRouter.post("/checkout", zValidator("json", checkoutSchema), async (c) => {
  const payload = c.req.valid("json");
  const stripe = getStripe(c.env);
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    success_url: payload.successUrl,
    cancel_url: payload.cancelUrl,
    line_items: payload.items.map((item) => ({
      price: item.stripePriceId,
      quantity: item.quantity
    }))
  });

  await logFlowEvent(c.env, c.req.raw, "checkout.created", {
    meta: {
      itemCount: payload.items.length,
      successUrl: payload.successUrl
    }
  });
  return c.json({ url: session.url });
});

publicRouter.post("/stripe/webhook", async (c) => {
  return c.json({ received: true });
});
