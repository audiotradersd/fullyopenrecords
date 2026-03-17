import Container from "../layout/Container";
import { Button } from "../ui/button";
import JoinArtistButton from "../auth/JoinArtistButton";
import Link from "next/link";

function Waveform() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1200 220"
      className="absolute inset-x-0 bottom-0 h-40 w-full text-pink/20 md:h-48"
      preserveAspectRatio="none"
    >
      <path
        d="M0 155 C 90 120, 140 120, 220 155 S 360 190, 440 155 S 580 120, 660 155 S 800 190, 880 155 S 1020 120, 1200 155"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        className="animate-[pulse_8s_ease-in-out_infinite]"
      />
      <path
        d="M0 176 C 100 138, 150 138, 230 176 S 370 214, 450 176 S 590 138, 670 176 S 810 214, 890 176 S 1030 138, 1200 176"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className="opacity-60 animate-[pulse_10s_ease-in-out_infinite]"
      />
    </svg>
  );
}

export default function ArtistSignupCTA() {
  return (
    <section className="py-28">
      <Container>
        <div className="relative overflow-hidden rounded-[2rem] border border-pink/20 bg-[radial-gradient(circle_at_top,rgba(209,74,139,0.18),transparent_42%),linear-gradient(180deg,rgba(35,10,50,0.84),rgba(18,8,28,0.96))] px-6 py-20 text-center shadow-[0_28px_70px_rgba(0,0,0,0.35)] backdrop-blur-md md:px-10 md:py-24">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_105%,rgba(209,74,139,0.3),transparent_35%)] opacity-70" />
          <Waveform />
          <div className="relative z-10 mx-auto max-w-3xl">
            <div className="flex items-center justify-center gap-4">
              <span className="h-px w-16 bg-white/15" />
              <p className="font-meta text-xs uppercase tracking-[0.28em] text-pink">Become an Artist</p>
              <span className="h-px w-16 bg-white/15" />
            </div>

            <h2 className="mt-10 text-4xl font-semibold leading-tight text-white md:text-6xl">
              Get Your Music on Fully Open Radio
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-fog md:text-lg">
              Create your artist page, upload tracks, and get played on Fully Open Radio.
            </p>
            <p className="mt-4 text-sm text-fog">
              14,327 independent artists. Experimental sounds. Global community.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <JoinArtistButton className="rounded-full px-8 py-4 h-auto bg-pink-500 hover:bg-pink-600">
                Create Artist Page
              </JoinArtistButton>
              <Link href="/get-heard">
                <Button
                  variant="outline"
                  className="h-auto rounded-full border-white/30 px-8 py-4"
                >
                  Learn More
                </Button>
              </Link>
            </div>

            <p className="mt-8 text-sm text-fog">147 artists on the platform</p>
          </div>
        </div>
      </Container>
    </section>
  );
}
