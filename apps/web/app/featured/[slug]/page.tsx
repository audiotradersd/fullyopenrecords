import { notFound } from "next/navigation";
import ArtistPageContent from "../../../components/artists/ArtistPageContent";
import { getArtist } from "../../../lib/api";
import {
  buildArtistFallback,
  getEditorialArtistProfile,
  mergeArtistRecordForFeaturedPage
} from "../../../lib/artistProfiles";


export default async function FeaturedArtistPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const editorialProfile = getEditorialArtistProfile(slug);
  const artist = await getArtist(slug)
    .then((entry) => mergeArtistRecordForFeaturedPage(entry))
    .catch(() => buildArtistFallback(slug));

  if (!artist && !editorialProfile) {
    notFound();
  }

  return <ArtistPageContent artist={artist ?? buildArtistFallback(slug)!} />;
}
