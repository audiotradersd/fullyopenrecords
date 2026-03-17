import Link from "next/link";
import { Play } from "lucide-react";
import Container from "../layout/Container";
import { Card } from "../ui/card";

const releases = [
  { artist: "GRZZLY", title: "Sonny Boy", hue: 0 },
  { artist: "Mira K", title: "Echowave", hue: 28 },
  { artist: "NOISER", title: "Obsidian Engine", hue: -22 }
];

export default function ReleaseGrid() {
  return (
    <section className="py-20">
      <Container>
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="font-meta text-xs uppercase tracking-[0.28em] text-fog">Releases</p>
            <h2 className="mt-3 text-3xl font-semibold text-white md:text-4xl">Latest Releases</h2>
          </div>
          <Link href="/releases" className="font-meta text-xs uppercase tracking-[0.2em] text-fog">
            View all
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {releases.map((release) => (
            <Card key={release.title} className="group rounded-xl bg-white/5 p-4 backdrop-blur">
              <div
                className="relative overflow-hidden rounded-xl"
                style={{ filter: `hue-rotate(${release.hue}deg)` }}
              >
                <div className="cosmic-artwork aspect-square w-full rounded-xl" aria-label={`${release.artist} artwork`} />
                <div className="absolute inset-0 flex items-center justify-center bg-[rgba(6,2,12,0.18)] opacity-0 transition duration-200 group-hover:opacity-100">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black/55 text-white shadow-[0_0_18px_rgba(209,74,139,0.3)]">
                    <Play className="ml-1 h-5 w-5" />
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-base font-semibold text-white">{release.artist}</p>
                <p className="mt-1 text-sm text-fog">{release.title}</p>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
