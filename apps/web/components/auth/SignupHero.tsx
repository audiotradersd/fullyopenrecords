export default function SignupHero() {
  return (
    <section className="relative overflow-hidden py-20 md:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(209,74,139,0.16),transparent_42%)]" />
      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <p className="font-meta text-xs uppercase tracking-[0.34em] text-pink">Join</p>
        <h1 className="mt-5 text-4xl font-semibold text-white md:text-6xl">
          Join Fully Open Records
        </h1>
        <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-fog md:text-lg">
          Discover underground music, support independent artists, and become part of the Fully Open community.
        </p>
      </div>
    </section>
  );
}
