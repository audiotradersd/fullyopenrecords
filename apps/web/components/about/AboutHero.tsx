import Image from "next/image";
import Container from "../layout/Container";

export default function AboutHero() {
  return (
    <section className="py-24">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="max-w-2xl">
            <p className="font-meta text-xs uppercase tracking-[0.34em] text-pink">About</p>
            <h1 className="mt-4 text-5xl text-white md:text-6xl">Fully Open Records</h1>
            <p className="mt-3 font-display text-2xl italic text-pink md:text-3xl">
              Music Without Algorithms
            </p>
            <p className="mt-8 max-w-xl text-lg leading-8 text-fog">
              An independent label and 24/7 radio platform supporting underground artists and
              open-minded listeners worldwide.
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-[460px]">
            <div className="absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_50%_45%,rgba(209,74,139,0.34),transparent_35%),radial-gradient(circle_at_28%_18%,rgba(124,72,255,0.24),transparent_28%),radial-gradient(circle_at_72%_80%,rgba(255,255,255,0.08),transparent_24%)] blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-md">
              <div className="relative mx-auto aspect-square max-w-[360px] rounded-full border border-white/10 bg-[radial-gradient(circle_at_50%_50%,rgba(40,20,62,0.18)_0_24%,rgba(6,4,14,0.98)_25%_100%)] shadow-[0_0_60px_rgba(209,74,139,0.2)]">
                <div className="absolute inset-[9%] rounded-full border border-pink/30" />
                <div className="absolute inset-[18%] rounded-full border border-white/10" />
                <div className="absolute inset-[27%] rounded-full border border-pink/20" />
                <div className="absolute inset-[44%] rounded-full bg-[radial-gradient(circle_at_50%_50%,#ff89ca_0%,#d14a8b_38%,#401436_100%)] shadow-[0_0_30px_rgba(209,74,139,0.45)]" />
                <div className="absolute bottom-[10%] right-[2%] h-28 w-28 rounded-full border border-white/10 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.2),transparent_18%),linear-gradient(135deg,rgba(15,6,33,0.96),rgba(31,10,46,0.92))]" />
                <div className="absolute bottom-[21%] right-[18%] h-[2px] w-[32%] -rotate-[18deg] rounded-full bg-gradient-to-r from-fog/10 via-pink to-fog/10 shadow-[0_0_18px_rgba(209,74,139,0.4)]" />
                <div className="absolute bottom-[19%] right-[45%] h-4 w-4 rounded-full bg-white shadow-[0_0_14px_rgba(255,255,255,0.65)]" />
              </div>
              <div className="pointer-events-none absolute inset-x-12 bottom-5 h-20 rounded-full bg-[radial-gradient(circle,rgba(209,74,139,0.24),transparent_70%)] blur-2xl" />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
