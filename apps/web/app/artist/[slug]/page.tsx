import { notFound, redirect } from "next/navigation";
import PublicArtistPage from "../../../components/artists/PublicArtistPage";
import { getArtist, getArtistContent } from "../../../lib/api";
import {
  buildArtistFallback,
  mergeArtistRecordWithLivePreference,
  normalizeArtistSlug
} from "../../../lib/artistProfiles";
import { mergeArtistPageContent } from "../../../lib/artistPageContent";

export const runtime = "edge";

export default async function ArtistPage({ params }: { params: { slug: string } }) {
  const canonicalSlug = normalizeArtistSlug(params.slug);

  if (canonicalSlug && canonicalSlug !== params.slug) {
    redirect(`/artist/${canonicalSlug}`);
  }

  const artist = await getArtist(canonicalSlug)
    .then((entry) => mergeArtistRecordWithLivePreference(entry))
    .catch(() => buildArtistFallback(canonicalSlug));

  if (!artist) {
    notFound();
  }

  const content = await getArtistContent(canonicalSlug).catch(() => null);
  const mergedContent = mergeArtistPageContent(canonicalSlug, artist, content);

  return <PublicArtistPage artist={artist} content={mergedContent} slug={canonicalSlug} />;
}
