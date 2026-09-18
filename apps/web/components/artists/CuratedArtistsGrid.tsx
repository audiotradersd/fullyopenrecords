import { ArtistCard } from "../Cards";

export default function CuratedArtistsGrid({ artists }: { artists: Array<Record<string, unknown>> }) {
  return <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{artists.map((artist) => <ArtistCard key={String(artist.id ?? artist.slug)} artist={artist} />)}</div>;
}
