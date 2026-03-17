import { Section } from "@fully-open-records/ui";
import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import StreamButton from "../audio/StreamButton";

export default function ArtistPageContent({ artist }: { artist: Record<string, unknown> }) {
  const genres = Array.isArray(artist.genres)
    ? artist.genres.filter((entry): entry is string => typeof entry === "string")
    : [];
  const socialLinks =
    artist.socialLinks && typeof artist.socialLinks === "object"
      ? Object.entries(artist.socialLinks as Record<string, unknown>).filter(
          ([, value]) => typeof value === "string" && value.length > 0
        )
      : [];
  const slug = typeof artist.slug === "string" ? artist.slug : "";
  const sampleTrack =
    artist.sampleTrack && typeof artist.sampleTrack === "object"
      ? (artist.sampleTrack as { title?: unknown; audioUrl?: unknown })
      : null;
  const sampleTitle = typeof sampleTrack?.title === "string" ? sampleTrack.title : "";
  const sampleAudioUrl = typeof sampleTrack?.audioUrl === "string" ? sampleTrack.audioUrl : "";
  const featuredNote = typeof artist.featuredNote === "string" ? artist.featuredNote : "";

  return (
    <Section className="grid gap-8 md:grid-cols-[1.1fr_0.9fr]">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-ember">{genres.join(" / ")}</p>
        <h1 className="mt-4 font-display text-5xl">{String(artist.name)}</h1>
        <p className="mt-6 text-lg text-fog">{String(artist.bio)}</p>
        {featuredNote ? (
          <div className="mt-6 rounded-2xl border border-pink/20 bg-pink/[0.06] p-5">
            <p className="text-xs uppercase tracking-[0.3em] text-pink">Why Chosen</p>
            <p className="mt-3 text-base leading-7 text-white">{featuredNote}</p>
          </div>
        ) : null}
        <div className="mt-6 flex flex-wrap gap-3">
          {sampleAudioUrl ? (
            <StreamButton
              audioUrl={sampleAudioUrl}
              label={sampleTitle ? `Play ${sampleTitle}` : "Play Sample"}
              pauseLabel="Pause"
            />
          ) : null}
          {slug ? (
            <Link href={`/artist/${slug}` as Route}>
              <span className="inline-flex h-11 items-center rounded-full border border-white/10 px-4 text-xs uppercase tracking-[0.18em] text-fog transition hover:border-pink/40 hover:text-white">
                View Artist Page
              </span>
            </Link>
          ) : null}
        </div>
      </div>
      <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
        {typeof artist.image === "string" && artist.image.length > 0 ? (
          <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] border border-white/10">
            <Image
              src={artist.image}
              alt={`${String(artist.name)} profile image`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 40vw"
            />
          </div>
        ) : null}
        <div className="mt-5">
          <p className="text-xs uppercase tracking-[0.3em] text-fog">Artist profile</p>
          <p className="mt-3 text-base text-white">
            {String(artist.shortDescription ?? artist.bio)}
          </p>
          {typeof artist.location === "string" && artist.location.length > 0 ? (
            <p className="mt-3 text-sm text-fog">{artist.location}</p>
          ) : null}
          {socialLinks.length ? (
            <div className="mt-5 flex flex-wrap gap-2">
              {socialLinks.map(([label, href]) => (
                <a
                  key={label}
                  href={String(href)}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-white/10 px-3 py-2 text-xs uppercase tracking-[0.18em] text-fog transition hover:border-pink/40 hover:text-white"
                >
                  {label}
                </a>
              ))}
            </div>
          ) : null}
        </div>
        {String(artist.embeddedPlayer ?? "").trim() ? (
          <div>
            <p className="mt-6 text-sm text-fog">Embedded player</p>
            <div
              className="mt-4 text-sm text-fog"
              dangerouslySetInnerHTML={{ __html: String(artist.embeddedPlayer ?? "") }}
            />
          </div>
        ) : null}
      </div>
    </Section>
  );
}
