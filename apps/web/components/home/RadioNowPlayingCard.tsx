"use client";

import Link from "next/link";
import Container from "../layout/Container";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

type RadioNowPlayingCardProps = {
  artist: string;
  title: string;
};

export default function RadioNowPlayingCard({ artist, title }: RadioNowPlayingCardProps) {
  const track = { artist, title };

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
