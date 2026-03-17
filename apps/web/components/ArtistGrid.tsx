import Container from "./layout/Container";
import { Card } from "./ui/card";

const artists = [
  { name: "GRZZLY", genre: "Experimental Hip Hop" },
  { name: "Mira K", genre: "Ambient Electronic" },
  { name: "NOISER", genre: "Industrial Techno" },
  { name: "Cinder Static", genre: "Late Night Electronics" }
];

export default function ArtistGrid() {
  return (
    <section className="py-20">
      <Container>
        <h2 className="mb-8 text-3xl font-bold text-white md:text-4xl">Discover Artists</h2>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {artists.map((artist) => (
            <Card key={artist.name} className="rounded-xl bg-white/5 p-4">
              <div className="cosmic-artwork aspect-[4/5] rounded-xl" aria-label={`${artist.name} image`} />
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-white">{artist.name}</h3>
                <span className="mt-2 inline-flex rounded-full border border-pink/30 bg-pink/10 px-3 py-1 text-xs uppercase tracking-[0.16em] text-fog">
                  {artist.genre}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
