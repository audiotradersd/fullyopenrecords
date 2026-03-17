import { notFound, redirect } from "next/navigation";
import { normalizeArtistSlug } from "../../lib/artistProfiles";

export const runtime = "edge";

export default async function RootArtistPage({ params }: { params: { slug: string } }) {
  const reserved = new Set([
    "about",
    "account",
    "artists",
    "artist",
    "contact",
    "faq",
    "get-heard",
    "radio",
    "releases",
    "robots.txt",
    "sitemap.xml",
    "store",
    "submit-music",
    "api"
  ]);

  if (reserved.has(params.slug)) {
    notFound();
  }
  redirect(`/artist/${normalizeArtistSlug(params.slug)}`);
}
