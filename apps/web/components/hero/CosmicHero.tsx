"use client";

import Container from "../layout/Container";
import { Spotlight } from "../ui/spotlight";

export default function CosmicHero() {
  return (
    <section className="relative w-full overflow-hidden bg-[#0F0621] py-24">
      <Spotlight className="left-0 top-24" fill="#A12C6A" />
      <Spotlight className="left-[28rem] top-8" fill="#D14A8B" />
      <Spotlight className="right-0 top-20" fill="#6A3C8C" />

      <Container>
        <div className="relative z-10 flex items-center justify-center">
          <div className="max-w-3xl px-6 text-center">
            <h1 className="mb-6 text-5xl font-bold text-white md:text-6xl">
              Music For The Open Minded
            </h1>
            <p className="text-lg leading-8 text-neutral-300">
              Fully Open Records is an independent label and radio platform
              supporting underground artists, experimental sounds and music
              that does not fit the algorithm.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
