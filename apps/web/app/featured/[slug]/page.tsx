import { notFound } from "next/navigation";
import ArtistPageContent from "../../../components/artists/ArtistPageContent";
import { getArtist } from "../../../lib/api";
import {
  buildArtistFallback,
  getEditorialArtistProfile,
  mergeArtistRecordForFeaturedPage
} from "../../../lib/artistProfiles";

export const runtime = "edge";

export default async function FeaturedArtistPage({ params }: { params: { slug: string } }) {
  const editorialProfile = getEditorialArtistProfile(params.slug);
  const artist = await getArtist(params.slug)
    .then((entry) => mergeArtistRecordForFeaturedPage(entry))
    .catch(() => buildArtistFallback(params.slug));

  if (!artist && !editorialProfile) {
    notFound();
  }

  return <ArtistPageContent artist={artist ?? buildArtistFallback(params.slug)!} />;
}
