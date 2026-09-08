import Image from "next/image";
import Link from "next/link";
import Container from "../layout/Container";
import { Card } from "../ui/card";
import StreamButton from "../audio/StreamButton";

type LatestRelease = { id: number; artistName: string; title: string; artwork: string; audioUrl: string | null };

export default function LatestReleasesGrid({ releases }: { releases: LatestRelease[] }) {

  return (
    <section className="py-24">
      <Container>
        <div className="mb-8 flex items-end justify-between gap-4">
          <h2 className="text-3xl font-semibold text-white md:text-4xl">Latest Releases</h2>
          <Link href="/releases" className="font-meta text-xs uppercase tracking-[0.22em] text-fog">
            View All
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {releases.map((release, index) => (
            <Card
              key={release.title}
              className="group rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-md hover:scale-[1.03] hover:border-pink/40"
            >
              <div
                className="relative aspect-square overflow-hidden rounded-xl border border-white/10"
                style={{ filter: `hue-rotate(${[12, -12, 0][index] ?? 0}deg)` }}
              >
                {release.artwork ? (
                  <Image
                    src={release.artwork}
                    alt={`${release.artistName} artwork`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  />
                ) : (
                  <div
                    className="cosmic-artwork h-full w-full rounded-xl"
                    aria-label={`${release.artistName} artwork`}
                  />
                )}
              </div>
              <div className="px-1 pb-1 pt-4">
                <p className="text-sm font-semibold text-white">{release.artistName}</p>
                <p className="mt-1 text-sm text-fog">{release.title}</p>
                <div className="mt-4">
                  {release.audioUrl ? <StreamButton
                    audioUrl={release.audioUrl}
                    label={`Play ${release.title}`}
                    pauseLabel="Pause"
                    size="sm"
                  /> : <span className="text-xs uppercase tracking-[0.16em] text-fog">Preview unavailable</span>}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
