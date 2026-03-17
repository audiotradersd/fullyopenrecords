import Container from "../layout/Container";

export default function PhilosophyQuote() {
  return (
    <section className="py-24">
      <Container>
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.05] px-8 py-20 text-center backdrop-blur-md">
          <div className="absolute inset-x-0 bottom-0 h-32 bg-[radial-gradient(circle_at_50%_120%,rgba(209,74,139,0.28),transparent_60%)]" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-[linear-gradient(180deg,transparent,rgba(11,5,20,0.85))]" />
          <div className="absolute inset-x-[8%] bottom-0 h-24 bg-[radial-gradient(ellipse_at_bottom,rgba(255,255,255,0.18)_0_1px,transparent_1px)] bg-[length:18px_12px] opacity-25" />

          <div className="relative mx-auto max-w-4xl">
            <p className="text-3xl leading-tight text-white md:text-5xl">
              Great music deserves to be heard
              <br />
              because of <span className="italic text-pink">creativity</span>
              <span className="text-pink"> — </span>
              not algorithms.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
