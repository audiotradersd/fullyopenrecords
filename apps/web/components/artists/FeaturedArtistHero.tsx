import Image from "next/image";
import StreamButton from "../audio/StreamButton";

type HeroArtist = {
  slug: string;
  name: string;
  backgroundImage: string;
  foregroundImage: string;
};

type HeroTrack = {
  title: string;
  audioUrl?: string | null;
};

type FeaturedArtistHeroProps = {
  artist: HeroArtist;
  badge: string;
  genres: string[];
  description: string;
  editorialNote: string;
  featuredTrack: HeroTrack | null;
  releaseTrack: HeroTrack | null;
  releaseTitle: string;
};

export default function FeaturedArtistHero({
  artist,
  badge,
  genres,
  description,
  editorialNote,
  featuredTrack,
  releaseTrack,
  releaseTitle
}: FeaturedArtistHeroProps) {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-[0_20px_60px_rgba(0,0,0,0.32)] backdrop-blur-md">
      <div className="absolute inset-0">
        {artist.backgroundImage ? (
          <Image
            src={artist.backgroundImage}
            alt={`${artist.name} featured image`}
            fill
            className="object-cover"
            priority
            unoptimized
          />
        ) : null}
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(6,3,15,0.86),rgba(20,8,30,0.7)_45%,rgba(73,14,73,0.46))]" />
      </div>
      <div className="relative grid gap-8 p-6 md:p-8 lg:grid-cols-[minmax(280px,0.95fr)_minmax(0,1.05fr)] lg:p-10">
        <div className="relative min-h-[260px] overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.04]">
          {artist.foregroundImage ? (
            <Image
              src={artist.foregroundImage}
              alt={`${artist.name} feature artwork`}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 44vw"
              unoptimized
            />
          ) : null}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(8,4,16,0.3))]" />
        </div>

        <div className="flex flex-col justify-center">
          <p className="font-meta text-xs uppercase tracking-[0.3em] text-pink">Featured Artist</p>
          <div className="mt-4 inline-flex w-fit rounded-full border border-pink/30 bg-pink/10 px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-white">
            {badge}
          </div>
          <h1 className="mt-6 text-4xl font-semibold text-white md:text-5xl">{artist.name}</h1>
          <p className="mt-4 text-sm uppercase tracking-[0.18em] text-fog md:text-base">
            {genres.join(" / ")}
          </p>
          <p className="mt-6 max-w-3xl text-base leading-8 text-white/90 md:text-lg">
            {description}
          </p>
          <p className="mt-5 max-w-3xl text-sm leading-7 text-fog md:text-base">
            {editorialNote}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {featuredTrack?.audioUrl ? (
              <StreamButton
                audioUrl={featuredTrack.audioUrl}
                label={`Play ${featuredTrack.title}`}
                pauseLabel="Pause"
              />
            ) : null}
            {releaseTrack?.audioUrl ? (
              <StreamButton
                audioUrl={releaseTrack.audioUrl}
                label={`Listen to ${releaseTitle}`}
                pauseLabel="Pause"
              />
            ) : null}
            <a
              href={`/artist/${artist.slug}`}
              className="inline-flex h-11 items-center justify-center rounded-xl border border-white/15 bg-white/[0.03] px-5 text-sm font-medium text-white transition duration-200 hover:-translate-y-0.5 hover:border-pink/40 hover:bg-white/[0.08]"
            >
              Visit Artist Page
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
