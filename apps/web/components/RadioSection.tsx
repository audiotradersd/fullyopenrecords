import Link from "next/link";
import type { Route } from "next";
import Container from "./layout/Container";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

export default function RadioSection({ nowPlaying }: { nowPlaying: string }) {
  return (
    <section className="py-20">
      <Container>
        <Card className="grid items-center gap-6 rounded-3xl bg-white/5 p-5 md:grid-cols-[112px_minmax(0,1fr)_auto] md:p-6">
          <div className="cosmic-artwork h-28 w-28 rounded-2xl" aria-label="Now playing artwork" />
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-fog">Fully Open Radio</p>
            <p className="mt-3 text-xl font-semibold text-white md:text-2xl">Now Playing: {nowPlaying}</p>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex items-end gap-1">
                <span className="h-3 w-1 rounded-full bg-pink animate-pulse" />
                <span className="h-5 w-1 rounded-full bg-pink/80 animate-pulse [animation-delay:120ms]" />
                <span className="h-4 w-1 rounded-full bg-pink/70 animate-pulse [animation-delay:240ms]" />
                <span className="h-6 w-1 rounded-full bg-pink animate-pulse [animation-delay:360ms]" />
              </div>
              <span className="text-sm text-fog">Live stream from Fully Open Radio</span>
            </div>
          </div>
          <Link href={"/radio" as Route}>
            <Button>Play Live</Button>
          </Link>
        </Card>
      </Container>
    </section>
  );
}
