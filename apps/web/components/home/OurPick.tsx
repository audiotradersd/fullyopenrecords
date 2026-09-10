import Image from "next/image";
import Link from "next/link";
import Container from "../layout/Container";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import StreamButton from "../audio/StreamButton";

type Pick = { artistName: string; title: string; image: string; writeup: string; reason: string; href: string; audioUrl: string | null };

export default function OurPick({ pick }: { pick: Pick | null }) {
  return (
    <section className="py-24">
      <Container>
        <div className="mb-8">
          <h2 className="text-3xl font-semibold text-white md:text-4xl">Our Pick</h2>
        </div>
        {pick ? (
          <Card className="overflow-hidden rounded-xl border border-white/10 bg-[#020817]/95 backdrop-blur-md">
            <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
              <div className="border-b border-white/10 p-5 md:border-b-0 md:border-r md:p-6">
                <p className="font-meta text-xs uppercase tracking-[0.28em] text-fog">Track</p>
                <h3 className="mt-2 text-3xl font-semibold text-white md:text-4xl">{pick.title}</h3>
                <p className="mt-1 text-xl text-fog">{pick.artistName}</p>
                <div className="mt-5 overflow-hidden rounded-xl border border-white/10">
                  {pick.image ? <div className="relative aspect-square"><Image src={pick.image} alt={`${pick.artistName} artwork`} fill className="object-cover" unoptimized /></div> : <div className="cosmic-artwork aspect-square" />}
                </div>
                <div className="mt-5">{pick.audioUrl ? <StreamButton audioUrl={pick.audioUrl} label="Play Track" pauseLabel="Pause Track" size="sm" /> : <span className="text-xs uppercase tracking-[0.16em] text-fog">Audio unavailable</span>}</div>
              </div>
              <div className="flex flex-col bg-[radial-gradient(circle_at_82%_38%,rgba(112,35,116,0.28),transparent_58%),linear-gradient(115deg,rgba(2,8,23,0.96),rgba(20,10,34,0.92))]">
                <div className="border-b border-white/10 p-5 md:p-6">
                  <p className="font-meta text-xs uppercase tracking-[0.28em] text-sky-300">Why Si Picked It</p>
                  {pick.reason ? <p className="mt-4 max-w-prose text-base leading-7 text-fog">“{pick.reason}”</p> : null}
                  <p className="mt-4 text-base italic text-white">— Si</p>
                </div>
                <div className="relative min-h-48 overflow-hidden p-5 md:min-h-56 md:p-6">
                  <div className="relative z-10 max-w-[62%]">
                    <p className="font-meta text-xs uppercase tracking-[0.28em] text-sky-300">About the Artist</p>
                    {pick.writeup ? <p className="mt-4 text-base leading-7 text-fog">{pick.writeup}</p> : null}
                    {pick.href ? <Link href={pick.href} className="mt-4 inline-block"><Button variant="outline" size="sm">View Artist Page →</Button></Link> : null}
                  </div>
                  <div className="pointer-events-none absolute bottom-0 right-0 h-48 w-40 md:h-56 md:w-48">
                    <Image
                      src="/about/si-portrait.png"
                      alt="Si"
                      fill
                      className="object-contain object-bottom"
                      style={{
                        maskImage: "linear-gradient(to right, transparent 0%, black 28%), linear-gradient(to bottom, transparent 0%, black 28%, black 86%, transparent 100%)",
                        maskComposite: "intersect",
                        WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 28%), linear-gradient(to bottom, transparent 0%, black 28%, black 86%, transparent 100%)",
                        WebkitMaskComposite: "source-in"
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ) : <p className="text-sm text-fog">The next selection is being chosen.</p>}
      </Container>
    </section>
  );
}
