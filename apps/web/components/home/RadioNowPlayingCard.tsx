"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Container from "../layout/Container";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

type RadioNowPlayingCardProps = {
  artist: string;
  title: string;
};

type RadioPayload = {
  nowPlaying?: unknown;
  host?: unknown;
};

function parseTrack(raw: unknown, fallbackArtist?: string) {
  const value = typeof raw === "string" ? raw : String(raw ?? "");

  if (value.includes(" - ")) {
    const [artist, title] = value.split(" - ", 2);
    return { artist: artist.trim(), title: title.trim() };
  }

  if (value.includes(" — ")) {
    const [artist, title] = value.split(" — ", 2);
    return { artist: artist.trim(), title: title.trim() };
  }

  return {
    artist: fallbackArtist?.trim() || "Fully Open Radio",
    title: value || "Fully Open Radio"
  };
}

export default function RadioNowPlayingCard({ artist, title }: RadioNowPlayingCardProps) {
  const [track, setTrack] = useState({ artist, title });

  useEffect(() => {
    let active = true;

    async function refresh() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL ?? "https://api.fullyopenrecords.com"}/radio`,
          {
            cache: "no-store"
          }
        );

        if (!response.ok) {
          return;
        }

        const radio = (await response.json()) as RadioPayload;
        if (!active) {
          return;
        }

        setTrack(parseTrack(radio.nowPlaying, typeof radio.host === "string" ? radio.host : undefined));
      } catch {
        // Keep the current snapshot if polling fails.
      }
    }

    refresh();
    const interval = window.setInterval(refresh, 5000);

    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, []);

  return (
    <section className="py-24 pt-0">
      <Container>
        <Card className="grid items-center gap-6 rounded-xl border border-white/10 bg-[linear-gradient(135deg,rgba(58,27,92,0.38),rgba(95,33,102,0.28),rgba(78,12,54,0.24))] px-8 py-8 backdrop-blur-md md:grid-cols-[96px_minmax(0,1fr)_auto]">
          <div className="space-y-3">
            <div className="cosmic-artwork h-20 w-20 rounded-xl" aria-label="Radio artwork" />
            <p className="font-meta text-[10px] uppercase tracking-[0.22em] text-fog">Fully Open Radio</p>
          </div>

          <div className="min-w-0">
            <p className="font-meta text-xs uppercase tracking-[0.26em] text-fog">Now Playing</p>
            <p className="mt-3 truncate text-xl font-semibold text-white md:text-2xl">
              {track.artist} <span className="text-fog">—</span> {track.title}
            </p>
            <div className="mt-4 flex items-center gap-3 text-sm text-fog">
              <div className="flex items-end gap-1">
                <span className="h-3 w-1 rounded-full bg-pink animate-pulse" />
                <span className="h-5 w-1 rounded-full bg-pink/80 animate-pulse [animation-delay:120ms]" />
                <span className="h-4 w-1 rounded-full bg-pink/70 animate-pulse [animation-delay:240ms]" />
                <span className="h-6 w-1 rounded-full bg-pink animate-pulse [animation-delay:360ms]" />
              </div>
              <span>Live underground radio stream</span>
            </div>
          </div>

          <Link href="/radio">
            <Button>Play Live</Button>
          </Link>
        </Card>
      </Container>
    </section>
  );
}
