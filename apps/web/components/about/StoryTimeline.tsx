import Container from "../layout/Container";

const timeline = [
  {
    year: "2019",
    title: "Conversations at Airtight Studios",
    description:
      "Studio sessions and long conversations around music, discovery, and shared values started shaping the idea."
  },
  {
    year: "2023",
    title: "Fully Open Records launches",
    description:
      "The label and 24/7 radio station go live as a home for artists working beyond the usual limits."
  },
  {
    year: "Today",
    title: "Artists From Around The World",
    description:
      "The platform continues growing as a global community for artists, listeners, and curated discovery."
  }
];

export default function StoryTimeline() {
  return (
    <section className="py-24">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="font-meta text-xs uppercase tracking-[0.34em] text-pink">Our Story</p>
            <h2 className="mt-4 text-4xl text-white md:text-5xl">How It Started</h2>
          </div>

          <div className="relative rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-7 backdrop-blur-md">
            <div className="absolute bottom-8 right-8 h-24 w-40 rounded-full bg-[radial-gradient(circle,rgba(209,74,139,0.22),transparent_70%)] blur-2xl" />
            <div className="absolute left-[19px] top-10 bottom-10 w-px bg-gradient-to-b from-pink/70 via-white/20 to-transparent" />

            <div className="space-y-9">
              {timeline.map((item) => (
                <div key={item.year} className="relative pl-10">
                  <div className="absolute left-0 top-2 flex h-10 w-10 items-center justify-center">
                    <span className="absolute h-4 w-4 rounded-full bg-pink shadow-[0_0_16px_rgba(209,74,139,0.9)]" />
                    <span className="absolute h-8 w-8 rounded-full border border-pink/25" />
                  </div>
                  <p className="font-meta text-xs uppercase tracking-[0.28em] text-pink">{item.year}</p>
                  <h3 className="mt-3 text-2xl text-white">{item.title}</h3>
                  <p className="mt-3 max-w-xl text-sm leading-7 text-fog">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
