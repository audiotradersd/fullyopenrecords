import Image from "next/image";
import Link from "next/link";
import Container from "../layout/Container";
import { Card } from "../ui/card";
import { editorialArtistProfiles } from "../../lib/artistProfiles";

const artists = editorialArtistProfiles.filter((artist) => artist.sampleTrack).slice(0, 4);

export default function ArtistGrid() {
  return (
    <section className="py-20">
      <Container>
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="font-meta text-xs uppercase tracking-[0.28em] text-fog">Artists</p>
            <h2 className="mt-3 text-3xl font-semibold text-white md:text-4xl">Featured Artists</h2>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {artists.map((artist) => (
            <Card
              key={artist.slug}
              className="rounded-xl bg-white/5 p-4 backdrop-blur transition duration-200 hover:-translate-y-1 hover:border-pink/40"
            >
              <Link href={`/featured/${artist.slug}`}>
                <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-white/10">
                  <Image
                    src={artist.image}
                    alt={`${artist.name} image`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                  />
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-white">{artist.name}</h3>
                  <span className="mt-2 inline-flex rounded-full border border-pink/30 bg-pink/10 px-3 py-1 text-xs uppercase tracking-[0.16em] text-fog">
                    {artist.genres[0]}
                  </span>
                  <div className="mt-4 flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-fog">
                    <span>View Artist</span>
                    <span className="text-pink">→</span>
                  </div>
                </div>
              </Link>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
