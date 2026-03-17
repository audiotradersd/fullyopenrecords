import Image from "next/image";
import { featuredRelease } from "../../lib/homeContent";
import StreamButton from "../audio/StreamButton";
import Container from "../layout/Container";
import { Button } from "../ui/button";

export default function FeaturedRelease() {
  return (
    <section className="py-20">
      <Container>
        <div className="glass-card mx-auto grid max-w-5xl items-center gap-8 rounded-xl p-6 md:grid-cols-[minmax(0,1fr)_1.05fr] md:p-8">
          <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-white/10">
            {featuredRelease.image ? (
              <Image
                src={featuredRelease.image}
                alt={`${featuredRelease.artistName} featured release artwork`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div className="cosmic-artwork h-full w-full" aria-label="Featured release artwork" />
            )}
          </div>
          <div className="space-y-4">
            <p className="font-meta text-xs uppercase tracking-[0.32em] text-fog">Featured Release</p>
            <div>
              <p className="text-base font-semibold uppercase tracking-[0.18em] text-fog">
                {featuredRelease.artistName}
              </p>
              <h2 className="mt-2 text-4xl font-semibold text-white md:text-5xl">
                {featuredRelease.title}
              </h2>
            </div>
            <p className="max-w-xl text-base leading-7 text-fog">{featuredRelease.description}</p>
            <div className="flex flex-wrap gap-3">
              <StreamButton
                audioUrl={featuredRelease.audioUrl}
                label={`Listen${featuredRelease.trackTitle ? ` to ${featuredRelease.trackTitle}` : ""}`}
                pauseLabel="Pause"
              />
              <a href={featuredRelease.releaseHref}>
                <Button variant="outline">View Release</Button>
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
