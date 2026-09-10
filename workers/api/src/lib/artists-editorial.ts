import { artists, editorialSlotItems, editorialSlots, songs } from "@fully-open-records/db/src/schema";
import { and, asc, eq } from "drizzle-orm";
import { getDb } from "./db";
import { resolveArtistImage } from "./artist-images";
import type { Env } from "../types";

async function items(env: Env, key: string) {
  const db = getDb(env);
  return db.select({ itemId: editorialSlotItems.itemId, sortOrder: editorialSlotItems.sortOrder, customTitle: editorialSlotItems.customTitle, customSubtitle: editorialSlotItems.customSubtitle, customDescription: editorialSlotItems.customDescription, customImage: editorialSlotItems.customImage, customHref: editorialSlotItems.customHref, songTitle: songs.title, audioUrl: songs.audioUrl, artistName: artists.name, artistSlug: artists.slug, genres: artists.genres, bio: artists.bio, profileImage: artists.profileImage, heroImage: artists.heroImage }).from(editorialSlotItems).innerJoin(editorialSlots, eq(editorialSlotItems.slotId, editorialSlots.id)).innerJoin(songs, eq(editorialSlotItems.itemId, songs.id)).leftJoin(artists, eq(songs.artistId, artists.id)).where(and(eq(editorialSlots.slotKey, key), eq(editorialSlotItems.active, true), eq(editorialSlots.active, true))).orderBy(asc(editorialSlotItems.sortOrder));
}

export async function getArtistsEditorialPayload(env: Env) {
  const [heroRows, gridRows] = await Promise.all([items(env, "artists_hero"), items(env, "artists_grid")]);
  const map = (row: typeof heroRows[number]) => ({ slug: row.artistSlug ?? "", name: row.customTitle || row.artistName || "Artist", genres: row.customSubtitle ? row.customSubtitle.split(/\s*\/\s*|\s*,\s*/).filter(Boolean) : (row.genres as string[] | null) ?? [], bio: row.customDescription || row.bio || "", image: row.customImage || resolveArtistImage(row.artistSlug, row.profileImage, row.heroImage), href: row.customHref || (row.artistSlug ? `/artist/${row.artistSlug}` : ""), sampleTrack: { title: row.songTitle ?? "", audioUrl: row.audioUrl ?? "" } });
  const hero = heroRows[0];
  return { hero: hero ? { artist: { ...map(hero), name: hero.artistName || "Artist", genres: (hero.genres as string[] | null) ?? [] }, track: { title: hero.songTitle ?? "", audioUrl: hero.audioUrl }, badge: hero.customTitle ?? "", description: hero.customSubtitle ?? "", editorialNote: hero.customDescription ?? "", backgroundImage: hero.customHref || resolveArtistImage(hero.artistSlug, hero.profileImage, hero.heroImage), foregroundImage: hero.customImage || resolveArtistImage(hero.artistSlug, hero.profileImage, hero.heroImage) } : null, artists: gridRows.map(map) };
}
