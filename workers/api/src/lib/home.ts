import {
  artists,
  editorialSlotItems,
  editorialSlots,
  releases,
  songs
} from "@fully-open-records/db/src/schema";
import { and, asc, desc, eq, isNotNull } from "drizzle-orm";
import { alias } from "drizzle-orm/sqlite-core";
import { resolveArtistImage } from "./artist-images";
import { fallbackContent } from "./content";
import { getDb } from "./db";
import type { Env } from "../types";

const itemArtists = alias(artists, "home_item_artists");
const songArtists = alias(artists, "home_song_artists");

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
  audioUrl: string | null;
};

type HomeOurPick = {
  itemType: "artist" | "song";
  artistName: string;
  artistSlug: string;
  title: string;
  image: string;
  writeup: string;
  reason: string;
  href: string;
  audioUrl: string | null;
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
      artistName: itemArtists.name,
      artistSlug: itemArtists.slug,
      artistBio: itemArtists.bio,
      artistProfileImage: itemArtists.profileImage,
      artistHeroImage: itemArtists.heroImage,
      artistGenres: itemArtists.genres,
      releaseTitle: releases.title,
      releaseDescription: releases.description,
      releaseArtwork: releases.artwork,
      releaseId: releases.id,
      songTitle: songs.title,
      songAudioUrl: songs.audioUrl,
      songCoverImage: songs.coverImage,
      songArtistName: songs.artistName,
      songArtistSlug: songArtists.slug,
      songArtistBio: songArtists.bio,
      songArtistProfileImage: songArtists.profileImage,
      songArtistHeroImage: songArtists.heroImage,
      songId: songs.id
    })
    .from(editorialSlotItems)
    .innerJoin(editorialSlots, eq(editorialSlotItems.slotId, editorialSlots.id))
    .leftJoin(itemArtists, eq(editorialSlotItems.artistId, itemArtists.id))
    .leftJoin(releases, eq(editorialSlotItems.itemId, releases.id))
    .leftJoin(songs, eq(editorialSlotItems.itemId, songs.id))
    .leftJoin(songArtists, eq(songs.artistId, songArtists.id))
    .where(and(eq(editorialSlots.slotKey, slotKey), eq(editorialSlotItems.active, true), eq(editorialSlots.active, true)))
    .orderBy(asc(editorialSlotItems.sortOrder), asc(editorialSlotItems.id));
}

export async function getHomePayload(env: Env) {
  const db = getDb(env);
  const [featuredReleaseItems, featuredArtistItems, latestReleaseItems, ourPickItems, featuredArtistsFallback, releaseFallback, latestSongsFallback] =
    await Promise.all([
      getSlotItems(env, "home_featured_release"),
      getSlotItems(env, "home_featured_artists"),
      getSlotItems(env, "home_latest_releases"),
      getSlotItems(env, "home_our_pick"),
      db.select().from(artists).orderBy(desc(artists.featured), asc(artists.name)).limit(4),
      db.select({
        id: releases.id,
        title: releases.title,
        description: releases.description,
        artwork: releases.artwork,
        artistId: releases.artistId,
        artistName: artists.name
      }).from(releases).innerJoin(artists, eq(releases.artistId, artists.id)).orderBy(desc(releases.releaseDate)).limit(3)
      ,db.select({ id: songs.id, title: songs.title, audioUrl: songs.audioUrl, artistName: songs.artistName, artwork: artists.heroImage, artistSlug: artists.slug }).from(songs).leftJoin(artists, eq(songs.artistId, artists.id)).where(isNotNull(songs.audioUrl)).orderBy(desc(songs.id)).limit(3)
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
          featuredReleaseItems[0].customImage ||
          featuredReleaseItems[0].releaseArtwork ||
          resolveArtistImage(featuredReleaseItems[0].artistSlug, featuredReleaseItems[0].artistProfileImage, featuredReleaseItems[0].artistHeroImage) ||
          "",
        href:
          featuredReleaseItems[0].customHref ??
          "/releases"
      }
    : releaseFallback[0]
      ? {
          id: releaseFallback[0].id,
          artistName: releaseFallback[0].artistName,
          title: releaseFallback[0].title,
          description: releaseFallback[0].description,
          artwork: releaseFallback[0].artwork,
        href: "/releases",
        audioUrl: null
        }
      : {
          id: 0,
          artistName: "Fully Open Records",
          title: "Featured Release",
          description: "Curated selections from the label.",
          artwork: "",
        href: "/releases",
        audioUrl: null
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
          image: item.customImage || resolveArtistImage(item.artistSlug, item.artistProfileImage, item.artistHeroImage)
        }))
      : (featuredArtistsFallback.length ? featuredArtistsFallback : fallbackContent.artists).slice(0, 4).map((artist) => ({
          id: artist.id,
          name: artist.name,
          slug: artist.slug,
          genre: artist.genres?.[0] ?? "Underground",
          image: resolveArtistImage(artist.slug, "profileImage" in artist ? artist.profileImage : null, artist.heroImage)
        }));

  const latestReleases: HomeRelease[] =
    latestReleaseItems.length > 0
      ? latestReleaseItems.slice(0, 3).map((item) => ({
          id: item.songId ?? item.slotItemId,
          artistName: item.customSubtitle ?? item.songArtistName ?? item.artistName ?? "Artist",
          title: item.customTitle ?? item.songTitle ?? "Release",
          description: item.customDescription ?? "",
          artwork: item.customImage || item.songCoverImage || resolveArtistImage(item.songArtistSlug ?? item.artistSlug, item.songArtistProfileImage ?? item.artistProfileImage, item.songArtistHeroImage ?? item.artistHeroImage),
          href: item.customHref ?? (item.songArtistSlug ?? item.artistSlug ? `/artist/${item.songArtistSlug ?? item.artistSlug}` : "/releases"),
          audioUrl: item.songAudioUrl ?? null
        }))
      : latestSongsFallback.slice(0, 3).map((song) => ({
          id: song.id,
          artistName: song.artistName,
          title: song.title,
          description: "",
          artwork: song.artwork ?? "",
          href: song.artistSlug ? `/artist/${song.artistSlug}` : "/releases",
          audioUrl: song.audioUrl
        }));

  const pick = ourPickItems[0];
  const ourPick: HomeOurPick | null = pick
    ? (() => {
        const isSong = pick.itemType === "song";
        const artistName = isSong
          ? pick.songArtistName ?? "Artist"
          : pick.artistName ?? "Artist";
        const artistSlug = isSong
          ? pick.songArtistSlug ?? ""
          : pick.artistSlug ?? "";
        const title = pick.customTitle ?? (isSong ? pick.songTitle : pick.artistName) ?? "Our Pick";
        const defaultWriteup = isSong
          ? pick.songArtistBio ?? ""
          : pick.artistBio ?? "";
        return {
          itemType: isSong ? "song" : "artist",
          artistName,
          artistSlug,
          title,
          image: pick.customImage || (isSong
            ? pick.songCoverImage || resolveArtistImage(pick.songArtistSlug, pick.songArtistProfileImage, pick.songArtistHeroImage)
            : resolveArtistImage(pick.artistSlug, pick.artistProfileImage, pick.artistHeroImage)),
          writeup: pick.customDescription ?? defaultWriteup,
          reason: pick.customSubtitle ?? "",
          href: pick.customHref ?? (artistSlug ? `/artist/${artistSlug}` : "/artists"),
          audioUrl: isSong ? pick.songAudioUrl : null
        };
      })()
    : null;

  return {
    featuredRelease,
    featuredArtists,
    latestReleases,
    ourPick
  };
}

function slugifyLocal(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
