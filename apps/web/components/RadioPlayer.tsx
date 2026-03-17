"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { Button, Panel } from "@fully-open-records/ui";
import { useAuth } from "./auth/AuthProvider";

type RadioPlayerProps = {
  streamUrl: string;
  nowPlaying?: string;
  metadataUrl?: string;
};

type MetadataState = {
  title?: string;
  dj?: string;
  listeners?: number;
};

type IcecastPayload = {
  icestats?: {
    source?:
      | {
          title?: string;
          artist?: string;
          listeners?: number;
          yp_currently_playing?: string;
        }
      | Array<{
          title?: string;
          artist?: string;
          listeners?: number;
          yp_currently_playing?: string;
        }>;
  };
  nowPlaying?: string;
  title?: string;
  song?: string;
  dj?: string;
  host?: string;
  listeners?: number;
};

export function RadioPlayer({ streamUrl, nowPlaying, metadataUrl }: RadioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<number | null>(null);
  const anonymousListenLimitMs = 10 * 60 * 1000;
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<MetadataState>({});
  const [isLoading, setIsLoading] = useState(false);
  const [gateOpen, setGateOpen] = useState(false);
  const [saveState, setSaveState] = useState<string | null>(null);
  const { user, openAuth } = useAuth();

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, [streamUrl]);

  useEffect(() => {
    if (!metadataUrl) return;
    const url = metadataUrl;
    let active = true;

    async function loadMetadata() {
      try {
        const response = await fetch(url, { cache: "no-store" });
        if (!response.ok) return;

        const payload = (await response.json()) as IcecastPayload;
        if (!active) return;

        const source = Array.isArray(payload.icestats?.source)
          ? payload.icestats.source[0]
          : payload.icestats?.source;

        setMetadata({
          title:
            payload.nowPlaying ??
            payload.title ??
            payload.song ??
            source?.title ??
            source?.yp_currently_playing,
          dj: payload.dj ?? payload.host ?? source?.artist,
          listeners: payload.listeners ?? source?.listeners
        });
      } catch {
        // Metadata failure should not block playback.
      }
    }

    void loadMetadata();
    const timer = window.setInterval(loadMetadata, 15000);

    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [metadataUrl]);

  useEffect(() => {
    if (user && timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
      setGateOpen(false);
    }
  }, [user]);

  function getCurrentTrack() {
    const raw = metadata.title ?? nowPlaying ?? "Live stream";
    const value = typeof raw === "string" ? raw : String(raw ?? "");

    if (value.includes(" - ")) {
      const [artistName, title] = value.split(" - ", 2);
      return { artistName: artistName.trim(), title: title.trim() };
    }
    if (value.includes(" — ")) {
      const [artistName, title] = value.split(" — ", 2);
      return { artistName: artistName.trim(), title: title.trim() };
    }
    return {
      artistName: metadata.dj ?? "Fully Open Radio",
      title: value || "Live stream"
    };
  }

  function createLiveAudio() {
    const audio = new Audio(streamUrl);
    audio.crossOrigin = "anonymous";
    audio.preload = "none";
    audio.addEventListener("pause", () => setIsPlaying(false));
    audio.addEventListener("ended", () => setIsPlaying(false));
    audioRef.current = audio;
    return audio;
  }

  async function togglePlayback() {
    try {
      setIsLoading(true);

      if (isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
        if (timerRef.current) {
          window.clearTimeout(timerRef.current);
          timerRef.current = null;
        }
        setIsLoading(false);
        return;
      }

      audioRef.current?.pause();
      const liveAudio = createLiveAudio();
      await liveAudio.play();
      setIsPlaying(true);
      setError(null);
      setGateOpen(false);

      if (!user) {
        if (timerRef.current) {
          window.clearTimeout(timerRef.current);
        }

        timerRef.current = window.setTimeout(() => {
          liveAudio.pause();
          setIsPlaying(false);
          setGateOpen(true);
        }, anonymousListenLimitMs);
      }
    } catch {
      setError("Stream unavailable right now.");
      setIsPlaying(false);
    } finally {
      setIsLoading(false);
    }
  }

  async function favouriteCurrentTrack() {
    if (!user) {
      openAuth("register", "listener");
      return;
    }

    const response = await fetch("/api/account/favourites/current", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(getCurrentTrack())
    });

    const payload = (await response.json()) as { alreadyFavourited?: boolean; error?: string };

    if (response.status === 401) {
      openAuth("register", "listener");
      return;
    }

    setSaveState(
      response.ok ? (payload.alreadyFavourited ? "Already saved" : "Saved to favourites") : payload.error ?? "Could not save"
    );
    window.setTimeout(() => setSaveState(null), 2200);
  }

  return (
    <Panel className="overflow-hidden border-glow/30 p-0">
      <div className="grid gap-0 md:grid-cols-[0.9fr_1.1fr]">
        <div className="bg-gradient-to-br from-glow/35 via-plum to-haze p-6 md:p-8">
          <p className="text-xs uppercase tracking-[0.3em] text-fog">Fully Open Radio</p>
          <p className="mt-3 font-display text-4xl text-sand">Live Now</p>
          <p className="mt-4 text-sm text-fog">
            New artists, left-field sounds, and underground releases streaming now.
          </p>
          <div className="mt-8 flex items-center gap-4">
            <Button
              className="bg-ember text-sand shadow-[0_0_30px_rgba(161,42,58,0.35)]"
              onClick={togglePlayback}
              disabled={isLoading}
            >
              {isLoading ? "Loading" : isPlaying ? "Pause" : "Play"}
            </Button>
            <button
              type="button"
              onClick={() => void favouriteCurrentTrack()}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-sand transition hover:border-white/25 hover:text-white"
              aria-label="Save current track"
            >
              <Heart className="h-4 w-4" />
            </button>
            <div className="text-sm text-fog">
              <p className="text-sand">{metadata.title ?? nowPlaying ?? "Live stream"}</p>
              <p>{metadata.dj ? `Artist: ${metadata.dj}` : "Streaming from Citrus3"}</p>
              {saveState ? <p className="mt-1 text-xs text-sand">{saveState}</p> : null}
            </div>
          </div>
        </div>
        <div className="space-y-4 p-6 md:p-8">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-fog">Now playing</p>
            <p className="mt-2 text-xl text-sand">{metadata.title ?? nowPlaying ?? "Awaiting metadata"}</p>
          </div>
        </div>
      </div>
      {error ? <p className="px-6 pb-6 text-sm text-ember">{error}</p> : null}
      {gateOpen ? (
        <div className="border-t border-white/10 bg-black/40 px-6 py-5">
          <p className="text-base text-sand">Create a free account to keep listening.</p>
          <p className="mt-2 text-sm text-fog">
            Anonymous listening is limited to 10 minutes. Free accounts unlock uninterrupted radio and saved favourites.
          </p>
          <div className="mt-4 flex gap-3">
            <Link
              href={{ pathname: "/signup", query: { type: "listener" } }}
              className="rounded-full bg-white px-4 py-2 text-sm font-medium text-black transition hover:opacity-90"
            >
              Create free account
            </Link>
            <button
              type="button"
              onClick={() => openAuth("login")}
              className="rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/5"
            >
              Log in
            </button>
          </div>
        </div>
      ) : null}
    </Panel>
  );
}
