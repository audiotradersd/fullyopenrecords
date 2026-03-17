import Link from "next/link";
import Container from "../layout/Container";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

export default function RadioSection({
  artist,
  title
}: {
  artist: string;
  title: string;
}) {
  return (
    <section className="py-20">
      <Container>
        <Card className="grid items-center gap-6 rounded-xl bg-white/5 p-6 backdrop-blur md:grid-cols-[120px_minmax(0,1fr)_auto]">
          <div className="cosmic-artwork h-[120px] w-[120px] rounded-xl" aria-label="Now playing artwork" />
          <div>
            <p className="font-meta text-xs uppercase tracking-[0.28em] text-fog">Fully Open Radio</p>
            <h2 className="mt-3 text-2xl font-semibold text-white md:text-3xl">Now Playing</h2>
            <p className="mt-2 text-lg font-semibold text-white">{artist}</p>
            <p className="mt-1 text-base text-fog">{title}</p>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex items-end gap-1">
                <span className="h-3 w-1 rounded-full bg-pink animate-pulse" />
                <span className="h-5 w-1 rounded-full bg-pink/80 animate-pulse [animation-delay:120ms]" />
                <span className="h-4 w-1 rounded-full bg-pink/70 animate-pulse [animation-delay:240ms]" />
                <span className="h-6 w-1 rounded-full bg-pink animate-pulse [animation-delay:360ms]" />
              </div>
              <span className="text-sm text-fog">Live underground radio stream</span>
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
