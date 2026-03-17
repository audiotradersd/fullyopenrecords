import { Check, Disc3, Globe2, Music4, Radio, Sparkles } from "lucide-react";
import Image from "next/image";
import JoinArtistButton from "../../components/auth/JoinArtistButton";
import StreamButton from "../../components/audio/StreamButton";
import Container from "../../components/layout/Container";
import { Button } from "../../components/ui/button";
import { getArtist, getArtistContent } from "../../lib/api";
import { buildArtistFallback, mergeArtistRecordWithLivePreference } from "../../lib/artistProfiles";
import { mergeArtistPageContent } from "../../lib/artistPageContent";

const trustIndicators = [
  "Any genre",
  "Any country",
  "Free artist pages",
  "Radio curated airplay"
];

const features = [
  {
    title: "Get Played on Radio",
    description: "All uploads are eligible for Fully Open Radio's curated 24/7 rotation.",
    icon: Radio,
    cardClass:
      "bg-[radial-gradient(circle_at_top,rgba(255,96,178,0.28),transparent_42%),linear-gradient(180deg,rgba(84,22,90,0.86),rgba(31,10,45,0.94))]"
  },
  {
    title: "Build Your Artist Space",
    description: "Set up your artist page and share your music, videos, releases, artwork and bio.",
    icon: Music4,
    cardClass:
      "bg-[radial-gradient(circle_at_top,rgba(175,119,255,0.26),transparent_42%),linear-gradient(180deg,rgba(65,25,98,0.88),rgba(28,12,47,0.94))]"
  },
  {
    title: "Global Discovery",
    description: "Connect with listeners around the world looking for new open-minded music.",
    icon: Globe2,
    cardClass:
      "bg-[radial-gradient(circle_at_top,rgba(103,255,210,0.2),transparent_42%),linear-gradient(180deg,rgba(34,56,78,0.88),rgba(18,17,42,0.95))]"
  },
  {
    title: "Future Opportunities",
    description: "Artists may be considered for compilations, vinyl releases, live sets, merch and more.",
    icon: Disc3,
    cardClass:
      "bg-[radial-gradient(circle_at_top,rgba(255,160,96,0.24),transparent_42%),linear-gradient(180deg,rgba(92,42,48,0.88),rgba(40,18,31,0.95))]"
  }
];

const radioTracks = [
  {
    artist: "SUPERBITCH",
    title: "07' Honda Odyssey – Don't Touch Me",
    audioUrl: "/api/media/get-heard/superbitch-dont-touch-me.mp3",
    artwork: "/get-heard/superbitch.jpg",
    accent: "from-pink/35 via-rose/20 to-transparent"
  },
  {
    artist: "Raiden",
    title: "Celexa",
    audioUrl: "/api/media/get-heard/raiden-celexa.mp3",
    artwork: "/get-heard/raiden.jpg",
    accent: "from-violet/35 via-pink/15 to-transparent"
  },
  {
    artist: "Muskoka",
    title: "Duet",
    audioUrl: "/api/media/get-heard/muskoka-duet.mp3",
    artwork: "/get-heard/muskoka.webp",
    accent: "from-cyan-300/20 via-violet/20 to-transparent"
  },
  {
    artist: "Bolzenschuss",
    title: "Rot",
    audioUrl: "/api/media/get-heard/bolzenschuss-rot.mp3",
    artwork: "/get-heard/bolzenschuss.jpg",
    accent: "from-rose/30 via-orange-300/10 to-transparent"
  },
  {
    artist: "Indigo Sun",
    title: "Spaced Out Refugee",
    audioUrl: "/api/media/get-heard/indigo-sun-spaced-out-refugee.mp3",
    artwork: "/get-heard/indigo-sun.jpeg",
    accent: "from-fuchsia-300/25 via-pink/20 to-transparent"
  },
  {
    artist: "900 spaces",
    title: "This Beat Mechanical",
    audioUrl: "/api/media/get-heard/900-spaces-this-beat-mechanical.mp3",
    artwork: "/get-heard/900-spaces.png",
    accent: "from-violet/35 via-pink/15 to-transparent"
  }
];

export const runtime = "edge";

export default async function GetHeardPage() {
  const stoneArtist = await getArtist("stone")
    .then((entry) => mergeArtistRecordWithLivePreference(entry))
    .catch(() => buildArtistFallback("stone"));
  const stoneContent = await getArtistContent("stone").catch(() => null);
  const mergedStoneContent = mergeArtistPageContent("stone", stoneArtist ?? {}, stoneContent);
  const stoneHeroImage =
    mergedStoneContent.heroImage ||
    mergedStoneContent.profileImage ||
    (typeof stoneArtist?.image === "string" ? stoneArtist.image : "/artists/stone.webp");
  const featuredBands = [
    { name: "GRZZLY", image: "/artists/grzzly.webp" },
    { name: "Audio Kulture", image: "/artists/audio-kulture.webp" },
    { name: "Stone!?", image: stoneHeroImage }
  ];

  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(209,74,139,0.24),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(242,167,196,0.16),transparent_22%),radial-gradient(circle_at_50%_55%,rgba(106,60,140,0.2),transparent_32%)]" />

      <section className="relative py-20 md:py-24">
        <Container>
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(42,12,56,0.92),rgba(101,22,93,0.76),rgba(19,8,30,0.96))] shadow-[0_28px_70px_rgba(0,0,0,0.38)]">
            <div className="pointer-events-none absolute inset-0 bg-[url('/hero/discover-v3.png')] bg-cover bg-center opacity-25 mix-blend-screen" />
            <div className="relative grid gap-8 px-6 py-10 md:px-10 md:py-12 lg:grid-cols-[1fr_460px] lg:items-start">
              <div className="max-w-xl">
                <p className="font-meta text-xs uppercase tracking-[0.3em] text-pink">Get Heard</p>
                <h1 className="mt-5 text-5xl font-semibold leading-[0.95] text-white md:text-6xl">
                  Get Heard on
                  <br />
                  Fully Open Radio
                </h1>
                <p className="mt-5 max-w-xl text-base leading-7 text-fog">
                  Join Fully Open Records and share your music with an open-minded global audience. Create your
                  artist page, upload your tracks, and make your music eligible for Fully Open Radio, our curated
                  24/7 station dedicated to discovering independent artists.
                </p>
                <p className="mt-4 max-w-xl text-base leading-7 text-fog">
                  Unlike algorithm-driven platforms, our radio is shaped by human curation. Our team listens to
                  new uploads from across the platform and selects tracks that stand out for their originality,
                  energy, and character.
                </p>
                <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs uppercase tracking-[0.18em] text-fog">
                  <Sparkles className="h-4 w-4 text-pink" />
                  New artists welcome
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-2">
                <div className="relative overflow-hidden rounded-[1.5rem] border border-white/10 lg:col-span-2 lg:aspect-[16/9]">
                  <Image src="/artists/grzzly.webp" alt="Featured artist" fill className="object-cover" />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(8,4,16,0.55))]" />
                </div>
                <div className="relative hidden overflow-hidden rounded-[1.5rem] border border-white/10 lg:block lg:aspect-[4/5]">
                  <Image src="/artists/audio-kulture.webp" alt="Audio Kulture" fill className="object-cover" />
                </div>
                <div className="relative hidden overflow-hidden rounded-[1.5rem] border border-white/10 lg:block lg:aspect-[4/5]">
                  <Image src={stoneHeroImage} alt="Featured artist" fill className="object-cover" />
                </div>
              </div>
            </div>

            <div className="relative mx-4 mb-4 rounded-[1.6rem] border border-white/10 bg-[rgba(32,12,44,0.72)] p-6 shadow-[0_18px_42px_rgba(0,0,0,0.32)] backdrop-blur-md md:mx-8 md:mb-8 md:p-8">
              <p className="text-center text-xl leading-8 text-white md:text-[28px] md:leading-10">
                Create your artist page, upload your music, videos and albums,
                <br className="hidden md:block" /> and get your tracks played on our 24/7 curated station, Fully
                <br className="hidden md:block" /> Open Radio.
              </p>

              <div className="mt-7 flex flex-wrap justify-center gap-4">
                <JoinArtistButton className="h-auto rounded-full px-8 py-4">Create Your Artist Page</JoinArtistButton>
                <a href="/artists">
                  <Button variant="outline" className="h-auto rounded-full px-8 py-4">
                    Explore Featured Artists
                  </Button>
                </a>
              </div>

              <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-3 text-xs uppercase tracking-[0.18em] text-fog">
                {trustIndicators.map((item) => (
                  <div key={item} className="inline-flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-pink" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="relative py-12 md:py-16">
        <Container>
          <h2 className="text-center text-3xl font-semibold text-white md:text-4xl">
            Real curation. No algorithms. Full music discovery.
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className={`rounded-[1.4rem] border border-white/10 p-6 shadow-panel backdrop-blur-md transition duration-200 hover:-translate-y-1 hover:border-pink/35 ${feature.cardClass}`}
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-black/15 text-pink shadow-[0_0_24px_rgba(209,74,139,0.16)]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-2xl font-semibold text-white">{feature.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-fog">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="relative py-14 md:py-20">
        <Container>
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-3xl font-semibold text-white md:text-4xl">Recently Played on Fully Open Radio</h2>
            <p className="hidden text-sm text-fog md:block">Our curators listen, algorithms don&apos;t.</p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {radioTracks.map((track, index) => (
              <div
                key={`${track.artist}-${track.title}`}
                className="group overflow-hidden rounded-[1.4rem] border border-white/10 bg-[rgba(26,10,38,0.8)] shadow-panel backdrop-blur-md"
              >
                <div className="relative h-40 overflow-hidden">
                  <Image src={track.artwork} alt={`${track.artist} artwork`} fill className="object-cover" />
                  <div className={`absolute inset-0 bg-gradient-to-br ${track.accent}`} />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,4,16,0.08),rgba(8,4,16,0.78))]" />
                  <div className="absolute left-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-pink/80 text-sm font-semibold text-white">
                    {index + 1}
                  </div>
                </div>
                <div className="p-5">
                  <div className="inline-flex rounded-full border border-pink/30 bg-pink/10 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-white">
                    Featured on Fully Open Radio
                  </div>
                  <p className="mt-4 text-sm font-semibold uppercase tracking-[0.14em] text-white">{track.artist}</p>
                  <p className="mt-2 min-h-[48px] text-sm leading-6 text-fog">{track.title}</p>
                  <div className="mt-4">
                    <StreamButton audioUrl={track.audioUrl} label={`Play ${track.title}`} pauseLabel="Pause" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="relative pb-24 pt-10">
        <Container>
          <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(52,16,72,0.84),rgba(26,10,38,0.96))] shadow-[0_28px_70px_rgba(0,0,0,0.34)]">
            <div className="grid gap-8 px-6 py-8 md:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <h2 className="text-4xl font-semibold text-white md:text-5xl">Ready to share your music?</h2>
                <p className="mt-5 max-w-xl text-base leading-8 text-fog">
                  Create your free artist page and upload your tracks today. Every genre. Every country.
                </p>
                <div className="mt-8">
                  <JoinArtistButton className="h-auto rounded-full px-8 py-4">Create Your Artist Page</JoinArtistButton>
                </div>
                <div className="mt-8 grid gap-3 text-sm text-fog md:grid-cols-2">
                  <div className="space-y-2">
                    <p className="inline-flex items-center gap-2">
                      <Check className="h-4 w-4 text-pink" />
                      Global Artists Welcome
                    </p>
                    <p className="inline-flex items-center gap-2">
                      <Check className="h-4 w-4 text-pink" />
                      Any Genre
                    </p>
                    <p className="inline-flex items-center gap-2">
                      <Check className="h-4 w-4 text-pink" />
                      Curated Radio Airplay
                    </p>
                    <p className="inline-flex items-center gap-2">
                      <Check className="h-4 w-4 text-pink" />
                      Free Artist Pages
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {featuredBands.map((band) => (
                  <div key={band.name} className="overflow-hidden rounded-[1.4rem] border border-white/10 bg-white/[0.04]">
                    <div className="relative aspect-[4/5]">
                      <Image src={band.image} alt={band.name} fill className="object-cover" />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(8,4,16,0.82))]" />
                    </div>
                    <div className="p-4">
                      <p className="text-sm font-semibold text-white">{band.name}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-fog">Curated Radio Airplay</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
