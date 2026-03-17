import Link from "next/link";
import type { Route } from "next";
import Image from "next/image";
import { Panel } from "@fully-open-records/ui";
import StreamButton from "./audio/StreamButton";

export function ArtistCard({ artist }: { artist: Record<string, any> }) {
  const genres = Array.isArray(artist.genres)
    ? artist.genres.filter((entry: unknown): entry is string => typeof entry === "string")
    : [];
  const sampleTrack =
    artist.sampleTrack && typeof artist.sampleTrack === "object"
      ? (artist.sampleTrack as { title?: unknown; audioUrl?: unknown })
      : null;
  const sampleTitle = typeof sampleTrack?.title === "string" ? sampleTrack.title : "";
  const sampleAudioUrl = typeof sampleTrack?.audioUrl === "string" ? sampleTrack.audioUrl : "";
  const artistSlug = String(artist.slug);

  return (
    <Panel className="h-full border-glow/30 bg-white/5 transition-transform duration-300 hover:-translate-y-1 hover:border-rose/40">
      <Link href={`/featured/${artistSlug}` as Route}>
        {typeof artist.image === "string" && artist.image.length > 0 ? (
          <div className="relative mb-5 aspect-[4/5] overflow-hidden rounded-[1.5rem] border border-white/10">
            <Image
              src={artist.image}
              alt={`${String(artist.name)} profile image`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
        ) : null}
        <p className="text-xs uppercase tracking-[0.3em] text-fog">{genres.join(" / ")}</p>
        <h3 className="mt-3 font-display text-2xl text-sand">{String(artist.name)}</h3>
        <p className="mt-3 line-clamp-3 text-sm text-fog">
          {String(artist.shortDescription ?? artist.bio)}
        </p>
      </Link>
      <div className="mt-5 flex flex-wrap gap-2">
        {sampleAudioUrl ? (
          <StreamButton
            audioUrl={sampleAudioUrl}
            label={sampleTitle ? `Play ${sampleTitle}` : "Play Sample"}
            pauseLabel="Pause"
            size="sm"
          />
        ) : null}
        <Link href={`/artist/${artistSlug}` as Route}>
          <span className="inline-flex h-11 items-center rounded-full border border-white/10 px-4 text-xs uppercase tracking-[0.18em] text-fog transition hover:border-pink/40 hover:text-white">
            Artist Page
          </span>
        </Link>
      </div>
    </Panel>
  );
}

export function ProductCard({ product }: { product: Record<string, any> }) {
  const price = typeof product.price === "number" ? product.price : 0;

  return (
    <Link href={`/store/${String(product.slug)}` as Route}>
      <Panel className="h-full border-ember/30 bg-gradient-to-br from-white/10 to-transparent transition-transform duration-300 hover:-translate-y-1 hover:border-rose/40">
        <p className="text-xs uppercase tracking-[0.3em] text-fog">{String(product.category)}</p>
        <h3 className="mt-3 font-display text-2xl text-sand">{String(product.title)}</h3>
        <p className="mt-3 text-sm text-fog">{String(product.description)}</p>
        <p className="mt-5 text-sm font-medium text-rose">£{(price / 100).toFixed(2)}</p>
      </Panel>
    </Link>
  );
}
