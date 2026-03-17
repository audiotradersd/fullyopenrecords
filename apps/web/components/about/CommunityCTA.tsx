import Link from "next/link";
import type { Route } from "next";
import Container from "../layout/Container";
import { Button } from "../ui/button";

export default function CommunityCTA() {
  return (
    <section className="py-24">
      <Container>
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.05] px-8 py-12 backdrop-blur-md">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(209,74,139,0.14),transparent_30%),radial-gradient(circle_at_80%_70%,rgba(132,78,255,0.12),transparent_35%)]" />
          <div className="absolute inset-x-8 bottom-7 flex items-end gap-1 opacity-35">
            {Array.from({ length: 42 }).map((_, index) => (
              <span
                key={index}
                className="block flex-1 rounded-full bg-gradient-to-t from-pink/10 to-pink/80"
                style={{ height: `${18 + ((index * 17) % 56)}px` }}
              />
            ))}
          </div>

          <div className="relative mx-auto max-w-3xl text-center">
            <p className="font-meta text-xs uppercase tracking-[0.34em] text-pink">Community</p>
            <h2 className="mt-4 text-4xl text-white md:text-5xl">Join The Community</h2>
            <p className="mt-5 text-base leading-8 text-fog md:text-lg">
              Together, Si and Rich continue to build Fully Open Records as a space where artists
              from anywhere in the world can share their music and listeners can discover sounds
              beyond the usual algorithms.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href={"/radio" as Route}>
                <Button>Listen Live</Button>
              </Link>
              <Link href={"/get-heard" as Route}>
                <Button variant="outline">Get Heard</Button>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
