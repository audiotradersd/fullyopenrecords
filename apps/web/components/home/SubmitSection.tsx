import Link from "next/link";
import Container from "../layout/Container";
import { Button } from "../ui/button";

export default function SubmitSection() {
  return (
    <section className="py-20">
      <Container>
        <div className="rounded-xl border border-pink/20 bg-[linear-gradient(135deg,rgba(58,27,92,0.72),rgba(161,44,106,0.28),rgba(18,8,28,0.92))] px-6 py-14 text-center shadow-[0_20px_50px_rgba(0,0,0,0.28)] backdrop-blur md:px-10">
          <p className="font-meta text-xs uppercase tracking-[0.28em] text-fog">Get Heard</p>
          <h2 className="mt-4 text-3xl font-semibold text-white md:text-4xl">Get Your Music Heard</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-fog">
            Create your artist page, upload music, and make your tracks eligible for curated airplay on Fully Open Radio.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/get-heard">
              <Button>Get Heard</Button>
            </Link>
            <Link href="/artist/dashboard">
              <Button variant="outline">Join Community</Button>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
