import Image from "next/image";
import Container from "../layout/Container";

const founders = [
  {
    name: "Si",
    role: "Co-Founder",
    image: "/about/si-founder.png",
    alt: "Si founder illustration",
    blurb:
      "Musician, builder, and lifelong music obsessive shaping the platform architecture, artist discovery, and radio direction.",
    highlights: [
      "Platform Development",
      "Radio Programming",
      "Artist Discovery",
      "Audio Trader Founder"
    ]
  },
  {
    name: "Rich",
    role: "Co-Founder",
    image: "/about/rich-founder.png",
    alt: "Rich founder illustration",
    blurb:
      "Studio owner, promoter, and curator bringing decades of local music community experience into Fully Open Records.",
    highlights: [
      "Studio Owner & DJ",
      "Radio Curator & Promoter",
      "Artist Support & Events",
      "Airtight Studios"
    ]
  }
];

export default function FoundersSection() {
  return (
    <section className="py-24">
      <Container>
        <p className="font-meta text-xs uppercase tracking-[0.34em] text-pink">The Founders</p>
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {founders.map((founder) => (
            <article
              key={founder.name}
              className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.05] backdrop-blur-md"
            >
              <div className="grid gap-0 md:grid-cols-[240px_1fr]">
                <div className="relative min-h-[280px] bg-[radial-gradient(circle_at_50%_40%,rgba(209,74,139,0.22),transparent_55%),linear-gradient(180deg,rgba(10,4,22,0.9),rgba(12,4,24,0.98))]">
                  <Image
                    src={founder.image}
                    alt={founder.alt}
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 100vw, 240px"
                  />
                </div>
                <div className="p-7">
                  <h3 className="text-3xl text-white">{founder.name}</h3>
                  <p className="mt-2 font-meta text-xs uppercase tracking-[0.24em] text-pink">
                    {founder.role}
                  </p>
                  <p className="mt-5 text-sm leading-7 text-fog">{founder.blurb}</p>
                  <ul className="mt-6 space-y-3 text-sm text-white">
                    {founder.highlights.map((highlight) => (
                      <li key={highlight} className="flex items-center gap-3">
                        <span className="h-1.5 w-1.5 rounded-full bg-pink shadow-[0_0_10px_rgba(209,74,139,0.8)]" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
