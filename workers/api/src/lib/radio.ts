import { and, desc, eq } from "drizzle-orm";
import { radioHistory, songs } from "@fully-open-records/db/src/schema";
import { getDb } from "./db";
import type { Env } from "../types";

type IcecastSource = {
  title?: string;
  artist?: string;
  listeners?: number;
  listenurl?: string;
  server_name?: string;
  yp_currently_playing?: string;
};

export function normalizeSource(source: IcecastSource | IcecastSource[] | undefined) {
  if (Array.isArray(source)) return source[0];
  return source;
}

export function splitTrack(raw: string, fallbackArtist?: string) {
  if (raw.includes(" - ")) {
    const [artistName, title] = raw.split(" - ", 2);
    return { artistName: artistName.trim(), title: title.trim() };
  }
  if (raw.includes(" — ")) {
    const [artistName, title] = raw.split(" — ", 2);
    return { artistName: artistName.trim(), title: title.trim() };
  }

  return {
    artistName: fallbackArtist?.trim() || "Fully Open Radio",
    title: raw.trim()
  };
}

export async function syncRadioHistory(env: Env) {
  let nowPlaying = "Fully Open Radio";
  let listeners: number | string = "Live";
  let host: string | undefined;

  if (env.RADIO_METADATA_URL) {
    try {
      const response = await fetch(env.RADIO_METADATA_URL, {
        cf: { cacheTtl: 10, cacheEverything: true }
      });

      if (response.ok) {
        const payload = (await response.json()) as { icestats?: { source?: IcecastSource | IcecastSource[] } };
        const source = normalizeSource(payload.icestats?.source);

        nowPlaying =
          source?.yp_currently_playing ??
          source?.title ??
          source?.server_name ??
          nowPlaying;
        listeners = source?.listeners ?? listeners;
        host = source?.artist;
      }
    } catch (error) {
      console.error("radio metadata fetch failed", error);
    }
  }

  try {
    const db = getDb(env);
    const parsedTrack = splitTrack(nowPlaying, host);
    const latestHistory = await db
      .select()
      .from(radioHistory)
      .orderBy(desc(radioHistory.playedAt), desc(radioHistory.id))
      .limit(1);

    if (
      parsedTrack.title &&
      (!latestHistory[0] ||
        latestHistory[0].title !== parsedTrack.title ||
        latestHistory[0].artistName !== parsedTrack.artistName)
    ) {
      const matchedSong = await db
        .select({ id: songs.id, coverImage: songs.coverImage })
        .from(songs)
        .where(and(eq(songs.title, parsedTrack.title), eq(songs.artistName, parsedTrack.artistName)))
        .limit(1);

      await db.insert(radioHistory).values({
        artistName: parsedTrack.artistName,
        title: parsedTrack.title,
        songId: matchedSong[0]?.id ?? null,
        coverImage: matchedSong[0]?.coverImage ?? null,
        source: "citrus3",
        playedAt: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error("radio history sync failed", error);
  }

  return {
    streamUrl: env.RADIO_STREAM_URL,
    metadataUrl: env.RADIO_METADATA_URL,
    embedUrl: env.RADIO_EMBED_URL,
    nowPlaying,
    listeners,
    host
  };
}
