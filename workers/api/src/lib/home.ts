import {
  artists,
  editorialSlotItems,
  editorialSlots,
  releases
} from "@fully-open-records/db/src/schema";
import { and, asc, desc, eq } from "drizzle-orm";
import { fallbackContent } from "./content";
import { getDb } from "./db";
import type { Env } from "../types";

type HomeArtist = {
  id: number;
  name: string;
  slug: string;
  genre: string;
  image: string;
};

type HomeRelease = {
  id: number;
  artistName: string;
  title: string;
  description: string;
  artwork: string;
  href: string;
};

async function getSlotItems(env: Env, slotKey: string) {
  const db = getDb(env);
  return db
    .select({
      slotItemId: editorialSlotItems.id,
      itemType: editorialSlotItems.itemType,
      itemId: editorialSlotItems.itemId,
      artistId: editorialSlotItems.artistId,
      sortOrder: editorialSlotItems.sortOrder,
      customTitle: editorialSlotItems.customTitle,
      customSubtitle: editorialSlotItems.customSubtitle,
      customDescription: editorialSlotItems.customDescription,
      customImage: editorialSlotItems.customImage,
      customHref: editorialSlotItems.customHref,
      artistName: artists.name,
      artistSlug: artists.slug,
      artistHeroImage: artists.heroImage,
      artistGenres: artists.genres,
      releaseTitle: releases.title,
      releaseDescription: releases.description,
      releaseArtwork: releases.artwork,
      releaseId: releases.id
    })
    .from(editorialSlotItems)
    .innerJoin(editorialSlots, eq(editorialSlotItems.slotId, editorialSlots.id))
    .leftJoin(artists, eq(editorialSlotItems.artistId, artists.id))
    .leftJoin(releases, eq(editorialSlotItems.itemId, releases.id))
    .where(and(eq(editorialSlots.slotKey, slotKey), eq(editorialSlotItems.active, true), eq(editorialSlots.active, true)))
    .orderBy(asc(editorialSlotItems.sortOrder), asc(editorialSlotItems.id));
}

export async function getHomePayload(env: Env) {
  const db = getDb(env);
  const [featuredReleaseItems, featuredArtistItems, latestReleaseItems, featuredArtistsFallback, latestReleasesFallback] =
    await Promise.all([
      getSlotItems(env, "home_featured_release"),
      getSlotItems(env, "home_featured_artists"),
      getSlotItems(env, "home_latest_releases"),
      db.select().from(artists).orderBy(desc(artists.featured), asc(artists.name)).limit(4),
      db.select({
        id: releases.id,
        title: releases.title,
        description: releases.description,
        artwork: releases.artwork,
        artistId: releases.artistId,
        artistName: artists.name
      }).from(releases).innerJoin(artists, eq(releases.artistId, artists.id)).orderBy(desc(releases.releaseDate)).limit(3)
    ]);

  const featuredRelease = featuredReleaseItems[0]
    ? {
        id: featuredReleaseItems[0].releaseId ?? featuredReleaseItems[0].slotItemId,
        artistName:
          featuredReleaseItems[0].customSubtitle ??
          featuredReleaseItems[0].artistName ??
          "Fully Open Records",
        title:
          featuredReleaseItems[0].customTitle ??
          featuredReleaseItems[0].releaseTitle ??
          "Featured Release",
        description:
          featuredReleaseItems[0].customDescription ??
          featuredReleaseItems[0].releaseDescription ??
          "Curated from the artist layer by Fully Open staff.",
        artwork:
          featuredReleaseItems[0].customImage ??
          featuredReleaseItems[0].releaseArtwork ??
          featuredReleaseItems[0].artistHeroImage ??
          "",
        href:
          featuredReleaseItems[0].customHref ??
          "/releases"
      }
    : latestReleasesFallback[0]
      ? {
          id: latestReleasesFallback[0].id,
          artistName: latestReleasesFallback[0].artistName,
          title: latestReleasesFallback[0].title,
          description: latestReleasesFallback[0].description,
          artwork: latestReleasesFallback[0].artwork,
          href: "/releases"
        }
      : {
          id: 0,
          artistName: "Fully Open Records",
          title: "Featured Release",
          description: "Curated selections from the label.",
          artwork: "",
          href: "/releases"
        };

  const featuredArtists: HomeArtist[] =
    featuredArtistItems.length > 0
      ? featuredArtistItems.slice(0, 4).map((item) => ({
          id: item.artistId ?? item.slotItemId,
          name: item.customTitle ?? item.artistName ?? "Artist",
          slug: item.artistSlug ?? slugifyLocal(item.customTitle ?? item.artistName ?? "artist"),
          genre:
            item.customSubtitle ??
            ((item.artistGenres as string[] | null)?.[0] ?? "Underground"),
          image: item.customImage ?? item.artistHeroImage ?? ""
        }))
      : (featuredArtistsFallback.length ? featuredArtistsFallback : fallbackContent.artists).slice(0, 4).map((artist) => ({
          id: artist.id,
          name: artist.name,
          slug: artist.slug,
          genre: artist.genres?.[0] ?? "Underground",
          image: artist.heroImage
        }));

  const latestReleases: HomeRelease[] =
    latestReleaseItems.length > 0
      ? latestReleaseItems.slice(0, 3).map((item) => ({
          id: item.releaseId ?? item.slotItemId,
          artistName: item.customSubtitle ?? item.artistName ?? "Artist",
          title: item.customTitle ?? item.releaseTitle ?? "Release",
          description: item.customDescription ?? item.releaseDescription ?? "",
          artwork: item.customImage ?? item.releaseArtwork ?? item.artistHeroImage ?? "",
          href: item.customHref ?? "/releases"
        }))
      : (latestReleasesFallback.length ? latestReleasesFallback : fallbackContent.releases.map((release) => ({
          ...release,
          artistName: fallbackContent.artists.find((artist) => artist.id === release.artistId)?.name ?? "Artist"
        }))).slice(0, 3).map((release) => ({
          id: release.id,
          artistName: release.artistName,
          title: release.title,
          description: release.description,
          artwork: release.artwork,
          href: "/releases"
        }));

  return {
    featuredRelease,
    featuredArtists,
    latestReleases
  };
}

function slugifyLocal(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
