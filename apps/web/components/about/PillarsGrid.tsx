import { Disc3, Globe2, Radio, Sparkles } from "lucide-react";
import Container from "../layout/Container";

const pillars = [
  {
    icon: Radio,
    title: "24/7 Radio",
    description: "Curated underground music selected intentionally rather than fed by algorithms."
  },
  {
    icon: Sparkles,
    title: "Artist Platform",
    description: "A space where artists can build their page, upload tracks, and shape their story."
  },
  {
    icon: Globe2,
    title: "Global Community",
    description: "Open-minded listeners and creators connected through discovery, not genre borders."
  },
  {
    icon: Disc3,
    title: "Physical Releases",
    description: "Vinyl, compilations, merch, and limited runs that extend the music beyond streaming."
  }
];

export default function PillarsGrid() {
  return (
    <section className="py-24">
      <Container>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="group rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition duration-200 hover:-translate-y-1 hover:border-pink/40 hover:shadow-[0_18px_40px_rgba(209,74,139,0.2)]"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-pink/30 bg-pink/10 text-pink">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="mt-5 text-xl text-white">{pillar.title}</h2>
                <p className="mt-3 text-sm leading-7 text-fog">{pillar.description}</p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
