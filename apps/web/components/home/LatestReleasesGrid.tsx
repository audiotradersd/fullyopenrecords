import Image from "next/image";
import Link from "next/link";
import Container from "../layout/Container";
import { Card } from "../ui/card";
import StreamButton from "../audio/StreamButton";

const releases = [
  {
    artist: "Violet Piper",
    title: "Inside Baseball",
    hue: 12,
    audioUrl: "/api/media/latest-releases/violet-piper-inside-baseball.mp3",
    image: "/latest-releases/violet-piper.jpeg"
  },
  {
    artist: "Troll Mother",
    title: "Forest Child",
    hue: -12,
    audioUrl: "/api/media/latest-releases/troll-mother-forest-child.mp3",
    image: "/latest-releases/troll-mother.jpg"
  },
  {
    artist: "Stone!?",
    title: "Intermingle",
    hue: 0,
    audioUrl:
      "https://api.fullyopenrecords.com/media/artists/stone/songs/audio/1773339566072-01---Intermingle---Jack-Issues.mp3",
    image: ""
  }
];

export default function LatestReleasesGrid({ stoneImage }: { stoneImage?: string }) {
  const resolvedReleases = releases.map((release) =>
    release.artist === "Stone!?"
      ? { ...release, image: stoneImage || release.image }
      : release
  );

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
          {resolvedReleases.map((release) => (
            <Card
              key={release.title}
              className="group rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-md hover:scale-[1.03] hover:border-pink/40"
            >
              <div
                className="relative aspect-square overflow-hidden rounded-xl border border-white/10"
                style={{ filter: `hue-rotate(${release.hue}deg)` }}
              >
                {release.image ? (
                  <Image
                    src={release.image}
                    alt={`${release.artist} artwork`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  />
                ) : (
                  <div
                    className="cosmic-artwork h-full w-full rounded-xl"
                    aria-label={`${release.artist} artwork`}
                  />
                )}
              </div>
              <div className="px-1 pb-1 pt-4">
                <p className="text-sm font-semibold text-white">{release.artist}</p>
                <p className="mt-1 text-sm text-fog">{release.title}</p>
                <div className="mt-4">
                  <StreamButton
                    audioUrl={release.audioUrl}
                    label={`Play ${release.title}`}
                    pauseLabel="Pause"
                    size="sm"
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
