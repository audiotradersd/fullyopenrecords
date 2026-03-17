import Container from "./layout/Container";
import { Card } from "./ui/card";

const releases = [
  { artist: "GRZZLY", title: "Sonny Boy" },
  { artist: "Mira K", title: "Echowave" },
  { artist: "NOISER", title: "Obsidian Engine" }
];

export default function ReleaseGrid() {
  return (
    <section className="py-20">
      <Container>
        <h2 className="mb-8 text-3xl font-bold text-white md:text-4xl">Latest Releases</h2>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {releases.map((release) => (
            <Card key={`${release.artist}-${release.title}`} className="group rounded-xl bg-white/5 p-4">
              <div className="relative overflow-hidden rounded-xl">
                <div className="cosmic-artwork aspect-square rounded-xl" aria-label={`${release.artist} artwork`} />
                <div className="absolute inset-0 flex items-center justify-center bg-[rgba(8,4,16,0.18)] opacity-0 transition duration-200 group-hover:opacity-100">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-[rgba(209,74,139,0.82)] text-lg text-white shadow-[0_0_24px_rgba(209,74,139,0.45)]">
                    ▶
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-white">{release.artist}</h3>
                <p className="mt-1 text-sm text-fog">{release.title}</p>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
