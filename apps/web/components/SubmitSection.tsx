import Link from "next/link";
import Container from "./layout/Container";
import { Button } from "./ui/button";

export default function SubmitSection() {
  return (
    <section className="py-20">
      <Container>
        <div className="rounded-3xl border border-pink/20 bg-[linear-gradient(135deg,rgba(58,27,92,0.85),rgba(209,74,139,0.35))] px-6 py-16 text-center shadow-[0_18px_50px_rgba(209,74,139,0.18)] backdrop-blur-xl md:px-10">
          <h2 className="text-3xl font-bold text-white md:text-4xl">Send Us Your Music</h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-fog">
            Fully Open Records exists to support underground artists and experimental sounds.
          </p>
          <div className="mt-8">
            <Link href="/submit-music">
              <Button>Submit Demo</Button>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
