import Image from "next/image";
import { CalendarDays, ExternalLink, Globe2, MapPin, Music4, Newspaper, PlayCircle, Video } from "lucide-react";
import StreamButton from "../audio/StreamButton";
import ArtistGallery from "./ArtistGallery";
import ArtistHeroActions from "./ArtistHeroActions";
import type { ArtistPageContentModel } from "../../lib/artistPageContent";

type ArtistRecord = Record<string, unknown>;

function formatDate(value?: string | null) {
  if (!value) return "No date";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric"
  }).format(date);
}

function formatDuration(value?: string | null) {
  return value || "Live";
}

function getSocialLinks(artist: ArtistRecord) {
  if (!artist.socialLinks || typeof artist.socialLinks !== "object") {
    return [];
  }

  return Object.entries(artist.socialLinks as Record<string, unknown>).filter(
    ([, href]) => typeof href === "string" && href.length > 0
  ) as Array<[string, string]>;
}

export default function PublicArtistPage({
  artist,
  content,
  slug
}: {
  artist: ArtistRecord;
  content: ArtistPageContentModel;
  slug: string;
}) {
  const name = String(artist.name ?? slug);
  const genres = Array.isArray(artist.genres)
    ? artist.genres.filter((entry): entry is string => typeof entry === "string")
    : [];
  const location = typeof artist.location === "string" ? artist.location : "";
  const bio = typeof artist.bio === "string" ? artist.bio : content.shortBio ?? "";
  const heroImage = content.heroImage || (typeof artist.image === "string" ? artist.image : "");
  const profileImage = content.profileImage || (typeof artist.image === "string" ? artist.image : "");
  const socialLinks = getSocialLinks(artist);
  const artistUrl = `https://fullyopenrecords.com/artist/${slug}`;
  const plan = typeof artist.plan === "string" ? artist.plan : "free";
  const visibleTracks = content.tracks;

  return (
    <main>
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0">
          {heroImage ? (
            <Image src={heroImage} alt={`${name} hero image`} fill className="object-cover" priority unoptimized />
          ) : null}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.38),rgba(0,0,0,0.72)_45%,rgba(30,13,58,0.52)_100%)]" />
        </div>
        <div className="relative mx-auto max-w-6xl px-6 py-24 md:py-32">
          <div className="max-w-3xl">
            <p className="font-meta text-xs uppercase tracking-[0.3em] text-pink">Artist</p>
            <h1 className="mt-5 text-5xl font-semibold text-white md:text-7xl">{name}</h1>
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-fog md:text-base">
              {genres.length ? <span>{genres.join(" / ")}</span> : null}
              {location ? (
                <span className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-pink" />
                  {location}
                </span>
              ) : null}
            </div>
            <div className="mt-5 inline-flex rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-xs uppercase tracking-[0.18em] text-fog">
              {artistUrl}
            </div>
            <div className="mt-8">
              <ArtistHeroActions url={artistUrl} name={name} />
            </div>
            {socialLinks.length ? (
              <div className="mt-8 flex flex-wrap gap-3">
                {socialLinks.map(([label, href]) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-11 items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 text-sm text-white transition duration-200 hover:border-pink/40 hover:bg-white/[0.08]"
                  >
                    <Globe2 className="h-4 w-4 text-pink" />
                    {label}
                  </a>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-start">
            <div className="relative aspect-square overflow-hidden rounded-2xl border border-white/10 bg-white/5">
              {profileImage ? (
                <Image src={profileImage} alt={`${name} profile image`} fill className="object-cover" unoptimized />
              ) : null}
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-8 backdrop-blur-md">
              <p className="font-meta text-xs uppercase tracking-[0.24em] text-pink">Bio</p>
              <p className="mt-5 max-w-3xl text-base leading-8 text-fog md:text-lg">
                {content.shortBio || bio}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 pt-0">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
          <div className="space-y-8">
            <section id="albums" className="rounded-xl border border-white/10 bg-white/5 p-8 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <Music4 className="h-5 w-5 text-pink" />
                <h2 className="text-2xl font-semibold text-white">Albums</h2>
              </div>
              <div className="mt-6 space-y-6">
                {content.albums.length ? (
                  content.albums.map((album) => (
                    <div key={`${album.title}-${album.releaseDate}`} className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
                      <div className="grid gap-5 md:grid-cols-[120px_minmax(0,1fr)]">
                        <div className="relative aspect-square overflow-hidden rounded-xl border border-white/10 bg-white/[0.04]">
                          {album.coverArt ? (
                            <Image src={album.coverArt} alt={`${album.title} cover`} fill className="object-cover" unoptimized />
                          ) : null}
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-white">{album.title}</h3>
                          <p className="mt-1 text-sm text-fog">Released {formatDate(album.releaseDate)}</p>
                          {album.description ? <p className="mt-3 text-sm leading-7 text-fog">{album.description}</p> : null}
                          {album.tracks.length ? (
                            <div className="mt-4 space-y-2">
                              {album.tracks.map((track) => (
                                <div
                                  key={`${album.title}-${track.title}`}
                                  className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3"
                                >
                                  <div>
                                    <p className="text-sm text-white">{track.title}</p>
                                    {track.duration ? <p className="text-xs text-fog">{track.duration}</p> : null}
                                  </div>
                                  {track.audioUrl ? (
                                    <StreamButton
                                      audioUrl={track.audioUrl}
                                      label="Play"
                                      pauseLabel="Pause"
                                      size="sm"
                                    />
                                  ) : (
                                    <PlayCircle className="h-5 w-5 text-pink" />
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-fog">No albums added yet.</p>
                )}
              </div>
            </section>

            <section id="tracks" className="rounded-xl border border-white/10 bg-white/5 p-8 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <PlayCircle className="h-5 w-5 text-pink" />
                <h2 className="text-2xl font-semibold text-white">Tracks</h2>
              </div>
              <div className="mt-6 space-y-3">
                {visibleTracks.length ? (
                  visibleTracks.map((track, index) => (
                    <div
                      key={`${track.title}-${track.releaseDate}`}
                      className="grid gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-4 md:grid-cols-[auto_minmax(0,1fr)_120px_72px]"
                    >
                      <div>
                        {track.audioUrl && (plan !== "free" || index < 5) ? (
                          <StreamButton
                            audioUrl={track.audioUrl}
                            label="Play"
                            pauseLabel="Pause"
                            size="sm"
                          />
                        ) : (
                          <div className="inline-flex h-9 items-center justify-center rounded-xl border border-white/10 px-3 text-xs uppercase tracking-[0.18em] text-fog">
                            {track.audioUrl ? "Track" : "Track"}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-white">{track.title}</p>
                        {track.description ? <p className="mt-1 truncate text-sm text-fog">{track.description}</p> : null}
                      </div>
                      <p className="text-sm text-fog">{formatDate(track.releaseDate)}</p>
                      <p className="text-sm text-fog">{formatDuration(track.duration)}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-fog">No standalone tracks added yet.</p>
                )}
              </div>
              {plan === "free" && content.tracks.length > 5 ? (
                <p className="mt-4 text-sm text-fog">Free artist pages show all enabled tracks, but only the first 5 are playable.</p>
              ) : null}
            </section>
          </div>

          <aside className="space-y-8">
            <section className="rounded-xl border border-white/10 bg-white/5 p-8 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <Newspaper className="h-5 w-5 text-pink" />
                <h2 className="text-2xl font-semibold text-white">Press / Features</h2>
              </div>
              <div className="mt-6 space-y-4">
                {content.press.length ? (
                  content.press.map((item) => (
                    <div key={`${item.publication}-${item.title}`} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                      <p className="text-sm font-semibold text-white">{item.publication}</p>
                      <p className="mt-2 text-base text-white">{item.title}</p>
                      <p className="mt-2 text-sm text-fog">{formatDate(item.date)}</p>
                      {item.excerpt ? <p className="mt-3 text-sm leading-7 text-fog">{item.excerpt}</p> : null}
                      {item.articleLink ? (
                        <a
                          href={item.articleLink}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-4 inline-flex items-center gap-2 text-sm text-pink"
                        >
                          Read article
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      ) : null}
                    </div>
                  ))
                ) : (
                  <p className="text-fog">No press features yet.</p>
                )}
              </div>
            </section>

            <section className="rounded-xl border border-white/10 bg-white/5 p-8 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <CalendarDays className="h-5 w-5 text-pink" />
                <h2 className="text-2xl font-semibold text-white">Upcoming Shows</h2>
              </div>
              <div className="mt-6 space-y-4">
                {content.gigs.length ? (
                  content.gigs.map((gig) => (
                    <div key={`${gig.title}-${gig.eventDate}`} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                      <p className="text-sm text-fog">{gig.city || "TBA"}</p>
                      <p className="mt-1 text-lg font-semibold text-white">{gig.venue || gig.title}</p>
                      <p className="mt-2 text-sm text-pink">{formatDate(gig.eventDate)}</p>
                      <p className="mt-2 text-sm text-fog">{gig.title}</p>
                      {gig.ticketUrl ? (
                        <a
                          href={gig.ticketUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-4 inline-flex items-center gap-2 text-sm text-pink"
                        >
                          Tickets
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      ) : null}
                    </div>
                  ))
                ) : (
                  <p className="text-fog">No shows announced yet.</p>
                )}
              </div>
            </section>
          </aside>
        </div>
      </section>

      <section className="py-20 pt-0">
        <div className="mx-auto max-w-6xl px-6">
          <div className="rounded-xl border border-white/10 bg-white/5 p-8 backdrop-blur-md">
            <h2 className="text-2xl font-semibold text-white">Photos</h2>
            <div className="mt-6">
              {content.photos.length ? <ArtistGallery photos={content.photos} /> : <p className="text-fog">No photos uploaded yet.</p>}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 pt-0">
        <div className="mx-auto max-w-6xl px-6">
          <div className="rounded-xl border border-white/10 bg-white/5 p-8 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <Video className="h-5 w-5 text-pink" />
              <h2 className="text-2xl font-semibold text-white">Video</h2>
            </div>
            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              {content.videos.length ? (
                content.videos.map((video) => (
                  <div key={video.title} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-white/10 bg-white/[0.04]">
                      {video.thumbnailUrl ? (
                        <Image src={video.thumbnailUrl} alt={video.title} fill className="object-cover" unoptimized />
                      ) : null}
                    </div>
                    <p className="mt-4 text-lg font-semibold text-white">{video.title}</p>
                    {video.description ? <p className="mt-2 text-sm leading-7 text-fog">{video.description}</p> : null}
                    {video.videoUrl ? (
                      <a
                        href={video.videoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 inline-flex items-center gap-2 text-sm text-pink"
                      >
                        Watch video
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    ) : null}
                  </div>
                ))
              ) : (
                <p className="text-fog">No videos added yet.</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
