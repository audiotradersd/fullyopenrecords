import Link from "next/link";
import type { Route } from "next";
import Container from "./layout/Container";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

export default function FeaturedRelease() {
  return (
    <section className="py-20">
      <Container>
        <Card className="grid items-center gap-8 rounded-3xl p-6 md:grid-cols-[1.05fr_0.95fr] md:p-8">
          <div className="cosmic-artwork aspect-square rounded-2xl" aria-label="Featured release artwork" />
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-fog">Featured Release</p>
            <h2 className="mt-4 text-4xl font-bold text-white md:text-5xl">GRZZLY</h2>
            <p className="mt-2 text-2xl text-white">How 2 Have Fun and Stay Alive</p>
            <p className="mt-5 max-w-lg text-base leading-7 text-fog">
              An immersive cinematic ambient album built from evolving textures, atmospheric synths, and carefully crafted sound design.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={"/radio" as Route}>
                <Button>Listen</Button>
              </Link>
              <Link href={"/releases/how-2-have-fun-and-stay-alive" as Route}>
                <Button variant="outline">View Release</Button>
              </Link>
            </div>
          </div>
        </Card>
      </Container>
    </section>
  );
}
