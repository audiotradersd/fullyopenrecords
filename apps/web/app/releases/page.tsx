import Image from "next/image";
import Link from "next/link";
import { Radio, PlayCircle } from "lucide-react";
import StreamButton from "../../components/audio/StreamButton";
import Container from "../../components/layout/Container";
import { Button } from "../../components/ui/button";
import { getArtist, getArtistContent } from "../../lib/api";
import {
  buildArtistFallback,
  mergeArtistRecordWithLivePreference
} from "../../lib/artistProfiles";
import { mergeArtistPageContent } from "../../lib/artistPageContent";
import { pageMetadata } from "../../lib/seo";

export const metadata = pageMetadata({ title: "New Independent Music Releases", description: "Explore new releases from Fully Open artists, with independent music from every corner of the catalogue.", path: "/releases" });

const jackIssuesTracks = [
  ["Nail It", "01 - LANDR-NAIL - 30082026, 15.51-Warm-Medium.mp3"],
  ["Kodiak", "02 - LANDR-Kodiak - 30082026, 16.03-Warm-Medium.mp3"],
  ["Intermingle", "03 - LANDR-Mngle - 30082026, 16.23-Warm-Medium.mp3"],
  ["Fun Bus", "04 - LANDR-Bus - 30082026, 16.50-Warm-Medium.mp3"],
  ["Jack Issues", "05 - LANDR-Jack - 30082026, 16.55-Warm-Medium.mp3"],
  ["Break the Duck", "06 - LANDR-Duck - 30082026, 16.59-Warm-Medium.mp3"],
  ["Rob References", "07 - LANDR-Rob Ref - 30082026, 17.03-Warm-Medium.mp3"],
  ["Verbal", "08 - LANDR-Verbal - 30082026, 17.05-Warm-Medium.mp3"],
  ["Dead Leg", "09 - LANDR-Leg - 30082026, 17.13-Warm-Medium.mp3"],
  ["Frock", "10 - LANDR-Frock - 30082026, 17.26-Warm-Medium.mp3"]
];

const otherReleases = [
  {
    artist: "Violet Piper",
    title: "Inside Baseball",
    image: "/latest-releases/violet-piper.jpeg",
    audioUrl: "/api/media/latest-releases/violet-piper-inside-baseball.mp3", href: ""
  },
  {
    artist: "Troll Mother",
    title: "Forest Child",
    image: "/latest-releases/troll-mother.jpg",
    audioUrl: "/api/media/latest-releases/troll-mother-forest-child.mp3", href: ""
  },
];

function normalizeTitle(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function formatReleaseDate(value?: string | null) {
  if (!value) return "30 March 2026";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(date);
}

export default async function ReleasesPage() {
  const artist = await getArtist("stone")
    .then((entry) => mergeArtistRecordWithLivePreference(entry))
    .catch(() => buildArtistFallback("stone"));

  const content = await getArtistContent("stone").catch(() => null);
  const mergedContent = mergeArtistPageContent("stone", artist ?? {}, content);

  const jackIssuesAlbum =
    mergedContent.albums.find((album) => normalizeTitle(album.title) === "jack issues") ??
    mergedContent.albums[0] ??
    null;

  const tracklist = jackIssuesTracks.map(([title, fileName], index) => ({
    number: index + 1,
    title,
    audioUrl: `/releases/jack-issues/${encodeURIComponent(fileName)}`
  }));

  const featuredSingle =
    tracklist.find((track) => normalizeTitle(track.title) === "verbal") ??
    tracklist.find((track) => normalizeTitle(track.title) === "nail it") ??
    tracklist.find((track) => normalizeTitle(track.title) === "intermingle") ??
    null;

  const heroImage = "/artists/grzzly.webp";

  return (
    <main className="pb-24 pt-12">
      <Container>
        <div className="max-w-3xl">
          <p className="font-meta text-xs uppercase tracking-[0.35em] text-fog">Releases</p>
          <h1 className="mt-4 text-5xl text-white">Latest Releases</h1>
        </div>

        <section className="relative mt-12 overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(56,18,70,0.92),rgba(27,10,39,0.96))] shadow-[0_28px_70px_rgba(0,0,0,0.38)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_22%_30%,rgba(209,74,139,0.22),transparent_28%),radial-gradient(circle_at_82%_18%,rgba(242,167,196,0.12),transparent_20%)]" />
          <div className="grid gap-8 px-6 py-8 md:px-10 md:py-10 lg:grid-cols-[420px_minmax(0,1fr)] lg:items-center">
            <div className="relative mx-auto w-full max-w-[420px]">
              <div className="absolute inset-6 rounded-[2rem] bg-pink/25 blur-[60px]" />
              <div className="relative aspect-square overflow-hidden rounded-[2rem] border border-white/10 bg-black/20 shadow-[0_24px_60px_rgba(0,0,0,0.32)]">
                <Image
                  src={heroImage}
                  alt="How 2 Have Fun and Stay Alive cover"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 420px"
                  unoptimized
                  priority
                />
              </div>
            </div>

            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-pink/30 bg-pink/10 px-4 py-2 font-meta text-[11px] uppercase tracking-[0.22em] text-white">
                  Coming 30 March 2026
                </span>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 font-meta text-[11px] uppercase tracking-[0.22em] text-fog">
                  FOR001 — Fully Open Records Release
                </span>
              </div>

              <p className="mt-8 text-sm uppercase tracking-[0.18em] text-fog">GRZZLY</p>
              <h2 className="mt-3 text-5xl font-semibold text-white md:text-6xl">How 2 Have Fun and Stay Alive</h2>
              <p className="mt-6 max-w-xl text-lg leading-8 text-fog">
                An immersive cinematic ambient album built from evolving textures, atmospheric synths and carefully crafted sound design.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/releases/how-2-have-fun-and-stay-alive"><Button>View Release</Button></Link>
              </div>

              <p className="mt-8 text-sm text-fog">A Fully Open Records featured release.</p>
            </div>
          </div>
        </section>

        {false && <><section
          id="tracklist"
          className="mt-12 rounded-[1.6rem] border border-white/10 bg-white/[0.04] p-6 shadow-panel backdrop-blur-md md:p-8"
        >
          <div className="flex items-center gap-3">
            <PlayCircle className="h-5 w-5 text-pink" />
            <h2 className="text-2xl font-semibold text-white">Tracklist</h2>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {tracklist.map((track) => (
              <div
                key={track.number}
                className="group grid items-center gap-4 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-4 transition duration-200 hover:-translate-y-0.5 hover:border-pink/30 hover:bg-white/[0.05] md:grid-cols-[32px_minmax(0,1fr)_auto]"
              >
                <p className="font-meta text-xs uppercase tracking-[0.18em] text-fog">{track.number}</p>
                <p className="text-base text-white">{track.title}</p>
                <div className="justify-self-start md:justify-self-end">
                  {track.audioUrl ? (
                    <StreamButton audioUrl={track.audioUrl} label="Play" pauseLabel="Pause" size="sm" />
                  ) : (
                    <div className="inline-flex h-9 items-center rounded-xl border border-white/10 px-3 text-[11px] uppercase tracking-[0.18em] text-fog">
                      Track
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)]">
          <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-md">
            <p className="font-meta text-xs uppercase tracking-[0.22em] text-pink">About the Release</p>
            <h2 className="mt-4 text-3xl font-semibold text-white">About the Release</h2>
            <div className="mt-6 space-y-5 text-base leading-8 text-fog">
              <p>
                Jack Issues is the debut album from groove metal trio Stone!?, delivering thick guitar tones, pounding drums and bass lines that hit like concrete.
              </p>
              <p>
                The record leans into groove over flash — every track designed to lock into a riff and grind forward.
              </p>
              {jackIssuesAlbum?.description ? <p>{jackIssuesAlbum.description}</p> : null}
            </div>
          </div>

          <div className="rounded-[1.6rem] border border-white/10 bg-[linear-gradient(180deg,rgba(58,27,92,0.42),rgba(18,8,28,0.78))] p-8 backdrop-blur-md">
            <div className="flex items-center gap-3 text-pink">
              <Radio className="h-5 w-5" />
              <p className="font-meta text-xs uppercase tracking-[0.22em] text-pink">Featured on Fully Open Radio</p>
            </div>
            <h2 className="mt-4 text-3xl font-semibold text-white">Hear it on Fully Open Radio</h2>
            <p className="mt-5 text-base leading-8 text-fog">
              Hear tracks from Jack Issues on the Fully Open Radio 24/7 stream.
            </p>
            <div className="mt-8">
              <Link href="/radio">
                <Button>Listen Live</Button>
              </Link>
            </div>
          </div>
        </section></>}

        <section className="mt-12">
          <div className="mb-8 flex items-end justify-between gap-4">
            <h2 className="text-3xl font-semibold text-white md:text-4xl">Other Releases</h2>
            <Link href="/" className="font-meta text-xs uppercase tracking-[0.22em] text-fog">
              Back Home
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[
              ...otherReleases,
                {
                  artist: "Stone!?",
                  title: "Jack Issues",
                  image: "/artists/stone-new-logo.png",
                  audioUrl: "",
                  href: "/releases/jack-issues"
                }
              ].map((release) => (
              <div
                key={`${release.artist}-${release.title}`}
                className="group rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-md transition duration-200 hover:scale-[1.03] hover:border-pink/40"
              >
                <div className="relative aspect-square overflow-hidden rounded-xl border border-white/10">
                  <Image
                    src={release.image}
                    alt={`${release.artist} artwork`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    unoptimized
                  />
                </div>
                <div className="px-1 pb-1 pt-4">
                  <p className="text-sm font-semibold text-white">{release.artist}</p>
                  <p className="mt-1 text-sm text-fog">{release.title}</p>
                  <div className="mt-4">{release.href ? <Link href={release.href}><Button variant="outline">View Release</Button></Link> : <StreamButton audioUrl={release.audioUrl} label={`Play ${release.title}`} pauseLabel="Pause" size="sm" />}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </Container>
    </main>
  );
}
